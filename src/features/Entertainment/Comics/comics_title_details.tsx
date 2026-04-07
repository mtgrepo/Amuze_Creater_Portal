import CommentsSection from "@/components/Entertainment/Comics/Title/comics_comments";
import { useComicsTitleDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleDetailsQuery";
import { decryptAuthData } from "@/lib/helper";
import { useParams } from "react-router-dom";
import {
  DollarSign,
  Star,
  Eye,
  ThumbsUp,
  Loader2,
  XCircle,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import router from "@/router/routes";
import IconWithTooltip from "@/components/common/IconWithTooltip";
import EpisodeActions from "@/components/Entertainment/Comics/Episodes/episode_actions";
import { Badge } from "@/components/ui/badge";

export default function ComicsTitleDetails() {
  const { id } = useParams();

  const authData = localStorage.getItem("creator");
  const loginCreator = authData ? decryptAuthData(authData) : null;
  const creator = loginCreator?.creator;

  const userId = Number(creator?.id) || 0;
  const roleId = Number(creator?.role_id) || 0;

  const payload = {
    id: id!,
    roleId: roleId,
    userId: userId,
  };

  const {
    titleDetails: comic,
    isLoading,
    error,
  } = useComicsTitleDetailsQuery(payload);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading comic details...</p>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-gray-400">
            Failed to load comic details. Please refresh or try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner / Header Area */}
        <div className="relative w-full max-w-7xl mx-auto h-80 md:h-96 overflow-hidden">
          {" "}
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center dark:opacity-30 opacity-50"
            style={{ backgroundImage: `url(${comic?.horizontal_thumbnail})` }}
          ></div>
          <div className="absolute inset-0 "></div>
          {/* Content Overlay */}
          <div className="relative flex p-6 max-w-7xl mx-auto h-full items-end gap-6">
            {/* Vertical Poster */}
            <img
              src={comic?.thumbnail}
              alt={comic?.name}
              className="w-32 md:w-48 h-60 rounded-lg shadow-2xl border border-gray-700 object-cover"
            />

            <div className="flex-1 pb-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-10">
                {comic?.name}
              </h1>
              {/* <p className="text-gray-400 mb-4">By {comic?. || "Unknown Creator"}</p> */}

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {comic?.generes?.map((genre: any) => (
                  <Badge key={genre?.id}>{genre.name}</Badge>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium ">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1.5 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <span>{comic?.price ?? 0} Kyats</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span>{comic?.rating ?? 0} Rating</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1.5 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <span>{comic?.views ?? 0} Views</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-red-500/20 p-1.5 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-red-500" />
                  </div>
                  <span>{comic?.likes ?? 0} Likes</span>
                </div>
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
                router.navigate(`/entertainment/comics/episode/create/${id}`)
              }
              className="cursor-pointer bg-primary px-6 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {comic?.comic_episodes?.length > 0 ? (
              comic.comic_episodes.map((ep: any, index: number) => (
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
                      {new Date(comic.created_at).toLocaleDateString()}
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
                      <EpisodeActions episode={ep} titleId={comic?.id} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500 italic">
                  No episodes available for "{comic?.name}" yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <CommentsSection />
    </div>
  );
}
