import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { CheckSquare, Eye, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Approvals() {
  const { data: pendingApprovals, isLoading } = useQuery({
    queryKey: ["/api/approvals/pending"],
  });

  const { data: factories } = useQuery({
    queryKey: ["/api/factories"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Approvals Inbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve pending requests
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-50 text-yellow-600">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground" data-testid="text-pending-count">
                {pendingApprovals?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pending Requests</CardTitle>
          <CardDescription className="text-sm">Items requiring your approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingApprovals && pendingApprovals.length > 0 ? (
              pendingApprovals.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border hover-elevate active-elevate-2"
                  data-testid={`card-approval-${request.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {request.requestNumber}
                        </p>
                        <StatusBadge status={request.status} />
                        <span className="text-xs font-medium uppercase text-muted-foreground px-2 py-1 bg-muted rounded">
                          {request.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {factories?.find((f: any) => f.id === request.factoryId)?.name || 'Unknown Factory'}
                        </span>
                        <span>•</span>
                        <span>{new Date(request.requestedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-yellow-600 font-medium">
                          Submitted {Math.floor((Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60))}h ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/requests/${request.id}`}>
                    <Button variant="default" size="sm" data-testid={`button-review-${request.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No pending approvals</p>
                <p className="text-xs text-muted-foreground mt-1">All requests have been reviewed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
