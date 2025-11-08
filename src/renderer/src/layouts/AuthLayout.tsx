import { Button, Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useNavigate } from 'react-router-dom'

const { Header, Content, Footer } = Layout

export default function AuthLayout(): React.JSX.Element {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const navigator = useNavigate()
  return (
    <Layout className="h-screen">
      <Header
        className="flex justify-between items-center"
        style={{ background: colorBgContainer }}
      >
        <div className="flex items-center gap-2">
          <MisakiLogo className="w-12 h-12" fill={colorPrimary} />
          <span className="text-3xl font-semibold select-none">Misaki</span>
        </div>
        <Button
          onClick={() => {
            navigator(-1)
          }}
        >
          返回
        </Button>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className="text-center select-none">
        Developed by Mizoguchi. All rights reserved.
      </Footer>
    </Layout>
  )
}
