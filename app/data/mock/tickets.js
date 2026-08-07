/**
 * MediNova — Mock: support tickets & FAQs.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const tickets = [
  { id: "tkt-8001", userId: "u-1001", userName: "Ayesha Khan", subject: "Unable to upload medical record", category: "technical", priority: "medium", status: "in-progress", message: "I tried to upload a PDF but got an error.", attachments: [], createdAt: "2026-08-05T10:00:00.000Z", updatedAt: "2026-08-06T10:00:00.000Z", replies: [{ by: "Support Agent", text: "We're looking into this. Could you try a smaller file?", time: "2026-08-06T10:00:00.000Z" }] },
  { id: "tkt-8002", userId: "u-1004", userName: "Hassan Raza", subject: "Reschedule appointment", category: "appointments", priority: "low", status: "open", message: "Please help reschedule my appointment.", attachments: [], createdAt: "2026-08-06T12:00:00.000Z", updatedAt: "2026-08-06T12:00:00.000Z", replies: [] },
  { id: "tkt-8003", userId: "u-1005", userName: "Maria Saeed", subject: "Payment not reflected", category: "billing", priority: "high", status: "in-progress", message: "I paid for an order but the status still shows unpaid.", attachments: [], createdAt: "2026-08-04T09:00:00.000Z", updatedAt: "2026-08-05T09:00:00.000Z", replies: [{ by: "Support Agent", text: "We have escalated this to our billing team.", time: "2026-08-05T09:00:00.000Z" }] },
  { id: "tkt-8004", userId: "u-1007", userName: "Sara Malik", subject: "Medicine query", category: "pharmacy", priority: "medium", status: "resolved", message: "Is Adapalene available without prescription?", attachments: [], createdAt: "2026-07-28T09:00:00.000Z", updatedAt: "2026-07-29T09:00:00.000Z", replies: [{ by: "Pharmacist Nova", text: "No, it requires a prescription. You can upload one during checkout.", time: "2026-07-29T09:00:00.000Z" }] },
];

export const faqs = [
  { id: "faq-01", question: "How do I book an appointment?", answer: "Go to Doctors, choose a specialist, and tap Book Appointment. Pick a date and time slot that suits you, then confirm. You'll get an instant confirmation.", category: "appointments" },
  { id: "faq-02", question: "Can I consult a doctor online?", answer: "Yes. Many doctors offer online consultations. Filter by 'Online' availability and choose the Online Consultation appointment type.", category: "appointments" },
  { id: "faq-03", question: "Do I need a prescription to buy medicines?", answer: "Some medicines require a prescription. Items marked 'Prescription required' will ask you to upload a valid prescription during checkout.", category: "pharmacy" },
  { id: "faq-04", question: "How do I track my order?", answer: "Go to Orders from your dashboard. Each order shows a live tracking timeline from confirmation to delivery.", category: "orders" },
  { id: "faq-05", question: "How is my medical data protected?", answer: "MediNova follows strict privacy practices. Sensitive medical information is never exposed publicly, and sessions are managed securely.", category: "security" },
  { id: "faq-06", question: "How can I reset my password?", answer: "Use the 'Forgot password' link on the login page. A reset link (demo token) will be issued to your email.", category: "account" },
  { id: "faq-07", question: "Can I cancel or reschedule an appointment?", answer: "Yes. Open the appointment and choose Reschedule or Cancel. Status will update accordingly.", category: "appointments" },
  { id: "faq-08", question: "How do I contact support?", answer: "Visit the Support section to create a ticket or browse FAQs. Our team responds during working hours.", category: "support" },
];

export const ticketCategories = ["technical", "appointments", "billing", "pharmacy", "account", "other"];

export const ticketStatuses = ["open", "pending", "in-progress", "resolved", "closed"];

export default { tickets, faqs, ticketCategories, ticketStatuses };
