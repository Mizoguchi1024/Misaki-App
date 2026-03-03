export type Result<T> = {
  code: number
  message: string
  data: T
}

export type Page = {
  total: number
  pageIndex: number
  pageSize: number
}

export type PageResult<T> = {
  code: number
  message: string
  data: {
    list: T
    total: string
    pageIndex: string
    pageSize: string
  }
}
