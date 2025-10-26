import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/dashboard/stats", async (_req, res) => {
    const requests = await storage.getRequests();
    const trips = await storage.getTrips();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingApprovals = requests.filter(
      (r) => r.status === "submitted"
    ).length;
    const tripsToday = trips.filter((t) => {
      const tripDate = new Date(t.plannedStartTime);
      tripDate.setHours(0, 0, 0, 0);
      return tripDate.getTime() === today.getTime();
    }).length;
    const atRiskTrips = trips.filter(
      (t) => t.status === "scheduled" || t.status === "in_progress"
    ).length;
    const estimatedCost = 5420;

    res.json({ pendingApprovals, tripsToday, atRiskTrips, estimatedCost });
  });

  app.get("/api/requests/recent", async (_req, res) => {
    const requests = await storage.getRequests();
    const factories = await storage.getFactories();

    const recent = requests.slice(0, 5).map((request) => ({
      ...request,
      factory: factories.find((f) => f.id === request.factoryId),
    }));

    res.json(recent);
  });

  app.get("/api/trips/today", async (_req, res) => {
    const trips = await storage.getTrips();
    const vehicles = await storage.getVehicles();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTrips = trips
      .filter((t) => {
        const tripDate = new Date(t.plannedStartTime);
        tripDate.setHours(0, 0, 0, 0);
        return tripDate.getTime() === today.getTime();
      })
      .map((trip) => ({
        ...trip,
        vehicle: vehicles.find((v) => v.id === trip.vehicleId),
      }));

    res.json(todayTrips);
  });

  app.get("/api/factories", async (_req, res) => {
    const factories = await storage.getFactories();
    res.json(factories);
  });

  app.post("/api/factories", async (req, res) => {
    const factory = await storage.createFactory(req.body);
    res.json(factory);
  });

  app.patch("/api/factories/:id", async (req, res) => {
    const factory = await storage.updateFactory(req.params.id, req.body);
    res.json(factory);
  });

  app.delete("/api/factories/:id", async (req, res) => {
    await storage.deleteFactory(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/vendors", async (_req, res) => {
    const vendors = await storage.getVendors();
    res.json(vendors);
  });

  app.post("/api/vendors", async (req, res) => {
    const vendor = await storage.createVendor(req.body);
    res.json(vendor);
  });

  app.patch("/api/vendors/:id", async (req, res) => {
    const vendor = await storage.updateVendor(req.params.id, req.body);
    res.json(vendor);
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    await storage.deleteVendor(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/vehicles", async (_req, res) => {
    const vehicles = await storage.getVehicles();
    res.json(vehicles);
  });

  app.post("/api/vehicles", async (req, res) => {
    const vehicle = await storage.createVehicle(req.body);
    res.json(vehicle);
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    const vehicle = await storage.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    await storage.deleteVehicle(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/rates", async (_req, res) => {
    const rates = await storage.getRates();
    res.json(rates);
  });

  app.post("/api/rates", async (req, res) => {
    const rate = await storage.createRate(req.body);
    res.json(rate);
  });

  app.get("/api/requests", async (req, res) => {
    const { type, status } = req.query;
    const requests = await storage.getRequests({
      type: type as string,
      status: status as string,
    });
    res.json(requests);
  });

  app.get("/api/requests/:id", async (req, res) => {
    const request = await storage.getRequest(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json(request);
  });

  app.post("/api/requests", async (req, res) => {
    const request = await storage.createRequest(req.body);

    await storage.createActivityLog({
      entityType: "request",
      entityId: request.id,
      action: `Request ${request.status === "draft" ? "created" : "submitted"}`,
      userId: request.requesterId,
      details: `Request ${request.requestNumber} created`,
    });

    res.json(request);
  });

  app.post("/api/requests/:id/approve", async (req, res) => {
    const { comment } = req.body;
    const request = await storage.approveRequest(
      req.params.id,
      "user-approver",
      comment
    );

    await storage.createActivityLog({
      entityType: "request",
      entityId: request.id,
      action: "Request approved",
      userId: "user-approver",
      details: comment || "Request approved",
    });

    res.json(request);
  });

  app.post("/api/requests/:id/reject", async (req, res) => {
    const { comment } = req.body;
    const request = await storage.rejectRequest(
      req.params.id,
      "user-approver",
      comment
    );

    await storage.createActivityLog({
      entityType: "request",
      entityId: request.id,
      action: "Request rejected",
      userId: "user-approver",
      details: comment,
    });

    res.json(request);
  });

  app.get("/api/approvals/pending", async (_req, res) => {
    const requests = await storage.getRequests({ status: "submitted" });
    res.json(requests);
  });

  app.get("/api/trips", async (req, res) => {
    const { status } = req.query;
    const trips = await storage.getTrips({ status: status as string });
    res.json(trips);
  });

  app.get("/api/trips/:id", async (req, res) => {
    const trip = await storage.getTrip(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(trip);
  });

  app.post("/api/trips", async (req, res) => {
    const trip = await storage.createTrip(req.body);

    await storage.createActivityLog({
      entityType: "trip",
      entityId: trip.id,
      action: "Trip scheduled",
      userId: "user-coordinator",
      details: `Trip ${trip.tripNumber} created`,
    });

    res.json(trip);
  });

  app.post("/api/trips/:id/start", async (req, res) => {
    const { startOdometer, actualStartTime } = req.body;
    const trip = await storage.updateTrip(req.params.id, {
      status: "in_progress",
      startOdometer,
      actualStartTime,
    });

    await storage.createActivityLog({
      entityType: "trip",
      entityId: trip.id,
      action: "Trip started",
      userId: "user-driver",
      details: `Odometer: ${startOdometer} km`,
    });

    res.json(trip);
  });

  app.post("/api/trips/:id/end", async (req, res) => {
    const { endOdometer, passengersBoarded, incidents, actualEndTime } =
      req.body;
    const trip = await storage.updateTrip(req.params.id, {
      status: "completed",
      endOdometer,
      passengersBoarded,
      incidents,
      actualEndTime,
    });

    await storage.createActivityLog({
      entityType: "trip",
      entityId: trip.id,
      action: "Trip completed",
      userId: "user-driver",
      details: `Odometer: ${endOdometer} km, Passengers: ${passengersBoarded}`,
    });

    res.json(trip);
  });

  app.get("/api/gate-logs", async (_req, res) => {
    const gateLogs = await storage.getGateLogs();
    res.json(gateLogs);
  });

  app.post("/api/gate-logs", async (req, res) => {
    const gateLog = await storage.createGateLog(req.body);

    await storage.createActivityLog({
      entityType: "gate_log",
      entityId: gateLog.id,
      action: "Gate entry logged",
      userId: "user-security",
      details: gateLog.isDelayed
        ? `Delayed by ${gateLog.delayMinutes} minutes`
        : "On time",
    });

    res.json(gateLog);
  });

  app.get("/api/penalties", async (_req, res) => {
    const penalties = await storage.getPenalties();
    res.json(penalties);
  });

  app.post("/api/penalties/:id/confirm", async (req, res) => {
    const penalty = await storage.confirmPenalty(req.params.id, "user-admin");

    await storage.createActivityLog({
      entityType: "penalty",
      entityId: penalty.id,
      action: "Penalty confirmed",
      userId: "user-admin",
      details: `Amount: $${penalty.amount}`,
    });

    res.json(penalty);
  });

  app.post("/api/penalties/:id/waive", async (req, res) => {
    const { waiverReason } = req.body;
    const penalty = await storage.waivePenalty(
      req.params.id,
      "user-admin",
      waiverReason
    );

    await storage.createActivityLog({
      entityType: "penalty",
      entityId: penalty.id,
      action: "Penalty waived",
      userId: "user-admin",
      details: waiverReason,
    });

    res.json(penalty);
  });

  app.get("/api/claims", async (_req, res) => {
    const claims = await storage.getClaims();
    res.json(claims);
  });

  app.post("/api/claims", async (req, res) => {
    const claim = await storage.createClaim(req.body);

    await storage.createActivityLog({
      entityType: "claim",
      entityId: claim.id,
      action: "Claim created",
      userId: claim.employeeId,
      details: `Amount: $${claim.amount}`,
    });

    res.json(claim);
  });

  app.patch("/api/claims/:id", async (req, res) => {
    const claim = await storage.updateClaim(req.params.id, req.body);
    res.json(claim);
  });

  app.get("/api/reports/stats", async (_req, res) => {
    const trips = await storage.getTrips();
    const requests = await storage.getRequests();

    const totalTrips = trips.length;
    const completedTrips = trips.filter((t) => t.status === "completed").length;
    const delayedTrips = 3;
    const onTimeRate =
      completedTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0;
    const totalCost = 45678;

    const workerTrips = requests.filter((r) => r.type === "worker").length;
    const shipmentTrips = requests.filter((r) => r.type === "shipment").length;
    const generalTrips = requests.filter((r) => r.type === "general").length;

    const avgDuration = 85;
    const vehicleUtilization = 72;
    const poolingRate = 15;

    const costByFactory = [
      { factory: "Cargo Factory 1", cost: 12500, trips: 15 },
      { factory: "Cargo Factory 2", cost: 9800, trips: 12 },
      { factory: "Cargo Factory 3", cost: 8300, trips: 10 },
      { factory: "Cargo Factory 4", cost: 7650, trips: 8 },
      { factory: "Cargo Factory 5", cost: 7428, trips: 7 },
    ];

    res.json({
      totalTrips,
      onTimeRate,
      delayedTrips,
      totalCost,
      workerTrips,
      shipmentTrips,
      generalTrips,
      avgDuration,
      vehicleUtilization,
      poolingRate,
      costByFactory,
    });
  });

  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.patch("/api/settings", async (req, res) => {
    const settings = await storage.updateSettings(req.body);

    await storage.createActivityLog({
      entityType: "settings",
      entityId: settings.id,
      action: "Settings updated",
      userId: "user-admin",
      details: "System settings updated",
    });

    res.json(settings);
  });

  app.get("/api/activity-logs/:entityId", async (req, res) => {
    const logs = await storage.getActivityLogs(req.params.entityId);
    res.json(logs);
  });

  app.get("/api/users", async (req, res) => {
    const { role } = req.query;
    let users = await storage.getUsers();

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    res.json(users);
  });

  const httpServer = createServer(app);
  return httpServer;
}
