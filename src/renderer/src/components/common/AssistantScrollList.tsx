import { CheckCircleFilled, HeartOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Badge, theme, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { getSettings } from '@renderer/api/front/user'
import { listModels } from '@renderer/api/front/model'
import { listAssistants } from '@renderer/api/front/assistant'

const { useToken } = theme

export default function AssistantScrollList(): React.JSX.Element {
  const { t } = useTranslation('assistantScrollList')
  const { getOssBaseUrl } = useSettingsStore()
  const { currentAssistantId, setCurrentAssistantId } = useAssistantStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const { mainColor, enabledAssistantId } = settingsData?.data ?? {}
  const [initialEnabledAssistantId] = useState(enabledAssistantId)

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: listModels
  })
  const models = modelsData?.data ?? []

  const { data: assistantsData } = useQuery({
    queryKey: ['assistants'],
    queryFn: listAssistants
  })
  const assistants = assistantsData?.data ?? []

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
    setCurrentAssistantId(enabledAssistantId || '')
    console.log("enabledAssistantId", enabledAssistantId)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const container = containerRef.current
    const track = trackRef.current

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.target.clientWidth)
        } else if (entry.target === track) {
          setTrackWidth(entry.target.clientWidth)
        }
      }
    })

    observer.observe(container)
    observer.observe(track)

    setContainerWidth(container.clientWidth)
    setTrackWidth(track.clientWidth)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="max-w-60 md:max-w-100 lg:max-w-160 h-full overflow-hidden mask-x-from-90% ease-in-out duration-250" // TODO Mask固定宽度
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: containerWidth - trackWidth,
          right: 0
        }}
        dragTransition={{
          power: 0.1,
          timeConstant: 100
        }}
        ref={trackRef}
        className="flex items-center h-full w-max px-8 gap-6"
      >
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
                  getOssBaseUrl() + models?.find((model) => model.id === item.modelId)?.avatarPath
                }
                icon={<HeartOutlined />}
                className={clsx(
                  'flex-none cursor-pointer select-none border-0 duration-250 active:scale-90',
                  item.id === currentAssistantId && 'outline-5'
                )}
                style={{ outlineColor: mainColor }}
                onClick={() => setCurrentAssistantId(item.id)}
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
            draggable={false}
            icon={<PlusOutlined />}
            className={clsx(
              'flex-none cursor-pointer border-0 duration-250 active:scale-90',
              !currentAssistantId && 'outline-5'
            )}
            style={{ outlineColor: mainColor }}
            onClick={() => setCurrentAssistantId('')}
          />
        </Tooltip>
      </motion.div>
    </div>
  )
}
