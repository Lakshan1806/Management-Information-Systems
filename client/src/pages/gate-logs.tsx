import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Clock, AlertCircle } from "lucide-react";

export default function GateLogs() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: gateLogs, isLoading } = useQuery({
    queryKey: ["/api/gate-logs"],
  });

  const { data: trips } = useQuery({
    queryKey: ["/api/trips", { status: "scheduled,in_progress" }],
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const logGateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/gate-logs", {
        tripId: selectedTrip.id,
        vehicleId: selectedTrip.vehicleId,
        plannedTime: selectedTrip.plannedStartTime,
        inTime,
        outTime,
        remarks,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gate-logs"] });
      toast({
        title: "Gate Log Recorded",
        description: "Entry has been logged successfully",
      });
      setDialogOpen(false);
      setSelectedTrip(null);
      setInTime("");
      setOutTime("");
      setRemarks("");
    },
  });

  function handleLogGate(trip: any) {
    setSelectedTrip(trip);
    setInTime(new Date().toISOString().slice(0, 16));
    setOutTime("");
    setRemarks("");
    setDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading gate logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Gate Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Record vehicle entry and exit times
        </p>
      </div>

      {/* Active Trips */}
      {trips && trips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Trips</CardTitle>
            <CardDescription className="text-sm">Trips requiring gate logging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trips.map((trip: any) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-trip-${trip.id}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground font-mono mb-2">
                      {trip.tripNumber}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {vehicles?.find((v: any) => v.id === trip.vehicleId)?.plateNumber || 'Unknown Vehicle'}
                      </span>
                      <span>•</span>
                      <span>
                        Planned: {new Date(trip.plannedStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleLogGate(trip)}
                    data-testid={`button-log-${trip.id}`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Log Gate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Gate Logs</CardTitle>
          <CardDescription className="text-sm">Latest gate entries and exits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gateLogs && gateLogs.length > 0 ? (
              gateLogs.slice(0, 20).map((log: any) => {
                const trip = trips?.find((t: any) => t.id === log.tripId);
                const vehicle = vehicles?.find((v: any) => v.id === log.vehicleId);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 rounded-md border border-border"
                    data-testid={`card-log-${log.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {trip?.tripNumber || 'Unknown Trip'}
                        </p>
                        {log.isDelayed && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 px-2 py-1 bg-red-50 rounded">
                            <AlertCircle className="h-3 w-3" />
                            Delayed {log.delayMinutes} min
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p className="text-xs text-muted-foreground">Vehicle</p>
                          <p className="text-sm font-medium">{vehicle?.plateNumber || 'Unknown'}</p>
                        </div>
                        {log.inTime && (
                          <div>
                            <p className="text-xs text-muted-foreground">IN Time</p>
                            <p className="text-sm font-medium">
                              {new Date(log.inTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        {log.outTime && (
                          <div>
                            <p className="text-xs text-muted-foreground">OUT Time</p>
                            <p className="text-sm font-medium">
                              {new Date(log.outTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        {log.remarks && (
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Remarks</p>
                            <p className="text-sm">{log.remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No gate logs recorded</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gate Log Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-gate-log">
          <DialogHeader>
            <DialogTitle>Log Gate Entry/Exit</DialogTitle>
            <DialogDescription>
              {selectedTrip?.tripNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="in-time">IN Time *</Label>
              <Input
                id="in-time"
                type="datetime-local"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                data-testid="input-in-time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="out-time">OUT Time</Label>
              <Input
                id="out-time"
                type="datetime-local"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                data-testid="input-out-time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Any notes about delays or issues"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                data-testid="input-remarks"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-testid="button-cancel-log"
            >
              Cancel
            </Button>
            <Button
              onClick={() => logGateMutation.mutate()}
              disabled={!inTime || logGateMutation.isPending}
              data-testid="button-save-log"
            >
              {logGateMutation.isPending ? "Saving..." : "Save Log"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
