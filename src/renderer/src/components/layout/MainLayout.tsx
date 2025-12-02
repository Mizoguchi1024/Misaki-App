import { Layout, Menu, theme, MenuProps, Button, Dropdown, Avatar } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import MisakiLogo from '@renderer/assets/misaki-logo-symbol.svg?react'
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
  UserOutlined
} from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import SettingsModal from '@renderer/components/common/SettingsModal'
import AboutModal from '@renderer/components/common/AboutModal'
import { useTranslation } from 'react-i18next'
import { messageApi } from '@renderer/messageApi'
import { useChatStore } from '@renderer/store/chatStore'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const [collapsed, setCollapsed] = useState(false)
  const { username } = useUserStore()
  const { chats } = useChatStore()
  const location = useLocation()
  const { id } = useParams()
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

  const chatItems = chats.map((item) => ({
    key: '/chat/' + item.id.toString(),
    label: item.title ? item.title : t('New Chat'),
    icon: <MessageOutlined />
  }))

  const items = [...agentItems, ...chatItems]

  return (
    <Layout className="h-full">
      <Header
        className="flex items-center justify-between"
        style={{ background: colorBgContainer, paddingInline: '2rem' }}
      >
        <Button
          type="text"
          size="large"
          style={{ padding: '0 0.6rem' }}
          onClick={() => {
            if (token != null) {
              navigate('/misaki', { viewTransition: true })
            } else {
              messageApi?.info(t('Login first'))
            }
          }}
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
          <div className="flex items-center gap-4">
            {location.pathname.startsWith('/chat') && (
              <Button color="danger" variant="outlined">
                {t('deleteThisChat')}: {id}
              </Button>
            )}
            <Dropdown
              menu={{ items: helpList, onClick }}
              placement="bottomLeft"
              trigger={['click']}
            >
              <Button size="large" color="default" variant="filled">
                <Avatar size="small" icon={<UserOutlined />} />
                {username}
              </Button>
            </Dropdown>
          </div>
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
            className="select-none h-full overflow-y-auto scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key, { viewTransition: true })}
            onAuxClick={(e) => console.log(e)}
            mode="inline"
            items={items}
            disabled={token == null}
          />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
