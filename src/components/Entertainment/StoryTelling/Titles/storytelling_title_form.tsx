import ImageUpload from "@/components/common/image_upload";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useStoryTellingTitleCreateCommand } from "@/composable/Command/Entertainment/StoryTelling/useStoryTellingTitleCreateCommand";
import { useStoryTellingTitleUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useStoryTellingTitleUpdateCommand";
import { useStoryTellingTitleThumbnailUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useStoryTitleThumbnailUpdateCommand";
import { useGenresBySubCategoryQuery } from "@/composable/Query/Genre/useGenresQuery";
import { decryptAuthData } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Thumbnail is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    genres: z.array(z.string()).min(1, "Select at least one genre"),
    thumbnail: imageSchema,
    horizontal_thumbnail: imageSchema,
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type TitleFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface TitleFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<TitleFormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function StoryTellingTitleForm({
  mode,
  defaultValues,
  onSuccess,
}: TitleFormProps) {
  const formSchema = createFormSchema(mode);
  const [subcategory_id] = React.useState<number>(3);
  const { genresList } = useGenresBySubCategoryQuery(subcategory_id);
  const { createTitleMutation, isStoryCreatePending } =
    useStoryTellingTitleCreateCommand();
  const { updateTitleMutation, isStoryTitleUpdatePending } =
    useStoryTellingTitleUpdateCommand();
  const { updateThumbnailMutation, isThumbnailUpdatePending } =
    useStoryTellingTitleThumbnailUpdateCommand();

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      genres: defaultValues?.genres || [],
      thumbnail: defaultValues?.thumbnail || undefined,
      horizontal_thumbnail: defaultValues?.horizontal_thumbnail || undefined,
      created_by: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      // reset() is the key to filling the form with async data
      form.reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        genres: defaultValues.genres || [],
        thumbnail: defaultValues.thumbnail,
        horizontal_thumbnail: defaultValues.horizontal_thumbnail,
        created_by: form.getValues("created_by"), // preserve the ID from the other effect
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

  const onSubmit = async (values: TitleFormValues) => {
    try {
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
      if (mode === "add") {
        await createTitleMutation(formData);
      } else {
        if (!defaultValues?.id) throw new Error("Id is required for update");

        const updateStoryTitlePayload = {
          name: values.name,
          description: values.description,
          genres: values.genres.map(Number),
        };
        await updateTitleMutation({
          id: Number(defaultValues.id),
          data: updateStoryTitlePayload,
        });

        if (values.thumbnail) {
          try {
            const formData = new FormData();
            formData.append("thumbnail", values.thumbnail);

            await updateThumbnailMutation({
              id: Number(defaultValues.id),
              type: "vertical",
              thumbnail: formData,
            });
          } catch (e) {
            toast.error("Failed to update vertical thumbnail.");
          }
        }

        // Update horizontal thumbnail if provided
        if (values.horizontal_thumbnail) {
          try {
            const formData = new FormData();
            formData.append("horizontal_thumbnail", values.horizontal_thumbnail);

            await updateThumbnailMutation({
              id: Number(defaultValues.id),
              type: "horizontal",
              thumbnail: formData,
            });
          } catch (e) {
            toast.error("Failed to update horizontal thumbnail.");
          }
        }
      }
      toast.success("Story updated successfully with thumbnails.");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during submission.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER SECTION */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add"
                ? "Create New Storytelling Title"
                : "Edit Storytelling Title Details"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the information for your storytelling title.
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
                      <FormLabel>Storytelling Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Title Name" {...field} />
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
                name="genres"
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
                      <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/5 min-h-25">
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
            {/* <h3 className="text-lg font-semibold mb-4">Marketing Assets</h3> */}
            <div className="p-6 border rounded-xl bg-muted/20 border-dashed">
              <FormField
                control={form.control}
                name="horizontal_thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Horizontal Thumbnail
                    </FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Click to upload image"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-between">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset();
                toast.info("Form cleared");
              }}
            >
              Cancel & Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 "
              disabled={
                isStoryCreatePending ||
                isStoryTitleUpdatePending ||
                isThumbnailUpdatePending
              }
            >
              {(isStoryCreatePending ||
                isStoryTitleUpdatePending ||
                isThumbnailUpdatePending) && <Spinner />}
              {mode === "add" ? "Add Title" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
