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
import { Link, useSearchParams } from "react-router-dom";
import { useResetPasswordCommand } from "@/composable/Command/auth/useResetPasswordCommand";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronLeft, EyeIcon, EyeOffIcon } from "lucide-react";

const formSchema = z.object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function ResetPasswordPage() {
    const [params] = useSearchParams();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    const identifier = params.get("identifier");
    const otp = params.get("otp");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const { resetPasswordMutation } = useResetPasswordCommand();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.newPassword !== values.confirmPassword) {
            toast.error("Password do not match");
            return;
        }
        await resetPasswordMutation({
            phoneOrEmail: identifier!,
            otp: otp!,
            newPassword: values.newPassword,
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="p-6 space-y-6">
                    <h1 className="text-xl font-bold text-center">
                        Set a new password
                    </h1>

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
                            <Link
                                to="/creator-portal/login"
                                className="flex justify-center items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <ChevronLeft size={16} />Back to login
                            </Link>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}