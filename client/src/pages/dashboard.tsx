import { useRole } from "@/contexts/role-context";
import RequesterDashboard from "./dashboards/requester-dashboard";
import ApproverDashboard from "./dashboards/approver-dashboard";
import CoordinatorDashboard from "./dashboards/coordinator-dashboard";
import SecurityDashboard from "./dashboards/security-dashboard";
import DriverDashboard from "./dashboards/driver-dashboard";
import FinanceDashboard from "./dashboards/finance-dashboard";
import ManagementDashboard from "./dashboards/management-dashboard";
import AdminDashboard from "./dashboards/admin-dashboard";

export default function Dashboard() {
  const { currentRole } = useRole();

  switch (currentRole) {
    case "requester":
      return <RequesterDashboard />;
    case "approver":
      return <ApproverDashboard />;
    case "coordinator":
      return <CoordinatorDashboard />;
    case "security":
      return <SecurityDashboard />;
    case "driver":
      return <DriverDashboard />;
    case "finance":
      return <FinanceDashboard />;
    case "management":
      return <ManagementDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <RequesterDashboard />;
  }
}
