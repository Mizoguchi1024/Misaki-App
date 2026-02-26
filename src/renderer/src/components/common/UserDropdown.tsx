import {
  InfoCircleOutlined,
  LogoutOutlined,
  SendOutlined,
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
import FeedbackModal from './FeedbackModal'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useFeedbackStore } from '@renderer/store/feedbackStore'

export default function UserDropdown(): React.JSX.Element {
  const { username, avatarPath, reset: resetUserStore } = useUserStore()
  const { getOssBaseUrl, resetCloudSettings: resetSettingsStore } = useSettingsStore()
  const { reset: resetChatStore } = useChatStore()
  const { reset: resetAssistantStore } = useAssistantStore()
  const { reset: resetFeedbackStore } = useFeedbackStore()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
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
      key: '/feedback',
      label: t('feedback'),
      icon: <SendOutlined />
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
      case '/feedback':
        setIsFeedbackModalOpen(true)
        break
      case '/about':
        setIsAboutModalOpen(true)
        break
      case '/logout':
        resetUserStore()
        resetSettingsStore()
        resetChatStore()
        resetAssistantStore()
        resetFeedbackStore()
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items: list, onClick }}
        placement="bottomLeft"
        trigger={['click']}
        classNames={{
          itemContent: 'select-none'
        }}
      >
        <Button size="large" color="default" variant="filled">
          {avatarPath ? (
            <Avatar size="small" src={getOssBaseUrl() + avatarPath} />
          ) : (
            <Avatar size="small" icon={<UserOutlined />} />
          )}

          {username}
        </Button>
      </Dropdown>
      <ProfileModal open={isProfileModalOpen} onCancel={() => setIsProfileModalOpen(false)} />
      <SettingsModal open={isSettingsModalOpen} onCancel={() => setIsSettingsModalOpen(false)} />
      <FeedbackModal open={isFeedbackModalOpen} onCancel={() => setIsFeedbackModalOpen(false)} />
      <AboutModal open={isAboutModalOpen} onCancel={() => setIsAboutModalOpen(false)} />
    </>
  )
}
