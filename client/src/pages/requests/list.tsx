import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { PlusCircle, Search, Eye, Edit, X } from "lucide-react";
import { Link } from "wouter";
import { REQUEST_TYPES, REQUEST_STATUSES } from "@/lib/constants";

export default function RequestsList() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/requests", { type: typeFilter, status: statusFilter, search: searchQuery }],
  });

  const { data: factories } = useQuery({
    queryKey: ["/api/factories"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">
            All Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage transport requests
          </p>
        </div>
        <Link href="/requests/new">
          <Button size="default" data-testid="button-new-request">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by request number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger data-testid="select-type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={REQUEST_TYPES.WORKER}>Worker</SelectItem>
                <SelectItem value={REQUEST_TYPES.SHIPMENT}>Shipment</SelectItem>
                <SelectItem value={REQUEST_TYPES.GENERAL}>General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={REQUEST_STATUSES.DRAFT}>Draft</SelectItem>
                <SelectItem value={REQUEST_STATUSES.SUBMITTED}>Submitted</SelectItem>
                <SelectItem value={REQUEST_STATUSES.APPROVED}>Approved</SelectItem>
                <SelectItem value={REQUEST_STATUSES.SCHEDULED}>Scheduled</SelectItem>
                <SelectItem value={REQUEST_STATUSES.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {requests?.length || 0} Request{requests?.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests && requests.length > 0 ? (
              requests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border hover-elevate active-elevate-2"
                  data-testid={`card-request-${request.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-foreground font-mono">
                          {request.requestNumber}
                        </p>
                        <StatusBadge status={request.status} />
                        <span className="text-xs font-medium uppercase text-muted-foreground px-2 py-1 bg-muted rounded">
                          {request.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{factories?.find((f: any) => f.id === request.factoryId)?.name || 'Unknown Factory'}</span>
                        <span>•</span>
                        <span>{new Date(request.requestedDate).toLocaleDateString()}</span>
                        {request.passengerCount && (
                          <>
                            <span>•</span>
                            <span>{request.passengerCount} passengers</span>
                          </>
                        )}
                        {request.cbm && (
                          <>
                            <span>•</span>
                            <span>{request.cbm} CBM</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/requests/${request.id}`}>
                      <Button variant="ghost" size="icon" data-testid={`button-view-${request.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {request.status === "draft" && (
                      <Button variant="ghost" size="icon" data-testid={`button-edit-${request.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {request.status !== "scheduled" && request.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-cancel-${request.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
