/**
 * MediNova — Mock: banners, testimonials & CMS content.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const banners = [
  { id: "bnr-01", title: "Free health checkup", subtitle: "Book your free basic health checkup with top doctors this month.", image: "", link: "/appointments/book", active: true, sort: 1 },
  { id: "bnr-02", title: "Flat 10% off medicines", subtitle: "Use code NOVA10 on your first pharmacy order.", image: "", link: "/medicines", active: true, sort: 2 },
  { id: "bnr-03", title: "Online consultation", subtitle: "Talk to a specialist from home, anywhere in Pakistan.", image: "", link: "/doctors", active: true, sort: 3 },
];

export const testimonials = [
  { id: "tst-01", name: "Ahmed Raza", role: "Patient", text: "MediNova made booking appointments and ordering medicines unbelievably easy.", avatar: "" },
  { id: "tst-02", name: "Sana Javed", role: "Patient", text: "The online consultation feature is a lifesaver for busy parents.", avatar: "" },
  { id: "tst-03", name: "Usman Tariq", role: "Patient", text: "Clean interface, great doctors, and timely medicine delivery.", avatar: "" },
];

export const cms = {
  hero: {
    badge: "Trusted healthcare platform",
    title: "Your health, our priority",
    subtitle: "Smart healthcare. Simple. Secure. Book appointments, consult top doctors, and order medicines — all from one place.",
  },
  about: {
    title: "About MediNova",
    text: "MediNova connects patients with verified doctors and licensed pharmacies through a modern, secure platform designed for Pakistan's healthcare needs.",
  },
  features: [
    { icon: "fa-stethoscope", title: "Verified Doctors", text: "Every specialist is vetted and licensed." },
    { icon: "fa-calendar-check", title: "Easy Appointments", text: "Book, reschedule, or cancel in seconds." },
    { icon: "fa-truck-medical", title: "Medicine Delivery", text: "Home delivery of genuine medicines." },
    { icon: "fa-shield-halved", title: "Secure Records", text: "Your medical history stays private." },
    { icon: "fa-video", title: "Online Consultations", text: "Video and chat consultations from home." },
    { icon: "fa-headset", title: "24/7 Support", text: "A support team that's always available." },
  ],
  stats: [
    { label: "Happy Patients", value: "50,000+", icon: "fa-user-group" },
    { label: "Expert Doctors", value: "300+", icon: "fa-user-doctor" },
    { label: "Medicines Delivered", value: "200,000+", icon: "fa-pills" },
    { label: "Cities Covered", value: "120+", icon: "fa-city" },
  ],
  steps: [
    { icon: "fa-user-plus", title: "Create Account", text: "Sign up in under a minute." },
    { icon: "fa-calendar-check", title: "Book Appointment", text: "Pick a doctor and a time slot." },
    { icon: "fa-user-doctor", title: "Get Treated", text: "Consult online or in-person." },
    { icon: "fa-truck-medical", title: "Order Medicines", text: "Get them delivered to your door." },
  ],
};

export const pages = [
  { id: "home", title: "Home", slug: "home" },
  { id: "about", title: "About", slug: "about" },
  { id: "contact", title: "Contact", slug: "contact" },
  { id: "privacy", title: "Privacy Policy", slug: "privacy" },
  { id: "terms", title: "Terms of Service", slug: "terms" },
];

export default { banners, testimonials, cms, pages };
