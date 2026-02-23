import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Dropdown, Button, MenuProps, Modal } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ChatDropdown(): React.JSX.Element {
  const { t } = useTranslation('chatDropdown')
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)

  const list: MenuProps['items'] = [
    {
      key: '/updateTitle',
      label: t('updateTitle'),
      icon: <EditOutlined />
    },
    {
      key: '/delete',
      label: t('delete'),
      icon: <DeleteOutlined />
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case '/delete':
        setIsDeleteConfirmModalOpen(true)
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items: list, onClick }}
        placement="bottomLeft"
        trigger={['click']}
        classNames={{
          itemContent: 'select-none'
        }}
      >
        <Button
          color="default"
          variant="filled"
          shape="circle"
          icon={<EllipsisOutlined />}
        ></Button>
      </Dropdown>
      <Modal
        title={t('title')}
        centered
        open={isDeleteConfirmModalOpen}
        onCancel={() => setIsDeleteConfirmModalOpen(false)}
        className="select-none"
      ></Modal>
    </>
  )
}
