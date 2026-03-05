import { Card, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function McpServer(): React.JSX.Element {
  const { t } = useTranslation('mcpServer')
  const [servers, setServers] = useState(null)

  // useEffect(() => {
  //   const load = async (): Promise<void> => {
  //     const serversRes = await window.api.listMcpServers()
  //     setServers(serversRes)
  //     console.log('serversRes', serversRes)
  //   }
  //   load()
  // }, [])

  return (
    <div className="h-full pt-16 pb-40 flex flex-col items-center gap-5 overflow-y-auto scrollbar-style">
      {servers && (
        <Card
          key={servers.name}
          title={servers.name}
          className="w-2/3 select-none cursor-pointer hover:shadow-xl inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] dark:hover:shadow-neutral-600 ease-in-out duration-500"
        >
          <Switch defaultChecked />
        </Card>
      )}
    </div>
  )
}
