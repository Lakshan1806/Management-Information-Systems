import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Truck, Clock, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function DriverDashboard() {
  const { data: todayTrips } = useQuery({
    queryKey: ["/api/trips/today"],
  });

  const myTrips = todayTrips || [];
  const activeTrips = myTrips.filter((t: any) => t.status === "in_progress");
  const completedToday = myTrips.filter((t: any) => t.status === "completed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Driver Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your assigned trips and schedules
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-trips-today">
          <Link href="/trips">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">My Trips Today</p>
                  <p className="text-2xl font-bold text-foreground">{myTrips.length}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-active">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                <p className="text-2xl font-bold text-foreground">{activeTrips.length}</p>
              </div>
              <div className="bg-green-50 text-green-600 p-3 rounded-md">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-completed">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-foreground">{completedToday}</p>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">My Assigned Trips</CardTitle>
            <CardDescription className="text-sm">Today's trip schedule</CardDescription>
          </div>
          <Link href="/trips">
            <Button variant="ghost" size="sm" data-testid="button-view-all-trips">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myTrips.length > 0 ? (
              myTrips.map((trip: any) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 rounded-md border hover-elevate active-elevate-2"
                  data-testid={`card-trip-${trip.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{trip.tripNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.vehicle?.plateNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(trip.plannedStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(trip.plannedEndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No trips assigned today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Manage your trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/trips">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-trips">
                <Truck className="h-4 w-4 mr-2" />
                View My Trips
              </Button>
            </Link>
            <Link href="/gate-logs">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-gate-logs">
                <Clock className="h-4 w-4 mr-2" />
                Check Gate Times
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
