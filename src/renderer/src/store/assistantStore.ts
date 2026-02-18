import { AssistantFrontResponse } from '@renderer/types/api/assistant'
import { Assistant } from '@renderer/types/entity/assistant'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface assistantState {
  assistants: Assistant[] | null
  publicAssistants: Assistant[] | null

  setAssistants: (assistantFrontResponse: AssistantFrontResponse[]) => void
  setPublicAssistants: (assistantFrontResponse: AssistantFrontResponse[]) => void
  reset: () => void
}

const initialState = {
  assistants: null,
  publicAssistants: null
}

export const useAssistantStore = create<assistantState>()(
  persist(
    (set) => ({
      ...initialState,

      setAssistants: (assistantFrontResponse) => set({ assistants: assistantFrontResponse }),
      setPublicAssistants: (assistantFrontResponse) => set({ publicAssistants: assistantFrontResponse }),
      reset: () => set(initialState)
    }),
    {
      name: 'assistant-storage'
    }
  )
)
