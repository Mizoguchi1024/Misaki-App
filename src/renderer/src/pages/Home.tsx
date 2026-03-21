import { App, ColorPicker, Dropdown, Input, InputRef, Space } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '@renderer/assets/img/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import TermsModal from '@renderer/components/common/TermsModal'
import PolicyModal from '@renderer/components/common/PrivatePolicyModal'
import { useTranslation } from 'react-i18next'
import { createChat } from '@renderer/api/front/chat'
import { useNavigate } from 'react-router-dom'
import { CodeMap, useChatStore } from '@renderer/store/chatStore'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import { listAssistants, updateAssistant } from '@renderer/api/front/assistant'
import { CloseOutlined } from '@ant-design/icons'
import { useMcpStore } from '@renderer/store/mcpStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Result } from '@renderer/types/result'
import { UpdateAssistantFrontRequest } from '@renderer/types/assistant'
import { listMcpServers } from '@renderer/api/front/mcp'
import { chatsInfiniteQueryKey } from '@renderer/hooks/useChatsInfiniteQuery'
import clsx from 'clsx'

export default function Home(): React.JSX.Element {
  const { t } = useTranslation('home')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { jwt } = useUserStore()
  const { isStreaming, prefix, sendMessage, stopSendMessage, setPrefix } = useChatStore()
  const { mcpEnabled, enabledServers, setMcpEnabled } = useMcpStore()
  const assistantNameInputRef = useRef<InputRef>(null)
  const [senderValue, setSenderValue] = useState('')
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const {
    mainColor = '#3142EF',
    backgroundPath,
    enabledAssistantId,
    version: settingsVersion = 0
  } = settingsData?.data ?? {}
  const [colorPickerValue, setColorPickerValue] = useState(mainColor)
  useEffect(() => {
    setColorPickerValue(mainColor)
  }, [mainColor])

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })

  const { data: assistantData } = useQuery({
    queryKey: ['assistants'],
    queryFn: listAssistants,
    enabled: !!jwt
  })
  const assistants = assistantData?.data ?? []
  const enabledAssistant = assistants?.find((assistant) => assistant.id === enabledAssistantId)
  const [assistantNameInputValue, setAssistantNameInputValue] = useState<string>()

  const updateAssistantMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateAssistantFrontRequest }
  >({
    mutationFn: ({ id, data }) => updateAssistant(id, data),
    onSuccess: () => {
      appMessage.success(t('nameUpdated'))
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
    }
  })

  const { data: serversData } = useQuery({
    queryKey: ['mcpServers'],
    queryFn: listMcpServers,
    enabled: !!jwt
  })
  const servers = serversData?.data ?? []

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chatsInfiniteQueryKey })
      sendMessage(data.data.id, {
        content: senderValue,
        prefix: prefix || undefined,
        tools: mcpEnabled
          ? servers
              ?.filter((server) => enabledServers.includes(server.name))
              .flatMap((server) => server.tools.map((tool) => tool.name))
          : undefined
      })
      navigate(`/chat/${data.data.id}`, {
        viewTransition: true
      })
    }
  })

  useEffect(() => {
    setAssistantNameInputValue(enabledAssistant?.name || 'Misaki')
  }, [enabledAssistant])

  return (
    <div className="flex flex-col h-full w-full px-12 md:max-w-2xl md:mx-auto md:px-0">
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full min-h-80 flex flex-col justify-between items-center">
          <div className="flex items-center gap-1 mb-6">
            <ColorPicker
              value={colorPickerValue}
              onChange={(color) => setColorPickerValue(color.toHexString())}
              onChangeComplete={(color) =>
                updateSettingsMutation.mutate({
                  mainColor: color.toHexString(),
                  version: settingsVersion!
                })
              }
              disabledAlpha
              arrow={false}
              disabled={!jwt}
            >
              <MisakiLogo
                className={clsx(
                  jwt ? 'cursor-pointer active:scale-90' : 'cursor-default',
                  'w-26 md:w-34 shrink-0 ease-in-out duration-250'
                )}
                fill={mainColor}
              />
            </ColorPicker>
            <Input
              value={assistantNameInputValue}
              ref={assistantNameInputRef}
              variant="borderless"
              maxLength={20}
              spellCheck={false}
              className={clsx(
                (assistantNameInputValue?.length ?? 0 <= 10)
                  ? 'text-7xl md:text-8xl'
                  : 'text-6xl md:text-7xl',
                'font-semibold text-neutral-900 dark:text-neutral-100 field-sizing-content',
                jwt && 'cursor-text'
              )}
              onChange={(e) => setAssistantNameInputValue(e.target.value)}
              onPressEnter={() => assistantNameInputRef.current!.blur()}
              onBlur={() => {
                if (
                  assistantNameInputValue &&
                  enabledAssistant &&
                  assistantNameInputValue !== enabledAssistant.name
                ) {
                  updateAssistantMutation.mutate({
                    id: enabledAssistantId!,
                    data: {
                      name: assistantNameInputValue,
                      version: enabledAssistant.version
                    }
                  })
                } else {
                  setAssistantNameInputValue(enabledAssistant?.name || 'Misaki')
                }
              }}
              inert={!jwt}
            />
          </div>
          <Sender
            className={clsx(
              backgroundPath
                ? 'bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xs hover:backdrop-blur-sm '
                : 'bg-white dark:bg-neutral-800',
              'max-w-2xl ease-in-out duration-500'
            )}
            value={senderValue}
            loading={isStreaming}
            placeholder={!jwt ? t('pleaseLoginFirst') : t('chatWithMe')}
            readOnly={!jwt}
            autoSize={{ minRows: 1, maxRows: 8 }}
            submitType="enter"
            footer={() => {
              return (
                <Space>
                  <Sender.Switch disabled={!jwt}>{t('think')}</Sender.Switch>
                  <Dropdown
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
                    disabled={!jwt}
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
                    disabled={!jwt}
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
              )
            }}
            onChange={(value) => setSenderValue(value)}
            onSubmit={() => {
              if (senderValue.length > 10000) {
                appMessage.warning(t('messageMaxLength', { max: 10000 }))
                return
              }
              createChatMutation.mutate()
            }}
            onCancel={() => {
              stopSendMessage()
            }}
            suffix={(_, info) => {
              const { SendButton, LoadingButton, ClearButton } = info.components
              return (
                <Space size="small">
                  {senderValue && <ClearButton icon={<CloseOutlined />} shape="circle" />}
                  {isStreaming ? <LoadingButton /> : <SendButton />}
                </Space>
              )
            }}
            classNames={{
              input: 'scrollbar-style'
            }}
          />
        </div>
      </div>
      <div className="h-14 flex justify-center items-center select-none">
        <span className="text-balance text-center">
          {t('footer.section1')}
          <a onClick={() => setIsTermsModalOpen(true)}>{t('footer.terms')}</a>
          {t('footer.section2')}
          <a onClick={() => setIsPolicyModalOpen(true)}>{t('footer.policy')}</a>
          {t('footer.section3')}
        </span>
        <TermsModal open={isTermsModalOpen} onCancel={() => setIsTermsModalOpen(false)} />
        <PolicyModal open={isPolicyModalOpen} onCancel={() => setIsPolicyModalOpen(false)} />
      </div>
    </div>
  )
}
