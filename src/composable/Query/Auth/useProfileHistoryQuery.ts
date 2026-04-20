import { getProfileHistory } from "@/http/apis/auth/loginApi"
import { useQuery } from "@tanstack/react-query"

export const useProfileHistoryQuery = (id: number, page: number) => {
    const profileHistoryData = useQuery({
        queryKey: ['profileHistory', id, page],
        queryFn: async () => {
            const res = await getProfileHistory(id, page);
            return res?.photos || [];
        },
        enabled: !!id,
        placeholderData: (previousData) => previousData,
    })
    return {
        profileHistoryData: profileHistoryData?.data ?? [],
        isLoading: profileHistoryData?.isLoading
    }
}