import { InfoCircleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { resetPassword, sendVerifyCode } from '@renderer/api/common/auth'
import { getProfile } from '@renderer/api/front/user'
import GlassBox from '@renderer/components/common/GlassBox'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { useUserStore } from '@renderer/store/userStore'
import { App, Button, Form, FormProps, Input, Space, Tooltip } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  email: string
  password: string
  verifyCode: string
}

export default function ResetPassword(): React.JSX.Element {
  const { message: appMessage } = App.useApp()
  const [passwordFocus, setPasswordFocus] = useState(false)
  const navigate = useNavigate()
  const { jwt, setProfile } = useUserStore()
  const [form] = Form.useForm<FieldType>()
  const [sendVerifyCodeLoading, setSendVerifyCodeLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const { t } = useTranslation('resetPassword')
  const { language } = useSettingsStore()

  const onSendVerifyCode = async (): Promise<void> => {
    try {
      const { email } = await form.validateFields(['email'])
      setSendVerifyCodeLoading(true)
      await sendVerifyCode(email, language)
      appMessage.success(t('verifyCodeSent'))
    } finally {
      setTimeout(() => {
        setSendVerifyCodeLoading(false)
      }, 1000)
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
      if (jwt) {
        const profileRes = await getProfile()
        setProfile(profileRes.data)
      }
      appMessage.success(t('passwordReset'))
      setFinishLoading(false)
      navigate('/', { viewTransition: true })
    } catch {
      setTimeout(() => {
        setFinishLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="relative flex items-center justify-center h-full overflow-hidden bg-[url(src/assets/img/login-background.png)] bg-cover bg-center">
      <div
        className={clsx(
          'absolute inset-0 bg-[url(src/assets/img/login-background-password.png)] bg-cover bg-center duration-500 ease-in-out',
          passwordFocus ? 'opacity-100' : 'opacity-0'
        )}
      />
      <GlassBox className="flex flex-col items-center justify-center px-12 py-10 gap-12">
        <h1 className="text-4xl font-medium select-none">{t('resetPassword')}</h1>
        <Form
          form={form}
          name="basic"
          size={'large'}
          variant={'filled'}
          onFinish={onFinish}
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
              <Input
                prefix={<MailOutlined />}
                placeholder={t('email')}
                allowClear
                spellCheck={false}
              />
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
                  <InfoCircleOutlined />
                </Tooltip>
              }
              allowClear
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="verifyCode"
            rules={[
              { required: true, message: t('verifyCodeRequiredMessage') },
              { pattern: /^\d{6}$/, message: t('verifyCodeTypeMessage') }
            ]}
          >
            <Input.OTP className="w-full justify-between" />
          </Form.Item>
          <Form.Item label={null} style={{ margin: '0' }}>
            <Button type="primary" block htmlType="submit" loading={finishLoading}>
              {t('reset')}
            </Button>
          </Form.Item>
        </Form>
      </GlassBox>
    </div>
  )
}
