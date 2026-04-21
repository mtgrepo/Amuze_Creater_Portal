import type { UpdateMuseumPayload } from "@/http/apis/entertainment/museum/museumApi";
import { updateMuseumTitle } from "@/http/apis/entertainment/museum/museumTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumTitleUpdate = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const updateTitleMutation = useMutation({
    mutationFn: async ({
      titleId,
      data,
    }: {
      titleId: number;
      data: UpdateMuseumPayload;
    }) => {
      return await updateMuseumTitle(titleId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumDetail"] });
      toast.success(`Museum title updated successfully`);
      navigate(`/entertainment/museum/details/${id}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update title");
    },
  });
  return {
    updateTitleMutation: updateTitleMutation.mutateAsync,
    isUpdatePending: updateTitleMutation.isPending,
  };
};
