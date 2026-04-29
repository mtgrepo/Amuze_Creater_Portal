import { useQuery } from "@tanstack/react-query"
import type { NotificationResponse } from "../../../types/response/notification/notificationResponse"
import { getAuthorNotifications, type NotificationParams } from "@/http/apis/notification/notificationApi";

export const useNotificationsQuery = (params: NotificationParams) => {
    const notifications = useQuery<NotificationResponse>({
        queryKey: ["notifications", params?.page, params?.limit],
        queryFn: async () => {
            const res = await getAuthorNotifications(params);
            return res?.data;
        }
    })
    return {
        notifications: notifications.data?.notifications ?? [],
        total: notifications.data?.total ?? 0,
        isLoading: notifications.isLoading
    }
}