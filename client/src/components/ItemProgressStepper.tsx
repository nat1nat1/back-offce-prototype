import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ItemProgressStepperProps {
  status: string;
  collectionStatus?: string | null;
  publishingStatus?: string | null;
}

const STAGES = [
  { key: "created", label: "Created" },
  { key: "published", label: "Published" },
  { key: "inAuction", label: "In Auction" },
  { key: "sold", label: "Sold" },
  { key: "paid", label: "Paid" },
  { key: "collected", label: "Collected" },
];

function getStageIndex(status: string, collectionStatus?: string | null, publishingStatus?: string | null): number {
  const statusLower = status?.toLowerCase() || "";
  const collectionLower = collectionStatus?.toLowerCase() || "";
  const publishingLower = publishingStatus?.toLowerCase() || "";

  if (collectionLower === "collected") return 5;
  if (statusLower === "paid") return 4;
  if (statusLower === "sold" || statusLower === "reserved") return 3;
  if (publishingLower === "published" && (statusLower === "reserved" || statusLower === "paid")) return 3;
  if (publishingLower === "published") return 2;
  if (publishingLower === "draft" || statusLower === "created") return 0;
  
  return 0;
}

export function ItemProgressStepper({ status, collectionStatus, publishingStatus }: ItemProgressStepperProps) {
  const currentIndex = getStageIndex(status, collectionStatus, publishingStatus);
  const currentStage = STAGES[currentIndex];

  return (
    <div className="flex items-center gap-3" data-testid="progress-stepper">
      <div className="flex items-center">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <Tooltip key={stage.key}>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <div
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all
                      ${isCompleted 
                        ? "bg-emerald-500 text-white" 
                        : isCurrent 
                          ? "bg-blue-500 text-white ring-2 ring-blue-200 ring-offset-1" 
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                    data-testid={`step-${stage.key}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" strokeWidth={3} />
                    ) : (
                      <span className="text-[9px] font-semibold">{index + 1}</span>
                    )}
                  </div>
                  {index < STAGES.length - 1 && (
                    <div 
                      className={`w-2.5 h-0.5 ${index < currentIndex ? "bg-emerald-500" : "bg-muted"}`}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {stage.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400" data-testid="status-label">
        {currentStage.label}
      </span>
    </div>
  );
}
