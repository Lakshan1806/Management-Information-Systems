import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/reports/stats"],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Reports & Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Operational insights and performance metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTrips || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.onTimeRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Target: 90%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Trips</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.delayedTrips || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalCost || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Trip Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Trips by Type</CardTitle>
            <CardDescription className="text-sm">Distribution of request types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Worker Transport</span>
              </div>
              <span className="text-sm font-bold">{stats?.workerTrips || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Shipment Pickups</span>
              </div>
              <span className="text-sm font-bold">{stats?.shipmentTrips || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">General Requests</span>
              </div>
              <span className="text-sm font-bold">{stats?.generalTrips || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
            <CardDescription className="text-sm">Key operational indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average Trip Duration</span>
                <span className="text-sm font-bold">{stats?.avgDuration || 0} min</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vehicle Utilization</span>
                <span className="text-sm font-bold">{stats?.vehicleUtilization || 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${stats?.vehicleUtilization || 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pooling Rate</span>
                <span className="text-sm font-bold">{stats?.poolingRate || 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${stats?.poolingRate || 0}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cost by Factory</CardTitle>
          <CardDescription className="text-sm">Transport expenses per location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.costByFactory?.map((item: any) => (
              <div key={item.factory} className="flex items-center justify-between p-3 rounded-md border border-border">
                <span className="text-sm font-medium">{item.factory}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">${item.cost}</p>
                  <p className="text-xs text-muted-foreground">{item.trips} trips</p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
