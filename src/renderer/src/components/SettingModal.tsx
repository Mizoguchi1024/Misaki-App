import { Modal, Tabs } from 'antd'

interface SettingModalProps {
  open: boolean
  onCancel: () => void
}

export default function SettingModal({ open, onCancel }: SettingModalProps): React.JSX.Element {
  return (
    <Modal
      title="设置"
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
