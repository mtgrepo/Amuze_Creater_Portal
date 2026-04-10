import { updateMuzeBoxEpisodeText, type EpisodeTextInput } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const  useMuzeBoxEpisodeTextUpdateCommand = () => {
    const qc = useQueryClient();

    const updateEpisodeTextMutation = useMutation({
        mutationKey: ['updateMuzeBoxEpisodeText'],
        mutationFn: async ({ episodeId, data }: { episodeId: number, data: EpisodeTextInput }) => {
            const res = await updateMuzeBoxEpisodeText(episodeId, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['muzeBoxList'] });
            qc.invalidateQueries({ queryKey: ['muzeBoxTitleDetails'] });
            toast.success("MuzeBox episode updated successfully");
            router.navigate(-1);
        }
    })
    return {
        updateEpisodeTextMutation: updateEpisodeTextMutation?.mutateAsync,
        isTextUpdating: updateEpisodeTextMutation?.isPending
    }
}