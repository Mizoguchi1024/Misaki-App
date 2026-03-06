import {
  ChatFrontResponse,
  MessageFrontResponse,
  SendMessageFrontRequest
} from '@renderer/types/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from './settingsStore'
import { useUserStore } from './userStore'

interface ChatState {
  isStreaming: boolean
  chats: ChatFrontResponse[] | null
  messages: MessageFrontResponse[] | null
  fullMessages: MessageFrontResponse[] | null
  parentId: string | null
  pinnedChats: string[] | null

  setChats: (chats: ChatFrontResponse[]) => void
  setMessages: (messages: MessageFrontResponse[]) => void
  setFullMessages: (fullMessages: MessageFrontResponse[]) => void
  setParentId: (parentId: string | null) => void
  setPinnedChats: (pinnedChats: string[]) => void
  reset: () => void
  stopSendMessage: () => void

  sendMessage: (chatId: string, data: SendMessageFrontRequest) => Promise<void>
}

let currentSendMessageController: AbortController | null = null

const initialState = {
  isStreaming: false,
  chats: null,
  messages: null,
  fullMessages: null,
  parentId: null,
  pinnedChats: null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
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
      setFullMessages: (fullMessages) => set({ fullMessages }),
      setParentId: (parentId) => set({ parentId }),
      setPinnedChats: (pinnedChats) => set({ pinnedChats }),
      reset: () => set(initialState),
      stopSendMessage: () => {
        currentSendMessageController?.abort()
        currentSendMessageController = null
        set({ isStreaming: false })
      },

      sendMessage: async (chatId, data) => {
        const controller = new AbortController()
        currentSendMessageController?.abort()
        currentSendMessageController = controller

        try {
          const userMessageId = crypto.randomUUID()
          const aiMessageId = crypto.randomUUID()
          const now = new Date().toISOString()
          set((state) => ({
            isStreaming: true,
            messages: [
              ...(state.messages ?? []),
              {
                id: userMessageId,
                chatId,
                parentId: state.parentId ?? '',
                type: 'USER',
                content: data.content,
                createTime: now
              },
              {
                id: aiMessageId,
                chatId,
                parentId: userMessageId,
                type: 'ASSISTANT',
                content: '',
                createTime: now
              }
            ]
          }))

          const response = await fetch(
            `${useSettingsStore.getState().getApiBaseUrl()}/front/chats/${chatId}/messages`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${useUserStore.getState().jwt}`,
                'X-Timestamp': Date.now().toString(),
                'X-Nonce': crypto.randomUUID()
              },
              body: JSON.stringify({
                ...data,
                parentId: get().parentId ?? undefined
              }),
              signal: controller.signal
            }
          )

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }

          if (!response.body) {
            throw new Error('Response body is empty')
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (!line) continue
              if (!line.startsWith('data:')) continue

              const content = line.replace(/^data:/, '').replace('  ', '  \n')
              if (content === '[DONE]') return

              set((state) => ({
                messages: state.messages?.map((msg) =>
                  msg.id === aiMessageId ? { ...msg, content: msg.content + content } : msg
                )
              }))
            }
          }
          console.log(get().messages)
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') {
            return
          }

          console.error(e)
        } finally {
          if (currentSendMessageController === controller) {
            currentSendMessageController = null
            set({ isStreaming: false })
          }
        }
      }
    }),

    { name: 'chat-store' }
  )
)
