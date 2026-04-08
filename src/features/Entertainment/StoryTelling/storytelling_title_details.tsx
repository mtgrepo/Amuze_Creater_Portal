import CommentsSection from "@/components/common/comment_component";
import IconWithTooltip from "@/components/common/IconWithTooltip";
import LongText from "@/components/common/longtext";
import { Status } from "@/components/common/status";
import EpisodeActions from "@/components/Entertainment/StoryTelling/Episodes/episode_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
import { useStoryTellingTitleDetailsQuery } from "@/composable/Query/Entertainment/StoryTelling/useStorytTellingTitleDetailsQuery"
import router from "@/router/routes";
import { CircleCheckBig, Eye, Loader2, Star, ThumbsUp, XCircle } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom"

export default function StoryTellingTitleDetails () {
    const {id} = useParams();
    const {storyTellingTitleDetails : story, isTitleLoading, error} = useStoryTellingTitleDetailsQuery(Number(id));
  const { commentsList } = useCommentQuery('story',Number(id));
      if (isTitleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-gray-400">
            Failed to load storytelling details. Please refresh or try again.
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
            style={{ backgroundImage: `url(${story?.horizontal_thumbnail})` }}
          >
          </div>
          <div className="absolute inset-0 "></div>
          {/* Content Overlay */}
          <div className="relative flex p-6 ">
            {/* Vertical Poster */}
            <img
              src={story?.thumbnail}
              alt={story?.name}
              className="w-32 md:w-48 h-60 rounded-lg shadow-2xl border border-gray-700 object-cover"
            />

            <div className="ml-4 space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold">
                {story?.name}
              </h1>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {story?.generes?.map((genre: any) => (
                  <Badge key={genre?.id}>{genre.name}</Badge>
                ))}
              </div>

              {/* Stats Bar */}
               <div className="flex items-center gap-6 flex-wrap">
                <Status icon={<Star size={16} />} value={story?.rating} color={"yellow"} label={"Rating"} />
                <Status icon={<Eye size={16} />} value={story?.views} color={"gray"} label={"Views"} />
                <Status icon={<ThumbsUp size={16} />} value={story?.likes} color={"blue"} label={"Likes"} />
              </div>

              <div className="flex gap-2">
                <h3 className="text-sm">Description:</h3>
                {story?.description ? (
                    <LongText text={story?.description}/>
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
            {story?.story_episodes && story?.story_episodes?.length > 0 ? (
              story.story_episodes.map((ep: any, index: number) => (
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
                        <p className="text-xs text-gray-500">
                        {new Date(story.created_at!).toLocaleDateString()}
                        </p>
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
                      <EpisodeActions episode={ep} titleId={story?.id} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500 italic">
                  No episodes available for "{story?.name}" yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CommentsSection category={"story"} commentsList={commentsList}/>
        </div>
    )
}