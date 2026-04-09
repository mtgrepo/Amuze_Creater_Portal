import { updateMuzeBoxThumbnail } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useMuzeBoxUpdateThumbnailCommand = () => {
    const qc = useQueryClient();

    const updateThumbnailMutation = useMutation({
        mutationKey: ["updateMuzeBoxThumbnail"],
        mutationFn: async ({muzeBoxId, type, data} : {muzeBoxId: number, type: string, data: FormData}) => {
            const res = await updateMuzeBoxThumbnail(muzeBoxId, type, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["muzeBoxList"] });
            toast.success("MuzeBox updated successfully");
            router.navigate('/entertainment/muze-box');
        }
    })
    return {
        updateThumbnailMutation: updateThumbnailMutation?.mutateAsync,
        isUpdateThumbnailPending: updateThumbnailMutation?.isPending
    }
}