import { useUserStore } from '@renderer/store/userStore'
import { Spin, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getProfile, getSettings } from '@renderer/api/front/user'
import MisakiLogoPuzzle from '@renderer/assets/img/misaki-logo-puzzle.svg?react'

export default function PuzzleTag(): React.JSX.Element {
  const { t } = useTranslation('puzzleTag')
  const { jwt } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    enabled: !!jwt
  })
  const { puzzle } = userData?.data ?? {}

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
        {t('puzzle') + ': ' + puzzle}
      </Tag>
      <EntryModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={t('puzzle')}
        amount={puzzle}
        image={<MisakiLogoPuzzle className="w-24 aspect-square" style={{ color: mainColor }} />}
        description={t('description')}
      />
    </Spin>
  )
}
