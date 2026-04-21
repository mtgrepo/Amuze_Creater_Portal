"use client";

import { useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Banknote,
  Eye,
  Loader2,
  TrendingUp,
  ImageIcon,
  ArrowLeft,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGalleryDetailsQuery } from "@/composable/Query/Entertainment/Gallery/useGalleryDetailsQuery";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import CommentsSection from "@/components/common/comment_component";
import { Button } from "../../../components/ui/button";
import Stat from "@/components/common/details_stat";

export default function GalleryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { galleryDetails, isLoading } = useGalleryDetailsQuery(Number(id));

  const { commentsList, isLoading: isCommentsLoading } = useCommentQuery(
    "gallery",
    Number(id),
  );

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* BACK BUTTON */}
        <Button variant="ghost" onClick={() => navigate("/entertainment/gallery")} className="cursor-pointer">
          <ArrowLeft size={18} />
          Back to Gallery
        </Button>
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-500 dark:bg-zinc-900 shadow-2xl">
          {/* Background Image Layer - Increased blur for readability */}
          <div
            className="absolute inset-0 opacity-40 blur-xl scale-110 bg-cover bg-center"
            style={{ backgroundImage: `url(${galleryDetails.thumbnail})` }}
          />

          {/* Dark Gradient Overlay - Vital for text contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />

          {/* Content Wrapper - items-center fixes the vertical alignment */}
          <div className="relative flex flex-col md:flex-row gap-8 p-8 md:p-10 h-full items-center md:items-center">
            {/* Thumbnail Image */}
            <div className="w-40 h-56 md:w-48 md:h-72 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02] duration-300">
              <img
                src={galleryDetails.thumbnail}
                alt={galleryDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase text-white drop-shadow-md">
                  {galleryDetails.name || `Novel ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 py-2">
                  {galleryDetails?.generes?.map((genre: any) => (
                    <Badge
                      key={genre?.id}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats Bar - Refactored to Grid for perfect alignment */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-8 px-8 py-2 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-xl shadow-2xl">
                <Stat
                  icon={<Banknote className="text-emerald-400" size={20} />}
                  value={`${galleryDetails?.price ?? 0} Ks`}
                  label="Price"
                />
                <Stat
                  icon={
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                  }
                  value={galleryDetails?.rating ?? "0"}
                  label="Rating"
                />
                <Stat
                  icon={<Eye className="text-sky-400" size={20} />}
                  value={(galleryDetails?.views ?? 0).toLocaleString()}
                  label="Views"
                />
                <Stat
                  icon={<ThumbsUp className="text-rose-400" size={20} />}
                  value={galleryDetails?.likes ?? "0"}
                  label="Likes"
                />
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

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl">
            <div className="absolute -top-6 -right-6 p-4 text-primary opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <TrendingUp size={160} />
            </div>
            <div className="flex items-center gap-6 relative">
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
          <CommentsSection commentsList={commentsList} category="gallery" />
        </div>
      </div>
    </div>
  );
}

