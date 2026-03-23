import GachaHistoryModal from '@renderer/components/common/GachaHistoryModal'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { Button, Divider, Tag } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Wish(): React.JSX.Element {
  const { t } = useTranslation('wish')
  const { borderRadius } = useSettingsStore()
  const [isGachaHistoryModalOpen, setIsGachaHistoryModalOpen] = useState(false)
  dayjs.extend(relativeTime)

  return (
    <div className="p-12 h-full w-full flex flex-col gap-8">
      <div
        className="flex justify-between items-center flex-1 p-10 bg-white dark:bg-neutral-800 rounded-2xl"
        style={{ borderRadius }}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <Tag variant="filled" color="pink" className="mb-4">
              {t('characterEventWish')}
            </Tag>
            <h2 className="text-5xl font-serif font-bold">
              <span className="text-pink-400">{t('coloredTitle')}</span>
              {t('restTitle')}
            </h2>
            <Divider />
            <p className="text-2xl font-serif">{t('probabilityUp')}</p>
            <p className="text-2xl font-serif text-white bg-pink-400 w-max">{t('pity')}</p>
            <p className="text-xl font-serif">{t('extra')}</p>
          </div>
          <div>
            <p className="text-xl">{t('remainingTime')}</p>
            <p className="text-xl">{dayjs('2026-07-01 12:00:00').fromNow(true)}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="filled" color="default" onClick={() => setIsGachaHistoryModalOpen(true)}>
          {t('history')}
        </Button>
        <div className="flex gap-8">
          <Button variant="solid" color="primary" size="large">
            {t('wishTimes', { times: 1 })}
          </Button>
          <Button variant="solid" color="primary" size="large">
            {t('wishTimes', { times: 10 })}
          </Button>
        </div>
        <GachaHistoryModal
          open={isGachaHistoryModalOpen}
          onCancel={() => setIsGachaHistoryModalOpen(false)}
        />
      </div>
    </div>
  )
}
