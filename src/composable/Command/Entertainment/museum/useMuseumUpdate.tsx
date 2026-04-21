import { updateMuseum, type UpdateMuseumPayload } from "@/http/apis/entertainment/museum/museumApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useMuseumUpdate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const museumMutation = useMutation({
    mutationKey : ["museumDetail"],
    mutationFn: async ({id, data} : {id: number, data: UpdateMuseumPayload}) => {
      await updateMuseum(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumDetail"] });
      navigate('/entertainment/museum')
    },
  });

  return {
    updateMuseumMutation: museumMutation.mutateAsync,
    isMuseumUpdatePending: museumMutation?.isPending,
  };
};
