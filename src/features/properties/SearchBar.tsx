"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (city: string) => void;
}

export function SearchBar({ defaultValue = "", onSearch }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
      className="flex items-center border border-line bg-paper"
    >
      <Search className="ml-3 h-4 w-4 text-ink/40" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by city — e.g. Bangalore, Pune..."
        className="w-full bg-transparent px-3 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
        aria-label="Search by city"
      />
      <button
        type="submit"
        className="whitespace-nowrap bg-[#d20023] px-5 py-3 text-sm font-medium text-paper hover:bg-[#b30220]"
      >
        Search
      </button>
    </form>
  );
}
