import {
  DeleteOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PushpinOutlined
} from '@ant-design/icons'
import { deleteChat, updateChat } from '@renderer/api/front/chat'
import { flattenChats, useChatsInfiniteQuery } from '@renderer/hooks/useChatsInfiniteQuery'
import { Dropdown, Button, MenuProps, App } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ChatDetailModal from './ChatDetailModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateChatFrontRequest } from '@renderer/types/chat'
import { Result } from '@renderer/types/result'

export default function ChatDropdown(): React.JSX.Element {
  const { t } = useTranslation('chatDropdown')
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: chatId } = useParams()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: chatsData } = useChatsInfiniteQuery()
  const chat = flattenChats(chatsData?.pages).find((item) => item.id === chatId)

  const updateChatTitleMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateChatFrontRequest }
  >({
    mutationFn: ({ id, data }) => updateChat(id, data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['chats'] })
    }
  })

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      appMessage.success(t('chatDeleted'))
      queryClient.resetQueries({ queryKey: ['chats'] })
      navigate('/', { viewTransition: true })
    }
  })

  const list: MenuProps['items'] = [
    {
      key: 'pin',
      label: chat?.pinnedFlag ? t('unpin') : t('pin'),
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
        updateChatTitleMutation.mutate({
          id: chatId!,
          data: { pinnedFlag: !chat?.pinnedFlag, version: chat?.version ?? 0 }
        })
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
