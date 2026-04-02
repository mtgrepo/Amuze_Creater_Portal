import { useState } from "react";
import { useComicEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsEpisodeDetailsQuery";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Users,
  Banknote,
  Eye,
  ArrowLeft,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ComicEpisodeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Viewer State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const titleId = location.state?.titleId;

  const { episodeDetails, isLoading } = useComicEpisodeDetailsQuery(
    Number(titleId),
    Number(id),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  if (!episodeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p>Episode details not found.</p>
      </div>
    );
  }

  const images = episodeDetails.files_path || [];

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-border min-h-75">
          <div
            className="absolute inset-0 opacity-30 grayscale-[0.5] blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${episodeDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center md:items-start">
            <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
              <img
                src={episodeDetails.thumbnail}
                alt={episodeDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
                  {episodeDetails.name || `Ep ${id}`}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-border">
                    <div className="bg-green-500/20 p-1 rounded-full text-green-500">
                      <Banknote size={16} />
                    </div>
                    <span className="text-sm font-medium">
                      {episodeDetails.price || 0} Kyats
                    </span>
                  </div>
                  <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-border">
                    <div className="bg-blue-500/20 p-1 rounded-full text-primary">
                      <Eye size={16} />
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

        {/* IMAGE VIEWER DIALOG */}
        <Dialog onOpenChange={() => setCurrentImageIndex(0)}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary/90 text-white cursor-pointer">
              Show Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w- h-[90vh] p-0 border-border flex flex-col overflow-hidden">
            {/* Viewer Header */}
            <div className="flex items-center justify-between p-4  border-b border-border shrink-0">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrev}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft size={20} />
                </Button>

                <span className="text-sm font-medium min-w-25 text-center">
                  Page {currentImageIndex + 1} of {images.length}
                </span>

                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNext}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
              <div className="w-6" /> {/* Spacer */}
            </div>

            {/* Image Area */}
            <ScrollArea className="flex-1 w-full ">
              <div className="flex items-start justify-center p-4 min-h-full">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex].url}
                    alt={`Page ${currentImageIndex + 1}`}
                    className="max-w-full h-auto shadow-2xl"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500">
                    No pages available
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-primary p-6 rounded-2xl">
            <div className="bg-white/20 p-4 rounded-full">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Sales</p>
              <h3 className="text-3xl font-bold text-white">
                {episodeDetails.total_sales || 30}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-secondary p-6 rounded-2xl">
            <div className="bg-white/20 dark:bg-zinc-800 p-4 rounded-full">
              <Banknote size={32} />
            </div>
            <div>
              <p className="text-sm font-medium">Total Sales Amount</p>
              <h3 className="text-3xl font-bold">
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
