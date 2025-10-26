import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type RequestType = "worker" | "shipment" | "general";
export type RequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";
export type TripStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";
export type YardType = "wattala" | "katunayake";
export type UserRole =
  | "requester"
  | "approver"
  | "coordinator"
  | "security"
  | "admin"
  | "driver"
  | "finance"
  | "management";
export type PenaltyStatus = "pending" | "confirmed" | "waived";
export type ClaimStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "reimbursed";
export type RateMode = "fixed" | "per_km";

export const factories = pgTable("factories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertFactorySchema = createInsertSchema(factories).omit({
  id: true,
});
export type InsertFactory = z.infer<typeof insertFactorySchema>;
export type Factory = typeof factories.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().$type<UserRole>(),
  factoryId: varchar("factory_id"),
  active: boolean("active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const vendors = pgTable("vendors", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  email: text("email"),
  bankDetails: text("bank_details"),
  active: boolean("active").notNull().default(true),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
});
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

export const vehicles = pgTable("vehicles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  plateNumber: text("plate_number").notNull().unique(),
  type: text("type").notNull(), // van, bus, truck, car
  seats: integer("seats").notNull(),
  hasAC: boolean("has_ac").notNull().default(false),
  vendorId: varchar("vendor_id"),
  isOwned: boolean("is_owned").notNull().default(true),
  active: boolean("active").notNull().default(true),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
});
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export const rates = pgTable("rates", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  mode: text("mode").notNull().$type<RateMode>(),
  baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
  routeName: text("route_name"), // for fixed monthly routes
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveTo: timestamp("effective_to"),
  notes: text("notes"),
  isCurrent: boolean("is_current").notNull().default(true),
});

export const insertRateSchema = createInsertSchema(rates).omit({ id: true });
export type InsertRate = z.infer<typeof insertRateSchema>;
export type Rate = typeof rates.$inferSelect;

export const requests = pgTable("requests", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  requestNumber: text("request_number").notNull().unique(),
  type: text("type").notNull().$type<RequestType>(),
  status: text("status").notNull().$type<RequestStatus>(),
  requesterId: varchar("requester_id").notNull(),
  factoryId: varchar("factory_id").notNull(),

  route: text("route"),
  passengerCount: integer("passenger_count"),

  yard: text("yard").$type<YardType>(),
  cbm: decimal("cbm", { precision: 10, scale: 2 }),
  cutoffTime: timestamp("cutoff_time"),

  pickupLocation: text("pickup_location"),
  dropLocation: text("drop_location"),
  timeWindowStart: timestamp("time_window_start"),
  timeWindowEnd: timestamp("time_window_end"),
  purpose: text("purpose"),
  department: text("department"),

  requestedDate: timestamp("requested_date").notNull(),
  notes: text("notes"),

  approverId: varchar("approver_id"),
  approvedAt: timestamp("approved_at"),
  approvalComment: text("approval_comment"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  requestNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;

export const trips = pgTable("trips", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  tripNumber: text("trip_number").notNull().unique(),
  requestIds: text("request_ids").notNull(),
  status: text("status").notNull().$type<TripStatus>(),

  vehicleId: varchar("vehicle_id").notNull(),
  driverId: varchar("driver_id"),
  vendorId: varchar("vendor_id"),

  plannedStartTime: timestamp("planned_start_time").notNull(),
  plannedEndTime: timestamp("planned_end_time").notNull(),

  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),

  startOdometer: integer("start_odometer"),
  endOdometer: integer("end_odometer"),

  passengersBoarded: integer("passengers_boarded"),
  incidents: text("incidents"),

  isPooled: boolean("is_pooled").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  tripNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export const gateLogs = pgTable("gate_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").notNull(),
  vehicleId: varchar("vehicle_id").notNull(),

  plannedTime: timestamp("planned_time").notNull(),
  inTime: timestamp("in_time"),
  outTime: timestamp("out_time"),

  delayMinutes: integer("delay_minutes").default(0),
  isDelayed: boolean("is_delayed").notNull().default(false),

  remarks: text("remarks"),
  securityOfficerId: varchar("security_officer_id").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGateLogSchema = createInsertSchema(gateLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertGateLog = z.infer<typeof insertGateLogSchema>;
export type GateLog = typeof gateLogs.$inferSelect;

export const penalties = pgTable("penalties", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").notNull(),
  gateLogId: varchar("gate_log_id").notNull(),

  delayMinutes: integer("delay_minutes").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

  status: text("status").notNull().$type<PenaltyStatus>(),

  confirmedBy: varchar("confirmed_by"),
  confirmedAt: timestamp("confirmed_at"),

  waivedBy: varchar("waived_by"),
  waivedAt: timestamp("waived_at"),
  waiverReason: text("waiver_reason"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPenaltySchema = createInsertSchema(penalties).omit({
  id: true,
  createdAt: true,
});
export type InsertPenalty = z.infer<typeof insertPenaltySchema>;
export type Penalty = typeof penalties.$inferSelect;

export const claims = pgTable("claims", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  claimNumber: text("claim_number").notNull().unique(),

  employeeId: varchar("employee_id").notNull(),
  linkedRequestId: varchar("linked_request_id"),

  tripDate: timestamp("trip_date").notNull(),
  reason: text("reason").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

  receiptUrl: text("receipt_url"),

  status: text("status").notNull().$type<ClaimStatus>(),

  approverId: varchar("approver_id"),
  approvedAt: timestamp("approved_at"),
  approvalComment: text("approval_comment"),

  reimbursedAt: timestamp("reimbursed_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  claimNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;

export const settings = pgTable("settings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  graceMinutes: integer("grace_minutes").notNull().default(15),
  penaltyAmount: decimal("penalty_amount", { precision: 10, scale: 2 })
    .notNull()
    .default(sql`100.00`),
  poolingWindowMinutes: integer("pooling_window_minutes").notNull().default(30),
  workingHoursStart: text("working_hours_start").notNull().default("08:00"),
  workingHoursEnd: text("working_hours_end").notNull().default("18:00"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(),
  userId: varchar("user_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
