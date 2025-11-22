import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfileVo {
  email?: string
  username?: string
  gender?: number
  birthday?: string
  avatarUrl?: string
  occupation?: string
  detail?: string
  createTime?: string
}

export interface LoginVo {
  token?: string
  authRole?: number
}

interface UserState {
  profile: UserProfileVo | null
  loginInfo: LoginVo | null

  isLoggedIn: boolean

  setProfile: (profile: UserProfileVo) => void
  setLoginInfo: (loginInfo: LoginVo) => void
  updateProfile: (partial: Partial<UserProfileVo>) => void
  logout: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      loginInfo: null,
      isLoggedIn: true,

      setProfile: (profile) => set({ profile }),
      setLoginInfo: (loginInfo) =>
        set({
          loginInfo,
          isLoggedIn: !!loginInfo?.token
        }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...partial } : partial
        })),

      logout: () =>
        set({
          profile: null,
          loginInfo: null,
          isLoggedIn: false
        }),

      reset: () => {
        set({
          profile: null,
          loginInfo: null,
          isLoggedIn: false
        })
        localStorage.removeItem('user-storage')
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        profile: state.profile,
        loginInfo: state.loginInfo,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)
