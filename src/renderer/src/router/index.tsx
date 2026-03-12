import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'
import Mcp from '../pages/Mcp'
import Search from '../pages/Search'
import Script from '../pages/Script'
import Misaki from '../pages/Misaki'
import NotFound from '../pages/NotFound'
import Chat from '../pages/Chat'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home />, handle: { page: 'home' } },
      { path: '/misaki', element: <Misaki />, handle: { page: 'misaki' } },
      { path: '/search', element: <Search />, handle: { page: 'search' } },
      { path: '/mcp', element: <Mcp />, handle: { page: 'mcp' } },
      { path: '/script', element: <Script />, handle: { page: 'script' } },
      { path: '/chat/:id', element: <Chat />, handle: { page: 'chat' } }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login />, handle: { page: 'login' } },
      { path: '/register', element: <Register />, handle: { page: 'register' } },
      { path: '/reset-password', element: <ResetPassword />, handle: { page: 'reset-password' } },
      { path: '*', element: <NotFound />, handle: { page: 'not-found' } }
    ]
  }
])
