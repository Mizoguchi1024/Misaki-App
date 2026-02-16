import { Button, ColorPicker, Dropdown, Input, theme } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import api from '@renderer/api'
import TermsModal from '@renderer/components/common/TermsModal'
import PolicyModal from '@renderer/components/common/PolicyModal'
import { AggregationColor } from 'antd/es/color-picker/color'
import { messageApi } from '@renderer/messageApi'
import { useTranslation } from 'react-i18next'

export default function Home(): React.JSX.Element {
  const { token } = useUserStore()
  const { t } = useTranslation('home')
  const [title, setTitle] = useState('Misaki')
  const [width, setWidth] = useState(10)
  const spanRef = useRef<HTMLSpanElement>(null)
  const {
    token: { colorPrimary }
  } = theme.useToken()

  const [color, setColor] = useState('#3142ef')

  useEffect(() => {
    const span = spanRef.current
    if (span) {
      setWidth(span.offsetWidth)
    }
  }, [title])

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

  function handleColorChange(value: AggregationColor): void {
    setColor(value.toHexString())
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="flex items-center gap-1 mb-24">
          <ColorPicker
            value={color}
            onChange={handleColorChange}
            disabledAlpha
            arrow={false}
            disabled={token == null}
          >
            <MisakiLogo className="h-28 ml-24" fill={colorPrimary} />
          </ColorPicker>
          <span ref={spanRef} className="text-8xl font-semibold absolute invisible whitespace-pre">
            {title + 'iiii' || ' '}
          </span>
          <Input
            spellCheck="false"
            maxLength={8}
            defaultValue="Misaki"
            variant="borderless"
            className={token == null ? 'cursor-default' : ''}
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
              if (token == null) e.preventDefault()
            }}
          />
        </div>
        <Sender
          style={{ width: '75%' }}
          className='bg-white/70 backdrop-blur-xs hover:backdrop-blur-sm'
          placeholder={token == null ? t('pleaseLoginFirst') : t('greetings')}
          disabled={token == null}
          footer={() => {
            return (
              <div className="flex gap-2">
                <Button color="default" variant="filled" disabled={token == null}>
                  {t('createScript')}
                </Button>
                <Dropdown menu={{ items }} disabled={token == null}>
                  <Button color="default" variant="filled">
                    MCP · 3
                  </Button>
                </Dropdown>
                <Button color="default" variant="filled" disabled={token == null}>
                  {t('meme')}
                </Button>
              </div>
            )
          }}
          onSubmit={() => {
            api.get('/test').catch(() => {
              messageApi?.error(t('requestFailed'))
            })
          }}
        />
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
