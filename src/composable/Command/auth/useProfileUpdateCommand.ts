import { updateProfile } from "@/http/apis/auth/profileApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useProfileUpdateCommand = () => {
    const qc = useQueryClient();
    const profileUpdateMutation = useMutation({
        mutationKey: ['profile-update'],
        mutationFn: async ({id, data}: {id: number, data: FormData}) => {
            const res = await updateProfile(id, data);
            return res?.data;
        },
        onSuccess: () => {
            toast.success("Profile picture updated successfully!");
            qc.invalidateQueries({queryKey: ['creatorData']})
        }
    })
    return {
        profileUpdateMutation: profileUpdateMutation?.mutateAsync,
        isPending: profileUpdateMutation?.isPending,
        isError: profileUpdateMutation?.isError
    }
}