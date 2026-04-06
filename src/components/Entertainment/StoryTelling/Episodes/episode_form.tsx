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
// import { Spinner } from "@/components/ui/spinner";

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
//   onSuccess,
}: EpisodeFormProps) {
  const formSchema = createFormSchema(mode);

  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      title_id: titleId,
      price: defaultValues?.price,
      thumbnail: defaultValues?.thumbnail,
      file_path: defaultValues?.file_path,
      created_by: "",
    },
  });

  const onSubmit = async (values: EpisodeFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("title_id", String(values.title_id));
      formData.append("price", String(values.price));
      formData.append("created_by", String(values.created_by));

      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      if (values.file_path instanceof File) {
        formData.append("file_path", values.file_path);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occured.");
    }
  };
  return( 
   <div className="max-w-7xl mx-auto space-y-8 p-6 border rounded-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <FolderPlus className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase italic ">
              {mode === "add" ? "New Episode" : "Edit Episode"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Upload pages and manage episode details.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* COVER SECTION */}
          <section className="flex flex-col items-center justify-center">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center text-center">
                  <FormLabel className="text-sm uppercase font-bold tracking-widest text-muted-foreground mb-4">
                    Episode Cover
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

          {/* METADATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold ">Episode Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter episode name"
                      {...field}
                    />
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
                  <FormLabel className="font-bold ">Price (Coins)</FormLabel>
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
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => router.navigate(-1)}
            //   disabled={}
            >
              Back to Series
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
            //   disabled={}
            >
              {/* {(createPending || updatePending || thumbnailPending) && <Spinner className="mr-2" />} */}
              {mode === "add" ? "Publish Episode" : "Update Episode"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
