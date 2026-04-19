import { getMuseumById } from "@/http/apis/entertainment/museum/museumApi"
import type { MuseumDetailResponse } from "@/types/response/entertainment/museum/museumResponse";
import { useQuery } from "@tanstack/react-query"

export const useMuseumDetailQuery = (id:number) => {
    const museumDetail = useQuery<MuseumDetailResponse>({
        queryKey: ['museumDetail',id],
        queryFn: () => getMuseumById(id),
        enabled: !!id
    });
    return{
        museumDetail : museumDetail?.data?.data,
        isDetailPending: museumDetail.isPending,
    }
}