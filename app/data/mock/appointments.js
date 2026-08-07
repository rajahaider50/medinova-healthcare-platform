/**
 * MediNova — Mock: appointments.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const appointments = [
  {
    id: "apt-2001", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    type: "physical", date: "2026-08-07", time: "10:00 AM", slot: "10:00 AM",
    reason: "Chest pain and irregular heartbeat", symptoms: ["Chest pain", "Palpitations"],
    status: "confirmed", notes: "Bring previous ECG reports", document: null,
    fee: 2500, paymentStatus: "paid", createdAt: "2026-08-01T09:00:00.000Z", updatedAt: "2026-08-03T10:00:00.000Z",
  },
  {
    id: "apt-2002", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-02", doctorName: "Dr. Ayesha Malik",
    type: "online", date: "2026-08-05", time: "11:00 AM", slot: "11:00 AM",
    reason: "Acne treatment follow-up", symptoms: ["Acne", "Skin redness"],
    status: "completed", notes: "", document: null,
    fee: 1800, paymentStatus: "paid", createdAt: "2026-07-28T12:00:00.000Z", updatedAt: "2026-08-05T11:30:00.000Z",
  },
  {
    id: "apt-2003", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-04", doctorName: "Dr. Fatima Hassan",
    type: "physical", date: "2026-08-12", time: "05:00 PM", slot: "5:00 PM",
    reason: "Child vaccination", symptoms: [],
    status: "pending", notes: "", document: null,
    fee: 1500, paymentStatus: "unpaid", createdAt: "2026-08-06T08:00:00.000Z", updatedAt: "2026-08-06T08:00:00.000Z",
  },
  {
    id: "apt-2004", patientId: "u-1004", patientName: "Hassan Raza", doctorId: "doc-05", doctorName: "Dr. Omar Farooq",
    type: "physical", date: "2026-08-08", time: "04:00 PM", slot: "4:00 PM",
    reason: "Migraine consultation", symptoms: ["Headache", "Nausea"],
    status: "confirmed", notes: "", document: null,
    fee: 2800, paymentStatus: "paid", createdAt: "2026-08-02T10:00:00.000Z", updatedAt: "2026-08-04T09:00:00.000Z",
  },
  {
    id: "apt-2005", patientId: "u-1005", patientName: "Maria Saeed", doctorId: "doc-12", doctorName: "Dr. Zainab Tariq",
    type: "online", date: "2026-08-03", time: "04:00 PM", slot: "4:00 PM",
    reason: "Anxiety management", symptoms: ["Anxiety", "Low mood"],
    status: "completed", notes: "Continue therapy sessions", document: null,
    fee: 2500, paymentStatus: "paid", createdAt: "2026-07-25T11:00:00.000Z", updatedAt: "2026-08-03T16:30:00.000Z",
  },
  {
    id: "apt-2006", patientId: "u-1007", patientName: "Sara Malik", doctorId: "doc-04", doctorName: "Dr. Fatima Hassan",
    type: "physical", date: "2026-08-10", time: "10:00 AM", slot: "10:00 AM",
    reason: "General checkup", symptoms: ["Fatigue"],
    status: "pending", notes: "", document: null,
    fee: 1500, paymentStatus: "unpaid", createdAt: "2026-08-06T09:00:00.000Z", updatedAt: "2026-08-06T09:00:00.000Z",
  },
  {
    id: "apt-2007", patientId: "u-1004", patientName: "Hassan Raza", doctorId: "doc-03", doctorName: "Dr. Imran Qureshi",
    type: "physical", date: "2026-07-20", time: "10:00 AM", slot: "10:00 AM",
    reason: "Knee pain", symptoms: ["Knee pain"],
    status: "cancelled", notes: "Patient rescheduled", document: null,
    fee: 3000, paymentStatus: "refunded", createdAt: "2026-07-10T09:00:00.000Z", updatedAt: "2026-07-18T11:00:00.000Z",
  },
  {
    id: "apt-2008", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-07", doctorName: "Dr. Bilal Ahmed",
    type: "online", date: "2026-07-15", time: "09:00 AM", slot: "9:00 AM",
    reason: "Fever", symptoms: ["Fever", "Body ache"],
    status: "completed", notes: "Prescribed Paracetamol", document: null,
    fee: 900, paymentStatus: "paid", createdAt: "2026-07-12T09:00:00.000Z", updatedAt: "2026-07-15T09:30:00.000Z",
  },
  {
    id: "apt-2009", patientId: "u-1005", patientName: "Maria Saeed", doctorId: "doc-02", doctorName: "Dr. Ayesha Malik",
    type: "physical", date: "2026-08-14", time: "04:00 PM", slot: "4:00 PM",
    reason: "Skin checkup", symptoms: [],
    status: "pending", notes: "", document: null,
    fee: 1800, paymentStatus: "unpaid", createdAt: "2026-08-07T07:00:00.000Z", updatedAt: "2026-08-07T07:00:00.000Z",
  },
  {
    id: "apt-2010", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-09", doctorName: "Dr. Talha Sheikh",
    type: "online", date: "2026-06-20", time: "10:00 AM", slot: "10:00 AM",
    reason: "Diabetes screening", symptoms: [],
    status: "no-show", notes: "", document: null,
    fee: 1900, paymentStatus: "paid", createdAt: "2026-06-10T09:00:00.000Z", updatedAt: "2026-06-20T11:00:00.000Z",
  },
];

export default appointments;
