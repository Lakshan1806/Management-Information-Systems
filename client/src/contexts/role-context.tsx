import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserRole } from "@shared/schema";

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const mockUsers: Record<UserRole, { id: string; name: string; email: string }> = {
  requester: {
    id: "user-req-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
  },
  approver: {
    id: "user-app-1",
    name: "Michael Chen",
    email: "michael.chen@company.com",
  },
  coordinator: {
    id: "user-coord-1",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
  },
  security: {
    id: "user-sec-1",
    name: "David Kim",
    email: "david.kim@company.com",
  },
  driver: {
    id: "user-drv-1",
    name: "James Wilson",
    email: "james.wilson@company.com",
  },
  finance: {
    id: "user-fin-1",
    name: "Emily Taylor",
    email: "emily.taylor@company.com",
  },
  management: {
    id: "user-mgmt-1",
    name: "Robert Anderson",
    email: "robert.anderson@company.com",
  },
  admin: {
    id: "user-admin-1",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@company.com",
  },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("mockRole");
    return (saved as UserRole) || "requester";
  });

  useEffect(() => {
    localStorage.setItem("mockRole", currentRole);
  }, [currentRole]);

  const currentUser = mockUsers[currentRole];

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, currentUser }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
