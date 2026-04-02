import { Button } from "@/components/ui/button";
import { useComicsTitleCommentQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleCommentQuery";
import { decryptAuthData } from "@/lib/helper";
import { useState } from "react";

const CommentsSection = () => {
  const [replyToId, setReplyToId] = useState(null);

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;

  const { commentsList, isLoading } = useComicsTitleCommentQuery(creatorId!);

  // Helper to get initials for avatar
  const getAvatar = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      // Trigger your delete mutation here
      console.log("Deleting comment:", id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-500">Loading comments...</div>
    );
  }

  // Ensure we have an array to map over
  const comments = commentsList || [];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white font-sans">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">
          Comments{" "}
          <span className="text-gray-500 font-normal ml-2">
            {comments.length}
          </span>
        </h2>
      </div>

      <div className="space-y-10 border border-border p-4 rounded-lg">
        {comments.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No comments yet.</p>
        ) : (
          comments.map((comment: any) => {
            // Check if the comment belongs to the logged-in creator
            const isCommentAuthor = comment.user_id === creatorId;

            return (
              <div key={comment.id} className="relative">
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                      isCommentAuthor
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {getAvatar(comment.user_name || comment.user?.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold ${isCommentAuthor ? "text-yellow-500" : "text-white"}`}
                      >
                        {comment.user_name ||
                          comment.user?.name ||
                          "Unknown User"}
                      </span>
                      {isCommentAuthor && (
                        <span className="bg-yellow-500/10 text-yellow-500 text-[9px] px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold uppercase">
                          Author
                        </span>
                      )}
                      <span className="text-[10px] text-gray-600 font-medium ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      {comment.comment_text || comment.text}
                    </p>

                    {/*  ACTION BUTTONS  */}
                    <div className="flex items-center gap-6">
                      <Button
                        onClick={() => setReplyToId(comment.id)}
                        className="text-[10px] font-black text-gray-500 hover:text-blue-500 tracking-widest uppercase transition"
                      >
                        Reply
                      </Button>

                      {/* Only Author of the comic OR the comment creator can delete */}
                      {isCommentAuthor && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-[10px] font-black text-red-900/60 hover:text-red-500 tracking-widest uppercase transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/*  NESTED REPLIES  */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-6 ml-2 pl-6 border-l-2 border-gray-900 space-y-6">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                reply.user_id === creatorId
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
                          <button
                            onClick={() => setReplyToId(null)}
                            className="text-[10px] text-gray-500 font-bold uppercase"
                          >
                            Cancel
                          </button>
                          <button className="text-[10px] text-blue-500 font-bold uppercase">
                            Send Reply
                          </button>
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
