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
import { useFollowersReportQuery } from "@/composable/Query/Report/useFollowersReportQuery";
// import { useFollowersReportQuery } from "@/composable/Query/Report/useFollowersReportQuery";

interface TotalFollowersProps {
  authorId: number | null; 
  filters: ReportFilters;
  onFiltersChange: (updates: Partial<ReportFilters>) => void;
  page: number;
  limit: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export const dummyData = [
  {
    id: 1,
    profile: '',
    name: 'Jenie',
    phone_no: '09787878787',
    email: 'test@gmail.com',
    wallets: {
      balance: 500
    },
    created_at: '2026-06-01T08:00:00Z'
  },
  {
    id: 2,
    profile: '',
    name: 'Alex Smith',
    phone_no: '09765432100',
    email: 'alex.smith@gmail.com',
    wallets: {
      balance: 1250
    },
    created_at: '2026-06-03T10:15:00Z'
  },
  {
    id: 3,
    profile: '',
    name: 'Sarah Connor',
    phone_no: '09123456789',
    email: 's.connor@gmail.com',
    wallets: {
      balance: 75
    },
    created_at: '2026-06-05T14:30:00Z'
  },
  {
    id: 4,
    profile: '',
    name: 'Michael Scott',
    phone_no: '09988776655',
    email: 'm.scott@gmail.com',
    wallets: {
      balance: 0
    },
    created_at: '2026-06-07T11:45:00Z'
  },
  {
    id: 5,
    profile: '',
    name: 'Emma Watson',
    phone_no: '09445566778',
    email: 'emma.w@gmail.com',
    wallets: {
      balance: 3200
    },
    created_at: '2026-06-09T09:00:00Z'
  }
];

export function TotalFollowersComponent({
  authorId,
  page,
  limit,
  onPaginationChange,
}: TotalFollowersProps) {

  const { followersList, isLoading: isFetching } = useFollowersReportQuery({
    page,
    limit,
    authorId: authorId!,
  });

  // console.log(authorId)

  // Safe fallback arrays/metrics
  const data = followersList ?? dummyData 
  const total = dummyData.length ?? 0;

  // Table State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
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
    // pageCount: Math.ceil(total / limit), 
    // manualPagination: true, 
  });

  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="grid grid-cols-1 rounded-md border overflow-hidden">
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
            currentPage={page}
            totalPages={table.getPageCount()}
            onPageChange={(p) => onPaginationChange(p, limit)} // Route pagination changes back up to hook-state
            showPreviousNext
          />
        </div>
      </div>
    </div>
  );
}