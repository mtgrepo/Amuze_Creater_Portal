import { useNavigate, useParams } from "react-router-dom";
import {
  DollarSign,
  Star,
  Eye,
  ThumbsUp,
  Loader2,
  XCircle,
  CircleCheckBig,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import IconWithTooltip from "@/components/common/IconWithTooltip";
import { Badge } from "@/components/ui/badge";
import { useMuzeBoxTitleDetailsQuery } from "@/composable/Query/Entertainment/MuzeBox/Title/useMuzeBoxDetailsQuery";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import CommentsSection from "@/components/common/comment_component";
import EpisodeActions from "@/components/Entertainment/MuzeBox/Episode/muzeBox_episode_actions";

export default function MuzeBoxTitleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="cursor-pointer">
          <ArrowLeft size={18} />
        </Button>
        {/*  HEADER / BANNER AREA  */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 opacity-40 blur-md scale-105 bg-cover bg-center"
            style={{
              backgroundImage: `url(${titleDetails.horizontal_thumbnail})`,
            }}
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80" />

          {/* Content Wrapper */}
          <div className="relative flex flex-col md:flex-row gap-8 p-6 md:p-10 items-center md:items-end min-h-80">
            <div className="shrink-0 group">
              <div className="w-36 h-52 md:w-48 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transition-transform group-hover:scale-[1.02] duration-300">
                <img
                  src={titleDetails?.thumbnail}
                  alt={titleDetails?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4 text-center md:text-left w-full items-center">
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-foreground drop-shadow-sm leading-tight">
                {titleDetails?.name}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {titleDetails?.genres?.map((genre: any) => (
                  <Badge
                    key={genre?.id}
                    className="bg-primary text-white border-none"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
              {/* Stats Bar */}
              <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-4 py-3 rounded-2xl bg-background/50 backdrop-blur-md shadow-inner">
                <Stat
                  icon={<DollarSign className="text-blue-500" />}
                  value={`${titleDetails?.price ?? 0} Kyats`}
                />
                <Stat
                  icon={<Star className="text-yellow-500 fill-yellow-500" />}
                  value={`${titleDetails?.rating ?? 0} Rating`}
                />
                <Stat
                  icon={<Eye className="text-blue-500" />}
                  value={`${titleDetails?.views ?? 0} Views`}
                />
                <Stat
                  icon={<ThumbsUp className="text-red-500" />}
                  value={`${titleDetails?.likes ?? 0} Likes`}
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
              Add Episode
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
          <h3 className="text-xl font-bold mb-6">Reader Feedback</h3>
          <CommentsSection commentsList={commentsList} category="muze-box" />
        </div>
      </div>
    </div>
  );
}

// Small helper component for header stats
function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 px-2 first:pl-0">
      <div className="p-1 rounded-md">{icon}</div>
      <span className="text-xs md:text-sm font-bold whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}
