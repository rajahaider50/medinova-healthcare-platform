/**
 * MediNova — User panel routes.
 */

import * as Router from "../router/Router.js";
import { route as dashboard } from "../views/user/dashboard.js";
import { route as doctors } from "../views/user/doctors.js";
import { route as doctorDetail } from "../views/user/doctor-detail.js";
import { route as appointments } from "../views/user/appointments.js";
import { route as appointmentDetail } from "../views/user/appointment-detail.js";
import { route as bookAppointment } from "../views/user/book-appointment.js";
import { route as medicines } from "../views/user/medicines.js";
import { route as medicineDetail } from "../views/user/medicine-detail.js";
import { route as prescriptions } from "../views/user/prescriptions.js";
import { route as prescriptionDetail } from "../views/user/prescription-detail.js";
import { route as records } from "../views/user/records.js";
import { route as reports } from "../views/user/reports.js";
import { route as orders } from "../views/user/orders.js";
import { route as orderDetail } from "../views/user/order-detail.js";
import { route as cart } from "../views/user/cart.js";
import { route as checkout } from "../views/user/checkout.js";
import { route as notifications } from "../views/user/notifications.js";
import { route as messages } from "../views/user/messages.js";
import { route as support } from "../views/user/support.js";
import { route as profile } from "../views/user/profile.js";
import { route as settings } from "../views/user/settings.js";
import { route as more } from "../views/user/more.js";

export function registerUserRoutes() {
  Router.registerMany([
    dashboard, doctors, doctorDetail,
    appointments, appointmentDetail, bookAppointment,
    medicines, medicineDetail,
    prescriptions, prescriptionDetail,
    records, reports,
    orders, orderDetail,
    cart, checkout,
    notifications, messages, support,
    profile, settings, more,
  ]);
}

export default { registerUserRoutes };
