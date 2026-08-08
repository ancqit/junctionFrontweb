import {
  __spreadValues
} from "./chunk-F2KQRQKD.js";

// node_modules/@angular/platform-browser/fesm2022/_browser-chunk.mjs
import { \u0275DomAdapter as _DomAdapter, \u0275setRootDomAdapter as _setRootDomAdapter, \u0275parseCookieValue as _parseCookieValue, \u0275getDOM as _getDOM2, DOCUMENT as DOCUMENT2, CommonModule, \u0275PLATFORM_BROWSER_ID as _PLATFORM_BROWSER_ID } from "@angular/common";
import * as i02 from "@angular/core";
import { \u0275global as _global, \u0275RuntimeError as _RuntimeError2, Inject as Inject2, Injectable as Injectable2, inject, InjectionToken as InjectionToken2, ApplicationModule, \u0275INJECTOR_SCOPE as _INJECTOR_SCOPE, ErrorHandler, \u0275SHARED_STYLES_HOST as _SHARED_STYLES_HOST2, RendererFactory2, \u0275TESTABILITY_GETTER as _TESTABILITY_GETTER, NgZone as NgZone2, TestabilityRegistry, Testability, \u0275TESTABILITY as _TESTABILITY, \u0275internalCreateApplication as _internalCreateApplication, createPlatformFactory, platformCore, PLATFORM_ID as PLATFORM_ID2, PLATFORM_INITIALIZER, \u0275USE_PENDING_TASKS as _USE_PENDING_TASKS, \u0275resolveComponentResources as _resolveComponentResources, \u0275setDocument as _setDocument, NgModule } from "@angular/core";

