import { useQuery } from "@tanstack/react-query"
import type { NotificationResponse } from "../../../types/response/notification/notificationResponse"
import { getAllNotifications, type NotificationParams } from "../../../http/apis/notification/notificationApi"

export const useNotificationsQuery = (params: NotificationParams) => {
    const notificationsList = useQuery<NotificationResponse[]>({
        queryKey: ["notifications", params.page, params.pageSize, params.userId, params.role_id, params.is_read],
        queryFn: async () => {
            const res = await getAllNotifications(params);
            return res?.data;
        }
    })
    return {
        notificationsList: notificationsList.data,
        isLoading: notificationsList.isLoading
    }
}