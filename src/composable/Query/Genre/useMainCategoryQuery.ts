import { getAllMainCategories } from "@/http/apis/genres/mainCategoryApi"
import type { MainCategoryResponse } from "@/types/response/genres/mainCategoryResponse";
import { useQuery } from "@tanstack/react-query"

export const useMainCategoryQuery = () => {
    const mainCategoryList = useQuery<MainCategoryResponse[]>({
        queryKey: ['mainCategoryList'],
        queryFn: async () => {
            const res = await getAllMainCategories();
            return res?.data;
        }
    })
    return {
        mainCategoryList: mainCategoryList?.data,
        isLoading: mainCategoryList?.isLoading
    }
}