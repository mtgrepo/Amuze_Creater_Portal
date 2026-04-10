// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { toast } from "sonner";
// import type { StoreCommentParams } from "@/types/response/comment/commentResponse";
// import { storeComment } from "../../../../http/apis/comment/commentApi";

// export const useStoryTellingStoreComment = () => {
//     const queryClient = useQueryClient();

//     const storeCommentMutation = useMutation({
//         mutationKey: ["createComment"],
//         mutationFn: async (params: StoreCommentParams) => {
//             const res = await storeComment(params);
//             return res?.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["titleComments"] })
//             toast.success("Comment created successfully")
//         },
//         onError: (error: any) => {
//             toast.error(error.message || "Failed to create comment");
//         },

//     })
//     return {
//         storeCommentMutation: storeCommentMutation.mutateAsync,
//         isStoryCommentPending: storeCommentMutation?.isPending
//     }
// }