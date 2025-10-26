import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Truck, DollarSign, AlertTriangle, FileText } from "lucide-react";
import { Link } from "wouter";

export default function ManagementDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentRequests } = useQuery({
    queryKey: ["/api/requests/recent"],
  });

  const { data: todayTrips } = useQuery({
    queryKey: ["/api/trips/today"],
  });

  const completedTrips = todayTrips?.filter((t: any) => t.status === "completed").length || 0;
  const totalTripsToday = todayTrips?.length || 0;
  const onTimePercentage = totalTripsToday > 0 ? Math.round((completedTrips / totalTripsToday) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Management Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Executive overview - KPIs and performance metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-on-time">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">On-Time %</p>
                <p className="text-2xl font-bold text-foreground">{onTimePercentage}%</p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-md">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-total-trips">
          <Link href="/trips">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.tripsToday || 0}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-estimated-cost">
          <Link href="/reports">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Est. Cost</p>
                  <p className="text-2xl font-bold text-foreground">${stats?.estimatedCost || 0}</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-md">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-penalties">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Penalties</p>
                <p className="text-2xl font-bold text-foreground">{stats?.atRiskTrips || 0}</p>
              </div>
              <div className="bg-red-50 text-red-600 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
            <CardDescription className="text-sm">Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">On-Time Delivery</p>
                  <p className="text-sm font-bold">{onTimePercentage}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${onTimePercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Completed Trips</p>
                  <p className="text-sm font-bold">{completedTrips} / {totalTripsToday}</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${onTimePercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">At-Risk Trips</p>
                  <p className="text-sm font-bold">{stats?.atRiskTrips || 0}</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${totalTripsToday > 0 ? ((stats?.atRiskTrips || 0) / totalTripsToday) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Request Activity</CardTitle>
              <CardDescription className="text-sm">Recent request overview</CardDescription>
            </div>
            <Link href="/requests">
              <Button variant="ghost" size="sm" data-testid="button-view-requests">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Worker Transport</p>
                    <p className="text-xs text-muted-foreground">Most common type</p>
                  </div>
                </div>
                <p className="text-sm font-bold">{recentRequests?.filter((r: any) => r.type === "worker").length || 0}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Shipment</p>
                    <p className="text-xs text-muted-foreground">Cargo transport</p>
                  </div>
                </div>
                <p className="text-sm font-bold">{recentRequests?.filter((r: any) => r.type === "shipment").length || 0}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">General</p>
                    <p className="text-xs text-muted-foreground">Ad-hoc trips</p>
                  </div>
                </div>
                <p className="text-sm font-bold">{recentRequests?.filter((r: any) => r.type === "general").length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          <CardDescription className="text-sm">Navigate to key reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/reports">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-reports">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </Link>
            <Link href="/requests">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-requests">
                <FileText className="h-4 w-4 mr-2" />
                All Requests
              </Button>
            </Link>
            <Link href="/trips">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-trips">
                <Truck className="h-4 w-4 mr-2" />
                Trip Overview
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-export">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
