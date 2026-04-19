import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import EpisodeActions from "@/components/Entertainment/StoryTelling/Episodes/episode_actions";
import { Button } from "@/components/ui/button";
import { useMuseumTitleDetailsQuery } from "@/composable/Query/Entertainment/Museum/useMuseumTitleDetailQuery";
import router from "@/router/routes";
import { CircleCheckBig, Eye, Loader2, Star, ThumbsUp, XCircle } from "lucide-react";
import { useParams } from "react-router-dom"

export default function MuseumTitleDetails () {
    const {id} = useParams();
    const {titleDetails, isTitleLoading, error} = useMuseumTitleDetailsQuery(Number(id));

      if (isTitleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading title details...</p>
      </div>
    );
  }

  if (error || !titleDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-gray-400">
            Failed to load title details. Please refresh or try again.
          </p>
        </div>
      </div>
    );
  }
    return(
        <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner / Header Area */}
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center dark:opacity-30 opacity-50"
            style={{ backgroundImage:  "var(--card-foreground)"}}
          >
          </div>
          <div className="absolute inset-0 "></div>
          {/* Content Overlay */}
          <div className="relative flex p-6 ">
            {/* Vertical Poster */}
            <img
              src={titleDetails?.thumbnail}
              alt={titleDetails?.name}
              className="w-32 md:w-48 h-60 rounded-lg shadow-2xl border border-gray-700 object-cover"
            />

            <div className="ml-4 space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold">
                {titleDetails?.name}
              </h1>

              {/* Stats Bar */}
               <div className="flex items-center gap-6 flex-wrap">
                <Status icon={<Star size={16} />} value={titleDetails?.ratings} color={"yellow"} label={"Rating"} />
                <Status icon={<Eye size={16} />} value={titleDetails?.views} color={"gray"} label={"Views"} />
                <Status icon={<ThumbsUp size={16} />} value={titleDetails?.likes} color={"blue"} label={"Likes"} />
              </div>

              <div className="flex gap-2">
                <h3 className="text-sm">Description:</h3>
                {titleDetails?.description ? (
                    <LongText text={titleDetails?.description}/>
                ): (
                    <p className="text-sm italic">"No description"</p>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Episode List Section */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Episode Lists</h2>
            <Button
              onClick={() =>
                router.navigate(`/entertainment/storytelling/${id}/episode/create`)
              }
              className="cursor-pointer bg-primary px-6 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {titleDetails?.museum_episodes && titleDetails?.museum_episodes?.length > 0 ? (
             titleDetails.museum_episodes.map((ep: any, index: number) => (
                <div
                  key={ep.id}
                  className="flex items-center  border border-border p-3 rounded-xl  transition-colors"
                >
                  <span className="w-8 text-gray-500 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={ep.thumbnail}
                    alt=""
                    className="w-12 h-12 rounded object-cover mx-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {ep.name || `Episode ${index + 1}`}
                    </h4>
    
                  </div>    
                  <div className="flex items-center gap-4 px-4">
                    <span className="text-yellow-500 text-sm">
                      🪙 {ep?.price}
                    </span>
                   
                    <div className="text-green-500 text-xl">
                      {ep?.approve_status === 0 ? (
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
                    <button className="text-gray-500 hover:text-white">
                      <EpisodeActions episode={ep} titleId={titleDetails?.id} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500 italic">
                  No episodes available for "{titleDetails?.name}" yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
    )
}