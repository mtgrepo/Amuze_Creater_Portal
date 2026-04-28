import { markAllNotificationAsRead, type NotificationParams } from "@/http/apis/notification/notificationApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAllNotificationMarkAsRead = () => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (data : NotificationParams) => {
      await markAllNotificationAsRead(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to mark all notification as read");
    }
  });

  return {
    updateAllMarkNotiMutation: updateMutation.mutateAsync,
    isUpdateAllMarkNotiPending: updateMutation?.isPending,
  };
};
