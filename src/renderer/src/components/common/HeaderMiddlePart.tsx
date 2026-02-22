import { useChatStore } from '@renderer/store/chatStore'
import { Input } from 'antd'
import { useParams } from 'react-router-dom'
import Assistantlist from './Assistantlist'

export default function HeaderMiddlePart({ currentPage }): React.JSX.Element {
  const { chats } = useChatStore()
  const { id } = useParams()

  switch (currentPage) {
    case 'chat':
      return (
        <div className="absolute left-1/2 -translate-x-1/2 w-160">
          <Input
            variant="borderless"
            className="text-center font-medium"
            value={chats?.find((chat) => chat.id === id)?.title}
          ></Input>
        </div>
      )
    case 'misaki':
      return (
        <div className="absolute left-1/2 -translate-x-1/2 max-w-180">
          <Assistantlist />
        </div>
      )
    default:
      return <></>
  }
}
