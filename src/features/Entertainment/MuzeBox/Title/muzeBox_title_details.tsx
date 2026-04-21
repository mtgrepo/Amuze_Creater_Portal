import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Eye,
  ThumbsUp,
  Loader2,
  XCircle,
  CircleCheckBig,
  ArrowLeft,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import IconWithTooltip from "@/components/common/IconWithTooltip";
import { Badge } from "@/components/ui/badge";
import { useMuzeBoxTitleDetailsQuery } from "@/composable/Query/Entertainment/MuzeBox/Title/useMuzeBoxDetailsQuery";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import CommentsSection from "@/components/common/comment_component";
import EpisodeActions from "@/components/Entertainment/MuzeBox/Episode/muzeBox_episode_actions";
import Stat from "@/components/common/details_stat";
import { useTranslation } from "react-i18next";

export default function MuzeBoxTitleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { commentsList, isLoading: isCommentsLoading } = useCommentQuery(
    "muze-box",
    Number(id),
  );
  const { titleDetails, isLoading, error } = useMuzeBoxTitleDetailsQuery(
    Number(id)!,
  );
  if (isLoading || isCommentsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading details...
        </p>
      </div>
    );
  }

  if (error || !titleDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Oops!</h2>
          <p className="text-muted-foreground">Failed to load muze box details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate('/entertainment/muze-box')} className="cursor-pointer">
          <ArrowLeft size={18} />
          Back to MuzeBox 
        </Button>
        {/*  HEADER / BANNER AREA  */}
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-500 dark:bg-zinc-900 shadow-2xl">
          {/* Background Image Layer - Increased blur for readability */}
          <div
            className="absolute inset-0  bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${titleDetails.horizontal_thumbnail})` }}
          />

          {/* Dark Gradient Overlay - Vital for text contrast */}
          <div
            className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent"
          />
          {/* Content Wrapper - items-center fixes the vertical alignment */}
          <div className="relative flex flex-col md:flex-row gap-8 p-8 md:p-10 h-full items-center md:items-center">
            {/* Thumbnail Image */}
            <div className="w-40 h-56 md:w-48 md:h-72 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02] duration-300">
              <img
                src={titleDetails.thumbnail}
                alt={titleDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase drop-shadow-md">
                  {titleDetails.name || `MuzeBox ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 py-2">
                  {titleDetails?.generes?.map((genre: any) => (
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
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-8  bg-muted/70 px-4 py-2 rounded-2xl">
                <Stat
                  icon={<Banknote className="text-emerald-400" size={20} />}
                  value={`${titleDetails?.price ?? 0} Ks`}
                  label="Price"
                />
                <Stat
                  icon={
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                  }
                  value={titleDetails?.rating ?? "0"}
                  label="Rating"
                />
                <Stat
                  icon={<Eye className="text-sky-400" size={20} />}
                  value={(titleDetails?.views ?? 0).toLocaleString()}
                  label="Views"
                />
                <Stat
                  icon={<ThumbsUp className="text-rose-400" size={20} />}
                  value={titleDetails?.likes ?? "0"}
                  label="Likes"
                />
              </div>
            </div>
          </div>
        </div>

        {/*  ABOUT SECTION  */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {titleDetails?.description ||
                "No description available for this title."}
            </p>
          </div>
        </div>
        {/*  EPISODE LIST SECTION  */}
        <div className="bg-card border border-border p-5 md:p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Episode Lists</h2>
            <Button
              onClick={() =>
                navigate(
                  `/entertainment/muze-box/episode/create/${id}`,
                  {
                    state: {
                      titleId: id,
                      titleName: titleDetails?.name,
                    },
                  },
                )
              }
              className="rounded-full shadow-lg"
            >
              {t("add_new_episode")}
            </Button>
          </div>

          <div className="grid gap-3">
            {titleDetails?.muze_box_episodes?.length > 0 ? (
              titleDetails.muze_box_episodes.map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center bg-background/40 border border-border p-4 rounded-2xl hover:bg-accent/50 transition-all gap-4"
                >
                  <div className="flex items-center w-full sm:w-auto">
                    <span className="w-6 text-muted-foreground font-mono font-medium">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <img
                      src={ep.thumbnail}
                      alt=""
                      className="w-20 h-14  object-cover mx-4 shadow-md"
                    />
                    <div className="flex-1 sm:hidden">
                      <h4 className="font-bold text-sm">
                        {ep.name || `Episode ${index + 1}`}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        🪙 {ep?.price} Kyats
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="font-bold truncate group-hover:text-primary transition-colors">
                      {ep.name || `Episode ${index + 1}`}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ep.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="hidden sm:inline-block text-sm font-bold text-yellow-600">
                      🪙 {ep?.price}
                    </span>
                    <div className="flex items-center gap-4">
                      {ep?.approve_status === 0 ? (
                        <IconWithTooltip
                          tooltip="Pending"
                          icon={
                            <XCircle className="w-5 h-5 text-destructive" />
                          }
                        />
                      ) : (
                        <IconWithTooltip
                          tooltip="Approved"
                          icon={
                            <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                          }
                        />
                      )}
                      <EpisodeActions
                        episode={ep}
                        titleId={titleDetails?.id}
                        titleName={titleDetails?.name}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl opacity-50">
                <p className="italic">No episodes available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- COMMENTS SECTION --- */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          {/* <h3 className="text-xl font-bold mb-6">Reader Feedback</h3> */}
          <CommentsSection commentsList={commentsList} category="muze-box" />
        </div>
      </div>
    </div>
  );
}

