import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: '/', element: <Home /> }]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/reset-password', element: <ResetPassword /> }
    ]
  }
])
