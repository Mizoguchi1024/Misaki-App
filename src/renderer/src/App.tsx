import { ConfigProvider, message, theme } from 'antd'
import 'dayjs/locale/zh-cn'
import { LanguageAntdMap, useSettingsStore } from './store/settingsStore'
import { setMessageApi } from './messageApi'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from './store/userStore'
import { StyleProvider } from '@ant-design/cssinjs'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { jwt, logout } = useUserStore()
  const { appearance, fontSize, mainColor, borderRadius, language } = useSettingsStore()
  const [messageInstance, contextHolder] = message.useMessage()

  useEffect(() => {
    setMessageApi(messageInstance)
    if (jwt) {
      const decoded = jwtDecode(jwt)
      const now = Date.now() / 1000
      if (decoded && decoded.exp) {
        if (decoded.exp < now) logout()
      }
    }
  }, [])

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          algorithm: appearance === 1 ? theme.defaultAlgorithm : theme.darkAlgorithm, // defaultAlgorithm | darkAlgorithm
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
