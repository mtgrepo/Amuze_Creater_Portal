import MuseumEpisodeForm from '@/components/Entertainment/Museum/Episodes/museum_episode_form'
import { useParams } from 'react-router-dom'

export default function MuseumEpisodeCreate() {
    const {titleId} = useParams();
  return (
    <div>
        <MuseumEpisodeForm mode='add' titleId={Number(titleId)}/>
    </div>
  )
}
