import { Modal, Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { useTranslation } from 'react-i18next'

interface SettingsModalProps {
  open: boolean
  onCancel: () => void
}

export default function SettingsModal({ open, onCancel }: SettingsModalProps): React.JSX.Element {
  const { t } = useTranslation('settingsModal')

  return (
    <Modal
      title={t('title')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
    >
      <div className="max-h-120 overflow-y-auto scrollbar-none">
        <Tabs defaultActiveKey="1" centered tabPlacement="start">
          <TabPane tab={t('system')} key="1">
            <div>系统设置内容</div>
          </TabPane>
          <TabPane tab={t('user')} key="2">
            <div>用户设置内容</div>
          </TabPane>
          <TabPane tab={t('other')} key="3">
            <div>其他设置内容</div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}
