import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import EpisodeActions from "@/components/Entertainment/Museum/Episodes/episode_actions";
import { Button } from "@/components/ui/button";
import { useMuseumTitleDetailsQuery } from "@/composable/Query/Entertainment/Museum/useMuseumTitleDetailQuery";
import router from "@/router/routes";
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

export default function MuseumTitleDetails() {
  const { museumId, titleId } = useParams();
  const navigate = useNavigate();

  const { titleDetails, isTitleLoading, error } =
    useMuseumTitleDetailsQuery(Number(titleId));

  if (isTitleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading title details...</p>
      </div>
    );
  }

  if (error || !titleDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">

            <div className="w-36 h-52 md:w-48 md:h-72 rounded-2xl overflow-hidden shadow-xl border">
              <img
                src={titleDetails.thumbnail}
                alt={titleDetails.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black">
                {titleDetails.name}
              </h1>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Status icon={<Star size={16} />} value={titleDetails.ratings} color="yellow" label="Rating" />
                <Status icon={<Eye size={16} />} value={titleDetails.views} color="gray" label="Views" />
                <Status icon={<ThumbsUp size={16} />} value={titleDetails.likes} color="blue" label="Likes" />
              </div>
            </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Description
          </h3>

          {titleDetails.description ? (
            <LongText text={titleDetails.description} />
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
                router.navigate(
                  `/entertainment/museum/${museumId}/title/${titleId}/episode/create`
                )
              }
            >
              Add Episode
            </Button>
          </div>

          <div className="grid gap-3">
            {titleDetails?.museum_episodes?.length > 0 ? (
              titleDetails.museum_episodes.map((ep: any, index: number) => {
                const approved = ep?.approve_status;
                const published = ep?.is_publish;

                let tooltip = "";
                let icon = null;

                if (approved === 1 && published) {
                  tooltip = "Approved & Published";
                  icon = <CircleCheckBig className="w-5 h-5 text-emerald-500" />;
                } else if (approved === 1 && !published) {
                  tooltip = "Approved (Not Published)";
                  icon = <CircleCheckBig className="w-5 h-5 text-yellow-500" />;
                } else {
                  tooltip = "Not Approved";
                  icon = <XCircle className="w-5 h-5 text-destructive" />;
                }

                return (
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
                        {new Date(ep.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">

                      <IconWithTooltip tooltip={tooltip} icon={icon} />

                      <EpisodeActions
                        episode={ep}
                        museumId={titleDetails.museum_id}
                        titleId={titleDetails.id}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 border border-dashed rounded-2xl">
                <p className="text-muted-foreground italic">
                  No episodes available yet.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}