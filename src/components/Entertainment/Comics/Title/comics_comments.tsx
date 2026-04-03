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
} from "@/components/ui/alert-dialog";
import { useComicStoreCommentCommand } from "../../../../composable/Command/Entertainment/Comics/useComicStoreCommentCommand";

const CommentsSection = () => {
  const { id } = useParams();
  const comicId = Number(id!);

  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;

  const { commentsList, isLoading } = useComicsTitleCommentQuery(comicId);
  const { deleteCommentMutation, isPending } = useComicsCommentDelCommand();
  const { storeCommentMutation, isPending: isStorePending } = useComicStoreCommentCommand();

  const getAvatar = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const handleDelete = async (id: number) => {
    await deleteCommentMutation(id);
  };

  const handleReply = async (parentId: number) => {
    const text = replyTexts[parentId];
    if (!text?.trim()) return;

    await storeCommentMutation({
      comicId,
      parentId,
      comment: text,
    });

    setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
    setReplyToId(null);
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-500">Loading comments...</div>
    );
  }

  const comments = commentsList || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">
          Comments <span className="text-gray-500 ml-2">{comments.length}</span>
        </h2>
      </div>

      <div className="space-y-5 border border-border p-4 rounded-lg">
        {comments.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No comments yet.</p>
        ) : (
          comments.map((comment: any) => {
            const isCommentAuthor = comment.user?.id === creatorId;

            return (
              <div key={comment.id} className="border border-border rounded-lg p-4">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${isCommentAuthor ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
                      }`}
                  >
                    {getAvatar(comment.user?.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold ${isCommentAuthor ? "text-yellow-500" : "text-white"
                          }`}
                      >
                        {comment.user?.name || "Unknown User"}
                      </span>

                      {isCommentAuthor && (
                        <span className="text-[9px] text-yellow-500 border px-1 rounded">
                          Author
                        </span>
                      )}

                      <span className="text-[10px] text-gray-600 ml-2">
                        {new Date(comment.created_date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{comment.comment}</p>

                    <div className="flex gap-4">
                      <Button variant="link" onClick={() => setReplyToId(comment.id)}>
                        Reply
                      </Button>

                      {isCommentAuthor && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-destructive" disabled={isPending}>
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(comment.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    {comment.reply?.length > 0 && (
                      <div className="mt-4 ml-6 border-l pl-4 space-y-3">
                        {comment.reply.map((reply: any) => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                              {getAvatar(reply.user?.name)}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{reply.user?.name}</p>
                              <p className="text-xs text-gray-400">{reply.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyToId === comment.id && (
                      <div className="mt-3 flex flex-col gap-2">
                        <input
                          autoFocus
                          value={replyTexts[comment.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          className="border-b bg-transparent text-sm outline-none"
                          placeholder="Write a reply..."
                        />

                        <div className="flex gap-2 justify-end">
                          <Button onClick={() => setReplyToId(null)} variant={'outline'}>Cancel</Button>
                          <Button
                            onClick={() => handleReply(comment.id)}
                            disabled={isStorePending}
                          >
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
