import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Banknote,
  Eye,
  Loader2,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  ThumbsUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNovelDetailsQuery } from "../../../composable/Query/Entertainment/Novel/useNovelDetailsQuery";
import { Badge } from "@/components/ui/badge";

// PDF Viewer Imports
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import CommentsSection from "@/components/common/comment_component";
import Stat from "@/components/common/details_stat";
import { useTheme } from "@/components/common/Themes/theme-provider";
import { useTranslation } from "react-i18next";

export default function NovelDetails() {
  const { id } = useParams();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { novelDetails, isNovelDetailsLoading } = useNovelDetailsQuery(
    Number(id),
  );

  const { commentsList, isLoading } = useCommentQuery("novel", Number(id));

  const pdfUrl = novelDetails?.file_path || novelDetails?.files_path?.[0]?.url;
  const navigate = useNavigate();

  //get current theme
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (
    (isNovelDetailsLoading && !novelDetails) ||
    (isLoading && !commentsList)
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-400">Loading details...</p>
      </div>
    );
  }

  if (!novelDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p>Novel details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl  px-6 mx-auto space-y-6">
        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => navigate("/entertainment/novel")}
          className="cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Novel
        </Button>

        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-500 dark:bg-zinc-900 shadow-2xl">
          {/* Background Image Layer - Increased blur for readability */}
          <div
            className="absolute inset-0  bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${novelDetails.horizontal_thumbnail})`,
            }}
          />

          {/* Dark Gradient Overlay - Vital for text contrast */}
          <div
            className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent"
          />

          {/* Content Wrapper - items-center fixes the vertical alignment */}
          <div className="relative flex flex-col lg:flex-row gap-8 p-8 md:p-10 h-full items-center md:items-center">
            {/* Thumbnail Image */}
            <div className="w-40 h-56 md:w-48 md:h-72 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02] duration-300">
              <img
                src={novelDetails.thumbnail}
                alt={novelDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase  drop-shadow-md">
                  {novelDetails.name || `Novel ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 py-2">
                  {novelDetails?.generes?.map((genre: any) => (
                    <Badge
                      key={genre?.id}
                      className="bg-primary text-xs"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats Bar - Refactored to Grid for perfect alignment */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-8  bg-muted/70 px-4 py-3 rounded-2xl">
                <Stat
                  icon={<Banknote className="text-emerald-400" size={20} />}
                  value={`${novelDetails?.price ?? 0} Ks`}
                  label="Price"
                />
                <Stat
                  icon={
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                  }
                  value={novelDetails?.rating ?? "0"}
                  label="Rating"
                />
                <Stat
                  icon={<Eye className="text-sky-400" size={20} />}
                  value={(novelDetails?.views ?? 0).toLocaleString()}
                  label="Views"
                />
                <Stat
                  icon={<ThumbsUp className="text-rose-400" size={20} />}
                  value={novelDetails?.likes ?? "0"}
                  label="Likes"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read PDF
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-[80vw]! w-full h-[90vh] p-0 border-border flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border bg-background shrink-0">
                      <h2 className="text-sm font-medium">
                        PDF Viewer: {novelDetails.name}
                      </h2>
                    </div>
                    <div className="flex-1 w-full bg-zinc-100 overflow-hidden">
                      {pdfUrl ? (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                          <Viewer
                            fileUrl={pdfUrl}
                            plugins={[defaultLayoutPluginInstance]}
                            theme={theme === "dark" ? "dark" : "light"}
                          />
                        </Worker>
                      ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                          No PDF available
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* --- ABOUT SECTION --- */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {t("description")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {novelDetails?.description ||
                "No description available for this title."}
            </p>
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
                  {t("total_sales")}
                </p>
                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                  {novelDetails.total_sales || 0}
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
                  {t("total_revenue")}
                </p>
                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                  {(novelDetails.total_sales_amount || 0).toLocaleString()}{" "}
                  <span className="text-lg font-normal text-muted-foreground">
                    Ks
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
          <CommentsSection commentsList={commentsList} category="novel" />
        </div>
      </div>
    </div>
  );
}

