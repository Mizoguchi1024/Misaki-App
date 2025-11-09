import { Input, List } from 'antd'

const data = [
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
]

export default function Search(): React.JSX.Element {
  const onSearch = (value: string): void => {
    console.log(value)
  }

  return (
    <>
      <div className="relative h-full">
        <List
          size="large"
          dataSource={data}
          renderItem={(item) => (
            <List.Item className="select-none">
              <List.Item.Meta
                title={item}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
        <Input.Search
          size="large"
          variant="filled"
          placeholder="搜索历史会话"
          allowClear
          onSearch={onSearch}
          className="absolute bottom-20"
          style={{
            width: '75%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      </div>
    </>
  )
}
