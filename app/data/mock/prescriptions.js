/**
 * MediNova — Mock: prescriptions.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const prescriptions = [
  {
    id: "rx-3001", patientId: "u-1001", patientName: "Ayesha Khan",
    doctorId: "doc-07", doctorName: "Dr. Bilal Ahmed", specialty: "General Physician",
    date: "2026-07-15", diagnosis: "Viral fever",
    medicines: [
      { name: "Panadol Extra", dosage: "1 tablet", frequency: "Every 6 hours", duration: "5 days", instructions: "After meals" },
      { name: "Zincovit", dosage: "2 tsp", frequency: "Once daily", duration: "10 days", instructions: "After dinner" },
    ],
    advice: "Rest, fluids, light diet. Report if fever persists beyond 3 days.",
    notes: "", refillable: false, status: "completed",
    createdAt: "2026-07-15T09:30:00.000Z",
  },
  {
    id: "rx-3002", patientId: "u-1001", patientName: "Ayesha Khan",
    doctorId: "doc-01", doctorName: "Dr. Salman Raza", specialty: "Cardiologist",
    date: "2026-08-01", diagnosis: "Palpitations / monitoring",
    medicines: [
      { name: "Brufen 400", dosage: "1 tablet", frequency: "As needed", duration: "3 days", instructions: "With food" },
    ],
    advice: "ECG next visit, reduce caffeine, moderate exercise.",
    notes: "Follow-up in 2 weeks", refillable: true, status: "active",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "rx-3003", patientId: "u-1004", patientName: "Hassan Raza",
    doctorId: "doc-05", doctorName: "Dr. Omar Farooq", specialty: "Neurologist",
    date: "2026-08-04", diagnosis: "Chronic migraine",
    medicines: [
      { name: "Panadol Extra", dosage: "1 tablet", frequency: "Every 8 hours", duration: "5 days", instructions: "At onset of pain" },
      { name: "Neurobion Forte", dosage: "1 tablet", frequency: "Once daily", duration: "30 days", instructions: "Morning" },
    ],
    advice: "Avoid screens before sleep, hydration, sleep schedule.",
    notes: "", refillable: true, status: "active",
    createdAt: "2026-08-04T10:00:00.000Z",
  },
  {
    id: "rx-3004", patientId: "u-1005", patientName: "Maria Saeed",
    doctorId: "doc-12", doctorName: "Dr. Zainab Tariq", specialty: "Psychiatrist",
    date: "2026-08-03", diagnosis: "Generalized anxiety",
    medicines: [
      { name: "Neurobion Forte", dosage: "1 tablet", frequency: "Once daily", duration: "15 days", instructions: "With breakfast" },
    ],
    advice: "Therapy sessions continue; breathing exercises.",
    notes: "Confidential consultation", refillable: true, status: "active",
    createdAt: "2026-08-03T16:30:00.000Z",
  },
  {
    id: "rx-3005", patientId: "u-1001", patientName: "Ayesha Khan",
    doctorId: "doc-02", doctorName: "Dr. Ayesha Malik", specialty: "Dermatologist",
    date: "2026-08-05", diagnosis: "Acne vulgaris",
    medicines: [
      { name: "Adapalene Gel", dosage: "Thin layer", frequency: "At night", duration: "4 weeks", instructions: "On clean dry skin, avoid sun" },
    ],
    advice: "Gentle cleanser, sunscreen in morning.",
    notes: "", refillable: false, status: "active",
    createdAt: "2026-08-05T11:30:00.000Z",
  },
  {
    id: "rx-3006", patientId: "u-1007", patientName: "Sara Malik",
    doctorId: "doc-04", doctorName: "Dr. Fatima Hassan", specialty: "Pediatrician",
    date: "2026-07-20", diagnosis: "Iron deficiency anemia",
    medicines: [
      { name: "Replenind-M", dosage: "2 tsp", frequency: "Once daily", duration: "30 days", instructions: "After breakfast" },
    ],
    advice: "Iron-rich foods; repeat CBC in 1 month.",
    notes: "", refillable: false, status: "completed",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
];

export default prescriptions;
