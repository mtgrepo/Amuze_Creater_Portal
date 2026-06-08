import { useSearchParams } from "react-router-dom";
import * as React from "react";

interface DefaultParams {
  page?: number;
  limit?: number;
  tab?: string;
  search?: string;
}

export function useTableParams(defaults?: DefaultParams) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read values from URL, fallback to provided defaults or standard backups
  const page = Number(searchParams.get("page")) || defaults?.page || 1;
  const limit = Number(searchParams.get("limit")) || defaults?.limit || 10;
  const tab = searchParams.get("tab") || defaults?.tab || "all";
  const search = searchParams.get("search") || defaults?.search || "";

  // The reusable parameter updater function
  const updateParams = React.useCallback((updates: Record<string, string | number | undefined>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  }, [setSearchParams]);

  // Helper variations for common layout operations
  const handlePaginationChange = React.useCallback((newPage: number, newLimit: number) => {
    updateParams({ page: newPage, limit: newLimit });
  }, [updateParams]);

  const handleTabChange = React.useCallback((nextTab: string) => {
    updateParams({ tab: nextTab, page: 1 }); // Always reset to page 1 on tab swap
  }, [updateParams]);

  const handleSearchChange = React.useCallback((nextSearch: string) => {
    updateParams({ search: nextSearch, page: 1 }); // Always reset to page 1 on typing match
  }, [updateParams]);

  return {
    page,
    limit,
    tab,
    search,
    updateParams,
    handlePaginationChange,
    handleTabChange,
    handleSearchChange,
  };
}