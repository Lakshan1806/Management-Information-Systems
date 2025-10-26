import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function NewRequest() {
  const [, setLocation] = useLocation();

  const requestTypes = [
    {
      type: "worker",
      title: "Worker Transport",
      description: "Fixed routes for employee transportation",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/requests/new/worker",
    },
    {
      type: "shipment",
      title: "Shipment Pickup",
      description: "Factory to yard container transport",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/requests/new/shipment",
    },
    {
      type: "general",
      title: "General Request",
      description: "Ad-hoc trips for visitors and staff",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/requests/new/general",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
          New Request
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select the type of transport request
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {requestTypes.map((item) => (
          <Card
            key={item.type}
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation(item.href)}
            data-testid={`card-request-type-${item.type}`}
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className={`${item.bgColor} ${item.color} p-4 rounded-lg inline-flex`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </div>
                <Button variant="outline" className="w-full" data-testid={`button-select-${item.type}`}>
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
