/**
 * MediNova — Admin panel routes.
 */

import * as Router from "../router/Router.js";
import { h } from "../utils/html.js";
import { route as dashboard } from "../views/admin/dashboard.js";
import { route as analytics } from "../views/admin/analytics.js";
import { route as errorConsole } from "../views/admin/error-console.js";
import { route as users } from "../views/admin/users.js";
import { route as doctors } from "../views/admin/doctors.js";
import { route as medicines } from "../views/admin/medicines.js";
import { route as categories } from "../views/admin/categories.js";
import { route as inventory } from "../views/admin/inventory.js";
import { route as appointments } from "../views/admin/appointments.js";
import { route as prescriptions } from "../views/admin/prescriptions.js";
import { route as orders } from "../views/admin/orders.js";
import { route as payments } from "../views/admin/payments.js";
import { route as tickets } from "../views/admin/tickets.js";
import { route as cms } from "../views/admin/cms.js";
import { route as logs } from "../views/admin/logs.js";
import { route as security } from "../views/admin/security.js";
import { route as settings } from "../views/admin/settings.js";

const redirect = (to) => ({
  path: "/admin",
  title: "Admin",
  layout: "admin",
  auth: true,
  roles: ["admin", "super_admin"],
  view: () => { Router.replace(to); return h("div", {}); },
});

export function registerAdminRoutes() {
  Router.registerMany([
    redirect("/admin/dashboard"),
    dashboard, analytics, errorConsole,
    users, doctors, medicines, categories, inventory,
    appointments, prescriptions, orders, payments, tickets,
    cms, logs, security, settings,
  ]);
}

export default { registerAdminRoutes };
