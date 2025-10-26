import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings as SettingsIcon } from "lucide-react";

const settingsSchema = z.object({
  graceMinutes: z.coerce.number().min(0, "Must be at least 0"),
  penaltyAmount: z.coerce.number().min(0, "Must be at least 0"),
  poolingWindowMinutes: z.coerce.number().min(0, "Must be at least 0"),
  workingHoursStart: z.string().min(1, "Required"),
  workingHoursEnd: z.string().min(1, "Required"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    values: settings || {
      graceMinutes: 15,
      penaltyAmount: 100,
      poolingWindowMinutes: 30,
      workingHoursStart: "08:00",
      workingHoursEnd: "18:00",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      return apiRequest("PATCH", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure system parameters and business rules
        </p>
      </div>

      {/* Penalty Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Penalty Configuration
          </CardTitle>
          <CardDescription className="text-sm">
            Delay penalty rules and grace periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="graceMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace Period (Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          data-testid="input-grace-minutes"
                        />
                      </FormControl>
                      <FormDescription>
                        Time allowed before penalty applies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penaltyAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penalty Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          data-testid="input-penalty-amount"
                        />
                      </FormControl>
                      <FormDescription>
                        Flat penalty for delays
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-semibold mb-4">Pooling Configuration</h3>
                <FormField
                  control={form.control}
                  name="poolingWindowMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pooling Time Window (Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          data-testid="input-pooling-window"
                        />
                      </FormControl>
                      <FormDescription>
                        Requests within this window can be pooled together
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-semibold mb-4">Working Hours</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="workingHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            data-testid="input-working-start"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workingHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            data-testid="input-working-end"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Role Management Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Roles</CardTitle>
          <CardDescription className="text-sm">
            System roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-sm font-medium">Requester</p>
                <p className="text-xs text-muted-foreground">Can create and view requests</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-sm font-medium">Approver</p>
                <p className="text-xs text-muted-foreground">Can approve or reject requests</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-sm font-medium">Coordinator</p>
                <p className="text-xs text-muted-foreground">Can schedule and manage trips</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-sm font-medium">Security</p>
                <p className="text-xs text-muted-foreground">Can log gate entries and exits</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">Full system access</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
