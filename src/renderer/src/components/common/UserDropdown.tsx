import {
  InfoCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { Avatar, Button, Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import AboutModal from './AboutModal'
import SettingsModal from './SettingsModal'
import { useState } from 'react'
import { useChatStore } from '@renderer/store/chatStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import ProfileModal from './ProfileModal'

export default function UserDropdown(): React.JSX.Element {
  const { username, logout } = useUserStore()
  const { resetCloudSettings: resetSettingsStore } = useSettingsStore()
  const { reset: resetChatStore } = useChatStore()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const { t } = useTranslation('userDropdown')

  const list: MenuProps['items'] = [
    {
      key: '/profile',
      label: t('profile'),
      icon: <UserOutlined />
    },
    {
      key: '/settings',
      label: t('settings'),
      icon: <SettingOutlined />
    },
    {
      key: '/about',
      label: t('about'),
      icon: <InfoCircleOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: '/logout',
      label: t('logout'),
      icon: <LogoutOutlined />
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '/profile':
        setIsProfileModalOpen(true)
        break
      case '/settings':
        setIsSettingsModalOpen(true)
        break
      case '/about':
        setIsAboutModalOpen(true)
        break
      case '/logout':
        logout()
        resetSettingsStore()
        resetChatStore()
        break
    }
  }

  return (
    <>
      <Dropdown menu={{ items: list, onClick }} placement="bottomLeft" trigger={['click']}>
        <Button size="large" color="default" variant="filled">
          <Avatar size="small" icon={<UserOutlined />} />
          {username}
        </Button>
      </Dropdown>
      <ProfileModal
        open={isProfileModalOpen}
        onCancel={() => {
          setIsProfileModalOpen(false)
        }}
      />
      <SettingsModal open={isSettingsModalOpen} onCancel={() => setIsSettingsModalOpen(false)} />
      <AboutModal open={isAboutModalOpen} onCancel={() => setIsAboutModalOpen(false)} />
    </>
  )
}
