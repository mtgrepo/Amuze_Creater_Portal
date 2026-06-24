import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Eye, Heart } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  header,
  category,
  likes,
  views,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: string;
  category?: React.ReactNode;
  likes?: number | string;
  views?: number | string;
}) => {
  return (
    <article
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-200 hover:shadow-xl dark:border-white/20 dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {/* Full-Width Image Container */}
      {header && (
        <div className="w-full aspect-auto overflow-hidden">
          <img
            src={header}
            alt={typeof title === "string" ? title : "Content image"}
            className="w-full h-full object-cover object-center transition duration-300 group-hover/bento:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4  transition duration-200 group-hover/bento:translate-x-1">
        {category && (
          <div className="mb-2">
            <Badge>{category}</Badge>
          </div>
        )}
        
        <h3 className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2">
          {title}
        </h3>
        
        {/* <p className="font-sans text-xs font-normal text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {description}
        </p> */}

        {/* Stats Footer - Pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/10 grid grid-cols-2 w-full text-neutral-500 dark:text-neutral-400 text-xs md:text-sm font-sans tracking-wide">
          <div className="flex items-center gap-1.5 justify-start">
            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-400" />
            <span>{views?.toLocaleString() || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-rose-500 fill-rose-500/10" />
            <span>{likes?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
};