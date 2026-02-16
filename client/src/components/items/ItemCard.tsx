import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2,
  Hash,
  Gavel,
  User,
  Link2,
  Calendar,
  Mail,
  Phone,
  Clock,
  FileText,
  Package,
  Truck,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import type { Item } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ItemCardProps {
  item: Item;
}

function CopyableField({ 
  icon: Icon, 
  label,
  value, 
  subValue,
  testId 
}: { 
  icon: any;
  label: string;
  value: string | null | undefined;
  subValue?: string | null;
  testId: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({ 
        title: "Copied to clipboard",
        description: value.length > 50 ? value.substring(0, 50) + "..." : value
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const displayValue = value || "-";

  return (
    <div className="group flex items-start gap-2 text-sm min-w-0" data-testid={testId}>
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-label={label} title={label} />
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <div className="min-w-0">
          <span className="text-foreground truncate block">{displayValue}</span>
          {subValue && (
            <span className="text-muted-foreground text-xs truncate block">{subValue}</span>
          )}
        </div>
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 invisible group-hover:visible"
            onClick={handleCopy}
            data-testid={`${testId}-copy`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function CopyableFieldStacked({ 
  icon: Icon, 
  label,
  value, 
  secondIcon: SecondIcon,
  secondLabel,
  secondValue,
  testId 
}: { 
  icon: any;
  label: string;
  value: string | null | undefined;
  secondIcon?: any;
  secondLabel?: string;
  secondValue?: string | null;
  testId: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedSecond, setCopiedSecond] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent, text: string, isSecond?: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      if (isSecond) {
        setCopiedSecond(true);
        setTimeout(() => setCopiedSecond(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      toast({ 
        title: "Copied to clipboard",
        description: text.length > 50 ? text.substring(0, 50) + "..." : text
      });
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-1" data-testid={testId}>
      <div className="group flex items-center gap-2 text-sm min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" aria-label={label} title={label} />
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="text-foreground truncate">{value || "-"}</span>
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 invisible group-hover:visible"
              onClick={(e) => handleCopy(e, value)}
              data-testid={`${testId}-copy`}
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
      {SecondIcon && (
        <div className="group flex items-center gap-2 text-sm min-w-0">
          <SecondIcon className="w-4 h-4 text-muted-foreground shrink-0" aria-label={secondLabel || ""} title={secondLabel || ""} />
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-foreground truncate">{secondValue || "-"}</span>
            {secondValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0 invisible group-hover:visible"
                onClick={(e) => handleCopy(e, secondValue, true)}
                data-testid={`${testId}-second-copy`}
              >
                {copiedSecond ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ItemCard({ item }: ItemCardProps) {
  const statusBadgeClass = 
    item.listingStatus === 'READY_FOR_CHECKOUT' || item.status === 'Reserved' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
    item.listingStatus === 'COMPLETED' || item.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
    item.listingStatus === 'DRAFT' || item.status === 'Created' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
    'bg-gray-100 text-gray-700';

  const statusLabel = 
    item.listingStatus === 'READY_FOR_CHECKOUT' ? 'Ready for checkout' :
    item.listingStatus === 'COMPLETED' ? 'Completed' :
    item.listingStatus === 'DRAFT' ? 'Draft' :
    item.status;

  const lotEndDate = item.closingDate 
    ? format(new Date(item.closingDate), "dd MMM yyyy, HH:mm")
    : item.date 
      ? format(new Date(item.date), "dd MMM yyyy, HH:mm")
      : null;

  const returnedToInventoryStatus = item.collectionStatus === "Collected" 
    ? "Returned" 
    : "Not returned to inventory";

  return (
    <div className="bg-white dark:bg-card border border-border rounded-lg overflow-visible" data-testid={`card-item-${item.id}`}>
      <Link href={`/items/${item.id}`}>
        <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-sm font-semibold text-foreground whitespace-nowrap">
                # {item.lotDisplayId || item.displayId}
              </span>
              <span className="text-foreground font-medium truncate">
                {item.lotTitle || item.title}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={`shrink-0 border-0 text-xs font-medium ${statusBadgeClass}`}
              data-testid={`badge-status-${item.id}`}
            >
              {statusLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            <CopyableField
              icon={Building2}
              label="Company ID"
              value={item.companyName}
              subValue={item.companyId}
              testId={`field-company-${item.id}`}
            />

            <CopyableField
              icon={Hash}
              label="Lot ID"
              value={item.lotDisplayId || item.displayId}
              testId={`field-lot-${item.id}`}
            />

            <CopyableField
              icon={Gavel}
              label="Auction ID"
              value={item.auctionDisplayId}
              subValue={item.auctionTitle}
              testId={`field-auction-${item.id}`}
            />

            <CopyableField
              icon={User}
              label="Buyer Name"
              value={item.buyerName}
              testId={`field-buyer-${item.id}`}
            />

            <CopyableField
              icon={Link2}
              label="Agreement Reference"
              value={item.agreementReference}
              subValue={item.agreementName}
              testId={`field-agreement-${item.id}`}
            />

            <CopyableField
              icon={Clock}
              label="Lot End Date"
              value={lotEndDate}
              testId={`field-lot-end-${item.id}`}
            />

            <CopyableFieldStacked
              icon={Mail}
              label="Buyer Email"
              value={item.buyerEmail}
              secondIcon={Phone}
              secondLabel="Buyer Phone"
              secondValue={item.buyerPhone}
              testId={`field-buyer-contact-${item.id}`}
            />

            <div aria-hidden="true" />

            <CopyableField
              icon={Calendar}
              label="Collection Days"
              value={item.collectionWindow}
              subValue={item.collectionContactInfo}
              testId={`field-collection-days-${item.id}`}
            />

            <CopyableField
              icon={FileText}
              label="Invoice Numbers"
              value={null}
              testId={`field-invoice-${item.id}`}
            />

            <CopyableField
              icon={Package}
              label="Returned to Inventory Status"
              value={returnedToInventoryStatus}
              subValue={item.allocation}
              testId={`field-returned-${item.id}`}
            />

            <CopyableField
              icon={Truck}
              label="Collection Status"
              value={item.collectionStatus}
              subValue={item.dayPartition}
              testId={`field-collection-status-${item.id}`}
            />
          </div>

          <div className="flex items-center justify-end mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`/items/${item.id}`, '_blank');
              }}
              data-testid={`button-view-atlas-${item.id}`}
              title="View Item in Atlas"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
