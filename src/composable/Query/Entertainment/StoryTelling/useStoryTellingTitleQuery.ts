import { getAllStoryTellingTitles } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi"
import { useQuery } from "@tanstack/react-query"

export interface StoryTellingTitleParams {
    page: number,
    pageSize: number,
    is_published?:boolean,
    approve_status?: number,
    name:string
}

export const useStoryTellingTitleQuery = (creatorId: number, params: StoryTellingTitleParams) => {
    const storyTellingTitleList = useQuery({
        queryKey: ['storyTitleList', params.page, params.pageSize, params?.is_published, params?.approve_status, params?.name],
        queryFn: () => getAllStoryTellingTitles(creatorId, params),
        enabled: !!creatorId
    });
    return {
        storyTellingTitleList : storyTellingTitleList?.data?.data.storyTitles,
        isLoading: storyTellingTitleList?.isLoading,
        total: storyTellingTitleList.data?.data.total,
        totalPages: storyTellingTitleList?.data?.data.totalPage,
    }
}