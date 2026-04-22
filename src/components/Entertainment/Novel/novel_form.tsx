"use client";
import { useEffect, useRef, useState } from "react";
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
} from "@/components/ui/alert-dialog";
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
import { useNovelCreateCommand } from "../../../composable/Command/Entertainment/Novel/useCreateCommand";
import { Spinner } from "../../ui/spinner";
import { useNovelUpdateTextCommand } from "../../../composable/Command/Entertainment/Novel/useUpdateCommand";
import { useNovelUpdateThumbnailCommand } from "../../../composable/Command/Entertainment/Novel/useUpdateThumbnailCommand";
import { useNovelUpdatePdfCommand } from "../../../composable/Command/Entertainment/Novel/useUpdatePdfCommand";
import ConfirmCard from "../../common/confirm_card";
import RequiredLabel from "../../common/required_label";
import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate } from "react-router-dom";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be 0 or greater"),

    age_rating: z.number().min(0).optional(),
    preview: z.number().min(0).optional(),
    generes: z.array(z.string()).min(1, "Select at least one genre"),

    thumbnail: imageSchema,
    horizontal_thumbnail: imageSchema,

    file_path: z.union([z.instanceof(File), z.string()]).optional(),

    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type NovelFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface NovelFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<NovelFormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function NovelForm({ mode, defaultValues }: NovelFormProps) {
  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id || "";

  const resetToken = useRef(defaultValues?.id);

  const formSchema = createFormSchema(mode);
  const { genresList } = useGenresQuery(1);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<NovelFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      generes: defaultValues?.generes || [],
      price: defaultValues?.price || 0,
      age_rating: defaultValues?.age_rating || 0,
      preview: defaultValues?.preview || 0,
      thumbnail: defaultValues?.thumbnail || undefined,
      horizontal_thumbnail: defaultValues?.horizontal_thumbnail || undefined,

      file_path: defaultValues?.file_path || undefined,

      created_by: creatorId,
    },
  });


  useEffect(() => {
    if (
      mode === "edit" &&
      defaultValues &&
      defaultValues.id !== resetToken.current
    ) {
      form.reset({
        ...defaultValues,
        created_by: creatorId, 
      });
      resetToken.current = defaultValues.id;
    } else if (mode === "add") {
      form.setValue("created_by", creatorId);
    }
  }, [defaultValues, mode, creatorId]);

  const { novelCreateMutation, isNovelCreating } = useNovelCreateCommand();
  const { updateTextMutation, isUpdatingText } = useNovelUpdateTextCommand();
  const { updateThumbnailMutation, isUpdatingThumbnail } =
    useNovelUpdateThumbnailCommand();
  const { updatePdfMutation, isUpdatingPdf } = useNovelUpdatePdfCommand();

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !isSubmitting && // Don't block while mutation is running
      !isSubmitSuccessful && // Don't block if we just finished successfully
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (values: NovelFormValues) => {
    try {
      if (mode === "add") {
        const formData = new FormData();
        formData.append("created_by", String(values.created_by || creatorId));
        Object.entries(values).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          if (key === "generes" && Array.isArray(value)) {
            value.forEach((g) => formData.append("generes", g));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        });
        await novelCreateMutation(formData);
        form.reset();
      } else {
        if (!defaultValues?.id) throw new Error("ID missing");
        const isThumbnailUpdated =
          values.thumbnail instanceof File ||
          values.horizontal_thumbnail instanceof File;
        const type =
          values.thumbnail instanceof File ? "vertical" : "horizontal";

        const isPdfUpdated = values.file_path instanceof File;

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
            id: Number(defaultValues?.id),
            type: type,
            thumbnail: thumbData,
          });
        }

        if (isPdfUpdated) {
          // Update PDF (Multipart/FormData)
          const pdfData = new FormData();
          pdfData.append("file_path", values.file_path as File);
          await updatePdfMutation({
            id: Number(defaultValues?.id),
            pdf: pdfData,
          });
        }

        const textPayload = {
          name: values.name,
          description: values.description,
          genres: values.generes.map(Number), // Convert strings back to numbers
          price: values.price,
        };
        await updateTextMutation({
          id: Number(defaultValues?.id),
          data: textPayload,
        });

        form.reset(values);
        navigate("/entertainment/novel");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* HEADER */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? t("create_new_novel") : t("edit_novel")}
            </h2>
            <p className="text-muted-foreground text-sm pt-2">
              {t("novel_form.description")}
            </p>
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
                      <RequiredLabel label={t("thumbnail")} />
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
                        <RequiredLabel label={t("title")} />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter title..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PRICE */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label={t("price")} />
                      </FormLabel>
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

                {/* AGE RATING */}
                <FormField
                  control={form.control}
                  name="age_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label={t("age_rating")} />
                      </FormLabel>
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
                <FormField
                  control={form.control}
                  name="preview"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label={t("preview")} />
                      </FormLabel>
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
                <FormField
                  control={form.control}
                  name="file_path"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        <RequiredLabel label={t("file_upload")} />
                      </FormLabel>

                      {/* Show existing file if editing */}
                      {typeof field.value === "string" && mode === "edit" && (
                        <div className="">
                          <a
                            href={field.value}
                            target="_blank"
                            className="text-primary underline"
                          >
                            View existing file
                          </a>
                        </div>
                      )}

                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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
                      <RequiredLabel label={t("description")} />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENRES */}
              <FormField
                control={form.control}
                name="generes"
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
                        <RequiredLabel label={t("genres")} />
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
                      <RequiredLabel label={t("horizontal_thumbnail")} />
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
              onClick={() => navigate("/entertainment/novel")}
            >
              {t('cancel')}
            </Button>
            <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
              <Button
                type="button"
                className="flex-1 cursor-pointer"
                onClick={async () => {
                  const isValid = await form.trigger();

                  if (isValid) {
                    setConfirmDialog(true);
                  } else {
                    toast.error(
                      "Please fill in all required fields correctly.",
                    );
                  }
                }}
              >
                {(isNovelCreating ||
                  isUpdatingText ||
                  isUpdatingThumbnail ||
                  isUpdatingPdf) && <Spinner className="mr-2 w-4 h-4" />}
                {mode === "add" ? t("create") : t("update") }
              </Button>
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
                <ConfirmCard
                  name={form.getValues("name")}
                  description={form.getValues("description")}
                  price={form.getValues("price")}
                />

                <AlertDialogFooter className="sm:justify-center gap-2">
                  <AlertDialogCancel className="flex-1 cursor-pointer">
                    Back to Edit
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 cursor-pointer"
                    disabled={
                      isNovelCreating ||
                      isUpdatingText ||
                      isUpdatingThumbnail ||
                      isUpdatingPdf
                    }
                  >
                    {(isNovelCreating ||
                      isUpdatingText ||
                      isUpdatingThumbnail ||
                      isUpdatingPdf) && <Spinner className="mr-2 w-4 h-4" />}
                    Confirm & {mode === "add" ? t("create") : t("update") }
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <NavigateConfirmDialog blocker={blocker} />
        </form>
      </Form>
    </div>
  );
}
