import { LoadingOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { searchChats } from '@renderer/api/front/chat'
import EmptyState from '@renderer/components/common/EmptyState'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { ChatFrontResponse } from '@renderer/types/chat'
import { Card, Spin } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Search(): React.JSX.Element {
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const { backgroundPath } = useSettingsStore()
  const { chats } = useChatStore()

  const [results, setResults] = useState<ChatFrontResponse[] | null>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setResults(chats)
  }, [chats])

  return (
    <div className="h-full relative">
      <div className="h-full pt-16 pb-40 flex flex-col items-center gap-5 overflow-y-auto scrollbar-style mask-b-from-84%">
        {results && results.length > 0 ? (
          results.map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/chat/${item.id}`, { viewTransition: true })}
              className={clsx(
                backgroundPath &&
                  'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] backdrop-blur-xl hover:backdrop-blur-3xl',
                'w-2/3 select-none cursor-pointer hover:shadow-xl dark:hover:shadow-neutral-600 ease-in-out duration-500'
              )}
            >
              <Spin spinning={loading} delay={250} indicator={<LoadingOutlined spin />}>
                <Card.Meta
                  avatar={<MessageOutlined className="text-2xl" />}
                  title={item.title || t('newChat')}
                  description={item.updateTime}
                  classNames={{
                    avatar: 'flex items-center justify-center'
                  }}
                />
              </Spin>
            </Card>
          ))
        ) : (
          <EmptyState className="w-full h-full text-2xl" />
        )}
      </div>
      <div className="absolute bottom-1/12 left-1/2 -translate-x-1/2 w-4/7">
        <Sender
          className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          placeholder={t('searchChats')}
          loading={loading}
          onSubmit={async (value) => {
            if (!value.trim()) {
              setResults(chats)
              return
            }
            try {
              setLoading(true)
              setResults([])
              const chatsRes = await searchChats(value)
              setResults(chatsRes.data)
            } finally {
              setLoading(false)
            }
          }}
          onCancel={() => setLoading(false)}
          suffix={(_, info) => {
            const { SendButton, LoadingButton } = info.components
            return loading ? (
              <LoadingButton />
            ) : (
              <SendButton type="primary" icon={<SearchOutlined />} disabled={false} />
            )
          }}
        />
      </div>
    </div>
  )
}
