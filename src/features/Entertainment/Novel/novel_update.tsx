import { useLocation, useParams } from "react-router-dom";
import NovelForm from "../../../components/Entertainment/Novel/novel_form";
import { useNovelDetailsQuery } from "../../../composable/Query/Entertainment/Novel/useNovelDetailsQuery";

export default function UpdateNovel() {
  const { state } = useLocation();
  const { id } = useParams();

  const { novelDetails, isNovelDetailsLoading } = useNovelDetailsQuery(
    Number(id),
  );

  const novel = novelDetails || state;

  if (isNovelDetailsLoading || !novel) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading novel data...</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <NovelForm
        mode="edit"
        defaultValues={{
          id: id,
          name: novel.name,
          description: novel.description,
          price: novel.price,
          generes: novel.generes?.map((g: any) => g.id.toString()) || [],
          age_rating: novel.age_rating,
          preview: novel.preview,
          file_path: novel.file_path,
          thumbnail: novel.thumbnail,
          horizontal_thumbnail: novel.horizontal_thumbnail,
        }}
      />
    </div>
  );
}
