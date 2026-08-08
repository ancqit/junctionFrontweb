import * as s from "@angular/core";
import { InjectionToken as u, inject as h, DOCUMENT as p } from "@angular/core";
var f = null;
function c() { return f; }
function I(t) { f ??= t; }
var d = class {
}, v = (() => { class t {
    historyGo(e) { throw new Error(""); }
    static \u0275fac = function (o) { return new (o || t); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: t, factory: () => h(g), providedIn: "platform" });
} return t; })(), _ = new u(""), g = (() => { class t extends v {
    _location;
    _history;
    _doc = h(p);
    constructor() { super(), this._location = window.location, this._history = window.history; }
    getBaseHrefFromDOM() { return c().getBaseHref(this._doc); }
    onPopState(e) { let o = c().getGlobalEventTarget(this._doc, "window"); return o.addEventListener("popstate", e, !1), () => o.removeEventListener("popstate", e); }
    onHashChange(e) { let o = c().getGlobalEventTarget(this._doc, "window"); return o.addEventListener("hashchange", e, !1), () => o.removeEventListener("hashchange", e); }
    get href() { return this._location.href; }
    get protocol() { return this._location.protocol; }
    get hostname() { return this._location.hostname; }
    get port() { return this._location.port; }
    get pathname() { return this._location.pathname; }
    get search() { return this._location.search; }
    get hash() { return this._location.hash; }
    set pathname(e) { this._location.pathname = e; }
    pushState(e, o, n) { this._history.pushState(e, o, n); }
    replaceState(e, o, n) { this._history.replaceState(e, o, n); }
    forward() { this._history.forward(); }
    back() { this._history.back(); }
    historyGo(e = 0) { this._history.go(e); }
    getState() { return this._history.state; }
    static \u0275fac = function (o) { return new (o || t); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: t, factory: () => new t, providedIn: "platform" });
} return t; })();
import * as i from "@angular/core";
import "@angular/core";
function E(t, a) { a = encodeURIComponent(a); for (let e of t.split(";")) {
    let o = e.indexOf("="), [n, l] = o == -1 ? [e, ""] : [e.slice(0, o), e.slice(o + 1)];
    if (n.trim() !== a)
        continue;
    let r = l;
    try {
        r = decodeURIComponent(l);
    }
    catch { }
    return r.length > 1 && r[0] === '"' && r[r.length - 1] === '"' && (r = r.slice(1, -1)), r;
} return null; }
var y = (() => { class t {
    build() { return new XMLHttpRequest; }
    static \u0275fac = function (o) { return new (o || t); };
    static \u0275prov = i.\u0275\u0275defineService({ token: t, factory: t.\u0275fac });
} return t; })(), L = (() => { class t {
    static \u0275fac = function (o) { return new (o || t); };
    static \u0275prov = i.\u0275\u0275defineInjectable({ token: t, factory: function (o) { let n = null; return o ? n = new (o || t) : n = i.\u0275\u0275inject(y), n; }, providedIn: "root" });
} return t; })();
export { c as a, I as b, d as c, v as d, _ as e, g as f, E as g, L as h };
/*! Bundled license information:

@angular/common/fesm2022/_platform_location-chunk.mjs:
@angular/common/fesm2022/_xhr-chunk.mjs:
  (**
   * @license Angular v22.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
