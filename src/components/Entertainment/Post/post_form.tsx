import {
  MediaUpload,
  type MediaItem,
} from "@/components/common/post_media_upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { usePostCreate } from "@/composable/Command/Entertainment/Posts/usePostCreate";
import { usePostUpdate } from "@/composable/Command/Entertainment/Posts/usePostUpdate";
import { decryptAuthData } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Earth, UserLock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ConfirmCard from "@/components/common/confirm_card";
import { usePostMediaUpdate } from "@/composable/Command/Entertainment/Posts/usePostMediaUpdate";
import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate } from "react-router-dom";
import RequiredLabel from "@/components/common/required_label";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";
import { usePostMediaDelete } from "@/composable/Command/Entertainment/Posts/usePostMediaDelete";

function normalizeMedia(media: any[] = []) {
  return media.map((m) => ({
    id: crypto.randomUUID(),
    mediaId: String(m.index),
    url: m.url,
    alt: m.alt || "",
    type: m.type || "image",
    file: undefined,
  }));
}

function createFormSchema() {
  return z.object({
    description: z.string().min(1, "Description is required."),
    visibility: z.string(),
    isVideo: z.boolean().optional(),
    created_by: z.union([z.string(), z.number()]).optional(),
    media: z
      .array(
        z.object({
          file: z.instanceof(File).optional(),
          alt: z.string().optional(),
          url: z.string().optional(),
          type: z.string().optional(),
          id: z.string().optional(),
          mediaId: z.string().optional(),
        }),
      )
      .optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface FormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<FormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function PostForm({
  mode,
  defaultValues,
  onSuccess,
}: FormProps) {
  const resetToken = useRef(defaultValues?.id);
  const originalMediaRef = useRef<MediaItem[]>([]);
  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id;
  const formSchema = createFormSchema();
  const [confirmDialog, setConfirmDialog] = useState(false);
  const deletedMediaRef = useRef<number[]>([]);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { createMutation } = usePostCreate();
  const { updateMutation } = usePostUpdate();
  const { updateMediaMutation } = usePostMediaUpdate();
  const { deleteMediaMutation } = usePostMediaDelete();

  const isLoading = isSubmittingAll;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: defaultValues?.description || "",
      visibility: defaultValues?.visibility || "public",
      isVideo: false,
      created_by: creatorId,
      media: mode === "edit" ? normalizeMedia(defaultValues?.media || []) : [],
    },
  });

  useEffect(() => {
    if (
      mode === "edit" &&
      defaultValues &&
      defaultValues.id !== resetToken.current
    ) {
      form.reset({
        description: defaultValues.description || "",
        visibility: defaultValues.visibility,
        isVideo: defaultValues.isVideo,
        media: normalizeMedia(defaultValues?.media as any),
        created_by: creatorId,
      });
      resetToken.current = defaultValues.id;
      originalMediaRef.current = normalizeMedia(defaultValues.media || []);
    } else if (mode === "add" && creatorId) {
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

  const getIsVideo = (media: MediaItem[] = []) => {
    return media.some((m) => m.type === "video");
  };

  // const isVideo = form.watch("media")?.some(m => m.type === "video");

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmittingAll(true);
      const formData = new FormData();

      const currentMedia = values.media || [];
      const isVideo = getIsVideo(currentMedia);

      formData.append("description", values.description);
      formData.append("visibility", values.visibility);
       if (mode === "add") {
        formData.append("isVideo", String(isVideo));
      }
      formData.append("created_by", String(values.created_by));

      if (mode === "add") {
        currentMedia.forEach((item: any, index: number) => {
          if (item.file) {
            formData.append(`file[${index}][media]`, item.file);
          }
          formData.append(`file[${index}][alt]`, item.alt || "");
        });
        await createMutation(formData);
      } else {
        if (!defaultValues?.id) throw new Error("Missing post id");
        const fd = new FormData();

        console.log("current media", currentMedia)

        fd.append("description", values.description);
        fd.append("visibility", values.visibility);

        await updateMutation({
          id: Number(defaultValues.id),
          data: fd,
        });

        for (const item of currentMedia) {
          if (item.mediaId) {
            const original = originalMediaRef.current.find(
              (m) => m.mediaId === item.mediaId,
            );

            const altChanged = original && original.alt !== item.alt;
            const fileReplaced = !!item.file;

            if (altChanged || fileReplaced) {
              const replaceFd = new FormData();
              replaceFd.append("fileId", item.mediaId);
              replaceFd.append("alt", item.alt || "");

              if (item.file) {
                replaceFd.append("image", item.file);
              }

              await updateMediaMutation({
                id: Number(defaultValues.id),
                data: replaceFd,
              });
            }
          }
        }

        const newUploads = currentMedia.filter(
          (item) => item.file && !item.mediaId,
        );
        if (newUploads.length > 0) {
          const newFilesFd = new FormData();
          newUploads.forEach((item, index) => {
            if (item.file) {
              newFilesFd.append(`file[${index}][images]`, item.file);
              newFilesFd.append(`file[${index}][alt]`, item.alt || "");
            }
          });
          await updateMutation({
            id: Number(defaultValues.id),
            data: newFilesFd,
          });
        }

        if (deletedMediaRef.current.length > 0) {
          for (const indexId of deletedMediaRef.current) {
            await deleteMediaMutation({
              id: Number(defaultValues.id),
              indexId,
            });
          }

          deletedMediaRef.current = [];
        }
      }
      navigate("/entertainment/posts");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during post creation.");
    } finally {
      setIsSubmittingAll(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add"
                ? t("post.create_header")
                : t("post.update_header")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === "add"
                ? t("post.create_header_description")
                : t("post.update_header_description")}
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel label={t("post.post_description")} />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="min-h-30 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("post.visibility")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Earth size={16} />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <UserLock size={16} />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("post.media_upload")}
                  </FormLabel>

                  <MediaUpload
                    value={(field.value as MediaItem[]) || []}
                    onChange={field.onChange}
                    mode={mode}
                    onDelete={(mediaId: number) => {
                      deletedMediaRef.current.push(mediaId);
                    }}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-between">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset();
                navigate("/entertainment/posts");
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

                <ConfirmCard name={form.getValues("description")} />

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
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 w-4 h-4" />
                        {mode === "add" ? "Creating..." : "Updating..."}
                      </>
                    ) : (
                      <>Confirm & {mode === "add" ? "Create" : "Update"}</>
                    )}
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
