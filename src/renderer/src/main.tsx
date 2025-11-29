import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './i18n'
import App from './App'
import { useSettingsStore } from './store/settingsStore'
import { useUserStore } from './store/userStore'

const startupCheck = (): void => {
  const userState = useUserStore.getState()
  if (userState.rememberMe === false) {
    userState.logout()
    useSettingsStore.getState().reset()
  }
}

startupCheck()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
)
