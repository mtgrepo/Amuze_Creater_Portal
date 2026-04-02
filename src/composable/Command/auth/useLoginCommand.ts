import { creatorLogin } from "@/http/apis/auth/loginApi";
import type { LoginInput } from "@/types/input/auth/loginInput";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginSuccess } from "@/redux/auth/authSlice"; 
import { useDispatch } from "react-redux";

export const useLoginCommand = () => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: LoginInput) => {
      const res = await creatorLogin(data);
      return res; 
    },
    onSuccess: (res) => {
      // 1. Basic check for valid response structure
      if (res.status && res.data && res.token) {
        
        // 2. SPECIFIC ROLE CHECK (role_id 4)
        if (res.data.role_id !== 4) {
          toast.error("Unauthorized: Access restricted to specific roles.");
          return; // Stop execution here
        }

        // 3. If role is correct, update state and show success
        dispatch(
          loginSuccess({
            creator: res.data,
            token: res.token,
          })
        );

        toast.success("Logged in successfully");
      } else {
        toast.error(res.message || "Login failed");
      }
    },
    onError: (error: any) => {
      // Handle actual network or server errors
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  });

  return {
    loginMutation: loginMutation.mutateAsync,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
  };
};