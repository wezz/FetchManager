var m = Object.defineProperty;
var y = (o, e, t) => e in o ? m(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var i = (o, e, t) => (y(o, typeof e != "symbol" ? e + "" : e, t), t);
var g = Object.defineProperty, p = (o, e, t) => e in o ? g(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, b = (o, e, t) => (p(o, typeof e != "symbol" ? e + "" : e, t), t);
class w {
  constructor(e = "cache") {
    b(this, "prefix"), this.prefix = e;
  }
  getStorageMedium(e = !0) {
    return e && typeof window.localStorage < "u" ? window.localStorage : e && typeof window.sessionStorage < "u" ? window.sessionStorage : null;
  }
  Has(e) {
    return typeof this.Get(`${this.prefix}-${e}`) < "u";
  }
  Get(e) {
    const t = this.getStorageMedium(!1), r = this.getStorageMedium(!0);
    let a = !1, s = null;
    if (t && r) {
      try {
        s = t.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), a = s !== null;
      } catch {
      }
      if (!a)
        try {
          s = r.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), a = s !== null;
        } catch {
        }
    }
    return s;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, t, r = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, t, r);
  }
  Set(e, t, r = !0) {
    const a = this.getStorageMedium(r);
    let s = !1;
    if (a) {
      typeof t == "object" && (t = JSON.stringify(t));
      try {
        a.setItem(`${this.prefix}-${e}`, t), s = !0;
      } catch (l) {
        console.error("Unable to save object", l);
      }
    }
    return s;
  }
  Remove(e) {
    const t = this.getStorageMedium(!0), r = this.getStorageMedium(!1);
    t && t.removeItem(`${this.prefix}-${e}`), r && r.removeItem(`${this.prefix}-${e}`);
  }
}
var S = Object.defineProperty, N = (o, e, t) => e in o ? S(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, u = (o, e, t) => (N(o, typeof e != "symbol" ? e + "" : e, t), t);
class v {
  constructor(e = "", t = "", r = null) {
    if (u(this, "storeNamespace", "windowReferenceStore"), u(this, "storeName", ""), u(this, "root", typeof window < "u" ? window : typeof global < "u" ? global : typeof document < "u" ? document : {}), t ? this.storeNamespace = t : console.info("It's recommended to assign a namespace for your stores"), e)
      this.storeName = e;
    else {
      console.error(
        "A store name needs to be specified. Initiation aborted in WindowReferenceStore"
      );
      return;
    }
    r !== null && (this.root = r), this.registerGlobalReferences();
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
  set(e, t, r = !1) {
    if (this.has(e) && !r)
      return console.warn(
        `Reference '${e}' already exists in store '${this.storeName}' and override wasn't enabled`
      ), !1;
    if (typeof t > "u")
      return console.error(
        `Can't register a undefined object to store ${this.storeName}`
      ), !1;
    try {
      return this.root[this.storeNamespace][this.storeName][e] = t, !0;
    } catch {
      return !1;
    }
  }
  remove(e) {
    return this.has(e) ? delete this.root[this.storeNamespace][this.storeName][e] : !1;
  }
}
const d = new w("fetchmanager"), O = new v("requests", "fetchmanagerstore");
class C {
  constructor() {
    i(this, "moduleName", "FetchManager");
    i(this, "requestStore", O);
    i(this, "defaultFetchOptions", {
      method: "GET",
      // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  ObjToQueryString(e) {
    return typeof e != "object" ? "" : new URLSearchParams(e).toString();
  }
  async Fetch(e) {
    if (!e.url)
      return console.error("Need a url to do a request"), null;
    const t = this.getKey(e), r = this.getRequestObj(t, e);
    let a = this.parseFetchOptions(e);
    return this.debug(r.debug, "Reqobj", r), r.active && e.url !== r.url && typeof window.AbortController < "u" && r.abortcontroller && typeof r.abortcontroller.abort == "function" && (r.abortcontroller.abort(), r.abortcontroller = new AbortController(), console.info("Previous request was cancelled", r), this.debug(r.debug, "Previous request was cancelled", r), r.active = !1), e.url !== r.url ? (typeof r.abortcontroller < "u" && r.abortcontroller && typeof r.abortcontroller.signal < "u" && (e.signal = r.abortcontroller.signal), r.url = this.CompileUrl(e), r.active = !0, r.promise = new Promise(async (s, l) => {
      const h = typeof e.requestdelay == "number" ? e.requestdelay : 0;
      r.delaytimer !== null && (window.clearTimeout(r.delaytimer), r.delaytimer = null), this.debug(r.debug, "Request will be delayed by " + h + "ms", r), r.delaytimer = window.setTimeout(async () => {
        try {
          let c = !r.cache.usecache, n = null;
          r.cache.usecache && (n = this.getResponseFromCache(r), this.debug(r.debug, "Response from cache ", n), n == null && (c = !0)), c && (n = await fetch(r.url, a)), r.active = !1;
          const f = ((a.headers ?? "")["Content-Type"] ?? "").toLocaleLowerCase();
          this.debug(r.debug, "requestContentType ", f), r.returnrequest === !1 && c && f.indexOf("json") !== -1 ? r.result = await n.json() : r.result = n, r.finished = !0, this.saveResponseToCache(r), s(r.result);
        } catch (c) {
          r.active = !1, console.error(c), l(r);
        }
      }, h);
    }), r.promise) : r.finished && r.result !== null ? new Promise(async (s) => {
      s(r.result);
    }) : r.promise && r.active ? r.promise : null;
  }
  GetScript(e) {
    return new Promise((r, a) => {
      const s = document.createElement("script");
      document.body.appendChild(s), s.onload = r, s.onerror = a, s.async = !0, s.src = e;
    });
  }
  CompileUrl(e) {
    let t = e.url;
    const r = typeof e.querystring == "string" ? e.querystring + "" : this.ObjToQueryString(e.querystring);
    return t += (e.querystring && t.indexOf("?") === -1 ? "?" : "") + r, t;
  }
  getRequestObj(e, t) {
    if (!this.requestStore.has(e)) {
      const r = {
        key: e,
        url: "",
        cache: this.getRequestCacheOptions(t),
        options: t,
        active: !1,
        finished: !1,
        result: null,
        promise: null,
        abortcontroller: typeof window.AbortController == "function" ? new AbortController() : null,
        delaytimer: null,
        returnrequest: (t == null ? void 0 : t.returnrequest) ?? !1,
        debug: (t == null ? void 0 : t.debug) ?? !1
      };
      this.requestStore.set(e, r);
    }
    return this.requestStore.get(e);
  }
  getResponseFromCache(e) {
    const t = d.Get(e.cache.cachekey);
    return this.validResponse(t) ? t : null;
  }
  validResponse(e) {
    return e != null && (typeof e == "string" || typeof e == "object" && Object.keys(e).length > 0 || typeof e == "object" && typeof e.length == "number");
  }
  saveResponseToCache(e) {
    if (e.cache.usecache !== !0 || !e.result)
      return !1;
    let t = this.validResponse(e.result);
    if (this.debug(e.debug, "Storing response in cache ", e.result), !t)
      return console.info(
        "Result was not accepted so it is not saved to cache",
        e
      ), !1;
    e.cache.iscached = !0;
    try {
      return d.Set(
        e.cache.cachekey,
        e.result,
        e.cache.pemanent
      ), !0;
    } catch {
      return console.error("Unable to save"), !1;
    }
  }
  parseFetchOptions(e) {
    let t = typeof e.fetchoptions < "u" ? e.fetchoptions : {};
    return t = {
      ...this.defaultFetchOptions,
      ...t
    }, t;
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
    const t = this.CompileUrl(e);
    return t.substring(
      0,
      t.indexOf("?") > 0 ? t.indexOf("?") : t.length
    );
  }
  debug(e, ...t) {
    e && console.debug(t);
  }
}
export {
  C as FetchManager
};
