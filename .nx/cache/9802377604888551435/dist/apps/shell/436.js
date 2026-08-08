(self["webpackChunkshell"] = self["webpackChunkshell"] || []).push([[436],{

/***/ 7348
/*!****************************************************************************!*\
  !*** ./node_modules/@angular/platform-browser/fesm2022/_browser-chunk.mjs ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserDomAdapter: () => (/* binding */ BrowserDomAdapter),
/* harmony export */   BrowserGetTestability: () => (/* binding */ BrowserGetTestability),
/* harmony export */   BrowserModule: () => (/* binding */ BrowserModule),
/* harmony export */   KeyEventsPlugin: () => (/* binding */ KeyEventsPlugin),
/* harmony export */   bootstrapApplication: () => (/* binding */ bootstrapApplication),
/* harmony export */   createApplication: () => (/* binding */ createApplication),
/* harmony export */   platformBrowser: () => (/* binding */ platformBrowser),
/* harmony export */   provideProtractorTestingSupport: () => (/* binding */ provideProtractorTestingSupport)
/* harmony export */ });
/* harmony import */ var C_Users_ancqitBhargav_Desktop_workspace_codex_junction_back_web_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/asyncToGenerator.js */ 5000);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6041);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_dom_renderer-chunk.mjs */ 8547);

/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */





class BrowserDomAdapter extends _angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵDomAdapter"] {
  supportsDOMEvents = true;
  static makeCurrent() {
    (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵsetRootDomAdapter"])(new BrowserDomAdapter());
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
    return document.implementation.createHTMLDocument('fakeTitle');
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
    if (target === 'window') {
      return window;
    }
    if (target === 'document') {
      return doc;
    }
    if (target === 'body') {
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
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵparseCookieValue"])(document.cookie, name);
  }
}
let baseElement = null;
function getBaseElementHref() {
  baseElement = baseElement || document.head.querySelector('base');
  return baseElement ? baseElement.getAttribute('href') : null;
}
function relativePath(url) {
  return new URL(url, document.baseURI).pathname;
}
class BrowserGetTestability {
  addToWindow(registry) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['getAngularTestability'] = (elem, findInAncestors = true) => {
      const testability = registry.findTestabilityInTree(elem, findInAncestors);
      if (testability == null) {
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5103, (typeof ngDevMode === 'undefined' || ngDevMode) && 'Could not find testability for element.');
      }
      return testability;
    };
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['getAllAngularTestabilities'] = () => registry.getAllTestabilities();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['getAllAngularRootElements'] = () => registry.getAllRootElements();
    const whenAllStable = callback => {
      const testabilities = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['getAllAngularTestabilities']();
      let count = testabilities.length;
      const decrement = function () {
        count--;
        if (count == 0) {
          callback();
        }
      };
      testabilities.forEach(testability => {
        testability.whenStable(decrement);
      });
    };
    if (!_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['frameworkStabilizers']) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['frameworkStabilizers'] = [];
    }
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['frameworkStabilizers'].push(whenAllStable);
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
    if ((0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])().isShadowRoot(elem)) {
      return this.findTestabilityInTree(registry, elem.host, true);
    }
    return this.findTestabilityInTree(registry, elem.parentElement, true);
  }
}
const MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
const _keyMap = {
  '\b': 'Backspace',
  '\t': 'Tab',
  '\x7F': 'Delete',
  '\x1B': 'Escape',
  'Del': 'Delete',
  'Esc': 'Escape',
  'Left': 'ArrowLeft',
  'Right': 'ArrowRight',
  'Up': 'ArrowUp',
  'Down': 'ArrowDown',
  'Menu': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'Win': 'OS'
};
const MODIFIER_KEY_GETTERS = {
  'alt': event => event.altKey,
  'control': event => event.ctrlKey,
  'meta': event => event.metaKey,
  'shift': event => event.shiftKey
};
let KeyEventsPlugin = /*#__PURE__*/(() => {
  class KeyEventsPlugin extends _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EventManagerPlugin {
    constructor(doc) {
      super(doc);
    }
    supports(eventName) {
      return KeyEventsPlugin.parseEventName(eventName) != null;
    }
    addEventListener(element, eventName, handler, options) {
      const parsedEvent = KeyEventsPlugin.parseEventName(eventName);
      const outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
      return this.manager.getZone().runOutsideAngular(() => {
        return (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])().onAndCancel(element, parsedEvent['domEventName'], outsideHandler, options);
      });
    }
    static parseEventName(eventName) {
      const parts = eventName.toLowerCase().split('.');
      const domEventName = parts.shift();
      if (parts.length === 0 || !(domEventName === 'keydown' || domEventName === 'keyup')) {
        return null;
      }
      const key = KeyEventsPlugin._normalizeKey(parts.pop());
      let fullKey = '';
      let codeIX = parts.indexOf('code');
      if (codeIX > -1) {
        parts.splice(codeIX, 1);
        fullKey = 'code.';
      }
      MODIFIER_KEYS.forEach(modifierName => {
        const index = parts.indexOf(modifierName);
        if (index > -1) {
          parts.splice(index, 1);
          fullKey += modifierName + '.';
        }
      });
      fullKey += key;
      if (parts.length != 0 || key.length === 0) {
        return null;
      }
      const result = {};
      result['domEventName'] = domEventName;
      result['fullKey'] = fullKey;
      return result;
    }
    static matchEventFullKeyCode(event, fullKeyCode) {
      let keycode = _keyMap[event.key] || event.key;
      let key = '';
      if (fullKeyCode.indexOf('code.') > -1) {
        keycode = event.code;
        key = 'code.';
      }
      if (keycode == null || !keycode) return false;
      keycode = keycode.toLowerCase();
      if (keycode === ' ') {
        keycode = 'space';
      } else if (keycode === '.') {
        keycode = 'dot';
      }
      MODIFIER_KEYS.forEach(modifierName => {
        if (modifierName !== keycode) {
          const modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
          if (modifierGetter(event)) {
            key += modifierName + '.';
          }
        }
      });
      key += keycode;
      return key === fullKeyCode;
    }
    static eventCallback(fullKey, handler, zone) {
      return event => {
        if (KeyEventsPlugin.matchEventFullKeyCode(event, fullKey)) {
          zone.runGuarded(() => handler(event));
        }
      };
    }
    static _normalizeKey(keyName) {
      return keyName === 'esc' ? 'escape' : keyName;
    }
    static ɵfac = function KeyEventsPlugin_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || KeyEventsPlugin)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: KeyEventsPlugin,
      factory: KeyEventsPlugin.ɵfac
    });
  }
  return KeyEventsPlugin;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
