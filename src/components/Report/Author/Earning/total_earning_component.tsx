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

interface TotalEarningProps {
  authorId: number;
  filters: ReportFilters;
  onFiltersChange: (updates: Partial<ReportFilters>) => void;
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export const earningDummyData = [
  {
    id: "rec-01",
    titleName: "The Masterclass Blueprint",
    buyerName: "John Doe",
    price: 5000,
    buyingWithWallet: 4000,
    buyingWithBonus: 1000,
    created_at: "2026-06-01 10:30 AM",
  },
  {
    id: "rec-02",
    titleName: "Advanced React Patterns",
    episodeName: "03: Custom Hooks Deep Dive",
    buyerName: "Sarah Connor",
    price: 1200,
    buyingWithWallet: 1200,
    buyingWithBonus: 0,
    created_at: "2026-06-02 02:15 PM",
  },
  {
    id: "rec-03",
    titleName: "Tech Tomorrow Magazine",
    magazineSeasonName: "Summer Edition 2026",
    magazineEpisodeName: "Issue #42",
    buyerName: "Alex Smith",
    price: 750,
    buyingWithWallet: 0,
    buyingWithBonus: 750,
    created_at: "2026-06-04 09:00 AM",
  },
  {
    id: "rec-04",
    titleName: "UI/UX Design Essentials",
    episodeName: "01: Intro to Auto Layout",
    buyerName: "Emma Watson",
    price: 2500,
    buyingWithWallet: 2000,
    buyingWithBonus: 500,
    created_at: "2026-06-05 06:45 PM",
  },
  {
    id: "rec-05",
    titleName: "Creative Writing Guide",
    buyerName: "Michael Scott",
    price: 150,
    buyingWithWallet: 150,
    buyingWithBonus: 0,
    created_at: "2026-06-07 11:20 AM",
  },
  {
    id: "rec-06",
    titleName: "Fashion & Style Weekly",
    magazineSeasonName: "Volume 5",
    magazineEpisodeName: "Issue #12",
    buyerName: "Jessica Alba",
    price: 450,
    buyingWithWallet: 300,
    buyingWithBonus: 150,
    created_at: "2026-06-09 04:10 PM",
  },
];

export function TotalEarningComponent({
  authorId,
  page,
  limit,
  onPaginationChange,
}: TotalEarningProps) {
  console.log(authorId);
  // Table State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // const { incomeReports, isLoading: isFetching } = useIncomeReportQuery({ authorId, page, limit})
  const data = earningDummyData;
  const total = earningDummyData?.length;
  const isFetching = false;

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
