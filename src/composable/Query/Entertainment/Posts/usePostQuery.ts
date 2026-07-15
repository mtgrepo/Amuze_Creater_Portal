import { getAllPosts } from "@/http/apis/entertainment/posts/postApi";
import { useQuery } from "@tanstack/react-query"

export interface PostParams {
  page: number;
  pageSize: number;
  is_banned?: boolean;
  name?: string,
  startDate?: string,
  endDate?: string
}

export const usePostQuery = (authorId: number, params: PostParams) => {
    const postList = useQuery({
        queryKey: ['postList', params?.page, params?.pageSize, params?.is_banned, params?.startDate, params?.endDate],
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