function bootstrapApplication(_x, _x2, _x3) {
  return _bootstrapApplication.apply(this, arguments);
}
function _bootstrapApplication() {
  _bootstrapApplication = C_Users_ancqitBhargav_Desktop_workspace_codex_junction_back_web_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__(function* (rootComponent, options, context) {
    const config = {
      rootComponent,
      ...createProvidersConfig(options, context)
    };
    if ((typeof ngJitMode === 'undefined' || ngJitMode) && typeof fetch === 'function') {
      yield resolveJitResources();
    }
    return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵinternalCreateApplication"])(config);
  });
  return _bootstrapApplication.apply(this, arguments);
}
function createApplication(_x4, _x5) {
  return _createApplication.apply(this, arguments);
}
function _createApplication() {
  _createApplication = C_Users_ancqitBhargav_Desktop_workspace_codex_junction_back_web_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__(function* (options, context) {
    if ((typeof ngJitMode === 'undefined' || ngJitMode) && typeof fetch === 'function') {
      yield resolveJitResources();
    }
    return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵinternalCreateApplication"])(createProvidersConfig(options, context));
  });
  return _createApplication.apply(this, arguments);
}
function createProvidersConfig(options, context) {
  return {
    platformRef: context?.platformRef,
    appProviders: [...BROWSER_MODULE_PROVIDERS, ...(options?.providers ?? [])],
    platformProviders: INTERNAL_BROWSER_PLATFORM_PROVIDERS
  };
}
function resolveJitResources() {
  return _resolveJitResources.apply(this, arguments);
}
function _resolveJitResources() {
  _resolveJitResources = C_Users_ancqitBhargav_Desktop_workspace_codex_junction_back_web_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__(function* () {
    try {
      return yield (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵresolveComponentResources"])(fetch);
    } catch (error) {
      console.error(error);
    }
  });
  return _resolveJitResources.apply(this, arguments);
}
function provideProtractorTestingSupport(options = {}) {
  return [...TESTABILITY_PROVIDERS, options?.usePendingTasksForStability !== undefined ? {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵUSE_PENDING_TASKS"],
    useValue: options.usePendingTasksForStability ?? false
  } : []];
}
function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
}
function errorHandler() {
  return new _angular_core__WEBPACK_IMPORTED_MODULE_2__.ErrorHandler();
}
function _document() {
  ;(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetDocument"])(document);
  return document;
}
const INTERNAL_BROWSER_PLATFORM_PROVIDERS = [{
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.PLATFORM_ID,
  useValue: _angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵPLATFORM_BROWSER_ID"]
}, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.PLATFORM_INITIALIZER,
  useValue: initDomAdapter,
  multi: true
}, {
  provide: _angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT,
  useFactory: _document
}];
const platformBrowser = /*#__PURE__*/(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.createPlatformFactory)(_angular_core__WEBPACK_IMPORTED_MODULE_2__.platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);
const BROWSER_MODULE_PROVIDERS_MARKER = /*#__PURE__*/new _angular_core__WEBPACK_IMPORTED_MODULE_2__.InjectionToken(typeof ngDevMode === 'undefined' || ngDevMode ? 'BrowserModule Providers Marker' : '');
const TESTABILITY_PROVIDERS = [{
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵTESTABILITY_GETTER"],
  useClass: BrowserGetTestability
}, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵTESTABILITY"],
  useClass: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Testability,
  deps: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone, _angular_core__WEBPACK_IMPORTED_MODULE_2__.TestabilityRegistry, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵTESTABILITY_GETTER"]]
}, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Testability,
  useClass: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Testability,
  deps: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone, _angular_core__WEBPACK_IMPORTED_MODULE_2__.TestabilityRegistry, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵTESTABILITY_GETTER"]]
}];
const BROWSER_MODULE_PROVIDERS = [{
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵINJECTOR_SCOPE"],
  useValue: 'root'
}, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ErrorHandler,
  useFactory: errorHandler
}, {
  provide: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EVENT_MANAGER_PLUGINS,
  useClass: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.DomEventsPlugin,
  multi: true
}, {
  provide: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EVENT_MANAGER_PLUGINS,
  useClass: KeyEventsPlugin,
  multi: true
}, _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.DomRendererFactory2, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵSHARED_STYLES_HOST"],
  useClass: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.SharedStylesHost
}, {
  provide: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.SharedStylesHost,
  useExisting: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵSHARED_STYLES_HOST"]
}, _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EventManager, {
  provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.RendererFactory2,
  useExisting: _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.DomRendererFactory2
}, typeof ngDevMode === 'undefined' || ngDevMode ? {
  provide: BROWSER_MODULE_PROVIDERS_MARKER,
  useValue: true
} : []];
let BrowserModule = /*#__PURE__*/(() => {
  class BrowserModule {
    constructor() {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        const providersAlreadyPresent = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(BROWSER_MODULE_PROVIDERS_MARKER, {
          optional: true,
          skipSelf: true
        });
        if (providersAlreadyPresent) {
          throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5100, `Providers from the \`BrowserModule\` have already been loaded. If you need access ` + `to common directives such as NgIf and NgFor, import the \`CommonModule\` instead.`);
        }
      }
    }
    static ɵfac = function BrowserModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || BrowserModule)();
    };
    static ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: BrowserModule
    });
    static ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_core__WEBPACK_IMPORTED_MODULE_2__.ApplicationModule]
    });
  }
  return BrowserModule;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();


