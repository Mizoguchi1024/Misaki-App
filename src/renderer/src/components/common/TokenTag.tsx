import { useUserStore } from '@renderer/store/userStore'
import { Spin, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import MisakiLogoToken from '@renderer/assets/img/misaki-logo-token.svg?react'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { useQuery } from '@tanstack/react-query'
import { LoadingOutlined } from '@ant-design/icons'
export default function TokenTag(): React.JSX.Element {
  const { t } = useTranslation('tokenTag')
  const { jwt } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: !!jwt
  })
  const { token } = userData?.data ?? {}

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
      <Tag
        color={token && token <= 1000 ? 'red' : 'default'}
        variant="filled"
        className="select-none cursor-pointer hidden md:inline"
        onClick={() => setIsModalOpen(true)}
      >
        {t('token') +
          ': ' +
          ((token ?? 0) >= 1000 ? (token! / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : token)}
      </Tag>
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('token')}
        amount={token}
        image={<MisakiLogoToken className="w-24" style={{ color: mainColor }} />}
        description={t('description')}
      />
    </Spin>
  )
}
