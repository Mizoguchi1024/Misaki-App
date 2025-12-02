import { useParams } from 'react-router-dom'

export default function Chat(): React.JSX.Element {
  const { id } = useParams()
  return <div>Chat Page: {id}</div>
}