/***/ },

/***/ 8547
/*!*********************************************************************************!*\
  !*** ./node_modules/@angular/platform-browser/fesm2022/_dom_renderer-chunk.mjs ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSS_VAR_NAMESPACE: () => (/* binding */ CSS_VAR_NAMESPACE),
/* harmony export */   DomEventsPlugin: () => (/* binding */ DomEventsPlugin),
/* harmony export */   DomRendererFactory2: () => (/* binding */ DomRendererFactory2),
/* harmony export */   EVENT_MANAGER_PLUGINS: () => (/* binding */ EVENT_MANAGER_PLUGINS),
/* harmony export */   EventManager: () => (/* binding */ EventManager),
/* harmony export */   EventManagerPlugin: () => (/* binding */ EventManagerPlugin),
/* harmony export */   REMOVE_STYLES_ON_COMPONENT_DESTROY: () => (/* binding */ REMOVE_STYLES_ON_COMPONENT_DESTROY),
/* harmony export */   SharedStylesHost: () => (/* binding */ SharedStylesHost),
/* harmony export */   provideCssVarNamespacing: () => (/* binding */ provideCssVarNamespacing)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 6041);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4691);
/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */




class EventManagerPlugin {
  _doc;
  constructor(_doc) {
    this._doc = _doc;
  }
  manager;
}
let DomEventsPlugin = /*#__PURE__*/(() => {
  class DomEventsPlugin extends EventManagerPlugin {
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
    static ɵfac = function DomEventsPlugin_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || DomEventsPlugin)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: DomEventsPlugin,
      factory: DomEventsPlugin.ɵfac
    });
  }
  return DomEventsPlugin;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
const EVENT_MANAGER_PLUGINS = /*#__PURE__*/new _angular_core__WEBPACK_IMPORTED_MODULE_1__.InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'EventManagerPlugins' : '');
let EventManager = /*#__PURE__*/(() => {
  class EventManager {
    _zone;
    _plugins;
    _eventNameToPlugin = new Map();
    constructor(plugins, _zone) {
      this._zone = _zone;
      plugins.forEach(plugin => {
        plugin.manager = this;
      });
      const otherPlugins = plugins.filter(p => !(p instanceof DomEventsPlugin));
      this._plugins = otherPlugins.slice().reverse();
      const domEventPlugin = plugins.find(p => p instanceof DomEventsPlugin);
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
      plugin = plugins.find(plugin => plugin.supports(eventName));
      if (!plugin) {
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵRuntimeError"](-5101, (typeof ngDevMode === 'undefined' || ngDevMode) && `No event manager plugin found for event ${eventName}`);
      }
      this._eventNameToPlugin.set(eventName, plugin);
      return plugin;
    }
    static ɵfac = function EventManager_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || EventManager)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](EVENT_MANAGER_PLUGINS), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: EventManager,
      factory: EventManager.ɵfac
    });
  }
  return EventManager;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
const APP_ID_ATTRIBUTE_NAME = 'ng-app-id';
function removeElements(elements) {
  for (const element of elements) {
    element.remove();
  }
}
function createStyleElement(style, doc) {
  const styleElement = doc.createElement('style');
  styleElement.textContent = style;
  return styleElement;
}
function addServerStyles(doc, appId, inline, external) {
  const elements = doc.head?.querySelectorAll(`style[${APP_ID_ATTRIBUTE_NAME}="${appId}"],link[${APP_ID_ATTRIBUTE_NAME}="${appId}"]`);
  if (!elements || elements.length === 0) return false;
  for (const styleElement of elements) {
    styleElement.removeAttribute(APP_ID_ATTRIBUTE_NAME);
    if (styleElement instanceof HTMLLinkElement) {
      external.set(styleElement.href.slice(styleElement.href.lastIndexOf('/') + 1), {
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
  const linkElement = doc.createElement('link');
  linkElement.setAttribute('rel', 'stylesheet');
  linkElement.setAttribute('href', url);
  return linkElement;
}
let SharedStylesHost = /*#__PURE__*/(() => {
  class SharedStylesHost {
    doc;
    appId;
    nonce;
    inline = new Map();
    external = new Map();
    hosts = new Set();
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
      urls?.forEach(value => this.addUsage(value, this.external, createLinkElement));
    }
    removeStyles(styles, urls) {
      for (const value of styles) {
        this.removeUsage(value, this.inline);
      }
      urls?.forEach(value => this.removeUsage(value, this.external));
    }
    addUsage(value, usages, creator) {
      const record = usages.get(value);
      if (record) {
        if ((typeof ngDevMode === 'undefined' || ngDevMode) && record.usage === 0) {
          record.elements.forEach(element => element.setAttribute('ng-style-reused', ''));
        }
        record.usage++;
      } else {
        usages.set(value, {
          usage: 1,
          elements: [...this.hosts].map(host => this.addElement(host, creator(value, this.doc)))
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
        element.setAttribute('nonce', this.nonce);
      }
      if (typeof ngServerMode !== 'undefined' && ngServerMode) {
        element.setAttribute(APP_ID_ATTRIBUTE_NAME, this.appId);
      }
      return host.appendChild(element);
    }
    static ɵfac = function SharedStylesHost_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || SharedStylesHost)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.APP_ID), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.CSP_NONCE, 8), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.PLATFORM_ID));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: SharedStylesHost,
      factory: SharedStylesHost.ɵfac
    });
  }
  return SharedStylesHost;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
