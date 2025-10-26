import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Building2, Truck } from "lucide-react";
import { CONTAINER_SUGGESTIONS } from "@/lib/constants";

export default function ShipmentPlanner() {
  const { data: shipmentRequests, isLoading } = useQuery({
    queryKey: ["/api/requests", { type: "shipment", status: "approved" }],
  });

  const { data: factories } = useQuery({
    queryKey: ["/api/factories"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading shipment planner...</p>
        </div>
      </div>
    );
  }

  // Group by yard
  const wattalaShipments = shipmentRequests?.filter((r: any) => r.yard === "wattala") || [];
  const katunayakeShipments = shipmentRequests?.filter((r: any) => r.yard === "katunayake") || [];

  function calculateTotalCBM(shipments: any[]) {
    return shipments.reduce((sum, s) => sum + Number(s.cbm || 0), 0);
  }

  function suggestContainer(totalCBM: number) {
    return CONTAINER_SUGGESTIONS.find(
      (c) => totalCBM >= c.minCBM && totalCBM < c.maxCBM
    ) || CONTAINER_SUGGESTIONS[CONTAINER_SUGGESTIONS.length - 1];
  }

  function renderYardSection(yard: string, shipments: any[]) {
    const totalCBM = calculateTotalCBM(shipments);
    const containerSuggestion = suggestContainer(totalCBM);

    // Group by factory
    const byFactory: Record<string, any[]> = {};
    shipments.forEach((s) => {
      const factoryName = factories?.find((f: any) => f.id === s.factoryId)?.name || "Unknown";
      if (!byFactory[factoryName]) {
        byFactory[factoryName] = [];
      }
      byFactory[factoryName].push(s);
    });

    return (
      <Card key={yard}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold capitalize flex items-center gap-2">
                <Package className="h-5 w-5" />
                {yard} Yard
              </CardTitle>
              <CardDescription className="text-sm">
                {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{totalCBM.toFixed(2)} CBM</p>
              <p className="text-sm text-muted-foreground">Total Volume</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Factory breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Factory Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(byFactory).map(([factoryName, factoryShipments]) => {
                const factoryCBM = calculateTotalCBM(factoryShipments);
                return (
                  <div
                    key={factoryName}
                    className="flex items-center justify-between p-3 rounded-md border border-border"
                    data-testid={`factory-${factoryName.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{factoryName}</p>
                        <p className="text-xs text-muted-foreground">
                          {factoryShipments.length} shipment{factoryShipments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{factoryCBM.toFixed(2)} CBM</p>
                      <p className="text-xs text-muted-foreground">
                        {((factoryCBM / totalCBM) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Container suggestion */}
          <div className="p-4 rounded-md bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">Container Suggestion</p>
                <p className="text-lg font-bold text-foreground">{containerSuggestion.size}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Capacity: {containerSuggestion.capacity}
                </p>
              </div>
            </div>
          </div>

          {/* Shipment list */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Shipment Details</h3>
            <div className="space-y-2">
              {shipments.map((shipment: any) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border text-sm"
                  data-testid={`shipment-${shipment.id}`}
                >
                  <div>
                    <p className="font-mono font-semibold">{shipment.requestNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {factories?.find((f: any) => f.id === shipment.factoryId)?.name || 'Unknown Factory'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{shipment.cbm} CBM</p>
                    <p className="text-xs text-muted-foreground">
                      Cutoff: {new Date(shipment.cutoffTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          Shipment Planner
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consolidate shipments and suggest container sizes
        </p>
      </div>

      {/* Yards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {wattalaShipments.length > 0 && renderYardSection("wattala", wattalaShipments)}
        {katunayakeShipments.length > 0 && renderYardSection("katunayake", katunayakeShipments)}
      </div>

      {/* Empty State */}
      {(!wattalaShipments.length && !katunayakeShipments.length) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No approved shipments to plan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
