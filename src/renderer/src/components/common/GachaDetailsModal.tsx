import { Modal } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

export default function GachaDetailsModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('gachaDetailsModal')

  return (
    <Modal
      title={t('gachaDetails')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      className="select-none"
    >
      <div className="max-h-120 py-2 overflow-y-auto scrollbar-style">
        <Trans
          i18nKey="content"
          ns="gachaDetailsModal"
          t={t}
          components={{
            heading: <h2 className="text-base font-semibold" />,
            paragraph: <p className="mb-2" />,
            pink: <span className="text-pink-400" />,
            red: <span className="text-red-400" />,
            cyan: <span className="text-cyan-400" />,
            blue: <span className="text-blue-400" />,
            green: <span className="text-green-400" />
          }}
        />
      </div>
    </Modal>
  )
}
