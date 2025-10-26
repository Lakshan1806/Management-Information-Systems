import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Package,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function RequestDetail() {
  const [, params] = useRoute("/requests/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [comment, setComment] = useState("");

  const { data: request, isLoading } = useQuery({
    queryKey: ["/api/requests", params?.id],
  });

  const { data: activityLog } = useQuery({
    queryKey: ["/api/activity-logs", params?.id],
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/requests/${params?.id}/approve`, { comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Approved",
        description: "The request has been approved successfully",
      });
      setLocation("/approvals");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) {
        throw new Error("Comment is required for rejection");
      }
      return apiRequest("POST", `/api/requests/${params?.id}/reject`, { comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Rejected",
        description: "The request has been rejected",
      });
      setLocation("/approvals");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading request...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Request not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/requests")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-foreground font-mono" data-testid="text-request-number">
              {request.requestNumber}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {request.type} Request • Created {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Requested Date</p>
                <p className="text-sm font-medium">
                  {new Date(request.requestedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {request.type === "worker" && (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Route</p>
                    <p className="text-sm font-medium">{request.route}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Passengers</p>
                    <p className="text-sm font-medium">{request.passengerCount}</p>
                  </div>
                </div>
              </>
            )}

            {request.type === "shipment" && (
              <>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">CBM</p>
                    <p className="text-sm font-medium">{request.cbm}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Yard</p>
                    <p className="text-sm font-medium capitalize">{request.yard}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cutoff Time</p>
                    <p className="text-sm font-medium">
                      {new Date(request.cutoffTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </>
            )}

            {request.type === "general" && (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                    <p className="text-sm font-medium">{request.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Drop</p>
                    <p className="text-sm font-medium">{request.dropLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Passengers</p>
                    <p className="text-sm font-medium">{request.passengerCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Purpose</p>
                    <p className="text-sm font-medium">{request.purpose}</p>
                  </div>
                </div>
              </>
            )}

            {request.notes && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-foreground">{request.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
            <CardDescription className="text-sm">Request history and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog && activityLog.length > 0 ? (
                activityLog.map((log: any) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Actions */}
      {request.status === "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Approval Actions</CardTitle>
            <CardDescription className="text-sm">Review and approve or reject this request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Add your comments (required for rejection)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                data-testid="input-approval-comment"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                data-testid="button-approve"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending}
                data-testid="button-reject"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
