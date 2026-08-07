/**
 * MediNova — Auth routes.
 */

import * as Router from "../router/Router.js";
import { route as login } from "../views/auth/login.js";
import { route as register } from "../views/auth/register.js";
import { route as forgot } from "../views/auth/forgot.js";
import { route as reset } from "../views/auth/reset.js";

export function registerAuthRoutes() {
  Router.registerMany([login, register, forgot, reset]);
}

export default { registerAuthRoutes };
