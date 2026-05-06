import { useDropzone } from "react-dropzone";
import { X, Play, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import LongText from "./longtext";

export type MediaItem = {
  id?: string;
  mediaId?: string;
  file?: File;
  url?: string;
  alt?: string;
  type?: string;
};

type MediaUploadProps = {
  value?: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  mode: "add" | "edit";
  onDelete?: (mediaId: number) => void;
};

const getFileType = (file: File) => {
  if (file.type.startsWith("image")) return "image";
  if (file.type.startsWith("video")) return "video";
  return "unknown";
};

const getItemType = (item: MediaItem) => {
  if (item.file) return getFileType(item.file);
  if (item.type) return item.type;
  if (item.url?.match(/\.(mp4|webm|ogg)$/i)) return "video";
  return "image";
};

export function MediaUpload({
  value = [],
  onChange,
  mode = "add",
  onDelete,
}: MediaUploadProps) {
  // const hasVideo = value.some((v) => v.type === "video");
  // const hasMaxImages = value.filter((v) => v.type === "image").length >= 10;
  const hasVideo = value.some((v) => getItemType(v) === "video");

const hasMaxImages =
  value.filter((v) => getItemType(v) === "image").length >= 10;
  const isDisabled = hasVideo || hasMaxImages;

  const onDrop = (acceptedFiles: File[]) => {
    const currentItems = [...(value || [])];

    console.log("current item", currentItems);

    const incomingItems = acceptedFiles.map((file) => ({
      type: getFileType(file),
    }));

    const allItems = [
      ...currentItems.map((i) => ({
        type: i.file ? getFileType(i.file) : i.type,
      })),
      ...incomingItems,
    ];

    const imageCount = allItems.filter((i) => i.type === "image").length;
    const videoCount = allItems.filter((i) => i.type === "video").length;

    console.log("current images", imageCount);
    console.log("current video", videoCount);

    const newItems: MediaItem[] = [];

    for (const file of acceptedFiles) {
      const type = getFileType(file);

      if (imageCount > 0 && videoCount > 0) {
        toast.warning("You cannot upload images and a video together.");
        return;
      }

      if (videoCount > 1) {
        toast.warning("Only 1 video is allowed.");
        return;
      }

      if (imageCount > 10) {
        toast.warning("Maximum 10 images allowed.");
        return;
      }

      newItems.push({
        id: crypto.randomUUID(),
        file,
        alt: "",
        type,
      });
    }

    const updated = [...currentItems];

    newItems.forEach((newItem) => {
      const replaceIndex = updated.findIndex(
        (i) => i.mediaId && !i.file && !i.url,
      );

      if (replaceIndex !== -1) {
        updated[replaceIndex] = {
          ...updated[replaceIndex],
          ...newItem,
          mediaId: updated[replaceIndex].mediaId,
        };
      } else {
        updated.push(newItem);
      }
    });

    onChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: isDisabled,
    accept: {
      "image/*": [],
      "video/*": [],
    },
  });

  const removeItem = async (index: number) => {
    const target = value[index];
    if (mode === "edit" && target.mediaId) {
      onDelete?.(Number(target.mediaId));
    }
    const updated = value.filter((_, i) => i !== index);
    onChange([...updated]);
  };

  const updateAlt = (index: number, alt: string) => {
    const updated = [...value];
    updated[index].alt = alt;
    onChange(updated);
  };

  const getPreviewSrc = (item: MediaItem) => {
    if (item.file) return URL.createObjectURL(item.file);
    if (item.url) return item.url;
    return null;
  };

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed bg-muted/50"
            : isDragActive
              ? "border-primary bg-primary/5 ring-4 ring-primary/5"
              : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-background rounded-full shadow-sm border">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              {isDragActive
                ? "Drop to upload"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max 10 images or 1 video (Images and videos cannot mix)
            </p>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {value?.map((item: MediaItem, index: number) => {
            const isReadOnly = mode === "edit" && !!item.mediaId;
            const src = getPreviewSrc(item);
            const type = item.file ? getFileType(item.file) : item.type;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col gap-0 border rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                rounded-full bg-background/80 text-destructive backdrop-blur-md shadow-sm border
                transition-all z-20 opacity-0 group-hover:opacity-100"
                  onClick={() => removeItem(index)}
                >
                  <X size={16} />
                </button>

                <div className="aspect-video w-full bg-muted flex items-center justify-center relative overflow-hidden">
                  {src ? (
                    type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={src}
                          className="w-full h-full object-cover"
                          controls={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                          <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30">
                            <Play
                              size={24}
                              className="text-white fill-current"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        No Preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-card">
                  {isReadOnly ? (
                    item.alt && (
                      <div className="space-y-1.5 p-4">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          Caption
                        </span>
                        <div className="p-3 rounded-xl bg-muted/40 border border-transparent text-sm text-foreground/80 leading-relaxed min-h-15">
                          <LongText text={item.alt} />
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="space-y-1.5 p-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Caption
                      </span>
                      <Textarea
                        className="w-full min-h-25 text-sm bg-muted/20 border-muted-foreground/10 focus:bg-background focus:ring-1 focus:ring-primary/20 resize-none rounded-xl transition-all"
                        placeholder="Add a caption..."
                        value={item.alt}
                        onChange={(e) => updateAlt(index, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
