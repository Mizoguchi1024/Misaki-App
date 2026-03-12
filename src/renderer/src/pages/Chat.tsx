import {
  CloseOutlined,
  EditOutlined,
  HeartOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
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
import { CodeMap, useChatStore } from '@renderer/store/chatStore'
import { useMcpStore } from '@renderer/store/mcpStore'
import { useModelStore } from '@renderer/store/modelStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { App, Avatar, Dropdown, Pagination, Skeleton, Space, Typography } from 'antd'
import { motion, useAnimation } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMeasure } from 'react-use'

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
  const navigate = useNavigate()
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
    prefix,
    setChats,
    setMessages,
    setMessagesFromFull,
    setFullMessages,
    setParentId,
    setChatPrompts,
    sendMessage,
    stopSendMessage,
    setPrefix
  } = useChatStore()
  const messages = useChatStore((state) => state.messages)
  const isStreaming = useChatStore((state) => state.isStreaming)
  const { mcpEnabled, servers, enabledServers, setMcpEnabled } = useMcpStore()
  const [senderValue, setSenderValue] = useState('')
  const [editingId, setEditingId] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)
  const controls = useAnimation()
  const [dragging, setDragging] = useState(false)
  const [senderAreaRef, { height }] = useMeasure<HTMLDivElement>()

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        if (!isStreaming) {
          const messagesRes = await listMessages(chatId!)
          setFullMessages(messagesRes.data)
          setParentId(messagesRes.data[messagesRes.data.length - 1].id)

          if (messagesRes.data.length >= 2 && !chats?.find((chat) => chat.id === chatId)?.title) {
            await createChatTitle(chatId!)
          }
          const chatRes = await listChats()
          setChats(chatRes.data)

          if (promptsSuggestion && parentId && !chatsUI[chatId!]?.prompts?.length) {
            controls.start({
              x: 0,
              y: 0
            })
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
      controls.start({
        x: 0,
        y: 0
      })
    }
    load()
  }, [chatId])

  useEffect(() => {
    if (fullMessages && fullMessages.length) {
      setMessagesFromFull(fullMessages)
    }
  }, [parentId])

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const container = containerRef.current
    const track = trackRef.current

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.target.clientWidth)
        } else if (entry.target === track) {
          setTrackWidth(entry.target.clientWidth)
        }
      }
    })

    observer.observe(container)
    observer.observe(track)

    setContainerWidth(container.clientWidth)
    setTrackWidth(track.clientWidth)

    return () => observer.disconnect()
  }, [])

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
        autoScroll
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
                          const userMessage = messages?.find((m) => m.id === item.parentId)
                          const index = messages.findIndex((m) => m.id === userMessage?.id)
                          setMessages(messages?.slice(0, index) ?? [])
                          if (!userMessage?.content) return
                          sendMessage(chatId!, {
                            parentId: userMessage.parentId ?? undefined,
                            content: userMessage.content
                          })
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
            'pt-12 w-full px-12 md:max-w-2xl md:px-0 md:mx-auto lg:max-w-3xl xl:max-w-4xl scrollbar-none scroll-smooth ease-in-out duration-250',
          avatar: 'select-none',
          header: 'select-none'
        }}
        styles={{ scroll: { paddingBottom: height } }}
      />
      <div
        ref={senderAreaRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-xl ease-in-out duration-500"
      >
        {promptsSuggestion && (
          <div ref={containerRef} className="w-full overflow-hidden">
            <motion.div
              drag="x"
              onDragStart={() => setDragging(true)}
              onDragEnd={() => setTimeout(() => setDragging(false), 0)}
              animate={controls}
              dragConstraints={{
                left: containerWidth - trackWidth,
                right: 0
              }}
              dragTransition={{
                power: 0.1,
                timeConstant: 100
              }}
              ref={trackRef}
              className="w-max"
            >
              <Prompts
                key={parentId}
                fadeInLeft
                items={chatsUI[chatId!]?.prompts?.map((prompt) => ({
                  key: prompt,
                  description: prompt
                }))}
                onItemClick={(info) => {
                  if (dragging) return
                  setSenderValue(info.data.description?.toString() ?? '')
                }}
                className="mb-2 max-w-none w-max"
                classNames={{
                  list: 'w-max',
                  item: 'py-2 active:scale-96 bg-white/70 dark:bg-white/20 border-none backdrop-blur-sm select-none transition-all ease-in-out duration-100'
                }}
              />
            </motion.div>
          </div>
        )}
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          loading={isStreaming}
          placeholder={t('chatWithMe')}
          value={senderValue}
          footer={(_, info) => {
            const { SendButton, LoadingButton, ClearButton } = info.components
            return (
              <div className="flex justify-between">
                <Space>
                  <Sender.Switch>{t('think')}</Sender.Switch>
                  <Dropdown
                    placement="top"
                    menu={{
                      selectable: true,
                      selectedKeys: [prefix],
                      items: [
                        { key: '```java', label: 'Java' },
                        { key: '```python', label: 'Python' },
                        { key: '```cpp', label: 'C++' },
                        { key: '```typescript', label: 'TypeScript' },
                        { key: '```javascript', label: 'JavaScript' }
                      ],
                      onSelect: ({ key }) => {
                        setPrefix(key)
                        if (mcpEnabled) {
                          setMcpEnabled(false)
                          appMessage.info(t('codeOrMcp'))
                        }
                      }
                    }}
                    classNames={{
                      item: 'my-1'
                    }}
                  >
                    <Sender.Switch
                      value={prefix ? true : false}
                      onChange={() => {
                        setPrefix('')
                      }}
                      checkedChildren={<span>{CodeMap[prefix]}</span>}
                      unCheckedChildren={<span>{t('code')}</span>}
                    />
                  </Dropdown>
                  <Dropdown
                    placement="top"
                    menu={{
                      selectedKeys: enabledServers,
                      items: servers?.map((item) => ({
                        key: item.name,
                        label: item.name
                      })) ?? [{ key: 'none', label: t('none') }],
                      onClick: () => {
                        navigate('/mcp', { viewTransition: true })
                      }
                    }}
                    classNames={{
                      item: 'my-1'
                    }}
                  >
                    <Sender.Switch
                      value={mcpEnabled}
                      onChange={(checked) => {
                        setMcpEnabled(checked)
                        if (checked && prefix) {
                          setPrefix('')
                          appMessage.info(t('codeOrMcp'))
                        }
                      }}
                      checkedChildren={<span>MCP - {enabledServers.length}</span>}
                      unCheckedChildren={<span>MCP</span>}
                    />
                  </Dropdown>
                </Space>
                <Space size="small">
                  {senderValue && <ClearButton icon={<CloseOutlined />} shape="circle" />}
                  {isStreaming ? <LoadingButton /> : <SendButton />}
                </Space>
              </div>
            )
          }}
          onChange={(value) => {
            setSenderValue(value)
          }}
          onSubmit={async () => {
            if (senderValue.length > 10000) {
              appMessage.warning(t('messageMaxLength', { max: 10000 }))
              return
            }
            setSenderValue('')
            await sendMessage(chatId!, { parentId: parentId ?? undefined, content: senderValue })
          }}
          onCancel={async () => {
            stopSendMessage()
          }}
          suffix={false}
          classNames={{
            input: 'scrollbar-style'
          }}
        />
        <div className="w-full my-2 text-center truncate select-none">
          {t('answerMayNotBeAccurate', {
            name:
              assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'
          })}
        </div>
      </div>
    </div>
  )
}
