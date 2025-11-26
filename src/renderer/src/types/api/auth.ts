export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  authRole: number
}

export interface RegisterRequest {
  email: string
  password: string
  verifyCode: string
}

export interface ResetPasswordRequest {
  email: string
  password: string
  verifyCode: string
}
