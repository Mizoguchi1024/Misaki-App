import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons'
import { createAssistant, listAssistants, updateAssistant } from '@renderer/api/front/assistant'
import GlassBox from '@renderer/components/common/GlassBox'
import Live2DCanvas from '@renderer/components/common/Live2DCanvas'
import { messageApi } from '@renderer/messageApi'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useModelStore } from '@renderer/store/modelStore'
import { animate, createScope, Scope } from 'animejs'
import { Button, DatePicker, Descriptions, Form, Input, Radio, Select, Switch } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type FieldType = {
  name: string
  gender: number
  birthday: dayjs.Dayjs
  personality: string
  detail: string
  modelId: string
  publicFlag: boolean
}

export default function Misaki(): React.JSX.Element {
  const { t } = useTranslation('misaki')
  const { assistant, setAssistants } = useAssistantStore()
  const { models } = useModelStore()
  const [isEditing, setIsEditing] = useState(false)

  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope>(null)

  const genderMap = {
    0: t('unknown'),
    1: t('male'),
    2: t('female')
  }

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
    if (!assistant) {
      setIsEditing(true)
    }
  }, [assistant])

  useEffect(() => {
    if (scope.current) {
      scope.current.add(() => {
        animate('.loading-blur', {
          opacity: [1, 0.6, 1],
          filter: ['blur(0px)', 'blur(6px)', 'blur(0px)'],
          duration: 800,
          easing: 'easeInOutQuad'
        })
      })
    }
  }, [isEditing])

  const onFinish = async (values: FieldType): Promise<void> => {
    try {
      if (assistant) {
        await updateAssistant(assistant.id, {
          name: values.name,
          gender: values.gender,
          birthday: values.birthday.format('YYYY-MM-DD'),
          personality: values.personality,
          detail: values.detail,
          modelId: values.modelId,
          publicFlag: values.publicFlag,
          version: assistant.version
        })
        const assistantsRes = await listAssistants()
        setAssistants(assistantsRes.data)
        messageApi?.success(t('saveSuccess'))
      } else {
        await createAssistant({
          name: values.name,
          gender: values.gender,
          birthday: values.birthday.format('YYYY-MM-DD'),
          personality: values.personality,
          detail: values.detail,
          modelId: values.modelId,
          publicFlag: values.publicFlag
        })
        const assistantsRes = await listAssistants()
        setAssistants(assistantsRes.data)
        messageApi?.success(t('createSuccess'))
      }
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="flex flex-col items-center h-full w-full relative" ref={root}>
      <Live2DCanvas modelUrl={'/hiyori_free_en/runtime/hiyori_free_t08.model3.json'} />
      <GlassBox
        className={clsx(
          isEditing ? 'h-5/6' : 'h-1/4',
          'w-3/4 absolute bottom-1/12 ease-in-out duration-500'
        )}
      >
        {isEditing ? (
          <div className="loading-blur w-full h-full">
            <Form
              id="updateAssistantForm"
              name="basic"
              autoComplete="off"
              validateTrigger="onSubmit"
              colon={false}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              labelAlign="left"
              requiredMark={false}
              onFinish={onFinish}
              validateMessages={{ required: t('requiredTemplate') }}
              variant="filled"
              className="w-full h-full flex flex-col justify-between select-none"
            >
              <div className="flex items-center justify-between w-full">
                <Form.Item
                  name="name"
                  rules={[{ required: true }]}
                  initialValue={assistant?.name}
                  wrapperCol={{ span: 24 }}
                  className="m-0"
                >
                  <Input
                    placeholder={t('name')}
                    maxLength={20}
                    className="field-sizing-content text-2xl font-semibold"
                  />
                </Form.Item>
                <div className="flex gap-4">
                  <Button
                    color="default"
                    variant="filled"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                  />
                  <Button
                    form="updateAssistantForm"
                    htmlType="submit"
                    color="primary"
                    variant="filled"
                    shape="circle"
                    icon={<CheckOutlined />}
                  />
                </div>
              </div>
              <Form.Item<FieldType>
                name="gender"
                label={t('gender')}
                initialValue={assistant?.gender}
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio.Button value={0} className="bg-black/4 dark:bg-white/8">
                    {t('unknown')}
                  </Radio.Button>
                  <Radio.Button value={1} className="bg-black/4 dark:bg-white/8">
                    {t('male')}
                  </Radio.Button>
                  <Radio.Button value={2} className="bg-black/4 dark:bg-white/8">
                    {t('female')}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item<FieldType>
                name="birthday"
                label={t('birthday')}
                initialValue={dayjs(assistant?.birthday)}
              >
                <DatePicker
                  placeholder={t('birthday')}
                  form="YYYY-MM-DD"
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
              <Form.Item<FieldType>
                name="personality"
                label={t('personality')}
                initialValue={assistant?.personality}
              >
                <Input placeholder={t('occupation')} maxLength={20} showCount />
              </Form.Item>
              <Form.Item<FieldType>
                name="detail"
                label={t('detail')}
                initialValue={assistant?.detail}
              >
                <Input.TextArea
                  placeholder={t('detail')}
                  showCount
                  maxLength={100}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                ></Input.TextArea>
              </Form.Item>
              <Form.Item<FieldType>
                name="modelId"
                label={t('model')}
                initialValue={assistant?.modelId}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t('model')}
                  options={models?.map((model) => ({ label: model.name, value: model.id }))}
                />
              </Form.Item>
              <Form.Item<FieldType>
                name="publicFlag"
                label={t('publicFlag')}
                initialValue={assistant?.publicFlag}
                rules={[{ required: true }]}
              >
                <Switch checkedChildren={<UnlockOutlined />} unCheckedChildren={<LockOutlined />} />
              </Form.Item>
              <Form.Item name="createTime" label={t('createTime')} className="m-0">
                <span>{assistant?.createTime}</span>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className="loading-blur w-full h-full flex flex-col items-center justify-between">
            <div className="flex justify-between w-full">
              <span className="text-2xl font-semibold">{assistant?.name}</span>
              <Button
                color="default"
                variant="filled"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
            <Descriptions
              items={[
                {
                  key: '1',
                  label: t('gender'),
                  children: genderMap[assistant?.gender || 0]
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
                  children: assistant?.detail || t('none')
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
        )}
      </GlassBox>
    </div>
  )
}
