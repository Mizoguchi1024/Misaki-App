import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { useSettingStore } from './store/settingStore'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { appearance } = useSettingStore()

  return (
    <ConfigProvider
      theme={{
        algorithm: appearance === 1 ? theme.defaultAlgorithm : theme.darkAlgorithm, // defaultAlgorithm | darkAlgorithm
        token: {
          fontSize: 14,
          colorPrimary: '#3142ef',
          borderRadius: 12
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
