import { updateProfileInfo, type UpdateInfoProps } from "@/http/apis/auth/profileApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useProfileInfoUpdateCommand = () => {
    const qc = useQueryClient();
    
    const profileInfoUpdateMutation = useMutation({
        mutationKey: ["update-profile-info"],
        mutationFn: async ({ creatorId, data }: { creatorId: number, data: UpdateInfoProps}) => {
            const res = await updateProfileInfo(creatorId, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["creatorData"] });
            qc.invalidateQueries({ queryKey: ["profileHistory"] });
            toast.success("Profile information updated successfully!");
        }
    })
    return {
        profileInfoUpdateMutation: profileInfoUpdateMutation?.mutateAsync,
        isPending: profileInfoUpdateMutation?.isPending
    }
}