import { getSettings } from '@renderer/api/front/user'
import GlassBox from '@renderer/components/common/GlassBox'
import { useUserStore } from '@renderer/store/userStore'
import { useQuery } from '@tanstack/react-query'
import { Button, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export default function NotFound(): React.JSX.Element {
  const { t } = useTranslation('notFound')
  const navigate = useNavigate()
  const location = useLocation()
  const { jwt } = useUserStore()

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  return (
    <div className="h-full flex items-center justify-center">
      <GlassBox className="flex flex-col items-center justify-center px-12 py-10 gap-8 min-w-lg">
        <div>
          <Typography.Title className="select-none text-center" style={{ color: mainColor }}>
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
