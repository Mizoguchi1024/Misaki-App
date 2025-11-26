import api from './index'
import {
  SettingFrontResponse,
  UpdateSettingFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = (): Promise<UserFrontResponse> =>
  api.get<UserFrontResponse>('/front/users/profiles').then((res) => res.data)

export const updateProfile = (data: UpdateUserFrontRequest): Promise<void> =>
  api.put<void>('/front/users/profiles', data).then((res) => res.data)

export const getSetting = (): Promise<SettingFrontResponse> =>
  api.get<SettingFrontResponse>('/front/users/settings').then((res) => res.data)

export const updateSetting = (data: UpdateSettingFrontRequest): Promise<void> =>
  api.put<void>('/front/users/settings', data).then((res) => res.data)
