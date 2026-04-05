"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  baseUrl = "", 
  isLink = false 
}) {
  if (totalPages <= 1) return null;

  const PageButton = ({ page, disabled, children, active = false }) => {
    const className = `flex items-center justify-center w-10 h-10 rounded-full text-xs font-black tracking-widest uppercase transition-all border ${
      active 
        ? "bg-zinc-900 text-white border-zinc-900" 
        : disabled 
          ? "text-zinc-200 border-zinc-100 cursor-not-allowed" 
          : "text-zinc-400 border-zinc-100 hover:border-zinc-900 hover:text-zinc-900 bg-white"
    }`;

    if (isLink && !disabled) {
      return (
        <Link href={`${baseUrl}?page=${page}`} className={className}>
          {children}
        </Link>
      );
    }

    return (
      <button 
        onClick={() => !disabled && onPageChange(page)} 
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    );
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PageButton key={i} page={i} active={i === currentPage}>
          {i}
        </PageButton>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <PageButton page={currentPage - 1} disabled={currentPage <= 1}>
        <ChevronLeft size={16} />
      </PageButton>
      
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <PageButton page={currentPage + 1} disabled={currentPage >= totalPages}>
        <ChevronRight size={16} />
      </PageButton>
    </div>
  );
}
