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
      { path: '/', element: <Home /> },
      { path: '/misaki', element: <Misaki /> },
      { path: '/search', element: <Search /> },
      { path: '/mcp-server', element: <McpServer /> },
      { path: '/script', element: <Script /> },
      { path: '/chat/:id', loader: chatLoader, element: <Chat /> }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])
