import { HeartOutlined } from '@ant-design/icons'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { Modal, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
export default function TokenTag(): React.JSX.Element {
  const { t } = useTranslation('tokenTag')
  const { token } = useUserStore()
  const { borderRadius } = useSettingsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Tag
        color="geekblue"
        icon={<HeartOutlined />}
        className="select-none"
        onClick={() => setIsModalOpen(true)}
      >
        {token}
      </Tag>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        title={t('token')}
        footer={null}
        destroyOnHidden
        width={300}
        className="select-none"
      >
        <div
          className="w-full h-24 flex justify-between p-4 bg-neutral-100 dark:bg-neutral-800 overflow-hidden my-6"
          style={{ borderRadius: borderRadius }}
        >
          <div className="flex flex-col justify-between">
            <span>{t('forChat')}</span>
            <span>x {token}</span>
          </div>
          <img src="src/assets/misaki-logo-symbol.svg" className="h-full object-contain"></img>
        </div>

        <div>大语言模型用来拆解或拼合语言的拼图片，在中文里的正式译文为“词元”。</div>
      </Modal>
    </>
  )
}
