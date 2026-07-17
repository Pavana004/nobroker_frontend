"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, KeyRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/Button";
import logo from "../../../assets/logo (1).png";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const { user, clearSession } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      clearSession();
      router.push("/");
    }
  }

  return (
    <header className="border-b border-line bg-paper">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-tight text-ink"
        >
          <Image src={logo} alt="Plinth Logo" width={40} height={40} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/properties"
            className="text-sm text-ink/70 hover:text-ink"
          >
            Browse listings
          </Link>
          {user && (
            <>
              <Link
                href="/my-properties"
                className="text-sm text-ink/70 hover:text-ink"
              >
                My properties
              </Link>
              <Link
                href="/properties/create"
                className="text-sm text-ink/70 hover:text-ink"
              >
                List a property
              </Link>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-ink/70 hover:text-white capitalize px-3 py-1.5 text-ink border border-ink hover:bg-[#b30220] font-semibold "
              >
                {user.name.split(" ")[0]}
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-ink/70 hover:text-white uppercase px-3 py-1.5 text-ink border border-ink hover:bg-[#b30220] font-semibold "
              >
                Sign in
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          <Link
            href="/properties"
            className="py-2 text-sm text-ink/80"
            onClick={() => setMobileOpen(false)}
          >
            Browse listings
          </Link>
          {user ? (
            <>
              <Link
                href="/my-properties"
                className="py-2 text-sm text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                My properties
              </Link>
              <Link
                href="/properties/create"
                className="py-2 text-sm text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                List a property
              </Link>
              <Link
                href="/profile"
                className="py-2 text-sm text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 text-left text-sm text-brick"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="py-2 text-sm text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="py-2 text-sm text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
