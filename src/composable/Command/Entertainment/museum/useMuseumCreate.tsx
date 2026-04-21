import { createMuseum } from "@/http/apis/entertainment/museum/museumApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createMuseum(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumList"] });
      toast.success("Added new museum successfully");
      navigate("/entertainment/museum")
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create new museum");
    }
  });

  return {
    createMutation: titleMutation.mutateAsync,
    isCreatePending: titleMutation?.isPending,
  };
};
