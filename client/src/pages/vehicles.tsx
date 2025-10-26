import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Car, PlusCircle, Edit, Trash2 } from "lucide-react";
import { VEHICLE_TYPES } from "@/lib/constants";

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  type: z.string().min(1, "Vehicle type is required"),
  seats: z.coerce.number().min(1, "Seats must be at least 1"),
  hasAC: z.boolean(),
  isOwned: z.boolean(),
  vendorId: z.string().optional(),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

export default function Vehicles() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["/api/vehicles"],
  });

  const { data: vendors } = useQuery({
    queryKey: ["/api/vendors"],
  });

  const form = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      type: "",
      seats: 4,
      hasAC: false,
      isOwned: true,
      vendorId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleForm) => {
      return apiRequest(editingVehicle ? "PATCH" : "POST", 
        editingVehicle ? `/api/vehicles/${editingVehicle.id}` : "/api/vehicles", 
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: editingVehicle ? "Vehicle Updated" : "Vehicle Created",
        description: "Vehicle has been saved successfully",
      });
      setDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/vehicles/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Vehicle Deleted",
        description: "Vehicle has been removed",
      });
    },
  });

  function handleEdit(vehicle: any) {
    setEditingVehicle(vehicle);
    form.reset(vehicle);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingVehicle(null);
    form.reset();
    setDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Vehicles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage transport fleet and vehicles
          </p>
        </div>
        <Button onClick={handleNew} data-testid="button-add-vehicle">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles && vehicles.length > 0 ? (
          vehicles.map((vehicle: any) => (
            <Card key={vehicle.id} data-testid={`card-vehicle-${vehicle.id}`}>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {vehicle.plateNumber}
                </CardTitle>
                {vehicle.active ? (
                  <span className="text-xs text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">Inactive</span>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <p className="text-sm font-medium">{vehicle.seats}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  {vehicle.hasAC && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium">AC</span>
                  )}
                  {vehicle.isOwned ? (
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded font-medium">Owned</span>
                  ) : (
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded font-medium">Vendor</span>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(vehicle)}
                    data-testid={`button-edit-${vehicle.id}`}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(vehicle.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${vehicle.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No vehicles added yet</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-vehicle-form">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingVehicle ? "Update vehicle details" : "Add a new vehicle to the fleet"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} data-testid="input-plate" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VEHICLE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} data-testid="input-seats" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="hasAC"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-ac"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Air Conditioning</FormLabel>
                      <FormDescription>Vehicle has AC</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isOwned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-owned"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Company Owned</FormLabel>
                      <FormDescription>Owned by company (not vendor)</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("isOwned") && (
                <FormField
                  control={form.control}
                  name="vendorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-vendor">
                            <SelectValue placeholder="Select vendor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vendors?.filter((v: any) => v.active).map((vendor: any) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-save">
                  {createMutation.isPending ? "Saving..." : editingVehicle ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
