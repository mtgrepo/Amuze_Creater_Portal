import { useDropzone } from "react-dropzone";
import { X, Play } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export type MediaItem = {
  id: string;
  file?: File;
  url?: string;
  alt: string;
  type?: string;
};

type MediaUploadProps = {
  value?: MediaItem[];
  onChange: (items: MediaItem[]) => void;
};

const getFileType = (file: File) => {
  if (file.type.startsWith("image")) return "image";
  if (file.type.startsWith("video")) return "video";
  return "unknown";
};



export function MediaUpload({ value = [], onChange }: MediaUploadProps) {
  const hasVideo = value.some((v) => v.type === "video");
  const hasMaxImages = value.filter((v) => v.type === "image").length >= 10;
  const isDisabled = hasVideo || hasMaxImages;
  const onDrop = (acceptedFiles: File[]) => {
    let currentItems = value || [];

    const currentImages = currentItems.filter((i) => i.type === "image");
    const currentVideos = currentItems.filter((i) => i.type === "video");

    const newItems: MediaItem[] = [];

    for (const file of acceptedFiles) {
      const type = getFileType(file);

      if (
        (type === "video" && currentImages.length > 0) ||
        (type === "image" && currentVideos.length > 0)
      ) {
        toast.warning("You cannot upload images and a video together.");
        return;
      }

      if (type === "video" && currentVideos.length >= 1) {
        toast.warning("Only 1 video is allowed.");
        return;
      }

      if (type === "image" && currentImages.length >= 10) {
        toast.warning("Maximum 10 images allowed.");
        return;
      }

      newItems.push({
        id: crypto.randomUUID(),
        file,
        alt: "",
        type,
      });

      if (type === "image") currentImages.push({} as any);
      if (type === "video") currentVideos.push({} as any);
    }
    onChange([...currentItems, ...newItems]);
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

  const removeItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
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

  const getType = (item: MediaItem) => {
    if (item.file) {
      if (item.file.type.startsWith("image")) return "image";
      if (item.file.type.startsWith("video")) return "video";
    }
    return item.type;
  };


  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
        ${isDisabled
            ? "opacity-50 cursor-not-allowed bg-muted"
            : isDragActive
              ? "border-primary bg-primary/10 cursor-pointer"
              : "border-muted-foreground/30 hover:bg-muted/30 cursor-pointer"
          }`}
      >
        <input {...getInputProps()} />

        <p className="text-sm font-medium">
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop images/videos here, or click to upload"}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Maximum: 10 images or 1 video. You cannot upload images and a video together.
        </p>
      </div>

      <div className="space-y-4 mt-4">
        {value?.map((item: MediaItem, index: number) => {
          return (
            <div
              key={item.id}
              className="relative flex gap-4 border rounded-xl p-3 bg-card shadow-sm"
            >
              <button
                type="button"
                className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center 
              rounded-full bg-background/80 hover:bg-red-500 hover:text-white 
              transition text-sm shadow"
                onClick={() => removeItem(index)}
              >
                <X size={16} />
              </button>

              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 relative">

                {(() => {
                  const src = getPreviewSrc(item);
                  const type = getType(item);

                  if (!src) {
                    return (
                      <span className="text-xs text-muted-foreground">
                        No preview
                      </span>
                    );
                  }

                  if (type === "image") {
                    return (
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                      />
                    );
                  }

                  if (type === "video") {
                    return (
                      <>
                        <video
                          src={src}
                          muted
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-background/60 p-1 rounded-full">
                            <Play size={12} />
                          </div>
                        </div>
                      </>
                    );
                  }

                  return (
                    <span className="text-xs text-muted-foreground">
                      Unsupported
                    </span>
                  );
                })()}

              </div>

              <div className="flex-1">
                <Textarea
                  className="w-100"
                  placeholder="Add a caption..."
                  value={item.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}