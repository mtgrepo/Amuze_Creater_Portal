import { creatorLogin } from "@/http/apis/auth/loginApi";
import type { LoginInput } from "@/types/input/auth/loginInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginSuccess } from "@/redux/auth/authSlice";
import { useDispatch } from "react-redux";

export const useLoginCommand = () => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginInput) => {
      const res = await creatorLogin(data);
      return res;
    },
    onSuccess: (res) => {
      if (res.status && res.data && res.token) {
        if (res.data.role_id !== 4) {
          toast.error("Unauthorized: Access restricted to specific roles.");
          return;
        }
        dispatch(loginSuccess({ creator: res.data, token: res.token }));
        toast.success("Logged in successfully");
      } else {
        toast.error(res.message || "Login failed");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  return {
    loginMutation: loginMutation.mutateAsync,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
  };
};
