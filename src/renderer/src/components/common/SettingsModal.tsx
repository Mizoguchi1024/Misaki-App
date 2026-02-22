import { UploadOutlined } from '@ant-design/icons'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import {
  Button,
  ColorPicker,
  Input,
  Modal,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  Tabs,
  Upload
} from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('settingsModal')
  const { jwt } = useUserStore()
  const {
    baseUrl,
    language,
    fontSize,
    appearance,
    mainColor,
    borderRadius,
    ttsAutoplay,
    backgroundImagePath,
    version: settingsVersion,
    setSettings,
    setPartial
  } = useSettingsStore()
  const [baseUrlInputValue, setBaseUrlInputValue] = useState(baseUrl.replace('http://', ''))
  const [colorPickerValue, setColorPickerValue] = useState(mainColor)

  useEffect(() => {
    setColorPickerValue(mainColor)
  }, [mainColor])

  return (
    <Modal
      title={t('title')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      className="select-none"
      destroyOnHidden
    >
      <Tabs centered tabPlacement="start">
        <TabPane
          tab={t('general')}
          key="1"
          className="h-80 pl-6 pr-2 pt-2 overflow-y-auto scrollbar-none"
        >
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span>{t('baseUrl')}</span>
              <Space.Compact className="w-64">
                <Space.Addon>http://</Space.Addon>
                <Input
                  value={baseUrlInputValue}
                  allowClear
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
            <div className="flex justify-between items-center">
              <span>{t('language')}</span>
              <Select
                className="w-24"
                defaultValue={language}
                options={[
                  { value: 0, label: '中文' },
                  { value: 1, label: 'English' },
                  { value: 2, label: '日本語' }
                ]}
                onChange={(value) => {
                  setPartial({ language: value })
                }}
              />
            </div>
            <div className="flex justify-between items-center"></div>
          </div>
        </TabPane>
        <TabPane
          tab={t('appearance')}
          key="2"
          className="h-80 pl-6 pr-2 pt-2 overflow-y-auto scrollbar-none"
        >
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
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
              <div className="flex justify-between items-center">
                <span>{t('mainColor')}</span>
                <ColorPicker
                  showText
                  value={colorPickerValue}
                  onChange={(color) => setColorPickerValue(color.toHexString())}
                  onChangeComplete={async (color) => {
                    await updateSettings({
                      mainColor: color.toHexString(),
                      version: settingsVersion
                    })
                    const settingsRes = await getSettings()
                    setSettings(settingsRes.data)
                  }}
                  disabledAlpha
                  arrow={false}
                ></ColorPicker>
              </div>
            )}
            <div className="flex justify-between items-center">
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
            <div className="flex justify-between items-center">
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
              <div className="flex justify-between items-center">
                <span>{t('backgroundImage')}</span>
                <Upload>
                  <Button icon={<UploadOutlined />}>{t('upload')}</Button>
                </Upload>
              </div>
            )}
          </div>
        </TabPane>
        {jwt && (
          <TabPane
            tab={t('chat')}
            key="3"
            className="h-80 pl-6 pr-2 pt-2 overflow-y-auto scrollbar-none"
          >
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span>{t('ttsAutoplay')}</span>
                <Switch
                  checked={ttsAutoplay}
                  onChange={async (checked) => {
                    await updateSettings({ ttsAutoplay: checked, version: settingsVersion })
                    const settingsRes = await getSettings()
                    setSettings(settingsRes.data)
                  }}
                ></Switch>
              </div>
            </div>
          </TabPane>
        )}
      </Tabs>
    </Modal>
  )
}
