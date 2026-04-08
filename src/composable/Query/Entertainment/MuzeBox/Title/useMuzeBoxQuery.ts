import { getAllMuzeBox, type MuzeBoxParams } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import { useQuery } from "@tanstack/react-query"

export const useMuzeBoxQuery = (params: MuzeBoxParams) => {
    const muzeBoxList = useQuery({
        queryKey: ['muzeBoxList', params],
        queryFn: async () => {
            const res = await getAllMuzeBox(params);
            return res?.data;
        },
        enabled: !!params?.authorId
    })
    return {
        muzeBoxList: muzeBoxList?.data,
        isLoading: muzeBoxList?.isLoading
    }
}