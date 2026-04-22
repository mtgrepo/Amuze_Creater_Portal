import { getAllPosts, type PostParams } from "@/http/apis/entertainment/posts/postApi";
import { useQuery } from "@tanstack/react-query"

export const usePostQuery = (authorId: number, params: PostParams) => {
    const postList = useQuery({
        queryKey: ['postList', params?.page, params?.pageSize, params?.is_banned],
        queryFn: () => getAllPosts(authorId, params),
        enabled: !!authorId
    });
    return {
        postList: postList?.data?.data?.updatedPosts || [],
        isPostPending: postList.isPending,
        total: postList?.data?.data?.total,
        totalPage: postList?.data?.data?.totalPage
    }
}