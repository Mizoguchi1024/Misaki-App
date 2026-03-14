import { LockOutlined, MailOutlined } from '@ant-design/icons'
import GlassBox from '@renderer/components/common/GlassBox'
import { App, Button, Checkbox, Form, FormProps, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '@renderer/api/common/auth'
import { useUserStore } from '@renderer/store/userStore'
import { useState } from 'react'
import clsx from 'clsx'

type FieldType = {
  email: string
  password: string
  remember: boolean
}

export default function Login(): React.JSX.Element {
  const { message: appMessage } = App.useApp()
  const [passwordFocus, setPasswordFocus] = useState(false)
  const { setAuthInfo, setRememberMe } = useUserStore()
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const { t } = useTranslation('login')
  const navigate = useNavigate()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setSubmitButtonLoading(true)
      const loginRes = await login({ email: values.email, password: values.password })
      setAuthInfo(loginRes.data)
      setRememberMe(values.remember)
      appMessage.success(t('loginSuccess'))
      setSubmitButtonLoading(false)
      navigate('/', { viewTransition: true })
    } catch {
      setTimeout(() => {
        setSubmitButtonLoading(false)
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
        <h1 className="text-4xl font-medium select-none">{t('loginAccount')}</h1>
        <Form
          name="basic"
          initialValues={{ remember: true }}
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
            <Input prefix={<MailOutlined />} placeholder={t('email')} spellCheck={false} />
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
              prefix={<LockOutlined />}
              placeholder={t('password')}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
          </Form.Item>
          <div className="flex justify-between items-start pl-2">
            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <Checkbox className="select-none">{t('rememberMe')}</Checkbox>
            </Form.Item>
            <Button
              color="primary"
              variant="text"
              onClick={() => {
                navigate('/reset-password', { viewTransition: true })
              }}
            >
              {t('forgotPassword')}
            </Button>
          </div>
          <Form.Item label={null} className="m-0">
            <Button type="primary" block htmlType="submit" loading={submitButtonLoading}>
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
      </GlassBox>
    </div>
  )
}
