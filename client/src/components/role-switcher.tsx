import { useRole } from "@/contexts/role-context";
import { UserRole } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCircle2 } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  requester: "Requester",
  approver: "Approver",
  coordinator: "PIC/Coordinator",
  security: "Security",
  driver: "Driver",
  finance: "Finance Reviewer",
  management: "Management",
  admin: "Administrator",
};

const roleColors: Record<UserRole, string> = {
  requester: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  approver: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  coordinator: "bg-green-500/10 text-green-600 border-green-500/20",
  security: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  driver: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  finance: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  management: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  admin: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, currentUser } = useRole();

  return (
    <div className="flex items-center gap-3" data-testid="role-switcher">
      <div className="flex items-center gap-2">
        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium" data-testid="text-current-user">
            {currentUser.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentUser.email}
          </span>
        </div>
      </div>
      
      <Select
        value={currentRole}
        onValueChange={(value) => setCurrentRole(value as UserRole)}
      >
        <SelectTrigger className="w-[180px]" data-testid="select-role">
          <SelectValue>
            <Badge className={roleColors[currentRole]}>
              {roleLabels[currentRole]}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(roleLabels).map(([role, label]) => (
            <SelectItem key={role} value={role} data-testid={`option-role-${role}`}>
              <div className="flex items-center gap-2">
                <Badge className={roleColors[role as UserRole]}>
                  {label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
