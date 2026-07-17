"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormValues } from "@/features/auth/schemas";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken);
      router.push("/properties");
    },
  });

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">
            Sign in to manage your listings and inquiries.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {mutation.isError && (
            <p className="text-sm text-brick">
              {getErrorMessage(mutation.error)}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={mutation.isPending}
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-ink/60">
          New here?{" "}
          <Link
            href="/register"
            className="text-teal underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
