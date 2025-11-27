import { ConfigProvider, message, theme } from 'antd'
import 'dayjs/locale/zh-cn'
import { LanguageAntdMap, useSettingsStore } from './store/settingsStore'
import { setMessageApi } from './messageManager'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { appearance, fontSize, colorPrimary, borderRadius, language } = useSettingsStore()
  const [messageApi, contextHolder] = message.useMessage()

  setMessageApi(messageApi)

  return (
    <ConfigProvider
      theme={{
        algorithm: appearance === 1 ? theme.defaultAlgorithm : theme.darkAlgorithm, // defaultAlgorithm | darkAlgorithm
        token: {
          fontSize: fontSize,
          colorPrimary: colorPrimary,
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
  )
}
