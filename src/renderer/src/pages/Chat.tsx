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
import { Avatar } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  const { username, avatarPath } = useUserStore()
  const { enabledAssistantId, getOssBaseUrl } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const { models } = useModelStore()
  const { setMessages, setFullMessages, setParentId, sendMessage, stopSendMessage } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const [senderValue, setSenderValue] = useState('')

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (!isStreaming) {
          const messagesRes = await listMessages(chatId!)
          setMessages(messagesRes.data)
        }
      } catch {
        return
      }
    }

    load()
  }, [chatId, isStreaming])

  const update = (key: string | number, editable: any) => {}

  const role: BubbleListProps['role'] = {
    ASSISTANT: {
      typing: false,
      header:
        assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki',
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
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-160">
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          loading={isStreaming}
          value={senderValue}
          onChange={(value) => {
            setSenderValue(value)
          }}
          onSubmit={async () => {
            setSenderValue('')
            await sendMessage(chatId!, { content: senderValue })
            setTimeout(async () => {
              const messagesRes = await listMessages(chatId!)
              setMessages(messagesRes.data)
            }, 1000)
          }}
          onCancel={() => {
            stopSendMessage()
          }}
        />
      </div>
    </div>
  )
}
