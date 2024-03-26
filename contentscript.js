!function e(t, r, n) {
    function i(s, a) {
        if (!r[s]) {
            if (!t[s]) {
                var l = "function" == typeof require && require;
                if (!a && l)
                    return l(s, !0);
                if (o)
                    return o(s, !0);
                var u = new Error("Cannot find module '" + s + "'");
                throw u.code = "MODULE_NOT_FOUND",
                u
            }
            var c = r[s] = {
                exports: {}
            };
            t[s][0].call(c.exports, (function(e) {
                return i(t[s][1][e] || e)
            }
            ), c, c.exports, e, t, r, n)
        }
        return r[s].exports
    }
    for (var o = "function" == typeof require && require, s = 0; s < n.length; s++)
        i(n[s]);
    return i
}({
    1: [function(e, t, r) {
        "use strict";
        var n = e("@metamask/post-message-stream")
          , i = h(e("extension-port-stream"))
          , o = h(e("obj-multiplex"))
          , s = h(e("pump"))
          , a = e("through2")
          , l = h(e("webextension-polyfill"))
          , u = e("../../shared/constants/app")
          , c = e("../../shared/modules/browser-runtime.utils")
          , d = e("../../shared/modules/mv3.utils")
          , f = h(e("../../shared/modules/provider-injection"));
        function h(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        const p = "metamask-contentscript"
          , g = "metamask-inpage"
          , m = "metamask-phishing-warning-page"
          , b = "metamask-phishing-safelist"
          , y = "metamask-provider"
          , v = "provider"
          , w = "publicConfig";
        let _, E, S, A, R, x, T;
        const O = new URL("https://metamask.github.io/phishing-warning/v3.0.3/");
        let k, M, N, j, P, I, C, L, D, $, B, F, U;
        const W = ()=>{
            N = l.default.runtime.connect({
                name: p
            }),
            j = new i.default(N),
            M = new o.default,
            M.setMaxListeners(25),
            (0,
            s.default)(M, j, M, (e=>{
                Z("MetaMask Background Multiplex", e),
                window.postMessage({
                    target: m,
                    data: {
                        name: b,
                        data: {
                            jsonrpc: "2.0",
                            method: "METAMASK_STREAM_FAILURE"
                        }
                    }
                }, window.location.origin)
            }
            )),
            k = M.createStream(b),
            (0,
            s.default)(P, k, P, (e=>console.debug(`MetaMask: Muxed traffic for channel "${b}" failed.`, e))),
            N.onDisconnect.addListener(V)
        }
          , V = ()=>{
            const e = (0,
            c.checkForLastError)();
            N.onDisconnect.removeListener(V),
            P.removeAllListeners(),
            M.removeAllListeners(),
            M.destroy(),
            k.removeAllListeners(),
            k.destroy(),
            j = null,
            e && (console.warn(`${e} Resetting the phishing streams.`),
            setTimeout(W, 1e3))
        }
          , H = e=>{
            if (e.name === u.EXTENSION_MESSAGES.READY)
                return j || W(),
                Promise.resolve(`MetaMask: handled "${u.EXTENSION_MESSAGES.READY}" for phishing streams`)
        }
          , G = ()=>{
            !function() {
                const e = new n.WindowPostMessageStream({
                    name: p,
                    target: m
                });
                I = new o.default,
                I.setMaxListeners(25),
                (0,
                s.default)(I, e, I, (e=>Z("MetaMask Inpage Multiplex", e))),
                P = I.createStream(b)
            }(),
            W(),
            l.default.runtime.onMessage.addListener(H)
        }
        ;
        let q = !1;
        const J = ()=>{
            q = !0,
            D = l.default.runtime.connect({
                name: p
            }),
            B = new i.default(D),
            B.on("data", Q),
            C = new o.default,
            C.setMaxListeners(25),
            C.ignoreStream(w),
            (0,
            s.default)(C, B, C, (e=>{
                Z("MetaMask Background Multiplex", e),
                ee()
            }
            )),
            L = C.createStream(y),
            (0,
            s.default)(U, L, U, (e=>console.debug(`MetaMask: Muxed traffic for channel "${y}" failed.`, e))),
            $ = C.createStream("phishing"),
            $.once("data", te),
            D.onDisconnect.addListener(Y)
        }
          , z = ()=>{
            _ = new o.default,
            _.setMaxListeners(25),
            T = (0,
            a.obj)(((e,t,r)=>{
                var n;
                (null == e ? void 0 : e.name) === y && "metamask_accountsChanged" === (null === (n = e.data) || void 0 === n ? void 0 : n.method) && (e.data.method = "wallet_accountsChanged",
                e.data.result = e.data.params,
                delete e.data.params),
                r(null, e)
            }
            )),
            (0,
            s.default)(_, B, T, _, (e=>{
                Z("MetaMask Background Legacy Multiplex", e),
                ee()
            }
            )),
            E = _.createStream(y),
            (0,
            s.default)(R, E, R, (e=>console.debug(`MetaMask: Muxed traffic between channels "${v}" and "${y}" failed.`, e))),
            S = _.createStream(w),
            (0,
            s.default)(x, S, x, (e=>console.debug(`MetaMask: Muxed traffic for channel "${w}" failed.`, e)))
        }
          , X = e=>{
            if (e.name === u.EXTENSION_MESSAGES.READY)
                return B || (J(),
                z()),
                Promise.resolve(`MetaMask: handled ${u.EXTENSION_MESSAGES.READY}`)
        }
          , Y = e=>{
            const t = e || (0,
            c.checkForLastError)();
            D.onDisconnect.removeListener(Y),
            U.removeAllListeners(),
            C.removeAllListeners(),
            C.destroy(),
            L.removeAllListeners(),
            L.destroy(),
            B = null,
            R.removeAllListeners(),
            x.removeAllListeners(),
            _.removeAllListeners(),
            _.destroy(),
            E.removeAllListeners(),
            E.destroy(),
            S.removeAllListeners(),
            S.destroy(),
            t && (console.warn(`${t} Resetting the streams.`),
            setTimeout(J, 1e3))
        }
          , K = ()=>{
            (()=>{
                const e = new n.WindowPostMessageStream({
                    name: p,
                    target: g
                });
                F = new o.default,
                F.setMaxListeners(25),
                (0,
                s.default)(F, e, F, (e=>Z("MetaMask Inpage Multiplex", e))),
                U = F.createStream(y)
            }
            )(),
            (()=>{
                const e = new n.WindowPostMessageStream({
                    name: "contentscript",
                    target: "inpage"
                });
                A = new o.default,
                A.setMaxListeners(25),
                (0,
                s.default)(A, e, A, (e=>Z("MetaMask Legacy Inpage Multiplex", e))),
                R = A.createStream(v),
                x = A.createStream(w)
            }
            )(),
            J(),
            z(),
            l.default.runtime.onMessage.addListener(X)
        }
        ;
        function Z(e, t) {
            console.debug(`MetaMask: Content script lost connection to "${e}".`, t)
        }
        function Q(e) {
            q && d.isManifestV3 && "metamask_chainChanged" === e.data.method && (q = !1,
            window.postMessage({
                target: g,
                data: {
                    name: y,
                    data: {
                        jsonrpc: "2.0",
                        method: "METAMASK_EXTENSION_CONNECT_CAN_RETRY"
                    }
                }
            }, window.location.origin))
        }
        function ee() {
            window.postMessage({
                target: g,
                data: {
                    name: y,
                    data: {
                        jsonrpc: "2.0",
                        method: "METAMASK_STREAM_FAILURE"
                    }
                }
            }, window.location.origin)
        }
        function te() {
            console.debug("MetaMask: Routing to Phishing Warning page.");
            const {hostname: e, href: t} = window.location
              , r = new URLSearchParams({
                hostname: e,
                href: t
            });
            for (window.location.href = `https://metamask.github.io/phishing-warning/v3.0.3/#${r}`; ; )
                console.log("MetaMask: Locking js execution, redirection will complete shortly")
        }
        window.location.origin === O.origin && window.location.pathname === O.pathname ? G() : (0,
        f.default)() && (K(),
        document.prerendering && document.addEventListener("prerenderingchange", (()=>{
            Y(new Error("Prerendered page has become active."))
        }
        )))
    }
    , {
        "../../shared/constants/app": 263,
        "../../shared/modules/browser-runtime.utils": 266,
        "../../shared/modules/mv3.utils": 267,
        "../../shared/modules/provider-injection": 268,
        "@metamask/post-message-stream": 5,
        "extension-port-stream": 131,
        "obj-multiplex": 172,
        pump: 179,
        through2: 256,
        "webextension-polyfill": 259
    }],
    2: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.BasePostMessageStream = void 0;
        const n = e("readable-stream")
          , i = ()=>{}
          , o = "SYN"
          , s = "ACK";
        class a extends n.Duplex {
            constructor() {
                super({
                    objectMode: !0
                }),
                this._init = !1,
                this._haveSyn = !1,
                this._log = ()=>null
            }
            _handshake() {
                this._write(o, null, i),
                this.cork()
            }
            _onData(e) {
                if (this._init)
                    try {
                        this.push(e),
                        this._log(e, !1)
                    } catch (e) {
                        this.emit("error", e)
                    }
                else
                    e === o ? (this._haveSyn = !0,
                    this._write(s, null, i)) : e === s && (this._init = !0,
                    this._haveSyn || this._write(s, null, i),
                    this.uncork())
            }
            _read() {}
            _write(e, t, r) {
                e !== s && e !== o && this._log(e, !0),
                this._postMessage(e),
                r()
            }
            _setLogger(e) {
                this._log = e
            }
        }
        r.BasePostMessageStream = a
    }
    , {
        "readable-stream": 23
    }],
    3: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WebWorkerParentPostMessageStream = void 0;
        const n = e("../BasePostMessageStream")
          , i = e("../utils");
        class o extends n.BasePostMessageStream {
            constructor({worker: e}) {
                super(),
                this._target = i.DEDICATED_WORKER_NAME,
                this._worker = e,
                this._worker.onmessage = this._onMessage.bind(this),
                this._handshake()
            }
            _postMessage(e) {
                this._worker.postMessage({
                    target: this._target,
                    data: e
                })
            }
            _onMessage(e) {
                const t = e.data;
                (0,
                i.isValidStreamMessage)(t) && this._onData(t.data)
            }
            _destroy() {
                this._worker.onmessage = null,
                this._worker = null
            }
        }
        r.WebWorkerParentPostMessageStream = o
    }
    , {
        "../BasePostMessageStream": 2,
        "../utils": 7
    }],
    4: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WebWorkerPostMessageStream = void 0;
        const n = e("../BasePostMessageStream")
          , i = e("../utils");
        class o extends n.BasePostMessageStream {
            constructor() {
                if ("undefined" == typeof self || "undefined" == typeof WorkerGlobalScope)
                    throw new Error("WorkerGlobalScope not found. This class should only be instantiated in a WebWorker.");
                super(),
                this._name = i.DEDICATED_WORKER_NAME,
                self.addEventListener("message", this._onMessage.bind(this)),
                this._handshake()
            }
            _postMessage(e) {
                self.postMessage({
                    data: e
                })
            }
            _onMessage(e) {
                const t = e.data;
                (0,
                i.isValidStreamMessage)(t) && t.target === this._name && this._onData(t.data)
            }
            _destroy() {}
        }
        r.WebWorkerPostMessageStream = o
    }
    , {
        "../BasePostMessageStream": 2,
        "../utils": 7
    }],
    5: [function(e, t, r) {
        "use strict";
        var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
            void 0 === n && (n = r),
            Object.defineProperty(e, n, {
                enumerable: !0,
                get: function() {
                    return t[r]
                }
            })
        }
        : function(e, t, r, n) {
            void 0 === n && (n = r),
            e[n] = t[r]
        }
        )
          , i = this && this.__exportStar || function(e, t) {
            for (var r in e)
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || n(t, e, r)
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        i(e("./window/WindowPostMessageStream"), r),
        i(e("./WebWorker/WebWorkerPostMessageStream"), r),
        i(e("./WebWorker/WebWorkerParentPostMessageStream"), r),
        i(e("./runtime/BrowserRuntimePostMessageStream"), r),
        i(e("./BasePostMessageStream"), r)
    }
    , {
        "./BasePostMessageStream": 2,
        "./WebWorker/WebWorkerParentPostMessageStream": 3,
        "./WebWorker/WebWorkerPostMessageStream": 4,
        "./runtime/BrowserRuntimePostMessageStream": 6,
        "./window/WindowPostMessageStream": 8
    }],
    6: [function(e, t, r) {
        "use strict";
        var n, i, o = this && this.__classPrivateFieldSet || function(e, t, r, n, i) {
            if ("m" === n)
                throw new TypeError("Private method is not writable");
            if ("a" === n && !i)
                throw new TypeError("Private accessor was defined without a setter");
            if ("function" == typeof t ? e !== t || !i : !t.has(e))
                throw new TypeError("Cannot write private member to an object whose class did not declare it");
            return "a" === n ? i.call(e, r) : i ? i.value = r : t.set(e, r),
            r
        }
        , s = this && this.__classPrivateFieldGet || function(e, t, r, n) {
            if ("a" === r && !n)
                throw new TypeError("Private accessor was defined without a getter");
            if ("function" == typeof t ? e !== t || !n : !t.has(e))
                throw new TypeError("Cannot read private member from an object whose class did not declare it");
            return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e)
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.BrowserRuntimePostMessageStream = void 0;
        const a = e("../BasePostMessageStream")
          , l = e("../utils");
        class u extends a.BasePostMessageStream {
            constructor({name: e, target: t}) {
                super(),
                n.set(this, void 0),
                i.set(this, void 0),
                o(this, n, e, "f"),
                o(this, i, t, "f"),
                this._onMessage = this._onMessage.bind(this),
                this._getRuntime().onMessage.addListener(this._onMessage),
                this._handshake()
            }
            _postMessage(e) {
                this._getRuntime().sendMessage({
                    target: s(this, i, "f"),
                    data: e
                })
            }
            _onMessage(e) {
                (0,
                l.isValidStreamMessage)(e) && e.target === s(this, n, "f") && this._onData(e.data)
            }
            _getRuntime() {
                var e, t;
                if ("chrome"in globalThis && "function" == typeof (null === (e = null === chrome || void 0 === chrome ? void 0 : chrome.runtime) || void 0 === e ? void 0 : e.sendMessage))
                    return chrome.runtime;
                if ("browser"in globalThis && "function" == typeof (null === (t = null === browser || void 0 === browser ? void 0 : browser.runtime) || void 0 === t ? void 0 : t.sendMessage))
                    return browser.runtime;
                throw new Error("browser.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.")
            }
            _destroy() {
                this._getRuntime().onMessage.removeListener(this._onMessage)
            }
        }
        r.BrowserRuntimePostMessageStream = u,
        n = new WeakMap,
        i = new WeakMap
    }
    , {
        "../BasePostMessageStream": 2,
        "../utils": 7
    }],
    7: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.isValidStreamMessage = r.DEDICATED_WORKER_NAME = void 0;
        const n = e("@metamask/utils");
        r.DEDICATED_WORKER_NAME = "dedicatedWorker",
        r.isValidStreamMessage = function(e) {
            return (0,
            n.isObject)(e) && Boolean(e.data) && ("number" == typeof e.data || "object" == typeof e.data || "string" == typeof e.data)
        }
    }
    , {
        "@metamask/utils": 114
    }],
    8: [function(e, t, r) {
        "use strict";
        var n, i;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.WindowPostMessageStream = void 0;
        const o = e("@metamask/utils")
          , s = e("../BasePostMessageStream")
          , a = e("../utils")
          , l = null === (n = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "source")) || void 0 === n ? void 0 : n.get;
        (0,
        o.assert)(l, "MessageEvent.prototype.source getter is not defined.");
        const u = null === (i = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "origin")) || void 0 === i ? void 0 : i.get;
        (0,
        o.assert)(u, "MessageEvent.prototype.origin getter is not defined.");
        class c extends s.BasePostMessageStream {
            constructor({name: e, target: t, targetOrigin: r=location.origin, targetWindow: n=window}) {
                if (super(),
                "undefined" == typeof window || "function" != typeof window.postMessage)
                    throw new Error("window.postMessage is not a function. This class should only be instantiated in a Window.");
                this._name = e,
                this._target = t,
                this._targetOrigin = r,
                this._targetWindow = n,
                this._onMessage = this._onMessage.bind(this),
                window.addEventListener("message", this._onMessage, !1),
                this._handshake()
            }
            _postMessage(e) {
                this._targetWindow.postMessage({
                    target: this._target,
                    data: e
                }, this._targetOrigin)
            }
            _onMessage(e) {
                const t = e.data;
                "*" !== this._targetOrigin && u.call(e) !== this._targetOrigin || l.call(e) !== this._targetWindow || !(0,
                a.isValidStreamMessage)(t) || t.target !== this._name || this._onData(t.data)
            }
            _destroy() {
                window.removeEventListener("message", this._onMessage, !1)
            }
        }
        r.WindowPostMessageStream = c
    }
    , {
        "../BasePostMessageStream": 2,
        "../utils": 7,
        "@metamask/utils": 114
    }],
    9: [function(e, t, r) {
        "use strict";
        var n = {};
        function i(e, t, r) {
            r || (r = Error);
            var i = function(e) {
                var r, n;
                function i(r, n, i) {
                    return e.call(this, function(e, r, n) {
                        return "string" == typeof t ? t : t(e, r, n)
                    }(r, n, i)) || this
                }
                return n = e,
                (r = i).prototype = Object.create(n.prototype),
                r.prototype.constructor = r,
                r.__proto__ = n,
                i
            }(r);
            i.prototype.name = r.name,
            i.prototype.code = e,
            n[e] = i
        }
        function o(e, t) {
            if (Array.isArray(e)) {
                var r = e.length;
                return e = e.map((function(e) {
                    return String(e)
                }
                )),
                r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0])
            }
            return "of ".concat(t, " ").concat(String(e))
        }
        i("ERR_INVALID_OPT_VALUE", (function(e, t) {
            return 'The value "' + t + '" is invalid for option "' + e + '"'
        }
        ), TypeError),
        i("ERR_INVALID_ARG_TYPE", (function(e, t, r) {
            var n, i, s, a;
            if ("string" == typeof t && (i = "not ",
            t.substr(!s || s < 0 ? 0 : +s, i.length) === i) ? (n = "must not be",
            t = t.replace(/^not /, "")) : n = "must be",
            function(e, t, r) {
                return (void 0 === r || r > e.length) && (r = e.length),
                e.substring(r - t.length, r) === t
            }(e, " argument"))
                a = "The ".concat(e, " ").concat(n, " ").concat(o(t, "type"));
            else {
                var l = function(e, t, r) {
                    return "number" != typeof r && (r = 0),
                    !(r + t.length > e.length) && -1 !== e.indexOf(t, r)
                }(e, ".") ? "property" : "argument";
                a = 'The "'.concat(e, '" ').concat(l, " ").concat(n, " ").concat(o(t, "type"))
            }
            return a += ". Received type ".concat(typeof r)
        }
        ), TypeError),
        i("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"),
        i("ERR_METHOD_NOT_IMPLEMENTED", (function(e) {
            return "The " + e + " method is not implemented"
        }
        )),
        i("ERR_STREAM_PREMATURE_CLOSE", "Premature close"),
        i("ERR_STREAM_DESTROYED", (function(e) {
            return "Cannot call " + e + " after a stream was destroyed"
        }
        )),
        i("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"),
        i("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"),
        i("ERR_STREAM_WRITE_AFTER_END", "write after end"),
        i("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError),
        i("ERR_UNKNOWN_ENCODING", (function(e) {
            return "Unknown encoding: " + e
        }
        ), TypeError),
        i("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"),
        t.exports.codes = n
    }
    , {}],
    10: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n = Object.keys || function(e) {
                    var t = [];
                    for (var r in e)
                        t.push(r);
                    return t
                }
                ;
                t.exports = u;
                var i = e("./_stream_readable")
                  , o = e("./_stream_writable");
                e("inherits")(u, i);
                for (var s = n(o.prototype), a = 0; a < s.length; a++) {
                    var l = s[a];
                    u.prototype[l] || (u.prototype[l] = o.prototype[l])
                }
                function u(e) {
                    if (!(this instanceof u))
                        return new u(e);
                    i.call(this, e),
                    o.call(this, e),
                    this.allowHalfOpen = !0,
                    e && (!1 === e.readable && (this.readable = !1),
                    !1 === e.writable && (this.writable = !1),
                    !1 === e.allowHalfOpen && (this.allowHalfOpen = !1,
                    this.once("end", c)))
                }
                function c() {
                    this._writableState.ended || r.nextTick(d, this)
                }
                function d(e) {
                    e.end()
                }
                Object.defineProperty(u.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                Object.defineProperty(u.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(u.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(u.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                    },
                    set: function(e) {
                        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e,
                        this._writableState.destroyed = e)
                    }
                })
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./_stream_readable": 12,
        "./_stream_writable": 14,
        _process: 178,
        inherits: 169
    }],
    11: [function(e, t, r) {
        "use strict";
        t.exports = i;
        var n = e("./_stream_transform");
        function i(e) {
            if (!(this instanceof i))
                return new i(e);
            n.call(this, e)
        }
        e("inherits")(i, n),
        i.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "./_stream_transform": 13,
        inherits: 169
    }],
    12: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                var i;
                t.exports = R,
                R.ReadableState = A;
                e("events").EventEmitter;
                var o = function(e, t) {
                    return e.listeners(t).length
                }
                  , s = e("./internal/streams/stream")
                  , a = e("buffer").Buffer
                  , l = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var u, c = e("util");
                u = c && c.debuglog ? c.debuglog("stream") : function() {}
                ;
                var d, f, h, p = e("./internal/streams/buffer_list"), g = e("./internal/streams/destroy"), m = e("./internal/streams/state").getHighWaterMark, b = e("../errors").codes, y = b.ERR_INVALID_ARG_TYPE, v = b.ERR_STREAM_PUSH_AFTER_EOF, w = b.ERR_METHOD_NOT_IMPLEMENTED, _ = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
                e("inherits")(R, s);
                var E = g.errorOrDestroy
                  , S = ["error", "close", "destroy", "pause", "resume"];
                function A(t, r, n) {
                    i = i || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof n && (n = r instanceof i),
                    this.objectMode = !!t.objectMode,
                    n && (this.objectMode = this.objectMode || !!t.readableObjectMode),
                    this.highWaterMark = m(this, t, "readableHighWaterMark", n),
                    this.buffer = new p,
                    this.length = 0,
                    this.pipes = null,
                    this.pipesCount = 0,
                    this.flowing = null,
                    this.ended = !1,
                    this.endEmitted = !1,
                    this.reading = !1,
                    this.sync = !0,
                    this.needReadable = !1,
                    this.emittedReadable = !1,
                    this.readableListening = !1,
                    this.resumeScheduled = !1,
                    this.paused = !0,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.destroyed = !1,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.awaitDrain = 0,
                    this.readingMore = !1,
                    this.decoder = null,
                    this.encoding = null,
                    t.encoding && (d || (d = e("string_decoder/").StringDecoder),
                    this.decoder = new d(t.encoding),
                    this.encoding = t.encoding)
                }
                function R(t) {
                    if (i = i || e("./_stream_duplex"),
                    !(this instanceof R))
                        return new R(t);
                    var r = this instanceof i;
                    this._readableState = new A(t,this,r),
                    this.readable = !0,
                    t && ("function" == typeof t.read && (this._read = t.read),
                    "function" == typeof t.destroy && (this._destroy = t.destroy)),
                    s.call(this)
                }
                function x(e, t, r, n, i) {
                    u("readableAddChunk", t);
                    var o, s = e._readableState;
                    if (null === t)
                        s.reading = !1,
                        function(e, t) {
                            if (u("onEofChunk"),
                            t.ended)
                                return;
                            if (t.decoder) {
                                var r = t.decoder.end();
                                r && r.length && (t.buffer.push(r),
                                t.length += t.objectMode ? 1 : r.length)
                            }
                            t.ended = !0,
                            t.sync ? M(e) : (t.needReadable = !1,
                            t.emittedReadable || (t.emittedReadable = !0,
                            N(e)))
                        }(e, s);
                    else if (i || (o = function(e, t) {
                        var r;
                        n = t,
                        a.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new y("chunk",["string", "Buffer", "Uint8Array"],t));
                        var n;
                        return r
                    }(s, t)),
                    o)
                        E(e, o);
                    else if (s.objectMode || t && t.length > 0)
                        if ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === a.prototype || (t = function(e) {
                            return a.from(e)
                        }(t)),
                        n)
                            s.endEmitted ? E(e, new _) : T(e, s, t, !0);
                        else if (s.ended)
                            E(e, new v);
                        else {
                            if (s.destroyed)
                                return !1;
                            s.reading = !1,
                            s.decoder && !r ? (t = s.decoder.write(t),
                            s.objectMode || 0 !== t.length ? T(e, s, t, !1) : j(e, s)) : T(e, s, t, !1)
                        }
                    else
                        n || (s.reading = !1,
                        j(e, s));
                    return !s.ended && (s.length < s.highWaterMark || 0 === s.length)
                }
                function T(e, t, r, n) {
                    t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0,
                    e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length,
                    n ? t.buffer.unshift(r) : t.buffer.push(r),
                    t.needReadable && M(e)),
                    j(e, t)
                }
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = g.destroy,
                R.prototype._undestroy = g.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
                ,
                R.prototype.push = function(e, t) {
                    var r, n = this._readableState;
                    return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = a.from(e, t),
                    t = ""),
                    r = !0),
                    x(this, e, t, !1, r)
                }
                ,
                R.prototype.unshift = function(e) {
                    return x(this, e, null, !0, !1)
                }
                ,
                R.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing
                }
                ,
                R.prototype.setEncoding = function(t) {
                    d || (d = e("string_decoder/").StringDecoder);
                    var r = new d(t);
                    this._readableState.decoder = r,
                    this._readableState.encoding = this._readableState.decoder.encoding;
                    for (var n = this._readableState.buffer.head, i = ""; null !== n; )
                        i += r.write(n.data),
                        n = n.next;
                    return this._readableState.buffer.clear(),
                    "" !== i && this._readableState.buffer.push(i),
                    this._readableState.length = i.length,
                    this
                }
                ;
                var O = 1073741824;
                function k(e, t) {
                    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                        return e >= O ? e = O : (e--,
                        e |= e >>> 1,
                        e |= e >>> 2,
                        e |= e >>> 4,
                        e |= e >>> 8,
                        e |= e >>> 16,
                        e++),
                        e
                    }(e)),
                    e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0,
                    0))
                }
                function M(e) {
                    var t = e._readableState;
                    u("emitReadable", t.needReadable, t.emittedReadable),
                    t.needReadable = !1,
                    t.emittedReadable || (u("emitReadable", t.flowing),
                    t.emittedReadable = !0,
                    r.nextTick(N, e))
                }
                function N(e) {
                    var t = e._readableState;
                    u("emitReadable_", t.destroyed, t.length, t.ended),
                    t.destroyed || !t.length && !t.ended || (e.emit("readable"),
                    t.emittedReadable = !1),
                    t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark,
                    D(e)
                }
                function j(e, t) {
                    t.readingMore || (t.readingMore = !0,
                    r.nextTick(P, e, t))
                }
                function P(e, t) {
                    for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length); ) {
                        var r = t.length;
                        if (u("maybeReadMore read 0"),
                        e.read(0),
                        r === t.length)
                            break
                    }
                    t.readingMore = !1
                }
                function I(e) {
                    var t = e._readableState;
                    t.readableListening = e.listenerCount("readable") > 0,
                    t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume()
                }
                function C(e) {
                    u("readable nexttick read 0"),
                    e.read(0)
                }
                function L(e, t) {
                    u("resume", t.reading),
                    t.reading || e.read(0),
                    t.resumeScheduled = !1,
                    e.emit("resume"),
                    D(e),
                    t.flowing && !t.reading && e.read(0)
                }
                function D(e) {
                    var t = e._readableState;
                    for (u("flow", t.flowing); t.flowing && null !== e.read(); )
                        ;
                }
                function $(e, t) {
                    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length),
                    t.buffer.clear()) : r = t.buffer.consume(e, t.decoder),
                    r);
                    var r
                }
                function B(e) {
                    var t = e._readableState;
                    u("endReadable", t.endEmitted),
                    t.endEmitted || (t.ended = !0,
                    r.nextTick(F, t, e))
                }
                function F(e, t) {
                    if (u("endReadableNT", e.endEmitted, e.length),
                    !e.endEmitted && 0 === e.length && (e.endEmitted = !0,
                    t.readable = !1,
                    t.emit("end"),
                    e.autoDestroy)) {
                        var r = t._writableState;
                        (!r || r.autoDestroy && r.finished) && t.destroy()
                    }
                }
                function U(e, t) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (e[r] === t)
                            return r;
                    return -1
                }
                R.prototype.read = function(e) {
                    u("read", e),
                    e = parseInt(e, 10);
                    var t = this._readableState
                      , r = e;
                    if (0 !== e && (t.emittedReadable = !1),
                    0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                        return u("read: emitReadable", t.length, t.ended),
                        0 === t.length && t.ended ? B(this) : M(this),
                        null;
                    if (0 === (e = k(e, t)) && t.ended)
                        return 0 === t.length && B(this),
                        null;
                    var n, i = t.needReadable;
                    return u("need readable", i),
                    (0 === t.length || t.length - e < t.highWaterMark) && u("length less than watermark", i = !0),
                    t.ended || t.reading ? u("reading or ended", i = !1) : i && (u("do read"),
                    t.reading = !0,
                    t.sync = !0,
                    0 === t.length && (t.needReadable = !0),
                    this._read(t.highWaterMark),
                    t.sync = !1,
                    t.reading || (e = k(r, t))),
                    null === (n = e > 0 ? $(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark,
                    e = 0) : (t.length -= e,
                    t.awaitDrain = 0),
                    0 === t.length && (t.ended || (t.needReadable = !0),
                    r !== e && t.ended && B(this)),
                    null !== n && this.emit("data", n),
                    n
                }
                ,
                R.prototype._read = function(e) {
                    E(this, new w("_read()"))
                }
                ,
                R.prototype.pipe = function(e, t) {
                    var n = this
                      , i = this._readableState;
                    switch (i.pipesCount) {
                    case 0:
                        i.pipes = e;
                        break;
                    case 1:
                        i.pipes = [i.pipes, e];
                        break;
                    default:
                        i.pipes.push(e)
                    }
                    i.pipesCount += 1,
                    u("pipe count=%d opts=%j", i.pipesCount, t);
                    var s = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : m;
                    function a(t, r) {
                        u("onunpipe"),
                        t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0,
                        u("cleanup"),
                        e.removeListener("close", p),
                        e.removeListener("finish", g),
                        e.removeListener("drain", c),
                        e.removeListener("error", h),
                        e.removeListener("unpipe", a),
                        n.removeListener("end", l),
                        n.removeListener("end", m),
                        n.removeListener("data", f),
                        d = !0,
                        !i.awaitDrain || e._writableState && !e._writableState.needDrain || c())
                    }
                    function l() {
                        u("onend"),
                        e.end()
                    }
                    i.endEmitted ? r.nextTick(s) : n.once("end", s),
                    e.on("unpipe", a);
                    var c = function(e) {
                        return function() {
                            var t = e._readableState;
                            u("pipeOnDrain", t.awaitDrain),
                            t.awaitDrain && t.awaitDrain--,
                            0 === t.awaitDrain && o(e, "data") && (t.flowing = !0,
                            D(e))
                        }
                    }(n);
                    e.on("drain", c);
                    var d = !1;
                    function f(t) {
                        u("ondata");
                        var r = e.write(t);
                        u("dest.write", r),
                        !1 === r && ((1 === i.pipesCount && i.pipes === e || i.pipesCount > 1 && -1 !== U(i.pipes, e)) && !d && (u("false write response, pause", i.awaitDrain),
                        i.awaitDrain++),
                        n.pause())
                    }
                    function h(t) {
                        u("onerror", t),
                        m(),
                        e.removeListener("error", h),
                        0 === o(e, "error") && E(e, t)
                    }
                    function p() {
                        e.removeListener("finish", g),
                        m()
                    }
                    function g() {
                        u("onfinish"),
                        e.removeListener("close", p),
                        m()
                    }
                    function m() {
                        u("unpipe"),
                        n.unpipe(e)
                    }
                    return n.on("data", f),
                    function(e, t, r) {
                        if ("function" == typeof e.prependListener)
                            return e.prependListener(t, r);
                        e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                    }(e, "error", h),
                    e.once("close", p),
                    e.once("finish", g),
                    e.emit("pipe", n),
                    i.flowing || (u("pipe resume"),
                    n.resume()),
                    e
                }
                ,
                R.prototype.unpipe = function(e) {
                    var t = this._readableState
                      , r = {
                        hasUnpiped: !1
                    };
                    if (0 === t.pipesCount)
                        return this;
                    if (1 === t.pipesCount)
                        return e && e !== t.pipes || (e || (e = t.pipes),
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1,
                        e && e.emit("unpipe", this, r)),
                        this;
                    if (!e) {
                        var n = t.pipes
                          , i = t.pipesCount;
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1;
                        for (var o = 0; o < i; o++)
                            n[o].emit("unpipe", this, {
                                hasUnpiped: !1
                            });
                        return this
                    }
                    var s = U(t.pipes, e);
                    return -1 === s || (t.pipes.splice(s, 1),
                    t.pipesCount -= 1,
                    1 === t.pipesCount && (t.pipes = t.pipes[0]),
                    e.emit("unpipe", this, r)),
                    this
                }
                ,
                R.prototype.on = function(e, t) {
                    var n = s.prototype.on.call(this, e, t)
                      , i = this._readableState;
                    return "data" === e ? (i.readableListening = this.listenerCount("readable") > 0,
                    !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0,
                    i.flowing = !1,
                    i.emittedReadable = !1,
                    u("on readable", i.length, i.reading),
                    i.length ? M(this) : i.reading || r.nextTick(C, this))),
                    n
                }
                ,
                R.prototype.addListener = R.prototype.on,
                R.prototype.removeListener = function(e, t) {
                    var n = s.prototype.removeListener.call(this, e, t);
                    return "readable" === e && r.nextTick(I, this),
                    n
                }
                ,
                R.prototype.removeAllListeners = function(e) {
                    var t = s.prototype.removeAllListeners.apply(this, arguments);
                    return "readable" !== e && void 0 !== e || r.nextTick(I, this),
                    t
                }
                ,
                R.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (u("resume"),
                    e.flowing = !e.readableListening,
                    function(e, t) {
                        t.resumeScheduled || (t.resumeScheduled = !0,
                        r.nextTick(L, e, t))
                    }(this, e)),
                    e.paused = !1,
                    this
                }
                ,
                R.prototype.pause = function() {
                    return u("call pause flowing=%j", this._readableState.flowing),
                    !1 !== this._readableState.flowing && (u("pause"),
                    this._readableState.flowing = !1,
                    this.emit("pause")),
                    this._readableState.paused = !0,
                    this
                }
                ,
                R.prototype.wrap = function(e) {
                    var t = this
                      , r = this._readableState
                      , n = !1;
                    for (var i in e.on("end", (function() {
                        if (u("wrapped end"),
                        r.decoder && !r.ended) {
                            var e = r.decoder.end();
                            e && e.length && t.push(e)
                        }
                        t.push(null)
                    }
                    )),
                    e.on("data", (function(i) {
                        (u("wrapped data"),
                        r.decoder && (i = r.decoder.write(i)),
                        r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0,
                        e.pause()))
                    }
                    )),
                    e)
                        void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                            return function() {
                                return e[t].apply(e, arguments)
                            }
                        }(i));
                    for (var o = 0; o < S.length; o++)
                        e.on(S[o], this.emit.bind(this, S[o]));
                    return this._read = function(t) {
                        u("wrapped _read", t),
                        n && (n = !1,
                        e.resume())
                    }
                    ,
                    this
                }
                ,
                "function" == typeof Symbol && (R.prototype[Symbol.asyncIterator] = function() {
                    return void 0 === f && (f = e("./internal/streams/async_iterator")),
                    f(this)
                }
                ),
                Object.defineProperty(R.prototype, "readableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.highWaterMark
                    }
                }),
                Object.defineProperty(R.prototype, "readableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState && this._readableState.buffer
                    }
                }),
                Object.defineProperty(R.prototype, "readableFlowing", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.flowing
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.flowing = e)
                    }
                }),
                R._fromList = $,
                Object.defineProperty(R.prototype, "readableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.length
                    }
                }),
                "function" == typeof Symbol && (R.from = function(t, r) {
                    return void 0 === h && (h = e("./internal/streams/from")),
                    h(R, t, r)
                }
                )
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 9,
        "./_stream_duplex": 10,
        "./internal/streams/async_iterator": 15,
        "./internal/streams/buffer_list": 16,
        "./internal/streams/destroy": 17,
        "./internal/streams/from": 19,
        "./internal/streams/state": 21,
        "./internal/streams/stream": 22,
        _process: 178,
        buffer: 124,
        events: 130,
        inherits: 169,
        "string_decoder/": 238,
        util: 123
    }],
    13: [function(e, t, r) {
        "use strict";
        t.exports = c;
        var n = e("../errors").codes
          , i = n.ERR_METHOD_NOT_IMPLEMENTED
          , o = n.ERR_MULTIPLE_CALLBACK
          , s = n.ERR_TRANSFORM_ALREADY_TRANSFORMING
          , a = n.ERR_TRANSFORM_WITH_LENGTH_0
          , l = e("./_stream_duplex");
        function u(e, t) {
            var r = this._transformState;
            r.transforming = !1;
            var n = r.writecb;
            if (null === n)
                return this.emit("error", new o);
            r.writechunk = null,
            r.writecb = null,
            null != t && this.push(t),
            n(e);
            var i = this._readableState;
            i.reading = !1,
            (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
        }
        function c(e) {
            if (!(this instanceof c))
                return new c(e);
            l.call(this, e),
            this._transformState = {
                afterTransform: u.bind(this),
                needTransform: !1,
                transforming: !1,
                writecb: null,
                writechunk: null,
                writeencoding: null
            },
            this._readableState.needReadable = !0,
            this._readableState.sync = !1,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", d)
        }
        function d() {
            var e = this;
            "function" != typeof this._flush || this._readableState.destroyed ? f(this, null, null) : this._flush((function(t, r) {
                f(e, t, r)
            }
            ))
        }
        function f(e, t, r) {
            if (t)
                return e.emit("error", t);
            if (null != r && e.push(r),
            e._writableState.length)
                throw new a;
            if (e._transformState.transforming)
                throw new s;
            return e.push(null)
        }
        e("inherits")(c, l),
        c.prototype.push = function(e, t) {
            return this._transformState.needTransform = !1,
            l.prototype.push.call(this, e, t)
        }
        ,
        c.prototype._transform = function(e, t, r) {
            r(new i("_transform()"))
        }
        ,
        c.prototype._write = function(e, t, r) {
            var n = this._transformState;
            if (n.writecb = r,
            n.writechunk = e,
            n.writeencoding = t,
            !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
            }
        }
        ,
        c.prototype._read = function(e) {
            var t = this._transformState;
            null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0,
            this._transform(t.writechunk, t.writeencoding, t.afterTransform))
        }
        ,
        c.prototype._destroy = function(e, t) {
            l.prototype._destroy.call(this, e, (function(e) {
                t(e)
            }
            ))
        }
    }
    , {
        "../errors": 9,
        "./_stream_duplex": 10,
        inherits: 169
    }],
    14: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                function i(e) {
                    var t = this;
                    this.next = null,
                    this.entry = null,
                    this.finish = function() {
                        !function(e, t, r) {
                            var n = e.entry;
                            e.entry = null;
                            for (; n; ) {
                                var i = n.callback;
                                t.pendingcb--,
                                i(r),
                                n = n.next
                            }
                            t.corkedRequestsFree.next = e
                        }(t, e)
                    }
                }
                var o;
                t.exports = R,
                R.WritableState = A;
                var s = {
                    deprecate: e("util-deprecate")
                }
                  , a = e("./internal/streams/stream")
                  , l = e("buffer").Buffer
                  , u = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var c, d = e("./internal/streams/destroy"), f = e("./internal/streams/state").getHighWaterMark, h = e("../errors").codes, p = h.ERR_INVALID_ARG_TYPE, g = h.ERR_METHOD_NOT_IMPLEMENTED, m = h.ERR_MULTIPLE_CALLBACK, b = h.ERR_STREAM_CANNOT_PIPE, y = h.ERR_STREAM_DESTROYED, v = h.ERR_STREAM_NULL_VALUES, w = h.ERR_STREAM_WRITE_AFTER_END, _ = h.ERR_UNKNOWN_ENCODING, E = d.errorOrDestroy;
                function S() {}
                function A(t, n, s) {
                    o = o || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof s && (s = n instanceof o),
                    this.objectMode = !!t.objectMode,
                    s && (this.objectMode = this.objectMode || !!t.writableObjectMode),
                    this.highWaterMark = f(this, t, "writableHighWaterMark", s),
                    this.finalCalled = !1,
                    this.needDrain = !1,
                    this.ending = !1,
                    this.ended = !1,
                    this.finished = !1,
                    this.destroyed = !1;
                    var a = !1 === t.decodeStrings;
                    this.decodeStrings = !a,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.length = 0,
                    this.writing = !1,
                    this.corked = 0,
                    this.sync = !0,
                    this.bufferProcessing = !1,
                    this.onwrite = function(e) {
                        !function(e, t) {
                            var n = e._writableState
                              , i = n.sync
                              , o = n.writecb;
                            if ("function" != typeof o)
                                throw new m;
                            if (function(e) {
                                e.writing = !1,
                                e.writecb = null,
                                e.length -= e.writelen,
                                e.writelen = 0
                            }(n),
                            t)
                                !function(e, t, n, i, o) {
                                    --t.pendingcb,
                                    n ? (r.nextTick(o, i),
                                    r.nextTick(N, e, t),
                                    e._writableState.errorEmitted = !0,
                                    E(e, i)) : (o(i),
                                    e._writableState.errorEmitted = !0,
                                    E(e, i),
                                    N(e, t))
                                }(e, n, i, t, o);
                            else {
                                var s = k(n) || e.destroyed;
                                s || n.corked || n.bufferProcessing || !n.bufferedRequest || O(e, n),
                                i ? r.nextTick(T, e, n, s, o) : T(e, n, s, o)
                            }
                        }(n, e)
                    }
                    ,
                    this.writecb = null,
                    this.writelen = 0,
                    this.bufferedRequest = null,
                    this.lastBufferedRequest = null,
                    this.pendingcb = 0,
                    this.prefinished = !1,
                    this.errorEmitted = !1,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.bufferedRequestCount = 0,
                    this.corkedRequestsFree = new i(this)
                }
                function R(t) {
                    var r = this instanceof (o = o || e("./_stream_duplex"));
                    if (!r && !c.call(R, this))
                        return new R(t);
                    this._writableState = new A(t,this,r),
                    this.writable = !0,
                    t && ("function" == typeof t.write && (this._write = t.write),
                    "function" == typeof t.writev && (this._writev = t.writev),
                    "function" == typeof t.destroy && (this._destroy = t.destroy),
                    "function" == typeof t.final && (this._final = t.final)),
                    a.call(this)
                }
                function x(e, t, r, n, i, o, s) {
                    t.writelen = n,
                    t.writecb = s,
                    t.writing = !0,
                    t.sync = !0,
                    t.destroyed ? t.onwrite(new y("write")) : r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite),
                    t.sync = !1
                }
                function T(e, t, r, n) {
                    r || function(e, t) {
                        0 === t.length && t.needDrain && (t.needDrain = !1,
                        e.emit("drain"))
                    }(e, t),
                    t.pendingcb--,
                    n(),
                    N(e, t)
                }
                function O(e, t) {
                    t.bufferProcessing = !0;
                    var r = t.bufferedRequest;
                    if (e._writev && r && r.next) {
                        var n = t.bufferedRequestCount
                          , o = new Array(n)
                          , s = t.corkedRequestsFree;
                        s.entry = r;
                        for (var a = 0, l = !0; r; )
                            o[a] = r,
                            r.isBuf || (l = !1),
                            r = r.next,
                            a += 1;
                        o.allBuffers = l,
                        x(e, t, !0, t.length, o, "", s.finish),
                        t.pendingcb++,
                        t.lastBufferedRequest = null,
                        s.next ? (t.corkedRequestsFree = s.next,
                        s.next = null) : t.corkedRequestsFree = new i(t),
                        t.bufferedRequestCount = 0
                    } else {
                        for (; r; ) {
                            var u = r.chunk
                              , c = r.encoding
                              , d = r.callback;
                            if (x(e, t, !1, t.objectMode ? 1 : u.length, u, c, d),
                            r = r.next,
                            t.bufferedRequestCount--,
                            t.writing)
                                break
                        }
                        null === r && (t.lastBufferedRequest = null)
                    }
                    t.bufferedRequest = r,
                    t.bufferProcessing = !1
                }
                function k(e) {
                    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
                }
                function M(e, t) {
                    e._final((function(r) {
                        t.pendingcb--,
                        r && E(e, r),
                        t.prefinished = !0,
                        e.emit("prefinish"),
                        N(e, t)
                    }
                    ))
                }
                function N(e, t) {
                    var n = k(t);
                    if (n && (function(e, t) {
                        t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0,
                        e.emit("prefinish")) : (t.pendingcb++,
                        t.finalCalled = !0,
                        r.nextTick(M, e, t)))
                    }(e, t),
                    0 === t.pendingcb && (t.finished = !0,
                    e.emit("finish"),
                    t.autoDestroy))) {
                        var i = e._readableState;
                        (!i || i.autoDestroy && i.endEmitted) && e.destroy()
                    }
                    return n
                }
                e("inherits")(R, a),
                A.prototype.getBuffer = function() {
                    for (var e = this.bufferedRequest, t = []; e; )
                        t.push(e),
                        e = e.next;
                    return t
                }
                ,
                function() {
                    try {
                        Object.defineProperty(A.prototype, "buffer", {
                            get: s.deprecate((function() {
                                return this.getBuffer()
                            }
                            ), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (e) {}
                }(),
                "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance],
                Object.defineProperty(R, Symbol.hasInstance, {
                    value: function(e) {
                        return !!c.call(this, e) || this === R && (e && e._writableState instanceof A)
                    }
                })) : c = function(e) {
                    return e instanceof this
                }
                ,
                R.prototype.pipe = function() {
                    E(this, new b)
                }
                ,
                R.prototype.write = function(e, t, n) {
                    var i, o = this._writableState, s = !1, a = !o.objectMode && (i = e,
                    l.isBuffer(i) || i instanceof u);
                    return a && !l.isBuffer(e) && (e = function(e) {
                        return l.from(e)
                    }(e)),
                    "function" == typeof t && (n = t,
                    t = null),
                    a ? t = "buffer" : t || (t = o.defaultEncoding),
                    "function" != typeof n && (n = S),
                    o.ending ? function(e, t) {
                        var n = new w;
                        E(e, n),
                        r.nextTick(t, n)
                    }(this, n) : (a || function(e, t, n, i) {
                        var o;
                        return null === n ? o = new v : "string" == typeof n || t.objectMode || (o = new p("chunk",["string", "Buffer"],n)),
                        !o || (E(e, o),
                        r.nextTick(i, o),
                        !1)
                    }(this, o, e, n)) && (o.pendingcb++,
                    s = function(e, t, r, n, i, o) {
                        if (!r) {
                            var s = function(e, t, r) {
                                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = l.from(t, r));
                                return t
                            }(t, n, i);
                            n !== s && (r = !0,
                            i = "buffer",
                            n = s)
                        }
                        var a = t.objectMode ? 1 : n.length;
                        t.length += a;
                        var u = t.length < t.highWaterMark;
                        u || (t.needDrain = !0);
                        if (t.writing || t.corked) {
                            var c = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: n,
                                encoding: i,
                                isBuf: r,
                                callback: o,
                                next: null
                            },
                            c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest,
                            t.bufferedRequestCount += 1
                        } else
                            x(e, t, !1, a, n, i, o);
                        return u
                    }(this, o, a, e, t, n)),
                    s
                }
                ,
                R.prototype.cork = function() {
                    this._writableState.corked++
                }
                ,
                R.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--,
                    e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || O(this, e))
                }
                ,
                R.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()),
                    !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                        throw new _(e);
                    return this._writableState.defaultEncoding = e,
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(R.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                R.prototype._write = function(e, t, r) {
                    r(new g("_write()"))
                }
                ,
                R.prototype._writev = null,
                R.prototype.end = function(e, t, n) {
                    var i = this._writableState;
                    return "function" == typeof e ? (n = e,
                    e = null,
                    t = null) : "function" == typeof t && (n = t,
                    t = null),
                    null != e && this.write(e, t),
                    i.corked && (i.corked = 1,
                    this.uncork()),
                    i.ending || function(e, t, n) {
                        t.ending = !0,
                        N(e, t),
                        n && (t.finished ? r.nextTick(n) : e.once("finish", n));
                        t.ended = !0,
                        e.writable = !1
                    }(this, i, n),
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = d.destroy,
                R.prototype._undestroy = d.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 9,
        "./_stream_duplex": 10,
        "./internal/streams/destroy": 17,
        "./internal/streams/state": 21,
        "./internal/streams/stream": 22,
        _process: 178,
        buffer: 124,
        inherits: 169,
        "util-deprecate": 258
    }],
    15: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n;
                function i(e, t, r) {
                    return (t = function(e) {
                        var t = function(e, t) {
                            if ("object" != typeof e || null === e)
                                return e;
                            var r = e[Symbol.toPrimitive];
                            if (void 0 !== r) {
                                var n = r.call(e, t || "default");
                                if ("object" != typeof n)
                                    return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return ("string" === t ? String : Number)(e)
                        }(e, "string");
                        return "symbol" == typeof t ? t : String(t)
                    }(t))in e ? Object.defineProperty(e, t, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = r,
                    e
                }
                var o = e("./end-of-stream")
                  , s = Symbol("lastResolve")
                  , a = Symbol("lastReject")
                  , l = Symbol("error")
                  , u = Symbol("ended")
                  , c = Symbol("lastPromise")
                  , d = Symbol("handlePromise")
                  , f = Symbol("stream");
                function h(e, t) {
                    return {
                        value: e,
                        done: t
                    }
                }
                function p(e) {
                    var t = e[s];
                    if (null !== t) {
                        var r = e[f].read();
                        null !== r && (e[c] = null,
                        e[s] = null,
                        e[a] = null,
                        t(h(r, !1)))
                    }
                }
                function g(e) {
                    r.nextTick(p, e)
                }
                var m = Object.getPrototypeOf((function() {}
                ))
                  , b = Object.setPrototypeOf((i(n = {
                    get stream() {
                        return this[f]
                    },
                    next: function() {
                        var e = this
                          , t = this[l];
                        if (null !== t)
                            return Promise.reject(t);
                        if (this[u])
                            return Promise.resolve(h(void 0, !0));
                        if (this[f].destroyed)
                            return new Promise((function(t, n) {
                                r.nextTick((function() {
                                    e[l] ? n(e[l]) : t(h(void 0, !0))
                                }
                                ))
                            }
                            ));
                        var n, i = this[c];
                        if (i)
                            n = new Promise(function(e, t) {
                                return function(r, n) {
                                    e.then((function() {
                                        t[u] ? r(h(void 0, !0)) : t[d](r, n)
                                    }
                                    ), n)
                                }
                            }(i, this));
                        else {
                            var o = this[f].read();
                            if (null !== o)
                                return Promise.resolve(h(o, !1));
                            n = new Promise(this[d])
                        }
                        return this[c] = n,
                        n
                    }
                }, Symbol.asyncIterator, (function() {
                    return this
                }
                )),
                i(n, "return", (function() {
                    var e = this;
                    return new Promise((function(t, r) {
                        e[f].destroy(null, (function(e) {
                            e ? r(e) : t(h(void 0, !0))
                        }
                        ))
                    }
                    ))
                }
                )),
                n), m);
                t.exports = function(e) {
                    var t, r = Object.create(b, (i(t = {}, f, {
                        value: e,
                        writable: !0
                    }),
                    i(t, s, {
                        value: null,
                        writable: !0
                    }),
                    i(t, a, {
                        value: null,
                        writable: !0
                    }),
                    i(t, l, {
                        value: null,
                        writable: !0
                    }),
                    i(t, u, {
                        value: e._readableState.endEmitted,
                        writable: !0
                    }),
                    i(t, d, {
                        value: function(e, t) {
                            var n = r[f].read();
                            n ? (r[c] = null,
                            r[s] = null,
                            r[a] = null,
                            e(h(n, !1))) : (r[s] = e,
                            r[a] = t)
                        },
                        writable: !0
                    }),
                    t));
                    return r[c] = null,
                    o(e, (function(e) {
                        if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                            var t = r[a];
                            return null !== t && (r[c] = null,
                            r[s] = null,
                            r[a] = null,
                            t(e)),
                            void (r[l] = e)
                        }
                        var n = r[s];
                        null !== n && (r[c] = null,
                        r[s] = null,
                        r[a] = null,
                        n(h(void 0, !0))),
                        r[u] = !0
                    }
                    )),
                    e.on("readable", g.bind(null, r)),
                    r
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./end-of-stream": 18,
        _process: 178
    }],
    16: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            var r = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                t && (n = n.filter((function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                }
                ))),
                r.push.apply(r, n)
            }
            return r
        }
        function i(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? n(Object(r), !0).forEach((function(t) {
                    o(e, t, r[t])
                }
                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach((function(t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                }
                ))
            }
            return e
        }
        function o(e, t, r) {
            return (t = a(t))in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r,
            e
        }
        function s(e, t) {
            for (var r = 0; r < t.length; r++) {
                var n = t[r];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(e, a(n.key), n)
            }
        }
        function a(e) {
            var t = function(e, t) {
                if ("object" != typeof e || null === e)
                    return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                    var n = r.call(e, t || "default");
                    if ("object" != typeof n)
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === t ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof t ? t : String(t)
        }
        var l = e("buffer").Buffer
          , u = e("util").inspect
          , c = u && u.custom || "inspect";
        t.exports = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            var t, r, n;
            return t = e,
            (r = [{
                key: "push",
                value: function(e) {
                    var t = {
                        data: e,
                        next: null
                    };
                    this.length > 0 ? this.tail.next = t : this.head = t,
                    this.tail = t,
                    ++this.length
                }
            }, {
                key: "unshift",
                value: function(e) {
                    var t = {
                        data: e,
                        next: this.head
                    };
                    0 === this.length && (this.tail = t),
                    this.head = t,
                    ++this.length
                }
            }, {
                key: "shift",
                value: function() {
                    if (0 !== this.length) {
                        var e = this.head.data;
                        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                        --this.length,
                        e
                    }
                }
            }, {
                key: "clear",
                value: function() {
                    this.head = this.tail = null,
                    this.length = 0
                }
            }, {
                key: "join",
                value: function(e) {
                    if (0 === this.length)
                        return "";
                    for (var t = this.head, r = "" + t.data; t = t.next; )
                        r += e + t.data;
                    return r
                }
            }, {
                key: "concat",
                value: function(e) {
                    if (0 === this.length)
                        return l.alloc(0);
                    for (var t, r, n, i = l.allocUnsafe(e >>> 0), o = this.head, s = 0; o; )
                        t = o.data,
                        r = i,
                        n = s,
                        l.prototype.copy.call(t, r, n),
                        s += o.data.length,
                        o = o.next;
                    return i
                }
            }, {
                key: "consume",
                value: function(e, t) {
                    var r;
                    return e < this.head.data.length ? (r = this.head.data.slice(0, e),
                    this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e),
                    r
                }
            }, {
                key: "first",
                value: function() {
                    return this.head.data
                }
            }, {
                key: "_getString",
                value: function(e) {
                    var t = this.head
                      , r = 1
                      , n = t.data;
                    for (e -= n.length; t = t.next; ) {
                        var i = t.data
                          , o = e > i.length ? i.length : e;
                        if (o === i.length ? n += i : n += i.slice(0, e),
                        0 == (e -= o)) {
                            o === i.length ? (++r,
                            t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t,
                            t.data = i.slice(o));
                            break
                        }
                        ++r
                    }
                    return this.length -= r,
                    n
                }
            }, {
                key: "_getBuffer",
                value: function(e) {
                    var t = l.allocUnsafe(e)
                      , r = this.head
                      , n = 1;
                    for (r.data.copy(t),
                    e -= r.data.length; r = r.next; ) {
                        var i = r.data
                          , o = e > i.length ? i.length : e;
                        if (i.copy(t, t.length - e, 0, o),
                        0 == (e -= o)) {
                            o === i.length ? (++n,
                            r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r,
                            r.data = i.slice(o));
                            break
                        }
                        ++n
                    }
                    return this.length -= n,
                    t
                }
            }, {
                key: c,
                value: function(e, t) {
                    return u(this, i(i({}, t), {}, {
                        depth: 0,
                        customInspect: !1
                    }))
                }
            }]) && s(t.prototype, r),
            n && s(t, n),
            Object.defineProperty(t, "prototype", {
                writable: !1
            }),
            e
        }()
    }
    , {
        buffer: 124,
        util: 123
    }],
    17: [function(e, t, r) {
        (function(e) {
            (function() {
                "use strict";
                function r(e, t) {
                    i(e, t),
                    n(e)
                }
                function n(e) {
                    e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close")
                }
                function i(e, t) {
                    e.emit("error", t)
                }
                t.exports = {
                    destroy: function(t, o) {
                        var s = this
                          , a = this._readableState && this._readableState.destroyed
                          , l = this._writableState && this._writableState.destroyed;
                        return a || l ? (o ? o(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0,
                        e.nextTick(i, this, t)) : e.nextTick(i, this, t)),
                        this) : (this._readableState && (this._readableState.destroyed = !0),
                        this._writableState && (this._writableState.destroyed = !0),
                        this._destroy(t || null, (function(t) {
                            !o && t ? s._writableState ? s._writableState.errorEmitted ? e.nextTick(n, s) : (s._writableState.errorEmitted = !0,
                            e.nextTick(r, s, t)) : e.nextTick(r, s, t) : o ? (e.nextTick(n, s),
                            o(t)) : e.nextTick(n, s)
                        }
                        )),
                        this)
                    },
                    undestroy: function() {
                        this._readableState && (this._readableState.destroyed = !1,
                        this._readableState.reading = !1,
                        this._readableState.ended = !1,
                        this._readableState.endEmitted = !1),
                        this._writableState && (this._writableState.destroyed = !1,
                        this._writableState.ended = !1,
                        this._writableState.ending = !1,
                        this._writableState.finalCalled = !1,
                        this._writableState.prefinished = !1,
                        this._writableState.finished = !1,
                        this._writableState.errorEmitted = !1)
                    },
                    errorOrDestroy: function(e, t) {
                        var r = e._readableState
                          , n = e._writableState;
                        r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t)
                    }
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178
    }],
    18: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
        function i() {}
        t.exports = function e(t, r, o) {
            if ("function" == typeof r)
                return e(t, null, r);
            r || (r = {}),
            o = function(e) {
                var t = !1;
                return function() {
                    if (!t) {
                        t = !0;
                        for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++)
                            n[i] = arguments[i];
                        e.apply(this, n)
                    }
                }
            }(o || i);
            var s = r.readable || !1 !== r.readable && t.readable
              , a = r.writable || !1 !== r.writable && t.writable
              , l = function() {
                t.writable || c()
            }
              , u = t._writableState && t._writableState.finished
              , c = function() {
                a = !1,
                u = !0,
                s || o.call(t)
            }
              , d = t._readableState && t._readableState.endEmitted
              , f = function() {
                s = !1,
                d = !0,
                a || o.call(t)
            }
              , h = function(e) {
                o.call(t, e)
            }
              , p = function() {
                var e;
                return s && !d ? (t._readableState && t._readableState.ended || (e = new n),
                o.call(t, e)) : a && !u ? (t._writableState && t._writableState.ended || (e = new n),
                o.call(t, e)) : void 0
            }
              , g = function() {
                t.req.on("finish", c)
            };
            return !function(e) {
                return e.setHeader && "function" == typeof e.abort
            }(t) ? a && !t._writableState && (t.on("end", l),
            t.on("close", l)) : (t.on("complete", c),
            t.on("abort", p),
            t.req ? g() : t.on("request", g)),
            t.on("end", f),
            t.on("finish", c),
            !1 !== r.error && t.on("error", h),
            t.on("close", p),
            function() {
                t.removeListener("complete", c),
                t.removeListener("abort", p),
                t.removeListener("request", g),
                t.req && t.req.removeListener("finish", c),
                t.removeListener("end", l),
                t.removeListener("close", l),
                t.removeListener("finish", c),
                t.removeListener("end", f),
                t.removeListener("error", h),
                t.removeListener("close", p)
            }
        }
    }
    , {
        "../../../errors": 9
    }],
    19: [function(e, t, r) {
        t.exports = function() {
            throw new Error("Readable.from is not available in the browser")
        }
    }
    , {}],
    20: [function(e, t, r) {
        "use strict";
        var n;
        var i = e("../../../errors").codes
          , o = i.ERR_MISSING_ARGS
          , s = i.ERR_STREAM_DESTROYED;
        function a(e) {
            if (e)
                throw e
        }
        function l(e) {
            e()
        }
        function u(e, t) {
            return e.pipe(t)
        }
        t.exports = function() {
            for (var t = arguments.length, r = new Array(t), i = 0; i < t; i++)
                r[i] = arguments[i];
            var c, d = function(e) {
                return e.length ? "function" != typeof e[e.length - 1] ? a : e.pop() : a
            }(r);
            if (Array.isArray(r[0]) && (r = r[0]),
            r.length < 2)
                throw new o("streams");
            var f = r.map((function(t, i) {
                var o = i < r.length - 1;
                return function(t, r, i, o) {
                    o = function(e) {
                        var t = !1;
                        return function() {
                            t || (t = !0,
                            e.apply(void 0, arguments))
                        }
                    }(o);
                    var a = !1;
                    t.on("close", (function() {
                        a = !0
                    }
                    )),
                    void 0 === n && (n = e("./end-of-stream")),
                    n(t, {
                        readable: r,
                        writable: i
                    }, (function(e) {
                        if (e)
                            return o(e);
                        a = !0,
                        o()
                    }
                    ));
                    var l = !1;
                    return function(e) {
                        if (!a && !l)
                            return l = !0,
                            function(e) {
                                return e.setHeader && "function" == typeof e.abort
                            }(t) ? t.abort() : "function" == typeof t.destroy ? t.destroy() : void o(e || new s("pipe"))
                    }
                }(t, o, i > 0, (function(e) {
                    c || (c = e),
                    e && f.forEach(l),
                    o || (f.forEach(l),
                    d(c))
                }
                ))
            }
            ));
            return r.reduce(u)
        }
    }
    , {
        "../../../errors": 9,
        "./end-of-stream": 18
    }],
    21: [function(e, t, r) {
        "use strict";
        var n = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
        t.exports = {
            getHighWaterMark: function(e, t, r, i) {
                var o = function(e, t, r) {
                    return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null
                }(t, i, r);
                if (null != o) {
                    if (!isFinite(o) || Math.floor(o) !== o || o < 0)
                        throw new n(i ? r : "highWaterMark",o);
                    return Math.floor(o)
                }
                return e.objectMode ? 16 : 16384
            }
        }
    }
    , {
        "../../../errors": 9
    }],
    22: [function(e, t, r) {
        t.exports = e("events").EventEmitter
    }
    , {
        events: 130
    }],
    23: [function(e, t, r) {
        (r = t.exports = e("./lib/_stream_readable.js")).Stream = r,
        r.Readable = r,
        r.Writable = e("./lib/_stream_writable.js"),
        r.Duplex = e("./lib/_stream_duplex.js"),
        r.Transform = e("./lib/_stream_transform.js"),
        r.PassThrough = e("./lib/_stream_passthrough.js"),
        r.finished = e("./lib/internal/streams/end-of-stream.js"),
        r.pipeline = e("./lib/internal/streams/pipeline.js")
    }
    , {
        "./lib/_stream_duplex.js": 10,
        "./lib/_stream_passthrough.js": 11,
        "./lib/_stream_readable.js": 12,
        "./lib/_stream_transform.js": 13,
        "./lib/_stream_writable.js": 14,
        "./lib/internal/streams/end-of-stream.js": 18,
        "./lib/internal/streams/pipeline.js": 20
    }],
    24: [function(e, t, r) {
        "use strict";
        var n = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        ;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.EthereumProviderError = r.JsonRpcError = void 0;
        const i = e("@metamask/utils")
          , o = n(e("fast-safe-stringify"))
          , s = e("./utils");
        class a extends Error {
            constructor(e, t, r) {
                if (!Number.isInteger(e))
                    throw new Error('"code" must be an integer.');
                if (!t || "string" != typeof t)
                    throw new Error('"message" must be a non-empty string.');
                super(t),
                this.code = e,
                void 0 !== r && (this.data = r)
            }
            serialize() {
                const e = {
                    code: this.code,
                    message: this.message
                };
                return void 0 !== this.data && (e.data = this.data,
                (0,
                i.isPlainObject)(this.data) && (e.data.cause = (0,
                s.serializeCause)(this.data.cause))),
                this.stack && (e.stack = this.stack),
                e
            }
            toString() {
                return (0,
                o.default)(this.serialize(), l, 2)
            }
        }
        r.JsonRpcError = a;
        function l(e, t) {
            if ("[Circular]" !== t)
                return t
        }
        r.EthereumProviderError = class extends a {
            constructor(e, t, r) {
                if (!function(e) {
                    return Number.isInteger(e) && e >= 1e3 && e <= 4999
                }(e))
                    throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
                super(e, t, r)
            }
        }
    }
    , {
        "./utils": 28,
        "@metamask/utils": 114,
        "fast-safe-stringify": 156
    }],
    25: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.errorValues = r.errorCodes = void 0,
        r.errorCodes = {
            rpc: {
                invalidInput: -32e3,
                resourceNotFound: -32001,
                resourceUnavailable: -32002,
                transactionRejected: -32003,
                methodNotSupported: -32004,
                limitExceeded: -32005,
                parse: -32700,
                invalidRequest: -32600,
                methodNotFound: -32601,
                invalidParams: -32602,
                internal: -32603
            },
            provider: {
                userRejectedRequest: 4001,
                unauthorized: 4100,
                unsupportedMethod: 4200,
                disconnected: 4900,
                chainDisconnected: 4901
            }
        },
        r.errorValues = {
            "-32700": {
                standard: "JSON RPC 2.0",
                message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
            },
            "-32600": {
                standard: "JSON RPC 2.0",
                message: "The JSON sent is not a valid Request object."
            },
            "-32601": {
                standard: "JSON RPC 2.0",
                message: "The method does not exist / is not available."
            },
            "-32602": {
                standard: "JSON RPC 2.0",
                message: "Invalid method parameter(s)."
            },
            "-32603": {
                standard: "JSON RPC 2.0",
                message: "Internal JSON-RPC error."
            },
            "-32000": {
                standard: "EIP-1474",
                message: "Invalid input."
            },
            "-32001": {
                standard: "EIP-1474",
                message: "Resource not found."
            },
            "-32002": {
                standard: "EIP-1474",
                message: "Resource unavailable."
            },
            "-32003": {
                standard: "EIP-1474",
                message: "Transaction rejected."
            },
            "-32004": {
                standard: "EIP-1474",
                message: "Method not supported."
            },
            "-32005": {
                standard: "EIP-1474",
                message: "Request limit exceeded."
            },
            4001: {
                standard: "EIP-1193",
                message: "User rejected the request."
            },
            4100: {
                standard: "EIP-1193",
                message: "The requested account and/or method has not been authorized by the user."
            },
            4200: {
                standard: "EIP-1193",
                message: "The requested method is not supported by this Ethereum provider."
            },
            4900: {
                standard: "EIP-1193",
                message: "The provider is disconnected from all chains."
            },
            4901: {
                standard: "EIP-1193",
                message: "The provider is disconnected from the specified chain."
            }
        }
    }
    , {}],
    26: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.providerErrors = r.rpcErrors = void 0;
        const n = e("./classes")
          , i = e("./error-constants")
          , o = e("./utils");
        function s(e, t) {
            const [r,i] = l(t);
            return new n.JsonRpcError(e,r ?? (0,
            o.getMessageFromCode)(e),i)
        }
        function a(e, t) {
            const [r,i] = l(t);
            return new n.EthereumProviderError(e,r ?? (0,
            o.getMessageFromCode)(e),i)
        }
        function l(e) {
            if (e) {
                if ("string" == typeof e)
                    return [e];
                if ("object" == typeof e && !Array.isArray(e)) {
                    const {message: t, data: r} = e;
                    if (t && "string" != typeof t)
                        throw new Error("Must specify string message.");
                    return [t ?? void 0, r]
                }
            }
            return []
        }
        r.rpcErrors = {
            parse: e=>s(i.errorCodes.rpc.parse, e),
            invalidRequest: e=>s(i.errorCodes.rpc.invalidRequest, e),
            invalidParams: e=>s(i.errorCodes.rpc.invalidParams, e),
            methodNotFound: e=>s(i.errorCodes.rpc.methodNotFound, e),
            internal: e=>s(i.errorCodes.rpc.internal, e),
            server: e=>{
                if (!e || "object" != typeof e || Array.isArray(e))
                    throw new Error("Ethereum RPC Server errors must provide single object argument.");
                const {code: t} = e;
                if (!Number.isInteger(t) || t > -32005 || t < -32099)
                    throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
                return s(t, e)
            }
            ,
            invalidInput: e=>s(i.errorCodes.rpc.invalidInput, e),
            resourceNotFound: e=>s(i.errorCodes.rpc.resourceNotFound, e),
            resourceUnavailable: e=>s(i.errorCodes.rpc.resourceUnavailable, e),
            transactionRejected: e=>s(i.errorCodes.rpc.transactionRejected, e),
            methodNotSupported: e=>s(i.errorCodes.rpc.methodNotSupported, e),
            limitExceeded: e=>s(i.errorCodes.rpc.limitExceeded, e)
        },
        r.providerErrors = {
            userRejectedRequest: e=>a(i.errorCodes.provider.userRejectedRequest, e),
            unauthorized: e=>a(i.errorCodes.provider.unauthorized, e),
            unsupportedMethod: e=>a(i.errorCodes.provider.unsupportedMethod, e),
            disconnected: e=>a(i.errorCodes.provider.disconnected, e),
            chainDisconnected: e=>a(i.errorCodes.provider.chainDisconnected, e),
            custom: e=>{
                if (!e || "object" != typeof e || Array.isArray(e))
                    throw new Error("Ethereum Provider custom errors must provide single object argument.");
                const {code: t, message: r, data: i} = e;
                if (!r || "string" != typeof r)
                    throw new Error('"message" must be a nonempty string');
                return new n.EthereumProviderError(t,r,i)
            }
        }
    }
    , {
        "./classes": 24,
        "./error-constants": 25,
        "./utils": 28
    }],
    27: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.errorCodes = r.providerErrors = r.rpcErrors = r.getMessageFromCode = r.serializeError = r.serializeCause = r.EthereumProviderError = r.JsonRpcError = void 0;
        var n = e("./classes");
        Object.defineProperty(r, "JsonRpcError", {
            enumerable: !0,
            get: function() {
                return n.JsonRpcError
            }
        }),
        Object.defineProperty(r, "EthereumProviderError", {
            enumerable: !0,
            get: function() {
                return n.EthereumProviderError
            }
        });
        var i = e("./utils");
        Object.defineProperty(r, "serializeCause", {
            enumerable: !0,
            get: function() {
                return i.serializeCause
            }
        }),
        Object.defineProperty(r, "serializeError", {
            enumerable: !0,
            get: function() {
                return i.serializeError
            }
        }),
        Object.defineProperty(r, "getMessageFromCode", {
            enumerable: !0,
            get: function() {
                return i.getMessageFromCode
            }
        });
        var o = e("./errors");
        Object.defineProperty(r, "rpcErrors", {
            enumerable: !0,
            get: function() {
                return o.rpcErrors
            }
        }),
        Object.defineProperty(r, "providerErrors", {
            enumerable: !0,
            get: function() {
                return o.providerErrors
            }
        });
        var s = e("./error-constants");
        Object.defineProperty(r, "errorCodes", {
            enumerable: !0,
            get: function() {
                return s.errorCodes
            }
        })
    }
    , {
        "./classes": 24,
        "./error-constants": 25,
        "./errors": 26,
        "./utils": 28
    }],
    28: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.serializeCause = r.serializeError = r.isValidCode = r.getMessageFromCode = r.JSON_RPC_SERVER_ERROR_MESSAGE = void 0;
        const n = e("@metamask/utils")
          , i = e("./error-constants")
          , o = i.errorCodes.rpc.internal
          , s = {
            code: o,
            message: a(o)
        };
        function a(e, t="Unspecified error message. This is a bug, please report it.") {
            if (l(e)) {
                const t = e.toString();
                if ((0,
                n.hasProperty)(i.errorValues, t))
                    return i.errorValues[t].message;
                if (function(e) {
                    return e >= -32099 && e <= -32e3
                }(e))
                    return r.JSON_RPC_SERVER_ERROR_MESSAGE
            }
            return t
        }
        function l(e) {
            return Number.isInteger(e)
        }
        function u(e) {
            return Array.isArray(e) ? e.map((e=>(0,
            n.isValidJson)(e) ? e : (0,
            n.isObject)(e) ? c(e) : null)) : (0,
            n.isObject)(e) ? c(e) : (0,
            n.isValidJson)(e) ? e : null
        }
        function c(e) {
            return Object.getOwnPropertyNames(e).reduce(((t,r)=>{
                const i = e[r];
                return (0,
                n.isValidJson)(i) && (t[r] = i),
                t
            }
            ), {})
        }
        r.JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.",
        r.getMessageFromCode = a,
        r.isValidCode = l,
        r.serializeError = function(e, {fallbackError: t=s, shouldIncludeStack: r=!0}={}) {
            if (!(0,
            n.isJsonRpcError)(t))
                throw new Error("Must provide fallback error with integer number code and string message.");
            const i = function(e, t) {
                if (e && "object" == typeof e && "serialize"in e && "function" == typeof e.serialize)
                    return e.serialize();
                if ((0,
                n.isJsonRpcError)(e))
                    return e;
                const r = u(e)
                  , i = {
                    ...t,
                    data: {
                        cause: r
                    }
                };
                return i
            }(e, t);
            return r || delete i.stack,
            i
        }
        ,
        r.serializeCause = u
    }
    , {
        "./error-constants": 25,
        "@metamask/utils": 114
    }],
    29: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            InternalError: function() {
                return o
            },
            InvalidInputError: function() {
                return s
            },
            InvalidParamsError: function() {
                return a
            },
            InvalidRequestError: function() {
                return l
            },
            LimitExceededError: function() {
                return u
            },
            MethodNotFoundError: function() {
                return c
            },
            MethodNotSupportedError: function() {
                return d
            },
            ParseError: function() {
                return f
            },
            ResourceNotFoundError: function() {
                return h
            },
            ResourceUnavailableError: function() {
                return p
            },
            TransactionRejected: function() {
                return g
            },
            ChainDisconnectedError: function() {
                return m
            },
            DisconnectedError: function() {
                return b
            },
            UnauthorizedError: function() {
                return y
            },
            UnsupportedMethodError: function() {
                return v
            },
            UserRejectedRequestError: function() {
                return w
            }
        });
        const n = e("@metamask/rpc-errors")
          , i = e("./internals")
          , o = (0,
        i.createSnapError)(n.rpcErrors.internal)
          , s = (0,
        i.createSnapError)(n.rpcErrors.invalidInput)
          , a = (0,
        i.createSnapError)(n.rpcErrors.invalidParams)
          , l = (0,
        i.createSnapError)(n.rpcErrors.invalidRequest)
          , u = (0,
        i.createSnapError)(n.rpcErrors.limitExceeded)
          , c = (0,
        i.createSnapError)(n.rpcErrors.methodNotFound)
          , d = (0,
        i.createSnapError)(n.rpcErrors.methodNotSupported)
          , f = (0,
        i.createSnapError)(n.rpcErrors.parse)
          , h = (0,
        i.createSnapError)(n.rpcErrors.resourceNotFound)
          , p = (0,
        i.createSnapError)(n.rpcErrors.resourceUnavailable)
          , g = (0,
        i.createSnapError)(n.rpcErrors.transactionRejected)
          , m = (0,
        i.createSnapError)(n.providerErrors.chainDisconnected)
          , b = (0,
        i.createSnapError)(n.providerErrors.disconnected)
          , y = (0,
        i.createSnapError)(n.providerErrors.unauthorized)
          , v = (0,
        i.createSnapError)(n.providerErrors.unsupportedMethod)
          , w = (0,
        i.createSnapError)(n.providerErrors.userRejectedRequest)
    }
    , {
        "./internals": 36,
        "@metamask/rpc-errors": 27
    }],
    30: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "SnapError", {
            enumerable: !0,
            get: function() {
                return f
            }
        });
        const n = e("./internals");
        function i(e, t, r) {
            if (!t.has(e))
                throw new TypeError("attempted to " + r + " private field on non-instance");
            return t.get(e)
        }
        function o(e, t) {
            return function(e, t) {
                return t.get ? t.get.call(e) : t.value
            }(e, i(e, t, "get"))
        }
        function s(e, t, r) {
            !function(e, t) {
                if (t.has(e))
                    throw new TypeError("Cannot initialize the same private elements twice on an object")
            }(e, t),
            t.set(e, r)
        }
        function a(e, t, r) {
            return function(e, t, r) {
                if (t.set)
                    t.set.call(e, r);
                else {
                    if (!t.writable)
                        throw new TypeError("attempted to set read only private field");
                    t.value = r
                }
            }(e, i(e, t, "set"), r),
            r
        }
        var l = new WeakMap
          , u = new WeakMap
          , c = new WeakMap
          , d = new WeakMap;
        class f extends Error {
            get name() {
                return "SnapError"
            }
            get code() {
                return o(this, l)
            }
            get message() {
                return o(this, u)
            }
            get data() {
                return o(this, c)
            }
            get stack() {
                return o(this, d)
            }
            toJSON() {
                return {
                    code: n.SNAP_ERROR_CODE,
                    message: n.SNAP_ERROR_MESSAGE,
                    data: {
                        cause: {
                            code: this.code,
                            message: this.message,
                            stack: this.stack,
                            ...this.data ? {
                                data: this.data
                            } : {}
                        }
                    }
                }
            }
            serialize() {
                return this.toJSON()
            }
            constructor(e, t={}) {
                const r = (0,
                n.getErrorMessage)(e);
                super(r),
                s(this, l, {
                    writable: !0,
                    value: void 0
                }),
                s(this, u, {
                    writable: !0,
                    value: void 0
                }),
                s(this, c, {
                    writable: !0,
                    value: void 0
                }),
                s(this, d, {
                    writable: !0,
                    value: void 0
                }),
                a(this, u, r),
                a(this, l, (0,
                n.getErrorCode)(e));
                const i = {
                    ...(0,
                    n.getErrorData)(e),
                    ...t
                };
                Object.keys(i).length > 0 && a(this, c, i),
                a(this, d, super.stack)
            }
        }
    }
    , {
        "./internals": 36
    }],
    31: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            getImageData: function() {
                return o
            },
            getImageComponent: function() {
                return s
            }
        });
        const n = e("@metamask/utils")
          , i = e("./ui");
        async function o(e, t) {
            const r = await async function(e, t) {
                if ("function" != typeof fetch)
                    throw new Error(`Failed to fetch image data from "${e}": Using this function requires the "endowment:network-access" permission.`);
                return fetch(e, t).then((async t=>{
                    if (!t.ok)
                        throw new Error(`Failed to fetch image data from "${e}": ${t.status} ${t.statusText}`);
                    const r = await t.blob();
                    return (0,
                    n.assert)("image/jpeg" === r.type || "image/png" === r.type, "Expected image data to be a JPEG or PNG image."),
                    r
                }
                ))
            }(e, t)
              , i = new Uint8Array(await r.arrayBuffer());
            return `data:${r.type};base64,${(0,
            n.bytesToBase64)(i)}`
        }
        async function s(e, {width: t, height: r=t, request: s}) {
            (0,
            n.assert)("number" == typeof t && t > 0, "Expected width to be a number greater than 0."),
            (0,
            n.assert)("number" == typeof r && r > 0, "Expected height to be a number greater than 0.");
            const a = await o(e, s)
              , l = `width="${t}" height="${r}"`;
            return (0,
            i.image)(`<svg ${l.trim()} xmlns="http://www.w3.org/2000/svg"><image ${l.trim()} href="${a}" /></svg>`)
        }
    }
    , {
        "./ui": 91,
        "@metamask/utils": 114
    }],
    32: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            getErrorData: function() {
                return n.getErrorData
            },
            getErrorMessage: function() {
                return n.getErrorMessage
            },
            getErrorStack: function() {
                return n.getErrorStack
            },
            SNAP_ERROR_CODE: function() {
                return n.SNAP_ERROR_CODE
            },
            SNAP_ERROR_MESSAGE: function() {
                return n.SNAP_ERROR_MESSAGE
            },
            literal: function() {
                return n.literal
            },
            union: function() {
                return n.union
            },
            enumValue: function() {
                return n.enumValue
            },
            parseSvg: function() {
                return n.parseSvg
            },
            isSvg: function() {
                return n.isSvg
            },
            assert: function() {
                return i.assert
            }
        });
        const n = e("./internals")
          , i = e("@metamask/utils");
        function o(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        o(e("./errors"), r),
        o(e("./error-wrappers"), r),
        o(e("./images"), r),
        o(e("./types"), r),
        o(e("./ui"), r)
    }
    , {
        "./error-wrappers": 29,
        "./errors": 30,
        "./images": 31,
        "./internals": 36,
        "./types": 51,
        "./ui": 91,
        "@metamask/utils": 114
    }],
    33: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "createSnapError", {
            enumerable: !0,
            get: function() {
                return i
            }
        });
        const n = e("../errors");
        function i(e) {
            return class extends n.SnapError {
                constructor(t, r) {
                    if ("object" == typeof t) {
                        const r = e();
                        return void super({
                            code: r.code,
                            message: r.message,
                            data: t
                        })
                    }
                    const n = e(t);
                    super({
                        code: n.code,
                        message: n.message,
                        data: r
                    })
                }
            }
        }
    }
    , {
        "../errors": 30
    }],
    34: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            SNAP_ERROR_CODE: function() {
                return i
            },
            SNAP_ERROR_MESSAGE: function() {
                return o
            },
            getErrorMessage: function() {
                return s
            },
            getErrorStack: function() {
                return a
            },
            getErrorCode: function() {
                return l
            },
            getErrorData: function() {
                return u
            }
        });
        const n = e("@metamask/utils")
          , i = -31002
          , o = "Snap Error";
        function s(e) {
            return (0,
            n.isObject)(e) && (0,
            n.hasProperty)(e, "message") && "string" == typeof e.message ? e.message : String(e)
        }
        function a(e) {
            if ((0,
            n.isObject)(e) && (0,
            n.hasProperty)(e, "stack") && "string" == typeof e.stack)
                return e.stack
        }
        function l(e) {
            return (0,
            n.isObject)(e) && (0,
            n.hasProperty)(e, "code") && "number" == typeof e.code && Number.isInteger(e.code) ? e.code : -32603
        }
        function u(e) {
            return (0,
            n.isObject)(e) && (0,
            n.hasProperty)(e, "data") && "object" == typeof e.data && null !== e.data && (0,
            n.isValidJson)(e.data) && !Array.isArray(e.data) ? e.data : {}
        }
    }
    , {
        "@metamask/utils": 114
    }],
    35: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    36: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        n(e("./error-wrappers"), r),
        n(e("./errors"), r),
        n(e("./helpers"), r),
        n(e("./structs"), r),
        n(e("./svg"), r)
    }
    , {
        "./error-wrappers": 33,
        "./errors": 34,
        "./helpers": 35,
        "./structs": 37,
        "./svg": 38
    }],
    37: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            literal: function() {
                return i
            },
            union: function() {
                return o
            },
            enumValue: function() {
                return s
            }
        });
        const n = e("superstruct");
        function i(e) {
            return (0,
            n.define)(JSON.stringify(e), (0,
            n.literal)(e).validator)
        }
        function o([e,...t]) {
            const r = (0,
            n.union)([e, ...t]);
            return new n.Struct({
                ...r,
                schema: [e, ...t]
            })
        }
        function s(e) {
            return i(e)
        }
    }
    , {
        superstruct: 240
    }],
    38: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            parseSvg: function() {
                return o
            },
            isSvg: function() {
                return s
            }
        });
        const n = e("@metamask/utils")
          , i = e("fast-xml-parser");
        function o(e) {
            try {
                const t = e.trim();
                (0,
                n.assert)(t.length > 0);
                const r = new i.XMLParser({
                    ignoreAttributes: !1,
                    parseAttributeValue: !0
                }).parse(t, !0);
                return (0,
                n.assert)((0,
                n.hasProperty)(r, "svg")),
                (0,
                n.isObject)(r.svg) ? r.svg : {}
            } catch {
                throw new Error("Snap icon must be a valid SVG.")
            }
        }
        function s(e) {
            try {
                return o(e),
                !0
            } catch {
                return !1
            }
        }
    }
    , {
        "@metamask/utils": 114,
        "fast-xml-parser": 157
    }],
    39: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    40: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    41: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    42: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    43: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        n(e("./cronjob"), r),
        n(e("./home-page"), r),
        n(e("./keyring"), r),
        n(e("./lifecycle"), r),
        n(e("./name-lookup"), r),
        n(e("./rpc-request"), r),
        n(e("./transaction"), r),
        n(e("./signature"), r),
        n(e("./user-input"), r)
    }
    , {
        "./cronjob": 41,
        "./home-page": 42,
        "./keyring": 44,
        "./lifecycle": 45,
        "./name-lookup": 46,
        "./rpc-request": 47,
        "./signature": 48,
        "./transaction": 49,
        "./user-input": 50
    }],
    44: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    45: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    46: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    47: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    48: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    49: [function(e, t, r) {
        "use strict";
        var n;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "SeverityLevel", {
            enumerable: !0,
            get: function() {
                return n
            }
        }),
        function(e) {
            e.Critical = "critical"
        }(n || (n = {}))
    }
    , {}],
    50: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            UserInputEventType: function() {
                return i
            },
            GenericEventStruct: function() {
                return o
            },
            ButtonClickEventStruct: function() {
                return s
            },
            FormSubmitEventStruct: function() {
                return a
            },
            UserInputEventStruct: function() {
                return l
            }
        });
        const n = e("superstruct");
        var i;
        !function(e) {
            e.ButtonClickEvent = "ButtonClickEvent",
            e.FormSubmitEvent = "FormSubmitEvent"
        }(i || (i = {}));
        const o = (0,
        n.object)({
            type: (0,
            n.string)(),
            name: (0,
            n.optional)((0,
            n.string)())
        })
          , s = (0,
        n.assign)(o, (0,
        n.object)({
            type: (0,
            n.literal)(i.ButtonClickEvent)
        }))
          , a = (0,
        n.assign)(o, (0,
        n.object)({
            type: (0,
            n.literal)(i.FormSubmitEvent),
            value: (0,
            n.record)((0,
            n.string)(), (0,
            n.string)()),
            name: (0,
            n.string)()
        }))
          , l = (0,
        n.union)([s, a])
    }
    , {
        superstruct: 240
    }],
    51: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        e("./global"),
        n(e("./caip"), r),
        n(e("./handlers"), r),
        n(e("./methods"), r),
        n(e("./permissions"), r),
        n(e("./provider"), r),
        n(e("./snap"), r),
        n(e("./interface"), r)
    }
    , {
        "./caip": 39,
        "./global": 40,
        "./handlers": 43,
        "./interface": 52,
        "./methods": 64,
        "./permissions": 73,
        "./provider": 74,
        "./snap": 75
    }],
    52: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            FormStateStruct: function() {
                return i
            },
            InterfaceStateStruct: function() {
                return o
            }
        });
        const n = e("superstruct")
          , i = (0,
        n.record)((0,
        n.string)(), (0,
        n.nullable)((0,
        n.string)()))
          , o = (0,
        n.record)((0,
        n.string)(), (0,
        n.union)([i, (0,
        n.nullable)((0,
        n.string)())]))
    }
    , {
        superstruct: 240
    }],
    53: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    54: [function(e, t, r) {
        "use strict";
        var n;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "DialogType", {
            enumerable: !0,
            get: function() {
                return n
            }
        }),
        function(e) {
            e.Alert = "alert",
            e.Confirmation = "confirmation",
            e.Prompt = "prompt"
        }(n || (n = {}))
    }
    , {}],
    55: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    56: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    57: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    58: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    59: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    60: [function(e, t, r) {
        "use strict";
        var n;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "AuxiliaryFileEncoding", {
            enumerable: !0,
            get: function() {
                return n
            }
        }),
        function(e) {
            e.Base64 = "base64",
            e.Hex = "hex",
            e.Utf8 = "utf8"
        }(n || (n = {}))
    }
    , {}],
    61: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    62: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    63: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    64: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        n(e("./create-interface"), r),
        n(e("./dialog"), r),
        n(e("./get-bip32-entropy"), r),
        n(e("./get-bip32-public-key"), r),
        n(e("./get-bip44-entropy"), r),
        n(e("./get-client-status"), r),
        n(e("./get-entropy"), r),
        n(e("./get-file"), r),
        n(e("./get-interface-state"), r),
        n(e("./get-locale"), r),
        n(e("./get-snaps"), r),
        n(e("./invoke-keyring"), r),
        n(e("./invoke-snap"), r),
        n(e("./manage-accounts"), r),
        n(e("./manage-state"), r),
        n(e("./methods"), r),
        n(e("./notify"), r),
        n(e("./request-snaps"), r),
        n(e("./update-interface"), r)
    }
    , {
        "./create-interface": 53,
        "./dialog": 54,
        "./get-bip32-entropy": 55,
        "./get-bip32-public-key": 56,
        "./get-bip44-entropy": 57,
        "./get-client-status": 58,
        "./get-entropy": 59,
        "./get-file": 60,
        "./get-interface-state": 61,
        "./get-locale": 62,
        "./get-snaps": 63,
        "./invoke-keyring": 65,
        "./invoke-snap": 66,
        "./manage-accounts": 67,
        "./manage-state": 68,
        "./methods": 69,
        "./notify": 70,
        "./request-snaps": 71,
        "./update-interface": 72
    }],
    65: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    66: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    67: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    68: [function(e, t, r) {
        "use strict";
        var n;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "ManageStateOperation", {
            enumerable: !0,
            get: function() {
                return n
            }
        }),
        function(e) {
            e.ClearState = "clear",
            e.GetState = "get",
            e.UpdateState = "update"
        }(n || (n = {}))
    }
    , {}],
    69: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    70: [function(e, t, r) {
        "use strict";
        var n;
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "NotificationType", {
            enumerable: !0,
            get: function() {
                return n
            }
        }),
        function(e) {
            e.InApp = "inApp",
            e.Native = "native"
        }(n || (n = {}))
    }
    , {}],
    71: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    72: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    73: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    74: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    75: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        })
    }
    , {}],
    76: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "createBuilder", {
            enumerable: !0,
            get: function() {
                return i
            }
        });
        const n = e("@metamask/utils");
        function i(e, t, r=[]) {
            return (...i)=>{
                if (1 === i.length && (0,
                n.isPlainObject)(i[0])) {
                    const r = {
                        ...i[0],
                        type: e
                    };
                    return (0,
                    n.assertStruct)(r, t, `Invalid ${e} component`),
                    r
                }
                const o = r.reduce(((e,t,r)=>void 0 !== i[r] ? {
                    ...e,
                    [t]: i[r]
                } : e), {
                    type: e
                });
                return (0,
                n.assertStruct)(o, t, `Invalid ${e} component`),
                o
            }
        }
    }
    , {
        "@metamask/utils": 114
    }],
    77: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            isComponent: function() {
                return s
            },
            assertIsComponent: function() {
                return a
            }
        });
        const n = e("@metamask/utils")
          , i = e("superstruct")
          , o = e("./components");
        function s(e) {
            return (0,
            i.is)(e, o.ComponentStruct)
        }
        function a(e) {
            (0,
            n.assertStruct)(e, o.ComponentStruct, "Invalid component")
        }
    }
    , {
        "./components": 85,
        "@metamask/utils": 114,
        superstruct: 240
    }],
    78: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            AddressStruct: function() {
                return s
            },
            address: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Address),
            value: (0,
            n.pattern)((0,
            n.string)(), /0x[a-fA-F0-9]{40}/u)
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Address, s, ["value"])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    79: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            ButtonVariant: function() {
                return a
            },
            ButtonType: function() {
                return l
            },
            ButtonStruct: function() {
                return u
            },
            button: function() {
                return c
            }
        });
        const n = e("superstruct")
          , i = e("../../internals")
          , o = e("../builder")
          , s = e("../nodes");
        var a, l;
        !function(e) {
            e.Primary = "primary",
            e.Secondary = "secondary"
        }(a || (a = {})),
        function(e) {
            e.Button = "button",
            e.Submit = "submit"
        }(l || (l = {}));
        const u = (0,
        n.assign)(s.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(s.NodeType.Button),
            value: (0,
            n.string)(),
            variant: (0,
            n.optional)((0,
            n.union)([(0,
            i.enumValue)(a.Primary), (0,
            i.enumValue)(a.Secondary)])),
            buttonType: (0,
            n.optional)((0,
            n.union)([(0,
            i.enumValue)(l.Button), (0,
            i.enumValue)(l.Submit)])),
            name: (0,
            n.optional)((0,
            n.string)())
        }))
          , c = (0,
        o.createBuilder)(s.NodeType.Button, u, ["value", "buttonType", "name", "variant"])
    }
    , {
        "../../internals": 36,
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    80: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            CopyableStruct: function() {
                return s
            },
            copyable: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Copyable),
            value: (0,
            n.string)(),
            sensitive: (0,
            n.optional)((0,
            n.boolean)())
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Copyable, s, ["value", "sensitive"])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    81: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            DividerStruct: function() {
                return s
            },
            divider: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.NodeStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Divider)
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Divider, s)
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    82: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            FormComponentStruct: function() {
                return l
            },
            FormStruct: function() {
                return u
            },
            form: function() {
                return c
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = e("./button")
          , a = e("./input")
          , l = (0,
        n.union)([a.InputStruct, s.ButtonStruct])
          , u = (0,
        n.assign)(o.NodeStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Form),
            children: (0,
            n.array)(l),
            name: (0,
            n.string)()
        }))
          , c = (0,
        i.createBuilder)(o.NodeType.Form, u, ["name", "children"])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        "./button": 79,
        "./input": 86,
        superstruct: 240
    }],
    83: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            HeadingStruct: function() {
                return s
            },
            heading: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Heading),
            value: (0,
            n.string)()
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Heading, s, ["value"])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    84: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            svg: function() {
                return a
            },
            ImageStruct: function() {
                return l
            },
            image: function() {
                return u
            }
        });
        const n = e("superstruct")
          , i = e("../../internals")
          , o = e("../builder")
          , s = e("../nodes");
        function a() {
            return (0,
            n.refine)((0,
            n.string)(), "SVG", (e=>!!(0,
            i.isSvg)(e) || "Value is not a valid SVG."))
        }
        const l = (0,
        n.assign)(s.NodeStruct, (0,
        n.object)({
            type: (0,
            n.literal)(s.NodeType.Image),
            value: a()
        }))
          , u = (0,
        o.createBuilder)(s.NodeType.Image, l, ["value"])
    }
    , {
        "../../internals": 36,
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    85: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            image: function() {
                return n.image
            },
            ImageStruct: function() {
                return n.ImageStruct
            },
            ComponentStruct: function() {
                return i.ComponentStruct
            },
            panel: function() {
                return i.panel
            },
            PanelStruct: function() {
                return i.PanelStruct
            }
        }),
        o(e("./address"), r),
        o(e("./copyable"), r),
        o(e("./divider"), r),
        o(e("./heading"), r);
        const n = e("./image")
          , i = e("./panel");
        function o(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
        o(e("./spinner"), r),
        o(e("./text"), r),
        o(e("./row"), r),
        o(e("./button"), r),
        o(e("./input"), r),
        o(e("./form"), r)
    }
    , {
        "./address": 78,
        "./button": 79,
        "./copyable": 80,
        "./divider": 81,
        "./form": 82,
        "./heading": 83,
        "./image": 84,
        "./input": 86,
        "./panel": 87,
        "./row": 88,
        "./spinner": 89,
        "./text": 90
    }],
    86: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            InputType: function() {
                return a
            },
            InputStruct: function() {
                return l
            },
            input: function() {
                return u
            }
        });
        const n = e("superstruct")
          , i = e("../../internals")
          , o = e("../builder")
          , s = e("../nodes");
        var a;
        !function(e) {
            e.Text = "text",
            e.Number = "number",
            e.Password = "password"
        }(a || (a = {}));
        const l = (0,
        n.assign)(s.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(s.NodeType.Input),
            value: (0,
            n.optional)((0,
            n.string)()),
            name: (0,
            n.string)(),
            inputType: (0,
            n.optional)((0,
            n.union)([(0,
            i.enumValue)(a.Text), (0,
            i.enumValue)(a.Password), (0,
            i.enumValue)(a.Number)])),
            placeholder: (0,
            n.optional)((0,
            n.string)()),
            label: (0,
            n.optional)((0,
            n.string)())
        }))
          , u = (0,
        o.createBuilder)(s.NodeType.Input, l, ["name", "inputType", "placeholder", "value", "label"])
    }
    , {
        "../../internals": 36,
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    87: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            ParentStruct: function() {
                return b
            },
            PanelStruct: function() {
                return y
            },
            panel: function() {
                return v
            },
            ComponentStruct: function() {
                return w
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = e("./address")
          , a = e("./button")
          , l = e("./copyable")
          , u = e("./divider")
          , c = e("./form")
          , d = e("./heading")
          , f = e("./image")
          , h = e("./input")
          , p = e("./row")
          , g = e("./spinner")
          , m = e("./text")
          , b = (0,
        n.assign)(o.NodeStruct, (0,
        n.object)({
            children: (0,
            n.array)((0,
            n.lazy)((()=>w)))
        }))
          , y = (0,
        n.assign)(b, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Panel)
        }))
          , v = (0,
        i.createBuilder)(o.NodeType.Panel, y, ["children"])
          , w = (0,
        n.union)([l.CopyableStruct, u.DividerStruct, d.HeadingStruct, f.ImageStruct, y, g.SpinnerStruct, m.TextStruct, p.RowStruct, s.AddressStruct, h.InputStruct, c.FormStruct, a.ButtonStruct])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        "./address": 78,
        "./button": 79,
        "./copyable": 80,
        "./divider": 81,
        "./form": 82,
        "./heading": 83,
        "./image": 84,
        "./input": 86,
        "./row": 88,
        "./spinner": 89,
        "./text": 90,
        superstruct: 240
    }],
    88: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            RowVariant: function() {
                return c
            },
            RowStruct: function() {
                return f
            },
            row: function() {
                return h
            }
        });
        const n = e("superstruct")
          , i = e("../../internals")
          , o = e("../builder")
          , s = e("../nodes")
          , a = e("./address")
          , l = e("./image")
          , u = e("./text");
        var c;
        !function(e) {
            e.Default = "default",
            e.Critical = "critical",
            e.Warning = "warning"
        }(c || (c = {}));
        const d = (0,
        n.union)([l.ImageStruct, u.TextStruct, a.AddressStruct])
          , f = (0,
        n.assign)(s.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(s.NodeType.Row),
            variant: (0,
            n.optional)((0,
            n.union)([(0,
            i.enumValue)(c.Default), (0,
            i.enumValue)(c.Critical), (0,
            i.enumValue)(c.Warning)])),
            label: (0,
            n.string)(),
            value: d
        }))
          , h = (0,
        o.createBuilder)(s.NodeType.Row, f, ["label", "value", "variant"])
    }
    , {
        "../../internals": 36,
        "../builder": 76,
        "../nodes": 92,
        "./address": 78,
        "./image": 84,
        "./text": 90,
        superstruct: 240
    }],
    89: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            SpinnerStruct: function() {
                return s
            },
            spinner: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.NodeStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Spinner)
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Spinner, s)
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    90: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            TextStruct: function() {
                return s
            },
            text: function() {
                return a
            }
        });
        const n = e("superstruct")
          , i = e("../builder")
          , o = e("../nodes")
          , s = (0,
        n.assign)(o.LiteralStruct, (0,
        n.object)({
            type: (0,
            n.literal)(o.NodeType.Text),
            value: (0,
            n.string)(),
            markdown: (0,
            n.optional)((0,
            n.boolean)())
        }))
          , a = (0,
        i.createBuilder)(o.NodeType.Text, s, ["value", "markdown"])
    }
    , {
        "../builder": 76,
        "../nodes": 92,
        superstruct: 240
    }],
    91: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        Object.defineProperty(r, "NodeType", {
            enumerable: !0,
            get: function() {
                return n.NodeType
            }
        }),
        i(e("./components"), r),
        i(e("./component"), r);
        const n = e("./nodes");
        function i(e, t) {
            return Object.keys(e).forEach((function(r) {
                "default" === r || Object.prototype.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[r]
                    }
                })
            }
            )),
            e
        }
    }
    , {
        "./component": 77,
        "./components": 85,
        "./nodes": 92
    }],
    92: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        function(e, t) {
            for (var r in t)
                Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
        }(r, {
            NodeType: function() {
                return i
            },
            NodeStruct: function() {
                return o
            },
            LiteralStruct: function() {
                return s
            }
        });
        const n = e("superstruct");
        var i;
        !function(e) {
            e.Copyable = "copyable",
            e.Divider = "divider",
            e.Heading = "heading",
            e.Panel = "panel",
            e.Spinner = "spinner",
            e.Text = "text",
            e.Image = "image",
            e.Row = "row",
            e.Address = "address",
            e.Button = "button",
            e.Input = "input",
            e.Form = "form"
        }(i || (i = {}));
        const o = (0,
        n.object)({
            type: (0,
            n.string)()
        })
          , s = (0,
        n.assign)(o, (0,
        n.object)({
            value: (0,
            n.unknown)()
        }))
    }
    , {
        superstruct: 240
    }],
    93: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, i = e("debug"), o = ((n = i) && n.__esModule ? n : {
            default: n
        }).default.call(void 0, "metamask");
        r.createProjectLogger = function(e) {
            return o.extend(e)
        }
        ,
        r.createModuleLogger = function(e, t) {
            return e.extend(t)
        }
    }
    , {
        debug: 127
    }],
    94: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e,t,r)=>{
            if (!t.has(e))
                throw TypeError("Cannot " + r)
        }
        ;
        r.__privateGet = (e,t,r)=>(n(e, t, "read from private field"),
        r ? r.call(e) : t.get(e)),
        r.__privateAdd = (e,t,r)=>{
            if (t.has(e))
                throw TypeError("Cannot add the same private member more than once");
            t instanceof WeakSet ? t.add(e) : t.set(e, r)
        }
        ,
        r.__privateSet = (e,t,r,i)=>(n(e, t, "write to private field"),
        i ? i.call(e, r) : t.set(e, r),
        r)
    }
    , {}],
    95: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6ZDHSOUV.js")
          , i = e("semver")
          , o = e("superstruct")
          , s = o.refine.call(void 0, o.string.call(void 0), "Version", (e=>null !== i.valid.call(void 0, e) || `Expected SemVer version, got "${e}"`))
          , a = o.refine.call(void 0, o.string.call(void 0), "Version range", (e=>null !== i.validRange.call(void 0, e) || `Expected SemVer range, got "${e}"`));
        r.VersionStruct = s,
        r.VersionRangeStruct = a,
        r.isValidSemVerVersion = function(e) {
            return o.is.call(void 0, e, s)
        }
        ,
        r.isValidSemVerRange = function(e) {
            return o.is.call(void 0, e, a)
        }
        ,
        r.assertIsSemVerVersion = function(e) {
            n.assertStruct.call(void 0, e, s)
        }
        ,
        r.assertIsSemVerRange = function(e) {
            n.assertStruct.call(void 0, e, a)
        }
        ,
        r.gtVersion = function(e, t) {
            return i.gt.call(void 0, e, t)
        }
        ,
        r.gtRange = function(e, t) {
            return i.gtr.call(void 0, e, t)
        }
        ,
        r.satisfiesVersionRange = function(e, t) {
            return i.satisfies.call(void 0, e, t, {
                includePrerelease: !0
            })
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        semver: 220,
        superstruct: 240
    }],
    96: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.createDeferredPromise = function({suppressUnhandledRejection: e=!1}={}) {
            let t, r;
            const n = new Promise(((e,n)=>{
                t = e,
                r = n
            }
            ));
            return e && n.catch((e=>{}
            )),
            {
                promise: n,
                resolve: t,
                reject: r
            }
        }
    }
    , {}],
    97: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e=>(e[e.Millisecond = 1] = "Millisecond",
        e[e.Second = 1e3] = "Second",
        e[e.Minute = 6e4] = "Minute",
        e[e.Hour = 36e5] = "Hour",
        e[e.Day = 864e5] = "Day",
        e[e.Week = 6048e5] = "Week",
        e[e.Year = 31536e6] = "Year",
        e))(n || {})
          , i = (e,t)=>{
            if (!(e=>Number.isInteger(e) && e >= 0)(e))
                throw new Error(`"${t}" must be a non-negative integer. Received: "${e}".`)
        }
        ;
        r.Duration = n,
        r.inMilliseconds = function(e, t) {
            return i(e, "count"),
            e * t
        }
        ,
        r.timeSince = function(e) {
            return i(e, "timestamp"),
            Date.now() - e
        }
    }
    , {}],
    98: [function(e, t, r) {}
    , {}],
    99: [function(e, t, r) {
        "use strict";
        function n(e, t) {
            return null != e ? e : t()
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = e("./chunk-6ZDHSOUV.js")
          , o = e("superstruct");
        r.base64 = (e,t={})=>{
            const r = n(t.paddingRequired, (()=>!1))
              , s = n(t.characterSet, (()=>"base64"));
            let a, l;
            return "base64" === s ? a = String.raw`[A-Za-z0-9+\/]` : (i.assert.call(void 0, "base64url" === s),
            a = String.raw`[-_A-Za-z0-9]`),
            l = r ? new RegExp(`^(?:${a}{4})*(?:${a}{3}=|${a}{2}==)?$`,"u") : new RegExp(`^(?:${a}{4})*(?:${a}{2,3}|${a}{3}=|${a}{2}==)?$`,"u"),
            o.pattern.call(void 0, e, l)
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        superstruct: 240
    }],
    100: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-IZC266HS.js")
          , i = e("superstruct");
        function o(e, t) {
            return Boolean("string" == typeof function(e) {
                let t, r = e[0], n = 1;
                for (; n < e.length; ) {
                    const i = e[n]
                      , o = e[n + 1];
                    if (n += 2,
                    ("optionalAccess" === i || "optionalCall" === i) && null == r)
                        return;
                    "access" === i || "optionalAccess" === i ? (t = r,
                    r = o(r)) : "call" !== i && "optionalCall" !== i || (r = o(((...e)=>r.call(t, ...e))),
                    t = void 0)
                }
                return r
            }([e, "optionalAccess", e=>e.prototype, "optionalAccess", e=>e.constructor, "optionalAccess", e=>e.name])) ? new e({
                message: t
            }) : e({
                message: t
            })
        }
        var s = class extends Error {
            constructor(e) {
                super(e.message),
                this.code = "ERR_ASSERTION"
            }
        }
        ;
        r.AssertionError = s,
        r.assert = function(e, t="Assertion failed.", r=s) {
            if (!e) {
                if (t instanceof Error)
                    throw t;
                throw o(r, t)
            }
        }
        ,
        r.assertStruct = function(e, t, r="Assertion failed", a=s) {
            try {
                i.assert.call(void 0, e, t)
            } catch (e) {
                throw o(a, `${r}: ${function(e) {
                    return n.getErrorMessage.call(void 0, e).replace(/\.$/u, "")
                }(e)}.`)
            }
        }
        ,
        r.assertExhaustive = function(e) {
            throw new Error("Invalid branch reached. Should be detected during compilation.")
        }
    }
    , {
        "./chunk-IZC266HS.js": 104,
        superstruct: 240
    }],
    101: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QEPVHEP7.js")
          , i = e("./chunk-6ZDHSOUV.js")
          , o = e("superstruct")
          , s = o.union.call(void 0, [o.number.call(void 0), o.bigint.call(void 0), o.string.call(void 0), n.StrictHexStruct])
          , a = o.coerce.call(void 0, o.number.call(void 0), s, Number)
          , l = o.coerce.call(void 0, o.bigint.call(void 0), s, BigInt)
          , u = (o.union.call(void 0, [n.StrictHexStruct, o.instance.call(void 0, Uint8Array)]),
        o.coerce.call(void 0, o.instance.call(void 0, Uint8Array), o.union.call(void 0, [n.StrictHexStruct]), n.hexToBytes))
          , c = o.coerce.call(void 0, n.StrictHexStruct, o.instance.call(void 0, Uint8Array), n.bytesToHex);
        r.createNumber = function(e) {
            try {
                const t = o.create.call(void 0, e, a);
                return i.assert.call(void 0, Number.isFinite(t), `Expected a number-like value, got "${e}".`),
                t
            } catch (t) {
                if (t instanceof o.StructError)
                    throw new Error(`Expected a number-like value, got "${e}".`);
                throw t
            }
        }
        ,
        r.createBigInt = function(e) {
            try {
                return o.create.call(void 0, e, l)
            } catch (e) {
                if (e instanceof o.StructError)
                    throw new Error(`Expected a number-like value, got "${String(e.value)}".`);
                throw e
            }
        }
        ,
        r.createBytes = function(e) {
            if ("string" == typeof e && "0x" === e.toLowerCase())
                return new Uint8Array;
            try {
                return o.create.call(void 0, e, u)
            } catch (e) {
                if (e instanceof o.StructError)
                    throw new Error(`Expected a bytes-like value, got "${String(e.value)}".`);
                throw e
            }
        }
        ,
        r.createHex = function(e) {
            if (e instanceof Uint8Array && 0 === e.length || "string" == typeof e && "0x" === e.toLowerCase())
                return "0x";
            try {
                return o.create.call(void 0, e, c)
            } catch (e) {
                if (e instanceof o.StructError)
                    throw new Error(`Expected a bytes-like value, got "${String(e.value)}".`);
                throw e
            }
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        "./chunk-QEPVHEP7.js": 107,
        superstruct: 240
    }],
    102: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6NZW4WK4.js")
          , i = e("superstruct")
          , o = i.size.call(void 0, n.base64.call(void 0, i.string.call(void 0), {
            paddingRequired: !0
        }), 44, 44);
        r.ChecksumStruct = o
    }
    , {
        "./chunk-6NZW4WK4.js": 99,
        superstruct: 240
    }],
    103: [function(e, t, r) {}
    , {}],
    104: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QVEKZRZ2.js")
          , i = e("pony-cause");
        function o(e) {
            return "object" == typeof e && null !== e && "code"in e
        }
        function s(e) {
            return "object" == typeof e && null !== e && "message"in e
        }
        r.isErrorWithCode = o,
        r.isErrorWithMessage = s,
        r.isErrorWithStack = function(e) {
            return "object" == typeof e && null !== e && "stack"in e
        }
        ,
        r.getErrorMessage = function(e) {
            return s(e) && "string" == typeof e.message ? e.message : n.isNullOrUndefined.call(void 0, e) ? "" : String(e)
        }
        ,
        r.wrapError = function(e, t) {
            if ((r = e)instanceof Error || n.isObject.call(void 0, r) && "Error" === r.constructor.name) {
                let r;
                return r = 2 === Error.length ? new Error(t,{
                    cause: e
                }) : new (0,
                i.ErrorWithCause)(t,{
                    cause: e
                }),
                o(e) && (r.code = e.code),
                r
            }
            var r;
            return t.length > 0 ? new Error(`${String(e)}: ${t}`) : new Error(String(e))
        }
    }
    , {
        "./chunk-QVEKZRZ2.js": 108,
        "pony-cause": 174
    }],
    105: [function(e, t, r) {}
    , {}],
    106: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-6ZDHSOUV.js")
          , i = e("./chunk-QVEKZRZ2.js")
          , o = e("superstruct")
          , s = e=>o.object.call(void 0, e);
        function a({path: e, branch: t}) {
            const r = e[e.length - 1];
            return i.hasProperty.call(void 0, t[t.length - 2], r)
        }
        function l(e) {
            return new (0,
            o.Struct)({
                ...e,
                type: `optional ${e.type}`,
                validator: (t,r)=>!a(r) || e.validator(t, r),
                refiner: (t,r)=>!a(r) || e.refiner(t, r)
            })
        }
        var u = o.union.call(void 0, [o.literal.call(void 0, null), o.boolean.call(void 0), o.define.call(void 0, "finite number", (e=>o.is.call(void 0, e, o.number.call(void 0)) && Number.isFinite(e))), o.string.call(void 0), o.array.call(void 0, o.lazy.call(void 0, (()=>u))), o.record.call(void 0, o.string.call(void 0), o.lazy.call(void 0, (()=>u)))])
          , c = o.coerce.call(void 0, u, o.any.call(void 0), (e=>(n.assertStruct.call(void 0, e, u),
        JSON.parse(JSON.stringify(e, ((e,t)=>{
            if ("__proto__" !== e && "constructor" !== e)
                return t
        }
        ))))));
        function d(e) {
            return o.create.call(void 0, e, c)
        }
        var f = o.literal.call(void 0, "2.0")
          , h = o.nullable.call(void 0, o.union.call(void 0, [o.number.call(void 0), o.string.call(void 0)]))
          , p = s({
            code: o.integer.call(void 0),
            message: o.string.call(void 0),
            data: l(c),
            stack: l(o.string.call(void 0))
        })
          , g = o.union.call(void 0, [o.record.call(void 0, o.string.call(void 0), c), o.array.call(void 0, c)])
          , m = s({
            id: h,
            jsonrpc: f,
            method: o.string.call(void 0),
            params: l(g)
        })
          , b = s({
            jsonrpc: f,
            method: o.string.call(void 0),
            params: l(g)
        });
        var y = o.object.call(void 0, {
            id: h,
            jsonrpc: f,
            result: o.optional.call(void 0, o.unknown.call(void 0)),
            error: o.optional.call(void 0, p)
        })
          , v = s({
            id: h,
            jsonrpc: f,
            result: c
        })
          , w = s({
            id: h,
            jsonrpc: f,
            error: p
        })
          , _ = o.union.call(void 0, [v, w]);
        r.object = s,
        r.exactOptional = l,
        r.UnsafeJsonStruct = u,
        r.JsonStruct = c,
        r.isValidJson = function(e) {
            try {
                return d(e),
                !0
            } catch (e) {
                return !1
            }
        }
        ,
        r.getSafeJson = d,
        r.getJsonSize = function(e) {
            n.assertStruct.call(void 0, e, c, "Invalid JSON value");
            const t = JSON.stringify(e);
            return (new TextEncoder).encode(t).byteLength
        }
        ,
        r.jsonrpc2 = "2.0",
        r.JsonRpcVersionStruct = f,
        r.JsonRpcIdStruct = h,
        r.JsonRpcErrorStruct = p,
        r.JsonRpcParamsStruct = g,
        r.JsonRpcRequestStruct = m,
        r.JsonRpcNotificationStruct = b,
        r.isJsonRpcNotification = function(e) {
            return o.is.call(void 0, e, b)
        }
        ,
        r.assertIsJsonRpcNotification = function(e, t) {
            n.assertStruct.call(void 0, e, b, "Invalid JSON-RPC notification", t)
        }
        ,
        r.isJsonRpcRequest = function(e) {
            return o.is.call(void 0, e, m)
        }
        ,
        r.assertIsJsonRpcRequest = function(e, t) {
            n.assertStruct.call(void 0, e, m, "Invalid JSON-RPC request", t)
        }
        ,
        r.PendingJsonRpcResponseStruct = y,
        r.JsonRpcSuccessStruct = v,
        r.JsonRpcFailureStruct = w,
        r.JsonRpcResponseStruct = _,
        r.isPendingJsonRpcResponse = function(e) {
            return o.is.call(void 0, e, y)
        }
        ,
        r.assertIsPendingJsonRpcResponse = function(e, t) {
            n.assertStruct.call(void 0, e, y, "Invalid pending JSON-RPC response", t)
        }
        ,
        r.isJsonRpcResponse = function(e) {
            return o.is.call(void 0, e, _)
        }
        ,
        r.assertIsJsonRpcResponse = function(e, t) {
            n.assertStruct.call(void 0, e, _, "Invalid JSON-RPC response", t)
        }
        ,
        r.isJsonRpcSuccess = function(e) {
            return o.is.call(void 0, e, v)
        }
        ,
        r.assertIsJsonRpcSuccess = function(e, t) {
            n.assertStruct.call(void 0, e, v, "Invalid JSON-RPC success response", t)
        }
        ,
        r.isJsonRpcFailure = function(e) {
            return o.is.call(void 0, e, w)
        }
        ,
        r.assertIsJsonRpcFailure = function(e, t) {
            n.assertStruct.call(void 0, e, w, "Invalid JSON-RPC failure response", t)
        }
        ,
        r.isJsonRpcError = function(e) {
            return o.is.call(void 0, e, p)
        }
        ,
        r.assertIsJsonRpcError = function(e, t) {
            n.assertStruct.call(void 0, e, p, "Invalid JSON-RPC error", t)
        }
        ,
        r.getJsonRpcIdValidator = function(e) {
            const {permitEmptyString: t, permitFractions: r, permitNull: n} = {
                permitEmptyString: !0,
                permitFractions: !1,
                permitNull: !0,
                ...e
            };
            return e=>Boolean("number" == typeof e && (r || Number.isInteger(e)) || "string" == typeof e && (t || e.length > 0) || n && null === e)
        }
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        "./chunk-QVEKZRZ2.js": 108,
        superstruct: 240
    }],
    107: [function(e, t, r) {
        (function(t) {
            (function() {
                "use strict";
                Object.defineProperty(r, "__esModule", {
                    value: !0
                });
                var n = e("./chunk-6ZDHSOUV.js")
                  , i = e("@noble/hashes/sha3")
                  , o = e("superstruct")
                  , s = e("@scure/base")
                  , a = 48
                  , l = 58
                  , u = 87;
                var c = function() {
                    const e = [];
                    return ()=>{
                        if (0 === e.length)
                            for (let t = 0; t < 256; t++)
                                e.push(t.toString(16).padStart(2, "0"));
                        return e
                    }
                }();
                function d(e) {
                    return e instanceof Uint8Array
                }
                function f(e) {
                    n.assert.call(void 0, d(e), "Value must be a Uint8Array.")
                }
                function h(e) {
                    if (f(e),
                    0 === e.length)
                        return "0x";
                    const t = c()
                      , r = new Array(e.length);
                    for (let n = 0; n < e.length; n++)
                        r[n] = t[e[n]];
                    return k(r.join(""))
                }
                function p(e) {
                    f(e);
                    const t = h(e);
                    return BigInt(t)
                }
                function g(e) {
                    if ("0x" === function(e) {
                        let t, r = e[0], n = 1;
                        for (; n < e.length; ) {
                            const i = e[n]
                              , o = e[n + 1];
                            if (n += 2,
                            ("optionalAccess" === i || "optionalCall" === i) && null == r)
                                return;
                            "access" === i || "optionalAccess" === i ? (t = r,
                            r = o(r)) : "call" !== i && "optionalCall" !== i || (r = o(((...e)=>r.call(t, ...e))),
                            t = void 0)
                        }
                        return r
                    }([e, "optionalAccess", e=>e.toLowerCase, "optionalCall", e=>e()]))
                        return new Uint8Array;
                    x(e);
                    const t = M(e).toLowerCase()
                      , r = t.length % 2 == 0 ? t : `0${t}`
                      , n = new Uint8Array(r.length / 2);
                    for (let e = 0; e < n.length; e++) {
                        const t = r.charCodeAt(2 * e)
                          , i = r.charCodeAt(2 * e + 1)
                          , o = t - (t < l ? a : u)
                          , s = i - (i < l ? a : u);
                        n[e] = 16 * o + s
                    }
                    return n
                }
                function m(e) {
                    n.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
                    n.assert.call(void 0, e >= BigInt(0), "Value must be a non-negative bigint.");
                    return g(e.toString(16))
                }
                function b(e) {
                    n.assert.call(void 0, "number" == typeof e, "Value must be a number."),
                    n.assert.call(void 0, e >= 0, "Value must be a non-negative number."),
                    n.assert.call(void 0, Number.isSafeInteger(e), "Value is not a safe integer. Use `bigIntToBytes` instead.");
                    return g(e.toString(16))
                }
                function y(e) {
                    return n.assert.call(void 0, "string" == typeof e, "Value must be a string."),
                    (new TextEncoder).encode(e)
                }
                function v(e) {
                    if ("bigint" == typeof e)
                        return m(e);
                    if ("number" == typeof e)
                        return b(e);
                    if ("string" == typeof e)
                        return e.startsWith("0x") ? g(e) : y(e);
                    if (d(e))
                        return e;
                    throw new TypeError(`Unsupported value type: "${typeof e}".`)
                }
                var w = o.pattern.call(void 0, o.string.call(void 0), /^(?:0x)?[0-9a-f]+$/iu)
                  , _ = o.pattern.call(void 0, o.string.call(void 0), /^0x[0-9a-f]+$/iu)
                  , E = o.pattern.call(void 0, o.string.call(void 0), /^0x[0-9a-f]{40}$/u)
                  , S = o.pattern.call(void 0, o.string.call(void 0), /^0x[0-9a-fA-F]{40}$/u);
                function A(e) {
                    return o.is.call(void 0, e, w)
                }
                function R(e) {
                    return o.is.call(void 0, e, _)
                }
                function x(e) {
                    n.assert.call(void 0, A(e), "Value must be a hexadecimal string.")
                }
                function T(e) {
                    n.assert.call(void 0, o.is.call(void 0, e, S), "Invalid hex address.");
                    const t = M(e.toLowerCase())
                      , r = M(h(i.keccak_256.call(void 0, t)));
                    return `0x${t.split("").map(((e,t)=>{
                        const i = r[t];
                        return n.assert.call(void 0, o.is.call(void 0, i, o.string.call(void 0)), "Hash shorter than address."),
                        parseInt(i, 16) > 7 ? e.toUpperCase() : e
                    }
                    )).join("")}`
                }
                function O(e) {
                    return !!o.is.call(void 0, e, S) && T(e) === e
                }
                function k(e) {
                    return e.startsWith("0x") ? e : e.startsWith("0X") ? `0x${e.substring(2)}` : `0x${e}`
                }
                function M(e) {
                    return e.startsWith("0x") || e.startsWith("0X") ? e.substring(2) : e
                }
                r.HexStruct = w,
                r.StrictHexStruct = _,
                r.HexAddressStruct = E,
                r.HexChecksumAddressStruct = S,
                r.isHexString = A,
                r.isStrictHexString = R,
                r.assertIsHexString = x,
                r.assertIsStrictHexString = function(e) {
                    n.assert.call(void 0, R(e), 'Value must be a hexadecimal string, starting with "0x".')
                }
                ,
                r.isValidHexAddress = function(e) {
                    return o.is.call(void 0, e, E) || O(e)
                }
                ,
                r.getChecksumAddress = T,
                r.isValidChecksumAddress = O,
                r.add0x = k,
                r.remove0x = M,
                r.isBytes = d,
                r.assertIsBytes = f,
                r.bytesToHex = h,
                r.bytesToBigInt = p,
                r.bytesToSignedBigInt = function(e) {
                    f(e);
                    let t = BigInt(0);
                    for (const r of e)
                        t = (t << BigInt(8)) + BigInt(r);
                    return BigInt.asIntN(8 * e.length, t)
                }
                ,
                r.bytesToNumber = function(e) {
                    f(e);
                    const t = p(e);
                    return n.assert.call(void 0, t <= BigInt(Number.MAX_SAFE_INTEGER), "Number is not a safe integer. Use `bytesToBigInt` instead."),
                    Number(t)
                }
                ,
                r.bytesToString = function(e) {
                    return f(e),
                    (new TextDecoder).decode(e)
                }
                ,
                r.bytesToBase64 = function(e) {
                    return f(e),
                    s.base64.encode(e)
                }
                ,
                r.hexToBytes = g,
                r.bigIntToBytes = m,
                r.signedBigIntToBytes = function(e, t) {
                    n.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
                    n.assert.call(void 0, "number" == typeof t, "Byte length must be a number."),
                    n.assert.call(void 0, t > 0, "Byte length must be greater than 0."),
                    n.assert.call(void 0, function(e, t) {
                        n.assert.call(void 0, t > 0);
                        const r = e >> BigInt(31);
                        return !((~e & r) + (e & ~r) >> BigInt(8 * t - 1))
                    }(e, t), "Byte length is too small to represent the given value.");
                    let r = e;
                    const i = new Uint8Array(t);
                    for (let e = 0; e < i.length; e++)
                        i[e] = Number(BigInt.asUintN(8, r)),
                        r >>= BigInt(8);
                    return i.reverse()
                }
                ,
                r.numberToBytes = b,
                r.stringToBytes = y,
                r.base64ToBytes = function(e) {
                    return n.assert.call(void 0, "string" == typeof e, "Value must be a string."),
                    s.base64.decode(e)
                }
                ,
                r.valueToBytes = v,
                r.concatBytes = function(e) {
                    const t = new Array(e.length);
                    let r = 0;
                    for (let n = 0; n < e.length; n++) {
                        const i = v(e[n]);
                        t[n] = i,
                        r += i.length
                    }
                    const n = new Uint8Array(r);
                    for (let e = 0, r = 0; e < t.length; e++)
                        n.set(t[e], r),
                        r += t[e].length;
                    return n
                }
                ,
                r.createDataView = function(e) {
                    if (void 0 !== t && e instanceof t) {
                        const t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
                        return new DataView(t)
                    }
                    return new DataView(e.buffer,e.byteOffset,e.byteLength)
                }
            }
            ).call(this)
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        "@noble/hashes/sha3": 118,
        "@scure/base": 120,
        buffer: 124,
        superstruct: 240
    }],
    108: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = (e=>(e[e.Null = 4] = "Null",
        e[e.Comma = 1] = "Comma",
        e[e.Wrapper = 1] = "Wrapper",
        e[e.True = 4] = "True",
        e[e.False = 5] = "False",
        e[e.Quote = 1] = "Quote",
        e[e.Colon = 1] = "Colon",
        e[e.Date = 24] = "Date",
        e))(n || {})
          , i = /"|\\|\n|\r|\t/gu;
        function o(e) {
            return e.charCodeAt(0) <= 127
        }
        r.isNonEmptyArray = function(e) {
            return Array.isArray(e) && e.length > 0
        }
        ,
        r.isNullOrUndefined = function(e) {
            return null == e
        }
        ,
        r.isObject = function(e) {
            return Boolean(e) && "object" == typeof e && !Array.isArray(e)
        }
        ,
        r.hasProperty = (e,t)=>Object.hasOwnProperty.call(e, t),
        r.getKnownPropertyNames = function(e) {
            return Object.getOwnPropertyNames(e)
        }
        ,
        r.JsonSize = n,
        r.ESCAPE_CHARACTERS_REGEXP = i,
        r.isPlainObject = function(e) {
            if ("object" != typeof e || null === e)
                return !1;
            try {
                let t = e;
                for (; null !== Object.getPrototypeOf(t); )
                    t = Object.getPrototypeOf(t);
                return Object.getPrototypeOf(e) === t
            } catch (e) {
                return !1
            }
        }
        ,
        r.isASCII = o,
        r.calculateStringSize = function(e) {
            return e.split("").reduce(((e,t)=>o(t) ? e + 1 : e + 2), 0) + (t = e.match(i),
            r = ()=>[],
            null != t ? t : r()).length;
            var t, r
        }
        ,
        r.calculateNumberSize = function(e) {
            return e.toString().length
        }
    }
    , {}],
    109: [function(e, t, r) {}
    , {}],
    110: [function(e, t, r) {
        "use strict";
        function n(e) {
            let t, r = e[0], n = 1;
            for (; n < e.length; ) {
                const i = e[n]
                  , o = e[n + 1];
                if (n += 2,
                ("optionalAccess" === i || "optionalCall" === i) && null == r)
                    return;
                "access" === i || "optionalAccess" === i ? (t = r,
                r = o(r)) : "call" !== i && "optionalCall" !== i || (r = o(((...e)=>r.call(t, ...e))),
                t = void 0)
            }
            return r
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var i = e("superstruct")
          , o = /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})$/u
          , s = /^[-a-z0-9]{3,8}$/u
          , a = /^[-_a-zA-Z0-9]{1,32}$/u
          , l = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u
          , u = /^[-.%a-zA-Z0-9]{1,128}$/u
          , c = i.pattern.call(void 0, i.string.call(void 0), o)
          , d = i.pattern.call(void 0, i.string.call(void 0), s)
          , f = i.pattern.call(void 0, i.string.call(void 0), a)
          , h = i.pattern.call(void 0, i.string.call(void 0), l)
          , p = i.pattern.call(void 0, i.string.call(void 0), u);
        r.CAIP_CHAIN_ID_REGEX = o,
        r.CAIP_NAMESPACE_REGEX = s,
        r.CAIP_REFERENCE_REGEX = a,
        r.CAIP_ACCOUNT_ID_REGEX = l,
        r.CAIP_ACCOUNT_ADDRESS_REGEX = u,
        r.CaipChainIdStruct = c,
        r.CaipNamespaceStruct = d,
        r.CaipReferenceStruct = f,
        r.CaipAccountIdStruct = h,
        r.CaipAccountAddressStruct = p,
        r.isCaipChainId = function(e) {
            return i.is.call(void 0, e, c)
        }
        ,
        r.isCaipNamespace = function(e) {
            return i.is.call(void 0, e, d)
        }
        ,
        r.isCaipReference = function(e) {
            return i.is.call(void 0, e, f)
        }
        ,
        r.isCaipAccountId = function(e) {
            return i.is.call(void 0, e, h)
        }
        ,
        r.isCaipAccountAddress = function(e) {
            return i.is.call(void 0, e, p)
        }
        ,
        r.parseCaipChainId = function(e) {
            const t = o.exec(e);
            if (!n([t, "optionalAccess", e=>e.groups]))
                throw new Error("Invalid CAIP chain ID.");
            return {
                namespace: t.groups.namespace,
                reference: t.groups.reference
            }
        }
        ,
        r.parseCaipAccountId = function(e) {
            const t = l.exec(e);
            if (!n([t, "optionalAccess", e=>e.groups]))
                throw new Error("Invalid CAIP account ID.");
            return {
                address: t.groups.accountAddress,
                chainId: t.groups.chainId,
                chain: {
                    namespace: t.groups.namespace,
                    reference: t.groups.reference
                }
            }
        }
    }
    , {
        superstruct: 240
    }],
    111: [function(e, t, r) {}
    , {}],
    112: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = e("./chunk-QEPVHEP7.js")
          , i = e("./chunk-6ZDHSOUV.js");
        r.numberToHex = e=>(i.assert.call(void 0, "number" == typeof e, "Value must be a number."),
        i.assert.call(void 0, e >= 0, "Value must be a non-negative number."),
        i.assert.call(void 0, Number.isSafeInteger(e), "Value is not a safe integer. Use `bigIntToHex` instead."),
        n.add0x.call(void 0, e.toString(16))),
        r.bigIntToHex = e=>(i.assert.call(void 0, "bigint" == typeof e, "Value must be a bigint."),
        i.assert.call(void 0, e >= 0, "Value must be a non-negative bigint."),
        n.add0x.call(void 0, e.toString(16))),
        r.hexToNumber = e=>{
            n.assertIsHexString.call(void 0, e);
            const t = parseInt(e, 16);
            return i.assert.call(void 0, Number.isSafeInteger(t), "Value is not a safe integer. Use `hexToBigInt` instead."),
            t
        }
        ,
        r.hexToBigInt = e=>(n.assertIsHexString.call(void 0, e),
        BigInt(n.add0x.call(void 0, e)))
    }
    , {
        "./chunk-6ZDHSOUV.js": 100,
        "./chunk-QEPVHEP7.js": 107
    }],
    113: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n, i, o = e("./chunk-3W5G4CYI.js"), s = class {
            constructor(e) {
                o.__privateAdd.call(void 0, this, n, void 0),
                o.__privateSet.call(void 0, this, n, new Map(e)),
                Object.freeze(this)
            }
            get size() {
                return o.__privateGet.call(void 0, this, n).size
            }
            [Symbol.iterator]() {
                return o.__privateGet.call(void 0, this, n)[Symbol.iterator]()
            }
            entries() {
                return o.__privateGet.call(void 0, this, n).entries()
            }
            forEach(e, t) {
                return o.__privateGet.call(void 0, this, n).forEach(((r,n,i)=>e.call(t, r, n, this)))
            }
            get(e) {
                return o.__privateGet.call(void 0, this, n).get(e)
            }
            has(e) {
                return o.__privateGet.call(void 0, this, n).has(e)
            }
            keys() {
                return o.__privateGet.call(void 0, this, n).keys()
            }
            values() {
                return o.__privateGet.call(void 0, this, n).values()
            }
            toString() {
                return `FrozenMap(${this.size}) {${this.size > 0 ? ` ${[...this.entries()].map((([e,t])=>`${String(e)} => ${String(t)}`)).join(", ")} ` : ""}}`
            }
        }
        ;
        n = new WeakMap;
        var a = class {
            constructor(e) {
                o.__privateAdd.call(void 0, this, i, void 0),
                o.__privateSet.call(void 0, this, i, new Set(e)),
                Object.freeze(this)
            }
            get size() {
                return o.__privateGet.call(void 0, this, i).size
            }
            [Symbol.iterator]() {
                return o.__privateGet.call(void 0, this, i)[Symbol.iterator]()
            }
            entries() {
                return o.__privateGet.call(void 0, this, i).entries()
            }
            forEach(e, t) {
                return o.__privateGet.call(void 0, this, i).forEach(((r,n,i)=>e.call(t, r, n, this)))
            }
            has(e) {
                return o.__privateGet.call(void 0, this, i).has(e)
            }
            keys() {
                return o.__privateGet.call(void 0, this, i).keys()
            }
            values() {
                return o.__privateGet.call(void 0, this, i).values()
            }
            toString() {
                return `FrozenSet(${this.size}) {${this.size > 0 ? ` ${[...this.values()].map((e=>String(e))).join(", ")} ` : ""}}`
            }
        }
        ;
        i = new WeakMap,
        Object.freeze(s),
        Object.freeze(s.prototype),
        Object.freeze(a),
        Object.freeze(a.prototype),
        r.FrozenMap = s,
        r.FrozenSet = a
    }
    , {
        "./chunk-3W5G4CYI.js": 94
    }],
    114: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        e("./chunk-5AVWINSB.js");
        var n = e("./chunk-VFXTVNXN.js");
        e("./chunk-LC2CRSWD.js");
        var i = e("./chunk-4NIRTM4M.js")
          , o = e("./chunk-4RMX5YWE.js");
        e("./chunk-UOTVU7OQ.js");
        var s = e("./chunk-4D6XQBHA.js")
          , a = e("./chunk-OLLG4H35.js");
        e("./chunk-RKRGAFXY.js");
        var l = e("./chunk-2LBGT4GH.js")
          , u = e("./chunk-U7ZUGCE7.js")
          , c = e("./chunk-E4C7EW4R.js")
          , d = e("./chunk-6NZW4WK4.js")
          , f = e("./chunk-DHVKFDHQ.js")
          , h = e("./chunk-QEPVHEP7.js")
          , p = e("./chunk-6ZDHSOUV.js")
          , g = e("./chunk-IZC266HS.js")
          , m = e("./chunk-QVEKZRZ2.js")
          , b = e("./chunk-Z2RGWDD7.js");
        e("./chunk-3W5G4CYI.js"),
        e("./chunk-EQMZL4XU.js"),
        r.AssertionError = p.AssertionError,
        r.CAIP_ACCOUNT_ADDRESS_REGEX = u.CAIP_ACCOUNT_ADDRESS_REGEX,
        r.CAIP_ACCOUNT_ID_REGEX = u.CAIP_ACCOUNT_ID_REGEX,
        r.CAIP_CHAIN_ID_REGEX = u.CAIP_CHAIN_ID_REGEX,
        r.CAIP_NAMESPACE_REGEX = u.CAIP_NAMESPACE_REGEX,
        r.CAIP_REFERENCE_REGEX = u.CAIP_REFERENCE_REGEX,
        r.CaipAccountAddressStruct = u.CaipAccountAddressStruct,
        r.CaipAccountIdStruct = u.CaipAccountIdStruct,
        r.CaipChainIdStruct = u.CaipChainIdStruct,
        r.CaipNamespaceStruct = u.CaipNamespaceStruct,
        r.CaipReferenceStruct = u.CaipReferenceStruct,
        r.ChecksumStruct = c.ChecksumStruct,
        r.Duration = o.Duration,
        r.ESCAPE_CHARACTERS_REGEXP = m.ESCAPE_CHARACTERS_REGEXP,
        r.FrozenMap = b.FrozenMap,
        r.FrozenSet = b.FrozenSet,
        r.HexAddressStruct = h.HexAddressStruct,
        r.HexChecksumAddressStruct = h.HexChecksumAddressStruct,
        r.HexStruct = h.HexStruct,
        r.JsonRpcErrorStruct = a.JsonRpcErrorStruct,
        r.JsonRpcFailureStruct = a.JsonRpcFailureStruct,
        r.JsonRpcIdStruct = a.JsonRpcIdStruct,
        r.JsonRpcNotificationStruct = a.JsonRpcNotificationStruct,
        r.JsonRpcParamsStruct = a.JsonRpcParamsStruct,
        r.JsonRpcRequestStruct = a.JsonRpcRequestStruct,
        r.JsonRpcResponseStruct = a.JsonRpcResponseStruct,
        r.JsonRpcSuccessStruct = a.JsonRpcSuccessStruct,
        r.JsonRpcVersionStruct = a.JsonRpcVersionStruct,
        r.JsonSize = m.JsonSize,
        r.JsonStruct = a.JsonStruct,
        r.PendingJsonRpcResponseStruct = a.PendingJsonRpcResponseStruct,
        r.StrictHexStruct = h.StrictHexStruct,
        r.UnsafeJsonStruct = a.UnsafeJsonStruct,
        r.VersionRangeStruct = s.VersionRangeStruct,
        r.VersionStruct = s.VersionStruct,
        r.add0x = h.add0x,
        r.assert = p.assert,
        r.assertExhaustive = p.assertExhaustive,
        r.assertIsBytes = h.assertIsBytes,
        r.assertIsHexString = h.assertIsHexString,
        r.assertIsJsonRpcError = a.assertIsJsonRpcError,
        r.assertIsJsonRpcFailure = a.assertIsJsonRpcFailure,
        r.assertIsJsonRpcNotification = a.assertIsJsonRpcNotification,
        r.assertIsJsonRpcRequest = a.assertIsJsonRpcRequest,
        r.assertIsJsonRpcResponse = a.assertIsJsonRpcResponse,
        r.assertIsJsonRpcSuccess = a.assertIsJsonRpcSuccess,
        r.assertIsPendingJsonRpcResponse = a.assertIsPendingJsonRpcResponse,
        r.assertIsSemVerRange = s.assertIsSemVerRange,
        r.assertIsSemVerVersion = s.assertIsSemVerVersion,
        r.assertIsStrictHexString = h.assertIsStrictHexString,
        r.assertStruct = p.assertStruct,
        r.base64 = d.base64,
        r.base64ToBytes = h.base64ToBytes,
        r.bigIntToBytes = h.bigIntToBytes,
        r.bigIntToHex = n.bigIntToHex,
        r.bytesToBase64 = h.bytesToBase64,
        r.bytesToBigInt = h.bytesToBigInt,
        r.bytesToHex = h.bytesToHex,
        r.bytesToNumber = h.bytesToNumber,
        r.bytesToSignedBigInt = h.bytesToSignedBigInt,
        r.bytesToString = h.bytesToString,
        r.calculateNumberSize = m.calculateNumberSize,
        r.calculateStringSize = m.calculateStringSize,
        r.concatBytes = h.concatBytes,
        r.createBigInt = f.createBigInt,
        r.createBytes = f.createBytes,
        r.createDataView = h.createDataView,
        r.createDeferredPromise = i.createDeferredPromise,
        r.createHex = f.createHex,
        r.createModuleLogger = l.createModuleLogger,
        r.createNumber = f.createNumber,
        r.createProjectLogger = l.createProjectLogger,
        r.exactOptional = a.exactOptional,
        r.getChecksumAddress = h.getChecksumAddress,
        r.getErrorMessage = g.getErrorMessage,
        r.getJsonRpcIdValidator = a.getJsonRpcIdValidator,
        r.getJsonSize = a.getJsonSize,
        r.getKnownPropertyNames = m.getKnownPropertyNames,
        r.getSafeJson = a.getSafeJson,
        r.gtRange = s.gtRange,
        r.gtVersion = s.gtVersion,
        r.hasProperty = m.hasProperty,
        r.hexToBigInt = n.hexToBigInt,
        r.hexToBytes = h.hexToBytes,
        r.hexToNumber = n.hexToNumber,
        r.inMilliseconds = o.inMilliseconds,
        r.isASCII = m.isASCII,
        r.isBytes = h.isBytes,
        r.isCaipAccountAddress = u.isCaipAccountAddress,
        r.isCaipAccountId = u.isCaipAccountId,
        r.isCaipChainId = u.isCaipChainId,
        r.isCaipNamespace = u.isCaipNamespace,
        r.isCaipReference = u.isCaipReference,
        r.isErrorWithCode = g.isErrorWithCode,
        r.isErrorWithMessage = g.isErrorWithMessage,
        r.isErrorWithStack = g.isErrorWithStack,
        r.isHexString = h.isHexString,
        r.isJsonRpcError = a.isJsonRpcError,
        r.isJsonRpcFailure = a.isJsonRpcFailure,
        r.isJsonRpcNotification = a.isJsonRpcNotification,
        r.isJsonRpcRequest = a.isJsonRpcRequest,
        r.isJsonRpcResponse = a.isJsonRpcResponse,
        r.isJsonRpcSuccess = a.isJsonRpcSuccess,
        r.isNonEmptyArray = m.isNonEmptyArray,
        r.isNullOrUndefined = m.isNullOrUndefined,
        r.isObject = m.isObject,
        r.isPendingJsonRpcResponse = a.isPendingJsonRpcResponse,
        r.isPlainObject = m.isPlainObject,
        r.isStrictHexString = h.isStrictHexString,
        r.isValidChecksumAddress = h.isValidChecksumAddress,
        r.isValidHexAddress = h.isValidHexAddress,
        r.isValidJson = a.isValidJson,
        r.isValidSemVerRange = s.isValidSemVerRange,
        r.isValidSemVerVersion = s.isValidSemVerVersion,
        r.jsonrpc2 = a.jsonrpc2,
        r.numberToBytes = h.numberToBytes,
        r.numberToHex = n.numberToHex,
        r.object = a.object,
        r.parseCaipAccountId = u.parseCaipAccountId,
        r.parseCaipChainId = u.parseCaipChainId,
        r.remove0x = h.remove0x,
        r.satisfiesVersionRange = s.satisfiesVersionRange,
        r.signedBigIntToBytes = h.signedBigIntToBytes,
        r.stringToBytes = h.stringToBytes,
        r.timeSince = o.timeSince,
        r.valueToBytes = h.valueToBytes,
        r.wrapError = g.wrapError
    }
    , {
        "./chunk-2LBGT4GH.js": 93,
        "./chunk-3W5G4CYI.js": 94,
        "./chunk-4D6XQBHA.js": 95,
        "./chunk-4NIRTM4M.js": 96,
        "./chunk-4RMX5YWE.js": 97,
        "./chunk-5AVWINSB.js": 98,
        "./chunk-6NZW4WK4.js": 99,
        "./chunk-6ZDHSOUV.js": 100,
        "./chunk-DHVKFDHQ.js": 101,
        "./chunk-E4C7EW4R.js": 102,
        "./chunk-EQMZL4XU.js": 103,
        "./chunk-IZC266HS.js": 104,
        "./chunk-LC2CRSWD.js": 105,
        "./chunk-OLLG4H35.js": 106,
        "./chunk-QEPVHEP7.js": 107,
        "./chunk-QVEKZRZ2.js": 108,
        "./chunk-RKRGAFXY.js": 109,
        "./chunk-U7ZUGCE7.js": 110,
        "./chunk-UOTVU7OQ.js": 111,
        "./chunk-VFXTVNXN.js": 112,
        "./chunk-Z2RGWDD7.js": 113
    }],
    115: [function(e, t, r) {
        "use strict";
        function n(e) {
            if (!Number.isSafeInteger(e) || e < 0)
                throw new Error(`Wrong positive integer: ${e}`)
        }
        function i(e) {
            if ("boolean" != typeof e)
                throw new Error(`Expected boolean, not ${e}`)
        }
        function o(e, ...t) {
            if (!((r = e)instanceof Uint8Array || null != r && "object" == typeof r && "Uint8Array" === r.constructor.name))
                throw new Error("Expected Uint8Array");
            var r;
            if (t.length > 0 && !t.includes(e.length))
                throw new Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`)
        }
        function s(e) {
            if ("function" != typeof e || "function" != typeof e.create)
                throw new Error("Hash should be wrapped by utils.wrapConstructor");
            n(e.outputLen),
            n(e.blockLen)
        }
        function a(e, t=!0) {
            if (e.destroyed)
                throw new Error("Hash instance has been destroyed");
            if (t && e.finished)
                throw new Error("Hash#digest() has already been called")
        }
        function l(e, t) {
            o(e);
            const r = t.outputLen;
            if (e.length < r)
                throw new Error(`digestInto() expects output buffer of length at least ${r}`)
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.output = r.exists = r.hash = r.bytes = r.bool = r.number = void 0,
        r.number = n,
        r.bool = i,
        r.bytes = o,
        r.hash = s,
        r.exists = a,
        r.output = l;
        const u = {
            number: n,
            bool: i,
            bytes: o,
            hash: s,
            exists: a,
            output: l
        };
        r.default = u
    }
    , {}],
    116: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.add5L = r.add5H = r.add4H = r.add4L = r.add3H = r.add3L = r.add = r.rotlBL = r.rotlBH = r.rotlSL = r.rotlSH = r.rotr32L = r.rotr32H = r.rotrBL = r.rotrBH = r.rotrSL = r.rotrSH = r.shrSL = r.shrSH = r.toBig = r.split = r.fromBig = void 0;
        const n = BigInt(2 ** 32 - 1)
          , i = BigInt(32);
        function o(e, t=!1) {
            return t ? {
                h: Number(e & n),
                l: Number(e >> i & n)
            } : {
                h: 0 | Number(e >> i & n),
                l: 0 | Number(e & n)
            }
        }
        function s(e, t=!1) {
            let r = new Uint32Array(e.length)
              , n = new Uint32Array(e.length);
            for (let i = 0; i < e.length; i++) {
                const {h: s, l: a} = o(e[i], t);
                [r[i],n[i]] = [s, a]
            }
            return [r, n]
        }
        r.fromBig = o,
        r.split = s;
        const a = (e,t)=>BigInt(e >>> 0) << i | BigInt(t >>> 0);
        r.toBig = a;
        const l = (e,t,r)=>e >>> r;
        r.shrSH = l;
        const u = (e,t,r)=>e << 32 - r | t >>> r;
        r.shrSL = u;
        const c = (e,t,r)=>e >>> r | t << 32 - r;
        r.rotrSH = c;
        const d = (e,t,r)=>e << 32 - r | t >>> r;
        r.rotrSL = d;
        const f = (e,t,r)=>e << 64 - r | t >>> r - 32;
        r.rotrBH = f;
        const h = (e,t,r)=>e >>> r - 32 | t << 64 - r;
        r.rotrBL = h;
        const p = (e,t)=>t;
        r.rotr32H = p;
        const g = (e,t)=>e;
        r.rotr32L = g;
        const m = (e,t,r)=>e << r | t >>> 32 - r;
        r.rotlSH = m;
        const b = (e,t,r)=>t << r | e >>> 32 - r;
        r.rotlSL = b;
        const y = (e,t,r)=>t << r - 32 | e >>> 64 - r;
        r.rotlBH = y;
        const v = (e,t,r)=>e << r - 32 | t >>> 64 - r;
        function w(e, t, r, n) {
            const i = (t >>> 0) + (n >>> 0);
            return {
                h: e + r + (i / 2 ** 32 | 0) | 0,
                l: 0 | i
            }
        }
        r.rotlBL = v,
        r.add = w;
        const _ = (e,t,r)=>(e >>> 0) + (t >>> 0) + (r >>> 0);
        r.add3L = _;
        const E = (e,t,r,n)=>t + r + n + (e / 2 ** 32 | 0) | 0;
        r.add3H = E;
        const S = (e,t,r,n)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0);
        r.add4L = S;
        const A = (e,t,r,n,i)=>t + r + n + i + (e / 2 ** 32 | 0) | 0;
        r.add4H = A;
        const R = (e,t,r,n,i)=>(e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0);
        r.add5L = R;
        const x = (e,t,r,n,i,o)=>t + r + n + i + o + (e / 2 ** 32 | 0) | 0;
        r.add5H = x;
        const T = {
            fromBig: o,
            split: s,
            toBig: a,
            shrSH: l,
            shrSL: u,
            rotrSH: c,
            rotrSL: d,
            rotrBH: f,
            rotrBL: h,
            rotr32H: p,
            rotr32L: g,
            rotlSH: m,
            rotlSL: b,
            rotlBH: y,
            rotlBL: v,
            add: w,
            add3L: _,
            add3H: E,
            add4L: S,
            add4H: A,
            add5H: x,
            add5L: R
        };
        r.default = T
    }
    , {}],
    117: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.crypto = void 0,
        r.crypto = "object" == typeof globalThis && "crypto"in globalThis ? globalThis.crypto : void 0
    }
    , {}],
    118: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.shake256 = r.shake128 = r.keccak_512 = r.keccak_384 = r.keccak_256 = r.keccak_224 = r.sha3_512 = r.sha3_384 = r.sha3_256 = r.sha3_224 = r.Keccak = r.keccakP = void 0;
        const n = e("./_assert.js")
          , i = e("./_u64.js")
          , o = e("./utils.js")
          , [s,a,l] = [[], [], []]
          , u = BigInt(0)
          , c = BigInt(1)
          , d = BigInt(2)
          , f = BigInt(7)
          , h = BigInt(256)
          , p = BigInt(113);
        for (let e = 0, t = c, r = 1, n = 0; e < 24; e++) {
            [r,n] = [n, (2 * r + 3 * n) % 5],
            s.push(2 * (5 * n + r)),
            a.push((e + 1) * (e + 2) / 2 % 64);
            let i = u;
            for (let e = 0; e < 7; e++)
                t = (t << c ^ (t >> f) * p) % h,
                t & d && (i ^= c << (c << BigInt(e)) - c);
            l.push(i)
        }
        const [g,m] = (0,
        i.split)(l, !0)
          , b = (e,t,r)=>r > 32 ? (0,
        i.rotlBH)(e, t, r) : (0,
        i.rotlSH)(e, t, r)
          , y = (e,t,r)=>r > 32 ? (0,
        i.rotlBL)(e, t, r) : (0,
        i.rotlSL)(e, t, r);
        function v(e, t=24) {
            const r = new Uint32Array(10);
            for (let n = 24 - t; n < 24; n++) {
                for (let t = 0; t < 10; t++)
                    r[t] = e[t] ^ e[t + 10] ^ e[t + 20] ^ e[t + 30] ^ e[t + 40];
                for (let t = 0; t < 10; t += 2) {
                    const n = (t + 8) % 10
                      , i = (t + 2) % 10
                      , o = r[i]
                      , s = r[i + 1]
                      , a = b(o, s, 1) ^ r[n]
                      , l = y(o, s, 1) ^ r[n + 1];
                    for (let r = 0; r < 50; r += 10)
                        e[t + r] ^= a,
                        e[t + r + 1] ^= l
                }
                let t = e[2]
                  , i = e[3];
                for (let r = 0; r < 24; r++) {
                    const n = a[r]
                      , o = b(t, i, n)
                      , l = y(t, i, n)
                      , u = s[r];
                    t = e[u],
                    i = e[u + 1],
                    e[u] = o,
                    e[u + 1] = l
                }
                for (let t = 0; t < 50; t += 10) {
                    for (let n = 0; n < 10; n++)
                        r[n] = e[t + n];
                    for (let n = 0; n < 10; n++)
                        e[t + n] ^= ~r[(n + 2) % 10] & r[(n + 4) % 10]
                }
                e[0] ^= g[n],
                e[1] ^= m[n]
            }
            r.fill(0)
        }
        r.keccakP = v;
        class w extends o.Hash {
            constructor(e, t, r, i=!1, s=24) {
                if (super(),
                this.blockLen = e,
                this.suffix = t,
                this.outputLen = r,
                this.enableXOF = i,
                this.rounds = s,
                this.pos = 0,
                this.posOut = 0,
                this.finished = !1,
                this.destroyed = !1,
                (0,
                n.number)(r),
                0 >= this.blockLen || this.blockLen >= 200)
                    throw new Error("Sha3 supports only keccak-f1600 function");
                this.state = new Uint8Array(200),
                this.state32 = (0,
                o.u32)(this.state)
            }
            keccak() {
                v(this.state32, this.rounds),
                this.posOut = 0,
                this.pos = 0
            }
            update(e) {
                (0,
                n.exists)(this);
                const {blockLen: t, state: r} = this
                  , i = (e = (0,
                o.toBytes)(e)).length;
                for (let n = 0; n < i; ) {
                    const o = Math.min(t - this.pos, i - n);
                    for (let t = 0; t < o; t++)
                        r[this.pos++] ^= e[n++];
                    this.pos === t && this.keccak()
                }
                return this
            }
            finish() {
                if (this.finished)
                    return;
                this.finished = !0;
                const {state: e, suffix: t, pos: r, blockLen: n} = this;
                e[r] ^= t,
                0 != (128 & t) && r === n - 1 && this.keccak(),
                e[n - 1] ^= 128,
                this.keccak()
            }
            writeInto(e) {
                (0,
                n.exists)(this, !1),
                (0,
                n.bytes)(e),
                this.finish();
                const t = this.state
                  , {blockLen: r} = this;
                for (let n = 0, i = e.length; n < i; ) {
                    this.posOut >= r && this.keccak();
                    const o = Math.min(r - this.posOut, i - n);
                    e.set(t.subarray(this.posOut, this.posOut + o), n),
                    this.posOut += o,
                    n += o
                }
                return e
            }
            xofInto(e) {
                if (!this.enableXOF)
                    throw new Error("XOF is not possible for this instance");
                return this.writeInto(e)
            }
            xof(e) {
                return (0,
                n.number)(e),
                this.xofInto(new Uint8Array(e))
            }
            digestInto(e) {
                if ((0,
                n.output)(e, this),
                this.finished)
                    throw new Error("digest() was already called");
                return this.writeInto(e),
                this.destroy(),
                e
            }
            digest() {
                return this.digestInto(new Uint8Array(this.outputLen))
            }
            destroy() {
                this.destroyed = !0,
                this.state.fill(0)
            }
            _cloneInto(e) {
                const {blockLen: t, suffix: r, outputLen: n, rounds: i, enableXOF: o} = this;
                return e || (e = new w(t,r,n,o,i)),
                e.state32.set(this.state32),
                e.pos = this.pos,
                e.posOut = this.posOut,
                e.finished = this.finished,
                e.rounds = i,
                e.suffix = r,
                e.outputLen = n,
                e.enableXOF = o,
                e.destroyed = this.destroyed,
                e
            }
        }
        r.Keccak = w;
        const _ = (e,t,r)=>(0,
        o.wrapConstructor)((()=>new w(t,e,r)));
        r.sha3_224 = _(6, 144, 28),
        r.sha3_256 = _(6, 136, 32),
        r.sha3_384 = _(6, 104, 48),
        r.sha3_512 = _(6, 72, 64),
        r.keccak_224 = _(1, 144, 28),
        r.keccak_256 = _(1, 136, 32),
        r.keccak_384 = _(1, 104, 48),
        r.keccak_512 = _(1, 72, 64);
        const E = (e,t,r)=>(0,
        o.wrapXOFConstructorWithOpts)(((n={})=>new w(t,e,void 0 === n.dkLen ? r : n.dkLen,!0)));
        r.shake128 = E(31, 168, 16),
        r.shake256 = E(31, 136, 32)
    }
    , {
        "./_assert.js": 115,
        "./_u64.js": 116,
        "./utils.js": 119
    }],
    119: [function(e, t, r) {
        "use strict";
        /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.randomBytes = r.wrapXOFConstructorWithOpts = r.wrapConstructorWithOpts = r.wrapConstructor = r.checkOpts = r.Hash = r.concatBytes = r.toBytes = r.utf8ToBytes = r.asyncLoop = r.nextTick = r.hexToBytes = r.bytesToHex = r.isLE = r.rotr = r.createView = r.u32 = r.u8 = void 0;
        const n = e("@noble/hashes/crypto");
        r.u8 = e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength);
        function i(e) {
            return e instanceof Uint8Array || null != e && "object" == typeof e && "Uint8Array" === e.constructor.name
        }
        r.u32 = e=>new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength / 4));
        r.createView = e=>new DataView(e.buffer,e.byteOffset,e.byteLength);
        if (r.rotr = (e,t)=>e << 32 - t | e >>> t,
        r.isLE = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0],
        !r.isLE)
            throw new Error("Non little-endian hardware is not supported");
        const o = Array.from({
            length: 256
        }, ((e,t)=>t.toString(16).padStart(2, "0")));
        r.bytesToHex = function(e) {
            if (!i(e))
                throw new Error("Uint8Array expected");
            let t = "";
            for (let r = 0; r < e.length; r++)
                t += o[e[r]];
            return t
        }
        ;
        const s = {
            _0: 48,
            _9: 57,
            _A: 65,
            _F: 70,
            _a: 97,
            _f: 102
        };
        function a(e) {
            return e >= s._0 && e <= s._9 ? e - s._0 : e >= s._A && e <= s._F ? e - (s._A - 10) : e >= s._a && e <= s._f ? e - (s._a - 10) : void 0
        }
        r.hexToBytes = function(e) {
            if ("string" != typeof e)
                throw new Error("hex string expected, got " + typeof e);
            const t = e.length
              , r = t / 2;
            if (t % 2)
                throw new Error("padded hex string expected, got unpadded hex of length " + t);
            const n = new Uint8Array(r);
            for (let t = 0, i = 0; t < r; t++,
            i += 2) {
                const r = a(e.charCodeAt(i))
                  , o = a(e.charCodeAt(i + 1));
                if (void 0 === r || void 0 === o) {
                    const t = e[i] + e[i + 1];
                    throw new Error('hex string expected, got non-hex character "' + t + '" at index ' + i)
                }
                n[t] = 16 * r + o
            }
            return n
        }
        ;
        function l(e) {
            if ("string" != typeof e)
                throw new Error("utf8ToBytes expected string, got " + typeof e);
            return new Uint8Array((new TextEncoder).encode(e))
        }
        function u(e) {
            if ("string" == typeof e && (e = l(e)),
            !i(e))
                throw new Error("expected Uint8Array, got " + typeof e);
            return e
        }
        r.nextTick = async()=>{}
        ,
        r.asyncLoop = async function(e, t, n) {
            let i = Date.now();
            for (let o = 0; o < e; o++) {
                n(o);
                const e = Date.now() - i;
                e >= 0 && e < t || (await (0,
                r.nextTick)(),
                i += e)
            }
        }
        ,
        r.utf8ToBytes = l,
        r.toBytes = u,
        r.concatBytes = function(...e) {
            let t = 0;
            for (let r = 0; r < e.length; r++) {
                const n = e[r];
                if (!i(n))
                    throw new Error("Uint8Array expected");
                t += n.length
            }
            const r = new Uint8Array(t);
            for (let t = 0, n = 0; t < e.length; t++) {
                const i = e[t];
                r.set(i, n),
                n += i.length
            }
            return r
        }
        ;
        r.Hash = class {
            clone() {
                return this._cloneInto()
            }
        }
        ;
        const c = {}.toString;
        r.checkOpts = function(e, t) {
            if (void 0 !== t && "[object Object]" !== c.call(t))
                throw new Error("Options should be object or undefined");
            return Object.assign(e, t)
        }
        ,
        r.wrapConstructor = function(e) {
            const t = t=>e().update(u(t)).digest()
              , r = e();
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = ()=>e(),
            t
        }
        ,
        r.wrapConstructorWithOpts = function(e) {
            const t = (t,r)=>e(r).update(u(t)).digest()
              , r = e({});
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = t=>e(t),
            t
        }
        ,
        r.wrapXOFConstructorWithOpts = function(e) {
            const t = (t,r)=>e(r).update(u(t)).digest()
              , r = e({});
            return t.outputLen = r.outputLen,
            t.blockLen = r.blockLen,
            t.create = t=>e(t),
            t
        }
        ,
        r.randomBytes = function(e=32) {
            if (n.crypto && "function" == typeof n.crypto.getRandomValues)
                return n.crypto.getRandomValues(new Uint8Array(e));
            throw new Error("crypto.getRandomValues must be defined")
        }
    }
    , {
        "@noble/hashes/crypto": 117
    }],
    120: [function(e, t, r) {
        "use strict";
        /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
        function n(e) {
            if (!Number.isSafeInteger(e))
                throw new Error(`Wrong integer: ${e}`)
        }
        function i(...e) {
            const t = (e,t)=>r=>e(t(r));
            return {
                encode: Array.from(e).reverse().reduce(((e,r)=>e ? t(e, r.encode) : r.encode), void 0),
                decode: e.reduce(((e,r)=>e ? t(e, r.decode) : r.decode), void 0)
            }
        }
        function o(e) {
            return {
                encode: t=>{
                    if (!Array.isArray(t) || t.length && "number" != typeof t[0])
                        throw new Error("alphabet.encode input should be an array of numbers");
                    return t.map((t=>{
                        if (n(t),
                        t < 0 || t >= e.length)
                            throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
                        return e[t]
                    }
                    ))
                }
                ,
                decode: t=>{
                    if (!Array.isArray(t) || t.length && "string" != typeof t[0])
                        throw new Error("alphabet.decode input should be array of strings");
                    return t.map((t=>{
                        if ("string" != typeof t)
                            throw new Error(`alphabet.decode: not string element=${t}`);
                        const r = e.indexOf(t);
                        if (-1 === r)
                            throw new Error(`Unknown letter: "${t}". Allowed: ${e}`);
                        return r
                    }
                    ))
                }
            }
        }
        function s(e="") {
            if ("string" != typeof e)
                throw new Error("join separator should be string");
            return {
                encode: t=>{
                    if (!Array.isArray(t) || t.length && "string" != typeof t[0])
                        throw new Error("join.encode input should be array of strings");
                    for (let e of t)
                        if ("string" != typeof e)
                            throw new Error(`join.encode: non-string input=${e}`);
                    return t.join(e)
                }
                ,
                decode: t=>{
                    if ("string" != typeof t)
                        throw new Error("join.decode input should be string");
                    return t.split(e)
                }
            }
        }
        function a(e, t="=") {
            if (n(e),
            "string" != typeof t)
                throw new Error("padding chr should be string");
            return {
                encode(r) {
                    if (!Array.isArray(r) || r.length && "string" != typeof r[0])
                        throw new Error("padding.encode input should be array of strings");
                    for (let e of r)
                        if ("string" != typeof e)
                            throw new Error(`padding.encode: non-string input=${e}`);
                    for (; r.length * e % 8; )
                        r.push(t);
                    return r
                },
                decode(r) {
                    if (!Array.isArray(r) || r.length && "string" != typeof r[0])
                        throw new Error("padding.encode input should be array of strings");
                    for (let e of r)
                        if ("string" != typeof e)
                            throw new Error(`padding.decode: non-string input=${e}`);
                    let n = r.length;
                    if (n * e % 8)
                        throw new Error("Invalid padding: string should have whole number of bytes");
                    for (; n > 0 && r[n - 1] === t; n--)
                        if (!((n - 1) * e % 8))
                            throw new Error("Invalid padding: string has too much padding");
                    return r.slice(0, n)
                }
            }
        }
        function l(e) {
            if ("function" != typeof e)
                throw new Error("normalize fn should be function");
            return {
                encode: e=>e,
                decode: t=>e(t)
            }
        }
        function u(e, t, r) {
            if (t < 2)
                throw new Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
            if (r < 2)
                throw new Error(`convertRadix: wrong to=${r}, base cannot be less than 2`);
            if (!Array.isArray(e))
                throw new Error("convertRadix: data should be array");
            if (!e.length)
                return [];
            let i = 0;
            const o = []
              , s = Array.from(e);
            for (s.forEach((e=>{
                if (n(e),
                e < 0 || e >= t)
                    throw new Error(`Wrong integer: ${e}`)
            }
            )); ; ) {
                let e = 0
                  , n = !0;
                for (let o = i; o < s.length; o++) {
                    const a = s[o]
                      , l = t * e + a;
                    if (!Number.isSafeInteger(l) || t * e / t !== e || l - a != t * e)
                        throw new Error("convertRadix: carry overflow");
                    e = l % r;
                    const u = Math.floor(l / r);
                    if (s[o] = u,
                    !Number.isSafeInteger(u) || u * r + e !== l)
                        throw new Error("convertRadix: carry overflow");
                    n && (u ? n = !1 : i = o)
                }
                if (o.push(e),
                n)
                    break
            }
            for (let t = 0; t < e.length - 1 && 0 === e[t]; t++)
                o.push(0);
            return o.reverse()
        }
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.bytes = r.stringToBytes = r.str = r.bytesToString = r.hex = r.utf8 = r.bech32m = r.bech32 = r.base58check = r.base58xmr = r.base58xrp = r.base58flickr = r.base58 = r.base64urlnopad = r.base64url = r.base64 = r.base32crockford = r.base32hex = r.base32 = r.base16 = r.utils = r.assertNumber = void 0,
        r.assertNumber = n;
        const c = (e,t)=>t ? c(t, e % t) : e
          , d = (e,t)=>e + (t - c(e, t));
        function f(e, t, r, i) {
            if (!Array.isArray(e))
                throw new Error("convertRadix2: data should be array");
            if (t <= 0 || t > 32)
                throw new Error(`convertRadix2: wrong from=${t}`);
            if (r <= 0 || r > 32)
                throw new Error(`convertRadix2: wrong to=${r}`);
            if (d(t, r) > 32)
                throw new Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${d(t, r)}`);
            let o = 0
              , s = 0;
            const a = 2 ** r - 1
              , l = [];
            for (const i of e) {
                if (n(i),
                i >= 2 ** t)
                    throw new Error(`convertRadix2: invalid data word=${i} from=${t}`);
                if (o = o << t | i,
                s + t > 32)
                    throw new Error(`convertRadix2: carry overflow pos=${s} from=${t}`);
                for (s += t; s >= r; s -= r)
                    l.push((o >> s - r & a) >>> 0);
                o &= 2 ** s - 1
            }
            if (o = o << r - s & a,
            !i && s >= t)
                throw new Error("Excess padding");
            if (!i && o)
                throw new Error(`Non-zero padding: ${o}`);
            return i && s > 0 && l.push(o >>> 0),
            l
        }
        function h(e) {
            return n(e),
            {
                encode: t=>{
                    if (!(t instanceof Uint8Array))
                        throw new Error("radix.encode input should be Uint8Array");
                    return u(Array.from(t), 256, e)
                }
                ,
                decode: t=>{
                    if (!Array.isArray(t) || t.length && "number" != typeof t[0])
                        throw new Error("radix.decode input should be array of strings");
                    return Uint8Array.from(u(t, e, 256))
                }
            }
        }
        function p(e, t=!1) {
            if (n(e),
            e <= 0 || e > 32)
                throw new Error("radix2: bits should be in (0..32]");
            if (d(8, e) > 32 || d(e, 8) > 32)
                throw new Error("radix2: carry overflow");
            return {
                encode: r=>{
                    if (!(r instanceof Uint8Array))
                        throw new Error("radix2.encode input should be Uint8Array");
                    return f(Array.from(r), 8, e, !t)
                }
                ,
                decode: r=>{
                    if (!Array.isArray(r) || r.length && "number" != typeof r[0])
                        throw new Error("radix2.decode input should be array of strings");
                    return Uint8Array.from(f(r, e, 8, t))
                }
            }
        }
        function g(e) {
            if ("function" != typeof e)
                throw new Error("unsafeWrapper fn should be function");
            return function(...t) {
                try {
                    return e.apply(null, t)
                } catch (e) {}
            }
        }
        function m(e, t) {
            if (n(e),
            "function" != typeof t)
                throw new Error("checksum fn should be function");
            return {
                encode(r) {
                    if (!(r instanceof Uint8Array))
                        throw new Error("checksum.encode: input should be Uint8Array");
                    const n = t(r).slice(0, e)
                      , i = new Uint8Array(r.length + e);
                    return i.set(r),
                    i.set(n, r.length),
                    i
                },
                decode(r) {
                    if (!(r instanceof Uint8Array))
                        throw new Error("checksum.decode: input should be Uint8Array");
                    const n = r.slice(0, -e)
                      , i = t(n).slice(0, e)
                      , o = r.slice(-e);
                    for (let t = 0; t < e; t++)
                        if (i[t] !== o[t])
                            throw new Error("Invalid checksum");
                    return n
                }
            }
        }
        r.utils = {
            alphabet: o,
            chain: i,
            checksum: m,
            radix: h,
            radix2: p,
            join: s,
            padding: a
        },
        r.base16 = i(p(4), o("0123456789ABCDEF"), s("")),
        r.base32 = i(p(5), o("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), a(5), s("")),
        r.base32hex = i(p(5), o("0123456789ABCDEFGHIJKLMNOPQRSTUV"), a(5), s("")),
        r.base32crockford = i(p(5), o("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), s(""), l((e=>e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))),
        r.base64 = i(p(6), o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), a(6), s("")),
        r.base64url = i(p(6), o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), a(6), s("")),
        r.base64urlnopad = i(p(6), o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), s(""));
        const b = e=>i(h(58), o(e), s(""));
        r.base58 = b("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),
        r.base58flickr = b("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),
        r.base58xrp = b("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
        const y = [0, 2, 3, 5, 6, 7, 9, 10, 11];
        r.base58xmr = {
            encode(e) {
                let t = "";
                for (let n = 0; n < e.length; n += 8) {
                    const i = e.subarray(n, n + 8);
                    t += r.base58.encode(i).padStart(y[i.length], "1")
                }
                return t
            },
            decode(e) {
                let t = [];
                for (let n = 0; n < e.length; n += 11) {
                    const i = e.slice(n, n + 11)
                      , o = y.indexOf(i.length)
                      , s = r.base58.decode(i);
                    for (let e = 0; e < s.length - o; e++)
                        if (0 !== s[e])
                            throw new Error("base58xmr: wrong padding");
                    t = t.concat(Array.from(s.slice(s.length - o)))
                }
                return Uint8Array.from(t)
            }
        };
        r.base58check = e=>i(m(4, (t=>e(e(t)))), r.base58);
        const v = i(o("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), s(""))
          , w = [996825010, 642813549, 513874426, 1027748829, 705979059];
        function _(e) {
            const t = e >> 25;
            let r = (33554431 & e) << 5;
            for (let e = 0; e < w.length; e++)
                1 == (t >> e & 1) && (r ^= w[e]);
            return r
        }
        function E(e, t, r=1) {
            const n = e.length;
            let i = 1;
            for (let t = 0; t < n; t++) {
                const r = e.charCodeAt(t);
                if (r < 33 || r > 126)
                    throw new Error(`Invalid prefix (${e})`);
                i = _(i) ^ r >> 5
            }
            i = _(i);
            for (let t = 0; t < n; t++)
                i = _(i) ^ 31 & e.charCodeAt(t);
            for (let e of t)
                i = _(i) ^ e;
            for (let e = 0; e < 6; e++)
                i = _(i);
            return i ^= r,
            v.encode(f([i % 2 ** 30], 30, 5, !1))
        }
        function S(e) {
            const t = "bech32" === e ? 1 : 734539939
              , r = p(5)
              , n = r.decode
              , i = r.encode
              , o = g(n);
            function s(e, r=90) {
                if ("string" != typeof e)
                    throw new Error("bech32.decode input should be string, not " + typeof e);
                if (e.length < 8 || !1 !== r && e.length > r)
                    throw new TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${r})`);
                const n = e.toLowerCase();
                if (e !== n && e !== e.toUpperCase())
                    throw new Error("String must be lowercase or uppercase");
                const i = (e = n).lastIndexOf("1");
                if (0 === i || -1 === i)
                    throw new Error('Letter "1" must be present between prefix and data only');
                const o = e.slice(0, i)
                  , s = e.slice(i + 1);
                if (s.length < 6)
                    throw new Error("Data must be at least 6 characters long");
                const a = v.decode(s).slice(0, -6)
                  , l = E(o, a, t);
                if (!s.endsWith(l))
                    throw new Error(`Invalid checksum in ${e}: expected "${l}"`);
                return {
                    prefix: o,
                    words: a
                }
            }
            return {
                encode: function(e, r, n=90) {
                    if ("string" != typeof e)
                        throw new Error("bech32.encode prefix should be string, not " + typeof e);
                    if (!Array.isArray(r) || r.length && "number" != typeof r[0])
                        throw new Error("bech32.encode words should be array of numbers, not " + typeof r);
                    const i = e.length + 7 + r.length;
                    if (!1 !== n && i > n)
                        throw new TypeError(`Length ${i} exceeds limit ${n}`);
                    const o = e.toLowerCase()
                      , s = E(o, r, t);
                    return `${o}1${v.encode(r)}${s}`
                },
                decode: s,
                decodeToBytes: function(e) {
                    const {prefix: t, words: r} = s(e, !1);
                    return {
                        prefix: t,
                        words: r,
                        bytes: n(r)
                    }
                },
                decodeUnsafe: g(s),
                fromWords: n,
                fromWordsUnsafe: o,
                toWords: i
            }
        }
        r.bech32 = S("bech32"),
        r.bech32m = S("bech32m"),
        r.utf8 = {
            encode: e=>(new TextDecoder).decode(e),
            decode: e=>(new TextEncoder).encode(e)
        },
        r.hex = i(p(4), o("0123456789abcdef"), s(""), l((e=>{
            if ("string" != typeof e || e.length % 2)
                throw new TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
            return e.toLowerCase()
        }
        )));
        const A = {
            utf8: r.utf8,
            hex: r.hex,
            base16: r.base16,
            base32: r.base32,
            base64: r.base64,
            base64url: r.base64url,
            base58: r.base58,
            base58xmr: r.base58xmr
        }
          , R = "Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr";
        r.bytesToString = (e,t)=>{
            if ("string" != typeof e || !A.hasOwnProperty(e))
                throw new TypeError(R);
            if (!(t instanceof Uint8Array))
                throw new TypeError("bytesToString() expects Uint8Array");
            return A[e].encode(t)
        }
        ,
        r.str = r.bytesToString;
        r.stringToBytes = (e,t)=>{
            if (!A.hasOwnProperty(e))
                throw new TypeError(R);
            if ("string" != typeof t)
                throw new TypeError("stringToBytes() expects string");
            return A[e].decode(t)
        }
        ,
        r.bytes = r.stringToBytes
    }
    , {}],
    121: [function(e, t, r) {
        "use strict";
        const {AbortController: n} = globalThis;
        t.exports = {
            AbortController: n
        }
    }
    , {}],
    122: [function(e, t, r) {
        "use strict";
        r.byteLength = function(e) {
            var t = l(e)
              , r = t[0]
              , n = t[1];
            return 3 * (r + n) / 4 - n
        }
        ,
        r.toByteArray = function(e) {
            var t, r, n = l(e), s = n[0], a = n[1], u = new o(function(e, t, r) {
                return 3 * (t + r) / 4 - r
            }(0, s, a)), c = 0, d = a > 0 ? s - 4 : s;
            for (r = 0; r < d; r += 4)
                t = i[e.charCodeAt(r)] << 18 | i[e.charCodeAt(r + 1)] << 12 | i[e.charCodeAt(r + 2)] << 6 | i[e.charCodeAt(r + 3)],
                u[c++] = t >> 16 & 255,
                u[c++] = t >> 8 & 255,
                u[c++] = 255 & t;
            2 === a && (t = i[e.charCodeAt(r)] << 2 | i[e.charCodeAt(r + 1)] >> 4,
            u[c++] = 255 & t);
            1 === a && (t = i[e.charCodeAt(r)] << 10 | i[e.charCodeAt(r + 1)] << 4 | i[e.charCodeAt(r + 2)] >> 2,
            u[c++] = t >> 8 & 255,
            u[c++] = 255 & t);
            return u
        }
        ,
        r.fromByteArray = function(e) {
            for (var t, r = e.length, i = r % 3, o = [], s = 16383, a = 0, l = r - i; a < l; a += s)
                o.push(u(e, a, a + s > l ? l : a + s));
            1 === i ? (t = e[r - 1],
            o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1],
            o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
            return o.join("")
        }
        ;
        for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0; a < 64; ++a)
            n[a] = s[a],
            i[s.charCodeAt(a)] = a;
        function l(e) {
            var t = e.length;
            if (t % 4 > 0)
                throw new Error("Invalid string. Length must be a multiple of 4");
            var r = e.indexOf("=");
            return -1 === r && (r = t),
            [r, r === t ? 0 : 4 - r % 4]
        }
        function u(e, t, r) {
            for (var i, o, s = [], a = t; a < r; a += 3)
                i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]),
                s.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
            return s.join("")
        }
        i["-".charCodeAt(0)] = 62,
        i["_".charCodeAt(0)] = 63
    }
    , {}],
    123: [function(e, t, r) {}
    , {}],
    124: [function(e, t, r) {
        /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
        "use strict";
        var n = e("base64-js")
          , i = e("ieee754");
        r.Buffer = a,
        r.SlowBuffer = function(e) {
            +e != e && (e = 0);
            return a.alloc(+e)
        }
        ,
        r.INSPECT_MAX_BYTES = 50;
        var o = 2147483647;
        function s(e) {
            if (e > o)
                throw new RangeError('The value "' + e + '" is invalid for option "size"');
            var t = new Uint8Array(e);
            return t.__proto__ = a.prototype,
            t
        }
        function a(e, t, r) {
            if ("number" == typeof e) {
                if ("string" == typeof t)
                    throw new TypeError('The "string" argument must be of type string. Received type number');
                return c(e)
            }
            return l(e, t, r)
        }
        function l(e, t, r) {
            if ("string" == typeof e)
                return function(e, t) {
                    "string" == typeof t && "" !== t || (t = "utf8");
                    if (!a.isEncoding(t))
                        throw new TypeError("Unknown encoding: " + t);
                    var r = 0 | h(e, t)
                      , n = s(r)
                      , i = n.write(e, t);
                    i !== r && (n = n.slice(0, i));
                    return n
                }(e, t);
            if (ArrayBuffer.isView(e))
                return d(e);
            if (null == e)
                throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
            if (U(e, ArrayBuffer) || e && U(e.buffer, ArrayBuffer))
                return function(e, t, r) {
                    if (t < 0 || e.byteLength < t)
                        throw new RangeError('"offset" is outside of buffer bounds');
                    if (e.byteLength < t + (r || 0))
                        throw new RangeError('"length" is outside of buffer bounds');
                    var n;
                    n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e,t) : new Uint8Array(e,t,r);
                    return n.__proto__ = a.prototype,
                    n
                }(e, t, r);
            if ("number" == typeof e)
                throw new TypeError('The "value" argument must not be of type number. Received type number');
            var n = e.valueOf && e.valueOf();
            if (null != n && n !== e)
                return a.from(n, t, r);
            var i = function(e) {
                if (a.isBuffer(e)) {
                    var t = 0 | f(e.length)
                      , r = s(t);
                    return 0 === r.length || e.copy(r, 0, 0, t),
                    r
                }
                if (void 0 !== e.length)
                    return "number" != typeof e.length || W(e.length) ? s(0) : d(e);
                if ("Buffer" === e.type && Array.isArray(e.data))
                    return d(e.data)
            }(e);
            if (i)
                return i;
            if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive])
                return a.from(e[Symbol.toPrimitive]("string"), t, r);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
        }
        function u(e) {
            if ("number" != typeof e)
                throw new TypeError('"size" argument must be of type number');
            if (e < 0)
                throw new RangeError('The value "' + e + '" is invalid for option "size"')
        }
        function c(e) {
            return u(e),
            s(e < 0 ? 0 : 0 | f(e))
        }
        function d(e) {
            for (var t = e.length < 0 ? 0 : 0 | f(e.length), r = s(t), n = 0; n < t; n += 1)
                r[n] = 255 & e[n];
            return r
        }
        function f(e) {
            if (e >= o)
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
            return 0 | e
        }
        function h(e, t) {
            if (a.isBuffer(e))
                return e.length;
            if (ArrayBuffer.isView(e) || U(e, ArrayBuffer))
                return e.byteLength;
            if ("string" != typeof e)
                throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
            var r = e.length
              , n = arguments.length > 2 && !0 === arguments[2];
            if (!n && 0 === r)
                return 0;
            for (var i = !1; ; )
                switch (t) {
                case "ascii":
                case "latin1":
                case "binary":
                    return r;
                case "utf8":
                case "utf-8":
                    return $(e).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * r;
                case "hex":
                    return r >>> 1;
                case "base64":
                    return B(e).length;
                default:
                    if (i)
                        return n ? -1 : $(e).length;
                    t = ("" + t).toLowerCase(),
                    i = !0
                }
        }
        function p(e, t, r) {
            var n = !1;
            if ((void 0 === t || t < 0) && (t = 0),
            t > this.length)
                return "";
            if ((void 0 === r || r > this.length) && (r = this.length),
            r <= 0)
                return "";
            if ((r >>>= 0) <= (t >>>= 0))
                return "";
            for (e || (e = "utf8"); ; )
                switch (e) {
                case "hex":
                    return k(this, t, r);
                case "utf8":
                case "utf-8":
                    return R(this, t, r);
                case "ascii":
                    return T(this, t, r);
                case "latin1":
                case "binary":
                    return O(this, t, r);
                case "base64":
                    return A(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return M(this, t, r);
                default:
                    if (n)
                        throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(),
                    n = !0
                }
        }
        function g(e, t, r) {
            var n = e[t];
            e[t] = e[r],
            e[r] = n
        }
        function m(e, t, r, n, i) {
            if (0 === e.length)
                return -1;
            if ("string" == typeof r ? (n = r,
            r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648),
            W(r = +r) && (r = i ? 0 : e.length - 1),
            r < 0 && (r = e.length + r),
            r >= e.length) {
                if (i)
                    return -1;
                r = e.length - 1
            } else if (r < 0) {
                if (!i)
                    return -1;
                r = 0
            }
            if ("string" == typeof t && (t = a.from(t, n)),
            a.isBuffer(t))
                return 0 === t.length ? -1 : b(e, t, r, n, i);
            if ("number" == typeof t)
                return t &= 255,
                "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : b(e, [t], r, n, i);
            throw new TypeError("val must be string, number or Buffer")
        }
        function b(e, t, r, n, i) {
            var o, s = 1, a = e.length, l = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                if (e.length < 2 || t.length < 2)
                    return -1;
                s = 2,
                a /= 2,
                l /= 2,
                r /= 2
            }
            function u(e, t) {
                return 1 === s ? e[t] : e.readUInt16BE(t * s)
            }
            if (i) {
                var c = -1;
                for (o = r; o < a; o++)
                    if (u(e, o) === u(t, -1 === c ? 0 : o - c)) {
                        if (-1 === c && (c = o),
                        o - c + 1 === l)
                            return c * s
                    } else
                        -1 !== c && (o -= o - c),
                        c = -1
            } else
                for (r + l > a && (r = a - l),
                o = r; o >= 0; o--) {
                    for (var d = !0, f = 0; f < l; f++)
                        if (u(e, o + f) !== u(t, f)) {
                            d = !1;
                            break
                        }
                    if (d)
                        return o
                }
            return -1
        }
        function y(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n)) > i && (n = i) : n = i;
            var o = t.length;
            n > o / 2 && (n = o / 2);
            for (var s = 0; s < n; ++s) {
                var a = parseInt(t.substr(2 * s, 2), 16);
                if (W(a))
                    return s;
                e[r + s] = a
            }
            return s
        }
        function v(e, t, r, n) {
            return F($(t, e.length - r), e, r, n)
        }
        function w(e, t, r, n) {
            return F(function(e) {
                for (var t = [], r = 0; r < e.length; ++r)
                    t.push(255 & e.charCodeAt(r));
                return t
            }(t), e, r, n)
        }
        function _(e, t, r, n) {
            return w(e, t, r, n)
        }
        function E(e, t, r, n) {
            return F(B(t), e, r, n)
        }
        function S(e, t, r, n) {
            return F(function(e, t) {
                for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s)
                    n = (r = e.charCodeAt(s)) >> 8,
                    i = r % 256,
                    o.push(i),
                    o.push(n);
                return o
            }(t, e.length - r), e, r, n)
        }
        function A(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
        }
        function R(e, t, r) {
            r = Math.min(e.length, r);
            for (var n = [], i = t; i < r; ) {
                var o, s, a, l, u = e[i], c = null, d = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
                if (i + d <= r)
                    switch (d) {
                    case 1:
                        u < 128 && (c = u);
                        break;
                    case 2:
                        128 == (192 & (o = e[i + 1])) && (l = (31 & u) << 6 | 63 & o) > 127 && (c = l);
                        break;
                    case 3:
                        o = e[i + 1],
                        s = e[i + 2],
                        128 == (192 & o) && 128 == (192 & s) && (l = (15 & u) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (l < 55296 || l > 57343) && (c = l);
                        break;
                    case 4:
                        o = e[i + 1],
                        s = e[i + 2],
                        a = e[i + 3],
                        128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (l = (15 & u) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && l < 1114112 && (c = l)
                    }
                null === c ? (c = 65533,
                d = 1) : c > 65535 && (c -= 65536,
                n.push(c >>> 10 & 1023 | 55296),
                c = 56320 | 1023 & c),
                n.push(c),
                i += d
            }
            return function(e) {
                var t = e.length;
                if (t <= x)
                    return String.fromCharCode.apply(String, e);
                var r = ""
                  , n = 0;
                for (; n < t; )
                    r += String.fromCharCode.apply(String, e.slice(n, n += x));
                return r
            }(n)
        }
        r.kMaxLength = o,
        a.TYPED_ARRAY_SUPPORT = function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42
                    }
                },
                42 === e.foo()
            } catch (e) {
                return !1
            }
        }(),
        a.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
        Object.defineProperty(a.prototype, "parent", {
            enumerable: !0,
            get: function() {
                if (a.isBuffer(this))
                    return this.buffer
            }
        }),
        Object.defineProperty(a.prototype, "offset", {
            enumerable: !0,
            get: function() {
                if (a.isBuffer(this))
                    return this.byteOffset
            }
        }),
        "undefined" != typeof Symbol && null != Symbol.species && a[Symbol.species] === a && Object.defineProperty(a, Symbol.species, {
            value: null,
            configurable: !0,
            enumerable: !1,
            writable: !1
        }),
        a.poolSize = 8192,
        a.from = function(e, t, r) {
            return l(e, t, r)
        }
        ,
        a.prototype.__proto__ = Uint8Array.prototype,
        a.__proto__ = Uint8Array,
        a.alloc = function(e, t, r) {
            return function(e, t, r) {
                return u(e),
                e <= 0 ? s(e) : void 0 !== t ? "string" == typeof r ? s(e).fill(t, r) : s(e).fill(t) : s(e)
            }(e, t, r)
        }
        ,
        a.allocUnsafe = function(e) {
            return c(e)
        }
        ,
        a.allocUnsafeSlow = function(e) {
            return c(e)
        }
        ,
        a.isBuffer = function(e) {
            return null != e && !0 === e._isBuffer && e !== a.prototype
        }
        ,
        a.compare = function(e, t) {
            if (U(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
            U(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
            !a.isBuffer(e) || !a.isBuffer(t))
                throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e === t)
                return 0;
            for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i)
                if (e[i] !== t[i]) {
                    r = e[i],
                    n = t[i];
                    break
                }
            return r < n ? -1 : n < r ? 1 : 0
        }
        ,
        a.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1
            }
        }
        ,
        a.concat = function(e, t) {
            if (!Array.isArray(e))
                throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length)
                return a.alloc(0);
            var r;
            if (void 0 === t)
                for (t = 0,
                r = 0; r < e.length; ++r)
                    t += e[r].length;
            var n = a.allocUnsafe(t)
              , i = 0;
            for (r = 0; r < e.length; ++r) {
                var o = e[r];
                if (U(o, Uint8Array) && (o = a.from(o)),
                !a.isBuffer(o))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                o.copy(n, i),
                i += o.length
            }
            return n
        }
        ,
        a.byteLength = h,
        a.prototype._isBuffer = !0,
        a.prototype.swap16 = function() {
            var e = this.length;
            if (e % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2)
                g(this, t, t + 1);
            return this
        }
        ,
        a.prototype.swap32 = function() {
            var e = this.length;
            if (e % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4)
                g(this, t, t + 3),
                g(this, t + 1, t + 2);
            return this
        }
        ,
        a.prototype.swap64 = function() {
            var e = this.length;
            if (e % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8)
                g(this, t, t + 7),
                g(this, t + 1, t + 6),
                g(this, t + 2, t + 5),
                g(this, t + 3, t + 4);
            return this
        }
        ,
        a.prototype.toString = function() {
            var e = this.length;
            return 0 === e ? "" : 0 === arguments.length ? R(this, 0, e) : p.apply(this, arguments)
        }
        ,
        a.prototype.toLocaleString = a.prototype.toString,
        a.prototype.equals = function(e) {
            if (!a.isBuffer(e))
                throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === a.compare(this, e)
        }
        ,
        a.prototype.inspect = function() {
            var e = ""
              , t = r.INSPECT_MAX_BYTES;
            return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(),
            this.length > t && (e += " ... "),
            "<Buffer " + e + ">"
        }
        ,
        a.prototype.compare = function(e, t, r, n, i) {
            if (U(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
            !a.isBuffer(e))
                throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
            if (void 0 === t && (t = 0),
            void 0 === r && (r = e ? e.length : 0),
            void 0 === n && (n = 0),
            void 0 === i && (i = this.length),
            t < 0 || r > e.length || n < 0 || i > this.length)
                throw new RangeError("out of range index");
            if (n >= i && t >= r)
                return 0;
            if (n >= i)
                return -1;
            if (t >= r)
                return 1;
            if (this === e)
                return 0;
            for (var o = (i >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (t >>>= 0), l = Math.min(o, s), u = this.slice(n, i), c = e.slice(t, r), d = 0; d < l; ++d)
                if (u[d] !== c[d]) {
                    o = u[d],
                    s = c[d];
                    break
                }
            return o < s ? -1 : s < o ? 1 : 0
        }
        ,
        a.prototype.includes = function(e, t, r) {
            return -1 !== this.indexOf(e, t, r)
        }
        ,
        a.prototype.indexOf = function(e, t, r) {
            return m(this, e, t, r, !0)
        }
        ,
        a.prototype.lastIndexOf = function(e, t, r) {
            return m(this, e, t, r, !1)
        }
        ,
        a.prototype.write = function(e, t, r, n) {
            if (void 0 === t)
                n = "utf8",
                r = this.length,
                t = 0;
            else if (void 0 === r && "string" == typeof t)
                n = t,
                r = this.length,
                t = 0;
            else {
                if (!isFinite(t))
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t >>>= 0,
                isFinite(r) ? (r >>>= 0,
                void 0 === n && (n = "utf8")) : (n = r,
                r = void 0)
            }
            var i = this.length - t;
            if ((void 0 === r || r > i) && (r = i),
            e.length > 0 && (r < 0 || t < 0) || t > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var o = !1; ; )
                switch (n) {
                case "hex":
                    return y(this, e, t, r);
                case "utf8":
                case "utf-8":
                    return v(this, e, t, r);
                case "ascii":
                    return w(this, e, t, r);
                case "latin1":
                case "binary":
                    return _(this, e, t, r);
                case "base64":
                    return E(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return S(this, e, t, r);
                default:
                    if (o)
                        throw new TypeError("Unknown encoding: " + n);
                    n = ("" + n).toLowerCase(),
                    o = !0
                }
        }
        ,
        a.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        }
        ;
        var x = 4096;
        function T(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i)
                n += String.fromCharCode(127 & e[i]);
            return n
        }
        function O(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i)
                n += String.fromCharCode(e[i]);
            return n
        }
        function k(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0),
            (!r || r < 0 || r > n) && (r = n);
            for (var i = "", o = t; o < r; ++o)
                i += D(e[o]);
            return i
        }
        function M(e, t, r) {
            for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2)
                i += String.fromCharCode(n[o] + 256 * n[o + 1]);
            return i
        }
        function N(e, t, r) {
            if (e % 1 != 0 || e < 0)
                throw new RangeError("offset is not uint");
            if (e + t > r)
                throw new RangeError("Trying to access beyond buffer length")
        }
        function j(e, t, r, n, i, o) {
            if (!a.isBuffer(e))
                throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > i || t < o)
                throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length)
                throw new RangeError("Index out of range")
        }
        function P(e, t, r, n, i, o) {
            if (r + n > e.length)
                throw new RangeError("Index out of range");
            if (r < 0)
                throw new RangeError("Index out of range")
        }
        function I(e, t, r, n, o) {
            return t = +t,
            r >>>= 0,
            o || P(e, 0, r, 4),
            i.write(e, t, r, n, 23, 4),
            r + 4
        }
        function C(e, t, r, n, o) {
            return t = +t,
            r >>>= 0,
            o || P(e, 0, r, 8),
            i.write(e, t, r, n, 52, 8),
            r + 8
        }
        a.prototype.slice = function(e, t) {
            var r = this.length;
            (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
            (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
            t < e && (t = e);
            var n = this.subarray(e, t);
            return n.__proto__ = a.prototype,
            n
        }
        ,
        a.prototype.readUIntLE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || N(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); )
                n += this[e + o] * i;
            return n
        }
        ,
        a.prototype.readUIntBE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || N(e, t, this.length);
            for (var n = this[e + --t], i = 1; t > 0 && (i *= 256); )
                n += this[e + --t] * i;
            return n
        }
        ,
        a.prototype.readUInt8 = function(e, t) {
            return e >>>= 0,
            t || N(e, 1, this.length),
            this[e]
        }
        ,
        a.prototype.readUInt16LE = function(e, t) {
            return e >>>= 0,
            t || N(e, 2, this.length),
            this[e] | this[e + 1] << 8
        }
        ,
        a.prototype.readUInt16BE = function(e, t) {
            return e >>>= 0,
            t || N(e, 2, this.length),
            this[e] << 8 | this[e + 1]
        }
        ,
        a.prototype.readUInt32LE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }
        ,
        a.prototype.readUInt32BE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }
        ,
        a.prototype.readIntLE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || N(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); )
                n += this[e + o] * i;
            return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)),
            n
        }
        ,
        a.prototype.readIntBE = function(e, t, r) {
            e >>>= 0,
            t >>>= 0,
            r || N(e, t, this.length);
            for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256); )
                o += this[e + --n] * i;
            return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)),
            o
        }
        ,
        a.prototype.readInt8 = function(e, t) {
            return e >>>= 0,
            t || N(e, 1, this.length),
            128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }
        ,
        a.prototype.readInt16LE = function(e, t) {
            e >>>= 0,
            t || N(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r
        }
        ,
        a.prototype.readInt16BE = function(e, t) {
            e >>>= 0,
            t || N(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r
        }
        ,
        a.prototype.readInt32LE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }
        ,
        a.prototype.readInt32BE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }
        ,
        a.prototype.readFloatLE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            i.read(this, e, !0, 23, 4)
        }
        ,
        a.prototype.readFloatBE = function(e, t) {
            return e >>>= 0,
            t || N(e, 4, this.length),
            i.read(this, e, !1, 23, 4)
        }
        ,
        a.prototype.readDoubleLE = function(e, t) {
            return e >>>= 0,
            t || N(e, 8, this.length),
            i.read(this, e, !0, 52, 8)
        }
        ,
        a.prototype.readDoubleBE = function(e, t) {
            return e >>>= 0,
            t || N(e, 8, this.length),
            i.read(this, e, !1, 52, 8)
        }
        ,
        a.prototype.writeUIntLE = function(e, t, r, n) {
            (e = +e,
            t >>>= 0,
            r >>>= 0,
            n) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = 1
              , o = 0;
            for (this[t] = 255 & e; ++o < r && (i *= 256); )
                this[t + o] = e / i & 255;
            return t + r
        }
        ,
        a.prototype.writeUIntBE = function(e, t, r, n) {
            (e = +e,
            t >>>= 0,
            r >>>= 0,
            n) || j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = r - 1
              , o = 1;
            for (this[t + i] = 255 & e; --i >= 0 && (o *= 256); )
                this[t + i] = e / o & 255;
            return t + r
        }
        ,
        a.prototype.writeUInt8 = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 1, 255, 0),
            this[t] = 255 & e,
            t + 1
        }
        ,
        a.prototype.writeUInt16LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 2, 65535, 0),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            t + 2
        }
        ,
        a.prototype.writeUInt16BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 2, 65535, 0),
            this[t] = e >>> 8,
            this[t + 1] = 255 & e,
            t + 2
        }
        ,
        a.prototype.writeUInt32LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 4, 4294967295, 0),
            this[t + 3] = e >>> 24,
            this[t + 2] = e >>> 16,
            this[t + 1] = e >>> 8,
            this[t] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeUInt32BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 4, 4294967295, 0),
            this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeIntLE = function(e, t, r, n) {
            if (e = +e,
            t >>>= 0,
            !n) {
                var i = Math.pow(2, 8 * r - 1);
                j(this, e, t, r, i - 1, -i)
            }
            var o = 0
              , s = 1
              , a = 0;
            for (this[t] = 255 & e; ++o < r && (s *= 256); )
                e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1),
                this[t + o] = (e / s >> 0) - a & 255;
            return t + r
        }
        ,
        a.prototype.writeIntBE = function(e, t, r, n) {
            if (e = +e,
            t >>>= 0,
            !n) {
                var i = Math.pow(2, 8 * r - 1);
                j(this, e, t, r, i - 1, -i)
            }
            var o = r - 1
              , s = 1
              , a = 0;
            for (this[t + o] = 255 & e; --o >= 0 && (s *= 256); )
                e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1),
                this[t + o] = (e / s >> 0) - a & 255;
            return t + r
        }
        ,
        a.prototype.writeInt8 = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 1, 127, -128),
            e < 0 && (e = 255 + e + 1),
            this[t] = 255 & e,
            t + 1
        }
        ,
        a.prototype.writeInt16LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 2, 32767, -32768),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            t + 2
        }
        ,
        a.prototype.writeInt16BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 2, 32767, -32768),
            this[t] = e >>> 8,
            this[t + 1] = 255 & e,
            t + 2
        }
        ,
        a.prototype.writeInt32LE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 4, 2147483647, -2147483648),
            this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            this[t + 2] = e >>> 16,
            this[t + 3] = e >>> 24,
            t + 4
        }
        ,
        a.prototype.writeInt32BE = function(e, t, r) {
            return e = +e,
            t >>>= 0,
            r || j(this, e, t, 4, 2147483647, -2147483648),
            e < 0 && (e = 4294967295 + e + 1),
            this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e,
            t + 4
        }
        ,
        a.prototype.writeFloatLE = function(e, t, r) {
            return I(this, e, t, !0, r)
        }
        ,
        a.prototype.writeFloatBE = function(e, t, r) {
            return I(this, e, t, !1, r)
        }
        ,
        a.prototype.writeDoubleLE = function(e, t, r) {
            return C(this, e, t, !0, r)
        }
        ,
        a.prototype.writeDoubleBE = function(e, t, r) {
            return C(this, e, t, !1, r)
        }
        ,
        a.prototype.copy = function(e, t, r, n) {
            if (!a.isBuffer(e))
                throw new TypeError("argument should be a Buffer");
            if (r || (r = 0),
            n || 0 === n || (n = this.length),
            t >= e.length && (t = e.length),
            t || (t = 0),
            n > 0 && n < r && (n = r),
            n === r)
                return 0;
            if (0 === e.length || 0 === this.length)
                return 0;
            if (t < 0)
                throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length)
                throw new RangeError("Index out of range");
            if (n < 0)
                throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length),
            e.length - t < n - r && (n = e.length - t + r);
            var i = n - r;
            if (this === e && "function" == typeof Uint8Array.prototype.copyWithin)
                this.copyWithin(t, r, n);
            else if (this === e && r < t && t < n)
                for (var o = i - 1; o >= 0; --o)
                    e[o + t] = this[o + r];
            else
                Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
            return i
        }
        ,
        a.prototype.fill = function(e, t, r, n) {
            if ("string" == typeof e) {
                if ("string" == typeof t ? (n = t,
                t = 0,
                r = this.length) : "string" == typeof r && (n = r,
                r = this.length),
                void 0 !== n && "string" != typeof n)
                    throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !a.isEncoding(n))
                    throw new TypeError("Unknown encoding: " + n);
                if (1 === e.length) {
                    var i = e.charCodeAt(0);
                    ("utf8" === n && i < 128 || "latin1" === n) && (e = i)
                }
            } else
                "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r)
                throw new RangeError("Out of range index");
            if (r <= t)
                return this;
            var o;
            if (t >>>= 0,
            r = void 0 === r ? this.length : r >>> 0,
            e || (e = 0),
            "number" == typeof e)
                for (o = t; o < r; ++o)
                    this[o] = e;
            else {
                var s = a.isBuffer(e) ? e : a.from(e, n)
                  , l = s.length;
                if (0 === l)
                    throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                for (o = 0; o < r - t; ++o)
                    this[o + t] = s[o % l]
            }
            return this
        }
        ;
        var L = /[^+/0-9A-Za-z-_]/g;
        function D(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
        }
        function $(e, t) {
            var r;
            t = t || 1 / 0;
            for (var n = e.length, i = null, o = [], s = 0; s < n; ++s) {
                if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                    if (!i) {
                        if (r > 56319) {
                            (t -= 3) > -1 && o.push(239, 191, 189);
                            continue
                        }
                        if (s + 1 === n) {
                            (t -= 3) > -1 && o.push(239, 191, 189);
                            continue
                        }
                        i = r;
                        continue
                    }
                    if (r < 56320) {
                        (t -= 3) > -1 && o.push(239, 191, 189),
                        i = r;
                        continue
                    }
                    r = 65536 + (i - 55296 << 10 | r - 56320)
                } else
                    i && (t -= 3) > -1 && o.push(239, 191, 189);
                if (i = null,
                r < 128) {
                    if ((t -= 1) < 0)
                        break;
                    o.push(r)
                } else if (r < 2048) {
                    if ((t -= 2) < 0)
                        break;
                    o.push(r >> 6 | 192, 63 & r | 128)
                } else if (r < 65536) {
                    if ((t -= 3) < 0)
                        break;
                    o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                } else {
                    if (!(r < 1114112))
                        throw new Error("Invalid code point");
                    if ((t -= 4) < 0)
                        break;
                    o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                }
            }
            return o
        }
        function B(e) {
            return n.toByteArray(function(e) {
                if ((e = (e = e.split("=")[0]).trim().replace(L, "")).length < 2)
                    return "";
                for (; e.length % 4 != 0; )
                    e += "=";
                return e
            }(e))
        }
        function F(e, t, r, n) {
            for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i)
                t[i + r] = e[i];
            return i
        }
        function U(e, t) {
            return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
        }
        function W(e) {
            return e != e
        }
    }
    , {
        "base64-js": 122,
        ieee754: 168
    }],
    125: [function(e, t, r) {
        (function(e) {
            (function() {
                function t(e) {
                    return Object.prototype.toString.call(e)
                }
                r.isArray = function(e) {
                    return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e)
                }
                ,
                r.isBoolean = function(e) {
                    return "boolean" == typeof e
                }
                ,
                r.isNull = function(e) {
                    return null === e
                }
                ,
                r.isNullOrUndefined = function(e) {
                    return null == e
                }
                ,
                r.isNumber = function(e) {
                    return "number" == typeof e
                }
                ,
                r.isString = function(e) {
                    return "string" == typeof e
                }
                ,
                r.isSymbol = function(e) {
                    return "symbol" == typeof e
                }
                ,
                r.isUndefined = function(e) {
                    return void 0 === e
                }
                ,
                r.isRegExp = function(e) {
                    return "[object RegExp]" === t(e)
                }
                ,
                r.isObject = function(e) {
                    return "object" == typeof e && null !== e
                }
                ,
                r.isDate = function(e) {
                    return "[object Date]" === t(e)
                }
                ,
                r.isError = function(e) {
                    return "[object Error]" === t(e) || e instanceof Error
                }
                ,
                r.isFunction = function(e) {
                    return "function" == typeof e
                }
                ,
                r.isPrimitive = function(e) {
                    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
                }
                ,
                r.isBuffer = e.isBuffer
            }
            ).call(this)
        }
        ).call(this, {
            isBuffer: e("../../is-buffer/index.js")
        })
    }
    , {
        "../../is-buffer/index.js": 170
    }],
    126: [function(e, t, r) {
        var n = 1e3
          , i = 60 * n
          , o = 60 * i
          , s = 24 * o
          , a = 7 * s
          , l = 365.25 * s;
        function u(e, t, r, n) {
            var i = t >= 1.5 * r;
            return Math.round(e / r) + " " + n + (i ? "s" : "")
        }
        t.exports = function(e, t) {
            t = t || {};
            var r = typeof e;
            if ("string" === r && e.length > 0)
                return function(e) {
                    if ((e = String(e)).length > 100)
                        return;
                    var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
                    if (!t)
                        return;
                    var r = parseFloat(t[1]);
                    switch ((t[2] || "ms").toLowerCase()) {
                    case "years":
                    case "year":
                    case "yrs":
                    case "yr":
                    case "y":
                        return r * l;
                    case "weeks":
                    case "week":
                    case "w":
                        return r * a;
                    case "days":
                    case "day":
                    case "d":
                        return r * s;
                    case "hours":
                    case "hour":
                    case "hrs":
                    case "hr":
                    case "h":
                        return r * o;
                    case "minutes":
                    case "minute":
                    case "mins":
                    case "min":
                    case "m":
                        return r * i;
                    case "seconds":
                    case "second":
                    case "secs":
                    case "sec":
                    case "s":
                        return r * n;
                    case "milliseconds":
                    case "millisecond":
                    case "msecs":
                    case "msec":
                    case "ms":
                        return r;
                    default:
                        return
                    }
                }(e);
            if ("number" === r && isFinite(e))
                return t.long ? function(e) {
                    var t = Math.abs(e);
                    if (t >= s)
                        return u(e, t, s, "day");
                    if (t >= o)
                        return u(e, t, o, "hour");
                    if (t >= i)
                        return u(e, t, i, "minute");
                    if (t >= n)
                        return u(e, t, n, "second");
                    return e + " ms"
                }(e) : function(e) {
                    var t = Math.abs(e);
                    if (t >= s)
                        return Math.round(e / s) + "d";
                    if (t >= o)
                        return Math.round(e / o) + "h";
                    if (t >= i)
                        return Math.round(e / i) + "m";
                    if (t >= n)
                        return Math.round(e / n) + "s";
                    return e + "ms"
                }(e);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
        }
    }
    , {}],
    127: [function(e, t, r) {
        (function(n) {
            (function() {
                r.formatArgs = function(e) {
                    if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff),
                    !this.useColors)
                        return;
                    const r = "color: " + this.color;
                    e.splice(1, 0, r, "color: inherit");
                    let n = 0
                      , i = 0;
                    e[0].replace(/%[a-zA-Z%]/g, (e=>{
                        "%%" !== e && (n++,
                        "%c" === e && (i = n))
                    }
                    )),
                    e.splice(i, 0, r)
                }
                ,
                r.save = function(e) {
                    try {
                        e ? r.storage.setItem("debug", e) : r.storage.removeItem("debug")
                    } catch (e) {}
                }
                ,
                r.load = function() {
                    let e;
                    try {
                        e = r.storage.getItem("debug")
                    } catch (e) {}
                    !e && void 0 !== n && "env"in n && (e = n.env.DEBUG);
                    return e
                }
                ,
                r.useColors = function() {
                    if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs))
                        return !0;
                    if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
                        return !1;
                    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
                }
                ,
                r.storage = function() {
                    try {
                        return localStorage
                    } catch (e) {}
                }(),
                r.destroy = (()=>{
                    let e = !1;
                    return ()=>{
                        e || (e = !0,
                        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))
                    }
                }
                )(),
                r.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"],
                r.log = console.debug || console.log || (()=>{}
                ),
                t.exports = e("./common")(r);
                const {formatters: i} = t.exports;
                i.j = function(e) {
                    try {
                        return JSON.stringify(e)
                    } catch (e) {
                        return "[UnexpectedJSONParseError]: " + e.message
                    }
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./common": 128,
        _process: 178
    }],
    128: [function(e, t, r) {
        t.exports = function(t) {
            function r(e) {
                let t, i, o, s = null;
                function a(...e) {
                    if (!a.enabled)
                        return;
                    const n = a
                      , i = Number(new Date)
                      , o = i - (t || i);
                    n.diff = o,
                    n.prev = t,
                    n.curr = i,
                    t = i,
                    e[0] = r.coerce(e[0]),
                    "string" != typeof e[0] && e.unshift("%O");
                    let s = 0;
                    e[0] = e[0].replace(/%([a-zA-Z%])/g, ((t,i)=>{
                        if ("%%" === t)
                            return "%";
                        s++;
                        const o = r.formatters[i];
                        if ("function" == typeof o) {
                            const r = e[s];
                            t = o.call(n, r),
                            e.splice(s, 1),
                            s--
                        }
                        return t
                    }
                    )),
                    r.formatArgs.call(n, e);
                    (n.log || r.log).apply(n, e)
                }
                return a.namespace = e,
                a.useColors = r.useColors(),
                a.color = r.selectColor(e),
                a.extend = n,
                a.destroy = r.destroy,
                Object.defineProperty(a, "enabled", {
                    enumerable: !0,
                    configurable: !1,
                    get: ()=>null !== s ? s : (i !== r.namespaces && (i = r.namespaces,
                    o = r.enabled(e)),
                    o),
                    set: e=>{
                        s = e
                    }
                }),
                "function" == typeof r.init && r.init(a),
                a
            }
            function n(e, t) {
                const n = r(this.namespace + (void 0 === t ? ":" : t) + e);
                return n.log = this.log,
                n
            }
            function i(e) {
                return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*")
            }
            return r.debug = r,
            r.default = r,
            r.coerce = function(e) {
                if (e instanceof Error)
                    return e.stack || e.message;
                return e
            }
            ,
            r.disable = function() {
                const e = [...r.names.map(i), ...r.skips.map(i).map((e=>"-" + e))].join(",");
                return r.enable(""),
                e
            }
            ,
            r.enable = function(e) {
                let t;
                r.save(e),
                r.namespaces = e,
                r.names = [],
                r.skips = [];
                const n = ("string" == typeof e ? e : "").split(/[\s,]+/)
                  , i = n.length;
                for (t = 0; t < i; t++)
                    n[t] && ("-" === (e = n[t].replace(/\*/g, ".*?"))[0] ? r.skips.push(new RegExp("^" + e.slice(1) + "$")) : r.names.push(new RegExp("^" + e + "$")))
            }
            ,
            r.enabled = function(e) {
                if ("*" === e[e.length - 1])
                    return !0;
                let t, n;
                for (t = 0,
                n = r.skips.length; t < n; t++)
                    if (r.skips[t].test(e))
                        return !1;
                for (t = 0,
                n = r.names.length; t < n; t++)
                    if (r.names[t].test(e))
                        return !0;
                return !1
            }
            ,
            r.humanize = e("ms"),
            r.destroy = function() {
                console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
            }
            ,
            Object.keys(t).forEach((e=>{
                r[e] = t[e]
            }
            )),
            r.names = [],
            r.skips = [],
            r.formatters = {},
            r.selectColor = function(e) {
                let t = 0;
                for (let r = 0; r < e.length; r++)
                    t = (t << 5) - t + e.charCodeAt(r),
                    t |= 0;
                return r.colors[Math.abs(t) % r.colors.length]
            }
            ,
            r.enable(r.load()),
            r
        }
    }
    , {
        ms: 126
    }],
    129: [function(e, t, r) {
        (function(r) {
            (function() {
                var n = e("once")
                  , i = function() {}
                  , o = function(e, t, s) {
                    if ("function" == typeof t)
                        return o(e, null, t);
                    t || (t = {}),
                    s = n(s || i);
                    var a = e._writableState
                      , l = e._readableState
                      , u = t.readable || !1 !== t.readable && e.readable
                      , c = t.writable || !1 !== t.writable && e.writable
                      , d = !1
                      , f = function() {
                        e.writable || h()
                    }
                      , h = function() {
                        c = !1,
                        u || s.call(e)
                    }
                      , p = function() {
                        u = !1,
                        c || s.call(e)
                    }
                      , g = function(t) {
                        s.call(e, t ? new Error("exited with error code: " + t) : null)
                    }
                      , m = function(t) {
                        s.call(e, t)
                    }
                      , b = function() {
                        r.nextTick(y)
                    }
                      , y = function() {
                        if (!d)
                            return (!u || l && l.ended && !l.destroyed) && (!c || a && a.ended && !a.destroyed) ? void 0 : s.call(e, new Error("premature close"))
                    }
                      , v = function() {
                        e.req.on("finish", h)
                    };
                    return !function(e) {
                        return e.setHeader && "function" == typeof e.abort
                    }(e) ? c && !a && (e.on("end", f),
                    e.on("close", f)) : (e.on("complete", h),
                    e.on("abort", b),
                    e.req ? v() : e.on("request", v)),
                    function(e) {
                        return e.stdio && Array.isArray(e.stdio) && 3 === e.stdio.length
                    }(e) && e.on("exit", g),
                    e.on("end", p),
                    e.on("finish", h),
                    !1 !== t.error && e.on("error", m),
                    e.on("close", b),
                    function() {
                        d = !0,
                        e.removeListener("complete", h),
                        e.removeListener("abort", b),
                        e.removeListener("request", v),
                        e.req && e.req.removeListener("finish", h),
                        e.removeListener("end", f),
                        e.removeListener("close", f),
                        e.removeListener("finish", h),
                        e.removeListener("exit", g),
                        e.removeListener("end", p),
                        e.removeListener("error", m),
                        e.removeListener("close", b)
                    }
                };
                t.exports = o
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178,
        once: 173
    }],
    130: [function(e, t, r) {
        "use strict";
        var n, i = "object" == typeof Reflect ? Reflect : null, o = i && "function" == typeof i.apply ? i.apply : function(e, t, r) {
            return Function.prototype.apply.call(e, t, r)
        }
        ;
        n = i && "function" == typeof i.ownKeys ? i.ownKeys : Object.getOwnPropertySymbols ? function(e) {
            return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
        }
        : function(e) {
            return Object.getOwnPropertyNames(e)
        }
        ;
        var s = Number.isNaN || function(e) {
            return e != e
        }
        ;
        function a() {
            a.init.call(this)
        }
        t.exports = a,
        t.exports.once = function(e, t) {
            return new Promise((function(r, n) {
                function i(r) {
                    e.removeListener(t, o),
                    n(r)
                }
                function o() {
                    "function" == typeof e.removeListener && e.removeListener("error", i),
                    r([].slice.call(arguments))
                }
                b(e, t, o, {
                    once: !0
                }),
                "error" !== t && function(e, t, r) {
                    "function" == typeof e.on && b(e, "error", t, r)
                }(e, i, {
                    once: !0
                })
            }
            ))
        }
        ,
        a.EventEmitter = a,
        a.prototype._events = void 0,
        a.prototype._eventsCount = 0,
        a.prototype._maxListeners = void 0;
        var l = 10;
        function u(e) {
            if ("function" != typeof e)
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
        }
        function c(e) {
            return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners
        }
        function d(e, t, r, n) {
            var i, o, s, a;
            if (u(r),
            void 0 === (o = e._events) ? (o = e._events = Object.create(null),
            e._eventsCount = 0) : (void 0 !== o.newListener && (e.emit("newListener", t, r.listener ? r.listener : r),
            o = e._events),
            s = o[t]),
            void 0 === s)
                s = o[t] = r,
                ++e._eventsCount;
            else if ("function" == typeof s ? s = o[t] = n ? [r, s] : [s, r] : n ? s.unshift(r) : s.push(r),
            (i = c(e)) > 0 && s.length > i && !s.warned) {
                s.warned = !0;
                var l = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                l.name = "MaxListenersExceededWarning",
                l.emitter = e,
                l.type = t,
                l.count = s.length,
                a = l,
                console && console.warn && console.warn(a)
            }
            return e
        }
        function f() {
            if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn),
                this.fired = !0,
                0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
        }
        function h(e, t, r) {
            var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r
            }
              , i = f.bind(n);
            return i.listener = r,
            n.wrapFn = i,
            i
        }
        function p(e, t, r) {
            var n = e._events;
            if (void 0 === n)
                return [];
            var i = n[t];
            return void 0 === i ? [] : "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function(e) {
                for (var t = new Array(e.length), r = 0; r < t.length; ++r)
                    t[r] = e[r].listener || e[r];
                return t
            }(i) : m(i, i.length)
        }
        function g(e) {
            var t = this._events;
            if (void 0 !== t) {
                var r = t[e];
                if ("function" == typeof r)
                    return 1;
                if (void 0 !== r)
                    return r.length
            }
            return 0
        }
        function m(e, t) {
            for (var r = new Array(t), n = 0; n < t; ++n)
                r[n] = e[n];
            return r
        }
        function b(e, t, r, n) {
            if ("function" == typeof e.on)
                n.once ? e.once(t, r) : e.on(t, r);
            else {
                if ("function" != typeof e.addEventListener)
                    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                e.addEventListener(t, (function i(o) {
                    n.once && e.removeEventListener(t, i),
                    r(o)
                }
                ))
            }
        }
        Object.defineProperty(a, "defaultMaxListeners", {
            enumerable: !0,
            get: function() {
                return l
            },
            set: function(e) {
                if ("number" != typeof e || e < 0 || s(e))
                    throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
                l = e
            }
        }),
        a.init = function() {
            void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null),
            this._eventsCount = 0),
            this._maxListeners = this._maxListeners || void 0
        }
        ,
        a.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || e < 0 || s(e))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
            return this._maxListeners = e,
            this
        }
        ,
        a.prototype.getMaxListeners = function() {
            return c(this)
        }
        ,
        a.prototype.emit = function(e) {
            for (var t = [], r = 1; r < arguments.length; r++)
                t.push(arguments[r]);
            var n = "error" === e
              , i = this._events;
            if (void 0 !== i)
                n = n && void 0 === i.error;
            else if (!n)
                return !1;
            if (n) {
                var s;
                if (t.length > 0 && (s = t[0]),
                s instanceof Error)
                    throw s;
                var a = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
                throw a.context = s,
                a
            }
            var l = i[e];
            if (void 0 === l)
                return !1;
            if ("function" == typeof l)
                o(l, this, t);
            else {
                var u = l.length
                  , c = m(l, u);
                for (r = 0; r < u; ++r)
                    o(c[r], this, t)
            }
            return !0
        }
        ,
        a.prototype.addListener = function(e, t) {
            return d(this, e, t, !1)
        }
        ,
        a.prototype.on = a.prototype.addListener,
        a.prototype.prependListener = function(e, t) {
            return d(this, e, t, !0)
        }
        ,
        a.prototype.once = function(e, t) {
            return u(t),
            this.on(e, h(this, e, t)),
            this
        }
        ,
        a.prototype.prependOnceListener = function(e, t) {
            return u(t),
            this.prependListener(e, h(this, e, t)),
            this
        }
        ,
        a.prototype.removeListener = function(e, t) {
            var r, n, i, o, s;
            if (u(t),
            void 0 === (n = this._events))
                return this;
            if (void 0 === (r = n[e]))
                return this;
            if (r === t || r.listener === t)
                0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e],
                n.removeListener && this.emit("removeListener", e, r.listener || t));
            else if ("function" != typeof r) {
                for (i = -1,
                o = r.length - 1; o >= 0; o--)
                    if (r[o] === t || r[o].listener === t) {
                        s = r[o].listener,
                        i = o;
                        break
                    }
                if (i < 0)
                    return this;
                0 === i ? r.shift() : function(e, t) {
                    for (; t + 1 < e.length; t++)
                        e[t] = e[t + 1];
                    e.pop()
                }(r, i),
                1 === r.length && (n[e] = r[0]),
                void 0 !== n.removeListener && this.emit("removeListener", e, s || t)
            }
            return this
        }
        ,
        a.prototype.off = a.prototype.removeListener,
        a.prototype.removeAllListeners = function(e) {
            var t, r, n;
            if (void 0 === (r = this._events))
                return this;
            if (void 0 === r.removeListener)
                return 0 === arguments.length ? (this._events = Object.create(null),
                this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]),
                this;
            if (0 === arguments.length) {
                var i, o = Object.keys(r);
                for (n = 0; n < o.length; ++n)
                    "removeListener" !== (i = o[n]) && this.removeAllListeners(i);
                return this.removeAllListeners("removeListener"),
                this._events = Object.create(null),
                this._eventsCount = 0,
                this
            }
            if ("function" == typeof (t = r[e]))
                this.removeListener(e, t);
            else if (void 0 !== t)
                for (n = t.length - 1; n >= 0; n--)
                    this.removeListener(e, t[n]);
            return this
        }
        ,
        a.prototype.listeners = function(e) {
            return p(this, e, !0)
        }
        ,
        a.prototype.rawListeners = function(e) {
            return p(this, e, !1)
        }
        ,
        a.listenerCount = function(e, t) {
            return "function" == typeof e.listenerCount ? e.listenerCount(t) : g.call(e, t)
        }
        ,
        a.prototype.listenerCount = g,
        a.prototype.eventNames = function() {
            return this._eventsCount > 0 ? n(this._events) : []
        }
    }
    , {}],
    131: [function(e, t, r) {
        (function(t) {
            (function() {
                "use strict";
                Object.defineProperty(r, "__esModule", {
                    value: !0
                });
                const n = e("readable-stream");
                class i extends n.Duplex {
                    constructor(e) {
                        super({
                            objectMode: !0
                        }),
                        this._port = e,
                        this._port.onMessage.addListener((e=>this._onMessage(e))),
                        this._port.onDisconnect.addListener((()=>this._onDisconnect())),
                        this._log = ()=>null
                    }
                    _onMessage(e) {
                        if (t.isBuffer(e)) {
                            const r = t.from(e);
                            this._log(r, !1),
                            this.push(r)
                        } else
                            this._log(e, !1),
                            this.push(e)
                    }
                    _onDisconnect() {
                        this.destroy()
                    }
                    _read() {}
                    _write(e, r, n) {
                        try {
                            if (t.isBuffer(e)) {
                                const t = e.toJSON();
                                t._isBuffer = !0,
                                this._log(t, !0),
                                this._port.postMessage(t)
                            } else
                                this._log(e, !0),
                                this._port.postMessage(e)
                        } catch (e) {
                            return n(new Error("PortDuplexStream - disconnected"))
                        }
                        return n()
                    }
                    _setLogger(e) {
                        this._log = e
                    }
                }
                r.default = i
            }
            ).call(this)
        }
        ).call(this, e("buffer").Buffer)
    }
    , {
        buffer: 124,
        "readable-stream": 150
    }],
    132: [function(e, t, r) {
        "use strict";
        const {AbortError: n, codes: i} = e("../../ours/errors")
          , {isNodeStream: o, isWebStream: s, kControllerErrorFunction: a} = e("./utils")
          , l = e("./end-of-stream")
          , {ERR_INVALID_ARG_TYPE: u} = i;
        t.exports.addAbortSignal = function(e, r) {
            if (((e,t)=>{
                if ("object" != typeof e || !("aborted"in e))
                    throw new u(t,"AbortSignal",e)
            }
            )(e, "signal"),
            !o(r) && !s(r))
                throw new u("stream",["ReadableStream", "WritableStream", "Stream"],r);
            return t.exports.addAbortSignalNoValidate(e, r)
        }
        ,
        t.exports.addAbortSignalNoValidate = function(e, t) {
            if ("object" != typeof e || !("aborted"in e))
                return t;
            const r = o(t) ? ()=>{
                t.destroy(new n(void 0,{
                    cause: e.reason
                }))
            }
            : ()=>{
                t[a](new n(void 0,{
                    cause: e.reason
                }))
            }
            ;
            return e.aborted ? r() : (e.addEventListener("abort", r),
            l(t, (()=>e.removeEventListener("abort", r)))),
            t
        }
    }
    , {
        "../../ours/errors": 151,
        "./end-of-stream": 138,
        "./utils": 147
    }],
    133: [function(e, t, r) {
        "use strict";
        const {StringPrototypeSlice: n, SymbolIterator: i, TypedArrayPrototypeSet: o, Uint8Array: s} = e("../../ours/primordials")
          , {Buffer: a} = e("buffer")
          , {inspect: l} = e("../../ours/util");
        t.exports = class {
            constructor() {
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            push(e) {
                const t = {
                    data: e,
                    next: null
                };
                this.length > 0 ? this.tail.next = t : this.head = t,
                this.tail = t,
                ++this.length
            }
            unshift(e) {
                const t = {
                    data: e,
                    next: this.head
                };
                0 === this.length && (this.tail = t),
                this.head = t,
                ++this.length
            }
            shift() {
                if (0 === this.length)
                    return;
                const e = this.head.data;
                return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                --this.length,
                e
            }
            clear() {
                this.head = this.tail = null,
                this.length = 0
            }
            join(e) {
                if (0 === this.length)
                    return "";
                let t = this.head
                  , r = "" + t.data;
                for (; null !== (t = t.next); )
                    r += e + t.data;
                return r
            }
            concat(e) {
                if (0 === this.length)
                    return a.alloc(0);
                const t = a.allocUnsafe(e >>> 0);
                let r = this.head
                  , n = 0;
                for (; r; )
                    o(t, r.data, n),
                    n += r.data.length,
                    r = r.next;
                return t
            }
            consume(e, t) {
                const r = this.head.data;
                if (e < r.length) {
                    const t = r.slice(0, e);
                    return this.head.data = r.slice(e),
                    t
                }
                return e === r.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e)
            }
            first() {
                return this.head.data
            }
            *[i]() {
                for (let e = this.head; e; e = e.next)
                    yield e.data
            }
            _getString(e) {
                let t = ""
                  , r = this.head
                  , i = 0;
                do {
                    const o = r.data;
                    if (!(e > o.length)) {
                        e === o.length ? (t += o,
                        ++i,
                        r.next ? this.head = r.next : this.head = this.tail = null) : (t += n(o, 0, e),
                        this.head = r,
                        r.data = n(o, e));
                        break
                    }
                    t += o,
                    e -= o.length,
                    ++i
                } while (null !== (r = r.next));
                return this.length -= i,
                t
            }
            _getBuffer(e) {
                const t = a.allocUnsafe(e)
                  , r = e;
                let n = this.head
                  , i = 0;
                do {
                    const a = n.data;
                    if (!(e > a.length)) {
                        e === a.length ? (o(t, a, r - e),
                        ++i,
                        n.next ? this.head = n.next : this.head = this.tail = null) : (o(t, new s(a.buffer,a.byteOffset,e), r - e),
                        this.head = n,
                        n.data = a.slice(e));
                        break
                    }
                    o(t, a, r - e),
                    e -= a.length,
                    ++i
                } while (null !== (n = n.next));
                return this.length -= i,
                t
            }
            [Symbol.for("nodejs.util.inspect.custom")](e, t) {
                return l(this, {
                    ...t,
                    depth: 0,
                    customInspect: !1
                })
            }
        }
    }
    , {
        "../../ours/primordials": 152,
        "../../ours/util": 153,
        buffer: 124
    }],
    134: [function(e, t, r) {
        "use strict";
        const {pipeline: n} = e("./pipeline")
          , i = e("./duplex")
          , {destroyer: o} = e("./destroy")
          , {isNodeStream: s, isReadable: a, isWritable: l, isWebStream: u, isTransformStream: c, isWritableStream: d, isReadableStream: f} = e("./utils")
          , {AbortError: h, codes: {ERR_INVALID_ARG_VALUE: p, ERR_MISSING_ARGS: g}} = e("../../ours/errors")
          , m = e("./end-of-stream");
        t.exports = function(...e) {
            if (0 === e.length)
                throw new g("streams");
            if (1 === e.length)
                return i.from(e[0]);
            const t = [...e];
            if ("function" == typeof e[0] && (e[0] = i.from(e[0])),
            "function" == typeof e[e.length - 1]) {
                const t = e.length - 1;
                e[t] = i.from(e[t])
            }
            for (let r = 0; r < e.length; ++r)
                if (s(e[r]) || u(e[r])) {
                    if (r < e.length - 1 && !(a(e[r]) || f(e[r]) || c(e[r])))
                        throw new p(`streams[${r}]`,t[r],"must be readable");
                    if (r > 0 && !(l(e[r]) || d(e[r]) || c(e[r])))
                        throw new p(`streams[${r}]`,t[r],"must be writable")
                }
            let r, b, y, v, w;
            const _ = e[0]
              , E = n(e, (function(e) {
                const t = v;
                v = null,
                t ? t(e) : e ? w.destroy(e) : A || S || w.destroy()
            }
            ))
              , S = !!(l(_) || d(_) || c(_))
              , A = !!(a(E) || f(E) || c(E));
            if (w = new i({
                writableObjectMode: !(null == _ || !_.writableObjectMode),
                readableObjectMode: !(null == E || !E.writableObjectMode),
                writable: S,
                readable: A
            }),
            S) {
                if (s(_))
                    w._write = function(e, t, n) {
                        _.write(e, t) ? n() : r = n
                    }
                    ,
                    w._final = function(e) {
                        _.end(),
                        b = e
                    }
                    ,
                    _.on("drain", (function() {
                        if (r) {
                            const e = r;
                            r = null,
                            e()
                        }
                    }
                    ));
                else if (u(_)) {
                    const e = (c(_) ? _.writable : _).getWriter();
                    w._write = async function(t, r, n) {
                        try {
                            await e.ready,
                            e.write(t).catch((()=>{}
                            )),
                            n()
                        } catch (e) {
                            n(e)
                        }
                    }
                    ,
                    w._final = async function(t) {
                        try {
                            await e.ready,
                            e.close().catch((()=>{}
                            )),
                            b = t
                        } catch (e) {
                            t(e)
                        }
                    }
                }
                const e = c(E) ? E.readable : E;
                m(e, (()=>{
                    if (b) {
                        const e = b;
                        b = null,
                        e()
                    }
                }
                ))
            }
            if (A)
                if (s(E))
                    E.on("readable", (function() {
                        if (y) {
                            const e = y;
                            y = null,
                            e()
                        }
                    }
                    )),
                    E.on("end", (function() {
                        w.push(null)
                    }
                    )),
                    w._read = function() {
                        for (; ; ) {
                            const e = E.read();
                            if (null === e)
                                return void (y = w._read);
                            if (!w.push(e))
                                return
                        }
                    }
                    ;
                else if (u(E)) {
                    const e = (c(E) ? E.readable : E).getReader();
                    w._read = async function() {
                        for (; ; )
                            try {
                                const {value: t, done: r} = await e.read();
                                if (!w.push(t))
                                    return;
                                if (r)
                                    return void w.push(null)
                            } catch {
                                return
                            }
                    }
                }
            return w._destroy = function(e, t) {
                e || null === v || (e = new h),
                y = null,
                r = null,
                b = null,
                null === v ? t(e) : (v = t,
                s(E) && o(E, e))
            }
            ,
            w
        }
    }
    , {
        "../../ours/errors": 151,
        "./destroy": 135,
        "./duplex": 136,
        "./end-of-stream": 138,
        "./pipeline": 143,
        "./utils": 147
    }],
    135: [function(e, t, r) {
        "use strict";
        const n = e("process/")
          , {aggregateTwoErrors: i, codes: {ERR_MULTIPLE_CALLBACK: o}, AbortError: s} = e("../../ours/errors")
          , {Symbol: a} = e("../../ours/primordials")
          , {kDestroyed: l, isDestroyed: u, isFinished: c, isServerRequest: d} = e("./utils")
          , f = a("kDestroy")
          , h = a("kConstruct");
        function p(e, t, r) {
            e && (e.stack,
            t && !t.errored && (t.errored = e),
            r && !r.errored && (r.errored = e))
        }
        function g(e, t, r) {
            let i = !1;
            function o(t) {
                if (i)
                    return;
                i = !0;
                const o = e._readableState
                  , s = e._writableState;
                p(t, s, o),
                s && (s.closed = !0),
                o && (o.closed = !0),
                "function" == typeof r && r(t),
                t ? n.nextTick(m, e, t) : n.nextTick(b, e)
            }
            try {
                e._destroy(t || null, o)
            } catch (t) {
                o(t)
            }
        }
        function m(e, t) {
            y(e, t),
            b(e)
        }
        function b(e) {
            const t = e._readableState
              , r = e._writableState;
            r && (r.closeEmitted = !0),
            t && (t.closeEmitted = !0),
            (null != r && r.emitClose || null != t && t.emitClose) && e.emit("close")
        }
        function y(e, t) {
            const r = e._readableState
              , n = e._writableState;
            null != n && n.errorEmitted || null != r && r.errorEmitted || (n && (n.errorEmitted = !0),
            r && (r.errorEmitted = !0),
            e.emit("error", t))
        }
        function v(e, t, r) {
            const i = e._readableState
              , o = e._writableState;
            if (null != o && o.destroyed || null != i && i.destroyed)
                return this;
            null != i && i.autoDestroy || null != o && o.autoDestroy ? e.destroy(t) : t && (t.stack,
            o && !o.errored && (o.errored = t),
            i && !i.errored && (i.errored = t),
            r ? n.nextTick(y, e, t) : y(e, t))
        }
        function w(e) {
            let t = !1;
            function r(r) {
                if (t)
                    return void v(e, null != r ? r : new o);
                t = !0;
                const i = e._readableState
                  , s = e._writableState
                  , a = s || i;
                i && (i.constructed = !0),
                s && (s.constructed = !0),
                a.destroyed ? e.emit(f, r) : r ? v(e, r, !0) : n.nextTick(_, e)
            }
            try {
                e._construct((e=>{
                    n.nextTick(r, e)
                }
                ))
            } catch (e) {
                n.nextTick(r, e)
            }
        }
        function _(e) {
            e.emit(h)
        }
        function E(e) {
            return (null == e ? void 0 : e.setHeader) && "function" == typeof e.abort
        }
        function S(e) {
            e.emit("close")
        }
        function A(e, t) {
            e.emit("error", t),
            n.nextTick(S, e)
        }
        t.exports = {
            construct: function(e, t) {
                if ("function" != typeof e._construct)
                    return;
                const r = e._readableState
                  , i = e._writableState;
                r && (r.constructed = !1),
                i && (i.constructed = !1),
                e.once(h, t),
                e.listenerCount(h) > 1 || n.nextTick(w, e)
            },
            destroyer: function(e, t) {
                e && !u(e) && (t || c(e) || (t = new s),
                d(e) ? (e.socket = null,
                e.destroy(t)) : E(e) ? e.abort() : E(e.req) ? e.req.abort() : "function" == typeof e.destroy ? e.destroy(t) : "function" == typeof e.close ? e.close() : t ? n.nextTick(A, e, t) : n.nextTick(S, e),
                e.destroyed || (e[l] = !0))
            },
            destroy: function(e, t) {
                const r = this._readableState
                  , n = this._writableState
                  , o = n || r;
                return null != n && n.destroyed || null != r && r.destroyed ? ("function" == typeof t && t(),
                this) : (p(e, n, r),
                n && (n.destroyed = !0),
                r && (r.destroyed = !0),
                o.constructed ? g(this, e, t) : this.once(f, (function(r) {
                    g(this, i(r, e), t)
                }
                )),
                this)
            },
            undestroy: function() {
                const e = this._readableState
                  , t = this._writableState;
                e && (e.constructed = !0,
                e.closed = !1,
                e.closeEmitted = !1,
                e.destroyed = !1,
                e.errored = null,
                e.errorEmitted = !1,
                e.reading = !1,
                e.ended = !1 === e.readable,
                e.endEmitted = !1 === e.readable),
                t && (t.constructed = !0,
                t.destroyed = !1,
                t.closed = !1,
                t.closeEmitted = !1,
                t.errored = null,
                t.errorEmitted = !1,
                t.finalCalled = !1,
                t.prefinished = !1,
                t.ended = !1 === t.writable,
                t.ending = !1 === t.writable,
                t.finished = !1 === t.writable)
            },
            errorOrDestroy: v
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "./utils": 147,
        "process/": 178
    }],
    136: [function(e, t, r) {
        "use strict";
        const {ObjectDefineProperties: n, ObjectGetOwnPropertyDescriptor: i, ObjectKeys: o, ObjectSetPrototypeOf: s} = e("../../ours/primordials");
        t.exports = u;
        const a = e("./readable")
          , l = e("./writable");
        s(u.prototype, a.prototype),
        s(u, a);
        {
            const e = o(l.prototype);
            for (let t = 0; t < e.length; t++) {
                const r = e[t];
                u.prototype[r] || (u.prototype[r] = l.prototype[r])
            }
        }
        function u(e) {
            if (!(this instanceof u))
                return new u(e);
            a.call(this, e),
            l.call(this, e),
            e ? (this.allowHalfOpen = !1 !== e.allowHalfOpen,
            !1 === e.readable && (this._readableState.readable = !1,
            this._readableState.ended = !0,
            this._readableState.endEmitted = !0),
            !1 === e.writable && (this._writableState.writable = !1,
            this._writableState.ending = !0,
            this._writableState.ended = !0,
            this._writableState.finished = !0)) : this.allowHalfOpen = !0
        }
        let c, d;
        function f() {
            return void 0 === c && (c = {}),
            c
        }
        n(u.prototype, {
            writable: {
                __proto__: null,
                ...i(l.prototype, "writable")
            },
            writableHighWaterMark: {
                __proto__: null,
                ...i(l.prototype, "writableHighWaterMark")
            },
            writableObjectMode: {
                __proto__: null,
                ...i(l.prototype, "writableObjectMode")
            },
            writableBuffer: {
                __proto__: null,
                ...i(l.prototype, "writableBuffer")
            },
            writableLength: {
                __proto__: null,
                ...i(l.prototype, "writableLength")
            },
            writableFinished: {
                __proto__: null,
                ...i(l.prototype, "writableFinished")
            },
            writableCorked: {
                __proto__: null,
                ...i(l.prototype, "writableCorked")
            },
            writableEnded: {
                __proto__: null,
                ...i(l.prototype, "writableEnded")
            },
            writableNeedDrain: {
                __proto__: null,
                ...i(l.prototype, "writableNeedDrain")
            },
            destroyed: {
                __proto__: null,
                get() {
                    return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                },
                set(e) {
                    this._readableState && this._writableState && (this._readableState.destroyed = e,
                    this._writableState.destroyed = e)
                }
            }
        }),
        u.fromWeb = function(e, t) {
            return f().newStreamDuplexFromReadableWritablePair(e, t)
        }
        ,
        u.toWeb = function(e) {
            return f().newReadableWritablePairFromDuplex(e)
        }
        ,
        u.from = function(t) {
            return d || (d = e("./duplexify")),
            d(t, "body")
        }
    }
    , {
        "../../ours/primordials": 152,
        "./duplexify": 137,
        "./readable": 144,
        "./writable": 148
    }],
    137: [function(e, t, r) {
        const n = e("process/")
          , i = e("buffer")
          , {isReadable: o, isWritable: s, isIterable: a, isNodeStream: l, isReadableNodeStream: u, isWritableNodeStream: c, isDuplexNodeStream: d} = e("./utils")
          , f = e("./end-of-stream")
          , {AbortError: h, codes: {ERR_INVALID_ARG_TYPE: p, ERR_INVALID_RETURN_VALUE: g}} = e("../../ours/errors")
          , {destroyer: m} = e("./destroy")
          , b = e("./duplex")
          , y = e("./readable")
          , {createDeferredPromise: v} = e("../../ours/util")
          , w = e("./from")
          , _ = globalThis.Blob || i.Blob
          , E = void 0 !== _ ? function(e) {
            return e instanceof _
        }
        : function(e) {
            return !1
        }
          , S = globalThis.AbortController || e("abort-controller").AbortController
          , {FunctionPrototypeCall: A} = e("../../ours/primordials");
        class R extends b {
            constructor(e) {
                super(e),
                !1 === (null == e ? void 0 : e.readable) && (this._readableState.readable = !1,
                this._readableState.ended = !0,
                this._readableState.endEmitted = !0),
                !1 === (null == e ? void 0 : e.writable) && (this._writableState.writable = !1,
                this._writableState.ending = !0,
                this._writableState.ended = !0,
                this._writableState.finished = !0)
            }
        }
        function x(e) {
            const t = e.readable && "function" != typeof e.readable.read ? y.wrap(e.readable) : e.readable
              , r = e.writable;
            let n, i, a, l, u, c = !!o(t), d = !!s(r);
            function p(e) {
                const t = l;
                l = null,
                t ? t(e) : e && u.destroy(e)
            }
            return u = new R({
                readableObjectMode: !(null == t || !t.readableObjectMode),
                writableObjectMode: !(null == r || !r.writableObjectMode),
                readable: c,
                writable: d
            }),
            d && (f(r, (e=>{
                d = !1,
                e && m(t, e),
                p(e)
            }
            )),
            u._write = function(e, t, i) {
                r.write(e, t) ? i() : n = i
            }
            ,
            u._final = function(e) {
                r.end(),
                i = e
            }
            ,
            r.on("drain", (function() {
                if (n) {
                    const e = n;
                    n = null,
                    e()
                }
            }
            )),
            r.on("finish", (function() {
                if (i) {
                    const e = i;
                    i = null,
                    e()
                }
            }
            ))),
            c && (f(t, (e=>{
                c = !1,
                e && m(t, e),
                p(e)
            }
            )),
            t.on("readable", (function() {
                if (a) {
                    const e = a;
                    a = null,
                    e()
                }
            }
            )),
            t.on("end", (function() {
                u.push(null)
            }
            )),
            u._read = function() {
                for (; ; ) {
                    const e = t.read();
                    if (null === e)
                        return void (a = u._read);
                    if (!u.push(e))
                        return
                }
            }
            ),
            u._destroy = function(e, o) {
                e || null === l || (e = new h),
                a = null,
                n = null,
                i = null,
                null === l ? o(e) : (l = o,
                m(r, e),
                m(t, e))
            }
            ,
            u
        }
        t.exports = function e(t, r) {
            if (d(t))
                return t;
            if (u(t))
                return x({
                    readable: t
                });
            if (c(t))
                return x({
                    writable: t
                });
            if (l(t))
                return x({
                    writable: !1,
                    readable: !1
                });
            if ("function" == typeof t) {
                const {value: e, write: i, final: o, destroy: s} = function(e) {
                    let {promise: t, resolve: r} = v();
                    const i = new S
                      , o = i.signal
                      , s = e(async function*() {
                        for (; ; ) {
                            const e = t;
                            t = null;
                            const {chunk: i, done: s, cb: a} = await e;
                            if (n.nextTick(a),
                            s)
                                return;
                            if (o.aborted)
                                throw new h(void 0,{
                                    cause: o.reason
                                });
                            ({promise: t, resolve: r} = v()),
                            yield i
                        }
                    }(), {
                        signal: o
                    });
                    return {
                        value: s,
                        write(e, t, n) {
                            const i = r;
                            r = null,
                            i({
                                chunk: e,
                                done: !1,
                                cb: n
                            })
                        },
                        final(e) {
                            const t = r;
                            r = null,
                            t({
                                done: !0,
                                cb: e
                            })
                        },
                        destroy(e, t) {
                            i.abort(),
                            t(e)
                        }
                    }
                }(t);
                if (a(e))
                    return w(R, e, {
                        objectMode: !0,
                        write: i,
                        final: o,
                        destroy: s
                    });
                const l = null == e ? void 0 : e.then;
                if ("function" == typeof l) {
                    let t;
                    const r = A(l, e, (e=>{
                        if (null != e)
                            throw new g("nully","body",e)
                    }
                    ), (e=>{
                        m(t, e)
                    }
                    ));
                    return t = new R({
                        objectMode: !0,
                        readable: !1,
                        write: i,
                        final(e) {
                            o((async()=>{
                                try {
                                    await r,
                                    n.nextTick(e, null)
                                } catch (t) {
                                    n.nextTick(e, t)
                                }
                            }
                            ))
                        },
                        destroy: s
                    })
                }
                throw new g("Iterable, AsyncIterable or AsyncFunction",r,e)
            }
            if (E(t))
                return e(t.arrayBuffer());
            if (a(t))
                return w(R, t, {
                    objectMode: !0,
                    writable: !1
                });
            if ("object" == typeof (null == t ? void 0 : t.writable) || "object" == typeof (null == t ? void 0 : t.readable)) {
                return x({
                    readable: null != t && t.readable ? u(null == t ? void 0 : t.readable) ? null == t ? void 0 : t.readable : e(t.readable) : void 0,
                    writable: null != t && t.writable ? c(null == t ? void 0 : t.writable) ? null == t ? void 0 : t.writable : e(t.writable) : void 0
                })
            }
            const i = null == t ? void 0 : t.then;
            if ("function" == typeof i) {
                let e;
                return A(i, t, (t=>{
                    null != t && e.push(t),
                    e.push(null)
                }
                ), (t=>{
                    m(e, t)
                }
                )),
                e = new R({
                    objectMode: !0,
                    writable: !1,
                    read() {}
                })
            }
            throw new p(r,["Blob", "ReadableStream", "WritableStream", "Stream", "Iterable", "AsyncIterable", "Function", "{ readable, writable } pair", "Promise"],t)
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "../../ours/util": 153,
        "./destroy": 135,
        "./duplex": 136,
        "./end-of-stream": 138,
        "./from": 139,
        "./readable": 144,
        "./utils": 147,
        "abort-controller": 121,
        buffer: 124,
        "process/": 178
    }],
    138: [function(e, t, r) {
        const n = e("process/")
          , {AbortError: i, codes: o} = e("../../ours/errors")
          , {ERR_INVALID_ARG_TYPE: s, ERR_STREAM_PREMATURE_CLOSE: a} = o
          , {kEmptyObject: l, once: u} = e("../../ours/util")
          , {validateAbortSignal: c, validateFunction: d, validateObject: f, validateBoolean: h} = e("../validators")
          , {Promise: p, PromisePrototypeThen: g} = e("../../ours/primordials")
          , {isClosed: m, isReadable: b, isReadableNodeStream: y, isReadableStream: v, isReadableFinished: w, isReadableErrored: _, isWritable: E, isWritableNodeStream: S, isWritableStream: A, isWritableFinished: R, isWritableErrored: x, isNodeStream: T, willEmitClose: O, kIsClosedPromise: k} = e("./utils");
        const M = ()=>{}
        ;
        function N(e, t, r) {
            var o, h;
            if (2 === arguments.length ? (r = t,
            t = l) : null == t ? t = l : f(t, "options"),
            d(r, "callback"),
            c(t.signal, "options.signal"),
            r = u(r),
            v(e) || A(e))
                return function(e, t, r) {
                    let o = !1
                      , s = M;
                    if (t.signal)
                        if (s = ()=>{
                            o = !0,
                            r.call(e, new i(void 0,{
                                cause: t.signal.reason
                            }))
                        }
                        ,
                        t.signal.aborted)
                            n.nextTick(s);
                        else {
                            const n = r;
                            r = u(((...r)=>{
                                t.signal.removeEventListener("abort", s),
                                n.apply(e, r)
                            }
                            )),
                            t.signal.addEventListener("abort", s)
                        }
                    const a = (...t)=>{
                        o || n.nextTick((()=>r.apply(e, t)))
                    }
                    ;
                    return g(e[k].promise, a, a),
                    M
                }(e, t, r);
            if (!T(e))
                throw new s("stream",["ReadableStream", "WritableStream", "Stream"],e);
            const p = null !== (o = t.readable) && void 0 !== o ? o : y(e)
              , N = null !== (h = t.writable) && void 0 !== h ? h : S(e)
              , j = e._writableState
              , P = e._readableState
              , I = ()=>{
                e.writable || D()
            }
            ;
            let C = O(e) && y(e) === p && S(e) === N
              , L = R(e, !1);
            const D = ()=>{
                L = !0,
                e.destroyed && (C = !1),
                (!C || e.readable && !p) && (p && !$ || r.call(e))
            }
            ;
            let $ = w(e, !1);
            const B = ()=>{
                $ = !0,
                e.destroyed && (C = !1),
                (!C || e.writable && !N) && (N && !L || r.call(e))
            }
              , F = t=>{
                r.call(e, t)
            }
            ;
            let U = m(e);
            const W = ()=>{
                U = !0;
                const t = x(e) || _(e);
                return t && "boolean" != typeof t ? r.call(e, t) : p && !$ && y(e, !0) && !w(e, !1) ? r.call(e, new a) : !N || L || R(e, !1) ? void r.call(e) : r.call(e, new a)
            }
              , V = ()=>{
                U = !0;
                const t = x(e) || _(e);
                if (t && "boolean" != typeof t)
                    return r.call(e, t);
                r.call(e)
            }
              , H = ()=>{
                e.req.on("finish", D)
            }
            ;
            !function(e) {
                return e.setHeader && "function" == typeof e.abort
            }(e) ? N && !j && (e.on("end", I),
            e.on("close", I)) : (e.on("complete", D),
            C || e.on("abort", W),
            e.req ? H() : e.on("request", H)),
            C || "boolean" != typeof e.aborted || e.on("aborted", W),
            e.on("end", B),
            e.on("finish", D),
            !1 !== t.error && e.on("error", F),
            e.on("close", W),
            U ? n.nextTick(W) : null != j && j.errorEmitted || null != P && P.errorEmitted ? C || n.nextTick(V) : (p || C && !b(e) || !L && !1 !== E(e)) && (N || C && !E(e) || !$ && !1 !== b(e)) ? P && e.req && e.aborted && n.nextTick(V) : n.nextTick(V);
            const G = ()=>{
                r = M,
                e.removeListener("aborted", W),
                e.removeListener("complete", D),
                e.removeListener("abort", W),
                e.removeListener("request", H),
                e.req && e.req.removeListener("finish", D),
                e.removeListener("end", I),
                e.removeListener("close", I),
                e.removeListener("finish", D),
                e.removeListener("end", B),
                e.removeListener("error", F),
                e.removeListener("close", W)
            }
            ;
            if (t.signal && !U) {
                const o = ()=>{
                    const n = r;
                    G(),
                    n.call(e, new i(void 0,{
                        cause: t.signal.reason
                    }))
                }
                ;
                if (t.signal.aborted)
                    n.nextTick(o);
                else {
                    const n = r;
                    r = u(((...r)=>{
                        t.signal.removeEventListener("abort", o),
                        n.apply(e, r)
                    }
                    )),
                    t.signal.addEventListener("abort", o)
                }
            }
            return G
        }
        t.exports = N,
        t.exports.finished = function(e, t) {
            var r;
            let n = !1;
            return null === t && (t = l),
            null !== (r = t) && void 0 !== r && r.cleanup && (h(t.cleanup, "cleanup"),
            n = t.cleanup),
            new p(((r,i)=>{
                const o = N(e, t, (e=>{
                    n && o(),
                    e ? i(e) : r()
                }
                ))
            }
            ))
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "../../ours/util": 153,
        "../validators": 149,
        "./utils": 147,
        "process/": 178
    }],
    139: [function(e, t, r) {
        "use strict";
        const n = e("process/")
          , {PromisePrototypeThen: i, SymbolAsyncIterator: o, SymbolIterator: s} = e("../../ours/primordials")
          , {Buffer: a} = e("buffer")
          , {ERR_INVALID_ARG_TYPE: l, ERR_STREAM_NULL_VALUES: u} = e("../../ours/errors").codes;
        t.exports = function(e, t, r) {
            let c, d;
            if ("string" == typeof t || t instanceof a)
                return new e({
                    objectMode: !0,
                    ...r,
                    read() {
                        this.push(t),
                        this.push(null)
                    }
                });
            if (t && t[o])
                d = !0,
                c = t[o]();
            else {
                if (!t || !t[s])
                    throw new l("iterable",["Iterable"],t);
                d = !1,
                c = t[s]()
            }
            const f = new e({
                objectMode: !0,
                highWaterMark: 1,
                ...r
            });
            let h = !1;
            return f._read = function() {
                h || (h = !0,
                async function() {
                    for (; ; ) {
                        try {
                            const {value: e, done: t} = d ? await c.next() : c.next();
                            if (t)
                                f.push(null);
                            else {
                                const t = e && "function" == typeof e.then ? await e : e;
                                if (null === t)
                                    throw h = !1,
                                    new u;
                                if (f.push(t))
                                    continue;
                                h = !1
                            }
                        } catch (e) {
                            f.destroy(e)
                        }
                        break
                    }
                }())
            }
            ,
            f._destroy = function(e, t) {
                i(async function(e) {
                    const t = null != e
                      , r = "function" == typeof c.throw;
                    if (t && r) {
                        const {value: t, done: r} = await c.throw(e);
                        if (await t,
                        r)
                            return
                    }
                    if ("function" == typeof c.return) {
                        const {value: e} = await c.return();
                        await e
                    }
                }(e), (()=>n.nextTick(t, e)), (r=>n.nextTick(t, r || e)))
            }
            ,
            f
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        buffer: 124,
        "process/": 178
    }],
    140: [function(e, t, r) {
        "use strict";
        const {ArrayIsArray: n, ObjectSetPrototypeOf: i} = e("../../ours/primordials")
          , {EventEmitter: o} = e("events");
        function s(e) {
            o.call(this, e)
        }
        function a(e, t, r) {
            if ("function" == typeof e.prependListener)
                return e.prependListener(t, r);
            e._events && e._events[t] ? n(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
        }
        i(s.prototype, o.prototype),
        i(s, o),
        s.prototype.pipe = function(e, t) {
            const r = this;
            function n(t) {
                e.writable && !1 === e.write(t) && r.pause && r.pause()
            }
            function i() {
                r.readable && r.resume && r.resume()
            }
            r.on("data", n),
            e.on("drain", i),
            e._isStdio || t && !1 === t.end || (r.on("end", l),
            r.on("close", u));
            let s = !1;
            function l() {
                s || (s = !0,
                e.end())
            }
            function u() {
                s || (s = !0,
                "function" == typeof e.destroy && e.destroy())
            }
            function c(e) {
                d(),
                0 === o.listenerCount(this, "error") && this.emit("error", e)
            }
            function d() {
                r.removeListener("data", n),
                e.removeListener("drain", i),
                r.removeListener("end", l),
                r.removeListener("close", u),
                r.removeListener("error", c),
                e.removeListener("error", c),
                r.removeListener("end", d),
                r.removeListener("close", d),
                e.removeListener("close", d)
            }
            return a(r, "error", c),
            a(e, "error", c),
            r.on("end", d),
            r.on("close", d),
            e.on("close", d),
            e.emit("pipe", r),
            e
        }
        ,
        t.exports = {
            Stream: s,
            prependListener: a
        }
    }
    , {
        "../../ours/primordials": 152,
        events: 130
    }],
    141: [function(e, t, r) {
        "use strict";
        const n = globalThis.AbortController || e("abort-controller").AbortController
          , {codes: {ERR_INVALID_ARG_VALUE: i, ERR_INVALID_ARG_TYPE: o, ERR_MISSING_ARGS: s, ERR_OUT_OF_RANGE: a}, AbortError: l} = e("../../ours/errors")
          , {validateAbortSignal: u, validateInteger: c, validateObject: d} = e("../validators")
          , f = e("../../ours/primordials").Symbol("kWeak")
          , {finished: h} = e("./end-of-stream")
          , p = e("./compose")
          , {addAbortSignalNoValidate: g} = e("./add-abort-signal")
          , {isWritable: m, isNodeStream: b} = e("./utils")
          , {ArrayPrototypePush: y, MathFloor: v, Number: w, NumberIsNaN: _, Promise: E, PromiseReject: S, PromisePrototypeThen: A, Symbol: R} = e("../../ours/primordials")
          , x = R("kEmpty")
          , T = R("kEof");
        function O(e, t) {
            if ("function" != typeof e)
                throw new o("fn",["Function", "AsyncFunction"],e);
            null != t && d(t, "options"),
            null != (null == t ? void 0 : t.signal) && u(t.signal, "options.signal");
            let r = 1;
            return null != (null == t ? void 0 : t.concurrency) && (r = v(t.concurrency)),
            c(r, "concurrency", 1),
            async function*() {
                var i, o;
                const s = new n
                  , a = this
                  , u = []
                  , c = s.signal
                  , d = {
                    signal: c
                }
                  , f = ()=>s.abort();
                let h, p;
                null != t && null !== (i = t.signal) && void 0 !== i && i.aborted && f(),
                null == t || null === (o = t.signal) || void 0 === o || o.addEventListener("abort", f);
                let g = !1;
                function m() {
                    g = !0
                }
                !async function() {
                    try {
                        for await(let t of a) {
                            var n;
                            if (g)
                                return;
                            if (c.aborted)
                                throw new l;
                            try {
                                t = e(t, d)
                            } catch (e) {
                                t = S(e)
                            }
                            t !== x && ("function" == typeof (null === (n = t) || void 0 === n ? void 0 : n.catch) && t.catch(m),
                            u.push(t),
                            h && (h(),
                            h = null),
                            !g && u.length && u.length >= r && await new E((e=>{
                                p = e
                            }
                            )))
                        }
                        u.push(T)
                    } catch (e) {
                        const t = S(e);
                        A(t, void 0, m),
                        u.push(t)
                    } finally {
                        var i;
                        g = !0,
                        h && (h(),
                        h = null),
                        null == t || null === (i = t.signal) || void 0 === i || i.removeEventListener("abort", f)
                    }
                }();
                try {
                    for (; ; ) {
                        for (; u.length > 0; ) {
                            const e = await u[0];
                            if (e === T)
                                return;
                            if (c.aborted)
                                throw new l;
                            e !== x && (yield e),
                            u.shift(),
                            p && (p(),
                            p = null)
                        }
                        await new E((e=>{
                            h = e
                        }
                        ))
                    }
                } finally {
                    s.abort(),
                    g = !0,
                    p && (p(),
                    p = null)
                }
            }
            .call(this)
        }
        async function k(e, t=void 0) {
            for await(const r of M.call(this, e, t))
                return !0;
            return !1
        }
        function M(e, t) {
            if ("function" != typeof e)
                throw new o("fn",["Function", "AsyncFunction"],e);
            return O.call(this, (async function(t, r) {
                return await e(t, r) ? t : x
            }
            ), t)
        }
        class N extends s {
            constructor() {
                super("reduce"),
                this.message = "Reduce of an empty stream requires an initial value"
            }
        }
        function j(e) {
            if (e = w(e),
            _(e))
                return 0;
            if (e < 0)
                throw new a("number",">= 0",e);
            return e
        }
        t.exports.streamReturningOperators = {
            asIndexedPairs: function(e=void 0) {
                return null != e && d(e, "options"),
                null != (null == e ? void 0 : e.signal) && u(e.signal, "options.signal"),
                async function*() {
                    let t = 0;
                    for await(const n of this) {
                        var r;
                        if (null != e && null !== (r = e.signal) && void 0 !== r && r.aborted)
                            throw new l({
                                cause: e.signal.reason
                            });
                        yield[t++, n]
                    }
                }
                .call(this)
            },
            drop: function(e, t=void 0) {
                return null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && u(t.signal, "options.signal"),
                e = j(e),
                async function*() {
                    var r;
                    if (null != t && null !== (r = t.signal) && void 0 !== r && r.aborted)
                        throw new l;
                    for await(const r of this) {
                        var n;
                        if (null != t && null !== (n = t.signal) && void 0 !== n && n.aborted)
                            throw new l;
                        e-- <= 0 && (yield r)
                    }
                }
                .call(this)
            },
            filter: M,
            flatMap: function(e, t) {
                const r = O.call(this, e, t);
                return async function*() {
                    for await(const e of r)
                        yield*e
                }
                .call(this)
            },
            map: O,
            take: function(e, t=void 0) {
                return null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && u(t.signal, "options.signal"),
                e = j(e),
                async function*() {
                    var r;
                    if (null != t && null !== (r = t.signal) && void 0 !== r && r.aborted)
                        throw new l;
                    for await(const r of this) {
                        var n;
                        if (null != t && null !== (n = t.signal) && void 0 !== n && n.aborted)
                            throw new l;
                        if (!(e-- > 0))
                            return;
                        yield r
                    }
                }
                .call(this)
            },
            compose: function(e, t) {
                if (null != t && d(t, "options"),
                null != (null == t ? void 0 : t.signal) && u(t.signal, "options.signal"),
                b(e) && !m(e))
                    throw new i("stream",e,"must be writable");
                const r = p(this, e);
                return null != t && t.signal && g(t.signal, r),
                r
            }
        },
        t.exports.promiseReturningOperators = {
            every: async function(e, t=void 0) {
                if ("function" != typeof e)
                    throw new o("fn",["Function", "AsyncFunction"],e);
                return !await k.call(this, (async(...t)=>!await e(...t)), t)
            },
            forEach: async function(e, t) {
                if ("function" != typeof e)
                    throw new o("fn",["Function", "AsyncFunction"],e);
                for await(const r of O.call(this, (async function(t, r) {
                    return await e(t, r),
                    x
                }
                ), t))
                    ;
            },
            reduce: async function(e, t, r) {
                var i;
                if ("function" != typeof e)
                    throw new o("reducer",["Function", "AsyncFunction"],e);
                null != r && d(r, "options"),
                null != (null == r ? void 0 : r.signal) && u(r.signal, "options.signal");
                let s = arguments.length > 1;
                if (null != r && null !== (i = r.signal) && void 0 !== i && i.aborted) {
                    const e = new l(void 0,{
                        cause: r.signal.reason
                    });
                    throw this.once("error", (()=>{}
                    )),
                    await h(this.destroy(e)),
                    e
                }
                const a = new n
                  , c = a.signal;
                if (null != r && r.signal) {
                    const e = {
                        once: !0,
                        [f]: this
                    };
                    r.signal.addEventListener("abort", (()=>a.abort()), e)
                }
                let p = !1;
                try {
                    for await(const n of this) {
                        var g;
                        if (p = !0,
                        null != r && null !== (g = r.signal) && void 0 !== g && g.aborted)
                            throw new l;
                        s ? t = await e(t, n, {
                            signal: c
                        }) : (t = n,
                        s = !0)
                    }
                    if (!p && !s)
                        throw new N
                } finally {
                    a.abort()
                }
                return t
            },
            toArray: async function(e) {
                null != e && d(e, "options"),
                null != (null == e ? void 0 : e.signal) && u(e.signal, "options.signal");
                const t = [];
                for await(const n of this) {
                    var r;
                    if (null != e && null !== (r = e.signal) && void 0 !== r && r.aborted)
                        throw new l(void 0,{
                            cause: e.signal.reason
                        });
                    y(t, n)
                }
                return t
            },
            some: k,
            find: async function(e, t) {
                for await(const r of M.call(this, e, t))
                    return r
            }
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "../validators": 149,
        "./add-abort-signal": 132,
        "./compose": 134,
        "./end-of-stream": 138,
        "./utils": 147,
        "abort-controller": 121
    }],
    142: [function(e, t, r) {
        "use strict";
        const {ObjectSetPrototypeOf: n} = e("../../ours/primordials");
        t.exports = o;
        const i = e("./transform");
        function o(e) {
            if (!(this instanceof o))
                return new o(e);
            i.call(this, e)
        }
        n(o.prototype, i.prototype),
        n(o, i),
        o.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "../../ours/primordials": 152,
        "./transform": 146
    }],
    143: [function(e, t, r) {
        const n = e("process/")
          , {ArrayIsArray: i, Promise: o, SymbolAsyncIterator: s} = e("../../ours/primordials")
          , a = e("./end-of-stream")
          , {once: l} = e("../../ours/util")
          , u = e("./destroy")
          , c = e("./duplex")
          , {aggregateTwoErrors: d, codes: {ERR_INVALID_ARG_TYPE: f, ERR_INVALID_RETURN_VALUE: h, ERR_MISSING_ARGS: p, ERR_STREAM_DESTROYED: g, ERR_STREAM_PREMATURE_CLOSE: m}, AbortError: b} = e("../../ours/errors")
          , {validateFunction: y, validateAbortSignal: v} = e("../validators")
          , {isIterable: w, isReadable: _, isReadableNodeStream: E, isNodeStream: S, isTransformStream: A, isWebStream: R, isReadableStream: x, isReadableEnded: T} = e("./utils")
          , O = globalThis.AbortController || e("abort-controller").AbortController;
        let k, M;
        function N(e, t, r) {
            let n = !1;
            e.on("close", (()=>{
                n = !0
            }
            ));
            return {
                destroy: t=>{
                    n || (n = !0,
                    u.destroyer(e, t || new g("pipe")))
                }
                ,
                cleanup: a(e, {
                    readable: t,
                    writable: r
                }, (e=>{
                    n = !e
                }
                ))
            }
        }
        function j(t) {
            if (w(t))
                return t;
            if (E(t))
                return async function*(t) {
                    M || (M = e("./readable"));
                    yield*M.prototype[s].call(t)
                }(t);
            throw new f("val",["Readable", "Iterable", "AsyncIterable"],t)
        }
        async function P(e, t, r, {end: n}) {
            let i, s = null;
            const l = e=>{
                if (e && (i = e),
                s) {
                    const e = s;
                    s = null,
                    e()
                }
            }
              , u = ()=>new o(((e,t)=>{
                i ? t(i) : s = ()=>{
                    i ? t(i) : e()
                }
            }
            ));
            t.on("drain", l);
            const c = a(t, {
                readable: !1
            }, l);
            try {
                t.writableNeedDrain && await u();
                for await(const r of e)
                    t.write(r) || await u();
                n && t.end(),
                await u(),
                r()
            } catch (e) {
                r(i !== e ? d(i, e) : e)
            } finally {
                c(),
                t.off("drain", l)
            }
        }
        async function I(e, t, r, {end: n}) {
            A(t) && (t = t.writable);
            const i = t.getWriter();
            try {
                for await(const t of e)
                    await i.ready,
                    i.write(t).catch((()=>{}
                    ));
                await i.ready,
                n && await i.close(),
                r()
            } catch (e) {
                try {
                    await i.abort(e),
                    r(e)
                } catch (e) {
                    r(e)
                }
            }
        }
        function C(t, r, o) {
            if (1 === t.length && i(t[0]) && (t = t[0]),
            t.length < 2)
                throw new p("streams");
            const s = new O
              , a = s.signal
              , l = null == o ? void 0 : o.signal
              , u = [];
            function d() {
                D(new b)
            }
            let g, m;
            v(l, "options.signal"),
            null == l || l.addEventListener("abort", d);
            const y = [];
            let T, M = 0;
            function C(e) {
                D(e, 0 == --M)
            }
            function D(e, t) {
                if (!e || g && "ERR_STREAM_PREMATURE_CLOSE" !== g.code || (g = e),
                g || t) {
                    for (; y.length; )
                        y.shift()(g);
                    null == l || l.removeEventListener("abort", d),
                    s.abort(),
                    t && (g || u.forEach((e=>e())),
                    n.nextTick(r, g, m))
                }
            }
            for (let U = 0; U < t.length; U++) {
                const W = t[U]
                  , V = U < t.length - 1
                  , H = U > 0
                  , G = V || !1 !== (null == o ? void 0 : o.end)
                  , q = U === t.length - 1;
                if (S(W)) {
                    if (G) {
                        const {destroy: J, cleanup: z} = N(W, V, H);
                        y.push(J),
                        _(W) && q && u.push(z)
                    }
                    function $(e) {
                        e && "AbortError" !== e.name && "ERR_STREAM_PREMATURE_CLOSE" !== e.code && C(e)
                    }
                    W.on("error", $),
                    _(W) && q && u.push((()=>{
                        W.removeListener("error", $)
                    }
                    ))
                }
                if (0 === U)
                    if ("function" == typeof W) {
                        if (T = W({
                            signal: a
                        }),
                        !w(T))
                            throw new h("Iterable, AsyncIterable or Stream","source",T)
                    } else
                        T = w(W) || E(W) || A(W) ? W : c.from(W);
                else if ("function" == typeof W) {
                    var B;
                    if (A(T))
                        T = j(null === (B = T) || void 0 === B ? void 0 : B.readable);
                    else
                        T = j(T);
                    if (T = W(T, {
                        signal: a
                    }),
                    V) {
                        if (!w(T, !0))
                            throw new h("AsyncIterable",`transform[${U - 1}]`,T)
                    } else {
                        var F;
                        k || (k = e("./passthrough"));
                        const X = new k({
                            objectMode: !0
                        })
                          , Y = null === (F = T) || void 0 === F ? void 0 : F.then;
                        if ("function" == typeof Y)
                            M++,
                            Y.call(T, (e=>{
                                m = e,
                                null != e && X.write(e),
                                G && X.end(),
                                n.nextTick(C)
                            }
                            ), (e=>{
                                X.destroy(e),
                                n.nextTick(C, e)
                            }
                            ));
                        else if (w(T, !0))
                            M++,
                            P(T, X, C, {
                                end: G
                            });
                        else {
                            if (!x(T) && !A(T))
                                throw new h("AsyncIterable or Promise","destination",T);
                            {
                                const Q = T.readable || T;
                                M++,
                                P(Q, X, C, {
                                    end: G
                                })
                            }
                        }
                        T = X;
                        const {destroy: K, cleanup: Z} = N(T, !1, !0);
                        y.push(K),
                        q && u.push(Z)
                    }
                } else if (S(W)) {
                    if (E(T)) {
                        M += 2;
                        const ee = L(T, W, C, {
                            end: G
                        });
                        _(W) && q && u.push(ee)
                    } else if (A(T) || x(T)) {
                        const te = T.readable || T;
                        M++,
                        P(te, W, C, {
                            end: G
                        })
                    } else {
                        if (!w(T))
                            throw new f("val",["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],T);
                        M++,
                        P(T, W, C, {
                            end: G
                        })
                    }
                    T = W
                } else if (R(W)) {
                    if (E(T))
                        M++,
                        I(j(T), W, C, {
                            end: G
                        });
                    else if (x(T) || w(T))
                        M++,
                        I(T, W, C, {
                            end: G
                        });
                    else {
                        if (!A(T))
                            throw new f("val",["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],T);
                        M++,
                        I(T.readable, W, C, {
                            end: G
                        })
                    }
                    T = W
                } else
                    T = c.from(W)
            }
            return (null != a && a.aborted || null != l && l.aborted) && n.nextTick(d),
            T
        }
        function L(e, t, r, {end: i}) {
            let o = !1;
            if (t.on("close", (()=>{
                o || r(new m)
            }
            )),
            e.pipe(t, {
                end: !1
            }),
            i) {
                function s() {
                    o = !0,
                    t.end()
                }
                T(e) ? n.nextTick(s) : e.once("end", s)
            } else
                r();
            return a(e, {
                readable: !0,
                writable: !1
            }, (t=>{
                const n = e._readableState;
                t && "ERR_STREAM_PREMATURE_CLOSE" === t.code && n && n.ended && !n.errored && !n.errorEmitted ? e.once("end", r).once("error", r) : r(t)
            }
            )),
            a(t, {
                readable: !1,
                writable: !0
            }, r)
        }
        t.exports = {
            pipelineImpl: C,
            pipeline: function(...e) {
                return C(e, l(function(e) {
                    return y(e[e.length - 1], "streams[stream.length - 1]"),
                    e.pop()
                }(e)))
            }
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "../../ours/util": 153,
        "../validators": 149,
        "./destroy": 135,
        "./duplex": 136,
        "./end-of-stream": 138,
        "./passthrough": 142,
        "./readable": 144,
        "./utils": 147,
        "abort-controller": 121,
        "process/": 178
    }],
    144: [function(e, t, r) {
        const n = e("process/")
          , {ArrayPrototypeIndexOf: i, NumberIsInteger: o, NumberIsNaN: s, NumberParseInt: a, ObjectDefineProperties: l, ObjectKeys: u, ObjectSetPrototypeOf: c, Promise: d, SafeSet: f, SymbolAsyncIterator: h, Symbol: p} = e("../../ours/primordials");
        t.exports = B,
        B.ReadableState = $;
        const {EventEmitter: g} = e("events")
          , {Stream: m, prependListener: b} = e("./legacy")
          , {Buffer: y} = e("buffer")
          , {addAbortSignal: v} = e("./add-abort-signal")
          , w = e("./end-of-stream");
        let _ = e("../../ours/util").debuglog("stream", (e=>{
            _ = e
        }
        ));
        const E = e("./buffer_list")
          , S = e("./destroy")
          , {getHighWaterMark: A, getDefaultHighWaterMark: R} = e("./state")
          , {aggregateTwoErrors: x, codes: {ERR_INVALID_ARG_TYPE: T, ERR_METHOD_NOT_IMPLEMENTED: O, ERR_OUT_OF_RANGE: k, ERR_STREAM_PUSH_AFTER_EOF: M, ERR_STREAM_UNSHIFT_AFTER_END_EVENT: N}} = e("../../ours/errors")
          , {validateObject: j} = e("../validators")
          , P = p("kPaused")
          , {StringDecoder: I} = e("string_decoder")
          , C = e("./from");
        c(B.prototype, m.prototype),
        c(B, m);
        const L = ()=>{}
          , {errorOrDestroy: D} = S;
        function $(t, r, n) {
            "boolean" != typeof n && (n = r instanceof e("./duplex")),
            this.objectMode = !(!t || !t.objectMode),
            n && (this.objectMode = this.objectMode || !(!t || !t.readableObjectMode)),
            this.highWaterMark = t ? A(this, t, "readableHighWaterMark", n) : R(!1),
            this.buffer = new E,
            this.length = 0,
            this.pipes = [],
            this.flowing = null,
            this.ended = !1,
            this.endEmitted = !1,
            this.reading = !1,
            this.constructed = !0,
            this.sync = !0,
            this.needReadable = !1,
            this.emittedReadable = !1,
            this.readableListening = !1,
            this.resumeScheduled = !1,
            this[P] = null,
            this.errorEmitted = !1,
            this.emitClose = !t || !1 !== t.emitClose,
            this.autoDestroy = !t || !1 !== t.autoDestroy,
            this.destroyed = !1,
            this.errored = null,
            this.closed = !1,
            this.closeEmitted = !1,
            this.defaultEncoding = t && t.defaultEncoding || "utf8",
            this.awaitDrainWriters = null,
            this.multiAwaitDrain = !1,
            this.readingMore = !1,
            this.dataEmitted = !1,
            this.decoder = null,
            this.encoding = null,
            t && t.encoding && (this.decoder = new I(t.encoding),
            this.encoding = t.encoding)
        }
        function B(t) {
            if (!(this instanceof B))
                return new B(t);
            const r = this instanceof e("./duplex");
            this._readableState = new $(t,this,r),
            t && ("function" == typeof t.read && (this._read = t.read),
            "function" == typeof t.destroy && (this._destroy = t.destroy),
            "function" == typeof t.construct && (this._construct = t.construct),
            t.signal && !r && v(t.signal, this)),
            m.call(this, t),
            S.construct(this, (()=>{
                this._readableState.needReadable && G(this, this._readableState)
            }
            ))
        }
        function F(e, t, r, n) {
            _("readableAddChunk", t);
            const i = e._readableState;
            let o;
            if (i.objectMode || ("string" == typeof t ? (r = r || i.defaultEncoding,
            i.encoding !== r && (n && i.encoding ? t = y.from(t, r).toString(i.encoding) : (t = y.from(t, r),
            r = ""))) : t instanceof y ? r = "" : m._isUint8Array(t) ? (t = m._uint8ArrayToBuffer(t),
            r = "") : null != t && (o = new T("chunk",["string", "Buffer", "Uint8Array"],t))),
            o)
                D(e, o);
            else if (null === t)
                i.reading = !1,
                function(e, t) {
                    if (_("onEofChunk"),
                    t.ended)
                        return;
                    if (t.decoder) {
                        const e = t.decoder.end();
                        e && e.length && (t.buffer.push(e),
                        t.length += t.objectMode ? 1 : e.length)
                    }
                    t.ended = !0,
                    t.sync ? V(e) : (t.needReadable = !1,
                    t.emittedReadable = !0,
                    H(e))
                }(e, i);
            else if (i.objectMode || t && t.length > 0)
                if (n)
                    if (i.endEmitted)
                        D(e, new N);
                    else {
                        if (i.destroyed || i.errored)
                            return !1;
                        U(e, i, t, !0)
                    }
                else if (i.ended)
                    D(e, new M);
                else {
                    if (i.destroyed || i.errored)
                        return !1;
                    i.reading = !1,
                    i.decoder && !r ? (t = i.decoder.write(t),
                    i.objectMode || 0 !== t.length ? U(e, i, t, !1) : G(e, i)) : U(e, i, t, !1)
                }
            else
                n || (i.reading = !1,
                G(e, i));
            return !i.ended && (i.length < i.highWaterMark || 0 === i.length)
        }
        function U(e, t, r, n) {
            t.flowing && 0 === t.length && !t.sync && e.listenerCount("data") > 0 ? (t.multiAwaitDrain ? t.awaitDrainWriters.clear() : t.awaitDrainWriters = null,
            t.dataEmitted = !0,
            e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length,
            n ? t.buffer.unshift(r) : t.buffer.push(r),
            t.needReadable && V(e)),
            G(e, t)
        }
        B.prototype.destroy = S.destroy,
        B.prototype._undestroy = S.undestroy,
        B.prototype._destroy = function(e, t) {
            t(e)
        }
        ,
        B.prototype[g.captureRejectionSymbol] = function(e) {
            this.destroy(e)
        }
        ,
        B.prototype.push = function(e, t) {
            return F(this, e, t, !1)
        }
        ,
        B.prototype.unshift = function(e, t) {
            return F(this, e, t, !0)
        }
        ,
        B.prototype.isPaused = function() {
            const e = this._readableState;
            return !0 === e[P] || !1 === e.flowing
        }
        ,
        B.prototype.setEncoding = function(e) {
            const t = new I(e);
            this._readableState.decoder = t,
            this._readableState.encoding = this._readableState.decoder.encoding;
            const r = this._readableState.buffer;
            let n = "";
            for (const e of r)
                n += t.write(e);
            return r.clear(),
            "" !== n && r.push(n),
            this._readableState.length = n.length,
            this
        }
        ;
        function W(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : s(e) ? t.flowing && t.length ? t.buffer.first().length : t.length : e <= t.length ? e : t.ended ? t.length : 0
        }
        function V(e) {
            const t = e._readableState;
            _("emitReadable", t.needReadable, t.emittedReadable),
            t.needReadable = !1,
            t.emittedReadable || (_("emitReadable", t.flowing),
            t.emittedReadable = !0,
            n.nextTick(H, e))
        }
        function H(e) {
            const t = e._readableState;
            _("emitReadable_", t.destroyed, t.length, t.ended),
            t.destroyed || t.errored || !t.length && !t.ended || (e.emit("readable"),
            t.emittedReadable = !1),
            t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark,
            Y(e)
        }
        function G(e, t) {
            !t.readingMore && t.constructed && (t.readingMore = !0,
            n.nextTick(q, e, t))
        }
        function q(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length); ) {
                const r = t.length;
                if (_("maybeReadMore read 0"),
                e.read(0),
                r === t.length)
                    break
            }
            t.readingMore = !1
        }
        function J(e) {
            const t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0,
            t.resumeScheduled && !1 === t[P] ? t.flowing = !0 : e.listenerCount("data") > 0 ? e.resume() : t.readableListening || (t.flowing = null)
        }
        function z(e) {
            _("readable nexttick read 0"),
            e.read(0)
        }
        function X(e, t) {
            _("resume", t.reading),
            t.reading || e.read(0),
            t.resumeScheduled = !1,
            e.emit("resume"),
            Y(e),
            t.flowing && !t.reading && e.read(0)
        }
        function Y(e) {
            const t = e._readableState;
            for (_("flow", t.flowing); t.flowing && null !== e.read(); )
                ;
        }
        function K(e, t) {
            "function" != typeof e.read && (e = B.wrap(e, {
                objectMode: !0
            }));
            const r = async function*(e, t) {
                let r, n = L;
                function i(t) {
                    this === e ? (n(),
                    n = L) : n = t
                }
                e.on("readable", i);
                const o = w(e, {
                    writable: !1
                }, (e=>{
                    r = e ? x(r, e) : null,
                    n(),
                    n = L
                }
                ));
                try {
                    for (; ; ) {
                        const t = e.destroyed ? null : e.read();
                        if (null !== t)
                            yield t;
                        else {
                            if (r)
                                throw r;
                            if (null === r)
                                return;
                            await new d(i)
                        }
                    }
                } catch (e) {
                    throw r = x(r, e),
                    r
                } finally {
                    !r && !1 === (null == t ? void 0 : t.destroyOnReturn) || void 0 !== r && !e._readableState.autoDestroy ? (e.off("readable", i),
                    o()) : S.destroyer(e, null)
                }
            }(e, t);
            return r.stream = e,
            r
        }
        function Z(e, t) {
            if (0 === t.length)
                return null;
            let r;
            return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length),
            t.buffer.clear()) : r = t.buffer.consume(e, t.decoder),
            r
        }
        function Q(e) {
            const t = e._readableState;
            _("endReadable", t.endEmitted),
            t.endEmitted || (t.ended = !0,
            n.nextTick(ee, t, e))
        }
        function ee(e, t) {
            if (_("endReadableNT", e.endEmitted, e.length),
            !e.errored && !e.closeEmitted && !e.endEmitted && 0 === e.length)
                if (e.endEmitted = !0,
                t.emit("end"),
                t.writable && !1 === t.allowHalfOpen)
                    n.nextTick(te, t);
                else if (e.autoDestroy) {
                    const e = t._writableState;
                    (!e || e.autoDestroy && (e.finished || !1 === e.writable)) && t.destroy()
                }
        }
        function te(e) {
            e.writable && !e.writableEnded && !e.destroyed && e.end()
        }
        let re;
        function ne() {
            return void 0 === re && (re = {}),
            re
        }
        B.prototype.read = function(e) {
            _("read", e),
            void 0 === e ? e = NaN : o(e) || (e = a(e, 10));
            const t = this._readableState
              , r = e;
            if (e > t.highWaterMark && (t.highWaterMark = function(e) {
                if (e > 1073741824)
                    throw new k("size","<= 1GiB",e);
                return e--,
                e |= e >>> 1,
                e |= e >>> 2,
                e |= e >>> 4,
                e |= e >>> 8,
                e |= e >>> 16,
                ++e
            }(e)),
            0 !== e && (t.emittedReadable = !1),
            0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                return _("read: emitReadable", t.length, t.ended),
                0 === t.length && t.ended ? Q(this) : V(this),
                null;
            if (0 === (e = W(e, t)) && t.ended)
                return 0 === t.length && Q(this),
                null;
            let n, i = t.needReadable;
            if (_("need readable", i),
            (0 === t.length || t.length - e < t.highWaterMark) && (i = !0,
            _("length less than watermark", i)),
            t.ended || t.reading || t.destroyed || t.errored || !t.constructed)
                i = !1,
                _("reading, ended or constructing", i);
            else if (i) {
                _("do read"),
                t.reading = !0,
                t.sync = !0,
                0 === t.length && (t.needReadable = !0);
                try {
                    this._read(t.highWaterMark)
                } catch (e) {
                    D(this, e)
                }
                t.sync = !1,
                t.reading || (e = W(r, t))
            }
            return n = e > 0 ? Z(e, t) : null,
            null === n ? (t.needReadable = t.length <= t.highWaterMark,
            e = 0) : (t.length -= e,
            t.multiAwaitDrain ? t.awaitDrainWriters.clear() : t.awaitDrainWriters = null),
            0 === t.length && (t.ended || (t.needReadable = !0),
            r !== e && t.ended && Q(this)),
            null === n || t.errorEmitted || t.closeEmitted || (t.dataEmitted = !0,
            this.emit("data", n)),
            n
        }
        ,
        B.prototype._read = function(e) {
            throw new O("_read()")
        }
        ,
        B.prototype.pipe = function(e, t) {
            const r = this
              , i = this._readableState;
            1 === i.pipes.length && (i.multiAwaitDrain || (i.multiAwaitDrain = !0,
            i.awaitDrainWriters = new f(i.awaitDrainWriters ? [i.awaitDrainWriters] : []))),
            i.pipes.push(e),
            _("pipe count=%d opts=%j", i.pipes.length, t);
            const o = (!t || !1 !== t.end) && e !== n.stdout && e !== n.stderr ? a : m;
            function s(t, n) {
                _("onunpipe"),
                t === r && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0,
                function() {
                    _("cleanup"),
                    e.removeListener("close", p),
                    e.removeListener("finish", g),
                    l && e.removeListener("drain", l);
                    e.removeListener("error", h),
                    e.removeListener("unpipe", s),
                    r.removeListener("end", a),
                    r.removeListener("end", m),
                    r.removeListener("data", d),
                    u = !0,
                    l && i.awaitDrainWriters && (!e._writableState || e._writableState.needDrain) && l()
                }())
            }
            function a() {
                _("onend"),
                e.end()
            }
            let l;
            i.endEmitted ? n.nextTick(o) : r.once("end", o),
            e.on("unpipe", s);
            let u = !1;
            function c() {
                u || (1 === i.pipes.length && i.pipes[0] === e ? (_("false write response, pause", 0),
                i.awaitDrainWriters = e,
                i.multiAwaitDrain = !1) : i.pipes.length > 1 && i.pipes.includes(e) && (_("false write response, pause", i.awaitDrainWriters.size),
                i.awaitDrainWriters.add(e)),
                r.pause()),
                l || (l = function(e, t) {
                    return function() {
                        const r = e._readableState;
                        r.awaitDrainWriters === t ? (_("pipeOnDrain", 1),
                        r.awaitDrainWriters = null) : r.multiAwaitDrain && (_("pipeOnDrain", r.awaitDrainWriters.size),
                        r.awaitDrainWriters.delete(t)),
                        r.awaitDrainWriters && 0 !== r.awaitDrainWriters.size || !e.listenerCount("data") || e.resume()
                    }
                }(r, e),
                e.on("drain", l))
            }
            function d(t) {
                _("ondata");
                const r = e.write(t);
                _("dest.write", r),
                !1 === r && c()
            }
            function h(t) {
                if (_("onerror", t),
                m(),
                e.removeListener("error", h),
                0 === e.listenerCount("error")) {
                    const r = e._writableState || e._readableState;
                    r && !r.errorEmitted ? D(e, t) : e.emit("error", t)
                }
            }
            function p() {
                e.removeListener("finish", g),
                m()
            }
            function g() {
                _("onfinish"),
                e.removeListener("close", p),
                m()
            }
            function m() {
                _("unpipe"),
                r.unpipe(e)
            }
            return r.on("data", d),
            b(e, "error", h),
            e.once("close", p),
            e.once("finish", g),
            e.emit("pipe", r),
            !0 === e.writableNeedDrain ? i.flowing && c() : i.flowing || (_("pipe resume"),
            r.resume()),
            e
        }
        ,
        B.prototype.unpipe = function(e) {
            const t = this._readableState;
            if (0 === t.pipes.length)
                return this;
            if (!e) {
                const e = t.pipes;
                t.pipes = [],
                this.pause();
                for (let t = 0; t < e.length; t++)
                    e[t].emit("unpipe", this, {
                        hasUnpiped: !1
                    });
                return this
            }
            const r = i(t.pipes, e);
            return -1 === r || (t.pipes.splice(r, 1),
            0 === t.pipes.length && this.pause(),
            e.emit("unpipe", this, {
                hasUnpiped: !1
            })),
            this
        }
        ,
        B.prototype.on = function(e, t) {
            const r = m.prototype.on.call(this, e, t)
              , i = this._readableState;
            return "data" === e ? (i.readableListening = this.listenerCount("readable") > 0,
            !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0,
            i.flowing = !1,
            i.emittedReadable = !1,
            _("on readable", i.length, i.reading),
            i.length ? V(this) : i.reading || n.nextTick(z, this))),
            r
        }
        ,
        B.prototype.addListener = B.prototype.on,
        B.prototype.removeListener = function(e, t) {
            const r = m.prototype.removeListener.call(this, e, t);
            return "readable" === e && n.nextTick(J, this),
            r
        }
        ,
        B.prototype.off = B.prototype.removeListener,
        B.prototype.removeAllListeners = function(e) {
            const t = m.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || n.nextTick(J, this),
            t
        }
        ,
        B.prototype.resume = function() {
            const e = this._readableState;
            return e.flowing || (_("resume"),
            e.flowing = !e.readableListening,
            function(e, t) {
                t.resumeScheduled || (t.resumeScheduled = !0,
                n.nextTick(X, e, t))
            }(this, e)),
            e[P] = !1,
            this
        }
        ,
        B.prototype.pause = function() {
            return _("call pause flowing=%j", this._readableState.flowing),
            !1 !== this._readableState.flowing && (_("pause"),
            this._readableState.flowing = !1,
            this.emit("pause")),
            this._readableState[P] = !0,
            this
        }
        ,
        B.prototype.wrap = function(e) {
            let t = !1;
            e.on("data", (r=>{
                !this.push(r) && e.pause && (t = !0,
                e.pause())
            }
            )),
            e.on("end", (()=>{
                this.push(null)
            }
            )),
            e.on("error", (e=>{
                D(this, e)
            }
            )),
            e.on("close", (()=>{
                this.destroy()
            }
            )),
            e.on("destroy", (()=>{
                this.destroy()
            }
            )),
            this._read = ()=>{
                t && e.resume && (t = !1,
                e.resume())
            }
            ;
            const r = u(e);
            for (let t = 1; t < r.length; t++) {
                const n = r[t];
                void 0 === this[n] && "function" == typeof e[n] && (this[n] = e[n].bind(e))
            }
            return this
        }
        ,
        B.prototype[h] = function() {
            return K(this)
        }
        ,
        B.prototype.iterator = function(e) {
            return void 0 !== e && j(e, "options"),
            K(this, e)
        }
        ,
        l(B.prototype, {
            readable: {
                __proto__: null,
                get() {
                    const e = this._readableState;
                    return !(!e || !1 === e.readable || e.destroyed || e.errorEmitted || e.endEmitted)
                },
                set(e) {
                    this._readableState && (this._readableState.readable = !!e)
                }
            },
            readableDidRead: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.dataEmitted
                }
            },
            readableAborted: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return !(!1 === this._readableState.readable || !this._readableState.destroyed && !this._readableState.errored || this._readableState.endEmitted)
                }
            },
            readableHighWaterMark: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.highWaterMark
                }
            },
            readableBuffer: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState && this._readableState.buffer
                }
            },
            readableFlowing: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return this._readableState.flowing
                },
                set: function(e) {
                    this._readableState && (this._readableState.flowing = e)
                }
            },
            readableLength: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState.length
                }
            },
            readableObjectMode: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.objectMode
                }
            },
            readableEncoding: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState ? this._readableState.encoding : null
                }
            },
            errored: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._readableState ? this._readableState.errored : null
                }
            },
            closed: {
                __proto__: null,
                get() {
                    return !!this._readableState && this._readableState.closed
                }
            },
            destroyed: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.destroyed
                },
                set(e) {
                    this._readableState && (this._readableState.destroyed = e)
                }
            },
            readableEnded: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return !!this._readableState && this._readableState.endEmitted
                }
            }
        }),
        l($.prototype, {
            pipesCount: {
                __proto__: null,
                get() {
                    return this.pipes.length
                }
            },
            paused: {
                __proto__: null,
                get() {
                    return !1 !== this[P]
                },
                set(e) {
                    this[P] = !!e
                }
            }
        }),
        B._fromList = Z,
        B.from = function(e, t) {
            return C(B, e, t)
        }
        ,
        B.fromWeb = function(e, t) {
            return ne().newStreamReadableFromReadableStream(e, t)
        }
        ,
        B.toWeb = function(e, t) {
            return ne().newReadableStreamFromStreamReadable(e, t)
        }
        ,
        B.wrap = function(e, t) {
            var r, n;
            return new B({
                objectMode: null === (r = null !== (n = e.readableObjectMode) && void 0 !== n ? n : e.objectMode) || void 0 === r || r,
                ...t,
                destroy(t, r) {
                    S.destroyer(e, t),
                    r(t)
                }
            }).wrap(e)
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "../../ours/util": 153,
        "../validators": 149,
        "./add-abort-signal": 132,
        "./buffer_list": 133,
        "./destroy": 135,
        "./duplex": 136,
        "./end-of-stream": 138,
        "./from": 139,
        "./legacy": 140,
        "./state": 145,
        buffer: 124,
        events: 130,
        "process/": 178,
        string_decoder: 238
    }],
    145: [function(e, t, r) {
        "use strict";
        const {MathFloor: n, NumberIsInteger: i} = e("../../ours/primordials")
          , {ERR_INVALID_ARG_VALUE: o} = e("../../ours/errors").codes;
        function s(e) {
            return e ? 16 : 16384
        }
        t.exports = {
            getHighWaterMark: function(e, t, r, a) {
                const l = function(e, t, r) {
                    return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null
                }(t, a, r);
                if (null != l) {
                    if (!i(l) || l < 0) {
                        throw new o(a ? `options.${r}` : "options.highWaterMark",l)
                    }
                    return n(l)
                }
                return s(e.objectMode)
            },
            getDefaultHighWaterMark: s
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152
    }],
    146: [function(e, t, r) {
        "use strict";
        const {ObjectSetPrototypeOf: n, Symbol: i} = e("../../ours/primordials");
        t.exports = u;
        const {ERR_METHOD_NOT_IMPLEMENTED: o} = e("../../ours/errors").codes
          , s = e("./duplex")
          , {getHighWaterMark: a} = e("./state");
        n(u.prototype, s.prototype),
        n(u, s);
        const l = i("kCallback");
        function u(e) {
            if (!(this instanceof u))
                return new u(e);
            const t = e ? a(this, e, "readableHighWaterMark", !0) : null;
            0 === t && (e = {
                ...e,
                highWaterMark: null,
                readableHighWaterMark: t,
                writableHighWaterMark: e.writableHighWaterMark || 0
            }),
            s.call(this, e),
            this._readableState.sync = !1,
            this[l] = null,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", d)
        }
        function c(e) {
            "function" != typeof this._flush || this.destroyed ? (this.push(null),
            e && e()) : this._flush(((t,r)=>{
                t ? e ? e(t) : this.destroy(t) : (null != r && this.push(r),
                this.push(null),
                e && e())
            }
            ))
        }
        function d() {
            this._final !== c && c.call(this)
        }
        u.prototype._final = c,
        u.prototype._transform = function(e, t, r) {
            throw new o("_transform()")
        }
        ,
        u.prototype._write = function(e, t, r) {
            const n = this._readableState
              , i = this._writableState
              , o = n.length;
            this._transform(e, t, ((e,t)=>{
                e ? r(e) : (null != t && this.push(t),
                i.ended || o === n.length || n.length < n.highWaterMark ? r() : this[l] = r)
            }
            ))
        }
        ,
        u.prototype._read = function() {
            if (this[l]) {
                const e = this[l];
                this[l] = null,
                e()
            }
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "./duplex": 136,
        "./state": 145
    }],
    147: [function(e, t, r) {
        "use strict";
        const {Symbol: n, SymbolAsyncIterator: i, SymbolIterator: o, SymbolFor: s} = e("../../ours/primordials")
          , a = n("kDestroyed")
          , l = n("kIsErrored")
          , u = n("kIsReadable")
          , c = n("kIsDisturbed")
          , d = s("nodejs.webstream.isClosedPromise")
          , f = s("nodejs.webstream.controllerErrorFunction");
        function h(e, t=!1) {
            var r;
            return !(!e || "function" != typeof e.pipe || "function" != typeof e.on || t && ("function" != typeof e.pause || "function" != typeof e.resume) || e._writableState && !1 === (null === (r = e._readableState) || void 0 === r ? void 0 : r.readable) || e._writableState && !e._readableState)
        }
        function p(e) {
            var t;
            return !(!e || "function" != typeof e.write || "function" != typeof e.on || e._readableState && !1 === (null === (t = e._writableState) || void 0 === t ? void 0 : t.writable))
        }
        function g(e) {
            return e && (e._readableState || e._writableState || "function" == typeof e.write && "function" == typeof e.on || "function" == typeof e.pipe && "function" == typeof e.on)
        }
        function m(e) {
            return !(!e || g(e) || "function" != typeof e.pipeThrough || "function" != typeof e.getReader || "function" != typeof e.cancel)
        }
        function b(e) {
            return !(!e || g(e) || "function" != typeof e.getWriter || "function" != typeof e.abort)
        }
        function y(e) {
            return !(!e || g(e) || "object" != typeof e.readable || "object" != typeof e.writable)
        }
        function v(e) {
            if (!g(e))
                return null;
            const t = e._writableState
              , r = e._readableState
              , n = t || r;
            return !!(e.destroyed || e[a] || null != n && n.destroyed)
        }
        function w(e) {
            if (!p(e))
                return null;
            if (!0 === e.writableEnded)
                return !0;
            const t = e._writableState;
            return (null == t || !t.errored) && ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
        }
        function _(e, t) {
            if (!h(e))
                return null;
            const r = e._readableState;
            return (null == r || !r.errored) && ("boolean" != typeof (null == r ? void 0 : r.endEmitted) ? null : !!(r.endEmitted || !1 === t && !0 === r.ended && 0 === r.length))
        }
        function E(e) {
            return e && null != e[u] ? e[u] : "boolean" != typeof (null == e ? void 0 : e.readable) ? null : !v(e) && (h(e) && e.readable && !_(e))
        }
        function S(e) {
            return "boolean" != typeof (null == e ? void 0 : e.writable) ? null : !v(e) && (p(e) && e.writable && !w(e))
        }
        function A(e) {
            return "boolean" == typeof e._closed && "boolean" == typeof e._defaultKeepAlive && "boolean" == typeof e._removedConnection && "boolean" == typeof e._removedContLen
        }
        function R(e) {
            return "boolean" == typeof e._sent100 && A(e)
        }
        t.exports = {
            kDestroyed: a,
            isDisturbed: function(e) {
                var t;
                return !(!e || !(null !== (t = e[c]) && void 0 !== t ? t : e.readableDidRead || e.readableAborted))
            },
            kIsDisturbed: c,
            isErrored: function(e) {
                var t, r, n, i, o, s, a, u, c, d;
                return !(!e || !(null !== (t = null !== (r = null !== (n = null !== (i = null !== (o = null !== (s = e[l]) && void 0 !== s ? s : e.readableErrored) && void 0 !== o ? o : e.writableErrored) && void 0 !== i ? i : null === (a = e._readableState) || void 0 === a ? void 0 : a.errorEmitted) && void 0 !== n ? n : null === (u = e._writableState) || void 0 === u ? void 0 : u.errorEmitted) && void 0 !== r ? r : null === (c = e._readableState) || void 0 === c ? void 0 : c.errored) && void 0 !== t ? t : null === (d = e._writableState) || void 0 === d ? void 0 : d.errored))
            },
            kIsErrored: l,
            isReadable: E,
            kIsReadable: u,
            kIsClosedPromise: d,
            kControllerErrorFunction: f,
            isClosed: function(e) {
                if (!g(e))
                    return null;
                if ("boolean" == typeof e.closed)
                    return e.closed;
                const t = e._writableState
                  , r = e._readableState;
                return "boolean" == typeof (null == t ? void 0 : t.closed) || "boolean" == typeof (null == r ? void 0 : r.closed) ? (null == t ? void 0 : t.closed) || (null == r ? void 0 : r.closed) : "boolean" == typeof e._closed && A(e) ? e._closed : null
            },
            isDestroyed: v,
            isDuplexNodeStream: function(e) {
                return !(!e || "function" != typeof e.pipe || !e._readableState || "function" != typeof e.on || "function" != typeof e.write)
            },
            isFinished: function(e, t) {
                return g(e) ? !!v(e) || (!1 === (null == t ? void 0 : t.readable) || !E(e)) && (!1 === (null == t ? void 0 : t.writable) || !S(e)) : null
            },
            isIterable: function(e, t) {
                return null != e && (!0 === t ? "function" == typeof e[i] : !1 === t ? "function" == typeof e[o] : "function" == typeof e[i] || "function" == typeof e[o])
            },
            isReadableNodeStream: h,
            isReadableStream: m,
            isReadableEnded: function(e) {
                if (!h(e))
                    return null;
                if (!0 === e.readableEnded)
                    return !0;
                const t = e._readableState;
                return !(!t || t.errored) && ("boolean" != typeof (null == t ? void 0 : t.ended) ? null : t.ended)
            },
            isReadableFinished: _,
            isReadableErrored: function(e) {
                var t, r;
                return g(e) ? e.readableErrored ? e.readableErrored : null !== (t = null === (r = e._readableState) || void 0 === r ? void 0 : r.errored) && void 0 !== t ? t : null : null
            },
            isNodeStream: g,
            isWebStream: function(e) {
                return m(e) || b(e) || y(e)
            },
            isWritable: S,
            isWritableNodeStream: p,
            isWritableStream: b,
            isWritableEnded: w,
            isWritableFinished: function(e, t) {
                if (!p(e))
                    return null;
                if (!0 === e.writableFinished)
                    return !0;
                const r = e._writableState;
                return (null == r || !r.errored) && ("boolean" != typeof (null == r ? void 0 : r.finished) ? null : !!(r.finished || !1 === t && !0 === r.ended && 0 === r.length))
            },
            isWritableErrored: function(e) {
                var t, r;
                return g(e) ? e.writableErrored ? e.writableErrored : null !== (t = null === (r = e._writableState) || void 0 === r ? void 0 : r.errored) && void 0 !== t ? t : null : null
            },
            isServerRequest: function(e) {
                var t;
                return "boolean" == typeof e._consuming && "boolean" == typeof e._dumped && void 0 === (null === (t = e.req) || void 0 === t ? void 0 : t.upgradeOrConnect)
            },
            isServerResponse: R,
            willEmitClose: function(e) {
                if (!g(e))
                    return null;
                const t = e._writableState
                  , r = e._readableState
                  , n = t || r;
                return !n && R(e) || !!(n && n.autoDestroy && n.emitClose && !1 === n.closed)
            },
            isTransformStream: y
        }
    }
    , {
        "../../ours/primordials": 152
    }],
    148: [function(e, t, r) {
        const n = e("process/")
          , {ArrayPrototypeSlice: i, Error: o, FunctionPrototypeSymbolHasInstance: s, ObjectDefineProperty: a, ObjectDefineProperties: l, ObjectSetPrototypeOf: u, StringPrototypeToLowerCase: c, Symbol: d, SymbolHasInstance: f} = e("../../ours/primordials");
        t.exports = I,
        I.WritableState = j;
        const {EventEmitter: h} = e("events")
          , p = e("./legacy").Stream
          , {Buffer: g} = e("buffer")
          , m = e("./destroy")
          , {addAbortSignal: b} = e("./add-abort-signal")
          , {getHighWaterMark: y, getDefaultHighWaterMark: v} = e("./state")
          , {ERR_INVALID_ARG_TYPE: w, ERR_METHOD_NOT_IMPLEMENTED: _, ERR_MULTIPLE_CALLBACK: E, ERR_STREAM_CANNOT_PIPE: S, ERR_STREAM_DESTROYED: A, ERR_STREAM_ALREADY_FINISHED: R, ERR_STREAM_NULL_VALUES: x, ERR_STREAM_WRITE_AFTER_END: T, ERR_UNKNOWN_ENCODING: O} = e("../../ours/errors").codes
          , {errorOrDestroy: k} = m;
        function M() {}
        u(I.prototype, p.prototype),
        u(I, p);
        const N = d("kOnFinished");
        function j(t, r, n) {
            "boolean" != typeof n && (n = r instanceof e("./duplex")),
            this.objectMode = !(!t || !t.objectMode),
            n && (this.objectMode = this.objectMode || !(!t || !t.writableObjectMode)),
            this.highWaterMark = t ? y(this, t, "writableHighWaterMark", n) : v(!1),
            this.finalCalled = !1,
            this.needDrain = !1,
            this.ending = !1,
            this.ended = !1,
            this.finished = !1,
            this.destroyed = !1;
            const i = !(!t || !1 !== t.decodeStrings);
            this.decodeStrings = !i,
            this.defaultEncoding = t && t.defaultEncoding || "utf8",
            this.length = 0,
            this.writing = !1,
            this.corked = 0,
            this.sync = !0,
            this.bufferProcessing = !1,
            this.onwrite = $.bind(void 0, r),
            this.writecb = null,
            this.writelen = 0,
            this.afterWriteTickInfo = null,
            P(this),
            this.pendingcb = 0,
            this.constructed = !0,
            this.prefinished = !1,
            this.errorEmitted = !1,
            this.emitClose = !t || !1 !== t.emitClose,
            this.autoDestroy = !t || !1 !== t.autoDestroy,
            this.errored = null,
            this.closed = !1,
            this.closeEmitted = !1,
            this[N] = []
        }
        function P(e) {
            e.buffered = [],
            e.bufferedIndex = 0,
            e.allBuffers = !0,
            e.allNoop = !0
        }
        function I(t) {
            const r = this instanceof e("./duplex");
            if (!r && !s(I, this))
                return new I(t);
            this._writableState = new j(t,this,r),
            t && ("function" == typeof t.write && (this._write = t.write),
            "function" == typeof t.writev && (this._writev = t.writev),
            "function" == typeof t.destroy && (this._destroy = t.destroy),
            "function" == typeof t.final && (this._final = t.final),
            "function" == typeof t.construct && (this._construct = t.construct),
            t.signal && b(t.signal, this)),
            p.call(this, t),
            m.construct(this, (()=>{
                const e = this._writableState;
                e.writing || W(this, e),
                G(this, e)
            }
            ))
        }
        function C(e, t, r, i) {
            const o = e._writableState;
            if ("function" == typeof r)
                i = r,
                r = o.defaultEncoding;
            else {
                if (r) {
                    if ("buffer" !== r && !g.isEncoding(r))
                        throw new O(r)
                } else
                    r = o.defaultEncoding;
                "function" != typeof i && (i = M)
            }
            if (null === t)
                throw new x;
            if (!o.objectMode)
                if ("string" == typeof t)
                    !1 !== o.decodeStrings && (t = g.from(t, r),
                    r = "buffer");
                else if (t instanceof g)
                    r = "buffer";
                else {
                    if (!p._isUint8Array(t))
                        throw new w("chunk",["string", "Buffer", "Uint8Array"],t);
                    t = p._uint8ArrayToBuffer(t),
                    r = "buffer"
                }
            let s;
            return o.ending ? s = new T : o.destroyed && (s = new A("write")),
            s ? (n.nextTick(i, s),
            k(e, s, !0),
            s) : (o.pendingcb++,
            function(e, t, r, n, i) {
                const o = t.objectMode ? 1 : r.length;
                t.length += o;
                const s = t.length < t.highWaterMark;
                s || (t.needDrain = !0);
                t.writing || t.corked || t.errored || !t.constructed ? (t.buffered.push({
                    chunk: r,
                    encoding: n,
                    callback: i
                }),
                t.allBuffers && "buffer" !== n && (t.allBuffers = !1),
                t.allNoop && i !== M && (t.allNoop = !1)) : (t.writelen = o,
                t.writecb = i,
                t.writing = !0,
                t.sync = !0,
                e._write(r, n, t.onwrite),
                t.sync = !1);
                return s && !t.errored && !t.destroyed
            }(e, o, t, r, i))
        }
        function L(e, t, r, n, i, o, s) {
            t.writelen = n,
            t.writecb = s,
            t.writing = !0,
            t.sync = !0,
            t.destroyed ? t.onwrite(new A("write")) : r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite),
            t.sync = !1
        }
        function D(e, t, r, n) {
            --t.pendingcb,
            n(r),
            U(t),
            k(e, r)
        }
        function $(e, t) {
            const r = e._writableState
              , i = r.sync
              , o = r.writecb;
            "function" == typeof o ? (r.writing = !1,
            r.writecb = null,
            r.length -= r.writelen,
            r.writelen = 0,
            t ? (t.stack,
            r.errored || (r.errored = t),
            e._readableState && !e._readableState.errored && (e._readableState.errored = t),
            i ? n.nextTick(D, e, r, t, o) : D(e, r, t, o)) : (r.buffered.length > r.bufferedIndex && W(e, r),
            i ? null !== r.afterWriteTickInfo && r.afterWriteTickInfo.cb === o ? r.afterWriteTickInfo.count++ : (r.afterWriteTickInfo = {
                count: 1,
                cb: o,
                stream: e,
                state: r
            },
            n.nextTick(B, r.afterWriteTickInfo)) : F(e, r, 1, o))) : k(e, new E)
        }
        function B({stream: e, state: t, count: r, cb: n}) {
            return t.afterWriteTickInfo = null,
            F(e, t, r, n)
        }
        function F(e, t, r, n) {
            for (!t.ending && !e.destroyed && 0 === t.length && t.needDrain && (t.needDrain = !1,
            e.emit("drain")); r-- > 0; )
                t.pendingcb--,
                n();
            t.destroyed && U(t),
            G(e, t)
        }
        function U(e) {
            if (e.writing)
                return;
            for (let r = e.bufferedIndex; r < e.buffered.length; ++r) {
                var t;
                const {chunk: n, callback: i} = e.buffered[r]
                  , o = e.objectMode ? 1 : n.length;
                e.length -= o,
                i(null !== (t = e.errored) && void 0 !== t ? t : new A("write"))
            }
            const r = e[N].splice(0);
            for (let t = 0; t < r.length; t++) {
                var n;
                r[t](null !== (n = e.errored) && void 0 !== n ? n : new A("end"))
            }
            P(e)
        }
        function W(e, t) {
            if (t.corked || t.bufferProcessing || t.destroyed || !t.constructed)
                return;
            const {buffered: r, bufferedIndex: n, objectMode: o} = t
              , s = r.length - n;
            if (!s)
                return;
            let a = n;
            if (t.bufferProcessing = !0,
            s > 1 && e._writev) {
                t.pendingcb -= s - 1;
                const n = t.allNoop ? M : e=>{
                    for (let t = a; t < r.length; ++t)
                        r[t].callback(e)
                }
                  , o = t.allNoop && 0 === a ? r : i(r, a);
                o.allBuffers = t.allBuffers,
                L(e, t, !0, t.length, o, "", n),
                P(t)
            } else {
                do {
                    const {chunk: n, encoding: i, callback: s} = r[a];
                    r[a++] = null;
                    L(e, t, !1, o ? 1 : n.length, n, i, s)
                } while (a < r.length && !t.writing);
                a === r.length ? P(t) : a > 256 ? (r.splice(0, a),
                t.bufferedIndex = 0) : t.bufferedIndex = a
            }
            t.bufferProcessing = !1
        }
        function V(e) {
            return e.ending && !e.destroyed && e.constructed && 0 === e.length && !e.errored && 0 === e.buffered.length && !e.finished && !e.writing && !e.errorEmitted && !e.closeEmitted
        }
        function H(e, t) {
            t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0,
            e.emit("prefinish")) : (t.finalCalled = !0,
            function(e, t) {
                let r = !1;
                function i(i) {
                    if (r)
                        k(e, null != i ? i : E());
                    else if (r = !0,
                    t.pendingcb--,
                    i) {
                        const r = t[N].splice(0);
                        for (let e = 0; e < r.length; e++)
                            r[e](i);
                        k(e, i, t.sync)
                    } else
                        V(t) && (t.prefinished = !0,
                        e.emit("prefinish"),
                        t.pendingcb++,
                        n.nextTick(q, e, t))
                }
                t.sync = !0,
                t.pendingcb++;
                try {
                    e._final(i)
                } catch (e) {
                    i(e)
                }
                t.sync = !1
            }(e, t)))
        }
        function G(e, t, r) {
            V(t) && (H(e, t),
            0 === t.pendingcb && (r ? (t.pendingcb++,
            n.nextTick(((e,t)=>{
                V(t) ? q(e, t) : t.pendingcb--
            }
            ), e, t)) : V(t) && (t.pendingcb++,
            q(e, t))))
        }
        function q(e, t) {
            t.pendingcb--,
            t.finished = !0;
            const r = t[N].splice(0);
            for (let e = 0; e < r.length; e++)
                r[e]();
            if (e.emit("finish"),
            t.autoDestroy) {
                const t = e._readableState;
                (!t || t.autoDestroy && (t.endEmitted || !1 === t.readable)) && e.destroy()
            }
        }
        j.prototype.getBuffer = function() {
            return i(this.buffered, this.bufferedIndex)
        }
        ,
        a(j.prototype, "bufferedRequestCount", {
            __proto__: null,
            get() {
                return this.buffered.length - this.bufferedIndex
            }
        }),
        a(I, f, {
            __proto__: null,
            value: function(e) {
                return !!s(this, e) || this === I && (e && e._writableState instanceof j)
            }
        }),
        I.prototype.pipe = function() {
            k(this, new S)
        }
        ,
        I.prototype.write = function(e, t, r) {
            return !0 === C(this, e, t, r)
        }
        ,
        I.prototype.cork = function() {
            this._writableState.corked++
        }
        ,
        I.prototype.uncork = function() {
            const e = this._writableState;
            e.corked && (e.corked--,
            e.writing || W(this, e))
        }
        ,
        I.prototype.setDefaultEncoding = function(e) {
            if ("string" == typeof e && (e = c(e)),
            !g.isEncoding(e))
                throw new O(e);
            return this._writableState.defaultEncoding = e,
            this
        }
        ,
        I.prototype._write = function(e, t, r) {
            if (!this._writev)
                throw new _("_write()");
            this._writev([{
                chunk: e,
                encoding: t
            }], r)
        }
        ,
        I.prototype._writev = null,
        I.prototype.end = function(e, t, r) {
            const i = this._writableState;
            let s;
            if ("function" == typeof e ? (r = e,
            e = null,
            t = null) : "function" == typeof t && (r = t,
            t = null),
            null != e) {
                const r = C(this, e, t);
                r instanceof o && (s = r)
            }
            return i.corked && (i.corked = 1,
            this.uncork()),
            s || (i.errored || i.ending ? i.finished ? s = new R("end") : i.destroyed && (s = new A("end")) : (i.ending = !0,
            G(this, i, !0),
            i.ended = !0)),
            "function" == typeof r && (s || i.finished ? n.nextTick(r, s) : i[N].push(r)),
            this
        }
        ,
        l(I.prototype, {
            closed: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.closed
                }
            },
            destroyed: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.destroyed
                },
                set(e) {
                    this._writableState && (this._writableState.destroyed = e)
                }
            },
            writable: {
                __proto__: null,
                get() {
                    const e = this._writableState;
                    return !(!e || !1 === e.writable || e.destroyed || e.errored || e.ending || e.ended)
                },
                set(e) {
                    this._writableState && (this._writableState.writable = !!e)
                }
            },
            writableFinished: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.finished
                }
            },
            writableObjectMode: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.objectMode
                }
            },
            writableBuffer: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.getBuffer()
                }
            },
            writableEnded: {
                __proto__: null,
                get() {
                    return !!this._writableState && this._writableState.ending
                }
            },
            writableNeedDrain: {
                __proto__: null,
                get() {
                    const e = this._writableState;
                    return !!e && (!e.destroyed && !e.ending && e.needDrain)
                }
            },
            writableHighWaterMark: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.highWaterMark
                }
            },
            writableCorked: {
                __proto__: null,
                get() {
                    return this._writableState ? this._writableState.corked : 0
                }
            },
            writableLength: {
                __proto__: null,
                get() {
                    return this._writableState && this._writableState.length
                }
            },
            errored: {
                __proto__: null,
                enumerable: !1,
                get() {
                    return this._writableState ? this._writableState.errored : null
                }
            },
            writableAborted: {
                __proto__: null,
                enumerable: !1,
                get: function() {
                    return !(!1 === this._writableState.writable || !this._writableState.destroyed && !this._writableState.errored || this._writableState.finished)
                }
            }
        });
        const J = m.destroy;
        let z;
        function X() {
            return void 0 === z && (z = {}),
            z
        }
        I.prototype.destroy = function(e, t) {
            const r = this._writableState;
            return !r.destroyed && (r.bufferedIndex < r.buffered.length || r[N].length) && n.nextTick(U, r),
            J.call(this, e, t),
            this
        }
        ,
        I.prototype._undestroy = m.undestroy,
        I.prototype._destroy = function(e, t) {
            t(e)
        }
        ,
        I.prototype[h.captureRejectionSymbol] = function(e) {
            this.destroy(e)
        }
        ,
        I.fromWeb = function(e, t) {
            return X().newStreamWritableFromWritableStream(e, t)
        }
        ,
        I.toWeb = function(e) {
            return X().newWritableStreamFromStreamWritable(e)
        }
    }
    , {
        "../../ours/errors": 151,
        "../../ours/primordials": 152,
        "./add-abort-signal": 132,
        "./destroy": 135,
        "./duplex": 136,
        "./legacy": 140,
        "./state": 145,
        buffer: 124,
        events: 130,
        "process/": 178
    }],
    149: [function(e, t, r) {
        "use strict";
        const {ArrayIsArray: n, ArrayPrototypeIncludes: i, ArrayPrototypeJoin: o, ArrayPrototypeMap: s, NumberIsInteger: a, NumberIsNaN: l, NumberMAX_SAFE_INTEGER: u, NumberMIN_SAFE_INTEGER: c, NumberParseInt: d, ObjectPrototypeHasOwnProperty: f, RegExpPrototypeExec: h, String: p, StringPrototypeToUpperCase: g, StringPrototypeTrim: m} = e("../ours/primordials")
          , {hideStackFrames: b, codes: {ERR_SOCKET_BAD_PORT: y, ERR_INVALID_ARG_TYPE: v, ERR_INVALID_ARG_VALUE: w, ERR_OUT_OF_RANGE: _, ERR_UNKNOWN_SIGNAL: E}} = e("../ours/errors")
          , {normalizeEncoding: S} = e("../ours/util")
          , {isAsyncFunction: A, isArrayBufferView: R} = e("../ours/util").types
          , x = {};
        const T = /^[0-7]+$/;
        const O = b(((e,t,r=c,n=u)=>{
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            if (e < r || e > n)
                throw new _(t,`>= ${r} && <= ${n}`,e)
        }
        ))
          , k = b(((e,t,r=-2147483648,n=2147483647)=>{
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            if (e < r || e > n)
                throw new _(t,`>= ${r} && <= ${n}`,e)
        }
        ))
          , M = b(((e,t,r=!1)=>{
            if ("number" != typeof e)
                throw new v(t,"number",e);
            if (!a(e))
                throw new _(t,"an integer",e);
            const n = r ? 1 : 0
              , i = 4294967295;
            if (e < n || e > i)
                throw new _(t,`>= ${n} && <= ${i}`,e)
        }
        ));
        function N(e, t) {
            if ("string" != typeof e)
                throw new v(t,"string",e)
        }
        const j = b(((e,t,r)=>{
            if (!i(r, e)) {
                const n = o(s(r, (e=>"string" == typeof e ? `'${e}'` : p(e))), ", ");
                throw new w(t,e,"must be one of: " + n)
            }
        }
        ));
        function P(e, t) {
            if ("boolean" != typeof e)
                throw new v(t,"boolean",e)
        }
        function I(e, t, r) {
            return null != e && f(e, t) ? e[t] : r
        }
        const C = b(((e,t,r=null)=>{
            const i = I(r, "allowArray", !1)
              , o = I(r, "allowFunction", !1);
            if (!I(r, "nullable", !1) && null === e || !i && n(e) || "object" != typeof e && (!o || "function" != typeof e))
                throw new v(t,"Object",e)
        }
        ))
          , L = b(((e,t)=>{
            if (null != e && "object" != typeof e && "function" != typeof e)
                throw new v(t,"a dictionary",e)
        }
        ))
          , D = b(((e,t,r=0)=>{
            if (!n(e))
                throw new v(t,"Array",e);
            if (e.length < r) {
                throw new w(t,e,`must be longer than ${r}`)
            }
        }
        ));
        const $ = b(((e,t="buffer")=>{
            if (!R(e))
                throw new v(t,["Buffer", "TypedArray", "DataView"],e)
        }
        ));
        const B = b(((e,t)=>{
            if (void 0 !== e && (null === e || "object" != typeof e || !("aborted"in e)))
                throw new v(t,"AbortSignal",e)
        }
        ))
          , F = b(((e,t)=>{
            if ("function" != typeof e)
                throw new v(t,"Function",e)
        }
        ))
          , U = b(((e,t)=>{
            if ("function" != typeof e || A(e))
                throw new v(t,"Function",e)
        }
        ))
          , W = b(((e,t)=>{
            if (void 0 !== e)
                throw new v(t,"undefined",e)
        }
        ));
        const V = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
        function H(e, t) {
            if (void 0 === e || !h(V, e))
                throw new w(t,e,'must be an array or string of format "</styles.css>; rel=preload; as=style"')
        }
        t.exports = {
            isInt32: function(e) {
                return e === (0 | e)
            },
            isUint32: function(e) {
                return e === e >>> 0
            },
            parseFileMode: function(e, t, r) {
                if (void 0 === e && (e = r),
                "string" == typeof e) {
                    if (null === h(T, e))
                        throw new w(t,e,"must be a 32-bit unsigned integer or an octal string");
                    e = d(e, 8)
                }
                return M(e, t),
                e
            },
            validateArray: D,
            validateStringArray: function(e, t) {
                D(e, t);
                for (let r = 0; r < e.length; r++)
                    N(e[r], `${t}[${r}]`)
            },
            validateBooleanArray: function(e, t) {
                D(e, t);
                for (let r = 0; r < e.length; r++)
                    P(e[r], `${t}[${r}]`)
            },
            validateBoolean: P,
            validateBuffer: $,
            validateDictionary: L,
            validateEncoding: function(e, t) {
                const r = S(t)
                  , n = e.length;
                if ("hex" === r && n % 2 != 0)
                    throw new w("encoding",t,`is invalid for data of length ${n}`)
            },
            validateFunction: F,
            validateInt32: k,
            validateInteger: O,
            validateNumber: function(e, t, r=void 0, n) {
                if ("number" != typeof e)
                    throw new v(t,"number",e);
                if (null != r && e < r || null != n && e > n || (null != r || null != n) && l(e))
                    throw new _(t,`${null != r ? `>= ${r}` : ""}${null != r && null != n ? " && " : ""}${null != n ? `<= ${n}` : ""}`,e)
            },
            validateObject: C,
            validateOneOf: j,
            validatePlainFunction: U,
            validatePort: function(e, t="Port", r=!0) {
                if ("number" != typeof e && "string" != typeof e || "string" == typeof e && 0 === m(e).length || +e != +e >>> 0 || e > 65535 || 0 === e && !r)
                    throw new y(t,e,r);
                return 0 | e
            },
            validateSignalName: function(e, t="signal") {
                if (N(e, t),
                void 0 === x[e]) {
                    if (void 0 !== x[g(e)])
                        throw new E(e + " (signals must use all capital letters)");
                    throw new E(e)
                }
            },
            validateString: N,
            validateUint32: M,
            validateUndefined: W,
            validateUnion: function(e, t, r) {
                if (!i(r, e))
                    throw new v(t,`('${o(r, "|")}')`,e)
            },
            validateAbortSignal: B,
            validateLinkHeaderValue: function(e) {
                if ("string" == typeof e)
                    return H(e, "hints"),
                    e;
                if (n(e)) {
                    const t = e.length;
                    let r = "";
                    if (0 === t)
                        return r;
                    for (let n = 0; n < t; n++) {
                        const i = e[n];
                        H(i, "hints"),
                        r += i,
                        n !== t - 1 && (r += ", ")
                    }
                    return r
                }
                throw new w("hints",e,'must be an array or string of format "</styles.css>; rel=preload; as=style"')
            }
        }
    }
    , {
        "../ours/errors": 151,
        "../ours/primordials": 152,
        "../ours/util": 153
    }],
    150: [function(e, t, r) {
        "use strict";
        const n = e("../stream")
          , i = e("../stream/promises")
          , o = n.Readable.destroy;
        t.exports = n.Readable,
        t.exports._uint8ArrayToBuffer = n._uint8ArrayToBuffer,
        t.exports._isUint8Array = n._isUint8Array,
        t.exports.isDisturbed = n.isDisturbed,
        t.exports.isErrored = n.isErrored,
        t.exports.isReadable = n.isReadable,
        t.exports.Readable = n.Readable,
        t.exports.Writable = n.Writable,
        t.exports.Duplex = n.Duplex,
        t.exports.Transform = n.Transform,
        t.exports.PassThrough = n.PassThrough,
        t.exports.addAbortSignal = n.addAbortSignal,
        t.exports.finished = n.finished,
        t.exports.destroy = n.destroy,
        t.exports.destroy = o,
        t.exports.pipeline = n.pipeline,
        t.exports.compose = n.compose,
        Object.defineProperty(n, "promises", {
            configurable: !0,
            enumerable: !0,
            get: ()=>i
        }),
        t.exports.Stream = n.Stream,
        t.exports.default = t.exports
    }
    , {
        "../stream": 154,
        "../stream/promises": 155
    }],
    151: [function(e, t, r) {
        "use strict";
        const {format: n, inspect: i, AggregateError: o} = e("./util")
          , s = globalThis.AggregateError || o
          , a = Symbol("kIsNodeError")
          , l = ["string", "function", "number", "object", "Function", "Object", "boolean", "bigint", "symbol"]
          , u = /^([A-Z][a-z0-9]*)+$/
          , c = {};
        function d(e, t) {
            if (!e)
                throw new c.ERR_INTERNAL_ASSERTION(t)
        }
        function f(e) {
            let t = ""
              , r = e.length;
            const n = "-" === e[0] ? 1 : 0;
            for (; r >= n + 4; r -= 3)
                t = `_${e.slice(r - 3, r)}${t}`;
            return `${e.slice(0, r)}${t}`
        }
        function h(e, t, r) {
            r || (r = Error);
            class i extends r {
                constructor(...r) {
                    super(function(e, t, r) {
                        if ("function" == typeof t)
                            return d(t.length <= r.length, `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${t.length}).`),
                            t(...r);
                        const i = (t.match(/%[dfijoOs]/g) || []).length;
                        return d(i === r.length, `Code: ${e}; The provided arguments length (${r.length}) does not match the required ones (${i}).`),
                        0 === r.length ? t : n(t, ...r)
                    }(e, t, r))
                }
                toString() {
                    return `${this.name} [${e}]: ${this.message}`
                }
            }
            Object.defineProperties(i.prototype, {
                name: {
                    value: r.name,
                    writable: !0,
                    enumerable: !1,
                    configurable: !0
                },
                toString: {
                    value() {
                        return `${this.name} [${e}]: ${this.message}`
                    },
                    writable: !0,
                    enumerable: !1,
                    configurable: !0
                }
            }),
            i.prototype.code = e,
            i.prototype[a] = !0,
            c[e] = i
        }
        function p(e) {
            const t = "__node_internal_" + e.name;
            return Object.defineProperty(e, "name", {
                value: t
            }),
            e
        }
        class g extends Error {
            constructor(e="The operation was aborted", t=void 0) {
                if (void 0 !== t && "object" != typeof t)
                    throw new c.ERR_INVALID_ARG_TYPE("options","Object",t);
                super(e, t),
                this.code = "ABORT_ERR",
                this.name = "AbortError"
            }
        }
        h("ERR_ASSERTION", "%s", Error),
        h("ERR_INVALID_ARG_TYPE", ((e,t,r)=>{
            d("string" == typeof e, "'name' must be a string"),
            Array.isArray(t) || (t = [t]);
            let n = "The ";
            e.endsWith(" argument") ? n += `${e} ` : n += `"${e}" ${e.includes(".") ? "property" : "argument"} `,
            n += "must be ";
            const o = []
              , s = []
              , a = [];
            for (const e of t)
                d("string" == typeof e, "All expected entries have to be of type string"),
                l.includes(e) ? o.push(e.toLowerCase()) : u.test(e) ? s.push(e) : (d("object" !== e, 'The value "object" should be written as "Object"'),
                a.push(e));
            if (s.length > 0) {
                const e = o.indexOf("object");
                -1 !== e && (o.splice(o, e, 1),
                s.push("Object"))
            }
            if (o.length > 0) {
                switch (o.length) {
                case 1:
                    n += `of type ${o[0]}`;
                    break;
                case 2:
                    n += `one of type ${o[0]} or ${o[1]}`;
                    break;
                default:
                    {
                        const e = o.pop();
                        n += `one of type ${o.join(", ")}, or ${e}`
                    }
                }
                (s.length > 0 || a.length > 0) && (n += " or ")
            }
            if (s.length > 0) {
                switch (s.length) {
                case 1:
                    n += `an instance of ${s[0]}`;
                    break;
                case 2:
                    n += `an instance of ${s[0]} or ${s[1]}`;
                    break;
                default:
                    {
                        const e = s.pop();
                        n += `an instance of ${s.join(", ")}, or ${e}`
                    }
                }
                a.length > 0 && (n += " or ")
            }
            switch (a.length) {
            case 0:
                break;
            case 1:
                a[0].toLowerCase() !== a[0] && (n += "an "),
                n += `${a[0]}`;
                break;
            case 2:
                n += `one of ${a[0]} or ${a[1]}`;
                break;
            default:
                {
                    const e = a.pop();
                    n += `one of ${a.join(", ")}, or ${e}`
                }
            }
            if (null == r)
                n += `. Received ${r}`;
            else if ("function" == typeof r && r.name)
                n += `. Received function ${r.name}`;
            else if ("object" == typeof r) {
                var c;
                if (null !== (c = r.constructor) && void 0 !== c && c.name)
                    n += `. Received an instance of ${r.constructor.name}`;
                else {
                    n += `. Received ${i(r, {
                        depth: -1
                    })}`
                }
            } else {
                let e = i(r, {
                    colors: !1
                });
                e.length > 25 && (e = `${e.slice(0, 25)}...`),
                n += `. Received type ${typeof r} (${e})`
            }
            return n
        }
        ), TypeError),
        h("ERR_INVALID_ARG_VALUE", ((e,t,r="is invalid")=>{
            let n = i(t);
            n.length > 128 && (n = n.slice(0, 128) + "...");
            return `The ${e.includes(".") ? "property" : "argument"} '${e}' ${r}. Received ${n}`
        }
        ), TypeError),
        h("ERR_INVALID_RETURN_VALUE", ((e,t,r)=>{
            var n;
            return `Expected ${e} to be returned from the "${t}" function but got ${null != r && null !== (n = r.constructor) && void 0 !== n && n.name ? `instance of ${r.constructor.name}` : "type " + typeof r}.`
        }
        ), TypeError),
        h("ERR_MISSING_ARGS", ((...e)=>{
            let t;
            d(e.length > 0, "At least one arg needs to be specified");
            const r = e.length;
            switch (e = (Array.isArray(e) ? e : [e]).map((e=>`"${e}"`)).join(" or "),
            r) {
            case 1:
                t += `The ${e[0]} argument`;
                break;
            case 2:
                t += `The ${e[0]} and ${e[1]} arguments`;
                break;
            default:
                {
                    const r = e.pop();
                    t += `The ${e.join(", ")}, and ${r} arguments`
                }
            }
            return `${t} must be specified`
        }
        ), TypeError),
        h("ERR_OUT_OF_RANGE", ((e,t,r)=>{
            let n;
            return d(t, 'Missing "range" argument'),
            Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? n = f(String(r)) : "bigint" == typeof r ? (n = String(r),
            (r > 2n ** 32n || r < -(2n ** 32n)) && (n = f(n)),
            n += "n") : n = i(r),
            `The value of "${e}" is out of range. It must be ${t}. Received ${n}`
        }
        ), RangeError),
        h("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error),
        h("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error),
        h("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error),
        h("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error),
        h("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error),
        h("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError),
        h("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error),
        h("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error),
        h("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error),
        h("ERR_STREAM_WRITE_AFTER_END", "write after end", Error),
        h("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError),
        t.exports = {
            AbortError: g,
            aggregateTwoErrors: p((function(e, t) {
                if (e && t && e !== t) {
                    if (Array.isArray(t.errors))
                        return t.errors.push(e),
                        t;
                    const r = new s([t, e],t.message);
                    return r.code = t.code,
                    r
                }
                return e || t
            }
            )),
            hideStackFrames: p,
            codes: c
        }
    }
    , {
        "./util": 153
    }],
    152: [function(e, t, r) {
        "use strict";
        t.exports = {
            ArrayIsArray: e=>Array.isArray(e),
            ArrayPrototypeIncludes: (e,t)=>e.includes(t),
            ArrayPrototypeIndexOf: (e,t)=>e.indexOf(t),
            ArrayPrototypeJoin: (e,t)=>e.join(t),
            ArrayPrototypeMap: (e,t)=>e.map(t),
            ArrayPrototypePop: (e,t)=>e.pop(t),
            ArrayPrototypePush: (e,t)=>e.push(t),
            ArrayPrototypeSlice: (e,t,r)=>e.slice(t, r),
            Error: Error,
            FunctionPrototypeCall: (e,t,...r)=>e.call(t, ...r),
            FunctionPrototypeSymbolHasInstance: (e,t)=>Function.prototype[Symbol.hasInstance].call(e, t),
            MathFloor: Math.floor,
            Number: Number,
            NumberIsInteger: Number.isInteger,
            NumberIsNaN: Number.isNaN,
            NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
            NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
            NumberParseInt: Number.parseInt,
            ObjectDefineProperties: (e,t)=>Object.defineProperties(e, t),
            ObjectDefineProperty: (e,t,r)=>Object.defineProperty(e, t, r),
            ObjectGetOwnPropertyDescriptor: (e,t)=>Object.getOwnPropertyDescriptor(e, t),
            ObjectKeys: e=>Object.keys(e),
            ObjectSetPrototypeOf: (e,t)=>Object.setPrototypeOf(e, t),
            Promise: Promise,
            PromisePrototypeCatch: (e,t)=>e.catch(t),
            PromisePrototypeThen: (e,t,r)=>e.then(t, r),
            PromiseReject: e=>Promise.reject(e),
            ReflectApply: Reflect.apply,
            RegExpPrototypeTest: (e,t)=>e.test(t),
            SafeSet: Set,
            String: String,
            StringPrototypeSlice: (e,t,r)=>e.slice(t, r),
            StringPrototypeToLowerCase: e=>e.toLowerCase(),
            StringPrototypeToUpperCase: e=>e.toUpperCase(),
            StringPrototypeTrim: e=>e.trim(),
            Symbol: Symbol,
            SymbolFor: Symbol.for,
            SymbolAsyncIterator: Symbol.asyncIterator,
            SymbolHasInstance: Symbol.hasInstance,
            SymbolIterator: Symbol.iterator,
            TypedArrayPrototypeSet: (e,t,r)=>e.set(t, r),
            Uint8Array: Uint8Array
        }
    }
    , {}],
    153: [function(e, t, r) {
        "use strict";
        const n = e("buffer")
          , i = Object.getPrototypeOf((async function() {}
        )).constructor
          , o = globalThis.Blob || n.Blob
          , s = void 0 !== o ? function(e) {
            return e instanceof o
        }
        : function(e) {
            return !1
        }
        ;
        class a extends Error {
            constructor(e) {
                if (!Array.isArray(e))
                    throw new TypeError("Expected input to be an Array, got " + typeof e);
                let t = "";
                for (let r = 0; r < e.length; r++)
                    t += `    ${e[r].stack}\n`;
                super(t),
                this.name = "AggregateError",
                this.errors = e
            }
        }
        t.exports = {
            AggregateError: a,
            kEmptyObject: Object.freeze({}),
            once(e) {
                let t = !1;
                return function(...r) {
                    t || (t = !0,
                    e.apply(this, r))
                }
            },
            createDeferredPromise: function() {
                let e, t;
                return {
                    promise: new Promise(((r,n)=>{
                        e = r,
                        t = n
                    }
                    )),
                    resolve: e,
                    reject: t
                }
            },
            promisify: e=>new Promise(((t,r)=>{
                e(((e,...n)=>e ? r(e) : t(...n)))
            }
            )),
            debuglog: ()=>function() {}
            ,
            format: (e,...t)=>e.replace(/%([sdifj])/g, (function(...[e,r]) {
                const n = t.shift();
                if ("f" === r)
                    return n.toFixed(6);
                if ("j" === r)
                    return JSON.stringify(n);
                if ("s" === r && "object" == typeof n) {
                    return `${n.constructor !== Object ? n.constructor.name : ""} {}`.trim()
                }
                return n.toString()
            }
            )),
            inspect(e) {
                switch (typeof e) {
                case "string":
                    if (e.includes("'")) {
                        if (!e.includes('"'))
                            return `"${e}"`;
                        if (!e.includes("`") && !e.includes("${"))
                            return `\`${e}\``
                    }
                    return `'${e}'`;
                case "number":
                    return isNaN(e) ? "NaN" : Object.is(e, -0) ? String(e) : e;
                case "bigint":
                    return `${String(e)}n`;
                case "boolean":
                case "undefined":
                    return String(e);
                case "object":
                    return "{}"
                }
            },
            types: {
                isAsyncFunction: e=>e instanceof i,
                isArrayBufferView: e=>ArrayBuffer.isView(e)
            },
            isBlob: s
        },
        t.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom")
    }
    , {
        buffer: 124
    }],
    154: [function(e, t, r) {
        const {Buffer: n} = e("buffer")
          , {ObjectDefineProperty: i, ObjectKeys: o, ReflectApply: s} = e("./ours/primordials")
          , {promisify: {custom: a}} = e("./ours/util")
          , {streamReturningOperators: l, promiseReturningOperators: u} = e("./internal/streams/operators")
          , {codes: {ERR_ILLEGAL_CONSTRUCTOR: c}} = e("./ours/errors")
          , d = e("./internal/streams/compose")
          , {pipeline: f} = e("./internal/streams/pipeline")
          , {destroyer: h} = e("./internal/streams/destroy")
          , p = e("./internal/streams/end-of-stream")
          , g = e("./stream/promises")
          , m = e("./internal/streams/utils")
          , b = t.exports = e("./internal/streams/legacy").Stream;
        b.isDisturbed = m.isDisturbed,
        b.isErrored = m.isErrored,
        b.isReadable = m.isReadable,
        b.Readable = e("./internal/streams/readable");
        for (const w of o(l)) {
            const _ = l[w];
            function y(...e) {
                if (new.target)
                    throw c();
                return b.Readable.from(s(_, this, e))
            }
            i(y, "name", {
                __proto__: null,
                value: _.name
            }),
            i(y, "length", {
                __proto__: null,
                value: _.length
            }),
            i(b.Readable.prototype, w, {
                __proto__: null,
                value: y,
                enumerable: !1,
                configurable: !0,
                writable: !0
            })
        }
        for (const E of o(u)) {
            const S = u[E];
            function y(...e) {
                if (new.target)
                    throw c();
                return s(S, this, e)
            }
            i(y, "name", {
                __proto__: null,
                value: S.name
            }),
            i(y, "length", {
                __proto__: null,
                value: S.length
            }),
            i(b.Readable.prototype, E, {
                __proto__: null,
                value: y,
                enumerable: !1,
                configurable: !0,
                writable: !0
            })
        }
        b.Writable = e("./internal/streams/writable"),
        b.Duplex = e("./internal/streams/duplex"),
        b.Transform = e("./internal/streams/transform"),
        b.PassThrough = e("./internal/streams/passthrough"),
        b.pipeline = f;
        const {addAbortSignal: v} = e("./internal/streams/add-abort-signal");
        b.addAbortSignal = v,
        b.finished = p,
        b.destroy = h,
        b.compose = d,
        i(b, "promises", {
            __proto__: null,
            configurable: !0,
            enumerable: !0,
            get: ()=>g
        }),
        i(f, a, {
            __proto__: null,
            enumerable: !0,
            get: ()=>g.pipeline
        }),
        i(p, a, {
            __proto__: null,
            enumerable: !0,
            get: ()=>g.finished
        }),
        b.Stream = b,
        b._isUint8Array = function(e) {
            return e instanceof Uint8Array
        }
        ,
        b._uint8ArrayToBuffer = function(e) {
            return n.from(e.buffer, e.byteOffset, e.byteLength)
        }
    }
    , {
        "./internal/streams/add-abort-signal": 132,
        "./internal/streams/compose": 134,
        "./internal/streams/destroy": 135,
        "./internal/streams/duplex": 136,
        "./internal/streams/end-of-stream": 138,
        "./internal/streams/legacy": 140,
        "./internal/streams/operators": 141,
        "./internal/streams/passthrough": 142,
        "./internal/streams/pipeline": 143,
        "./internal/streams/readable": 144,
        "./internal/streams/transform": 146,
        "./internal/streams/utils": 147,
        "./internal/streams/writable": 148,
        "./ours/errors": 151,
        "./ours/primordials": 152,
        "./ours/util": 153,
        "./stream/promises": 155,
        buffer: 124
    }],
    155: [function(e, t, r) {
        "use strict";
        const {ArrayPrototypePop: n, Promise: i} = e("../ours/primordials")
          , {isIterable: o, isNodeStream: s, isWebStream: a} = e("../internal/streams/utils")
          , {pipelineImpl: l} = e("../internal/streams/pipeline")
          , {finished: u} = e("../internal/streams/end-of-stream");
        e("../../lib/stream.js"),
        t.exports = {
            finished: u,
            pipeline: function(...e) {
                return new i(((t,r)=>{
                    let i, u;
                    const c = e[e.length - 1];
                    if (c && "object" == typeof c && !s(c) && !o(c) && !a(c)) {
                        const t = n(e);
                        i = t.signal,
                        u = t.end
                    }
                    l(e, ((e,n)=>{
                        e ? r(e) : t(n)
                    }
                    ), {
                        signal: i,
                        end: u
                    })
                }
                ))
            }
        }
    }
    , {
        "../../lib/stream.js": 154,
        "../internal/streams/end-of-stream": 138,
        "../internal/streams/pipeline": 143,
        "../internal/streams/utils": 147,
        "../ours/primordials": 152
    }],
    156: [function(e, t, r) {
        t.exports = l,
        l.default = l,
        l.stable = f,
        l.stableStringify = f;
        var n = "[...]"
          , i = "[Circular]"
          , o = []
          , s = [];
        function a() {
            return {
                depthLimit: Number.MAX_SAFE_INTEGER,
                edgesLimit: Number.MAX_SAFE_INTEGER
            }
        }
        function l(e, t, r, n) {
            var i;
            void 0 === n && (n = a()),
            c(e, "", 0, [], void 0, 0, n);
            try {
                i = 0 === s.length ? JSON.stringify(e, t, r) : JSON.stringify(e, p(t), r)
            } catch (e) {
                return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")
            } finally {
                for (; 0 !== o.length; ) {
                    var l = o.pop();
                    4 === l.length ? Object.defineProperty(l[0], l[1], l[3]) : l[0][l[1]] = l[2]
                }
            }
            return i
        }
        function u(e, t, r, n) {
            var i = Object.getOwnPropertyDescriptor(n, r);
            void 0 !== i.get ? i.configurable ? (Object.defineProperty(n, r, {
                value: e
            }),
            o.push([n, r, t, i])) : s.push([t, r, e]) : (n[r] = e,
            o.push([n, r, t]))
        }
        function c(e, t, r, o, s, a, l) {
            var d;
            if (a += 1,
            "object" == typeof e && null !== e) {
                for (d = 0; d < o.length; d++)
                    if (o[d] === e)
                        return void u(i, e, t, s);
                if (void 0 !== l.depthLimit && a > l.depthLimit)
                    return void u(n, e, t, s);
                if (void 0 !== l.edgesLimit && r + 1 > l.edgesLimit)
                    return void u(n, e, t, s);
                if (o.push(e),
                Array.isArray(e))
                    for (d = 0; d < e.length; d++)
                        c(e[d], d, d, o, e, a, l);
                else {
                    var f = Object.keys(e);
                    for (d = 0; d < f.length; d++) {
                        var h = f[d];
                        c(e[h], h, d, o, e, a, l)
                    }
                }
                o.pop()
            }
        }
        function d(e, t) {
            return e < t ? -1 : e > t ? 1 : 0
        }
        function f(e, t, r, n) {
            void 0 === n && (n = a());
            var i, l = h(e, "", 0, [], void 0, 0, n) || e;
            try {
                i = 0 === s.length ? JSON.stringify(l, t, r) : JSON.stringify(l, p(t), r)
            } catch (e) {
                return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")
            } finally {
                for (; 0 !== o.length; ) {
                    var u = o.pop();
                    4 === u.length ? Object.defineProperty(u[0], u[1], u[3]) : u[0][u[1]] = u[2]
                }
            }
            return i
        }
        function h(e, t, r, s, a, l, c) {
            var f;
            if (l += 1,
            "object" == typeof e && null !== e) {
                for (f = 0; f < s.length; f++)
                    if (s[f] === e)
                        return void u(i, e, t, a);
                try {
                    if ("function" == typeof e.toJSON)
                        return
                } catch (e) {
                    return
                }
                if (void 0 !== c.depthLimit && l > c.depthLimit)
                    return void u(n, e, t, a);
                if (void 0 !== c.edgesLimit && r + 1 > c.edgesLimit)
                    return void u(n, e, t, a);
                if (s.push(e),
                Array.isArray(e))
                    for (f = 0; f < e.length; f++)
                        h(e[f], f, f, s, e, l, c);
                else {
                    var p = {}
                      , g = Object.keys(e).sort(d);
                    for (f = 0; f < g.length; f++) {
                        var m = g[f];
                        h(e[m], m, f, s, e, l, c),
                        p[m] = e[m]
                    }
                    if (void 0 === a)
                        return p;
                    o.push([a, t, e]),
                    a[t] = p
                }
                s.pop()
            }
        }
        function p(e) {
            return e = void 0 !== e ? e : function(e, t) {
                return t
            }
            ,
            function(t, r) {
                if (s.length > 0)
                    for (var n = 0; n < s.length; n++) {
                        var i = s[n];
                        if (i[1] === t && i[0] === r) {
                            r = i[2],
                            s.splice(n, 1);
                            break
                        }
                    }
                return e.call(this, t, r)
            }
        }
    }
    , {}],
    157: [function(e, t, r) {
        "use strict";
        const n = e("./validator")
          , i = e("./xmlparser/XMLParser")
          , o = e("./xmlbuilder/json2xml");
        t.exports = {
            XMLParser: i,
            XMLValidator: n,
            XMLBuilder: o
        }
    }
    , {
        "./validator": 159,
        "./xmlbuilder/json2xml": 160,
        "./xmlparser/XMLParser": 165
    }],
    158: [function(e, t, r) {
        "use strict";
        const n = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD"
          , i = "[" + n + "][" + (n + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040") + "]*"
          , o = new RegExp("^" + i + "$");
        r.isExist = function(e) {
            return void 0 !== e
        }
        ,
        r.isEmptyObject = function(e) {
            return 0 === Object.keys(e).length
        }
        ,
        r.merge = function(e, t, r) {
            if (t) {
                const n = Object.keys(t)
                  , i = n.length;
                for (let o = 0; o < i; o++)
                    e[n[o]] = "strict" === r ? [t[n[o]]] : t[n[o]]
            }
        }
        ,
        r.getValue = function(e) {
            return r.isExist(e) ? e : ""
        }
        ,
        r.isName = function(e) {
            const t = o.exec(e);
            return !(null == t)
        }
        ,
        r.getAllMatches = function(e, t) {
            const r = [];
            let n = t.exec(e);
            for (; n; ) {
                const i = [];
                i.startIndex = t.lastIndex - n[0].length;
                const o = n.length;
                for (let e = 0; e < o; e++)
                    i.push(n[e]);
                r.push(i),
                n = t.exec(e)
            }
            return r
        }
        ,
        r.nameRegexp = i
    }
    , {}],
    159: [function(e, t, r) {
        "use strict";
        const n = e("./util")
          , i = {
            allowBooleanAttributes: !1,
            unpairedTags: []
        };
        function o(e) {
            return " " === e || "\t" === e || "\n" === e || "\r" === e
        }
        function s(e, t) {
            const r = t;
            for (; t < e.length; t++)
                if ("?" != e[t] && " " != e[t])
                    ;
                else {
                    const n = e.substr(r, t - r);
                    if (t > 5 && "xml" === n)
                        return p("InvalidXml", "XML declaration allowed only at the start of the document.", m(e, t));
                    if ("?" == e[t] && ">" == e[t + 1]) {
                        t++;
                        break
                    }
                }
            return t
        }
        function a(e, t) {
            if (e.length > t + 5 && "-" === e[t + 1] && "-" === e[t + 2]) {
                for (t += 3; t < e.length; t++)
                    if ("-" === e[t] && "-" === e[t + 1] && ">" === e[t + 2]) {
                        t += 2;
                        break
                    }
            } else if (e.length > t + 8 && "D" === e[t + 1] && "O" === e[t + 2] && "C" === e[t + 3] && "T" === e[t + 4] && "Y" === e[t + 5] && "P" === e[t + 6] && "E" === e[t + 7]) {
                let r = 1;
                for (t += 8; t < e.length; t++)
                    if ("<" === e[t])
                        r++;
                    else if (">" === e[t] && (r--,
                    0 === r))
                        break
            } else if (e.length > t + 9 && "[" === e[t + 1] && "C" === e[t + 2] && "D" === e[t + 3] && "A" === e[t + 4] && "T" === e[t + 5] && "A" === e[t + 6] && "[" === e[t + 7])
                for (t += 8; t < e.length; t++)
                    if ("]" === e[t] && "]" === e[t + 1] && ">" === e[t + 2]) {
                        t += 2;
                        break
                    }
            return t
        }
        r.validate = function(e, t) {
            t = Object.assign({}, i, t);
            const r = [];
            let l = !1
              , u = !1;
            "\ufeff" === e[0] && (e = e.substr(1));
            for (let i = 0; i < e.length; i++)
                if ("<" === e[i] && "?" === e[i + 1]) {
                    if (i += 2,
                    i = s(e, i),
                    i.err)
                        return i
                } else {
                    if ("<" !== e[i]) {
                        if (o(e[i]))
                            continue;
                        return p("InvalidChar", "char '" + e[i] + "' is not expected.", m(e, i))
                    }
                    {
                        let g = i;
                        if (i++,
                        "!" === e[i]) {
                            i = a(e, i);
                            continue
                        }
                        {
                            let b = !1;
                            "/" === e[i] && (b = !0,
                            i++);
                            let y = "";
                            for (; i < e.length && ">" !== e[i] && " " !== e[i] && "\t" !== e[i] && "\n" !== e[i] && "\r" !== e[i]; i++)
                                y += e[i];
                            if (y = y.trim(),
                            "/" === y[y.length - 1] && (y = y.substring(0, y.length - 1),
                            i--),
                            d = y,
                            !n.isName(d)) {
                                let t;
                                return t = 0 === y.trim().length ? "Invalid space after '<'." : "Tag '" + y + "' is an invalid name.",
                                p("InvalidTag", t, m(e, i))
                            }
                            const v = c(e, i);
                            if (!1 === v)
                                return p("InvalidAttr", "Attributes for '" + y + "' have open quote.", m(e, i));
                            let w = v.value;
                            if (i = v.index,
                            "/" === w[w.length - 1]) {
                                const r = i - w.length;
                                w = w.substring(0, w.length - 1);
                                const n = f(w, t);
                                if (!0 !== n)
                                    return p(n.err.code, n.err.msg, m(e, r + n.err.line));
                                l = !0
                            } else if (b) {
                                if (!v.tagClosed)
                                    return p("InvalidTag", "Closing tag '" + y + "' doesn't have proper closing.", m(e, i));
                                if (w.trim().length > 0)
                                    return p("InvalidTag", "Closing tag '" + y + "' can't have attributes or invalid starting.", m(e, g));
                                {
                                    const t = r.pop();
                                    if (y !== t.tagName) {
                                        let r = m(e, t.tagStartPos);
                                        return p("InvalidTag", "Expected closing tag '" + t.tagName + "' (opened in line " + r.line + ", col " + r.col + ") instead of closing tag '" + y + "'.", m(e, g))
                                    }
                                    0 == r.length && (u = !0)
                                }
                            } else {
                                const n = f(w, t);
                                if (!0 !== n)
                                    return p(n.err.code, n.err.msg, m(e, i - w.length + n.err.line));
                                if (!0 === u)
                                    return p("InvalidXml", "Multiple possible root nodes found.", m(e, i));
                                -1 !== t.unpairedTags.indexOf(y) || r.push({
                                    tagName: y,
                                    tagStartPos: g
                                }),
                                l = !0
                            }
                            for (i++; i < e.length; i++)
                                if ("<" === e[i]) {
                                    if ("!" === e[i + 1]) {
                                        i++,
                                        i = a(e, i);
                                        continue
                                    }
                                    if ("?" !== e[i + 1])
                                        break;
                                    if (i = s(e, ++i),
                                    i.err)
                                        return i
                                } else if ("&" === e[i]) {
                                    const t = h(e, i);
                                    if (-1 == t)
                                        return p("InvalidChar", "char '&' is not expected.", m(e, i));
                                    i = t
                                } else if (!0 === u && !o(e[i]))
                                    return p("InvalidXml", "Extra text at the end", m(e, i));
                            "<" === e[i] && i--
                        }
                    }
                }
            var d;
            return l ? 1 == r.length ? p("InvalidTag", "Unclosed tag '" + r[0].tagName + "'.", m(e, r[0].tagStartPos)) : !(r.length > 0) || p("InvalidXml", "Invalid '" + JSON.stringify(r.map((e=>e.tagName)), null, 4).replace(/\r?\n/g, "") + "' found.", {
                line: 1,
                col: 1
            }) : p("InvalidXml", "Start tag expected.", 1)
        }
        ;
        const l = '"'
          , u = "'";
        function c(e, t) {
            let r = ""
              , n = ""
              , i = !1;
            for (; t < e.length; t++) {
                if (e[t] === l || e[t] === u)
                    "" === n ? n = e[t] : n !== e[t] || (n = "");
                else if (">" === e[t] && "" === n) {
                    i = !0;
                    break
                }
                r += e[t]
            }
            return "" === n && {
                value: r,
                index: t,
                tagClosed: i
            }
        }
        const d = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?","g");
        function f(e, t) {
            const r = n.getAllMatches(e, d)
              , i = {};
            for (let e = 0; e < r.length; e++) {
                if (0 === r[e][1].length)
                    return p("InvalidAttr", "Attribute '" + r[e][2] + "' has no space in starting.", b(r[e]));
                if (void 0 !== r[e][3] && void 0 === r[e][4])
                    return p("InvalidAttr", "Attribute '" + r[e][2] + "' is without value.", b(r[e]));
                if (void 0 === r[e][3] && !t.allowBooleanAttributes)
                    return p("InvalidAttr", "boolean attribute '" + r[e][2] + "' is not allowed.", b(r[e]));
                const n = r[e][2];
                if (!g(n))
                    return p("InvalidAttr", "Attribute '" + n + "' is an invalid name.", b(r[e]));
                if (i.hasOwnProperty(n))
                    return p("InvalidAttr", "Attribute '" + n + "' is repeated.", b(r[e]));
                i[n] = 1
            }
            return !0
        }
        function h(e, t) {
            if (";" === e[++t])
                return -1;
            if ("#" === e[t])
                return function(e, t) {
                    let r = /\d/;
                    for ("x" === e[t] && (t++,
                    r = /[\da-fA-F]/); t < e.length; t++) {
                        if (";" === e[t])
                            return t;
                        if (!e[t].match(r))
                            break
                    }
                    return -1
                }(e, ++t);
            let r = 0;
            for (; t < e.length; t++,
            r++)
                if (!(e[t].match(/\w/) && r < 20)) {
                    if (";" === e[t])
                        break;
                    return -1
                }
            return t
        }
        function p(e, t, r) {
            return {
                err: {
                    code: e,
                    msg: t,
                    line: r.line || r,
                    col: r.col
                }
            }
        }
        function g(e) {
            return n.isName(e)
        }
        function m(e, t) {
            const r = e.substring(0, t).split(/\r?\n/);
            return {
                line: r.length,
                col: r[r.length - 1].length + 1
            }
        }
        function b(e) {
            return e.startIndex + e[1].length
        }
    }
    , {
        "./util": 158
    }],
    160: [function(e, t, r) {
        "use strict";
        const n = e("./orderedJs2Xml")
          , i = {
            attributeNamePrefix: "@_",
            attributesGroupName: !1,
            textNodeName: "#text",
            ignoreAttributes: !0,
            cdataPropName: !1,
            format: !1,
            indentBy: "  ",
            suppressEmptyNode: !1,
            suppressUnpairedNode: !0,
            suppressBooleanAttributes: !0,
            tagValueProcessor: function(e, t) {
                return t
            },
            attributeValueProcessor: function(e, t) {
                return t
            },
            preserveOrder: !1,
            commentPropName: !1,
            unpairedTags: [],
            entities: [{
                regex: new RegExp("&","g"),
                val: "&amp;"
            }, {
                regex: new RegExp(">","g"),
                val: "&gt;"
            }, {
                regex: new RegExp("<","g"),
                val: "&lt;"
            }, {
                regex: new RegExp("'","g"),
                val: "&apos;"
            }, {
                regex: new RegExp('"',"g"),
                val: "&quot;"
            }],
            processEntities: !0,
            stopNodes: [],
            oneListGroup: !1
        };
        function o(e) {
            this.options = Object.assign({}, i, e),
            this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function() {
                return !1
            }
            : (this.attrPrefixLen = this.options.attributeNamePrefix.length,
            this.isAttribute = l),
            this.processTextOrObjNode = s,
            this.options.format ? (this.indentate = a,
            this.tagEndChar = ">\n",
            this.newLine = "\n") : (this.indentate = function() {
                return ""
            }
            ,
            this.tagEndChar = ">",
            this.newLine = "")
        }
        function s(e, t, r) {
            const n = this.j2x(e, r + 1);
            return void 0 !== e[this.options.textNodeName] && 1 === Object.keys(e).length ? this.buildTextValNode(e[this.options.textNodeName], t, n.attrStr, r) : this.buildObjectNode(n.val, t, n.attrStr, r)
        }
        function a(e) {
            return this.options.indentBy.repeat(e)
        }
        function l(e) {
            return !(!e.startsWith(this.options.attributeNamePrefix) || e === this.options.textNodeName) && e.substr(this.attrPrefixLen)
        }
        o.prototype.build = function(e) {
            return this.options.preserveOrder ? n(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = {
                [this.options.arrayNodeName]: e
            }),
            this.j2x(e, 0).val)
        }
        ,
        o.prototype.j2x = function(e, t) {
            let r = ""
              , n = "";
            for (let i in e)
                if (Object.prototype.hasOwnProperty.call(e, i))
                    if (void 0 === e[i])
                        this.isAttribute(i) && (n += "");
                    else if (null === e[i])
                        this.isAttribute(i) ? n += "" : "?" === i[0] ? n += this.indentate(t) + "<" + i + "?" + this.tagEndChar : n += this.indentate(t) + "<" + i + "/" + this.tagEndChar;
                    else if (e[i]instanceof Date)
                        n += this.buildTextValNode(e[i], i, "", t);
                    else if ("object" != typeof e[i]) {
                        const o = this.isAttribute(i);
                        if (o)
                            r += this.buildAttrPairStr(o, "" + e[i]);
                        else if (i === this.options.textNodeName) {
                            let t = this.options.tagValueProcessor(i, "" + e[i]);
                            n += this.replaceEntitiesValue(t)
                        } else
                            n += this.buildTextValNode(e[i], i, "", t)
                    } else if (Array.isArray(e[i])) {
                        const r = e[i].length;
                        let o = "";
                        for (let s = 0; s < r; s++) {
                            const r = e[i][s];
                            void 0 === r || (null === r ? "?" === i[0] ? n += this.indentate(t) + "<" + i + "?" + this.tagEndChar : n += this.indentate(t) + "<" + i + "/" + this.tagEndChar : "object" == typeof r ? this.options.oneListGroup ? o += this.j2x(r, t + 1).val : o += this.processTextOrObjNode(r, i, t) : o += this.buildTextValNode(r, i, "", t))
                        }
                        this.options.oneListGroup && (o = this.buildObjectNode(o, i, "", t)),
                        n += o
                    } else if (this.options.attributesGroupName && i === this.options.attributesGroupName) {
                        const t = Object.keys(e[i])
                          , n = t.length;
                        for (let o = 0; o < n; o++)
                            r += this.buildAttrPairStr(t[o], "" + e[i][t[o]])
                    } else
                        n += this.processTextOrObjNode(e[i], i, t);
            return {
                attrStr: r,
                val: n
            }
        }
        ,
        o.prototype.buildAttrPairStr = function(e, t) {
            return t = this.options.attributeValueProcessor(e, "" + t),
            t = this.replaceEntitiesValue(t),
            this.options.suppressBooleanAttributes && "true" === t ? " " + e : " " + e + '="' + t + '"'
        }
        ,
        o.prototype.buildObjectNode = function(e, t, r, n) {
            if ("" === e)
                return "?" === t[0] ? this.indentate(n) + "<" + t + r + "?" + this.tagEndChar : this.indentate(n) + "<" + t + r + this.closeTag(t) + this.tagEndChar;
            {
                let i = "</" + t + this.tagEndChar
                  , o = "";
                return "?" === t[0] && (o = "?",
                i = ""),
                !r && "" !== r || -1 !== e.indexOf("<") ? !1 !== this.options.commentPropName && t === this.options.commentPropName && 0 === o.length ? this.indentate(n) + `\x3c!--${e}--\x3e` + this.newLine : this.indentate(n) + "<" + t + r + o + this.tagEndChar + e + this.indentate(n) + i : this.indentate(n) + "<" + t + r + o + ">" + e + i
            }
        }
        ,
        o.prototype.closeTag = function(e) {
            let t = "";
            return -1 !== this.options.unpairedTags.indexOf(e) ? this.options.suppressUnpairedNode || (t = "/") : t = this.options.suppressEmptyNode ? "/" : `></${e}`,
            t
        }
        ,
        o.prototype.buildTextValNode = function(e, t, r, n) {
            if (!1 !== this.options.cdataPropName && t === this.options.cdataPropName)
                return this.indentate(n) + `<![CDATA[${e}]]>` + this.newLine;
            if (!1 !== this.options.commentPropName && t === this.options.commentPropName)
                return this.indentate(n) + `\x3c!--${e}--\x3e` + this.newLine;
            if ("?" === t[0])
                return this.indentate(n) + "<" + t + r + "?" + this.tagEndChar;
            {
                let i = this.options.tagValueProcessor(t, e);
                return i = this.replaceEntitiesValue(i),
                "" === i ? this.indentate(n) + "<" + t + r + this.closeTag(t) + this.tagEndChar : this.indentate(n) + "<" + t + r + ">" + i + "</" + t + this.tagEndChar
            }
        }
        ,
        o.prototype.replaceEntitiesValue = function(e) {
            if (e && e.length > 0 && this.options.processEntities)
                for (let t = 0; t < this.options.entities.length; t++) {
                    const r = this.options.entities[t];
                    e = e.replace(r.regex, r.val)
                }
            return e
        }
        ,
        t.exports = o
    }
    , {
        "./orderedJs2Xml": 161
    }],
    161: [function(e, t, r) {
        function n(e, t, r, l) {
            let u = ""
              , c = !1;
            for (let d = 0; d < e.length; d++) {
                const f = e[d]
                  , h = i(f);
                if (void 0 === h)
                    continue;
                let p = "";
                if (p = 0 === r.length ? h : `${r}.${h}`,
                h === t.textNodeName) {
                    let e = f[h];
                    s(p, t) || (e = t.tagValueProcessor(h, e),
                    e = a(e, t)),
                    c && (u += l),
                    u += e,
                    c = !1;
                    continue
                }
                if (h === t.cdataPropName) {
                    c && (u += l),
                    u += `<![CDATA[${f[h][0][t.textNodeName]}]]>`,
                    c = !1;
                    continue
                }
                if (h === t.commentPropName) {
                    u += l + `\x3c!--${f[h][0][t.textNodeName]}--\x3e`,
                    c = !0;
                    continue
                }
                if ("?" === h[0]) {
                    const e = o(f[":@"], t)
                      , r = "?xml" === h ? "" : l;
                    let n = f[h][0][t.textNodeName];
                    n = 0 !== n.length ? " " + n : "",
                    u += r + `<${h}${n}${e}?>`,
                    c = !0;
                    continue
                }
                let g = l;
                "" !== g && (g += t.indentBy);
                const m = l + `<${h}${o(f[":@"], t)}`
                  , b = n(f[h], t, p, g);
                -1 !== t.unpairedTags.indexOf(h) ? t.suppressUnpairedNode ? u += m + ">" : u += m + "/>" : b && 0 !== b.length || !t.suppressEmptyNode ? b && b.endsWith(">") ? u += m + `>${b}${l}</${h}>` : (u += m + ">",
                b && "" !== l && (b.includes("/>") || b.includes("</")) ? u += l + t.indentBy + b + l : u += b,
                u += `</${h}>`) : u += m + "/>",
                c = !0
            }
            return u
        }
        function i(e) {
            const t = Object.keys(e);
            for (let r = 0; r < t.length; r++) {
                const n = t[r];
                if (e.hasOwnProperty(n) && ":@" !== n)
                    return n
            }
        }
        function o(e, t) {
            let r = "";
            if (e && !t.ignoreAttributes)
                for (let n in e) {
                    if (!e.hasOwnProperty(n))
                        continue;
                    let i = t.attributeValueProcessor(n, e[n]);
                    i = a(i, t),
                    !0 === i && t.suppressBooleanAttributes ? r += ` ${n.substr(t.attributeNamePrefix.length)}` : r += ` ${n.substr(t.attributeNamePrefix.length)}="${i}"`
                }
            return r
        }
        function s(e, t) {
            let r = (e = e.substr(0, e.length - t.textNodeName.length - 1)).substr(e.lastIndexOf(".") + 1);
            for (let n in t.stopNodes)
                if (t.stopNodes[n] === e || t.stopNodes[n] === "*." + r)
                    return !0;
            return !1
        }
        function a(e, t) {
            if (e && e.length > 0 && t.processEntities)
                for (let r = 0; r < t.entities.length; r++) {
                    const n = t.entities[r];
                    e = e.replace(n.regex, n.val)
                }
            return e
        }
        t.exports = function(e, t) {
            let r = "";
            return t.format && t.indentBy.length > 0 && (r = "\n"),
            n(e, t, "", r)
        }
    }
    , {}],
    162: [function(e, t, r) {
        const n = e("../util");
        function i(e, t) {
            let r = "";
            for (; t < e.length && "'" !== e[t] && '"' !== e[t]; t++)
                r += e[t];
            if (r = r.trim(),
            -1 !== r.indexOf(" "))
                throw new Error("External entites are not supported");
            const n = e[t++];
            let i = "";
            for (; t < e.length && e[t] !== n; t++)
                i += e[t];
            return [r, i, t]
        }
        function o(e, t) {
            return "!" === e[t + 1] && "-" === e[t + 2] && "-" === e[t + 3]
        }
        function s(e, t) {
            return "!" === e[t + 1] && "E" === e[t + 2] && "N" === e[t + 3] && "T" === e[t + 4] && "I" === e[t + 5] && "T" === e[t + 6] && "Y" === e[t + 7]
        }
        function a(e, t) {
            return "!" === e[t + 1] && "E" === e[t + 2] && "L" === e[t + 3] && "E" === e[t + 4] && "M" === e[t + 5] && "E" === e[t + 6] && "N" === e[t + 7] && "T" === e[t + 8]
        }
        function l(e, t) {
            return "!" === e[t + 1] && "A" === e[t + 2] && "T" === e[t + 3] && "T" === e[t + 4] && "L" === e[t + 5] && "I" === e[t + 6] && "S" === e[t + 7] && "T" === e[t + 8]
        }
        function u(e, t) {
            return "!" === e[t + 1] && "N" === e[t + 2] && "O" === e[t + 3] && "T" === e[t + 4] && "A" === e[t + 5] && "T" === e[t + 6] && "I" === e[t + 7] && "O" === e[t + 8] && "N" === e[t + 9]
        }
        function c(e) {
            if (n.isName(e))
                return e;
            throw new Error(`Invalid entity name ${e}`)
        }
        t.exports = function(e, t) {
            const r = {};
            if ("O" !== e[t + 3] || "C" !== e[t + 4] || "T" !== e[t + 5] || "Y" !== e[t + 6] || "P" !== e[t + 7] || "E" !== e[t + 8])
                throw new Error("Invalid Tag instead of DOCTYPE");
            {
                t += 9;
                let n = 1
                  , d = !1
                  , f = !1
                  , h = "";
                for (; t < e.length; t++)
                    if ("<" !== e[t] || f)
                        if (">" === e[t]) {
                            if (f ? "-" === e[t - 1] && "-" === e[t - 2] && (f = !1,
                            n--) : n--,
                            0 === n)
                                break
                        } else
                            "[" === e[t] ? d = !0 : h += e[t];
                    else {
                        if (d && s(e, t))
                            t += 7,
                            [entityName,val,t] = i(e, t + 1),
                            -1 === val.indexOf("&") && (r[c(entityName)] = {
                                regx: RegExp(`&${entityName};`, "g"),
                                val: val
                            });
                        else if (d && a(e, t))
                            t += 8;
                        else if (d && l(e, t))
                            t += 8;
                        else if (d && u(e, t))
                            t += 9;
                        else {
                            if (!o)
                                throw new Error("Invalid DOCTYPE");
                            f = !0
                        }
                        n++,
                        h = ""
                    }
                if (0 !== n)
                    throw new Error("Unclosed DOCTYPE")
            }
            return {
                entities: r,
                i: t
            }
        }
    }
    , {
        "../util": 158
    }],
    163: [function(e, t, r) {
        const n = {
            preserveOrder: !1,
            attributeNamePrefix: "@_",
            attributesGroupName: !1,
            textNodeName: "#text",
            ignoreAttributes: !0,
            removeNSPrefix: !1,
            allowBooleanAttributes: !1,
            parseTagValue: !0,
            parseAttributeValue: !1,
            trimValues: !0,
            cdataPropName: !1,
            numberParseOptions: {
                hex: !0,
                leadingZeros: !0,
                eNotation: !0
            },
            tagValueProcessor: function(e, t) {
                return t
            },
            attributeValueProcessor: function(e, t) {
                return t
            },
            stopNodes: [],
            alwaysCreateTextNode: !1,
            isArray: ()=>!1,
            commentPropName: !1,
            unpairedTags: [],
            processEntities: !0,
            htmlEntities: !1,
            ignoreDeclaration: !1,
            ignorePiTags: !1,
            transformTagName: !1,
            transformAttributeName: !1,
            updateTag: function(e, t, r) {
                return e
            }
        };
        r.buildOptions = function(e) {
            return Object.assign({}, n, e)
        }
        ,
        r.defaultOptions = n
    }
    , {}],
    164: [function(e, t, r) {
        "use strict";
        const n = e("../util")
          , i = e("./xmlNode")
          , o = e("./DocTypeReader")
          , s = e("strnum");
        function a(e) {
            const t = Object.keys(e);
            for (let r = 0; r < t.length; r++) {
                const n = t[r];
                this.lastEntities[n] = {
                    regex: new RegExp("&" + n + ";","g"),
                    val: e[n]
                }
            }
        }
        function l(e, t, r, n, i, o, s) {
            if (void 0 !== e && (this.options.trimValues && !n && (e = e.trim()),
            e.length > 0)) {
                s || (e = this.replaceEntitiesValue(e));
                const n = this.options.tagValueProcessor(t, e, r, i, o);
                if (null == n)
                    return e;
                if (typeof n != typeof e || n !== e)
                    return n;
                if (this.options.trimValues)
                    return w(e, this.options.parseTagValue, this.options.numberParseOptions);
                return e.trim() === e ? w(e, this.options.parseTagValue, this.options.numberParseOptions) : e
            }
        }
        function u(e) {
            if (this.options.removeNSPrefix) {
                const t = e.split(":")
                  , r = "/" === e.charAt(0) ? "/" : "";
                if ("xmlns" === t[0])
                    return "";
                2 === t.length && (e = r + t[1])
            }
            return e
        }
        const c = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?","gm");
        function d(e, t, r) {
            if (!this.options.ignoreAttributes && "string" == typeof e) {
                const r = n.getAllMatches(e, c)
                  , i = r.length
                  , o = {};
                for (let e = 0; e < i; e++) {
                    const n = this.resolveNameSpace(r[e][1]);
                    let i = r[e][4]
                      , s = this.options.attributeNamePrefix + n;
                    if (n.length)
                        if (this.options.transformAttributeName && (s = this.options.transformAttributeName(s)),
                        "__proto__" === s && (s = "#__proto__"),
                        void 0 !== i) {
                            this.options.trimValues && (i = i.trim()),
                            i = this.replaceEntitiesValue(i);
                            const e = this.options.attributeValueProcessor(n, i, t);
                            o[s] = null == e ? i : typeof e != typeof i || e !== i ? e : w(i, this.options.parseAttributeValue, this.options.numberParseOptions)
                        } else
                            this.options.allowBooleanAttributes && (o[s] = !0)
                }
                if (!Object.keys(o).length)
                    return;
                if (this.options.attributesGroupName) {
                    const e = {};
                    return e[this.options.attributesGroupName] = o,
                    e
                }
                return o
            }
        }
        const f = function(e) {
            e = e.replace(/\r\n?/g, "\n");
            const t = new i("!xml");
            let r = t
              , n = ""
              , s = "";
            for (let a = 0; a < e.length; a++) {
                if ("<" === e[a])
                    if ("/" === e[a + 1]) {
                        const t = b(e, ">", a, "Closing Tag is not closed.");
                        let i = e.substring(a + 2, t).trim();
                        if (this.options.removeNSPrefix) {
                            const e = i.indexOf(":");
                            -1 !== e && (i = i.substr(e + 1))
                        }
                        this.options.transformTagName && (i = this.options.transformTagName(i)),
                        r && (n = this.saveTextToParentTag(n, r, s));
                        const o = s.substring(s.lastIndexOf(".") + 1);
                        if (i && -1 !== this.options.unpairedTags.indexOf(i))
                            throw new Error(`Unpaired tag can not be used as closing tag: </${i}>`);
                        let l = 0;
                        o && -1 !== this.options.unpairedTags.indexOf(o) ? (l = s.lastIndexOf(".", s.lastIndexOf(".") - 1),
                        this.tagsNodeStack.pop()) : l = s.lastIndexOf("."),
                        s = s.substring(0, l),
                        r = this.tagsNodeStack.pop(),
                        n = "",
                        a = t
                    } else if ("?" === e[a + 1]) {
                        let t = y(e, a, !1, "?>");
                        if (!t)
                            throw new Error("Pi Tag is not closed.");
                        if (n = this.saveTextToParentTag(n, r, s),
                        this.options.ignoreDeclaration && "?xml" === t.tagName || this.options.ignorePiTags)
                            ;
                        else {
                            const e = new i(t.tagName);
                            e.add(this.options.textNodeName, ""),
                            t.tagName !== t.tagExp && t.attrExpPresent && (e[":@"] = this.buildAttributesMap(t.tagExp, s, t.tagName)),
                            this.addChild(r, e, s)
                        }
                        a = t.closeIndex + 1
                    } else if ("!--" === e.substr(a + 1, 3)) {
                        const t = b(e, "--\x3e", a + 4, "Comment is not closed.");
                        if (this.options.commentPropName) {
                            const i = e.substring(a + 4, t - 2);
                            n = this.saveTextToParentTag(n, r, s),
                            r.add(this.options.commentPropName, [{
                                [this.options.textNodeName]: i
                            }])
                        }
                        a = t
                    } else if ("!D" === e.substr(a + 1, 2)) {
                        const t = o(e, a);
                        this.docTypeEntities = t.entities,
                        a = t.i
                    } else if ("![" === e.substr(a + 1, 2)) {
                        const t = b(e, "]]>", a, "CDATA is not closed.") - 2
                          , i = e.substring(a + 9, t);
                        n = this.saveTextToParentTag(n, r, s);
                        let o = this.parseTextData(i, r.tagname, s, !0, !1, !0, !0);
                        null == o && (o = ""),
                        this.options.cdataPropName ? r.add(this.options.cdataPropName, [{
                            [this.options.textNodeName]: i
                        }]) : r.add(this.options.textNodeName, o),
                        a = t + 2
                    } else {
                        let o = y(e, a, this.options.removeNSPrefix)
                          , l = o.tagName;
                        const u = o.rawTagName;
                        let c = o.tagExp
                          , d = o.attrExpPresent
                          , f = o.closeIndex;
                        this.options.transformTagName && (l = this.options.transformTagName(l)),
                        r && n && "!xml" !== r.tagname && (n = this.saveTextToParentTag(n, r, s, !1));
                        const h = r;
                        if (h && -1 !== this.options.unpairedTags.indexOf(h.tagname) && (r = this.tagsNodeStack.pop(),
                        s = s.substring(0, s.lastIndexOf("."))),
                        l !== t.tagname && (s += s ? "." + l : l),
                        this.isItStopNode(this.options.stopNodes, s, l)) {
                            let t = "";
                            if (c.length > 0 && c.lastIndexOf("/") === c.length - 1)
                                a = o.closeIndex;
                            else if (-1 !== this.options.unpairedTags.indexOf(l))
                                a = o.closeIndex;
                            else {
                                const r = this.readStopNodeData(e, u, f + 1);
                                if (!r)
                                    throw new Error(`Unexpected end of ${u}`);
                                a = r.i,
                                t = r.tagContent
                            }
                            const n = new i(l);
                            l !== c && d && (n[":@"] = this.buildAttributesMap(c, s, l)),
                            t && (t = this.parseTextData(t, l, s, !0, d, !0, !0)),
                            s = s.substr(0, s.lastIndexOf(".")),
                            n.add(this.options.textNodeName, t),
                            this.addChild(r, n, s)
                        } else {
                            if (c.length > 0 && c.lastIndexOf("/") === c.length - 1) {
                                "/" === l[l.length - 1] ? (l = l.substr(0, l.length - 1),
                                s = s.substr(0, s.length - 1),
                                c = l) : c = c.substr(0, c.length - 1),
                                this.options.transformTagName && (l = this.options.transformTagName(l));
                                const e = new i(l);
                                l !== c && d && (e[":@"] = this.buildAttributesMap(c, s, l)),
                                this.addChild(r, e, s),
                                s = s.substr(0, s.lastIndexOf("."))
                            } else {
                                const e = new i(l);
                                this.tagsNodeStack.push(r),
                                l !== c && d && (e[":@"] = this.buildAttributesMap(c, s, l)),
                                this.addChild(r, e, s),
                                r = e
                            }
                            n = "",
                            a = f
                        }
                    }
                else
                    n += e[a]
            }
            return t.child
        };
        function h(e, t, r) {
            const n = this.options.updateTag(t.tagname, r, t[":@"]);
            !1 === n || ("string" == typeof n ? (t.tagname = n,
            e.addChild(t)) : e.addChild(t))
        }
        const p = function(e) {
            if (this.options.processEntities) {
                for (let t in this.docTypeEntities) {
                    const r = this.docTypeEntities[t];
                    e = e.replace(r.regx, r.val)
                }
                for (let t in this.lastEntities) {
                    const r = this.lastEntities[t];
                    e = e.replace(r.regex, r.val)
                }
                if (this.options.htmlEntities)
                    for (let t in this.htmlEntities) {
                        const r = this.htmlEntities[t];
                        e = e.replace(r.regex, r.val)
                    }
                e = e.replace(this.ampEntity.regex, this.ampEntity.val)
            }
            return e
        };
        function g(e, t, r, n) {
            return e && (void 0 === n && (n = 0 === Object.keys(t.child).length),
            void 0 !== (e = this.parseTextData(e, t.tagname, r, !1, !!t[":@"] && 0 !== Object.keys(t[":@"]).length, n)) && "" !== e && t.add(this.options.textNodeName, e),
            e = ""),
            e
        }
        function m(e, t, r) {
            const n = "*." + r;
            for (const r in e) {
                const i = e[r];
                if (n === i || t === i)
                    return !0
            }
            return !1
        }
        function b(e, t, r, n) {
            const i = e.indexOf(t, r);
            if (-1 === i)
                throw new Error(n);
            return i + t.length - 1
        }
        function y(e, t, r, n=">") {
            const i = function(e, t, r=">") {
                let n, i = "";
                for (let o = t; o < e.length; o++) {
                    let t = e[o];
                    if (n)
                        t === n && (n = "");
                    else if ('"' === t || "'" === t)
                        n = t;
                    else if (t === r[0]) {
                        if (!r[1])
                            return {
                                data: i,
                                index: o
                            };
                        if (e[o + 1] === r[1])
                            return {
                                data: i,
                                index: o
                            }
                    } else
                        "\t" === t && (t = " ");
                    i += t
                }
            }(e, t + 1, n);
            if (!i)
                return;
            let o = i.data;
            const s = i.index
              , a = o.search(/\s/);
            let l = o
              , u = !0;
            -1 !== a && (l = o.substring(0, a),
            o = o.substring(a + 1).trimStart());
            const c = l;
            if (r) {
                const e = l.indexOf(":");
                -1 !== e && (l = l.substr(e + 1),
                u = l !== i.data.substr(e + 1))
            }
            return {
                tagName: l,
                tagExp: o,
                closeIndex: s,
                attrExpPresent: u,
                rawTagName: c
            }
        }
        function v(e, t, r) {
            const n = r;
            let i = 1;
            for (; r < e.length; r++)
                if ("<" === e[r])
                    if ("/" === e[r + 1]) {
                        const o = b(e, ">", r, `${t} is not closed`);
                        if (e.substring(r + 2, o).trim() === t && (i--,
                        0 === i))
                            return {
                                tagContent: e.substring(n, r),
                                i: o
                            };
                        r = o
                    } else if ("?" === e[r + 1]) {
                        r = b(e, "?>", r + 1, "StopNode is not closed.")
                    } else if ("!--" === e.substr(r + 1, 3)) {
                        r = b(e, "--\x3e", r + 3, "StopNode is not closed.")
                    } else if ("![" === e.substr(r + 1, 2)) {
                        r = b(e, "]]>", r, "StopNode is not closed.") - 2
                    } else {
                        const n = y(e, r, ">");
                        if (n) {
                            (n && n.tagName) === t && "/" !== n.tagExp[n.tagExp.length - 1] && i++,
                            r = n.closeIndex
                        }
                    }
        }
        function w(e, t, r) {
            if (t && "string" == typeof e) {
                const t = e.trim();
                return "true" === t || "false" !== t && s(e, r)
            }
            return n.isExist(e) ? e : ""
        }
        t.exports = class {
            constructor(e) {
                this.options = e,
                this.currentNode = null,
                this.tagsNodeStack = [],
                this.docTypeEntities = {},
                this.lastEntities = {
                    apos: {
                        regex: /&(apos|#39|#x27);/g,
                        val: "'"
                    },
                    gt: {
                        regex: /&(gt|#62|#x3E);/g,
                        val: ">"
                    },
                    lt: {
                        regex: /&(lt|#60|#x3C);/g,
                        val: "<"
                    },
                    quot: {
                        regex: /&(quot|#34|#x22);/g,
                        val: '"'
                    }
                },
                this.ampEntity = {
                    regex: /&(amp|#38|#x26);/g,
                    val: "&"
                },
                this.htmlEntities = {
                    space: {
                        regex: /&(nbsp|#160);/g,
                        val: " "
                    },
                    cent: {
                        regex: /&(cent|#162);/g,
                        val: "¢"
                    },
                    pound: {
                        regex: /&(pound|#163);/g,
                        val: "£"
                    },
                    yen: {
                        regex: /&(yen|#165);/g,
                        val: "¥"
                    },
                    euro: {
                        regex: /&(euro|#8364);/g,
                        val: "€"
                    },
                    copyright: {
                        regex: /&(copy|#169);/g,
                        val: "©"
                    },
                    reg: {
                        regex: /&(reg|#174);/g,
                        val: "®"
                    },
                    inr: {
                        regex: /&(inr|#8377);/g,
                        val: "₹"
                    }
                },
                this.addExternalEntities = a,
                this.parseXml = f,
                this.parseTextData = l,
                this.resolveNameSpace = u,
                this.buildAttributesMap = d,
                this.isItStopNode = m,
                this.replaceEntitiesValue = p,
                this.readStopNodeData = v,
                this.saveTextToParentTag = g,
                this.addChild = h
            }
        }
    }
    , {
        "../util": 158,
        "./DocTypeReader": 162,
        "./xmlNode": 167,
        strnum: 239
    }],
    165: [function(e, t, r) {
        const {buildOptions: n} = e("./OptionsBuilder")
          , i = e("./OrderedObjParser")
          , {prettify: o} = e("./node2json")
          , s = e("../validator");
        t.exports = class {
            constructor(e) {
                this.externalEntities = {},
                this.options = n(e)
            }
            parse(e, t) {
                if ("string" == typeof e)
                    ;
                else {
                    if (!e.toString)
                        throw new Error("XML data is accepted in String or Bytes[] form.");
                    e = e.toString()
                }
                if (t) {
                    !0 === t && (t = {});
                    const r = s.validate(e, t);
                    if (!0 !== r)
                        throw Error(`${r.err.msg}:${r.err.line}:${r.err.col}`)
                }
                const r = new i(this.options);
                r.addExternalEntities(this.externalEntities);
                const n = r.parseXml(e);
                return this.options.preserveOrder || void 0 === n ? n : o(n, this.options)
            }
            addEntity(e, t) {
                if (-1 !== t.indexOf("&"))
                    throw new Error("Entity value can't have '&'");
                if (-1 !== e.indexOf("&") || -1 !== e.indexOf(";"))
                    throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
                if ("&" === t)
                    throw new Error("An entity with value '&' is not permitted");
                this.externalEntities[e] = t
            }
        }
    }
    , {
        "../validator": 159,
        "./OptionsBuilder": 163,
        "./OrderedObjParser": 164,
        "./node2json": 166
    }],
    166: [function(e, t, r) {
        "use strict";
        function n(e, t, r) {
            let a;
            const l = {};
            for (let u = 0; u < e.length; u++) {
                const c = e[u]
                  , d = i(c);
                let f = "";
                if (f = void 0 === r ? d : r + "." + d,
                d === t.textNodeName)
                    void 0 === a ? a = c[d] : a += "" + c[d];
                else {
                    if (void 0 === d)
                        continue;
                    if (c[d]) {
                        let e = n(c[d], t, f);
                        const r = s(e, t);
                        c[":@"] ? o(e, c[":@"], f, t) : 1 !== Object.keys(e).length || void 0 === e[t.textNodeName] || t.alwaysCreateTextNode ? 0 === Object.keys(e).length && (t.alwaysCreateTextNode ? e[t.textNodeName] = "" : e = "") : e = e[t.textNodeName],
                        void 0 !== l[d] && l.hasOwnProperty(d) ? (Array.isArray(l[d]) || (l[d] = [l[d]]),
                        l[d].push(e)) : t.isArray(d, f, r) ? l[d] = [e] : l[d] = e
                    }
                }
            }
            return "string" == typeof a ? a.length > 0 && (l[t.textNodeName] = a) : void 0 !== a && (l[t.textNodeName] = a),
            l
        }
        function i(e) {
            const t = Object.keys(e);
            for (let e = 0; e < t.length; e++) {
                const r = t[e];
                if (":@" !== r)
                    return r
            }
        }
        function o(e, t, r, n) {
            if (t) {
                const i = Object.keys(t)
                  , o = i.length;
                for (let s = 0; s < o; s++) {
                    const o = i[s];
                    n.isArray(o, r + "." + o, !0, !0) ? e[o] = [t[o]] : e[o] = t[o]
                }
            }
        }
        function s(e, t) {
            const {textNodeName: r} = t
              , n = Object.keys(e).length;
            return 0 === n || !(1 !== n || !e[r] && "boolean" != typeof e[r] && 0 !== e[r])
        }
        r.prettify = function(e, t) {
            return n(e, t)
        }
    }
    , {}],
    167: [function(e, t, r) {
        "use strict";
        t.exports = class {
            constructor(e) {
                this.tagname = e,
                this.child = [],
                this[":@"] = {}
            }
            add(e, t) {
                "__proto__" === e && (e = "#__proto__"),
                this.child.push({
                    [e]: t
                })
            }
            addChild(e) {
                "__proto__" === e.tagname && (e.tagname = "#__proto__"),
                e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({
                    [e.tagname]: e.child,
                    ":@": e[":@"]
                }) : this.child.push({
                    [e.tagname]: e.child
                })
            }
        }
    }
    , {}],
    168: [function(e, t, r) {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        r.read = function(e, t, r, n, i) {
            var o, s, a = 8 * i - n - 1, l = (1 << a) - 1, u = l >> 1, c = -7, d = r ? i - 1 : 0, f = r ? -1 : 1, h = e[t + d];
            for (d += f,
            o = h & (1 << -c) - 1,
            h >>= -c,
            c += a; c > 0; o = 256 * o + e[t + d],
            d += f,
            c -= 8)
                ;
            for (s = o & (1 << -c) - 1,
            o >>= -c,
            c += n; c > 0; s = 256 * s + e[t + d],
            d += f,
            c -= 8)
                ;
            if (0 === o)
                o = 1 - u;
            else {
                if (o === l)
                    return s ? NaN : 1 / 0 * (h ? -1 : 1);
                s += Math.pow(2, n),
                o -= u
            }
            return (h ? -1 : 1) * s * Math.pow(2, o - n)
        }
        ,
        r.write = function(e, t, r, n, i, o) {
            var s, a, l, u = 8 * o - i - 1, c = (1 << u) - 1, d = c >> 1, f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = n ? 0 : o - 1, p = n ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t),
            isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0,
            s = c) : (s = Math.floor(Math.log(t) / Math.LN2),
            t * (l = Math.pow(2, -s)) < 1 && (s--,
            l *= 2),
            (t += s + d >= 1 ? f / l : f * Math.pow(2, 1 - d)) * l >= 2 && (s++,
            l /= 2),
            s + d >= c ? (a = 0,
            s = c) : s + d >= 1 ? (a = (t * l - 1) * Math.pow(2, i),
            s += d) : (a = t * Math.pow(2, d - 1) * Math.pow(2, i),
            s = 0)); i >= 8; e[r + h] = 255 & a,
            h += p,
            a /= 256,
            i -= 8)
                ;
            for (s = s << i | a,
            u += i; u > 0; e[r + h] = 255 & s,
            h += p,
            s /= 256,
            u -= 8)
                ;
            e[r + h - p] |= 128 * g
        }
    }
    , {}],
    169: [function(e, t, r) {
        "function" == typeof Object.create ? t.exports = function(e, t) {
            t && (e.super_ = t,
            e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }))
        }
        : t.exports = function(e, t) {
            if (t) {
                e.super_ = t;
                var r = function() {};
                r.prototype = t.prototype,
                e.prototype = new r,
                e.prototype.constructor = e
            }
        }
    }
    , {}],
    170: [function(e, t, r) {
        function n(e) {
            return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
        }
        /*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
        t.exports = function(e) {
            return null != e && (n(e) || function(e) {
                return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
            }(e) || !!e._isBuffer)
        }
    }
    , {}],
    171: [function(e, t, r) {
        !function(e, r) {
            "use strict";
            "function" == typeof define && define.amd ? define(r) : "object" == typeof t && t.exports ? t.exports = r() : e.log = r()
        }(this, (function() {
            "use strict";
            var e = function() {}
              , t = "undefined"
              , r = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent)
              , n = ["trace", "debug", "info", "warn", "error"];
            function i(e, t) {
                var r = e[t];
                if ("function" == typeof r.bind)
                    return r.bind(e);
                try {
                    return Function.prototype.bind.call(r, e)
                } catch (t) {
                    return function() {
                        return Function.prototype.apply.apply(r, [e, arguments])
                    }
                }
            }
            function o() {
                console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])),
                console.trace && console.trace()
            }
            function s(t, r) {
                for (var i = 0; i < n.length; i++) {
                    var o = n[i];
                    this[o] = i < t ? e : this.methodFactory(o, t, r)
                }
                this.log = this.debug
            }
            function a(e, r, n) {
                return function() {
                    typeof console !== t && (s.call(this, r, n),
                    this[e].apply(this, arguments))
                }
            }
            function l(n, s, l) {
                return function(n) {
                    return "debug" === n && (n = "log"),
                    typeof console !== t && ("trace" === n && r ? o : void 0 !== console[n] ? i(console, n) : void 0 !== console.log ? i(console, "log") : e)
                }(n) || a.apply(this, arguments)
            }
            function u(e, r, i) {
                var o, a = this;
                r = null == r ? "WARN" : r;
                var u = "loglevel";
                function c() {
                    var e;
                    if (typeof window !== t && u) {
                        try {
                            e = window.localStorage[u]
                        } catch (e) {}
                        if (typeof e === t)
                            try {
                                var r = window.document.cookie
                                  , n = r.indexOf(encodeURIComponent(u) + "=");
                                -1 !== n && (e = /^([^;]+)/.exec(r.slice(n))[1])
                            } catch (e) {}
                        return void 0 === a.levels[e] && (e = void 0),
                        e
                    }
                }
                "string" == typeof e ? u += ":" + e : "symbol" == typeof e && (u = void 0),
                a.name = e,
                a.levels = {
                    TRACE: 0,
                    DEBUG: 1,
                    INFO: 2,
                    WARN: 3,
                    ERROR: 4,
                    SILENT: 5
                },
                a.methodFactory = i || l,
                a.getLevel = function() {
                    return o
                }
                ,
                a.setLevel = function(r, i) {
                    if ("string" == typeof r && void 0 !== a.levels[r.toUpperCase()] && (r = a.levels[r.toUpperCase()]),
                    !("number" == typeof r && r >= 0 && r <= a.levels.SILENT))
                        throw "log.setLevel() called with invalid level: " + r;
                    if (o = r,
                    !1 !== i && function(e) {
                        var r = (n[e] || "silent").toUpperCase();
                        if (typeof window !== t && u) {
                            try {
                                return void (window.localStorage[u] = r)
                            } catch (e) {}
                            try {
                                window.document.cookie = encodeURIComponent(u) + "=" + r + ";"
                            } catch (e) {}
                        }
                    }(r),
                    s.call(a, r, e),
                    typeof console === t && r < a.levels.SILENT)
                        return "No console available for logging"
                }
                ,
                a.setDefaultLevel = function(e) {
                    r = e,
                    c() || a.setLevel(e, !1)
                }
                ,
                a.resetLevel = function() {
                    a.setLevel(r, !1),
                    function() {
                        if (typeof window !== t && u) {
                            try {
                                return void window.localStorage.removeItem(u)
                            } catch (e) {}
                            try {
                                window.document.cookie = encodeURIComponent(u) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
                            } catch (e) {}
                        }
                    }()
                }
                ,
                a.enableAll = function(e) {
                    a.setLevel(a.levels.TRACE, e)
                }
                ,
                a.disableAll = function(e) {
                    a.setLevel(a.levels.SILENT, e)
                }
                ;
                var d = c();
                null == d && (d = r),
                a.setLevel(d, !1)
            }
            var c = new u
              , d = {};
            c.getLogger = function(e) {
                if ("symbol" != typeof e && "string" != typeof e || "" === e)
                    throw new TypeError("You must supply a name when creating a logger.");
                var t = d[e];
                return t || (t = d[e] = new u(e,c.getLevel(),c.methodFactory)),
                t
            }
            ;
            var f = typeof window !== t ? window.log : void 0;
            return c.noConflict = function() {
                return typeof window !== t && window.log === c && (window.log = f),
                c
            }
            ,
            c.getLoggers = function() {
                return d
            }
            ,
            c.default = c,
            c
        }
        ))
    }
    , {}],
    172: [function(e, t, r) {
        const {Duplex: n} = e("readable-stream")
          , i = e("end-of-stream")
          , o = e("once")
          , s = {};
        class a extends n {
            constructor({parent: e, name: t}) {
                super({
                    objectMode: !0
                }),
                this._parent = e,
                this._name = t
            }
            _read() {}
            _write(e, t, r) {
                this._parent.push({
                    name: this._name,
                    data: e
                }),
                r()
            }
        }
        t.exports = class extends n {
            constructor(e={}) {
                super(Object.assign({}, e, {
                    objectMode: !0
                })),
                this._substreams = {}
            }
            createStream(e) {
                if (!e)
                    throw new Error("ObjectMultiplex - name must not be empty");
                if (this._substreams[e])
                    throw new Error('ObjectMultiplex - Substream for name "${name}" already exists');
                const t = new a({
                    parent: this,
                    name: e
                });
                return this._substreams[e] = t,
                function(e, t) {
                    const r = o(t);
                    i(e, {
                        readable: !1
                    }, r),
                    i(e, {
                        writable: !1
                    }, r)
                }(this, (e=>{
                    t.destroy(e)
                }
                )),
                t
            }
            ignoreStream(e) {
                if (!e)
                    throw new Error("ObjectMultiplex - name must not be empty");
                if (this._substreams[e])
                    throw new Error('ObjectMultiplex - Substream for name "${name}" already exists');
                this._substreams[e] = s
            }
            _read() {}
            _write(e, t, r) {
                const n = e.name
                  , i = e.data;
                if (!n)
                    return console.warn(`ObjectMultiplex - malformed chunk without name "${e}"`),
                    r();
                const o = this._substreams[n];
                if (!o)
                    return console.warn(`ObjectMultiplex - orphaned data for stream "${n}"`),
                    r();
                o !== s && o.push(i),
                r()
            }
        }
    }
    , {
        "end-of-stream": 129,
        once: 173,
        "readable-stream": 191
    }],
    173: [function(e, t, r) {
        var n = e("wrappy");
        function i(e) {
            var t = function() {
                return t.called ? t.value : (t.called = !0,
                t.value = e.apply(this, arguments))
            };
            return t.called = !1,
            t
        }
        function o(e) {
            var t = function() {
                if (t.called)
                    throw new Error(t.onceError);
                return t.called = !0,
                t.value = e.apply(this, arguments)
            }
              , r = e.name || "Function wrapped with `once`";
            return t.onceError = r + " shouldn't be called more than once",
            t.called = !1,
            t
        }
        t.exports = n(i),
        t.exports.strict = n(o),
        i.proto = i((function() {
            Object.defineProperty(Function.prototype, "once", {
                value: function() {
                    return i(this)
                },
                configurable: !0
            }),
            Object.defineProperty(Function.prototype, "onceStrict", {
                value: function() {
                    return o(this)
                },
                configurable: !0
            })
        }
        ))
    }
    , {
        wrappy: 260
    }],
    174: [function(e, t, r) {
        "use strict";
        const {ErrorWithCause: n} = e("./lib/error-with-cause")
          , {findCauseByReference: i, getErrorCause: o, messageWithCauses: s, stackWithCauses: a} = e("./lib/helpers");
        t.exports = {
            ErrorWithCause: n,
            findCauseByReference: i,
            getErrorCause: o,
            stackWithCauses: a,
            messageWithCauses: s
        }
    }
    , {
        "./lib/error-with-cause": 175,
        "./lib/helpers": 176
    }],
    175: [function(e, t, r) {
        "use strict";
        class n extends Error {
            constructor(e, {cause: t}={}) {
                super(e),
                this.name = n.name,
                t && (this.cause = t),
                this.message = e
            }
        }
        t.exports = {
            ErrorWithCause: n
        }
    }
    , {}],
    176: [function(e, t, r) {
        "use strict";
        const n = e=>{
            if (e && "object" == typeof e && "cause"in e) {
                if ("function" == typeof e.cause) {
                    const t = e.cause();
                    return t instanceof Error ? t : void 0
                }
                return e.cause instanceof Error ? e.cause : void 0
            }
        }
          , i = (e,t)=>{
            if (!(e instanceof Error))
                return "";
            const r = e.stack || "";
            if (t.has(e))
                return r + "\ncauses have become circular...";
            const o = n(e);
            return o ? (t.add(e),
            r + "\ncaused by: " + i(o, t)) : r
        }
          , o = (e,t,r)=>{
            if (!(e instanceof Error))
                return "";
            const i = r ? "" : e.message || "";
            if (t.has(e))
                return i + ": ...";
            const s = n(e);
            if (s) {
                t.add(e);
                const r = "cause"in e && "function" == typeof e.cause;
                return i + (r ? "" : ": ") + o(s, t, r)
            }
            return i
        }
        ;
        t.exports = {
            findCauseByReference: (e,t)=>{
                if (!e || !t)
                    return;
                if (!(e instanceof Error))
                    return;
                if (!(t.prototype instanceof Error) && t !== Error)
                    return;
                const r = new Set;
                let i = e;
                for (; i && !r.has(i); ) {
                    if (r.add(i),
                    i instanceof t)
                        return i;
                    i = n(i)
                }
            }
            ,
            getErrorCause: n,
            stackWithCauses: e=>i(e, new Set),
            messageWithCauses: e=>o(e, new Set)
        }
    }
    , {}],
    177: [function(e, t, r) {
        (function(e) {
            (function() {
                "use strict";
                void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
                    nextTick: function(t, r, n, i) {
                        if ("function" != typeof t)
                            throw new TypeError('"callback" argument must be a function');
                        var o, s, a = arguments.length;
                        switch (a) {
                        case 0:
                        case 1:
                            return e.nextTick(t);
                        case 2:
                            return e.nextTick((function() {
                                t.call(null, r)
                            }
                            ));
                        case 3:
                            return e.nextTick((function() {
                                t.call(null, r, n)
                            }
                            ));
                        case 4:
                            return e.nextTick((function() {
                                t.call(null, r, n, i)
                            }
                            ));
                        default:
                            for (o = new Array(a - 1),
                            s = 0; s < o.length; )
                                o[s++] = arguments[s];
                            return e.nextTick((function() {
                                t.apply(null, o)
                            }
                            ))
                        }
                    }
                } : t.exports = e
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178
    }],
    178: [function(e, t, r) {
        var n, i, o = t.exports = {};
        function s() {
            throw new Error("setTimeout has not been defined")
        }
        function a() {
            throw new Error("clearTimeout has not been defined")
        }
        function l(e) {
            if (n === setTimeout)
                return setTimeout(e, 0);
            if ((n === s || !n) && setTimeout)
                return n = setTimeout,
                setTimeout(e, 0);
            try {
                return n(e, 0)
            } catch (t) {
                try {
                    return n.call(null, e, 0)
                } catch (t) {
                    return n.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                n = "function" == typeof setTimeout ? setTimeout : s
            } catch (e) {
                n = s
            }
            try {
                i = "function" == typeof clearTimeout ? clearTimeout : a
            } catch (e) {
                i = a
            }
        }();
        var u, c = [], d = !1, f = -1;
        function h() {
            d && u && (d = !1,
            u.length ? c = u.concat(c) : f = -1,
            c.length && p())
        }
        function p() {
            if (!d) {
                var e = l(h);
                d = !0;
                for (var t = c.length; t; ) {
                    for (u = c,
                    c = []; ++f < t; )
                        u && u[f].run();
                    f = -1,
                    t = c.length
                }
                u = null,
                d = !1,
                function(e) {
                    if (i === clearTimeout)
                        return clearTimeout(e);
                    if ((i === a || !i) && clearTimeout)
                        return i = clearTimeout,
                        clearTimeout(e);
                    try {
                        return i(e)
                    } catch (t) {
                        try {
                            return i.call(null, e)
                        } catch (t) {
                            return i.call(this, e)
                        }
                    }
                }(e)
            }
        }
        function g(e, t) {
            this.fun = e,
            this.array = t
        }
        function m() {}
        o.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
            c.push(new g(e,t)),
            1 !== c.length || d || l(p)
        }
        ,
        g.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        o.title = "browser",
        o.browser = !0,
        o.env = {},
        o.argv = [],
        o.version = "",
        o.versions = {},
        o.on = m,
        o.addListener = m,
        o.once = m,
        o.off = m,
        o.removeListener = m,
        o.removeAllListeners = m,
        o.emit = m,
        o.prependListener = m,
        o.prependOnceListener = m,
        o.listeners = function(e) {
            return []
        }
        ,
        o.binding = function(e) {
            throw new Error("process.binding is not supported")
        }
        ,
        o.cwd = function() {
            return "/"
        }
        ,
        o.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }
        ,
        o.umask = function() {
            return 0
        }
    }
    , {}],
    179: [function(e, t, r) {
        (function(r) {
            (function() {
                var n = e("once")
                  , i = e("end-of-stream")
                  , o = e("fs")
                  , s = function() {}
                  , a = /^v?\.0/.test(r.version)
                  , l = function(e) {
                    return "function" == typeof e
                }
                  , u = function(e, t, r, u) {
                    u = n(u);
                    var c = !1;
                    e.on("close", (function() {
                        c = !0
                    }
                    )),
                    i(e, {
                        readable: t,
                        writable: r
                    }, (function(e) {
                        if (e)
                            return u(e);
                        c = !0,
                        u()
                    }
                    ));
                    var d = !1;
                    return function(t) {
                        if (!c && !d)
                            return d = !0,
                            function(e) {
                                return !!a && !!o && (e instanceof (o.ReadStream || s) || e instanceof (o.WriteStream || s)) && l(e.close)
                            }(e) ? e.close(s) : function(e) {
                                return e.setHeader && l(e.abort)
                            }(e) ? e.abort() : l(e.destroy) ? e.destroy() : void u(t || new Error("stream was destroyed"))
                    }
                }
                  , c = function(e) {
                    e()
                }
                  , d = function(e, t) {
                    return e.pipe(t)
                };
                t.exports = function() {
                    var e, t = Array.prototype.slice.call(arguments), r = l(t[t.length - 1] || s) && t.pop() || s;
                    if (Array.isArray(t[0]) && (t = t[0]),
                    t.length < 2)
                        throw new Error("pump requires two streams per minimum");
                    var n = t.map((function(i, o) {
                        var s = o < t.length - 1;
                        return u(i, s, o > 0, (function(t) {
                            e || (e = t),
                            t && n.forEach(c),
                            s || (n.forEach(c),
                            r(e))
                        }
                        ))
                    }
                    ));
                    return t.reduce(d)
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178,
        "end-of-stream": 129,
        fs: 123,
        once: 173
    }],
    180: [function(e, t, r) {
        "use strict";
        var n = e("process-nextick-args")
          , i = Object.keys || function(e) {
            var t = [];
            for (var r in e)
                t.push(r);
            return t
        }
        ;
        t.exports = d;
        var o = Object.create(e("core-util-is"));
        o.inherits = e("inherits");
        var s = e("./_stream_readable")
          , a = e("./_stream_writable");
        o.inherits(d, s);
        for (var l = i(a.prototype), u = 0; u < l.length; u++) {
            var c = l[u];
            d.prototype[c] || (d.prototype[c] = a.prototype[c])
        }
        function d(e) {
            if (!(this instanceof d))
                return new d(e);
            s.call(this, e),
            a.call(this, e),
            e && !1 === e.readable && (this.readable = !1),
            e && !1 === e.writable && (this.writable = !1),
            this.allowHalfOpen = !0,
            e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1),
            this.once("end", f)
        }
        function f() {
            this.allowHalfOpen || this._writableState.ended || n.nextTick(h, this)
        }
        function h(e) {
            e.end()
        }
        Object.defineProperty(d.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function() {
                return this._writableState.highWaterMark
            }
        }),
        Object.defineProperty(d.prototype, "destroyed", {
            get: function() {
                return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
            },
            set: function(e) {
                void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e,
                this._writableState.destroyed = e)
            }
        }),
        d.prototype._destroy = function(e, t) {
            this.push(null),
            this.end(),
            n.nextTick(t, e)
        }
    }
    , {
        "./_stream_readable": 182,
        "./_stream_writable": 184,
        "core-util-is": 125,
        inherits: 169,
        "process-nextick-args": 177
    }],
    181: [function(e, t, r) {
        "use strict";
        t.exports = o;
        var n = e("./_stream_transform")
          , i = Object.create(e("core-util-is"));
        function o(e) {
            if (!(this instanceof o))
                return new o(e);
            n.call(this, e)
        }
        i.inherits = e("inherits"),
        i.inherits(o, n),
        o.prototype._transform = function(e, t, r) {
            r(null, e)
        }
    }
    , {
        "./_stream_transform": 183,
        "core-util-is": 125,
        inherits: 169
    }],
    182: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                var i = e("process-nextick-args");
                t.exports = v;
                var o, s = e("isarray");
                v.ReadableState = y;
                e("events").EventEmitter;
                var a = function(e, t) {
                    return e.listeners(t).length
                }
                  , l = e("./internal/streams/stream")
                  , u = e("safe-buffer").Buffer
                  , c = n.Uint8Array || function() {}
                ;
                var d = Object.create(e("core-util-is"));
                d.inherits = e("inherits");
                var f = e("util")
                  , h = void 0;
                h = f && f.debuglog ? f.debuglog("stream") : function() {}
                ;
                var p, g = e("./internal/streams/BufferList"), m = e("./internal/streams/destroy");
                d.inherits(v, l);
                var b = ["error", "close", "destroy", "pause", "resume"];
                function y(t, r) {
                    t = t || {};
                    var n = r instanceof (o = o || e("./_stream_duplex"));
                    this.objectMode = !!t.objectMode,
                    n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
                    var i = t.highWaterMark
                      , s = t.readableHighWaterMark
                      , a = this.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : n && (s || 0 === s) ? s : a,
                    this.highWaterMark = Math.floor(this.highWaterMark),
                    this.buffer = new g,
                    this.length = 0,
                    this.pipes = null,
                    this.pipesCount = 0,
                    this.flowing = null,
                    this.ended = !1,
                    this.endEmitted = !1,
                    this.reading = !1,
                    this.sync = !0,
                    this.needReadable = !1,
                    this.emittedReadable = !1,
                    this.readableListening = !1,
                    this.resumeScheduled = !1,
                    this.destroyed = !1,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.awaitDrain = 0,
                    this.readingMore = !1,
                    this.decoder = null,
                    this.encoding = null,
                    t.encoding && (p || (p = e("string_decoder/").StringDecoder),
                    this.decoder = new p(t.encoding),
                    this.encoding = t.encoding)
                }
                function v(t) {
                    if (o = o || e("./_stream_duplex"),
                    !(this instanceof v))
                        return new v(t);
                    this._readableState = new y(t,this),
                    this.readable = !0,
                    t && ("function" == typeof t.read && (this._read = t.read),
                    "function" == typeof t.destroy && (this._destroy = t.destroy)),
                    l.call(this)
                }
                function w(e, t, r, n, i) {
                    var o, s = e._readableState;
                    null === t ? (s.reading = !1,
                    function(e, t) {
                        if (t.ended)
                            return;
                        if (t.decoder) {
                            var r = t.decoder.end();
                            r && r.length && (t.buffer.push(r),
                            t.length += t.objectMode ? 1 : r.length)
                        }
                        t.ended = !0,
                        A(e)
                    }(e, s)) : (i || (o = function(e, t) {
                        var r;
                        n = t,
                        u.isBuffer(n) || n instanceof c || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
                        var n;
                        return r
                    }(s, t)),
                    o ? e.emit("error", o) : s.objectMode || t && t.length > 0 ? ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === u.prototype || (t = function(e) {
                        return u.from(e)
                    }(t)),
                    n ? s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : _(e, s, t, !0) : s.ended ? e.emit("error", new Error("stream.push() after EOF")) : (s.reading = !1,
                    s.decoder && !r ? (t = s.decoder.write(t),
                    s.objectMode || 0 !== t.length ? _(e, s, t, !1) : x(e, s)) : _(e, s, t, !1))) : n || (s.reading = !1));
                    return function(e) {
                        return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
                    }(s)
                }
                function _(e, t, r, n) {
                    t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r),
                    e.read(0)) : (t.length += t.objectMode ? 1 : r.length,
                    n ? t.buffer.unshift(r) : t.buffer.push(r),
                    t.needReadable && A(e)),
                    x(e, t)
                }
                Object.defineProperty(v.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.destroyed = e)
                    }
                }),
                v.prototype.destroy = m.destroy,
                v.prototype._undestroy = m.undestroy,
                v.prototype._destroy = function(e, t) {
                    this.push(null),
                    t(e)
                }
                ,
                v.prototype.push = function(e, t) {
                    var r, n = this._readableState;
                    return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = u.from(e, t),
                    t = ""),
                    r = !0),
                    w(this, e, t, !1, r)
                }
                ,
                v.prototype.unshift = function(e) {
                    return w(this, e, null, !0, !1)
                }
                ,
                v.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing
                }
                ,
                v.prototype.setEncoding = function(t) {
                    return p || (p = e("string_decoder/").StringDecoder),
                    this._readableState.decoder = new p(t),
                    this._readableState.encoding = t,
                    this
                }
                ;
                var E = 8388608;
                function S(e, t) {
                    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                        return e >= E ? e = E : (e--,
                        e |= e >>> 1,
                        e |= e >>> 2,
                        e |= e >>> 4,
                        e |= e >>> 8,
                        e |= e >>> 16,
                        e++),
                        e
                    }(e)),
                    e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0,
                    0))
                }
                function A(e) {
                    var t = e._readableState;
                    t.needReadable = !1,
                    t.emittedReadable || (h("emitReadable", t.flowing),
                    t.emittedReadable = !0,
                    t.sync ? i.nextTick(R, e) : R(e))
                }
                function R(e) {
                    h("emit readable"),
                    e.emit("readable"),
                    M(e)
                }
                function x(e, t) {
                    t.readingMore || (t.readingMore = !0,
                    i.nextTick(T, e, t))
                }
                function T(e, t) {
                    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (h("maybeReadMore read 0"),
                    e.read(0),
                    r !== t.length); )
                        r = t.length;
                    t.readingMore = !1
                }
                function O(e) {
                    h("readable nexttick read 0"),
                    e.read(0)
                }
                function k(e, t) {
                    t.reading || (h("resume read 0"),
                    e.read(0)),
                    t.resumeScheduled = !1,
                    t.awaitDrain = 0,
                    e.emit("resume"),
                    M(e),
                    t.flowing && !t.reading && e.read(0)
                }
                function M(e) {
                    var t = e._readableState;
                    for (h("flow", t.flowing); t.flowing && null !== e.read(); )
                        ;
                }
                function N(e, t) {
                    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length),
                    t.buffer.clear()) : r = function(e, t, r) {
                        var n;
                        e < t.head.data.length ? (n = t.head.data.slice(0, e),
                        t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function(e, t) {
                            var r = t.head
                              , n = 1
                              , i = r.data;
                            e -= i.length;
                            for (; r = r.next; ) {
                                var o = r.data
                                  , s = e > o.length ? o.length : e;
                                if (s === o.length ? i += o : i += o.slice(0, e),
                                0 === (e -= s)) {
                                    s === o.length ? (++n,
                                    r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r,
                                    r.data = o.slice(s));
                                    break
                                }
                                ++n
                            }
                            return t.length -= n,
                            i
                        }(e, t) : function(e, t) {
                            var r = u.allocUnsafe(e)
                              , n = t.head
                              , i = 1;
                            n.data.copy(r),
                            e -= n.data.length;
                            for (; n = n.next; ) {
                                var o = n.data
                                  , s = e > o.length ? o.length : e;
                                if (o.copy(r, r.length - e, 0, s),
                                0 === (e -= s)) {
                                    s === o.length ? (++i,
                                    n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n,
                                    n.data = o.slice(s));
                                    break
                                }
                                ++i
                            }
                            return t.length -= i,
                            r
                        }(e, t);
                        return n
                    }(e, t.buffer, t.decoder),
                    r);
                    var r
                }
                function j(e) {
                    var t = e._readableState;
                    if (t.length > 0)
                        throw new Error('"endReadable()" called on non-empty stream');
                    t.endEmitted || (t.ended = !0,
                    i.nextTick(P, t, e))
                }
                function P(e, t) {
                    e.endEmitted || 0 !== e.length || (e.endEmitted = !0,
                    t.readable = !1,
                    t.emit("end"))
                }
                function I(e, t) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (e[r] === t)
                            return r;
                    return -1
                }
                v.prototype.read = function(e) {
                    h("read", e),
                    e = parseInt(e, 10);
                    var t = this._readableState
                      , r = e;
                    if (0 !== e && (t.emittedReadable = !1),
                    0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended))
                        return h("read: emitReadable", t.length, t.ended),
                        0 === t.length && t.ended ? j(this) : A(this),
                        null;
                    if (0 === (e = S(e, t)) && t.ended)
                        return 0 === t.length && j(this),
                        null;
                    var n, i = t.needReadable;
                    return h("need readable", i),
                    (0 === t.length || t.length - e < t.highWaterMark) && h("length less than watermark", i = !0),
                    t.ended || t.reading ? h("reading or ended", i = !1) : i && (h("do read"),
                    t.reading = !0,
                    t.sync = !0,
                    0 === t.length && (t.needReadable = !0),
                    this._read(t.highWaterMark),
                    t.sync = !1,
                    t.reading || (e = S(r, t))),
                    null === (n = e > 0 ? N(e, t) : null) ? (t.needReadable = !0,
                    e = 0) : t.length -= e,
                    0 === t.length && (t.ended || (t.needReadable = !0),
                    r !== e && t.ended && j(this)),
                    null !== n && this.emit("data", n),
                    n
                }
                ,
                v.prototype._read = function(e) {
                    this.emit("error", new Error("_read() is not implemented"))
                }
                ,
                v.prototype.pipe = function(e, t) {
                    var n = this
                      , o = this._readableState;
                    switch (o.pipesCount) {
                    case 0:
                        o.pipes = e;
                        break;
                    case 1:
                        o.pipes = [o.pipes, e];
                        break;
                    default:
                        o.pipes.push(e)
                    }
                    o.pipesCount += 1,
                    h("pipe count=%d opts=%j", o.pipesCount, t);
                    var l = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? c : v;
                    function u(t, r) {
                        h("onunpipe"),
                        t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0,
                        h("cleanup"),
                        e.removeListener("close", b),
                        e.removeListener("finish", y),
                        e.removeListener("drain", d),
                        e.removeListener("error", m),
                        e.removeListener("unpipe", u),
                        n.removeListener("end", c),
                        n.removeListener("end", v),
                        n.removeListener("data", g),
                        f = !0,
                        !o.awaitDrain || e._writableState && !e._writableState.needDrain || d())
                    }
                    function c() {
                        h("onend"),
                        e.end()
                    }
                    o.endEmitted ? i.nextTick(l) : n.once("end", l),
                    e.on("unpipe", u);
                    var d = function(e) {
                        return function() {
                            var t = e._readableState;
                            h("pipeOnDrain", t.awaitDrain),
                            t.awaitDrain && t.awaitDrain--,
                            0 === t.awaitDrain && a(e, "data") && (t.flowing = !0,
                            M(e))
                        }
                    }(n);
                    e.on("drain", d);
                    var f = !1;
                    var p = !1;
                    function g(t) {
                        h("ondata"),
                        p = !1,
                        !1 !== e.write(t) || p || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== I(o.pipes, e)) && !f && (h("false write response, pause", n._readableState.awaitDrain),
                        n._readableState.awaitDrain++,
                        p = !0),
                        n.pause())
                    }
                    function m(t) {
                        h("onerror", t),
                        v(),
                        e.removeListener("error", m),
                        0 === a(e, "error") && e.emit("error", t)
                    }
                    function b() {
                        e.removeListener("finish", y),
                        v()
                    }
                    function y() {
                        h("onfinish"),
                        e.removeListener("close", b),
                        v()
                    }
                    function v() {
                        h("unpipe"),
                        n.unpipe(e)
                    }
                    return n.on("data", g),
                    function(e, t, r) {
                        if ("function" == typeof e.prependListener)
                            return e.prependListener(t, r);
                        e._events && e._events[t] ? s(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                    }(e, "error", m),
                    e.once("close", b),
                    e.once("finish", y),
                    e.emit("pipe", n),
                    o.flowing || (h("pipe resume"),
                    n.resume()),
                    e
                }
                ,
                v.prototype.unpipe = function(e) {
                    var t = this._readableState
                      , r = {
                        hasUnpiped: !1
                    };
                    if (0 === t.pipesCount)
                        return this;
                    if (1 === t.pipesCount)
                        return e && e !== t.pipes || (e || (e = t.pipes),
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1,
                        e && e.emit("unpipe", this, r)),
                        this;
                    if (!e) {
                        var n = t.pipes
                          , i = t.pipesCount;
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1;
                        for (var o = 0; o < i; o++)
                            n[o].emit("unpipe", this, r);
                        return this
                    }
                    var s = I(t.pipes, e);
                    return -1 === s || (t.pipes.splice(s, 1),
                    t.pipesCount -= 1,
                    1 === t.pipesCount && (t.pipes = t.pipes[0]),
                    e.emit("unpipe", this, r)),
                    this
                }
                ,
                v.prototype.on = function(e, t) {
                    var r = l.prototype.on.call(this, e, t);
                    if ("data" === e)
                        !1 !== this._readableState.flowing && this.resume();
                    else if ("readable" === e) {
                        var n = this._readableState;
                        n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0,
                        n.emittedReadable = !1,
                        n.reading ? n.length && A(this) : i.nextTick(O, this))
                    }
                    return r
                }
                ,
                v.prototype.addListener = v.prototype.on,
                v.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (h("resume"),
                    e.flowing = !0,
                    function(e, t) {
                        t.resumeScheduled || (t.resumeScheduled = !0,
                        i.nextTick(k, e, t))
                    }(this, e)),
                    this
                }
                ,
                v.prototype.pause = function() {
                    return h("call pause flowing=%j", this._readableState.flowing),
                    !1 !== this._readableState.flowing && (h("pause"),
                    this._readableState.flowing = !1,
                    this.emit("pause")),
                    this
                }
                ,
                v.prototype.wrap = function(e) {
                    var t = this
                      , r = this._readableState
                      , n = !1;
                    for (var i in e.on("end", (function() {
                        if (h("wrapped end"),
                        r.decoder && !r.ended) {
                            var e = r.decoder.end();
                            e && e.length && t.push(e)
                        }
                        t.push(null)
                    }
                    )),
                    e.on("data", (function(i) {
                        (h("wrapped data"),
                        r.decoder && (i = r.decoder.write(i)),
                        r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0,
                        e.pause()))
                    }
                    )),
                    e)
                        void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                            return function() {
                                return e[t].apply(e, arguments)
                            }
                        }(i));
                    for (var o = 0; o < b.length; o++)
                        e.on(b[o], this.emit.bind(this, b[o]));
                    return this._read = function(t) {
                        h("wrapped _read", t),
                        n && (n = !1,
                        e.resume())
                    }
                    ,
                    this
                }
                ,
                Object.defineProperty(v.prototype, "readableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.highWaterMark
                    }
                }),
                v._fromList = N
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "./_stream_duplex": 180,
        "./internal/streams/BufferList": 185,
        "./internal/streams/destroy": 186,
        "./internal/streams/stream": 187,
        _process: 178,
        "core-util-is": 125,
        events: 130,
        inherits: 169,
        isarray: 188,
        "process-nextick-args": 177,
        "safe-buffer": 189,
        "string_decoder/": 190,
        util: 123
    }],
    183: [function(e, t, r) {
        "use strict";
        t.exports = s;
        var n = e("./_stream_duplex")
          , i = Object.create(e("core-util-is"));
        function o(e, t) {
            var r = this._transformState;
            r.transforming = !1;
            var n = r.writecb;
            if (!n)
                return this.emit("error", new Error("write callback called multiple times"));
            r.writechunk = null,
            r.writecb = null,
            null != t && this.push(t),
            n(e);
            var i = this._readableState;
            i.reading = !1,
            (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
        }
        function s(e) {
            if (!(this instanceof s))
                return new s(e);
            n.call(this, e),
            this._transformState = {
                afterTransform: o.bind(this),
                needTransform: !1,
                transforming: !1,
                writecb: null,
                writechunk: null,
                writeencoding: null
            },
            this._readableState.needReadable = !0,
            this._readableState.sync = !1,
            e && ("function" == typeof e.transform && (this._transform = e.transform),
            "function" == typeof e.flush && (this._flush = e.flush)),
            this.on("prefinish", a)
        }
        function a() {
            var e = this;
            "function" == typeof this._flush ? this._flush((function(t, r) {
                l(e, t, r)
            }
            )) : l(this, null, null)
        }
        function l(e, t, r) {
            if (t)
                return e.emit("error", t);
            if (null != r && e.push(r),
            e._writableState.length)
                throw new Error("Calling transform done when ws.length != 0");
            if (e._transformState.transforming)
                throw new Error("Calling transform done when still transforming");
            return e.push(null)
        }
        i.inherits = e("inherits"),
        i.inherits(s, n),
        s.prototype.push = function(e, t) {
            return this._transformState.needTransform = !1,
            n.prototype.push.call(this, e, t)
        }
        ,
        s.prototype._transform = function(e, t, r) {
            throw new Error("_transform() is not implemented")
        }
        ,
        s.prototype._write = function(e, t, r) {
            var n = this._transformState;
            if (n.writecb = r,
            n.writechunk = e,
            n.writeencoding = t,
            !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
            }
        }
        ,
        s.prototype._read = function(e) {
            var t = this._transformState;
            null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0,
            this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
        }
        ,
        s.prototype._destroy = function(e, t) {
            var r = this;
            n.prototype._destroy.call(this, e, (function(e) {
                t(e),
                r.emit("close")
            }
            ))
        }
    }
    , {
        "./_stream_duplex": 180,
        "core-util-is": 125,
        inherits: 169
    }],
    184: [function(e, t, r) {
        (function(r, n, i) {
            (function() {
                "use strict";
                var o = e("process-nextick-args");
                function s(e) {
                    var t = this;
                    this.next = null,
                    this.entry = null,
                    this.finish = function() {
                        !function(e, t, r) {
                            var n = e.entry;
                            e.entry = null;
                            for (; n; ) {
                                var i = n.callback;
                                t.pendingcb--,
                                i(r),
                                n = n.next
                            }
                            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e
                        }(t, e)
                    }
                }
                t.exports = y;
                var a, l = !r.browser && ["v0.10", "v0.9."].indexOf(r.version.slice(0, 5)) > -1 ? i : o.nextTick;
                y.WritableState = b;
                var u = Object.create(e("core-util-is"));
                u.inherits = e("inherits");
                var c = {
                    deprecate: e("util-deprecate")
                }
                  , d = e("./internal/streams/stream")
                  , f = e("safe-buffer").Buffer
                  , h = n.Uint8Array || function() {}
                ;
                var p, g = e("./internal/streams/destroy");
                function m() {}
                function b(t, r) {
                    a = a || e("./_stream_duplex"),
                    t = t || {};
                    var n = r instanceof a;
                    this.objectMode = !!t.objectMode,
                    n && (this.objectMode = this.objectMode || !!t.writableObjectMode);
                    var i = t.highWaterMark
                      , u = t.writableHighWaterMark
                      , c = this.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : n && (u || 0 === u) ? u : c,
                    this.highWaterMark = Math.floor(this.highWaterMark),
                    this.finalCalled = !1,
                    this.needDrain = !1,
                    this.ending = !1,
                    this.ended = !1,
                    this.finished = !1,
                    this.destroyed = !1;
                    var d = !1 === t.decodeStrings;
                    this.decodeStrings = !d,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.length = 0,
                    this.writing = !1,
                    this.corked = 0,
                    this.sync = !0,
                    this.bufferProcessing = !1,
                    this.onwrite = function(e) {
                        !function(e, t) {
                            var r = e._writableState
                              , n = r.sync
                              , i = r.writecb;
                            if (function(e) {
                                e.writing = !1,
                                e.writecb = null,
                                e.length -= e.writelen,
                                e.writelen = 0
                            }(r),
                            t)
                                !function(e, t, r, n, i) {
                                    --t.pendingcb,
                                    r ? (o.nextTick(i, n),
                                    o.nextTick(A, e, t),
                                    e._writableState.errorEmitted = !0,
                                    e.emit("error", n)) : (i(n),
                                    e._writableState.errorEmitted = !0,
                                    e.emit("error", n),
                                    A(e, t))
                                }(e, r, n, t, i);
                            else {
                                var s = E(r);
                                s || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r),
                                n ? l(w, e, r, s, i) : w(e, r, s, i)
                            }
                        }(r, e)
                    }
                    ,
                    this.writecb = null,
                    this.writelen = 0,
                    this.bufferedRequest = null,
                    this.lastBufferedRequest = null,
                    this.pendingcb = 0,
                    this.prefinished = !1,
                    this.errorEmitted = !1,
                    this.bufferedRequestCount = 0,
                    this.corkedRequestsFree = new s(this)
                }
                function y(t) {
                    if (a = a || e("./_stream_duplex"),
                    !(p.call(y, this) || this instanceof a))
                        return new y(t);
                    this._writableState = new b(t,this),
                    this.writable = !0,
                    t && ("function" == typeof t.write && (this._write = t.write),
                    "function" == typeof t.writev && (this._writev = t.writev),
                    "function" == typeof t.destroy && (this._destroy = t.destroy),
                    "function" == typeof t.final && (this._final = t.final)),
                    d.call(this)
                }
                function v(e, t, r, n, i, o, s) {
                    t.writelen = n,
                    t.writecb = s,
                    t.writing = !0,
                    t.sync = !0,
                    r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite),
                    t.sync = !1
                }
                function w(e, t, r, n) {
                    r || function(e, t) {
                        0 === t.length && t.needDrain && (t.needDrain = !1,
                        e.emit("drain"))
                    }(e, t),
                    t.pendingcb--,
                    n(),
                    A(e, t)
                }
                function _(e, t) {
                    t.bufferProcessing = !0;
                    var r = t.bufferedRequest;
                    if (e._writev && r && r.next) {
                        var n = t.bufferedRequestCount
                          , i = new Array(n)
                          , o = t.corkedRequestsFree;
                        o.entry = r;
                        for (var a = 0, l = !0; r; )
                            i[a] = r,
                            r.isBuf || (l = !1),
                            r = r.next,
                            a += 1;
                        i.allBuffers = l,
                        v(e, t, !0, t.length, i, "", o.finish),
                        t.pendingcb++,
                        t.lastBufferedRequest = null,
                        o.next ? (t.corkedRequestsFree = o.next,
                        o.next = null) : t.corkedRequestsFree = new s(t),
                        t.bufferedRequestCount = 0
                    } else {
                        for (; r; ) {
                            var u = r.chunk
                              , c = r.encoding
                              , d = r.callback;
                            if (v(e, t, !1, t.objectMode ? 1 : u.length, u, c, d),
                            r = r.next,
                            t.bufferedRequestCount--,
                            t.writing)
                                break
                        }
                        null === r && (t.lastBufferedRequest = null)
                    }
                    t.bufferedRequest = r,
                    t.bufferProcessing = !1
                }
                function E(e) {
                    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
                }
                function S(e, t) {
                    e._final((function(r) {
                        t.pendingcb--,
                        r && e.emit("error", r),
                        t.prefinished = !0,
                        e.emit("prefinish"),
                        A(e, t)
                    }
                    ))
                }
                function A(e, t) {
                    var r = E(t);
                    return r && (!function(e, t) {
                        t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++,
                        t.finalCalled = !0,
                        o.nextTick(S, e, t)) : (t.prefinished = !0,
                        e.emit("prefinish")))
                    }(e, t),
                    0 === t.pendingcb && (t.finished = !0,
                    e.emit("finish"))),
                    r
                }
                u.inherits(y, d),
                b.prototype.getBuffer = function() {
                    for (var e = this.bufferedRequest, t = []; e; )
                        t.push(e),
                        e = e.next;
                    return t
                }
                ,
                function() {
                    try {
                        Object.defineProperty(b.prototype, "buffer", {
                            get: c.deprecate((function() {
                                return this.getBuffer()
                            }
                            ), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (e) {}
                }(),
                "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (p = Function.prototype[Symbol.hasInstance],
                Object.defineProperty(y, Symbol.hasInstance, {
                    value: function(e) {
                        return !!p.call(this, e) || this === y && (e && e._writableState instanceof b)
                    }
                })) : p = function(e) {
                    return e instanceof this
                }
                ,
                y.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe, not readable"))
                }
                ,
                y.prototype.write = function(e, t, r) {
                    var n, i = this._writableState, s = !1, a = !i.objectMode && (n = e,
                    f.isBuffer(n) || n instanceof h);
                    return a && !f.isBuffer(e) && (e = function(e) {
                        return f.from(e)
                    }(e)),
                    "function" == typeof t && (r = t,
                    t = null),
                    a ? t = "buffer" : t || (t = i.defaultEncoding),
                    "function" != typeof r && (r = m),
                    i.ended ? function(e, t) {
                        var r = new Error("write after end");
                        e.emit("error", r),
                        o.nextTick(t, r)
                    }(this, r) : (a || function(e, t, r, n) {
                        var i = !0
                          , s = !1;
                        return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")),
                        s && (e.emit("error", s),
                        o.nextTick(n, s),
                        i = !1),
                        i
                    }(this, i, e, r)) && (i.pendingcb++,
                    s = function(e, t, r, n, i, o) {
                        if (!r) {
                            var s = function(e, t, r) {
                                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = f.from(t, r));
                                return t
                            }(t, n, i);
                            n !== s && (r = !0,
                            i = "buffer",
                            n = s)
                        }
                        var a = t.objectMode ? 1 : n.length;
                        t.length += a;
                        var l = t.length < t.highWaterMark;
                        l || (t.needDrain = !0);
                        if (t.writing || t.corked) {
                            var u = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: n,
                                encoding: i,
                                isBuf: r,
                                callback: o,
                                next: null
                            },
                            u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest,
                            t.bufferedRequestCount += 1
                        } else
                            v(e, t, !1, a, n, i, o);
                        return l
                    }(this, i, a, e, t, r)),
                    s
                }
                ,
                y.prototype.cork = function() {
                    this._writableState.corked++
                }
                ,
                y.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--,
                    e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e))
                }
                ,
                y.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()),
                    !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                        throw new TypeError("Unknown encoding: " + e);
                    return this._writableState.defaultEncoding = e,
                    this
                }
                ,
                Object.defineProperty(y.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                y.prototype._write = function(e, t, r) {
                    r(new Error("_write() is not implemented"))
                }
                ,
                y.prototype._writev = null,
                y.prototype.end = function(e, t, r) {
                    var n = this._writableState;
                    "function" == typeof e ? (r = e,
                    e = null,
                    t = null) : "function" == typeof t && (r = t,
                    t = null),
                    null != e && this.write(e, t),
                    n.corked && (n.corked = 1,
                    this.uncork()),
                    n.ending || n.finished || function(e, t, r) {
                        t.ending = !0,
                        A(e, t),
                        r && (t.finished ? o.nextTick(r) : e.once("finish", r));
                        t.ended = !0,
                        e.writable = !1
                    }(this, n, r)
                }
                ,
                Object.defineProperty(y.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e)
                    }
                }),
                y.prototype.destroy = g.destroy,
                y.prototype._undestroy = g.undestroy,
                y.prototype._destroy = function(e, t) {
                    this.end(),
                    t(e)
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("timers").setImmediate)
    }
    , {
        "./_stream_duplex": 180,
        "./internal/streams/destroy": 186,
        "./internal/streams/stream": 187,
        _process: 178,
        "core-util-is": 125,
        inherits: 169,
        "process-nextick-args": 177,
        "safe-buffer": 189,
        timers: 257,
        "util-deprecate": 258
    }],
    185: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer
          , i = e("util");
        t.exports = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.head = null,
                this.tail = null,
                this.length = 0
            }
            return e.prototype.push = function(e) {
                var t = {
                    data: e,
                    next: null
                };
                this.length > 0 ? this.tail.next = t : this.head = t,
                this.tail = t,
                ++this.length
            }
            ,
            e.prototype.unshift = function(e) {
                var t = {
                    data: e,
                    next: this.head
                };
                0 === this.length && (this.tail = t),
                this.head = t,
                ++this.length
            }
            ,
            e.prototype.shift = function() {
                if (0 !== this.length) {
                    var e = this.head.data;
                    return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next,
                    --this.length,
                    e
                }
            }
            ,
            e.prototype.clear = function() {
                this.head = this.tail = null,
                this.length = 0
            }
            ,
            e.prototype.join = function(e) {
                if (0 === this.length)
                    return "";
                for (var t = this.head, r = "" + t.data; t = t.next; )
                    r += e + t.data;
                return r
            }
            ,
            e.prototype.concat = function(e) {
                if (0 === this.length)
                    return n.alloc(0);
                if (1 === this.length)
                    return this.head.data;
                for (var t, r, i, o = n.allocUnsafe(e >>> 0), s = this.head, a = 0; s; )
                    t = s.data,
                    r = o,
                    i = a,
                    t.copy(r, i),
                    a += s.data.length,
                    s = s.next;
                return o
            }
            ,
            e
        }(),
        i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function() {
            var e = i.inspect({
                length: this.length
            });
            return this.constructor.name + " " + e
        }
        )
    }
    , {
        "safe-buffer": 189,
        util: 123
    }],
    186: [function(e, t, r) {
        "use strict";
        var n = e("process-nextick-args");
        function i(e, t) {
            e.emit("error", t)
        }
        t.exports = {
            destroy: function(e, t) {
                var r = this
                  , o = this._readableState && this._readableState.destroyed
                  , s = this._writableState && this._writableState.destroyed;
                return o || s ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e),
                this) : (this._readableState && (this._readableState.destroyed = !0),
                this._writableState && (this._writableState.destroyed = !0),
                this._destroy(e || null, (function(e) {
                    !t && e ? (n.nextTick(i, r, e),
                    r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e)
                }
                )),
                this)
            },
            undestroy: function() {
                this._readableState && (this._readableState.destroyed = !1,
                this._readableState.reading = !1,
                this._readableState.ended = !1,
                this._readableState.endEmitted = !1),
                this._writableState && (this._writableState.destroyed = !1,
                this._writableState.ended = !1,
                this._writableState.ending = !1,
                this._writableState.finished = !1,
                this._writableState.errorEmitted = !1)
            }
        }
    }
    , {
        "process-nextick-args": 177
    }],
    187: [function(e, t, r) {
        arguments[4][22][0].apply(r, arguments)
    }
    , {
        dup: 22,
        events: 130
    }],
    188: [function(e, t, r) {
        var n = {}.toString;
        t.exports = Array.isArray || function(e) {
            return "[object Array]" == n.call(e)
        }
    }
    , {}],
    189: [function(e, t, r) {
        var n = e("buffer")
          , i = n.Buffer;
        function o(e, t) {
            for (var r in e)
                t[r] = e[r]
        }
        function s(e, t, r) {
            return i(e, t, r)
        }
        i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r),
        r.Buffer = s),
        o(i, s),
        s.from = function(e, t, r) {
            if ("number" == typeof e)
                throw new TypeError("Argument must not be a number");
            return i(e, t, r)
        }
        ,
        s.alloc = function(e, t, r) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            var n = i(e);
            return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0),
            n
        }
        ,
        s.allocUnsafe = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return i(e)
        }
        ,
        s.allocUnsafeSlow = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e)
        }
    }
    , {
        buffer: 124
    }],
    190: [function(e, t, r) {
        "use strict";
        var n = e("safe-buffer").Buffer
          , i = n.isEncoding || function(e) {
            switch ((e = "" + e) && e.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
                return !0;
            default:
                return !1
            }
        }
        ;
        function o(e) {
            var t;
            switch (this.encoding = function(e) {
                var t = function(e) {
                    if (!e)
                        return "utf8";
                    for (var t; ; )
                        switch (e) {
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return e;
                        default:
                            if (t)
                                return;
                            e = ("" + e).toLowerCase(),
                            t = !0
                        }
                }(e);
                if ("string" != typeof t && (n.isEncoding === i || !i(e)))
                    throw new Error("Unknown encoding: " + e);
                return t || e
            }(e),
            this.encoding) {
            case "utf16le":
                this.text = l,
                this.end = u,
                t = 4;
                break;
            case "utf8":
                this.fillLast = a,
                t = 4;
                break;
            case "base64":
                this.text = c,
                this.end = d,
                t = 3;
                break;
            default:
                return this.write = f,
                void (this.end = h)
            }
            this.lastNeed = 0,
            this.lastTotal = 0,
            this.lastChar = n.allocUnsafe(t)
        }
        function s(e) {
            return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2
        }
        function a(e) {
            var t = this.lastTotal - this.lastNeed
              , r = function(e, t, r) {
                if (128 != (192 & t[0]))
                    return e.lastNeed = 0,
                    "�";
                if (e.lastNeed > 1 && t.length > 1) {
                    if (128 != (192 & t[1]))
                        return e.lastNeed = 1,
                        "�";
                    if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2]))
                        return e.lastNeed = 2,
                        "�"
                }
            }(this, e);
            return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed),
            this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length),
            void (this.lastNeed -= e.length))
        }
        function l(e, t) {
            if ((e.length - t) % 2 == 0) {
                var r = e.toString("utf16le", t);
                if (r) {
                    var n = r.charCodeAt(r.length - 1);
                    if (n >= 55296 && n <= 56319)
                        return this.lastNeed = 2,
                        this.lastTotal = 4,
                        this.lastChar[0] = e[e.length - 2],
                        this.lastChar[1] = e[e.length - 1],
                        r.slice(0, -1)
                }
                return r
            }
            return this.lastNeed = 1,
            this.lastTotal = 2,
            this.lastChar[0] = e[e.length - 1],
            e.toString("utf16le", t, e.length - 1)
        }
        function u(e) {
            var t = e && e.length ? this.write(e) : "";
            if (this.lastNeed) {
                var r = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, r)
            }
            return t
        }
        function c(e, t) {
            var r = (e.length - t) % 3;
            return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r,
            this.lastTotal = 3,
            1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2],
            this.lastChar[1] = e[e.length - 1]),
            e.toString("base64", t, e.length - r))
        }
        function d(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
        }
        function f(e) {
            return e.toString(this.encoding)
        }
        function h(e) {
            return e && e.length ? this.write(e) : ""
        }
        r.StringDecoder = o,
        o.prototype.write = function(e) {
            if (0 === e.length)
                return "";
            var t, r;
            if (this.lastNeed) {
                if (void 0 === (t = this.fillLast(e)))
                    return "";
                r = this.lastNeed,
                this.lastNeed = 0
            } else
                r = 0;
            return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
        }
        ,
        o.prototype.end = function(e) {
            var t = e && e.length ? this.write(e) : "";
            return this.lastNeed ? t + "�" : t
        }
        ,
        o.prototype.text = function(e, t) {
            var r = function(e, t, r) {
                var n = t.length - 1;
                if (n < r)
                    return 0;
                var i = s(t[n]);
                if (i >= 0)
                    return i > 0 && (e.lastNeed = i - 1),
                    i;
                if (--n < r || -2 === i)
                    return 0;
                if (i = s(t[n]),
                i >= 0)
                    return i > 0 && (e.lastNeed = i - 2),
                    i;
                if (--n < r || -2 === i)
                    return 0;
                if (i = s(t[n]),
                i >= 0)
                    return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3),
                    i;
                return 0
            }(this, e, t);
            if (!this.lastNeed)
                return e.toString("utf8", t);
            this.lastTotal = r;
            var n = e.length - (r - this.lastNeed);
            return e.copy(this.lastChar, 0, n),
            e.toString("utf8", t, n)
        }
        ,
        o.prototype.fillLast = function(e) {
            if (this.lastNeed <= e.length)
                return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed),
                this.lastChar.toString(this.encoding, 0, this.lastTotal);
            e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length),
            this.lastNeed -= e.length
        }
    }
    , {
        "safe-buffer": 189
    }],
    191: [function(e, t, r) {
        (r = t.exports = e("./lib/_stream_readable.js")).Stream = r,
        r.Readable = r,
        r.Writable = e("./lib/_stream_writable.js"),
        r.Duplex = e("./lib/_stream_duplex.js"),
        r.Transform = e("./lib/_stream_transform.js"),
        r.PassThrough = e("./lib/_stream_passthrough.js")
    }
    , {
        "./lib/_stream_duplex.js": 180,
        "./lib/_stream_passthrough.js": 181,
        "./lib/_stream_readable.js": 182,
        "./lib/_stream_transform.js": 183,
        "./lib/_stream_writable.js": 184
    }],
    192: [function(e, t, r) {
        /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
        var n = e("buffer")
          , i = n.Buffer;
        function o(e, t) {
            for (var r in e)
                t[r] = e[r]
        }
        function s(e, t, r) {
            return i(e, t, r)
        }
        i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r),
        r.Buffer = s),
        s.prototype = Object.create(i.prototype),
        o(i, s),
        s.from = function(e, t, r) {
            if ("number" == typeof e)
                throw new TypeError("Argument must not be a number");
            return i(e, t, r)
        }
        ,
        s.alloc = function(e, t, r) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            var n = i(e);
            return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0),
            n
        }
        ,
        s.allocUnsafe = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return i(e)
        }
        ,
        s.allocUnsafeSlow = function(e) {
            if ("number" != typeof e)
                throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e)
        }
    }
    , {
        buffer: 124
    }],
    193: [function(e, t, r) {
        const n = Symbol("SemVer ANY");
        class i {
            static get ANY() {
                return n
            }
            constructor(e, t) {
                if (t = o(t),
                e instanceof i) {
                    if (e.loose === !!t.loose)
                        return e;
                    e = e.value
                }
                e = e.trim().split(/\s+/).join(" "),
                u("comparator", e, t),
                this.options = t,
                this.loose = !!t.loose,
                this.parse(e),
                this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version,
                u("comp", this)
            }
            parse(e) {
                const t = this.options.loose ? s[a.COMPARATORLOOSE] : s[a.COMPARATOR]
                  , r = e.match(t);
                if (!r)
                    throw new TypeError(`Invalid comparator: ${e}`);
                this.operator = void 0 !== r[1] ? r[1] : "",
                "=" === this.operator && (this.operator = ""),
                r[2] ? this.semver = new c(r[2],this.options.loose) : this.semver = n
            }
            toString() {
                return this.value
            }
            test(e) {
                if (u("Comparator.test", e, this.options.loose),
                this.semver === n || e === n)
                    return !0;
                if ("string" == typeof e)
                    try {
                        e = new c(e,this.options)
                    } catch (e) {
                        return !1
                    }
                return l(e, this.operator, this.semver, this.options)
            }
            intersects(e, t) {
                if (!(e instanceof i))
                    throw new TypeError("a Comparator is required");
                return "" === this.operator ? "" === this.value || new d(e.value,t).test(this.value) : "" === e.operator ? "" === e.value || new d(this.value,t).test(e.semver) : (!(t = o(t)).includePrerelease || "<0.0.0-0" !== this.value && "<0.0.0-0" !== e.value) && (!(!t.includePrerelease && (this.value.startsWith("<0.0.0") || e.value.startsWith("<0.0.0"))) && (!(!this.operator.startsWith(">") || !e.operator.startsWith(">")) || (!(!this.operator.startsWith("<") || !e.operator.startsWith("<")) || (!(this.semver.version !== e.semver.version || !this.operator.includes("=") || !e.operator.includes("=")) || (!!(l(this.semver, "<", e.semver, t) && this.operator.startsWith(">") && e.operator.startsWith("<")) || !!(l(this.semver, ">", e.semver, t) && this.operator.startsWith("<") && e.operator.startsWith(">")))))))
            }
        }
        t.exports = i;
        const o = e("../internal/parse-options")
          , {safeRe: s, t: a} = e("../internal/re")
          , l = e("../functions/cmp")
          , u = e("../internal/debug")
          , c = e("./semver")
          , d = e("./range")
    }
    , {
        "../functions/cmp": 197,
        "../internal/debug": 222,
        "../internal/parse-options": 224,
        "../internal/re": 225,
        "./range": 194,
        "./semver": 195
    }],
    194: [function(e, t, r) {
        class n {
            constructor(e, t) {
                if (t = o(t),
                e instanceof n)
                    return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new n(e.raw,t);
                if (e instanceof s)
                    return this.raw = e.value,
                    this.set = [[e]],
                    this.format(),
                    this;
                if (this.options = t,
                this.loose = !!t.loose,
                this.includePrerelease = !!t.includePrerelease,
                this.raw = e.trim().split(/\s+/).join(" "),
                this.set = this.raw.split("||").map((e=>this.parseRange(e.trim()))).filter((e=>e.length)),
                !this.set.length)
                    throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
                if (this.set.length > 1) {
                    const e = this.set[0];
                    if (this.set = this.set.filter((e=>!m(e[0]))),
                    0 === this.set.length)
                        this.set = [e];
                    else if (this.set.length > 1)
                        for (const e of this.set)
                            if (1 === e.length && b(e[0])) {
                                this.set = [e];
                                break
                            }
                }
                this.format()
            }
            format() {
                return this.range = this.set.map((e=>e.join(" ").trim())).join("||").trim(),
                this.range
            }
            toString() {
                return this.range
            }
            parseRange(e) {
                const t = ((this.options.includePrerelease && p) | (this.options.loose && g)) + ":" + e
                  , r = i.get(t);
                if (r)
                    return r;
                const n = this.options.loose
                  , o = n ? u[c.HYPHENRANGELOOSE] : u[c.HYPHENRANGE];
                e = e.replace(o, k(this.options.includePrerelease)),
                a("hyphen replace", e),
                e = e.replace(u[c.COMPARATORTRIM], d),
                a("comparator trim", e),
                e = e.replace(u[c.TILDETRIM], f),
                a("tilde trim", e),
                e = e.replace(u[c.CARETTRIM], h),
                a("caret trim", e);
                let l = e.split(" ").map((e=>v(e, this.options))).join(" ").split(/\s+/).map((e=>O(e, this.options)));
                n && (l = l.filter((e=>(a("loose invalid filter", e, this.options),
                !!e.match(u[c.COMPARATORLOOSE]))))),
                a("range list", l);
                const b = new Map
                  , y = l.map((e=>new s(e,this.options)));
                for (const e of y) {
                    if (m(e))
                        return [e];
                    b.set(e.value, e)
                }
                b.size > 1 && b.has("") && b.delete("");
                const w = [...b.values()];
                return i.set(t, w),
                w
            }
            intersects(e, t) {
                if (!(e instanceof n))
                    throw new TypeError("a Range is required");
                return this.set.some((r=>y(r, t) && e.set.some((e=>y(e, t) && r.every((r=>e.every((e=>r.intersects(e, t)))))))))
            }
            test(e) {
                if (!e)
                    return !1;
                if ("string" == typeof e)
                    try {
                        e = new l(e,this.options)
                    } catch (e) {
                        return !1
                    }
                for (let t = 0; t < this.set.length; t++)
                    if (M(this.set[t], e, this.options))
                        return !0;
                return !1
            }
        }
        t.exports = n;
        const i = new (e("lru-cache"))({
            max: 1e3
        })
          , o = e("../internal/parse-options")
          , s = e("./comparator")
          , a = e("../internal/debug")
          , l = e("./semver")
          , {safeRe: u, t: c, comparatorTrimReplace: d, tildeTrimReplace: f, caretTrimReplace: h} = e("../internal/re")
          , {FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: g} = e("../internal/constants")
          , m = e=>"<0.0.0-0" === e.value
          , b = e=>"" === e.value
          , y = (e,t)=>{
            let r = !0;
            const n = e.slice();
            let i = n.pop();
            for (; r && n.length; )
                r = n.every((e=>i.intersects(e, t))),
                i = n.pop();
            return r
        }
          , v = (e,t)=>(a("comp", e, t),
        e = S(e, t),
        a("caret", e),
        e = _(e, t),
        a("tildes", e),
        e = R(e, t),
        a("xrange", e),
        e = T(e, t),
        a("stars", e),
        e)
          , w = e=>!e || "x" === e.toLowerCase() || "*" === e
          , _ = (e,t)=>e.trim().split(/\s+/).map((e=>E(e, t))).join(" ")
          , E = (e,t)=>{
            const r = t.loose ? u[c.TILDELOOSE] : u[c.TILDE];
            return e.replace(r, ((t,r,n,i,o)=>{
                let s;
                return a("tilde", e, t, r, n, i, o),
                w(r) ? s = "" : w(n) ? s = `>=${r}.0.0 <${+r + 1}.0.0-0` : w(i) ? s = `>=${r}.${n}.0 <${r}.${+n + 1}.0-0` : o ? (a("replaceTilde pr", o),
                s = `>=${r}.${n}.${i}-${o} <${r}.${+n + 1}.0-0`) : s = `>=${r}.${n}.${i} <${r}.${+n + 1}.0-0`,
                a("tilde return", s),
                s
            }
            ))
        }
          , S = (e,t)=>e.trim().split(/\s+/).map((e=>A(e, t))).join(" ")
          , A = (e,t)=>{
            a("caret", e, t);
            const r = t.loose ? u[c.CARETLOOSE] : u[c.CARET]
              , n = t.includePrerelease ? "-0" : "";
            return e.replace(r, ((t,r,i,o,s)=>{
                let l;
                return a("caret", e, t, r, i, o, s),
                w(r) ? l = "" : w(i) ? l = `>=${r}.0.0${n} <${+r + 1}.0.0-0` : w(o) ? l = "0" === r ? `>=${r}.${i}.0${n} <${r}.${+i + 1}.0-0` : `>=${r}.${i}.0${n} <${+r + 1}.0.0-0` : s ? (a("replaceCaret pr", s),
                l = "0" === r ? "0" === i ? `>=${r}.${i}.${o}-${s} <${r}.${i}.${+o + 1}-0` : `>=${r}.${i}.${o}-${s} <${r}.${+i + 1}.0-0` : `>=${r}.${i}.${o}-${s} <${+r + 1}.0.0-0`) : (a("no pr"),
                l = "0" === r ? "0" === i ? `>=${r}.${i}.${o}${n} <${r}.${i}.${+o + 1}-0` : `>=${r}.${i}.${o}${n} <${r}.${+i + 1}.0-0` : `>=${r}.${i}.${o} <${+r + 1}.0.0-0`),
                a("caret return", l),
                l
            }
            ))
        }
          , R = (e,t)=>(a("replaceXRanges", e, t),
        e.split(/\s+/).map((e=>x(e, t))).join(" "))
          , x = (e,t)=>{
            e = e.trim();
            const r = t.loose ? u[c.XRANGELOOSE] : u[c.XRANGE];
            return e.replace(r, ((r,n,i,o,s,l)=>{
                a("xRange", e, r, n, i, o, s, l);
                const u = w(i)
                  , c = u || w(o)
                  , d = c || w(s)
                  , f = d;
                return "=" === n && f && (n = ""),
                l = t.includePrerelease ? "-0" : "",
                u ? r = ">" === n || "<" === n ? "<0.0.0-0" : "*" : n && f ? (c && (o = 0),
                s = 0,
                ">" === n ? (n = ">=",
                c ? (i = +i + 1,
                o = 0,
                s = 0) : (o = +o + 1,
                s = 0)) : "<=" === n && (n = "<",
                c ? i = +i + 1 : o = +o + 1),
                "<" === n && (l = "-0"),
                r = `${n + i}.${o}.${s}${l}`) : c ? r = `>=${i}.0.0${l} <${+i + 1}.0.0-0` : d && (r = `>=${i}.${o}.0${l} <${i}.${+o + 1}.0-0`),
                a("xRange return", r),
                r
            }
            ))
        }
          , T = (e,t)=>(a("replaceStars", e, t),
        e.trim().replace(u[c.STAR], ""))
          , O = (e,t)=>(a("replaceGTE0", e, t),
        e.trim().replace(u[t.includePrerelease ? c.GTE0PRE : c.GTE0], ""))
          , k = e=>(t,r,n,i,o,s,a,l,u,c,d,f,h)=>`${r = w(n) ? "" : w(i) ? `>=${n}.0.0${e ? "-0" : ""}` : w(o) ? `>=${n}.${i}.0${e ? "-0" : ""}` : s ? `>=${r}` : `>=${r}${e ? "-0" : ""}`} ${l = w(u) ? "" : w(c) ? `<${+u + 1}.0.0-0` : w(d) ? `<${u}.${+c + 1}.0-0` : f ? `<=${u}.${c}.${d}-${f}` : e ? `<${u}.${c}.${+d + 1}-0` : `<=${l}`}`.trim()
          , M = (e,t,r)=>{
            for (let r = 0; r < e.length; r++)
                if (!e[r].test(t))
                    return !1;
            if (t.prerelease.length && !r.includePrerelease) {
                for (let r = 0; r < e.length; r++)
                    if (a(e[r].semver),
                    e[r].semver !== s.ANY && e[r].semver.prerelease.length > 0) {
                        const n = e[r].semver;
                        if (n.major === t.major && n.minor === t.minor && n.patch === t.patch)
                            return !0
                    }
                return !1
            }
            return !0
        }
    }
    , {
        "../internal/constants": 221,
        "../internal/debug": 222,
        "../internal/parse-options": 224,
        "../internal/re": 225,
        "./comparator": 193,
        "./semver": 195,
        "lru-cache": 226
    }],
    195: [function(e, t, r) {
        const n = e("../internal/debug")
          , {MAX_LENGTH: i, MAX_SAFE_INTEGER: o} = e("../internal/constants")
          , {safeRe: s, t: a} = e("../internal/re")
          , l = e("../internal/parse-options")
          , {compareIdentifiers: u} = e("../internal/identifiers");
        class c {
            constructor(e, t) {
                if (t = l(t),
                e instanceof c) {
                    if (e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease)
                        return e;
                    e = e.version
                } else if ("string" != typeof e)
                    throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
                if (e.length > i)
                    throw new TypeError(`version is longer than ${i} characters`);
                n("SemVer", e, t),
                this.options = t,
                this.loose = !!t.loose,
                this.includePrerelease = !!t.includePrerelease;
                const r = e.trim().match(t.loose ? s[a.LOOSE] : s[a.FULL]);
                if (!r)
                    throw new TypeError(`Invalid Version: ${e}`);
                if (this.raw = e,
                this.major = +r[1],
                this.minor = +r[2],
                this.patch = +r[3],
                this.major > o || this.major < 0)
                    throw new TypeError("Invalid major version");
                if (this.minor > o || this.minor < 0)
                    throw new TypeError("Invalid minor version");
                if (this.patch > o || this.patch < 0)
                    throw new TypeError("Invalid patch version");
                r[4] ? this.prerelease = r[4].split(".").map((e=>{
                    if (/^[0-9]+$/.test(e)) {
                        const t = +e;
                        if (t >= 0 && t < o)
                            return t
                    }
                    return e
                }
                )) : this.prerelease = [],
                this.build = r[5] ? r[5].split(".") : [],
                this.format()
            }
            format() {
                return this.version = `${this.major}.${this.minor}.${this.patch}`,
                this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`),
                this.version
            }
            toString() {
                return this.version
            }
            compare(e) {
                if (n("SemVer.compare", this.version, this.options, e),
                !(e instanceof c)) {
                    if ("string" == typeof e && e === this.version)
                        return 0;
                    e = new c(e,this.options)
                }
                return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e)
            }
            compareMain(e) {
                return e instanceof c || (e = new c(e,this.options)),
                u(this.major, e.major) || u(this.minor, e.minor) || u(this.patch, e.patch)
            }
            comparePre(e) {
                if (e instanceof c || (e = new c(e,this.options)),
                this.prerelease.length && !e.prerelease.length)
                    return -1;
                if (!this.prerelease.length && e.prerelease.length)
                    return 1;
                if (!this.prerelease.length && !e.prerelease.length)
                    return 0;
                let t = 0;
                do {
                    const r = this.prerelease[t]
                      , i = e.prerelease[t];
                    if (n("prerelease compare", t, r, i),
                    void 0 === r && void 0 === i)
                        return 0;
                    if (void 0 === i)
                        return 1;
                    if (void 0 === r)
                        return -1;
                    if (r !== i)
                        return u(r, i)
                } while (++t)
            }
            compareBuild(e) {
                e instanceof c || (e = new c(e,this.options));
                let t = 0;
                do {
                    const r = this.build[t]
                      , i = e.build[t];
                    if (n("prerelease compare", t, r, i),
                    void 0 === r && void 0 === i)
                        return 0;
                    if (void 0 === i)
                        return 1;
                    if (void 0 === r)
                        return -1;
                    if (r !== i)
                        return u(r, i)
                } while (++t)
            }
            inc(e, t, r) {
                switch (e) {
                case "premajor":
                    this.prerelease.length = 0,
                    this.patch = 0,
                    this.minor = 0,
                    this.major++,
                    this.inc("pre", t, r);
                    break;
                case "preminor":
                    this.prerelease.length = 0,
                    this.patch = 0,
                    this.minor++,
                    this.inc("pre", t, r);
                    break;
                case "prepatch":
                    this.prerelease.length = 0,
                    this.inc("patch", t, r),
                    this.inc("pre", t, r);
                    break;
                case "prerelease":
                    0 === this.prerelease.length && this.inc("patch", t, r),
                    this.inc("pre", t, r);
                    break;
                case "major":
                    0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++,
                    this.minor = 0,
                    this.patch = 0,
                    this.prerelease = [];
                    break;
                case "minor":
                    0 === this.patch && 0 !== this.prerelease.length || this.minor++,
                    this.patch = 0,
                    this.prerelease = [];
                    break;
                case "patch":
                    0 === this.prerelease.length && this.patch++,
                    this.prerelease = [];
                    break;
                case "pre":
                    {
                        const e = Number(r) ? 1 : 0;
                        if (!t && !1 === r)
                            throw new Error("invalid increment argument: identifier is empty");
                        if (0 === this.prerelease.length)
                            this.prerelease = [e];
                        else {
                            let n = this.prerelease.length;
                            for (; --n >= 0; )
                                "number" == typeof this.prerelease[n] && (this.prerelease[n]++,
                                n = -2);
                            if (-1 === n) {
                                if (t === this.prerelease.join(".") && !1 === r)
                                    throw new Error("invalid increment argument: identifier already exists");
                                this.prerelease.push(e)
                            }
                        }
                        if (t) {
                            let n = [t, e];
                            !1 === r && (n = [t]),
                            0 === u(this.prerelease[0], t) ? isNaN(this.prerelease[1]) && (this.prerelease = n) : this.prerelease = n
                        }
                        break
                    }
                default:
                    throw new Error(`invalid increment argument: ${e}`)
                }
                return this.raw = this.format(),
                this.build.length && (this.raw += `+${this.build.join(".")}`),
                this
            }
        }
        t.exports = c
    }
    , {
        "../internal/constants": 221,
        "../internal/debug": 222,
        "../internal/identifiers": 223,
        "../internal/parse-options": 224,
        "../internal/re": 225
    }],
    196: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e,t)=>{
            const r = n(e.trim().replace(/^[=v]+/, ""), t);
            return r ? r.version : null
        }
    }
    , {
        "./parse": 212
    }],
    197: [function(e, t, r) {
        const n = e("./eq")
          , i = e("./neq")
          , o = e("./gt")
          , s = e("./gte")
          , a = e("./lt")
          , l = e("./lte");
        t.exports = (e,t,r,u)=>{
            switch (t) {
            case "===":
                return "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e === r;
            case "!==":
                return "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e !== r;
            case "":
            case "=":
            case "==":
                return n(e, r, u);
            case "!=":
                return i(e, r, u);
            case ">":
                return o(e, r, u);
            case ">=":
                return s(e, r, u);
            case "<":
                return a(e, r, u);
            case "<=":
                return l(e, r, u);
            default:
                throw new TypeError(`Invalid operator: ${t}`)
            }
        }
    }
    , {
        "./eq": 203,
        "./gt": 204,
        "./gte": 205,
        "./lt": 207,
        "./lte": 208,
        "./neq": 211
    }],
    198: [function(e, t, r) {
        const n = e("../classes/semver")
          , i = e("./parse")
          , {safeRe: o, t: s} = e("../internal/re");
        t.exports = (e,t)=>{
            if (e instanceof n)
                return e;
            if ("number" == typeof e && (e = String(e)),
            "string" != typeof e)
                return null;
            let r = null;
            if ((t = t || {}).rtl) {
                let t;
                for (; (t = o[s.COERCERTL].exec(e)) && (!r || r.index + r[0].length !== e.length); )
                    r && t.index + t[0].length === r.index + r[0].length || (r = t),
                    o[s.COERCERTL].lastIndex = t.index + t[1].length + t[2].length;
                o[s.COERCERTL].lastIndex = -1
            } else
                r = e.match(o[s.COERCE]);
            return null === r ? null : i(`${r[2]}.${r[3] || "0"}.${r[4] || "0"}`, t)
        }
    }
    , {
        "../classes/semver": 195,
        "../internal/re": 225,
        "./parse": 212
    }],
    199: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t,r)=>{
            const i = new n(e,r)
              , o = new n(t,r);
            return i.compare(o) || i.compareBuild(o)
        }
    }
    , {
        "../classes/semver": 195
    }],
    200: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t)=>n(e, t, !0)
    }
    , {
        "./compare": 201
    }],
    201: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t,r)=>new n(e,r).compare(new n(t,r))
    }
    , {
        "../classes/semver": 195
    }],
    202: [function(e, t, r) {
        const n = e("./parse.js");
        t.exports = (e,t)=>{
            const r = n(e, null, !0)
              , i = n(t, null, !0)
              , o = r.compare(i);
            if (0 === o)
                return null;
            const s = o > 0
              , a = s ? r : i
              , l = s ? i : r
              , u = !!a.prerelease.length;
            if (!!l.prerelease.length && !u)
                return l.patch || l.minor ? a.patch ? "patch" : a.minor ? "minor" : "major" : "major";
            const c = u ? "pre" : "";
            return r.major !== i.major ? c + "major" : r.minor !== i.minor ? c + "minor" : r.patch !== i.patch ? c + "patch" : "prerelease"
        }
    }
    , {
        "./parse.js": 212
    }],
    203: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>0 === n(e, t, r)
    }
    , {
        "./compare": 201
    }],
    204: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>n(e, t, r) > 0
    }
    , {
        "./compare": 201
    }],
    205: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>n(e, t, r) >= 0
    }
    , {
        "./compare": 201
    }],
    206: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t,r,i,o)=>{
            "string" == typeof r && (o = i,
            i = r,
            r = void 0);
            try {
                return new n(e instanceof n ? e.version : e,r).inc(t, i, o).version
            } catch (e) {
                return null
            }
        }
    }
    , {
        "../classes/semver": 195
    }],
    207: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>n(e, t, r) < 0
    }
    , {
        "./compare": 201
    }],
    208: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>n(e, t, r) <= 0
    }
    , {
        "./compare": 201
    }],
    209: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t)=>new n(e,t).major
    }
    , {
        "../classes/semver": 195
    }],
    210: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t)=>new n(e,t).minor
    }
    , {
        "../classes/semver": 195
    }],
    211: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>0 !== n(e, t, r)
    }
    , {
        "./compare": 201
    }],
    212: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t,r=!1)=>{
            if (e instanceof n)
                return e;
            try {
                return new n(e,t)
            } catch (e) {
                if (!r)
                    return null;
                throw e
            }
        }
    }
    , {
        "../classes/semver": 195
    }],
    213: [function(e, t, r) {
        const n = e("../classes/semver");
        t.exports = (e,t)=>new n(e,t).patch
    }
    , {
        "../classes/semver": 195
    }],
    214: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e,t)=>{
            const r = n(e, t);
            return r && r.prerelease.length ? r.prerelease : null
        }
    }
    , {
        "./parse": 212
    }],
    215: [function(e, t, r) {
        const n = e("./compare");
        t.exports = (e,t,r)=>n(t, e, r)
    }
    , {
        "./compare": 201
    }],
    216: [function(e, t, r) {
        const n = e("./compare-build");
        t.exports = (e,t)=>e.sort(((e,r)=>n(r, e, t)))
    }
    , {
        "./compare-build": 199
    }],
    217: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e,t,r)=>{
            try {
                t = new n(t,r)
            } catch (e) {
                return !1
            }
            return t.test(e)
        }
    }
    , {
        "../classes/range": 194
    }],
    218: [function(e, t, r) {
        const n = e("./compare-build");
        t.exports = (e,t)=>e.sort(((e,r)=>n(e, r, t)))
    }
    , {
        "./compare-build": 199
    }],
    219: [function(e, t, r) {
        const n = e("./parse");
        t.exports = (e,t)=>{
            const r = n(e, t);
            return r ? r.version : null
        }
    }
    , {
        "./parse": 212
    }],
    220: [function(e, t, r) {
        const n = e("./internal/re")
          , i = e("./internal/constants")
          , o = e("./classes/semver")
          , s = e("./internal/identifiers")
          , a = e("./functions/parse")
          , l = e("./functions/valid")
          , u = e("./functions/clean")
          , c = e("./functions/inc")
          , d = e("./functions/diff")
          , f = e("./functions/major")
          , h = e("./functions/minor")
          , p = e("./functions/patch")
          , g = e("./functions/prerelease")
          , m = e("./functions/compare")
          , b = e("./functions/rcompare")
          , y = e("./functions/compare-loose")
          , v = e("./functions/compare-build")
          , w = e("./functions/sort")
          , _ = e("./functions/rsort")
          , E = e("./functions/gt")
          , S = e("./functions/lt")
          , A = e("./functions/eq")
          , R = e("./functions/neq")
          , x = e("./functions/gte")
          , T = e("./functions/lte")
          , O = e("./functions/cmp")
          , k = e("./functions/coerce")
          , M = e("./classes/comparator")
          , N = e("./classes/range")
          , j = e("./functions/satisfies")
          , P = e("./ranges/to-comparators")
          , I = e("./ranges/max-satisfying")
          , C = e("./ranges/min-satisfying")
          , L = e("./ranges/min-version")
          , D = e("./ranges/valid")
          , $ = e("./ranges/outside")
          , B = e("./ranges/gtr")
          , F = e("./ranges/ltr")
          , U = e("./ranges/intersects")
          , W = e("./ranges/simplify")
          , V = e("./ranges/subset");
        t.exports = {
            parse: a,
            valid: l,
            clean: u,
            inc: c,
            diff: d,
            major: f,
            minor: h,
            patch: p,
            prerelease: g,
            compare: m,
            rcompare: b,
            compareLoose: y,
            compareBuild: v,
            sort: w,
            rsort: _,
            gt: E,
            lt: S,
            eq: A,
            neq: R,
            gte: x,
            lte: T,
            cmp: O,
            coerce: k,
            Comparator: M,
            Range: N,
            satisfies: j,
            toComparators: P,
            maxSatisfying: I,
            minSatisfying: C,
            minVersion: L,
            validRange: D,
            outside: $,
            gtr: B,
            ltr: F,
            intersects: U,
            simplifyRange: W,
            subset: V,
            SemVer: o,
            re: n.re,
            src: n.src,
            tokens: n.t,
            SEMVER_SPEC_VERSION: i.SEMVER_SPEC_VERSION,
            RELEASE_TYPES: i.RELEASE_TYPES,
            compareIdentifiers: s.compareIdentifiers,
            rcompareIdentifiers: s.rcompareIdentifiers
        }
    }
    , {
        "./classes/comparator": 193,
        "./classes/range": 194,
        "./classes/semver": 195,
        "./functions/clean": 196,
        "./functions/cmp": 197,
        "./functions/coerce": 198,
        "./functions/compare": 201,
        "./functions/compare-build": 199,
        "./functions/compare-loose": 200,
        "./functions/diff": 202,
        "./functions/eq": 203,
        "./functions/gt": 204,
        "./functions/gte": 205,
        "./functions/inc": 206,
        "./functions/lt": 207,
        "./functions/lte": 208,
        "./functions/major": 209,
        "./functions/minor": 210,
        "./functions/neq": 211,
        "./functions/parse": 212,
        "./functions/patch": 213,
        "./functions/prerelease": 214,
        "./functions/rcompare": 215,
        "./functions/rsort": 216,
        "./functions/satisfies": 217,
        "./functions/sort": 218,
        "./functions/valid": 219,
        "./internal/constants": 221,
        "./internal/identifiers": 223,
        "./internal/re": 225,
        "./ranges/gtr": 227,
        "./ranges/intersects": 228,
        "./ranges/ltr": 229,
        "./ranges/max-satisfying": 230,
        "./ranges/min-satisfying": 231,
        "./ranges/min-version": 232,
        "./ranges/outside": 233,
        "./ranges/simplify": 234,
        "./ranges/subset": 235,
        "./ranges/to-comparators": 236,
        "./ranges/valid": 237
    }],
    221: [function(e, t, r) {
        const n = Number.MAX_SAFE_INTEGER || 9007199254740991;
        t.exports = {
            MAX_LENGTH: 256,
            MAX_SAFE_COMPONENT_LENGTH: 16,
            MAX_SAFE_BUILD_LENGTH: 250,
            MAX_SAFE_INTEGER: n,
            RELEASE_TYPES: ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"],
            SEMVER_SPEC_VERSION: "2.0.0",
            FLAG_INCLUDE_PRERELEASE: 1,
            FLAG_LOOSE: 2
        }
    }
    , {}],
    222: [function(e, t, r) {
        (function(e) {
            (function() {
                const r = ("object" == typeof e && e.env,
                ()=>{}
                );
                t.exports = r
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178
    }],
    223: [function(e, t, r) {
        const n = /^[0-9]+$/
          , i = (e,t)=>{
            const r = n.test(e)
              , i = n.test(t);
            return r && i && (e = +e,
            t = +t),
            e === t ? 0 : r && !i ? -1 : i && !r ? 1 : e < t ? -1 : 1
        }
        ;
        t.exports = {
            compareIdentifiers: i,
            rcompareIdentifiers: (e,t)=>i(t, e)
        }
    }
    , {}],
    224: [function(e, t, r) {
        const n = Object.freeze({
            loose: !0
        })
          , i = Object.freeze({});
        t.exports = e=>e ? "object" != typeof e ? n : e : i
    }
    , {}],
    225: [function(e, t, r) {
        const {MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: i, MAX_LENGTH: o} = e("./constants")
          , s = e("./debug")
          , a = (r = t.exports = {}).re = []
          , l = r.safeRe = []
          , u = r.src = []
          , c = r.t = {};
        let d = 0;
        const f = "[a-zA-Z0-9-]"
          , h = [["\\s", 1], ["\\d", o], [f, i]]
          , p = (e,t,r)=>{
            const n = (e=>{
                for (const [t,r] of h)
                    e = e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);
                return e
            }
            )(t)
              , i = d++;
            s(e, i, t),
            c[e] = i,
            u[i] = t,
            a[i] = new RegExp(t,r ? "g" : void 0),
            l[i] = new RegExp(n,r ? "g" : void 0)
        }
        ;
        p("NUMERICIDENTIFIER", "0|[1-9]\\d*"),
        p("NUMERICIDENTIFIERLOOSE", "\\d+"),
        p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`),
        p("MAINVERSION", `(${u[c.NUMERICIDENTIFIER]})\\.(${u[c.NUMERICIDENTIFIER]})\\.(${u[c.NUMERICIDENTIFIER]})`),
        p("MAINVERSIONLOOSE", `(${u[c.NUMERICIDENTIFIERLOOSE]})\\.(${u[c.NUMERICIDENTIFIERLOOSE]})\\.(${u[c.NUMERICIDENTIFIERLOOSE]})`),
        p("PRERELEASEIDENTIFIER", `(?:${u[c.NUMERICIDENTIFIER]}|${u[c.NONNUMERICIDENTIFIER]})`),
        p("PRERELEASEIDENTIFIERLOOSE", `(?:${u[c.NUMERICIDENTIFIERLOOSE]}|${u[c.NONNUMERICIDENTIFIER]})`),
        p("PRERELEASE", `(?:-(${u[c.PRERELEASEIDENTIFIER]}(?:\\.${u[c.PRERELEASEIDENTIFIER]})*))`),
        p("PRERELEASELOOSE", `(?:-?(${u[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${u[c.PRERELEASEIDENTIFIERLOOSE]})*))`),
        p("BUILDIDENTIFIER", `${f}+`),
        p("BUILD", `(?:\\+(${u[c.BUILDIDENTIFIER]}(?:\\.${u[c.BUILDIDENTIFIER]})*))`),
        p("FULLPLAIN", `v?${u[c.MAINVERSION]}${u[c.PRERELEASE]}?${u[c.BUILD]}?`),
        p("FULL", `^${u[c.FULLPLAIN]}$`),
        p("LOOSEPLAIN", `[v=\\s]*${u[c.MAINVERSIONLOOSE]}${u[c.PRERELEASELOOSE]}?${u[c.BUILD]}?`),
        p("LOOSE", `^${u[c.LOOSEPLAIN]}$`),
        p("GTLT", "((?:<|>)?=?)"),
        p("XRANGEIDENTIFIERLOOSE", `${u[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),
        p("XRANGEIDENTIFIER", `${u[c.NUMERICIDENTIFIER]}|x|X|\\*`),
        p("XRANGEPLAIN", `[v=\\s]*(${u[c.XRANGEIDENTIFIER]})(?:\\.(${u[c.XRANGEIDENTIFIER]})(?:\\.(${u[c.XRANGEIDENTIFIER]})(?:${u[c.PRERELEASE]})?${u[c.BUILD]}?)?)?`),
        p("XRANGEPLAINLOOSE", `[v=\\s]*(${u[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${u[c.XRANGEIDENTIFIERLOOSE]})(?:${u[c.PRERELEASELOOSE]})?${u[c.BUILD]}?)?)?`),
        p("XRANGE", `^${u[c.GTLT]}\\s*${u[c.XRANGEPLAIN]}$`),
        p("XRANGELOOSE", `^${u[c.GTLT]}\\s*${u[c.XRANGEPLAINLOOSE]}$`),
        p("COERCE", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?(?:$|[^\\d])`),
        p("COERCERTL", u[c.COERCE], !0),
        p("LONETILDE", "(?:~>?)"),
        p("TILDETRIM", `(\\s*)${u[c.LONETILDE]}\\s+`, !0),
        r.tildeTrimReplace = "$1~",
        p("TILDE", `^${u[c.LONETILDE]}${u[c.XRANGEPLAIN]}$`),
        p("TILDELOOSE", `^${u[c.LONETILDE]}${u[c.XRANGEPLAINLOOSE]}$`),
        p("LONECARET", "(?:\\^)"),
        p("CARETTRIM", `(\\s*)${u[c.LONECARET]}\\s+`, !0),
        r.caretTrimReplace = "$1^",
        p("CARET", `^${u[c.LONECARET]}${u[c.XRANGEPLAIN]}$`),
        p("CARETLOOSE", `^${u[c.LONECARET]}${u[c.XRANGEPLAINLOOSE]}$`),
        p("COMPARATORLOOSE", `^${u[c.GTLT]}\\s*(${u[c.LOOSEPLAIN]})$|^$`),
        p("COMPARATOR", `^${u[c.GTLT]}\\s*(${u[c.FULLPLAIN]})$|^$`),
        p("COMPARATORTRIM", `(\\s*)${u[c.GTLT]}\\s*(${u[c.LOOSEPLAIN]}|${u[c.XRANGEPLAIN]})`, !0),
        r.comparatorTrimReplace = "$1$2$3",
        p("HYPHENRANGE", `^\\s*(${u[c.XRANGEPLAIN]})\\s+-\\s+(${u[c.XRANGEPLAIN]})\\s*$`),
        p("HYPHENRANGELOOSE", `^\\s*(${u[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${u[c.XRANGEPLAINLOOSE]})\\s*$`),
        p("STAR", "(<|>)?=?\\s*\\*"),
        p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"),
        p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
    }
    , {
        "./constants": 221,
        "./debug": 222
    }],
    226: [function(e, t, r) {
        "use strict";
        const n = e("yallist")
          , i = Symbol("max")
          , o = Symbol("length")
          , s = Symbol("lengthCalculator")
          , a = Symbol("allowStale")
          , l = Symbol("maxAge")
          , u = Symbol("dispose")
          , c = Symbol("noDisposeOnSet")
          , d = Symbol("lruList")
          , f = Symbol("cache")
          , h = Symbol("updateAgeOnGet")
          , p = ()=>1;
        const g = (e,t,r)=>{
            const n = e[f].get(t);
            if (n) {
                const t = n.value;
                if (m(e, t)) {
                    if (y(e, n),
                    !e[a])
                        return
                } else
                    r && (e[h] && (n.value.now = Date.now()),
                    e[d].unshiftNode(n));
                return t.value
            }
        }
          , m = (e,t)=>{
            if (!t || !t.maxAge && !e[l])
                return !1;
            const r = Date.now() - t.now;
            return t.maxAge ? r > t.maxAge : e[l] && r > e[l]
        }
          , b = e=>{
            if (e[o] > e[i])
                for (let t = e[d].tail; e[o] > e[i] && null !== t; ) {
                    const r = t.prev;
                    y(e, t),
                    t = r
                }
        }
          , y = (e,t)=>{
            if (t) {
                const r = t.value;
                e[u] && e[u](r.key, r.value),
                e[o] -= r.length,
                e[f].delete(r.key),
                e[d].removeNode(t)
            }
        }
        ;
        class v {
            constructor(e, t, r, n, i) {
                this.key = e,
                this.value = t,
                this.length = r,
                this.now = n,
                this.maxAge = i || 0
            }
        }
        const w = (e,t,r,n)=>{
            let i = r.value;
            m(e, i) && (y(e, r),
            e[a] || (i = void 0)),
            i && t.call(n, i.value, i.key, e)
        }
        ;
        t.exports = class {
            constructor(e) {
                if ("number" == typeof e && (e = {
                    max: e
                }),
                e || (e = {}),
                e.max && ("number" != typeof e.max || e.max < 0))
                    throw new TypeError("max must be a non-negative number");
                this[i] = e.max || 1 / 0;
                const t = e.length || p;
                if (this[s] = "function" != typeof t ? p : t,
                this[a] = e.stale || !1,
                e.maxAge && "number" != typeof e.maxAge)
                    throw new TypeError("maxAge must be a number");
                this[l] = e.maxAge || 0,
                this[u] = e.dispose,
                this[c] = e.noDisposeOnSet || !1,
                this[h] = e.updateAgeOnGet || !1,
                this.reset()
            }
            set max(e) {
                if ("number" != typeof e || e < 0)
                    throw new TypeError("max must be a non-negative number");
                this[i] = e || 1 / 0,
                b(this)
            }
            get max() {
                return this[i]
            }
            set allowStale(e) {
                this[a] = !!e
            }
            get allowStale() {
                return this[a]
            }
            set maxAge(e) {
                if ("number" != typeof e)
                    throw new TypeError("maxAge must be a non-negative number");
                this[l] = e,
                b(this)
            }
            get maxAge() {
                return this[l]
            }
            set lengthCalculator(e) {
                "function" != typeof e && (e = p),
                e !== this[s] && (this[s] = e,
                this[o] = 0,
                this[d].forEach((e=>{
                    e.length = this[s](e.value, e.key),
                    this[o] += e.length
                }
                ))),
                b(this)
            }
            get lengthCalculator() {
                return this[s]
            }
            get length() {
                return this[o]
            }
            get itemCount() {
                return this[d].length
            }
            rforEach(e, t) {
                t = t || this;
                for (let r = this[d].tail; null !== r; ) {
                    const n = r.prev;
                    w(this, e, r, t),
                    r = n
                }
            }
            forEach(e, t) {
                t = t || this;
                for (let r = this[d].head; null !== r; ) {
                    const n = r.next;
                    w(this, e, r, t),
                    r = n
                }
            }
            keys() {
                return this[d].toArray().map((e=>e.key))
            }
            values() {
                return this[d].toArray().map((e=>e.value))
            }
            reset() {
                this[u] && this[d] && this[d].length && this[d].forEach((e=>this[u](e.key, e.value))),
                this[f] = new Map,
                this[d] = new n,
                this[o] = 0
            }
            dump() {
                return this[d].map((e=>!m(this, e) && {
                    k: e.key,
                    v: e.value,
                    e: e.now + (e.maxAge || 0)
                })).toArray().filter((e=>e))
            }
            dumpLru() {
                return this[d]
            }
            set(e, t, r) {
                if ((r = r || this[l]) && "number" != typeof r)
                    throw new TypeError("maxAge must be a number");
                const n = r ? Date.now() : 0
                  , a = this[s](t, e);
                if (this[f].has(e)) {
                    if (a > this[i])
                        return y(this, this[f].get(e)),
                        !1;
                    const s = this[f].get(e).value;
                    return this[u] && (this[c] || this[u](e, s.value)),
                    s.now = n,
                    s.maxAge = r,
                    s.value = t,
                    this[o] += a - s.length,
                    s.length = a,
                    this.get(e),
                    b(this),
                    !0
                }
                const h = new v(e,t,a,n,r);
                return h.length > this[i] ? (this[u] && this[u](e, t),
                !1) : (this[o] += h.length,
                this[d].unshift(h),
                this[f].set(e, this[d].head),
                b(this),
                !0)
            }
            has(e) {
                if (!this[f].has(e))
                    return !1;
                const t = this[f].get(e).value;
                return !m(this, t)
            }
            get(e) {
                return g(this, e, !0)
            }
            peek(e) {
                return g(this, e, !1)
            }
            pop() {
                const e = this[d].tail;
                return e ? (y(this, e),
                e.value) : null
            }
            del(e) {
                y(this, this[f].get(e))
            }
            load(e) {
                this.reset();
                const t = Date.now();
                for (let r = e.length - 1; r >= 0; r--) {
                    const n = e[r]
                      , i = n.e || 0;
                    if (0 === i)
                        this.set(n.k, n.v);
                    else {
                        const e = i - t;
                        e > 0 && this.set(n.k, n.v, e)
                    }
                }
            }
            prune() {
                this[f].forEach(((e,t)=>g(this, t, !1)))
            }
        }
    }
    , {
        yallist: 262
    }],
    227: [function(e, t, r) {
        const n = e("./outside");
        t.exports = (e,t,r)=>n(e, t, ">", r)
    }
    , {
        "./outside": 233
    }],
    228: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e,t,r)=>(e = new n(e,r),
        t = new n(t,r),
        e.intersects(t, r))
    }
    , {
        "../classes/range": 194
    }],
    229: [function(e, t, r) {
        const n = e("./outside");
        t.exports = (e,t,r)=>n(e, t, "<", r)
    }
    , {
        "./outside": 233
    }],
    230: [function(e, t, r) {
        const n = e("../classes/semver")
          , i = e("../classes/range");
        t.exports = (e,t,r)=>{
            let o = null
              , s = null
              , a = null;
            try {
                a = new i(t,r)
            } catch (e) {
                return null
            }
            return e.forEach((e=>{
                a.test(e) && (o && -1 !== s.compare(e) || (o = e,
                s = new n(o,r)))
            }
            )),
            o
        }
    }
    , {
        "../classes/range": 194,
        "../classes/semver": 195
    }],
    231: [function(e, t, r) {
        const n = e("../classes/semver")
          , i = e("../classes/range");
        t.exports = (e,t,r)=>{
            let o = null
              , s = null
              , a = null;
            try {
                a = new i(t,r)
            } catch (e) {
                return null
            }
            return e.forEach((e=>{
                a.test(e) && (o && 1 !== s.compare(e) || (o = e,
                s = new n(o,r)))
            }
            )),
            o
        }
    }
    , {
        "../classes/range": 194,
        "../classes/semver": 195
    }],
    232: [function(e, t, r) {
        const n = e("../classes/semver")
          , i = e("../classes/range")
          , o = e("../functions/gt");
        t.exports = (e,t)=>{
            e = new i(e,t);
            let r = new n("0.0.0");
            if (e.test(r))
                return r;
            if (r = new n("0.0.0-0"),
            e.test(r))
                return r;
            r = null;
            for (let t = 0; t < e.set.length; ++t) {
                const i = e.set[t];
                let s = null;
                i.forEach((e=>{
                    const t = new n(e.semver.version);
                    switch (e.operator) {
                    case ">":
                        0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0),
                        t.raw = t.format();
                    case "":
                    case ">=":
                        s && !o(t, s) || (s = t);
                        break;
                    case "<":
                    case "<=":
                        break;
                    default:
                        throw new Error(`Unexpected operation: ${e.operator}`)
                    }
                }
                )),
                !s || r && !o(r, s) || (r = s)
            }
            return r && e.test(r) ? r : null
        }
    }
    , {
        "../classes/range": 194,
        "../classes/semver": 195,
        "../functions/gt": 204
    }],
    233: [function(e, t, r) {
        const n = e("../classes/semver")
          , i = e("../classes/comparator")
          , {ANY: o} = i
          , s = e("../classes/range")
          , a = e("../functions/satisfies")
          , l = e("../functions/gt")
          , u = e("../functions/lt")
          , c = e("../functions/lte")
          , d = e("../functions/gte");
        t.exports = (e,t,r,f)=>{
            let h, p, g, m, b;
            switch (e = new n(e,f),
            t = new s(t,f),
            r) {
            case ">":
                h = l,
                p = c,
                g = u,
                m = ">",
                b = ">=";
                break;
            case "<":
                h = u,
                p = d,
                g = l,
                m = "<",
                b = "<=";
                break;
            default:
                throw new TypeError('Must provide a hilo val of "<" or ">"')
            }
            if (a(e, t, f))
                return !1;
            for (let r = 0; r < t.set.length; ++r) {
                const n = t.set[r];
                let s = null
                  , a = null;
                if (n.forEach((e=>{
                    e.semver === o && (e = new i(">=0.0.0")),
                    s = s || e,
                    a = a || e,
                    h(e.semver, s.semver, f) ? s = e : g(e.semver, a.semver, f) && (a = e)
                }
                )),
                s.operator === m || s.operator === b)
                    return !1;
                if ((!a.operator || a.operator === m) && p(e, a.semver))
                    return !1;
                if (a.operator === b && g(e, a.semver))
                    return !1
            }
            return !0
        }
    }
    , {
        "../classes/comparator": 193,
        "../classes/range": 194,
        "../classes/semver": 195,
        "../functions/gt": 204,
        "../functions/gte": 205,
        "../functions/lt": 207,
        "../functions/lte": 208,
        "../functions/satisfies": 217
    }],
    234: [function(e, t, r) {
        const n = e("../functions/satisfies.js")
          , i = e("../functions/compare.js");
        t.exports = (e,t,r)=>{
            const o = [];
            let s = null
              , a = null;
            const l = e.sort(((e,t)=>i(e, t, r)));
            for (const e of l) {
                n(e, t, r) ? (a = e,
                s || (s = e)) : (a && o.push([s, a]),
                a = null,
                s = null)
            }
            s && o.push([s, null]);
            const u = [];
            for (const [e,t] of o)
                e === t ? u.push(e) : t || e !== l[0] ? t ? e === l[0] ? u.push(`<=${t}`) : u.push(`${e} - ${t}`) : u.push(`>=${e}`) : u.push("*");
            const c = u.join(" || ")
              , d = "string" == typeof t.raw ? t.raw : String(t);
            return c.length < d.length ? c : t
        }
    }
    , {
        "../functions/compare.js": 201,
        "../functions/satisfies.js": 217
    }],
    235: [function(e, t, r) {
        const n = e("../classes/range.js")
          , i = e("../classes/comparator.js")
          , {ANY: o} = i
          , s = e("../functions/satisfies.js")
          , a = e("../functions/compare.js")
          , l = [new i(">=0.0.0-0")]
          , u = [new i(">=0.0.0")]
          , c = (e,t,r)=>{
            if (e === t)
                return !0;
            if (1 === e.length && e[0].semver === o) {
                if (1 === t.length && t[0].semver === o)
                    return !0;
                e = r.includePrerelease ? l : u
            }
            if (1 === t.length && t[0].semver === o) {
                if (r.includePrerelease)
                    return !0;
                t = u
            }
            const n = new Set;
            let i, c, h, p, g, m, b;
            for (const t of e)
                ">" === t.operator || ">=" === t.operator ? i = d(i, t, r) : "<" === t.operator || "<=" === t.operator ? c = f(c, t, r) : n.add(t.semver);
            if (n.size > 1)
                return null;
            if (i && c) {
                if (h = a(i.semver, c.semver, r),
                h > 0)
                    return null;
                if (0 === h && (">=" !== i.operator || "<=" !== c.operator))
                    return null
            }
            for (const e of n) {
                if (i && !s(e, String(i), r))
                    return null;
                if (c && !s(e, String(c), r))
                    return null;
                for (const n of t)
                    if (!s(e, String(n), r))
                        return !1;
                return !0
            }
            let y = !(!c || r.includePrerelease || !c.semver.prerelease.length) && c.semver
              , v = !(!i || r.includePrerelease || !i.semver.prerelease.length) && i.semver;
            y && 1 === y.prerelease.length && "<" === c.operator && 0 === y.prerelease[0] && (y = !1);
            for (const e of t) {
                if (b = b || ">" === e.operator || ">=" === e.operator,
                m = m || "<" === e.operator || "<=" === e.operator,
                i)
                    if (v && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === v.major && e.semver.minor === v.minor && e.semver.patch === v.patch && (v = !1),
                    ">" === e.operator || ">=" === e.operator) {
                        if (p = d(i, e, r),
                        p === e && p !== i)
                            return !1
                    } else if (">=" === i.operator && !s(i.semver, String(e), r))
                        return !1;
                if (c)
                    if (y && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === y.major && e.semver.minor === y.minor && e.semver.patch === y.patch && (y = !1),
                    "<" === e.operator || "<=" === e.operator) {
                        if (g = f(c, e, r),
                        g === e && g !== c)
                            return !1
                    } else if ("<=" === c.operator && !s(c.semver, String(e), r))
                        return !1;
                if (!e.operator && (c || i) && 0 !== h)
                    return !1
            }
            return !(i && m && !c && 0 !== h) && (!(c && b && !i && 0 !== h) && (!v && !y))
        }
          , d = (e,t,r)=>{
            if (!e)
                return t;
            const n = a(e.semver, t.semver, r);
            return n > 0 ? e : n < 0 || ">" === t.operator && ">=" === e.operator ? t : e
        }
          , f = (e,t,r)=>{
            if (!e)
                return t;
            const n = a(e.semver, t.semver, r);
            return n < 0 ? e : n > 0 || "<" === t.operator && "<=" === e.operator ? t : e
        }
        ;
        t.exports = (e,t,r={})=>{
            if (e === t)
                return !0;
            e = new n(e,r),
            t = new n(t,r);
            let i = !1;
            e: for (const n of e.set) {
                for (const e of t.set) {
                    const t = c(n, e, r);
                    if (i = i || null !== t,
                    t)
                        continue e
                }
                if (i)
                    return !1
            }
            return !0
        }
    }
    , {
        "../classes/comparator.js": 193,
        "../classes/range.js": 194,
        "../functions/compare.js": 201,
        "../functions/satisfies.js": 217
    }],
    236: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e,t)=>new n(e,t).set.map((e=>e.map((e=>e.value)).join(" ").trim().split(" ")))
    }
    , {
        "../classes/range": 194
    }],
    237: [function(e, t, r) {
        const n = e("../classes/range");
        t.exports = (e,t)=>{
            try {
                return new n(e,t).range || "*"
            } catch (e) {
                return null
            }
        }
    }
    , {
        "../classes/range": 194
    }],
    238: [function(e, t, r) {
        arguments[4][190][0].apply(r, arguments)
    }
    , {
        dup: 190,
        "safe-buffer": 192
    }],
    239: [function(e, t, r) {
        const n = /^[-+]?0x[a-fA-F0-9]+$/
          , i = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
        !Number.parseInt && window.parseInt && (Number.parseInt = window.parseInt),
        !Number.parseFloat && window.parseFloat && (Number.parseFloat = window.parseFloat);
        const o = {
            hex: !0,
            leadingZeros: !0,
            decimalPoint: ".",
            eNotation: !0
        };
        t.exports = function(e, t={}) {
            if (t = Object.assign({}, o, t),
            !e || "string" != typeof e)
                return e;
            let r = e.trim();
            if (void 0 !== t.skipLike && t.skipLike.test(r))
                return e;
            if (t.hex && n.test(r))
                return Number.parseInt(r, 16);
            {
                const n = i.exec(r);
                if (n) {
                    const i = n[1]
                      , o = n[2];
                    let s = function(e) {
                        if (e && -1 !== e.indexOf("."))
                            return "." === (e = e.replace(/0+$/, "")) ? e = "0" : "." === e[0] ? e = "0" + e : "." === e[e.length - 1] && (e = e.substr(0, e.length - 1)),
                            e;
                        return e
                    }(n[3]);
                    const a = n[4] || n[6];
                    if (!t.leadingZeros && o.length > 0 && i && "." !== r[2])
                        return e;
                    if (!t.leadingZeros && o.length > 0 && !i && "." !== r[1])
                        return e;
                    {
                        const n = Number(r)
                          , l = "" + n;
                        return -1 !== l.search(/[eE]/) || a ? t.eNotation ? n : e : -1 !== r.indexOf(".") ? "0" === l && "" === s || l === s || i && l === "-" + s ? n : e : o ? s === l || i + s === l ? n : e : r === l || r === i + l ? n : e
                    }
                }
                return e
            }
        }
    }
    , {}],
    240: [function(e, t, r) {
        !function(e, n) {
            "object" == typeof r && void 0 !== t ? n(r) : "function" == typeof define && define.amd ? define(["exports"], n) : n((e = "undefined" != typeof globalThis ? globalThis : e || self).Superstruct = {})
        }(this, (function(e) {
            "use strict";
            class t extends TypeError {
                constructor(e, t) {
                    let r;
                    const {message: n, explanation: i, ...o} = e
                      , {path: s} = e
                      , a = 0 === s.length ? n : `At path: ${s.join(".")} -- ${n}`;
                    super(i ?? a),
                    null != i && (this.cause = a),
                    Object.assign(this, o),
                    this.name = this.constructor.name,
                    this.failures = ()=>r ?? (r = [e, ...t()])
                }
            }
            function r(e) {
                return "object" == typeof e && null != e
            }
            function n(e) {
                if ("[object Object]" !== Object.prototype.toString.call(e))
                    return !1;
                const t = Object.getPrototypeOf(e);
                return null === t || t === Object.prototype
            }
            function i(e) {
                return "symbol" == typeof e ? e.toString() : "string" == typeof e ? JSON.stringify(e) : `${e}`
            }
            function o(e, t, r, n) {
                if (!0 === e)
                    return;
                !1 === e ? e = {} : "string" == typeof e && (e = {
                    message: e
                });
                const {path: o, branch: s} = t
                  , {type: a} = r
                  , {refinement: l, message: u=`Expected a value of type \`${a}\`${l ? ` with refinement \`${l}\`` : ""}, but received: \`${i(n)}\``} = e;
                return {
                    value: n,
                    type: a,
                    refinement: l,
                    key: o[o.length - 1],
                    path: o,
                    branch: s,
                    ...e,
                    message: u
                }
            }
            function *s(e, t, n, i) {
                var s;
                r(s = e) && "function" == typeof s[Symbol.iterator] || (e = [e]);
                for (const r of e) {
                    const e = o(r, t, n, i);
                    e && (yield e)
                }
            }
            function *a(e, t, n={}) {
                const {path: i=[], branch: o=[e], coerce: s=!1, mask: l=!1} = n
                  , u = {
                    path: i,
                    branch: o
                };
                if (s && (e = t.coercer(e, u),
                l && "type" !== t.type && r(t.schema) && r(e) && !Array.isArray(e)))
                    for (const r in e)
                        void 0 === t.schema[r] && delete e[r];
                let c = "valid";
                for (const r of t.validator(e, u))
                    r.explanation = n.message,
                    c = "not_valid",
                    yield[r, void 0];
                for (let[d,f,h] of t.entries(e, u)) {
                    const t = a(f, h, {
                        path: void 0 === d ? i : [...i, d],
                        branch: void 0 === d ? o : [...o, f],
                        coerce: s,
                        mask: l,
                        message: n.message
                    });
                    for (const n of t)
                        n[0] ? (c = null != n[0].refinement ? "not_refined" : "not_valid",
                        yield[n[0], void 0]) : s && (f = n[1],
                        void 0 === d ? e = f : e instanceof Map ? e.set(d, f) : e instanceof Set ? e.add(f) : r(e) && (void 0 !== f || d in e) && (e[d] = f))
                }
                if ("not_valid" !== c)
                    for (const r of t.refiner(e, u))
                        r.explanation = n.message,
                        c = "not_refined",
                        yield[r, void 0];
                "valid" === c && (yield[void 0, e])
            }
            class l {
                constructor(e) {
                    const {type: t, schema: r, validator: n, refiner: i, coercer: o=(e=>e), entries: a=function*() {}
                    } = e;
                    this.type = t,
                    this.schema = r,
                    this.entries = a,
                    this.coercer = o,
                    this.validator = n ? (e,t)=>s(n(e, t), t, this, e) : ()=>[],
                    this.refiner = i ? (e,t)=>s(i(e, t), t, this, e) : ()=>[]
                }
                assert(e, t) {
                    return u(e, this, t)
                }
                create(e, t) {
                    return c(e, this, t)
                }
                is(e) {
                    return f(e, this)
                }
                mask(e, t) {
                    return d(e, this, t)
                }
                validate(e, t={}) {
                    return h(e, this, t)
                }
            }
            function u(e, t, r) {
                const n = h(e, t, {
                    message: r
                });
                if (n[0])
                    throw n[0]
            }
            function c(e, t, r) {
                const n = h(e, t, {
                    coerce: !0,
                    message: r
                });
                if (n[0])
                    throw n[0];
                return n[1]
            }
            function d(e, t, r) {
                const n = h(e, t, {
                    coerce: !0,
                    mask: !0,
                    message: r
                });
                if (n[0])
                    throw n[0];
                return n[1]
            }
            function f(e, t) {
                return !h(e, t)[0]
            }
            function h(e, r, n={}) {
                const i = a(e, r, n)
                  , o = function(e) {
                    const {done: t, value: r} = e.next();
                    return t ? void 0 : r
                }(i);
                if (o[0]) {
                    return [new t(o[0],(function*() {
                        for (const e of i)
                            e[0] && (yield e[0])
                    }
                    )), void 0]
                }
                return [void 0, o[1]]
            }
            function p(e, t) {
                return new l({
                    type: e,
                    schema: null,
                    validator: t
                })
            }
            function g() {
                return p("never", (()=>!1))
            }
            function m(e) {
                const t = e ? Object.keys(e) : []
                  , n = g();
                return new l({
                    type: "object",
                    schema: e || null,
                    *entries(i) {
                        if (e && r(i)) {
                            const r = new Set(Object.keys(i));
                            for (const n of t)
                                r.delete(n),
                                yield[n, i[n], e[n]];
                            for (const e of r)
                                yield[e, i[e], n]
                        }
                    },
                    validator: e=>r(e) || `Expected an object, but received: ${i(e)}`,
                    coercer: e=>r(e) ? {
                        ...e
                    } : e
                })
            }
            function b(e) {
                return new l({
                    ...e,
                    validator: (t,r)=>void 0 === t || e.validator(t, r),
                    refiner: (t,r)=>void 0 === t || e.refiner(t, r)
                })
            }
            function y() {
                return p("string", (e=>"string" == typeof e || `Expected a string, but received: ${i(e)}`))
            }
            function v(e) {
                const t = Object.keys(e);
                return new l({
                    type: "type",
                    schema: e,
                    *entries(n) {
                        if (r(n))
                            for (const r of t)
                                yield[r, n[r], e[r]]
                    },
                    validator: e=>r(e) || `Expected an object, but received: ${i(e)}`,
                    coercer: e=>r(e) ? {
                        ...e
                    } : e
                })
            }
            function w() {
                return p("unknown", (()=>!0))
            }
            function _(e, t, r) {
                return new l({
                    ...e,
                    coercer: (n,i)=>f(n, t) ? e.coercer(r(n, i), i) : e.coercer(n, i)
                })
            }
            function E(e) {
                return e instanceof Map || e instanceof Set ? e.size : e.length
            }
            function S(e, t, r) {
                return new l({
                    ...e,
                    *refiner(n, i) {
                        yield*e.refiner(n, i);
                        const o = s(r(n, i), i, e, n);
                        for (const e of o)
                            yield{
                                ...e,
                                refinement: t
                            }
                    }
                })
            }
            e.Struct = l,
            e.StructError = t,
            e.any = function() {
                return p("any", (()=>!0))
            }
            ,
            e.array = function(e) {
                return new l({
                    type: "array",
                    schema: e,
                    *entries(t) {
                        if (e && Array.isArray(t))
                            for (const [r,n] of t.entries())
                                yield[r, n, e]
                    },
                    coercer: e=>Array.isArray(e) ? e.slice() : e,
                    validator: e=>Array.isArray(e) || `Expected an array value, but received: ${i(e)}`
                })
            }
            ,
            e.assert = u,
            e.assign = function(...e) {
                const t = "type" === e[0].type
                  , r = e.map((e=>e.schema))
                  , n = Object.assign({}, ...r);
                return t ? v(n) : m(n)
            }
            ,
            e.bigint = function() {
                return p("bigint", (e=>"bigint" == typeof e))
            }
            ,
            e.boolean = function() {
                return p("boolean", (e=>"boolean" == typeof e))
            }
            ,
            e.coerce = _,
            e.create = c,
            e.date = function() {
                return p("date", (e=>e instanceof Date && !isNaN(e.getTime()) || `Expected a valid \`Date\` object, but received: ${i(e)}`))
            }
            ,
            e.defaulted = function(e, t, r={}) {
                return _(e, w(), (e=>{
                    const i = "function" == typeof t ? t() : t;
                    if (void 0 === e)
                        return i;
                    if (!r.strict && n(e) && n(i)) {
                        const t = {
                            ...e
                        };
                        let r = !1;
                        for (const e in i)
                            void 0 === t[e] && (t[e] = i[e],
                            r = !0);
                        if (r)
                            return t
                    }
                    return e
                }
                ))
            }
            ,
            e.define = p,
            e.deprecated = function(e, t) {
                return new l({
                    ...e,
                    refiner: (t,r)=>void 0 === t || e.refiner(t, r),
                    validator: (r,n)=>void 0 === r || (t(r, n),
                    e.validator(r, n))
                })
            }
            ,
            e.dynamic = function(e) {
                return new l({
                    type: "dynamic",
                    schema: null,
                    *entries(t, r) {
                        const n = e(t, r);
                        yield*n.entries(t, r)
                    },
                    validator: (t,r)=>e(t, r).validator(t, r),
                    coercer: (t,r)=>e(t, r).coercer(t, r),
                    refiner: (t,r)=>e(t, r).refiner(t, r)
                })
            }
            ,
            e.empty = function(e) {
                return S(e, "empty", (t=>{
                    const r = E(t);
                    return 0 === r || `Expected an empty ${e.type} but received one with a size of \`${r}\``
                }
                ))
            }
            ,
            e.enums = function(e) {
                const t = {}
                  , r = e.map((e=>i(e))).join();
                for (const r of e)
                    t[r] = r;
                return new l({
                    type: "enums",
                    schema: t,
                    validator: t=>e.includes(t) || `Expected one of \`${r}\`, but received: ${i(t)}`
                })
            }
            ,
            e.func = function() {
                return p("func", (e=>"function" == typeof e || `Expected a function, but received: ${i(e)}`))
            }
            ,
            e.instance = function(e) {
                return p("instance", (t=>t instanceof e || `Expected a \`${e.name}\` instance, but received: ${i(t)}`))
            }
            ,
            e.integer = function() {
                return p("integer", (e=>"number" == typeof e && !isNaN(e) && Number.isInteger(e) || `Expected an integer, but received: ${i(e)}`))
            }
            ,
            e.intersection = function(e) {
                return new l({
                    type: "intersection",
                    schema: null,
                    *entries(t, r) {
                        for (const n of e)
                            yield*n.entries(t, r)
                    },
                    *validator(t, r) {
                        for (const n of e)
                            yield*n.validator(t, r)
                    },
                    *refiner(t, r) {
                        for (const n of e)
                            yield*n.refiner(t, r)
                    }
                })
            }
            ,
            e.is = f,
            e.lazy = function(e) {
                let t;
                return new l({
                    type: "lazy",
                    schema: null,
                    *entries(r, n) {
                        t ?? (t = e()),
                        yield*t.entries(r, n)
                    },
                    validator: (r,n)=>(t ?? (t = e()),
                    t.validator(r, n)),
                    coercer: (r,n)=>(t ?? (t = e()),
                    t.coercer(r, n)),
                    refiner: (r,n)=>(t ?? (t = e()),
                    t.refiner(r, n))
                })
            }
            ,
            e.literal = function(e) {
                const t = i(e)
                  , r = typeof e;
                return new l({
                    type: "literal",
                    schema: "string" === r || "number" === r || "boolean" === r ? e : null,
                    validator: r=>r === e || `Expected the literal \`${t}\`, but received: ${i(r)}`
                })
            }
            ,
            e.map = function(e, t) {
                return new l({
                    type: "map",
                    schema: null,
                    *entries(r) {
                        if (e && t && r instanceof Map)
                            for (const [n,i] of r.entries())
                                yield[n, n, e],
                                yield[n, i, t]
                    },
                    coercer: e=>e instanceof Map ? new Map(e) : e,
                    validator: e=>e instanceof Map || `Expected a \`Map\` object, but received: ${i(e)}`
                })
            }
            ,
            e.mask = d,
            e.max = function(e, t, r={}) {
                const {exclusive: n} = r;
                return S(e, "max", (r=>n ? r < t : r <= t || `Expected a ${e.type} less than ${n ? "" : "or equal to "}${t} but received \`${r}\``))
            }
            ,
            e.min = function(e, t, r={}) {
                const {exclusive: n} = r;
                return S(e, "min", (r=>n ? r > t : r >= t || `Expected a ${e.type} greater than ${n ? "" : "or equal to "}${t} but received \`${r}\``))
            }
            ,
            e.never = g,
            e.nonempty = function(e) {
                return S(e, "nonempty", (t=>E(t) > 0 || `Expected a nonempty ${e.type} but received an empty one`))
            }
            ,
            e.nullable = function(e) {
                return new l({
                    ...e,
                    validator: (t,r)=>null === t || e.validator(t, r),
                    refiner: (t,r)=>null === t || e.refiner(t, r)
                })
            }
            ,
            e.number = function() {
                return p("number", (e=>"number" == typeof e && !isNaN(e) || `Expected a number, but received: ${i(e)}`))
            }
            ,
            e.object = m,
            e.omit = function(e, t) {
                const {schema: r} = e
                  , n = {
                    ...r
                };
                for (const e of t)
                    delete n[e];
                return "type" === e.type ? v(n) : m(n)
            }
            ,
            e.optional = b,
            e.partial = function(e) {
                const t = e instanceof l ? {
                    ...e.schema
                } : {
                    ...e
                };
                for (const e in t)
                    t[e] = b(t[e]);
                return m(t)
            }
            ,
            e.pattern = function(e, t) {
                return S(e, "pattern", (r=>t.test(r) || `Expected a ${e.type} matching \`/${t.source}/\` but received "${r}"`))
            }
            ,
            e.pick = function(e, t) {
                const {schema: r} = e
                  , n = {};
                for (const e of t)
                    n[e] = r[e];
                return m(n)
            }
            ,
            e.record = function(e, t) {
                return new l({
                    type: "record",
                    schema: null,
                    *entries(n) {
                        if (r(n))
                            for (const r in n) {
                                const i = n[r];
                                yield[r, r, e],
                                yield[r, i, t]
                            }
                    },
                    validator: e=>r(e) || `Expected an object, but received: ${i(e)}`
                })
            }
            ,
            e.refine = S,
            e.regexp = function() {
                return p("regexp", (e=>e instanceof RegExp))
            }
            ,
            e.set = function(e) {
                return new l({
                    type: "set",
                    schema: null,
                    *entries(t) {
                        if (e && t instanceof Set)
                            for (const r of t)
                                yield[r, r, e]
                    },
                    coercer: e=>e instanceof Set ? new Set(e) : e,
                    validator: e=>e instanceof Set || `Expected a \`Set\` object, but received: ${i(e)}`
                })
            }
            ,
            e.size = function(e, t, r=t) {
                const n = `Expected a ${e.type}`
                  , i = t === r ? `of \`${t}\`` : `between \`${t}\` and \`${r}\``;
                return S(e, "size", (e=>{
                    if ("number" == typeof e || e instanceof Date)
                        return t <= e && e <= r || `${n} ${i} but received \`${e}\``;
                    if (e instanceof Map || e instanceof Set) {
                        const {size: o} = e;
                        return t <= o && o <= r || `${n} with a size ${i} but received one with a size of \`${o}\``
                    }
                    {
                        const {length: o} = e;
                        return t <= o && o <= r || `${n} with a length ${i} but received one with a length of \`${o}\``
                    }
                }
                ))
            }
            ,
            e.string = y,
            e.struct = function(e, t) {
                return console.warn("superstruct@0.11 - The `struct` helper has been renamed to `define`."),
                p(e, t)
            }
            ,
            e.trimmed = function(e) {
                return _(e, y(), (e=>e.trim()))
            }
            ,
            e.tuple = function(e) {
                const t = g();
                return new l({
                    type: "tuple",
                    schema: null,
                    *entries(r) {
                        if (Array.isArray(r)) {
                            const n = Math.max(e.length, r.length);
                            for (let i = 0; i < n; i++)
                                yield[i, r[i], e[i] || t]
                        }
                    },
                    validator: e=>Array.isArray(e) || `Expected an array, but received: ${i(e)}`
                })
            }
            ,
            e.type = v,
            e.union = function(e) {
                const t = e.map((e=>e.type)).join(" | ");
                return new l({
                    type: "union",
                    schema: null,
                    coercer(t) {
                        for (const r of e) {
                            const [e,n] = r.validate(t, {
                                coerce: !0
                            });
                            if (!e)
                                return n
                        }
                        return t
                    },
                    validator(r, n) {
                        const o = [];
                        for (const t of e) {
                            const [...e] = a(r, t, n)
                              , [i] = e;
                            if (!i[0])
                                return [];
                            for (const [t] of e)
                                t && o.push(t)
                        }
                        return [`Expected the value to satisfy a union of \`${t}\`, but received: ${i(r)}`, ...o]
                    }
                })
            }
            ,
            e.unknown = w,
            e.validate = h
        }
        ))
    }
    , {}],
    241: [function(e, t, r) {
        arguments[4][9][0].apply(r, arguments)
    }
    , {
        dup: 9
    }],
    242: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n = Object.keys || function(e) {
                    var t = [];
                    for (var r in e)
                        t.push(r);
                    return t
                }
                ;
                t.exports = u;
                var i = e("./_stream_readable")
                  , o = e("./_stream_writable");
                e("inherits")(u, i);
                for (var s = n(o.prototype), a = 0; a < s.length; a++) {
                    var l = s[a];
                    u.prototype[l] || (u.prototype[l] = o.prototype[l])
                }
                function u(e) {
                    if (!(this instanceof u))
                        return new u(e);
                    i.call(this, e),
                    o.call(this, e),
                    this.allowHalfOpen = !0,
                    e && (!1 === e.readable && (this.readable = !1),
                    !1 === e.writable && (this.writable = !1),
                    !1 === e.allowHalfOpen && (this.allowHalfOpen = !1,
                    this.once("end", c)))
                }
                function c() {
                    this._writableState.ended || r.nextTick(d, this)
                }
                function d(e) {
                    e.end()
                }
                Object.defineProperty(u.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                Object.defineProperty(u.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(u.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(u.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
                    },
                    set: function(e) {
                        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e,
                        this._writableState.destroyed = e)
                    }
                })
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./_stream_readable": 244,
        "./_stream_writable": 246,
        _process: 178,
        inherits: 169
    }],
    243: [function(e, t, r) {
        arguments[4][11][0].apply(r, arguments)
    }
    , {
        "./_stream_transform": 245,
        dup: 11,
        inherits: 169
    }],
    244: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                var i;
                t.exports = R,
                R.ReadableState = A;
                e("events").EventEmitter;
                var o = function(e, t) {
                    return e.listeners(t).length
                }
                  , s = e("./internal/streams/stream")
                  , a = e("buffer").Buffer
                  , l = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var u, c = e("util");
                u = c && c.debuglog ? c.debuglog("stream") : function() {}
                ;
                var d, f, h, p = e("./internal/streams/buffer_list"), g = e("./internal/streams/destroy"), m = e("./internal/streams/state").getHighWaterMark, b = e("../errors").codes, y = b.ERR_INVALID_ARG_TYPE, v = b.ERR_STREAM_PUSH_AFTER_EOF, w = b.ERR_METHOD_NOT_IMPLEMENTED, _ = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
                e("inherits")(R, s);
                var E = g.errorOrDestroy
                  , S = ["error", "close", "destroy", "pause", "resume"];
                function A(t, r, n) {
                    i = i || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof n && (n = r instanceof i),
                    this.objectMode = !!t.objectMode,
                    n && (this.objectMode = this.objectMode || !!t.readableObjectMode),
                    this.highWaterMark = m(this, t, "readableHighWaterMark", n),
                    this.buffer = new p,
                    this.length = 0,
                    this.pipes = null,
                    this.pipesCount = 0,
                    this.flowing = null,
                    this.ended = !1,
                    this.endEmitted = !1,
                    this.reading = !1,
                    this.sync = !0,
                    this.needReadable = !1,
                    this.emittedReadable = !1,
                    this.readableListening = !1,
                    this.resumeScheduled = !1,
                    this.paused = !0,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.destroyed = !1,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.awaitDrain = 0,
                    this.readingMore = !1,
                    this.decoder = null,
                    this.encoding = null,
                    t.encoding && (d || (d = e("string_decoder/").StringDecoder),
                    this.decoder = new d(t.encoding),
                    this.encoding = t.encoding)
                }
                function R(t) {
                    if (i = i || e("./_stream_duplex"),
                    !(this instanceof R))
                        return new R(t);
                    var r = this instanceof i;
                    this._readableState = new A(t,this,r),
                    this.readable = !0,
                    t && ("function" == typeof t.read && (this._read = t.read),
                    "function" == typeof t.destroy && (this._destroy = t.destroy)),
                    s.call(this)
                }
                function x(e, t, r, n, i) {
                    u("readableAddChunk", t);
                    var o, s = e._readableState;
                    if (null === t)
                        s.reading = !1,
                        function(e, t) {
                            if (u("onEofChunk"),
                            t.ended)
                                return;
                            if (t.decoder) {
                                var r = t.decoder.end();
                                r && r.length && (t.buffer.push(r),
                                t.length += t.objectMode ? 1 : r.length)
                            }
                            t.ended = !0,
                            t.sync ? M(e) : (t.needReadable = !1,
                            t.emittedReadable || (t.emittedReadable = !0,
                            N(e)))
                        }(e, s);
                    else if (i || (o = function(e, t) {
                        var r;
                        n = t,
                        a.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new y("chunk",["string", "Buffer", "Uint8Array"],t));
                        var n;
                        return r
                    }(s, t)),
                    o)
                        E(e, o);
                    else if (s.objectMode || t && t.length > 0)
                        if ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === a.prototype || (t = function(e) {
                            return a.from(e)
                        }(t)),
                        n)
                            s.endEmitted ? E(e, new _) : T(e, s, t, !0);
                        else if (s.ended)
                            E(e, new v);
                        else {
                            if (s.destroyed)
                                return !1;
                            s.reading = !1,
                            s.decoder && !r ? (t = s.decoder.write(t),
                            s.objectMode || 0 !== t.length ? T(e, s, t, !1) : j(e, s)) : T(e, s, t, !1)
                        }
                    else
                        n || (s.reading = !1,
                        j(e, s));
                    return !s.ended && (s.length < s.highWaterMark || 0 === s.length)
                }
                function T(e, t, r, n) {
                    t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0,
                    e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length,
                    n ? t.buffer.unshift(r) : t.buffer.push(r),
                    t.needReadable && M(e)),
                    j(e, t)
                }
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = g.destroy,
                R.prototype._undestroy = g.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
                ,
                R.prototype.push = function(e, t) {
                    var r, n = this._readableState;
                    return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = a.from(e, t),
                    t = ""),
                    r = !0),
                    x(this, e, t, !1, r)
                }
                ,
                R.prototype.unshift = function(e) {
                    return x(this, e, null, !0, !1)
                }
                ,
                R.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing
                }
                ,
                R.prototype.setEncoding = function(t) {
                    d || (d = e("string_decoder/").StringDecoder);
                    var r = new d(t);
                    this._readableState.decoder = r,
                    this._readableState.encoding = this._readableState.decoder.encoding;
                    for (var n = this._readableState.buffer.head, i = ""; null !== n; )
                        i += r.write(n.data),
                        n = n.next;
                    return this._readableState.buffer.clear(),
                    "" !== i && this._readableState.buffer.push(i),
                    this._readableState.length = i.length,
                    this
                }
                ;
                var O = 1073741824;
                function k(e, t) {
                    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                        return e >= O ? e = O : (e--,
                        e |= e >>> 1,
                        e |= e >>> 2,
                        e |= e >>> 4,
                        e |= e >>> 8,
                        e |= e >>> 16,
                        e++),
                        e
                    }(e)),
                    e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0,
                    0))
                }
                function M(e) {
                    var t = e._readableState;
                    u("emitReadable", t.needReadable, t.emittedReadable),
                    t.needReadable = !1,
                    t.emittedReadable || (u("emitReadable", t.flowing),
                    t.emittedReadable = !0,
                    r.nextTick(N, e))
                }
                function N(e) {
                    var t = e._readableState;
                    u("emitReadable_", t.destroyed, t.length, t.ended),
                    t.destroyed || !t.length && !t.ended || (e.emit("readable"),
                    t.emittedReadable = !1),
                    t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark,
                    D(e)
                }
                function j(e, t) {
                    t.readingMore || (t.readingMore = !0,
                    r.nextTick(P, e, t))
                }
                function P(e, t) {
                    for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length); ) {
                        var r = t.length;
                        if (u("maybeReadMore read 0"),
                        e.read(0),
                        r === t.length)
                            break
                    }
                    t.readingMore = !1
                }
                function I(e) {
                    var t = e._readableState;
                    t.readableListening = e.listenerCount("readable") > 0,
                    t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume()
                }
                function C(e) {
                    u("readable nexttick read 0"),
                    e.read(0)
                }
                function L(e, t) {
                    u("resume", t.reading),
                    t.reading || e.read(0),
                    t.resumeScheduled = !1,
                    e.emit("resume"),
                    D(e),
                    t.flowing && !t.reading && e.read(0)
                }
                function D(e) {
                    var t = e._readableState;
                    for (u("flow", t.flowing); t.flowing && null !== e.read(); )
                        ;
                }
                function $(e, t) {
                    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length),
                    t.buffer.clear()) : r = t.buffer.consume(e, t.decoder),
                    r);
                    var r
                }
                function B(e) {
                    var t = e._readableState;
                    u("endReadable", t.endEmitted),
                    t.endEmitted || (t.ended = !0,
                    r.nextTick(F, t, e))
                }
                function F(e, t) {
                    if (u("endReadableNT", e.endEmitted, e.length),
                    !e.endEmitted && 0 === e.length && (e.endEmitted = !0,
                    t.readable = !1,
                    t.emit("end"),
                    e.autoDestroy)) {
                        var r = t._writableState;
                        (!r || r.autoDestroy && r.finished) && t.destroy()
                    }
                }
                function U(e, t) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (e[r] === t)
                            return r;
                    return -1
                }
                R.prototype.read = function(e) {
                    u("read", e),
                    e = parseInt(e, 10);
                    var t = this._readableState
                      , r = e;
                    if (0 !== e && (t.emittedReadable = !1),
                    0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended))
                        return u("read: emitReadable", t.length, t.ended),
                        0 === t.length && t.ended ? B(this) : M(this),
                        null;
                    if (0 === (e = k(e, t)) && t.ended)
                        return 0 === t.length && B(this),
                        null;
                    var n, i = t.needReadable;
                    return u("need readable", i),
                    (0 === t.length || t.length - e < t.highWaterMark) && u("length less than watermark", i = !0),
                    t.ended || t.reading ? u("reading or ended", i = !1) : i && (u("do read"),
                    t.reading = !0,
                    t.sync = !0,
                    0 === t.length && (t.needReadable = !0),
                    this._read(t.highWaterMark),
                    t.sync = !1,
                    t.reading || (e = k(r, t))),
                    null === (n = e > 0 ? $(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark,
                    e = 0) : (t.length -= e,
                    t.awaitDrain = 0),
                    0 === t.length && (t.ended || (t.needReadable = !0),
                    r !== e && t.ended && B(this)),
                    null !== n && this.emit("data", n),
                    n
                }
                ,
                R.prototype._read = function(e) {
                    E(this, new w("_read()"))
                }
                ,
                R.prototype.pipe = function(e, t) {
                    var n = this
                      , i = this._readableState;
                    switch (i.pipesCount) {
                    case 0:
                        i.pipes = e;
                        break;
                    case 1:
                        i.pipes = [i.pipes, e];
                        break;
                    default:
                        i.pipes.push(e)
                    }
                    i.pipesCount += 1,
                    u("pipe count=%d opts=%j", i.pipesCount, t);
                    var s = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : m;
                    function a(t, r) {
                        u("onunpipe"),
                        t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0,
                        u("cleanup"),
                        e.removeListener("close", p),
                        e.removeListener("finish", g),
                        e.removeListener("drain", c),
                        e.removeListener("error", h),
                        e.removeListener("unpipe", a),
                        n.removeListener("end", l),
                        n.removeListener("end", m),
                        n.removeListener("data", f),
                        d = !0,
                        !i.awaitDrain || e._writableState && !e._writableState.needDrain || c())
                    }
                    function l() {
                        u("onend"),
                        e.end()
                    }
                    i.endEmitted ? r.nextTick(s) : n.once("end", s),
                    e.on("unpipe", a);
                    var c = function(e) {
                        return function() {
                            var t = e._readableState;
                            u("pipeOnDrain", t.awaitDrain),
                            t.awaitDrain && t.awaitDrain--,
                            0 === t.awaitDrain && o(e, "data") && (t.flowing = !0,
                            D(e))
                        }
                    }(n);
                    e.on("drain", c);
                    var d = !1;
                    function f(t) {
                        u("ondata");
                        var r = e.write(t);
                        u("dest.write", r),
                        !1 === r && ((1 === i.pipesCount && i.pipes === e || i.pipesCount > 1 && -1 !== U(i.pipes, e)) && !d && (u("false write response, pause", i.awaitDrain),
                        i.awaitDrain++),
                        n.pause())
                    }
                    function h(t) {
                        u("onerror", t),
                        m(),
                        e.removeListener("error", h),
                        0 === o(e, "error") && E(e, t)
                    }
                    function p() {
                        e.removeListener("finish", g),
                        m()
                    }
                    function g() {
                        u("onfinish"),
                        e.removeListener("close", p),
                        m()
                    }
                    function m() {
                        u("unpipe"),
                        n.unpipe(e)
                    }
                    return n.on("data", f),
                    function(e, t, r) {
                        if ("function" == typeof e.prependListener)
                            return e.prependListener(t, r);
                        e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
                    }(e, "error", h),
                    e.once("close", p),
                    e.once("finish", g),
                    e.emit("pipe", n),
                    i.flowing || (u("pipe resume"),
                    n.resume()),
                    e
                }
                ,
                R.prototype.unpipe = function(e) {
                    var t = this._readableState
                      , r = {
                        hasUnpiped: !1
                    };
                    if (0 === t.pipesCount)
                        return this;
                    if (1 === t.pipesCount)
                        return e && e !== t.pipes || (e || (e = t.pipes),
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1,
                        e && e.emit("unpipe", this, r)),
                        this;
                    if (!e) {
                        var n = t.pipes
                          , i = t.pipesCount;
                        t.pipes = null,
                        t.pipesCount = 0,
                        t.flowing = !1;
                        for (var o = 0; o < i; o++)
                            n[o].emit("unpipe", this, {
                                hasUnpiped: !1
                            });
                        return this
                    }
                    var s = U(t.pipes, e);
                    return -1 === s || (t.pipes.splice(s, 1),
                    t.pipesCount -= 1,
                    1 === t.pipesCount && (t.pipes = t.pipes[0]),
                    e.emit("unpipe", this, r)),
                    this
                }
                ,
                R.prototype.on = function(e, t) {
                    var n = s.prototype.on.call(this, e, t)
                      , i = this._readableState;
                    return "data" === e ? (i.readableListening = this.listenerCount("readable") > 0,
                    !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0,
                    i.flowing = !1,
                    i.emittedReadable = !1,
                    u("on readable", i.length, i.reading),
                    i.length ? M(this) : i.reading || r.nextTick(C, this))),
                    n
                }
                ,
                R.prototype.addListener = R.prototype.on,
                R.prototype.removeListener = function(e, t) {
                    var n = s.prototype.removeListener.call(this, e, t);
                    return "readable" === e && r.nextTick(I, this),
                    n
                }
                ,
                R.prototype.removeAllListeners = function(e) {
                    var t = s.prototype.removeAllListeners.apply(this, arguments);
                    return "readable" !== e && void 0 !== e || r.nextTick(I, this),
                    t
                }
                ,
                R.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (u("resume"),
                    e.flowing = !e.readableListening,
                    function(e, t) {
                        t.resumeScheduled || (t.resumeScheduled = !0,
                        r.nextTick(L, e, t))
                    }(this, e)),
                    e.paused = !1,
                    this
                }
                ,
                R.prototype.pause = function() {
                    return u("call pause flowing=%j", this._readableState.flowing),
                    !1 !== this._readableState.flowing && (u("pause"),
                    this._readableState.flowing = !1,
                    this.emit("pause")),
                    this._readableState.paused = !0,
                    this
                }
                ,
                R.prototype.wrap = function(e) {
                    var t = this
                      , r = this._readableState
                      , n = !1;
                    for (var i in e.on("end", (function() {
                        if (u("wrapped end"),
                        r.decoder && !r.ended) {
                            var e = r.decoder.end();
                            e && e.length && t.push(e)
                        }
                        t.push(null)
                    }
                    )),
                    e.on("data", (function(i) {
                        (u("wrapped data"),
                        r.decoder && (i = r.decoder.write(i)),
                        r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0,
                        e.pause()))
                    }
                    )),
                    e)
                        void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                            return function() {
                                return e[t].apply(e, arguments)
                            }
                        }(i));
                    for (var o = 0; o < S.length; o++)
                        e.on(S[o], this.emit.bind(this, S[o]));
                    return this._read = function(t) {
                        u("wrapped _read", t),
                        n && (n = !1,
                        e.resume())
                    }
                    ,
                    this
                }
                ,
                "function" == typeof Symbol && (R.prototype[Symbol.asyncIterator] = function() {
                    return void 0 === f && (f = e("./internal/streams/async_iterator")),
                    f(this)
                }
                ),
                Object.defineProperty(R.prototype, "readableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.highWaterMark
                    }
                }),
                Object.defineProperty(R.prototype, "readableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState && this._readableState.buffer
                    }
                }),
                Object.defineProperty(R.prototype, "readableFlowing", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.flowing
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.flowing = e)
                    }
                }),
                R._fromList = $,
                Object.defineProperty(R.prototype, "readableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.length
                    }
                }),
                "function" == typeof Symbol && (R.from = function(t, r) {
                    return void 0 === h && (h = e("./internal/streams/from")),
                    h(R, t, r)
                }
                )
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 241,
        "./_stream_duplex": 242,
        "./internal/streams/async_iterator": 247,
        "./internal/streams/buffer_list": 248,
        "./internal/streams/destroy": 249,
        "./internal/streams/from": 251,
        "./internal/streams/state": 253,
        "./internal/streams/stream": 254,
        _process: 178,
        buffer: 124,
        events: 130,
        inherits: 169,
        "string_decoder/": 238,
        util: 123
    }],
    245: [function(e, t, r) {
        arguments[4][13][0].apply(r, arguments)
    }
    , {
        "../errors": 241,
        "./_stream_duplex": 242,
        dup: 13,
        inherits: 169
    }],
    246: [function(e, t, r) {
        (function(r, n) {
            (function() {
                "use strict";
                function i(e) {
                    var t = this;
                    this.next = null,
                    this.entry = null,
                    this.finish = function() {
                        !function(e, t, r) {
                            var n = e.entry;
                            e.entry = null;
                            for (; n; ) {
                                var i = n.callback;
                                t.pendingcb--,
                                i(r),
                                n = n.next
                            }
                            t.corkedRequestsFree.next = e
                        }(t, e)
                    }
                }
                var o;
                t.exports = R,
                R.WritableState = A;
                var s = {
                    deprecate: e("util-deprecate")
                }
                  , a = e("./internal/streams/stream")
                  , l = e("buffer").Buffer
                  , u = (void 0 !== n ? n : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {}).Uint8Array || function() {}
                ;
                var c, d = e("./internal/streams/destroy"), f = e("./internal/streams/state").getHighWaterMark, h = e("../errors").codes, p = h.ERR_INVALID_ARG_TYPE, g = h.ERR_METHOD_NOT_IMPLEMENTED, m = h.ERR_MULTIPLE_CALLBACK, b = h.ERR_STREAM_CANNOT_PIPE, y = h.ERR_STREAM_DESTROYED, v = h.ERR_STREAM_NULL_VALUES, w = h.ERR_STREAM_WRITE_AFTER_END, _ = h.ERR_UNKNOWN_ENCODING, E = d.errorOrDestroy;
                function S() {}
                function A(t, n, s) {
                    o = o || e("./_stream_duplex"),
                    t = t || {},
                    "boolean" != typeof s && (s = n instanceof o),
                    this.objectMode = !!t.objectMode,
                    s && (this.objectMode = this.objectMode || !!t.writableObjectMode),
                    this.highWaterMark = f(this, t, "writableHighWaterMark", s),
                    this.finalCalled = !1,
                    this.needDrain = !1,
                    this.ending = !1,
                    this.ended = !1,
                    this.finished = !1,
                    this.destroyed = !1;
                    var a = !1 === t.decodeStrings;
                    this.decodeStrings = !a,
                    this.defaultEncoding = t.defaultEncoding || "utf8",
                    this.length = 0,
                    this.writing = !1,
                    this.corked = 0,
                    this.sync = !0,
                    this.bufferProcessing = !1,
                    this.onwrite = function(e) {
                        !function(e, t) {
                            var n = e._writableState
                              , i = n.sync
                              , o = n.writecb;
                            if ("function" != typeof o)
                                throw new m;
                            if (function(e) {
                                e.writing = !1,
                                e.writecb = null,
                                e.length -= e.writelen,
                                e.writelen = 0
                            }(n),
                            t)
                                !function(e, t, n, i, o) {
                                    --t.pendingcb,
                                    n ? (r.nextTick(o, i),
                                    r.nextTick(N, e, t),
                                    e._writableState.errorEmitted = !0,
                                    E(e, i)) : (o(i),
                                    e._writableState.errorEmitted = !0,
                                    E(e, i),
                                    N(e, t))
                                }(e, n, i, t, o);
                            else {
                                var s = k(n) || e.destroyed;
                                s || n.corked || n.bufferProcessing || !n.bufferedRequest || O(e, n),
                                i ? r.nextTick(T, e, n, s, o) : T(e, n, s, o)
                            }
                        }(n, e)
                    }
                    ,
                    this.writecb = null,
                    this.writelen = 0,
                    this.bufferedRequest = null,
                    this.lastBufferedRequest = null,
                    this.pendingcb = 0,
                    this.prefinished = !1,
                    this.errorEmitted = !1,
                    this.emitClose = !1 !== t.emitClose,
                    this.autoDestroy = !!t.autoDestroy,
                    this.bufferedRequestCount = 0,
                    this.corkedRequestsFree = new i(this)
                }
                function R(t) {
                    var r = this instanceof (o = o || e("./_stream_duplex"));
                    if (!r && !c.call(R, this))
                        return new R(t);
                    this._writableState = new A(t,this,r),
                    this.writable = !0,
                    t && ("function" == typeof t.write && (this._write = t.write),
                    "function" == typeof t.writev && (this._writev = t.writev),
                    "function" == typeof t.destroy && (this._destroy = t.destroy),
                    "function" == typeof t.final && (this._final = t.final)),
                    a.call(this)
                }
                function x(e, t, r, n, i, o, s) {
                    t.writelen = n,
                    t.writecb = s,
                    t.writing = !0,
                    t.sync = !0,
                    t.destroyed ? t.onwrite(new y("write")) : r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite),
                    t.sync = !1
                }
                function T(e, t, r, n) {
                    r || function(e, t) {
                        0 === t.length && t.needDrain && (t.needDrain = !1,
                        e.emit("drain"))
                    }(e, t),
                    t.pendingcb--,
                    n(),
                    N(e, t)
                }
                function O(e, t) {
                    t.bufferProcessing = !0;
                    var r = t.bufferedRequest;
                    if (e._writev && r && r.next) {
                        var n = t.bufferedRequestCount
                          , o = new Array(n)
                          , s = t.corkedRequestsFree;
                        s.entry = r;
                        for (var a = 0, l = !0; r; )
                            o[a] = r,
                            r.isBuf || (l = !1),
                            r = r.next,
                            a += 1;
                        o.allBuffers = l,
                        x(e, t, !0, t.length, o, "", s.finish),
                        t.pendingcb++,
                        t.lastBufferedRequest = null,
                        s.next ? (t.corkedRequestsFree = s.next,
                        s.next = null) : t.corkedRequestsFree = new i(t),
                        t.bufferedRequestCount = 0
                    } else {
                        for (; r; ) {
                            var u = r.chunk
                              , c = r.encoding
                              , d = r.callback;
                            if (x(e, t, !1, t.objectMode ? 1 : u.length, u, c, d),
                            r = r.next,
                            t.bufferedRequestCount--,
                            t.writing)
                                break
                        }
                        null === r && (t.lastBufferedRequest = null)
                    }
                    t.bufferedRequest = r,
                    t.bufferProcessing = !1
                }
                function k(e) {
                    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
                }
                function M(e, t) {
                    e._final((function(r) {
                        t.pendingcb--,
                        r && E(e, r),
                        t.prefinished = !0,
                        e.emit("prefinish"),
                        N(e, t)
                    }
                    ))
                }
                function N(e, t) {
                    var n = k(t);
                    if (n && (function(e, t) {
                        t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0,
                        e.emit("prefinish")) : (t.pendingcb++,
                        t.finalCalled = !0,
                        r.nextTick(M, e, t)))
                    }(e, t),
                    0 === t.pendingcb && (t.finished = !0,
                    e.emit("finish"),
                    t.autoDestroy))) {
                        var i = e._readableState;
                        (!i || i.autoDestroy && i.endEmitted) && e.destroy()
                    }
                    return n
                }
                e("inherits")(R, a),
                A.prototype.getBuffer = function() {
                    for (var e = this.bufferedRequest, t = []; e; )
                        t.push(e),
                        e = e.next;
                    return t
                }
                ,
                function() {
                    try {
                        Object.defineProperty(A.prototype, "buffer", {
                            get: s.deprecate((function() {
                                return this.getBuffer()
                            }
                            ), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (e) {}
                }(),
                "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance],
                Object.defineProperty(R, Symbol.hasInstance, {
                    value: function(e) {
                        return !!c.call(this, e) || this === R && (e && e._writableState instanceof A)
                    }
                })) : c = function(e) {
                    return e instanceof this
                }
                ,
                R.prototype.pipe = function() {
                    E(this, new b)
                }
                ,
                R.prototype.write = function(e, t, n) {
                    var i, o = this._writableState, s = !1, a = !o.objectMode && (i = e,
                    l.isBuffer(i) || i instanceof u);
                    return a && !l.isBuffer(e) && (e = function(e) {
                        return l.from(e)
                    }(e)),
                    "function" == typeof t && (n = t,
                    t = null),
                    a ? t = "buffer" : t || (t = o.defaultEncoding),
                    "function" != typeof n && (n = S),
                    o.ending ? function(e, t) {
                        var n = new w;
                        E(e, n),
                        r.nextTick(t, n)
                    }(this, n) : (a || function(e, t, n, i) {
                        var o;
                        return null === n ? o = new v : "string" == typeof n || t.objectMode || (o = new p("chunk",["string", "Buffer"],n)),
                        !o || (E(e, o),
                        r.nextTick(i, o),
                        !1)
                    }(this, o, e, n)) && (o.pendingcb++,
                    s = function(e, t, r, n, i, o) {
                        if (!r) {
                            var s = function(e, t, r) {
                                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = l.from(t, r));
                                return t
                            }(t, n, i);
                            n !== s && (r = !0,
                            i = "buffer",
                            n = s)
                        }
                        var a = t.objectMode ? 1 : n.length;
                        t.length += a;
                        var u = t.length < t.highWaterMark;
                        u || (t.needDrain = !0);
                        if (t.writing || t.corked) {
                            var c = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: n,
                                encoding: i,
                                isBuf: r,
                                callback: o,
                                next: null
                            },
                            c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest,
                            t.bufferedRequestCount += 1
                        } else
                            x(e, t, !1, a, n, i, o);
                        return u
                    }(this, o, a, e, t, n)),
                    s
                }
                ,
                R.prototype.cork = function() {
                    this._writableState.corked++
                }
                ,
                R.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--,
                    e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || O(this, e))
                }
                ,
                R.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()),
                    !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1))
                        throw new _(e);
                    return this._writableState.defaultEncoding = e,
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableBuffer", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState && this._writableState.getBuffer()
                    }
                }),
                Object.defineProperty(R.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark
                    }
                }),
                R.prototype._write = function(e, t, r) {
                    r(new g("_write()"))
                }
                ,
                R.prototype._writev = null,
                R.prototype.end = function(e, t, n) {
                    var i = this._writableState;
                    return "function" == typeof e ? (n = e,
                    e = null,
                    t = null) : "function" == typeof t && (n = t,
                    t = null),
                    null != e && this.write(e, t),
                    i.corked && (i.corked = 1,
                    this.uncork()),
                    i.ending || function(e, t, n) {
                        t.ending = !0,
                        N(e, t),
                        n && (t.finished ? r.nextTick(n) : e.once("finish", n));
                        t.ended = !0,
                        e.writable = !1
                    }(this, i, n),
                    this
                }
                ,
                Object.defineProperty(R.prototype, "writableLength", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.length
                    }
                }),
                Object.defineProperty(R.prototype, "destroyed", {
                    enumerable: !1,
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e)
                    }
                }),
                R.prototype.destroy = d.destroy,
                R.prototype._undestroy = d.undestroy,
                R.prototype._destroy = function(e, t) {
                    t(e)
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {
        "../errors": 241,
        "./_stream_duplex": 242,
        "./internal/streams/destroy": 249,
        "./internal/streams/state": 253,
        "./internal/streams/stream": 254,
        _process: 178,
        buffer: 124,
        inherits: 169,
        "util-deprecate": 258
    }],
    247: [function(e, t, r) {
        (function(r) {
            (function() {
                "use strict";
                var n;
                function i(e, t, r) {
                    return (t = function(e) {
                        var t = function(e, t) {
                            if ("object" != typeof e || null === e)
                                return e;
                            var r = e[Symbol.toPrimitive];
                            if (void 0 !== r) {
                                var n = r.call(e, t || "default");
                                if ("object" != typeof n)
                                    return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return ("string" === t ? String : Number)(e)
                        }(e, "string");
                        return "symbol" == typeof t ? t : String(t)
                    }(t))in e ? Object.defineProperty(e, t, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = r,
                    e
                }
                var o = e("./end-of-stream")
                  , s = Symbol("lastResolve")
                  , a = Symbol("lastReject")
                  , l = Symbol("error")
                  , u = Symbol("ended")
                  , c = Symbol("lastPromise")
                  , d = Symbol("handlePromise")
                  , f = Symbol("stream");
                function h(e, t) {
                    return {
                        value: e,
                        done: t
                    }
                }
                function p(e) {
                    var t = e[s];
                    if (null !== t) {
                        var r = e[f].read();
                        null !== r && (e[c] = null,
                        e[s] = null,
                        e[a] = null,
                        t(h(r, !1)))
                    }
                }
                function g(e) {
                    r.nextTick(p, e)
                }
                var m = Object.getPrototypeOf((function() {}
                ))
                  , b = Object.setPrototypeOf((i(n = {
                    get stream() {
                        return this[f]
                    },
                    next: function() {
                        var e = this
                          , t = this[l];
                        if (null !== t)
                            return Promise.reject(t);
                        if (this[u])
                            return Promise.resolve(h(void 0, !0));
                        if (this[f].destroyed)
                            return new Promise((function(t, n) {
                                r.nextTick((function() {
                                    e[l] ? n(e[l]) : t(h(void 0, !0))
                                }
                                ))
                            }
                            ));
                        var n, i = this[c];
                        if (i)
                            n = new Promise(function(e, t) {
                                return function(r, n) {
                                    e.then((function() {
                                        t[u] ? r(h(void 0, !0)) : t[d](r, n)
                                    }
                                    ), n)
                                }
                            }(i, this));
                        else {
                            var o = this[f].read();
                            if (null !== o)
                                return Promise.resolve(h(o, !1));
                            n = new Promise(this[d])
                        }
                        return this[c] = n,
                        n
                    }
                }, Symbol.asyncIterator, (function() {
                    return this
                }
                )),
                i(n, "return", (function() {
                    var e = this;
                    return new Promise((function(t, r) {
                        e[f].destroy(null, (function(e) {
                            e ? r(e) : t(h(void 0, !0))
                        }
                        ))
                    }
                    ))
                }
                )),
                n), m);
                t.exports = function(e) {
                    var t, r = Object.create(b, (i(t = {}, f, {
                        value: e,
                        writable: !0
                    }),
                    i(t, s, {
                        value: null,
                        writable: !0
                    }),
                    i(t, a, {
                        value: null,
                        writable: !0
                    }),
                    i(t, l, {
                        value: null,
                        writable: !0
                    }),
                    i(t, u, {
                        value: e._readableState.endEmitted,
                        writable: !0
                    }),
                    i(t, d, {
                        value: function(e, t) {
                            var n = r[f].read();
                            n ? (r[c] = null,
                            r[s] = null,
                            r[a] = null,
                            e(h(n, !1))) : (r[s] = e,
                            r[a] = t)
                        },
                        writable: !0
                    }),
                    t));
                    return r[c] = null,
                    o(e, (function(e) {
                        if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                            var t = r[a];
                            return null !== t && (r[c] = null,
                            r[s] = null,
                            r[a] = null,
                            t(e)),
                            void (r[l] = e)
                        }
                        var n = r[s];
                        null !== n && (r[c] = null,
                        r[s] = null,
                        r[a] = null,
                        n(h(void 0, !0))),
                        r[u] = !0
                    }
                    )),
                    e.on("readable", g.bind(null, r)),
                    r
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        "./end-of-stream": 250,
        _process: 178
    }],
    248: [function(e, t, r) {
        arguments[4][16][0].apply(r, arguments)
    }
    , {
        buffer: 124,
        dup: 16,
        util: 123
    }],
    249: [function(e, t, r) {
        (function(e) {
            (function() {
                "use strict";
                function r(e, t) {
                    i(e, t),
                    n(e)
                }
                function n(e) {
                    e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close")
                }
                function i(e, t) {
                    e.emit("error", t)
                }
                t.exports = {
                    destroy: function(t, o) {
                        var s = this
                          , a = this._readableState && this._readableState.destroyed
                          , l = this._writableState && this._writableState.destroyed;
                        return a || l ? (o ? o(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0,
                        e.nextTick(i, this, t)) : e.nextTick(i, this, t)),
                        this) : (this._readableState && (this._readableState.destroyed = !0),
                        this._writableState && (this._writableState.destroyed = !0),
                        this._destroy(t || null, (function(t) {
                            !o && t ? s._writableState ? s._writableState.errorEmitted ? e.nextTick(n, s) : (s._writableState.errorEmitted = !0,
                            e.nextTick(r, s, t)) : e.nextTick(r, s, t) : o ? (e.nextTick(n, s),
                            o(t)) : e.nextTick(n, s)
                        }
                        )),
                        this)
                    },
                    undestroy: function() {
                        this._readableState && (this._readableState.destroyed = !1,
                        this._readableState.reading = !1,
                        this._readableState.ended = !1,
                        this._readableState.endEmitted = !1),
                        this._writableState && (this._writableState.destroyed = !1,
                        this._writableState.ended = !1,
                        this._writableState.ending = !1,
                        this._writableState.finalCalled = !1,
                        this._writableState.prefinished = !1,
                        this._writableState.finished = !1,
                        this._writableState.errorEmitted = !1)
                    },
                    errorOrDestroy: function(e, t) {
                        var r = e._readableState
                          , n = e._writableState;
                        r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t)
                    }
                }
            }
            ).call(this)
        }
        ).call(this, e("_process"))
    }
    , {
        _process: 178
    }],
    250: [function(e, t, r) {
        arguments[4][18][0].apply(r, arguments)
    }
    , {
        "../../../errors": 241,
        dup: 18
    }],
    251: [function(e, t, r) {
        arguments[4][19][0].apply(r, arguments)
    }
    , {
        dup: 19
    }],
    252: [function(e, t, r) {
        arguments[4][20][0].apply(r, arguments)
    }
    , {
        "../../../errors": 241,
        "./end-of-stream": 250,
        dup: 20
    }],
    253: [function(e, t, r) {
        arguments[4][21][0].apply(r, arguments)
    }
    , {
        "../../../errors": 241,
        dup: 21
    }],
    254: [function(e, t, r) {
        arguments[4][22][0].apply(r, arguments)
    }
    , {
        dup: 22,
        events: 130
    }],
    255: [function(e, t, r) {
        arguments[4][23][0].apply(r, arguments)
    }
    , {
        "./lib/_stream_duplex.js": 242,
        "./lib/_stream_passthrough.js": 243,
        "./lib/_stream_readable.js": 244,
        "./lib/_stream_transform.js": 245,
        "./lib/_stream_writable.js": 246,
        "./lib/internal/streams/end-of-stream.js": 250,
        "./lib/internal/streams/pipeline.js": 252,
        dup: 23
    }],
    256: [function(e, t, r) {
        const {Transform: n} = e("readable-stream");
        function i(e) {
            return (t,r,n)=>("function" == typeof t && (n = r,
            r = t,
            t = {}),
            "function" != typeof r && (r = (e,t,r)=>r(null, e)),
            "function" != typeof n && (n = null),
            e(t, r, n))
        }
        const o = i(((e,t,r)=>{
            const i = new n(e);
            return i._transform = t,
            r && (i._flush = r),
            i
        }
        ))
          , s = i(((e,t,r)=>{
            function i(o) {
                if (!(this instanceof i))
                    return new i(o);
                this.options = Object.assign({}, e, o),
                n.call(this, this.options),
                this._transform = t,
                r && (this._flush = r)
            }
            var o, s;
            return s = n,
            (o = i).super_ = s,
            o.prototype = Object.create(s.prototype, {
                constructor: {
                    value: o,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }),
            i
        }
        ))
          , a = i((function(e, t, r) {
            const i = new n(Object.assign({
                objectMode: !0,
                highWaterMark: 16
            }, e));
            return i._transform = t,
            r && (i._flush = r),
            i
        }
        ));
        t.exports = o,
        t.exports.ctor = s,
        t.exports.obj = a
    }
    , {
        "readable-stream": 255
    }],
    257: [function(e, t, r) {
        (function(t, n) {
            (function() {
                var i = e("process/browser.js").nextTick
                  , o = Function.prototype.apply
                  , s = Array.prototype.slice
                  , a = {}
                  , l = 0;
                function u(e, t) {
                    this._id = e,
                    this._clearFn = t
                }
                r.setTimeout = function() {
                    return new u(o.call(setTimeout, window, arguments),clearTimeout)
                }
                ,
                r.setInterval = function() {
                    return new u(o.call(setInterval, window, arguments),clearInterval)
                }
                ,
                r.clearTimeout = r.clearInterval = function(e) {
                    e.close()
                }
                ,
                u.prototype.unref = u.prototype.ref = function() {}
                ,
                u.prototype.close = function() {
                    this._clearFn.call(window, this._id)
                }
                ,
                r.enroll = function(e, t) {
                    clearTimeout(e._idleTimeoutId),
                    e._idleTimeout = t
                }
                ,
                r.unenroll = function(e) {
                    clearTimeout(e._idleTimeoutId),
                    e._idleTimeout = -1
                }
                ,
                r._unrefActive = r.active = function(e) {
                    clearTimeout(e._idleTimeoutId);
                    var t = e._idleTimeout;
                    t >= 0 && (e._idleTimeoutId = setTimeout((function() {
                        e._onTimeout && e._onTimeout()
                    }
                    ), t))
                }
                ,
                r.setImmediate = "function" == typeof t ? t : function(e) {
                    var t = l++
                      , n = !(arguments.length < 2) && s.call(arguments, 1);
                    return a[t] = !0,
                    i((function() {
                        a[t] && (n ? e.apply(null, n) : e.call(null),
                        r.clearImmediate(t))
                    }
                    )),
                    t
                }
                ,
                r.clearImmediate = "function" == typeof n ? n : function(e) {
                    delete a[e]
                }
            }
            ).call(this)
        }
        ).call(this, e("timers").setImmediate, e("timers").clearImmediate)
    }
    , {
        "process/browser.js": 178,
        timers: 257
    }],
    258: [function(e, t, r) {
        (function(e) {
            (function() {
                function r(t) {
                    try {
                        if (!e.localStorage)
                            return !1
                    } catch (e) {
                        return !1
                    }
                    var r = e.localStorage[t];
                    return null != r && "true" === String(r).toLowerCase()
                }
                t.exports = function(e, t) {
                    if (r("noDeprecation"))
                        return e;
                    var n = !1;
                    return function() {
                        if (!n) {
                            if (r("throwDeprecation"))
                                throw new Error(t);
                            r("traceDeprecation") ? console.trace(t) : console.warn(t),
                            n = !0
                        }
                        return e.apply(this, arguments)
                    }
                }
            }
            ).call(this)
        }
        ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }
    , {}],
    259: [function(e, t, r) {
        !function(e, n) {
            if ("function" == typeof define && define.amd)
                define("webextension-polyfill", ["module"], n);
            else if (void 0 !== r)
                n(t);
            else {
                var i = {
                    exports: {}
                };
                n(i),
                e.browser = i.exports
            }
        }("undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : this, (function(e) {
            "use strict";
            if ("undefined" == typeof browser || Object.getPrototypeOf(browser) !== Object.prototype) {
                const t = "The message port closed before a response was received."
                  , r = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"
                  , n = e=>{
                    const n = {
                        alarms: {
                            clear: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            clearAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            get: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        bookmarks: {
                            create: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getChildren: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getRecent: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getSubTree: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTree: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            move: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeTree: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        browserAction: {
                            disable: {
                                minArgs: 0,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            enable: {
                                minArgs: 0,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            getBadgeBackgroundColor: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getBadgeText: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getPopup: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTitle: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            openPopup: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            setBadgeBackgroundColor: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setBadgeText: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setIcon: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            setPopup: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setTitle: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        browsingData: {
                            remove: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            removeCache: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeCookies: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeDownloads: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeFormData: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeHistory: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeLocalStorage: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removePasswords: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removePluginData: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            settings: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        commands: {
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        contextMenus: {
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        cookies: {
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAllCookieStores: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            set: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        devtools: {
                            inspectedWindow: {
                                eval: {
                                    minArgs: 1,
                                    maxArgs: 2,
                                    singleCallbackArg: !1
                                }
                            },
                            panels: {
                                create: {
                                    minArgs: 3,
                                    maxArgs: 3,
                                    singleCallbackArg: !0
                                },
                                elements: {
                                    createSidebarPane: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                }
                            }
                        },
                        downloads: {
                            cancel: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            download: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            erase: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getFileIcon: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            open: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            pause: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeFile: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            resume: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            show: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        extension: {
                            isAllowedFileSchemeAccess: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            isAllowedIncognitoAccess: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        history: {
                            addUrl: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            deleteAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            deleteRange: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            deleteUrl: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getVisits: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            search: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        i18n: {
                            detectLanguage: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAcceptLanguages: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        identity: {
                            launchWebAuthFlow: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        idle: {
                            queryState: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        management: {
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getSelf: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            setEnabled: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            uninstallSelf: {
                                minArgs: 0,
                                maxArgs: 1
                            }
                        },
                        notifications: {
                            clear: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            create: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getPermissionLevel: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        },
                        pageAction: {
                            getPopup: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getTitle: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            hide: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setIcon: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            setPopup: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            setTitle: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            },
                            show: {
                                minArgs: 1,
                                maxArgs: 1,
                                fallbackToNoCallback: !0
                            }
                        },
                        permissions: {
                            contains: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            request: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        runtime: {
                            getBackgroundPage: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getPlatformInfo: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            openOptionsPage: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            requestUpdateCheck: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            sendMessage: {
                                minArgs: 1,
                                maxArgs: 3
                            },
                            sendNativeMessage: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            setUninstallURL: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        sessions: {
                            getDevices: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getRecentlyClosed: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            restore: {
                                minArgs: 0,
                                maxArgs: 1
                            }
                        },
                        storage: {
                            local: {
                                clear: {
                                    minArgs: 0,
                                    maxArgs: 0
                                },
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                remove: {
                                    minArgs: 1,
                                    maxArgs: 1
                                },
                                set: {
                                    minArgs: 1,
                                    maxArgs: 1
                                }
                            },
                            managed: {
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                }
                            },
                            sync: {
                                clear: {
                                    minArgs: 0,
                                    maxArgs: 0
                                },
                                get: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                getBytesInUse: {
                                    minArgs: 0,
                                    maxArgs: 1
                                },
                                remove: {
                                    minArgs: 1,
                                    maxArgs: 1
                                },
                                set: {
                                    minArgs: 1,
                                    maxArgs: 1
                                }
                            }
                        },
                        tabs: {
                            captureVisibleTab: {
                                minArgs: 0,
                                maxArgs: 2
                            },
                            create: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            detectLanguage: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            discard: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            duplicate: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            executeScript: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getCurrent: {
                                minArgs: 0,
                                maxArgs: 0
                            },
                            getZoom: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getZoomSettings: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            goBack: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            goForward: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            highlight: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            insertCSS: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            move: {
                                minArgs: 2,
                                maxArgs: 2
                            },
                            query: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            reload: {
                                minArgs: 0,
                                maxArgs: 2
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            removeCSS: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            sendMessage: {
                                minArgs: 2,
                                maxArgs: 3
                            },
                            setZoom: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            setZoomSettings: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            update: {
                                minArgs: 1,
                                maxArgs: 2
                            }
                        },
                        topSites: {
                            get: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        webNavigation: {
                            getAllFrames: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            getFrame: {
                                minArgs: 1,
                                maxArgs: 1
                            }
                        },
                        webRequest: {
                            handlerBehaviorChanged: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        },
                        windows: {
                            create: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            get: {
                                minArgs: 1,
                                maxArgs: 2
                            },
                            getAll: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getCurrent: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            getLastFocused: {
                                minArgs: 0,
                                maxArgs: 1
                            },
                            remove: {
                                minArgs: 1,
                                maxArgs: 1
                            },
                            update: {
                                minArgs: 2,
                                maxArgs: 2
                            }
                        }
                    };
                    if (0 === Object.keys(n).length)
                        throw new Error("api-metadata.json has not been included in browser-polyfill");
                    class i extends WeakMap {
                        constructor(e, t=void 0) {
                            super(t),
                            this.createItem = e
                        }
                        get(e) {
                            return this.has(e) || this.set(e, this.createItem(e)),
                            super.get(e)
                        }
                    }
                    const o = (t,r)=>(...n)=>{
                        e.runtime.lastError ? t.reject(new Error(e.runtime.lastError.message)) : r.singleCallbackArg || n.length <= 1 && !1 !== r.singleCallbackArg ? t.resolve(n[0]) : t.resolve(n)
                    }
                      , s = e=>1 == e ? "argument" : "arguments"
                      , a = (e,t,r)=>new Proxy(t,{
                        apply: (t,n,i)=>r.call(n, e, ...i)
                    });
                    let l = Function.call.bind(Object.prototype.hasOwnProperty);
                    const u = (e,t={},r={})=>{
                        let n = Object.create(null)
                          , i = {
                            has: (t,r)=>r in e || r in n,
                            get(i, c, d) {
                                if (c in n)
                                    return n[c];
                                if (!(c in e))
                                    return;
                                let f = e[c];
                                if ("function" == typeof f)
                                    if ("function" == typeof t[c])
                                        f = a(e, e[c], t[c]);
                                    else if (l(r, c)) {
                                        let t = ((e,t)=>function(r, ...n) {
                                            if (n.length < t.minArgs)
                                                throw new Error(`Expected at least ${t.minArgs} ${s(t.minArgs)} for ${e}(), got ${n.length}`);
                                            if (n.length > t.maxArgs)
                                                throw new Error(`Expected at most ${t.maxArgs} ${s(t.maxArgs)} for ${e}(), got ${n.length}`);
                                            return new Promise(((i,s)=>{
                                                if (t.fallbackToNoCallback)
                                                    try {
                                                        r[e](...n, o({
                                                            resolve: i,
                                                            reject: s
                                                        }, t))
                                                    } catch (o) {
                                                        console.warn(`${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, o),
                                                        r[e](...n),
                                                        t.fallbackToNoCallback = !1,
                                                        t.noCallback = !0,
                                                        i()
                                                    }
                                                else
                                                    t.noCallback ? (r[e](...n),
                                                    i()) : r[e](...n, o({
                                                        resolve: i,
                                                        reject: s
                                                    }, t))
                                            }
                                            ))
                                        }
                                        )(c, r[c]);
                                        f = a(e, e[c], t)
                                    } else
                                        f = f.bind(e);
                                else if ("object" == typeof f && null !== f && (l(t, c) || l(r, c)))
                                    f = u(f, t[c], r[c]);
                                else {
                                    if (!l(r, "*"))
                                        return Object.defineProperty(n, c, {
                                            configurable: !0,
                                            enumerable: !0,
                                            get: ()=>e[c],
                                            set(t) {
                                                e[c] = t
                                            }
                                        }),
                                        f;
                                    f = u(f, t[c], r["*"])
                                }
                                return n[c] = f,
                                f
                            },
                            set: (t,r,i,o)=>(r in n ? n[r] = i : e[r] = i,
                            !0),
                            defineProperty: (e,t,r)=>Reflect.defineProperty(n, t, r),
                            deleteProperty: (e,t)=>Reflect.deleteProperty(n, t)
                        }
                          , c = Object.create(e);
                        return new Proxy(c,i)
                    }
                      , c = e=>({
                        addListener(t, r, ...n) {
                            t.addListener(e.get(r), ...n)
                        },
                        hasListener: (t,r)=>t.hasListener(e.get(r)),
                        removeListener(t, r) {
                            t.removeListener(e.get(r))
                        }
                    })
                      , d = new i((e=>"function" != typeof e ? e : function(t) {
                        const r = u(t, {}, {
                            getContent: {
                                minArgs: 0,
                                maxArgs: 0
                            }
                        });
                        e(r)
                    }
                    ));
                    let f = !1;
                    const h = new i((e=>"function" != typeof e ? e : function(t, n, i) {
                        let o, s, a = !1, l = new Promise((e=>{
                            o = function(t) {
                                f || (console.warn(r, (new Error).stack),
                                f = !0),
                                a = !0,
                                e(t)
                            }
                        }
                        ));
                        try {
                            s = e(t, n, o)
                        } catch (e) {
                            s = Promise.reject(e)
                        }
                        const u = !0 !== s && ((c = s) && "object" == typeof c && "function" == typeof c.then);
                        var c;
                        if (!0 !== s && !u && !a)
                            return !1;
                        const d = e=>{
                            e.then((e=>{
                                i(e)
                            }
                            ), (e=>{
                                let t;
                                t = e && (e instanceof Error || "string" == typeof e.message) ? e.message : "An unexpected error occurred",
                                i({
                                    __mozWebExtensionPolyfillReject__: !0,
                                    message: t
                                })
                            }
                            )).catch((e=>{
                                console.error("Failed to send onMessage rejected reply", e)
                            }
                            ))
                        }
                        ;
                        return d(u ? s : l),
                        !0
                    }
                    ))
                      , p = ({reject: r, resolve: n},i)=>{
                        e.runtime.lastError ? e.runtime.lastError.message === t ? n() : r(new Error(e.runtime.lastError.message)) : i && i.__mozWebExtensionPolyfillReject__ ? r(new Error(i.message)) : n(i)
                    }
                      , g = (e,t,r,...n)=>{
                        if (n.length < t.minArgs)
                            throw new Error(`Expected at least ${t.minArgs} ${s(t.minArgs)} for ${e}(), got ${n.length}`);
                        if (n.length > t.maxArgs)
                            throw new Error(`Expected at most ${t.maxArgs} ${s(t.maxArgs)} for ${e}(), got ${n.length}`);
                        return new Promise(((e,t)=>{
                            const i = p.bind(null, {
                                resolve: e,
                                reject: t
                            });
                            n.push(i),
                            r.sendMessage(...n)
                        }
                        ))
                    }
                      , m = {
                        devtools: {
                            network: {
                                onRequestFinished: c(d)
                            }
                        },
                        runtime: {
                            onMessage: c(h),
                            onMessageExternal: c(h),
                            sendMessage: g.bind(null, "sendMessage", {
                                minArgs: 1,
                                maxArgs: 3
                            })
                        },
                        tabs: {
                            sendMessage: g.bind(null, "sendMessage", {
                                minArgs: 2,
                                maxArgs: 3
                            })
                        }
                    }
                      , b = {
                        clear: {
                            minArgs: 1,
                            maxArgs: 1
                        },
                        get: {
                            minArgs: 1,
                            maxArgs: 1
                        },
                        set: {
                            minArgs: 1,
                            maxArgs: 1
                        }
                    };
                    return n.privacy = {
                        network: {
                            "*": b
                        },
                        services: {
                            "*": b
                        },
                        websites: {
                            "*": b
                        }
                    },
                    u(e, m, n)
                }
                ;
                if ("object" != typeof chrome || !chrome || !chrome.runtime || !chrome.runtime.id)
                    throw new Error("This script should only be loaded in a browser extension.");
                e.exports = n(chrome)
            } else
                e.exports = browser
        }
        ))
    }
    , {}],
    260: [function(e, t, r) {
        t.exports = function e(t, r) {
            if (t && r)
                return e(t)(r);
            if ("function" != typeof t)
                throw new TypeError("need wrapper function");
            return Object.keys(t).forEach((function(e) {
                n[e] = t[e]
            }
            )),
            n;
            function n() {
                for (var e = new Array(arguments.length), r = 0; r < e.length; r++)
                    e[r] = arguments[r];
                var n = t.apply(this, e)
                  , i = e[e.length - 1];
                return "function" == typeof n && n !== i && Object.keys(i).forEach((function(e) {
                    n[e] = i[e]
                }
                )),
                n
            }
        }
    }
    , {}],
    261: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            e.prototype[Symbol.iterator] = function*() {
                for (let e = this.head; e; e = e.next)
                    yield e.value
            }
        }
    }
    , {}],
    262: [function(e, t, r) {
        "use strict";
        function n(e) {
            var t = this;
            if (t instanceof n || (t = new n),
            t.tail = null,
            t.head = null,
            t.length = 0,
            e && "function" == typeof e.forEach)
                e.forEach((function(e) {
                    t.push(e)
                }
                ));
            else if (arguments.length > 0)
                for (var r = 0, i = arguments.length; r < i; r++)
                    t.push(arguments[r]);
            return t
        }
        function i(e, t, r) {
            var n = t === e.head ? new a(r,null,t,e) : new a(r,t,t.next,e);
            return null === n.next && (e.tail = n),
            null === n.prev && (e.head = n),
            e.length++,
            n
        }
        function o(e, t) {
            e.tail = new a(t,e.tail,null,e),
            e.head || (e.head = e.tail),
            e.length++
        }
        function s(e, t) {
            e.head = new a(t,null,e.head,e),
            e.tail || (e.tail = e.head),
            e.length++
        }
        function a(e, t, r, n) {
            if (!(this instanceof a))
                return new a(e,t,r,n);
            this.list = n,
            this.value = e,
            t ? (t.next = this,
            this.prev = t) : this.prev = null,
            r ? (r.prev = this,
            this.next = r) : this.next = null
        }
        t.exports = n,
        n.Node = a,
        n.create = n,
        n.prototype.removeNode = function(e) {
            if (e.list !== this)
                throw new Error("removing node which does not belong to this list");
            var t = e.next
              , r = e.prev;
            return t && (t.prev = r),
            r && (r.next = t),
            e === this.head && (this.head = t),
            e === this.tail && (this.tail = r),
            e.list.length--,
            e.next = null,
            e.prev = null,
            e.list = null,
            t
        }
        ,
        n.prototype.unshiftNode = function(e) {
            if (e !== this.head) {
                e.list && e.list.removeNode(e);
                var t = this.head;
                e.list = this,
                e.next = t,
                t && (t.prev = e),
                this.head = e,
                this.tail || (this.tail = e),
                this.length++
            }
        }
        ,
        n.prototype.pushNode = function(e) {
            if (e !== this.tail) {
                e.list && e.list.removeNode(e);
                var t = this.tail;
                e.list = this,
                e.prev = t,
                t && (t.next = e),
                this.tail = e,
                this.head || (this.head = e),
                this.length++
            }
        }
        ,
        n.prototype.push = function() {
            for (var e = 0, t = arguments.length; e < t; e++)
                o(this, arguments[e]);
            return this.length
        }
        ,
        n.prototype.unshift = function() {
            for (var e = 0, t = arguments.length; e < t; e++)
                s(this, arguments[e]);
            return this.length
        }
        ,
        n.prototype.pop = function() {
            if (this.tail) {
                var e = this.tail.value;
                return this.tail = this.tail.prev,
                this.tail ? this.tail.next = null : this.head = null,
                this.length--,
                e
            }
        }
        ,
        n.prototype.shift = function() {
            if (this.head) {
                var e = this.head.value;
                return this.head = this.head.next,
                this.head ? this.head.prev = null : this.tail = null,
                this.length--,
                e
            }
        }
        ,
        n.prototype.forEach = function(e, t) {
            t = t || this;
            for (var r = this.head, n = 0; null !== r; n++)
                e.call(t, r.value, n, this),
                r = r.next
        }
        ,
        n.prototype.forEachReverse = function(e, t) {
            t = t || this;
            for (var r = this.tail, n = this.length - 1; null !== r; n--)
                e.call(t, r.value, n, this),
                r = r.prev
        }
        ,
        n.prototype.get = function(e) {
            for (var t = 0, r = this.head; null !== r && t < e; t++)
                r = r.next;
            if (t === e && null !== r)
                return r.value
        }
        ,
        n.prototype.getReverse = function(e) {
            for (var t = 0, r = this.tail; null !== r && t < e; t++)
                r = r.prev;
            if (t === e && null !== r)
                return r.value
        }
        ,
        n.prototype.map = function(e, t) {
            t = t || this;
            for (var r = new n, i = this.head; null !== i; )
                r.push(e.call(t, i.value, this)),
                i = i.next;
            return r
        }
        ,
        n.prototype.mapReverse = function(e, t) {
            t = t || this;
            for (var r = new n, i = this.tail; null !== i; )
                r.push(e.call(t, i.value, this)),
                i = i.prev;
            return r
        }
        ,
        n.prototype.reduce = function(e, t) {
            var r, n = this.head;
            if (arguments.length > 1)
                r = t;
            else {
                if (!this.head)
                    throw new TypeError("Reduce of empty list with no initial value");
                n = this.head.next,
                r = this.head.value
            }
            for (var i = 0; null !== n; i++)
                r = e(r, n.value, i),
                n = n.next;
            return r
        }
        ,
        n.prototype.reduceReverse = function(e, t) {
            var r, n = this.tail;
            if (arguments.length > 1)
                r = t;
            else {
                if (!this.tail)
                    throw new TypeError("Reduce of empty list with no initial value");
                n = this.tail.prev,
                r = this.tail.value
            }
            for (var i = this.length - 1; null !== n; i--)
                r = e(r, n.value, i),
                n = n.prev;
            return r
        }
        ,
        n.prototype.toArray = function() {
            for (var e = new Array(this.length), t = 0, r = this.head; null !== r; t++)
                e[t] = r.value,
                r = r.next;
            return e
        }
        ,
        n.prototype.toArrayReverse = function() {
            for (var e = new Array(this.length), t = 0, r = this.tail; null !== r; t++)
                e[t] = r.value,
                r = r.prev;
            return e
        }
        ,
        n.prototype.slice = function(e, t) {
            (t = t || this.length) < 0 && (t += this.length),
            (e = e || 0) < 0 && (e += this.length);
            var r = new n;
            if (t < e || t < 0)
                return r;
            e < 0 && (e = 0),
            t > this.length && (t = this.length);
            for (var i = 0, o = this.head; null !== o && i < e; i++)
                o = o.next;
            for (; null !== o && i < t; i++,
            o = o.next)
                r.push(o.value);
            return r
        }
        ,
        n.prototype.sliceReverse = function(e, t) {
            (t = t || this.length) < 0 && (t += this.length),
            (e = e || 0) < 0 && (e += this.length);
            var r = new n;
            if (t < e || t < 0)
                return r;
            e < 0 && (e = 0),
            t > this.length && (t = this.length);
            for (var i = this.length, o = this.tail; null !== o && i > t; i--)
                o = o.prev;
            for (; null !== o && i > e; i--,
            o = o.prev)
                r.push(o.value);
            return r
        }
        ,
        n.prototype.splice = function(e, t, ...r) {
            e > this.length && (e = this.length - 1),
            e < 0 && (e = this.length + e);
            for (var n = 0, o = this.head; null !== o && n < e; n++)
                o = o.next;
            var s = [];
            for (n = 0; o && n < t; n++)
                s.push(o.value),
                o = this.removeNode(o);
            null === o && (o = this.tail),
            o !== this.head && o !== this.tail && (o = o.prev);
            for (n = 0; n < r.length; n++)
                o = i(this, o, r[n]);
            return s
        }
        ,
        n.prototype.reverse = function() {
            for (var e = this.head, t = this.tail, r = e; null !== r; r = r.prev) {
                var n = r.prev;
                r.prev = r.next,
                r.next = n
            }
            return this.head = t,
            this.tail = e,
            this
        }
        ;
        try {
            e("./iterator.js")(n)
        } catch (e) {}
    }
    , {
        "./iterator.js": 261
    }],
    263: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.UNKNOWN_TICKER_SYMBOL = r.SNAP_MANAGE_ACCOUNTS_CONFIRMATION_TYPES = r.SNAP_DIALOG_TYPES = r.POLLING_TOKEN_ENVIRONMENT_TYPES = r.PLATFORM_OPERA = r.PLATFORM_FIREFOX = r.PLATFORM_EDGE = r.PLATFORM_CHROME = r.PLATFORM_BRAVE = r.ORIGIN_METAMASK = r.METAMASK_PROD_CHROME_ID = r.METAMASK_MMI_PROD_CHROME_ID = r.METAMASK_MMI_BETA_CHROME_ID = r.METAMASK_FLASK_CHROME_ID = r.METAMASK_BETA_CHROME_ID = r.MESSAGE_TYPE = r.FIREFOX_BUILD_IDS = r.EXTENSION_MESSAGES = r.ENVIRONMENT_TYPE_POPUP = r.ENVIRONMENT_TYPE_NOTIFICATION = r.ENVIRONMENT_TYPE_FULLSCREEN = r.ENVIRONMENT_TYPE_BACKGROUND = r.CHROME_BUILD_IDS = void 0;
        var n = e("@metamask/snaps-sdk")
          , i = e("./permissions");
        const o = r.ENVIRONMENT_TYPE_POPUP = "popup"
          , s = r.ENVIRONMENT_TYPE_NOTIFICATION = "notification"
          , a = r.ENVIRONMENT_TYPE_FULLSCREEN = "fullscreen"
          , l = r.ENVIRONMENT_TYPE_BACKGROUND = "background"
          , u = (r.PLATFORM_BRAVE = "Brave",
        r.PLATFORM_CHROME = "Chrome",
        r.PLATFORM_EDGE = "Edge",
        r.PLATFORM_FIREFOX = "Firefox",
        r.PLATFORM_OPERA = "Opera",
        r.MESSAGE_TYPE = {
            ADD_ETHEREUM_CHAIN: "wallet_addEthereumChain",
            ETH_ACCOUNTS: i.RestrictedMethods.eth_accounts,
            ETH_DECRYPT: "eth_decrypt",
            ETH_CHAIN_ID: "eth_chainId",
            ETH_GET_ENCRYPTION_PUBLIC_KEY: "eth_getEncryptionPublicKey",
            ETH_GET_BLOCK_BY_NUMBER: "eth_getBlockByNumber",
            ETH_REQUEST_ACCOUNTS: "eth_requestAccounts",
            ETH_SIGN: "eth_sign",
            ETH_SIGN_TYPED_DATA: "eth_signTypedData",
            ETH_SIGN_TYPED_DATA_V3: "eth_signTypedData_v3",
            ETH_SIGN_TYPED_DATA_V4: "eth_signTypedData_v4",
            GET_PROVIDER_STATE: "metamask_getProviderState",
            LOG_WEB3_SHIM_USAGE: "metamask_logWeb3ShimUsage",
            PERSONAL_SIGN: "personal_sign",
            SEND_METADATA: "metamask_sendDomainMetadata",
            SWITCH_ETHEREUM_CHAIN: "wallet_switchEthereumChain",
            TRANSACTION: "transaction",
            WALLET_REQUEST_PERMISSIONS: "wallet_requestPermissions",
            WATCH_ASSET: "wallet_watchAsset",
            WATCH_ASSET_LEGACY: "metamask_watchAsset",
            SNAP_DIALOG_ALERT: `${i.RestrictedMethods.snap_dialog}:alert`,
            SNAP_DIALOG_CONFIRMATION: `${i.RestrictedMethods.snap_dialog}:confirmation`,
            SNAP_DIALOG_PROMPT: `${i.RestrictedMethods.snap_dialog}:prompt`
        })
          , c = (r.SNAP_DIALOG_TYPES = {
            [n.DialogType.Alert]: u.SNAP_DIALOG_ALERT,
            [n.DialogType.Confirmation]: u.SNAP_DIALOG_CONFIRMATION,
            [n.DialogType.Prompt]: u.SNAP_DIALOG_PROMPT
        },
        r.SNAP_MANAGE_ACCOUNTS_CONFIRMATION_TYPES = {
            confirmAccountCreation: "snap_manageAccounts:confirmAccountCreation",
            confirmAccountRemoval: "snap_manageAccounts:confirmAccountRemoval",
            showSnapAccountRedirect: "showSnapAccountRedirect"
        },
        r.EXTENSION_MESSAGES = {
            CONNECTION_READY: "CONNECTION_READY",
            READY: "METAMASK_EXTENSION_READY"
        },
        r.POLLING_TOKEN_ENVIRONMENT_TYPES = {
            [o]: "popupGasPollTokens",
            [s]: "notificationGasPollTokens",
            [a]: "fullScreenGasPollTokens",
            [l]: "none"
        },
        r.ORIGIN_METAMASK = "metamask",
        r.METAMASK_BETA_CHROME_ID = "pbbkamfgmaedccnfkmjcofcecjhfgldn")
          , d = r.METAMASK_PROD_CHROME_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn"
          , f = r.METAMASK_FLASK_CHROME_ID = "ljfoeinjpaedjfecbmggjgodbgkmjkjk"
          , h = r.METAMASK_MMI_BETA_CHROME_ID = "kmbhbcbadohhhgdgihejcicbgcehoaeg"
          , p = r.METAMASK_MMI_PROD_CHROME_ID = "ikkihjamdhfiojpdbnfllpjigpneipbc";
        r.CHROME_BUILD_IDS = [c, d, f, h, p],
        r.FIREFOX_BUILD_IDS = ["webextension-beta@metamask.io", "webextension@metamask.io", "webextension-flask@metamask.io"],
        r.UNKNOWN_TICKER_SYMBOL = "UNKNOWN"
    }
    , {
        "./permissions": 264,
        "@metamask/snaps-sdk": 32
    }],
    264: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
        var n = {
            CaveatTypes: !0,
            RestrictedMethods: !0
        };
        r.RestrictedMethods = r.CaveatTypes = void 0;
        var i = e("./snaps/permissions");
        Object.keys(i).forEach((function(e) {
            "default" !== e && "__esModule" !== e && (Object.prototype.hasOwnProperty.call(n, e) || e in r && r[e] === i[e] || Object.defineProperty(r, e, {
                enumerable: !0,
                get: function() {
                    return i[e]
                }
            }))
        }
        ));
        r.CaveatTypes = Object.freeze({
            restrictReturnedAccounts: "restrictReturnedAccounts"
        }),
        r.RestrictedMethods = Object.freeze({
            eth_accounts: "eth_accounts",
            snap_dialog: "snap_dialog",
            snap_notify: "snap_notify",
            snap_manageState: "snap_manageState",
            snap_getBip32PublicKey: "snap_getBip32PublicKey",
            snap_getBip32Entropy: "snap_getBip32Entropy",
            snap_getBip44Entropy: "snap_getBip44Entropy",
            snap_getEntropy: "snap_getEntropy",
            snap_getLocale: "snap_getLocale",
            wallet_snap: "wallet_snap",
            snap_manageAccounts: "snap_manageAccounts"
        })
    }
    , {
        "./snaps/permissions": 265
    }],
    265: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.ExcludedSnapPermissions = r.ExcludedSnapEndowments = r.EndowmentPermissions = r.DynamicSnapPermissions = void 0;
        r.EndowmentPermissions = Object.freeze({
            "endowment:network-access": "endowment:network-access",
            "endowment:transaction-insight": "endowment:transaction-insight",
            "endowment:cronjob": "endowment:cronjob",
            "endowment:ethereum-provider": "endowment:ethereum-provider",
            "endowment:rpc": "endowment:rpc",
            "endowment:webassembly": "endowment:webassembly",
            "endowment:lifecycle-hooks": "endowment:lifecycle-hooks",
            "endowment:page-home": "endowment:page-home",
            "endowment:keyring": "endowment:keyring"
        }),
        r.ExcludedSnapPermissions = Object.freeze({
            eth_accounts: "eth_accounts is disabled. For more information please see https://github.com/MetaMask/snaps/issues/990."
        }),
        r.ExcludedSnapEndowments = Object.freeze({
            "endowment:name-lookup": "This endowment is experimental and therefore not available.",
            "endowment:signature-insight": "This endowment is experimental and therefore not available."
        }),
        r.DynamicSnapPermissions = Object.freeze(["eth_accounts"])
    }
    , {}],
    266: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.checkForLastError = s,
        r.checkForLastErrorAndLog = function() {
            const e = s();
            e && i.default.error(e);
            return e
        }
        ,
        r.checkForLastErrorAndWarn = function() {
            const e = s();
            e && console.warn(e);
            return e
        }
        ;
        var n = o(e("webextension-polyfill"))
          , i = o(e("loglevel"));
        function o(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function s() {
            const {lastError: e} = n.default.runtime;
            if (e)
                return e.stack && e.message ? e : new Error(e.message)
        }
    }
    , {
        loglevel: 171,
        "webextension-polyfill": 259
    }],
    267: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.isManifestV3 = void 0;
        var n, i = (n = e("webextension-polyfill")) && n.__esModule ? n : {
            default: n
        };
        r.isManifestV3 = 3 === i.default.runtime.getManifest().manifest_version
    }
    , {
        "webextension-polyfill": 259
    }],
    268: [function(e, t, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r.default = function() {
            return function() {
                const {doctype: e} = window.document;
                if (e)
                    return "html" === e.name;
                return !0
            }() && function() {
                const e = [/\.xml$/u, /\.pdf$/u]
                  , t = window.location.pathname;
                for (let r = 0; r < e.length; r++)
                    if (e[r].test(t))
                        return !1;
                return !0
            }() && function() {
                const e = document.documentElement.nodeName;
                if (e)
                    return "html" === e.toLowerCase();
                return !0
            }() && !function() {
                const e = ["execution.consensys.io", "execution.metamask.io", "uscourts.gov", "dropbox.com", "webbyawards.com", "cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html", "adyen.com", "gravityforms.com", "harbourair.com", "ani.gamer.com.tw", "blueskybooking.com", "sharefile.com", "battle.net"]
                  , t = window.location.href;
                let r;
                for (let n = 0; n < e.length; n++) {
                    const i = e[n].replaceAll(".", "\\.");
                    if (r = new RegExp(`(?:https?:\\/\\/)(?:(?!${i}).)*$`,"u"),
                    !r.test(t))
                        return !0
                }
                return !1
            }()
        }
    }
    , {}]
}, {}, [1]);
