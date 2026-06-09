import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportFilters } from "@/types/response/report/authorReportResponse";
import TotalEarningColumn from "./column";
import { PageSizeComponent } from "@/components/common/Pagination/page-number";
import Paginator from "@/components/common/Pagination/paginator";

interface TotalFollowersProps {
  data: any[];
  filters: ReportFilters;
  onFiltersChange: (updates: Partial<ReportFilters>) => void;
  isFetching: boolean;
  total: number;
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export function TotalFollowersComponent({
  data,
  isFetching,
  page,
  limit,
  total,
  onPaginationChange,
}: TotalFollowersProps) {
  // Table State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [pagination, setPagination] = React.useState({
  //   pageIndex: page - 1,
  //   pageSize: limit,
  // });

  const columns = TotalEarningColumn();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className=" grid grid-cols-1 rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="font-bold py-4">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  Fetching data...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Total {totalRows} records found
        </div>
        <div className="flex items-center gap-4">
          <PageSizeComponent
            pageSize={limit}
            totalRows={total}
            onChange={(size) =>
              onPaginationChange(1, size === "all" ? total : size)
            }
          />
          <Paginator
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(p) => table.setPageIndex(p - 1)}
            showPreviousNext
          />
        </div>
      </div>
    </div>
  );
}
