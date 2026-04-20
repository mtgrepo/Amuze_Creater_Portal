"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";

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
import { useChangePasswordCommand } from "@/composable/Command/auth/useChangePasswordCommand";
import { Spinner } from "../ui/spinner";
import { decryptAuthData } from "@/lib/helper";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PasswordForm({ onSuccess, onCancel }: PasswordFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { changePasswordMutation, isPending } = useChangePasswordCommand();

  // Safe retrieval of loginId (prevents crash if localStorage is empty)
  const loginId = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("creator");
      if (!stored) return null;
      const decoded = decryptAuthData(stored);
      return decoded?.creator?.id;
    } catch (error) {
      console.error("Auth decryption failed:", error);
      return null;
    }
  }, []);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    if (!loginId) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    try {
      const payload = {
        id: loginId,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      await changePasswordMutation(payload);
      if (onSuccess) onSuccess();
      form.reset();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
    }
  };


  return (
    <div className="w-full bg-white dark:bg-[#17171A] rounded-xl overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="border-b dark:border-[#252525] pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-500" />
              Security Update
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Set a strong password to protect your account.
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter current password"
                        type={showCurrent ? "text" : "password"}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute inset-y-0 right-0 hover:bg-transparent"
                      >
                        {showCurrent ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        <span className="sr-only">Toggle visibility</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter new password"
                        type={showNew ? "text" : "password"}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute inset-y-0 right-0 hover:bg-transparent"
                      >
                        {showNew ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        <span className="sr-only">Toggle visibility</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3 pt-6 border-t dark:border-[#252525] justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="flex-1 min-w-35"
            >
              {isPending && <Spinner className="mr-2 h-4 w-4" />}
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}