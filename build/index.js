/*!
 * 
 *   @wezz/fetchmanager v0.0.2
 *   https://github.com/wezz/FetchManager
 *
 *   Copyright (c) Wezz Balk (https://github.com/wezz)
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fetchmanager"] = factory();
	else
		root["fetchmanager"] = factory();
})(typeof global !== 'undefined' ? global : this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 25:
/***/ ((__unused_webpack_module, exports) => {

/* # Storage Manager

This will gelp you fetch information from session and local storage.

## Usage
import StoreManager from '../modules/StoreManager';
const storage = new StoreManager("storename");
let valueobj = storage.Get("valuekey"); // Will return a JSOn object if possible

valueobj.prop = "updatedprop";
storage.Save("valuekey", valueobj, true);

The last boolean defines if the values should be stored past the current session

*/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var StoreManager = /** @class */ (function () {
    function StoreManager(_prefix) {
        if (_prefix === void 0) { _prefix = "cache"; }
        this.storageTypes = {
            permanent: "localStorage",
            temporary: "sessionStorage",
        };
        this.prefix = _prefix;
    }
    StoreManager.prototype.getStorageMedium = function (permanent) {
        if (permanent === void 0) { permanent = true; }
        var storageType = permanent
            ? this.storageTypes.permanent
            : this.storageTypes.temporary;
        if (typeof window[storageType] !== "undefined") {
            return window[storageType];
        }
        return null;
    };
    StoreManager.prototype.Has = function (key) {
        return typeof this.Get("".concat(this.prefix, "-").concat(key)) !== "undefined";
    };
    StoreManager.prototype.Get = function (key) {
        var tempStorage = this.getStorageMedium(false);
        var permStorage = this.getStorageMedium(true);
        var success = false;
        var data = null;
        if (tempStorage && permStorage) {
            try {
                data = tempStorage.getItem("".concat(this.prefix, "-").concat(key));
                data = this.toJSONIfJSON(data);
                success = data !== null;
            }
            catch (e) { }
            if (!success) {
                try {
                    data = permStorage.getItem("".concat(this.prefix, "-").concat(key));
                    data = this.toJSONIfJSON(data);
                    success = data !== null;
                }
                catch (e) { }
            }
        }
        return data;
    };
    StoreManager.prototype.toJSONIfJSON = function (data) {
        if (typeof data === "string" &&
            (data.indexOf("{") === 0 || data.indexOf("[") === 0)) {
            data = JSON.parse(data);
        }
        return data;
    };
    StoreManager.prototype.Save = function (key, data, permanent) {
        if (permanent === void 0) { permanent = true; }
        console.warn("StoreManager.Save is deprecated");
        this.Set(key, data, permanent);
    };
    StoreManager.prototype.Set = function (key, data, permanent) {
        if (permanent === void 0) { permanent = true; }
        var storage = this.getStorageMedium(permanent);
        var success = false;
        if (storage) {
            if (typeof data === "object") {
                data = JSON.stringify(data);
            }
            try {
                storage.setItem("".concat(this.prefix, "-").concat(key), data);
                success = true;
            }
            catch (e) {
                console.error("Unable to save object", e);
            }
        }
        return success;
    };
    StoreManager.prototype.Remove = function (key) {
        var permanentStore = this.getStorageMedium(true);
        var sessionStorage = this.getStorageMedium(false);
        if (permanentStore) {
            permanentStore.removeItem("".concat(this.prefix, "-").concat(key));
        }
        if (sessionStorage) {
            sessionStorage.removeItem("".concat(this.prefix, "-").concat(key));
        }
    };
    return StoreManager;
}());
exports["default"] = StoreManager;


/***/ }),

