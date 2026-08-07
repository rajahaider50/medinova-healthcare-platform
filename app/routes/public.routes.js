/**
 * MediNova — Public routes.
 */

import * as Router from "../router/Router.js";
import { route as landing } from "../views/landing.js";
import { route as about } from "../views/public/about.js";
import { route as contact } from "../views/public/contact.js";
import { route as privacy } from "../views/public/privacy.js";
import { route as terms } from "../views/public/terms.js";

export function registerPublicRoutes() {
  Router.registerMany([landing, about, contact, privacy, terms]);
}

export default { registerPublicRoutes };
