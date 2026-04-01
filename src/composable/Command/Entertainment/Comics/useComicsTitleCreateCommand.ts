import { createComicsTitle } from "@/http/apis/entertainment/comics/comicsTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useComicsTitleCreateCommand = () => {
  const queryClient = useQueryClient();
  const titleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createComicsTitle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comicsTitleList"] });
      toast.success(`Added new comics title successfully`);
    },
  });

  return {
    titleMutation: titleMutation.mutateAsync,
    isPending: titleMutation?.isPending,
  };
};
