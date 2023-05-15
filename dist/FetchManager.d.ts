import { IFetchManagerOption } from "./FetchManagerTypes";
export default class FetchManager {
    moduleName: string;
    private requestStore;
    private defaultFetchOptions;
    constructor();
    private setStoreReference;
    private getRequest;
    private setRequest;
    private hasRequest;
    ObjToQueryString(params: any): string;
    Fetch(options: IFetchManagerOption): Promise<any>;
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
    KeyFromOptions(options: IFetchManagerOption): string;
}
