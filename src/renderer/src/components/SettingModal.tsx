import { Modal } from 'antd'

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
        AAAAAAAAAAAAA
      </div>
    </Modal>
  )
}
