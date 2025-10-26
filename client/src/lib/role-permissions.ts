import { UserRole } from "@shared/schema";

export type Permission = "read" | "create" | "edit" | "delete" | "approve" | "action";

export interface PagePermission {
  path: string;
  title: string;
  permissions: Permission[];
}

export const rolePermissions: Record<UserRole, PagePermission[]> = {
  requester: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/requests/new", title: "New Request", permissions: ["create"] },
    { path: "/requests", title: "Requests List", permissions: ["read", "edit"] },
    { path: "/claims", title: "Claims", permissions: ["create", "read"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  approver: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/approvals", title: "Approvals", permissions: ["approve"] },
    { path: "/requests", title: "Requests List", permissions: ["read"] },
    { path: "/penalties", title: "Penalties & Waivers", permissions: ["action", "read"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  coordinator: [
    { path: "/", title: "Dashboard", permissions: ["read", "action"] },
    { path: "/requests", title: "Requests List", permissions: ["read"] },
    { path: "/scheduling", title: "Scheduling Board", permissions: ["create", "edit"] },
    { path: "/trips", title: "Trip Sheets", permissions: ["edit"] },
    { path: "/gate-logs", title: "Gate Logs", permissions: ["read"] },
    { path: "/penalties", title: "Penalties & Waivers", permissions: ["action"] },
    { path: "/shipments", title: "Shipment Planner", permissions: ["action"] },
    { path: "/vendors", title: "Vendors", permissions: ["create", "edit"] },
    { path: "/vehicles", title: "Vehicles", permissions: ["create", "edit"] },
    { path: "/rates", title: "Rates", permissions: ["read", "edit"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  security: [
    { path: "/", title: "Dashboard", permissions: ["read", "action"] },
    { path: "/gate-logs", title: "Gate Logs", permissions: ["create", "edit"] },
    { path: "/trips", title: "Trip Sheets", permissions: ["read"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  driver: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/trips", title: "My Trips", permissions: ["edit"] },
    { path: "/gate-logs", title: "Gate Logs", permissions: ["read"] },
  ],
  
  finance: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/claims", title: "Claims", permissions: ["action"] },
    { path: "/penalties", title: "Penalties", permissions: ["read", "action"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  management: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/requests", title: "Requests", permissions: ["read"] },
    { path: "/trips", title: "Trips", permissions: ["read"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
  ],
  
  admin: [
    { path: "/", title: "Dashboard", permissions: ["read"] },
    { path: "/requests", title: "Requests", permissions: ["read"] },
    { path: "/approvals", title: "Approvals", permissions: ["read"] },
    { path: "/scheduling", title: "Scheduling", permissions: ["read"] },
    { path: "/trips", title: "Trips", permissions: ["read"] },
    { path: "/gate-logs", title: "Gate Logs", permissions: ["read"] },
    { path: "/penalties", title: "Penalties", permissions: ["read"] },
    { path: "/shipments", title: "Shipments", permissions: ["read"] },
    { path: "/vendors", title: "Vendors", permissions: ["create", "edit", "delete"] },
    { path: "/vehicles", title: "Vehicles", permissions: ["create", "edit", "delete"] },
    { path: "/rates", title: "Rates", permissions: ["create", "edit"] },
    { path: "/factories", title: "Factories & Yards", permissions: ["create", "edit"] },
    { path: "/claims", title: "Claims", permissions: ["read"] },
    { path: "/reports", title: "Reports", permissions: ["read"] },
    { path: "/settings", title: "Settings", permissions: ["create", "edit"] },
  ],
};

export function hasAccessToPage(role: UserRole, path: string): boolean {
  const permissions = rolePermissions[role];
  return permissions.some(p => {
    if (p.path === path) return true;
    if (path.startsWith(p.path + "/")) return true;
    return false;
  });
}

export function getAccessiblePages(role: UserRole): PagePermission[] {
  return rolePermissions[role] || [];
}
