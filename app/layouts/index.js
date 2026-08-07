/**
 * MediNova — Layouts registry.
 * Registers all layout renderers with the router.
 */

import * as Router from "../router/Router.js";
import { userLayout } from "./user-layout.js";
import { adminLayout, initAdminLayout } from "./admin-layout.js";
import { authLayout } from "./auth-layout.js";
import { publicLayout } from "./public-layout.js";
import { initSidebarSync } from "./sidebar.js";

/** Register all layouts. Call before Router.init(). */
export function registerLayouts() {
  Router.setLayouts({
    auth: authLayout,
    user: userLayout,
    admin: adminLayout,
    public: publicLayout,
  });
  initSidebarSync();
  initAdminLayout();
}

export default { registerLayouts };
