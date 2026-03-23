import { LanguageI18nMap, useSettingsStore } from '@renderer/store/settingsStore'
import { Modal } from 'antd'

export default function EntryModal({
  open,
  onCancel,
  title,
  amount,
  image,
  description
}): React.JSX.Element {
  const { language, borderRadius } = useSettingsStore()
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      title={title}
      footer={null}
      destroyOnHidden
      width={300}
      classNames={{
        title: 'font-serif select-none'
      }}
    >
      <div className="py-2">
        <div
          className="w-full h-24 flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-4"
          style={{ borderRadius }}
        >
          <span className="text-xl font-semibold mt-auto">{amount?.toLocaleString()}</span>
          {image}
        </div>

        <div
          className="font-serif indent-8 hyphens-auto text-pretty"
          lang={LanguageI18nMap[language]}
        >
          {description}
        </div>
      </div>
    </Modal>
  )
}
