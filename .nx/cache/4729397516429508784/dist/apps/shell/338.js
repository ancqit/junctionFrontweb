(self["webpackChunkshell"] = self["webpackChunkshell"] || []).push([[338],{

/***/ 3707
/*!******************************************!*\
  !*** ./apps/shell/src/app/app.config.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appConfig: () => (/* binding */ appConfig)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 2893);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 5087);
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.routes */ 2791);
/* harmony import */ var _core_auth_interceptor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/auth.interceptor */ 1815);





const appConfig = {
  providers: [(0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.provideBrowserGlobalErrorListeners)(), (0,_angular_router__WEBPACK_IMPORTED_MODULE_1__.provideRouter)(_app_routes__WEBPACK_IMPORTED_MODULE_3__.routes), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.provideHttpClient)((0,_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.withInterceptors)([_core_auth_interceptor__WEBPACK_IMPORTED_MODULE_4__.authInterceptor]))]
};

/***/ },

/***/ 2791
/*!******************************************!*\
  !*** ./apps/shell/src/app/app.routes.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   routes: () => (/* binding */ routes)
/* harmony export */ });
/* harmony import */ var _core_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/auth.guard */ 6005);
/* harmony import */ var _login_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login/login */ 3543);


const routes = [{
  path: 'login',
  component: _login_login__WEBPACK_IMPORTED_MODULE_1__.Login
}, {
  path: 'back-office',
  canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_0__.authGuard],
  loadComponent: () => __webpack_require__.e(/*! import() */ 475).then(__webpack_require__.t.bind(__webpack_require__, /*! back-office/Component */ 3856, 23)).then(module => module.App)
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'login'
}, {
  path: '**',
  redirectTo: 'login'
}];

/***/ },

/***/ 9003
/*!***********************************!*\
  !*** ./apps/shell/src/app/app.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   App: () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 2893);
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/auth.service */ 5203);




let App = /*#__PURE__*/(() => {
  class App {
    constructor() {
      (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_core_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService).startSession();
    }
    static {
      this.ɵfac = function App_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || App)();
      };
    }
    static {
      this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: App,
        selectors: [["app-root"]],
        decls: 1,
        vars: 0,
        template: function App_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
          }
        },
        dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
        encapsulation: 2
      });
    }
  }
  return App;
})();

/***/ },

/***/ 5708
/*!***********************************************!*\
  !*** ./apps/shell/src/app/core/api.config.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_CONFIG: () => (/* binding */ API_CONFIG)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);

const API_CONFIG = /*#__PURE__*/new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    baseUrl: 'http://localhost:8000'
  })
});

/***/ },

/***/ 723
/*!************************************************!*\
  !*** ./apps/shell/src/app/core/api.service.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApiService: () => (/* binding */ ApiService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 5087);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _api_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api.config */ 5708);




