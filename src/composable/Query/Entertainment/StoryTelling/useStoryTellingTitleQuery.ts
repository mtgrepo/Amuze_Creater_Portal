import { getAllStoryTellingTitles } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi"
import { useQuery } from "@tanstack/react-query"

export interface StoryTellingTitleParams {
    page: number,
    pageSize: number,
}

export const useStoryTellingTitleQuery = (creatorId: number, params: StoryTellingTitleParams) => {
    const storyTellingTitleList = useQuery({
        queryKey: ['storyTitleList', params.page, params.pageSize],
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