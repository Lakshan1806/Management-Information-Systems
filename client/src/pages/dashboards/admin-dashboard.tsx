import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Car,
  Building2,
  Settings,
  FileText,
  Truck,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: allRequests } = useQuery({
    queryKey: ["/api/requests"],
  });

  const { data: vendors } = useQuery({
    queryKey: ["/api/vendors"],
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const totalRequests = allRequests?.length || 0;
  const activeVendors = vendors?.length || 0;
  const fleetSize = vehicles?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Administrator Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          System-wide management and configuration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-requests">
          <Link href="/requests">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-trips">
          <Link href="/trips">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.tripsToday || 0}</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-md">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-vendors">
          <Link href="/vendors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
                  <p className="text-2xl font-bold text-foreground">{activeVendors}</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-md">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-vehicles">
          <Link href="/vehicles">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Fleet Size</p>
                  <p className="text-2xl font-bold text-foreground">{fleetSize}</p>
                </div>
                <div className="bg-orange-50 text-orange-600 p-3 rounded-md">
                  <Car className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Master Data</CardTitle>
            <CardDescription className="text-sm">Manage core system data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/vendors">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-manage-vendors">
                  <Users className="h-4 w-4 mr-2" />
                  Vendors
                </Button>
              </Link>
              <Link href="/vehicles">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-manage-vehicles">
                  <Car className="h-4 w-4 mr-2" />
                  Vehicles
                </Button>
              </Link>
              <Link href="/factories">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-manage-factories">
                  <Building2 className="h-4 w-4 mr-2" />
                  Factories & Yards
                </Button>
              </Link>
              <Link href="/rates">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-manage-rates">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Rate Management
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Operations Overview</CardTitle>
            <CardDescription className="text-sm">Monitor all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/requests">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-requests">
                  <FileText className="h-4 w-4 mr-2" />
                  All Requests
                </Button>
              </Link>
              <Link href="/trips">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-trips">
                  <Truck className="h-4 w-4 mr-2" />
                  Trip Management
                </Button>
              </Link>
              <Link href="/gate-logs">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-gate-logs">
                  <FileText className="h-4 w-4 mr-2" />
                  Gate Logs
                </Button>
              </Link>
              <Link href="/penalties">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-penalties">
                  <FileText className="h-4 w-4 mr-2" />
                  Penalties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">System Configuration</CardTitle>
            <CardDescription className="text-sm">Settings and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-system-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics & Reports
                </Button>
              </Link>
              <Link href="/claims">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-view-claims">
                  <FileText className="h-4 w-4 mr-2" />
                  Claims Overview
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-system-health">
                <TrendingUp className="h-4 w-4 mr-2" />
                System Health
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
