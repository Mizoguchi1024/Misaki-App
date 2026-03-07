import { App as AntdApp, theme } from 'antd'
import 'dayjs/locale/zh-cn'
import { LanguageAntdMap, LanguageAntdXMap, useSettingsStore } from './store/settingsStore'
import { useEffect, useState } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { XProvider } from '@ant-design/x'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { appearance, fontSize, mainColor, borderRadius, language } = useSettingsStore()
  const [isSystemDark, setIsSystemDark] = useState(window.api.getSystemTheme())

  useEffect(() => {
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
      <XProvider
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
        locale={{ ...LanguageAntdXMap[language], ...LanguageAntdMap[language] }}
      >
        <AntdApp message={{ maxCount: 5 }}>{children}</AntdApp>
      </XProvider>
    </StyleProvider>
  )
}
