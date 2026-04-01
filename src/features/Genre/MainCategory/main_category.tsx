import { MainCategoryTable } from "@/components/Genres/MainCategory/main_category_component";
import { useMainCategoryQuery } from "@/composable/Query/Genre/useMainCategoryQuery";

export default function MainCategory() {
  const { mainCategoryList: data } = useMainCategoryQuery();
  return (
    <div className="w-full mx-auto px-5 ">
      <MainCategoryTable data={data!} />
    </div>
  );
}
