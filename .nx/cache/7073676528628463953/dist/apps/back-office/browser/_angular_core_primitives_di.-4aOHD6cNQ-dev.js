import { NOT_FOUND, NotFoundError, getCurrentInjector, inject, isNotFound, setCurrentInjector } from "@nf-internal/chunk-SPLD4HVS";
import "@nf-internal/chunk-7IBJPHM5";
// node_modules/@angular/core/fesm2022/primitives-di.mjs
function defineInjectable(opts) {
    return {
        token: opts.token,
        providedIn: opts.providedIn || null,
        factory: opts.factory,
        value: void 0
    };
}
function registerInjectable(ctor, declaration) {
    ctor.\u0275prov = declaration;
    return ctor;
}
export { NOT_FOUND, NotFoundError, defineInjectable, getCurrentInjector, inject, isNotFound, registerInjectable, setCurrentInjector };
/*! Bundled license information:

@angular/core/fesm2022/primitives-di.mjs:
  (**
   * @license Angular v22.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
