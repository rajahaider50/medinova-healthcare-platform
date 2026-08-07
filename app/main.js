/**
 * MediNova — Application entry.
 * Boot sequence: components → layouts → routes → seed → router.
 */

import "./components/index.js";

import * as Router from "./router/Router.js";
import * as Store from "./state/store.js";
import * as ErrorManager from "./errors/ErrorManager.js";
import * as ErrorStore from "./errors/ErrorStore.js";
import * as Toast from "./services/ToastService.js";
import { ThemeService } from "./services/ThemeService.js";
import { seedDatabase, needsSeeding } from "./data/seed.js";
import { registerLayouts } from "./layouts/index.js";
import { registerAuthRoutes } from "./routes/auth.routes.js";
import { registerPublicRoutes } from "./routes/public.routes.js";
import { registerUserRoutes } from "./routes/user.routes.js";
import { registerAdminRoutes } from "./routes/admin.routes.js";
import { currentUser } from "./services/AuthService.js";
import * as CartService from "./services/CartService.js";

const bootScreen = document.getElementById("boot-screen");
const appShell = document.getElementById("app-shell");

function boot(ms = 900) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (bootScreen) {
        bootScreen.classList.add("fade-out");
        bootScreen.addEventListener("transitionend", () => bootScreen.remove(), { once: true });
        setTimeout(() => bootScreen.remove(), 500);
      }
      resolve();
    }, ms);
  });
}

function syncErrorCount() {
  Store.set("errors", ErrorStore.counts().total);
}

function initErrorSystem() {
  ErrorManager.init();
  syncErrorCount();
  ErrorManager.subscribe(syncErrorCount);

  ErrorManager.setToastRenderer((t) => {
    Toast.show({
      type: t.level === "critical" ? "error" : t.level === "warning" ? "warning" : "info",
      title: t.title,
      msg: t.message,
      duration: t.duration,
    });
  });
}

function initSession() {
  const user = currentUser();
  Store.setUser(user);
  Store.set("cartCount", CartService.count());
}

async function start() {
  initErrorSystem();
  ThemeService.init();

  if (needsSeeding()) {
    try {
      seedDatabase();
    } catch (e) {
      ErrorManager.report(e, { module: "seed", type: "db", level: "critical" });
    }
  }

  initSession();

  registerLayouts();
  registerAuthRoutes();
  registerPublicRoutes();
  registerUserRoutes();
  registerAdminRoutes();

  Router.setRoot(document.getElementById("app-shell"));
  Router.init();
  window.scrollTo(0, 0);
}

await boot();
await start();
