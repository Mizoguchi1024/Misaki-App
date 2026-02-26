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
        variant="filled"
        icon={<HeartOutlined />}
        className="select-none cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {token}
      </Tag>
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('token')}
        amount={token}
        imgPath="src/assets/img/misaki-logo-symbol.svg"
        description={t('description')}
      />
    </>
  )
}
