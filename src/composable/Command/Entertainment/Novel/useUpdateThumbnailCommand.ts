import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateNovelThumbnail } from "../../../../http/apis/entertainment/novel/novelApi";
import { toast } from "sonner";

export const useNovelUpdateThumbnailCommand = () => {
    const qc = useQueryClient();

    const updateThumbnailMutation = useMutation({
        mutationKey: ["updateNovelThumbnail"],
        mutationFn: async ({ id, type, thumbnail }: { id: number, type: string, thumbnail: FormData }) => {
            const res = await updateNovelThumbnail(id, type, thumbnail);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["novels"] });
            qc.invalidateQueries({ queryKey: ["novelDetails"] });
            toast.success("Novel updated successfully");
            // navigate("/entertainment/novel");
        }
    })
    return {
        updateThumbnailMutation: updateThumbnailMutation?.mutateAsync,
        isUpdatingThumbnail: updateThumbnailMutation?.isPending,
    }
}