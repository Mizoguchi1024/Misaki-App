import {
  ArrowDownOutlined,
  CloseOutlined,
  EditOutlined,
  HeartOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Actions, Bubble, CodeHighlighter, Mermaid, Prompts, Sender } from '@ant-design/x'
import XMarkdown, { ComponentProps } from '@ant-design/x-markdown'
import Latex from '@ant-design/x-markdown/plugins/latex'
import { listAssistants } from '@renderer/api/front/assistant'
import { createChatTitle, listMessages, listPrompts } from '@renderer/api/front/chat'
import { flattenChats, useChatsInfiniteQuery } from '@renderer/hooks/useChatsInfiniteQuery'
import { listMcpServers } from '@renderer/api/front/mcp'
import { listModels } from '@renderer/api/front/model'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { CodeMap, useChatStore } from '@renderer/store/chatStore'
import { useMcpStore } from '@renderer/store/mcpStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageFrontResponse, SendMessageFrontRequest } from '@renderer/types/chat'
import { App, Avatar, Button, Dropdown, Pagination, Skeleton, Space, Typography } from 'antd'
import clsx from 'clsx'
import { AnimatePresence, motion, useAnimation } from 'motion/react'
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
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: chatId } = useParams()
  const { getOssBaseUrl } = useSettingsStore()
  const { isStreaming, prefix, newMessages, sendMessage, stopSendMessage, setPrefix } =
    useChatStore()
  const { mcpEnabled, enabledServers, setMcpEnabled } = useMcpStore()
  const [senderValue, setSenderValue] = useState('')
  const [editingId, setEditingId] = useState('')
  const [containerRef, { width: containerWidth }] = useMeasure<HTMLDivElement>()
  const [trackRef, { width: trackWidth }] = useMeasure<HTMLDivElement>()
  const promptsControls = useAnimation()
  const [dragging, setDragging] = useState(false)
  const [senderAreaRef, { height: senderAreaHeight }] = useMeasure<HTMLDivElement>()
  const scrollableDivRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const shouldSnapToBottomRef = useRef(true)
  const [atBottom, setAtBottom] = useState(false)
  const [showUserFooterId, setShowUserFooterId] = useState('')

  const scrollToBottom = (behavior: ScrollBehavior = 'auto'): void => {
    const el = scrollableDivRef.current
    if (!el) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior })
      })
    })
  }

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile
  })
  const { username, avatarPath } = userData?.data ?? {}

  const { data: messagesData } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => listMessages(chatId!),
    enabled: !isStreaming
  })
  const rawMessages = messagesData?.data ?? []
  const fullMessages = [...rawMessages, ...(isStreaming ? newMessages : [])]
  const [parentIdManually, setParentIdManually] = useState('')
  const parentId = parentIdManually || fullMessages.at(-1)?.id || ''
  const messages = (() => {
    if (!fullMessages.length) {
      return []
    }
    const map = new Map<string, MessageFrontResponse>()
    fullMessages.forEach((msg) => {
      map.set(msg.id, msg)
    })

    let currentId = parentId
    const path: MessageFrontResponse[] = []

    while (currentId) {
      const msg = map.get(currentId)
      if (!msg) break
      path.push(msg)
      currentId = msg.parentId ?? ''
    }

    path.reverse()
    return path
  })()

  const sendMessageMutation = useMutation<
    void,
    Error,
    { id: string; data: SendMessageFrontRequest }
  >({
    mutationFn: ({ id, data }) => sendMessage(id, data),
    onSuccess: () => {
      refetchPrompts()
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      queryClient.resetQueries({ queryKey: ['chats'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const { data: chatsData } = useChatsInfiniteQuery()
  const chat = flattenChats(chatsData?.pages).find((item) => item.id === chatId)

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const { enabledAssistantId = '0', promptsSuggestion = false } = settingsData?.data ?? {}

  const { data: assistantsData } = useQuery({
    queryKey: ['assistants'],
    queryFn: listAssistants
  })
  const assistants = assistantsData?.data ?? []
  const enabledAssistant = assistants?.find((assistant) => assistant.id === enabledAssistantId)

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: listModels
  })
  const models = modelsData?.data ?? []
  const enabledAssistantModel = models?.find((model) => model.id === enabledAssistant?.modelId)

  const { data: serversData } = useQuery({
    queryKey: ['mcpServers'],
    queryFn: listMcpServers
  })
  const servers = serversData?.data ?? []

  const createChatTitleMutation = useMutation({
    mutationFn: createChatTitle,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['chats'] })
    }
  })

  const { data: promptsData, refetch: refetchPrompts } = useQuery({
    queryKey: ['prompts', chatId],
    queryFn: () =>
      listPrompts(chatId!, {
        parentId: parentId!,
        size: 2
      }),
    enabled: promptsSuggestion && !!parentId && !isStreaming,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  const prompts = promptsData?.data ?? []

  useEffect(() => {
    const load = (): void => {
      if (!isStreaming) {
        if (!chat?.title) {
          createChatTitleMutation.mutate(chatId!)
        }

        if (promptsSuggestion && parentId) {
          promptsControls.start({
            x: 0,
            y: 0
          })
        }
      } else {
        setParentIdManually('')
      }
    }
    load()
  }, [chatId, isStreaming, promptsSuggestion])

  useEffect(() => {
    const load = async (): Promise<void> => {
      shouldSnapToBottomRef.current = true
      setParentIdManually('')
      setSenderValue('')
      promptsControls.start({
        x: 0,
        y: 0
      })
    }
    load()
  }, [chatId])

  useEffect(() => {
    if (!fullMessages.length) return
    if (!shouldSnapToBottomRef.current && !atBottom && !isStreaming) return

    scrollToBottom('auto')

    if (senderAreaHeight > 0) {
      shouldSnapToBottomRef.current = false
    }
  }, [chatId, fullMessages.length, senderAreaHeight, atBottom, isStreaming])

  useEffect(() => {
    const root = scrollableDivRef.current
    const sentinel = sentinelRef.current

    if (!root || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        setAtBottom(target.isIntersecting)
      },
      {
        root,
        threshold: 0.5
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [setAtBottom])

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto scrollbar-style mask-end px-4" ref={scrollableDivRef}>
        <div className="px-12 pt-12 w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl md:mx-auto md:px-0 ease-in-out duration-250">
          {messages.map((item, index, array) => (
            <Bubble
              key={item.id}
              content={item.content}
              avatar={
                item.type === 'ASSISTANT' ? (
                  <Avatar
                    draggable={false}
                    src={getOssBaseUrl() + enabledAssistantModel?.avatarPath}
                    icon={<HeartOutlined />}
                  />
                ) : (
                  <Avatar
                    draggable={false}
                    src={getOssBaseUrl() + avatarPath}
                    icon={<UserOutlined />}
                  />
                )
              }
              header={item.type === 'ASSISTANT' ? enabledAssistant?.name || 'Misaki' : username}
              variant={item.type === 'ASSISTANT' ? 'borderless' : 'filled'}
              placement={item.type === 'ASSISTANT' ? 'start' : 'end'}
              contentRender={
                item.type === 'ASSISTANT'
                  ? (content: string) => (
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
                  : (content: string) => <Typography>{content}</Typography>
              }
              editable={item.id === editingId}
              onEditCancel={() => {
                setEditingId('')
              }}
              onEditConfirm={async (value) => {
                setEditingId('')
                if (!value.trim()) {
                  appMessage.warning(t('messageRequired'))
                  return
                }
                sendMessageMutation.mutate({
                  id: chatId!,
                  data: {
                    parentId: item.parentId ?? undefined,
                    content: value,
                    prefix: prefix || undefined,
                    tools: mcpEnabled
                      ? servers
                          ?.filter((server) => enabledServers.includes(server.name))
                          .flatMap((server) => server.tools.map((tool) => tool.name))
                      : undefined
                  }
                })
              }}
              footer={
                item.type === 'ASSISTANT' ? (
                  index === array.length - 1 && isStreaming ? null : (
                    <Actions
                      fadeInLeft={index === array.length - 1}
                      items={[
                        {
                          key: 'retry',
                          icon: <RedoOutlined />,
                          label: t('retry'),
                          onItemClick: async () => {
                            const userMessage = messages?.find((m) => m.id === item.parentId)
                            if (!userMessage) return
                            sendMessageMutation.mutate({
                              id: chatId!,
                              data: {
                                parentId: userMessage.parentId ?? undefined,
                                content: userMessage.content,
                                prefix: prefix || undefined,
                                tools: mcpEnabled
                                  ? servers
                                      ?.filter((server) => enabledServers.includes(server.name))
                                      .flatMap((server) => server.tools.map((tool) => tool.name))
                                  : undefined
                              }
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
                    className={clsx(
                      (fullMessages?.filter((m) => m.parentId === item.parentId).length ?? 0) <=
                        1 &&
                        !(showUserFooterId === item.id) &&
                        'opacity-0',
                      'ease-in-out duration-250'
                    )}
                    items={[
                      ...((fullMessages?.filter((m) => m.parentId === item.parentId).length ?? 0) >
                      1
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
                                    setParentIdManually(current?.id ?? null)
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
                )
              }
              onMouseEnter={() => setShowUserFooterId(item.id)}
              onMouseLeave={() => setShowUserFooterId('')}
              classNames={{
                avatar: 'select-none',
                header: 'opacity-60 select-none'
              }}
            />
          ))}
          <div ref={sentinelRef} style={{ height: senderAreaHeight + 12 }}></div>
        </div>
      </div>
      <AnimatePresence>
        {!atBottom && (
          <motion.div
            key="scrollToBottom"
            initial={{ filter: 'blur(8px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            exit={{ filter: 'blur(8px)', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Button
              icon={<ArrowDownOutlined />}
              shape="circle"
              className="absolute left-1/2 -translate-x-1/2 bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
              style={{ bottom: senderAreaHeight + 12 }}
              onClick={() => {
                scrollToBottom('smooth')
              }}
            ></Button>
          </motion.div>
        )}
      </AnimatePresence>
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
              animate={promptsControls}
              dragConstraints={{
                left: Math.min(containerWidth - trackWidth, 0),
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
                fadeInLeft
                items={prompts.map((prompt) => ({
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
                  {/* <Sender.Switch>{t('think')}</Sender.Switch> */}
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
          onSubmit={() => {
            if (senderValue.length > 10000) {
              appMessage.warning(t('messageMaxLength', { max: 10000 }))
              return
            }
            setSenderValue('')
            sendMessageMutation.mutate({
              id: chatId!,
              data: {
                parentId: parentId ?? undefined,
                content: senderValue,
                prefix: prefix || undefined,
                tools: mcpEnabled
                  ? servers
                      ?.filter((server) => enabledServers.includes(server.name))
                      .flatMap((server) => server.tools.map((tool) => tool.name))
                  : undefined
              }
            })
          }}
          onCancel={() => {
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
