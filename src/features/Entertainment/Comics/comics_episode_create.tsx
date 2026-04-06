import ComicEpisodeForm from "@/components/Entertainment/Comics/Episodes/episode_form";
import { useParams } from "react-router-dom";

export default function ComicsEpisodeCreate() {
    const {id} = useParams();
    // console.log("id", id) 
  return (
    <div>
        <ComicEpisodeForm mode="add" comicTitleId={id!}/>
    </div>
  )
}
