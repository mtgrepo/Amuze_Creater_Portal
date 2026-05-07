
import { resetPassword } from "@/http/apis/auth/passwordApi";
import type { ResetPasswordInput } from "@/types/input/auth/resetPasswordInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useResetPasswordCommand = () => {
  const resetPasswordMutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await resetPassword(data);
      return res;
    },
    onSuccess: (res) => {
      if (res.status) {
        toast.success(res.message || "Password reset successfully");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return {
    resetPasswordMutation: resetPasswordMutation.mutateAsync,
    isPending: resetPasswordMutation.isPending,
    isError: resetPasswordMutation.isError,
  };
};