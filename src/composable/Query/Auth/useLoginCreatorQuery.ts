import { getLoginCreator } from "@/http/apis/auth/loginApi"
import type { LoginCreatorResponse } from "@/types/response/auth/loginCreatorResponse";
import { useQuery } from "@tanstack/react-query"

export const useLoginCreatorQuery = (creatorId: number) => {
    const creatorData = useQuery<LoginCreatorResponse>({
        queryKey: ['creatorData', creatorId],
        queryFn: async () => {
            const res = await getLoginCreator(creatorId);
            return res?.data;
        },
        enabled: !!creatorId
    })
    return {
        creatorData: creatorData?.data,
        isLoading: creatorData?.isLoading
    }
}