import { ConfigProvider, theme } from 'antd'

export default function App({ children }: { children?: React.ReactNode }): React.JSX.Element {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, //defaultAlgorithm darkAlgorithm
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
    >
      {children}
    </ConfigProvider>
  )
}
