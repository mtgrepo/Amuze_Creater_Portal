"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FolderPlus, Image as ImageIcon, X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/common/image_upload";
import { decryptAuthData } from "@/lib/helper";
import router from "@/router/routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

// Hooks
import { useComicsEpisodeCreateCommand } from "@/composable/Command/Entertainment/Comics/useComicsEpisodeCreateCommand";
import { useComicEpisodeUpdateCommand } from "@/composable/Command/Entertainment/Comics/useComicsEpisodeUpdateCommand";
import { useComicEpisodeThumbnailUpdateCommand } from "@/composable/Command/Entertainment/Comics/useEpisodeThumbnailUpdateCommand";
import { useEpisodeDeleteCommand } from "@/composable/Command/Entertainment/Comics/useEpisodeImageDeleteCommand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// --- SCHEMA ---
function createEpisodeSchema(mode: "add" | "edit") {
  const fileSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Episode name is required."),
    title_id: z.union([z.string(), z.number()]),
    price: z.number().min(0, "Price cannot be negative"),
    thumbnail: fileSchema,
    images: z.array(z.any()).min(1, "At least one page image is required"),
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type EpisodeFormValues = z.infer<ReturnType<typeof createEpisodeSchema>>;

interface EpisodeFormProps {
  mode: "add" | "edit";
  comicTitleId: string | number;
  defaultValues?: Partial<EpisodeFormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function ComicEpisodeForm({
  mode,
  comicTitleId,
  defaultValues,
  onSuccess,
}: EpisodeFormProps) {
  const formSchema = createEpisodeSchema(mode);

  // INITIALIZE FORM
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      title_id: comicTitleId,
      price: defaultValues?.price ?? 0,
      thumbnail: defaultValues?.thumbnail || undefined,
      images: defaultValues?.images || [],
      created_by: "",
    },
  });

  // API COMMANDS
  const { episodeMutation, isPending: createPending } = useComicsEpisodeCreateCommand();
  const { episodeMutation: updateMutation, isPending: updatePending } = useComicEpisodeUpdateCommand();
  const { episodeThumbnailMutation, isPending: thumbnailPending } = useComicEpisodeThumbnailUpdateCommand();
  const { deleteImageMutation, isPending: deletePending } = useEpisodeDeleteCommand();

  //  HELPERS
  const removeImage = async (index: number) => {
    const currentImages = form.getValues("images");
    const imageToRemove = currentImages[index];

    // Check if it's an existing image object from the server
    const isExistingOnServer = imageToRemove?.id && !(imageToRemove instanceof File);

    if (mode === "edit" && isExistingOnServer) {

      try {
        await deleteImageMutation({
          episodeId: Number(defaultValues?.id),
          imageId: imageToRemove.id,
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to delete image");
        return;
      }
    }

    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  // AUTH SYNC
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("creator");
      if (storedData) {
        const loginCreator = decryptAuthData(storedData);
        const id = loginCreator?.creator?.id;
        if (id) form.setValue("created_by", id);
      }
    } catch (error) {
      console.error("Auth sync error:", error);
    }
  }, [form]);

  //  ONSUBMIT
  const onSubmit = async (values: EpisodeFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("title_id", String(values.title_id));
      formData.append("price", String(values.price));
      formData.append("created_by", String(values.created_by));

      // Only append new Files to 'images'
      values.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      if (mode === "add") {
        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        }
        await episodeMutation(formData);
      } else {
        // Edit Mode Logic
        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
          await episodeThumbnailMutation({
            id: Number(defaultValues?.id),
            data: formData,
          });
        } else {
          await updateMutation({
            id: Number(defaultValues?.id),
            data: formData,
          });
        }
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "An error occurred during submission");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 border rounded-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <FolderPlus className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase italic ">
              {mode === "add" ? "New Episode" : "Edit Episode"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Upload pages and manage episode details.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* COVER SECTION */}
          <section className="flex flex-col items-center justify-center">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center text-center">
                  <FormLabel className="text-sm uppercase font-bold tracking-widest text-muted-foreground mb-4">
                    Episode Cover
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      size="large"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* METADATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold ">Episode Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Chapter 05: The Storm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold ">Price (Coins)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter price"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* PAGES SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 ">
                <ImageIcon size={20} className="text-primary" />
                <h3 className="text-lg font-bold">Comic Pages</h3>
                <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold border border-primary/20">
                  {form.watch("images")?.length || 0} Pages
                </span>
              </div>

              <div className="relative">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus size={16} /> Add Pages
                </Button>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const current = form.getValues("images") || [];
                    form.setValue("images", [...current, ...files], {
                      shouldValidate: true,
                    });
                  }}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="border border-border rounded-[1.5rem] p-4">
                      {field.value && field.value.length > 0 ? (
                        <ScrollArea className="h-[50vh] pr-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {field.value.map((img: any, index: number) => {
                              const url = img instanceof File
                                ? URL.createObjectURL(img)
                                : (img?.url || img);

                              const isExisting = img?.id && !(img instanceof File);

                              return (
                                <div
                                  key={img?.id || index}
                                  className="group relative aspect-2/3 rounded-xl overflow-hidden border-2 border-border shadow-md hover:border-primary transition-all"
                                >
                                  <img
                                    src={url}
                                    alt={`Page ${index + 1}`}
                                    className="object-cover w-full h-full"
                                  />
                                  <div className="absolute inset-0 flex justify-end p-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          type="button"
                                          disabled={deletePending}

                                          className="h-8 w-8 bg-destructive  rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                                        >
                                          {deletePending && isExisting ? (
                                            <Spinner className="w-4 h-4" />
                                          ) : (
                                            <X size={16} />
                                          )}
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            from our servers.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => removeImage(index)} variant={'destructive'} className="cursor-pointer">Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                  <div className="absolute bottom-2 left-2  text-black bg-primary-foreground backdrop-blur-md text-[10px] px-2 py-0.5 rounded-md font-bold">
                                    {String(index + 1).padStart(2, "0")}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-800 rounded-[1.5rem]">
                          <ImageIcon className=" mb-2" size={32} />
                          <p className="text-sm">No pages uploaded yet</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => router.navigate(-1)}
              disabled={createPending || updatePending || thumbnailPending}
            >
              Back to Series
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={createPending || updatePending || thumbnailPending}
            >
              {(createPending || updatePending || thumbnailPending) && <Spinner className="mr-2" />}
              {mode === "add" ? "Publish Episode" : "Update Episode"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}