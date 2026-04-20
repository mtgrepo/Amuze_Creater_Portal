import { useState } from "react";
import { useParams } from "react-router-dom";
import { decryptAuthData } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { differenceInMinutes } from "date-fns";

interface CommentSectionProps {
  type: string; 
  commentsList: any[];
  storeCommentMutation: (data: { type: string; itemId: number; parentId: number | null; comment: string }) => Promise<any>;
  deleteCommentMutation: (data: { type: string; commentId: number }) => Promise<any>;
}

const CommentsSection: React.FC<CommentSectionProps> = ({
  type,
  commentsList,
  storeCommentMutation,
  deleteCommentMutation,
}) => {
  const { id } = useParams<{ id: string }>();
  const itemId = Number(id!);

  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [newComment, setNewComment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  const loginUser = decryptAuthData(localStorage.getItem("creator")!);
  const userId = loginUser?.creator?.id;
  const userName = loginUser?.creator?.name;

  const getAvatar = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const handleDelete = async (commentId: number) => {
    await deleteCommentMutation({ type, commentId });
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    await storeCommentMutation({ type, itemId, parentId: null, comment: newComment });
    setNewComment("");
  };

  const handleReply = async (parentId: number) => {
    const text = replyTexts[parentId];
    if (!text?.trim()) return;
    await storeCommentMutation({ type, itemId, parentId, comment: text });
    setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
    setReplyToId(null);
  };

  const renderReplies = (replies: any[], parentId: number) => {
    const isExpanded = expandedReplies[parentId];
    const visibleReplies = isExpanded ? replies : replies.slice(0, 1);

    return (
      <div className="mt-4 ml-6 border-l pl-4 space-y-3">
        {visibleReplies.map((reply: any) => {
          const isAuthor = reply.user?.id === userId;
          const isNew = differenceInMinutes(new Date(), new Date(reply.created_date)) < 10;

          return (
            <div key={reply.id} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-800 flex items-center justify-center text-xs">
                  {getAvatar(reply.user?.name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isAuthor ? "text-primary" : "text-white"}`}>
                      {reply.user?.name}
                    </span>
                    {isAuthor && <span className="text-[9px] text-primary border px-1 rounded">Author</span>}
                    {isNew && <span className="text-[9px] text-blue-500">New</span>}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">{reply.comment}</p>

                  <div className="flex gap-3 mt-1">
                    <Button variant="link" size="sm" onClick={() => setReplyToId(reply.id)}>
                      Reply
                    </Button>

                    {isAuthor && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="link" size="sm" className="text-destructive cursor-pointer">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(reply.id)} variant="destructive">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {reply.reply?.length > 0 && renderReplies(reply.reply, reply.id)}

                  {replyToId === reply.id && (
                    <div className="mt-2 flex flex-col gap-2">
                      <Input
                        autoFocus
                        value={replyTexts[reply.id] || ""}
                        onChange={(e) => setReplyTexts((prev) => ({ ...prev, [reply.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="border-b bg-transparent text-xs outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => setReplyToId(null)}>Cancel</Button>
                        <Button size="sm" onClick={() => handleReply(reply.id)}>Send</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {replies.length > 1 && !isExpanded && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpandedReplies((prev) => ({ ...prev, [parentId]: true }))}
          >
            Show more ({replies.length - 1})
          </Button>
        )}

        {replies.length > 2 && isExpanded && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpandedReplies((prev) => ({ ...prev, [parentId]: false }))}
          >
            Show less
          </Button>
        )}
      </div>
    );
  };

  const comments = commentsList || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>

      <div className="mb-6 border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Comment as <span className="text-primary font-bold">{userName || "You"}</span>
        </div>

        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={`Write a comment as ${userName || "you"}...`}
          className="border-b bg-transparent text-sm outline-none py-2"
        />

        <div className="flex justify-end">
          <Button onClick={handleCreateComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      <ScrollArea className="h-100">
        <div className="space-y-5 border p-4 rounded-lg">
          {comments.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No comments yet. Be the first to comment!
            </div>
          )}

          {comments.map((comment: any) => {
            const isAuthor = comment.user?.id === userId;
            const isNew = differenceInMinutes(new Date(), new Date(comment.created_date)) < 10;

            return (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-800 flex items-center justify-center">
                    {getAvatar(comment.user?.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isAuthor ? "text-primary" : ""}`}>{comment.user?.name}</span>
                      {isAuthor && <span className="text-[9px] text-primary border px-1 rounded">Author</span>}
                      {isNew && <span className="text-[9px] text-blue-500">New</span>}
                    </div>

                    <p className="text-sm mt-1">{comment.comment}</p>

                    <div className="flex gap-4 mt-2">
                      <Button variant="link" onClick={() => setReplyToId(comment.id)}>Reply</Button>

                      {isAuthor && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-destructive cursor-pointer">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(comment.id)} variant="destructive">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    {comment.reply?.length > 0 && renderReplies(comment.reply, comment.id)}

                    {replyToId === comment.id && (
                      <div className="mt-3 flex flex-col gap-2">
                        <Input
                          autoFocus
                          value={replyTexts[comment.id] || ""}
                          onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                          placeholder="Write a reply..."
                          className="border-b bg-transparent text-sm outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button onClick={() => setReplyToId(null)} variant="outline">Cancel</Button>
                          <Button onClick={() => handleReply(comment.id)}>Send Reply</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommentsSection;