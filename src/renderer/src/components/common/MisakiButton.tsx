import { useUserStore } from '@renderer/store/userStore'
import { App, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@renderer/assets/img/misaki-logo-symbol.svg?react'
import React from 'react'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { listAssistants } from '@renderer/api/front/assistant'
import { getSettings } from '@renderer/api/front/user'

type MisakiButtonProps = {
  className?: string
  onClickCallback?: () => void
}

export default function MisakiButton({
  className,
  onClickCallback
}: MisakiButtonProps): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation('misakiButton')
  const { message: appMessage } = App.useApp()
  const { jwt } = useUserStore()

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF', enabledAssistantId } = settingsData?.data ?? {}

  const { data: assistantData } = useQuery({
    queryKey: ['assistants'],
    queryFn: listAssistants,
    enabled: !!jwt
  })
  const assistants = assistantData?.data ?? []

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
        onClickCallback?.()
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
