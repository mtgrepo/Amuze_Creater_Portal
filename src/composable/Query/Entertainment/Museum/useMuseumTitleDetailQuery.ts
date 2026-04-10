import { getMuseumTitleDetail } from "@/http/apis/entertainment/museum/museumTitleApi";
import type { MuseumTitleDetailResponse } from "@/types/response/entertainment/museum/museumTitleDetailResponse";
import { useQuery } from "@tanstack/react-query"

export const useMuseumTitleDetailsQuery = (id: number) => {
    const museumTitleDetails = useQuery<MuseumTitleDetailResponse>({
        queryKey: ["museumTitleDetail", id],
        queryFn: () => getMuseumTitleDetail(Number(id)),
        enabled: !!id
    });
    return{
        titleDetails: museumTitleDetails.data,
        isTitleLoading: museumTitleDetails.isLoading,
        error: museumTitleDetails.error
    }
}