import MuseumEpisodeForm from "@/components/Entertainment/Museum/Episodes/museum_episode_form";
import { useMuseumEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Museum/useMuseumEpisodeDetailsQuery";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function MuseumEpisodeUpdatePage() {
  const { episodeId, titleId } = useParams();
  const navigate = useNavigate();

  const { episodeDetails, isEpisodeLoading } = useMuseumEpisodeDetailsQuery(
    Number(episodeId),
  );

  if (isEpisodeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading museum episode details...</p>
      </div>
    );
  }

  if (!episodeDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Episode Context. Please return to the museum detail page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">
          Go Back
        </button>
      </div>
    );
  }

  const formDefaults = {
    id: String(episodeDetails.id),
    titleId: episodeDetails.museum_title_id,
    name: episodeDetails.name,
    description: episodeDetails.description,
    thumbnail: episodeDetails.thumbnail,
    museum_file: episodeDetails.files_path,
    created_by: episodeDetails.created_by,
  };
  return (
    <div>
      <MuseumEpisodeForm
        mode="edit"
        titleId={Number(titleId)}
        defaultValues={formDefaults}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}
