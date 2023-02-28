var f = Object.defineProperty;
var d = (o, e, t) => e in o ? f(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var l = (o, e, t) => (d(o, typeof e != "symbol" ? e + "" : e, t), t);
var y = Object.defineProperty, g = (o, e, t) => e in o ? y(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, p = (o, e, t) => (g(o, typeof e != "symbol" ? e + "" : e, t), t);
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
    const t = this.getStorageMedium(!1), r = this.getStorageMedium(!0);
    let c = !1, n = null;
    if (t && r) {
      try {
        n = t.getItem(`${this.prefix}-${e}`), n = this.toJSONIfJSON(n), c = n !== null;
      } catch {
      }
      if (!c)
        try {
          n = r.getItem(`${this.prefix}-${e}`), n = this.toJSONIfJSON(n), c = n !== null;
        } catch {
        }
    }
    return n;
  }
  toJSONIfJSON(e) {
    return typeof e == "string" && (e.indexOf("{") === 0 || e.indexOf("[") === 0) && (e = JSON.parse(e)), e;
  }
  Save(e, t, r = !0) {
    console.warn("StoreManager.Save is deprecated"), this.Set(e, t, r);
  }
  Set(e, t, r = !0) {
    const c = this.getStorageMedium(r);
    let n = !1;
    if (c) {
      typeof t == "object" && (t = JSON.stringify(t));
      try {
        c.setItem(`${this.prefix}-${e}`, t), n = !0;
      } catch (i) {
        console.error("Unable to save object", i);
      }
    }
    return n;
  }
  Remove(e) {
    const t = this.getStorageMedium(!0), r = this.getStorageMedium(!1);
    t && t.removeItem(`${this.prefix}-${e}`), r && r.removeItem(`${this.prefix}-${e}`);
  }
}
const u = new m("fetchmanager");
class O {
  constructor() {
    l(this, "moduleName", "FetchManager");
    l(this, "requests", {});
    l(this, "defaultFetchOptions", {
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
    return typeof e != "object" ? "" : Object.keys(e).map((t) => {
      if (Array.isArray(e[t])) {
        for (var r = [], c = 0; c < e[t].length; c++)
          r.push(
            `${encodeURIComponent(t)}=${encodeURIComponent(e[t][c])}`
          );
        return r.join("&");
      }
      return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
    }).join("&");
  }
  async Fetch(e) {
    if (!e.url)
      return console.error("Need a url to do a request"), null;
    const t = this.getKey(e), r = this.getRequestObj(t, e);
    let c = this.parseFetchOptions(e);
    return r.active && e.url !== r.url && typeof window.AbortController < "u" && r.abortcontroller && typeof r.abortcontroller.abort == "function" && (r.abortcontroller.abort(), r.abortcontroller = new AbortController(), r.active = !1), e.url !== r.url ? (typeof r.abortcontroller < "u" && r.abortcontroller && typeof r.abortcontroller.signal < "u" && (e.signal = r.abortcontroller.signal), r.url = this.CompileUrl(e), r.active = !0, r.promise = new Promise(async (n, i) => {
      const h = typeof e.requestdelay == "number" ? e.requestdelay : 0;
      r.delaytimer !== null && (window.clearTimeout(r.delaytimer), r.delaytimer = null), r.delaytimer = window.setTimeout(async () => {
        try {
          let s = !r.cache.usecache, a = null;
          r.cache.usecache && (a = this.getResponseFromCache(r), a == null && (s = !0)), s && (a = await fetch(r.url, c)), r.active = !1, s && c.headers && c.headers["Content-Type"] && c.headers["Content-Type"].indexOf("json") ? r.result = await a.json() : r.result = a, r.finished = !0, this.saveResponseToCache(r), n(r.result);
        } catch (s) {
          r.active = !1, console.error(s), i(r);
        }
      }, h);
    }), r.promise) : r.finished && r.result !== null ? new Promise(async (n) => {
      n(r.result);
    }) : r.promise && r.active ? r.promise : null;
  }
  GetScript(e) {
    return new Promise((r, c) => {
      const n = document.createElement("script");
      document.body.appendChild(n), n.onload = r, n.onerror = c, n.async = !0, n.src = e;
    });
  }
  CompileUrl(e) {
    let t = e.url;
    const r = typeof e.querystring == "string" ? e.querystring : this.ObjToQueryString(e.querystring);
    return t += (t.indexOf("?") === -1 ? "?" : "") + r, t;
  }
  getRequestObj(e, t) {
    return typeof this.requests[e] > "u" && (this.requests[e] = {
      key: e,
      url: "",
      cache: this.getRequestCacheOptions(t),
      options: t,
      active: !1,
      finished: !1,
      result: null,
      promise: null,
      abortcontroller: typeof window.AbortController == "function" ? new AbortController() : null,
      delaytimer: null
    }), this.requests[e];
  }
  getResponseFromCache(e) {
    const t = u.Get(e.cache.cachekey);
    return this.validResponse(t) ? t : null;
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
}
export {
  O as FetchManager
};
