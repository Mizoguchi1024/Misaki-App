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
import { checkIn, getProfile, getSettings } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { messageApi } from '@renderer/messageApi'
import { useFeedbackStore } from '@renderer/store/feedbackStore'
import { listModels } from '@renderer/api/front/model'
import { useModelStore } from '@renderer/store/modelStore'

const { Header, Content, Sider } = Layout

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt, rememberMe, setProfile, reset: resetUserStore } = useUserStore()
  const {
    backgroundPath,
    backgroundOpacity,
    backgroundBlur,
    getOssBaseUrl,
    setSettings,
    reset: resetSettingsStore
  } = useSettingsStore()
  const { chats, setChats, reset: resetChatStore } = useChatStore()
  const { setAssistants, reset: resetAssistantStore } = useAssistantStore()
  const { setModels, reset: resetModelStore } = useModelStore()
  const { reset: resetFeedbackStore } = useFeedbackStore()

  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page

  useEffect(() => {
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
            await checkIn()
            messageApi?.success(t('checkInSuccess'))
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

  const chatItems =
    chats?.map((item) => ({
      key: '/chat/' + item.id.toString(),
      label: item.title ? item.title : t('newChat'),
      icon: <MessageOutlined />
    })) ?? []

  const items = [...agentItems, ...chatItems]

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
          className={
            backgroundPath
              ? 'bg-white/20 dark:bg-neutral-800/20 backdrop-blur-lg border-r border-white/60 dark:border-white/16'
              : 'bg-white dark:bg-neutral-800'
          }
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
