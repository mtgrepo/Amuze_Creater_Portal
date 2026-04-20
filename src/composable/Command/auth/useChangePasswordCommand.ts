import { changePassword } from "@/http/apis/auth/passwordApi"
import type { ChangePasswordInput } from "@/types/input/auth/passwordInput"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useChangePasswordCommand = () => {
    const changePasswordMutation = useMutation({
        mutationKey: ['change-password'],
        mutationFn: async (data: ChangePasswordInput) => {
            const res = await changePassword(data);
            return res?.data;
        },
        onSuccess: () => {
            toast.success('Password changed successfully!');
        }
    })
    return {
        changePasswordMutation: changePasswordMutation?.mutateAsync,
        isPending: changePasswordMutation?.isPending,
        isError: changePasswordMutation?.isError
    }
}