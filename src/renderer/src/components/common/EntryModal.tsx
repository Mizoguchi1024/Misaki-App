import { useSettingsStore } from '@renderer/store/settingsStore'
import { Modal } from 'antd'

export default function EntryModal({
  open,
  onCancel,
  title,
  amount,
  imgPath,
  description
}): React.JSX.Element {
  const { borderRadius } = useSettingsStore()
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      title={title}
      footer={null}
      destroyOnHidden
      width={300}
      className="select-none"
      classNames={{
        title: 'font-serif'
      }}
    >
      <div
        className="w-full h-24 flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-800 overflow-hidden my-6"
        style={{ borderRadius: borderRadius }}
      >
        <span className="text-xl font-semibold mt-auto">x{amount}</span>
        <img src={imgPath} className="h-full object-contain" draggable={false}></img>
      </div>

      <div className="font-serif">{description}</div>
    </Modal>
  )
}
