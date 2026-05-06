import { useEffect, useRef, useState } from "react";
import ImageUpload from "@/components/common/image_upload";
import { MuseumImageUploader } from "@/components/common/museum_image_upload";
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
import { decryptAuthData } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import ConfirmCard from "@/components/common/confirm_card";
import { useMuseumEpisodeCreate } from "@/composable/Command/Entertainment/museum/useMuseumEpisodeCreate";
import { useMuseumEpisodeUpdate } from "@/composable/Command/Entertainment/museum/useMuseumEpisodeUpdate";
import { useMuseumEpisodeThumbnailUpdate } from "@/composable/Command/Entertainment/museum/useMuseumEpisodeThumbnailUpdate";
import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import RequiredLabel from "@/components/common/required_label";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";

const FileItemSchema = (mode: "add" | "edit") =>
  z
    .object({
      image:
        mode === "add"
          ? z.custom<File>((file) => file instanceof File, {
              message: "Image is required.",
            })
          : z.union([z.instanceof(File), z.string(), z.null()]).optional(),

      label: z.string().optional(),
      description: z.string().optional(),
    })
    .refine((file) => mode === "edit" || file.image !== null, {
      message: "Image is required.",
      path: ["image"],
    });

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    titleId: z.union([z.string(), z.number()]),
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    thumbnail: imageSchema,
    museum_file: z.array(FileItemSchema(mode)).optional(),
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type TitleFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface TitleFormProps {
  mode: "add" | "edit";
  titleId: number;
  defaultValues?: Partial<TitleFormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function MuseumEpisodeForm({
  mode,
  titleId,
  defaultValues,
  onSuccess,
}: TitleFormProps) {
  const resetToken = useRef(defaultValues?.id);
  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id;
  //   const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  //     const [editedImages, setEditedImages] = useState<
  //   { id: number; image: File; label?: string; description?: string }[]
  // >([]);


  const { museumId } = useParams();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const formSchema = createFormSchema(mode);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      titleId,
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      thumbnail: defaultValues?.thumbnail || undefined,
      museum_file: mode === "edit" ? defaultValues?.museum_file: [],
      created_by: creatorId,
    },
  });

  const { createMutation, isCreatePending } = useMuseumEpisodeCreate();
  const { updateEpisodeMutation, isUpdatePending } = useMuseumEpisodeUpdate();
  const { updateThumbnailMutation, isThumbnailUpdatePending } =
    useMuseumEpisodeThumbnailUpdate();

  const isLoading =
    isCreatePending || isUpdatePending || isThumbnailUpdatePending;

  useEffect(() => {
    if (
      mode === "edit" &&
      defaultValues &&
      defaultValues.id !== resetToken.current
    ) {
      form.reset({
        titleId: defaultValues.titleId,
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        thumbnail: defaultValues.thumbnail,
        museum_file: defaultValues.museum_file,
        created_by: creatorId,
      });
      resetToken.current = defaultValues.id;
    }
    if (mode === "add" && creatorId) {
      form.setValue("created_by", creatorId);
    }
  }, [defaultValues, mode, creatorId, form]);

  const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !isSubmitting &&
      !isSubmitSuccessful &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (values: TitleFormValues) => {
    try {
      if (mode === "add") {
        const formData = new FormData();
        formData.append("museum_title_id", String(values.titleId));
        formData.append("name", values.name);
        formData.append("description", values.description);
        if (values.created_by) {
          formData.append("created_by", String(values.created_by));
        }
        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        }
        (values.museum_file || []).forEach((file, index) => {
          formData.append(`file[${index}]['images']`, file.image!);
          formData.append(`file[${index}]['label']`, file.label || "");
          formData.append(
            `file[${index}]['description']`,
            file.description || "",
          );
        });
        await createMutation(formData);
      }

      if (mode === "edit" && defaultValues?.id) {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("description", values.description);

        (values.museum_file || []).forEach((file, index) => {
          if (file.image instanceof File) {
            formData.append(`file[${index}]['images']`, file.image);
          }

          formData.append(`file[${index}]['label']`, file.label || "");
          formData.append(
            `file[${index}]['description']`,
            file.description || "",
          );
        });

        await updateEpisodeMutation({
          episodeId: Number(defaultValues.id),
          data: formData,
        });

        if (values.thumbnail instanceof File) {
          const thumbnailData = new FormData();
          formData.append("thumbnail", values.thumbnail);

          await updateThumbnailMutation({
            id: Number(defaultValues.id),
            thumbnail: thumbnailData,
          });
        }
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occured.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add"
                ? t("museum_episode.create_header")
                : t("museum_episode.update_header")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === "add"
                ? t("museum_episode.create_header_description")
                : t("museum_episode.update_header_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-base font-semibold">
                      <RequiredLabel label={t("thumbnail")} />
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

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label={t("title")} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter museum title name"
                          {...field}
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
                    <FormLabel>
                      <RequiredLabel label={t("description")} />
                    </FormLabel>
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
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <FormField
              control={form.control}
              name="museum_file"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      {t("museum_episode.image_description")}
                    </FormLabel>
                    <FormControl>
                       <MuseumImageUploader
                        value={(field.value || []).map((item) => ({
                          localId: crypto.randomUUID(),
                          ...item,
                        }))}
                        onChange={field.onChange}
                        control={form.control}
                        name="museum_file"
                        // onDelete={(id) => {
                        //   if (id) setImagesToRemove((prev) => [...prev, id]);
                        // }}
                        // onEdit={(id, image, label, description) => {
                        //   setEditedImages((prev) => [
                        //     ...prev.filter((img) => img.id !== id),
                        //     { id, image, label, description },
                        //   ]);
                        // }}
                        errors={form.formState.errors.museum_file as any}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-between">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset();
                navigate(
                  `/entertainment/museum/${museumId}/title/details/${titleId}`,
                );
              }}
            >
              {t("cancel")}
            </Button>
            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
              <Button
                className="flex-1 cursor-pointer"
                type="button"
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
                {isLoading && <Spinner className="mr-2 w-4 h-4" />}
                {mode === "add" ? t("create") : t("update")}
              </Button>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-center text-xl">
                    Confirm {mode === "add" ? "Creation" : "Changes"}
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Please review the details below before proceeding.
                  </DialogDescription>
                </DialogHeader>

                <ConfirmCard
                  name={form.getValues("name")}
                  description={form.getValues("description")}
                />

                <DialogFooter className="sm:justify-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading && <Spinner className="mr-2 w-4 h-4" />}
                    Confirm &{" "}
                    {mode === "add" ? "Create Episode" : "Update Episode"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <NavigateConfirmDialog blocker={blocker} />
        </form>
      </Form>
    </div>
  );
}
