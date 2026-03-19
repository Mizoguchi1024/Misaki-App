import { LoadingOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { listChats, searchChats } from '@renderer/api/front/chat'
import EmptyState from '@renderer/components/common/EmptyState'
import { Card, Skeleton, Spin } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getSettings } from '@renderer/api/front/user'
import { PageResult } from '@renderer/types/result'
import { ChatFrontResponse } from '@renderer/types/chat'

const chatsPageSize = 10

export default function Search(): React.JSX.Element {
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const {
    data: chatsData,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam = 1 }): Promise<PageResult<ChatFrontResponse[]>> => {
      return listChats(pageParam, chatsPageSize)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { pageIndex, total } = lastPage.data
      if (pageIndex * chatsPageSize >= +total) {
        return undefined
      }
      return pageIndex + 1
    }
  })
  const chats = chatsData?.pages.flatMap((page) => page.data.list) ?? []

  const { data: resultsData, isLoading } = useQuery({
    queryKey: ['chats', keyword],
    queryFn: () => searchChats(keyword),
    enabled: !!keyword
  })
  const results = resultsData?.data ?? []

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const backgroundPath = settingsData?.data.backgroundPath

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
                  <Skeleton loading={isLoading} active paragraph={{ rows: 1 }}>
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
        <InfiniteScroll
          dataLength={chats.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Spin indicator={<LoadingOutlined spin />} />}
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
        </InfiniteScroll>
      ) : (
        <EmptyState className="w-full h-full text-2xl" logoClassName="w-32" />
      )}
      <Sender
        className="absolute bottom-1/12 left-1/2 -translate-x-1/2 max-w-md md:max-w-xl bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
        placeholder={t('searchChats')}
        loading={isLoading}
        onSubmit={(value) => setKeyword(value)}
        suffix={(_, info) => {
          const { SendButton, LoadingButton } = info.components
          return isLoading ? (
            <LoadingButton />
          ) : (
            <SendButton type="primary" icon={<SearchOutlined />} disabled={false} />
          )
        }}
      />
    </div>
  )
}