const NAMESPACE_URIS = {
  'svg': 'http://www.w3.org/2000/svg',
  'xhtml': 'http://www.w3.org/1999/xhtml',
  'xlink': 'http://www.w3.org/1999/xlink',
  'xml': 'http://www.w3.org/XML/1998/namespace',
  'xmlns': 'http://www.w3.org/2000/xmlns/',
  'math': 'http://www.w3.org/1998/Math/MathML'
};
const COMPONENT_REGEX = /%COMP%/g;
const SOURCEMAP_URL_REGEXP = /\/\*#\s*sourceMappingURL=([^\s*]+)\s*\*\//;
const PROTOCOL_REGEXP = /^https?:/;
const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
const REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT = true;
const REMOVE_STYLES_ON_COMPONENT_DESTROY = /*#__PURE__*/new _angular_core__WEBPACK_IMPORTED_MODULE_1__.InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'RemoveStylesOnCompDestroy' : '', {
  factory: () => REMOVE_STYLES_ON_COMPONENT_DESTROY_DEFAULT
});
const CSS_VAR_NAMESPACE = /*#__PURE__*/new _angular_core__WEBPACK_IMPORTED_MODULE_1__.InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'CSS_VAR_NAMESPACE' : '');
function provideCssVarNamespacing(namespace) {
  return (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.makeEnvironmentProviders)([{
    provide: CSS_VAR_NAMESPACE,
    useFactory: appId => `${namespace ?? appId}_`,
    deps: [_angular_core__WEBPACK_IMPORTED_MODULE_1__.APP_ID]
  }]);
}
function shimContentAttribute(componentShortId) {
  return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimHostAttribute(componentShortId) {
  return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function shimStylesContent(compId, styles) {
  return styles.map(s => s.replace(COMPONENT_REGEX, compId));
}
function addBaseHrefToCssSourceMap(baseHref, styles) {
  if (!baseHref) {
    return styles;
  }
  const absoluteBaseHrefUrl = new URL(baseHref, 'http://localhost');
  return styles.map(cssContent => {
    if (!cssContent.includes('sourceMappingURL=')) {
      return cssContent;
    }
    return cssContent.replace(SOURCEMAP_URL_REGEXP, (_, sourceMapUrl) => {
      if (sourceMapUrl[0] === '/' || sourceMapUrl.startsWith('data:') || PROTOCOL_REGEXP.test(sourceMapUrl)) {
        return `/*# sourceMappingURL=${sourceMapUrl} */`;
      }
      const {
        pathname: resolvedSourceMapUrl
      } = new URL(sourceMapUrl, absoluteBaseHrefUrl);
      return `/*# sourceMappingURL=${resolvedSourceMapUrl} */`;
    });
  });
}
let DomRendererFactory2 = /*#__PURE__*/(() => {
  class DomRendererFactory2 {
    eventManager;
    sharedStylesHost;
    appId;
    removeStylesOnCompDestroy;
    doc;
    ngZone;
    nonce;
    tracingService;
    rendererByCompId = new Map();
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
      this.cssVarNamespace = cssVarNamespace ?? '';
      this.defaultRenderer = new DefaultDomRenderer2(eventManager, doc, ngZone, this.tracingService, this.cssVarNamespace);
    }
    createRenderer(element, type) {
      if (!element || !type) {
        return this.defaultRenderer;
      }
      if (typeof ngServerMode !== 'undefined' && ngServerMode && (type.encapsulation === _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.ShadowDom || type.encapsulation === _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.ExperimentalIsolatedShadowDom)) {
        type = {
          ...type,
          encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.Emulated
        };
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
          case _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.Emulated:
            renderer = new EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, type, this.appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, this.cssVarNamespace);
            break;
          case _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.ShadowDom:
            return new ShadowDomRenderer(eventManager, element, type, doc, ngZone, this.nonce, tracingService, this.cssVarNamespace, sharedStylesHost);
          case _angular_core__WEBPACK_IMPORTED_MODULE_1__.ViewEncapsulation.ExperimentalIsolatedShadowDom:
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
    static ɵfac = function DomRendererFactory2_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || DomRendererFactory2)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](EventManager), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵSHARED_STYLES_HOST"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.APP_ID), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](REMOVE_STYLES_ON_COMPONENT_DESTROY), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.CSP_NONCE), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵTracingService"], 8), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](CSS_VAR_NAMESPACE, 8));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: DomRendererFactory2,
      factory: DomRendererFactory2.ɵfac
    });
  }
  return DomRendererFactory2;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
