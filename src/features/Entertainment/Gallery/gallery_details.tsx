"use client";

import { useParams } from "react-router-dom";
import {
  Users,
  Banknote,
  Eye,
  Loader2,
  TrendingUp,
  ImageIcon,
} from "lucide-react";
import CommentsSection from "@/components/Entertainment/Comics/Title/comics_comments";
import { Badge } from "@/components/ui/badge";
import { useGalleryDetailsQuery } from "@/composable/Query/Entertainment/Gallery/useGalleryDetailsQuery";
import { useGalleryCommentsQuery } from "@/composable/Query/Entertainment/Gallery/useGalleryCommentQuery";

export default function GalleryDetails() {
  const { id } = useParams();

  const { galleryDetails, isLoading } = useGalleryDetailsQuery(Number(id));

  const { commentsList, isLoading: isCommentsLoading } =
    useGalleryCommentsQuery(Number(id));

  if (isLoading || isCommentsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-400">Loading details...</p>
      </div>
    );
  }

  if (!galleryDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p>Novel details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-100 dark:bg-zinc-900 shadow-xl">
          {/* Background Blur Effect */}
          <div
            className="absolute inset-0 opacity-50 blur-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${galleryDetails.thumbnail})` }}
          />

          <div className="relative flex flex-col md:flex-row gap-8 p-10 h-full items-center md:items-start">
            {/* Main Thumbnail */}
            <div className="w-48 h-64 rounded-2xl border-4 border-white/10 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-105 duration-300">
              <img
                src={galleryDetails.thumbnail}
                alt={galleryDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-4 uppercase text-foreground">
                  {galleryDetails.name || `Novel ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                  {galleryDetails?.generes?.map((genre: any) => (
                    <Badge
                      key={genre?.id}
                      className="bg-primary text-white border-none"
                    >
                      {genre.name || genre.name_eng}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-10">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-2 font-bold">
                      Base Price
                    </span>
                    <div className="flex items-center gap-2 text-green-500 font-black text-2xl">
                      <Banknote size={24} />
                      <span>{galleryDetails.price ?? 0} Ks</span>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border hidden md:block" />
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-2 font-bold">
                      Total Engagement
                    </span>
                    <div className="flex items-center gap-2 text-blue-500 font-black text-2xl">
                      <Eye size={24} />
                      <span>
                        {(galleryDetails.views ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESCRIPTION SECTION --- */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            Description
          </h3>
          <p className="text-muted-foreground leading-relaxed text-lg italic">
            "
            {galleryDetails?.description ||
              "No description available for this title."}
            "
          </p>
        </div>

        {/* --- MEDIA ASSETS SECTION (Preview & Display) --- */}
        <div className="pt-4 bg-card p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <ImageIcon className="text-primary" />
            Marketing & Display Assets
          </h3>
          <div className="grid grid-cols-1  gap-6">
            {/* Preview File */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase ml-2">
                Preview Thumbnail
              </p>
              <div className="aspect-video rounded-2xl w-full overflow-hidden border-2 border-dashed border-border bg-muted flex items-center justify-center group relative">
                {galleryDetails.preview_file ? (
                  <img
                    src={galleryDetails.preview_file}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-muted-foreground">
                    No preview file uploaded
                  </span>
                )}
              </div>
            </div>

            {/* Display File */}
            {/* <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase ml-2">Banner / Display Asset</p>
              <div className="aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-border bg-muted flex items-center justify-center group relative">
                {galleryDetails.display_file ? (
                  <img src={galleryDetails.display_file} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Display" />
                ) : (
                  <span className="text-muted-foreground">No display file uploaded</span>
                )}
              </div>
            </div> */}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl">
            <div className="absolute -top-6 -right-6 p-4 text-primary opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <TrendingUp size={160} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="bg-primary/10 p-5 rounded-2xl text-primary ring-1 ring-primary/20">
                <Users size={40} />
              </div>
              <div>
                <p className="text-muted-foreground font-bold text-sm uppercase">
                  Total Copies Sold
                </p>
                <h3 className="text-5xl font-black text-foreground tracking-tighter">
                  {galleryDetails.total_sales || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden transition-all hover:border-green-500/50 hover:shadow-xl">
            <div className="absolute -top-6 -right-6 p-4 text-green-500 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <Banknote size={160} />
            </div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="bg-green-500/10 p-5 rounded-2xl text-green-500 ring-1 ring-green-500/20">
                <Banknote size={40} />
              </div>
              <div>
                <p className="text-muted-foreground font-bold text-sm uppercase">
                  Estimated Gross Revenue
                </p>
                <h3 className="text-5xl font-black text-foreground tracking-tighter">
                  {(galleryDetails.total_sales_amount || 0).toLocaleString()}{" "}
                  <span className="text-xl font-medium text-muted-foreground">
                    Ks
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Community Discussion
            </h3>
            <p className="text-muted-foreground text-sm">
              See what others are saying about this novel.
            </p>
          </div>
          <CommentsSection commentsList={commentsList} />
        </div>
      </div>
    </div>
  );
}
