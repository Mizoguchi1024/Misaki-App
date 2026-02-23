import UserDropdown from './UserDropdown'
import ChatDropdown from './ChatDropdown'
import { Button, Tag } from 'antd'
import { useUserStore } from '@renderer/store/userStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HeartOutlined } from '@ant-design/icons'
import HelpDropdown from './HelpDropdown'
import TokenTag from './TokenTag'

export default function HeaderRightPart({ currentPage }): React.JSX.Element {
  const { jwt } = useUserStore()
  const navigate = useNavigate()
  const { t } = useTranslation('headerRightPart')

  if (!jwt) {
    switch (currentPage) {
      case 'home':
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
      default:
        return (
          <div className="flex items-center gap-4">
            <HelpDropdown />
            <Button
              onClick={() => {
                navigate(-1)
              }}
            >
              {t('back')}
            </Button>
          </div>
        )
    }
  }

  switch (currentPage) {
    case 'chat':
      return (
        <div className="flex items-center gap-4">
          <ChatDropdown />
          <UserDropdown />
        </div>
      )
    case 'not-found':
      return (
        <div className="flex items-center gap-4">
          <HelpDropdown />
          <Button
            onClick={() => {
              navigate(-1)
            }}
          >
            {t('back')}
          </Button>
        </div>
      )
    default:
      return (
        <div className="flex items-center gap-4">
          {/* <Button color="primary" variant="filled" icon={<HeartOutlined />}>
            {t('wish')}
          </Button> */}
          <TokenTag />
          <UserDropdown />
        </div>
      )
  }
}
