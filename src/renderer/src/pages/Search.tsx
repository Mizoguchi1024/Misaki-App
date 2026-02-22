import { CloseCircleOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { messageApi } from '@renderer/messageApi'
import { Card } from 'antd'
import { useState } from 'react'

const results = [
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
]

export default function Search(): React.JSX.Element {
  const [loading, setLoading] = useState(false)

  const onSearch = (value: string): void => {
    setLoading(true)
    console.log(value)
  }

  return (
    <div className="relative h-full">
      <div className="max-h-full px-32 pt-8 pb-40 flex flex-col gap-4 overflow-y-auto">
        {results.map((item) => (
          <Card
            loading={loading}
            onClick={() => {}}
            className="flex-none select-none cursor-pointer shadow-sm hover:shadow-lg dark:hover:shadow-neutral-700 dark:hover:shadow-lg ease-in-out duration-500"
          >
            <Card.Meta
              avatar={<MessageOutlined className="h-full" style={{ fontSize: '24px' }} />}
              title={item}
              description={item}
            />
          </Card>
        ))}
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-160">
        <Sender
          className="bg-white/70 dark:bg-white/10 backdrop-blur-xs hover:backdrop-blur-sm ease-in-out duration-500"
          placeholder="搜索历史会话"
          loading={loading}
          onSubmit={() => {
            onSearch('')
          }}
          onCancel={() => {
            setLoading(false)
          }}
          suffix={(_, info) => {
            const { SendButton, ClearButton } = info.components
            return (
              <div className="flex gap-2">
                <ClearButton icon={<CloseCircleOutlined />} />
                <SendButton type="primary" icon={<SearchOutlined />} disabled={false} />
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
