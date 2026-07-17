"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { inquiryService } from "@/services/inquiryService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";

export function ContactForm({ propertyId, ownerId }: { propertyId: string; ownerId: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("Hi, is this property still available? I'd like to know more.");
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => inquiryService.create({ propertyId, message }),
    onSuccess: () => setSent(true),
  });

  if (user && user.id === ownerId) {
    return <p className="border border-line p-4 text-sm text-ink/60">This is your own listing.</p>;
  }

  if (sent) {
    return (
      <div className="border border-teal bg-teal-light p-4 text-sm text-teal-dark">
        Inquiry sent. The owner can now see your message and contact details.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-3 border border-line p-4">
        <p className="text-sm text-ink/70">Sign in to contact the owner directly.</p>
        <Button onClick={() => router.push("/login")} size="sm">
          Sign in to continue
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-3 border border-line p-4"
    >
      <h3 className="font-display text-lg text-ink">Contact the owner</h3>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        minLength={10}
        maxLength={1000}
        required
      />
      {mutation.isError && <p className="text-xs text-brick">{getErrorMessage(mutation.error)}</p>}
      <Button type="submit" isLoading={mutation.isPending} className="w-full">
        Send inquiry
      </Button>
    </form>
  );
}
