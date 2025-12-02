import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LoginResponse } from '@renderer/types/api/auth'
import { UserFrontResponse } from '@renderer/types/api/user'

interface UserState {
  token?: string
  authRole?: number

  rememberMe?: boolean

  email?: string
  username?: string
  gender?: number
  birthday?: string
  avatarUrl?: string
  occupation?: string
  detail?: string
  createTime?: string

  setAuthInfo: (authInfo: LoginResponse) => void
  setRememberMe: (rememberMe: boolean) => void
  setProfile: (profile: UserFrontResponse) => void
  updateProfile: (partial: Partial<UserFrontResponse>) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      rememberMe: false,

      setAuthInfo: (authInfo) =>
        set(() => ({
          token: authInfo?.token,
          authRole: authInfo?.authRole
        })),

      setRememberMe: (rememberMe) =>
        set(() => ({
          rememberMe: rememberMe
        })),

      setProfile: (profile) =>
        set(() => ({
          email: profile?.email,
          username: profile?.username,
          gender: profile?.gender,
          birthday: profile?.birthday,
          avatarUrl: profile?.avatarUrl,
          occupation: profile?.occupation,
          detail: profile?.detail,
          createTime: profile?.createTime
        })),

      updateProfile: (partial) =>
        set((state) => ({
          email: partial.email ?? state.email,
          username: partial.username ?? state.username,
          gender: partial.gender ?? state.gender,
          birthday: partial.birthday ?? state.birthday,
          avatarUrl: partial.avatarUrl ?? state.avatarUrl,
          occupation: partial.occupation ?? state.occupation,
          detail: partial.detail ?? state.detail,
          createTime: partial.createTime ?? state.createTime
        })),

      logout: () =>
        set(() => ({
          token: undefined,
          authRole: undefined,
          rememberMe: false,
          email: undefined,
          username: undefined,
          gender: undefined,
          birthday: undefined,
          avatarUrl: undefined,
          occupation: undefined,
          detail: undefined,
          createTime: undefined
        }))
    }),
    {
      name: 'user-store'
    }
  )
)
