import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGrades } from "../../../../../http/apis/entertainment/education/gradesApi";
import { toast } from "sonner";

export const useGradeCreateCommand = () => {
    const qc = useQueryClient();
    
    const createGrade = useMutation({
        mutationKey: ['createGrade'],
        mutationFn: async (data: FormData) => {
            const res = await createGrades(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['gradeList'] });
            toast.success("Grade created successfully");
        }
    })
    return {
        createGradeMutation: createGrade?.mutateAsync,
        isPending: createGrade?.isPending
    }
}