import { Modal, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

interface SettingsModalProps {
  open: boolean
  onCancel: () => void
}

export default function SettingsModal({ open, onCancel }: SettingsModalProps): React.JSX.Element {
  const { t } = useTranslation('settings')
  return (
    <Modal
      title={t('title')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
    >
      <div className="max-h-120 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <Tabs
          defaultActiveKey="1"
          centered
          tabPlacement="start"
          items={Array.from({ length: 3 }).map((_, i) => {
            const id = String(i + 1)
            return {
              label: `Tab ${id}`,
              key: id,
              children: `Content of Tab Pane ${id}`
            }
          })}
        />
      </div>
    </Modal>
  )
}
