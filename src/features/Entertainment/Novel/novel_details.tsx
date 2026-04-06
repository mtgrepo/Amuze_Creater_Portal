import { useParams } from "react-router-dom";
import { Users, Banknote, Eye, Loader2, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNovelDetailsQuery } from "../../../composable/Query/Entertainment/Novel/useNovelDetailsQuery";
import { useNovelCommentsQuery } from "@/composable/Query/Entertainment/Novel/useNovelCommentQuery";
import CommentsSection from "@/components/Entertainment/Comics/Title/comics_comments";
import { Badge } from "@/components/ui/badge";

// PDF Viewer Imports
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function NovelDetails() {
  const { id } = useParams();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { novelDetails, isNovelDetailsLoading } = useNovelDetailsQuery(
    Number(id),
  );
  const { commentsList, isLoading: isNovelCommentsLoading } =
    useNovelCommentsQuery(Number(id));

  if (isNovelDetailsLoading || isNovelCommentsLoading) {
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

  const pdfUrl = novelDetails?.file_path || novelDetails?.files_path?.[0]?.url;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-border min-h-75  bg-zinc-400 dark:bg-zinc-900">
          <div
            className="absolute inset-0 opacity-30  dark:grayscale-[0.5] blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${novelDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-8 h-full items-center md:items-start">
            <div className="w-40 h-56 rounded-xl border-2 border-border overflow-hidden shadow-2xl shrink-0">
              <img
                src={novelDetails.thumbnail}
                alt={novelDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase text-white">
                  {novelDetails.name || `Novel ${id}`}
                </h1>

                {/* Genre Tags - Fixed with relative/z-10 and data check */}
                <div className="relative  flex flex-wrap justify-center md:justify-start gap-2 my-6">
                  {novelDetails?.generes?.map((genre: any) => (
                    <Badge
                      key={genre?.id}
                      className="bg-primary text-white border-none"
                    >
                      {genre.name || genre.name_eng}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className=" text-xs uppercase tracking-widest mb-1 font-semibold">Price</span>
                    <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                      <Banknote size={20} />
                      <span>{novelDetails.price ?? 0} Ks</span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block" />
                  <div className="flex flex-col items-center md:items-start">
                    <span className=" text-xs uppercase tracking-widest mb-1 font-semibold">Views</span>
                    <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-xl">
                      <Eye size={20} />
                      <span>{(novelDetails.views ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild className="my-6">
                    <Button className="cursor-pointer py-3 ">
                      <BookOpen />
                      Read PDF
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-[80vw]! w-full h-[90vh] p-0 border-border flex flex-col overflow-hidden">
                    {" "}
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
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {novelDetails?.description || "No description available for this title."}
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
                <p className="text-muted-foreground font-medium">Total Community Sales</p>
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
                <p className="text-muted-foreground font-medium">Estimated Revenue</p>
                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                  {(novelDetails.total_sales_amount || 0).toLocaleString()} <span className="text-lg font-normal text-muted-foreground">Ks</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-4 shadow-sm">
          <CommentsSection commentsList={commentsList} />
        </div>
      </div>
    </div>
  );
}
