"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

import { useSession } from "next-auth/react";
import { User, ChevronUp, Package, FolderOpen } from "lucide-react";

// Menu items
const items = [
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: FolderOpen },
];

export function AppSidebar() {
  const { isOpen, setOpen } = useSidebar();
  const session = useSession();

  const SidebarStructure = () => (
    <Sidebar className="h-screen w-[230px] bg-background border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">eC</span>
          </div>
          <span className="text-lg font-semibold">eCastle</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-muted-foreground">
                        {session?.data?.user?.email}
                      </p>
                    </div>
                  </div>
                  <ChevronUp className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 z-50">
        <SidebarStructure />
      </div>

      {/* Mobile sidebar (Dialog) */}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent
          className="p-0 w-[230px] h-screen border-none bg-background"
        >
          <DialogTitle className="sr-only">Sidebar</DialogTitle>
          <DialogDescription className="sr-only">
            Navigation menu
          </DialogDescription>
          <SidebarStructure />
        </DialogContent>
      </Dialog>
    </>
  );
}
