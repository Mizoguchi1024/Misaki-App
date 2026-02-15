import { Result } from '@renderer/types/api/base'
import api from '..'
import { WishFrontResponse } from '@renderer/types/api/wish'

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
): Promise<Result<WishFrontResponse[]>> =>
  api
    .get<Result<WishFrontResponse[]>>('/front/wish/gacha', { params: { pageIndex, pageSize } })
    .then((res) => res.data)
