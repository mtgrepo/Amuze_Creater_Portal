import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateGradeText } from "../../../../../http/apis/entertainment/education/gradesApi";
import { toast } from "sonner";

export const useGradeTextUpdateCommand = () => {
    const qc = useQueryClient();

    const updateGradeTextMutation = useMutation({
        mutationKey: ['updateGradeText'],
        mutationFn: async ({gradeId, name} : { gradeId: number, name: string}) => {
            const res = await updateGradeText(gradeId, name);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['gradeList']});
            toast.success("Grade updated successfully");
        }
    })
    return {
        updateGradeTextMutation: updateGradeTextMutation?.mutateAsync,
        isPending: updateGradeTextMutation?.isPending
    }
}