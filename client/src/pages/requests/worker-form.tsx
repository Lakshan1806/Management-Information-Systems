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
import { WORKER_ROUTES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

const workerRequestSchema = z.object({
  factoryId: z.string().min(1, "Factory is required"),
  requestedDate: z.string().min(1, "Date is required"),
  route: z.string().min(1, "Route is required"),
  passengerCount: z.coerce.number().min(1, "Passenger count must be at least 1"),
  notes: z.string().optional(),
});

type WorkerRequestForm = z.infer<typeof workerRequestSchema>;

export default function WorkerRequestForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: factories } = useQuery({
    queryKey: ["/api/factories"],
  });

  const form = useForm<WorkerRequestForm>({
    resolver: zodResolver(workerRequestSchema),
    defaultValues: {
      factoryId: "",
      requestedDate: new Date().toISOString().split('T')[0],
      route: "",
      passengerCount: 1,
      notes: "",
    },
  });

  const createRequest = useMutation({
    mutationFn: async (data: WorkerRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "worker",
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Created",
        description: "Worker transport request has been created successfully",
      });
      setLocation("/requests");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitRequest = useMutation({
    mutationFn: async (data: WorkerRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "worker",
        status: "submitted",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Submitted",
        description: "Worker transport request has been submitted for approval",
      });
      setLocation("/requests");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSaveDraft(data: WorkerRequestForm) {
    createRequest.mutate(data);
  }

  function onSubmit(data: WorkerRequestForm) {
    submitRequest.mutate(data);
  }

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
            Worker Transport Request
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a request for worker transportation
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
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-route">
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WORKER_ROUTES.map((route) => (
                            <SelectItem key={route} value={route}>
                              {route}
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
                  name="passengerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passenger Count *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          data-testid="input-passengers"
                        />
                      </FormControl>
                      <FormDescription>Number of workers</FormDescription>
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
                  onClick={form.handleSubmit(onSaveDraft)}
                  disabled={createRequest.isPending}
                  data-testid="button-save-draft"
                >
                  {createRequest.isPending ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
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
