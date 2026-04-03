import { deleteEpisodeImage } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useEpisodeDeleteCommand = () => {
    const qc = useQueryClient();
    const deleteImageMutation = useMutation({
        mutationKey: ['deleteImage'],
        mutationFn: async ({episodeId, imageId}: {episodeId: number, imageId: number}) => {
            const res = await deleteEpisodeImage(Number(episodeId), Number(imageId));
            // console.log("del res", res);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['comicsTitleList']});
            toast.success(`Delete episode image successfully`);
        }
    })

    return {
        deleteImageMutation: deleteImageMutation.mutateAsync,
        isPending: deleteImageMutation?.isPending,
    }
}