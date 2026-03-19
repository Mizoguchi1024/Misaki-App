import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  jwt: string | null
  rememberMe: boolean

  setJwt: (jwt: string) => void
  setRememberMe: (rememberMe: boolean) => void
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
      reset: () => set(initialState)
    }),
    {
      name: 'user-store'
    }
  )
)
