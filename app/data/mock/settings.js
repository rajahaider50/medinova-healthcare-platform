/**
 * MediNova — Mock: default platform settings & user settings templates.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const platformSettings = {
  brand: {
    name: "MediNova",
    tagline: "Smart Healthcare. Simple. Secure.",
    fullName: "MediNova Healthcare",
    supportEmail: "support@medinova.app",
    supportPhone: "+92 21 111 000 111",
    address: "MediNova HQ, Karachi, Pakistan",
  },
  appointments: {
    enableOnline: true,
    enableInPerson: true,
    slotDuration: 30,
    workingDays: [1, 2, 3, 4, 5, 6],
    workingStart: "09:00",
    workingEnd: "18:00",
  },
  pharmacy: {
    enablePrescriptionUpload: true,
    deliveryFee: 80,
    freeDeliveryAbove: 1500,
    enableCoupons: true,
  },
  security: {
    requireEmailVerification: true,
    sessionTimeoutMin: 60,
    maxLoginAttempts: 5,
    enable2fa: false,
  },
  maintenance: {
    enabled: false,
    message: "Scheduled maintenance. We'll be back soon.",
  },
};

export const userSettingsTemplate = {
  profile: { name: "", email: "", phone: "", dob: "", gender: "", address: "", city: "", avatar: "" },
  preferences: { language: "en", theme: "dark", emailNotifications: true, pushNotifications: true, smsNotifications: false },
  privacy: { shareHealthData: false, showInDirectory: true },
  security: { twoFactorEnabled: false, lastPasswordChange: null },
};

export default { platformSettings, userSettingsTemplate };
