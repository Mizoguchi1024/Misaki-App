import { EditOutlined, HeartOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons'
import {
  Actions,
  Bubble,
  BubbleListProps,
  CodeHighlighter,
  Mermaid,
  Prompts,
  Sender
} from '@ant-design/x'
import XMarkdown, { ComponentProps } from '@ant-design/x-markdown'
import Latex from '@ant-design/x-markdown/plugins/latex'
import { createChatTitle, listChats, listMessages, listPrompts } from '@renderer/api/front/chat'
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

const MERMAID_CONFIG = { theme: 'base' } as const
const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props
  const lang = className?.match(/language-(\w+)/)?.[1] || ''

  if (typeof children !== 'string') return null
  if (lang === 'mermaid') {
    return <Mermaid config={MERMAID_CONFIG}>{children}</Mermaid>
  }
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>
}

const TableSkeleton = (): React.JSX.Element => <Skeleton.Node active style={{ width: 160 }} />

export default function Chat(): React.JSX.Element {
  const { t } = useTranslation('chat')
  const { id: chatId } = useParams()
  const { username, avatarPath, setProfile } = useUserStore()
  const { promptsSuggestion, enabledAssistantId, getOssBaseUrl } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const { models } = useModelStore()
  const {
    chats,
    chatsUI,
    parentId,
    setChats,
    setMessages,
    setFullMessages,
    setParentId,
    setChatPrompts,
    sendMessage,
    stopSendMessage
  } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const [senderValue, setSenderValue] = useState('')

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setSenderValue('')
        if (!isStreaming) {
          const messagesRes = await listMessages(chatId!)
          setParentId(messagesRes.data[messagesRes.data.length - 1].id)
          setFullMessages(messagesRes.data)
          setMessages(messagesRes.data)

          if (!chats?.find((chat) => chat.id === chatId)?.title) {
            await createChatTitle(chatId!)
          }
          const chatRes = await listChats()
          setChats(chatRes.data)

          if (promptsSuggestion && parentId && !chatsUI[chatId!]?.prompts?.length) {
            const promptsRes = await listPrompts(chatId!, {
              parentId: messagesRes.data[messagesRes.data.length - 1].id,
              size: 2
            })
            setChatPrompts(chatId!, promptsRes.data)
          }
          const profileRes = await getProfile()
          setProfile(profileRes.data)
        } else {
          setChatPrompts(chatId!, [])
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
      )
    },
    USER: () => ({
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
      )
    })
  }

  return (
    <div className="relative h-full">
      <Bubble.List
        role={role}
        items={
          messages?.map((item, index, array) => ({
            key: item.id,
            role: item.type,
            content: item.content,
            footer: () =>
              item.type === 'ASSISTANT' ? (
                index === array.length - 1 && isStreaming ? null : (
                  <Actions
                    fadeInLeft={index === array.length - 1}
                    items={[
                      {
                        key: 'retry',
                        icon: <RedoOutlined />,
                        label: t('retry'),
                        onItemClick: () => {
                          // TODO
                        }
                      },
                      {
                        key: 'copy',
                        actionRender: () => {
                          return <Actions.Copy text={item.content} />
                        }
                      }
                    ]}
                  />
                )
              ) : (
                <Actions
                  items={[
                    {
                      key: 'edit',
                      icon: <EditOutlined />,
                      label: t('edit')
                    }
                  ]}
                  onClick={({ key }) => console.log(key)}
                />
              ),
            contentRender: (content: string) => (
              <Typography>
                <XMarkdown
                  content={content}
                  config={{ extensions: Latex() }}
                  components={{ code: Code, 'incomplete-table': TableSkeleton }}
                  streaming={{ hasNextChunk: isStreaming, enableAnimation: true }}
                  dompurifyConfig={{ ADD_ATTR: ['icon', 'description'] }}
                  openLinksInNewTab
                />
              </Typography>
            )
          })) ?? []
        }
        className="h-full w-full mask-b-from-84% table-style"
        classNames={{
          scroll: 'pt-12 pb-36 w-full px-12 lg:max-w-4xl lg:mx-auto lg:px-0 scrollbar-none',
          avatar: 'select-none',
          header: 'select-none'
        }}
      />
      <div className="absolute bottom-1/12 left-1/2 -translate-x-1/2 max-w-md md:max-w-xl">
        {promptsSuggestion && (
          <Prompts
            key={parentId}
            items={chatsUI[chatId!]?.prompts?.map((prompt) => ({
              key: prompt,
              description: prompt
            }))}
            onItemClick={(info) => {
              setSenderValue(info.data.description?.toString() ?? '')
            }}
            fadeInLeft
            className="mb-2 mask-r-from-90%"
            classNames={{
              item: 'bg-white/70 dark:bg-white/20 border-none select-none'
            }}
          />
        )}
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
