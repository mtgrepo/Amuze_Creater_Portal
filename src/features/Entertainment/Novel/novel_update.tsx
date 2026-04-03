import { useLocation, useParams } from "react-router-dom";
import NovelForm from "../../../components/Entertainment/Novel/novel_form";
import { useNovelDetailsQuery } from "../../../composable/Query/Entertainment/Novel/useNovelDetailsQuery";

export default function UpdateNovel() {
    const { state } = useLocation();
    const { id } = useParams();

    // const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
    // const creator = loginCreator?.creator;
    // const userId = Number(creator?.id);
    // const roleId = Number(creator?.role_id);
    // const payload = {
    //     id: id!,
    //     roleId: roleId,
    //     userId: userId,
    // };

    // Fetch details in case the user refreshes the page and 'state' is lost
    //   const { titleDetails, isLoading } = useComicsTitleDetailsQuery(payload);

    const { novelDetails, isNovelDetailsLoading } = useNovelDetailsQuery(Number(id));

    // Merge state and API data, prioritizing API data once it arrives
    const novel = novelDetails || state;

    if (isNovelDetailsLoading && !novel) return <p>Loading...</p>;
    return (
        <div className="p-6">
            <NovelForm
                mode="edit"
                defaultValues={{
                    id: id,
                    name: novel?.name,
                    description: novel?.description,
                    price: novel?.price,
                    generes: novel?.generes?.map((g: any) => g.id.toString()) || [],
                    age_rating: novel?.age_rating,
                    preview: novel?.preview,
                    file_path: novel?.file_path,
                    thumbnail: novel?.thumbnail,
                    horizontal_thumbnail: novel?.horizontal_thumbnail,
                }}
            />
        </div>
    );
}
