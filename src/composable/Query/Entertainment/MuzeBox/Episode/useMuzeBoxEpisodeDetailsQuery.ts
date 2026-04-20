import { getMuzeBoxEpisodeById } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi"
import { useQuery } from "@tanstack/react-query"

export  const useMuzeBoxEpisodeDetailsQuery = (seriesId: number, episodeId: number) => {
    const episodeDetails = useQuery({
        queryKey: ['muzeBoxEpisodeDetails', seriesId, episodeId],
        queryFn: async () => {
            const res = await getMuzeBoxEpisodeById(seriesId, episodeId);
            return res?.data
        },
        enabled: !!seriesId && !!episodeId
    })
    return {
        episodeDetails: episodeDetails?.data,
        isLoading: episodeDetails?.isLoading
    }
}