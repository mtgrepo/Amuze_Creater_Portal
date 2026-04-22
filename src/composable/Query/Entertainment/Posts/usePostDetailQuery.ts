import { getPostById } from "@/http/apis/entertainment/posts/postApi";
import type { PostDetailResponseType } from "@/types/response/entertainment/post/postResponse";
import { useQuery } from "@tanstack/react-query"

export const usePostDetailQuery = (id:number) => {
    const postDetail = useQuery<PostDetailResponseType>({
        queryKey: ['postDetail',id],
        queryFn: () => getPostById(id),
        enabled: !!id
    });
    return{
        postDetail : postDetail?.data?.data,
        isDetailPending: postDetail.isPending,
        error:postDetail?.error
    }
}