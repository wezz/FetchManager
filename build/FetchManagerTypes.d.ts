export default class FetchManager {
  constructor();
  ObjToQueryString(params: object): string;
  Fetch(options: IFetchManagerOption): Promise<any|null>;
  GetScript(url: string) : Promise<void>;
  CompileUrl(options: IFetchManagerOption): string;
  KeyFromOptions(options: IFetchManagerOption): string;
}

export interface FetchManagerClass {
  constructor();
  ObjToQueryString(params: object): string;
  Fetch(options: IFetchManagerOption): Promise<any|null>;
  GetScript(url: string) : Promise<void>;
  CompileUrl(options: IFetchManagerOption): string;
  KeyFromOptions(options: IFetchManagerOption): string;
}


export interface IFetchManagerRequestObject {
  key: string;
  url: string;
  options: IFetchManagerOption;
  active: boolean;
  finished?: boolean;
  cache: IFetchManagerCacheOption;
  result?: any;
  promise?: any;
  abortcontroller?: any;
  delaytimer?: number | null;
}

export interface IFetchManagerOption {
  key?: string;
  url: string;
  querystring?: object | string;
  requestdelay?: number;
  cache?: boolean | IFetchManagerCacheOption;
  fetchoptions?: RequestInit;
}

export interface IFetchManagerCacheOption {
  usecache: boolean;
  pemanent: boolean;
  cachekey: string;
  iscached?: boolean;
}
