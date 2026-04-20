import { updateMuzeBoxEpisodeVideo } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuzeBoxEpisodeVideoUpdateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const updateEpisodeVideoMutation = useMutation({
        mutationKey: ['updateMuzeBoxEpisodeVideo'],
        mutationFn: async ({ episodeId, video }: { episodeId: number, video: FormData }) => {
            const res = await updateMuzeBoxEpisodeVideo(episodeId, video);
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
        updateEpisodeVideoMutation: updateEpisodeVideoMutation?.mutateAsync,
        isVideoUpdating: updateEpisodeVideoMutation?.isPending
    }
}