import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building2, PlusCircle, Edit, Trash2 } from "lucide-react";

const factorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

type FactoryForm = z.infer<typeof factorySchema>;

export default function Factories() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<any>(null);

  const { data: factories, isLoading } = useQuery({
    queryKey: ["/api/factories"],
  });

  const form = useForm<FactoryForm>({
    resolver: zodResolver(factorySchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FactoryForm) => {
      return apiRequest(editingFactory ? "PATCH" : "POST", 
        editingFactory ? `/api/factories/${editingFactory.id}` : "/api/factories", 
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      toast({
        title: editingFactory ? "Factory Updated" : "Factory Created",
        description: "Factory has been saved successfully",
      });
      setDialogOpen(false);
      setEditingFactory(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/factories/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factories"] });
      toast({
        title: "Factory Deleted",
        description: "Factory has been removed",
      });
    },
  });

  function handleEdit(factory: any) {
    setEditingFactory(factory);
    form.reset(factory);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingFactory(null);
    form.reset();
    setDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading factories...</p>
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
            Factories & Yards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage factory locations and destination yards
          </p>
        </div>
        <Button onClick={handleNew} data-testid="button-add-factory">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Factory
        </Button>
      </div>

      {/* Yards Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Destination Yards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Wattala Yard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Main shipment yard - Wattala</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Katunayake Yard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Secondary shipment yard - Katunayake</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Factories Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Factories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {factories && factories.length > 0 ? (
            factories.map((factory: any) => (
              <Card key={factory.id} data-testid={`card-factory-${factory.id}`}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {factory.name}
                  </CardTitle>
                  {factory.active ? (
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Inactive</span>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{factory.address}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(factory)}
                      data-testid={`button-edit-${factory.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(factory.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${factory.id}`}
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
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No factories added yet</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-factory-form">
          <DialogHeader>
            <DialogTitle>{editingFactory ? "Edit Factory" : "Add New Factory"}</DialogTitle>
            <DialogDescription>
              {editingFactory ? "Update factory details" : "Add a new factory location"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factory Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cargo Factory 1" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full address"
                        {...field}
                        rows={3}
                        data-testid="input-address"
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
                  {createMutation.isPending ? "Saving..." : editingFactory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
