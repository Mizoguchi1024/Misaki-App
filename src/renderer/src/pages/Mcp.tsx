import { RightOutlined } from '@ant-design/icons'
import { listMcpServers } from '@renderer/api/front/mcp'
import { getSettings } from '@renderer/api/front/user'
import EmptyState from '@renderer/components/common/EmptyState'
import { useMcpStore } from '@renderer/store/mcpStore'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Divider, Space, Switch } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

export default function Mcp(): React.JSX.Element {
  const { enabledServers, setEnabledServers } = useMcpStore()
  const [extendedServerName, setExtendedServerName] = useState('')

  const { data: serversData } = useQuery({
    queryKey: ['mcpServers'],
    queryFn: listMcpServers
  })
  const servers = serversData?.data ?? []

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const backgroundPath = settingsData?.data.backgroundPath

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-style mask-end px-4">
      {servers.length > 0 ? (
        <div className="pt-12 pb-40 w-full px-12 md:max-w-2xl md:mx-auto md:px-0">
          {servers.map((item) => (
            <Card
              key={item.name}
              title={item.name}
              extra={
                <Space>
                  {item.tools.length > 1 && (
                    <Button
                      color="primary"
                      variant="link"
                      icon={
                        <RightOutlined
                          className={clsx(
                            extendedServerName === item.name && 'rotate-90',
                            'ease-in-out duration-250'
                          )}
                        />
                      }
                      onClick={() => {
                        if (extendedServerName === item.name) {
                          setExtendedServerName('')
                        } else {
                          setExtendedServerName(item.name)
                        }
                      }}
                    />
                  )}
                  <Switch
                    value={enabledServers?.includes(item.name)}
                    onChange={() => {
                      if (enabledServers?.includes(item.name)) {
                        setEnabledServers(
                          enabledServers.filter((enabledServer) => enabledServer != item.name)
                        )
                      } else {
                        setEnabledServers([...enabledServers, item.name])
                      }
                    }}
                  />
                </Space>
              }
              className={clsx(
                backgroundPath &&
                  'bg-white/20 dark:bg-neutral-800/20 border-white/60 dark:border-white/16 inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] backdrop-blur-xl hover:backdrop-blur-3xl',
                'mb-4 select-none hover:shadow-xl transition-all ease-in-out duration-250'
              )}
              classNames={{
                body: 'transition-all ease-in-out duration-250'
              }}
            >
              {extendedServerName === item.name ? (
                item.tools.map((tool, index) => (
                  <div key={tool.name}>
                    <Card.Meta title={tool.name} description={tool.description} />
                    {index !== item.tools.length - 1 && <Divider />}
                  </div>
                ))
              ) : (
                <Card.Meta title={item.tools[0].name} description={item.tools[0].description} />
              )}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState className="w-full h-full text-2xl" logoClassName="w-32" />
      )}
    </div>
  )
}
