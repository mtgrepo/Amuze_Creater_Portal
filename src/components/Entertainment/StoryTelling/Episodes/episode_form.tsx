import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle2, FolderPlus } from "lucide-react";
import ImageUpload from "@/components/common/image_upload";
import { Button } from "@/components/ui/button";
import AudioUpload from "@/components/common/audio_upload";
import { Spinner } from "@/components/ui/spinner";
import { useEpisodeCreateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeCreateCommand";
import { useEpisodeUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeUpdateCommand";
import { useEpisodeThumbnailUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeThumbnailUpdateCommand";
import { useEpisodeAudioUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeAudioUpdateCommand";
import { useEffect, useRef, useState } from "react";
import { decryptAuthData } from "@/lib/helper";
import { generateStoryEpisodePresignedUrl } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
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
import ConfirmCard from "../../../common/confirm_card";
import { useBlocker, useNavigate } from "react-router-dom";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";
import { useTranslation } from "react-i18next";
import RequiredLabel from "@/components/common/required_label";
function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Thumbnail is required")
      : z.union([z.instanceof(File), z.string()]).optional();
  const audioSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Audio File is required.")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    title_id: z.union([z.string(), z.number()]),
    name: z.string().min(1, "Name is required."),
    price: z.number().min(1, "Price is required."),
    thumbnail: imageSchema,
    file_path: audioSchema,
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type EpisodeFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface EpisodeFormProps {
  mode: "add" | "edit";
  titleId: number;
  defaultValues?: Partial<EpisodeFormValues> & { id?: number };
  onSuccess?: () => void;
}

export default function StoryTellingEpisodeForm({
  mode,
  titleId,
  defaultValues,
  onSuccess,
}: EpisodeFormProps) {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id || "";
  const resetToken = useRef(defaultValues?.id);
  const navigate = useNavigate();

  const {t} = useTranslation();

  const formSchema = createFormSchema(mode);
  

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      title_id: titleId,
      price: defaultValues?.price ?? 0,
      thumbnail: defaultValues?.thumbnail,
      file_path: defaultValues?.file_path,
      created_by: creatorId,
    },
  });

  const { createEpisodeMutation, isCreateEpisodePending } =
    useEpisodeCreateCommand();
  const { updateEpisodeMutation, isUpdateEpisodePending } =
    useEpisodeUpdateCommand();
  const { updateEpisodeThumbnailMutation, isUpdateEpisodeThumbnailPending } =
    useEpisodeThumbnailUpdateCommand();
  const { updateEpisodeAudioMutation, isUpdateEpisodeAudioPending } =
    useEpisodeAudioUpdateCommand();

  const isLoading =
    isCreateEpisodePending ||
    isUpdateEpisodePending ||
    isUpdateEpisodeThumbnailPending ||
    isUpdateEpisodeAudioPending;

  useEffect(() => {
    if (
      mode === "edit" &&
      defaultValues &&
      defaultValues?.id !== resetToken.current
    ) {
      form.reset({
        name: defaultValues?.name || "",
        title_id: titleId,
        price: defaultValues?.price ?? 0,
        thumbnail: defaultValues?.thumbnail,
        file_path: defaultValues?.file_path,
        created_by: creatorId,
      });
      resetToken.current = defaultValues.id;
    } else if (mode === "add") {
      form.setValue("created_by", creatorId);
    }
  }, [form, defaultValues, mode, creatorId, titleId]);

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

  const onSubmit = async (values: EpisodeFormValues) => {
    try {
      if (mode === "add") {
        if (!(values.file_path instanceof File)) {
          throw new Error("Audio file is required");
        }

        const presignedResult = await generateStoryEpisodePresignedUrl(
          Number(values.title_id),
          values.name,
          values.file_path.type,
        );

        if (!presignedResult.status) {
          throw new Error(presignedResult.message);
        }

        const { url, tempFilePath } = presignedResult.data;

        const uploadRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": values.file_path.type,
          },
          body: values.file_path,
        });

        if (!uploadRes.ok) {
          throw new Error("Audio upload failed");
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("title_id", String(values.title_id));
        formData.append("price", String(values.price));

        if (values.created_by) {
          formData.append("created_by", String(values.created_by));
        }

        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        }

        formData.append("file_path", tempFilePath);

        await createEpisodeMutation(formData);
      }

      const updateStoryTellingEpisodePayload = {
        name: values.name,
        price: values.price,
      };

      if (mode === "edit" && defaultValues?.id) {
        await updateEpisodeMutation({
          episodeId: defaultValues.id,
          data: updateStoryTellingEpisodePayload,
        });

        if (values.thumbnail instanceof File) {
          const thumbnailData = new FormData();
          thumbnailData.append("thumbnail", values.thumbnail);

          await updateEpisodeThumbnailMutation({
            episodeId: defaultValues.id,
            thumbnail: thumbnailData,
          });
        }

        if (values.file_path instanceof File) {
          const audioData = new FormData();
          audioData.append("file_path", values.file_path);

          await updateEpisodeAudioMutation({
            episodeId: defaultValues.id,
            audio: audioData,
          });
        }
        toast.success("Episode updated successfully!");
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occured.");
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
            <h1 className="text-xl font-bold tracking-tight uppercase ">
              {mode === "add" ? t('episode_form.create_title') : t('episode_form.update_title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "add"
                ? t('story_telling_episode_form.create_header_description')
                :  t('story_telling_episode_form.update_header_description')}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <section className="flex flex-col items-center justify-center">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center text-center">
                  <FormLabel className="text-sm uppercase font-bold tracking-widest text-muted-foreground mb-4">
                    <RequiredLabel label={t('episode_form.episode_cover')}/>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold ">
                    <RequiredLabel label={t('episode_form.episode_name')}/>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter episode name" {...field} />
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
                  <FormLabel className="font-bold ">
                    <RequiredLabel label={t('price')}/>
                  </FormLabel>
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

            <FormField
              control={form.control}
              name="file_path"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">
                    <RequiredLabel label={t('episode_form.audio')}/>
                  </FormLabel>

                  <FormControl>
                    <AudioUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset();
                navigate(`/entertainment/storytelling/details/${titleId}`)
              }}
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
                {isLoading && <Spinner className="mr-2 w-4 h-4" />}
                {mode === "add" ? t('create') : t('update')}
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

                <ConfirmCard
                  name={form.getValues("name")}
                  price={form.getValues("price")}
                />

                <AlertDialogFooter className="sm:justify-center gap-2">
                  <AlertDialogCancel className="flex-1 cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading && <Spinner className="mr-2 w-4 h-4" />}
                    Confirm &{" "}
                    {mode === "add" ? "Create Episode" : "Update Episode"}
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
