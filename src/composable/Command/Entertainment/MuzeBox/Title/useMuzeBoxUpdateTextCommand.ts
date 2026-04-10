import { updateMuzeBoxText, type MuzeBoxTextInput } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useMuzeBoxUpdateTextCommand = () => {
    const qc = useQueryClient();

    const muzeBoxTextUpdateMutation = useMutation({
        mutationKey: ['updateMuzeBoxText'],
        mutationFn: async ({ id, data }: { id: number, data: MuzeBoxTextInput }) => {
            const res = await updateMuzeBoxText(id, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["muzeBoxList"] });
            toast.success("MuzeBox updated successfully");
            router.navigate('/entertainment/muze-box');
        }
    })
    return {
        muzeBoxTextUpdateMutation: muzeBoxTextUpdateMutation?.mutateAsync,
        isUpdateTextPending: muzeBoxTextUpdateMutation?.isPending
    }
} 