import { Modal } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

export default function GachaDetailModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('gachaDetailModal')

  return (
    <Modal
      title={t('gachaDetail')}
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
          ns="gachaDetailModal"
          t={t}
          components={{
            heading: <h2 className="text-base font-semibold" />,
            paragraph: <p className="mb-2" />,
            pink: <span className="text-pink-500" />,
            red: <span className="text-red-500" />,
            cyan: <span className="text-cyan-500" />,
            blue: <span className="text-blue-500" />,
            green: <span className="text-green-500" />
          }}
        />
      </div>
    </Modal>
  )
}
