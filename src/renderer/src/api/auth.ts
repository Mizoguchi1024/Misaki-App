import api from './index'
import { ApiResponse } from '@renderer/types/api/common'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest
} from '@renderer/types/api/auth'

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data)

export const register = (data: RegisterRequest) =>
  api.post<ApiResponse<void>>('/auth/register', data)

export const resetPassword = (data: ResetPasswordRequest) =>
  api.post<ApiResponse<void>>('/auth/reset-password', data)

export const sendVerifyCode = (email: string) => api.get<ApiResponse<void>>(`/auth/verify/${email}`)