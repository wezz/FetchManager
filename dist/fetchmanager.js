var m = Object.defineProperty;
var g = (o, e, r) => e in o ? m(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r;
var i = (o, e, r) => (g(o, typeof e != "symbol" ? e + "" : e, r), r);
var y = Object.defineProperty, p = (o, e, r) => e in o ? y(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r, b = (o, e, r) => (p(o, typeof e != "symbol" ? e + "" : e, r), r);
class w {
  constructor(e = "cache") {
    b(this, "prefix"), this.prefix = e;
  }
  getStorageMedium(e = !0) {
    return typeof window > "u" || typeof window.localStorage > "u" ? null : e ? window.localStorage : window.sessionStorage;
  }
  Has(e) {
    return typeof this.Get(`${this.prefix}-${e}`) < "u";
  }
  Get(e) {
    const r = this.getStorageMedium(!1), t = this.getStorageMedium(!0);
    let a = !1, s = null;
    if (r && t) {
      try {
        s = r.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), a = s !== null;
      } catch {
      }
      if (!a)
        try {
          s = t.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), a = s !== null;
        } catch {
        }
    }
    return s;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, r, t = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, r, t);
  }
  Set(e, r, t = !0) {
    const a = this.getStorageMedium(t);
    let s = !1;
    if (a) {
      typeof r == "object" && (r = JSON.stringify(r));
      try {
        a.setItem(`${this.prefix}-${e}`, r), s = !0;
      } catch (l) {
        console.error("Unable to save object", l);
      }
    }
    return s;
  }
  Remove(e) {
    const r = this.getStorageMedium(!0), t = this.getStorageMedium(!1);
    r && r.removeItem(`${this.prefix}-${e}`), t && t.removeItem(`${this.prefix}-${e}`);
  }
}
var S = Object.defineProperty, N = (o, e, r) => e in o ? S(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r, u = (o, e, r) => (N(o, typeof e != "symbol" ? e + "" : e, r), r);
class R {
  constructor(e = "", r = "", t = null) {
    if (u(this, "storeNamespace", "windowReferenceStore"), u(this, "storeName", ""), u(this, "root", typeof window < "u" ? window : typeof global < "u" ? global : typeof document < "u" ? document : {}), r ? this.storeNamespace = r : console.info("It's recommended to assign a namespace for your stores"), e)
      this.storeName = e;
    else {
      console.error(
        "A store name needs to be specified. Initiation aborted in WindowReferenceStore"
      );
      return;
    }
    t !== null && (this.root = t), this.registerGlobalReferences();
  }
  registerGlobalReferences() {
    typeof this.root[this.storeNamespace] > "u" && (this.root[this.storeNamespace] = {}), typeof this.root[this.storeNamespace][this.storeName] > "u" && (this.root[this.storeNamespace][this.storeName] = {});
  }
  has(e) {
    return e ? typeof this.root[this.storeNamespace][this.storeName][e] < "u" : (console.log(
      `Attempted to fetch an empty key. Reference store namespace: ${this.storeNamespace}. Reference store name: ${this.storeName}`
    ), !1);
  }
  get(e) {
    return this.has(e) ? this.root[this.storeNamespace][this.storeName][e] : (console.log(
      `Could not find reference ${e} in store ${this.storeNamespace} ${this.storeName}`
    ), !1);
  }
  set(e, r, t = !1) {
    if (this.has(e) && !t)
      return console.warn(
        `Reference '${e}' already exists in store '${this.storeName}' and override wasn't enabled`
      ), !1;
    if (typeof r > "u")
      return console.error(
        `Can't register a undefined object to store ${this.storeName}`
      ), !1;
    try {
      return this.root[this.storeNamespace][this.storeName][e] = r, !0;
    } catch {
      return !1;
    }
  }
  remove(e) {
    return this.has(e) ? delete this.root[this.storeNamespace][this.storeName][e] : !1;
  }
}
const f = new w("fetchmanager"), v = new R("requests", "fetchmanagerstore");
class C {
  constructor() {
    i(this, "moduleName", "FetchManager");
    i(this, "requestStore", v);
    i(this, "defaultFetchOptions", {
      method: "GET",
      // *GET, POST, PUT, DELETE, etc.
      mode: "cors"
      // no-cors, cors, *same-origin
      //headers: {},
    });
  }
  ObjToQueryString(e) {
    return typeof e != "object" ? "" : new URLSearchParams(e).toString();
  }
  async Fetch(e) {
    if (!e.url)
      return console.error("Need a url to do a request"), null;
    const r = this.getKey(e), t = this.getRequestObj(r, e);
    let a = this.parseFetchOptions(e);
    if (e.json && !a.headers) {
      const s = new Headers(a.headers);
      s.has("Content-Type") || (s.append("Content-Type", "application/json"), a.headers = s);
    }
    return this.debug(t.debug, "Reqobj", t), t.active && e.url !== t.url && typeof window.AbortController < "u" && t.abortcontroller && typeof t.abortcontroller.abort == "function" && (t.abortcontroller.abort(), t.abortcontroller = new AbortController(), console.info("Previous request was cancelled", t), this.debug(t.debug, "Previous request was cancelled", t), t.active = !1), e.url !== t.url ? (typeof t.abortcontroller < "u" && t.abortcontroller && typeof t.abortcontroller.signal < "u" && (e.signal = t.abortcontroller.signal), t.url = this.CompileUrl(e), t.active = !0, t.promise = new Promise(async (s, l) => {
      const h = typeof e.requestdelay == "number" ? e.requestdelay : 0;
      t.delaytimer !== null && (window.clearTimeout(t.delaytimer), t.delaytimer = null), this.debug(t.debug, "Request will be delayed by " + h + "ms", t), t.delaytimer = window.setTimeout(async () => {
        try {
          let c = !t.cache.usecache, n = null;
          t.cache.usecache && (n = this.getResponseFromCache(t), this.debug(t.debug, "Response from cache ", n), n == null && (c = !0)), c && (n = await fetch(t.url, a), this.debug(t.debug, "Responses object from fetch", n)), t.active = !1;
          const d = ((a.headers ?? "")["Content-Type"] ?? "").toLocaleLowerCase();
          this.debug(t.debug, "requestContentType ", d), this.debug(t.debug, "Returning response object", n), t.result = n, t.finished = !0, this.saveResponseToCache(t), s(t.result);
        } catch (c) {
          t.active = !1, console.error(c), l(t);
        }
      }, h);
    }), t.promise) : t.finished && t.result !== null ? new Promise(async (s) => {
      s(t.result);
    }) : t.promise && t.active ? t.promise : null;
  }
  GetScript(e) {
    return new Promise((t, a) => {
      const s = document.createElement("script");
      document.body.appendChild(s), s.onload = t, s.onerror = a, s.async = !0, s.src = e;
    });
  }
  CompileUrl(e) {
    let r = e.url;
    const t = typeof e.querystring == "string" ? e.querystring + "" : this.ObjToQueryString(e.querystring);
    return r += (e.querystring && r.indexOf("?") === -1 ? "?" : "") + t, r;
  }
  getRequestObj(e, r) {
    if (!this.requestStore.has(e)) {
      const t = {
        key: e,
        url: "",
        cache: this.getRequestCacheOptions(r),
        options: r,
        active: !1,
        finished: !1,
        result: null,
        promise: null,
        abortcontroller: typeof window.AbortController == "function" ? new AbortController() : null,
        delaytimer: null,
        debug: (r == null ? void 0 : r.debug) ?? !1
      };
      this.requestStore.set(e, t);
    }
    return this.requestStore.get(e);
  }
  getResponseFromCache(e) {
    const r = f.Get(e.cache.cachekey);
    return this.validResponse(r) ? r : null;
  }
  validResponse(e) {
    return e != null && (typeof e == "string" || typeof e == "object" && Object.keys(e).length > 0 || typeof e == "object" && typeof e.length == "number");
  }
  saveResponseToCache(e) {
    if (e.cache.usecache !== !0 || !e.result)
      return !1;
    let r = this.validResponse(e.result);
    if (this.debug(e.debug, "Storing response in cache ", e.result), !r)
      return console.info(
        "Result was not accepted so it is not saved to cache",
        e
      ), !1;
    e.cache.iscached = !0;
    try {
      return f.Set(
        e.cache.cachekey,
        e.result,
        e.cache.pemanent
      ), !0;
    } catch {
      return console.error("Unable to save"), !1;
    }
  }
  parseFetchOptions(e) {
    let r = typeof e.fetchoptions < "u" ? e.fetchoptions : {};
    return r = {
      ...this.defaultFetchOptions,
      ...r
    }, r;
  }
  getRequestCacheOptions(e) {
    return {
      pemanent: typeof e.cache == "object" && typeof e.cache.pemanent == "boolean" && e.cache.pemanent === !0,
      usecache: typeof e.cache == "boolean" ? e.cache : typeof e.cache == "object" && typeof e.cache.usecache == "boolean" && e.cache.usecache === !0,
      cachekey: typeof e.cache == "object" && typeof e.cache.cachekey == "string" && e.cache.cachekey.length !== 0 ? e.cache.cachekey : this.getCacheKey(e),
      iscached: !1
    };
  }
  getCacheKey(e) {
    return this.getKey(e) + this.CompileUrl(e);
  }
  getKey(e) {
    return e.key ? e.key : this.KeyFromOptions(e);
  }
  KeyFromOptions(e) {
    const r = this.CompileUrl(e);
    return r.substring(
      0,
      r.indexOf("?") > 0 ? r.indexOf("?") : r.length
    );
  }
  debug(e, ...r) {
    e && console.debug(r);
  }
}
export {
  C as FetchManager
};
