import { useQuery } from "@tanstack/react-query"
import { getAllNovels } from "../../../../http/apis/entertainment/novel/novelApi"

export const useNovelQuery = (params: {
    authorId: number, page: number, pageSize: number, name: string, approve_status?: number,
    is_published?: boolean,
}) => {
    const novelData = useQuery({
        queryKey: ["novels", params],
        queryFn: async () => {
            const res = await getAllNovels(params);
            return res?.data;
        }
    })
    return {
        novelData: novelData.data,
        isLoading: novelData.isLoading,
        totalPages: novelData.data?.totalPage,
        total: novelData.data?.total,
    }
}