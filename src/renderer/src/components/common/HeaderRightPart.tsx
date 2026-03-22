import UserDropdown from './UserDropdown'
import ChatDropdown from './ChatDropdown'
import { Button } from 'antd'
import { useUserStore } from '@renderer/store/userStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import HelpDropdown from './HelpDropdown'
import TokenTag from './TokenTag'
import StardustTag from './StardustTag'
import PuzzleTag from './puzzleTag'

export default function HeaderRightPart({ currentPage }): React.JSX.Element {
  const { t } = useTranslation('headerRightPart')
  const { jwt } = useUserStore()
  const navigate = useNavigate()

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
          <TokenTag />
          <ChatDropdown />
          <UserDropdown />
        </div>
      )
    case 'reset-password':
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
    case 'shop':
      return (
        <div className="flex items-center gap-4">
          <StardustTag />
          <PuzzleTag />
          <UserDropdown />
        </div>
      )
    case 'misaki':
      return <UserDropdown />
    default:
      return (
        <div className="flex items-center gap-4">
          <TokenTag />
          <UserDropdown />
        </div>
      )
  }
}
