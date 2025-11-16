import { Button, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export default function NotFound(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div className="h-full flex flex-col gap-8 items-center justify-center">
      <div>
        <Typography.Title className="select-none">404 找不到页面</Typography.Title>
        <Typography.Title level={3} className="select-none text-center">
          路径：{location.pathname}
        </Typography.Title>
      </div>
      <div className="w-60">
        <Button
          type="primary"
          size="large"
          block
          onClick={() => navigate('/', { viewTransition: true })}
        >
          首页
        </Button>
      </div>
    </div>
  )
}
