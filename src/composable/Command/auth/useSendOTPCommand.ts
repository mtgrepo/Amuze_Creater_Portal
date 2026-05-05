
import { sendOTP } from "@/http/apis/auth/passwordApi";
import type { OTPInput } from "@/types/input/auth/otpInput";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSendOtpCommand = () => {
  const navigate = useNavigate();
  const sendOtpMutation = useMutation({
    mutationKey: ["send-otp"],
    mutationFn: async (data: OTPInput) => {
      const res = await sendOTP(data);
      return res;
    },
    onSuccess: (res, variables) => {
      if (res.status) {
        toast.success(res.message || "OTP sent successfully");
        navigate(`/verify-otp?identifier=${variables.phoneOrEmail}`)
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  return {
    sendOtpMutation: sendOtpMutation.mutateAsync,
    isPending: sendOtpMutation.isPending,
    isError: sendOtpMutation.isError,
  };
};