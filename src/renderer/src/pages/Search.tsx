import {
  CloseOutlined,
  LoadingOutlined,
  MessageOutlined,
  PushpinOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { searchChats } from '@renderer/api/front/chat'
import EmptyState from '@renderer/components/common/EmptyState'
import { flattenChats, useChatsInfiniteQuery } from '@renderer/hooks/useChatsInfiniteQuery'
import { Card, Skeleton, Space, Spin } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getSettings } from '@renderer/api/front/user'

export default function Search(): React.JSX.Element {
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const [searchInputValue, setSearchInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const scrollableDivRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    data: chatsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChatsInfiniteQuery()
  const chats = flattenChats(chatsData?.pages)

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
    if (!searchInputValue) {
      setTimeout(() => setKeyword(''))
    }
  }, [searchInputValue])

  useEffect(() => {
    const root = scrollableDivRef.current
    const sentinel = sentinelRef.current

    if (!root || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage()
        }
      },
      {
        root,
        threshold: 0.5
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
                      avatar={
                        item.pinnedFlag ? (
                          <PushpinOutlined className="text-2xl" />
                        ) : (
                          <MessageOutlined className="text-2xl" />
                        )
                      }
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
          <div className="px-12 pt-12 w-full md:max-w-2xl md:mx-auto md:px-0">
            {chats.map((item) => (
              <Card
                key={item.id}
                onMouseUp={() => navigate(`/chat/${item.id}`, { viewTransition: true })}
                className={clsx(
                  backgroundPath &&
                    'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] backdrop-blur-xl hover:backdrop-blur-3xl',
                  'mb-4 select-none cursor-pointer hover:shadow-xl ease-in-out duration-250 active:scale-96'
                )}
              >
                <Card.Meta
                  avatar={
                    item.pinnedFlag ? (
                      <PushpinOutlined className="text-2xl" />
                    ) : (
                      <MessageOutlined className="text-2xl" />
                    )
                  }
                  title={item.title || t('newChat')}
                  description={item.updateTime}
                  classNames={{
                    avatar: 'flex items-center justify-center'
                  }}
                />
              </Card>
            ))}
          </div>
          <div ref={sentinelRef} className="h-40 w-full text-center">
            {isFetchingNextPage && <Spin indicator={<LoadingOutlined spin />} size="large" />}
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
