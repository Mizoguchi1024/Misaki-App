import { HeartOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
export default function TokenTag(): React.JSX.Element {
  const { t } = useTranslation('tokenTag')
  const { token } = useUserStore()
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
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('token')}
        type={t('forChat')}
        amount={token}
        imgPath="src/assets/misaki-logo-symbol.svg"
        description="大语言模型用来拆解或拼合语言的拼图片，在中文里的正式译文为“词元”。"
      />
    </>
  )
}
