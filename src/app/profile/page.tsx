"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { inquiryService } from "@/services/inquiryService";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/format";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { EmptyState } from "@/components/ui/StateBlocks";
import { Badge } from "@/components/ui/Badge";

function ProfileContent() {
  const { user } = useAuthStore();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["inquiries", "mine"],
    queryFn: inquiryService.getMine,
  });

  if (!user) return null;

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="mb-8 font-display text-2xl text-ink">Profile</h1>

      <div className="mb-10 border border-line p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/50">Name</dt>
            <dd className="text-ink">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Email</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
          {user.phone && (
            <div className="flex justify-between">
              <dt className="text-ink/50">Phone</dt>
              <dd className="text-ink">{user.phone}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-ink/50">Member since</dt>
            <dd className="text-ink">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mb-4 font-display text-lg text-ink">Inquiries you've sent</h2>
      {isLoading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : !inquiries || inquiries.length === 0 ? (
        <EmptyState
          title="No inquiries yet"
          message="Reach out to an owner from a property page and it'll show up here."
        />
      ) : (
        <div className="divide-y divide-line border border-line">
          {inquiries.map((inquiry) => (
            <Link
              key={inquiry.id}
              href={`/properties/${inquiry.propertyId}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-line/20"
            >
              <div>
                <p className="text-sm text-ink">{inquiry.property.title}</p>
                <p className="text-xs text-ink/50">{inquiry.property.city} · {formatDate(inquiry.createdAt)}</p>
              </div>
              <Badge tone={inquiry.status === "PENDING" ? "brass" : "teal"}>{inquiry.status}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
