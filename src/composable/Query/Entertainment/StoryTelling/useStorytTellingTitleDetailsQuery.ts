import { getStoryTellingTitleById } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi"
import { useQuery } from "@tanstack/react-query"

export const useStoryTellingTitleDetailsQuery = (id: number) => {
    const storyTellingTitleDetails = useQuery({
        queryKey: ["storyTellingTitleDetails", id],
        queryFn: () => getStoryTellingTitleById(id),
        enabled: !!id
    });
    return{
        storyTellingTitleDetails: storyTellingTitleDetails.data?.data,
        isLoading: storyTellingTitleDetails.isLoading,
        error: storyTellingTitleDetails.error
    }
}