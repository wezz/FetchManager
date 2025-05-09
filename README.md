# Fetch Manager

This is a script to ease the use of making fetch requests.
It features the ability to stop consequetive requests, delay a request and parse querystrings from JSON.

## Installation

```
npm install @wezz/fetchmanager
```

## Usage

### Initialize Fetch Manager

```
import { FetchManager } from '@wezz/fetchmanager';
// On document ready
const response = fetchManager.Fetch({
    "url": "urlhere"
});
const data = response.json();
```

## Options

When doing a fetch request you should define a options object that looks like this:

```
{
    "key": "unique request key",
    "url": "https://requesturl.com"
    "querystring": { "querystringkey": "querystringvalue" },
    "requestdelay": 0,
    "cache": false,
    "fetchoptions": null,
    "json": true
}
```

_Note that the option fetchoptions is passed down directly to fetch._<br/>
[Click here for the fetch options documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options)

### Key

If a key is set then the "signal" will be stored and if another request is being sent with an identical key, the current request will be aborted.
So if you're doing requests related to a users input (typing in an input field) and sending a request per input, this would stop all the old requests and only deliver the last request made as to stop race conditions.

### Url

This is the URL you wish to fetch, without parameters

### Querystring

This can be empty, an object that will be parsed to a querystring, or just a string.

### Request delay

This delays a request with the specified amount of miliseconds.

### Cache

If this is enabled then any request will be cached in either local or session storage. Session storage is default.
You can either send in a boolean,
or you can send in an object like this

```
{ permanent: true, cachekey: 'myCacheKey' }
```

If permanent is set to true it will be stored in local storage.

### JSON

The JSON options will add the header "Content-Type": application/json and it is enabled by default.
If another content type header has been specified it will not override it.

Set this to false if you need to fetch any mimetype that is not json.

### Fetch options

Fetch options is standard fetch opions.
[Read more about fetch options on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options).

## Development & Demo

Clone this repo
Run
`npm install`

To run the interactive demo, run
`npm run demo`

## Breaking changes

In the Version 1 release the response is no longer automatically parsed to JSON.
Consumers of the package will get the regular response object back just as if they had used the native fetch function.
