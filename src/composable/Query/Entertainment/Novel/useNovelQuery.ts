import { useQuery } from "@tanstack/react-query"
import { getAllNovels } from "../../../../http/apis/entertainment/novel/novelApi"

export const useNovelQuery = (params: { authorId: number, page: number, pageSize: number }) => {
    const novelData = useQuery({
        queryKey: ["novels"],
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