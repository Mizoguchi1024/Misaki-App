import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssistantState {
  currentAssistantId: string

  setCurrentAssistantId: (currentAssistantId: string) => void
  reset: () => void
}

const initialState = {
  currentAssistantId: ''
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentAssistantId: (currentAssistantId) => set({ currentAssistantId }),
      reset: () => set(initialState)
    }),
    {
      name: 'assistant-store'
    }
  )
)
