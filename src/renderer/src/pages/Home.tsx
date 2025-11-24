import { Button, ColorPicker, Dropdown, Input, message, theme } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import api from '@renderer/api'
import TermsModal from '@renderer/components/TermsModal'
import PolicyModal from '@renderer/components/PolicyModal'

export default function Home(): React.JSX.Element {
  const { profile, loginInfo, isLoggedIn, logout } = useUserStore()
  const [title, setTitle] = useState('Misaki')
  const [width, setWidth] = useState(10)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [messageApi, contextHolder] = message.useMessage()
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
    messageApi.success('标题已更新')
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
    <>
      {contextHolder}
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="flex items-center gap-1 mb-24">
            <ColorPicker
              value={color}
              onChange={setColor}
              disabledAlpha
              arrow={false}
              disabled={!isLoggedIn}
            >
              <MisakiLogo className="h-28 ml-24" fill={colorPrimary} />
            </ColorPicker>
            <span
              ref={spanRef}
              className="text-8xl font-semibold absolute invisible whitespace-pre"
            >
              {title + 'iiii' || ' '}
            </span>
            <Input
              readOnly={!isLoggedIn}
              spellCheck="false"
              maxLength={8}
              defaultValue="Misaki"
              variant="borderless"
              style={{ width: width }}
              styles={{
                input: {
                  fontSize: '6rem',
                  fontWeight: 600
                }
              }}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
            />
          </div>
          <Sender
            style={{ width: '75%' }}
            placeholder="需要我帮你做什么？"
            footer={() => {
              return (
                <div className="flex gap-2">
                  <Button color="default" variant="filled">
                    生成快捷指令
                  </Button>
                  <Dropdown menu={{ items }}>
                    <Button color="default" variant="filled">
                      MCP · 3
                    </Button>
                  </Dropdown>
                  <Button color="default" variant="filled">
                    表情包
                  </Button>
                </div>
              )
            }}
            onSubmit={() => {
              api.get('/test').catch(() => {
                messageApi.error('请求失败')
              })
            }}
          />
        </div>
        <div className="h-14 flex justify-center items-center select-none">
          <span>向 AI 助理 Misaki 发送消息即表示，你同意我们的</span>
          <a onClick={showTermsModal}>条款</a>
          <span>并已阅读我们的</span>
          <a onClick={showPolicyModal}>隐私政策</a>
          <span>。</span>
          <TermsModal open={isTermsModalOpen} onCancel={handleTermsCancel} />
          <PolicyModal open={isPolicyModalOpen} onCancel={handlePolicyCancel} />
        </div>
      </div>
    </>
  )
}
