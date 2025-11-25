import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfileResponse {
  email?: string
  username?: string
  gender?: number
  birthday?: string
  avatarUrl?: string
  occupation?: string
  detail?: string
  createTime?: string
}

export interface LoginResponse {
  token?: string
  authRole?: number
}

interface UserState {
  profile: UserProfileResponse | null
  loginInfo: LoginResponse | null

  isLoggedIn: boolean

  setProfile: (profile: UserProfileResponse) => void
  setLoginInfo: (loginInfo: LoginResponse) => void
  updateProfile: (partial: Partial<UserProfileResponse>) => void
  logout: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      loginInfo: null,
      isLoggedIn: false,

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
