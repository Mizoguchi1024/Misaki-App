import api from './index'
import { ApiResponse } from '@renderer/types/api/common'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest
} from '@renderer/types/api/auth'

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data).then((res) => res.data)

export const register = (data: RegisterRequest): Promise<ApiResponse<void>> =>
  api.post<ApiResponse<void>>('/auth/register', data).then((res) => res.data)

export const resetPassword = (data: ResetPasswordRequest): Promise<ApiResponse<void>> =>
  api.post<ApiResponse<void>>('/auth/reset-password', data).then((res) => res.data)

export const sendVerifyCode = (email: string): Promise<ApiResponse<void>> =>
  api.get<ApiResponse<void>>(`/auth/verify/${email}`).then((res) => res.data)
