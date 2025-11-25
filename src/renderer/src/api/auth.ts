import api from './index'
import { ApiResponse } from '@renderer/types/api/common'
import { LoginRequest } from '@renderer/types/api/auth'
import { LoginResponse } from '@renderer/store/userStore'

export const login = (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth', data)
