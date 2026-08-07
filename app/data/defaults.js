/**
 * MediNova — Default content & settings templates.
 * These are editable content templates seeded ONCE (brand, page copy, platform
 * settings). They are NOT business records — no doctors, medicines,
 * appointments or other fake data lives here.
 */

/** Default platform settings (brand, appointments, pharmacy, security). */
export const DEFAULT_SETTINGS = {
  brand: {
    name: "MediNova",
    tagline: "Smart Healthcare. Simple. Secure.",
    fullName: "MediNova Healthcare",
    supportEmail: "support@medinova.app",
    supportPhone: "+92 21 111 000 111",
    address: "MediNova HQ, Karachi, Pakistan",
    logo: "assets/logo/logo-mark.svg",
    accentColor: "#8b5cf6",
    theme: "dark",
    footerText: "MediNova Healthcare. All rights reserved.",
    announcement: "",
  },
  contact: {
    email: "hello@medinova.app",
    phone: "+92 21 111 000 111",
    address: "MediNova HQ, Karachi, Pakistan",
    hours: "Mon – Sat, 9:00 AM – 6:00 PM",
  },
  social: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
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

/** Default user settings template (used when a new user signs up). */
export const DEFAULT_USER_SETTINGS = {
  profile: { name: "", email: "", phone: "", dob: "", gender: "", address: "", city: "", avatar: "" },
  preferences: { language: "en", theme: "dark", emailNotifications: true, pushNotifications: true, smsNotifications: false },
  privacy: { shareHealthData: false, showInDirectory: true },
  security: { twoFactorEnabled: false, lastPasswordChange: null },
};

/** Default page content editable through the admin Page Content Manager. */
export const DEFAULT_PAGES = {
  home: {
    id: "home",
    slug: "/",
    title: "Home",
    badge: "Trusted healthcare platform",
    heading: "Your health, our priority",
    subtitle: "Book appointments, consult verified doctors, and order medicines — all from one secure place.",
    primaryCta: "Find a Doctor",
    primaryCtaLink: "#/doctors",
    secondaryCta: "Order Medicines",
    secondaryCtaLink: "#/medicines",
    featuresTitle: "Why MediNova",
    featuresSubtitle: "Everything you need for better health.",
    doctorsTitle: "Top Doctors",
    testimonialsTitle: "What our patients say",
  },
  features: [
    { icon: "fa-stethoscope", title: "Verified Doctors", text: "Every specialist is vetted and licensed." },
    { icon: "fa-calendar-check", title: "Easy Appointments", text: "Book, reschedule, or cancel in seconds." },
    { icon: "fa-truck-medical", title: "Medicine Delivery", text: "Home delivery of genuine medicines." },
    { icon: "fa-shield-halved", title: "Secure Records", text: "Your medical history stays private." },
    { icon: "fa-video", title: "Online Consultations", text: "Video and chat consultations from home." },
    { icon: "fa-headset", title: "24/7 Support", text: "A support team that's always available." },
  ],
  about: {
    id: "about",
    slug: "/about",
    title: "About MediNova",
    heading: "About MediNova",
    subtitle: "Who we are and what we do.",
    body: "MediNova connects patients with verified doctors and licensed pharmacies through a modern, secure platform designed for accessible, high-quality healthcare.",
    mission: "To make quality healthcare simple, secure, and accessible for everyone.",
    vision: "A healthier world powered by connected, trusted care.",
  },
  contact: {
    id: "contact",
    slug: "/contact",
    title: "Contact Us",
    heading: "Get in touch",
    subtitle: "We'd love to hear from you. Reach out anytime.",
    email: "hello@medinova.app",
    phone: "+92 21 111 000 111",
    address: "MediNova HQ, Karachi, Pakistan",
  },
  support: {
    id: "support",
    slug: "/support",
    title: "Support Center",
    heading: "How can we help?",
    subtitle: "Browse FAQs or create a support ticket.",
  },
  privacy: {
    id: "privacy",
    slug: "/privacy",
    title: "Privacy Policy",
    heading: "Privacy Policy",
    updated: "January 2026",
    body: "Your privacy is important to us. MediNova collects only the information needed to provide healthcare services and never sells your personal or medical data.",
  },
  terms: {
    id: "terms",
    slug: "/terms",
    title: "Terms of Service",
    heading: "Terms of Service",
    updated: "January 2026",
    body: "By using MediNova you agree to use the platform responsibly and lawfully. Services are provided for informational and scheduling purposes and do not replace professional medical advice.",
  },
  footer: {
    id: "footer",
    slug: "/footer",
    title: "Footer",
    copyright: "MediNova Healthcare. All rights reserved.",
    aboutText: "Smart healthcare. Simple. Secure.",
  },
};

/** Static content fields per page (used by the admin Page Content Manager). */
export const PAGE_FIELD_SCHEMAS = {
  home: [
    { key: "badge", label: "Hero badge", type: "text" },
    { key: "heading", label: "Hero heading", type: "text" },
    { key: "subtitle", label: "Hero subtitle", type: "textarea" },
    { key: "primaryCta", label: "Primary button text", type: "text" },
    { key: "secondaryCta", label: "Secondary button text", type: "text" },
    { key: "featuresTitle", label: "Features section title", type: "text" },
    { key: "doctorsTitle", label: "Doctors section title", type: "text" },
    { key: "testimonialsTitle", label: "Testimonials section title", type: "text" },
  ],
  about: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "body", label: "Body text", type: "textarea" },
    { key: "mission", label: "Mission", type: "textarea" },
    { key: "vision", label: "Vision", type: "textarea" },
  ],
  contact: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "address", label: "Address", type: "textarea" },
  ],
  support: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
  ],
  privacy: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "updated", label: "Last updated", type: "text" },
    { key: "body", label: "Body text", type: "textarea" },
  ],
  terms: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "updated", label: "Last updated", type: "text" },
    { key: "body", label: "Body text", type: "textarea" },
  ],
  footer: [
    { key: "copyright", label: "Copyright text", type: "text" },
    { key: "aboutText", label: "About text", type: "textarea" },
  ],
};

export default { DEFAULT_SETTINGS, DEFAULT_USER_SETTINGS, DEFAULT_PAGES, PAGE_FIELD_SCHEMAS };
