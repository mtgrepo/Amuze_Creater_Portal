import { createMuseum } from "@/http/apis/entertainment/museum/museumApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMuseumCreate = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createMuseum(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumList"] });
      toast.success("Added new museum successfully");
      router.navigate("/entertainment/museum")
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
