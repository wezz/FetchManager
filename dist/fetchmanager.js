var m = Object.defineProperty;
var g = (n, e, t) => e in n ? m(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var i = (n, e, t) => (g(n, typeof e != "symbol" ? e + "" : e, t), t);
var y = Object.defineProperty, b = (n, e, t) => e in n ? y(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, w = (n, e, t) => (b(n, typeof e != "symbol" ? e + "" : e, t), t);
class S {
  constructor(e = "cache") {
    w(this, "prefix"), this.prefix = e;
  }
  getStorageMedium(e = !0) {
    return typeof window > "u" || typeof window.localStorage > "u" ? null : e ? window.localStorage : window.sessionStorage;
  }
  Has(e) {
    return typeof this.Get(`${this.prefix}-${e}`) < "u";
  }
  Get(e) {
    const t = this.getStorageMedium(!1), s = this.getStorageMedium(!0);
    let r = !1, o = null;
    if (t && s) {
      try {
        o = t.getItem(`${this.prefix}-${e}`), o = this.toJSONIfJSON(o), r = o !== null;
      } catch {
      }
      if (!r)
        try {
          o = s.getItem(`${this.prefix}-${e}`), o = this.toJSONIfJSON(o), r = o !== null;
        } catch {
        }
    }
    return o;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, t, s = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, t, s);
  }
  Set(e, t, s = !0) {
    const r = this.getStorageMedium(s);
    let o = !1;
    if (r) {
      typeof t == "object" && (t = JSON.stringify(t));
      try {
        r.setItem(`${this.prefix}-${e}`, t), o = !0;
      } catch (a) {
        console.error("Unable to save object", a);
      }
    }
    return o;
  }
  Remove(e) {
    const t = this.getStorageMedium(!0), s = this.getStorageMedium(!1);
    t && t.removeItem(`${this.prefix}-${e}`), s && s.removeItem(`${this.prefix}-${e}`);
  }
}
var N = Object.defineProperty, R = (n, e, t) => e in n ? N(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, u = (n, e, t) => (R(n, typeof e != "symbol" ? e + "" : e, t), t);
class v {
  constructor(e = "", t = "", s = null) {
    if (u(this, "storeNamespace", "windowReferenceStore"), u(this, "storeName", ""), u(this, "root", typeof window < "u" ? window : typeof global < "u" ? global : typeof document < "u" ? document : {}), t ? this.storeNamespace = t : console.info("It's recommended to assign a namespace for your stores"), e)
      this.storeName = e;
    else {
      console.error(
        "A store name needs to be specified. Initiation aborted in WindowReferenceStore"
      );
      return;
    }
    s !== null && (this.root = s), this.registerGlobalReferences();
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
  set(e, t, s = !1) {
    if (this.has(e) && !s)
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
const f = new S("fetchmanager"), O = new v("requests", "fetchmanagerstore");
class $ {
  constructor() {
    i(this, "moduleName", "FetchManager");
    i(this, "requestStore", O);
    i(this, "defaultOptions", {
      json: !0
    });
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
    const t = { ...this.defaultOptions, ...e };
    if (!t.url)
      return console.error("Need a url to do a request"), null;
    const s = this.getKey(t), r = this.getRequestObj(s, t);
    let o = this.parseFetchOptions(t);
    if (t.json && !o.headers) {
      const a = new Headers(o.headers);
      a.has("Content-Type") || (a.append("Content-Type", "application/json"), o.headers = a);
    }
    return this.debug(r.debug, "Reqobj", r), r.active && t.url !== r.url && typeof window.AbortController < "u" && r.abortcontroller && typeof r.abortcontroller.abort == "function" && (r.abortcontroller.abort(), r.abortcontroller = new AbortController(), console.info("Previous request was cancelled", r), this.debug(r.debug, "Previous request was cancelled", r), r.active = !1), t.url !== r.url ? (typeof r.abortcontroller < "u" && r.abortcontroller && typeof r.abortcontroller.signal < "u" && (t.signal = r.abortcontroller.signal), r.url = this.CompileUrl(t), r.active = !0, r.promise = new Promise(async (a, d) => {
      const h = typeof t.requestdelay == "number" ? t.requestdelay : 0;
      r.delaytimer !== null && (window.clearTimeout(r.delaytimer), r.delaytimer = null), this.debug(r.debug, "Request will be delayed by " + h + "ms", r), r.delaytimer = window.setTimeout(async () => {
        try {
          let l = !r.cache.usecache, c = null;
          r.cache.usecache && (c = this.getResponseFromCache(r), this.debug(r.debug, "Response from cache ", c), c == null && (l = !0)), l && (c = await fetch(r.url, o), this.debug(r.debug, "Responses object from fetch", c)), console.log("response", c), r.active = !1;
          const p = ((o.headers ?? "")["Content-Type"] ?? "").toLocaleLowerCase();
          this.debug(r.debug, "requestContentType ", p), this.debug(r.debug, "Returning response object", c), r.result = c.clone(), r.finished = !0, this.saveResponseToCache(r), a(r.result.clone());
        } catch (l) {
          r.active = !1, console.error(l), d(r);
        }
      }, h);
    }), r.promise) : r.finished && r.result !== null ? new Promise(async (a) => {
      a(r.result.clone());
    }) : r.promise && r.active ? r.promise : null;
  }
  GetScript(e) {
    return new Promise((s, r) => {
      const o = document.createElement("script");
      document.body.appendChild(o), o.onload = s, o.onerror = r, o.async = !0, o.src = e;
    });
  }
  CompileUrl(e) {
    let t = e.url;
    const s = typeof e.querystring == "string" ? e.querystring + "" : this.ObjToQueryString(e.querystring);
    return t += (e.querystring && t.indexOf("?") === -1 ? "?" : "") + s, t;
  }
  getRequestObj(e, t) {
    if (!this.requestStore.has(e)) {
      const s = {
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
        debug: (t == null ? void 0 : t.debug) ?? !1
      };
      this.requestStore.set(e, s);
    }
    return this.requestStore.get(e);
  }
  getResponseFromCache(e) {
    const t = f.Get(e.cache.cachekey);
    return this.validResponse(t) ? t.clone() : null;
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
      return f.Set(
        e.cache.cachekey,
        e.result.clone(),
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
    return e.key ? e.key : this.CompileUrl(e);
  }
  debug(e, ...t) {
    e && console.debug(t);
  }
}
export {
  $ as FetchManager
};