// node_modules/@angular/platform-browser/fesm2022/_dom_renderer-chunk.mjs
import { DOCUMENT, \u0275getDOM as _getDOM } from "@angular/common";
import * as i0 from "@angular/core";
import { Inject, Injectable, InjectionToken, \u0275RuntimeError as _RuntimeError, APP_ID, CSP_NONCE, PLATFORM_ID, Optional, makeEnvironmentProviders, ViewEncapsulation, \u0275SHARED_STYLES_HOST as _SHARED_STYLES_HOST, \u0275TracingService as _TracingService, RendererStyleFlags2, \u0275allLeavingAnimations as _allLeavingAnimations } from "@angular/core";
/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var EventManagerPlugin = class {
  _doc;
  constructor(_doc) {
    this._doc = _doc;
  }
  manager;
};
var DomEventsPlugin = class _DomEventsPlugin extends EventManagerPlugin {
  constructor(doc) {
    super(doc);
  }
  supports(eventName) {
    return true;
  }
  addEventListener(element, eventName, handler, options) {
    element.addEventListener(eventName, handler, options);
    return () => this.removeEventListener(element, eventName, handler, options);
  }
  removeEventListener(target, eventName, callback, options) {
    return target.removeEventListener(eventName, callback, options);
  }
  static \u0275fac = function DomEventsPlugin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DomEventsPlugin)(i0.\u0275\u0275inject(DOCUMENT));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({
    token: _DomEventsPlugin,
    factory: _DomEventsPlugin.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(DomEventsPlugin, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var EVENT_MANAGER_PLUGINS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "EventManagerPlugins" : "");
var EventManager = class _EventManager {
  _zone;
  _plugins;
  _eventNameToPlugin = /* @__PURE__ */ new Map();
  constructor(plugins, _zone) {
    this._zone = _zone;
    plugins.forEach((plugin) => {
      plugin.manager = this;
    });
    const otherPlugins = plugins.filter((p) => !(p instanceof DomEventsPlugin));
    this._plugins = otherPlugins.slice().reverse();
    const domEventPlugin = plugins.find((p) => p instanceof DomEventsPlugin);
    if (domEventPlugin) {
      this._plugins.push(domEventPlugin);
    }
  }
  addEventListener(element, eventName, handler, options) {
    const plugin = this._findPluginFor(eventName);
    return plugin.addEventListener(element, eventName, handler, options);
  }
  getZone() {
    return this._zone;
  }
  _findPluginFor(eventName) {
    let plugin = this._eventNameToPlugin.get(eventName);
    if (plugin) {
      return plugin;
    }
    const plugins = this._plugins;
    plugin = plugins.find((plugin2) => plugin2.supports(eventName));
    if (!plugin) {
      throw new _RuntimeError(-5101, (typeof ngDevMode === "undefined" || ngDevMode) && `No event manager plugin found for event ${eventName}`);
    }
    this._eventNameToPlugin.set(eventName, plugin);
    return plugin;
  }
  static \u0275fac = function EventManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventManager)(i0.\u0275\u0275inject(EVENT_MANAGER_PLUGINS), i0.\u0275\u0275inject(i0.NgZone));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({
    token: _EventManager,
    factory: _EventManager.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(EventManager, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [EVENT_MANAGER_PLUGINS]
    }]
  }, {
    type: i0.NgZone
  }], null);
})();
var APP_ID_ATTRIBUTE_NAME = "ng-app-id";
function removeElements(elements) {
  for (const element of elements) {
    element.remove();
  }
}
function createStyleElement(style, doc) {
  const styleElement = doc.createElement("style");
  styleElement.textContent = style;
  return styleElement;
}
function addServerStyles(doc, appId, inline, external) {
  const elements = doc.head?.querySelectorAll(`style[${APP_ID_ATTRIBUTE_NAME}="${appId}"],link[${APP_ID_ATTRIBUTE_NAME}="${appId}"]`);
  if (!elements || elements.length === 0) return false;
  for (const styleElement of elements) {
    styleElement.removeAttribute(APP_ID_ATTRIBUTE_NAME);
    if (styleElement instanceof HTMLLinkElement) {
      external.set(styleElement.href.slice(styleElement.href.lastIndexOf("/") + 1), {
        usage: 0,
        elements: [styleElement]
      });
    } else if (styleElement.textContent) {
      inline.set(styleElement.textContent, {
        usage: 0,
        elements: [styleElement]
      });
    }
  }
  return true;
}
function createLinkElement(url, doc) {
  const linkElement = doc.createElement("link");
  linkElement.setAttribute("rel", "stylesheet");
  linkElement.setAttribute("href", url);
  return linkElement;
}
var SharedStylesHost = class _SharedStylesHost {
  doc;
  appId;
  nonce;
  inline = /* @__PURE__ */ new Map();
  external = /* @__PURE__ */ new Map();
  hosts = /* @__PURE__ */ new Set();
  constructor(doc, appId, nonce, platformId = {}) {
    this.doc = doc;
    this.appId = appId;
    this.nonce = nonce;
    const added = addServerStyles(doc, appId, this.inline, this.external);
    if (added) this.hosts.add(doc.head);
  }
  addStyles(styles, urls) {
    for (const value of styles) {
      this.addUsage(value, this.inline, createStyleElement);
    }
    urls?.forEach((value) => this.addUsage(value, this.external, createLinkElement));
  }
  removeStyles(styles, urls) {
    for (const value of styles) {
      this.removeUsage(value, this.inline);
    }
    urls?.forEach((value) => this.removeUsage(value, this.external));
  }
  addUsage(value, usages, creator) {
    const record = usages.get(value);
    if (record) {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && record.usage === 0) {
        record.elements.forEach((element) => element.setAttribute("ng-style-reused", ""));
      }
      record.usage++;
    } else {
      usages.set(value, {
        usage: 1,
        elements: [...this.hosts].map((host) => this.addElement(host, creator(value, this.doc)))
      });
    }
  }
  removeUsage(value, usages) {
    const record = usages.get(value);
    if (record) {
      record.usage--;
      if (record.usage <= 0) {
        removeElements(record.elements);
        usages.delete(value);
      }
    }
  }
  ngOnDestroy() {
    for (const [, {
      elements
    }] of [...this.inline, ...this.external]) {
      removeElements(elements);
    }
    this.hosts.clear();
  }
  addHost(hostNode) {
    if (this.hosts.has(hostNode)) return;
    this.hosts.add(hostNode);
    for (const [style, {
      elements
    }] of this.inline) {
      elements.push(this.addElement(hostNode, createStyleElement(style, this.doc)));
    }
    for (const [url, {
      elements
    }] of this.external) {
      elements.push(this.addElement(hostNode, createLinkElement(url, this.doc)));
    }
  }
  removeHost(hostNode) {
    this.hosts.delete(hostNode);
    for (const record of [...this.inline.values(), ...this.external.values()]) {
      const remaining = [];
      for (const element of record.elements) {
        if (element.parentNode === hostNode) {
          element.remove();
        } else {
          remaining.push(element);
        }
      }
      record.elements = remaining;
    }
  }
  addElement(host, element) {
    if (this.nonce) {
      element.setAttribute("nonce", this.nonce);
    }
    if (false) {
      element.setAttribute(APP_ID_ATTRIBUTE_NAME, this.appId);
    }
    return host.appendChild(element);
  }
  static \u0275fac = function SharedStylesHost_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedStylesHost)(i0.\u0275\u0275inject(DOCUMENT), i0.\u0275\u0275inject(APP_ID), i0.\u0275\u0275inject(CSP_NONCE, 8), i0.\u0275\u0275inject(PLATFORM_ID));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({
    token: _SharedStylesHost,
    factory: _SharedStylesHost.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(SharedStylesHost, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [APP_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [CSP_NONCE]
    }, {
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
var NAMESPACE_URIS = {
  "svg": "http://www.w3.org/2000/svg",
  "xhtml": "http://www.w3.org/1999/xhtml",
  "xlink": "http://www.w3.org/1999/xlink",
  "xml": "http://www.w3.org/XML/1998/namespace",
  "xmlns": "http://www.w3.org/2000/xmlns/",
  "math": "http://www.w3.org/1998/Math/MathML"
};
var COMPONENT_REGEX = /%COMP%/g;
var SOURCEMAP_URL_REGEXP = /\/\*#\s*sourceMappingURL=([^\s*]+)\s*\*\//;
var PROTOCOL_REGEXP = /^https?:/;
var COMPONENT_VARIABLE = "%COMP%";
var HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
var CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
var REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT = true;
var REMOVE_STYLES_ON_COMPONENT_DESTROY = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "RemoveStylesOnCompDestroy" : "", {
  factory: () => REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT
});
var CSS_VAR_NAMESPACE = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "CSS_VAR_NAMESPACE" : "");
function shimContentAttribute(componentShortId) {
  return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimHostAttribute(componentShortId) {
  return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimStylesContent(compId, styles) {
  return styles.map((s) => s.replace(COMPONENT_REGEX, compId));
}
function addBaseHrefToCssSourceMap(baseHref, styles) {
  if (!baseHref) {
    return styles;
  }
  const absoluteBaseHrefUrl = new URL(baseHref, "http://localhost");
  return styles.map((cssContent) => {
    if (!cssContent.includes("sourceMappingURL=")) {
      return cssContent;
    }
    return cssContent.replace(SOURCEMAP_URL_REGEXP, (_, sourceMapUrl) => {
      if (sourceMapUrl[0] === "/" || sourceMapUrl.startsWith("data:") || PROTOCOL_REGEXP.test(sourceMapUrl)) {
        return `/*# sourceMappingURL=${sourceMapUrl} */`;
      }
      const {
        pathname: resolvedSourceMapUrl
      } = new URL(sourceMapUrl, absoluteBaseHrefUrl);
      return `/*# sourceMappingURL=${resolvedSourceMapUrl} */`;
    });
  });
}
var DomRendererFactory2 = class _DomRendererFactory2 {
  eventManager;
  sharedStylesHost;
  appId;
  removeStylesOnCompDestroy;
  doc;
  ngZone;
  nonce;
  tracingService;
  rendererByCompId = /* @__PURE__ */ new Map();
  defaultRenderer;
  cssVarNamespace;
  constructor(eventManager, sharedStylesHost, appId, removeStylesOnCompDestroy, doc, ngZone, nonce = null, tracingService = null, cssVarNamespace = null) {
    this.eventManager = eventManager;
    this.sharedStylesHost = sharedStylesHost;
    this.appId = appId;
    this.removeStylesOnCompDestroy = removeStylesOnCompDestroy;
    this.doc = doc;
    this.ngZone = ngZone;
    this.nonce = nonce;
    this.tracingService = tracingService;
    this.cssVarNamespace = cssVarNamespace ?? "";
    this.defaultRenderer = new DefaultDomRenderer2(eventManager, doc, ngZone, this.tracingService, this.cssVarNamespace);
  }
  createRenderer(element, type) {
    if (!element || !type) {
      return this.defaultRenderer;
    }
    if (false) {
      type = __spreadProps(__spreadValues({}, type), {
        encapsulation: ViewEncapsulation.Emulated
      });
    }
    const renderer = this.getOrCreateRenderer(element, type);
    if (renderer instanceof EmulatedEncapsulationDomRenderer2) {
      renderer.applyToHost(element);
    } else if (renderer instanceof NoneEncapsulationDomRenderer) {
      renderer.applyStyles();
    }
    return renderer;
  }
  getOrCreateRenderer(element, type) {
    const rendererByCompId = this.rendererByCompId;
    let renderer = rendererByCompId.get(type.id);
    if (!renderer) {
      const doc = this.doc;
      const ngZone = this.ngZone;
      const eventManager = this.eventManager;
      const sharedStylesHost = this.sharedStylesHost;
      const removeStylesOnCompDestroy = this.removeStylesOnCompDestroy;
      const tracingService = this.tracingService;
      switch (type.encapsulation) {
        case ViewEncapsulation.Emulated:
          renderer = new EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, type, this.appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, this.cssVarNamespace);
          break;
        case ViewEncapsulation.ShadowDom:
          return new ShadowDomRenderer(eventManager, element, type, doc, ngZone, this.nonce, tracingService, this.cssVarNamespace, sharedStylesHost);
        case ViewEncapsulation.ExperimentalIsolatedShadowDom:
          return new ShadowDomRenderer(eventManager, element, type, doc, ngZone, this.nonce, tracingService, this.cssVarNamespace);
        default:
          renderer = new NoneEncapsulationDomRenderer(eventManager, sharedStylesHost, type, removeStylesOnCompDestroy, doc, ngZone, tracingService, this.cssVarNamespace);
          break;
      }
      rendererByCompId.set(type.id, renderer);
    }
    return renderer;
  }
  ngOnDestroy() {
    this.rendererByCompId.clear();
  }
  componentReplaced(componentId) {
    this.rendererByCompId.delete(componentId);
  }
  static \u0275fac = function DomRendererFactory2_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DomRendererFactory2)(i0.\u0275\u0275inject(EventManager), i0.\u0275\u0275inject(_SHARED_STYLES_HOST), i0.\u0275\u0275inject(APP_ID), i0.\u0275\u0275inject(REMOVE_STYLES_ON_COMPONENT_DESTROY), i0.\u0275\u0275inject(DOCUMENT), i0.\u0275\u0275inject(i0.NgZone), i0.\u0275\u0275inject(CSP_NONCE), i0.\u0275\u0275inject(_TracingService, 8), i0.\u0275\u0275inject(CSS_VAR_NAMESPACE, 8));
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({
    token: _DomRendererFactory2,
    factory: _DomRendererFactory2.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(DomRendererFactory2, [{
    type: Injectable
  }], () => [{
    type: EventManager
  }, {
    type: SharedStylesHost,
    decorators: [{
      type: Inject,
      args: [_SHARED_STYLES_HOST]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [APP_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [REMOVE_STYLES_ON_COMPONENT_DESTROY]
    }]
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: i0.NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [CSP_NONCE]
    }]
  }, {
    type: i0.\u0275TracingService,
    decorators: [{
      type: Inject,
      args: [_TracingService]
    }, {
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [CSS_VAR_NAMESPACE]
    }, {
      type: Optional
    }]
  }], null);
})();
var DefaultDomRenderer2 = class {
  eventManager;
  doc;
  ngZone;
  tracingService;
  cssVarNamespace;
  data = /* @__PURE__ */ Object.create(null);
  throwOnSyntheticProps = true;
  constructor(eventManager, doc, ngZone, tracingService, cssVarNamespace = "") {
    this.eventManager = eventManager;
    this.doc = doc;
    this.ngZone = ngZone;
    this.tracingService = tracingService;
    this.cssVarNamespace = cssVarNamespace;
  }
  destroy() {
  }
  destroyNode = null;
  createElement(name, namespace) {
    if (namespace) {
      return this.doc.createElementNS(NAMESPACE_URIS[namespace] || namespace, name);
    }
    return this.doc.createElement(name);
  }
  createComment(value) {
    return this.doc.createComment(value);
  }
  createText(value) {
    return this.doc.createTextNode(value);
  }
  appendChild(parent, newChild) {
    const targetParent = isTemplateNode(parent) ? parent.content : parent;
    targetParent.appendChild(newChild);
  }
  insertBefore(parent, newChild, refChild) {
    if (parent) {
      const targetParent = isTemplateNode(parent) ? parent.content : parent;
      targetParent.insertBefore(newChild, refChild);
    }
  }
  removeChild(_parent, oldChild) {
    oldChild.remove();
  }
  selectRootElement(selectorOrNode, preserveContent) {
    let el = typeof selectorOrNode === "string" ? this.doc.querySelector(selectorOrNode) : selectorOrNode;
    if (!el) {
      throw new _RuntimeError(-5104, (typeof ngDevMode === "undefined" || ngDevMode) && `The selector "${selectorOrNode}" did not match any elements`);
    }
    if (!preserveContent) {
      el.textContent = "";
    }
    return el;
  }
  parentNode(node) {
    return node.parentNode;
  }
  nextSibling(node) {
    return node.nextSibling;
  }
  setAttribute(el, name, value, namespace) {
    if (namespace) {
      name = namespace + ":" + name;
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.setAttributeNS(namespaceUri, name, value);
      } else {
        el.setAttribute(name, value);
      }
    } else {
      el.setAttribute(name, value);
    }
  }
  removeAttribute(el, name, namespace) {
    if (namespace) {
      const namespaceUri = NAMESPACE_URIS[namespace];
      if (namespaceUri) {
        el.removeAttributeNS(namespaceUri, name);
      } else {
        el.removeAttribute(`${namespace}:${name}`);
      }
    } else {
      el.removeAttribute(name);
    }
  }
  addClass(el, name) {
    el.classList.add(name);
  }
  removeClass(el, name) {
    el.classList.remove(name);
  }
  setStyle(el, style, value, flags) {
    const isVariable = style.startsWith("--");
    if (isVariable) {
      style = style.replace("%NS%", this.cssVarNamespace);
    }
    if (isVariable || flags & (RendererStyleFlags2.DashCase | RendererStyleFlags2.Important)) {
      el.style.setProperty(style, value, flags & RendererStyleFlags2.Important ? "important" : "");
    } else {
      el.style[style] = value;
    }
  }
  removeStyle(el, style, flags) {
    const isVariable = style.startsWith("--");
    if (isVariable) {
      style = style.replace("%NS%", this.cssVarNamespace);
    }
    if (isVariable || flags & RendererStyleFlags2.DashCase) {
      el.style.removeProperty(style);
    } else {
      el.style[style] = "";
    }
  }
  setProperty(el, name, value) {
    if (el == null) {
      return;
    }
    (typeof ngDevMode === "undefined" || ngDevMode) && this.throwOnSyntheticProps && checkNoSyntheticProp(name, "property");
    el[name] = value;
  }
  setValue(node, value) {
    node.nodeValue = value;
  }
  listen(target, event, callback, options) {
    (typeof ngDevMode === "undefined" || ngDevMode) && this.throwOnSyntheticProps && checkNoSyntheticProp(event, "listener");
    if (typeof target === "string") {
      target = _getDOM().getGlobalEventTarget(this.doc, target);
      if (!target) {
        throw new _RuntimeError(-5102, (typeof ngDevMode === "undefined" || ngDevMode) && `Unsupported event target ${target} for event ${event}`);
      }
    }
    let wrappedCallback = this.decoratePreventDefault(callback);
    if (this.tracingService?.wrapEventListener) {
      wrappedCallback = this.tracingService.wrapEventListener(target, event, wrappedCallback);
    }
    return this.eventManager.addEventListener(target, event, wrappedCallback, options);
  }
  decoratePreventDefault(eventHandler) {
    return (event) => {
      if (event === "__ngUnwrap__") {
        return eventHandler;
      }
      const allowDefaultBehavior = false ? this.ngZone.runGuarded(() => eventHandler(event)) : eventHandler(event);
      if (allowDefaultBehavior === false) {
        event.preventDefault();
      }
      return void 0;
    };
  }
};
var AT_CHARCODE = (() => "@".charCodeAt(0))();
function checkNoSyntheticProp(name, nameKind) {
  if (name.charCodeAt(0) === AT_CHARCODE) {
    throw new _RuntimeError(5105, `Unexpected synthetic ${nameKind} ${name} found. Please make sure that:
  - Make sure \`provideAnimationsAsync()\`, \`provideAnimations()\` or \`provideNoopAnimations()\` call was added to a list of providers used to bootstrap an application.
  - There is a corresponding animation configuration named \`${name}\` defined in the \`animations\` field of the \`@Component\` decorator (see https://angular.dev/api/core/Component#animations).`);
  }
}
function isTemplateNode(node) {
  return node.tagName === "TEMPLATE" && node.content !== void 0;
}
var ShadowDomRenderer = class extends DefaultDomRenderer2 {
  hostEl;
  sharedStylesHost;
  shadowRoot;
  constructor(eventManager, hostEl, component, doc, ngZone, nonce, tracingService, cssVarNamespace, sharedStylesHost) {
    super(eventManager, doc, ngZone, tracingService, cssVarNamespace);
    this.hostEl = hostEl;
    this.sharedStylesHost = sharedStylesHost;
    this.shadowRoot = hostEl.attachShadow({
      mode: "open"
    });
    if (this.sharedStylesHost) {
      this.sharedStylesHost.addHost(this.shadowRoot);
    }
    let styles = component.styles;
    if (ngDevMode) {
      const baseHref = _getDOM().getBaseHref(doc) ?? "";
      styles = addBaseHrefToCssSourceMap(baseHref, styles);
    }
    styles = shimStylesContent(component.id, styles).map((s) => s.replace(/%NS%/g, cssVarNamespace));
    for (const style of styles) {
      const styleEl = document.createElement("style");
      if (nonce) {
        styleEl.setAttribute("nonce", nonce);
      }
      styleEl.textContent = style;
      this.shadowRoot.appendChild(styleEl);
    }
    const styleUrls = component.getExternalStyles?.();
    if (styleUrls) {
      for (const styleUrl of styleUrls) {
        const linkEl = createLinkElement(styleUrl, doc);
        if (nonce) {
          linkEl.setAttribute("nonce", nonce);
        }
        this.shadowRoot.appendChild(linkEl);
      }
    }
  }
  nodeOrShadowRoot(node) {
    return node === this.hostEl ? this.shadowRoot : node;
  }
  appendChild(parent, newChild) {
    return super.appendChild(this.nodeOrShadowRoot(parent), newChild);
  }
  insertBefore(parent, newChild, refChild) {
    return super.insertBefore(this.nodeOrShadowRoot(parent), newChild, refChild);
  }
  removeChild(_parent, oldChild) {
    return super.removeChild(null, oldChild);
  }
  parentNode(node) {
    return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
  }
  destroy() {
    if (this.sharedStylesHost) {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  }
};
var NoneEncapsulationDomRenderer = class extends DefaultDomRenderer2 {
  sharedStylesHost;
  removeStylesOnCompDestroy;
  styles;
  styleUrls;
  constructor(eventManager, sharedStylesHost, component, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace, compId) {
    super(eventManager, doc, ngZone, tracingService, cssVarNamespace);
    this.sharedStylesHost = sharedStylesHost;
    this.removeStylesOnCompDestroy = removeStylesOnCompDestroy;
    let styles = component.styles;
    if (ngDevMode) {
      const baseHref = _getDOM().getBaseHref(doc) ?? "";
      styles = addBaseHrefToCssSourceMap(baseHref, styles);
    }
    const shimmed = compId ? shimStylesContent(compId, styles) : styles;
    this.styles = shimmed.map((s) => s.replace(/%NS%/g, cssVarNamespace));
    this.styleUrls = component.getExternalStyles?.(compId);
  }
  applyStyles() {
    this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
  }
  destroy() {
    if (!this.removeStylesOnCompDestroy) {
      return;
    }
    if (_allLeavingAnimations.size === 0) {
      this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  }
};
var EmulatedEncapsulationDomRenderer2 = class extends NoneEncapsulationDomRenderer {
  contentAttr;
  hostAttr;
  constructor(eventManager, sharedStylesHost, component, appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace) {
    const compId = appId + "-" + component.id;
    super(eventManager, sharedStylesHost, component, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace, compId);
    this.contentAttr = shimContentAttribute(compId);
    this.hostAttr = shimHostAttribute(compId);
  }
  applyToHost(element) {
    this.applyStyles();
    this.setAttribute(element, this.hostAttr, "");
  }
  createElement(parent, name) {
    const el = super.createElement(parent, name);
    super.setAttribute(el, this.contentAttr, "");
    return el;
  }
};

// node_modules/@angular/platform-browser/fesm2022/_browser-chunk.mjs
/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var BrowserDomAdapter = class _BrowserDomAdapter extends _DomAdapter {
  supportsDOMEvents = true;
  static makeCurrent() {
    _setRootDomAdapter(new _BrowserDomAdapter());
  }
  onAndCancel(el, evt, listener, options) {
    el.addEventListener(evt, listener, options);
    return () => {
      el.removeEventListener(evt, listener, options);
    };
  }
  dispatchEvent(el, evt) {
    el.dispatchEvent(evt);
  }
  remove(node) {
    node.remove();
  }
  createElement(tagName, doc) {
    doc = doc || this.getDefaultDocument();
    return doc.createElement(tagName);
  }
  createHtmlDocument() {
    return document.implementation.createHTMLDocument("fakeTitle");
  }
  getDefaultDocument() {
    return document;
  }
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  isShadowRoot(node) {
    return node instanceof DocumentFragment;
  }
  getGlobalEventTarget(doc, target) {
    if (target === "window") {
      return window;
    }
    if (target === "document") {
      return doc;
    }
    if (target === "body") {
      return doc.body;
    }
    return null;
  }
  getBaseHref(doc) {
    const href = getBaseElementHref();
    return href == null ? null : relativePath(href);
  }
  resetBaseElement() {
    baseElement = null;
  }
  getUserAgent() {
    return window.navigator.userAgent;
  }
  getCookie(name) {
    return _parseCookieValue(document.cookie, name);
  }
};
var baseElement = null;
function getBaseElementHref() {
  baseElement = baseElement || document.head.querySelector("base");
  return baseElement ? baseElement.getAttribute("href") : null;
}
function relativePath(url) {
  return new URL(url, document.baseURI).pathname;
}
var BrowserGetTestability = class {
  addToWindow(registry) {
    _global["getAngularTestability"] = (elem, findInAncestors = true) => {
      const testability = registry.findTestabilityInTree(elem, findInAncestors);
      if (testability == null) {
        throw new _RuntimeError2(5103, (typeof ngDevMode === "undefined" || ngDevMode) && "Could not find testability for element.");
      }
      return testability;
    };
    _global["getAllAngularTestabilities"] = () => registry.getAllTestabilities();
    _global["getAllAngularRootElements"] = () => registry.getAllRootElements();
    const whenAllStable = (callback) => {
      const testabilities = _global["getAllAngularTestabilities"]();
      let count = testabilities.length;
      const decrement = function() {
        count--;
        if (count == 0) {
          callback();
        }
      };
      testabilities.forEach((testability) => {
        testability.whenStable(decrement);
      });
    };
    if (!_global["frameworkStabilizers"]) {
      _global["frameworkStabilizers"] = [];
    }
    _global["frameworkStabilizers"].push(whenAllStable);
  }
  findTestabilityInTree(registry, elem, findInAncestors) {
    if (elem == null) {
      return null;
    }
    const t = registry.getTestability(elem);
    if (t != null) {
      return t;
    } else if (!findInAncestors) {
      return null;
    }
    if (_getDOM2().isShadowRoot(elem)) {
      return this.findTestabilityInTree(registry, elem.host, true);
    }
    return this.findTestabilityInTree(registry, elem.parentElement, true);
  }
};
var MODIFIER_KEYS = ["alt", "control", "meta", "shift"];
var _keyMap = {
  "\b": "Backspace",
  "	": "Tab",
  "\x7F": "Delete",
  "\x1B": "Escape",
  "Del": "Delete",
  "Esc": "Escape",
  "Left": "ArrowLeft",
  "Right": "ArrowRight",
  "Up": "ArrowUp",
  "Down": "ArrowDown",
  "Menu": "ContextMenu",
  "Scroll": "ScrollLock",
  "Win": "OS"
};
var MODIFIER_KEY_GETTERS = {
  "alt": (event) => event.altKey,
  "control": (event) => event.ctrlKey,
  "meta": (event) => event.metaKey,
  "shift": (event) => event.shiftKey
};
var KeyEventsPlugin = class _KeyEventsPlugin extends EventManagerPlugin {
  constructor(doc) {
    super(doc);
  }
  supports(eventName) {
    return _KeyEventsPlugin.parseEventName(eventName) != null;
  }
  addEventListener(element, eventName, handler, options) {
    const parsedEvent = _KeyEventsPlugin.parseEventName(eventName);
    const outsideHandler = _KeyEventsPlugin.eventCallback(parsedEvent["fullKey"], handler, this.manager.getZone());
    return this.manager.getZone().runOutsideAngular(() => {
      return _getDOM2().onAndCancel(element, parsedEvent["domEventName"], outsideHandler, options);
    });
  }
  static parseEventName(eventName) {
    const parts = eventName.toLowerCase().split(".");
    const domEventName = parts.shift();
    if (parts.length === 0 || !(domEventName === "keydown" || domEventName === "keyup")) {
      return null;
    }
    const key = _KeyEventsPlugin._normalizeKey(parts.pop());
    let fullKey = "";
    let codeIX = parts.indexOf("code");
    if (codeIX > -1) {
      parts.splice(codeIX, 1);
      fullKey = "code.";
    }
    MODIFIER_KEYS.forEach((modifierName) => {
      const index = parts.indexOf(modifierName);
      if (index > -1) {
        parts.splice(index, 1);
        fullKey += modifierName + ".";
      }
    });
    fullKey += key;
    if (parts.length != 0 || key.length === 0) {
      return null;
    }
    const result = {};
    result["domEventName"] = domEventName;
    result["fullKey"] = fullKey;
    return result;
  }
  static matchEventFullKeyCode(event, fullKeyCode) {
    let keycode = _keyMap[event.key] || event.key;
    let key = "";
    if (fullKeyCode.indexOf("code.") > -1) {
      keycode = event.code;
      key = "code.";
    }
    if (keycode == null || !keycode) return false;
    keycode = keycode.toLowerCase();
    if (keycode === " ") {
      keycode = "space";
    } else if (keycode === ".") {
      keycode = "dot";
    }
    MODIFIER_KEYS.forEach((modifierName) => {
      if (modifierName !== keycode) {
        const modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
        if (modifierGetter(event)) {
          key += modifierName + ".";
        }
      }
    });
    key += keycode;
    return key === fullKeyCode;
  }
  static eventCallback(fullKey, handler, zone) {
    return (event) => {
      if (_KeyEventsPlugin.matchEventFullKeyCode(event, fullKey)) {
        zone.runGuarded(() => handler(event));
      }
    };
  }
  static _normalizeKey(keyName) {
    return keyName === "esc" ? "escape" : keyName;
  }
  static \u0275fac = function KeyEventsPlugin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _KeyEventsPlugin)(i02.\u0275\u0275inject(DOCUMENT2));
  };
  static \u0275prov = /* @__PURE__ */ i02.\u0275\u0275defineInjectable({
    token: _KeyEventsPlugin,
    factory: _KeyEventsPlugin.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(KeyEventsPlugin, [{
    type: Injectable2
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject2,
      args: [DOCUMENT2]
    }]
  }], null);
})();
async function bootstrapApplication(rootComponent, options, context) {
  const config = __spreadValues({
    rootComponent
  }, createProvidersConfig(options, context));
  if (false) {
    await resolveJitResources();
  }
  return _internalCreateApplication(config);
}
function createProvidersConfig(options, context) {
  return {
    platformRef: context?.platformRef,
    appProviders: [...BROWSER_MODULE_PROVIDERS, ...options?.providers ?? []],
    platformProviders: INTERNAL_BROWSER_PLATFORM_PROVIDERS
  };
}
function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
}
function errorHandler() {
  return new ErrorHandler();
}
function _document() {
  _setDocument(document);
  return document;
}
var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [{
  provide: PLATFORM_ID2,
  useValue: _PLATFORM_BROWSER_ID
}, {
  provide: PLATFORM_INITIALIZER,
  useValue: initDomAdapter,
  multi: true
}, {
  provide: DOCUMENT2,
  useFactory: _document
}];
var platformBrowser = createPlatformFactory(platformCore, "browser", INTERNAL_BROWSER_PLATFORM_PROVIDERS);
var BROWSER_MODULE_PROVIDERS_MARKER = new InjectionToken2(typeof ngDevMode === "undefined" || ngDevMode ? "BrowserModule Providers Marker" : "");
var TESTABILITY_PROVIDERS = [{
  provide: _TESTABILITY_GETTER,
  useClass: BrowserGetTestability
}, {
  provide: _TESTABILITY,
  useClass: Testability,
  deps: [NgZone2, TestabilityRegistry, _TESTABILITY_GETTER]
}, {
  provide: Testability,
  useClass: Testability,
  deps: [NgZone2, TestabilityRegistry, _TESTABILITY_GETTER]
}];
var BROWSER_MODULE_PROVIDERS = [{
  provide: _INJECTOR_SCOPE,
  useValue: "root"
}, {
  provide: ErrorHandler,
  useFactory: errorHandler
}, {
  provide: EVENT_MANAGER_PLUGINS,
  useClass: DomEventsPlugin,
  multi: true
}, {
  provide: EVENT_MANAGER_PLUGINS,
  useClass: KeyEventsPlugin,
  multi: true
}, DomRendererFactory2, {
  provide: _SHARED_STYLES_HOST2,
  useClass: SharedStylesHost
}, {
  provide: SharedStylesHost,
  useExisting: _SHARED_STYLES_HOST2
}, EventManager, {
  provide: RendererFactory2,
  useExisting: DomRendererFactory2
}, typeof ngDevMode === "undefined" || ngDevMode ? {
  provide: BROWSER_MODULE_PROVIDERS_MARKER,
  useValue: true
} : []];
var BrowserModule = class _BrowserModule {
  constructor() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const providersAlreadyPresent = inject(BROWSER_MODULE_PROVIDERS_MARKER, {
        optional: true,
        skipSelf: true
      });
      if (providersAlreadyPresent) {
        throw new _RuntimeError2(5100, `Providers from the \`BrowserModule\` have already been loaded. If you need access to common directives such as NgIf and NgFor, import the \`CommonModule\` instead.`);
      }
    }
  }
  static \u0275fac = function BrowserModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserModule)();
  };
  static \u0275mod = /* @__PURE__ */ i02.\u0275\u0275defineNgModule({
    type: _BrowserModule,
    exports: [CommonModule, ApplicationModule]
  });
  static \u0275inj = /* @__PURE__ */ i02.\u0275\u0275defineInjector({
    providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
    imports: [CommonModule, ApplicationModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(BrowserModule, [{
    type: NgModule,
    args: [{
      providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
      exports: [CommonModule, ApplicationModule]
    }]
  }], () => [], null);
})();

// node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs
import { DOCUMENT as DOCUMENT3, \u0275getDOM as _getDOM3 } from "@angular/common";
import { \u0275getDOM } from "@angular/common";
import * as i03 from "@angular/core";
import { inject as inject2, Service, Inject as Inject3, Injectable as Injectable3, \u0275global as _global2, ApplicationRef, \u0275RuntimeError as _RuntimeError3, makeEnvironmentProviders as makeEnvironmentProviders2, \u0275CACHE_ACTIVE as _CACHE_ACTIVE, APP_BOOTSTRAP_LISTENER, provideStabilityDebugging, \u0275withDomHydration as _withDomHydration, \u0275withIncrementalHydration as _withIncrementalHydration, \u0275withEventReplay as _withEventReplay, \u0275withI18nSupport as _withI18nSupport, ENVIRONMENT_INITIALIZER, \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION as _IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, \u0275Console as _Console, \u0275formatRuntimeError as _formatRuntimeError, \u0275XSS_SECURITY_URL as _XSS_SECURITY_URL, SecurityContext, \u0275allowSanitizationBypassAndThrow as _allowSanitizationBypassAndThrow, \u0275unwrapSafeValue as _unwrapSafeValue, \u0275_sanitizeUrl as __sanitizeUrl, \u0275_sanitizeHtml as __sanitizeHtml, \u0275bypassSanitizationTrustHtml as _bypassSanitizationTrustHtml, \u0275bypassSanitizationTrustStyle as _bypassSanitizationTrustStyle, \u0275bypassSanitizationTrustScript as _bypassSanitizationTrustScript, \u0275bypassSanitizationTrustUrl as _bypassSanitizationTrustUrl, \u0275bypassSanitizationTrustResourceUrl as _bypassSanitizationTrustResourceUrl, forwardRef, Version } from "@angular/core";
import { \u0275withHttpTransferCache as _withHttpTransferCache } from "@angular/common/http";
/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var Meta = class _Meta {
  _doc = inject2(DOCUMENT3);
  _dom = _getDOM3();
  _cachedHead;
  addTag(tag, forceCreation = false) {
    if (!tag) return null;
    return this._getOrCreateElement(tag, forceCreation);
  }
  addTags(tags, forceCreation = false) {
    return tags.filter((tag) => !!tag).map((tag) => this._getOrCreateElement(tag, forceCreation));
  }
  getTag(attrSelector) {
    if (!attrSelector) return null;
    const meta = this._doc.querySelector(buildMetaSelector(attrSelector));
    return isMetaTag(meta) ? meta : null;
  }
  getTags(attrSelector) {
    if (!attrSelector) return [];
    const list = this._doc.querySelectorAll(buildMetaSelector(attrSelector));
    return list ? Array.from(list).filter((elem) => isMetaTag(elem)) : [];
  }
  updateTag(tag, selector) {
    selector ??= parseSelector(tag);
    const meta = this.getTag(selector);
    if (meta) {
      setMetaElementAttributes(tag, meta);
      return meta;
    }
    return this._getOrCreateElement(tag, true);
  }
  removeTag(attrSelector) {
    this.removeTagElement(this.getTag(attrSelector));
  }
  removeTagElement(meta) {
    if (meta) {
      this._dom.remove(meta);
    }
  }
  _getOrCreateElement(meta, forceCreation = false) {
    if (!forceCreation) {
      const selector = parseSelector(meta);
      const elem = this.getTags(selector).filter((elem2) => containsAttributes(meta, elem2))[0];
      if (elem !== void 0) return elem;
    }
    const element = this._dom.createElement("meta");
    setMetaElementAttributes(meta, element);
    const head = this._doc.getElementsByTagName("head")[0];
    head.appendChild(element);
    return element;
  }
  static \u0275fac = function Meta_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Meta)();
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineService({
    token: _Meta,
    factory: _Meta.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(Meta, [{
    type: Service
  }], null, null);
})();
function buildMetaSelector(attrSelector) {
  return `meta[${attrSelector}]`;
}
function setMetaElementAttributes(tag, el) {
  Object.keys(tag).forEach((prop) => el.setAttribute(getMetaKeyMap(prop), tag[prop]));
}
function parseSelector(tag) {
  const attr = tag.name ? "name" : "property";
  return `${attr}=${escapeSelectorValue(String(tag[attr]))}`;
}
function escapeSelectorValue(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function containsAttributes(tag, elem) {
  return Object.keys(tag).every((key) => elem.getAttribute(getMetaKeyMap(key)) === tag[key]);
}
function getMetaKeyMap(prop) {
  return META_KEYS_MAP[prop] || prop;
}
function isMetaTag(tag) {
  return tag?.nodeName.toLowerCase() === "meta";
}
var META_KEYS_MAP = {
  httpEquiv: "http-equiv"
};
var Title = class _Title {
  _doc;
  constructor(_doc) {
    this._doc = _doc;
  }
  getTitle() {
    return this._doc.title;
  }
  setTitle(newTitle) {
    this._doc.title = newTitle || "";
  }
  static \u0275fac = function Title_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Title)(i03.\u0275\u0275inject(DOCUMENT3));
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineInjectable({
    token: _Title,
    factory: _Title.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(Title, [{
    type: Injectable3,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject3,
      args: [DOCUMENT3]
    }]
  }], null);
})();
var CssVarNamespacer = class _CssVarNamespacer {
  namespacePrefix = inject2(CSS_VAR_NAMESPACE, {
    optional: true
  }) ?? "";
  namespace(name) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!name.startsWith("--")) {
        throw new Error(`CSS variable names passed to \`CssVarNamespacer\` must start with '--', got: '${name}'`);
      }
    }
    if (!this.namespacePrefix) return name;
    return `--${this.namespacePrefix}${name.substring("--".length)}`;
  }
  static \u0275fac = function CssVarNamespacer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CssVarNamespacer)();
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineService({
    token: _CssVarNamespacer,
    factory: _CssVarNamespacer.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(CssVarNamespacer, [{
    type: Service
  }], null, null);
})();
var HydrationFeatureKind;
(function(HydrationFeatureKind2) {
  HydrationFeatureKind2[HydrationFeatureKind2["NoHttpTransferCache"] = 0] = "NoHttpTransferCache";
  HydrationFeatureKind2[HydrationFeatureKind2["HttpTransferCacheOptions"] = 1] = "HttpTransferCacheOptions";
  HydrationFeatureKind2[HydrationFeatureKind2["I18nSupport"] = 2] = "I18nSupport";
  HydrationFeatureKind2[HydrationFeatureKind2["EventReplay"] = 3] = "EventReplay";
  HydrationFeatureKind2[HydrationFeatureKind2["IncrementalHydration"] = 4] = "IncrementalHydration";
  HydrationFeatureKind2[HydrationFeatureKind2["NoIncrementalHydration"] = 5] = "NoIncrementalHydration";
})(HydrationFeatureKind || (HydrationFeatureKind = {}));
var DomSanitizer = class _DomSanitizer {
  static \u0275fac = function DomSanitizer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DomSanitizer)();
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineInjectable({
    token: _DomSanitizer,
    factory: function DomSanitizer_Factory(__ngFactoryType__) {
      let __ngConditionalFactory__ = null;
      if (__ngFactoryType__) {
        __ngConditionalFactory__ = new (__ngFactoryType__ || _DomSanitizer)();
      } else {
        __ngConditionalFactory__ = i03.\u0275\u0275inject(DomSanitizerImpl);
      }
      return __ngConditionalFactory__;
    },
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(DomSanitizer, [{
    type: Injectable3,
    args: [{
      providedIn: "root",
      useExisting: forwardRef(() => DomSanitizerImpl)
    }]
  }], null, null);
})();
var DomSanitizerImpl = class _DomSanitizerImpl extends DomSanitizer {
  _doc = inject2(DOCUMENT3);
  sanitize(ctx, value) {
    if (value == null) return null;
    switch (ctx) {
      case SecurityContext.NONE:
        return value;
      case SecurityContext.HTML:
        if (_allowSanitizationBypassAndThrow(value, "HTML")) {
          return _unwrapSafeValue(value);
        }
        return __sanitizeHtml(this._doc, String(value)).toString();
      case SecurityContext.STYLE:
        if (_allowSanitizationBypassAndThrow(value, "Style")) {
          return _unwrapSafeValue(value);
        }
        return value;
      case SecurityContext.SCRIPT:
        if (_allowSanitizationBypassAndThrow(value, "Script")) {
          return _unwrapSafeValue(value);
        }
        throw new _RuntimeError3(5200, (typeof ngDevMode === "undefined" || ngDevMode) && "unsafe value used in a script context");
      case SecurityContext.URL:
        if (_allowSanitizationBypassAndThrow(value, "URL")) {
          return _unwrapSafeValue(value);
        }
        return __sanitizeUrl(String(value));
      case SecurityContext.RESOURCE_URL:
        if (_allowSanitizationBypassAndThrow(value, "ResourceURL")) {
          return _unwrapSafeValue(value);
        }
        throw new _RuntimeError3(-5201, (typeof ngDevMode === "undefined" || ngDevMode) && `unsafe value used in a resource URL context (see ${_XSS_SECURITY_URL})`);
      default:
        throw new _RuntimeError3(5202, (typeof ngDevMode === "undefined" || ngDevMode) && `Unexpected SecurityContext ${ctx} (see ${_XSS_SECURITY_URL})`);
    }
  }
  bypassSecurityTrustHtml(value) {
    return _bypassSanitizationTrustHtml(value);
  }
  bypassSecurityTrustStyle(value) {
    return _bypassSanitizationTrustStyle(value);
  }
  bypassSecurityTrustScript(value) {
    return _bypassSanitizationTrustScript(value);
  }
  bypassSecurityTrustUrl(value) {
    return _bypassSanitizationTrustUrl(value);
  }
  bypassSecurityTrustResourceUrl(value) {
    return _bypassSanitizationTrustResourceUrl(value);
  }
  static \u0275fac = function DomSanitizerImpl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DomSanitizerImpl)();
  };
  static \u0275prov = /* @__PURE__ */ i03.\u0275\u0275defineService({
    token: _DomSanitizerImpl,
    factory: _DomSanitizerImpl.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(DomSanitizerImpl, [{
    type: Service
  }], null, null);
})();

