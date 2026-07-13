import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CruisePaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function CruisePagination({ page, totalPages, buildHref }: CruisePaginationProps) {
  if (totalPages <= 1) return null;

  const keep = new Set<number>(
    [1, totalPages, page, page - 1, page - 2, page + 1, page + 2].filter((p) => p >= 1 && p <= totalPages)
  );
  const sorted = Array.from(keep).sort((a, b) => a - b);

  const items: (number | 'ellipsis')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push('ellipsis');
    items.push(p);
    prev = p;
  }

  const navButtonClass = (disabled: boolean) =>
    `w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
      disabled
        ? 'pointer-events-none opacity-40 border-slate-200 dark:border-slate-800 text-slate-400'
        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4" aria-label="Pagination">
      <Link href={buildHref(Math.max(1, page - 1))} aria-disabled={page <= 1} className={navButtonClass(page <= 1)}>
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
              item === page
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link href={buildHref(Math.min(totalPages, page + 1))} aria-disabled={page >= totalPages} className={navButtonClass(page >= totalPages)}>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
