import { updateEpisodeThumbnail } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useComicEpisodeThumbnailUpdateCommand = () => {
  const qc = useQueryClient();

  const episodeThumbnailMutation = useMutation({
    mutationKey: ["updateEpisode"],
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await updateEpisodeThumbnail(id, data);
      console.log("up ep", res);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comicsEpisodesList"] });
      toast.success("Comics episode update successfully");
      router.navigate(-1);
    },
  });
  return {
    episodeThumbnailMutation: episodeThumbnailMutation?.mutateAsync,
    isPending: episodeThumbnailMutation?.isPending,
  };
};
