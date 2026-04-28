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
    type VisibilityState
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type {ReportFilters } from "../../../types/response/report/authorReportResponse";
import { PageSizeComponent } from "../../common/Pagination/page-number";
import Paginator from "../../common/Pagination/paginator";
import { type PurchaseRow } from "./column";
import PurchaseReportColumn from "./column";

interface PurchaseReportProps {
    data: PurchaseRow[];
    filters: ReportFilters;
    onFiltersChange: (updates: Partial<ReportFilters>) => void;
    isFetching: boolean;
    total: number;
}

export function PurchaseReportComponent({ data, isFetching }: PurchaseReportProps) {
    
    // Table State
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = PurchaseReportColumn();

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
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });



    const totalRows = table.getFilteredRowModel().rows.length;

    return (
        <div className="space-y-6">

            {/* Table */}
            <div className=" grid grid-cols-1 rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id} className="font-bold py-4">
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow><TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground italic">Fetching data...</TableCell></TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">Total {totalRows} records found</div>
                <div className="flex items-center gap-4">
                    <PageSizeComponent pageSize={pagination.pageSize} totalRows={totalRows} onChange={(s) => setPagination(p => ({ ...p, pageSize: s === 'all' ? totalRows : s, pageIndex: 0 }))} />
                    <Paginator currentPage={table.getState().pagination.pageIndex + 1} totalPages={table.getPageCount()} onPageChange={(p) => table.setPageIndex(p - 1)} showPreviousNext />
                </div>
            </div>
        </div>
    );
}