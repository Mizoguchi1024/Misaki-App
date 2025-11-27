import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { resetPassword, sendVerifyCode } from '@renderer/api/auth'
import GlassBox from '@renderer/components/GlassBox'
import { messageApi } from '@renderer/messageManager'
import { useUserStore } from '@renderer/store/userStore'
import { Button, Form, FormProps, Input, Space } from 'antd'
import { AxiosError } from 'axios'
import { useState } from 'react'
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
  const navigator = useNavigate()
  const { logout } = useUserStore()
  const [form] = Form.useForm<FieldType>()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('resetPassword')

  const onSendVerifyCode = async (): Promise<void> => {
    try {
      const { email } = await form.validateFields(['email'])
      setLoading(true)
      await sendVerifyCode(email)
      messageApi?.success(t('sendVerifyCodeSuccess'))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (err) {
      if (err instanceof AxiosError) {
        messageApi?.error(err?.message)
      }
      setLoading(false)
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await resetPassword({
        email: values.email,
        password: values.password,
        verifyCode: values.verifyCode
      })
      logout()
      messageApi?.success(t('resetSuccess'))
      navigator('/', { viewTransition: true })
    } catch (err) {
      const serverMsg =
        (err as AxiosError<{ message: string }>)?.response?.data?.message || (err as Error)?.message
      messageApi?.error(serverMsg)
    }
  }

  return (
    <>
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
            validateTrigger="onSubmit"
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
                <Button
                  color="primary"
                  variant="filled"
                  loading={loading}
                  onClick={onSendVerifyCode}
                >
                  {t('sendVerifyCode')}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: t('passwordRequiredMessage') },
                { min: 6, message: t('passwordTypeMessage') },
                { max: 20, message: t('passwordTypeMessage') }
              ]}
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
