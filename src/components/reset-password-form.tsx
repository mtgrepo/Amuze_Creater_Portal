import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordCommand } from "@/composable/Command/auth/useResetPasswordCommand";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronLeft, EyeIcon, EyeOffIcon } from "lucide-react";

interface ResetPasswordFormProps {
    identifier: string;
    otp: string;
    onSuccess?: (type?: "success" | "otp_error") => void;
    showBackButton?: boolean;
}

const formSchema = z.object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function ResetPasswordForm({ identifier, otp, onSuccess, showBackButton = false }: ResetPasswordFormProps) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const normalizedIdentifier = (identifier || "").trim();
    const normalizedOtp = otp;

    let finalIdentifier = normalizedIdentifier;

    if (/^\d+$/.test(finalIdentifier)) {
        finalIdentifier = `+${finalIdentifier}`;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const { resetPasswordMutation } = useResetPasswordCommand();
    const navigate = useNavigate();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.newPassword !== values.confirmPassword) {
            toast.error("Password do not match");
            return;
        }
        try {
            await resetPasswordMutation({
                phoneOrEmail: finalIdentifier,
                otp: normalizedOtp!,
                newPassword: values.newPassword,
            });
            onSuccess?.();
        } catch (error: any) {
            const message =
                error?.message || "Something went wrong";
            const isOtpError = message.toLowerCase().includes("otp");


            if (isOtpError) {
                toast.error("Invalid OTP");

                if (showBackButton) {
                    navigate(
                        `/verify-otp?identifier=${encodeURIComponent(identifier)}&error=invalid_otp`
                    );
                } else {
                    onSuccess?.("otp_error");

                }

                return;
            }

            toast.error(message);
        }

    }

    return (
        <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-6">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Enter your new password" {...field}
                                                className="pr-9"
                                            />
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                size="icon"
                                                onClick={() => setShowNewPassword((p) => !p)}
                                                className="absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                            >
                                                {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                <span className="sr-only">
                                                    {showNewPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Re-enter password"
                                                {...field}
                                                className="pr-9" />
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                size="icon"
                                                onClick={() => setShowConfirmPassword((p) => !p)}
                                                className="absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                                            >
                                                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                                                <span className="sr-only">
                                                    {showConfirmPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="w-full" disabled={isSubmitting}>
                            Update Password
                        </Button>
                        {showBackButton && (
                            <Link
                                to={`/verify-otp?identifier=${encodeURIComponent(finalIdentifier)}`}
                                className="flex justify-center items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <ChevronLeft size={16} />Back to OTP page
                            </Link>
                        )}

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}