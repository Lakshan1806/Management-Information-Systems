// Application Constants

export const REQUEST_TYPES = {
  WORKER: 'worker',
  SHIPMENT: 'shipment',
  GENERAL: 'general',
} as const;

export const REQUEST_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TRIP_STATUSES = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const YARDS = {
  WATTALA: 'wattala',
  KATUNAYAKE: 'katunayake',
} as const;

export const USER_ROLES = {
  REQUESTER: 'requester',
  APPROVER: 'approver',
  COORDINATOR: 'coordinator',
  SECURITY: 'security',
  ADMIN: 'admin',
} as const;

export const PENALTY_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  WAIVED: 'waived',
} as const;

export const CLAIM_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REIMBURSED: 'reimbursed',
} as const;

export const RATE_MODES = {
  FIXED: 'fixed',
  PER_KM: 'per_km',
} as const;

// Status badge variants
export const STATUS_VARIANTS: Record<string, {
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}> = {
  draft: { variant: "outline" },
  submitted: { variant: "secondary" },
  approved: { variant: "default", className: "bg-green-500 text-white" },
  scheduled: { variant: "default" },
  in_progress: { variant: "default", className: "bg-blue-500 text-white" },
  completed: { variant: "default", className: "bg-green-600 text-white" },
  cancelled: { variant: "secondary", className: "bg-gray-400 text-white" },
  pending: { variant: "secondary", className: "bg-yellow-500 text-white" },
  confirmed: { variant: "destructive" },
  waived: { variant: "secondary" },
  rejected: { variant: "destructive" },
  reimbursed: { variant: "default", className: "bg-green-500 text-white" },
};

// Worker routes
export const WORKER_ROUTES = [
  'Factory 1 → Main Gate → Worker Area A',
  'Factory 2 → Main Gate → Worker Area B',
  'Factory 3 → Main Gate → Worker Area C',
  'Factory 4 → Secondary Gate → Worker Area D',
  'Factory 5 → Main Gate → Worker Area E',
  'Downtown → Multiple Factories',
  'Northern Route → Factory Complex',
  'Southern Route → Production Units',
];

// Vehicle types
export const VEHICLE_TYPES = [
  'Van',
  'Bus',
  'Truck',
  'Car',
  'Mini Bus',
  'Lorry',
];

// Container sizes by CBM
export const CONTAINER_SUGGESTIONS = [
  { minCBM: 0, maxCBM: 20, size: '20ft Container', capacity: '28 CBM' },
  { minCBM: 20, maxCBM: 40, size: '40ft Container', capacity: '58 CBM' },
  { minCBM: 40, maxCBM: 60, size: '40ft High Cube', capacity: '68 CBM' },
  { minCBM: 60, maxCBM: Infinity, size: 'Multiple Containers', capacity: 'Custom' },
];

// Department list
export const DEPARTMENTS = [
  'HR',
  'Shipping',
  'Production',
  'Quality Control',
  'Finance',
  'IT',
  'Administration',
  'Marketing',
  'Procurement',
];
