import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { CheckSquare, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function ApproverDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentRequests } = useQuery({
    queryKey: ["/api/requests/recent"],
  });

  const pendingApprovals = recentRequests?.filter((r: any) => r.status === "submitted") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Approver Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve transport requests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-pending-approvals">
          <Link href="/approvals">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.pendingApprovals || 0}</p>
                </div>
                <div className="bg-yellow-50 text-yellow-600 p-3 rounded-md">
                  <CheckSquare className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-total-requests">
          <Link href="/requests">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{recentRequests?.length || 0}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-penalties">
          <Link href="/penalties">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Penalty Waivers</p>
                  <p className="text-2xl font-bold text-foreground">2</p>
                </div>
                <div className="bg-red-50 text-red-600 p-3 rounded-md">
                  <AlertTriangle className="h-5 w-5" />
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
              <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
              <CardDescription className="text-sm">Requests awaiting your approval</CardDescription>
            </div>
            <Link href="/approvals">
              <Button variant="ghost" size="sm" data-testid="button-view-all-approvals">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.slice(0, 5).map((request: any) => (
                  <Link key={request.id} href={`/requests/${request.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-md hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-request-${request.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <CheckSquare className="h-5 w-5 text-muted-foreground" />
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
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No pending approvals</p>
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
              <Link href="/approvals">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-approvals">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Review Approvals
                </Button>
              </Link>
              <Link href="/requests">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-requests">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Requests
                </Button>
              </Link>
              <Link href="/penalties">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-penalties">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Penalty Waivers
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
