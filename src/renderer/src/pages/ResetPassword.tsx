import { InfoCircleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { resetPassword, sendVerifyCode } from '@renderer/api/auth'
import GlassBox from '@renderer/components/GlassBox'
import { messageApi } from '@renderer/messageManager'
import { useUserStore } from '@renderer/store/userStore'
import { Button, Form, FormProps, Input, Space, Tooltip } from 'antd'
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
  const [sendVerifyCodeLoading, setSendVerifyCodeLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const { t } = useTranslation('resetPassword')

  const onSendVerifyCode = async (): Promise<void> => {
    try {
      const { email } = await form.validateFields(['email'])
      setSendVerifyCodeLoading(true)
      await sendVerifyCode(email)
      messageApi?.success(t('sendVerifyCodeSuccess'))
      setTimeout(() => {
        setSendVerifyCodeLoading(false)
      }, 1000)
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err as AxiosError<{ message: string }>
        if (apiError.response) {
          messageApi?.error(apiError.response.data?.message)
          setTimeout(() => {
            setSendVerifyCodeLoading(false)
          }, 1000)
        } else {
          messageApi?.error(err.message)
          setSendVerifyCodeLoading(false)
        }
      }
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setFinishLoading(true)
      await resetPassword({
        email: values.email,
        password: values.password,
        verifyCode: values.verifyCode
      })
      logout()
      messageApi?.success(t('resetSuccess'))
      navigator('/', { viewTransition: true })
    } catch (err) {
      const apiError = err as AxiosError<{ message: string }>
      if (apiError.response) {
        messageApi?.error(apiError.response.data?.message)
        setTimeout(() => {
          setFinishLoading(false)
        }, 1000)
      } else {
        messageApi?.error((err as Error).message)
        setFinishLoading(false)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-center h-full">
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
              <Input.Password
                placeholder={t('password')}
                prefix={<LockOutlined />}
                suffix={
                  <Tooltip title={t('passwordTypeMessage')}>
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
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
                {t('reset')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
