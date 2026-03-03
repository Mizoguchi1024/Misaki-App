import { PageResult, Result } from '@renderer/types/result'
import api from '..'
import { WishFrontResponse } from '@renderer/types/wish'

export const buyPuzzle = (amount: number, currency: string): Promise<Result<void>> =>
  api
    .post<Result<void>>('/front/wish/puzzle', { params: { amount, currency } })
    .then((res) => res.data)

export const gacha = (times: number): Promise<Result<WishFrontResponse[]>> =>
  api
    .post<Result<WishFrontResponse[]>>('/front/wish/gacha', { params: { times } })
    .then((res) => res.data)

export const listWishes = (
  pageIndex: number,
  pageSize: number
): Promise<PageResult<WishFrontResponse[]>> =>
  api
    .get<PageResult<WishFrontResponse[]>>('/front/wish/gacha', { params: { pageIndex, pageSize } })
    .then((res) => res.data)
