import { ChatFrontResponse, MessageFrontResponse } from '@renderer/types/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  chats: ChatFrontResponse[] | null
  messages: MessageFrontResponse[] | null
  parentId: string | null

  setChats: (chats: ChatFrontResponse[]) => void
  setMessages: (messages: MessageFrontResponse[]) => void
  setParentId: (parentId: string) => void
  reset: () => void
}

const initialState = {
  chats: null,
  messages: null,
  parentId: null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...initialState,

      setChats: (chatFrontResponse) => set({ chats: chatFrontResponse }),
      setMessages: (messageFrontResponse: MessageFrontResponse[]) =>
        set((state) => {
          if (!messageFrontResponse.length) {
            return { messages: [] }
          }

          // 1. 建立 id -> message 映射
          const map = new Map<string, MessageFrontResponse>()
          messageFrontResponse.forEach((msg) => {
            map.set(msg.id, msg)
          })

          // 2. 确定起点
          let currentId = state.parentId || messageFrontResponse[messageFrontResponse.length - 1].id

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
      setParentId: (parentId) => set({ parentId }),
      reset: () => set(initialState)
    }),

    { name: 'chat-store' }
  )
)
