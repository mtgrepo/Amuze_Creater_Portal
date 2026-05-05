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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSendOtpCommand } from "@/composable/Command/auth/useSendOTPCommand";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

const formSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
});

export default function VerifyOtpPage() {
  const [params] = useSearchParams();
  const [count, setCount] = useState(30);
  const canResend = count === 0;


  const identifier = params.get("identifier");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });
  useEffect(() => {
    if (count === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

  const isSubmitting = form.formState.isSubmitting;

  const { sendOtpMutation } = useSendOtpCommand();


  async function onSubmit(values: z.infer<typeof formSchema>) {
    navigate(`/reset-password?identifier=${identifier}&otp=${values.otp}`)
  }

  async function handleResendOtp() {
    try {
      await sendOtpMutation({
        phoneOrEmail: identifier!,
        isRegister: false,
        otp_type: "phone",
      });

      toast.success("OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Verify OTP</h1>
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to : {identifier}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Verify OTP
              </Button>
              <div className="flex justify-between items-center mt-2">

                <Link
                  to="/forgot-password"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ChevronLeft size={16} />
                  back
                </Link>

                <Button
                  type="button"
                  variant="link"
                  disabled={!canResend}
                  onClick={handleResendOtp}
                >
                  {canResend ? "Resend" : `Resend in ${count}s`}
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}