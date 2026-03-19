import {
  DeleteOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PushpinOutlined
} from '@ant-design/icons'
import { deleteChat } from '@renderer/api/front/chat'
import { Dropdown, Button, MenuProps, App } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ChatDetailModal from './ChatDetailModal'
import { useChatStore } from '@renderer/store/chatStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function ChatDropdown(): React.JSX.Element {
  const { t } = useTranslation('chatDropdown')
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: chatId } = useParams()
  const { chatsUI, setChatPinned } = useChatStore()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      appMessage.success(t('chatDeleted'))
      queryClient.invalidateQueries({ queryKey: ['chats'] })
      navigate('/', { viewTransition: true })
    }
  })

  const list: MenuProps['items'] = [
    {
      key: 'pin',
      label: chatsUI[chatId!]?.pinned ? t('unpin') : t('pin'),
      icon: <PushpinOutlined />
    },
    {
      key: 'detail',
      label: t('detail'),
      icon: <InfoCircleOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'delete',
      label: t('delete'),
      icon: <DeleteOutlined />,
      danger: true
    }
  ]

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'pin':
        setChatPinned(chatId!, !chatsUI[chatId!]?.pinned)
        break
      case 'detail':
        setIsDetailModalOpen(true)
        break
      case 'delete':
        deleteChatMutation.mutate(chatId!)
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items: list, onClick }}
        placement="bottomRight"
        trigger={['click']}
        classNames={{
          itemContent: 'select-none'
        }}
      >
        <Button
          color="default"
          variant="filled"
          shape="circle"
          icon={<EllipsisOutlined />}
        ></Button>
      </Dropdown>
      <ChatDetailModal open={isDetailModalOpen} onCancel={() => setIsDetailModalOpen(false)} />
    </>
  )
}
