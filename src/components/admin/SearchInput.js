"use client"

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput({ 
  placeholder = "Search...", 
  initialValue = "", 
  onSearch, 
  isLink = false 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);

  // Sync state with URL if it's a link-based search
  useEffect(() => {
    if (isLink) {
      setQuery(searchParams.get("q") || "");
    }
  }, [searchParams, isLink]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (isLink) {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      params.set("page", "1"); // Reset pagination on new search
      router.push(`?${params.toString()}`);
    } else if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (isLink) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    } else if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full md:w-96">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-10 py-3 bg-white border border-zinc-100 rounded-full text-xs font-medium placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-300 hover:text-zinc-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
