import { useComicEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsEpisodeDetailsQuery";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, Users, Banknote, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ComicEpisodeDetails() {
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
        <Spinner className="text-white" />
      </div>
    );
  }

  if (!episodeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Episode details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 min-h-75">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 opacity-30 grayscale-[0.5] blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${episodeDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center md:items-start">
            {/* Thumbnail Poster */}
            <div className="w-40 h-56 rounded-xl border-2 border-zinc-700 overflow-hidden shadow-2xl shrink-0">
              <img
                src={episodeDetails.thumbnail}
                alt={episodeDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Episode Info */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
                  {episodeDetails.name || `Ep ${id}`}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-full border border-zinc-700">
                    <div className="bg-green-500/20 p-1 rounded-full">
                      <Banknote size={16} className="text-green-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {episodeDetails.price || 0} Kyats
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-full border border-zinc-700">
                    <div className="bg-blue-500/20 p-1 rounded-full">
                      <Eye size={16} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {episodeDetails.views || 0} Views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SHOW IMAGE BUTTON */}
        <Button
          className="w-full"
          onClick={() => {
            /* Implement image viewer logic if needed */
          }}
        >
          Show Image
        </Button>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Sales */}
          <div className="flex items-center gap-4 bg-primary/70 p-6 rounded-2xl shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.01]">
            <div className="bg-white/20 p-4 rounded-full">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Sales
              </p>
              <h3 className="text-3xl font-bold text-white">
                {episodeDetails.total_sales || 30}
              </h3>
            </div>
          </div>

          {/* Total Sales Amount */}
          <div className="flex items-center gap-4 bg-secondary p-6 rounded-2xl shadow-xl shadow-green-900/10 transition-transform hover:scale-[1.01]">
            <div className="bg-white/20 p-4 rounded-full">
              <Banknote size={32} className="text-white" />
            </div>
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Total Sales Amount
              </p>
              <h3 className="text-3xl font-bold text-white">
                ${(episodeDetails.total_sales_amount || 3000).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
