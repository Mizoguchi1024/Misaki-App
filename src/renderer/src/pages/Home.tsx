import { ColorPicker, Dropdown, Input } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
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

export default function Home(): React.JSX.Element {
  const { jwt } = useUserStore()
  const { setChats } = useChatStore()
  const { mainColor, version: settingsVersion, setSettings } = useSettingsStore()
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const [title, setTitle] = useState('Misaki')
  const [width, setWidth] = useState(10)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [colorPickerValue, setColorPickerValue] = useState(mainColor)

  const test = async (): Promise<void> => {
    const tools = await window.api.listMcpTools()
    console.log('tools', tools)
  }
  useEffect(() => {
    test()
    const span = spanRef.current
    if (span) {
      setWidth(span.offsetWidth)
    }
  }, [title])

  useEffect(() => {
    setColorPickerValue(mainColor)
  }, [mainColor])

  function handleTitleBlur(): void {
    submitTitle()
    messageApi?.success(t('titleUpdated'))
  }

  function submitTitle(): void {
    // TODO
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
            <MisakiLogo className="h-28 ml-24" fill={mainColor} />
          </ColorPicker>
          <span ref={spanRef} className="text-8xl font-semibold absolute invisible whitespace-pre">
            {title + 'iiii' || ' '}
          </span>
          <Input
            spellCheck="false"
            maxLength={8}
            defaultValue="Misaki"
            variant="borderless"
            className={!jwt ? 'cursor-default' : ''}
            style={{ width: width }}
            styles={{
              input: {
                fontSize: '6rem',
                fontWeight: 600
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onMouseDown={(e) => {
              if (!jwt) e.preventDefault()
            }}
          />
        </div>
        <div className="w-3/4">
          <Sender
            className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
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
