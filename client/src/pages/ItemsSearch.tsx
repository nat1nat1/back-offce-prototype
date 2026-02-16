import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ItemCard } from "@/components/items/ItemCard";
import { AdvancedFilterModal } from "@/components/items/AdvancedFilterModal";
import { useItems } from "@/hooks/use-items";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ItemsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const hasSearchOrFilters = searchQuery.trim() !== "" || Object.keys(activeFilters).length > 0;

  const { data, isLoading, error } = useItems({ 
    search: searchQuery, 
    page: currentPage,
    limit: rowsPerPage,
    ...activeFilters 
  }, {
    enabled: hasSearchOrFilters
  });

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 1;

  const handleApplyFilters = (filters: any) => {
    const flattened = {
      ...filters,
      status: filters.status.length ? filters.status.join(',') : undefined,
      brands: filters.brands.length ? filters.brands.join(',') : undefined,
      collectionStatus: filters.collectionStatus.length ? filters.collectionStatus.join(',') : undefined,
      startDate: filters.startDate?.toISOString(),
      endDate: filters.endDate?.toISOString(),
    };
    setActiveFilters(flattened);
    setCurrentPage(1);
  };

  const removeFilter = (key: string, value?: string) => {
    const newFilters = { ...activeFilters };
    if (value && typeof newFilters[key] === 'string') {
       const parts = newFilters[key].split(',').filter((p: string) => p !== value);
       if (parts.length) newFilters[key] = parts.join(',');
       else delete newFilters[key];
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 flex-1 w-full overflow-y-auto">
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by ID, title, buyer..."
                  className="pl-10 h-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  data-testid="input-search"
                />
              </div>
              <AdvancedFilterModal 
                onApply={handleApplyFilters} 
                activeFiltersCount={Object.keys(activeFilters).length}
              />
            </div>

            {(Object.keys(activeFilters).length > 0 || searchQuery) && (
               <div className="flex flex-wrap gap-2 items-center">
                 <span className="text-sm font-medium text-muted-foreground mr-2">Active filters:</span>
                 
                 {searchQuery && (
                   <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 flex items-center text-sm font-normal">
                     Search: {searchQuery}
                     <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full ml-1" onClick={() => setSearchQuery("")}>
                       <X className="w-3 h-3" />
                     </Button>
                   </Badge>
                 )}

                 {Object.entries(activeFilters).map(([key, value]) => {
                   if (!value) return null;
                   if (typeof value === 'string' && value.includes(',')) {
                      return value.split(',').map(val => (
                        <Badge key={`${key}-${val}`} variant="secondary" className="pl-3 pr-1 py-1 gap-1 flex items-center text-sm font-normal capitalize">
                          {key}: {val}
                          <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full ml-1" onClick={() => removeFilter(key, val)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ));
                   }
                   
                   return (
                     <Badge key={key} variant="secondary" className="pl-3 pr-1 py-1 gap-1 flex items-center text-sm font-normal">
                       {key}: {String(value)}
                       <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full ml-1" onClick={() => removeFilter(key)}>
                         <X className="w-3 h-3" />
                       </Button>
                     </Badge>
                   );
                 })}
                 
                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-7" onClick={clearAllFilters}>
                   Clear all
                 </Button>
               </div>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <div className="grid gap-3">
              {!hasSearchOrFilters ? (
                <div className="p-8 rounded-lg border border-dashed" data-testid="section-welcome">
                  <h3 className="text-xl font-semibold mb-3">Welcome to Back Office Items search</h3>
                  <p className="text-muted-foreground mb-4">You can search for items such as:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm mb-6">
                    <li>Item ID</li>
                    <li>Item Title</li>
                    <li>Agreement reference</li>
                    <li>Auction ID</li>
                    <li>Buyer name</li>
                    <li>Buyer email</li>
                    <li>Invoice numbers</li>
                  </ul>
                  <p className="text-muted-foreground">You can also apply advanced filters to narrow down your search results.</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-destructive/10 rounded-xl border border-destructive/30" data-testid="section-error">
                  <h3 className="text-lg font-medium text-destructive">Something went wrong</h3>
                  <p className="text-muted-foreground mt-1">{error.message}</p>
                  <Button variant="ghost" onClick={() => window.location.reload()} className="mt-2">Try again</Button>
                </div>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-card rounded-lg border p-4 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </div>
                  </div>
                ))
              ) : data?.items?.length === 0 ? (
                 <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                   <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                   <h3 className="text-lg font-medium">No items found</h3>
                   <p className="text-muted-foreground">Try adjusting your search or filters</p>
                   <Button variant="ghost" onClick={clearAllFilters} className="mt-2">Clear all filters</Button>
                 </div>
              ) : (
                data?.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1" data-testid="text-results-count">
              {data?.total?.toLocaleString() || 0} results
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger className="w-20 h-8" data-testid="select-rows-per-page">
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
                <span className="text-sm text-muted-foreground" data-testid="text-page-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden sm:flex"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    data-testid="button-first-page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden sm:flex"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
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
