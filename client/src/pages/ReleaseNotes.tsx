import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useReleaseNotes } from "@/hooks/use-release-notes";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";

export default function ReleaseNotes() {
  const { data: notes, isLoading } = useReleaseNotes();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-2">
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
             <ScrollText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
             Release Notes
           </h1>
           <p className="text-muted-foreground text-sm sm:text-base">
             Stay up to date with the latest changes and improvements.
           </p>
        </div>

        <div className="relative border-l border-border/60 ml-2 sm:ml-3 space-y-8 sm:space-y-12 pb-8 sm:pb-12">
          {isLoading ? (
             <div className="pl-8 space-y-4">Loading updates...</div>
          ) : (
            notes?.map((note) => (
              <div key={note.id} className="relative pl-6 sm:pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary border-4 border-background shadow-sm" />
                
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-12">
                   <div className="md:w-32 shrink-0 pt-0.5">
                     <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                       {format(new Date(note.date), "MMM d, yyyy")}
                     </span>
                   </div>
                   
                   <Card className="flex-1 shadow-sm border-border/60 bg-white">
                     <CardContent className="p-4 sm:p-6">
                       <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{note.title}</h2>
                       <div className="prose prose-sm max-w-none text-muted-foreground mb-4">
                         {note.content}
                       </div>
                       
                       {note.tags && note.tags.length > 0 && (
                         <div className="flex gap-2">
                           {note.tags.map(tag => (
                             <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                               {tag}
                             </Badge>
                           ))}
                         </div>
                       )}
                     </CardContent>
                   </Card>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
