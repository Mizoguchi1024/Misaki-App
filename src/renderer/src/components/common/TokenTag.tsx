import { HeartOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import MisakiLogoSymbol from '@renderer/assets/img/misaki-logo-symbol.svg'
import { getProfile } from '@renderer/api/front/user'
export default function TokenTag(): React.JSX.Element {
  const { t } = useTranslation('tokenTag')
  const { token, setProfile } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const load = async (): Promise<void> => {
      const profileRes = await getProfile()
      setProfile(profileRes.data)
    }
    load()
  }, [isModalOpen])

  return (
    <>
      <Tag
        color={(token ?? 0) <= 1000 ? 'red' : 'geekblue'}
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
        imgPath={MisakiLogoSymbol}
        description={t('description')}
      />
    </>
  )
}
