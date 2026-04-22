import ConfirmCard from "@/components/common/confirm_card";
import ImageUpload from "@/components/common/image_upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useMuseumCreate } from "@/composable/Command/Entertainment/Museum/useMuseumCreate";
import { useMuseumThumbnailUpdate } from "@/composable/Command/Entertainment/Museum/useMuseumThumbnailUpdate";
import { useMuseumUpdate } from "@/composable/Command/Entertainment/Museum/useMuseumUpdate";
import { decryptAuthData } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

function createFormSchema(mode: "add" | "edit") {
  const imageSchema =
    mode === "add"
      ? z.custom<File>((val) => val instanceof File, "Image is required")
      : z.union([z.instanceof(File), z.string()]).optional();

  return z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
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

export default function MuseumForm({
  mode,
  defaultValues,
  onSuccess,
}: TitleFormProps) {
  const formSchema = createFormSchema(mode);
  const [confirmDialog, setConfirmDialog] = useState(false);


  const { createMutation, isCreatePending } = useMuseumCreate();
  const { updateMuseumMutation, isMuseumUpdatePending } = useMuseumUpdate();
  const { updateThumbnailMutation, isThumbnailUpdatePending } =
    useMuseumThumbnailUpdate();

  const isLoading =
    isCreatePending || isMuseumUpdatePending || isThumbnailUpdatePending;

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
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
        thumbnail: defaultValues.thumbnail,
        horizontal_thumbnail: defaultValues.horizontal_thumbnail,
        created_by: form.getValues("created_by"),
      });
    }
  }, [defaultValues]);

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
  }, []);

  const onSubmit = async (values: TitleFormValues) => {
    try {
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
      if (mode === "add") {
        await createMutation(formData);
      } else {
        if (!defaultValues?.id) throw new Error("Id is required for update");

        const updateStoryTitlePayload = {
          name: values.name,
          description: values.description,
        };
        await updateMuseumMutation({
          id: Number(defaultValues.id),
          data: updateStoryTitlePayload,
        });

        if (values.thumbnail) {
          try {
            const formData = new FormData();
            formData.append("thumbnail", values.thumbnail);

            await updateThumbnailMutation({
              id: Number(defaultValues.id),
              type: "vertical",
              thumbnail: formData,
            });
          } catch (e) {
            toast.error("Failed to update vertical thumbnail.");
          }
        }

        if (values.horizontal_thumbnail) {
          try {
            const formData = new FormData();
            formData.append(
              "horizontal_thumbnail",
              values.horizontal_thumbnail,
            );

            await updateThumbnailMutation({
              id: Number(defaultValues.id),
              type: "horizontal",
              thumbnail: formData,
            });
          } catch (e) {
            toast.error("Failed to update horizontal thumbnail.");
          }
        }

        toast.success("Museum updated successfully with thumbnails.");
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during submission.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-xl bg-background shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {mode === "add" ? "Create New Museum" : "Edit Museum Details"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the information for your museum.
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
                        <Input placeholder="Enter museum name" {...field} />
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

          <div className="pt-6 border-t">
            <div className="p-6 border rounded-xl bg-muted/20 border-dashed">
              <FormField
                control={form.control}
                name="horizontal_thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Horizontal Thumbnail
                    </FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Click to upload image"
                        />
                      </div>
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
                {mode === "add" ? "Create Museum" : "Save Changes"}
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
                    Confirm & {mode === "add" ? "Create Museum" : "Update Museum"}
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
