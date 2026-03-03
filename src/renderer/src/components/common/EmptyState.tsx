import DashedMisakiLogo from '@renderer/assets/img/misaki-logo-symbol-dashed.svg?react'
import { useSettingsStore } from '@renderer/store/settingsStore'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export default function EmptyState({ className = '' }): React.JSX.Element {
  const { t } = useTranslation('emptyState')
  const { mainColor } = useSettingsStore()

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-4 select-none', className)}>
      <DashedMisakiLogo className="w-1/5 h-auto" style={{ color: mainColor }} />
      <span>{t('noData')}</span>
    </div>
  )
}
