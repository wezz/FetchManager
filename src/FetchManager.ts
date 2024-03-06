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
import { StoreManager } from "@wezz/store-manager";
import { WindowReferenceStore } from "@wezz/window-reference-store";

const storeManager = new StoreManager("fetchmanager");
const windowReferenceStore = new WindowReferenceStore("requests", "fetchmanagerstore");
import {
	IFetchManagerRequestObject,
	IFetchManagerOption,
	IFetchManagerCacheOption
} from "./FetchManagerTypes";
("use strict");
export default class FetchManager {
  public moduleName = "FetchManager";
  private requestStore = windowReferenceStore;
  private defaultOptions: IFetchManagerOption = {
    json: true,
  } as IFetchManagerOption;
  private defaultFetchOptions: RequestInit = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    //headers: {},
  };
  constructor() {}

  public ObjToQueryString(params: any) {
    if (typeof params !== "object") {
      return "";
    }
    const urlParams = new URLSearchParams(params);
    return urlParams.toString();
  }

  public async Fetch(initOptions: IFetchManagerOption) {
    const options = { ...this.defaultOptions, ...initOptions };
    if (!options.url) {
      console.error("Need a url to do a request");
      return null;
    }
    const key = this.getKey(options);
    const reqobj = this.getRequestObj(key, options);
    let fetchoptions = this.parseFetchOptions(options);

    if (options.json && !fetchoptions.headers) {
      const headers = new Headers(fetchoptions.headers);
      if (!headers.has("Content-Type")) {
        headers.append("Content-Type", "application/json");
        fetchoptions.headers = headers;
      }
    }

    this.debug(reqobj.debug, "Reqobj", reqobj);
    if (reqobj.active) {
      if (options.url !== reqobj.url) {
        if (
          typeof window["AbortController"] !== "undefined" &&
          reqobj["abortcontroller"] &&
          typeof reqobj["abortcontroller"]["abort"] === "function"
        ) {
          reqobj["abortcontroller"].abort();
          reqobj["abortcontroller"] = new AbortController();
          console.info("Previous request was cancelled", reqobj);
          this.debug(reqobj.debug, "Previous request was cancelled", reqobj);
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
        this.debug(
          reqobj.debug,
          "Request will be delayed by " + delay + "ms",
          reqobj
        );
        reqobj.delaytimer = window.setTimeout(async () => {
          try {
            let doFetchRequest = !reqobj.cache.usecache;
            let response = null;
            if (reqobj.cache.usecache) {
              response = this.getResponseFromCache(reqobj);
              this.debug(reqobj.debug, "Response from cache ", response);
              if (response == null) {
                doFetchRequest = true;
              }
            }
            if (doFetchRequest) {
              response = await fetch(reqobj.url, fetchoptions);
              this.debug(reqobj.debug, "Responses object from fetch", response);
            }
            reqobj.active = false;
            const requestContentType = (
              ((fetchoptions.headers ?? ("" as any))["Content-Type"] ??
                "") as string
            ).toLocaleLowerCase();
            this.debug(reqobj.debug, "requestContentType ", requestContentType);
            this.debug(reqobj.debug, "Returning response object", response);
            reqobj.result = response?.clone() ?? null;
            reqobj.finished = true;

            if (reqobj.cache.usecache) {
              await this.saveResponseToCache(reqobj);
            }

            resolve(reqobj.result.clone());
          } catch (err) {
            reqobj.active = false;

            console.error(err);
            reject(reqobj);
          }
        }, delay);
      });
      return reqobj.promise;
    } else if (reqobj.finished && reqobj.result !== null) {
      return new Promise(async (resolve) => {
        resolve(reqobj.result.clone());
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
        ? options.querystring + ""
        : this.ObjToQueryString(options.querystring);
    url +=
      (options.querystring && url.indexOf("?") === -1 ? "?" : "") + querystring;
    return url;
  }

  private getRequestObj(key: string, options: IFetchManagerOption) {
    if (!this.requestStore.has(key)) {
      const requestObj: IFetchManagerRequestObject = {
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
        debug: options?.debug ?? false,
      };
      this.requestStore.set(key, requestObj);
    }
    return this.requestStore.get(key);
  }

  private getResponseFromCache(reqobj: IFetchManagerRequestObject) {
    const storedResponse = storeManager.Get(reqobj.cache.cachekey);
    let goodResult = this.validResponse(storedResponse);
    if (!goodResult) {
      return null;
    }
    const artificialResponse = {
      body: function () {},
      bodyUsed: false,
      headers: {},
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: reqobj.url,
      clone: function () {
        return this;
      },
      text: () => {
        return new Promise((resolve) => {
          resolve(storedResponse);
        });
      },
      json: () => {
        return new Promise((resolve) => {
          resolve(storedResponse);
        });
      },
    };
    return artificialResponse;
  }

  private validResponse(result: any) {
    const isValidResult =
      result != null &&
      (typeof result === "string" || typeof result === "object");
    return isValidResult;
  }
  private async saveResponseToCache(reqobj: IFetchManagerRequestObject) {
    if (reqobj.cache.usecache !== true || !reqobj.result) {
      return false;
    }
    let goodResult = this.validResponse(reqobj.result);
    this.debug(reqobj.debug, "Storing response in cache ", reqobj.result);
    if (!goodResult) {
      console.info(
        "Result was not accepted so it is not saved to cache",
        reqobj
      );
      return false;
    }
    reqobj.cache.iscached = true;
    const content = await reqobj.result.clone().text();
    try {
      storeManager.Set(reqobj.cache.cachekey, content, reqobj.cache.permanent);
      return true;
    } catch {
      console.error("Unable to save result", reqobj);
      return false;
    }
  }

  private parseFetchOptions(options: IFetchManagerOption) {
    let fetchoptions =
      typeof options["fetchoptions"] !== "undefined"
        ? options["fetchoptions"]
        : {};
    fetchoptions = {
      ...this.defaultFetchOptions,
      ...fetchoptions,
    };
    return fetchoptions;
  }
  private getRequestCacheOptions(options: IFetchManagerOption) {
    const cacheOptions = {
      permanent:
        typeof options.cache === "object" &&
        ((typeof options.cache.permanent === "boolean" &&
          options.cache.permanent === true) ||
          (typeof options.cache.pemanent === "boolean" &&
            options.cache.pemanent === true)),
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
    return options["key"] ? options["key"] : this.CompileUrl(options);
  }

  private debug(showMessage: boolean | undefined, ...args: any[]) {
    if (showMessage) {
      console.debug(args);
    }
  }
}