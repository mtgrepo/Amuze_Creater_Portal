import { updateMuzeBoxEpisodeThumbnail } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuzeBoxEpisodeThumbnailUpdateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const updateEpisodeThumbnailMutation = useMutation({
        mutationKey: ['updateMuzeBoxEpisodeThumbnail'],
        mutationFn: async ({ episodeId, thumbnail }: { episodeId: number, thumbnail: FormData }) => {
            const res = await updateMuzeBoxEpisodeThumbnail(episodeId, thumbnail);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['muzeBoxList'] });
            qc.invalidateQueries({ queryKey: ['muzeBoxTitleDetails'] });
            toast.success("MuzeBox episode updated successfully");
            navigate(-1);
        }
    })
    return {
        updateEpisodeThumbnailMutation: updateEpisodeThumbnailMutation?.mutateAsync,
        isThumbnailUpdating: updateEpisodeThumbnailMutation?.isPending
    }
}