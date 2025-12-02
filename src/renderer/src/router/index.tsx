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

const chatLoader = async ({ params }): Promise<null> => {
  console.log(params.id)
  return null
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/misaki', element: <Misaki /> },
      { path: '/', element: <Home /> },
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
