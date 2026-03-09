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
import { App, Avatar, Pagination, Skeleton, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props
  const lang = className?.match(/language-(\w+)/)?.[1] || ''

  if (typeof children !== 'string') return null
  if (lang === 'mermaid') {
    const MERMAID_CONFIG = { theme: 'base' } as const
    return <Mermaid config={MERMAID_CONFIG}>{children}</Mermaid>
  }
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>
}

const TableSkeleton = (): React.JSX.Element => <Skeleton.Node active style={{ width: 160 }} />

export default function Chat(): React.JSX.Element {
  const { t } = useTranslation('chat')
  const { message: appMessage } = App.useApp()
  const { id: chatId } = useParams()
  const { username, avatarPath, setProfile } = useUserStore()
  const { promptsSuggestion, enabledAssistantId, getOssBaseUrl } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const { models } = useModelStore()
  const {
    chats,
    chatsUI,
    fullMessages,
    parentId,
    setChats,
    setMessages,
    setMessagesFromFull,
    setFullMessages,
    setParentId,
    setChatPrompts,
    sendMessage,
    stopSendMessage
  } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const [senderValue, setSenderValue] = useState('')
  const [editingId, setEditingId] = useState('')

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (!isStreaming) {
          const messagesRes = await listMessages(chatId!)
          console.log('messagesRes', messagesRes)
          setFullMessages(messagesRes.data)
          setParentId(messagesRes.data[messagesRes.data.length - 1].id)

          if (messagesRes.data.length >= 2 && !chats?.find((chat) => chat.id === chatId)?.title) {
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
  }, [chatId, isStreaming, promptsSuggestion])

  useEffect(() => {
    const load = async (): Promise<void> => {
      setSenderValue('')
    }
    load()
  }, [chatId])

  useEffect(() => {
    if (fullMessages && fullMessages.length) {
      setMessagesFromFull(fullMessages)
    }
  }, [parentId])

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
            editable: item.id === editingId,
            onEditCancel: () => {
              setEditingId('')
            },
            onEditConfirm: (value) => {
              setEditingId('')
              if (!value.trim()) {
                appMessage.warning(t('messageRequired'))
                return
              }
              const index = messages.findIndex((m) => m.id === item.id)
              setMessages(messages?.slice(0, index) ?? [])
              sendMessage(chatId!, {
                parentId: item.parentId ?? undefined,
                content: value
              })
            },
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
                    ...((fullMessages?.filter((m) => m.parentId === item.parentId).length ?? 0) > 1
                      ? [
                          {
                            key: 'pagination',
                            actionRender: () => (
                              <Pagination
                                size="small"
                                className="select-none"
                                simple={{ readOnly: true }}
                                current={
                                  (fullMessages
                                    ?.filter((m) => m.parentId === item.parentId)
                                    .findIndex((m) => m.id === item.id) ?? 0) + 1
                                }
                                onChange={(page) => {
                                  let current = fullMessages?.filter(
                                    (x) => x.parentId === item.parentId
                                  )[page - 1]

                                  while (true) {
                                    const child = fullMessages?.find(
                                      (m) => m.parentId === current?.id
                                    )
                                    if (!child) break
                                    current = child
                                  }

                                  setParentId(current?.id ?? null)
                                }}
                                total={
                                  fullMessages?.filter((m) => m.parentId === item.parentId).length
                                }
                                pageSize={1}
                              />
                            )
                          }
                        ]
                      : []),
                    {
                      key: 'edit',
                      icon: <EditOutlined />,
                      label: t('edit')
                    }
                  ]}
                  onClick={({ key }) => setEditingId(key === 'edit' ? item.id : '')}
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
          scroll:
            'pt-12 pb-36 w-full px-12 md:max-w-2xl md:px-0 md:mx-auto lg:max-w-3xl xl:max-w-4xl scrollbar-none ease-in-out duration-500',
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
            await sendMessage(chatId!, { parentId: parentId ?? undefined, content: senderValue })
            // TODO 输出完毕信号
          }}
          onCancel={async () => {
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
