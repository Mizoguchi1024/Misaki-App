import { Layout, Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
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
import { listAssistants } from '@renderer/api/front/assistant'
import { listChats } from '@renderer/api/front/chat'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import clsx from 'clsx'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt, setProfile } = useUserStore()
  const { backgroundPath, backgroundOpacity, backgroundBlur, getOssBaseUrl, setSettings } =
    useSettingsStore()
  const { chats, setChats } = useChatStore()
  const { setAssistants } = useAssistantStore()

  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page

  useEffect(() => {
    if (jwt) {
      Promise.all([getProfile(), getSettings(), listChats(), listAssistants()]).then(
        ([profileRes, settingsRes, chatsRes, assistantsRes]) => {
          setProfile(profileRes.data)
          setSettings(settingsRes.data)
          setChats(chatsRes.data)
          setAssistants(assistantsRes.data)
        }
      )
    }
  }, [])

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
    <Layout
      className={clsx(
        'h-screen w-screen overflow-hidden',
        backgroundPath &&
          `relative z-0 before:content-[''] before:absolute before:inset-0 before:bg-[url(${getOssBaseUrl() + backgroundPath})]
            before:bg-cover before:bg-center before:opacity-${backgroundOpacity} before:blur-[${backgroundBlur}px]
            before:scale-105 before:transform before:-z-10`
      )}
    >
      <Header
        className={clsx(
          'flex items-center justify-between px-8',
          backgroundPath
            ? 'bg-white/40 dark:bg-neutral-800/40 backdrop-blur-lg'
            : 'bg-white dark:bg-neutral-800 '
        )}
      >
        <MisakiButton />
        <HeaderMiddlePart currentPage={currentPage} />
        <HeaderRightPart currentPage={currentPage} />
      </Header>
      <Layout className="bg-transparent">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          className="bg-neutral-800/90"
        >
          <Menu
            className="select-none h-full overflow-y-auto scroll-smooth scrollbar-none bg-transparent"
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
