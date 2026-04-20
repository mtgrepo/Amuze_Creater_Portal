import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useMuzeBoxEpisodeDetailsQuery } from "@/composable/Query/Entertainment/MuzeBox/Episode/useMuzeBoxEpisodeDetailsQuery";
import MuzeBoxEpisodeForm from "@/components/Entertainment/MuzeBox/Episode/muzeBox_episode_form";

export default function MuzeBoxEditEpisodePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the titleId from navigation state
  const titleId = location.state?.titleId;
    const titleName = location?.state?.titleName;
    // console.log("titleNmae", titleName)
  // Fetch Episode Details
  const { episodeDetails, isLoading } = useMuzeBoxEpisodeDetailsQuery(Number(titleId), Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  if (!titleId || !episodeDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Episode Context. Please return to the MuzeBox Details page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Go Back</button>
      </div>
    );
  }


  const formDefaults = {
    id: episodeDetails.id,
    name: episodeDetails.name,
    description: episodeDetails.description,
    price: episodeDetails.price,
    thumbnail: episodeDetails.thumbnail,
    video: episodeDetails.video || [],
    created_by: episodeDetails.created_by
  };

  return (
    <div className="p-6 min-h-screen">
      <MuzeBoxEpisodeForm
        mode="edit"
        defaultValues={formDefaults}
        titleId={titleId}
        titleName={titleName}
      />
    </div>
  );
}