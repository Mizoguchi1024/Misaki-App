export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  jwt: string
  authRole: number
}

export type RegisterRequest = {
  email: string
  username: string
  password: string
  verificationCode: string
}

export type ResetPasswordRequest = {
  email: string
  password: string
  verificationCode: string
}
