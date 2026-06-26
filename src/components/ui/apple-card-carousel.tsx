"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Eye, Flame, Heart, X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Badge } from "./badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Change items prop from ReactElement[] to raw data structures
interface Filters {
  key: string;
  value: string;
}
interface CarouselProps {
  items: CardType[];
  initialScroll?: number;
  header?: string;
  layoutScope?: string;
  type?: string;
  filters?: Filters[];
  activeTab?: string;
  setActiveTab: (tab: string) => void; // Correct: A function that takes a string and returns nothing
}

type CardType = {
  src: string;
  title: string;
  category: string;
  sub_category_id: number;
  thumbnail: string;
  likes?: number;
  views?: number;
  content: React.ReactNode;
  id?: string | number;
  name?: string;
  createdBy?: string;
  createdByUser?: {
    id: number;
    name: string;
  };
  generes?: {
    id: number;
    name?: string;
  }[];
  horizontal_thumbnail?: string;
};

const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  header,
  items = [],
  initialScroll = 0,
  layoutScope = "default",
  filters,
  activeTab,
  setActiveTab,
}: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = React.useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      const frameId = requestAnimationFrame(() => {
        checkScrollability();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [initialScroll, items, checkScrollability]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 200;
      const gap = 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div className="mx-auto max-w-7xl flex items-center justify-between w-full">
          {header && (
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold">
                {header} ({items.length})
              </h2>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 disabled:opacity-50 transition-opacity"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            </button>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 disabled:opacity-50 transition-opacity"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ArrowRight className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            </button>

            <Select
              defaultValue={activeTab}
              onValueChange={(value) => setActiveTab(value)}
            >
              <SelectTrigger className=" bg-card">
                <SelectValue placeholder={activeTab} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filters?.map((c) => (
                    <SelectItem key={c.key} value={c.value}>
                      {c.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-6 [scrollbar-width:none] md:py-10"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
            )}
          />
          <div
            className={cn(
              "flex flex-row justify-start gap-4",
              "mx-auto max-w-7xl w-full",
            )}
          >
            {items.map((card, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                    ease: "easeOut",
                  },
                }}
                key={`${layoutScope}-motion-item-${card.id || card.title || index}`}
                className="rounded-xl last:pr-[5%] md:last:pr-[33%]"
              >
                {/* FIX 2: Explicitly pass the correct scoped parameters right here */}
                <Card
                  card={card}
                  index={index}
                  layout={true}
                  layoutScope={layoutScope}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
  layoutScope = "default",
}: {
  card: CardType;
  index: number;
  layout?: boolean;
  layoutScope?: string;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      // Get scrollbar width to prevent layout shifting
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <>
      {/* mode="wait" ensures smooth exit handoffs */}
      <AnimatePresence mode="wait">
        {open && (
          <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden pt-10 pb-20">
            {/* Backdrop: Opacity fading is perfectly fine here */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 h-full w-full bg-black/60 backdrop-blur-md"
            />

            {/* Main Modal Card: Removed initial/animate/exit/transition to let layoutId shine */}
            <motion.div
              ref={containerRef}
              layoutId={
                layout ? `${layoutScope}-card-${card.title}` : undefined
              }
              className="relative z-[60] mx-auto w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-0 font-sans shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900"
            >
              {/* Floating Close Button */}
              <button
                className="absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Hero Image Container */}
              <div className="relative aspect-auto w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <motion.div
                  layoutId={
                    layout
                      ? `${layoutScope}-thumbnail-${card.horizontal_thumbnail}`
                      : undefined
                  }
                  className="h-100 w-full"
                >
                  <img
                    src={card.thumbnail ?? card.horizontal_thumbnail}
                    alt={card.title}
                    className="h-full w-full object-cover object-center"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-10">
                {card.generes && card.generes.length > 0 && (
                  <motion.div
                    layoutId={
                      layout
                        ? `${layoutScope}-genre-${card.sub_category_id}`
                        : undefined
                    }
                    className="flex flex-wrap gap-1.5 mb-4"
                  >
                    {card.generes.map((g, idx) => (
                      <Badge
                        key={idx}
                        variant="default"
                        className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
                      >
                        {g.name}
                      </Badge>
                    ))}
                  </motion.div>
                )}

                <motion.h2
                  layoutId={
                    layout ? `${layoutScope}-title-${card.title}` : undefined
                  }
                  className="text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl dark:text-neutral-50"
                >
                  {card.title}
                </motion.h2>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-6 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <motion.span
                      layoutId={
                        layout
                          ? `${layoutScope}-author-${card.createdBy}`
                          : undefined
                      }
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-neutral-400">By</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {card.createdByUser?.name}
                      </span>
                    </motion.span>

                    <span className="hidden h-4 w-px bg-neutral-200 dark:bg-neutral-700 md:inline" />

                    <motion.span
                      layoutId={
                        layout
                          ? `${layoutScope}-category-${card.title}`
                          : undefined
                      }
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-neutral-400">In</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {card.category}
                      </span>
                    </motion.span>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full dark:bg-neutral-800/50">
                      <Eye className="h-4 w-4 text-neutral-400" />
                      {card?.views || 0}
                    </span>
                    <span className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full dark:bg-neutral-800/50">
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500/10" />
                      {card?.likes || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card?.content || "No description available for this title."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Button Trigger */}
      <motion.button
        layoutId={layout ? `${layoutScope}-card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-80 w-80 flex-col items-start justify-end overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-900 shadow-md group"
      >
        <div className="absolute top-6 left-6 z-40 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-sans text-xs md:text-sm font-semibold selection:bg-transparent">
          {displayIndex}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity group-hover:from-black/95" />

        <div className="relative z-40 p-6 mt-auto w-full flex flex-col gap-2.5">
          <motion.p
            layoutId={
              layout ? `${layoutScope}-category-${card.title}` : undefined
            }
            className="text-left font-sans text-sm font-medium text-white md:text-base"
          >
            <Badge>{card.category}</Badge>
          </motion.p>

          <motion.p
            layoutId={layout ? `${layoutScope}-title-${card.title}` : undefined}
            className="text-left font-sans text-xl font-semibold [text-wrap:balance] text-white leading-snug"
          >
            {card.title}
          </motion.p>

          <div className="grid grid-cols-2 w-full pt-3 mt-1 border-t border-white/10 text-white/90 text-xs md:text-sm font-sans tracking-wide">
            <div className="flex items-center gap-1.5 justify-start">
              <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-neutral-300" />
              <span>{card?.views?.toLocaleString() || 0}</span>
            </div>

            <div className="flex items-center gap-1.5 justify-end">
              <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-rose-400 fill-rose-400/10" />
              <span>{card?.likes?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <BlurImage
          src={card.thumbnail}
          alt={card.title}
          height={200}
          width={200}
          fill
          className="absolute inset-0 z-10 object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
        />
      </motion.button>
    </>
  );
};

const BlurImage = ({ height, width, src, className, alt, ...rest }: any) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background view"}
      {...rest}
    />
  );
};
