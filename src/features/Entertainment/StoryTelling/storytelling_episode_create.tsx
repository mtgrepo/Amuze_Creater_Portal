import StoryTellingEpisodeForm from "@/components/Entertainment/StoryTelling/Episodes/episode_form";
import { useParams } from "react-router-dom";


export default function StoryTellingEpisodeCreate(){
    const {id} = useParams();
    return(
        <div>
            <StoryTellingEpisodeForm mode="add" titleId={Number(id)} />
        </div>
    )
}