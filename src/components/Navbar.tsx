import { SidebarTrigger } from "./ui/sidebar";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile: Hamburger + Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger className="md:hidden" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">eC</span>
          </div>
          <span className="hidden md:flex text-lg font-semibold">eCastle</span>
        </div>

        {/* Desktop: page title */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <h1 className="text-xl font-semibold">Products</h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
