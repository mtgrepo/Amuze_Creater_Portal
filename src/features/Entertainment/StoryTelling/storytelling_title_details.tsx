import CommentsSection from "@/components/common/comment_component";
import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import EpisodeActions from "@/components/Entertainment/StoryTelling/Episodes/episode_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStoryTellingSortingUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useSortingUpdateCommand";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import { useStoryTellingTitleDetailsQuery } from "@/composable/Query/Entertainment/StoryTelling/useStorytTellingTitleDetailsQuery";
import {
  ArrowLeft,
  CircleCheckBig,
  Eye,
  Loader2,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StoryTellingTitleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    storyTellingTitleDetails: story,
    isTitleLoading,
    error,
  } = useStoryTellingTitleDetailsQuery(Number(id));

  const { commentsList } = useCommentQuery("story", Number(id));
  const { updateSortingMutation, isPending } = useStoryTellingSortingUpdateCommand();

  if (isTitleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading storytelling details...</p>
      </div>
    );
  }
  const handleSorting = async (episodeId: number, nextSorting: number) => {
    await updateSortingMutation({ type: "story", episodeId, nextSorting });
  };

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <XCircle className="w-10 h-10 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Failed to load details</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <div
            className="absolute inset-0  bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${story.horizontal_thumbnail})` }}
          />

          <div
            className="absolute inset-0 
  bg-linear-to-t 
  from-background via-background/30 to-transparent"
          />
          <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10 items-center md:items-end">
            <div className="w-36 h-52 md:w-48 md:h-72 rounded-2xl overflow-hidden shadow-xl border">
              <img
                src={story.thumbnail}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black">{story.name}</h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {story.generes?.map((g: any) => (
                  <Badge key={g.id}>{g.name}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Status
                  icon={<Star size={16} />}
                  value={story.rating}
                  color="yellow"
                  label="Rating"
                />
                <Status
                  icon={<Eye size={16} />}
                  value={story.views}
                  color="gray"
                  label="Views"
                />
                <Status
                  icon={<ThumbsUp size={16} />}
                  value={story.likes}
                  color="blue"
                  label="Likes"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Description
          </h3>
          {story.description ? (
            <LongText text={story.description} />
          ) : (
            <p className="text-muted-foreground italic">
              No description available.
            </p>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Episodes</h2>
            <Button
              onClick={() =>
                navigate(`/entertainment/storytelling/${id}/episode/create`, {
                  state: { titleName: story.name, titleId: story.id },
                })
              }
            >
              Add Episode
            </Button>
          </div>

          <div className="grid gap-3">
            {story?.story_episodes && story.story_episodes?.length > 0 ? (
              story.story_episodes
                .sort((a, b) => a.sorting - b.sorting)
                .map((ep, index) => (
                  <div
                    key={ep.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-2xl hover:bg-accent/50 bg-background/40 transition"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <img
                        src={ep.thumbnail}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {ep.name || `Episode ${index + 1}`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(story.created_at!).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                      <span className="text-yellow-600 text-sm">
                        🪙 {ep.price}
                      </span>

                      {ep.approve_status === 0 ? (
                        <IconWithTooltip
                          tooltip="Unapproved"
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
                            {story?.story_episodes?.map(
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
                        titleId={story.id}
                        titleName={story.name}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-16 border border-dashed rounded-2xl">
                <p className="text-muted-foreground italic">No episodes yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Reader Feedback</h3>
          <CommentsSection category="story" commentsList={commentsList} />
        </div>
      </div>
    </div>
  );
}
