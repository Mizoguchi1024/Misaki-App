import api from './index'
import { ApiResponse } from '@renderer/types/api/common'
import { LoginRequest, LoginResponse, registerRequest } from '@renderer/types/api/auth'

export const login = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', data)

export const register = (data: registerRequest) =>
  api.post<ApiResponse<void>>('/auth/register', data)
