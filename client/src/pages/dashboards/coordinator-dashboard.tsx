import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText,
  Truck,
  AlertTriangle,
  Calendar,
  Clock,
  Package,
  CheckSquare,
} from "lucide-react";
import { Link } from "wouter";

export default function CoordinatorDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentRequests } = useQuery({
    queryKey: ["/api/requests/recent"],
  });

  const { data: todayTrips } = useQuery({
    queryKey: ["/api/trips/today"],
  });

  const metrics = [
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: CheckSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "/requests",
      testId: "metric-pending-approvals",
    },
    {
      title: "Trips Today",
      value: stats?.tripsToday || 0,
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/trips",
      testId: "metric-trips-today",
    },
    {
      title: "At-Risk Trips",
      value: stats?.atRiskTrips || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/penalties",
      testId: "metric-at-risk",
    },
    {
      title: "To Schedule",
      value: recentRequests?.filter((r: any) => r.status === "approved").length || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/scheduling",
      testId: "metric-to-schedule",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Coordinator Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full operations view - manage scheduling and trips
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.title} href={metric.href}>
            <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={metric.testId}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <div className={`${metric.bgColor} ${metric.color} p-3 rounded-md`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Approved Requests</CardTitle>
              <CardDescription className="text-sm">Ready for scheduling</CardDescription>
            </div>
            <Link href="/scheduling">
              <Button variant="ghost" size="sm" data-testid="button-view-scheduling">
                Schedule
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests?.filter((r: any) => r.status === "approved").slice(0, 5).map((request: any) => (
                <Link key={request.id} href={`/requests/${request.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-md hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-request-${request.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{request.requestNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.type} • {request.factory?.name}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </Link>
              )) || (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">All requests scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Today's Trips</CardTitle>
              <CardDescription className="text-sm">Active and scheduled trips</CardDescription>
            </div>
            <Link href="/trips">
              <Button variant="ghost" size="sm" data-testid="button-view-trips">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTrips && todayTrips.length > 0 ? (
                todayTrips.slice(0, 5).map((trip: any) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-3 rounded-md hover-elevate active-elevate-2"
                    data-testid={`card-trip-${trip.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{trip.tripNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {trip.vehicle?.plateNumber} • {new Date(trip.plannedStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={trip.status} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No trips today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Common operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/scheduling">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-scheduling">
                <Calendar className="h-4 w-4 mr-2" />
                Scheduling Board
              </Button>
            </Link>
            <Link href="/trips">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-trips">
                <Truck className="h-4 w-4 mr-2" />
                Manage Trips
              </Button>
            </Link>
            <Link href="/shipments">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-shipments">
                <Package className="h-4 w-4 mr-2" />
                Shipment Planner
              </Button>
            </Link>
            <Link href="/gate-logs">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-gate-logs">
                <Clock className="h-4 w-4 mr-2" />
                Gate Logs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
