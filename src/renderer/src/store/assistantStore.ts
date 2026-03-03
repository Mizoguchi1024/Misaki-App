import { AssistantFrontResponse } from '@renderer/types/assistant'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssistantState {
  assistants: AssistantFrontResponse[] | null
  publicAssistants: AssistantFrontResponse[] | null

  assistant: AssistantFrontResponse | null

  setAssistants: (assistants: AssistantFrontResponse[]) => void
  setPublicAssistants: (assistantFrontResponse: AssistantFrontResponse[]) => void
  setAssistant: (assistantFrontResponse: AssistantFrontResponse | null) => void
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

      setAssistants: (assistants) => set({ assistants }),
      setPublicAssistants: (publicAssistants) => set({ publicAssistants }),
      setAssistant: (assistant) => set({ assistant }),
      reset: () => set(initialState)
    }),
    {
      name: 'assistant-storage'
    }
  )
)
