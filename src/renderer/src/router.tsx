import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import McpServer from './pages/McpServer'
import Search from './pages/Search'
import CodeInterpreter from './pages/CodeInterpreter'
import Misaki from './pages/Misaki'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/misaki', element: <Misaki /> },
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/mcp-server', element: <McpServer /> },
      { path: '/code-interpreter', element: <CodeInterpreter /> }
    ]
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
