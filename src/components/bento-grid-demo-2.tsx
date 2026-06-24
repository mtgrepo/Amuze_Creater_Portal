import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TrendingUp } from "lucide-react";

type BentoItem = {
  id?: string | number;
  title: string;
  description?: string;
  header?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  src?: string;
  category?: string;
  sub_category_id?: number;
  thumbnail?: string;
  likes?: number | string;
  views?: number | string;
  content?: React.ReactNode;
  name?: string;
  createdBy?: string;
};

type BentoProps = {
  items: BentoItem[];
};

export default function BentoGridSecondDemo({ items }: BentoProps) {
  // console.log("items", items)
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-orange-500 fill-orange-500" />
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          Weekly Hot Contents 5
        </h2>
      </div>
<BentoGrid className="mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[18rem] md:auto-rows-[20rem]">
  {items?.map((item: BentoItem, i: number) => {
    let dynamicColSpan = "";

    if (i === 0 || i === 1) {
      dynamicColSpan = "md:col-span-2 lg:col-span-3";
    } else {
      dynamicColSpan = "md:col-span-2 lg:col-span-2";
    }

    return (
      <BentoGridItem
        key={item.id || i}
        title={item.title}
        description={item.description}
        header={item.thumbnail}
        className={`${dynamicColSpan} ${item.className || ""}`}
        category={item.category}
        likes={item.likes || 0}
        views={item.views || 0}
      />
    );
  })}
</BentoGrid>
    </>
  );
}
