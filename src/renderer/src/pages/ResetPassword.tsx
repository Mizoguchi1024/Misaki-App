import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, FormProps, Input, Space } from 'antd'

type FieldType = {
  email?: string
  password?: string
  verifyCode?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export default function ResetPassword(): React.JSX.Element {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-16 h-full">
        <h1 className="text-4xl select-none">更改 Misaki 账户密码</h1>
        <Form
          name="basic"
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
            <Space.Compact className="w-full">
              <Input prefix={<MailOutlined />} placeholder="电子邮箱" />
              <Button color="primary" variant="filled">发送验证码</Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入您的密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>

          <Form.Item<FieldType>
            name="verifyCode"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input.OTP />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" block htmlType="submit">
              更改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