class DefaultDomRenderer2 {
  eventManager;
  doc;
  ngZone;
  tracingService;
  cssVarNamespace;
  data = /*#__PURE__*/Object.create(null);
  throwOnSyntheticProps = true;
  constructor(eventManager, doc, ngZone, tracingService, cssVarNamespace = '') {
    this.eventManager = eventManager;
    this.doc = doc;
    this.ngZone = ngZone;
    this.tracingService = tracingService;
    this.cssVarNamespace = cssVarNamespace;
  }
  destroy() {}
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
    let el = typeof selectorOrNode === 'string' ? this.doc.querySelector(selectorOrNode) : selectorOrNode;
    if (!el) {
      throw new _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵRuntimeError"](-5104, (typeof ngDevMode === 'undefined' || ngDevMode) && `The selector "${selectorOrNode}" did not match any elements`);
    }
    if (!preserveContent) {
      el.textContent = '';
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
      name = namespace + ':' + name;
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
    const isVariable = style.startsWith('--');
    if (isVariable) {
      style = style.replace('%NS%', this.cssVarNamespace);
    }
    if (isVariable || flags & (_angular_core__WEBPACK_IMPORTED_MODULE_1__.RendererStyleFlags2.DashCase | _angular_core__WEBPACK_IMPORTED_MODULE_1__.RendererStyleFlags2.Important)) {
      el.style.setProperty(style, value, flags & _angular_core__WEBPACK_IMPORTED_MODULE_1__.RendererStyleFlags2.Important ? 'important' : '');
    } else {
      el.style[style] = value;
    }
  }
  removeStyle(el, style, flags) {
    const isVariable = style.startsWith('--');
    if (isVariable) {
      style = style.replace('%NS%', this.cssVarNamespace);
    }
    if (isVariable || flags & _angular_core__WEBPACK_IMPORTED_MODULE_1__.RendererStyleFlags2.DashCase) {
      el.style.removeProperty(style);
    } else {
      el.style[style] = '';
    }
  }
  setProperty(el, name, value) {
    if (el == null) {
      return;
    }
    (typeof ngDevMode === 'undefined' || ngDevMode) && this.throwOnSyntheticProps && checkNoSyntheticProp(name, 'property');
    el[name] = value;
  }
  setValue(node, value) {
    node.nodeValue = value;
  }
  listen(target, event, callback, options) {
    (typeof ngDevMode === 'undefined' || ngDevMode) && this.throwOnSyntheticProps && checkNoSyntheticProp(event, 'listener');
    if (typeof target === 'string') {
      target = (0,_angular_common__WEBPACK_IMPORTED_MODULE_0__["ɵgetDOM"])().getGlobalEventTarget(this.doc, target);
      if (!target) {
        throw new _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵRuntimeError"](-5102, (typeof ngDevMode === 'undefined' || ngDevMode) && `Unsupported event target ${target} for event ${event}`);
      }
    }
    let wrappedCallback = this.decoratePreventDefault(callback);
    if (this.tracingService?.wrapEventListener) {
      wrappedCallback = this.tracingService.wrapEventListener(target, event, wrappedCallback);
    }
    return this.eventManager.addEventListener(target, event, wrappedCallback, options);
  }
  decoratePreventDefault(eventHandler) {
    return event => {
      if (event === '__ngUnwrap__') {
        return eventHandler;
      }
      const allowDefaultBehavior = typeof ngServerMode !== 'undefined' && ngServerMode ? this.ngZone.runGuarded(() => eventHandler(event)) : eventHandler(event);
      if (allowDefaultBehavior === false) {
        event.preventDefault();
      }
      return undefined;
    };
  }
}
const AT_CHARCODE = /*#__PURE__*/(() => '@'.charCodeAt(0))();
function checkNoSyntheticProp(name, nameKind) {
  if (name.charCodeAt(0) === AT_CHARCODE) {
    throw new _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵRuntimeError"](5105, `Unexpected synthetic ${nameKind} ${name} found. Please make sure that:
  - Make sure \`provideAnimationsAsync()\`, \`provideAnimations()\` or \`provideNoopAnimations()\` call was added to a list of providers used to bootstrap an application.
  - There is a corresponding animation configuration named \`${name}\` defined in the \`animations\` field of the \`@Component\` decorator (see https://angular.dev/api/core/Component#animations).`);
  }
}
function isTemplateNode(node) {
  return node.tagName === 'TEMPLATE' && node.content !== undefined;
}
class ShadowDomRenderer extends DefaultDomRenderer2 {
  hostEl;
  sharedStylesHost;
  shadowRoot;
  constructor(eventManager, hostEl, component, doc, ngZone, nonce, tracingService, cssVarNamespace, sharedStylesHost) {
    super(eventManager, doc, ngZone, tracingService, cssVarNamespace);
    this.hostEl = hostEl;
    this.sharedStylesHost = sharedStylesHost;
    this.shadowRoot = hostEl.attachShadow({
      mode: 'open'
    });
    if (this.sharedStylesHost) {
      this.sharedStylesHost.addHost(this.shadowRoot);
    }
    let styles = component.styles;
    if (ngDevMode) {
      const baseHref = (0,_angular_common__WEBPACK_IMPORTED_MODULE_0__["ɵgetDOM"])().getBaseHref(doc) ?? '';
      styles = addBaseHrefToCssSourceMap(baseHref, styles);
    }
    styles = shimStylesContent(component.id, styles).map(s => s.replace(/%NS%/g, cssVarNamespace));
    for (const style of styles) {
      const styleEl = document.createElement('style');
      if (nonce) {
        styleEl.setAttribute('nonce', nonce);
      }
      styleEl.textContent = style;
      this.shadowRoot.appendChild(styleEl);
    }
    const styleUrls = component.getExternalStyles?.();
    if (styleUrls) {
      for (const styleUrl of styleUrls) {
        const linkEl = createLinkElement(styleUrl, doc);
        if (nonce) {
          linkEl.setAttribute('nonce', nonce);
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
}
class NoneEncapsulationDomRenderer extends DefaultDomRenderer2 {
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
      const baseHref = (0,_angular_common__WEBPACK_IMPORTED_MODULE_0__["ɵgetDOM"])().getBaseHref(doc) ?? '';
      styles = addBaseHrefToCssSourceMap(baseHref, styles);
    }
    const shimmed = compId ? shimStylesContent(compId, styles) : styles;
    this.styles = shimmed.map(s => s.replace(/%NS%/g, cssVarNamespace));
    this.styleUrls = component.getExternalStyles?.(compId);
  }
  applyStyles() {
    this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
  }
  destroy() {
    if (!this.removeStylesOnCompDestroy) {
      return;
    }
    if (_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵallLeavingAnimations"].size === 0) {
      this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  }
}
class EmulatedEncapsulationDomRenderer2 extends NoneEncapsulationDomRenderer {
  contentAttr;
  hostAttr;
  constructor(eventManager, sharedStylesHost, component, appId, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace) {
    const compId = appId + '-' + component.id;
    super(eventManager, sharedStylesHost, component, removeStylesOnCompDestroy, doc, ngZone, tracingService, cssVarNamespace, compId);
    this.contentAttr = shimContentAttribute(compId);
    this.hostAttr = shimHostAttribute(compId);
  }
  applyToHost(element) {
    this.applyStyles();
    this.setAttribute(element, this.hostAttr, '');
  }
  createElement(parent, name) {
    const el = super.createElement(parent, name);
    super.setAttribute(el, this.contentAttr, '');
    return el;
  }
}


/***/ },

/***/ 436
/*!******************************************************************************!*\
  !*** ./node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserModule: () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.BrowserModule),
/* harmony export */   By: () => (/* binding */ By),
/* harmony export */   CssVarNamespacer: () => (/* binding */ CssVarNamespacer),
/* harmony export */   DomSanitizer: () => (/* binding */ DomSanitizer),
/* harmony export */   EVENT_MANAGER_PLUGINS: () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EVENT_MANAGER_PLUGINS),
/* harmony export */   EventManager: () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EventManager),
/* harmony export */   EventManagerPlugin: () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.EventManagerPlugin),
/* harmony export */   HydrationFeatureKind: () => (/* binding */ HydrationFeatureKind),
/* harmony export */   Meta: () => (/* binding */ Meta),
/* harmony export */   REMOVE_STYLES_ON_COMPONENT_DESTROY: () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.REMOVE_STYLES_ON_COMPONENT_DESTROY),
/* harmony export */   Title: () => (/* binding */ Title),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   bootstrapApplication: () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.bootstrapApplication),
/* harmony export */   createApplication: () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.createApplication),
/* harmony export */   disableDebugTools: () => (/* binding */ disableDebugTools),
/* harmony export */   enableDebugTools: () => (/* binding */ enableDebugTools),
/* harmony export */   platformBrowser: () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.platformBrowser),
/* harmony export */   provideClientHydration: () => (/* binding */ provideClientHydration),
/* harmony export */   provideCssVarNamespacing: () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.provideCssVarNamespacing),
/* harmony export */   provideProtractorTestingSupport: () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.provideProtractorTestingSupport),
/* harmony export */   withEventReplay: () => (/* binding */ withEventReplay),
/* harmony export */   withHttpTransferCacheOptions: () => (/* binding */ withHttpTransferCacheOptions),
/* harmony export */   withI18nSupport: () => (/* binding */ withI18nSupport),
/* harmony export */   withIncrementalHydration: () => (/* binding */ withIncrementalHydration),
/* harmony export */   withNoHttpTransferCache: () => (/* binding */ withNoHttpTransferCache),
/* harmony export */   withNoIncrementalHydration: () => (/* binding */ withNoIncrementalHydration),
/* harmony export */   "ɵBrowserDomAdapter": () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.BrowserDomAdapter),
/* harmony export */   "ɵBrowserGetTestability": () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.BrowserGetTestability),
/* harmony export */   "ɵDomEventsPlugin": () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.DomEventsPlugin),
/* harmony export */   "ɵDomRendererFactory2": () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.DomRendererFactory2),
/* harmony export */   "ɵDomSanitizerImpl": () => (/* binding */ DomSanitizerImpl),
/* harmony export */   "ɵKeyEventsPlugin": () => (/* reexport safe */ _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__.KeyEventsPlugin),
/* harmony export */   "ɵSharedStylesHost": () => (/* reexport safe */ _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.SharedStylesHost),
/* harmony export */   "ɵgetDOM": () => (/* reexport safe */ _angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])
/* harmony export */ });
/* harmony import */ var _browser_chunk_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_browser-chunk.mjs */ 7348);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6041);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_dom_renderer-chunk.mjs */ 8547);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 5087);
/**
 * @license Angular v22.1.1
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */









