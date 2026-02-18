import { InfoCircleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { Avatar, Button, Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import AboutModal from './AboutModal'
import SettingsModal from './SettingsModal'
import { useState } from 'react'

export default function UserDropdown(): React.JSX.Element {
  const { username } = useUserStore()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const { t } = useTranslation('userDropdown')

  const list: MenuProps['items'] = [
    {
      key: '/settings',
      label: t('settings'),
      icon: <SettingOutlined />
    },
    {
      key: '/about',
      label: t('about'),
      icon: <InfoCircleOutlined />
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '/settings':
        setIsSettingsModalOpen(true)
        break
      case '/about':
        setIsAboutModalOpen(true)
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
      <SettingsModal open={isSettingsModalOpen} onCancel={() => setIsSettingsModalOpen(false)} />
      <AboutModal open={isAboutModalOpen} onCancel={() => setIsAboutModalOpen(false)} />
    </>
  )
}
