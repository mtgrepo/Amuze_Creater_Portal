import { getMuseumTitleDetail } from "@/http/apis/entertainment/museum/museumTitleApi";
import type { MuseumTitleDetailResponse } from "@/types/response/entertainment/museum/museumTitleDetailResponse";
import { useQuery } from "@tanstack/react-query"

export const useMuseumTitleDetailsQuery = (titleId: number) => {
    const museumTitleDetails = useQuery<MuseumTitleDetailResponse>({
        queryKey: ["museumTitleDetail", titleId],
        queryFn: () => getMuseumTitleDetail(Number(titleId)),
        enabled: !!titleId
    });
    return{
        titleDetails: museumTitleDetails.data,
        isTitleLoading: museumTitleDetails.isLoading,
        error: museumTitleDetails.error
    }
}