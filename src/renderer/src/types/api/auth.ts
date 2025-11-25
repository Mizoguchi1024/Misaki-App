export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  userRole: number
}

export interface registerRequest {
  email: string
  password: string
  verifyCode: string
}
