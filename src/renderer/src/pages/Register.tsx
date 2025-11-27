import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { login, register, sendVerifyCode } from '@renderer/api/auth'
import { getProfile } from '@renderer/api/user'
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

export default function Register(): React.JSX.Element {
  const { setAuthInfo, setProfile } = useUserStore()
  const navigator = useNavigate()
  const [form] = Form.useForm<FieldType>()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('register')

  const handleSendVerifyCode = async (): Promise<void> => {
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
      await register({
        email: values.email,
        password: values.password,
        verifyCode: values.verifyCode
      })
      messageApi?.success(t('registerSuccess'))
      const loginRes = await login({ email: values.email, password: values.password })
      setAuthInfo(loginRes)
      const profileRes = await getProfile()
      setProfile(profileRes)
      navigator('/', { viewTransition: true })
    } catch (err) {
      const serverMsg =
        (err as AxiosError<{ message: string }>)?.response?.data?.message || (err as Error)?.message
      messageApi?.error(serverMsg)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-16 h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('registerTitle')}</h1>
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
                  onClick={handleSendVerifyCode}
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
                {t('register')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
