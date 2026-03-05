import { useChatStore } from '@renderer/store/chatStore'
import { Input, InputRef } from 'antd'
import { useParams } from 'react-router-dom'
import AssistantScrollList from './AssistantScrollList'
import { useTranslation } from 'react-i18next'
import { listChats, updateChatTitle } from '@renderer/api/front/chat'
import { useEffect, useRef, useState } from 'react'

export default function HeaderMiddlePart({ currentPage }): React.JSX.Element {
  const { t } = useTranslation('headerMiddlePart')
  const { chats, setChats } = useChatStore()
  const { id: chatId } = useParams()
  const [chatTitleInput, setChatTitleInput] = useState(
    chats?.find((chat) => chat.id === chatId)?.title || t('newChat')
  )
  const chatTitleInputRef = useRef<InputRef>(null)

  useEffect(() => {
    const load = async (): Promise<void> => {
      setChatTitleInput(chats?.find((chat) => chat.id === chatId)?.title || t('newChat'))
    }

    load()
  }, [chatId])

  switch (currentPage) {
    case 'chat':
      return (
        <div className="absolute left-1/2 -translate-x-1/2 h-16">
          <Input
            ref={chatTitleInputRef}
            variant="borderless"
            className="font-medium field-sizing-content"
            value={chatTitleInput}
            onChange={(e) => setChatTitleInput(e.target.value)}
            onClick={() =>
              setChatTitleInput(chats?.find((chat) => chat.id === chatId)?.title ?? '')
            }
            onPressEnter={() => chatTitleInputRef.current?.blur()}
            onBlur={async () => {
              if (!chatTitleInput) {
                setChatTitleInput(chats?.find((chat) => chat.id === chatId)?.title || t('newChat'))
                return
              }
              if (chatTitleInput === chats?.find((chat) => chat.id === chatId)?.title) {
                return
              }
              try {
                await updateChatTitle(chatId!, {
                  title: chatTitleInput,
                  version: chats?.find((chat) => chat.id === chatId)?.version ?? 0
                })
                const chatRes = await listChats()
                setChats(chatRes.data)
              } catch {
                return
              }
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
