import {
  AntDesignOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  RedoOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Actions, Bubble, BubbleItemType, BubbleListProps, Sender } from '@ant-design/x'
import { useChatStore } from '@renderer/store/chatStore'
import { Avatar } from 'antd'
import { useEffect } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry'
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy'
  }
]

export default function Chat(): React.JSX.Element {
  const { id } = useParams()
  const data = useLoaderData()
  const { messages, setMessages, setParentId } = useChatStore()

  useEffect(() => {
    setParentId('')
    setMessages(data)
  }, [data])

  const items = messages?.map((item) => ({
    key: item.id,
    role: item.type,
    content: item.content
  })) ?? []

  const update = (key: string | number, editable: any) => {}

  const role: BubbleListProps['role'] = {
    ASSISTANT: {
      typing: false,
      header: 'ASSISTANT',
      variant: 'borderless',
      avatar: () => <Avatar icon={<AntDesignOutlined />} />,
      footer: (content) => (
        <Actions items={actionItems} onClick={() => console.log(content)} />
      )
    },
    ASSISTANT_NEW: {
      typing: true,
      header: 'ASSISTANT',
      variant: 'borderless',
      avatar: () => <Avatar icon={<AntDesignOutlined />} />,
      footer: (content) => (
        <Actions items={actionItems} onClick={() => console.log(content)} fadeInLeft />
      )
    },
    USER: (data) => ({
      placement: 'end',
      typing: false,
      header: `USER`,
      shape: 'round',
      avatar: () => <Avatar icon={<UserOutlined />} />,
      footer: () => (
        <Actions
          items={[
            data.editable
              ? { key: 'done', icon: <CheckOutlined />, label: 'done' }
              : {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'edit'
                }
          ]}
          onClick={({ key }) => update(data.key, { editable: key === 'edit' })}
        />
      ),
      onEditConfirm: (content) => {
        console.log(`editing User-${data.key}: `, content)
        update(data.key, { content, editable: false })
      },
      onEditCancel: () => {
        update(data.key, { editable: false })
      }
    })
  }

  return (
    <div className="relative h-full">
      <div className="max-h-full px-12 pb-40 overflow-y-auto">
        <Bubble.List role={role} items={items} autoScroll={false} />
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-160">
        <Sender className="bg-white/70 dark:bg-white/20 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500" />
      </div>
    </div>
  )
}
