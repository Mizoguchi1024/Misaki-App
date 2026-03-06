import { useChatStore } from '@renderer/store/chatStore'
import { Descriptions, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export default function ChatDetailModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('chatDetailModal')
  const { id: chatId } = useParams()
  const { chats } = useChatStore()
  const chat = chats?.find((chat) => chat.id === chatId)

  return (
    <Modal
      title={t('chatDetail')}
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      classNames={{ title: 'select-none' }}
    >
      <Descriptions
        className="py-2"
        classNames={{
          label: 'select-none'
        }}
        column={2}
        items={[
          {
            key: '1',
            label: t('id'),
            children: <span>{chat?.id}</span>,
            span: 'filled'
          },
          {
            key: '2',
            label: t('title'),
            children: <span>{chat?.title || t('none')}</span>
          },
          {
            key: '3',
            label: t('token'),
            children: <span>{chat?.token.toLocaleString()}</span>
          },
          {
            key: '4',
            label: t('createTime'),
            children: <span>{chat?.createTime}</span>
          },
          {
            key: '5',
            label: t('updateTime'),
            children: <span>{chat?.updateTime}</span>
          }
        ]}
      />
    </Modal>
  )
}
