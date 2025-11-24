import GlassBox from '@renderer/components/GlassBox'
import { Masonry } from 'antd'

const heights = [120, 55, 85, 160, 95, 140, 75, 110, 65, 130, 90, 145, 55, 100, 80]

export default function Script(): React.JSX.Element {
  const items = heights.map((height, index) => ({
    key: `item-${index}`,
    data: height,
    index
  }))

  return (
    <div className="p-8">
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        gutter={{ xs: 8, sm: 12, md: 16 }}
        items={items}
        itemRender={(item) => <GlassBox style={{ height: item.data }}>{item.index + 1}</GlassBox>}
      />
    </div>
  )
}
