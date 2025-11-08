import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, FormProps, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

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
  const navigator = useNavigate()
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-16 h-full">
        <h1 className="text-4xl select-none">登录你的 Misaki 账户</h1>
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
              <Checkbox className="select-none">记住我</Checkbox>
              <Button
                type="link"
                onClick={() => {
                  navigator('/reset-password', { viewTransition: true })
                }}
              >
                忘记密码
              </Button>
            </div>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" block htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
