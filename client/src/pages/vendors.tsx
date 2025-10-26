import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, PlusCircle, Edit, Trash2 } from "lucide-react";

const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  bankDetails: z.string().optional(),
});

type VendorForm = z.infer<typeof vendorSchema>;

export default function Vendors() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["/api/vendors"],
  });

  const form = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      bankDetails: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VendorForm) => {
      return apiRequest(editingVendor ? "PATCH" : "POST", 
        editingVendor ? `/api/vendors/${editingVendor.id}` : "/api/vendors", 
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({
        title: editingVendor ? "Vendor Updated" : "Vendor Created",
        description: "Vendor has been saved successfully",
      });
      setDialogOpen(false);
      setEditingVendor(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/vendors/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({
        title: "Vendor Deleted",
        description: "Vendor has been removed",
      });
    },
  });

  function handleEdit(vendor: any) {
    setEditingVendor(vendor);
    form.reset(vendor);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingVendor(null);
    form.reset();
    setDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading vendors...</p>
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
            Vendors
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage transport vendors and service providers
          </p>
        </div>
        <Button onClick={handleNew} data-testid="button-add-vendor">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Vendors List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors && vendors.length > 0 ? (
          vendors.map((vendor: any) => (
            <Card key={vendor.id} data-testid={`card-vendor-${vendor.id}`}>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {vendor.name}
                </CardTitle>
                {vendor.active ? (
                  <span className="text-xs text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">Inactive</span>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="text-sm font-medium">{vendor.contact}</p>
                </div>
                {vendor.email && (
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{vendor.email}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(vendor)}
                    data-testid={`button-edit-${vendor.id}`}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(vendor.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${vendor.id}`}
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
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No vendors added yet</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-vendor-form">
          <DialogHeader>
            <DialogTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
            <DialogDescription>
              {editingVendor ? "Update vendor details" : "Create a new transport vendor"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Vendor name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} data-testid="input-contact" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="vendor@example.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Account information"
                        {...field}
                        rows={3}
                        data-testid="input-bank-details"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {createMutation.isPending ? "Saving..." : editingVendor ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
