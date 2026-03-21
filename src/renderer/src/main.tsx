import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './i18n'
import App from './App'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useUserStore } from './store/userStore'
import { clearPersistedQueryCache, queryClient, queryPersister } from './queryClient'

if (!useUserStore.getState().rememberMe) {
  clearPersistedQueryCache()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: queryPersister }}>
      <App>
        <RouterProvider router={router} />
      </App>
    </PersistQueryClientProvider>
  </StrictMode>
)
