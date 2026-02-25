import { ColorPicker, Dropdown, Input, InputRef } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '@renderer/assets/img/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import TermsModal from '@renderer/components/common/TermsModal'
import PolicyModal from '@renderer/components/common/PolicyModal'
import { messageApi } from '@renderer/messageApi'
import { useTranslation } from 'react-i18next'
import { createChat, listChats } from '@renderer/api/front/chat'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { listAssistants, updateAssistant } from '@renderer/api/front/assistant'
import clsx from 'clsx'

export default function Home(): React.JSX.Element {
  const { jwt } = useUserStore()
  const {
    mainColor,
    backgroundPath,
    enabledAssistantId,
    version: settingsVersion,
    setSettings
  } = useSettingsStore()
  const { setChats } = useChatStore()
  const { assistants, setAssistants } = useAssistantStore()
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [colorPickerValue, setColorPickerValue] = useState(mainColor)
  const [assistantNameInputValue, setAssistantNameInputValue] = useState(
    assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'
  )
  const assistantInputRef = useRef<InputRef>(null)

  // const test = async (): Promise<void> => {
  //   const tools = await window.api.listMcpTools()
  //   console.log('tools', tools)
  // }

  useEffect(() => {
    setColorPickerValue(mainColor)
  }, [mainColor])

  useEffect(() => {
    const assistant = assistants?.find((assistant) => assistant.id === enabledAssistantId)
    if (assistant) {
      setAssistantNameInputValue(assistant.name)
    } else {
      setAssistantNameInputValue('Misaki')
    }
  }, [enabledAssistantId])

  const handleAssistantNameSubmit = async (name: string): Promise<void> => {
    const enabledAssistant = assistants?.find((assistant) => assistant.id === enabledAssistantId)
    if (name && enabledAssistant) {
      if (name == enabledAssistant.name) return
      await updateAssistant(enabledAssistantId!, {
        name,
        version: enabledAssistant.version
      })
      const assistantRes = await listAssistants()
      setAssistants(assistantRes.data)
      messageApi?.success(t('assistantNameUpdated'))
    } else {
      setAssistantNameInputValue(enabledAssistant?.name || 'Misaki')
    }
  }

  const items = [
    {
      key: '1',
      label: '天气'
    }
  ]

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const showTermsModal = (): void => {
    setIsTermsModalOpen(true)
  }

  const handleTermsCancel = (): void => {
    setIsTermsModalOpen(false)
  }

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

  const showPolicyModal = (): void => {
    setIsPolicyModalOpen(true)
  }

  const handlePolicyCancel = (): void => {
    setIsPolicyModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="flex items-center gap-1 mb-24">
          <ColorPicker
            value={colorPickerValue}
            onChange={(color) => setColorPickerValue(color.toHexString())}
            onChangeComplete={async (color) => {
              await updateSettings({ mainColor: color.toHexString(), version: settingsVersion })
              const settingsRes = await getSettings()
              setSettings(settingsRes.data)
            }}
            disabledAlpha
            arrow={false}
            disabled={!jwt}
          >
            <MisakiLogo className="h-28 shrink-0 cursor-pointer" fill={mainColor} />
          </ColorPicker>
          <Input
            value={assistantNameInputValue}
            ref={assistantInputRef}
            variant="borderless"
            maxLength={8}
            spellCheck="false"
            className={clsx(
              'text-8xl font-semibold text-neutral-900 dark:text-neutral-200 field-sizing-content',
              jwt && 'cursor-text'
            )}
            onChange={(e) => setAssistantNameInputValue(e.target.value)}
            onPressEnter={() => assistantInputRef.current!.blur()}
            onBlur={() => handleAssistantNameSubmit(assistantNameInputValue)}
            inert={!jwt}
          />
        </div>
        <div className="w-3/4">
          <Sender
            className={clsx(
              backgroundPath
                ? 'bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xs hover:backdrop-blur-sm '
                : 'bg-white dark:bg-neutral-800',
              'transition-all duration-500'
            )}
            value={message}
            loading={loading}
            placeholder={!jwt ? t('pleaseLoginFirst') : t('greetings')}
            readOnly={!jwt}
            submitType="enter"
            footer={() => {
              return (
                <div className="flex gap-2">
                  <Sender.Switch color="default" disabled={!jwt}>
                    {t('createScript')}
                  </Sender.Switch>
                  <Dropdown menu={{ items }} disabled={!jwt}>
                    <Sender.Switch color="default">MCP · 3</Sender.Switch>
                  </Dropdown>
                  <Sender.Switch color="default" disabled={!jwt}>
                    {t('meme')}
                  </Sender.Switch>
                </div>
              )
            }}
            onChange={(value) => {
              setMessage(value)
            }}
            onSubmit={async () => {
              try {
                setLoading(true)
                const chatId = (await createChat()).data.id
                const chatRes = await listChats()
                setChats(chatRes.data)
                setMessage('')
                setLoading(false)
                navigate(`/chat/${chatId}`, {
                  state: { firstMessage: message },
                  viewTransition: true
                })
              } catch {
                setTimeout(() => {
                  setLoading(false)
                }, 1000)
              }
            }}
            onCancel={() => {
              setLoading(false)
            }}
          />
        </div>
      </div>
      <div className="h-14 flex justify-center items-center select-none">
        <span>{t('footer.agreement')}</span>
        <a onClick={showTermsModal}>{t('footer.terms')}</a>
        <span>{t('footer.andRead')}</span>
        <a onClick={showPolicyModal}>{t('footer.policy')}</a>
        <span>{t('footer.period')}</span>
        <TermsModal open={isTermsModalOpen} onCancel={handleTermsCancel} />
        <PolicyModal open={isPolicyModalOpen} onCancel={handlePolicyCancel} />
      </div>
    </div>
  )
}
