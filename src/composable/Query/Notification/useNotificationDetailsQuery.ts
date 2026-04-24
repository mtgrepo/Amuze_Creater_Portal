import { getNotificationDetails } from "@/http/apis/notification/notificationApi"
import { useQuery } from "@tanstack/react-query"

export const useNotificationDetailsQuery = (id: number) => {
    const notificationDetails = useQuery({
        queryKey: ['notificationDetails', id],
        queryFn: async () => {
            const res = await getNotificationDetails(id);
            return res?.data
        },
        enabled: !!id
    })
    return {
        notificationDetails: notificationDetails?.data,
        isLoading: notificationDetails?.isLoading
    }
}