
import { sendOTP } from "@/http/apis/auth/passwordApi";
import type { OTPInput } from "@/types/input/auth/otpInput";
import { useMutation } from "@tanstack/react-query";

export const useSendOtpCommand = () => {
  const sendOtpMutation = useMutation({
    mutationKey: ["send-otp"],
    mutationFn: async (data: OTPInput) => {
      const res = await sendOTP(data);
      return res;
    },
  });

  return {
    sendOtpMutation: sendOtpMutation.mutateAsync,
    isPending: sendOtpMutation.isPending,
    isError: sendOtpMutation.isError,
  };
};