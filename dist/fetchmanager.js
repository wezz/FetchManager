var f = Object.defineProperty;
var d = (o, e, r) => e in o ? f(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r;
var i = (o, e, r) => (d(o, typeof e != "symbol" ? e + "" : e, r), r);
var y = Object.defineProperty, g = (o, e, r) => e in o ? y(o, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[e] = r, p = (o, e, r) => (g(o, typeof e != "symbol" ? e + "" : e, r), r);
class m {
  constructor(e = "cache") {
    p(this, "prefix"), this.prefix = e;
  }
  getStorageMedium(e = !0) {
    return e && typeof window.localStorage < "u" ? window.localStorage : e && typeof window.sessionStorage < "u" ? window.sessionStorage : null;
  }
  Has(e) {
    return typeof this.Get(`${this.prefix}-${e}`) < "u";
  }
  Get(e) {
    const r = this.getStorageMedium(!1), t = this.getStorageMedium(!0);
    let n = !1, c = null;
    if (r && t) {
      try {
        c = r.getItem(`${this.prefix}-${e}`), c = this.toJSONIfJSON(c), n = c !== null;
      } catch {
      }
      if (!n)
        try {
          c = t.getItem(`${this.prefix}-${e}`), c = this.toJSONIfJSON(c), n = c !== null;
        } catch {
        }
    }
    return c;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, r, t = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, r, t);
  }
  Set(e, r, t = !0) {
    const n = this.getStorageMedium(t);
    let c = !1;
    if (n) {
      typeof r == "object" && (r = JSON.stringify(r));
      try {
        n.setItem(`${this.prefix}-${e}`, r), c = !0;
      } catch (l) {
        console.error("Unable to save object", l);
      }
    }
    return c;
  }
  Remove(e) {
    const r = this.getStorageMedium(!0), t = this.getStorageMedium(!1);
    r && r.removeItem(`${this.prefix}-${e}`), t && t.removeItem(`${this.prefix}-${e}`);
  }
}
const u = new m("fetchmanager");
class S {
  constructor() {
    i(this, "moduleName", "FetchManager");
    //private requests: { [key: string]: IFetchManagerRequestObject } = {};
    i(this, "requestStore", {});
    // private requestStore = { [key: string]: IFetchManagerRequestObject } = {};
    i(this, "defaultFetchOptions", {
      method: "GET",
      // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.setStoreReference();
  }
  setStoreReference() {
  }
  getRequest(e) {
    return this.requestStore[e];
  }
  setRequest(e) {
    this.requestStore[e.key] = e;
  }
  hasRequest(e) {
    return !(typeof this.requestStore[e] > "u");
  }
  ObjToQueryString(e) {
    return typeof e != "object" ? "" : Object.keys(e).map((r) => {
      if (Array.isArray(e[r])) {
        for (var t = [], n = 0; n < e[r].length; n++)
          t.push(
            `${encodeURIComponent(r)}=${encodeURIComponent(e[r][n])}`
          );
        return t.join("&");
      }
      return encodeURIComponent(r) + "=" + encodeURIComponent(e[r]);
    }).join("&");
  }
  async Fetch(e) {
    if (!e.url)
      return console.error("Need a url to do a request"), null;
    const r = this.getKey(e), t = this.getRequestObj(r, e);
    let n = this.parseFetchOptions(e);
    return t.active && e.url !== t.url && typeof window.AbortController < "u" && t.abortcontroller && typeof t.abortcontroller.abort == "function" && (t.abortcontroller.abort(), t.abortcontroller = new AbortController(), t.active = !1), e.url !== t.url ? (typeof t.abortcontroller < "u" && t.abortcontroller && typeof t.abortcontroller.signal < "u" && (e.signal = t.abortcontroller.signal), t.url = this.CompileUrl(e), t.active = !0, t.promise = new Promise(async (c, l) => {
      const h = typeof e.requestdelay == "number" ? e.requestdelay : 0;
      t.delaytimer !== null && (window.clearTimeout(t.delaytimer), t.delaytimer = null), t.delaytimer = window.setTimeout(async () => {
        try {
          let s = !t.cache.usecache, a = null;
          t.cache.usecache && (a = this.getResponseFromCache(t), a == null && (s = !0)), s && (a = await fetch(t.url, n)), t.active = !1, t.result = await a, t.finished = !0, this.saveResponseToCache(t), c(t.result);
        } catch (s) {
          t.active = !1, console.error(s), l(t);
        }
      }, h);
    }), t.promise) : t.finished && t.result !== null ? new Promise(async (c) => {
      c(t.result);
    }) : t.promise && t.active ? t.promise : null;
  }
  GetScript(e) {
    return new Promise((t, n) => {
      const c = document.createElement("script");
      document.body.appendChild(c), c.onload = t, c.onerror = n, c.async = !0, c.src = e;
    });
  }
  CompileUrl(e) {
    let r = e.url;
    const t = typeof e.querystring == "string" ? e.querystring : this.ObjToQueryString(e.querystring);
    return r += (r.indexOf("?") === -1 ? "?" : "") + t, r;
  }
  getRequestObj(e, r) {
    if (!this.hasRequest(e)) {
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
        delaytimer: null
      };
      this.setRequest(t);
    }
    return this.getRequest(e);
  }
  getResponseFromCache(e) {
    const r = u.Get(e.cache.cachekey);
    return this.validResponse(r) ? r : null;
  }
  validResponse(e) {
    return e != null && (typeof e == "string" || typeof e == "object" && Object.keys(e).length > 0 || typeof e == "object" && typeof e.length == "number");
  }
  saveResponseToCache(e) {
    if (e.cache.usecache !== !0 || !e.result)
      return !1;
    if (!this.validResponse(e.result))
      return console.info(
        "Result was not accepted so it is not saved to cache",
        e
      ), !1;
    e.cache.iscached = !0;
    try {
      return u.Set(
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
}
export {
  S as FetchManager
};
