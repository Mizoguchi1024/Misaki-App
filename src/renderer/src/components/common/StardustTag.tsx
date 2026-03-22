import { LoadingOutlined } from '@ant-design/icons'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { useUserStore } from '@renderer/store/userStore'
import { useQuery } from '@tanstack/react-query'
import { Spin, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import MisakiLogoStardust from '@renderer/assets/img/misaki-logo-stardust.svg?react'

export default function StardustTag(): React.JSX.Element {
  const { t } = useTranslation('stardustTag')
  const { jwt } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: !!jwt
  })
  const { stardust } = userData?.data ?? {}

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
        {t('stardust') + ': ' + stardust}
      </Tag>
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('stardust')}
        amount={stardust}
        image={<MisakiLogoStardust className="w-24" style={{ color: mainColor }} />}
        description={t('description')}
      />
    </Spin>
  )
}
