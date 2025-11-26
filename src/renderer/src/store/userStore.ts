import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LoginResponse } from '@renderer/types/api/auth'
import { UserFrontResponse } from '@renderer/types/api/user'

interface UserStore {
  token?: string
  authRole?: number

  email?: string
  username?: string
  gender?: number
  birthday?: string
  avatarUrl?: string
  occupation?: string
  detail?: string
  createTime?: string

  setAuthInfo: (authInfo: LoginResponse) => void
  setProfile: (profile: UserFrontResponse) => void
  updateProfile: (partial: Partial<UserFrontResponse>) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      setAuthInfo: (authInfo) =>
        set(() => ({
          token: authInfo?.token,
          authRole: authInfo?.authRole
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
          token: null as any,
          authRole: null as any,
          email: null as any,
          username: null as any,
          gender: null as any,
          birthday: null as any,
          avatarUrl: null as any,
          occupation: null as any,
          detail: null as any,
          createTime: null as any
        }))
    }),
    {
      name: 'user-storage'
    }
  )
)
