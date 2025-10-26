import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { RoleProvider } from "@/contexts/role-context";
import { RoleSwitcher } from "@/components/role-switcher";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import NewRequest from "@/pages/requests/new";
import WorkerRequestForm from "@/pages/requests/worker-form";
import ShipmentRequestForm from "@/pages/requests/shipment-form";
import GeneralRequestForm from "@/pages/requests/general-form";
import RequestsList from "@/pages/requests/list";
import RequestDetail from "@/pages/requests/detail";
import Approvals from "@/pages/approvals";
import Scheduling from "@/pages/scheduling";
import Trips from "@/pages/trips";
import GateLogs from "@/pages/gate-logs";
import Penalties from "@/pages/penalties";
import ShipmentPlanner from "@/pages/shipments";
import Vendors from "@/pages/vendors";
import Vehicles from "@/pages/vehicles";
import Rates from "@/pages/rates";
import Factories from "@/pages/factories";
import Claims from "@/pages/claims";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";

function Router() {
  const [location] = useLocation();
  
  return (
    <Switch>
      <Route path="/">
        <ProtectedRoute path="/">
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/requests/new">
        <ProtectedRoute path="/requests/new">
          <NewRequest />
        </ProtectedRoute>
      </Route>
      
      <Route path="/requests/new/worker">
        <ProtectedRoute path="/requests/new">
          <WorkerRequestForm />
        </ProtectedRoute>
      </Route>
      
      <Route path="/requests/new/shipment">
        <ProtectedRoute path="/requests/new">
          <ShipmentRequestForm />
        </ProtectedRoute>
      </Route>
      
      <Route path="/requests/new/general">
        <ProtectedRoute path="/requests/new">
          <GeneralRequestForm />
        </ProtectedRoute>
      </Route>
      
      <Route path="/requests/:id">
        <ProtectedRoute path="/requests">
          <RequestDetail />
        </ProtectedRoute>
      </Route>
      
      <Route path="/requests">
        <ProtectedRoute path="/requests">
          <RequestsList />
        </ProtectedRoute>
      </Route>

      <Route path="/approvals">
        <ProtectedRoute path="/approvals">
          <Approvals />
        </ProtectedRoute>
      </Route>
      
      <Route path="/scheduling">
        <ProtectedRoute path="/scheduling">
          <Scheduling />
        </ProtectedRoute>
      </Route>

      <Route path="/trips">
        <ProtectedRoute path="/trips">
          <Trips />
        </ProtectedRoute>
      </Route>
      
      <Route path="/gate-logs">
        <ProtectedRoute path="/gate-logs">
          <GateLogs />
        </ProtectedRoute>
      </Route>
      
      <Route path="/penalties">
        <ProtectedRoute path="/penalties">
          <Penalties />
        </ProtectedRoute>
      </Route>
      
      <Route path="/shipments">
        <ProtectedRoute path="/shipments">
          <ShipmentPlanner />
        </ProtectedRoute>
      </Route>

      <Route path="/vendors">
        <ProtectedRoute path="/vendors">
          <Vendors />
        </ProtectedRoute>
      </Route>
      
      <Route path="/vehicles">
        <ProtectedRoute path="/vehicles">
          <Vehicles />
        </ProtectedRoute>
      </Route>
      
      <Route path="/rates">
        <ProtectedRoute path="/rates">
          <Rates />
        </ProtectedRoute>
      </Route>
      
      <Route path="/factories">
        <ProtectedRoute path="/factories">
          <Factories />
        </ProtectedRoute>
      </Route>

      <Route path="/claims">
        <ProtectedRoute path="/claims">
          <Claims />
        </ProtectedRoute>
      </Route>

      <Route path="/reports">
        <ProtectedRoute path="/reports">
          <Reports />
        </ProtectedRoute>
      </Route>

      <Route path="/settings">
        <ProtectedRoute path="/settings">
          <Settings />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RoleProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <RoleSwitcher />
                </header>
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto px-6 py-8">
                    <Router />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </RoleProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
