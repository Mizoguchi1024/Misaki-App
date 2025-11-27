import api from '../index'
import {
  SettingsFrontResponse,
  UpdateSettingsFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = (): Promise<UserFrontResponse> =>
  api.get<UserFrontResponse>('/front/users/profiles').then((res) => res.data)

export const updateProfile = (data: UpdateUserFrontRequest): Promise<void> =>
  api.put<void>('/front/users/profiles', data).then((res) => res.data)

export const getSettings = (): Promise<SettingsFrontResponse> =>
  api.get<SettingsFrontResponse>('/front/users/settings').then((res) => res.data)

export const updateSettings = (data: UpdateSettingsFrontRequest): Promise<void> =>
  api.put<void>('/front/users/settings', data).then((res) => res.data)

export const deleteUser = (): Promise<void> =>
  api.delete<void>('/front/users').then((res) => res.data)
