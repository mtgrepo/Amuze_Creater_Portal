import Stat from "@/components/common/details_stat";
import { Button } from "@/components/ui/button";
import { useMuseumEpisodeDetailsQuery } from "@/composable/Query/Entertainment/Museum/useMuseumEpisodeDetailsQuery";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function MuseumEpisodeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { museumId, titleId } = useParams();

  const { episodeDetails, isEpisodeLoading } = useMuseumEpisodeDetailsQuery(
    Number(id),
  );

  if (isEpisodeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading episode details...</p>
      </div>
    );
  }

  if (!episodeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Episode details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/entertainment/museum/${museumId}/title/details/${titleId}`,
              )
            }
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} />
            {t("back")}
          </Button>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-36 h-52 md:w-48 md:h-72 rounded-2xl overflow-hidden shadow-xl border    ">
            <img
              src={episodeDetails.thumbnail}
              alt={episodeDetails.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black">
              {episodeDetails.name || `Episode ${id}`}
            </h1>

            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-8  bg-muted/70 px-4 py-3 rounded-2xl">
              <Stat
                icon={<Eye className="text-sky-400" size={20} />}
                value={(episodeDetails?.views ?? 0).toLocaleString()}
                label="Views"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            {t("images")}
          </h3>

          {episodeDetails.files_path?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {episodeDetails.files_path.map((file: any) => (
                <div
                  key={file.id}
                  className="group rounded-xl overflow-hidden border bg-background shadow-sm hover:shadow-md transition"
                >
                  <div className="overflow-hidden">
                    <img
                      src={file.image}
                      alt="Episode"
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-3 space-y-1">
                    <div className="text-sm font-medium line-clamp-1">
                      {file.label ? (
                        <span
                          dangerouslySetInnerHTML={{ __html: file.label }}
                        />
                      ) : (
                        <span className="text-muted-foreground italic">
                          No Label
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {file.description ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: file.description,
                          }}
                        />
                      ) : (
                        <span className="italic">No Description</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-2xl">
              <p className="text-muted-foreground italic">
                No images available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
