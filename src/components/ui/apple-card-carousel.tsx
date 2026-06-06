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

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
  header?: string;
}

type CardType = {
  src: string;
  title: string;
  category: string;
  likes?: number;
  views?: number;
  content: React.ReactNode;
};

const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ header, items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define hook-dependent functions before they are consumed in effects
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
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

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
      const cardWidth = isMobile() ? 200 : 200;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        {/* Top Header Section with Flame icon and Buttons */}
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between w-full pt-8 md:pt-12">
          {header && (
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold">
                {header} ({items.length})
              </h2>
            </div>
          )}
          
          {/* Control Action buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 disabled:opacity-50 transition-opacity"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            </button>
            <button
              className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 disabled:opacity-50 transition-opacity"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ArrowRight className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Carousel Tracks Row layout */}
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-6 [scrollbar-width:none] md:py-10"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l")} />
          <div className={cn("flex flex-row justify-start gap-4 pl-4", "mx-auto max-w-7xl w-full")}>
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 * index, ease: "easeOut" },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
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
}: {
  card: CardType;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { onCardClose } = useContext(CarouselContext);

  // Declare handleClose cleanly at the top of the component scope
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <X className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="flex gap-4 mt-2 text-neutral-500 dark:text-neutral-400">
                <motion.p className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {card?.views || 0}
                </motion.p>
                <motion.p className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {card?.likes || 0}
                </motion.p>
              </div>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-80 w-80 flex-col items-start justify-end overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 shadow-md group"
      >
        <div className="absolute top-6 left-6 z-40 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-sans text-xs md:text-sm font-semibold selection:bg-transparent">
          {displayIndex}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity group-hover:from-black/95" />
        
        <div className="relative z-40 p-6 mt-auto w-full flex flex-col gap-2.5">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-sm font-medium text-white md:text-base"
          >
            <Badge>{card.category}</Badge>
          </motion.p>
          
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
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
          src={card.src}
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

const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: any) => {
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