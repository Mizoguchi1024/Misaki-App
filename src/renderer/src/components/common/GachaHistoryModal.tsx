import { LoadingOutlined } from '@ant-design/icons'
import { listWishes } from '@renderer/api/front/wish'
import { WishFrontResponse } from '@renderer/types/wish'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Modal, Table, TableProps } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GachaHistoryModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('gachaHistoryModal')
  const [wishesPage, setWishesPage] = useState({
    pageIndex: 1,
    pageSize: 5
  })

  const { data: wishesData, isFetching } = useQuery({
    queryKey: ['wishes', wishesPage.pageIndex, wishesPage.pageSize],
    queryFn: () => listWishes(wishesPage.pageIndex, wishesPage.pageSize),
    placeholderData: keepPreviousData
  })
  const { total = 0 } = wishesData?.data ?? {}
  const wishes = wishesData?.data.list ?? []

  const columns: TableProps<WishFrontResponse>['columns'] = [
    {
      title: t('item'),
      dataIndex: 'modelName',
      key: 'modelName',
      width: 120,
      render: (value, record) => (
        <span
          className={clsx(
            record.modelGrade === 5 && 'text-yellow-400 dark:text-yellow-700',
            record.modelGrade === 4 && 'text-purple-400 dark:text-purple-700'
          )}
        >
          {record.hitFlag ? value : t('token')}
        </span>
      )
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (value, record) => value + (record.duplicateFlag && ' ' + t('stardust'))
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime'
    }
  ]

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      title={t('history')}
      footer={null}
      destroyOnHidden
      className="select-none"
    >
      <Table<WishFrontResponse>
        rowKey="id"
        dataSource={wishes}
        loading={{ spinning: isFetching, indicator: <LoadingOutlined spin /> }}
        columns={columns}
        pagination={{
          current: wishesPage.pageIndex,
          pageSize: wishesPage.pageSize,
          total: total,
          showSizeChanger: false,
          placement: ['bottomCenter'],
          onChange: (page, pageSize) => {
            setWishesPage({ pageIndex: page, pageSize })
          }
        }}
      ></Table>
    </Modal>
  )
}
