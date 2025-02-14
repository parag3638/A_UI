"use client";

import * as React from "react";
import { Fingerprint, LifeBuoy, Send } from "lucide-react";
import { NavMain } from "@/components/ui/nav-main";
import { NavSecondary } from "@/components/ui/nav-secondary";
import { NavUser } from "@/components/ui/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Icon from "@/assets/icon.png";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";

// Define JWT Payload
interface CustomJwtPayload extends JwtPayload {
  email: string;
  role?: string;
  name?: string;
}

// Dummy Nav Data
const baseNavMain = [
  { title: "Encypter", url: "/VaultX", icon: Fingerprint },
  { title: "Decrypter", url: "/VaultX/decrypt", icon: Fingerprint },
  { title: "Add User", url: "/VaultX/user", icon: Fingerprint }, // ✅ Only for Admins
];

const navSecondary = [
  { title: "Support", url: "/VaultX/support", icon: LifeBuoy },
  { title: "Feedback", url: "/VaultX/feedback", icon: Send },
];

function extractInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; email: string; initials: string; role: string | null } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filteredNavMain, setFilteredNavMain] = React.useState(baseNavMain); // 🔹 Store filtered menu items

  // Fetch user data only on client-side
  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        if (decoded.email) {
          const userRole = decoded.role || "user"; // Default to "user" if role is missing

          setUser({
            name: decoded.name || "",
            email: decoded.email,
            initials: extractInitials(decoded.name || ""),
            role: userRole,
          });

          // 🔹 Filter "Add User" if not admin
          if (userRole !== "admin") {
            setFilteredNavMain(baseNavMain.filter((item) => item.title !== "Add User"));
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    setLoading(false);
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/VaultX">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={Icon} alt="Abnormal" className="w-7 h-7" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VaultX</span>
                  <span className="truncate text-xs">Abnormal Inc</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* 🔹 Only show filtered nav items */}
        <NavMain items={filteredNavMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {!loading && user && <NavUser user={user} />}
        {loading && <Skeleton className="h-12" />}
      </SidebarFooter>
    </Sidebar>
  );
}


