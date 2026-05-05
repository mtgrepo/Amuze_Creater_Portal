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
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSendOtpCommand } from "@/composable/Command/auth/useSendOTPCommand";

const formSchema = z.object({
  phoneOrEmail: z
    .string()
    .min(1, { message: "Phone number is required" }),
  isRegister: z.boolean(),

  otp_type: z.string(),
});

export default function RequestOTPForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneOrEmail: "",
      isRegister: false,
      otp_type: "phone",
    },
  });

  const { sendOtpMutation } = useSendOtpCommand();

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await sendOtpMutation(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your registered phone number to receive an OTP.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+959xxxxxxxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>

          <div className="flex flex-col gap-2 text-center">
            <Link
              to="/creator-portal/login"
              className="flex gap-2 items-center justify-center text-primary hover:underline"
            >
              <ChevronLeft size={16} /> Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}