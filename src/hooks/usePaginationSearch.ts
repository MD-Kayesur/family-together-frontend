"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsePaginationSearchOptions {
  defaultLimit?: number;
  searchParamKey?: string;
  pageParamKey?: string;
  limitParamKey?: string;
  debounceMs?: number;
}

export function usePaginationSearch(options: UsePaginationSearchOptions = {}) {
  const {
    defaultLimit = 10,
    searchParamKey = "search",
    pageParamKey = "page",
    limitParamKey = "limit",
    debounceMs = 300,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial values from URL query string
  const getRouteSearch = () =>
    searchParams?.get(searchParamKey) || searchParams?.get("q") || "";

  const getRoutePage = () => {
    const raw = searchParams?.get(pageParamKey);
    const parsed = parseInt(raw || "1", 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  const getRouteLimit = () => {
    const raw = searchParams?.get(limitParamKey);
    const parsed = parseInt(raw || String(defaultLimit), 10);
    return isNaN(parsed) || parsed < 1 ? defaultLimit : parsed;
  };

  const [searchTerm, setSearchTermState] = useState(getRouteSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(getRouteSearch);
  const [page, setPage] = useState(getRoutePage);
  const [limit, setLimit] = useState(getRouteLimit);

  // Helper to instantly update the URL route in browser history without reload or focus loss
  const updateUrlRouteImmediately = useCallback(
    (newSearch: string, newPage: number, newLimit?: number) => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);

      // Search param: reflect in real-time as the user types
      if (newSearch && newSearch.trim()) {
        params.set(searchParamKey, newSearch);
      } else {
        params.delete(searchParamKey);
        params.delete("q");
      }

      // Page param: if page > 1, keep it; if reset to 1 on typing, clear or set 1
      if (newPage > 1) {
        params.set(pageParamKey, String(newPage));
      } else {
        params.delete(pageParamKey);
      }

      // Limit param
      if (newLimit && newLimit !== defaultLimit) {
        params.set(limitParamKey, String(newLimit));
      }

      const queryString = params.toString();
      const updatedUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", updatedUrl);
    },
    [pathname, searchParamKey, pageParamKey, limitParamKey, defaultLimit]
  );

  // Sync internal state when external navigation occurs (e.g. browser back/forward or tab clicks)
  useEffect(() => {
    const currentRouteSearch = getRouteSearch();
    const currentRoutePage = getRoutePage();
    const currentRouteLimit = getRouteLimit();

    // Only update if genuinely different (e.g. user hit back button or switched tabs)
    if (currentRouteSearch !== searchTerm) {
      setSearchTermState(currentRouteSearch);
      setDebouncedSearch(currentRouteSearch);
    }
    if (currentRoutePage !== page) {
      setPage(currentRoutePage);
    }
    if (currentRouteLimit !== limit) {
      setLimit(currentRouteLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce API query triggering whenever searchTerm changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // When user types in search input:
  // 1. Update searchTerm state immediately (smooth input response)
  // 2. Update browser address bar route IMMEDIATELY (real-time route sync)
  // 3. Reset page to 1
  const handleSearchChange = useCallback(
    (valueOrEvent: string | React.ChangeEvent<HTMLInputElement>) => {
      const newTerm =
        typeof valueOrEvent === "string"
          ? valueOrEvent
          : valueOrEvent?.target?.value ?? "";
      setSearchTermState(newTerm);
      setPage(1);
      updateUrlRouteImmediately(newTerm, 1, limit);
    },
    [updateUrlRouteImmediately, limit]
  );

  // Direct clear search button
  const handleClearSearch = useCallback(() => {
    setSearchTermState("");
    setDebouncedSearch("");
    setPage(1);
    updateUrlRouteImmediately("", 1, limit);
  }, [updateUrlRouteImmediately, limit]);

  // Page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      const safePage = Math.max(1, newPage);
      setPage(safePage);
      updateUrlRouteImmediately(searchTerm, safePage, limit);
    },
    [updateUrlRouteImmediately, searchTerm, limit]
  );

  // Limit change
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
      updateUrlRouteImmediately(searchTerm, 1, newLimit);
    },
    [updateUrlRouteImmediately, searchTerm]
  );

  return {
    searchTerm,
    debouncedSearch,
    page,
    limit,
    setSearchTerm: handleSearchChange,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    clearSearch: handleClearSearch,
  };
}
