import { InfoCircleOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { register, sendVerifyCode } from '@renderer/api/auth'
import GlassBox from '@renderer/components/common/GlassBox'
import { messageApi } from '@renderer/messageApi'
import { Button, Form, FormProps, Input, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  email: string
  username: string
  password: string
  verifyCode: string
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function Register(): React.JSX.Element {
  const navigator = useNavigate()
  const [form] = Form.useForm<FieldType>()
  const [sendVerifyCodeLoading, setSendVerifyCodeLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const { t } = useTranslation('register')

  const handleSendVerifyCode = async (): Promise<void> => {
    try {
      const { email } = await form.validateFields(['email'])
      setSendVerifyCodeLoading(true)
      await sendVerifyCode(email)
      messageApi?.success(t('sendVerifyCodeSuccess'))
    } finally {
      setTimeout(() => {
        setSendVerifyCodeLoading(false)
      }, 1000)
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setFinishLoading(true)
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        verifyCode: values.verifyCode
      })
      messageApi?.success(t('registerSuccess'))
      setFinishLoading(false)
      navigator('/login', { viewTransition: true })
    } catch {
      setTimeout(() => {
        setFinishLoading(false)
      }, 1000)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-16 h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('title')}</h1>
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
                <Input prefix={<MailOutlined />} placeholder={t('email')} allowClear />
                <Button
                  color="primary"
                  variant="filled"
                  loading={sendVerifyCodeLoading}
                  onClick={handleSendVerifyCode}
                >
                  {t('sendVerifyCode')}
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: t('usernameRequiredMessage') },
                { min: 2, message: t('usernameTypeMessage') },
                { max: 20, message: t('usernameTypeMessage') }
              ]}
            >
              <Input
                placeholder={t('username')}
                prefix={<UserOutlined />}
                suffix={
                  <Tooltip title={t('usernameTypeMessage')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                allowClear
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: t('passwordRequiredMessage') },
                { min: 6, message: t('passwordTypeMessage') },
                { max: 20, message: t('passwordTypeMessage') }
              ]}
            >
              <Input.Password
                placeholder={t('password')}
                prefix={<LockOutlined />}
                suffix={
                  <Tooltip title={t('passwordTypeMessage')}>
                    <InfoCircleOutlined />
                  </Tooltip>
                }
                allowClear
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="verifyCode"
              rules={[
                { required: true, message: t('verifyCodeRequiredMessage') },
                { pattern: /^\d{6}$/, message: t('verifyCodeTypeMessage') }
              ]}
            >
              <Input.OTP />
            </Form.Item>
            <Form.Item label={null} style={{ margin: '0' }}>
              <Button type="primary" block htmlType="submit" loading={finishLoading}>
                {t('register')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
