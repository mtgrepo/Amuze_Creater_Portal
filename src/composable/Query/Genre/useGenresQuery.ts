import { getAllGenres, getGenresBySubCategory, type GenreResponse } from "@/http/apis/genres/genresApi";
import { useQuery } from "@tanstack/react-query"

export const useGenresQuery = (genreId: number) => {
    const genresList = useQuery<GenreResponse[]>({
        queryKey: ['genresList'],
        queryFn: async () => {
            const res = await getAllGenres(genreId);
            return res
        }
    })
    return {
        genresList: genresList?.data,
        isLoading: genresList?.isLoading
    }
}

export const useGenresBySubCategoryQuery = (subcategory_id: number) => {
    const genresList = useQuery<GenreResponse[]>({
        queryKey: ['genresList'],
        queryFn: () => getGenresBySubCategory(subcategory_id)
    });
    return{
        genresList: genresList?.data,
        isLoading: genresList?.isLoading
    }
}