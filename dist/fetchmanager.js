var p = Object.defineProperty;
var y = (a, e, t) => e in a ? p(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var i = (a, e, t) => (y(a, typeof e != "symbol" ? e + "" : e, t), t);
var g = Object.defineProperty, b = (a, e, t) => e in a ? g(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, w = (a, e, t) => (b(a, typeof e != "symbol" ? e + "" : e, t), t);
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
    const t = this.getStorageMedium(!1), o = this.getStorageMedium(!0);
    let r = !1, s = null;
    if (t && o) {
      try {
        s = t.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), r = s !== null;
      } catch {
      }
      if (!r)
        try {
          s = o.getItem(`${this.prefix}-${e}`), s = this.toJSONIfJSON(s), r = s !== null;
        } catch {
        }
    }
    return s;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, t, o = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, t, o);
  }
  Set(e, t, o = !0) {
    const r = this.getStorageMedium(o);
    let s = !1;
    if (r) {
      typeof t == "object" && (t = JSON.stringify(t));
      try {
        r.setItem(`${this.prefix}-${e}`, t), s = !0;
      } catch (n) {
        console.error("Unable to save object", n);
      }
    }
    return s;
  }
  Remove(e) {
    const t = this.getStorageMedium(!0), o = this.getStorageMedium(!1);
    t && t.removeItem(`${this.prefix}-${e}`), o && o.removeItem(`${this.prefix}-${e}`);
  }
}
var R = Object.defineProperty, N = (a, e, t) => e in a ? R(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, u = (a, e, t) => (N(a, typeof e != "symbol" ? e + "" : e, t), t);
class v {
  constructor(e = "", t = "", o = null) {
    if (u(this, "storeNamespace", "windowReferenceStore"), u(this, "storeName", ""), u(this, "root", typeof window < "u" ? window : typeof global < "u" ? global : typeof document < "u" ? document : {}), t ? this.storeNamespace = t : console.info("It's recommended to assign a namespace for your stores"), e)
      this.storeName = e;
    else {
      console.error(
        "A store name needs to be specified. Initiation aborted in WindowReferenceStore"
      );
      return;
    }
    o !== null && (this.root = o), this.registerGlobalReferences();
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
  set(e, t, o = !1) {
    if (this.has(e) && !o)
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
    const o = this.getKey(t), r = this.getRequestObj(o, t);
    let s = this.parseFetchOptions(t);
    if (t.json && !s.headers) {
      const n = new Headers(s.headers);
      n.has("Content-Type") || (n.append("Content-Type", "application/json"), s.headers = n);
    }
    return this.debug(r.debug, "Reqobj", r), r.active && t.url !== r.url && typeof window.AbortController < "u" && r.abortcontroller && typeof r.abortcontroller.abort == "function" && (r.abortcontroller.abort(), r.abortcontroller = new AbortController(), console.info("Previous request was cancelled", r), this.debug(r.debug, "Previous request was cancelled", r), r.active = !1), t.url !== r.url ? (typeof r.abortcontroller < "u" && r.abortcontroller && typeof r.abortcontroller.signal < "u" && (t.signal = r.abortcontroller.signal), r.url = this.CompileUrl(t), r.active = !0, r.promise = new Promise(async (n, d) => {
      const h = typeof t.requestdelay == "number" ? t.requestdelay : 0;
      r.delaytimer !== null && (window.clearTimeout(r.delaytimer), r.delaytimer = null), this.debug(
        r.debug,
        "Request will be delayed by " + h + "ms",
        r
      ), r.delaytimer = window.setTimeout(async () => {
        try {
          let l = !r.cache.usecache, c = null;
          r.cache.usecache && (c = this.getResponseFromCache(r), this.debug(r.debug, "Response from cache ", c), c == null && (l = !0)), l && (c = await fetch(r.url, s), this.debug(r.debug, "Responses object from fetch", c)), r.active = !1;
          const m = ((s.headers ?? "")["Content-Type"] ?? "").toLocaleLowerCase();
          this.debug(r.debug, "requestContentType ", m), this.debug(r.debug, "Returning response object", c), r.result = (c == null ? void 0 : c.clone()) ?? null, r.finished = !0, r.cache.usecache && await this.saveResponseToCache(r), n(r.result.clone());
        } catch (l) {
          r.active = !1, console.error(l), d(r);
        }
      }, h);
    }), r.promise) : r.finished && r.result !== null ? new Promise(async (n) => {
      n(r.result.clone());
    }) : r.promise && r.active ? r.promise : null;
  }
  GetScript(e) {
    return new Promise((o, r) => {
      const s = document.createElement("script");
      document.body.appendChild(s), s.onload = o, s.onerror = r, s.async = !0, s.src = e;
    });
  }
  CompileUrl(e) {
    let t = e.url;
    const o = typeof e.querystring == "string" ? e.querystring + "" : this.ObjToQueryString(e.querystring);
    return t += (e.querystring && t.indexOf("?") === -1 ? "?" : "") + o, t;
  }
  getRequestObj(e, t) {
    if (!this.requestStore.has(e)) {
      const o = {
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
      this.requestStore.set(e, o);
    }
    return this.requestStore.get(e);
  }
  getResponseFromCache(e) {
    const t = f.Get(e.cache.cachekey);
    return this.validResponse(t) ? {
      body: function() {
      },
      bodyUsed: !1,
      headers: {},
      redirected: !1,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: e.url,
      clone: function() {
        return this;
      },
      text: () => new Promise((s) => {
        s(t);
      }),
      json: () => new Promise((s) => {
        s(t);
      })
    } : null;
  }
  validResponse(e) {
    return e != null && (typeof e == "string" || typeof e == "object");
  }
  async saveResponseToCache(e) {
    if (e.cache.usecache !== !0 || !e.result)
      return !1;
    let t = this.validResponse(e.result);
    if (this.debug(e.debug, "Storing response in cache ", e.result), !t)
      return console.info(
        "Result was not accepted so it is not saved to cache",
        e
      ), !1;
    e.cache.iscached = !0;
    const o = await e.result.clone().text();
    try {
      return f.Set(e.cache.cachekey, o, e.cache.permanent), !0;
    } catch {
      return console.error("Unable to save result", e), !1;
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
      permanent: typeof e.cache == "object" && (typeof e.cache.permanent == "boolean" && e.cache.permanent === !0 || typeof e.cache.pemanent == "boolean" && e.cache.pemanent === !0),
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
