import { useQuery } from "@tanstack/react-query"
import { getGradeById } from "../../../../../http/apis/entertainment/education/gradesApi"
import type { GradeDetailsResponse } from "../../../../../types/response/entertainment/education/gradeResponse";

export const useGradeDetailsQuery = (gradeId: number) => {
    const gradeDetails = useQuery<GradeDetailsResponse>({
        queryKey: ["gradeDetails", gradeId],
        queryFn: async () => {
            const res = await getGradeById(gradeId);
            return res?.data;
        },
        enabled: !!gradeId
    })
    return {
        gradeDetails: gradeDetails?.data,
        isLoading: gradeDetails?.isLoading
    }
}