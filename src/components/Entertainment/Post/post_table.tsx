"use client"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react";
import Paginator from "@/components/common/Pagination/paginator";
import { PageSizeComponent } from "@/components/common/Pagination/page-number";
import PostColumns from "./columns";
import type { PostResponse } from "@/types/response/entertainment/post/postResponse";

interface PostTableProps {
    data: PostResponse[];
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
    onPaginationChange: (page: number, limit: number) => void;
    isFetching?: boolean;
    is_banned: boolean;
}

export function PostTable({
    data,
    total,
    totalPage,
    page,
    pageSize,
    onPaginationChange,
    isFetching = false,
    is_banned,
}: PostTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const columns = PostColumns({is_banned});
    const table = useReactTable({
        data: data ?? [],
        columns: columns,
        manualPagination: true,
        pageCount: totalPage,
        manualFiltering: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
        },
    })

    return (
        <div className="w-full">

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) :
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {total} total row(s)
                </div>
                {total > 0 && (
                    <div className="flex items-center gap-3">

                        <PageSizeComponent
                            pageSize={pageSize}
                            totalRows={total}
                            onChange={(size) =>
                                onPaginationChange(1, size === "all" ? total : size)
                            }
                        />
                        <Paginator
                            currentPage={page}
                            totalPages={totalPage}
                            onPageChange={(pageNumber) =>
                                onPaginationChange(pageNumber, pageSize)
                            }
                            showPreviousNext
                        />
                    </div>
                )}
            </div>
        </div>
    )
}