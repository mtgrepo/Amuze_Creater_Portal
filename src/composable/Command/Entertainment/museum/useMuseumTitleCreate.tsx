import { createMuseumTitle } from "@/http/apis/entertainment/museum/museumTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumTitleCreate = () => {
     const queryClient = useQueryClient();
     const {id} = useParams();
  const createTitleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await createMuseumTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumDetail"] });
      toast.success(`Added new museum title successfully`);
      router.navigate(`/entertainment/museum/details/${id}`)
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create title");
    }
  });
    return{
        createTitleMutation: createTitleMutation.mutateAsync,
        isCreateTitlePending: createTitleMutation.isPending
    }
}