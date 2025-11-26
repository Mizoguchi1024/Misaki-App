import api from '.'
import { ApiResponse } from '@renderer/types/api/common'
import {
  SettingFrontResponse,
  UpdateSettingFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = (): Promise<ApiResponse<UserFrontResponse>> =>
  api.get<ApiResponse<UserFrontResponse>>('/front/users').then((res) => res.data)

export const updateProfile = (data: UpdateUserFrontRequest): Promise<ApiResponse<void>> =>
  api.put<ApiResponse<void>>('/front/users', data).then((res) => res.data)

export const getSetting = (): Promise<ApiResponse<SettingFrontResponse>> =>
  api.get<ApiResponse<SettingFrontResponse>>('/front/users/settings').then((res) => res.data)

export const updateSetting = (data: UpdateSettingFrontRequest): Promise<ApiResponse<void>> =>
  api.put<ApiResponse<void>>('/front/users/settings', data).then((res) => res.data)
