import { InfoCircleOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { Dropdown, Button, MenuProps } from 'antd'
import AboutModal from './AboutModal'
import SettingsModal from './SettingsModal'
import { useState } from 'react'
import { t } from 'i18next'

export default function HelpDropdown(): React.JSX.Element {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

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
      <Dropdown
        menu={{ items: list, onClick }}
        placement="bottomLeft"
        trigger={['click']}
        classNames={{
          itemContent: 'select-none'
        }}
      >
        <Button
          color="default"
          variant="filled"
          shape="circle"
          icon={<QuestionCircleOutlined />}
        ></Button>
      </Dropdown>
      <SettingsModal open={isSettingsModalOpen} onCancel={() => setIsSettingsModalOpen(false)} />
      <AboutModal open={isAboutModalOpen} onCancel={() => setIsAboutModalOpen(false)} />
    </>
  )
}
