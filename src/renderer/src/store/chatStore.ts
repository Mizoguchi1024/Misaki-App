import { MessageFrontResponse, SendMessageFrontRequest } from '@renderer/types/chat'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSettingsStore } from './settingsStore'
import { useUserStore } from './userStore'

interface ChatState {
  isStreaming: boolean
  prefix: string
  newMessages: MessageFrontResponse[]

  setPrefix: (prefix: string) => void

  setNewMessages: (newMessages: MessageFrontResponse[]) => void
  sendMessage: (chatId: string, data: SendMessageFrontRequest) => Promise<void>
  stopSendMessage: () => void

  reset: () => void
}

let currentSendMessageController: AbortController | null = null

const initialState = {
  isStreaming: false,
  prompts: null,
  prefix: '',
  newMessages: []
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

      setPrefix: (prefix) => set({ prefix }),
      stopSendMessage: () => {
        currentSendMessageController?.abort()
        currentSendMessageController = null
        setTimeout(() => set({ isStreaming: false }), 500)
      },
      setNewMessages: (newMessages) => set({ newMessages }),
      sendMessage: async (chatId, data) => {
        const controller = new AbortController()
        currentSendMessageController?.abort()
        currentSendMessageController = controller

        try {
          const userMessageId = crypto.randomUUID()
          const assistantMessageId = crypto.randomUUID()
          const now = new Date().toISOString()
          set(() => ({
            isStreaming: true,
            newMessages: [
              {
                id: userMessageId,
                chatId,
                parentId: data.parentId ?? null,
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
                newMessages: state.newMessages?.map((msg) =>
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
      },
      reset: () => set(initialState)
    }),

    { name: 'chat-store' }
  )
)
