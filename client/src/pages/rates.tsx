import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, PlusCircle } from "lucide-react";

export default function Rates() {
  const { data: rates, isLoading } = useQuery({
    queryKey: ["/api/rates"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading rates...</p>
        </div>
      </div>
    );
  }

  const fixedRates = rates?.filter((r: any) => r.mode === "fixed") || [];
  const perKmRates = rates?.filter((r: any) => r.mode === "per_km") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            Rates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage transport pricing and rates
          </p>
        </div>
        <Button data-testid="button-add-rate">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Rate
        </Button>
      </div>

      {/* Fixed Rates */}
      {fixedRates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Fixed Monthly Rates</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fixedRates.map((rate: any) => (
              <Card key={rate.id} data-testid={`card-rate-${rate.id}`}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {rate.routeName || "Fixed Rate"}
                  </CardTitle>
                  {rate.isCurrent && (
                    <span className="text-xs text-green-600 font-medium">Current</span>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-foreground">${rate.baseRate}</p>
                    <p className="text-xs text-muted-foreground">Per Month</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Effective From</p>
                    <p className="text-sm font-medium">
                      {new Date(rate.effectiveFrom).toLocaleDateString()}
                    </p>
                  </div>
                  {rate.notes && (
                    <p className="text-xs text-muted-foreground">{rate.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Per-KM Rates */}
      {perKmRates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Per-Kilometer Rates</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {perKmRates.map((rate: any) => (
              <Card key={rate.id} data-testid={`card-rate-${rate.id}`}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Per-KM Rate
                  </CardTitle>
                  {rate.isCurrent && (
                    <span className="text-xs text-green-600 font-medium">Current</span>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-foreground">${rate.baseRate}</p>
                    <p className="text-xs text-muted-foreground">Per Kilometer</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Effective From</p>
                    <p className="text-sm font-medium">
                      {new Date(rate.effectiveFrom).toLocaleDateString()}
                    </p>
                  </div>
                  {rate.notes && (
                    <p className="text-xs text-muted-foreground">{rate.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {rates?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No rates configured</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
