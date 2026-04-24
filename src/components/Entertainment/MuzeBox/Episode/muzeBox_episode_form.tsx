"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/image_upload";

import { decryptAuthData } from "@/lib/helper";
import { getPresignedUploadUrl } from "../../../../http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import { useMuzeBoxEpisodeCreateCommand } from "@/composable/Command/Entertainment/MuzeBox/Episode/useEpisodeCreateCommand";
import { useMuzeBoxEpisodeTextUpdateCommand } from "@/composable/Command/Entertainment/MuzeBox/Episode/useEpisodeTextUpdateCommand";
import { useMuzeBoxEpisodeThumbnailUpdateCommand } from "@/composable/Command/Entertainment/MuzeBox/Episode/useEpisodeThumbnailCommand";
import { useMuzeBoxEpisodeVideoUpdateCommand } from "@/composable/Command/Entertainment/MuzeBox/Episode/useEpisodeVideoUpdateCommand";
import { Spinner } from "@/components/ui/spinner";
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
import ConfirmCard from "../../../common/confirm_card";
import { CheckCircle2 } from "lucide-react";
import RequiredLabel from "../../../common/required_label";
import NavigateConfirmDialog from "../../../common/navigate_confirm_dialog";
import { useTranslation } from "react-i18next";

type UploadedPart = {
  partNumber: number;
  etag: string;
};

function createFormSchema(mode: "add" | "edit") {
  const fileOrUrl =
    mode === "add"
      ? z.instanceof(File, { message: "Required" })
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
    thumbnail: fileOrUrl,
    video: fileOrUrl, // Apply the same logic here!
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}
type MuzeBoxValues = z.infer<ReturnType<typeof createFormSchema>>;

interface MuzeBoxFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<MuzeBoxValues> & { id?: string | number };
  titleId?: number;
  titleName?: string;
}

