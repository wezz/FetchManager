import { IFetchManagerOption } from "./FetchManagerTypes";
export default class FetchManager {
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
