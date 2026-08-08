import { d as De, g as Oe, h as _e } from "@nf-internal/chunk-2ZBMSWS6";
import { a as G, d as ae } from "@nf-internal/chunk-PZNONLPT";
import * as h from "@angular/core";
import { \u0275RuntimeError as O, InjectionToken as L, inject as w, NgZone as Dt, DestroyRef as Ot, \u0275formatRuntimeError as kr, EnvironmentInjector as _t, runInInjectionContext as ye, DOCUMENT as Be, PendingTasks as Xe, untracked as Ae, CSP_NONCE as At, \u0275TracingService as kt, makeEnvironmentProviders as It } from "@angular/core";
import { finalize as ze, concatMap as St, filter as Ft, map as q, switchMap as Ut } from "rxjs/operators";
import { Observable as ge, of as Je, from as Ct } from "rxjs";
var k = class e {
    headers;
    normalizedNames = new Map;
    lazyInit;
    lazyUpdate = null;
    constructor(r) {
        r ? typeof r == "string" ? this.lazyInit = () => {
            this.headers = new Map, r.split(`
`).forEach(t => { let n = t.indexOf(":"); if (n > 0) {
                let o = t.slice(0, n), s = t.slice(n + 1).trim();
                this.addHeaderEntry(o, s);
            } });
        } : typeof Headers < "u" && r instanceof Headers ? (this.headers = new Map, r.forEach((t, n) => { this.addHeaderEntry(n, t); })) : this.lazyInit = () => { this.headers = new Map, Object.entries(r).forEach(([t, n]) => { this.setHeaderEntries(t, n); }); } : this.headers = new Map;
    }
    has(r) { return this.init(), this.headers.has(r.toLowerCase()); }
    get(r) { this.init(); let t = this.headers.get(r.toLowerCase()); return t && t.length > 0 ? t[0] : null; }
    keys() { return this.init(), Array.from(this.normalizedNames.values()); }
    getAll(r) { return this.init(), this.headers.get(r.toLowerCase()) || null; }
    append(r, t) { return this.clone({ name: r, value: t, op: "a" }); }
    set(r, t) { return this.clone({ name: r, value: t, op: "s" }); }
    delete(r, t) { return this.clone({ name: r, value: t, op: "d" }); }
    maybeSetNormalizedName(r, t) { this.normalizedNames.has(t) || this.normalizedNames.set(t, r); }
    init() { this.lazyInit && (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(r => this.applyUpdate(r)), this.lazyUpdate = null)); }
    copyFrom(r) { r.init(); for (let [t, n] of r.headers.entries())
        this.headers.set(t, n), this.normalizedNames.set(t, r.normalizedNames.get(t)); }
    clone(r) { let t = new e; return t.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this, t.lazyUpdate = (this.lazyUpdate || []).concat([r]), t; }
    applyUpdate(r) { let t = r.name.toLowerCase(); switch (r.op) {
        case "a":
        case "s":
            let n = r.value;
            if (typeof n == "string" && (n = [n]), n.length === 0)
                return;
            this.maybeSetNormalizedName(r.name, t);
            let o = r.op === "a" ? (this.headers.get(t) || []).slice() : [];
            o.push(...n), this.headers.set(t, o);
            break;
        case "d":
            let s = r.value;
            if (s === void 0)
                this.headers.delete(t), this.normalizedNames.delete(t);
            else {
                let i = Array.isArray(s) ? s : [s], c = this.headers.get(t);
                if (!c)
                    return;
                c = c.filter(a => i.indexOf(a) === -1), c.length === 0 ? (this.headers.delete(t), this.normalizedNames.delete(t)) : this.headers.set(t, c);
            }
            break;
    } }
    addHeaderEntry(r, t) { let n = r.toLowerCase(); this.maybeSetNormalizedName(r, n), this.headers.has(n) ? this.headers.get(n).push(t) : this.headers.set(n, [t]); }
    setHeaderEntries(r, t) { let n = (Array.isArray(t) ? t : [t]).map(s => s.toString()), o = r.toLowerCase(); this.headers.set(o, n), this.maybeSetNormalizedName(r, o); }
    forEach(r) { this.init(), Array.from(this.normalizedNames.keys()).forEach(t => r(this.normalizedNames.get(t), this.headers.get(t))); }
};
var le = class {
    defaultValue;
    constructor(r) { this.defaultValue = r; }
}, H = class {
    map = new Map;
    set(r, t) { return this.map.set(r, t), this; }
    get(r) { return this.map.has(r) || this.map.set(r, r.defaultValue()), this.map.get(r); }
    delete(r) { return this.map.delete(r), this; }
    has(r) { return this.map.has(r); }
    keys() { return this.map.keys(); }
}, ee = class {
    encodeKey(r) { return ke(r); }
    encodeValue(r) { return ke(r); }
    decodeKey(r) { return decodeURIComponent(r); }
    decodeValue(r) { return decodeURIComponent(r); }
};
function Lt(e, r) { let t = new Map; return e.length > 0 && e.replace(/^\?/, "").split("&").forEach(o => { let s = o.indexOf("="), [i, c] = s == -1 ? [r.decodeKey(o), ""] : [r.decodeKey(o.slice(0, s)), r.decodeValue(o.slice(s + 1))], a = t.get(i) || []; a.push(c), t.set(i, a); }), t; }
var jt = /%(\d[a-f0-9])/gi, Bt = { 40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/" };
function ke(e) { return encodeURIComponent(e).replace(jt, (r, t) => Bt[t] ?? r); }
function Q(e) { return `${e}`; }
var F = class e {
    map;
    encoder;
    updates = null;
    cloneFrom = null;
    constructor(r = {}) { if (this.encoder = r.encoder || new ee, r.fromString) {
        if (r.fromObject)
            throw new O(2805, !1);
        this.map = Lt(r.fromString, this.encoder);
    }
    else
        r.fromObject ? (this.map = new Map, Object.keys(r.fromObject).forEach(t => { let n = r.fromObject[t], o = Array.isArray(n) ? n.map(Q) : [Q(n)]; this.map.set(t, o); })) : this.map = null; }
    has(r) { return this.init(), this.map.has(r); }
    get(r) { this.init(); let t = this.map.get(r); return t ? t[0] : null; }
    getAll(r) { return this.init(), this.map.get(r) || null; }
    keys() { return this.init(), Array.from(this.map.keys()); }
    append(r, t) { return this.clone({ param: r, value: t, op: "a" }); }
    appendAll(r) { let t = []; return Object.keys(r).forEach(n => { let o = r[n]; Array.isArray(o) ? o.forEach(s => { t.push({ param: n, value: s, op: "a" }); }) : t.push({ param: n, value: o, op: "a" }); }), this.clone(t); }
    set(r, t) { return this.clone({ param: r, value: t, op: "s" }); }
    delete(r, t) { return this.clone({ param: r, value: t, op: "d" }); }
    toString() { return this.init(), this.keys().map(r => { let t = this.encoder.encodeKey(r); return this.map.get(r).map(n => t + "=" + this.encoder.encodeValue(n)).join("&"); }).filter(r => r !== "").join("&"); }
    clone(r) { let t = new e({ encoder: this.encoder }); return t.cloneFrom = this.cloneFrom || this, t.updates = (this.updates || []).concat(r), t; }
    init() { if (this.map === null && (this.map = new Map), this.cloneFrom !== null) {
        this.cloneFrom.init();
        for (let [r, t] of this.cloneFrom.map.entries())
            this.map.set(r, t);
        this.updates.forEach(r => { switch (r.op) {
            case "a":
            case "s":
                let t = r.op === "a" ? (this.map.get(r.param) || []).slice() : [];
                t.push(Q(r.value)), this.map.set(r.param, t);
                break;
            case "d": if (r.value !== void 0) {
                let n = (this.map.get(r.param) || []).slice(), o = n.indexOf(Q(r.value));
                o !== -1 && n.splice(o, 1), n.length > 0 ? this.map.set(r.param, n) : this.map.delete(r.param);
            }
            else {
                this.map.delete(r.param);
                break;
            }
        } }), this.cloneFrom = this.updates = null;
    } }
};
function Xt(e) { switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP": return !1;
    default: return !0;
} }
function Ie(e) { return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer; }
function Se(e) { return typeof Blob < "u" && e instanceof Blob; }
function Fe(e) { return typeof FormData < "u" && e instanceof FormData; }
function zt(e) { return typeof URLSearchParams < "u" && e instanceof URLSearchParams; }
var W = "Content-Type", te = "Accept", Ve = "text/plain", $e = "application/json", Ge = `${$e}, ${Ve}, */*`, X = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    reportUploadProgress = !1;
    reportDownloadProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    referrer;
    integrity;
    referrerPolicy;
    responseType = "json";
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(r, t, n, o) { this.url = t, this.method = r.toUpperCase(); let s; if (Xt(this.method) || o ? (this.body = n !== void 0 ? n : null, s = o) : s = n, s) {
        if (this.reportProgress = !!s.reportProgress, this.reportUploadProgress = !!s.reportUploadProgress, this.reportDownloadProgress = !!s.reportDownloadProgress, this.withCredentials = !!s.withCredentials, this.keepalive = !!s.keepalive, s.responseType && (this.responseType = s.responseType), s.headers && (this.headers = s.headers), s.context && (this.context = s.context), s.params && (this.params = s.params), s.priority && (this.priority = s.priority), s.cache && (this.cache = s.cache), s.credentials && (this.credentials = s.credentials), typeof s.timeout == "number") {
            if (s.timeout < 1 || !Number.isInteger(s.timeout))
                throw new O(2822, "");
            this.timeout = s.timeout;
        }
        s.mode && (this.mode = s.mode), s.redirect && (this.redirect = s.redirect), s.integrity && (this.integrity = s.integrity), s.referrer !== void 0 && (this.referrer = s.referrer), s.referrerPolicy && (this.referrerPolicy = s.referrerPolicy), this.transferCache = s.transferCache;
    } if (this.headers ??= new k, this.context ??= new H, !this.params)
        this.params = new F, this.urlWithParams = t;
    else {
        let i = this.params.toString();
        if (i.length === 0)
            this.urlWithParams = t;
        else {
            let c = t, a = "", d = t.indexOf("#");
            d !== -1 && (a = t.substring(d), c = t.substring(0, d));
            let u = c.indexOf("?"), f = u === -1 ? "?" : u < c.length - 1 ? "&" : "";
            this.urlWithParams = c + f + i + a;
        }
    } }
    serializeBody() { return this.body === null ? null : typeof this.body == "string" || Ie(this.body) || Se(this.body) || Fe(this.body) || zt(this.body) ? this.body : this.body instanceof F ? this.body.toString() : typeof this.body == "object" || typeof this.body == "boolean" || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString(); }
    detectContentTypeHeader() { return this.body === null || Fe(this.body) ? null : Se(this.body) ? this.body.type || null : Ie(this.body) ? null : typeof this.body == "string" ? Ve : this.body instanceof F ? "application/x-www-form-urlencoded;charset=UTF-8" : typeof this.body == "object" || typeof this.body == "number" || typeof this.body == "boolean" ? $e : null; }
    clone(r = {}) { let t = r.method || this.method, n = r.url || this.url, o = r.responseType || this.responseType, s = r.keepalive ?? this.keepalive, i = r.priority || this.priority, c = r.cache || this.cache, a = r.mode || this.mode, d = r.redirect || this.redirect, u = r.credentials || this.credentials, f = r.referrer ?? this.referrer, T = r.integrity || this.integrity, b = r.referrerPolicy || this.referrerPolicy, R = r.transferCache ?? this.transferCache, P = r.timeout ?? this.timeout, g = r.body !== void 0 ? r.body : this.body, m = r.withCredentials ?? this.withCredentials, l = r.reportProgress ?? this.reportProgress, p = r.reportUploadProgress ?? this.reportUploadProgress, v = r.reportDownloadProgress ?? this.reportDownloadProgress, x = r.headers || this.headers, y = r.params || this.params, M = r.context ?? this.context; return r.setHeaders !== void 0 && (x = Object.keys(r.setHeaders).reduce((D, N) => D.set(N, r.setHeaders[N]), x)), r.setParams && (y = Object.keys(r.setParams).reduce((D, N) => D.set(N, r.setParams[N]), y)), new e(t, n, g, { params: y, headers: x, context: M, reportProgress: l, reportUploadProgress: p, reportDownloadProgress: v, responseType: o, withCredentials: m, transferCache: R, keepalive: s, cache: c, priority: i, timeout: P, mode: a, redirect: d, credentials: u, referrer: f, integrity: T, referrerPolicy: b }); }
}, A = (function (e) { return e[e.Sent = 0] = "Sent", e[e.UploadProgress = 1] = "UploadProgress", e[e.ResponseHeader = 2] = "ResponseHeader", e[e.DownloadProgress = 3] = "DownloadProgress", e[e.Response = 4] = "Response", e[e.User = 5] = "User", e; })(A || {}), z = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    redirected;
    responseType;
    constructor(r, t = 200, n = "OK") { this.headers = r.headers || new k, this.status = r.status !== void 0 ? r.status : t, this.statusText = r.statusText || n, this.url = r.url || null, this.redirected = r.redirected, this.responseType = r.responseType, this.ok = this.status >= 200 && this.status < 300; }
}, K = class e extends z {
    constructor(r = {}) { super(r); }
    type = A.ResponseHeader;
    clone(r = {}) { return new e({ headers: r.headers || this.headers, status: r.status !== void 0 ? r.status : this.status, statusText: r.statusText || this.statusText, url: r.url || this.url || void 0 }); }
}, C = class e extends z {
    body;
    constructor(r = {}) { super(r), this.body = r.body !== void 0 ? r.body : null; }
    type = A.Response;
    clone(r = {}) { return new e({ body: r.body !== void 0 ? r.body : this.body, headers: r.headers || this.headers, status: r.status !== void 0 ? r.status : this.status, statusText: r.statusText || this.statusText, url: r.url || this.url || void 0, redirected: r.redirected ?? this.redirected, responseType: r.responseType ?? this.responseType }); }
}, _ = class extends z {
    name = "HttpErrorResponse";
    message;
    error;
    ok = !1;
    constructor(r) { super(r, 0, "Unknown Error"), this.status >= 200 && this.status < 300 ? this.message = `Http failure during parsing for ${r.url || "(unknown url)"}` : this.message = `Http failure response for ${r.url || "(unknown url)"}: ${r.status} ${r.statusText}`, this.error = r.error || null; }
}, me = 200, Jt = 204, We = (function (e) { return e[e.Continue = 100] = "Continue", e[e.SwitchingProtocols = 101] = "SwitchingProtocols", e[e.Processing = 102] = "Processing", e[e.EarlyHints = 103] = "EarlyHints", e[e.Ok = 200] = "Ok", e[e.Created = 201] = "Created", e[e.Accepted = 202] = "Accepted", e[e.NonAuthoritativeInformation = 203] = "NonAuthoritativeInformation", e[e.NoContent = 204] = "NoContent", e[e.ResetContent = 205] = "ResetContent", e[e.PartialContent = 206] = "PartialContent", e[e.MultiStatus = 207] = "MultiStatus", e[e.AlreadyReported = 208] = "AlreadyReported", e[e.ImUsed = 226] = "ImUsed", e[e.MultipleChoices = 300] = "MultipleChoices", e[e.MovedPermanently = 301] = "MovedPermanently", e[e.Found = 302] = "Found", e[e.SeeOther = 303] = "SeeOther", e[e.NotModified = 304] = "NotModified", e[e.UseProxy = 305] = "UseProxy", e[e.Unused = 306] = "Unused", e[e.TemporaryRedirect = 307] = "TemporaryRedirect", e[e.PermanentRedirect = 308] = "PermanentRedirect", e[e.BadRequest = 400] = "BadRequest", e[e.Unauthorized = 401] = "Unauthorized", e[e.PaymentRequired = 402] = "PaymentRequired", e[e.Forbidden = 403] = "Forbidden", e[e.NotFound = 404] = "NotFound", e[e.MethodNotAllowed = 405] = "MethodNotAllowed", e[e.NotAcceptable = 406] = "NotAcceptable", e[e.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", e[e.RequestTimeout = 408] = "RequestTimeout", e[e.Conflict = 409] = "Conflict", e[e.Gone = 410] = "Gone", e[e.LengthRequired = 411] = "LengthRequired", e[e.PreconditionFailed = 412] = "PreconditionFailed", e[e.PayloadTooLarge = 413] = "PayloadTooLarge", e[e.UriTooLong = 414] = "UriTooLong", e[e.UnsupportedMediaType = 415] = "UnsupportedMediaType", e[e.RangeNotSatisfiable = 416] = "RangeNotSatisfiable", e[e.ExpectationFailed = 417] = "ExpectationFailed", e[e.ImATeapot = 418] = "ImATeapot", e[e.MisdirectedRequest = 421] = "MisdirectedRequest", e[e.UnprocessableEntity = 422] = "UnprocessableEntity", e[e.Locked = 423] = "Locked", e[e.FailedDependency = 424] = "FailedDependency", e[e.TooEarly = 425] = "TooEarly", e[e.UpgradeRequired = 426] = "UpgradeRequired", e[e.PreconditionRequired = 428] = "PreconditionRequired", e[e.TooManyRequests = 429] = "TooManyRequests", e[e.RequestHeaderFieldsTooLarge = 431] = "RequestHeaderFieldsTooLarge", e[e.UnavailableForLegalReasons = 451] = "UnavailableForLegalReasons", e[e.InternalServerError = 500] = "InternalServerError", e[e.NotImplemented = 501] = "NotImplemented", e[e.BadGateway = 502] = "BadGateway", e[e.ServiceUnavailable = 503] = "ServiceUnavailable", e[e.GatewayTimeout = 504] = "GatewayTimeout", e[e.HttpVersionNotSupported = 505] = "HttpVersionNotSupported", e[e.VariantAlsoNegotiates = 506] = "VariantAlsoNegotiates", e[e.InsufficientStorage = 507] = "InsufficientStorage", e[e.LoopDetected = 508] = "LoopDetected", e[e.NotExtended = 510] = "NotExtended", e[e.NetworkAuthenticationRequired = 511] = "NetworkAuthenticationRequired", e; })(We || {}), Vt = /^\)\]\}',?\n/, $t = 1024 * 1024, Ke = new L("", { factory: () => typeof ngServerMode < "u" && ngServerMode ? $t : null }), J = (() => { class e {
    fetchImpl = w(ue, { optional: !0 })?.fetch ?? ((...t) => globalThis.fetch(...t));
    ngZone = w(Dt);
    destroyRef = w(Ot);
    maxResponseSize = w(Ke);
    handle(t) { return new ge(n => { let o = new AbortController, s = !1, i = { next: a => { a.type === A.Response && (s = !0), n.next(a); }, error: a => { s = !0, n.error(a); }, complete: () => { s = !0, n.complete(); } }; this.doRequest(t, o.signal, i).then(he, a => i.error(new _({ error: a }))); let c; return t.timeout && (c = this.ngZone.runOutsideAngular(() => setTimeout(() => { o.signal.aborted || o.abort(new DOMException("signal timed out", "TimeoutError")); }, t.timeout))), () => { c !== void 0 && clearTimeout(c), !s && !o.signal.aborted && o.abort(); }; }); }
    doRequest(t, n, o) { return ae(this, null, function* () { let s = this.createRequestInit(t), i; try {
        let g = this.ngZone.runOutsideAngular(() => this.fetchImpl(t.urlWithParams, G({ signal: n }, s)));
        Gt(g), o.next({ type: A.Sent }), i = yield g;
    }
    catch (g) {
        o.error(new _({ error: g, status: g.status ?? 0, statusText: g.statusText, url: t.urlWithParams, headers: g.headers }));
        return;
    } let c = new k(i.headers), a = i.statusText, d = i.url || t.urlWithParams, u = i.status, f = null, T = t.reportProgress || t.reportDownloadProgress; if (T && o.next(new K({ headers: c, status: u, statusText: a, url: d })), i.body) {
        let g = i.headers.get(W) ?? "", m = i.headers.get("content-length"), l = m !== null ? Number(m) : NaN;
        this.maxResponseSize !== null && Number.isFinite(l) && l > this.maxResponseSize && Ue(this.maxResponseSize);
        let p = [], v = i.body.getReader(), x = 0, y, M, D = typeof Zone < "u" && Zone.current, N = !1;
        if (yield this.ngZone.runOutsideAngular(() => ae(this, null, function* () { for (;;) {
            if (this.destroyRef.destroyed) {
                yield v.cancel(), N = !0;
                break;
            }
            let { done: I, value: B } = yield v.read();
            if (I)
                break;
            if (p.push(B), x += B.length, this.maxResponseSize !== null && x > this.maxResponseSize && (yield v.cancel(), Ue(this.maxResponseSize)), T) {
                M = t.responseType === "text" ? (M ?? "") + (y ??= ce(g)).decode(B, { stream: !0 }) : void 0;
                let S = () => o.next({ type: A.DownloadProgress, total: Number.isFinite(l) ? l : void 0, loaded: x, partialText: M });
                D ? D.run(S) : S();
            }
        } })), N) {
            o.complete();
            return;
        }
        let E = this.concatChunks(p, x);
        try {
            f = this.parseBody(t, E, g, u);
        }
        catch (I) {
            o.error(new _({ error: I, headers: new k(i.headers), status: i.status, statusText: i.statusText, url: i.url || t.urlWithParams }));
            return;
        }
    } u === 0 && (u = f ? me : 0); let b = u >= 200 && u < 300, R = i.redirected, P = i.type; b ? (o.next(new C({ body: f, headers: c, status: u, statusText: a, url: d, redirected: R, responseType: P })), o.complete()) : o.error(new _({ error: f, headers: c, status: u, statusText: a, url: d, redirected: R, responseType: P })); }); }
    parseBody(t, n, o, s) { switch (t.responseType) {
        case "json":
            let i = ce(o).decode(n).replace(Vt, "");
            if (i === "")
                return null;
            try {
                return JSON.parse(i);
            }
            catch (c) {
                if (s < 200 || s >= 300)
                    return i;
                throw c;
            }
        case "text": return ce(o).decode(n);
        case "blob": return new Blob([n], { type: o });
        case "arraybuffer": return n.buffer;
    } }
    createRequestInit(t) { if (t.reportUploadProgress)
        throw new O(2824, !1); let n = {}, o; if (o = t.credentials, t.withCredentials && (o = "include"), t.headers.forEach((s, i) => n[s] = i.join(",")), t.headers.has(te) || (n[te] = Ge), !t.headers.has(W)) {
        let s = t.detectContentTypeHeader();
        s !== null && (n[W] = s);
    } return { body: t.serializeBody(), method: t.method, headers: n, credentials: o, keepalive: t.keepalive, cache: t.cache, priority: t.priority, mode: t.mode, redirect: t.redirect, referrer: t.referrer, integrity: t.integrity, referrerPolicy: t.referrerPolicy }; }
    concatChunks(t, n) { let o = new Uint8Array(n), s = 0; for (let i of t)
        o.set(i, s), s += i.length; return o; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineService({ token: e, factory: e.\u0275fac });
} return e; })(), ue = class {
};
function he() { }
function Gt(e) { e.then(he, he); }
function Ue(e) { throw new O(-2825, !1); }
var Wt = /charset=\s*["']?([^;"'\s]+)["']?/i;
function ce(e) { let r = e.match(Wt); if (r !== null)
    try {
        return new TextDecoder(r[1]);
    }
    catch { } return new TextDecoder; }
var Te = new L("", { factory: () => !0 }), Ye = "XSRF-TOKEN", Ze = new L("", { factory: () => Ye }), qe = "X-XSRF-TOKEN", Qe = new L("", { factory: () => qe }), He = (() => { class e {
    cookieName = w(Ze);
    doc = w(Be);
    lastCookieString = "";
    lastToken = null;
    parseCount = 0;
    getToken() { if (typeof ngServerMode < "u" && ngServerMode)
        return null; let t = this.doc.cookie || ""; return t !== this.lastCookieString && (this.parseCount++, this.lastToken = Oe(t, this.cookieName), this.lastCookieString = t), this.lastToken; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineService({ token: e, factory: e.\u0275fac });
} return e; })(), we = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: function (n) { let o = null; return n ? o = new (n || e) : o = h.\u0275\u0275inject(He), o; }, providedIn: "root" });
} return e; })();
function ve(e, r) { if (!w(Te) || e.method === "GET" || e.method === "HEAD")
    return r(e); try {
    let o = w(De).href, { origin: s } = new URL(o), { origin: i } = new URL(e.url, s);
    if (s !== i)
        return r(e);
}
catch {
    return r(e);
} let t = w(we).getToken(), n = w(Qe); return t != null && !e.headers.has(n) && (e = e.clone({ headers: e.headers.set(n, t) })), r(e); }
var Ce = (() => { class e {
    injector = w(_t);
    intercept(t, n) { return ye(this.injector, () => ve(t, o => n.handle(o))); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function et(e, r) { return r(e); }
function Kt(e, r) { return (t, n) => r.intercept(t, { handle: o => e(o, n) }); }
function Yt(e, r, t) { return (n, o) => ye(t, () => r(n, s => e(s, o))); }
var be = new L(""), Y = new L("", { factory: () => [ve] }), Ee = new L(""), Re = new L("", { factory: () => !0 });
function Zt() { let e = null; return (r, t) => { e === null && (e = (w(be, { optional: !0 }) ?? []).reduceRight(Kt, et)); let n = w(Xe); if (w(Re)) {
    let s = n.add();
    return e(r, t).pipe(ze(s));
}
else
    return e(r, t); }; }
var V = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: function (n) { let o = null; return n ? o = new (n || e) : o = h.\u0275\u0275inject(J), o; }, providedIn: "root" });
} return e; })();
var re = (() => { class e {
    backend;
    injector;
    chain = null;
    pendingTasks = w(Xe);
    contributeToStability = w(Re);
    constructor(t, n) { this.backend = t, this.injector = n; }
    handle(t) { if (this.chain === null) {
        let o = this.injector.get(Z, null, { skipSelf: !0 }), s = o !== null && this.backend === o, i = this.injector.get(Ee, [], s ? { self: !0 } : void 0), c = Array.from(new Set([...this.injector.get(Y), ...i]));
        this.chain = c.reduceRight((a, d) => Yt(a, d, this.injector), et);
    } let n = this.chain; if (this.contributeToStability) {
        let o = this.pendingTasks.add();
        return Ae(() => n(t, s => this.backend.handle(s))).pipe(ze(o));
    }
    else
        return Ae(() => n(t, o => this.backend.handle(o))); }
    static \u0275fac = function (n) { return new (n || e)(h.\u0275\u0275inject(V), h.\u0275\u0275inject(h.EnvironmentInjector)); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), Z = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: function (n) { let o = null; return n ? o = new (n || e) : o = h.\u0275\u0275inject(re), o; }, providedIn: "root" });
} return e; })();
function de(e, r) { return G({ body: r }, e); }
var Pe = (() => { class e {
    handler;
    constructor(t) { this.handler = t; }
    request(t, n, o = {}) { let s; if (t instanceof X)
        s = t;
    else {
        let a;
        o.headers instanceof k ? a = o.headers : a = new k(o.headers);
        let d;
        o.params && (o.params instanceof F ? d = o.params : d = new F({ fromObject: o.params })), s = new X(t, n, o.body !== void 0 ? o.body : null, { headers: a, context: o.context, params: d, reportProgress: o.reportProgress, reportUploadProgress: o.reportUploadProgress, reportDownloadProgress: o.reportDownloadProgress, responseType: o.responseType || "json", withCredentials: o.withCredentials, transferCache: o.transferCache, keepalive: o.keepalive, priority: o.priority, cache: o.cache, mode: o.mode, redirect: o.redirect, credentials: o.credentials, referrer: o.referrer, referrerPolicy: o.referrerPolicy, integrity: o.integrity, timeout: o.timeout });
    } let i = Je(s).pipe(St(a => this.handler.handle(a))); if (t instanceof X || o.observe === "events")
        return i; let c = i.pipe(Ft(a => a instanceof C)); switch (o.observe || "body") {
        case "body": switch (s.responseType) {
            case "arraybuffer": return c.pipe(q(a => { if (a.body !== null && !(a.body instanceof ArrayBuffer))
                throw new O(2806, !1); return a.body; }));
            case "blob": return c.pipe(q(a => { if (a.body !== null && !(a.body instanceof Blob))
                throw new O(2807, !1); return a.body; }));
            case "text": return c.pipe(q(a => { if (a.body !== null && typeof a.body != "string")
                throw new O(2808, !1); return a.body; }));
            default: return c.pipe(q(a => a.body));
        }
        case "response": return c;
        default: throw new O(2809, !1);
    } }
    delete(t, n = {}) { return this.request("DELETE", t, n); }
    get(t, n = {}) { return this.request("GET", t, n); }
    head(t, n = {}) { return this.request("HEAD", t, n); }
    jsonp(t, n) { return this.request("JSONP", t, { params: new F().append(n, "JSONP_CALLBACK"), observe: "body", responseType: "json" }); }
    options(t, n = {}) { return this.request("OPTIONS", t, n); }
    patch(t, n, o = {}) { return this.request("PATCH", t, de(o, n)); }
    post(t, n, o = {}) { return this.request("POST", t, de(o, n)); }
    put(t, n, o = {}) { return this.request("PUT", t, de(o, n)); }
    static \u0275fac = function (n) { return new (n || e)(h.\u0275\u0275inject(Z)); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), qt = 0, Le, Qt = "JSONP injected script did not invoke callback.";
var ne = class {
};
function Ht() { return typeof window == "object" ? window : {}; }
var xe = (() => { class e {
    callbackMap;
    document;
    resolvedPromise = Promise.resolve();
    nonce = w(At, { optional: !0 });
    constructor(t, n) { this.callbackMap = t, this.document = n; }
    nextCallback() { return `ng_jsonp_callback_${qt++}`; }
    handle(t) { if (t.method !== "JSONP")
        throw new O(2810, !1); if (t.responseType !== "json")
        throw new O(2811, !1); if (t.headers.keys().length > 0)
        throw new O(2812, !1); if (!this.isAllowedJsonpUrl(t.urlWithParams))
        throw new O(2826, !1); return new ge(n => { let o = this.nextCallback(), s = t.urlWithParams.replace(/=JSONP_CALLBACK(&|$)/, `=${o}$1`), i = this.document.createElement("script"); i.src = s, this.nonce && i.setAttribute("nonce", this.nonce); let c = null, a = !1; this.callbackMap[o] = T => { delete this.callbackMap[o], c = T, a = !0; }; let d = () => { i.removeEventListener("load", u), i.removeEventListener("error", f), i.remove(), delete this.callbackMap[o]; }, u = () => { this.resolvedPromise.then(() => { if (d(), !a) {
        n.error(new _({ url: s, status: 0, statusText: "JSONP Error", error: new Error(Qt) }));
        return;
    } n.next(new C({ body: c, status: me, statusText: "OK", url: s })), n.complete(); }); }, f = T => { d(), n.error(new _({ error: T, status: 0, statusText: "JSONP Error", url: s })); }; return i.addEventListener("load", u), i.addEventListener("error", f), this.document.body.appendChild(i), n.next({ type: A.Sent }), () => { a || this.removeListeners(i), d(); }; }); }
    removeListeners(t) { Le ??= this.document.implementation.createHTMLDocument(), Le.adoptNode(t); }
    isAllowedJsonpUrl(t) { return /^https?:\/\//i.test(t); }
    static \u0275fac = function (n) { return new (n || e)(h.\u0275\u0275inject(ne), h.\u0275\u0275inject(Be)); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function tt(e, r) { return e.method === "JSONP" ? w(xe).handle(e) : r(e); }
var er = (() => { class e {
    injector;
    constructor(t) { this.injector = t; }
    intercept(t, n) { return ye(this.injector, () => tt(t, o => n.handle(o))); }
    static \u0275fac = function (n) { return new (n || e)(h.\u0275\u0275inject(h.EnvironmentInjector)); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), tr = /^\)\]\}',?\n/;
var fe = (() => { class e {
    xhrFactory;
    tracingService = w(kt, { optional: !0 });
    constructor(t) { this.xhrFactory = t; }
    maybePropagateTrace(t) { return this.tracingService?.propagate ? this.tracingService.propagate(t) : t; }
    handle(t) { if (t.method === "JSONP")
        throw new O(-2800, !1); let n = this.xhrFactory; return (typeof ngServerMode < "u" && ngServerMode && n.\u0275loadImpl ? Ct(n.\u0275loadImpl()) : Je(null)).pipe(Ut(() => new ge(s => { let i = n.build(); if (i.open(t.method, t.urlWithParams), t.withCredentials && (i.withCredentials = !0), t.headers.forEach((l, p) => i.setRequestHeader(l, p.join(","))), t.headers.has(te) || i.setRequestHeader(te, Ge), !t.headers.has(W)) {
        let l = t.detectContentTypeHeader();
        l !== null && i.setRequestHeader(W, l);
    } if (t.timeout && (i.timeout = t.timeout), t.responseType) {
        let l = t.responseType.toLowerCase();
        i.responseType = l !== "json" ? l : "text";
    } let c = t.serializeBody(), a = null, d = () => { if (a !== null)
        return a; let l = i.statusText || "OK", p = new k(i.getAllResponseHeaders()), v = i.responseURL || t.url; return a = new K({ headers: p, status: i.status, statusText: l, url: v }), a; }, u = this.maybePropagateTrace(() => { let { headers: l, status: p, statusText: v, url: x } = d(), y = null; p !== Jt && (y = typeof i.response > "u" ? i.responseText : i.response), p === 0 && (p = y ? me : 0); let M = p >= 200 && p < 300; if (t.responseType === "json" && typeof y == "string") {
        let D = y;
        y = y.replace(tr, "");
        try {
            y = y !== "" ? JSON.parse(y) : null;
        }
        catch (N) {
            y = D, M && (M = !1, y = { error: N, text: y });
        }
    } M ? (s.next(new C({ body: y, headers: l, status: p, statusText: v, url: x || void 0 })), s.complete()) : s.error(new _({ error: y, headers: l, status: p, statusText: v, url: x || void 0 })); }), f = this.maybePropagateTrace(l => { let { url: p } = d(), v = new _({ error: l, status: i.status || 0, statusText: i.statusText || "Unknown Error", url: p || void 0 }); s.error(v); }), T = f; t.timeout && (T = this.maybePropagateTrace(l => { let { url: p } = d(), v = new _({ error: new DOMException("Request timed out", "TimeoutError"), status: i.status || 0, statusText: i.statusText || "Request timeout", url: p || void 0 }); s.error(v); })); let b = !1, R = this.maybePropagateTrace(l => { b || (s.next(d()), b = !0); let p = { type: A.DownloadProgress, loaded: l.loaded }; l.lengthComputable && (p.total = l.total), t.responseType === "text" && i.responseText && (p.partialText = i.responseText), s.next(p); }), P = this.maybePropagateTrace(l => { let p = { type: A.UploadProgress, loaded: l.loaded }; l.lengthComputable && (p.total = l.total), s.next(p); }); i.addEventListener("load", u), i.addEventListener("error", f), i.addEventListener("timeout", T), i.addEventListener("abort", f); let g = t.reportProgress || t.reportUploadProgress, m = t.reportProgress || t.reportDownloadProgress; return m && i.addEventListener("progress", R), g && c !== null && i.upload && i.upload.addEventListener("progress", P), i.send(c), s.next({ type: A.Sent }), () => { i.removeEventListener("error", f), i.removeEventListener("abort", f), i.removeEventListener("load", u), i.removeEventListener("timeout", T), m && i.removeEventListener("progress", R), g && c !== null && i.upload && i.upload.removeEventListener("progress", P), i.readyState !== i.DONE && i.abort(); }; }))); }
    static \u0275fac = function (n) { return new (n || e)(h.\u0275\u0275inject(_e)); };
    static \u0275prov = h.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), U = (function (e) { return e[e.Interceptors = 0] = "Interceptors", e[e.LegacyInterceptors = 1] = "LegacyInterceptors", e[e.CustomXsrfConfiguration = 2] = "CustomXsrfConfiguration", e[e.NoXsrfProtection = 3] = "NoXsrfProtection", e[e.JsonpSupport = 4] = "JsonpSupport", e[e.RequestsMadeViaParent = 5] = "RequestsMadeViaParent", e[e.Fetch = 6] = "Fetch", e[e.Xhr = 7] = "Xhr", e; })(U || {});
function j(e, r) { return { \u0275kind: e, \u0275providers: r }; }
function rt(...e) { let r = [Pe, J, re, { provide: Z, useExisting: re }, { provide: V, useFactory: () => w(J) }, { provide: Y, useValue: ve, multi: !0 }]; for (let t of e)
    r.push(...t.\u0275providers); return It(r); }
function rr(e) { return j(U.Interceptors, e.map(r => ({ provide: Y, useValue: r, multi: !0 }))); }
var je = new L("");
function nt() { return j(U.LegacyInterceptors, [{ provide: je, useFactory: Zt }, { provide: Y, useExisting: je, multi: !0 }]); }
function pe({ cookieName: e, headerName: r }) { let t = []; return e !== void 0 && t.push({ provide: Ze, useValue: e }), r !== void 0 && t.push({ provide: Qe, useValue: r }), j(U.CustomXsrfConfiguration, t); }
function ot() { return j(U.NoXsrfProtection, [{ provide: Te, useValue: !1 }]); }
function st() { return j(U.JsonpSupport, [xe, { provide: ne, useFactory: Ht }, { provide: Y, useValue: tt, multi: !0 }]); }
function nr() { return j(U.RequestsMadeViaParent, [{ provide: V, useFactory: () => w(Z, { skipSelf: !0, optional: !0 }) }]); }
function or() { return j(U.Fetch, [J, { provide: V, useExisting: J }]); }
function it() { return j(U.Xhr, [fe, { provide: V, useExisting: fe }]); }
var sr = (() => { class e {
    static disable() { return { ngModule: e, providers: [ot().\u0275providers] }; }
    static withOptions(t = {}) { return { ngModule: e, providers: pe(t).\u0275providers }; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275mod = h.\u0275\u0275defineNgModule({ type: e });
    static \u0275inj = h.\u0275\u0275defineInjector({ providers: [Ce, { provide: be, useExisting: Ce, multi: !0 }, { provide: we, useClass: He }, pe({ cookieName: Ye, headerName: qe }).\u0275providers, { provide: Te, useValue: !0 }] });
} return e; })(), ir = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275mod = h.\u0275\u0275defineNgModule({ type: e });
    static \u0275inj = h.\u0275\u0275defineInjector({ providers: [rt(nt(), it())] });
} return e; })(), ar = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275mod = h.\u0275\u0275defineNgModule({ type: e });
    static \u0275inj = h.\u0275\u0275defineInjector({ providers: [st().\u0275providers] });
} return e; })();
import { InjectionToken as lt, APP_BOOTSTRAP_LISTENER as cr, \u0275performanceMarkFeature as dr, inject as $, ApplicationRef as lr, TransferState as ut, makeStateKey as ur, \u0275RuntimeError as ht, \u0275truncateMiddle as Gr, \u0275formatRuntimeError as Wr, Injector as hr, signal as ft, \u0275ResourceImpl as fr, linkedSignal as Me, computed as pr, \u0275encapsulateResourceError as yr } from "@angular/core";
import { of as gr } from "rxjs";
import { tap as mr } from "rxjs/operators";
var pt = new lt(""), yt = "b", gt = "h", mt = "s", Tt = "st", wt = "u", vt = "rt", se = new lt(""), Tr = ["GET", "HEAD"];
function bt(e, r) { let { isCacheActive: t, filter: n, includePostRequests: o, includeRequestsWithAuthHeaders: s, includeRequestsWithCredentials: i, includeNonCacheableRequests: c } = r, { transferCache: a, method: d } = e; return !(!t || a === !1 || d === "POST" && !o && !a || d !== "POST" && !Tr.includes(d) || !s && br(e) || !i && xr(e) || !c && (Rt(e.headers) || Pr(e.cache)) || n?.(e) === !1); }
function wr(e, r) { return typeof r == "object" && r.includeHeaders ? r.includeHeaders : e.includeHeaders; }
function Et(e, r, t, n, o, s = !1) { if (!s && !bt(e, r))
    return null; if (typeof ngServerMode < "u" && !ngServerMode && n)
    throw new ht(2803, !1); if (!o) {
    let P = typeof ngServerMode < "u" && ngServerMode && n ? xt(e.url, n) : e.url;
    o = Pt(e, P);
} let i = t.get(o, null); if (!i)
    return null; let { [yt]: c, [vt]: a, [gt]: d, [mt]: u, [Tt]: f, [wt]: T } = i, b = c; switch (a) {
    case "arraybuffer":
        b = ct(c);
        break;
    case "blob":
        b = new Blob([ct(c)]);
        break;
} let R = new k(d); return new C({ body: b, headers: R, status: u, statusText: f, url: T }); }
function vr(e, r) { let t = $(se); if (!bt(e, t))
    return r(e); let n = $(ut), o = $(pt, { optional: !0 }), s = typeof ngServerMode < "u" && ngServerMode && o ? xt(e.url, o) : e.url, i = Pt(e, s), c = Et(e, t, n, null, i, !0); if (c)
    return gr(c); let a = r(e); return typeof ngServerMode < "u" && ngServerMode ? a.pipe(mr(d => { if (d instanceof C) {
    let { headers: u, body: f, status: T, statusText: b } = d;
    if (!t.includeNonCacheableRequests && (Rt(u) || Rr(u)))
        return;
    let { transferCache: R, responseType: P } = e, g = wr(t, R);
    n.set(i, { [yt]: P === "arraybuffer" || P === "blob" ? Nr(f) : f, [gt]: Mr(u, g), [mt]: T, [Tt]: b, [wt]: s, [vt]: P });
} })) : a; }
function br(e) { let r = e.headers; return r.has("authorization") || r.has("proxy-authorization") || r.has("cookie"); }
var Er = new Set(["no-store", "private", "no-cache"]);
function Rt(e) { let r = e.get("cache-control"); return r ? r.split(",").some(t => { let n = t.split("=", 1)[0].trim().toLowerCase(); return Er.has(n); }) : !1; }
function Rr(e) { return e.has("set-cookie"); }
function Pr(e) { return e === "no-cache" || e === "no-store"; }
function xr(e) { let { withCredentials: r, credentials: t } = e; return r || t === "include" || t === "same-origin"; }
function Mr(e, r) { if (!r)
    return {}; let t = {}; for (let n of r) {
    let o = e.getAll(n);
    o !== null && (t[n] = o);
} return t; }
function at(e) { let r = new URLSearchParams(e instanceof URLSearchParams ? e : e.toString()); return r.sort(), r.toString(); }
function Pt(e, r) { let { params: t, method: n, responseType: o } = e, s = at(t), i = e.serializeBody(); i instanceof URLSearchParams ? i = at(i) : typeof i != "string" && (i = ""); let c = [n, o, r, i, s].join("\0"), a = Or(c); return ur(a); }
function Nr(e) { let r = new Uint8Array(e), t = 32768, n = ""; for (let o = 0; o < r.length; o += t) {
    let s = r.subarray(o, o + t);
    n += String.fromCharCode.apply(null, s);
} return btoa(n); }
function ct(e) { let r = atob(e); return Uint8Array.from(r, n => n.charCodeAt(0)).buffer; }
function qr(e) { return [{ provide: se, useFactory: () => (dr("NgHttpTransferCache"), G({ isCacheActive: !0 }, e)) }, { provide: Ee, useValue: vr, multi: !0 }, { provide: cr, multi: !0, useFactory: () => { let r = $(lr), t = $(se); return () => { r.whenStable().then(() => { t.isCacheActive = !1; }); }; } }]; }
function xt(e, r) { let t = new URL(e, "resolve://").origin, n = r[t]; return n ? e.replace(t, n) : e; }
var Dr = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]), dt;
function Or(e) { dt ??= new TextEncoder; let r = dt.encode(e), t = 1779033703, n = 3144134277, o = 1013904242, s = 2773480762, i = 1359893119, c = 2600822924, a = 528734635, d = 1541459225, u = r.length * 8, f = (r.length + 8 >> 6) + 1 << 6, T = new Uint8Array(f); T.set(r), T[r.length] = 128; let b = new DataView(T.buffer), R = u >>> 0, P = u / 4294967296 >>> 0; b.setUint32(f - 8, P, !1), b.setUint32(f - 4, R, !1); let g = new Uint32Array(64); for (let m = 0; m < f; m += 64) {
    for (let E = 0; E < 16; E++)
        g[E] = b.getUint32(m + E * 4, !1);
    for (let E = 16; E < 64; E++) {
        let I = g[E - 15], B = ((I >>> 7 | I << 25) ^ (I >>> 18 | I << 14) ^ I >>> 3) >>> 0, S = g[E - 2], ie = ((S >>> 17 | S << 15) ^ (S >>> 19 | S << 13) ^ S >>> 10) >>> 0;
        g[E] = g[E - 16] + B + g[E - 7] + ie >>> 0;
    }
    let l = t, p = n, v = o, x = s, y = i, M = c, D = a, N = d;
    for (let E = 0; E < 64; E++) {
        let I = ((y >>> 6 | y << 26) ^ (y >>> 11 | y << 21) ^ (y >>> 25 | y << 7)) >>> 0, B = (y & M ^ ~y & D) >>> 0, S = N + I + B + Dr[E] + g[E] >>> 0, ie = ((l >>> 2 | l << 30) ^ (l >>> 13 | l << 19) ^ (l >>> 22 | l << 10)) >>> 0, Mt = (l & p ^ l & v ^ p & v) >>> 0, Nt = ie + Mt >>> 0;
        N = D, D = M, M = y, y = x + S >>> 0, x = v, v = p, p = l, l = S + Nt >>> 0;
    }
    t = t + l >>> 0, n = n + p >>> 0, o = o + v >>> 0, s = s + x >>> 0, i = i + y >>> 0, c = c + M >>> 0, a = a + D >>> 0, d = d + N >>> 0;
} return [t, n, o, s, i, c, a, d].map(m => m.toString(16).padStart(8, "0")).join(""); }
var Qr = (() => { let e = oe("json"); return e.arrayBuffer = oe("arraybuffer"), e.blob = oe("blob"), e.text = oe("text"), e; })();
function oe(e) { return function (t, n) { let o = n?.injector ?? $(hr), s = o.get(se, null, { optional: !0 }), i = o.get(ut, null, { optional: !0 }), c = o.get(pt, null, { optional: !0 }), a = d => { if (s && i && d) {
    let u = Et(d, s, i, c);
    if (u)
        try {
            let f = u.body, T = n?.parse ? n.parse(f) : f;
            return ft({ value: T });
        }
        catch { }
} }; return new Ne(o, d => _r(d, t, e), n?.defaultValue, n?.debugName, n?.parse, n?.equal, a); }; }
function _r(e, r, t) { let n = typeof r == "function" ? r(e) : r; if (n === void 0)
    return; typeof n == "string" && (n = { url: n }); let o = n.headers instanceof k ? n.headers : new k(n.headers), s = n.params instanceof F ? n.params : new F({ fromObject: n.params }); return new X(n.method ?? "GET", n.url, n.body ?? null, { headers: o, params: s, reportProgress: n.reportProgress, withCredentials: n.withCredentials, keepalive: n.keepalive, cache: n.cache, priority: n.priority, mode: n.mode, redirect: n.redirect, responseType: t, context: n.context, transferCache: n.transferCache, credentials: n.credentials, referrer: n.referrer, referrerPolicy: n.referrerPolicy, integrity: n.integrity, timeout: n.timeout }); }
var Ne = class extends fr {
    client;
    _headers = Me({ source: this.extRequest, computation: () => { } });
    _progress = Me({ source: this.extRequest, computation: () => { } });
    _statusCode = Me({ source: this.extRequest, computation: () => { } });
    headers = pr(() => this.status() === "resolved" || this.status() === "error" ? this._headers() : void 0);
    progress = this._progress.asReadonly();
    statusCode = this._statusCode.asReadonly();
    constructor(r, t, n, o, s, i, c) { super(t, ({ params: a, abortSignal: d }) => { let u, f = !1, T = () => { f = !0, u?.unsubscribe(); }; d.addEventListener("abort", T); let b = ft({ value: void 0 }), R, P = new Promise(m => R = m), g = m => { b.set(m), R?.(b), R = void 0; }; return u = this.client.request(a).subscribe({ next: m => { switch (m.type) {
            case A.Response:
                this._headers.set(m.headers), this._statusCode.set(m.status);
                try {
                    g({ value: s ? s(m.body) : m.body });
                }
                catch (l) {
                    g({ error: yr(l) });
                }
                break;
            case A.DownloadProgress:
                this._progress.set(m);
                break;
        } }, error: m => { m instanceof _ && (this._headers.set(m.headers), this._statusCode.set(m.status)), g({ error: m }), d.removeEventListener("abort", T); }, complete: () => { R && g({ error: new ht(991, !1) }), d.removeEventListener("abort", T); } }), f && u.unsubscribe(), P; }, n, i, o, r, void 0, c), this.client = r.get(Pe); }
    set(r) { super.set(r), this._headers.set(void 0), this._progress.set(void 0), this._statusCode.set(void 0); }
};
export { J as FetchBackend, be as HTTP_INTERCEPTORS, pt as HTTP_TRANSFER_CACHE_ORIGIN_MAP, V as HttpBackend, Pe as HttpClient, ar as HttpClientJsonpModule, ir as HttpClientModule, sr as HttpClientXsrfModule, H as HttpContext, le as HttpContextToken, _ as HttpErrorResponse, A as HttpEventType, U as HttpFeatureKind, Z as HttpHandler, K as HttpHeaderResponse, k as HttpHeaders, F as HttpParams, X as HttpRequest, C as HttpResponse, z as HttpResponseBase, We as HttpStatusCode, ee as HttpUrlEncodingCodec, fe as HttpXhrBackend, we as HttpXsrfTokenExtractor, xe as JsonpClientBackend, er as JsonpInterceptor, Qr as httpResource, rt as provideHttpClient, or as withFetch, rr as withInterceptors, nt as withInterceptorsFromDi, st as withJsonpSupport, ot as withNoXsrfProtection, nr as withRequestsMadeViaParent, it as withXhr, pe as withXsrfConfiguration, Ke as \u0275HTTP_FETCH_MAX_RESPONSE_SIZE, Ee as \u0275HTTP_ROOT_INTERCEPTOR_FNS, re as \u0275HttpInterceptingHandler, Re as \u0275REQUESTS_CONTRIBUTE_TO_STABILITY, qr as \u0275withHttpTransferCache };
/*! Bundled license information:

@angular/common/fesm2022/_module-chunk.mjs:
@angular/common/fesm2022/http.mjs:
  (**
   * @license Angular v22.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
