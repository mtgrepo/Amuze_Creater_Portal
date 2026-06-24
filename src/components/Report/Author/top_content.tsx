import { Carousel } from "@/components/ui/apple-card-carousel";
import { useTopContentQuery } from "@/composable/Query/Report/useTopContentQuery";
import { useState } from "react";

export const filterTypes = [
  { value: "Most Views", key: "views" },
  { value: "Most Likes", key: "likes" },
  { value: "Most Comments", key: "comments" },
];

export default function TopContent() {
  const [activeTab, setActiveTab] = useState(filterTypes[0].value);
  const { topContentList, isLoading } = useTopContentQuery({ type: activeTab });
  return (
    <div>
      <div className="flex flex-col gap-4 border border-border/50  mx-4 p-4 rounded-2xl">
        {/* Carousel Content Container */}
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground w-full">
            Loading contents...
          </div>
        ) : (
          <Carousel
            key={`top-${activeTab}-contents-${topContentList?.length || 0}`}
            header={`Top Contents`}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filters={filterTypes}
            layoutScope="popular-category"
            items={(topContentList || []).map((item: any, idx: number) => ({
              ...item,
              likes: item.likes || 0,
              views: item.views || 0,
              thumbnail:
                item.thumbnail ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
              title: item.title || item.name || `Untitled Content ${idx + 1}`,
              category: item.category || activeTab,
              content: item.content || (
                <p>{item.description || "No content preview available."}</p>
              ),
              id: item.id || `popular-item-${idx}`,
              createdBy: item?.createdByUser?.name,
            }))}
          />
        )}
      </div>
    </div>
  );
}
