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
import StorageManager from "@wezz/store-manager/build/StoreManager";
//import StorageManager from "../../StoreManager/build/StoreManager";
const storageManager = new StorageManager("fetchmanager");
import { IFetchManagerRequestObject, IFetchManagerOption, IFetchManagerCacheOption } from "./FetchManagerTypes";
("use strict");
export default class FetchManager {
  public moduleName = "FetchManager";
  private requests = {};
  private defaultFetchOptions: RequestInit = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    headers: {
      "Content-Type": "application/json",
    },
  };
  constructor() {}

  public ObjToQueryString(params : Object) {
    if (typeof params !== "object") {
      return "";
    }
    return Object.keys(params)
      .map((key) => {
        if (Array.isArray(params[key])) {
          var splitParams = [];
          for (var i = 0; i < params[key].length; i++) {
            splitParams.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(params[key][i])}`
            );
          }
          return splitParams.join("&");
        }
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
  }

  public async Fetch(options: IFetchManagerOption) {
    if (!options.url) {
      console.error("Need a url to do a request");
      return null;
    }
    const key = this.getKey(options);
    const reqobj = this.getRequestObj(key, options);
    let fetchoptions = this.parseFetchOptions(options);

    if (reqobj.active) {
      if (options.url !== reqobj.url) {
        if (
          typeof window["AbortController"] !== "undefined" &&
          reqobj["abortcontroller"] &&
          typeof reqobj["abortcontroller"]["abort"] === "function"
        ) {
          // console.info('Request was aborted', reqobj);
          reqobj["abortcontroller"].abort();
          reqobj["abortcontroller"] = new AbortController();
          reqobj.active = false;
        } else {
          // console.warn('Browser doesn\'t support abort controller');
        }
      }
    }
    if (options.url !== reqobj.url) {
      if (
        typeof reqobj["abortcontroller"] !== "undefined" &&
        reqobj["abortcontroller"] &&
        typeof reqobj["abortcontroller"]["signal"] !== "undefined"
      ) {
        options["signal"] = reqobj["abortcontroller"]["signal"];
      }
      reqobj.url = this.CompileUrl(options);
      reqobj.active = true;
      reqobj.promise = new Promise(async (resolve, reject) => {
        const delay =
          typeof options.requestdelay === "number" ? options.requestdelay : 0;
        if (reqobj.delaytimer !== null) {
          window.clearTimeout(reqobj.delaytimer);
          reqobj.delaytimer = null;
        }
        reqobj.delaytimer = window.setTimeout(async () => {
          try {
            let doFetchRequest = !reqobj.cache.usecache;
            let response = null;
            if (reqobj.cache.usecache) {
              response = this.getResponseFromCache(reqobj);
              if (response == null) {
                doFetchRequest = true;
              }
            }
            if (doFetchRequest) {
              response = await fetch(reqobj.url, fetchoptions);
            }
            reqobj.active = false;
            if (
              doFetchRequest &&
              fetchoptions["headers"] &&
              fetchoptions["headers"]["Content-Type"] &&
              fetchoptions["headers"]["Content-Type"].indexOf("json")
            ) {
              reqobj.result = await response.json();
            } else {
              reqobj.result = response;
            }
            reqobj.finished = true;

            const savedToCache = this.saveResponseToCache(reqobj);

            resolve(reqobj.result);
          } catch (err) {
            reqobj.active = false;

            console.error(err);
            reject(reqobj);
          }
        }, delay);
      });
      return reqobj.promise;
    } else if (reqobj.finished && reqobj.result !== null) {
      return new Promise(async (resolve, reject) => {
        resolve(reqobj.result);
      });
    } else if (reqobj["promise"] && reqobj.active) {
      return reqobj["promise"];
    }
    return null;
  }

  public GetScript(url: string) {
    const getScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = url;
    });
    return getScriptPromise;
  }

  public CompileUrl(options: IFetchManagerOption) {
    let url = options.url;
    const querystring =
      typeof options.querystring === "string"
        ? options.querystring
        : this.ObjToQueryString(options.querystring);
    url += (url.indexOf("?") === -1 ? "?" : "") + querystring;
    return url;
  }

  private getRequestObj(key: string, options: IFetchManagerOption) {
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
        abortcontroller:
          typeof window["AbortController"] === "function"
            ? new AbortController()
            : null,
        delaytimer: null,
      } as IFetchManagerRequestObject;
    }
    return this.requests[key] as IFetchManagerRequestObject;
  }

  private getResponseFromCache(reqobj: IFetchManagerRequestObject) {
    const storedResponse = storageManager.Get(reqobj.cache.cachekey);
    let goodResult = this.validResponse(storedResponse);
    if (!goodResult) {
      return null;
    }
    return storedResponse;
  }

  private validResponse(result: any) {
    const isValidResult =
      result != null &&
      (typeof result === "string" ||
        (typeof result === "object" && Object.keys(result).length > 0) ||
        (typeof result === "object" && typeof result.length === "number"));
    return isValidResult;
  }
  private saveResponseToCache(reqobj: IFetchManagerRequestObject) {
    if (reqobj.cache.usecache !== true || !reqobj.result) {
      return false;
    }
    let goodResult = this.validResponse(reqobj.result);
    if (!goodResult) {
      console.info(
        "Result was not accepted so it is not saved to cache",
        reqobj
      );
      return false;
    }
    reqobj.cache.iscached = true;
    try {
      storageManager.Set(
        reqobj.cache.cachekey,
        reqobj.result,
        reqobj.cache.pemanent
      );
    } catch {
      console.error("Unable to save");
      return false;
    }
  }

  private parseFetchOptions(options: IFetchManagerOption) {
    let fetchoptions =
      typeof options["fetchoptions"] !== "undefined"
        ? options["fetchoptions"]
        : {};
    fetchoptions = { ...this.defaultFetchOptions, ...fetchoptions };
    return fetchoptions;
  }
  private getRequestCacheOptions(options: IFetchManagerOption) {
    const cacheOptions = {
      pemanent:
        typeof options.cache === "object" &&
        typeof options.cache.pemanent === "boolean" &&
        options.cache.pemanent === true,
      usecache:
        typeof options.cache === "boolean"
          ? options.cache
          : typeof options.cache === "object" &&
            typeof options.cache.usecache === "boolean" &&
            options.cache.usecache === true,
      cachekey:
        typeof options.cache === "object" &&
        typeof options.cache.cachekey === "string" &&
        options.cache.cachekey.length !== 0
          ? options.cache.cachekey
          : this.getCacheKey(options),
      iscached: false,
    } as IFetchManagerCacheOption;
    return cacheOptions as IFetchManagerCacheOption;
  }
  private getCacheKey(options: IFetchManagerOption) {
    const reqkey = this.getKey(options);
    const cacheKey = reqkey + this.CompileUrl(options);
    return cacheKey;
  }
  private getKey(options: IFetchManagerOption) {
    return options["key"] ? options["key"] : this.KeyFromOptions(options);
  }
  public KeyFromOptions(options: IFetchManagerOption) {
    const url = this.CompileUrl(options);
    return url.substring(
      0,
      url.indexOf("?") > 0 ? url.indexOf("?") : url.length
    );
  }
}

