
export interface FetchManagerClass {
  constructor();
  ObjToQueryString(params: object): string;
  Fetch(options: IFetchManagerOption): Promise<Response>;
  GetScript(url: string) : Promise<void>;
  CompileUrl(options: IFetchManagerOption): string;
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
  abortcontroller?: AbortController | Undefined;
  delaytimer?: number | null;
  json?: boolean;
  debug?: boolean;
}

export interface IFetchManagerOption {
  key?: string;
  url: string;
  querystring?: object | string;
  requestdelay?: number;
  cache?: boolean | IFetchManagerCacheOption;
  fetchoptions?: RequestInit;
  signal?: AbortController.signal;
  json?: boolean;
  debug?: boolean;
}

export interface IFetchManagerCacheOption {
  usecache: boolean;
  permanent: boolean;
  pemanent: boolean; // Obsolete misspelling kept for legacy reasons
  cachekey: string;
  iscached?: boolean;
}
