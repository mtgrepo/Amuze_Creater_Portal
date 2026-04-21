import { useComicsTitleDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleDetailsQuery";
import { decryptAuthData } from "@/lib/helper";
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
import EpisodeActions from "@/components/Entertainment/Comics/Episodes/episode_actions";
import { Badge } from "@/components/ui/badge";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import CommentsSection from "@/components/common/comment_component";
import Stat from "@/components/common/details_stat";

export default function ComicsTitleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const authData = localStorage.getItem("creator");
  const loginCreator = authData ? decryptAuthData(authData) : null;
  const creator = loginCreator?.creator;

  const payload = {
    id: id!,
    roleId: Number(creator?.role_id) || 0,
    userId: Number(creator?.id) || 0,
  };

  // const { commentsList, isLoading: isCommentsLoading } = useComicsTitleCommentQuery(Number(id));
  const { commentsList, isLoading: isCommentsLoading } = useCommentQuery('comic', Number(id));
  const { titleDetails: comic, isLoading, error } = useComicsTitleDetailsQuery(payload);

  if (isLoading || isCommentsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Oops!</h2>
          <p className="text-muted-foreground">Failed to load comic details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <Button
         className="cursor-pointer"
          onClick={() => navigate("/entertainment/comics")}
          variant="ghost"
          >
            <ArrowLeft />
            Back to Comics
          </Button>
        {/* --- HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-500 dark:bg-zinc-900 shadow-2xl">
          {/* Background Image Layer - Increased blur for readability */}
          <div
            className="absolute inset-0 opacity-40 blur-xl scale-110 bg-cover bg-center"
            style={{ backgroundImage: `url(${comic.thumbnail})` }}
          />

          {/* Dark Gradient Overlay - Vital for text contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />

          {/* Content Wrapper - items-center fixes the vertical alignment */}
          <div className="relative flex flex-col md:flex-row gap-8 p-8 md:p-10 h-full items-center md:items-center">
            {/* Thumbnail Image */}
            <div className="w-40 h-56 md:w-48 md:h-72 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02] duration-300">
              <img
                src={comic.thumbnail}
                alt={comic.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase text-white drop-shadow-md">
                  {comic.name || `Novel ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 py-2">
                  {comic?.generes?.map((genre: any) => (
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
                  value={`${comic?.price ?? 0} Ks`}
                  label="Price"
                />
                <Stat
                  icon={
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                  }
                  value={comic?.rating ?? "0"}
                  label="Rating"
                />
                <Stat
                  icon={<Eye className="text-sky-400" size={20} />}
                  value={(comic?.views ?? 0).toLocaleString()}
                  label="Views"
                />
                <Stat
                  icon={<ThumbsUp className="text-rose-400" size={20} />}
                  value={comic?.likes ?? "0"}
                  label="Likes"
                />
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
              {comic?.description || "No description available for this title."}
            </p>
          </div>
        </div>
        {/* --- EPISODE LIST SECTION --- */}
        <div className="bg-card border border-border p-5 md:p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Episode Lists</h2>
            <Button
              onClick={() => navigate(`/entertainment/comics/episode/create/${id}`, {
                state: {
                  titleName: comic?.name
                }
              })}
              className="rounded-full shadow-lg"
            >
              Add Episode
            </Button>
          </div>

          <div className="grid gap-3">
            {comic?.comic_episodes?.length > 0 ? (
              comic.comic_episodes.map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center bg-background/40 border border-border p-4 rounded-2xl hover:bg-accent/50 transition-all gap-4"
                >
                  <div className="flex items-center w-full sm:w-auto">
                    <span className="w-6 text-muted-foreground font-mono font-medium">{(index + 1).toString().padStart(2, '0')}</span>
                    <img src={ep.thumbnail} alt="" className="w-20 h-14  object-cover mx-4 shadow-md" />
                    <div className="flex-1 sm:hidden">
                      <h4 className="font-bold text-sm">{ep.name || `Episode ${index + 1}`}</h4>
                      <p className="text-[10px] text-muted-foreground">🪙 {ep?.price} Kyats</p>
                    </div>
                  </div>

                  <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="font-bold truncate group-hover:text-primary transition-colors">{ep.name || `Episode ${index + 1}`}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(comic.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="hidden sm:inline-block text-sm font-bold text-yellow-600">🪙 {ep?.price}</span>
                    <div className="flex items-center gap-4">
                      {ep?.approve_status === 0 ? (
                        <IconWithTooltip tooltip="Pending" icon={<XCircle className="w-5 h-5 text-destructive" />} />
                      ) : (
                        <IconWithTooltip tooltip="Approved" icon={<CircleCheckBig className="w-5 h-5 text-emerald-500" />} />
                      )}
                      <EpisodeActions episode={ep} titleId={comic?.id} titleName={comic?.name}/>
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
          <CommentsSection commentsList={commentsList} category="comic"/>
        </div>
      </div>
    </div>
  );
}
