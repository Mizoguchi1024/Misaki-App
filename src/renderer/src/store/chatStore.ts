import { MessageFrontResponse, SendMessageFrontRequest } from '@renderer/types/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from './settingsStore'
import { useUserStore } from './userStore'

interface ChatState {
  isStreaming: boolean
  chatsUI: Record<string, { pinned: boolean; prompts: string[] }>
  parentId: string | null
  prefix: string

  setParentId: (parentId: string | null) => void
  setPrefix: (prefix: string) => void
  setChatPinned: (chatId: string, pinned: boolean) => void
  setChatPrompts: (chatId: string, prompts: string[]) => void
  reset: () => void
  stopSendMessage: () => void

  sendMessage: (chatId: string, data: SendMessageFrontRequest) => Promise<void>
}

let currentSendMessageController: AbortController | null = null

const initialState = {
  isStreaming: false,
  chats: null,
  chatsUI: {},
  messages: null,
  fullMessages: null,
  prompts: null,
  parentId: null,
  prefix: ''
}

export const CodeMap = {
  ['```java']: 'Java',
  ['```python']: 'Python',
  ['```cpp']: 'C++',
  ['```typescript']: 'TypeScript',
  ['```javascript']: 'JavaScript'
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...initialState,

      setMessagesFromFull: (messageFrontResponse: MessageFrontResponse[]) =>
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
      setChatPinned: (id, pinned) =>
        set((state) => ({
          chatsUI: {
            ...state.chatsUI,
            [id]: {
              ...state.chatsUI[id],
              pinned
            }
          }
        })),
      setChatPrompts: (id, prompts) =>
        set((state) => ({
          chatsUI: {
            ...state.chatsUI,
            [id]: {
              ...state.chatsUI[id],
              prompts
            }
          }
        })),
      setPrefix: (prefix) => set({ prefix }),
      reset: () => set(initialState),
      stopSendMessage: () => {
        currentSendMessageController?.abort()
        currentSendMessageController = null
        setTimeout(() => set({ isStreaming: false }), 500)
      },

      sendMessage: async (chatId, data) => {
        const controller = new AbortController()
        currentSendMessageController?.abort()
        currentSendMessageController = controller

        try {
          const userMessageId = crypto.randomUUID()
          const assistantMessageId = crypto.randomUUID()
          const now = new Date().toISOString()
          set((state) => ({
            isStreaming: true,
            messages: [
              ...(state.messages ?? []),
              {
                id: userMessageId,
                chatId,
                parentId: state.parentId ?? null,
                type: 'USER',
                content: data.content,
                createTime: now
              },
              {
                id: assistantMessageId,
                chatId,
                parentId: userMessageId,
                type: 'ASSISTANT',
                content: '',
                createTime: now
              }
            ],
            fullMessages: [
              ...(state.fullMessages ?? []),
              {
                id: userMessageId,
                chatId,
                parentId: state.parentId ?? null,
                type: 'USER',
                content: data.content,
                createTime: now
              },
              {
                id: assistantMessageId,
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
              body: JSON.stringify(data),
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

            const lines = buffer.split('data:')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (!line) continue
              let content = ''
              if (line.endsWith('\n\n')) {
                content = line.slice(0, -2)
              } else {
                content = line
              }
              if (content === '[DONE]') return

              set((state) => ({
                messages: state.messages?.map((msg) =>
                  msg.id === assistantMessageId ? { ...msg, content: msg.content + content } : msg
                )
              }))
            }
          }
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
