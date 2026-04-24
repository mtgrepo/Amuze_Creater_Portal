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
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { t } from "i18next";

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft className=" h-4 w-4" />
          Back to {location.state?.titleName}
        </Button>
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-border min-h-75  bg-zinc-400 dark:bg-zinc-900">
          <div
            className="absolute inset-0 opacity-30  dark:grayscale-[0.5] blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${episodeDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center ">
            <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
              <img
                src={episodeDetails.thumbnail}
                alt={episodeDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight mb-2 uppercase text-white my-6">
                  {episodeDetails.name || `Comic ${id}`}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 my-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className=" text-xs uppercase tracking-widest mb-1 font-semibold">
                      {t('price')}
                    </span>
                    <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                      <Banknote size={20} />
                      <span>{episodeDetails.price ?? 0} Ks</span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block" />
                  <div className="flex flex-col items-center md:items-start">
                    <span className=" text-xs uppercase tracking-widest mb-1 font-semibold">
                      {t('views')}
                    </span>
                    <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-xl">
                      <Eye size={20} />
                      <span>
                        {(episodeDetails.views ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="absolute top-0 right-0 p-4 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={120} />
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-primary/10 p-5 rounded-2xl text-primary ring-1 ring-primary/20">
                <Users size={32} />
              </div>
              <div>
                <p className="text-muted-foreground font-medium">
                  {t('total_sales')}
                </p>
                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                  {episodeDetails.total_sales || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden transition-all hover:border-green-500/50 hover:shadow-lg">
            <div className="absolute top-0 right-0 p-4 text-green-500 opacity-5 group-hover:opacity-10 transition-opacity">
              <Banknote size={120} />
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-green-500/10 p-5 rounded-2xl text-green-500 ring-1 ring-green-500/20">
                <Banknote size={32} />
              </div>
              <div>
                <p className="text-muted-foreground font-medium">
                  {t('total_revenue')}
                </p>
                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                  {(episodeDetails.total_sales_amount || 0).toLocaleString()}{" "}
                  <span className="text-lg font-normal text-muted-foreground">
                    Ks
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('episode_form.comics_pages')}</CardTitle>
            <Separator />
            <CardDescription>
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
            </CardDescription>
            <CardContent>
              <ScrollArea className="flex-1 w-full ">
                <div className="flex items-start justify-center p-4 min-h-full">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex].url}
                      alt={`Page ${currentImageIndex + 1}`}
                      className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                      No pages available
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
