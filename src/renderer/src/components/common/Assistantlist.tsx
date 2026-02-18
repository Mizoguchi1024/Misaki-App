import { HeartOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'

export default function Assistantlist(): React.JSX.Element {
  const list = [
    {
      key: '1',
      icon: <HeartOutlined />,
      label: 'a'
    },
    {
      key: '2',
      icon: <HeartOutlined />,
      label: 'v'
    },
    {
      key: '3',
      icon: <HeartOutlined />,
      label: 'c'
    },
    {
      key: '4',
      icon: <HeartOutlined />,
      label: 'x'
    },
    {
      key: '5',
      icon: <HeartOutlined />,
      label: ''
    },
    {
      key: '6',
      icon: <HeartOutlined />,
      label: ''
    },
    {
      key: '7',
      icon: <HeartOutlined />,
      label: ''
    },
    {
      key: '8',
      icon: <HeartOutlined />,
      label: ''
    },
    {
      key: '9',
      icon: <HeartOutlined />,
      label: ''
    },
    {
      key: '10',
      icon: <HeartOutlined />,
      label: ''
    }
  ]

  return <Tabs items={list} size='large' centered ></Tabs>
}
