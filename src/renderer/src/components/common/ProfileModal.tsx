import { App, Button, DatePicker, Form, FormProps, Input, Modal, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import ImageUpload from './ImageUpload'
import { UploadResponse } from '@renderer/types/common'
import { getProfile, updateProfile } from '@renderer/api/front/user'
import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type FieldType = {
  username: string
  gender: number
  birthday: dayjs.Dayjs
  avatarPath: string
  occupation: string
  detail: string
}

export default function ProfileModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('profileModal')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile
  })
  const user = userData?.data
  const { version: userVersion = 0 } = user ?? {}

  const updateUserMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    await updateUserMutation.mutateAsync({
      ...values,
      birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined,
      version: userVersion
    })
    appMessage.success(t('profileSaved'))
    onCancel()
  }

  return (
    <Modal
      title={t('profile')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      className="select-none"
    >
      <div className="flex flex-col p-2 items-center justify-between gap-4 h-160 overflow-y-auto scrollbar-style">
        <ImageUpload
          imgPath={user?.avatarPath}
          onSuccess={async (data: UploadResponse) => {
            updateUserMutation.mutate({ avatarPath: data.path, version: userVersion })
            appMessage.success(t('uploadSuccess'))
          }}
        />
        <Form
          name="basic"
          autoComplete="off"
          validateTrigger="onSubmit"
          colon={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          requiredMark={false}
          onFinish={onFinish}
          validateMessages={{ required: t('requiredTemplate', { label: '${label}' }) }}
          className="w-full"
          initialValues={{
            ...user,
            birthday: user?.birthday ? dayjs(user.birthday) : undefined
          }}
        >
          <Form.Item name="id" label={t('id')}>
            <span>{user?.id}</span>
          </Form.Item>
          <Form.Item name="email" label={t('email')}>
            <span>{user?.email}</span>
          </Form.Item>
          <Form.Item<FieldType> name="username" label={t('username')} rules={[{ required: true }]}>
            <Input placeholder={t('username')} maxLength={20} showCount spellCheck={false} />
          </Form.Item>
          <Form.Item<FieldType> name="gender" label={t('gender')} rules={[{ required: true }]}>
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value={0}>{t('unknown')}</Radio.Button>
              <Radio.Button value={1}>{t('male')}</Radio.Button>
              <Radio.Button value={2}>{t('female')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType> name="birthday" label={t('birthday')}>
            <DatePicker
              placeholder={t('birthday')}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>
          <Form.Item<FieldType> name="occupation" label={t('occupation')}>
            <Input placeholder={t('occupation')} maxLength={20} showCount spellCheck={false} />
          </Form.Item>
          <Form.Item<FieldType> name="detail" label={t('detail')}>
            <Input.TextArea
              placeholder={t('detail')}
              showCount
              maxLength={100}
              spellCheck={false}
              autoSize={{ minRows: 2, maxRows: 4 }}
              className="scrollbar-style"
            />
          </Form.Item>
          <Form.Item name="createTime" label={t('createTime')}>
            <span>{user?.createTime}</span>
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            {t('save')}
          </Button>
        </Form>
      </div>
    </Modal>
  )
}
