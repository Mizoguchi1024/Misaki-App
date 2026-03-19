import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  StopOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { createFeedback, deleteFeedback, listFeedbacks } from '@renderer/api/front/feedback'
import { App, Button, Card, Divider, Form, Input, Modal, Select, Spin, Tabs, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import EmptyState from './EmptyState'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AddFeedbackFrontRequest } from '@renderer/types/feedback'

export default function FeedbackModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('feedbackModal')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: listFeedbacks
  })
  const feedbacks = data?.data ?? []

  const createFeedbackMutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      appMessage.success(t('feedbackCreated'))
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    }
  })

  const deleteFeedbackMutation = useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      appMessage.success(t('feedbackDeleted'))
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    }
  })

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
          onFinish={(values) => createFeedbackMutation.mutate(values)}
        >
          <div>
            <Form.Item<AddFeedbackFrontRequest>
              name="title"
              rules={[{ required: true, message: t('titleRequired') }]}
            >
              <Input placeholder={t('title')} showCount maxLength={50} spellCheck={false}></Input>
            </Form.Item>
            <Form.Item<AddFeedbackFrontRequest>
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
            <Form.Item<AddFeedbackFrontRequest>
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
          <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
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
                        onClick={async () => deleteFeedbackMutation.mutate(item.id)}
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
          </Spin>
        </div>
      )
    }
  ]

  return (
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
  )
}
