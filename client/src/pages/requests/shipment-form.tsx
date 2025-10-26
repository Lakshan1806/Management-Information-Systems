import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";

const shipmentRequestSchema = z.object({
  factoryId: z.string().min(1, "Factory is required"),
  requestedDate: z.string().min(1, "Date is required"),
  yard: z.enum(["wattala", "katunayake"], {
    required_error: "Yard is required",
  }),
  cbm: z.coerce.number().min(0.1, "CBM must be greater than 0"),
  cutoffTime: z.string().min(1, "Cutoff time is required"),
  notes: z.string().optional(),
});

type ShipmentRequestForm = z.infer<typeof shipmentRequestSchema>;

export default function ShipmentRequestForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: factories } = useQuery({
    queryKey: ["/api/factories"],
  });

  const form = useForm<ShipmentRequestForm>({
    resolver: zodResolver(shipmentRequestSchema),
    defaultValues: {
      factoryId: "",
      requestedDate: new Date().toISOString().split('T')[0],
      yard: "wattala",
      cbm: 0,
      cutoffTime: "",
      notes: "",
    },
  });

  const createRequest = useMutation({
    mutationFn: async (data: ShipmentRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "shipment",
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Created",
        description: "Shipment request has been created successfully",
      });
      setLocation("/requests");
    },
  });

  const submitRequest = useMutation({
    mutationFn: async (data: ShipmentRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "shipment",
        status: "submitted",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Submitted",
        description: "Shipment request has been submitted for approval",
      });
      setLocation("/requests");
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/requests/new")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Shipment Pickup Request
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a request for shipment transportation
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="factoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Factory *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-factory">
                            <SelectValue placeholder="Select factory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {factories?.map((factory: any) => (
                            <SelectItem key={factory.id} value={factory.id}>
                              {factory.name}
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
                  name="requestedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Yard *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-yard">
                            <SelectValue placeholder="Select yard" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wattala">Wattala</SelectItem>
                          <SelectItem value="katunayake">Katunayake</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cbm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CBM (Cubic Meters) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          {...field}
                          data-testid="input-cbm"
                        />
                      </FormControl>
                      <FormDescription>Total cargo volume</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cutoffTime"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Latest Cutoff Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-cutoff-time" />
                      </FormControl>
                      <FormDescription>
                        Latest time for pickup to meet shipping deadline
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional information or special requirements"
                        className="resize-none"
                        rows={4}
                        {...field}
                        data-testid="input-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit((data) => createRequest.mutate(data))}
                  disabled={createRequest.isPending}
                  data-testid="button-save-draft"
                >
                  {createRequest.isPending ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit((data) => submitRequest.mutate(data))}
                  disabled={submitRequest.isPending}
                  data-testid="button-submit"
                >
                  {submitRequest.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
