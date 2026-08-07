/**
 * MediNova — Mock data barrel.
 * Single import point for all demo data modules.
 */

import { categories } from "./categories.js";
import { doctors, specialties, timeSlots } from "./doctors.js";
import { medicines } from "./medicines.js";
import { users } from "./users.js";
import { appointments } from "./appointments.js";
import { prescriptions } from "./prescriptions.js";
import { records, reports, recordTypes } from "./records.js";
import { orders, coupons, orderStatusFlow } from "./orders.js";
import { notifications, notificationTypes } from "./notifications.js";
import { conversations, messages } from "./messages.js";
import { tickets, faqs, ticketCategories, ticketStatuses } from "./tickets.js";
import { reviews, analytics } from "./reviews.js";
import { banners, testimonials, cms, pages } from "./cms.js";
import { platformSettings, userSettingsTemplate } from "./settings.js";

export {
  categories,
  doctors,
  specialties,
  timeSlots,
  medicines,
  users,
  appointments,
  prescriptions,
  records,
  reports,
  recordTypes,
  orders,
  coupons,
  orderStatusFlow,
  notifications,
  notificationTypes,
  conversations,
  messages,
  tickets,
  faqs,
  ticketCategories,
  ticketStatuses,
  reviews,
  analytics,
  banners,
  testimonials,
  cms,
  pages,
  platformSettings,
  userSettingsTemplate,
};

export const allMockData = {
  categories,
  doctors,
  medicines,
  users,
  appointments,
  prescriptions,
  records,
  reports,
  orders,
  coupons,
  notifications,
  conversations,
  messages,
  tickets,
  faqs,
  reviews,
  banners,
  cms,
  pages,
  analytics,
  platformSettings,
};

export default allMockData;
