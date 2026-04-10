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
import { FolderPlus } from "lucide-react";
import ImageUpload from "@/components/common/image_upload";
import { Button } from "@/components/ui/button";
import router from "@/router/routes";
import AudioUpload from "@/components/common/audio_upload";
import { Spinner } from "@/components/ui/spinner";
import { useEpisodeCreateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeCreateCommand";
import { useEpisodeUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeUpdateCommand";
import { useEpisodeThumbnailUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeThumbnailUpdateCommand";
import { useEpisodeAudioUpdateCommand } from "@/composable/Command/Entertainment/StoryTelling/useEpisodeAudioUpdateCommand";
import { useEffect } from "react";
import { decryptAuthData } from "@/lib/helper";
import { generateStoryEpisodePresignedUrl } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";

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
  const formSchema = createFormSchema(mode);

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      title_id: titleId,
      price: defaultValues?.price ?? undefined,
      thumbnail: defaultValues?.thumbnail,
      file_path: defaultValues?.file_path,
      created_by: "",
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

        // thumbnail still file ✅
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
              {mode === "add" ? "New Episode" : "Edit Episode"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "add"
                ? "Create New Storytelling Episode"
                : "Edit Storytelling Episode Details"}
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
                    Episode Thumbnail
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
                  <FormLabel className="font-bold ">Episode Name</FormLabel>
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
                  <FormLabel className="font-bold ">Price(MMK)</FormLabel>
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
                  <FormLabel className="font-bold">Audio(MP3)</FormLabel>

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
              className="flex-1 cursor-pointer"
              onClick={() => router.navigate(-1)}
              disabled={isLoading}
            >
              Back to Titles
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && <Spinner className="mr-2 w-4 h-4" />}
              {mode === "add" ? "Create Episode" : "Update Episode"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
