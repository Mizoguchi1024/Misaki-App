import { Layout } from 'antd'
import { Outlet, useMatches } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import HeaderRightPart from '../common/HeaderRightPart'
import MisakiButton from '../common/MisakiButton'

const { Header, Content, Footer } = Layout

export default function AuthLayout(): React.JSX.Element {
  const navigate = useNavigate()
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const headerType = currentMatch?.handle?.header
  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      navigate(-1)
    }
  }

  window.addEventListener('keydown', handleEscape)

  return (
    <Layout className="h-screen relative">
      <Header className="flex items-center justify-between bg-white dark:bg-neutral-800 px-8">
        <MisakiButton />
        <HeaderRightPart type={headerType} />
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className="absolute bottom-0 w-full bg-white/0 text-center select-none">
        Developed by Mizoguchi. All rights reserved.
      </Footer>
    </Layout>
  )
}
