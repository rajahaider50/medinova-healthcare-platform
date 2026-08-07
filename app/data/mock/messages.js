/**
 * MediNova — Mock: messages & conversations.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const conversations = [
  {
    id: "conv-01", patientId: "u-1001", doctorId: "doc-01", doctorName: "Dr. Salman Raza",
    doctorAvatar: "", lastMessage: "Please bring your previous ECG report.", lastTime: "2026-08-06T18:00:00.000Z",
    unread: 1, participants: ["u-1001", "doc-01"],
  },
  {
    id: "conv-02", patientId: "u-1001", doctorId: "doc-02", doctorName: "Dr. Ayesha Malik",
    doctorAvatar: "", lastMessage: "Use the gel only at night.", lastTime: "2026-08-05T11:40:00.000Z",
    unread: 0, participants: ["u-1001", "doc-02"],
  },
  {
    id: "conv-03", patientId: "u-1001", doctorId: "doc-07", doctorName: "Dr. Bilal Ahmed",
    doctorAvatar: "", lastMessage: "Feeling better? Let me know if fever returns.", lastTime: "2026-07-16T09:00:00.000Z",
    unread: 0, participants: ["u-1001", "doc-07"],
  },
];

export const messages = [
  { id: "msg-7001", conversationId: "conv-01", senderId: "doc-01", senderName: "Dr. Salman Raza", text: "Hello Ayesha, I reviewed your records.", time: "2026-08-06T17:45:00.000Z", read: true, attachments: [] },
  { id: "msg-7002", conversationId: "conv-01", senderId: "u-1001", senderName: "Ayesha Khan", text: "Thank you doctor.", time: "2026-08-06T17:50:00.000Z", read: true, attachments: [] },
  { id: "msg-7003", conversationId: "conv-01", senderId: "doc-01", senderName: "Dr. Salman Raza", text: "Please bring your previous ECG report.", time: "2026-08-06T18:00:00.000Z", read: false, attachments: [] },
  { id: "msg-7004", conversationId: "conv-02", senderId: "doc-02", senderName: "Dr. Ayesha Malik", text: "Use the gel only at night on clean skin.", time: "2026-08-05T11:35:00.000Z", read: true, attachments: [] },
  { id: "msg-7005", conversationId: "conv-02", senderId: "u-1001", senderName: "Ayesha Khan", text: "Got it. Thanks!", time: "2026-08-05T11:38:00.000Z", read: true, attachments: [] },
  { id: "msg-7006", conversationId: "conv-03", senderId: "doc-07", senderName: "Dr. Bilal Ahmed", text: "Feeling better? Let me know if fever returns.", time: "2026-07-16T09:00:00.000Z", read: true, attachments: [] },
];

export default { conversations, messages };
