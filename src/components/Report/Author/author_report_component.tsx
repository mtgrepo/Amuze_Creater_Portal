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
import { CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useSubCategoryQuery } from "../../../composable/Query/Genre/useSubCategoryQuery";
import type { AuthorReportResponseDetails, ReportFilters } from "../../../types/response/report/authorReportResponse";
import { PageSizeComponent } from "../../common/Pagination/page-number";
import Paginator from "../../common/Pagination/paginator";
import AuthorReportColumn from "./column";
import { useTranslation } from "react-i18next";

interface AuthorReportProps {
    data: AuthorReportResponseDetails[];
    filters: ReportFilters;
    onFiltersChange: (updates: Partial<ReportFilters>) => void;
    isFetching: boolean;
    total: number;
}

export function AuthorReportComponent({ data, filters, onFiltersChange, isFetching }: AuthorReportProps) {
    const { subCategoryList } = useSubCategoryQuery();
    
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

    const columns = AuthorReportColumn();

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

    const getSafeDate = (dateStr: string): Date | undefined => {
        if (!dateStr) return undefined;
        const d = parseISO(dateStr);
        return isValid(d) ? d : undefined;
    };

    const totalRows = table.getFilteredRowModel().rows.length;
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="rounded-xl border-2 p-6 bg-card shadow-sm flex flex-col gap-8">

                {/* Date Range Section */}
                <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase  mb-4">{t('date_range')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">{t('start_date')}</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start border-2  rounded-lg", !filters.startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.startDate ? format(getSafeDate(filters.startDate)!, "PPP") : "Select start date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={getSafeDate(filters.startDate)}
                                        onSelect={(d) => onFiltersChange({ startDate: d ? format(d, "yyyy-MM-dd") : "" })}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">{t('end_date')}</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start border-2  rounded-lg", !filters.endDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.endDate ? format(getSafeDate(filters.endDate)!, "PPP") : "Select end date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={getSafeDate(filters.endDate)}
                                        onSelect={(d) => onFiltersChange({ endDate: d ? format(d, "yyyy-MM-dd") : "" })}
                                        disabled={filters.startDate ? { before: getSafeDate(filters.startDate)! } : undefined}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Category Section */}
                <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Category Filters</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="absolute -top-2 left-3 px-1 bg-card text-xs font-medium text-muted-foreground z-10">Sub-Category</label>
                            <Select value={filters.category} onValueChange={(val) => onFiltersChange({ category: val })}>
                                <SelectTrigger className="w-full border-2 h-11 rounded-lg">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All" className="font-bold">All Categories</SelectItem>
                                    {subCategoryList?.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
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