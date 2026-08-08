import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-F2KQRQKD.js";

// node_modules/@softarc/native-federation-orchestrator/fesm2022/@softarc/native-federation-orchestrator.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_debug = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});
var require_constants = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});
var require_re = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});
var require_parse_options = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});
var require_identifiers = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});
var require_semver = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier) => {
      const identifiers = identifier.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                const prereleaseBase = this.prerelease[identifier.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});
var require_parse = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse;
  }
});
var require_valid = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});
var require_lrucache = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});
var require_compare = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});
var require_eq = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq;
  }
});
var require_neq = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});
var require_gt = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});
var require_gte = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});
var require_lt = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});
var require_lte = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});
var require_cmp = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});
var require_comparator = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});
var require_range = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});
var require_satisfies = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});
var require_min_version = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});
var require_valid2 = __commonJS({
  "node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});
var createInitFlow = ({
  flow,
  adapters,
  config
}) => {
  return (remotesOrManifestUrl) => flow.getRemoteEntries(remotesOrManifestUrl).then(flow.processRemoteEntries).then(flow.markPoolsForReelection).then(flow.determineSharedExternals).then(flow.poolSharedExternals).then(flow.generateImportMap).then((importMap) => flow.commitChanges(importMap, { override: true })).then(flow.exposeModuleLoader).then((loadRemoteModule) => ({
    config,
    adapters,
    loadRemoteModule
  }));
};
var createInitRemoteEntryFlow = ({
  flow
}) => {
  const processDynamicRemoteEntry = (remoteEntry) => flow.updateCache(remoteEntry).then(flow.poolDynamicExternals).then(flow.convertToImportMap).then(flow.commitChanges);
  return (remoteEntryUrl, remote) => flow.getRemoteEntry(remoteEntryUrl, remote).then((entry) => entry.map(processDynamicRemoteEntry).orElse(Promise.resolve())).then(() => void 0);
};
var NFError = class extends Error {
  constructor(message, cause) {
    super(message, cause);
    this.name = "NFError";
  }
};
function join(pathA, pathB) {
  pathA = pathA.endsWith("/") ? pathA.slice(0, -1) : pathA;
  pathB = pathB.startsWith("/") ? pathB.slice(1) : pathB;
  return `${pathA}/${pathB}`;
}
function getScope(path) {
  if (!path) return "";
  const parts = path.split("/");
  if (parts[parts.length - 1] === "" || parts[parts.length - 1].includes(".")) {
    parts.pop();
  }
  if (parts.length < 1) return "";
  return `${parts.join("/")}/`;
}
function createGetRemoteEntries(config, ports) {
  return (remotesOrManifestUrl = {}) => {
    const manifestPromise = config.manifestIntegrity ? ports.manifestProvider.provide(remotesOrManifestUrl, {
      integrity: config.manifestIntegrity
    }) : ports.manifestProvider.provide(remotesOrManifestUrl);
    return manifestPromise.catch((e) => {
      config.log.error(1, "Could not fetch manifest.", e);
      return Promise.reject(new NFError("Failed to fetch manifest"));
    }).then(addHostRemoteEntry).then(fetchRemoteEntries).then(removeSkippedRemotes).then(checkForSSE);
  };
  function addHostRemoteEntry(manifest) {
    if (!config.hostRemoteEntry) return manifest;
    const { name, url, integrity } = config.hostRemoteEntry;
    return __spreadProps(__spreadValues({}, manifest), {
      [name]: integrity ? { url, integrity } : url
    });
  }
  function normalizeEntry(descriptor) {
    return typeof descriptor === "string" ? { url: descriptor } : descriptor;
  }
  function withCacheTag(url, cacheTag) {
    if (!cacheTag) return url;
    return `${url}${url.includes("?") ? "&" : "?"}cacheTag=${cacheTag}`;
  }
  function resolveCacheTag(remoteName) {
    if (config.hostRemoteEntry && remoteName === config.hostRemoteEntry.name && config.hostRemoteEntry.cacheTag) {
      return config.hostRemoteEntry.cacheTag;
    }
    return config.profile.cacheTag;
  }
  async function fetchRemoteEntries(manifest) {
    const fetchPromises = Object.entries(manifest).map(
      ([remoteName, descriptor]) => fetchRemoteEntry(remoteName, descriptor)
    );
    return Promise.all(fetchPromises);
  }
  async function fetchRemoteEntry(remoteName, descriptor) {
    const { url: remoteEntryUrl, integrity } = normalizeEntry(descriptor);
    let isOverride = false;
    let skip = false;
    ports.remoteInfoRepo.tryGet(remoteName).ifPresent((cachedRemoteInfo) => {
      if (config.profile.overrideCachedRemotes !== "never" && (remoteEntryUrl !== join(cachedRemoteInfo.scopeUrl, "remoteEntry.json") || config.profile.overrideCachedRemotesIfURLMatches)) {
        config.log.debug(1, `Overriding existing remote '${remoteName}' with '${remoteEntryUrl}'.`);
        isOverride = true;
      } else {
        config.log.debug(1, `Found remote '${remoteName}' in storage, omitting fetch.`);
        skip = true;
      }
    });
    if (skip) return false;
    const fetchUrl = withCacheTag(remoteEntryUrl, resolveCacheTag(remoteName));
    try {
      const remoteEntry = integrity ? await ports.remoteEntryProvider.provide(fetchUrl, { integrity }) : await ports.remoteEntryProvider.provide(fetchUrl);
      config.log.debug(
        1,
        `Fetched '${remoteEntry.name}' from '${remoteEntry.url}', exposing: ${JSON.stringify(remoteEntry.exposes)}`
      );
      return prepareRemoteEntry(remoteEntry, remoteName, isOverride);
    } catch (error) {
      if (config.strict.strictRemoteEntry) {
        config.log.error(1, `Could not fetch remote '${remoteName}'.`, error);
        return Promise.reject(new NFError(`Could not fetch remote '${remoteName}'`));
      }
      config.log.warn(1, `Could not fetch remote '${remoteName}'. skipping init.`, error);
      return Promise.resolve(false);
    }
  }
  function prepareRemoteEntry(remoteEntry, expectedRemoteName, isOverride) {
    if (isOverride) remoteEntry.override = isOverride;
    if (!!config.hostRemoteEntry && expectedRemoteName === config.hostRemoteEntry.name) {
      remoteEntry.host = true;
      remoteEntry.name = config.hostRemoteEntry.name;
    }
    if (remoteEntry.name !== expectedRemoteName) {
      const errorDetails = `Fetched remote '${remoteEntry.name}' does not match requested '${expectedRemoteName}'.`;
      if (config.strict.strictRemoteEntry) {
        throw new NFError(errorDetails);
      }
      config.log.warn(1, `${errorDetails} Omitting expected name.`);
    }
    return remoteEntry;
  }
  function removeSkippedRemotes(remoteEntries) {
    return remoteEntries.filter((entry) => entry !== false);
  }
  function checkForSSE(remoteEntries) {
    if (config.sse) {
      remoteEntries.forEach((entry) => {
        if (entry.buildNotificationsEndpoint) {
          ports.sse.watchRemoteBuilds(
            join(getScope(entry.url), entry.buildNotificationsEndpoint)
          );
          config.log.debug(1, `Registered SSE endpoint of remote '${entry.name}' `);
          return;
        }
        config.log.debug(1, `Remote ${entry.name} has no defined 'buildNotificationsEndpoint'`);
      });
    }
    return remoteEntries;
  }
}
var coverage = (remote) => Object.keys(remote.entries).length;
function isBetterBasis(candidate, basis) {
  if (basis.cached !== candidate.cached) return candidate.cached;
  return coverage(candidate) > coverage(basis);
}
function addRemoteToVersion(version, remote, isHost = false) {
  if (isHost) {
    version.host = true;
    version.remotes.unshift(remote);
    return;
  }
  const basis = version.remotes[0];
  if (basis && !version.host && isBetterBasis(remote, basis)) {
    version.remotes.unshift(remote);
    return;
  }
  version.remotes.push(remote);
}
function versionDemands(version) {
  if (version.remotes.length < 2) return version.remotes;
  const distinct = /* @__PURE__ */ new Map();
  for (const remote of version.remotes) {
    const key = `${remote.requiredVersion}|${remote.strictVersion}|${remote.cached}`;
    if (!distinct.has(key)) distinct.set(key, remote);
  }
  return Array.from(distinct.values());
}
function findVersionForTag(versions, tag) {
  let scoped;
  for (const version of versions) {
    if (version.tag !== tag) continue;
    if (version.action !== "scope") return version;
    scoped ??= version;
  }
  return scoped;
}
function versionEntries(version) {
  return collectEntries(version, void 0);
}
function committedEntries(version) {
  return collectEntries(version, (remote) => remote.cached);
}
function forEachVersionEntry(version, accepts, visit) {
  for (const remote of version.remotes) {
    if (remote.servedBy) continue;
    if (accepts && !accepts(remote)) continue;
    for (const entrypoint in remote.entries) visit(entrypoint, remote);
  }
}
function collectEntries(version, accepts) {
  const entries = /* @__PURE__ */ new Map();
  forEachVersionEntry(version, accepts, (entrypoint, remote) => {
    if (!entries.has(entrypoint)) entries.set(entrypoint, remote);
  });
  return entries;
}
function uncoveredEntrypoints(remote, covered) {
  return Object.keys(remote.entries).filter((entrypoint) => !covered.has(entrypoint));
}
function countUncoveredEntrypoints(remote, covered) {
  let uncovered = 0;
  for (const entrypoint in remote.entries) {
    if (!covered.has(entrypoint)) uncovered++;
  }
  return uncovered;
}
function createRemoveCachedRemoteEntries(ports) {
  return (remoteNames) => {
    if (remoteNames.size === 0) return;
    for (const remoteName of remoteNames) {
      ports.remoteInfoRepo.remove(remoteName);
      ports.scopedExternalsRepo.remove(remoteName);
      ports.sharedChunksRepo.remove(remoteName);
    }
    ports.sharedExternalsRepo.removeFromAllScopes(remoteNames);
  };
}
function createStoreRemoteEntry(config, ports, logStep) {
  return (remoteEntry, onSharedExternal) => {
    addRemoteInfoToStorage(remoteEntry);
    addExternalsToStorage(remoteEntry, onSharedExternal);
    addSharedChunksToStorage(remoteEntry);
  };
  function addRemoteInfoToStorage({ name, url, exposes, integrity }) {
    ports.remoteInfoRepo.addOrUpdate(name, __spreadValues({
      scopeUrl: getScope(url),
      exposes: Object.values(exposes ?? []).map((m) => ({
        moduleName: m.key,
        file: m.outFileName
      }))
    }, integrity ? { integrity } : {}));
  }
  function addExternalsToStorage(remoteEntry, onSharedExternal) {
    remoteEntry.shared.forEach((external) => {
      const tag = resolveVersion(remoteEntry, external);
      if (tag === null) return;
      if (external.singleton) {
        onSharedExternal(remoteEntry, external, sharedExternalContext(remoteEntry, external, tag));
      } else {
        addScopedExternal(remoteEntry, external, tag);
      }
    });
  }
  function addSharedChunksToStorage(remoteEntry) {
    if (!remoteEntry.chunks) return;
    config.log.debug(
      logStep,
      `Adding chunks for remote "${remoteEntry.name}", bundles: [${Object.keys(remoteEntry.chunks).join(", ")}]`
    );
    Object.entries(remoteEntry.chunks).forEach(([bundleName, chunks]) => {
      ports.sharedChunksRepo.addOrReplace(remoteEntry.name, bundleName, chunks);
    });
  }
  function addScopedExternal(remoteEntry, sharedInfo, tag) {
    ports.scopedExternalsRepo.addExternal(remoteEntry.name, sharedInfo.packageName, {
      tag,
      bundle: sharedInfo.bundle,
      entries: sharedInfo.entries
    });
  }
  function resolveVersion(remoteEntry, external) {
    if (external.version && ports.versionCheck.isValidSemver(external.version)) {
      return external.version;
    }
    const errorMsg = `[${remoteEntry.name}][${external.packageName}] Version '${external.version}' is not a valid version.`;
    if (config.strict.strictExternalVersion) {
      config.log.error(logStep, errorMsg);
      throw new NFError(`Could not process remote '${remoteEntry.name}'`);
    }
    if (config.profile.skipInvalidExternalVersions) {
      config.log.warn(logStep, `${errorMsg} Skipping external.`);
      return null;
    }
    config.log.warn(logStep, errorMsg);
    return ports.versionCheck.smallestVersion(external.requiredVersion);
  }
  function sharedExternalContext(remoteEntry, sharedInfo, tag) {
    const scopeType = ports.sharedExternalsRepo.scopeType(sharedInfo.shareScope);
    const remote = __spreadProps(__spreadValues({
      name: remoteEntry.name,
      bundle: sharedInfo.bundle,
      strictVersion: sharedInfo.strictVersion,
      cached: false,
      requiredVersion: scopeType === "strict" ? tag : sharedInfo.requiredVersion || tag
    }, sharedInfo.pool?.trim() ? { pool: sharedInfo.pool } : {}), {
      entries: sharedInfo.entries
    });
    const cached = ports.sharedExternalsRepo.tryGet(sharedInfo.packageName, sharedInfo.shareScope).orElse({ dirty: false, versions: [] });
    return {
      tag,
      remote,
      cached,
      scopeType,
      assertSameVersionCompatibility(matchingVersion) {
        if (!remote.strictVersion) return;
        if (matchingVersion.remotes[0].requiredVersion === remote.requiredVersion) return;
        const errorMsg = `[${remoteEntry.name}][${sharedInfo.packageName}@${sharedInfo.version}] Required version-range '${remote.requiredVersion}' does not match cached version-range '${matchingVersion.remotes[0].requiredVersion}'`;
        if (config.strict.strictExternalSameVersionCompatibility) {
          config.log.error(logStep, errorMsg);
          throw new NFError(`Could not process remote '${remoteEntry.name}'`);
        }
        config.log.warn(logStep, errorMsg);
      },
      commit() {
        ports.sharedExternalsRepo.addOrUpdate(
          sharedInfo.packageName,
          {
            dirty: cached.dirty,
            versions: cached.versions.sort((a, b) => ports.versionCheck.compare(b.tag, a.tag))
          },
          sharedInfo.shareScope
        );
      }
    };
  }
}
function createProcessRemoteEntries(config, ports) {
  const storeRemoteEntry = createStoreRemoteEntry(config, ports, 2);
  const removeCachedRemoteEntries = createRemoveCachedRemoteEntries(ports);
  return (remoteEntries) => {
    try {
      const evictPerEntry = evictOverriddenRemotes(remoteEntries);
      remoteEntries.forEach((remoteEntry) => {
        if (remoteEntry?.override && evictPerEntry.has(remoteEntry.name)) {
          removeCachedRemoteEntries(/* @__PURE__ */ new Set([remoteEntry.name]));
        }
        storeRemoteEntry(remoteEntry, addSharedExternal);
      });
      return Promise.resolve(remoteEntries);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  function evictOverriddenRemotes(remoteEntries) {
    const batched = /* @__PURE__ */ new Set();
    const repeated = /* @__PURE__ */ new Set();
    const seen = /* @__PURE__ */ new Set();
    for (const remoteEntry of remoteEntries) {
      if (!remoteEntry) continue;
      if (seen.has(remoteEntry.name)) repeated.add(remoteEntry.name);
      seen.add(remoteEntry.name);
      if (remoteEntry.override) batched.add(remoteEntry.name);
    }
    for (const remoteName of repeated) batched.delete(remoteName);
    removeCachedRemoteEntries(batched);
    return repeated;
  }
  function addSharedExternal(remoteEntry, _sharedInfo, {
    tag,
    remote,
    cached,
    scopeType,
    assertSameVersionCompatibility,
    commit
  }) {
    if (scopeType !== "strict") cached.dirty = true;
    const matchingVersion = findVersionForTag(cached.versions, tag);
    if (matchingVersion) {
      assertSameVersionCompatibility(matchingVersion);
      addRemoteToVersion(matchingVersion, remote, !matchingVersion.host && !!remoteEntry?.host);
    } else {
      cached.versions.push({
        tag,
        action: scopeType === "strict" ? "share" : "skip",
        host: !!remoteEntry?.host,
        remotes: [remote]
      });
    }
    commit();
  }
}
var GLOBAL_SCOPE = "__GLOBAL__";
var STRICT_SCOPE = "strict";
function versionAcceptance(external, isCompatible) {
  const demands = new Map(
    external.versions.map((v) => [v, versionDemands(v)])
  );
  return {
    accepts: (version, tag) => demands.get(version).every((d) => isCompatible(tag, d.requiredVersion)),
    objector: (version, tag) => demands.get(version).find((d) => d.strictVersion && !isCompatible(tag, d.requiredVersion))
  };
}
function createApplyWinner(config) {
  return function applyWinner(externalName, external, winner, isCompatible, acceptance) {
    if (external.versions.length > 1) {
      const { accepts, objector } = acceptance ?? versionAcceptance(external, isCompatible);
      const rebuilt = [];
      for (const v of external.versions) {
        rebuilt.push(v);
        if (accepts(v, winner.tag)) {
          v.action = "skip";
          continue;
        }
        const strict = objector(v, winner.tag);
        if (config.strict.strictExternalCompatibility && strict) {
          config.log.error(
            3,
            `[${strict.name}][${externalName}@${v.tag}] Is not compatible with requiredRange '${strict.requiredVersion}' of shared ${externalName}@${winner.tag}.`
          );
          throw new NFError(`External ${externalName}@${v.tag} could not be shared.`);
        }
        if (v === winner) continue;
        if (!strict) {
          v.action = "skip";
          continue;
        }
        const objecting = new Set(
          v.remotes.filter((r) => r.strictVersion && !isCompatible(winner.tag, r.requiredVersion))
        );
        if (objecting.size === v.remotes.length) {
          v.action = "scope";
          continue;
        }
        v.remotes = v.remotes.filter((r) => !objecting.has(r));
        v.action = "skip";
        rebuilt.push({ tag: v.tag, host: false, action: "scope", remotes: [...objecting] });
      }
      const merged = /* @__PURE__ */ new Map();
      external.versions = rebuilt.filter((v) => {
        const first = merged.get(`${v.tag}|${v.action}`);
        if (!first) {
          merged.set(`${v.tag}|${v.action}`, v);
          return true;
        }
        first.remotes.push(...v.remotes);
        return false;
      });
    }
    winner.action = "share";
    applyEntrypointCoveragePolicy(externalName, external);
    external.dirty = false;
    return external;
  };
  function applyEntrypointCoveragePolicy(externalName, external) {
    const { strictEntryPointCoverage } = config.strict;
    if (!strictEntryPointCoverage && !config.profile.scopeUncoveredEntrypoints) return;
    const tears = findTears(external);
    if (tears.length === 0) return;
    if (strictEntryPointCoverage) {
      const { version, remote, uncovered } = tears[0];
      config.log.error(
        3,
        `[${externalName}@${version.tag}][${remote.name}] Entrypoints not covered by the shared version: ${uncovered.join(", ")}.`
      );
      throw new NFError(
        `External ${externalName} could not be shared without tearing entrypoints.`
      );
    }
    scopeTornRemotes(externalName, external, tears);
  }
  function findTears(external) {
    const shared = external.versions.find((v) => v.action === "share");
    if (!shared) return [];
    const basis = versionEntries(shared);
    const tears = [];
    for (const version of external.versions) {
      if (version.action === "scope") continue;
      if (version === shared) continue;
      version.remotes.forEach((remote) => {
        if (remote.servedBy) return;
        const uncovered = uncoveredEntrypoints(remote, basis);
        if (uncovered.length > 0) tears.push({ version, remote, uncovered });
      });
    }
    return tears;
  }
  function scopeTornRemotes(externalName, external, tears) {
    const torn = new Set(tears.map((t) => t.remote));
    const demotedByTag = /* @__PURE__ */ new Map();
    for (const { version, remote, uncovered } of tears) {
      const group = demotedByTag.get(version.tag);
      if (group) group.push(remote);
      else demotedByTag.set(version.tag, [remote]);
      config.log.debug(
        3,
        `[${externalName}@${version.tag}][${remote.name}] Scoped: entrypoints not covered by the shared version: ${uncovered.join(", ")}.`
      );
    }
    for (const version of external.versions) {
      if (version.remotes.some((r) => torn.has(r))) {
        version.remotes = version.remotes.filter((r) => !torn.has(r));
      }
    }
    external.versions = external.versions.filter((v) => v.remotes.length > 0);
    for (const [tag, remotes] of demotedByTag) {
      const scoped = external.versions.find((v) => v.tag === tag && v.action === "scope");
      if (scoped) scoped.remotes.push(...remotes);
      else external.versions.push({ tag, host: false, action: "scope", remotes });
    }
  }
}
function createDetermineSharedExternals(config, ports) {
  const applyWinner = createApplyWinner(config);
  return () => {
    const memo = /* @__PURE__ */ new Map();
    const isCompatible = (tag, requiredVersion) => {
      const key = `${tag}|${requiredVersion}`;
      let hit = memo.get(key);
      if (hit === void 0) {
        hit = ports.versionCheck.isCompatible(tag, requiredVersion);
        memo.set(key, hit);
      }
      return hit;
    };
    const touched = /* @__PURE__ */ new Map();
    for (const shareScope of ports.sharedExternalsRepo.getScopes()) {
      const sharedExternals = ports.sharedExternalsRepo.getFromScope(shareScope);
      try {
        const elected = /* @__PURE__ */ new Set();
        Object.entries(sharedExternals).filter(([_, e]) => e.dirty).forEach(([name, external]) => {
          ports.sharedExternalsRepo.addOrUpdate(
            name,
            setVersionActions(name, external, isCompatible),
            shareScope
          );
          elected.add(name);
        });
        if (elected.size > 0) touched.set(shareScope, elected);
      } catch (error) {
        config.log.error(
          3,
          `[${shareScope ?? GLOBAL_SCOPE}] failed to determine shared externals.`,
          {
            sharedExternals,
            error
          }
        );
        return Promise.reject(
          new NFError(
            `Could not determine shared externals in scope ${shareScope}.`,
            error
          )
        );
      }
    }
    return Promise.resolve(touched);
  };
  function uncoveredTears(external, winner, accepts) {
    const basis = versionEntries(winner);
    return external.versions.reduce((sum, v) => {
      if (v === winner) return sum;
      if (!accepts(v, winner.tag)) return sum;
      return v.remotes.reduce(
        (n, r) => r.servedBy ? n : n + countUncoveredEntrypoints(r, basis),
        sum
      );
    }, 0);
  }
  function setVersionActions(externalName, external, isCompatible) {
    if (external.versions.length === 1) {
      return applyWinner(externalName, external, external.versions[0], isCompatible);
    }
    const acceptance = versionAcceptance(external, isCompatible);
    const { accepts } = acceptance;
    let sharedVersion = external.versions.find((v) => v.host);
    if (!sharedVersion && config.profile.latestSharedExternal) {
      sharedVersion = external.versions[0];
    }
    if (!sharedVersion) {
      let leastExtraDownloads = Number.MAX_VALUE;
      let leastTears = Number.MAX_VALUE;
      const selfServing = new Map(
        external.versions.map((v) => {
          const groups = /* @__PURE__ */ new Map();
          for (const remote of v.remotes) {
            if (remote.cached || !remote.strictVersion) continue;
            const group = groups.get(remote.requiredVersion);
            if (group) group.copies++;
            else
              groups.set(remote.requiredVersion, {
                requiredVersion: remote.requiredVersion,
                copies: 1
              });
          }
          return [v, [...groups.values()]];
        })
      );
      const costOf = (version, tag) => selfServing.get(version).reduce((n, g) => isCompatible(tag, g.requiredVersion) ? n : n + g.copies, 0);
      external.versions.forEach((vA) => {
        const extraDownloads = external.versions.reduce(
          // A copy of the winner is never redirected, so it never self-serves however its own range
          // reads — see `applyWinner`, which does not split the winner either.
          (sum, vB) => vB === vA ? sum : sum + costOf(vB, vA.tag),
          0
        );
        if (extraDownloads < leastExtraDownloads) {
          leastExtraDownloads = extraDownloads;
          leastTears = uncoveredTears(external, vA, accepts);
          sharedVersion = vA;
          return;
        }
        if (extraDownloads > leastExtraDownloads) return;
        const tears = uncoveredTears(external, vA, accepts);
        if (tears < leastTears) {
          leastTears = tears;
          sharedVersion = vA;
        }
      });
    }
    if (!sharedVersion) {
      throw new NFError(`[${externalName}] Could not determine shared version!`);
    }
    return applyWinner(externalName, external, sharedVersion, isCompatible, acceptance);
  }
}
function liveBuilds(members, islanded) {
  return walkBuilds(members, islanded, true);
}
function committedView(members) {
  const global = /* @__PURE__ */ new Map();
  forEachGlobalClaim(members, void 0, (specifier, tag, meta) => {
    if (!global.has(specifier))
      global.set(specifier, { tag, remote: meta.name, file: meta.entries[specifier] });
  });
  return { builds: walkBuilds(members, void 0, false), global };
}
function walkBuilds(members, islanded, skipScoped) {
  const builds = /* @__PURE__ */ new Map();
  for (const member of members) {
    const versions = member.external.versions;
    for (let v = 0; v < versions.length; v++) {
      const version = versions[v];
      if (skipScoped && version.action === "scope") continue;
      const remotes = version.remotes;
      for (let r = 0; r < remotes.length; r++) {
        const meta = remotes[r];
        if (islanded?.has(meta.name)) continue;
        let own = builds.get(meta.name);
        if (!own) {
          builds.set(
            meta.name,
            own = { coverage: /* @__PURE__ */ new Map(), tags: /* @__PURE__ */ new Map(), instance: /* @__PURE__ */ new Map() }
          );
        }
        if (!own.instance.has(member.name)) own.instance.set(member.name, version.tag);
        for (const specifier in meta.entries) {
          own.coverage.set(specifier, meta.entries[specifier]);
          if (!own.tags.has(specifier)) own.tags.set(specifier, version.tag);
        }
      }
    }
  }
  return builds;
}
function ownCopies(members, only) {
  const own = /* @__PURE__ */ new Map();
  for (const member of members) {
    for (const version of member.external.versions) {
      for (const meta of version.remotes) {
        if (only && !only.has(meta.name)) continue;
        let copies = own.get(meta.name);
        if (!copies) own.set(meta.name, copies = []);
        if (!copies.some((c) => c.member === member.name))
          copies.push({ member: member.name, tag: version.tag, entries: meta.entries });
      }
    }
  }
  return own;
}
function consumedMembers(members) {
  const consumed = /* @__PURE__ */ new Map();
  for (const member of members) {
    const versions = member.external.versions;
    for (let v = 0; v < versions.length; v++) {
      const remotes = versions[v].remotes;
      for (let r = 0; r < remotes.length; r++) {
        const name = remotes[r].name;
        const list = consumed.get(name);
        if (!list) consumed.set(name, [member.name]);
        else if (list[list.length - 1] !== member.name) list.push(member.name);
      }
    }
  }
  return consumed;
}
function consumedSpecifiers(members) {
  const consumed = /* @__PURE__ */ new Map();
  for (const member of members) {
    const versions = member.external.versions;
    for (let v = 0; v < versions.length; v++) {
      const remotes = versions[v].remotes;
      for (let r = 0; r < remotes.length; r++) {
        const meta = remotes[r];
        let own = consumed.get(meta.name);
        if (!own) consumed.set(meta.name, own = /* @__PURE__ */ new Set());
        for (const specifier in meta.entries) own.add(specifier);
      }
    }
  }
  return consumed;
}
function coversWholePool(members, build, islanded) {
  const served = /* @__PURE__ */ new Set();
  const wanted = /* @__PURE__ */ new Set();
  for (const member of members) {
    for (const version of member.external.versions) {
      for (const meta of version.remotes) {
        if (islanded.has(meta.name)) continue;
        const into = meta.name === build ? served : wanted;
        for (const specifier in meta.entries) into.add(specifier);
      }
    }
  }
  for (const specifier of wanted) if (!served.has(specifier)) return false;
  return true;
}
function servingBuilds(members, islanded) {
  const serving = /* @__PURE__ */ new Map();
  for (const member of members) {
    const shared = member.external.versions.find((v) => v.action === "share");
    const basis = shared?.remotes.find((r) => !islanded.has(r.name));
    if (basis) serving.set(member.name, basis.name);
  }
  return serving;
}
function basisPerMember(members, islanded, dedupsElsewhere) {
  const basis = /* @__PURE__ */ new Map();
  for (const member of members) {
    const winner = member.external.versions.find((v) => v.action === "share");
    if (!winner) continue;
    const own = winner.remotes.find(
      (r) => !islanded?.has(r.name) && !dedupsElsewhere?.(r.name)
    );
    if (own) basis.set(member.name, own.name);
  }
  return basis;
}
function hostRemotes(members) {
  const hosts = /* @__PURE__ */ new Set();
  for (const member of members) {
    for (const version of member.external.versions) {
      if (version.host && version.remotes.length > 0) hosts.add(version.remotes[0].name);
    }
  }
  return hosts;
}
function arrivalOrder(members) {
  const arrival = /* @__PURE__ */ new Map();
  for (const member of members) {
    for (const version of member.external.versions) {
      for (const meta of version.remotes) {
        if (!arrival.has(meta.name)) arrival.set(meta.name, arrival.size);
      }
    }
  }
  return arrival;
}
function sharedTagPerSpecifier(members, islanded) {
  const shared = /* @__PURE__ */ new Map();
  forEachGlobalClaim(members, islanded, (specifier, tag) => {
    if (!shared.has(specifier)) shared.set(specifier, tag);
  });
  return shared;
}
function forEachGlobalClaim(members, islanded, visit) {
  const accepts = islanded ? (meta) => !islanded.has(meta.name) : void 0;
  const claim = (version) => forEachVersionEntry(version, accepts, (specifier, meta) => visit(specifier, version.tag, meta));
  for (const member of members) {
    const versions = member.external.versions;
    const winner = versions.find((v) => v.action === "share");
    if (winner) claim(winner);
    for (let v = 0; v < versions.length; v++) {
      if (versions[v].action === "skip") claim(versions[v]);
    }
  }
}
function acceptanceTable(members, isCompatible) {
  const table = /* @__PURE__ */ new Map();
  for (const member of members) {
    const tags = [];
    for (const version of member.external.versions) tags.push(version.tag);
    for (const version of member.external.versions) {
      for (const meta of version.remotes) {
        let byMember = table.get(meta.name);
        if (!byMember) table.set(meta.name, byMember = /* @__PURE__ */ new Map());
        if (byMember.has(member.name)) continue;
        const accepted = /* @__PURE__ */ new Set();
        for (let t = 0; t < tags.length; t++) {
          if (isCompatible(tags[t], meta.requiredVersion)) accepted.add(tags[t]);
        }
        byMember.set(member.name, accepted);
      }
    }
  }
  return table;
}
function covers(coverage2, consumed) {
  for (const specifier of consumed) if (!coverage2.has(specifier)) return false;
  return true;
}
function acceptsAll(acceptance, build, consumer, consumed) {
  const byMember = acceptance.get(consumer);
  if (!byMember) return false;
  for (let i = 0; i < consumed.length; i++) {
    const offered = build.get(consumed[i]);
    if (offered === void 0) return false;
    if (!byMember.get(consumed[i])?.has(offered)) return false;
  }
  return true;
}
function isWitnessed(specifiers, shared, builds) {
  const wanted = [...specifiers];
  for (const specifier of wanted) if (!shared.has(specifier)) return false;
  for (const [, build] of builds) {
    let matches = true;
    for (let i = 0; i < wanted.length; i++) {
      if (build.tags.get(wanted[i]) !== shared.get(wanted[i])) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}
function explainSelfServe(remote, wants, specifiers, pool) {
  let closest;
  let fewest = Number.MAX_SAFE_INTEGER;
  let gap = wants[0] ?? "";
  for (const [build, view] of pool.builds) {
    if (build === remote) continue;
    let missing;
    let count = 0;
    for (const specifier of specifiers) {
      if (view.coverage.has(specifier)) continue;
      count++;
      missing ??= specifier;
    }
    if (count >= fewest) continue;
    fewest = count;
    closest = build;
    gap = missing ?? rejectedMember(view.instance, remote, wants, pool.acceptance) ?? gap;
  }
  return { gap, closest };
}
function rejectedMember(offered, consumer, wants, acceptance) {
  const accepts = acceptance.get(consumer);
  if (!accepts) return void 0;
  for (const member of wants) {
    const tag = offered.get(member);
    if (tag === void 0) return member;
    if (!accepts.get(member)?.has(tag)) return `${member}@${tag}`;
  }
  return void 0;
}
function assignAnchors(input) {
  const { builds, acceptance, consumedMembers: consumedMembers2, hosts, arrival } = input;
  const assignment = /* @__PURE__ */ new Map();
  const byPriority = (a, b) => (arrival.get(a) ?? Number.MAX_SAFE_INTEGER) - (arrival.get(b) ?? Number.MAX_SAFE_INTEGER) || a.localeCompare(b);
  const candidates = [...builds.keys()].sort(byPriority);
  const pending = new Set([...consumedMembers2.keys()].sort(byPriority));
  const anchored = /* @__PURE__ */ new Set();
  const canServe = (candidate, consumer) => {
    const build = builds.get(candidate);
    if (!covers(build.coverage, input.consumedSpecifiers.get(consumer) ?? [])) return false;
    return acceptsAll(acceptance, build.instance, consumer, consumedMembers2.get(consumer) ?? []);
  };
  const electAnchor = (anchor, served) => {
    pending.delete(anchor);
    assignment.set(anchor, void 0);
    for (const consumer of served) {
      pending.delete(consumer);
      anchored.add(consumer);
      assignment.set(consumer, anchor);
    }
  };
  for (const host of [...hosts].sort(byPriority)) {
    const served = [];
    if (builds.has(host)) {
      for (const consumer of pending) {
        if (consumer !== host && canServe(host, consumer)) served.push(consumer);
      }
    }
    electAnchor(host, served);
  }
  for (; ; ) {
    let best;
    let bestServed = [];
    for (const candidate of candidates) {
      if (anchored.has(candidate)) continue;
      const served = [];
      for (const consumer of pending) {
        if (consumer !== candidate && canServe(candidate, consumer)) served.push(consumer);
      }
      if (served.length > bestServed.length) {
        best = candidate;
        bestServed = served;
      }
    }
    if (best === void 0) break;
    electAnchor(best, bestServed);
  }
  for (const consumer of pending) assignment.set(consumer, void 0);
  return assignment;
}
var SCOPED_PACKAGE = /^@([^/]+)\//;
function createDSU() {
  const ids = /* @__PURE__ */ new Map();
  const parent = [];
  const size = [];
  const intern = (key) => {
    let id = ids.get(key);
    if (id === void 0) {
      id = parent.length;
      ids.set(key, id);
      parent.push(id);
      size.push(1);
    }
    return id;
  };
  const findRoot = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  return {
    union(a, b) {
      let rootA = findRoot(intern(a));
      let rootB = findRoot(intern(b));
      if (rootA === rootB) return;
      if (size[rootA] < size[rootB]) [rootA, rootB] = [rootB, rootA];
      parent[rootB] = rootA;
      size[rootA] = size[rootA] + size[rootB];
    },
    // Interns the key if unseen — an isolated key is its own component.
    component(key) {
      return findRoot(intern(key));
    }
  };
}
var extNode = (name) => `ext\0${name}`;
var tagNode = (remote, tag) => `tag\0${remote}\0${tag}`;
var scopeNode = (remote, scope) => `scope\0${remote}\0${scope}`;
function autoScope(name, useAutoExternalPooling) {
  return useAutoExternalPooling ? SCOPED_PACKAGE.exec(name)?.[1] : void 0;
}
function owningPackage(name) {
  const depth = name.startsWith("@") ? 2 : 1;
  let cut = -1;
  for (let seen = 0; seen < depth; seen++) {
    cut = name.indexOf("/", cut + 1);
    if (cut === -1) return void 0;
  }
  return name.slice(0, cut);
}
function groupByMembership(candidates, log) {
  const dsu = createDSU();
  const tagged = /* @__PURE__ */ new Set();
  const joined = /* @__PURE__ */ new Set();
  const tagRules = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    if (candidate.scope === void 0) continue;
    for (const edge of candidate.tags) tagRules.add(`${edge.remote}\0${candidate.scope}`);
  }
  for (const candidate of candidates) {
    for (const edge of candidate.tags) {
      dsu.union(extNode(candidate.name), tagNode(edge.remote, edge.tag));
      tagged.add(candidate.name);
      joined.add(candidate.name);
    }
    if (candidate.scope === void 0) continue;
    for (const remote of candidate.remotes) {
      if (tagRules.has(`${remote}\0${candidate.scope}`)) continue;
      dsu.union(extNode(candidate.name), scopeNode(remote, candidate.scope));
      joined.add(candidate.name);
    }
  }
  const declared = new Set(candidates.map((c) => c.name));
  for (const candidate of candidates) {
    const owner = owningPackage(candidate.name);
    if (owner !== void 0 && declared.has(owner))
      dsu.union(extNode(candidate.name), extNode(owner));
  }
  const byComponent = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    const root = dsu.component(extNode(candidate.name));
    const members = byComponent.get(root) ?? byComponent.set(root, []).get(root);
    members.push({ name: candidate.name, value: candidate.value });
  }
  const pools = [];
  for (const members of byComponent.values()) {
    if (!members.some((m) => joined.has(m.name))) continue;
    members.sort((a, b) => a.name.localeCompare(b.name));
    if (members.length < 2) {
      const only = members[0];
      if (tagged.has(only.name)) {
        log?.warn(
          3,
          `[${only.name}] declares a 'pool' tag but no other external joined its pool; likely a typo or a missing sibling.`
        );
      }
      continue;
    }
    pools.push(members);
  }
  pools.sort((a, b) => a[0].name.localeCompare(b[0].name));
  return new Map(pools.map((members) => [members[0].name, members.map((m) => m.value)]));
}
function buildPools(sharedExternals, useAutoExternalPooling, log) {
  const candidates = Object.entries(sharedExternals).map(
    ([name, external]) => ({
      name,
      scope: autoScope(name, useAutoExternalPooling),
      tags: external.versions.flatMap(
        (v) => v.remotes.flatMap((r) => {
          const tag = r.pool?.trim();
          return tag ? [{ remote: r.name, tag }] : [];
        })
      ),
      remotes: external.versions.flatMap((v) => v.remotes.map((r) => r.name)),
      value: { name, external }
    })
  );
  return groupByMembership(candidates, log);
}
function lazy(make) {
  let value;
  return () => value ??= make();
}
function remotesInPool(members) {
  return [
    ...new Set(members.flatMap((m) => m.external.versions.flatMap((v) => v.remotes.map((r) => r.name))))
  ];
}
function poolableScopes(config, repo) {
  const { useAutoExternalPooling } = config.feature;
  return {
    useAutoExternalPooling,
    scopes: repo.getScopes().filter(
      (scope) => repo.scopeType(scope) !== "strict" && (useAutoExternalPooling || repo.hasPoolTag(scope))
    )
  };
}
function islandedRemotes(members) {
  const islanded = /* @__PURE__ */ new Map();
  for (const member of members)
    for (const version of member.external.versions)
      if (version.action === "scope") {
        for (const remote of version.remotes)
          if (!islanded.has(remote.name))
            islanded.set(remote.name, {
              kind: "incompatible",
              member: member.name,
              tag: version.tag
            });
      }
  return islanded;
}
var basisFor = (members, islanded, serving) => basisPerMember(members, islanded, (remote) => {
  const build = serving.get(remote);
  return build !== void 0 && build !== remote;
});
function servedPerRemote(consumed, serving, basis) {
  const served = /* @__PURE__ */ new Map();
  for (const [remote, build] of serving) {
    const byMember = /* @__PURE__ */ new Map();
    for (const name of consumed.get(remote) ?? []) {
      if (basis.get(name) !== build) byMember.set(name, build);
    }
    if (byMember.size > 0) served.set(remote, byMember);
  }
  return served;
}
var anyAnchorStored = (members) => members.some((m) => m.external.versions.some((v) => v.remotes.some((r) => r.servedBy !== void 0)));
function findTornRemotes(members, islanded, basis, served, hosts) {
  const { suspect, selfServed } = movedRemotes(members, islanded, basis, served, hosts);
  if (suspect.size === 0) return [];
  const builds = liveBuilds(members, islanded);
  const shared = sharedTagPerSpecifier(members, islanded);
  const own = ownCopies(members, suspect);
  const torn = [];
  for (const remote of suspect) {
    const copies = own.get(remote) ?? [];
    const mine = selfServed.get(remote);
    const anchors = served.get(remote);
    const ownTags = /* @__PURE__ */ new Map();
    const resolved = /* @__PURE__ */ new Map();
    for (const copy of copies) {
      const from = mine?.has(copy.member) ? remote : anchors?.get(copy.member);
      for (const specifier in copy.entries) {
        if (!ownTags.has(specifier)) ownTags.set(specifier, copy.tag);
        const tag = from === remote ? copy.tag : from !== void 0 ? builds.get(from)?.tags.get(specifier) : shared.get(specifier);
        if (tag !== void 0 && !resolved.has(specifier)) resolved.set(specifier, tag);
      }
    }
    if (resolved.size === 0) continue;
    if (ships(ownTags, resolved)) continue;
    let witnessed = false;
    for (const [, build] of builds) {
      if (ships(build.tags, resolved)) {
        witnessed = true;
        break;
      }
    }
    if (!witnessed) {
      torn.push({
        remote,
        combination: [...resolved].map(([specifier, tag]) => `${specifier}@${tag}`).join(", ")
      });
    }
  }
  return torn;
}
var ships = (build, resolved) => {
  if (!build) return false;
  for (const [specifier, tag] of resolved) if (build.get(specifier) !== tag) return false;
  return true;
};
function movedRemotes(members, islanded, basis, served, hosts) {
  const suspect = /* @__PURE__ */ new Set();
  const selfServed = /* @__PURE__ */ new Map();
  const add = (remote) => {
    if (!islanded.has(remote) && !hosts.has(remote)) suspect.add(remote);
  };
  for (const remote of served.keys()) add(remote);
  for (const member of members) {
    const unpublished = !basis.has(member.name);
    for (const version of member.external.versions) {
      const scoped = version.action === "scope";
      if (!unpublished && !scoped) continue;
      for (const meta of version.remotes) {
        add(meta.name);
        const servesItself = scoped || unpublished && served.get(meta.name)?.get(member.name) === void 0;
        if (!servesItself) continue;
        let mine = selfServed.get(meta.name);
        if (!mine) selfServed.set(meta.name, mine = /* @__PURE__ */ new Set());
        mine.add(member.name);
      }
    }
  }
  return { suspect, selfServed };
}
function createPoolSharedExternals(config, ports) {
  return (touched) => {
    const { useAutoExternalPooling, scopes } = poolableScopes(config, ports.sharedExternalsRepo);
    for (const scope of scopes) {
      const touchedInScope = touched?.get(scope);
      if (touched && !touchedInScope) continue;
      const sharedExternals = ports.sharedExternalsRepo.getFromScope(scope);
      try {
        for (const [poolName, members] of buildPools(
          sharedExternals,
          useAutoExternalPooling,
          config.log
        )) {
          if (touchedInScope && !members.some((m) => touchedInScope.has(m.name))) continue;
          poolFamily(poolName, members, scope);
        }
      } catch (error) {
        if (error instanceof NFError) return Promise.reject(error);
        config.log.error(3, `[${scope}] failed to pool shared externals.`, {
          sharedExternals,
          error
        });
        return Promise.reject(
          new NFError(`Could not pool shared externals in scope ${scope}.`, error)
        );
      }
    }
    return Promise.resolve();
  };
  function poolFamily(poolName, members, scope) {
    if (members.length < 2) return;
    const allRemotes = remotesInPool(members);
    if (allRemotes.length < 2) return;
    const islanded = islandedRemotes(members);
    const consumed = consumedMembers(members);
    const hosts = hostRemotes(members);
    const views = {
      consumedSpecifiers: lazy(() => consumedSpecifiers(members)),
      acceptance: lazy(() => acceptanceTable(members, ports.versionCheck.isCompatible)),
      arrival: lazy(() => arrivalOrder(members))
    };
    config.log.debug(
      3,
      `[${scope}][pool:${poolName}] ${members.length} members across ${allRemotes.length} remotes, incompatible={${[...islanded.keys()].join(", ") || "\u2205"}}
` + members.map((m) => `  - ${m.name}`).join("\n")
    );
    const assign = () => {
      const serving2 = assignServingBuilds(members, islanded, consumed, hosts, views);
      const basis2 = basisFor(members, islanded, serving2);
      return { serving: serving2, basis: basis2, served: servedPerRemote(consumed, serving2, basis2) };
    };
    let { serving, basis, served } = assign();
    if (islanded.size === 0 && serving.size === 0 && !anyAnchorStored(members)) return;
    for (; ; ) {
      const torn = findTornRemotes(members, islanded, basis, served, hosts);
      if (torn.length === 0) break;
      for (const { remote, combination } of torn)
        islanded.set(remote, { kind: "torn", combination });
      ({ serving, basis, served } = assign());
    }
    const incompatible = [...islanded].filter(([, cause]) => cause.kind === "incompatible").map(([remote]) => remote);
    if (config.strict.strictExternalCompatibility && incompatible.length > 0) {
      config.log.error(
        3,
        `[${scope}][pool:${poolName}] version-incompatible remotes cannot be pooled: {${incompatible.join(", ")}}.`
      );
      throw new NFError(`Could not pool '${poolName}' in scope ${scope}.`);
    }
    for (const [remote, cause] of islanded) {
      const scoped = consumed.get(remote)?.length ?? 0;
      config.log.warn(3, `[${scope}][pool:${poolName}] ${islandWarning(remote, cause, scoped)}`);
    }
    for (const member of members) {
      const rebuilt = rebuildMember(member, islanded, served, basis.get(member.name));
      warnIfScopedOnly(poolName, member, rebuilt, islanded, scope);
      ports.sharedExternalsRepo.addOrUpdate(member.name, rebuilt, scope);
    }
  }
  function assignServingBuilds(members, islanded, consumed, hosts, views) {
    for (; ; ) {
      const bases = servingBuilds(members, islanded);
      const distinct = new Set(bases.values());
      if (distinct.size === 1 && bases.size === members.length) {
        const sole = [...distinct][0];
        if (coversWholePool(members, sole, islanded)) return /* @__PURE__ */ new Map();
      }
      const builds = liveBuilds(members, islanded);
      const shared = sharedTagPerSpecifier(members, islanded);
      const consumedSpec = views.consumedSpecifiers();
      const needAnchor = /* @__PURE__ */ new Map();
      const needSpecifiers = /* @__PURE__ */ new Map();
      for (const [remote, wants] of consumed) {
        if (islanded.has(remote)) continue;
        if (isWitnessed(consumedSpec.get(remote) ?? [], shared, builds)) continue;
        needAnchor.set(remote, wants);
        needSpecifiers.set(remote, consumedSpec.get(remote) ?? /* @__PURE__ */ new Set());
      }
      if (needAnchor.size === 0) return /* @__PURE__ */ new Map();
      const acceptance = views.acceptance();
      const assignment = assignAnchors({
        builds,
        acceptance,
        consumedSpecifiers: needSpecifiers,
        consumedMembers: needAnchor,
        hosts,
        arrival: views.arrival()
      });
      const anchors = /* @__PURE__ */ new Set();
      for (const build of assignment.values()) if (build !== void 0) anchors.add(build);
      const serving = /* @__PURE__ */ new Map();
      let scoped = false;
      for (const [remote, wants] of needAnchor) {
        const assigned = assignment.get(remote);
        const build = assigned ?? (anchors.has(remote) || hosts.has(remote) ? remote : void 0);
        if (build === void 0) {
          islanded.set(remote, __spreadValues({
            kind: "uncovered"
          }, explainSelfServe(remote, wants, needSpecifiers.get(remote), { builds, acceptance })));
          scoped = true;
          continue;
        }
        serving.set(remote, build);
      }
      if (!scoped) return serving;
    }
  }
  function warnIfScopedOnly(poolName, member, rebuilt, islanded, scope) {
    if (rebuilt.versions.some((v) => v.action === "share")) return;
    const consumers = new Set(
      rebuilt.versions.filter((v) => v.action === "scope").flatMap((v) => v.remotes.map((r) => r.name))
    ).size;
    if (consumers < 2) return;
    const provider = member.external.versions.find((v) => v.action === "share");
    if (provider?.remotes.some((r) => islanded.has(r.name))) return;
    config.log.warn(
      3,
      `[${scope}][pool:${poolName}] '${member.name}' is scoped-only \u2014 no coherent shared build provides it; ${consumers} remotes download their own copy.`
    );
  }
  function rebuildMember(member, islanded, served, basis) {
    let scoped = [];
    let clean = [];
    for (const version of member.external.versions) {
      for (const meta of version.remotes) {
        const entry = {
          remote: meta.name,
          tag: version.tag,
          host: version.host,
          action: version.action,
          meta
        };
        (islanded.has(entry.remote) || entry.action === "scope" ? scoped : clean).push(entry);
      }
    }
    for (const entry of scoped) delete entry.meta.servedBy;
    for (const entry of clean) {
      const build = served.get(entry.remote)?.get(member.name);
      if (build !== void 0) entry.meta.servedBy = build;
      else delete entry.meta.servedBy;
    }
    if (basis === void 0) {
      scoped = [...scoped, ...clean.filter((e) => e.meta.servedBy === void 0)];
      clean = clean.filter((e) => e.meta.servedBy !== void 0).map((e) => __spreadProps(__spreadValues({}, e), { action: "skip" }));
    }
    const shareEntries = clean.filter((e) => e.action === "share").sort((a, b) => Number(b.remote === basis) - Number(a.remote === basis));
    const shareVersion = shareEntries.length > 0 ? [
      {
        tag: shareEntries[0].tag,
        host: shareEntries[0].host,
        action: "share",
        remotes: shareEntries.map((e) => e.meta)
      }
    ] : [];
    const byTag = (entries, action) => {
      const versions = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const version = versions.get(entry.tag) ?? {
          tag: entry.tag,
          host: entry.host,
          action,
          remotes: []
        };
        version.remotes.push(entry.meta);
        versions.set(entry.tag, version);
      }
      return [...versions.values()];
    };
    return {
      dirty: false,
      versions: [
        ...shareVersion,
        ...byTag(
          clean.filter((e) => e.action === "skip"),
          "skip"
        ),
        ...byTag(scoped, "scope")
      ].sort((a, b) => ports.versionCheck.compare(b.tag, a.tag))
    };
  }
}
function islandWarning(remote, cause, scoped) {
  switch (cause.kind) {
    case "incompatible":
      return `'${remote}' is islanded: the resolver scoped its '${cause.member}@${cause.tag}', so all ${scoped} members it imports are scoped for it.`;
    case "torn":
      return `'${remote}' serves its own family: the mapping would have handed it ${cause.combination}, which no build shipped together, so all ${scoped} members it imports are scoped for it.`;
    default: {
      const closest = cause.closest ? `closest is '${cause.closest}'` : "no other build in the pool serves any of it";
      return `'${remote}' serves its own family: no shared build offers every entrypoint it imports at a version it accepts \u2014 '${cause.gap}' is the gap, ${closest}. All ${scoped} members it imports are scoped for it.`;
    }
  }
}
function createMarkPoolsForReelection(config, ports) {
  return () => {
    const { useAutoExternalPooling, scopes } = poolableScopes(config, ports.sharedExternalsRepo);
    for (const scope of scopes) {
      const sharedExternals = ports.sharedExternalsRepo.getFromScope(scope);
      if (!Object.values(sharedExternals).some((external) => external.dirty)) continue;
      let spread = 0;
      for (const [, members] of buildPools(sharedExternals, useAutoExternalPooling)) {
        if (!members.some((m) => m.external.dirty)) continue;
        for (const member of members)
          if (!member.external.dirty) {
            member.external.dirty = true;
            spread++;
          }
      }
      if (spread > 0)
        config.log.debug(3, `[${scope}] ${spread} pool member(s) marked dirty for re-election.`);
    }
    return Promise.resolve();
  };
}
var BuildNotificationType2 = /* @__PURE__ */ ((BuildNotificationType22) => {
  BuildNotificationType22["COMPLETED"] = "federation-rebuild-complete";
  BuildNotificationType22["ERROR"] = "federation-rebuild-error";
  BuildNotificationType22["CANCELLED"] = "federation-rebuild-cancelled";
  return BuildNotificationType22;
})(BuildNotificationType2 || {});
var CHUNK_PREFIX2 = "@nf-internal";
function toChunkImport2(fileName) {
  if (fileName.startsWith("./")) {
    fileName = fileName.slice(2);
  }
  const packageName = fileName.replace(/.(m|c)?js$/, "");
  return CHUNK_PREFIX2 + "/" + packageName;
}
function createGenerateImportMap(config, ports) {
  return () => {
    const importMap = { imports: {} };
    const chunkBundles = {};
    try {
      addScopedExternals(importMap, chunkBundles);
      addshareScopeExternals(importMap, chunkBundles);
      addGlobalSharedExternals(importMap, chunkBundles);
      addRemoteInfos(importMap, chunkBundles);
      addChunkImports(importMap, chunkBundles);
      return Promise.resolve(importMap);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  function addScopedExternals(importMap, chunkBundles) {
    const scopedExternals = ports.scopedExternalsRepo.getAll();
    for (const [remoteName, externals] of Object.entries(scopedExternals)) {
      const remote = ports.remoteInfoRepo.tryGet(remoteName).orThrow(() => {
        config.log.error(4, `[scoped][${remoteName}] Remote name not found in cache.`);
        return new NFError("Could not create ImportMap.");
      });
      addToScope(importMap, remote.scopeUrl, createScopeModules(externals, remote.scopeUrl));
      for (const version of Object.values(externals)) {
        for (const file of Object.values(version.entries)) {
          addIntegrity(importMap, join(remote.scopeUrl, file), remoteName, file);
        }
      }
      Object.values(externals).filter((e) => !!e.bundle).forEach((e) => registerBundleChunks(chunkBundles, remoteName, e.bundle));
    }
    return importMap;
  }
  function createScopeModules(externals, scope) {
    const modules = {};
    for (const version of Object.values(externals)) {
      for (const [packageName, file] of Object.entries(version.entries)) {
        modules[packageName] = join(scope, file);
      }
    }
    return modules;
  }
  function addshareScopeExternals(importMap, chunkBundles) {
    const shareScopes = ports.sharedExternalsRepo.getScopes({ includeGlobal: false });
    for (const shareScope of shareScopes) {
      processshareScope(importMap, shareScope, chunkBundles);
    }
    return importMap;
  }
  function processshareScope(importMap, shareScope, chunkBundles) {
    const sharedExternals = ports.sharedExternalsRepo.getFromScope(shareScope);
    const index = buildServedIndex(sharedExternals);
    for (const [externalName, external] of Object.entries(sharedExternals)) {
      let override = void 0;
      const cachedBefore = cachedFingerprint(external);
      for (const version of external.versions) {
        if (version.action === "scope") {
          for (const remote of version.remotes) {
            const remoteScope = getScope2(shareScope, remote.name, externalName);
            for (const [packageName, file] of Object.entries(remote.entries)) {
              const url = join(remoteScope, file);
              addToScope(importMap, remoteScope, { [packageName]: url });
              addIntegrity(importMap, url, remote.name, file);
            }
            registerBundleChunks(chunkBundles, remote.name, remote.bundle);
            remote.cached = true;
          }
          continue;
        }
        version.remotes[0].cached = true;
        let serving = version;
        if (version.action === "skip") {
          if (!override) {
            override = findOverride(external, shareScope, externalName) ?? "NOT_AVAILABLE";
          }
          if (override !== "NOT_AVAILABLE") {
            serving = override;
            version.remotes[0].cached = false;
          }
        }
        const provided = versionEntries(serving);
        const mappings = [];
        for (const [packageName, provider] of provided) {
          const file = provider.entries[packageName];
          mappings.push({
            packageName,
            url: join(getScope2(shareScope, provider.name, externalName), file),
            name: provider.name,
            file
          });
          provider.cached = true;
          if (version.action === "share") {
            registerBundleChunks(chunkBundles, provider.name, provider.bundle);
          }
        }
        version.remotes.forEach((r) => {
          const rScope = getScope2(shareScope, r.name, externalName);
          if (index && r.servedBy) {
            const files = index.get(r.servedBy);
            const servedScope = getScope2(shareScope, r.servedBy, externalName);
            for (const specifier of Object.keys(r.entries)) {
              const source = files?.get(specifier);
              if (!source) continue;
              const url = join(servedScope, source.file);
              addToScope(importMap, rScope, { [specifier]: url });
              addIntegrity(importMap, url, r.servedBy, source.file);
              registerBundleChunks(chunkBundles, r.servedBy, source.bundle);
              source.meta.cached = true;
            }
            return;
          }
          for (const m of mappings) {
            addToScope(importMap, rScope, { [m.packageName]: m.url });
          }
          for (const [packageName, file] of Object.entries(r.entries)) {
            if (provided.has(packageName)) continue;
            if (config.strict.strictEntryPointCoverage || config.profile.scopeUncoveredEntrypoints) {
              warnUncoveredEntrypoint(shareScope, externalName, r.name, packageName);
              continue;
            }
            const url = join(rScope, file);
            addToScope(importMap, rScope, { [packageName]: url });
            addIntegrity(importMap, url, r.name, file);
            r.cached = true;
          }
        });
        for (const m of mappings) {
          addIntegrity(importMap, m.url, m.name, m.file);
        }
      }
      if (cachedFingerprint(external) !== cachedBefore) {
        ports.sharedExternalsRepo.addOrUpdate(externalName, external, shareScope);
      }
    }
  }
  function cachedFingerprint(external) {
    return external.versions.map((v) => v.remotes.map((r) => r.cached ? 1 : 0).join("")).join("|");
  }
  function findOverride(external, shareScope, externalName) {
    const sharedVersions = external.versions.filter((v) => v.action === "share");
    const scopedExternalName = `${shareScope}.${externalName}`;
    if (sharedVersions.length > 1) {
      handleMultipleSharedVersions(scopedExternalName);
    }
    if (sharedVersions.length < 1) {
      if (config.strict.strictImportMap) {
        config.log.error(4, `[${shareScope}][${externalName}] shareScope has no override version.`);
        throw new NFError("Could not create ImportMap.");
      }
      config.log.debug(
        4,
        `[${shareScope}][${externalName}] shareScope has no override version, scoping override versions.`
      );
    }
    return sharedVersions[0];
  }
  function handleMultipleSharedVersions(scopedExternalName) {
    if (config.strict.strictImportMap) {
      config.log.error(
        4,
        `[${scopedExternalName}] ShareScope external has multiple shared versions.`
      );
      throw new NFError("Could not create ImportMap.");
    }
    config.log.warn(4, `ShareScope external ${scopedExternalName} has multiple shared versions.`);
  }
  function buildServedIndex(externals) {
    let anyServed = false;
    for (const external of Object.values(externals)) {
      for (const version of external.versions) {
        if (version.remotes.some((r) => r.servedBy)) anyServed = true;
      }
    }
    if (!anyServed) return void 0;
    const index = /* @__PURE__ */ new Map();
    for (const external of Object.values(externals)) {
      for (const version of external.versions) {
        for (const remote of version.remotes) {
          let own = index.get(remote.name);
          if (!own) index.set(remote.name, own = /* @__PURE__ */ new Map());
          for (const [specifier, file] of Object.entries(remote.entries)) {
            if (!own.has(specifier))
              own.set(specifier, { file, bundle: remote.bundle, meta: remote });
          }
        }
      }
    }
    return index;
  }
  function collectServed(into, index, ctx, externalName, version) {
    for (const consumer of version.remotes) {
      if (!consumer.servedBy) continue;
      const files = index.get(consumer.servedBy);
      const scope = getScope2(ctx, consumer.name, externalName);
      for (const specifier of Object.keys(consumer.entries)) {
        const source = files?.get(specifier);
        if (!source) {
          config.log.warn(
            4,
            `[${ctx}][${externalName}][${consumer.name}] '${consumer.servedBy}' does not serve '${specifier}'.`
          );
          continue;
        }
        into.push({ scope, specifier, source, from: consumer.servedBy });
      }
    }
  }
  function flushServed(importMap, chunkBundles, served) {
    for (const { scope, specifier, source, from } of served) {
      const url = join(getScope2(GLOBAL_SCOPE, from), source.file);
      if (importMap.imports[specifier] === url) continue;
      addToScope(importMap, scope, { [specifier]: url });
      addIntegrity(importMap, url, from, source.file);
      registerBundleChunks(chunkBundles, from, source.bundle);
      source.meta.cached = true;
    }
  }
  function addGlobalSharedExternals(importMap, chunkBundles) {
    const sharedExternals = ports.sharedExternalsRepo.getFromScope();
    const index = buildServedIndex(sharedExternals);
    const served = [];
    const cachedBefore = /* @__PURE__ */ new Map();
    for (const [externalName, external] of Object.entries(sharedExternals)) {
      cachedBefore.set(externalName, cachedFingerprint(external));
      for (const version of external.versions) {
        if (index && version.action !== "scope") {
          collectServed(served, index, GLOBAL_SCOPE, externalName, version);
        }
        if (version.action === "skip") continue;
        if (version.action === "scope") {
          for (const remote of version.remotes) {
            const remoteScope = getScope2(GLOBAL_SCOPE, remote.name, externalName);
            for (const [packageName, file] of Object.entries(remote.entries)) {
              const url = join(remoteScope, file);
              addToScope(importMap, remoteScope, { [packageName]: url });
              addIntegrity(importMap, url, remote.name, file);
            }
            remote.cached = true;
            registerBundleChunks(chunkBundles, remote.name, remote.bundle);
          }
          continue;
        }
        if (importMap.imports[externalName]) {
          notifyDuplicateGlobalExternal(externalName);
          continue;
        }
        mergeVersionEntries(importMap, chunkBundles, externalName, version);
      }
      for (const version of external.versions) {
        if (version.action !== "skip") continue;
        selfFillUncovered(importMap, chunkBundles, externalName, version.remotes);
      }
    }
    flushServed(importMap, chunkBundles, served);
    for (const [externalName, external] of Object.entries(sharedExternals)) {
      if (cachedFingerprint(external) !== cachedBefore.get(externalName)) {
        ports.sharedExternalsRepo.addOrUpdate(externalName, external);
      }
    }
    return importMap;
  }
  function mergeVersionEntries(importMap, chunkBundles, externalName, version) {
    const scopes = /* @__PURE__ */ new Map();
    for (const [packageName, remote] of versionEntries(version)) {
      if (importMap.imports[packageName]) {
        config.log.debug(
          4,
          `[${GLOBAL_SCOPE}][${externalName}][${remote.name}] Entrypoint '${packageName}' is already mapped by another external, keeping '${importMap.imports[packageName]}'.`
        );
        continue;
      }
      let scope = scopes.get(remote.name);
      if (scope === void 0) {
        scopes.set(remote.name, scope = getScope2(GLOBAL_SCOPE, remote.name, externalName));
        registerBundleChunks(chunkBundles, remote.name, remote.bundle);
        remote.cached = true;
      }
      const file = remote.entries[packageName];
      const url = join(scope, file);
      addToGlobal(importMap, { [packageName]: url });
      addIntegrity(importMap, url, remote.name, file);
    }
  }
  function selfFillUncovered(importMap, chunkBundles, externalName, remotes) {
    for (const remote of remotes) {
      if (remote.servedBy) continue;
      for (const [packageName, file] of Object.entries(remote.entries)) {
        if (importMap.imports[packageName]) continue;
        if (config.strict.strictEntryPointCoverage || config.profile.scopeUncoveredEntrypoints) {
          warnUncoveredEntrypoint(GLOBAL_SCOPE, externalName, remote.name, packageName);
          continue;
        }
        const scope = getScope2(GLOBAL_SCOPE, remote.name, externalName);
        const url = join(scope, file);
        addToGlobal(importMap, { [packageName]: url });
        addIntegrity(importMap, url, remote.name, file);
        registerBundleChunks(chunkBundles, remote.name, remote.bundle);
        remote.cached = true;
      }
    }
  }
  function warnUncoveredEntrypoint(scope, externalName, remoteName, packageName) {
    const msg = `[${scope}][${externalName}][${remoteName}] Entrypoint '${packageName}' is not covered by the shared version.`;
    if (config.strict.strictEntryPointCoverage || config.strict.strictImportMap) {
      config.log.error(4, msg);
      throw new NFError("Could not create ImportMap.");
    }
    config.log.warn(4, msg);
  }
  function notifyDuplicateGlobalExternal(externalName) {
    if (config.strict.strictImportMap) {
      config.log.error(4, `[${externalName}] Shared external has multiple shared versions.`);
      throw new NFError("Could not create ImportMap.");
    }
    config.log.warn(4, `Singleton external ${externalName} has multiple shared versions.`);
  }
  function addToScope(importMap, scope, imports) {
    if (!importMap.scopes) importMap.scopes = {};
    if (!importMap.scopes[scope]) importMap.scopes[scope] = {};
    importMap.scopes[scope] = Object.assign(importMap.scopes[scope], imports);
  }
  function addToGlobal(importMap, imports) {
    importMap.imports = Object.assign(importMap.imports, imports);
  }
  function addRemoteInfos(importMap, chunkBundles) {
    const remotes = ports.remoteInfoRepo.getAll();
    for (const [remoteName, remote] of Object.entries(remotes)) {
      addRemoteExposedModules(importMap, remoteName, remote);
      registerBundleChunks(chunkBundles, remoteName, "mapping-or-exposed");
    }
  }
  function addRemoteExposedModules(importMap, remoteName, remote) {
    for (const exposed of remote.exposes) {
      const moduleName = join(remoteName, exposed.moduleName);
      const moduleUrl = join(remote.scopeUrl, exposed.file);
      importMap.imports[moduleName] = moduleUrl;
      addIntegrity(importMap, moduleUrl, remoteName, exposed.file);
    }
  }
  function registerBundleChunks(chunkBundles, remoteName, bundleName) {
    if (!bundleName) return chunkBundles;
    if (!chunkBundles[remoteName]) chunkBundles[remoteName] = /* @__PURE__ */ new Set();
    chunkBundles[remoteName].add(bundleName);
    return chunkBundles;
  }
  function addChunkImports(importMap, chunkBundles) {
    Object.entries(chunkBundles).forEach(([remoteName, bundles]) => {
      const baseUrl = getScope2("CHUNKS", remoteName);
      const imports = Array.from(bundles).reduce((_imports, bundleName) => {
        ports.sharedChunksRepo.tryGet(remoteName, bundleName).ifPresent((files) => {
          files.forEach((file) => {
            const url = join(baseUrl, file);
            _imports[toChunkImport2(file)] = url;
            addIntegrity(importMap, url, remoteName, file);
          });
        });
        return _imports;
      }, {});
      if (Object.keys(imports).length > 0) addToScope(importMap, baseUrl, imports);
    });
    return importMap;
  }
  function addIntegrity(importMap, url, remoteName, file) {
    const hash = ports.remoteInfoRepo.tryGet(remoteName).get()?.integrity?.[file];
    if (!hash) return;
    if (!importMap.integrity) importMap.integrity = {};
    importMap.integrity[url] = hash;
  }
  function getScope2(ctx, remoteName, externalName) {
    return ports.remoteInfoRepo.tryGet(remoteName).map((remote) => remote.scopeUrl).orThrow(() => {
      if (externalName) {
        config.log.error(
          4,
          `[${ctx}][${externalName}][${remoteName}] Remote name not found in cache.`
        );
      } else {
        config.log.error(4, `[${ctx}][${remoteName}] Remote name not found in cache.`);
      }
      return new NFError("Could not create ImportMap.");
    });
  }
}
function createCommitChanges(config, ports) {
  return (importMap, opts = {}) => Promise.resolve(importMap).then((map) => addToBrowser(map, opts)).then(persistRepositoryChanges);
  function addToBrowser(importMap, opts) {
    ports.browser.setImportMapFn(importMap, opts);
    config.log.debug(5, "Added import map to browser.", importMap);
    return importMap;
  }
  function persistRepositoryChanges() {
    ports.remoteInfoRepo.commit();
    ports.scopedExternalsRepo.commit();
    ports.sharedExternalsRepo.commit();
    ports.sharedChunksRepo.commit();
    return;
  }
}
function createExposeModuleLoader(config, ports) {
  const loadRemoteModule = (remoteName, exposedModule) => {
    try {
      if (!ports.remoteInfoRepo.contains(remoteName)) {
        throw new NFError(`Remote '${remoteName}' is not initialized.`);
      }
      const remoteModuleUrl = ports.remoteInfoRepo.tryGetModule(remoteName, exposedModule).orThrow(
        new NFError(
          `Exposed module '${exposedModule}' from remote '${remoteName}' not found in storage.`
        )
      );
      config.log.debug(6, `Loading initialized module '${remoteModuleUrl}'`);
      return ports.browser.importModule(remoteModuleUrl);
    } catch (error) {
      config.log.error(6, `Failed to load module ${join(remoteName, exposedModule)}: `, {
        error
      });
      return Promise.reject(
        new NFError(`Failed to load module ${join(remoteName, exposedModule)}`)
      );
    }
  };
  return () => Promise.resolve(loadRemoteModule);
}
var Optional = class _Optional {
  constructor(item) {
    this.item = item;
  }
  item;
  static of(item) {
    return new _Optional(item);
  }
  static empty() {
    return _Optional.of(void 0);
  }
  isPresent() {
    return typeof this.item !== "undefined" && this.item !== null;
  }
  set(other) {
    return _Optional.of(other);
  }
  ifPresent(callback) {
    if (this.isPresent()) callback(this.item);
  }
  map(callback) {
    if (!this.isPresent()) return _Optional.empty();
    const result = callback(this.item);
    return result instanceof _Optional ? result : _Optional.of(result);
  }
  orElse(other) {
    return this.isPresent() ? this.item : other;
  }
  orThrow(error) {
    if (this.isPresent()) return this.item;
    if (typeof error === "function") throw error();
    throw typeof error === "string" ? new Error(error) : error;
  }
  get() {
    return this.item;
  }
};
var normalizeRemoteRef = (remote) => {
  if (!remote) return {};
  if (typeof remote === "string") return { name: remote };
  return remote;
};
function createGetRemoteEntry(config, ports) {
  return async (remoteEntryUrl, remote) => {
    const { name: remoteName, integrity } = normalizeRemoteRef(remote);
    if (!!remoteName && shouldSkipCachedRemote(remoteEntryUrl, remoteName)) {
      config.log.debug(7, `Found remote '${remoteName}' in storage, omitting fetch.`);
      return Optional.empty();
    }
    try {
      const remoteEntry = integrity ? await ports.remoteEntryProvider.provide(remoteEntryUrl, { integrity }) : await ports.remoteEntryProvider.provide(remoteEntryUrl);
      config.log.debug(
        7,
        `[${remoteEntry.name}] Fetched from '${remoteEntry.url}', exposing: ${JSON.stringify(remoteEntry.exposes)}`
      );
      if (!!remoteName && remoteEntry.name !== remoteName) {
        const errorMsg = `Fetched remote '${remoteEntry.name}' does not match requested '${remoteName}'.`;
        if (config.strict.strictRemoteEntry) {
          config.log.error(7, errorMsg);
          throw new NFError("Could not fetch remote entry");
        }
        config.log.warn(7, errorMsg + " Omitting expected name.");
      }
      if (ports.remoteInfoRepo.contains(remoteEntry.name)) {
        remoteEntry.override = true;
        config.log.debug(7, `Overriding existing remote '${remoteName}' with '${remoteEntryUrl}'.`);
      }
      return Optional.of(checkForSSE(remoteEntry));
    } catch (error) {
      config.log.error(
        7,
        `[${remoteName ?? "unknown"}] Could not fetch remoteEntry from ${remoteEntryUrl}.`,
        error
      );
      return Promise.reject(
        new NFError(`[${remoteName ?? remoteEntryUrl}] Could not fetch remoteEntry.`)
      );
    }
  };
  function shouldSkipCachedRemote(remoteEntryUrl, remoteName) {
    return ports.remoteInfoRepo.tryGet(remoteName).map(
      (cachedRemoteInfo) => config.profile.overrideCachedRemotes !== "always" || !config.profile.overrideCachedRemotesIfURLMatches && remoteEntryUrl === join(cachedRemoteInfo.scopeUrl, "remoteEntry.json")
    ).orElse(false);
  }
  function checkForSSE(entry) {
    if (config.sse) {
      if (entry.buildNotificationsEndpoint) {
        ports.sse.watchRemoteBuilds(
          join(getScope(entry.url), entry.buildNotificationsEndpoint)
        );
        config.log.debug(7, `Registered SSE endpoint of remote '${entry.name}' `);
      } else {
        config.log.debug(7, `Remote ${entry.name} has no defined 'buildNotificationsEndpoint'`);
      }
    }
    return entry;
  }
}
function createUpdateCache(config, ports) {
  const storeRemoteEntry = createStoreRemoteEntry(config, ports, 8);
  const removeCachedRemoteEntries = createRemoveCachedRemoteEntries(ports);
  return (remoteEntry) => {
    try {
      const actions = {};
      if (remoteEntry?.override) removeCachedRemoteEntries(/* @__PURE__ */ new Set([remoteEntry.name]));
      storeRemoteEntry(remoteEntry, (entry, external, ctx) => {
        const { action, provided, sameVersion } = resolveSharedExternal(entry, external, ctx);
        actions[external.packageName] = { action };
        if (action === "skip" && provided) {
          actions[external.packageName].covered = Array.from(provided.keys());
          if (sameVersion) actions[external.packageName].sameVersion = true;
          if (external.shareScope) {
            actions[external.packageName].override = resolveOverrideEntries(
              entry,
              external,
              provided
            );
          }
        }
      });
      return Promise.resolve({ entry: remoteEntry, actions });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  function resolveSharedExternal(remoteEntry, sharedInfo, {
    tag,
    remote,
    cached,
    scopeType,
    assertSameVersionCompatibility,
    commit
  }) {
    let action = scopeType === "strict" ? "share" : "skip";
    const sharedVersion = cached.versions.find((c) => c.action === "share");
    const isCompatible = !sharedVersion || ports.versionCheck.isCompatible(sharedVersion.tag, remote.requiredVersion);
    if (action === "skip" && !isCompatible && remote.strictVersion) {
      action = "scope";
      const errorMsg = `[${sharedInfo.shareScope ?? GLOBAL_SCOPE}][${remoteEntry.name}] ${sharedInfo.packageName}@${sharedInfo.version} Is not compatible with existing ${sharedInfo.packageName}@${sharedVersion.tag} requiredRange '${sharedVersion.remotes[0]?.requiredVersion}'`;
      if (config.strict.strictExternalCompatibility) {
        config.log.error(8, errorMsg);
        throw new NFError(`Could not process remote '${remoteEntry.name}'`);
      }
      config.log.warn(8, errorMsg);
    }
    const provided = sharedVersion ? sharedInfo.shareScope ? versionEntries(sharedVersion) : committedEntries(sharedVersion) : void 0;
    const sameVersion = sharedVersion?.tag === tag;
    if (action === "skip" && provided && !sameVersion) {
      const uncovered = uncoveredEntrypoints(remote, provided);
      if (uncovered.length > 0) {
        const msg = `[${sharedInfo.shareScope ?? GLOBAL_SCOPE}][${remoteEntry.name}][${sharedInfo.packageName}] Entrypoints not covered by the shared version: ${uncovered.join(", ")}.`;
        if (config.strict.strictEntryPointCoverage) {
          config.log.error(8, msg);
          throw new NFError(`Could not process remote '${remoteEntry.name}'`);
        }
        if (config.profile.scopeUncoveredEntrypoints) {
          config.log.debug(8, msg);
          action = "scope";
        }
      }
    }
    const matchingVersion = findVersionForTag(cached.versions, tag);
    if (action === "scope") {
      remote.cached = true;
      const scoped = cached.versions.find((v) => v.tag === tag && v.action === "scope");
      if (scoped) scoped.remotes.push(remote);
      else cached.versions.push({ tag, action, host: false, remotes: [remote] });
    } else if (matchingVersion) {
      assertSameVersionCompatibility(matchingVersion);
      addRemoteToVersion(matchingVersion, remote);
    } else {
      if (!sharedVersion) action = "share";
      remote.cached = action !== "skip";
      cached.versions.push({ tag, action, host: false, remotes: [remote] });
    }
    commit();
    return { action, provided, sameVersion };
  }
  function resolveOverrideEntries(remoteEntry, external, provided) {
    return Object.fromEntries(
      Array.from(provided, ([packageName, provider]) => [
        packageName,
        join(
          providerScopeUrl(remoteEntry, external, provider.name),
          provider.entries[packageName]
        )
      ])
    );
  }
  function providerScopeUrl(remoteEntry, external, providerName) {
    return ports.remoteInfoRepo.tryGet(providerName).map((remote) => remote.scopeUrl).orThrow(() => {
      config.log.error(
        8,
        `[${external.shareScope ?? GLOBAL_SCOPE}][${remoteEntry.name}][${external.packageName}@${external.version}][override] Remote name not found in cache.`
      );
      return new NFError(`Could not find override url from remote ${providerName}`);
    });
  }
}
function createPoolDynamicExternals(config, ports) {
  return ({ entry, actions }) => {
    const { useAutoExternalPooling } = config.feature;
    const declared = /* @__PURE__ */ new Map();
    for (const external of entry.shared ?? []) {
      const name = external.packageName;
      if (!external.singleton || !actions[name]) continue;
      if (external.shareScope === STRICT_SCOPE) continue;
      const shareScope = external.shareScope ?? GLOBAL_SCOPE;
      let names = declared.get(shareScope);
      if (!names) declared.set(shareScope, names = /* @__PURE__ */ new Set());
      names.add(name);
    }
    if (declared.size === 0) return Promise.resolve({ entry, actions });
    const scope = (name) => {
      actions[name].action = "scope";
      delete actions[name].override;
    };
    for (const [shareScope, names] of declared) {
      if (!useAutoExternalPooling && !ports.sharedExternalsRepo.hasPoolTag(shareScope)) continue;
      const committed = ports.sharedExternalsRepo.getFromScope(shareScope);
      for (const pool of buildPools(committed, useAutoExternalPooling).values()) {
        const mine = pool.filter((member) => names.has(member.name));
        if (mine.length === 0) continue;
        if (mine.some((member) => actions[member.name].action === "scope")) {
          mine.forEach((member) => scope(member.name));
          continue;
        }
        const asked = gateViews(entry.name, pool);
        const anchor = anchorFor(entry.name, asked);
        if (anchor === "witnessed") continue;
        if (anchor === void 0) {
          const reason = explainDynamic(entry.name, asked);
          const closest = reason.closest ? `closest is '${reason.closest}'` : "no committed build serves any of it";
          config.log.warn(
            8,
            `[${shareScope}] '${entry.name}' serves its own family: no committed build offers every entrypoint it imports at a version it accepts \u2014 '${reason.gap}' is the gap, ${closest}. All ${mine.length} members it imports are scoped for it.`
          );
          mine.forEach((member) => scope(member.name));
          continue;
        }
        redirect(entry.name, anchor, pool, asked.view, actions, shareScope);
      }
    }
    return Promise.resolve({ entry, actions });
  };
  function gateViews(remote, pool) {
    return {
      pool,
      view: committedView(pool),
      wants: consumedMembers(pool).get(remote) ?? [],
      specifiers: consumedSpecifiers(pool).get(remote) ?? /* @__PURE__ */ new Set(),
      acceptance: lazy(() => acceptanceTable(pool, ports.versionCheck.isCompatible))
    };
  }
  function anchorFor(remote, { pool, view, wants, specifiers, acceptance }) {
    const shared = /* @__PURE__ */ new Map();
    for (const [specifier, source] of view.global) shared.set(specifier, source.tag);
    if (isWitnessed(specifiers, shared, view.builds)) return "witnessed";
    const basis = basisPerMember(pool);
    for (const build of candidateOrder(pool, view)) {
      if (build === remote) continue;
      const candidate = view.builds.get(build);
      if (!servesItsOwnFamily(build, pool, basis)) continue;
      if (!covers(candidate.coverage, specifiers)) continue;
      if (!acceptsAll(acceptance(), candidate.instance, remote, wants)) continue;
      return build;
    }
    return void 0;
  }
  function candidateOrder(pool, view) {
    const serving = /* @__PURE__ */ new Set();
    for (const source of view.global.values()) serving.add(source.remote);
    const hosts = hostRemotes(pool);
    const rank = (build) => serving.has(build) ? 0 : hosts.has(build) ? 1 : 2;
    return [...view.builds.keys()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  }
  function servesItsOwnFamily(build, pool, basis) {
    let ships2 = 0;
    let winsAll = true;
    let allScoped = true;
    for (const member of pool) {
      for (const version of member.external.versions) {
        const meta = version.remotes.find((r) => r.name === build);
        if (!meta) continue;
        if (meta.servedBy !== void 0) return false;
        ships2++;
        if (version.action !== "scope") allScoped = false;
        if (basis.get(member.name) !== build) winsAll = false;
      }
    }
    return ships2 > 0 && (winsAll || allScoped);
  }
  function explainDynamic(remote, { view, wants, specifiers, acceptance }) {
    return explainSelfServe(remote, wants, specifiers, {
      builds: view.builds,
      acceptance: acceptance()
    });
  }
  function redirect(remote, anchor, pool, view, actions, shareScope) {
    const files = view.builds.get(anchor).coverage;
    const scopeUrl = ports.remoteInfoRepo.tryGet(anchor).get()?.scopeUrl;
    if (!scopeUrl) {
      config.log.warn(
        8,
        `[${shareScope}][${remote}] '${anchor}' is not in the cache, so its files cannot be mapped.`
      );
      return;
    }
    for (const member of pool) {
      const action = actions[member.name];
      if (!action || action.action !== "skip") continue;
      const own = member.external.versions.flatMap((v) => v.remotes).find((r) => r.name === remote);
      if (!own) continue;
      const specifiers = Object.keys(own.entries);
      if (specifiers.length === 0) continue;
      const override = {};
      for (const specifier of specifiers) {
        if (view.global.get(specifier)?.remote === anchor) continue;
        const file = files.get(specifier);
        if (file) override[specifier] = join(scopeUrl, file);
      }
      action.covered = specifiers;
      if (Object.keys(override).length > 0) action.override = override;
    }
  }
}
function createConvertToImportMap(config, ports) {
  const { log } = config;
  return async ({ entry, actions }) => {
    const importMap = { imports: {} };
    addExternals(entry, actions, importMap);
    addRemoteInfos(entry, importMap);
    log.debug(9, `[${entry.name}] Processed actions:`, actions);
    return importMap;
  };
  function addExternals(remoteEntry, actions, importMap) {
    if (!remoteEntry.shared) {
      return;
    }
    const remoteEntryScope = getScope(remoteEntry.url);
    const integrityMap = remoteEntry.integrity;
    const chunkBundles = /* @__PURE__ */ new Set(["mapping-or-exposed"]);
    remoteEntry.shared.forEach((external) => {
      if (!external.singleton) {
        Object.entries(external.entries).forEach(([packageName, fileName]) => {
          const url = join(remoteEntryScope, fileName);
          addToScopes(remoteEntryScope, packageName, url, importMap);
          addIntegrity(importMap, url, integrityMap, fileName);
        });
        if (external?.bundle) chunkBundles.add(external?.bundle);
        return;
      }
      if (!actions[external.packageName]) {
        log.warn(
          9,
          `[${remoteEntry.name}] No action defined for shared external '${external.packageName}', skipping.`
        );
        return;
      }
      if (actions[external.packageName].action === "skip") {
        const { override, covered, sameVersion } = actions[external.packageName];
        if (override) {
          Object.entries(override).forEach(([packageName, url]) => {
            addToScopes(remoteEntryScope, packageName, url, importMap);
          });
          serveUncovered(
            remoteEntry,
            external,
            covered ?? Object.keys(override),
            remoteEntryScope,
            importMap,
            sameVersion
          );
          return;
        }
        if (!external.shareScope) {
          if (covered) {
            serveUncovered(remoteEntry, external, covered, remoteEntryScope, importMap, sameVersion);
          }
          return;
        }
        log.error(
          9,
          `[${remoteEntry.name}][${external.packageName}] shareScope skip has no override.`
        );
        if (config.strict.strictImportMap) throw new NFError("Could not create ImportMap.");
        Object.entries(external.entries).forEach(([packageName, fileName]) => {
          const url = join(remoteEntryScope, fileName);
          addToScopes(remoteEntryScope, packageName, url, importMap);
          addIntegrity(importMap, url, integrityMap, fileName);
        });
        return;
      }
      if (external?.bundle) chunkBundles.add(external?.bundle);
      if (actions[external.packageName].action === "scope") {
        Object.entries(external.entries).forEach(([packageName, fileName]) => {
          const url = join(remoteEntryScope, fileName);
          addToScopes(remoteEntryScope, packageName, url, importMap);
          addIntegrity(importMap, url, integrityMap, fileName);
        });
        return;
      }
      if (external.shareScope) {
        Object.entries(external.entries).forEach(([packageName, fileName]) => {
          const url = join(remoteEntryScope, fileName);
          addToScopes(remoteEntryScope, packageName, url, importMap);
          addIntegrity(importMap, url, integrityMap, fileName);
        });
        return;
      }
      Object.entries(external.entries).forEach(([packageName, fileName]) => {
        const url = join(remoteEntryScope, fileName);
        importMap.imports[packageName] = url;
        addIntegrity(importMap, url, integrityMap, fileName);
      });
    });
    addChunkImports(importMap, remoteEntry, remoteEntryScope, chunkBundles);
  }
  function addToScopes(scope, packageName, url, importMap) {
    if (!importMap.scopes) importMap.scopes = {};
    if (!importMap.scopes[scope]) importMap.scopes[scope] = {};
    importMap.scopes[scope][packageName] = url;
  }
  function addRemoteInfos(remoteEntry, importMap) {
    if (!remoteEntry.exposes) return;
    const scope = getScope(remoteEntry.url);
    remoteEntry.exposes.forEach((exposed) => {
      const moduleName = join(remoteEntry.name, exposed.key);
      const moduleUrl = join(scope, exposed.outFileName);
      importMap.imports[moduleName] = moduleUrl;
      addIntegrity(importMap, moduleUrl, remoteEntry.integrity, exposed.outFileName);
    });
  }
  function addChunkImports(importMap, remoteEntry, remoteEntryScope, chunkBundles) {
    Array.from(chunkBundles).forEach((bundleName) => {
      ports.sharedChunksRepo.tryGet(remoteEntry.name, bundleName).ifPresent((files) => {
        files.forEach((file) => {
          const url = join(remoteEntryScope, file);
          addToScopes(remoteEntryScope, toChunkImport2(file), url, importMap);
          addIntegrity(importMap, url, remoteEntry.integrity, file);
        });
      });
    });
    return importMap;
  }
  function serveUncovered(remoteEntry, external, covered, remoteEntryScope, importMap, sameVersion = false) {
    const provided = new Set(covered);
    Object.entries(external.entries).forEach(([packageName, fileName]) => {
      if (provided.has(packageName)) return;
      if (!sameVersion && (config.strict.strictEntryPointCoverage || config.profile.scopeUncoveredEntrypoints)) {
        warnUncoveredEntrypoint(remoteEntry.name, external.packageName, packageName);
        return;
      }
      const url = join(remoteEntryScope, fileName);
      addToScopes(remoteEntryScope, packageName, url, importMap);
      addIntegrity(importMap, url, remoteEntry.integrity, fileName);
    });
  }
  function warnUncoveredEntrypoint(remoteName, externalName, packageName) {
    const msg = `[${remoteName}][${externalName}] Entrypoint '${packageName}' is not covered by the override.`;
    if (config.strict.strictEntryPointCoverage || config.strict.strictImportMap) {
      log.error(9, msg);
      throw new NFError("Could not create ImportMap.");
    }
    log.warn(9, msg);
  }
  function addIntegrity(importMap, url, integrityMap, file) {
    const hash = integrityMap?.[file];
    if (!hash) return;
    if (!importMap.integrity) importMap.integrity = {};
    importMap.integrity[url] = hash;
  }
}
var createInitDrivers = ({
  config,
  adapters
}) => ({
  getRemoteEntries: createGetRemoteEntries(config, adapters),
  processRemoteEntries: createProcessRemoteEntries(config, adapters),
  markPoolsForReelection: createMarkPoolsForReelection(config, adapters),
  determineSharedExternals: createDetermineSharedExternals(config, adapters),
  poolSharedExternals: createPoolSharedExternals(config, adapters),
  generateImportMap: createGenerateImportMap(config, adapters),
  commitChanges: createCommitChanges(config, adapters),
  exposeModuleLoader: createExposeModuleLoader(config, adapters),
  getRemoteEntry: createGetRemoteEntry(config, adapters),
  updateCache: createUpdateCache(config, adapters),
  poolDynamicExternals: createPoolDynamicExternals(config, adapters),
  convertToImportMap: createConvertToImportMap(config, adapters)
});
var INIT_FLOW_FACTORY = ({
  config,
  adapters
}) => {
  const flow = createInitDrivers({ config, adapters });
  return {
    flow,
    adapters,
    config
  };
};
var createBrowser = (config) => {
  return {
    setImportMapFn: config.setImportMapFn,
    importModule: config.loadModuleFn
  };
};
var import_valid = __toESM(require_valid());
var import_satisfies = __toESM(require_satisfies());
var import_compare = __toESM(require_compare());
var import_min_version = __toESM(require_min_version());
var import_valid2 = __toESM(require_valid2());
var createVersionCheck = () => {
  return {
    isValidSemver: function(version) {
      return (0, import_valid.default)(version) !== null;
    },
    isCompatible: function(version, range) {
      return (0, import_satisfies.default)(version, range);
    },
    compare: function(versionA, versionB) {
      return (0, import_compare.default)(versionA, versionB, true);
    },
    smallestVersion: function(versionRange) {
      if (!(0, import_valid2.default)(versionRange)) return "0.0.0";
      const minVersion = (0, import_min_version.default)(versionRange);
      return minVersion?.raw ?? "0.0.0";
    }
  };
};
var SUPPORTED_ALGORITHMS = {
  "sha256-": "SHA-256",
  "sha384-": "SHA-384",
  "sha512-": "SHA-512"
};
var parseIntegrity = (integrity) => {
  for (const prefix of Object.keys(SUPPORTED_ALGORITHMS)) {
    if (integrity.startsWith(prefix)) {
      return { algorithm: SUPPORTED_ALGORITHMS[prefix], expected: integrity };
    }
  }
  return null;
};
var toBase64 = (bytes) => {
  const view = new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < view.length; i++) bin += String.fromCharCode(view[i]);
  return btoa(bin);
};
var verifyIntegrity = async (bytes, integrity) => {
  const parsed = parseIntegrity(integrity);
  if (!parsed) {
    throw new TypeError(
      `Unsupported integrity prefix in '${integrity}'. Expected sha256-, sha384-, or sha512-.`
    );
  }
  const subtle = typeof crypto !== "undefined" && crypto.subtle ? crypto.subtle : void 0;
  if (!subtle) {
    throw new Error("SubtleCrypto is not available in this environment.");
  }
  const digest = await subtle.digest(parsed.algorithm, bytes);
  const actual = integrity.substring(0, integrity.indexOf("-") + 1) + toBase64(digest);
  if (actual !== parsed.expected) {
    throw new Error(`Integrity mismatch: expected ${parsed.expected}, got ${actual}`);
  }
};
var createManifestProvider = () => {
  const ensureOk = (response) => {
    if (!response.ok)
      return Promise.reject(new NFError(`${response.status} - ${response.statusText}`));
    return response;
  };
  const formatError = (manifestUrl) => (err) => {
    const msg = err instanceof Error ? err.message : String(err);
    throw new NFError(`Fetch of '${manifestUrl}' returned ${msg}`);
  };
  return {
    provide: async function(remotesOrManifestUrl, opts = {}) {
      if (typeof remotesOrManifestUrl !== "string") return Promise.resolve(remotesOrManifestUrl);
      const parse = async (response) => {
        if (!opts.integrity) return response.json();
        const bytes = await response.arrayBuffer();
        await verifyIntegrity(bytes, opts.integrity);
        return JSON.parse(new TextDecoder().decode(bytes));
      };
      return fetch(remotesOrManifestUrl).then(ensureOk).then(parse).catch(formatError(remotesOrManifestUrl));
    }
  };
};
function inferPackageFromSecondary(secondary) {
  const parts = secondary.split("/");
  if (secondary.startsWith("@") && parts.length >= 2) {
    return parts[0] + "/" + parts[1];
  }
  return parts[0];
}
function isDense(entry) {
  return "entries" in entry;
}
function isFlatChunk(entry) {
  return entry.packageName.startsWith(CHUNK_PREFIX2);
}
function densifyExternals(shared) {
  const result = [];
  const groupIndex = /* @__PURE__ */ new Map();
  for (const entry of shared) {
    if (isDense(entry)) {
      result.push(entry);
      continue;
    }
    if (isFlatChunk(entry)) {
      const _a = entry, { outFileName } = _a, rest = __objRest(_a, ["outFileName"]);
      result.push(__spreadProps(__spreadValues({}, rest), { entries: { [entry.packageName]: outFileName } }));
      continue;
    }
    const parent = inferPackageFromSecondary(entry.packageName);
    const sig = JSON.stringify({
      singleton: entry.singleton,
      strictVersion: entry.strictVersion,
      requiredVersion: entry.requiredVersion,
      version: entry.version,
      shareScope: entry.shareScope
    });
    const key = parent + " " + sig;
    const existing = groupIndex.get(key);
    if (existing === void 0) {
      const dense = {
        singleton: entry.singleton,
        strictVersion: entry.strictVersion,
        requiredVersion: entry.requiredVersion,
        packageName: parent,
        entries: { [entry.packageName]: entry.outFileName }
      };
      if (entry.version !== void 0) dense.version = entry.version;
      if (entry.shareScope !== void 0) dense.shareScope = entry.shareScope;
      if (entry.bundle !== void 0) dense.bundle = entry.bundle;
      if (entry.pool !== void 0) dense.pool = entry.pool;
      if (entry.dev !== void 0) dense.dev = entry.dev;
      groupIndex.set(key, result.length);
      result.push(dense);
    } else {
      result[existing].entries[entry.packageName] = entry.outFileName;
    }
  }
  return result;
}
function toDenseSharedInfoFormat(shared) {
  return shared.map((external) => {
    if ("entries" in external) return external;
    const _a = external, { outFileName } = _a, baseSharedInfoProps = __objRest(_a, ["outFileName"]);
    return __spreadProps(__spreadValues({}, baseSharedInfoProps), {
      entries: { [external.packageName]: outFileName }
    });
  });
}
var createRemoteEntryProvider = (config) => {
  const ensureOk = (response) => {
    if (!response.ok)
      return Promise.reject(new Error(`${response.status} - ${response.statusText}`));
    return response;
  };
  const fillEmptyFields = (remoteEntryUrl) => (remoteEntry) => {
    if (!remoteEntry.exposes) remoteEntry.exposes = [];
    if (!remoteEntry.shared) remoteEntry.shared = [];
    if (!remoteEntry.url) remoteEntry.url = remoteEntryUrl;
    return remoteEntry;
  };
  const normalizeRemoteEntry = (raw) => {
    const shared = config.feature.convertFlatSharedInfo ? densifyExternals(raw.shared ?? []) : toDenseSharedInfoFormat(raw.shared ?? []);
    return __spreadProps(__spreadValues({}, raw), { shared });
  };
  const formatError = (remoteEntryUrl) => (err) => {
    const msg = err instanceof Error ? err.message : String(err);
    throw new NFError(`Fetch of '${remoteEntryUrl}' returned ${msg}`);
  };
  return {
    provide: async function(remoteEntryUrl, opts = {}) {
      const parse = async (response) => {
        if (!opts.integrity) return response.json();
        const bytes = await response.arrayBuffer();
        await verifyIntegrity(bytes, opts.integrity);
        return JSON.parse(new TextDecoder().decode(bytes));
      };
      return fetch(remoteEntryUrl).then(ensureOk).then(parse).then(normalizeRemoteEntry).then(fillEmptyFields(remoteEntryUrl)).catch(formatError(remoteEntryUrl));
    }
  };
};
var createRemoteInfoRepository = (config) => {
  const STORAGE = config.storage("remotes", {});
  if (config.clearStorage) STORAGE.clear();
  const _cache = STORAGE.get() ?? {};
  let _dirty = false;
  return {
    contains: function(remoteName) {
      return !!_cache[remoteName];
    },
    remove: function(remoteName) {
      if (remoteName in _cache) {
        delete _cache[remoteName];
        _dirty = true;
      }
      return this;
    },
    addOrUpdate: function(remoteName, remote) {
      _cache[remoteName] = remote;
      _dirty = true;
      return this;
    },
    tryGet: function(remoteName) {
      return Optional.of(_cache[remoteName]);
    },
    tryGetModule: function(remoteName, exposedModule) {
      return Optional.of(_cache[remoteName]?.exposes.find((m) => m.moduleName === exposedModule)).map(
        (m) => join(_cache[remoteName].scopeUrl, m.file)
      );
    },
    getAll: function() {
      return _cache;
    },
    commit: function() {
      if (!_dirty) return this;
      STORAGE.set(_cache);
      _dirty = false;
      return this;
    }
  };
};
var createScopedExternalsRepository = (config) => {
  const STORAGE = config.storage("scoped-externals", {});
  if (config.clearStorage) STORAGE.clear();
  const _cache = STORAGE.get() ?? {};
  let _dirty = false;
  return {
    addExternal: function(remoteName, external, version) {
      if (!_cache[remoteName]) _cache[remoteName] = {};
      _cache[remoteName][external] = version;
      _dirty = true;
      return this;
    },
    remove: function(remoteName) {
      if (remoteName in _cache) {
        delete _cache[remoteName];
        _dirty = true;
      }
      return this;
    },
    getAll: function() {
      return _cache;
    },
    tryGet: function(remoteName) {
      return Optional.of(_cache[remoteName]);
    },
    commit: function() {
      if (!_dirty) return this;
      STORAGE.set(_cache);
      _dirty = false;
      return this;
    }
  };
};
var createSharedExternalsRepository = (config) => {
  const STORAGE = config.storage(
    "shared-externals",
    { [GLOBAL_SCOPE]: {} }
  );
  if (config.clearStorage) STORAGE.clear();
  const _cache = STORAGE.get() ?? { [GLOBAL_SCOPE]: {} };
  let _dirty = false;
  return {
    // Read from the cache rather than remembered from this init's entries: a warm init may not refetch
    // the tagged remote at all, and pooling has to coordinate its pool anyway. Exits on the first hit.
    // Per share scope, because a pool never spans one: a tag in another scope is no reason to pool here.
    hasPoolTag: function(shareScope) {
      const scope = _cache[shareScope ?? GLOBAL_SCOPE];
      if (!scope) return false;
      for (const external of Object.values(scope))
        for (const version of external.versions)
          for (const remote of version.remotes) if (remote.pool?.trim()) return true;
      return false;
    },
    getFromScope: function(shareScope) {
      return __spreadValues({}, _cache[shareScope ?? GLOBAL_SCOPE]);
    },
    addOrUpdate: function(externalName, external, shareScope) {
      if (!_cache[shareScope ?? GLOBAL_SCOPE]) _cache[shareScope ?? GLOBAL_SCOPE] = {};
      _cache[shareScope ?? GLOBAL_SCOPE][externalName] = external;
      _dirty = true;
      return this;
    },
    getScopes: function(o = { includeGlobal: true }) {
      if (o.includeGlobal) return Object.keys(_cache);
      return Object.keys(_cache).filter((s) => s !== GLOBAL_SCOPE);
    },
    // Batched: one traversal of the graph per init instead of one per overridden remote.
    removeFromAllScopes: function(remoteNames) {
      if (remoteNames.size === 0) return;
      Object.values(_cache).forEach((scope) => {
        const removeExternals = [];
        Object.entries(scope).forEach(([name, external]) => {
          let removedCopy = false;
          for (let i = external.versions.length - 1; i >= 0; i--) {
            const version = external.versions[i];
            const remotes = version.remotes;
            const host = version.host ? remotes[0]?.name : void 0;
            let keep = 0;
            for (let r = 0; r < remotes.length; r++) {
              if (remoteNames.has(remotes[r].name)) continue;
              remotes[keep++] = remotes[r];
            }
            if (keep !== remotes.length) {
              remotes.length = keep;
              removedCopy = true;
              _dirty = true;
              if (host !== void 0 && remoteNames.has(host)) version.host = false;
            }
            if (remotes.length === 0) {
              external.versions.splice(i, 1);
              _dirty = true;
            }
          }
          if (removedCopy) {
            external.dirty = true;
            if (external.versions.length === 0) removeExternals.push(name);
          }
        });
        removeExternals.forEach((name) => delete scope[name]);
      });
    },
    scopeType: function(shareScope) {
      switch (shareScope) {
        case GLOBAL_SCOPE:
        case null:
        case void 0:
          return "global";
        case STRICT_SCOPE:
          return "strict";
        default:
          return "shareScope";
      }
    },
    tryGet: function(external, shareScope) {
      return Optional.of(_cache[shareScope ?? GLOBAL_SCOPE]?.[external]);
    },
    commit: function() {
      if (!_dirty) return this;
      STORAGE.set(_cache);
      _dirty = false;
      return this;
    }
  };
};
var createSSEHandler = (config) => {
  const subscribers = [];
  return {
    watchRemoteBuilds: function(endpoint) {
      const eventSource = new EventSource(endpoint);
      eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === BuildNotificationType2.COMPLETED) {
          subscribers.forEach((sub) => sub.close());
          config.log.debug(0, "[SSE] Rebuild completed, reloading...");
          config.reloadBrowserFn();
        }
      };
      eventSource.onerror = function(event) {
        config.log.error(0, "[SSE] Connection error:", event);
      };
      subscribers.push(eventSource);
    },
    closeAll: function() {
      subscribers.forEach((sub) => sub.close());
      subscribers.length = 0;
    }
  };
};
var createChunkRepository = (config) => {
  const STORAGE = config.storage("shared-chunks", {});
  if (config.clearStorage) STORAGE.clear();
  const _cache = STORAGE.get() ?? {};
  let _dirty = false;
  return {
    addOrReplace: function(remoteName, bundleName, chunks) {
      if (!_cache[remoteName]) _cache[remoteName] = {};
      _cache[remoteName][bundleName] = chunks;
      _dirty = true;
      return this;
    },
    // Whole-remote: a build that stops chunking a bundle omits the key, so `addOrReplace` cannot clear it.
    remove: function(remoteName) {
      if (remoteName in _cache) {
        delete _cache[remoteName];
        _dirty = true;
      }
      return this;
    },
    tryGet: function(remoteName, bundleName) {
      return Optional.of(_cache[remoteName]?.[bundleName]);
    },
    commit: function() {
      if (!_dirty) return this;
      STORAGE.set(_cache);
      _dirty = false;
      return this;
    }
  };
};
var createDriving = (config) => {
  const adapters = {
    versionCheck: createVersionCheck(),
    manifestProvider: createManifestProvider(),
    remoteEntryProvider: createRemoteEntryProvider(config),
    remoteInfoRepo: createRemoteInfoRepository(config),
    scopedExternalsRepo: createScopedExternalsRepository(config),
    sharedExternalsRepo: createSharedExternalsRepository(config),
    sharedChunksRepo: createChunkRepository(config),
    browser: createBrowser(config),
    sse: createSSEHandler(config)
  };
  return { adapters, config };
};
var IMPORT_MAP_KEYS = /* @__PURE__ */ new Set(["imports", "scopes", "integrity"]);
var validateImportMapJSON = (input) => {
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new TypeError("[nf-orchestrator] trusted-types: import map is not valid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new TypeError("[nf-orchestrator] trusted-types: import map must be a plain object");
  }
  for (const key of Object.keys(parsed)) {
    if (!IMPORT_MAP_KEYS.has(key)) {
      throw new TypeError(`[nf-orchestrator] trusted-types: unexpected key "${key}" in import map`);
    }
  }
  return input;
};
var validateScriptURL = (input) => {
  const base = typeof location !== "undefined" ? location.href : "http://localhost/";
  let url;
  try {
    url = new URL(input, base);
  } catch {
    throw new TypeError(`[nf-orchestrator] trusted-types: invalid script URL "${input}"`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new TypeError(
      `[nf-orchestrator] trusted-types: disallowed protocol "${url.protocol}" for script URL`
    );
  }
  return input;
};
var passThroughPolicy = {
  createScript: (input) => input,
  createScriptURL: (input) => input
};
var cachedPolicy = null;
var getTrustedTypesPolicy = (name = "nfo") => {
  if (name === false) return passThroughPolicy;
  if (cachedPolicy) return cachedPolicy;
  const factory = globalThis.trustedTypes;
  if (!factory) {
    cachedPolicy = passThroughPolicy;
    return cachedPolicy;
  }
  const native = factory.createPolicy(name, {
    createScript: validateImportMapJSON,
    createScriptURL: validateScriptURL
  });
  cachedPolicy = {
    createScript: (input) => native.createScript(input),
    createScriptURL: (input) => String(native.createScriptURL(input))
  };
  return cachedPolicy;
};
var replaceInDOM = (mapType, trustedTypesPolicyName = "nfo") => (importMap, opts = {}) => {
  if (opts?.override) {
    document.head.querySelectorAll(`script[type="${mapType}"]`).forEach((importMap2) => importMap2.remove());
  }
  const policy = getTrustedTypesPolicy(trustedTypesPolicyName);
  document.head.appendChild(
    Object.assign(document.createElement("script"), {
      type: mapType,
      text: policy.createScript(JSON.stringify(importMap))
    })
  );
  return Promise.resolve(importMap);
};
var useDefaultImportMap = (trustedTypesPolicyName = "nfo") => ({
  loadModuleFn: (url) => {
    const trusted = getTrustedTypesPolicy(trustedTypesPolicyName).createScriptURL(url);
    return import(
      /* @vite-ignore */
      trusted
    );
  },
  setImportMapFn: replaceInDOM("importmap", trustedTypesPolicyName),
  reloadBrowserFn: () => {
    window.location.reload();
  }
});
var createImportMapConfig = (o) => {
  const fallback = useDefaultImportMap(o.trustedTypesPolicyName);
  return {
    setImportMapFn: o.setImportMapFn ?? fallback.setImportMapFn,
    loadModuleFn: o.loadModuleFn ?? fallback.loadModuleFn,
    reloadBrowserFn: o.reloadBrowserFn ?? fallback.reloadBrowserFn
  };
};
var createHostConfig = (override) => {
  const extras = override?.manifestIntegrity ? { manifestIntegrity: override.manifestIntegrity } : {};
  if (!override?.hostRemoteEntry) {
    return __spreadValues({ hostRemoteEntry: false }, extras);
  }
  if (typeof override.hostRemoteEntry === "string") {
    return __spreadValues({
      hostRemoteEntry: {
        name: "__NF-HOST__",
        url: override.hostRemoteEntry
      }
    }, extras);
  }
  return __spreadValues({
    hostRemoteEntry: __spreadValues({
      name: "__NF-HOST__"
    }, override.hostRemoteEntry)
  }, extras);
};
var noopLogger = {
  debug: () => {
  },
  error: () => {
  },
  warn: () => {
  }
};
var LogLevel = {
  debug: 0,
  warn: 1,
  error: 2
};
var createLogHandler = (logger, logLevel) => {
  const logTypes = Object.keys(LogLevel).filter((key) => isNaN(Number(key)));
  return logTypes.reduce(
    (acc, logMessageType) => {
      return __spreadProps(__spreadValues({}, acc), {
        [logMessageType]: (step, message, details) => {
          if (LogLevel[logMessageType] >= LogLevel[logLevel]) {
            logger[logMessageType](step, message, details);
          }
        }
      });
    },
    { level: logLevel }
  );
};
var createLogConfig = ({ logger, logLevel, sse }) => ({
  log: createLogHandler(logger ?? noopLogger, logLevel ?? "error"),
  sse: !!sse
});
var cloneEntry = (name, raw) => {
  try {
    if (typeof structuredClone === "function") {
      return structuredClone(raw);
    }
  } catch {
  }
  try {
    return JSON.parse(JSON.stringify(raw));
  } catch {
  }
  throw new NFError(`Could not clone entry '${String(name)}'`);
};
var globalThisStorageEntry = (namespace) => (key, initialValue) => {
  if (!globalThis[namespace]) {
    globalThis[namespace] = {};
  }
  const storage = globalThis[namespace];
  const entry = {
    get() {
      return cloneEntry(key, key in storage ? storage[key] : initialValue);
    },
    set(value) {
      storage[key] = cloneEntry(key, value);
      return entry;
    },
    clear() {
      storage[key] = cloneEntry(key, initialValue);
      return this;
    }
  };
  return entry;
};
var createStorageConfig = (override) => ({
  storage: override.storage ? override.storage(override.storageNamespace ?? "__NATIVE_FEDERATION__") : globalThisStorageEntry(override.storageNamespace ?? "__NATIVE_FEDERATION__"),
  clearStorage: override.clearStorage ?? false
});
var defaultProfile = {
  latestSharedExternal: false,
  skipInvalidExternalVersions: false,
  scopeUncoveredEntrypoints: false,
  overrideCachedRemotes: "init-only",
  overrideCachedRemotesIfURLMatches: false
};
var createModeConfig = (override) => {
  const strictnessConfig = typeof override.strict === "boolean" ? {
    strictRemoteEntry: override.strict,
    strictExternalCompatibility: override.strict,
    strictExternalSameVersionCompatibility: override.strict,
    strictExternalVersion: override.strict,
    strictImportMap: override.strict,
    strictEntryPointCoverage: override.strict
  } : {
    strictRemoteEntry: override.strict?.strictRemoteEntry ?? false,
    strictExternalCompatibility: override.strict?.strictExternalCompatibility ?? false,
    strictExternalSameVersionCompatibility: override.strict?.strictExternalSameVersionCompatibility ?? false,
    strictExternalVersion: override.strict?.strictExternalVersion ?? false,
    strictImportMap: override.strict?.strictImportMap ?? false,
    strictEntryPointCoverage: override.strict?.strictEntryPointCoverage ?? false
  };
  return {
    strict: strictnessConfig,
    profile: __spreadValues(__spreadValues({}, defaultProfile), override.profile ?? {}),
    feature: {
      convertFlatSharedInfo: override.feature?.convertFlatSharedInfo ?? false,
      useAutoExternalPooling: override.feature?.useAutoExternalPooling ?? false
    }
  };
};
var createConfigHandlers = (overrides) => __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, createImportMapConfig(overrides)), createHostConfig(overrides)), createLogConfig(overrides)), createStorageConfig(overrides)), createModeConfig(overrides));
var createStateDump = (config, adapters) => (msg) => config.log.debug(0, msg, {
  remotes: __spreadValues({}, adapters.remoteInfoRepo.getAll()),
  "shared-externals": adapters.sharedExternalsRepo.getScopes({ includeGlobal: true }).reduce(
    (acc, scope) => __spreadProps(__spreadValues({}, acc), { [scope]: adapters.sharedExternalsRepo.getFromScope(scope) }),
    {}
  ),
  "scoped-externals": adapters.scopedExternalsRepo.getAll()
});
var createFederationResult = ({
  config,
  adapters,
  loadRemoteModule,
  initRemoteEntryFlow,
  afterInitRemoteEntry
}) => {
  const stateDump = createStateDump(config, adapters);
  const initRemoteEntry = async (remoteEntryUrl, remote) => {
    const remoteName = typeof remote === "string" ? remote : remote?.name;
    return initRemoteEntryFlow(remoteEntryUrl, remote).catch((e) => {
      stateDump(`[dynamic-init][${remoteName ?? remoteEntryUrl}] STATE DUMP`);
      if (config.strict.strictRemoteEntry) return Promise.reject(e);
      else console.warn("Failed to initialize remote entry, continuing anyway.");
      return Promise.resolve();
    }).then(() => afterInitRemoteEntry?.()).then(() => result);
  };
  const result = {
    config,
    adapters,
    loadRemoteModule,
    load: loadRemoteModule,
    as: () => ({
      loadRemoteModule,
      load: loadRemoteModule
    }),
    initRemoteEntry
  };
  return result;
};
var initFederation = (remotesOrManifestUrl, options = {}) => {
  const { adapters, config } = createDriving(createConfigHandlers(options));
  const factory = INIT_FLOW_FACTORY({ adapters, config });
  const initFlow = createInitFlow(factory);
  const initRemoteEntryFlow = createInitRemoteEntryFlow(factory);
  return initFlow(remotesOrManifestUrl).then(
    ({ loadRemoteModule }) => createFederationResult({ config, adapters, loadRemoteModule, initRemoteEntryFlow })
  ).catch((e) => {
    createStateDump(config, adapters)(`[init] STATE DUMP`);
    return Promise.reject(e);
  });
};

// node_modules/@softarc/native-federation-orchestrator/fesm2022/options.mjs
var consoleLogger = {
  /* eslint no-console: "off", curly: "error" */
  debug: (step, msg, err) => !!err ? console.log(`[DEBUG][${step}]: ${msg}`, err) : console.log(`[DEBUG][${step}]: ${msg}`),
  error: (step, msg, err) => !!err ? console.error(`[NF][${step}]: ${msg}`, err) : console.error(`[NF][${step}]: ${msg}`),
  warn: (step, msg, err) => !!err ? console.warn(`[NF][${step}]: ${msg}`, err) : console.warn(`[NF][${step}]: ${msg}`)
};
var IMPORT_MAP_KEYS2 = /* @__PURE__ */ new Set(["imports", "scopes", "integrity"]);
var validateImportMapJSON2 = (input) => {
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new TypeError("[nf-orchestrator] trusted-types: import map is not valid JSON");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new TypeError("[nf-orchestrator] trusted-types: import map must be a plain object");
  }
  for (const key of Object.keys(parsed)) {
    if (!IMPORT_MAP_KEYS2.has(key)) {
      throw new TypeError(`[nf-orchestrator] trusted-types: unexpected key "${key}" in import map`);
    }
  }
  return input;
};
var validateScriptURL2 = (input) => {
  const base = typeof location !== "undefined" ? location.href : "http://localhost/";
  let url;
  try {
    url = new URL(input, base);
  } catch {
    throw new TypeError(`[nf-orchestrator] trusted-types: invalid script URL "${input}"`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new TypeError(
      `[nf-orchestrator] trusted-types: disallowed protocol "${url.protocol}" for script URL`
    );
  }
  return input;
};
var passThroughPolicy2 = {
  createScript: (input) => input,
  createScriptURL: (input) => input
};
var cachedPolicy2 = null;
var getTrustedTypesPolicy2 = (name = "nfo") => {
  if (name === false) return passThroughPolicy2;
  if (cachedPolicy2) return cachedPolicy2;
  const factory = globalThis.trustedTypes;
  if (!factory) {
    cachedPolicy2 = passThroughPolicy2;
    return cachedPolicy2;
  }
  const native = factory.createPolicy(name, {
    createScript: validateImportMapJSON2,
    createScriptURL: validateScriptURL2
  });
  cachedPolicy2 = {
    createScript: (input) => native.createScript(input),
    createScriptURL: (input) => String(native.createScriptURL(input))
  };
  return cachedPolicy2;
};
var replaceInDOM2 = (mapType, trustedTypesPolicyName = "nfo") => (importMap, opts = {}) => {
  if (opts?.override) {
    document.head.querySelectorAll(`script[type="${mapType}"]`).forEach((importMap2) => importMap2.remove());
  }
  const policy = getTrustedTypesPolicy2(trustedTypesPolicyName);
  document.head.appendChild(
    Object.assign(document.createElement("script"), {
      type: mapType,
      text: policy.createScript(JSON.stringify(importMap))
    })
  );
  return Promise.resolve(importMap);
};
var useShimImportMap = (cfg = { shimMode: false }, trustedTypesPolicyName = "nfo") => ({
  loadModuleFn: (url) => {
    const trusted = getTrustedTypesPolicy2(trustedTypesPolicyName).createScriptURL(url);
    return importShim(trusted);
  },
  setImportMapFn: replaceInDOM2(
    cfg.shimMode ? "importmap-shim" : "importmap",
    trustedTypesPolicyName
  ),
  reloadBrowserFn: () => {
    window.location.reload();
  }
});
var useDefaultImportMap2 = (trustedTypesPolicyName = "nfo") => ({
  loadModuleFn: (url) => {
    const trusted = getTrustedTypesPolicy2(trustedTypesPolicyName).createScriptURL(url);
    return import(
      /* @vite-ignore */
      trusted
    );
  },
  setImportMapFn: replaceInDOM2("importmap", trustedTypesPolicyName),
  reloadBrowserFn: () => {
    window.location.reload();
  }
});

// node_modules/@angular-architects/native-federation/src/index.js
var resolveFirstInit;
var rejectFirstInit;
var firstInitCaptured = false;
var federationPromise = new Promise((resolve, reject) => {
  resolveFirstInit = resolve;
  rejectFirstInit = reject;
});
function initFederation2(remotesOrManifestUrl, options = {}) {
  const _a = options, { cacheTag, shimMode } = _a, nfOpts = __objRest(_a, ["cacheTag", "shimMode"]);
  const importMapProvider = shimMode === false ? useDefaultImportMap2() : useShimImportMap({ shimMode: true });
  const p = initFederation(remotesOrManifestUrl ?? {}, __spreadValues(__spreadProps(__spreadValues({}, importMapProvider), {
    logger: consoleLogger,
    hostRemoteEntry: { url: "./remoteEntry.json", cacheTag }
  }), nfOpts));
  if (!firstInitCaptured) {
    firstInitCaptured = true;
    p.then(resolveFirstInit, rejectFirstInit);
  }
  federationPromise = p;
  return p;
}

// apps/back-office/src/main.ts
initFederation2().then(() => import("./chunk-YMH4N5BK.js")).catch((error) => console.error(error));
