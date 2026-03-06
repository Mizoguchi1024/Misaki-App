import { Modal } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

export default function PrivatePolicyModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('privatePolicyModal')

  return (
    <Modal
      title={t('privatePolicy')}
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
          ns="privatePolicyModal"
          t={t}
          components={{
            heading: <h2 className="text-base font-semibold" />,
            paragraph: <p className="mb-4" />,
            bold: <b />,
            unorderedList: <ul className="list-disc list-inside" />,
            listItem: <li />
          }}
        />
      </div>
    </Modal>
  )
}
