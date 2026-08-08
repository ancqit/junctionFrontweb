function C(t) { let r = t(o => { Error.call(o), o.stack = new Error().stack; }); return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r; }
var pe = C(t => function (r) {
    t(this), this.message = r ? `${r.length} errors occurred during unsubscription:
${r.map((o, n) => `${n + 1}) ${o.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = r;
});
function d(t) { return typeof t == "function"; }
function F(t, e) { if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
} }
var I = class t {
    constructor(e) { this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null; }
    unsubscribe() { let e; if (!this.closed) {
        this.closed = !0;
        let { _parentage: r } = this;
        if (r)
            if (this._parentage = null, Array.isArray(r))
                for (let i of r)
                    i.remove(this);
            else
                r.remove(this);
        let { initialTeardown: o } = this;
        if (d(o))
            try {
                o();
            }
            catch (i) {
                e = i instanceof pe ? i.errors : [i];
            }
        let { _finalizers: n } = this;
        if (n) {
            this._finalizers = null;
            for (let i of n)
                try {
                    lt(i);
                }
                catch (s) {
                    e = e ?? [], s instanceof pe ? e = [...e, ...s.errors] : e.push(s);
                }
        }
        if (e)
            throw new pe(e);
    } }
    add(e) { var r; if (e && e !== this)
        if (this.closed)
            lt(e);
        else {
            if (e instanceof t) {
                if (e.closed || e._hasParent(this))
                    return;
                e._addParent(this);
            }
            (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
        } }
    _hasParent(e) { let { _parentage: r } = this; return r === e || Array.isArray(r) && r.includes(e); }
    _addParent(e) { let { _parentage: r } = this; this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e; }
    _removeParent(e) { let { _parentage: r } = this; r === e ? this._parentage = null : Array.isArray(r) && F(r, e); }
    remove(e) { let { _finalizers: r } = this; r && F(r, e), e instanceof t && e._removeParent(this); }
};
I.EMPTY = (() => { let t = new I; return t.closed = !0, t; })();
var qe = I.EMPTY;
function me(t) { return t instanceof I || t && "closed" in t && d(t.remove) && d(t.add) && d(t.unsubscribe); }
function lt(t) { d(t) ? t() : t.unsubscribe(); }
var L = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: !1, useDeprecatedNextContext: !1 };
function g() { }
var te = { setTimeout(t, e, ...r) { let { delegate: o } = te; return o?.setTimeout ? o.setTimeout(t, e, ...r) : setTimeout(t, e, ...r); }, clearTimeout(t) { let { delegate: e } = te; return (e?.clearTimeout || clearTimeout)(t); }, delegate: void 0 };
function ae(t) { te.setTimeout(() => { let { onUnhandledError: e } = L; if (e)
    e(t);
else
    throw t; }); }
var pt = $e("C", void 0, void 0);
function mt(t) { return $e("E", void 0, t); }
function at(t) { return $e("N", t, void 0); }
function $e(t, e, r) { return { kind: t, value: e, error: r }; }
var B = null;
function re(t) { if (L.useDeprecatedSynchronousErrorHandling) {
    let e = !B;
    if (e && (B = { errorThrown: !1, error: null }), t(), e) {
        let { errorThrown: r, error: o } = B;
        if (B = null, r)
            throw o;
    }
}
else
    t(); }
function dt(t) { L.useDeprecatedSynchronousErrorHandling && B && (B.errorThrown = !0, B.error = t); }
var K = class extends I {
    constructor(e) { super(), this.isStopped = !1, e ? (this.destination = e, me(e) && e.add(this)) : this.destination = nr; }
    static create(e, r, o) { return new W(e, r, o); }
    next(e) { this.isStopped ? Be(at(e), this) : this._next(e); }
    error(e) { this.isStopped ? Be(mt(e), this) : (this.isStopped = !0, this._error(e)); }
    complete() { this.isStopped ? Be(pt, this) : (this.isStopped = !0, this._complete()); }
    unsubscribe() { this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null); }
    _next(e) { this.destination.next(e); }
    _error(e) { try {
        this.destination.error(e);
    }
    finally {
        this.unsubscribe();
    } }
    _complete() { try {
        this.destination.complete();
    }
    finally {
        this.unsubscribe();
    } }
}, rr = Function.prototype.bind;
function Ge(t, e) { return rr.call(t, e); }
var Ke = class {
    constructor(e) { this.partialObserver = e; }
    next(e) { let { partialObserver: r } = this; if (r.next)
        try {
            r.next(e);
        }
        catch (o) {
            de(o);
        } }
    error(e) { let { partialObserver: r } = this; if (r.error)
        try {
            r.error(e);
        }
        catch (o) {
            de(o);
        }
    else
        de(e); }
    complete() { let { partialObserver: e } = this; if (e.complete)
        try {
            e.complete();
        }
        catch (r) {
            de(r);
        } }
}, W = class extends K {
    constructor(e, r, o) { super(); let n; if (d(e) || !e)
        n = { next: e ?? void 0, error: r ?? void 0, complete: o ?? void 0 };
    else {
        let i;
        this && L.useDeprecatedNextContext ? (i = Object.create(e), i.unsubscribe = () => this.unsubscribe(), n = { next: e.next && Ge(e.next, i), error: e.error && Ge(e.error, i), complete: e.complete && Ge(e.complete, i) }) : n = e;
    } this.destination = new Ke(n); }
};
function de(t) { L.useDeprecatedSynchronousErrorHandling ? dt(t) : ae(t); }
function or(t) { throw t; }
function Be(t, e) { let { onStoppedNotification: r } = L; r && te.setTimeout(() => r(t, e)); }
var nr = { closed: !0, next: g, error: or, complete: g };
var oe = typeof Symbol == "function" && Symbol.observable || "@@observable";
function E(t) { return t; }
function he(...t) { return Ze(t); }
function Ze(t) { return t.length === 0 ? E : t.length === 1 ? t[0] : function (r) { return t.reduce((o, n) => n(o), r); }; }
var v = class t {
    constructor(e) { e && (this._subscribe = e); }
    lift(e) { let r = new t; return r.source = this, r.operator = e, r; }
    subscribe(e, r, o) { let n = sr(e) ? e : new W(e, r, o); return re(() => { let { operator: i, source: s } = this; n.add(i ? i.call(n, s) : s ? this._subscribe(n) : this._trySubscribe(n)); }), n; }
    _trySubscribe(e) { try {
        return this._subscribe(e);
    }
    catch (r) {
        e.error(r);
    } }
    forEach(e, r) { return r = ht(r), new r((o, n) => { let i = new W({ next: s => { try {
            e(s);
        }
        catch (c) {
            n(c), i.unsubscribe();
        } }, error: n, complete: o }); this.subscribe(i); }); }
    _subscribe(e) { var r; return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e); }
    [oe]() { return this; }
    pipe(...e) { return Ze(e)(this); }
    toPromise(e) { return e = ht(e), new e((r, o) => { let n; this.subscribe(i => n = i, i => o(i), () => r(n)); }); }
};
v.create = t => new v(t);
function ht(t) { var e; return (e = t ?? L.Promise) !== null && e !== void 0 ? e : Promise; }
function ir(t) { return t && d(t.next) && d(t.error) && d(t.complete); }
function sr(t) { return t && t instanceof K || ir(t) && me(t); }
function Je(t) { return d(t?.lift); }
function f(t) { return e => { if (Je(e))
    return e.lift(function (r) { try {
        return t(r, this);
    }
    catch (o) {
        this.error(o);
    } }); throw new TypeError("Unable to lift unknown Observable type"); }; }
