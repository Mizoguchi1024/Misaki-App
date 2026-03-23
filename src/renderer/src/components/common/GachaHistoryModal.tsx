import { listWishes } from '@renderer/api/front/wish'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Modal, Table } from 'antd'
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

  const columns = [
    {
      title: '模型',
      dataIndex: 'modelId',
      key: 'modelId'
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: '祈愿时间',
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
      <Table
        dataSource={wishes}
        loading={isFetching}
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
