import { listAssistants } from '@renderer/api/front/assistant'
import GlassBox from '@renderer/components/common/GlassBox'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { animate, createScope, Scope } from 'animejs'
import { Button, Descriptions } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Misaki(): React.JSX.Element {
  const { t } = useTranslation('misaki')
  const { assistant, setAssistants } = useAssistantStore()
  const [isEditing, setIsEditing] = useState(false)

  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope>(null)

  useEffect(() => {
    const load = async (): Promise<void> => {
      const assistantsRes = await listAssistants()
      setAssistants(assistantsRes.data)
    }
    load()
    scope.current = createScope({ root })
    return () => scope.current!.revert()
  }, [])

  useEffect(() => {
    if (scope.current) {
      scope.current.add(() => {
        animate('.loading-blur', {
          filter: ['blur(0px)', 'blur(8px)', 'blur(0px)'],
          duration: 600,
          easing: 'easeInOutQuad'
        })
      })
    }
  }, [assistant?.id])

  return (
    <div className="flex flex-col items-center h-full w-full relative" ref={root}>
      <GlassBox
        className={clsx(
          isEditing ? 'h-5/6' : 'h-40',
          'w-3/4 absolute bottom-1/12 ease-in-out duration-500'
        )}
      >
        <div className="loading-blur">
          <div className="flex justify-between w-full mb-4">
            <span className="text-2xl font-semibold">{assistant?.name}</span>
            <Button type="primary" onClick={() => setIsEditing(!isEditing)}>
              {t('edit')}
            </Button>
          </div>
          <Descriptions
            items={[
              {
                key: '1',
                label: t('gender'),
                children: assistant?.gender
              },
              {
                key: '2',
                label: t('birthday'),
                children: assistant?.birthday
              },
              {
                key: '3',
                label: t('personality'),
                children: assistant?.personality
              },
              {
                key: '4',
                label: t('detail'),
                children: assistant?.detail || t('null')
              },
              {
                key: '5',
                label: t('publicFlag'),
                children: assistant?.publicFlag ? t('public') : t('private')
              },
              {
                key: '6',
                label: t('createTime'),
                children: assistant?.createTime
              }
            ]}
          />
        </div>
      </GlassBox>
    </div>
  )
}
