import { InfoCircleOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { resetPassword, sendVerifyCode } from '@renderer/api/common/auth'
import GlassBox from '@renderer/components/common/GlassBox'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { App, Button, Form, Input, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ResetPasswordRequest } from '@renderer/types/auth'
import authBg from '@renderer/assets/img/auth-background.png'
import passwordBg from '@renderer/assets/img/auth-background-password.png'
import clsx from 'clsx'

export default function ResetPassword(): React.JSX.Element {
  const { t } = useTranslation('resetPassword')
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { language } = useSettingsStore()
  const [form] = Form.useForm<ResetPasswordRequest>()
  const [passwordFocus, setPasswordFocus] = useState(false)
  const [sendVerifyCodeLoading, setSendVerifyCodeLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)

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

  const updateMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      appMessage.success(t('passwordReset'))
      setFinishLoading(false)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/', { viewTransition: true })
    }
  })

  return (
    <div
      className="relative flex items-center justify-center h-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div
        className={clsx(
          'absolute inset-0 bg-cover bg-center duration-500 ease-in-out',
          passwordFocus ? 'opacity-100' : 'opacity-0'
        )}
        style={{ backgroundImage: `url(${passwordBg})` }}
      />
      <GlassBox className="flex flex-col items-center justify-center px-12 py-10 gap-12">
        <h1 className="text-4xl font-medium select-none">{t('resetPassword')}</h1>
        <Form
          form={form}
          name="basic"
          size={'large'}
          variant={'filled'}
          autoComplete="off"
          className="w-100"
          validateTrigger="onSubmit"
          onFinish={(values) => {
            try {
              setFinishLoading(true)
              updateMutation.mutate(values)
            } catch {
              setTimeout(() => {
                setFinishLoading(false)
              }, 1000)
            }
          }}
        >
          <Form.Item<ResetPasswordRequest>
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
          <Form.Item<ResetPasswordRequest>
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
          <Form.Item<ResetPasswordRequest>
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
