import { useUserStore } from '@renderer/store/userStore'
import { Button, DatePicker, Form, FormProps, Input, Modal, Radio } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ImageUpload from './ImageUpload'
import { UploadResponse } from '@renderer/types/api/common'
import { getProfile, updateProfile } from '@renderer/api/front/user'
import { messageApi } from '@renderer/messageApi'

export default function ProfileModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('profileModal')
  const {
    id,
    email,
    username,
    gender,
    birthday,
    avatarPath,
    occupation,
    detail,
    createTime,
    version: profileVersion,
    setProfile
  } = useUserStore()

  type FieldType = {
    username: string
    gender: number
    birthday: dayjs.Dayjs
    avatarPath: string
    occupation: string
    detail: string
  }
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await updateProfile({
        username: values.username,
        gender: values.gender,
        birthday: values.birthday.format('YYYY-MM-DD'),
        avatarPath: values.avatarPath,
        occupation: values.occupation,
        detail: values.detail,
        version: profileVersion!
      })
      const profileRes = await getProfile()
      setProfile(profileRes.data)
      messageApi?.success(t('saveSuccess'))
    } catch {
      return
    }
  }

  return (
    <>
      <Modal
        title={t('profile')}
        centered
        footer={null}
        open={open}
        onCancel={onCancel}
        destroyOnHidden
        className="select-none"
      >
        <div className=" flex flex-col p-2 items-center gap-4 h-160 overflow-y-auto scrollbar-none">
          <ImageUpload
            imgPath={avatarPath}
            onSuccess={async (data: UploadResponse) => {
              try {
                await updateProfile({ avatarPath: data.path, version: profileVersion! })
                messageApi?.success(t('uploadSuccess'))
                const profileRes = await getProfile()
                setProfile(profileRes.data)
              } catch {
                return
              }
            }}
          />
          <Form
            name="basic"
            autoComplete="off"
            validateTrigger="onSubmit"
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            labelAlign="left"
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
              console.log('Failed:', errorInfo)
            }}
            validateMessages={{ required: t('requiredTemplate') }}
            className="w-full"
          >
            <Form.Item name="id" label={t('id')}>
              <span>{id}</span>
            </Form.Item>
            <Form.Item name="email" label={t('email')}>
              <span>{email}</span>
            </Form.Item>
            <Form.Item<FieldType>
              name="username"
              label={t('username')}
              initialValue={username}
              rules={[{ required: true }]}
            >
              <Input placeholder={t('username')} maxLength={20} showCount />
            </Form.Item>
            <Form.Item<FieldType>
              name="gender"
              label={t('gender')}
              initialValue={gender}
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio.Button value={0}>{t('unknown')}</Radio.Button>
                <Radio.Button value={1}>{t('male')}</Radio.Button>
                <Radio.Button value={2}>{t('female')}</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              name="birthday"
              label={t('birthday')}
              initialValue={dayjs(birthday)}
            >
              <DatePicker
                placeholder={t('birthday')}
                form="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="occupation"
              label={t('occupation')}
              initialValue={occupation}
            >
              <Input placeholder={t('occupation')} maxLength={20} showCount />
            </Form.Item>
            <Form.Item<FieldType> name="detail" label={t('detail')} initialValue={detail}>
              <Input.TextArea placeholder={t('detail')} showCount maxLength={100} autoSize={{ minRows: 2, maxRows: 4 }}></Input.TextArea>
            </Form.Item>
            <Form.Item name="createTime" label={t('createTime')}>
              <span>{createTime}</span>
            </Form.Item>
            <Button type="primary" block htmlType="submit">
              {t('save')}
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  )
}
