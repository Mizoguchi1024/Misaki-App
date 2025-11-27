import { Result } from '@renderer/types/api/base'
import api from '../index'
import {
  SettingsFrontResponse,
  UpdateSettingsFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = (): Promise<Result<UserFrontResponse>> =>
  api.get<Result<UserFrontResponse>>('/front/users/profiles').then((res) => res.data)

export const updateProfile = (data: UpdateUserFrontRequest): Promise<Result<void>> =>
  api.put<Result<void>>('/front/users/profiles', data).then((res) => res.data)

export const getSettings = (): Promise<Result<SettingsFrontResponse>> =>
  api.get<Result<SettingsFrontResponse>>('/front/users/settings').then((res) => res.data)

export const updateSettings = (data: UpdateSettingsFrontRequest): Promise<Result<void>> =>
  api.put<Result<void>>('/front/users/settings', data).then((res) => res.data)

export const deleteUser = (): Promise<Result<void>> =>
  api.delete<Result<void>>('/front/users').then((res) => res.data)
