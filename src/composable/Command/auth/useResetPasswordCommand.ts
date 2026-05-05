
import { resetPassword } from "@/http/apis/auth/passwordApi";
import type { ResetPasswordInput } from "@/types/input/auth/resetPasswordInput";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useResetPasswordCommand = () => {
  const navigate = useNavigate();
  const resetPasswordMutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await resetPassword(data);
      return res;
    },
    onSuccess: (res) => {
      if (res.status) {
        toast.success(res.message || "Password reset successfully");

        navigate("/creator-portal/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  return {
    resetPasswordMutation: resetPasswordMutation.mutateAsync,
    isPending: resetPasswordMutation.isPending,
    isError: resetPasswordMutation.isError,
  };
};