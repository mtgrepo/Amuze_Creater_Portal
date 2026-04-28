import { markNotificationAsRead } from "@/http/apis/notification/notificationApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useNotificationMarkAsRead = () => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async ({id} : {id: number}) => {
      await markNotificationAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to mark notification as read");
    }
  });

  return {
    updateMarkNotiMutation: updateMutation.mutateAsync,
    isUpdateMarkNotiPending: updateMutation?.isPending,
  };
};