function l(t, e, r, o, n) { return new Z(t, e, r, o, n); }
var Z = class extends K {
    constructor(e, r, o, n, i, s) { super(e), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = r ? function (c) { try {
        r(c);
    }
    catch (u) {
        e.error(u);
    } } : super._next, this._error = n ? function (c) { try {
        n(c);
    }
    catch (u) {
        e.error(u);
    }
    finally {
        this.unsubscribe();
    } } : super._error, this._complete = o ? function () { try {
        o();
    }
    catch (c) {
        e.error(c);
    }
    finally {
        this.unsubscribe();
    } } : super._complete; }
    unsubscribe() { var e; if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        let { closed: r } = this;
        super.unsubscribe(), !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    } }
};
function bt() { return f((t, e) => { let r = null; t._refCount++; let o = l(e, void 0, void 0, void 0, () => { if (!t || t._refCount <= 0 || 0 < --t._refCount) {
    r = null;
    return;
} let n = t._connection, i = r; r = null, n && (!i || n === i) && n.unsubscribe(), e.unsubscribe(); }); t.subscribe(o), o.closed || (r = t.connect()); }); }
var D = class extends v {
    constructor(e, r) { super(), this.source = e, this.subjectFactory = r, this._subject = null, this._refCount = 0, this._connection = null, Je(e) && (this.lift = e.lift); }
    _subscribe(e) { return this.getSubject().subscribe(e); }
    getSubject() { let e = this._subject; return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject; }
    _teardown() { this._refCount = 0; let { _connection: e } = this; this._subject = this._connection = null, e?.unsubscribe(); }
    connect() { let e = this._connection; if (!e) {
        e = this._connection = new I;
        let r = this.getSubject();
        e.add(this.source.subscribe(l(r, void 0, () => { this._teardown(), r.complete(); }, o => { this._teardown(), r.error(o); }, () => this._teardown()))), e.closed && (this._connection = null, e = I.EMPTY);
    } return e; }
    refCount() { return bt()(this); }
};
var xt = C(t => function () { t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"; });
var S = class extends v {
    constructor() { super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null; }
    lift(e) { let r = new be(this, this); return r.operator = e, r; }
    _throwIfClosed() { if (this.closed)
        throw new xt; }
    next(e) { re(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.currentObservers || (this.currentObservers = Array.from(this.observers));
        for (let r of this.currentObservers)
            r.next(e);
    } }); }
    error(e) { re(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.hasError = this.isStopped = !0, this.thrownError = e;
        let { observers: r } = this;
        for (; r.length;)
            r.shift().error(e);
    } }); }
    complete() { re(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.isStopped = !0;
        let { observers: e } = this;
        for (; e.length;)
            e.shift().complete();
    } }); }
    unsubscribe() { this.isStopped = this.closed = !0, this.observers = this.currentObservers = null; }
    get observed() { var e; return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0; }
    _trySubscribe(e) { return this._throwIfClosed(), super._trySubscribe(e); }
    _subscribe(e) { return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e); }
    _innerSubscribe(e) { let { hasError: r, isStopped: o, observers: n } = this; return r || o ? qe : (this.currentObservers = null, n.push(e), new I(() => { this.currentObservers = null, F(n, e); })); }
    _checkFinalizedStatuses(e) { let { hasError: r, thrownError: o, isStopped: n } = this; r ? e.error(o) : n && e.complete(); }
    asObservable() { let e = new v; return e.source = this, e; }
};
S.create = (t, e) => new be(t, e);
var be = class extends S {
    constructor(e, r) { super(), this.destination = e, this.source = r; }
    next(e) { var r, o; (o = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || o === void 0 || o.call(r, e); }
    error(e) { var r, o; (o = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || o === void 0 || o.call(r, e); }
    complete() { var e, r; (r = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || r === void 0 || r.call(e); }
    _subscribe(e) { var r, o; return (o = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e)) !== null && o !== void 0 ? o : qe; }
};
var xe = class extends S {
    constructor(e) { super(), this._value = e; }
    get value() { return this.getValue(); }
    _subscribe(e) { let r = super._subscribe(e); return !r.closed && e.next(this._value), r; }
    getValue() { let { hasError: e, thrownError: r, _value: o } = this; if (e)
        throw r; return this._throwIfClosed(), o; }
    next(e) { super.next(this._value = e); }
};
var J = { now() { return (J.delegate || Date).now(); }, delegate: void 0 };
var ne = class extends S {
    constructor(e = 1 / 0, r = 1 / 0, o = J) { super(), this._bufferSize = e, this._windowTime = r, this._timestampProvider = o, this._buffer = [], this._infiniteTimeWindow = !0, this._infiniteTimeWindow = r === 1 / 0, this._bufferSize = Math.max(1, e), this._windowTime = Math.max(1, r); }
    next(e) { let { isStopped: r, _buffer: o, _infiniteTimeWindow: n, _timestampProvider: i, _windowTime: s } = this; r || (o.push(e), !n && o.push(i.now() + s)), this._trimBuffer(), super.next(e); }
    _subscribe(e) { this._throwIfClosed(), this._trimBuffer(); let r = this._innerSubscribe(e), { _infiniteTimeWindow: o, _buffer: n } = this, i = n.slice(); for (let s = 0; s < i.length && !e.closed; s += o ? 1 : 2)
        e.next(i[s]); return this._checkFinalizedStatuses(e), r; }
    _trimBuffer() { let { _bufferSize: e, _timestampProvider: r, _buffer: o, _infiniteTimeWindow: n } = this, i = (n ? 1 : 2) * e; if (e < 1 / 0 && i < o.length && o.splice(0, o.length - i), !n) {
        let s = r.now(), c = 0;
        for (let u = 1; u < o.length && o[u] <= s; u += 2)
            c = u;
        c && o.splice(0, c + 1);
    } }
};
var ye = class extends S {
    constructor() { super(...arguments), this._value = null, this._hasValue = !1, this._isComplete = !1; }
    _checkFinalizedStatuses(e) { let { hasError: r, _hasValue: o, _value: n, thrownError: i, isStopped: s, _isComplete: c } = this; r ? e.error(i) : (s || c) && (o && e.next(n), e.complete()); }
    next(e) { this.isStopped || (this._value = e, this._hasValue = !0); }
    complete() { let { _hasValue: e, _value: r, _isComplete: o } = this; o || (this._isComplete = !0, e && super.next(r), super.complete()); }
};
var Xe = (() => { class t {
    constructor(r, o = t.now) { this.schedulerActionCtor = r, this.now = o; }
    schedule(r, o = 0, n) { return new this.schedulerActionCtor(this, r).schedule(n, o); }
} return t.now = J.now, t; })();
var ve = class extends I {
    constructor(e, r) { super(); }
    schedule(e, r = 0) { return this; }
};
var le = { setInterval(t, e, ...r) { let { delegate: o } = le; return o?.setInterval ? o.setInterval(t, e, ...r) : setInterval(t, e, ...r); }, clearInterval(t) { let { delegate: e } = le; return (e?.clearInterval || clearInterval)(t); }, delegate: void 0 };
var we = class extends ve {
    constructor(e, r) { super(e, r), this.scheduler = e, this.work = r, this.pending = !1; }
    schedule(e, r = 0) { var o; if (this.closed)
        return this; this.state = e; let n = this.id, i = this.scheduler; return n != null && (this.id = this.recycleAsyncId(i, n, r)), this.pending = !0, this.delay = r, this.id = (o = this.id) !== null && o !== void 0 ? o : this.requestAsyncId(i, this.id, r), this; }
    requestAsyncId(e, r, o = 0) { return le.setInterval(e.flush.bind(e, this), o); }
    recycleAsyncId(e, r, o = 0) { if (o != null && this.delay === o && this.pending === !1)
        return r; r != null && le.clearInterval(r); }
    execute(e, r) { if (this.closed)
        return new Error("executing a cancelled action"); this.pending = !1; let o = this._execute(e, r); if (o)
        return o; this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null)); }
    _execute(e, r) { let o = !1, n; try {
        this.work(e);
    }
    catch (i) {
        o = !0, n = i || new Error("Scheduled action threw falsy error");
    } if (o)
        return this.unsubscribe(), n; }
    unsubscribe() { if (!this.closed) {
        let { id: e, scheduler: r } = this, { actions: o } = r;
        this.work = this.state = this.scheduler = null, this.pending = !1, F(o, this), e != null && (this.id = this.recycleAsyncId(r, e, null)), this.delay = null, super.unsubscribe();
    } }
};
var _e = class extends Xe {
    constructor(e, r = Xe.now) { super(e, r), this.actions = [], this._active = !1; }
    flush(e) { let { actions: r } = this; if (this._active) {
        r.push(e);
        return;
    } let o; this._active = !0; do
        if (o = e.execute(e.state, e.delay))
            break;
    while (e = r.shift()); if (this._active = !1, o) {
        for (; e = r.shift();)
            e.unsubscribe();
        throw o;
    } }
};
var A = new _e(we), Se = A;
var V = new v(t => t.complete());
function fn(t) { return t ? ur(t) : V; }
function ur(t) { return new v(e => t.schedule(() => e.complete())); }
function T(t, e, r, o = 0, n = !1) { let i = e.schedule(function () { r(), n ? t.add(this.schedule(null, o)) : this.unsubscribe(); }, o); if (t.add(i), !n)
    return i; }
