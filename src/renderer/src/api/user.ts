import api from '.'
import { ApiResponse } from '@renderer/types/api/common'
import {
  SettingFrontResponse,
  UpdateSettingFrontRequest,
  UpdateUserFrontRequest,
  UserFrontResponse
} from '@renderer/types/api/user'

export const getProfile = () => api.get<ApiResponse<UserFrontResponse>>('/front/users')

export const updateProfile = (data: UpdateUserFrontRequest) =>
  api.put<ApiResponse<void>>('/front/users', data)

export const getSetting = () => api.get<ApiResponse<SettingFrontResponse>>('/front/users/settings')

export const updateSetting = (data: UpdateSettingFrontRequest) =>
  api.put<ApiResponse<void>>('/front/users/settings', data)
