import {
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  HeartOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Actions, Bubble, BubbleListProps, CodeHighlighter, Sender } from '@ant-design/x'
import XMarkdown, { ComponentProps } from '@ant-design/x-markdown'
import Latex from '@ant-design/x-markdown/plugins/latex'
import { createChatTitle, listChats, listMessages } from '@renderer/api/front/chat'
import { getProfile } from '@renderer/api/front/user'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useChatStore } from '@renderer/store/chatStore'
import { useModelStore } from '@renderer/store/modelStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { Avatar, Skeleton, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props
  const lang = className?.match(/language-(\w+)/)?.[1] || ''

  if (typeof children !== 'string') return null
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>
}

const TableSkeleton = (): React.JSX.Element => <Skeleton.Node active style={{ width: 160 }} />

export default function Chat(): React.JSX.Element {
  const { t } = useTranslation('chat')
  const { id: chatId } = useParams()
  const { username, avatarPath, setProfile } = useUserStore()
  const { enabledAssistantId, getOssBaseUrl } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const { models } = useModelStore()
  const {
    chats,
    setChats,
    setMessages,
    setFullMessages,
    setParentId,
    sendMessage,
    stopSendMessage
  } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const [senderValue, setSenderValue] = useState('')

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (!isStreaming) {
          const messagesRes = await listMessages(chatId!)
          setParentId(messagesRes.data[messagesRes.data.length - 1].id)
          setFullMessages(messagesRes.data)
          setMessages(messagesRes.data)

          if (!chats?.find((chat) => chat.id === chatId)?.title) {
            await createChatTitle(chatId!)
            const chatRes = await listChats()
            setChats(chatRes.data)
          }

          const profileRes = await getProfile()
          setProfile(profileRes.data)
        }
      } catch {
        return
      }
    }

    load()
  }, [chatId, isStreaming])

  const update = (key: string | number, editable: any): void => {}

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
              ? getOssBaseUrl() +
                models?.find(
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
      footer: (content) => (
        <Actions
          items={[
            {
              key: 'retry',
              icon: <RedoOutlined />,
              label: t('retry')
            },
            {
              key: 'copy',
              icon: <CopyOutlined />,
              label: t('copy')
            }
          ]}
          onClick={() => console.log(content)}
        />
      )
    },
    USER: (data) => ({
      placement: 'end',
      typing: false,
      header: username,
      shape: 'default',
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
                  label: t('edit')
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
      <Bubble.List
        role={role}
        items={
          messages?.map((item) => ({
            key: item.id,
            role: item.type,
            content: item.content,
            contentRender: (content: string) => (
              <Typography>
                <XMarkdown
                  content={content}
                  config={{ extensions: Latex() }}
                  components={{ code: Code, 'incomplete-table': TableSkeleton }}
                  streaming={{ hasNextChunk: isStreaming, enableAnimation: true }}
                  openLinksInNewTab
                />
              </Typography>
            )
          })) ?? []
        }
        className="h-full mask-b-from-84%"
        classNames={{
          scroll: 'px-12 pt-6 pb-24 w-10',
          avatar: 'select-none',
          header: 'select-none'
        }}
      />
      <div className="absolute bottom-1/12 left-1/2 -translate-x-1/2 w-4/7">
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          loading={isStreaming}
          placeholder={t('chatWithMe')}
          value={senderValue}
          onChange={(value) => {
            setSenderValue(value)
          }}
          onSubmit={async () => {
            setSenderValue('')
            await sendMessage(chatId!, { content: senderValue })
          }}
          onCancel={() => {
            stopSendMessage()
          }}
        />
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none">
        {t('answerMayNotBeAccurate', {
          name:
            assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'
        })}
      </span>
    </div>
  )
}