let Meta = /*#__PURE__*/(() => {
  class Meta {
    _doc = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT);
    _dom = (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])();
    _cachedHead;
    addTag(tag, forceCreation = false) {
      if (!tag) return null;
      return this._getOrCreateElement(tag, forceCreation);
    }
    addTags(tags, forceCreation = false) {
      return tags.filter(tag => !!tag).map(tag => this._getOrCreateElement(tag, forceCreation));
    }
    getTag(attrSelector) {
      if (!attrSelector) return null;
      const meta = this._doc.querySelector(buildMetaSelector(attrSelector));
      return isMetaTag(meta) ? meta : null;
    }
    getTags(attrSelector) {
      if (!attrSelector) return [];
      const list = this._doc.querySelectorAll(buildMetaSelector(attrSelector));
      return list ? Array.from(list).filter(elem => isMetaTag(elem)) : [];
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
        const elem = this.getTags(selector).filter(elem => containsAttributes(meta, elem))[0];
        if (elem !== undefined) return elem;
      }
      const element = this._dom.createElement('meta');
      setMetaElementAttributes(meta, element);
      const head = this._doc.getElementsByTagName('head')[0];
      head.appendChild(element);
      return element;
    }
    static ɵfac = function Meta_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Meta)();
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineService"]({
      token: Meta,
      factory: Meta.ɵfac
    });
  }
  return Meta;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
