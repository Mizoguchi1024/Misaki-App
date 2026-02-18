import UserDropdown from './UserDropdown'
import ChatDropdown from './ChatDropdown'
import { Button } from 'antd'
import { useUserStore } from '@renderer/store/userStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HeartOutlined } from '@ant-design/icons'
import HelpDropdown from './HelpDropdown'

export default function HeaderRightPart({ type }): React.JSX.Element {
  const { jwt } = useUserStore()
  const navigate = useNavigate()
  const { t } = useTranslation('headerRightPart')

  if (!jwt) {
    return (
      <div className="flex items-center gap-4">
        <HelpDropdown />
        <Button type="primary" onClick={() => navigate('/login', { viewTransition: true })}>
          {t('login')}
        </Button>
        <Button onClick={() => navigate('/register', { viewTransition: true })}>
          {t('register')}
        </Button>
      </div>
    )
  }

  switch (type) {
    case 'chat':
      return (
        <div className="flex items-center gap-4">
          <ChatDropdown />
          <UserDropdown />
        </div>
      )
    default:
      return (
        <div className="flex items-center gap-4">
          <Button color="primary" variant="filled" icon={<HeartOutlined />}>
            {t('wish')}
          </Button>
          <UserDropdown />
        </div>
      )
  }
}
