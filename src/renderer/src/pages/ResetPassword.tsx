import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { resetPassword, sendVerifyCode } from '@renderer/api/auth'
import GlassBox from '@renderer/components/GlassBox'
import { Button, Form, FormProps, Input, message, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  email: string
  password: string
  verifyCode: string
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function ResetPassword(): React.JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const navigator = useNavigate()
  const [form] = Form.useForm<FieldType>()
  const { t } = useTranslation('resetPassword')

  const onSendVerifyCode = async () => {
    try {
      const { email } = await form.validateFields(['email'])
      await sendVerifyCode(email)
      messageApi.success(t('sendVerifyCodeSuccess'))
    } catch (err) {
      if ((err as any)?.errorFields) return
      const serverMsg = (err as any)?.response?.data?.message || (err as Error).message
      messageApi.error(serverMsg)
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await resetPassword({
        email: values.email,
        password: values.password,
        verifyCode: values.verifyCode
      })
      messageApi.success(t('resetSuccess'))
      navigator('/', { viewTransition: true })
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message
      messageApi.error(serverMsg)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('resetPasswordTitle')}</h1>
          <Form
            form={form}
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
                <Button color="primary" variant="filled" onClick={onSendVerifyCode}>
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
