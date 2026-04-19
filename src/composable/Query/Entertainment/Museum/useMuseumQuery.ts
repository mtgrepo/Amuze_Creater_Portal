import { getAllMuseum } from "@/http/apis/entertainment/museum/museumApi"
import { useQuery } from "@tanstack/react-query"

export interface MuseumParams {
    page: number,
    pageSize: number,
    name?:string,
    approve_status?:number
}

export const useMuseumQuery = (authorId: number, params: MuseumParams) => {
    const museumList = useQuery({
        queryKey: ['museumList', params?.page, params?.pageSize, params?.name, params?.approve_status],
        queryFn: () => getAllMuseum(authorId, params),
        enabled: !!authorId
    });
    return{
        museumList : museumList?.data?.data,
        isMuseumPending: museumList.isPending,
        total:museumList?.data?.total,
        totalPage: museumList?.data?.totalPage
    }
}