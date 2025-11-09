import { List, Switch } from 'antd'

const data = [
  'Time',
  'Weather',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
]

export default function McpServer(): React.JSX.Element {
  return (
    <>
      <List
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item className="select-none">
            <List.Item.Meta
              title={item}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
            <Switch defaultChecked />
          </List.Item>
        )}
      />
    </>
  )
}
