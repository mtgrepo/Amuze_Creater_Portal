import { updateMuzeBoxThumbnail } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuzeBoxUpdateThumbnailCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const updateThumbnailMutation = useMutation({
        mutationKey: ["updateMuzeBoxThumbnail"],
        mutationFn: async ({muzeBoxId, type, data} : {muzeBoxId: number, type: string, data: FormData}) => {
            const res = await updateMuzeBoxThumbnail(muzeBoxId, type, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["muzeBoxList"] });
            toast.success("MuzeBox updated successfully");
            navigate('/entertainment/muze-box');
        }
    })
    return {
        updateThumbnailMutation: updateThumbnailMutation?.mutateAsync,
        isUpdateThumbnailPending: updateThumbnailMutation?.isPending
    }
}