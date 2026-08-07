/**
 * MediNova — Mock: notifications.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const notifications = [
  { id: "ntf-6001", userId: "u-1001", type: "appointment", icon: "fa-calendar-check", title: "Appointment confirmed", message: "Your appointment with Dr. Salman Raza on Aug 7 at 10:00 AM is confirmed.", read: false, createdAt: "2026-08-03T10:00:00.000Z" },
  { id: "ntf-6002", userId: "u-1001", type: "reminder", icon: "fa-bell", title: "Appointment reminder", message: "You have an appointment with Dr. Salman Raza tomorrow at 10:00 AM.", read: false, createdAt: "2026-08-06T09:00:00.000Z" },
  { id: "ntf-6003", userId: "u-1001", type: "prescription", icon: "fa-file-prescription", title: "New prescription added", message: "Dr. Ayesha Malik added a new prescription for you.", read: false, createdAt: "2026-08-05T11:30:00.000Z" },
  { id: "ntf-6004", userId: "u-1001", type: "order", icon: "fa-truck", title: "Order shipped", message: "Your order ORD-2608-0001 has been shipped.", read: true, createdAt: "2026-08-07T09:00:00.000Z" },
  { id: "ntf-6005", userId: "u-1001", type: "medicine", icon: "fa-pills", title: "Medicine reminder", message: "Time to take Panadol Extra (after meal).", read: true, createdAt: "2026-08-06T14:00:00.000Z" },
  { id: "ntf-6006", userId: "u-1001", type: "lab", icon: "fa-vial-circle-check", title: "Lab report ready", message: "Your Lipid Profile report is ready to view.", read: false, createdAt: "2026-08-01T12:00:00.000Z" },
  { id: "ntf-6007", userId: "u-1001", type: "message", icon: "fa-envelope", title: "New message", message: "Dr. Salman Raza sent you a message.", read: false, createdAt: "2026-08-06T18:00:00.000Z" },
  { id: "ntf-6008", userId: "u-1001", type: "security", icon: "fa-shield-halved", title: "New login detected", message: "A new login was detected on your account from a browser on Aug 6.", read: true, createdAt: "2026-08-06T09:12:00.000Z" },
];

export const notificationTypes = [
  { id: "appointment", label: "Appointment", icon: "fa-calendar-check" },
  { id: "reminder", label: "Reminder", icon: "fa-bell" },
  { id: "prescription", label: "Prescription", icon: "fa-file-prescription" },
  { id: "medicine", label: "Medicine", icon: "fa-pills" },
  { id: "order", label: "Order", icon: "fa-truck" },
  { id: "lab", label: "Lab Report", icon: "fa-vial-circle-check" },
  { id: "message", label: "Message", icon: "fa-envelope" },
  { id: "security", label: "Security", icon: "fa-shield-halved" },
  { id: "system", label: "System", icon: "fa-server" },
];

export default { notifications, notificationTypes };
