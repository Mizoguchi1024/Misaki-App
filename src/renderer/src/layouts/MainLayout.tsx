import { Layout, Menu, theme, MenuProps, Button, Dropdown, Avatar } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import {
  CodeOutlined,
  DatabaseOutlined,
  FolderOutlined,
  FormOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import SettingsModal from '@renderer/components/SettingsModal'
import AboutModal from '@renderer/components/AboutModal'
import { useTranslation } from 'react-i18next'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const [collapsed, setCollapsed] = useState(false)
  const { username } = useUserStore()
  const location = useLocation()
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const { token } = useUserStore()

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const handleSettingsModalCancel = (): void => {
    setIsSettingsModalOpen(false)
  }

  const handleAboutModalCancel = (): void => {
    setIsAboutModalOpen(false)
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '/settings':
        setIsSettingsModalOpen(true)
        break
      case '/about':
        setIsAboutModalOpen(true)
        break
    }
  }

  const helpList: MenuProps['items'] = [
    {
      key: '/settings',
      label: t('settings'),
      icon: <SettingOutlined />
    },
    {
      key: '/about',
      label: t('about'),
      icon: <InfoCircleOutlined />
    }
  ]

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
        style={{ background: colorBgContainer, paddingInline: '2rem' }}
      >
        <Button
          type="text"
          size="large"
          style={{ padding: '0 0.6rem' }}
          onClick={() => navigate('/misaki', { viewTransition: true })}
        >
          <div className="flex items-center gap-1">
            <MisakiLogo className="w-10 h-10" fill={colorPrimary} />
            <span className="text-2xl font-semibold select-none">Misaki</span>
          </div>
        </Button>
        {token == null && (
          <div className="flex items-center gap-4">
            <Dropdown
              menu={{ items: helpList, onClick }}
              placement="bottomLeft"
              trigger={['click']}
            >
              <Button
                color="default"
                variant="filled"
                shape="circle"
                icon={<QuestionCircleOutlined />}
              ></Button>
            </Dropdown>
            <SettingsModal open={isSettingsModalOpen} onCancel={handleSettingsModalCancel} />
            <AboutModal open={isAboutModalOpen} onCancel={handleAboutModalCancel} />
            <Button type="primary" onClick={() => navigate('/login', { viewTransition: true })}>
              {t('login')}
            </Button>
            <Button onClick={() => navigate('/register', { viewTransition: true })}>
              {t('register')}
            </Button>
          </div>
        )}
        {token != null && (
          <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
            <Button size="large" color="default" variant="filled">
              <Avatar size="small" icon={<UserOutlined />} />
              {username}
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
            onClick={(e) => navigate(e.key, { viewTransition: true })}
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
