import { LockOutlined, MailOutlined } from '@ant-design/icons'
import GlassBox from '@renderer/components/GlassBox'
import { Button, Checkbox, Form, FormProps, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '@renderer/api/auth'
import { useUserStore } from '@renderer/store/userStore'
import { getProfile, getSettings } from '@renderer/api/front/user'
import { messageApi } from '@renderer/messageManager'
import { useState } from 'react'
import { useSettingsStore } from '@renderer/store/settingsStore'

type FieldType = {
  email: string
  password: string
  remember: boolean
}

export default function Login(): React.JSX.Element {
  const { setAuthInfo, setProfile, setRememberMe } = useUserStore()
  const { setSettings } = useSettingsStore()
  const [finishLoading, setFinishLoading] = useState(false)
  const { t } = useTranslation('login')
  const navigator = useNavigate()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setFinishLoading(true)
      const loginRes = await login({ email: values.email, password: values.password })
      setAuthInfo(loginRes.data)
      setRememberMe(values.remember)
      messageApi?.success(t('loginSuccess'))
      const profileRes = await getProfile()
      setProfile(profileRes.data)
      const settingsRes = await getSettings()
      setSettings(settingsRes.data)
      setFinishLoading(false)
      navigator('/', { viewTransition: true })
    } catch {
      setTimeout(() => {
        setFinishLoading(false)
      }, 1000)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('title')}</h1>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            size={'large'}
            variant={'filled'}
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
              console.log('Failed:', errorInfo)
            }}
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
              <Input prefix={<MailOutlined />} placeholder={t('email')} />
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
            <div className="flex justify-between items-start pl-2">
              <Form.Item<FieldType> name="remember" valuePropName="checked">
                <Checkbox className="select-none">{t('rememberMe')}</Checkbox>
              </Form.Item>
              <Button
                color="primary"
                variant="text"
                onClick={() => {
                  navigator('/reset-password', { viewTransition: true })
                }}
              >
                {t('forgotPassword')}
              </Button>
            </div>
            <Form.Item label={null} style={{ margin: '0' }}>
              <Button type="primary" block htmlType="submit" loading={finishLoading}>
                {t('login')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
