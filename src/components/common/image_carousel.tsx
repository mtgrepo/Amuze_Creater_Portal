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
import { cn } from "@/lib/utils";

export function ImageCarousel({ images }: { images: { id: number, url: string, alt: string }[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const showNavigation = images.length > 3;

    // Track the current slide index
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
        <div className="relative w-full max-w-5xl mx-auto px-4 md:px-10">
            {/* Page counter at the top corner */}
            {showNavigation && (
                <div className="text-center mb-4 text-sm font-medium text-muted-foreground">
                    Showing {current} of {images.length}
                </div>
            )}

            <Carousel
                setApi={setApi}
                opts={{
                    align: showNavigation ? "start" : "center",
                    loop: showNavigation,
                    watchDrag: showNavigation,
                }}
                className="w-full"
            >
                <CarouselContent
                    className={cn("-ml-2 md:-ml-4", !showNavigation && "justify-center")}
                >
                    {images.map((image, index) => (
                        <CarouselItem
                            key={image.id}
                            className={cn(
                                "pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3",
                                !showNavigation && "md:basis-1/3 sm:basis-1/2"
                            )}
                        >
                            <div className="p-1 relative group">
                                <Card
                                    className="overflow-hidden cursor-pointer hover:ring-2 ring-secondary transition-all active:scale-95"
                                    onClick={() => setSelectedImage(image.url)}
                                >
                                    <CardContent className="flex aspect-3/4 items-center justify-center p-0 relative">
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-bold z-10">
                                            PAGE {index + 1}
                                        </div>

                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="object-cover w-full h-full"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {showNavigation && (
                    <div className="hidden md:block">
                        <CarouselPrevious className="-left-12" />
                        <CarouselNext className="-right-12" />
                    </div>
                )}
            </Carousel>

            {/* Expanded Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-10"
                    onClick={() => setSelectedImage(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20 z-110"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="h-8 w-8" />
                    </Button>
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-full rounded-md shadow-2xl object-contain animate-in zoom-in-95 duration-300"
                        alt="Expanded view"
                    />
                </div>
            )}
        </div>
    );
}