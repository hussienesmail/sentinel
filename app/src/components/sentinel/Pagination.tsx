import type { PaginationData } from "@/data/pagination";
import { Button } from "../ui/button";

interface PaginationProps {
  data: PaginationData;
  onPageChange: (page: number) => void;
}

export function Pagination({ data, onPageChange }: PaginationProps) {
  const { page: currentPage, total_pages: totalPages } = data;

  return (
    <div className="flex items-center justify-end gap-2 select-none text-sm">
      <Button
        size="sm"
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <Button
        size="sm"
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
