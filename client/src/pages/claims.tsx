import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Receipt, PlusCircle, Eye } from "lucide-react";
import { Link } from "wouter";

export default function Claims() {
  const { data: claims, isLoading } = useQuery({
    queryKey: ["/api/claims"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading claims...</p>
        </div>
      </div>
    );
  }

  const pendingClaims = claims?.filter((c: any) => c.status === "submitted") || [];
  const approvedClaims = claims?.filter((c: any) => c.status === "approved") || [];
  const reimbursedClaims = claims?.filter((c: any) => c.status === "reimbursed") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Claims
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fallback ride reimbursement claims
          </p>
        </div>
        <Button data-testid="button-new-claim">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-50 text-yellow-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingClaims.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{approvedClaims.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{reimbursedClaims.length}</p>
                <p className="text-sm text-muted-foreground">Reimbursed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Claims</CardTitle>
          <CardDescription className="text-sm">Ride reimbursement requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claims && claims.length > 0 ? (
              claims.map((claim: any) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-claim-${claim.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {claim.claimNumber}
                        </p>
                        <StatusBadge status={claim.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-semibold">${claim.amount}</span>
                        <span>•</span>
                        <span>{new Date(claim.tripDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{claim.reason}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" data-testid={`button-view-${claim.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No claims submitted</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
