import { LockOutlined, MailOutlined } from '@ant-design/icons'
import GlassBox from '@renderer/components/GlassBox'
import { Button, Form, FormProps, Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'

type FieldType = {
  email?: string
  password?: string
  verifyCode?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function ResetPassword(): React.JSX.Element {
  const { t } = useTranslation('resetPassword')
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('resetPasswordTitle')}</h1>
          <Form
            name="basic"
            size={'large'}
            variant={'filled'}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="w-100"
          >
            <Form.Item<FieldType>
              name="email"
              rules={[
                { type: 'email', message: t('emailTypeMessage') },
                { required: true, message: t('emailRequiredMessage') }
              ]}
            >
              <Space.Compact className="w-full">
                <Input prefix={<MailOutlined />} placeholder={t('email')} />
                <Button color="primary" variant="filled">
                  {t('sendVerifyCode')}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: t('passwordRequiredMessage') }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
            </Form.Item>

            <Form.Item<FieldType>
              name="verifyCode"
              rules={[{ required: true, message: t('verifyCodeRequiredMessage') }]}
            >
              <Input.OTP />
            </Form.Item>

            <Form.Item label={null} style={{ margin: '0' }}>
              <Button type="primary" block htmlType="submit">
                {t('reset')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
