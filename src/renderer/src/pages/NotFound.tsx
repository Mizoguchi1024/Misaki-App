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
      <GlassBox className="gap-8">
        <div>
          <Typography.Title className="select-none">
            <span style={{ color: colorPrimary }}>404&nbsp;</span>
            <span>{t('notFound')}</span>
          </Typography.Title>
          <Typography.Title level={3} className="select-none text-center">
            {t('path')} {location.pathname}
          </Typography.Title>
        </div>
        <div className="w-60">
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
