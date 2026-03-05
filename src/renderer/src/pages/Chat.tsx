import {
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  HeartOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Actions, Bubble, BubbleListProps, Sender } from '@ant-design/x'
import { createChatTitle, listChats, listMessages } from '@renderer/api/front/chat'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useChatStore } from '@renderer/store/chatStore'
import { useModelStore } from '@renderer/store/modelStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { SendMessageFrontRequest } from '@renderer/types/chat'
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry'
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy'
  }
]

export default function Chat(): React.JSX.Element {
  const { id: chatId } = useParams()
  const { jwt, username, avatarPath } = useUserStore()
  const { enabledAssistantId, getApiBaseUrl, getOssBaseUrl } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const { models } = useModelStore()
  const { chats, messages, setChats, setMessages, setFullMessages, setParentId } = useChatStore()
  const location = useLocation()
  const { firstMessage } = location.state || {}
  const [loading, setLoading] = useState(false)
  const [userContent, setUserContent] = useState<string | null>(null)
  const [assistantContent, setAssistantContent] = useState<string | null>(null)

  const handleSendMessage = async (message: string): Promise<void> => {
    try {
      setLoading(true)
      setUserContent(message)
      const parentId = useChatStore.getState().parentId
      // const tools = await window.api.listMcpTools()
      const data: SendMessageFrontRequest = {
        content: message,
        parentId: parentId ?? undefined
        // tools
      }

      const response = await fetch(`${getApiBaseUrl()}/front/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
          'X-Timestamp': Date.now().toString(),
          'X-Nonce': crypto.randomUUID()
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Response body is empty')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()

          if (!trimmed) continue
          if (!trimmed.startsWith('data:')) continue

          const content = trimmed.replace(/^data:\s*/, '')
          if (content === '[DONE]') return
          console.log(content)
          setAssistantContent((x) => x + content)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const messagesRes = await listMessages(chatId!)
        setMessages(messagesRes.data)
        if (messagesRes.data.length == 0 && firstMessage) {
          setParentId(null)
          await handleSendMessage(firstMessage)
          if (!chats?.find((chat) => chat.id === chatId)?.title) {
            await createChatTitle(chatId!)
            const chatsRes = await listChats()
            setChats(chatsRes.data)
          }
          const newMessagesRes = await listMessages(chatId!)
          setMessages(newMessagesRes.data)
          setUserContent(null)
          setAssistantContent(null)
        }
      } catch {
        return
      }
    }

    load()
  }, [chatId])

  const update = (key: string | number, editable: any) => {}

  const role: BubbleListProps['role'] = {
    ASSISTANT: {
      typing: false,
      header: 'ASSISTANT',
      variant: 'borderless',
      avatar: () => (
        <Avatar
          draggable={false}
          src={
            models?.find(
              (model) =>
                model.id ===
                assistants?.find((assistant) => assistant.id === enabledAssistantId)?.modelId
            )?.avatarPath
              ? models?.find(
                  (model) =>
                    model.id ===
                    assistants?.find((assistant) => assistant.id === enabledAssistantId)?.modelId
                )?.avatarPath
              : null
          }
          icon={
            models?.find(
              (model) =>
                model.id ===
                assistants?.find((assistant) => assistant.id === enabledAssistantId)?.modelId
            )?.avatarPath ? null : (
              <HeartOutlined />
            )
          }
        />
      ),
      footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />
    },
    USER: (data) => ({
      placement: 'end',
      typing: false,
      header: username,
      shape: 'round',
      avatar: () => (
        <Avatar
          draggable={false}
          src={avatarPath ? getOssBaseUrl() + avatarPath : null}
          icon={avatarPath ? null : <UserOutlined />}
        />
      ),
      footer: () => (
        <Actions
          items={[
            data.editable
              ? { key: 'done', icon: <CheckOutlined />, label: 'done' }
              : {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'edit'
                }
          ]}
          onClick={({ key }) => update(data.key, { editable: key === 'edit' })}
        />
      ),
      onEditConfirm: (content) => {
        console.log(`editing User-${data.key}: `, content)
        update(data.key, { content, editable: false })
      },
      onEditCancel: () => {
        update(data.key, { editable: false })
      }
    })
  }

  return (
    <div className="relative h-full">
      <div className="max-h-full px-12 pb-40 overflow-y-auto">
        <Bubble.List
          role={role}
          items={
            messages?.map((item) => ({
              key: item.id,
              role: item.type,
              content: item.content
            })) ?? []
          }
          autoScroll={false}
        />
        {userContent && <Bubble role="user" content={userContent}></Bubble>}
        {assistantContent && <Bubble role="ai" content={assistantContent}></Bubble>}
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-160">
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          loading={loading}
          onSubmit={async (value) => {
            await handleSendMessage(value)
            const messagesRes = await listMessages(chatId!)
            setMessages(messagesRes.data)
            setUserContent(null)
            setAssistantContent(null)
          }}
        />
      </div>
    </div>
  )
}
