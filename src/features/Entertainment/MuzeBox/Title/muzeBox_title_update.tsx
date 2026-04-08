import MuzeBoxForm from "@/components/Entertainment/MuzeBox/Title/muzeBox_form";
import { useMuzeBoxTitleDetailsQuery } from "@/composable/Query/Entertainment/MuzeBox/Title/useMuzeBoxDetailsQuery";
import { useLocation, useParams } from "react-router-dom";

export default function UpdateMuzeBoxTitle() {
    const { state } = useLocation();
    const { id } = useParams();

    const { titleDetails, isLoading } = useMuzeBoxTitleDetailsQuery(Number(id)!)
    // Merge state and API data, prioritizing API data once it arrives
    const muzeBox = titleDetails || state;

    if (isLoading && !muzeBox) return <p>Loading...</p>;
    return (
        <div className="p-6">
            <MuzeBoxForm
                mode="edit"
                defaultValues={{
                    id: id,
                    name: muzeBox?.name,
                    description: muzeBox?.description,
                    genres: muzeBox?.genres?.map((g: any) => g.id.toString()) || [],
                    age_rating: muzeBox?.age_rating,
                    thumbnail: muzeBox?.thumbnail,
                    horizontal_thumbnail: muzeBox?.horizontal_thumbnail,
                }}
            />
        </div>
    );
}
