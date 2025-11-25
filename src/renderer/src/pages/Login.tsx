import { LockOutlined, MailOutlined } from '@ant-design/icons'
import GlassBox from '@renderer/components/GlassBox'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '@renderer/api/auth'

type FieldType = {
  email?: string
  password?: string
  remember?: boolean
}

export default function Login(): React.JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const { t } = useTranslation('login')
  const navigator = useNavigate()

  const onFinish = async (values) => {
    try {
      const res = await login({ email: values.email, password: values.password })
      console.log(res)
    } catch (e) {
      messageApi.error('请求失败')
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('loginTitle')}</h1>
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
          >
            <Form.Item<FieldType>
              name="email"
              validateTrigger="onBlur"
              rules={[
                { type: 'email', message: t('emailTypeMessage') },
                { required: true, message: t('emailRequiredMessage') }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder={t('email')} />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: t('passwordRequiredMessage') }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder={t('password')} />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <div className="flex justify-between items-center">
                <div className="ml-2">
                  <Checkbox className="select-none">{t('rememberMe')}</Checkbox>
                </div>
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
            </Form.Item>

            <Form.Item label={null} style={{ margin: '0' }}>
              <Button type="primary" block htmlType="submit">
                {t('login')}
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
