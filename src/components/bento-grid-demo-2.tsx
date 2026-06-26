import { TrendingUp, Eye, Heart } from "lucide-react";
import { Badge } from "./ui/badge";

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

export default function TrendingNewsDashboard({ items }: BentoProps) {
  const displayItems = items?.slice(0, 5) || [];

  return (
    <div className="mx-auto w-full max-w-7xl py-8 antialiased">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8 border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <TrendingUp className="h-5 w-5 text-orange-500 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Weekly Hot Contents
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Discover the most engaging updates this week
            </p>
          </div>
        </div>
        <Badge variant="outline" className="font-semibold text-orange-500 border-orange-500/20 bg-orange-500/5 px-2.5 py-1">
          Top 5
        </Badge>
      </div>

      {/* Main Grid: Asymmetric widths layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-stretch">
        
        {/* LEFT COLUMN (Items 1 & 2): Spans 3/5 width, has 2 rows */}
        <div className="xl:col-span-3 flex flex-col gap-4 h-full justify-between">
          {displayItems.slice(0, 2).map((item, i) => (
            <div
              key={item.id || `left-row-${i}`}
              className="group relative flex flex-row items-center gap-4 bg-white dark:bg-neutral-900/40 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/60 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex-1 xl:p-5"
            >
              {/* Thumbnail image framed left - Scaled up significantly on desktop via xl:w-40 xl:h-40 */}
              {item.thumbnail && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 xl:w-40 xl:h-40 rounded-xl overflow-hidden shrink-0 relative bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              )}

              {/* Card Meta & Text details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                    {item.category || "Trending"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500 text-[11px] font-bold">#{i + 1}</span>
                    {/* <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 -translate-x-0.5 translate-y-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 hidden sm:block" /> */}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5 mt-0.5 line-clamp-1 transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400 xl:text-base xl:font-bold xl:mb-1">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400/80 line-clamp-1 mb-1 xl:line-clamp-2 xl:leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Engagement counts */}
                <div className="flex gap-4 mt-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 xl:mt-2.5">
                  <span className="flex items-center gap-1 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300">
                    <Eye className="h-3 w-3 stroke-[1.8] xl:h-3.5 xl:w-3.5" /> {item.views || 0}
                  </span>
                  <span className="flex items-center gap-1 transition-colors hover:text-rose-500">
                    <Heart className="h-3 w-3 text-rose-400/80 stroke-[1.8] xl:h-3.5 xl:w-3.5" /> {item.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN (Items 3, 4, & 5): Spans 2/5 width, has 3 rows */}
        <div className="xl:col-span-2 flex flex-col gap-4 h-full justify-between">
          {displayItems.slice(2, 5).map((item, i) => (
            <div
              key={item.id || `right-row-${i}`}
              className="group relative flex flex-row items-center gap-4 bg-white dark:bg-neutral-900/40 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/60 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex-1"
            >
              {/* Thumbnail image framed left - Kept standard size */}
              {item.thumbnail && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 relative bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              )}

              {/* Card Meta & Text details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                    {item.category || "Trending"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500 text-[11px] font-bold">#{i + 3}</span>
                    {/* <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 -translate-x-0.5 translate-y-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 hidden sm:block" /> */}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5 mt-0.5 line-clamp-1 transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400/80 line-clamp-1 mb-1">
                    {item.description}
                  </p>
                )}

                {/* Engagement counts */}
                <div className="flex gap-4 mt-1.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                  <span className="flex items-center gap-1 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300">
                    <Eye className="h-3 w-3 stroke-[1.8]" /> {item.views || 0}
                  </span>
                  <span className="flex items-center gap-1 transition-colors hover:text-rose-500">
                    <Heart className="h-3 w-3 text-rose-400/80 stroke-[1.8]" /> {item.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}