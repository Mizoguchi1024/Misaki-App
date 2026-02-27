import { createDraggable, createScope, Scope } from 'animejs'
import { HeartOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useEffect, useRef } from 'react'

export default function AssistantScrollList(onChange): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope>(null)
  const avatarList = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const rootObj = root.current
      const avatarListObj = avatarList.current

      if (!rootObj || !avatarListObj) return
      const windowWidth = rootObj.offsetWidth
      const avatarListWidth = avatarListObj.scrollWidth

      console.log('windowWidth:', windowWidth)
      console.log('avatarListWidth:', avatarListWidth)

      createDraggable(avatarListObj, {
        y: false,
        container: [0, 0, 0, windowWidth - avatarListWidth - 40]
      })
    })

    return () => scope.current!.revert()
  }, [])

  const list = [
    {
      key: '1',
      icon: <HeartOutlined />
    },
    {
      key: '2',
      icon: <HeartOutlined />
    },
    {
      key: '3',
      icon: <HeartOutlined />
    },
    {
      key: '4',
      icon: <HeartOutlined />
    },
    {
      key: '5',
      icon: <HeartOutlined />
    },
    {
      key: '6',
      icon: <HeartOutlined />
    },
    {
      key: '7',
      icon: <HeartOutlined />
    },
    {
      key: '8',
      icon: <HeartOutlined />
    },
    {
      key: '9',
      icon: <HeartOutlined />
    },
    {
      key: '10',
      icon: <HeartOutlined />
    }
  ]

  return (
    <div
      ref={root}
      className="w-120 overflow-hidden mask-[linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]
    [-webkit-mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]"
    >
      <div ref={avatarList} className="flex pl-10 gap-6">
        {list.map((item) => (
          <Avatar
            key={item.key}
            icon={item.icon}
            className="flex-none"
            onClick={() => {
              onChange(item.key)
            }}
          />
        ))}
      </div>
    </div>
  )
}
