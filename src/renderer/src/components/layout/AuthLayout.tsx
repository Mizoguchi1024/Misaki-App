import { Layout } from 'antd'
import { Outlet, UIMatch, useMatches } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import HeaderRightPart from '../common/HeaderRightPart'
import MisakiButton from '../common/MisakiButton'

const { Header, Content, Footer } = Layout

export default function AuthLayout(): React.JSX.Element {
  const navigate = useNavigate()
  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page
  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      navigate(-1)
    }
  }

  window.addEventListener('keydown', handleEscape)

  return (
    <Layout className="h-screen w-screen overflow-hidden relative">
      <Header className="flex items-center justify-between bg-white dark:bg-neutral-800 px-8">
        <MisakiButton />
        <HeaderRightPart currentPage={currentPage} />
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
