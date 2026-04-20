import MuseumForm from '@/components/Entertainment/Museum/Museum/museum_form'
import { useMuseumDetailQuery } from '@/composable/Query/Entertainment/Museum/useMuseumDetailQuery';
import { useParams } from 'react-router-dom'

export default function MuseumUpdate() {
    const {id} = useParams();
    const {museumDetail, isDetailPending} = useMuseumDetailQuery(Number(id));
    if(isDetailPending){
        <div>Loading...</div>
    }
  return (
    <div>
        <MuseumForm
        mode='edit'
        defaultValues={{
            id:id,
            name:museumDetail?.name,
            description:museumDetail?.description,
            thumbnail:museumDetail?.thumbnail,
            horizontal_thumbnail:museumDetail?.horizontal_thumbnail
        }}
        />
    </div>
  )
}
