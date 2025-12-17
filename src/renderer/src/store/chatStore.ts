import { ChatFrontResponse } from '@renderer/types/api/chat'
import { Chat } from '@renderer/types/entity/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  chats: Chat[]

  setChats: (res: ChatFrontResponse[]) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      setChats: (res) => {
        const chats: Chat[] = res.map((item) => ({
          id: item.id,
          title: item.title,
          createTime: item.createTime
        }))

        set({ chats })
      }
    }),
    { name: 'chat-store' }
  )
)
