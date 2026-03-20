import { App, Button, Drawer, Layout, Menu, MenuProps, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { Outlet, UIMatch, useLocation, useMatches, useNavigate } from 'react-router-dom'
import McpLogo from '@renderer/assets/img/mcp-logo.svg?react'
import Icon, {
  FormOutlined,
  LoadingOutlined,
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
import { listChats } from '@renderer/api/front/chat'
import { checkIn, getProfile, getSettings } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageResult } from '@renderer/types/result'
import { ChatFrontResponse } from '@renderer/types/chat'

const { Header, Content, Sider } = Layout

const chatsPageSize = 15

export default function MainLayout(): React.JSX.Element {
  const { t } = useTranslation('mainLayout')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()
  const [collapsed, setCollapsed] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { jwt, rememberMe, reset: resetUserStore } = useUserStore()
  const { getOssBaseUrl, setStaticMessage } = useSettingsStore()
  const { reset: resetChatStore } = useChatStore()
  const { reset: resetAssistantStore } = useAssistantStore()

  const matches = useMatches() as UIMatch<unknown, { page?: string }>[]
  const currentPage = matches.at(-1)?.handle?.page

  const { data: userData, isSuccess: userDataLoadSuccess } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: !!jwt
  })
  const { lastCheckInDate } = userData?.data ?? {}

  const checkInMutation = useMutation({
    mutationFn: checkIn,
    onSuccess: (data) => {
      appMessage.success(
        t('checkInSuccess', {
          token: data.data.token,
          crystal: data.data.crystal
        })
      )
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { backgroundPath, backgroundBlur, backgroundOpacity } = settingsData?.data ?? {}

  useEffect(() => {
    setStaticMessage(appMessage)

    if (jwt && !rememberMe) {
      resetUserStore()
      resetChatStore()
      resetAssistantStore()
      queryClient.removeQueries()
    }
  }, [])

  useEffect(() => {
    if (userDataLoadSuccess) {
      const isToday = dayjs(lastCheckInDate, 'YYYY-MM-DD').isSame(dayjs(), 'day')
      if (!isToday) {
        checkInMutation.mutate()
      }
    }
  }, [userDataLoadSuccess])

  const {
    data: chatsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam = 1 }): Promise<PageResult<ChatFrontResponse[]>> => {
      return listChats(pageParam, chatsPageSize)
    },
    enabled: !!jwt,
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResult<ChatFrontResponse[]>) => {
      const { pageIndex, total } = lastPage.data
      return +pageIndex * chatsPageSize < +total ? +pageIndex + 1 : undefined
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  const chats = chatsData?.pages.flatMap((page) => page.data.list) ?? []

  useEffect(() => {
    if (!jwt) {
      navigate('/', { viewTransition: true })
    }
  }, [jwt])

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
      key: '/mcp',
      label: t('mcp'),
      icon: <Icon component={McpLogo} />
    },
    {
      type: 'divider'
    }
  ]

  const pinnedChats = chats?.filter((chat) => chat.pinnedFlag) || []
  const unpinnedChats = chats?.filter((chat) => !chat.pinnedFlag) || []
  const orderedChats = [...pinnedChats, ...unpinnedChats]

  const siderChatItems = orderedChats.map((item) => ({
    key: '/chat/' + item.id,
    label: item.title ? item.title : t('newChat'),
    icon: item.pinnedFlag ? <PushpinOutlined /> : collapsed ? <MessageOutlined /> : null
  }))

  const drawerChatItems = orderedChats.map((item) => ({
    key: '/chat/' + item.id,
    label: item.title ? item.title : t('newChat'),
    icon: item.pinnedFlag ? <PushpinOutlined /> : null
  }))

  const siderMenuItems = [...agentItems, ...siderChatItems]
  const drawerMenuItems = [...agentItems, ...drawerChatItems]

  const sentinelRef = useRef(null)
  const scrollableDivRef = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage()
        }
      },
      {
        root: scrollableDivRef.current, // 默认是浏览器视口，如果是局部容器，请传容器的 ref.current
        rootMargin: '20px', // 提前 20px 触发，优化体验
        threshold: 0.1 // 哨兵出现 10% 时触发
      }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current)
    }
  }, [isFetchingNextPage])

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
          title={<MisakiButton onClickCallback={() => setIsDrawerOpen(false)} />}
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
          <div
            ref={scrollableDivRef}
            className="h-full overflow-y-auto scroll-smooth scrollbar-none mask-b-from-86%"
          >
            <Menu
              className=" bg-transparent select-none"
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
            <div ref={sentinelRef} className="h-2.5">
              {isFetchingNextPage && (
                <div className="text-center">
                  <Spin indicator={<LoadingOutlined spin />} />
                </div>
              )}
            </div>
          </div>
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
