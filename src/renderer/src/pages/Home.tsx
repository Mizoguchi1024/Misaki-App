import { App, ColorPicker, Dropdown, Input, InputRef } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '@renderer/assets/img/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import TermsModal from '@renderer/components/common/TermsModal'
import PolicyModal from '@renderer/components/common/PolicyModal'
import { useTranslation } from 'react-i18next'
import { createChat } from '@renderer/api/front/chat'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { listAssistants, updateAssistant } from '@renderer/api/front/assistant'
import clsx from 'clsx'

export default function Home(): React.JSX.Element {
  const { t } = useTranslation('home')
  const { message: appMessage } = App.useApp()
  const { jwt } = useUserStore()
  const {
    mainColor,
    backgroundPath,
    enabledAssistantId,
    version: settingsVersion,
    setSettings
  } = useSettingsStore()
  const {
    isStreaming,
    chats,
    setParentId,
    setChats,
    setMessages,
    setFullMessages,
    sendMessage,
    stopSendMessage
  } = useChatStore()
  const { assistants, setAssistants } = useAssistantStore()
  const navigate = useNavigate()
  const [colorPickerValue, setColorPickerValue] = useState(mainColor)
  const [assistantNameInputValue, setAssistantNameInputValue] = useState(
    assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'
  )
  const assistantInputRef = useRef<InputRef>(null)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

  useEffect(() => {
    setParentId(null)
  }, [])

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
      appMessage.success(t('assistantNameUpdated'))
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
              'text-8xl font-semibold text-neutral-900 dark:text-neutral-100 field-sizing-content',
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
              'ease-in-out duration-500'
            )}
            loading={isStreaming}
            placeholder={!jwt ? t('pleaseLoginFirst') : t('chatWithMe')}
            disabled={!jwt}
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
            onSubmit={async (value) => {
              try {
                setFullMessages([])
                setMessages([])
                const newChat = (await createChat()).data
                setChats([newChat, ...(chats ?? [])])
                sendMessage(newChat.id, { content: value })
                navigate(`/chat/${newChat.id}`, {
                  viewTransition: true
                })
              } catch {
                return
              }
            }}
            onCancel={() => {
              stopSendMessage()
            }}
          />
        </div>
      </div>
      <div className="h-14 flex justify-center items-center select-none">
        <span>{t('footer.agreement')}</span>
        <a onClick={() => setIsTermsModalOpen(true)}>{t('footer.terms')}</a>
        <span>{t('footer.andRead')}</span>
        <a onClick={() => setIsPolicyModalOpen(true)}>{t('footer.policy')}</a>
        <span>{t('footer.period')}</span>
        <TermsModal open={isTermsModalOpen} onCancel={() => setIsTermsModalOpen(false)} />
        <PolicyModal open={isPolicyModalOpen} onCancel={() => setIsPolicyModalOpen(false)} />
      </div>
    </div>
  )
}
