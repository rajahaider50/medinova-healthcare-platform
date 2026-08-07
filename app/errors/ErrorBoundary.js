/**
 * MediNova — Error Boundary.
 * Protects isolated sections: on failure renders a friendly fallback with RETRY.
 */

import { h } from "../utils/html.js";
import * as ErrorManager from "./ErrorManager.js";

/**
 * Run a render function inside an error boundary.
 * @param {Function} render returns a Node
 * @param {object} opts { container, retry, fallback }
 * @returns {Node}
 */
export function withBoundary(render, opts = {}) {
  const container = h("div", { class: "error-boundary-fallback", hidden: true });

  function renderBoundary() {
    container.hidden = false;
    container.replaceChildren();
    container.appendChild(
      h("div", { class: "error-state anim-fade-in" }, [
        h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-triangle-exclamation" })),
        h("h3", {}, opts.title || "This section couldn't load"),
        h("p", { class: "text-secondary" }, opts.message || "An unexpected error occurred."),
        h("button", {
          class: "btn btn-secondary mt-3",
          onclick: async () => {
            container.replaceChildren(h("div", { class: "spinner-wrap" }, h("div", { class: "spinner" })));
            try {
              const node = await Promise.resolve(render());
              container.replaceChildren(node);
            } catch (e) {
              ErrorManager.report(e, { module: opts.module || "boundary", retryFn: renderBoundary });
              container.replaceChildren(
                h("div", { class: "error-state" }, [
                  h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-circle-exclamation" })),
                  h("h3", {}, "Still not working"),
                  h("button", { class: "btn btn-secondary", onclick: renderBoundary }, "Try again"),
                ])
              );
            }
          },
        }, h("i", { class: "fa-solid fa-rotate" }), " Retry"),
      ])
    );
  }

  // initial render
  (async () => {
    try {
      const node = await Promise.resolve(render());
      container.hidden = false;
      container.replaceChildren(node);
    } catch (e) {
      ErrorManager.report(e, { module: opts.module || "boundary", retryFn: renderBoundary });
      renderBoundary();
    }
  })();

  return container;
}

/**
 * Class-based boundary for web components or page sections.
 * Usage: const sec = new SectionBoundary({ module: 'x' }); sec.render(renderFn);
 */
export class SectionBoundary {
  constructor(opts = {}) {
    this.opts = opts;
    this.container = h("div");
  }

  render(renderFn) {
    this.container.replaceChildren();
    try {
      this.container.appendChild(renderFn());
    } catch (e) {
      ErrorManager.report(e, { module: this.opts.module || "section", retryFn: () => this.render(renderFn) });
      this.container.appendChild(this.fallback());
    }
    return this.container;
  }

  async renderAsync(renderFn) {
    this.container.replaceChildren(h("div", { class: "spinner-wrap" }, h("div", { class: "spinner" })));
    try {
      const node = await Promise.resolve(renderFn());
      this.container.replaceChildren(node);
    } catch (e) {
      ErrorManager.report(e, { module: this.opts.module || "section", retryFn: () => this.renderAsync(renderFn) });
      this.container.appendChild(this.fallback());
    }
    return this.container;
  }

  fallback() {
    return h("div", { class: "error-state anim-fade-in" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-triangle-exclamation" })),
      h("h3", {}, this.opts.title || "This section couldn't load"),
      h("p", { class: "text-secondary" }, this.opts.message || "An unexpected error occurred."),
      h("button", {
        class: "btn btn-secondary mt-3",
        onclick: () => this.renderAsync(this.opts.render),
      }, h("i", { class: "fa-solid fa-rotate" }), " Retry"),
    ]);
  }
}

export default { withBoundary, SectionBoundary };
