import { Carousel } from "@/components/ui/apple-card-carousel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTopContentQuery } from "@/composable/Query/Report/useTopContentQuery";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

export const filterTypes = [
  { key: "Most Views", value: "views" },
  { key: "Most Likes", value: "likes" },
  { key: "Most Comments", value: "comments" },
];

export default function TopContent() {
  const [activeTab, setActiveTab] = useState(filterTypes[0].value);
  const { topContentList, isLoading } = useTopContentQuery({ type: activeTab });
  return (
    <div>
      <div className="flex flex-col gap-4 border border-border/50  mx-4 p-4 rounded-2xl">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500 fill-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Top Contents by {activeTab}{" "}
              {topContentList?.length ? `(${topContentList.length})` : ""}
            </h2>
          </div>
          <Select
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <SelectTrigger className="w-40 bg-card">
              <SelectValue placeholder={activeTab} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterTypes?.map((c) => (
                  <SelectItem key={c.key} value={c.value}>
                    {c.key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        {/* Carousel Content Container */}
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground w-full">
            Loading contents...
          </div>
        ) : (
          <Carousel
            key={`top-${activeTab}-contents-${topContentList?.length || 0}`}
            header={``}
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