let ApiService = /*#__PURE__*/(() => {
  class ApiService {
    constructor() {
      this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient);
      this.config = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_api_config__WEBPACK_IMPORTED_MODULE_2__.API_CONFIG);
    }
    get(path, params) {
      return this.http.get(this.url(path), {
        params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpParams({
          fromObject: params ?? {}
        })
      });
    }
    post(path, body) {
      return this.http.post(this.url(path), body);
    }
    url(path) {
      return `${this.config.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
    static {
      this.ɵfac = function ApiService_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || ApiService)();
      };
    }
    static {
      this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
        token: ApiService,
        factory: ApiService.ɵfac,
        providedIn: 'root'
      });
    }
  }
  return ApiService;
})();

/***/ },

/***/ 6005
/*!***********************************************!*\
  !*** ./apps/shell/src/app/core/auth.guard.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authGuard: () => (/* binding */ authGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 2893);
/* harmony import */ var _token_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./token.service */ 8170);



const authGuard = () => {
  return (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_token_service__WEBPACK_IMPORTED_MODULE_2__.TokenService).isAuthenticated ? true : (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router).createUrlTree(['/login']);
};

/***/ },

/***/ 1815
/*!*****************************************************!*\
  !*** ./apps/shell/src/app/core/auth.interceptor.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authInterceptor: () => (/* binding */ authInterceptor)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 8830);
/* harmony import */ var _api_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api.config */ 5708);
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.service */ 5203);
/* harmony import */ var _token_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./token.service */ 8170);





const authInterceptor = (request, next) => {
  const config = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_api_config__WEBPACK_IMPORTED_MODULE_2__.API_CONFIG);
  const tokens = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_token_service__WEBPACK_IMPORTED_MODULE_4__.TokenService);
  const auth = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService);
  const isApiCall = request.url.startsWith(config.baseUrl);
  const isAuthCall = request.url.includes('/auth/otp/') || request.url.includes('/auth/refresh');
  const outgoing = isApiCall && tokens.accessToken ? request.clone({
    setHeaders: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  }) : request;
  return next(outgoing).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(error => {
    if (error.status !== 401 || !isApiCall || isAuthCall || !tokens.refreshToken) return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.throwError)(() => error);
    return auth.refresh().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_1__.switchMap)(() => next(request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    }))), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(refreshError => {
      auth.logout();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.throwError)(() => refreshError);
    }));
  }));
};

/***/ },

/***/ 5203
/*!*************************************************!*\
  !*** ./apps/shell/src/app/core/auth.service.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 2893);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 8830);
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api.service */ 723);
/* harmony import */ var _token_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./token.service */ 8170);






let AuthService = /*#__PURE__*/(() => {
  class AuthService {
    constructor() {
      this.api = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_api_service__WEBPACK_IMPORTED_MODULE_3__.ApiService);
      this.tokens = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_token_service__WEBPACK_IMPORTED_MODULE_4__.TokenService);
      this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router);
      this.authenticated$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(this.tokens.isAuthenticated);
    }
    requestOtp(payload) {
      return this.api.post('/auth/otp/request', payload);
    }
    verifyOtp(challengeId, otp) {
      return this.api.post('/auth/otp/verify', {
        challengeId,
        otp
      }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.tap)(value => this.acceptTokens(value)));
    }
    refresh() {
      return this.api.post('/auth/refresh', {
        refreshToken: this.tokens.refreshToken
      }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.tap)(value => this.acceptTokens(value)));
    }
    startSession() {
      if (this.tokens.isAuthenticated) this.scheduleRefresh();
    }
    logout() {
      clearTimeout(this.refreshTimer);
      this.tokens.clear();
      this.authenticated$.next(false);
      void this.router.navigateByUrl('/login');
    }
    acceptTokens(tokens) {
      this.tokens.save(tokens);
      this.authenticated$.next(true);
      this.scheduleRefresh();
    }
    scheduleRefresh() {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => this.refresh().subscribe({
        error: () => this.logout()
      }), this.tokens.millisecondsUntilRefresh());
    }
    static {
      this.ɵfac = function AuthService_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || AuthService)();
      };
    }
    static {
      this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: AuthService,
        factory: AuthService.ɵfac,
        providedIn: 'root'
      });
    }
  }
  return AuthService;
})();

/***/ },

/***/ 8170
/*!**************************************************!*\
  !*** ./apps/shell/src/app/core/token.service.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenService: () => (/* binding */ TokenService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);

const TOKEN_KEY = 'junction.auth';
let TokenService = /*#__PURE__*/(() => {
  class TokenService {
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
      localStorage.setItem(TOKEN_KEY, JSON.stringify({
        ...tokens,
        expiresAt: Date.now() + tokens.expiresInSeconds * 1000
      }));
    }
    clear() {
      localStorage.removeItem(TOKEN_KEY);
    }
    millisecondsUntilRefresh() {
      return Math.max(0, (this.tokens?.expiresAt ?? 0) - Date.now() - 5 * 60_000);
    }
    get tokens() {
      try {
        return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? 'null');
      } catch {
        this.clear();
        return null;
      }
    }
    static {
      this.ɵfac = function TokenService_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || TokenService)();
      };
    }
    static {
      this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: TokenService,
        factory: TokenService.ɵfac,
        providedIn: 'root'
      });
    }
  }
  return TokenService;
})();

/***/ },

/***/ 3543
/*!*******************************************!*\
  !*** ./apps/shell/src/app/login/login.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Login: () => (/* binding */ Login)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4691);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 2775);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 2893);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 8830);
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/auth.service */ 5203);







function Login_Conditional_20_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Please enter your name.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function Login_Conditional_20_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Enter a valid 10-digit Indian mobile number.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function Login_Conditional_20_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function Login_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Welcome to Junction");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h2", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Let\u2019s get you set up");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "A few details, then we\u2019ll verify your mobile number.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "form", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function Login_Conditional_20_Template_form_ngSubmit_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.sendOtp());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Full name");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrolCreate"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditionalCreate"](10, Login_Conditional_20_Conditional_10_Template, 2, 0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Mobile number");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 16)(14, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "+91");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrolCreate"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditionalCreate"](17, Login_Conditional_20_Conditional_17_Template, 2, 0, "small");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 18)(19, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "City");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "input", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrolCreate"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Locality");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrolCreate"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Development location is fixed to Ranchi \u00B7 Main Road");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditionalCreate"](27, Login_Conditional_20_Conditional_27_Template, 2, 1, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r1.details);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrol"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](ctx_r1.details.controls.name.touched && ctx_r1.details.controls.name.invalid ? 10 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrol"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](ctx_r1.details.controls.mobileNumber.touched && ctx_r1.details.controls.mobileNumber.invalid ? 17 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrol"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrol"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](ctx_r1.error() ? 27 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.busy() ? "Sending\u2026" : "Send OTP");
  }
}
function Login_Conditional_21_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.error());
  }
}
function Login_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function Login_Conditional_21_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.editNumber());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "\u2190 Edit details");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "p", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "One quick check");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h2", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Enter your OTP");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "form", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function Login_Conditional_21_Template_form_ngSubmit_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.verifyOtp());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Verification code");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "input", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrolCreate"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditionalCreate"](12, Login_Conditional_21_Conditional_12_Template, 2, 1, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("We sent a 6-digit code to +91 ", ctx_r1.details.getRawValue().mobileNumber, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx_r1.otpForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontrol"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](ctx_r1.error() ? 12 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r1.busy());
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.busy() ? "Verifying\u2026" : "Verify & continue");
  }
}
let Login = /*#__PURE__*/(() => {
  class Login {
    constructor() {
      this.fb = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder);
      this.auth = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_core_auth_service__WEBPACK_IMPORTED_MODULE_4__.AuthService);
      this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
      this.step = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('details', /* @ts-ignore */
      ...(ngDevMode ? [{
        debugName: "step"
      }] : /* istanbul ignore next */[]));
      this.busy = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false, /* @ts-ignore */
      ...(ngDevMode ? [{
        debugName: "busy"
      }] : /* istanbul ignore next */[]));
      this.error = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', /* @ts-ignore */
      ...(ngDevMode ? [{
        debugName: "error"
      }] : /* istanbul ignore next */[]));
      this.challengeId = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)('', /* @ts-ignore */
      ...(ngDevMode ? [{
        debugName: "challengeId"
      }] : /* istanbul ignore next */[]));
      this.details = this.fb.nonNullable.group({
        name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.minLength(2)]],
        mobileNumber: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.pattern(/^[6-9]\d{9}$/)]],
        city: [{
          value: 'Ranchi',
          disabled: true
        }],
        locality: [{
          value: 'Main Road',
          disabled: true
        }]
      });
      this.otpForm = this.fb.nonNullable.group({
        otp: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.pattern(/^\d{6}$/)]]
      });
    }
    sendOtp() {
      if (this.details.invalid) {
        this.details.markAllAsTouched();
        return;
      }
      this.busy.set(true);
      this.error.set('');
      this.auth.requestOtp(this.details.getRawValue()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.busy.set(false))).subscribe({
        next: ({
          challengeId
        }) => {
          this.challengeId.set(challengeId);
          this.step.set('otp');
        },
        error: () => this.error.set('We could not send the OTP. Check the local API and try again.')
      });
    }
    verifyOtp() {
      if (this.otpForm.invalid) {
        this.otpForm.markAllAsTouched();
        return;
      }
      this.busy.set(true);
      this.error.set('');
      this.auth.verifyOtp(this.challengeId(), this.otpForm.getRawValue().otp).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.finalize)(() => this.busy.set(false))).subscribe({
        next: () => void this.router.navigateByUrl('/back-office'),
        error: () => this.error.set('That OTP is invalid or has expired. Please try again.')
      });
    }
    editNumber() {
      this.otpForm.reset();
      this.step.set('details');
      this.error.set('');
    }
    static {
      this.ɵfac = function Login_Factory(__ngFactoryType__) {
        return new (__ngFactoryType__ || Login)();
      };
    }
    static {
      this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: Login,
        selectors: [["app-login"]],
        decls: 24,
        vars: 3,
        consts: [[1, "login-page"], [1, "story"], ["href", "/", "aria-label", "Junction home", 1, "brand"], [1, "story-copy"], [1, "eyebrow"], [1, "trusted"], ["aria-labelledby", "login-title", 1, "overlay"], [1, "card"], ["aria-label", "Login progress", 1, "steps"], [1, "active"], [1, "terms"], [1, "kicker"], ["id", "login-title"], [1, "subcopy"], [3, "ngSubmit", "formGroup"], ["formControlName", "name", "autocomplete", "name", "placeholder", "e.g. Aarav Kumar"], [1, "phone"], ["formControlName", "mobileNumber", "inputmode", "numeric", "maxlength", "10", "autocomplete", "tel", "placeholder", "98765 43210"], [1, "location"], ["formControlName", "city"], ["formControlName", "locality"], [1, "locked"], ["role", "alert", 1, "error"], ["type", "submit", 3, "disabled"], ["type", "button", 1, "back", 3, "click"], ["formControlName", "otp", "inputmode", "numeric", "maxlength", "6", "autocomplete", "one-time-code", "placeholder", "000000", 1, "otp"]],
        template: function Login_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "main", 0)(1, "section", 1)(2, "a", 2)(3, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "J");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Junction");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3)(7, "p", 4);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Your neighbourhood, connected");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "h1");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Run your business from one calm place.");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Manage your storefront, orders and customers with tools designed for the way local businesses work.");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "p", 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "Secure, password-free access");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "section", 6)(16, "div", 7)(17, "div", 8);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "span", 9)(19, "span");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditionalCreate"](20, Login_Conditional_20_Template, 30, 6)(21, Login_Conditional_21_Template, 15, 5);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "p", 10);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "By continuing, you agree to Junction\u2019s Terms and Privacy Policy.");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          }
          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](19);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx.step() === "otp");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](ctx.step() === "details" ? 20 : 21);
          }
        },
        dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName],
        styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 1.05fr 0.95fr;\n  background: #f5f3ee;\n  color: #17251c;\n}\n\n.story[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  padding: 52px 8vw;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  color: white;\n  background: linear-gradient(145deg, rgba(11, 58, 38, 0.97), rgba(19, 91, 57, 0.91));\n}\n\n.story[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  width: 460px;\n  height: 460px;\n  right: -180px;\n  bottom: -160px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  border-radius: 50%;\n  box-shadow: 0 0 0 62px rgba(255, 255, 255, 0.04), 0 0 0 124px rgba(255, 255, 255, 0.035);\n}\n\n.brand[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  color: inherit;\n  text-decoration: none;\n  font-size: 21px;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n}\n\n.brand[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 36px;\n  height: 36px;\n  margin-right: 8px;\n  border-radius: 12px;\n  color: #194b31;\n  background: #f3d782;\n}\n\n.story-copy[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  max-width: 570px;\n}\n\n.eyebrow[_ngcontent-%COMP%], .kicker[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n  letter-spacing: 0.14em;\n  font-size: 12px;\n  font-weight: 800;\n  color: #f1cf71;\n}\n\nh1[_ngcontent-%COMP%] {\n  margin: 12px 0 24px;\n  font-family: Georgia, serif;\n  font-size: clamp(48px, 5.4vw, 76px);\n  font-weight: 500;\n  line-height: 0.98;\n  letter-spacing: -0.045em;\n}\n\n.story-copy[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%]:last-child {\n  max-width: 490px;\n  color: rgba(255, 255, 255, 0.73);\n  font-size: 17px;\n  line-height: 1.65;\n}\n\n.trusted[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.62);\n}\n\n.overlay[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  padding: 42px;\n  background: radial-gradient(circle at 50% 30%, #fff 0, #f5f3ee 65%);\n}\n\n.card[_ngcontent-%COMP%] {\n  width: min(100%, 480px);\n  box-sizing: border-box;\n  padding: 42px;\n  border: 1px solid #dedbd2;\n  border-radius: 28px;\n  background: rgba(255, 255, 255, 0.88);\n  box-shadow: 0 28px 80px rgba(20, 42, 29, 0.1);\n}\n\n.steps[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 34px;\n}\n\n.steps[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 4px;\n  border-radius: 99px;\n  background: #dedbd2;\n}\n\n.steps[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%] {\n  background: #206c45;\n}\n\n.kicker[_ngcontent-%COMP%] {\n  color: #26754d;\n  margin: 0 0 10px;\n}\n\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: Georgia, serif;\n  font-size: 39px;\n  font-weight: 500;\n  letter-spacing: -0.03em;\n}\n\n.subcopy[_ngcontent-%COMP%] {\n  color: #6a746d;\n  line-height: 1.55;\n  margin: 12px 0 28px;\n}\n\nform[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 17px;\n}\n\nlabel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  color: #36453b;\n  font-size: 13px;\n  font-weight: 700;\n}\n\ninput[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  padding: 14px 15px;\n  background: #fff;\n  color: #17251c;\n  font: inherit;\n  font-size: 15px;\n  outline: none;\n}\n\ninput[_ngcontent-%COMP%]:focus {\n  border-color: #26754d;\n  box-shadow: 0 0 0 3px rgba(38, 117, 77, 0.12);\n}\n\ninput[_ngcontent-%COMP%]:disabled {\n  color: #59645c;\n  background: #f1f1ed;\n}\n\n.phone[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  align-items: center;\n  border: 1px solid #d8dbd6;\n  border-radius: 12px;\n  background: white;\n}\n\n.phone[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  padding-left: 15px;\n  color: #59645c;\n  font-weight: 600;\n}\n\n.phone[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0;\n  box-shadow: none;\n}\n\n.location[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n}\n\n.locked[_ngcontent-%COMP%] {\n  margin: -7px 0 2px;\n  color: #778078;\n  font-size: 12px;\n}\n\nsmall[_ngcontent-%COMP%], .error[_ngcontent-%COMP%] {\n  color: #b44136;\n  font-size: 12px;\n  margin-top: -12px;\n}\n\n.error[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  margin: 0;\n  border-radius: 9px;\n  background: #fff0ed;\n}\n\nbutton[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 12px;\n  padding: 15px 20px;\n  color: white;\n  background: #17633e;\n  font: inherit;\n  font-weight: 800;\n  cursor: pointer;\n}\n\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: wait;\n}\n\n.back[_ngcontent-%COMP%] {\n  padding: 0;\n  margin-bottom: 24px;\n  color: #26754d;\n  background: none;\n  font-size: 13px;\n}\n\n.otp[_ngcontent-%COMP%] {\n  text-align: center;\n  letter-spacing: 0.55em;\n  padding-left: calc(15px + 0.55em);\n  font-size: 22px;\n  font-weight: 700;\n}\n\n.terms[_ngcontent-%COMP%] {\n  margin: 28px 0 0;\n  text-align: center;\n  color: #8a918b;\n  font-size: 11px;\n}\n\n@media (max-width: 850px) {\n  .login-page[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .story[_ngcontent-%COMP%] {\n    min-height: 260px;\n    padding: 30px;\n  }\n  .story-copy[_ngcontent-%COMP%] {\n    margin: 45px 0;\n  }\n  h1[_ngcontent-%COMP%] {\n    font-size: 45px;\n  }\n  .trusted[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .overlay[_ngcontent-%COMP%] {\n    padding: 22px;\n  }\n  .card[_ngcontent-%COMP%] {\n    padding: 30px 24px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL2FwcHMvc2hlbGwvc3JjL2FwcC9sb2dpbi9sb2dpbi5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQVEsY0FBQTtFQUFnQixpQkFBQTtBQUd4Qjs7QUFGQTtFQUFjLGlCQUFBO0VBQW1CLGFBQUE7RUFBZSxvQ0FBQTtFQUFxQyxtQkFBQTtFQUFxQixjQUFBO0FBVTFHOztBQVRBO0VBQVMsa0JBQUE7RUFBb0IsZ0JBQUE7RUFBa0IsaUJBQUE7RUFBbUIsYUFBQTtFQUFlLHNCQUFBO0VBQXdCLDhCQUFBO0VBQWdDLFlBQUE7RUFBYyxtRkFBQTtBQW9Cdko7O0FBbkJBO0VBQWdCLFdBQUE7RUFBYSxrQkFBQTtFQUFvQixZQUFBO0VBQWMsYUFBQTtFQUFlLGFBQUE7RUFBZSxjQUFBO0VBQWdCLDJDQUFBO0VBQXlDLGtCQUFBO0VBQW9CLHdGQUFBO0FBK0IxSzs7QUE5QkE7RUFBUyxrQkFBQTtFQUFvQixVQUFBO0VBQVksY0FBQTtFQUFnQixxQkFBQTtFQUF1QixlQUFBO0VBQWlCLGdCQUFBO0VBQWtCLHVCQUFBO0FBd0NuSDs7QUF2Q0E7RUFBYyxvQkFBQTtFQUFzQixtQkFBQTtFQUFxQixXQUFBO0VBQWEsWUFBQTtFQUFjLGlCQUFBO0VBQW1CLG1CQUFBO0VBQXFCLGNBQUE7RUFBZ0IsbUJBQUE7QUFrRDVJOztBQWpEQTtFQUFjLGtCQUFBO0VBQW9CLFVBQUE7RUFBWSxnQkFBQTtBQXVEOUM7O0FBdERBO0VBQW9CLHlCQUFBO0VBQTJCLHNCQUFBO0VBQXVCLGVBQUE7RUFBaUIsZ0JBQUE7RUFBa0IsY0FBQTtBQThEekc7O0FBN0RBO0VBQUssbUJBQUE7RUFBcUIsMkJBQUE7RUFBNkIsbUNBQUE7RUFBcUMsZ0JBQUE7RUFBa0IsaUJBQUE7RUFBa0Isd0JBQUE7QUFzRWhJOztBQXJFQTtFQUE2QixnQkFBQTtFQUFrQixnQ0FBQTtFQUE4QixlQUFBO0VBQWlCLGlCQUFBO0FBNEU5Rjs7QUEzRUE7RUFBVyxrQkFBQTtFQUFvQixVQUFBO0VBQVksZUFBQTtFQUFpQixnQ0FBQTtBQWtGNUQ7O0FBakZBO0VBQVcsYUFBQTtFQUFlLG1CQUFBO0VBQXFCLGFBQUE7RUFBZSxtRUFBQTtBQXdGOUQ7O0FBdkZBO0VBQVEsdUJBQUE7RUFBeUIsc0JBQUE7RUFBd0IsYUFBQTtFQUFlLHlCQUFBO0VBQTJCLG1CQUFBO0VBQXFCLHFDQUFBO0VBQW1DLDZDQUFBO0FBaUczSjs7QUFoR0E7RUFBUyxhQUFBO0VBQWUsUUFBQTtFQUFVLG1CQUFBO0FBc0dsQzs7QUFyR0E7RUFBYyxXQUFBO0VBQWEsV0FBQTtFQUFhLG1CQUFBO0VBQXFCLG1CQUFBO0FBNEc3RDs7QUEzR0E7RUFBaUIsbUJBQUE7QUErR2pCOztBQTlHQTtFQUFVLGNBQUE7RUFBZ0IsZ0JBQUE7QUFtSDFCOztBQWxIQTtFQUFLLFNBQUE7RUFBVywyQkFBQTtFQUE2QixlQUFBO0VBQWlCLGdCQUFBO0VBQWtCLHVCQUFBO0FBMEhoRjs7QUF6SEE7RUFBVyxjQUFBO0VBQWdCLGlCQUFBO0VBQW1CLG1CQUFBO0FBK0g5Qzs7QUE5SEE7RUFBTyxhQUFBO0VBQWUsU0FBQTtBQW1JdEI7O0FBbElBO0VBQVEsYUFBQTtFQUFlLFFBQUE7RUFBVSxjQUFBO0VBQWdCLGVBQUE7RUFBaUIsZ0JBQUE7QUEwSWxFOztBQXpJQTtFQUFRLFdBQUE7RUFBYSxzQkFBQTtFQUF3Qix5QkFBQTtFQUEyQixtQkFBQTtFQUFxQixrQkFBQTtFQUFvQixnQkFBQTtFQUFrQixjQUFBO0VBQWdCLGFBQUE7RUFBZSxlQUFBO0VBQWlCLGFBQUE7QUFzSm5MOztBQXJKQTtFQUFjLHFCQUFBO0VBQXVCLDZDQUFBO0FBMEpyQzs7QUF6SkE7RUFBaUIsY0FBQTtFQUFnQixtQkFBQTtBQThKakM7O0FBN0pBO0VBQVMsYUFBQTtFQUFlLCtCQUFBO0VBQWlDLG1CQUFBO0VBQXFCLHlCQUFBO0VBQTJCLG1CQUFBO0VBQXFCLGlCQUFBO0FBc0s5SDs7QUFyS0E7RUFBYyxrQkFBQTtFQUFvQixjQUFBO0VBQWdCLGdCQUFBO0FBMktsRDs7QUExS0E7RUFBZSxTQUFBO0VBQVcsZ0JBQUE7QUErSzFCOztBQTlLQTtFQUFZLGFBQUE7RUFBZSw4QkFBQTtFQUFnQyxTQUFBO0FBb0wzRDs7QUFuTEE7RUFBVSxrQkFBQTtFQUFvQixjQUFBO0VBQWdCLGVBQUE7QUF5TDlDOztBQXhMQTtFQUFnQixjQUFBO0VBQWdCLGVBQUE7RUFBaUIsaUJBQUE7QUE4TGpEOztBQTdMQTtFQUFTLGtCQUFBO0VBQW9CLFNBQUE7RUFBVyxrQkFBQTtFQUFvQixtQkFBQTtBQW9NNUQ7O0FBbk1BO0VBQVMsU0FBQTtFQUFXLG1CQUFBO0VBQXFCLGtCQUFBO0VBQW9CLFlBQUE7RUFBYyxtQkFBQTtFQUFxQixhQUFBO0VBQWUsZ0JBQUE7RUFBa0IsZUFBQTtBQThNakk7O0FBN01BO0VBQWtCLGFBQUE7RUFBYyxZQUFBO0FBa05oQzs7QUFqTkE7RUFBUSxVQUFBO0VBQVksbUJBQUE7RUFBcUIsY0FBQTtFQUFnQixnQkFBQTtFQUFrQixlQUFBO0FBeU4zRTs7QUF4TkE7RUFBTyxrQkFBQTtFQUFvQixzQkFBQTtFQUF1QixpQ0FBQTtFQUFrQyxlQUFBO0VBQWlCLGdCQUFBO0FBZ09yRzs7QUEvTkE7RUFBUyxnQkFBQTtFQUFrQixrQkFBQTtFQUFvQixjQUFBO0VBQWdCLGVBQUE7QUFzTy9EOztBQXJPQTtFQUE0QjtJQUFjLDBCQUFBO0VBME94QztFQTFPc0U7SUFBUyxpQkFBQTtJQUFtQixhQUFBO0VBOE9sRztFQTlPbUg7SUFBYyxjQUFBO0VBaVBqSTtFQWpQbUo7SUFBSyxlQUFBO0VBb1B4SjtFQXBQMks7SUFBVyxhQUFBO0VBdVB0TDtFQXZQdU07SUFBVyxhQUFBO0VBMFBsTjtFQTFQbU87SUFBUSxrQkFBQTtFQTZQM087QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IG1pbi1oZWlnaHQ6IDEwMHZoOyB9XG4ubG9naW4tcGFnZSB7IG1pbi1oZWlnaHQ6IDEwMHZoOyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuMDVmciAuOTVmcjsgYmFja2dyb3VuZDogI2Y1ZjNlZTsgY29sb3I6ICMxNzI1MWM7IH1cbi5zdG9yeSB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjsgcGFkZGluZzogNTJweCA4dnc7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgY29sb3I6IHdoaXRlOyBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCByZ2JhKDExLDU4LDM4LC45NyksIHJnYmEoMTksOTEsNTcsLjkxKSk7IH1cbi5zdG9yeTo6YWZ0ZXIgeyBjb250ZW50OiAnJzsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogNDYwcHg7IGhlaWdodDogNDYwcHg7IHJpZ2h0OiAtMTgwcHg7IGJvdHRvbTogLTE2MHB4OyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4xOCk7IGJvcmRlci1yYWRpdXM6IDUwJTsgYm94LXNoYWRvdzogMCAwIDAgNjJweCByZ2JhKDI1NSwyNTUsMjU1LC4wNCksIDAgMCAwIDEyNHB4IHJnYmEoMjU1LDI1NSwyNTUsLjAzNSk7IH1cbi5icmFuZCB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTsgY29sb3I6IGluaGVyaXQ7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgZm9udC1zaXplOiAyMXB4OyBmb250LXdlaWdodDogNzAwOyBsZXR0ZXItc3BhY2luZzogLS4wM2VtOyB9XG4uYnJhbmQgc3BhbiB7IGRpc3BsYXk6IGlubGluZS1ncmlkOyBwbGFjZS1pdGVtczogY2VudGVyOyB3aWR0aDogMzZweDsgaGVpZ2h0OiAzNnB4OyBtYXJnaW4tcmlnaHQ6IDhweDsgYm9yZGVyLXJhZGl1czogMTJweDsgY29sb3I6ICMxOTRiMzE7IGJhY2tncm91bmQ6ICNmM2Q3ODI7IH1cbi5zdG9yeS1jb3B5IHsgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAxOyBtYXgtd2lkdGg6IDU3MHB4OyB9XG4uZXllYnJvdywgLmtpY2tlciB7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7IGxldHRlci1zcGFjaW5nOiAuMTRlbTsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogODAwOyBjb2xvcjogI2YxY2Y3MTsgfVxuaDEgeyBtYXJnaW46IDEycHggMCAyNHB4OyBmb250LWZhbWlseTogR2VvcmdpYSwgc2VyaWY7IGZvbnQtc2l6ZTogY2xhbXAoNDhweCwgNS40dncsIDc2cHgpOyBmb250LXdlaWdodDogNTAwOyBsaW5lLWhlaWdodDogLjk4OyBsZXR0ZXItc3BhY2luZzogLS4wNDVlbTsgfVxuLnN0b3J5LWNvcHkgPiBwOmxhc3QtY2hpbGQgeyBtYXgtd2lkdGg6IDQ5MHB4OyBjb2xvcjogcmdiYSgyNTUsMjU1LDI1NSwuNzMpOyBmb250LXNpemU6IDE3cHg7IGxpbmUtaGVpZ2h0OiAxLjY1OyB9XG4udHJ1c3RlZCB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTsgZm9udC1zaXplOiAxM3B4OyBjb2xvcjogcmdiYSgyNTUsMjU1LDI1NSwuNjIpOyB9XG4ub3ZlcmxheSB7IGRpc3BsYXk6IGdyaWQ7IHBsYWNlLWl0ZW1zOiBjZW50ZXI7IHBhZGRpbmc6IDQycHg7IGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDMwJSwgI2ZmZiAwLCAjZjVmM2VlIDY1JSk7IH1cbi5jYXJkIHsgd2lkdGg6IG1pbigxMDAlLCA0ODBweCk7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IHBhZGRpbmc6IDQycHg7IGJvcmRlcjogMXB4IHNvbGlkICNkZWRiZDI7IGJvcmRlci1yYWRpdXM6IDI4cHg7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsLjg4KTsgYm94LXNoYWRvdzogMCAyOHB4IDgwcHggcmdiYSgyMCw0MiwyOSwuMSk7IH1cbi5zdGVwcyB7IGRpc3BsYXk6IGZsZXg7IGdhcDogOHB4OyBtYXJnaW4tYm90dG9tOiAzNHB4OyB9XG4uc3RlcHMgc3BhbiB7IHdpZHRoOiAzNHB4OyBoZWlnaHQ6IDRweDsgYm9yZGVyLXJhZGl1czogOTlweDsgYmFja2dyb3VuZDogI2RlZGJkMjsgfVxuLnN0ZXBzIC5hY3RpdmUgeyBiYWNrZ3JvdW5kOiAjMjA2YzQ1OyB9XG4ua2lja2VyIHsgY29sb3I6ICMyNjc1NGQ7IG1hcmdpbjogMCAwIDEwcHg7IH1cbmgyIHsgbWFyZ2luOiAwOyBmb250LWZhbWlseTogR2VvcmdpYSwgc2VyaWY7IGZvbnQtc2l6ZTogMzlweDsgZm9udC13ZWlnaHQ6IDUwMDsgbGV0dGVyLXNwYWNpbmc6IC0uMDNlbTsgfVxuLnN1YmNvcHkgeyBjb2xvcjogIzZhNzQ2ZDsgbGluZS1oZWlnaHQ6IDEuNTU7IG1hcmdpbjogMTJweCAwIDI4cHg7IH1cbmZvcm0geyBkaXNwbGF5OiBncmlkOyBnYXA6IDE3cHg7IH1cbmxhYmVsIHsgZGlzcGxheTogZ3JpZDsgZ2FwOiA4cHg7IGNvbG9yOiAjMzY0NTNiOyBmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiA3MDA7IH1cbmlucHV0IHsgd2lkdGg6IDEwMCU7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJvcmRlcjogMXB4IHNvbGlkICNkOGRiZDY7IGJvcmRlci1yYWRpdXM6IDEycHg7IHBhZGRpbmc6IDE0cHggMTVweDsgYmFja2dyb3VuZDogI2ZmZjsgY29sb3I6ICMxNzI1MWM7IGZvbnQ6IGluaGVyaXQ7IGZvbnQtc2l6ZTogMTVweDsgb3V0bGluZTogbm9uZTsgfVxuaW5wdXQ6Zm9jdXMgeyBib3JkZXItY29sb3I6ICMyNjc1NGQ7IGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDM4LDExNyw3NywuMTIpOyB9XG5pbnB1dDpkaXNhYmxlZCB7IGNvbG9yOiAjNTk2NDVjOyBiYWNrZ3JvdW5kOiAjZjFmMWVkOyB9XG4ucGhvbmUgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gMWZyOyBhbGlnbi1pdGVtczogY2VudGVyOyBib3JkZXI6IDFweCBzb2xpZCAjZDhkYmQ2OyBib3JkZXItcmFkaXVzOiAxMnB4OyBiYWNrZ3JvdW5kOiB3aGl0ZTsgfVxuLnBob25lIHNwYW4geyBwYWRkaW5nLWxlZnQ6IDE1cHg7IGNvbG9yOiAjNTk2NDVjOyBmb250LXdlaWdodDogNjAwOyB9XG4ucGhvbmUgaW5wdXQgeyBib3JkZXI6IDA7IGJveC1zaGFkb3c6IG5vbmU7IH1cbi5sb2NhdGlvbiB7IGRpc3BsYXk6IGdyaWQ7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjsgZ2FwOiAxMnB4OyB9XG4ubG9ja2VkIHsgbWFyZ2luOiAtN3B4IDAgMnB4OyBjb2xvcjogIzc3ODA3ODsgZm9udC1zaXplOiAxMnB4OyB9XG5zbWFsbCwgLmVycm9yIHsgY29sb3I6ICNiNDQxMzY7IGZvbnQtc2l6ZTogMTJweDsgbWFyZ2luLXRvcDogLTEycHg7IH1cbi5lcnJvciB7IHBhZGRpbmc6IDEwcHggMTJweDsgbWFyZ2luOiAwOyBib3JkZXItcmFkaXVzOiA5cHg7IGJhY2tncm91bmQ6ICNmZmYwZWQ7IH1cbmJ1dHRvbiB7IGJvcmRlcjogMDsgYm9yZGVyLXJhZGl1czogMTJweDsgcGFkZGluZzogMTVweCAyMHB4OyBjb2xvcjogd2hpdGU7IGJhY2tncm91bmQ6ICMxNzYzM2U7IGZvbnQ6IGluaGVyaXQ7IGZvbnQtd2VpZ2h0OiA4MDA7IGN1cnNvcjogcG9pbnRlcjsgfVxuYnV0dG9uOmRpc2FibGVkIHsgb3BhY2l0eTogLjU1OyBjdXJzb3I6IHdhaXQ7IH1cbi5iYWNrIHsgcGFkZGluZzogMDsgbWFyZ2luLWJvdHRvbTogMjRweDsgY29sb3I6ICMyNjc1NGQ7IGJhY2tncm91bmQ6IG5vbmU7IGZvbnQtc2l6ZTogMTNweDsgfVxuLm90cCB7IHRleHQtYWxpZ246IGNlbnRlcjsgbGV0dGVyLXNwYWNpbmc6IC41NWVtOyBwYWRkaW5nLWxlZnQ6IGNhbGMoMTVweCArIC41NWVtKTsgZm9udC1zaXplOiAyMnB4OyBmb250LXdlaWdodDogNzAwOyB9XG4udGVybXMgeyBtYXJnaW46IDI4cHggMCAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjOGE5MThiOyBmb250LXNpemU6IDExcHg7IH1cbkBtZWRpYSAobWF4LXdpZHRoOiA4NTBweCkgeyAubG9naW4tcGFnZSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9IC5zdG9yeSB7IG1pbi1oZWlnaHQ6IDI2MHB4OyBwYWRkaW5nOiAzMHB4OyB9IC5zdG9yeS1jb3B5IHsgbWFyZ2luOiA0NXB4IDA7IH0gaDEgeyBmb250LXNpemU6IDQ1cHg7IH0gLnRydXN0ZWQgeyBkaXNwbGF5OiBub25lOyB9IC5vdmVybGF5IHsgcGFkZGluZzogMjJweDsgfSAuY2FyZCB7IHBhZGRpbmc6IDMwcHggMjRweDsgfSB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
      });
    }
  }
  return Login;
})();

/***/ },

/***/ 8338
/*!*************************************!*\
  !*** ./apps/shell/src/bootstrap.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ 4826);
/* harmony import */ var _app_app_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app.config */ 3707);
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app */ 9003);



(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__.bootstrapApplication)(_app_app__WEBPACK_IMPORTED_MODULE_2__.App, _app_app_config__WEBPACK_IMPORTED_MODULE_1__.appConfig).catch(err => console.error(err));

/***/ }

}])
//# sourceMappingURL=338.js.map