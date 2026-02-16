import { Link, useLocation } from "wouter";
import { 
  Home, 
  Search, 
  ScrollText, 
  Phone, 
  Mail, 
  ExternalLink,
  Settings,
  ChevronDown,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <div className={`w-64 border-r bg-card flex flex-col h-screen fixed left-0 top-0 z-40 shadow-sm transition-transform duration-200 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <h1 className="font-bold text-lg tracking-tight">TBA Back Office</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={onClose}
          data-testid="button-close-sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/" onClick={handleNavClick} className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/release-notes" onClick={handleNavClick} className={`sidebar-link ${isActive('/release-notes') ? 'active' : ''}`}>
            <ScrollText className="w-4 h-4" />
            Release notes
          </Link>
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</h3>
          <Link href="/items" onClick={handleNavClick} className={`sidebar-link ${isActive('/items') ? 'active' : ''}`}>
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Buyers</h3>
          <Link href="/buyers" onClick={handleNavClick} className={`sidebar-link ${isActive('/buyers') ? 'active' : ''}`}>
            <Search className="w-4 h-4" />
            Search
          </Link>
          <button className="w-full sidebar-link cursor-not-allowed opacity-60">
            <Phone className="w-4 h-4" />
            SMS Verification
          </button>
          <button className="w-full sidebar-link cursor-not-allowed opacity-60">
            <Mail className="w-4 h-4" />
            Emails
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Links</h3>
          <a href="#" className="sidebar-link">
            <ExternalLink className="w-4 h-4" />
            Atlas
          </a>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/30">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors outline-none">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@tba.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Language: English</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
