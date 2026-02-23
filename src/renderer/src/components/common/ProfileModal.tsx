import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/store/userStore'
import { Button, DatePicker, Form, FormProps, Input, Modal, Radio, Upload } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfileModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('profileModal')
  const { id, email, username, gender, birthday, avatarPath, occupation, detail, createTime } =
    useUserStore()
  const [avatarLoading, setAvatarLoading] = useState(false)

  type FieldType = {
    username: string
    gender: number
    birthday: string
    avatarPath: string
    occupation: string
    detail: string
  }
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {}

  const beforeUpload = (file) => {}
  return (
    <>
      <Modal
        title="个人信息"
        centered
        footer={null}
        open={open}
        onCancel={onCancel}
        destroyOnHidden
        className="select-none"
      >
        <div className=" flex flex-col p-2 items-center gap-4 overflow-y-auto scrollbar-none ">
          <Upload listType="picture-card" beforeUpload={beforeUpload}>
            <button>
              {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
              <div>{t('upload')}</div>
            </button>
          </Upload>
          <Form
            name="basic"
            autoComplete="off"
            validateTrigger="onSubmit"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
              console.log('Failed:', errorInfo)
            }}
            validateMessages={{ required: t('requireTemplate') }}
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
              rules={[{ required: true, message: t('genderRequired') }]}
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
              rules={[{ required: true, message: t('birthdayRequired') }]}
            >
              <DatePicker placeholder={t('birthday')} form="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item<FieldType>
              name="occupation"
              label={t('occupation')}
              initialValue={occupation}
            >
              <Input placeholder={t('occupation')} maxLength={20} showCount />
            </Form.Item>
            <Form.Item<FieldType> name="detail" label={t('detail')} initialValue={detail}>
              <Input.TextArea placeholder={t('detail')} showCount maxLength={100}></Input.TextArea>
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
