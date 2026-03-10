import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  StopOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { createFeedback, deleteFeedback, listFeedbacks } from '@renderer/api/front/feedback'
import { useFeedbackStore } from '@renderer/store/feedbackStore'
import { App, Button, Card, Divider, Form, FormProps, Input, Modal, Select, Tabs, Tag } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyState from './EmptyState'

export default function FeedbackModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('feedbackModal')
  const { message: appMessage } = App.useApp()
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
      appMessage.success(t('feedbackCreated'))
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
          className="h-120 p-2 ml-4 flex flex-col justify-between overflow-y-auto scrollbar-none"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log('Failed:', errorInfo)
          }}
        >
          <div>
            <Form.Item<FieldType>
              name="title"
              rules={[{ required: true, message: t('titleRequired') }]}
            >
              <Input placeholder={t('title')} showCount maxLength={50} spellCheck={false}></Input>
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
                autoSize={{ minRows: 10, maxRows: 12 }}
                placeholder={t('content')}
                showCount
                maxLength={1000}
                spellCheck={false}
                className="scrollbar-style"
              />
            </Form.Item>
          </div>
          <div className="flex justify-around">
            <Button type="default" htmlType="reset">
              {t('clear')}
            </Button>
            <Button type="primary" htmlType="submit">
              {t('submit')}
            </Button>
          </div>
        </Form>
      )
    },
    {
      key: '2',
      label: t('history'),
      children: (
        <div className="h-120 pl-6 pr-2 overflow-y-auto scrollbar-style mask-end">
          {feedbacks && feedbacks.length > 0 ? (
            <div className="flex flex-col gap-4 pb-12">
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
                    <DeleteOutlined
                      key="delete"
                      className="text-red-500"
                      onClick={async () => {
                        try {
                          await deleteFeedback(item.id)
                          appMessage.success(t('feedbackDeleted'))
                          const feedbacksRes = await listFeedbacks()
                          setFeedbacks(feedbacksRes.data)
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                    />
                  ]}
                >
                  <div className="w-full">{item.content}</div>
                  {item.reply && (
                    <>
                      <Divider />
                      <div className="w-full">{item.reply}</div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState className="w-full h-full text-lg" logoClassName="w-24" />
          )}
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
          animated
          items={tabItems}
          tabPlacement="start"
          classNames={{
            item: 'pl-0.5',
            header: 'pt-1',
            content: 'p-0'
          }}
        />
      </Modal>
    </>
  )
}
