import { AssistantFrontResponse } from '@renderer/types/api/assistant'
import { Assistant } from '@renderer/types/entity/assistant'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssistantState {
  assistants: Assistant[] | null
  publicAssistants: Assistant[] | null

  assistant: Assistant | null

  setAssistants: (assistantFrontResponse: AssistantFrontResponse[]) => void
  setPublicAssistants: (assistantFrontResponse: AssistantFrontResponse[]) => void
  setAssistant: (assistant: AssistantFrontResponse | null) => void
  reset: () => void
}

const initialState = {
  assistants: null,
  publicAssistants: null,
  assistant: null
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      ...initialState,

      setAssistants: (assistantFrontResponse) => set({ assistants: assistantFrontResponse }),
      setPublicAssistants: (assistantFrontResponse) =>
        set({ publicAssistants: assistantFrontResponse }),
      setAssistant: (assistant) => set({ assistant }),
      reset: () => set(initialState)
    }),
    {
      name: 'assistant-storage'
    }
  )
)
