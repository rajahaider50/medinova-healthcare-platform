/**
 * MediNova — Static application catalogs & enums.
 * These are configuration constants (not business records) used across
 * the UI for filters, dropdowns and statuses. They are NOT seeded data.
 */

/** Medical specialties available for doctor profiles. */
export const SPECIALTIES = [
  "Cardiology", "Dermatology", "Neurology", "Pediatrics", "Orthopedics",
  "Gynecology", "General Physician", "ENT", "Ophthalmology", "Psychiatry",
  "Dentistry", "Endocrinology", "Gastroenterology", "Urology", "Oncology",
  "Pulmonology", "Nephrology", "Rheumatology", "Hematology", "Radiology",
];

/** Standard bookable appointment time slots (12-hour display format). */
export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM",
];

/** Medical record categories. */
export const RECORD_TYPES = [
  { id: "prescription", label: "Prescription", icon: "fa-file-prescription" },
  { id: "lab-report", label: "Lab Report", icon: "fa-vial-circle-check" },
  { id: "xray", label: "X-Ray", icon: "fa-x-ray" },
  { id: "mri", label: "MRI", icon: "fa-brain" },
  { id: "ct", label: "CT Scan", icon: "fa-scan" },
  { id: "ultrasound", label: "Ultrasound", icon: "fa-wave-square" },
  { id: "certificate", label: "Medical Certificate", icon: "fa-file-circle-check" },
  { id: "doctor-notes", label: "Doctor Notes", icon: "fa-notes-medical" },
  { id: "other", label: "Other", icon: "fa-folder" },
];

/** Notification kinds. */
export const NOTIFICATION_TYPES = [
  { id: "appointment", label: "Appointment", icon: "fa-calendar-check", tone: "info" },
  { id: "reminder", label: "Reminder", icon: "fa-bell", tone: "warning" },
  { id: "prescription", label: "Prescription", icon: "fa-file-prescription", tone: "success" },
  { id: "medicine", label: "Medicine", icon: "fa-pills", tone: "purple" },
  { id: "order", label: "Orders", icon: "fa-truck", tone: "info" },
  { id: "lab", label: "Lab Report", icon: "fa-vial-circle-check", tone: "info" },
  { id: "billing", label: "Billing", icon: "fa-credit-card", tone: "warning" },
  { id: "message", label: "Messages", icon: "fa-envelope", tone: "purple" },
  { id: "security", label: "Security", icon: "fa-shield-halved", tone: "danger" },
  { id: "system", label: "System", icon: "fa-server", tone: "neutral" },
  { id: "promo", label: "Promotions", icon: "fa-tag", tone: "purple" },
  { id: "medical", label: "Medical", icon: "fa-stethoscope", tone: "danger" },
];

/** Support ticket categories. */
export const TICKET_CATEGORIES = ["technical", "appointments", "billing", "pharmacy", "account", "other"];

/** Support ticket statuses. */
export const TICKET_STATUSES = ["open", "pending", "in-progress", "resolved", "closed"];

/** Order status flow (state machine order). */
export const ORDER_STATUS_FLOW = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];

/** Appointment statuses. */
export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no-show"];

/** User roles (alias of AuthService roles kept here for UI dropdowns). */
export const ROLE_OPTIONS = [
  { id: "user", label: "Patient" },
  { id: "doctor", label: "Doctor" },
  { id: "pharmacist", label: "Pharmacist" },
  { id: "support", label: "Support Agent" },
  { id: "editor", label: "Editor" },
  { id: "manager", label: "Manager" },
  { id: "admin", label: "Admin" },
  { id: "super_admin", label: "Super Admin" },
];

/** Payment methods. */
export const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "fa-credit-card" },
  { id: "cash", label: "Cash on Delivery", icon: "fa-money-bill-wave" },
  { id: "wallet", label: "MediNova Wallet", icon: "fa-wallet" },
  { id: "bank", label: "Bank Transfer", icon: "fa-building-columns" },
];

export default {
  SPECIALTIES,
  TIME_SLOTS,
  RECORD_TYPES,
  NOTIFICATION_TYPES,
  TICKET_CATEGORIES,
  TICKET_STATUSES,
  ORDER_STATUS_FLOW,
  APPOINTMENT_STATUSES,
  ROLE_OPTIONS,
  PAYMENT_METHODS,
};
