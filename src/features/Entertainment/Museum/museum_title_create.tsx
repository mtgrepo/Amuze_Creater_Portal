import MuseumTitleForm from '@/components/Entertainment/Museum/Title/museum_title_form'
import { useParams } from 'react-router-dom'

export default function MuseumTitleCreate() {
    const {id} = useParams();
  return (
    <div>
        <MuseumTitleForm mode='add' museumId={Number(id)}/>
    </div>
  )
}
