import { messageApi } from '@renderer/messageApi'
import { useUserStore } from '@renderer/store/userStore'
import { Button, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@renderer/assets/misaki-logo-symbol.svg?react'

export default function MisakiButton(): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation('misakiButton')
  const { jwt } = useUserStore()
  const {
    token: { colorPrimary }
  } = theme.useToken()

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
        <MisakiLogo className="w-10 h-10" fill={colorPrimary} />
        <span className="text-2xl font-semibold select-none">Misaki</span>
      </div>
    </Button>
  )
}
