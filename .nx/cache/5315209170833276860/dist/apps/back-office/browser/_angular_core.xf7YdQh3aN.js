import { a as F, b as ne, c as lg, d as Ce, e as vl } from "@nf-internal/chunk-PZNONLPT";
var we = null, ls = !1, Tn = 1, tN = null, K = Symbol("SIGNAL");
function R(e) { let t = we; return we = e, t; }
function us() { return we; }
var Zt = { version: 0, lastCleanEpoch: 0, dirty: !1, producers: void 0, producersTail: void 0, consumers: void 0, consumersTail: void 0, recomputing: !1, consumerAllowSignalWrites: !1, consumerIsAlwaysLive: !1, kind: "unknown", producerMustRecompute: () => !1, producerRecomputeValue: () => { }, consumerMarkedDirty: () => { }, consumerOnSignalRead: () => { } };
function Yt(e) { if (ls)
    throw new Error(""); if (we === null)
    return; we.consumerOnSignalRead(e); let t = we.producersTail; if (t !== void 0 && t.producer === e)
    return; let n, o = we.recomputing; if (o && (n = t !== void 0 ? t.nextProducer : we.producers, n !== void 0 && n.producer === e)) {
    we.producersTail = n, n.lastReadVersion = e.version, n.knownValidAtEpoch = Tn;
    return;
} let r = e.consumersTail; if (r !== void 0 && r.consumer === we && (!o || r.knownValidAtEpoch === Tn))
    return; let i = uo(we), s = { producer: e, consumer: we, nextProducer: n, prevConsumer: void 0, knownValidAtEpoch: Tn, lastReadVersion: e.version, nextConsumer: void 0 }; we.producersTail = s, t !== void 0 ? t.nextProducer = s : we.producers = s, i && fg(e, s); }
function nN() { Tn++; }
function co(e) { if (!(uo(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Tn)) {
    if (!e.producerMustRecompute(e) && !lo(e)) {
        dr(e);
        return;
    }
    e.producerRecomputeValue(e), dr(e);
} }
function ug(e) { if (e.consumers === void 0)
    return; let t = ls; ls = !0; try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
        let o = n.consumer;
        o.dirty || oN(o);
    }
}
finally {
    ls = t;
} }
function dg() { return we?.consumerAllowSignalWrites !== !1; }
function oN(e) { e.dirty = !0, ug(e), e.consumerMarkedDirty?.(e); }
function dr(e) { e.dirty = !1, e.lastCleanEpoch = Tn; }
function Mt(e) { return e && rN(e), R(e); }
function rN(e) { if (e.producersTail?.knownValidAtEpoch === Tn) {
    let t = e.producers;
    for (; t !== void 0;)
        t.knownValidAtEpoch = null, t = t.nextProducer;
} e.producersTail = void 0, e.recomputing = !0; }
function Kt(e, t) { R(t), e && iN(e); }
function iN(e) { e.recomputing = !1; let t = e.producersTail, n = t !== void 0 ? t.nextProducer : e.producers; if (n !== void 0) {
    if (uo(e))
        do
            n = yl(n);
        while (n !== void 0);
    t !== void 0 ? t.nextProducer = void 0 : e.producers = void 0;
} }
function lo(e) { for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer, o = t.lastReadVersion;
    if (o !== n.version || (co(n), o !== n.version))
        return !0;
} return !1; }
function Jt(e) { if (uo(e)) {
    let t = e.producers;
    for (; t !== void 0;)
        t = yl(t);
} e.producers = void 0, e.producersTail = void 0, e.consumers = void 0, e.consumersTail = void 0; }
function fg(e, t) { let n = e.consumersTail, o = uo(e); if (n !== void 0 ? (t.nextConsumer = n.nextConsumer, n.nextConsumer = t) : (t.nextConsumer = void 0, e.consumers = t), t.prevConsumer = n, e.consumersTail = t, !o)
    for (let r = e.producers; r !== void 0; r = r.nextProducer)
        fg(r.producer, r); }
function yl(e) { let t = e.producer, n = e.nextProducer, o = e.nextConsumer, r = e.prevConsumer; if (e.nextConsumer = void 0, e.prevConsumer = void 0, o !== void 0 ? o.prevConsumer = r : t.consumersTail = r, r !== void 0)
    r.nextConsumer = o;
else if (t.consumers = o, !uo(t)) {
    let i = t.producers;
    for (; i !== void 0;)
        i = yl(i);
} return n; }
function uo(e) { return e.consumerIsAlwaysLive || e.consumers !== void 0; }
function ds(e) { tN?.(e); }
function fs(e, t) { return Object.is(e, t); }
function ps(e, t) { let n = Object.create(sN); n.computation = e, t !== void 0 && (n.equal = t); let o = () => { if (co(n), Yt(n), n.value === dt)
    throw n.error; return n.value; }; return o[K] = n, ds(n), o; }
var Cn = Symbol("UNSET"), wn = Symbol("COMPUTING"), dt = Symbol("ERRORED"), sN = ne(F({}, Zt), { value: Cn, dirty: !0, error: null, equal: fs, kind: "computed", producerMustRecompute(e) { return e.value === Cn || e.value === wn; }, producerRecomputeValue(e) { if (e.value === wn)
        throw new Error(""); let t = e.value; e.value = wn; let n = Mt(e), o, r = !1; try {
        o = e.computation(), R(null), r = t !== Cn && t !== dt && o !== dt && e.equal(t, o);
    }
    catch (i) {
        o = dt, e.error = i;
    }
    finally {
        Kt(e, n);
    } if (r) {
        e.value = t;
        return;
    } e.value = o, e.version++; } });
function aN() { throw new Error; }
var pg = aN;
function hg(e) { pg(e); }
function gg(e) { pg = e; }
var cN = null;
function mg(e, t) { let n = Object.create(hs); n.value = e, t !== void 0 && (n.equal = t); let o = () => lN(n); return o[K] = n, ds(n), [o, s => Mn(n, s), s => El(n, s)]; }
function lN(e) { return Yt(e), e.value; }
function Mn(e, t) { dg() || hg(e), e.equal(e.value, t) || (e.value = t, uN(e)); }
function El(e, t) { dg() || hg(e), Mn(e, t(e.value)); }
var hs = ne(F({}, Zt), { equal: fs, value: void 0, kind: "signal" });
function uN(e) { e.version++, nN(), ug(e), cN?.(e); }
var vg = ne(F({}, Zt), { consumerIsAlwaysLive: !0, consumerAllowSignalWrites: !0, dirty: !0, kind: "effect" });
function yg(e) { if (e.dirty = !1, e.version > 0 && !lo(e))
    return; e.version++; let t = Mt(e); try {
    e.cleanup(), e.fn();
}
finally {
    Kt(e, t);
} }
var Il;
function Dl() { return Il; }
function ft(e) { let t = Il; return Il = e, t; }
var dN = Symbol("NotFound");
function Tl(e) { return e === dN || e?.name === "\u0275NotFound"; }
import { setActiveConsumer as fo } from "@angular/core/primitives/signals";
import { isNotFound as fN } from "@angular/core/primitives/di";
import { BehaviorSubject as pN, Observable as hN, Subject as gN, Subscription as mN } from "rxjs";
var ms = class {
    full;
    major;
    minor;
    patch;
    constructor(t) { this.full = t; let n = t.split("."); this.major = n[0], this.minor = n[1], this.patch = n.slice(2).join("."); }
}, vs = new ms("22.1.1"), Is = (() => { let e = vs.full; return `https://${e.includes("-next") || e.includes("-rc") || e === "0.0.0-PLACEHOLDER" ? "next" : `v${vs.major}`}.angular.dev`; })(), vN = `${Is}/errors`, Ds = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", T = class extends Error {
    code;
    constructor(t, n) { super(Dr(t, n)), this.code = t; }
};
function yN(e) { return `NG0${Math.abs(e)}`; }
function Dr(e, t) { return `${yN(e)}${t ? ": " + t : ""}`; }
function B(e) { for (let t in e)
    if (e[t] === B)
        return t; throw Error(""); }
function Mg(e, t) { for (let n in t)
    t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]); }
function Tr(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(Tr).join(", ")}]`;
    if (e == null)
        return "" + e;
    let t = e.overriddenName || e.name;
    if (t)
        return `${t}`;
    let n = e.toString();
    if (n == null)
        return "" + n;
    let o = n.indexOf(`
`);
    return o >= 0 ? n.slice(0, o) : n;
}
function Ts(e, t) { return e ? t ? `${e} ${t}` : e : t || ""; }
function EN(e, t = 100) { if (!e || t < 1 || e.length <= t)
    return e; if (t == 1)
    return e.substring(0, 1) + "..."; let n = Math.round(t / 2); return e.substring(0, n) + "..." + e.substring(e.length - n); }
var IN = B({ __forward_ref__: B });
function Cr(e) { return e.__forward_ref__ = Cr, e; }
function j(e) { return wr(e) ? e() : e; }
function wr(e) { return typeof e == "function" && e.hasOwnProperty(IN) && e.__forward_ref__ === Cr; }
function Pl(e, t, n) { e != t && nn(n, e, t, "=="); }
function Fl(e, t) { e == null && nn(t, e, null, "!="); }
function nn(e, t, n, o) { throw new Error(`ASSERTION ERROR: ${e}` + (o == null ? "" : ` [Expected=> ${n} ${o} ${t} <=Actual]`)); }
function J(e) { return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 }; }
function Mr(e) { return { providers: e.providers || [], imports: e.imports || [] }; }
function Nr(e) { return TN(e, on); }
function DN(e) { return Nr(e) !== null; }
function TN(e, t) { return e.hasOwnProperty(t) && e[t] || null; }
function CN(e) { let t = e?.[on] ?? null; return t || null; }
function hr(e) { return e && e.hasOwnProperty(gr) ? e[gr] : null; }
var on = B({ \u0275prov: B }), gr = B({ \u0275inj: B }), C = class {
    _desc;
    ngMetadataName = "InjectionToken";
    \u0275prov;
    constructor(t, n) { this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = J({ token: this, providedIn: n.providedIn || "root", factory: n.factory })); }
    get multi() { return this; }
    toString() { return `InjectionToken ${this._desc}`; }
}, Eg;
function wN(e) { nn("setInjectorProfilerContext should never be called in production mode"); let t = Eg; return Eg = e, t; }
function jl(e) { return e && !!e.\u0275providers; }
var At = B({ \u0275cmp: B }), An = B({ \u0275dir: B }), Sr = B({ \u0275pipe: B }), Cs = B({ \u0275mod: B }), Ge = B({ \u0275fac: B }), Rn = B({ __NG_ELEMENT_ID__: B }), Ig = B({ __NG_ENV_ID__: B });
function ho(e) { return Ms(e, "@NgModule"), e[Cs] || null; }
function ws(e) { let t = ho(e); if (!t)
    throw new T(915, !1); return t; }
function Q(e) { return Ms(e, "@Component"), e[At] || null; }
function Pe(e) { return Ms(e, "@Directive"), e[An] || null; }
function ot(e) { return Ms(e, "@Pipe"), e[Sr] || null; }
function Ms(e, t) { if (e == null)
    throw new T(-919, !1); }
function _r(e) { let t = Q(e) || Pe(e) || ot(e); return t !== null && t.standalone; }
function A(e) { return typeof e == "string" ? e : e == null ? "" : String(e); }
function ze(e) { return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : A(e); }
var Ng = B({ ngErrorCode: B }), MN = B({ ngErrorMessage: B }), NN = B({ ngTokenPath: B });
function Vl(e, t) { return Sg("", -200, t); }
function Ns(e, t) { throw new T(-201, !1); }
function Sg(e, t, n) { let o = new T(t, e); return o[Ng] = t, o[MN] = e, n && (o[NN] = n), o; }
function SN(e) { return e[Ng]; }
var wl;
function _g() { return wl; }
function Me(e) { let t = wl; return wl = e, t; }
function Hl(e, t, n) { let o = Nr(e); if (o && o.providedIn == "root")
    return o.value === void 0 ? o.value = o.factory() : o.value; if (n & 8)
    return null; if (t !== void 0)
    return t; Ns(e, ""); }
var Fe = globalThis;
var _N = {}, Nn = _N, Ml = "__NG_DI_FLAG__", Nl = class {
    injector;
    constructor(t) { this.injector = t; }
    retrieve(t, n) { let o = Sn(n) || 0; try {
        return this.injector.get(t, o & 8 ? null : Nn, o);
    }
    catch (r) {
        if (Tl(r))
            return r;
        throw r;
    } }
};
function bN(e, t = 0) { let n = Dl(); if (n === void 0)
    throw new T(-203, !1); if (n === null)
    return Hl(e, void 0, t); {
    let o = AN(t), r = n.retrieve(e, o);
    if (Tl(r)) {
        if (o.optional)
            return null;
        throw r;
    }
    return r;
} }
function me(e, t = 0) { return (_g() || bN)(j(e), t); }
function Ss(e) { throw new T(202, !1); }
function E(e, t) { return me(e, Sn(t)); }
function Sn(e) { return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4); }
function AN(e) { return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) }; }
function Sl(e) { let t = []; for (let n = 0; n < e.length; n++) {
    let o = j(e[n]);
    if (Array.isArray(o)) {
        if (o.length === 0)
            throw new T(900, !1);
        let r, i = 0;
        for (let s = 0; s < o.length; s++) {
            let a = o[s], c = RN(a);
            typeof c == "number" ? c === -1 ? r = a.token : i |= c : r = a;
        }
        t.push(me(r, i));
    }
    else
        t.push(me(o));
} return t; }
function go(e, t) { return e[Ml] = t, e.prototype[Ml] = t, e; }
function RN(e) { return e[Ml]; }
function en(e, t) { let n = e.hasOwnProperty(Ge); return n ? e[Ge] : null; }
function bg(e, t, n) { if (e.length !== t.length)
    return !1; for (let o = 0; o < e.length; o++) {
    let r = e[o], i = t[o];
    if (n && (r = n(r), i = n(i)), i !== r)
        return !1;
} return !0; }
function rt(e) { return e.flat(Number.POSITIVE_INFINITY); }
function br(e, t) { e.forEach(n => Array.isArray(n) ? br(n, t) : t(n)); }
function Bl(e, t, n) { t >= e.length ? e.push(n) : e.splice(t, 0, n); }
function Ar(e, t) { return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]; }
function Rr(e, t) { let n = []; for (let o = 0; o < e; o++)
    n.push(t); return n; }
function Ul(e, t, n) { let o = e.length - n; for (; t < o;)
    e[t] = e[t + n], t++; for (; n--;)
    e.pop(); }
function $l(e, t, n, o) { let r = e.length; if (r == t)
    e.push(n, o);
else if (r === 1)
    e.push(o, e[0]), e[0] = n;
else {
    for (r--, e.push(e[r - 1], e[r]); r > t;) {
        let i = r - 2;
        e[r] = e[i], r--;
    }
    e[t] = n, e[t + 1] = o;
} }
function xr(e, t, n) { let o = mo(e, t); return o >= 0 ? e[o | 1] = n : (o = ~o, $l(e, o, t, n)), o; }
function _s(e, t) { let n = mo(e, t); if (n >= 0)
    return e[n | 1]; }
function mo(e, t) { return xN(e, t, 1); }
function xN(e, t, n) { let o = 0, r = e.length >> n; for (; r !== o;) {
    let i = o + (r - o >> 1), s = e[i << n];
    if (t === s)
        return i << n;
    s > t ? r = i : o = i + 1;
} return ~(r << n); }
var Rt = {}, V = [], Qe = new C(""), kr = new C("", -1), bs = new C(""), _t = class {
    get(t, n = Nn) { if (n === Nn) {
        let r = Sg("", -201);
        throw r.name = "\u0275NotFound", r;
    } return n; }
};
function je(e) { return { \u0275providers: e }; }
function Gl(e) { return je([{ provide: Qe, multi: !0, useValue: e }]); }
function Ag(...e) { return { \u0275providers: As(!0, e), \u0275fromNgModule: !0 }; }
function As(e, ...t) { let n = [], o = new Set, r, i = s => { n.push(s); }; return br(t, s => { let a = s; mr(a, i, [], o) && (r ||= [], r.push(a)); }), r !== void 0 && Rg(r, i), n; }
function Rg(e, t) { for (let n = 0; n < e.length; n++) {
    let { ngModule: o, providers: r } = e[n];
    ql(r, i => { t(i, o); });
} }
function mr(e, t, n, o) { if (e = j(e), !e)
    return !1; let r = null, i = hr(e), s = !i && Q(e); if (!i && !s) {
    let c = e.ngModule;
    if (i = hr(c), i)
        r = c;
    else
        return !1;
}
else {
    if (s && !s.standalone)
        return !1;
    r = e;
} let a = o.has(r); if (s) {
    if (a)
        return !1;
    if (o.add(r), s.dependencies) {
        let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let l of c)
            mr(l, t, n, o);
    }
}
else if (i) {
    if (i.imports != null && !a) {
        o.add(r);
        let l;
        br(i.imports, u => { mr(u, t, n, o) && (l ||= [], l.push(u)); }), l !== void 0 && Rg(l, t);
    }
    if (!a) {
        let l = en(r) || (() => new r);
        t({ provide: r, useFactory: l, deps: V }, r), t({ provide: bs, useValue: r, multi: !0 }, r), t({ provide: Qe, useValue: () => me(r), multi: !0 }, r);
    }
    let c = i.providers;
    if (c != null && !a) {
        let l = e;
        ql(c, u => { t(u, l); });
    }
}
else
    return !1; return r !== e && e.providers !== void 0; }
function ql(e, t) { for (let n of e)
    jl(n) && (n = n.\u0275providers), Array.isArray(n) ? ql(n, t) : t(n); }
var kN = B({ provide: String, useValue: B });
function xg(e) { return e !== null && typeof e == "object" && kN in e; }
function ON(e) { return !!(e && e.useExisting); }
function LN(e) { return !!(e && e.useFactory); }
function _n(e) { return typeof e == "function"; }
function kg(e) { return !!e.useClass; }
var Wl = new C(""), gs = {}, Dg = {}, Cl;
function vo() { return Cl === void 0 && (Cl = new _t), Cl; }
var xe = class {
}, nt = class extends xe {
    parent;
    source;
    scopes;
    records = new Map;
    _ngOnDestroyHooks = new Set;
    _onDestroyHooks = [];
    get destroyed() { return this._destroyed; }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, o, r) { super(), this.parent = n, this.source = o, this.scopes = r, bl(t, s => this.processProvider(s)), this.records.set(kr, po(void 0, this)), r.has("environment") && this.records.set(xe, po(void 0, this)); let i = this.records.get(Wl); i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(bs, V, { self: !0 })); }
    retrieve(t, n) { let o = Sn(n) || 0; try {
        return this.get(t, Nn, o);
    }
    catch (r) {
        if (fN(r))
            return r;
        throw r;
    } }
    destroy() { fr(this), this._destroyed = !0; let t = fo(null); try {
        for (let o of this._ngOnDestroyHooks)
            o.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let o of n)
            o();
    }
    finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), fo(t);
    } }
    onDestroy(t) { return fr(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t); }
    runInContext(t) { fr(this); let n = ft(this), o = Me(void 0), r; try {
        return t();
    }
    finally {
        ft(n), Me(o);
    } }
    get(t, n = Nn, o) { if (fr(this), t.hasOwnProperty(Ig))
        return t[Ig](this); let r = Sn(o), i, s = ft(this), a = Me(void 0); try {
        if (!(r & 4)) {
            let l = this.records.get(t);
            if (l === void 0) {
                let u = HN(t) && Nr(t);
                u && this.injectableDefInScope(u) ? l = po(_l(t), gs) : l = null, this.records.set(t, l);
            }
            if (l != null)
                return this.hydrate(t, l, r);
        }
        let c = r & 2 ? vo() : this.parent;
        return n = r & 8 && n === Nn ? null : n, c.get(t, n);
    }
    catch (c) {
        let l = SN(c);
        throw l === -200 || l === -201 ? new T(l, null) : c;
    }
    finally {
        Me(a), ft(s);
    } }
    resolveInjectorInitializers() { let t = fo(null), n = ft(this), o = Me(void 0), r; try {
        let i = this.get(Qe, V, { self: !0 });
        for (let s of i)
            s();
    }
    finally {
        ft(n), Me(o), fo(t);
    } }
    toString() { return "R3Injector[...]"; }
    processProvider(t) { t = j(t); let n = _n(t) ? t : j(t && t.provide), o = FN(t); if (!_n(t) && t.multi === !0) {
        let r = this.records.get(n);
        r || (r = po(void 0, gs, !0), r.factory = () => Sl(r.multi), this.records.set(n, r)), n = t, r.multi.push(t);
    } this.records.set(n, o); }
    hydrate(t, n, o) { let r = fo(null); try {
        if (n.value === Dg)
            throw Vl("");
        return n.value === gs && (n.value = Dg, n.value = n.factory(void 0, o)), typeof n.value == "object" && n.value && VN(n.value) && this._ngOnDestroyHooks.add(n.value), n.value;
    }
    finally {
        fo(r);
    } }
    injectableDefInScope(t) { if (!t.providedIn)
        return !1; let n = j(t.providedIn); return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n); }
    removeOnDestroy(t) { let n = this._onDestroyHooks.indexOf(t); n !== -1 && this._onDestroyHooks.splice(n, 1); }
};
function _l(e) { let t = Nr(e), n = t !== null ? t.factory : en(e); if (n !== null)
    return n; if (e instanceof C)
    throw new T(-204, !1); if (e instanceof Function)
    return PN(e); throw new T(-204, !1); }
function PN(e) { if (e.length > 0)
    throw new T(-204, !1); let n = CN(e); return n !== null ? () => n.factory(e) : () => new e; }
function FN(e) { if (xg(e))
    return po(void 0, e.useValue); {
    let t = zl(e);
    return po(t, gs);
} }
function zl(e, t, n) { let o; if (_n(e)) {
    let r = j(e);
    return en(r) || _l(r);
}
else if (xg(e))
    o = () => j(e.useValue);
else if (LN(e))
    o = () => e.useFactory(...Sl(e.deps || []));
else if (ON(e))
    o = (r, i) => me(j(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
else {
    let r = j(e && (e.useClass || e.provide));
    if (jN(e))
        o = () => new r(...Sl(e.deps));
    else
        return en(r) || _l(r);
} return o; }
function fr(e) { if (e.destroyed)
    throw new T(-205, !1); }
function po(e, t, n = !1) { return { factory: e, value: t, multi: n ? [] : void 0 }; }
function jN(e) { return !!e.deps; }
function VN(e) { return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"; }
function HN(e) { return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"; }
function bl(e, t) { for (let n of e)
    Array.isArray(n) ? bl(n, t) : n && jl(n) ? bl(n.\u0275providers, t) : t(n); }
function Or(e, t) { let n; e instanceof nt ? (fr(e), n = e) : n = new Nl(e); let o, r = ft(n), i = Me(void 0); try {
    return t();
}
finally {
    ft(r), Me(i);
} }
function Rs() { return _g() !== void 0 || Dl() != null; }
function BN(e) { if (!Rs())
    throw new T(-203, !1); }
var $ = 0, m = 1, w = 2, z = 3, ve = 4, ae = 5, he = 6, rn = 7, H = 8, O = 9, Ze = 10, M = 11, sn = 12, Lr = 13, an = 14, ce = 15, cn = 16, xn = 17, pt = 18, Ve = 19, Ql = 20, St = 21, xs = 22, tn = 23, ke = 24, kn = 25, Ye = 26, I = 27, Zl = 1, He = 6, ht = 7, Pr = 8, On = 9, L = 10;
function ee(e) { return Array.isArray(e) && typeof e[Zl] == "object"; }
function X(e) { return Array.isArray(e) && e[Zl] === !0; }
function Yl(e) { return (e.flags & 4) !== 0; }
function Ne(e) { return e.componentOffset > -1; }
function yo(e) { return (e.flags & 1) === 1; }
function Ke(e) { return !!e.template; }
function it(e) { return (e[w] & 512) !== 0; }
function Kl(e) { return (e.type & 16) === 16; }
function Og(e) { return (e[w] & 32) === 32; }
function Je(e) { return (e[w] & 256) === 256; }
function Lg(e, t) { UN(e, t[m]); }
function UN(e, t) { Jl(e); let n = t.data; for (let o = I; o < n.length; o++)
    if (n[o] === e)
        return; nn("This TNode does not belong to this TView."); }
function Jl(e) { Fl(e, "TNode must be defined"), e && typeof e == "object" && e.hasOwnProperty("directiveStylingLast") || nn("Not of type TNode, got: " + e); }
function Pg(e) { Fl(e, "LView must be defined"), Pl(ee(e), !0, "Expecting LView"); }
var q = (function (e) { return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e[e.ATTRIBUTE_NO_BINDING = 6] = "ATTRIBUTE_NO_BINDING", e; })(q || {}), pr, bn = "svg", Fr = "math", Fg = "", Tg = "*", Al = () => Object.create(null);
function $N() { return pr || (pr = Al(), Xt(q.HTML, void 0, [["iframe", ["srcdoc"]], ["*", ["innerHTML", "outerHTML"]]]), Xt(q.STYLE, void 0, [["*", ["style"]]]), Xt(q.URL, void 0, [["*", ["formAction"]], ["area", ["href"]], ["a", ["href", "xlink:href"]], ["form", ["action"]], ["img", ["src"]], ["video", ["src"]]]), Xt(q.URL, Fr, [["*", ["href", "xlink:href"]]]), Xt(q.RESOURCE_URL, void 0, [["base", ["href"]], ["embed", ["src"]], ["frame", ["src"]], ["iframe", ["src"]], ["link", ["href"]], ["object", ["codebase", "data"]]]), Xt(q.URL, bn, [["a", ["href", "xlink:href"]]]), Xt(q.ATTRIBUTE_NO_BINDING, bn, [["animate", ["attributeName", "values", "to", "from"]], ["set", ["to", "attributeName"]], ["animateMotion", ["attributeName"]], ["animateTransform", ["attributeName"]]]), Xt(q.ATTRIBUTE_NO_BINDING, void 0, [["unknown", ["attributeName", "values", "to", "from", "sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]], ["iframe", ["sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]]]), pr); }
function Xt(e, t, n) { let o = t ?? Fg; for (let [r, i] of n) {
    let s = r.toLowerCase();
    for (let a of i) {
        let c = a.toLowerCase(), l = pr[c] ??= Al(), u = l[o] ??= Al();
        u[s] = e;
    }
} }
function jr(e, t, n) { let r = $N()[t.toLowerCase()]; if (!r)
    return q.NONE; let i = e.toLowerCase(), s; if (n) {
    let a = r[n];
    a && (s = a[i] ?? a[Tg]);
} if (s === void 0) {
    let a = r[Fg];
    a && (s = a[i] ?? a[Tg]);
} return s ?? q.NONE; }
function x(e) { for (; Array.isArray(e);)
    e = e[$]; return e; }
function Vr(e) { for (; Array.isArray(e);) {
    if (typeof e[Zl] == "object")
        return e;
    e = e[$];
} return null; }
function Ln(e, t) { return x(t[e]); }
function oe(e, t) { return x(t[e.index]); }
function jg(e, t) { let n = e === null ? -1 : e.index; return n !== -1 ? x(t[n]) : null; }
function ln(e, t) { return e.data[t]; }
function un(e, t) { return e[t]; }
function Hr(e, t, n, o) { n >= e.data.length && (e.data[n] = null, e.blueprint[n] = null), t[n] = o; }
function ye(e, t) { let n = t[e]; return ee(n) ? n : n[$]; }
function Vg(e) { return (e[w] & 4) === 4; }
function ks(e) { return (e[w] & 128) === 128; }
function Hg(e) { return X(e[z]); }
function fe(e, t) { return t == null ? null : e[t]; }
function Xl(e) { e[xn] = 0; }
function Br(e) { e[w] & 1024 || (e[w] |= 1024, ks(e) && Pn(e)); }
function eu(e, t) { for (; e > 0;)
    t = t[an], e--; return t; }
function Eo(e) { return !!(e[w] & 9216 || e[ke]?.dirty); }
function Os(e) { e[Ze].changeDetectionScheduler?.notify(8), e[w] & 64 && (e[w] |= 1024), Eo(e) && Pn(e); }
function Pn(e) { e[Ze].changeDetectionScheduler?.notify(0); let t = qe(e); for (; t !== null && !(t[w] & 8192 || (t[w] |= 8192, !ks(t)));)
    t = qe(t); }
function Io(e, t) { if (Je(e))
    throw new T(911, !1); e[St] === null && (e[St] = []), e[St].push(t); }
function Ls(e, t) { if (e[St] === null)
    return; let n = e[St].indexOf(t); n !== -1 && e[St].splice(n, 1); }
function qe(e) { let t = e[z]; return X(t) ? t[z] : t; }
function tu(e) { return e[rn] ??= []; }
function nu(e) { return e.cleanup ??= []; }
function Bg(e, t, n, o) { let r = tu(t); r.push(n), e.firstCreatePass && nu(e).push(o, r.length - 1); }
var b = { lFrame: Zg(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Rl = !1;
function Ug() { return b.lFrame.elementDepthCount; }
function $g() { b.lFrame.elementDepthCount++; }
function ou() { b.lFrame.elementDepthCount--; }
function Ps() { return b.bindingsEnabled; }
function Ur() { return b.skipHydrationRootTNode !== null; }
function ru(e) { return b.skipHydrationRootTNode === e; }
function iu() { b.bindingsEnabled = !0; }
function Gg(e) { b.skipHydrationRootTNode = e; }
function su() { b.bindingsEnabled = !1; }
function au() { b.skipHydrationRootTNode = null; }
function g() { return b.lFrame.lView; }
function _() { return b.lFrame.tView; }
function cu(e) { return b.lFrame.contextLView = e, e[H]; }
function lu(e) { return b.lFrame.contextLView = null, e; }
function S() { let e = uu(); for (; e !== null && e.type === 64;)
    e = e.parent; return e; }
function uu() { return b.lFrame.currentTNode; }
function Do() { let e = b.lFrame, t = e.currentTNode; return e.isParent ? t : t.parent; }
function st(e, t) { let n = b.lFrame; n.currentTNode = e, n.isParent = t; }
function du() { return b.lFrame.isParent; }
function Fs() { b.lFrame.isParent = !1; }
function fu() { return b.lFrame.contextLView; }
function pu() { return Rl; }
function vr(e) { let t = Rl; return Rl = e, t; }
function Ee() { let e = b.lFrame, t = e.bindingRootIndex; return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t; }
function gt() { return b.lFrame.bindingIndex; }
function hu(e) { return b.lFrame.bindingIndex = e; }
function Te() { return b.lFrame.bindingIndex++; }
function mt(e) { let t = b.lFrame, n = t.bindingIndex; return t.bindingIndex = t.bindingIndex + e, n; }
function qg() { return b.lFrame.inI18n; }
function gu(e) { b.lFrame.inI18n = e; }
function Wg(e, t) { let n = b.lFrame; n.bindingIndex = n.bindingRootIndex = e, js(t); }
function zg() { return b.lFrame.currentDirectiveIndex; }
function js(e) { b.lFrame.currentDirectiveIndex = e; }
function Vs(e) { let t = b.lFrame.currentDirectiveIndex; return t === -1 ? null : e[t]; }
function Hs() { return b.lFrame.currentQueryIndex; }
function $r(e) { b.lFrame.currentQueryIndex = e; }
function GN(e) { let t = e[m]; return t.type === 2 ? t.declTNode : t.type === 1 ? e[ae] : null; }
function mu(e, t, n) { if (n & 4) {
    let r = t, i = e;
    for (; r = r.parent, r === null && !(n & 1);)
        if (r = GN(i), r === null || (i = i[an], r.type & 10))
            break;
    if (r === null)
        return !1;
    t = r, e = i;
} let o = b.lFrame = Qg(); return o.currentTNode = t, o.lView = e, !0; }
function Bs(e) { let t = Qg(), n = e[m]; b.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1; }
function Qg() { let e = b.lFrame, t = e === null ? null : e.child; return t === null ? Zg(e) : t; }
function Zg(e) { let t = { currentTNode: null, isParent: !0, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: !1 }; return e !== null && (e.child = t), t; }
function Yg() { let e = b.lFrame; return b.lFrame = e.parent, e.currentTNode = null, e.lView = null, e; }
var vu = Yg;
function Us() { let e = Yg(); e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0; }
function Kg(e) { return (b.lFrame.contextLView = eu(e, b.lFrame.contextLView))[H]; }
function le() { return b.lFrame.selectedIndex; }
function vt(e) { b.lFrame.selectedIndex = e; }
function Oe() { let e = b.lFrame; return ln(e.tView, e.selectedIndex); }
function yu() { b.lFrame.currentNamespace = bn; }
function Eu() { b.lFrame.currentNamespace = Fr; }
function Iu() { qN(); }
function qN() { b.lFrame.currentNamespace = null; }
function $s() { return b.lFrame.currentNamespace; }
var Jg = !0;
function Gr() { return Jg; }
function at(e) { Jg = e; }
function To() { let e, t; return { promise: new Promise((o, r) => { e = o, t = r; }), resolve: e, reject: t }; }
function xl(e, t = null, n = null, o) { let r = Du(e, t, n, o); return r.resolveInjectorInitializers(), r; }
function Du(e, t = null, n = null, o, r = new Set) { let i = [n || V, Ag(e)], s; return new nt(i, t || vo(), s || null, r); }
var WN = new Set;
function Xg() { return WN; }
var se = class e {
    static THROW_IF_NOT_FOUND = Nn;
    static NULL = new _t;
    static create(t, n) { if (Array.isArray(t))
        return xl({ name: "" }, n, t, ""); {
        let o = t.name ?? "";
        return xl({ name: o }, t.parent, t.providers, o);
    } }
    static \u0275prov = J({ token: e, providedIn: "any", factory: () => me(kr) });
    static __NG_ELEMENT_ID__ = -1;
}, xt = new C(""), De = class {
    static __NG_ELEMENT_ID__ = zN;
    static __NG_ENV_ID__ = t => t;
}, ys = class extends De {
    _lView;
    constructor(t) { super(), this._lView = t; }
    get destroyed() { return Je(this._lView); }
    onDestroy(t) { let n = this._lView; return Io(n, t), () => Ls(n, t); }
};
function zN() { return new ys(g()); }
var Tu = !1, Cu = new C(""), yt = (() => { class e {
    taskId = 0;
    pendingTasks = new Set;
    destroyed = !1;
    pendingTask = new pN(!1);
    debugTaskTracker = E(Cu, { optional: !0 });
    get hasPendingTasks() { return this.destroyed ? !1 : this.pendingTask.value; }
    get hasPendingTasksObservable() { return this.destroyed ? new hN(n => { n.next(!1), n.complete(); }) : this.pendingTask; }
    add() { !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0); let n = this.taskId++; return this.pendingTasks.add(n), this.debugTaskTracker?.add(n), n; }
    has(n) { return this.pendingTasks.has(n); }
    remove(n) { this.pendingTasks.delete(n), this.debugTaskTracker?.remove(n), this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1); }
    ngOnDestroy() { this.pendingTasks.clear(), this.hasPendingTasks && this.pendingTask.next(!1), this.destroyed = !0, this.pendingTask.unsubscribe(); }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), kl = class extends gN {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) { super(), this.__isAsync = t, Rs() && (this.destroyRef = E(De, { optional: !0 }) ?? void 0, this.pendingTasks = E(yt, { optional: !0 }) ?? void 0); }
    emit(t) { let n = R(null); try {
        super.next(t);
    }
    finally {
        R(n);
    } }
    subscribe(t, n, o) { let r = t, i = n || (() => null), s = o; if (t && typeof t == "object") {
        let c = t;
        r = c.next?.bind(c), i = c.error?.bind(c), s = c.complete?.bind(c);
    } this.__isAsync && (i = this.wrapInTimeout(i), r && (r = this.wrapInTimeout(r)), s && (s = this.wrapInTimeout(s))); let a = super.subscribe({ next: r, error: i, complete: s }); return t instanceof mN && t.add(a), a; }
    wrapInTimeout(t) { return n => { let o = this.pendingTasks?.add(); setTimeout(() => { try {
        t(n);
    }
    finally {
        o !== void 0 && this.pendingTasks?.remove(o);
    } }); }; }
}, Nt = kl;
function Es(...e) { }
function wu(e) { let t, n; function o() { e = Es; try {
    n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t);
}
catch { } } return t = setTimeout(() => { e(), o(); }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => { e(), o(); })), () => o(); }
function em(e) { return queueMicrotask(() => e()), () => { e = Es; }; }
var Mu = "isAngularZone", yr = Mu + "_ID", QN = 0, W = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new Nt(!1);
    onMicrotaskEmpty = new Nt(!1);
    onStable = new Nt(!1);
    onError = new Nt(!1);
    constructor(t) { let { enableLongStackTrace: n = !1, shouldCoalesceEventChangeDetection: o = !1, shouldCoalesceRunChangeDetection: r = !1, scheduleInRootZone: i = Tu } = t; if (typeof Zone > "u")
        throw new T(908, !1); Zone.assertZonePatched(); let s = this; s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !r && o, s.shouldCoalesceRunChangeDetection = r, s.callbackScheduled = !1, s.scheduleInRootZone = i, KN(s); }
    static isInAngularZone() { return typeof Zone < "u" && Zone.current.get(Mu) === !0; }
    static assertInAngularZone() { if (!e.isInAngularZone())
        throw new T(909, !1); }
    static assertNotInAngularZone() { if (e.isInAngularZone())
        throw new T(909, !1); }
    run(t, n, o) { return this._inner.run(t, n, o); }
    runTask(t, n, o, r) { let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + r, t, ZN, Es, Es); try {
        return i.runTask(s, n, o);
    }
    finally {
        i.cancelTask(s);
    } }
    runGuarded(t, n, o) { return this._inner.runGuarded(t, n, o); }
    runOutsideAngular(t) { return this._outer.run(t); }
}, ZN = {};
function Nu(e) { if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
        e._nesting++, e.onMicrotaskEmpty.emit(null);
    }
    finally {
        if (e._nesting--, !e.hasPendingMicrotasks)
            try {
                e.runOutsideAngular(() => e.onStable.emit(null));
            }
            finally {
                e.isStable = !0;
            }
    } }
function YN(e) { if (e.isCheckStableRunning || e.callbackScheduled)
    return; e.callbackScheduled = !0; function t() { wu(() => { e.callbackScheduled = !1, Ol(e), e.isCheckStableRunning = !0, Nu(e), e.isCheckStableRunning = !1; }); } e.scheduleInRootZone ? Zone.root.run(() => { t(); }) : e._outer.run(() => { t(); }), Ol(e); }
function KN(e) { let t = () => { YN(e); }, n = QN++; e._inner = e._inner.fork({ name: "angular", properties: { [Mu]: !0, [yr]: n, [yr + n]: !0 }, onInvokeTask: (o, r, i, s, a, c) => { if (JN(c))
        return o.invokeTask(i, s, a, c); try {
        return Cg(e), o.invokeTask(i, s, a, c);
    }
    finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), wg(e);
    } }, onInvoke: (o, r, i, s, a, c, l) => { try {
        return Cg(e), o.invoke(i, s, a, c, l);
    }
    finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !XN(c) && t(), wg(e);
    } }, onHasTask: (o, r, i, s) => { o.hasTask(i, s), r === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, Ol(e), Nu(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask)); }, onHandleError: (o, r, i, s) => (o.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1) }); }
function Ol(e) { e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1; }
function Cg(e) { e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null)); }
function wg(e) { e._nesting--, Nu(e); }
var Er = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new Nt;
    onMicrotaskEmpty = new Nt;
    onStable = new Nt;
    onError = new Nt;
    run(t, n, o) { return t.apply(n, o); }
    runGuarded(t, n, o) { return t.apply(n, o); }
    runOutsideAngular(t) { return t(); }
    runTask(t, n, o, r) { return t.apply(n, o); }
};
function JN(e) { return tm(e, "__ignore_ng_zone__"); }
function XN(e) { return tm(e, "__scheduler_tick__"); }
function tm(e, t) { return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0; }
var bt = class {
    _console = console;
    handleError(t) { this._console.error("ERROR", t); }
}, kt = new C("", { factory: () => { let e = E(W), t = E(xe), n; return o => { e.runOutsideAngular(() => { t.destroyed && !n ? setTimeout(() => { throw o; }) : (n ??= t.get(bt), n.handleError(o)); }); }; } }), Su = { provide: Qe, useValue: () => { let e = E(bt, { optional: !0 }); }, multi: !0 }, eS = new C("", { factory: () => { if (typeof ngServerMode < "u" && ngServerMode)
        return; let e = E(xt).defaultView; if (!e)
        return; let t = E(kt), n = i => { t(i.reason), i.preventDefault(); }, o = i => { i.error ? t(i.error) : t(new Error(i.message, { cause: i })), i.preventDefault(); }, r = () => { e.addEventListener("unhandledrejection", n), e.addEventListener("error", o); }; typeof Zone < "u" ? Zone.root.run(r) : r(), E(De).onDestroy(() => { e.removeEventListener("error", o), e.removeEventListener("unhandledrejection", n); }); } });
function tS() { return je([Gl(() => { E(eS); })]); }
function nS(e) { return null; }
function Et(e, t) { let [n, o, r] = mg(e, t?.equal), i = n, s = i[K]; return i.set = o, i.update = r, i.asReadonly = Co.bind(i), i; }
function Co() { let e = this[K]; if (e.readonlyFn === void 0) {
    let t = () => this();
    t[K] = e, e.readonlyFn = t;
} return e.readonlyFn; }
var It = new C("", { factory: () => oS }), oS = "ng";
var _u = new C(""), rS = new C("", { providedIn: "platform", factory: () => "unknown" }), iS = new C(""), sS = new C("", { factory: () => E(xt).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), nm = { breakpoints: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840], placeholderResolution: 30, disableImageSizeWarning: !1, disableImageLazyLoadWarning: !1 }, aS = new C("", { factory: () => nm });
function om(e) { return e; }
var Ot = (() => { class e {
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => { let n = new e; return (typeof ngServerMode > "u" || !ngServerMode) && (n.store = bu(E(xt), E(It))), n; } });
    store = {};
    onSerializeCallbacks = {};
    get(n, o) { return this.store[n] !== void 0 ? this.store[n] : o; }
    set(n, o) { this.store[n] = o; }
    remove(n) { delete this.store[n]; }
    hasKey(n) { return this.store.hasOwnProperty(n); }
    get isEmpty() { return Object.keys(this.store).length === 0; }
    onSerialize(n, o) { this.onSerializeCallbacks[n] = o; }
    toJson() { for (let n in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(n))
            try {
                this.store[n] = this.onSerializeCallbacks[n]();
            }
            catch (o) {
                console.warn("Exception in onSerialize callback: ", o);
            } return JSON.stringify(this.store).replace(/</g, "\\u003C").replace(/\//g, "\\u002F"); }
} return e; })();
function bu(e, t) { let n = e.getElementById(t + "-state"); if (n?.tagName === "SCRIPT" && n.textContent)
    try {
        return JSON.parse(n.textContent);
    }
    catch (o) {
        console.warn("Exception while restoring TransferState for app " + t, o);
    } return {}; }
function cS(e, t) { if (us() !== null)
    throw new T(-602, !1); }
var wo = (() => { class e {
    view;
    node;
    constructor(n, o) { this.view = n, this.node = o; }
    static __NG_ELEMENT_ID__ = lS;
} return e; })();
function lS() { return new wo(g(), S()); }
var We = class {
}, Mo = new C("", { factory: () => !0 }), uS = new C("", { factory: () => !1 }), Gs = new C(""), qs = (() => { class e {
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new Ll });
} return e; })(), Ll = class {
    dirtyEffectCount = 0;
    queues = new Map;
    add(t) { this.enqueue(t), this.schedule(t); }
    schedule(t) { t.dirty && this.dirtyEffectCount++; }
    remove(t) { let n = t.zone, o = this.queues.get(n); o.has(t) && (o.delete(t), t.dirty && this.dirtyEffectCount--); }
    enqueue(t) { let n = t.zone; this.queues.has(n) || this.queues.set(n, new Set); let o = this.queues.get(n); o.has(t) || o.add(t); }
    flush() { for (; this.dirtyEffectCount > 0;) {
        let t = !1;
        for (let [n, o] of this.queues)
            n === null ? t ||= this.flushQueue(o) : t ||= n.run(() => this.flushQueue(o));
        t || (this.dirtyEffectCount = 0);
    } }
    flushQueue(t) { let n = !1; for (let o of t)
        o.dirty && (this.dirtyEffectCount--, n = !0, o.run()); return n; }
}, Ir = class {
    [K];
    constructor(t) { this[K] = t; }
    destroy() { this[K].destroy(); }
};
function Ws(e, t) { let n = t?.injector ?? E(se), o = t?.manualCleanup !== !0 ? n.get(De) : null, r, i = n.get(wo, null, { optional: !0 }), s = n.get(We); return i !== null ? (r = pS(i.view, s, e), o instanceof ys && o._lView === i.view && (o = null)) : r = hS(e, n.get(qs), s), r.injector = n, o !== null && (r.onDestroyFns = [o.onDestroy(() => r.destroy())]), new Ir(r); }
var rm = ne(F({}, vg), { cleanupFns: void 0, zone: null, onDestroyFns: null, run() { let e = vr(!1); try {
        yg(this);
    }
    finally {
        vr(e);
    } }, cleanup() { if (!this.cleanupFns?.length)
        return; let e = R(null); try {
        for (; this.cleanupFns.length;)
            this.cleanupFns.pop()();
    }
    finally {
        this.cleanupFns = [], R(e);
    } } }), dS = ne(F({}, rm), { consumerMarkedDirty() { this.scheduler.schedule(this), this.notifier.notify(12); }, destroy() { if (Jt(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.scheduler.remove(this); } }), fS = ne(F({}, rm), { consumerMarkedDirty() { this.view[w] |= 8192, Pn(this.view), this.notifier.notify(13); }, destroy() { if (Jt(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.view[tn]?.delete(this); } });
function pS(e, t, n) { let o = Object.create(fS); return o.view = e, o.zone = typeof Zone < "u" ? Zone.current : null, o.notifier = t, o.fn = im(o, n), e[tn] ??= new Set, e[tn].add(o), o.consumerMarkedDirty(o), o; }
function hS(e, t, n) { let o = Object.create(dS); return o.fn = im(o, e), o.scheduler = t, o.notifier = n, o.zone = typeof Zone < "u" ? Zone.current : null, o.scheduler.add(o), o.notifier.notify(12), o; }
function im(e, t) { return () => { t(n => (e.cleanupFns ??= []).push(n)); }; }
function No(e) { return typeof e == "function" && e[K] !== void 0; }
function zs(e) { return No(e) && typeof e.set == "function"; }
var qr = (() => { class e {
    internalPendingTasks = E(yt);
    scheduler = E(We);
    errorHandler = E(kt);
    add() { let n = this.internalPendingTasks.add(); return () => { this.internalPendingTasks.has(n) && (this.scheduler.notify(11), this.internalPendingTasks.remove(n)); }; }
    run(n) { let o = this.add(); try {
        n().catch(this.errorHandler).finally(o);
    }
    catch (r) {
        this.errorHandler(r), o();
    } }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
import { setActiveConsumer as bo } from "@angular/core/primitives/signals";
import { Subject as Nv, Subscription as gS } from "rxjs";
import { map as mS } from "rxjs/operators";
var So = { JSACTION: "jsaction" };
function Ct(e) { return { toString: e }.toString(); }
var P = (function (e) { return e[e.TemplateCreateStart = 0] = "TemplateCreateStart", e[e.TemplateCreateEnd = 1] = "TemplateCreateEnd", e[e.TemplateUpdateStart = 2] = "TemplateUpdateStart", e[e.TemplateUpdateEnd = 3] = "TemplateUpdateEnd", e[e.LifecycleHookStart = 4] = "LifecycleHookStart", e[e.LifecycleHookEnd = 5] = "LifecycleHookEnd", e[e.OutputStart = 6] = "OutputStart", e[e.OutputEnd = 7] = "OutputEnd", e[e.BootstrapApplicationStart = 8] = "BootstrapApplicationStart", e[e.BootstrapApplicationEnd = 9] = "BootstrapApplicationEnd", e[e.BootstrapComponentStart = 10] = "BootstrapComponentStart", e[e.BootstrapComponentEnd = 11] = "BootstrapComponentEnd", e[e.ChangeDetectionStart = 12] = "ChangeDetectionStart", e[e.ChangeDetectionEnd = 13] = "ChangeDetectionEnd", e[e.ChangeDetectionSyncStart = 14] = "ChangeDetectionSyncStart", e[e.ChangeDetectionSyncEnd = 15] = "ChangeDetectionSyncEnd", e[e.AfterRenderHooksStart = 16] = "AfterRenderHooksStart", e[e.AfterRenderHooksEnd = 17] = "AfterRenderHooksEnd", e[e.ComponentStart = 18] = "ComponentStart", e[e.ComponentEnd = 19] = "ComponentEnd", e[e.DeferBlockStateStart = 20] = "DeferBlockStateStart", e[e.DeferBlockStateEnd = 21] = "DeferBlockStateEnd", e[e.DynamicComponentStart = 22] = "DynamicComponentStart", e[e.DynamicComponentEnd = 23] = "DynamicComponentEnd", e[e.HostBindingsUpdateStart = 24] = "HostBindingsUpdateStart", e[e.HostBindingsUpdateEnd = 25] = "HostBindingsUpdateEnd", e; })(P || {}), ga = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, o) { this.previousValue = t, this.currentValue = n, this.firstChange = o; }
    isFirstChange() { return this.firstChange; }
};
function Sv(e, t, n, o) { t !== null ? t.applyValueToInputSignal(t, o) : e[n] = o; }
var _v = null, bv = (() => { _v = sm; let e = () => sm; return e.ngInherit = !0, e; })();
function vS() { return _v; }
function sm(e) { return e.type.prototype.ngOnChanges && (e.setInput = ES), yS; }
function yS() { let e = Av(this), t = e?.current; if (t) {
    let n = e.previous;
    if (n === Rt)
        e.previous = t;
    else
        for (let o in t)
            n[o] = t[o];
    e.current = null, this.ngOnChanges(t);
} }
function ES(e, t, n, o, r) { let i = this.declaredInputs[o], s = Av(e) || IS(e, { previous: Rt, current: null }), a = s.current || (s.current = {}), c = s.previous, l = c[i]; a[i] = new ga(l && l.currentValue, n, c === Rt), Sv(e, t, r, n); }
var ed = "__ngSimpleChanges__";
function Av(e) { return Object.hasOwn(e, ed) && e[ed] || null; }
function IS(e, t) { return e[ed] = t; }
var am = [];
var U = function (e, t = null, n) { for (let o = 0; o < am.length; o++) {
    let r = am[o];
    r(e, t, n);
} };
function DS(e, t, n) { let { ngOnChanges: o, ngOnInit: r, ngDoCheck: i } = t.type.prototype; if (o) {
    let s = vS()(t);
    (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
} r && (n.preOrderHooks ??= []).push(0 - e, r), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)); }
function Rv(e, t) { for (let n = t.directiveStart, o = t.directiveEnd; n < o; n++) {
    let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: l, ngOnDestroy: u } = i;
    s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), c && (e.viewHooks ??= []).push(-n, c), l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)), u != null && (e.destroyHooks ??= []).push(n, u);
} }
function sa(e, t, n) { xv(e, t, 3, n); }
function aa(e, t, n, o) { (e[w] & 3) === n && xv(e, t, n, o); }
function Au(e, t) { let n = e[w]; (n & 3) === t && (n &= 16383, n += 1, e[w] = n); }
function xv(e, t, n, o) { let r = o !== void 0 ? e[xn] & 65535 : 0, i = o ?? -1, s = t.length - 1, a = 0; for (let c = r; c < s; c++)
    if (typeof t[c + 1] == "number") {
        if (a = t[c], o != null && a >= o)
            break;
    }
    else
        t[c] < 0 && (e[xn] += 65536), (a < i || i == -1) && (TS(e, n, t, c), e[xn] = (e[xn] & 4294901760) + c + 2), c++; }
function cm(e, t) { U(P.LifecycleHookStart, e, t); let n = R(null); try {
    t.call(e);
}
finally {
    R(n), U(P.LifecycleHookEnd, e, t);
} }
function TS(e, t, n, o) { let r = n[o] < 0, i = n[o + 1], s = r ? -n[o] : n[o], a = e[s]; r ? e[w] >> 14 < e[xn] >> 16 && (e[w] & 3) === t && (e[w] += 16384, cm(a, i)) : cm(a, i); }
var Lo = -1, $n = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, o, r) { this.factory = t, this.name = r, this.canSeeViewProviders = n, this.injectImpl = o; }
};
function qa(e) { return e != null && typeof e == "object" && (e.insertBeforeIndex === null || typeof e.insertBeforeIndex == "number" || Array.isArray(e.insertBeforeIndex)); }
function kv(e) { return !!(e.type & 128); }
function CS(e) { return (e.flags & 8) !== 0; }
function wS(e) { return (e.flags & 16) !== 0; }
function MS(e, t, n) { let o = 0; for (; o < n.length;) {
    let r = n[o];
    if (typeof r == "number") {
        if (r !== 0)
            break;
        o++;
        let i = n[o++], s = n[o++], a = n[o++];
        e.setAttribute(t, s, a, i);
    }
    else {
        let i = r, s = n[++o];
        NS(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), o++;
    }
} return o; }
function Ov(e) { return e === 3 || e === 4 || e === 6; }
function NS(e) { return e.charCodeAt(0) === 64; }
function Ho(e, t) { if (!(t === null || t.length === 0))
    if (e === null || e.length === 0)
        e = t.slice();
    else {
        let n = -1;
        for (let o = 0; o < t.length; o++) {
            let r = t[o];
            typeof r == "number" ? n = r : n === 0 || (n === -1 || n === 2 ? lm(e, n, r, null, t[++o]) : lm(e, n, r, null, null));
        }
    } return e; }
function lm(e, t, n, o, r) { let i = 0, s = e.length; if (t === -1)
    s = -1;
else
    for (; i < e.length;) {
        let a = e[i++];
        if (typeof a == "number") {
            if (a === t) {
                s = -1;
                break;
            }
            else if (a > t) {
                s = i - 1;
                break;
            }
        }
    } for (; i < e.length;) {
    let a = e[i];
    if (typeof a == "number")
        break;
    if (a === n) {
        r !== null && (e[i + 1] = r);
        return;
    }
    i++, r !== null && i++;
} s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), r !== null && e.splice(i++, 0, r); }
function Lv(e) { return e !== Lo; }
function ma(e) { return e & 32767; }
function SS(e) { return e >> 16; }
function va(e, t) { let n = SS(e), o = t; for (; n > 0;)
    o = o[an], n--; return o; }
var td = !0;
function ya(e) { let t = td; return td = e, t; }
var _S = 256, Pv = _S - 1, Fv = 5, bS = 0, Dt = {};
function AS(e, t, n) { let o; typeof n == "string" ? o = n.charCodeAt(0) || 0 : n.hasOwnProperty(Rn) && (o = n[Rn]), o == null && (o = n[Rn] = bS++); let r = o & Pv, i = 1 << r; t.data[e + (r >> Fv)] |= i; }
function Ea(e, t) { let n = jv(e, t); if (n !== -1)
    return n; let o = t[m]; o.firstCreatePass && (e.injectorIndex = t.length, Ru(o.data, e), Ru(t, null), Ru(o.blueprint, null)); let r = df(e, t), i = e.injectorIndex; if (Lv(r)) {
    let s = ma(r), a = va(r, t), c = a[m].data;
    for (let l = 0; l < 8; l++)
        t[i + l] = a[s + l] | c[s + l];
} return t[i + 8] = r, i; }
function Ru(e, t) { e.push(0, 0, 0, 0, 0, 0, 0, 0, t); }
function jv(e, t) { return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex; }
function df(e, t) { if (e.parent && e.parent.injectorIndex !== -1)
    return e.parent.injectorIndex; let n = 0, o = null, r = t; for (; r !== null;) {
    if (o = $v(r), o === null)
        return Lo;
    if (n++, r = r[an], o.injectorIndex !== -1)
        return o.injectorIndex | n << 16;
} return Lo; }
function nd(e, t, n) { AS(e, t, n); }
function RS(e, t) { if (t === "class")
    return e.classes; if (t === "style")
    return e.styles; let n = e.attrs; if (n) {
    let o = n.length, r = 0;
    for (; r < o;) {
        let i = n[r];
        if (Ov(i))
            break;
        if (i === 0)
            r = r + 2;
        else if (typeof i == "number")
            for (r++; r < o && typeof n[r] == "string";)
                r++;
        else {
            if (i === t)
                return n[r + 1];
            r = r + 2;
        }
    }
} return null; }
function Vv(e, t, n) { if (n & 8 || e !== void 0)
    return e; Ns(t, "NodeInjector"); }
function Hv(e, t, n, o) { if (n & 8 && o === void 0 && (o = null), (n & 3) === 0) {
    let r = e[O], i = Me(void 0);
    try {
        return r ? r.get(t, o, n & 8) : Hl(t, o, n & 8);
    }
    finally {
        Me(i);
    }
} return Vv(o, t, n); }
function ff(e, t, n, o = 0, r) { if (e !== null) {
    if (t[w] & 2048 && !(o & 2)) {
        let s = LS(e, t, n, o, Dt);
        if (s !== Dt)
            return s;
    }
    let i = Bv(e, t, n, o, Dt);
    if (i !== Dt)
        return i;
} return Hv(t, n, o, r); }
function Bv(e, t, n, o, r) { let i = kS(n); if (typeof i == "function") {
    if (!mu(t, e, o))
        return o & 1 ? Vv(r, n, o) : Hv(t, n, o, r);
    try {
        let s;
        if (s = i(o), s == null && !(o & 8))
            Ns(n);
        else
            return s;
    }
    finally {
        vu();
    }
}
else if (typeof i == "number") {
    let s = null, a = jv(e, t), c = Lo, l = o & 1 ? t[ce][ae] : null;
    for ((a === -1 || o & 4) && (c = a === -1 ? df(e, t) : t[a + 8], c === Lo || !dm(o, !1) ? a = -1 : (s = t[m], a = ma(c), t = va(c, t))); a !== -1;) {
        let u = t[m];
        if (um(i, a, u.data)) {
            let d = xS(a, t, n, s, o, l);
            if (d !== Dt)
                return d;
        }
        c = t[a + 8], c !== Lo && dm(o, t[m].data[a + 8] === l) && um(i, a, t) ? (s = u, a = ma(c), t = va(c, t)) : a = -1;
    }
} return r; }
function xS(e, t, n, o, r, i) { let s = t[m], a = s.data[e + 8], c = o == null ? Ne(a) && td : o != s && (a.type & 3) !== 0, l = r & 1 && i === a, u = ca(a, s, n, c, l); return u !== null ? ci(t, s, u, a, r) : Dt; }
function ca(e, t, n, o, r) { let i = e.providerIndexes, s = t.data, a = i & 1048575, c = e.directiveStart, l = e.directiveEnd, u = i >> 20, d = o ? a : a + u, f = r ? a + u : l; for (let p = d; p < f; p++) {
    let h = s[p];
    if (p < c && n === h || p >= c && h.type === n)
        return p;
} if (r) {
    let p = s[c];
    if (p && Ke(p) && p.type === n)
        return c;
} return null; }
function ci(e, t, n, o, r) { let i = e[n], s = t.data; if (i instanceof $n) {
    let a = i;
    if (a.resolving)
        throw Vl("");
    let c = ya(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[n].type || s[n], u, d = a.injectImpl ? Me(a.injectImpl) : null, f = mu(e, o, 0);
    try {
        i = e[n] = a.factory(void 0, r, s, e, o), t.firstCreatePass && n >= o.directiveStart && DS(n, s[n], t);
    }
    finally {
        d !== null && Me(d), ya(c), a.resolving = !1, vu();
    }
} return i; }
function kS(e) { if (typeof e == "string")
    return e.charCodeAt(0) || 0; let t = e.hasOwnProperty(Rn) ? e[Rn] : void 0; return typeof t == "number" ? t >= 0 ? t & Pv : OS : t; }
function um(e, t, n) { let o = 1 << e; return !!(n[t + (e >> Fv)] & o); }
function dm(e, t) { return !(e & 2) && !(e & 1 && t); }
function pf(e) { return e._lView; }
function bi(e) { return e._tNode; }
var Se = class {
    _tNode;
    _lView;
    constructor(t, n) { this._tNode = t, this._lView = n; }
    get(t, n, o) { return ff(this._tNode, this._lView, t, Sn(o), n); }
};
function OS() { return new Se(S(), g()); }
function Uv(e) { return Ct(() => { let t = e.prototype.constructor, n = t[Ge] || od(t), o = Object.prototype, r = Object.getPrototypeOf(e.prototype).constructor; for (; r && r !== o;) {
    let i = r[Ge] || od(r);
    if (i && i !== n)
        return i;
    r = Object.getPrototypeOf(r);
} return i => new i; }); }
function od(e) { return wr(e) ? () => { let t = od(j(e)); return t && t(); } : en(e); }
function LS(e, t, n, o, r) { let i = e, s = t; for (; i !== null && s !== null && s[w] & 2048 && !it(s);) {
    let a = Bv(i, s, n, o | 2, Dt);
    if (a !== Dt)
        return a;
    let c = i.parent;
    if (!c) {
        let l = s[Ql];
        if (l) {
            let u = l.get(n, Dt, o & -5);
            if (u !== Dt)
                return u;
        }
        c = $v(s), s = s[an];
    }
    i = c;
} return r; }
function $v(e) { let t = e[m], n = t.type; return n === 2 ? t.declTNode : n === 1 ? e[ae] : null; }
function Wa(e) { return RS(S(), e); }
var PS = () => (typeof requestIdleCallback < "u" ? requestIdleCallback : e => setTimeout(e)).bind(globalThis), FS = () => (typeof requestIdleCallback < "u" ? cancelIdleCallback : clearTimeout).bind(globalThis), za = new C("", { factory: () => new rd });
function jS(e) { return je([{ provide: za, useExisting: e }]); }
var rd = class {
    requestIdleCallback = PS();
    cancelIdleCallback = FS();
    requestOnIdle(t, n) { return this.requestIdleCallback(t, n); }
    cancelOnIdle(t) { return this.cancelIdleCallback(t); }
}, Ao = "__annotations__", Ro = "__parameters__", xo = "__prop__metadata__";
function zo(e, t, n, o, r) { return Ct(() => { let i = hf(t); function s(...a) { if (this instanceof s)
    return i.call(this, ...a), this; let c = new s(...a); return function (u) { return r && r(u, ...a), (u.hasOwnProperty(Ao) ? u[Ao] : Object.defineProperty(u, Ao, { value: [] })[Ao]).push(c), u; }; } return n && (s.prototype = Object.create(n.prototype)), s.prototype.ngMetadataName = e, s.annotationCls = s, s; }); }
function hf(e) { return function (...n) { if (e) {
    let o = e(...n);
    for (let r in o)
        this[r] = o[r];
} }; }
function Qo(e, t, n) { return Ct(() => { let o = hf(t); function r(...i) { if (this instanceof r)
    return o.apply(this, i), this; let s = new r(...i); return a.annotation = s, a; function a(c, l, u) { let d = c.hasOwnProperty(Ro) ? c[Ro] : Object.defineProperty(c, Ro, { value: [] })[Ro]; for (; d.length <= u;)
    d.push(null); return (d[u] = d[u] || []).push(s), c; } } return r.prototype.ngMetadataName = e, r.annotationCls = r, r; }); }
function Bt(e, t, n, o) { return Ct(() => { let r = hf(t); function i(...s) { if (this instanceof i)
    return r.apply(this, s), this; let a = new i(...s); function c(l, u) { if (l === void 0)
    throw new Error("Standard Angular field decorators are not supported in JIT mode."); let d = l.constructor, f = d.hasOwnProperty(xo) ? d[xo] : Object.defineProperty(d, xo, { value: {} })[xo]; f[u] = f.hasOwnProperty(u) && f[u] || [], f[u].unshift(a); } return c; } return n && (i.prototype = Object.create(n.prototype)), i.prototype.ngMetadataName = e, i.annotationCls = i, i; }); }
function te(e) { let t = Fe.ng; if (t && t.\u0275compilerFacade)
    return t.\u0275compilerFacade; throw new Error("JIT compiler unavailable"); }
function Ut(e) { return { token: e.token, providedIn: e.autoProvided === !1 ? null : "root", factory: e.factory, value: void 0 }; }
var Ia = { \u0275\u0275defineInjectable: J, \u0275\u0275defineInjector: Mr, \u0275\u0275defineService: Ut, \u0275\u0275inject: me, \u0275\u0275invalidFactoryDep: Ss, resolveForwardRef: j }, Gv = Function;
function Qs(e) { return typeof e == "function"; }
var VS = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*(arguments|(?:[^()]+\(\[\],)?[^()]+\(arguments\).*)\)/, HS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{/, BS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(/, US = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(\)\s*{[^}]*super\(\.\.\.arguments\)/;
function $S(e) { return VS.test(e) || US.test(e) || HS.test(e) && !BS.test(e); }
var Da = class {
    _reflect;
    constructor(t) { this._reflect = t || Fe.Reflect; }
    factory(t) { return (...n) => new t(...n); }
    _zipTypesAndAnnotations(t, n) { let o; typeof t > "u" ? o = Rr(n.length) : o = Rr(t.length); for (let r = 0; r < o.length; r++)
        typeof t > "u" ? o[r] = [] : t[r] && t[r] != Object ? o[r] = [t[r]] : o[r] = [], n && n[r] != null && (o[r] = o[r].concat(n[r])); return o; }
    _ownParameters(t, n) { let o = t.toString(); if ($S(o))
        return null; if (t.parameters && t.parameters !== n.parameters)
        return t.parameters; let r = t.ctorParameters; if (r && r !== n.ctorParameters) {
        let a = typeof r == "function" ? r() : r, c = a.map(u => u && u.type), l = a.map(u => u && xu(u.decorators));
        return this._zipTypesAndAnnotations(c, l);
    } let i = t.hasOwnProperty(Ro) && t[Ro], s = this._reflect && this._reflect.getOwnMetadata && this._reflect.getOwnMetadata("design:paramtypes", t); return s || i ? this._zipTypesAndAnnotations(s, i) : Rr(t.length); }
    parameters(t) { if (!Qs(t))
        return []; let n = Zs(t), o = this._ownParameters(t, n); return !o && n !== Object && (o = this.parameters(n)), o || []; }
    _ownAnnotations(t, n) { if (t.annotations && t.annotations !== n.annotations) {
        let o = t.annotations;
        return typeof o == "function" && o.annotations && (o = o.annotations), o;
    } return t.decorators && t.decorators !== n.decorators ? xu(t.decorators) : t.hasOwnProperty(Ao) ? t[Ao] : null; }
    annotations(t) { if (!Qs(t))
        return []; let n = Zs(t), o = this._ownAnnotations(t, n) || []; return (n !== Object ? this.annotations(n) : []).concat(o); }
    _ownPropMetadata(t, n) { if (t.propMetadata && t.propMetadata !== n.propMetadata) {
        let o = t.propMetadata;
        return typeof o == "function" && o.propMetadata && (o = o.propMetadata), o;
    } if (t.propDecorators && t.propDecorators !== n.propDecorators) {
        let o = t.propDecorators, r = {};
        return Object.keys(o).forEach(i => { r[i] = xu(o[i]); }), r;
    } return t.hasOwnProperty(xo) ? t[xo] : null; }
    propMetadata(t) { if (!Qs(t))
        return {}; let n = Zs(t), o = {}; if (n !== Object) {
        let i = this.propMetadata(n);
        Object.keys(i).forEach(s => { o[s] = i[s]; });
    } let r = this._ownPropMetadata(t, n); return r && Object.keys(r).forEach(i => { let s = []; o.hasOwnProperty(i) && s.push(...o[i]), s.push(...r[i]), o[i] = s; }), o; }
    ownPropMetadata(t) { return Qs(t) ? this._ownPropMetadata(t, Zs(t)) || {} : {}; }
    hasLifecycleHook(t, n) { return t instanceof Gv && n in t.prototype; }
};
function xu(e) { return e ? e.map(t => { let o = t.type.annotationCls, r = t.args ? t.args : []; return new o(...r); }) : []; }
function Zs(e) { let t = e.prototype ? Object.getPrototypeOf(e.prototype) : null; return (t ? t.constructor : null) || Object; }
var qv = go(Qo("Inject", e => ({ token: e })), -1), Wv = go(Qo("Optional"), 8), zv = go(Qo("Self"), 2), Qv = go(Qo("SkipSelf"), 4), Zv = go(Qo("Host"), 1), Yv = Qo("Attribute", e => ({ attributeName: e, __NG_ELEMENT_ID__: () => Wa(e) })), fm = null;
function gf() { return fm = fm || new Da; }
function Ai(e) { return Kv(gf().parameters(e)); }
function Kv(e) { return e.map(t => GS(t)); }
function GS(e) { let t = { token: null, attribute: null, host: !1, optional: !1, self: !1, skipSelf: !1 }; if (Array.isArray(e) && e.length > 0)
    for (let n = 0; n < e.length; n++) {
        let o = e[n];
        if (o === void 0)
            continue;
        let r = Object.getPrototypeOf(o);
        if (o instanceof Wv || r.ngMetadataName === "Optional")
            t.optional = !0;
        else if (o instanceof Qv || r.ngMetadataName === "SkipSelf")
            t.skipSelf = !0;
        else if (o instanceof zv || r.ngMetadataName === "Self")
            t.self = !0;
        else if (o instanceof Zv || r.ngMetadataName === "Host")
            t.host = !0;
        else if (o instanceof qv)
            t.token = o.token;
        else if (o instanceof Yv) {
            if (o.attributeName === void 0)
                throw new T(-204, !1);
            t.attribute = o.attributeName;
        }
        else
            t.token = o;
    }
else
    e === void 0 || Array.isArray(e) && e.length === 0 ? t.token = null : t.token = e; return t; }
function qS(e, t) { let n = null, o = null; e.hasOwnProperty(on) || Object.defineProperty(e, on, { get: () => (n === null && (n = te({ usage: 0, kind: "injectable", type: e }).compileInjectable(Ia, `ng:///${e.name}/\u0275prov.js`, ZS(e, t))), n) }), e.hasOwnProperty(Ge) || Object.defineProperty(e, Ge, { get: () => { if (o === null) {
        let r = te({ usage: 0, kind: "injectable", type: e });
        o = r.compileFactory(Ia, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, typeArgumentCount: 0, deps: Ai(e), target: r.FactoryTarget.Injectable });
    } return o; }, configurable: !0 }); }
var WS = B({ provide: String, useValue: B });
function pm(e) { return e.useClass !== void 0; }
function zS(e) { return WS in e; }
function hm(e) { return e.useFactory !== void 0; }
function QS(e) { return e.useExisting !== void 0; }
function ZS(e, t) { let n = t || { providedIn: null }, o = { name: e.name, type: e, typeArgumentCount: 0, providedIn: n.providedIn }; return (pm(n) || hm(n)) && n.deps !== void 0 && (o.deps = Kv(n.deps)), pm(n) ? o.useClass = n.useClass : zS(n) ? o.useValue = n.useValue : hm(n) ? o.useFactory = n.useFactory : QS(n) && (o.useExisting = n.useExisting), o; }
var YS = zo("Injectable", void 0, void 0, void 0, (e, t) => qS(e, t));
function KS(e, t) { let n = null, o = null; e.hasOwnProperty(on) || Object.defineProperty(e, on, { get: () => (n === null && (n = te({ usage: 0, kind: "service", type: e }).compileService(Ia, `ng:///${e.name}/\u0275prov.js`, JS(e, t))), n) }), e.hasOwnProperty(Ge) || Object.defineProperty(e, Ge, { get: () => { if (o === null) {
        let r = te({ usage: 0, kind: "service", type: e });
        o = r.compileFactory(Ia, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, typeArgumentCount: 0, deps: Ai(e), target: r.FactoryTarget.Service });
    } return o; }, configurable: !0 }); }
function JS(e, t) { return { name: e.name, type: e, typeArgumentCount: 0, autoProvided: t?.autoProvided, factory: t?.factory }; }
var XS = zo("Service", void 0, void 0, void 0, (e, t) => KS(e, t));
function e_() { return Zo(S(), g()); }
function Zo(e, t) { return new Ri(oe(e, t)); }
var Ri = (() => { class e {
    nativeElement;
    constructor(n) { this.nativeElement = n; }
    static __NG_ELEMENT_ID__ = e_;
} return e; })();
function Jv(e) { return e instanceof Ri ? e.nativeElement : e; }
function t_() { return this._results[Symbol.iterator](); }
var Ta = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() { return this._changes ??= new Nv; }
    constructor(t = !1) { this._emitDistinctChangesOnly = t; }
    get(t) { return this._results[t]; }
    map(t) { return this._results.map(t); }
    filter(t) { return this._results.filter(t); }
    find(t) { return this._results.find(t); }
    reduce(t, n) { return this._results.reduce(t, n); }
    forEach(t) { this._results.forEach(t); }
    some(t) { return this._results.some(t); }
    toArray() { return this._results.slice(); }
    toString() { return this._results.toString(); }
    reset(t, n) { this.dirty = !1; let o = rt(t); (this._changesDetected = !bg(this._results, o, n)) && (this._results = o, this.length = o.length, this.last = o[this.length - 1], this.first = o[0]); }
    notifyOnChanges() { this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this); }
    onDirty(t) { this._onDirty = t; }
    setDirty() { this.dirty = !0, this._onDirty?.(); }
    destroy() { this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe()); }
    [Symbol.iterator] = t_;
}, eo = "ngSkipHydration", n_ = "ngskiphydration";
function mf(e) { let t = e.mergedAttrs; if (t === null)
    return !1; for (let n = 0; n < t.length; n += 2) {
    let o = t[n];
    if (typeof o == "number")
        return !1;
    if (typeof o == "string" && o.toLowerCase() === n_)
        return !0;
} return !1; }
function Xv(e) { return e.hasAttribute(eo); }
function li(e) { return (e.flags & 128) === 128; }
function Yo(e) { if (li(e))
    return !0; let t = e.parent; for (; t;) {
    if (li(e) || mf(t))
        return !0;
    t = t.parent;
} return !1; }
function ey(e) { return li(e) || mf(e) || Yo(e); }
var Qa = (function (e) { return e[e.OnPush = 0] = "OnPush", e[e.Eager = 1] = "Eager", e[e.Default = 1] = "Default", e; })(Qa || {}), Za = new Map, o_ = 0;
function r_() { return o_++; }
function i_(e) { Za.set(e[Ve], e); }
function ty(e) { return Za.get(e) || null; }
function id(e) { Za.delete(e[Ve]); }
function s_() { return Za; }
var Ca = class {
    lViewId;
    nodeIndex;
    native;
    component;
    directives;
    localRefs;
    get lView() { return ty(this.lViewId); }
    constructor(t, n, o) { this.lViewId = t, this.nodeIndex = n, this.native = o; }
};
function _e(e) { let t = la(e); if (t) {
    if (ee(t)) {
        let n = t, o, r, i;
        if (ny(e)) {
            if (o = u_(n, e), o == -1)
                throw new Error("The provided component was not found in the application");
            r = e;
        }
        else if (c_(e)) {
            if (o = d_(n, e), o == -1)
                throw new Error("The provided directive was not found in the application");
            i = oy(o, n);
        }
        else if (o = mm(n, e), o == -1)
            return null;
        let s = x(n[o]), a = la(s), c = a && !Array.isArray(a) ? a : gm(n, o, s);
        if (r && c.component === void 0 && (c.component = r, Be(c.component, c)), i && c.directives === void 0) {
            c.directives = i;
            for (let l = 0; l < i.length; l++)
                Be(i[l], c);
        }
        Be(c.native, c), t = c;
    }
}
else {
    let n = e, o = n;
    for (; o = o.parentNode;) {
        let r = la(o);
        if (r) {
            let i = Array.isArray(r) ? r : r.lView;
            if (!i)
                return null;
            let s = mm(i, n);
            if (s >= 0) {
                let a = x(i[s]), c = gm(i, s, a);
                Be(a, c), t = c;
                break;
            }
        }
    }
} return t || null; }
function gm(e, t, n) { return new Ca(e[Ve], t, n); }
var sd = "__ngContext__";
function Be(e, t) { ee(t) ? (e[sd] = t[Ve], i_(t)) : e[sd] = t; }
function la(e) { let t = e[sd]; return typeof t == "number" ? ty(t) : t || null; }
function a_(e) { let t = la(e); return t ? ee(t) ? t : t.lView : null; }
function ny(e) { return e && e.constructor && e.constructor.\u0275cmp; }
function c_(e) { return e && e.constructor && e.constructor.\u0275dir; }
function mm(e, t) { let n = e[m]; for (let o = I; o < n.bindingStartIndex; o++)
    if (x(e[o]) === t)
        return o; return -1; }
function l_(e) { if (e.child)
    return e.child; if (e.next)
    return e.next; for (; e.parent && !e.parent.next;)
    e = e.parent; return e.parent && e.parent.next; }
function u_(e, t) { let n = e[m].components; if (n)
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        if (ye(r, e)[H] === t)
            return r;
    }
else if (ye(I, e)[H] === t)
    return I; return -1; }
function d_(e, t) { let n = e[m].firstChild; for (; n;) {
    let o = n.directiveStart, r = n.directiveEnd;
    for (let i = o; i < r; i++)
        if (e[i] === t)
            return n.index;
    n = l_(n);
} return -1; }
function oy(e, t) { let n = t[m].data[e]; if (n.directiveStart === 0)
    return V; let o = []; for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let i = t[r];
    ny(i) || o.push(i);
} return o; }
function f_(e, t) { let n = t[m].data[e]; return Ne(n) ? t[n.directiveStart + n.componentOffset] : null; }
function p_(e, t) { let n = e[m].data[t]; if (n && n.localNames) {
    let o = {}, r = n.index + 1;
    for (let i = 0; i < n.localNames.length; i += 2)
        o[n.localNames[i]] = e[r], r++;
    return o;
} return null; }
function ry(e) { return sy(e[sn]); }
function iy(e) { return sy(e[ve]); }
function sy(e) { for (; e !== null && !X(e);)
    e = e[ve]; return e; }
function* h_(e, t) { let n = e.child; for (; n;)
    yield [n, t], n = n.next; if (e.componentOffset > -1) {
    let r = ye(e.index, t);
    if (ee(r)) {
        let s = r[m].firstChild;
        for (; s;)
            yield [s, r], s = s.next;
    }
} let o = t[e.index]; if (X(o))
    for (let r = L; r < o.length; r++) {
        let i = o[r], a = i[m].firstChild;
        for (; a;)
            yield [a, i], a = a.next;
    } }
function* g_(e) { let n = e[m].firstChild; for (; n;)
    yield* vl(ay(n, e)), n = n.next; }
function* ay(e, t) { yield [e, t]; for (let [n, o] of h_(e, t))
    yield* vl(ay(n, o)); }
function* vf(e) { for (let [t, n] of g_(e))
    t.directiveEnd > t.directiveStart && (yield [t, n]); }
function vm(e) { let t = _e(e); if (t === null)
    return null; if (t.component === void 0) {
    let n = t.lView;
    if (n === null)
        return null;
    t.component = f_(t.nodeIndex, n);
} return t.component; }
function m_(e) { M_(e); let t = _e(e), n = t ? t.lView : null; return n === null ? null : n[H]; }
function v_(e) { let t = _e(e), n = t ? t.lView : null; if (n === null)
    return null; let o; for (; n[m].type === 2 && (o = qe(n));)
    n = o; return it(n) ? null : n[H]; }
function yf(e) { let t = _e(e), n = t ? t.lView : null; if (n === null)
    return se.NULL; let o = n[m].data[t.nodeIndex]; return new Se(o, n); }
function y_(e) { let t = _e(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = o.data[t.nodeIndex], i = [], s = r.providerIndexes & 1048575, a = r.directiveEnd; for (let c = s; c < a; c++) {
    let l = o.data[c];
    w_(l) && (l = l.type), i.push(l);
} return i; }
function E_(e) { if (e instanceof Text)
    return []; let t = _e(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = t.nodeIndex; return o?.data[r] ? (t.directives === void 0 && (t.directives = oy(r, n)), t.directives === null ? [] : [...t.directives]) : []; }
var cy = (function (e) { return e[e.Default = 0] = "Default", e[e.OnPush = 1] = "OnPush", e; })(cy || {}), ly = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 1] = "None", e; })(ly || {});
function I_(e) { let t = _e(e); if (t === null)
    return {}; if (t.localRefs === void 0) {
    let n = t.lView;
    if (n === null)
        return {};
    t.localRefs = p_(n, t.nodeIndex);
} return t.localRefs || {}; }
function D_(e) { return _e(e).native; }
function T_(e) { let t = _e(e), n = t === null ? null : t.lView; if (n === null)
    return []; let o = n[m], r = n[rn], i = o.cleanup, s = []; if (i && r)
    for (let a = 0; a < i.length;) {
        let c = i[a++], l = i[a++];
        if (typeof c == "string") {
            let u = c, d = x(n[l]), f = r[i[a++]], p = i[a++], h = typeof p == "boolean" || p >= 0 ? "dom" : "output", v = typeof p == "boolean" ? p : !1;
            e == d && s.push({ element: e, name: u, callback: f, useCapture: v, type: h });
        }
    } return s.sort(C_), s; }
function C_(e, t) { return e.name == t.name ? 0 : e.name < t.name ? -1 : 1; }
function w_(e) { return e.type !== void 0 && e.declaredInputs !== void 0 && e.resolveHostDirectives !== void 0; }
function M_(e) { if (typeof Element < "u" && !(e instanceof Element))
    throw new Error("Expecting instance of DOM Element"); }
var ad;
function N_(e) { ad = e; }
function xi() { if (ad !== void 0)
    return ad; if (typeof document < "u")
    return document; throw new T(210, !1); }
var Ef = "h", If = "b", uy = "f", dy = "n", ki = "e", Ya = "t", Ko = "c", Oi = "x", jt = "r", Ka = "i", Li = "n", Jo = "d", Ja = "l", Xa = "di", Pi = "s", Df = "p", Fi = "t", to = new C(""), fy = !1, Tf = new C("", { factory: () => fy }), Cf = new C(""), ec = new C(""), wf = !1, py = new C("", { factory: () => [] }), Mf = new C(""), ji = new C("", { factory: () => new Map }), S_ = new C(""), wa = { passive: !0, capture: !0 }, ku = new WeakMap, Ou = new WeakMap, fn = new WeakMap, Ma = ["click", "keydown"], Na = ["mouseenter", "mouseover", "focusin"], Ys = new Map, ui = class {
    callbacks = new Set;
    listener = () => { for (let t of this.callbacks)
        t(); };
};
function hy(e, t) { let n = Ou.get(e); if (!n) {
    n = new ui, Ou.set(e, n);
    for (let o of Ma)
        e.addEventListener(o, n.listener, wa);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    Ou.delete(e);
    for (let i of Ma)
        e.removeEventListener(i, r, wa);
} }; }
function gy(e, t) { let n = ku.get(e); if (!n) {
    n = new ui, ku.set(e, n);
    for (let o of Na)
        e.addEventListener(o, n.listener, wa);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    for (let i of Na)
        e.removeEventListener(i, r, wa);
    ku.delete(e);
} }; }
function __(e) { let t = my(e); return new IntersectionObserver(n => { for (let o of n)
    o.isIntersecting && fn.has(o.target) && fn.get(o.target)?.get(t)?.listener(); }, e); }
function b_(e, t, n, o) { let r = my(o), i = fn.get(e)?.get(r); Ys.has(r) || Ys.set(r, { observer: n(o), count: 0 }); let s = Ys.get(r); if (!i) {
    i = new ui, s.observer.observe(e);
    let a = fn.get(e);
    a ? a.set(r, i) : (a = new Map, fn.set(e, a)), a.set(r, i), s.count++;
} return i.callbacks.add(t), () => { if (fn.get(e)?.has(r)) {
    if (i.callbacks.delete(t), i.callbacks.size === 0) {
        s.observer.unobserve(e), s.count--;
        let a = fn.get(e);
        a && (a.delete(r), a.size === 0 && fn.delete(e));
    }
    s.count === 0 && (s.observer.disconnect(), Ys.delete(r));
} }; }
function my(e) {
    return e ? `${e.rootMargin}/${typeof e.threshold == "number" ? e.threshold : e.threshold?.join(`
`)}` : "";
}
var Xo = "ngb";
function Nf(e, t, n = null) { if (t.length === 0 || e.nodeType !== Node.ELEMENT_NODE)
    return; let o = e.getAttribute(So.JSACTION), r = t.reduce((s, a) => (o?.indexOf(a) ?? -1) === -1 ? s + a + ":;" : s, ""); e.setAttribute(So.JSACTION, `${o ?? ""}${r}`); let i = n ?? ""; i !== "" && r.length > 0 && e.setAttribute(Xo, i); }
var vy = (e, t, n) => { let o = e, r = o.__jsaction_fns ?? new Map, i = r.get(t) ?? []; i.push(n), r.set(t, i), o.__jsaction_fns = r; }, Sf = (e, t) => { let n = e, o = n.getAttribute(Xo) ?? "", r = t.get(o) ?? new Set; r.has(n) || r.add(n), t.set(o, r); };
function A_(e, t) { if (e.length > 0) {
    let n = [];
    for (let r of e)
        t.has(r) && (n = [...n, ...t.get(r)]);
    new Set(n).forEach(_f);
} }
var _f = e => { e.removeAttribute(So.JSACTION), e.removeAttribute(Xo), e.__jsaction_fns = void 0; }, bf = new C("", { factory: () => ({}) }), cd = new WeakMap;
function R_(e, t) { if (e == null || typeof e != "object")
    return; let n = cd.get(e); n || (n = new WeakSet, cd.set(e, n)), n.add(t); }
function Af(e, t) { let n = t?.__jsaction_fns?.get(e.type); if (!(!n || !t?.isConnected) && !(t && cd.get(e)?.has(t)))
    for (let o of n)
        o(e); }
var ld = new Map;
function yy(e, t) { return ld.set(e, t), () => ld.delete(e); }
var ym = !1, Ey = (e, t, n, o) => { };
function x_(e, t, n, o) { Ey(e, t, n, o); }
function Iy() { ym || (Ey = (e, t, n, o) => { let r = e[O].get(It); ld.get(r)?.(t, n, o); }, ym = !0); }
var $t = new C(""), k_ = (() => { class e {
    registry = new Map;
    cleanupFns = new Map;
    jsActionMap = E(ji);
    contract = E(bf);
    add(n, o) { if (this.registry.set(n, o), this.awaitingCallbacks.has(n)) {
        let r = this.awaitingCallbacks.get(n);
        for (let i of r)
            i();
    } }
    get(n) { return this.registry.get(n) ?? null; }
    has(n) { return this.registry.has(n); }
    cleanup(n) { A_(n, this.jsActionMap); for (let o of n)
        this.registry.delete(o), this.jsActionMap.delete(o), this.invokeTriggerCleanupFns(o), this.hydrating.delete(o), this.awaitingCallbacks.delete(o); this.size === 0 && this.contract.instance?.cleanUp(); }
    get size() { return this.registry.size; }
    addCleanupFn(n, o) { let r = []; this.cleanupFns.has(n) && (r = this.cleanupFns.get(n)), r.push(o), this.cleanupFns.set(n, r); }
    invokeTriggerCleanupFns(n) { let o = this.cleanupFns.get(n) ?? []; for (let r of o)
        r(); this.cleanupFns.delete(n); }
    hydrating = new Map;
    awaitingCallbacks = new Map;
    awaitParentBlock(n, o) { let r = this.awaitingCallbacks.get(n) ?? []; r.push(o), this.awaitingCallbacks.set(n, r); }
    static \u0275prov = J({ token: e, providedIn: null, factory: () => new e });
} return e; })();
function er(e) { return (e.flags & 32) === 32; }
var Dy = "__nghData__", tc = Dy, Ty = "__nghDeferData__", nc = Ty;
function O_(e) { return e === Dy || e === Ty; }
var Po = "ngh", Cy = "nghm", wy = () => null;
function L_(e, t, n = !1) { let o = e.getAttribute(Po); if (o == null)
    return null; let [r, i] = o.split("|"); if (o = n ? i : r, !o)
    return null; let s = i ? `|${i}` : "", a = n ? r : s, c = {}; if (o !== "") {
    let u = t.get(Ot, null, { optional: !0 });
    u !== null && (c = u.get(tc, [])[Number(o)]);
} let l = { data: c, firstChild: e.firstChild ?? null }; return n && (l.firstChild = e, oc(l, 0, e.nextSibling)), a ? e.setAttribute(Po, a) : e.removeAttribute(Po), l; }
function My() { wy = L_; }
function Ny(e, t, n = !1) { return wy(e, t, n); }
function Rf(e) { let t = e._lView; return t[m].type === 2 ? null : (it(t) && (t = t[I]), t); }
function P_(e) { return e.textContent?.replace(/\s/gm, ""); }
function F_(e) { let t = xi(), n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, { acceptNode(i) { let s = P_(i); return s === "ngetn" || s === "ngtns" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } }), o, r = []; for (; o = n.nextNode();)
    r.push(o); for (let i of r)
    i.textContent === "ngetn" ? i.replaceWith(t.createTextNode("")) : i.remove(); }
var Sy = (function (e) { return e.Hydrated = "hydrated", e.Skipped = "skipped", e.Mismatched = "mismatched", e; })(Sy || {}), j_ = "__ngDebugHydrationInfo__";
function V_(e) { return e[j_] ?? null; }
function oc(e, t, n) { e.segmentHeads ??= {}, e.segmentHeads[t] = n; }
function ud(e, t) { return e.segmentHeads?.[t] ?? null; }
function Vi(e) { return e.get(Mf, !1, { optional: !0 }); }
var H_ = !1;
function B_() { H_ = !1; }
function _y(e, t) { let n = e.data, o = n[ki]?.[t] ?? null; return o === null && n[Ko]?.[t] && (o = xf(e, t)), o; }
function U_(e, t) { return e.data[ki]?.[t] !== void 0; }
function by(e, t) { return e.data[Ko]?.[t] ?? null; }
function xf(e, t) { let n = by(e, t) ?? [], o = 0; for (let r of n)
    o += r[jt] * (r[Oi] ?? 1); return o; }
function Ay(e) { if (typeof e.disconnectedNodes > "u") {
    let t = e.data[Jo];
    e.disconnectedNodes = t ? new Set(t) : null;
} return e.disconnectedNodes; }
function rc(e, t) { if (typeof e.disconnectedNodes > "u") {
    let n = e.data[Jo];
    e.disconnectedNodes = n ? new Set(n) : null;
} return !!Ay(e)?.has(t); }
function ic(e, t) { let n = e[he]; return n !== null && !Ur() && !er(t) && !rc(n, t.index - I); }
function kf(e, t) { let n = t, o = e.corruptedTextNodes; n.textContent === "" ? o.set(n, "ngetn") : n.nextSibling?.nodeType === Node.TEXT_NODE && o.set(n, "ngtns"); }
function Ry(e) { let t = []; return e !== null && (e.has(4) && t.push(...Na), e.has(3) && t.push(...Ma)), t; }
function $_(e, t) { let n = t.get($t), r = t.get(Ot).get(nc, {}), i = !1, s = e, a = null, c = []; for (; !i && s;) {
    i = n.has(s);
    let l = n.hydrating.get(s);
    if (a === null && l != null) {
        a = l.promise;
        break;
    }
    c.unshift(s), s = r[s][Df];
} return { parentBlockPromise: a, hydrationQueue: c }; }
function G_(e) { let t = e.body.querySelectorAll("[jsaction]"), n = new Set, o = [Na.join(":;"), Ma.join(":;")].join("|"); for (let r of t) {
    let i = r.getAttribute("jsaction"), s = r.getAttribute("ngb");
    i?.match(o) && s !== null && n.add(r);
} return n; }
function q_(e, t) { let n = G_(e), o = t.get(ji); for (let r of n)
    Sf(r, o); }
var xy = () => ({});
function W_(e) { let t = e.get(Ot, null, { optional: !0 }); return t !== null ? t.get(nc, {}) : {}; }
function z_() { xy = W_; }
function Q_(e) { return xy(e); }
function Z_(e) { return typeof e == "object" && e.trigger === 5; }
function Y_(e) { return e[Fi]?.find(n => Z_(n))?.delay ?? null; }
function K_(e) { let t = e[Fi]; if (t)
    for (let n of t) {
        if (n === 2)
            return !0;
        if (typeof n == "object" && n.trigger === 2)
            return n.intersectionObserverOptions || !0;
    } return null; }
function Em(e, t) { return e[Fi]?.includes(t) ?? !1; }
function J_(e) { return { data: e, hydrate: { idle: Em(e, 0), immediate: Em(e, 1), timer: Y_(e), viewport: K_(e) } }; }
function X_(e) { let t = Q_(e), n = new Map; for (let o in t)
    n.set(o, J_(t[o])); return n; }
function Lu(e) { return !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === Cy; }
function Im(e) { for (; e && e.nodeType === Node.TEXT_NODE;)
    e = e.previousSibling; return e; }
function ky(e) { for (let o of e.body.childNodes)
    if (Lu(o))
        return; let t = Im(e.body.previousSibling); if (Lu(t))
    return; let n = Im(e.head.lastChild); if (!Lu(n))
    throw new T(-507, !1); }
function Oy(e, t) { let n = e.contentQueries; if (n !== null) {
    let o = R(null);
    try {
        for (let r = 0; r < n.length; r += 2) {
            let i = n[r], s = n[r + 1];
            if (s !== -1) {
                let a = e.data[s];
                $r(i), a.contentQueries(2, t[s], s);
            }
        }
    }
    finally {
        R(o);
    }
} }
function dd(e, t, n) { $r(0); let o = R(null); try {
    t(e, n);
}
finally {
    R(o);
} }
function Of(e, t, n) { if (Yl(t)) {
    let o = R(null);
    try {
        let r = t.directiveStart, i = t.directiveEnd;
        for (let s = r; s < i; s++) {
            let a = e.data[s];
            if (a.contentQueries) {
                let c = n[s];
                a.contentQueries(1, c, s);
            }
        }
    }
    finally {
        R(o);
    }
} }
var Xe = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e[e.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom", e; })(Xe || {}), eb = { name: "custom-elements" }, tb = { name: "no-errors-schema" }, Ly = !1;
function nb(e) { Ly = e; }
function ob() { return Ly; }
var Py = !1;
function rb(e) { Py = e; }
function ib() { return Py; }
var Fy = { "http://www.w3.org/2000/svg": bn, "http://www.w3.org/1998/Math/MathML": Fr }, Ks;
function jy() { if (Ks === void 0 && (Ks = null, Fe.trustedTypes))
    try {
        Ks = Fe.trustedTypes.createPolicy("angular", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return Ks; }
function tr(e) { return jy()?.createHTML(e) || e; }
function sb(e) { return jy()?.createScriptURL(e) || e; }
var Js;
function Lf() { if (Js === void 0 && (Js = null, Fe.trustedTypes))
    try {
        Js = Fe.trustedTypes.createPolicy("angular#unsafe-bypass", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return Js; }
function Dm(e) { return Lf()?.createHTML(e) || e; }
function Tm(e) { return Lf()?.createScript(e) || e; }
function Cm(e) { return Lf()?.createScriptURL(e) || e; }
var Vt = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) { this.changingThisBreaksApplicationSecurity = t; }
    toString() { return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ds})`; }
}, fd = class extends Vt {
    getTypeName() { return "HTML"; }
}, pd = class extends Vt {
    getTypeName() { return "Style"; }
}, hd = class extends Vt {
    getTypeName() { return "Script"; }
}, gd = class extends Vt {
    getTypeName() { return "URL"; }
}, md = class extends Vt {
    getTypeName() { return "ResourceURL"; }
};
function Tt(e) { return e instanceof Vt ? e.changingThisBreaksApplicationSecurity : e; }
function nr(e, t) { let n = Vy(e); if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL")
        return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Ds})`);
} return n === t; }
function Vy(e) { return e instanceof Vt && e.getTypeName() || null; }
function ab(e) { return new fd(e); }
function cb(e) { return new pd(e); }
function lb(e) { return new hd(e); }
function ub(e) { return new gd(e); }
function db(e) { return new md(e); }
function Hy(e) { let t = new yd(e); return fb() ? new vd(t) : t; }
var vd = class {
    inertDocumentHelper;
    constructor(t) { this.inertDocumentHelper = t; }
    getInertBodyElement(t) { t = "<body><remove></remove>" + t; try {
        let n = new window.DOMParser().parseFromString(tr(t), "text/html").body;
        return n === null ? this.inertDocumentHelper.getInertBodyElement(t) : (n.firstChild?.remove(), n);
    }
    catch {
        return null;
    } }
}, yd = class {
    defaultDoc;
    inertDocument;
    constructor(t) { this.defaultDoc = t, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert"); }
    getInertBodyElement(t) { let n = this.inertDocument.createElement("template"); return n.innerHTML = tr(t), n; }
};
function fb() { try {
    return !!new window.DOMParser().parseFromString(tr(""), "text/html");
}
catch {
    return !1;
} }
var pb = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function sc(e) { return e = String(e), e.match(pb) ? e : "unsafe:" + e; }
function Gt(e) { let t = {}; for (let n of e.split(","))
    t[n] = !0; return t; }
function Hi(...e) { let t = {}; for (let n of e)
    for (let o in n)
        n.hasOwnProperty(o) && (t[o] = !0); return t; }
var By = Gt("area,br,col,hr,img,wbr"), Uy = Gt("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"), $y = Gt("rp,rt"), hb = Hi($y, Uy), gb = Hi(Uy, Gt("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")), mb = Hi($y, Gt("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")), Ed = Hi(By, gb, mb, hb), Gy = Gt("background,cite,href,itemtype,longdesc,poster,src,xlink:href"), vb = Gt("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"), yb = Gt("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"), Id = Hi(Gy, vb, yb), Eb = Gt("script,style,template"), Dd = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) { let n = t.firstChild, o = !0, r = []; for (; n;) {
        if (n.nodeType === Node.ELEMENT_NODE ? o = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0, o && n.firstChild) {
            r.push(n), n = Tb(n);
            continue;
        }
        for (; n;) {
            n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
            let i = Db(n);
            if (i) {
                n = i;
                break;
            }
            n = r.pop();
        }
    } return this.buf.join(""); }
    startElement(t) { let n = wm(t).toLowerCase(); if (!Ed.hasOwnProperty(n))
        return this.sanitizedSomething = !0, !Eb.hasOwnProperty(n); this.buf.push("<"), this.buf.push(n); let o = t.attributes; for (let r = 0; r < o.length; r++) {
        let i = o.item(r), s = i.name, a = s.toLowerCase();
        if (!Id.hasOwnProperty(a)) {
            this.sanitizedSomething = !0;
            continue;
        }
        let c = i.value;
        Gy[a] && (c = sc(c)), this.buf.push(" ", s, '="', Mm(c), '"');
    } return this.buf.push(">"), !0; }
    endElement(t) { let n = wm(t).toLowerCase(); Ed.hasOwnProperty(n) && !By.hasOwnProperty(n) && (this.buf.push("</"), this.buf.push(n), this.buf.push(">")); }
    chars(t) { this.buf.push(Mm(t)); }
};
function Ib(e, t) { return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY; }
function Db(e) { let t = e.nextSibling; if (t && e !== t.previousSibling)
    throw qy(t); return t; }
function Tb(e) { let t = e.firstChild; if (t && Ib(e, t))
    throw qy(t); return t; }
function wm(e) { let t = e.nodeName; return typeof t == "string" ? t : "FORM"; }
function qy(e) { return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`); }
var Cb = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, wb = /([^\#-~ |!])/g;
function Mm(e) { return e.replace(/&/g, "&amp;").replace(Cb, function (t) { let n = t.charCodeAt(0), o = t.charCodeAt(1); return "&#" + ((n - 55296) * 1024 + (o - 56320) + 65536) + ";"; }).replace(wb, function (t) { return "&#" + t.charCodeAt(0) + ";"; }).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
var Xs;
function Wy(e, t) { let n = null; try {
    Xs = Xs || Hy(e);
    let o = t ? String(t) : "";
    n = Xs.getInertBodyElement(o);
    let r = 5, i = o;
    do {
        if (r === 0)
            throw new Error("Failed to sanitize html because the input is unstable");
        r--, o = i, i = n.innerHTML, n = Xs.getInertBodyElement(o);
    } while (o !== i);
    let a = new Dd().sanitizeChildren(Td(n) || n);
    return tr(a);
}
finally {
    if (n) {
        let o = Td(n) || n;
        for (; o.firstChild;)
            o.firstChild.remove();
    }
} }
function Td(e) { return "content" in e && Mb(e) ? e.content : null; }
function Mb(e) { return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE"; }
var Nb = /^>|^->|<!--|-->|--!>|<!-$/g, Sb = /(<|>)/g, _b = "\u200B$1\u200B";
function bb(e) { return e.replace(Nb, t => t.replace(Sb, _b)); }
function Pf(e, t) { return e.createText(t); }
function zy(e, t, n) { e.setValue(t, n); }
function Ff(e, t) { return e.createComment(bb(t)); }
function ac(e, t, n) { return e.createElement(t, n); }
function lt(e, t, n, o, r) { e.insertBefore(t, n, o, r); }
function Qy(e, t, n) { e.appendChild(t, n); }
function Nm(e, t, n, o, r) { o !== null ? lt(e, t, n, o, r) : Qy(e, t, n); }
function Bi(e, t, n, o) { e.removeChild(null, t, n, o); }
function Zy(e) { e.textContent = ""; }
function Ab(e, t, n) { e.setAttribute(t, "style", n); }
function Rb(e, t, n) { n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n); }
function Yy(e, t, n) { let { mergedAttrs: o, classes: r, styles: i } = n; o !== null && MS(e, t, o), r !== null && Rb(e, t, r), i !== null && Ab(e, t, i); }
function xb(e) { let t = g(); e.src = "", e.srcdoc = tr(""), Bi(t[M], e); }
function Ky(e, t = !0) { if (e[0] != ":")
    return [null, e]; let n = e.indexOf(":", 1); if (n === -1) {
    if (t)
        throw new Error(`Unsupported format "${e}" expecting ":namespace:name"`);
    return [null, e];
} return [e.slice(1, n), e.slice(n + 1)]; }
function jf(e, t, n) { if (t !== void 0 && n !== void 0 && tE(t, n) !== q.HTML)
    return e; let o = Ui(); return o ? Dm(o.sanitize(q.HTML, e) || "") : nr(e, "HTML") ? Dm(Tt(e)) : Wy(xi(), A(e)); }
function Vf(e) { let t = Ui(); return t ? t.sanitize(q.STYLE, e) || "" : nr(e, "Style") ? Tt(e) : A(e); }
function Hf(e) { let t = Ui(); return t ? t.sanitize(q.URL, e) || "" : nr(e, "URL") ? Tt(e) : sc(A(e)); }
function cc(e) { let t = Ui(); if (t)
    return Cm(t.sanitize(q.RESOURCE_URL, e) || ""); if (nr(e, "ResourceURL"))
    return Cm(Tt(e)); throw new T(904, !1); }
function Bf(e) { let t = Ui(); if (t)
    return Tm(t.sanitize(q.SCRIPT, e) || ""); if (nr(e, "Script"))
    return Tm(Tt(e)); throw new T(905, !1); }
function Jy(e) { return tr(e[0]); }
function Xy(e) { return sb(e[0]); }
function kb(e, t) { switch (tE(e, t)) {
    case q.RESOURCE_URL: return cc;
    case q.URL: return Hf;
    default: return null;
} }
function eE(e, t, n) { return kb(t, n)?.(e) ?? e; }
function Ui() { let e = g(); return e && e[Ze].sanitizer; }
function tE(e, t) { let [n, o] = nE(e); return jr(o, t, n); }
function nE(e) { e = e.toLowerCase(); let t = Ky(e, !1); if (t[0])
    return t; let o = le() === -1 ? null : Oe(), r = o?.namespace; if (e === "#host" && o?.type === 2) {
    let i = oe(o, g());
    if (i.tagName && (e = i.tagName.toLowerCase()), r == null) {
        let s = i.namespaceURI;
        r = s && Fy[s];
    }
} return [r, e]; }
var ea = new Set(["href", "xlink:href"]), Ob = { animate: { to: ea, values: ea, from: ea }, set: { to: ea } };
function Uf(e, t, n) { let r = le() === -1 ? null : Oe(); if (r && r.type !== 2)
    return e; let [i, s] = nE(t); if (jr(s, n, i) !== q.ATTRIBUTE_NO_BINDING)
    return e; let c = g(); if (r) {
    if (s === "iframe") {
        let u = oe(r, c);
        xb(u);
    }
    else if (i === bn) {
        let u = Ob[s]?.[n.toLowerCase()];
        if (u) {
            let d = oe(r, c);
            if (Lb(d, u))
                throw new T(-910, !1);
            return e;
        }
    }
} let l = !1; throw new T(-910, l); }
function Lb(e, t) { for (let n of e.getAttributeNames()) {
    if (n.toLowerCase() !== "attributename")
        continue;
    let o = e.getAttribute(n);
    if (o !== null && t.has(o.toLowerCase()))
        return o;
} return null; }
function Pb() { return je([]); }
function oE(e) { return e.ownerDocument.defaultView; }
function rE(e) { return e.ownerDocument; }
function $f(e) { return e.ownerDocument.body; }
var Fb = "\uFFFD";
function Qr(e) { return e instanceof Function ? e() : e; }
function jb(e, t, n) { let o = e.length; for (;;) {
    let r = e.indexOf(t, n);
    if (r === -1)
        return r;
    if (r === 0 || e.charCodeAt(r - 1) <= 32) {
        let i = t.length;
        if (r + i === o || e.charCodeAt(r + i) <= 32)
            return r;
    }
    n = r + 1;
} }
var iE = "ng-template";
function Vb(e, t, n, o) { let r = 0; if (o) {
    for (; r < t.length && typeof t[r] == "string"; r += 2)
        if (t[r] === "class" && jb(t[r + 1].toLowerCase(), n, 0) !== -1)
            return !0;
}
else if (Gf(e))
    return !1; if (r = t.indexOf(1, r), r > -1) {
    let i;
    for (; ++r < t.length && typeof (i = t[r]) == "string";)
        if (i.toLowerCase() === n)
            return !0;
} return !1; }
function Gf(e) { return e.type === 4 && e.value !== iE; }
function Hb(e, t, n) { let o = e.type === 4 && !n ? iE : e.value; return t === o; }
function Bb(e, t, n) { let o = 4, r = e.attrs, i = r !== null ? Gb(r) : 0, s = !1; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
        if (!s && !ct(o) && !ct(c))
            return !1;
        if (s && ct(c))
            continue;
        s = !1, o = c | o & 1;
        continue;
    }
    if (!s)
        if (o & 4) {
            if (o = 2 | o & 1, c !== "" && !Hb(e, c, n) || c === "" && t.length === 1) {
                if (ct(o))
                    return !1;
                s = !0;
            }
        }
        else if (o & 8) {
            if (r === null || !Vb(e, r, c, n)) {
                if (ct(o))
                    return !1;
                s = !0;
            }
        }
        else {
            let l = t[++a], u = Ub(c, r, Gf(e), n);
            if (u === -1) {
                if (ct(o))
                    return !1;
                s = !0;
                continue;
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = r[u + 1].toLowerCase(), o & 2 && l !== d) {
                    if (ct(o))
                        return !1;
                    s = !0;
                }
            }
        }
} return ct(o) || s; }
function ct(e) { return (e & 1) === 0; }
function Ub(e, t, n, o) { if (t === null)
    return -1; let r = 0; if (o || !n) {
    let i = !1;
    for (; r < t.length;) {
        let s = t[r];
        if (s === e)
            return r;
        if (s === 3 || s === 6)
            i = !0;
        else if (s === 1 || s === 2) {
            let a = t[++r];
            for (; typeof a == "string";)
                a = t[++r];
            continue;
        }
        else {
            if (s === 4)
                break;
            if (s === 0) {
                r += 4;
                continue;
            }
        }
        r += i ? 1 : 2;
    }
    return -1;
}
else
    return qb(t, e); }
function sE(e, t, n = !1) { for (let o = 0; o < t.length; o++)
    if (Bb(e, t[o], n))
        return !0; return !1; }
function $b(e) { let t = e.attrs; if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0)
        return t[n + 1];
} return null; }
function Gb(e) { for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Ov(n))
        return t;
} return e.length; }
function qb(e, t) { let n = e.indexOf(4); if (n > -1)
    for (n++; n < e.length;) {
        let o = e[n];
        if (typeof o == "number")
            return -1;
        if (o === t)
            return n;
        n++;
    } return -1; }
function Wb(e, t) { e: for (let n = 0; n < t.length; n++) {
    let o = t[n];
    if (e.length === o.length) {
        for (let r = 0; r < e.length; r++)
            if (e[r] !== o[r])
                continue e;
        return !0;
    }
} return !1; }
function Sm(e, t) { return e ? ":not(" + t.trim() + ")" : t; }
function zb(e) { let t = e[0], n = 1, o = 2, r = "", i = !1; for (; n < e.length;) {
    let s = e[n];
    if (typeof s == "string")
        if (o & 2) {
            let a = e[++n];
            r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
        }
        else
            o & 8 ? r += "." + s : o & 4 && (r += " " + s);
    else
        r !== "" && !ct(s) && (t += Sm(i, r), r = ""), o = s, i = i || !ct(o);
    n++;
} return r !== "" && (t += Sm(i, r)), t; }
function Qb(e) { return e.map(zb).join(","); }
function Zb(e) { let t = [], n = [], o = 1, r = 2; for (; o < e.length;) {
    let i = e[o];
    if (typeof i == "string")
        r === 2 ? i !== "" && t.push(i, e[++o]) : r === 8 && n.push(i);
    else {
        if (!ct(r))
            break;
        r = i;
    }
    o++;
} return n.length && t.push(1, ...n), t; }
var G = {}, Sa = (function (e) { return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e; })(Sa || {}), Cd;
function qf(e, t) { return Cd(e, t); }
function Yb(e) { Cd === void 0 && (Cd = e()); }
var aE = new C("", { factory: () => !1 }), cE = new C("", { factory: () => Kb }), Kb = 4e3, Jb = !1, no = (typeof ngServerMode > "u" || !ngServerMode) && typeof document < "u" && typeof document?.documentElement?.getAnimations == "function";
function lc(e) { return e[O].get(aE, Jb); }
function Xb(e, t, n) { let o = Bo.get(e); if (o) {
    for (let r of t)
        o.classList.push(r);
    for (let r of n)
        o.cleanupFns.push(r);
}
else
    Bo.set(e, { classList: t, cleanupFns: n }); }
function Wf(e) { let t = Bo.get(e); if (t) {
    for (let n of t.cleanupFns)
        n();
    Bo.delete(e);
} Un.delete(e); }
var eA = () => { }, Bo = new WeakMap, Un = new WeakMap, di = new WeakMap;
function lE(e) { return e ? e[an] ?? e : null; }
var Zr = new WeakSet;
function wd(e, t) { let n = di.get(e); if (n && n.length > 0) {
    let o = n.findIndex(r => r.el === t);
    o > -1 && n.splice(o, 1);
} n?.length === 0 && di.delete(e); }
function tA(e, t, n) { let o = di.get(e); if (!o || o.length === 0)
    return; let r = t.parentNode, i = t.previousSibling, s = lE(n); for (let a = o.length - 1; a >= 0; a--) {
    let { el: c, declarationView: l } = o[a], u = c.parentNode;
    c === t ? (o.splice(a, 1), Zr.add(c), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } }))) : i && c === i ? (o.splice(a, 1), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } })), c.parentNode?.removeChild(c)) : u && r && u !== r && (s === null || l === null || s === l) && (o.splice(a, 1), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } })), c.parentNode?.removeChild(c));
} }
function zf(e, t, n) { let o = lE(n), r = di.get(e); r ? r.some(i => i.el === t) || r.push({ el: t, declarationView: o }) : di.set(e, [{ el: t, declarationView: o }]); }
function _a(e) { let t = e[Ye] ??= {}; return t.enter ??= new Map; }
function Gn(e) { let t = e[Ye] ??= {}; return t.leave ??= new Map; }
function uE(e) { let t = typeof e == "function" ? e() : e, n = Array.isArray(t) ? t : null; return typeof t == "string" && (n = t.trim().split(/\s+/).filter(o => o)), n; }
function nA(e, t) { if (!no)
    return; let n = Bo.get(e); if (n && n.classList.length > 0 && oA(e, n.classList))
    for (let o of n.classList)
        t.removeClass(e, o); Wf(e); }
function oA(e, t) { for (let n of t)
    if (e.classList.contains(n))
        return !0; return !1; }
function fi(e) { return e.composedPath ? e.composedPath()[0] : e.target; }
function Qf(e, t) { let n = Un.get(t); return n === void 0 ? !0 : t === fi(e) && (n.animationName !== void 0 && e.animationName === n.animationName || n.propertyName !== void 0 && (n.propertyName === "all" || e.propertyName === n.propertyName)); }
function uc(e, t, n) { let o = e.get(t.index) ?? { animateFns: [] }; o.animateFns.push(n), e.set(t.index, o); }
function Md(e, t) { if (e)
    for (let n of e)
        n(); for (let n of t)
    n(); }
function Nd(e, t) { let n = Gn(e).get(t.index); n && (n.resolvers = void 0); }
function ta(e, t, n, o, r) { wd(t, n), Md(o, r), Nd(e, t); }
function ba(e) { if (!e)
    return 0; let t = e.toLowerCase().indexOf("ms") > -1 ? 1 : 1e3; return parseFloat(e) * t; }
function Hn(e, t) { return e.getPropertyValue(t).split(",").map(o => o.trim()); }
function rA(e) { let t = Hn(e, "transition-property"), n = Hn(e, "transition-duration"), o = Hn(e, "transition-delay"), r = { propertyName: "", duration: 0, animationName: void 0 }; for (let i = 0; i < t.length; i++) {
    let s = ba(o[i]) + ba(n[i]);
    s > r.duration && (r.propertyName = t[i], r.duration = s);
} return r; }
function iA(e) { let t = Hn(e, "animation-name"), n = Hn(e, "animation-delay"), o = Hn(e, "animation-duration"), r = Hn(e, "animation-iteration-count"), i = { animationName: "", propertyName: void 0, duration: 0 }; for (let s = 0; s < t.length; s++) {
    let a = ba(n[s]) + ba(o[s]), c = r[s];
    a > i.duration && c !== "infinite" && (i.animationName = t[s], i.duration = a);
} return i; }
function dE(e, t) { return e !== void 0 && e.duration > t.duration; }
function fE(e) { return (e.animationName != null || e.propertyName != null) && e.duration > 0; }
function sA(e, t) { let n = getComputedStyle(e), o = iA(n), r = rA(n), i = o.duration > r.duration ? o : r; dE(t.get(e), i) || fE(i) && t.set(e, i); }
function pE(e, t, n) { if (!n)
    return; let o = e.getAnimations(); return o.length === 0 ? sA(e, t) : aA(e, t, o); }
function aA(e, t, n) { let o = { animationName: void 0, propertyName: void 0, duration: 0 }; for (let r of n) {
    let i = r.effect?.getTiming();
    if (i?.iterations === 1 / 0)
        continue;
    let s = typeof i?.duration == "number" ? i.duration : 0, a = (i?.delay ?? 0) + s, c = r.playbackRate;
    c !== void 0 && c !== 0 && c !== 1 && (a /= Math.abs(c));
    let l, u;
    r.animationName ? u = r.animationName : l = r.transitionProperty, a >= o.duration && (o = { animationName: u, propertyName: l, duration: a });
} dE(t.get(e), o) || fE(o) && t.set(e, o); }
var gn = new Set, dc = (function (e) { return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e; })(dc || {}), oo = new C(""), _m = new Set;
function re(e) { _m.has(e) || (_m.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } })); }
var fc = (() => { class e {
    impl = null;
    execute() { this.impl?.execute(); }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), Zf = [0, 1, 2, 3], Yf = (() => { class e {
    ngZone = E(W);
    scheduler = E(We);
    errorHandler = E(bt, { optional: !0 });
    sequences = new Set;
    deferredRegistrations = new Set;
    executing = !1;
    constructor() { E(oo, { optional: !0 }); }
    execute() { let n = this.sequences.size > 0; n && U(P.AfterRenderHooksStart), this.executing = !0; for (let o of Zf)
        for (let r of this.sequences)
            if (!(r.erroredOrDestroyed || !r.hooks[o]))
                try {
                    r.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => { let i = r.hooks[o]; return i(r.pipelinedValue); }, r.snapshot));
                }
                catch (i) {
                    r.erroredOrDestroyed = !0, this.errorHandler?.handleError(i);
                } this.executing = !1; for (let o of this.sequences)
        o.afterRun(), o.once && (this.sequences.delete(o), o.destroy()); for (let o of this.deferredRegistrations)
        this.sequences.add(o); this.deferredRegistrations.size > 0 && this.scheduler.notify(7), this.deferredRegistrations.clear(), n && U(P.AfterRenderHooksEnd); }
    register(n) { let { view: o } = n; o !== void 0 ? ((o[kn] ??= []).push(n), Pn(o), o[w] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n); }
    addSequence(n) { this.sequences.add(n), this.scheduler.notify(7); }
    unregister(n) { this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0, n.pipelinedValue = void 0, n.once = !0) : (this.sequences.delete(n), this.deferredRegistrations.delete(n)); }
    maybeTrace(n, o) { return o ? o.run(dc.AFTER_NEXT_RENDER, n) : n(); }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), pi = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, o, r, i, s = null) { this.impl = t, this.hooks = n, this.view = o, this.once = r, this.snapshot = s, this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()); }
    afterRun() { this.erroredOrDestroyed = !1, this.pipelinedValue = void 0, this.snapshot?.dispose(), this.snapshot = null; }
    destroy() { this.impl.unregister(this), this.unregisterOnDestroy?.(); let t = this.view?.[kn]; t && (this.view[kn] = t.filter(n => n !== this)); }
};
function hE(e, t) { let n = t?.injector ?? E(se); return typeof ngServerMode < "u" && ngServerMode ? pc : (re("NgAfterRender"), gE(e, n, t, !1)); }
function Kf(e, t) { let n = t?.injector ?? E(se); return typeof ngServerMode < "u" && ngServerMode ? pc : (re("NgAfterNextRender"), gE(e, n, t, !0)); }
function cA(e) { return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]; }
function gE(e, t, n, o) { let r = t.get(fc); r.impl ??= t.get(Yf); let i = t.get(oo, null, { optional: !0 }), s = n?.manualCleanup !== !0 ? t.get(De) : null, a = t.get(wo, null, { optional: !0 }), c = new pi(r.impl, cA(e), a?.view, o, s, i?.snapshot(null)); return r.impl.register(c), c; }
var pc = { destroy() { } }, $i = new C("", { factory: () => { let e = E(xe), t = new Set; return e.onDestroy(() => t.clear()), { queue: t, isScheduled: !1, scheduler: null, injector: e }; } });
function mE(e, t, n) { let o = e.get($i); if (Array.isArray(t))
    for (let r of t)
        o.queue.add(r), n?.detachedLeaveAnimationFns?.push(r);
else
    o.queue.add(t), n?.detachedLeaveAnimationFns?.push(t); o.scheduler && o.scheduler(e); }
function lA(e, t) { let n = e.get($i); if (Array.isArray(t))
    for (let o of t)
        n.queue.delete(o);
else
    n.queue.delete(t); }
function uA(e, t) { let n = e.get($i); if (t.detachedLeaveAnimationFns) {
    for (let o of t.detachedLeaveAnimationFns)
        n.queue.delete(o);
    t.detachedLeaveAnimationFns = void 0;
} }
function dA(e) { let t = e.get($i); t.isScheduled || (Kf(() => { t.isScheduled = !1; for (let n of t.queue)
    n(); t.queue.clear(); }, { injector: t.injector }), t.isScheduled = !0); }
function hc(e) { let t = e.get($i); t.scheduler = dA, t.scheduler(e); }
function Jf(e, t) { for (let [n, o] of t)
    mE(e, o.animateFns); }
function bm(e, t, n, o) { let r = e?.[Ye]?.enter; t !== null && r && r.has(n.index) && Jf(o, r); }
function Am(e, t, n, o) { try {
    n.get(kr);
}
catch {
    return o(!1);
} let r = e?.[Ye]; r?.enter?.has(t.index) && lA(n, r.enter.get(t.index).animateFns); let i = fA(e, t, r); if (i.size === 0) {
    let s = !1;
    if (e) {
        let a = [];
        gc(e, t, a), s = a.length > 0;
    }
    if (!s)
        return o(!1);
} e && gn.add(e[Ve]), mE(n, () => pA(e, t, r || void 0, i, o), r || void 0); }
function fA(e, t, n) { let o = new Map, r = n?.leave; if (r && r.has(t.index) && o.set(t.index, r.get(t.index)), e && r)
    for (let [i, s] of r) {
        if (o.has(i))
            continue;
        let c = e[m].data[i].parent;
        for (; c;) {
            if (c === t) {
                o.set(i, s);
                break;
            }
            c = c.parent;
        }
    } return o; }
function pA(e, t, n, o, r) { let i = []; if (n && n.leave)
    for (let [s] of o) {
        if (!n.leave.has(s))
            continue;
        let a = n.leave.get(s);
        for (let c of a.animateFns) {
            let { promise: l } = c();
            i.push(l);
        }
        n.detachedLeaveAnimationFns = void 0;
    } if (e && gc(e, t, i), i.length > 0) {
    let s = n || e?.[Ye];
    if (s) {
        let a = s.running;
        a && i.push(a), s.running = Promise.allSettled(i), gA(e, s.running, r);
    }
    else
        Promise.allSettled(i).then(() => { e && gn.delete(e[Ve]), r(!0); });
}
else
    e && gn.delete(e[Ve]), r(!1); }
function gc(e, t, n) { if (t.type & 12) {
    let r = e[t.index];
    if (X(r))
        for (let i = L; i < r.length; i++) {
            let s = r[i];
            s[m].type === 2 && hA(s, n);
        }
} let o = t.child; for (; o;)
    gc(e, o, n), o = o.next; }
function hA(e, t) { let n = e[Ye]; if (n && n.leave)
    for (let r of n.leave.values())
        for (let i of r.animateFns) {
            let { promise: s } = i();
            t.push(s);
        } let o = e[m].firstChild; for (; o;)
    gc(e, o, t), o = o.next; }
function gA(e, t, n) { t.then(() => { e[Ye]?.running === t && (e[Ye].running = void 0, gn.delete(e[Ve])), n(!0); }); }
function ko(e, t, n, o, r, i, s, a) { if (r != null) {
    let c, l = !1;
    X(r) ? c = r : ee(r) && (l = !0, r = r[$]);
    let u = x(r);
    e === 0 && o !== null ? (bm(a, o, i, n), s == null ? Qy(t, o, u) : lt(t, o, u, s || null, !0)) : e === 1 && o !== null ? (bm(a, o, i, n), lt(t, o, u, s || null, !0), tA(i, u, a)) : e === 2 ? (a?.[Ye]?.leave?.has(i.index) && zf(i, u, a), Zr.delete(u), Am(a, i, n, d => { if (Zr.has(u)) {
        Zr.delete(u);
        return;
    } Bi(t, u, l, d); })) : e === 3 && (Zr.delete(u), Am(a, i, n, () => { t.destroyNode(u); })), c != null && TA(t, e, n, c, i, o, s);
} }
function vE(e, t) { yE(e, t), t[$] = null, t[ae] = null; }
function mA(e, t, n, o, r, i) { o[$] = r, o[ae] = t, vc(e, o, n, 1, r, i); }
function yE(e, t) { t[Ze].changeDetectionScheduler?.notify(9), vc(e, t, t[M], 2, null, null); }
function vA(e) { let t = e[sn]; if (!t)
    return Pu(e[m], e); for (; t;) {
    let n = null;
    if (ee(t))
        n = t[sn];
    else {
        let o = t[L];
        o && (n = o);
    }
    if (!n) {
        for (; t && !t[ve] && t !== e;)
            ee(t) && Pu(t[m], t), t = t[z];
        t === null && (t = e), ee(t) && Pu(t[m], t), n = t && t[ve];
    }
    t = n;
} }
function Xf(e, t) { let n = e[On], o = n.indexOf(t); n.splice(o, 1); }
function Gi(e, t) { if (Je(t))
    return; let n = t[M]; n.destroyNode && vc(e, t, n, 3, null, null), vA(t); }
function Pu(e, t) { if (Je(t))
    return; let n = R(null); try {
    t[w] &= -129, t[w] |= 256, t[ke] && Jt(t[ke]), EA(e, t), yA(e, t), t[m].type === 1 && t[M].destroy();
    let o = t[cn];
    if (o !== null && X(t[z])) {
        o !== t[z] && Xf(o, t);
        let r = t[pt];
        r !== null && r.detachView(e);
    }
    id(t);
}
finally {
    R(n);
} }
function yA(e, t) { let n = e.cleanup, o = t[rn]; if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
        if (typeof n[s] == "string") {
            let a = n[s + 3];
            a >= 0 ? o[a]() : o[-a].unsubscribe(), s += 2;
        }
        else {
            let a = o[n[s + 1]];
            n[s].call(a);
        } o !== null && (t[rn] = null); let r = t[St]; if (r !== null) {
    t[St] = null;
    for (let s = 0; s < r.length; s++) {
        let a = r[s];
        a();
    }
} let i = t[tn]; if (i !== null) {
    t[tn] = null;
    for (let s of i)
        s.destroy();
} }
function EA(e, t) { let n; if (e != null && (n = e.destroyHooks) != null)
    for (let o = 0; o < n.length; o += 2) {
        let r = t[n[o]];
        if (!(r instanceof $n)) {
            let i = n[o + 1];
            if (Array.isArray(i))
                for (let s = 0; s < i.length; s += 2) {
                    let a = r[i[s]], c = i[s + 1];
                    U(P.LifecycleHookStart, a, c);
                    try {
                        c.call(a);
                    }
                    finally {
                        U(P.LifecycleHookEnd, a, c);
                    }
                }
            else {
                U(P.LifecycleHookStart, r, i);
                try {
                    i.call(r);
                }
                finally {
                    U(P.LifecycleHookEnd, r, i);
                }
            }
        }
    } }
function ep(e, t, n) { return EE(e, t.parent, n); }
function EE(e, t, n) { let o = t; for (; o !== null && o.type & 168;)
    t = o, o = t.parent; if (o === null)
    return n[$]; if (Ne(o)) {
    let { encapsulation: r } = e.data[o.directiveStart + o.componentOffset];
    if (r === Xe.None || r === Xe.Emulated)
        return null;
} return oe(o, n); }
function IE(e, t, n) { return TE(e, t, n); }
function DE(e, t, n) { return e.type & 40 ? oe(e, n) : null; }
var TE = DE, Sd;
function CE(e, t) { TE = e, Sd = t; }
function mc(e, t, n, o) { let r = ep(e, o, t), i = t[M], s = o.parent || t[ae], a = IE(s, o, t); if (r != null)
    if (Array.isArray(n))
        for (let c = 0; c < n.length; c++)
            Nm(i, r, n[c], a, !1);
    else
        Nm(i, r, n, a, !1); Sd !== void 0 && Sd(i, o, t, n, r); }
function Bn(e, t) { if (t !== null) {
    let n = t.type;
    if (n & 3)
        return oe(t, e);
    if (n & 4)
        return _d(-1, e[t.index]);
    if (n & 8) {
        let o = t.child;
        if (o !== null)
            return Bn(e, o);
        {
            let r = e[t.index];
            return X(r) ? _d(-1, r) : x(r);
        }
    }
    else {
        if (n & 128)
            return Bn(e, t.next);
        if (n & 32)
            return qf(t, e)() || x(e[t.index]);
        {
            let o = wE(e, t);
            if (o !== null) {
                if (Array.isArray(o))
                    return o[0];
                let r = qe(e[ce]);
                return Bn(r, o);
            }
            else
                return Bn(e, t.next);
        }
    }
} return null; }
function wE(e, t) { if (t !== null) {
    let o = e[ce][ae], r = t.projection;
    return o.projection[r];
} return null; }
function _d(e, t) { let n = L + e + 1; if (n < t.length) {
    let o = t[n], r = o[m].firstChild;
    if (r !== null)
        return Bn(o, r);
} return t[ht]; }
function tp(e, t, n, o, r, i, s) { for (; n != null;) {
    let a = o[O];
    if (n.type === 128) {
        n = n.next;
        continue;
    }
    let c = o[n.index], l = n.type;
    if (s && t === 0 && (c && Be(x(c), o), n.flags |= 2), !er(n))
        if (l & 8)
            tp(e, t, n.child, o, r, i, !1), ko(t, e, a, r, c, n, i, o);
        else if (l & 32) {
            let u = qf(n, o), d;
            for (; d = u();)
                ko(t, e, a, r, d, n, i, o);
            ko(t, e, a, r, c, n, i, o);
        }
        else
            l & 16 ? ME(e, t, o, n, r, i) : ko(t, e, a, r, c, n, i, o);
    n = s ? n.projectionNext : n.next;
} }
function vc(e, t, n, o, r, i) { e.type === 3 ? IA(n, o, t, r, i) : tp(n, o, e.firstChild, t, r, i, !1); }
function IA(e, t, n, o, r) { let s = n[m].firstChild, a = s.next, c = x(n[s.index]), l = x(n[a.index]), u = a.index + 1, d = n[u]; if (t === 1 || t === 0)
    o !== null && (d && d.hasChildNodes() ? lt(e, o, d, r, !0) : (lt(e, o, c, r, !0), lt(e, o, l, r, !0)));
else if (t === 2) {
    if (d || (d = document.createDocumentFragment(), n[u] = d), c && c.parentNode === d)
        return;
    let f = c;
    for (; f !== null;) {
        let p = f.nextSibling;
        if (d.appendChild(f), f === l)
            break;
        f = p;
    }
} }
function DA(e, t, n) { let o = t[M], r = ep(e, n, t), i = n.parent || t[ae], s = IE(i, n, t); ME(o, 0, t, n, r, s); }
function ME(e, t, n, o, r, i) { let s = n[ce], c = s[ae].projection[o.projection]; if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
        let u = c[l];
        ko(t, e, n[O], r, u, o, i, n);
    }
else {
    let l = c, u = s[z];
    li(o) && (l.flags |= 128), tp(e, t, l, u, r, i, !0);
} }
function TA(e, t, n, o, r, i, s) { let a = o[ht], c = x(o); if (a !== c && ko(t, e, n, i, a, r, s), (o[w] & 4) === 0)
    for (let l = L; l < o.length; l++) {
        let u = o[l];
        vc(u[m], u, e, t, i, a);
    } }
function CA(e, t, n, o, r) { if (t)
    r ? e.addClass(n, o) : e.removeClass(n, o);
else {
    let i = o.indexOf("-") === -1 ? void 0 : Sa.DashCase;
    r == null ? e.removeStyle(n, o, i) : (typeof r == "string" && r.endsWith("!important") && (r = r.slice(0, -10), i |= Sa.Important), e.setStyle(n, o, r, i));
} }
function yc(e, t, n, o, r, i, s, a, c, l, u) { let d = I + o, f = d + r, p = wA(d, f), h = typeof l == "function" ? l() : l; return p[m] = { type: e, blueprint: p, template: n, queries: null, viewQuery: a, declTNode: t, data: p.slice().fill(null, d), bindingStartIndex: d, expandoStartIndex: f, hostBindingOpCodes: null, firstCreatePass: !0, firstUpdatePass: !0, staticViewQueries: !1, staticContentQueries: !1, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: c, consts: h, incompleteFirstPass: !1, ssrId: u }; }
function wA(e, t) { let n = []; for (let o = 0; o < t; o++)
    n.push(o < e ? null : G); return n; }
function NE(e) { let t = e.tView; return t === null || t.incompleteFirstPass ? e.tView = yc(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t; }
function qi(e, t, n, o, r, i, s, a, c, l, u) { let d = t.blueprint.slice(); return d[$] = r, d[w] = o | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[w] & 2048) && (d[w] |= 2048), Xl(d), d[z] = d[an] = e, d[H] = n, d[Ze] = s || e && e[Ze], d[M] = a || e && e[M], d[O] = c || e && e[O] || null, d[ae] = i, d[Ve] = r_(), d[he] = u, d[Ql] = l, d[ce] = t.type == 2 ? e[ce] : d, d; }
function MA(e, t, n) { let o = oe(t, e), r = NE(n), i = e[Ze].rendererFactory, s = Ec(e, qi(e, r, null, np(n), o, t, null, i.createRenderer(o, n), null, null, null)); return e[t.index] = s; }
function np(e) { let t = 16; return e.signals ? t = 4096 : e.onPush && (t = 64), t; }
function Wi(e, t, n, o) { if (n === 0)
    return -1; let r = t.length; for (let i = 0; i < n; i++)
    t.push(o), e.blueprint.push(o), e.data.push(null); return r; }
function Ec(e, t) { return e[sn] ? e[Lr][ve] = t : e[sn] = t, e[Lr] = t, t; }
function SE(e = 1) { _E(_(), g(), le() + e, !1); }
function _E(e, t, n, o) { if (!o)
    if ((t[w] & 3) === 3) {
        let i = e.preOrderCheckHooks;
        i !== null && sa(t, i, n);
    }
    else {
        let i = e.preOrderHooks;
        i !== null && aa(t, i, 0, n);
    } vt(n); }
var Ic = (function (e) { return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e; })(Ic || {});
function qn(e, t, n, o) { let r = R(null); try {
    let [i, s, a] = e.inputs[n], c = null;
    (s & Ic.SignalBased) !== 0 && (c = t[i][K]), c !== null && c.transformFn !== void 0 ? o = c.transformFn(o) : a !== null && (o = a.call(t, o)), e.setInput !== null ? e.setInput(t, c, o, n, i) : Sv(t, c, i, o);
}
finally {
    R(r);
} }
function bE(e, t, n, o, r) { let i = le(), s = o & 2; try {
    vt(-1), s && t.length > I && _E(e, t, I, !1);
    let a = s ? P.TemplateUpdateStart : P.TemplateCreateStart;
    U(a, r, n), n(o, r);
}
finally {
    vt(i);
    let a = s ? P.TemplateUpdateEnd : P.TemplateCreateEnd;
    U(a, r, n);
} }
function Dc(e, t, n) { AA(e, t, n), (n.flags & 64) === 64 && RA(e, t, n); }
function or(e, t, n = oe) { let o = t.localNames; if (o !== null) {
    let r = t.index + 1;
    for (let i = 0; i < o.length; i += 2) {
        let s = o[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[r++] = a;
    }
} }
function NA(e, t, n, o) { let i = o.get(Tf, fy) || n === Xe.ShadowDom || n === Xe.ExperimentalIsolatedShadowDom, s = e.selectRootElement(t, i); return SA(s), s; }
function SA(e) { AE(e); }
var AE = () => null;
function _A(e) { Xv(e) ? Zy(e) : F_(e); }
function RE() { AE = _A; }
function bA(e) { return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e; }
function op(e, t, n, o, r, i) { let s = t[m]; if (Mc(e, s, t, n, o)) {
    Ne(e) && xE(t, e.index);
    return;
} e.type & 3 && (n = bA(n)), rp(e, t, n, o, r, i); }
function rp(e, t, n, o, r, i) { if (e.type & 3) {
    let s = oe(e, t);
    o = i != null ? i(o, e.value || "", n) : o, r.setProperty(s, n, o);
}
else
    e.type & 12; }
function xE(e, t) { let n = ye(t, e); n[w] & 16 || (n[w] |= 64); }
function AA(e, t, n) { let o = n.directiveStart, r = n.directiveEnd; Ne(n) && MA(t, n, e.data[o + n.componentOffset]), e.firstCreatePass || Ea(n, t); let i = n.initialInputs; for (let s = o; s < r; s++) {
    let a = e.data[s], c = ci(t, e, s, n);
    if (Be(c, t), i !== null && OA(t, s - o, c, a, n, i), Ke(a)) {
        let l = ye(n.index, t);
        l[H] = ci(t, e, s, n);
    }
} }
function RA(e, t, n) { let o = n.directiveStart, r = n.directiveEnd, i = n.index, s = zg(); try {
    vt(i);
    for (let a = o; a < r; a++) {
        let c = e.data[a], l = t[a];
        js(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && xA(c, l);
    }
}
finally {
    vt(-1), js(s);
} }
function xA(e, t) { e.hostBindings !== null && e.hostBindings(1, t); }
function ip(e, t) { let n = e.directiveRegistry, o = null; if (n)
    for (let r = 0; r < n.length; r++) {
        let i = n[r];
        sE(t, i.selectors, !1) && (o ??= [], Ke(i) ? o.unshift(i) : o.push(i));
    } return o; }
function kA(e, t, n, o, r, i) { let s = oe(e, t); Tc(t[M], s, i, e.value, n, o, r); }
function Tc(e, t, n, o, r, i, s) { if (i == null)
    s?.(i, o || "", r), e.removeAttribute(t, r, n);
else {
    let a = s == null ? A(i) : s(i, o || "", r);
    e.setAttribute(t, r, a, n);
} }
function OA(e, t, n, o, r, i) { let s = i[t]; if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
        let c = s[a], l = s[a + 1];
        qn(o, n, c, l);
    } }
function Cc(e, t, n, o, r) { let i = I + n, s = t[m], a = r(s, t, e, o, n); t[i] = a, st(e, !0); let c = e.type === 2; return c ? (Yy(t[M], a, e), (Ug() === 0 || yo(e)) && Be(a, t), $g()) : Be(a, t), Gr() && (!c || !er(e)) && mc(s, t, a, e), e; }
function wc(e) { let t = e; return du() ? Fs() : (t = t.parent, st(t, !1)), t; }
function kE(e, t, n) { return (e === null || Ke(e)) && (n = Vr(n[t.index])), n[M]; }
function sp(e, t) { let n = e[O]; if (!n)
    return; let o; try {
    o = n.get(kt, null);
}
catch {
    o = null;
} o?.(t); }
function Mc(e, t, n, o, r) { let i = e.inputs?.[o], s = e.hostDirectiveInputs?.[o], a = !1; if (s)
    for (let c = 0; c < s.length; c += 2) {
        let l = s[c], u = s[c + 1], d = t.data[l];
        qn(d, n[l], u, r), a = !0;
    } if (i)
    for (let c of i) {
        let l = n[c], u = t.data[c];
        qn(u, l, o, r), a = !0;
    } return a; }
function OE(e, t, n, o, r, i) { let s = null, a = null, c = null, l = !1, u = e.directiveToIndex.get(o.type); if (typeof u == "number" ? s = u : [s, a, c] = u, a !== null && c !== null && e.hostDirectiveInputs?.hasOwnProperty(r)) {
    let d = e.hostDirectiveInputs[r];
    for (let f = 0; f < d.length; f += 2) {
        let p = d[f];
        if (p >= a && p <= c) {
            let h = t.data[p], v = d[f + 1];
            qn(h, n[p], v, i), l = !0;
        }
        else if (p > c)
            break;
    }
} return s !== null && o.inputs.hasOwnProperty(r) && (qn(o, n[s], r, i), l = !0), l; }
function LA(e, t) { let n = ye(t, e), o = n[m]; PA(o, n); let r = n[$]; r !== null && n[he] === null && (n[he] = Ny(r, n[O])), U(P.ComponentStart); try {
    Nc(o, n, n[H]);
}
finally {
    U(P.ComponentEnd, n[H]);
} }
function PA(e, t) { for (let n = t.length; n < e.blueprint.length; n++)
    t.push(e.blueprint[n]); }
function Nc(e, t, n) { Bs(t); try {
    let o = e.viewQuery;
    o !== null && dd(1, o, n);
    let r = e.template;
    r !== null && bE(e, t, r, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[pt]?.finishViewCreation(e), e.staticContentQueries && Oy(e, t), e.staticViewQueries && dd(2, e.viewQuery, n);
    let i = e.components;
    i !== null && FA(t, i);
}
catch (o) {
    throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), o;
}
finally {
    t[w] &= -5, Us();
} }
function FA(e, t) { for (let n = 0; n < t.length; n++)
    LA(e, t[n]); }
function vn(e, t, n, o) { let r = R(null); try {
    let i = t.tView, a = e[w] & 4096 ? 4096 : 16, c = qi(e, i, n, a, null, t, null, null, o?.injector ?? null, o?.embeddedViewInjector ?? null, o?.dehydratedView ?? null), l = e[t.index];
    c[cn] = l;
    let u = e[pt];
    return u !== null && (c[pt] = u.createEmbeddedView(i)), Nc(i, c, n), c;
}
finally {
    R(r);
} }
function Wn(e, t) { return !t || t.firstChild === null || li(e); }
function mn(e, t, n, o, r = !1) { if (e.type === 3) {
    let i = e.firstChild, s = i.next, a = x(t[i.index]), c = x(t[s.index]), l = a;
    for (; l !== null && (o.push(l), l !== c);)
        l = l.nextSibling;
    return o;
} for (; n !== null;) {
    if (n.type === 128) {
        n = r ? n.projectionNext : n.next;
        continue;
    }
    let i = t[n.index];
    if (i !== null)
        if (X(i)) {
            let a = i[ht];
            a !== i[$] && o.push(x(i)), i[w] & 4 || Sc(i, o), o.push(a);
        }
        else
            o.push(x(i));
    let s = n.type;
    if (s & 8)
        mn(e, t, n.child, o);
    else if (s & 32) {
        let a = qf(n, t), c;
        for (; c = a();)
            o.push(c);
    }
    else if (s & 16) {
        let a = wE(t, n);
        if (Array.isArray(a))
            o.push(...a);
        else {
            let c = qe(t[ce]);
            mn(c[m], c, a, o, !0);
        }
    }
    n = r ? n.projectionNext : n.next;
} return o; }
function Sc(e, t) { for (let n = L; n < e.length; n++) {
    let o = e[n], r = o[m].firstChild;
    r !== null && mn(o[m], o, r, t);
} }
function LE(e) { if (e[kn] !== null) {
    for (let t of e[kn])
        t.impl.addSequence(t);
    e[kn].length = 0;
} }
var PE = [];
function jA(e) { return e[ke] ?? VA(e); }
function VA(e) { let t = PE.pop() ?? Object.create(BA); return t.lView = e, t; }
function HA(e) { e.lView[ke] !== e && (e.lView = null, PE.push(e)); }
var BA = ne(F({}, Zt), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { Pn(e.lView); }, consumerOnSignalRead() { this.lView[ke] = this; } });
function UA(e) { let t = e[ke] ?? Object.create($A); return t.lView = e, t; }
var $A = ne(F({}, Zt), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { let t = qe(e.lView); for (; t && !FE(t[m]);)
        t = qe(t); t && Br(t); }, consumerOnSignalRead() { this.lView[ke] = this; } });
function FE(e) { return e.type !== 2; }
function jE(e) { if (e[tn] === null)
    return; let t = !0; for (; t;) {
    let n = !1;
    for (let o of e[tn])
        o.dirty && (n = !0, o.zone === null || Zone.current === o.zone ? o.run() : o.zone.run(() => o.run()));
    t = n && !!(e[w] & 8192);
} }
var GA = 100;
function VE(e, t = 0) { let o = e[Ze].rendererFactory, r = !1; r || o.begin?.(); try {
    qA(e, t);
}
finally {
    r || o.end?.();
} }
function qA(e, t) { let n = pu(); try {
    vr(!0), bd(e, t);
    let o = 0;
    for (; Eo(e);) {
        if (o === GA)
            throw new T(103, !1);
        o++, bd(e, 1);
    }
}
finally {
    vr(n);
} }
function HE(e, t, n, o) { if (Je(t))
    return; let r = t[w], i = !1, s = !1; Bs(t); let a = !0, c = null, l = null; i || (FE(e) ? (l = jA(t), c = Mt(l)) : us() === null ? (a = !1, l = UA(t), c = Mt(l)) : t[ke] && (Jt(t[ke]), t[ke] = null)); try {
    Xl(t), hu(e.bindingStartIndex), n !== null && bE(e, t, n, 2, o);
    let u = (r & 3) === 3;
    if (!i)
        if (u) {
            let p = e.preOrderCheckHooks;
            p !== null && sa(t, p, null);
        }
        else {
            let p = e.preOrderHooks;
            p !== null && aa(t, p, 0, null), Au(t, 0);
        }
    if (s || WA(t), jE(t), BE(t, 0), e.contentQueries !== null && Oy(e, t), !i)
        if (u) {
            let p = e.contentCheckHooks;
            p !== null && sa(t, p);
        }
        else {
            let p = e.contentHooks;
            p !== null && aa(t, p, 1), Au(t, 1);
        }
    QA(e, t);
    let d = e.components;
    d !== null && $E(t, d, 0);
    let f = e.viewQuery;
    if (f !== null && dd(2, f, o), !i)
        if (u) {
            let p = e.viewCheckHooks;
            p !== null && sa(t, p);
        }
        else {
            let p = e.viewHooks;
            p !== null && aa(t, p, 2), Au(t, 2);
        }
    if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[xs]) {
        for (let p of t[xs])
            p();
        t[xs] = null;
    }
    i || (LE(t), t[w] &= -73);
}
catch (u) {
    throw i || Pn(t), u;
}
finally {
    l !== null && (Kt(l, c), a && HA(l)), Us();
} }
function BE(e, t) { for (let n = ry(e); n !== null; n = iy(n))
    for (let o = L; o < n.length; o++) {
        let r = n[o];
        UE(r, t);
    } }
function WA(e) { for (let t = ry(e); t !== null; t = iy(t)) {
    if (!(t[w] & 2))
        continue;
    let n = t[On];
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        Br(r);
    }
} }
function zA(e, t, n) { U(P.ComponentStart); let o = ye(t, e); try {
    UE(o, n);
}
finally {
    U(P.ComponentEnd, o[H]);
} }
function UE(e, t) { ks(e) && bd(e, t); }
function bd(e, t) { let o = e[m], r = e[w], i = e[ke], s = !!(t === 0 && r & 16); if (s ||= !!(r & 64 && t === 0), s ||= !!(r & 1024), s ||= !!(i?.dirty && lo(i)), s ||= !1, i && (i.dirty = !1), e[w] &= -9217, s)
    HE(o, e, o.template, e[H]);
else if (r & 8192) {
    let a = R(null);
    try {
        jE(e), BE(e, 1);
        let c = o.components;
        c !== null && $E(e, c, 1), LE(e);
    }
    finally {
        R(a);
    }
} }
function $E(e, t, n) { for (let o = 0; o < t.length; o++)
    zA(e, t[o], n); }
function QA(e, t) { let n = e.hostBindingOpCodes; if (n !== null)
    try {
        for (let o = 0; o < n.length; o++) {
            let r = n[o];
            if (r < 0)
                vt(~r);
            else {
                let i = r, s = n[++o], a = n[++o];
                Wg(s, i);
                let c = t[i];
                U(P.HostBindingsUpdateStart, c);
                try {
                    a(2, c);
                }
                finally {
                    U(P.HostBindingsUpdateEnd, c);
                }
            }
        }
    }
    finally {
        vt(-1);
    } }
function _c(e, t) { let n = pu() ? 64 : 1088; for (e[Ze].changeDetectionScheduler?.notify(t); e;) {
    e[w] |= n;
    let o = qe(e);
    if (it(e) && !o)
        return e;
    e = o;
} return null; }
function ap(e, t, n, o) { return [e, !0, 0, t, null, o, null, n, null, null]; }
function GE(e, t) { let n = L + t; if (n < e.length)
    return e[n]; }
function qt(e, t, n, o = !0) { let r = t[m]; if (ZA(r, t, e, n), o) {
    let s = _d(n, e), a = t[M], c = a.parentNode(e[ht]);
    c !== null && mA(r, e[ae], a, t, c, s);
} let i = t[he]; i !== null && i.firstChild !== null && (i.firstChild = null); }
function zi(e, t) { let n = hi(e, t); return n !== void 0 && Gi(n[m], n), n; }
function hi(e, t) { if (e.length <= L)
    return; let n = L + t, o = e[n]; if (o) {
    let r = o[cn];
    r !== null && r !== e && Xf(r, o), t > 0 && (e[n - 1][ve] = o[ve]);
    let i = Ar(e, L + t);
    vE(o[m], o);
    let s = i[pt];
    s !== null && s.detachView(i[m]), o[z] = null, o[ve] = null, o[w] &= -129;
} return o; }
function ZA(e, t, n, o) { let r = L + o, i = n.length; o > 0 && (n[r - 1][ve] = t), o < i - L ? (t[ve] = n[r], Bl(n, L + o, t)) : (n.push(t), t[ve] = null), t[z] = n; let s = t[cn]; s !== null && n !== s && qE(s, t); let a = t[pt]; a !== null && a.insertView(e), Os(t), t[w] |= 128; }
function qE(e, t) { let n = e[On], o = t[z]; if (ee(o))
    e[w] |= 2;
else {
    let r = o[z][ce];
    t[ce] !== r && (e[w] |= 2);
} n === null ? e[On] = [t] : n.push(t); }
var Ht = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() { let t = this._lView, n = t[m]; return mn(n, t, n.firstChild, []); }
    constructor(t, n) { this._lView = t, this._cdRefInjectingView = n; }
    get context() { return this._lView[H]; }
    set context(t) { this._lView[H] = t; }
    get destroyed() { return Je(this._lView); }
    destroy() { if (this._appRef)
        this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
        let t = this._lView[z];
        if (X(t)) {
            let n = t[Pr], o = n ? n.indexOf(this) : -1;
            o > -1 && (hi(t, o), Ar(n, o));
        }
        this._attachedToViewContainer = !1;
    } Gi(this._lView[m], this._lView); }
    onDestroy(t) { Io(this._lView, t); }
    markForCheck() { _c(this._cdRefInjectingView || this._lView, 4); }
    detach() { this._lView[w] &= -129; }
    reattach() { Os(this._lView), this._lView[w] |= 128; }
    detectChanges() { this._lView[w] |= 1024, VE(this._lView); }
    checkNoChanges() { }
    attachToViewContainerRef() { if (this._appRef)
        throw new T(902, !1); this._attachedToViewContainer = !0; }
    detachFromAppRef() { this._appRef = null; let t = it(this._lView), n = this._lView[cn]; n !== null && !t && Xf(n, this._lView), yE(this._lView[m], this._lView); }
    attachToAppRef(t) { if (this._attachedToViewContainer)
        throw new T(902, !1); this._appRef = t; let n = it(this._lView), o = this._lView[cn]; o !== null && !n && qE(o, this._lView), Os(this._lView); }
};
function YA(e) { return Eo(e._lView) || !!(e._lView[w] & 64); }
function KA(e) { Br(e._lView); }
var gi = (() => { class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = JA;
    constructor(n, o, r) { this._declarationLView = n, this._declarationTContainer = o, this.elementRef = r; }
    get ssrId() { return this._declarationTContainer.tView?.ssrId || null; }
    createEmbeddedView(n, o) { return this.createEmbeddedViewImpl(n, o); }
    createEmbeddedViewImpl(n, o, r) { let i = vn(this._declarationLView, this._declarationTContainer, n, { embeddedViewInjector: o, dehydratedView: r }); return new Ht(i); }
} return e; })();
function JA() { return bc(S(), g()); }
function bc(e, t) { return e.type & 4 ? new gi(t, e, Zo(e, t)) : null; }
var Ad = "<-- AT THIS LOCATION", XA = "/guide/hydration#third-party-scripts-with-dom-manipulation";
function eR(e) { switch (e) {
    case 4: return "view container";
    case 2: return "element";
    case 8: return "ng-container";
    case 32: return "icu";
    case 64: return "i18n";
    case 16: return "projection";
    case 1: return "text";
    case 128: return "@let";
    default: return "<unknown>";
} }
function tR(e, t) {
    let n = `During serialization, Angular was unable to find an element in the DOM:

`, o = `${iR(e, t, !1)}

`, r = aR();
    throw new T(-502, n + o + r);
}
function WE(e) {
    let t = "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n", n = `${sR(e)}

`, o = t + n + cR();
    return new T(-503, o);
}
function nR(e) { let t = []; if (e.attrs)
    for (let n = 0; n < e.attrs.length;) {
        let o = e.attrs[n++];
        if (typeof o == "number")
            break;
        let r = e.attrs[n++];
        t.push(`${o}="${Aa(r)}"`);
    } return t.join(" "); }
var oR = new Set(["ngh", "ng-version", "ng-server-context"]);
function rR(e) { let t = []; for (let n = 0; n < e.attributes.length; n++) {
    let o = e.attributes[n];
    oR.has(o.name) || t.push(`${o.name}="${Aa(o.value)}"`);
} return t.join(" "); }
function Fu(e, t = "\u2026") { switch (e.type) {
    case 1: return `#text${e.value ? `(${e.value})` : ""}`;
    case 2:
        let o = nR(e), r = e.value.toLowerCase();
        return `<${r}${o ? " " + o : ""}>${t}</${r}>`;
    case 8: return "<!-- ng-container -->";
    case 4: return "<!-- container -->";
    default: return `#node(${eR(e.type)})`;
} }
function ua(e, t = "\u2026") { let n = e; switch (n.nodeType) {
    case Node.ELEMENT_NODE:
        let o = n.tagName.toLowerCase(), r = rR(n);
        return `<${o}${r ? " " + r : ""}>${t}</${o}>`;
    case Node.TEXT_NODE:
        let i = n.textContent ? Aa(n.textContent) : "";
        return `#text${i ? `(${i})` : ""}`;
    case Node.COMMENT_NODE: return `<!-- ${Aa(n.textContent ?? "")} -->`;
    default: return `#node(${n.nodeType})`;
} }
function iR(e, t, n) {
    let r = "";
    t.prev ? (r += `  \u2026
`, r += "  " + Fu(t.prev) + `
`) : t.type && t.type & 12 && (r += `  \u2026
`), n ? (r += "  " + Fu(t) + `
`, r += `  <!-- container -->  ${Ad}
`) : r += "  " + Fu(t) + `  ${Ad}
`, r += `  \u2026
`;
    let i = t.type ? ep(e[m], t, e) : null;
    return i && (r = ua(i, `
` + r)), r;
}
function sR(e) {
    let n = "", o = e;
    return o.previousSibling && (n += `  \u2026
`, n += "  " + ua(o.previousSibling) + `
`), n += "  " + ua(o) + `  ${Ad}
`, e.nextSibling && (n += `  \u2026
`), e.parentNode && (n = ua(o.parentNode, `
` + n)), n;
}
function aR(e) {
    return `To fix this problem:
  * check ${e ? `the "${e}"` : "corresponding"} component for hydration-related issues
  * check to see if your template has valid HTML structure
  * check if there are any third-party scripts that manipulate the DOM. More info: ${Is}${XA}
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function cR() {
    return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function lR(e) { return e.replace(/\s+/gm, ""); }
function Aa(e, t = 50) { return e ? (e = lR(e), e.length > t ? `${e.substring(0, t - 1)}\u2026` : e) : ""; }
function zE(e, t, n) { let o = t.insertBeforeIndex, r = Array.isArray(o) ? o[0] : o; return r === null ? DE(e, t, n) : x(n[r]); }
function QE(e, t, n, o, r) { let i = t.insertBeforeIndex; if (Array.isArray(i)) {
    let s = o, a = null;
    if (t.type & 3 || (a = s, s = r), s !== null && t.componentOffset === -1)
        for (let c = 1; c < i.length; c++) {
            let l = n[i[c]];
            lt(e, s, l, a, !1);
        }
} }
function yn(e, t, n, o, r) { let i = e.data[t]; if (i === null)
    i = cp(e, t, n, o, r), qg() && (i.flags |= 32);
else if (i.type & 64) {
    i.type = n, i.value = o, i.attrs = r;
    let s = Do();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
} return st(i, !0), i; }
function cp(e, t, n, o, r) { let i = uu(), s = du(), a = s ? i : i && i.parent, c = e.data[t] = Rd(e, a, n, t, o, r); return uR(e, c, i, s), c; }
function uR(e, t, n, o) { e.firstChild === null && (e.firstChild = t), n !== null && (o ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n)); }
function Rd(e, t, n, o, r, i) { let s = t ? t.injectorIndex : -1, a = 0; return Ur() && (a |= 128), { type: n, index: o, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, controlDirectiveIndex: -1, customControlIndex: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: r, namespace: $s(), attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 }; }
function ZE(e, t) { if (e.push(t), e.length > 1)
    for (let n = e.length - 2; n >= 0; n--) {
        let o = e[n];
        YE(o) || dR(o, t) && fR(o) === null && pR(o, t.index);
    } }
function YE(e) { return !(e.type & 64); }
function dR(e, t) { return YE(t) || e.index > t.index; }
function fR(e) { let t = e.insertBeforeIndex; return Array.isArray(t) ? t[0] : t; }
function pR(e, t) { let n = e.insertBeforeIndex; Array.isArray(n) ? n[0] = t : (CE(zE, QE), e.insertBeforeIndex = t); }
function Kr(e, t) { let n = e.data[t]; return n === null || typeof n == "string" ? null : n.hasOwnProperty("currentCaseLViewIndex") ? n : n.value; }
function hR(e, t, n) { let o = e.data[t]; o === null ? e.data[t] = n : o.value = n; }
function gR(e, t) { let n = e.insertBeforeIndex; n === null ? (CE(zE, QE), n = e.insertBeforeIndex = [null, t]) : (Pl(Array.isArray(n), !0, "Expecting array here"), n.push(t)); }
function mR(e, t, n) { let o = cp(e, n, 64, null, null); return ZE(t, o), o; }
function Ac(e, t) { let n = t[e.currentCaseLViewIndex]; return n === null ? n : n < 0 ? ~n : n; }
function vR(e) { return e >>> 17; }
function yR(e) { return (e & 131070) >>> 1; }
function ER(e, t, n) { return e | t << 17 | n << 1; }
function KE(e) { return e === -1; }
function lp(e, t, n) { e.index = 0; let o = Ac(t, n); o !== null ? e.removes = t.remove[o] : e.removes = V; }
function Ra(e) { if (e.index < e.removes.length) {
    let t = e.removes[e.index++];
    if (t > 0)
        return e.lView[t];
    {
        e.stack.push(e.index, e.removes);
        let n = ~t, o = e.lView[m].data[n];
        return lp(e, o, e.lView), Ra(e);
    }
}
else
    return e.stack.length === 0 ? (e.lView = void 0, null) : (e.removes = e.stack.pop(), e.index = e.stack.pop(), Ra(e)); }
function IR() { let e = { stack: [], index: -1 }; function t(n, o) { for (e.lView = o; e.stack.length;)
    e.stack.pop(); return lp(e, n.value, o), Ra.bind(null, e); } return t; }
function DR(e, t) { let n = { stack: [], index: -1, lView: t }; return lp(n, e, t), Ra.bind(null, n); }
var TR = new RegExp(`^(\\d+)*(${If}|${Ef})*(.*)`);
function CR(e, t) { let n = [e]; for (let o of t) {
    let r = n.length - 1;
    if (r > 0 && n[r - 1] === o) {
        let i = n[r] || 1;
        n[r] = i + 1;
    }
    else
        n.push(o, "");
} return n.join(""); }
function wR(e) { let t = e.match(TR), [n, o, r, i] = t, s = o ? parseInt(o, 10) : r, a = []; for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
} return [s, ...a]; }
function MR(e) { return !e.prev && e.parent?.type === 8; }
function ju(e) { return e.index - I; }
function rr(e, t) { return !(e.type & 144) && !!t[e.index] && JE(x(t[e.index])); }
function JE(e) { return !!e && !e.isConnected; }
function XE(e, t) { let n = e.i18nNodes; if (n)
    return n.get(t); }
function NR(e, t, n) { let r = e.data[Li]?.[n]; return r ? eI(r, t) : null; }
function Qi(e, t, n, o) { let r = ju(o), i = XE(e, r); if (i === void 0) {
    let s = e.data[Li];
    if (s?.[r])
        i = eI(s[r], n);
    else if (t.firstChild === o)
        i = e.firstChild;
    else {
        let a = o.prev === null, c = o.prev ?? o.parent;
        if (MR(o)) {
            let l = ju(o.parent);
            i = ud(e, l);
        }
        else {
            let l = oe(c, n);
            if (a)
                i = l.firstChild;
            else {
                let u = ju(c), d = ud(e, u);
                if (c.type === 2 && d) {
                    let p = xf(e, u) + 1;
                    i = Rc(p, d);
                }
                else
                    i = l.nextSibling;
            }
        }
    }
} return i; }
function Rc(e, t) { let n = t; for (let o = 0; o < e; o++)
    n = n.nextSibling; return n; }
function SR(e, t) { let n = e; for (let o = 0; o < t.length; o += 2) {
    let r = t[o], i = t[o + 1];
    for (let s = 0; s < i; s++)
        switch (r) {
            case uy:
                n = n.firstChild;
                break;
            case dy:
                n = n.nextSibling;
                break;
        }
} return n; }
function eI(e, t) { let [n, ...o] = wR(e), r; if (n === Ef)
    r = t[ce][$];
else if (n === If)
    r = $f(t[ce][$]);
else {
    let i = Number(n);
    r = x(t[i + I]);
} return SR(r, o); }
function xd(e, t) { if (e === t)
    return []; if (e.parentElement == null || t.parentElement == null)
    return null; if (e.parentElement === t.parentElement)
    return _R(e, t); {
    let n = t.parentElement, o = xd(e, n), r = xd(n.firstChild, t);
    return !o || !r ? null : [...o, uy, ...r];
} }
function _R(e, t) { let n = [], o = null; for (o = e; o != null && o !== t; o = o.nextSibling)
    n.push(dy); return o == null ? null : n; }
function Rm(e, t, n) { let o = xd(e, t); return o === null ? null : CR(n, o); }
function tI(e, t, n) { let o = e.parent, r, i, s; for (; o !== null && (rr(o, t) || n?.has(o.index));)
    o = o.parent; o === null || !(o.type & 3) ? (r = s = Ef, i = t[ce][$]) : (r = o.index, i = x(t[r]), s = A(r - I)); let a = x(t[e.index]); if (e.type & 44) {
    let l = Bn(t, e);
    l && (a = l);
} let c = Rm(i, a, s); if (c === null && i !== a) {
    let l = i.ownerDocument.body;
    if (c = Rm(l, a, If), c === null)
        throw tR(t, e);
} return c; }
function bR(e, t) { let n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, { acceptNode: AR }), o, r = new Map; for (; o = n.nextNode();) {
    let i = "ngh=", s = o?.textContent, a = s?.indexOf(i) ?? -1;
    if (a > -1) {
        let c = s.substring(a + i.length).trim();
        r.set(c, o);
    }
} return r; }
function AR(e) { return e.textContent?.trimStart().startsWith("ngh=") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
var nI = !1, oI = () => { };
function up(e) { nI = e; }
function xc() { return nI; }
function RR(e, t, n, o) { oI(e, t, n, o); }
function rI() { oI = PR; }
function iI(e) { return e = e ?? E(se), e.get(Cf, !1); }
function sI(e, t) { let n = t.i18nChildren.get(e); return n === void 0 && (n = xR(e), t.i18nChildren.set(e, n)), n; }
function xR(e) { let t = new Set; function n(o) { switch (t.add(o.index), o.kind) {
    case 1:
    case 2: {
        for (let r of o.children)
            n(r);
        break;
    }
    case 3: {
        for (let r of o.cases)
            for (let i of r)
                n(i);
        break;
    }
} } for (let o = I; o < e.bindingStartIndex; o++) {
    let r = e.data[o];
    if (!(!r || !r.ast))
        for (let i of r.ast)
            n(i);
} return t.size === 0 ? null : t; }
function aI(e, t, n) { if (!n.isI18nHydrationEnabled)
    return null; let o = e[m], r = o.data[t]; if (!r || !r.ast)
    return null; let i = o.data[r.parentTNodeIndex]; if (i && ey(i))
    return null; let s = { caseQueue: [], disconnectedNodes: new Set, disjointNodes: new Set }; return kd(e, s, n, r.ast), s.caseQueue.length === 0 && s.disconnectedNodes.size === 0 && s.disjointNodes.size === 0 ? null : s; }
function kd(e, t, n, o) { let r = null; for (let i of o) {
    let s = OR(e, t, n, i);
    s && (kR(r, s) && t.disjointNodes.add(i.index - I), r = s);
} return r; }
function kR(e, t) { return e && e.nextSibling !== t; }
function OR(e, t, n, o) { let r = x(e[o.index]); if (!r || JE(r))
    return t.disconnectedNodes.add(o.index - I), null; let i = r; switch (o.kind) {
    case 0: {
        kf(n, i);
        break;
    }
    case 1:
    case 2: {
        kd(e, t, n, o.children);
        break;
    }
    case 3: {
        let s = e[o.currentCaseLViewIndex];
        if (s != null) {
            let a = s < 0 ? ~s : s;
            t.caseQueue.push(a), kd(e, t, n, o.cases[a]);
        }
        break;
    }
} return LR(e, o); }
function LR(e, t) { let o = e[m].data[t.index]; return qa(o) ? Bn(e, o) : t.kind === 3 ? DR(o, e)() ?? x(e[t.index]) : x(e[t.index]) ?? null; }
function Fn(e, t) { e.currentNode = t; }
function Wr(e, t, n) { let o = n.index - I, { disconnectedNodes: r } = e, i = t.currentNode; return t.isConnected ? (e.i18nNodes.set(o, i), r.delete(o)) : r.add(o), i; }
function Vu(e, t) { let n = e.currentNode; for (let o = 0; o < t && n; o++)
    n = n?.nextSibling ?? null; return n; }
function Hu(e, t) { return { currentNode: t, isConnected: e.isConnected }; }
function PR(e, t, n, o) { let r = e[he]; if (!r || !xc() || n && (ey(n) || rc(r, n.index - I)))
    return; let i = e[m], s = i.data[t]; function a() { if (KE(o)) {
    let p = Qi(r, i, e, n);
    return n.type & 8 ? p : p.firstChild;
} return r?.firstChild; } let c = a(), l = Ay(r) ?? new Set, u = r.i18nNodes ??= new Map, d = r.data[Ja]?.[t - I] ?? [], f = r.dehydratedIcuData ??= new Map; _o({ hydrationInfo: r, lView: e, i18nNodes: u, disconnectedNodes: l, caseQueue: d, dehydratedIcuData: f }, { currentNode: c, isConnected: !0 }, s.ast), r.disconnectedNodes = l.size === 0 ? null : l; }
function _o(e, t, n) { if (Array.isArray(n)) {
    let o = t;
    for (let r of n) {
        let i = NR(e.hydrationInfo, e.lView, r.index - I);
        i && (o = Hu(t, i)), _o(e, o, r);
    }
}
else {
    if (e.disconnectedNodes.has(n.index - I))
        return;
    switch (n.kind) {
        case 0: {
            let o = Wr(e, t, n);
            Fn(t, o?.nextSibling ?? null);
            break;
        }
        case 1: {
            _o(e, Hu(t, t.currentNode?.firstChild ?? null), n.children);
            let o = Wr(e, t, n);
            Fn(t, o?.nextSibling ?? null);
            break;
        }
        case 2: {
            let o = n.index - I, { hydrationInfo: r } = e, i = _y(r, o);
            switch (n.type) {
                case 0: {
                    let s = Wr(e, t, n);
                    if (U_(r, o)) {
                        _o(e, t, n.children);
                        let a = Vu(t, 1);
                        Fn(t, a);
                    }
                    else if (_o(e, Hu(t, t.currentNode?.firstChild ?? null), n.children), Fn(t, s?.nextSibling ?? null), i !== null) {
                        let a = Vu(t, i + 1);
                        Fn(t, a);
                    }
                    break;
                }
                case 1: {
                    Wr(e, t, n);
                    let s = Vu(t, i + 1);
                    Fn(t, s);
                    break;
                }
            }
            break;
        }
        case 3: {
            let o = t.isConnected ? e.caseQueue.shift() : null, r = { currentNode: null, isConnected: !1 };
            for (let s = 0; s < n.cases.length; s++)
                _o(e, s === o ? t : r, n.cases[s]);
            o !== null && e.dehydratedIcuData.set(n.index, { case: o, node: n });
            let i = Wr(e, t, n);
            Fn(t, i?.nextSibling ?? null);
            break;
        }
    }
} }
var cI = () => { };
function FR(e, t, n) { cI(e, t, n); }
function lI() { cI = jR; }
function jR(e, t, n) { let o = e[he]?.dehydratedIcuData; o && o.get(t)?.case === n && o.delete(t); }
function VR(e) { let t = e[he]; if (t) {
    let { i18nNodes: n, dehydratedIcuData: o } = t;
    if (n && o) {
        let r = e[M];
        for (let i of o.values())
            HR(r, n, i);
    }
    t.i18nNodes = void 0, t.dehydratedIcuData = void 0;
} }
function HR(e, t, n) { for (let o of n.node.cases[n.case]) {
    let r = t.get(o.index - I);
    r && Bi(e, r, !1);
} }
function kc(e) { let t = e[He] ?? [], o = e[z][M], r = []; for (let i of t)
    i.data[Xa] !== void 0 ? r.push(i) : uI(i, o); e[He] = r; }
function BR(e) { let { lContainer: t } = e, n = t[He]; if (n === null)
    return; let r = t[z][M]; for (let i of n)
    uI(i, r); }
function uI(e, t) { let n = 0, o = e.firstChild; if (o) {
    let r = e.data[jt];
    for (; n < r;) {
        let i = o.nextSibling;
        Bi(t, o, !1), o = i, n++;
    }
} }
function Oc(e) { kc(e); let t = e[$]; ee(t) && mi(t); for (let n = L; n < e.length; n++)
    mi(e[n]); }
function mi(e) { VR(e); let t = e[m]; for (let n = I; n < t.bindingStartIndex; n++)
    if (X(e[n])) {
        let o = e[n];
        Oc(o);
    }
    else
        ee(e[n]) && mi(e[n]); }
function dp(e) { let t = e._views; for (let n of t) {
    let o = Rf(n);
    o !== null && o[$] !== null && (ee(o) ? mi(o) : Oc(o));
} }
function UR(e, t, n, o) { e !== null && (n.cleanup(t), Oc(e.lContainer), dp(o)); }
function $R(e, t) { let n = []; for (let o of t)
    for (let r = 0; r < (o[Oi] ?? 1); r++) {
        let i = { data: o, firstChild: null };
        o[jt] > 0 && (i.firstChild = e, e = Rc(o[jt], e)), n.push(i);
    } return [e, n]; }
var dI = () => null, fI = () => null;
function pI() { dI = GR, fI = qR; }
function GR(e, t) { return gI(e, t) ? e[He].shift() : (kc(e), null); }
function vi(e, t) { return dI(e, t); }
function qR(e, t, n) { if (t.tView.ssrId === null)
    return null; let o = vi(e, t.tView.ssrId); return n[m].firstUpdatePass && o === null && WR(n, t), o; }
function hI(e, t, n) { return fI(e, t, n); }
function WR(e, t) { let n = t; for (; n;) {
    if (xm(e, n))
        return;
    if ((n.flags & 256) === 256)
        break;
    n = n.prev;
} for (n = t.next; n && (n.flags & 512) === 512;) {
    if (xm(e, n))
        return;
    n = n.next;
} }
function gI(e, t) { let n = e[He]; return !t || n === null || n.length === 0 ? !1 : n[0].data[Ka] === t; }
function xm(e, t) { let n = t.tView?.ssrId; if (n == null)
    return !1; let o = e[t.index]; return X(o) && gI(o, n) ? (kc(o), !0) : !1; }
var mI = class {
}, yi = class {
}, Od = class {
    destroyNode = null;
    static __NG_ELEMENT_ID__ = () => zR();
};
function zR() { let e = g(), t = S(), n = ye(t.index, e); return (ee(n) ? n : e)[M]; }
var vI = (() => { class e {
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => null });
} return e; })();
function fp(e) { return e.ngModule !== void 0; }
function jn(e) { return !!ho(e); }
function na(e) { return !!ot(e); }
function km(e) { return !!Pe(e); }
function Jr(e) { return !!Q(e); }
function QR(e) { return Q(e) ? "component" : Pe(e) ? "directive" : ot(e) ? "pipe" : "type"; }
function ZR(e, t) { if (wr(e) && (e = j(e), !e))
    throw new Error(`Expected forwardRef function, imported from "${ze(t)}", to return a standalone entity or NgModule but got "${ze(e) || e}".`); if (ho(e) == null) {
    let n = Q(e) || Pe(e) || ot(e);
    if (n != null) {
        if (!n.standalone) {
            let o = QR(e);
            throw new Error(`The "${ze(e)}" ${o}, imported from "${ze(t)}", is not standalone. Does the ${o} have the standalone: false flag?`);
        }
    }
    else
        throw fp(e) ? new Error(`A module with providers was imported from "${ze(t)}". Modules with providers are not supported in standalone components imports.`) : new Error(`The "${ze(e)}" type, imported from "${ze(t)}", must be a standalone component / directive / pipe or an NgModule. Did you forget to add the required @Component / @Directive / @Pipe or @NgModule annotation?`);
} }
var Ld = class {
    ownerNgModule = new WeakMap;
    ngModulesWithSomeUnresolvedDecls = new Set;
    ngModulesScopeCache = new WeakMap;
    standaloneComponentsScopeCache = new WeakMap;
    resolveNgModulesDecls() { if (this.ngModulesWithSomeUnresolvedDecls.size !== 0) {
        for (let t of this.ngModulesWithSomeUnresolvedDecls) {
            let n = ho(t);
            if (n?.declarations)
                for (let o of Qr(n.declarations))
                    Jr(o) && this.ownerNgModule.set(o, t);
        }
        this.ngModulesWithSomeUnresolvedDecls.clear();
    } }
    getComponentDependencies(t, n) { this.resolveNgModulesDecls(); let o = Q(t); if (o === null)
        throw new Error(`Attempting to get component dependencies for a type that is not a component: ${t}`); if (o.standalone) {
        let r = this.getStandaloneComponentScope(t, n);
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes, ...r.compilation.ngModules] };
    }
    else {
        if (!this.ownerNgModule.has(t))
            return { dependencies: [] };
        let r = this.getNgModuleScope(this.ownerNgModule.get(t));
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes] };
    } }
    registerNgModule(t, n) { if (!jn(t))
        throw new Error(`Attempting to register a Type which is not NgModule as NgModule: ${t}`); this.ngModulesWithSomeUnresolvedDecls.add(t); }
    clearScopeCacheFor(t) { this.ngModulesScopeCache.delete(t), this.standaloneComponentsScopeCache.delete(t); }
    getNgModuleScope(t) { if (this.ngModulesScopeCache.has(t))
        return this.ngModulesScopeCache.get(t); let n = this.computeNgModuleScope(t); return this.ngModulesScopeCache.set(t, n), n; }
    computeNgModuleScope(t) { let n = ws(t), o = { exported: { directives: new Set, pipes: new Set }, compilation: { directives: new Set, pipes: new Set } }; for (let r of Qr(n.imports))
        if (jn(r)) {
            let i = this.getNgModuleScope(r);
            dn(i.exported.directives, o.compilation.directives), dn(i.exported.pipes, o.compilation.pipes);
        }
        else if (_r(r))
            if (km(r) || Jr(r))
                o.compilation.directives.add(r);
            else if (na(r))
                o.compilation.pipes.add(r);
            else
                throw new T(980, "The standalone imported type is neither a component nor a directive nor a pipe");
        else {
            o.compilation.isPoisoned = !0;
            break;
        } if (!o.compilation.isPoisoned)
        for (let r of Qr(n.declarations)) {
            if (jn(r) || _r(r)) {
                o.compilation.isPoisoned = !0;
                break;
            }
            na(r) ? o.compilation.pipes.add(r) : o.compilation.directives.add(r);
        } for (let r of Qr(n.exports))
        if (jn(r)) {
            let i = this.getNgModuleScope(r);
            dn(i.exported.directives, o.exported.directives), dn(i.exported.pipes, o.exported.pipes), dn(i.exported.directives, o.compilation.directives), dn(i.exported.pipes, o.compilation.pipes);
        }
        else
            na(r) ? o.exported.pipes.add(r) : o.exported.directives.add(r); return o; }
    getStandaloneComponentScope(t, n) { if (this.standaloneComponentsScopeCache.has(t))
        return this.standaloneComponentsScopeCache.get(t); let o = this.computeStandaloneComponentScope(t, n); return this.standaloneComponentsScopeCache.set(t, o), o; }
    computeStandaloneComponentScope(t, n) { let o = { compilation: { directives: new Set([t]), pipes: new Set, ngModules: new Set } }; for (let r of rt(n ?? [])) {
        let i = j(r);
        try {
            ZR(i, t);
        }
        catch {
            return o.compilation.isPoisoned = !0, o;
        }
        if (jn(i)) {
            o.compilation.ngModules.add(i);
            let s = this.getNgModuleScope(i);
            if (s.exported.isPoisoned)
                return o.compilation.isPoisoned = !0, o;
            dn(s.exported.directives, o.compilation.directives), dn(s.exported.pipes, o.compilation.pipes);
        }
        else if (na(i))
            o.compilation.pipes.add(i);
        else if (km(i) || Jr(i))
            o.compilation.directives.add(i);
        else
            return o.compilation.isPoisoned = !0, o;
    } return o; }
    isOrphanComponent(t) { let n = Q(t); return !n || n.standalone ? !1 : (this.resolveNgModulesDecls(), !this.ownerNgModule.has(t)); }
};
function dn(e, t) { for (let n of e)
    t.add(n); }
var Uo = new Ld;
function YR(e, t) { let n = e; for (; n;) {
    let o = a_(n);
    if (o !== null)
        for (let r = I; r < o.length; r++) {
            let i = o[r];
            if (!ee(i) && !X(i) || i[$] !== n)
                continue;
            let s = o[m], a = ln(s, r);
            if (Ne(a)) {
                let c = s.data[a.directiveStart + a.componentOffset], l = pp(c);
                if (l !== null && (!t || t(n, l)))
                    return l;
                break;
            }
        }
    n = n.parentNode;
} return null; }
function pp(e) { return e.debugInfo?.className || e.type.name || null; }
var da = {}, pn = class {
    injector;
    parentInjector;
    constructor(t, n) { this.injector = t, this.parentInjector = n; }
    get(t, n, o) { let r = this.injector.get(t, da, o); return r !== da || n === da ? r : this.parentInjector.get(t, n, o); }
};
function Ei(e) { return Lc(e) ? Array.isArray(e) || !(e instanceof Map) && Symbol.iterator in e : !1; }
function KR(e, t, n) { let o = e[Symbol.iterator](), r = t[Symbol.iterator](); for (;;) {
    let i = o.next(), s = r.next();
    if (i.done && s.done)
        return !0;
    if (i.done || s.done || !n(i.value, s.value))
        return !1;
} }
function yI(e, t) { if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
        t(e[n]);
else {
    let n = e[Symbol.iterator](), o;
    for (; !(o = n.next()).done;)
        t(o.value);
} }
function Lc(e) { return e !== null && (typeof e == "function" || typeof e == "object"); }
function EI(e, t) { let n = Ei(e), o = Ei(t); return n && o ? KR(e, t, EI) : !n && (e && (typeof e == "object" || typeof e == "function")) && !o && (t && (typeof t == "object" || typeof t == "function")) ? !0 : Object.is(e, t); }
function ut(e, t, n) { return e[t] = n; }
function ir(e, t) { return e[t]; }
function Y(e, t, n) { if (n === G)
    return !1; let o = e[t]; return Object.is(o, n) ? !1 : (e[t] = n, !0); }
function zn(e, t, n, o) { let r = Y(e, t, n); return Y(e, t + 1, o) || r; }
function Pc(e, t, n, o, r) { let i = zn(e, t, n, o); return Y(e, t + 2, r) || i; }
function et(e, t, n, o, r, i) { let s = zn(e, t, n, o); return zn(e, t + 2, r, i) || s; }
function hn(e, t, n) { return function o(r) { let i = o.__ngNativeEl__; i !== void 0 && R_(r, i); let s = Ne(e) ? ye(e.index, t) : t; _c(s, 5); let a = t[H], c = Om(t, a, n, r), l = o.__ngNextListenerFn__; for (; l;)
    c = Om(t, a, l, r) && c, l = l.__ngNextListenerFn__; return c; }; }
function Om(e, t, n, o) { let r = bo(null); try {
    return U(P.OutputStart, t, n), n(o) !== !1;
}
catch (i) {
    return sp(e, i), !1;
}
finally {
    U(P.OutputEnd, t, n), bo(r);
} }
function hp(e, t, n, o, r, i, s, a) { let c = yo(e), l = !1, u = null; if (!o && c && (u = XR(t, n, i, e.index)), u !== null) {
    let d = u.__ngLastListenerFn__ || u;
    d.__ngNextListenerFn__ = s, u.__ngLastListenerFn__ = s, l = !0;
}
else {
    let d = oe(e, n), f = o ? o(d) : d;
    x_(n, f, i, a), o || (a.__ngNativeEl__ = d);
    let p = r.listen(f, i, a);
    if (!JR(i)) {
        let h = o ? v => o(x(v[e.index])) : e.index;
        II(h, t, n, i, a, p, !1);
    }
} return l; }
function JR(e) { return e.startsWith("animation") || e.startsWith("transition"); }
function XR(e, t, n, o) { let r = e.cleanup; if (r != null)
    for (let i = 0; i < r.length - 1; i += 2) {
        let s = r[i];
        if (s === n && r[i + 1] === o) {
            let a = t[rn], c = r[i + 2];
            return a && a.length > c ? a[c] : null;
        }
        typeof s == "string" && (i += 2);
    } return null; }
function II(e, t, n, o, r, i, s) { let a = t.firstCreatePass ? nu(t) : null, c = tu(n), l = c.length; c.push(r, i), a && a.push(o, e, l, (l + 1) * (s ? -1 : 1)); }
function ex(e, t, n, o, r) { let i = hn(e, t, n), s = Pd(e, t, o, r, i); }
function Pd(e, t, n, o, r) { let i = null, s = null, a = null, c = !1, l = e.directiveToIndex.get(n.type); if (typeof l == "number" ? i = l : [i, s, a] = l, s !== null && a !== null && e.hostDirectiveOutputs?.hasOwnProperty(o)) {
    let u = e.hostDirectiveOutputs[o];
    for (let d = 0; d < u.length; d += 2) {
        let f = u[d];
        if (f >= s && f <= a)
            c = !0, xa(e, t, f, u[d + 1], o, r);
        else if (f > a)
            break;
    }
} return n.outputs.hasOwnProperty(o) && (c = !0, xa(e, t, i, o, o, r)), c; }
function xa(e, t, n, o, r, i) { let s = t[n], a = t[m], l = a.data[n].outputs[o], d = s[l].subscribe(i); II(e.index, a, t, r, i, d, !0); }
function DI() { TI(); }
function TI() { let e = g(), t = _(), n = S(); if (t.firstCreatePass && tx(t, n), n.controlDirectiveIndex === -1)
    return; re("NgSignalForms"); let o = e[n.controlDirectiveIndex]; t.data[n.controlDirectiveIndex].controlDef.create(o, new ka(e, t, n)); }
function CI() { wI(); }
function wI() { let e = g(), t = _(), n = Oe(); if (n.controlDirectiveIndex === -1)
    return; let o = t.data[n.controlDirectiveIndex].controlDef, r = e[n.controlDirectiveIndex]; o.update(r, new ka(e, t, n)); }
var ka = class {
    lView;
    tView;
    tNode;
    hasPassThrough;
    constructor(t, n, o) { this.lView = t, this.tView = n, this.tNode = o, this.hasPassThrough = !!(o.flags & 4096); }
    get customControl() { return this.tNode.customControlIndex !== -1 ? this.lView[this.tNode.customControlIndex] : void 0; }
    get nativeElement() { return oe(this.tNode, this.lView); }
    get descriptor() { return `<${this.tNode.value}>`; }
    listenToCustomControlOutput(t, n) { let o = this.tView.data[this.tNode.customControlIndex]; Pd(this.tNode, this.lView, o, t, hn(this.tNode, this.lView, n)); }
    listenToCustomControlModel(t) { let n = this.tNode.flags & 1024 ? "valueChange" : "checkedChange", o = this.tView.data[this.tNode.customControlIndex]; Pd(this.tNode, this.lView, o, n, hn(this.tNode, this.lView, t)); }
    listenToDom(t, n) { hp(this.tNode, this.tView, this.lView, void 0, this.lView[M], t, n, hn(this.tNode, this.lView, n)); }
    setInputOnDirectives(t, n) { let o = this.tNode.inputs?.[t], r = this.tNode.hostDirectiveInputs?.[t]; if (!o && !r)
        return !1; let i = !1; if (o)
        for (let s of o) {
            if (s === this.tNode.controlDirectiveIndex)
                continue;
            let a = this.tView.data[s], c = this.lView[s];
            qn(a, c, t, n), i = !0;
        } if (r)
        for (let s = 0; s < r.length; s += 2) {
            let a = r[s];
            if (a === this.tNode.controlDirectiveIndex)
                continue;
            let c = r[s + 1], l = this.tView.data[a], u = this.lView[a];
            qn(l, u, c, n), i = !0;
        } return i; }
    setCustomControlModelInput(t) { let n = this.tView.data[this.tNode.customControlIndex], o = this.tNode.flags & 1024 ? "value" : "checked"; OE(this.tNode, this.tView, this.lView, n, o, t); }
    customControlHasInput(t) { if (this.tNode.customControlIndex === -1)
        return !1; let n = this.tView.data[this.tNode.customControlIndex]; return (n.signalFormsInputPresence ??= this._buildCustomControlInputCache(n))[t] === !0; }
    _buildCustomControlInputCache(t) { let n = {}; for (let o in t.inputs)
        n[o] = !0; if (t.hostDirectives !== null) {
        let o = [...t.hostDirectives];
        for (; o.length > 0;) {
            let r = o.shift();
            if (typeof r != "function") {
                for (let s in r.inputs)
                    n[r.inputs[s]] = !0;
                let i = Lm(r.directive);
                i !== null && o.push(...i);
                continue;
            }
            for (let i of r()) {
                if (typeof i == "function")
                    continue;
                if (i.inputs)
                    for (let a = 0; a < i.inputs.length; a += 2) {
                        let c = i.inputs[a + 1] || i.inputs[a];
                        n[c] = !0;
                    }
                let s = Lm(i.directive);
                s !== null && o.push(...s);
            }
        }
    } return n; }
};
function Lm(e) { return typeof e == "function" && "\u0275dir" in e ? e.\u0275dir.hostDirectives ?? null : null; }
function tx(e, t, n) { for (let r = t.directiveStart; r < t.directiveEnd; r++)
    if (e.data[r].controlDef) {
        t.controlDirectiveIndex = r;
        break;
    } if (t.controlDirectiveIndex === -1)
    return; let o = e.data[t.controlDirectiveIndex].controlDef; if (o.passThroughInput && (t.inputs?.[o.passThroughInput]?.length ?? 0) > 1) {
    t.flags |= 4096;
    return;
} nx(e, t); }
function nx(e, t) { for (let n = t.directiveStart; n < t.directiveEnd; n++) {
    let o = e.data[n];
    if (!(t.directiveToIndex && !t.directiveToIndex.has(o.type))) {
        if (Pm(o, "value")) {
            t.flags |= 1024, t.customControlIndex = n;
            return;
        }
        if (Pm(o, "checked")) {
            t.flags |= 2048, t.customControlIndex = n;
            return;
        }
    }
} if (t.hostDirectiveInputs !== null && t.hostDirectiveOutputs !== null && t.directiveToIndex !== null) {
    let n = (o, r) => { let i = t.hostDirectiveInputs[o], s = t.hostDirectiveOutputs[o + "Change"]; if (!i || !s)
        return !1; for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        for (let l = 0; l < s.length; l += 2) {
            let u = s[l];
            if (c === u)
                for (let d of t.directiveToIndex.values()) {
                    if (!Array.isArray(d))
                        continue;
                    let [f, p, h] = d;
                    if (c >= p && c <= h)
                        return t.flags |= r, t.customControlIndex = f, !0;
                }
        }
    } return !1; };
    if (n("value", 1024) || n("checked", 2048))
        return;
} }
function Pm(e, t) { return ox(e, t) && rx(e, t + "Change"); }
function ox(e, t) { return t in e.inputs; }
function rx(e, t) { return t in e.outputs; }
var Ft = Symbol("BINDING"), Fm = { kind: "input", requiredVars: 1 }, ix = { kind: "output", requiredVars: 0 };
function jm(e, t, n) { let o = g(), r = Te(); if (Y(o, r, n)) {
    let i = o[m], s = Oe(), a = ye(s.index, o);
    _c(a, 1);
    let c = i.directiveRegistry[e], l = OE(s, i, o, c, t, n);
} }
function MI(e, t) { if (e === "formField") {
    let o = { [Ft]: Fm, create: () => { TI(); }, update: () => { jm(o.targetIdx, e, t()), wI(); } };
    return o;
} let n = { [Ft]: Fm, update: () => jm(n.targetIdx, e, t()) }; return n; }
function NI(e, t) { let n = { [Ft]: ix, create: () => { let o = g(), r = S(), s = o[m].directiveRegistry[n.targetIdx]; ex(r, o, t, s, e); } }; return n; }
function sx(e, t) { let n = MI(e, t), o = NI(e + "Change", i => t.set(i)); return { [Ft]: { kind: "twoWay", requiredVars: n[Ft].requiredVars + o[Ft].requiredVars }, set targetIdx(i) { n.targetIdx = i, o.targetIdx = i; }, create: o.create, update: n.update }; }
var SI = new C("");
function Oa(e, t, n) { let o = n ? e.styles : null, r = n ? e.classes : null, i = 0; if (t !== null)
    for (let s = 0; s < t.length; s++) {
        let a = t[s];
        if (typeof a == "number")
            i = a;
        else if (i == 1)
            r = Ts(r, a);
        else if (i == 2) {
            let c = a, l = t[++s];
            o = Ts(o, c + ": " + l + ";");
        }
    } n ? e.styles = o : e.stylesWithoutHost = o, n ? e.classes = r : e.classesWithoutHost = r; }
function sr(e, t = 0) { let n = g(); if (n === null)
    return me(e, t); let o = S(); return ff(o, n, j(e), t); }
function _I() { let e = "invalid"; throw new Error(e); }
function bI(e, t, n, o, r) { let i = o === null ? null : { "": -1 }, s = r(e, n); if (s !== null) {
    let a = s, c = null, l = null;
    for (let u of s)
        if (u.resolveHostDirectives !== null) {
            [a, c, l] = u.resolveHostDirectives(s);
            break;
        }
    lx(e, t, n, a, i, c, l);
} i !== null && o !== null && ax(n, o, i); }
function ax(e, t, n) { let o = e.localNames = []; for (let r = 0; r < t.length; r += 2) {
    let i = n[t[r + 1]];
    if (i == null)
        throw new T(-301, !1);
    o.push(t[r], i);
} }
function cx(e, t, n) { t.componentOffset = n, (e.components ??= []).push(t.index); }
function lx(e, t, n, o, r, i, s) { let a = o.length, c = null; for (let f = 0; f < a; f++) {
    let p = o[f];
    c === null && Ke(p) && (c = p, cx(e, n, f)), nd(Ea(n, t), e, p.type);
} gx(n, e.data.length, a), c?.viewProvidersResolver && c.viewProvidersResolver(c); for (let f = 0; f < a; f++) {
    let p = o[f];
    p.providersResolver && p.providersResolver(p);
} let l = !1, u = !1, d = Wi(e, t, a, null); a > 0 && (n.directiveToIndex = new Map); for (let f = 0; f < a; f++) {
    let p = o[f];
    if (n.mergedAttrs = Ho(n.mergedAttrs, p.hostAttrs), dx(e, n, t, d, p), hx(d, p, r), s !== null && s.has(p)) {
        let [v, y] = s.get(p);
        n.directiveToIndex.set(p.type, [d, v + n.directiveStart, y + n.directiveStart]);
    }
    else
        (i === null || !i.has(p)) && n.directiveToIndex.set(p.type, d);
    p.contentQueries !== null && (n.flags |= 4), (p.hostBindings !== null || p.hostAttrs !== null || p.hostVars !== 0) && (n.flags |= 64);
    let h = p.type.prototype;
    !l && (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), l = !0), !u && (h.ngOnChanges || h.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = !0), d++;
} ux(e, n, i); }
function ux(e, t, n) { for (let o = t.directiveStart; o < t.directiveEnd; o++) {
    let r = e.data[o];
    if (n === null || !n.has(r))
        Vm(0, t, r, o), Vm(1, t, r, o), Bm(t, o, !1);
    else {
        let i = n.get(r);
        Hm(0, t, i, o), Hm(1, t, i, o), Bm(t, o, !0);
    }
} }
function Vm(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s;
        e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(o), AI(t, i);
    } }
function Hm(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s = r[i], a;
        e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(o, i), AI(t, s);
    } }
function AI(e, t) { t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16); }
function Bm(e, t, n) { let { attrs: o, inputs: r, hostDirectiveInputs: i } = e; if (o === null || !n && r === null || n && i === null || Gf(e)) {
    e.initialInputs ??= [], e.initialInputs.push(null);
    return;
} let s = null, a = 0; for (; a < o.length;) {
    let c = o[a];
    if (c === 0) {
        a += 4;
        continue;
    }
    else if (c === 5) {
        a += 2;
        continue;
    }
    else if (typeof c == "number")
        break;
    if (!n && r.hasOwnProperty(c)) {
        let l = r[c];
        for (let u of l)
            if (u === t) {
                s ??= [], s.push(c, o[a + 1]);
                break;
            }
    }
    else if (n && i.hasOwnProperty(c)) {
        let l = i[c];
        for (let u = 0; u < l.length; u += 2)
            if (l[u] === t) {
                s ??= [], s.push(l[u + 1], o[a + 1]);
                break;
            }
    }
    a += 2;
} e.initialInputs ??= [], e.initialInputs.push(s); }
function dx(e, t, n, o, r) { e.data[o] = r; let i = r.factory || (r.factory = en(r.type, !0)), s = new $n(i, Ke(r), sr, null); e.blueprint[o] = s, n[o] = s, fx(e, t, o, Wi(e, n, r.hostVars, G), r); }
function fx(e, t, n, o, r) { let i = r.hostBindings; if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    px(s) != a && s.push(a), s.push(n, o, i);
} }
function px(e) { let t = e.length; for (; t > 0;) {
    let n = e[--t];
    if (typeof n == "number" && n < 0)
        return n;
} return 0; }
function hx(e, t, n) { if (n) {
    if (t.exportAs)
        for (let o = 0; o < t.exportAs.length; o++)
            n[t.exportAs[o]] = e;
    Ke(t) && (n[""] = e);
} }
function gx(e, t, n) { e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t; }
function gp(e, t, n, o, r, i, s, a) { let c = t[m], l = c.consts, u = fe(l, s), d = yn(c, e, n, o, u); return i && bI(c, t, d, fe(l, a), r), d.mergedAttrs = Ho(d.mergedAttrs, d.attrs), d.attrs !== null && Oa(d, d.attrs, !1), d.mergedAttrs !== null && Oa(d, d.mergedAttrs, !0), c.queries !== null && c.queries.elementStart(c, d), d; }
function mp(e, t) { Rv(e, t), Yl(t) && e.queries.elementEnd(t); }
function RI(e, t, n, o, r, i) { let s = t.consts, a = fe(s, r), c = yn(t, e, n, o, a); if (c.mergedAttrs = Ho(c.mergedAttrs, c.attrs), i != null) {
    let l = fe(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2)
        c.localNames.push(l[u], -1);
} return c.attrs !== null && Oa(c, c.attrs, !1), c.mergedAttrs !== null && Oa(c, c.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, c), c; }
var xI = typeof ShadowRoot < "u", mx = typeof Document < "u";
function vx(e) { return Object.keys(e).map(t => { let [n, o, r] = e[t], i = { propName: n, templateName: t, isSignal: (o & Ic.SignalBased) !== 0 }; return r && (i.transform = r), i; }); }
function yx(e) { return Object.keys(e).map(t => ({ propName: e[t], templateName: t })); }
function Ex(e, t, n) { let o = t instanceof xe ? t : t?.injector; return o && e.getStandaloneInjector !== null && (o = e.getStandaloneInjector(o) || o), o ? new pn(n, o) : n; }
function Ix(e) { let t = e.get(yi, null); if (t === null)
    throw new T(407, !1); let n = e.get(vI, null), o = e.get(We, null), r = e.get(oo, null, { optional: !0 }); return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: o, ngReflect: !1, tracingService: r }; }
function Dx(e, t) { let n = kI(e); return ac(t, n, n === "svg" ? bn : n === "math" ? Fr : null); }
function Tx(e) { if (e?.toLowerCase() === "script")
    throw new T(905, !1); }
function kI(e) { return (e.selectors[0][0] || "div").toLowerCase(); }
var Qn = class {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() { return this.cachedInputs ??= vx(this.componentDef.inputs), this.cachedInputs; }
    get outputs() { return this.cachedOutputs ??= yx(this.componentDef.outputs), this.cachedOutputs; }
    constructor(t, n) { this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = Qb(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n; }
    create(t, n, o, r, i, s) { U(P.DynamicComponentStart); let a = R(null); try {
        let c = this.componentDef, l = Ex(c, r || this.ngModule, t), u = Ix(l), d = u.tracingService;
        return d && d.componentCreate ? d.componentCreate(pp(c), () => this.createComponentRef(u, l, n, o, i, s)) : this.createComponentRef(u, l, n, o, i, s);
    }
    finally {
        R(a);
    } }
    createComponentRef(t, n, o, r, i, s) { let a = this.componentDef, c = Cx(r, a, s, i), l = t.rendererFactory.createRenderer(null, a), u = r ? NA(l, r, a.encapsulation, n) : Dx(a, l); Tx(u?.tagName); let d = n.get(SI, null), f = wx(u, () => n.get(xt, null) ?? xi()); d && d.addHost(f); let p = s?.some(Um) || i?.some(y => typeof y != "function" && y.bindings.some(Um)), h = qi(null, c, null, 512 | np(a), null, null, t, l, n, null, Ny(u, n, !0)); d && xI && f instanceof ShadowRoot && Io(h, () => { d.removeHost(f); }), h[I] = u, Bs(h); let v = null; try {
        let y = gp(I, h, 2, "#host", () => c.directiveRegistry, !0, 0);
        Yy(l, u, y), Be(u, h), Dc(c, h, y), Of(c, y, h), mp(c, y), o !== void 0 && Nx(y, this.ngContentSelectors, o), v = ye(y.index, h), h[H] = v[H], Nc(c, h, null);
    }
    catch (y) {
        throw v !== null && id(v), id(h), y;
    }
    finally {
        U(P.DynamicComponentEnd), Us();
    } return new La(this.componentType, h, !!p); }
};
function Cx(e, t, n, o) { let r = e ? ["ng-version", "22.1.1"] : Zb(t.selectors[0]), i = null, s = null, a = 0; if (n)
    for (let u of n)
        a += u[Ft].requiredVars, u.create && (u.targetIdx = 0, (i ??= []).push(u)), u.update && (u.targetIdx = 0, (s ??= []).push(u)); if (o)
    for (let u = 0; u < o.length; u++) {
        let d = o[u];
        if (typeof d != "function")
            for (let f of d.bindings) {
                a += f[Ft].requiredVars;
                let p = u + 1;
                f.create && (f.targetIdx = p, (i ??= []).push(f)), f.update && (f.targetIdx = p, (s ??= []).push(f));
            }
    } let c = [t]; if (o)
    for (let u of o) {
        let d = typeof u == "function" ? u : u.type, f = Pe(d);
        c.push(f);
    } return yc(0, null, Mx(i, s), 1, a, c, null, null, null, [r], null); }
function wx(e, t) { let n = e.getRootNode?.(); return mx && n instanceof Document ? n.head : n && xI && n instanceof ShadowRoot ? n : t().head; }
function Mx(e, t) { return !e && !t ? null : n => { if (n & 1 && e)
    for (let o of e)
        o.create(); if (n & 2 && t)
    for (let o of t)
        o.update(); }; }
function Um(e) { let t = e[Ft].kind; return t === "input" || t === "twoWay"; }
var La = class extends mI {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, o) { super(), this._rootLView = n, this._hasInputBindings = o, this._tNode = ln(n[m], I), this.location = Zo(this._tNode, n), this.instance = ye(this._tNode.index, n)[H], this.hostView = this.changeDetectorRef = new Ht(n, void 0), this.componentType = t; }
    setInput(t, n) { this._hasInputBindings; let o = this._tNode; if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
        return; let r = this._rootLView, i = Mc(o, r[m], r, t, n); this.previousInputValues.set(t, n); let s = ye(o.index, r); _c(s, 1); }
    get injector() { return new Se(this._tNode, this._rootLView); }
    destroy() { this.hostView.destroy(); }
    onDestroy(t) { this.hostView.onDestroy(t); }
};
function Nx(e, t, n) { let o = e.projection = []; for (let r = 0; r < t.length; r++) {
    let i = n[r];
    o.push(i != null && i.length ? Array.from(i) : null);
} }
var Fc = (() => { class e {
    static __NG_ELEMENT_ID__ = Sx;
} return e; })();
function Sx() { let e = S(); return OI(e, g()); }
var Fd = class e extends Fc {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, o) { super(), this._lContainer = t, this._hostTNode = n, this._hostLView = o; }
    get element() { return Zo(this._hostTNode, this._hostLView); }
    get injector() { return new Se(this._hostTNode, this._hostLView); }
    get parentInjector() { let t = df(this._hostTNode, this._hostLView); if (Lv(t)) {
        let n = va(t, this._hostLView), o = ma(t), r = n[m].data[o + 8];
        return new Se(r, n);
    }
    else
        return new Se(null, this._hostLView); }
    clear() { for (; this.length > 0;)
        this.remove(this.length - 1); }
    get(t) { let n = $m(this._lContainer); return n !== null && n[t] || null; }
    get length() { return this._lContainer.length - L; }
    createEmbeddedView(t, n, o) { let r, i; typeof o == "number" ? r = o : o != null && (r = o.index, i = o.injector); let s = vi(this._lContainer, t.ssrId), a = t.createEmbeddedViewImpl(n || {}, i, s); return this.insertImpl(a, r, Wn(this._hostTNode, s)), a; }
    createComponent(t, n, o, r, i, s, a) { let c, l = n || {}; c = l.index, o = l.injector, r = l.projectableNodes, i = l.environmentInjector || l.ngModuleRef, s = l.directives, a = l.bindings; let u = new Qn(Q(t)), d = o || this.parentInjector; if (!i && u.ngModule == null) {
        let D = this.parentInjector.get(xe, null);
        D && (i = D);
    } let f = Q(u.componentType ?? {}), p = vi(this._lContainer, f?.id ?? null), h = p?.firstChild ?? null, v = u.create(d, r, h, i, s, a); return this.insertImpl(v.hostView, c, Wn(this._hostTNode, p)), v; }
    insert(t, n) { return this.insertImpl(t, n, !0); }
    insertImpl(t, n, o) { let r = t._lView; if (Hg(r)) {
        let a = this.indexOf(t);
        if (a !== -1)
            this.detach(a);
        else {
            let c = r[z], l = new e(c, c[ae], c[z]);
            l.detach(l.indexOf(t));
        }
    } let i = this._adjustIndex(n), s = this._lContainer; return qt(s, r, i, o), t.attachToViewContainerRef(), Bl(Bu(s), i, t), t; }
    move(t, n) { return this.insert(t, n); }
    indexOf(t) { let n = $m(this._lContainer); return n !== null ? n.indexOf(t) : -1; }
    remove(t) { let n = this._adjustIndex(t, -1), o = hi(this._lContainer, n); o && (Ar(Bu(this._lContainer), n), Gi(o[m], o)); }
    detach(t) { let n = this._adjustIndex(t, -1), o = hi(this._lContainer, n); return o && Ar(Bu(this._lContainer), n) != null ? new Ht(o) : null; }
    _adjustIndex(t, n = 0) { return t ?? this.length + n; }
};
function $m(e) { return e[Pr]; }
function Bu(e) { return e[Pr] || (e[Pr] = []); }
function OI(e, t) { let n, o = t[e.index]; return X(o) ? n = o : (n = ap(o, t, null, e), t[e.index] = n, Ec(t, n)), LI(n, t, e, o), new Fd(n, e, t); }
function _x(e, t) { let n = e[M], o = n.createComment(""), r = oe(t, e), i = n.parentNode(r); return lt(n, i, o, n.nextSibling(r), !1), o; }
var LI = FI, vp = () => !1;
function PI(e, t, n) { return vp(e, t, n); }
function FI(e, t, n, o) { if (e[ht])
    return; let r; n.type & 8 ? r = x(o) : r = _x(t, n), e[ht] = r; }
function bx(e, t, n) { if (e[ht] && e[He])
    return !0; let o = n[he], r = t.index - I; if (!o || Yo(t) || rc(o, r))
    return !1; let s = ud(o, r), a = o.data[Ko]?.[r]; if (a === void 0)
    return !1; let [c, l] = $R(s, a); return e[ht] = c, e[He] = l, !0; }
function Ax(e, t, n, o) { vp(e, n, t) || FI(e, t, n, o); }
function jI() { LI = Ax, vp = bx; }
var jd = class e {
    queryList;
    matches = null;
    constructor(t) { this.queryList = t; }
    clone() { return new e(this.queryList); }
    setDirty() { this.queryList.setDirty(); }
}, Vd = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    createEmbeddedView(t) { let n = t.queries; if (n !== null) {
        let o = t.contentQueries !== null ? t.contentQueries[0] : n.length, r = [];
        for (let i = 0; i < o; i++) {
            let s = n.getByIndex(i), a = this.queries[s.indexInDeclarationView];
            r.push(a.clone());
        }
        return new e(r);
    } return null; }
    insertView(t) { this.dirtyQueriesWithMatches(t); }
    detachView(t) { this.dirtyQueriesWithMatches(t); }
    finishViewCreation(t) { this.dirtyQueriesWithMatches(t); }
    dirtyQueriesWithMatches(t) { for (let n = 0; n < this.queries.length; n++)
        Ep(t, n).matches !== null && this.queries[n].setDirty(); }
}, Pa = class {
    flags;
    read;
    predicate;
    constructor(t, n, o = null) { this.flags = n, this.read = o, typeof t == "string" ? this.predicate = Lx(t) : this.predicate = t; }
}, Hd = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    elementStart(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].elementStart(t, n); }
    elementEnd(t) { for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t); }
    embeddedTView(t) { let n = null; for (let o = 0; o < this.length; o++) {
        let r = n !== null ? n.length : 0, i = this.getByIndex(o).embeddedTView(t, r);
        i && (i.indexInDeclarationView = o, n !== null ? n.push(i) : n = [i]);
    } return n !== null ? new e(n) : null; }
    template(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].template(t, n); }
    getByIndex(t) { return this.queries[t]; }
    get length() { return this.queries.length; }
    track(t) { this.queries.push(t); }
}, Bd = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) { this.metadata = t, this._declarationNodeIndex = n; }
    elementStart(t, n) { this.isApplyingToNode(n) && this.matchTNode(t, n); }
    elementEnd(t) { this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1); }
    template(t, n) { this.elementStart(t, n); }
    embeddedTView(t, n) { return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0, this.addMatch(-t.index, n), new e(this.metadata)) : null; }
    isApplyingToNode(t) { if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex, o = t.parent;
        for (; o !== null && o.type & 8 && o.index !== n;)
            o = o.parent;
        return n === (o !== null ? o.index : -1);
    } return this._appliesToNextNode; }
    matchTNode(t, n) { let o = this.metadata.predicate; if (Array.isArray(o))
        for (let r = 0; r < o.length; r++) {
            let i = o[r];
            this.matchTNodeWithReadOption(t, n, Rx(n, i)), this.matchTNodeWithReadOption(t, n, ca(n, t, i, !1, !1));
        }
    else
        o === gi ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, ca(n, t, o, !1, !1)); }
    matchTNodeWithReadOption(t, n, o) { if (o !== null) {
        let r = this.metadata.read;
        if (r !== null)
            if (r === Ri || r === Fc || r === gi && n.type & 4)
                this.addMatch(n.index, -2);
            else {
                let i = ca(n, t, r, !1, !1);
                i !== null && this.addMatch(n.index, i);
            }
        else
            this.addMatch(n.index, o);
    } }
    addMatch(t, n) { this.matches === null ? this.matches = [t, n] : this.matches.push(t, n); }
};
function Rx(e, t) { let n = e.localNames; if (n !== null) {
    for (let o = 0; o < n.length; o += 2)
        if (n[o] === t)
            return n[o + 1];
} return null; }
function xx(e, t) { return e.type & 11 ? Zo(e, t) : e.type & 4 ? bc(e, t) : null; }
function kx(e, t, n, o) { return n === -1 ? xx(t, e) : n === -2 ? Ox(e, t, o) : ci(e, e[m], n, t); }
function Ox(e, t, n) { if (n === Ri)
    return Zo(t, e); if (n === gi)
    return bc(t, e); if (n === Fc)
    return OI(t, e); }
function VI(e, t, n, o) { let r = t[pt].queries[o]; if (r.matches === null) {
    let i = e.data, s = n.matches, a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
        let l = s[c];
        if (l < 0)
            a.push(null);
        else {
            let u = i[l];
            a.push(kx(t, u, s[c + 1], n.metadata.read));
        }
    }
    r.matches = a;
} return r.matches; }
function Ud(e, t, n, o) { let r = e.queries.getByIndex(n), i = r.matches; if (i !== null) {
    let s = VI(e, t, r, n);
    for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        if (c > 0)
            o.push(s[a / 2]);
        else {
            let l = i[a + 1], u = t[-c];
            for (let d = L; d < u.length; d++) {
                let f = u[d];
                f[cn] === f[z] && Ud(f[m], f, l, o);
            }
            if (u[On] !== null) {
                let d = u[On];
                for (let f = 0; f < d.length; f++) {
                    let p = d[f];
                    Ud(p[m], p, l, o);
                }
            }
        }
    }
} return o; }
function yp(e, t) { return e[pt].queries[t].queryList; }
function HI(e, t, n) { let o = new Ta((n & 4) === 4); return Bg(e, t, o, o.destroy), (t[pt] ??= new Vd).queries.push(new jd(o)) - 1; }
function BI(e, t, n) { let o = _(); return o.firstCreatePass && ($I(o, new Pa(e, t, n), -1), (t & 2) === 2 && (o.staticViewQueries = !0)), HI(o, g(), t); }
function UI(e, t, n, o) { let r = _(); if (r.firstCreatePass) {
    let i = S();
    $I(r, new Pa(t, n, o), i.index), Px(r, e), (n & 2) === 2 && (r.staticContentQueries = !0);
} return HI(r, g(), n); }
function Lx(e) { return e.split(",").map(t => t.trim()); }
function $I(e, t, n) { e.queries === null && (e.queries = new Hd), e.queries.track(new Bd(t, n)); }
function Px(e, t) { let n = e.contentQueries || (e.contentQueries = []), o = n.length ? n[n.length - 1] : -1; t !== o && n.push(e.queries.length - 1, t); }
function Ep(e, t) { return e.queries.getByIndex(t); }
function GI(e, t) { let n = e[m], o = Ep(n, t); return o.crossesNgTemplate ? Ud(n, e, t, []) : VI(n, e, o, t); }
function Ip(e, t, n) { let o, r = ps(() => { o._dirtyCounter(); let i = Fx(o, e); if (t && i === void 0)
    throw new T(-951, !1); return i; }); return o = r[K], o._dirtyCounter = Et(0), o._flatValue = void 0, r; }
function Dp(e) { return Ip(!0, !1, e); }
function Tp(e) { return Ip(!0, !0, e); }
function Cp(e) { return Ip(!1, !1, e); }
function qI(e, t) { let n = e[K]; n._lView = g(), n._queryIndex = t, n._queryList = yp(n._lView, t), n._queryList.onDirty(() => n._dirtyCounter.update(o => o + 1)); }
function Fx(e, t) { let n = e._lView, o = e._queryIndex; if (n === void 0 || o === void 0 || n[w] & 4)
    return t ? void 0 : V; let r = yp(n, o), i = GI(n, o); return r.reset(i, Jv), t ? r.first : r._changesDetected || e._flatValue === void 0 ? e._flatValue = r.toArray() : e._flatValue; }
function wp(e) { return !!e && typeof e.then == "function"; }
function WI(e) { return !!e && typeof e.subscribe == "function"; }
var Zn = class {
}, zI = class {
};
function jx(e, t) { return new $o(e, t ?? null, []); }
var $o = class extends Zn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    constructor(t, n, o, r = !0) { super(), this.ngModuleType = t, this._parent = n; let i = ho(t); this._bootstrapComponents = Qr(i.bootstrap), this._r3Injector = Du(t, n, [{ provide: Zn, useValue: this }, ...o], Tr(t), new Set(["environment"])), r && this.resolveInjectorInitializers(); }
    resolveInjectorInitializers() { this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType); }
    get injector() { return this._r3Injector; }
    destroy() { let t = this._r3Injector; !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null; }
    onDestroy(t) { this.destroyCbs.push(t); }
}, Go = class extends zI {
    moduleType;
    constructor(t) { super(), this.moduleType = t; }
    create(t) { return new $o(this.moduleType, t, []); }
};
function QI(e, t, n) { return new $o(e, t, n, !1); }
var Ii = class extends Zn {
    injector;
    instance = null;
    constructor(t) { super(); let n = new nt([...t.providers, { provide: Zn, useValue: this }], t.parent || vo(), t.debugName, new Set(["environment"])); this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers(); }
    destroy() { this.injector.destroy(); }
    onDestroy(t) { this.injector.onDestroy(t); }
};
function Mp(e, t, n = null) { return new Ii({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector; }
var Vx = (() => { class e {
    _injector;
    cachedInjectors = new Map;
    constructor(n) { this._injector = n; }
    getOrCreateStandaloneInjector(n) { if (!n.standalone)
        return null; if (!this.cachedInjectors.has(n)) {
        let o = As(!1, n.type), r = o.length > 0 ? Mp([o], this._injector, "") : null;
        this.cachedInjectors.set(n, r);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = J({ token: e, providedIn: "environment", factory: () => new e(me(xe)) });
} return e; })();
function ZI(e) { return Ct(() => { let t = XI(e), n = ne(F({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection !== Qa.Eager, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? r => r.get(Vx).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? !1, data: e.data || {}, encapsulation: e.encapsulation || Xe.Emulated, styles: e.styles || V, _: null, schemas: e.schemas || null, tView: null, id: "" }); t.standalone && re("NgStandalone"), eD(n); let o = e.dependencies; return n.directiveDefs = Fa(o, YI), n.pipeDefs = Fa(o, ot), n.id = $x(n), n; }); }
function YI(e) { return Q(e) || Pe(e); }
function Np(e) { return Ct(() => ({ type: e.type, bootstrap: e.bootstrap || V, declarations: e.declarations || V, imports: e.imports || V, exports: e.exports || V, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null })); }
function Hx(e, t) { if (e == null)
    return Rt; let n = {}; for (let o in e)
    if (e.hasOwnProperty(o)) {
        let r = e[o], i, s, a, c;
        Array.isArray(r) ? (a = r[0], i = r[1], s = r[2] ?? i, c = r[3] || null) : (i = r, s = r, a = Ic.None, c = null), n[i] = [o, a, c], t[i] = s;
    } return n; }
function Bx(e) { if (e == null)
    return Rt; let t = {}; for (let n in e)
    e.hasOwnProperty(n) && (t[e[n]] = n); return t; }
function KI(e) { return Ct(() => { let t = XI(e); return eD(t), t; }); }
function JI(e) { return { type: e.type, name: e.name, factory: null, pure: e.pure !== !1, standalone: e.standalone ?? !0, onDestroy: e.type.prototype.ngOnDestroy || null }; }
function XI(e) { let t = {}; return { type: e.type, providersResolver: null, viewProvidersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || Rt, exportAs: e.exportAs || null, standalone: e.standalone ?? !0, signals: e.signals === !0, selectors: e.selectors || V, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, resolveHostDirectives: null, hostDirectives: null, controlDef: null, signalFormsInputPresence: null, inputs: Hx(e.inputs, t), outputs: Bx(e.outputs), debugInfo: null }; }
function eD(e) { e.features?.forEach(t => t(e)); }
function Fa(e, t) { return e ? () => { let n = typeof e == "function" ? e() : e, o = []; for (let r of n) {
    let i = t(r);
    i !== null && o.push(i);
} return o; } : null; }
var Ux = new Map;
function $x(e) { let t = 0, n = typeof e.consts == "function" ? "" : e.consts, o = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery]; for (let i of o.join("|"))
    t = Math.imul(31, t) + i.charCodeAt(0) << 0; return t += 2147483648, "c" + t; }
var Xr = "__ngAsyncComponentMetadataFn__", tD = "__ngAsyncMetadataLoaded__";
function Gx(e) { let t = e; return t[Xr] === tD ? null : t[Xr] ?? null; }
function nD(e, t, n) { let o = e; return o[Xr] = () => Promise.all(t()).then(r => (n(...r), o[Xr] = tD, r)), o[Xr]; }
function Sp(e, t, n, o) { return Ct(() => { let r = e; t !== null && (r.hasOwnProperty("decorators") && r.decorators !== void 0 ? r.decorators.push(...t) : r.decorators = t), n !== null && (r.ctorParameters = n), o !== null && (r.hasOwnProperty("propDecorators") && r.propDecorators !== void 0 ? r.propDecorators = F(F({}, r.propDecorators), o) : r.propDecorators = o); }); }
var _p = new C("");
function oD(e) { return je([{ provide: _p, multi: !0, useValue: e }]); }
var bp = (() => { class e {
    resolve;
    reject;
    initialized = !1;
    done = !1;
    donePromise = new Promise((n, o) => { this.resolve = n, this.reject = o; });
    appInits = E(_p, { optional: !0 }) ?? [];
    injector = E(se);
    constructor() { }
    runInitializers() { if (this.initialized)
        return; let n = []; for (let r of this.appInits) {
        let i = Or(this.injector, r);
        if (wp(i))
            n.push(i);
        else if (WI(i)) {
            let s = new Promise((a, c) => { i.subscribe({ complete: a, error: c }); });
            n.push(s);
        }
    } let o = () => { this.done = !0, this.resolve(); }; Promise.all(n).then(() => { o(); }).catch(r => { this.reject(r); }), n.length === 0 && o(), this.initialized = !0; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })(), Yn = new Map, Di = new Set;
function rD(e) { return Ce(this, null, function* () { let t = Yn; Yn = new Map; let n = new Map; function o(i) { let s = n.get(i); if (s)
    return s; let a = e(i).then(c => Zx(i, c)); return n.set(i, a), a; } let r = Array.from(t).map(a => Ce(null, [a], function* ([i, s]) { if (s.styleUrl && s.styleUrls?.length)
    throw new Error("@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"); let c = []; s.templateUrl && c.push(o(s.templateUrl).then(f => { s.template = f; })); let l = typeof s.styles == "string" ? [s.styles] : s.styles ?? []; s.styles = l; let { styleUrl: u, styleUrls: d } = s; if (u && (d = [u], s.styleUrl = void 0), d?.length) {
    let f = Promise.all(d.map(p => o(p))).then(p => { l.push(...p), s.styleUrls = void 0; });
    c.push(f);
} yield Promise.all(c), Di.delete(i); })); yield Promise.all(r); }); }
function qx(e, t) { iD(t) && (Yn.set(e, t), Di.add(e)); }
function Wx(e) { return Di.has(e); }
function iD(e) { return !!(e.templateUrl && !e.hasOwnProperty("template") || e.styleUrls?.length || e.styleUrl); }
function zx() { let e = Yn; return Yn = new Map, e; }
function Qx(e) { Di.clear(); for (let t of e.keys())
    Di.add(t); Yn = e; }
function sD() { return Yn.size === 0; }
function Zx(e, t) { return Ce(this, null, function* () { if (typeof t == "string")
    return t; if (t.status !== void 0 && t.status !== 200)
    throw new T(918, !1); return t.text(); }); }
var $d = new Map, aD = !0;
function Yx(e, t, n) { if (t && t !== n && aD)
    throw new T(921, !1); }
function Ap(e, t) { let n = $d.get(t) || null; Yx(t, n, e), $d.set(t, e); }
function Rp(e) { return $d.get(e); }
function Kx(e) { aD = !e; }
function cD(e) { return t => { t.controlDef = { create: (n, o) => { n?.\u0275ngControlCreate(o); }, update: (n, o) => { n?.\u0275ngControlUpdate?.(o); }, passThroughInput: e }; }; }
function lD(e) { let t = n => { let o = Array.isArray(e); n.hostDirectives === null ? (n.resolveHostDirectives = Jx, n.hostDirectives = o ? e.map(Gd) : [e]) : o ? n.hostDirectives.unshift(...e.map(Gd)) : n.hostDirectives.unshift(e); }; return t.ngInherit = !0, t; }
function Jx(e) { let t = [], n = !1, o = null, r = null; for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.hostDirectives !== null) {
        let a = t.length;
        o ??= new Map, r ??= new Map, uD(s, t, o, e), r.set(s, [a, t.length - 1]);
    }
    i === 0 && Ke(s) && (n = !0, t.push(s));
} for (let i = n ? 1 : 0; i < e.length; i++)
    t.push(e[i]); return o !== null && o.forEach((i, s) => { Xx(s.declaredInputs, i.inputs); }), [t, o, r]; }
function uD(e, t, n, o) { if (e.hostDirectives !== null)
    for (let r of e.hostDirectives)
        if (typeof r == "function") {
            let i = r();
            for (let s of i)
                Gm(Gd(s), t, n, o);
        }
        else
            Gm(r, t, n, o); }
function Gm(e, t, n, o) { let r = Pe(e.directive); if (uD(r, t, n, o), n.has(r)) {
    let i = n.get(r);
    qm(i, e.inputs, "input"), qm(i, e.outputs, "output");
}
else
    o.includes(r) || (n.set(r, e), t.push(r)); }
function qm(e, t, n) { let o = n === "input" ? e.inputs : e.outputs; Object.keys(t).forEach(r => { let i = t[r]; (!o.hasOwnProperty(r) || o[r] === i) && (o[r] = i); }); }
function Gd(e) { return typeof e == "function" ? { directive: j(e), inputs: {}, outputs: {} } : { directive: j(e.directive), inputs: Wm(e.inputs), outputs: Wm(e.outputs) }; }
function Wm(e) { let t = {}; if (e !== void 0 && e.length > 0)
    for (let n = 0; n < e.length; n += 2)
        t[e[n]] = e[n + 1]; return t; }
function Xx(e, t) { for (let n in t)
    if (t.hasOwnProperty(n)) {
        let o = t[n], r = e[n];
        e[o] = r;
    } }
function ek(e) { return Object.getPrototypeOf(e.prototype).constructor; }
function xp(e) { let t = ek(e.type), n = !0, o = [e]; for (; t && t !== Function.prototype && t !== Object.prototype;) {
    let r, i = Object.hasOwn(t, At) ? t[At] : void 0, s = Object.hasOwn(t, An) ? t[An] : void 0;
    if (Ke(e))
        r = i ?? s;
    else {
        if (i)
            throw new T(903, !1);
        r = s;
    }
    if (r) {
        if (n) {
            o.push(r);
            let c = e;
            c.inputs = Uu(e.inputs), c.declaredInputs = Uu(e.declaredInputs), c.outputs = Uu(e.outputs);
            let l = r.hostBindings;
            l && ik(e, l);
            let u = r.viewQuery, d = r.contentQueries;
            if (u && ok(e, u), d && rk(e, d), tk(e, r), Mg(e.outputs, r.outputs), Ke(r) && r.data.animation) {
                let f = e.data;
                f.animation = (f.animation || []).concat(r.data.animation);
            }
        }
        let a = r.features;
        if (a)
            for (let c = 0; c < a.length; c++) {
                let l = a[c];
                l && l.ngInherit && l(e), l === xp && (n = !1);
            }
    }
    t = Object.getPrototypeOf(t);
} nk(o); }
function tk(e, t) { for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n))
        continue;
    let o = t.inputs[n];
    o !== void 0 && (e.inputs[n] = o, e.declaredInputs[n] = t.declaredInputs[n]);
} }
function nk(e) { let t = 0, n = null; for (let o = e.length - 1; o >= 0; o--) {
    let r = e[o];
    r.hostVars = t += r.hostVars, r.hostAttrs = Ho(r.hostAttrs, n = Ho(n, r.hostAttrs));
} }
function Uu(e) { return e === Rt ? {} : e === V ? [] : e; }
function ok(e, t) { let n = e.viewQuery; n ? e.viewQuery = (o, r) => { t(o, r), n(o, r); } : e.viewQuery = t; }
function rk(e, t) { let n = e.contentQueries; n ? e.contentQueries = (o, r, i) => { t(o, r, i), n(o, r, i); } : e.contentQueries = t; }
function ik(e, t) { let n = e.hostBindings; n ? e.hostBindings = (o, r) => { t(o, r), n(o, r); } : e.hostBindings = t; }
function dD(e, t, n, o, r, i, s, a) { if (n.firstCreatePass) {
    e.mergedAttrs = Ho(e.mergedAttrs, e.attrs);
    let u = e.tView = yc(2, e, r, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
    n.queries !== null && (n.queries.template(n, e), u.queries = n.queries.embeddedTView(e));
} a && (e.flags |= a), st(e, !1); let c = fD(n, t, e, o); Gr() && mc(n, t, c, e), Be(c, t); let l = ap(c, t, c, e); t[o + I] = l, Ec(t, l), PI(l, e, t); }
function sk(e, t, n, o, r, i, s, a, c, l, u) { let d = n + I, f; return t.firstCreatePass ? (f = yn(t, d, 4, s || null, a || null), Ps() && bI(t, e, f, fe(t.consts, l), ip), Rv(t, f)) : f = t.data[d], dD(f, e, t, n, o, r, i, c), yo(f) && Dc(t, e, f), l != null && or(e, f, u), f; }
function Kn(e, t, n, o, r, i, s, a, c, l, u) { let d = n + I, f; if (t.firstCreatePass) {
    if (f = yn(t, d, 4, s || null, a || null), l != null) {
        let p = fe(t.consts, l);
        f.localNames = [];
        for (let h = 0; h < p.length; h += 2)
            f.localNames.push(p[h], -1);
    }
}
else
    f = t.data[d]; return dD(f, e, t, n, o, r, i, c), l != null && or(e, f, u), f; }
function kp(e, t, n, o, r, i, s, a) { let c = g(), l = _(), u = fe(l.consts, i); return sk(c, l, e, t, n, o, r, u, void 0, s, a), kp; }
function Op(e, t, n, o, r, i, s, a) { let c = g(), l = _(), u = fe(l.consts, i); return Kn(c, l, e, t, n, o, r, u, void 0, s, a), Op; }
var fD = pD;
function pD(e, t, n, o) { return at(!0), t[M].createComment(""); }
function ak(e, t, n, o) { let r = !ic(t, n); at(r); let i = t[he]?.data[Ya]?.[o] ?? null; if (i !== null && n.tView !== null && n.tView.ssrId === null && (n.tView.ssrId = i), r)
    return pD(e, t); let s = t[he], a = Qi(s, e, t, n); oc(s, o, a); let c = xf(s, o); return Rc(c, a); }
function hD() { fD = ak; }
var de = (function (e) { return e[e.NOT_STARTED = 0] = "NOT_STARTED", e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.COMPLETE = 2] = "COMPLETE", e[e.FAILED = 3] = "FAILED", e; })(de || {}), zm = 0, ck = 1, Z = (function (e) { return e[e.Placeholder = 0] = "Placeholder", e[e.Loading = 1] = "Loading", e[e.Complete = 2] = "Complete", e[e.Error = 3] = "Error", e; })(Z || {}), Ti = (function (e) { return e[e.Initial = -1] = "Initial", e; })(Ti || {}), Fo = 0, Wt = 1, Yr = 2, oa = 3, lk = 4, uk = 5, jc = 6, dk = 7, jo = 8, fk = 9, Lp = (function (e) { return e[e.Manual = 0] = "Manual", e[e.Playthrough = 1] = "Playthrough", e; })(Lp || {});
function Zi(e, t, n) { let o = mD(e); t[o] === null && (t[o] = []), t[o].push(n); }
function fa(e, t) { let n = mD(e), o = t[n]; if (o !== null) {
    for (let r of o)
        r();
    t[n] = null;
} }
function gD(e) { fa(1, e), fa(0, e), fa(2, e); }
function mD(e) { let t = lk; return e === 1 ? t = uk : e === 2 && (t = fk), t; }
function Yi(e) { return e + 1; }
function be(e, t) { let n = e[m], o = Yi(t.index); return e[o]; }
function pk(e, t, n) { let o = e[m], r = Yi(t); e[r] = n; }
function ge(e, t) { let n = Yi(t.index); return e.data[n]; }
function hk(e, t, n) { let o = Yi(t); e.data[o] = n; }
function gk(e, t, n) { let o = t[m], r = ge(o, n); switch (e) {
    case Z.Complete: return r.primaryTmplIndex;
    case Z.Loading: return r.loadingTmplIndex;
    case Z.Error: return r.errorTmplIndex;
    case Z.Placeholder: return r.placeholderTmplIndex;
    default: return null;
} }
function qd(e, t) { return t === Z.Placeholder ? e.placeholderBlockConfig?.[zm] ?? null : t === Z.Loading ? e.loadingBlockConfig?.[zm] ?? null : null; }
function vD(e) { return e.loadingBlockConfig?.[ck] ?? null; }
function Qm(e, t) { if (!e || e.length === 0)
    return t; let n = new Set(e); for (let o of t)
    n.add(o); return e.length === n.size ? e : Array.from(n); }
function mk(e, t) { let n = t.primaryTmplIndex + I; return ln(e, n); }
function yD(e) { return e !== null && typeof e == "object" && typeof e.primaryTmplIndex == "number"; }
function ED(e, t) { let n = null, o = Yi(t.index); return I < o && o < e.bindingStartIndex && (n = ge(e, t)), !!n && yD(n); }
var vk = (() => { class e {
    cachedInjectors = new Map;
    getOrCreateInjector(n, o, r, i) { if (!this.cachedInjectors.has(n)) {
        let s = r.length > 0 ? Mp(r, o, i) : null;
        this.cachedInjectors.set(n, s);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = J({ token: e, providedIn: "environment", factory: () => new e });
} return e; })();
function Vc(e) { return (t, n) => ID(e, t, n); }
function ID(e, t, n) { let o = n.get(DD), r = n.get(W), i = () => o.remove(t); return o.add(e, t, r), i; }
var DD = (() => { class e {
    executingCallbacks = !1;
    timeoutId = null;
    invokeTimerAt = null;
    current = [];
    deferred = [];
    add(n, o, r) { let i = this.executingCallbacks ? this.deferred : this.current; this.addToQueue(i, Date.now() + n, o), this.scheduleTimer(r); }
    remove(n) { let { current: o, deferred: r } = this; this.removeFromQueue(o, n) === -1 && this.removeFromQueue(r, n), o.length === 0 && r.length === 0 && this.clearTimeout(); }
    addToQueue(n, o, r) { let i = n.length; for (let s = 0; s < n.length; s += 2)
        if (n[s] > o) {
            i = s;
            break;
        } $l(n, i, o, r); }
    removeFromQueue(n, o) { let r = -1; for (let i = 0; i < n.length; i += 2)
        if (n[i + 1] === o) {
            r = i;
            break;
        } return r > -1 && Ul(n, r, 2), r; }
    scheduleTimer(n) { let o = () => { this.clearTimeout(), this.executingCallbacks = !0; let i = [...this.current], s = Date.now(); for (let c = 0; c < i.length; c += 2) {
        let l = i[c], u = i[c + 1];
        if (l <= s)
            u();
        else
            break;
    } let a = -1; for (let c = 0; c < this.current.length && this.current[c] <= s; c += 2)
        a = c + 1; if (a >= 0 && Ul(this.current, 0, a + 1), this.executingCallbacks = !1, this.deferred.length > 0) {
        for (let c = 0; c < this.deferred.length; c += 2) {
            let l = this.deferred[c], u = this.deferred[c + 1];
            this.addToQueue(this.current, l, u);
        }
        this.deferred.length = 0;
    } this.scheduleTimer(n); }; if (this.current.length > 0) {
        let i = Date.now(), s = this.current[0];
        if (this.timeoutId === null || this.invokeTimerAt && this.invokeTimerAt - s > 16) {
            this.clearTimeout();
            let a = Math.max(s - i, 16);
            this.invokeTimerAt = s, this.timeoutId = n.runOutsideAngular(() => setTimeout(() => n.run(o), a));
        }
    } }
    clearTimeout() { this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null); }
    ngOnDestroy() { this.clearTimeout(), this.current.length = 0, this.deferred.length = 0; }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), yk = new C("DEFER_BLOCK_DEPENDENCY_INTERCEPTOR"), TD = new C("");
function $u(e, t, n) { return e.get(vk).getOrCreateInjector(t, e, n, ""); }
function Ek(e, t, n) { if (e instanceof pn) {
    let r = e.injector, i = e.parentInjector, s = $u(i, t, n);
    return new pn(r, s);
} let o = e.get(xe); if (o !== e) {
    let r = $u(o, t, n);
    return new pn(e, r);
} return $u(e, t, n); }
function Pt(e, t, n, o = !1) { let r = n[z], i = r[m]; if (Je(r))
    return; let s = be(r, t), a = s[Wt], c = s[dk]; if (!(c !== null && e < c) && Ym(a, e) && Ym(s[Fo] ?? -1, e)) {
    let l = ge(i, t), d = !o && (typeof ngServerMode > "u" || !ngServerMode) && (vD(l) !== null || qd(l, Z.Loading) !== null || qd(l, Z.Placeholder)) ? Wd : CD;
    try {
        d(e, s, n, t, r);
    }
    catch (f) {
        sp(r, f);
    }
} }
function Ik(e, t) { let n = e[He]?.findIndex(r => r.data[Pi] === t[Wt]) ?? -1; return { dehydratedView: n > -1 ? e[He][n] : null, dehydratedViewIx: n }; }
function CD(e, t, n, o, r) { U(P.DeferBlockStateStart); let i = gk(e, r, o); if (i !== null) {
    t[Wt] = e;
    let s = r[m], a = i + I, c = ln(s, a), l = 0;
    zi(n, l);
    let u;
    if (e === Z.Complete) {
        let h = ge(s, o), v = h.providers;
        v && v.length > 0 && (u = Ek(r[O], h, v));
    }
    let { dehydratedView: d, dehydratedViewIx: f } = Ik(n, t), p = vn(r, c, null, { injector: u, dehydratedView: d });
    if (qt(n, p, l, Wn(c, d)), Br(p), f > -1 && n[He]?.splice(f, 1), (e === Z.Complete || e === Z.Error) && Array.isArray(t[jo])) {
        for (let h of t[jo])
            h();
        t[jo] = null;
    }
} U(P.DeferBlockStateEnd); }
function Dk(e, t, n, o, r) { let i = Date.now(), s = r[m], a = ge(s, o); if (t[Yr] === null || t[Yr] <= i) {
    t[Yr] = null;
    let c = vD(a), l = t[oa] !== null;
    if (e === Z.Loading && c !== null && !l) {
        t[Fo] = e;
        let u = Zm(c, t, o, n, r);
        t[oa] = u;
    }
    else {
        e > Z.Loading && l && (t[oa](), t[oa] = null, t[Fo] = null), CD(e, t, n, o, r);
        let u = qd(a, e);
        u !== null && (t[Yr] = i + u, Zm(u, t, o, n, r));
    }
}
else
    t[Fo] = e; }
function Zm(e, t, n, o, r) { return ID(e, () => { let s = t[Fo]; t[Yr] = null, t[Fo] = null, s !== null && Pt(s, n, o); }, r[O]); }
function Ym(e, t) { return e < t; }
function ar(e, t) { let n = e[t.index]; Pt(Z.Placeholder, t, n); }
function Km(e, t, n) { e.loadingPromise.then(() => { e.loadingState === de.COMPLETE ? Pt(Z.Complete, t, n) : e.loadingState === de.FAILED && Pt(Z.Error, t, n); }); }
var Wd = null;
function wD(e, t, n, o) { let r = e.consts; n != null && (t.placeholderBlockConfig = fe(r, n)), o != null && (t.loadingBlockConfig = fe(r, o)), Wd === null && (Wd = Dk); }
function Pp(e, t) { return !(e === 0 && typeof ngServerMode < "u" && ngServerMode || t[O].get(TD, null, { optional: !0 })?.behavior === Lp.Manual); }
function Fp(e, t, n, o) { let r = n.get(W); return b_(e, () => r.run(t), i => r.runOutsideAngular(() => __(i)), o); }
function Tk(e, t, n) { return n == null ? e : n >= 0 ? eu(n, e) : e[t.index][L] ?? null; }
function Ck(e, t) { return Ln(I + t, e); }
function cr(e, t, n, o, r, i, s, a) { if (!Pp(s, e))
    return; let c = e[O], l = c.get(W), u; function d() { if (Je(e)) {
    u.destroy();
    return;
} let f = be(e, t), p = f[Wt]; if (p !== Ti.Initial && p !== Z.Placeholder) {
    u.destroy();
    return;
} let h = Tk(e, t, o); if (!h || (u.destroy(), Je(h)))
    return; let v = Ck(h, n), y = r(v, () => { l.run(() => { e !== h && Ls(h, y), i(); }); }, c, a); e !== h && Io(h, y), Zi(s, f, y); } u = hE({ read: d }, { injector: c }); }
var wk = (() => { class e {
    log(n) { console.log(n); }
    warn(n) { console.warn(n); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = J({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })(), zd = class {
    resolverToTokenToDependencies = new WeakMap;
    resolverToProviders = new WeakMap;
    resolverToEffects = new WeakMap;
    standaloneInjectorToComponent = new WeakMap;
    reset() { this.resolverToTokenToDependencies = new WeakMap, this.resolverToProviders = new WeakMap, this.standaloneInjectorToComponent = new WeakMap; }
}, Mk = new zd;
function Hc() { return Mk; }
var MD = (function (e) { return e[e.Defer = 0] = "Defer", e[e.For = 1] = "For", e; })(MD || {});
function Nk(e) { let { standaloneInjectorToComponent: t } = Hc(); if (t.has(e))
    return t.get(e); let n = e.get(Zn, null, { self: !0, optional: !0 }); return n === null || n.instance === null ? null : n.instance.constructor; }
function Sk(e) { let t = bi(e), { resolverToProviders: n } = Hc(), o = n.get(t) ?? [], r = Array.from(Xg()).map(i => ({ token: i, isViewProvider: !1, provider: i })); return [...o, ...r]; }
function _k(e) { let t = new Map, o = bk(t, new Set); return mr(e, o, [], new Set), t; }
function bk(e, t) { return (n, o) => { if (e.has(n) || e.set(n, [o]), !t.has(o))
    for (let r of e.keys()) {
        let i = e.get(r), s = hr(o);
        if (!s) {
            let l = o.ngModule;
            s = hr(l);
        }
        if (!s)
            return;
        let a = i[0], c = !1;
        br(s.imports, l => { c || (c = l.ngModule === a || l === a, c && e.get(r)?.unshift(o)); });
    } t.add(o); }; }
function Ak(e) { let t = Hc().resolverToProviders.get(e) ?? []; if (Rk(e))
    return t; let n = Nk(e); if (n === null)
    return t; let o = _k(n), r = []; for (let i of t) {
    let s = i.provider, a = s.provide;
    if (a === Qe || a === bs)
        continue;
    let c = o.get(s) ?? [];
    Q(n)?.standalone && (c = [n, ...c]), r.push(ne(F({}, i), { importPath: c }));
} return r; }
function Rk(e) { return e instanceof nt && e.scopes.has("platform"); }
function ND(e) { if (e instanceof Se)
    return Sk(e); if (e instanceof xe)
    return Ak(e); nn("getInjectorProviders only supports NodeInjector and EnvironmentInjector"); }
function SD(e) { if (e instanceof Se) {
    let t = pf(e), n = bi(e);
    return Lg(n, t), { type: "element", source: oe(n, t) };
} return e instanceof nt ? { type: "environment", source: e.source ?? null } : e instanceof _t ? { type: "null", source: null } : null; }
function xk(e) { return e.kind === "computed"; }
function kk(e) { return e.kind === "template"; }
function Ok(e) { return e.kind === "signal"; }
function Lk(e) { let t = bi(e); Jl(t); let n = pf(e); Pg(n); let o = n[t.index]; return ee(o) ? o[ke] ?? null : null; }
var Jm = new WeakMap, Xm = 0;
function Pk(e) { let t = Array.from(e.keys()), n = [], o = []; for (let [r, i] of e.entries()) {
    let s = t.indexOf(r), a = Jm.get(r);
    a || (Xm++, a = Xm.toString(), Jm.set(r, a)), xk(r) ? n.push({ label: r.debugName, value: r.value, kind: r.kind, epoch: r.version, debuggableFn: r.computation, id: a }) : Ok(r) ? n.push({ label: r.debugName, value: r.value, kind: r.kind, epoch: r.version, id: a }) : kk(r) ? n.push({ label: r.debugName ?? r.lView?.[$]?.tagName?.toLowerCase?.(), kind: r.kind, epoch: r.version, debuggableFn: r.lView?.[H]?.constructor, id: a }) : n.push({ label: r.debugName, kind: r.kind, epoch: r.version, id: a });
    for (let c of i)
        o.push({ consumer: s, producer: t.indexOf(c) });
} return { nodes: n, edges: o }; }
function Fk(e) { let t = e; return e instanceof Se && (t = pf(e)), (Hc().resolverToEffects.get(t) ?? []).map(r => r instanceof Ir ? r[K] : r.signal[K]); }
function _D(e, t = new Map) { for (let n of e) {
    if (t.has(n))
        continue;
    let o = [];
    for (let r = n.producers; r !== void 0; r = r.nextProducer) {
        let i = r.producer;
        o.push(i);
    }
    t.set(n, o), _D(o, t);
} return t; }
function bD(e) { let t = null; if (!(e instanceof Se) && !(e instanceof nt))
    return nn("getSignalGraph must be called with a NodeInjector or R3Injector"); e instanceof Se && (t = Lk(e)); let n = Fk(e), o = t ? [t, ...n] : n, r = _D(o); return Pk(r); }
var jk = new WeakMap;
function Vk(e) { return jk.get(e); }
function Hk() { return re("Chrome DevTools profiling"), () => { }; }
function Bk(e) { let t = e.get(xt), n = e.get(It), o = bu(t, n), r = {}; for (let [i, s] of Object.entries(o))
    O_(i) || (r[i] = s); return r; }
var ev = "ng";
function Uk(e, t) { $k(e, t); }
function $k(e, t) { if (typeof COMPILED > "u" || !COMPILED) {
    let n = Fe;
    n[ev] ??= {}, n[ev][e] = t;
} }
var AD = new C(""), RD = new C(""), xD = new C("USE_PENDING_TASKS", { providedIn: "root", factory: () => typeof Zone > "u" }), Gk = (() => { class e {
    _ngZone;
    registry;
    _isZoneStable = !0;
    _callbacks = [];
    _taskTrackingZone = null;
    _destroyRef;
    pendingTasksInternal = E(yt);
    _usePendingTasks = E(xD);
    constructor(n, o, r) { this._ngZone = n, this.registry = o, Rs() && (this._destroyRef = E(De, { optional: !0 }) ?? void 0), jp || (OD(r), r.addToWindow(o)), this._watchAngularEvents(), n.run(() => { this._taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone"); }); }
    _watchAngularEvents() { let n = this._ngZone.onUnstable.subscribe({ next: () => { this._isZoneStable = !1; } }), o, r; this._ngZone.runOutsideAngular(() => { this._usePendingTasks && (o = this.pendingTasksInternal.hasPendingTasksObservable.subscribe(() => { this.isStable() && this._ngZone.runOutsideAngular(() => { this._runCallbacksIfReady(); }); })), r = this._ngZone.onStable.subscribe({ next: () => { W.assertNotInAngularZone(), queueMicrotask(() => { this._isZoneStable = !0, this._runCallbacksIfReady(); }); } }); }), this._destroyRef?.onDestroy(() => { n.unsubscribe(), o?.unsubscribe(), r.unsubscribe(); }); }
    isStable() { return this._isZoneStable && !this._ngZone.hasPendingMacrotasks && (!this._usePendingTasks || !this.pendingTasksInternal.hasPendingTasks); }
    _runCallbacksIfReady() { if (this.isStable())
        queueMicrotask(() => { for (; this._callbacks.length !== 0;) {
            let n = this._callbacks.pop();
            clearTimeout(n.timeoutId), n.doneCb();
        } });
    else {
        let n = this.getPendingTasks();
        this._callbacks = this._callbacks.filter(o => o.updateCb && o.updateCb(n) ? (clearTimeout(o.timeoutId), !1) : !0);
    } }
    getPendingTasks() { return this._taskTrackingZone ? this._taskTrackingZone.macroTasks.map(n => ({ source: n.source, creationLocation: n.creationLocation, data: n.data })) : []; }
    addCallback(n, o, r) { let i = -1; o && o > 0 && (i = setTimeout(() => { this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n(); }, o)), this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: r }); }
    whenStable(n, o, r) { if (r && !this._taskTrackingZone)
        throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'); this.addCallback(n, o, r), this._runCallbacksIfReady(); }
    registerApplication(n) { this.registry.registerApplication(n, this); }
    unregisterApplication(n) { this.registry.unregisterApplication(n); }
    findProviders(n, o, r) { return []; }
    static \u0275fac = function (o) { return new (o || e)(me(W), me(kD), me(RD)); };
    static \u0275prov = J({ token: e, factory: e.\u0275fac });
} return e; })(), kD = (() => { class e {
    _applications = new Map;
    registerApplication(n, o) { this._applications.set(n, o); }
    unregisterApplication(n) { this._applications.delete(n); }
    unregisterAllApplications() { this._applications.clear(); }
    getTestability(n) { return this._applications.get(n) || null; }
    getAllTestabilities() { return Array.from(this._applications.values()); }
    getAllRootElements() { return Array.from(this._applications.keys()); }
    findTestabilityInTree(n, o = !0) { return jp?.findTestabilityInTree(this, n, o) ?? null; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = J({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function OD(e) { jp = e; }
var jp, Ki = new C("");
function Vp() { gg(() => { let e = ""; throw new T(600, e); }); }
var qk = 10;
function Hp(e, t) { return Array.isArray(t) ? t.reduce(Hp, e) : F(F({}, e), t); }
var Ue = (() => { class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = E(kt);
    afterRenderManager = E(fc);
    zonelessEnabled = E(Mo);
    rootEffectScheduler = E(qs);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set;
    autoDetectTestViews = new Set;
    includeAllTestViews = !1;
    afterTick = new Nv;
    get allViews() { return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]; }
    get destroyed() { return this._destroyed; }
    componentTypes = [];
    components = [];
    internalPendingTask = E(yt);
    get isStable() { return this.internalPendingTask.hasPendingTasksObservable.pipe(mS(n => !n)); }
    constructor() { E(oo, { optional: !0 }); }
    whenStable() { let n; return new Promise(o => { n = this.isStable.subscribe({ next: r => { r && o(); } }); }).finally(() => { n.unsubscribe(); }); }
    _injector = E(xe);
    _rendererFactory = null;
    get injector() { return this._injector; }
    bootstrap(n, o) { return this.bootstrapImpl(n, o); }
    bootstrapImpl(n, o, r = se.NULL) { return this._injector.get(W).run(() => { if (U(P.BootstrapComponentStart), !this._injector.get(bp).done) {
        let D = "";
        throw new T(405, D);
    } let a = Q(n), c = this._injector.get(Zn), l = new Qn(a, c); this.componentTypes.push(n); let { hostElement: u, directives: d, bindings: f } = Wk(o), p = u || l.selector, h = l.create(r, [], p, c.injector, d, f), v = h.location.nativeElement, y = h.injector.get(AD, null); return y?.registerApplication(v), h.onDestroy(() => { this.detachView(h.hostView), ei(this.components, h), y?.unregisterApplication(v); }), this._loadComponent(h), U(P.BootstrapComponentEnd, h), h; }); }
    tick() { this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick(); }
    _tick() { U(P.ChangeDetectionStart), this.tracingSnapshot !== null ? this.tracingSnapshot.run(dc.CHANGE_DETECTION, this.tickImpl) : this.tickImpl(); }
    tickImpl = () => { if (this._runningTick)
        throw U(P.ChangeDetectionEnd), new T(101, !1); let n = R(null); try {
        this._runningTick = !0, this.synchronize();
    }
    finally {
        this._runningTick = !1, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, R(n), this.afterTick.next(), U(P.ChangeDetectionEnd);
    } };
    synchronize() { this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(yi, null, { optional: !0 })); let n = 0; for (; this.dirtyFlags !== 0 && n++ < qk;) {
        U(P.ChangeDetectionSyncStart);
        try {
            this.synchronizeOnce();
        }
        finally {
            U(P.ChangeDetectionSyncEnd);
        }
    } }
    synchronizeOnce() { this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()); let n = !1; if (this.dirtyFlags & 7) {
        let o = !!(this.dirtyFlags & 1);
        this.dirtyFlags &= -8, this.dirtyFlags |= 8;
        for (let { _lView: r } of this.allViews) {
            if (!o && !Eo(r))
                continue;
            let i = o && !this.zonelessEnabled ? 0 : 1;
            VE(r, i), n = !0;
        }
        if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)
            return;
    } n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()), this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews(); }
    syncDirtyFlagsWithViews() { if (this.allViews.some(({ _lView: n }) => Eo(n))) {
        this.dirtyFlags |= 2;
        return;
    }
    else
        this.dirtyFlags &= -8; }
    attachView(n) { let o = n; this._views.push(o), o.attachToAppRef(this); }
    detachView(n) { let o = n; ei(this._views, o), o.detachFromAppRef(); }
    _loadComponent(n) { this.attachView(n.hostView); try {
        this.tick();
    }
    catch (r) {
        this.internalErrorHandler(r);
    } this.components.push(n), this._injector.get(Ki, []).forEach(r => r(n)); }
    ngOnDestroy() { if (!this._destroyed)
        try {
            this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy());
        }
        finally {
            this._destroyed = !0, this._views = [], this._destroyListeners = [];
        } }
    onDestroy(n) { return this._destroyListeners.push(n), () => ei(this._destroyListeners, n); }
    destroy() { if (this._destroyed)
        throw new T(406, !1); let n = this._injector; n.destroy && !n.destroyed && n.destroy(); }
    get viewCount() { return this._views.length; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })();
function Wk(e) { return e === void 0 || typeof e == "string" || e instanceof Element ? { hostElement: e } : e; }
function ei(e, t) { let n = e.indexOf(t); n > -1 && e.splice(n, 1); }
function LD(e, t, n) { let o = t.get(zk), r = () => o.remove(e); return o.add(e, n), r; }
function Bp(e) { return (t, n) => LD(t, n, e); }
var zk = (() => { class e {
    buckets = new Map;
    callbackBucket = new Map;
    applicationRef = E(Ue);
    ngZone = E(W);
    idleService = E(za);
    add(n, o) { let r = tv(o); this.callbackBucket.set(n, r); let i = this.buckets.get(r); i == null && (i = { idleId: null, queue: new Set }, this.buckets.set(r, i)), i.queue.add(n), this.scheduleBucket(i, o); }
    remove(n) { let o = this.callbackBucket.get(n); if (o === void 0)
        return; this.callbackBucket.delete(n); let r = this.buckets.get(o); r && (r.queue.delete(n), r.queue.size === 0 && (this.cancelBucket(r), this.buckets.delete(o))); }
    scheduleBucket(n, o) { if (n.idleId !== null)
        return; let r = tv(o), i = s => { this.cancelBucket(n); for (let a of n.queue)
        if (a(), this.applicationRef._tick(), n.queue.delete(a), this.callbackBucket.delete(a), s && s.timeRemaining() === 0 && !s.didTimeout)
            break; n.queue.size > 0 ? this.scheduleBucket(n, o) : this.buckets.delete(r); }; n.idleId = this.idleService.requestOnIdle(s => this.ngZone.run(() => i(s)), o); }
    cancelBucket(n) { n.idleId !== null && (this.idleService.cancelOnIdle(n.idleId), n.idleId = null); }
    ngOnDestroy() { for (let n of this.buckets.values())
        this.cancelBucket(n); this.buckets.clear(), this.callbackBucket.clear(); }
    static \u0275prov = J({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
function tv(e) { return !e || e.timeout == null ? "" : `${e.timeout}`; }
function PD(e) { let t = g(), n = S(); if (ar(t, n), !Pp(0, t))
    return; let o = t[O], r = be(t, n), i = e(() => Ae(0, t, n), o); Zi(0, r, i); }
function FD(e) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let t = g(), n = t[O], o = S(), r = t[m], i = ge(r, o); if (i.loadingState === de.NOT_STARTED) {
    let s = be(t, o), c = e(() => Ji(i, t, o), n);
    Zi(1, s, c);
} }
function jD(e, t, n) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let o = t[O], r = be(t, n), i = r[jc], s = e(() => zt(o, i), o); Zi(2, r, s); }
function Ji(e, t, n) { Bc(e, t, n); }
function Bc(e, t, n) { let o = t[O], r = t[m]; if (e.loadingState !== de.NOT_STARTED)
    return e.loadingPromise ?? Promise.resolve(); let i = be(t, n), s = mk(r, e); e.loadingState = de.IN_PROGRESS, fa(1, i); let a = e.dependencyResolverFn, c = o.get(qr).add(); return a ? (e.loadingPromise = Promise.allSettled(a()).then(l => { let u = !1, d = null, f = [], p = []; for (let h = 0; h < l.length; h++) {
    let v = l[h];
    if (v.status === "fulfilled") {
        let y = v.value, D = Q(y) || Pe(y);
        if (D)
            f.push(D);
        else {
            let k = ot(y);
            k && p.push(k);
        }
    }
    else {
        u = !0, d = v.reason instanceof Error ? v.reason : new Error(String(v.reason));
        break;
    }
} if (u) {
    if (e.loadingState = de.FAILED, e.errorTmplIndex === null) {
        let v = "", y = new T(-750, v);
        sp(t, y);
    }
}
else {
    e.loadingState = de.COMPLETE;
    let h = s.tView;
    if (f.length > 0) {
        h.directiveRegistry = Qm(h.directiveRegistry, f);
        let v = f.map(D => D.type), y = As(!1, ...v);
        e.providers = y;
    }
    p.length > 0 && (h.pipeRegistry = Qm(h.pipeRegistry, p));
} }), e.loadingPromise.finally(() => { e.loadingPromise = null, c(); })) : (e.loadingPromise = Promise.resolve().then(() => { e.loadingPromise = null, e.loadingState = de.COMPLETE, c(); }), e.loadingPromise); }
function Ae(e, t, n) { let o = t[m], r = t[n.index]; if (!Pp(e, t))
    return; let i = be(t, n), s = ge(o, n); switch (gD(i), s.loadingState) {
    case de.NOT_STARTED:
        Pt(Z.Loading, n, r), Bc(s, t, n), s.loadingState === de.IN_PROGRESS && Km(s, n, r);
        break;
    case de.IN_PROGRESS:
        Pt(Z.Loading, n, r), Km(s, n, r);
        break;
    case de.COMPLETE:
        Pt(Z.Complete, n, r);
        break;
    case de.FAILED:
        Pt(Z.Error, n, r);
        break;
    default:
} }
function zt(e, t, n) { return Ce(this, null, function* () { let o = e.get($t); if (o.hydrating.has(t))
    return; let { parentBlockPromise: i, hydrationQueue: s } = $_(t, e); if (s.length === 0)
    return; i !== null && s.shift(), Yk(o, s), i !== null && (yield i); let a = s[0]; o.has(a) ? yield nv(e, s, n) : o.awaitParentBlock(a, () => Ce(null, null, function* () { return yield nv(e, s, n); })); }); }
function nv(e, t, n) { return Ce(this, null, function* () { let o = e.get($t), r = o.hydrating, i = e.get(yt), s = i.add(); for (let c = 0; c < t.length; c++) {
    let l = t[c], u = o.get(l);
    if (u != null) {
        if (yield Jk(u), yield Kk(e), Qk(u)) {
            BR(u), ov(t.slice(c), o);
            break;
        }
        r.get(l).resolve();
    }
    else {
        Zk(c, t, o), ov(t.slice(c), o);
        break;
    }
} let a = t[t.length - 1]; yield r.get(a)?.promise, i.remove(s), n && n(t), UR(o.get(a), t, o, e.get(Ue)); }); }
function Qk(e) { return be(e.lView, e.tNode)[Wt] === Z.Error; }
function Zk(e, t, n) { let o = e - 1, r = o > -1 ? n.get(t[o]) : null; r && Oc(r.lContainer); }
function ov(e, t) { let n = t.hydrating; for (let o in e)
    n.get(o)?.reject(); t.cleanup(e); }
function Yk(e, t) { for (let n of t)
    e.hydrating.set(n, To()); }
function Kk(e) { return new Promise(t => Kf(t, { injector: e })); }
function Jk(e) { return Ce(this, null, function* () { let { tNode: t, lView: n } = e, o = be(n, t); return new Promise(r => { Xk(o, r), Ae(2, n, t); }); }); }
function Xk(e, t) { Array.isArray(e[jo]) || (e[jo] = []), e[jo].push(t); }
function ie(e, t, n) { return e === 0 ? rv(t, n) : e === 2 ? !rv(t, n) : !(typeof ngServerMode < "u" && ngServerMode); }
function eO(e) { return e != null && (e & 1) === 1; }
function rv(e, t) { let n = e[O], o = ge(e[m], t), r = Vi(n), i = eO(o.flags); if (typeof ngServerMode < "u" && ngServerMode)
    return !r || !i; let a = be(e, t)[jc] !== null; return !(i && a && r); }
function En(e, t) { let n = ge(e, t); return n.hydrateTriggers ??= new Map; }
function tO(e, t, n) { let o = [], r = [], i = [], s = []; for (let [a, c] of t) {
    let l = n.get(a);
    if (l !== void 0) {
        let u = c.data[jt], d = l;
        for (let f = 0; f < u; f++) {
            if (d = d.previousSibling, d.nodeType !== Node.ELEMENT_NODE)
                continue;
            let p = { el: d, blockName: a };
            c.hydrate.idle && o.push(p), c.hydrate.immediate && s.push(p), c.hydrate.timer !== null && (p.delay = c.hydrate.timer, r.push(p)), c.hydrate.viewport && (typeof c.hydrate.viewport != "boolean" && (p.intersectionObserverOptions = c.hydrate.viewport), i.push(p));
        }
    }
} nO(e, o), iO(e, s), oO(e, i), rO(e, r); }
function nO(e, t) { for (let n of t) {
    let o = e.get($t), i = LD(() => zt(e, n.blockName), e);
    o.addCleanupFn(n.blockName, i);
} }
function oO(e, t) { if (t.length > 0) {
    let n = e.get($t);
    for (let o of t) {
        let r = Fp(o.el, () => zt(e, o.blockName), e, o.intersectionObserverOptions);
        n.addCleanupFn(o.blockName, r);
    }
} }
function rO(e, t) { for (let n of t) {
    let o = e.get($t), r = () => zt(e, n.blockName), s = Vc(n.delay)(r, e);
    o.addCleanupFn(n.blockName, s);
} }
function iO(e, t) { for (let n of t)
    zt(e, n.blockName); }
function VD(e, t, n, o, r, i, s, a, c, l) { let u = g(), d = _(), f = e + I, p = Kn(u, d, e, null, 0, 0), h = u[O], v = Vi(h); if (d.firstCreatePass) {
    re("NgDefer");
    let wt = { primaryTmplIndex: t, loadingTmplIndex: o ?? null, placeholderTmplIndex: r ?? null, errorTmplIndex: i ?? null, placeholderBlockConfig: null, loadingBlockConfig: null, dependencyResolverFn: n ?? null, loadingState: de.NOT_STARTED, loadingPromise: null, providers: null, hydrateTriggers: null, debug: null, flags: l ?? 0 };
    c?.(d, wt, a, s), hk(d, f, wt);
} let y = u[f]; PI(y, p, u); let D = null, k = null; if (y[He]?.length > 0) {
    let wt = y[He][0].data;
    k = wt[Xa] ?? null, D = wt[Pi];
} let ue = [null, Ti.Initial, null, null, null, null, k, D, null, null]; pk(u, f, ue); let tt = null; k !== null && v && (tt = h.get($t), tt.add(k, { lView: u, tNode: p, lContainer: y })); let $e = () => { gD(ue), k !== null && tt?.cleanup([k]); }; Zi(0, ue, () => Ls(u, $e)), Io(u, $e); }
function HD(e) { let t = g(), n = Oe(); if (!ie(0, t, n))
    return; let o = Te(); if (Y(t, o, e)) {
    let r = R(null);
    try {
        let i = !!e, a = be(t, n)[Wt];
        i === !1 && a === Ti.Initial ? ar(t, n) : i === !0 && (a === Ti.Initial || a === Z.Placeholder) && Ae(0, t, n);
    }
    finally {
        R(r);
    }
} }
function BD(e) { let t = g(), n = Oe(); if (!ie(1, t, n))
    return; let o = Te(); if (Y(t, o, e)) {
    let r = R(null);
    try {
        let i = !!e, s = t[m], a = ge(s, n);
        i === !0 && a.loadingState === de.NOT_STARTED && Ji(a, t, n);
    }
    finally {
        R(r);
    }
} }
function UD(e) { let t = g(), n = Oe(); if (!ie(2, t, n))
    return; let o = Te(), r = _(); if (En(r, n).set(6, null), Y(t, o, e))
    if (typeof ngServerMode < "u" && ngServerMode)
        Ae(2, t, n);
    else {
        let s = t[O], a = R(null);
        try {
            if (!!e === !0) {
                let u = be(t, n)[jc];
                zt(s, u);
            }
        }
        finally {
            R(a);
        }
    } }
function $D() { let e = g(), t = S(); if (!ie(2, e, t))
    return; En(_(), t).set(7, null), typeof ngServerMode < "u" && ngServerMode && Ae(2, e, t); }
function GD(e) { let t = g(), n = S(); ie(0, t, n) && PD(Bp({ timeout: e })); }
function qD(e) { let t = g(), n = S(); ie(1, t, n) && FD(Bp({ timeout: e })); }
function WD(e) { let t = g(), n = S(); if (!ie(2, t, n))
    return; En(_(), n).set(0, null), typeof ngServerMode < "u" && ngServerMode ? Ae(2, t, n) : jD(Bp({ timeout: e }), t, n); }
function zD() { let e = g(), t = S(); if (!ie(0, e, t))
    return; ge(e[m], t).loadingTmplIndex === null && ar(e, t), Ae(0, e, t); }
function QD() { let e = g(), t = S(); if (!ie(1, e, t))
    return; let n = e[m], o = ge(n, t); o.loadingState === de.NOT_STARTED && Bc(o, e, t); }
function ZD() { let e = g(), t = S(); if (!ie(2, e, t))
    return; if (En(_(), t).set(1, null), typeof ngServerMode < "u" && ngServerMode)
    Ae(2, e, t);
else {
    let o = e[O], i = be(e, t)[jc];
    zt(o, i);
} }
function YD(e) { let t = g(), n = S(); ie(0, t, n) && PD(Vc(e)); }
function KD(e) { let t = g(), n = S(); ie(1, t, n) && FD(Vc(e)); }
function JD(e) { let t = g(), n = S(); if (!ie(2, t, n))
    return; En(_(), n).set(5, { type: 5, delay: e }), typeof ngServerMode < "u" && ngServerMode ? Ae(2, t, n) : jD(Vc(e), t, n); }
function XD(e, t) { let n = g(), o = S(); ie(0, n, o) && (ar(n, o), typeof ngServerMode < "u" && ngServerMode || cr(n, o, e, t, gy, () => Ae(0, n, o), 0)); }
function eT(e, t) { let n = g(), o = S(); if (!ie(1, n, o))
    return; let r = n[m], i = ge(r, o); i.loadingState === de.NOT_STARTED && cr(n, o, e, t, gy, () => Ji(i, n, o), 1); }
function tT() { let e = g(), t = S(); if (!ie(2, e, t))
    return; En(_(), t).set(4, null), typeof ngServerMode < "u" && ngServerMode && Ae(2, e, t); }
function nT(e, t) { let n = g(), o = S(); ie(0, n, o) && (ar(n, o), typeof ngServerMode < "u" && ngServerMode || cr(n, o, e, t, hy, () => Ae(0, n, o), 0)); }
function oT(e, t) { let n = g(), o = S(); if (!ie(1, n, o))
    return; let r = n[m], i = ge(r, o); i.loadingState === de.NOT_STARTED && cr(n, o, e, t, hy, () => Ji(i, n, o), 1); }
function rT() { let e = g(), t = S(); if (!ie(2, e, t))
    return; En(_(), t).set(3, null), typeof ngServerMode < "u" && ngServerMode && Ae(2, e, t); }
function iT(e, t, n) { let o = g(), r = S(); ie(0, o, r) && (ar(o, r), typeof ngServerMode < "u" && ngServerMode || cr(o, r, e, t, Fp, () => Ae(0, o, r), 0, n)); }
function sT(e, t, n) { let o = g(), r = S(); if (!ie(1, o, r))
    return; let i = o[m], s = ge(i, r); s.loadingState === de.NOT_STARTED && cr(o, r, e, t, Fp, () => Ji(s, o, r), 1, n); }
function aT(e) { let t = g(), n = S(); if (!ie(2, t, n))
    return; En(_(), n).set(2, e ? { type: 2, intersectionObserverOptions: e } : null), typeof ngServerMode < "u" && ngServerMode && Ae(2, t, n); }
function Up(e, t) { let n = g(), o = Te(); if (Y(n, o, t)) {
    let r = _(), i = Oe();
    if (Mc(i, r, n, e, t))
        Ne(i) && xE(n, i.index);
    else {
        let a = oe(i, n);
        Tc(n[M], a, null, i.value, e, t, null);
    }
} return Up; }
function $p(e, t, n, o) { let r = g(), i = Te(); if (Y(r, i, t)) {
    let s = _(), a = Oe();
    kA(a, r, e, t, n, o);
} return $p; }
function ti(e) { if (re("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !no)
    return ti; let t = g(); if (lc(t))
    return ti; let n = S(), o = t[O].get(W); return uc(_a(t), n, () => sO(t, n, e, o)), hc(t[O]), Jf(t[O], _a(t)), ti; }
function sO(e, t, n, o) { let r = oe(t, e), i = e[M], s = uE(n), a = [], c = !1, l = d => { if (fi(d) !== r)
    return; let f = d instanceof AnimationEvent ? "animationend" : "transitionend"; o.runOutsideAngular(() => { i.listen(r, f, u); }); }, u = d => { fi(d) === r && (Qf(d, r) && (c = !0), aO(d, r, i)); }; if (s && s.length > 0) {
    o.runOutsideAngular(() => { a.push(i.listen(r, "animationstart", l)), a.push(i.listen(r, "transitionstart", l)); }), Xb(r, s, a);
    for (let d of s)
        i.addClass(r, d);
    o.runOutsideAngular(() => { requestAnimationFrame(() => { if (!c && (pE(r, Un, no), !Un.has(r))) {
        for (let d of s)
            i.removeClass(r, d);
        Wf(r);
    } }); });
} }
function aO(e, t, n) { let o = Bo.get(t); if (!(fi(e) !== t || !o) && Qf(e, t)) {
    e.stopPropagation();
    for (let r of o.classList)
        n.removeClass(t, r);
    Wf(t);
} }
function ni(e) { if (re("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !no)
    return ni; let t = g(); if (lc(t))
    return ni; let n = S(); return uc(_a(t), n, () => cO(t, n, e)), hc(t[O]), Jf(t[O], _a(t)), ni; }
function cO(e, t, n) { let o = oe(t, e); n.call(e[H], { target: o, animationComplete: eA }); }
function oi(e) { if (re("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !no)
    return oi; let t = g(); if (lc(t))
    return oi; let o = S(), r = t[O].get(W); return uc(Gn(t), o, () => lO(t, o, e, r)), hc(t[O]), oi; }
function lO(e, t, n, o) { let { promise: r, resolve: i } = To(), s = oe(t, e), a = e[M]; gn.add(e[Ve]), (Gn(e).get(t.index).resolvers ??= []).push(i); let c = uE(n); return c && c.length > 0 ? uO(s, t, e, c, a, o) : i(), { promise: r, resolve: i }; }
function uO(e, t, n, o, r, i) { nA(e, r); let s = [], a = Gn(n).get(t.index)?.resolvers, c, l = !1, u = d => { if (!(fi(d) !== e && d.type !== "animation-fallback") && (d.type === "animation-fallback" || Qf(d, e))) {
    if (l = !0, c && clearTimeout(c), d.type !== "animation-fallback" && d.stopPropagation(), Un.delete(e), wd(t, e), Array.isArray(t.projection))
        for (let p of o)
            r.removeClass(e, p);
    Md(a, s), Nd(n, t);
} }; i.runOutsideAngular(() => { s.push(r.listen(e, "animationend", u)), s.push(r.listen(e, "transitionend", u)); }), zf(t, e); for (let d of o)
    r.addClass(e, d); i.runOutsideAngular(() => { requestAnimationFrame(() => { if (l)
    return; pE(e, Un, no); let d = Un.get(e); d ? (c = setTimeout(() => { u(new CustomEvent("animation-fallback")); }, d.duration + 50), s.push(() => clearTimeout(c))) : (wd(t, e), Md(a, s), Nd(n, t)); }); }); }
function ja(e) { if (re("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !no)
    return ja; let t = g(), n = S(); gn.add(t[Ve]); let o = t[O].get(W), r = t[O].get(cE); return uc(Gn(t), n, () => dO(t, n, e, o, r)), hc(t[O]), ja; }
function dO(e, t, n, o, r) { let { promise: i, resolve: s } = To(), a = oe(t, e), c = [], l = e[M], u = lc(e); (Gn(e).get(t.index).resolvers ??= []).push(s); let d = Gn(e).get(t.index)?.resolvers; if (u)
    ta(e, t, a, d, c);
else {
    let f = setTimeout(() => ta(e, t, a, d, c), r), p = { target: a, animationComplete: () => { ta(e, t, a, d, c), clearTimeout(f); } };
    zf(t, a), o.runOutsideAngular(() => { c.push(l.listen(a, "animationend", () => { ta(e, t, a, d, c), clearTimeout(f); }, { once: !0 })); }), n.call(e[H], p);
} return { promise: i, resolve: s }; }
function cT() { return g()[ce][H]; }
var Qd = class {
    destroy(t) { }
    updateValue(t, n) { }
    swap(t, n) { let o = Math.min(t, n), r = Math.max(t, n), i = this.detach(r); if (r - o > 1) {
        let s = this.detach(o);
        this.attach(o, i), this.attach(r, s);
    }
    else
        this.attach(o, i); }
    move(t, n) { this.attach(n, this.detach(t)); }
};
function Gu(e, t, n, o, r) { return e === n && Object.is(t, o) ? 1 : Object.is(r(e, t), r(n, o)) ? -1 : 0; }
function fO(e, t, n, o) { let r, i, s = 0, a = e.length - 1, c = void 0; if (Array.isArray(t)) {
    bo(o);
    let l = t.length - 1;
    for (bo(null); s <= a && s <= l;) {
        let u = e.at(s), d = t[s], f = Gu(s, u, s, d, n);
        if (f !== 0) {
            f < 0 && e.updateValue(s, d), s++;
            continue;
        }
        let p = e.at(a), h = t[l], v = Gu(a, p, l, h, n);
        if (v !== 0) {
            v < 0 && e.updateValue(a, h), a--, l--;
            continue;
        }
        let y = n(s, u), D = n(a, p), k = n(s, d);
        if (Object.is(k, D)) {
            let ue = n(l, h);
            Object.is(ue, y) ? (e.swap(s, a), e.updateValue(a, h), l--, a--) : e.move(a, s), e.updateValue(s, d), s++;
            continue;
        }
        if (r ??= new Va, i ??= sv(e, s, a, n), Zd(e, r, s, k))
            e.updateValue(s, d), s++, a++;
        else if (i.has(k))
            r.set(y, e.detach(s)), a--;
        else {
            let ue = e.create(s, t[s]);
            e.attach(s, ue), s++, a++;
        }
    }
    for (; s <= l;)
        iv(e, r, n, s, t[s]), s++;
}
else if (t != null) {
    bo(o);
    let l = t[Symbol.iterator]();
    bo(null);
    let u = l.next();
    for (; !u.done && s <= a;) {
        let d = e.at(s), f = u.value, p = Gu(s, d, s, f, n);
        if (p !== 0)
            p < 0 && e.updateValue(s, f), s++, u = l.next();
        else {
            r ??= new Va, i ??= sv(e, s, a, n);
            let h = n(s, f);
            if (Zd(e, r, s, h))
                e.updateValue(s, f), s++, a++, u = l.next();
            else if (!i.has(h))
                e.attach(s, e.create(s, f)), s++, a++, u = l.next();
            else {
                let v = n(s, d);
                r.set(v, e.detach(s)), a--;
            }
        }
    }
    for (; !u.done;)
        iv(e, r, n, e.length, u.value), u = l.next();
} for (; s <= a;)
    e.destroy(e.detach(a--)); r?.forEach(l => { e.destroy(l); }); }
function Zd(e, t, n, o) { return t !== void 0 && t.has(o) ? (e.attach(n, t.get(o)), t.delete(o), !0) : !1; }
function iv(e, t, n, o, r) { if (Zd(e, t, o, n(o, r)))
    e.updateValue(o, r);
else {
    let i = e.create(o, r);
    e.attach(o, i);
} }
function sv(e, t, n, o) { let r = new Set; for (let i = t; i <= n; i++)
    r.add(o(i, e.at(i))); return r; }
var Va = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) { return this.kvMap.has(t); }
    delete(t) { if (!this.has(t))
        return !1; let n = this.kvMap.get(t); return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), !0; }
    get(t) { return this.kvMap.get(t); }
    set(t, n) { if (this.kvMap.has(t)) {
        let o = this.kvMap.get(t);
        this._vMap === void 0 && (this._vMap = new Map);
        let r = this._vMap;
        for (; r.has(o);)
            o = r.get(o);
        r.set(o, n);
    }
    else
        this.kvMap.set(t, n); }
    forEach(t) { for (let [n, o] of this.kvMap)
        if (t(o, n), this._vMap !== void 0) {
            let r = this._vMap;
            for (; r.has(o);)
                o = r.get(o), t(o, n);
        } }
};
function lT(e, t, n, o, r, i, s, a) { re("NgControlFlow"); let c = g(), l = _(), u = fe(l.consts, i); return Kn(c, l, e, t, n, o, r, u, 256, s, a), Uc; }
function Uc(e, t, n, o, r, i, s, a) { re("NgControlFlow"); let c = g(), l = _(), u = fe(l.consts, i); return Kn(c, l, e, t, n, o, r, u, 512, s, a), Uc; }
function uT(e, t) { re("NgControlFlow"); let n = g(), o = Te(), r = n[o] !== G ? n[o] : -1, i = r !== -1 ? Ha(n, I + r) : void 0, s = 0; if (Y(n, o, e)) {
    let a = R(null);
    try {
        if (i !== void 0 && zi(i, s), e !== -1) {
            let c = I + e, l = Ha(n, c), u = Xd(n[m], c), d = hI(l, u, n), f = vn(n, u, t, { dehydratedView: d });
            qt(l, f, s, Wn(u, d));
        }
    }
    finally {
        R(a);
    }
}
else if (i !== void 0) {
    let a = GE(i, s);
    a !== void 0 && (a[H] = t);
} }
var Yd = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, o) { this.lContainer = t, this.$implicit = n, this.$index = o; }
    get $count() { return this.lContainer.length - L; }
};
function dT(e) { return e; }
function fT(e, t) { return t; }
var Kd = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, o) { this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = o; }
};
function pT(e, t, n, o, r, i, s, a, c, l, u, d, f) { re("NgControlFlow"); let p = g(), h = _(), v = c !== void 0, y = g(), D = a ? s.bind(y[ce][H]) : s, k = new Kd(v, D); y[I + e] = k, Kn(p, h, e + 1, t, n, o, r, fe(h.consts, i), 256), v && Kn(p, h, e + 2, c, l, u, d, fe(h.consts, f), 512); }
var Jd = class extends Qd {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, o) { super(), this.lContainer = t, this.hostLView = n, this.templateTNode = o; }
    get length() { return this.lContainer.length - L; }
    at(t) { return this.getLView(t)[H].$implicit; }
    attach(t, n) { let o = n[he]; this.needsIndexUpdate ||= t !== this.length, qt(this.lContainer, n, t, Wn(this.templateTNode, o)), pO(this.lContainer, t); }
    detach(t) { return this.needsIndexUpdate ||= t !== this.length - 1, hO(this.lContainer, t), gO(this.lContainer, t); }
    create(t, n) { let o = vi(this.lContainer, this.templateTNode.tView.ssrId); return vn(this.hostLView, this.templateTNode, new Yd(this.lContainer, n, t), { dehydratedView: o }); }
    destroy(t) { Gi(t[m], t); }
    updateValue(t, n) { this.getLView(t)[H].$implicit = n; }
    reset() { this.needsIndexUpdate = !1; }
    updateIndexes() { if (this.needsIndexUpdate)
        for (let t = 0; t < this.length; t++)
            this.getLView(t)[H].$index = t; }
    getLView(t) { return mO(this.lContainer, t); }
};
function hT(e) { let t = R(null), n = le(); try {
    let o = g(), r = o[m], i = o[n], s = n + 1, a = Ha(o, s);
    if (i.liveCollection === void 0) {
        let l = Xd(r, s);
        i.liveCollection = new Jd(a, o, l);
    }
    else
        i.liveCollection.reset();
    let c = i.liveCollection;
    if (fO(c, e, i.trackByFn, t), c.updateIndexes(), i.hasEmptyBlock) {
        let l = Te(), u = c.length === 0;
        if (Y(o, l, u)) {
            let d = n + 2, f = Ha(o, d);
            if (u) {
                let p = Xd(r, d), h = hI(f, p, o), v = vn(o, p, void 0, { dehydratedView: h });
                qt(f, v, 0, Wn(p, h));
            }
            else
                r.firstUpdatePass && kc(f), zi(f, 0);
        }
    }
}
finally {
    R(t);
} }
function Ha(e, t) { return e[t]; }
function pO(e, t) { if (e.length <= L)
    return; let n = L + t, o = e[n], r = o ? o[Ye] : void 0; if (o && r && r.detachedLeaveAnimationFns && r.detachedLeaveAnimationFns.length > 0) {
    let i = o[O];
    uA(i, r), gn.delete(o[Ve]), r.detachedLeaveAnimationFns = void 0;
} }
function hO(e, t) { if (e.length <= L)
    return; let n = L + t, o = e[n], r = o ? o[Ye] : void 0; r && r.leave && r.leave.size > 0 && (r.detachedLeaveAnimationFns = []); }
function gO(e, t) { return hi(e, t); }
function mO(e, t) { return GE(e, t); }
function Xd(e, t) { return ln(e, t); }
function Gp(e, t, n) { let o = g(), r = Te(); if (Y(o, r, t)) {
    let i = _(), s = Oe();
    op(s, o, e, t, o[M], n);
} return Gp; }
function ef(e, t, n, o, r) { Mc(t, e, n, r ? "class" : "style", o); }
function Ci(e, t, n, o) { let r = g(), i = r[m], s = e + I, a = i.firstCreatePass ? gp(s, r, 2, t, ip, Ps(), n, o) : i.data[s]; if (Ne(a)) {
    let c = r[Ze].tracingService;
    if (c && c.componentCreate) {
        let l = i.data[a.directiveStart + a.componentOffset];
        return c.componentCreate(pp(l), () => (av(e, t, r, a, o), Ci));
    }
} return av(e, t, r, a, o), Ci; }
function av(e, t, n, o, r) { if (Cc(o, n, e, t, zp), yo(o)) {
    let i = n[m];
    Dc(i, n, o), Of(i, o, n);
} r != null && or(n, o); }
function $c() { let e = _(), t = S(), n = wc(t); return e.firstCreatePass && mp(e, n), ru(n) && au(), ou(), n.classesWithoutHost != null && CS(n) && ef(e, n, g(), n.classesWithoutHost, !0), n.stylesWithoutHost != null && wS(n) && ef(e, n, g(), n.stylesWithoutHost, !1), $c; }
function qp(e, t, n, o) { return Ci(e, t, n, o), $c(), qp; }
function Gc(e, t, n, o) { let r = g(), i = r[m], s = e + I, a = i.firstCreatePass ? RI(s, i, 2, t, n, o) : i.data[s]; return Cc(a, r, e, t, zp), o != null && or(r, a), Gc; }
function qc() { let e = S(), t = wc(e); return ru(t) && au(), ou(), qc; }
function Wp(e, t, n, o) { return Gc(e, t, n, o), qc(), Wp; }
var zp = (e, t, n, o, r) => (at(!0), ac(t[M], o, $s()));
function vO(e, t, n, o, r) { let i = !ic(t, n); if (at(i), i)
    return ac(t[M], o, $s()); let s = t[he], a = Qi(s, e, t, n); return by(s, r) && oc(s, r, a.nextSibling), s && (mf(n) || Xv(a)) && Ne(n) && (Gg(n), Zy(a)), a; }
function gT() { zp = vO; }
function Wc(e, t, n) { let o = g(), r = o[m], i = e + I, s = r.firstCreatePass ? gp(i, o, 8, "ng-container", ip, Ps(), t, n) : r.data[i]; if (Cc(s, o, e, "ng-container", Kp), yo(s)) {
    let a = o[m];
    Dc(a, o, s), Of(a, s, o);
} return n != null && or(o, s), Wc; }
function Xi() { let e = _(), t = S(), n = wc(t); return e.firstCreatePass && mp(e, n), Xi; }
function Qp(e, t, n) { return Wc(e, t, n), Xi(), Qp; }
function zc(e, t, n) { let o = g(), r = o[m], i = e + I, s = r.firstCreatePass ? RI(i, r, 8, "ng-container", t, n) : r.data[i]; return Cc(s, o, e, "ng-container", Kp), n != null && or(o, s), zc; }
function Zp() { let e = S(), t = wc(e); return Xi; }
function Yp(e, t, n) { return zc(e, t, n), Zp(), Yp; }
var Kp = (e, t, n, o, r) => (at(!0), Ff(t[M], ""));
function yO(e, t, n, o, r) { let i, s = !ic(t, n); if (at(s), s)
    return Ff(t[M], ""); let a = t[he], c = Qi(a, e, t, n), l = _y(a, r); return oc(a, r, c), i = Rc(l, c), i; }
function mT() { Kp = yO; }
var EO = Symbol("RENDER"), vT = Symbol("ON_DESTROY"), yT = Symbol("CONTENT_ADAPTER"), ET = Symbol("GET_CONTEXT"), IT = new C("FOREIGN_CONTEXT"), tf = class extends Ht {
    get head() { let t = this._lView, n = t[m]; return t[n.firstChild.index]; }
    get tail() { let t = this._lView, n = t[m]; return t[n.firstChild.next.index]; }
};
function IO(e, t) { let n = e[z], o = e[ae], r = n[M], i = yc(3, o, null, 3, 0, null, null, null, null, null, null), s = i.data[I] = Rd(i, null, 2, I, "", null), a = i.data[I + 1] = Rd(i, null, 2, I + 1, "", null); i.firstChild = s, s.next = a, a.prev = s; let c = qi(n, i, null, 0, null, null, null, r, null, null, null), l = c[s.index] = r.createComment(""), u = c[a.index] = r.createComment(""); c[w] &= -5; let d = new tf(c); if (qt(e, c, t), !l.parentNode) {
    let f = document.createDocumentFragment();
    f.appendChild(l), f.appendChild(u);
    let p = a.index + 1;
    c[p] = f;
} return d; }
function DT(e, t, n) { let o = g(), r = _(), i = e + I, s = fe(r.consts, t), a; r.firstCreatePass ? (a = yn(r, i, 4, null, null), Fs()) : (a = r.data[i], st(a, !1)); let c = o[M], l = c.createComment(""); mc(r, o, l, a), Be(l, o); let u = ap(l, o, l, a); o[i] = u, Ec(o, u); let d = IO(u, 0), f = ff(a, o, IT, 8), [p, h] = s[EO](n, f ?? void 0), v = d.tail, y = v.parentNode; if (y)
    for (let D = 0; D < p.length; D++)
        lt(c, y, p[D], v, !1); h && d.onDestroy(h); }
var Ba = class {
    context;
    constructor(t) { this.context = t; }
    get(t, n) { return t === IT ? this.context : n; }
};
function TT(e, t) { let n = g(), o = e + I, r = n[o]; r[w] |= 4; let i = _(), s = i.data[o], a = fe(i.consts, t); return [n, r, s, a]; }
function CT(e, t) { let [n, o, r, i] = TT(e, t), s = i[yT], a = i[vT], c = i[ET]; return s(() => { let u = c ? { embeddedViewInjector: new Ba(c()) } : void 0, d = vn(n, r, null, u); qt(o, d, o.length - L, !1), a(() => { if (!Je(d)) {
    let p = o.indexOf(d, L);
    zi(o, p - L);
} }); let f = d[m]; return mn(f, d, f.firstChild, []); }); }
function wT(e, t) { let [n, o, r, i] = TT(e, t), s = i[yT], a = i[vT], c = i[ET]; return (...l) => s(() => { let d = c ? { embeddedViewInjector: new Ba(c()) } : void 0, f = vn(n, r, l, d); qt(o, f, o.length - L, !1), a(() => { if (!Je(f)) {
    let h = o.indexOf(f, L);
    zi(o, h - L);
} }); let p = f[m]; return mn(p, f, p.firstChild, []); }); }
function MT() { return g(); }
function Jp(e, t, n) { let o = g(), r = Te(); if (Y(o, r, t)) {
    let i = _(), s = Oe();
    rp(s, o, e, t, o[M], n);
} return Jp; }
function Xp(e, t, n) { let o = g(), r = Te(); if (Y(o, r, t)) {
    let i = _(), s = Oe(), a = Vs(i.data), c = kE(a, s, o);
    rp(s, o, e, t, c, n);
} return Xp; }
var zr = void 0;
function DO(e) { let t = Math.floor(Math.abs(e)), n = e.toString().replace(/^[^.]*\.?/, "").length; return t === 1 && n === 0 ? 1 : 5; }
var TO = ["en", [["a", "p"], ["AM", "PM"]], [["AM", "PM"]], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], zr, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], zr, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm\u202Fa", "h:mm:ss\u202Fa", "h:mm:ss\u202Fa z", "h:mm:ss\u202Fa zzzz"], ["{1}, {0}", zr, zr, zr], [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", DO], Vo = Object.create(null);
function CO(e, t, n) { typeof t != "string" && (n = t, t = e[wi.LocaleId]), t = t.toLowerCase().replace(/_/g, "-"), Vo[t] = e, n && (Vo[t][wi.ExtraData] = n); }
function eh(e) { let t = NO(e), n = cv(t); if (n)
    return n; let o = t.split("-")[0]; if (n = cv(o), n)
    return n; if (o === "en")
    return TO; throw new T(701, !1); }
function wO(e) { return eh(e)[wi.CurrencyCode] || null; }
function NT(e) { return eh(e)[wi.PluralCase]; }
function cv(e) { if (!(e in Vo)) {
    let t = Fe.ng && Fe.ng.common && Fe.ng.common.locales && Fe.ng.common.locales[e];
    return t !== void 0 && (Vo[e] = t), t;
} return Vo[e]; }
function MO() { Vo = Object.create(null); }
var wi = { LocaleId: 0, DayPeriodsFormat: 1, DayPeriodsStandalone: 2, DaysFormat: 3, DaysStandalone: 4, MonthsFormat: 5, MonthsStandalone: 6, Eras: 7, FirstDayOfWeek: 8, WeekendRange: 9, DateFormat: 10, TimeFormat: 11, DateTimeFormat: 12, NumberSymbols: 13, NumberFormats: 14, CurrencyCode: 15, CurrencySymbol: 16, CurrencyName: 17, Currencies: 18, Directionality: 19, PluralCase: 20, ExtraData: 21 };
function NO(e) { return e.toLowerCase().replace(/_/g, "-"); }
var SO = ["zero", "one", "two", "few", "many"];
function _O(e, t) { let n = NT(t)(parseInt(e, 10)), o = SO[n]; return o !== void 0 ? o : "other"; }
var es = "en-US", bO = "USD", ST = { marker: "element" }, _T = { marker: "ICU" }, Lt = (function (e) { return e[e.SHIFT = 2] = "SHIFT", e[e.APPEND_EAGERLY = 1] = "APPEND_EAGERLY", e[e.COMMENT = 2] = "COMMENT", e; })(Lt || {}), bT = es;
function AT(e) { typeof e == "string" && (bT = e.toLowerCase().replace(/_/g, "-")); }
function AO() { return bT; }
var Mi = 0, ri = 0;
function RO(e) { e && (Mi = Mi | 1 << Math.min(ri, 31)), ri++; }
function xO(e, t, n) { try {
    if (ri > 0) {
        let o = e.data[n], r = Array.isArray(o) ? o : o.update, i = gt() - ri - 1;
        OT(e, t, r, i, Mi);
    }
}
finally {
    Mi = 0, ri = 0;
} }
function RT(e, t, n) { let o = e[M]; switch (n) {
    case Node.COMMENT_NODE: return Ff(o, t);
    case Node.TEXT_NODE: return Pf(o, t);
    case Node.ELEMENT_NODE: return ac(o, t, null);
} }
var ii = (e, t, n, o) => (at(!0), RT(e, n, o));
function kO(e, t, n, o) { let r = e[he], i = t - I, s = !xc() || !r || Ur() || rc(r, i); return at(s), s ? RT(e, n, o) : XE(r, i); }
function xT() { ii = kO; }
function OO(e, t, n, o) { let r = e[M]; for (let i = 0; i < t.length; i++) {
    let s = t[i++], a = t[i], c = (s & Lt.COMMENT) === Lt.COMMENT, l = (s & Lt.APPEND_EAGERLY) === Lt.APPEND_EAGERLY, u = s >>> Lt.SHIFT, d = e[u], f = !1;
    d === null && (d = e[u] = ii(e, u, a, c ? Node.COMMENT_NODE : Node.TEXT_NODE), f = Gr()), l && n !== null && f && lt(r, n, d, o, !1);
} }
function kT(e, t, n, o) { let r = n[M], i = null, s; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "string") {
        let l = t[++a];
        n[l] === null && (n[l] = ii(n, l, c, Node.TEXT_NODE));
    }
    else if (typeof c == "number")
        switch (c & 1) {
            case 0:
                let l = vR(c);
                i === null && (i = l, s = r.parentNode(o));
                let u, d;
                if (l === i ? (u = o, d = s) : (u = null, d = x(n[l])), d !== null) {
                    let v = yR(c), y = n[v];
                    lt(r, d, y, u, !1);
                    let D = Kr(e, v);
                    if (D !== null && typeof D == "object") {
                        let k = Ac(D, n);
                        k !== null && kT(e, D.create[k], n, n[D.anchorIdx]);
                    }
                }
                break;
            case 1:
                let f = c >>> 1, p = t[++a], h = t[++a];
                Tc(r, Ln(f, n), null, null, p, h, null);
                break;
            default:
        }
    else
        switch (c) {
            case _T:
                let l = t[++a], u = t[++a];
                if (n[u] === null) {
                    let p = n[u] = ii(n, u, l, Node.COMMENT_NODE);
                    Be(p, n);
                }
                break;
            case ST:
                let d = t[++a], f = t[++a];
                if (n[f] === null) {
                    let p = n[f] = ii(n, f, d, Node.ELEMENT_NODE);
                    Be(p, n);
                }
                break;
            default:
        }
} }
function OT(e, t, n, o, r) { for (let i = 0; i < n.length; i++) {
    let s = n[i], a = n[++i];
    if (s & r) {
        let c = "";
        for (let l = i + 1; l <= i + a; l++) {
            let u = n[l];
            if (typeof u == "string")
                c += u;
            else if (typeof u == "number")
                if (u < 0)
                    c += A(t[o - u]);
                else {
                    let d = u >>> 2;
                    switch (u & 3) {
                        case 1:
                            let f = n[++l], p = n[++l], h = e.data[d];
                            if (typeof h == "string")
                                Tc(t[M], t[d], null, h, f, c, p);
                            else {
                                let y = le();
                                vt(d);
                                try {
                                    op(h, t, f, c, t[M], p);
                                }
                                finally {
                                    vt(y);
                                }
                            }
                            break;
                        case 0:
                            let v = t[d];
                            v !== null && zy(t[M], v, c);
                            break;
                        case 2:
                            LO(e, Kr(e, d), t, c);
                            break;
                        case 3:
                            lv(e, Kr(e, d), o, t);
                            break;
                    }
                }
        }
    }
    else {
        let c = n[i + 1];
        if (c > 0 && (c & 3) === 3) {
            let l = c >>> 2, u = Kr(e, l);
            t[u.currentCaseLViewIndex] < 0 && lv(e, u, o, t);
        }
    }
    i += a;
} }
function lv(e, t, n, o) { let r = o[t.currentCaseLViewIndex]; if (r !== null) {
    let i = Mi;
    r < 0 && (r = o[t.currentCaseLViewIndex] = ~r, i = -1), OT(e, o, t.update[r], n, i);
} }
function LO(e, t, n, o) { let r = PO(t, o); if (Ac(t, n) !== r && (LT(e, t, n), n[t.currentCaseLViewIndex] = r === null ? null : ~r, r !== null)) {
    let s = n[t.anchorIdx];
    s && kT(e, t.create[r], n, s), FR(n, t.anchorIdx, r);
} }
function LT(e, t, n) { let o = Ac(t, n); if (o !== null) {
    let r = t.remove[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i];
        if (s > 0) {
            let a = Ln(s, n);
            a !== null && Bi(n[M], a);
        }
        else
            LT(e, Kr(e, ~s), n);
    }
} }
function PO(e, t) { let n = e.cases.indexOf(t); if (n === -1)
    switch (e.type) {
        case 1: {
            let o = _O(t, AO());
            n = e.cases.indexOf(o), n === -1 && o !== "other" && (n = e.cases.indexOf("other"));
            break;
        }
        case 0: {
            n = e.cases.indexOf("other");
            break;
        }
    } return n === -1 ? null : n; }
var Ua = /�(\d+):?\d*�/gi, FO = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi, jO = /�(\d+)�/, PT = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/, si = "\uFFFD", VO = /�\/?\*(\d+:\d+)�/gi, HO = /�(\/?[#*]\d+):?\d*�/gi, BO = /\uE500/g;
function UO(e) { return e.replace(BO, " "); }
function $O(e, t, n, o, r, i) { let s = Do(), a = [], c = [], l = [[]], u = [[]]; r = zO(r, i); let d = UO(r).split(HO); for (let f = 0; f < d.length; f++) {
    let p = d[f];
    if ((f & 1) === 0) {
        let h = nf(p);
        for (let v = 0; v < h.length; v++) {
            let y = h[v];
            if ((v & 1) === 0) {
                let D = y;
                D !== "" && GO(u[0], e, s, l[0], a, c, n, D);
            }
            else {
                let D = y;
                if (typeof D != "object")
                    throw new Error(`Unable to parse ICU expression in "${r}" message.`);
                let ue = FT(e, s, l[0], n, a, "", !0).index;
                VT(u[0], e, n, c, t, D, ue);
            }
        }
    }
    else {
        let h = p.charCodeAt(0) === 47, v = p.charCodeAt(h ? 1 : 0), y = I + Number.parseInt(p.substring(h ? 2 : 1));
        if (h)
            l.shift(), u.shift(), st(Do(), !1);
        else {
            let D = mR(e, l[0], y);
            l.unshift([]), st(D, !0);
            let k = { kind: 2, index: y, children: [], type: v === 35 ? 0 : 1 };
            u[0].push(k), u.unshift(k.children);
        }
    }
} e.data[o] = { create: a, update: c, ast: u[0], parentTNodeIndex: t }; }
function FT(e, t, n, o, r, i, s) { let a = Wi(e, o, 1, null), c = a << Lt.SHIFT, l = Do(); t === l && (l = null), l === null && (c |= Lt.APPEND_EAGERLY), s && (c |= Lt.COMMENT, Yb(IR)), r.push(c, i === null ? "" : i); let u = cp(e, a, s ? 32 : 1, i === null ? "" : i, null); ZE(n, u); let d = u.index; return st(u, !1), l !== null && t !== l && gR(l, d), u; }
function GO(e, t, n, o, r, i, s, a) { let c = a.match(Ua), u = FT(t, n, o, s, r, c ? null : a, !1).index; c && $a(i, a, u, null, 0, null), e.push({ kind: 0, index: u }); }
function qO(e, t, n) { let o = S(), r = o.index, i = []; if (e.firstCreatePass && e.data[t] === null) {
    for (let s = 0; s < n.length; s += 2) {
        let a = n[s], c = n[s + 1];
        if (c !== "") {
            if (FO.test(c))
                throw new Error(`ICU expressions are not supported in attributes. Message: "${c}".`);
            let l = o.namespace ? `:${o.namespace}:${o.value}` : o.value;
            $a(i, c, r, a, WO(i), of(a, l));
        }
    }
    e.data[t] = i;
} }
function $a(e, t, n, o, r, i) { let s = e.length, a = s + 1; e.push(null, null); let c = s + 2, l = t.split(Ua), u = 0; for (let d = 0; d < l.length; d++) {
    let f = l[d];
    if (d & 1) {
        let p = r + parseInt(f, 10);
        e.push(-1 - p), u = u | jT(p);
    }
    else
        f !== "" && e.push(f);
} return e.push(n << 2 | (o ? 1 : 0)), o && e.push(o, i), e[s] = u, e[a] = e.length - c, u; }
function WO(e) { let t = 0; for (let n = 0; n < e.length; n++) {
    let o = e[n];
    typeof o == "number" && o < 0 && t++;
} return t; }
function jT(e) { return 1 << Math.min(e, 31); }
function uv(e) { let t, n = "", o = 0, r = !1, i; for (; (t = VO.exec(e)) !== null;)
    r ? t[0] === `${si}/*${i}${si}` && (o = t.index, r = !1) : (n += e.substring(o, t.index + t[0].length), i = t[1], r = !0); return n += e.slice(o), n; }
function zO(e, t) { if (KE(t))
    return uv(e); {
    let n = e.indexOf(`:${t}${si}`) + 2 + t.toString().length, o = e.search(new RegExp(`${si}\\/\\*\\d+:${t}${si}`));
    return uv(e.substring(n, o));
} }
function VT(e, t, n, o, r, i, s) { let a = 0, c = { type: i.type, currentCaseLViewIndex: Wi(t, n, 1, null), anchorIdx: s, cases: [], create: [], remove: [], update: [] }; KO(o, i, s), hR(t, s, c); let l = i.values, u = []; for (let d = 0; d < l.length; d++) {
    let f = l[d], p = [];
    for (let v = 0; v < f.length; v++) {
        let y = f[v];
        if (typeof y != "string") {
            let D = p.push(y) - 1;
            f[v] = `<!--\uFFFD${D}\uFFFD-->`;
        }
    }
    let h = [];
    u.push(h), a = ZO(h, t, c, n, o, r, i.cases[d], f.join(""), p) | a;
} a && JO(o, a, s), e.push({ kind: 3, index: s, cases: u, currentCaseLViewIndex: c.currentCaseLViewIndex }); }
function QO(e) { let t = [], n = [], o = 1, r = 0; e = e.replace(PT, function (s, a, c) { return c === "select" ? o = 0 : o = 1, r = parseInt(a.slice(1), 10), ""; }); let i = nf(e); for (let s = 0; s < i.length;) {
    let a = i[s++].trim();
    o === 1 && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")), a.length && t.push(a);
    let c = nf(i[s++]);
    t.length > n.length && n.push(c);
} return { type: o, mainBinding: r, cases: t, values: n }; }
function nf(e) { if (!e)
    return []; let t = 0, n = [], o = [], r = /[{}]/g; r.lastIndex = 0; let i; for (; i = r.exec(e);) {
    let a = i.index;
    if (i[0] == "}") {
        if (n.pop(), n.length == 0) {
            let c = e.substring(t, a);
            PT.test(c) ? o.push(QO(c)) : o.push(c), t = a + 1;
        }
    }
    else {
        if (n.length == 0) {
            let c = e.substring(t, a);
            o.push(c), t = a + 1;
        }
        n.push("{");
    }
} let s = e.substring(t); return o.push(s), o; }
function ZO(e, t, n, o, r, i, s, a, c) { let l = [], u = [], d = []; n.cases.push(s), n.create.push(l), n.remove.push(u), n.update.push(d); let p = Hy(xi()).getInertBodyElement(a), h = Td(p) || p; return h ? HT(e, t, n, o, r, l, u, d, h, i, c, 0) : 0; }
function HT(e, t, n, o, r, i, s, a, c, l, u, d) { let f = 0, p = c.firstChild; for (; p;) {
    let h = Wi(t, o, 1, null);
    switch (p.nodeType) {
        case Node.ELEMENT_NODE:
            let v = p, y = v.tagName.toLowerCase();
            if (Ed.hasOwnProperty(y)) {
                qu(i, ST, y, l, h), t.data[h] = y;
                let tt = v.attributes;
                for (let wt = 0; wt < tt.length; wt++) {
                    let Dn = tt.item(wt), cs = Dn.name.toLowerCase(), XM = !!Dn.value.match(Ua), sg = v.namespaceURI, ag = sg && Fy[sg], cg = ag ? `:${ag}:${y}` : y;
                    if (XM)
                        Id.hasOwnProperty(cs) && $a(a, Dn.value, h, Dn.name, 0, of(cs, cg));
                    else if (Id[cs]) {
                        let eN = Dn.value;
                        of(cs, cg) ? fv(i, h, Dn.name, "unsafe:blocked") : fv(i, h, Dn.name, eN);
                    }
                }
                let $e = { kind: 1, index: h, children: [] };
                e.push($e), f = HT($e.children, t, n, o, r, i, s, a, p, h, u, d + 1) | f, dv(s, h, d);
            }
            break;
        case Node.TEXT_NODE:
            let D = p.textContent || "", k = D.match(Ua);
            qu(i, null, k ? "" : D, l, h), dv(s, h, d), k && (f = $a(a, D, h, null, 0, null) | f), e.push({ kind: 0, index: h });
            break;
        case Node.COMMENT_NODE:
            let ue = jO.exec(p.textContent || "");
            if (ue) {
                let tt = parseInt(ue[1], 10), $e = u[tt];
                qu(i, _T, "", l, h), VT(e, t, o, r, l, $e, h), YO(s, h, d);
            }
            break;
    }
    p = p.nextSibling;
} return f; }
function dv(e, t, n) { n === 0 && e.push(t); }
function YO(e, t, n) { n === 0 && (e.push(~t), e.push(t)); }
function KO(e, t, n) { e.push(jT(t.mainBinding), 2, -1 - t.mainBinding, n << 2 | 2); }
function JO(e, t, n) { e.push(t, 1, n << 2 | 3); }
function qu(e, t, n, o, r) { t !== null && e.push(t), e.push(n, r, ER(0, o, r)); }
function fv(e, t, n, o) { e.push(t << 1 | 1, n, o); }
function of(e, t) { let n; if (t) {
    let [o, r] = Ky(t, !1);
    n = jr(r, e, o);
}
else
    n = jr("*", e); switch (n) {
    case q.HTML: return jf;
    case q.STYLE: return Vf;
    case q.SCRIPT: return Bf;
    case q.URL: return sc;
    case q.RESOURCE_URL: return cc;
    case q.ATTRIBUTE_NO_BINDING: return Uf;
    default: return null;
} }
var pv = 0, XO = /\[(�.+?�?)\]/, eL = /\[(�.+?�?)\]|(�\/?\*\d+:\d+�)/g, tL = /({\s*)(VAR_(PLURAL|SELECT)(_\d+)?)(\s*,)/g, nL = /{([A-Z0-9_]+)}/g, oL = /�I18N_EXP_(ICU(_\d+)?)�/g, rL = /\/\*/, iL = /\d+\:(\d+)/;
function sL(e, t = {}) { let n = e; if (XO.test(e)) {
    let o = {}, r = [pv];
    n = n.replace(eL, (i, s, a) => { let c = s || a, l = o[c] || []; if (l.length || (c.split("|").forEach(v => { let y = v.match(iL), D = y ? parseInt(y[1], 10) : pv, k = rL.test(v); l.push([D, k, v]); }), o[c] = l), !l.length)
        throw new Error(`i18n postprocess: unmatched placeholder - ${c}`); let u = r[r.length - 1], d = 0; for (let v = 0; v < l.length; v++)
        if (l[v][0] === u) {
            d = v;
            break;
        } let [f, p, h] = l[d]; return p ? r.pop() : u !== f && r.push(f), l.splice(d, 1), h; });
} return Object.keys(t).length && (n = n.replace(tL, (o, r, i, s, a, c) => t.hasOwnProperty(i) ? `${r}${t[i]}${c}` : o), n = n.replace(nL, (o, r) => t.hasOwnProperty(r) ? t[r] : o), n = n.replace(oL, (o, r) => { if (t.hasOwnProperty(r)) {
    let i = t[r];
    if (!i.length)
        throw new Error(`i18n postprocess: unmatched ICU - ${o} with key: ${r}`);
    return i.shift();
} return o; })), n; }
function th(e, t, n = -1) { let o = _(), r = g(), i = I + e, s = fe(o.consts, t), a = Do(); if (o.firstCreatePass && $O(o, a === null ? 0 : a.index, r, i, s, n), o.type === 2) {
    let f = r[ce];
    f[w] |= 32;
}
else
    r[w] |= 32; let c = o.data[i], l = a === r[ae] ? null : a, u = EE(o, l, r), d = a && a.type & 8 ? r[a.index] : null; RR(r, i, a, n), OO(r, c.create, u, d), gu(!0); }
function nh() { gu(!1); }
function BT(e, t, n) { th(e, t, n), nh(); }
function UT(e, t) { let n = _(), o = fe(n.consts, t); qO(n, e + I, o); }
function oh(e) { let t = g(); return RO(Y(t, Te(), e)), oh; }
function $T(e) { xO(_(), g(), e + I); }
function GT(e, t = {}) { return sL(e, t); }
function rh(e, t, n) { let o = g(), r = _(), i = S(); return ah(r, o, o[M], i, e, t, n), rh; }
function ih(e, t) { let n = S(), o = g(), r = _(), i = Vs(r.data), s = kE(i, n, o); return ah(r, o, s, n, e, t), ih; }
function sh(e, t, n) { let o = g(), r = _(), i = S(); return (i.type & 3 || n) && hp(i, r, o, n, o[M], e, t, hn(i, o, t)), sh; }
function ah(e, t, n, o, r, i, s) { let a = !0, c = null; if ((o.type & 3 || s) && (c ??= hn(o, t, i), hp(o, e, t, s, n, r, i, c) && (a = !1)), a) {
    let l = o.outputs?.[r], u = o.hostDirectiveOutputs?.[r];
    if (u && u.length)
        for (let d = 0; d < u.length; d += 2) {
            let f = u[d], p = u[d + 1];
            c ??= hn(o, t, i), xa(o, t, f, p, r, c);
        }
    if (l && l.length)
        for (let d of l)
            c ??= hn(o, t, i), xa(o, t, d, r, r, c);
} }
function qT(e = 1) { return Kg(e); }
function aL(e, t) { let n = null, o = $b(e); for (let r = 0; r < t.length; r++) {
    let i = t[r];
    if (i === "*") {
        n = r;
        continue;
    }
    if (o === null ? sE(e, i, !0) : Wb(o, i))
        return r;
} return n; }
function WT(e) { let t = g()[ce][ae]; if (!t.projection) {
    let n = e ? e.length : 1, o = t.projection = Rr(n, null), r = o.slice(), i = t.child;
    for (; i !== null;) {
        if (i.type !== 128) {
            let s = e ? aL(i, e) : 0;
            s !== null && (r[s] ? r[s].projectionNext = i : o[s] = i, r[s] = i);
        }
        i = i.next;
    }
} }
function zT(e, t = 0, n, o, r, i) { let s = g(), a = _(), c = o ? e + 1 : null; c !== null && Kn(s, a, c, o, r, i, null, n); let l = yn(a, I + e, 16, null, n || null); l.projection === null && (l.projection = t), Fs(); let d = !s[he] || Ur(); s[ce][ae].projection[l.projection] === null && c !== null ? cL(s, a, c) : d && !er(l) && DA(a, s, l); }
function cL(e, t, n) { let o = I + n, r = t.data[o], i = e[o], s = vi(i, r.tView.ssrId), a = vn(e, r, void 0, { dehydratedView: s }); qt(i, a, 0, Wn(r, s)); }
function ch(e, t, n, o) { return UI(e, t, n, o), ch; }
function lh(e, t, n) { return BI(e, t, n), lh; }
function QT(e) { let t = g(), n = _(), o = Hs(); $r(o + 1); let r = Ep(n, o); if (e.dirty && Vg(t) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null)
        e.reset([]);
    else {
        let i = GI(t, o);
        e.reset(i, Jv), e.notifyOnChanges();
    }
    return !0;
} return !1; }
function ZT() { return yp(g(), Hs()); }
function uh(e, t, n, o, r) { return qI(t, UI(e, n, o, r)), uh; }
function dh(e, t, n, o) { return qI(e, BI(t, n, o)), dh; }
function YT(e = 1) { $r(Hs() + e); }
function KT(e) { let t = fu(); return un(t, I + e); }
function ra(e, t) { return e << 17 | t << 2; }
function Jn(e) { return e >> 17 & 32767; }
function lL(e) { return (e & 2) == 2; }
function uL(e, t) { return e & 131071 | t << 17; }
function rf(e) { return e | 2; }
function qo(e) { return (e & 131068) >> 2; }
function Wu(e, t) { return e & -131069 | t << 2; }
function dL(e) { return (e & 1) === 1; }
function sf(e) { return e | 1; }
function fL(e, t, n, o, r, i) { let s = i ? t.classBindings : t.styleBindings, a = Jn(s), c = qo(s); e[o] = n; let l = !1, u; if (Array.isArray(n)) {
    let d = n;
    u = d[1], (u === null || mo(d, u) > 0) && (l = !0);
}
else
    u = n; if (r)
    if (c !== 0) {
        let f = Jn(e[a + 1]);
        e[o + 1] = ra(f, a), f !== 0 && (e[f + 1] = Wu(e[f + 1], o)), e[a + 1] = uL(e[a + 1], o);
    }
    else
        e[o + 1] = ra(a, 0), a !== 0 && (e[a + 1] = Wu(e[a + 1], o)), a = o;
else
    e[o + 1] = ra(c, 0), a === 0 ? a = o : e[c + 1] = Wu(e[c + 1], o), c = o; l && (e[o + 1] = rf(e[o + 1])), hv(e, u, o, !0), hv(e, u, o, !1), pL(t, u, e, o, i), s = ra(a, c), i ? t.classBindings = s : t.styleBindings = s; }
function pL(e, t, n, o, r) { let i = r ? e.residualClasses : e.residualStyles; i != null && typeof t == "string" && mo(i, t) >= 0 && (n[o + 1] = sf(n[o + 1])); }
function hv(e, t, n, o) { let r = e[n + 1], i = t === null, s = o ? Jn(r) : qo(r), a = !1; for (; s !== 0 && (a === !1 || i);) {
    let c = e[s], l = e[s + 1];
    hL(c, t) && (a = !0, e[s + 1] = o ? sf(l) : rf(l)), s = o ? Jn(l) : qo(l);
} a && (e[n + 1] = o ? rf(r) : sf(r)); }
function hL(e, t) { return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? mo(e, t) >= 0 : !1; }
var pe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function JT(e) { return e.substring(pe.key, pe.keyEnd); }
function gL(e) { return e.substring(pe.value, pe.valueEnd); }
function mL(e) { return tC(e), XT(e, Wo(e, 0, pe.textEnd)); }
function XT(e, t) { let n = pe.textEnd; return n === t ? -1 : (t = pe.keyEnd = yL(e, pe.key = t, n), Wo(e, t, n)); }
function vL(e) { return tC(e), eC(e, Wo(e, 0, pe.textEnd)); }
function eC(e, t) { let n = pe.textEnd, o = pe.key = Wo(e, t, n); return n === o ? -1 : (o = pe.keyEnd = EL(e, o, n), o = gv(e, o, n, 58), o = pe.value = Wo(e, o, n), o = pe.valueEnd = IL(e, o, n), gv(e, o, n, 59)); }
function tC(e) { pe.key = 0, pe.keyEnd = 0, pe.value = 0, pe.valueEnd = 0, pe.textEnd = e.length; }
function Wo(e, t, n) { for (; t < n && e.charCodeAt(t) <= 32;)
    t++; return t; }
function yL(e, t, n) { for (; t < n && e.charCodeAt(t) > 32;)
    t++; return t; }
function EL(e, t, n) { let o; for (; t < n && ((o = e.charCodeAt(t)) === 45 || o === 95 || (o & -33) >= 65 && (o & -33) <= 90 || o >= 48 && o <= 57);)
    t++; return t; }
function gv(e, t, n, o) { return t = Wo(e, t, n), t < n && t++, t; }
function IL(e, t, n) { let o = -1, r = -1, i = -1, s = t, a = s; for (; s < n;) {
    let c = e.charCodeAt(s++);
    if (c === 59)
        return a;
    c === 34 || c === 39 ? a = s = mv(e, c, s, n) : t === s - 4 && i === 85 && r === 82 && o === 76 && c === 40 ? a = s = mv(e, 41, s, n) : c > 32 && (a = s), i = r, r = o, o = c & -33;
} return a; }
function mv(e, t, n, o) { let r = -1, i = n; for (; i < o;) {
    let s = e.charCodeAt(i++);
    if (s == t && r !== 92)
        return i;
    s == 92 && r === 92 ? r = 0 : r = s;
} throw new Error; }
function fh(e, t, n) { return rC(e, t, n, !1), fh; }
function ph(e, t) { return rC(e, t, null, !0), ph; }
function nC(e) { iC(cC, DL, e, !1); }
function DL(e, t) { for (let n = vL(t); n >= 0; n = eC(t, n))
    cC(e, JT(t), gL(t)); }
function oC(e) { iC(_L, TL, e, !0); }
function TL(e, t) { for (let n = mL(t); n >= 0; n = XT(t, n))
    xr(e, JT(t), !0); }
function rC(e, t, n, o) { let r = g(), i = _(), s = mt(2); if (i.firstUpdatePass && aC(i, e, s, o), t !== G && Y(r, s, t)) {
    let a = i.data[le()];
    lC(i, a, r, r[M], e, r[s + 1] = AL(t, n), o, s);
} }
function iC(e, t, n, o) { let r = _(), i = mt(2); r.firstUpdatePass && aC(r, null, i, o); let s = g(); if (n !== G && Y(s, i, n)) {
    let a = r.data[le()];
    if (uC(a, o) && !sC(r, i)) {
        let c = o ? a.classesWithoutHost : a.stylesWithoutHost;
        c !== null && (n = Ts(c, n || "")), ef(r, a, s, n, o);
    }
    else
        bL(r, a, s, s[M], s[i + 1], s[i + 1] = SL(e, t, n), o, i);
} }
function sC(e, t) { return t >= e.expandoStartIndex; }
function aC(e, t, n, o) { let r = e.data; if (r[n + 1] === null) {
    let i = r[le()], s = sC(e, n);
    uC(i, o) && t === null && !s && (t = !1), t = CL(r, i, t, o), fL(r, i, t, n, s, o);
} }
function CL(e, t, n, o) { let r = Vs(e), i = o ? t.residualClasses : t.residualStyles; if (r === null)
    (o ? t.classBindings : t.styleBindings) === 0 && (n = zu(null, e, t, n, o), n = Ni(n, t.attrs, o), i = null);
else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== r)
        if (n = zu(r, e, t, n, o), i === null) {
            let c = wL(e, t, o);
            c !== void 0 && Array.isArray(c) && (c = zu(null, e, t, c[1], o), c = Ni(c, t.attrs, o), ML(e, t, o, c));
        }
        else
            i = NL(e, t, o);
} return i !== void 0 && (o ? t.residualClasses = i : t.residualStyles = i), n; }
function wL(e, t, n) { let o = n ? t.classBindings : t.styleBindings; if (qo(o) !== 0)
    return e[Jn(o)]; }
function ML(e, t, n, o) { let r = n ? t.classBindings : t.styleBindings; e[Jn(r)] = o; }
function NL(e, t, n) { let o, r = t.directiveEnd; for (let i = 1 + t.directiveStylingLast; i < r; i++) {
    let s = e[i].hostAttrs;
    o = Ni(o, s, n);
} return Ni(o, t.attrs, n); }
function zu(e, t, n, o, r) { let i = null, s = n.directiveEnd, a = n.directiveStylingLast; for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], o = Ni(o, i.hostAttrs, r), i !== e);)
    a++; return e !== null && (n.directiveStylingLast = a), o; }
function Ni(e, t, n) { let o = n ? 1 : 2, r = -1; if (t !== null)
    for (let i = 0; i < t.length; i++) {
        let s = t[i];
        typeof s == "number" ? r = s : r === o && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), xr(e, s, n ? !0 : t[++i]));
    } return e === void 0 ? null : e; }
function SL(e, t, n) { if (n == null || n === "")
    return V; let o = [], r = Tt(n); if (Array.isArray(r))
    for (let i = 0; i < r.length; i++)
        e(o, r[i], !0);
else if (r instanceof Set)
    for (let i of r)
        e(o, i, !0);
else if (typeof r == "object")
    for (let i in r)
        Object.hasOwn(r, i) && e(o, i, r[i]);
else
    typeof r == "string" && t(o, r); return o; }
function cC(e, t, n) { xr(e, t, Tt(n)); }
function _L(e, t, n) { let o = String(t); o !== "" && !o.includes(" ") && xr(e, o, n); }
function bL(e, t, n, o, r, i, s, a) { r === G && (r = V); let c = 0, l = 0, u = 0 < r.length ? r[0] : null, d = 0 < i.length ? i[0] : null; for (; u !== null || d !== null;) {
    let f = c < r.length ? r[c + 1] : void 0, p = l < i.length ? i[l + 1] : void 0, h = null, v;
    u === d ? (c += 2, l += 2, f !== p && (h = d, v = p)) : d === null || u !== null && u < d ? (c += 2, h = u) : (l += 2, h = d, v = p), h !== null && lC(e, t, n, o, h, v, s, a), u = c < r.length ? r[c] : null, d = l < i.length ? i[l] : null;
} }
function lC(e, t, n, o, r, i, s, a) { if (!(t.type & 3))
    return; let c = e.data, l = c[a + 1], u = dL(l) ? vv(c, t, n, r, qo(l), s) : void 0; if (!Ga(u)) {
    Ga(i) || lL(l) && (i = vv(c, null, n, r, a, s));
    let d = Ln(le(), n);
    CA(o, s, d, r, i);
} }
function vv(e, t, n, o, r, i) { let s = t === null, a; for (; r > 0;) {
    let c = e[r], l = Array.isArray(c), u = l ? c[1] : c, d = u === null, f = n[r + 1];
    f === G && (f = d ? V : void 0);
    let p = d ? _s(f, o) : u === o ? f : void 0;
    if (l && !Ga(p) && (p = _s(c, o)), Ga(p) && (a = p, s))
        return a;
    let h = e[r + 1];
    r = s ? Jn(h) : qo(h);
} if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = _s(c, o));
} return a; }
function Ga(e) { return e !== void 0; }
function AL(e, t) { return e == null || e === "" || (typeof t == "string" ? e = Tt(e) + t : typeof e == "object" && (e = Tr(Tt(e)))), e; }
function uC(e, t) { return (e.flags & (t ? 8 : 16)) !== 0; }
function dC(e, t = "") { let n = g(), o = _(), r = e + I, i = o.firstCreatePass ? yn(o, r, 1, t, null) : o.data[r], s = fC(o, n, i, t); n[r] = s, Gr() && mc(o, n, s, i), st(i, !1); }
var fC = (e, t, n, o) => (at(!0), Pf(t[M], o));
function RL(e, t, n, o) { let r = !ic(t, n); if (at(r), r)
    return Pf(t[M], o); let i = t[he]; return Qi(i, e, t, n); }
function pC() { fC = RL; }
function hC(e, t) { let n = !1, o = gt(); for (let i = 1; i < t.length; i += 2)
    n = Y(e, o++, t[i]) || n; if (hu(o), !n)
    return G; let r = t[0]; for (let i = 1; i < t.length; i += 2)
    r += A(t[i]) + (i + 1 !== t.length ? t[i + 1] : ""); return r; }
function gC(e, t, n, o = "") { return Y(e, Te(), n) ? t + A(n) + o : G; }
function mC(e, t, n, o, r, i = "") { let s = gt(), a = zn(e, s, n, r); return mt(2), a ? t + A(n) + o + A(r) + i : G; }
function vC(e, t, n, o, r, i, s, a = "") { let c = gt(), l = Pc(e, c, n, r, s); return mt(3), l ? t + A(n) + o + A(r) + i + A(s) + a : G; }
function yC(e, t, n, o, r, i, s, a, c, l = "") { let u = gt(), d = et(e, u, n, r, s, c); return mt(4), d ? t + A(n) + o + A(r) + i + A(s) + a + A(c) + l : G; }
function EC(e, t, n, o, r, i, s, a, c, l, u, d = "") { let f = gt(), p = et(e, f, n, r, s, c); return p = Y(e, f + 4, u) || p, mt(5), p ? t + A(n) + o + A(r) + i + A(s) + a + A(c) + l + A(u) + d : G; }
function IC(e, t, n, o, r, i, s, a, c, l, u, d, f, p = "") { let h = gt(), v = et(e, h, n, r, s, c); return v = zn(e, h + 4, u, f) || v, mt(6), v ? t + A(n) + o + A(r) + i + A(s) + a + A(c) + l + A(u) + d + A(f) + p : G; }
function DC(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v = "") { let y = gt(), D = et(e, y, n, r, s, c); return D = Pc(e, y + 4, u, f, h) || D, mt(7), D ? t + A(n) + o + A(r) + i + A(s) + a + A(c) + l + A(u) + d + A(f) + p + A(h) + v : G; }
function TC(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y, D = "") { let k = gt(), ue = et(e, k, n, r, s, c); return ue = et(e, k + 4, u, f, h, y) || ue, mt(8), ue ? t + A(n) + o + A(r) + i + A(s) + a + A(c) + l + A(u) + d + A(f) + p + A(h) + v + A(y) + D : G; }
function hh(e) { return Qc("", e), hh; }
function Qc(e, t, n) { let o = g(), r = gC(o, e, t, n); return r !== G && Qt(o, le(), r), Qc; }
function gh(e, t, n, o, r) { let i = g(), s = mC(i, e, t, n, o, r); return s !== G && Qt(i, le(), s), gh; }
function mh(e, t, n, o, r, i, s) { let a = g(), c = vC(a, e, t, n, o, r, i, s); return c !== G && Qt(a, le(), c), mh; }
function vh(e, t, n, o, r, i, s, a, c) { let l = g(), u = yC(l, e, t, n, o, r, i, s, a, c); return u !== G && Qt(l, le(), u), vh; }
function yh(e, t, n, o, r, i, s, a, c, l, u) { let d = g(), f = EC(d, e, t, n, o, r, i, s, a, c, l, u); return f !== G && Qt(d, le(), f), yh; }
function Eh(e, t, n, o, r, i, s, a, c, l, u, d, f) { let p = g(), h = IC(p, e, t, n, o, r, i, s, a, c, l, u, d, f); return h !== G && Qt(p, le(), h), Eh; }
function Ih(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h) { let v = g(), y = DC(v, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); return y !== G && Qt(v, le(), y), Ih; }
function Dh(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y) { let D = g(), k = TC(D, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y); return k !== G && Qt(D, le(), k), Dh; }
function Th(e) { let t = g(), n = hC(t, e); return n !== G && Qt(t, le(), n), Th; }
function Qt(e, t, n) { let o = Ln(t, e); zy(e[M], o, n); }
function Ch(e, t, n) { zs(t) && (t = t()); let o = g(), r = Te(); if (Y(o, r, t)) {
    let i = _(), s = Oe();
    op(s, o, e, t, o[M], n);
} return Ch; }
function CC(e, t) { let n = zs(e); return n && e.set(t), n; }
function wh(e, t) { let n = g(), o = _(), r = S(); return ah(o, n, n[M], r, e, t), wh; }
var wC = {};
function Mh(e) { re("NgLet"); let t = _(), n = g(), o = e + I, r = yn(t, o, 128, null, null); return st(r, !1), Hr(t, n, o, wC), Mh; }
function MC(e) { let t = _(), n = g(), o = le(); return Hr(t, n, o, e), e; }
function NC(e) { let t = fu(), n = un(t, I + e); if (n === wC)
    throw new T(314, !1); return n; }
function SC(e, t) { let n = _(), o = g(), r = o[M], i = "data-ng-source-location"; for (let [s, a, c, l] of t) {
    let u = ln(n, s + I), d = Ln(s + I, o);
    if (!d.hasAttribute(i)) {
        let f = `${e}@o:${a},l:${c},c:${l}`;
        r.setAttribute(d, i, f);
    }
} }
function _C(e) { return Y(g(), Te(), e) ? A(e) : G; }
function bC(e, t, n = "") { return gC(g(), e, t, n); }
function AC(e, t, n, o, r = "") { return mC(g(), e, t, n, o, r); }
function RC(e, t, n, o, r, i, s = "") { return vC(g(), e, t, n, o, r, i, s); }
function xC(e, t, n, o, r, i, s, a, c = "") { return yC(g(), e, t, n, o, r, i, s, a, c); }
function kC(e, t, n, o, r, i, s, a, c, l, u = "") { return EC(g(), e, t, n, o, r, i, s, a, c, l, u); }
function OC(e, t, n, o, r, i, s, a, c, l, u, d, f = "") { return IC(g(), e, t, n, o, r, i, s, a, c, l, u, d, f); }
function LC(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h = "") { return DC(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); }
function PC(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y = "") { return TC(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y); }
function FC(e) { return hC(g(), e); }
function jC(e, t, n) { let o = Ee() + e, r = g(); return r[o] === G ? ut(r, o, t(n, r)) : ir(r, o); }
function yv(e, t, n) { let o = _(); o.firstCreatePass && VC(t, o.data, o.blueprint, Ke(e), n); }
function VC(e, t, n, o, r) { if (e = j(e), Array.isArray(e))
    for (let i = 0; i < e.length; i++)
        VC(e[i], t, n, o, r);
else {
    let i = _(), s = g(), a = S(), c = _n(e) ? e : j(e.provide), l = zl(e), u = a.providerIndexes & 1048575, d = a.directiveStart, f = a.providerIndexes >> 20;
    if (_n(e) || !e.multi) {
        let p = new $n(l, r, sr, null), h = Zu(c, t, r ? u : u + f, d);
        h === -1 ? (nd(Ea(a, s), i, c), Qu(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(p), s.push(p)) : (n[h] = p, s[h] = p);
    }
    else {
        let p = Zu(c, t, u + f, d), h = Zu(c, t, u, u + f), v = p >= 0 && n[p], y = h >= 0 && n[h];
        if (r && !y || !r && !v) {
            nd(Ea(a, s), i, c);
            let D = OL(r ? kL : xL, n.length, r, o, l, e);
            !r && y && (n[h].providerFactory = D), Qu(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(D), s.push(D);
        }
        else {
            let D = HC(n[r ? h : p], l, !r && o);
            Qu(i, e, p > -1 ? p : h, D);
        }
        !r && o && y && n[h].componentProviders++;
    }
} }
function Qu(e, t, n, o) { let r = _n(t), i = kg(t); if (r || i) {
    let c = (i ? j(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
        let l = e.destroyHooks || (e.destroyHooks = []);
        if (!r && t.multi) {
            let u = l.indexOf(n);
            u === -1 ? l.push(n, [o, c]) : l[u + 1].push(o, c);
        }
        else
            l.push(n, c);
    }
} }
function HC(e, t, n) { return n && e.componentProviders++, e.multi.push(t) - 1; }
function Zu(e, t, n, o) { for (let r = n; r < o; r++)
    if (t[r] === e)
        return r; return -1; }
function xL(e, t, n, o, r) { return af(this.multi, []); }
function kL(e, t, n, o, r) { let i = this.multi, s; if (this.providerFactory) {
    let a = this.providerFactory.componentProviders, c = ci(o, o[m], this.providerFactory.index, r);
    s = c.slice(0, a), af(i, s);
    for (let l = a; l < c.length; l++)
        s.push(c[l]);
}
else
    s = [], af(i, s); return s; }
function af(e, t) { for (let n = 0; n < e.length; n++) {
    let o = e[n];
    t.push(o());
} return t; }
function OL(e, t, n, o, r, i) { let s = new $n(e, n, sr, null); return s.multi = [], s.index = t, s.componentProviders = 0, HC(s, r, o && !n), s; }
function BC(e, t) { return n => { n.providersResolver = (o, r) => yv(o, r ? r(e) : e, !1), t && (n.viewProvidersResolver = (o, r) => yv(o, r ? r(t) : t, !0)); }; }
function UC(e) { return t => { e.length < 1 || (t.getExternalStyles = n => e.map(r => r + "?ngcomp" + (n ? "=" + encodeURIComponent(n) : "") + "&e=" + t.encapsulation)); }; }
function $C(e, t, n) { let o = e.\u0275cmp; o.directiveDefs = Fa(t, YI), o.pipeDefs = Fa(n, ot); }
function GC(e, t) { return Ct(() => { let n = ws(e); n.declarations = ia(t.declarations || V), n.imports = ia(t.imports || V), n.exports = ia(t.exports || V), t.bootstrap && (n.bootstrap = ia(t.bootstrap)), Uo.registerNgModule(e, t); }); }
function ia(e) { if (typeof e == "function")
    return e; let t = rt(e); return t.some(wr) ? () => t.map(j).map(Ev) : t.map(Ev); }
function Ev(e) { return fp(e) ? e.ngModule : e; }
var Nh = () => null, Sh = () => { }, cf = !1, Zc = new C("");
function qC() { return Nh(); }
function _h(e) { e.requested && e.activated && Sh(e.injector, e.document); }
function WC() { if (cf || (cf = !0, z_(), re("NgIncrementalHydration"), Nh = () => new k_, Sh = (e, t) => { let n = X_(e), o = bR(t, t.body); tO(e, n, o), q_(t, e); }), typeof ngServerMode > "u" || !ngServerMode) {
    let t = g()[O].get(Zc, null, { optional: !0 });
    t !== null && !t.activated && (t.activated = !0, _h(t));
} }
function LL() { cf = !1, Nh = () => null, Sh = () => { }; }
function zC(e, t) { let n = Ee() + e, o = g(); return o[n] === G ? ut(o, n, t()) : ir(o, n); }
function QC(e, t, n) { return ow(g(), Ee(), e, t, n); }
function ZC(e, t, n, o) { return rw(g(), Ee(), e, t, n, o); }
function YC(e, t, n, o, r) { return iw(g(), Ee(), e, t, n, o, r); }
function KC(e, t, n, o, r, i, s) { return sw(g(), Ee(), e, t, n, o, r, i); }
function JC(e, t, n, o, r, i, s) { let a = Ee() + e, c = g(), l = et(c, a, n, o, r, i); return Y(c, a + 4, s) || l ? ut(c, a + 5, t(n, o, r, i, s)) : ir(c, a + 5); }
function XC(e, t, n, o, r, i, s, a) { let c = Ee() + e, l = g(), u = et(l, c, n, o, r, i); return zn(l, c + 4, s, a) || u ? ut(l, c + 6, t(n, o, r, i, s, a)) : ir(l, c + 6); }
function ew(e, t, n, o, r, i, s, a, c) { let l = Ee() + e, u = g(), d = et(u, l, n, o, r, i); return Pc(u, l + 4, s, a, c) || d ? ut(u, l + 7, t(n, o, r, i, s, a, c)) : ir(u, l + 7); }
function tw(e, t, n, o, r, i, s, a, c, l) { let u = Ee() + e, d = g(), f = et(d, u, n, o, r, i); return et(d, u + 4, s, a, c, l) || f ? ut(d, u + 8, t(n, o, r, i, s, a, c, l)) : ir(d, u + 8); }
function nw(e, t, n) { return aw(g(), Ee(), e, t, n); }
function ts(e, t) { let n = e[t]; return n === G ? void 0 : n; }
function ow(e, t, n, o, r, i) { let s = t + n; return Y(e, s, r) ? ut(e, s + 1, i ? o.call(i, r) : o(r)) : ts(e, s + 1); }
function rw(e, t, n, o, r, i, s) { let a = t + n; return zn(e, a, r, i) ? ut(e, a + 2, s ? o.call(s, r, i) : o(r, i)) : ts(e, a + 2); }
function iw(e, t, n, o, r, i, s, a) { let c = t + n; return Pc(e, c, r, i, s) ? ut(e, c + 3, a ? o.call(a, r, i, s) : o(r, i, s)) : ts(e, c + 3); }
function sw(e, t, n, o, r, i, s, a, c) { let l = t + n; return et(e, l, r, i, s, a) ? ut(e, l + 4, c ? o.call(c, r, i, s, a) : o(r, i, s, a)) : ts(e, l + 4); }
function aw(e, t, n, o, r, i) { let s = t + n, a = !1; for (let c = 0; c < r.length; c++)
    Y(e, s++, r[c]) && (a = !0); return a ? ut(e, s, o.apply(i, r)) : ts(e, s); }
function cw(e, t) { let n = _(), o, r = e + I; n.firstCreatePass ? (o = PL(t, n.pipeRegistry), n.data[r] = o, o.onDestroy && (n.destroyHooks ??= []).push(r, o.onDestroy)) : o = n.data[r]; let i = o.factory || (o.factory = en(o.type, !0)), s, a = Me(sr); try {
    let c = ya(!1), l = i();
    return ya(c), Hr(n, g(), r, l), l;
}
finally {
    Me(a);
} }
function PL(e, t) { if (t)
    for (let n = t.length - 1; n >= 0; n--) {
        let o = t[n];
        if (e === o.name)
            return o;
    } }
function lw(e, t, n) { let o = e + I, r = g(), i = un(r, o); return ns(r, o) ? ow(r, Ee(), t, i.transform, n, i) : i.transform(n); }
function uw(e, t, n, o) { let r = e + I, i = g(), s = un(i, r); return ns(i, r) ? rw(i, Ee(), t, s.transform, n, o, s) : s.transform(n, o); }
function dw(e, t, n, o, r) { let i = e + I, s = g(), a = un(s, i); return ns(s, i) ? iw(s, Ee(), t, a.transform, n, o, r, a) : a.transform(n, o, r); }
function fw(e, t, n, o, r, i) { let s = e + I, a = g(), c = un(a, s); return ns(a, s) ? sw(a, Ee(), t, c.transform, n, o, r, i, c) : c.transform(n, o, r, i); }
function pw(e, t, n) { let o = e + I, r = g(), i = un(r, o); return ns(r, o) ? aw(r, Ee(), t, i.transform, n, i) : i.transform.apply(i, n); }
function ns(e, t) { return e[m].data[t].pure; }
function hw(e, t) { return bc(e, t); }
function gw(e, t) { return () => { try {
    return Uo.getComponentDependencies(e, t).dependencies;
}
catch (n) {
    throw console.error(`Computing dependencies in local compilation mode for the component "${e.name}" failed with the exception:`, n), n;
} }; }
function mw(e, t) { let n = Q(e); n !== null && (n.debugInfo = t); }
function vw(e, t, n) { let o = `./@ng/component?c=${e}&t=${encodeURIComponent(t)}`; return new URL(o, n).href; }
function yw(e, t, n, o, r = null, i = null) { let s = Q(e); t.apply(null, [e, n, ...o]); let { newDef: a, oldDef: c } = FL(s, Q(e)); if (e[At] = a, c.tView) {
    let l = s_().values();
    for (let u of l)
        it(u) && u[z] === null && pa(r, i, a, c, u);
} }
function FL(e, t) { let n = F({}, e); return { newDef: Object.assign(e, t, { directiveDefs: n.directiveDefs, pipeDefs: n.pipeDefs, setInput: n.setInput, type: n.type }), oldDef: n }; }
function pa(e, t, n, o, r) { let i = r[m]; if (i === o.tView) {
    VL(e, t, n, o, r);
    return;
} for (let s = I; s < i.bindingStartIndex; s++) {
    let a = r[s];
    if (X(a)) {
        ee(a[$]) && pa(e, t, n, o, a[$]);
        for (let c = L; c < a.length; c++)
            pa(e, t, n, o, a[c]);
    }
    else
        ee(a) && pa(e, t, n, o, a);
} }
function jL(e, t) { e.componentReplaced?.(t.id); }
function VL(e, t, n, o, r) { let i = r[H], s = r[$], a = r[z], c = r[ae], l = r[O].get(W, null), u = () => { if (o.encapsulation === Xe.ShadowDom || o.encapsulation === Xe.ExperimentalIsolatedShadowDom) {
    let h = s.cloneNode(!1);
    s.replaceWith(h), s = h;
} let d = NE(n), f = qi(a, d, i, np(n), s, c, null, null, null, null, null); HL(a, r, f, c.index), Gi(r[m], r), mi(r); let p = r[Ze].rendererFactory; jL(p, o), f[M] = p.createRenderer(s, n), vE(r[m], r), BL(c), Nc(d, f, i), HE(d, f, d.template, i); }; l === null ? Iv(e, t, u) : l.run(() => Iv(e, t, u)); }
function Iv(e, t, n) {
    try {
        n();
    }
    catch (o) {
        let r = o;
        if (t !== null && r.message) {
            let i = r.message + (r.stack ? `
` + r.stack : "");
            e?.hot?.send?.("angular:invalidate", { id: t, message: i, error: !0 });
        }
        throw o;
    }
}
function HL(e, t, n, o) { for (let r = I; r < e[m].bindingStartIndex; r++) {
    let i = e[r];
    if ((ee(i) || X(i)) && i[ve] === t) {
        i[ve] = n;
        break;
    }
} e[sn] === t && (e[sn] = n), e[Lr] === t && (e[Lr] = n), n[ve] = t[ve], t[ve] = null, e[o] = n; }
function BL(e) { if (e.projection !== null) {
    for (let t of e.projection)
        qa(t) && (t.projectionNext = null, t.flags &= -3);
    e.projection = null;
} }
var Ie = { \u0275\u0275animateEnter: ti, \u0275\u0275animateEnterListener: ni, \u0275\u0275animateLeave: oi, \u0275\u0275animateLeaveListener: ja, \u0275\u0275attribute: $p, \u0275\u0275defineComponent: ZI, \u0275\u0275defineDirective: KI, \u0275\u0275defineInjectable: J, \u0275\u0275defineInjector: Mr, \u0275\u0275defineNgModule: Np, \u0275\u0275defineService: Ut, \u0275\u0275definePipe: JI, \u0275\u0275directiveInject: sr, \u0275\u0275getInheritedFactory: Uv, \u0275\u0275inject: me, \u0275\u0275injectAttribute: Wa, \u0275\u0275invalidFactory: _I, \u0275\u0275invalidFactoryDep: Ss, \u0275\u0275templateRefExtractor: hw, \u0275\u0275resetView: lu, \u0275\u0275HostDirectivesFeature: lD, \u0275\u0275NgOnChangesFeature: bv, \u0275\u0275ControlFeature: cD, \u0275\u0275ProvidersFeature: BC, \u0275\u0275InheritDefinitionFeature: xp, \u0275\u0275ExternalStylesFeature: UC, \u0275\u0275nextContext: qT, \u0275\u0275namespaceHTML: Iu, \u0275\u0275namespaceMathML: Eu, \u0275\u0275namespaceSVG: yu, \u0275\u0275enableBindings: iu, \u0275\u0275disableBindings: su, \u0275\u0275elementStart: Ci, \u0275\u0275elementEnd: $c, \u0275\u0275element: qp, \u0275\u0275foreignComponent: DT, \u0275\u0275foreignContent: CT, \u0275\u0275foreignContentFn: wT, \u0275\u0275elementContainerStart: Wc, \u0275\u0275elementContainerEnd: Xi, \u0275\u0275domElement: Wp, \u0275\u0275domElementStart: Gc, \u0275\u0275domElementEnd: qc, \u0275\u0275domElementContainer: Yp, \u0275\u0275domElementContainerStart: zc, \u0275\u0275domElementContainerEnd: Zp, \u0275\u0275domTemplate: Op, \u0275\u0275domListener: sh, \u0275\u0275elementContainer: Qp, \u0275\u0275pureFunction0: zC, \u0275\u0275pureFunction1: QC, \u0275\u0275pureFunction2: ZC, \u0275\u0275pureFunction3: YC, \u0275\u0275pureFunction4: KC, \u0275\u0275pureFunction5: JC, \u0275\u0275pureFunction6: XC, \u0275\u0275pureFunction7: ew, \u0275\u0275pureFunction8: tw, \u0275\u0275pureFunctionV: nw, \u0275\u0275getCurrentView: MT, \u0275\u0275restoreView: cu, \u0275\u0275listener: rh, \u0275\u0275projection: zT, \u0275\u0275syntheticHostProperty: Xp, \u0275\u0275syntheticHostListener: ih, \u0275\u0275pipeBind1: lw, \u0275\u0275pipeBind2: uw, \u0275\u0275pipeBind3: dw, \u0275\u0275pipeBind4: fw, \u0275\u0275pipeBindV: pw, \u0275\u0275projectionDef: WT, \u0275\u0275domProperty: Jp, \u0275\u0275ariaProperty: Up, \u0275\u0275property: Gp, \u0275\u0275control: CI, \u0275\u0275controlCreate: DI, \u0275\u0275pipe: cw, \u0275\u0275queryRefresh: QT, \u0275\u0275queryAdvance: YT, \u0275\u0275viewQuery: lh, \u0275\u0275viewQuerySignal: dh, \u0275\u0275loadQuery: ZT, \u0275\u0275contentQuery: ch, \u0275\u0275contentQuerySignal: uh, \u0275\u0275reference: KT, \u0275\u0275classMap: oC, \u0275\u0275styleMap: nC, \u0275\u0275styleProp: fh, \u0275\u0275classProp: ph, \u0275\u0275advance: SE, \u0275\u0275template: kp, \u0275\u0275conditional: uT, \u0275\u0275conditionalCreate: lT, \u0275\u0275conditionalBranchCreate: Uc, \u0275\u0275defer: VD, \u0275\u0275deferWhen: HD, \u0275\u0275deferOnIdle: GD, \u0275\u0275deferOnImmediate: zD, \u0275\u0275deferOnTimer: YD, \u0275\u0275deferOnHover: XD, \u0275\u0275deferOnInteraction: nT, \u0275\u0275deferOnViewport: iT, \u0275\u0275deferPrefetchWhen: BD, \u0275\u0275deferPrefetchOnIdle: qD, \u0275\u0275deferPrefetchOnImmediate: QD, \u0275\u0275deferPrefetchOnTimer: KD, \u0275\u0275deferPrefetchOnHover: eT, \u0275\u0275deferPrefetchOnInteraction: oT, \u0275\u0275deferPrefetchOnViewport: sT, \u0275\u0275deferHydrateWhen: UD, \u0275\u0275deferHydrateNever: $D, \u0275\u0275deferHydrateOnIdle: WD, \u0275\u0275deferHydrateOnImmediate: ZD, \u0275\u0275deferHydrateOnTimer: JD, \u0275\u0275deferHydrateOnHover: tT, \u0275\u0275deferHydrateOnInteraction: rT, \u0275\u0275deferHydrateOnViewport: aT, \u0275\u0275deferEnableTimerScheduling: wD, \u0275\u0275enableIncrementalHydrationRuntime: WC, \u0275\u0275repeater: hT, \u0275\u0275repeaterCreate: pT, \u0275\u0275repeaterTrackByIndex: dT, \u0275\u0275repeaterTrackByIdentity: fT, \u0275\u0275componentInstance: cT, \u0275\u0275text: dC, \u0275\u0275textInterpolate: hh, \u0275\u0275textInterpolate1: Qc, \u0275\u0275textInterpolate2: gh, \u0275\u0275textInterpolate3: mh, \u0275\u0275textInterpolate4: vh, \u0275\u0275textInterpolate5: yh, \u0275\u0275textInterpolate6: Eh, \u0275\u0275textInterpolate7: Ih, \u0275\u0275textInterpolate8: Dh, \u0275\u0275textInterpolateV: Th, \u0275\u0275i18n: BT, \u0275\u0275i18nAttributes: UT, \u0275\u0275i18nExp: oh, \u0275\u0275i18nStart: th, \u0275\u0275i18nEnd: nh, \u0275\u0275i18nApply: $T, \u0275\u0275i18nPostprocess: GT, \u0275\u0275resolveWindow: oE, \u0275\u0275resolveDocument: rE, \u0275\u0275resolveBody: $f, \u0275\u0275setComponentScope: $C, \u0275\u0275setNgModuleScope: GC, \u0275\u0275registerNgModuleType: Ap, \u0275\u0275getComponentDepsFactory: gw, \u0275setClassDebugInfo: mw, \u0275\u0275declareLet: Mh, \u0275\u0275storeLet: MC, \u0275\u0275arrowFunction: jC, \u0275\u0275readContextLet: NC, \u0275\u0275attachSourceLocations: SC, \u0275\u0275interpolate: _C, \u0275\u0275interpolate1: bC, \u0275\u0275interpolate2: AC, \u0275\u0275interpolate3: RC, \u0275\u0275interpolate4: xC, \u0275\u0275interpolate5: kC, \u0275\u0275interpolate6: OC, \u0275\u0275interpolate7: LC, \u0275\u0275interpolate8: PC, \u0275\u0275interpolateV: FC, \u0275\u0275sanitizeHtml: jf, \u0275\u0275sanitizeStyle: Vf, \u0275\u0275sanitizeResourceUrl: cc, \u0275\u0275sanitizeScript: Bf, \u0275\u0275validateAttribute: Uf, \u0275\u0275sanitizeUrl: Hf, \u0275\u0275sanitizeUrlOrResourceUrl: eE, \u0275\u0275trustConstantHtml: Jy, \u0275\u0275trustConstantResourceUrl: Xy, forwardRef: Cr, resolveForwardRef: j, \u0275\u0275twoWayProperty: Ch, \u0275\u0275twoWayBindingSet: CC, \u0275\u0275twoWayListener: wh, \u0275\u0275replaceMetadata: yw, \u0275\u0275getReplaceMetadataURL: vw }, Oo = null;
function Ew(e) { Oo !== null && (e.defaultEncapsulation !== Oo.defaultEncapsulation || e.preserveWhitespaces !== Oo.preserveWhitespaces) || (Oo = e); }
function UL() { return Oo; }
function $L() { Oo = null; }
var ai = [];
function GL(e, t) { ai.push({ moduleType: e, ngModule: t }); }
var Yu = !1;
function Iw() { if (!Yu) {
    Yu = !0;
    try {
        for (let e = ai.length - 1; e >= 0; e--) {
            let { moduleType: t, ngModule: n } = ai[e];
            n.declarations && n.declarations.every(Dw) && (ai.splice(e, 1), ZL(t, n));
        }
    }
    finally {
        Yu = !1;
    }
} }
function Dw(e) { return Array.isArray(e) ? e.every(Dw) : !!j(e); }
function Tw(e, t = {}) { Cw(e, t), t.id !== void 0 && Ap(e, t.id), GL(e, t); }
function Cw(e, t, n = !1) { let o = rt(t.declarations || V), r = null; Object.defineProperty(e, Cs, { configurable: !0, get: () => (r === null && (r = te({ usage: 0, kind: "NgModule", type: e }).compileNgModule(Ie, `ng:///${e.name}/\u0275mod.js`, { type: e, bootstrap: rt(t.bootstrap || V).map(j), declarations: o.map(j), imports: rt(t.imports || V).map(j).map(Dv), exports: rt(t.exports || V).map(j).map(Dv), schemas: t.schemas ? rt(t.schemas) : null, id: t.id || null }), r.schemas || (r.schemas = [])), r) }); let i = null; Object.defineProperty(e, Ge, { get: () => { if (i === null) {
        let a = te({ usage: 0, kind: "NgModule", type: e });
        i = a.compileFactory(Ie, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, deps: Ai(e), target: a.FactoryTarget.NgModule, typeArgumentCount: 0 });
    } return i; }, configurable: !1 }); let s = null; Object.defineProperty(e, gr, { get: () => { if (s === null) {
        let a = { name: e.name, type: e, providers: t.providers || V, imports: [(t.imports || V).map(j), (t.exports || V).map(j)] };
        s = te({ usage: 0, kind: "NgModule", type: e }).compileInjector(Ie, `ng:///${e.name}/\u0275inj.js`, a);
    } return s; }, configurable: !1 }); }
function qL(e, t) { let n = `Unexpected "${ze(e)}" found in the "declarations" array of the`, o = `"${ze(e)}" is marked as standalone and can't be declared in any NgModule - did you intend to import it instead (by adding it to the "imports" array)?`; return `${n} ${t}, ${o}`; }
var WL = new WeakMap, zL = new WeakMap;
function QL() { WL = new WeakMap, zL = new WeakMap, ai.length = 0, Ux.clear(); }
function ZL(e, t) { let n = rt(t.declarations || V), o = Ah(e); n.forEach(r => { if (r = j(r), r.hasOwnProperty(At)) {
    let s = Q(r);
    bh(s, o);
}
else
    !r.hasOwnProperty(An) && !r.hasOwnProperty(Sr) && (r.ngSelectorScope = e); }); }
function bh(e, t) { e.directiveDefs = () => Array.from(t.compilation.directives).map(n => n.hasOwnProperty(At) ? Q(n) : Pe(n)).filter(n => !!n), e.pipeDefs = () => Array.from(t.compilation.pipes).map(n => ot(n)), e.schemas = t.schemas, e.tView = null; }
function Ah(e) { if (jn(e)) {
    let t = Uo.getNgModuleScope(e), n = ws(e);
    return F({ schemas: n.schemas || null }, t);
}
else if (_r(e)) {
    if ((Q(e) || Pe(e)) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set([e]), pipes: new Set } };
    if (ot(e) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set, pipes: new Set([e]) } };
} throw new Error(`${e.name} does not have a module def (\u0275mod property)`); }
function Dv(e) { return fp(e) ? e.ngModule : e; }
var Ku = 0;
function ww(e, t) {
    let n = null;
    qx(e, t), Nw(e, t), Object.defineProperty(e, At, { get: () => {
            if (n === null) {
                let o = te({ usage: 0, kind: "component", type: e });
                if (iD(t)) {
                    let u = [`Component '${e.name}' is not resolved:`];
                    throw t.templateUrl && u.push(` - templateUrl: ${t.templateUrl}`), t.styleUrls && t.styleUrls.length && u.push(` - styleUrls: ${JSON.stringify(t.styleUrls)}`), t.styleUrl && u.push(` - styleUrl: ${t.styleUrl}`), u.push("Did you run and wait for 'resolveComponentResources()'?"), new Error(u.join(`
`));
                }
                let r = UL(), i = t.preserveWhitespaces;
                i === void 0 && (r !== null && r.preserveWhitespaces !== void 0 ? i = r.preserveWhitespaces : i = !1);
                let s = t.encapsulation;
                s === void 0 && (r !== null && r.defaultEncapsulation !== void 0 ? s = r.defaultEncapsulation : s = Xe.Emulated);
                let a = t.templateUrl || `ng:///${e.name}/template.html`, c = Sw(e, t), l = ne(F({}, c), { typeSourceSpan: o.createParseSourceSpan("Component", e.name, a), template: t.template || "", preserveWhitespaces: i, styles: typeof t.styles == "string" ? [t.styles] : t.styles || V, animations: t.animations, declarations: [], changeDetection: t.changeDetection, encapsulation: s, viewProviders: t.viewProviders || null, hasDirectiveDependencies: !c.isStandalone || t.imports != null && t.imports.length > 0 });
                Ku++;
                try {
                    if (l.usesInheritance && _w(e), n = o.compileComponent(Ie, a, l), l.isStandalone) {
                        let u = rt(t.imports || V), { directiveDefs: d, pipeDefs: f } = YL(e, u);
                        n.directiveDefs = d, n.pipeDefs = f, n.dependencies = () => u.map(j);
                    }
                }
                finally {
                    Ku--;
                }
                if (Ku === 0 && Iw(), KL(e)) {
                    let u = Ah(e.ngSelectorScope);
                    bh(n, u);
                }
                if (t.schemas)
                    if (l.isStandalone)
                        n.schemas = t.schemas;
                    else
                        throw new Error(`The 'schemas' was specified for the ${ze(e)} but is only valid on a component that is standalone.`);
                else
                    l.isStandalone && (n.schemas = []);
            }
            return n;
        }, set: o => { n = o; }, configurable: !1 });
}
function YL(e, t) { return { directiveDefs: () => Jr(e) ? [...Uo.getStandaloneComponentScope(e, t).compilation.directives].map(i => Q(i) || Pe(i)).filter(i => i !== null) : [], pipeDefs: () => Jr(e) ? [...Uo.getStandaloneComponentScope(e, t).compilation.pipes].map(i => ot(i)).filter(i => i !== null) : [] }; }
function KL(e) { return e.ngSelectorScope !== void 0; }
function Rh(e, t) { let n = null; Nw(e, t || {}), Object.defineProperty(e, An, { get: () => { if (n === null) {
        let o = Mw(e, t || {});
        n = te({ usage: 0, kind: "directive", type: e }).compileDirective(Ie, o.sourceMapUrl, o.metadata);
    } return n; }, configurable: !1 }); }
function Mw(e, t) { let n = e && e.name, o = `ng:///${n}/\u0275dir.js`, r = te({ usage: 0, kind: "directive", type: e }), i = Sw(e, t); return i.typeSourceSpan = r.createParseSourceSpan("Directive", n, o), i.usesInheritance && _w(e), { metadata: i, sourceMapUrl: o }; }
function Nw(e, t) { let n = null; Object.defineProperty(e, Ge, { get: () => { if (n === null) {
        let o = Mw(e, t), r = te({ usage: 0, kind: "directive", type: e });
        n = r.compileFactory(Ie, `ng:///${e.name}/\u0275fac.js`, { name: o.metadata.name, type: o.metadata.type, typeArgumentCount: 0, deps: Ai(e), target: r.FactoryTarget.Directive });
    } return n; }, configurable: !1 }); }
function JL(e) { return Object.getPrototypeOf(e.prototype) === Object.prototype; }
function Sw(e, t) { let n = gf(), o = n.ownPropMetadata(e); return { name: e.name, legacyOptionalChaining: !1, type: e, selector: t.selector !== void 0 ? t.selector : null, host: t.host || Rt, propMetadata: o, inputs: t.inputs || V, outputs: t.outputs || V, queries: Tv(e, o, bw), lifecycle: { usesOnChanges: n.hasLifecycleHook(e, "ngOnChanges") }, controlCreate: n.hasLifecycleHook(e, "\u0275ngControlCreate") ? { passThroughInput: null } : null, typeSourceSpan: null, usesInheritance: !JL(e), exportAs: tP(t.exportAs), providers: t.providers || null, viewQueries: Tv(e, o, Aw), isStandalone: t.standalone === void 0 ? !0 : !!t.standalone, isSignal: !!t.signals, hostDirectives: t.hostDirectives?.map(r => typeof r == "function" ? { directive: r } : r) || null }; }
function _w(e) { let t = Object.prototype, n = Object.getPrototypeOf(e.prototype).constructor; for (; n && n !== t;)
    !Pe(n) && !Q(n) && oP(n) && Rh(n, null), n = Object.getPrototypeOf(n); }
function XL(e) { return typeof e == "string" ? xw(e) : j(e); }
function eP(e, t) { return { propertyName: e, predicate: XL(t.selector), descendants: t.descendants, first: t.first, read: t.read ? t.read : null, static: !!t.static, emitDistinctChangesOnly: !!t.emitDistinctChangesOnly, isSignal: !!t.isSignal }; }
function Tv(e, t, n) { let o = [], r = []; for (let i in t)
    if (t.hasOwnProperty(i)) {
        let s = t[i];
        s.forEach(a => { if (n(a)) {
            if (!a.selector)
                throw new Error(`Can't construct a query for the property "${i}" of "${ze(e)}" since the query selector wasn't defined.`);
            if (s.some(Rw))
                throw new Error("Cannot combine @Input decorators with query decorators");
            let c = eP(i, a);
            c.isSignal ? o.push(c) : r.push(c);
        } });
    } return [...o, ...r]; }
function tP(e) { return e === void 0 ? null : xw(e); }
function bw(e) { let t = e.ngMetadataName; return t === "ContentChild" || t === "ContentChildren"; }
function Aw(e) { let t = e.ngMetadataName; return t === "ViewChild" || t === "ViewChildren"; }
function Rw(e) { return e.ngMetadataName === "Input"; }
function xw(e) { return e.split(",").map(t => t.trim()); }
var nP = ["ngOnChanges", "ngOnInit", "ngOnDestroy", "ngDoCheck", "ngAfterViewInit", "ngAfterViewChecked", "ngAfterContentInit", "ngAfterContentChecked"];
function oP(e) { let t = gf(); if (nP.some(o => t.hasLifecycleHook(e, o)))
    return !0; let n = t.propMetadata(e); for (let o in n) {
    let r = n[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i], a = s.ngMetadataName;
        if (Rw(s) || bw(s) || Aw(s) || a === "Output" || a === "HostBinding" || a === "HostListener")
            return !0;
    }
} return !1; }
function kw(e, t) { let n = null, o = null; Object.defineProperty(e, Ge, { get: () => { if (o === null) {
        let r = Cv(e, t), i = te({ usage: 0, kind: "pipe", type: r.type });
        o = i.compileFactory(Ie, `ng:///${r.name}/\u0275fac.js`, { name: r.name, type: r.type, typeArgumentCount: 0, deps: Ai(e), target: i.FactoryTarget.Pipe });
    } return o; }, configurable: !1 }), Object.defineProperty(e, Sr, { get: () => { if (n === null) {
        let r = Cv(e, t);
        n = te({ usage: 0, kind: "pipe", type: r.type }).compilePipe(Ie, `ng:///${r.name}/\u0275pipe.js`, r);
    } return n; }, configurable: !1 }); }
function Cv(e, t) { return { type: e, name: e.name, pipeName: t.name, pure: t.pure !== void 0 ? t.pure : !0, isStandalone: t.standalone === void 0 ? !0 : !!t.standalone }; }
var Ow = zo("Directive", (e = {}) => e, void 0, void 0, (e, t) => Rh(e, t)), rP = zo("Component", (e = {}) => F({ changeDetection: Qa.Eager }, e), Ow, void 0, (e, t) => ww(e, t)), iP = zo("Pipe", e => F({ pure: !0 }, e), void 0, void 0, (e, t) => kw(e, t)), sP = Bt("Input", e => e ? typeof e == "string" ? { alias: e } : e : {}), aP = Bt("Output", e => ({ alias: e })), cP = Bt("HostBinding", e => ({ hostPropertyName: e })), lP = Bt("HostListener", (e, t) => ({ eventName: e, args: t })), uP = zo("NgModule", e => e, void 0, void 0, (e, t) => Tw(e, t));
var Lw = (() => { class e {
    applicationErrorHandler = E(kt);
    appRef = E(Ue);
    taskService = E(yt);
    ngZone = E(W);
    zonelessEnabled = E(Mo);
    tracing = E(oo, { optional: !0 });
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new gS;
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(yr) : null;
    scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (E(Gs, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() { this.subscriptions.add(this.appRef.afterTick.subscribe(() => { let n = this.taskService.add(); if (!this.runningTick && (this.cleanup(), !this.zonelessEnabled || this.appRef.includeAllTestViews)) {
        this.taskService.remove(n);
        return;
    } this.switchToMicrotaskScheduler(), this.taskService.remove(n); })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => { this.runningTick || this.cleanup(); })); }
    switchToMicrotaskScheduler() { this.ngZone.runOutsideAngular(() => { let n = this.taskService.add(); this.useMicrotaskScheduler = !0, queueMicrotask(() => { this.useMicrotaskScheduler = !1, this.taskService.remove(n); }); }); }
    notify(n) { if (!this.zonelessEnabled && n === 5)
        return; switch (n) {
        case 0:
        case 2: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 3:
        case 4:
        case 5:
        case 1: {
            this.appRef.dirtyFlags |= 4;
            break;
        }
        case 6: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 12: {
            this.appRef.dirtyFlags |= 16;
            break;
        }
        case 13: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 11: break;
        default: this.appRef.dirtyFlags |= 8;
    } if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick())
        return; let o = this.useMicrotaskScheduler ? em : wu; this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick())); }
    shouldScheduleTick() { return !(this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(yr + this.angularZoneId)); }
    tick() { if (this.runningTick || this.appRef.destroyed)
        return; if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
    } !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1); let n = this.taskService.add(); try {
        this.ngZone.run(() => { this.runningTick = !0, this.appRef._tick(); }, void 0, this.schedulerTickApplyArgs);
    }
    catch (o) {
        this.applicationErrorHandler(o);
    }
    finally {
        this.taskService.remove(n), this.cleanup();
    } }
    ngOnDestroy() { this.subscriptions.unsubscribe(), this.cleanup(); }
    cleanup() { if (this.runningTick = !1, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
        let n = this.pendingRenderTaskId;
        this.pendingRenderTaskId = null, this.taskService.remove(n);
    } }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })();
function dP() { return re("NgZoneless"), je([...Yc(), []]); }
function Yc() { return [{ provide: We, useExisting: Lw }, { provide: W, useClass: Er }, { provide: Mo, useValue: !0 }]; }
var fP = (() => { class e {
    compileModuleSync(n) { return new Go(n); }
    compileModuleAsync(n) { return Promise.resolve(this.compileModuleSync(n)); }
    clearCache() { }
    clearCacheFor(n) { }
    getModuleId(n) { }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })(), Pw = new C(""), lf = class {
};
function pP() { return typeof ngI18nClosureMode < "u" && ngI18nClosureMode && typeof goog < "u" && goog.LOCALE !== "en" ? goog.LOCALE : typeof $localize < "u" && $localize.locale || es; }
var xh = new C("", { factory: () => E(xh, { optional: !0, skipSelf: !0 }) || pP() }), hP = new C("", { factory: () => bO }), gP = new C(""), mP = new C(""), Fw = (function (e) { return e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Ignore = 2] = "Ignore", e; })(Fw || {});
function ha(e, t) { let n = e[m]; for (let o = I; o < n.bindingStartIndex; o++)
    if (X(e[o])) {
        let r = e[o];
        if (!(o === n.bindingStartIndex - 1)) {
            let s = n.data[o], a = ge(n, s);
            if (yD(a)) {
                t.push({ lContainer: r, lView: e, tNode: s, tDetails: a });
                continue;
            }
        }
        ee(r[$]) && ha(r[$], t);
        for (let s = L; s < r.length; s++)
            ha(r[s], t);
    }
    else
        ee(e[o]) && ha(e[o], t); }
var uf = class {
    name;
    callback;
    constructor(t, n) { this.name = t, this.callback = n; }
};
function vP(e) { return e.map(t => t.nativeElement); }
var Si = class {
    nativeNode;
    constructor(t) { this.nativeNode = t; }
    get parent() { let t = this.nativeNode.parentNode; return t ? new Xn(t) : null; }
    get injector() { return yf(this.nativeNode); }
    get componentInstance() { let t = this.nativeNode; return t && (vm(t) || v_(t)); }
    get context() { return vm(this.nativeNode) || m_(this.nativeNode); }
    get listeners() { return T_(this.nativeNode).filter(t => t.type === "dom"); }
    get references() { return I_(this.nativeNode); }
    get providerTokens() { return y_(this.nativeNode); }
}, Xn = class extends Si {
    constructor(t) { super(t); }
    get nativeElement() { return this.nativeNode.nodeType == Node.ELEMENT_NODE ? this.nativeNode : null; }
    get name() { let t = _e(this.nativeNode), n = t ? t.lView : null; return n !== null ? n[m].data[t.nodeIndex].value : this.nativeNode.nodeName; }
    get properties() { let t = _e(this.nativeNode), n = t ? t.lView : null; if (n === null)
        return {}; let o = n[m].data, r = o[t.nodeIndex], i = {}; return yP(this.nativeElement, i), IP(i, r, n, o), i; }
    get attributes() { let t = {}, n = this.nativeElement; if (!n)
        return t; let o = _e(n), r = o ? o.lView : null; if (r === null)
        return {}; let i = r[m].data[o.nodeIndex].attrs, s = []; if (i) {
        let a = 0;
        for (; a < i.length;) {
            let c = i[a];
            if (typeof c != "string")
                break;
            let l = i[a + 1];
            t[c] = l, s.push(c.toLowerCase()), a += 2;
        }
    } for (let a of n.attributes)
        s.includes(a.name) || (t[a.name] = a.value); return t; }
    get styles() { return this.nativeElement?.style ?? {}; }
    get classes() { let t = {}, o = this.nativeElement.className; return (typeof o != "string" ? o.baseVal.split(" ") : o.split(" ")).forEach(i => t[i] = !0), t; }
    get childNodes() { let t = this.nativeNode.childNodes, n = []; for (let o = 0; o < t.length; o++) {
        let r = t[o];
        n.push(_i(r));
    } return n; }
    get children() { let t = this.nativeElement; if (!t)
        return []; let n = t.children, o = []; for (let r = 0; r < n.length; r++) {
        let i = n[r];
        o.push(_i(i));
    } return o; }
    query(t) { return this.queryAll(t)[0] || null; }
    queryAll(t) { let n = []; return wv(this, t, n, !0), n; }
    queryAllNodes(t) { let n = []; return wv(this, t, n, !1), n; }
    triggerEventHandler(t, n) { let o = this.nativeNode, r = []; this.listeners.forEach(i => { if (i.name === t) {
        let s = i.callback;
        s.call(o, n), r.push(s);
    } }), typeof o.eventListeners == "function" && o.eventListeners(t).forEach(i => { if (i.toString().indexOf("__ngUnwrap__") !== -1) {
        let s = i("__ngUnwrap__");
        return r.indexOf(s) === -1 && s.call(o, n);
    } }); }
};
function yP(e, t) { if (e) {
    let n = Object.getPrototypeOf(e), o = Node.prototype;
    for (; n !== null && n !== o;) {
        let r = Object.getOwnPropertyDescriptors(n);
        for (let i in r)
            if (!i.startsWith("__") && !i.startsWith("on")) {
                let s = e[i];
                EP(s) && (t[i] = s);
            }
        n = Object.getPrototypeOf(n);
    }
} }
function EP(e) { return typeof e == "string" || typeof e == "boolean" || typeof e == "number" || e === null; }
function wv(e, t, n, o) { let r = _e(e.nativeNode), i = r ? r.lView : null; if (i !== null) {
    let s = i[m].data[r.nodeIndex];
    Vn(s, i, t, n, o, e.nativeNode);
}
else
    kh(e.nativeNode, t, n, o); }
function Vn(e, t, n, o, r, i) { let s = jg(e, t); if (e.type & 11) {
    if (Ju(s, n, o, r, i), Ne(e)) {
        let c = ye(e.index, t);
        c && c[m].firstChild && Vn(c[m].firstChild, c, n, o, r, i);
    }
    else
        e.child && Vn(e.child, t, n, o, r, i), s && kh(s, n, o, r);
    let a = t[e.index];
    X(a) && Mv(a, n, o, r, i);
}
else if (e.type & 4) {
    let a = t[e.index];
    Ju(a[ht], n, o, r, i), Mv(a, n, o, r, i);
}
else if (e.type & 16) {
    let a = t[ce], l = a[ae].projection[e.projection];
    if (Array.isArray(l))
        for (let u of l)
            Ju(u, n, o, r, i);
    else if (l) {
        let u = a[z], d = u[m].data[l.index];
        Vn(d, u, n, o, r, i);
    }
}
else
    e.child && Vn(e.child, t, n, o, r, i); if (i !== s) {
    let a = e.flags & 2 ? e.projectionNext : e.next;
    a && Vn(a, t, n, o, r, i);
} }
function Mv(e, t, n, o, r) { for (let i = L; i < e.length; i++) {
    let s = e[i], a = s[m].firstChild;
    a && Vn(a, s, t, n, o, r);
} }
function Ju(e, t, n, o, r) { if (r !== e) {
    let i = _i(e);
    if (!i)
        return;
    (o && i instanceof Xn && t(i) && n.indexOf(i) === -1 || !o && t(i) && n.indexOf(i) === -1) && n.push(i);
} }
function kh(e, t, n, o) { let r = e.childNodes, i = r.length; for (let s = 0; s < i; s++) {
    let a = r[s], c = _i(a);
    c && ((o && c instanceof Xn && t(c) && n.indexOf(c) === -1 || !o && t(c) && n.indexOf(c) === -1) && n.push(c), kh(a, t, n, o));
} }
function IP(e, t, n, o) { let r = t.propertyBindings; if (r !== null)
    for (let i = 0; i < r.length; i++) {
        let s = r[i], c = o[s].split(Fb), l = c[0];
        if (c.length > 1) {
            let u = c[1];
            for (let d = 1; d < c.length - 1; d++)
                u += A(n[s + d - 1]) + c[d + 1];
            e[l] = u;
        }
        else
            e[l] = n[s];
    } }
var Xu = "__ng_debug__";
function _i(e) { return e instanceof Node ? (e.hasOwnProperty(Xu) || (e[Xu] = e.nodeType == Node.ELEMENT_NODE ? new Xn(e) : new Si(e)), e[Xu]) : null; }
function Oh(e, t, n) { let o = Object.create(DP); o.source = e, o.computation = t, n != null && (o.equal = n); let i = () => { if (co(o), Yt(o), o.value === dt)
    throw o.error; return o.value; }; return i[K] = o, ds(o), i; }
function Lh(e, t) { co(e), Mn(e, t), dr(e); }
function jw(e, t) { if (co(e), e.value === dt)
    throw e.error; El(e, t), dr(e); }
var DP = ne(F({}, Zt), { value: Cn, dirty: !0, error: null, equal: fs, kind: "linkedSignal", producerMustRecompute(e) { return e.value === Cn || e.value === wn; }, producerRecomputeValue(e) { if (e.value === wn)
        throw new Error(""); let t = e.value; e.value = wn; let n = Mt(e), o, r = !1; try {
        let i = e.source(), s = t !== Cn && t !== dt, a = s ? { source: e.sourceValue, value: t } : void 0;
        o = e.computation(i, a), e.sourceValue = i, R(null), r = s && o !== dt && e.equal(t, o);
    }
    catch (i) {
        o = dt, e.error = i;
    }
    finally {
        Kt(e, n);
    } if (r) {
        e.value = t;
        return;
    } e.value = o, e.version++; } });
function Vw(e) { let t = R(null); try {
    return e();
}
finally {
    R(t);
} }
var os = class {
    destroyed = !1;
    listeners = null;
    errorHandler = E(bt, { optional: !0 });
    isEmitting = !1;
    hasNullListeners = !1;
    destroyRef = E(De);
    constructor() { this.destroyRef.onDestroy(() => { this.destroyed = !0, this.listeners = null; }); }
    subscribe(t) { if (this.destroyed)
        throw new T(953, !1); return (this.listeners ??= []).push(t), { unsubscribe: () => { let n = this.listeners ? this.listeners.indexOf(t) : -1; n > -1 && (this.isEmitting ? (this.hasNullListeners = !0, this.listeners[n] = null) : this.listeners.splice(n, 1)); } }; }
    emit(t) { if (this.destroyed) {
        console.warn(Dr(953, !1));
        return;
    } if (this.listeners === null)
        return; this.isEmitting = !0; let n = R(null); try {
        for (let o of this.listeners)
            try {
                o !== null && o(t);
            }
            catch (r) {
                this.errorHandler?.handleError(r);
            }
    }
    finally {
        this.hasNullListeners && (this.hasNullListeners = !1, this.listeners && TP(this.listeners)), R(n), this.isEmitting = !1;
    } }
};
function TP(e) { let t = e.length - 1; for (; t > -1;)
    e[t] === null && e.splice(t, 1), t--; }
function CP(e) { return e.destroyRef; }
var $w = new C("");
function Le(e, t) { return ps(e, t?.equal); }
function Re(e) { return Vw(e); }
var Kc = class extends Error {
    dependency;
    constructor(t) { super("Dependency error", { cause: t.error() }), this.name = "ResourceDependencyError", this.dependency = t; }
}, ro = class e extends Error {
    _brand;
    constructor(t) { super(t); }
    static IDLE = new e("IDLE");
    static LOADING = new e("LOADING");
}, wP = e => e;
function Jc(e, t) { if (typeof e == "function") {
    let n = Oh(e, wP, t?.equal);
    return Hw(n, t?.debugName, t?.set);
}
else {
    let n = Oh(e.source, e.computation, e.equal);
    return Hw(n, e.debugName, e.set);
} }
function Hw(e, t, n) { let o = e[K], r = e; if (n !== void 0) {
    let i = s => Lh(o, s);
    r.set = s => n(s, i), r.update = s => n(s(Re(e)), i);
}
else
    r.set = i => Lh(o, i), r.update = i => jw(o, i); return r.asReadonly = Co.bind(e), r; }
function MP(e) { let t = e.request, n = e.params ?? t ?? (() => null); return new Xc(n, SP(e), e.defaultValue, e.equal ? NP(e.equal) : void 0, e.debugName, e.injector ?? E(se), e.id); }
var Ph = class {
    value;
    isLoading;
    constructor(t, n) { this.value = t, this.value.set = this.set.bind(this), this.value.update = this.update.bind(this), this.value.asReadonly = Co, this.isLoading = Le(() => this.status() === "loading" || this.status() === "reloading", void 0); }
    isError = Le(() => this.status() === "error");
    update(t) { this.set(t(Re(this.value))); }
    isValueDefined = Le(() => this.isError() ? !1 : this.value() !== void 0);
    _snapshot;
    get snapshot() { return this._snapshot ??= Le(() => { let t = this.status(); return t === "error" ? { status: "error", error: this.error() } : { status: t, value: this.value() }; }); }
    hasValue() { return this.isValueDefined(); }
    asReadonly() { return this; }
}, Xc = class extends Ph {
    loaderFn;
    equal;
    debugName;
    transferCacheKey;
    pendingTasks;
    state;
    extRequest;
    effectRef;
    pendingController;
    resolvePendingTask = void 0;
    destroyed = !1;
    unregisterOnDestroy;
    status;
    error;
    transferState;
    constructor(t, n, o, r, i, s, a, c) { if (jh())
        throw Vh(); super(Le(() => { let u = this.state().stream?.(); if (!u || this.state().status === "loading" && this.error())
        return o; if (!el(u))
        throw new rs(this.error()); return u.value; }, { equal: r }), i), this.loaderFn = n, this.equal = r, this.debugName = i, this.transferCacheKey = a; let l = s.get($w, void 0, { optional: !0 }) ?? { isActive: !1 }; this.transferState = s.get(Ot, void 0, { optional: !0 }) ?? void 0, this.extRequest = Jc(() => { try {
        return io(!0), { request: t(AP), reload: 0 };
    }
    catch (u) {
        return is(u), u === ro.IDLE ? { status: "idle", reload: 0 } : u === ro.LOADING ? { status: "loading", reload: 0 } : { error: u, reload: 0 };
    }
    finally {
        io(!1);
    } }, void 0), this.state = Jc({ source: this.extRequest, computation: (u, d) => { let { request: f, status: p, error: h } = u, v; if (h)
            p = "resolved", v = Et({ error: tl(h) }, void 0);
        else if (!p)
            if (d)
                p = f === void 0 ? "idle" : "loading", d.value.extRequest.request === f && (v = d.value.stream);
            else {
                let y = this.transferState, D = this.transferCacheKey;
                l.isActive && D && y && f !== void 0 && y.hasKey(D) && (v = Et({ value: y.get(D, o) }, void 0)), v || (v = c?.(u.request)), c = void 0, p = f === void 0 ? "idle" : v ? "resolved" : "loading";
            } return { extRequest: u, status: p, previousStatus: d ? Uw(d.value) : "idle", stream: v }; } }), this.effectRef = Ws(this.loadEffect.bind(this), { injector: s, manualCleanup: !0 }), this.pendingTasks = s.get(qr), this.unregisterOnDestroy = s.get(De).onDestroy(() => this.destroy()), this.status = Le(() => Uw(this.state()), void 0), this.error = Le(() => { let u = this.state().stream?.(); return u && !el(u) ? u.error : void 0; }, void 0); }
    set(t) { if (this.destroyed)
        return; let n = Re(this.error), o = Re(this.state); if (!n) {
        let r = Re(this.value);
        if (o.status === "local" && (this.equal ? this.equal(r, t) : r === t))
            return;
    } this.state.set({ extRequest: o.extRequest, status: "local", previousStatus: "local", stream: Et({ value: t }, void 0) }), this.abortInProgressLoad(); }
    reload() { let { status: t } = Re(this.state); return t === "idle" || t === "loading" ? !1 : (this.extRequest.update(({ request: n, reload: o }) => ({ request: n, reload: o + 1 })), !0); }
    destroy() { this.destroyed = !0, this.unregisterOnDestroy(), this.effectRef.destroy(), this.abortInProgressLoad(), this.state.set({ extRequest: { request: void 0, reload: 0 }, status: "idle", previousStatus: "idle", stream: void 0 }); }
    loadEffect() { return Ce(this, null, function* () { let t = this.extRequest(), { status: n, previousStatus: o } = Re(this.state); if (t.request === void 0)
        return; if (n !== "loading")
        return; this.abortInProgressLoad(); let r = this.resolvePendingTask = this.pendingTasks.add(), { signal: i } = this.pendingController = new AbortController; try {
        let s = Re(() => this.loaderFn({ params: t.request, abortSignal: i, previous: { status: o } })), a = () => i.aborted || Re(this.extRequest) !== t;
        if (No(s)) {
            if (a())
                return;
            this.state.set({ extRequest: t, status: "resolved", previousStatus: "resolved", stream: s });
            let c = Re(s);
            typeof ngServerMode < "u" && ngServerMode && Bw(c, this.transferCacheKey, this.transferState);
        }
        else {
            let c = yield s;
            if (a())
                return;
            this.state.set({ extRequest: t, status: "resolved", previousStatus: "resolved", stream: c });
            let l = c ? Re(c) : void 0;
            typeof ngServerMode < "u" && ngServerMode && Bw(l, this.transferCacheKey, this.transferState);
        }
    }
    catch (s) {
        if (is(s), i.aborted || Re(this.extRequest) !== t)
            return;
        this.state.set({ extRequest: t, status: "resolved", previousStatus: "error", stream: Et({ error: tl(s) }, void 0) });
    }
    finally {
        r?.(), r = void 0;
    } }); }
    abortInProgressLoad() { Re(() => this.pendingController?.abort()), this.pendingController = void 0, this.resolvePendingTask?.(), this.resolvePendingTask = void 0; }
};
function Bw(e, t, n) { t && n && e && el(e) && n.set(t, e.value); }
function NP(e) { return (t, n) => t === void 0 || n === void 0 ? t === n : e(t, n); }
function SP(e) { return _P(e) ? e.stream : t => Ce(null, null, function* () { try {
    return Et({ value: yield e.loader(t) }, void 0);
}
catch (n) {
    return Et({ error: tl(n) }, void 0);
} }); }
function _P(e) { return !!e.stream; }
function Uw(e) { switch (e.status) {
    case "loading": return e.extRequest.reload === 0 ? "loading" : "reloading";
    case "resolved": return el(e.stream()) ? "resolved" : "error";
    default: return e.status;
} }
function el(e) { return e.error === void 0; }
function tl(e) { return bP(e) ? e : new Fh(e); }
function bP(e) { return e instanceof Error || typeof e == "object" && typeof e.name == "string" && typeof e.message == "string"; }
var rs = class extends Error {
    constructor(t) { super(t.message, { cause: t }); }
}, Fh = class extends Error {
    constructor(t) { super(String(t), { cause: t }); }
};
function Gw(e) { switch (e.status()) {
    case "idle": throw ro.IDLE;
    case "error": throw new Kc(e);
    case "loading":
    case "reloading": throw ro.LOADING;
} return e.value(); }
var AP = { chain: Gw }, qw = !1;
function jh() { return qw; }
function io(e) { qw = e; }
function Vh() { return new T(992, !1); }
function is(e) { if (e instanceof T && e.code === 992)
    throw e; }
import { Subscription as dF } from "rxjs";
var Gh = { JSACTION: "__jsaction", OWNER: "__owner" }, Zw = {};
function RP(e) { return e[Gh.JSACTION]; }
function Ww(e, t) { e[Gh.JSACTION] = t; }
function xP(e) { return Zw[e]; }
function kP(e, t) { Zw[e] = t; }
var N = { CLICK: "click", CLICKMOD: "clickmod", DBLCLICK: "dblclick", FOCUS: "focus", FOCUSIN: "focusin", BLUR: "blur", FOCUSOUT: "focusout", SUBMIT: "submit", KEYDOWN: "keydown", KEYPRESS: "keypress", KEYUP: "keyup", MOUSEOVER: "mouseover", MOUSEOUT: "mouseout", MOUSEENTER: "mouseenter", MOUSELEAVE: "mouseleave", POINTEROVER: "pointerover", POINTEROUT: "pointerout", POINTERENTER: "pointerenter", POINTERLEAVE: "pointerleave", ERROR: "error", LOAD: "load", TOUCHSTART: "touchstart", TOUCHEND: "touchend", TOUCHMOVE: "touchmove", TOGGLE: "toggle" }, OP = [N.MOUSEENTER, N.MOUSELEAVE, "pointerenter", "pointerleave"], LP = [N.CLICK, N.DBLCLICK, N.FOCUSIN, N.FOCUSOUT, N.KEYDOWN, N.KEYUP, N.KEYPRESS, N.MOUSEOVER, N.MOUSEOUT, N.SUBMIT, N.TOUCHSTART, N.TOUCHEND, N.TOUCHMOVE, "touchcancel", "auxclick", "change", "compositionstart", "compositionupdate", "compositionend", "beforeinput", "input", "select", "copy", "cut", "paste", "mousedown", "mouseup", "wheel", "contextmenu", "dragover", "dragenter", "dragleave", "drop", "dragstart", "dragend", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "gotpointercapture", "lostpointercapture", "ended", "loadedmetadata", "pagehide", "pageshow", "visibilitychange", "beforematch"], Yw = [N.FOCUS, N.BLUR, N.ERROR, N.LOAD, N.TOGGLE], al = e => Yw.indexOf(e) >= 0, PP = LP.concat(Yw), Kw = e => PP.indexOf(e) >= 0;
function FP(e) { return e === N.MOUSEENTER ? N.MOUSEOVER : e === N.MOUSELEAVE ? N.MOUSEOUT : e === N.POINTERENTER ? N.POINTEROVER : e === N.POINTERLEAVE ? N.POINTEROUT : e; }
function jP(e, t, n, o) { let r = !1; al(t) && (r = !0); let i = typeof o == "boolean" ? { capture: r, passive: o } : r; return e.addEventListener(t, n, i), { eventType: t, handler: n, capture: r, passive: o }; }
function VP(e, t) { if (e.removeEventListener) {
    let n = typeof t.passive == "boolean" ? { capture: t.capture } : t.capture;
    e.removeEventListener(t.eventType, t.handler, n);
}
else
    e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler); }
function HP(e) { e.preventDefault ? e.preventDefault() : e.returnValue = !1; }
var zw = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function BP(e) { return e.which === 2 || e.which == null && e.button === 4; }
function UP(e) { return zw && e.metaKey || !zw && e.ctrlKey || BP(e) || e.shiftKey; }
function $P(e, t, n) { let o = e.relatedTarget; return (e.type === N.MOUSEOVER && t === N.MOUSEENTER || e.type === N.MOUSEOUT && t === N.MOUSELEAVE || e.type === N.POINTEROVER && t === N.POINTERENTER || e.type === N.POINTEROUT && t === N.POINTERLEAVE) && (!o || o !== n && !n.contains(o)); }
function GP(e, t) { let n = {}; for (let o in e) {
    if (o === "srcElement" || o === "target")
        continue;
    let r = o, i = e[r];
    typeof i != "function" && (n[r] = i);
} return e.type === N.MOUSEOVER ? n.type = N.MOUSEENTER : e.type === N.MOUSEOUT ? n.type = N.MOUSELEAVE : e.type === N.POINTEROVER ? n.type = N.POINTERENTER : n.type = N.POINTERLEAVE, n.target = n.srcElement = t, n.bubbles = !1, n._originalEvent = e, n; }
var il = class {
    element;
    handlerInfos = [];
    constructor(t) { this.element = t; }
    addEventListener(t, n, o) { this.handlerInfos.push(jP(this.element, t, n(this.element), o)); }
    cleanUp() { for (let t = 0; t < this.handlerInfos.length; t++)
        VP(this.element, this.handlerInfos[t]); this.handlerInfos = []; }
}, qP = { EVENT_ACTION_SEPARATOR: ":" };
function In(e) { return e.eventType; }
function qh(e, t) { e.eventType = t; }
function ol(e) { return e.event; }
function Jw(e, t) { e.event = t; }
function Xw(e) { return e.targetElement; }
function eM(e, t) { e.targetElement = t; }
function tM(e) { return e.eic; }
function WP(e, t) { e.eic = t; }
function zP(e) { return e.timeStamp; }
function QP(e, t) { e.timeStamp = t; }
function rl(e) { return e.eia; }
function nM(e, t, n) { e.eia = [t, n]; }
function Hh(e) { e.eia = void 0; }
function nl(e) { return e[1]; }
function ZP(e) { return e.eirp; }
function oM(e, t) { e.eirp = t; }
function rM(e) { return e.eir; }
function iM(e, t) { e.eir = t; }
function sM(e) { return { eventType: e.eventType, event: e.event, targetElement: e.targetElement, eic: e.eic, eia: e.eia, timeStamp: e.timeStamp, eirp: e.eirp, eiack: e.eiack, eir: e.eir }; }
function YP(e, t, n, o, r, i, s, a) { return { eventType: e, event: t, targetElement: n, eic: o, timeStamp: r, eia: i, eirp: s, eiack: a }; }
var Bh = class e {
    eventInfo;
    constructor(t) { this.eventInfo = t; }
    getEventType() { return In(this.eventInfo); }
    setEventType(t) { qh(this.eventInfo, t); }
    getEvent() { return ol(this.eventInfo); }
    setEvent(t) { Jw(this.eventInfo, t); }
    getTargetElement() { return Xw(this.eventInfo); }
    setTargetElement(t) { eM(this.eventInfo, t); }
    getContainer() { return tM(this.eventInfo); }
    setContainer(t) { WP(this.eventInfo, t); }
    getTimestamp() { return zP(this.eventInfo); }
    setTimestamp(t) { QP(this.eventInfo, t); }
    getAction() { let t = rl(this.eventInfo); if (t)
        return { name: t[0], element: t[1] }; }
    setAction(t) { if (!t) {
        Hh(this.eventInfo);
        return;
    } nM(this.eventInfo, t.name, t.element); }
    getIsReplay() { return ZP(this.eventInfo); }
    setIsReplay(t) { oM(this.eventInfo, t); }
    getResolved() { return rM(this.eventInfo); }
    setResolved(t) { iM(this.eventInfo, t); }
    clone() { return new e(sM(this.eventInfo)); }
}, KP = {}, JP = /\s*;\s*/, XP = N.CLICK, Uh = class {
    a11yClickSupport = !1;
    clickModSupport = !0;
    syntheticMouseEventSupport;
    updateEventInfoForA11yClick = void 0;
    preventDefaultForA11yClick = void 0;
    populateClickOnlyAction = void 0;
    constructor({ syntheticMouseEventSupport: t = !1, clickModSupport: n = !0 } = {}) { this.syntheticMouseEventSupport = t, this.clickModSupport = n; }
    resolveEventType(t) { this.clickModSupport && In(t) === N.CLICK && UP(ol(t)) ? qh(t, N.CLICKMOD) : this.a11yClickSupport && this.updateEventInfoForA11yClick(t); }
    resolveAction(t) { rM(t) || (this.populateAction(t, Xw(t)), iM(t, !0)); }
    resolveParentAction(t) { let n = rl(t), o = n && nl(n); Hh(t); let r = o && this.getParentNode(o); r && this.populateAction(t, r); }
    populateAction(t, n) { let o = n; for (; o && o !== tM(t) && (o.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(o, t), !rl(t));)
        o = this.getParentNode(o); let r = rl(t); if (r && (this.a11yClickSupport && this.preventDefaultForA11yClick(t), this.syntheticMouseEventSupport && (In(t) === N.MOUSEENTER || In(t) === N.MOUSELEAVE || In(t) === N.POINTERENTER || In(t) === N.POINTERLEAVE)))
        if ($P(ol(t), In(t), nl(r))) {
            let i = GP(ol(t), nl(r));
            Jw(t, i), eM(t, nl(r));
        }
        else
            Hh(t); }
    getParentNode(t) { let n = t[Gh.OWNER]; if (n)
        return n; let o = t.parentNode; return o?.nodeName === "#document-fragment" ? o?.host ?? null : o; }
    populateActionOnElement(t, n) { let o = this.parseActions(t), r = o[In(n)]; r !== void 0 && nM(n, r, t), this.a11yClickSupport && this.populateClickOnlyAction(t, n, o); }
    parseActions(t) { let n = RP(t); if (!n) {
        let o = t.getAttribute(So.JSACTION);
        if (!o)
            n = KP, Ww(t, n);
        else {
            if (n = xP(o), !n) {
                n = {};
                let r = o.split(JP);
                for (let i = 0; i < r.length; i++) {
                    let s = r[i];
                    if (!s)
                        continue;
                    let a = s.indexOf(qP.EVENT_ACTION_SEPARATOR), c = a !== -1, l = c ? s.substr(0, a).trim() : XP, u = c ? s.substr(a + 1).trim() : s;
                    n[l] = u;
                }
                kP(o, n);
            }
            Ww(t, n);
        }
    } return n; }
    addA11yClickSupport(t, n, o) { this.a11yClickSupport = !0, this.updateEventInfoForA11yClick = t, this.preventDefaultForA11yClick = n, this.populateClickOnlyAction = o; }
}, aM = (function (e) { return e[e.I_AM_THE_JSACTION_FRAMEWORK = 0] = "I_AM_THE_JSACTION_FRAMEWORK", e; })(aM || {}), $h = class {
    dispatchDelegate;
    actionResolver;
    eventReplayer;
    eventReplayScheduled = !1;
    replayEventInfoWrappers = [];
    constructor(t, { actionResolver: n, eventReplayer: o } = {}) { this.dispatchDelegate = t, this.actionResolver = n, this.eventReplayer = o; }
    dispatch(t) { let n = new Bh(t); this.actionResolver?.resolveEventType(t), this.actionResolver?.resolveAction(t); let o = n.getAction(); if (o && eF(o.element, n) && HP(n.getEvent()), this.eventReplayer && n.getIsReplay()) {
        this.scheduleEventInfoWrapperReplay(n);
        return;
    } this.dispatchDelegate(n); }
    scheduleEventInfoWrapperReplay(t) { this.replayEventInfoWrappers.push(t), !this.eventReplayScheduled && (this.eventReplayScheduled = !0, Promise.resolve().then(() => { this.eventReplayScheduled = !1, this.eventReplayer(this.replayEventInfoWrappers); })); }
};
function eF(e, t) { return e.tagName === "A" && (t.getEventType() === N.CLICK || t.getEventType() === N.CLICKMOD); }
var cM = Symbol.for("propagationStopped"), Wh = { REPLAY: 101 };
var tF = "`preventDefault` called during event replay.";
var nF = "`composedPath` called during event replay.", sl = class {
    dispatchDelegate;
    clickModSupport;
    actionResolver;
    dispatcher;
    constructor(t, n = !0) { this.dispatchDelegate = t, this.clickModSupport = n, this.actionResolver = new Uh({ clickModSupport: n }), this.dispatcher = new $h(o => { this.dispatchToDelegate(o); }, { actionResolver: this.actionResolver }); }
    dispatch(t) { this.dispatcher.dispatch(t); }
    dispatchToDelegate(t) { for (t.getIsReplay() && iF(t), oF(t); t.getAction();) {
        if (sF(t), al(t.getEventType()) && t.getAction().element !== t.getTargetElement() || (this.dispatchDelegate(t.getEvent(), t.getAction().name), rF(t)))
            return;
        this.actionResolver.resolveParentAction(t.eventInfo);
    } }
};
function oF(e) { let t = e.getEvent(), n = e.getEvent().stopPropagation.bind(t), o = () => { t[cM] = !0, n(); }; so(t, "stopPropagation", o), so(t, "stopImmediatePropagation", o); }
function rF(e) { return !!e.getEvent()[cM]; }
function iF(e) { let t = e.getEvent(), n = e.getTargetElement(), o = t.preventDefault.bind(t); so(t, "target", n), so(t, "eventPhase", Wh.REPLAY), so(t, "preventDefault", () => { throw o(), new Error(tF + ""); }), so(t, "composedPath", () => { throw new Error(nF + ""); }); }
function sF(e) { let t = e.getEvent(), n = e.getAction()?.element; n && so(t, "currentTarget", n, { configurable: !0 }); }
function so(e, t, n, { configurable: o = !1 } = {}) { Object.defineProperty(e, t, { value: n, configurable: o }); }
function lM(e, t) { e.ecrd(n => { t.dispatch(n); }, aM.I_AM_THE_JSACTION_FRAMEWORK); }
function aF(e) { return e?.q ?? []; }
function cF(e) { e && (Qw(e.c, e.et, e.h), Qw(e.c, e.etc, e.h, !0)); }
function Qw(e, t, n, o) { for (let r = 0; r < t.length; r++)
    e.removeEventListener(t[r], n, o); }
var lF = !1, uM = (() => { class e {
    static MOUSE_SPECIAL_SUPPORT = lF;
    containerManager;
    eventHandlers = {};
    browserEventTypeToExtraEventTypes = {};
    dispatcher = null;
    queuedEventInfos = [];
    constructor(n) { this.containerManager = n; }
    handleEvent(n, o, r) { let i = YP(n, o, o.target, r, Date.now()); this.handleEventInfo(i); }
    handleEventInfo(n) { if (!this.dispatcher) {
        oM(n, !0), this.queuedEventInfos?.push(n);
        return;
    } this.dispatcher(n); }
    addEvent(n, o, r) { if (n in this.eventHandlers || !this.containerManager || !e.MOUSE_SPECIAL_SUPPORT && OP.indexOf(n) >= 0)
        return; let i = (a, c, l) => { this.handleEvent(a, c, l); }; this.eventHandlers[n] = i; let s = FP(o || n); if (s !== n) {
        let a = this.browserEventTypeToExtraEventTypes[s] || [];
        a.push(n), this.browserEventTypeToExtraEventTypes[s] = a;
    } this.containerManager.addEventListener(s, a => c => { i(n, c, a); }, r); }
    replayEarlyEvents(n = window._ejsa) { n && (this.replayEarlyEventInfos(n.q), cF(n), delete window._ejsa); }
    replayEarlyEventInfos(n) { for (let o = 0; o < n.length; o++) {
        let r = n[o], i = this.getEventTypesForBrowserEventType(r.eventType);
        for (let s = 0; s < i.length; s++) {
            let a = sM(r);
            qh(a, i[s]), this.handleEventInfo(a);
        }
    } }
    getEventTypesForBrowserEventType(n) { let o = []; return this.eventHandlers[n] && o.push(n), this.browserEventTypeToExtraEventTypes[n] && o.push(...this.browserEventTypeToExtraEventTypes[n]), o; }
    handler(n) { return this.eventHandlers[n]; }
    cleanUp() { this.containerManager?.cleanUp(), this.containerManager = null, this.eventHandlers = {}, this.browserEventTypeToExtraEventTypes = {}, this.dispatcher = null, this.queuedEventInfos = []; }
    registerDispatcher(n, o) { this.ecrd(n, o); }
    ecrd(n, o) { if (this.dispatcher = n, this.queuedEventInfos?.length) {
        for (let r = 0; r < this.queuedEventInfos.length; r++)
            this.handleEventInfo(this.queuedEventInfos[r]);
        this.queuedEventInfos = null;
    } }
} return e; })();
function dM(e, t = window) { return aF(t._ejsas?.[e]); }
function zh(e, t = window) { t._ejsas && (t._ejsas[e] = void 0); }
function uF(e) { }
import "@angular/core/primitives/signals";
import "@angular/core/primitives/di";
import "rxjs/operators";
typeof globalThis.ngServerMode > "u" && (globalThis.ngServerMode = typeof window > "u");
var hl = Symbol("InputSignalNode#UNSET"), RM = ne(F({}, hs), { transformFn: void 0, applyValueToInputSignal(e, t) { Mn(e, t); } }), dj = Symbol();
function xM(e, t) { let n = Object.create(RM); n.value = e, n.transformFn = t?.transform; function o() { if (Yt(n), n.value === hl) {
    let r = null;
    throw new T(-950, r);
} return n.value; } return o[K] = n, o; }
var fF = (function (e) { return e.Angular = "angular", e.ACX = "acx", e.Wiz = "wiz", e; })(fF || {}), fM = class {
    attributeName;
    constructor(t) { this.attributeName = t; }
    __NG_ELEMENT_ID__ = () => Wa(this.attributeName);
    toString() { return `HostAttributeToken ${this.attributeName}`; }
}, fj = (() => { let e = new C(""); return e.__NG_ELEMENT_ID__ = t => { let n = S(); if (n === null)
    throw new T(-204, !1); if (n.type & 2)
    return n.value; if (t & 8)
    return null; throw new T(-204, !1); }, e; })();
function pF(e) { return hF(e) ? e.default : e; }
function hF(e) { return e && typeof e == "object" && "default" in e; }
function pj(e, t) { let n = E(se), o = null, r = () => (o || (o = e()), o); return t?.prefetch && t.prefetch().then(() => r()).catch(() => { }), () => r().then(i => n.get(pF(i))); }
function hj(e) { let t = E(za), { promise: n, resolve: o } = To(); return t.requestOnIdle(() => o(), e), n; }
var ao = (function (e) { return e[e.Directive = 0] = "Directive", e[e.Component = 1] = "Component", e[e.Injectable = 2] = "Injectable", e[e.Pipe = 3] = "Pipe", e[e.NgModule = 4] = "NgModule", e[e.Service = 5] = "Service", e; })(ao || {});
function gj(e) { return new os; }
function pM(e, t) { return xM(e, t); }
function gF(e) { return xM(hl, e); }
var mj = (pM.required = gF, pM);
function kM(e, t) { let n = Object.create(RM), o = new os; n.value = e; function r() { return Yt(n), hM(n.value), n.value; } return r[K] = n, r.asReadonly = Co.bind(r), r.set = i => { n.equal(n.value, i) || (Mn(n, i), o.emit(i)); }, r.update = i => { hM(n.value), r.set(i(n.value)); }, r.subscribe = o.subscribe.bind(o), r.destroyRef = o.destroyRef, r; }
function hM(e) { if (e === hl)
    throw new T(952, !1); }
function gM(e, t) { return kM(e, t); }
function mF(e) { return kM(hl, e); }
var vj = (gM.required = mF, gM);
function mM(e, t) { return Dp(t); }
function vF(e, t) { return Tp(t); }
var yj = (mM.required = vF, mM);
function Ej(e, t) { return Cp(t); }
function vM(e, t) { return Dp(t); }
function yF(e, t) { return Tp(t); }
var Ij = (vM.required = yF, vM);
function Dj(e, t) { return Cp(t); }
function Tj(...e) { return e.reduce((t, n) => Object.assign(t, n, { providers: [...t.providers, ...n.providers] }), { providers: [] }); }
var OM = !0, ur = class {
}, Cj = Bt("ContentChildren", (e, t = {}) => F({ selector: e, first: !1, isViewQuery: !1, descendants: !1, emitDistinctChangesOnly: OM }, t), ur), wj = Bt("ContentChild", (e, t = {}) => F({ selector: e, first: !0, isViewQuery: !1, descendants: !0 }, t), ur), Mj = Bt("ViewChildren", (e, t = {}) => F({ selector: e, first: !1, isViewQuery: !0, descendants: !0, emitDistinctChangesOnly: OM }, t), ur), Nj = Bt("ViewChild", (e, t) => F({ selector: e, first: !0, isViewQuery: !0, descendants: !0 }, t), ur), Sj = (() => { class e {
    constructor(n) { }
    static \u0275fac = function (o) { return new (o || e)(me(Ue)); };
    static \u0275mod = Np({ type: e });
    static \u0275inj = Mr({});
} return e; })(), _j = new C("", { providedIn: "platform", factory: () => null }), bj = new C("", { providedIn: "platform", factory: () => null }), Aj = new C("", { providedIn: "platform", factory: () => null }), cl = new WeakSet, yM = "";
function EM(e) { return e.get(ec, wf); }
function EF() { let e = [{ provide: ec, useFactory: () => { let t = !0; if (typeof ngServerMode > "u" || !ngServerMode) {
            let n = E(It);
            t = !!window._ejsas?.[n];
        } return t && re("NgEventReplay"), t; } }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Qe, useValue: () => { let t = E(Ue), { injector: n } = t; if (!cl.has(t)) {
        let o = E(ji);
        if (EM(n)) {
            Iy();
            let r = n.get(It), i = yy(r, (s, a, c) => { s.nodeType === Node.ELEMENT_NODE && (vy(s, a, c), Sf(s, o)); });
            t.onDestroy(i);
        }
    } }, multi: !0 }, { provide: Ki, useFactory: () => { let t = E(Ue), { injector: n } = t; return () => { if (!EM(n) || cl.has(t))
        return; cl.add(t); let o = n.get(It); t.onDestroy(() => { cl.delete(t), typeof ngServerMode < "u" && !ngServerMode && zh(o); }), t.whenStable().then(() => { if (t.destroyed)
        return; let r = n.get(bf); IF(r, n); let i = n.get(ji); i.get(yM)?.forEach(_f), i.delete(yM); let s = r.instance; Vi(n) ? t.onDestroy(() => s.cleanUp()) : s.cleanUp(); }); }; }, multi: !0 }), e; }
var IF = (e, t) => { let n = t.get(It), o = window._ejsas[n], r = e.instance = new uM(new il(o.c)); for (let a of o.et)
    r.addEvent(a); for (let a of o.etc)
    r.addEvent(a); let i = dM(n); r.replayEarlyEventInfos(i), zh(n); let s = new sl(a => { TF(t, a, a.currentTarget); }); lM(r, s); };
function DF(e, t, n) { let o = new Map, r = t[rn], i = e.cleanup; if (!i || !r)
    return o; for (let s = 0; s < i.length;) {
    let a = i[s++], c = i[s++];
    if (typeof a != "string")
        continue;
    let l = a;
    if (!Kw(l))
        continue;
    al(l) ? n.capture.add(l) : n.regular.add(l);
    let u = x(t[c]);
    s++;
    let d = i[s++];
    (typeof d == "boolean" || d >= 0) && (o.has(u) ? o.get(u).push(l) : o.set(u, [l]));
} return o; }
function TF(e, t, n) { let o = (n && n.getAttribute(Xo)) ?? ""; /d\d+/.test(o) ? CF(o, e, t, n) : t.eventPhase === Wh.REPLAY && Af(t, n); }
function CF(e, t, n, o) { let r = t.get(py); r.push({ event: n, currentTarget: o }), zt(t, e, wF(r)); }
function wF(e) { return t => { let n = new Set(t), o = []; for (let { event: r, currentTarget: i } of e) {
    let s = i.getAttribute(Xo);
    n.has(s) ? Af(r, i) : o.push({ event: r, currentTarget: i });
} e.length = 0, e.push(...o); }; }
var IM = !1, DM = !1, MF = 1e4;
function NF() { IM || (IM = !0, My(), gT(), pC(), mT(), hD(), jI(), pI(), RE()); }
function SF() { DM || (DM = !0, xT(), rI(), lI()); }
function _F(e) { return e.whenStable(); }
var Rj = "ngcm";
function xj() { let e = [{ provide: to, useFactory: () => { let t = !0; return (typeof ngServerMode > "u" || !ngServerMode) && (t = !!E(Ot, { optional: !0 })?.get(tc, null)), t && re("NgHydration"), t; } }, { provide: Qe, useValue: () => { if (up(!1), typeof ngServerMode < "u" && ngServerMode)
            return; let t = E(xt); E(to) && (ky(t), NF()); }, multi: !0 }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Tf, useFactory: () => E(to) }, { provide: Ki, useFactory: () => { let t = E(We); if (E(to)) {
        let n = E(Ue);
        return () => { _F(n).then(() => { n.destroyed || (dp(n), t.notify(7)); }); };
    } return () => { }; }, multi: !0 }), je(e); }
function kj() { return [{ provide: Cf, useFactory: () => E(to) }, { provide: Qe, useValue: () => { E(to) && (SF(), up(!0), re("NgI18nHydration")); }, multi: !0 }]; }
function Oj() { let e = [EF(), { provide: Mf, useValue: !0 }, { provide: $t, useFactory: qC }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Zc, useFactory: () => ({ requested: !1, activated: !1, injector: E(se), document: E(xt) }) }, { provide: Ki, useFactory: () => { let t = E(Zc); return () => { t.requested || (t.requested = !0, _h(t)); }; }, multi: !0 }), e; }
var TM = MF - 1e3, Yh = class {
    openTasks = new Map;
    add(t) { this.openTasks.set(t, new Error("Task stack tracking error")); }
    remove(t) { this.openTasks.delete(t); }
};
function Lj() { let e = new Yh, { openTasks: t } = e; return je([{ provide: Cu, useValue: e }, oD(() => { console.warn("Stability debugging utility was provided in production mode. This will cause debug code to be included in production bundles. If this is intentional because you are debugging stability issues in a production environment, you can ignore this warning."); let n = E(W), o = E(Ue), r = null; typeof Zone < "u" && n.run(() => { r = Zone.current.get("TaskTrackingZone"); }), n.runOutsideAngular(() => { let i = setTimeout(() => { if (console.debug(`---- Application did not stabilize within ${TM / 1e3} seconds ----`), typeof Zone < "u" && !r && console.info('Zone.js is present but no TaskTrackingZone found. To enable better debugging of tasks in the Angular Zone, import "zone.js/plugins/task-tracking" in your application.'), r?.macroTasks?.length) {
        console.group("Macrotasks keeping Angular Zone unstable:");
        for (let s of r?.macroTasks ?? [])
            console.debug(s.creationLocation.stack);
        console.groupEnd();
    } console.group("PendingTasks keeping application unstable:"); for (let s of t.values())
        console.debug(s.stack); console.groupEnd(); }, TM); o.whenStable().then(() => { clearTimeout(i); }); }); })]); }
var ll = class {
    supports(t) { return Ei(t); }
    create(t) { return new Kh(t); }
}, bF = (e, t) => t, Kh = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) { this._trackByFn = t || bF; }
    forEachItem(t) { let n; for (n = this._itHead; n !== null; n = n._next)
        t(n); }
    forEachOperation(t) { let n = this._itHead, o = this._removalsHead, r = 0, i = null; for (; n || o;) {
        let s = !o || n && n.currentIndex < CM(o, r, i) ? n : o, a = CM(s, r, i), c = s.currentIndex;
        if (s === o)
            r--, o = o._nextRemoved;
        else if (n = n._next, s.previousIndex == null)
            r++;
        else {
            i || (i = []);
            let l = a - r, u = c - r;
            if (l != u) {
                for (let f = 0; f < l; f++) {
                    let p = f < i.length ? i[f] : i[f] = 0, h = p + f;
                    u <= h && h < l && (i[f] = p + 1);
                }
                let d = s.previousIndex;
                i[d] = u - l;
            }
        }
        a !== c && t(s, a, c);
    } }
    forEachPreviousItem(t) { let n; for (n = this._previousItHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachMovedItem(t) { let n; for (n = this._movesHead; n !== null; n = n._nextMoved)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    forEachIdentityChange(t) { let n; for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n); }
    diff(t) { if (t == null && (t = []), !Ei(t))
        throw new T(900, !1); return this.check(t) ? this : null; }
    onDestroy() { }
    check(t) { this._reset(); let n = this._itHead, o = !1, r, i, s; if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
            i = t[a], s = this._trackByFn(a, i), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, i, s, a), o = !0) : (o && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)), n = n._next;
    }
    else
        r = 0, yI(t, a => { s = this._trackByFn(r, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, r), o = !0) : (o && (n = this._verifyReinsertion(n, a, s, r)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, r++; }), this.length = r; return this._truncate(n), this.collection = t, this.isDirty; }
    get isDirty() { return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null; }
    _reset() { if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
            t.previousIndex = t.currentIndex;
        for (this._additionsHead = this._additionsTail = null, t = this._movesHead; t !== null; t = t._nextMoved)
            t.previousIndex = t.currentIndex;
        this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null;
    } }
    _mismatch(t, n, o, r) { let i; return t === null ? i = this._itTail : (i = t._prev, this._remove(t)), t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, r)) : (t = this._linkedRecords === null ? null : this._linkedRecords.get(o, r), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, r)) : t = this._addAfter(new Jh(n, o), i, r)), t; }
    _verifyReinsertion(t, n, o, r) { let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null); return i !== null ? t = this._reinsertAfter(i, t._prev, r) : t.currentIndex != r && (t.currentIndex = r, this._addToMoves(t, r)), t; }
    _truncate(t) { for (; t !== null;) {
        let n = t._next;
        this._addToRemovals(this._unlink(t)), t = n;
    } this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null); }
    _reinsertAfter(t, n, o) { this._unlinkedRecords !== null && this._unlinkedRecords.remove(t); let r = t._prevRemoved, i = t._nextRemoved; return r === null ? this._removalsHead = i : r._nextRemoved = i, i === null ? this._removalsTail = r : i._prevRemoved = r, this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _moveAfter(t, n, o) { return this._unlink(t), this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _addAfter(t, n, o) { return this._insertAfter(t, n, o), this._additionsTail === null ? this._additionsTail = this._additionsHead = t : this._additionsTail = this._additionsTail._nextAdded = t, t; }
    _insertAfter(t, n, o) { let r = n === null ? this._itHead : n._next; return t._next = r, t._prev = n, r === null ? this._itTail = t : r._prev = t, n === null ? this._itHead = t : n._next = t, this._linkedRecords === null && (this._linkedRecords = new ul), this._linkedRecords.put(t), t.currentIndex = o, t; }
    _remove(t) { return this._addToRemovals(this._unlink(t)); }
    _unlink(t) { this._linkedRecords !== null && this._linkedRecords.remove(t); let n = t._prev, o = t._next; return n === null ? this._itHead = o : n._next = o, o === null ? this._itTail = n : o._prev = n, t; }
    _addToMoves(t, n) { return t.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = t : this._movesTail = this._movesTail._nextMoved = t), t; }
    _addToRemovals(t) { return this._unlinkedRecords === null && (this._unlinkedRecords = new ul), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t; }
    _addIdentityChange(t, n) { return t.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = t : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t, t; }
}, Jh = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) { this.item = t, this.trackById = n; }
}, Xh = class {
    _head = null;
    _tail = null;
    add(t) { this._head === null ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t); }
    get(t, n) { let o; for (o = this._head; o !== null; o = o._nextDup)
        if ((n === null || n <= o.currentIndex) && Object.is(o.trackById, t))
            return o; return null; }
    remove(t) { let n = t._prevDup, o = t._nextDup; return n === null ? this._head = o : n._nextDup = o, o === null ? this._tail = n : o._prevDup = n, this._head === null; }
}, ul = class {
    map = new Map;
    put(t) { let n = t.trackById, o = this.map.get(n); o || (o = new Xh, this.map.set(n, o)), o.add(t); }
    get(t, n) { let o = t, r = this.map.get(o); return r ? r.get(t, n) : null; }
    remove(t) { let n = t.trackById; return this.map.get(n).remove(t) && this.map.delete(n), t; }
    get isEmpty() { return this.map.size === 0; }
    clear() { this.map.clear(); }
};
function CM(e, t, n) { let o = e.previousIndex; if (o === null)
    return o; let r = 0; return n && o < n.length && (r = n[o]), o + t + r; }
var dl = class {
    supports(t) { return t instanceof Map || Lc(t); }
    create() { return new eg; }
}, eg = class {
    _records = new Map;
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    get isDirty() { return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null; }
    forEachItem(t) { let n; for (n = this._mapHead; n !== null; n = n._next)
        t(n); }
    forEachPreviousItem(t) { let n; for (n = this._previousMapHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachChangedItem(t) { let n; for (n = this._changesHead; n !== null; n = n._nextChanged)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    diff(t) { if (!t)
        t = new Map;
    else if (!(t instanceof Map || Lc(t)))
        throw new T(900, !1); return this.check(t) ? this : null; }
    check(t) { this._reset(); let n = this._mapHead; if (this._appendAfter = null, this._forEach(t, (o, r) => { if (n && n.key === r)
        this._maybeAddToChanges(n, o), this._appendAfter = n, n = n._next;
    else {
        let i = this._getOrCreateRecordForKey(r, o);
        n = this._insertBeforeOrAppend(n, i);
    } }), n) {
        n._prev && (n._prev._next = null), this._removalsHead = n;
        for (let o = n; o !== null; o = o._nextRemoved)
            o === this._mapHead && (this._mapHead = null), this._records.delete(o.key), o._nextRemoved = o._next, o.previousValue = o.currentValue, o.currentValue = null, o._prev = null, o._next = null;
    } return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty; }
    _insertBeforeOrAppend(t, n) { if (t) {
        let o = t._prev;
        return n._next = t, n._prev = o, t._prev = n, o && (o._next = n), t === this._mapHead && (this._mapHead = n), this._appendAfter = t, t;
    } return this._appendAfter ? (this._appendAfter._next = n, n._prev = this._appendAfter) : this._mapHead = n, this._appendAfter = n, null; }
    _getOrCreateRecordForKey(t, n) { if (this._records.has(t)) {
        let r = this._records.get(t);
        this._maybeAddToChanges(r, n);
        let i = r._prev, s = r._next;
        return i && (i._next = s), s && (s._prev = i), r._next = null, r._prev = null, r;
    } let o = new tg(t); return this._records.set(t, o), o.currentValue = n, this._addToAdditions(o), o; }
    _reset() { if (this.isDirty) {
        let t;
        for (this._previousMapHead = this._mapHead, t = this._previousMapHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
            t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded)
            t.previousValue = t.currentValue;
        this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null;
    } }
    _maybeAddToChanges(t, n) { Object.is(n, t.currentValue) || (t.previousValue = t.currentValue, t.currentValue = n, this._addToChanges(t)); }
    _addToAdditions(t) { this._additionsHead === null ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t, this._additionsTail = t); }
    _addToChanges(t) { this._changesHead === null ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t, this._changesTail = t); }
    _forEach(t, n) { t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(o => n(t[o], o)); }
}, tg = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) { this.key = t; }
};
function wM() { return new LM([new ll]); }
var LM = (() => { class e {
    factories;
    static \u0275prov = J({ token: e, providedIn: "root", factory: wM });
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o != null) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = E(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || wM()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o != null)
        return o; throw new T(901, !1); }
} return e; })();
function MM() { return new PM([new dl]); }
var PM = (() => { class e {
    static \u0275prov = J({ token: e, providedIn: "root", factory: MM });
    factories;
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = E(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || MM()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o)
        return o; throw new T(901, !1); }
} return e; })(), AF = (() => { class e {
    static __NG_ELEMENT_ID__ = RF;
} return e; })();
function RF(e) { return xF(S(), g(), (e & 16) === 16); }
function xF(e, t, n) { if (Ne(e) && !n) {
    let o = ye(e.index, t);
    return new Ht(o, o);
}
else if (e.type & 175) {
    let o = t[ce];
    return new Ht(o, t);
} return null; }
var kF = [new dl], OF = [new ll], Pj = new LM(OF), Fj = new PM(kF);
function jj(e) { return je([]); }
var LF = (() => { class e {
    zone = E(W);
    changeDetectionScheduler = E(We);
    applicationRef = E(Ue);
    applicationErrorHandler = E(kt);
    _onMicrotaskEmptySubscription;
    initialize() { this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({ next: () => { this.changeDetectionScheduler.runningTick || this.zone.run(() => { try {
            this.applicationRef.dirtyFlags |= 1, this.applicationRef._tick();
        }
        catch (n) {
            this.applicationErrorHandler(n);
        } }); } })); }
    ngOnDestroy() { this._onMicrotaskEmptySubscription?.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })(), PF = new C("", { factory: () => !1 });
function FF({ ngZoneFactory: e, scheduleInRootZone: t }) { return e ??= () => new W(ne(F({}, FM()), { scheduleInRootZone: t })), [{ provide: Mo, useValue: !1 }, { provide: W, useFactory: e }, { provide: Qe, multi: !0, useFactory: () => { let n = E(LF, { optional: !0 }); return () => n.initialize(); } }, { provide: Qe, multi: !0, useFactory: () => { let n = E(jF); return () => { n.initialize(); }; } }, { provide: Gs, useValue: t ?? Tu }]; }
function Vj(e) { let t = e?.scheduleInRootZone, n = FF({ ngZoneFactory: () => { let o = FM(e); return o.scheduleInRootZone = t, o.shouldCoalesceEventChangeDetection && re("NgZone_CoalesceEvent"), new W(o); }, scheduleInRootZone: t }); return je([{ provide: PF, useValue: !0 }, n]); }
function FM(e) { return { enableLongStackTrace: !1, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1 }; }
var jF = (() => { class e {
    subscription = new dF;
    initialized = !1;
    zone = E(W);
    pendingTasks = E(yt);
    initialize() { if (this.initialized)
        return; this.initialized = !0; let n = null; !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => { this.subscription.add(this.zone.onStable.subscribe(() => { W.assertNotInAngularZone(), queueMicrotask(() => { n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null); }); })); }), this.subscription.add(this.zone.onUnstable.subscribe(() => { W.assertInAngularZone(), n ??= this.pendingTasks.add(); })); }
    ngOnDestroy() { this.subscription.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = Ut({ token: e, factory: e.\u0275fac });
} return e; })();
function VF(e, t, n) { let o = new Go(n); return Promise.resolve(o); }
function NM(e) { for (let t = e.length - 1; t >= 0; t--)
    if (e[t] !== void 0)
        return e[t]; }
var fl = new C(""), HF = new C("");
function ss(e) { return !e.moduleRef; }
function jM(e) { let t = ss(e) ? e.r3Injector : e.moduleRef.injector, n = t.get(W); return n.run(() => { ss(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers(); let o = t.get(kt), r; if (n.runOutsideAngular(() => { r = n.onError.subscribe({ next: o }); }), ss(e)) {
    let i = () => t.destroy(), s = e.platformInjector.get(fl);
    s.add(i), t.onDestroy(() => { r.unsubscribe(), s.delete(i); });
}
else {
    let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(fl);
    s.add(i), e.moduleRef.onDestroy(() => { ei(e.allPlatformModules, e.moduleRef), r.unsubscribe(), s.delete(i); });
} return UF(o, n, () => { let i = t.get(yt), s = i.add(), a = t.get(bp); return a.runInitializers(), a.donePromise.then(() => { let c = t.get(xh, es); if (AT(c || es), !t.get(HF, !0))
    return ss(e) ? t.get(Ue) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef); if (ss(e)) {
    let u = t.get(Ue);
    return e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u;
}
else
    return VM?.(e.moduleRef, e.allPlatformModules), e.moduleRef; }).finally(() => { i.remove(s); }); }); }); }
var VM;
function SM() { VM = BF; }
function BF(e, t) { let n = e.injector.get(Ue); if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach(o => n.bootstrap(o));
else if (e.instance.ngDoBootstrap)
    e.instance.ngDoBootstrap(n);
else
    throw new T(-403, !1); t.push(e); }
function UF(e, t, n) { try {
    let o = n();
    return wp(o) ? o.catch(r => { throw t.runOutsideAngular(() => e(r)), r; }) : o;
}
catch (o) {
    throw t.runOutsideAngular(() => e(o)), o;
} }
var HM = (() => { class e {
    _injector;
    _modules = [];
    _destroyListeners = [];
    _destroyed = !1;
    constructor(n) { this._injector = n; }
    bootstrapModuleFactory(n, o) { let r = [Yc(), ...o?.applicationProviders ?? [], Su], i = QI(n.moduleType, this.injector, r); return SM(), jM({ moduleRef: i, allPlatformModules: this._modules, platformInjector: this.injector }); }
    bootstrapModule(n, o = []) { let r = Hp({}, o); return SM(), VF(this.injector, r, n).then(i => this.bootstrapModuleFactory(i, r)); }
    onDestroy(n) { this._destroyListeners.push(n); }
    get injector() { return this._injector; }
    destroy() { if (this._destroyed)
        throw new T(404, !1); this._modules.slice().forEach(o => o.destroy()), this._destroyListeners.forEach(o => o()); let n = this._injector.get(fl, null); n && (n.forEach(o => o()), n.clear()), this._destroyed = !0; }
    get destroyed() { return this._destroyed; }
    static \u0275fac = function (o) { return new (o || e)(me(se)); };
    static \u0275prov = J({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function BM(e) { let t = SD(e); if (t?.type === "null")
    return { name: "Null Injector", type: "null", providers: [], children: [] }; let n = []; if ((t?.type === "element" || t?.type === "environment") && (n = ND(e).map(o => ({ token: o.token, value: e.get(o.token, null, { optional: !0, self: !0 }) }))), t?.type === "element") {
    let o = bi(e), r = o ? o.providerIndexes >> 20 : 0, i = n.slice(0, r), s = n.slice(r);
    return { name: e.constructor.name, type: "element", providers: s, viewProviders: i, children: [], hostElement: t.source };
} return { name: t?.source ?? e.constructor.name ?? "Unknown Injector", type: "environment", providers: n, children: [] }; }
var Hj = { name: "angular:di_graph", description: "\nExposes the Angular Dependency Injection (DI) graph of the application.\n\nThis tool extracts both the element injector tree (associated with DOM elements and components)\nand the environment injector tree (associated with modules and standalone application roots).\nIt captures the relationship structure and the providers resolved at each level.\n\nReturns:\n- `elementInjectorRoots`: An array of root element injectors (one for each Angular application\n  root found). Each node forms a tree hierarchy:\n  - `name`: The constructor name of this injector.\n  - `type`: 'element'.\n  - `providers`: Array of providers configured on this injector.\n    - `token`: The DI token.\n    - `value`: The resolved value of that provider if it was instantiated.\n  - `hostElement`: The DOM element that this injector is associated with.\n  - `children`: Array of child element injectors.\n- `environmentInjectorRoot`: The root environment injector. It forms a tree hierarchy of nodes\n  representing all environment injectors:\n  - `name`: The identifier for the environment injector.\n  - `type`: 'environment' or 'null'.\n  - `providers`: Array of providers configured on this injector.\n    - `token`: The DI token.\n    - `value`: The resolved value of that provider if it was instantiated.\n  - `children`: Array of child environment injectors.\n  ".trim(), inputSchema: { type: "object", properties: {} }, execute: () => Ce(null, null, function* () { let e = Array.from(document.querySelectorAll("[ng-version]")); if (e.length === 0)
        throw new Error("Could not find Angular root element ([ng-version]) on the page."); return $F(e); }) };
function $F(e) { let t = e.map(n => { let o = _e(n); if (!o?.lView)
    throw new Error(`Could not find an \`LView\` for root \`<${n.tagName.toLowerCase()}>\`, is it an Angular component?`); return o.lView; }); return { elementInjectorRoots: t.map(n => GF(n)), environmentInjectorRoot: qF(t) }; }
function GF(e) { if (e[m].type !== 0)
    throw new Error(`Expected a root LView but got type: \`${e[m].type}\`.`); let t = []; for (let [o, r] of vf(e)) {
    let i = new Se(o, r), s = BM(i);
    for (; t.length > 0;) {
        let [a, c, l] = t[t.length - 1], u = UM(o, a), d = WF(r, c, a);
        if (u || d) {
            l.children.push(s);
            break;
        }
        else
            t.pop();
    }
    t.push([o, r, s]);
} if (t.length === 0)
    throw new Error("Expected at least one component/directive in the root `LView`."); let [, , n] = t[0]; return n; }
function qF(e) { let t = new Map, n; function o(r) { let i = t.get(r); if (i)
    return i; let s = BM(r); t.set(r, s); let a = zF(r); if (a)
    o(a).children.push(s);
else if (!n)
    n = s;
else if (n !== s)
    throw new Error("Expected only one root environment injector, but found multiple.", { cause: { firstRoot: n, secondRoot: s } }); return s; } for (let r of e)
    for (let [, i] of vf(r))
        o(i[O]); if (!n)
    throw new Error("Expected a root environment injector but did not find one."); return n; }
function UM(e, t) { let n = e; for (; n;) {
    if (n === t)
        return !0;
    n = n.parent;
} return !1; }
function WF(e, t, n) { let o = e, r = null; for (; o && o !== t;)
    r = o[ae], o = qe(o); return o === t && r !== null && UM(r, n); }
function zF(e) { if (e instanceof pn)
    return e.parentInjector; if (e instanceof nt)
    return e.parent; if (e instanceof _t)
    return; throw new Error(`Unknown injector type: "${e.constructor.name}".`); }
var Bj = { name: "angular:signal_graph", description: "\nExposes the Angular signal dependency graph for a given DOM element.\n\nThis tool extracts the reactive dependency graph (signals, computeds, and effects) that\nare transitive dependencies of the effects of that element. It will include signals\nauthored in other components/services and depended upon by the target component, but\nwill *not* include signals only used in descendant components effects.\n\nParams:\n- `target`: The element to get the signal graph for. Must be the host element of an\n  Angular component.\n\nReturns:\n- `nodes`: An array of reactive nodes discovered in the context. Each node contains:\n  - `kind`: The type of reactive node ('signal', 'computed', 'effect', or 'template'\n    for component template effects).\n  - `value`: The current evaluated value of the node (if applicable).\n  - `label`: The symbol name of the associated signal if available (ex.\n    `const foo = signal(0);` has `label: 'foo'`).\n  - `epoch`: The internal version number of the node's value.\n- `edges`: An array of dependency links representing which nodes read from which other\n  nodes.\n  - `consumer`: The index in the `nodes` array of the node that depends on the value.\n  - `producer`: The index in the `nodes` array of the node that provides the value.\n\nExample: An edge with `{consumer: 2, producer: 0}` means that `nodes[2]` (e.g. an\n`effect`) reads the value of `nodes[0]` (e.g. a `signal`).\n  ".trim(), inputSchema: { type: "object", properties: { target: { type: "object", description: "The element to get the signal graph for.", "x-mcp-type": "HTMLElement" } }, required: ["target"] }, execute: t => Ce(null, [t], function* ({ target: e }) { if (!(e instanceof HTMLElement))
        throw new Error('Invalid input: "target" must be an HTMLElement.'); let n = yf(e); if (n instanceof _t)
        throw new Error('Invalid input: "target" is not the host element of an Angular component.'); let o = bD(n); return { nodes: o.nodes.map(a => { var c = a, { id: r, debuggableFn: i } = c, s = lg(c, ["id", "debuggableFn"]); return s; }), edges: o.edges }; }) };
var lr = null;
function QF(e) { if (gl())
    throw new T(400, !1); Vp(), lr = typeof ngServerMode > "u" || !ngServerMode ? e : null; let t = e.get(HM); return GM(e), t; }
function ZF(e, t, n = []) { let o = `Platform: ${t}`, r = new C(o); return (i = []) => { let s = gl(); if (!s) {
    let a = [...n, ...i, { provide: r, useValue: !0 }];
    s = e?.(a) ?? QF($M(a, o));
} return typeof ngServerMode < "u" && ngServerMode ? s : YF(r); }; }
function $M(e = [], t) { return se.create({ name: t, providers: [{ provide: Wl, useValue: "platform" }, { provide: fl, useValue: new Set([() => lr = null]) }, ...e] }); }
function YF(e) { let t = gl(); if (!t)
    throw new T(-401, !1); return t; }
function gl() { return typeof ngServerMode < "u" && ngServerMode ? null : lr?.get(HM) ?? null; }
function Uj() { gl()?.destroy(); }
function KF(e = []) { if (lr)
    return lr; let t = $M(e); return (typeof ngServerMode > "u" || !ngServerMode) && (lr = t), Vp(), GM(t), t; }
function $j(e) { return { provide: _u, useValue: e, multi: !0 }; }
function GM(e) { let t = e.get(_u, null); Or(e, () => { t?.forEach(n => n()); }); }
function Gj(e) { let { rootComponent: t, appProviders: n, platformProviders: o, platformRef: r } = e; if (U(P.BootstrapApplicationStart), typeof ngServerMode < "u" && ngServerMode && !r)
    throw new T(-401, !1); try {
    let i = r?.injector ?? KF(o), s = [Yc(), Su, ...n || []], a = new Ii({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: !1 });
    return jM({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
}
catch (i) {
    return Promise.reject(i);
}
finally {
    U(P.BootstrapApplicationEnd);
} }
var ng = class {
    views = [];
    indexByContent = new Map;
    add(t) { let n = JSON.stringify(t); if (!this.indexByContent.has(n)) {
        let o = this.views.length;
        return this.views.push(t), this.indexByContent.set(n, o), o;
    } return this.indexByContent.get(n); }
    getAll() { return this.views; }
}, JF = 0;
function qM(e) { return e.ssrId || (e.ssrId = `t${JF++}`), e.ssrId; }
function WM(e, t, n) { let o = []; return mn(e, t, n, o), o.length; }
function XF(e) { let t = []; return Sc(e, t), t.length; }
function zM(e, t) { let n = e[$]; return n && !n.hasAttribute(eo) ? pl(n, e, null, t) : null; }
function QM(e, t) { let n = Vr(e[$]), o = zM(n, t); if (o === null)
    return; let r = x(n[$]), i = e[z], s = pl(r, i, null, t), a = n[M], c = `${o}|${s}`; a.setAttribute(r, Po, c); }
function qj(e, t) { let n = e.injector, o = iI(n), r = Vi(n), i = new ng, s = new Map, a = e._views, c = n.get(ec, wf), l = { regular: new Set, capture: new Set }, u = new Map; e.injector.get(It); for (let p of a) {
    let h = Rf(p);
    if (h !== null) {
        let v = { serializedViewCollection: i, corruptedTextNodes: s, isI18nHydrationEnabled: o, isIncrementalHydrationEnabled: r, i18nChildren: new Map, eventTypesToReplay: l, shouldReplayEvents: c, deferBlocks: u };
        X(h) ? QM(h, v) : zM(h, v), r1(s, t);
    }
} let d = i.getAll(), f = n.get(Ot); if (f.set(tc, d), u.size > 0) {
    let p = {};
    for (let [h, v] of u.entries())
        p[h] = v;
    f.set(nc, p);
} return l; }
function e1(e, t, n, o, r) { let i = [], s = ""; for (let a = L; a < e.length; a++) {
    let c = e[a], l, u, d;
    if (it(c) && (c = c[I], X(c))) {
        u = XF(c) + 2, QM(c, r);
        let p = Vr(c[$]);
        d = { [Ka]: p[m].ssrId, [jt]: u };
    }
    if (!d) {
        let p = c[m];
        p.type === 1 ? (l = p.ssrId, u = 1) : (l = qM(p), u = WM(p, c, p.firstChild)), d = { [Ka]: l, [jt]: u };
        let h = !1;
        if (ED(n[m], t)) {
            let v = be(n, t), y = ge(n[m], t);
            if (r.isIncrementalHydrationEnabled && y.hydrateTriggers !== null) {
                let D = `d${r.deferBlocks.size}`;
                y.hydrateTriggers.has(7) && (h = !0);
                let k = [];
                Sc(e, k);
                let ue = { [jt]: k.length, [Pi]: v[Wt] }, tt = t1(y.hydrateTriggers);
                tt.length > 0 && (ue[Fi] = tt), o !== null && (ue[Df] = o), r.deferBlocks.set(D, ue);
                let $e = x(e);
                $e !== void 0 ? $e.nodeType === Node.COMMENT_NODE && _M($e, D) : _M($e, D), h || s1(y, k, D, r), o = D, d[Xa] = D;
            }
            d[Pi] = v[Wt];
        }
        if (!h) {
            let v = x(c[$]);
            (c[m].type !== 1 || v === null || !v.hasAttribute(eo)) && Object.assign(d, ZM(e[a], o, r));
        }
    }
    let f = JSON.stringify(d);
    if (i.length > 0 && f === s) {
        let p = i[i.length - 1];
        p[Oi] ??= 1, p[Oi]++;
    }
    else
        s = f, i.push(d);
} return i; }
function t1(e) { let t = new Set([0, 1, 2, 5]), n = []; for (let [o, r] of e)
    t.has(o) && (r === null ? n.push(o) : r.type === 5 ? n.push({ trigger: o, delay: r.delay }) : n.push({ trigger: o, intersectionObserverOptions: r.intersectionObserverOptions })); return n; }
function as(e, t, n, o) { let r = t.index - I; e[Li] ??= {}, e[Li][r] ??= tI(t, n, o); }
function Qh(e, t) { let n = typeof t == "number" ? t : t.index - I; e[Jo] ??= [], e[Jo].includes(n) || e[Jo].push(n); }
function ZM(e, t = null, n) { let o = {}, r = e[m], i = sI(r, n), s = n.shouldReplayEvents ? DF(r, e, n.eventTypesToReplay) : null; for (let a = I; a < r.bindingStartIndex; a++) {
    let c = r.data[a], l = a - I, u = aI(e, a, n);
    if (u) {
        o[Ja] ??= {}, o[Ja][l] = u.caseQueue;
        for (let d of u.disconnectedNodes)
            Qh(o, d);
        for (let d of u.disjointNodes) {
            let f = r.data[d + I];
            as(o, f, e, i);
        }
        continue;
    }
    if (qa(c) && !er(c)) {
        if (X(e[a]) && c.tView && (o[Ya] ??= {}, o[Ya][l] = qM(c.tView)), rr(c, e) && i1(c)) {
            Qh(o, c);
            continue;
        }
        if (Array.isArray(c.projection)) {
            for (let d of c.projection)
                if (d)
                    if (!Array.isArray(d))
                        !Kl(d) && !Yo(d) && (rr(d, e) ? Qh(o, d) : as(o, d, e, i));
                    else
                        throw WE(x(e[a]));
        }
        if (n1(o, c, e, i), X(e[a])) {
            let d = e[a][$];
            if (Array.isArray(d)) {
                let f = x(d);
                f.hasAttribute(eo) || pl(f, d, t, n);
            }
            o[Ko] ??= {}, o[Ko][l] = e1(e[a], c, e, t, n);
        }
        else if (Array.isArray(e[a]) && !kv(c)) {
            let d = x(e[a][$]);
            d.hasAttribute(eo) || pl(d, e[a], t, n);
        }
        else if (c.type & 8)
            o[ki] ??= {}, o[ki][l] = WM(r, e, c.child);
        else if (c.type & 144) {
            let d = c.next;
            for (; d !== null && d.type & 144;)
                d = d.next;
            d && !Yo(d) && as(o, d, e, i);
        }
        else if (c.type & 1) {
            let d = x(e[a]);
            kf(n, d);
        }
        if (s && c.type & 2) {
            let d = x(e[a]);
            s.has(d) && Nf(d, s.get(d), t);
        }
    }
} return o; }
function n1(e, t, n, o) { Kl(t) || (t.projectionNext && t.projectionNext !== t.next && !Yo(t.projectionNext) && as(e, t.projectionNext, n, o), t.prev === null && t.parent !== null && rr(t.parent, n) && !rr(t, n) && as(e, t, n, o)); }
function o1(e) { let t = e[H]; if (!t?.constructor)
    return !1; let n = Q(t.constructor); return n?.encapsulation === Xe.ShadowDom || n?.encapsulation === Xe.ExperimentalIsolatedShadowDom; }
function pl(e, t, n, o) { let r = t[M]; if (Og(t) && !xc() || o1(t))
    return r.setAttribute(e, eo, ""), null; {
    let i = ZM(t, n, o), s = o.serializedViewCollection.add(i);
    return r.setAttribute(e, Po, s.toString()), s;
} }
function _M(e, t) { e.textContent = `ngh=${t}`; }
function r1(e, t) { for (let [n, o] of e)
    n.after(t.createComment(o)); }
function i1(e) { let t = e; for (; t != null;) {
    if (Ne(t))
        return !0;
    t = t.parent;
} return !1; }
function s1(e, t, n, o) { let r = Ry(e.hydrateTriggers); for (let i of r)
    o.eventTypesToReplay.regular.add(i); if (r.length > 0) {
    let i = t.filter(s => s.nodeType === Node.ELEMENT_NODE);
    for (let s of i)
        Nf(s, r, n);
} }
function Wj(e) { let t = g(); for (; t;) {
    if (t[m].type === 1 && e(t[H]))
        return t[H];
    if (it(t))
        break;
    t = qe(t);
} return null; }
var a1 = "\u{1F170}\uFE0F", ml = !1;
function zj(e) { if (!ml)
    return; let { startLabel: t } = YM(e); performance.mark(t); }
function Qj(e) { if (!ml)
    return; let { startLabel: t, labelName: n, endLabel: o } = YM(e); performance.mark(o), performance.measure(n, t, o), performance.clearMarks(t), performance.clearMarks(o); }
function YM(e) { let t = `${a1}:${e}`; return { labelName: t, startLabel: `start:${t}`, endLabel: `end:${t}` }; }
var bM = !1;
function Zj() { if (!bM && (typeof performance > "u" || !performance.mark || !performance.measure)) {
    bM = !0, console.warn("Performance API is not supported on this platform");
    return;
} ml = !0; }
function Yj() { ml = !1; }
function Kj(e) { }
function Jj(e) { return typeof e == "boolean" ? e : e != null && e !== "false"; }
function Xj(e, t = NaN) { return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t; }
var Zh = Symbol("NOT_SET"), KM = new Set, c1 = ne(F({}, hs), { kind: "afterRenderEffectPhase", consumerIsAlwaysLive: !0, consumerAllowSignalWrites: !0, value: Zh, cleanup: null, consumerMarkedDirty() { if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase)
            return;
        this.sequence.erroredOrDestroyed = !0;
    } this.sequence.scheduler.notify(7); }, phaseFn(e) { if (this.sequence.lastPhase = this.phase, !this.dirty)
        return this.signal; if (this.dirty = !1, this.value !== Zh && !lo(this))
        return this.signal; try {
        for (let r of this.cleanup ?? KM)
            r();
    }
    finally {
        this.cleanup?.clear();
    } let t = []; e !== void 0 && t.push(e), t.push(this.registerCleanupFn); let n = Mt(this), o; try {
        o = this.userFn.apply(null, t);
    }
    finally {
        Kt(this, n);
    } return (this.value === Zh || !this.equal(this.value, o)) && (this.value = o, this.version++), this.signal; } }), og = class extends pi {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    onDestroyFns = null;
    constructor(t, n, o, r, i, s = null) { super(t, [void 0, void 0, void 0, void 0], o, !1, i.get(De), s), this.scheduler = r; for (let a of Zf) {
        let c = n[a];
        if (c === void 0)
            continue;
        let l = Object.create(c1);
        l.sequence = this, l.phase = a, l.userFn = c, l.dirty = !0, l.signal = () => (Yt(l), l.value), l.signal[K] = l, l.registerCleanupFn = u => (l.cleanup ??= new Set).add(u), this.nodes[a] = l, this.hooks[a] = u => l.phaseFn(u);
    } }
    afterRun() { super.afterRun(), this.lastPhase = null; }
    destroy() { if (this.onDestroyFns !== null)
        for (let t of this.onDestroyFns)
            t(); super.destroy(); for (let t of this.nodes)
        if (t)
            try {
                for (let n of t.cleanup ?? KM)
                    n();
            }
            finally {
                Jt(t);
            } }
};
function eV(e, t) { if (typeof ngServerMode < "u" && ngServerMode)
    return pc; let n = t?.injector ?? E(se), o = n.get(We), r = n.get(fc), i = n.get(oo, null, { optional: !0 }); r.impl ??= n.get(Yf); let s = e; typeof s == "function" && (s = { mixedReadWrite: e }); let a = n.get(wo, null, { optional: !0 }), c = new og(r.impl, [s.earlyRead, s.write, s.mixedReadWrite, s.read], a?.view, o, n, i?.snapshot(null)); return r.impl.register(c), c; }
function tV(e) { return te({ usage: 1, kind: "directive", type: e.type }).compileDirectiveDeclaration(Ie, `ng:///${e.type.name}/\u0275fac.js`, e); }
function nV(e) { Sp(e.type, e.decorators, e.ctorParameters ?? null, e.propDecorators ?? null); }
function oV(e) { nD(e.type, e.resolveDeferredDeps, (...t) => { let n = e.resolveMetadata(...t); Sp(e.type, n.decorators, n.ctorParameters, n.propDecorators); }); }
function rV(e) { return te({ usage: 1, kind: "component", type: e.type }).compileComponentDeclaration(Ie, `ng:///${e.type.name}/\u0275cmp.js`, e); }
function iV(e) { return te({ usage: 1, kind: l1(e.target), type: e.type }).compileFactoryDeclaration(Ie, `ng:///${e.type.name}/\u0275fac.js`, e); }
function l1(e) { switch (e) {
    case ao.Directive: return "directive";
    case ao.Component: return "component";
    case ao.Injectable: return "injectable";
    case ao.Pipe: return "pipe";
    case ao.NgModule: return "NgModule";
    case ao.Service: return "service";
} }
function sV(e) { return te({ usage: 1, kind: "injectable", type: e.type }).compileInjectableDeclaration(Ie, `ng:///${e.type.name}/\u0275prov.js`, e); }
function aV(e) { return te({ usage: 1, kind: "NgModule", type: e.type }).compileInjectorDeclaration(Ie, `ng:///${e.type.name}/\u0275inj.js`, e); }
function cV(e) { return te({ usage: 1, kind: "NgModule", type: e.type }).compileNgModuleDeclaration(Ie, `ng:///${e.type.name}/\u0275mod.js`, e); }
function lV(e) { return te({ usage: 1, kind: "pipe", type: e.type }).compilePipeDeclaration(Ie, `ng:///${e.type.name}/\u0275pipe.js`, e); }
function uV(e) { return te({ usage: 1, kind: "service", type: e.type }).compileServiceDeclaration(Ie, `ng:///${e.type.name}/\u0275prov.js`, e); }
function dV(e) { let t = Rp(e); if (!t)
    throw JM(e); return new Go(t); }
function fV(e) { let t = Rp(e); if (!t)
    throw JM(e); return t; }
function JM(e) { return new T(920, !1); }
var rg = class extends AF {
}, AM = class extends rg {
}, pV = ZF(null, "core", []);
function hV(e, t) { let n = Q(e), o = t.elementInjector || vo(); return new Qn(n).create(o, t.projectableNodes, t.hostElement, t.environmentInjector, t.directives, t.bindings); }
function gV(e) { let t = Q(e); if (!t)
    return null; let n = new Qn(t); return { get selector() { return n.selector; }, get type() { return n.componentType; }, get inputs() { return n.inputs; }, get outputs() { return n.outputs; }, get ngContentSelectors() { return n.ngContentSelectors; }, get isStandalone() { return t.standalone; }, get isSignal() { return t.signals; } }; }
function u1(e) { return new ig(No(e) ? e : Le(e)); }
var ig = class {
    snapshot;
    constructor(t) { this.snapshot = t; }
    get state() { return this.snapshot(); }
    value = Le(() => { if (this.state.status === "error")
        throw new rs(this.state.error); return this.state.value; });
    status = Le(() => this.state.status);
    error = Le(() => this.state.status === "error" ? this.state.error : void 0);
    isLoading = Le(() => this.state.status === "loading" || this.state.status === "reloading");
    isValueDefined = Le(() => this.state.status !== "error" && this.state.value !== void 0);
    hasValue() { return this.isValueDefined(); }
};
function mV(e, t, n) { if (jh())
    throw Vh(); let o = n?.injector ?? E(se), r, i; o.get(De).onDestroy(() => { r = void 0; }); let s = Jc({ source: () => { try {
        return io(!0), { value: e(), thrown: !1 };
    }
    catch (a) {
        return is(a), { error: a, thrown: !0 };
    }
    finally {
        io(!1);
    } }, computation: (a, c) => c !== void 0 ? c.value : a.thrown ? { status: "error", error: a.error } : { status: "resolved", value: a.value } }); return Ws(() => { let a; try {
    io(!0), a = e();
}
catch (f) {
    is(f), s.set({ status: "error", error: f }), r = i = void 0;
    return;
}
finally {
    io(!1);
} let c = Re(s), l = n?.equal ?? Object.is; if (c.status === "reloading" || c.status === "loading") {
    if (l(a, i))
        return;
}
else if (c.status === "resolved" && l(a, c.value))
    return; let d = (typeof t == "number" ? () => new Promise(f => setTimeout(f, t)) : t)(a, c); d === void 0 ? (s.set({ status: "resolved", value: a }), r = i = void 0) : (c.status !== "loading" && c.status !== "error" && s.set({ status: "loading", value: c.value }), r = d, i = a, d.then(() => { r === d && (s.set({ status: "resolved", value: a }), r = i = void 0); })); }, { injector: o }), u1(s); }
function vV() { return !1; }
function yV() { }
function d1(e, t) { return Ce(this, null, function* () { if (typeof ngServerMode < "u" && ngServerMode)
    return; let n = globalThis.document.modelContext ?? globalThis.navigator.modelContext; if (!n || typeof n.registerTool != "function")
    return; let o = t ?? E(se), r = o.get(De), i = new AbortController, s = ne(F({}, e), { execute: (a, c) => Or(o, () => e.execute(a, ne(F({}, c), { signal: i.signal }))) }); r.onDestroy(() => { i.abort(); }), yield n.registerTool(s, { signal: i.signal }); }); }
function EV(e) { return je([Gl(() => { for (let t of e)
        d1(t); })]); }
export { iS as ANIMATION_MODULE_TYPE, Ki as APP_BOOTSTRAP_LISTENER, It as APP_ID, _p as APP_INITIALIZER, bp as ApplicationInitStatus, Sj as ApplicationModule, Ue as ApplicationRef, Yv as Attribute, Pw as COMPILER_OPTIONS, sS as CSP_NONCE, eb as CUSTOM_ELEMENTS_SCHEMA, Qa as ChangeDetectionStrategy, AF as ChangeDetectorRef, fP as Compiler, lf as CompilerFactory, rP as Component, mI as ComponentRef, wj as ContentChild, Cj as ContentChildren, hP as DEFAULT_CURRENCY_CODE, xt as DOCUMENT, Xn as DebugElement, uf as DebugEventListener, Si as DebugNode, Kh as DefaultIterableDiffer, De as DestroyRef, Ow as Directive, Qe as ENVIRONMENT_INITIALIZER, Ri as ElementRef, AM as EmbeddedViewRef, xe as EnvironmentInjector, bt as ErrorHandler, Nt as EventEmitter, fj as HOST_TAG_NAME, Zv as Host, fM as HostAttributeToken, cP as HostBinding, lP as HostListener, kr as INJECTOR, qv as Inject, YS as Injectable, C as InjectionToken, se as Injector, sP as Input, LM as IterableDiffers, PM as KeyValueDiffers, xh as LOCALE_ID, cE as MAX_ANIMATION_TIMEOUT, Fw as MissingTranslationStrategy, tb as NO_ERRORS_SCHEMA, uP as NgModule, zI as NgModuleFactory, Zn as NgModuleRef, W as NgZone, Wv as Optional, aP as Output, os as OutputEmitterRef, rS as PLATFORM_ID, _u as PLATFORM_INITIALIZER, qr as PendingTasks, iP as Pipe, HM as PlatformRef, ur as Query, Ta as QueryList, _j as REQUEST, Aj as REQUEST_CONTEXT, bj as RESPONSE_INIT, Od as Renderer2, yi as RendererFactory2, Sa as RendererStyleFlags2, Kc as ResourceDependencyError, ro as ResourceParamsStatus, vI as Sanitizer, q as SecurityContext, zv as Self, XS as Service, ga as SimpleChange, Qv as SkipSelf, gP as TRANSLATIONS, mP as TRANSLATIONS_FORMAT, gi as TemplateRef, Gk as Testability, kD as TestabilityRegistry, Ot as TransferState, Gv as Type, vs as VERSION, ms as Version, Nj as ViewChild, Mj as ViewChildren, Fc as ViewContainerRef, Xe as ViewEncapsulation, rg as ViewRef, hE as afterEveryRender, Kf as afterNextRender, eV as afterRenderEffect, vP as asNativeElements, BN as assertInInjectionContext, cS as assertNotInReactiveContext, YF as assertPlatform, Jj as booleanAttribute, Le as computed, Ij as contentChild, Dj as contentChildren, hV as createComponent, Mp as createEnvironmentInjector, jx as createNgModule, QF as createPlatform, ZF as createPlatformFactory, mV as debounced, d1 as declareExperimentalWebMcpTool, Uj as destroyPlatform, Ws as effect, yV as enableProdMode, Hk as enableProfiling, Cr as forwardRef, _i as getDebugNode, dV as getModuleFactory, fV as getNgModuleById, gl as getPlatform, Ag as importProvidersFrom, E as inject, pj as injectAsync, mj as input, MI as inputBinding, vV as isDevMode, No as isSignal, _r as isStandalone, zs as isWritableSignal, Jc as linkedSignal, je as makeEnvironmentProviders, om as makeStateKey, Tj as mergeApplicationConfig, vj as model, Xj as numberAttribute, hj as onIdle, gj as output, NI as outputBinding, pV as platformCore, oD as provideAppInitializer, tS as provideBrowserGlobalErrorListeners, jj as provideCheckNoChangesConfig, Gl as provideEnvironmentInitializer, EV as provideExperimentalWebMcpTools, jS as provideIdleServiceWith, Pb as provideNgReflectAttributes, $j as providePlatformInitializer, Lj as provideStabilityDebugging, Vj as provideZoneChangeDetection, dP as provideZonelessChangeDetection, gV as reflectComponentType, j as resolveForwardRef, MP as resource, u1 as resourceFromSnapshots, Or as runInInjectionContext, OD as setTestabilityGetter, Et as signal, sx as twoWayBinding, Re as untracked, yj as viewChild, Ej as viewChildren, aE as \u0275ANIMATIONS_DISABLED, cy as \u0275AcxChangeDetectionStrategy, ly as \u0275AcxViewEncapsulation, fc as \u0275AfterRenderManager, $w as \u0275CACHE_ACTIVE, Rj as \u0275CLIENT_RENDER_MODE_FLAG, L as \u0275CONTAINER_HEADER_OFFSET, We as \u0275ChangeDetectionScheduler, wk as \u0275Console, MD as \u0275ControlFlowBlockType, es as \u0275DEFAULT_LOCALE_ID, TD as \u0275DEFER_BLOCK_CONFIG, yk as \u0275DEFER_BLOCK_DEPENDENCY_INTERCEPTOR, $t as \u0275DEHYDRATED_BLOCK_REGISTRY, Lp as \u0275DeferBlockBehavior, Z as \u0275DeferBlockState, HF as \u0275ENABLE_ROOT_COMPONENT_BOOTSTRAP, py as \u0275EVENT_REPLAY_QUEUE, qs as \u0275EffectScheduler, fF as \u0275Framework, Sy as \u0275HydrationStatus, aS as \u0275IMAGE_CONFIG, nm as \u0275IMAGE_CONFIG_DEFAULTS, Wl as \u0275INJECTOR_SCOPE, dj as \u0275INPUT_SIGNAL_BRAND_WRITE_TYPE, kt as \u0275INTERNAL_APPLICATION_ERROR_HANDLER, S_ as \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, to as \u0275IS_HYDRATION_DOM_REUSE_ENABLED, Mf as \u0275IS_INCREMENTAL_HYDRATION_ENABLED, ji as \u0275JSACTION_BLOCK_ELEMENT_MAP, bf as \u0275JSACTION_EVENT_CONTRACT, Ca as \u0275LContext, wi as \u0275LocaleDataIndex, At as \u0275NG_COMP_DEF, An as \u0275NG_DIR_DEF, Rn as \u0275NG_ELEMENT_ID, gr as \u0275NG_INJ_DEF, Cs as \u0275NG_MOD_DEF, Sr as \u0275NG_PIPE_DEF, on as \u0275NG_PROV_DEF, da as \u0275NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, G as \u0275NO_CHANGE, Go as \u0275NgModuleFactory, Er as \u0275NoopNgZone, a1 as \u0275PERFORMANCE_MARK_PREFIX, PF as \u0275PROVIDED_NG_ZONE, uS as \u0275PROVIDED_ZONELESS, yt as \u0275PendingTasksInternal, P as \u0275ProfilerEvent, nt as \u0275R3Injector, Da as \u0275ReflectionCapabilities, Qn as \u0275Render3ComponentFactory, La as \u0275Render3ComponentRef, $o as \u0275Render3NgModuleRef, Xc as \u0275ResourceImpl, T as \u0275RuntimeError, SI as \u0275SHARED_STYLES_HOST, K as \u0275SIGNAL, Cy as \u0275SSR_CONTENT_INTEGRITY_MARKER, AD as \u0275TESTABILITY, RD as \u0275TESTABILITY_GETTER, DD as \u0275TimerScheduler, dc as \u0275TracingAction, oo as \u0275TracingService, xD as \u0275USE_PENDING_TASKS, Ht as \u0275ViewRef, Ds as \u0275XSS_SECURITY_URL, Mo as \u0275ZONELESS_ENABLED, Wy as \u0275_sanitizeHtml, sc as \u0275_sanitizeUrl, gn as \u0275allLeavingAnimations, nr as \u0275allowSanitizationBypassAndThrow, qj as \u0275annotateForHydration, Kj as \u0275assertType, ab as \u0275bypassSanitizationTrustHtml, db as \u0275bypassSanitizationTrustResourceUrl, lb as \u0275bypassSanitizationTrustScript, cb as \u0275bypassSanitizationTrustStyle, ub as \u0275bypassSanitizationTrustUrl, Gw as \u0275chain, zx as \u0275clearResolutionOfComponentResourcesQueue, ww as \u0275compileComponent, Rh as \u0275compileDirective, Tw as \u0275compileNgModule, Cw as \u0275compileNgModuleDefs, VF as \u0275compileNgModuleFactory, kw as \u0275compilePipe, Sn as \u0275convertToBitFlags, xl as \u0275createInjector, KF as \u0275createOrReusePlatformInjector, Pj as \u0275defaultIterableDiffers, Fj as \u0275defaultKeyValueDiffers, Uo as \u0275depsTracker, EI as \u0275devModeEqual, Yj as \u0275disableProfiling, Zj as \u0275enableProfiling, tl as \u0275encapsulateResourceError, eh as \u0275findLocaleData, Iw as \u0275flushModuleScopingQueueAsMuchAsPossible, Dr as \u0275formatRuntimeError, qL as \u0275generateStandaloneInDeclarationsError, Gx as \u0275getAsyncClassMetadataFn, YR as \u0275getClosestComponentName, Q as \u0275getComponentDef, Vk as \u0275getComponentInstanceDeepLinkId, Wj as \u0275getCurrentClosestComponentInstance, ha as \u0275getDeferBlocks, E_ as \u0275getDirectives, xi as \u0275getDocument, D_ as \u0275getHostElement, Nr as \u0275getInjectableDef, _e as \u0275getLContext, wO as \u0275getLocaleCurrencyCode, NT as \u0275getLocalePluralCase, CP as \u0275getOutputDestroyRef, Vy as \u0275getSanitizationBypassType, Bk as \u0275getTransferState, ob as \u0275getUnknownElementStrictMode, ib as \u0275getUnknownPropertyStrictMode, Fe as \u0275global, kI as \u0275inferTagNameFromDefinition, RF as \u0275injectChangeDetectorRef, Gj as \u0275internalCreateApplication, FF as \u0275internalProvideZoneChangeDetection, Wx as \u0275isComponentDefPendingResolution, jl as \u0275isEnvironmentProviders, jh as \u0275isInParamsFunction, DN as \u0275isInjectable, jn as \u0275isNgModule, wp as \u0275isPromise, WI as \u0275isSubscribable, YA as \u0275isViewDirty, KA as \u0275markForRefresh, pF as \u0275maybeUnwrapDefaultExport, Ct as \u0275noSideEffects, bh as \u0275patchComponentDefWithScope, re as \u0275performanceMarkFeature, To as \u0275promiseWithResolvers, Yc as \u0275provideZonelessChangeDetectionInternal, Uk as \u0275publishNonCoreGlobalUtil, V_ as \u0275readHydrationInfo, CO as \u0275registerLocaleData, Pt as \u0275renderDeferBlockState, QL as \u0275resetCompiledComponents, B_ as \u0275resetIncrementalHydrationEnabledWarnedForTests, LL as \u0275resetIncrementalHydrationRuntimeForTests, $L as \u0275resetJitOptions, rD as \u0275resolveComponentResources, Qx as \u0275restoreComponentResolutionQueue, Kx as \u0275setAllowDuplicateNgModuleIdsForTest, uF as \u0275setAlternateWeakRefImpl, mw as \u0275setClassDebugInfo, Sp as \u0275setClassMetadata, nD as \u0275setClassMetadataAsync, ft as \u0275setCurrentInjector, N_ as \u0275setDocument, io as \u0275setInParamsFunction, wN as \u0275setInjectorProfilerContext, AT as \u0275setLocaleId, nb as \u0275setUnknownElementStrictMode, rb as \u0275setUnknownPropertyStrictMode, zj as \u0275startMeasuring, Qj as \u0275stopMeasuring, Hr as \u0275store, Tr as \u0275stringify, Ah as \u0275transitiveScopesFor, Bc as \u0275triggerResourceLoading, EN as \u0275truncateMiddle, MO as \u0275unregisterLocaleData, Tt as \u0275unwrapSafeValue, nS as \u0275unwrapWritableSignal, xj as \u0275withDomHydration, EF as \u0275withEventReplay, kj as \u0275withI18nSupport, Oj as \u0275withIncrementalHydration, cD as \u0275\u0275ControlFeature, UC as \u0275\u0275ExternalStylesFeature, ao as \u0275\u0275FactoryTarget, lD as \u0275\u0275HostDirectivesFeature, xp as \u0275\u0275InheritDefinitionFeature, bv as \u0275\u0275NgOnChangesFeature, BC as \u0275\u0275ProvidersFeature, SE as \u0275\u0275advance, ti as \u0275\u0275animateEnter, ni as \u0275\u0275animateEnterListener, oi as \u0275\u0275animateLeave, ja as \u0275\u0275animateLeaveListener, Up as \u0275\u0275ariaProperty, jC as \u0275\u0275arrowFunction, SC as \u0275\u0275attachSourceLocations, $p as \u0275\u0275attribute, oC as \u0275\u0275classMap, ph as \u0275\u0275classProp, cT as \u0275\u0275componentInstance, uT as \u0275\u0275conditional, Uc as \u0275\u0275conditionalBranchCreate, lT as \u0275\u0275conditionalCreate, ch as \u0275\u0275contentQuery, uh as \u0275\u0275contentQuerySignal, CI as \u0275\u0275control, DI as \u0275\u0275controlCreate, Mh as \u0275\u0275declareLet, VD as \u0275\u0275defer, wD as \u0275\u0275deferEnableTimerScheduling, $D as \u0275\u0275deferHydrateNever, tT as \u0275\u0275deferHydrateOnHover, WD as \u0275\u0275deferHydrateOnIdle, ZD as \u0275\u0275deferHydrateOnImmediate, rT as \u0275\u0275deferHydrateOnInteraction, JD as \u0275\u0275deferHydrateOnTimer, aT as \u0275\u0275deferHydrateOnViewport, UD as \u0275\u0275deferHydrateWhen, XD as \u0275\u0275deferOnHover, GD as \u0275\u0275deferOnIdle, zD as \u0275\u0275deferOnImmediate, nT as \u0275\u0275deferOnInteraction, YD as \u0275\u0275deferOnTimer, iT as \u0275\u0275deferOnViewport, eT as \u0275\u0275deferPrefetchOnHover, qD as \u0275\u0275deferPrefetchOnIdle, QD as \u0275\u0275deferPrefetchOnImmediate, oT as \u0275\u0275deferPrefetchOnInteraction, KD as \u0275\u0275deferPrefetchOnTimer, sT as \u0275\u0275deferPrefetchOnViewport, BD as \u0275\u0275deferPrefetchWhen, HD as \u0275\u0275deferWhen, ZI as \u0275\u0275defineComponent, KI as \u0275\u0275defineDirective, J as \u0275\u0275defineInjectable, Mr as \u0275\u0275defineInjector, Np as \u0275\u0275defineNgModule, JI as \u0275\u0275definePipe, Ut as \u0275\u0275defineService, sr as \u0275\u0275directiveInject, su as \u0275\u0275disableBindings, Wp as \u0275\u0275domElement, Yp as \u0275\u0275domElementContainer, Zp as \u0275\u0275domElementContainerEnd, zc as \u0275\u0275domElementContainerStart, qc as \u0275\u0275domElementEnd, Gc as \u0275\u0275domElementStart, sh as \u0275\u0275domListener, Jp as \u0275\u0275domProperty, Op as \u0275\u0275domTemplate, qp as \u0275\u0275element, Qp as \u0275\u0275elementContainer, Xi as \u0275\u0275elementContainerEnd, Wc as \u0275\u0275elementContainerStart, $c as \u0275\u0275elementEnd, Ci as \u0275\u0275elementStart, iu as \u0275\u0275enableBindings, WC as \u0275\u0275enableIncrementalHydrationRuntime, DT as \u0275\u0275foreignComponent, CT as \u0275\u0275foreignContent, wT as \u0275\u0275foreignContentFn, gw as \u0275\u0275getComponentDepsFactory, MT as \u0275\u0275getCurrentView, Uv as \u0275\u0275getInheritedFactory, vw as \u0275\u0275getReplaceMetadataURL, BT as \u0275\u0275i18n, $T as \u0275\u0275i18nApply, UT as \u0275\u0275i18nAttributes, nh as \u0275\u0275i18nEnd, oh as \u0275\u0275i18nExp, GT as \u0275\u0275i18nPostprocess, th as \u0275\u0275i18nStart, me as \u0275\u0275inject, Wa as \u0275\u0275injectAttribute, _C as \u0275\u0275interpolate, bC as \u0275\u0275interpolate1, AC as \u0275\u0275interpolate2, RC as \u0275\u0275interpolate3, xC as \u0275\u0275interpolate4, kC as \u0275\u0275interpolate5, OC as \u0275\u0275interpolate6, LC as \u0275\u0275interpolate7, PC as \u0275\u0275interpolate8, FC as \u0275\u0275interpolateV, _I as \u0275\u0275invalidFactory, Ss as \u0275\u0275invalidFactoryDep, rh as \u0275\u0275listener, ZT as \u0275\u0275loadQuery, Iu as \u0275\u0275namespaceHTML, Eu as \u0275\u0275namespaceMathML, yu as \u0275\u0275namespaceSVG, qT as \u0275\u0275nextContext, nV as \u0275\u0275ngDeclareClassMetadata, oV as \u0275\u0275ngDeclareClassMetadataAsync, rV as \u0275\u0275ngDeclareComponent, tV as \u0275\u0275ngDeclareDirective, iV as \u0275\u0275ngDeclareFactory, sV as \u0275\u0275ngDeclareInjectable, aV as \u0275\u0275ngDeclareInjector, cV as \u0275\u0275ngDeclareNgModule, lV as \u0275\u0275ngDeclarePipe, uV as \u0275\u0275ngDeclareService, cw as \u0275\u0275pipe, lw as \u0275\u0275pipeBind1, uw as \u0275\u0275pipeBind2, dw as \u0275\u0275pipeBind3, fw as \u0275\u0275pipeBind4, pw as \u0275\u0275pipeBindV, zT as \u0275\u0275projection, WT as \u0275\u0275projectionDef, Gp as \u0275\u0275property, zC as \u0275\u0275pureFunction0, QC as \u0275\u0275pureFunction1, ZC as \u0275\u0275pureFunction2, YC as \u0275\u0275pureFunction3, KC as \u0275\u0275pureFunction4, JC as \u0275\u0275pureFunction5, XC as \u0275\u0275pureFunction6, ew as \u0275\u0275pureFunction7, tw as \u0275\u0275pureFunction8, nw as \u0275\u0275pureFunctionV, YT as \u0275\u0275queryAdvance, QT as \u0275\u0275queryRefresh, NC as \u0275\u0275readContextLet, KT as \u0275\u0275reference, Ap as \u0275\u0275registerNgModuleType, hT as \u0275\u0275repeater, pT as \u0275\u0275repeaterCreate, fT as \u0275\u0275repeaterTrackByIdentity, dT as \u0275\u0275repeaterTrackByIndex, yw as \u0275\u0275replaceMetadata, lu as \u0275\u0275resetView, $f as \u0275\u0275resolveBody, rE as \u0275\u0275resolveDocument, oE as \u0275\u0275resolveWindow, cu as \u0275\u0275restoreView, jf as \u0275\u0275sanitizeHtml, cc as \u0275\u0275sanitizeResourceUrl, Bf as \u0275\u0275sanitizeScript, Vf as \u0275\u0275sanitizeStyle, Hf as \u0275\u0275sanitizeUrl, eE as \u0275\u0275sanitizeUrlOrResourceUrl, $C as \u0275\u0275setComponentScope, GC as \u0275\u0275setNgModuleScope, MC as \u0275\u0275storeLet, nC as \u0275\u0275styleMap, fh as \u0275\u0275styleProp, ih as \u0275\u0275syntheticHostListener, Xp as \u0275\u0275syntheticHostProperty, kp as \u0275\u0275template, hw as \u0275\u0275templateRefExtractor, dC as \u0275\u0275text, hh as \u0275\u0275textInterpolate, Qc as \u0275\u0275textInterpolate1, gh as \u0275\u0275textInterpolate2, mh as \u0275\u0275textInterpolate3, vh as \u0275\u0275textInterpolate4, yh as \u0275\u0275textInterpolate5, Eh as \u0275\u0275textInterpolate6, Ih as \u0275\u0275textInterpolate7, Dh as \u0275\u0275textInterpolate8, Th as \u0275\u0275textInterpolateV, Jy as \u0275\u0275trustConstantHtml, Xy as \u0275\u0275trustConstantResourceUrl, CC as \u0275\u0275twoWayBindingSet, wh as \u0275\u0275twoWayListener, Ch as \u0275\u0275twoWayProperty, Uf as \u0275\u0275validateAttribute, lh as \u0275\u0275viewQuery, dh as \u0275\u0275viewQuerySignal };
/*! Bundled license information:

@angular/core/fesm2022/_effect-chunk.mjs:
@angular/core/fesm2022/_not_found-chunk.mjs:
@angular/core/fesm2022/_pending_tasks-chunk.mjs:
@angular/core/fesm2022/_attribute-chunk.mjs:
@angular/core/fesm2022/_debug_node-chunk.mjs:
@angular/core/fesm2022/_untracked-chunk.mjs:
@angular/core/fesm2022/_resource-chunk.mjs:
@angular/core/fesm2022/primitives-event-dispatch.mjs:
@angular/core/fesm2022/_weak_ref-chunk.mjs:
@angular/core/fesm2022/core.mjs:
  (**
   * @license Angular v22.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
