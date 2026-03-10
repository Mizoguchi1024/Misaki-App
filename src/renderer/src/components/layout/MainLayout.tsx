import { App, Button, Drawer, Layout, Menu, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, UIMatch, useLocation, useMatches, useNavigate } from 'react-router-dom'
import {
  CodeOutlined,
  DatabaseOutlined,
  FolderOutlined,
  FormOutlined,
  MenuOutlined,
  MessageOutlined,
  PushpinOutlined,
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
import { checkIn, getProfile, getSettings } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useFeedbackStore } from '@renderer/store/feedbackStore'
import { listModels } from '@renderer/api/front/model'
import { useModelStore } from '@renderer/store/modelStore'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const { message: appMessage } = App.useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt, rememberMe, setProfile, reset: resetUserStore } = useUserStore()
  const {
    backgroundPath,
    backgroundOpacity,
    backgroundBlur,
    getOssBaseUrl,
    setStaticMessage,
    setSettings,
    reset: resetSettingsStore
  } = useSettingsStore()
  const { chats, chatsUI, setChats, reset: resetChatStore } = useChatStore()
  const { setAssistants, reset: resetAssistantStore } = useAssistantStore()
  const { setModels, reset: resetModelStore } = useModelStore()
  const { reset: resetFeedbackStore } = useFeedbackStore()

  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page

  useEffect(() => {
    setStaticMessage(appMessage)
    const load = async (): Promise<void> => {
      if (jwt) {
        if (!rememberMe) {
          resetUserStore()
          resetSettingsStore()
          resetChatStore()
          resetAssistantStore()
          resetModelStore()
          resetFeedbackStore()
          return
        }
        try {
          const [profileRes, settingsRes, chatsRes, assistantsRes, modelsRes] = await Promise.all([
            getProfile(),
            getSettings(),
            listChats(),
            listAssistants(),
            listModels()
          ])
          setProfile(profileRes.data)
          setSettings(settingsRes.data)
          setChats(chatsRes.data)
          setAssistants(assistantsRes.data)
          setModels(modelsRes.data)

          const isToday = dayjs(profileRes.data.lastCheckInDate, 'YYYY-MM-DD').isSame(
            dayjs(),
            'day'
          )
          if (!isToday) {
            const checkInRes = await checkIn()
            appMessage.success(
              t('checkInSuccess', {
                token: checkInRes.data.token,
                crystal: checkInRes.data.crystal
              })
            )
            const newProfileRes = await getProfile()
            setProfile(newProfileRes.data)
          }
        } catch {
          return
        }
      }
    }

    load()
  }, [])

  const agentItems: MenuProps['items'] = [
    {
      key: '/',
      label: t('startNewChat'),
      icon: <FormOutlined />
    },
    {
      key: '/search',
      label: t('searchChats'),
      icon: <SearchOutlined />
    },
    {
      key: '/mcp-server',
      label: t('mcpServer'),
      icon: <DatabaseOutlined />
    },
    {
      key: '/script',
      label: t('script'),
      icon: <CodeOutlined />
    },
    {
      key: '6',
      label: t('fileManager'),
      icon: <FolderOutlined />
    },
    {
      type: 'divider'
    }
  ]

  const pinnedOrderedChats = chats?.filter((chat) => chatsUI[chat.id]?.pinned) || []
  const unpinnedChats = chats?.filter((chat) => !chatsUI[chat.id]?.pinned) || []
  const orderedChats = [...pinnedOrderedChats, ...unpinnedChats]

  const siderChatItems = orderedChats.map((item) => ({
    key: '/chat/' + item.id,
    label: item.title ? item.title : t('newChat'),
    icon: chatsUI[item.id]?.pinned ? <PushpinOutlined /> : collapsed ? <MessageOutlined /> : null
  }))

  const drawerChatItems = orderedChats.map((item) => ({
    key: '/chat/' + item.id,
    label: item.title ? item.title : t('newChat'),
    icon: chatsUI[item.id]?.pinned ? <PushpinOutlined /> : null
  }))

  const siderMenuItems = [...agentItems, ...siderChatItems]
  const drawerMenuItems = [...agentItems, ...drawerChatItems]

  return (
    <Layout className="h-screen w-screen overflow-hidden relative z-0">
      {backgroundPath && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 transform -z-10 bg-no-repeat"
          style={{
            backgroundImage: `url(${getOssBaseUrl() + backgroundPath})`,
            opacity: `${backgroundOpacity}%`,
            filter: `blur(${backgroundBlur}px)`
          }}
        ></div>
      )}
      <Header
        className={clsx(
          'flex items-center justify-between h-16 px-10',
          backgroundPath
            ? 'bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl border-b border-white/60 dark:border-white/16'
            : 'bg-white dark:bg-neutral-900'
        )}
      >
        <div className="flex items-center gap-4">
          <MisakiButton className="hidden md:inline" />
          <Button
            className="md:hidden"
            color="default"
            variant="text"
            size="large"
            icon={<FormOutlined />}
            onClick={() => navigate('/', { viewTransition: true })}
          />
          <Button
            className="md:hidden"
            color="default"
            variant="text"
            size="large"
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          />
        </div>
        <HeaderMiddlePart currentPage={currentPage} />
        <HeaderRightPart currentPage={currentPage} />
      </Header>
      <Layout className="bg-transparent">
        <Drawer
          className=""
          placement="left"
          closable={{ placement: 'end' }}
          size={'70%'}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          destroyOnHidden
          title={<MisakiButton />}
          classNames={{
            title: 'pl-4'
          }}
        >
          <Menu
            className="select-none h-full overflow-y-auto scroll-smooth scrollbar-none bg-transparent mask-b-from-94%"
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => {
              setIsDrawerOpen(false)
              navigate(e.key, { viewTransition: true })
            }}
            mode="inline"
            items={drawerMenuItems}
            disabled={!jwt}
          />
        </Drawer>
        <Sider
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          className={clsx(
            isDrawerOpen ? 'hidden' : 'hidden md:block',
            backgroundPath
              ? 'bg-white/20 dark:bg-neutral-800/20 backdrop-blur-lg border-r border-white/60 dark:border-white/16'
              : 'bg-white dark:bg-neutral-800'
          )}
        >
          <Menu
            className="select-none h-full overflow-y-auto scroll-smooth scrollbar-none bg-transparent mask-b-from-94%"
            theme="light"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key, { viewTransition: true })}
            onAuxClick={
              (e) => console.log(e) // TODO 右键菜单
            }
            mode="inline"
            items={siderMenuItems}
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
