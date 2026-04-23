import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import amuze from "../assets/amuze-logo.png";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useLoginCommand } from "@/composable/Command/auth/useLoginCommand";
import { Spinner } from "./ui/spinner";
import { requestPermissionAndGetToken } from "@/notification";

const formSchema = z.object({
  emailOrPhone: z.string().min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const { loginMutation, isPending } = useLoginCommand();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const fcmToken = await requestPermissionAndGetToken();
      const logInPayload = {
        ...values,
        web_firebase_key: fcmToken || null
      }
      await loginMutation(logInPayload);

      if (fcmToken) {
        localStorage.setItem("fcm_token", fcmToken);
      }
      // console.log("form values", values);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Creator account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="emailOrPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="emailOrPhone">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="emailOrPhone"
                          type="email"
                          placeholder="Enter your email or phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            placeholder="Enter your password"
                            type={isVisible ? "text" : "password"}
                            className="pr-9"
                            {...field}
                          />
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            onClick={toggleVisibility}
                            className="absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                          >
                            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                            <span className="sr-only">
                              {isVisible ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Spinner />} Login
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </Form>

          <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden rounded-r-2xl">
            {/* 1. DYNAMIC MESH BACKGROUND */}
            <div
              className="absolute inset-0 z-0 transition-all duration-700"
              style={{
                background: `
        /* Light Mode Gradients */
        radial-gradient(circle at 20% 30%, oklch(0.9 0.05 264.376), transparent), 
        radial-gradient(circle at 80% 70%, oklch(0.85 0.1 240), transparent),
        /* Default Light Base: Very soft blue/white */
        oklch(0.98 0.01 264.376)
      `,
              }}
            />

            {/* Dark Mode Overlay (Triggered by .dark class) */}
            <div
              className="absolute inset-0 z-1 opacity-0 dark:opacity-100 transition-opacity duration-700"
              style={{
                background: `
        radial-gradient(circle at 20% 30%, oklch(0.488 0.243 264.376 / 0.2), transparent), 
        radial-gradient(circle at 80% 70%, oklch(0.488 0.243 264.376 / 0.1), transparent),
        oklch(0.25 0.05 264.376)
      `,
              }}
            />

            {/* 2. THE LOGO SECTION */}
            <div className="relative z-10 flex flex-col items-center gap-6 p-12">
              {/* Soft Glow - Switches color based on mode */}
              <div
                className="absolute w-64 h-64 rounded-full blur-[100px] opacity-40 dark:opacity-20 transition-colors"
                style={{
                  backgroundColor: "oklch(0.488 0.243 264.376)",
                }}
              />

              <img
                src={amuze}
                alt="Amuze Logo"
                className="relative z-20 w-full max-w-70 drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
              {/* Elegant Typography - Color changes for visibility */}
              <div className="text-center space-y-1">
                <p className="text-slate-600 dark:text-white/70 font-light tracking-[0.3em] text-[10px] uppercase">
                  Creator Portal
                </p>
                <div className="h-px w-12 bg-primary/40 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
