import { messageApi } from '@renderer/messageApi'
import { useUserStore } from '@renderer/store/userStore'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@renderer/assets/misaki-logo-symbol.svg?react'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useAssistantStore } from '@renderer/store/assistantStore'

export default function MisakiButton(): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation('misakiButton')
  const { jwt } = useUserStore()
  const { mainColor, enabledAssistantId } = useSettingsStore()
  const { assistants } = useAssistantStore()
  const assistantName =
    assistants?.find((assistant) => assistant.id === enabledAssistantId)?.name || 'Misaki'

  return (
    <Button
      type="text"
      size="large"
      className="px-2 py-4"
      onClick={() => {
        if (jwt) {
          navigate('/misaki', { viewTransition: true })
        } else {
          messageApi?.info(t('Login first'))
        }
      }}
    >
      <div className="flex items-center gap-1">
        <MisakiLogo className="w-10 h-10 shrink-0" fill={mainColor} />
        <span className="text-xl font-semibold">{assistantName}</span>
      </div>
    </Button>
  )
}
