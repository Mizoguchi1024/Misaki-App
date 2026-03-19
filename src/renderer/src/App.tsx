import { useEffect, useState } from 'react'
import { App as AntdApp, theme } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { XProvider } from '@ant-design/x'
import { LanguageAntdMap, LanguageAntdXMap, useSettingsStore } from './store/settingsStore'
import { useQuery } from '@tanstack/react-query'
import 'dayjs/locale/zh-cn'
import { getSettings } from './api/front/user'
import { useUserStore } from './store/userStore'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { jwt } = useUserStore()
  const { appearance, fontSize, borderRadius, language } = useSettingsStore()
  const [isSystemDark, setIsSystemDark] = useState(window.api.getSystemTheme())

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

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
