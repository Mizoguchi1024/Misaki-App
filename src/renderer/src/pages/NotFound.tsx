import GlassBox from '@renderer/components/GlassBox'
import { Button, theme, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export default function NotFound(): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation('notFound')
  const location = useLocation()
  const {
    token: { colorPrimary }
  } = theme.useToken()
  return (
    <div className="h-full flex items-center justify-center">
      <GlassBox className="gap-8 min-w-2/5">
        <div>
          <Typography.Title className="select-none text-center" style={{ color: colorPrimary }}>
            404
          </Typography.Title>
          <Typography.Title className="select-none text-center">{t('notFound')}</Typography.Title>
          <Typography.Title level={4} type="secondary" className="select-none text-center">
            {t('path')} {location.pathname}
          </Typography.Title>
        </div>
        <div className="w-52">
          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate('/', { viewTransition: true })}
          >
            {t('home')}
          </Button>
        </div>
      </GlassBox>
    </div>
  )
}
