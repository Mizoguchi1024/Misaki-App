import { Modal } from 'antd'

export default function ProfileModal({ open, onCancel }): React.JSX.Element {
  return (
    <>
      <Modal title="个人信息" centered footer={null} open={open} onCancel={onCancel}>
        <div>个人信息</div>
      </Modal>
    </>
  )
}
