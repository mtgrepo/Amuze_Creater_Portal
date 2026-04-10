"use client";

import { useEffect, useState } from "react";
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
import { useComicsTitleCreateCommand } from "@/composable/Command/Entertainment/Comics/useComicsTitleCreateCommand";
import { Spinner } from "@/components/ui/spinner";
import { decryptAuthData } from "@/lib/helper";
import { useComicsTitleUpdateCommand } from "@/composable/Command/Entertainment/Comics/useComicsTitleUpdateCommand";
import { useComicsThumbnailUpdateCommand } from "@/composable/Command/Entertainment/Comics/useComicsThumbnailUpdateCommand";
import router from "@/router/routes";
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
import ConfirmCard from "../../../common/confirm_card";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
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

export default function ComicTitleForm({
  mode,
  defaultValues,
  onSuccess,
}: TitleFormProps) {
  const formSchema = createFormSchema(mode);
  const { genresList } = useGenresQuery(2);
  const [createDialog, setCreateDialog] = useState(false);

  const { titleMutation, isPending } = useComicsTitleCreateCommand();

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      genres: defaultValues?.genres || [],
      price: defaultValues?.price || 0,
      thumbnail: defaultValues?.thumbnail || undefined,
      horizontal_thumbnail: defaultValues?.horizontal_thumbnail || undefined,
      created_by: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        price: defaultValues.price ?? 0,
        genres: defaultValues.genres || [],

        thumbnail: defaultValues.thumbnail,
        horizontal_thumbnail: defaultValues.horizontal_thumbnail,
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

  const { updateTitleMutation, isPending: isUpdatePending } =
    useComicsTitleUpdateCommand();
  const { updateThumbnailMutation, isPending: isThumbnailPending } =
    useComicsThumbnailUpdateCommand();
  const onSubmit = async (values: TitleFormValues) => {
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
        await titleMutation(formData);
      } else {
        if (!defaultValues?.id) throw new Error("ID missing");

        const isThumbnailUpdated =
          values.thumbnail instanceof File ||
          values.horizontal_thumbnail instanceof File;

        const type =
          values.thumbnail instanceof File ? "vertical" : "horizontal";

        if (isThumbnailUpdated) {
          const thumbData = new FormData();
          if (values.thumbnail instanceof File) {
            thumbData.append("thumbnail", values.thumbnail);
          }
          if (values.horizontal_thumbnail instanceof File) {
            thumbData.append(
              "horizontal_thumbnail",
              values.horizontal_thumbnail,
            );
          }

          await updateThumbnailMutation({
            id: Number(defaultValues?.id),
            type: type,
            data: thumbData,
          });
        }

        const textPayload = {
          name: values.name,
          description: values.description,
          genres: values.genres.map(Number),
          price: values.price,
        };

        await updateTitleMutation({ id: defaultValues?.id, data: textPayload });
      }

      if (onSuccess) onSuccess();
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
              {mode === "add" ? "Create New Series" : "Edit Series Details"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the information for your comic title.
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
                      <FormLabel>Comics Title</FormLabel>
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
                                className={`px-4 py-2 cursor-pointer transition-all select-none gap-2 flex items-center ${isSelected
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
              <FormField
                control={form.control}
                name="horizontal_thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Banner / Horizontal Thumbnail (16:9 recommended)
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
                router.navigate("/entertainment/comics");
              }}
            >
              Cancel & Reset
            </Button>
            <AlertDialog open={createDialog} onOpenChange={setCreateDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className="flex-1 cursor-pointer"

                >
                  {(isPending || isThumbnailPending || isUpdatePending) && (
                    <Spinner className="mr-2 w-4 h-4" />
                  )}
                  {mode === "add" ? "Add Title" : "Save Changes"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <AlertDialogTitle className="text-center text-xl">
                    Confirm {mode === "add" ? "Creation" : "Changes"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Please review the details below before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Review Card */}
                <ConfirmCard name={form.getValues("name")} description={form.getValues("description")} price={form.getValues("price")} />

                <AlertDialogFooter className="sm:justify-center gap-2">
                  <AlertDialogCancel className="flex-1 cursor-pointer">
                    Back to Edit
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 cursor-pointer"
                    disabled={isPending || isThumbnailPending || isUpdatePending}
                  >
                    {isPending || isThumbnailPending || isUpdatePending ? (
                      <Spinner className="mr-2 w-4 h-4" />
                    ) : null}
                    Confirm & {mode === "add" ? "Create" : "Save"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </form>
      </Form>
    </div>
  );
}
