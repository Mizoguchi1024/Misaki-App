import { getSettings } from '@renderer/api/front/user'
import DashedMisakiLogo from '@renderer/assets/img/misaki-logo-dashed.svg?react'
import { useUserStore } from '@renderer/store/userStore'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export default function EmptyState({ className = '', logoClassName = '' }): React.JSX.Element {
  const { t } = useTranslation('emptyState')
  const { jwt } = useUserStore()

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  return (
    <div className={clsx('flex flex-col items-center justify-center select-none', className)}>
      <DashedMisakiLogo className={logoClassName} style={{ color: mainColor }} />
      <span>{t('noData')}</span>
    </div>
  )
}
