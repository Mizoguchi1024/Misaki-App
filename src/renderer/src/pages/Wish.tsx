import GachaHistoryModal from '@renderer/components/common/GachaHistoryModal'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { WishFrontResponse } from '@renderer/types/wish'
import { Button, Card, Divider, Modal, Popover, Rate, Tag } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MisakiLogoToken from '@renderer/assets/img/misaki-logo-token.svg?react'
import { listModels } from '@renderer/api/front/model'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gacha } from '@renderer/api/front/wish'
import { getProfile, getSettings } from '@renderer/api/front/user'
import GachaDetailsModal from '@renderer/components/common/GachaDetailsModal'
import March7th from '@renderer/assets/img/march7th.png'
import { motion } from 'motion/react'

export default function Wish(): React.JSX.Element {
  const { t } = useTranslation('wish')
  const queryClient = useQueryClient()
  const { borderRadius, getOssBaseUrl } = useSettingsStore()
  const [isGachaDetailsModalOpen, setIsGachaDetailsModalOpen] = useState(false)
  const [isGachaHistoryModalOpen, setIsGachaHistoryModalOpen] = useState(false)
  const [isGachaResultModalOpen, setIsGachaResultModalOpen] = useState(false)
  const [gachaResults, setGachaResults] = useState<WishFrontResponse[]>([])
  dayjs.extend(relativeTime)

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile
  })
  const { puzzle = 0 } = userData?.data ?? {}

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: listModels
  })
  const models = modelsData?.data ?? []

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  const gachaMutation = useMutation({
    mutationFn: gacha,
    onSuccess: (data) => {
      setGachaResults(data.data)
      setIsGachaResultModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['wishes'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  return (
    <div className="p-12 h-full w-full flex flex-col gap-8">
      <div
        className="flex justify-between items-center flex-1 p-10 bg-linear-to-l from-pink-200 to-white dark:from-pink-200 dark:to-neutral-900 rounded-2xl relative overflow-hidden"
        style={{ borderRadius }}
      >
        <div className="h-full flex flex-col justify-between select-none relative z-10">
          <div className="w-108">
            <Tag variant="filled" color="pink" className="mb-4">
              {t('characterEventWish')}
            </Tag>
            <h2 className="text-6xl font-serif font-bold">
              <span className="text-pink-400">{t('coloredTitle')}</span>
              {t('restTitle')}
            </h2>
            <Divider />
            <p className="text-2xl font-serif">{t('probabilityUp')}</p>
            <p className="text-2xl font-serif text-white bg-pink-400/80 max-w-max">{t('pity')}</p>
            <p className="text-xl font-serif">{t('extra')}</p>
          </div>
          <div>
            <p className="text-xl">{t('remainingTime')}</p>
            <p className="text-xl">{dayjs('2026-07-01 12:00:00').fromNow(true)}</p>
          </div>
        </div>
        <motion.img
          src={March7th}
          draggable={false}
          initial={{ x: 24, opacity: 0.6 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute -right-32 h-180 max-w-none"
        />
        <div className="absolute bottom-1/12 right-1/4 font-serif select-none p-1 text-white text-shadow-xs bg-linear-to-t from-neutral-900/60 via-neutral-900/60 via-80% to-transparent to-80%">
          <h3 className="text-4xl font-bold mb-2">{t('characterName')}</h3>
          <Rate disabled defaultValue={5} />
          <p className="text-xl">{t('characterTitle')}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="filled" color="default" onClick={() => setIsGachaDetailsModalOpen(true)}>
            {t('details')}
          </Button>
          <Button variant="filled" color="default" onClick={() => setIsGachaHistoryModalOpen(true)}>
            {t('history')}
          </Button>
        </div>
        <div className="flex gap-8">
          <Popover
            arrow={false}
            content={<div>{t('puzzle')} x 1</div>}
            classNames={{
              content: 'select-none'
            }}
          >
            <Button
              type="primary"
              size="large"
              disabled={puzzle < 1}
              onClick={() => gachaMutation.mutate(1)}
            >
              {t('wishTimes', { times: 1 })}
            </Button>
          </Popover>
          <Popover
            arrow={false}
            content={<div>{t('puzzle')} x 10</div>}
            classNames={{
              content: 'select-none'
            }}
          >
            <Button
              type="primary"
              size="large"
              disabled={puzzle < 10}
              onClick={() => gachaMutation.mutate(10)}
            >
              {t('wishTimes', { times: 10 })}
            </Button>
          </Popover>
        </div>
        <GachaDetailsModal
          open={isGachaDetailsModalOpen}
          onCancel={() => setIsGachaDetailsModalOpen(false)}
        />
        <GachaHistoryModal
          open={isGachaHistoryModalOpen}
          onCancel={() => setIsGachaHistoryModalOpen(false)}
        />
        <Modal
          width={600}
          open={isGachaResultModalOpen}
          onCancel={() => setIsGachaResultModalOpen(false)}
          centered
          footer={null}
          destroyOnHidden
          closable={false}
        >
          <div className={clsx(gachaResults.length > 1 ? 'grid grid-cols-5 gap-4' : '')}>
            {gachaResults.map((result) => (
              <Card
                key={result.id}
                variant="borderless"
                cover={
                  result.hitFlag ? (
                    <img
                      src={
                        getOssBaseUrl() +
                        models.find((model) => model.id === result.modelId)?.avatarPath
                      }
                      draggable={false}
                    />
                  ) : (
                    <MisakiLogoToken className="" style={{ color: mainColor }} />
                  )
                }
                classNames={{
                  body: clsx(
                    result.hitFlag &&
                      models.find((model) => model.id === result.modelId)?.grade === 4 &&
                      'bg-purple-400 dark:bg-purple-700',
                    result.hitFlag &&
                      models.find((model) => model.id === result.modelId)?.grade === 5 &&
                      'bg-yellow-400 dark:bg-yellow-700',
                    'px-2'
                  )
                }}
              >
                <Card.Meta
                  title={
                    result.hitFlag
                      ? models.find((model) => model.id === result.modelId)?.name
                      : t('token')
                  }
                  description={
                    result.duplicateFlag ? (
                      result.amount + ' ' + t('stardust')
                    ) : result.hitFlag ? (
                      <Tag color="blue" variant="solid">
                        NEW
                      </Tag>
                    ) : (
                      result.amount
                    )
                  }
                />
              </Card>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  )
}
