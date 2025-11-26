import api from '.'
import { ApiResponse } from '@renderer/types/api/common'
import {
  SettingFrontResponse,
  UpdateSettingFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = (data: null) =>
  api.post<ApiResponse<UserFrontResponse>>('/front/users', data)

export const updateProfile = (data: UpdateUserFrontRequest) =>
  api.put<ApiResponse<void>>('/front/users', data)

export const getSetting = (data: null) =>
  api.post<ApiResponse<SettingFrontResponse>>('/front/users/settings', data)

export const updateSetting = (data: UpdateSettingFrontRequest) =>
  api.put<ApiResponse<void>>('/front/users/settings', data)
