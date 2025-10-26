import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Clock, Truck, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function SecurityDashboard() {
  const { data: todayTrips } = useQuery({
    queryKey: ["/api/trips/today"],
  });

  const gateQueue = todayTrips?.filter((t: any) => t.status === "scheduled") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Security Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gate operations and entry/exit logging
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-gate-queue">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Gate Queue</p>
                <p className="text-2xl font-bold text-foreground">{gateQueue.length}</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-md">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-checked-in">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Checked In Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {todayTrips?.filter((t: any) => t.status === "in_progress" || t.status === "completed").length || 0}
                </p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-total-trips">
          <Link href="/trips">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Trips Today</p>
                  <p className="text-2xl font-bold text-foreground">{todayTrips?.length || 0}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Gate Queue</CardTitle>
              <CardDescription className="text-sm">Vehicles scheduled for today</CardDescription>
            </div>
            <Link href="/gate-logs">
              <Button variant="ghost" size="sm" data-testid="button-view-gate-logs">
                View All Logs
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gateQueue.length > 0 ? (
                gateQueue.slice(0, 5).map((trip: any) => (
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
                  <p className="text-sm text-muted-foreground">No vehicles in queue</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link href="/gate-logs">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-log-entry">
                  <Clock className="h-4 w-4 mr-2" />
                  Log Gate Entry/Exit
                </Button>
              </Link>
              <Link href="/trips">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-view-trips">
                  <Truck className="h-4 w-4 mr-2" />
                  View Trip Details
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Punctuality Report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
