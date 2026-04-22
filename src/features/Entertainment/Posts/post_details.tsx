import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Eye,
  X,
} from "lucide-react";
import { usePostDetailQuery } from "@/composable/Query/Entertainment/Posts/usePostDetailQuery";
import LongText from "@/components/common/longtext";
import CommentsSection from "@/components/common/comment_component";
import { useCommentQuery } from "@/composable/Query/Comment/useCommentQuery";
// import { ImageCardSkeleton } from "@/components/ImageCardSkeleton";

const PostsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { postDetail, isDetailPending, error } = usePostDetailQuery(Number(id));

  const { commentsList } = useCommentQuery("post", Number(id));

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-destructive">
            Failed to load post
          </h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </Button>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

          {
            isDetailPending ? (
              <span>loading...</span>
              // <ImageCardSkeleton />
            ) : (
              postDetail && (
                <>
                  {postDetail.is_banned && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
                      <h2 className="text-red-600 font-semibold">
                        This post is banned
                      </h2>
                      <p className="text-sm text-red-500 mt-1">
                        <LongText text={postDetail.ban_reason || "No reason provided"} />
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={postDetail.user.profile ?? ""} />
                        <AvatarFallback>
                          {postDetail.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{postDetail.user.name}</h3>

                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(postDetail.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-muted/40 rounded-2xl p-4">
                    {postDetail?.description ?
                      (
                        <LongText text={postDetail.description} />
                      ) : (
                        <span className="italic text-sm text-muted-foreground">No description</span>
                      )
                    }
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {postDetail.media.map((item) => (
                      <div
                        key={item.url}
                        className="group rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition"
                      >
                        {/* MEDIA */}
                        <div className="relative h-40 w-full overflow-hidden bg-muted">
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              onClick={() => setActiveImage(item.url)}
                              className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div className="p-3 space-y-1">
                          <p className="text-xs text-muted-foreground ">
                            {item.alt ? (
                              <LongText text={item.alt} />
                            ) : (
                              <span className="italic">No description</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-6 pt-4 border-t text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Heart size={16} />
                      {postDetail.like_count}
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      {postDetail.comment_count}
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      {postDetail.views}
                    </div>

                  </div>

                </>
              )
            )}
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Reader Feedback</h3>
          <CommentsSection category="post" commentsList={commentsList} />
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-2 right-2 bg-white text-black rounded-full p-1"
              onClick={() => setActiveImage(null)}
            >
              <X size={18} />
            </button>

            <img
              src={activeImage}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsDetailPage;