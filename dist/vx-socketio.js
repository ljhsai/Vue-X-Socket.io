var we = Object.defineProperty;
var ke = (s, e, t) => e in s ? we(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var J = (s, e, t) => (ke(s, typeof e != "symbol" ? e + "" : e, t), t);
const _e = {
  /**
   *  Assign runtime callbacks
   */
  beforeCreate() {
    this.sockets || (this.sockets = {}), this.sockets.subscribe = (s, e) => {
      this.$vueSocketIo.emitter.addListener(s, e, this);
    }, this.sockets.unsubscribe = (s) => {
      this.$vueSocketIo.emitter.removeListener(s, this);
    };
  },
  /**
   * Register all socket events
   */
  mounted() {
    this.$options.sockets && Object.keys(this.$options.sockets).forEach((s) => {
      s !== "subscribe" && s !== "unsubscribe" && this.$vueSocketIo.emitter.addListener(s, this.$options.sockets[s], this);
    });
  },
  /**
   * unsubscribe when component unmounting
   */
  beforeDestroy() {
    this.$options.sockets && Object.keys(this.$options.sockets).forEach((s) => {
      this.$vueSocketIo.emitter.removeListener(s, this);
    });
  }
}, u = new class {
  constructor() {
    this.debug = !1, this.prefix = "%cVue-Socket.io: ";
  }
  info(e, t = "") {
    this.debug && window.console.info(this.prefix + `%c${e}`, "color: blue; font-weight: 600", "color: #333333", t);
  }
  error() {
    this.debug && window.console.error(this.prefix, ...arguments);
  }
  warn() {
    this.debug && window.console.warn(this.prefix, ...arguments);
  }
  event(e, t = "") {
    this.debug && window.console.info(this.prefix + `%c${e}`, "color: blue; font-weight: 600", "color: #333333", t);
  }
}(), B = class B {
  constructor(e, t) {
    this.io = e, this.register(), this.emitter = t;
  }
  /**
   * Listening all socket.io events
   */
  register() {
    this.io.onevent = (e) => {
      let [t, ...i] = e.data;
      i.length === 1 && (i = i[0]), this.onEvent(t, i);
    }, B.staticEvents.forEach((e) => this.io.on(e, (t) => this.onEvent(e, t)));
  }
  /**
   * Broadcast all events to vuejs environment
   */
  onEvent(e, t) {
    this.emitter.emit(e, t);
  }
};
/**
 * socket.io-client reserved event keywords
 * @type {string[]}
 */
J(B, "staticEvents", [
  "connect",
  "error",
  "disconnect",
  "reconnect",
  "reconnect_attempt",
  "reconnecting",
  "reconnect_error",
  "reconnect_failed",
  "connect_error",
  "connect_timeout",
  "connecting",
  "ping",
  "pong"
]);
let q = B;
class Ee {
  constructor(e = {}) {
    u.info(e ? "Vuex adapter enabled" : "Vuex adapter disabled"), u.info(e.mutationPrefix ? "Vuex socket mutations enabled" : "Vuex socket mutations disabled"), u.info(e ? "Vuex socket actions enabled" : "Vuex socket actions disabled"), this.store = e.store, this.actionPrefix = e.actionPrefix ? e.actionPrefix : "SOCKET_", this.mutationPrefix = e.mutationPrefix, this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   * register new event listener with vuejs component instance
   * @param event
   * @param callback
   * @param component
   */
  addListener(e, t, i) {
    if (typeof t == "function")
      this.listeners.has(e) || this.listeners.set(e, []), this.listeners.get(e).push({ callback: t, component: i }), u.info(`#${e} subscribe, component: ${i.$options.name}`);
    else
      throw new Error("callback must be a function");
  }
  /**
   * remove a listenler
   * @param event
   * @param component
   */
  removeListener(e, t) {
    if (this.listeners.has(e)) {
      const i = this.listeners.get(e).filter((n) => n.component !== t);
      i.length > 0 ? this.listeners.set(e, i) : this.listeners.delete(e), u.info(`#${e} unsubscribe, component: ${t.$options.name}`);
    }
  }
  /**
   * broadcast incoming event to components
   * @param event
   * @param args
   */
  emit(e, t) {
    this.listeners.has(e) && (u.info(`Broadcasting: #${e}, Data:`, t), this.listeners.get(e).forEach((i) => {
      i.callback.call(i.component, t);
    })), e !== "ping" && e !== "pong" && this.dispatchStore(e, t);
  }
  /**
   * dispatching vuex actions
   * @param event
   * @param args
   */
  dispatchStore(e, t) {
    if (this.store && this.store._actions) {
      let i = this.actionPrefix + e;
      for (let n in this.store._actions)
        n.split("/").pop() === i && (u.info(`Dispatching Action: ${n}, Data:`, t), this.store.dispatch(n, t));
      if (this.mutationPrefix) {
        let n = this.mutationPrefix + e;
        for (let r in this.store._mutations)
          r.split("/").pop() === n && (u.info(`Commiting Mutation: ${r}, Data:`, t), this.store.commit(r, t));
      }
    }
  }
}
const y = /* @__PURE__ */ Object.create(null);
y.open = "0";
y.close = "1";
y.ping = "2";
y.pong = "3";
y.message = "4";
y.upgrade = "5";
y.noop = "6";
const S = /* @__PURE__ */ Object.create(null);
Object.keys(y).forEach((s) => {
  S[y[s]] = s;
});
const D = { type: "error", data: "parser error" }, re = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", oe = typeof ArrayBuffer == "function", ce = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s && s.buffer instanceof ArrayBuffer, M = ({ type: s, data: e }, t, i) => re && e instanceof Blob ? t ? i(e) : X(e, i) : oe && (e instanceof ArrayBuffer || ce(e)) ? t ? i(e) : X(new Blob([e]), i) : i(y[s] + (e || "")), X = (s, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const i = t.result.split(",")[1];
    e("b" + (i || ""));
  }, t.readAsDataURL(s);
};
function Q(s) {
  return s instanceof Uint8Array ? s : s instanceof ArrayBuffer ? new Uint8Array(s) : new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
}
let L;
function ve(s, e) {
  if (re && s.data instanceof Blob)
    return s.data.arrayBuffer().then(Q).then(e);
  if (oe && (s.data instanceof ArrayBuffer || ce(s.data)))
    return e(Q(s.data));
  M(s, !1, (t) => {
    L || (L = new TextEncoder()), e(L.encode(t));
  });
}
const j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", v = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let s = 0; s < j.length; s++)
  v[j.charCodeAt(s)] = s;
const Ae = (s) => {
  let e = s.length * 0.75, t = s.length, i, n = 0, r, o, h, a;
  s[s.length - 1] === "=" && (e--, s[s.length - 2] === "=" && e--);
  const m = new ArrayBuffer(e), g = new Uint8Array(m);
  for (i = 0; i < t; i += 4)
    r = v[s.charCodeAt(i)], o = v[s.charCodeAt(i + 1)], h = v[s.charCodeAt(i + 2)], a = v[s.charCodeAt(i + 3)], g[n++] = r << 2 | o >> 4, g[n++] = (o & 15) << 4 | h >> 2, g[n++] = (h & 3) << 6 | a & 63;
  return m;
}, Te = typeof ArrayBuffer == "function", H = (s, e) => {
  if (typeof s != "string")
    return {
      type: "message",
      data: ae(s, e)
    };
  const t = s.charAt(0);
  return t === "b" ? {
    type: "message",
    data: Oe(s.substring(1), e)
  } : S[t] ? s.length > 1 ? {
    type: S[t],
    data: s.substring(1)
  } : {
    type: S[t]
  } : D;
}, Oe = (s, e) => {
  if (Te) {
    const t = Ae(s);
    return ae(t, e);
  } else
    return { base64: !0, data: s };
}, ae = (s, e) => {
  switch (e) {
    case "blob":
      return s instanceof Blob ? s : new Blob([s]);
    case "arraybuffer":
    default:
      return s instanceof ArrayBuffer ? s : s.buffer;
  }
}, he = String.fromCharCode(30), Re = (s, e) => {
  const t = s.length, i = new Array(t);
  let n = 0;
  s.forEach((r, o) => {
    M(r, !1, (h) => {
      i[o] = h, ++n === t && e(i.join(he));
    });
  });
}, Se = (s, e) => {
  const t = s.split(he), i = [];
  for (let n = 0; n < t.length; n++) {
    const r = H(t[n], e);
    if (i.push(r), r.type === "error")
      break;
  }
  return i;
};
function Ce() {
  return new TransformStream({
    transform(s, e) {
      ve(s, (t) => {
        const i = t.length;
        let n;
        if (i < 126)
          n = new Uint8Array(1), new DataView(n.buffer).setUint8(0, i);
        else if (i < 65536) {
          n = new Uint8Array(3);
          const r = new DataView(n.buffer);
          r.setUint8(0, 126), r.setUint16(1, i);
        } else {
          n = new Uint8Array(9);
          const r = new DataView(n.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(i));
        }
        s.data && typeof s.data != "string" && (n[0] |= 128), e.enqueue(n), e.enqueue(t);
      });
    }
  });
}
let P;
function A(s) {
  return s.reduce((e, t) => e + t.length, 0);
}
function T(s, e) {
  if (s[0].length === e)
    return s.shift();
  const t = new Uint8Array(e);
  let i = 0;
  for (let n = 0; n < e; n++)
    t[n] = s[0][i++], i === s[0].length && (s.shift(), i = 0);
  return s.length && i < s[0].length && (s[0] = s[0].slice(i)), t;
}
function xe(s, e) {
  P || (P = new TextDecoder());
  const t = [];
  let i = 0, n = -1, r = !1;
  return new TransformStream({
    transform(o, h) {
      for (t.push(o); ; ) {
        if (i === 0) {
          if (A(t) < 1)
            break;
          const a = T(t, 1);
          r = (a[0] & 128) === 128, n = a[0] & 127, n < 126 ? i = 3 : n === 126 ? i = 1 : i = 2;
        } else if (i === 1) {
          if (A(t) < 2)
            break;
          const a = T(t, 2);
          n = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), i = 3;
        } else if (i === 2) {
          if (A(t) < 8)
            break;
          const a = T(t, 8), m = new DataView(a.buffer, a.byteOffset, a.length), g = m.getUint32(0);
          if (g > Math.pow(2, 53 - 32) - 1) {
            h.enqueue(D);
            break;
          }
          n = g * Math.pow(2, 32) + m.getUint32(4), i = 3;
        } else {
          if (A(t) < n)
            break;
          const a = T(t, n);
          h.enqueue(H(r ? a : P.decode(a), e)), i = 0;
        }
        if (n === 0 || n > s) {
          h.enqueue(D);
          break;
        }
      }
    }
  });
}
const fe = 4;
function f(s) {
  if (s)
    return Be(s);
}
function Be(s) {
  for (var e in f.prototype)
    s[e] = f.prototype[e];
  return s;
}
f.prototype.on = f.prototype.addEventListener = function(s, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + s] = this._callbacks["$" + s] || []).push(e), this;
};
f.prototype.once = function(s, e) {
  function t() {
    this.off(s, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(s, t), this;
};
f.prototype.off = f.prototype.removeListener = f.prototype.removeAllListeners = f.prototype.removeEventListener = function(s, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + s];
  if (!t)
    return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + s], this;
  for (var i, n = 0; n < t.length; n++)
    if (i = t[n], i === e || i.fn === e) {
      t.splice(n, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + s], this;
};
f.prototype.emit = function(s) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + s], i = 1; i < arguments.length; i++)
    e[i - 1] = arguments[i];
  if (t) {
    t = t.slice(0);
    for (var i = 0, n = t.length; i < n; ++i)
      t[i].apply(this, e);
  }
  return this;
};
f.prototype.emitReserved = f.prototype.emit;
f.prototype.listeners = function(s) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + s] || [];
};
f.prototype.hasListeners = function(s) {
  return !!this.listeners(s).length;
};
const l = (() => typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")())();
function ue(s, ...e) {
  return e.reduce((t, i) => (s.hasOwnProperty(i) && (t[i] = s[i]), t), {});
}
const Ne = l.setTimeout, Le = l.clearTimeout;
function N(s, e) {
  e.useNativeTimers ? (s.setTimeoutFn = Ne.bind(l), s.clearTimeoutFn = Le.bind(l)) : (s.setTimeoutFn = l.setTimeout.bind(l), s.clearTimeoutFn = l.clearTimeout.bind(l));
}
const Pe = 1.33;
function qe(s) {
  return typeof s == "string" ? De(s) : Math.ceil((s.byteLength || s.size) * Pe);
}
function De(s) {
  let e = 0, t = 0;
  for (let i = 0, n = s.length; i < n; i++)
    e = s.charCodeAt(i), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (i++, t += 4);
  return t;
}
function Ie(s) {
  let e = "";
  for (let t in s)
    s.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(s[t]));
  return e;
}
function Ue(s) {
  let e = {}, t = s.split("&");
  for (let i = 0, n = t.length; i < n; i++) {
    let r = t[i].split("=");
    e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return e;
}
class $e extends Error {
  constructor(e, t, i) {
    super(e), this.description = t, this.context = i, this.type = "TransportError";
  }
}
class K extends f {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, N(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, i) {
    return super.emitReserved("error", new $e(e, t, i)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = H(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = Ie(e);
    return t.length ? "?" + t : "";
  }
}
const le = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), I = 64, Ve = {};
let G = 0, O = 0, Z;
function ee(s) {
  let e = "";
  do
    e = le[s % I] + e, s = Math.floor(s / I);
  while (s > 0);
  return e;
}
function pe() {
  const s = ee(+/* @__PURE__ */ new Date());
  return s !== Z ? (G = 0, Z = s) : s + "." + ee(G++);
}
for (; O < I; O++)
  Ve[le[O]] = O;
let de = !1;
try {
  de = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Fe = de;
function ye(s) {
  const e = s.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Fe))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new l[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function Me() {
}
const He = function() {
  return new ye({
    xdomain: !1
  }).responseType != null;
}();
class Ke extends K {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), this.polling = !1, typeof location < "u") {
      const i = location.protocol === "https:";
      let n = location.port;
      n || (n = i ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || n !== e.port;
    }
    const t = e && e.forceBase64;
    this.supportsBinary = He && !t, this.opts.withCredentials && (this.cookieJar = void 0);
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this.poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this.polling || !this.writable) {
      let i = 0;
      this.polling && (i++, this.once("pollComplete", function() {
        --i || t();
      })), this.writable || (i++, this.once("drain", function() {
        --i || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  poll() {
    this.polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (i) => {
      if (this.readyState === "opening" && i.type === "open" && this.onOpen(), i.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(i);
    };
    Se(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Re(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = pe()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new d(this.uri(), e);
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const i = this.request({
      method: "POST",
      data: e
    });
    i.on("success", t), i.on("error", (n, r) => {
      this.onError("xhr post error", n, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, i) => {
      this.onError("xhr poll error", t, i);
    }), this.pollXhr = e;
  }
}
class d extends f {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t) {
    super(), N(this, t), this.opts = t, this.method = t.method || "GET", this.uri = e, this.data = t.data !== void 0 ? t.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const t = ue(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this.opts.xd;
    const i = this.xhr = new ye(t);
    try {
      i.open(this.method, this.uri, !0);
      try {
        if (this.opts.extraHeaders) {
          i.setDisableHeaderCheck && i.setDisableHeaderCheck(!0);
          for (let n in this.opts.extraHeaders)
            this.opts.extraHeaders.hasOwnProperty(n) && i.setRequestHeader(n, this.opts.extraHeaders[n]);
        }
      } catch {
      }
      if (this.method === "POST")
        try {
          i.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        i.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this.opts.cookieJar) === null || e === void 0 || e.addCookies(i), "withCredentials" in i && (i.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (i.timeout = this.opts.requestTimeout), i.onreadystatechange = () => {
        var n;
        i.readyState === 3 && ((n = this.opts.cookieJar) === null || n === void 0 || n.parseCookies(i)), i.readyState === 4 && (i.status === 200 || i.status === 1223 ? this.onLoad() : this.setTimeoutFn(() => {
          this.onError(typeof i.status == "number" ? i.status : 0);
        }, 0));
      }, i.send(this.data);
    } catch (n) {
      this.setTimeoutFn(() => {
        this.onError(n);
      }, 0);
      return;
    }
    typeof document < "u" && (this.index = d.requestsCount++, d.requests[this.index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  onError(e) {
    this.emitReserved("error", e, this.xhr), this.cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  cleanup(e) {
    if (!(typeof this.xhr > "u" || this.xhr === null)) {
      if (this.xhr.onreadystatechange = Me, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete d.requests[this.index], this.xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  onLoad() {
    const e = this.xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this.cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this.cleanup();
  }
}
d.requestsCount = 0;
d.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", te);
  else if (typeof addEventListener == "function") {
    const s = "onpagehide" in l ? "pagehide" : "unload";
    addEventListener(s, te, !1);
  }
}
function te() {
  for (let s in d.requests)
    d.requests.hasOwnProperty(s) && d.requests[s].abort();
}
const W = (() => typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0))(), R = l.WebSocket || l.MozWebSocket, se = !0, We = "arraybuffer", ie = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ye extends K {
  /**
   * WebSocket transport constructor.
   *
   * @param {Object} opts - connection options
   * @protected
   */
  constructor(e) {
    super(e), this.supportsBinary = !e.forceBase64;
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (!this.check())
      return;
    const e = this.uri(), t = this.opts.protocols, i = ie ? {} : ue(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (i.headers = this.opts.extraHeaders);
    try {
      this.ws = se && !ie ? t ? new R(e, t) : new R(e) : new R(e, t, i);
    } catch (n) {
      return this.emitReserved("error", n);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const i = e[t], n = t === e.length - 1;
      M(i, this.supportsBinary, (r) => {
        const o = {};
        try {
          se && this.ws.send(r);
        } catch {
        }
        n && W(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = pe()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!R;
  }
}
class ze extends K {
  get name() {
    return "webtransport";
  }
  doOpen() {
    typeof WebTransport == "function" && (this.transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]), this.transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this.transport.ready.then(() => {
      this.transport.createBidirectionalStream().then((e) => {
        const t = xe(Number.MAX_SAFE_INTEGER, this.socket.binaryType), i = e.readable.pipeThrough(t).getReader(), n = Ce();
        n.readable.pipeTo(e.writable), this.writer = n.writable.getWriter();
        const r = () => {
          i.read().then(({ done: h, value: a }) => {
            h || (this.onPacket(a), r());
          }).catch((h) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this.writer.write(o).then(() => this.onOpen());
      });
    }));
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const i = e[t], n = t === e.length - 1;
      this.writer.write(i).then(() => {
        n && W(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this.transport) === null || e === void 0 || e.close();
  }
}
const Je = {
  websocket: Ye,
  webtransport: ze,
  polling: Ke
}, Xe = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Qe = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function U(s) {
  const e = s, t = s.indexOf("["), i = s.indexOf("]");
  t != -1 && i != -1 && (s = s.substring(0, t) + s.substring(t, i).replace(/:/g, ";") + s.substring(i, s.length));
  let n = Xe.exec(s || ""), r = {}, o = 14;
  for (; o--; )
    r[Qe[o]] = n[o] || "";
  return t != -1 && i != -1 && (r.source = e, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = je(r, r.path), r.queryKey = Ge(r, r.query), r;
}
function je(s, e) {
  const t = /\/{2,9}/g, i = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && i.splice(0, 1), e.slice(-1) == "/" && i.splice(i.length - 1, 1), i;
}
function Ge(s, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(i, n, r) {
    n && (t[n] = r);
  }), t;
}
let ge = class w extends f {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t = {}) {
    super(), this.binaryType = We, this.writeBuffer = [], e && typeof e == "object" && (t = e, e = null), e ? (e = U(e), t.hostname = e.host, t.secure = e.protocol === "https" || e.protocol === "wss", t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = U(t.host).host), N(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = t.transports || [
      "polling",
      "websocket",
      "webtransport"
    ], this.writeBuffer = [], this.prevBufferLen = 0, this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Ue(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this.beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this.offlineEventListener = () => {
      this.onClose("transport close", {
        description: "network connection lost"
      });
    }, addEventListener("offline", this.offlineEventListener, !1))), this.open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = fe, t.transport = e, this.id && (t.sid = this.id);
    const i = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new Je[e](i);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && w.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
      e = "websocket";
    else if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    } else
      e = this.transports[0];
    this.readyState = "opening";
    try {
      e = this.createTransport(e);
    } catch {
      this.transports.shift(), this.open();
      return;
    }
    e.open(), this.setTransport(e);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (t) => this.onClose("transport close", t));
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  probe(e) {
    let t = this.createTransport(e), i = !1;
    w.priorWebsocketSuccess = !1;
    const n = () => {
      i || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (b) => {
        if (!i)
          if (b.type === "pong" && b.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            w.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              i || this.readyState !== "closed" && (g(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const _ = new Error("probe error");
            _.transport = t.name, this.emitReserved("upgradeError", _);
          }
      }));
    };
    function r() {
      i || (i = !0, g(), t.close(), t = null);
    }
    const o = (b) => {
      const _ = new Error("probe error: " + b);
      _.transport = t.name, r(), this.emitReserved("upgradeError", _);
    };
    function h() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function m(b) {
      t && b.name !== t.name && r();
    }
    const g = () => {
      t.removeListener("open", n), t.removeListener("error", o), t.removeListener("close", h), this.off("close", a), this.off("upgrading", m);
    };
    t.once("open", n), t.once("error", o), t.once("close", h), this.once("close", a), this.once("upgrading", m), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      i || t.open();
    }, 200) : t.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", w.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
      let e = 0;
      const t = this.upgrades.length;
      for (; e < t; e++)
        this.probe(this.upgrades[e]);
    }
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), this.resetPingTimeout(), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this.sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong");
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this.onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this.resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer), this.pingTimeoutTimer = this.setTimeoutFn(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this.getWritablePackets();
      this.transport.send(e), this.prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  getWritablePackets() {
    if (!(this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let i = 0; i < this.writeBuffer.length; i++) {
      const n = this.writeBuffer[i].data;
      if (n && (t += qe(n)), i > 0 && t > this.maxPayload)
        return this.writeBuffer.slice(0, i);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, i) {
    return this.sendPacket("message", e, t, i), this;
  }
  send(e, t, i) {
    return this.sendPacket("message", e, t, i), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  sendPacket(e, t, i, n) {
    if (typeof t == "function" && (n = t, t = void 0), typeof i == "function" && (n = i, i = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    i = i || {}, i.compress = i.compress !== !1;
    const r = {
      type: e,
      data: t,
      options: i
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), n && this.once("flush", n), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this.onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, i = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? i() : e();
    }) : this.upgrading ? i() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  onError(e) {
    w.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  onClose(e, t) {
    (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") && (this.clearTimeoutFn(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), typeof removeEventListener == "function" && (removeEventListener("beforeunload", this.beforeunloadEventListener, !1), removeEventListener("offline", this.offlineEventListener, !1)), this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this.prevBufferLen = 0);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  filterUpgrades(e) {
    const t = [];
    let i = 0;
    const n = e.length;
    for (; i < n; i++)
      ~this.transports.indexOf(e[i]) && t.push(e[i]);
    return t;
  }
};
ge.protocol = fe;
function Ze(s, e = "", t) {
  let i = s;
  t = t || typeof location < "u" && location, s == null && (s = t.protocol + "//" + t.host), typeof s == "string" && (s.charAt(0) === "/" && (s.charAt(1) === "/" ? s = t.protocol + s : s = t.host + s), /^(https?|wss?):\/\//.test(s) || (typeof t < "u" ? s = t.protocol + "//" + s : s = "https://" + s), i = U(s)), i.port || (/^(http|ws)$/.test(i.protocol) ? i.port = "80" : /^(http|ws)s$/.test(i.protocol) && (i.port = "443")), i.path = i.path || "/";
  const r = i.host.indexOf(":") !== -1 ? "[" + i.host + "]" : i.host;
  return i.id = i.protocol + "://" + r + ":" + i.port + e, i.href = i.protocol + "://" + r + (t && t.port === i.port ? "" : ":" + i.port), i;
}
const et = typeof ArrayBuffer == "function", tt = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s.buffer instanceof ArrayBuffer, me = Object.prototype.toString, st = typeof Blob == "function" || typeof Blob < "u" && me.call(Blob) === "[object BlobConstructor]", it = typeof File == "function" || typeof File < "u" && me.call(File) === "[object FileConstructor]";
function Y(s) {
  return et && (s instanceof ArrayBuffer || tt(s)) || st && s instanceof Blob || it && s instanceof File;
}
function C(s, e) {
  if (!s || typeof s != "object")
    return !1;
  if (Array.isArray(s)) {
    for (let t = 0, i = s.length; t < i; t++)
      if (C(s[t]))
        return !0;
    return !1;
  }
  if (Y(s))
    return !0;
  if (s.toJSON && typeof s.toJSON == "function" && arguments.length === 1)
    return C(s.toJSON(), !0);
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && C(s[t]))
      return !0;
  return !1;
}
function nt(s) {
  const e = [], t = s.data, i = s;
  return i.data = $(t, e), i.attachments = e.length, { packet: i, buffers: e };
}
function $(s, e) {
  if (!s)
    return s;
  if (Y(s)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(s), t;
  } else if (Array.isArray(s)) {
    const t = new Array(s.length);
    for (let i = 0; i < s.length; i++)
      t[i] = $(s[i], e);
    return t;
  } else if (typeof s == "object" && !(s instanceof Date)) {
    const t = {};
    for (const i in s)
      Object.prototype.hasOwnProperty.call(s, i) && (t[i] = $(s[i], e));
    return t;
  }
  return s;
}
function rt(s, e) {
  return s.data = V(s.data, e), delete s.attachments, s;
}
function V(s, e) {
  if (!s)
    return s;
  if (s && s._placeholder === !0) {
    if (typeof s.num == "number" && s.num >= 0 && s.num < e.length)
      return e[s.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(s))
    for (let t = 0; t < s.length; t++)
      s[t] = V(s[t], e);
  else if (typeof s == "object")
    for (const t in s)
      Object.prototype.hasOwnProperty.call(s, t) && (s[t] = V(s[t], e));
  return s;
}
const ot = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], ct = 5;
var c;
(function(s) {
  s[s.CONNECT = 0] = "CONNECT", s[s.DISCONNECT = 1] = "DISCONNECT", s[s.EVENT = 2] = "EVENT", s[s.ACK = 3] = "ACK", s[s.CONNECT_ERROR = 4] = "CONNECT_ERROR", s[s.BINARY_EVENT = 5] = "BINARY_EVENT", s[s.BINARY_ACK = 6] = "BINARY_ACK";
})(c || (c = {}));
class at {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === c.EVENT || e.type === c.ACK) && C(e) ? this.encodeAsBinary({
      type: e.type === c.EVENT ? c.BINARY_EVENT : c.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === c.BINARY_EVENT || e.type === c.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = nt(e), i = this.encodeAsString(t.packet), n = t.buffers;
    return n.unshift(i), n;
  }
}
function ne(s) {
  return Object.prototype.toString.call(s) === "[object Object]";
}
class z extends f {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const i = t.type === c.BINARY_EVENT;
      i || t.type === c.BINARY_ACK ? (t.type = i ? c.EVENT : c.ACK, this.reconstructor = new ht(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (Y(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const i = {
      type: Number(e.charAt(0))
    };
    if (c[i.type] === void 0)
      throw new Error("unknown packet type " + i.type);
    if (i.type === c.BINARY_EVENT || i.type === c.BINARY_ACK) {
      const r = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(r, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      i.attachments = Number(o);
    }
    if (e.charAt(t + 1) === "/") {
      const r = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      i.nsp = e.substring(r, t);
    } else
      i.nsp = "/";
    const n = e.charAt(t + 1);
    if (n !== "" && Number(n) == n) {
      const r = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      i.id = Number(e.substring(r, t + 1));
    }
    if (e.charAt(++t)) {
      const r = this.tryParse(e.substr(t));
      if (z.isPayloadValid(i.type, r))
        i.data = r;
      else
        throw new Error("invalid payload");
    }
    return i;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case c.CONNECT:
        return ne(t);
      case c.DISCONNECT:
        return t === void 0;
      case c.CONNECT_ERROR:
        return typeof t == "string" || ne(t);
      case c.EVENT:
      case c.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && ot.indexOf(t[0]) === -1);
      case c.ACK:
      case c.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class ht {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = rt(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: z,
  Encoder: at,
  get PacketType() {
    return c;
  },
  protocol: ct
}, Symbol.toStringTag, { value: "Module" }));
function p(s, e, t) {
  return s.on(e, t), function() {
    s.off(e, t);
  };
}
const ut = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class be extends f {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, i) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, i && i.auth && (this.auth = i.auth), this._opts = Object.assign({}, i), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      p(e, "open", this.onopen.bind(this)),
      p(e, "packet", this.onpacket.bind(this)),
      p(e, "error", this.onerror.bind(this)),
      p(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    if (ut.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const i = {
      type: c.EVENT,
      data: t
    };
    if (i.options = {}, i.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const o = this.ids++, h = t.pop();
      this._registerAckCallback(o, h), i.id = o;
    }
    const n = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
    return this.flags.volatile && (!n || !this.connected) || (this.connected ? (this.notifyOutgoingListeners(i), this.packet(i)) : this.sendBuffer.push(i)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var i;
    const n = (i = this.flags.timeout) !== null && i !== void 0 ? i : this._opts.ackTimeout;
    if (n === void 0) {
      this.acks[e] = t;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let o = 0; o < this.sendBuffer.length; o++)
        this.sendBuffer[o].id === e && this.sendBuffer.splice(o, 1);
      t.call(this, new Error("operation has timed out"));
    }, n);
    this.acks[e] = (...o) => {
      this.io.clearTimeoutFn(r), t.apply(this, [null, ...o]);
    };
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    const i = this.flags.timeout !== void 0 || this._opts.ackTimeout !== void 0;
    return new Promise((n, r) => {
      t.push((o, h) => i ? o ? r(o) : n(h) : n(o)), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const i = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((n, ...r) => i !== this._queue[0] ? void 0 : (n !== null ? i.tryCount > this._opts.retries && (this._queue.shift(), t && t(n)) : (this._queue.shift(), t && t(null, ...r)), i.pending = !1, this._drainQueue())), this._queue.push(i), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: c.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t);
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case c.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case c.EVENT:
        case c.BINARY_EVENT:
          this.onevent(e);
          break;
        case c.ACK:
        case c.BINARY_ACK:
          this.onack(e);
          break;
        case c.DISCONNECT:
          this.ondisconnect();
          break;
        case c.CONNECT_ERROR:
          this.destroy();
          const i = new Error(e.data.message);
          i.data = e.data.data, this.emitReserved("connect_error", i);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const i of t)
        i.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let i = !1;
    return function(...n) {
      i || (i = !0, t.packet({
        type: c.ACK,
        id: e,
        data: n
      }));
    };
  }
  /**
   * Called upon a server acknowlegement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (t.apply(this, e.data), delete this.acks[e.id]);
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: c.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let i = 0; i < t.length; i++)
        if (e === t[i])
          return t.splice(i, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let i = 0; i < t.length; i++)
        if (e === t[i])
          return t.splice(i, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const i of t)
        i.apply(this, e.data);
    }
  }
}
function k(s) {
  s = s || {}, this.ms = s.min || 100, this.max = s.max || 1e4, this.factor = s.factor || 2, this.jitter = s.jitter > 0 && s.jitter <= 1 ? s.jitter : 0, this.attempts = 0;
}
k.prototype.duration = function() {
  var s = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * s);
    s = Math.floor(e * 10) & 1 ? s + t : s - t;
  }
  return Math.min(s, this.max) | 0;
};
k.prototype.reset = function() {
  this.attempts = 0;
};
k.prototype.setMin = function(s) {
  this.ms = s;
};
k.prototype.setMax = function(s) {
  this.max = s;
};
k.prototype.setJitter = function(s) {
  this.jitter = s;
};
class F extends f {
  constructor(e, t) {
    var i;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, N(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((i = t.randomizationFactor) !== null && i !== void 0 ? i : 0.5), this.backoff = new k({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const n = t.parser || ft;
    this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new ge(this.uri, this.opts);
    const t = this.engine, i = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const n = p(t, "open", function() {
      i.onopen(), e && e();
    }), r = (h) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", h), e ? e(h) : this.maybeReconnectOnOpen();
    }, o = p(t, "error", r);
    if (this._timeout !== !1) {
      const h = this._timeout, a = this.setTimeoutFn(() => {
        n(), r(new Error("timeout")), t.close();
      }, h);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
      });
    }
    return this.subs.push(n), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(p(e, "ping", this.onping.bind(this)), p(e, "data", this.ondata.bind(this)), p(e, "error", this.onerror.bind(this)), p(e, "close", this.onclose.bind(this)), p(this.decoder, "decoded", this.ondecoded.bind(this)));
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    W(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let i = this.nsps[e];
    return i ? this._autoConnect && !i.active && i.connect() : (i = new be(this, e, t), this.nsps[e] = i), i;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const i of t)
      if (this.nsps[i].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let i = 0; i < t.length; i++)
      this.engine.write(t[i], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close"), this.engine && this.engine.close();
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called upon engine close.
   *
   * @private
   */
  onclose(e, t) {
    this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const i = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((n) => {
          n ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", n)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && i.unref(), this.subs.push(() => {
        this.clearTimeoutFn(i);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const E = {};
function x(s, e) {
  typeof s == "object" && (e = s, s = void 0), e = e || {};
  const t = Ze(s, e.path || "/socket.io"), i = t.source, n = t.id, r = t.path, o = E[n] && r in E[n].nsps, h = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return h ? a = new F(i, e) : (E[n] || (E[n] = new F(i, e)), a = E[n]), t.query && !e.query && (e.query = t.queryKey), a.socket(t.path, e);
}
Object.assign(x, {
  Manager: F,
  Socket: be,
  io: x,
  connect: x
});
class dt {
  /**
   * lets take all resource
   * @param io
   * @param vuex
   * @param debug
   * @param options
   */
  constructor({ connection: e, vuex: t, debug: i, options: n }) {
    u.debug = i, this.io = this.connect(e, n), this.emitter = new Ee(t), this.listener = new q(this.io, this.emitter);
  }
  /**
   * Vue.js entry point
   * @param Vue
   */
  install(e) {
    Number(e.version.split(".")[0]) >= 3 ? (e.config.globalProperties.$socket = this.io, e.config.globalProperties.$vueSocketIo = this) : (e.prototype.$socket = this.io, e.prototype.$vueSocketIo = this), e.mixin(_e), u.info("Vue-X-Socket.io plugin enabled");
  }
  /**
   * registering SocketIO instance
   * @param connection
   * @param options
   */
  connect(e, t) {
    if (e && typeof e == "object")
      return u.info("Received socket.io-client instance"), e;
    if (typeof e == "string")
      return u.info("Received connection string"), this.io = x(e, t);
    throw new Error("Unsupported connection type");
  }
}
export {
  dt as default
};
