import { Layout, Menu, theme, MenuProps, Button, Dropdown, Avatar } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CodeOutlined,
  DatabaseOutlined,
  FolderOutlined,
  FormOutlined,
  HeartOutlined,
  MessageOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons'
import TermsModal from '@renderer/components/TermsModal'
import PolicyModal from '@renderer/components/PolicyModal'
import { useUserStore } from '@renderer/store/userStore'

const { Header, Content, Footer, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  // const location = useLocation()
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { profile, loginInfo, isLoggedIn, logout } = useUserStore()
  const items: MenuProps['items'] = [
    {
      key: '/misaki',
      label: 'Misaki',
      icon: <HeartOutlined />
    },
    {
      type: 'divider'
    },
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

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const showTermsModal = (): void => {
    setIsTermsModalOpen(true)
  }

  const handleTermsCancel = (): void => {
    setIsTermsModalOpen(false)
  }

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

  const showPolicyModal = (): void => {
    setIsPolicyModalOpen(true)
  }

  const handlePolicyCancel = (): void => {
    setIsPolicyModalOpen(false)
  }

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-end gap-4"
          style={{ background: colorBgContainer }}
        >
          {!isLoggedIn && (
            <>
              <Button type="primary" onClick={() => navigate('/login', { viewTransition: true })}>
                登录
              </Button>
              <Button onClick={() => navigate('/register', { viewTransition: true })}>注册</Button>
            </>
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
        <Content>
          <Outlet />
        </Content>
        <Footer className="text-center select-none">
          <span>向 AI 助理 Misaki 发送消息即表示，你同意我们的</span>
          <a onClick={showTermsModal}>条款</a>
          <span>并已阅读我们的</span>
          <a onClick={showPolicyModal}>隐私政策</a>
          <span>。</span>
          <TermsModal open={isTermsModalOpen} onCancel={handleTermsCancel} />
          <PolicyModal open={isPolicyModalOpen} onCancel={handlePolicyCancel} />
        </Footer>
      </Layout>
    </Layout>
  )
}
