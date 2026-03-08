import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartOutlined,
  LockOutlined,
  PlusOutlined,
  ShopOutlined,
  UnlockOutlined
} from '@ant-design/icons'
import {
  copyAssistant,
  createAssistant,
  deleteAssistant,
  likeAssistant,
  listAssistants,
  listPublicAssistants,
  updateAssistant
} from '@renderer/api/front/assistant'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import EmptyState from '@renderer/components/common/EmptyState'
import GlassBox from '@renderer/components/common/GlassBox'
import Live2DCanvas from '@renderer/components/common/Live2DCanvas'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useModelStore } from '@renderer/store/modelStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { Page } from '@renderer/types/result'
import { animate, createScope, Scope } from 'animejs'
import {
  App,
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Pagination,
  Radio,
  Select,
  Switch,
  Tooltip
} from 'antd'
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
  const { message: appMessage } = App.useApp()
  const {
    enabledAssistantId,
    version: settingsVersion,
    getOssBaseUrl,
    setSettings
  } = useSettingsStore()
  const {
    assistant,
    assistants,
    publicAssistants,
    setAssistant,
    setAssistants,
    setPublicAssistants
  } = useAssistantStore()
  const { models } = useModelStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [form] = Form.useForm<FieldType>()
  const [publicAssistantsPage, setPublicAssistantsPage] = useState<Page>({
    total: 0,
    pageIndex: 1,
    pageSize: 4
  })

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
      form.resetFields()
      setIsEditing(true)
    } else {
      setIsEditing(false)
      setIsShopOpen(false)
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

  useEffect(() => {
    // 加载公开助手分页数据
    const load = async (): Promise<void> => {
      const publicAssistantsRes = await listPublicAssistants(
        publicAssistantsPage.pageIndex,
        publicAssistantsPage.pageSize
      )
      setPublicAssistants(publicAssistantsRes.data.list)
      setPublicAssistantsPage({
        ...publicAssistantsPage,
        total: +publicAssistantsRes.data.total
      })
    }
    if (isShopOpen) {
      load()
    }
  }, [isShopOpen, publicAssistantsPage.pageIndex, publicAssistantsPage.pageSize])

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
        appMessage.success(t('saveSuccess'))
        const assistantsRes = await listAssistants()
        setAssistants(assistantsRes.data)
        setAssistant(assistantsRes.data.find((item) => item.id === assistant.id) || null)
      } else {
        const createAssistantRes = await createAssistant({
          name: values.name,
          gender: values.gender,
          birthday: values.birthday.format('YYYY-MM-DD'),
          personality: values.personality,
          detail: values.detail,
          modelId: values.modelId,
          publicFlag: values.publicFlag
        })
        appMessage.success(t('createSuccess'))
        const assistantsRes = await listAssistants()
        setAssistants(assistantsRes.data)
        setAssistant(createAssistantRes.data)
      }
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="flex flex-col items-center h-full w-full relative px-12 md:px-0" ref={root}>
      <Live2DCanvas modelUrl={'/hiyori_free_en/runtime/hiyori_free_t08.model3.json'} />
      <GlassBox
        className={clsx(
          isEditing ? 'h-5/6' : 'h-7/24',
          'w-lg md:w-xl lg:w-3xl absolute bottom-1/12 ease-in-out duration-500'
        )}
      >
        {isEditing ? (
          <div className="loading-blur w-full h-full">
            {isShopOpen ? (
              <div className="w-full h-full flex flex-col items-center justify-between select-none">
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl font-semibold">{t('assistantHub')}</span>
                  <div className="flex gap-4">
                    <Tooltip
                      title={t('back')}
                      arrow={false}
                      classNames={{
                        container: 'select-none'
                      }}
                    >
                      <Button
                        color="default"
                        variant="filled"
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => setIsShopOpen(!isShopOpen)}
                      />
                    </Tooltip>
                  </div>
                </div>
                {!publicAssistants || publicAssistants.length === 0 ? (
                  <EmptyState className=" text-2xl" logoClassName="w-32 mb-4" />
                ) : (
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {publicAssistants?.map((item) => (
                      <Card
                        key={item.id}
                        variant="borderless"
                        title={item.name}
                        extra={
                          <div className="flex items-center gap-2">
                            <Tooltip
                              title={item.likedFlag ? t('cancel') : t('like')}
                              arrow={false}
                              classNames={{ container: 'select-none' }}
                            >
                              <Button
                                icon={<HeartOutlined />}
                                color={item.likedFlag ? 'primary' : 'default'}
                                variant="filled"
                                onClick={async () => {
                                  try {
                                    await likeAssistant(item.id)
                                    const publicAssistantsRes = await listPublicAssistants(
                                      publicAssistantsPage.pageIndex,
                                      publicAssistantsPage.pageSize
                                    )
                                    setPublicAssistants(publicAssistantsRes.data.list)
                                    setPublicAssistantsPage({
                                      ...publicAssistantsPage,
                                      total: +publicAssistantsRes.data.total
                                    })
                                  } catch {
                                    return
                                  }
                                }}
                              >
                                {item.likes}
                              </Button>
                            </Tooltip>
                            <Tooltip
                              title={t('copy')}
                              arrow={false}
                              classNames={{ container: 'select-none' }}
                            >
                              <Button
                                icon={<PlusOutlined />}
                                color="default"
                                variant="filled"
                                shape="circle"
                                onClick={async () => {
                                  try {
                                    await copyAssistant(item.id)
                                    appMessage.success(t('assistantCopied'))
                                    const assistantsRes = await listAssistants()
                                    setAssistants(assistantsRes.data)
                                  } catch {
                                    return
                                  }
                                }}
                              />
                            </Tooltip>
                          </div>
                        }
                        className="hover:shadow-xl ease-in-out duration-500"
                      >
                        <Card.Meta
                          avatar={
                            <Avatar
                              src={
                                models?.find((model) => model.id === item.modelId)?.avatarPath
                                  ? getOssBaseUrl() +
                                    models?.find((model) => model.id === item.modelId)?.avatarPath
                                  : null
                              }
                              icon={
                                models?.find((model) => model.id === item.modelId)
                                  ?.avatarPath ? null : (
                                  <HeartOutlined />
                                )
                              }
                              draggable={false}
                            />
                          }
                          title={item.personality}
                          description={item.detail || t('noDetail')}
                          classNames={{
                            avatar: 'flex items-center justify-center'
                          }}
                        />
                      </Card>
                    ))}
                  </div>
                )}
                <Pagination
                  total={publicAssistantsPage.total}
                  current={publicAssistantsPage.pageIndex}
                  pageSize={publicAssistantsPage.pageSize}
                  onChange={(page, pageSize) => {
                    setPublicAssistantsPage({
                      ...publicAssistantsPage,
                      pageIndex: page,
                      pageSize
                    })
                  }}
                />
              </div>
            ) : (
              <Form
                form={form}
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
                <div className="flex items-center justify-between w-full mb-6">
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: t('nameRequired') }]}
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
                    {assistant ? (
                      <Tooltip
                        title={t('delete')}
                        arrow={false}
                        classNames={{
                          container: 'select-none'
                        }}
                      >
                        <Button
                          color="default"
                          variant="filled"
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={async () => {
                            try {
                              if (assistant.id === enabledAssistantId) {
                                appMessage.warning(t('canNotDeleteEnabledAssistant'))
                                return
                              }
                              await deleteAssistant(assistant.id)
                              appMessage.success(t('deleteSuccess'))
                              const assistantsRes = await listAssistants()
                              setAssistants(assistantsRes.data)
                              setAssistant(
                                assistantsRes.data.find((item) => item.id === enabledAssistantId) ||
                                  null
                              )
                              setIsEditing(false)
                            } catch {
                              return
                            }
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={t('assistantHub')}
                        arrow={false}
                        classNames={{
                          container: 'select-none'
                        }}
                      >
                        <Button
                          color="default"
                          variant="filled"
                          shape="circle"
                          icon={<ShopOutlined />}
                          onClick={() => setIsShopOpen(!isShopOpen)}
                        />
                      </Tooltip>
                    )}
                    <Tooltip
                      title={t('cancel')}
                      arrow={false}
                      classNames={{
                        container: 'select-none'
                      }}
                    >
                      <Button
                        color="default"
                        variant="filled"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => {
                          if (!assistant) {
                            setAssistant(
                              assistants?.find((item) => item.id === enabledAssistantId) || null
                            )
                          }
                          setIsEditing(!isEditing)
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      title={assistant ? t('save') : t('create')}
                      arrow={false}
                      classNames={{
                        container: 'select-none'
                      }}
                    >
                      <Button
                        htmlType="submit"
                        color="primary"
                        variant="filled"
                        shape="circle"
                        icon={<CheckOutlined />}
                      />
                    </Tooltip>
                  </div>
                </div>
                <Form.Item<FieldType>
                  name="gender"
                  label={t('gender')}
                  initialValue={assistant?.gender || 0}
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio.Button value={0} className="bg-black/4 dark:bg-white/8 border-none">
                      {t('unknown')}
                    </Radio.Button>
                    <Radio.Button value={1} className="bg-black/4 dark:bg-white/8 border-none">
                      {t('male')}
                    </Radio.Button>
                    <Radio.Button value={2} className="bg-black/4 dark:bg-white/8 border-none">
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
                  name="modelId"
                  label={t('model')}
                  initialValue={assistant?.modelId || models?.[0].id}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={t('model')}
                    options={models?.map((model) => ({ label: model.name, value: model.id }))}
                    className="w-32"
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  name="publicFlag"
                  label={t('publicFlag')}
                  initialValue={assistant?.publicFlag || false}
                  rules={[{ required: true }]}
                >
                  <Switch
                    checkedChildren={<UnlockOutlined />}
                    unCheckedChildren={<LockOutlined />}
                  />
                </Form.Item>
                <Form.Item<FieldType>
                  name="personality"
                  label={t('personality')}
                  initialValue={assistant?.personality}
                >
                  <Input placeholder={t('personality')} maxLength={20} showCount />
                </Form.Item>
                <Form.Item<FieldType>
                  name="detail"
                  label={t('detail')}
                  initialValue={assistant?.detail}
                >
                  <Input.TextArea
                    placeholder={t('detail')}
                    showCount
                    maxLength={50}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  ></Input.TextArea>
                </Form.Item>
              </Form>
            )}
          </div>
        ) : (
          <div className="loading-blur w-full h-full flex flex-col items-center justify-between">
            <div className="flex justify-between w-full mb-4">
              <Tooltip
                title={
                  assistant?.name !== 'Misaki' &&
                  t('sameName', { count: assistant?.duplicateName })
                }
                arrow={false}
                classNames={{
                  container: 'select-none'
                }}
              >
                <span className="text-2xl font-semibold">{assistant?.name}</span>
              </Tooltip>
              <div className="flex gap-4">
                <Tooltip
                  title={t('edit')}
                  arrow={false}
                  classNames={{
                    container: 'select-none'
                  }}
                >
                  <Button
                    color="default"
                    variant="filled"
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => {
                      form.resetFields()
                      setIsEditing(!isEditing)
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title={t(assistant?.id === enabledAssistantId ? 'enabled' : 'enable')}
                  arrow={false}
                  classNames={{
                    container: 'select-none'
                  }}
                >
                  <Button
                    color={assistant?.id === enabledAssistantId ? 'green' : 'default'}
                    variant="filled"
                    shape="circle"
                    icon={<CheckOutlined />}
                    onClick={async () => {
                      if (assistant?.id !== enabledAssistantId) {
                        try {
                          await updateSettings({
                            enabledAssistantId: assistant?.id,
                            version: settingsVersion
                          })
                          appMessage.success(t('assistantEnabled'))
                          const settingsRes = await getSettings()
                          setSettings(settingsRes.data)
                        } catch {
                          return
                        }
                      }
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            <Descriptions
              className="dark:drop-shadow-[0_0_4px_rgb(0,0,0,0.6)]"
              classNames={{
                label: 'text-nowrap select-none'
              }}
              column={4}
              items={[
                {
                  key: '1',
                  label: t('gender'),
                  span: { sm: 2, md: 1 },
                  children: <span className="truncate">{genderMap[assistant?.gender || 0]}</span>
                },
                {
                  key: '2',
                  label: t('birthday'),
                  span: { sm: 2, md: 1 },
                  children: <span className="truncate">{assistant?.birthday}</span>
                },
                {
                  key: '3',
                  label: t('publicFlag'),
                  span: { sm: 2, md: 1 },
                  children: (
                    <span className="truncate">
                      {assistant?.publicFlag ? t('public') : t('private')}
                    </span>
                  )
                },
                {
                  key: '4',
                  label: t('createDate'),
                  span: { sm: 2, md: 1 },
                  children: (
                    <span className="truncate">
                      {dayjs(assistant?.createTime).format('YYYY-MM-DD')}
                    </span>
                  )
                },
                {
                  key: '5',
                  span: 2,
                  label: t('personality'),
                  children: <span>{assistant?.personality || t('none')}</span>
                },
                {
                  key: '6',
                  span: 'filled',
                  label: t('detail'),
                  children: <span>{assistant?.detail || t('none')}</span>
                }
              ]}
            />
          </div>
        )}
      </GlassBox>
    </div>
  )
}
