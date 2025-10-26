import { useEffect } from "react";
import { useLocation } from "wouter";
import { useRole } from "@/contexts/role-context";
import { hasAccessToPage } from "@/lib/role-permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

export function ProtectedRoute({ children, path }: ProtectedRouteProps) {
  const { currentRole } = useRole();
  const [, setLocation] = useLocation();
  const hasAccess = hasAccessToPage(currentRole, path);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldX className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page with your current role.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setLocation("/")} data-testid="button-go-home">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
