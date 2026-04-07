import { getStoryTellingEpisodeById } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi"
import { useQuery } from "@tanstack/react-query"

export const useEpisodeDetailQuery = (titleId: number, episodeId:number) => {
    const episodeDetails = useQuery({
        queryKey: ["storyEpisodeDetails", titleId, episodeId],
        queryFn: async() => {
            const response = await getStoryTellingEpisodeById(titleId, episodeId);
            return response?.data
        },
        enabled: !!titleId
    });
    return{
        storyTellingEpisodeDetails: episodeDetails?.data,
        isLoading: episodeDetails?.isLoading
    }
}