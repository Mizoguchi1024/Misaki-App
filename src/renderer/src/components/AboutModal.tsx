import { Modal } from 'antd'

interface AboutModalProps {
  open: boolean
  onCancel: () => void
}

export default function AboutModal({ open, onCancel }: AboutModalProps): React.JSX.Element {
  return (
    <Modal
      title="关于"
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
