import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import StoryTellingEpisodeForm from "@/components/Entertainment/StoryTelling/Episodes/episode_form";
import { useEpisodeDetailQuery } from "@/composable/Query/Entertainment/StoryTelling/useEpisodeDetailsQuery";

export default function StoryTellingEpisodeUpdate() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const titleId = location.state?.titleId;

  const { storyTellingEpisodeDetails, isLoading } = useEpisodeDetailQuery(
    Number(titleId),
    Number(id),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading storytelling details...</p>
      </div>
    );
  }

  if (!titleId || !storyTellingEpisodeDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Episode Context. Please return to the Storytelling Details page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Go Back</button>
      </div>
    );
  }


  const formDefaults = {
    id: storyTellingEpisodeDetails.id,
    name: storyTellingEpisodeDetails.name,
    price: storyTellingEpisodeDetails.price,
    thumbnail:storyTellingEpisodeDetails.thumbnail,
    file_path: storyTellingEpisodeDetails.file_path || [],
    created_by: storyTellingEpisodeDetails.created_by
  };

  return (
    <div className="p-6 min-h-screen">
      <StoryTellingEpisodeForm
        mode="edit"
        titleId={titleId}
        defaultValues={formDefaults}
      />
    </div>
  );
}