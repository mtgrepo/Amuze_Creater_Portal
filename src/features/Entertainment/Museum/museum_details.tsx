import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import TitleActions from "@/components/Entertainment/Museum/Museum/title_actions";
import { Button } from "@/components/ui/button";
import { useMuseumDetailQuery } from "@/composable/Query/Entertainment/Museum/useMuseumDetailQuery";
import router from "@/router/routes";
import { format } from "date-fns";
import { CircleCheckBig, Eye, Star, ThumbsUp, XCircle } from "lucide-react";
import { useParams } from "react-router-dom";

export default function MuseumDetails() {
  const { id } = useParams();
  const { museumDetail } = useMuseumDetailQuery(Number(id));

  if(isDetailPending){
    <div>loading...</div>
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner / Header Area */}
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center dark:opacity-30 opacity-50"
            style={{
              backgroundImage: `url(${museumDetail?.horizontal_thumbnail})`,
            }}
          ></div>
          <div className="absolute inset-0 "></div>
          {/* Content Overlay */}
          <div className="relative flex p-6 ">
            {/* Vertical Poster */}
            <img
              src={museumDetail?.thumbnail}
              alt={museumDetail?.name}
              className="w-32 md:w-48 h-60 rounded-lg shadow-2xl border border-gray-700 object-cover"
            />

            <div className="ml-4 space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold">
                {museumDetail?.name}
              </h1>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 flex-wrap">
                <Status
                  icon={<Star size={16} />}
                  value={museumDetail?.ratings}
                  color={"yellow"}
                  label={"Rating"}
                />
                <Status
                  icon={<Eye size={16} />}
                  value={museumDetail?.views}
                  color={"gray"}
                  label={"Views"}
                />
                <Status
                  icon={<ThumbsUp size={16} />}
                  value={museumDetail?.likes}
                  color={"blue"}
                  label={"Likes"}
                />
              </div>

              <div className="flex gap-2">
                <h3 className="text-sm">Description:</h3>
                {museumDetail?.description ? (
                  <LongText text={museumDetail?.description} />
                ) : (
                  <p className="text-sm italic">"No description"</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Episode List Section */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Title Lists</h2>
            <Button
              onClick={() =>
                router.navigate(`/entertainment/museum/${id}/title/create`)
              }
              className="cursor-pointer bg-primary px-6 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {museumDetail?.museum_title &&
            museumDetail?.museum_title?.length > 0 ? (
              museumDetail.museum_title.map((title: any, index: number) => (
                <div
                  key={title.id}
                  className="flex items-center  border border-border p-3 rounded-xl  transition-colors"
                >
                  <span className="w-8 text-gray-500 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={title.thumbnail}
                    alt=""
                    className="w-12 h-12 rounded object-cover mx-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {title.name || `titleisode ${index + 1}`}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {format(new Date(title.created_at), "yyyy-MM-dd")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 px-4">

                    <div className="text-green-500 text-xl">
                      {title?.approve_status === 0 ? (
                        <IconWithTooltip
                          tooltip="Unapproved"
                          icon={<XCircle className="w-4 h-4 text-red-500" />}
                        />
                      ) : (
                        <IconWithTooltip
                          tooltip="Approved"
                          icon={
                            <CircleCheckBig className="w-4 h-4 text-green-500" />
                          }
                        />
                      )}
                    </div>
                      <TitleActions title={title} museumId={museumDetail?.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500 italic">
                  No episodes available for "{museumDetail?.name}" yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
