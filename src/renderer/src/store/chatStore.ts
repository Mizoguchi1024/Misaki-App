import { ChatFrontResponse, MessageFrontResponse } from '@renderer/types/api/chat'
import { Chat } from '@renderer/types/entity/chat'
import { Message } from '@renderer/types/entity/message'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  chats: Chat[]
  messages: Message[]
  parentId: string

  setChats: (res: ChatFrontResponse[]) => void
  setMessages: (res: MessageFrontResponse[]) => void
  setParentId: (id: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      messages: [],
      parentId: '',
      setChats: (res) => {
        const chats: Chat[] = res.map((item) => ({
          id: item.id,
          title: item.title,
          createTime: item.createTime
        }))

        set({ chats })
      },
      setMessages: (res: MessageFrontResponse[]) =>
        set((state) => {
          if (!res.length) {
            return { messages: [] }
          }

          // 1. 建立 id -> message 映射
          const map = new Map<string, MessageFrontResponse>()
          res.forEach((msg) => {
            map.set(msg.id, msg)
          })

          // 2. 确定起点
          let currentId = state.parentId || res[res.length - 1].id

          const path: MessageFrontResponse[] = []

          // 3. 向上回溯
          while (currentId) {
            const msg = map.get(currentId)
            if (!msg) break

            path.push(msg)
            currentId = msg.parentId ?? ''
          }

          // 4. 反转成从根到当前
          path.reverse()

          return {
            messages: path,
            parentId: path.length ? path[path.length - 1].id : ''
          }
        }),
      setParentId: (parentId) => set({ parentId })
    }),

    { name: 'chat-store' }
  )
)
