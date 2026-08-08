import {
  __spreadProps,
  __spreadValues,
  loadRemoteModule
} from "./chunk-TXF3AVHY.js";

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

// apps/shell/src/app/app.config.ts
import { provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

// apps/shell/src/app/core/auth.guard.ts
import { inject as inject3 } from "@angular/core";
import { Router } from "@angular/router";

// apps/shell/src/app/core/token.service.ts
import { Injectable as Injectable4 } from "@angular/core";
import * as i04 from "@angular/core";
var TOKEN_KEY = "junction.auth";
var TokenService = class _TokenService {
  get accessToken() {
    return this.tokens?.accessToken ?? null;
  }
  get refreshToken() {
    return this.tokens?.refreshToken ?? null;
  }
  get isAuthenticated() {
    return !!this.accessToken && (this.tokens?.expiresAt ?? 0) > Date.now();
  }
  save(tokens) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(__spreadProps(__spreadValues({}, tokens), { expiresAt: Date.now() + tokens.expiresInSeconds * 1e3 })));
  }
  saveAccessToken(accessToken) {
    const expiresAt = this.getJwtExpiration(accessToken) ?? Date.now() + 60 * 6e4;
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken, expiresAt }));
  }
  updateAccessToken(accessToken) {
    const tokens = this.tokens;
    if (!tokens) {
      this.saveAccessToken(accessToken);
      return;
    }
    const expiresAt = this.getJwtExpiration(accessToken) ?? Date.now() + (tokens.expiresInSeconds ?? 3600) * 1e3;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(__spreadProps(__spreadValues({}, tokens), {
      accessToken,
      expiresAt
    })));
  }
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
  millisecondsUntilRefresh() {
    return Math.max(0, (this.tokens?.expiresAt ?? 0) - Date.now() - 5 * 6e4);
  }
  get tokens() {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "null");
    } catch {
      this.clear();
      return null;
    }
  }
  getJwtExpiration(accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.exp ? payload.exp * 1e3 : null;
    } catch {
      return null;
    }
  }
  static \u0275fac = function TokenService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TokenService)();
  };
  static \u0275prov = /* @__PURE__ */ i04.\u0275\u0275defineInjectable({ token: _TokenService, factory: _TokenService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(TokenService, [{
    type: Injectable4,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// apps/shell/src/app/core/auth.guard.ts
var authGuard = () => {
  return inject3(TokenService).isAuthenticated ? true : inject3(Router).createUrlTree(["/login"]);
};

// apps/shell/src/app/login/login.ts
import { Component, inject as inject6, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router as Router3 } from "@angular/router";
import { finalize } from "rxjs";

// apps/shell/src/app/core/auth.service.ts
import { inject as inject5, Injectable as Injectable6 } from "@angular/core";
import { Router as Router2 } from "@angular/router";
import { BehaviorSubject, tap } from "rxjs";

// apps/shell/src/app/core/api.service.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject as inject4, Injectable as Injectable5 } from "@angular/core";

// apps/shell/src/app/core/api.config.ts
import { InjectionToken as InjectionToken3 } from "@angular/core";
var API_CONFIG = new InjectionToken3("API_CONFIG", {
  providedIn: "root",
  // factory: () => ({ baseUrl: 'https://junctionback.onrender.com' }),
  factory: () => ({ baseUrl: "http://localhost:8000" })
});

// apps/shell/src/app/core/api.service.ts
import * as i05 from "@angular/core";
var ApiService = class _ApiService {
  http = inject4(HttpClient);
  config = inject4(API_CONFIG);
  tokens = inject4(TokenService);
  get(path, params) {
    return this.http.get(this.url(path), {
      params: new HttpParams({ fromObject: params ?? {} }),
      headers: this.getAuthHeaders()
    });
  }
  post(path, body) {
    return this.http.post(this.url(path), body, {
      headers: this.getAuthHeaders()
    });
  }
  getAuthHeaders() {
    const accessToken = this.tokens.accessToken;
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  }
  url(path) {
    return `${this.config.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }
  static \u0275fac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiService)();
  };
  static \u0275prov = /* @__PURE__ */ i05.\u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassMetadata(ApiService, [{
    type: Injectable5,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// apps/shell/src/app/core/auth.service.ts
import * as i06 from "@angular/core";
var AuthService = class _AuthService {
  api = inject5(ApiService);
  tokens = inject5(TokenService);
  router = inject5(Router2);
  refreshTimer;
  authenticated$ = new BehaviorSubject(this.tokens.isAuthenticated);
  requestOtp(payload) {
    return this.api.post("/auth/otp/request", payload);
  }
  verifyOtp(challengeId, otp, phoneNumber, sessionInfo) {
    const payload = {
      challenge_id: challengeId,
      otp,
      phone_number: phoneNumber,
      session_info: sessionInfo
    };
    return this.api.post("/auth/otp/verify", payload).pipe(tap((value) => this.acceptAccessToken(value.access_token)));
  }
  refresh() {
    return this.api.post("/auth/refresh", {}).pipe(tap((value) => {
      this.tokens.updateAccessToken(value.access_token);
      this.authenticated$.next(true);
      this.scheduleRefresh();
    }));
  }
  startSession() {
    if (this.tokens.isAuthenticated)
      this.scheduleRefresh();
  }
  logout() {
    clearTimeout(this.refreshTimer);
    this.tokens.clear();
    this.authenticated$.next(false);
    void this.router.navigateByUrl("/login");
  }
  acceptTokens(tokens) {
    this.tokens.save(tokens);
    this.authenticated$.next(true);
    this.scheduleRefresh();
  }
  acceptAccessToken(accessToken) {
    this.tokens.saveAccessToken(accessToken);
    this.authenticated$.next(true);
    this.scheduleRefresh();
  }
  scheduleRefresh() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.refresh().subscribe({ error: () => this.logout() }), this.tokens.millisecondsUntilRefresh());
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ i06.\u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i06.\u0275setClassMetadata(AuthService, [{
    type: Injectable6,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// apps/shell/src/app/login/login.ts
import * as i07 from "@angular/core";
import * as i1 from "@angular/forms";
function Login_Conditional_20_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    i07.\u0275\u0275elementStart(0, "small");
    i07.\u0275\u0275text(1, "Please enter your name.");
    i07.\u0275\u0275elementEnd();
  }
}
function Login_Conditional_20_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    i07.\u0275\u0275elementStart(0, "small");
    i07.\u0275\u0275text(1, "Enter a valid 10-digit Indian mobile number.");
    i07.\u0275\u0275elementEnd();
  }
}
function Login_Conditional_20_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    i07.\u0275\u0275elementStart(0, "p", 18);
    i07.\u0275\u0275text(1);
    i07.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = i07.\u0275\u0275nextContext(2);
    i07.\u0275\u0275advance();
    i07.\u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function Login_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i07.\u0275\u0275getCurrentView();
    i07.\u0275\u0275elementStart(0, "p", 11);
    i07.\u0275\u0275text(1, "Welcome to Junction");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(2, "h2", 12);
    i07.\u0275\u0275text(3, "Let\u2019s get you set up");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(4, "p", 13);
    i07.\u0275\u0275text(5, "A few details, then we\u2019ll verify your mobile number.");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(6, "form", 14);
    i07.\u0275\u0275listener("ngSubmit", function Login_Conditional_20_Template_form_ngSubmit_6_listener() {
      i07.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i07.\u0275\u0275nextContext();
      return i07.\u0275\u0275resetView(ctx_r1.sendOtp());
    });
    i07.\u0275\u0275elementStart(7, "label");
    i07.\u0275\u0275text(8, "Full name");
    i07.\u0275\u0275element(9, "input", 15);
    i07.\u0275\u0275controlCreate();
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275conditionalCreate(10, Login_Conditional_20_Conditional_10_Template, 2, 0, "small");
    i07.\u0275\u0275elementStart(11, "label");
    i07.\u0275\u0275text(12, "Mobile number");
    i07.\u0275\u0275elementStart(13, "div", 16)(14, "span");
    i07.\u0275\u0275text(15, "+91");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275element(16, "input", 17);
    i07.\u0275\u0275controlCreate();
    i07.\u0275\u0275elementEnd()();
    i07.\u0275\u0275conditionalCreate(17, Login_Conditional_20_Conditional_17_Template, 2, 0, "small");
    i07.\u0275\u0275conditionalCreate(18, Login_Conditional_20_Conditional_18_Template, 2, 1, "p", 18);
    i07.\u0275\u0275elementStart(19, "button", 19);
    i07.\u0275\u0275text(20);
    i07.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i07.\u0275\u0275nextContext();
    i07.\u0275\u0275advance(6);
    i07.\u0275\u0275property("formGroup", ctx_r1.details);
    i07.\u0275\u0275advance(3);
    i07.\u0275\u0275control();
    i07.\u0275\u0275advance();
    i07.\u0275\u0275conditional(ctx_r1.details.controls.display_name.touched && ctx_r1.details.controls.display_name.invalid ? 10 : -1);
    i07.\u0275\u0275advance(6);
    i07.\u0275\u0275control();
    i07.\u0275\u0275advance();
    i07.\u0275\u0275conditional(ctx_r1.details.controls.phone_number.touched && ctx_r1.details.controls.phone_number.invalid ? 17 : -1);
    i07.\u0275\u0275advance();
    i07.\u0275\u0275conditional(ctx_r1.error() ? 18 : -1);
    i07.\u0275\u0275advance();
    i07.\u0275\u0275property("disabled", ctx_r1.busy());
    i07.\u0275\u0275advance();
    i07.\u0275\u0275textInterpolate(ctx_r1.busy() ? "Sending\u2026" : "Send OTP");
  }
}
function Login_Conditional_21_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    i07.\u0275\u0275elementStart(0, "p", 18);
    i07.\u0275\u0275text(1);
    i07.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = i07.\u0275\u0275nextContext(2);
    i07.\u0275\u0275advance();
    i07.\u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function Login_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i07.\u0275\u0275getCurrentView();
    i07.\u0275\u0275elementStart(0, "button", 20);
    i07.\u0275\u0275listener("click", function Login_Conditional_21_Template_button_click_0_listener() {
      i07.\u0275\u0275restoreView(_r3);
      const ctx_r1 = i07.\u0275\u0275nextContext();
      return i07.\u0275\u0275resetView(ctx_r1.editNumber());
    });
    i07.\u0275\u0275text(1, "\u2190 Edit details");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(2, "p", 11);
    i07.\u0275\u0275text(3, "One quick check");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(4, "h2", 12);
    i07.\u0275\u0275text(5, "Enter your OTP");
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(6, "p", 13);
    i07.\u0275\u0275text(7);
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275elementStart(8, "form", 14);
    i07.\u0275\u0275listener("ngSubmit", function Login_Conditional_21_Template_form_ngSubmit_8_listener() {
      i07.\u0275\u0275restoreView(_r3);
      const ctx_r1 = i07.\u0275\u0275nextContext();
      return i07.\u0275\u0275resetView(ctx_r1.verifyOtp());
    });
    i07.\u0275\u0275elementStart(9, "label");
    i07.\u0275\u0275text(10, "Verification code");
    i07.\u0275\u0275element(11, "input", 21);
    i07.\u0275\u0275controlCreate();
    i07.\u0275\u0275elementEnd();
    i07.\u0275\u0275conditionalCreate(12, Login_Conditional_21_Conditional_12_Template, 2, 1, "p", 18);
    i07.\u0275\u0275elementStart(13, "button", 19);
    i07.\u0275\u0275text(14);
    i07.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = i07.\u0275\u0275nextContext();
    i07.\u0275\u0275advance(7);
    i07.\u0275\u0275textInterpolate1("We sent a 6-digit code to +91 ", ctx_r1.details.getRawValue().phone_number, ".");
    i07.\u0275\u0275advance();
    i07.\u0275\u0275property("formGroup", ctx_r1.otpForm);
    i07.\u0275\u0275advance(3);
    i07.\u0275\u0275control();
    i07.\u0275\u0275advance();
    i07.\u0275\u0275conditional(ctx_r1.error() ? 12 : -1);
    i07.\u0275\u0275advance();
    i07.\u0275\u0275property("disabled", ctx_r1.busy());
    i07.\u0275\u0275advance();
    i07.\u0275\u0275textInterpolate(ctx_r1.busy() ? "Verifying\u2026" : "Verify & continue");
  }
}
var Login = class _Login {
  fb = inject6(FormBuilder);
  auth = inject6(AuthService);
  router = inject6(Router3);
  step = signal(
    "details",
    ...ngDevMode ? [{ debugName: "step" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = signal(
    "",
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  challengeId = signal(
    "",
    ...ngDevMode ? [{ debugName: "challengeId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sessionInfo = signal(
    "",
    ...ngDevMode ? [{ debugName: "sessionInfo" }] : (
      /* istanbul ignore next */
      []
    )
  );
  details = this.fb.nonNullable.group({
    display_name: ["", [Validators.required, Validators.minLength(2)]],
    phone_number: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    recaptcha_token: ["test-token"]
    // TODO: Integrate Google reCAPTCHA v3
  });
  otpForm = this.fb.nonNullable.group({ otp: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]] });
  sendOtp() {
    if (this.details.invalid) {
      this.details.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set("");
    const formValue = this.details.getRawValue();
    const payload = __spreadProps(__spreadValues({}, formValue), {
      phone_number: `+91${formValue.phone_number}`
      // Prepend country code
    });
    this.auth.requestOtp(payload).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: (response) => {
        this.challengeId.set(response.challengeId);
        this.sessionInfo.set(response.session_info);
        this.step.set("otp");
      },
      error: () => this.error.set("We could not send the OTP. Check the local API and try again.")
    });
  }
  verifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set("");
    const phoneNumber = `+91${this.details.getRawValue().phone_number}`;
    this.auth.verifyOtp(this.challengeId(), this.otpForm.getRawValue().otp, phoneNumber, this.sessionInfo()).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => void this.router.navigateByUrl("/back-office"),
      error: () => this.error.set("That OTP is invalid or has expired. Please try again.")
    });
  }
  editNumber() {
    this.otpForm.reset();
    this.step.set("details");
    this.error.set("");
  }
  static \u0275fac = function Login_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Login)();
  };
  static \u0275cmp = /* @__PURE__ */ i07.\u0275\u0275defineComponent({ type: _Login, selectors: [["app-login"]], decls: 24, vars: 3, consts: [[1, "login-page"], [1, "story"], ["href", "/", "aria-label", "Junction home", 1, "brand"], [1, "story-copy"], [1, "eyebrow"], [1, "trusted"], ["aria-labelledby", "login-title", 1, "overlay"], [1, "card"], ["aria-label", "Login progress", 1, "steps"], [1, "active"], [1, "terms"], [1, "kicker"], ["id", "login-title"], [1, "subcopy"], [3, "ngSubmit", "formGroup"], ["formControlName", "display_name", "autocomplete", "name", "placeholder", "e.g. Aarav Kumar"], [1, "phone"], ["formControlName", "phone_number", "inputmode", "numeric", "maxlength", "10", "autocomplete", "tel", "placeholder", "98765 43210"], ["role", "alert", 1, "error"], ["type", "submit", 3, "disabled"], ["type", "button", 1, "back", 3, "click"], ["formControlName", "otp", "inputmode", "numeric", "maxlength", "6", "autocomplete", "one-time-code", "placeholder", "000000", 1, "otp"]], template: function Login_Template(rf, ctx) {
    if (rf & 1) {
      i07.\u0275\u0275elementStart(0, "main", 0)(1, "section", 1)(2, "a", 2)(3, "span");
      i07.\u0275\u0275text(4, "J");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275text(5, " Junction");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275elementStart(6, "div", 3)(7, "p", 4);
      i07.\u0275\u0275text(8, "Your neighbourhood, connected");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275elementStart(9, "h1");
      i07.\u0275\u0275text(10, "Run your business from one calm place.");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275elementStart(11, "p");
      i07.\u0275\u0275text(12, "Manage your storefront, orders and customers with tools designed for the way local businesses work.");
      i07.\u0275\u0275elementEnd()();
      i07.\u0275\u0275elementStart(13, "p", 5);
      i07.\u0275\u0275text(14, "Secure, password-free access");
      i07.\u0275\u0275elementEnd()();
      i07.\u0275\u0275elementStart(15, "section", 6)(16, "div", 7)(17, "div", 8);
      i07.\u0275\u0275element(18, "span", 9)(19, "span");
      i07.\u0275\u0275elementEnd();
      i07.\u0275\u0275conditionalCreate(20, Login_Conditional_20_Template, 21, 6)(21, Login_Conditional_21_Template, 15, 5);
      i07.\u0275\u0275elementStart(22, "p", 10);
      i07.\u0275\u0275text(23, "By continuing, you agree to Junction\u2019s Terms and Privacy Policy.");
      i07.\u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      i07.\u0275\u0275advance(19);
      i07.\u0275\u0275classProp("active", ctx.step() === "otp");
      i07.\u0275\u0275advance();
      i07.\u0275\u0275conditional(ctx.step() === "details" ? 20 : 21);
    }
  }, dependencies: [ReactiveFormsModule, i1.\u0275NgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MaxLengthValidator, i1.FormGroupDirective, i1.FormControlName], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 1.05fr 0.95fr;\n  background: #f5f3ee;\n  color: #17251c;\n}\n.story[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  padding: 52px 8vw;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  color: white;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(11, 58, 38, 0.97),\n      rgba(19, 91, 57, 0.91));\n}\n.story[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  width: 460px;\n  height: 460px;\n  right: -180px;\n  bottom: -160px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  border-radius: 50%;\n  box-shadow: 0 0 0 62px rgba(255, 255, 255, 0.04), 0 0 0 124px rgba(255, 255, 255, 0.035);\n}\n.brand[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  color: inherit;\n  text-decoration: none;\n  font-size: 21px;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n}\n.brand[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  margin-right: 8px;\n  border-radius: 12px;\n  color: #194b31;\n  background: #f3d782;\n}\n.story-copy[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  max-width: 570px;\n}\n.eyebrow[_ngcontent-%COMP%], \n.kicker[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  letter-spacing: 0.14em;\n  font-size: 12px;\n  font-weight: 800;\n  color: #f1cf71;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 12px 0 24px;\n  font-family: Georgia, serif;\n  font-size: clamp(48px, 5.4vw, 76px);\n  font-weight: 500;\n  line-height: 0.98;\n  letter-spacing: -0.045em;\n}\n.story-copy[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:last-child {\n  max-width: 490px;\n  color: rgba(255, 255, 255, 0.73);\n  font-size: 17px;\n  line-height: 1.65;\n}\n.trusted[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.62);\n}\n.overlay[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  padding: 42px;\n  background:\n    radial-gradient(\n      circle at 50% 30%,\n      #fff 0,\n      #f5f3ee 65%);\n}\n.card[_ngcontent-%COMP%] {\n  width: min(100%, 480px);\n  box-sizing: border-box;\n  padding: 42px;\n  border: 1px solid #dedbd2;\n  border-radius: 28px;\n  background: rgba(255, 255, 255, 0.88);\n  box-shadow: 0 28px 80px rgba(20, 42, 29, 0.1);\n}\n.steps[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 34px;\n}\n.steps[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 4px;\n  border-radius: 99px;\n  background: #dedbd2;\n}\n.steps[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%] {\n  background: #206c45;\n}\n.kicker[_ngcontent-%COMP%] {\n  color: #26754d;\n  margin: 0 0 10px;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: Georgia, serif;\n  font-size: 39px;\n  font-weight: 500;\n  letter-spacing: -0.03em;\n}\n.subcopy[_ngcontent-%COMP%] {\n  color: #6a746d;\n  line-height: 1.55;\n  margin: 12px 0 28px;\n}\nform[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 17px;\n}\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  color: #36453b;\n  font-size: 13px;\n  font-weight: 700;\n}\ninput[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  padding: 14px 15px;\n  background: #fff;\n  color: #17251c;\n  font: inherit;\n  font-size: 15px;\n  outline: none;\n}\ninput[_ngcontent-%COMP%]:focus {\n  border-color: #26754d;\n  box-shadow: 0 0 0 3px rgba(38, 117, 77, 0.12);\n}\ninput[_ngcontent-%COMP%]:disabled {\n  color: #59645c;\n  background: #f1f1ed;\n}\n.phone[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  align-items: center;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  background: white;\n}\n.phone[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding-left: 15px;\n  color: #59645c;\n  font-weight: 600;\n}\n.phone[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0;\n  box-shadow: none;\n}\n.location[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n.locked[_ngcontent-%COMP%] {\n  margin: -7px 0 2px;\n  color: #778078;\n  font-size: 12px;\n}\nsmall[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  color: #b44136;\n  font-size: 12px;\n  margin-top: -12px;\n}\n.error[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  margin: 0;\n  border-radius: 9px;\n  background: #fff0ed;\n}\nbutton[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 12px;\n  padding: 15px 20px;\n  color: white;\n  background: #17633e;\n  font: inherit;\n  font-weight: 800;\n  cursor: pointer;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: wait;\n}\n.back[_ngcontent-%COMP%] {\n  padding: 0;\n  margin-bottom: 24px;\n  color: #26754d;\n  background: none;\n  font-size: 13px;\n}\n.otp[_ngcontent-%COMP%] {\n  text-align: center;\n  letter-spacing: 0.55em;\n  padding-left: calc(15px + 0.55em);\n  font-size: 22px;\n  font-weight: 700;\n}\n.terms[_ngcontent-%COMP%] {\n  margin: 28px 0 0;\n  text-align: center;\n  color: #8a918b;\n  font-size: 11px;\n}\n@media (max-width: 850px) {\n  .login-page[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .story[_ngcontent-%COMP%] {\n    min-height: 260px;\n    padding: 30px;\n  }\n  .story-copy[_ngcontent-%COMP%] {\n    margin: 45px 0;\n  }\n  h1[_ngcontent-%COMP%] {\n    font-size: 45px;\n  }\n  .trusted[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .overlay[_ngcontent-%COMP%] {\n    padding: 22px;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 30px 24px;\n  }\n}'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassMetadata(Login, [{
    type: Component,
    args: [{ selector: "app-login", imports: [ReactiveFormsModule], template: `<main class="login-page">
  <section class="story">
    <a class="brand" href="/" aria-label="Junction home"><span>J</span> Junction</a>
    <div class="story-copy">
      <p class="eyebrow">Your neighbourhood, connected</p>
      <h1>Run your business from one calm place.</h1>
      <p>Manage your storefront, orders and customers with tools designed for the way local businesses work.</p>
    </div>
    <p class="trusted">Secure, password-free access</p>
  </section>

  <section class="overlay" aria-labelledby="login-title">
    <div class="card">
      <div class="steps" aria-label="Login progress"><span class="active"></span><span [class.active]="step() === 'otp'"></span></div>
      @if (step() === 'details') {
        <p class="kicker">Welcome to Junction</p>
        <h2 id="login-title">Let\u2019s get you set up</h2>
        <p class="subcopy">A few details, then we\u2019ll verify your mobile number.</p>
        <form [formGroup]="details" (ngSubmit)="sendOtp()">
          <label>Full name<input formControlName="display_name" autocomplete="name" placeholder="e.g. Aarav Kumar" /></label>
          @if (details.controls.display_name.touched && details.controls.display_name.invalid) { <small>Please enter your name.</small> }
          <label>Mobile number<div class="phone"><span>+91</span><input formControlName="phone_number" inputmode="numeric" maxlength="10" autocomplete="tel" placeholder="98765 43210" /></div></label>
          @if (details.controls.phone_number.touched && details.controls.phone_number.invalid) { <small>Enter a valid 10-digit Indian mobile number.</small> }
          @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
          <button type="submit" [disabled]="busy()">{{ busy() ? 'Sending\u2026' : 'Send OTP' }}</button>
        </form>
      } @else {
        <button class="back" type="button" (click)="editNumber()">\u2190 Edit details</button>
        <p class="kicker">One quick check</p>
        <h2 id="login-title">Enter your OTP</h2>
        <p class="subcopy">We sent a 6-digit code to +91 {{ details.getRawValue().phone_number }}.</p>
        <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()">
          <label>Verification code<input class="otp" formControlName="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" /></label>
          @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
          <button type="submit" [disabled]="busy()">{{ busy() ? 'Verifying\u2026' : 'Verify & continue' }}</button>
        </form>
      }
      <p class="terms">By continuing, you agree to Junction\u2019s Terms and Privacy Policy.</p>
    </div>
  </section>
</main>
`, styles: ['/* apps/shell/src/app/login/login.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n}\n.login-page {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 1.05fr 0.95fr;\n  background: #f5f3ee;\n  color: #17251c;\n}\n.story {\n  position: relative;\n  overflow: hidden;\n  padding: 52px 8vw;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  color: white;\n  background:\n    linear-gradient(\n      145deg,\n      rgba(11, 58, 38, 0.97),\n      rgba(19, 91, 57, 0.91));\n}\n.story::after {\n  content: "";\n  position: absolute;\n  width: 460px;\n  height: 460px;\n  right: -180px;\n  bottom: -160px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  border-radius: 50%;\n  box-shadow: 0 0 0 62px rgba(255, 255, 255, 0.04), 0 0 0 124px rgba(255, 255, 255, 0.035);\n}\n.brand {\n  position: relative;\n  z-index: 1;\n  color: inherit;\n  text-decoration: none;\n  font-size: 21px;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n}\n.brand span {\n  display: inline-grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  margin-right: 8px;\n  border-radius: 12px;\n  color: #194b31;\n  background: #f3d782;\n}\n.story-copy {\n  position: relative;\n  z-index: 1;\n  max-width: 570px;\n}\n.eyebrow,\n.kicker {\n  text-transform: uppercase;\n  letter-spacing: 0.14em;\n  font-size: 12px;\n  font-weight: 800;\n  color: #f1cf71;\n}\nh1 {\n  margin: 12px 0 24px;\n  font-family: Georgia, serif;\n  font-size: clamp(48px, 5.4vw, 76px);\n  font-weight: 500;\n  line-height: 0.98;\n  letter-spacing: -0.045em;\n}\n.story-copy > p:last-child {\n  max-width: 490px;\n  color: rgba(255, 255, 255, 0.73);\n  font-size: 17px;\n  line-height: 1.65;\n}\n.trusted {\n  position: relative;\n  z-index: 1;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.62);\n}\n.overlay {\n  display: grid;\n  place-items: center;\n  padding: 42px;\n  background:\n    radial-gradient(\n      circle at 50% 30%,\n      #fff 0,\n      #f5f3ee 65%);\n}\n.card {\n  width: min(100%, 480px);\n  box-sizing: border-box;\n  padding: 42px;\n  border: 1px solid #dedbd2;\n  border-radius: 28px;\n  background: rgba(255, 255, 255, 0.88);\n  box-shadow: 0 28px 80px rgba(20, 42, 29, 0.1);\n}\n.steps {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 34px;\n}\n.steps span {\n  width: 34px;\n  height: 4px;\n  border-radius: 99px;\n  background: #dedbd2;\n}\n.steps .active {\n  background: #206c45;\n}\n.kicker {\n  color: #26754d;\n  margin: 0 0 10px;\n}\nh2 {\n  margin: 0;\n  font-family: Georgia, serif;\n  font-size: 39px;\n  font-weight: 500;\n  letter-spacing: -0.03em;\n}\n.subcopy {\n  color: #6a746d;\n  line-height: 1.55;\n  margin: 12px 0 28px;\n}\nform {\n  display: grid;\n  gap: 17px;\n}\nlabel {\n  display: grid;\n  gap: 8px;\n  color: #36453b;\n  font-size: 13px;\n  font-weight: 700;\n}\ninput {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  padding: 14px 15px;\n  background: #fff;\n  color: #17251c;\n  font: inherit;\n  font-size: 15px;\n  outline: none;\n}\ninput:focus {\n  border-color: #26754d;\n  box-shadow: 0 0 0 3px rgba(38, 117, 77, 0.12);\n}\ninput:disabled {\n  color: #59645c;\n  background: #f1f1ed;\n}\n.phone {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  align-items: center;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  background: white;\n}\n.phone span {\n  padding-left: 15px;\n  color: #59645c;\n  font-weight: 600;\n}\n.phone input {\n  border: 0;\n  box-shadow: none;\n}\n.location {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n.locked {\n  margin: -7px 0 2px;\n  color: #778078;\n  font-size: 12px;\n}\nsmall,\n.error {\n  color: #b44136;\n  font-size: 12px;\n  margin-top: -12px;\n}\n.error {\n  padding: 10px 12px;\n  margin: 0;\n  border-radius: 9px;\n  background: #fff0ed;\n}\nbutton {\n  border: 0;\n  border-radius: 12px;\n  padding: 15px 20px;\n  color: white;\n  background: #17633e;\n  font: inherit;\n  font-weight: 800;\n  cursor: pointer;\n}\nbutton:disabled {\n  opacity: 0.55;\n  cursor: wait;\n}\n.back {\n  padding: 0;\n  margin-bottom: 24px;\n  color: #26754d;\n  background: none;\n  font-size: 13px;\n}\n.otp {\n  text-align: center;\n  letter-spacing: 0.55em;\n  padding-left: calc(15px + 0.55em);\n  font-size: 22px;\n  font-weight: 700;\n}\n.terms {\n  margin: 28px 0 0;\n  text-align: center;\n  color: #8a918b;\n  font-size: 11px;\n}\n@media (max-width: 850px) {\n  .login-page {\n    grid-template-columns: 1fr;\n  }\n  .story {\n    min-height: 260px;\n    padding: 30px;\n  }\n  .story-copy {\n    margin: 45px 0;\n  }\n  h1 {\n    font-size: 45px;\n  }\n  .trusted {\n    display: none;\n  }\n  .overlay {\n    padding: 22px;\n  }\n  .card {\n    padding: 30px 24px;\n  }\n}\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i07.\u0275setClassDebugInfo(Login, { className: "Login", filePath: "apps/shell/src/app/login/login.ts", lineNumber: 13 });
})();

// apps/shell/src/app/app.routes.ts
var routes = [
  { path: "login", component: Login },
  {
    path: "back-office",
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule("backOffice", "./Component").then((module) => module.App)
  },
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", redirectTo: "login" }
];

// apps/shell/src/app/core/auth.interceptor.ts
import { inject as inject7 } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
var authInterceptor = (request, next) => {
  const config = inject7(API_CONFIG);
  const tokens = inject7(TokenService);
  const auth = inject7(AuthService);
  const isApiCall = request.url.startsWith(config.baseUrl);
  const isAuthCall = request.url.includes("/auth/otp/") || request.url.includes("/auth/refresh");
  const outgoing = isApiCall && tokens.accessToken ? request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } }) : request;
  return next(outgoing).pipe(catchError((error) => {
    if (error.status !== 401 || !isApiCall || isAuthCall || !tokens.accessToken) return throwError(() => error);
    return auth.refresh().pipe(
      switchMap(() => next(request.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } }))),
      catchError((refreshError) => {
        auth.logout();
        return throwError(() => refreshError);
      })
    );
  }));
};

// apps/shell/src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// apps/shell/src/app/app.ts
import { Component as Component2, inject as inject8 } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import * as i08 from "@angular/core";
var App = class _App {
  constructor() {
    inject8(AuthService).startSession();
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i08.\u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i08.\u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i08.\u0275setClassMetadata(App, [{
    type: Component2,
    args: [{
      selector: "app-root",
      imports: [RouterOutlet],
      template: "<router-outlet />"
    }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i08.\u0275setClassDebugInfo(App, { className: "App", filePath: "apps/shell/src/app/app.ts", lineNumber: 10 });
})();

// apps/shell/src/bootstrap.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
