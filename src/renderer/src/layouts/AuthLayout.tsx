import { Button, Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const { Header, Content, Footer } = Layout

export default function AuthLayout(): React.JSX.Element {
  const { t } = useTranslation('authLayout')
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const navigate = useNavigate()
  return (
    <Layout className="h-screen">
      <Header
        className="flex justify-between items-center"
        style={{ background: colorBgContainer, paddingInline: '2rem' }}
      >
        <Button type="text" size="large" style={{ padding: '0 0.6rem' }}>
          <div className="flex items-center gap-1">
            <MisakiLogo className="w-10 h-10" fill={colorPrimary} />
            <span className="text-2xl font-semibold select-none">Misaki</span>
          </div>
        </Button>
        <Button
          onClick={() => {
            navigate(-1)
          }}
        >
          {t('back')}
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
