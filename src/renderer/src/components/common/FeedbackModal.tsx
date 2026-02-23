import { Button, Form, FormProps, Input, Modal, Select, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

export default function FeedbackModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('feedbackModal')

  type FieldType = {
    title: string
    type: number
    content: string
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values)
  }

  const tabItems = [
    {
      key: '1',
      label: t('create'),
      children: (
        <Form
          name="basic"
          autoComplete="off"
          validateTrigger="onSubmit"
          className="h-80 pr-2 pt-2 overflow-y-auto scrollbar-none"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo)
          }}
        >
          <Form.Item<FieldType>
            name="title"
            rules={[{ required: true, message: t('titleRequired') }]}
          >
            <Input placeholder={t('title')}></Input>
          </Form.Item>
          <Form.Item<FieldType>
            name="type"
            rules={[{ required: true, message: t('typeRequired') }]}
          >
            <Select
              placeholder={t('type')}
              options={[
                { value: 0, label: '缺陷问题' },
                { value: 1, label: '功能问题' },
                { value: 2, label: '性能问题' },
                { value: 3, label: '体验问题' },
                { value: 4, label: '改进建议' }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item<FieldType>
            name="content"
            rules={[{ required: true, message: t('contentRequired') }]}
          >
            <Input.TextArea placeholder={t('content')}></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">
              {t('submit')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" block htmlType="reset">
              {t('reset')}
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      label: t('history'),
      children: <div className="h-80 pr-2 pt-2 overflow-y-auto scrollbar-none">历史反馈</div>
    }
  ]

  return (
    <>
      <Modal
        title={t('title')}
        centered
        footer={null}
        open={open}
        onCancel={onCancel}
        className="select-none"
        destroyOnHidden
      >
        <Tabs centered tabPlacement="start" items={tabItems} />
      </Modal>
    </>
  )
}
