/**
 * MediNova — Mock: reviews & analytics.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const reviews = [
  { id: "rvw-01", doctorId: "doc-01", doctorName: "Dr. Salman Raza", userId: "u-1004", userName: "Hassan Raza", rating: 5, title: "Excellent cardiologist", comment: "Very thorough examination and clear explanation of my condition.", date: "2026-07-20T10:00:00.000Z" },
  { id: "rvw-02", doctorId: "doc-02", doctorName: "Dr. Ayesha Malik", userId: "u-1001", userName: "Ayesha Khan", rating: 5, title: "Great results", comment: "My acne improved noticeably within weeks.", date: "2026-07-28T10:00:00.000Z" },
  { id: "rvw-03", doctorId: "doc-03", doctorName: "Dr. Imran Qureshi", userId: "u-1005", userName: "Maria Saeed", rating: 4, title: "Good experience", comment: "Professional staff and helpful doctor.", date: "2026-07-15T10:00:00.000Z" },
  { id: "rvw-04", doctorId: "doc-04", doctorName: "Dr. Fatima Hassan", userId: "u-1007", userName: "Sara Malik", rating: 5, title: "Wonderful with kids", comment: "My daughter feels comfortable every visit.", date: "2026-07-22T10:00:00.000Z" },
  { id: "rvw-05", doctorId: "doc-05", doctorName: "Dr. Omar Farooq", userId: "u-1004", userName: "Hassan Raza", rating: 4, title: "Helpful neurologist", comment: "Good advice on managing migraines.", date: "2026-08-05T10:00:00.000Z" },
  { id: "rvw-06", doctorId: "doc-12", doctorName: "Dr. Zainab Tariq", userId: "u-1005", userName: "Maria Saeed", rating: 5, title: "Very supportive", comment: "Took time to listen and made me feel comfortable.", date: "2026-08-04T10:00:00.000Z" },
];

export const analytics = {
  userGrowth: [
    { label: "Jan", users: 40, doctors: 4, appointments: 60 },
    { label: "Feb", users: 78, doctors: 5, appointments: 120 },
    { label: "Mar", users: 135, doctors: 6, appointments: 240 },
    { label: "Apr", users: 190, doctors: 7, appointments: 330 },
    { label: "May", users: 265, doctors: 8, appointments: 470 },
    { label: "Jun", users: 320, doctors: 9, appointments: 590 },
    { label: "Jul", users: 410, doctors: 11, appointments: 720 },
    { label: "Aug", users: 520, doctors: 12, appointments: 860 },
  ],
  revenue: [
    { label: "Jan", value: 120000 },
    { label: "Feb", value: 210000 },
    { label: "Mar", value: 320000 },
    { label: "Apr", value: 410000 },
    { label: "May", value: 560000 },
    { label: "Jun", value: 690000 },
    { label: "Jul", value: 820000 },
    { label: "Aug", value: 940000 },
  ],
  popularMedicines: [
    { name: "Panadol Extra", sales: 1200 },
    { name: "Vitamin D3 2000IU", sales: 950 },
    { name: "Metformin 500", sales: 800 },
    { name: "Berocca", sales: 700 },
    { name: "Atorvastatin 20", sales: 670 },
    { name: "Neurobion Forte", sales: 610 },
  ],
  appointmentsByStatus: { completed: 340, confirmed: 180, pending: 120, cancelled: 60, "no-show": 25 },
  weeklyActivity: [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 150 },
    { label: "Wed", value: 98 },
    { label: "Thu", value: 165 },
    { label: "Fri", value: 210 },
    { label: "Sat", value: 180 },
    { label: "Sun", value: 90 },
  ],
};

export default { reviews, analytics };
