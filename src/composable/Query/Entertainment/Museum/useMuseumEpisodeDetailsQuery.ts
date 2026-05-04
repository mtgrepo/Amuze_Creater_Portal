import { getMuseumEpisodeDetail } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import type { MuseumEpisode } from "@/types/response/entertainment/museum/museumEpisodeResponse";
import { useQuery } from "@tanstack/react-query"

export const useMuseumEpisodeDetailsQuery = (episodeId: number) => {
    const museumEpisodeDetails = useQuery<MuseumEpisode>({
        queryKey: ["museumEpisodeDetail", episodeId],
        queryFn: () => getMuseumEpisodeDetail(Number(episodeId)),
        enabled: !!episodeId
    });
    return{
        episodeDetails:  museumEpisodeDetails.data,
        isEpisodeLoading:  museumEpisodeDetails.isLoading,
        error:  museumEpisodeDetails.error
    }
}