import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Factory,
  InsertFactory,
  Vendor,
  InsertVendor,
  Vehicle,
  InsertVehicle,
  Rate,
  InsertRate,
  Request,
  InsertRequest,
  Trip,
  InsertTrip,
  GateLog,
  InsertGateLog,
  Penalty,
  InsertPenalty,
  Claim,
  InsertClaim,
  Settings,
  InsertSettings,
  ActivityLog,
  InsertActivityLog,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Factories
  getFactories(): Promise<Factory[]>;
  getFactory(id: string): Promise<Factory | undefined>;
  createFactory(factory: InsertFactory): Promise<Factory>;
  updateFactory(id: string, factory: Partial<InsertFactory>): Promise<Factory>;
  deleteFactory(id: string): Promise<void>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;

  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<void>;

  // Rates
  getRates(): Promise<Rate[]>;
  getRate(id: string): Promise<Rate | undefined>;
  createRate(rate: InsertRate): Promise<Rate>;

  // Requests
  getRequests(filters?: { type?: string; status?: string }): Promise<Request[]>;
  getRequest(id: string): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: string, request: Partial<InsertRequest>): Promise<Request>;
  approveRequest(
    id: string,
    approverId: string,
    comment?: string
  ): Promise<Request>;
  rejectRequest(
    id: string,
    approverId: string,
    comment: string
  ): Promise<Request>;

  // Trips
  getTrips(filters?: { status?: string }): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip>;

  // Gate Logs
  getGateLogs(): Promise<GateLog[]>;
  getGateLog(id: string): Promise<GateLog | undefined>;
  createGateLog(log: InsertGateLog): Promise<GateLog>;

  // Penalties
  getPenalties(): Promise<Penalty[]>;
  getPenalty(id: string): Promise<Penalty | undefined>;
  createPenalty(penalty: InsertPenalty): Promise<Penalty>;
  confirmPenalty(id: string, confirmedBy: string): Promise<Penalty>;
  waivePenalty(
    id: string,
    waivedBy: string,
    waiverReason: string
  ): Promise<Penalty>;

  // Claims
  getClaims(): Promise<Claim[]>;
  getClaim(id: string): Promise<Claim | undefined>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, claim: Partial<InsertClaim>): Promise<Claim>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  // Activity Logs
  getActivityLogs(entityId: string): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private factories: Map<string, Factory>;
  private vendors: Map<string, Vendor>;
  private vehicles: Map<string, Vehicle>;
  private rates: Map<string, Rate>;
  private requests: Map<string, Request>;
  private trips: Map<string, Trip>;
  private gateLogs: Map<string, GateLog>;
  private penalties: Map<string, Penalty>;
  private claims: Map<string, Claim>;
  private settings: Settings;
  private activityLogs: Map<string, ActivityLog>;

  constructor() {
    this.users = new Map();
    this.factories = new Map();
    this.vendors = new Map();
    this.vehicles = new Map();
    this.rates = new Map();
    this.requests = new Map();
    this.trips = new Map();
    this.gateLogs = new Map();
    this.penalties = new Map();
    this.claims = new Map();
    this.activityLogs = new Map();
    this.settings = {
      id: "settings-1",
      graceMinutes: 15,
      penaltyAmount: "100.00",
      poolingWindowMinutes: 30,
      workingHoursStart: "08:00",
      workingHoursEnd: "18:00",
      updatedAt: new Date(),
    };
    this.seedMockData();
  }

  private seedMockData() {
    // Create factories
    const factoryIds = [
      this.createFactorySync({
        name: "Cargo Factory 1",
        address: "Colombo Industrial Estate, Block A",
        active: true,
      }),
      this.createFactorySync({
        name: "Cargo Factory 2",
        address: "Katunayake Export Zone, Section 5",
        active: true,
      }),
      this.createFactorySync({
        name: "Cargo Factory 3",
        address: "Wattala Manufacturing Park, Unit 12",
        active: true,
      }),
      this.createFactorySync({
        name: "Cargo Factory 4",
        address: "Horana Industrial Area, Plot 8",
        active: true,
      }),
      this.createFactorySync({
        name: "Cargo Factory 5",
        address: "Biyagama Free Trade Zone, Building 3",
        active: true,
      }),
    ];

    // Create vendors
    const vendorIds = [
      this.createVendorSync({
        name: "Express Transport Ltd",
        contact: "+94 77 123 4567",
        email: "express@transport.lk",
        bankDetails: "Bank of Ceylon - 123456789",
        active: true,
      }),
      this.createVendorSync({
        name: "Swift Logistics",
        contact: "+94 71 234 5678",
        email: "info@swiftlogistics.lk",
        bankDetails: "Commercial Bank - 987654321",
        active: true,
      }),
      this.createVendorSync({
        name: "Cargo Movers Pvt Ltd",
        contact: "+94 75 345 6789",
        email: "cargo@movers.lk",
        bankDetails: "Hatton National Bank - 456789123",
        active: true,
      }),
    ];

    // Create vehicles
    const vehicleIds = [
      this.createVehicleSync({
        plateNumber: "WP CAA-1234",
        type: "Van",
        seats: 12,
        hasAC: true,
        isOwned: true,
        active: true,
      }),
      this.createVehicleSync({
        plateNumber: "WP KV-5678",
        type: "Bus",
        seats: 45,
        hasAC: true,
        isOwned: true,
        active: true,
      }),
      this.createVehicleSync({
        plateNumber: "WP ABC-9012",
        type: "Car",
        seats: 4,
        hasAC: true,
        isOwned: true,
        active: true,
      }),
      this.createVehicleSync({
        plateNumber: "CP XYZ-3456",
        type: "Truck",
        seats: 2,
        hasAC: false,
        isOwned: false,
        vendorId: vendorIds[0],
        active: true,
      }),
      this.createVehicleSync({
        plateNumber: "SP DEF-7890",
        type: "Mini Bus",
        seats: 20,
        hasAC: true,
        isOwned: false,
        vendorId: vendorIds[1],
        active: true,
      }),
      this.createVehicleSync({
        plateNumber: "WP GHI-2468",
        type: "Lorry",
        seats: 2,
        hasAC: false,
        isOwned: false,
        vendorId: vendorIds[2],
        active: true,
      }),
    ];

    // Create rates
    this.createRateSync({
      mode: "fixed",
      baseRate: "25000.00",
      routeName: "Factory 1 → Worker Area A",
      effectiveFrom: new Date("2025-01-01"),
      effectiveTo: null,
      notes: "Monthly worker transport",
      isCurrent: true,
    });
    this.createRateSync({
      mode: "per_km",
      baseRate: "85.00",
      routeName: null,
      effectiveFrom: new Date("2025-01-01"),
      effectiveTo: null,
      notes: "General transport per kilometer",
      isCurrent: true,
    });

    // Create requests
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const req1 = this.createRequestSync({
      requestNumber: "REQ-2025-001",
      type: "worker",
      status: "submitted",
      requesterId: "user-1",
      factoryId: factoryIds[0],
      route: "Factory 1 → Main Gate → Worker Area A",
      passengerCount: 35,
      requestedDate: tomorrow,
      notes: "Regular morning shift transport",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });

    const req2 = this.createRequestSync({
      requestNumber: "REQ-2025-002",
      type: "shipment",
      status: "approved",
      requesterId: "user-2",
      factoryId: factoryIds[1],
      yard: "wattala",
      cbm: "42.5",
      cutoffTime: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000),
      requestedDate: tomorrow,
      notes: "Export shipment for client ABC Corp",
      approverId: "user-3",
      approvedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      approvalComment: "Approved for tomorrow",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    const req3 = this.createRequestSync({
      requestNumber: "REQ-2025-003",
      type: "general",
      status: "approved",
      requesterId: "user-1",
      factoryId: factoryIds[0],
      pickupLocation: "Colombo Fort Railway Station",
      dropLocation: "Factory 1 Main Entrance",
      timeWindowStart: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000),
      timeWindowEnd: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000),
      passengerCount: 3,
      purpose: "Client visit and factory tour",
      department: "Marketing",
      requestedDate: tomorrow,
      notes: "VIP clients from overseas",
      approverId: "user-3",
      approvedAt: new Date(now.getTime() - 30 * 60 * 1000),
      approvalComment: "Approved - assign luxury vehicle",
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
    });

    const req4 = this.createRequestSync({
      requestNumber: "REQ-2025-004",
      type: "worker",
      status: "scheduled",
      requesterId: "user-2",
      factoryId: factoryIds[2],
      route: "Factory 3 → Secondary Gate → Worker Area C",
      passengerCount: 18,
      requestedDate: tomorrow,
      notes: "Evening shift workers",
      approverId: "user-3",
      approvedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    });

    const req5 = this.createRequestSync({
      requestNumber: "REQ-2025-005",
      type: "shipment",
      status: "completed",
      requesterId: "user-1",
      factoryId: factoryIds[3],
      yard: "katunayake",
      cbm: "18.3",
      cutoffTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      requestedDate: now,
      notes: "Urgent shipment completed",
      approverId: "user-3",
      approvedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    // Create trips
    const trip1 = this.createTripSync({
      tripNumber: "TRIP-2025-001",
      requestIds: JSON.stringify([req4]),
      status: "scheduled",
      vehicleId: vehicleIds[4],
      driverId: null,
      vendorId: vendorIds[1],
      plannedStartTime: new Date(tomorrow.getTime() + 17 * 60 * 60 * 1000),
      plannedEndTime: new Date(tomorrow.getTime() + 19 * 60 * 60 * 1000),
      actualStartTime: null,
      actualEndTime: null,
      startOdometer: null,
      endOdometer: null,
      passengersBoarded: null,
      incidents: null,
      isPooled: false,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    });

    const trip2 = this.createTripSync({
      tripNumber: "TRIP-2025-002",
      requestIds: JSON.stringify([req5]),
      status: "completed",
      vehicleId: vehicleIds[3],
      driverId: null,
      vendorId: vendorIds[0],
      plannedStartTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      plannedEndTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      actualStartTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      actualEndTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      startOdometer: 45230,
      endOdometer: 45285,
      passengersBoarded: null,
      incidents: "Traffic delay on Kandy Road - 20 minutes",
      isPooled: false,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    });

    // Create gate log
    const gateLog1 = this.createGateLogSync({
      tripId: trip2,
      vehicleId: vehicleIds[3],
      plannedTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      inTime: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 22 * 60 * 1000),
      outTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      delayMinutes: 22,
      isDelayed: true,
      remarks: "Heavy traffic on Kandy Road",
      securityOfficerId: "user-security-1",
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    });

    // Create penalty
    this.createPenaltySync({
      tripId: trip2,
      gateLogId: gateLog1,
      delayMinutes: 22,
      amount: "100.00",
      status: "pending",
      confirmedBy: null,
      confirmedAt: null,
      waivedBy: null,
      waivedAt: null,
      waiverReason: null,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    });

    // Create claims
    this.createClaimSync({
      claimNumber: "CLM-2025-001",
      employeeId: "user-1",
      linkedRequestId: null,
      tripDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      reason: "Missed company transport, took Uber",
      amount: "1500.00",
      receiptUrl: null,
      status: "submitted",
      approverId: null,
      approvedAt: null,
      approvalComment: null,
      reimbursedAt: null,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    });
  }

  // Factory methods
  private createFactorySync(factory: InsertFactory): string {
    const id = randomUUID();
    const newFactory: Factory = { ...factory, id };
    this.factories.set(id, newFactory);
    return id;
  }

  async getFactories(): Promise<Factory[]> {
    return Array.from(this.factories.values());
  }

  async getFactory(id: string): Promise<Factory | undefined> {
    return this.factories.get(id);
  }

  async createFactory(factory: InsertFactory): Promise<Factory> {
    const id = randomUUID();
    const newFactory: Factory = { ...factory, id };
    this.factories.set(id, newFactory);
    return newFactory;
  }

  async updateFactory(
    id: string,
    factory: Partial<InsertFactory>
  ): Promise<Factory> {
    const existing = this.factories.get(id);
    if (!existing) throw new Error("Factory not found");
    const updated = { ...existing, ...factory };
    this.factories.set(id, updated);
    return updated;
  }

  async deleteFactory(id: string): Promise<void> {
    this.factories.delete(id);
  }

  // Vendor methods
  private createVendorSync(vendor: InsertVendor): string {
    const id = randomUUID();
    const newVendor: Vendor = { ...vendor, id };
    this.vendors.set(id, newVendor);
    return id;
  }

  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const newVendor: Vendor = { ...vendor, id };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(
    id: string,
    vendor: Partial<InsertVendor>
  ): Promise<Vendor> {
    const existing = this.vendors.get(id);
    if (!existing) throw new Error("Vendor not found");
    const updated = { ...existing, ...vendor };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: string): Promise<void> {
    this.vendors.delete(id);
  }

  // Vehicle methods
  private createVehicleSync(vehicle: InsertVehicle): string {
    const id = randomUUID();
    const newVehicle: Vehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return id;
  }

  async getVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const newVehicle: Vehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateVehicle(
    id: string,
    vehicle: Partial<InsertVehicle>
  ): Promise<Vehicle> {
    const existing = this.vehicles.get(id);
    if (!existing) throw new Error("Vehicle not found");
    const updated = { ...existing, ...vehicle };
    this.vehicles.set(id, updated);
    return updated;
  }

  async deleteVehicle(id: string): Promise<void> {
    this.vehicles.delete(id);
  }

  // Rate methods
  private createRateSync(rate: InsertRate): string {
    const id = randomUUID();
    const newRate: Rate = { ...rate, id };
    this.rates.set(id, newRate);
    return id;
  }

  async getRates(): Promise<Rate[]> {
    return Array.from(this.rates.values());
  }

  async getRate(id: string): Promise<Rate | undefined> {
    return this.rates.get(id);
  }

  async createRate(rate: InsertRate): Promise<Rate> {
    const id = randomUUID();
    const newRate: Rate = { ...rate, id };
    this.rates.set(id, newRate);
    return newRate;
  }

  // Request methods
  private createRequestSync(request: any): string {
    const id = randomUUID();
    const newRequest: Request = { ...request, id };
    this.requests.set(id, newRequest);
    return id;
  }

  async getRequests(filters?: {
    type?: string;
    status?: string;
  }): Promise<Request[]> {
    let requests = Array.from(this.requests.values());

    if (filters?.type && filters.type !== "all") {
      requests = requests.filter((r) => r.type === filters.type);
    }

    if (filters?.status && filters.status !== "all") {
      requests = requests.filter((r) => r.status === filters.status);
    }

    return requests.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getRequest(id: string): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async createRequest(request: InsertRequest): Promise<Request> {
    const id = randomUUID();
    const requestNumber = `REQ-${new Date().getFullYear()}-${String(
      this.requests.size + 1
    ).padStart(3, "0")}`;
    const newRequest: Request = {
      ...request,
      id,
      requestNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.requests.set(id, newRequest);
    return newRequest;
  }

  async updateRequest(
    id: string,
    request: Partial<InsertRequest>
  ): Promise<Request> {
    const existing = this.requests.get(id);
    if (!existing) throw new Error("Request not found");
    const updated = { ...existing, ...request, updatedAt: new Date() };
    this.requests.set(id, updated);
    return updated;
  }

  async approveRequest(
    id: string,
    approverId: string,
    comment?: string
  ): Promise<Request> {
    const existing = this.requests.get(id);
    if (!existing) throw new Error("Request not found");
    const updated = {
      ...existing,
      status: "approved" as const,
      approverId,
      approvedAt: new Date(),
      approvalComment: comment || null,
      updatedAt: new Date(),
    };
    this.requests.set(id, updated);
    return updated;
  }

  async rejectRequest(
    id: string,
    approverId: string,
    comment: string
  ): Promise<Request> {
    const existing = this.requests.get(id);
    if (!existing) throw new Error("Request not found");
    const updated = {
      ...existing,
      status: "cancelled" as const,
      approverId,
      approvedAt: new Date(),
      approvalComment: comment,
      updatedAt: new Date(),
    };
    this.requests.set(id, updated);
    return updated;
  }

  // Trip methods
  private createTripSync(trip: any): string {
    const id = randomUUID();
    const newTrip: Trip = { ...trip, id };
    this.trips.set(id, newTrip);
    return id;
  }

  async getTrips(filters?: { status?: string }): Promise<Trip[]> {
    let trips = Array.from(this.trips.values());

    if (filters?.status) {
      const statuses = filters.status.split(",");
      trips = trips.filter((t) => statuses.includes(t.status));
    }

    return trips.sort(
      (a, b) =>
        new Date(b.plannedStartTime).getTime() -
        new Date(a.plannedStartTime).getTime()
    );
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const id = randomUUID();
    const tripNumber = `TRIP-${new Date().getFullYear()}-${String(
      this.trips.size + 1
    ).padStart(3, "0")}`;
    const newTrip: Trip = {
      ...trip,
      id,
      tripNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trips.set(id, newTrip);

    // Update associated requests to scheduled status
    const requestIds = JSON.parse(trip.requestIds) as string[];
    for (const requestId of requestIds) {
      await this.updateRequest(requestId, { status: "scheduled" });
    }

    return newTrip;
  }

  async updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip> {
    const existing = this.trips.get(id);
    if (!existing) throw new Error("Trip not found");
    const updated = { ...existing, ...trip, updatedAt: new Date() };
    this.trips.set(id, updated);
    return updated;
  }

  // Gate Log methods
  private createGateLogSync(log: any): string {
    const id = randomUUID();
    const newLog: GateLog = { ...log, id };
    this.gateLogs.set(id, newLog);
    return id;
  }

  async getGateLogs(): Promise<GateLog[]> {
    return Array.from(this.gateLogs.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getGateLog(id: string): Promise<GateLog | undefined> {
    return this.gateLogs.get(id);
  }

  async createGateLog(log: InsertGateLog): Promise<GateLog> {
    const id = randomUUID();

    // Calculate delay
    const plannedTime = new Date(log.plannedTime);
    const actualTime = log.inTime ? new Date(log.inTime) : new Date();
    const delayMinutes = Math.max(
      0,
      Math.floor((actualTime.getTime() - plannedTime.getTime()) / (1000 * 60))
    );
    const isDelayed = delayMinutes > (this.settings.graceMinutes || 15);

    const newLog: GateLog = {
      ...log,
      id,
      delayMinutes,
      isDelayed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gateLogs.set(id, newLog);

    // Create penalty if delayed
    if (isDelayed) {
      await this.createPenalty({
        tripId: log.tripId,
        gateLogId: id,
        delayMinutes,
        amount: this.settings.penaltyAmount,
        status: "pending",
        confirmedBy: null,
        confirmedAt: null,
        waivedBy: null,
        waivedAt: null,
        waiverReason: null,
      });
    }

    return newLog;
  }

  // Penalty methods
  private createPenaltySync(penalty: any): string {
    const id = randomUUID();
    const newPenalty: Penalty = { ...penalty, id };
    this.penalties.set(id, newPenalty);
    return id;
  }

  async getPenalties(): Promise<Penalty[]> {
    return Array.from(this.penalties.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPenalty(id: string): Promise<Penalty | undefined> {
    return this.penalties.get(id);
  }

  async createPenalty(penalty: InsertPenalty): Promise<Penalty> {
    const id = randomUUID();
    const newPenalty: Penalty = {
      ...penalty,
      id,
      createdAt: new Date(),
    };
    this.penalties.set(id, newPenalty);
    return newPenalty;
  }

  async confirmPenalty(id: string, confirmedBy: string): Promise<Penalty> {
    const existing = this.penalties.get(id);
    if (!existing) throw new Error("Penalty not found");
    const updated = {
      ...existing,
      status: "confirmed" as const,
      confirmedBy,
      confirmedAt: new Date(),
    };
    this.penalties.set(id, updated);
    return updated;
  }

  async waivePenalty(
    id: string,
    waivedBy: string,
    waiverReason: string
  ): Promise<Penalty> {
    const existing = this.penalties.get(id);
    if (!existing) throw new Error("Penalty not found");
    const updated = {
      ...existing,
      status: "waived" as const,
      waivedBy,
      waivedAt: new Date(),
      waiverReason,
    };
    this.penalties.set(id, updated);
    return updated;
  }

  // Claim methods
  private createClaimSync(claim: any): string {
    const id = randomUUID();
    const newClaim: Claim = { ...claim, id };
    this.claims.set(id, newClaim);
    return id;
  }

  async getClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claimNumber = `CLM-${new Date().getFullYear()}-${String(
      this.claims.size + 1
    ).padStart(3, "0")}`;
    const newClaim: Claim = {
      ...claim,
      id,
      claimNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.claims.set(id, newClaim);
    return newClaim;
  }

  async updateClaim(id: string, claim: Partial<InsertClaim>): Promise<Claim> {
    const existing = this.claims.get(id);
    if (!existing) throw new Error("Claim not found");
    const updated = { ...existing, ...claim, updatedAt: new Date() };
    this.claims.set(id, updated);
    return updated;
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(settings: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...settings, updatedAt: new Date() };
    return this.settings;
  }

  // Activity Log methods
  async getActivityLogs(entityId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter((log) => log.entityId === entityId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const newLog: ActivityLog = {
      ...log,
      id,
      createdAt: new Date(),
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
