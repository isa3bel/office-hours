try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const c=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class a{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let c,a=i&&i.handler;if(!a&&this.s&&(a=this.s),a){try{c=a.handle({url:s,request:e,event:t,params:n})}catch(e){c=Promise.reject(e)}return c instanceof Promise&&this.i&&(c=c.catch(n=>this.i.handle({url:s,request:e,event:t}))),c}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const c=i.match({url:e,request:t,event:s});if(c)return n=c,(Array.isArray(c)&&0===c.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);const u={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},f=e=>[u.prefix,e,u.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||f(u.precache),d=e=>e||f(u.runtime);function l(e){e.then(()=>{})}const w=new Set;class b{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:c=!1}={}){return await this.transaction([e],"readonly",(a,r)=>{const o=a.objectStore(e),u=t?o.index(t):o,f=[],h=u.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(f.push(c?e:e.value),i&&f.length>=i?r(f):e.continue()):r(f)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const c=this.o.transaction(e,t);c.onabort=()=>i(c.error),c.oncomplete=()=>n(),s(c,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const c=s.objectStore(t),a=c[e].apply(c,n);a.onsuccess=()=>i(a.result)})}close(){this.o&&(this.o.close(),this.o=null)}}b.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(b.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new b("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this.R(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.R(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),c=[];let a=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&a>=t?c.push(s.value):a++),s.continue()}else n(c)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}R(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this.q=!1,this._=!1,this.U=t.maxEntries,this.L=t.maxAgeSeconds,this.m=e,this.j=new g(e)}async expireEntries(){if(this.q)return void(this._=!0);this.q=!0;const e=this.L?Date.now()-1e3*this.L:0,t=await this.j.expireEntries(e,this.U),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.q=!1,this._&&(this._=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.j.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.L){return await this.j.getTimestamp(e)<Date.now()-1e3*this.L}return!1}async delete(){this._=!1,await this.j.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),R=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},x=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const c=await self.caches.open(e),a=await R({plugins:i,request:t,mode:"read"});let r=await c.match(a,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:a})}return r},q=async({cacheName:e,request:s,response:n,event:i,plugins:a=[],matchOptions:r})=>{const o=await R({plugins:a,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:c(o.url)});const u=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,c=!1;for(const t of n)if("cacheWillUpdate"in t){c=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return c||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:a,response:n,request:o});if(!u)return;const f=await self.caches.open(e),h=v(a,"cacheDidUpdate"),d=h.length>0?await x({cacheName:e,matchOptions:r,request:o}):null;try{await f.put(o,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:d,newResponse:u,request:o})},U=x,L=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const c=v(i,"fetchDidFail"),a=c.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of c)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const j={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let k;async function K(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,c=function(){if(void 0===k){const e=new Response("");if("body"in e)try{new Response(e.body),k=!0}catch(e){k=!1}k=!1}return k}()?s.body:await s.blob();return new Response(c,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function O(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),c=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:c.href}}class N{constructor(e){this.m=h(e),this.k=new Map,this.K=new Map,this.O=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=O(n),c="string"!=typeof n&&n.revision?"reload":"default";if(this.k.has(i)&&this.k.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.k.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.O.has(e)&&this.O.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.O.set(e,n.integrity)}if(this.k.set(i,e),this.K.set(i,c),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.m),c=await i.keys(),a=new Set(c.map(e=>e.url));for(const[e,t]of this.k)a.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.O.get(s),c=this.K.get(n);return this.N({cacheKey:s,cacheMode:c,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.k.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async N({cacheKey:e,url:s,cacheMode:n,event:i,plugins:c,integrity:a}){const r=new Request(s,{integrity:a,cache:n,credentials:"same-origin"});let o,u=await L({event:i,plugins:c,request:r});for(const e of c||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:u}):u.status<400))throw new t("bad-precaching-response",{url:s,status:u.status});u.redirected&&(u=await K(u)),await q({event:i,plugins:c,response:u,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.k}getCachedURLs(){return[...this.k.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.k.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let E;const W=()=>(E||(E=new N),E);const F=(e,t)=>{const s=W().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(c,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:c});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let H=!1;function M(e){H||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=h();self.addEventListener("fetch",c=>{const a=F(c.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!a)return;let r=self.caches.open(i).then(e=>e.match(a)).then(e=>e||fetch(a));c.respondWith(r)})})(e),H=!0)}const T=[],P={get:()=>T,add(e){T.push(...e)}},D=e=>{const t=W(),s=P.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},G=e=>{const t=W();e.waitUntil(t.activate())};var C;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),C={},function(e){W().addToCacheList(e),e.length>0&&(self.addEventListener("install",D),self.addEventListener("activate",G))}([{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/_buildManifest.js",revision:"b54210b824195f7da2b63dab63863d80"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/_app.js",revision:"07a8ee1c67e4b8477e315e6daa9d9b70"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/_error.js",revision:"876e3b29962aee2dd66636de64fa4fbe"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/course/[cid]/queue/[qid].js",revision:"22342ce555d6b7188e610013765c1e1e"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/course/[cid]/schedule.js",revision:"7dd6d6fdef2cb329d5cabe7cdc3957d2"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/course/[cid]/today.js",revision:"c4a26926b7219e9d31abe8cf5a04ee50"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/dev.js",revision:"fa23f7d6a02fed8495ca622954640ec1"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/index.js",revision:"b972bca943920cdcf18d98de9deba372"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/login.js",revision:"589c5602eac52d3582a4b21122826d6e"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/nocourses.js",revision:"b6184379ad7dc3bd3d3f4c418869e9f8"},{url:"_next/static/W-GHKs4sFUO0LyRuZn8zo/pages/settings.js",revision:"3ebe84be2e3f991fa0ff7b8c581ba0d1"},{url:"_next/static/chunks/1fce48251089c95930c58574def8fb12de5f889e.6aafbe998de7c270fe19.js",revision:"1bcf10255eab7ffff436c7584022fd7b"},{url:"_next/static/chunks/2481e5b00f2b1737d5d985563b80133e8c7f26c1.772f35a82498f7b19b0c.js",revision:"eb350eda755a3bd0ac8c98b93bcdc34f"},{url:"_next/static/chunks/29107295.9234196b81fd02ccfdc7.js",revision:"29e5c0bc2f6690c6e84e9faa88072e02"},{url:"_next/static/chunks/3022638d0a06e256e581a428111456c9e0732bcc.9708f84493aff45b242d.js",revision:"df43d4c1f7e79a39fba91290d7dd3c9d"},{url:"_next/static/chunks/6398e5b8af3340d08487496b3747916d626de531.358c2c708d35eebc6a19.js",revision:"7b56a3819d7d1e0c94d1c7fed012b2f9"},{url:"_next/static/chunks/6d65424bb4e5900acc09586604f6d42ca10d370a.eae0e9ae67a330f1dc9c.js",revision:"f732a411467972d3f707e07085ec39eb"},{url:"_next/static/chunks/738b795a3232c2fb1423b346b891a4ec960dba03.475aa6618c25f93d0df1.js",revision:"326233d84a8bee75da094fb1ab993f3e"},{url:"_next/static/chunks/748a40b97d7ce00632e56004168ce3bd580a5aa0.7e02b68300e2fd166e12.js",revision:"3734a01e6a274973cd76627d906459ce"},{url:"_next/static/chunks/8812840a4fd2e899d5ab4b9c178979397914b26d.8f02588b5e8652ac96fa.js",revision:"06977f745a77ddffb28ab42e423e69af"},{url:"_next/static/chunks/88880b18ad85050882cee0c50362d9128e933f6f.528d5754e79868447ede.js",revision:"629a35d0d955c1dd4812396e610d7d10"},{url:"_next/static/chunks/a29ae703.a6b1d49c8c18c916051d.js",revision:"b4d98aa353fdfb78b8e2798fbf65b083"},{url:"_next/static/chunks/b545bcf568525dc3bb9beb003930b750fb7ccf04.cc998e18b28cf43b5fc5.js",revision:"cf2f24765aa0d5a270e31fc026903d6c"},{url:"_next/static/chunks/c96b4d7e.d22bf489834c20c51945.js",revision:"c2b5a16e9238d490aaa0f622ea9ed940"},{url:"_next/static/chunks/c97c2496b26a499eb4a9d9c72c33d28b3e2a4c0d.a19e18f911bef145edcd.js",revision:"a986d3cc0b6af821af9f8ab242689f0f"},{url:"_next/static/chunks/commons.d207e9baa9df58f53439.js",revision:"eae6bdefc4b4c1bad3f734dc3193e3b1"},{url:"_next/static/chunks/d56a3cd8ea8844260444691f596914cbb6cda393.4a3221dbec4bad64f9c4.js",revision:"89946fd32ea3c7f5826ba592a5b60af2"},{url:"_next/static/chunks/e48f73825ec473289ec015ba0e41a49fa64e1fa4.cc562453848ae2d8e69d.js",revision:"091afd3ceaf6b00a957eabfd67e7ab6d"},{url:"_next/static/chunks/fc8d00fd.afd2d8f4015a50040cc7.js",revision:"034a5909526fbfd8b9f907ec8a52d5df"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/82cdff9d095f5d7a12bb.css",revision:"6b687fd5afb07213a49206ef2e8317af"},{url:"_next/static/runtime/main-2f06fd375e806878add2.js",revision:"5ce29919cf1d9cf39ffa0198b474ee42"},{url:"_next/static/runtime/polyfills-88871e34227556d9543c.js",revision:"995b69e71e342d3d3dcf095cf274c27c"},{url:"_next/static/runtime/webpack-c212667a5f965e81e004.js",revision:"cd00a63b218fd15ffccf530cd57d5a5e"}]),M(C),function(e,s,c){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n(({url:e})=>e.href===t.href,s,c)}else if(e instanceof RegExp)a=new i(e,s,c);else if("function"==typeof e)a=new n(e,s,c);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}o().registerRoute(a)}(/^https?.*/,new class{constructor(e={}){if(this.m=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.W=t?e.plugins:[j,...e.plugins]}else this.W=[j];this.F=e.networkTimeoutSeconds||0,this.H=e.fetchOptions,this.M=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let c;if(this.F){const{id:t,promise:a}=this.T({request:s,event:e,logs:n});c=t,i.push(a)}const a=this.P({timeoutId:c,request:s,event:e,logs:n});i.push(a);let r=await Promise.race(i);if(r||(r=await a),!r)throw new t("no-response",{url:s.url});return r}T({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.D({request:e,event:s}))},1e3*this.F)}),id:n}}async P({timeoutId:e,request:t,logs:s,event:n}){let i,c;try{c=await L({request:t,event:n,fetchOptions:this.H,plugins:this.W})}catch(e){i=e}if(e&&clearTimeout(e),i||!c)c=await this.D({request:t,event:n});else{const e=c.clone(),s=q({cacheName:this.m,request:t,response:e,event:n,plugins:this.W});if(n)try{n.waitUntil(s)}catch(e){}}return c}D({event:e,request:t}){return U({cacheName:this.m,request:t,event:e,matchOptions:this.M,plugins:this.W})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.G(n),c=this.C(s);l(c.expireEntries());const a=c.updateTimestamp(t.url);if(e)try{e.waitUntil(a)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.C(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.I=e,this.L=e.maxAgeSeconds,this.Z=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}C(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.Z.get(e);return s||(s=new m(e,this.I),this.Z.set(e,s)),s}G(e){if(!this.L)return!0;const t=this.A(e);if(null===t)return!0;return t>=Date.now()-1e3*this.L}A(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.Z)await self.caches.delete(e),await t.delete();this.Z=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
