import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import ItemsSearch from "@/pages/ItemsSearch";
import ItemDetails from "@/pages/ItemDetails";
import ReleaseNotes from "@/pages/ReleaseNotes";
import BuyersSearch from "@/pages/BuyersSearch";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/items" component={ItemsSearch} />
      <Route path="/items/:id" component={ItemDetails} />
      <Route path="/release-notes" component={ReleaseNotes} />
      <Route path="/buyers" component={BuyersSearch} />
      
      {/* Placeholder Routes for non-implemented sidebar links */}
      <Route path="/buyers/sms" component={() => <div>SMS Verification (Coming Soon)</div>} />
      <Route path="/buyers/emails" component={() => <div>Emails (Coming Soon)</div>} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
