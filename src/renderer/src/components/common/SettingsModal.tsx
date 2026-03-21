import { deleteUser, getSettings, updateSettings } from '@renderer/api/front/user'
import { LanguageMap, useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import {
  App,
  Button,
  ColorPicker,
  Input,
  Modal,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Tabs
} from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageUpload from './ImageUpload'
import { UploadResponse } from '@renderer/types/common'
import { useNavigate } from 'react-router-dom'
import { deleteAllChats } from '@renderer/api/front/chat'
import { chatsInfiniteQueryKey } from '@renderer/hooks/useChatsInfiniteQuery'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function SettingsModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('settingsModal')
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { jwt } = useUserStore()
  const { baseUrl, language, fontSize, appearance, borderRadius, setPartial, resetLocalSettings } =
    useSettingsStore()
  const [baseUrlInputValue, setBaseUrlInputValue] = useState(baseUrl.replace('http://', ''))

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!jwt
  })
  const {
    mainColor = '#3142EF',
    backgroundPath,
    backgroundBlur,
    backgroundOpacity,
    ttsAutoplay,
    promptsSuggestion,
    version: settingsVersion
  } = settingsData?.data ?? {}

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })

  const deleteAllChatsMutation = useMutation({
    mutationFn: deleteAllChats,
    onSuccess: () => {
      appMessage.success(t('allChatsDeleted'))
      queryClient.invalidateQueries({ queryKey: chatsInfiniteQueryKey })
    }
  })

  const [colorPickerValue, setColorPickerValue] = useState(mainColor)

  useEffect(() => {
    setColorPickerValue(mainColor)
  }, [mainColor])

  const tabItems = [
    {
      key: '1',
      label: t('general'),
      children: (
        <div className="h-86 w-full flex flex-col gap-4 p-2 ml-4 overflow-y-auto scrollbar-style">
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('baseUrl')}</span>
            <Space.Compact className="w-2/3">
              <Space.Addon>http://</Space.Addon>
              <Input
                value={baseUrlInputValue}
                allowClear
                maxLength={100}
                spellCheck={false}
                onChange={(e) => {
                  setBaseUrlInputValue(e.target.value)
                }}
                onPressEnter={() => {
                  setPartial({ baseUrl: 'http://' + baseUrlInputValue })
                }}
                onBlur={() => {
                  setPartial({ baseUrl: 'http://' + baseUrlInputValue })
                }}
              ></Input>
            </Space.Compact>
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('language')}</span>
            <Select
              className="w-24"
              defaultValue={language}
              options={[
                { value: 0, label: LanguageMap[0] },
                { value: 1, label: LanguageMap[1] },
                { value: 2, label: LanguageMap[2] }
              ]}
              onChange={(value) => {
                setPartial({ language: value })
              }}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('resetLocalSettings')}</span>
            <Button
              color="danger"
              variant="filled"
              onClick={() => {
                resetLocalSettings()
              }}
            >
              {t('reset')}
            </Button>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: t('appearance'),
      children: (
        <div className="h-86 w-full flex flex-col gap-4 p-2 ml-4 overflow-y-auto scrollbar-style">
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('appearance')}</span>
            <Segmented<string>
              defaultValue={appearance.toString()}
              shape="round"
              options={[
                { label: t('auto'), value: '0' },
                { label: t('light'), value: '1' },
                { label: t('dark'), value: '2' }
              ]}
              onChange={(value) => {
                setPartial({ appearance: Number(value) })
              }}
            />
          </div>
          {jwt && (
            <div className="flex justify-between items-center min-h-8 flex-none">
              <span>{t('mainColor')}</span>
              <ColorPicker
                showText
                value={colorPickerValue}
                onChange={(color) => setColorPickerValue(color.toHexString())}
                onChangeComplete={(color) =>
                  updateSettingsMutation.mutate({
                    mainColor: color.toHexString(),
                    version: settingsVersion!
                  })
                }
                disabledAlpha
                arrow={false}
                classNames={{
                  description: 'font-mono'
                }}
              />
            </div>
          )}
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('fontSize')}</span>
            <Select
              className="w-24"
              defaultValue={fontSize}
              options={[
                { value: 12, label: '12' },
                { value: 14, label: '14' },
                { value: 16, label: '16' },
                { value: 18, label: '18' },
                { value: 20, label: '20' },
                { value: 22, label: '22' },
                { value: 24, label: '24' },
                { value: 26, label: '26' },
                { value: 28, label: '28' },
                { value: 30, label: '30' },
                { value: 32, label: '32' }
              ]}
              onChange={(value) => {
                setPartial({ fontSize: value })
              }}
            />
          </div>
          <div className="flex justify-between items-center min-h-8 flex-none">
            <span>{t('borderRadius')}</span>
            <Slider
              min={0}
              max={16}
              defaultValue={borderRadius}
              className="w-36 mr-2"
              marks={{ 0: '0', 12: '12', 16: '16' }}
              onChange={(value) => setPartial({ borderRadius: value })}
            />
          </div>
          {jwt && (
            <div className="flex justify-between items-center min-h-8 flex-none">
              <span>{t('backgroundImage')}</span>
              <ImageUpload
                imgPath={backgroundPath}
                onSuccess={async (data: UploadResponse) => {
                  updateSettingsMutation.mutate({
                    backgroundPath: data.path,
                    version: settingsVersion!
                  })
                  appMessage.success(t('uploadSuccess'))
                }}
              />
            </div>
          )}
          {jwt && backgroundPath && (
            <>
              <div className="flex justify-between items-center min-h-8 flex-none">
                <span>{t('deleteBackground')}</span>
                <Button
                  color="danger"
                  variant="filled"
                  onClick={async () => {
                    updateSettingsMutation.mutate({
                      backgroundPath: '',
                      version: settingsVersion!
                    })
                    appMessage.success(t('backgroundDeleted'))
                  }}
                >
                  {t('delete')}
                </Button>
              </div>
              <div className="flex justify-between items-center min-h-8 flex-none">
                <span>{t('backgroundOpacity')}</span>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={backgroundOpacity}
                  className="w-36 mr-2"
                  marks={{ 0: '0', 100: '100' }}
                  onChangeComplete={async (value) =>
                    updateSettingsMutation.mutate({
                      backgroundOpacity: value,
                      version: settingsVersion!
                    })
                  }
                />
              </div>
              <div className="flex justify-between items-center min-h-8 flex-none">
                <span>{t('backgroundBlur')}</span>
                <Slider
                  min={0}
                  max={50}
                  defaultValue={backgroundBlur}
                  className="w-36 mr-2"
                  marks={{ 0: '0', 50: '50' }}
                  onChangeComplete={async (value) =>
                    updateSettingsMutation.mutate({
                      backgroundBlur: value,
                      version: settingsVersion!
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      )
    },
    ...(jwt
      ? [
          {
            key: '3',
            label: t('account'),
            children: (
              <div className="h-86 w-full flex flex-col gap-4 p-2 ml-4 overflow-y-auto scrollbar-style">
                <div className="flex justify-between items-center min-h-8 flex-none">
                  <span>{t('resetPassword')}</span>
                  <Button
                    color="default"
                    variant="filled"
                    onClick={() => navigate('/reset-password', { viewTransition: true })}
                  >
                    {t('reset')}
                  </Button>
                </div>
                <div className="flex justify-between items-center min-h-8 flex-none">
                  <span>{t('deleteAccount')}</span>
                  <Button
                    color="danger"
                    variant="filled"
                    onClick={() => {
                      deleteUser()
                    }}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </div>
            )
          },
          {
            key: '4',
            label: t('chat'),
            children: (
              <div className="h-86 w-full flex flex-col gap-4 p-2 ml-4 overflow-y-auto scrollbar-style">
                <div className="flex justify-between items-center min-h-8 flex-none">
                  <span>{t('promptsSuggestion')}</span>
                  <Switch
                    checked={promptsSuggestion}
                    onChange={async (checked) =>
                      updateSettingsMutation.mutate({
                        promptsSuggestion: checked,
                        version: settingsVersion!
                      })
                    }
                  />
                </div>
                <div className="flex justify-between items-center min-h-8 flex-none">
                  <span>{t('ttsAutoplay')}</span>
                  <Switch
                    checked={ttsAutoplay}
                    onChange={async (checked) =>
                      updateSettingsMutation.mutate({
                        ttsAutoplay: checked,
                        version: settingsVersion!
                      })
                    }
                  />
                </div>
                <div className="flex justify-between items-center min-h-8 flex-none">
                  <span>{t('deleteAllChats')}</span>
                  <Button
                    color="danger"
                    variant="filled"
                    onClick={() => deleteAllChatsMutation.mutate()}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </div>
            )
          }
        ]
      : [])
  ]

  return (
    <Modal
      title={t('settings')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
      destroyOnHidden
    >
      <Tabs
        animated
        items={tabItems}
        tabPlacement="start"
        classNames={{
          item: 'pl-0.5',
          header: 'pt-1',
          content: 'p-0'
        }}
      />
    </Modal>
  )
}
