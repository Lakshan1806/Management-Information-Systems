import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function Penalties() {
  const { toast } = useToast();
  const [selectedPenalty, setSelectedPenalty] = useState<any>(null);
  const [waiverDialogOpen, setWaiverDialogOpen] = useState(false);
  const [waiverReason, setWaiverReason] = useState("");

  const { data: penalties, isLoading } = useQuery({
    queryKey: ["/api/penalties"],
  });

  const { data: trips } = useQuery({
    queryKey: ["/api/trips"],
  });

  const confirmPenaltyMutation = useMutation({
    mutationFn: async (penaltyId: string) => {
      return apiRequest("POST", `/api/penalties/${penaltyId}/confirm`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      toast({
        title: "Penalty Confirmed",
        description: "Penalty has been confirmed successfully",
      });
    },
  });

  const waivePenaltyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/penalties/${selectedPenalty.id}/waive`, {
        waiverReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/penalties"] });
      toast({
        title: "Penalty Waived",
        description: "Penalty has been waived",
      });
      setWaiverDialogOpen(false);
      setSelectedPenalty(null);
      setWaiverReason("");
    },
  });

  function handleWaiveClick(penalty: any) {
    setSelectedPenalty(penalty);
    setWaiverDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading penalties...</p>
        </div>
      </div>
    );
  }

  const pendingPenalties = penalties?.filter((p: any) => p.status === "pending") || [];
  const confirmedPenalties = penalties?.filter((p: any) => p.status === "confirmed") || [];
  const waivedPenalties = penalties?.filter((p: any) => p.status === "waived") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Penalties & Waivers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage delay penalties
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-50 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingPenalties.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedPenalties.length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-50 text-gray-600">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{waivedPenalties.length}</p>
                <p className="text-sm text-muted-foreground">Waived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Penalties */}
      {pendingPenalties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Penalties</CardTitle>
            <CardDescription className="text-sm">Requires review and decision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPenalties.map((penalty: any) => {
                const trip = trips?.find((t: any) => t.id === penalty.tripId);
                return (
                  <div
                    key={penalty.id}
                    className="flex items-center justify-between p-4 rounded-md border border-border"
                    data-testid={`card-penalty-${penalty.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {trip?.tripNumber || 'Unknown Trip'}
                        </p>
                        <StatusBadge status={penalty.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="text-red-600 font-semibold">
                          Delay: {penalty.delayMinutes} minutes
                        </span>
                        <span>•</span>
                        <span className="font-semibold">
                          Penalty Amount: ${penalty.amount}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => confirmPenaltyMutation.mutate(penalty.id)}
                        disabled={confirmPenaltyMutation.isPending}
                        data-testid={`button-confirm-${penalty.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWaiveClick(penalty)}
                        data-testid={`button-waive-${penalty.id}`}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Waive
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmed Penalties */}
      {confirmedPenalties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Confirmed Penalties</CardTitle>
            <CardDescription className="text-sm">Applied penalties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {confirmedPenalties.map((penalty: any) => {
                const trip = trips?.find((t: any) => t.id === penalty.tripId);
                return (
                  <div
                    key={penalty.id}
                    className="flex items-center justify-between p-4 rounded-md border border-border"
                    data-testid={`card-penalty-confirmed-${penalty.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {trip?.tripNumber || 'Unknown Trip'}
                        </p>
                        <StatusBadge status={penalty.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Delay: {penalty.delayMinutes} minutes</span>
                        <span>•</span>
                        <span className="font-semibold">Amount: ${penalty.amount}</span>
                        <span>•</span>
                        <span>Confirmed {new Date(penalty.confirmedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waived Penalties */}
      {waivedPenalties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Waived Penalties</CardTitle>
            <CardDescription className="text-sm">Penalties that were waived</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {waivedPenalties.map((penalty: any) => {
                const trip = trips?.find((t: any) => t.id === penalty.tripId);
                return (
                  <div
                    key={penalty.id}
                    className="flex items-center justify-between p-4 rounded-md border border-border"
                    data-testid={`card-penalty-waived-${penalty.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {trip?.tripNumber || 'Unknown Trip'}
                        </p>
                        <StatusBadge status={penalty.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Delay: {penalty.delayMinutes} minutes</span>
                        <span>•</span>
                        <span>Amount: ${penalty.amount}</span>
                        <span>•</span>
                        <span>Waived {new Date(penalty.waivedAt).toLocaleDateString()}</span>
                      </div>
                      {penalty.waiverReason && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reason: {penalty.waiverReason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {penalties?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No penalties recorded</p>
          </CardContent>
        </Card>
      )}

      {/* Waiver Dialog */}
      <Dialog open={waiverDialogOpen} onOpenChange={setWaiverDialogOpen}>
        <DialogContent data-testid="dialog-waive-penalty">
          <DialogHeader>
            <DialogTitle>Waive Penalty</DialogTitle>
            <DialogDescription>
              Provide a reason for waiving this penalty
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="waiver-reason">Waiver Reason *</Label>
              <Textarea
                id="waiver-reason"
                placeholder="Explain why this penalty should be waived"
                value={waiverReason}
                onChange={(e) => setWaiverReason(e.target.value)}
                rows={4}
                data-testid="input-waiver-reason"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWaiverDialogOpen(false)}
              data-testid="button-cancel-waiver"
            >
              Cancel
            </Button>
            <Button
              onClick={() => waivePenaltyMutation.mutate()}
              disabled={!waiverReason.trim() || waivePenaltyMutation.isPending}
              data-testid="button-confirm-waiver"
            >
              {waivePenaltyMutation.isPending ? "Waiving..." : "Waive Penalty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
