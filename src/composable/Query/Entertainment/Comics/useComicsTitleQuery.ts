import { getAllComicsTitles } from "@/http/apis/entertainment/comics/comicsTitleApi"
import { useQuery } from "@tanstack/react-query"

export interface ComicsTitleParams {
    page: number,
    pageSize: number,
    approve_status?: number,
    is_published?: boolean
}
export const useComicsTitleQuery = (creatorId: number, params: ComicsTitleParams) => {
    const comicsTitleList = useQuery({
        queryKey: ['comicsTitleList', params?.page, params?.pageSize, params?.approve_status, params?.is_published],
        queryFn: async () => {
            const res = await getAllComicsTitles(creatorId, params);
            // console.log("res in query", res?.data);
            return res?.data;
        },
        enabled: !!creatorId
    })
    return {
        comicsTitleList: comicsTitleList?.data?.comicTitles,
        isLoading: comicsTitleList?.isLoading,
        totalPages: comicsTitleList?.data?.totalPage,
        total: comicsTitleList?.data?.total
    }
}