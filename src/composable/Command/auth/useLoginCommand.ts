import { creatorLogin } from "@/http/apis/auth/loginApi";
import type { LoginInput } from "@/types/input/auth/loginInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginSuccess } from "@/redux/auth/authSlice"; // your slice
import { useDispatch } from "react-redux";

export const useLoginCommand = () => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginInput) => {
      const res = await creatorLogin(data);
      return res; // return full API response
    },
    onSuccess: (res) => {
      if (res.status && res.data && res.token) {
        // Dispatch to Redux slice
        dispatch(
          loginSuccess({
            creator: res.data,
            token: res.token,
          })
        );

        toast.success("Logged in successfully");
      } else {
        toast.error("Login failed");
      }
    },
  });

  return {
    loginMutation: loginMutation.mutateAsync,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
  };
};