/***/ 24:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/// jshint funcscope: true
/*
fetchManager
.Fetch(
{
    'key': 'uniquerequestkey',
    'url': this.options.ApiUrl + '/getformsettings',
    "querystring": {
        language: this.global.currentlanguage
    },
    'requestdelay': 0
})
.then((response) =>
{
    if (response)
    {
    }
});
*/
var StoreManager_1 = __webpack_require__(25);
//import StorageManager from "../../StoreManager/build/StoreManager";
var storageManager = new StoreManager_1.default("fetchmanager");
("use strict");
var FetchManager = /** @class */ (function () {
    function FetchManager() {
        this.moduleName = "FetchManager";
        this.requests = {};
        this.defaultFetchOptions = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        };
    }
    FetchManager.prototype.ObjToQueryString = function (params) {
        if (typeof params !== "object") {
            return "";
        }
        return Object.keys(params)
            .map(function (key) {
            if (Array.isArray(params[key])) {
                var splitParams = [];
                for (var i = 0; i < params[key].length; i++) {
                    splitParams.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(params[key][i])));
                }
                return splitParams.join("&");
            }
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        })
            .join("&");
    };
    FetchManager.prototype.Fetch = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var key, reqobj, fetchoptions;
            var _this = this;
            return __generator(this, function (_a) {
                if (!options.url) {
                    console.error("Need a url to do a request");
                    return [2 /*return*/, null];
                }
                key = this.getKey(options);
                reqobj = this.getRequestObj(key, options);
                fetchoptions = this.parseFetchOptions(options);
                if (reqobj.active) {
                    if (options.url !== reqobj.url) {
                        if (typeof window["AbortController"] !== "undefined" &&
                            reqobj["abortcontroller"] &&
                            typeof reqobj["abortcontroller"]["abort"] === "function") {
                            // console.info('Request was aborted', reqobj);
                            reqobj["abortcontroller"].abort();
                            reqobj["abortcontroller"] = new AbortController();
                            reqobj.active = false;
                        }
                        else {
                            // console.warn('Browser doesn\'t support abort controller');
                        }
                    }
                }
                if (options.url !== reqobj.url) {
                    if (typeof reqobj["abortcontroller"] !== "undefined" &&
                        reqobj["abortcontroller"] &&
                        typeof reqobj["abortcontroller"]["signal"] !== "undefined") {
                        options["signal"] = reqobj["abortcontroller"]["signal"];
                    }
                    reqobj.url = this.CompileUrl(options);
                    reqobj.active = true;
                    reqobj.promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var delay;
                        var _this = this;
                        return __generator(this, function (_a) {
                            delay = typeof options.requestdelay === "number" ? options.requestdelay : 0;
                            if (reqobj.delaytimer !== null) {
                                window.clearTimeout(reqobj.delaytimer);
                                reqobj.delaytimer = null;
                            }
                            reqobj.delaytimer = window.setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var doFetchRequest, response, _a, savedToCache, err_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 6, , 7]);
                                            doFetchRequest = !reqobj.cache.usecache;
                                            response = null;
                                            if (reqobj.cache.usecache) {
                                                response = this.getResponseFromCache(reqobj);
                                                if (response == null) {
                                                    doFetchRequest = true;
                                                }
                                            }
                                            if (!doFetchRequest) return [3 /*break*/, 2];
                                            return [4 /*yield*/, fetch(reqobj.url, fetchoptions)];
                                        case 1:
                                            response = _b.sent();
                                            _b.label = 2;
                                        case 2:
                                            reqobj.active = false;
                                            if (!(doFetchRequest &&
                                                fetchoptions["headers"] &&
                                                fetchoptions["headers"]["Content-Type"] &&
                                                fetchoptions["headers"]["Content-Type"].indexOf("json"))) return [3 /*break*/, 4];
                                            _a = reqobj;
                                            return [4 /*yield*/, response.json()];
                                        case 3:
                                            _a.result = _b.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            reqobj.result = response;
                                            _b.label = 5;
                                        case 5:
                                            reqobj.finished = true;
                                            savedToCache = this.saveResponseToCache(reqobj);
                                            resolve(reqobj.result);
                                            return [3 /*break*/, 7];
                                        case 6:
                                            err_1 = _b.sent();
                                            reqobj.active = false;
                                            console.error(err_1);
                                            reject(reqobj);
                                            return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }); }, delay);
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/, reqobj.promise];
                }
                else if (reqobj.finished && reqobj.result !== null) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                resolve(reqobj.result);
                                return [2 /*return*/];
                            });
                        }); })];
                }
                else if (reqobj["promise"] && reqobj.active) {
                    return [2 /*return*/, reqobj["promise"]];
                }
                return [2 /*return*/, null];
            });
        });
    };
    FetchManager.prototype.GetScript = function (url) {
        var getScriptPromise = new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = url;
        });
        return getScriptPromise;
    };
    FetchManager.prototype.CompileUrl = function (options) {
        var url = options.url;
        var querystring = typeof options.querystring === "string"
            ? options.querystring
            : this.ObjToQueryString(options.querystring);
        url += (url.indexOf("?") === -1 ? "?" : "") + querystring;
        return url;
    };
    FetchManager.prototype.getRequestObj = function (key, options) {
        if (typeof this.requests[key] === "undefined") {
            this.requests[key] = {
                key: key,
                url: "",
                cache: this.getRequestCacheOptions(options),
                options: options,
                active: false,
                finished: false,
                result: null,
                promise: null,
                abortcontroller: typeof window["AbortController"] === "function"
                    ? new AbortController()
                    : null,
                delaytimer: null,
            };
        }
        return this.requests[key];
    };
    FetchManager.prototype.getResponseFromCache = function (reqobj) {
        var storedResponse = storageManager.Get(reqobj.cache.cachekey);
        var goodResult = this.validResponse(storedResponse);
        if (!goodResult) {
            return null;
        }
        return storedResponse;
    };
    FetchManager.prototype.validResponse = function (result) {
        var isValidResult = result != null &&
            (typeof result === "string" ||
                (typeof result === "object" && Object.keys(result).length > 0) ||
                (typeof result === "object" && typeof result.length === "number"));
        return isValidResult;
    };
    FetchManager.prototype.saveResponseToCache = function (reqobj) {
        if (reqobj.cache.usecache !== true || !reqobj.result) {
            return false;
        }
        var goodResult = this.validResponse(reqobj.result);
        if (!goodResult) {
            console.info("Result was not accepted so it is not saved to cache", reqobj);
            return false;
        }
        reqobj.cache.iscached = true;
        try {
            storageManager.Set(reqobj.cache.cachekey, reqobj.result, reqobj.cache.pemanent);
        }
        catch (_a) {
            console.error("Unable to save");
            return false;
        }
    };
    FetchManager.prototype.parseFetchOptions = function (options) {
        var fetchoptions = typeof options["fetchoptions"] !== "undefined"
            ? options["fetchoptions"]
            : {};
        fetchoptions = __assign(__assign({}, this.defaultFetchOptions), fetchoptions);
        return fetchoptions;
    };
    FetchManager.prototype.getRequestCacheOptions = function (options) {
        var cacheOptions = {
            pemanent: typeof options.cache === "object" &&
                typeof options.cache.pemanent === "boolean" &&
                options.cache.pemanent === true,
            usecache: typeof options.cache === "boolean"
                ? options.cache
                : typeof options.cache === "object" &&
                    typeof options.cache.usecache === "boolean" &&
                    options.cache.usecache === true,
            cachekey: typeof options.cache === "object" &&
                typeof options.cache.cachekey === "string" &&
                options.cache.cachekey.length !== 0
                ? options.cache.cachekey
                : this.getCacheKey(options),
            iscached: false,
        };
        return cacheOptions;
    };
    FetchManager.prototype.getCacheKey = function (options) {
        var reqkey = this.getKey(options);
        var cacheKey = reqkey + this.CompileUrl(options);
        return cacheKey;
    };
    FetchManager.prototype.getKey = function (options) {
        return options["key"] ? options["key"] : this.KeyFromOptions(options);
    };
    FetchManager.prototype.KeyFromOptions = function (options) {
        var url = this.CompileUrl(options);
        return url.substring(0, url.indexOf("?") > 0 ? url.indexOf("?") : url.length);
    };
    return FetchManager;
}());
exports["default"] = FetchManager;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FetchManager_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24);
/* harmony import */ var _FetchManager_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_FetchManager_ts__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_FetchManager_ts__WEBPACK_IMPORTED_MODULE_0___default()));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map