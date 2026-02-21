import {
  AntDesignOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Actions, Bubble, BubbleListProps, Sender } from '@ant-design/x'
import { listMessages, sendMessage } from '@renderer/api/front/chat'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { SendMessageFrontRequest } from '@renderer/types/api/chat'
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
  const { chatId } = useParams()
  const { username } = useUserStore()
  const { messages, setMessages, setParentId } = useChatStore()
  const { baseUrl } = useSettingsStore()
  const location = useLocation()
  const { firstMessage } = location.state || {}
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const useSSE = (url: string, body: SendMessageFrontRequest): [string, boolean] => {
    const [content, setContent] = useState('')
    const [done, setDone] = useState(true)

    useEffect(() => {
      if (!body) return

      const abortController = new AbortController()

      const start = async (): Promise<void> => {
        setContent('')
        setDone(false)

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: abortController.signal
        })

        const reader = res.body?.getReader()
        const decoder = new TextDecoder('utf-8')

        if (!reader) return

        while (true) {
          const { value, done: readerDone } = await reader.read()
          if (readerDone) break

          const chunk = decoder.decode(value, { stream: true })

          // 解析 data:
          const lines = chunk.split('\n')
          lines.forEach((line) => {
            if (line.startsWith('data:')) {
              const text = line.replace('data:', '').trim()
              setContent((prev) => prev + text)
            }
          })
        }

        setDone(true)
      }

      start()

      return () => {
        abortController.abort()
      }
    }, [url, body])

    return [content, done] as const
  }

  const handleSendMessage = async (message: string): Promise<void> => {
    try {
      const [content, done] = useSSE(baseUrl + `/front/chats/${chatId}/messages`, {
        content: message
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (!chatId) {
          throw new Error('No chatId')
        }
        const messagesRes = await listMessages(chatId)
        setMessages(messagesRes.data)
        if (messages?.length == 0 && firstMessage) {
          handleSendMessage(firstMessage)
        }
      } catch (e) {
        console.error(e)
      }
    }

    load()
  }, [chatId])

  const mappedMessages =
    messages?.map((item) => ({
      key: item.id,
      role: item.type,
      content: item.content
    })) ?? []

  const update = (key: string | number, editable: any) => {}

  const role: BubbleListProps['role'] = {
    ASSISTANT: {
      typing: false,
      header: 'ASSISTANT',
      variant: 'borderless',
      avatar: () => <Avatar icon={<AntDesignOutlined />} />,
      footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />
    },
    ASSISTANT_NEW: {
      typing: true,
      header: 'ASSISTANT',
      variant: 'borderless',
      avatar: () => <Avatar icon={<AntDesignOutlined />} />,
      footer: (content) => (
        <Actions items={actionItems} onClick={() => console.log(content)} fadeInLeft />
      )
    },
    USER: (data) => ({
      placement: 'end',
      typing: false,
      header: username,
      shape: 'round',
      avatar: () => <Avatar icon={<UserOutlined />} />,
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
        <Bubble content={content} streaming={!done} typing={false} />
        <Bubble.List role={role} items={mappedMessages} autoScroll={false} />
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-160">
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          value={message}
          loading={loading}
          onSubmit={() => handleSendMessage(message)}
        />
      </div>
    </div>
  )
}
