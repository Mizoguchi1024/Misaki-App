import {
  DeleteOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PushpinOutlined
} from '@ant-design/icons'
import { deleteChat, listChats } from '@renderer/api/front/chat'
import { Dropdown, Button, MenuProps, App } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ChatDetailModal from './ChatDetailModal'
import { useChatStore } from '@renderer/store/chatStore'

export default function ChatDropdown(): React.JSX.Element {
  const { t } = useTranslation('chatDropdown')
  const { message: appMessage } = App.useApp()
  const navigate = useNavigate()
  const { id: chatId } = useParams()
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const { chats, chatsUI, setChats, setChatPinned } = useChatStore()

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
        if (!chatId || !chats) break
        setChatPinned(chatId, !chatsUI[chatId]?.pinned)
        break
      case 'detail':
        setIsDetailModalOpen(true)
        break
      case 'delete':
        try {
          await deleteChat(chatId!)
          appMessage.success(t('deleteSuccess'))
          const chatsRes = await listChats()
          setChats(chatsRes.data)
          navigate('/', { viewTransition: true })
        } catch {
          return
        }

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
