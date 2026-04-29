import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import TitleActions from "@/components/Entertainment/Museum/Museum/title_actions";
import { Button } from "@/components/ui/button";
import { useMuseumDetailQuery } from "@/composable/Query/Entertainment/Museum/useMuseumDetailQuery";
import { format } from "date-fns";
import {
  ArrowLeft,
  CircleCheckBig,
  Eye,
  Loader2,
  Star,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function MuseumDetails() {
  const { id } = useParams();
  const { museumDetail, isDetailPending, error } = useMuseumDetailQuery(
    Number(id),
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isDetailPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading museum details...</p>
      </div>
    );
  }

  if (error || !museumDetail) {
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
            {t("back")}
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${museumDetail.horizontal_thumbnail})`,
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />

          <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10 items-center md:items-end">
            <div className="w-36 h-52 md:w-48 md:h-72 rounded-2xl overflow-hidden shadow-xl border">
              <img
                src={museumDetail.thumbnail}
                alt={museumDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black">
                {museumDetail.name}
              </h1>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Status
                  icon={<Star size={16} />}
                  value={museumDetail.ratings}
                  color="yellow"
                  label="Rating"
                />
                <Status
                  icon={<Eye size={16} />}
                  value={museumDetail.views}
                  color="gray"
                  label="Views"
                />
                <Status
                  icon={<ThumbsUp size={16} />}
                  value={museumDetail.likes}
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
            {t("description")}
          </h3>

          {museumDetail.description ? (
            <LongText text={museumDetail.description} />
          ) : (
            <p className="text-muted-foreground italic">
              No description available.
            </p>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t("title_list")}</h2>

            <Button
              onClick={() =>
                navigate(`/entertainment/museum/${id}/title/create`)
              }
            >
              {t("add_new_title")}
            </Button>
          </div>

          <div className="grid gap-3">
            {museumDetail?.museum_title &&
            museumDetail.museum_title.length > 0 ? (
              museumDetail.museum_title.map((title: any, index: number) => (
                <div
                  key={title.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-2xl hover:bg-accent/50 bg-background/40 transition"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-muted-foreground w-6">
                      {index + 1}
                    </span>

                    <img
                      src={title.thumbnail}
                      className="w-20 h-14 object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {title.name || `Title ${index + 1}`}
                    </h4>

                    <p className="text-xs text-muted-foreground">
                      {format(new Date(title.created_at), "yyyy-MM-dd")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    {title?.approve_status === 0 ? (
                      <IconWithTooltip
                        tooltip="Unapproved"
                        icon={<XCircle className="w-5 h-5 text-destructive" />}
                      />
                    ) : (
                      <IconWithTooltip
                        tooltip="Approved"
                        icon={
                          <CircleCheckBig className="w-5 h-5 text-emerald-500" />
                        }
                      />
                    )}

                    <TitleActions title={title} museumId={museumDetail.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed rounded-2xl">
                <p className="text-muted-foreground italic">
                  No titles available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
