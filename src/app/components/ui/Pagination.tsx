"use client";

export default function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-3">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="p-2 rounded bg-white/10 text-white"
      >
        ‹
      </button>
      {pages.slice(0, Math.min(5, pages.length)).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-10 h-10 rounded ${
            p === page ? "bg-brand-500 text-black" : "bg-white/10 text-white"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        className="p-2 rounded bg-white/10 text-white"
      >
        ›
      </button>
    </nav>
  );
}
