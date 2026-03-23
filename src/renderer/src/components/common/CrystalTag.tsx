import { LoadingOutlined } from '@ant-design/icons'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { useUserStore } from '@renderer/store/userStore'
import { useQuery } from '@tanstack/react-query'
import { Spin, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import MisakiLogoCrystal from '@renderer/assets/img/misaki-logo-crystal.svg?react'

export default function CrystalTag(): React.JSX.Element {
  const { t } = useTranslation('crystalTag')
  const { jwt } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: !!jwt
  })
  const { crystal } = userData?.data ?? {}

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
      <Tag
        color="default"
        variant="filled"
        className="select-none cursor-pointer hidden md:inline"
        onClick={() => setIsModalOpen(true)}
      >
        {t('crystal') + ': ' + crystal}
      </Tag>
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('crystal')}
        amount={crystal}
        image={<MisakiLogoCrystal className="w-24" style={{ color: mainColor }} />}
        description={t('description')}
      />
    </Spin>
  )
}
