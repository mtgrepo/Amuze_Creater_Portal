import { markAsAllRead } from "@/http/apis/notification/notificationApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useMarkAllReadCommand = () => {
    const qc = useQueryClient();
    const markAllReadMutation = useMutation({
        mutationKey: ["markAllRead"],
        mutationFn: async () => {
            const res = await markAsAllRead();
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("All notifications marked as read successfully");
        }
    })
    return {
        markAllReadMutation: markAllReadMutation?.mutateAsync,
        isPending: markAllReadMutation?.isPending
    }
}