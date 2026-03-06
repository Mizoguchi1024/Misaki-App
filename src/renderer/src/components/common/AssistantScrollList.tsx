import { createDraggable, createScope, Scope } from 'animejs'
import { CheckCircleFilled, HeartOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Badge, theme, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useModelStore } from '@renderer/store/modelStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import clsx from 'clsx'

const { useToken } = theme

export default function AssistantScrollList(): React.JSX.Element {
  const { t } = useTranslation('assistantScrollList')
  const { mainColor, enabledAssistantId, getOssBaseUrl } = useSettingsStore()
  const { assistants, assistant, setAssistant } = useAssistantStore()
  const { models } = useModelStore()
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope>(null)
  const avatarList = useRef<HTMLDivElement>(null)
  const [initialEnabledAssistantId] = useState(enabledAssistantId)
  const orderedAssistants = assistants
    ? [
        ...assistants.filter((item) => item.id === initialEnabledAssistantId),
        ...assistants.filter((item) => item.id !== initialEnabledAssistantId)
      ]
    : null
  const {
    token: { colorSuccess }
  } = useToken()

  useEffect(() => {
    setAssistant(assistants?.find((item) => item.id === enabledAssistantId) || null)
  }, [])

  useEffect(() => {
    if (assistant && !assistants?.some((item) => item.id === assistant.id)) {
      setAssistant(assistants?.find((item) => item.id === enabledAssistantId) || null)
    }
  }, [assistants])

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      // TODO 需要改挂载一次性？
      const rootObj = root.current
      const avatarListObj = avatarList.current

      if (!rootObj || !avatarListObj) return
      const windowWidth = rootObj.offsetWidth
      const avatarListWidth = avatarListObj.scrollWidth

      createDraggable(avatarListObj, {
        y: false,
        container: [
          0,
          0,
          0,
          windowWidth === avatarListWidth ? 0 : windowWidth - avatarListWidth - 40
        ]
      })
    })

    return () => scope.current!.revert()
  }, [assistants])

  return (
    <div ref={root} className="w-120 h-full overflow-hidden mask-x-from-90%">
      <div ref={avatarList} className="flex items-center h-full pl-10 gap-6">
        {orderedAssistants?.map((item) => (
          <Tooltip
            key={item.id}
            title={item.name}
            arrow={false}
            classNames={{
              container: 'select-none'
            }}
          >
            <Badge
              count={
                item.id === enabledAssistantId ? (
                  <CheckCircleFilled style={{ color: colorSuccess }} />
                ) : (
                  0
                )
              }
            >
              <Avatar
                draggable={false}
                src={
                  models?.find((model) => model.id === item.modelId)?.avatarPath
                    ? getOssBaseUrl() +
                      models?.find((model) => model.id === item.modelId)?.avatarPath
                    : null
                }
                icon={
                  models?.find((model) => model.id === item.modelId)?.avatarPath ? null : (
                    <HeartOutlined />
                  )
                }
                className={clsx(
                  'flex-none cursor-pointer select-none border-0 duration-250',
                  assistant && item.id === assistant.id && 'outline-5'
                )}
                style={{ outlineColor: mainColor }}
                onClick={() => {
                  setAssistant(assistants?.find((assistant) => assistant.id === item.id) || null)
                }}
              />
            </Badge>
          </Tooltip>
        ))}
        <Tooltip
          title={t('create')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
          <Avatar
            icon={<PlusOutlined />}
            className={clsx(
              'flex-none cursor-pointer border-0 duration-250',
              !assistant && 'outline-5'
            )}
            style={{ outlineColor: mainColor }}
            onClick={() => {
              setAssistant(null)
            }}
          />
        </Tooltip>
      </div>
    </div>
  )
}
