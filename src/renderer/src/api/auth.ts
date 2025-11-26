import api from './index'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest
} from '@renderer/types/api/auth'

export const login = (data: LoginRequest): Promise<LoginResponse> =>
  api.post<LoginResponse>('/auth/login', data).then((res) => res.data)

export const register = (data: RegisterRequest): Promise<void> =>
  api.post<void>('/auth/register', data).then((res) => res.data)

export const resetPassword = (data: ResetPasswordRequest): Promise<void> =>
  api.post<void>('/auth/reset-password', data).then((res) => res.data)

export const sendVerifyCode = (email: string): Promise<void> =>
  api.get<void>(`/auth/verify/${email}`).then((res) => res.data)
