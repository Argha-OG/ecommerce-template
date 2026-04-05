"use client"

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortHeader({ 
  label, 
  sortBy, 
  currentSortBy, 
  currentOrder, 
  onSort, 
  isLink = false,
  className = ""
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActive = currentSortBy === sortBy;

  const handleSort = () => {
    let nextOrder = "asc";
    if (isActive && currentOrder === "asc") {
      nextOrder = "desc";
    } else if (isActive && currentOrder === "desc") {
      nextOrder = ""; // Reset to default (createdAt: desc)
    }

    if (isLink) {
      const params = new URLSearchParams(searchParams.toString());
      if (nextOrder) {
        params.set("sortBy", sortBy);
        params.set("order", nextOrder);
      } else {
        params.delete("sortBy");
        params.delete("order");
      }
      params.set("page", "1"); // Reset pagination on new sort
      router.push(`?${params.toString()}`);
    } else if (onSort) {
      onSort(sortBy, nextOrder);
    }
  };

  const getIcon = () => {
    if (!isActive || !currentOrder) return <ChevronsUpDown className="h-3 w-3 text-zinc-300 group-hover:text-zinc-500 transition-colors" />;
    if (currentOrder === "asc") return <ChevronUp className="h-3 w-3 text-zinc-900" />;
    return <ChevronDown className="h-3 w-3 text-zinc-900" />;
  };

  return (
    <th 
      onClick={handleSort}
      className={`group cursor-pointer select-none py-5 px-8 transition-colors hover:bg-zinc-100/50 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>
          {label}
        </span>
        {getIcon()}
      </div>
    </th>
  );
}
