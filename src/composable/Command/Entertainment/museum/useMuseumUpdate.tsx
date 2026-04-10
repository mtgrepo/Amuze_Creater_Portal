import { updateMuseum, type UpdateMuseumPayload } from "@/http/apis/entertainment/museum/museumApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMuseumUpdate = () => {
  const queryClient = useQueryClient();
  const museumMutation = useMutation({
    mutationKey : ["museumDetail"],
    mutationFn: async ({id, data} : {id: number, data: UpdateMuseumPayload}) => {
      await updateMuseum(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumDetail"] });
      router.navigate('/entertainment/museum')
    },
  });

  return {
    updateMuseumMutation: museumMutation.mutateAsync,
    isMuseumUpdatePending: museumMutation?.isPending,
  };
};
