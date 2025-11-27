import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface AboutModalProps {
  open: boolean
  onCancel: () => void
}

export default function AboutModal({ open, onCancel }: AboutModalProps): React.JSX.Element {
  const { t } = useTranslation('about')
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
        AAAAAAAAAAAAA
      </div>
    </Modal>
  )
}
