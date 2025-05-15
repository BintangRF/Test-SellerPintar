"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  actions?: React.ReactNode;
  rowLimit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  actions,
  rowLimit = 10,
  total = data.length,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / rowLimit);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex: page - 1,
        pageSize: rowLimit,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const handlePageChange = (newPage: number) => {
    const adjustedPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(adjustedPage);
    onPageChange?.(adjustedPage);
  };

  const start = (page - 1) * rowLimit + 1;
  const end = Math.min(start + data.length - 1, total);

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records..."
            value={globalFilter ?? ""}
            onChange={(e) => onGlobalFilterChange?.(e.target.value)}
            className="pl-10 w-full bg-gray-50 focus:bg-white"
          />
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>

      {/* Table container */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table className="border-collapse">
          <TableHeader className="bg-blue-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-2 font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                    >
                      <div
                        className="flex items-center justify-between"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="ml-2 text-gray-400">
                            {isSorted === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : isSorted === "desc" ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                      {header.column.getCanFilter() && (
                        <div className="mt-2">
                          <Input
                            placeholder={`Filter...`}
                            value={
                              (header.column.getFilterValue() as string) ?? ""
                            }
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                            className="h-8 bg-white text-sm"
                          />
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-3 whitespace-nowrap text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 bg-white rounded-lg shadow-sm border">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{start}</span> to{" "}
          <span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 px-0 ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && page < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            {totalPages > 5 && page < totalPages - 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="w-10 px-0 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
