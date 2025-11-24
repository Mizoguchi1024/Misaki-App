import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { useSettingStore } from './store/settingStore'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { setting } = useSettingStore()

  return (
    <ConfigProvider
      theme={{
        algorithm: setting?.appearance === 1 ? theme.defaultAlgorithm : theme.darkAlgorithm, // defaultAlgorithm | darkAlgorithm
        token: {
          fontSize: setting?.fontSize,
          colorPrimary: setting?.colorPrimary,
          borderRadius: setting?.borderRadius
        },
        components: {
          Menu: {
            activeBarBorderWidth: 0
          }
        }
      }}
      locale={zhCN}
    >
      {children}
    </ConfigProvider>
  )
}
