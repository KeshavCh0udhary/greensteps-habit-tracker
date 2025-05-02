
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error, success } = await resetPassword(values.email);

      if (error) {
        toast.error("Password reset failed", {
          description: error.message || "Please check your email and try again.",
        });
        return;
      }

      if (success) {
        setIsSubmitted(true);
        toast.success("Check your email", {
          description: "We sent you a password reset link.",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-md eco-card">
        <div className="space-y-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Didn't receive an email?{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
        <div className="text-center">
          <Link to="/login" className="text-primary hover:underline text-sm">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-card rounded-lg shadow-md eco-card">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send reset link"}
          </Button>
        </form>
      </Form>
      <div className="text-center">
        <Link to="/login" className="text-primary hover:underline text-sm">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
