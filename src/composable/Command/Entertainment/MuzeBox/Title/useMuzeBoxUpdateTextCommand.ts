import { updateMuzeBoxText, type MuzeBoxTextInput } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuzeBoxUpdateTextCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const muzeBoxTextUpdateMutation = useMutation({
        mutationKey: ['updateMuzeBoxText'],
        mutationFn: async ({ id, data }: { id: number, data: MuzeBoxTextInput }) => {
            const res = await updateMuzeBoxText(id, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["muzeBoxList"] });
            toast.success("MuzeBox updated successfully");
            navigate('/entertainment/muze-box');
        }
    })
    return {
        muzeBoxTextUpdateMutation: muzeBoxTextUpdateMutation?.mutateAsync,
        isUpdateTextPending: muzeBoxTextUpdateMutation?.isPending
    }
} 