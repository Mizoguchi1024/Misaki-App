import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  StopOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { createFeedback, deleteFeedback, listFeedbacks } from '@renderer/api/front/feedback'
import { messageApi } from '@renderer/messageApi'
import { useFeedbackStore } from '@renderer/store/feedbackStore'
import { Button, Card, Empty, Form, FormProps, Input, Modal, Select, Tabs, Tag } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyState from './EmptyState'

export default function FeedbackModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('feedbackModal')
  const { feedbacks, setFeedbacks } = useFeedbackStore()

  useEffect(() => {
    const load = async (): Promise<void> => {
      const feedbacksRes = await listFeedbacks()
      setFeedbacks(feedbacksRes.data)
    }
    if (open) {
      load()
    }
  }, [open])

  const feedbackTypeMap = {
    0: t('bug'),
    1: t('task'),
    2: t('performance'),
    3: t('experience'),
    4: t('advice')
  }

  const feedbackStatusMap = {
    0: { text: t('new'), color: 'blue', icon: <InfoCircleOutlined /> },
    1: { text: t('processing'), color: 'geekblue', icon: <SyncOutlined spin /> },
    2: { text: t('rejected'), color: 'red', icon: <CloseCircleOutlined /> },
    3: { text: t('resolved'), color: 'green', icon: <CheckCircleOutlined /> },
    4: { text: t('closed'), color: 'default', icon: <StopOutlined /> }
  }

  type FieldType = {
    title: string
    type: number
    content: string
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await createFeedback({
        title: values.title,
        type: values.type,
        content: values.content
      })
      messageApi?.success(t('createSuccess'))
      const feedbacksRes = await listFeedbacks()
      setFeedbacks(feedbacksRes.data)
    } catch (e) {
      console.error(e)
    }
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
          className="h-120 pl-6 pt-2 pr-2 overflow-y-auto scrollbar-none"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo)
          }}
        >
          <Form.Item<FieldType>
            name="title"
            rules={[{ required: true, message: t('titleRequired') }]}
          >
            <Input placeholder={t('title')} showCount maxLength={50}></Input>
          </Form.Item>
          <Form.Item<FieldType>
            name="type"
            rules={[{ required: true, message: t('typeRequired') }]}
          >
            <Select
              placeholder={t('type')}
              options={[
                { value: 0, label: feedbackTypeMap[0] },
                { value: 1, label: feedbackTypeMap[1] },
                { value: 2, label: feedbackTypeMap[2] },
                { value: 3, label: feedbackTypeMap[3] },
                { value: 4, label: feedbackTypeMap[4] }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item<FieldType>
            name="content"
            rules={[{ required: true, message: t('contentRequired') }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 7, maxRows: 9 }}
              placeholder={t('content')}
              showCount
              maxLength={1000}
            ></Input.TextArea>
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
      children: (
        <div className="h-120 pl-6 pt-2 pr-2 pb-2 flex flex-col gap-4 overflow-y-auto scrollbar-none">
          {feedbacks?.length === 0 && <EmptyState className="text-lg" />}
          {feedbacks?.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              extra={
                <div className="flex gap-2">
                  <Tag>{feedbackTypeMap[item.type]}</Tag>
                  <Tag
                    color={feedbackStatusMap[item.status].color}
                    icon={feedbackStatusMap[item.status].icon}
                  >
                    {feedbackStatusMap[item.status].text}
                  </Tag>
                </div>
              }
              actions={[
                <Button
                  key="delete"
                  color="danger"
                  variant="outlined"
                  onClick={async () => {
                    try {
                      await deleteFeedback(item.id)
                      messageApi?.success(t('deleteSuccess'))
                      const feedbacksRes = await listFeedbacks()
                      setFeedbacks(feedbacksRes.data)
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                >
                  {t('delete')}
                </Button>
              ]}
              onClick={() => {}}
              className="shadow-sm hover:shadow-lg dark:hover:shadow-neutral-700 dark:hover:shadow-lg ease-in-out duration-500"
            >
              <Card.Grid className="w-full" hoverable={false}>
                {item.content}
              </Card.Grid>
              {item.reply && (
                <Card.Grid className="w-full" hoverable={false}>
                  {item.reply}
                </Card.Grid>
              )}
            </Card>
          ))}
        </div>
      )
    }
  ]

  return (
    <>
      <Modal
        title={t('feedback')}
        centered
        footer={null}
        open={open}
        onCancel={onCancel}
        className="select-none"
        destroyOnHidden
      >
        <Tabs
          centered
          tabPlacement="start"
          items={tabItems}
          classNames={{
            header: 'pt-2',
            content: 'p-0'
          }}
        />
      </Modal>
    </>
  )
}
