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
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEpisodeSortingCommand } from "@/composable/Command/Entertainment/Comics/useEpisodeSortingCommand";

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

  const { t } = useTranslation();

  // const { commentsList, isLoading: isCommentsLoading } = useComicsTitleCommentQuery(Number(id));
  const { commentsList, isLoading: isCommentsLoading } = useCommentQuery(
    "comic",
    Number(id),
  );
  const {
    titleDetails: comic,
    isLoading,
    error,
  } = useComicsTitleDetailsQuery(payload);

  const { updateSortingMutation, isPending } = useEpisodeSortingCommand();

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

  const handleSorting = async (episodeId: number, nextSorting: number) => {
    await updateSortingMutation({ type: "comic", episodeId, nextSorting });
  };

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
        <div className="relative overflow-hidden rounded-3xl border border-border min-h-80 bg-zinc-500 dark:bg-zinc-900 shadow-2xl">
          {/* Background Image Layer - Increased blur for readability */}
          <div
            className="absolute inset-0  bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${comic.horizontal_thumbnail})` }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />

          <div className="relative flex flex-col lg:flex-row gap-8 p-8 md:p-10 h-full items-center md:items-center">
            <div className="w-40 h-56 md:w-48 md:h-72 rounded-2xl border border-white/20 overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-[1.02] duration-300">
              <img
                src={comic.thumbnail}
                alt={comic.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center lg:text-left min-w-0 w-full">
              <div className="space-y-4">
                <h1 className="text-2xl lg:text-3xl max-w-xl mx-auto lg:mx-0 font-black tracking-tighter uppercase drop-shadow-md wrap-break-word">
                  {comic.name || `Comic ${id}`}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 py-2">
                  {comic?.generes?.map((genre: any) => (
                    <Badge key={genre?.id} className="bg-primary text-xs">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats Bar - Refactored to Grid for perfect alignment */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-8  bg-muted/70 px-4 py-2 rounded-2xl">
                <Stat
                  icon={<Banknote className="text-emerald-400" size={20} />}
                  value={`${comic?.price ?? 0} Ks`}
                  label={t("price")}
                />
                <Stat
                  icon={
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                  }
                  value={comic?.rating ?? "0"}
                  label={t("rating")}
                />
                <Stat
                  icon={<Eye className="text-sky-400" size={20} />}
                  value={(comic?.views ?? 0).toLocaleString()}
                  label={t("views")}
                />
                <Stat
                  icon={<ThumbsUp className="text-rose-400" size={20} />}
                  value={comic?.likes ?? "0"}
                  label={t("likes")}
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
              {t("description")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {comic?.description || "No description available for this title."}
            </p>
          </div>
        </div>
        {/* --- EPISODE LIST SECTION --- */}
        <div className="bg-card border border-border p-5 md:p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t("episode_list")}</h2>
            <Button
              onClick={() =>
                navigate(`/entertainment/comics/episode/create/${id}`, {
                  state: {
                    titleName: comic?.name,
                  },
                })
              }
              className="rounded-full shadow-lg"
            >
              {t("add_new_episode")}
            </Button>
          </div>

          <div className="grid gap-3">
            {comic.comic_episodes
              .sort((a: any, b: any) => a.sorting - b.sorting)
              .map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-background/40 border border-border p-4 rounded-2xl hover:bg-accent/50 transition-all gap-4"
                >
                  {/* Left side: Index, Thumbnail, and Episode Info Bundle */}
                  <div className="flex items-center gap-4 w-full md:w-auto min-w-0 flex-1">
                    <span className="w-6 text-muted-foreground font-mono font-medium shrink-0">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>

                    <img
                      src={ep.thumbnail}
                      alt=""
                      className="w-20 h-14 object-cover rounded-lg shadow-md shrink-0"
                    />

                    {/* Text Container: Fully visible everywhere with clean truncation */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
                        {ep.name || `Episode ${index + 1}`}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(comic.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Price, Approval Status, Dropdown & Actions */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                    <span className="flex flex-row gap-1 items-center justify-center text-sm font-bold text-yellow-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-500"
                      >
                        <path
                          d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V6.5M2 5V17C2 18.1046 4.46243 19 7.5 19M7.5 11C7.33145 11 7.16468 10.9972 7 10.9918C4.19675 10.9 2 10.0433 2 9M7.5 15C4.46243 15 2 14.1046 2 13M22 11.5C22 12.6046 19.5376 13.5 16.5 13.5C13.4624 13.5 11 12.6046 11 11.5M22 11.5C22 10.3954 19.5376 9.5 16.5 9.5C13.4624 9.5 11 10.3954 11 11.5M22 11.5V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11.5M22 15.25C22 16.3546 19.5376 17.25 16.5 17.25C13.4624 17.25 11 16.3546 11 15.25"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {ep?.price}
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

                      <Select
                        disabled={isPending}
                        value={ep?.sorting.toString()}
                        onValueChange={(value) =>
                          handleSorting(ep?.id, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-15">
                          <SelectValue>{index + 1}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {comic?.comic_episodes?.map(
                              (epi: any, index: number) => (
                                <SelectItem
                                  value={(index + 1).toString()}
                                  key={epi.id}
                                >
                                  {index + 1}
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <EpisodeActions
                        episode={ep}
                        titleId={comic?.id}
                        titleName={comic?.name}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* --- COMMENTS SECTION --- */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          {/* <h3 className="text-xl font-bold mb-6">Reader Feedback</h3> */}
          <CommentsSection commentsList={commentsList} category="comic" />
        </div>
      </div>
    </div>
  );
}
