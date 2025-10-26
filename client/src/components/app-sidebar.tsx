import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calendar,
  Truck,
  Clock,
  AlertTriangle,
  Package,
  Users,
  Car,
  DollarSign,
  Building2,
  Receipt,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react";
import { Link, useLocation } from "wouter";

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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/contexts/role-context";
import { hasAccessToPage } from "@/lib/role-permissions";

interface MenuItem {
  title: string;
  url?: string;
  icon?: any;
  items?: MenuItem[];
}

const allMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Operations",
    items: [
      {
        title: "New Request",
        url: "/requests/new",
        icon: PlusCircle,
      },
      {
        title: "All Requests",
        url: "/requests",
        icon: FileText,
      },
      {
        title: "Approvals",
        url: "/approvals",
        icon: CheckSquare,
      },
      {
        title: "Scheduling",
        url: "/scheduling",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Execution",
    items: [
      {
        title: "Trip Sheets",
        url: "/trips",
        icon: Truck,
      },
      {
        title: "Gate Logs",
        url: "/gate-logs",
        icon: Clock,
      },
      {
        title: "Penalties",
        url: "/penalties",
        icon: AlertTriangle,
      },
      {
        title: "Shipment Planner",
        url: "/shipments",
        icon: Package,
      },
    ],
  },
  {
    title: "Masters",
    items: [
      {
        title: "Vendors",
        url: "/vendors",
        icon: Users,
      },
      {
        title: "Vehicles",
        url: "/vehicles",
        icon: Car,
      },
      {
        title: "Rates",
        url: "/rates",
        icon: DollarSign,
      },
      {
        title: "Factories & Yards",
        url: "/factories",
        icon: Building2,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Claims",
        url: "/claims",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { currentRole, currentUser } = useRole();

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((section) => {
        if (section.items) {
          const filteredItems = section.items.filter((item) =>
            item.url && hasAccessToPage(currentRole, item.url)
          );
          if (filteredItems.length === 0) return null;
          return { ...section, items: filteredItems };
        }
        if (section.url && !hasAccessToPage(currentRole, section.url)) {
          return null;
        }
        return section;
      })
      .filter((item): item is MenuItem => item !== null);
  };

  const menuItems = filterMenuItems(allMenuItems);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Truck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-sidebar-foreground">Transport MS</h2>
            <p className="text-xs text-muted-foreground">Fleet Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuItems.map((section, idx) => (
          <SidebarGroup key={idx}>
            {section.title && !section.items && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location === section.url}
                    data-testid={`link-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={section.url!}>
                      {section.icon && <section.icon className="h-4 w-4" />}
                      <span>{section.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}

            {section.items && (
              <>
                <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url || "/"}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-sidebar-foreground" data-testid="text-sidebar-username">
              {currentUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate" data-testid="text-sidebar-email">
              {currentUser.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
