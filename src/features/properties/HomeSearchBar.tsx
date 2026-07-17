"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { CITIES } from "@/constants/property";

export function HomeSearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      city ? `/properties?city=${encodeURIComponent(city)}` : "/properties",
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex max-w-md items-center border border-line bg-paper"
    >
      <Search className="ml-3 h-4 w-4 text-ink/40" />
      <input
        list="cities"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Which city?"
        className="w-full bg-transparent px-3 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
      />
      <datalist id="cities">
        {CITIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <button
        type="submit"
        className="whitespace-nowrap bg-[#d20023] px-5 py-3 text-sm font-medium text-paper hover:bg-[#b30220]"
      >
        Search homes
      </button>
    </form>
  );
}
