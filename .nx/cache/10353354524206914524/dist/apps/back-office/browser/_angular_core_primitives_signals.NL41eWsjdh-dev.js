import { setAlternateWeakRefImpl } from "@nf-internal/chunk-PWK6T57A";
import { BASE_EFFECT_NODE, REACTIVE_NODE, SIGNAL, SIGNAL_NODE, consumerAfterComputation, consumerBeforeComputation, consumerDestroy, consumerMarkDirty, consumerPollProducersForChange, createComputed, createLinkedSignal, createSignal, defaultEquals, finalizeConsumerAfterComputation, getActiveConsumer, isInNotificationPhase, isReactive, linkedSignalSetFn, linkedSignalUpdateFn, producerAccessed, producerIncrementEpoch, producerMarkClean, producerNotifyConsumers, producerUpdateValueVersion, producerUpdatesAllowed, resetConsumerBeforeComputation, runEffect, runPostProducerCreatedFn, runPostSignalSetFn, setActiveConsumer, setPostProducerCreatedFn, setPostSignalSetFn, setThrowInvalidWriteToSignalError, signalGetFn, signalSetFn, signalUpdateFn, untracked } from "@nf-internal/chunk-MQ44NPZ3";
import { __spreadProps, __spreadValues } from "@nf-internal/chunk-7IBJPHM5";
// node_modules/@angular/core/fesm2022/primitives-signals.mjs
var formatter = {
    header: (sig, config) => {
        if (!isSignal(sig) || config?.ngSkipFormatting)
            return null;
        let value;
        try {
            value = sig();
        }
        catch (e) {
            return ["span", `Signal(\u26A0\uFE0F Error)${e.message ? `: ${e.message}` : ""}`];
        }
        const kind = "computation" in sig[SIGNAL] ? "Computed" : "Signal";
        const isPrimitive = value === null || !Array.isArray(value) && typeof value !== "object";
        return ["span", {}, ["span", {}, `${kind}(`], (() => {
                if (isSignal(value)) {
                    return formatter.header(value, config);
                }
                else if (isPrimitive && value !== void 0 && typeof value !== "function") {
                    return ["object", {
                            object: value
                        }];
                }
                else {
                    return prettifyPreview(value);
                }
            })(), ["span", {}, `)`]];
    },
    hasBody: (sig, config) => {
        if (!isSignal(sig))
            return false;
        try {
            sig();
        }
        catch {
            return false;
        }
        return !config?.ngSkipFormatting;
    },
    body: (sig, config) => {
        const color = "var(--sys-color-primary)";
        return ["div", {
                style: `background: #FFFFFF10; padding-left: 4px; padding-top: 2px; padding-bottom: 2px;`
            }, ["div", {
                    style: `color: ${color}`
                }, "Signal value: "], ["div", {
                    style: `padding-left: .5rem;`
                }, ["object", {
                        object: sig(),
                        config
                    }]], ["div", {
                    style: `color: ${color}`
                }, "Signal function: "], ["div", {
                    style: `padding-left: .5rem;`
                }, ["object", {
                        object: sig,
                        config: __spreadProps(__spreadValues({}, config), {
                            ngSkipFormatting: true
                        })
                    }]]];
    }
};
function prettifyPreview(value) {
    if (value === null)
        return "null";
    if (Array.isArray(value))
        return `Array(${value.length})`;
    if (value instanceof Element)
        return `<${value.tagName.toLowerCase()}>`;
    if (value instanceof URL)
        return `URL`;
    switch (typeof value) {
        case "undefined": {
            return "undefined";
        }
        case "function": {
            if ("prototype" in value) {
                return "class";
            }
            else {
                return "() => {\u2026}";
            }
        }
        case "object": {
            if (value.constructor.name === "Object") {
                return "{\u2026}";
            }
            else {
                return `${value.constructor.name} {}`;
            }
        }
        default: {
            return ["object", {
                    object: value,
                    config: {
                        ngSkipFormatting: true
                    }
                }];
        }
    }
}
function isSignal(value) {
    return value[SIGNAL] !== void 0;
}
function installDevToolsSignalFormatter() {
    globalThis.devtoolsFormatters ??= [];
    if (!globalThis.devtoolsFormatters.some((f) => f === formatter)) {
        globalThis.devtoolsFormatters.push(formatter);
    }
}
function createWatch(fn, schedule, allowSignalWrites) {
    const node = Object.create(WATCH_NODE);
    if (allowSignalWrites) {
        node.consumerAllowSignalWrites = true;
    }
    node.fn = fn;
    node.schedule = schedule;
    const registerOnCleanup = (cleanupFn) => {
        node.cleanupFn = cleanupFn;
    };
    function isWatchNodeDestroyed(node2) {
        return node2.fn === null && node2.schedule === null;
    }
    function destroyWatchNode(node2) {
        if (!isWatchNodeDestroyed(node2)) {
            consumerDestroy(node2);
            node2.cleanupFn();
            node2.fn = null;
            node2.schedule = null;
            node2.cleanupFn = NOOP_CLEANUP_FN;
        }
    }
    const run = () => {
        if (node.fn === null) {
            return;
        }
        if (isInNotificationPhase()) {
            throw new Error(typeof ngDevMode !== "undefined" && ngDevMode ? "Schedulers cannot synchronously execute watches while scheduling." : "");
        }
        node.dirty = false;
        if (node.version > 0 && !consumerPollProducersForChange(node)) {
            return;
        }
        node.version++;
        const prevConsumer = consumerBeforeComputation(node);
        try {
            node.cleanupFn();
            node.cleanupFn = NOOP_CLEANUP_FN;
            node.fn(registerOnCleanup);
        }
        finally {
            consumerAfterComputation(node, prevConsumer);
        }
    };
    node.ref = {
        notify: () => consumerMarkDirty(node),
        run,
        cleanup: () => node.cleanupFn(),
        destroy: () => destroyWatchNode(node),
        [SIGNAL]: node
    };
    return node.ref;
}
var NOOP_CLEANUP_FN = () => {
};
var WATCH_NODE = /* @__PURE__ */ (() => {
    return __spreadProps(__spreadValues({}, REACTIVE_NODE), {
        consumerIsAlwaysLive: true,
        consumerAllowSignalWrites: false,
        consumerMarkedDirty: (node) => {
            if (node.schedule !== null) {
                node.schedule(node.ref);
            }
        },
        cleanupFn: NOOP_CLEANUP_FN
    });
})();
if (typeof ngDevMode === "undefined" || ngDevMode) {
    installDevToolsSignalFormatter();
}
export { BASE_EFFECT_NODE, REACTIVE_NODE, SIGNAL, SIGNAL_NODE, consumerAfterComputation, consumerBeforeComputation, consumerDestroy, consumerMarkDirty, consumerPollProducersForChange, createComputed, createLinkedSignal, createSignal, createWatch, defaultEquals, finalizeConsumerAfterComputation, getActiveConsumer, installDevToolsSignalFormatter, isInNotificationPhase, isReactive, linkedSignalSetFn, linkedSignalUpdateFn, producerAccessed, producerIncrementEpoch, producerMarkClean, producerNotifyConsumers, producerUpdateValueVersion, producerUpdatesAllowed, resetConsumerBeforeComputation, runEffect, runPostProducerCreatedFn, runPostSignalSetFn, setActiveConsumer, setAlternateWeakRefImpl, setPostProducerCreatedFn, setPostSignalSetFn, setThrowInvalidWriteToSignalError, signalGetFn, signalSetFn, signalUpdateFn, untracked };
/*! Bundled license information:

@angular/core/fesm2022/primitives-signals.mjs:
  (**
   * @license Angular v22.1.1
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
