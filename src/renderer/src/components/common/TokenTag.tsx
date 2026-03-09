import { useUserStore } from '@renderer/store/userStore'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EntryModal from './EntryModal'
import MisakiLogoToken from '@renderer/assets/img/misaki-logo-token.svg?react'
import { getProfile } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
export default function TokenTag(): React.JSX.Element {
  const { t } = useTranslation('tokenTag')
  const { token, setProfile } = useUserStore()
  const { mainColor } = useSettingsStore()
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
        color={(token ?? 0) <= 1000 ? 'red' : 'default'}
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
    </>
  )
}
