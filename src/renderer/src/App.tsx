import { ConfigProvider, message, theme } from 'antd'
import 'dayjs/locale/zh-cn'
import { LanguageAntdMap, useSettingsStore } from './store/settingsStore'
import { setMessageApi } from './messageApi'
import { useEffect, useState } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { appearance, fontSize, mainColor, borderRadius, language } = useSettingsStore()
  const [messageInstance, contextHolder] = message.useMessage()
  const [isSystemDark, setIsSystemDark] = useState( window.api.getSystemTheme())

  useEffect(() => {
    setMessageApi(messageInstance)


    window.api.onSystemThemeChange((dark) => {
      setIsSystemDark(dark)
    })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (appearance === 2 || (appearance === 0 && isSystemDark)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isSystemDark, appearance])

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          algorithm:
            appearance === 2 || (appearance === 0 && isSystemDark)
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          token: {
            fontSize: fontSize,
            colorPrimary: mainColor,
            borderRadius: borderRadius
          },
          components: {
            Menu: {
              activeBarBorderWidth: 0
            }
          }
        }}
        locale={LanguageAntdMap[language]}
      >
        {contextHolder}
        {children}
      </ConfigProvider>
    </StyleProvider>
  )
}
