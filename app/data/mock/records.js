/**
 * MediNova — Mock: medical records & lab reports.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const records = [
  { id: "rec-4001", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    type: "lab-report", title: "Lipid Profile Report", date: "2026-08-01", description: "Fasting lipid profile — cholesterol and triglycerides.", attachment: "", status: "available" },
  { id: "rec-4002", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    type: "xray", title: "Chest X-Ray (PA view)", date: "2026-07-28", description: "Routine chest X-ray, normal findings.", attachment: "", status: "available" },
  { id: "rec-4003", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-07", doctorName: "Dr. Bilal Ahmed",
    type: "prescription", title: "Viral fever prescription", date: "2026-07-15", description: "Prescription from general physician.", attachment: "", status: "available" },
  { id: "rec-4004", patientId: "u-1004", patientName: "Hassan Raza", doctorId: "doc-05", doctorName: "Dr. Omar Farooq",
    type: "mri", title: "Brain MRI — Migraine", date: "2026-08-02", description: "MRI brain; no significant abnormality.", attachment: "", status: "available" },
  { id: "rec-4005", patientId: "u-1005", patientName: "Maria Saeed", doctorId: "doc-12", doctorName: "Dr. Zainab Tariq",
    type: "doctor-notes", title: "Therapy session notes", date: "2026-08-03", description: "Session 4 — anxiety management plan.", attachment: "", status: "available" },
  { id: "rec-4006", patientId: "u-1007", patientName: "Sara Malik", doctorId: "doc-04", doctorName: "Dr. Fatima Hassan",
    type: "ultrasound", title: "Abdominal Ultrasound", date: "2026-07-25", description: "Abdomen ultrasound — unremarkable.", attachment: "", status: "available" },
  { id: "rec-4007", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-09", doctorName: "Dr. Talha Sheikh",
    type: "lab-report", title: "HbA1c Test", date: "2026-06-20", description: "Glycated hemoglobin screening.", attachment: "", status: "available" },
];

export const reports = [
  { id: "rep-5001", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    test: "Lipid Profile", lab: "Nova Diagnostic Lab", date: "2026-08-01",
    result: "Cholesterol 198 mg/dL, LDL 118 mg/dL, HDL 52 mg/dL, Triglycerides 140 mg/dL",
    referenceRange: "Total <200, LDL <100, HDL >40, TG <150", status: "normal", attachment: "", notes: "Borderline LDL — diet advised." },
  { id: "rep-5002", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-07", doctorName: "Dr. Bilal Ahmed",
    test: "Complete Blood Count (CBC)", lab: "City Lab", date: "2026-07-15",
    result: "Hb 12.8 g/dL, WBC 7.2 x10^9/L, Platelets 260 x10^9/L",
    referenceRange: "Hb 12-16, WBC 4-11, PLT 150-450", status: "normal", attachment: "", notes: "" },
  { id: "rep-5003", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-09", doctorName: "Dr. Talha Sheikh",
    test: "HbA1c", lab: "MediNova Lab", date: "2026-06-20",
    result: "5.6%", referenceRange: "<5.7% normal, 5.7-6.4 prediabetes", status: "normal", attachment: "", notes: "Within normal range." },
  { id: "rep-5004", patientId: "u-1004", patientName: "Hassan Raza", doctorId: "doc-05", doctorName: "Dr. Omar Farooq",
    test: "MRI Brain Report", lab: "Scan Center", date: "2026-08-02",
    result: "No acute intracranial abnormality detected.",
    referenceRange: "Radiologist assessment", status: "normal", attachment: "", notes: "" },
  { id: "rep-5005", patientId: "u-1007", patientName: "Sara Malik", doctorId: "doc-04", doctorName: "Dr. Fatima Hassan",
    test: "Serum Ferritin", lab: "City Lab", date: "2026-07-20",
    result: "9 ng/mL", referenceRange: "12-300 ng/mL", status: "abnormal", attachment: "", notes: "Iron deficiency — supplement advised." },
  { id: "rep-5006", patientId: "u-1001", patientName: "Ayesha Khan", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    test: "ECG", lab: "MediNova Heart Institute", date: "2026-08-01",
    result: "Normal sinus rhythm, rate 72 bpm.",
    referenceRange: "Cardiologist interpretation", status: "normal", attachment: "", notes: "" },
];

export const recordTypes = [
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

export default { records, reports, recordTypes };
