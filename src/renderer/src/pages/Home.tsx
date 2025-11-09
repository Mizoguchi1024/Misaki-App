import { Button, ColorPicker, Dropdown, Input, message, theme } from 'antd'
import { Sender } from '@ant-design/x'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useEffect, useRef, useState } from 'react'
import { useUserStore } from '@renderer/store/userStore'
import api from '@renderer/api'

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

  return (
    <>
      {contextHolder}
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex items-center gap-2 mb-24">
          <ColorPicker
            value={color}
            onChange={setColor}
            disabledAlpha
            arrow={false}
            disabled={!isLoggedIn}
          >
            <MisakiLogo className="h-28 ml-24" fill={colorPrimary} />
          </ColorPicker>
          <span ref={spanRef} className="text-8xl font-semibold absolute invisible whitespace-pre">
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
              <>
                <Dropdown menu={{ items }}>
                  <Button>MCP · 3</Button>
                </Dropdown>
              </>
            )
          }}
          onSubmit={() => {
            api.get('/test').catch(() => {
              messageApi.error('请求失败')
            })
          }}
        />
      </div>
    </>
  )
}