function buildMetaSelector(attrSelector) {
  return `meta[${attrSelector}]`;
}
function setMetaElementAttributes(tag, el) {
  Object.keys(tag).forEach(prop => el.setAttribute(getMetaKeyMap(prop), tag[prop]));
}
function parseSelector(tag) {
  const attr = tag.name ? 'name' : 'property';
  return `${attr}=${escapeSelectorValue(String(tag[attr]))}`;
}
function escapeSelectorValue(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
function containsAttributes(tag, elem) {
  return Object.keys(tag).every(key => elem.getAttribute(getMetaKeyMap(key)) === tag[key]);
}
function getMetaKeyMap(prop) {
  return META_KEYS_MAP[prop] || prop;
}
function isMetaTag(tag) {
  return tag?.nodeName.toLowerCase() === 'meta';
}
const META_KEYS_MAP = {
  httpEquiv: 'http-equiv'
};
let Title = /*#__PURE__*/(() => {
  class Title {
    _doc;
    constructor(_doc) {
      this._doc = _doc;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(newTitle) {
      this._doc.title = newTitle || '';
    }
    static ɵfac = function Title_Factory(__ngFactoryType__) {
      /* @ts-ignore */
      return new (__ngFactoryType__ || Title)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT));
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: Title,
      factory: Title.ɵfac,
      providedIn: 'root'
    });
  }
  return Title;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
function exportNgVar(name, value) {
  if (typeof COMPILED === 'undefined' || !COMPILED) {
    const ng = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['ng'] = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵglobal"]['ng'] || {};
    ng[name] = value;
  }
}
class ChangeDetectionPerfRecord {
  msPerTick;
  numTicks;
  constructor(msPerTick, numTicks) {
    this.msPerTick = msPerTick;
    this.numTicks = numTicks;
  }
}
class AngularProfiler {
  appRef;
  constructor(ref) {
    this.appRef = ref.injector.get(_angular_core__WEBPACK_IMPORTED_MODULE_2__.ApplicationRef);
  }
  timeChangeDetection(config) {
    const record = config && config['record'];
    const profileName = 'Change Detection';
    if (record && 'profile' in console && typeof console.profile === 'function') {
      console.profile(profileName);
    }
    const start = performance.now();
    let numTicks = 0;
    while (numTicks < 5 || performance.now() - start < 500) {
      this.appRef.tick();
      numTicks++;
    }
    const end = performance.now();
    if (record && 'profileEnd' in console && typeof console.profileEnd === 'function') {
      console.profileEnd(profileName);
    }
    const msPerTick = (end - start) / numTicks;
    console.log(`ran ${numTicks} change detection cycles`);
    console.log(`${msPerTick.toFixed(2)} ms per check`);
    return new ChangeDetectionPerfRecord(msPerTick, numTicks);
  }
}
const PROFILER_GLOBAL_NAME = 'profiler';
function enableDebugTools(ref) {
  exportNgVar(PROFILER_GLOBAL_NAME, new AngularProfiler(ref));
  return ref;
}
function disableDebugTools() {
  exportNgVar(PROFILER_GLOBAL_NAME, null);
}
class By {
  static all() {
    return () => true;
  }
  static css(selector) {
    return debugElement => {
      return debugElement.nativeElement != null ? elementMatches(debugElement.nativeElement, selector) : false;
    };
  }
  static directive(type) {
    return debugNode => debugNode.providerTokens.indexOf(type) !== -1;
  }
}
function elementMatches(n, selector) {
  if ((0,_angular_common__WEBPACK_IMPORTED_MODULE_1__["ɵgetDOM"])().isElementNode(n)) {
    return n.matches && n.matches(selector) || n.msMatchesSelector && n.msMatchesSelector(selector) || n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
  }
  return false;
}
let CssVarNamespacer = /*#__PURE__*/(() => {
  class CssVarNamespacer {
    namespacePrefix = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_3__.CSS_VAR_NAMESPACE, {
      optional: true
    }) ?? '';
    namespace(name) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (!name.startsWith('--')) {
          throw new Error(`CSS variable names passed to \`CssVarNamespacer\` must start with '--', got: '${name}'`);
        }
      }
      if (!this.namespacePrefix) return name;
      return `--${this.namespacePrefix}${name.substring('--'.length)}`;
    }
    static ɵfac = function CssVarNamespacer_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CssVarNamespacer)();
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineService"]({
      token: CssVarNamespacer,
      factory: CssVarNamespacer.ɵfac
    });
  }
  return CssVarNamespacer;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
