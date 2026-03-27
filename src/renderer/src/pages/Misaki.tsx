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
import { listModels } from '@renderer/api/front/model'
import { getSettings, updateSettings } from '@renderer/api/front/user'
import EmptyState from '@renderer/components/common/EmptyState'
import GlassBox from '@renderer/components/common/GlassBox'
import Live2DCanvas from '@renderer/components/common/Live2DCanvas'
import { useAssistantStore } from '@renderer/store/assistantStore'
import { useSettingsStore } from '@renderer/store/settingsStore'
import { UpdateAssistantFrontRequest } from '@renderer/types/assistant'
import { Result } from '@renderer/types/result'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type FieldType = {
  name: string
  gender: number
  birthday?: dayjs.Dayjs
  modelId: string
  publicFlag: boolean
  personality?: string
  details?: string
}

export default function Misaki(): React.JSX.Element {
  const { t } = useTranslation('misaki')
  const { message: appMessage } = App.useApp()
  const queryClient = useQueryClient()
  const { getOssBaseUrl } = useSettingsStore()
  const { currentAssistantId, setCurrentAssistantId } = useAssistantStore()
  const [isEditingManually, setIsEditingManually] = useState(false)
  const isEditing = !currentAssistantId || isEditingManually
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [form] = Form.useForm<FieldType>()
  const [publicAssistantsPage, setPublicAssistantsPage] = useState({
    pageIndex: 1,
    pageSize: 4
  })

  const { data: assistantsData } = useQuery({
    queryKey: ['assistants'],
    queryFn: listAssistants
  })
  const assistants = assistantsData?.data ?? []
  const currentAssistant = assistants.find((item) => item.id === currentAssistantId)

  const updateAssistantMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateAssistantFrontRequest }
  >({
    mutationFn: ({ id, data }) => updateAssistant(id, data),
    onSuccess: () => {
      appMessage.success(t('assistantSaved'))
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
      setIsEditingManually(false)
    }
  })

  const createAssistantMutation = useMutation({
    mutationFn: createAssistant,
    onSuccess: (data) => {
      appMessage.success(t('assistantCreated'))
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
      setCurrentAssistantId(data.data.id)
      setIsEditingManually(false)
    }
  })

  const copyAssistantMutation = useMutation({
    mutationFn: copyAssistant,
    onSuccess: () => {
      appMessage.success(t('assistantCopied'))
      queryClient.invalidateQueries({
        queryKey: ['assistants']
      })
    }
  })

  const deleteAssistantMutation = useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      appMessage.success(t('assistantDeleted'))
      queryClient.invalidateQueries({
        queryKey: ['assistants']
      })
      setCurrentAssistantId(enabledAssistantId)
      setIsEditingManually(false)
    }
  })

  const { data: publicAssistantsData } = useQuery({
    queryKey: ['publicAssistants', publicAssistantsPage.pageIndex, publicAssistantsPage.pageSize],
    queryFn: () =>
      listPublicAssistants(publicAssistantsPage.pageIndex, publicAssistantsPage.pageSize)
  })
  const { total = 0 } = publicAssistantsData?.data ?? {}
  const publicAssistants = publicAssistantsData?.data.list ?? []

  const likeAssistantMutation = useMutation({
    mutationFn: likeAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'publicAssistants',
          publicAssistantsPage.pageIndex,
          publicAssistantsPage.pageSize
        ]
      })
    }
  })

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: listModels
  })
  const models = modelsData?.data ?? []
  const currentModel = models.find((model) => model.id === currentAssistant?.modelId)

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  })
  const { enabledAssistantId = '0', version: settingsVersion = 0 } = settingsData?.data ?? {}

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      appMessage.success(t('assistantEnabled'))
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      setIsEditingManually(false)
    }
  })

  useEffect(() => {
    if (isEditing) {
      setIsShopOpen(false)
      form.resetFields()
    }
  }, [isEditing])

  const genderMap = {
    0: t('unknown'),
    1: t('male'),
    2: t('female')
  }

  return (
    <div className="flex flex-col items-center h-full w-full relative px-12 md:px-0">
      <Live2DCanvas modelUrl={getOssBaseUrl() + currentModel?.path} />
      <GlassBox
        className={clsx(
          isEditing ? 'h-5/6' : 'h-7/24',
          'w-lg md:w-xl lg:w-3xl absolute bottom-1/12 flex flex-col items-center justify-center px-12 py-10'
        )}
      >
        <AnimatePresence mode="popLayout">
          {isEditing ? (
            <motion.div
              className="w-full h-full"
              key="edit"
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              exit={{ filter: 'blur(10px)', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {isShopOpen ? (
                <motion.div
                  className="w-full h-full flex flex-col items-center justify-between select-none"
                  key="shop"
                  initial={{ filter: 'blur(10px)', opacity: 0 }}
                  animate={{ filter: 'blur(0px)', opacity: 1 }}
                  exit={{ filter: 'blur(10px)', opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
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
                          onClick={() => setIsShopOpen(false)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {publicAssistants.length === 0 ? (
                    <EmptyState className="text-2xl" logoClassName="w-32" />
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
                                  onClick={() => likeAssistantMutation.mutate(item.id)}
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
                                  onClick={() => copyAssistantMutation.mutate(item.id)}
                                />
                              </Tooltip>
                            </div>
                          }
                          className="hover:shadow-xl ease-in-out duration-500"
                        >
                          <Card.Meta
                            avatar={
                              <Avatar
                                src={getOssBaseUrl() + currentModel?.avatarPath}
                                icon={<HeartOutlined />}
                                draggable={false}
                              />
                            }
                            title={item.personality}
                            description={item.details || t('noDetails')}
                            classNames={{
                              avatar: 'flex items-center justify-center'
                            }}
                          />
                        </Card>
                      ))}
                    </div>
                  )}
                  <Pagination
                    total={total}
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
                </motion.div>
              ) : (
                <motion.div
                  key="from"
                  initial={{ filter: 'blur(10px)', opacity: 0 }}
                  animate={{ filter: 'blur(0px)', opacity: 1 }}
                  exit={{ filter: 'blur(10px)', opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-full"
                >
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
                    initialValues={{
                      ...currentAssistant,
                      birthday: currentAssistant?.birthday
                        ? dayjs(currentAssistant.birthday)
                        : undefined,
                      publicFlag: currentAssistant?.publicFlag ?? false
                    }}
                    onFinish={(values) => {
                      if (currentAssistantId) {
                        updateAssistantMutation.mutate({
                          id: currentAssistantId,
                          data: {
                            ...values,
                            birthday: values.birthday?.format('YYYY-MM-DD'),
                            version: currentAssistant?.version ?? 0
                          }
                        })
                      } else {
                        createAssistantMutation.mutate({
                          ...values,
                          birthday: values.birthday?.format('YYYY-MM-DD')
                        })
                      }
                    }}
                    validateMessages={{ required: t('requiredTemplate', { label: '${label}' }) }}
                    variant="filled"
                    className="w-full h-full flex flex-col justify-between select-none"
                  >
                    <div className="flex items-center justify-between w-full mb-6">
                      <Form.Item
                        name="name"
                        rules={[{ required: true, message: t('nameRequired') }]}
                        wrapperCol={{ span: 24 }}
                        className="m-0"
                      >
                        <Input
                          placeholder={t('name')}
                          maxLength={20}
                          spellCheck={false}
                          className="field-sizing-content text-2xl font-semibold"
                        />
                      </Form.Item>
                      <div className="flex gap-4">
                        {currentAssistantId ? (
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
                              onClick={() => {
                                if (currentAssistantId === enabledAssistantId) {
                                  appMessage.warning(t('canNotDeleteEnabledAssistant'))
                                  return
                                }
                                deleteAssistantMutation.mutate(currentAssistantId)
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
                              onClick={() => setIsShopOpen(true)}
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
                              setIsEditingManually(false)
                              if (!currentAssistantId) {
                                setCurrentAssistantId(enabledAssistantId)
                              }
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title={currentAssistantId ? t('save') : t('create')}
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
                    <Form.Item<FieldType> name="birthday" label={t('birthday')}>
                      <DatePicker
                        placeholder={t('birthday')}
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Form.Item>
                    <Form.Item<FieldType>
                      name="modelId"
                      label={t('model')}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder={t('model')}
                        options={models
                          ?.filter((model) => model.ownedFlag)
                          .map((model) => ({ label: model.name, value: model.id }))}
                        className="w-32"
                      />
                    </Form.Item>
                    <Form.Item<FieldType>
                      name="publicFlag"
                      label={t('publicFlag')}
                      rules={[{ required: true }]}
                    >
                      <Switch
                        checkedChildren={<UnlockOutlined />}
                        unCheckedChildren={<LockOutlined />}
                      />
                    </Form.Item>
                    <Form.Item<FieldType> name="personality" label={t('personality')}>
                      <Input
                        placeholder={t('personality')}
                        maxLength={20}
                        showCount
                        spellCheck={false}
                      />
                    </Form.Item>
                    <Form.Item<FieldType> name="details" label={t('details')}>
                      <Input.TextArea
                        placeholder={t('details')}
                        showCount
                        maxLength={50}
                        spellCheck={false}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        className="scrollbar-style"
                      />
                    </Form.Item>
                  </Form>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="w-full h-full flex flex-col items-center justify-between"
              key="description"
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              exit={{ filter: 'blur(10px)', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex justify-between w-full mb-4">
                <Tooltip
                  title={
                    currentAssistant?.name !== 'Misaki' &&
                    t('sameName', { count: currentAssistant?.duplicateName ?? 0 })
                  }
                  arrow={false}
                  classNames={{
                    container: 'select-none'
                  }}
                >
                  <span className="text-2xl font-semibold">{currentAssistant?.name}</span>
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
                      onClick={() => setIsEditingManually(true)}
                    />
                  </Tooltip>
                  <Tooltip
                    title={t(currentAssistantId === enabledAssistantId ? 'enabled' : 'enable')}
                    arrow={false}
                    classNames={{
                      container: 'select-none'
                    }}
                  >
                    <Button
                      color={currentAssistantId === enabledAssistantId ? 'green' : 'default'}
                      variant="filled"
                      shape="circle"
                      icon={<CheckOutlined />}
                      onClick={() => {
                        if (currentAssistantId !== enabledAssistantId) {
                          updateSettingsMutation.mutate({
                            enabledAssistantId: currentAssistantId,
                            version: settingsVersion
                          })
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
                    children: (
                      <span className="truncate">{genderMap[currentAssistant?.gender || 0]}</span>
                    )
                  },
                  {
                    key: '2',
                    label: t('birthday'),
                    span: { sm: 2, md: 1 },
                    children: (
                      <span className="truncate">{currentAssistant?.birthday || t('none')}</span>
                    )
                  },
                  {
                    key: '3',
                    label: t('publicFlag'),
                    span: { sm: 2, md: 1 },
                    children: (
                      <span className="truncate">
                        {currentAssistant?.publicFlag ? t('public') : t('private')}
                      </span>
                    )
                  },
                  {
                    key: '4',
                    label: t('createDate'),
                    span: { sm: 2, md: 1 },
                    children: (
                      <span className="truncate">
                        {dayjs(currentAssistant?.createTime).format('YYYY-MM-DD')}
                      </span>
                    )
                  },
                  {
                    key: '5',
                    span: 2,
                    label: t('personality'),
                    children: <span>{currentAssistant?.personality || t('none')}</span>
                  },
                  {
                    key: '6',
                    span: 'filled',
                    label: t('details'),
                    children: <span>{currentAssistant?.details || t('none')}</span>
                  }
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassBox>
    </div>
  )
}
