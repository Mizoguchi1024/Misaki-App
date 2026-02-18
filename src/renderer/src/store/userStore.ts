import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LoginResponse } from '@renderer/types/api/auth'
import { UserFrontResponse } from '@renderer/types/api/user'

interface UserState {
  jwt: string | null
  rememberMe: boolean

  id: string | null
  authRole: number | null
  email: string | null
  username: string | null
  gender: number | null
  birthday: string | null
  avatarPath: string | null
  occupation: string | null
  detail: string | null
  token: number | null
  crystal: number | null
  puzzle: number | null
  stardust: number | null
  lastLoginTime: string | null
  lastCheckInDate: string | null
  createTime: string | null
  version: number | null

  setAuthInfo: (loginResponse: LoginResponse) => void
  setRememberMe: (rememberMe: boolean) => void
  setProfile: (userFrontResponse: UserFrontResponse) => void
  logout: () => void
}

const initialState = {
  jwt: null,
  rememberMe: false,

  id: null,
  authRole: null,
  email: null,
  username: null,
  gender: null,
  birthday: null,
  avatarPath: null,
  occupation: null,
  detail: null,
  token: null,
  crystal: null,
  puzzle: null,
  stardust: null,
  lastLoginTime: null,
  lastCheckInDate: null,
  createTime: null,
  version: null
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuthInfo: (loginResponse) => set(loginResponse),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      setProfile: (userFrontResponse) => set(userFrontResponse),
      logout: () => set(initialState)
    }),
    {
      name: 'user-store'
    }
  )
)
