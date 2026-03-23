import { Modal, Table } from 'antd'
import { useTranslation } from 'react-i18next'

export default function GachaHistoryModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('gachaHistoryModal')

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      title={t('history')}
      footer={null}
      destroyOnHidden
    >
      <Table pagination={{ placement: ['bottomCenter'] }}></Table>
    </Modal>
  )
}
