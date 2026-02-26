import { Result } from '@renderer/types/api/base'
import api from '../index'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest
} from '@renderer/types/api/auth'

export const login = (data: LoginRequest): Promise<Result<LoginResponse>> =>
  api.post<Result<LoginResponse>>('/auth/login', data).then((res) => res.data)

export const register = (data: RegisterRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/auth/register', data).then((res) => res.data)

export const resetPassword = (data: ResetPasswordRequest): Promise<Result<void>> =>
  api.post<Result<void>>('/auth/reset-password', data).then((res) => res.data)

export const sendVerifyCode = (email: string, lang: number): Promise<Result<void>> =>
  api.post<Result<void>>(`/auth/verify/${email}`, { params: { lang } }).then((res) => res.data)
