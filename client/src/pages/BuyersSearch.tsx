import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuyerCard } from "@/components/buyers/BuyerCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Buyer } from "@shared/schema";

export default function BuyersSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [accountType, setAccountType] = useState<string>("");
  const [buyerStatus, setBuyerStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [accountType, buyerStatus, limit]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.set("search", debouncedSearch);
  if (accountType && accountType !== "all") queryParams.set("accountType", accountType);
  if (buyerStatus && buyerStatus !== "all") queryParams.set("buyerStatus", buyerStatus);
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  const hasSearchOrFilters = debouncedSearch.trim() !== "" || (accountType !== "" && accountType !== "all") || (buyerStatus !== "" && buyerStatus !== "all");

  const { data, isLoading, error } = useQuery<{ buyers: Buyer[]; total: number; page: number; limit: number }>({
    queryKey: ["/api/buyers", debouncedSearch, accountType, buyerStatus, page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/buyers?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch buyers");
      return response.json();
    },
    enabled: hasSearchOrFilters === true,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const clearFilters = () => {
    setSearch("");
    setAccountType("");
    setBuyerStatus("");
  };

  const hasFilters = search || accountType || buyerStatus;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold tracking-tight">Buyers</h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="flex gap-3">
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="flex-1 sm:w-[150px]" data-testid="select-account-type">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={buyerStatus} onValueChange={setBuyerStatus}>
                <SelectTrigger className="flex-1 sm:w-[130px]" data-testid="select-buyer-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Buyer">Buyer</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {!hasSearchOrFilters ? (
            <div className="p-8 rounded-lg border border-dashed" data-testid="section-welcome">
              <h3 className="text-xl font-semibold mb-3">Welcome to Back Office Buyer search</h3>
              <p className="text-muted-foreground mb-4">You can search for Buyer information, such as:</p>
              <ul className="list-disc ml-5 space-y-1 text-sm mb-6">
                <li>Buyer ID</li>
                <li>Name</li>
                <li>Email</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>VAT number</li>
                <li>and more</li>
              </ul>
              <p className="text-muted-foreground">You can also apply advanced filters to narrow down your search results.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading buyers. Please try again.</p>
            </div>
          ) : data?.buyers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No buyers found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.buyers.map((buyer) => (
                <BuyerCard key={buyer.id} buyer={buyer} />
              ))}
            </div>
          )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t bg-background p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1" data-testid="text-total-results">
              {data?.total || 0} results
            </div>

            <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                  <SelectTrigger className="w-[70px]" data-testid="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground" data-testid="text-page-indicator">
                  Page {page} of {totalPages || 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(1)}
                    disabled={page <= 1}
                    className="hidden sm:flex"
                    data-testid="button-first-page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                    className="hidden sm:flex"
                    data-testid="button-last-page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
