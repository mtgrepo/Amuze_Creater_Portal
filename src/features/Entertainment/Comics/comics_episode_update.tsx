import { useParams, useLocation, useNavigate } from "react-router-dom";
import ComicEpisodeForm from "@/components/Entertainment/Comics/Episodes/episode_form";
import { useComicEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsEpisodeDetailsQuery";

export default function EditEpisodePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the titleId from navigation state
  const titleId = location.state?.titleId;

  // Fetch Episode Details
  const { episodeDetails, isLoading } = useComicEpisodeDetailsQuery(
    Number(titleId),
    Number(id),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white animate-pulse">Loading Episode Details...</p>
      </div>
    );
  }

  if (!titleId || !episodeDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Episode Context. Please return to the Comic Details page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Go Back</button>
      </div>
    );
  }


  const formDefaults = {
    id: episodeDetails.id,
    name: episodeDetails.name,
    price: episodeDetails.price,
    thumbnail: episodeDetails.thumbnail,
    images: episodeDetails.files_path || [],
    created_by: episodeDetails.created_by
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <ComicEpisodeForm
        mode="edit"
        comicTitleId={String(titleId)}
        defaultValues={formDefaults}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}