import { Layout, Menu, MenuProps } from 'antd'
import { useState } from 'react'
import { Outlet, UIMatch, useLocation, useMatches, useNavigate } from 'react-router-dom'

import {
  CodeOutlined,
  DatabaseOutlined,
  FolderOutlined,
  FormOutlined,
  MessageOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@renderer/store/chatStore'
import HeaderRightPart from '../common/HeaderRightPart'
import MisakiButton from '../common/MisakiButton'
import HeaderMiddlePart from '../common/HeaderMiddlePart'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const [collapsed, setCollapsed] = useState(false)
  const { chats } = useChatStore()
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt } = useUserStore()

  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page

  const agentItems: MenuProps['items'] = [
    {
      key: '/',
      label: '新建会话',
      icon: <FormOutlined />
    },
    {
      key: '/search',
      label: '搜索会话',
      icon: <SearchOutlined />
    },
    {
      key: '/mcp-server',
      label: 'MCP服务',
      icon: <DatabaseOutlined />
    },
    {
      key: '/script',
      label: '快捷指令',
      icon: <CodeOutlined />
    },
    {
      key: '6',
      label: '文件处理',
      icon: <FolderOutlined />
    },
    {
      type: 'divider'
    }
  ]

  const chatItems =
    chats?.map((item) => ({
      key: '/chat/' + item.id.toString(),
      label: item.title ? item.title : t('New Chat'),
      icon: <MessageOutlined />
    })) ?? []

  const items = [...agentItems, ...chatItems]

  return (
    <Layout className="h-screen w-screen overflow-hidden">
      <Header className="flex items-center justify-between bg-white dark:bg-neutral-800 px-8">
        <MisakiButton />
        <HeaderMiddlePart currentPage={currentPage} />
        <HeaderRightPart currentPage={currentPage} />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <Menu
            className="select-none h-full overflow-y-auto scroll-smooth scrollbar-none"
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key, { viewTransition: true })}
            onAuxClick={(e) => console.log(e)}
            mode="inline"
            items={items}
            disabled={!jwt}
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
