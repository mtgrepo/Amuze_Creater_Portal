"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/image_upload";

// Custom Helpers
import { useGenresQuery } from "@/composable/Query/Genre/useGenresQuery";
import { Spinner } from "@/components/ui/spinner";
import { decryptAuthData } from "@/lib/helper";
import router from "@/router/routes";
import { useGalleryCreateCommand } from "@/composable/Command/Entertainment/Gallery/useGalleryCreateCommand";
import { useGalleryUpdateTextCommand } from "@/composable/Command/Entertainment/Gallery/useGalleryUpdateTextCommand";
import { useGalleryUpdateThumbnailCommand } from "@/composable/Command/Entertainment/Gallery/useGalleryUpdateThumbnailCommand";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
    generes: z.array(z.string()).min(1, "Select at least one genre"),

    thumbnail: imageSchema,

    actual_file: mode === "add" ? imageSchema : z.any().optional(),
    preview_file: mode === "edit" ? imageSchema : z.any().optional(),
    display_file: mode === "edit" ? imageSchema : z.any().optional(),

    created_by: z.union([z.string(), z.number()]).optional(),
  });
}
type GalleryFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface GalleryFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<GalleryFormValues> & { id?: string };
}

export default function GalleryForm({ mode, defaultValues }: GalleryFormProps) {
  const formSchema = createFormSchema(mode);
  const { genresList } = useGenresQuery(6);
  const { createGalleryMutation, isPending } = useGalleryCreateCommand();
  //  INITIALIZE FORM
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      generes: defaultValues?.generes || [],
      price: defaultValues?.price || 0,
      thumbnail: defaultValues?.thumbnail || undefined,
      actual_file: defaultValues?.actual_file || undefined,
      preview_file: defaultValues?.preview_file,
      display_file: defaultValues?.display_file,
      created_by: "",
    },
  });
  // Inside ComicTitleForm...
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        price: defaultValues.price ?? 0,
        generes: defaultValues.generes || [],

        thumbnail: defaultValues.thumbnail,
        actual_file: defaultValues.actual_file,
        preview_file: defaultValues?.preview_file,
        display_file: defaultValues?.display_file,
        created_by: form.getValues("created_by"),
      });
    }
  }, [defaultValues, form]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("creator");
      if (storedData) {
        const loginCreator = decryptAuthData(storedData);
        const id = loginCreator?.creator?.id;
        if (id) form.setValue("created_by", id);
      }
    } catch (error) {
      console.error("Failed to read auth data from localStorage", error);
    }
  }, [form]);

  const { galleryUpdateTextMutation, isUpdatingText } =
    useGalleryUpdateTextCommand();
  const { updateThumbnailMutation, isUpdatingThumbnail } =
    useGalleryUpdateThumbnailCommand();

  const onSubmit = async (values: GalleryFormValues) => {
    try {
      if (mode === "add") {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          if (key === "genres" && Array.isArray(value)) {
            value.forEach((g) => formData.append("genres", g));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        });
        console.log("submit values", values);
        await createGalleryMutation(formData);
      } else {
        // --- HANDLE EDIT ---
        if (!defaultValues?.id) throw new Error("ID missing");

        const isThumbnailUpdated =
          values.thumbnail instanceof File ||
          values.preview_file instanceof File ||
          values.display_file instanceof File;

        if (isThumbnailUpdated) {
          const thumbData = new FormData();

          if (values.thumbnail instanceof File) {
            thumbData.append("thumbnail", values.thumbnail);
          }

          if (mode === "edit") {
            if (values.preview_file instanceof File) {
              thumbData.append("preview_file", values.preview_file);
              thumbData.append("display_file", values.display_file);
            }
            if (values.display_file instanceof File) {
              thumbData.append("display_file", values.display_file);
              thumbData.append("preview_file", values.preview_file);
            }
          }

          await updateThumbnailMutation({
            galleryId: Number(defaultValues?.id),
            data: thumbData,
          });
        }

        // Update Text Data
        const textPayload = {
          name: values.name,
          description: values.description,
          generes: values.generes.map(Number), // Convert strings back to numbers
          price: values.price,
        };

        await galleryUpdateTextMutation({
          galleryId: Number(defaultValues?.id),
          data: textPayload,
        });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-xl  shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER SECTION */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add" ? "Create New Gallery" : "Edit Gallery"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the information for your gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: VISUALS */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-base font-semibold">
                      Thumbnail
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label=""
                        size="large"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* RIGHT COLUMN: DATA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. The Beginning After The End"
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
                      <FormLabel>Price (Coins/Currency)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this story about?"
                        className="min-h-30 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENRE SELECTION SECTION */}
              <FormField
                control={form.control}
                name="generes"
                render={({ field }) => {
                  const toggleGenre = (id: string) => {
                    const isSelected = field.value.includes(id);
                    if (isSelected) {
                      field.onChange(field.value.filter((g) => g !== id));
                    } else {
                      field.onChange([...field.value, id]);
                    }
                  };

                  return (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Genres</FormLabel>
                      <div className="flex flex-wrap gap-2 p-4 border rounded-lg  min-h-25">
                        {genresList?.length ? (
                          genresList.map((g: any) => {
                            const isSelected = field.value.includes(
                              g.id.toString(),
                            );
                            return (
                              <Badge
                                key={g.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`px-4 py-2 cursor-pointer transition-all select-none gap-2 flex items-center ${
                                  isSelected
                                    ? "scale-105 shadow-md"
                                    : "hover:bg-muted"
                                }`}
                                onClick={() => toggleGenre(g.id.toString())}
                              >
                                {g.name}
                                {isSelected ? <CheckCircle2 size={14} /> : null}
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            Loading genres...
                          </p>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          {/* HORIZONTAL ASSETS SECTION */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Marketing Assets</h3>
            <div className="p-6 border rounded-xl  border-dashed">
              {mode === "add" ? (
                <FormField
                  control={form.control}
                  name="actual_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Banner / Actual Thumbnail (16:9 recommended)
                      </FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label="Click to upload banner"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preview_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preview File</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display File</FormLabel>
                        <FormControl>
                          <ImageUpload
                            key={field.value || "empty-display"}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-between">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={() => {
                form.reset();
                router.navigate("/entertainment/gallery");
              }}
            >
              Cancel & Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={isPending || isUpdatingThumbnail || isUpdatingText}
            >
              {(isPending || isUpdatingThumbnail || isUpdatingText) && (
                <Spinner />
              )}
              {mode === "add" ? "Add Gallery" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
