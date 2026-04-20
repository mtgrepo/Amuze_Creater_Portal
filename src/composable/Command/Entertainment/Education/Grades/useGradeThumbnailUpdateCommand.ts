import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGradeThumbnail } from "../../../../../http/apis/entertainment/education/gradesApi";
import { toast } from "sonner";

export const useGradeThumbnailUpdateCommand = () => {
    const qc = useQueryClient();
    
    const updateGradeThumbnailMutation = useMutation({
        mutationKey: ['updateGradeThumbnail'],
        mutationFn: async ({gradeId, data} : { gradeId: number, data: FormData}) => {
            const res = await updateGradeThumbnail(gradeId, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['gradeList']});
            toast.success("Grade thumbnail updated successfully");
        }
    })
    return {
        updateGradeThumbnailMutation: updateGradeThumbnailMutation?.mutateAsync,
        isPending: updateGradeThumbnailMutation?.isPending
    }
}