export default function MuzeBoxEpisodeForm({
  mode,
  defaultValues,
}: MuzeBoxFormProps) {

  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id || "";

  const resetToken = useRef(defaultValues?.id);

  const { t } = useTranslation();

  const { id } = useParams();
  const formSchema = createFormSchema(mode);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);

  const form = useForm<MuzeBoxValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    values: mode === "edit" ? {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price ?? 0,
      thumbnail: defaultValues?.thumbnail,
      video: defaultValues?.video,
      created_by: creatorId,
    } : undefined,
    defaultValues: {
      id: defaultValues?.id ? Number(defaultValues.id) : undefined,
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price || 0,
      thumbnail: defaultValues?.thumbnail || undefined,
      video: defaultValues?.video || undefined,
      created_by: creatorId,
    },
  });

  useEffect(() => {
    if (
      mode === "edit" &&
      defaultValues &&
      defaultValues.id !== resetToken.current
    ) {
      console.log("enter edit mode")
      form.reset({
        ...defaultValues,
        created_by: creatorId,
      });
      resetToken.current = defaultValues.id;
    } else if (mode === "add") {
      form.setValue("created_by", creatorId);
    }
  }, [form, defaultValues, mode, creatorId]);

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

  async function getChunkPresignedUploadUrl(
    file: File,
    seriesId: number,
    episodeName: string,
    parts: number,
  ) {
    const data = {
      contentType: file.type,
      seriesId: seriesId,
      episodeName: episodeName,
      parts,
    };
    return await getPresignedUploadUrl(data);
  }

  async function uploadMultipart(
    file: File,
    presignedParts: any[],
    chunkSizeMB: number = 0,
  ) {
    const uploadedParts: UploadedPart[] = [];
    const concurrency = Number(import.meta.env.UPLOAD_CONCURRENCY) || 4;
    let index = 0;

    async function uploadNext() {
      if (index >= presignedParts.length) return;

      const current = index++;
      const { partNumber, url } = presignedParts[current];
      let chunk: Blob;

      if (chunkSizeMB === 0) {
        chunk = file;
      } else {
        const start = (partNumber - 1) * (chunkSizeMB * 1024 * 1024);
        const end = Math.min(start + chunkSizeMB * 1024 * 1024, file.size);
        chunk = file.slice(start, end);
      }

      const res = await fetch(url, {
        method: "PUT",
        body: chunk,
      });

      if (!res.ok) throw new Error(`Upload failed for part ${partNumber}`);

      const rawEtag = res.headers.get("ETag");
      if (!rawEtag) throw new Error(`Missing ETag for part ${partNumber}`);

      const etag = rawEtag.replace(/"/g, "");
      uploadedParts.push({ partNumber, etag });

      await uploadNext();
    }

    await Promise.all(Array(concurrency).fill(0).map(uploadNext));
    return uploadedParts;
  }

  const bytesToMB = (bytes: number, decimals = 2): number => {
    const factor = Math.pow(10, decimals);
    return Math.round((bytes / (1024 * 1024)) * factor) / factor;
  };

  const { episodeCreateMutation, isPending } = useMuzeBoxEpisodeCreateCommand();
  const { updateEpisodeTextMutation, isTextUpdating } =
    useMuzeBoxEpisodeTextUpdateCommand();
  const { updateEpisodeThumbnailMutation, isThumbnailUpdating } =
    useMuzeBoxEpisodeThumbnailUpdateCommand();
  const { updateEpisodeVideoMutation, isVideoUpdating } =
    useMuzeBoxEpisodeVideoUpdateCommand();

  const onSubmit = async (values: MuzeBoxValues) => {
    setIsSubmit(true);
    try {
      const videoFile = values.video as File;
      const fileSizeMB = bytesToMB(videoFile.size);
      let parts = 1;
      let newChunkSizeMB = 0;

      if (fileSizeMB >= 200) {
        newChunkSizeMB = fileSizeMB <= 1024 ? 30 : 50;
        const chunkSize = newChunkSizeMB * 1024 * 1024;
        parts = Math.ceil(videoFile.size / chunkSize);
      }

      // Series ID is usually passed from defaultValues or a parent context
      const seriesId = Number(id);
      if (!seriesId && mode === "add")
        throw new Error("Series ID is required to upload an episode.");

      const formData = new FormData();

      //   console.log("series id", seriesId);
      if (mode === "add") {
        const uploadUrls = await getChunkPresignedUploadUrl(
          videoFile,
          seriesId,
          values.name,
          parts,
        );
        //   console.log("upload urls", uploadUrls);
        const uploadedParts = await uploadMultipart(
          videoFile,
          uploadUrls.data.urls,
          newChunkSizeMB,
        );

        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("series_id", String(seriesId));
        formData.append("thumbnail", values.thumbnail as File);
        formData.append("tempFilePath", uploadUrls.data.tempFilePath);
        formData.append("price", values.price.toString());
        formData.append("uploadId", uploadUrls.data.uploadId);
        formData.append(
          "parts",
          JSON.stringify(
            uploadedParts.sort((a, b) => a.partNumber - b.partNumber),
          ),
        );
      }

      if (mode === "add") {
        await episodeCreateMutation(formData);
        // console.log("FormData:", Object.fromEntries(formData.entries()));
      } else {
        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
          await updateEpisodeThumbnailMutation({
            episodeId: Number(defaultValues?.id),
            thumbnail: formData,
          });
        }
        if (values.video instanceof File) {
          formData.append("video", values.video);
          await updateEpisodeVideoMutation({
            episodeId: Number(defaultValues?.id),
            video: formData,
          });
        }
        const textPayload = {
          name: values.name,
          description: values.description,
          price: values.price,
        };
        await updateEpisodeTextMutation({
          episodeId: Number(defaultValues?.id),
          data: textPayload,
        });
      }

      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? t('episode_form.create_title') : t('episode_form.update_title')}
            </h2>
            <p className="text-muted-foreground text-sm pt-2">
              {t('episode_form.description')}
            </p>
          </div>

          <div className="space-y-6 max-w-sm mx-auto">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredLabel label={t('thumbnail')} />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel label={t('title')} />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter name..." />
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
                      <FormLabel>
                        <RequiredLabel label={t('price')} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
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
                    <FormLabel>
                      <RequiredLabel label={t('description')} />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel label={t('episode_form.video')} />
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        fieldType="video"
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

          <div className="flex gap-3 pt-6 border-t items-center">
            <Button
              className="flex-1 cursor-pointer"
              type="button"
              variant="outline"
              onClick={() =>
                navigate(-1)
              }
            >
              {t('cancel')}
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
                {(isSubmit ||
                  isPending ||
                  isTextUpdating ||
                  isThumbnailUpdating ||
                  isVideoUpdating) && (
                    <Spinner className="mr-2 w-4 h-4" />
                  )}
                {mode === "add" ? t('create') : t('update')}
              </Button>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <AlertDialogTitle className="text-center text-xl">
                    Confirm
                    {mode === "add" ? "Add Episode" : "Save Changes"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Please review the details below before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Review Card */}
                <ConfirmCard name={form.getValues("name")} price={form.getValues("price")} description={form.getValues("description")} />

                <AlertDialogFooter className="sm:justify-center gap-2">
                  <AlertDialogCancel className="flex-1 cursor-pointer">
                    Back to Edit
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 cursor-pointer"
                    disabled={isSubmit ||
                      isPending ||
                      isTextUpdating ||
                      isThumbnailUpdating ||
                      isVideoUpdating}
                  >
                    {isSubmit ||
                      isPending ||
                      isTextUpdating ||
                      isThumbnailUpdating ||
                      isVideoUpdating &&
                      <Spinner className="mr-2 w-4 h-4" />
                    }
                    Confirm &
                    {mode === "add" ? "Add Episode" : "Save Changes"}

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
