import { Button, Dropdown, Layout, MenuProps, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import MisakiLogo from '../assets/misaki-logo-symbol.svg?react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { InfoCircleOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SettingModal from '@renderer/components/SettingModal'
import AboutModal from '@renderer/components/AboutModal'

const { Header, Content, Footer } = Layout

const helpList: MenuProps['items'] = [
  {
    key: '/setting',
    label: '设置',
    icon: <SettingOutlined />
  },
  {
    key: '/about',
    label: '关于',
    icon: <InfoCircleOutlined />
  }
]

export default function AuthLayout(): React.JSX.Element {
  const { t } = useTranslation('authLayout')
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const handleSettingModalCancel = (): void => {
    setIsSettingModalOpen(false)
  }

  const handleAboutModalCancel = (): void => {
    setIsAboutModalOpen(false)
  }

  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '/setting':
        setIsSettingModalOpen(true)
        break
      case '/about':
        setIsAboutModalOpen(true)
        break
    }
  }

  return (
    <Layout className="h-screen">
      <Header
        className="flex justify-between items-center"
        style={{ background: colorBgContainer, paddingInline: '2rem' }}
      >
        <Button type="text" size="large" style={{ padding: '0 0.6rem' }}>
          <div className="flex items-center gap-1">
            <MisakiLogo className="w-10 h-10" fill={colorPrimary} />
            <span className="text-2xl font-semibold select-none">Misaki</span>
          </div>
        </Button>
        <div className="flex items-center gap-4">
          <Dropdown menu={{ items: helpList, onClick }} placement="bottomLeft" trigger={['click']}>
            <Button
              color="default"
              variant="filled"
              shape="circle"
              icon={<QuestionCircleOutlined />}
            ></Button>
          </Dropdown>
          <SettingModal open={isSettingModalOpen} onCancel={handleSettingModalCancel} />
          <AboutModal open={isAboutModalOpen} onCancel={handleAboutModalCancel} />
          <Button
            onClick={() => {
              navigate(-1)
            }}
          >
            {t('back')}
          </Button>
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className="text-center select-none">
        Developed by Mizoguchi. All rights reserved.
      </Footer>
    </Layout>
  )
}
