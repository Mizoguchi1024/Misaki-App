import { useUserStore } from '@renderer/store/userStore'
import { App, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@renderer/assets/img/misaki-logo-symbol.svg?react'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'
import clsx from 'clsx'

interface MisakiButtonProps {
  className?: string
}

export default function MisakiButton({ className }: MisakiButtonProps): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation('misakiButton')
  const { message: appMessage } = App.useApp()
  const { jwt } = useUserStore()
  const { mainColor, enabledAssistantId } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const assistantName =
    assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'

  return (
    <Button
      type="text"
      size="large"
      className={className}
      onClick={() => {
        if (jwt) {
          navigate('/misaki', { viewTransition: true })
        } else {
          appMessage.info(t('loginFirst'))
        }
      }}
    >
      <div className="flex items-center gap-1">
        <MisakiLogo className="w-8" fill={mainColor} />
        <span className={clsx(assistantName.length <= 8 ? 'text-xl' : 'text-md', 'font-semibold')}>
          {assistantName}
        </span>
      </div>
    </Button>
  )
}