// apps/back-office/src/app/app.config.ts
import { provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";

// apps/back-office/src/app/app.routes.ts
var routes = [];

// apps/back-office/src/app/app.config.ts
var appConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)]
};

// apps/back-office/src/app/app.ts
import { Component } from "@angular/core";
import * as i04 from "@angular/core";
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _App, selectors: [["app-back-office"]], decls: 94, vars: 0, consts: [[1, "office"], [1, "brand"], [1, "active"], [1, "store"], [1, "avatar"], [1, "hero"], [1, "eyebrow"], [1, "pulse"], [1, "metrics"], [1, "next"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i04.\u0275\u0275domElementStart(0, "div", 0)(1, "aside")(2, "div", 1)(3, "span");
      i04.\u0275\u0275text(4, "J");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275text(5, " Junction");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(6, "nav")(7, "a", 2);
      i04.\u0275\u0275text(8, "Overview");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(9, "a");
      i04.\u0275\u0275text(10, "Orders");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(11, "a");
      i04.\u0275\u0275text(12, "Catalog");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(13, "a");
      i04.\u0275\u0275text(14, "Customers");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(15, "a");
      i04.\u0275\u0275text(16, "Settings");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(17, "div", 3)(18, "div", 4);
      i04.\u0275\u0275text(19, "MR");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(20, "span")(21, "strong");
      i04.\u0275\u0275text(22, "Main Road Store");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(23, "small");
      i04.\u0275\u0275text(24, "Ranchi");
      i04.\u0275\u0275domElementEnd()()()();
      i04.\u0275\u0275domElementStart(25, "main")(26, "header")(27, "div")(28, "p");
      i04.\u0275\u0275text(29, "Saturday, 8 August");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(30, "h1");
      i04.\u0275\u0275text(31, "Good morning.");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(32, "button");
      i04.\u0275\u0275text(33, "+ Add product");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(34, "section", 5)(35, "div")(36, "p", 6);
      i04.\u0275\u0275text(37, "TODAY AT A GLANCE");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(38, "h2");
      i04.\u0275\u0275text(39, "Your store is ready for business.");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(40, "p");
      i04.\u0275\u0275text(41, "Everything looks healthy. New orders and customer activity will appear here.");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(42, "div", 7);
      i04.\u0275\u0275domElement(43, "span");
      i04.\u0275\u0275text(44, " Store online");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(45, "section", 8)(46, "article")(47, "p");
      i04.\u0275\u0275text(48, "Orders today");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(49, "strong");
      i04.\u0275\u0275text(50, "0");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(51, "small");
      i04.\u0275\u0275text(52, "Waiting for the first order");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(53, "article")(54, "p");
      i04.\u0275\u0275text(55, "Revenue");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(56, "strong");
      i04.\u0275\u0275text(57, "\u20B90");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(58, "small");
      i04.\u0275\u0275text(59, "Today\u2019s total");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(60, "article")(61, "p");
      i04.\u0275\u0275text(62, "Products");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(63, "strong");
      i04.\u0275\u0275text(64, "0");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(65, "small");
      i04.\u0275\u0275text(66, "Add your first product");
      i04.\u0275\u0275domElementEnd()()();
      i04.\u0275\u0275domElementStart(67, "section", 9)(68, "div")(69, "p", 6);
      i04.\u0275\u0275text(70, "GET STARTED");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(71, "h2");
      i04.\u0275\u0275text(72, "Build your storefront");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(73, "ol")(74, "li")(75, "span");
      i04.\u0275\u0275text(76, "1");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(77, "div")(78, "strong");
      i04.\u0275\u0275text(79, "Add your products");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(80, "p");
      i04.\u0275\u0275text(81, "List what you sell with clear pricing.");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(82, "button");
      i04.\u0275\u0275text(83, "Start \u2192");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(84, "li")(85, "span");
      i04.\u0275\u0275text(86, "2");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(87, "div")(88, "strong");
      i04.\u0275\u0275text(89, "Complete your store profile");
      i04.\u0275\u0275domElementEnd();
      i04.\u0275\u0275domElementStart(90, "p");
      i04.\u0275\u0275text(91, "Add business hours and contact details.");
      i04.\u0275\u0275domElementEnd()();
      i04.\u0275\u0275domElementStart(92, "button");
      i04.\u0275\u0275text(93, "Open \u2192");
      i04.\u0275\u0275domElementEnd()()()()()();
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  color: #1a281f;\n  background: #f3f1eb;\n  font-family: Arial, sans-serif;\n}\n.office[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 250px 1fr;\n}\naside[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n  box-sizing: border-box;\n  padding: 32px 24px;\n  display: flex;\n  flex-direction: column;\n  background: #103d29;\n  color: white;\n}\n.brand[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 800;\n}\n.brand[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  margin-right: 8px;\n  border-radius: 10px;\n  background: #efd276;\n  color: #194b31;\n}\nnav[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  margin-top: 58px;\n}\nnav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  padding: 12px 14px;\n  border-radius: 9px;\n  color: #b9cabf;\n  font-size: 14px;\n}\nnav[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%] {\n  color: white;\n  background: rgba(255, 255, 255, 0.11);\n}\n.store[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 11px;\n  margin-top: auto;\n  padding-top: 20px;\n  border-top: 1px solid rgba(255, 255, 255, 0.13);\n}\n.avatar[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  background: #d4b75e;\n  color: #173e2b;\n  font-weight: 800;\n}\n.store[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  font-size: 12px;\n}\n.store[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #9db3a5;\n}\nmain[_ngcontent-%COMP%] {\n  padding: 50px clamp(30px, 5vw, 76px);\n}\nheader[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: end;\n  margin-bottom: 35px;\n}\nheader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  color: #778078;\n  font-size: 13px;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: Georgia, serif;\n  font-size: 42px;\n  font-weight: 500;\n}\nheader[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \nli[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 10px;\n  padding: 12px 18px;\n  color: white;\n  background: #1a6541;\n  font-weight: 700;\n}\n.hero[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: end;\n  padding: 38px;\n  border-radius: 20px;\n  color: white;\n  background:\n    linear-gradient(\n      135deg,\n      #1b6743,\n      #12462f);\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #d5bd6b;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.13em;\n}\n.hero[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 10px 0;\n  font: 500 30px Georgia, serif;\n}\n.hero[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  max-width: 570px;\n  color: #c0d0c6;\n}\n.pulse[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  font-size: 13px;\n}\n.pulse[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  margin-right: 7px;\n  border-radius: 50%;\n  background: #72db9c;\n  box-shadow: 0 0 0 5px rgba(114, 219, 156, 0.13);\n}\n.metrics[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n  margin: 22px 0;\n}\n.metrics[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  padding: 25px;\n  border: 1px solid #dedbd1;\n  border-radius: 16px;\n  background: #fff;\n}\n.metrics[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #707971;\n  font-size: 13px;\n}\n.metrics[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin: 17px 0 9px;\n  font: 500 34px Georgia, serif;\n}\n.metrics[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #909790;\n}\n.next[_ngcontent-%COMP%] {\n  margin-top: 42px;\n}\n.next[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 8px 0 18px;\n  font: 500 28px Georgia, serif;\n}\n.next[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  border: 1px solid #dedbd1;\n  border-radius: 16px;\n  background: white;\n}\n.next[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 16px;\n  align-items: center;\n  padding: 20px 23px;\n  border-bottom: 1px solid #ebe9e2;\n}\n.next[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border: 0;\n}\n.next[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #eef3ef;\n  color: #1a6541;\n  font-weight: 800;\n}\n.next[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 5px 0 0;\n  color: #7b837c;\n  font-size: 13px;\n}\n.next[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  color: #1a6541;\n  background: transparent;\n}\n@media (max-width: 800px) {\n  .office[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  aside[_ngcontent-%COMP%] {\n    position: static;\n    height: auto;\n  }\n  nav[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .store[_ngcontent-%COMP%] {\n    display: none;\n  }\n  main[_ngcontent-%COMP%] {\n    padding: 28px 20px;\n  }\n  .metrics[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .hero[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .pulse[_ngcontent-%COMP%] {\n    margin-top: 25px;\n  }\n}"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-back-office", template: '<div class="office">\n  <aside>\n    <div class="brand"><span>J</span> Junction</div>\n    <nav><a class="active">Overview</a><a>Orders</a><a>Catalog</a><a>Customers</a><a>Settings</a></nav>\n    <div class="store"><div class="avatar">MR</div><span><strong>Main Road Store</strong><small>Ranchi</small></span></div>\n  </aside>\n  <main>\n    <header><div><p>Saturday, 8 August</p><h1>Good morning.</h1></div><button>+ Add product</button></header>\n    <section class="hero"><div><p class="eyebrow">TODAY AT A GLANCE</p><h2>Your store is ready for business.</h2><p>Everything looks healthy. New orders and customer activity will appear here.</p></div><div class="pulse"><span></span> Store online</div></section>\n    <section class="metrics"><article><p>Orders today</p><strong>0</strong><small>Waiting for the first order</small></article><article><p>Revenue</p><strong>\u20B90</strong><small>Today\u2019s total</small></article><article><p>Products</p><strong>0</strong><small>Add your first product</small></article></section>\n    <section class="next"><div><p class="eyebrow">GET STARTED</p><h2>Build your storefront</h2></div><ol><li><span>1</span><div><strong>Add your products</strong><p>List what you sell with clear pricing.</p></div><button>Start \u2192</button></li><li><span>2</span><div><strong>Complete your store profile</strong><p>Add business hours and contact details.</p></div><button>Open \u2192</button></li></ol></section>\n  </main>\n</div>\n', styles: ["/* apps/back-office/src/app/app.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n  color: #1a281f;\n  background: #f3f1eb;\n  font-family: Arial, sans-serif;\n}\n.office {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 250px 1fr;\n}\naside {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n  box-sizing: border-box;\n  padding: 32px 24px;\n  display: flex;\n  flex-direction: column;\n  background: #103d29;\n  color: white;\n}\n.brand {\n  font-size: 20px;\n  font-weight: 800;\n}\n.brand span {\n  display: inline-grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  margin-right: 8px;\n  border-radius: 10px;\n  background: #efd276;\n  color: #194b31;\n}\nnav {\n  display: grid;\n  gap: 8px;\n  margin-top: 58px;\n}\nnav a {\n  padding: 12px 14px;\n  border-radius: 9px;\n  color: #b9cabf;\n  font-size: 14px;\n}\nnav .active {\n  color: white;\n  background: rgba(255, 255, 255, 0.11);\n}\n.store {\n  display: flex;\n  align-items: center;\n  gap: 11px;\n  margin-top: auto;\n  padding-top: 20px;\n  border-top: 1px solid rgba(255, 255, 255, 0.13);\n}\n.avatar {\n  display: grid;\n  place-items: center;\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  background: #d4b75e;\n  color: #173e2b;\n  font-weight: 800;\n}\n.store span {\n  display: grid;\n  gap: 4px;\n  font-size: 12px;\n}\n.store small {\n  color: #9db3a5;\n}\nmain {\n  padding: 50px clamp(30px, 5vw, 76px);\n}\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: end;\n  margin-bottom: 35px;\n}\nheader p {\n  margin: 0 0 8px;\n  color: #778078;\n  font-size: 13px;\n}\nh1 {\n  margin: 0;\n  font-family: Georgia, serif;\n  font-size: 42px;\n  font-weight: 500;\n}\nheader button,\nli button {\n  border: 0;\n  border-radius: 10px;\n  padding: 12px 18px;\n  color: white;\n  background: #1a6541;\n  font-weight: 700;\n}\n.hero {\n  display: flex;\n  justify-content: space-between;\n  align-items: end;\n  padding: 38px;\n  border-radius: 20px;\n  color: white;\n  background:\n    linear-gradient(\n      135deg,\n      #1b6743,\n      #12462f);\n}\n.eyebrow {\n  color: #d5bd6b;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.13em;\n}\n.hero h2 {\n  margin: 10px 0;\n  font: 500 30px Georgia, serif;\n}\n.hero p:last-child {\n  max-width: 570px;\n  color: #c0d0c6;\n}\n.pulse {\n  white-space: nowrap;\n  font-size: 13px;\n}\n.pulse span {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  margin-right: 7px;\n  border-radius: 50%;\n  background: #72db9c;\n  box-shadow: 0 0 0 5px rgba(114, 219, 156, 0.13);\n}\n.metrics {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 18px;\n  margin: 22px 0;\n}\n.metrics article {\n  padding: 25px;\n  border: 1px solid #dedbd1;\n  border-radius: 16px;\n  background: #fff;\n}\n.metrics p {\n  margin: 0;\n  color: #707971;\n  font-size: 13px;\n}\n.metrics strong {\n  display: block;\n  margin: 17px 0 9px;\n  font: 500 34px Georgia, serif;\n}\n.metrics small {\n  color: #909790;\n}\n.next {\n  margin-top: 42px;\n}\n.next h2 {\n  margin: 8px 0 18px;\n  font: 500 28px Georgia, serif;\n}\n.next ol {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  border: 1px solid #dedbd1;\n  border-radius: 16px;\n  background: white;\n}\n.next li {\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 16px;\n  align-items: center;\n  padding: 20px 23px;\n  border-bottom: 1px solid #ebe9e2;\n}\n.next li:last-child {\n  border: 0;\n}\n.next li > span {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #eef3ef;\n  color: #1a6541;\n  font-weight: 800;\n}\n.next li p {\n  margin: 5px 0 0;\n  color: #7b837c;\n  font-size: 13px;\n}\n.next li button {\n  color: #1a6541;\n  background: transparent;\n}\n@media (max-width: 800px) {\n  .office {\n    grid-template-columns: 1fr;\n  }\n  aside {\n    position: static;\n    height: auto;\n  }\n  nav {\n    display: none;\n  }\n  .store {\n    display: none;\n  }\n  main {\n    padding: 28px 20px;\n  }\n  .metrics {\n    grid-template-columns: 1fr;\n  }\n  .hero {\n    display: block;\n  }\n  .pulse {\n    margin-top: 25px;\n  }\n}\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(App, { className: "App", filePath: "apps/back-office/src/app/app.ts", lineNumber: 8 });
})();

// apps/back-office/src/bootstrap.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
