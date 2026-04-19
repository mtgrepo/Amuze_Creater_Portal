import StoryTellingTitleForm from "@/components/Entertainment/StoryTelling/Titles/storytelling_title_form";
import { useStoryTellingTitleDetailsQuery } from "@/composable/Query/Entertainment/StoryTelling/useStorytTellingTitleDetailsQuery";
import { useParams } from "react-router-dom";

export default function EditStoryTellingTitlePage() {
    const {id} = useParams();
    const {storyTellingTitleDetails, isTitleLoading} = useStoryTellingTitleDetailsQuery(Number(id));
    const title = storyTellingTitleDetails;
      if (isTitleLoading && !title) return <p>Loading...</p>;

    return(
        <div className="p-6">
            <StoryTellingTitleForm
            mode="edit"
            defaultValues={{
                id: id,
                name: title?.name,
                description: title?.description,
                genres: title?.generes?.map((g: any) => g.id.toString()) || [],
                thumbnail: title?.thumbnail,
                horizontal_thumbnail: title?.horizontal_thumbnail
            }}
            />
        </div>
    )
}