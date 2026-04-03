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

  const renderReplies = (replies: any[]) => {
    return (
      <div className="mt-4 ml-6 border-l pl-4 space-y-3">
        {replies.map((reply: any) => {
          const isAuthor = reply.user?.id === creatorId;

          return (
            <div key={reply.id} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                  {getAvatar(reply.user?.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold ${isAuthor ? "text-yellow-500" : "text-white"}`}>
                      {reply.user?.name}
                    </p>

                    {isAuthor && (
                      <span className="text-[9px] text-yellow-500 border px-1 rounded">
                        You
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">{reply.comment}</p>

                  <div className="flex gap-3 mt-1">
                    <Button variant="link" size="sm" onClick={() => setReplyToId(reply.id)}>
                      Reply
                    </Button>

                    {isAuthor && (

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-destructive cursor-pointer"
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
                            <AlertDialogCancel variant={'outline'}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(reply.id)}

                            >Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    )}
                  </div>

                  {/* nested replies recursively */}
                  {reply.reply?.length > 0 && renderReplies(reply.reply)}

                  {replyToId === reply.id && (
                    <div className="mt-2 flex flex-col gap-2">
                      <input
                        autoFocus
                        value={replyTexts[reply.id] || ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({
                            ...prev,
                            [reply.id]: e.target.value,
                          }))
                        }
                        className="border-b bg-transparent text-xs outline-none"
                        placeholder="Write a reply..."
                      />

                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => setReplyToId(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(reply.id)}
                          disabled={isStorePending}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  const comments = commentsList || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>

      <div className="space-y-5 border p-4 rounded-lg">
        {comments.map((comment: any) => {
          const isAuthor = comment.user?.id === creatorId;

          return (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  {getAvatar(comment.user?.name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isAuthor ? "text-yellow-500" : "text-white"}`}>
                      {comment.user?.name}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mt-1">{comment.comment}</p>

                  <div className="flex gap-4 mt-2">
                    <Button variant="link" onClick={() => setReplyToId(comment.id)}>
                      Reply
                    </Button>

                    {isAuthor && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="link"
                            className="text-destructive cursor-pointer"
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
                            <AlertDialogCancel variant={'outline'}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(comment.id)}
                            >Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    )}
                  </div>

                  {comment.reply?.length > 0 && renderReplies(comment.reply)}

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
                        <Button onClick={() => setReplyToId(null)}>Cancel</Button>
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
        })}
      </div>
    </div>
  );
};

export default CommentsSection;