"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

import { useGenresQuery } from "@/composable/Query/Genre/useGenresQuery";
import { decryptAuthData } from "@/lib/helper";
import { useMuzeBoxCreateCommand } from "@/composable/Command/Entertainment/MuzeBox/Title/useMuzeBoxCreateCommand";
import { Spinner } from "@/components/ui/spinner";
import { useMuzeBoxUpdateTextCommand } from "@/composable/Command/Entertainment/MuzeBox/Title/useMuzeBoxUpdateTextCommand";
import { useMuzeBoxUpdateThumbnailCommand } from "@/composable/Command/Entertainment/MuzeBox/Title/useMuzeBoxUpdateThumbnailCommand";
import ConfirmCard from "../../../common/confirm_card";
import RequiredLabel from "../../../common/required_label";
import { useNavigate } from "react-router-dom";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required"),
    // price: z.number().min(0, "Price must be 0 or greater"),

    age_rating: z.number().min(0).optional(),
    // preview: z.number().min(0).optional(),
    genres: z.array(z.string()).min(1, "Select at least one genre"),

    thumbnail: imageSchema,
    horizontal_thumbnail: imageSchema,

    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type MuzeBoxValues = z.infer<ReturnType<typeof createFormSchema>>;

interface MuzeBoxFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<MuzeBoxValues> & { id?: string };
  onSuccess?: () => void;
}

export default function MuzeBoxForm({ mode, defaultValues }: MuzeBoxFormProps) {
  const formSchema = createFormSchema(mode);
  const { genresList } = useGenresQuery(7);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const form = useForm<MuzeBoxValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      genres: defaultValues?.genres || [],
      //   price: defaultValues?.price || 0,
      age_rating: defaultValues?.age_rating || 0,
      //   preview: defaultValues?.preview || 0,
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
        // price: defaultValues.price ?? 0,
        age_rating: defaultValues.age_rating ?? 0,
        genres: defaultValues.genres || [],
        // preview: defaultValues.preview ?? 0,
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
      console.error(error);
    }
  }, [form]);


  const { muzeBoxCreateMutation, isPending } = useMuzeBoxCreateCommand();
  const { muzeBoxTextUpdateMutation, isUpdateTextPending } = useMuzeBoxUpdateTextCommand();
  const { updateThumbnailMutation, isUpdateThumbnailPending } = useMuzeBoxUpdateThumbnailCommand();

  const onSubmit = async (values: MuzeBoxValues) => {
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
        await muzeBoxCreateMutation(formData);
        form.reset();
      } else {
        if (!defaultValues?.id) throw new Error("ID missing");
        const isThumbnailUpdated =
          values.thumbnail instanceof File ||
          values.horizontal_thumbnail instanceof File;
        const type =
          values.thumbnail instanceof File ? "vertical" : "horizontal";

        if (isThumbnailUpdated) {
          // Update Thumbnails (Multipart/FormData)
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
            muzeBoxId: Number(defaultValues?.id),
            type: type,
            data: thumbData,
          });
          form.reset();
        }

        const textPayload = {
          name: values.name,
          description: values.description,
          genres: values.genres.map(Number), 
          //   price: values.price,
        };
        await muzeBoxTextUpdateMutation({
          id: Number(defaultValues?.id),
          data: textPayload,
        });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? "Create New MuzeBox" : "Edit MuzeBox"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel label="Thumbnail" />
                    </FormLabel>
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
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label="Title" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter title..."/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AGE RATING */}
                <FormField
                  control={form.control}
                  name="age_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label="Age Rating" />
                      </FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel label="Description" />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description..."/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENRES */}
              <FormField
                control={form.control}
                name="genres"
                render={({ field }) => {
                  const toggleGenre = (id: string) => {
                    const exists = field.value.includes(id);
                    if (exists) {
                      field.onChange(field.value.filter((g) => g !== id));
                    } else {
                      field.onChange([...field.value, id]);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label="Genres" />
                      </FormLabel>
                      <div className="flex flex-wrap gap-2 border p-4 rounded-lg">
                        {genresList?.map((g: any) => {
                          const selected = field.value.includes(
                            g.id.toString(),
                          );

                          return (
                            <Badge
                              key={g.id}
                              variant={selected ? "default" : "outline"}
                              onClick={() => toggleGenre(g.id.toString())}
                              className="cursor-pointer flex items-center gap-1"
                            >
                              {g.name}
                              {selected && <CheckCircle2 size={14} />}
                            </Badge>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* HORIZONTAL THUMBNAIL */}
              <FormField
                control={form.control}
                name="horizontal_thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel label="Horizontal Thumbnail" />
                    </FormLabel>
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
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-6 border-t flex-1 items-center justify-baseline">
            <Button
              className="w-full flex-1 cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => navigate("/entertainment/muze-box")}
            >
              Cancel
            </Button>
            <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
              <Button
                className="flex-1 cursor-pointer"
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();

                  if (isValid) {
                    setConfirmDialog(true);
                  } else {
                    toast.error("Please fill in all required fields correctly.");
                  }
                }}
              >
                {(isPending || isUpdateTextPending || isUpdateThumbnailPending) && (
                  <Spinner className="mr-2 w-4 h-4" />
                )}
                {mode === "add" ? "Add Title" : "Save Changes"}
              </Button>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="text-center">
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
                <ConfirmCard name={form.getValues("name")} description={form.getValues("description")} />

                <AlertDialogFooter className="sm:justify-center gap-2">
                  <AlertDialogCancel className="flex-1 cursor-pointer">
                    Back to Edit
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 cursor-pointer"
                    disabled={isPending || isUpdateTextPending || isUpdateThumbnailPending}
                  >
                    {(isPending ||
                      isUpdateTextPending ||
                      isUpdateThumbnailPending) && (
                        <Spinner className="mr-2 w-4 h-4" />
                      )}
                    Confirm & {mode === "add" ? "Add Title" : "Update Title"}
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
