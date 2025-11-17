import GlassBox from '@renderer/components/GlassBox'
import { Button, theme, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export default function NotFound(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorPrimary }
  } = theme.useToken()
  return (
    <div className="h-full flex items-center justify-center">
      <GlassBox className="gap-8">
        <div>
          <Typography.Title className="select-none">
            <span style={{ color: colorPrimary }}>404</span> 找不到页面
          </Typography.Title>
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
      </GlassBox>
    </div>
  )
}
