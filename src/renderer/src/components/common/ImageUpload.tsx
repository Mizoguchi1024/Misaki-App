import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { upload } from '@renderer/api/common/common'
import { messageApi } from '@renderer/messageApi'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { Tooltip, Upload } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageUpload({ imgPath, onSuccess }): React.JSX.Element {
  const { t } = useTranslation('imageUpload')
  const { borderRadius, getOssBaseUrl } = useSettingsStore()
  const [avatarLoading, setAvatarLoading] = useState(false)

  const beforeUpload = (file: File): boolean => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      messageApi?.warning(t('onlyImage'))
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      messageApi?.warning(t('sizeLimit'))
    }
    return isImage && isLt10M
  }

  return (
    <Tooltip title={t('sizeLimit')}>
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={async (options) => {
          const { file, onSuccess: uploadOnSuccess } = options
          const formData = new FormData()
          formData.append('file', file as File)
          try {
            setAvatarLoading(true)
            const uploadRes = await upload(formData)
            uploadOnSuccess?.(uploadRes.data, file)
            onSuccess?.(uploadRes.data)
          } catch {
            return
          } finally {
            setAvatarLoading(false)
          }
        }}
      >
        {imgPath ? (
          <img
            src={getOssBaseUrl() + imgPath}
            alt="avatar"
            draggable={false}
            className="w-full h-full object-cover"
            style={{ borderRadius }}
          />
        ) : (
          <button>
            {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div>{t('upload')}</div>
          </button>
        )}
      </Upload>
    </Tooltip>
  )
}
