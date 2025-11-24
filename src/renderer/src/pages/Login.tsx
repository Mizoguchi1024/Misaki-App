import { LockOutlined, MailOutlined } from '@ant-design/icons'
import GlassBox from '@renderer/components/GlassBox'
import { Button, Checkbox, Form, FormProps, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type FieldType = {
  email?: string
  password?: string
  remember?: boolean
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function Login(): React.JSX.Element {
  const { t } = useTranslation('common')
  const navigator = useNavigate()
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <GlassBox className="gap-12">
          <h1 className="text-4xl font-medium select-none">{t('loginTitle')}</h1>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            size={'large'}
            variant={'filled'}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="w-100"
          >
            <Form.Item<FieldType>
              name="email"
              rules={[{ required: true, message: '请输入您的邮箱' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="电子邮箱" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: '请输入您的密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked">
              <div className="flex justify-between items-center">
                <div className="ml-2">
                  <Checkbox className="select-none">记住我</Checkbox>
                </div>
                <Button
                  color="primary" variant="text"
                  onClick={() => {
                    navigator('/reset-password', { viewTransition: true })
                  }}
                >
                  忘记密码
                </Button>
              </div>
            </Form.Item>

            <Form.Item label={null} style={{ margin: '0' }}>
              <Button type="primary" block htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </GlassBox>
      </div>
    </>
  )
}
