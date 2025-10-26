import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar, Truck, Users, Package, MapPin } from "lucide-react";

export default function Scheduling() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [plannedStartTime, setPlannedStartTime] = useState("");
  const [plannedEndTime, setPlannedEndTime] = useState("");

  const { data: approvedRequests, isLoading } = useQuery({
    queryKey: ["/api/requests", { status: "approved" }],
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/users", { role: "coordinator" }],
  });

  const assignTripMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/trips", {
        requestIds: [selectedRequest.id],
        vehicleId,
        driverId,
        plannedStartTime,
        plannedEndTime,
        status: "scheduled",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "Trip Scheduled",
        description: "Vehicle and driver assigned successfully",
      });
      setAssignDialogOpen(false);
      setSelectedRequest(null);
    },
  });

  function handleAssignClick(request: any) {
    setSelectedRequest(request);
    setAssignDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading scheduling board...</p>
        </div>
      </div>
    );
  }

  const workerRequests = approvedRequests?.filter((r: any) => r.type === "worker") || [];
  const shipmentRequests = approvedRequests?.filter((r: any) => r.type === "shipment") || [];
  const generalRequests = approvedRequests?.filter((r: any) => r.type === "general") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Scheduling Board
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Assign vehicles and drivers to approved requests
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{workerRequests.length}</p>
                <p className="text-sm text-muted-foreground">Worker Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{shipmentRequests.length}</p>
                <p className="text-sm text-muted-foreground">Shipment Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{generalRequests.length}</p>
                <p className="text-sm text-muted-foreground">General Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Worker Requests */}
      {workerRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Worker Transport Requests
            </CardTitle>
            <CardDescription className="text-sm">Approved worker transportation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workerRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-schedule-${request.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-semibold text-foreground font-mono">
                        {request.requestNumber}
                      </p>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.route}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {request.passengerCount} passengers
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAssignClick(request)}
                    data-testid={`button-assign-${request.id}`}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Assign Vehicle
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipment Requests */}
      {shipmentRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipment Pickup Requests
            </CardTitle>
            <CardDescription className="text-sm">Approved shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shipmentRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-schedule-${request.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-semibold text-foreground font-mono">
                        {request.requestNumber}
                      </p>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.yard} Yard
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {request.cbm} CBM
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAssignClick(request)}
                    data-testid={`button-assign-${request.id}`}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Assign Vehicle
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Requests */}
      {generalRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              General Transport Requests
            </CardTitle>
            <CardDescription className="text-sm">Approved ad-hoc trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generalRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border"
                  data-testid={`card-schedule-${request.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-semibold text-foreground font-mono">
                        {request.requestNumber}
                      </p>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.pickupLocation} → {request.dropLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {request.passengerCount} passengers
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAssignClick(request)}
                    data-testid={`button-assign-${request.id}`}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Assign Vehicle
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {approvedRequests?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No approved requests to schedule</p>
          </CardContent>
        </Card>
      )}

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent data-testid="dialog-assign-vehicle">
          <DialogHeader>
            <DialogTitle>Assign Vehicle & Driver</DialogTitle>
            <DialogDescription>
              Schedule trip for {selectedRequest?.requestNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle *</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="vehicle" data-testid="select-vehicle">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.filter((v: any) => v.active).map((vehicle: any) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} - {vehicle.type} ({vehicle.seats} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Driver (Optional)</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger id="driver" data-testid="select-driver">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No driver assigned</SelectItem>
                  {drivers?.map((driver: any) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-time">Planned Start Time *</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={plannedStartTime}
                  onChange={(e) => setPlannedStartTime(e.target.value)}
                  data-testid="input-start-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Planned End Time *</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={plannedEndTime}
                  onChange={(e) => setPlannedEndTime(e.target.value)}
                  data-testid="input-end-time"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              data-testid="button-cancel-assign"
            >
              Cancel
            </Button>
            <Button
              onClick={() => assignTripMutation.mutate()}
              disabled={!vehicleId || !plannedStartTime || !plannedEndTime || assignTripMutation.isPending}
              data-testid="button-confirm-assign"
            >
              {assignTripMutation.isPending ? "Assigning..." : "Assign & Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
