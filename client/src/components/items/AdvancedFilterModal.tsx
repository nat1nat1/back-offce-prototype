import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Filters {
  status: string[];
  brands: string[];
  collectionStatus: string[];
  companyName: string;
  companyId: string;
  agreementReference: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  auctionDisplayId: string;
  lotDisplayId: string;
  startDate?: Date;
  endDate?: Date;
}

interface AdvancedFilterModalProps {
  onApply: (filters: Filters) => void;
  activeFiltersCount: number;
}

export function AdvancedFilterModal({ onApply, activeFiltersCount }: AdvancedFilterModalProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    brands: [],
    collectionStatus: [],
    companyName: "",
    companyId: "",
    agreementReference: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    auctionDisplayId: "",
    lotDisplayId: "",
  });

  const handleApply = () => {
    onApply(filters);
    setOpen(false);
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status) 
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const toggleCollection = (status: string) => {
    setFilters(prev => ({
      ...prev,
      collectionStatus: prev.collectionStatus.includes(status)
        ? prev.collectionStatus.filter(s => s !== status)
        : [...prev.collectionStatus, status]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 text-foreground font-medium border-border shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Advanced filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">Advanced filters</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <Tabs defaultValue="status" orientation="vertical" className="flex-1 flex w-full">
            <div className="w-48 border-r bg-muted/20">
              <TabsList className="flex flex-col h-full justify-start space-y-1 bg-transparent p-2">
                {["Status", "Brand", "Buyer", "Collection", "Company", "Lot", "Auction"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="w-full justify-start px-3 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6 bg-white">
              <TabsContent value="status" className="mt-0 space-y-4">
                <h3 className="font-semibold mb-4">Item Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Archived", "Auctioned", "Created", "Failed", "Paid",
                    "Payment pending", "Proposal", "Proposal rejected",
                    "Ready for checkout", "Reserved", "Unsold"
                  ].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`} 
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="brand" className="mt-0 space-y-4">
                <h3 className="font-semibold mb-4">Brand</h3>
                <div className="space-y-3">
                  {[
                    "HT Auctions & Valuations", "Klaravik Finland",
                    "Surplex", "Troostwijk", "Vavato"
                  ].map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">{brand}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="buyer" className="mt-0 space-y-4">
                <h3 className="font-semibold mb-4">Buyer Information</h3>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-email">Filter by buyer email</Label>
                    <Input 
                      id="buyer-email" 
                      placeholder="e.g. john@example.com"
                      value={filters.buyerEmail}
                      onChange={(e) => setFilters({...filters, buyerEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Filter by buyer name</Label>
                    <Input 
                      id="buyer-name" 
                      placeholder="e.g. John Doe" 
                      value={filters.buyerName}
                      onChange={(e) => setFilters({...filters, buyerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-phone">Filter by buyer phone number</Label>
                    <Input 
                      id="buyer-phone" 
                      placeholder="e.g. +31 6..." 
                      value={filters.buyerPhone}
                      onChange={(e) => setFilters({...filters, buyerPhone: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collection" className="mt-0 space-y-4">
                <h3 className="font-semibold mb-4">Collection Status</h3>
                <div className="space-y-3">
                  {["Collected", "Not collected"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`col-${status}`}
                        checked={filters.collectionStatus.includes(status)}
                        onCheckedChange={() => toggleCollection(status)}
                      />
                      <Label htmlFor={`col-${status}`} className="text-sm font-normal cursor-pointer">{status}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="company" className="mt-0 space-y-4">
                <h3 className="font-semibold mb-4">Company Details</h3>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                    <Label>Filter by agreement reference</Label>
                    <Input 
                      value={filters.agreementReference}
                      onChange={(e) => setFilters({...filters, agreementReference: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by company ID</Label>
                    <Input 
                      value={filters.companyId}
                      onChange={(e) => setFilters({...filters, companyId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter by company name</Label>
                    <Input 
                      value={filters.companyName}
                      onChange={(e) => setFilters({...filters, companyName: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lot" className="mt-0 space-y-4">
                 <h3 className="font-semibold mb-4">Lot Information</h3>
                 <div className="grid gap-4 max-w-sm">
                   <div className="space-y-2">
                     <Label>Start Date</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant={"outline"}
                           className={cn(
                             "w-full justify-start text-left font-normal",
                             !filters.startDate && "text-muted-foreground"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {filters.startDate ? format(filters.startDate, "PPP") : <span>Pick a date</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar
                           mode="single"
                           selected={filters.startDate}
                           onSelect={(date) => setFilters({...filters, startDate: date})}
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   </div>
                   <div className="space-y-2">
                     <Label>End Date</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant={"outline"}
                           className={cn(
                             "w-full justify-start text-left font-normal",
                             !filters.endDate && "text-muted-foreground"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {filters.endDate ? format(filters.endDate, "PPP") : <span>Pick a date</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar
                           mode="single"
                           selected={filters.endDate}
                           onSelect={(date) => setFilters({...filters, endDate: date})}
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   </div>
                   <div className="space-y-2 pt-4">
                      <Label>Filter by Lot Display ID</Label>
                      <Input 
                        value={filters.lotDisplayId}
                        onChange={(e) => setFilters({...filters, lotDisplayId: e.target.value})}
                      />
                   </div>
                 </div>
              </TabsContent>

              <TabsContent value="auction" className="mt-0 space-y-4">
                 <h3 className="font-semibold mb-4">Auction Information</h3>
                 <div className="space-y-2 max-w-sm">
                    <Label>Filter by Auction Display ID</Label>
                    <Input 
                      value={filters.auctionDisplayId}
                      onChange={(e) => setFilters({...filters, auctionDisplayId: e.target.value})}
                    />
                 </div>
              </TabsContent>

            </ScrollArea>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleApply}>Apply filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
