import { useSettingsStore } from '@renderer/store/settingsStore'
import { Modal } from 'antd'

export default function EntryModal({
  open,
  onCancel,
  title,
  type,
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
        className="w-full h-24 flex justify-between p-4 bg-neutral-100 dark:bg-neutral-800 overflow-hidden my-6"
        style={{ borderRadius: borderRadius }}
      >
        <div className="flex flex-col justify-between">
          <span>{type}</span>
          <span>x {amount}</span>
        </div>
        <img src={imgPath} className="h-full object-contain" draggable={false}></img>
      </div>

      <div className="font-serif">{description}</div>
    </Modal>
  )
}
