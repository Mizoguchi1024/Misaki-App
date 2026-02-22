import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { getMisakiLikes, likeMisaki } from '@renderer/api/front/about'
import { useUserStore } from '@renderer/store/userStore'
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('aboutModal')
  const { jwt } = useUserStore()
  const [likes, setLikes] = useState(0)
  const [likedFlag, setLikedFlag] = useState(false)

  useEffect(() => {
    const load = async (): Promise<void> => {
      const aboutRes = await getMisakiLikes()
      setLikes(aboutRes.data.likes)
      setLikedFlag(aboutRes.data.likedFlag)
    }
    if (jwt) {
      load()
    }
  }, [])

  const handleLike = async (): Promise<void> => {
    await likeMisaki()
    const aboutRes = await getMisakiLikes()
    setLikes(aboutRes.data.likes)
    setLikedFlag(aboutRes.data.likedFlag)
  }

  return (
    <Modal
      title={t('title')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
    >
      <div className="max-h-120 overflow-y-auto scrollbar-none">
        <span className="w-full">{t('description')}</span>
        {jwt && (
          <div className="flex flex-col items-center gap-6">
            <span className="w-full">软件开发不易，如果你喜欢本应用的话，点个赞吧～</span>
            <Button
              type={likedFlag ? 'primary' : 'default'}
              icon={likedFlag ? <HeartFilled /> : <HeartOutlined />}
              size="large"
              onClick={() => handleLike()}
            >
              {likes}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
