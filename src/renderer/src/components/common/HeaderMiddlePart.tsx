import { Input, InputRef } from 'antd'
import { flattenChats, useChatsInfiniteQuery } from '@renderer/hooks/useChatsInfiniteQuery'
import { useParams } from 'react-router-dom'
import AssistantScrollList from './AssistantScrollList'
import { useTranslation } from 'react-i18next'
import { updateChat } from '@renderer/api/front/chat'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Result } from '@renderer/types/result'
import { UpdateChatFrontRequest } from '@renderer/types/chat'

export default function HeaderMiddlePart({ currentPage }): React.JSX.Element {
  const { t } = useTranslation('headerMiddlePart')
  const { id: chatId } = useParams()
  const chatTitleInputRef = useRef<InputRef>(null)
  const queryClient = useQueryClient()

  const { data: chatsData } = useChatsInfiniteQuery()
  const chat = flattenChats(chatsData?.pages).find((item) => item.id === chatId)

  const [chatTitleInput, setChatTitleInput] = useState(chat?.title || t('newChat'))

  const updateChatTitleMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateChatFrontRequest }
  >({
    mutationFn: ({ id, data }) => updateChat(id, data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['chats'] })
    }
  })

  useEffect(() => {
    const load = (): void => {
      setChatTitleInput(chat?.title || t('newChat'))
    }

    load()
  }, [chat])

  switch (currentPage) {
    case 'chat':
      return (
        <div className="absolute left-1/2 -translate-x-1/2 h-16">
          <Input
            ref={chatTitleInputRef}
            variant="borderless"
            maxLength={50}
            spellCheck={false}
            className="font-medium field-sizing-content"
            value={chatTitleInput}
            onChange={(e) => setChatTitleInput(e.target.value)}
            onClick={() => setChatTitleInput(chat?.title ?? '')}
            onPressEnter={() => chatTitleInputRef.current?.blur()}
            onBlur={async () => {
              if (!chatTitleInput) {
                setChatTitleInput(chat?.title || t('newChat'))
                return
              }
              if (chatTitleInput === chat?.title) {
                return
              }
              updateChatTitleMutation.mutate({
                id: chat!.id,
                data: {
                  title: chatTitleInput,
                  version: chat!.version
                }
              })
            }}
          />
        </div>
      )
    case 'misaki':
      return (
        <div className="absolute left-1/2 -translate-x-1/2 h-16">
          <AssistantScrollList />
        </div>
      )
    default:
      return <></>
  }
}
