import { MessageOutlined, SearchOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { searchChats } from '@renderer/api/front/chat'
import EmptyState from '@renderer/components/common/EmptyState'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { ChatFrontResponse } from '@renderer/types/api/chat'
import { Card } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Search(): React.JSX.Element {
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const { backgroundPath } = useSettingsStore()
  const { chats } = useChatStore()

  const [results, setResults] = useState<ChatFrontResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setResults(chats)
  }, [chats])

  const renderCards = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={`loading-${index}`} loading={true} className="flex-none shadow-sm" />
      ))
    }

    if (results && results.length > 0) {
      return results.map((item) => (
        <Card
          key={item.id}
          onClick={() => navigate(`/chat/${item.id}`, { viewTransition: true })}
          className={clsx(
            backgroundPath &&
              'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 backdrop-blur-xl hover:backdrop-blur-3xl',
            'flex-none select-none cursor-pointer shadow-sm hover:shadow-lg dark:hover:shadow-neutral-700 transition-all duration-500'
          )}
        >
          <Card.Meta
            avatar={<MessageOutlined className="text-2xl h-full" />}
            title={item.title || t('newChat')}
            description={t('lastTalk') + ': ' + item.updateTime}
          />
        </Card>
      ))
    }

    return <EmptyState className="text-3xl" />
  }

  return (
    <div className="h-full relative">
      <div className="h-full px-32 pt-8 pb-32 flex flex-col gap-4 overflow-y-auto">
        {renderCards()}
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4/7">
        <Sender
          className={clsx(
            backgroundPath
              ? 'bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xs hover:backdrop-blur-sm '
              : 'bg-white dark:bg-neutral-800',
            'transition-all duration-500'
          )}
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
            } catch (error) {
              console.error('Search failed:', error)
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
