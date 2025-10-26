import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { FileText, PlusCircle, Receipt, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function RequesterDashboard() {
  const { data: recentRequests } = useQuery({
    queryKey: ["/api/requests/recent"],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Requester Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your transport requests
          </p>
        </div>
        <Link href="/requests/new">
          <Button size="default" data-testid="button-new-request">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate cursor-pointer" data-testid="metric-my-requests">
          <Link href="/requests">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">My Requests</p>
                  <p className="text-2xl font-bold text-foreground">{recentRequests?.length || 0}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-pending">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">
                  {recentRequests?.filter((r: any) => r.status === "submitted").length || 0}
                </p>
              </div>
              <div className="bg-yellow-50 text-yellow-600 p-3 rounded-md">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate cursor-pointer" data-testid="metric-claims">
          <Link href="/claims">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">My Claims</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-md">
                  <Receipt className="h-5 w-5" />
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
              <CardTitle className="text-lg font-semibold">My Recent Requests</CardTitle>
              <CardDescription className="text-sm">Your latest transport requests</CardDescription>
            </div>
            <Link href="/requests">
              <Button variant="ghost" size="sm" data-testid="button-view-all-requests">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests && recentRequests.length > 0 ? (
                recentRequests.slice(0, 5).map((request: any) => (
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
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No requests yet</p>
                  <Link href="/requests/new">
                    <Button variant="outline" className="mt-4" size="sm">
                      Create First Request
                    </Button>
                  </Link>
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
              <Link href="/requests/new">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-new-request">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Request
                </Button>
              </Link>
              <Link href="/requests">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-my-requests">
                  <FileText className="h-4 w-4 mr-2" />
                  View My Requests
                </Button>
              </Link>
              <Link href="/claims">
                <Button variant="outline" className="w-full justify-start" size="default" data-testid="button-quick-claims">
                  <Receipt className="h-4 w-4 mr-2" />
                  Submit Claim
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
