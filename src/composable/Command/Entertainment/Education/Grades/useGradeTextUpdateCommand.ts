import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateGradeText } from "../../../../../http/apis/entertainment/education/gradesApi";
import { toast } from "sonner";

export const useGradeTextUpdateCommand = () => {
    const qc = useQueryClient();

    const updateGradeTextMutation = useMutation({
        mutationKey: ['updateGradeText'],
        mutationFn: async ({gradeId, name, is_old_question } : { gradeId: number, name: string, is_old_question: boolean }) => {
            const res = await updateGradeText(gradeId, name, is_old_question);
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