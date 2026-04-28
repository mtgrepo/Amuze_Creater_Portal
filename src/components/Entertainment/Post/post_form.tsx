import { MediaUpload, type MediaItem } from "@/components/common/post_media_upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
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

function normalizeMedia(media: any[] = []) {
  return media.map((m) => ({
    id: crypto.randomUUID(),
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
    isVideo: z.boolean(),
    created_by: z.union([z.string(), z.number()]).optional(),
    media: z
      .array(
        z.object({
          file: z.instanceof(File).optional(),
          alt: z.string().optional(),
          url: z.string().optional(),
          type: z.string().optional(),
          id: z.string().optional(),
        })
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
  const resetToken = useRef(false);
  const originalMediaRef = useRef<MediaItem[]>([]);
  const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id;
  const formSchema = createFormSchema();
  const [confirmDialog, setConfirmDialog] = useState(false);



  const { createMutation, isCreatePending } = usePostCreate();
  const { updateMutation, isUpdatePending } = usePostUpdate();
  const { updateMediaMutation, isMediaUpdatePending} = usePostMediaUpdate();

  const isLoading = isCreatePending || isUpdatePending || isMediaUpdatePending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: defaultValues?.description || "",
      visibility: "public",
      isVideo: false,
      created_by: creatorId,
      media: [],
    },
  });

  // useEffect(() => {
  //   if (mode === "edit" && defaultValues && defaultValues.id !== resetToken.current) {
  //     form.reset({
  //       description: defaultValues.description || "",
  //       visibility: defaultValues.visibility,
  //       isVideo: defaultValues.isVideo,
  //       media: normalizeMedia(defaultValues?.media as any),
  //       created_by: creatorId,
  //     });
  //     resetToken.current = defaultValues.id;

  //   }
  //   if (mode === "add" && creatorId) {
  //     form.setValue("created_by", creatorId)
  //   }
  // }, [defaultValues, mode, creatorId, form]);

  useEffect(() => {
    if (mode === "edit" && defaultValues && !resetToken.current) {
      form.reset({
        description: defaultValues.description || "",
        visibility: defaultValues.visibility,
        isVideo: defaultValues.isVideo,
        media: normalizeMedia(defaultValues?.media as any),
        created_by: creatorId,
      });
      resetToken.current = true;
      originalMediaRef.current = normalizeMedia(defaultValues.media || [])
    }
    if (mode === "add" && creatorId) {
      form.setValue("created_by", creatorId)
    }
  }, [defaultValues, mode, creatorId, form]);
  

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("description", values.description);
      formData.append("visibility", values.visibility);
      formData.append("isVideo", String(values.isVideo));
      formData.append("created_by", String(values.created_by));

      if (values.media) {
        values.media.forEach((item: any, index: number) => {
          const key = mode === 'add' ? "media" : "images";
          if (item.file) {
            formData.append(`file[${index}][${key}]`, item.file);
          }
          if(!item.file && item.url){
            formData.append(`file[${index}][fieldId]`, item.url);
          }
          formData.append(`file[${index}][alt]`, item.alt || "");
        });
      }

      if (mode === "add") {
        await createMutation(formData);
      } else {
        if (!defaultValues?.id) throw new Error("Missing post id");

        const currentMedia = values.media || [];
        const originalMedia = originalMediaRef.current;

        const currentExisting = currentMedia.filter((m) => !m.file);
        const originalIds = originalMedia.map(m => m.url);
        const currentIds = currentExisting.map(m => m.url);

        const hasDeleted = originalIds.some(id => !currentIds.includes(id));
        const hasNewFiles = currentMedia.some(m => m.file);

        if(hasDeleted){
          await updateMediaMutation({
            id: Number(defaultValues.id),
            data: formData
          })
        }else if(hasNewFiles){
          await updateMutation({
            id: Number(defaultValues.id),
            data: formData
          })
        }else{
          await updateMutation({
            id: Number(defaultValues.id),
            data: formData
          })
        }


        if(hasNewFiles){
          await updateMediaMutation({
            id: Number(defaultValues.id),
            data: formData
          })
        }else{
        await updateMutation({
          id: Number(defaultValues.id),
          data: formData
        });
        }

      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during post creation.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add" ? "Create New Post" : "Edit Post"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Share your thoughts, images, or videos with your audience.
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Content</FormLabel>
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
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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

              <FormField
                control={form.control}
                name="isVideo"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Video Mode</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Enable if uploading a video
                      </p>
                    </div>

                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                    Media Upload
                  </FormLabel>

                  <MediaUpload
                    value={(field.value as MediaItem[]) || []}
                    onChange={field.onChange}
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
                toast.info("Form cleared");
              }}
            >
              Cancel & Reset
            </Button>

            {/* <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  {mode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>{mode === "add" ? "Create Post" : "Save Changes"}</>
              )}
            </Button> */}

            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
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
                {(isLoading) && (
                  <Spinner className="mr-2 w-4 h-4" />
                )}
                {mode === "add" ? "Create Post" : "Save Changes"}
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
                      <>
                        Confirm & {mode === "add" ? "Create" : "Update"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>

        </form>
      </Form>
    </div>
  );
}
