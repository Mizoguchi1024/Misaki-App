import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

export const QUERY_CACHE_PERSIST_KEY = 'misaki-react-query-cache'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 // 24小时
    }
  }
})

export const queryPersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: QUERY_CACHE_PERSIST_KEY
})

export function clearPersistedQueryCache(): void {
  window.localStorage.removeItem(QUERY_CACHE_PERSIST_KEY)
  queryClient.clear()
}
