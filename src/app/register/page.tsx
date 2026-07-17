"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, RegisterFormValues } from "@/features/auth/schemas";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken);
      router.push("/properties");
    },
  });

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl text-ink">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            List a property or start reaching out to owners directly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters, with an uppercase letter, lowercase letter, and a number."
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
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
