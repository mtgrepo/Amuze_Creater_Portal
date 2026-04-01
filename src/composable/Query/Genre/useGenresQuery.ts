import { getAllGenres, type GenreResponse } from "@/http/apis/genres/genresApi";
import { useQuery } from "@tanstack/react-query"

export const useGenresQuery = () => {
    const genresList = useQuery<GenreResponse[]>({
        queryKey: ['genresList'],
        queryFn: async () => {
            const res = await getAllGenres();
            return res
        }
    })
    return {
        genresList: genresList?.data,
        isLoading: genresList?.isLoading
    }
}