import { buyModel, listModels } from '@renderer/api/front/model'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { buyPuzzle } from '@renderer/api/front/wish'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import MisakiLogoPuzzle from '@renderer/assets/img/misaki-logo-puzzle.svg?react'
import { useUserStore } from '@renderer/store/userStore'

export default function Shop(): React.JSX.Element {
  const { t } = useTranslation('shop')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()
  const { jwt } = useUserStore()
  const { getOssBaseUrl } = useSettingsStore()

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile
  })
  const { stardust = 0, crystal = 0 } = userData?.data ?? {}

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: listModels
  })
  const models =
    modelsData?.data
      .filter((model) => model.onSaleFlag)
      .sort((a, b) => Number(a.ownedFlag) - Number(b.ownedFlag)) ?? []

  const buyModelMutation = useMutation({
    mutationFn: buyModel,
    onSuccess: () => {
      appMessage.success(t('modelBought'))
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const buyPuzzleMutation = useMutation({
    mutationFn: (currency: string) => buyPuzzle(1, currency),
    onSuccess: () => {
      appMessage.success(t('puzzleBought'))
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const { mainColor = '#3142EF' } = settingsData?.data ?? {}

  return (
    <div className="px-4 h-full overflow-y-auto scrollbar-style mask-end">
      <div className="px-12 pt-12 pb-40 w-full md:max-w-2xl md:mx-auto md:px-0 grid grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          className="select-none"
          classNames={{
            body: 'bg-neutral-300 dark:bg-neutral-700'
          }}
          cover={<MisakiLogoPuzzle className="p-12 aspect-square" style={{ color: mainColor }} />}
          actions={[
            <Button
              key="buy"
              type="primary"
              disabled={crystal < 160}
              onClick={() => buyPuzzleMutation.mutate('crystal')}
            >
              160 {t('crystal')}
            </Button>
          ]}
        >
          <Card.Meta title={t('puzzle')} description={t('item')} />
        </Card>
        <Card
          className="select-none"
          classNames={{
            body: 'bg-neutral-300 dark:bg-neutral-700'
          }}
          cover={<MisakiLogoPuzzle className="p-12 aspect-square" style={{ color: mainColor }} />}
          actions={[
            <Button
              key="buy"
              type="primary"
              disabled={stardust < 75}
              onClick={() => buyPuzzleMutation.mutate('stardust')}
            >
              75 {t('stardust')}
            </Button>
          ]}
        >
          <Card.Meta title={t('puzzle')} description={t('item')} />
        </Card>
        {models.map((model) => (
          <Card
            className="select-none"
            key={model.id}
            cover={
              <img
                src={getOssBaseUrl() + model.avatarPath}
                draggable={false}
                className="aspect-square"
              />
            }
            classNames={{
              body:
                model.grade === 5
                  ? 'bg-yellow-400 dark:bg-yellow-700'
                  : 'bg-purple-400 dark:bg-purple-700'
            }}
            actions={[
              <Button
                key="buy"
                type="primary"
                disabled={model.ownedFlag || stardust < model.price}
                onClick={() => buyModelMutation.mutate(model.id)}
              >
                {model.ownedFlag ? t('owned') : model.price + ' ' + t('stardust')}
              </Button>
            ]}
          >
            <Card.Meta title={model.name} description={t('model')} />
          </Card>
        ))}
      </div>
    </div>
  )
}
