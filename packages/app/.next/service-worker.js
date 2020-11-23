try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const a=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class c{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let a,c=i&&i.handler;if(!c&&this.s&&(c=this.s),c){try{a=c.handle({url:s,request:e,event:t,params:n})}catch(e){a=Promise.reject(e)}return a instanceof Promise&&this.i&&(a=a.catch(n=>this.i.handle({url:s,request:e,event:t}))),a}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const a=i.match({url:e,request:t,event:s});if(a)return n=a,(Array.isArray(a)&&0===a.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new c,r.addFetchListener(),r.addCacheListener()),r);const u={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},h=e=>[u.prefix,e,u.suffix].filter(e=>e&&e.length>0).join("-"),f=e=>e||h(u.precache),l=e=>e||h(u.runtime);function d(e){e.then(()=>{})}const w=new Set;class p{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:a=!1}={}){return await this.transaction([e],"readonly",(c,r)=>{const o=c.objectStore(e),u=t?o.index(t):o,h=[],f=u.openCursor(s,n);f.onsuccess=()=>{const e=f.result;e?(h.push(a?e:e.value),i&&h.length>=i?r(h):e.continue()):r(h)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const a=this.o.transaction(e,t);a.onabort=()=>i(a.error),a.oncomplete=()=>n(),s(a,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const a=s.objectStore(t),c=a[e].apply(a,n);c.onsuccess=()=>i(c.result)})}close(){this.o&&(this.o.close(),this.o=null)}}p.prototype.OPEN_TIMEOUT=2e3;const b={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(b))for(const s of t)s in IDBObjectStore.prototype&&(p.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new p("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this.q(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.q(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),a=[];let c=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&c>=t?a.push(s.value):c++),s.continue()}else n(a)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}q(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this._=!1,this.R=!1,this.U=t.maxEntries,this.N=t.maxAgeSeconds,this.m=e,this.j=new g(e)}async expireEntries(){if(this._)return void(this.R=!0);this._=!0;const e=this.N?Date.now()-1e3*this.N:0,t=await this.j.expireEntries(e,this.U),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this._=!1,this.R&&(this.R=!1,d(this.expireEntries()))}async updateTimestamp(e){await this.j.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.N){return await this.j.getTimestamp(e)<Date.now()-1e3*this.N}return!1}async delete(){this.R=!1,await this.j.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),q=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},x=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const a=await self.caches.open(e),c=await q({plugins:i,request:t,mode:"read"});let r=await a.match(c,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:c})}return r},R=async({cacheName:e,request:s,response:n,event:i,plugins:c=[],matchOptions:r})=>{const o=await q({plugins:c,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:a(o.url)});const u=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,a=!1;for(const t of n)if("cacheWillUpdate"in t){a=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return a||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:c,response:n,request:o});if(!u)return;const h=await self.caches.open(e),f=v(c,"cacheDidUpdate"),l=f.length>0?await x({cacheName:e,matchOptions:r,request:o}):null;try{await h.put(o,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const t of f)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:l,newResponse:u,request:o})},U=x,N=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const a=v(i,"fetchDidFail"),c=a.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of a)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:c.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const j={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let L;async function T(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,a=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?s.body:await s.blob();return new Response(a,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function K(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),a=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:a.href}}class P{constructor(e){this.m=f(e),this.L=new Map,this.T=new Map,this.K=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=K(n),a="string"!=typeof n&&n.revision?"reload":"default";if(this.L.has(i)&&this.L.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.L.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.K.has(e)&&this.K.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.K.set(e,n.integrity)}if(this.L.set(i,e),this.T.set(i,a),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.m),a=await i.keys(),c=new Set(a.map(e=>e.url));for(const[e,t]of this.L)c.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.K.get(s),a=this.T.get(n);return this.P({cacheKey:s,cacheMode:a,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.L.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async P({cacheKey:e,url:s,cacheMode:n,event:i,plugins:a,integrity:c}){const r=new Request(s,{integrity:c,cache:n,credentials:"same-origin"});let o,u=await N({event:i,plugins:a,request:r});for(const e of a||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:u}):u.status<400))throw new t("bad-precaching-response",{url:s,status:u.status});u.redirected&&(u=await T(u)),await R({event:i,plugins:a,response:u,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.L}getCachedURLs(){return[...this.L.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.L.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let k;const C=()=>(k||(k=new P),k);const Q=(e,t)=>{const s=C().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const a=new URL(e,location.href);a.hash="",yield a.href;const c=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(a,t);if(yield c.href,s&&c.pathname.endsWith("/")){const e=new URL(c.href);e.pathname+=s,yield e.href}if(n){const e=new URL(c.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:a});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let E=!1;function M(e){E||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=f();self.addEventListener("fetch",a=>{const c=Q(a.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!c)return;let r=self.caches.open(i).then(e=>e.match(c)).then(e=>e||fetch(c));a.respondWith(r)})})(e),E=!0)}const O=[],D={get:()=>O,add(e){O.push(...e)}},I=e=>{const t=C(),s=D.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},J=e=>{const t=C();e.waitUntil(t.activate())};var V;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),V={},function(e){C().addToCacheList(e),e.length>0&&(self.addEventListener("install",I),self.addEventListener("activate",J))}([{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/_buildManifest.js",revision:"50b56e80ce54674e284f454a7b16f8e7"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/_app.js",revision:"fb04aded83603179d251d1bd5efccd2f"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/_error.js",revision:"bdcd882f455e5fade942733f1ead7a4a"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/course/[cid]/queue/[qid].js",revision:"97c3911011209bfef7cc3ab431c3db45"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/course/[cid]/schedule.js",revision:"0af62fd73e2ad3b408b381359ac28839"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/course/[cid]/today.js",revision:"d466a02f29c8e501484e700aa06e43c1"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/dev.js",revision:"27db88d55b9109a34e1ddb3ee236daf7"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/index.js",revision:"f4e2dc81f0d29fedc98693d09e8dfe74"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/login.js",revision:"da5c44c681b3ac03e6b3bec8b85628df"},{url:"_next/static/JuPc2CqNTl3s3KVQQpnbU/pages/nocourses.js",revision:"d1439e562090febb90c9b431b7bfdb2b"},{url:"_next/static/chunks/033e96c0d24354ad43e93d63e5225a4f642418ff.96e54de04c15d71ed2ef.js",revision:"a0d4c5e78b390018c2dfc5e485cd5a28"},{url:"_next/static/chunks/232c376de0af0d4d9d867697a4fadd5c4da43b7a.b990028738d317dba5be.js",revision:"43f30897ec257211c1ca492fc7410f14"},{url:"_next/static/chunks/2edb282b.79d6005f3fed25affa98.js",revision:"711e4f70a85270ccde55f69c12badbab"},{url:"_next/static/chunks/31845d1144587f140ec6cbbeceaa2bf396a0d727.085316e71bcf280a3ca5.js",revision:"d13e0369973211ae9703bef2426678e3"},{url:"_next/static/chunks/36bf02797607c521e75f8b46e69304d265715f14.5d843e10dfd185200a9a.js",revision:"a9a51204501563dc6e07e7ae25e53d38"},{url:"_next/static/chunks/415609ac954535390051f97664e03d4354f88f46.04e52eae15f25a31aa27.js",revision:"1cd96cd37818e6126caa9a3beafd30e8"},{url:"_next/static/chunks/51a6f82bd407a6cd7aa5dea298de783be6e48ea1.9708f84493aff45b242d.js",revision:"b3a9fb8db985e09887a53e9074d37188"},{url:"_next/static/chunks/6817ce91b9191c6fc88fe125ea6cd7bee2542a0b.a6331a5aa59754335e80.js",revision:"9d791b281a66b2da4a13ae512b5d2ef5"},{url:"_next/static/chunks/7c79fe2b0156ec64e7c2d3cb5e3dee6c6f483e5f.5903a9df995e201f4d1f.js",revision:"022f8c3fe6582ed1a00c8d91c72cc43e"},{url:"_next/static/chunks/a29ae703.a6b1d49c8c18c916051d.js",revision:"b4d98aa353fdfb78b8e2798fbf65b083"},{url:"_next/static/chunks/c96b4d7e.459423a66962f1204ce6.js",revision:"2ecea9fd759c7be575940e9af72510a5"},{url:"_next/static/chunks/commons.d207e9baa9df58f53439.js",revision:"eae6bdefc4b4c1bad3f734dc3193e3b1"},{url:"_next/static/chunks/dce37df5565b5d5f5929905d7635469616f50c88.475aa6618c25f93d0df1.js",revision:"67b3434b6f189ccae86a35028134e212"},{url:"_next/static/chunks/e5efd123389d9aaa6ec2b5349e4273b91690b6ce.cddaba6ed6f1665f1029.js",revision:"513ea038f1a67a4c49507a1dd885e1ea"},{url:"_next/static/chunks/fc8d00fd.7257950804e0a9b6ee6c.js",revision:"1be849b57639fafdcab725260d1c089a"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/82cdff9d095f5d7a12bb.css",revision:"6b687fd5afb07213a49206ef2e8317af"},{url:"_next/static/runtime/main-a83fb07082611a9b53ff.js",revision:"15c049e64f07f6a68ba67840369f4abb"},{url:"_next/static/runtime/polyfills-dd8ea92cbad15244f197.js",revision:"645c5f2e4e3b278e4ea7e4e98d44dfb6"},{url:"_next/static/runtime/webpack-c212667a5f965e81e004.js",revision:"cd00a63b218fd15ffccf530cd57d5a5e"}]),M(V),function(e,s,a){let c;if("string"==typeof e){const t=new URL(e,location.href);c=new n(({url:e})=>e.href===t.href,s,a)}else if(e instanceof RegExp)c=new i(e,s,a);else if("function"==typeof e)c=new n(e,s,a);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});c=e}o().registerRoute(c)}(/^https?.*/,new class{constructor(e={}){if(this.m=l(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.k=t?e.plugins:[j,...e.plugins]}else this.k=[j];this.C=e.networkTimeoutSeconds||0,this.M=e.fetchOptions,this.O=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let a;if(this.C){const{id:t,promise:c}=this.D({request:s,event:e,logs:n});a=t,i.push(c)}const c=this.I({timeoutId:a,request:s,event:e,logs:n});i.push(c);let r=await Promise.race(i);if(r||(r=await c),!r)throw new t("no-response",{url:s.url});return r}D({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.J({request:e,event:s}))},1e3*this.C)}),id:n}}async I({timeoutId:e,request:t,logs:s,event:n}){let i,a;try{a=await N({request:t,event:n,fetchOptions:this.M,plugins:this.k})}catch(e){i=e}if(e&&clearTimeout(e),i||!a)a=await this.J({request:t,event:n});else{const e=a.clone(),s=R({cacheName:this.m,request:t,response:e,event:n,plugins:this.k});if(n)try{n.waitUntil(s)}catch(e){}}return a}J({event:e,request:t}){return U({cacheName:this.m,request:t,event:e,matchOptions:this.O,plugins:this.k})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.V(n),a=this.A(s);d(a.expireEntries());const c=a.updateTimestamp(t.url);if(e)try{e.waitUntil(c)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.A(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.S=e,this.N=e.maxAgeSeconds,this.W=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}A(e){if(e===l())throw new t("expire-custom-caches-only");let s=this.W.get(e);return s||(s=new m(e,this.S),this.W.set(e,s)),s}V(e){if(!this.N)return!0;const t=this.B(e);if(null===t)return!0;return t>=Date.now()-1e3*this.N}B(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.W)await self.caches.delete(e),await t.delete();this.W=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
