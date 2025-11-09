import { Layout, Menu, theme, MenuProps, Button, Dropdown, Avatar } from 'antd'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import {
  CodeOutlined,
  DatabaseOutlined,
  FolderOutlined,
  FormOutlined,
  MessageOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const { profile, loginInfo, isLoggedIn, logout } = useUserStore()
  const items: MenuProps['items'] = [
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
      key: '/code-interpreter',
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
    },
    {
      key: 'sub1',
      label: '项目',
      icon: <StarOutlined />,
      children: [
        { key: '7', label: '项目 1' },
        { key: '8', label: '项目 2' }
      ]
    },
    {
      key: 'sub2',
      label: '会话',
      icon: <MessageOutlined />,
      children: [
        { key: '9', label: '会话 1' },
        { key: '10', label: '会话 2' }
      ]
    }
  ]

  return (
    <Layout className="h-screen">
      <Header
        className="flex items-center justify-between"
        style={{ background: colorBgContainer, paddingInline: '1.8rem' }}
      >
        <Button type="text" size="large" style={{ padding: '0 0.6rem' }}>
          <div className="flex items-center gap-2">
            <MisakiLogo className="w-10 h-10" fill={colorPrimary} />
            <span className="text-2xl font-semibold select-none">Misaki</span>
          </div>
        </Button>
        {!isLoggedIn && (
          <div className="flex items-center gap-4">
            <Button type="primary" onClick={() => navigate('/login', { viewTransition: true })}>
              登录
            </Button>
            <Button onClick={() => navigate('/register', { viewTransition: true })}>注册</Button>
          </div>
        )}
        {isLoggedIn && (
          <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
            <Button size="large" color="default" variant="filled">
              <Avatar size="small" icon={<UserOutlined />} />
              Mizoguchi
            </Button>
          </Dropdown>
        )}
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <Menu
            className="select-none"
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
            mode="inline"
            items={items}
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
