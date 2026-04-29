import { useComicEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsEpisodeDetailsQuery";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Banknote,
  Eye,
  ArrowLeft,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { t } from "i18next";
import { ImageCarousel } from "../../../components/common/image_carousel";
import StatusCard from "../../../components/common/details_page_stats_card";

export default function ComicEpisodeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const titleId = location.state?.titleId;

  const { episodeDetails, isLoading } = useComicEpisodeDetailsQuery(
    Number(titleId),
    Number(id),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-muted-foreground animate-pulse">Loading comic details...</p>
      </div>
    );
  }

  if (!episodeDetails) return <div className="p-10 text-center">Not found</div>;

  const images = episodeDetails.files_path || [];

  return (
    <div className="min-h-screen">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto space-y-6 px-6">
        
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="truncate max-w-50 sm:max-w-none">
            Back to {location.state?.titleName}
          </span>
        </Button>

        {/* HERO CARD - Responsive Flex and Padding */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-zinc-900 shadow-xl">
          <div
            className="absolute inset-0 opacity-20 blur-xl scale-110 bg-cover bg-center"
            style={{ backgroundImage: `url(${episodeDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col sm:flex-row gap-6 p-6 md:p-10 items-center sm:items-start">
            <div className="w-48 h-64 md:w-56 md:h-80 rounded-xl border-2 border-white/10 overflow-hidden shadow-2xl shrink-0">
              <img
                src={episodeDetails.thumbnail}
                alt={episodeDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center sm:text-left">
              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase leading-tight">
                  {episodeDetails.name || `Episode ${id}`}
                </h1>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 md:gap-8 mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400 mb-1 font-bold">
                      {t('price')}
                    </span>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg md:text-2xl">
                      <Banknote className="w-5 h-5 md:w-6 md:h-6" />
                      <span>{episodeDetails.price ?? 0} Ks</span>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block h-12 w-px bg-white/10" />

                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400 mb-1 font-bold">
                      {t('views')}
                    </span>
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-lg md:text-2xl">
                      <Eye className="w-5 h-5 md:w-6 md:h-6" />
                      <span>{(episodeDetails.views ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID - 1 col on small, 2 on medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <StatusCard
            icon={<Users size={32} />} 
            label={t('total_sales')} 
            value={episodeDetails.total_sales} 
            color="primary"
            bgIcon={<TrendingUp size={120} />}
          />
          <StatusCard 
            icon={<Banknote size={32} />} 
            label={t('total_revenue')} 
            value={episodeDetails.total_sales_amount} 
            suffix="Ks"
            color="green"
            bgIcon={<Banknote size={120} />}
          />
        </div>

        {/* CAROUSEL SECTION */}
        <Card className="border-none bg-transparent shadow-none sm:bg-card sm:border sm:shadow-sm">
          <CardHeader className="px-2 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl">{t('episode_form.comics_pages')}</CardTitle>
              <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg self-start sm:self-auto">
                <span className="text-xs font-bold px-3">
                  {images.length} PAGES
                </span>
              </div>
            </div>
            <Separator className="my-4" />
          </CardHeader>
          <CardContent className="px-0 sm:px-6 pb-6">
            <ImageCarousel images={images} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