function ge(t, e = 0) { return f((r, o) => { r.subscribe(l(o, n => T(o, t, () => o.next(n), e), () => T(o, t, () => o.complete(), e), n => T(o, t, () => o.error(n), e))); }); }
function Ee(t, e = 0) { return f((r, o) => { o.add(t.schedule(() => r.subscribe(o), e)); }); }
function vt(t, e, r, o) { function n(i) { return i instanceof r ? i : new r(function (s) { s(i); }); } return new (r || (r = Promise))(function (i, s) { function c(m) { try {
    p(o.next(m));
}
catch (x) {
    s(x);
} } function u(m) { try {
    p(o.throw(m));
}
catch (x) {
    s(x);
} } function p(m) { m.done ? i(m.value) : n(m.value).then(c, u); } p((o = o.apply(t, e || [])).next()); }); }
function yt(t) { var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], o = 0; if (r)
    return r.call(t); if (t && typeof t.length == "number")
    return { next: function () { return t && o >= t.length && (t = void 0), { value: t && t[o++], done: !t }; } }; throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined."); }
function X(t) { return this instanceof X ? (this.v = t, this) : new X(t); }
function wt(t, e, r) { if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined."); var o = r.apply(t, e || []), n, i = []; return n = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), c("next"), c("throw"), c("return", s), n[Symbol.asyncIterator] = function () { return this; }, n; function s(y) { return function (h) { return Promise.resolve(h).then(y, x); }; } function c(y, h) { o[y] && (n[y] = function (b) { return new Promise(function (w, O) { i.push([y, b, w, O]) > 1 || u(y, b); }); }, h && (n[y] = h(n[y]))); } function u(y, h) { try {
    p(o[y](h));
}
catch (b) {
    _(i[0][3], b);
} } function p(y) { y.value instanceof X ? Promise.resolve(y.value.v).then(m, x) : _(i[0][2], y); } function m(y) { u("next", y); } function x(y) { u("throw", y); } function _(y, h) { y(h), i.shift(), i.length && u(i[0][0], i[0][1]); } }
function _t(t) { if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined."); var e = t[Symbol.asyncIterator], r; return e ? e.call(t) : (t = typeof yt == "function" ? yt(t) : t[Symbol.iterator](), r = {}, o("next"), o("throw"), o("return"), r[Symbol.asyncIterator] = function () { return this; }, r); function o(i) { r[i] = t[i] && function (s) { return new Promise(function (c, u) { s = t[i](s), n(c, u, s.done, s.value); }); }; } function n(i, s, c, u) { Promise.resolve(u).then(function (p) { i({ value: p, done: c }); }, s); } }
var Oe = (t => t && typeof t.length == "number" && typeof t != "function");
function Ie(t) { return d(t?.then); }
function Te(t) { return d(t[oe]); }
function Ae(t) { return Symbol.asyncIterator && d(t?.[Symbol.asyncIterator]); }
function Fe(t) { return new TypeError(`You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`); }
function cr() { return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator; }
var je = cr();
function Pe(t) { return d(t?.[je]); }
function Ce(t) { return wt(this, arguments, function* () { let r = t.getReader(); try {
    for (;;) {
        let { value: o, done: n } = yield X(r.read());
        if (n)
            return yield X(void 0);
        yield yield X(o);
    }
}
finally {
    r.releaseLock();
} }); }
function Re(t) { return d(t?.getReader); }
function a(t) { if (t instanceof v)
    return t; if (t != null) {
    if (Te(t))
        return fr(t);
    if (Oe(t))
        return lr(t);
    if (Ie(t))
        return pr(t);
    if (Ae(t))
        return St(t);
    if (Pe(t))
        return mr(t);
    if (Re(t))
        return ar(t);
} throw Fe(t); }
function fr(t) { return new v(e => { let r = t[oe](); if (d(r.subscribe))
    return r.subscribe(e); throw new TypeError("Provided object does not correctly implement Symbol.observable"); }); }
function lr(t) { return new v(e => { for (let r = 0; r < t.length && !e.closed; r++)
    e.next(t[r]); e.complete(); }); }
function pr(t) { return new v(e => { t.then(r => { e.closed || (e.next(r), e.complete()); }, r => e.error(r)).then(null, ae); }); }
function mr(t) { return new v(e => { for (let r of t)
    if (e.next(r), e.closed)
        return; e.complete(); }); }
function St(t) { return new v(e => { dr(t, e).catch(r => e.error(r)); }); }
function ar(t) { return St(Ce(t)); }
function dr(t, e) { var r, o, n, i; return vt(this, void 0, void 0, function* () { try {
    for (r = _t(t); o = yield r.next(), !o.done;) {
        let s = o.value;
        if (e.next(s), e.closed)
            return;
    }
}
catch (s) {
    n = { error: s };
}
finally {
    try {
        o && !o.done && (i = r.return) && (yield i.call(r));
    }
    finally {
        if (n)
            throw n.error;
    }
} e.complete(); }); }
function gt(t, e) { return a(t).pipe(Ee(e), ge(e)); }
function Et(t, e) { return a(t).pipe(Ee(e), ge(e)); }
function Ot(t, e) { return new v(r => { let o = 0; return e.schedule(function () { o === t.length ? r.complete() : (r.next(t[o++]), r.closed || this.schedule()); }); }); }
function It(t, e) { return new v(r => { let o; return T(r, e, () => { o = t[je](), T(r, e, () => { let n, i; try {
    ({ value: n, done: i } = o.next());
}
catch (s) {
    r.error(s);
    return;
} i ? r.complete() : r.next(n); }, 0, !0); }), () => d(o?.return) && o.return(); }); }
function Me(t, e) { if (!t)
    throw new Error("Iterable cannot be null"); return new v(r => { T(r, e, () => { let o = t[Symbol.asyncIterator](); T(r, e, () => { o.next().then(n => { n.done ? r.complete() : r.next(n.value); }); }, 0, !0); }); }); }
function Tt(t, e) { return Me(Ce(t), e); }
function At(t, e) { if (t != null) {
    if (Te(t))
        return gt(t, e);
    if (Oe(t))
        return Ot(t, e);
    if (Ie(t))
        return Et(t, e);
    if (Ae(t))
        return Me(t, e);
    if (Pe(t))
        return It(t, e);
    if (Re(t))
        return Tt(t, e);
} throw Fe(t); }
function N(t, e) { return e ? At(t, e) : a(t); }
function ke(t) { return t && d(t.schedule); }
function He(t) { return t[t.length - 1]; }
function z(t) { return d(He(t)) ? t.pop() : void 0; }
function j(t) { return ke(He(t)) ? t.pop() : void 0; }
function Ft(t, e) { return typeof He(t) == "number" ? t.pop() : e; }
function Le(...t) { let e = j(t); return N(t, e); }
function jt(t, e) { let r = d(t) ? t : () => t, o = n => n.error(r()); return new v(e ? n => e.schedule(o, 0, n) : o); }
var hr = (function (t) { return t.NEXT = "N", t.ERROR = "E", t.COMPLETE = "C", t; })(hr || {}), Y = class t {
    constructor(e, r, o) { this.kind = e, this.value = r, this.error = o, this.hasValue = e === "N"; }
    observe(e) { return Qe(this, e); }
    do(e, r, o) { let { kind: n, value: i, error: s } = this; return n === "N" ? e?.(i) : n === "E" ? r?.(s) : o?.(); }
    accept(e, r, o) { var n; return d((n = e) === null || n === void 0 ? void 0 : n.next) ? this.observe(e) : this.do(e, r, o); }
    toObservable() { let { kind: e, value: r, error: o } = this, n = e === "N" ? Le(r) : e === "E" ? jt(() => o) : e === "C" ? V : 0; if (!n)
        throw new TypeError(`Unexpected notification kind ${e}`); return n; }
    static createNext(e) { return new t("N", e); }
    static createError(e) { return new t("E", void 0, e); }
    static createComplete() { return t.completeNotification; }
};
Y.completeNotification = new Y("C");
function Qe(t, e) { var r, o, n; let { kind: i, value: s, error: c } = t; if (typeof i != "string")
    throw new TypeError('Invalid notification, missing "kind"'); i === "N" ? (r = e.next) === null || r === void 0 || r.call(e, s) : i === "E" ? (o = e.error) === null || o === void 0 || o.call(e, c) : (n = e.complete) === null || n === void 0 || n.call(e); }
var q = C(t => function () { t(this), this.name = "EmptyError", this.message = "no elements in sequence"; });
var et = C(t => function () { t(this), this.name = "ArgumentOutOfRangeError", this.message = "argument out of range"; });
var Pt = C(t => function (r) { t(this), this.name = "NotFoundError", this.message = r; });
var Ct = C(t => function (r) { t(this), this.name = "SequenceError", this.message = r; });
function ie(t) { return t instanceof Date && !isNaN(t); }
var br = C(t => function (r = null) { t(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = r; });
function Rt(t, e) { let { first: r, each: o, with: n = xr, scheduler: i = e ?? A, meta: s = null } = ie(t) ? { first: t } : typeof t == "number" ? { each: t } : t; if (r == null && o == null)
    throw new TypeError("No timeout provided."); return f((c, u) => { let p, m, x = null, _ = 0, y = h => { m = T(u, i, () => { try {
    p.unsubscribe(), a(n({ meta: s, lastValue: x, seen: _ })).subscribe(u);
}
catch (b) {
    u.error(b);
} }, h); }; p = c.subscribe(l(u, h => { m?.unsubscribe(), _++, u.next(x = h), o > 0 && y(o); }, void 0, void 0, () => { m?.closed || m?.unsubscribe(), x = null; })), !_ && y(r != null ? typeof r == "number" ? r : +r - i.now() : o); }); }
function xr(t) { throw new br(t); }
function R(t, e) { return f((r, o) => { let n = 0; r.subscribe(l(o, i => { o.next(t.call(e, i, n++)); })); }); }
var { isArray: yr } = Array, { getPrototypeOf: vr, prototype: wr, keys: _r } = Object;
function Mt(t) { if (t.length === 1) {
    let e = t[0];
    if (yr(e))
        return { args: e, keys: null };
    if (Sr(e)) {
        let r = _r(e);
        return { args: r.map(o => e[o]), keys: r };
    }
} return { args: t, keys: null }; }
function Sr(t) { return t && typeof t == "object" && vr(t) === wr; }
var { isArray: gr } = Array;
function Er(t, e) { return gr(e) ? t(...e) : t(e); }
function se(t) { return R(e => Er(t, e)); }
function kt(t, e) { return t.reduce((r, o, n) => (r[o] = e[n], r), {}); }
function Vt(...t) { let e = j(t), r = z(t), { args: o, keys: n } = Mt(t); if (o.length === 0)
    return N([], e); let i = new v(tt(o, e, n ? s => kt(n, s) : E)); return r ? i.pipe(se(r)) : i; }
function tt(t, e, r = E) { return o => { Lt(e, () => { let { length: n } = t, i = new Array(n), s = n, c = n; for (let u = 0; u < n; u++)
    Lt(e, () => { let p = N(t[u], e), m = !1; p.subscribe(l(o, x => { i[u] = x, m || (m = !0, c--), c || o.next(r(i.slice())); }, () => { --s || o.complete(); })); }, o); }, o); }; }
function Lt(t, e, r) { t ? T(r, t, e) : e(); }
function ue(t, e, r, o, n, i, s, c) { let u = [], p = 0, m = 0, x = !1, _ = () => { x && !u.length && !p && e.complete(); }, y = b => p < o ? h(b) : u.push(b), h = b => { i && e.next(b), p++; let w = !1; a(r(b, m++)).subscribe(l(e, O => { n?.(O), i ? y(O) : e.next(O); }, () => { w = !0; }, void 0, () => { if (w)
    try {
        for (p--; u.length && p < o;) {
            let O = u.shift();
            s ? T(e, s, () => h(O)) : h(O);
        }
        _();
    }
    catch (O) {
        e.error(O);
    } })); }; return t.subscribe(l(e, y, () => { x = !0, _(); })), () => { c?.(); }; }
function P(t, e, r = 1 / 0) { return d(e) ? P((o, n) => R((i, s) => e(o, i, n, s))(a(t(o, n))), r) : (typeof e == "number" && (r = e), f((o, n) => ue(o, n, t, r))); }
function Ve(t = 1 / 0) { return P(E, t); }
function Ne() { return Ve(1); }
function H(...t) { return Ne()(N(t, j(t))); }
function M(t = 0, e, r = Se) { let o = -1; return e != null && (ke(e) ? r = e : o = e), new v(n => { let i = ie(t) ? +t - r.now() : t; i < 0 && (i = 0); let s = 0; return r.schedule(function () { n.closed || (n.next(s++), 0 <= o ? this.schedule(void 0, o) : n.complete()); }, i); }); }
function Nt(t = 0, e = A) { return t < 0 && (t = 0), M(t, t, e); }
var { isArray: Or } = Array;
function U(t) { return t.length === 1 && Or(t[0]) ? t[0] : t; }
function Ut(...t) { let e = U(t); return new v(r => { let o = 0, n = () => { if (o < e.length) {
    let i;
    try {
        i = a(e[o++]);
    }
    catch {
        n();
        return;
    }
    let s = new Z(r, void 0, g, g);
    i.subscribe(s), s.add(n);
}
else
    r.complete(); }; n(); }); }
function $(t, e) { return f((r, o) => { let n = 0; r.subscribe(l(o, i => t.call(e, i, n++) && o.next(i))); }); }
function hu(...t) { return t = U(t), t.length === 1 ? a(t[0]) : new v(rt(t)); }
function rt(t) { return e => { let r = []; for (let o = 0; r && !e.closed && o < t.length; o++)
    r.push(a(t[o]).subscribe(l(e, n => { if (r) {
        for (let i = 0; i < r.length; i++)
            i !== o && r[i].unsubscribe();
        r = null;
    } e.next(n); }))); }; }
function Ue(...t) { let e = z(t), r = U(t); return r.length ? new v(o => { let n = r.map(() => []), i = r.map(() => !1); o.add(() => { n = i = null; }); for (let s = 0; !o.closed && s < r.length; s++)
    a(r[s]).subscribe(l(o, c => { if (n[s].push(c), n.every(u => u.length)) {
        let u = n.map(p => p.shift());
        o.next(e ? e(...u) : u), n.some((p, m) => !p.length && i[m]) && o.complete();
    } }, () => { i[s] = !0, !n[s].length && o.complete(); })); return () => { n = i = null; }; }) : V; }
function Wt(t) { return f((e, r) => { let o = !1, n = null, i = null, s = !1, c = () => { if (i?.unsubscribe(), i = null, o) {
    o = !1;
    let p = n;
    n = null, r.next(p);
} s && r.complete(); }, u = () => { i = null, s && r.complete(); }; e.subscribe(l(r, p => { o = !0, n = p, i || a(t(p)).subscribe(i = l(r, c, u)); }, () => { s = !0, (!o || !i || i.closed) && r.complete(); })); }); }
function Pu(t, e = A) { return Wt(() => M(t, e)); }
function Vu(t) { return f((e, r) => { let o = []; return e.subscribe(l(r, n => o.push(n), () => { r.next(o), r.complete(); })), a(t).subscribe(l(r, () => { let n = o; o = [], r.next(n); }, g)), () => { o = null; }; }); }
function zu(t, e = null) { return e = e ?? t, f((r, o) => { let n = [], i = 0; r.subscribe(l(o, s => { let c = null; i++ % e === 0 && n.push([]); for (let u of n)
    u.push(s), t <= u.length && (c = c ?? [], c.push(u)); if (c)
    for (let u of c)
        F(n, u), o.next(u); }, () => { for (let s of n)
    o.next(s); o.complete(); }, void 0, () => { n = null; })); }); }
function Xu(t, ...e) { var r, o; let n = (r = j(e)) !== null && r !== void 0 ? r : A, i = (o = e[0]) !== null && o !== void 0 ? o : null, s = e[1] || 1 / 0; return f((c, u) => { let p = [], m = !1, x = h => { let { buffer: b, subs: w } = h; w.unsubscribe(), F(p, h), u.next(b), m && _(); }, _ = () => { if (p) {
    let h = new I;
    u.add(h);
    let w = { buffer: [], subs: h };
    p.push(w), T(h, n, () => x(w), t);
} }; i !== null && i >= 0 ? T(u, n, _, i, !0) : m = !0, _(); let y = l(u, h => { let b = p.slice(); for (let w of b) {
    let { buffer: O } = w;
    O.push(h), s <= O.length && x(w);
} }, () => { for (; p?.length;)
    u.next(p.shift().buffer); y?.unsubscribe(), u.complete(), u.unsubscribe(); }, void 0, () => p = null); c.subscribe(y); }); }
function ic(t, e) { return f((r, o) => { let n = []; a(t).subscribe(l(o, i => { let s = []; n.push(s); let c = new I, u = () => { F(n, s), o.next(s), c.unsubscribe(); }; c.add(a(e(i)).subscribe(l(o, u, g))); }, g)), r.subscribe(l(o, i => { for (let s of n)
    s.push(i); }, () => { for (; n.length > 0;)
    o.next(n.shift()); o.complete(); })); }); }
function pc(t) { return f((e, r) => { let o = null, n = null, i = () => { n?.unsubscribe(); let s = o; o = [], s && r.next(s), a(t()).subscribe(n = l(r, i, g)); }; i(), e.subscribe(l(r, s => o?.push(s), () => { o && r.next(o), r.complete(); }, void 0, () => o = n = null)); }); }
function Ir(t) { return f((e, r) => { let o = null, n = !1, i; o = e.subscribe(l(r, void 0, void 0, s => { i = a(t(s, Ir(t)(e))), o ? (o.unsubscribe(), o = null, i.subscribe(r)) : n = !0; })), n && (o.unsubscribe(), o = null, i.subscribe(r)); }); }
function We(t, e, r, o, n) { return (i, s) => { let c = r, u = e, p = 0; i.subscribe(l(s, m => { let x = p++; u = c ? t(u, m, x) : (c = !0, m), o && s.next(u); }, n && (() => { c && s.next(u), s.complete(); }))); }; }
function G(t, e) { return f(We(t, e, arguments.length >= 2, !1, !0)); }
var Tr = (t, e) => (t.push(e), t);
function Dt() { return f((t, e) => { G(Tr, [])(t).subscribe(e); }); }
function De(t, e) { return he(Dt(), P(r => t(r)), e ? se(e) : E); }
function zt(t) { return De(Vt, t); }
var kc = zt;
function ot(...t) { let e = z(t); return e ? he(ot(...t), se(e)) : f((r, o) => { tt([r, ...U(t)])(o); }); }
function $c(...t) { return ot(...t); }
function nt(t, e) { return d(e) ? P(t, e, 1) : P(t, 1); }
function Hc(t, e) { return d(e) ? nt(() => t, e) : nt(() => t); }
function Yt(...t) { let e = j(t); return f((r, o) => { Ne()(N([r, ...t], e)).subscribe(o); }); }
function uf(...t) { return Yt(...t); }
function qt(t) { return new v(e => t.subscribe(e)); }
var Ar = { connector: () => new S };
function ze(t, e = Ar) { let { connector: r } = e; return f((o, n) => { let i = r(); a(t(qt(i))).subscribe(n), n.add(o.subscribe(i)); }); }
function xf(t) { return G((e, r, o) => !t || t(r, o) ? e + 1 : e, 0); }
function gf(t) { return f((e, r) => { let o = !1, n = null, i = null, s = () => { if (i?.unsubscribe(), i = null, o) {
    o = !1;
    let c = n;
    n = null, r.next(c);
} }; e.subscribe(l(r, c => { i?.unsubscribe(), o = !0, n = c, i = l(r, s, g), a(t(c)).subscribe(i); }, () => { s(), r.complete(); }, void 0, () => { n = i = null; })); }); }
function Af(t, e = A) { return f((r, o) => { let n = null, i = null, s = null, c = () => { if (n) {
    n.unsubscribe(), n = null;
    let p = i;
    i = null, o.next(p);
} }; function u() { let p = s + t, m = e.now(); if (m < p) {
    n = this.schedule(void 0, p - m), o.add(n);
    return;
} c(); } r.subscribe(l(o, p => { i = p, s = e.now(), n || (n = e.schedule(u, t), o.add(n)); }, () => { c(), o.complete(); }, void 0, () => { i = n = null; })); }); }
function ce(t) { return f((e, r) => { let o = !1; e.subscribe(l(r, n => { o = !0, r.next(n); }, () => { o || r.next(t), r.complete(); })); }); }
function Q(t) { return t <= 0 ? () => V : f((e, r) => { let o = 0; e.subscribe(l(r, n => { ++o <= t && (r.next(n), t <= o && r.complete()); })); }); }
function $t() { return f((t, e) => { t.subscribe(l(e, g)); }); }
function Gt(t) { return R(() => t); }
function it(t, e) { return e ? r => H(e.pipe(Q(1), $t()), r.pipe(it(t))) : P((r, o) => a(t(r, o)).pipe(Q(1), Gt(r))); }
function Qf(t, e = A) { let r = M(t, e); return it(() => r); }
function nl() { return f((t, e) => { t.subscribe(l(e, r => Qe(r, e))); }); }
function ll(t, e) { return f((r, o) => { let n = new Set; r.subscribe(l(o, i => { let s = t ? t(i) : i; n.has(s) || (n.add(s), o.next(i)); })), e && a(e).subscribe(l(o, () => n.clear(), g)); }); }
function Bt(t, e = E) { return t = t ?? Fr, f((r, o) => { let n, i = !0; r.subscribe(l(o, s => { let c = e(s); (i || !t(n, c)) && (i = !1, n = c, o.next(s)); })); }); }
function Fr(t, e) { return t === e; }
function xl(t, e) { return Bt((r, o) => e ? e(r[t], o[t]) : r[t] === o[t]); }
function fe(t = jr) { return f((e, r) => { let o = !1; e.subscribe(l(r, n => { o = !0, r.next(n); }, () => o ? r.complete() : r.error(t()))); }); }
function jr() { return new q; }
function Al(t, e) { if (t < 0)
    throw new et; let r = arguments.length >= 2; return o => o.pipe($((n, i) => i === t), Q(1), r ? ce(e) : fe(() => new et)); }
function Cl(...t) { return e => H(e, Le(...t)); }
function Ll(t, e) { return f((r, o) => { let n = 0; r.subscribe(l(o, i => { t.call(e, i, n++, r) || (o.next(!1), o.complete()); }, () => { o.next(!0), o.complete(); })); }); }
function st(t, e) { return e ? r => r.pipe(st((o, n) => a(t(o, n)).pipe(R((i, s) => e(o, i, n, s))))) : f((r, o) => { let n = 0, i = null, s = !1; r.subscribe(l(o, c => { i || (i = l(o, void 0, () => { i = null, s && o.complete(); }), a(t(c, n++)).subscribe(i)); }, () => { s = !0, !i && o.complete(); })); }); }
function Kt() { return st(E); }
var Bl = Kt;
function Xl(t, e = 1 / 0, r) { return e = (e || 0) < 1 ? 1 / 0 : e, f((o, n) => ue(o, n, t, e, void 0, !0, r)); }
function ep(t) { return f((e, r) => { try {
    e.subscribe(r);
}
finally {
    r.add(t);
} }); }
function np(t, e) { return f(ut(t, e, "value")); }
function ut(t, e, r) { let o = r === "index"; return (n, i) => { let s = 0; n.subscribe(l(i, c => { let u = s++; t.call(e, c, u, n) && (i.next(o ? u : c), i.complete()); }, () => { i.next(o ? -1 : void 0), i.complete(); })); }; }
function cp(t, e) { return f(ut(t, e, "index")); }
function bp(t, e) { let r = arguments.length >= 2; return o => o.pipe(t ? $((n, i) => t(n, i, o)) : E, Q(1), r ? ce(e) : fe(() => new q)); }
function gp(t, e, r, o) { return f((n, i) => { let s; !e || typeof e == "function" ? s = e : { duration: r, element: s, connector: o } = e; let c = new Map, u = h => { c.forEach(h), h(i); }, p = h => u(b => b.error(h)), m = 0, x = !1, _ = new Z(i, h => { try {
    let b = t(h), w = c.get(b);
    if (!w) {
        c.set(b, w = o ? o() : new S);
        let O = y(b, w);
        if (i.next(O), r) {
            let k = l(w, () => { w.complete(), k?.unsubscribe(); }, void 0, void 0, () => c.delete(b));
            _.add(a(r(O)).subscribe(k));
        }
    }
    w.next(s ? s(h) : h);
}
catch (b) {
    p(b);
} }, () => u(h => h.complete()), p, () => c.clear(), () => (x = !0, m === 0)); n.subscribe(_); function y(h, b) { let w = new v(O => { m++; let k = b.subscribe(O); return () => { k.unsubscribe(), --m === 0 && x && _.unsubscribe(); }; }); return w.key = h, w; } }); }
function Tp() { return f((t, e) => { t.subscribe(l(e, () => { e.next(!1), e.complete(); }, () => { e.next(!0), e.complete(); })); }); }
function Zt(t) { return t <= 0 ? () => V : f((e, r) => { let o = []; e.subscribe(l(r, n => { o.push(n), t < o.length && o.shift(); }, () => { for (let n of o)
    r.next(n); r.complete(); }, void 0, () => { o = null; })); }); }
function Up(t, e) { let r = arguments.length >= 2; return o => o.pipe(t ? $((n, i) => t(n, i, o)) : E, Zt(1), r ? ce(e) : fe(() => new q)); }
function qp() { return f((t, e) => { t.subscribe(l(e, r => { e.next(Y.createNext(r)); }, () => { e.next(Y.createComplete()), e.complete(); }, r => { e.next(Y.createError(r)), e.complete(); })); }); }
function Kp(t) { return G(d(t) ? (e, r) => t(e, r) > 0 ? e : r : (e, r) => e > r ? e : r); }
var Xp = P;
function tm(t, e, r = 1 / 0) { return d(e) ? P(() => t, e, r) : (typeof e == "number" && (r = e), P(() => t, r)); }
function im(t, e, r = 1 / 0) { return f((o, n) => { let i = e; return ue(o, n, (s, c) => t(i, s, c), r, s => { i = s; }, !1, void 0, () => i = null); }); }
function Jt(...t) { let e = j(t), r = Ft(t, 1 / 0); return f((o, n) => { Ve(r)(N([o, ...t], e)).subscribe(n); }); }
function am(...t) { return Jt(...t); }
function xm(t) { return G(d(t) ? (e, r) => t(e, r) < 0 ? e : r : (e, r) => e < r ? e : r); }
function Ye(t, e) { let r = d(t) ? t : () => t; return d(e) ? ze(e, { connector: r }) : o => new D(o, r); }
function Pr(...t) { let e = U(t); return r => Ut(r, ...e); }
var Om = Pr;
function Fm() { return f((t, e) => { let r, o = !1; t.subscribe(l(e, n => { let i = r; r = n, o && e.next([i, n]), o = !0; })); }); }
function Cm(...t) { let e = t.length; if (e === 0)
    throw new Error("list of properties cannot be empty."); return R(r => { let o = r; for (let n = 0; n < e; n++) {
    let i = o?.[t[n]];
    if (typeof i < "u")
        o = i;
    else
        return;
} return o; }); }
function Vm(t) { return t ? e => ze(t)(e) : e => Ye(new S)(e); }
function Dm(t) { return e => { let r = new xe(t); return new D(e, () => r); }; }
function $m() { return t => { let e = new ye; return new D(t, () => e); }; }
function Jm(t, e, r, o) { r && !d(r) && (o = r); let n = d(r) ? r : void 0; return i => Ye(new ne(t, e, o), n)(i); }
function ta(...t) { return t.length ? f((e, r) => { rt([e, ...t])(r); }) : E; }
function ca(t) { let e = 1 / 0, r; return t != null && (typeof t == "object" ? { count: e = 1 / 0, delay: r } = t : e = t), e <= 0 ? () => V : f((o, n) => { let i = 0, s, c = () => { if (s?.unsubscribe(), s = null, r != null) {
    let p = typeof r == "number" ? M(r) : a(r(i)), m = l(n, () => { m.unsubscribe(), u(); });
    p.subscribe(m);
}
else
    u(); }, u = () => { let p = !1; s = o.subscribe(l(n, void 0, () => { ++i < e ? s ? c() : p = !0 : n.complete(); })), p && c(); }; u(); }); }
function da(t) { return f((e, r) => { let o, n = !1, i, s = !1, c = !1, u = () => c && s && (r.complete(), !0), p = () => (i || (i = new S, a(t(i)).subscribe(l(r, () => { o ? m() : n = !0; }, () => { s = !0, u(); }))), i), m = () => { c = !1, o = e.subscribe(l(r, void 0, () => { c = !0, !u() && p().next(); })), n && (o.unsubscribe(), o = null, n = !1, m()); }; m(); }); }
function _a(t = 1 / 0) { let e; t && typeof t == "object" ? e = t : e = { count: t }; let { count: r = 1 / 0, delay: o, resetOnSuccess: n = !1 } = e; return r <= 0 ? E : f((i, s) => { let c = 0, u, p = () => { let m = !1; u = i.subscribe(l(s, x => { n && (c = 0), s.next(x); }, void 0, x => { if (c++ < r) {
    let _ = () => { u ? (u.unsubscribe(), u = null, p()) : m = !0; };
    if (o != null) {
        let y = typeof o == "number" ? M(o) : a(o(x, c)), h = l(s, () => { h.unsubscribe(), _(); }, () => { s.complete(); });
        y.subscribe(h);
    }
    else
        _();
}
else
    s.error(x); })), m && (u.unsubscribe(), u = null, p()); }; p(); }); }
function Ta(t) { return f((e, r) => { let o, n = !1, i, s = () => { o = e.subscribe(l(r, void 0, void 0, c => { i || (i = new S, a(t(i)).subscribe(l(r, () => o ? s() : n = !0))), i && i.next(c); })), n && (o.unsubscribe(), o = null, n = !1, s()); }; s(); }); }
function Xt(t) { return f((e, r) => { let o = !1, n = null; e.subscribe(l(r, i => { o = !0, n = i; })), a(t).subscribe(l(r, () => { if (o) {
    o = !1;
    let i = n;
    n = null, r.next(i);
} }, g)); }); }
function Va(t, e = A) { return Xt(Nt(t, e)); }
function Da(t, e) { return f(We(t, e, arguments.length >= 2, !0)); }
function Ga(t, e = (r, o) => r === o) { return f((r, o) => { let n = Ht(), i = Ht(), s = u => { o.next(u), o.complete(); }, c = (u, p) => { let m = l(o, x => { let { buffer: _, complete: y } = p; _.length === 0 ? y ? s(!1) : u.buffer.push(x) : !e(x, _.shift()) && s(!1); }, () => { u.complete = !0; let { complete: x, buffer: _ } = p; x && s(_.length === 0), m?.unsubscribe(); }); return m; }; r.subscribe(c(n, i)), a(t).subscribe(c(i, n)); }); }
function Ht() { return { buffer: [], complete: !1 }; }
function Qt(t = {}) { let { connector: e = () => new S, resetOnError: r = !0, resetOnComplete: o = !0, resetOnRefCountZero: n = !0 } = t; return i => { let s, c, u, p = 0, m = !1, x = !1, _ = () => { c?.unsubscribe(), c = void 0; }, y = () => { _(), s = u = void 0, m = x = !1; }, h = () => { let b = s; y(), b?.unsubscribe(); }; return f((b, w) => { p++, !x && !m && _(); let O = u = u ?? e(); w.add(() => { p--, p === 0 && !x && !m && (c = ct(h, n)); }), O.subscribe(w), !s && p > 0 && (s = new W({ next: k => O.next(k), error: k => { x = !0, _(), c = ct(y, r, k), O.error(k); }, complete: () => { m = !0, _(), c = ct(y, o), O.complete(); } }), a(b).subscribe(s)); })(i); }; }
function ct(t, e, ...r) { if (e === !0) {
    t();
    return;
} if (e === !1)
    return; let o = new W({ next: () => { o.unsubscribe(), t(); } }); return a(e(...r)).subscribe(o); }
function td(t, e, r) { let o, n = !1; return t && typeof t == "object" ? { bufferSize: o = 1 / 0, windowTime: e = 1 / 0, refCount: n = !1, scheduler: r } = t : o = t ?? 1 / 0, Qt({ connector: () => new ne(o, e, r), resetOnError: !0, resetOnComplete: !1, resetOnRefCountZero: n }); }
function cd(t) { return f((e, r) => { let o = !1, n, i = !1, s = 0; e.subscribe(l(r, c => { i = !0, (!t || t(c, s++, e)) && (o && r.error(new Ct("Too many matching values")), o = !0, n = c); }, () => { o ? (r.next(n), r.complete()) : r.error(i ? new Pt("No matching values") : new q); })); }); }
function pd(t) { return $((e, r) => t <= r); }
function bd(t) { return t <= 0 ? E : f((e, r) => { let o = new Array(t), n = 0; return e.subscribe(l(r, i => { let s = n++; if (s < t)
    o[s] = i;
else {
    let c = s % t, u = o[c];
    o[c] = i, r.next(u);
} })), () => { o = null; }; }); }
function Sd(t) { return f((e, r) => { let o = !1, n = l(r, () => { n?.unsubscribe(), o = !0; }, g); a(t).subscribe(n), e.subscribe(l(r, i => o && r.next(i))); }); }
function Id(t) { return f((e, r) => { let o = !1, n = 0; e.subscribe(l(r, i => (o || (o = !t(i, n++))) && r.next(i))); }); }
function Pd(...t) { let e = j(t); return f((r, o) => { (e ? H(t, r, e) : H(t, r)).subscribe(o); }); }
function ee(t, e) { return f((r, o) => { let n = null, i = 0, s = !1, c = () => s && !n && o.complete(); r.subscribe(l(o, u => { n?.unsubscribe(); let p = 0, m = i++; a(t(u, m)).subscribe(n = l(o, x => o.next(e ? e(u, x, m, p++) : x), () => { n = null, c(); })); }, () => { s = !0, c(); })); }); }
function Ud() { return ee(E); }
function Yd(t, e) { return d(e) ? ee(() => t, e) : ee(() => t); }
function Bd(t, e) { return f((r, o) => { let n = e; return ee((i, s) => t(n, i, s), (i, s) => (n = s, s))(r).subscribe(o), () => { n = null; }; }); }
function Qd(t) { return f((e, r) => { a(t).subscribe(l(r, () => r.complete(), g)), !r.closed && e.subscribe(r); }); }
function oh(t, e = !1) { return f((r, o) => { let n = 0; r.subscribe(l(o, i => { let s = t(i, n++); (s || e) && o.next(i), !s && o.complete(); })); }); }
function fh(t, e, r) { let o = d(t) || e || r ? { next: t, error: e, complete: r } : t; return o ? f((n, i) => { var s; (s = o.subscribe) === null || s === void 0 || s.call(o); let c = !0; n.subscribe(l(i, u => { var p; (p = o.next) === null || p === void 0 || p.call(o, u), i.next(u); }, () => { var u; c = !1, (u = o.complete) === null || u === void 0 || u.call(o), i.complete(); }, u => { var p; c = !1, (p = o.error) === null || p === void 0 || p.call(o, u), i.error(u); }, () => { var u, p; c && ((u = o.unsubscribe) === null || u === void 0 || u.call(o)), (p = o.finalize) === null || p === void 0 || p.call(o); })); }) : E; }
function er(t, e) { return f((r, o) => { let { leading: n = !0, trailing: i = !1 } = e ?? {}, s = !1, c = null, u = null, p = !1, m = () => { u?.unsubscribe(), u = null, i && (y(), p && o.complete()); }, x = () => { u = null, p && o.complete(); }, _ = h => u = a(t(h)).subscribe(l(o, m, x)), y = () => { if (s) {
    s = !1;
    let h = c;
    c = null, o.next(h), !p && _(h);
} }; r.subscribe(l(o, h => { s = !0, c = h, !(u && !u.closed) && (n ? y() : _(h)); }, () => { p = !0, !(i && s && u && !u.closed) && o.complete(); })); }); }
function yh(t, e = A, r) { let o = M(t, e); return er(() => o, r); }
function gh(t = A) { return f((e, r) => { let o = t.now(); e.subscribe(l(r, n => { let i = t.now(), s = i - o; o = i, r.next(new ft(n, s)); })); }); }
var ft = class {
    constructor(e, r) { this.value = e, this.interval = r; }
};
function Ah(t, e, r) { let o, n, i; if (r = r ?? Se, ie(t) ? o = t : typeof t == "number" && (n = t), e)
    i = () => e;
else
    throw new TypeError("No observable provided to switch to"); if (o == null && n == null)
    throw new TypeError("No timeout provided."); return Rt({ first: o, each: n, scheduler: r, with: i }); }
function Ch(t = J) { return R(e => ({ value: e, timestamp: t.now() })); }
function Uh(t) { return f((e, r) => { let o = new S; r.next(o.asObservable()); let n = i => { o.error(i), r.error(i); }; return e.subscribe(l(r, i => o?.next(i), () => { o.complete(), r.complete(); }, n)), a(t).subscribe(l(r, () => { o.complete(), r.next(o = new S); }, g, n)), () => { o?.unsubscribe(), o = null; }; }); }
function qh(t, e = 0) { let r = e > 0 ? e : t; return f((o, n) => { let i = [new S], s = [], c = 0; n.next(i[0].asObservable()), o.subscribe(l(n, u => { for (let m of i)
    m.next(u); let p = c - t + 1; if (p >= 0 && p % r === 0 && i.shift().complete(), ++c % r === 0) {
    let m = new S;
    i.push(m), n.next(m.asObservable());
} }, () => { for (; i.length > 0;)
    i.shift().complete(); n.complete(); }, u => { for (; i.length > 0;)
    i.shift().error(u); n.error(u); }, () => { s = null, i = null; })); }); }
function eb(t, ...e) { var r, o; let n = (r = j(e)) !== null && r !== void 0 ? r : A, i = (o = e[0]) !== null && o !== void 0 ? o : null, s = e[1] || 1 / 0; return f((c, u) => { let p = [], m = !1, x = b => { let { window: w, subs: O } = b; w.complete(), O.unsubscribe(), F(p, b), m && _(); }, _ = () => { if (p) {
    let b = new I;
    u.add(b);
    let w = new S, O = { window: w, subs: b, seen: 0 };
    p.push(O), u.next(w.asObservable()), T(b, n, () => x(O), t);
} }; i !== null && i >= 0 ? T(u, n, _, i, !0) : m = !0, _(); let y = b => p.slice().forEach(b), h = b => { y(({ window: w }) => b(w)), b(u), u.unsubscribe(); }; return c.subscribe(l(u, b => { y(w => { w.window.next(b), s <= ++w.seen && x(w); }); }, () => h(b => b.complete()), b => h(w => w.error(b)))), () => { p = null; }; }); }
function fb(t, e) { return f((r, o) => { let n = [], i = s => { for (; 0 < n.length;)
    n.shift().error(s); o.error(s); }; a(t).subscribe(l(o, s => { let c = new S; n.push(c); let u = new I, p = () => { F(n, c), c.complete(), u.unsubscribe(); }, m; try {
    m = a(e(s));
}
catch (x) {
    i(x);
    return;
} o.next(c.asObservable()), u.add(m.subscribe(l(o, p, g, i))); }, g)), r.subscribe(l(o, s => { let c = n.slice(); for (let u of c)
    u.next(s); }, () => { for (; 0 < n.length;)
    n.shift().complete(); o.complete(); }, i, () => { for (; 0 < n.length;)
    n.shift().unsubscribe(); })); }); }
function hb(t) { return f((e, r) => { let o, n, i = c => { o.error(c), r.error(c); }, s = () => { n?.unsubscribe(), o?.complete(), o = new S, r.next(o.asObservable()); let c; try {
    c = a(t());
}
catch (u) {
    i(u);
    return;
} c.subscribe(n = l(r, s, s, i)); }; s(), e.subscribe(l(r, c => o.next(c), () => { o.complete(), r.complete(); }, i, () => { n?.unsubscribe(), o = null; })); }); }
function gb(...t) { let e = z(t); return f((r, o) => { let n = t.length, i = new Array(n), s = t.map(() => !1), c = !1; for (let u = 0; u < n; u++)
    a(t[u]).subscribe(l(o, p => { i[u] = p, !c && !s[u] && (s[u] = !0, (c = s.every(E)) && (s = null)); }, g)); r.subscribe(l(o, u => { if (c) {
    let p = [u, ...i];
    o.next(e ? e(...p) : p);
} })); }); }
function Tb(t) { return De(Ue, t); }
function tr(...t) { return f((e, r) => { Ue(e, ...t).subscribe(r); }); }
function Rb(...t) { return tr(...t); }
function kb(t, e) { return (r, o) => !t.call(e, r, o); }
export { d as a, pe as b, I as c, L as d, g as e, K as f, W as g, oe as h, E as i, he as j, v as k, l, bt as m, D as n, xt as o, S as p, xe as q, ne as r, ye as s, we as t, Xe as u, _e as v, A as w, Se as x, V as y, fn as z, ke as A, z as B, j as C, Ft as D, Oe as E, a as F, ge as G, Ee as H, It as I, At as J, N as K, Le as L, jt as M, hr as N, Y as O, q as P, et as Q, Pt as R, Ct as S, br as T, Rt as U, R as V, se as W, Mt as X, kt as Y, Vt as Z, P as _, Ve as $, Ne as aa, H as ba, M as ca, Nt as da, U as ea, Ut as fa, kb as ga, $ as ha, hu as ia, Ue as ja, Wt as ka, Pu as la, Vu as ma, zu as na, Xu as oa, ic as pa, pc as qa, Ir as ra, G as sa, Dt as ta, zt as ua, kc as va, ot as wa, $c as xa, nt as ya, Hc as za, Yt as Aa, uf as Ba, ze as Ca, xf as Da, gf as Ea, Af as Fa, ce as Ga, Q as Ha, $t as Ia, Gt as Ja, it as Ka, Qf as La, nl as Ma, ll as Na, Bt as Oa, xl as Pa, fe as Qa, Al as Ra, Cl as Sa, Ll as Ta, st as Ua, Kt as Va, Bl as Wa, Xl as Xa, ep as Ya, np as Za, cp as _a, bp as $a, gp as ab, Tp as bb, Zt as cb, Up as db, qp as eb, Kp as fb, Xp as gb, tm as hb, im as ib, Jt as jb, am as kb, xm as lb, Ye as mb, Pr as nb, Om as ob, Fm as pb, Cm as qb, Vm as rb, Dm as sb, $m as tb, Jm as ub, ta as vb, ca as wb, da as xb, _a as yb, Ta as zb, Xt as Ab, Va as Bb, Da as Cb, Ga as Db, Qt as Eb, td as Fb, cd as Gb, pd as Hb, bd as Ib, Sd as Jb, Id as Kb, Pd as Lb, ee as Mb, Ud as Nb, Yd as Ob, Bd as Pb, Qd as Qb, oh as Rb, fh as Sb, er as Tb, yh as Ub, gh as Vb, Ah as Wb, Ch as Xb, Uh as Yb, qh as Zb, eb as _b, fb as $b, hb as ac, gb as bc, Tb as cc, tr as dc, Rb as ec };
