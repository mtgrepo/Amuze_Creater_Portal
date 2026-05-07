import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPen, CalendarIcon } from "lucide-react";
import { decryptAuthData } from "@/lib/helper";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import type { LoginCreatorResponse } from "@/types/response/auth/loginCreatorResponse";
import { useProfileInfoUpdateCommand } from "@/composable/Command/auth/useProfileInfoUpdateCommand";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  dob: z.date().optional(),
});

interface UpdateInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: LoginCreatorResponse;
}

const ProfileInfoUpdateForm: React.FC<UpdateInfoProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      bio: data?.bio || "",
      dob: data?.dob ? new Date(data?.dob) : new Date(),
    },
  });

  const loginUser = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginUser?.creator?.id;

  const {profileInfoUpdateMutation, isPending } = useProfileInfoUpdateCommand();

  // console.log("edit data", data)
  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      dob: formData.dob,
    };
    try {
      if (!creatorId) {
        toast.error("Creator ID not found. Please log in again.");
        return;
      }
      //api call
      await profileInfoUpdateMutation({ creatorId: creatorId, data: payload})
      form.reset();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-2">
            <UserPen className="h-5 w-5" />
            Update Creator Information
          </DialogTitle>
          <DialogDescription>
            Update your profile information to keep your account up-to-date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
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
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner className="mr-2" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileInfoUpdateForm;
