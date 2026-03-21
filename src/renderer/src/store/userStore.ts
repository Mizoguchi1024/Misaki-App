import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAssistantStore } from './assistantStore'
import { useChatStore } from './chatStore'
import { router } from '@renderer/router'
import { clearPersistedQueryCache } from '@renderer/queryClient'

interface UserState {
  jwt: string | null
  rememberMe: boolean

  setJwt: (jwt: string) => void
  setRememberMe: (rememberMe: boolean) => void
  logout: () => void
  reset: () => void
}

const initialState = {
  jwt: null,
  rememberMe: false
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setJwt: (jwt) => set({ jwt }),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      logout: () => {
        router.navigate('/', { viewTransition: true })
        useUserStore.getState().reset()
        useChatStore.getState().reset()
        useAssistantStore.getState().reset()
        clearPersistedQueryCache()
      },
      reset: () => set(initialState)
    }),
    {
      name: 'user-store',
      merge: (persistedState, currentState) => {
        const nextState = {
          ...currentState,
          ...(persistedState as Partial<UserState> | undefined)
        }

        if (!nextState.rememberMe) {
          return {
            ...nextState,
            jwt: null
          }
        }

        return nextState
      }
    }
  )
)
