import { Button } from "@/components/ui/button";
import { useComicsTitleCommentQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleCommentQuery";
import { decryptAuthData } from "@/lib/helper";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useComicsCommentDelCommand } from "../../../../composable/Command/Entertainment/Comics/useComicsCommentDelCommand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CommentsSection = () => {
  const { id } = useParams();
  const [replyToId, setReplyToId] = useState(null);

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;

  const { commentsList, isLoading } = useComicsTitleCommentQuery(Number(id!));
  const { deleteCommentMutation, isPending } = useComicsCommentDelCommand();
  // Helper to get initials for avatar
  const getAvatar = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const handleDelete = async (id: number) => {
    await deleteCommentMutation(id);
    console.log("Deleting comment:", id);
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-500">Loading comments...</div>
    );
  }

  // Ensure we have an array to map over
  const comments = commentsList || [];

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">
          Comments{" "}
          <span className="text-gray-500 font-normal ml-2">
            {comments.length}
          </span>
        </h2>
      </div>

      <div className="space-y-5 border border-border p-4 rounded-lg">
        {comments.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No comments yet.</p>
        ) : (
          comments.map((comment: any) => {
            // Check if the comment belongs to the logged-in creator
            const isCommentAuthor = comment.user?.id === creatorId;

            return (
              <div key={comment.id} className="relative border border-border rounded-lg p-4">
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${isCommentAuthor
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-400"
                      }`}
                  >
                    {getAvatar(comment.user?.name)}
                  </div>

                  <div className="flex- ">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold ${isCommentAuthor ? "text-yellow-500" : "text-white"}`}
                      >
                        {
                          comment.user?.name ||
                          "Unknown User"}
                      </span>
                      {isCommentAuthor && (
                        <span className="bg-yellow-500/10 text-yellow-500 text-[9px] px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold uppercase">
                          Author
                        </span>
                      )}
                      <span className="text-[10px] text-gray-600 font-medium ml-2">
                        {new Date(comment.created_date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {comment.comment}
                    </p>

                    {/*  ACTION BUTTONS  */}
                    <div className="flex items-center gap-6">
                      <Button
                        onClick={() => setReplyToId(comment.id)}
                        variant={'link'}
                        className="cursor-pointer"
                      >
                        Reply
                      </Button>

                      {/* Only Author of the comic OR the comment creator can delete */}

                      {isCommentAuthor && (

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button

                              variant={'link'}
                              className="cursor-pointer text-destructive"
                              disabled={isPending}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(comment.id)} variant={'destructive'}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                    </div>

                    {/*  NESTED REPLIES  */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-900 space-y-6">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${reply.user_id === creatorId
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800"
                                }`}
                            >
                              {getAvatar(reply.user_name)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-xs font-bold ${reply.user_id === creatorId ? "text-yellow-500" : "text-white"}`}
                                >
                                  {reply.user_name}
                                </span>
                                <span className="text-[9px] text-gray-700 font-medium">
                                  {new Date(
                                    reply.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-400 text-xs leading-relaxed">
                                {reply.comment_text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/*  REPLY INPUT BOX  */}
                    {replyToId === comment.id && (
                      <div className="mt-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
                        <input
                          autoFocus
                          className="bg-transparent border-b border-gray-800 py-2 text-sm text-blue-400 outline-none focus:border-blue-500 transition"
                          placeholder="Write a reply..."
                        />
                        <div className="flex gap-3 justify-end">
                          <Button
                            onClick={() => setReplyToId(null)}
                            className="text-[10px] text-gray-500 font-bold uppercase"
                          >
                            Cancel
                          </Button>
                          <Button className="text-[10px] text-primary font-bold uppercase">
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default CommentsSection;
