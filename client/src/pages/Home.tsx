import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Users, Building2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useReleaseNotes } from "@/hooks/use-release-notes";

export default function Home() {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy 'at' h:mm:ss a 'GMT'");
  const { data: releaseNotes, isLoading: notesLoading } = useReleaseNotes();
  const latestNotes = releaseNotes?.slice(0, 3) || [];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-sm text-muted-foreground" data-testid="text-current-date">
          {currentDate}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-welcome-title">
            Welcome to TBA Back Office
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Choose a category below to search our records<span className="hidden sm:inline"> or use the navigation on the left</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SearchCard
            title="Item Search"
            description="Manage and track individual auction lots"
            icon={Package}
            buttonText="Go to Item Search"
            href="/items"
            testId="card-item-search"
          />

          <SearchCard
            title="Buyer Search"
            description="Access buyer profiles and contact credentials"
            icon={Users}
            buttonText="Go to Buyer Search"
            href="/buyers"
            testId="card-buyer-search"
          />

          <SearchCard
            title="Seller Search"
            description="Manage seller entities and corporate information"
            icon={Building2}
            buttonText="Go to Seller Search"
            href="/sellers"
            testId="card-seller-search"
          />
        </div>

        <div className="space-y-4" data-testid="section-latest-updates">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Updates</h2>
            <Link href="/release-notes">
              <Button variant="ghost" size="sm" data-testid="button-view-all-updates">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {notesLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : latestNotes.length > 0 ? (
                <div className="divide-y">
                  {latestNotes.map((note) => (
                    <Link key={note.id} href="/release-notes">
                      <div 
                        className="flex items-center gap-4 px-4 py-3 hover-elevate cursor-pointer"
                        data-testid={`row-release-note-${note.id}`}
                      >
                        <span className="text-sm text-muted-foreground shrink-0 w-20">
                          {format(new Date(note.date), "MMM d")}
                        </span>
                        <span className="text-sm font-medium truncate">
                          {note.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No release notes yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

interface SearchCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  href: string;
  testId: string;
}

function SearchCard({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  href,
  testId 
}: SearchCardProps) {
  return (
    <Card className="flex flex-col" data-testid={testId}>
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <Link href={href}>
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            data-testid={`button-${testId}`}
          >
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
