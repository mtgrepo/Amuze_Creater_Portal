import { getMuseumEpisodeDetail } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import type { MuseumEpisode } from "@/types/response/entertainment/museum/museumEpisodeResponse";
import { useQuery } from "@tanstack/react-query"

export const useMuseumEpisodeDetailsQuery = (id: number) => {
    const museumEpisodeDetails = useQuery<MuseumEpisode>({
        queryKey: ["museumEpisodeDetail", id],
        queryFn: () => getMuseumEpisodeDetail(Number(id)),
        enabled: !!id
    });
    return{
        episodeDetails:  museumEpisodeDetails.data,
        isEpisodeLoading:  museumEpisodeDetails.isLoading,
        error:  museumEpisodeDetails.error
    }
}