var HydrationFeatureKind = /*#__PURE__*/function (HydrationFeatureKind) {
  HydrationFeatureKind[HydrationFeatureKind["NoHttpTransferCache"] = 0] = "NoHttpTransferCache";
  HydrationFeatureKind[HydrationFeatureKind["HttpTransferCacheOptions"] = 1] = "HttpTransferCacheOptions";
  HydrationFeatureKind[HydrationFeatureKind["I18nSupport"] = 2] = "I18nSupport";
  HydrationFeatureKind[HydrationFeatureKind["EventReplay"] = 3] = "EventReplay";
  HydrationFeatureKind[HydrationFeatureKind["IncrementalHydration"] = 4] = "IncrementalHydration";
  HydrationFeatureKind[HydrationFeatureKind["NoIncrementalHydration"] = 5] = "NoIncrementalHydration";
  return HydrationFeatureKind;
}(HydrationFeatureKind || {});
function hydrationFeature(ɵkind, ɵproviders = [], ɵoptions = {}) {
  return {
    ɵkind,
    ɵproviders
  };
}
function withNoHttpTransferCache() {
  return hydrationFeature(HydrationFeatureKind.NoHttpTransferCache);
}
function withHttpTransferCacheOptions(options) {
  return hydrationFeature(HydrationFeatureKind.HttpTransferCacheOptions, (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["ɵwithHttpTransferCache"])(options));
}
function withI18nSupport() {
  return hydrationFeature(HydrationFeatureKind.I18nSupport, (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵwithI18nSupport"])());
}
function withEventReplay() {
  return hydrationFeature(HydrationFeatureKind.EventReplay, (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵwithEventReplay"])());
}
function withIncrementalHydration() {
  return hydrationFeature(HydrationFeatureKind.IncrementalHydration, (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵwithIncrementalHydration"])());
}
function withNoIncrementalHydration() {
  return hydrationFeature(HydrationFeatureKind.NoIncrementalHydration);
}
function provideEnabledBlockingInitialNavigationDetector() {
  return [{
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ENVIRONMENT_INITIALIZER,
    useValue: () => {
      const isEnabledBlockingInitialNavigation = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵIS_ENABLED_BLOCKING_INITIAL_NAVIGATION"], {
        optional: true
      });
      if (isEnabledBlockingInitialNavigation) {
        const console = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵConsole"]);
        const message = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵformatRuntimeError"])(5001, 'Configuration error: found both hydration and enabledBlocking initial navigation ' + 'in the same application, which is a contradiction.');
        console.warn(message);
      }
    },
    multi: true
  }];
}
function provideClientHydration(...features) {
  const providers = [];
  const featuresKind = new Set();
  for (const {
    ɵproviders,
    ɵkind
  } of features) {
    featuresKind.add(ɵkind);
    if (ɵproviders.length) {
      providers.push(ɵproviders);
    }
  }
  const hasHttpTransferCacheOptions = featuresKind.has(HydrationFeatureKind.HttpTransferCacheOptions);
  if (typeof ngDevMode !== 'undefined' && ngDevMode) {
    if (featuresKind.has(HydrationFeatureKind.NoHttpTransferCache) && hasHttpTransferCacheOptions) {
      throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5001, 'Configuration error: found both withHttpTransferCacheOptions() and withNoHttpTransferCache() in the same call to provideClientHydration(), which is a contradiction.');
    }
    if (featuresKind.has(HydrationFeatureKind.IncrementalHydration) && featuresKind.has(HydrationFeatureKind.NoIncrementalHydration)) {
      throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5001, 'Configuration error: found both withIncrementalHydration() and withNoIncrementalHydration() in the same call to provideClientHydration(), which is a contradiction.');
    }
  }
  return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.makeEnvironmentProviders)([typeof ngDevMode !== 'undefined' && ngDevMode ? provideEnabledBlockingInitialNavigationDetector() : [], typeof ngDevMode !== 'undefined' && ngDevMode ? (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.provideStabilityDebugging)() : [], (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵwithDomHydration"])(), featuresKind.has(HydrationFeatureKind.NoHttpTransferCache) || hasHttpTransferCacheOptions ? [] : (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["ɵwithHttpTransferCache"])({}), featuresKind.has(HydrationFeatureKind.NoIncrementalHydration) ? [] : (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵwithIncrementalHydration"])(), providers, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵCACHE_ACTIVE"],
    useValue: {
      isActive: true
    }
  }, {
    provide: _angular_core__WEBPACK_IMPORTED_MODULE_2__.APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: () => {
      const appRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__.ApplicationRef);
      const cacheState = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵCACHE_ACTIVE"]);
      return () => {
        appRef.whenStable().then(() => {
          cacheState.isActive = false;
        });
      };
    }
  }]);
}
let DomSanitizer = /*#__PURE__*/(() => {
  class DomSanitizer {
    static ɵfac = function DomSanitizer_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DomSanitizer)();
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: DomSanitizer,
      factory: function DomSanitizer_Factory(__ngFactoryType__) {
        let __ngConditionalFactory__ = null;
        if (__ngFactoryType__) {
          __ngConditionalFactory__ = new (__ngFactoryType__ || DomSanitizer)();
        } else {
          /* @ts-ignore */
          __ngConditionalFactory__ = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DomSanitizerImpl);
        }
        return __ngConditionalFactory__;
      },
      providedIn: 'root'
    });
  }
  return DomSanitizer;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
let DomSanitizerImpl = /*#__PURE__*/(() => {
  class DomSanitizerImpl extends DomSanitizer {
    _doc = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_common__WEBPACK_IMPORTED_MODULE_1__.DOCUMENT);
    sanitize(ctx, value) {
      if (value == null) return null;
      switch (ctx) {
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.NONE:
          return value;
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.HTML:
          if ((0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵallowSanitizationBypassAndThrow"])(value, "HTML")) {
            return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵunwrapSafeValue"])(value);
          }
          return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵ_sanitizeHtml"])(this._doc, String(value)).toString();
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.STYLE:
          if ((0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵallowSanitizationBypassAndThrow"])(value, "Style")) {
            return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵunwrapSafeValue"])(value);
          }
          return value;
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.SCRIPT:
          if ((0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵallowSanitizationBypassAndThrow"])(value, "Script")) {
            return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵunwrapSafeValue"])(value);
          }
          throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5200, (typeof ngDevMode === 'undefined' || ngDevMode) && 'unsafe value used in a script context');
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.URL:
          if ((0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵallowSanitizationBypassAndThrow"])(value, "URL")) {
            return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵunwrapSafeValue"])(value);
          }
          return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵ_sanitizeUrl"])(String(value));
        case _angular_core__WEBPACK_IMPORTED_MODULE_2__.SecurityContext.RESOURCE_URL:
          if ((0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵallowSanitizationBypassAndThrow"])(value, "ResourceURL")) {
            return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵunwrapSafeValue"])(value);
          }
          throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](-5201, (typeof ngDevMode === 'undefined' || ngDevMode) && `unsafe value used in a resource URL context (see ${_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵXSS_SECURITY_URL"]})`);
        default:
          throw new _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵRuntimeError"](5202, (typeof ngDevMode === 'undefined' || ngDevMode) && `Unexpected SecurityContext ${ctx} (see ${_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵXSS_SECURITY_URL"]})`);
      }
    }
    bypassSecurityTrustHtml(value) {
      return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵbypassSanitizationTrustHtml"])(value);
    }
    bypassSecurityTrustStyle(value) {
      return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵbypassSanitizationTrustStyle"])(value);
    }
    bypassSecurityTrustScript(value) {
      return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵbypassSanitizationTrustScript"])(value);
    }
    bypassSecurityTrustUrl(value) {
      return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵbypassSanitizationTrustUrl"])(value);
    }
    bypassSecurityTrustResourceUrl(value) {
      return (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵbypassSanitizationTrustResourceUrl"])(value);
    }
    static ɵfac = function DomSanitizerImpl_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DomSanitizerImpl)();
    };
    static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineService"]({
      token: DomSanitizerImpl,
      factory: DomSanitizerImpl.ɵfac
    });
  }
  return DomSanitizerImpl;
})();
/*#__PURE__*/(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && void 0;
})();
const VERSION = /* @__PURE__ */new _angular_core__WEBPACK_IMPORTED_MODULE_2__.Version('22.1.1');


/***/ }

}])
//# sourceMappingURL=436.js.map