import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function FinanceDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const activePenalties = stats?.atRiskTrips || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Finance Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Claims review and cost oversight
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-penalties">
          <Link href="/penalties">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Penalties</p>
                  <p className="text-2xl font-bold text-foreground">{activePenalties}</p>
                </div>
                <div className="bg-red-50 text-red-600 p-3 rounded-md">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-cost">
          <Link href="/reports">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Today's Cost</p>
                  <p className="text-2xl font-bold text-foreground">${stats?.estimatedCost || 0}</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-md">
                  <DollarSign className="h-5 w-5" />
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
              <CardTitle className="text-lg font-semibold">Claims to Review</CardTitle>
              <CardDescription className="text-sm">Awaiting verification and approval</CardDescription>
            </div>
            <Link href="/claims">
              <Button variant="ghost" size="sm" data-testid="button-view-claims">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No pending claims to review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Penalties</CardTitle>
              <CardDescription className="text-sm">Delay penalties to process</CardDescription>
            </div>
            <Link href="/penalties">
              <Button variant="ghost" size="sm" data-testid="button-view-penalties">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No recent penalties</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/claims">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-claims">
                <Receipt className="h-4 w-4 mr-2" />
                Review Claims
              </Button>
            </Link>
            <Link href="/penalties">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-penalties">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Process Penalties
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-reports">
                <TrendingUp className="h-4 w-4 mr-2" />
                Cost Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
