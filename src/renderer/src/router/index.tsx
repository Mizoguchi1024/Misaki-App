import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'
import McpServer from '../pages/McpServer'
import Search from '../pages/Search'
import Script from '../pages/Script'
import Misaki from '../pages/Misaki'
import NotFound from '../pages/NotFound'
import Chat from '../pages/Chat'
import { listMessages } from '@renderer/api/front/chat'

const chatLoader = async ({ params }) => {
  const messageRes = await listMessages(params.id)
  return messageRes.data
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home />, handle: { header: 'home' } },
      { path: '/misaki', element: <Misaki />, handle: { header: 'misaki' } },
      { path: '/search', element: <Search />, handle: { header: 'search' } },
      { path: '/mcp-server', element: <McpServer />, handle: { header: 'mcp-server' } },
      { path: '/script', element: <Script />, handle: { header: 'script' } },
      { path: '/chat/:id', element: <Chat />, handle: { header: 'chat' }, loader: chatLoader }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login />, handle: { header: 'login' } },
      { path: '/register', element: <Register />, handle: { header: 'register' } },
      { path: '/reset-password', element: <ResetPassword />, handle: { header: 'reset-password' } },
      { path: '*', element: <NotFound />, handle: { header: 'not-found' } }
    ]
  }
])
