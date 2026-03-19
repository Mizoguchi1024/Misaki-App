import { CloseOutlined, LoadingOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { listChats, searchChats } from '@renderer/api/front/chat'
import EmptyState from '@renderer/components/common/EmptyState'
import { Card, Skeleton, Space, Spin } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getSettings } from '@renderer/api/front/user'
import { PageResult } from '@renderer/types/result'
import { ChatFrontResponse } from '@renderer/types/chat'

const chatsPageSize = 15

export default function Search(): React.JSX.Element {
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const [searchInputValue, setSearchInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const sentinelRef = useRef(null)
  const scrollableDivRef = useRef(null)

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
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResult<ChatFrontResponse[]>) => {
      const { pageIndex, total } = lastPage.data
      return +pageIndex * chatsPageSize < +total ? +pageIndex + 1 : undefined
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  const chats = chatsData?.pages.flatMap((page) => page.data.list) ?? []

  const { data: resultsData, isFetching } = useQuery({
    queryKey: ['chats', keyword],
    queryFn: () => searchChats(keyword),
    placeholderData: keepPreviousData,
    enabled: !!keyword
  })
  const results = resultsData?.data ?? []

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const backgroundPath = settingsData?.data.backgroundPath

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
    <div className="h-full relative">
      {keyword ? (
        results.length > 0 ? (
          <div className="px-4 h-full overflow-y-auto scrollbar-style mask-end">
            <div className="px-12 pt-12 pb-40 w-full md:max-w-2xl md:mx-auto md:px-0">
              {results.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => navigate(`/chat/${item.id}`, { viewTransition: true })}
                  className={clsx(
                    backgroundPath &&
                      'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] backdrop-blur-xl hover:backdrop-blur-3xl',
                    'mb-4 select-none cursor-pointer hover:shadow-xl ease-in-out duration-250 active:scale-96'
                  )}
                >
                  <Skeleton loading={isFetching} active paragraph={{ rows: 1 }}>
                    <Card.Meta
                      avatar={<MessageOutlined className="text-2xl" />}
                      title={item.title || t('newChat')}
                      description={item.updateTime}
                      classNames={{
                        avatar: 'flex items-center justify-center'
                      }}
                    />
                  </Skeleton>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState className="w-full h-full text-2xl" logoClassName="w-32" />
        )
      ) : chats.length > 0 ? (
        <div
          ref={scrollableDivRef}
          className="px-4 h-full overflow-y-auto scrollbar-style mask-end"
        >
          <div className="px-12 pt-12 pb-40 w-full md:max-w-2xl md:mx-auto md:px-0">
            {chats.map((item) => (
              <Card
                key={item.id}
                onClick={() => navigate(`/chat/${item.id}`, { viewTransition: true })}
                className={clsx(
                  backgroundPath &&
                    'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] backdrop-blur-xl hover:backdrop-blur-3xl',
                  'mb-4 select-none cursor-pointer hover:shadow-xl ease-in-out duration-250 active:scale-96'
                )}
              >
                <Card.Meta
                  avatar={<MessageOutlined className="text-2xl" />}
                  title={item.title || t('newChat')}
                  description={item.updateTime}
                  classNames={{
                    avatar: 'flex items-center justify-center'
                  }}
                />
              </Card>
            ))}
          </div>
          <div ref={sentinelRef} className="h-2.5">
            {isFetchingNextPage && (
              <div className="text-center">
                <Spin indicator={<LoadingOutlined spin />} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState className="w-full h-full text-2xl" logoClassName="w-32" />
      )}
      <Sender
        className="absolute bottom-1/12 left-1/2 -translate-x-1/2 max-w-md md:max-w-xl bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
        placeholder={t('searchChats')}
        loading={isFetching}
        value={searchInputValue}
        onChange={(value) => setSearchInputValue(value)}
        onSubmit={(value) => setKeyword(value)}
        suffix={(_, info) => {
          const { SendButton, LoadingButton, ClearButton } = info.components
          return (
            <Space size="small">
              {searchInputValue && <ClearButton icon={<CloseOutlined />} shape="circle" />}
              {isFetching ? <LoadingButton /> : <SendButton icon={<SearchOutlined />} />}
            </Space>
          )
        }}
      />
    </div>
  )
}
