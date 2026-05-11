import MuseumForm from '@/components/Entertainment/Museum/Museum/museum_form'
import { useMuseumDetailQuery } from '@/composable/Query/Entertainment/Museum/useMuseumDetailQuery';
import { useLocation, useParams } from 'react-router-dom'

export default function MuseumUpdate() {
    const {id} = useParams();
    const {state} = useLocation();
    const {museumDetail, isDetailPending} = useMuseumDetailQuery(Number(id));
    const museum = museumDetail || state;
    if(isDetailPending){
        <div>Loading...</div>
    }
  return (
    <div>
        <MuseumForm
        mode='edit'
        defaultValues={{
            id:id,
            name:museum?.name,
            description:museum?.description,
            thumbnail:museum?.thumbnail,
            horizontal_thumbnail:museum?.horizontal_thumbnail
        }}
        />
    </div>
  )
}
