import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface ImageItem {
  id: number;
  url: string;
  alt: string;
}

export function ImageCarousel({ images }: { images: ImageItem[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        // Use a timeout to move the initial state update out of the synchronous execution thread
        const timeoutId = setTimeout(() => {
            setCurrent(api.selectedScrollSnap() + 1);
        }, 0);

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap() + 1);
        };

        api.on("select", onSelect);

        return () => {
            clearTimeout(timeoutId);
            api.off("select", onSelect);
        };
    }, [api]);

  return (
    <div className="grid grid-cols-1 min-w-0 w-full relative mx-auto px-4 md:px-12">
      {/* Top Counter (Optional, you can keep or remove this now) */}
      {images.length > 1 && (
        <div className="text-center mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-70">
          Showing {current} of {images.length}
        </div>
      )}

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          watchDrag: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => (
            <CarouselItem
              key={image.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="p-1">
                <Card
                  className="overflow-hidden cursor-pointer hover:ring-2 ring-primary/50 transition-all active:scale-[0.98] group bg-zinc-900/50"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <CardContent className="flex aspect-3/4 items-center justify-center p-0 relative">
                    
                    {/* --- PAGE NUMBER OVERLAY --- */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-black/70 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-md font-black shadow-lg border border-white/10">
                        {index + 1}
                      </div>
                    </div>

                    {/* VIEW PAGE HOVER TEXT */}
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded-md font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                      VIEW FULL
                    </div>

                    <img
                      src={image.url}
                      alt={image.alt}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-700"
                      loading="lazy"
                    />
                    
                    {/* Subtle bottom gradient to make the page number pop if image is white */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10" />
            <CarouselNext className="hidden md:flex -right-12 h-10 w-10" />
          </>
        )}
      </Carousel>

      {/* Lightbox remains the same */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 text-white hover:bg-white/10 z-110"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="h-8 w-8" />
          </Button>
          <img
            src={selectedImage}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            alt="Expanded view"
          />
        </div>
      )}
    </div>
  );
}