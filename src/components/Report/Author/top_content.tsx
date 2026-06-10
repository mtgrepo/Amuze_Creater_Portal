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
import { useState } from "react";

export const filterTypes = [
  { key: "Most Views", value: "views" },
  { key: "Most Likes", value: "likes" },
  { key: "Most Comments", value: "comments" },
];

export const dummyCards: any[] = [
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60",
    title: "Exploring the Coastline",
    category: "Novel",
    sub_category_id: 1,
    likes: 1240,
    views: 5430,
    content: (
      <p>
        Discover the hidden beaches and breathtaking cliffs along the Pacific
        Coast Highway.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    title: "The Future of Web Development",
    category: "Muze Box",
    sub_category_id: 2,
    likes: 890,
    views: 3120,
    content: (
      <div className="flex flex-col gap-2">
        <p>
          AI-driven code generation and edge computing are changing the
          landscape fast.
        </p>
        <button className="mt-2 w-fit bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium">
          Read Article
        </button>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
    thumbnail:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60",
    title: "10-Minute Morning Meditation",
    category: "Comics",
    sub_category_id: 3,
    likes: 954,
    views: 2110,
    content: (
      <p>
        A quick guide to grounding yourself before starting a busy, fast-paced
        workday.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
    thumbnail:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60",
    title: "Chasing Abstract Realities",
    category: "Novel",
    sub_category_id: 1,
    likes: 430,
    views: 1290,
    content: (
      <p>
        Dive deep into modern digital expressionism and blending AI with
        brushstrokes.
      </p>
    ),
  },
];

export default function TopContent() {
  const [activeTab, setActiveTab] = useState(filterTypes[0].value);
  const { topContentList, isLoading } = useTopContentQuery({ type: activeTab})
  return (
    <div>
      <div className="flex flex-col gap-4 border border-border/50  mx-4 p-4 rounded-2xl">
        {/* Refactored Section Header Layout */}
        <div className="flex items-center justify-end px-4 lg:px-6">
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
