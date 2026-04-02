import { getComicEpisodeById } from "@/http/apis/entertainment/comics/comicsEpisodeApi"
import { useQuery } from "@tanstack/react-query"

export const useComicEpisodeDetailsQuery = (titleId: number, episodeId: number) => {
    const episodeDetails = useQuery({
        queryKey: ['episodeDetails', titleId, episodeId],
        queryFn: async () => {
            const res = await getComicEpisodeById(titleId, episodeId);
            console.log("e data i q", res)
            return res?.data
        },
        enabled: !!titleId
    })
    return {
        episodeDetails: episodeDetails?.data,
        isLoading: episodeDetails?.isLoading
    }
}