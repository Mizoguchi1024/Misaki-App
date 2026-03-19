import React from 'react'
import { useEffect, useState } from 'react'
import { App, Button, Modal } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { getMisakiLikes, likeMisaki } from '@renderer/api/front/about'
import { useUserStore } from '@renderer/store/userStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export default function AboutModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('aboutModal')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()
  const { jwt } = useUserStore()
  const [versions, setVersions] = useState({
    misaki: '',
    node: '',
    chromium: '',
    electron: ''
  })

  useEffect(() => {
    window.api.getVersions().then(setVersions)
  }, [])

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: getMisakiLikes,
    enabled: !!jwt
  })
  const { likes, likedFlag } = aboutData?.data ?? {}

  const likeMisakiMutation = useMutation({
    mutationFn: likeMisaki,
    onSuccess: () => {
      if (likedFlag) {
        appMessage.info(t('sad'))
      } else {
        appMessage.success(t('thanks'))
      }
      queryClient.invalidateQueries({ queryKey: ['about'] })
    }
  })

  return (
    <Modal
      title={t('about')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
    >
      <div className="max-h-120 py-2 overflow-y-auto scrollbar-none">
        <div className=" flex flex-col gap-2 mb-4">
          <div className="w-full flex justify-between">
            <span>{t('misakiVersion')}</span>
            <span>{versions.misaki}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>{t('nodeVersion')}</span>
            <span>{versions.node}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>{t('electronVersion')}</span>
            <span>{versions.electron}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>{t('chromiumVersion')}</span>
            <span>{versions.chromium}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>{t('reactVersion')}</span>
            <span>{React.version}</span>
          </div>
        </div>
        <div className="w-full mb-4 text-pretty indent-8">{t('story')}</div>
        {jwt && (
          <div className="flex flex-col items-center gap-6">
            <span className="w-full text-pretty indent-8">{t('likesDescription')}</span>
            <Button
              type={likedFlag ? 'primary' : 'default'}
              icon={likedFlag ? <HeartFilled /> : <HeartOutlined />}
              size="large"
              loading={isLoading}
              onClick={() => likeMisakiMutation.mutate()}
            >
              {likes}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
