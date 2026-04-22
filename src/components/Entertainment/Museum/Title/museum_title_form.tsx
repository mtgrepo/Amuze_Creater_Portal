import ImageUpload from "@/components/common/image_upload";
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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import ConfirmCard from "@/components/common/confirm_card";
import { useMuseumTitleCreate } from "@/composable/Command/Entertainment/museum/useMuseumTitleCreate";
import { useMuseumTitleUpdate } from "@/composable/Command/Entertainment/museum/useMuseumTitleUpdate";
import { useMuseumTitleThumbnailUpdate } from "@/composable/Command/Entertainment/museum/useMuseumTitleThumbnailUpdate";


function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    museum_id: z.union([z.string(), z.number()]),
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    thumbnail: imageSchema,
    created_by: z.union([z.string(), z.number()]).optional(),
  });
}

type TitleFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface TitleFormProps {
  mode: "add" | "edit";
  museumId: number;
  defaultValues?: Partial<TitleFormValues> & { id?: string };
  onSuccess?: () => void;
}

export default function MuseumTitleForm({
  mode,
  museumId,
  defaultValues,
  onSuccess,
}: TitleFormProps) {
   const resetToken = useRef(defaultValues?.id);
    const storedData = localStorage.getItem("creator");
  const loginCreator = storedData ? decryptAuthData(storedData) : null;
  const creatorId = loginCreator?.creator?.id;
  const formSchema = createFormSchema(mode);
    const [confirmDialog, setConfirmDialog] = useState(false);
  

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      museum_id: museumId,
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      thumbnail: defaultValues?.thumbnail || undefined,
      created_by: creatorId,
    },
  });

  const { createTitleMutation, isCreateTitlePending } = useMuseumTitleCreate();
  const { updateTitleMutation, isUpdatePending } = useMuseumTitleUpdate();
  const { updateTitleThumbnailMutation, isThumbnailUpdatePending } =
    useMuseumTitleThumbnailUpdate();

  const isLoading =
    isCreateTitlePending || isUpdatePending || isThumbnailUpdatePending;

      useEffect(() => {
    if (mode === "edit" && defaultValues && defaultValues.id !== resetToken.current) {
      form.reset({
        museum_id: defaultValues.museum_id,
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        thumbnail: defaultValues.thumbnail,
        created_by: creatorId,
      });
      resetToken.current = defaultValues.id;
    }
       if(mode === "add" && creatorId){
    form.setValue("created_by", creatorId)
   }
  }, [defaultValues, mode, creatorId, form]);

  const onSubmit = async (values: TitleFormValues) => {
    try {
      if (mode === "add") {
        const formData = new FormData();
        formData.append("museum_id", String(values.museum_id));
        formData.append("name", values.name);
        formData.append("description", values.description);
        if (values.created_by) {
          formData.append("created_by", String(values.created_by));
        }
        if (values.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        }
        await createTitleMutation(formData);
      }

      const updateTitlePayload = {
        name: values.name,
        description: values.description,
      };
      if (mode === "edit" && defaultValues?.id) {
        await updateTitleMutation({
          titleId: Number(defaultValues.id),
          data: updateTitlePayload,
        });
        if (values.thumbnail instanceof File) {
          const thumbnailData = new FormData();
          thumbnailData.append("thumbnail", values.thumbnail);

          await updateTitleThumbnailMutation({
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
                ? "Create New Museum Title"
                : "Edit Museum Title Details"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the information for your museum title.
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

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Museum</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter museum title name" {...field} />
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
            </div>
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
                {mode === "add" ? "Create Title" : "Save Changes"}
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

                <ConfirmCard name={form.getValues("name")} description={form.getValues("description")} />

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
                    disabled={
                      isLoading
                    }
                  >
                    {(isLoading) && (
                      <Spinner className="mr-2 w-4 h-4" />
                    )}
                    Confirm & {mode === "add" ? "Create Title" : "Update Title"}
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
