import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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
import { DEPARTMENTS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

const generalRequestSchema = z.object({
  requestedDate: z.string().min(1, "Date is required"),
  timeWindowStart: z.string().min(1, "Start time is required"),
  timeWindowEnd: z.string().min(1, "End time is required"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropLocation: z.string().min(1, "Drop location is required"),
  passengerCount: z.coerce.number().min(1, "Passenger count must be at least 1"),
  purpose: z.string().min(1, "Purpose is required"),
  department: z.string().min(1, "Department is required"),
  notes: z.string().optional(),
}).refine((data) => data.pickupLocation !== data.dropLocation, {
  message: "Pickup and drop locations must be different",
  path: ["dropLocation"],
});

type GeneralRequestForm = z.infer<typeof generalRequestSchema>;

export default function GeneralRequestForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<GeneralRequestForm>({
    resolver: zodResolver(generalRequestSchema),
    defaultValues: {
      requestedDate: new Date().toISOString().split('T')[0],
      timeWindowStart: "",
      timeWindowEnd: "",
      pickupLocation: "",
      dropLocation: "",
      passengerCount: 1,
      purpose: "",
      department: "",
      notes: "",
    },
  });

  const createRequest = useMutation({
    mutationFn: async (data: GeneralRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "general",
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Created",
        description: "General request has been created successfully",
      });
      setLocation("/requests");
    },
  });

  const submitRequest = useMutation({
    mutationFn: async (data: GeneralRequestForm) => {
      return apiRequest("POST", "/api/requests", {
        ...data,
        type: "general",
        status: "submitted",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request Submitted",
        description: "General request has been submitted for approval",
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
            General Transport Request
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create an ad-hoc transport request
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeWindowStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-time-start" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeWindowEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} data-testid="input-time-end" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter pickup address"
                          {...field}
                          data-testid="input-pickup"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter drop address"
                          {...field}
                          data-testid="input-drop"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Client visit, Site inspection"
                          {...field}
                          data-testid="input-purpose"
                        />
                      </FormControl>
                      <FormDescription>Reason for transport</FormDescription>
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
