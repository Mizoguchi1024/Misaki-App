import { listWishes } from '@renderer/api/front/wish'
import { useQuery } from '@tanstack/react-query'
import { Modal, Table } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GachaHistoryModal({ open, onCancel }): React.JSX.Element {
  const { t } = useTranslation('gachaHistoryModal')
  const [wishesPage, setWishesPage] = useState({
    pageIndex: 1,
    pageSize: 5
  })

  const { data: wishesData } = useQuery({
    queryKey: ['wishes', wishesPage.pageIndex, wishesPage.pageSize],
    queryFn: () => listWishes(wishesPage.pageIndex, wishesPage.pageSize)
  })
  const { total = 0 } = wishesData?.data ?? {}
  const wishes = wishesData?.data.list ?? []

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
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
    >
      <Table
        dataSource={wishes}
        columns={columns}
        pagination={{
          current: wishesPage.pageIndex,
          pageSize: wishesPage.pageSize,
          total: total,
          placement: ['bottomCenter'],
          onChange: (page, pageSize) => {
            setWishesPage({ pageIndex: page, pageSize })
          }
        }}
      ></Table>
    </Modal>
  )
}
