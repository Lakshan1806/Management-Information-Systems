import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
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
import { Truck, Play, Square, FileText } from "lucide-react";

export default function Trips() {
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);
  const [startOdometer, setStartOdometer] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [passengersBoarded, setPassengersBoarded] = useState("");
  const [incidents, setIncidents] = useState("");

  const { data: trips, isLoading } = useQuery({
    queryKey: ["/api/trips"],
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const startTripMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/trips/${selectedTrip.id}/start`, {
        startOdometer: Number(startOdometer),
        actualStartTime: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "Trip Started",
        description: "Trip has been marked as in progress",
      });
      setExecutionDialogOpen(false);
      setSelectedTrip(null);
    },
  });

  const endTripMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/trips/${selectedTrip.id}/end`, {
        endOdometer: Number(endOdometer),
        passengersBoarded: Number(passengersBoarded),
        incidents,
        actualEndTime: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "Trip Completed",
        description: "Trip has been marked as completed",
      });
      setExecutionDialogOpen(false);
      setSelectedTrip(null);
    },
  });

  function handleStartTrip(trip: any) {
    setSelectedTrip(trip);
    setStartOdometer("");
    setExecutionDialogOpen(true);
  }

  function handleEndTrip(trip: any) {
    setSelectedTrip(trip);
    setEndOdometer("");
    setPassengersBoarded("");
    setIncidents("");
    setExecutionDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Trip Sheets
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Execute and track scheduled trips
        </p>
      </div>

      {/* Trips List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Trips</CardTitle>
          <CardDescription className="text-sm">Scheduled and active trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trips && trips.length > 0 ? (
              trips.map((trip: any) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-trip-${trip.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {trip.tripNumber}
                        </p>
                        <StatusBadge status={trip.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {vehicles?.find((v: any) => v.id === trip.vehicleId)?.plateNumber || 'Unknown Vehicle'}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(trip.plannedStartTime).toLocaleDateString()} at{' '}
                          {new Date(trip.plannedStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {trip.startOdometer && (
                          <>
                            <span>•</span>
                            <span>Start: {trip.startOdometer} km</span>
                          </>
                        )}
                        {trip.endOdometer && (
                          <>
                            <span>•</span>
                            <span>End: {trip.endOdometer} km</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {trip.status === "scheduled" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleStartTrip(trip)}
                        data-testid={`button-start-${trip.id}`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Trip
                      </Button>
                    )}
                    {trip.status === "in_progress" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndTrip(trip)}
                        data-testid={`button-end-${trip.id}`}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        End Trip
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No trips scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execution Dialog */}
      <Dialog open={executionDialogOpen} onOpenChange={setExecutionDialogOpen}>
        <DialogContent data-testid="dialog-trip-execution">
          <DialogHeader>
            <DialogTitle>
              {selectedTrip?.status === "scheduled" ? "Start Trip" : "End Trip"}
            </DialogTitle>
            <DialogDescription>
              {selectedTrip?.tripNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedTrip?.status === "scheduled" ? (
              <div className="space-y-2">
                <Label htmlFor="start-odometer">Start Odometer Reading (km) *</Label>
                <Input
                  id="start-odometer"
                  type="number"
                  placeholder="Enter odometer reading"
                  value={startOdometer}
                  onChange={(e) => setStartOdometer(e.target.value)}
                  data-testid="input-start-odometer"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="end-odometer">End Odometer Reading (km) *</Label>
                  <Input
                    id="end-odometer"
                    type="number"
                    placeholder="Enter odometer reading"
                    value={endOdometer}
                    onChange={(e) => setEndOdometer(e.target.value)}
                    data-testid="input-end-odometer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers Boarded *</Label>
                  <Input
                    id="passengers"
                    type="number"
                    placeholder="Number of passengers"
                    value={passengersBoarded}
                    onChange={(e) => setPassengersBoarded(e.target.value)}
                    data-testid="input-passengers-boarded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incidents">Incidents / Notes</Label>
                  <Textarea
                    id="incidents"
                    placeholder="Any incidents or special notes"
                    value={incidents}
                    onChange={(e) => setIncidents(e.target.value)}
                    rows={3}
                    data-testid="input-incidents"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExecutionDialogOpen(false)}
              data-testid="button-cancel-execution"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedTrip?.status === "scheduled"
                  ? startTripMutation.mutate()
                  : endTripMutation.mutate()
              }
              disabled={
                (selectedTrip?.status === "scheduled" && !startOdometer) ||
                (selectedTrip?.status === "in_progress" && (!endOdometer || !passengersBoarded)) ||
                startTripMutation.isPending ||
                endTripMutation.isPending
              }
              data-testid="button-confirm-execution"
            >
              {startTripMutation.isPending || endTripMutation.isPending
                ? "Processing..."
                : selectedTrip?.status === "scheduled"
                  ? "Start Trip"
                  : "End Trip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
