import { ConfigProvider, message, theme } from 'antd'
import 'dayjs/locale/zh-cn'
import { LanguageAntdMap, useSettingsStore } from './store/settingsStore'
import { setMessageApi } from './messageApi'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from './store/userStore'
import { StyleProvider } from '@ant-design/cssinjs'
import { useChatStore } from './store/chatStore'
import { useAssistantStore } from './store/assistantStore'
import { useFeedbackStore } from './store/feedbackStore'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { jwt, logout } = useUserStore()
  const {
    appearance,
    fontSize,
    mainColor,
    borderRadius,
    language,
    resetCloudSettings: resetSettingsStore
  } = useSettingsStore()
  const { reset: resetChatStore } = useChatStore()
  const { reset: resetAssistantStore } = useAssistantStore()
  const { reset: resetFeedbackStore } = useFeedbackStore()
  const [messageInstance, contextHolder] = message.useMessage()
  const [isSystemDark, setIsSystemDark] = useState(false)

  useEffect(() => {
    setMessageApi(messageInstance)

    window.api.onSystemThemeChange((dark) => {
      setIsSystemDark(dark)
    })

    if (jwt) {
      const decoded = jwtDecode(jwt)
      const now = Date.now() / 1000
      if (decoded && decoded.exp) {
        if (decoded.exp < now) {
          logout()
          resetSettingsStore()
          resetChatStore()
        }
      }
    } else {
      logout()
      resetSettingsStore()
      resetChatStore()
      resetAssistantStore()
      resetFeedbackStore()
    }
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
