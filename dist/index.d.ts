declare class FetchManager {
    moduleName: string;
    private requestStore;
    private defaultOptions;
    private defaultFetchOptions;
    constructor();
    ObjToQueryString(params: any): string;
    Fetch(initOptions: IFetchManagerOption): Promise<any>;
    GetScript(url: string): Promise<unknown>;
    CompileUrl(options: IFetchManagerOption): string;
    private getRequestObj;
    private getResponseFromCache;
    private validResponse;
    private saveResponseToCache;
    private parseFetchOptions;
    private getRequestCacheOptions;
    private getCacheKey;
    private getKey;
    private debug;
}
export default FetchManager;

declare interface IFetchManagerCacheOption {
    usecache: boolean;
    permanent: boolean;
    pemanent: boolean;
    cachekey: string;
    iscached?: boolean;
}

declare interface IFetchManagerOption {
    key?: string;
    url: string;
    querystring?: object | string;
    requestdelay?: number;
    cache?: boolean | IFetchManagerCacheOption;
    fetchoptions?: RequestInit;
    signal?: AbortController["signal"];
    json?: boolean;
    debug?: boolean;
}

export { }
