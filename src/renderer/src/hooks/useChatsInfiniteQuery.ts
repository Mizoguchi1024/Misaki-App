import { listChats } from '@renderer/api/front/chat'
import { useUserStore } from '@renderer/store/userStore'
import { ChatFrontResponse } from '@renderer/types/chat'
import { PageResult } from '@renderer/types/result'
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query'

export const chatsPageSize = 15

export function useChatsInfiniteQuery(): UseInfiniteQueryResult<
  InfiniteData<PageResult<ChatFrontResponse[]>, unknown>,
  Error
> {
  return useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam = 1 }): Promise<PageResult<ChatFrontResponse[]>> => {
      return listChats(pageParam, chatsPageSize)
    },
    enabled: !!useUserStore.getState().jwt,
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResult<ChatFrontResponse[]>) => {
      const { pageIndex, total } = lastPage.data
      return +pageIndex * chatsPageSize < +total ? +pageIndex + 1 : undefined
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
}

export function flattenChats(pages?: PageResult<ChatFrontResponse[]>[]): ChatFrontResponse[] {
  return pages?.flatMap((page) => page.data.list) ?? []
}
