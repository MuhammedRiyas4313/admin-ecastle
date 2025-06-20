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

import { User, ChevronUp, Package, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "../../public/images/logo.png";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "./ui/dialog";

const items = [{ title: "Products", url: "/products", icon: Package }];

export function AppSidebar() {
  const { isOpen, setOpen } = useSidebar();
  const session = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // check initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <Sidebar className="h-screen min-w-[230px] bg-background border-r">
      {!isOpen && (
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
              <Image src={logo} fill alt="Logo" />
            </div>
            <span className="text-lg font-semibold">eCastle</span>
          </div>
        </SidebarHeader>
      )}

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
                <SidebarMenuButton className="min-w-[215px] justify-between">
                  <div className="flex items-center w-full gap-3">
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
              <DropdownMenuContent side="top" className="w-56 z-[200]">
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

  // ✅ Render one sidebar version based on screen size
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
        <DialogContent className="max-h-screen fixed left-[7rem] bottom-42 top-42 w-[230px] bg-background z-[110] p-0">
          <DialogTitle className="sr-only">Sidebar</DialogTitle>
          <DialogDescription className="sr-only">
            Use this sidebar to navigate.
          </DialogDescription>
          {sidebarContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed top-0 left-0 z-50 hidden md:flex">
      {sidebarContent}
    </div>
  );
}
