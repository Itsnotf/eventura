import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildPages(current: number, total: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== '...') pages.push('...');
    }
    return pages;
}

export function Pagination({
    currentPage,
    lastPage,
    onPage,
}: {
    currentPage: number;
    lastPage: number;
    onPage: (page: number) => void;
}) {
    if (lastPage <= 1) return null;

    const navBtn =
        'w-11 h-11 flex items-center justify-center rounded-lg border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container active:bg-lp-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                disabled={currentPage === 1}
                onClick={() => onPage(currentPage - 1)}
                aria-label="Halaman sebelumnya"
                className={navBtn}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Mobile: indikator ringkas */}
            <span className="sm:hidden text-sm font-semibold text-lp-on-surface px-2">
                Hal {currentPage} / {lastPage}
            </span>

            {/* Desktop/tablet: nomor halaman */}
            <div className="hidden sm:flex items-center gap-2">
                {buildPages(currentPage, lastPage).map((item, idx) =>
                    item === '...' ? (
                        <span key={`e-${idx}`} className="text-lp-on-surface-variant px-1 text-sm">...</span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPage(item as number)}
                            aria-current={currentPage === item ? 'page' : undefined}
                            className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                currentPage === item
                                    ? 'bg-lp-primary text-lp-on-primary'
                                    : 'border border-lp-outline-variant text-lp-on-surface-variant hover:bg-lp-surface-container'
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}
            </div>

            <button
                disabled={currentPage === lastPage}
                onClick={() => onPage(currentPage + 1)}
                aria-label="Halaman berikutnya"
                className={navBtn}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
