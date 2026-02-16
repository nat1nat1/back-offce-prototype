import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Globe,
  Ban,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import type { Buyer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface BuyerCardProps {
  buyer: Buyer;
}

function CopyableField({ 
  icon: Icon, 
  label,
  value, 
  subValue,
  testId,
  isPlaceholder = false
}: { 
  icon: any;
  label: string;
  value: string | null | undefined;
  subValue?: string | null;
  testId: string;
  isPlaceholder?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value || isPlaceholder) return;
    
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
  const showCopyButton = value && !isPlaceholder;

  return (
    <div className="group flex items-start gap-2 text-sm min-w-0" data-testid={testId}>
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-label={label} title={label} />
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <div className="min-w-0">
          <span className={`truncate block ${isPlaceholder ? 'text-muted-foreground' : 'text-foreground'}`}>{displayValue}</span>
          {subValue && (
            <span className="text-muted-foreground text-xs truncate block">{subValue}</span>
          )}
        </div>
        {showCopyButton && (
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

export function BuyerCard({ buyer }: BuyerCardProps) {
  const statusBadgeClass = 
    buyer.buyerStatus === 'Buyer' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
    buyer.buyerStatus === 'Guest' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
    'bg-gray-100 text-gray-700';

  const accountTypeBadgeClass = 
    buyer.accountType === 'Company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';

  const registeredDate = buyer.registeredDate 
    ? format(new Date(buyer.registeredDate), "dd MMM yyyy")
    : null;

  return (
    <div className="bg-white dark:bg-card border border-border rounded-lg overflow-visible" data-testid={`card-buyer-${buyer.id}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span 
              className="font-mono text-sm font-semibold text-primary whitespace-nowrap"
              data-testid={`text-buyer-id-${buyer.id}`}
            >
              {buyer.buyerId}
            </span>
            {buyer.isBlocked && (
              <span title="Blocked">
                <Ban className="w-4 h-4 text-destructive shrink-0" />
              </span>
            )}
            <span className="text-foreground font-medium truncate">
              {buyer.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`shrink-0 border-0 text-xs font-medium ${accountTypeBadgeClass}`}
              data-testid={`badge-account-type-${buyer.id}`}
            >
              {buyer.accountType}
            </Badge>
            <Badge 
              variant="outline" 
              className={`shrink-0 border-0 text-xs font-medium ${statusBadgeClass}`}
              data-testid={`badge-status-${buyer.id}`}
            >
              {buyer.buyerStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
          <CopyableField
            icon={Mail}
            label="Email"
            value={buyer.email}
            testId={`field-email-${buyer.id}`}
          />

          <CopyableField
            icon={Phone}
            label="Phone"
            value={buyer.phone}
            testId={`field-phone-${buyer.id}`}
          />

          <CopyableField
            icon={Building2}
            label="Company Name"
            value={buyer.companyName || "N/A"}
            isPlaceholder={!buyer.companyName}
            testId={`field-company-${buyer.id}`}
          />

          <CopyableField
            icon={FileText}
            label="VAT Number"
            value={buyer.vatNumber || "N/A"}
            isPlaceholder={!buyer.vatNumber}
            testId={`field-vat-${buyer.id}`}
          />

          <CopyableField
            icon={Calendar}
            label="Registered Date"
            value={registeredDate || "N/A"}
            isPlaceholder={!registeredDate}
            testId={`field-registered-${buyer.id}`}
          />

          <CopyableField
            icon={Globe}
            label="Country"
            value={buyer.country || "N/A"}
            isPlaceholder={!buyer.country}
            testId={`field-country-${buyer.id}`}
          />
        </div>

      </div>
    </div>
  );
}
