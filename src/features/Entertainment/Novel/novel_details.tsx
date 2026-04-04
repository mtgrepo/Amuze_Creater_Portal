import { useParams } from "react-router-dom";
import { Users, Banknote, Eye, Loader2 } from "lucide-react";
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
        <div className="relative overflow-hidden rounded-2xl border border-border min-h-75 bg-zinc-900">
          <div
            className="absolute inset-0 opacity-30 grayscale-[0.5] blur-sm bg-cover bg-center"
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
                <div className="relative  flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {novelDetails?.generes?.map((genre: any) => (
                    <Badge
                      key={genre?.id}
                      className="bg-primary text-white border-none"
                    >
                      {genre.name || genre.name_eng}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white">
                  <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    <Banknote size={16} className="text-green-400" />
                    <span className="text-sm font-medium">
                      {novelDetails.price ?? 0} Kyats
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    <Eye size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">
                      {novelDetails.views ?? 0} Views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF VIEWER DIALOG */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90  cursor-pointer py-3 ">
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

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-primary p-6 rounded-2xl shadow-lg">
            <div className="bg-white/20 p-4 rounded-full">
              <Users size={32} className="text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Sales</p>
              <h3 className="text-3xl font-bold text-white">
                {novelDetails.total_sales || 0}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-secondary p-6 rounded-2xl border border-border">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Banknote size={32} />
            </div>
            <div>
              <p className="text-sm font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold">
                {(novelDetails.total_sales_amount || 0).toLocaleString()} Ks
              </h3>
            </div>
          </div>
        </div>

        <CommentsSection commentsList={commentsList} />
      </div>
    </div>
  );
}
