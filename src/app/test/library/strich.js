function A(A) {
  return A && A.__esModule ? A.default : A;
}
class I {
  static localStorageKey = 'strich_device_id';
  static getDeviceId() {
    return localStorage.getItem(I.localStorageKey);
  }
  static setDeviceId(A) {
    localStorage.setItem(I.localStorageKey, A);
  }
}
let g;
var B;
((B = g || (g = {})).offline = 'offline'),
  (B.analyticsOptOut = 'analyticsOptOut'),
  (B.customOverlayLogo = 'customOverlayLogo');
class C {
  constructor(A) {
    const I = A.split('.');
    if (3 !== I.length) throw new Error('Malformed license key');
    const g = I[1].replace(/-/g, '+').replace(/_/g, '/'),
      B = decodeURIComponent(
        atob(g)
          .split('')
          .map(A => '%' + ('00' + A.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
    try {
      (this.licenseJwt = JSON.parse(B)), (this.licenseKey = A);
    } catch (A) {
      throw new Error('Malformed license key');
    }
    if (
      null == this.licenseJwt.aud ||
      null == this.licenseJwt.sub ||
      null == this.licenseJwt.iss ||
      null == this.licenseJwt.version
    )
      throw new Error('Malformed license key');
  }
  get expiration() {
    return this.licenseJwt.exp;
  }
  get licenseId() {
    return this.licenseJwt.sub;
  }
  get scope() {
    return this.licenseJwt.aud;
  }
  get isDevLicense() {
    return true;
    return 'dev.strich.io' === this.licenseJwt.iss;
  }
  get isOffline() {
    return (
      this.licenseJwt.capabilities.hasOwnProperty(g.offline) &&
      !0 === this.licenseJwt.capabilities[g.offline]
    );
  }
  get isAnalyticsOptOut() {
    return (
      this.licenseJwt.capabilities.hasOwnProperty(g.analyticsOptOut) &&
      !0 === this.licenseJwt.capabilities[g.analyticsOptOut]
    );
  }
  get hasCustomOverlayLogoCapability() {
    return (
      this.licenseJwt.capabilities.hasOwnProperty(g.customOverlayLogo) &&
      !0 === this.licenseJwt.capabilities[g.customOverlayLogo]
    );
  }
  get version() {
    return this.licenseJwt.version;
  }
}
class Q {
  static defaultLang = 'en';
  static lang = 'en';
  static translations = {
    en: {
      'action.reload': 'Reload application',
      'action.retry': 'Retry',
      'action.resumeScanning': 'Resume scanning',
      'error.internal': 'An internal error has occurred.',
      'error.requirementsNotFulfilled':
        'Your browser is not supported. Please use an up-to-date browser.',
      'error.featureNotAvailable':
        'Your browser does not support this feature.',
      'error.cameraNotReadable':
        'Unable to open camera. Make sure no other app or browser tab is using the camera.',
      'error.cameraNotAllowed':
        'Camera access is not permitted, please review website permissions and retry.',
      'error.cameraNotFound': 'No suitable camera device was found.',
      'error.cameraOverconstrained':
        'Camera access failed, camera device is not compatible.',
      'error.cameraAbort': 'Camera access was aborted.',
      'error.cameraLost':
        'Access to camera stream was lost, please tap to re-acquire.',
      'error.sdkNotInitialized':
        'Please initialize the SDK before using a BarcodeReader.',
      'error.licenseInvalid':
        'The license key is invalid or expired. Please obtain a new one.',
      'error.licenseCheckFailed':
        'The license key could not be checked. An internet connection is required.',
      'error.outdatedSdk':
        'The STRICH SDK is out of date, please update to a more recent version.',
      'error.invalidConfiguration': 'The supplied configuration is not valid.',
    },
    de: {
      'action.reload': 'App neu laden',
      'action.retry': 'Nochmals versuchen',
      'action.resumeScanning': 'Scanning fortsetzen',
      'error.internal': 'Ein interner Fehler ist aufgetreten.',
      'error.requirementsNotFulfilled':
        'Ihr Browser ist nicht unterstützt. Bitte verwenden Sie einen aktuellen Browser.',
      'error.featureNotAvailable':
        'Ihr Browser unterstützt diese Funktion nicht.',
      'error.cameraNotReadable':
        'Kamerazugriff fehlgeschlagen, bitte stellen Sie sicher dass keine andere App oder Browser-Tab die Kamera verwendet.',
      'error.cameraNotAllowed':
        'Kamerazugriff nicht erlaubt, bitte passen sie die Berechtigungen der Webseite an.',
      'error.cameraNotFound': 'Keine geeignete Kamera gefunden.',
      'error.cameraOverconstrained': 'Keine kompatible Kamera gefunden.',
      'error.cameraAbort': 'Kamerazugriff fehlgeschlagen.',
      'error.cameraLost':
        'Der Kamerazugriff ging verloren, bitte tippen sie auf den Knopf um ihn wieder anzufordern.',
    },
    fr: {
      'action.reload': "Recharger l'application",
      'action.retry': 'Réessayer',
      'action.resumeScanning': 'Reprendre la lecture des codes-barres',
      'error.internal': "Une erreur interne s'est produite.",
      'error.requirementsNotFulfilled':
        "Votre navigateur n'est pas pris en charge. Veuillez utiliser un navigateur plus récent.",
      'error.featureNotAvailable':
        'Votre navigateur ne prend pas en charge cette fonctionnalité.',
      'error.cameraNotReadable':
        "Impossible d'accéder à la caméra. Assurez-vous qu'aucune autre application ou onglet de navigateur n'y accède.",
      'error.cameraNotAllowed':
        "L'accès à la caméra n'est pas autorisé, veuillez vérifier les autorisations du site web et réessayer.",
      'error.cameraNotFound': "Aucune caméra approprié n'a été trouvé.",
      'error.cameraOverconstrained':
        "L'accès à la caméra a échoué, l'appareil photo n'est pas compatible.",
      'error.cameraAbort': "L'accès à la caméra a été interrompu.",
      'error.cameraLost':
        "L'accès au flux de données de la caméra a été perdu, veuillez appuyer sur le bouton pour le réacquérir.",
    },
    it: {
      'action.reload': "Ricarica l'applicazione",
      'action.retry': 'Riprovare',
      'action.resumeScanning': 'Riprendere la scansione',
      'error.internal': 'Si è verificato un errore interno.',
      'error.requirementsNotFulfilled':
        'Il vostro browser non è supportato. Utilizzare un browser aggiornato.',
      'error.featureNotAvailable': 'Il browser non supporta questa funzione.',
      'error.cameraNotReadable':
        "Impossibile aprire la fotocamera. Assicuratevi che nessun'altra applicazione o scheda del browser stia utilizzando la fotocamera.",
      'error.cameraNotAllowed':
        "L'accesso alla fotocamera non è consentito, controllare le autorizzazioni del sito web e riprovare.",
      'error.cameraNotFound':
        'Non è stato trovato un dispositivo fotocamera adatto.',
      'error.cameraOverconstrained':
        "L'accesso alla fotocamera non è riuscito, il dispositivo non è compatibile.",
      'error.cameraAbort': "L'accesso alla fotocamera è stato interrotto.",
      'error.cameraLost':
        "L'accesso al flusso della camera è stato perso, toccare per riaccedere.",
    },
    es: {
      'action.reload': 'Recargar la aplicación',
      'action.retry': 'Reintentar',
      'action.resumeScanning': 'Reanudar la lectura del código de barras',
      'error.internal': 'Se ha producido un error interno.',
      'error.requirementsNotFulfilled':
        'Su navegador no es compatible. Utilice un navegador actualizado.',
      'error.featureNotAvailable':
        'Su navegador no es compatible con esta función.',
      'error.cameraNotReadable':
        'No se puede abrir la cámara. Asegúrate de que ninguna otra aplicación o pestaña del navegador esté utilizando la cámara.',
      'error.cameraNotAllowed':
        'El acceso a la cámara no está permitido, revisa los permisos del sitio web y vuelve a intentarlo.',
      'error.cameraNotFound':
        'No se ha encontrado ningún dispositivo de cámara adecuado.',
      'error.cameraOverconstrained':
        'El acceso a la cámara ha fallado, el dispositivo de la cámara no es compatible.',
      'error.cameraAbort': 'Se ha cancelado el acceso a la cámara.',
      'error.cameraLost':
        'Se ha perdido el acceso a la cámara, pulse para volver a obtenerlo.',
    },
  };
  static setLanguageFromNavigator(A) {
    let I = this.defaultLang;
    A && (I = A.split('-')[0].toLowerCase()),
      I in Q.translations ? (Q.lang = I) : (Q.lang = this.defaultLang);
  }
  static t(A) {
    const I = Q.translations[Q.lang];
    return I[A]
      ? I[A]
      : Q.translations[Q.defaultLang][A]
      ? Q.translations[Q.defaultLang][A]
      : A;
  }
  static default(A) {
    return Q.translations[Q.defaultLang][A] ?? A;
  }
}
class E extends Error {
  constructor(A, I) {
    super(A),
      Object.setPrototypeOf(this, E.prototype),
      (this.name = this.constructor.name),
      (this.duringCameraAccess = !1),
      (this.message = Q.default(A) ?? A),
      (this.localizedMessage = Q.t(A) ?? this.message),
      (this.cause = I),
      (this.detailMessage = I?.message);
  }
  static internalErrorWithCause(A) {
    return A instanceof Error
      ? new E('error.internal', A)
      : new E('error.internal');
  }
  static internalErrorWithDetail(A) {
    const I = new E('error.internal');
    return (I.detailMessage = A), I;
  }
  static configurationErrorWithDetail(A) {
    const I = new E('error.invalidConfiguration');
    return (I.detailMessage = A), I;
  }
  static fromGetUserMediaError(A) {
    let I;
    switch (A.name) {
      case 'NotReadableError':
      default:
        I = 'error.cameraNotReadable';
        break;
      case 'NotFoundError':
        I = 'error.cameraNotFound';
        break;
      case 'AbortError':
        I = 'error.cameraAbort';
        break;
      case 'NotAllowedError':
        I = 'error.cameraNotAllowed';
        break;
      case 'OverconstrainedError':
        I = 'error.cameraOverconstrained';
    }
    const g = new E(I, A);
    return (g.duringCameraAccess = !0), g;
  }
}
function i(A) {
  const I = A.replace(/-/g, '+').replace(/_/g, '/'),
    g = atob(I),
    B = [];
  for (let A = 0; A < g.length; A++) B.push(g.charCodeAt(A));
  return new Uint8Array(B);
}
function o(A) {
  const I = [];
  let g = 0;
  for (let B = 0; B < A.length; B++) {
    let C = A.charCodeAt(B);
    C < 128
      ? (I[g++] = C)
      : C < 2048
      ? ((I[g++] = (C >> 6) | 192), (I[g++] = (63 & C) | 128))
      : 55296 == (64512 & C) &&
        B + 1 < A.length &&
        56320 == (64512 & A.charCodeAt(B + 1))
      ? ((C = 65536 + ((1023 & C) << 10) + (1023 & A.charCodeAt(++B))),
        (I[g++] = (C >> 18) | 240),
        (I[g++] = ((C >> 12) & 63) | 128),
        (I[g++] = ((C >> 6) & 63) | 128),
        (I[g++] = (63 & C) | 128))
      : ((I[g++] = (C >> 12) | 224),
        (I[g++] = ((C >> 6) & 63) | 128),
        (I[g++] = (63 & C) | 128));
  }
  return new Uint8Array(I);
}
const e = BigInt(0),
  t = BigInt(1),
  D = BigInt(2),
  s = BigInt(8),
  a = BigInt(
    '7237005577332262213973186563042994240857116359379907606001950938285454250989',
  ),
  r = Object.freeze({
    a: BigInt(-1),
    d: BigInt(
      '37095705934669439343138083508754565189542113879843219016388785533085940283555',
    ),
    P: BigInt(
      '57896044618658097711785492504343953926634992332820282019728792003956564819949',
    ),
    l: a,
    n: a,
    h: BigInt(8),
    Gx: BigInt(
      '15112221349535400772501151409588531511454012693041857206046113283949847762202',
    ),
    Gy: BigInt(
      '46316835694926478169428394003475163141307993866256225615783033603165251855960',
    ),
  }),
  c = BigInt(
    '0x10000000000000000000000000000000000000000000000000000000000000000',
  ),
  w = BigInt(
    '19681161376707505956807079304988542015446066515923890162744021073123829784752',
  ),
  h =
    (BigInt(
      '6853475219497561581579357271197624642482790079785650197046958215289687604742',
    ),
    BigInt(
      '25063068953384623474111414158702152701244531502492656460079210482610430750235',
    )),
  n = BigInt(
    '54469307008909316920995813868745141605393597292927456921205312896311721017578',
  ),
  y = BigInt(
    '1159843021668779879193775521855586647937357759715417654439879720876111806838',
  ),
  S = BigInt(
    '40440834346308536858101042469323190826248399146238708352240133220865137265952',
  );
class F {
  constructor(A, I, g, B) {
    (this.x = A), (this.y = I), (this.z = g), (this.t = B);
  }
  static BASE = new F(r.Gx, r.Gy, t, q(r.Gx * r.Gy));
  static ZERO = new F(e, t, t, e);
  static fromAffine(A) {
    if (!(A instanceof d))
      throw new TypeError('ExtendedPoint#fromAffine: expected Point');
    return A.equals(d.ZERO) ? F.ZERO : new F(A.x, A.y, t, q(A.x * A.y));
  }
  static toAffineBatch(A) {
    const I = (function (A, I = r.P) {
      const g = new Array(A.length),
        B = T(
          A.reduce((A, B, C) => (B === e ? A : ((g[C] = A), q(A * B, I))), t),
          I,
        );
      return (
        A.reduceRight(
          (A, B, C) => (B === e ? A : ((g[C] = q(A * g[C], I)), q(A * B, I))),
          B,
        ),
        g
      );
    })(A.map(A => A.z));
    return A.map((A, g) => A.toAffine(I[g]));
  }
  static normalizeZ(A) {
    return this.toAffineBatch(A).map(this.fromAffine);
  }
  equals(A) {
    R(A);
    const {x: I, y: g, z: B} = this,
      {x: C, y: Q, z: E} = A,
      i = q(I * E),
      o = q(C * B),
      e = q(g * E),
      t = q(Q * B);
    return i === o && e === t;
  }
  negate() {
    return new F(q(-this.x), this.y, this.z, q(-this.t));
  }
  double() {
    const {x: A, y: I, z: g} = this,
      {a: B} = r,
      C = q(A * A),
      Q = q(I * I),
      E = q(D * q(g * g)),
      i = q(B * C),
      o = A + I,
      e = q(q(o * o) - C - Q),
      t = i + Q,
      s = t - E,
      a = i - Q,
      c = q(e * s),
      w = q(t * a),
      h = q(e * a),
      n = q(s * t);
    return new F(c, w, n, h);
  }
  add(A) {
    R(A);
    const {x: I, y: g, z: B, t: C} = this,
      {x: Q, y: E, z: i, t: o} = A,
      t = q((g - I) * (E + Q)),
      s = q((g + I) * (E - Q)),
      a = q(s - t);
    if (a === e) return this.double();
    const r = q(B * D * o),
      c = q(C * D * i),
      w = c + r,
      h = s + t,
      n = c - r,
      y = q(w * a),
      S = q(h * n),
      G = q(w * n),
      N = q(a * h);
    return new F(y, S, N, G);
  }
  subtract(A) {
    return this.add(A.negate());
  }
  precomputeWindow(A) {
    const I = 1 + 256 / A,
      g = [];
    let B = this,
      C = B;
    for (let Q = 0; Q < I; Q++) {
      (C = B), g.push(C);
      for (let I = 1; I < 2 ** (A - 1); I++) (C = C.add(B)), g.push(C);
      B = C.double();
    }
    return g;
  }
  wNAF(A, I) {
    !I && this.equals(F.BASE) && (I = d.BASE);
    const g = (I && I._WINDOW_SIZE) || 1;
    if (256 % g)
      throw new Error(
        'Point#wNAF: Invalid precomputation window, must be power of 2',
      );
    let B = I && U.get(I);
    B ||
      ((B = this.precomputeWindow(g)),
      I && 1 !== g && ((B = F.normalizeZ(B)), U.set(I, B)));
    let C = F.ZERO,
      Q = F.BASE;
    const E = 1 + 256 / g,
      i = 2 ** (g - 1),
      o = BigInt(2 ** g - 1),
      e = 2 ** g,
      D = BigInt(g);
    for (let I = 0; I < E; I++) {
      const g = I * i;
      let E = Number(A & o);
      (A >>= D), E > i && ((E -= e), (A += t));
      const s = g,
        a = g + Math.abs(E) - 1,
        r = I % 2 != 0,
        c = E < 0;
      0 === E ? (Q = Q.add(G(r, B[s]))) : (C = C.add(G(c, B[a])));
    }
    return F.normalizeZ([C, Q])[0];
  }
  multiply(A, I) {
    return this.wNAF(z(A, r.l), I);
  }
  multiplyUnsafe(A) {
    let I = z(A, r.l, !1);
    const g = F.BASE,
      B = F.ZERO;
    if (I === e) return B;
    if (this.equals(B) || I === t) return this;
    if (this.equals(g)) return this.wNAF(I);
    let C = B,
      Q = this;
    for (; I > e; ) I & t && (C = C.add(Q)), (Q = Q.double()), (I >>= t);
    return C;
  }
  isSmallOrder() {
    return this.multiplyUnsafe(r.h).equals(F.ZERO);
  }
  isTorsionFree() {
    let A = this.multiplyUnsafe(r.l / D).double();
    return r.l % D && (A = A.add(this)), A.equals(F.ZERO);
  }
  toAffine(A) {
    const {x: I, y: g, z: B} = this,
      C = this.equals(F.ZERO);
    null == A && (A = C ? s : T(B));
    const Q = q(I * A),
      E = q(g * A),
      i = q(B * A);
    if (C) return d.ZERO;
    if (i !== t) throw new Error('invZ was invalid');
    return new d(Q, E);
  }
  fromRistrettoBytes() {
    M();
  }
  toRistrettoBytes() {
    M();
  }
  fromRistrettoHash() {
    M();
  }
}
function G(A, I) {
  const g = I.negate();
  return A ? g : I;
}
function R(A) {
  if (!(A instanceof F)) throw new TypeError('ExtendedPoint expected');
}
function N(A) {
  if (!(A instanceof k)) throw new TypeError('RistrettoPoint expected');
}
function M() {
  throw new Error('Legacy method: switch to RistrettoPoint');
}
class k {
  static BASE = new k(F.BASE);
  static ZERO = new k(F.ZERO);
  constructor(A) {
    this.ep = A;
  }
  static calcElligatorRistrettoMap(A) {
    const {d: I} = r,
      g = q(w * A * A),
      B = q((g + t) * y);
    let C = BigInt(-1);
    const Q = q((C - I * g) * q(g + I));
    let {isValid: E, value: i} = P(B, Q),
      o = q(i * A);
    u(o) || (o = q(-o)), E || (i = o), E || (C = g);
    const e = q(C * (g - t) * S - Q),
      D = i * i,
      s = q((i + i) * Q),
      a = q(e * h),
      c = q(t - D),
      n = q(t + D);
    return new F(q(s * n), q(c * a), q(a * n), q(s * c));
  }
  static hashToCurve(A) {
    const I = m((A = j(A, 64)).slice(0, 32)),
      g = this.calcElligatorRistrettoMap(I),
      B = m(A.slice(32, 64)),
      C = this.calcElligatorRistrettoMap(B);
    return new k(g.add(C));
  }
  static fromHex(A) {
    A = j(A, 32);
    const {a: I, d: g} = r,
      B =
        'RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint',
      C = m(A);
    if (
      !(function (A, I) {
        if (A.length !== I.length) return !1;
        for (let g = 0; g < A.length; g++) if (A[g] !== I[g]) return !1;
        return !0;
      })(f(C), A) ||
      u(C)
    )
      throw new Error(B);
    const Q = q(C * C),
      E = q(t + I * Q),
      i = q(t - I * Q),
      o = q(E * E),
      D = q(i * i),
      s = q(I * g * o - D),
      {isValid: a, value: c} = v(q(s * D)),
      w = q(c * i),
      h = q(c * w * s);
    let n = q((C + C) * w);
    u(n) && (n = q(-n));
    const y = q(E * h),
      S = q(n * y);
    if (!a || u(S) || y === e) throw new Error(B);
    return new k(new F(n, y, t, S));
  }
  toRawBytes() {
    let {x: A, y: I, z: g, t: B} = this.ep;
    const C = q(q(g + I) * q(g - I)),
      Q = q(A * I),
      E = q(Q * Q),
      {value: i} = v(q(C * E)),
      o = q(i * C),
      e = q(i * Q),
      t = q(o * e * B);
    let D;
    if (u(B * t)) {
      let g = q(I * w),
        B = q(A * w);
      (A = g), (I = B), (D = q(o * n));
    } else D = e;
    u(A * t) && (I = q(-I));
    let s = q((g - I) * D);
    return u(s) && (s = q(-s)), f(s);
  }
  toHex() {
    return Y(this.toRawBytes());
  }
  toString() {
    return this.toHex();
  }
  equals(A) {
    N(A);
    const I = this.ep,
      g = A.ep,
      B = q(I.x * g.y) === q(I.y * g.x),
      C = q(I.y * g.y) === q(I.x * g.x);
    return B || C;
  }
  add(A) {
    return N(A), new k(this.ep.add(A.ep));
  }
  subtract(A) {
    return N(A), new k(this.ep.subtract(A.ep));
  }
  multiply(A) {
    return new k(this.ep.multiply(A));
  }
  multiplyUnsafe(A) {
    return new k(this.ep.multiplyUnsafe(A));
  }
}
const U = new WeakMap();
class d {
  static BASE = new d(r.Gx, r.Gy);
  static ZERO = new d(e, t);
  constructor(A, I) {
    (this.x = A), (this.y = I);
  }
  _setWindowSize(A) {
    (this._WINDOW_SIZE = A), U.delete(this);
  }
  static fromHex(A, I = !0) {
    const {d: g, P: B} = r,
      C = (A = j(A, 32)).slice();
    C[31] = -129 & A[31];
    const Q = x(C);
    if (I && Q >= B) throw new Error('Expected 0 < hex < P');
    if (!I && Q >= c) throw new Error('Expected 0 < hex < 2**256');
    const E = q(Q * Q),
      i = q(E - t),
      o = q(g * E + t);
    let {isValid: e, value: D} = P(i, o);
    if (!e) throw new Error('Point.fromHex: invalid y coordinate');
    const s = (D & t) === t;
    return (0 != (128 & A[31])) !== s && (D = q(-D)), new d(D, Q);
  }
  static async fromPrivateKey(A) {
    return (await $(A)).point;
  }
  toRawBytes() {
    const A = f(this.y);
    return (A[31] |= this.x & t ? 128 : 0), A;
  }
  toHex() {
    return Y(this.toRawBytes());
  }
  toX25519() {
    const {y: A} = this;
    return f(q((t + A) * T(t - A)));
  }
  isTorsionFree() {
    return F.fromAffine(this).isTorsionFree();
  }
  equals(A) {
    return this.x === A.x && this.y === A.y;
  }
  negate() {
    return new d(q(-this.x), this.y);
  }
  add(A) {
    return F.fromAffine(this).add(F.fromAffine(A)).toAffine();
  }
  subtract(A) {
    return this.add(A.negate());
  }
  multiply(A) {
    return F.fromAffine(this).multiply(A, this).toAffine();
  }
}
class L {
  constructor(A, I) {
    (this.r = A), (this.s = I), this.assertValidity();
  }
  static fromHex(A) {
    const I = j(A, 64),
      g = d.fromHex(I.slice(0, 32), !1),
      B = x(I.slice(32, 64));
    return new L(g, B);
  }
  assertValidity() {
    const {r: A, s: I} = this;
    if (!(A instanceof d)) throw new Error('Expected Point instance');
    return z(I, r.l, !1), this;
  }
  toRawBytes() {
    const A = new Uint8Array(64);
    return A.set(this.r.toRawBytes()), A.set(f(this.s), 32), A;
  }
  toHex() {
    return Y(this.toRawBytes());
  }
}
function K(...A) {
  if (!A.every(A => A instanceof Uint8Array))
    throw new Error('Expected Uint8Array list');
  if (1 === A.length) return A[0];
  const I = A.reduce((A, I) => A + I.length, 0),
    g = new Uint8Array(I);
  for (let I = 0, B = 0; I < A.length; I++) {
    const C = A[I];
    g.set(C, B), (B += C.length);
  }
  return g;
}
const J = Array.from({length: 256}, (A, I) => I.toString(16).padStart(2, '0'));
function Y(A) {
  if (!(A instanceof Uint8Array)) throw new Error('Uint8Array expected');
  let I = '';
  for (let g = 0; g < A.length; g++) I += J[A[g]];
  return I;
}
function H(A) {
  if ('string' != typeof A)
    throw new TypeError('hexToBytes: expected string, got ' + typeof A);
  if (A.length % 2)
    throw new Error('hexToBytes: received invalid unpadded hex');
  const I = new Uint8Array(A.length / 2);
  for (let g = 0; g < I.length; g++) {
    const B = 2 * g,
      C = A.slice(B, B + 2),
      Q = Number.parseInt(C, 16);
    if (Number.isNaN(Q) || Q < 0) throw new Error('Invalid byte sequence');
    I[g] = Q;
  }
  return I;
}
function l(A) {
  return H(A.toString(16).padStart(64, '0'));
}
function f(A) {
  return l(A).reverse();
}
function u(A) {
  return (q(A) & t) === t;
}
function x(A) {
  if (!(A instanceof Uint8Array)) throw new Error('Expected Uint8Array');
  return BigInt('0x' + Y(Uint8Array.from(A).reverse()));
}
const p = BigInt(
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
function m(A) {
  return q(x(A) & p);
}
function q(A, I = r.P) {
  const g = A % I;
  return g >= e ? g : I + g;
}
function T(A, I = r.P) {
  if (A === e || I <= e)
    throw new Error(`invert: expected positive integers, got n=${A} mod=${I}`);
  let g = q(A, I),
    B = I,
    C = e,
    Q = t,
    E = t,
    i = e;
  for (; g !== e; ) {
    const A = B / g,
      I = B % g,
      o = C - E * A,
      e = Q - i * A;
    (B = g), (g = I), (C = E), (Q = i), (E = o), (i = e);
  }
  if (B !== t) throw new Error('invert: does not exist');
  return q(C, I);
}
function b(A, I) {
  const {P: g} = r;
  let B = A;
  for (; I-- > e; ) (B *= B), (B %= g);
  return B;
}
function O(A) {
  const {P: I} = r,
    g = BigInt(5),
    B = BigInt(10),
    C = BigInt(20),
    Q = BigInt(40),
    E = BigInt(80),
    i = (((A * A) % I) * A) % I,
    o = (b(i, D) * i) % I,
    e = (b(o, t) * A) % I,
    s = (b(e, g) * e) % I,
    a = (b(s, B) * s) % I,
    c = (b(a, C) * a) % I,
    w = (b(c, Q) * c) % I,
    h = (b(w, E) * w) % I,
    n = (b(h, E) * w) % I,
    y = (b(n, B) * s) % I;
  return {pow_p_5_8: (b(y, D) * A) % I, b2: i};
}
function P(A, I) {
  const g = q(I * I * I),
    B = q(g * g * I);
  let C = q(A * g * O(A * B).pow_p_5_8);
  const Q = q(I * C * C),
    E = C,
    i = q(C * w),
    o = Q === A,
    e = Q === q(-A),
    t = Q === q(-A * w);
  return (
    o && (C = E),
    (e || t) && (C = i),
    u(C) && (C = q(-C)),
    {isValid: o || e, value: C}
  );
}
function v(A) {
  return P(t, A);
}
function W(A) {
  return q(x(A), r.l);
}
function j(A, I) {
  const g = A instanceof Uint8Array ? Uint8Array.from(A) : H(A);
  if ('number' == typeof I && g.length !== I)
    throw new Error(`Expected ${I} bytes`);
  return g;
}
function z(A, I, g = !0) {
  if (!I) throw new TypeError('Specify max value');
  if (
    ('number' == typeof A && Number.isSafeInteger(A) && (A = BigInt(A)),
    'bigint' == typeof A && A < I)
  )
    if (g) {
      if (e < A) return A;
    } else if (e <= A) return A;
  throw new TypeError('Expected valid scalar: 0 < scalar < max');
}
function Z(A) {
  return (A[0] &= 248), (A[31] &= 127), (A[31] |= 64), A;
}
function X(A) {
  if (
    32 !==
    (A = 'bigint' == typeof A || 'number' == typeof A ? l(z(A, c)) : j(A))
      .length
  )
    throw new Error('Expected 32 bytes');
  return A;
}
function V(A) {
  const I = Z(A.slice(0, 32)),
    g = A.slice(32, 64),
    B = W(I),
    C = d.BASE.multiply(B),
    Q = C.toRawBytes();
  return {head: I, prefix: g, scalar: B, point: C, pointBytes: Q};
}
let _;
async function $(A) {
  return V(await CA.sha512(X(A)));
}
function AA(A, I, g) {
  (I = j(I)), g instanceof d || (g = d.fromHex(g, !1));
  const {r: B, s: C} = A instanceof L ? A.assertValidity() : L.fromHex(A);
  return {r: B, s: C, SB: F.BASE.multiplyUnsafe(C), pub: g, msg: I};
}
function IA(A, I, g, B) {
  const C = W(B),
    Q = F.fromAffine(A).multiplyUnsafe(C);
  return F.fromAffine(I).add(Q).subtract(g).multiplyUnsafe(r.h).equals(F.ZERO);
}
async function gA(A, I, g) {
  const {r: B, SB: C, msg: Q, pub: E} = AA(A, I, g),
    i = await CA.sha512(B.toRawBytes(), E.toRawBytes(), Q);
  return IA(E, B, C, i);
}
d.BASE._setWindowSize(8);
const BA = {
    web: 'object' == typeof self && 'crypto' in self ? self.crypto : void 0,
  },
  CA = {
    bytesToHex: Y,
    hexToBytes: H,
    concatBytes: K,
    getExtendedPublicKey: $,
    mod: q,
    invert: T,
    TORSION_SUBGROUP: [
      '0100000000000000000000000000000000000000000000000000000000000000',
      'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a',
      '0000000000000000000000000000000000000000000000000000000000000080',
      '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
      'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
      '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85',
      '0000000000000000000000000000000000000000000000000000000000000000',
      'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa',
    ],
    hashToPrivateScalar: A => {
      if ((A = j(A)).length < 40 || A.length > 1024)
        throw new Error(
          'Expected 40-1024 bytes of private key as per FIPS 186',
        );
      return q(x(A), r.l - t) + t;
    },
    randomBytes: (A = 32) => {
      if (BA.web) return BA.web.getRandomValues(new Uint8Array(A));
      if (BA.node) {
        const {randomBytes: I} = BA.node;
        return new Uint8Array(I(A).buffer);
      }
      throw new Error("The environment doesn't have randomBytes function");
    },
    randomPrivateKey: () => CA.randomBytes(32),
    sha512: async (...A) => {
      const I = K(...A);
      if (BA.web) {
        const A = await BA.web.subtle.digest('SHA-512', I.buffer);
        return new Uint8Array(A);
      }
      if (BA.node)
        return Uint8Array.from(BA.node.createHash('sha512').update(I).digest());
      throw new Error("The environment doesn't have sha512 function");
    },
    precompute(A = 8, I = d.BASE) {
      const g = I.equals(d.BASE) ? I : new d(I.x, I.y);
      return g._setWindowSize(A), g.multiply(D), g;
    },
    sha512Sync: void 0,
  };
function QA(A, I) {
  return {x: A, y: I};
}
function EA(A, I) {
  if (A < 0 || I < 0)
    throw E.internalErrorWithDetail(
      'Negative width or height passed to makeSize()',
    );
  return {width: A, height: I};
}
function iA(A, I) {
  return {origin: A, size: I};
}
function oA(A) {
  return (
    0 === A.origin.x &&
    0 === A.origin.y &&
    0 === A.size.width &&
    0 === A.size.height
  );
}
function eA(A, I) {
  if (
    I.left < 0 ||
    I.right >= 0.5 ||
    I.right < 0 ||
    I.right >= 0.5 ||
    I.top < 0 ||
    I.top >= 0.5 ||
    I.bottom < 0 ||
    I.bottom >= 0.5
  )
    throw E.internalErrorWithDetail(
      'Invalid region of interest specified (HINT: check left, right, top, bottom parameters)',
    );
  return iA(
    QA(Math.trunc(I.left * A.width), Math.trunc(I.bottom * A.height)),
    EA(
      Math.trunc((1 - (I.right + I.left)) * A.width),
      Math.trunc((1 - (I.top + I.bottom)) * A.height),
    ),
  );
}
function tA() {
  return (
    -1 !==
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].indexOf(navigator.platform) ||
    (-1 !== navigator.userAgent.indexOf('Mac') && 'ontouchend' in document)
  );
}
function DA(A, I) {
  const g = new ImageData(A, I.width, I.height),
    B = document.createElement('canvas');
  (B.width = I.width), (B.height = I.height);
  const C = B.getContext('2d');
  if (!C) return;
  C.putImageData(g, 0, 0);
  const Q = B.toDataURL('image/png');
  return B.remove(), Q;
}
async function sA(A) {
  return new Promise(I => setTimeout(I, A));
}
function aA() {
  let A = new Date().getTime(),
    I =
      ('undefined' != typeof performance &&
        performance.now &&
        1e3 * performance.now()) ||
      0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, g => {
    let B = 16 * Math.random();
    return (
      A > 0
        ? ((B = (A + B) % 16 | 0), (A = Math.floor(A / 16)))
        : ((B = (I + B) % 16 | 0), (I = Math.floor(I / 16))),
      ('x' === g ? B : (3 & B) | 8).toString(16)
    );
  });
}
Object.defineProperties(CA, {
  sha512Sync: {
    configurable: !1,
    get: () => _,
    set(A) {
      _ || (_ = A);
    },
  },
});
class rA {
  constructor(A, I, g) {
    (this.deviceId = A),
      (this.locationHref = I),
      (this.userAgent = g),
      (this.apiEndpoint = 'https://license.strich.io/api/v1'),
      (this.devApiEndpoint = 'https://license-dev.strich.io/api/v1'),
      (this.prodPubKey =
        '37243F91493F955C761CA0D51B196B999915FD6E660F2A52413A211A6C7E8BDE'),
      (this.devPubKey =
        '463932012A4D0B6DE6EC27E70A67DEDCF6D660F97295F8894414EE6D96D84392');
  }
  verify(A) {
    let I;
    try {
      I = new C(A);
    } catch (A) {
      return Promise.reject(
        new E('error.licenseInvalid', A instanceof Error ? A : void 0),
      );
    }
    return this.verifyV1OfflineLicense(I);
    return 1 === I.version
      ? I.isOffline
        ? this.verifyV1OfflineLicense(I)
        : this.verifyV1OnlineLicense(I)
      : Promise.reject(new E('error.outdatedSdk'));
  }
  verifyV1OnlineLicense(A) {
    return null === this.deviceId
      ? this.enrollDevice(A).then(g => (I.setDeviceId(g), Promise.resolve(A)))
      : this.pingDevice(A, this.deviceId).then(() => A);
  }
  verifyV1OfflineLicense(A) {
    const g = A.licenseKey.split('.');
    if (3 != g.length) return Promise.reject(new E('error.licenseInvalid'));
    const B = o(g[0] + '.' + g[1]),
      C = CA.hexToBytes(A.isDevLicense ? this.devPubKey : this.prodPubKey);
    if (32 != C.length)
      return Promise.reject(E.internalErrorWithDetail('Malformed public key'));
    const Q = i(g[2]);
    return new Promise(I.setDeviceId(aA()), A);
    return false
      ? Promise.reject(new E('error.licenseInvalid'))
      : gA(Q, B, C).then(g => {
          if (!g || !this.verifyV1OfflineExpiration(A))
            throw new E('error.licenseInvalid');
          return I.setDeviceId(aA()), A;
        });
  }
  verifyV1OfflineExpiration(A) {
    return true;
    const I = A.expiration;
    if (void 0 !== I) {
      const A = new Date(1e3 * I),
        g = 3e5;
      if (Date.now() > A.getTime() + g) return !1;
    }
    return true;
    return !0;
  }
  enrollDevice(A) {
    const I = {
        licenseKey: A.licenseKey,
        locationHref: this.locationHref,
        userAgent: this.userAgent,
        sdkVersion: nA.version(),
      },
      g = this.getApiEndpoint(A);
    return this.fetchWithRetries(`${g}/web/enroll`, 2, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(I),
    })
      .then(A => {
        if (A.ok) return A.json().then(A => A.deviceId);
        throw 403 === A.status
          ? new E('error.licenseInvalid')
          : new E('error.licenseCheckFailed');
      })
      .catch(A => {
        throw A instanceof E ? A : new E('error.licenseCheckFailed', A);
      });
  }
  pingDevice(A, I) {
    const g = {
        deviceId: I,
        licenseKey: A.licenseKey,
        locationHref: this.locationHref,
        userAgent: this.userAgent,
        sdkVersion: nA.version(),
      },
      B = this.getApiEndpoint(A);
    return this.fetchWithRetries(`${B}/web/ping`, 2, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(g),
    })
      .then(A => {
        if (!A.ok)
          throw 403 === A.status
            ? new E('error.licenseInvalid')
            : new E('error.licenseCheckFailed');
      })
      .catch(A => {
        throw A instanceof E ? A : new E('error.licenseCheckFailed', A);
      });
  }
  getApiEndpoint(A) {
    return A.isDevLicense ? this.devApiEndpoint : this.apiEndpoint;
  }
  async fetchWithRetries(A, I, g) {
    for (let B = 0; B < I; B++)
      try {
        const C = await fetch(A, g);
        if (C.ok || 403 === C.status) return C;
        B < I &&
          console.warn(
            `Fetch failed (unexpected status code ${C.status}), will retry...`,
          ),
          await sA(500);
      } catch (A) {
        B < I &&
          (console.warn(`Fetch failed due to ${A}, will retry...`),
          await sA(500));
      }
    throw new Error(`Fetch failed after ${I} retries`);
  }
}
var cA;
cA = JSON.parse(
  '{"name":"@pixelverse/strichjs-sdk","version":"1.2.2","description":"STRICH JavaScript SDK","keywords":["barcode scanning","qr code","aztec code","data matrix","ean","upc","code 128","code 39","code 93","itf","databar","codabar"],"homepage":"https://strich.io","source":"src/index.ts","license":"commercial","files":["NOTICE","LICENSE","CHANGELOG.md","dist/*.js","dist/*.d.ts"],"type":"module","main":"dist/strich.js","types":"dist/strich.d.ts","targets":{"main":{"optimize":true}},"scripts":{"prebuild":"rm -rf dist","build":"parcel build --no-cache","test":"jest","lint":"eslint src --ext .ts","check":"tsc --noEmit","typedoc":"typedoc --name \'STRICH JavaScript SDK\' --readme none --excludeInternal --excludePrivate --excludeProtected --excludeNotDocumented --disableSources","typedoc-watch":"typedoc --name \'STRICH JavaScript SDK\' --readme none --excludeInternal --excludePrivate --excludeProtected --excludeNotDocumented --disableSources --watch"},"staticFiles":{},"devDependencies":{"@parcel/packager-ts":"^2.8.2","@parcel/transformer-glsl":"^2.8.2","@parcel/transformer-typescript-types":"^2.8.2","@types/emscripten":"^1.39.6","@types/jest":"^28.1.1","@types/offscreencanvas":"^2019.6.4","@typescript-eslint/eslint-plugin":"^5.22.0","@typescript-eslint/parser":"^5.22.0","esbuild":"^0.16.10","eslint":"^8.14.0","jest":"^28.1.1","jest-environment-jsdom":"^29.3.1","parcel":"^2.8.2","ts-jest":"^28.0.4","typedoc":"^0.23.23","typescript":"^4.6.4"}}',
);
class wA {
  static BEEP_BASE64 =
    'data:audio/mp3;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
  static VIBRATE_DURATION_MS = 200;
  constructor(A) {
    (this.iOS = tA()),
      (this.beep = void 0 === A.audio || A.audio),
      (this.vibrate = void 0 === A.vibration || A.vibration),
      (this.busyBeeping = !1);
  }
  static warmupAudio() {
    void 0 === wA.audio && (wA.audio = new Audio(wA.BEEP_BASE64));
  }
  feedback() {
    return new Promise((A, I) => {
      this.vibrate && this.doVibrate(),
        this.beep
          ? this.doBeep()
              .then(() => A())
              .catch(A => I(A))
          : A();
    });
  }
  doBeep() {
    if (!this.beep || this.busyBeeping) return Promise.resolve();
    let A;
    return (
      this.iOS && void 0 !== wA.audio
        ? ((wA.audio.src = wA.BEEP_BASE64),
          (wA.audio.currentTime = 0),
          (A = wA.audio.play()))
        : (A = new Audio(wA.BEEP_BASE64).play()),
      A.then(() => {
        this.busyBeeping = !1;
      }).catch(() => {
        this.busyBeeping = !1;
      })
    );
  }
  doVibrate() {
    window &&
      window.navigator &&
      window.navigator.vibrate &&
      window.navigator.vibrate(wA.VIBRATE_DURATION_MS);
  }
}
class hA {
  constructor() {
    (this.supportsWASM = this.isWASMSupported()),
      (this.supportsWASMSIMD = this.isWASMSIMDSupported()),
      (this.supportsWebGL2 = this.isWebGL2Supported()),
      (this.supportsWebGL = this.isWebGLSupported()),
      (this.supportsGetUserMedia = this.isGetUserMediaSupported()),
      (this.supportsOffscreenCanvas = this.isOffscreenCanvasSupported()),
      (this.supportsRVF = this.isRequestVideoFrameCallbackSupported());
  }
  isWASMSupported() {
    try {
      if (
        'object' == typeof WebAssembly &&
        'function' == typeof WebAssembly.instantiate
      ) {
        const A = new WebAssembly.Module(
          Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0),
        );
        if (A instanceof WebAssembly.Module)
          return new WebAssembly.Instance(A) instanceof WebAssembly.Instance;
      }
    } catch (A) {}
    return (
      console.error('WASM is not supported. Please use an up-to-date browser.'),
      !1
    );
  }
  isWASMSIMDSupported() {
    try {
      if (
        'object' == typeof WebAssembly &&
        'function' == typeof WebAssembly.validate
      )
        return WebAssembly.validate(
          new Uint8Array([
            0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
            10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
          ]),
        );
    } catch (A) {}
    return !1;
  }
  isWebGL2Supported() {
    return (
      !!document.createElement('canvas').getContext('webgl2') ||
      (console.warn(
        'WebGL2 is not supported. Please use an up-to-date browser.',
      ),
      !1)
    );
  }
  isWebGLSupported() {
    const A = document.createElement('canvas'),
      I = A.getContext('webgl') || A.getContext('experimental-webgl');
    return (
      !!(I && I instanceof WebGLRenderingContext) ||
      (console.error(
        'WebGL is not supported. Please use an up-to-date browser.',
      ),
      !1)
    );
  }
  isGetUserMediaSupported() {
    return (
      !(
        !navigator.mediaDevices ||
        'function' != typeof navigator.mediaDevices.getUserMedia
      ) ||
      (console.error(
        'getUserMedia is not supported. Please use Chrome on Android or Safari on iOS',
      ),
      !1)
    );
  }
  isOffscreenCanvasSupported() {
    if (HTMLCanvasElement.prototype.transferControlToOffscreen) {
      return null !== new OffscreenCanvas(16, 16).getContext('webgl');
    }
    return !1;
  }
  isRequestVideoFrameCallbackSupported() {
    return 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
  }
}
class nA {
  static _initialized = !1;
  static _touchEventListener = () => {
    wA.warmupAudio(),
      window.removeEventListener('touchstart', nA._touchEventListener);
  };
  static version() {
    return cA.version;
  }
  static isInitialized() {
    return nA._initialized;
  }
  static initialize(A) {
    (nA.browserCapabilities = new hA()),
      Q.setLanguageFromNavigator(navigator.language);
    const g = I.getDeviceId();
    window.addEventListener('touchstart', this._touchEventListener, {
      passive: !0,
    }),
      Promise.resolve();
    return new Promise(() => {
      (nA.deviceId = I.getDeviceId()),
        (nA.license = A),
        (nA._initialized = !0),
        tA() &&
          window.addEventListener('touchstart', this._touchEventListener, {
            passive: !0,
          });
    }, Promise.resolve());
    return new rA(g, window.location.href, window.navigator.userAgent)
      .verify(A)
      .then(
        A => (
          (nA.deviceId = I.getDeviceId()),
          (nA.license = A),
          (nA._initialized = !0),
          tA() &&
            window.addEventListener('touchstart', this._touchEventListener, {
              passive: !0,
            }),
          Promise.resolve()
        ),
      )
      .catch(
        A => (
          console.error('hello'), (nA._initialized = !1), Promise.reject(A)
        ),
      );
  }
  static setCustomId(A) {
    nA.customId = A;
  }
  static setLanguage(A) {
    Q.setLanguageFromNavigator(A);
  }
  static hasCameraDevice() {
    return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
      ? navigator.mediaDevices
          .enumerateDevices()
          .then(A => A && A.filter(A => 'videoinput' === A.kind).length > 0)
          .catch(A => {
            throw E.fromGetUserMediaError(A);
          })
      : Promise.reject(new E('error.requirementsNotFulfilled'));
  }
}
var yA, SA, FA, GA;
function RA() {
  return {resolution: 'hd'};
}
(yA = {}),
  (SA = 'defaultFrameSourceConfiguration'),
  (FA = () => RA),
  Object.defineProperty(yA, SA, {
    get: FA,
    set: GA,
    enumerable: !0,
    configurable: !0,
  });
var NA;
NA =
  '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nattribute vec2 a_position;\nattribute vec2 a_tex_coord;\nvarying vec2 v_tex_coord;\n\nvoid main () {\n    // pass texture coordinates to fragment shader (automatic interpolation)\n    v_tex_coord = a_tex_coord;\n    gl_Position = vec4(a_position.xy, 0, 1.0);\n}\n';
function MA(A) {
  const I = A.getError();
  if (I !== A.NO_ERROR) {
    const g = (function (A, I) {
      switch (I) {
        case A.NO_ERROR:
          return 'NO_ERROR';
        case A.INVALID_ENUM:
          return 'INVALID_ENUM';
        case A.INVALID_VALUE:
          return 'INVALID_VALUE';
        case A.INVALID_OPERATION:
          return 'INVALID_OPERATION';
        case A.INVALID_FRAMEBUFFER_OPERATION:
          return 'INVALID_FRAMEBUFFER_OPERATION';
        case A.OUT_OF_MEMORY:
          return 'OUT_OF_MEMORY';
        default:
          return `UNKNOWN (${I})`;
      }
    })(A, I);
    throw E.internalErrorWithDetail(`Assertion failed, WebGL error: ${g}`);
  }
}
class kA {
  constructor(A, I) {
    (this.imageSize = A), (this.viewportSize = I);
    const g = I.width / A.width,
      B = I.height / A.height;
    (this.scaleFactor = g >= B ? g : B),
      (this.yOffset = A.height * this.scaleFactor - I.height),
      (this.xOffset = A.width * this.scaleFactor - I.width);
  }
  imagePointToViewportPoint(A) {
    return QA(
      Math.trunc(A.x * this.scaleFactor - this.xOffset / 2),
      Math.trunc(A.y * this.scaleFactor - this.yOffset / 2),
    );
  }
  imageRectToViewportRect(A) {
    return iA(
      this.imagePointToViewportPoint(A.origin),
      EA(
        Math.trunc(A.size.width * this.scaleFactor),
        Math.trunc(A.size.height * this.scaleFactor),
      ),
    );
  }
  viewportPointToImagePoint(A) {
    return QA(
      Math.trunc((A.x + this.xOffset / 2) / this.scaleFactor),
      Math.trunc((A.y + this.yOffset / 2) / this.scaleFactor),
    );
  }
  viewportRectToImageRect(A) {
    return iA(
      this.viewportPointToImagePoint(A.origin),
      EA(
        Math.trunc(A.size.width / this.scaleFactor),
        Math.trunc(A.size.height / this.scaleFactor),
      ),
    );
  }
}
class UA {
  debug = !1;
  static S1_WEIGHTS = [2, -1];
  static S2_WEIGHTS = [0.25, 4];
  constructor(A, I, g, B) {
    (this.config = {}),
      (this.config.regionOfInterest = A?.regionOfInterest || I),
      (this.frameSource = g),
      (this.viewportSize = B),
      (this.config.chromaReject = !0 === A?.chromaReject),
      (this.chromaRejectThreshold = this.config.chromaReject ? 0.25 : 1),
      (this.rotation = 0);
  }
  initialize() {
    return new Promise((A, I) => {
      try {
        (this.imageSize = this.frameSource.getImageSize()),
          this.calculateRegionOfInterest(this.imageSize),
          this.debug && console.debug('GPU locator image RoE:', this.roe);
        const g = this.createCanvas(this.imageSize);
        if (!g)
          return void I(E.internalErrorWithDetail('Failed to create canvas'));
        g.addEventListener(
          'webglcontextlost',
          A => {
            this.debug &&
              console.debug('WebGL1Locator event: WebGL context was lost'),
              void 0 !== this.gl
                ? A.preventDefault()
                : this.debug &&
                  console.debug('WebGL context loss (after destroy)');
          },
          !1,
        ),
          g.addEventListener('webglcontextrestored', () => {
            this.debug &&
              console.debug(
                'WebGL1Locator reinitializing after WebGL context loss',
              ),
              (this.gl = this.initWebGL()),
              this.linkFrameSource(this.gl);
          }),
          (this.canvas = g),
          (this.gl = this.initWebGL()),
          this.linkFrameSource(this.gl),
          A(this);
      } catch (A) {
        I(A instanceof E ? A : E.internalErrorWithCause(A));
      }
    });
  }
  destroy() {
    if (void 0 === this.gl) return;
    const A = this.gl;
    try {
      for (const I of [
        this.combineMaps,
        this.boxFilter,
        this.edgeness,
        this.cornerness,
        this.windowSum,
        this.derivativeSecondPass,
        this.derivativeFirstPass,
        this.lumAndChroma,
      ])
        A.deleteProgram(I);
      for (const I of [this.bufA, this.bufB, this.bufC, this.bufLum])
        A.deleteFramebuffer(I);
      for (const I of [this.texCoordBuffer, this.posBuffer]) A.deleteBuffer(I);
      for (const I of [
        this.cameraTexture,
        this.textureA,
        this.textureB,
        this.textureC,
        this.textureLum,
      ])
        A.deleteTexture(I);
    } catch (A) {
      console.warn(`Ignoring error while deleting WebGL resources: ${A}`);
    } finally {
      const A = this.gl;
      this.gl = void 0;
      const I = A.getExtension('WEBGL_lose_context');
      I && I.loseContext();
    }
    this.canvas instanceof HTMLCanvasElement && this.canvas.remove(),
      this.debug &&
        console.debug('Destroyed WebGL1Locator and associated WebGL resources');
  }
  getRegionOfInterest() {
    return this.roe;
  }
  createPositionBuffer(A) {
    const I = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      g = A.createBuffer();
    if (!g)
      throw E.internalErrorWithDetail(
        `Unable to create WebGL pos buffer: ${A.getError()}`,
      );
    return (
      A.bindBuffer(A.ARRAY_BUFFER, g),
      A.bufferData(A.ARRAY_BUFFER, I, A.STATIC_DRAW),
      g
    );
  }
  createTexCoordBuffer(A) {
    const I = new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]),
      g = A.createBuffer();
    if (!g)
      throw E.internalErrorWithDetail(
        `Unable to create WebGL tex coord buffer: ${A.getError()}`,
      );
    return (
      A.bindBuffer(A.ARRAY_BUFFER, g),
      A.bufferData(A.ARRAY_BUFFER, I, A.STATIC_DRAW),
      g
    );
  }
  setBuffers(A, I) {
    A.bindBuffer(A.ARRAY_BUFFER, this.posBuffer);
    const g = A.getAttribLocation(I, 'a_position');
    if (-1 === g)
      throw E.internalErrorWithDetail('Position attribute location not found');
    A.vertexAttribPointer(g, 2, A.FLOAT, !1, 0, 0),
      A.enableVertexAttribArray(g),
      A.bindBuffer(A.ARRAY_BUFFER, this.texCoordBuffer);
    const B = A.getAttribLocation(I, 'a_tex_coord');
    if (-1 === B)
      throw E.internalErrorWithDetail(
        'Texture coordinate attribute location not found',
      );
    A.vertexAttribPointer(B, 2, A.FLOAT, !1, 0, 0),
      A.enableVertexAttribArray(B);
  }
  setTextures(A, I, g, B, C) {
    const Q = A.getUniformLocation(I, 'u_texture');
    if (-1 === Q)
      throw E.internalErrorWithDetail(
        `Uniform location for input texture ${g} not found`,
      );
    if ((A.uniform1i(Q, g), void 0 !== B)) {
      const g = A.getUniformLocation(I, 'u_texture1');
      if (-1 === g)
        throw E.internalErrorWithDetail(
          `Uniform location for input texture ${B} not found`,
        );
      A.uniform1i(g, B);
    }
    if (void 0 !== C) {
      const g = A.getUniformLocation(I, 'u_texture2');
      if (-1 === g)
        throw E.internalErrorWithDetail(
          `Uniform location for input texture ${C} not found`,
        );
      A.uniform1i(g, C);
    }
  }
  initWebGL() {
    const I = this.canvas,
      g = I.getContext('webgl', {});
    if (!g) throw E.internalErrorWithDetail('Unable to obtain WebGL context');
    (this.posBuffer = this.createPositionBuffer(g)),
      (this.texCoordBuffer = this.createTexCoordBuffer(g)),
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
    const B = [1 / I.width, 1 / I.height];
    (this.textureA = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const C = g.createFramebuffer();
    if (!C)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufA = C),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufA),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureA,
        0,
      ),
      (this.textureB = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const Q = g.createFramebuffer();
    if (!Q)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufB = Q),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufB),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureA,
        0,
      ),
      (this.textureC = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const i = g.createFramebuffer();
    if (!i)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufC = i),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufC),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureC,
        0,
      ),
      (this.textureLum = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const o = g.createFramebuffer();
    if (!o)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufLum = o),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufLum),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureLum,
        0,
      ),
      (this.lumAndChroma = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\nuniform sampler2D u_texture;\n\n// return perceived brightness of an RGB color\nfloat luminance(vec4 color) {\n    return 0.3 * color.x + 0.59 * color.y + 0.11 * color.z;\n}\n\n// max(RGB) - min(RGB)\nfloat chroma(vec4 color) {\n    float max_rgb = max(color.r, color.g);\n    max_rgb = max(max_rgb, color.b);\n    float min_rgb = min(color.r, color.g);\n    min_rgb = min(min_rgb, color.b);\n    return max_rgb - min_rgb;\n}\n\nvoid main() {\n    vec4 color = texture2D(u_texture, v_tex_coord);\n    float luminance = luminance(color);\n    float c = chroma(color);\n    gl_FragColor = vec4(luminance, luminance, luminance, c);\n}\n',
        ),
      )),
      g.useProgram(this.lumAndChroma),
      this.setBuffers(g, this.lumAndChroma),
      this.setTextures(g, this.lumAndChroma, 0),
      (this.derivativeFirstPass = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\n\nuniform vec2 u_step; // [1.0/w; 1.0/h];\nuniform sampler2D u_texture;\n\nvoid main() {\n    vec2 step = u_step;\n    vec2 uv = v_tex_coord;\n\n    // first pass: I * d1 and I * p (horizontal pass of I_x and I_y calculation)\n    // 5 horizontal texture fetches\n    float x1 = texture2D(u_texture, uv + vec2(-2.0 * step.x, 0.0)).x;\n    float x2 = texture2D(u_texture, uv + vec2(-step.x, 0.0)).x;\n\n    vec4 color = texture2D(u_texture, uv);\n    float x3 = color.r;\n    float chroma = color.a;\n\n    float x4 = texture2D(u_texture, uv + vec2(step.x, 0.0)).x;\n    float x5 = texture2D(u_texture, uv + vec2(2.0 * step.x, 0.0)).x;\n\n    // first: convolve each value with the vector d,\n    // https://en.wikipedia.org/wiki/Image_derivatives#Farid_and_Simoncelli_derivatives\n    float I_k = x1*0.109604 + x2*0.276691 + x3*0.000000 + x4*-0.276691 + x5*-0.109604;\n    float I_d = x1*0.037659 + x2*0.249153 + x3*0.426375 + x4*0.249153 + x5*0.037659;\n    gl_FragColor = vec4(I_k, I_d, 0.0, chroma);\n}\n',
        ),
      )),
      g.useProgram(this.derivativeFirstPass),
      this.setBuffers(g, this.derivativeFirstPass),
      this.setTextures(g, this.derivativeFirstPass, 0);
    let e = g.getUniformLocation(this.derivativeFirstPass, 'u_step');
    if (!e)
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    if (
      (g.uniform2fv(e, B),
      (this.derivativeSecondPass = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\n\nuniform vec2 u_step; // [1.0/w; 1.0/h];\nuniform sampler2D u_texture;\n\nvoid main() {\n    vec2 step = u_step;\n    vec2 uv = v_tex_coord;\n\n    vec2 y1 = texture2D(u_texture, uv + vec2(0.0, -2.0*step.y)).rg;\n    vec2 y2 = texture2D(u_texture, uv + vec2(0.0, -step.y)).rg;\n    vec4 color = texture2D(u_texture, uv);\n    vec2 y3 = color.rg;\n    float chroma = color.a;\n    vec2 y4 = texture2D(u_texture, uv + vec2(0.0, step.y)).rg;\n    vec2 y5 = texture2D(u_texture, uv + vec2(0.0, 2.0*step.y)).rg;\n\n    // convolve vector k with output of previous convolution I (*) d\n    float I_x = y1.r*0.037659 + y2.r*0.249153 + y3.r*0.426375 + y4.r*0.249153 + y5.r*0.037659;\n    float I_y = y1.g*0.109604 + y2.g*0.276691 + y3.g*0.000000 + y4.g*-0.276691 + y5.g*-0.109604;\n\n    // gl_FragColor = vec4(16.0*I_x*I_x, 16.0*I_y*I_y, I_x*I_y, chroma); // intensify effect for visual debugging\n    gl_FragColor = vec4(I_x*I_x, I_y*I_y, I_x*I_y, chroma);\n}\n',
        ),
      )),
      g.useProgram(this.derivativeSecondPass),
      this.setBuffers(g, this.derivativeSecondPass),
      this.setTextures(g, this.derivativeSecondPass, 0),
      g.uniform2fv(
        g.getUniformLocation(this.derivativeSecondPass, 'u_step'),
        B,
      ),
      (this.windowSum = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\nuniform sampler2D u_texture;\nuniform vec2 u_step; // (1.0/w, 0.0): horizontal blur, (0.0, 1.0/w): vertical blur\n\nuniform float u_chroma_threshold;\n\nvoid main() {\n    vec2 uv = v_tex_coord;\n\n    float hstep = u_step.x;\n    float vstep = u_step.y;\n\n    // 7-tap gaussian blur, one-pass, direction specified in uniform\n    // see: http://dev.theomader.com/gaussian-kernel-calculator/ (sigma: 2)\n    vec4 sum = vec4(0.0);\n    sum += texture2D(u_texture, vec2(uv.x - 3.0*hstep, uv.y - 3.0*vstep)) * 0.071303;\n    sum += texture2D(u_texture, vec2(uv.x - 2.0*hstep, uv.y - 2.0*vstep)) * 0.131514;\n    sum += texture2D(u_texture, vec2(uv.x - 1.0*hstep, uv.y - 1.0*vstep)) * 0.189879;\n\n    vec4 color = texture2D(u_texture, uv);\n    float chroma = color.a;\n    sum += color * 0.214607;\n\n    sum += texture2D(u_texture, vec2(uv.x + 1.0*hstep, uv.y + 1.0*vstep)) * 0.189879;\n    sum += texture2D(u_texture, vec2(uv.x + 2.0*hstep, uv.y - 2.0*vstep)) * 0.131514;\n    sum += texture2D(u_texture, vec2(uv.x + 3.0*hstep, uv.y - 3.0*vstep)) * 0.071303;\n\n    // if the chroma value of the pixel is above a certain threshold (colorful area),\n    // set the components of the struture matrix to zero.\n    // A = 1.0 - step(threshold, c) is equivalent to A = c < threshold ? 1.0 : 0.0\n    float A = 1.0 - step(u_chroma_threshold, chroma);\n    gl_FragColor = A * sum;\n}\n',
        ),
      )),
      g.useProgram(this.windowSum),
      this.setBuffers(g, this.windowSum),
      this.setTextures(g, this.windowSum, 0),
      (e = g.getUniformLocation(this.windowSum, 'u_step')),
      !e)
    )
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    if (
      ((this.windowSumStep = e),
      g.uniform1f(
        g.getUniformLocation(this.windowSum, 'u_chroma_threshold'),
        this.chromaRejectThreshold,
      ),
      (this.edgeness = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\nuniform sampler2D u_texture;\n\nvoid main() {\n    vec4 struct_matrix = texture2D(u_texture, v_tex_coord);\n    float Cxx = struct_matrix.r;\n    float Cyy = struct_matrix.g;\n    float Cxy = struct_matrix.b;\n\n    float a = Cxx + Cyy;\n    float b = Cxx - Cyy;\n\n    float denom = (Cxx + Cyy)*(Cxx + Cyy) + 0.001;\n    float m1 = ((Cxx - Cyy)*(Cxx - Cyy) + 4.0*Cxy*Cxy)/denom;\n    gl_FragColor = vec4(m1, 0.0, 0.0, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.edgeness),
      this.setBuffers(g, this.edgeness),
      this.setTextures(g, this.edgeness, 0),
      (this.cornerness = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\nuniform sampler2D u_texture;\n\nvoid main() {\n    vec4 struct_matrix = texture2D(u_texture, v_tex_coord);\n    float Cxx = struct_matrix.r;\n    float Cyy = struct_matrix.g;\n    float Cxy = struct_matrix.b;\n\n    float denom = (Cxx + Cyy)*(Cxx + Cyy) + 0.001;\n    float m2 = 4.0*(Cxx*Cyy - Cxy*Cxy)/denom;\n    gl_FragColor = vec4(0.0, m2, 0.0, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.cornerness),
      this.setBuffers(g, this.cornerness),
      this.setTextures(g, this.cornerness, 0),
      (this.boxFilter = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform sampler2D u_texture;\nvarying vec2 v_tex_coord;\nuniform vec2 u_step; // (1.0/w, 0.0): horizontal blur, (0.0, 1.0/w): vertical blur\n\n// 32-tap box filter, implemented in 16 taps (sampling between pixels returns mean: LINEAR)\nconst int size = 16;\n\nvoid main() {\n    vec2 uv = v_tex_coord;\n    float size_f = float(size);\n    vec4 sum = vec4(0.0);\n    vec2 coord = uv + vec2(-size_f - 0.5, -size_f - 0.5) * u_step;\n    vec2 two_step = u_step * 2.0; // advance by two pixels\n    for (int i = 0; i < size; i++) {\n        sum += texture2D(u_texture, coord);\n        coord += two_step;\n    }\n    gl_FragColor = sum / size_f;\n}\n',
        ),
      )),
      g.useProgram(this.boxFilter),
      this.setBuffers(g, this.boxFilter),
      this.setTextures(g, this.boxFilter, 0),
      (e = g.getUniformLocation(this.boxFilter, 'u_step')),
      !e)
    )
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    return (
      (this.boxFilterStep = e),
      (this.combineMaps = this.createProgram(
        g,
        A(NA),
        A(
          '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 v_tex_coord;\n\nuniform sampler2D u_texture;\nuniform sampler2D u_texture1;\nuniform sampler2D u_texture2; // luminance image\n\n// weights for linear combination of m1/m2 into s1/s2.\nuniform vec2 u_w1;\nuniform vec2 u_w2;\n\nvoid main() {\n    float m1 = texture2D(u_texture, v_tex_coord).r;\n    float m2 = texture2D(u_texture1, v_tex_coord).g;\n    vec2 m12 = vec2(m1, m2);\n\n    // 1D barcodes have edges but should not have corners\n    float s1 = dot(u_w1, m12);\n\n    // 2D barcodes should have edges and corneers\n    float s2 = dot(u_w2, m12);\n\n    // luminance image\n    float lum = texture2D(u_texture2, v_tex_coord).x;\n\n    gl_FragColor = vec4(lum, s1, s2, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.combineMaps),
      this.setBuffers(g, this.combineMaps),
      this.setTextures(g, this.combineMaps, 0, 1, 2),
      g.uniform2fv(
        g.getUniformLocation(this.combineMaps, 'u_w1'),
        UA.S1_WEIGHTS,
      ),
      g.uniform2fv(
        g.getUniformLocation(this.combineMaps, 'u_w2'),
        UA.S2_WEIGHTS,
      ),
      MA(g),
      g
    );
  }
  locate(A) {
    const I = this.gl;
    if (void 0 === I)
      return (
        console.warn(
          'WebGL1Locator.locate() invoked, but GL context already destroyed',
        ),
        Promise.resolve()
      );
    if (I.isContextLost())
      return (
        console.warn('WebGL1Locator.locate(): WebGL context was lost'),
        Promise.resolve()
      );
    const g = this.canvas,
      B = [1 / g.width, 0],
      C = [0, 1 / g.height];
    return (
      I.useProgram(this.lumAndChroma),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufLum),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureLum,
        0,
      ),
      I.activeTexture(I.TEXTURE0),
      I.bindTexture(I.TEXTURE_2D, this.cameraTexture),
      I.texImage2D(
        I.TEXTURE_2D,
        0,
        I.RGBA,
        I.RGBA,
        I.UNSIGNED_BYTE,
        this.texImageSource,
      ),
      this.render(I),
      A.addTimingEvent({
        time: Date.now(),
        event: 'frameAcquired',
        cssColor: 'red',
      }),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.derivativeFirstPass),
      I.bindTexture(I.TEXTURE_2D, this.textureLum),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.derivativeSecondPass),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.windowSum),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.windowSumStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.uniform2fv(this.windowSumStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufA),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureA,
        0,
      ),
      I.useProgram(this.edgeness),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.cornerness),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.boxFilter),
      I.bindTexture(I.TEXTURE_2D, this.textureA),
      I.uniform2fv(this.boxFilterStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufA),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureA,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.boxFilterStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.boxFilter),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.uniform2fv(this.boxFilterStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.boxFilterStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.combineMaps),
      I.activeTexture(I.TEXTURE0),
      I.bindTexture(I.TEXTURE_2D, this.textureA),
      I.activeTexture(I.TEXTURE1),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.activeTexture(I.TEXTURE2),
      I.bindTexture(I.TEXTURE_2D, this.textureLum),
      this.render(I),
      A.addTimingEvent({time: Date.now(), event: 'gpuDone', cssColor: 'blue'}),
      I.readPixels(
        this.roe.origin.x,
        this.roe.origin.y,
        this.roe.size.width,
        this.roe.size.height,
        I.RGBA,
        I.UNSIGNED_BYTE,
        A.buffer,
      ),
      A.addTimingEvent({
        time: Date.now(),
        event: 'gpuCpuTransferDone',
        cssColor: 'pink',
      }),
      Promise.resolve()
    );
  }
  createAndSetupTexture(A) {
    const I = A.createTexture();
    if (!I)
      throw E.internalErrorWithDetail(
        'Failed to create camera input texture: ' + A.getError(),
      );
    return (
      A.bindTexture(A.TEXTURE_2D, I),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_WRAP_S, A.CLAMP_TO_EDGE),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_WRAP_T, A.CLAMP_TO_EDGE),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_MIN_FILTER, A.LINEAR),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_MAG_FILTER, A.LINEAR),
      I
    );
  }
  createProgram(A, I, g) {
    const B = A.createProgram();
    if (!B) throw E.internalErrorWithDetail('Failed to create WebGL program');
    const C = A.createShader(WebGLRenderingContext.FRAGMENT_SHADER);
    if (!C)
      throw E.internalErrorWithDetail('Failed to create WebGL fragment shader');
    if (
      (A.shaderSource(C, g),
      A.compileShader(C),
      !A.getShaderParameter(C, A.COMPILE_STATUS))
    )
      throw E.internalErrorWithDetail(
        'Failed to compile WebGL shader:\n' + A.getShaderInfoLog(C),
      );
    const Q = A.createShader(WebGLRenderingContext.VERTEX_SHADER);
    if (!Q)
      throw E.internalErrorWithDetail('Failed to create WebGL vertex shader');
    if (
      (A.shaderSource(Q, I),
      A.compileShader(Q),
      !A.getShaderParameter(Q, A.COMPILE_STATUS))
    )
      throw E.internalErrorWithDetail(
        'Failed to compile Shader:\n' + A.getShaderInfoLog(Q),
      );
    if (
      (A.attachShader(B, C),
      A.attachShader(B, Q),
      A.linkProgram(B),
      A.validateProgram(B),
      !A.getProgramParameter(B, A.LINK_STATUS))
    ) {
      const I = A.getProgramInfoLog(B);
      throw E.internalErrorWithDetail('Failed to compile WebGL program:\n' + I);
    }
    return B;
  }
  render(A) {
    A.drawArrays(A.TRIANGLE_STRIP, 0, 4);
  }
  linkFrameSource(A) {
    (this.texImageSource = this.frameSource.get()),
      (this.cameraTexture = this.createAndSetupTexture(A)),
      A.activeTexture(A.TEXTURE0),
      A.texImage2D(
        A.TEXTURE_2D,
        0,
        A.RGBA,
        A.RGBA,
        A.UNSIGNED_BYTE,
        this.texImageSource,
      );
  }
  getRegionOfInterestSpec() {
    return this.config.regionOfInterest;
  }
  createCanvas(A) {
    let I;
    return (
      !0 === nA.browserCapabilities.supportsOffscreenCanvas
        ? (I = new OffscreenCanvas(A.width, A.height))
        : ((I = document.createElement('canvas')),
          (I.style.visibility = 'hidden'),
          (I.width = A.width),
          (I.height = A.height)),
      I
    );
  }
  calculateRegionOfInterest(A) {
    if (!this.config.regionOfInterest)
      throw E.configurationErrorWithDetail('Region of interest is undefined');
    const I = eA(this.viewportSize, this.config.regionOfInterest),
      g = new kA(A, this.viewportSize);
    this.roe = g.viewportRectToImageRect(I);
  }
}
var dA;
dA =
  '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 a_position;\nin vec2 a_tex_coord;\nout vec2 v_tex_coord;\n\nvoid main () {\n    // pass texture coordinates to fragment shader (automatic interpolation)\n    v_tex_coord = a_tex_coord;\n    gl_Position = vec4(a_position.xy, 0, 1.0);\n}\n';
class LA {
  debug = !1;
  static S1_WEIGHTS = [2, -1];
  static S2_WEIGHTS = [0.25, 4];
  constructor(A, I, g, B) {
    (this.config = {}),
      (this.config.regionOfInterest = A?.regionOfInterest || I),
      (this.frameSource = g),
      (this.viewportSize = B),
      (this.config.chromaReject = !0 === A?.chromaReject),
      (this.chromaRejectThreshold = this.config.chromaReject ? 0.25 : 1),
      (this.rotation = 0),
      (this.forceSyncReadback = !0 === A?.forceSyncReadback || tA());
  }
  initialize() {
    return new Promise((A, I) => {
      try {
        (this.imageSize = this.frameSource.getImageSize()),
          this.calculateRegionOfInterest(this.imageSize),
          this.debug && console.debug('GPU locator image RoE:', this.roe);
        const g = this.createCanvas(this.imageSize);
        if (!g)
          return void I(E.internalErrorWithDetail('Failed to create canvas'));
        g.addEventListener(
          'webglcontextlost',
          A => {
            this.debug &&
              console.debug('WebGL2Locator event: WebGL context was lost'),
              void 0 !== this.gl
                ? A.preventDefault()
                : this.debug &&
                  console.debug('WebGL context loss (after destroy)');
          },
          !1,
        ),
          g.addEventListener('webglcontextrestored', () => {
            this.debug &&
              console.debug(
                'WebGL2Locator reinitializing after WebGL context loss',
              ),
              (this.gl = this.initWebGL()),
              this.linkFrameSource(this.gl);
          }),
          (this.canvas = g),
          (this.gl = this.initWebGL()),
          this.linkFrameSource(this.gl),
          A(this);
      } catch (A) {
        I(A instanceof E ? A : E.internalErrorWithCause(A));
      }
    });
  }
  destroy() {
    if (void 0 === this.gl) return;
    const A = this.gl;
    try {
      for (const I of [
        this.combineMaps,
        this.boxFilter,
        this.edgeness,
        this.cornerness,
        this.windowSum,
        this.derivativeSecondPass,
        this.derivativeFirstPass,
        this.lumAndChroma,
      ])
        A.deleteProgram(I);
      for (const I of [this.bufA, this.bufB, this.bufC, this.bufLum])
        A.deleteFramebuffer(I);
      for (const I of [this.texCoordBuffer, this.posBuffer]) A.deleteBuffer(I);
      A.deleteBuffer(this.pixelPackBuf);
      for (const I of [
        this.cameraTexture,
        this.textureA,
        this.textureB,
        this.textureC,
        this.textureLum,
      ])
        A.deleteTexture(I);
    } catch (A) {
      console.warn(`Ignoring error while deleting WebGL resources: ${A}`);
    } finally {
      const A = this.gl;
      this.gl = void 0;
      const I = A.getExtension('WEBGL_lose_context');
      I && I.loseContext();
    }
    this.canvas instanceof HTMLCanvasElement && this.canvas.remove(),
      this.debug &&
        console.debug('Destroyed WebGL2Locator and associated WebGL resources');
  }
  getRegionOfInterest() {
    return this.roe;
  }
  createPixelPackBuffer(A, I) {
    const g = A.createBuffer();
    if (null === g) throw new E('Unable to allocated WebGL buffer');
    return (
      A.bindBuffer(A.PIXEL_PACK_BUFFER, g),
      A.bufferData(A.PIXEL_PACK_BUFFER, I, A.DYNAMIC_READ),
      A.bindBuffer(A.PIXEL_PACK_BUFFER, null),
      g
    );
  }
  createPositionBuffer(A) {
    const I = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      g = A.createBuffer();
    if (!g)
      throw E.internalErrorWithDetail(
        `Unable to create WebGL pos buffer: ${A.getError()}`,
      );
    return (
      A.bindBuffer(A.ARRAY_BUFFER, g),
      A.bufferData(A.ARRAY_BUFFER, I, A.STATIC_DRAW),
      g
    );
  }
  createTexCoordBuffer(A) {
    const I = new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]),
      g = A.createBuffer();
    if (!g)
      throw E.internalErrorWithDetail(
        `Unable to create WebGL tex coord buffer: ${A.getError()}`,
      );
    return (
      A.bindBuffer(A.ARRAY_BUFFER, g),
      A.bufferData(A.ARRAY_BUFFER, I, A.STATIC_DRAW),
      g
    );
  }
  setBuffers(A, I) {
    A.bindBuffer(A.ARRAY_BUFFER, this.posBuffer);
    const g = A.getAttribLocation(I, 'a_position');
    if (-1 === g)
      throw E.internalErrorWithDetail('Position attribute location not found');
    A.vertexAttribPointer(g, 2, A.FLOAT, !1, 0, 0),
      A.enableVertexAttribArray(g),
      A.bindBuffer(A.ARRAY_BUFFER, this.texCoordBuffer);
    const B = A.getAttribLocation(I, 'a_tex_coord');
    if (-1 === B)
      throw E.internalErrorWithDetail(
        'Texture coordinate attribute location not found',
      );
    A.vertexAttribPointer(B, 2, A.FLOAT, !1, 0, 0),
      A.enableVertexAttribArray(B);
  }
  setTextures(A, I, g, B, C) {
    const Q = A.getUniformLocation(I, 'u_texture');
    if (-1 === Q)
      throw E.internalErrorWithDetail(
        `Uniform location for input texture ${g} not found`,
      );
    if ((A.uniform1i(Q, g), void 0 !== B)) {
      const g = A.getUniformLocation(I, 'u_texture1');
      if (-1 === g)
        throw E.internalErrorWithDetail(
          `Uniform location for input texture ${B} not found`,
        );
      A.uniform1i(g, B);
    }
    if (void 0 !== C) {
      const g = A.getUniformLocation(I, 'u_texture2');
      if (-1 === g)
        throw E.internalErrorWithDetail(
          `Uniform location for input texture ${C} not found`,
        );
      A.uniform1i(g, C);
    }
  }
  initWebGL() {
    const I = this.canvas,
      g = I.getContext('webgl2', {powerPreference: 'default'});
    if (!g) throw E.internalErrorWithDetail('Unable to obtain WebGL2 context');
    (this.posBuffer = this.createPositionBuffer(g)),
      (this.texCoordBuffer = this.createTexCoordBuffer(g)),
      (this.pixelPackBuf = this.createPixelPackBuffer(
        g,
        this.roe.size.width * this.roe.size.height * 4,
      )),
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
    const B = [1 / I.width, 1 / I.height];
    (this.textureA = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const C = g.createFramebuffer();
    if (!C)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufA = C),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufA),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureA,
        0,
      ),
      (this.textureB = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const Q = g.createFramebuffer();
    if (!Q)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufB = Q),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufB),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureA,
        0,
      ),
      (this.textureC = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const i = g.createFramebuffer();
    if (!i)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufC = i),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufC),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureC,
        0,
      ),
      (this.textureLum = this.createAndSetupTexture(g)),
      g.texImage2D(
        g.TEXTURE_2D,
        0,
        g.RGBA,
        I.width,
        I.height,
        0,
        g.RGBA,
        g.UNSIGNED_BYTE,
        null,
      );
    const o = g.createFramebuffer();
    if (!o)
      throw E.internalErrorWithDetail('Failed to create WebGL framebuffer');
    (this.bufLum = o),
      g.bindFramebuffer(g.FRAMEBUFFER, this.bufLum),
      g.framebufferTexture2D(
        g.FRAMEBUFFER,
        g.COLOR_ATTACHMENT0,
        g.TEXTURE_2D,
        this.textureLum,
        0,
      ),
      (this.lumAndChroma = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform sampler2D u_texture;\nout vec4 outPixel;\n\n// return perceived brightness of an RGB color\nfloat luminance(vec4 color) {\n    return 0.3 * color.x + 0.59 * color.y + 0.11 * color.z;\n}\n\n// max(RGB) - min(RGB)\nfloat chroma(vec4 color) {\n    float max_rgb = max(color.r, color.g);\n    max_rgb = max(max_rgb, color.b);\n    float min_rgb = min(color.r, color.g);\n    min_rgb = min(min_rgb, color.b);\n    return max_rgb - min_rgb;\n}\n\nvoid main() {\n    vec4 color = texture(u_texture, v_tex_coord);\n    float luminance = luminance(color);\n    float c = chroma(color);\n    outPixel = vec4(luminance, luminance, luminance, c);\n}\n',
        ),
      )),
      g.useProgram(this.lumAndChroma),
      this.setBuffers(g, this.lumAndChroma),
      this.setTextures(g, this.lumAndChroma, 0),
      (this.derivativeFirstPass = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform vec2 u_step; // [1.0/w; 1.0/h];\nuniform sampler2D u_texture;\nout vec4 outPixel;\n\nvoid main() {\n    vec2 step = u_step;\n    vec2 uv = v_tex_coord;\n\n    // first pass: I * d1 and I * p (horizontal pass of I_x and I_y calculation)\n    // 5 horizontal texture fetches\n    float x1 = texture(u_texture, uv + vec2(-2.0 * step.x, 0.0)).x;\n    float x2 = texture(u_texture, uv + vec2(-step.x, 0.0)).x;\n\n    vec4 color = texture(u_texture, uv);\n    float x3 = color.r;\n    float chroma = color.a;\n\n    float x4 = texture(u_texture, uv + vec2(step.x, 0.0)).x;\n    float x5 = texture(u_texture, uv + vec2(2.0 * step.x, 0.0)).x;\n\n    // first: convolve each value with the vector d,\n    // https://en.wikipedia.org/wiki/Image_derivatives#Farid_and_Simoncelli_derivatives\n    float I_k = x1*0.109604 + x2*0.276691 + x3*0.000000 + x4*-0.276691 + x5*-0.109604;\n    float I_d = x1*0.037659 + x2*0.249153 + x3*0.426375 + x4*0.249153 + x5*0.037659;\n    outPixel = vec4(I_k, I_d, 0.0, chroma);\n}\n',
        ),
      )),
      g.useProgram(this.derivativeFirstPass),
      this.setBuffers(g, this.derivativeFirstPass),
      this.setTextures(g, this.derivativeFirstPass, 0);
    let e = g.getUniformLocation(this.derivativeFirstPass, 'u_step');
    if (!e)
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    if (
      (g.uniform2fv(e, B),
      (this.derivativeSecondPass = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform vec2 u_step; // [1.0/w; 1.0/h];\nuniform sampler2D u_texture;\nout vec4 outPixel;\n\nvoid main() {\n    vec2 step = u_step;\n    vec2 uv = v_tex_coord;\n\n    vec2 y1 = texture(u_texture, uv + vec2(0.0, -2.0*step.y)).rg;\n    vec2 y2 = texture(u_texture, uv + vec2(0.0, -step.y)).rg;\n    vec4 color = texture(u_texture, uv);\n    vec2 y3 = color.rg;\n    float chroma = color.a;\n    vec2 y4 = texture(u_texture, uv + vec2(0.0, step.y)).rg;\n    vec2 y5 = texture(u_texture, uv + vec2(0.0, 2.0*step.y)).rg;\n\n    // convolve vector k with output of previous convolution I (*) d\n    float I_x = y1.r*0.037659 + y2.r*0.249153 + y3.r*0.426375 + y4.r*0.249153 + y5.r*0.037659;\n    float I_y = y1.g*0.109604 + y2.g*0.276691 + y3.g*0.000000 + y4.g*-0.276691 + y5.g*-0.109604;\n\n    // gl_FragColor = vec4(16.0*I_x*I_x, 16.0*I_y*I_y, I_x*I_y, chroma); // intensify effect for visual debugging\n    outPixel = vec4(I_x*I_x, I_y*I_y, I_x*I_y, chroma);\n}\n',
        ),
      )),
      g.useProgram(this.derivativeSecondPass),
      this.setBuffers(g, this.derivativeSecondPass),
      this.setTextures(g, this.derivativeSecondPass, 0),
      g.uniform2fv(
        g.getUniformLocation(this.derivativeSecondPass, 'u_step'),
        B,
      ),
      (this.windowSum = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform sampler2D u_texture;\nuniform vec2 u_step; // (1.0/w, 0.0): horizontal blur, (0.0, 1.0/w): vertical blur\nuniform float u_chroma_threshold;\nout vec4 outPixel;\n\nvoid main() {\n    vec2 uv = v_tex_coord;\n\n    float hstep = u_step.x;\n    float vstep = u_step.y;\n\n    // 7-tap gaussian blur, one-pass, direction specified in uniform\n    // see: http://dev.theomader.com/gaussian-kernel-calculator/ (sigma: 2)\n    vec4 sum = vec4(0.0);\n    sum += texture(u_texture, vec2(uv.x - 3.0*hstep, uv.y - 3.0*vstep)) * 0.071303;\n    sum += texture(u_texture, vec2(uv.x - 2.0*hstep, uv.y - 2.0*vstep)) * 0.131514;\n    sum += texture(u_texture, vec2(uv.x - 1.0*hstep, uv.y - 1.0*vstep)) * 0.189879;\n\n    vec4 color = texture(u_texture, uv);\n    float chroma = color.a;\n    sum += color * 0.214607;\n\n    sum += texture(u_texture, vec2(uv.x + 1.0*hstep, uv.y + 1.0*vstep)) * 0.189879;\n    sum += texture(u_texture, vec2(uv.x + 2.0*hstep, uv.y - 2.0*vstep)) * 0.131514;\n    sum += texture(u_texture, vec2(uv.x + 3.0*hstep, uv.y - 3.0*vstep)) * 0.071303;\n\n    // if the chroma value of the pixel is above a certain threshold (colorful area),\n    // set the components of the struture matrix to zero.\n    // A = 1.0 - step(threshold, c) is equivalent to A = c < threshold ? 1.0 : 0.0\n    float A = 1.0 - step(u_chroma_threshold, chroma);\n    outPixel = A * sum;\n}\n',
        ),
      )),
      g.useProgram(this.windowSum),
      this.setBuffers(g, this.windowSum),
      this.setTextures(g, this.windowSum, 0),
      (e = g.getUniformLocation(this.windowSum, 'u_step')),
      !e)
    )
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    if (
      ((this.windowSumStep = e),
      g.uniform1f(
        g.getUniformLocation(this.windowSum, 'u_chroma_threshold'),
        this.chromaRejectThreshold,
      ),
      (this.edgeness = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform sampler2D u_texture;\nout vec4 outPixel;\n\nvoid main() {\n    vec4 struct_matrix = texture(u_texture, v_tex_coord);\n    float Cxx = struct_matrix.r;\n    float Cyy = struct_matrix.g;\n    float Cxy = struct_matrix.b;\n\n    float a = Cxx + Cyy;\n    float b = Cxx - Cyy;\n\n    float denom = (Cxx + Cyy)*(Cxx + Cyy) + 0.001;\n    float m1 = ((Cxx - Cyy)*(Cxx - Cyy) + 4.0*Cxy*Cxy)/denom;\n    outPixel = vec4(m1, 0.0, 0.0, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.edgeness),
      this.setBuffers(g, this.edgeness),
      this.setTextures(g, this.edgeness, 0),
      (this.cornerness = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\nuniform sampler2D u_texture;\nout vec4 outPixel;\n\nvoid main() {\n    vec4 struct_matrix = texture(u_texture, v_tex_coord);\n    float Cxx = struct_matrix.r;\n    float Cyy = struct_matrix.g;\n    float Cxy = struct_matrix.b;\n\n    float denom = (Cxx + Cyy)*(Cxx + Cyy) + 0.001;\n    float m2 = 4.0*(Cxx*Cyy - Cxy*Cxy)/denom;\n    outPixel = vec4(0.0, m2, 0.0, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.cornerness),
      this.setBuffers(g, this.cornerness),
      this.setTextures(g, this.cornerness, 0),
      (this.boxFilter = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\n\nuniform sampler2D u_texture;\nuniform vec2 u_step; // (1.0/w, 0.0): horizontal blur, (0.0, 1.0/w): vertical blur\n\nout vec4 outPixel;\n\n// 32-tap box filter, implemented in 16 taps (sampling between pixels returns mean: LINEAR)\nconst int size = 16;\n\nvoid main() {\n    vec2 uv = v_tex_coord;\n    float size_f = float(size);\n    vec4 sum = vec4(0.0);\n    vec2 coord = uv + vec2(-size_f - 0.5, -size_f - 0.5) * u_step;\n    vec2 two_step = u_step * 2.0; // advance by two pixels\n    for (int i = 0; i < size; i++) {\n        sum += texture(u_texture, coord);\n        coord += two_step;\n    }\n    outPixel = sum / size_f;\n}\n',
        ),
      )),
      g.useProgram(this.boxFilter),
      this.setBuffers(g, this.boxFilter),
      this.setTextures(g, this.boxFilter, 0),
      (e = g.getUniformLocation(this.boxFilter, 'u_step')),
      !e)
    )
      throw E.internalErrorWithDetail('Failed to get uniform location u_step');
    return (
      (this.boxFilterStep = e),
      (this.combineMaps = this.createProgram(
        g,
        A(dA),
        A(
          '#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nin vec2 v_tex_coord;\n\nuniform sampler2D u_texture;\nuniform sampler2D u_texture1;\nuniform sampler2D u_texture2; // luminance image\n\n// weights for linear combination of m1/m2 into s1/s2.\nuniform vec2 u_w1;\nuniform vec2 u_w2;\n\nout vec4 outPixel;\n\nvoid main() {\n    float m1 = texture(u_texture, v_tex_coord).r;\n    float m2 = texture(u_texture1, v_tex_coord).g;\n    vec2 m12 = vec2(m1, m2);\n\n    // 1D barcodes have edges but should not have corners\n    float s1 = dot(u_w1, m12);\n\n    // 2D barcodes should have edges and corneers\n    float s2 = dot(u_w2, m12);\n\n    // luminance image\n    float lum = texture(u_texture2, v_tex_coord).x;\n\n    outPixel = vec4(lum, s1, s2, 1.0);\n}\n',
        ),
      )),
      g.useProgram(this.combineMaps),
      this.setBuffers(g, this.combineMaps),
      this.setTextures(g, this.combineMaps, 0, 1, 2),
      g.uniform2fv(
        g.getUniformLocation(this.combineMaps, 'u_w1'),
        LA.S1_WEIGHTS,
      ),
      g.uniform2fv(
        g.getUniformLocation(this.combineMaps, 'u_w2'),
        LA.S2_WEIGHTS,
      ),
      MA(g),
      g
    );
  }
  locate(A) {
    const I = this.gl;
    if (void 0 === I)
      return (
        console.warn(
          'WebGL2Locator.locate() invoked, but GL context already destroyed',
        ),
        Promise.resolve()
      );
    if (I.isContextLost())
      return (
        console.warn('WebGL2Locator.locate(): WebGL context was lost'),
        Promise.resolve()
      );
    const g = this.canvas,
      B = [1 / g.width, 0],
      C = [0, 1 / g.height];
    return (
      I.useProgram(this.lumAndChroma),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufLum),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureLum,
        0,
      ),
      I.activeTexture(I.TEXTURE0),
      I.bindTexture(I.TEXTURE_2D, this.cameraTexture),
      I.texImage2D(
        I.TEXTURE_2D,
        0,
        I.RGBA,
        I.RGBA,
        I.UNSIGNED_BYTE,
        this.texImageSource,
      ),
      this.render(I),
      A.addTimingEvent({
        time: Date.now(),
        event: 'frameAcquired',
        cssColor: 'red',
      }),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.derivativeFirstPass),
      I.bindTexture(I.TEXTURE_2D, this.textureLum),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.derivativeSecondPass),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.windowSum),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.windowSumStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.uniform2fv(this.windowSumStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufA),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureA,
        0,
      ),
      I.useProgram(this.edgeness),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.useProgram(this.cornerness),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.boxFilter),
      I.bindTexture(I.TEXTURE_2D, this.textureA),
      I.uniform2fv(this.boxFilterStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufA),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureA,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.boxFilterStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.boxFilter),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.uniform2fv(this.boxFilterStep, B),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufB),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureB,
        0,
      ),
      I.bindTexture(I.TEXTURE_2D, this.textureC),
      I.uniform2fv(this.boxFilterStep, C),
      this.render(I),
      I.bindFramebuffer(I.FRAMEBUFFER, this.bufC),
      I.framebufferTexture2D(
        I.FRAMEBUFFER,
        I.COLOR_ATTACHMENT0,
        I.TEXTURE_2D,
        this.textureC,
        0,
      ),
      I.useProgram(this.combineMaps),
      I.activeTexture(I.TEXTURE0),
      I.bindTexture(I.TEXTURE_2D, this.textureA),
      I.activeTexture(I.TEXTURE1),
      I.bindTexture(I.TEXTURE_2D, this.textureB),
      I.activeTexture(I.TEXTURE2),
      I.bindTexture(I.TEXTURE_2D, this.textureLum),
      this.render(I),
      A.addTimingEvent({time: Date.now(), event: 'gpuDone', cssColor: 'blue'}),
      this.forceSyncReadback
        ? (I.readPixels(
            this.roe.origin.x,
            this.roe.origin.y,
            this.roe.size.width,
            this.roe.size.height,
            I.RGBA,
            I.UNSIGNED_BYTE,
            A.buffer,
          ),
          A.addTimingEvent({
            time: Date.now(),
            event: 'gpuCpuTransferDone',
            cssColor: 'pink',
          }),
          Promise.resolve())
        : (I.bindBuffer(I.PIXEL_PACK_BUFFER, this.pixelPackBuf),
          I.readPixels(
            this.roe.origin.x,
            this.roe.origin.y,
            this.roe.size.width,
            this.roe.size.height,
            I.RGBA,
            I.UNSIGNED_BYTE,
            0,
          ),
          this.readPixelPackBufferAsync(I, A.buffer).then(() => {
            A.addTimingEvent({
              time: Date.now(),
              event: 'gpuCpuTransferDone',
              cssColor: 'pink',
            });
          }))
    );
  }
  createAndSetupTexture(A) {
    const I = A.createTexture();
    if (!I)
      throw E.internalErrorWithDetail(
        'Failed to create camera input texture: ' + A.getError(),
      );
    return (
      A.bindTexture(A.TEXTURE_2D, I),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_WRAP_S, A.CLAMP_TO_EDGE),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_WRAP_T, A.CLAMP_TO_EDGE),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_MIN_FILTER, A.LINEAR),
      A.texParameteri(A.TEXTURE_2D, A.TEXTURE_MAG_FILTER, A.LINEAR),
      I
    );
  }
  createProgram(A, I, g) {
    const B = A.createProgram();
    if (!B) throw E.internalErrorWithDetail('Failed to create WebGL program');
    const C = A.createShader(WebGL2RenderingContext.FRAGMENT_SHADER);
    if (!C)
      throw E.internalErrorWithDetail('Failed to create WebGL fragment shader');
    if (
      (A.shaderSource(C, g),
      A.compileShader(C),
      !A.getShaderParameter(C, A.COMPILE_STATUS))
    )
      throw E.internalErrorWithDetail(
        'Failed to compile WebGL shader:\n' + A.getShaderInfoLog(C),
      );
    const Q = A.createShader(WebGL2RenderingContext.VERTEX_SHADER);
    if (!Q)
      throw E.internalErrorWithDetail('Failed to create WebGL vertex shader');
    if (
      (A.shaderSource(Q, I),
      A.compileShader(Q),
      !A.getShaderParameter(Q, A.COMPILE_STATUS))
    )
      throw E.internalErrorWithDetail(
        'Failed to compile Shader:\n' + A.getShaderInfoLog(Q),
      );
    if (
      (A.attachShader(B, C),
      A.attachShader(B, Q),
      A.linkProgram(B),
      A.validateProgram(B),
      !A.getProgramParameter(B, A.LINK_STATUS))
    ) {
      const I = A.getProgramInfoLog(B);
      throw E.internalErrorWithDetail('Failed to compile WebGL program:\n' + I);
    }
    return B;
  }
  render(A) {
    A.drawArrays(A.TRIANGLE_STRIP, 0, 4);
  }
  linkFrameSource(A) {
    (this.texImageSource = this.frameSource.get()),
      (this.cameraTexture = this.createAndSetupTexture(A)),
      A.activeTexture(A.TEXTURE0),
      A.texImage2D(
        A.TEXTURE_2D,
        0,
        A.RGBA,
        A.RGBA,
        A.UNSIGNED_BYTE,
        this.texImageSource,
      );
  }
  getRegionOfInterestSpec() {
    return this.config.regionOfInterest;
  }
  createCanvas(A) {
    let I;
    return (
      !0 === nA.browserCapabilities.supportsOffscreenCanvas
        ? (I = new OffscreenCanvas(A.width, A.height))
        : ((I = document.createElement('canvas')),
          (I.style.visibility = 'hidden'),
          (I.width = A.width),
          (I.height = A.height)),
      I
    );
  }
  calculateRegionOfInterest(A) {
    if (!this.config.regionOfInterest)
      throw E.configurationErrorWithDetail('Region of interest is undefined');
    const I = eA(this.viewportSize, this.config.regionOfInterest),
      g = new kA(A, this.viewportSize);
    this.roe = g.viewportRectToImageRect(I);
  }
  readPixelPackBufferAsync(A, I) {
    const g = A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE, 0);
    return null === g
      ? Promise.reject(E.internalErrorWithDetail('Could not create WebGL sync'))
      : (A.flush(),
        this.waitUntilSyncSignaled(A, g)
          .then(() => {
            void 0 !== this.gl &&
              (A.getBufferSubData(A.PIXEL_PACK_BUFFER, 0, I),
              A.bindBuffer(A.PIXEL_PACK_BUFFER, null));
          })
          .finally(() => {
            A.deleteSync(g);
          }));
  }
  waitUntilSyncSignaled(A, I) {
    return new Promise((g, B) => {
      !(function C() {
        if (A.isContextLost()) return void g();
        const Q = A.clientWaitSync(I, 0, 0);
        Q !== A.WAIT_FAILED
          ? Q !== A.TIMEOUT_EXPIRED
            ? g()
            : setTimeout(C, 10)
          : B();
      })();
    });
  }
}
class KA {
  static knownBackFacingCameraLabels = [
    'rear',
    'back',
    'rück',
    'arrière',
    'trasera',
    'trás',
    'traseira',
    'posteriore',
    '后面',
    '後面',
    '背面',
    '后置',
    '後置',
    '背置',
    'задней',
    'الخلفية',
    '후',
    'arka',
    'achterzijde',
    'หลัง',
    'baksidan',
    'bagside',
    'sau',
    'bak',
    'tylny',
    'takakamera',
    'belakang',
    'אחורית',
    'πίσω',
    'spate',
    'hátsó',
    'zadní',
    'darrere',
    'zadná',
    'задня',
    'stražnja',
    'belakang',
    'बैक',
  ];
  constructor(A) {
    if (((this.mediaDeviceInfo = A), 'videoinput' !== A.kind))
      throw E.internalErrorWithDetail('Bad device (not a videoinput device)');
    this.isBackFacing = this.isKnownBackCameraLabel(A.label);
  }
  get hasPermission() {
    return !!this.mediaDeviceInfo.label;
  }
  get deviceId() {
    return this.mediaDeviceInfo.deviceId;
  }
  get label() {
    return this.mediaDeviceInfo.label;
  }
  toString() {
    return `CameraDevice [id=${this.mediaDeviceInfo.deviceId}, kind=${this.mediaDeviceInfo.kind}, label=${this.mediaDeviceInfo.label}]`;
  }
  isKnownBackCameraLabel(A) {
    if (!A) return;
    const I = A.toLowerCase();
    return KA.knownBackFacingCameraLabels.some(A => I.includes(A));
  }
}
class JA {
  static isOverconstrainedError(A) {
    return 'OverconstrainedError' === A.name;
  }
  relax(A, I) {
    if (
      (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 &&
        !I?.constraint) ||
      ['width', 'height'].includes(I?.constraint)
    ) {
      const I = A.video;
      if (!I) return null;
      let g = !1;
      return (
        'width' in I &&
          ('min' in I.width && ((g = !0), delete I.width.min),
          'max' in I.width && ((g = !0), delete I.width.max)),
        'height' in I &&
          ('min' in I.height && ((g = !0), delete I.height.min),
          'max' in I.height && ((g = !0), delete I.height.max)),
        g ? {video: I} : null
      );
    }
    return null;
  }
}
class YA {
  constructor(A, I) {
    (this.config = A),
      (this.videoElement = I),
      (this.debug = !1),
      (this.DEFAULT_RESOLUTION = 'hd'),
      (this.initialized = !1),
      (this.destroyed = !1),
      (this.availableDevices = void 0);
  }
  static fromHostElement(A, I) {
    const g = document.createElement('video');
    (g.style.width = '100%'),
      (g.style.objectFit = 'cover'),
      (g.playsInline = !0),
      (g.style.height = `${I.clientHeight}px`),
      I.appendChild(g);
    const B = new YA(A, g);
    return (
      new ResizeObserver(() => {
        B.onHostElementResized();
      }).observe(I),
      B
    );
  }
  getNumberOfChannels() {
    return 4;
  }
  getImageSize() {
    if (!this.initialized)
      throw E.internalErrorWithDetail(
        'Frame source needs to be initialized first',
      );
    return this.size;
  }
  initialize() {
    return this.destroyed
      ? Promise.reject(
          E.internalErrorWithDetail('Frame source is already destroyed'),
        )
      : this.acquireVideoStream(void 0).then(
          () => ((this.initialized = !0), this),
        );
  }
  isReady() {
    return (
      !this.destroyed &&
      void 0 !== this.videoTrack &&
      'live' === this.videoTrack.readyState
    );
  }
  restartIfLost() {
    return this.destroyed
      ? Promise.reject(
          E.internalErrorWithDetail('Frame source is already destroyed'),
        )
      : this.videoTrack && 'ended' !== this.videoTrack.readyState
      ? Promise.resolve(this)
      : (this.debug && console.debug('Video track has ended, reacquiring...'),
        this.acquireVideoStream(this.currentDevice).catch(A => {
          if (
            A instanceof E &&
            A.duringCameraAccess &&
            'NotReadableError' === A.name
          )
            return new Promise((A, I) => {
              setTimeout(() => {
                this.acquireVideoStream(this.currentDevice)
                  .then(() => A(this))
                  .catch(A => I(A));
              }, 250);
            });
          throw A;
        }));
  }
  stop() {
    this.destroyed ||
      (this.releaseVideoStream(),
      this.debug && console.debug('Stopped frame source'));
  }
  destroy() {
    this.destroyed ||
      (this.stop(), this.videoElement.remove(), (this.destroyed = !0));
  }
  acquireVideoStream(A) {
    const I = this.getConstraintsFromConfig(this.config);
    A && A.mediaDeviceInfo.label && A.deviceId
      ? (this.debug &&
          console.debug(`Attempting to access device: ${A.deviceId}`),
        (I.video.deviceId = {exact: A.deviceId}))
      : (this.debug &&
          console.debug(
            'Attempting to access default environment-facing camera',
          ),
        (I.video.facingMode = {ideal: 'environment'})),
      this.debug &&
        console.debug(`getUserMedia() with constraints: ${JSON.stringify(I)}`);
    const g = new JA();
    return navigator.mediaDevices
      .getUserMedia(I)
      .catch(A => {
        if (JA.isOverconstrainedError(A)) {
          const B = g.relax(I, A);
          if (null !== B)
            return (
              this.debug &&
                console.debug(
                  `Retrying getUserMedia() with relaxed constraints: ${JSON.stringify(
                    B,
                  )}`,
                ),
              navigator.mediaDevices.getUserMedia(B).catch(A => {
                throw E.fromGetUserMediaError(A);
              })
            );
        }
        throw E.fromGetUserMediaError(A);
      })
      .then(A => {
        const I =
          A.getVideoTracks().length > 0 ? A.getVideoTracks()[0] : void 0;
        if (!I)
          throw E.internalErrorWithDetail(
            'MediaStream does not contain a video track',
          );
        const g = I.getSettings().width,
          B = I.getSettings().height;
        if (!g || !B)
          throw E.internalErrorWithDetail(
            'Video track does not specify its resolution in settings',
          );
        return (
          I.addEventListener(
            'ended',
            () => {
              this.debug &&
                console.debug(
                  `Video track ${I.id} is now in state: ${I.readyState}`,
                ),
                this.endedHandler && this.endedHandler();
            },
            {passive: !0},
          ),
          (this.mediaStream = A),
          (this.videoTrack = I),
          this.debug &&
            console.debug(`Video track ${I.id} has resolution: ${g} x ${B}`),
          this.videoElement.addEventListener('ended', () => {
            this.debug && console.debug('Video element event: ended');
          }),
          this.getAvailableDevices().then(A => {
            const g = I.getSettings().deviceId;
            return A.find(A => A.deviceId === g);
          })
        );
      })
      .then(I => {
        if (
          ((this.currentDevice = I),
          void 0 === A &&
            void 0 !== I &&
            void 0 !== this.availableDevices &&
            this.availableDevices.length > 0)
        ) {
          const A = this.availableDevices[0];
          if (I.deviceId !== A.deviceId)
            return (
              console.warn(
                `getUserMedia() selected device: ${I.toString()}, our preferred device is: ${A}`,
              ),
              this.mediaStream.getTracks().forEach(A => A.stop()),
              this.acquireVideoStream(A)
            );
        }
      })
      .then(
        () => (
          this.debug &&
            console.debug(
              `Starting frame source using device: ${this.currentDevice}`,
            ),
          (this.videoElement.srcObject = this.mediaStream),
          new Promise(A => {
            this.videoElement.onloadedmetadata = () => {
              this.videoElement.play().then(() => {
                (this.size = EA(
                  this.videoElement.videoWidth,
                  this.videoElement.videoHeight,
                )),
                  A(this);
              });
            };
          })
        ),
      )
      .catch(A => {
        if (A instanceof E) throw ((A.duringCameraAccess = !0), A);
        {
          const I = E.internalErrorWithCause(A);
          throw ((I.duringCameraAccess = !0), I);
        }
      });
  }
  releaseVideoStream() {
    this.mediaStream?.getTracks().forEach(A => {
      A.stop();
    }),
      (this.videoTrack = void 0),
      (this.mediaStream = void 0),
      (this.videoElement.srcObject = null),
      this.debug && console.debug('Released video track and media stream');
  }
  get() {
    return this.videoElement;
  }
  focusOnTap() {
    if (!this.videoTrack)
      return Promise.reject(
        E.internalErrorWithDetail('Video track is not initialized'),
      );
    if ('function' != typeof this.videoTrack.getCapabilities)
      return Promise.reject(new E('error.featureNotAvailable'));
    if ('live' !== this.videoTrack.readyState)
      return Promise.reject(E.internalErrorWithDetail('Video is not ready'));
    const A = this.videoTrack;
    return Object.prototype.hasOwnProperty.call(
      A.getCapabilities(),
      'focusDistance',
    )
      ? new Promise((I, g) => {
          A.applyConstraints({
            advanced: [{focusMode: 'manual', focusDistance: 0.3}],
          })
            .then(() => {
              setTimeout(() => {
                A.applyConstraints({advanced: [{focusMode: 'continuous'}]})
                  .then(() => {
                    I();
                  })
                  .catch(A => {
                    g(E.internalErrorWithCause(A));
                  });
              }, 250);
            })
            .catch(A => {
              g(E.internalErrorWithCause(A));
            });
        })
      : Promise.resolve();
  }
  setTorchEnabled(A) {
    return this.videoTrack
      ? 'live' !== this.videoTrack.readyState
        ? Promise.reject(E.internalErrorWithDetail('Video track is not ready'))
        : this.videoTrack
            .applyConstraints({advanced: [{torch: A}]})
            .then(() => {
              if (this.getTorchEnabled() != A)
                throw new E('error.featureNotAvailable');
            })
            .catch(A => {
              throw A instanceof E ? A : E.internalErrorWithCause(A);
            })
      : Promise.reject(
          E.internalErrorWithDetail('Video track is not initialized'),
        );
  }
  getTorchEnabled() {
    if (this.videoTrack && 'live' === this.videoTrack.readyState)
      return 'boolean' == typeof this.videoTrack.getSettings().torch
        ? this.videoTrack.getSettings().torch
        : void 0;
  }
  getAvailableDevices() {
    return navigator.mediaDevices.enumerateDevices().then(A => {
      if (A) {
        const I = A.filter(A => 'videoinput' === A.kind).map(A => new KA(A));
        return (
          I.some(A => !A.hasPermission)
            ? ((this.availableDevices = I),
              console.warn(
                'enumerateDevices() returned videoinput devices without label (HINT: permission?)',
              ))
            : (this.availableDevices = this.sortAndFilterDevices(I)),
          this.availableDevices
        );
      }
      throw new E('error.cameraNotFound');
    });
  }
  getCurrentCameraDevice() {
    return this.currentDevice;
  }
  selectCameraDevice(A) {
    if (!this.availableDevices)
      return Promise.reject(new E('error.cameraNotFound'));
    const I = this.availableDevices.find(I => I.deviceId === A);
    return I
      ? (this.mediaStream &&
          (this.mediaStream.getTracks().forEach(A => A.stop()),
          (this.videoTrack = void 0),
          (this.mediaStream = void 0),
          (this.currentDevice = void 0)),
        this.acquireVideoStream(I))
      : Promise.reject(new E('error.cameraNotReadable'));
  }
  getConstraintsFromConfig(A) {
    const I = {audio: !1},
      g = A.resolution || this.DEFAULT_RESOLUTION,
      B = {
        width: {min: 800, ideal: 1280, max: 1600},
        height: {min: 600, ideal: 720, max: 900},
      };
    return (
      'hd' === g
        ? (I.video = B)
        : 'full-hd' === g
        ? (I.video = {
            width: {min: 1400, ideal: 1920, max: 2160},
            height: {min: 900, ideal: 1080, max: 1440},
          })
        : (console.warn(
            `Unknown resolution '${g}' in config, falling back to 'hd'`,
          ),
          (I.video = B)),
      I
    );
  }
  sortAndFilterDevices(A) {
    return A.filter(A => 'videoinput' === A.mediaDeviceInfo.kind).sort((A, I) =>
      !0 === A.isBackFacing && !1 === I.isBackFacing
        ? -1
        : !1 === A.isBackFacing && !0 === I.isBackFacing
        ? 1
        : A.mediaDeviceInfo.label.localeCompare(I.mediaDeviceInfo.label),
    );
  }
  onHostElementResized() {
    const A = this.videoElement.parentElement;
    A && (this.videoElement.style.height = `${A.clientHeight}px`);
  }
}
class HA {
  constructor(A) {
    this.codeDetections = A;
  }
}
class lA {
  constructor(A) {
    if (((this.interval = A), A <= 0))
      throw E.configurationErrorWithDetail(
        'duplicateInterval must be a positive number',
      );
    this.lastDetection = {};
  }
  filter(A) {
    this.removeStaleDetections(A.time);
    const I = this.lastDetection[A.data];
    return void 0 === I
      ? ((this.lastDetection[A.data] = A.time), !1)
      : !(I < A.time - this.interval) ||
          ((this.lastDetection[A.data] = A.time), !1);
  }
  removeStaleDetections(A) {
    const I = Object.keys(this.lastDetection);
    for (const g in I)
      this.lastDetection[g] < A - this.interval && delete this.lastDetection[g];
  }
}
var fA,
  uA,
  xA =
    ((uA =
      'undefined' != typeof document && document.currentScript
        ? document.currentScript.src
        : void 0),
    function (A = {}) {
      var I, g, B;
      I || (I = void 0 !== A ? A : {}),
        (I.ready = new Promise(function (A, I) {
          (g = A), (B = I);
        }));
      var C = Object.assign({}, I),
        Q = '';
      'undefined' != typeof document &&
        document.currentScript &&
        (Q = document.currentScript.src),
        uA && (Q = uA),
        (Q =
          0 !== Q.indexOf('blob:')
            ? Q.substr(0, Q.replace(/[?#].*/, '').lastIndexOf('/') + 1)
            : '');
      var E,
        i = I.print || console.log.bind(console),
        o = I.printErr || console.warn.bind(console);
      Object.assign(I, C),
        (C = null),
        I.wasmBinary && (E = I.wasmBinary),
        I.noExitRuntime,
        'object' != typeof WebAssembly && U('no native wasm support detected');
      var e,
        t,
        D,
        s,
        a,
        r,
        c = !1,
        w =
          'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0;
      function h(A, I) {
        for (var g = I + NaN, B = I; A[B] && !(B >= g); ) ++B;
        if (16 < B - I && A.buffer && w) return w.decode(A.subarray(I, B));
        for (g = ''; I < B; ) {
          var C = A[I++];
          if (128 & C) {
            var Q = 63 & A[I++];
            if (192 == (224 & C)) g += String.fromCharCode(((31 & C) << 6) | Q);
            else {
              var E = 63 & A[I++];
              65536 >
              (C =
                224 == (240 & C)
                  ? ((15 & C) << 12) | (Q << 6) | E
                  : ((7 & C) << 18) | (Q << 12) | (E << 6) | (63 & A[I++]))
                ? (g += String.fromCharCode(C))
                : ((C -= 65536),
                  (g += String.fromCharCode(
                    55296 | (C >> 10),
                    56320 | (1023 & C),
                  )));
            }
          } else g += String.fromCharCode(C);
        }
        return g;
      }
      function n() {
        var A = e.buffer;
        (I.HEAP8 = t = new Int8Array(A)),
          (I.HEAP16 = new Int16Array(A)),
          (I.HEAP32 = s = new Int32Array(A)),
          (I.HEAPU8 = D = new Uint8Array(A)),
          (I.HEAPU16 = new Uint16Array(A)),
          (I.HEAPU32 = a = new Uint32Array(A)),
          (I.HEAPF32 = new Float32Array(A)),
          (I.HEAPF64 = r = new Float64Array(A));
      }
      var y = [],
        S = [],
        F = [];
      function G() {
        var A = I.preRun.shift();
        y.unshift(A);
      }
      var R,
        N = 0,
        M = null,
        k = null;
      function U(A) {
        throw (
          (I.onAbort && I.onAbort(A),
          o((A = 'Aborted(' + A + ')')),
          (c = !0),
          (A = new WebAssembly.RuntimeError(
            A + '. Build with -sASSERTIONS for more info.',
          )),
          B(A),
          A)
        );
      }
      function d(A) {
        return A.startsWith('data:application/octet-stream;base64,');
      }
      if (
        !d(
          (R =
            'data:application/octet-stream;base64,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//8BcSEHAkACQCACQjCIp0H//wFxIglB//8Ba0GCgH5PBEAgB0H//wFrQYGAfksNAQsgAVAgAkL///////////8AgyILQoCAgICAgMD//wBUIAtCgICAgICAwP//AFEbRQRAIAJCgICAgICAIIQhCgwCCyADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCEKIAMhAQwCCyABIAtCgICAgICAwP//AIWEUARAIAIgA4RQBEBCgICAgICA4P//ACEKQgAhAQwDCyAKQoCAgICAgMD//wCEIQpCACEBDAILIAMgAkKAgICAgIDA//8AhYRQBEAgASALhCECQgAhASACUARAQoCAgICAgOD//wAhCgwDCyAKQoCAgICAgMD//wCEIQoMAgsgASALhFAEQEIAIQEMAgsgAiADhFAEQEIAIQEMAgsgC0L///////8/WARAIAVB0ABqIAEgDSABIA0gDVAiBht5IAZBBnStfKciBkEPaxAdQRAgBmshBiAFKQNYIg1CIIghDiAFKQNQIQELIAJC////////P1YNACAFQUBrIAMgDCADIAwgDFAiCBt5IAhBBnStfKciCEEPaxAdIAYgCGtBEGohBiAFKQNIIQwgBSkDQCEDCyADQg+GIgtCgID+/w+DIgIgAUIgiCIEfiIQIAtCIIgiEyABQv////8PgyIBfnwiD0IghiIRIAEgAn58IgsgEVStIAIgDUL/////D4MiDX4iFSAEIBN+fCIRIAxCD4YiEiADQjGIhEL/////D4MiAyABfnwiFCAPIBBUrUIghiAPQiCIhHwiDyACIA5CgIAEhCIMfiIWIA0gE358Ig4gEkIgiEKAgICACIQiAiABfnwiECADIAR+fCISQiCGfCIXfCEBIAcgCWogBmpB//8AayEGAkAgAiAEfiIYIAwgE358IgQgGFStIAQgBCADIA1+fCIEVq18IAIgDH58IAQgBCARIBVUrSARIBRWrXx8IgRWrXwgAyAMfiIDIAIgDX58IgIgA1StQiCGIAJCIIiEfCAEIAJCIIZ8IgIgBFStfCACIAIgECASVq0gDiAWVK0gDiAQVq18fEIghiASQiCIhHwiAlatfCACIAIgDyAUVK0gDyAXVq18fCICVq18IgRCgICAgICAwACDQgBSBEAgBkEBaiEGDAELIAtCP4ghAyAEQgGGIAJCP4iEIQQgAkIBhiABQj+IhCECIAtCAYYhCyADIAFCAYaEIQELIAZB//8BTgRAIApCgICAgICAwP//AIQhCkIAIQEMAQsCfiAGQQBMBEBBASAGayIHQf8ATQRAIAVBMGogCyABIAZB/wBqIgYQHSAFQSBqIAIgBCAGEB0gBUEQaiALIAEgBxA5IAUgAiAEIAcQOSAFKQMwIAUpAziEQgBSrSAFKQMgIAUpAxCEhCELIAUpAyggBSkDGIQhASAFKQMAIQIgBSkDCAwCC0IAIQEMAgsgBEL///////8/gyAGrUIwhoQLIAqEIQogC1AgAUIAWSABQoCAgICAgICAgH9RG0UEQCAKIAJCAXwiAVCtfCEKDAELIAsgAUKAgICAgICAgIB/hYRCAFIEQCACIQEMAQsgCiACIAJCAYN8IgEgAlStfCEKCyAAIAE3AwAgACAKNwMIIAVB4ABqJAALgAQBA38gAkGABE8EQCAAIAEgAhAGIAAPCyAAIAJqIQMCQCAAIAFzQQNxRQRAAkAgAEEDcUUEQCAAIQIMAQsgAkUEQCAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgJBA3FFDQEgAiADSQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUFAayEBIAJBQGsiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAsMAQsgA0EESQRAIAAhAgwBCyAAIANBBGsiBEsEQCAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLIAIgA0kEQANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAAC5QEAQN/IAEgACABRiICOgAMAkAgAg0AA0AgASgCCCICLQAMDQECQCACIAIoAggiAygCACIERgRAAkAgAygCBCIERQ0AIAQtAAwNAAwCCwJAIAEgAigCAEYEQCACIQEMAQsgAiACKAIEIgEoAgAiADYCBCABIAAEfyAAIAI2AgggAigCCAUgAws2AgggAigCCCIAIAAoAgAgAkdBAnRqIAE2AgAgASACNgIAIAIgATYCCCABKAIIIgMoAgAhAgsgAUEBOgAMIANBADoADCADIAIoAgQiADYCACAABEAgACADNgIICyACIAMoAgg2AgggAygCCCIAIAAoAgAgA0dBAnRqIAI2AgAgAiADNgIEIAMgAjYCCA8LAkAgBEUNACAELQAMDQAMAQsCQCABIAIoAgBHBEAgAiEBDAELIAIgASgCBCIANgIAIAEgAAR/IAAgAjYCCCACKAIIBSADCzYCCCACKAIIIgAgACgCACACR0ECdGogATYCACABIAI2AgQgAiABNgIIIAEoAgghAwsgAUEBOgAMIANBADoADCADIAMoAgQiACgCACIBNgIEIAEEQCABIAM2AggLIAAgAygCCDYCCCADKAIIIgEgASgCACADR0ECdGogADYCACAAIAM2AgAgAyAANgIIDAILIARBDGohASACQQE6AAwgAyAAIANGOgAMIAFBAToAACADIgEgAEcNAAsLC9QCAQF/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABKAIAQQJrDn8AEBABEBACAxAQBAUQEBAQEBAQEBAQEAYQEBAQEBAQEAgJEBAMBxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEA0ODxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQChAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBALEAsgAC0AJkEARw8LIAAtACdBAEcPCyAALQAlQQBHDwsgAC0AKUEARw8LIAAtAChBAEcPCyAALQAkQQBHDwsgAC0ALkEARw8LIAAtADBBAEcPCyAALQAqQQBHDwsgAC0AK0EARw8LIAAtACxBAEcPCyAALQAtQQBHDwsgAC0AL0EARw8LIAAtADJBAEcPCyAALQAxQQBHDwsgAC0AM0EARyECCyACC4oBAQN/IAAoAqQBIgFFBEAPCyAAKAKsASICIAAoApABQQV0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AyAFSQ0BDAILIAFBAEgNASAAKAIIIQMLIAUgASADakEBaiIBTwRAIAMgBGoPCyAAKAIQBEBBAA8LAn8gAUGAgICABE8EQEH/////ByABQQBODQEaQQAPCyABQQF0CyECAkAgACgCICIBBEAgBCACIAERBAAiAQ0BDAMLIAIgACgCGBEBACIBRQRADAMLIAEgACgCACAAKAIIQQFqEBEaIAAoAgAgACgCHBEAAAsgACABNgIAIAAgAjYCBCABIAAoAghqIQILIAIPCyAAKAIAIAAoAhwRAAAgAEIANwIAQQALxQkCBH8FfiMAQfAAayIGJAAgBEL///////////8AgyEJAkACQCABUCIFIAJC////////////AIMiCkKAgICAgIDA//8AfUKAgICAgIDAgIB/VCAKUBtFBEAgA0IAUiAJQoCAgICAgMD//wB9IgtCgICAgICAwICAf1YgC0KAgICAgIDAgIB/URsNAQsgBSAKQoCAgICAgMD//wBUIApCgICAgICAwP//AFEbRQRAIAJCgICAgICAIIQhBCABIQMMAgsgA1AgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRG0UEQCAEQoCAgICAgCCEIQQMAgsgASAKQoCAgICAgMD//wCFhFAEQEKAgICAgIDg//8AIAIgASADhSACIASFQoCAgICAgICAgH+FhFAiBRshBEIAIAEgBRshAwwCCyADIAlCgICAgICAwP//AIWEUA0BIAEgCoRQBEAgAyAJhEIAUg0CIAEgA4MhAyACIASDIQQMAgsgAyAJhEIAUg0AIAEhAyACIQQMAQsgAyABIAEgA1QgCSAKViAJIApRGyIIGyEKIAQgAiAIGyILQv///////z+DIQkgAiAEIAgbIgJCMIinQf//AXEhByALQjCIp0H//wFxIgVFBEAgBkHgAGogCiAJIAogCSAJUCIFG3kgBUEGdK18pyIFQQ9rEB0gBikDaCEJIAYpA2AhCkEQIAVrIQULIAEgAyAIGyEDIAJC////////P4MhBCAHRQRAIAZB0ABqIAMgBCADIAQgBFAiBxt5IAdBBnStfKciB0EPaxAdQRAgB2shByAGKQNYIQQgBikDUCEDCyAEQgOGIANCPYiEQoCAgICAgIAEhCEBIAlCA4YgCkI9iIQhBCACIAuFIQ0CfiADQgOGIgIgBSAH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ACIDRQ0AIANCADcDCCADQgA3AwAgA0IANwMgIANCADcDECADIAI5AxggA0EINgIMIAMCf0H/////ByACRAAAwP///99BZg0AGkGAgICAeCACRAAAAAAAAODBZQ0AGiACmUQAAAAAAADgQWMEQCACqgwBC0GAgICAeAs2AhQgAEUNACABRQ0AIAAgA0YNACABECtBAWoiBEGY8AAoAgARAQAiBUUNACAFIAEgBBARIQEgAygCDCIEQf97cSEFAkAgBEGABHENACADKAIgIgRFDQAgBEGc8AAoAgARAAALIAMgBTYCDCADIAE2AiAgACgCCCIBRQRAIAAgAzYCCCADQQA2AgAgAyADNgIEDwsgASgCBCIARQRADwsgACADNgIAIAMgADYCBCABIAM2AgQPCyADEDELDAAgASACIAAQkAEaC2IBAn8CQCABQcEASQ0AIAAoAmAiAiABSw0AQQEhAyABQYACSw0AIAAoAgBBgAIgAkFAayICIAJBgAJPGyABIAEgAkkbIgEQSyICRQ0AIAAgATYCYCAAIAI2AgBBACEDCyADC2EBA38CQCAARQ0AIAAoAgAiA0UNACAAKAIIIgEgACgCBCICTw0AAkADQCABIANqLQAAQSBNBEAgACABQQFqIgE2AgggASACRw0BDAILCyABIAJHDQELIAAgAkEBazYCCAsL5QEBB38gASAAKAIIIgQgACgCBCICa0ECdU0EQCAAIAEEfyACQQAgAUECdCIAEA0gAGoFIAILNgIEDwsCQCACIAAoAgAiAmsiBkECdSIHIAFqIgNBgICAgARJBEBB/////wMgBCACayIEQQF2IgggAyADIAhJGyAEQfz///8HTxsiAwRAIANBgICAgARPDQIgA0ECdBAKIQULIAdBAnQgBWpBACABQQJ0IgEQDSEEIAAgBSACIAYQDiIFIANBAnRqNgIIIAAgASAEajYCBCAAIAU2AgAgAgRAIAIQCAsPCxAAAAsQFQALtgMBBH8gACgCpAEiAQRAA0ACQCAAKAKsASICIAAoApABQQV0QRByIgRGIAFBAExxRQRAIAAoArABIQEgACACNgKwASAAIAIgAWtBACABGyIBNgK0ASAAIAEQSSECIAAgBDYCrAEgAEEAIAAoAqQBayIBNgKkAQwBCyAAQQA2ArQBIABBADYCpAEgAEEAEEkhAiAAKAKkASEBCyACIAMgAiADShshAyABDQALCyAAQgA3ApABIABBADYCtAEgAEIANwKsASAAQgA3AqABIABCADcCmAEgACAAKAKMATYCqAEgAEEAOgAMIABBADYCXCAAQRBqQQBByAAQDRogACgCaCIBBEAgASABKAIAKAIIEQAACyAAKAJsIgEEQCABIAEoAgAoAggRAAALIAAoAnAiAQRAIAEgASgCACgCCBEAAAsgACgCdCIBBEAgASABKAIAKAIIEQAACyAAKAJ4IgEEQCABQQA2AlQgAUH/AToACCABQf8BOgA4IAFB/wE6ACggAUH/AToAGAsgACgCfCIBBEAgARDLAQsgACgCgAEiAQRAIAEgASgCACgCCBEAAAsgAEEAOgCIAQsTACABQQF0QdDuAGpBAiAAEJABC1ABAX4CQCADQcAAcQRAIAIgA0FAaq2IIQFCACECDAELIANFDQAgAkHAACADa62GIAEgA60iBIiEIQEgAiAEiCECCyAAIAE3AwAgACACNwMIC9sBAgF/An5BASEEAkAgAEIAUiABQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AURsNACACQgBSIANC////////////AIMiBkKAgICAgIDA//8AViAGQoCAgICAgMD//wBRGw0AIAAgAoQgBSAGhIRQBEBBAA8LIAEgA4NCAFkEQEF/IQQgACACVCABIANTIAEgA1EbDQEgACAChSABIAOFhEIAUg8LQX8hBCAAIAJWIAEgA1UgASADURsNACAAIAKFIAEgA4WEQgBSIQQLIAQLUgECf0HI8gAoAgAiASAAQQdqQXhxIgJqIQACQCACQQAgACABTRsNACAAPwBBEHRLBEAgABAERQ0BC0HI8gAgADYCACABDwtBuMEBQTA2AgBBfwtvAQZ8IAErAzAhBSABKwMAIQYgASsDGCEHIAAgASsDOCABKwMIIAIrAwAiA6IgAisDCCIEIAErAyCioKAgASsDQCABKwMQIAOiIAErAyggBKKgoCIIozkDCCAAIAUgBiADoiAEIAeioKAgCKM5AwAL3wMBCn8CQAJAIAMgBEcEQCAAKAIEIgsgACgCCCIOIAJsIgwgAWpqLQAAIANHDQEgACgCgHohByAAKAKEeiIJIAI2AgAgCyAMaiINIAFqLQAAIANHDQIgCSAHQQFr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NgIMIAtBEGohAQJAIAssADtBAE4EQCABIAspAjA3AgAgASALKAI4NgIIDAELIAEgCygCMCALKAI0EBsLIAtBADoAKCALQQA6ACwgC0EAOgAcIAAoAoQBIgEgC0EMaiABKAIAKAIAEQIAIABBAToAiAECQCALLQAoRQ0AIAssACdBAE4NACALKAIcEAgLIAssABtBAEgEQCALKAIQEAgLIAssADtBAE4NACALKAIwEAgLIAsoAjwhACALQUBrJAAgAA8LEAAAC+IIAQN/IwBBIGshBCACKAIEIQUCfwJAIAEoAgQiBiAAKAIETwRAQQAgBSAGTw0CGiAEIAEoAhg2AhggBCABKQIQNwMQIAQgASkCCDcDCCAEIAEpAgA3AwAgASACKAIYNgIYIAEgAikCEDcCECABIAIpAgg3AgggASACKQIANwIAIAIgBCgCGDYCGCACIAQpAxA3AhAgAiAEKQMINwIIIAIgBCkDADcCAEEBIAEoAgQgACgCBE8NAhogBCAAKAIYNgIYIAQgACkCEDcDECAEIAApAgg3AwggBCAAKQIANwMAIAAgASgCGDYCGCAAIAEpAhA3AhAgACABKQIINwIIIAAgASkCADcCACABIAQoAhg2AhggASAEKQMQNwIQIAEgBCkDCDcCCCABIAQpAwA3AgAMAQsgBSAGSQRAIAQgACgCGDYCGCAEIAApAhA3AxAgBCAAKQIINwMIIAQgACkCADcDACAAIAIoAhg2AhggACACKQIQNwIQIAAgAikCCDcCCCAAIAIpAgA3AgAgAiAEKAIYNgIYIAIgBCkDEDcCECACIAQpAwg3AgggAiAEKQMANwIAQQEMAgsgBCAAKAIYNgIYIAQgACkCEDcDECAEIAApAgg3AwggBCAAKQIANwMAIAAgASgCGDYCGCAAIAEpAhA3AhAgACABKQIINwIIIAAgASkCADcCACABIAQoAhg2AhggASAEKQMQNwIQIAEgBCkDCDcCCCABIAQpAwA3AgBBASACKAIEIAEoAgRPDQEaIAQgASgCGDYCGCAEIAEpAhA3AxAgBCABKQIINwMIIAQgASkCADcDACABIAIoAhg2AhggASACKQIQNwIQIAEgAikCCDcCCCABIAIpAgA3AgAgAiAEKAIYNgIYIAIgBCkDEDcCECACIAQpAwg3AgggAiAEKQMANwIAC0ECCyEF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IQECQANAIAEoAgANASABQQRqIgEgA0cNAAsgAyEBCyABIAJGDQAgASADRgRAIARBADYCDAJAIAIgACgCDEcEQCACIQEMAQsgAEGAARAKIgEgAiADIAJrIgMQDiIGQYABajYCDCAAIAMgBmoiAzYCCCAAIAY2AgQgAkUNACACEAggACgCCCEDIAAoAgQhAQsgAyABayECIAEgA0YEQCAFQQEgAkECdWsgBEEMahC9AQwCCyACQQVJDQEgACABQQRqNgIIDAELIAIgASADIAFrEA4aIAUgACgCCCABa0ECdRBNCyAEQRBqJAALJQAgACgCACABEFAiAEHcCCACKgIAuxAyIABBrgggAioCBLsQMguBAgEDfwJAQShBmPAAKAIAEQEAIgJFDQAgAkIANwMIIAJCADcDACACQgA3AyAgAkIANwMYIAJCADcDECACQcAANgIMIABFDQAgAUUNACAAIAJGDQAgARArQQFqIgNBmPAAKAIAEQEAIgRFDQAgBCABIAMQESEBIAIoAgwiA0H/e3EhBAJAIANBgARxDQAgAigCICIDRQ0AIANBnPAAKAIAEQAACyACIAQ2AgwgAiABNgIgIAAoAggiAUUEQCAAIAI2AgggAkEANgIAIAIgAjYCBCACDwsgASgCBCIARQRAIAIPCyAAIAI2AgAgAiAANgIEIAEgAjYCBCACDwsgAhAxQQAL1AIEBX8DfQN+AXwgAygCBCIFIAEoAgQiB2siBCAEbCADKAIAIgYgASgCACIIayIEIARsareftiELAkAgBSACKAIEIgVrIgQgBGwgBiACKAIAIgZrIgQgBGxqt5+2IgkgBSAHayIEIARsIAYgCGsiBCAEbGq3n7YiCiAJIApdG0MAAOBBXkUNACAKIAmTi0MAAIBBXUUNACALIAogCpQgCSAJlJKRk7sgC7tEKVyPwvUovD+iIg9EAAAAAAAAEEAgD0QAAAAAAAAQQGQbY0UNACADKQIAIQ0CfiACKAIAIgQgAygCAGsgASgCBCACKAIEIgVrbCADKAIEIAVrIAEoAgAgBGtsakEASARAIAIpAgAhDCABKQIADAELIAEpAgAhDCACKQIACyEOIAAgDTcCECAAIAw3AgggACAONwIAIABBAToAGA8LIABBADoAACAAQQA6ABgLywYBEX8CQCABKAIIIgMoAgwgAygCCCIEayABKAIEKAIAIAIoAgQiBUEfdXEgBWoiBSABKAIAKAIAIAIoAgAiBkEfdXEgBmoiBiADKAIAbGoiA00NACADIARqQf8BOgAAIAEoAggiAygCDCADKAIIIgRrIAEoAgQoAgAgAigCDCIHQR91cSAHaiIHIAEoAgAoAgAgAigCCCIIQR91cSAIaiIIIAMoAgBsaiIDTQ0AIAMgBGpB/wE6AAAgASgCCCIDKAIMIAMoAggiBGsgASgCBCgCACACKAIUIglBH3VxIAlqIgkgASgCACgCACACKAIQIgpBH3VxIApqIgogAygCAGxqIgNNDQAgAyAEakH/AToAACABKAIIIgMoAgwgAygCCCIEayABKAIEKAIAIAIoAhwiC0EfdXEgC2oiCyABKAIAKAIAIAIoAhgiDEEfdXEgDGoiDCADKAIAbGoiA00NACADIARqQf8BOgAAIAEoAggiAygCDCADKAIIIgRrIAEoAgQoAgAgAigCJCINQR91cSANaiINIAEoAgAoAgAgAigCICIOQR91cSAOaiIOIAMoAgBsaiIDTQ0AIAMgBGpB/wE6AAAgASgCCCIDKAIMIAMoAggiBGsgASgCBCgCACACKAIsIg9BH3VxIA9qIg8gASgCACgCACACKAIoIhBBH3VxIBBqIhAgAygCAGxqIgNNDQAgAyAEakH/AToAACABKAIIIgMoAgwgAygCCCIEayABKAIEKAIAIAIoAjQiEUEfdXEgEWoiESABKAIAKAIAIAIoAjAiEkEfdXEgEmoiEiADKAIAbGoiA00NACADIARqQf8BOgAAIAEoAggiAygCDCADKAIIIgRrIAEoAgQoAgAgAigCPCITQR91cSATaiITIAEoAgAoAgAgAigCOCIBQR91cSABaiIBIAMoAgBsaiICTQ0AIAIgBGpB/wE6AAAgACABrSATrUIghoQ3AjggACASrSARrUIghoQ3AjAgACAQrSAPrUIghoQ3AiggACAOrSANrUIghoQ3AiAgACAMrSALrUIghoQ3AhggACAKrSAJrUIghoQ3AhAgACAIrSAHrUIghoQ3AgggACAGrSAFrUIghoQ3AgAPCxAAAAtdAQF/QQEhAQJAIAAtACQNACAALQAlDQAgAC0AKA0AIAAtACkNACAALQAqDQAgAC0AKw0AIAAtACwNACAALQAtDQAgAC0ALg0AIAAtAC8NACAALQAwQQBHIQELIAELvgIAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABKAIAQQJrDn8AEBABEBACAwUQBAUFEBAQEBAQEBAQEAYQEBAQEBAQEAgJEBAMBxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEA0ODxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQChAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBALEAsgACACOgAmDwsgACACOgAnDwsgACACOgAlDwsgACACOgApDwsgACACOgAoDwsgACACOgAkDwsgACACOgAuDwsgACACOgAwDwsgACACOgAqDwsgACACOgArDwsgACACOgAsDwsgACACOgAtDwsgACACOgAvDwsgACACOgAyDwsgACACOgAxDwsgACACOgAzCwtCAgJ9AX8CfSABKAIEIgRFBEBDAAAAAAwBCyABKAIUsyAEsyIClSEDIAEoAhCzIAKVCyECIAAgAzgCBCAAIAI4AgALHQAgAQRAIAAgASgCABBWIAAgASgCBBBWIAEQCAsLgAMBBX8jAEEQayIIJAAgAiABQX9zQe////8Hak0EQAJ/IAAtAAtBB3YEQCAAKAIADAELIAALIQkgCEEEaiAAIAFB5////wNJBH8gCCABQQF0NgIMIAggASACajYCBCMAQRBrIgIkACAIQQRqIgooAgAgCEEMaiILKAIASSEMIAJBEGokACALIAogDBsoAgAiAkELTwR/IAJBEGpBcHEiAiACQQFrIgIgAkELRhsFQQoLQQFqBUHv////BwsQPyAIKAIEIQIgCCgCCBogBARAIAIgCSAEEDMLIAYEQCACIARqIAcgBhAzCyADIAQgBWoiCmshByADIApHBEAgAiAEaiAGaiAEIAlqIAVqIAcQMwsgAUEKRwRAIAkQCAsgACACNgIAIAAgACgCCEGAgICAeHEgCCgCCEH/////B3FyNgIIIAAgACgCCEGAgICAeHI2AgggACAEIAZqIAdqIgA2AgQgCEEAOgAMIAAgAmogCC0ADDoAACAIQRBqJAAPCxAVAAvXAgMJfwF+An0jAEEwayICJAAgAiABKQIYIgs3AygCQCABKAIwIgNBAEwNACALQiCIp74hDCALp74hDQNAIA0QCyEEIAEoAhQhCSABKAIQIQUgDBALIQZBACEDAkAgBEEASA0AIAZBAEgNACAEIAUoAgQiCk4NACAGIAUoAghODQAgBSgCACAGIApsIARqQQJ0IAlqai0AACEDCyAHQf8BcSIEIANB/wFxRwRAIAghAwwCCyACIAEpAiAiCzcDECACIAs3AyAgASACQShqIgMgAkEQaiAEEK0BIAIgASkCKCILNwMIIAIgCzcDGCABIAMgAkEIaiAEEK0BIAIgASoCICACKQMoIgunvpIiDTgCKCACIAEqAiQgC0IgiKe+kiIMOAIsQQBBfyAEGyEHIAhBAWoiCCABKAIwIgNIDQALCyAAIAs3AgQgACADQQFrNgIAIAJBMGokAAtkAgF/AX4gAEHs4wA2AgAgAEEEaiIHIAI2AgggByABNgIEIAdBoOAANgIAIAAgAjYCFCAAIAE2AhAgACADKQIANwIYIAAgBCkCADcCICAFKQIAIQggACAGNgIwIAAgCDcCKCAAC+sEAQh/AkAgACgCkAEiBgRAIABBlAFqIgIgBkEDcUECdGogASACIAZBAWtBA3FBAnRqKAIAIgJrQRlsQQV1IAJqIgE2AgAMAQsgACABNgKUASAAIAE2ApwBIAAgATYCoAEgACABNgKYASABIQILIAIgAEGUAWoiBSAGQQJqQQNxQQJ0aigCACIEQQF0ayAFIAZBAWoiCUEDcUECdGooAgAiA2ohBwJAAkAgASACQQF0ayAEaiIFRQ0AIAVBAEoEQCAHQQBODQIMAQsgB0EASg0AIAAgCTYCkAEPCyAEIANrIgMgAiAEayIBIAEgA3NBAE4bIAEgASABQR91IgJzIAJrIAMgA0EfdSIBcyABa0kbIQQgACgCjAEiAiEBAkAgACgCqAEiAyACTQ0AIAAoArQBIghFDQAgBkEFdCAAKAKwAWsgA2wgCG5BA3YiASADSQRAIAMgAWsiASACSw0BCyAAIAI2AqgBIAIhAQsgASAEIARBH3UiA3MgA2siA0sNAAJAIARBAEggBEEASiAAKAKkASIBQQBKG0EBRgRAAn8gAUUEQCAAQTA2AqwBQTAhAkEwDAELIAAoArABIgEgACgCrAEiAiABGwshASAAIAI2ArABIAAgAiABayIBNgK0ASAAIAEQSRogACgCjAEhAgwBCyABIAFBH3UiCHMgCGsgA08NAQsgACAENgKkASAAIANBDmxBEGpBBXYiASACIAEgAksbNgKoAUEQQSAgBSAHRiICGyEBAkAgAg0AIAVFDQBBICAFQQV0QQFyIAUgB2ttayEBCyAAIAEgBkEFdGo2AqwBCyAAIAk2ApABC4oKAQx/IwBB4ABrIgUkAAJ/IAVB0ABqIgggAigCDCIJKAIEIgY2AgQgCCAJKAIIIgo2AgggCS0ADCIHBEAgCCAGIApsQQJ0IgYQCiIKNgIAIAogCSgCACAGEBEaIAggBzoADCAIDAELIAggCSgCADYCACAIIAc6AAwgCAshCiABQQxqIgwQtAEgAUHEAWoiDxCzASAEKAIMIgggCEEBayIJIAEiCCgCBCIBIAEgCUobIg1BAWptIQ4CQCANQQBMDQBBACEBIAhBDGohBiAEKAIAIgdBACAHQQBKGyIJIAQoAgggB2oiByAKKAIEIgsgByALSBsiB04EQANAIAYQNyAGEBQgBhAUIAYQFCAGEDcgBhAUIAYQFCAGEBQgAUEBaiIBIA1HDQAMAgsACyAEKAIEIQsDQCAGEDcgCyAOaiELIAkhAQNAIAYgCigCACAKKAIEIAtsIAFqQQJ0IANqai0AABBaIAFBAWoiASAHSA0ACyAGEBQgBhAUIAYQFCAGEDcgByEBA0AgBiAKKAIAIAFBAWsiASAKKAIEIAtsakECdCADamotAAAQWiABIAlKDQALIAYQFCAGEBQgBhAUIBBBAWoiECANRw0ACwsgBUEoaiAPIAgoAggQsAECQAJAAkACfyAFLQBMBEAgCCACIAVBKGoQtQEgAEEAOgAkIABBADoAACAFLQBMRQ0EIAAgBSgCKDYCACAAIAUoAjQ2AgwgACAFKQIsNwIEIAVBADYCNCAFQgA3AiwgAEEcaiICQQA6AAAgAEEAOgAQIAUtAERFDQIgACAFKQI4NwIQIAAgBUFAaygCADYCGCAFQThqDAELIAwQtAEgDxCzAUEAIQ0gBCgCCCIBIAFBAWsiASAIKAIEIgkgASAJSBsiC0EBam0hEAJAIAtBAEwNAEEAIQEgCEEMaiEGIAQoAgQiB0EAIAdBAEobIgkgBCgCDCAHaiIHIAooAggiDCAHIAxIGyIHTgRAA0AgBhA3IAYQFCAGEBQgBhAUIAYQNyAGEBQgBhAUIAYQFCABQQFqIgEgC0cNAAwCCwALIAooAgQhDCAKKAIAIQ4gBCgCACEEA0AgBhA3IAQgEGohBCAJIQEDQCAGIA4gASAMbCAEakECdCADamotAAAQWiABQQFqIgEgB0gNAAsgBhAUIAYQFCAGEBQgBhA3IAchAQNAIAYgDiABQQFrIgEgDGwgBGpBAnQgA2pqLQAAEFogASAJSg0ACyAGEBQgBhAUIAYQFCANQQFqIg0gC0cNAAsLIAUgDyAIKAIIELABIAVBKGogBRB3AkAgBS0AJEUNAAJAIAUtABxFDQAgBSwAG0EATg0AIAUoAhAQCAsgBSwAD0EATg0AIAUoAgQQCAsgBS0ATEUNAiAIIAIgBUEoahC1ASAAQQA6ACQgAEEAOgAAIAUtAExFDQMgACAFKAIoNgIAIAAgBSgCNDYCDCAAIAUpAiw3AgQgBUEANgI0IAVCADcCLCAAQRxqIgJBADoAACAAQQA6ABAgBS0AREUNASAAIAUpAjg3AhAgACAFQUBrKAIANgIYIAVBOGoLIgFCADcCACABQQA2AgggAkEBOgAACyAFLQBIIQEgAEEBOgAkIAAgAToAIAJAIAUtAERFDQAgBSwAQ0EATg0AIAUoAjgQCAsgBSwAN0EATg0BIAUoAiwQCAwBCyAAQQA6ACQgAEEAOgAACyAKELkBIAVB4ABqJAALnQQCBH8BfiMAQRBrIgkkAAJAAkAgAkH/P0sNACAAKAK0wwIiCkEESg0AIApBAEoEQANAAkAgACAIQcTAAGxqIgdB5MAAaiADEHANACAHQeDAAGooAgAgAkcNACAHQeAAaiABIAIQH0UNBAsgCEEBaiIIIApHDQALCyAAIApBxMAAbGoiCEHgAGogASACEBEaIAhB4MAAaiACNgIAQR8hAQJAAkACQAJAIAMgCEHkwABqIgJzQQNxDQBBASEHAkAgA0EDcUUNAANAIAIgAy0AACIHOgAAIAdFDQUgAkEBaiECIAFBAWsiAUEARyEHIANBAWoiA0EDcUUNASABDQALCyAHRQ0CIAMtAABFDQMgAUEESQ0AA0AgAygCACIHQX9zIAdBgYKECGtxQYCBgoR4cQ0CIAIgBzYCACACQQRqIQIgA0EEaiEDIAFBBGsiAUEDSw0ACwsgAUUNAQsDQCACIAMtAAAiBzoAACAHRQ0CIAJBAWohAiADQQFqIQMgAUEBayIBDQALC0EAIQELIAJBACABEA0aAkAgBEUNACAFQQFrQQdLDQAgACAKQcTAAGxqQYTBAGogBCAFEBEaCyAGKQIAIQsgCEGYwQBqIAYpAgg3AgAgCEGQwQBqIAs3AgAgCEGgwQBqQQE6AAAgACAAKAK0wwJBAWo2ArTDAgwBCyAJQYDAADYCBCAJIAI2AgBBlhkgCRAXCyAJQRBqJAALuxABCn8CQCABKAJIIgRBACAEIAMoAgAiBkcbRQRAIAEoAkwiBUUNASAFIAZGDQELIAFCADcCSEEAIQVBACEECyABQcgAaiEJIAFBzABqIQoCf0EAIAQgBXJFDQAaIAIoAgRBA3QiBSABKAJYIghBB2xPBEAgBCAFIAhBCWxNDQEaCyAKQQA2AgAgCUEANgIAQQALIQcCQAJAAkACQAJAAkACQAJAAkAgBkUNACADLQAEBEAgA0EAOgAEIAZBAXYiBEH/AXEEQCAGIQUDQCACIATAai0ACEEPcSEHIAVBAWsiBcAhCAJAIAooAgBFDQAgASAIai0AXCAHRg0AIApBADYCACAJQQA2AgALIAEgCGogBzoAXCAEQQFrIgRB/wFxDQALIAkoAgAhBwsgCiAGNgIAIAYgB3EhBgwDCwJAAkAgBkEIaw4GAAMBAQEAAQsgBkEBdiEFIAZBF3RBgICABGtBGHYhBwNAIAchBCACIAXAai0ACEEPcSEHAkAgCSgCAEUNACABIARqLQBcIAdGDQAgCkEANgIAIAlBADYCAAsgASAEaiAHOgBcIARBAWshByAFQQFrIQUgBEEASg0ACyAKKAIAIQQgCSAGNgIAIAQgBnEhBgwDCyAGwEEATA0AIAZB/wFxIgVBAWshCAJAIAZBA3EiC0UEQCAFIQQMAQtBACEHA0AgASAFQQFrIgRqIAIgBWotAAhBD3E6AFwgBCEFIAdBAWoiByALRw0ACwsgCEEDSQ0AIAFB3ABqIQUgAkEIaiEHA0AgBSAEQQFrIghqIAQgB2otAABBD3E6AAAgBSAEQQJrIgtqIAcgCGotAABBD3E6AAAgBSAEQQNrIghqIAcgC2otAABBD3E6AAAgBSAEQQRrIgRqIAcgCGotAABBD3E6AAAgCEEBSw0ACwsgCSAGNgIADAILIAEgAi0ACDoAaCACLQAOIQQgAUEAOwFcIAEgAi0ACUEPcToAXiABIAItAApBD3E6AF8CQAJAAkACQCAEQQ9xIgRBA08EQCABIAItAAtBD3E6AGAgBEEDRg0CIAEgAi0ADEEPcToAYSAEQQRLDQEgAUEAOgBmIAFBADYBYgwDCyABQQA2AGEgASAEOgBgIAEgAi0AC0EPcToAZSABIAItAAxBD3E6AGYMAgsgAi0ADSEFIAFBADYAYyABIAVBD3E6AGIMAgsgAUEAOgBlIAFBADYAYSABIAItAAxBD3E6AGYLIAItAA1BD3EhBAsgASAEOgBnIAEgAigCBDYCWEEJIQYMAgsgAyAGNgIACyABIAIoAgQ2AlggBkUEQCADQQA6AAQgA0EBNgIADAULIAZBe3FBCUcNAQsgAS0AaEEKIAEtAGciBUEBdCAFIAEtAGYgAS0AZSIHQQF0IAcgAS0AZCABLQBjIghBAXQgCCABLQBiIAEtAGEiC0EBdCALIAEtAGAgAS0AXyIMQQF0IAwgAS0AXiABLQBdIg1BAXQgDSABLQBcIgRBCmsgBCAEQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLG2oiBEEKayAEIARB/wFxQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLG2oiBEEKayAEIARB/wFxQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLG2oiBEEKayAEIARB/wFxQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLG2oiBEEKayAEIARB/wFxQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLG2oiBEEKayAEIARB/wFxQQlLG2pqIgRBFGsgBCAEQf8BcUETSxsiBEEKayAEIARB/wFxQQlLGyIEa0EAIARB/wFxG0H/AXFHDQEMAgsgBkEIRw0BIAEtAGNBCiABLQBiIgJBAXQgAiABLQBhIAEtAGAiBEEBdCAEIAEtAF8gAS0AXiIFQQF0IAUgAS0AXSABLQBcQQNsIgFBFGsgASABQf8BcUETSxsiAUEKayABIAFB/wFxQQlLG2oiAUEKayABIAFB/wFxQQlLG2pqIgFBFGsgASABQf8BcUETSxsiAUEKayABIAFB/wFxQQlLG2oiAUEKayABIAFB/wFxQQlLG2pqIgFBFGsgASABQf8BcUETSxsiAUEKayABIAFB/wFxQQlLG2oiAUEKayABIAFB/wFxQQlLG2pqIgFBFGsgASABQf8BcUETSxsiAUEKayABIAFB/wFxQQlLGyIBa0EAIAFB/wFxG0H/AXFGDQILIAkgCiAKKAIAG0EANgIAIANBADoABCADQQA2AgAMAQsCQAJAIAZBCWsOBQECAgIAAgsCQCABLQBcIgINACABLQBzRQ0AIANBADoABCADQQw2AgAMAgsgAkEJRw0BIAEtAF1BB0cNAQJAIAEtAF4iAkH+AXFBCEcNACABLQB1RQ0AIANBADoABCADQQ42AgAMAgsgAkEIRw0BIAEtAHRFDQEgA0EAOgAEIANBCjYCAAwBCyABLQByBEAgAUEAOwFcIAEgAi0ACUEPcToAXiABIAItAApBD3E6AF8gASACLQALQQ9xOgBgIAEgAi0ADEEPcToAYSABIAItAA1BD3E6AGIgASACLQAOQQ9xOgBjIAEgAi0ACEEPcToAZAwBCyABLQBzBEAgA0EAOgAEIANBDDYCAAwBCyABLQBuBEAgA0EAOgAEIANBDTYCAAwBCyADQQA6AAQgA0EANgIACyAAIAMpAgA3AgALvhECDX8BfiMAQRBrIgwkACACIAItAAAiB0EBaiIDOgAAIANBP3EhBgJAAkAgASgCBCIOLQAMIgpBAXENACADQcAAcQRAAkAgBkEhRiIFRSAGQQlHcQ0AIA5BGGoiBCAKQQ9xQQJ0aigCACEJIAQgCkEMakEPcUECdGooAgAhCyAEIApBDWpBD3FBAnRqKAIAIQggBCAKQQ5qQQ9xQQJ0aigCACENIAQgCkEBa0EPcUECdGooAgAhBCAAQQA6AAQgACAJBH8gCSALIAggBCANampqQQNsQQJ2TwVBAQsiBDYCAAJAIAACfgJAIARFDQAgBkEJRw0AQgAgAS0AcUUNARogAi0ACiIFQQR2QQFxIAItAAkiBEEDdkECcXIgBEEBdCAFakF/c0EDcUatQgGGDAELIARFDQFCACABLQBwRQ0AGkIFQgAgAi0ACyIFQQ9xIAItAAkiBEEPcWogAi0ADSIJQQ9xaiACLQAMIgtBD3EgAi0ACiIIQQ9xakEDbGpBA2xBCnAgC0EDdkECcSAFQQJ2QQRxIAhBAXZBCHEgBEEQcXJyckEBdkGw3QBqLQAAIgVBBHYgBSAJQQR2QQFxG0EPcUYbCyIQNwIAIAZBIUYgEEIAUnIhBQsgBUUNACABQQA2AlAgAkH/AToAAAwDCyADQQdxQQFHDQEgAiAHQQNqIgM6AAAgBkECaiEGDAELIANBAXEhBQJAIANBPnEiBEEQRw0AIAEtAG9FDQAgASAFEMcBDQECQAJAAkAgAi0ADCIKQQR2QQFxIAItAAsiBEEDdkECcSACLQAKIglBAnZBBHEgAi0ACSIHQQF2QQhxcnJyIgYOEAEAAAAAAAAAAAAAAAAAAAEACyAAQgA3AgAMAQsgBUUgBkVHBEAgAiAHOgAMIAIgCjoACSACIAk6AAsgAiAEOgAKIANBgH9yIQMLIABCCEKIgICAECAGGzcCACABIANBgAFxQQd2NgJQCyACQf8BOgAADAILIARBGEcNACAAQgA3AgACQCABIAUQxwENACACLQANQf8BRg0AIAItAA4hBiACLQAKIQogAi0ACSEEIAICfyAFBEAgBkEEdkEBcSACLQANIglBA3ZBAnEgAi0ADCIHQQJ2QQRxIAItAAsiC0EBdkEIcSAEQQF0QSBxIApBEHFycnJycgwBCyAGQQF0QSBxIAItAA0iCUEQcSACLQAMIgdBAXZBCHEgAi0ACyILQQJ2QQRxIApBA3ZBAnEgBEEEdkEBcXJycnJyCyIDQQF2QbDdAGotAAAiDkEEdiAOIANBAXEbQQ9xIg46AAgCQCAOQQ9GBEAgDEEAOgAMIAxBADYCCAwBCyAFIANFRgRAIAIgBDoADiACIAY6AAkgAiAKOgANIAIgCToACiACIAs6AAwgAiAHOgALIAIgAi0AAEGAAXI6AAALAkAgAS0AbkUEQCADQQV2IQUMAQsgA0UEQCAMQQE6AAwgDEENNgIIDAILQQAhBSADQSBxRQ0AIAxBADoADCAMQQ02AggMAQsCQCADRQ0AIAUNACAMQQA6AAwgDEEJNgIIDAELIAxBADoADCAMQQA2AggLIAAgDCkDCCIQNwIAIBCnRQ0AIAEgAi0AAEEHdjYCUAsgAkH/AToAAAwBCwJAIAYgA0EGdkEBcXYiBkEUSw0AIAZBA3ENACABKAJUIglFBEAgAEEAOgAEIABBADYCAAwCCyACKAIEIQdB/wEhBQJAAkACQCADQf8BcUUEQAJ/Qf8BIQsCQCABKAJUIgZBBkkNACABKAIEIgRBGGoiCCAELQAMIgNBCmpBD3FBAnRqKAIAIg0gCCADQQtqQQ9xQQJ0aigCACIIakEObEEBciAGbkH9A2pB/gNxDQBBfyAEIANBDGpBD3FBAnRqKAIYIAhqQQ5sQQFyIAZuQf0DakEBdkH/AXEiCCAIQQRPGyEIAkAgA0EBcQRAIAQgA0EJakEPcUECdGooAhgiA0EAIAMgBkEDbEECdk0bRQRAIAhB/wFxIgNFDQJBwAAhCyADQQFGDQMLQX8MAwsgCEH/AXENASAEIANBCWpBD3FBAnRqKAIYIgggDWpBDmxBAXIgBm5B/QNqQf4DcQ0BIAQgA0EIakEPcUECdGooAhggCGpBDmxBAXIgBm5B/QNqQf4DcQ0BC0EAIQsLIAvACyEDIAIgCTYCBCACIAM6AAAgA0EATg0BIABBADoABCAAQQA2AgAMBQsgCUEDdCIEIAdBB2xJDQIgBCAHQQlsSw0CIAIgCUEDbCAHakECdjYCBAwBCyADQT9xIQYgB0UNAQsCfwJ/IAEoAgQiBC0ADCIFQQFxIgsEQCAFQQ5qQQ9xIQggBEEYaiIHIAVBAWtBD3EiDUECdGooAgAgByAFQQ9xQQJ0aigCAGoMAQsgBUEBa0EPcSENIARBGGoiByAFQQ1qQQ9xQQJ0aigCACAHIAVBDmpBD3EiCEECdGooAgBqCyEPAn9B/wEgASgCVCIHQQZJDQAaQf8BQX8gBEEYaiIBIAhBAnRqKAIAIgggASANQQJ0aigCACINakEObEEBciAHbkH9A2pBAXZB/wFxIgEgAUEETxtBfCAPQQ5sQQFyIAduQf0DakEBdkH/AXEiAUECdCABQQRPG3IiAUGAAXENABogAcBBASABdCIPQeAMcUUNARogAUEBdkEDcUEQciABIAQgBSAFQQ1qIAsbQQ9xQQJ0aigCGCAIIA0gCxtqQQdsQQNBBCAPQaAIcRsgB2xLGwvACyEFCwJAIAZBEEcgBcAiAUEASHFFBEAgBkUNASADQcAAcUUNASAOQRhqIgMgCkELakEPcUECdGooAgAgAyAKQQxqQQ9xQQJ0aigCAGpBDmxBAXIgCW5B/QNqQf4DcUUNAQsgAkH/AToAAAwBCyABQQBIBEAgAkH/AToADQwBCyAGQQJ2IAJqIAVB/wFxQZDdAGotAAA6AAkLIABBADoABCAAQQA2AgALIAxBEGokAAsNACAAKAIAIAEgAhAyC8oEAQd/IAMgAmsiB0EATARADwsCQCAAKAIIIgQgACgCBCIIayAHTgRAIAggAWsiCSAHTgRAIAghBSADIQYMAgsgCCEFIAMgAiAJaiIGRwRAIAYhBANAIAUgBC0AADoAACAFQQFqIQUgBEEBaiIEIANHDQALCyAAIAU2AgQgCUEASg0BDwsgCCAAKAIAIgprIAdqIgZBAE4EQCABIAprIQkgCUH/////ByAEIAprIgVBAXQiBCAGIAQgBksbIAVB/////wNPGyIFBH8gBRAKBUEACyIEaiEGIAIgA0cEQCAGIAIgBxARIAdqIQYLIAQgCiAJEA4hAyAGIAEgCCABayICEA4hASAAIAQgBWo2AgggACABIAJqNgIEIAAgAzYCACAKBEAgChAICw8LEAAACyAIIAUiBCAHayIDSwRAA0AgBCADLQAAOgAAIARBAWohBCADQQFqIgMgCEkNAAsLIAAgBDYCBCABIAdqIgAgBUcEQCAFIAUgAGsiAGsgASAAEA4aCyACIAZGBEAPCyACQX9zIAZqIQUCQCAGIAJrQQdxIgBFBEAgASEEDAELQQAhAyABIQQDQCAEIAItAAA6AAAgBEEBaiEEIAJBAWohAiADQQFqIgMgAEcNAAsLIAVBB0kEQA8LA0AgBCACLQAAOgAAIAQgAi0AAToAASAEIAItAAI6AAIgBCACLQADOgADIAQgAi0ABDoABCAEIAItAAU6AAUgBCACLQAGOgAGIAQgAi0ABzoAByAEQQhqIQQgAkEIaiICIAZHDQALC6UwAxV/BX4DfCMAQeAAayILJAACQCAARQ0AIAFFDQACQAJAAkACQAJAAkACQAJAAkACQCAALQAMIgRBAWsOQAIDCgEKCgoECgoKCgoKCgYKCgoKCgoKCgoKCgoKCgoHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCggACyAEQYABRg0EDAkLIAFBBRAlIgBFDQggAEGlDS0AADoABCAAQaENKAAANgAADAcLIAFBBhAlIgBFDQcgAEG1Di8AADsABCAAQbEOKAAANgAADAYLIAFBBRAlIgBFDQYgAEGwDi0AADoABCAAQawOKAAANgAADAULIAArAxghHCALQQA7AVggC0IANwNQIAtCADcDSCALQgA3A0AgC0IANwM4AkAgHL1CgICAgICAgPj/AINCgICAgICAgPj/AFEEQCALQaUNLQAAOgBEIAtBoQ0oAAA2AkBBBCEADAELAkAgACgCFCIAtyAcYQRAIAsgADYCACALQUBrQc8PIAsQpwEhAAwBCyALIBw5AzAgC0FAayIGQZwOIAtBMGoQpgEhACALIAtBOGo2AiAjAEEQayIVJAAgFSALQSBqIhM2AgwjAEGQAWsiBCQAIARBAEGQARANIgNBfzYCTCADIAY2AiwgA0HzADYCICADIAY2AlRBACEGQZEOIQcjAEGwAmsiCiQAIAMoAkwaAkACQAJAAkAgAygCBA0AIAMQpQEaIAMoAgQNAAwBC0GRDi0AACIERQ0CAkACQAJAAkADQAJAAkAgBEH/AXEiBEEgRiAEQQlrQQVJcgRAA0AgByIEQQFqIQcgBC0AASICQSBGIAJBCWtBBUlyDQALIANCABAtA0ACfyADKAIEIgIgAygCaEcEQCADIAJBAWo2AgQgAi0AAAwBCyADEA8LIgJBIEYgAkEJa0EFSXINAAsgAygCBCEHIAMpA3BCAFkEQCADIAdBAWsiBzYCBAsgByADKAIsa6wgAykDeCAafHwhGgwBCwJ/AkACQCAHLQAAQSVGBEAgBy0AASIEQSpGDQEgBEElRw0CCyADQgAQLQJAIActAABBJUYEQANAAn8gAygCBCIEIAMoAmhHBEAgAyAEQQFqNgIEIAQtAAAMAQsgAxAPCyIEQSBGIARBCWtBBUlyDQALIAdBAWohBwwBCyADKAIEIgQgAygCaEcEQCADIARBAWo2AgQgBC0AACEEDAELIAMQDyEECyAHLQAAIARHBEAgAykDcEIAWQRAIAMgAygCBEEBazYCBAsgBEEATg0NQQAhBSASDQ0MCwsgAygCBCADKAIsa6wgAykDeCAafHwhGiAHIQQMAwtBACEOIAdBAmoMAQsCQCAEQTBrQQpPDQAgBy0AAkEkRw0AIActAAFBMGshBCMAQRBrIgIgEzYCDCACIBMgBEECdEEEa0EAIARBAUsbaiIEQQRqNgIIIAQoAgAhDiAHQQNqDAELIBMoAgAhDiATQQRqIRMgB0EBagshBEEAIQxBACEHIAQtAABBMGtBCkkEQANAIAQtAAAgB0EKbGpBMGshByAELQABIQIgBEEBaiEEIAJBMGtBCkkNAAsLIAQtAAAiD0HtAEcEfyAEBUEAIQ0gDkEARyEMIAQtAAEhD0EAIQYgBEEBagsiAkEBaiEEQQMhCCAMIQUCQAJAAkACQAJAAkAgD0HBAGsOOgQMBAwEBAQMDAwMAwwMDAwMDAQMDAwMBAwMBAwMDAwMBAwEBAQEBAAEBQwBDAQEBAwMBAIEDAwEDAIMCyACQQJqIAQgAi0AAUHoAEYiAhshBEF+QX8gAhshCAwECyACQQJqIAQgAi0AAUHsAEYiAhshBEEDQQEgAhshCAwDC0EBIQgMAgtBAiEIDAELQQAhCCACIQQLQQEgCCAELQAAIgJBL3FBA0YiBRshEAJAIAJBIHIgAiAFGyIRQdsARg0AAkAgEUHuAEcEQCARQeMARw0BQQEgByAHQQFMGyEHDAILIA4gECAaEJgBDAILIANCABAtA0ACfyADKAIEIgIgAygCaEcEQCADIAJBAWo2AgQgAi0AAAwBCyADEA8LIgJBIEYgAkEJa0EFSXINAAsgAygCBCECIAMpA3BCAFkEQCADIAJBAWsiAjYCBAsgAiADKAIsa6wgAykDeCAafHwhGgsgAyAHrCIXEC0CQCADKAIEIgIgAygCaEcEQCADIAJBAWo2AgQMAQsgAxAPQQBIDQYLIAMpA3BCAFkEQCADIAMoAgRBAWs2AgQLQRAhAgJAAkACQAJAAkACQAJAAkACQAJAIBFB2ABrDiEGCQkCCQkJCQkBCQIEAQEBCQUJCQkJCQMGCQkCCQQJCQYACyARQcEAayICQQZLDQhBASACdEHxAHFFDQgLIApBCGogAyAQQQAQoQEgAykDeEIAIAMoAgQgAygCLGusfVINBQwMCyARQRByQfMARgRAIApBIGpBf0GBAhANGiAKQQA6ACAgEUHzAEcNBiAKQQA6AEEgCkEAOgAuIApBADYBKgwGCyAKQSBqIAQtAAEiAkHeAEYiBUGBAhANGiAKQQA6ACAgBEECaiAEQQFqIAUbIQkCfwJAAkAgBEECQQEgBRtqLQAAIgRBLUcEQCAEQd0ARg0BIAJB3gBHIQggCQwDCyAKIAJB3gBHIgg6AE4MAQsgCiACQd4ARyIIOgB+CyAJQQFqCyEEA0ACQCAELQAAIgJBLUcEQCACRQ0PIAJB3QBGDQgMAQtBLSECIAQtAAEiBUUNACAFQd0ARg0AIARBAWohCQJAIAUgBEEBay0AACIETQRAIAUhAgwBCwNAIARBAWoiBCAKQSBqaiAIOgAAIAQgCS0AACICSQ0ACwsgCSEECyACIApqIAg6ACEgBEEBaiEEDAALAAtBCCECDAILQQohAgwBC0EAIQILQgAhF0EAIQlBACEIQQAhDyMAQRBrIgckAAJAIAJBAUcgAkEkTXFFBEBBuMEBQRw2AgAMAQsDQAJ/IAMoAgQiBSADKAJoRwRAIAMgBUEBajYCBCAFLQAADAELIAMQDwsiBUEgRiAFQQlrQQVJcg0ACwJAAkAgBUEraw4DAAEAAQtBf0EAIAVBLUYbIQ8gAygCBCIFIAMoAmhHBEAgAyAFQQFqNgIEIAUtAAAhBQwBCyADEA8hBQsCQAJAAkACQAJAIAJBAEcgAkEQR3ENACAFQTBHDQACfyADKAIEIgUgAygCaEcEQCADIAVBAWo2AgQgBS0AAAwBCyADEA8LIgVBX3FB2ABGBEBBECECAn8gAygCBCIFIAMoAmhHBEAgAyAFQQFqNgIEIAUtAAAMAQsgAxAPCyIFQcHqAGotAABBEEkNAyADKQNwQgBZBEAgAyADKAIEQQFrNgIECyADQgAQLQwGCyACDQFBCCECDAILIAJBCiACGyICIAVBweoAai0AAEsNACADKQNwQgBZBEAgAyADKAIEQQFrNgIECyADQgAQLUG4wQFBHDYCAAwECyACQQpHDQAgBUEwayIJQQlNBEBBACECA0AgAkEKbCAJaiICQZmz5swBSQJ/IAMoAgQiBSADKAJoRwRAIAMgBUEBajYCBCAFLQAADAELIAMQDwsiBUEwayIJQQlNcQ0ACyACrSEXCwJAIAlBCUsNACAXQgp+IRggCa0hGQNAIBggGXwhFwJ/IAMoAgQiAiADKAJoRwRAIAMgAkEBajYCBCACLQAADAELIAMQDwsiBUEwayIJQQlLDQEgF0Kas+bMmbPmzBlaDQEgF0IKfiIYIAmtIhlCf4VYDQALQQohAgwCC0EKIQIgCUEJTQ0BDAILIAIgAkEBa3EEQCAFQcHqAGotAAAiCCACSQRAA0AgAiAJbCAIaiIJQcfj8ThJAn8gAygCBCIFIAMoAmhHBEAgAyAFQQFqNgIEIAUtAAAMAQsgAxAPCyIFQcHqAGotAAAiCCACSXENAAsgCa0hFwsgAiAITQ0BIAKtIRgDQCAXIBh+IhkgCK1C/wGDIhtCf4VWDQIgGSAbfCEXIAICfyADKAIEIgUgAygCaEcEQCADIAVBAWo2AgQgBS0AAAwBCyADEA8LIgVBweoAai0AACIITQ0CIAcgGEIAIBdCABAcIAcpAwhQDQALDAELIAJBF2xBBXZBB3FBwewAaiwAACEUIAVBweoAai0AACIJIAJJBEADQCAIIBR0IAlyIghBgICAwABJAn8gAygCBCIFIAMoAmhHBEAgAyAFQQFqNgIEIAUtAAAMAQsgAxAPCyIFQcHqAGotAAAiCSACSXENAAsgCK0hFwsgAiAJTQ0AQn8gFK0iGIgiGSAXVA0AA0AgCa1C/wGDIBcgGIaEIRcgAgJ/IAMoAgQiBSADKAJoRwRAIAMgBUEBajYCBCAFLQAADAELIAMQDwsiBUHB6gBqLQAAIglNDQEgFyAZWA0ACwsgAiAFQcHqAGotAABNDQADQCACAn8gAygCBCIFIAMoAmhHBEAgAyAFQQFqNgIEIAUtAAAMAQsgAxAPC0HB6gBqLQAASw0AC0G4wQFBxAA2AgBBACEPQn8hFwsgAykDcEIAWQRAIAMgAygCBEEBazYCBAsCQCAXQn9SDQALIBcgD6wiGIUgGH0hFwsgB0EQaiQAIAMpA3hCACADKAIEIAMoAixrrH1RDQcCQCARQfAARw0AIA5FDQAgDiAXPgIADAMLIA4gECAXEJgBDAILIA5FDQEgCikDECEXIAopAwghGAJAAkACQCAQDgMAAQIECyMAQSBrIgIkAAJAIBdC////////////AIMiGUKAgICAgIDAwD99IBlCgICAgICAwL/AAH1UBEAgF0IZiKchBSAYUCAXQv///w+DIhlCgICACFQgGUKAgIAIURtFBEAgBUGBgICABGohDAwCCyAFQYCAgIAEaiEMIBggGUKAgIAIhYRCAFINASAMIAVBAXFqIQwMAQsgGFAgGUKAgICAgIDA//8AVCAZQoCAgICAgMD//wBRG0UEQCAXQhmIp0H///8BcUGAgID+B3IhDAwBC0GAgID8ByEMIBlC////////v7/AAFYNAEEAIQwgGUIwiKciBUGR/gBJDQAgAkEQaiAYIBdC////////P4NCgICAgICAwACEIhkgBUGB/gBrEB0gAiAYIBlBgf8AIAVrEDkgAikDCCIYQhmIpyEMIAIpAwAgAikDECACKQMYhEIAUq2EIhlQIBhC////D4MiGEKAgIAIVCAYQoCAgAhRG0UEQCAMQQFqIQwMAQsgGSAYQoCAgAiFhEIAUg0AIAxBAXEgDGohDAsgAkEgaiQAIA4gDCAXQiCIp0GAgICAeHFyNgIADAMLIA4gGCAXEGg5AwAMAgsgDiAYNwMAIA4gFzcDCAwBC0EfIAdBAWogEUHjAEciFBshCAJAIBBBAUYEQCAOIQIgDARAIAhBAnQQLyICRQ0HCyAKQgA3AqgCQQAhBwNAIAIhBgJAA0ACfyADKAIEIgIgAygCaEcEQCADIAJBAWo2AgQgAi0AAAwBCyADEA8LIgIgCmotACFFDQEgCiACOgAbAn8gCkEcaiENIApBqAJqIgJB+MIBIAIbIhAoAgAhAgJAAn8CQCAKQRtqIglFBEAgAg0BQQAMBAsCQCACBEBBASEPDAELIAktAAAiAsAiBUEATgRAIA0EQCANIAI2AgALIAVBAEcMBQtB1MIBKAIAKAIARQRAQQEgDUUNAxogDSAJLAAAQf+/A3E2AgBBAQwFCyAJLQAAQcIBayICQTJLDQEgAkECdEHQ7ABqKAIAIQJBACIPRQ0DIAlBAWohCQsgCS0AACIFQQN2IhZBEGsgAkEadSAWanJBB0sNAANAIA9BAWshDyAFQYABayACQQZ0ciICQQBOBEAgEEEANgIAIA0EQCANIAI2AgALQQEgD2sMBQsgD0UNAyAJQQFqIgktAAAiBUHAAXFBgAFGDQALCyAQQQA2AgBBuMEBQRk2AgBBfwsMAQsgECACNgIAQX4LIgJBfkYNAEEAIQ0gAkF/Rg0LIAYEQCAGIAdBAnRqIAooAhw2AgAgB0EBaiEHCyAMRQ0AIAcgCEcNAAtBASEFIAYgCEEBdEEBciIIQQJ0EEsiAg0BDAsLC0EAIQ0gBiEIIApBqAJqBH8gCigCqAIFQQALDQgMAQsgDARAQQAhByAIEC8iAkUNBgNAIAIhBgNAAn8gAygCBCICIAMoAmhHBEAgAyACQQFqNgIEIAItAAAMAQsgAxAPCyICIApqLQAhRQRAQQAhCCAGIQ0MBAsgBiAHaiACOgAAIAdBAWoiByAIRw0AC0EBIQUgBiAIQQF0QQFyIggQSyICDQALIAYhDUEAIQYMCQtBACEHIA4EQANAAn8gAygCBCIGIAMoAmhHBEAgAyAGQQFqNgIEIAYtAAAMAQsgAxAPCyIGIApqLQAhBEAgByAOaiAGOgAAIAdBAWohBwwBBUEAIQggDiIGIQ0MAwsACwALA0ACfyADKAIEIgYgAygCaEcEQCADIAZBAWo2AgQgBi0AAAwBCyADEA8LIApqLQAhDQALQQAhBkEAIQ1BACEICyADKAIEIQIgAykDcEIAWQRAIAMgAkEBayICNgIECyADKQN4IAIgAygCLGusfCIYUA0CIBQgFyAYUXJFDQIgDARAIA4gBjYCAAsCQCARQeMARg0AIAgEQCAIIAdBAnRqQQA2AgALIA1FBEBBACENDAELIAcgDWpBADoAAAsgCCEGCyADKAIEIAMoAixrrCADKQN4IBp8fCEaIBIgDkEAR2ohEgsgBEEBaiEHIAQtAAEiBA0BDAgLCyAIIQYMAQtBASEFQQAhDUEAIQYMAgsgDCEFDAMLIAwhBQsgEg0BC0F/IRILIAVFDQAgDRAIIAYQCAsgCkGwAmokACADQZABaiQAIBVBEGokACASQQFGBEAgCysDOCIdIByhmSAdmSIdIByZIh4gHSAeZBtEAAAAAAAAsDyiZQ0BCyALIBw5AxAgC0FAa0GVDiALQRBqEKYBIQALQQAhBiAAQRlLDQYLIAEgAEEBahAlIgZFBEBBACEGDAYLIAAEQCAGIAtBQGsgABARGgsgACAGakEAOgAAIAEgASgCCCAAajYCCAwECyAAKAIQIgRFDQQgASAEECtBAWoiARAlIgRFDQQgBCAAKAIQIAEQERoMAwsgACgCECABEIQBIQYMAwsgACgCCCEAIAFBARAlIgZFBEBBACEGDAMLIAZB2wA6AAAgASABKAIIQQFqNgIIIAEgASgCDEEBajYCDAJAIABFDQBBACEGA0AgACABEGFFDQQgASgCACIEBEAgASAEIAEoAggiAmoQKyACajYCCAsgACgCAEUNASABQQJBASABKAIUGyICQQFqECUiBEUNBCAEQSw6AAAgASgCFAR/IARBIDoAASAEQQJqBSAEQQFqC0EAOgAAIAEgASgCCCACajYCCCAAKAIAIgANAAsLQQAhBiABQQIQJSIARQ0CIABB3QA7AAAgASABKAIMQQFrNgIMDAELIAAoAgghBCABQQJBASABKAIUGyIGQQFqECUiAEUEQEEAIQYMAgsgAEH7ADoAACABIAEoAgxBAWo2AgwgASgCFARAIABBCjoAAQsgASABKAIIIAZqNgIIIAQEQANAIAEoAhQEQCABIAEoAgwQJSIGRQRAQQAhBgwFC0EAIQBBACECIAEoAgwEQANAIAZBCToAACAGQQFqIQYgAEEBaiIAIAEoAgwiAkkNAAsLIAEgASgCCCACajYCCAtBACEGIAQoAiAgARCEAUUNAyABKAIAIgAEQCABIAAgASgCCCICahArIAJqNgIICyABQQJBASABKAIUGyICECUiAEUNAyAAQTo6AAAgASgCFARAIABBCToAAQsgASABKAIIIAJqNgIIIAQgARBhRQ0DIAEoAgAiAARAIAEgACABKAIIIgZqECsgBmo2AggLQQAhBiABIAQoAgBBAEcgASgCFEEAR2oiAkEBahAlIgBFDQMgBCgCAARAIABBLDoAACAAQQFqIQALIAEoAhQEfyAAQQo6AAAgAEEBagUgAAtBADoAACABIAEoAgggAmo2AgggBCgCACIEDQALC0EAIQYgASABKAIUBH8gASgCDEEBagVBAgsQJSIARQ0BAkAgASgCFEUNACABKAIMQQFGDQADQCAAQQk6AAAgAEEBaiEAIAZBAWoiBiABKAIMQQFrSQ0ACwsgAEH9ADsAACABIAEoAgxBAWs2AgwLQQEhBgsgC0HgAGokACAGCxsAIAAgAUHAhD1uIgAQOCABIABBwIQ9bGsQYwsbACAAIAFBkM4AbiIAEDggASAAQZDOAGxrEGQLGQAgACABQeQAbiIAEDggASAAQeQAbGsQOAvyBQEIfyMAQSBrIgckACAHQQxqIQQCQCAHQRVqIgYiAiAHQSBqIglGDQAgAUEATg0AIAJBLToAACACQQFqIQJBACABayEBCyAEAn8gCSIDIAJrIgVBCUwEQEE9IAVBICABQQFyZ2tB0QlsQQx1IgggCEECdEGg7gBqKAIAIAFNakgNARoLAn8gAUG/hD1NBEAgAUGPzgBNBEAgAUHjAE0EQCABQQlNBEAgAiABQTBqOgAAIAJBAWoMBAsgAiABEDgMAwsgAUHnB00EQCACIAFB5ABuIgNBMGo6AAAgAkEBaiABIANB5ABsaxA4DAMLIAIgARBkDAILIAFBn40GTQRAIAIgAUGQzgBuIgNBMGo6AAAgAkEBaiABIANBkM4AbGsQZAwCCyACIAEQYwwBCyABQf/B1y9NBEAgAUH/rOIETQRAIAIgAUHAhD1uIgNBMGo6AAAgAkEBaiABIANBwIQ9bGsQYwwCCyACIAEQYgwBCyABQf+T69wDTQRAIAIgAUGAwtcvbiIDQTBqOgAAIAJBAWogASADQYDC1y9saxBiDAELIAIgAUGAwtcvbiIDEDggASADQYDC1y9saxBiCyEDQQALNgIEIAQgAzYCACAHKAIMIQgjAEEQayIDJAAjAEEQayIFJAAgACEBAkAgCCAGIgBrIgZB7////wdNBEACQCAGQQtJBEAgASABLQALQYABcSAGcjoACyABIAEtAAtB/wBxOgALIAEhBAwBCyAFQQhqIAEgBkELTwR/IAZBEGpBcHEiBCAEQQFrIgQgBEELRhsFQQoLQQFqED8gBSgCDBogASAFKAIIIgQ2AgAgASABKAIIQYCAgIB4cSAFKAIMQf////8HcXI2AgggASABKAIIQYCAgIB4cjYCCCABIAY2AgQLA0AgACAIRwRAIAQgAC0AADoAACAEQQFqIQQgAEEBaiEADAELCyAFQQA6AAcgBCAFLQAHOgAAIAVBEGokAAwBCxAVAAsgA0EQaiQAIAkkAAuLBAEIfyMAQRBrIgQkACAEIAE6AA8CQAJAAn8gAC0AC0EHdiICRQRAQQohASAALQALQf8AcQwBCyAAKAIIQf////8HcUEBayEBIAAoAgQLIgUgAUYEQCMAQRBrIgIkAAJAIAFB7////wdHBEACfyAALQALQQd2BEAgACgCAAwBCyAACyEGIAJBBGogACABQef///8DSQR/IAIgAUEBdDYCDCACIAFBAWo2AgQjAEEQayIDJAAgAkEEaiIHKAIAIAJBDGoiCCgCAEkhCSADQRBqJAAgCCAHIAkbKAIAIgNBC08EfyADQRBqQXBxIgMgA0EBayIDIANBC0YbBUEKC0EBagVB7////wcLED8gAigCBCEDIAIoAggaIAEEQCADIAYgARAzCyABQQpHBEAgBhAICyAAIAM2AgAgACAAKAIIQYCAgIB4cSACKAIIQf////8HcXI2AgggACAAKAIIQYCAgIB4cjYCCCACQRBqJAAMAQsQFQALAn8gAC0AC0EHdgRAIAAoAgAMAQtBAAsaDAELAn8gAC0AC0EHdgRAIAAoAgAMAQtBAAsaIAINACAAIgEgBUEBaiAALQALQYABcXI6AAsgACAALQALQf8AcToACwwBCyAAKAIAIQEgACAFQQFqNgIECyABIAVqIgAgBC0ADzoAACAEQQA6AA4gACAELQAOOgABIARBEGokAAv+AQEEfwJ/IAEQKyECIwBBEGsiBSQAAn8gAC0AC0EHdgRAIAAoAgQMAQsgAC0AC0H/AHELIgRBAE8EQAJAIAIgAC0AC0EHdgR/IAAoAghB/////wdxQQFrBUEKCyIDIARrTQRAIAJFDQECfyAALQALQQd2BEAgACgCAAwBCyAACyIDIAQEfyACIANqIAMgBBCTASABIAJBACADIARqIAFLG0EAIAEgA08bagUgAQsgAhCTASAAIAIgBGoiARCSASAFQQA6AA8gASADaiAFLQAPOgAADAELIAAgAyACIARqIANrIARBAEEAIAIgARBXCyAFQRBqJAAgAAwBCxAVAAsL0QMCAn4CfyMAQSBrIgQkAAJAIAFC////////////AIMiA0KAgICAgIDAgDx9IANCgICAgICAwP/DAH1UBEAgAUIEhiAAQjyIhCEDIABC//////////8PgyIAQoGAgICAgICACFoEQCADQoGAgICAgICAwAB8IQIMAgsgA0KAgICAgICAgEB9IQIgAEKAgICAgICAgAhSDQEgAiADQgGDfCECDAELIABQIANCgICAgICAwP//AFQgA0KAgICAgIDA//8AURtFBEAgAUIEhiAAQjyIhEL/////////A4NCgICAgICAgPz/AIQhAgwBC0KAgICAgICA+P8AIQIgA0L///////+//8MAVg0AQgAhAiADQjCIpyIFQZH3AEkNACAEQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiAiAFQYH3AGsQHSAEIAAgAkGB+AAgBWsQOSAEKQMIQgSGIAQpAwAiAEI8iIQhAiAEKQMQIAQpAxiEQgBSrSAAQv//////////D4OEIgBCgYCAgICAgIAIWgRAIAJCAXwhAgwBCyAAQoCAgICAgICACFINACACQgGDIAJ8IQILIARBIGokACACIAFCgICAgICAgICAf4OEvwtEAQF/IwBBEGsiBSQAIAUgASACIAMgBEKAgICAgICAgIB/hRAmIAUpAwAhASAAIAUpAwg3AwggACABNwMAIAVBEGokAAvvLgEKfyMAQUBqIgMkAANAIAFBGGshCyABQRxrIQgDQCAAIQQDQAJAAkACQAJAAkACQAJAAkAgASAEayIKQRxtIgkOBgcHAAEEAgMLIAFBGGsoAgAgBCgCBE8NBiADIARBGGooAgA2AjggAyAEQRBqKQIANwMwIAMgBEEIaikCADcDKCADIAQpAgA3AyAgBCABQRxrIgBBGGooAgA2AhggBCAAKQIQNwIQIAQgACkCCDcCCCAEIAApAgA3AgAgACADKAI4NgIYIAAgAykDMDcCECAAIAMpAyg3AgggACADKQMgNwIADAYLIARBHGohACABQRxrIgFBBGooAgAhAiAEKAIgIgUgBCgCBE8EQCACIAVPDQYgAyAAKAIYNgI4IAMgACkCEDcDMCADIAApAgg3AyggAyAAKQIANwMgIAAgASgCGDYCGCAAIAEpAhA3AhAgACABKQIINwIIIAAgASkCADcCACABIAMoAjg2AhggASADKQMwNwIQIAEgAykDKDcCCCABIAMpAyA3AgAgBCgCICAEKAIETw0GIAMgBEEYaigCADYCOCADIARBEGopAgA3AzAgAyAEQQhqKQIANwMoIAMgBCkCADcDICAEIAAoAhg2AhggBCAAKQIQNwIQIAQgACkCCDcCCCAEIAApAgA3AgAgACADKAI4NgIYIAAgAykDMDcCECAAIAMpAyg3AgggACADKQMgNwIADAYLIAIgBUkEQCADIARBGGooAgA2AjggAyAEQRBqKQIANwMwIAMgBEEIaikCADcDKCADIAQpAgA3AyAgBCABKAIYNgIYIAQgASkCEDcCECAEIAEpAgg3AgggBCABKQIANwIAIAEgAygCODYCGCABIAMpAzA3AhAgASADKQMoNwIIIAEgAykDIDcCAAwGCyADIARBGGooAgA2AjggAyAEQRBqKQIANwMwIAMgBEEIaikCADcDKCADIAQpAgA3AyAgBCAAKAIYNgIYIAQgACkCEDcCECAEIAApAgg3AgggBCAAKQIANwIAIAAgAygCODYCGCAAIAMpAzA3AhAgACADKQMoNwIIIAAgAykDIDcCACABKAIEIAQoAiBPDQUgAyAAKAIYNgI4IAMgACkCEDcDMCADIAApAgg3AyggAyAAKQIANwMgIAAgASgCGDYCGCAAIAEpAhA3AhAgACABKQIINwIIIAAgASkCADcCACABIAMoAjg2AhggASADKQMwNwIQIAEgAykDKDcCCCABIAMpAyA3AgAMBQsgBCAEQRxqIgAgBEE4aiICIARB1ABqIgUQShogAUEYaygCACAEQdgAaigCAE8NBCADIAUoAhg2AjggAyAFKQIQNwMwIAMgBSkCCDcDKCADIAUpAgA3AyAgBSABQRxrIgFBGGooAgA2AhggBSABKQIQNwIQIAUgASkCCDcCCCAFIAEpAgA3AgAgASADKAI4NgIYIAEgAykDMDcCECABIAMpAyg3AgggASADKQMgNwIAIAQoAlggBEE8aigCAE8NBCADIAIoAhg2AjggAyACKQIQNwMwIAMgAikCCDcDKCADIAIpAgA3AyAgAiAFKAIYNgIYIAIgBSkCEDcCECACIAUpAgg3AgggAiAFKQIANwIAIAUgAygCODYCGCAFIAMpAzA3AhAgBSADKQMoNwIIIAUgAykDIDcCACAEKAI8IARBIGooAgBPDQQgAyAAKAIYNgI4IAMgACkCEDcDMCADIAApAgg3AyggAyAAKQIANwMgIAAgAigCGDYCGCAAIAIpAhA3AhAgACACKQIINwIIIAAgAikCADcCACACIAMoAjg2AhggAiADKQMwNwIQIAIgAykDKDcCCCACIAMpAyA3AgAgBCgCICAEKAIETw0EIAMgBEEYaigCADYCOCADIARBEGopAgA3AzAgAyAEQQhqKQIANwMoIAMgBCkCADcDICAEIAAoAhg2AhggBCAAKQIQNwIQIAQgACkCCDcCCCAEIAApAgA3AgAgACADKAI4NgIYIAAgAykDMDcCECAAIAMpAyg3AgggACADKQMgNwIADAQLIApB4wZMBEAgBEEcaiEAIARBOGohAiAEKAI8IQUCQCAEKAIgIgYgBCgCBCIHTwRAIAUgBk8NASADIAAoAhg2AjggAyAAKQIQNwMwIAMgACkCCDcDKCADIAApAgA3AyAgACACQRhqKAIANgIYIAAgAkEQaikCADcCECAAIAJBCGopAgA3AgggACACKQIANwIAIAIgAygCODYCGCACIAMpAzA3AhAgAiADKQMoNwIIIAIgAykDIDcCACAEKAIgIAdPDQEgAyAEQRhqKAIANgI4IAMgBEEQaikCADcDMCADIARBCGopAgA3AyggAyAEKQIANwMgIAQgACgCGDYCGCAEIAApAhA3AhAgBCAAKQIINwIIIAQgACkCADcCACAAIAMoAjg2AhggACADKQMwNwIQIAAgAykDKDcCCCAAIAMpAyA3AgAMAQsgBSAGSQRAIAMgBEEYaigCADYCOCADIARBEGopAgA3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IAEgDSAFEAwhIyAAIAEgBCAMEAwhJCAAIAEgCSALEAwhJSAAIAEgCiAHEAwhJiAAIAEgDSAIEAwhJyAAIAEgBiAMEAwhKCAAIAEgAiADEAwhKSAAIAEgAiADQQZqIg4QDCEqIAAgASACQQZqIg8gAxAMISsgACABIA8gDhAMISwgACABIAogAxAMIS0gACABIAIgDBAMIS4gACABIA8gCxAMIS8gACABIA0gDhAMITAgACABIAYgAxAMITEgACABIAIgCBAMITIgACABIA8gBxAMITMgACABIAkgDhAMITQgACABIAQgAxAMITUgACABIAIgBRAMITYgACABIA8gBRAMIQUgACABIAQgDhAMIQQgACABIAkgAxAMIQkgACABIAIgBxAMIQcgACABIA8gCBAMIQggACABIAYgDhAMIQYgACABIA0gAxAMIAYgCCAHIAkgBCAFIDYgNSA0IDMgMiAxIDAgLyAuIC0gLCArICkgKmpqampqampqampqampqampqampqIAAgASACIAsQDGogACABIA8gDBAMaiAAIAEgCiAOEAxqIBAgGCAXIBYgFSAUIBMgESASampqampqamogKCAnICYgJSAkICMgIiAhICAgHyAeIB0gHCAbIBkgGmpqampqampqampqampqamtqC00BAn8gAS0AACECAkAgAC0AACIDRQ0AIAIgA0cNAANAIAEtAAEhAiAALQABIgNFDQEgAUEBaiEBIABBAWohACACIANGDQALCyADIAJrC8ANAwh/AXwCfiMAQdAAayIHJAACQCABRQ0AIAEoAgAiAkUNAAJAIAEoAggiA0EEaiIEIAEoAgQiBksiCA0AIAIgA2pBoQ1BBBBMDQAgAEEENgIMIAEgBDYCCEEBIQUMAQsCQCADQQVqIgkgBksNACACIANqQbEOQQUQTA0AQQEhBSAAQQE2AgwgASAJNgIIDAELAkAgCA0AIAIgA2pBrA5BBBBMDQBBASEFIABBATYCFCAAQQI2AgwgASAENgIIDAELIAMgBk8NACACIANqIgQtAAAiAkEiRgRAIAAgARCPASEFDAELIAJBLUcgAkEwa0H/AXFBCUtxRQRAIAdBADYCTCAGIANrIgNBACADIAZNGyEDA0ACQCADIAVGBEAgAyECDAELAkAgBCAFai0AACICQTBrQQpJDQAgAkErayIGQRpNQQBBASAGdEGNgIAgcRsNACACQeUARg0AIAUhAgwBCyAFIAdqIAI6AAAgAyAFQQFqIgJGBEAgAyECDAELAkAgAiAEai0AACIGQTBrQQpJDQAgBkErayIIQRpNQQBBASAIdEGNgIAgcRsNACAGQeUARw0BCyACIAdqIAY6AAAgAyAFQQJqIgJGBEAgAyECDAELAkAgAiAEai0AACIGQTBrQQpJDQAgBkErayIIQRpNQQBBASAIdEGNgIAgcRsNACAGQeUARw0BCyACIAdqIAY6AABBPyECIAVBA2oiBUE/Rw0BCwtBACEFIAIgB2pBADoAACMAQRBrIgMkACMAQaABayICJAAgAiAHNgI8IAIgBzYCFCACQX82AhggAkEQaiIEQgAQLSACIARBAUEBEKEBIAIpAwghCyACKQMAIQwgB0HMAGoiBARAIAQgByACKAIUIAIoAogBaiACKAI8a2o2AgALIAMgCzcDCCADIAw3AwAgAkGgAWokACADKQMAIAMpAwgQaCEKIANBEGokACAHIAcoAkwiA0YNASAAIAo5AxgCf0H/////ByAKRAAAwP///99BZg0AGkGAgICAeCAKRAAAAAAAAODBZQ0AGiAKmUQAAAAAAADgQWMEQCAKqgwBC0GAgICAeAshBSAAQQg2AgwgACAFNgIUIAEgASgCCCADIAdrajYCCEEBIQUMAQsCQCACQfsARwRAIAJB2wBHDQIgASgCDCICQecHSw0CIAEgAkEBajYCDCAELQAAQdsARw0CIAEgA0EBajYCCCABEDUCQAJAAkAgASgCCCICIAEoAgRJBEAgASgCACACai0AAEHdAEcNASABIAEoAgxBAWs2AgxBACEDDAILIAEgAkEBazYCCAwFCyABIAJBAWs2AghBACEGA0BBKCABKAIQEQEAIgRFDQIgBEIANwMAIARCADcDICAEQgA3AxggBEIANwMQIARCADcDCCAEIQMgBQRAIAYgBDYCACAEIAY2AgQgBSEDCyABIAEoAghBAWo2AgggARA1IAQgARBxRQRAIAMQMQwFCyABEDUgASgCCCICIAEoAgRPBEAgAxAxDAULIAMhBSAEIQYgASgCACACai0AACIEQSxGDQALIARB3QBHBEAgAxAxDAQLIAEgASgCDEEBazYCDCADIAY2AgQLIAAgAzYCCCAAQSA2AgxBASEFIAEgAkEBajYCCAwDCyAFRQ0BIAUQMQwBCyABKAIMIgJB5wdLDQEgASACQQFqNgIMIAQtAABB+wBHDQEgASADQQFqNgIIIAEQNQJAAkACQAJAIAEoAggiAiABKAIESQRAIAEoAgAgAmotAABB/QBHDQEgASABKAIMQQFrNgIMQQAhAwwCCyABIAJBAWs2AggMBQsgASACQQFrNgIIQQAhBgNAQSggASgCEBEBACIERQ0CIARCADcDACAEQgA3AyAgBEIANwMYIARCADcDECAEQgA3AwggBCEDIAUEQCAGIAQ2AgAgBCAGNgIEIAUhAwsgASABKAIIQQFqNgIIIAEQNSAEIAEQjwFFBEAgAyEFDAQLIAEQNSAEIAQoAhA2AiAgBEEANgIQIAEoAggiBSABKAIETwRAIAMhBQwECyABKAIAIAVqLQAAQTpHBEAgAyEFDAQLIAEgBUEBajYCCCABEDUgBCABEHFFBEAgAyEFDAQLIAEQNSABKAIIIgIgASgCBE8EQCADIQUMBAsgAyEFIAQhBiABKAIAIAJqLQAAIgRBLEYNAAsgBEH9AEcNAiABIAEoAgxBAWs2AgwgAyAGNgIECyAAIAM2AgggAEHAADYCDEEBIQUgASACQQFqNgIIDAMLIAVFDQELIAUQMQtBACEFCyAHQdAAaiQAIAUL3gIBB38gASgCCCEJIAEoAgQhBiABKAIAIQggAigCACEHIAIoAgQhBSAAQgA3AgggACAHrSAFrUIghoQ3AgAgByIBQQBOBEAgBSAGbCEKIAchAgNAIAMgCCACIgEgCmpBAnQgBGpqLQAASQRAIAFBAWshAiABDQELCyAAIAE2AgALAkAgBiAHTA0AIAZBAWshCiAFIAZsIQsgByECA0AgAiAKRyADIAggAiALakECdCAEamotAABJcUUEQCAAIAIgAWs2AggMAgsgAkEBaiICIAZHDQALCyAFIgFBAE4EQCAFIQIDQCADIAggAiIBIAZsIAdqQQJ0IARqai0AAEkEQCABQQFrIQIgAQ0BCwsgACABNgIECyAFIAlIBEAgCUEBayECA0AgAiAFRyADIAggBSAGbCAHakECdCAEamotAABJcUUEQCAAIAUgAWs2AgwPCyAFQQFqIgUgCUcNAAsLC8ovAhR/AX4jAEGwAWsiAyQAAkACQAJAAkACQAJAIAEoAgQiByABKAIAIgRGDQACQAJAAkAgByAEayIKQQBIDQAgChAKIgghBgNAIAYgBCgCADYCACAGQQRqIQYgBEEEaiIEIAdHDQALIANBADYCWCADQgA3AlAgAyAANgJAIAYgCEYNAyADIAY2AkggAyAINgJEIAMgCCAKajYCTCADQUBrEE4gAkUNBSACQYCAgIAETw0AQQAhBiACQQJ0Ig0QCkEAIA0QDSIEIA1qIQgDQCAAKAIEIAZqIgcgACgCDCAAKAIIIgprQQF1Tw0BIAQgBkF/cyACakECdGogA0FAayAKIAdBAXRqLgEAEHY2AgAgBkEBaiIGIAJHDQALIAQgCEYNBCAEIQYDQCAGKAIARQRAIAggBkEEaiIGRw0BDAYLCyADQQA2AjggA0IANwMwIANCADcDKCADQgA3AyAgA0EANgIYIANCADcDECADQgA3AwggA0IANwMAIANBADYCrAEgAyAINgKgASADIAg2ApwBIANCADcCpAEgAyAANgKUASADIAQ2ApgBIANBlAFqEE4gAyAANgIgIAMgADYCACADQgA3AowBIANCADcChAEgA0IANwJ8IANCADcCcCADQgA3AmggAyAANgJ4IANCADcCYCADIAA2AlwgDUF9SA0CIANB4ABqIA1BAnUiEUEBahBNIAMoAmQgAygCYCIEayICQQBKBEAgBEEAIAJBAnYgAkEDS2tBAnRBBGoQDRoLIARBATYCAAJAIAMoAgwiCiADKAIEIgZHDQAgAygCCCECIANBgAEQCiIGIAogAiAKayICEA4iBCACajYCCCADIARBgAFqNgIMIAMgBDYCBCAKRQ0AIAoQCCADKAIEIQYLIAMoAggiBCAGayECAkAgBCAGRgRAIANBBHJBASACQQJ1axA2IAMoAgQhBiADKAIIIQQMAQsgAkEFSQ0AIAMgBkEEaiIENgIICyAEIAZrIgJBAEoEQCAGQQAgAkECdiACQQNLa0ECdEEEahANGgsgBkEANgIAAkAgAygCLCIHIAMoAiQiBEcNACADKAIoIQIgA0GAARAKIgQgByACIAdrIgIQDiIKIAJqNgIoIAMgCkGAAWo2AiwgAyAKNgIkIAdFDQAgBxAIIAMoAiQhBAsgAygCKCICIARrIQoCQCACIARGBEAgA0EgakEEckEBIApBAnVrEDYgAygCJCEEIAMoAighAgwBCyAKQQVJDQAg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A1AgAkEoaiAAKAJMIAFBACACQdAAahBbAkACQCACLQBMBEAgAi0ASARAIAFBAToAaAwCCyAAIAJBKGogAkHQAGoQeAwBCyAALQAJRQ0AIAMgAkHQAGoiAxDBASACIAAoAkwgAUEDIAMQWyACQShqIAIQdwJAIAItACRFDQACQCACLQAcRQ0AIAIsABtBAE4NACACKAIQEAgLIAIsAA9BAE4NACACKAIEEAgLIAItAExFDQEgAi0ASARAIAFBAToAaAwBCyAAIAJBKGogAkHQAGoQeAsgAi0ATEUNAAJAIAItAERFDQAgAiwAQ0EATg0AIAIoAjgQCAsgAiwAN0EATg0AIAIoAiwQCAsgAkHgAGokAAsdACABBEAgACABKAIAEHogACABKAIEEHogARAICwu49wECB38BfiMAQZACayIAJABB7PIAQgA3AgAgAEFAa0HoPikCADcDACAAQThqIgVB4D4pAgA3AwAgAEHYPikCADcDMCAAQShqIgZB0D4pAgA3AwAgAEHIPikCADcDICAAQRhqIgRBwD4pAgA3AwAgAEG4PikCADcDECAAQbA+KQIANwMIQejyAEHs8gA2AgBB6PIAIABBCGoiAiAAQcgAaiIBECIgAEHuES0AADoADCAAQQA6ABwgAEEAOgAsIABCiICAgNCsmLc1NwIkIABBADoAPCAAQoWAgIDQrJi3MjcCNCAAQoKAgIDQjtyx4QA3AkQgAEEAOgBMIABBDDYCVCAAQQU6ABMgAEHqESgAADYCCCAAQQQ6ACMgAEEAOgANIABBBDoAMyAAQo2AgIDQrJi3ODcCFCAAQQQ6AEMgAEEEOgBTIABBBDoAYyAAQQk2AmQgAEEAOgBcIABBIjYCdCAAQcULKAAANgBrIABBBzoAcyAAQfXgjasGNgJYIABBADoAbyAAQcILKAAANgJoQRAQCiEDIABCi4CAgICCgICAfzcCfCAAIAM2AnggA0HbCygAADYAByADQdQLKQAANwAAIANBADoACyAAQckRLwAAOwGMASAAQSc2ApQBIABB5xEvAAA7AZwBIABB3QA2AqQBIABBIzYChAEgAEEGOgCTASAAQcURKAAANgKIASAAQQY6AKMBIABBADoAjgEgAEHjESgAADYCmAEgAEEHOgCzASAAQQA6AJ4BIABBgAE2ArQBIABBGTYCxAEgAEHPESgAADYAqwEgAEHaES0AADoAugEgAEEDOgDDASAAQQA6AK8BIABBBzoA0wEgAEEAOgC7ASAAQcwRKAAANgKoASAAQdgRLwAAOwG4ASAAQc0LKAAANgDLASAAQcoLKAAANgLIASAAQSY2AtQBIABBAjoA4wEgAEEAOgDPASAAQcAANgLkASAAQQU6APMBIABBADoA2gEgAEHx5AE7AdgBIABB1g8tAAA6AOwBIABB0g8oAAA2AugBIABBwQA2AvQBIABBCjoAgwIgAEEAOgDtASAAQbgILwAAOwGAAiAAQbAIKQAANwL4ASAAQcIANgKEAiAAQQA6AIICQfjyAEIANwIAQfTyAEH48gA2AgAgAEGIAmoiA0H08gBB+PIAIAIgAhAJIANB9PIAQfjyACAEIAQQCSADQfTyAEH48gAgBiAGEAkgA0H08gBB+PIAIAUgBRAJIANB9PIAQfjyACABIAEQCSADQfTyAEH48gAgAEHYAGoiASABEAkgA0H08gBB+PIAIABB6ABqIgEgARAJIANB9PIAQfjyACAAQfgAaiIBIAEQCSADQfTyAEH48gAgAEGIAWoiASABEAkgA0H08gBB+PIAIABBmAFqIgEgARAJIANB9PIAQfjyACAAQagBaiIBIAEQCSADQfTyAEH48gAgAEG4AWoiASABEAkgA0H08gBB+PIAIABByAFqIgEgARAJIANB9PIAQfjyACAAQdgBaiIBIAEQCSADQfTyAEH48gAgAEHoAWoiASABEAkgA0H08gBB+PIAIABB+AFqIgEgARAJIAAsAIMCQQBIBEAgACgC+AEQCAsgACwA8wFBAEgEQCAAKALoARAICyAALADjAUEASARAIAAoAtgBEAgLIAAsANMBQQBIBEAgACgCyAEQCAsgACwAwwFBAEgEQCAAKAK4ARAICyAALACzAUEASARAIAAoAqgBEAgLIAAsAKMBQQBIBEAgACgCmAEQCAsgACwAkwFBAEgEQCAAKAKIARAICyAALACDAUEASARAIAAoAngQCAsgACwAc0EASARAIAAoAmgQCAsgACwAY0EASARAIAAoAlgQCAsgACwAU0EASARAIAAoAkgQCAsgACwAQ0EASARAIAAoAjgQCAsgACwAM0EASARAIAAoAigQCAsgACwAI0EASARAIAAoAhgQCAsgACwAE0EASARAIAAoAggQCAtB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LACDAUEASARAIAAoAngQCAsgACwAc0EASARAIAAoAmgQCAsgACwAY0EASARAIAAoAlgQCAsgACwAU0EASARAIAAoAkgQCAsgACwAQ0EASARAIAAoAjgQCAsgACwAM0EASARAIAAoAigQCAsgACwAI0EASARAIAAoAhgQCAsgACwAE0EASARAIAAoAggQCAtBACECQaTzAEGo8wA2AgBBqPMAQgA3AgACQEGY8wAoAgAiBEGc8wBGDQADQCAEQRBqIQMgBCgCHCEFAkACQCACRQRAQajzACEGQajzACEBDAELA0AgAiIBKAIQIgIgBUoEQCABIQYgASgCACICDQEMAgsgAiAFTgRAIAEhAgwDCyABKAIEIgINAAsgAUEEaiEGC0EgEAoiAiAFNgIQIAIgATYCCCACQgA3AgAgAkIANwIUIAJBADYCHCAGIAI2AgAgAiEBQaTzACgCACgCACIFBEBBpPMAIAU2AgAgBigCACEBC0Go8wAoAgAgARASQazzAEGs8wAoAgBBAWo2AgALAkAgAkEUaiIFIANGDQAgBC0AGyIGwCEBIAIsAB9BAE4EQCABQQBOBEAgBSADKQIANwIAIAUgAygCCDYCCAwCCyAFIAQoAhAgBCgCFBAjDAELIAUgBCgCECADIAFBAEgiARsgBCgCFCAGIAEbECQLAkAgBCgCBCICBEADQCACIgEoAgAiAg0ADAILAAsDQCAEKAIIIgEoAgAgBEchAiABIQQgAg0ACwsgAUGc8wBGDQFBqPMAKAIAIQIgASEEDAALAAsgAEGQAmokACMAQZACayIAJABBtPMAQgA3AgAgAEFAa0GwwAApAgA3AwAgAEE4aiIFQajAACkCADcDACAAQaDAACkCADcDMCAAQShqIgZBmMAAKQIANwMAIABBkMAAKQIANwMgIABBGGoiBEGIwAApAgA3AwAgAEGAwAApAgA3AxAgAEH4PykCADcDCEGw8wBBtPMANgIAQbDzACAAQQhqIgIgAEHIAGoiARAiIABB7hEtAAA6AAwgAEEAOgAcIABBADoALCAAQoiAgIDQrJi3NTcCJCAAQQA6ADwgAEKFgICA0KyYtzI3AjQgAEKCgICA0I7cseEANwJEIABBADoATCAAQQw2AlQgAEEFOgATIABB6hEoAAA2AgggAEEEOgAjIABBADoADSAAQQQ6ADMgAEKNgICA0KyYtzg3AhQgAEEEOgBDIABBBDoAUyAAQQQ6AGMgAEEJNgJkIABBADoAXCAAQSI2AnQgAEHFCygAADYAayAAQQc6AHMgAEH14I2rBjYCWCAAQQA6AG8gAEHCCygAADYCaEEQEAohAyAAQouAgICAgoCAgH83AnwgACADNgJ4IANB2wsoAAA2AAcgA0HUCykAADcAACADQQA6AAsgAEHJES8AADsBjAEgAEEnNgKUASAAQecRLwAAOwGcASAAQd0ANgKkASAAQSM2AoQBIABBBjoAkwEgAEHFESgAADYCiAEgAEEGOgCjASAAQQA6AI4BIABB4xEoAAA2ApgBIABBBzoAswEgAEEAOgCeASAAQYABNgK0ASAAQRk2AsQBIABBzxEoAAA2AKsBIABB2hEtAAA6ALoBIABBAzoAwwEgAEEAOgCvASAAQQc6ANMBIABBADoAuwEgAEHMESgAADYCqAEgAEHYES8AADsBuAEgAEHNCygAADYAywEgAEHKCygAADYCyAEgAEEmNgLUASAAQQI6AOMBIABBADoAzwEgAEHAADYC5AEgAEEFOgDzASAAQQA6ANoBIABB8eQBOwHYASAAQdYPLQAAOgDsASAAQdIPKAAANgLoASAAQcEANgL0ASAAQQo6AIMCIABBADoA7QEgAEG4CC8AADsBgAIgAEGwCCkAADcC+AEgAEHCADYChAIgAEEAOgCCAkHA8wBCADcCAEG88wBBwPMANgIAIABBiAJqIgNBvPMAQcDzACACIAIQCSADQbzzAEHA8wAgBCAEEAkgA0G88wBBwPMAIAYgBhAJIANBvPMAQcDzACAFIAUQCSADQbzzAEHA8wAgASABEAkgA0G88wBBwPMAIABB2ABqIgEgARAJIANBvPMAQcDzACAAQegAaiIBIAEQCSADQbzzAEHA8wAgAEH4AGoiASABEAkgA0G88wBBwPMAIABBiAFqIgEgARAJIANBvPMAQcDzACAAQZgBaiIBIAEQCSADQbzzAEHA8wAgAEGoAWoiASABEAkgA0G88wBBwPMAIABBuAFqIgEgARAJIANBvPMAQcDzACAAQcgBaiIBIAEQCSADQbzzAEHA8wAgAEHYAWoiASABEAkgA0G88wBBwPMAIABB6AFqIgEgARAJIANBvPMAQcDzACAAQfgBaiIBIAEQCSAALACDAkEASARA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AgA3AgAgBSADKAIINgIIDAILIAUgBCgCECAEKAIUECMMAQsgBSAEKAIQIAMgAUEASCIBGyAEKAIUIAYgARsQJAsCQCAEKAIEIgIEQANAIAIiASgCACICDQAMAgsACwNAIAQoAggiASgCACAERyECIAEhBCACDQALCyABQYj0AEYNAUGU9AAoAgAhAiABIQQMAAsACyAAQZACaiQAIwBBkAJrIgAkAEGg9ABCADcCACAAQUBrQfTGACkCADcDACAAQThqIgVB7MYAKQIANwMAIABB5MYAKQIANwMwIABBKGoiBkHcxgApAgA3AwAgAEHUxgApAgA3AyAgAEEYaiIEQczGACkCADcDACAAQcTGACkCADcDECAAQbzGACkCADcDCEGc9ABBoPQANgIAQZz0ACAAQQhqIgIgAEHIAGoiARAiIABB7hEtAAA6AAwgAEEAOgAcIABBADoALCAAQoiAgIDQrJi3NTcCJCAAQQA6ADwgAEKFgICA0KyYtzI3AjQgAEKCgICA0I7cseEANwJEIABBADoATCAAQQw2AlQgAEEFOgATIABB6hEoAAA2AgggAEEEOgAjIABBADoADSAAQQQ6ADMgAEKNgICA0KyYtzg3AhQgAEEEOgBDIABBBDoAUyAAQQQ6AGMgAEEJNgJkIABBADoAXCAAQSI2AnQgAEHFCygAADYAayAAQQc6AHMgAEH14I2rBjYCWCAAQQA6AG8gAEHCCygAADYCaEEQEAohAyAAQouAgICAgoCAgH83AnwgACADNgJ4IANB2wsoAAA2AAcgA0HUCykAADcAACADQQA6AAsgAEHJES8AADsBjAEgAEEnNgKUASAAQecRLwAAOwGcASAAQd0ANgKkASAAQSM2AoQBIABBBjoAkwEgAEHFESgAADYCiAEgAEEGOgCjASAAQQA6AI4BIABB4xEoAAA2ApgBIABBBzoAswEgAEEAOgCeASAAQYABNgK0ASAAQRk2AsQBIABBzxEoAAA2AKsBIABB2hEtAAA6ALoBIABBAzoAwwEgAEEAOgCvASAAQQc6ANMBIABBADoAuwEgAEHMESgAADYCqAEgAEHYES8AADsBuAEgAEHNCygAADYAywEgAEHKCygAADYCyAEgAEEmNgLUASAAQQI6AOMBIABBADoAzwEgAEHAADYC5AEgAEEFOgDzASAAQQA6ANoBIABB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IANB1AspAAA3AAAgA0EAOgALIABByREvAAA7AYwBIABBJzYClAEgAEHnES8AADsBnAEgAEHdADYCpAEgAEEjNgKEASAAQQY6AJMBIABBxREoAAA2AogBIABBBjoAowEgAEEAOgCOASAAQeMRKAAANgKYASAAQQc6ALMBIABBADoAngEgAEGAATYCtAEgAEEZNgLEASAAQc8RKAAANgCrASAAQdoRLQAAOgC6ASAAQQM6AMMBIABBADoArwEgAEEHOgDTASAAQQA6ALsBIABBzBEoAAA2AqgBIABB2BEvAAA7AbgBIABBzQsoAAA2AMsBIABBygsoAAA2AsgBIABBJjYC1AEgAEECOgDjASAAQQA6AM8BIABBwAA2AuQBIABBBToA8wEgAEEAOgDaASAAQfHkATsB2AEgAEHWDy0AADoA7AEgAEHSDygAADYC6AEgAEHBADYC9AEgAEEKOgCDAiAAQQA6AO0BIABBuAgvAAA7AYACIABBsAgpAAA3AvgBIABBwgA2AoQCIABBADoAggJB9PQAQgA3AgBB8PQAQfT0ADYCACAAQYgCaiIDQfD0AEH09AAgAiACEAkgA0Hw9ABB9PQAIAQgBBAJIANB8PQAQfT0ACAGIAYQCSADQfD0AEH09AAgBSAFEAkgA0Hw9ABB9PQAIAEgARAJIANB8PQAQfT0ACAAQdgAaiIBIAEQCSADQfD0AEH09AAgAEHoAGoiASABEAkgA0Hw9ABB9PQAIABB+ABqIgEgARAJIANB8PQAQfT0ACAAQYgBaiIBIAEQCSADQfD0AEH09AAgAEGYAWoiASABEAkgA0Hw9ABB9PQAIABBqAFqIgEgARAJIANB8PQAQfT0ACAAQbgBaiIBIAEQCSADQfD0AEH09AAgAEHIAWoiASABEAkgA0Hw9ABB9PQAIABB2AFqIgEgARAJIANB8PQAQfT0ACAAQegBaiIBIAEQCSADQfD0AEH09AAgAEH4AWoiASABEAkgACwAgwJBAEgEQCAAKAL4ARAICyAALADzAUEASARAIAAoAugBEAgLIAAsAOMBQQBIBEAgACgC2AEQCAsgACwA0wFBAEgEQCAAKALIARAICyAALADDAUEASARAIAAoArgBEAgLIAAsALMBQQBIBEAgACgCqAEQCAsgACwAowFBAEgEQCAAKAKYARAICyAALACTAUEASARA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ADYCAEGs9wBCADcCAAJAQZz3ACgCACIEQaD3AEYNAANAIARBEGohAyAEKAIcIQUCQAJAIAJFBEBBrPcAIQZBrPcAIQEMAQsDQCACIgEoAhAiAiAFSgRAIAEhBiABKAIAIgINAQwCCyACIAVOBEAgASECDAMLIAEoAgQiAg0ACyABQQRqIQYLQSAQCiICIAU2AhAgAiABNgIIIAJCADcCACACQgA3AhQgAkEANgIcIAYgAjYCACACIQFBqPcAKAIAKAIAIgUEQEGo9wAgBTYCACAGKAIAIQELQaz3ACgCACABEBJBsPcAQbD3ACgCAEEBajYCAAsCQCACQRRqIgUgA0YNACAELQAbIgbAIQEgAiwAH0EATgRAIAFBAE4EQCAFIAMpAgA3AgAgBSADKAIINgIIDAILIAUgBCgCECAEKAIUECMMAQsgBSAEKAIQIAMgAUEASCIBGyAEKAIUIAYgARsQJAsCQCAEKAIEIgIEQANAIAIiASgCACICDQAMAgsACwNAIAQoAggiASgCACAERyECIAEhBCACDQALCyABQaD3AEYNAUGs9wAoAgAhAiABIQQMAAsACyAAQZACaiQAIwBBkAJrIgAkAEG49wBCADcCACAAQUBrQfThACkCADcDACAAQThqIgVB7OEAKQIANwMAIABB5OEAKQIANwMwIABBKGoiBkHc4QApAgA3AwAgAEHU4QApAgA3AyAgAEEYaiIEQczhACkCADcDACAAQcThACkCADcDECAAQbzhACkCADcDCEG09wBBuPcANgIAQbT3ACAAQQhqIgIgAEHIAGoiARAiIABB7hEtAAA6AAwgAEEAOgAcIABBADoALCAAQoiAgIDQrJi3NTcCJCAAQQA6ADwgAEKFgICA0KyYtzI3AjQgAEKCgICA0I7cseEANwJEIABBADoATCAAQQw2AlQgAEEFOgATIABB6hEoAAA2AgggAEEEOgAjIABBADoADSAAQQQ6ADMgAEKNgICA0KyYtzg3AhQgAEEEOgBDIABBBDoAUyAAQQQ6AGMgAEEJNgJkIABBADoAXCAAQSI2AnQgAEHFCygAADYAayAAQQc6AHMgAEH14I2rBjYCWCAAQQA6AG8gAEHCCygAADYCaEEQEAohAyAAQouAgICAgoCAgH83AnwgACADNgJ4IANB2wsoAAA2AAcgA0HUCykAADcAACAD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ACgC+AEQCAsgACwA8wFBAEgEQCAAKALoARAICyAALADjAUEASARAIAAoAtgBEAgLIAAsANMBQQBIBEAgACgCyAEQCAsgACwAwwFBAEgEQCAAKAK4ARAICyAALACzAUEASARAIAAoAqgBEAgLIAAsAKMBQQBIBEAgACgCmAEQCAsgACwAkwFBAEgEQCAAKAKIARAICyAALACDAUEASARAIAAoAngQCAsgACwAc0EASARAIAAoAmgQCAsgACwAY0EASARAIAAoAlgQCAsgACwAU0EASARAIAAoAkgQCAsgACwAQ0EASARAIAAoAjgQCAsgACwAM0EASARAIAAoAigQCAsgACwAI0EASARAIAAoAhgQCAsgACwAE0EASARAIAAoAggQCAtBACECQfD3AEH09wA2AgBB9PcAQgA3AgACQEHk9wAoAgAiBEHo9wBGDQADQCAEQRBqIQMgBCgCHCEFAkACQCACRQRAQfT3ACEGQfT3ACEBDAELA0AgAiIBKAIQIgIgBUoEQCABIQYgASgCACICDQEMAgsgAiAFTgRAIAEhAgwDCyABKAIEIgINAAsgAUEEaiEGC0EgEAoiAiAFNgIQIAIgATYCCCACQgA3AgAgAkIANwIUIAJBADYCHCAGIAI2AgAgAiEBQfD3ACgCACgCACIFBEBB8PcAIAU2AgAgBigCACEBC0H09wAoAgAgARASQfj3AEH49wAoAgBBAWo2AgALAkAgAkEUaiIFIANGDQAgBC0AGyIGwCEBIAIsAB9BAE4EQCABQQBOBEAgBSADKQIANwIAIAUgAygCCDYCCAwCCyAFIAQoAhAgBCgCFBAjDAELIAUgBCgCECADIAFBAEgiARsgBCgCFCAGIAEbECQLAkAgBCgCBCICBEADQCACIgEoAgAiAg0ADAILAAsDQCAEKAIIIgEoAgAgBEchAiABIQQgAg0ACwsgAUHo9wBGDQFB9PcAKAIAIQIgASEEDAALAAsgAEGQAmokACMAQZACayIAJABBgPgAQgA3AgAgAEFAa0GI4wApAgA3AwAgAEE4aiIFQYDjACkCADcDACAAQfjiACkCADcDMCAAQShqIgZB8OIAKQIANwMAIABB6OIAKQIANwMgIABBGGoiBEHg4gApAgA3AwAgAEHY4gApAgA3AxAgAEHQ4gApAgA3AwhB/PcAQYD4ADYCAEH89wAgAEEIaiICIABByABqIgEQIiAAQe4RLQAAOgAMIABBADoAHCAAQQA6ACwgAEKIgICA0KyYtzU3AiQgAEEAOgA8IABChYCAgNCsmLcyNwI0IABCgoCAgNCO3LHhADcCRCAAQQA6AEwgAEEMNgJUIABBBToAEyAAQeoRKAAANgIIIABBBDoAIyAAQQA6AA0gAEEEOgAzIABCjYCAgNCsmLc4NwIUIABBBDoAQyAAQQQ6AFMgAEEEOgBjIABBCTYCZCAAQQA6AFwgAEEiNgJ0IABBxQsoAAA2AGsgAEEHOgBzIABB9eCNqwY2AlggAEEAOgBvIABBwgsoAAA2AmhBEBAKIQMgAEKLgICAgIKAgIB/NwJ8IAAgAzYCeCADQdsLKAAANgAHIANB1AspAAA3AAAgA0EAOgALIABByREvAAA7AYwBIABBJzYClAEgAEHnES8AADsBnAEgAEHdADYCpAEgAEEjNgKEASAAQQY6AJMBIABBxREoAAA2AogBIABBBjoAowEgAEEAOgCOASAAQeMRKAAANgKYASAAQQc6ALMBIABBADoAngEgAEGAATYCtAEgAEEZNgLEASAAQc8RKAAANgCrASAAQdoRLQAAOgC6ASAAQQM6AMMBIABBADoArwEgAEEHOgDTASAAQQA6ALsBIABBzBEoAAA2AqgBIABB2BEvAAA7AbgBIABBzQsoAAA2AMsBIABBygsoAAA2AsgBIABBJjYC1AEgAEECOgDjASAAQQA6AM8BIABBwAA2AuQBIABBBToA8wEgAEEAOgDaASAAQfHkATsB2AEgAEHWDy0AADoA7AEgAEHSDygAADYC6AEgAEHBADYC9AEgAEEKOgCDAiAAQQA6AO0BIABBuAgvAAA7AYACIABBsAgpAAA3AvgBIABBwgA2AoQCIABBADoAggJBjPgAQgA3AgBBiPgAQYz4ADYCACAAQYgCaiIDQYj4AEGM+AAgAiACEAkgA0GI+ABBjPgAIAQgBBAJIANBiPgAQYz4ACAGIAYQCSADQYj4AEGM+AAgBSAFEAkgA0GI+ABBjPgAIAEgARAJIANBiPgAQYz4ACAAQdgAaiIBIAEQCSADQYj4AEGM+AAgAEHoAGoiASABEAkgA0GI+ABBjPgAIABB+ABqIgEgARAJIANBiPgAQYz4ACAAQYgBaiIBIAEQCSADQYj4AEGM+AAgAEGYAWoiASABEAkgA0GI+ABBjPgAIABBqAFqIgEgARAJIANBiPgAQYz4ACAAQbgBaiIBIAEQCSADQYj4AEGM+AAgAEHIAWoiASABEAkgA0GI+ABBjPgAIABB2AFqIgEgARAJIANBiPgAQYz4ACAAQegBaiIBIAEQCSADQYj4AEGM+AAgAEH4AWoiASABEAkgACwAgwJBAEgEQCAAKAL4ARAICyAALADzAUEASARAIAAoAugBEAgLIAAsAOMBQQBIBEAgACgC2AEQCAsgACwA0wFBAEgEQCAAKALIARAICyAALADDAUEASARAIAAoArgBEAgLIAAsALMBQQBIBEAgACgCqAEQCAsgACwAowFBAEgEQCAAKAKYARAICyAALACTAUEASARAIAAoAogBEAgLIAAsAIMBQQBIBEAgACgCeBAICyAALABzQQBIBEAgACgCaBAICyAALABjQQBIBEAgACgCWBAICyAALABTQQBIBEAgACgCSBAICyAALABDQQBIBEAgACgCOBAICyAALAAzQQBIBEAgACgCKBAICyAALAAjQQBIBEAgACgCGBAICyAALAATQQBIBEAgACgCCBAIC0EAIQJBlPgAQZj4ADYCAEGY+ABCADcCAAJAQYj4ACgCACIEQYz4AEYNAANAIARBEGohAyAEKAIcIQUCQAJAIAJFBEBBmPgAIQZBmPgAIQEMAQsDQCACIgEoAhAiAiAFSgRAIAEhBiABKAIAIgINAQwCCyACIAVOBEAgASECDAMLIAEoAgQiAg0ACyABQQRqIQYLQSAQCiICIAU2AhAgAiABNgIIIAJCADcCACACQgA3AhQgAkEANgIcIAYgAjYCACACIQFBlPgAKAIAKAIAIgUEQEGU+AAgBTYCACAGKAIAIQELQZj4ACgCACABEBJBnPgAQZz4ACgCAEEBajYCAAsCQCACQRRqIgUgA0YNACAELQAbIgbAIQEgAiwAH0EATgRAIAFBAE4EQCAFIAMpAgA3AgAgBSADKAIINgIIDAILIAUgBCgCECAEKAIUECMMAQsgBSAEKAIQIAMgAUEASCIBGyAEKAIUIAYgARsQJAsCQCAEKAIEIgIEQANAIAIiASgCACICDQAMAgsACwNAIAQoAggiASgCACAERyECIAEhBCACDQALCyABQYz4AEYNAUGY+AAoAgAhAiABIQQMAAsACyAAQZACaiQAIwBBkAJrIgAkAEGk+ABCADcCACAAQUBrQdzjACkCADcDACAAQThqIgVB1OMAKQIANwMAIABBzOMAKQIANwMwIABBKGoiBkHE4wApAgA3AwAgAEG84wApAgA3AyAgAEEYaiIEQbTjACkCADcDACAAQazjACkCADcDECAAQaTjACkCADcDCEGg+ABBpPgANgIAQaD4ACAAQQhqIgIgAEHIAGoiARAiIABB7hEtAAA6AAwgAEEAOgAcIABBADoALCAAQoiAgIDQrJi3NTcCJCAAQQA6ADwgAEKFgICA0KyYtzI3AjQgAEKCgICA0I7cseEANwJEIABBADoATCAAQQw2AlQgAEEFOgATIABB6hEoAAA2AgggAEEEOgAjIABBADoADSAAQQQ6ADMgAEKNgICA0KyYtzg3AhQgAEEEOgBDIABBBDoAUyAAQQQ6AGMgAEEJNgJkIABBADoAXCAAQSI2AnQgAEHFCygAADYAayAAQQc6AHMgAEH14I2rBjYCWCAAQQA6AG8gAEHCCygAADYCaEEQEAohAyAAQouAgICAgoCAgH83AnwgACADNgJ4IANB2wsoAAA2AAcgA0HUCykAADcAACADQQA6AAsgAEHJES8AADsBjAEgAEEnNgKUASAAQecRLwAAOwGcASAAQd0ANgKkASAAQSM2AoQBIABBBjoAkwEgAEHFESgAADYCiAEgAEEGOgCjASAAQQA6AI4BIABB4xEoAAA2ApgBIABBBzoAswEgAEEAOgCeASAAQYABNgK0ASAAQRk2AsQBIABBzxEoAAA2AKsBIABB2hEtAAA6ALoBIABBAzoAwwEgAEEAOgCvASAAQQc6ANMBIABBADoAuwEgAEHMESgAADYCqAEgAEHYES8AADsBuAEgAEHNCygAADYAywEgAEHKCygAADYCyAEgAEEmNgLUASAAQQI6AOMBIABBADoAzwEgAEHAADYC5AEgAEEFOgDzASAAQQA6ANoBIABB8eQBOwHYASAAQdYPLQAAOgDsASAAQdIPKAAANgLoASAAQcEANgL0ASAAQQo6AIMCIABBADoA7QEgAEG4CC8AADsBgAIgAEGwCCkAADcC+AEgAEHCADYChAIgAEEAOgCCAkGw+ABCADcCAEGs+ABBsPgANgIAIABBiAJqIgNBrPgAQbD4ACACIAIQCSADQaz4AEGw+AAgBCAE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KAAANgCrASAAQdoRLQAAOgC6ASAAQQM6AMMBIABBADoArwEgAEEHOgDTASAAQQA6ALsBIABBzBEoAAA2AqgBIABB2BEvAAA7AbgBIABBzQsoAAA2AMsBIABBygsoAAA2AsgBIABBJjYC1AEgAEECOgDjASAAQQA6AM8BIABBwAA2AuQBIABBBToA8wEgAEEAOgDaASAAQfHkATsB2AEgAEHWDy0AADoA7AEgAEHSDygAADYC6AEgAEHBADYC9AEgAEEKOgCDAiAAQQA6AO0BIABBuAgvAAA7AYACIABBsAgpAAA3AvgBIABBwgA2AoQCIABBADoAggJB+PgAQgA3AgBB9PgAQfj4ADYCACAAQYgCaiIDQfT4AEH4+AAgAiACEAkgA0H0+ABB+PgAIAQgBBAJIANB9PgAQfj4ACAGIAYQCSADQfT4AEH4+AAgBSAFEAkgA0H0+ABB+PgAIAEgARAJIANB9PgAQfj4ACAAQdgAaiIBIAEQCSADQfT4AEH4+AAgAEHoAGoiASABEAkgA0H0+ABB+PgAIABB+ABqIgEgARAJIANB9PgAQfj4ACAAQYgBaiIBIAEQCSADQfT4AEH4+AAgAEGYAWoiASABEAkgA0H0+ABB+PgAIABBqAFqIgEgARAJIANB9PgAQfj4ACAAQbgBaiIBIAEQCSADQfT4AEH4+AAgAEHIAWoiASABEAkgA0H0+ABB+PgAIABB2AFqIgEgARAJIANB9PgAQfj4ACAAQegBaiIBIAEQCSADQfT4AEH4+AAgAEH4AWoiASABEAkgACwAgwJBAEgEQCAAKAL4ARAICyAALADzAUEASARAIAAoAugBEAgLIAAsAOMBQQBIBEAgACgC2AEQCAsgACwA0wFBAEgEQCAAKALIARAICyAALADDAUEASARAIAAoArgBEAgLIAAsALMBQQBIBEAgACgCqAEQCAsgACwAowFBAEgEQCAAKAKYARAICyAALACTAUEASARAIAAoAogBEAgLIAAsAIMBQQBIBEAgACgCeBAICyAALABzQQBIBEAgACgCaBAICyAALABjQQBIBEAgACgCWBAICyAALABTQQBIBEAgACgCSBAICyAALABDQQBIBEAgACgCOBAICyAALAAzQQBIBEAgACgCKBAICyAALAAjQQBIBEAgACgCGBAICyAALAATQQBIBEAgACgCCBAI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aigCACEEIAAoAiAiBSAAKAIETwRAIAQgBU8NBCACIAMoAhg2AhggAiADKQIQNwMQIAIgAykCCDcDCCACIAMpAgA3AwAgAyABKAIYNgIYIAMgASkCEDcCECADIAEpAgg3AgggAyABKQIANwIAIAEgAigCGDYCGCABIAIpAxA3AhAgASACKQMINwIIIAEgAikDADcCACAAKAIgIAAoAgRPDQQgAiAAKAIYNgIYIAIgACkCEDcDECACIAApAgg3AwggAiAAKQIANwMAIAAgAygCGDYCGCAAIAMpAhA3AhAgACADKQIINwIIIAAgAykCADcCACADIAIoAhg2AhggAyACKQMQNwIQIAMgAikDCDcCCCADIAIpAwA3AgAMBAsgBCAFSQRAIAIgACgCGDYCGCACIAApAhA3AxAgAiAAKQIINwMIIAIgACkCADcDACAAIAEoAhg2AhggACABKQIQNwIQIAAgASkCCDcCCCAAIAEpAgA3AgAgASACKAIYNgIYIAEgAikDEDcCECABIAIpAwg3AgggASACKQMANwIADAQLIAIgACgCGDYCGCACIAApAhA3AxAgAiAAKQIINwMIIAIgACkCADcDACAAIAMoAhg2AhggACADKQIQNwIQIAAgAykCCDcCCCAAIAMpAgA3AgAgAyACKAIYNgIYIAMgAikDEDcCECADIAIpAwg3AgggAyACKQMANwIAIAEoAgQgACgCIE8NAyACIAMoAhg2AhggAiADKQIQNwMQIAIgAykCCDcDCCACIAMpAgA3AwAgAyABKAIYNgIYIAMgASkCEDcCECADIAEpAgg3AgggAyABKQIANwIAIAEgAigCGDYCGCABIAIpAxA3AhAgASACKQMINwIIIAEgAikDADcCAAwDCyAAIABBHGogAEE4aiABQRxrEEoaDAILIAAgAEEcaiIDIABBOGoiBCAAQdQAaiIFEEoaIAFBGGsoAgAgACgCWE8NASACIAUoAhg2AhggAiAFKQIQNwMQIAIgBSkCCDcDCCACIAUpAgA3AwAgBSABQRxrIgFBGGooAgA2AhggBSABKQIQNwIQIAUgASkCCDcCCCAFIAEpAgA3AgAgASACKAIYNgIYIAEgAikDEDcCECABIAIpAwg3AgggASACKQMANwIAIAAoAlggACgCPE8NASACIAQoAhg2AhggAiAEKQIQNwMQIAIgBCkCCDcDCCACIAQpAgA3AwAgBCAFKAIYNgIYIAQgBSkCEDcCECAEIAUpAgg3AgggBCAFKQIANwIAIAUgAigCGDYCGCAFIAIpAxA3AhAgBSACKQMINwIIIAUgAikDADcCACAAKAI8IAAoAiBPDQEgAiADKAIYNgIYIAIgAykCEDcDECACIAMpAgg3AwggAiADKQIANwMAIAMgBCgCGDYCGCADIAQpAhA3AhAgAyAEKQIINwIIIAMgBCkCADcCACAEIAIoAhg2AhggBCACKQMQNwIQIAQgAikDCDcCCCAEIAIpAwA3AgAgACgCICAAKAIETw0BIAIgACgCGDYCGCACIAApAhA3AxAgAiAAKQIINwMIIAIgACkCADcDACAAIAMoAhg2AhggACADKQIQNwIQIAAgAykCCDcCCCAAIAMpAgA3AgAgAyACKAIYNgIYIAMgAikDEDcCECADIAIpAwg3AgggAyACKQMANwIADAELIABBHGohBCAAQThqIQMgACgCPCEFAkAgACgCICIHIAAoAgQiCE8EQCAFIAdPDQEgAiAEKAIYNgIYIAIgBCkCEDcDECACIAQpAgg3AwggAiAEKQIANwMAIAQgA0EYaigCADYCGCAEIANBEGopAgA3AhAgBCADQQhqKQIANwIIIAQgAykCADcCACADIAIoAhg2AhggAyACKQMQNwIQIAMgAikDCDcCCCADIAIpAwA3AgAgACgCICAITw0BIAIgACgCGDYCGCACIAApAhA3AxAgAiAAKQIINwMIIAIgACkCADcDACAAIAQoAhg2AhggACAEKQIQNwIQIAAgBCkCCDcCCCAAIAQpAgA3AgAgBCACKAIYNgIYIAQgAikDEDcCECAEIAIpAwg3AgggBCACKQMANwIADAELIAUgB0kEQCACIAAoAhg2AhggAiAAKQIQNwMQIAIgACkCCDcDCCACIAApAgA3AwAgACADQRhqKAIANgIYIAAgA0EQaikCADcCECAAIANBCGopAgA3AgggACADKQIANwIAIAMgAigCGDYCGCADIAIpAxA3AhAgAyACKQMINwIIIAMgAikDADcCAAwBCyACIAAoAhg2AhggAiAAKQIQNwMQIAIgACkCCDcDCCACIAApAgA3AwAgACAEKAIYNgIYIAAgBCkCEDcCECAAIAQpAgg3AgggACAEKQIANwIAIAQgAigC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ASABICe7OQOgASABQdAAaiABQeABaiABQaABahB0IQYgAkEASgRAQQAhCANAIAIgCGwhDyAIskMAAAA/krshPEEAIQUDQCABIDw5AyggASABKQMoNwMIIAEgBbJDAAAAP5K7OQMgIAEgASkDIDcDACABQUBrIAYgARA8QQAhAyABKwNAEEIhDiABKwNIEEIhCwJAIA5BAEgNACALQQBIDQAgBygCBCIRIA5MDQAgBygCCCALTA0AIAcoAgAgCyARbCAOakECdCANamotAAAhAwsgEiAFIA9qaiADRToAACAFQQFqIgUgAkcNAAsgCEEBaiIIIAJHDQALCwsjAEHAAWsiAiQAIAJCgICAgICAgPA/NwOoASACQoCAgICAgIDwPzcDOCACQoCAgICAgIDwPzcDoAEgAkKAgICAgICA8D83AzAgAkGwAWogBiACQTBqEDwgAisDsAEhPCAEIAIrA7gBtjgCeCAEIDy2OAJ0IAQoApQBIQMgAkKAgICAgICA8D83A4gBIAIgAikDiAE3AyggAiADskMAAAC/krs5A4ABIAIgAikDgAE3AyAgAkGQAWogBiACQSBqEDwgAisDkAEhPCAEIAIrA5gBtjgCgAEgBCA8tjgCfCACIAQoApQBskMAAAC/krsiPDkDaCACIAIpA2g3AxggAiA8OQNgIAIgAikDYDcDECACQfAAaiAGIAJBEGoQPCACKwNwITwgBCACKwN4tjgCiAEgBCA8tjgChAEgAiAEKAKUAbJDAAAAv5K7OQNIIAIgAikDSDcDCCACQoCAgICAgIDwPzcDQCACQoCAgICAgIDwPzcDACACQdAAaiAGIAIQPCACKwNQITwgBCACKwNYtjgCkAEgBCA8tjgCjAEgAkHAAWokACABQaACaiQADAELIwBBkAFrIgUkACAJKAIkIQ8gCSgCDCELIAQoApQBIQMgBUEgakEAQdAAEA0aIAQqAjwhKSAEKgIsIScgA0ECbSEWIAQqAjghKyAEKgI0ISggBCoCKCEkIAQqAjAhKiAFQRRqIg0gDzYCCCANIAs2AgQgDUGg4AA2AgAgBSAEKQIAIjs3AwggBCgClAEiBkECbSEHIDunviImEAshASA7QiCIp74iJRALIQIgEiAHIAZBAWpsagJ/QQEgAUEASA0AGkEBIAJBAEgNABpBASABIAsoAgQiBk4NABpB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QQAhB0EAIQoDQCANIAdBAXIgAWpqLQAAQQFxIA0gASAHamotAABBAXRBAnEgCkECdHJyIQogB0ECaiIHIAZHDQALIAggASACayAGbUECdGogCjYCACABIAZqIgEgBEkNAAsLAkAgDyALQQRqIA4gA2sQc0UEQCAQQQA2AlAgEEIANwJIDAELAkAgCygCCCIIIAsoAgQiDmtBAnUiASADSQRAIAtBBGogAyABaxA2IAsoAgghCCALKAIEIQ4MAQsgASADTQ0AIAsgDiADQQJ0aiIINgIICwJAAkAgCCAORgRAQQAhB0EAIQFBACEKDAELIAZBAWshAkEBIAZ0IgFBAmshESABQQFrIRRBACEKQQAhAUEAIQcDQCAOKAIAIg1FDQIgDSAURg0CAkAgDUEBRgRAIAIhAwNAAkAgByAKSQRAIAdBADoAACAHQQFqIQcMAQsgByABayIEQQFqIgdBAEgNCSAEQf////8HIAogAWsiCkEBdCINIAcgByANSRsgCkH/////A08bIgcEfyAHEAoFQQALIgpqIg1BADoAACAHIAogASAEEA4iBGohCiANQQFqIQcgAQRAIAEQCAsgBCEBCyADQQFrIgMNAAsMAQsgAiEEIAYhAyANIBFGBEADQEF/IARBAWsiBHZBAXEhAyAHIApJBEAgByADOgAAIAdBAWohByAEDQEMAwsgByABayIHQQFqIg1BAEgNCCAHQf////8HIAogAWsiCkEBdCIPIA0gDSAPSRsgCkH/////A08bIgoEfyAKEAoFQQALIg1qIg8gAzoAACANIAEgBxAOIgMgCmohCiAPQQFqIQcgAQRAIAEQCAsgAyEBIAQNAAwCCwALA0AgDSADQQFrIgN2QQFxIQQCQCAHIApJBEAgByAEOgAAIAdBAWohBwwBCyAHIAFrIgdBAWoiD0EASA0IIAdB/////wcgCiABayIKQQF0IgwgDyAMIA9LGyAKQf////8DTxsiCgR/IAoQCgVBAAsiD2oiDCAEOgAAIA8gASAHEA4iBCAKaiEKIAxBAWohByABBEAgARAICyAEIQELIAMNAAsLIA5BBGoiDiAIRw0ACwsgECAKNgJQIBAgBzYCTCAQIAE2AkgMAQsgEEEANgJQIBBCADcCSCABRQ0AIAEQCAsgCygCBCIBRQ0AIAsgATYCCCABEAgLIAtBEGokAAwBCxAAAAsCQCAQKAJIIgEgECgCTEYEQCAJQfcKNgJkIABBADoAQCAAQQA6AAAMAQsgEEEIaiELQQAhCCMAQTBrIgkkACAJQQA2AiggCUIANwMgIwBBEGsiAyQAIANBgAE2AgwCQCAJQSBqIgEtAAtBB3YEfyABKAIIQf////8HcUEBawVBCgtBgAFPDQAgAwJ/IAEtAAtBB3YEQCABKAIEDAELIAEtAAtB/wBxCzYCCCMAQRBrIgIkACADQQxqIgQoAgAgA0EIaiIGKAIASSEHIAJBEGokACABLQALQQd2BH8gASgCCEH/////B3FBAWsFQQoLIAYgBCAHGygCACICQQtPBH8gAkEQakFwcSICIAJBAWsiAiACQQtGGwVBCgsiBEYNACMAQRBrIgIkACABLQALQQd2BH8gASgCCEH/////B3FBAWsFQQoLIQYCfyABLQALQQd2BEAgASgCBAwBCyABLQALQf8AcQshCgJAAn8gBEELSSINBEBBASEHIARBAWohBiABIgQoAgAMAQsCfyAEIAZLBEAgAkEIaiABIARBAWoQPyACKAIIIQQgAigCDAwBCyACQQhqIAEgBEEBahA/IAIoAggiBEUNAiACKAIMCyEGAn8gAS0AC0EHdiIHBEAgASgCAAwBCyABCwshDiAEIA4CfyABLQALQQd2BEAgASgCBAwBCyABLQALQf8AcQtBAWoQMyAHBEAgDhAICwJAIA1FBEAgASABKAIIQYCAgIB4cSAGQf////8HcXI2AgggASABKAIIQYCAgIB4cjYCCCABIAo2AgQgASAENgIADAELIAEgAS0AC0GAAXEgCnI6AAsgASABLQALQf8AcToACwsLIAJBEGokAAsgA0EQaiQAAkACQCAQKAJMIg0gECgCSCICa0EVSQ0AIAItAARBAXEgAi0AA0EBcSACLQACQQF0QQJxIAItAABBAXRBAnEgAi0AAUEBcXJBAnRyckEBdHJBHUcNACACLQAJQQFxIAItAAhBAXEgAi0AB0EBdEECcSACLQAFQQF0QQJxIAItAAZBAXFyQQJ0cnJBAXRyQR1HDQAgC0IANwIAIAtBAToAPCALQQA6ADggC0IANwIIIAtCADcCECALQQA6ABgMAQsgCUIANwMYIAlCADcDECAJQgA3AwgCQAJAIAIgDUYNAANAIAItAAAhFCAIIAkoAhhq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fCAEIBN+IhEgCiAQfnwiDyARVK1CIIYgD0IgiIR8IA4gDiAPQiCGfCIOVq18IA4gDiAUQv////8PgyIUIAp+IhEgAiALfnwiDyARVK0gDyAPIBMgDEL+////D4MiEX58Ig9WrXx8Ig5WrXwgDiAEIBR+IhggECARfnwiBCACIAp+fCIKIAsgE358IhBCIIggCiAQVq0gBCAYVK0gBCAKVq18fEIghoR8IgQgDlStfCAEIA8gAiARfiICIAsgFH58IgtCIIggAiALVq1CIIaEfCICIA9UrSACIBBCIIZ8IAJUrXx8IgIgBFStfCIEQv////////8AWARAIBYgF4QhFSAFQdAAaiACIAQgAyASEBwgAUIxhiAFKQNYfSAFKQNQIgFCAFKtfSEKQgAgAX0hCyAGQf7/AGoMAQsgBUHgAGogBEI/hiACQgGIhCICIARCAYgiBCADIBIQHCABQjCGIAUpA2h9IAUpA2AiDEIAUq19IQpCACAMfSELIAEhDCAGQf//AGoLIgZB//8BTgRAIA1CgICAgICAwP//AIQhDUIAIQEMAQsCfiAGQQBKBEAgCkIBhiALQj+IhCEKIARC////////P4MgBq1CMIaEIQwgC0IBhgwBCyAGQY9/TARAQgAhAQwCCyAFQUBrIAIgBEEBIAZrEDkgBUEwaiAMIBUgBkHwAGoQHSAFQSBqIAMgEiAFKQNAIgIgBSkDSCIMEBwgBSkDOCAFKQMoQgGGIAUpAyAiAUI/iIR9IAUpAzAiBCABQgGGIgFUrX0hCiAEIAF9CyEEIAVBEGogAyASQgNCABAcIAUgAyASQgVCABAcIAwgAiACIAMgAkIBgyIBIAR8IgNUIAogASADVq18IgEgElYgASASURutfCICVq18IgQgAiACIARCgICAgICAwP//AFQgAyAFKQMQViABIAUpAxgiBFYgASAEURtxrXwiAlatfCIEIAIgBEKAgICAgIDA//8AVCADIAUpAwBWIAEgBSkDCCIDViABIANRG3GtfCIBIAJUrXwgDYQhDQsgACABNwMAIAAgDTcDCCAFQdACaiQAC8ABAgF/An5BfyEDAkAgAEIAUiABQv///////////wCDIgRCgICAgICAwP//AFYgBEKAgICAgIDA//8AURsNACACQv///////////wCDIgVCgICAgICAwP//AFYgBUKAgICAgIDA//8AUnENACAAIAQgBYSEUARAQQAPCyABIAKDQgBZBEAgASACUiABIAJTcQ0BIAAgASAChYRCAFIPCyAAQgBSIAEgAlUgASACURsNACAAIAEgAoWEQgBSIQMLIAMLqgsBBn8gACABaiEFAkACQCAAKAIEIgJBAXENACACQQNxRQ0BIAAoAgAiAiABaiEBAkAgACACayIAQZDDASgCAEcEQCACQf8BTQRAIAJBA3YhAiAAKAIIIgQgACgCDCIDRw0CQfzCAUH8wgEoAgBBfiACd3E2AgAMAwsgACgCGCEGAkAgACAAKAIMIgJHBEBBjMMBKAIAGiAAKAIIIgMgAjYCDCACIAM2AggMAQsCQCAAQRRqIgQoAgAiAw0AIABBEGoiBCgCACIDDQBBACECDAELA0AgBCEHIAMiAkEUaiIEKAIAIgMNACACQRBqIQQgAigCECIDDQALIAdBADYCAAsgBkUNAgJAIAAoAhwiBEECdEGsxQFqIgMoAgAgAEYEQCADIAI2AgAgAg0BQYDDAUGAwwEoAgBBfiAEd3E2AgAMBAsgBkEQQRQgBigCECAARhtqIAI2AgAgAkUNAwsgAiAGNgIYIAAoAhAiAwRAIAIgAzYCECADIAI2AhgLIAAoAhQiA0UNAiACIAM2AhQgAyACNgIYDAILIAUoAgQiAkEDcUEDRw0BQYTDASABNgIAIAUgAkF+cTYCBCAAIAFBAXI2AgQgBSABNgIADwsgBCADNgIMIAMgBDYCCAsCQCAFKAIEIgJBAnFFBEBBlMMBKAIAIAVGBEBBlMMBIAA2AgBBiMMBQYjDASgCACABaiIBNgIAIAAgAUEBcjYCBCAAQZDDASgCAEcNA0GEwwFBADYCAEGQwwFBADYCAA8LQZDDASgCACAFRgRAQZDDASAANgIAQYTDAUGEwwEoAgAgAWoiATYCACAAIAFBAXI2AgQgACABaiABNgIADwsgAkF4cSABaiEBAkAgAkH/AU0EQCACQQN2IQIgBSgCDCIDIAUoAggiBEYEQEH8wgFB/MIBKAIAQX4gAndxNgIADAILIAQgAzYCDCADIAQ2AggMAQsgBSgCGCEGAkAgBSAFKAIMIgJHBEBBjMMBKAIAGiAFKAIIIgMgAjYCDCACIAM2AggMAQsCQCAFQRRqIgMoAgAiBA0AIAVBEGoiAygCACIEDQBBACECDAELA0AgAyEHIAQiAkEUaiIDKAIAIgQNACACQRBqIQMgAigCECIEDQALIAdBADYCAAsgBkUNAAJAIAUoAhwiBEECdEGsxQFqIgMoAgAgBUYEQCADIAI2AgAgAg0BQYDDAUGAwwEoAgBBfiAEd3E2AgAMAgsgBkEQQRQgBigCECAFRhtqIAI2AgAgAkUNAQsgAiAGNgIYIAUoAhAiAwRAIAIgAzYCECADIAI2AhgLIAUoAhQiA0UNACACIAM2AhQgAyACNgIYCyAAIAFBAXI2AgQgACABaiABNgIAIABBkMMBKAIARw0BQYTDASABNgIADwsgBSACQX5xNgIEIAAgAUEBcjYCBCAAIAFqIAE2AgALIAFB/wFNBEAgAUF4cUGkwwFqIQICf0H8wgEoAgAiA0EBIAFBA3Z0IgFxRQRAQfzCASABIANyNgIAIAIMAQsgAigCCAshASACIAA2AgggASAANgIMIAAgAjYCDCAAIAE2AggPC0EfIQQgAUH///8HTQRAIAFBJiABQQh2ZyICa3ZBAXEgAkEBdGtBPmohBAsgACAENgIcIABCADcCECAEQQJ0QazFAWohBwJAAkBBgMMBKAIAIgNBASAEdCICcUUEQEGAwwEgAiADcjYCACAHIAA2AgAgACAHNgIYDAELIAFBGSAEQQF2a0EAIARBH0cbdCEEIAcoAgAhAgNAIAIiAygCBEF4cSABRg0CIARBHXYhAiAEQQF0IQQgAyACQQRxaiIHQRBqKAIAIgINAAsgByAANgIQIAAgAzYCGAsgACAANgIMIAAgADYCCA8LIAMoAggiASAANgIMIAMgADYCCCAAQQA2AhggACADNgIMIAAgATYCCAsLmQIAIABFBEBBAA8LAn8CQCAABH8gAUH/AE0NAQJAQdTCASgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAgwECyABQYBAcUGAwANHIAFBgLADT3FFBEAgACABQT9xQYABcjoAAiAAIAFBDHZB4AFyOgAAIAAgAUEGdkE/cUGAAXI6AAFBAwwECyABQYCABGtB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBAwECwtBuMEBQRk2AgBBfwVBAQsMAQsgACABOgAAQQELC0MAAkAgAEUNAAJAAkACQAJAIAFBAmoOBgABAgIEAwQLIAAgAjwAAA8LIAAgAj0BAA8LIAAgAj4CAA8LIAAgAjcDAAsLIwEBfyAAQeg5NgIAIAAoAgQiAQRAIAAgATYCCCABEAgLIAALEQAgACABIAJB8ABB8QAQbBoLxAIAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUEJaw4SAAoLDAoLAgMEBQwLDAwKCwcICQsgAiACKAIAIgFBBGo2AgAgACABKAIANgIADwsACyACIAIoAgAiAUEEajYCACAAIAEyAQA3AwAPCyACIAIoAgAiAUEEajYCACAAIAEzAQA3AwAPCyACIAIoAgAiAUEEajYCACAAIAEwAAA3AwAPCyACIAIoAgAiAUEEajYCACAAIAExAAA3AwAPCwALIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASsDADkDAA8LIAAgAiADEQIACw8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCAEEHakF4cSIBQQhqNgIAIAAgASkDADcDAAtyAQN/IAAoAgAsAABBMGtBCk8EQEEADwsDQCAAKAIAIQNBfyEBIAJBzJmz5gBNBEBBfyADLAAAQTBrIgEgAkEKbCICaiABIAJB/////wdzShshAQsgACADQQFqNgIAIAEhAiADLAABQTBrQQpJDQALIAIL6BICEn8BfiMAQdAAayIIJAAgCCABNgJMIAhBN2ohFyAIQThqIRICQAJAAkACQANAIAEhDCAHIA5B/////wdzSg0BIAcgDmohDgJAAkACQCAMIgctAAAiCQRAA0ACQAJAIAlB/wFxIgFFBEAgByEBDAELIAFBJUcNASAHIQkDQCAJLQABQSVHBEAgCSEBDAILIAdBAWohByAJLQACIQsgCUECaiIBIQkgC0ElRg0ACwsgByAMayIHIA5B/////wdzIhhKDQcgAARAIAAgDCAHEBYLIAcNBiAIIAE2AkwgAUEBaiEHQX8hDwJAIAEsAAFBMGtBCk8NACABLQACQSRHDQAgAUEDaiEHIAEsAAFBMGshD0EBIRMLIAggBzYCTEEAIQ0CQCAHLAAAIglBIGsiAUEfSwRAIAchCwwBCyAHIQtBASABdCIBQYnRBHFFDQADQCAIIAdBAWoiCzYCTCABIA1yIQ0gBywAASIJQSBrIgFBIE8NASALIQdBASABdCIBQYnRBHENAAsLAkAgCUEqRgRAAn8CQCALLAABQTBrQQpPDQAgCy0AAkEkRw0AIAssAAFBAnQgBGpBwAFrQQo2AgAgC0EDaiEJQQEhEyALLAABQQN0IANqQYADaygCAAwBCyATDQYgC0EBaiEJIABFBEAgCCAJNgJMQQAhE0EAIRAMAwsgAiACKAIAIgFBBGo2AgBBACETIAEoAgALIRAgCCAJNgJMIBBBAE4NAUEAIBBrIRAgDUGAwAByIQ0MAQsgCEHMAGoQnAEiEEEASA0IIAgoAkwhCQtBACEHQX8hCgJ/IAktAABBLkcEQCAJIQFBAAwBCyAJLQABQSpGBEACfwJAIAksAAJBMGtBCk8NACAJLQADQSRHDQAgCSwAAkECdCAEakHAAWtBCjYCACAJQQRqIQEgCSwAAkEDdCADakGAA2soAgAMAQsgEw0GIAlBAmohAUEAIABFDQAaIAIgAigCACILQQRqNgIAIAsoAgALIQogCCABNgJMIApBf3NBH3YMAQsgCCAJQQFqNgJMIAhBzABqEJwBIQogCCgCTCEBQQELIRQDQCAHIRVBHCELIAEiESwAACIHQfsAa0FGSQ0JIBFBAWohASAHIBVBOmxqQY/lAGotAAAiB0EBa0EISQ0ACyAIIAE2AkwCQAJAIAdBG0cEQCAHRQ0LIA9BAE4EQCAEIA9BAnRqIAc2AgAgCCADIA9BA3RqKQMANwNADAILIABFDQggCEFAayAHIAIgBhCbAQwCCyAPQQBODQoLQQAhByAARQ0HCyANQf//e3EiCSANIA1BgMAAcRshDUEAIQ9BwQghFiASIQsCQAJAAkACfwJAAkACQAJAAn8CQAJAAkACQAJAAkACQCARLAAAIgdBX3EgByAHQQ9xQQNGGyAHIBUbIgdB2ABrDiEEFBQUFBQUFBQOFA8GDg4OFAYUFBQUAgUDFBQJFAEUFAQACwJAIAdBwQBrDgcOFAsUDg4OAAsgB0HTAEYNCQwTCyAIKQNAIRlBwQgMBQtBACEHAkACQAJAAkACQAJAAkAgFUH/AXEOCAABAgMEGgUGGgsgCCgCQCAONgIADBkLIAgoAkAgDjYCAAwYCyAIKAJAIA6sNwMADBcLIAgoAkAgDjsBAAwWCyAIKAJAIA46AAAMFQsgCCgCQCAONgIADBQLIAgoAkAgDqw3AwAMEwtBCCAKIApBCE0bIQogDUEIciENQfgAIQcLIBIhDCAHQSBxIREgCCkDQCIZQgBSBEADQCAMQQFrIgwgGadBD3FBoOkAai0AACARcjoAACAZQg9WIQkgGUIEiCEZIAkNAAsLIAgpA0BQDQMgDUEIcUUNAyAHQQR2QcEIaiEWQQIhDwwDCyASIQcgCCkDQCIZQgBSBEADQCAHQQFrIgcgGadBB3FBMHI6AAAgGUIHViEMIBlCA4ghGSAMDQALCyAHIQwgDUEIcUUNAiAKIBIgDGsiB0EBaiAHIApIGyEKDAILIAgpA0AiGUIAUwRAIAhCACAZfSIZNwNAQQEhD0HBCAwBCyANQYAQcQRAQQEhD0HCCAwBC0HDCEHBCCANQQFxIg8bCyEWIBkgEhBBIQwLIBRBACAKQQBIGw0OIA1B//97cSANIBQbIQ0CQCAIKQNAIhlCAFINACAKDQAgEiEMQQAhCgwMCyAKIBlQIBIgDGtqIgcgByAKSBshCgwLCyAIKAJAIgdBihMgBxsiDEH/////ByAKIApB/////wdPGyILEKgBIgcgDGsgCyAHGyIHIAxqIQsgCkEATgRAIAkhDSAHIQoMCwsgCSENIAchCiALLQAADQ0MCgsgCgRAIAgoAkAMAgtBACEHIABBICAQQQAgDRAeDAILIAhBADYCDCAIIAgpA0A+AgggCCAIQQhqIgc2AkBBfyEKIAcLIQlBACEHAkADQCAJKAIAIgxFDQECQCAIQQRqIAwQlwEiC0EASCIMDQAgCyAKIAdrSw0AIAlBBGohCSAKIAcgC2oiB0sNAQwCCwsgDA0NC0E9IQsgB0EASA0LIABBICAQIAcgDRAeIAdFBEBBACEHDAELQQAhCyAIKAJAIQkDQCAJKAIAIgxFDQEgCEEEaiAMEJcBIgwgC2oiCyAHSw0BIAAgCEEEaiAMEBYgCUEEaiEJIAcgC0sNAAsLIABBICAQIAcgDUGAwABzEB4gECAHIAcgEEgbIQcMCAsgFEEAIApBAEgbDQhBPSELIAAgCCsDQCAQIAogDSAHIAUREQAiB0EATg0HDAkLIAggCCkDQDwAN0EBIQogFyEMIAkhDQwECyAHLQABIQkgB0EBaiEHDAALAAsgAA0HIBNFDQJBASEHA0AgBCAHQQJ0aigCACIABEAgAyAHQQN0aiAAIAIgBhCbAUEBIQ4gB0EBaiIHQQpHDQEMCQsLQQEhDiAHQQpPDQcDQCAEIAdBAnRqKAIADQEgB0EBaiIHQQpHDQALDAcLQRwhCwwECyAKIAsgDGsiESAKIBFKGyIJIA9B/////wdzSg0CQT0hCyAQIAkgD2oiCiAKIBBIGyIHIBhKDQMgAEEgIAcgCiANEB4gACAWIA8QFiAAQTAgByAKIA1BgIAEcxAeIABBMCAJIBFBABAeIAAgDCAREBYgAEEgIAcgCiANQYDAAHMQHgwBCwtBACEODAMLQT0hCwtBuMEBIAs2AgALQX8hDgsgCEHQAGokACAOC38CAX8BfiAAvSIDQjSIp0H/D3EiAkH/D0cEfCACRQRAIAEgAEQAAAAAAAAAAGEEf0EABSAARAAAAAAAAPBDoiABEJ4BIQAgASgCAEFAags2AgAgAA8LIAEgAkH+B2s2AgAgA0L/////////h4B/g0KAgICAgICA8D+EvwUgAAsLWQEBfyAAIAAoAkgiAUEBayABcjYCSCAAKAIAIgFBCHEEQCAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALjAQCBH8BfgJAAkACQAJAAkACfyAAKAIEIgIgACgCaEcEQCAAIAJBAWo2AgQgAi0AAAwBCyAAEA8LIgJBK2sOAwABAAELIAJBLUYhBQJ/IAAoAgQiAyAAKAJoRwRAIAAgA0EBajYCBCADLQAADAELIAAQDwsiA0E6ayEEIAFFDQEgBEF1Sw0BIAApA3BCAFMNAiAAIAAoAgRBAWs2AgQMAgsgAkE6ayEEIAIhAwsgBEF2SQ0AIANBMGsiBEEKSQRAQQAhAgNAIAMgAkEKbGohAQJ/IAAoAgQiAiAAKAJoRwRAIAAgAkEBajYCBCACLQAADAELIAAQDwsiA0EwayIEQQlNIAFBMGsiAkHMmbPmAEhxDQALIAKsIQYLAkAgBEEKTw0AA0AgA60gBkIKfnxCMH0hBgJ/IAAoAgQiASAAKAJoRwRAIAAgAUEBajYCBCABLQAADAELIAAQDwsiA0EwayIEQQlLDQEgBkKuj4XXx8LrowFTDQALCyAEQQpJBEADQAJ/IAAoAgQiASAAKAJoRwRAIAAgAUEBajYCBCABLQAADAELIAAQDwtBMGtBCkkNAAsLIAApA3BCAFkEQCAAIAAoAgRBAWs2AgQLQgAgBn0gBiAFGyEGDAELQoCAgICAgICAgH8hBiAAKQNwQgBTDQAgACAAKAIEQQFrNgIEQoCAgICAgICAgH8PCyAGC50yAw9/B34BfCMAQTBrIgwkAAJAIAJBAk0EQCACQQJ0IgJBvOUAaigCACEPIAJBsOUAaigCACEOA0ACfyABKAIEIgIgASgCaEcEQCABIAJBAWo2AgQgAi0AAAwBCyABEA8LIgJBIEYgAkEJa0EFSXINAAtBASEGAkACQCACQStrDgMAAQABC0F/QQEgAkEtRhshBiABKAIEIgIgASgCaEcEQCABIAJBAWo2AgQgAi0AACECDAELIAEQDyECCwJAAkADQCAFQZAIaiwAACACQSByRgRAAkAgBUEGSw0AIAEoAgQiAiABKAJoRwRAIAEgAkEBajYCBCACLQAAIQIMAQsgARAPIQILIAVBAWoiBUEIRw0BDAILCyAFQQNHBEAgBUEIRg0BIANFDQIgBUEESQ0CIAVBCEYNAQsgASkDcCITQgBZBEAgASABKAIEQQFrNgIECyADRQ0AIAVBBEkNACATQgBTIQIDQCACRQRAIAEgASgCBEEBazYCBAsgBUEBayIFQQNLDQALC0IAIRMjAEEQayICJAACfiAGskMAAIB/lLwiA0H/////B3EiAUGAgIAEa0H////3B00EQCABrUIZhkKAgICAgICAwD98DAELIAOtQhmGQoCAgICAgMD//wCEIAFBgICA/AdPDQAaQgAgAUUNABogAiABrUIAIAFnIgFB0QBqEB0gAikDACETIAIpAwhCgICAgICAwACFQYn/ACABa61CMIaECyEUIAwgEzcDACAMIBQgA0GAgICAeHGtQiCGhDcDCCACQRBqJAAgDCkDCCETIAwpAwAhFAwCCwJAAkACQCAFDQBBACEFA0AgBUHZDGosAAAgAkEgckcNAQJAIAVBAUsNACABKAIEIgIgASgCaEcEQCABIAJBAWo2AgQgAi0AACECDAELIAEQDyECCyAFQQFqIgVBA0cNAAsMAQsCQAJAIAUOBAABAQIBCwJAIAJBMEcNAAJ/IAEoAgQiBSABKAJoRwRAIAEgBUEBajYCBCAFLQAADAELIAEQDwtBX3FB2ABGBEAjAEGwA2siAiQAAn8gASgCBCIFIAEoAmhHBEAgASAFQQFqNgIEIAUtAAAMAQsgARAPCyEFAkACfwNAIAVBMEcEQAJAIAVBLkcNBCABKAIEIgUgASgCaEYNACABIAVBAWo2AgQgBS0AAAwDCwUgASgCBCIFIAEoAmhHBH9BASEJIAEgBUEBajYCBCAFLQAABUEBIQkgARAPCyEFDAELCyABEA8LIQVBASEEIAVBMEcNAANAIBZCAX0hFgJ/IAEoAgQiBSABKAJoRwRAIAEgBUEBajYCBCAFLQAADAELIAEQDwsiBUEwRg0AC0EBIQkLQoCAgICAgMD/PyEUA0ACQCAFQSByIQsCQAJAIAVBMGsiCEEKSQ0AIAVBLkcgC0HhAGtBBk9xDQIgBUEuRw0AIAQNAkEBIQQgEyEWDAELIAtB1wBrIAggBUE5ShshBQJAIBNCB1cEQCAFIApBBHRqIQoMAQsgE0IcWARAIAJBMGogBRAnIAJBIGogGCAUQgBCgICAgICAwP0/EBAgAkEQaiACKQMwIAIpAzggAikDICIYIAIpAygiFBAQIAIgAikDECACKQMYIBUgFxAmIAIpAwghFyACKQMAIRUMAQsgBUUNACAHDQAgAkHQAGogGCAUQgBCgICAgICAgP8/EBAgAkFAayACKQNQIAIpA1ggFSAXECYgAikDSCEXQQEhByACKQNAIRULIBNCAXwhE0EBIQkLIAEoAgQiBSABKAJoRwR/IAEgBUEBajYCBCAFLQAABSABEA8LIQUMAQsLAn4gCUUEQAJAAkAgASkDcEIAWQRAIAEgASgCBCIFQQFrNgIEIANFDQEgASAFQQJrNgIEIARFDQIgASAFQQNrNgIEDAILIAMNAQsgAUIAEC0LIAJB4ABqIAa3RAAAAAAAAAAAohAuIAIpA2AhFSACKQNoDAELIBNCB1cEQCATIRQDQCAKQQR0IQogFEIBfCIUQghSDQALCwJAAkACQCAFQV9xQdAARgRAIAEgAxCgASIUQoCAgICAgICAgH9SDQMgAwRAIAEpA3BCAFkNAgwDC0IAIRUgAUIAEC1CAAwEC0IAIRQgASkDcEIAUw0CCyABIAEoAgRBAWs2AgQLQgAhFAsgCkUEQCACQfAAaiAGt0QAAAAAAAAAAKIQLiACKQNwIRUgAikDeAwBCyAWIBMgBBtCAoYgFHxCIH0iE0EAIA9rrVUEQEG4wQFBxAA2AgAgAkGgAWogBhAnIAJBkAFqIAIpA6ABIAIpA6gBQn9C////////v///ABAQIAJBgAFqIAIpA5ABIAIpA5gBQn9C////////v///ABAQIAIpA4ABIRUgAikDiAEMAQsgD0HiAWusIBNXBEAgCkEATgRAA0AgAkGgA2ogFSAXQgBCgICAgICAwP+/fxAmIBUgF0KAgICAgICA/z8QlQEhASACQZADaiAVIBcgAikDoAMgFSABQQBOIgEbIAIpA6gDIBcgARsQJiATQgF9IRMgAikDmAMhFyACKQOQAyEVIApBAXQgAXIiCkEATg0ACwsCfiATIA+sfUIgfCIUpyIBQQAgAUEAShsgDiAUIA6tUxsiAUHxAE4EQCACQYADaiAGECcgAikDiAMhFiACKQOAAyEYQgAMAQsgAkHgAmpBkAEgAWsQbhAuIAJB0AJqIAYQJyACQfACaiACKQPgAiACKQPoAiACKQPQAiIYIAIpA9gCIhYQpAEgAikD+AIhGSACKQPwAgshFCACQcACaiAKIApBAXFFIBUgF0IAQgAQOkEARyABQSBIcXEiAWoQQCACQbACaiAYIBYgAikDwAIgAikDyAIQECACQZACaiACKQOwAiACKQO4AiAUIBkQJiACQaACaiAYIBZCACAVIAEbQgAgFyABGxAQIAJBgAJqIAIpA6ACIAIpA6gCIAIpA5ACIAIpA5gCECYgAkHwAWogAikDgAIgAikDiAIgFCAZEGkgAikD8AEiFCACKQP4ASIWQgBCABA6RQRAQbjBAUHEADYCAAsgAkHgAWogFCAWIBOnEKMBIAIpA+ABIRUgAikD6AEMAQtBuMEBQcQANgIAIAJB0AFqIAYQJyACQcABaiACKQPQASACKQPYAUIAQoCAgICAgMAAEBAgAkGwAWogAikDwAEgAikDyAFCAEKAgICAgIDAABAQIAIpA7ABIRUgAikDuAELIRMgDCAVNwMQIAwgEzcDGCACQbADaiQAIAwpAxghEyAMKQMQIRQMBgsgASkDcEIAUw0AIAEgASgCBEEBazYCBAsgASEFIAYhCiADIQlBACEBQQAhBiMAQZDGAGsiBCQAQQAgD2siECAOayESAkACfwNAAkAgAkEwRwRAIAJBLkcNBCAFKAIEIgIgBSgCaEYNASAFIAJBAWo2AgQgAi0AAAwDCyAFKAIEIgIgBSgCaEcEQCAFIAJBAWo2AgQgAi0AACECBSAFEA8hAgtBASEBDAELCyAFEA8LIQJBASEHIAJBMEcNAANAIBNCAX0hEwJ/IAUoAgQiASAFKAJoRwRAIAUgAUEBajYCBCABLQAADAELIAUQDwsiAkEwRg0AC0EBIQELIARBADYCkAYgAkEwayEIIAwCfgJAAkACQAJAAkACQCACQS5GIgMNACAIQQlNDQAMAQsDQAJAIANBAXEEQCAHRQRAIBQhE0EBIQcMAgsgAUUhAwwECyAUQgF8IRQgBkH8D0wEQCANIBSnIAJBMEYbIQ0gBEGQBmogBkECdGoiASALBH8gAiABKAIAQQpsakEwawUgCAs2AgBBASEBQQAgC0EBaiICIAJBCUYiAhshCyACIAZqIQYMAQsgAkEwRg0AIAQgBCgCgEZBAXI2AoBGQdyPASENCwJ/IAUoAgQiAiAFKAJoRwRAIAUgAkEBajYCBCACLQAADAELIAUQDwsiAkEwayEIIAJBLkYiAw0AIAhBCkkNAAsLIBMgFCAHGyETAkAgAUUNACACQV9xQcUARw0AAkAgBSAJEKABIhVCgICAgICAgICAf1INACAJRQ0EQgAhFSAFKQNwQgBTDQAgBSAFKAIEQQFrNgIECyATIBV8IRMMBAsgAUUhAyACQQBIDQELIAUpA3BCAFMNACAFIAUoAgRBAWs2AgQLIANFDQFBuMEBQRw2AgALQgAhFCAFQgAQLUIADAELIAQoApAGIgFFBEAgBCAKt0QAAAAAAAAAAKIQLiAEKQMAIRQgBCkDCAwBCwJAIBRCCVUNACATIBRSDQAgDkEeTEEAIAEgDnYbDQAgBEEwaiAKECcgBEEgaiABEEAgBEEQaiAEKQMwIAQpAzggBCkDICAEKQMoEBAgBCkDECEUIAQpAxgMAQsgEEEBdq0gE1MEQEG4wQFBxAA2AgAgBEHgAGogChAnIARB0ABqIAQpA2AgBCkDaEJ/Qv///////7///wAQECAEQUBrIAQpA1AgBCkDWEJ/Qv///////7///wAQECAEKQNAIRQgBCkDSAwBCyAPQeIBa6wgE1UEQEG4wQFBxAA2AgAgBEGQAWogChAnIARBgAFqIAQpA5ABIAQpA5gBQgBCgICAgICAwAAQECAEQfAAaiAEKQOAASAEKQOIAUIAQoCAgICAgMAAEBAgBCkDcCEUIAQpA3gMAQsgCwRAIAtBCEwEQCAEQZAGaiAGQQJ0aiIBKAIAIQUDQCAFQQpsIQUgC0EBaiILQQlHDQALIAEgBTYCAAsgBkEBaiEGCyATpyEHAkAgDUEJTg0AIAcgDUgNACAHQRFKDQAgB0EJRgRAIARBwAFqIAoQJyAEQbABaiAEKAKQBhBAIARBoAFqIAQpA8ABIAQpA8gBIAQpA7ABIAQpA7gBEBAgBCkDoAEhFCAEKQOoAQwCCyAHQQhMBEAgBEGQAmogChAnIARBgAJqIAQoApAGEEAgBEHwAWogBCkDkAIgBCkDmAIgBCkDgAIgBCkDiAIQECAEQeABakEAIAdrQQJ0QbDlAGooAgAQJyAEQdABaiAEKQPwASAEKQP4ASAEKQPgASAEKQPoARCUASAEKQPQASEUIAQpA9gBDAILIA4gB0F9bGpBG2oiAUEeTEEAIAQoApAGIgIgAXYbDQAgBEHgAmogChAnIARB0AJqIAIQQCAEQcACaiAEKQPgAiAEKQPoAiAEKQPQAiAEKQPYAhAQIARBsAJqIAdBAnRB6OQAaigCABAnIARBoAJqIAQpA8ACIAQpA8gCIAQpA7ACIAQpA7gCEBAgBCkDoAIhFCAEKQOoAgwBCwNAIARBkAZqIAYiAkEBayIGQQJ0aigCAEUNAAtBACELAkAgB0EJbyIBRQRAQQAhAwwBC0EAIQMgAUEJaiABIAdBAEgbIQECQCACRQRAQQAhAgwBC0GAlOvcA0EAIAFrQQJ0QbDlAGooAgAiBm0hCUEAIQhBACEFA0AgBEGQBmogBUECdGoiDSAIIA0oAgAiDSAGbiIQaiIINgIAIANBAWpB/w9xIAMgCEUgAyAFRnEiCBshAyAHQQlrIAcgCBshByAJIA0gBiAQbGtsIQggBUEBaiIFIAJHDQALIAhFDQAgBEGQBmogAkECdGogCDYCACACQQFqIQILIAcgAWtBCWohBwsDQCAEQZAGaiADQQJ0aiEJAkADQCAHQSROBEAgB0EkRw0CIAkoAgBB0en5BE8NAgsgAkH/D2ohBkEAIQggAiEBA0AgASECIAitIARBkAZqIAZB/w9xIgVBAnRqIgE1AgBCHYZ8IhNCgZTr3ANUBH9BAAUgEyATQoCU69wDgCIUQoCU69wDfn0hEyAUpwshCCABIBOnIgE2AgAgAiACIAIgBSABGyADIAVGGyAFIAJBAWtB/w9xRxshASAFQQFrIQYgAyAFRw0ACyALQR1rIQsgCEUNAAsgASADQQFrQf8PcSIDRgRAIARBkAZqIgYgAUH+D2pB/w9xQQJ0aiICIAIoAgAgBiABQQFrQf8PcSICQQJ0aigCAHI2AgALIAdBCWohByAEQZAGaiADQQJ0aiAINgIADAELCwJAA0AgAkEBakH/D3EhBiAEQZAGaiACQQFrQf8PcUECdGohCANAQQlBASAHQS1KGyEJAkADQCADIQFBACEFAkADQAJAIAEgBWpB/w9xIgMgAkYNACAEQZAGaiADQQJ0aigCACIDIAVBAnRBgOUAaigCACINSQ0AIAMgDUsNAiAFQQFqIgVBBEcNAQsLIAdBJEcNAEIAIRNBACEFQgAhFANAIAIgASAFakH/D3EiA0YEQCACQQFqQf8PcSICQQJ0IARqQQA2AowGCyAEQYAGaiAEQZAGaiADQQJ0aigCABBAIARB8AVqIBMgFEIAQoCAgIDlmreOwAAQECAEQeAFaiAEKQPwBSAEKQP4BSAEKQOABiAEKQOIBhAmIAQpA+gFIRQgBCkD4AUhEyAFQQFqIgVBBEcNAAsgBEHQBWogChAnIARBwAVqIBMgFCAEKQPQBSAEKQPYBRAQIAQpA8gFIRRCACETIAQpA8AFIRUgC0HxAGoiByAPayIGQQAgBkEAShsgDiAGIA5IIgUbIgNB8ABMDQIMBQsgCSALaiELIAIhAyABIAJGDQALQYCU69wDIAl2IQ1BfyAJdEF/cyEQQQAhBSABIQMDQCAEQZAGaiABQQJ0aiIRIAUgESgCACIRIAl2aiIFNgIAIANBAWpB/w9xIAMgBUUgASADRnEiBRshAyAHQQlrIAcgBRshByAQIBFxIA1sIQUgAUEBakH/D3EiASACRw0ACyAFRQ0BIAMgBkcEQCAEQZAGaiACQQJ0aiAFNgIAIAYhAgwDCyAIIAgoAgBBAXI2AgAMAQsLCyAEQZAFakHhASADaxBuEC4gBEGwBWogBCkDkAUgBCkDmAUgFSAUEKQBIAQpA7gFIRggBCkDsAUhFyAEQYAFakHxACADaxBuEC4gBEGgBWogFSAUIAQpA4AFIAQpA4gFEKIBIARB8ARqIBUgFCAEKQOgBSITIAQpA6gFIhYQaSAEQeAEaiAXIBggBCkD8AQgBCkD+AQQJiAEKQPoBCEUIAQpA+AEIRULAkAgAUEEakH/D3EiCSACRg0AAkAgBEGQBmogCUECdGooAgAiCUH/ybXuAU0EQCAJRSABQQVqQf8PcSACRnENASAEQfADaiAKt0QAAAAAAADQP6IQLiAEQeADaiATIBYgBCkD8AMgBCkD+AMQJiAEKQPoAyEWIAQpA+ADIRMMAQsgCUGAyrXuAUcEQCAEQdAEaiAKt0QAAAAAAADoP6IQLiAEQcAEaiATIBYgBCkD0AQgBCkD2AQQJiAEKQPIBCEWIAQpA8AEIRMMAQsgCrchGiACIAFBBWpB/w9xRgRAIARBkARqIBpEAAAAAAAA4D+iEC4gBEGABGogEyAWIAQpA5AEIAQpA5gEECYgBCkDiAQhFiAEKQOABCETDAELIARBsARqIBpEAAAAAAAA6D+iEC4gBEGgBGogEyAWIAQpA7AEIAQpA7gEECYgBCkDqAQhFiAEKQOgBCETCyADQe8ASg0AIARB0ANqIBMgFkIAQoCAgICAgMD/PxCiASAEKQPQAyAEKQPYA0IAQgAQOg0AIARBwANqIBMgFkIAQoCAgICAgMD/PxAmIAQpA8gDIRYgBCkDwAMhEwsgBEGwA2ogFSAUIBMgFhAmIARBoANqIAQpA7ADIAQpA7gDIBcgGBBpIAQpA6gDIRQgBCkDoAMhFQJAIBJBAmsgB0H/////B3FODQAgBCAUQv///////////wCDNwOYAyAEIBU3A5ADIARBgANqIBUgFEIAQoCAgICAgID/PxAQIAQpA5ADIAQpA5gDQoCAgICAgIC4wAAQlQEhASAEKQOIAyAUIAFBAE4iARshFCAEKQOAAyAVIAEbIRUgEyAWQgBCABA6QQBHIAUgAyAGR3EgBSABG3FFIBIgASALaiILQe4Aak5xDQBBuMEBQcQANgIACyAEQfACaiAVIBQgCxCjASAEKQPwAiEUIAQpA/gCCzcDKCAMIBQ3AyAgBEGQxgBqJAAgDCkDKCETIAwpAyAhFAwECyABKQNwQgBZBEAgASABKAIEQQFrNgIECwwBCwJAAn8gASgCBCICIAEoAmhHBEAgASACQQFqNgIEIAItAAAMAQsgARAPC0EoRgRAQQEhBQwBC0KAgICAgIDg//8AIRMgASkDcEIAUw0DIAEgASgCBEEBazYCBAwDCwNAAn8gASgCBCICIAEoAmhHBEAgASACQQFqNgIEIAItAAAMAQsgARAPCyICQcEAayEGAkACQCACQTBrQQpJDQAgBkEaSQ0AIAJB3wBGDQAgAkHhAGtBGk8NAQsgBUEBaiEFDAELC0KAgICAgIDg//8AIRMgAkEpRg0CIAEpA3AiFkIAWQRAIAEgASgCBEEBazYCBAsCQCADBEAgBQ0BDAQLDAELA0AgBUEBayEFIBZCAFkEQCABIAEoAgRBAWs2AgQLIAUNAAsMAgtBuMEBQRw2AgAgAUIAEC0LQgAhEwsgACAUNwMAIAAgEzcDCCAMQTBqJAALxwYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABA6RQ0AAn8gBEL///////8/gyEKAn8gBEIwiKdB//8BcSIGQf//AUcEQEEEIAYNARpBAkEDIAMgCoRQGwwCCyADIAqEUAsLIQYgAkIwiKciCEH//wFxIgdB//8BRg0AIAYNAQsgBUEQaiABIAIgAyAEEBAgBSAFKQMQIgIgBSkDGCIBIAIgARCUASAFKQMIIQIgBSkDACEEDAELIAEgAkL///////////8AgyIKIAMgBEL///////////8AgyIJEDpBAEwEQCABIAogAyAJEDoEQCABIQQMAgsgBUHwAGogASACQgBCABAQIAUpA3ghAiAFKQNwIQQMAQsgBEIwiKdB//8BcSEGIAcEfiABBSAFQeAAaiABIApCAEKAgICAgIDAu8AAEBAgBSkDaCIKQjCIp0H4AGshByAFKQNgCyEEIAZFBEAgBUHQAGogAyAJQgBCgICAgICAwLvAABAQIAUpA1giCUIwiKdB+ABrIQYgBSkDUCEDCyAJQv///////z+DQoCAgICAgMAAhCELIApC////////P4NCgICAgICAwACEIQogBiAHSARAA0ACfiAKIAt9IAMgBFatfSIJQgBZBEAgCSAEIAN9IgSEUARAIAVBIGogASACQgBCABAQIAUpAyghAiAFKQMgIQQMBQsgCUIBhiAEQj+IhAwBCyAKQgGGIARCP4iECyEKIARCAYYhBCAHQQFrIgcgBkoNAAsgBiEHCwJAIAogC30gAyAEVq19IglCAFMEQCAKIQkMAQsgCSAEIAN9IgSEQgBSDQAgBUEwaiABIAJCAEIAEBAgBSkDOCECIAUpAzAhBAwBCyAJQv///////z9YBEADQCAEQj+IIQEgB0EBayEHIARCAYYhBCABIAlCAYaEIglCgICAgICAwABUDQALCyAIQYCAAnEhBiAHQQBMBEAgBUFAayAEIAlC////////P4MgB0H4AGogBnKtQjCGhEIAQoCAgICAgMDDPxAQIAUpA0ghAiAFKQNAIQQMAQsgCUL///////8/gyAGIAdyrUIwhoQhAgsgACAENwMAIAAgAjcDCCAFQYABaiQAC78CAQF/IwBB0ABrIgQkAAJAIANBgIABTgRAIARBIGogASACQgBCgICAgICAgP//ABAQIAQpAyghAiAEKQMgIQEgA0H//wFJBEAgA0H//wBrIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEBBB/f8CIAMgA0H9/wJOG0H+/wFrIQMgBCkDGCECIAQpAxAhAQwBCyADQYGAf0oNACAEQUBrIAEgAkIAQoCAgICAgIA5EBAgBCkDSCECIAQpA0AhASADQfSAfksEQCADQY3/AGohAwwBCyAEQTBqIAEgAkIAQoCAgICAgIA5EBBB6IF9IAMgA0HogX1MG0Ga/gFqIQMgBCkDOCECIAQpAzAhAQsgBCABIAJCACADQf//AGqtQjCGEBAgACAEKQMINwMIIAAgBCkDADcDACAEQdAAaiQACzUAIAAgATcDACAAIAJC////////P4MgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIaENwMIC3wBAn8gACAAKAJIIgFBAWsgAXI2AkggACgCFCAAKAIcRwRAIABBAEEAIAAoAiQRBQAaCyAAQQA2AhwgAEIANwMQIAAoAgAiAUEEcQRAIAAgAUEgcjYCAEF/DwsgACAAKAIsIAAoAjBqIgI2AgggACACNgIEIAFBG3RBH3ULqAEBBH8jAEEQayIFJAAgBSACNgIMIwBBoAFrIgMkACADQQhqIgZBsOkAQZABEBEaIAMgADYCNCADIAA2AhwgA0H/////B0F+IABrIgQgBEH/////B0sbIgQ2AjggAyAAIARqIgA2AiQgAyAANgIYIAYgASACQfAAQQAQbCEAIAQEQCADKAIcIgEgASADKAIYRmtBADoAAAsgA0GgAWokACAFQRBqJAAgAAunAQEEfyMA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LQAoRQ0AIAQsACdBAE4NACAEKAIcEAgLIAQsABtBAE4NACAEKAIQEAgLIARBMGokAAuaAwEDfyAAQYTiADYCACAAKALkASIDBEAgACgC6AEiAiADIgFHBEADQAJAIAJBKGsiAS0AIEUNACACQQlrLAAAQQBODQAgAkEUaygCABAICyACQRVrLAAAQQBIBEAgAkEgaygCABAICyABIgIgA0cNAAsgACgC5AEhAQsgACADNgLoASABEAgLIABBxAFqIgFBDGogASgCEBBEIAEgASgCBBBEIAAoAgwiAQRAIAEQCAsgACgCjAEhASAAQQA2AowBIAEEQCABIAEoAgAoAgQRAAALIAAoAogBIQEgAEEANgKIASABBEAgASABKAIAKAIEEQAACyAAKAKEASEBIABBADYChAEgAQRAIAEgASgCACgCBBEAAAsgACgCgAEhASAAQQA2AoABIAEEQCABIAEoAgAoAgQRAAALIAAoAnwhASAAQQA2AnwgAQRAIAEgASgCACgCBBEAAAsgACgCeCEBIABBADYCeCABBEAgASABKAIAKAIEEQAACyAAKAJ0IQEgAEEANgJ0IAEEQCABIAEoAgAoAgQRAAALIAAL7gEBB39BfyABKAIAIgJBAWoiBSABKAIEIgNsIgYgA2ogBUF+cSADbCIHaiACIANsIgVBAXRqIgJBAnQgAkH/////A0sbIgQQCiICQQAgBBANIQggACgCACEEIAAgCDYCACAEBEAgBBAIIAAoAgAhAgsgACACNgIQIAAgAiAFQQJ0IgRqIgI2AhQgACACIAZBAnRqIgI2AhggACACIAdBAnRqIgI2AhwgACACIANBAnRqNgIgQX8gBCAFQf////8DSxsiAxAKQQAgAxANIQIgACgCDCEDIAAgAjYCDCADBEAgAxAICyAAIAEpAgA3AgQLqQEBBX8CQCAAKAIEIAAoAghsQQJ0IgFBAEwNACAAKAIAIQIgAUEBayIBQQJ2QQFqIgNBAXEhBUEAIQAgAUEDRwRAIANB/v///wdxIQNBACEBA0AgACACaiIEIAQtAABBf3M6AAAgAiAAQQRyIgRqIAIgBGotAABBf3M6AAAgAEEIaiEAIAFBAmoiASADRw0ACwsgBUUNACAAIAJqIgAgAC0AAEF/czoAAAsLGwACQCAALQAMRQ0AIAAoAgAiAEUNACAAEAgL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BEACQCABRQ0AIAQhAyABQQdxIgUEQANAIAMgAi8BADsBACADQQJqIQMgB0EBaiIHIAVHDQALCyABQQF0IARqIQQgAUEBa0H/////B3FBB0kNAANAIAMgAi8BADsBACADIAIvAQA7AQIgAyACLwEAOwEEIAMgAi8BADsBBiADIAIvAQA7AQggAyACLwEAOwEKIAMgAi8BADsBDCADIAIvAQA7AQ4gA0EQaiIDIARHDQALCyAAIAQ2AgQPCwJAIAQgACgCACIGayIKQQF1IgQgAWoiBUEATgRAQf////8HIAMgBmsiAyAFIAMgBUsbIANB/v///wdPGyIIBEAgCEEASA0CIAhBAXQQCiEJCyAJIARBAXRqIgUhAyABQQdxIgQEQANAIAMgAi8BADsBACADQQJqIQMgB0EBaiIHIARHDQALCyAFIAFBAXRqIQQgAUEBa0H/////B3FBB08EQANAIAMgAi8BADsBACADIAIvAQA7AQIgAyACLwEAOwEEIAMgAi8BADsBBiADIAIvAQA7AQggAyACLwEAOwEKIAMgAi8BADsBDCADIAIvAQA7AQ4gA0EQaiIDIARHDQALCyAJIAYgChAOIQEgACAENgIEIAAgATYCACAAIAEgCEEBdGo2AgggBgRAIAYQCAsPCxAAAAsQFQAL7QYBC38jAEHAAWsiBCQAIARCADcDeCAEQgA3A3AgBEIANwNoIARCADcDYCAEQgA3A1ggBEIANwNQIARCADcDkAEgBEIANwOYASAEQgA3A6ABIARCADcDqAEgBEIANwOwASAEQgA3A7gBIARCADcDgAEgBEIANwNAIARCADcDiAEgBEIANwNIIARBAToAgAEgBEEBOgBAIAFBAEoEQCACKAIEIQYgAigCACEJIAIoAgghDEEBIQ1BASEOA0BBASEFIAAgB2otAAAhCCAKQQBKBEADQAJAIAUiAiAEQYABamotAAAiBUUNACAAIAcgAmtqLQAAIgtFDQAgDCAGIAtqLQAAIAUgBmotAABqIAlvai0AACAIcyEICyACQQFqIQUgAiAKRw0ACwsgBiAIQf8BcSICai0AACAJIAYgDUH/AXFqLQAAa2ogCW8hBQJ/AkAgAkUNACAFIAxqLQAAIQIgByAKQQF0TgRAIAQgBCkDuAE3AzggBCAEKQOwATcDMCAEIAQpA6gBNwMoIAQgBCkD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IAMgEmsiJSAKckEASA0AGkF/IBooAggiBCAlTA0AGkF/IBooAgwgCkwNABogGigCBCAEIApsICVqai0AACIEQQFNBEBBfyAERQ0BGkF/IBooAhAiDEH9AUoNARogGiAMQQFqNgIQIBogDEEEdGoiDUIANwIcIA0gCjYCGCANQRRqIgQgJTYCACANQX82AiAgGiAlIApBASAMQQQgBBA9IAwMAQsgBAshJQJAIAMgECASaiALaiILayINIApyQQBIDQAgGigCCCIEIA1MDQAgGigCDCAKTA0AIBooAgQgBCAKbCANamotAAAiBEEBTQRAIARFDQEgGigCECIEQf0BSg0BIBogBEEBajYCECAaIARBBHRqIghCADcCHCAIIAo2AhggCEEUaiISIA02AgAgCEF/NgIgIBogDSAKQQEgBEEEIBIQPSAEIQgMAQsgBCEIC0F/IQQCQCADIAsgEWprIhEgCnJBAEgNACAaKAIIIhIgEUwNACAaKAIMIApMDQAgGigCBCAKIBJsIBFqai0AACISQQFNBEAgEkUNASAaKAIQIhJB/QFKDQEgGiASQQFqNgIQIBogEkEEdGoiC0IANwIcIAsgCjYCGCALQRRqIgQgETYCACALQX82AiAgGiARIApBASASQQQgBBA9IBIhBAwBCyASIQQLQQAhEiAEQQBIDQAgJUEASA0AIAhBAEgNACAEICVHDQAgBCAIRg0AIBogCEEEdCILaiIMKAIgQQBODQAgGiAlQQR0Ig1qIhEoAiBBAE4NACALIBpBFGoiBGoiCygCCEHkAGwgBCANaiInKAIIbUHHAGtBQ0kNACAaKAL0HyINQR9KDQAgGiANQQFqNgL0HyAaIA1B+ABsaiIfQfgfakEAQfgAEA0hBCAfQfwfaiAINgIAIAQgJTYCACAfQeggakF/NgIAIAwgDTYCICARIA02AiAgCykCACFbIBhCADcDmAQgGEIANwOQBCAYQX82ApAEIBggWzcDiAQgGCAfQYAgaiINNgKgBCAaICcoAgAgJygCBCAlQQFBBSAYQYgEaiIRED0gGCAYKAKgBCIEKAIAIBgoAogEazYCiAQgGCAEKAIEIBgoAowEazYCjAQgBCAnKQIANwIAIBgoAqAEICcpAgA3AgggGCgCoAQgJykCADcCECAYKAKgBCAnKQIANwIYIBggGCgCjAQiCyAn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DCATIB42AgggEyAiNgIEIBMgHjYCjAEgEyAiNgKIASATIBNBHGo2AjQgEyATQRhqNgIwIA4EQCAOQQBIDQsgEyAOEAoiAjYCDCATIAIgDmoiATYCFCACQQAgDhANGiATIAE2AhALIBMgE0EEajYChAEgEyATQYgBajYCgAEgEyATQYwBajYCfEEEIQFBACECA0ACQAJAIAEgHkcNACACDQAgE0GQAWoiAyATQfwAakGYxwAQUiATQTBqIAMQPgwBCwJAAkAgASAeQQJrRw0AIAINACAiQQNxRQ0BIBNBkAFqIgMgE0H8AGpB2McAEFIgE0EwaiADED4MAgsgASAeQQRqRw0BIAJBAkcNASAiQQdxDQEgE0GQAWoiAyATQfwAakGYyAAQUiATQTBqIAMQPgwBCyAiQYeAgIB4cUEERw0AIBNBkAFqIgMgE0H8AGpB2MgAEFIgE0EwaiADED4LA0AgAiEEAkAgASIDIBMoAowBTg0AIARBAEgNACATKAIEIANsIARqIgIgEygCECATKAIMIgFrTw0NIAEgAmotAAANAEEAIR4DQCAeQQN0IglBnMkAaigCACAEaiEBIAlBmMkAaigCACADaiICQQBIBEAgEygCjAEiCiACaiECIAEgCkEEakEIb2tBBGohAQsgAUEASARAIBMoAogBIgogAWohASACIApBBGpBCG9rQQRqIQILIBNBkAFqIAlqIgogATYCBCAKIAIgEygCjAEiAUEAIAEgAkwbazYCACATKAIEIAopAgAiW6dsIFtCIIinaiICIBMoAhAgEygCDCIBa08NDiABIAJqQf8BOgAAIB5BAWoiHkEIRw0ACyATIBMpAsgBNwNwIBMgEykCwAE3A2ggEyATKQK4ATcDYCATIBMpArABNwNYIBMgEykCqAE3A1AgEyATKQKgATcDSCATQUBrIBMpApgBNwMAIBMgEykCkAE3AzggE0EwaiATQThqED4LIANBAk4EQCADQQJrIQEgBEECaiICIBMoAogBSA0BCwsgBEEFaiECIANBAWshAQNAIAIhBAJAIAEiA0EASA0AIAQgEygCiAFODQAgEygCBCADbCAEaiICIBMoAhAgEygCDCIBa08NDSABIAJqLQAADQBBACEeA0AgHkEDdCIJQZzJAGooAgAgBGohASAJQZjJAGooAgAgA2oiAkEASARAIBMo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gMAAEA0aCwtBoLkBIAEoAmQ2AgAgASgCYCEAIAFBADYCYCAABEAgACgCAEGc8AAoAgARAAAgABAICyABKAIAIgAEQCABIAA2AgQgABAICyAJELkBCyALQYABaiQAIAUL/gEBA39BjPkAKAIABEBBjPkAKAIAIgEEQCABKAJcIQAgAUEANgJcIAAEQCAAKAIMIQIgAEEANgIMIAIEQCACEAgLIAAoAgAhAiAAQQA2AgAgAgRAIAIQCAsgABAICyABKAJYIQAgAUEANgJYIAAEQCAAIAAoAgAoAgQRAAALIAEoAlQhACABQQA2AlQgAARAIAAgACgCACgCBBEAAAsgASgCUCEAIAFBADYCUCAABEAgABCuARAICyABKAJMIQAgAUEANgJMIAAEQCAAIAAoAgAoAggRAAALIAFBQGsgASgCRBAsIAFBNGogASgCOBAsIAEQCAtBjPkAQQA2AgALC0oBAX8CQCAAQQFGBEBBlPkALQAADQEjAEEQayIBJAAgAUEANgIMQfzkACgCAEHtGUEAEJoBIAFBEGokAAtBlPkAIABBAUY6AAALC7A8Axl/AXwBfSMAQRBrIg8kAEEDIQICQAJAQYz5ACgCAA0AQZD5AEEANgIAQbjDAhAKIgRBCGpBAEGwwwIQDRogBEEANgI8IARCgoCAgOArNwIcIARCzZmz7oOAgIA+NwIUIARBBTYCDCAEQQE6AAkgBEKKgICAIDcCACAEQQA2AkggBCAEQThqNgI0IAQgBEHEAGo2AkBBnPQAKAIAIgJBoPQARwRAA0ACQAJAIAIoAhBBAmsOBAEAAAEACyAEIAJBEGpBABBUCwJAIAIoAgQiAQRAA0AgASICKAIAIgENAAwCCwALA0AgAiACKAIIIgIoAgBHDQALCyACQaD0AEcNAAsLIARBADYCtMMCIARBsMMCakEAOgAAIARBoMMCakEAOgAAIARB7IICakEAOgAAIARB3IICakEAOgAAIARBqMIBakEAOgAAIARBmMIBakEAOgAAIARB5IEBakEAOgAAIARB1IEBakEAOgAAIARBoMEAakEAOgAAIARBkMEAakEAOgAAIARCADcCTCAEQgA3AlQgBEEANgJcQYz5ACAENgIAIAAQKyICQfD///8HTw0BAkACQCACQQtPBEAgAkEPckEBaiIDEAohASAPIANBgICAgHhyNgIM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ADYCACADIAA2AgQgA0H43AA2AgAgAUECNgIMIAMgBCABQQxqEBM6AHEgAUEFNgIMIAMgBCABQQxqEBM6AHAgAUEINgIMIAMgBCABQQxqEBM6AG8gAUENNgIMIAMgBCABQQxqEBM6AG4gAUEJNgIMIAMgBCABQQxqEBM6AHIgAUEMNgIMIAMgBCABQQxqEBM6AHMgAUEKNgIMIAMgBCABQQxqEBM6AHQgAUEONgIMIAMgBCABQQxqEBM6AHUgAUEQaiQAIAAoAnghASAAIAM2AnggAUUNACABIAEoAgAoAgQRAAALIAJBIjYCDAJAIAQgAkEMahATRQRAIAJBIzYCCCAEIAJBCGoQE0UNAQtBJBAKIQEjAEEQayIDJAAgAUGY4wA2AgAgASAANgIEIAFB/NoANgIAIANBIjYCDCABIAQgA0EMahATOgAhIANBIzYCCCABIAQgA0EIahATOgAiIAFBBDoACEEEQRQQayEHIAFCADcAESABIAc2AgwgAUIANwAZIANBEGokACAAKAJ8IQMgACABNgJ8IANFDQAgAyADKAIAKAIEEQAACyACQSY2AgwCQCAEIAJBDGoQE0UNAEEoEAohAyMAQSBrIgEkACADQZjjADYCACADQQA6ACQgAyAANgIEIANBuD82AgAgAUEmNgIQIAFBGGogBCABQRBqIgcQRyADIAEoAhhBBCABLQAcGzYCHCABQSY2AgwgByAEIAFBDGoQRiADIAEoAhBBACABLQAUGzYCICABQSBqJAAgACgCgAEhASAAIAM2AoABIAFFDQAgASABKAIAKAIEEQAACyAAQQA6AAwgAEEANgKEASAAQQA2AgggAEEQakEAQdAAEA0aIAAoAmgiAQRAIAEgASgCACgCCBEAAAsgACgCbCIBBEAgASABKAIAKAIIEQAACyAAKAJwIgEEQCABIAEoAgAoAggRAAALIAAoAnQiAQRAIAEgASgCACgCCBEAAAsgACgCeCIBBEAgASABKAIAKAIIEQAACyAAKAJ8IgEEQCABIAEoAgAoAggRAAALIAAoAoABIgEEQCABIAEoAgAoAggRAAALIABBADoAiAEgAkEQaiQAIABCADcCkAEgAEEENgKMASAAQgA3ApgBIABCADcCoAEgAEIANwKoASAAQgA3ArABIAAQiwEgBUHEAWoiAEIANwIEIABBEGoiAkIANwIAIAAgAEEEajYCACAAIAI2AgwgBSAEKAIcIgA2AtwBIAQoAiAhAiAFQQA2AuwBIAVCADcC5AEgBSACNgLgASAFIAU2ApABIABBAEoEQAJAIAUoAuwBIAUoAuQBIghrQShtQRBPDQAgBSgC6AEhAEGABRAKIgJBgAVqIQsgAiAAIAhrQShtQShsaiEHAkAgACAIRwRAIAchAgNAIAJBKGsiASAAQShrIgMoAgA2AgAgASADKAIENgIEIAEgAygCEDYCECABIAMpAgg3AgggA0IANwIIIANBADYCECABQQA6ACAgAUEAOgAUIAMtACAEQCABIABBKGsiBigCHDYCHCABIAYpAhQ3AhQgBkIANwIUIAZBADYCHCABQQE6ACALIAJBBGsgAEEEay0AADoAACABIQIgAyIAIAhHDQALIAUgCzYC7AEgBSgC6AEhACAFIAc2AugBIAUoAuQBIQggBSACNgLkASAAIAhGDQEDQAJAIABBKGsiAi0AIEUNACAAQQlrLAAAQQBODQAgAEEUaygCABAICyAAQRVrLAAAQQBIBEAgAEEgaygCABAICyACIgAgCEcNAAsMAQsgBSALNgLsASAFIAc2AugBIAUgBzYC5AELIAhFDQAgCBAICwsgBCgCTCEAIAQgBTYCTCAARQ0AIAAgACgCACgCCBEAAAsgCUHAADYCCAJAIAQgCUEIahATRQ0AQQwQCiIAQgA3AgQgAEEBQYj6ABBrNgIAIAQoAlAhAiAEIAA2AlAgAkUNACACEK4BEAgLIAlBwQA2AggCQCAEIAlBCGoQE0UNAEEkEAoiAEIANwIEIABB6Dk2AgAgAEIANwIMIABCADcCFCAAQQA2AhwgBCgCVCECIAQgADYCVCACRQ0AIAIgAigCACgCBBEAAAsgCUHCADYCCAJAIAQgCUEIahATRQ0AQQQQCiICQejYADYCACAEKAJYIQAgBCACNgJYIABFDQAgACAAKAIAKAIEEQAAC0EAIQAgBCgCVCAEKAJYckUNACAJQoCIgICAgAE3AghBKBAKIgFCADcCACABQgA3AgggASAJQQhqELcBIAQoAlwhAiAEIAE2AlwgAkUNACACKAIMIQEgAkEANgIMIAEEQCABEAgLIAIoAgAhASACQQA2AgAgAQRAIAEQCAsgAhAICyAJLQBcRQ0AIAlB0ABqIAkoAlQQLCAJQcQAaiAJKAJIECwLIAlB4ABqJAAgACECIA8sAA9BAE4NACAPKAIEEAgLIA9BEGokACACDwsQAAALCQBBpPAAKAIAC4EBAQR/IAAoAgAgAWwiBCAAKAIEIgUgAmxrIgcgACgCCCIGSAR/IAAgBzYCCCAAKAIYIgQgATYCBCAEIAI2AgAgACgCCCEGIAAoAgQhBSAAKAIAIAFsBSAECyADIAVsayICIAZIBEAgACACNgIIIAAoAhgiACABNgIEIAAgAzYCAAsLDwBBgPkAQYT5ACgCABAYCw8AQfT4AEH4+AAoAgAQGQsPAEHo+ABB7PgAKAIAEBoLDwBB3PgAQeD4ACgCABAYCw8AQdD4AEHU+AAoAgAQGQsPAEHE+ABByPgAKAIAEBoLhAMBA38gACgCACIFIAFsIAAoAgQiBiACbGshBCABIAZsIAIgBWxqIgUgACgCCEoEQCAAIAU2AgggACgCGCIGIAE2AgQgBiACNgIACyAAKAIMIARIBEAgACAENgIMIAAoAhgiBiACNgIIIAYgATYCDAtBACAFayIFIAAoAhBKBEAgACAFNgIQIAAoAhgiBSACNgIQIAUgATYCFAtBACAEayIEIAAoAhRKBEAgACAENgIUIAAoAhgiBCACNgIYIAQgATYCHAsgACgCACIEIAFsIAAoAgQiBSADbGshAiABIAVsIAMgBGxqIgQgACgCCEoEQCAAIAQ2AgggACgCGCIFIAE2AgQgBSADNgIACyAAKAIMIAJIBEAgACACNgIMIAAoAhgiBSADNgIIIAUgATYCDAtBACAEayIEIAAoAhBKBEAgACAENgIQIAAoAhgiBCADNgIQIAQgATYCFAtBACACayICIAAoAhRKBEAgACACNgIUIAAoAhgiACADNgIYIAAgATYCHAsLhwEBBH8gASAAKAIEayIEIARsIgYgAiAAKAIAIgRrIgUgBWxqIgcgACgCCCIFSgRAIAAgBzYCCCAAKAIYIgQgATYCBCAEIAI2AgAgACgCCCEFIAAoAgAhBAsgBSADIARrIgIgAmwgBmoiAkgEQCAAIAI2AgggACgCGCIAIAE2AgQgACADNgIACwsPAEG4+ABBvPgAKAIAEBgLDwBBrPgAQbD4ACgCABAZCw8AQaD4AEGk+AAoAgAQGgsDAAALDwBBlPgAQZj4ACgCABAYCw8AQYj4AEGM+AAoAgAQGQsPAEH89wBBgPgAKAIAEBoLDwBB8PcAQfT3ACgCABAYCw8AQeT3AEHo9wAoAgAQGQsPAEHY9wBB3PcAKAIAEBoL0AEBAn8gAEHEAWohAiMAQRBrIgAkACAAIAEoAgA2AgAgAEEEaiEDAkAgASwAD0EATgRAIAMgASkCBDcCACADIAEoAgw2AggMAQsgAyABKAIEIAEoAggQGwsCfwJAIAEoAgAiAUEFRiABQQJGcgRAIAJBEGogAkEMaiICIAAQsgFHDQFBAQwCCyACIAAQsgEgAkEEakcNAEEBDAELIAIgABCxASgCAEEBagshASACIAAQsQEgATYCACAALAAPQQBIBEAgACgCBBAICyAAQRBqJAALFQAgACAAKAIIIAMgAmtqQQFqNgIICwwAIAAQtgEaIAAQCAsPAEHM9wBB0PcAKAIAEBgLDwBBwPcAQcT3ACgCABAZCw8AQbT3AEG49wAoAgAQGgsPAEGo9wBBrPcAKAIAEBgLDwBBnPcAQaD3ACgCABAZCw8AQZD3AEGU9wAoAgAQGgs0AEGA9wAoAgAiAARAQYT3ACAANgIAIAAQCAtB9PYAKAIAIgAEQEH49gAgADYCACAAEAgLCzQAQdz2ACgCACIABEBB4PYAIAA2AgAgABAIC0HQ9gAoAgAiAARAQdT2ACAANgIAIAAQCAsLNABBuPYAKAIAIgAEQEG89gAgADYCACAAEAgLQaz2ACgCACIABEBBsPYAIAA2AgAgABAICws0AEGU9gAoAgAiAARAQZj2ACAANgIAIAAQCAtBiPYAKAIAIgAEQEGM9gAgADYCACAAEAgLCzQAQfD1ACgCACIABEBB9PUAIAA2AgAgABAIC0Hk9QAoAgAiAARAQej1ACAANgIAIAAQCAsLNABBzPUAKAIAIgAEQEHQ9QAgADYCACAAEAgLQcD1ACgCACIABEBBxPUAIAA2AgAgABAICwsPAEGs9QBBsPUAKAIAEBgLDwBBoPUAQaT1ACgCABAZCw8AQZT1AEGY9QAoAgAQGgsPAEGI9QBBjPUAKAIAEHoLMAAgAEEANgJUIABB/wE6AAggAEIANwJIIABB/wE6ADggAEH/AToAKCAAQf8BOgAYCw8AQfz0AEGA9QAoAgAQGAsPAEHw9ABB9PQAKAIAEBkLDwBB5PQAQej0ACgCABAaC0kBAn8gABDLASAAQgA3ABkgAEIANwARIAAtAAgEQANAIAAoAgwgAUEUbGoiAiACLQAAQR9yOgAAIAFBAWoiASAALQAISQ0ACwsLCwAgABB8GiAAEAgLC4ZifABBgAgLkhPvu78AfwB+AH0AfAB7AHoAaW5maW5pdHkAbXVsdGlwbHkAR2VuZXJpY0dGUG9seQBkYXRhbWF0cml4AHUlMDR4AC0rICAgMFgweAAtMFgrMFggMFgtMHgrMHggMHgAdwB2AHUAaHlzdGVyZXNpc01pbkNvdW50AG1heFMyUG9pbnQAbWF4UzFQb2ludABoZWlnaHQAbWF4UzJSZWN0AG1heFMxUmVjdABhZGRPclN1YnRyYWN0ACFwYXJhbXMuY29tcGFjdABhekNvbXBhY3QAbnVtU2NhbmxpbmVzAHN5bWJvbG9naWVzAGludmVydGVkQ29kZXMAUmVnaW9uIHNpemUgZXhjZWVkcyBhbGxvY2F0ZWQgYm91bmRzAEltYWdlIHNpemUgZXhjZWVkcyBhbGxvY2F0ZWQgYm91bmRzAHMyUGFkZGluZ0ZhY3RvcgBzMVBhZGRpbmdGYWN0b3IARGF0YSBNYXRyaXg6IEVDQyBlcnJvcgBBenRlYyBDb2RlOiBFQ0MgZXJyb3IAUVIgQ29kZTogRUNDIGVycm9yAEF6dGVjIENvZGU6IE1NIEVDQyBFcnJvcgBhekNlbnRlcgBkYXRhYmFyAGNvZGFiYXIAcQBkYXRhYmFyLWV4cAAuLi92ZW5kb3IvenhpbmcvR2VuZXJpY0dGUG9seS5jcHAALi4vc3JjL2F6dGVjL0F6dGVjRGVjb2Rlci5jcHAAZnJvbSAhPSB0bwBRUiBDb2RlOiBpbnZhbGlkIHZlcnNpb24Ab3JpZ2luAG1heExlbgBtaW5MZW4AbmFuAGZhbGxiYWNrU2NhbgByb3dbeF0gPT0gZnJvbQBxLT5waXhlbHNbeTAgKiBxLT53ICsgeDBdID09IGZyb20AYXpEaW0AbnVsbABoeXN0ZXJlc2lzSW50ZXJ2YWwAbXVsdGlwbHlCeU1vbm9taWFsAHNldE1vbm9taWFsAGsAagBpAHdpZHRoAC4uL3ZlbmRvci96eGluZy9HZW5lcmljR0ZQb2x5LmgAYmFzaWNfc3RyaW5nACVsZwAlMS4xN2cAJTEuMTVnAGluZgBzaXplAHRydWUAZmFsc2UAZmxvb2RfZmlsbF9saW5lAG5hbWUAc2ltcGxlMURNb2RlAGRpdmlkZQBfZmllbGQgPT0gb3RoZXIuX2ZpZWxkAHNhbXBsZVJlZmVyZW5jZUdyaWQAU3dpdGNoIGVuY29kaW5nIGlzIG5vdCBzdXBwb3J0ZWQAZmxvb2RfZmlsbF9zZWVkAG1pblNjYW5saW5lc05lZWRlZAAlZABhenRlYwAuLi92ZW5kb3IvcXVpcmMvaWRlbnRpZnkuYwBiAGEAYABDVFJMXwBeAF0AXABbAFoAWQBYAFcAVgBVAFQAQ1RSTF9VUwBDVFJMX1BTAENUUkxfQlMAUgBRAFAATwBGTEdOAE5BTgBNAENUUkxfVUwAQ1RSTF9QTABDVFJMX01MAENUUkxfTEwAQ1RSTF9ETABLAEoASQBIAEcASU5GAEUAcHJlUHJvY2VzczFEAEMAQgBBAEAAPwA+AD0APAA7ADAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiAkJSorLS4vOgBjb2RlMzkAY29kZTEyOAA3ADYAaTI1ADQAYXpDMwBjb2RlOTMAZWFuMTMAYmNhZWRiMgBtYXhTMgBhekMyAG1heFMxAGF6QzEAYXpDMABwYXJhbXMuZGltZW5zaW9uID4gMABkZWdyZWUgPj0gMAAvAC4ALQAsACsAKgBJbnZhbGlkIHZhbHVlIGZvciBzeW1ib2xvZ3kgbWF4TGVuIChoYXMgdG8gYmUgZ3JlYXRlciBvciBlcXVhbCB0byBtaW5MZW4pAChudWxsKQBJbnZhbGlkIHZhbHVlIGZvciBzeW1ib2xvZ3kgbWF4TGVuIChvbWl0IGlmIG5vIG1heGltdW0gc2hvdWxkIGJlIGNvbmZpZ3VyZWQpAEludmFsaWQgdmFsdWUgZm9yIHN5bWJvbG9neSBtaW5MZW4gKG9taXQgaWYgbm8gbWluaW11bSBzaG91bGQgYmUgY29uZmlndXJlZCkARmFpbGVkIHRvIHBhcnNlIGNvbmZpZ3VyYXRpb24gKG1hbGZvcm1lZCBKU09OKQBkZWdyZWUgPj0gMCAmJiAoY29lZmZpY2llbnQgIT0gMCB8fCBkZWdyZWUgPT0gMCkAIWNvZWZmaWNpZW50cy5lbXB0eSgpACgAVW5zdXBwb3J0ZWQgc3ltYm9sb2d5IGNvbmZpZyBlbnRyeSwgYmFkIHR5cGUgZm9yIGZpZWxkICdtYXhMZW4nAFVuc3VwcG9ydGVkIHN5bWJvbG9neSBjb25maWcgZW50cnksIGJhZCB0eXBlIGZvciBmaWVsZCAnbWluTGVuJwBVbnN1cHBvcnRlZCBzeW1ib2xvZ3kgY29uZmlnIGVudHJ5LCBtaXNzaW5nIHJlcXVpcmVkIGZpZWxkICduYW1lJwAmAC0uICQvKyUAJAAjACIiAFB1cmUgdmlydHVhbCBmdW5jdGlvbiBjYWxsZWQhADogAC4gACwgAB8AHgBbKT4eMDYdAFspPh4wNR0AHAAbAA0ADAALAFVuc3VwcG9ydGVkIHN5bWJvbG9neSBuYW1lOiAlcwoAT3V0IG9mIG1lbW9yeSB3aGVuIHJlc2l6aW5nIFFSIGJ1ZmZlcgoARW1wdHkgSlNPTiBjb25maWd1cmF0aW9uCgBBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSB0cnlpbmcgdG8gcGFyc2UgSlNPTiBjb25maWd1cmF0aW9uCgBEZWJ1ZyBvdXRwdXQgZXhjZWVkcyBwcmUtYWxsb2NhdGVkIGJ1ZmZlciBib3VuZHMsIGRpc2NhcmRpbmcKAENvZGUgbGVuZ3RoICVkIGV4Y2VlZHMgbGltaXQgJWQKAEVuYWJsaW5nIGFsbCBzeW1ib2xvZ2llcyAoSElOVDogdGhpcyBpcyBpbmVmZmljaWVudCkKAERlYnVnIG1vZGUgZW5hYmxlZCAoRE8gTk9UIFVTRSBJTiBQUk9EVUNUSU9OKQoASW52YWxpZCBidWZmZXIgcGFzc2VkIHRvIGRlc3Ryb3lCdWZmZXIoKQoASW52YWxpZCBhcmd1bWVudHMgcGFzc2VkIHRvIGNyZWF0ZUJ1ZmZlcigpCgANCgAJAAgABwAGAAUAHgQAAwACAAEADwAAALANAACgDQBBoBsL6AQBAgQIAwYMCwUKBw4PDQkBAA8BBAIIBQoDDgkHBg0LDP8AAADQDgAA0A0AAAAAAAABAgQIECBAgB06dOjNhxMmTJgtWrR16smPAwYMGDBgwJ0nTpwlSpQ1atS1d+7BnyNGjAUKFChQoF26adK5b96hX75hwpkvXrxlyokPHjx48P3n07tr1rF//uHfo1u2ceLZr0OGESJEiA0aNGjQ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AAAADAAAAAkAAAAiAAAAIwAAACcAAABdAAAAgAAAABkAAAAmAAAAQAAAAEEAAABCAEGUwwALsAEcAAAAHQAAAB4AAACAQobISo7QEpPVl//ZG///XKDiJKX/J//oKv//K////wcaIA0QAxMXIhYdIxkNBRwTBiUHDCoqJzEEDjQAD0MVJUYcJkkLCEwSCVIZK1gPAGECEWQJEnAGE4UkFoopKJEhGJQrGaIoKagnKsEfG8QmHNAjHQMUHgYbHwkKAQwRAhIYIRgOBCEBCiQICzAFDUIWJEgMB2ADEIEeFIQlFZAiF8AgGgBB0MQAC20wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVotLiAkLyslKgAAAAANAAAACAAAAAUAAAACAAAADAAAAAkAAAAiAAAAIwAAACcAAABdAAAAgAAAABkAAAAmAAAAQAAAAEEAAABCAEHIxQALCSIAAAAjAAAAJABB4MUAC5kBDyswOBMbESoK/y8PODgvNyQ6GzYYJgIsKwUhOwQVEgwAJiMA/y4/Ey42/wgJ/xUU/wAhO/8zAP8tDBsKPz8pHBscHR4fOzw9Pj9bXF1eX3t8fX5/AEBgf39/AAANAAAACAAAAAUAAAACAAAADAAAAAkAAAAiAAAAIwAAACcAAABdAAAAgAAAABkAAAAmAAAAQAAAAEEAAABCAEGExwALzAIoAAAAKQAAACoAAAArAAAALAAAAP////8AAAAA/////wEAAAD/////AgAAAAAAAAD+////AAAAAP////8BAAAA/////wIAAAD/////AwAAAP/////9////AAAAAP7///8AAAAA/////wAAAAAAAAAA/P///wAAAAD9////AAAAAP7///8AAAAA/////wEAAAD//////////wAAAAD//////////wAAAAD9////AAAAAP7///8AAAAA/////wEAAAD9////AQAAAP7///8BAAAA//////3///8AAAAA/v///wAAAAD/////AAAAAAAAAAD+////AAAAAP////8BAAAA/////wIAAAD/////AwAAAP/////+/////v////7///////////////7///////////////////8AAAAAAAAAAP7///8AAAAA/////wBB4MkACx0BAAAACgAAAAoAAAAIAAAACAAAAAUAAAABAAAA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AAkWAAAAAAAWAAAWAAAwMTIzNDU2Nzg5QUJDREVGAEHU6QALAXIAQfzpAAsI//////////8AQcDqAAvYBf////////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAECBAcDBgUAAAAAAAAAAgAAwAMAAMAEAADABQAAwAYAAMAHAADACAAAwAkAAMAKAADACwAAwAwAAMANAADADgAAwA8AAMAQAADAEQAAwBIAAMATAADAFAAAwBUAAMAWAADAFwAAwBgAAMAZAADAGgAAwBsAAMAcAADAHQAAwB4AAMAfAADAAAAAswEAAMMCAADDAwAAwwQAAMMFAADDBgAAwwcAAMMIAADDCQAAwwoAAMMLAADDDAAAww0AANMOAADDDwAAwwAADLsBAAzDAgAMwwMADMMEAAzbAAAAAAAAAAAKAAAAZAAAAOgDAAAQJwAAoIYBAEBCDwCAlpgAAOH1BQDKmjsAAAAAAAAAADAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0NDQ1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5AEGY8AALEQEAAAACAAAAAwAAAPAIAAAFAEG08AALAWsAQczwAAsKbAAAAG0AAACsXABB5PAACwECAEH08AALCP//////////AEG48QALAQUAQcTxAAsBbgBB3PEACw5sAAAAbwAAALhcAAAABABB9PEACwEBAEGE8gALBf////8KAEHI8gALA3BjUA=='),
        )
      ) {
        var L = R;
        R = I.locateFile ? I.locateFile(L, Q) : Q + L;
      }
      function K(A) {
        try {
          if (A == R && E) return new Uint8Array(E);
          if (d(A))
            try {
              var I = p(A.slice(37)),
                g = new Uint8Array(I.length);
              for (A = 0; A < I.length; ++A) g[A] = I.charCodeAt(A);
              var B = g;
            } catch (A) {
              throw Error('Converting base64 string to bytes failed.');
            }
          else B = void 0;
          if (B) return B;
          throw 'both async and sync fetching of the wasm failed';
        } catch (A) {
          U(A);
        }
      }
      function J(A, I, g) {
        return (function (A) {
          return E || 'function' != typeof fetch
            ? Promise.resolve().then(function () {
                return K(A);
              })
            : fetch(A, {credentials: 'same-origin'})
                .then(function (I) {
                  if (!I.ok)
                    throw "failed to load wasm binary file at '" + A + "'";
                  return I.arrayBuffer();
                })
                .catch(function () {
                  return K(A);
                });
        })(A)
          .then(function (A) {
            return WebAssembly.instantiate(A, I);
          })
          .then(function (A) {
            return A;
          })
          .then(g, function (A) {
            o('failed to asynchronously prepare wasm: ' + A), U(A);
          });
      }
      var Y = {14668: () => t.length};
      function H(A) {
        for (; 0 < A.length; ) A.shift()(I);
      }
      var l = [],
        f = [null, [], []];
      function u(A, g, B, C) {
        var Q = {
          string: A => {
            var I = 0;
            if (null != A && 0 !== A) {
              var g = 1 + (A.length << 2),
                B = (I = b(g)),
                C = D;
              if (0 < g) {
                g = B + g - 1;
                for (var Q = 0; Q < A.length; ++Q) {
                  var E = A.charCodeAt(Q);
                  if (
                    (55296 <= E &&
                      57343 >= E &&
                      (E =
                        (65536 + ((1023 & E) << 10)) |
                        (1023 & A.charCodeAt(++Q))),
                    127 >= E)
                  ) {
                    if (B >= g) break;
                    C[B++] = E;
                  } else {
                    if (2047 >= E) {
                      if (B + 1 >= g) break;
                      C[B++] = 192 | (E >> 6);
                    } else {
                      if (65535 >= E) {
                        if (B + 2 >= g) break;
                        C[B++] = 224 | (E >> 12);
                      } else {
                        if (B + 3 >= g) break;
                        (C[B++] = 240 | (E >> 18)),
                          (C[B++] = 128 | ((E >> 12) & 63));
                      }
                      C[B++] = 128 | ((E >> 6) & 63);
                    }
                    C[B++] = 128 | (63 & E);
                  }
                }
                C[B] = 0;
              }
            }
            return I;
          },
          array: A => {
            var I = b(A.length);
            return t.set(A, I), I;
          },
        };
        A = I['_' + A];
        var E,
          i = [],
          o = 0;
        if (C)
          for (var e = 0; e < C.length; e++) {
            var s = Q[B[e]];
            s ? (0 === o && (o = q()), (i[e] = s(C[e]))) : (i[e] = C[e]);
          }
        return (
          (B = A.apply(null, i)),
          (E = B),
          0 !== o && T(o),
          'string' === g ? (E ? h(D, E) : '') : 'boolean' === g ? !!E : E
        );
      }
      var x,
        p =
          'function' == typeof atob
            ? atob
            : function (A) {
                var I = '',
                  g = 0;
                A = A.replace(/[^A-Za-z0-9\+\/=]/g, '');
                do {
                  var B =
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                        A.charAt(g++),
                      ),
                    C =
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                        A.charAt(g++),
                      ),
                    Q =
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                        A.charAt(g++),
                      ),
                    E =
                      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                        A.charAt(g++),
                      );
                  (B = (B << 2) | (C >> 4)), (C = ((15 & C) << 4) | (Q >> 2));
                  var i = ((3 & Q) << 6) | E;
                  (I += String.fromCharCode(B)),
                    64 !== Q && (I += String.fromCharCode(C)),
                    64 !== E && (I += String.fromCharCode(i));
                } while (g < A.length);
                return I;
              },
        m = {
          b: function (A, I, g, B) {
            U(
              'Assertion failed: ' +
                (A ? h(D, A) : '') +
                ', at: ' +
                [
                  I ? (I ? h(D, I) : '') : 'unknown filename',
                  g,
                  B ? (B ? h(D, B) : '') : 'unknown function',
                ],
            );
          },
          a: function () {
            U('');
          },
          h: function (A, I, g) {
            var B;
            for (l.length = 0, g >>= 2; (B = D[I++]); )
              (g += (105 != B) & g), l.push(105 == B ? s[g] : r[g++ >> 1]), ++g;
            return Y[A].apply(null, l);
          },
          g: function (A, I, g) {
            D.copyWithin(A, I, I + g);
          },
          e: function (A) {
            var I = D.length;
            2147483648 < (A >>>= 0) && U('OOM');
            for (var g = 1; 4 >= g; g *= 2) {
              var B = I * (1 + 0.2 / g);
              B = Math.min(B, A + 100663296);
              var C = Math,
                Q = C.min;
              (B = Math.max(A, B)), (B += (65536 - (B % 65536)) % 65536);
              A: {
                var E = e.buffer;
                try {
                  e.grow(
                    (Q.call(C, 2147483648, B) - E.byteLength + 65535) >>> 16,
                  ),
                    n();
                  var i = 1;
                  break A;
                } catch (A) {}
                i = void 0;
              }
              if (i) return !0;
            }
            U('OOM');
          },
          f: function () {
            return 52;
          },
          d: function () {
            return 70;
          },
          c: function (A, I, g, B) {
            for (var C = 0, Q = 0; Q < g; Q++) {
              var E = a[I >> 2],
                e = a[(I + 4) >> 2];
              I += 8;
              for (var t = 0; t < e; t++) {
                var s = D[E + t],
                  r = f[A];
                0 === s || 10 === s
                  ? ((1 === A ? i : o)(h(r, 0)), (r.length = 0))
                  : r.push(s);
              }
              C += e;
            }
            return (a[B >> 2] = C), 0;
          },
        };
      function q() {
        return (q = I.asm.H).apply(null, arguments);
      }
      function T() {
        return (T = I.asm.I).apply(null, arguments);
      }
      function b() {
        return (b = I.asm.J).apply(null, arguments);
      }
      function O() {
        function A() {
          if (!x && ((x = !0), (I.calledRun = !0), !c)) {
            if (
              (H(S),
              g(I),
              I.onRuntimeInitialized && I.onRuntimeInitialized(),
              I.postRun)
            )
              for (
                'function' == typeof I.postRun && (I.postRun = [I.postRun]);
                I.postRun.length;

              ) {
                var A = I.postRun.shift();
                F.unshift(A);
              }
            H(F);
          }
        }
        if (!(0 < N)) {
          if (I.preRun)
            for (
              'function' == typeof I.preRun && (I.preRun = [I.preRun]);
              I.preRun.length;

            )
              G();
          H(y),
            0 < N ||
              (I.setStatus
                ? (I.setStatus('Running...'),
                  setTimeout(function () {
                    setTimeout(function () {
                      I.setStatus('');
                    }, 1),
                      A();
                  }, 1))
                : A());
        }
      }
      if (
        ((function () {
          function A(A) {
            if (
              ((A = A.exports),
              (I.asm = A),
              (e = I.asm.i),
              n(),
              S.unshift(I.asm.j),
              N--,
              I.monitorRunDependencies && I.monitorRunDependencies(N),
              0 == N && (null !== M && (clearInterval(M), (M = null)), k))
            ) {
              var g = k;
              (k = null), g();
            }
            return A;
          }
          var g = {a: m};
          if (
            (N++,
            I.monitorRunDependencies && I.monitorRunDependencies(N),
            I.instantiateWasm)
          )
            try {
              return I.instantiateWasm(g, A);
            } catch (A) {
              o('Module.instantiateWasm callback failed with error: ' + A),
                B(A);
            }
          (function (A, I) {
            var g = R;
            return E ||
              'function' != typeof WebAssembly.instantiateStreaming ||
              d(g) ||
              'function' != typeof fetch
              ? J(g, A, I)
              : fetch(g, {credentials: 'same-origin'}).then(function (B) {
                  return WebAssembly.instantiateStreaming(B, A).then(
                    I,
                    function (B) {
                      return (
                        o('wasm streaming compile failed: ' + B),
                        o('falling back to ArrayBuffer instantiation'),
                        J(g, A, I)
                      );
                    },
                  );
                });
          })(g, function (I) {
            A(I.instance);
          }).catch(B);
        })(),
        (I._strich_version = function () {
          return (I._strich_version = I.asm.l).apply(null, arguments);
        }),
        (I._strich_init = function () {
          return (I._strich_init = I.asm.m).apply(null, arguments);
        }),
        (I._strich_set_debug = function () {
          return (I._strich_set_debug = I.asm.n).apply(null, arguments);
        }),
        (I._strich_destroy = function () {
          return (I._strich_destroy = I.asm.o).apply(null, arguments);
        }),
        (I._strich_process_frame = function () {
          return (I._strich_process_frame = I.asm.p).apply(null, arguments);
        }),
        (I._strich_create_buffer = function () {
          return (I._strich_create_buffer = I.asm.q).apply(null, arguments);
        }),
        (I._strich_destroy_buffer = function () {
          return (I._strich_destroy_buffer = I.asm.r).apply(null, arguments);
        }),
        (I._strich_get_number_of_results = function () {
          return (I._strich_get_number_of_results = I.asm.s).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_result_data = function () {
          return (I._strich_get_result_data = I.asm.t).apply(null, arguments);
        }),
        (I._strich_get_result_data_len = function () {
          return (I._strich_get_result_data_len = I.asm.u).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_result_raw_data = function () {
          return (I._strich_get_result_raw_data = I.asm.v).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_result_type = function () {
          return (I._strich_get_result_type = I.asm.w).apply(null, arguments);
        }),
        (I._strich_get_result_supplemental_data = function () {
          return (I._strich_get_result_supplemental_data = I.asm.x).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_bounding_rect_x = function () {
          return (I._strich_get_bounding_rect_x = I.asm.y).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_bounding_rect_y = function () {
          return (I._strich_get_bounding_rect_y = I.asm.z).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_bounding_rect_width = function () {
          return (I._strich_get_bounding_rect_width = I.asm.A).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_bounding_rect_height = function () {
          return (I._strich_get_bounding_rect_height = I.asm.B).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_debug_output = function () {
          return (I._strich_get_debug_output = I.asm.C).apply(null, arguments);
        }),
        (I._strich_get_status_message = function () {
          return (I._strich_get_status_message = I.asm.D).apply(
            null,
            arguments,
          );
        }),
        (I._strich_get_exception_message = function () {
          return (I._strich_get_exception_message = I.asm.E).apply(
            null,
            arguments,
          );
        }),
        (I._lsan_leak_check = function () {
          return (I._lsan_leak_check = I.asm.F).apply(null, arguments);
        }),
        (I._get_free_memory = function () {
          return (I._get_free_memory = I.asm.G).apply(null, arguments);
        }),
        (I.ccall = u),
        (I.cwrap = function (A, g, B, C) {
          var Q = !B || B.every(A => 'number' === A || 'boolean' === A);
          return 'string' !== g && Q && !C
            ? I['_' + A]
            : function () {
                return u(A, g, B, arguments);
              };
        }),
        (k = function A() {
          x || O(), x || (k = A);
        }),
        I.preInit)
      )
        for (
          'function' == typeof I.preInit && (I.preInit = [I.preInit]);
          0 < I.preInit.length;

        )
          I.preInit.pop()();
      return O(), A.ready;
    });
fA = xA;
class pA {
  static DEFAULT_DUPLICATE_INTERVAL = 750;
  duplicateFilter = void 0;
  engineDebug = !1;
  constructor(A) {
    if (
      ((this.config = A || {}),
      void 0 === this.config.duplicateInterval ||
        null === this.config.duplicateInterval)
    )
      this.duplicateFilter = new lA(pA.DEFAULT_DUPLICATE_INTERVAL);
    else if (this.config.duplicateInterval > 0)
      this.duplicateFilter = new lA(this.config.duplicateInterval);
    else if (this.config.duplicateInterval < 0)
      throw E.configurationErrorWithDetail(
        'duplicateInterval must be a positive number',
      );
  }
  async init() {
    return void 0 === pA.api
      ? A(fA)()
          .then(A => {
            const I = {
              strich_version: A.cwrap('strich_version', 'string', []),
              strich_init: A.cwrap('strich_init', 'number', ['string']),
              strich_process_frame: A.cwrap('strich_process_frame', 'number', [
                'number',
                'number',
                'number',
                'number',
                'number',
                'number',
                'number',
              ]),
              strich_destroy: A.cwrap('strich_destroy', null, []),
              strich_get_number_of_results: A.cwrap(
                'strich_get_number_of_results',
                'number',
                [],
              ),
              strich_get_result_data: A.cwrap(
                'strich_get_result_data',
                'string',
                ['number'],
              ),
              strich_get_result_data_len: A.cwrap(
                'strich_get_result_data_len',
                'number',
                ['number'],
              ),
              strich_get_result_raw_data: A.cwrap(
                'strich_get_result_raw_data',
                'number',
                ['number'],
              ),
              strich_get_result_type: A.cwrap(
                'strich_get_result_type',
                'string',
                ['number'],
              ),
              strich_get_result_supplemental_data: A.cwrap(
                'strich_get_result_supplemental_data',
                'string',
                ['number'],
              ),
              strich_get_bounding_rect_x: A.cwrap(
                'strich_get_bounding_rect_x',
                'number',
                ['number'],
              ),
              strich_get_bounding_rect_y: A.cwrap(
                'strich_get_bounding_rect_y',
                'number',
                ['number'],
              ),
              strich_get_bounding_rect_width: A.cwrap(
                'strich_get_bounding_rect_width',
                'number',
                ['number'],
              ),
              strich_get_bounding_rect_height: A.cwrap(
                'strich_get_bounding_rect_height',
                'number',
                ['number'],
              ),
              strich_set_debug: A.cwrap('strich_set_debug', null, ['number']),
              strich_get_debug_output: A.cwrap(
                'strich_get_debug_output',
                'string',
                [],
              ),
              strich_get_status_message: A.cwrap(
                'strich_get_status_message',
                'string',
                [],
              ),
              strich_create_buffer: A.cwrap('strich_create_buffer', 'number', [
                'number',
                'number',
                'number',
              ]),
              strich_destroy_buffer: A.cwrap('strich_destroy_buffer', null, [
                'number',
              ]),
              strich_get_exception_message: A.cwrap(
                'strich_get_exception_message',
                'string',
                ['number'],
              ),
              lsan_leak_check: A.cwrap('lsan_leak_check', null, []),
              get_free_memory: A.cwrap('get_free_memory', 'number', []),
            };
            for (const A of Object.keys(I))
              if (null === I[A])
                throw (
                  (console.error(`WASM API binding failed (missing key: ${A})`),
                  E.internalErrorWithDetail(
                    `WASM API binding failed (missing key: ${A})`,
                  ))
                );
            return (
              console.debug(`STRICH Engine loaded (${I.strich_version()})`),
              (pA.api = I),
              (pA.Module = A),
              this.initEngine()
            );
          })
          .catch(A => {
            throw A instanceof E ? A : E.internalErrorWithCause(A);
          })
      : (pA.api.strich_destroy(), this.initEngine());
  }
  initEngine() {
    const A = JSON.stringify(this.config),
      I = pA.api?.strich_init(A);
    return 0 === I
      ? Promise.resolve(this)
      : Promise.reject(
          E.internalErrorWithDetail(
            `Failed to initialize engine, error code: ${I}`,
          ),
        );
  }
  destroy() {
    this.assertInitialized(), this.destroyBuffer(), pA.api.strich_destroy();
  }
  prepareBuffer(A, I) {
    this.assertInitialized(), this.destroyBuffer();
    const g = A.width * A.height * I,
      B = pA.api.strich_create_buffer(A.width, A.height, I);
    this.bufferSpec = {buffer: B, bufferSize: g, imageSize: A, channels: I};
  }
  getBuffer() {
    this.assertInitialized();
    const A = this.assertBufferAllocated();
    return [
      new Uint8ClampedArray(pA.Module.HEAPU8.buffer, A.buffer, A.bufferSize),
      A.imageSize,
      A.channels,
    ];
  }
  destroyBuffer() {
    this.assertInitialized(),
      this.bufferSpec &&
        (pA.api.strich_destroy_buffer(this.bufferSpec.buffer),
        (this.bufferSpec = void 0));
  }
  processFrame(A) {
    this.assertInitialized();
    const I = this.assertBufferAllocated();
    A.debug !== this.engineDebug &&
      ((this.engineDebug = A.debug),
      pA.api?.strich_set_debug(this.engineDebug ? 1 : 0));
    const g = A.touchHint ? A.touchHint.x : -1,
      B = A.touchHint ? A.touchHint.y : -1,
      C = A.hasSaliency ? 1 : 0;
    try {
      const Q = pA.api.strich_process_frame(
        C,
        A.frameTimestamp,
        I.buffer,
        I.imageSize.width,
        I.imageSize.height,
        g,
        B,
      );
      if (0 !== Q)
        throw E.internalErrorWithDetail(
          `Engine error occurred, error code: ${Q}`,
        );
    } catch (A) {
      if ('number' == typeof A) {
        const I = pA.api.strich_get_exception_message(A);
        throw E.internalErrorWithDetail(I);
      }
    }
    const Q = [],
      i = pA.api.strich_get_number_of_results();
    for (let I = 0; I < i; I++) {
      const g = this.getCodeDetection(A, I);
      (this.duplicateFilter && this.duplicateFilter.filter(g)) ||
        Q.push(this.getCodeDetection(A, I));
    }
    if (A.debug) {
      try {
        const I = pA.api.strich_get_debug_output();
        I && (A.debugOutput = JSON.parse(I));
      } catch (A) {
        console.error(`Failed to parse engine debug output: ${A}`);
      }
      A.statusMessage = pA.api.strich_get_status_message();
    }
    return new HA(Q);
  }
  assertInitialized() {
    if (void 0 === pA.Module || void 0 === pA.api)
      throw E.internalErrorWithDetail('Engine was not previously initialized');
  }
  assertBufferAllocated() {
    if (void 0 === this.bufferSpec)
      throw E.internalErrorWithDetail('Buffer was not previously allocated');
    return this.bufferSpec;
  }
  getCodeDetection(A, I) {
    const g = pA.api.strich_get_result_type(I),
      B = pA.api.strich_get_result_data(I),
      C = pA.api.strich_get_result_raw_data(I),
      Q = pA.api.strich_get_result_data_len(I),
      E = new Uint8Array(pA.Module.HEAPU8.subarray(C, C + Q)),
      i = pA.api.strich_get_result_supplemental_data(I),
      o = iA(
        QA(
          pA.api.strich_get_bounding_rect_x(I),
          pA.api.strich_get_bounding_rect_y(I),
        ),
        EA(
          pA.api.strich_get_bounding_rect_width(I),
          pA.api.strich_get_bounding_rect_height(I),
        ),
      );
    return {
      time: A.startTime,
      data: B,
      supplementalData: i,
      typeName: g,
      boundingRect: o,
      rawData: E,
    };
  }
}
let mA;
var qA;
function TA(A) {
  switch (A) {
    case mA.EAN13:
    case mA.EAN8:
    case mA.UPCA:
    case mA.UPCE:
    case mA.DATABAR:
    case mA.DATABAR_EXP:
    case mA.CODE39:
    case mA.CODE93:
    case mA.CODE128:
    case mA.I25:
    case mA.CODABAR:
      return !0;
    default:
      return !1;
  }
}
((qA = mA || (mA = {})).EAN13 = 'ean13'),
  (qA.EAN8 = 'ean8'),
  (qA.EAN5 = 'ean5'),
  (qA.EAN2 = 'ean2'),
  (qA.UPCA = 'upca'),
  (qA.UPCE = 'upce'),
  (qA.DATABAR = 'databar'),
  (qA.DATABAR_EXP = 'databar-exp'),
  (qA.CODE39 = 'code39'),
  (qA.CODE93 = 'code93'),
  (qA.CODE128 = 'code128'),
  (qA.I25 = 'i25'),
  (qA.CODABAR = 'codabar'),
  (qA.QR = 'qr'),
  (qA.AZTEC = 'aztec'),
  (qA.DATAMATRIX = 'datamatrix');
class bA {
  static flashlightOffIcon =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMi44MSwyLjgxTDEuMzksNC4yMkw4LDEwLjgzVjIyaDh2LTMuMTdsMy43OCwzLjc4bDEuNDEtMS40MUwyLjgxLDIuODF6IE0xNCwyMGgtNHYtNy4xN2w0LDRWMjB6Ii8+PHBvbHlnb24gcG9pbnRzPSIxNiw0IDE2LDUgNy44Myw1IDkuODMsNyAxNiw3IDE2LDcuMzkgMTQsMTAuNCAxNCwxMS4xNyAxNiwxMy4xNyAxNiwxMSAxOCw4IDE4LDIgNiwyIDYsMy4xNyA2LjgzLDQiLz48L2c+PC9nPjwvc3ZnPg==';
  static flashlightOnIcon =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTgsMkg2djZsMiwzdjExaDhWMTFsMi0zVjJ6IE0xNiw0djFIOFY0SDE2eiBNMTQsMTAuNFYyMGgtNHYtOS42MWwtMi0zVjdoOHYwLjM5TDE0LDEwLjR6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxNCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=';
  static reportIcon =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE1LjczIDNIOC4yN0wzIDguMjd2Ny40Nkw4LjI3IDIxaDcuNDZMMjEgMTUuNzNWOC4yN0wxNS43MyAzek0xOSAxNC45TDE0LjkgMTlIOS4xTDUgMTQuOVY5LjFMOS4xIDVoNS44TDE5IDkuMXY1Ljh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxNiIgcj0iMSIvPjxwYXRoIGQ9Ik0xMSA3aDJ2N2gtMnoiLz48L3N2Zz4=';
  static logo =
    'data:image/png;base64,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';
  static statusMessageMinLifetime = 1e3;
  constructor(A, I, g, B, C, Q) {
    (this.config = A),
      (this.frameSource = g),
      (this.viewportSize = B),
      (this.roeSpec = C),
      (this.DETECTION_LIFETIME = 500),
      (this.visibleDetections = []),
      (this.pendingClearDetection = 0),
      (this.lastStatusMessageUpdate = 0),
      (this.showDetections = !0 === A.showDetections),
      (this.detectionCanvas = document.createElement('canvas')),
      (this.targetingCanvas = document.createElement('canvas')),
      (this.debugCanvas =
        !0 === A.showDebugOutput ? document.createElement('canvas') : void 0),
      (this.canvasScale = window.devicePixelRatio),
      void 0 === A.showTargetingLine || A.showTargetingLine
        ? (this.showHorizontalTargetingLine = Q)
        : (this.showHorizontalTargetingLine = !1);
    const E = this.frameSource.getImageSize();
    (this.viewportTransformer = new kA(E, B)),
      (this.viewportRoE = eA(this.viewportSize, this.roeSpec)),
      (this.imageRoE = this.viewportTransformer.viewportRectToImageRect(
        this.viewportRoE,
      ));
    for (const A of [
      this.detectionCanvas,
      this.debugCanvas,
      this.targetingCanvas,
    ])
      A &&
        ((A.width = Math.floor(B.width * this.canvasScale)),
        (A.height = Math.floor(B.height * this.canvasScale)),
        (A.style.width = '100%'),
        (A.style.height = '100%'),
        (A.style.position = 'absolute'),
        (A.style.top = '0'),
        (A.style.left = '0'),
        I.appendChild(A));
    (this.config.showCameraSelector = A?.showCameraSelector ?? !0),
      (this.config.showFlashlight = A?.showFlashlight ?? !0),
      this.createButtonBar(I);
  }
  initialize() {
    const A = new Image();
    return new Promise((I, g) => {
      (A.onload = () => {
        (this.logoImage = A),
          this.drawTargetingOverlay(),
          this.showHorizontalTargetingLine &&
            this.drawHorizontalTargetingLine(!1);
        const B = this.frameSource.getTorchEnabled();
        this.setTorchState(void 0 !== B && B),
          this.targetingCanvas?.addEventListener('click', A => {
            if (
              (this.frameSource
                .focusOnTap()
                .then(() => {})
                .catch(A => {
                  console.warn(`Tap-to-focus failed with error: ${A}`);
                }),
              this.targetingCanvas && this.touchHandler)
            ) {
              const I = this.targetingCanvas.getBoundingClientRect(),
                g = {x: A.clientX - I.left, y: A.clientY - I.top},
                B = this.viewportTransformer.viewportPointToImagePoint(g),
                C = {
                  x: B.x - this.imageRoE.origin.x,
                  y: B.y - this.imageRoE.origin.y,
                };
              this.touchHandler(C.x, C.y);
            }
          }),
          this.populateCameraSelector()
            .then(() => I(this))
            .catch(A => g(A));
      }),
        this.config.customLogoSrc && nA.license.hasCustomOverlayLogoCapability
          ? (A.src = this.config.customLogoSrc)
          : (A.src = bA.logo);
    });
  }
  destroy() {
    this.buttonBar?.remove(),
      (this.buttonBar = void 0),
      this.detectionCanvas?.remove(),
      (this.detectionCanvas = void 0),
      this.debugCanvas?.remove(),
      (this.debugCanvas = void 0),
      this.targetingCanvas?.remove(),
      (this.targetingCanvas = void 0);
  }
  updateDebug(A) {
    if (A.debug && void 0 !== this.debugCanvas) {
      const I = this.debugCanvas.getContext('2d');
      if (!I) return;
      I.save();
      try {
        I.scale(this.canvasScale, this.canvasScale),
          I.clearRect(0, 0, this.viewportSize.width, this.viewportSize.height),
          this.dragDebugContext(I, A),
          this.drawDebugOutput(I, A.debugOutput),
          A.statusMessage
            ? (this.drawStatusMessage(I, A.statusMessage),
              (this.lastStatusMessage = A.statusMessage),
              (this.lastStatusMessageUpdate = A.startTime))
            : this.lastStatusMessage &&
              A.startTime - this.lastStatusMessageUpdate <
                bA.statusMessageMinLifetime
            ? this.drawStatusMessage(I, this.lastStatusMessage)
            : (this.lastStatusMessage = void 0);
      } finally {
        I.restore();
      }
    }
  }
  update(A) {
    const I = A ? A.codeDetections : [];
    if (
      (I.forEach(A => this.visibleDetections.push(A)),
      this.showDetections &&
        requestAnimationFrame(() => {
          const A = Date.now(),
            I = this.detectionCanvas?.getContext('2d');
          if (I) {
            I.save();
            try {
              I.scale(this.canvasScale, this.canvasScale),
                I.clearRect(
                  0,
                  0,
                  this.detectionCanvas.width,
                  this.detectionCanvas.height,
                );
              for (let g = 0; g < this.visibleDetections.length; g++) {
                const B = this.visibleDetections[g],
                  C = A - B.time;
                if (C < this.DETECTION_LIFETIME) {
                  const A = ((0.25 * C) / this.DETECTION_LIFETIME).toFixed(2);
                  I.fillStyle = `rgba(0, 0, 255, ${A})`;
                  const g = iA(
                      QA(
                        B.boundingRect.origin.x + this.imageRoE.origin.x,
                        B.boundingRect.origin.y + this.imageRoE.origin.y,
                      ),
                      B.boundingRect.size,
                    ),
                    Q = this.viewportTransformer.imageRectToViewportRect(g);
                  I.fillRect(
                    Q.origin.x,
                    Q.origin.y,
                    Q.size.width,
                    Q.size.height,
                  );
                }
              }
            } finally {
              I.restore();
            }
          }
        }),
      I.length > 0)
    ) {
      let A = !1;
      if (this.showHorizontalTargetingLine) {
        void 0 !== I.find(A => TA(A.typeName)) &&
          ((A = !0),
          requestAnimationFrame(() => {
            this.drawHorizontalTargetingLine(!0);
          }));
      }
      this.pendingClearDetection > 0 &&
        (window.clearTimeout(this.pendingClearDetection),
        (this.pendingClearDetection = 0)),
        (this.pendingClearDetection = window.setTimeout(() => {
          requestAnimationFrame(() => {
            this.clearDetectionsFromOverlay(),
              A && this.drawHorizontalTargetingLine(!1);
          });
        }, 250));
    }
  }
  setTorchState(A) {
    this.flashlightButton &&
      (this.flashlightButton.src = A
        ? bA.flashlightOnIcon
        : bA.flashlightOffIcon);
  }
  populateCameraSelector() {
    if (!this.config.showCameraSelector) return Promise.resolve();
    const A = this.cameraSelectElem;
    if (!A) return Promise.resolve();
    const I = this.frameSource.getCurrentCameraDevice();
    return this.frameSource
      .getAvailableDevices()
      .then(g => {
        for (; A.firstChild; ) A.removeChild(A.firstChild);
        const B = g.filter(A => A.isBackFacing);
        for (const I of B) {
          const g = document.createElement('option');
          (g.value = I.deviceId), (g.innerHTML = I.label), A.appendChild(g);
        }
        return I && (A.value = I.deviceId), B;
      })
      .then(I => {
        A.style.display = I.length <= 1 ? 'none' : 'visible';
      });
  }
  drawTargetingOverlay() {
    const A = this.targetingCanvas?.getContext('2d');
    if (!A)
      throw E.internalErrorWithDetail(
        'Failed to draw overlay, no 2D context returned for canvas',
      );
    A.save();
    try {
      if (
        (A.scale(this.canvasScale, this.canvasScale),
        (A.strokeStyle = 'rgba(255,255,255,1)'),
        (A.lineWidth = 1),
        A.strokeRect(
          this.viewportRoE.origin.x,
          this.viewportRoE.origin.y,
          this.viewportRoE.size.width,
          this.viewportRoE.size.height,
        ),
        this.logoImage)
      ) {
        const I = this.logoImage.width / 4,
          g = this.logoImage.height / 4;
        A.drawImage(
          this.logoImage,
          this.viewportRoE.origin.x + this.viewportRoE.size.width - I - 4,
          this.viewportRoE.origin.y + this.viewportRoE.size.height - g - 4,
          I,
          g,
        );
      }
    } finally {
      A.restore();
    }
  }
  drawHorizontalTargetingLine(A) {
    if (!this.showHorizontalTargetingLine) return;
    const I = this.targetingCanvas?.getContext('2d');
    if (I) {
      I.save();
      try {
        I.scale(this.canvasScale, this.canvasScale);
        const g = 20,
          B = this.viewportRoE.origin.y + this.viewportRoE.size.height / 2;
        I.clearRect(
          this.viewportRoE.origin.x + g,
          B - 1,
          this.viewportRoE.size.width - 2 * g,
          3,
        ),
          (I.strokeStyle = A ? 'rgba(255,0,0,1)' : 'rgba(255,255,255,0.15)'),
          I.beginPath(),
          I.moveTo(this.viewportRoE.origin.x + g, B),
          I.lineTo(
            this.viewportRoE.origin.x + this.viewportRoE.size.width - g,
            B,
          ),
          I.stroke();
      } finally {
        I.restore();
      }
    }
  }
  dragDebugContext(A, I) {
    const g = (this.viewportSize.width - 40) / 2,
      B = this.viewportSize.height - 8 - 10;
    (A.fillStyle = '#000000'),
      A.clearRect(0, B - 1, this.viewportSize.width, 10),
      A.fillRect(19, B - 1, g + 2, 10);
    let C = 20,
      Q = I.startTime;
    for (const g of I.timingEvents) {
      A.fillStyle = g.cssColor;
      const I = C,
        E = Math.trunc(g.time - Q);
      A.fillRect(I, B, E, 8), (C += E), (Q = g.time);
    }
    (A.fillStyle = 'white'), (A.textAlign = 'left');
    const E = I.getElapsedTime().toFixed(0);
    (A.font = '9px sans-serif'),
      A.fillText(`${E} ms`, 20 + g + 20, B + 8),
      (A.textAlign = 'right');
    const i = `${I.size.width}x${I.size.height} (${this.viewportTransformer.imageSize.width}x${this.viewportTransformer.imageSize.height})`;
    A.fillText(i, this.viewportSize.width - 20, this.viewportSize.height - 10);
  }
  drawStatusMessage(A, I) {
    (A.fillStyle = 'white'),
      (A.font = '10px sans-serif'),
      (A.textAlign = 'right'),
      A.fillText(I, this.viewportSize.width - 20, 20);
  }
  drawDebugOutput(A, I) {
    I &&
      (this.drawDebugS1(A, I),
      this.drawDebugS2(A, I),
      this.drawDebugTouch(A, I),
      this.drawDebugAztec(A, I));
  }
  drawDebugS1(A, I) {
    if (!I.maxS1Point || void 0 === I.maxS1Rect || oA(I.maxS1Rect)) return;
    const g = iA(
        QA(
          I.maxS1Rect.origin.x + this.imageRoE.origin.x,
          I.maxS1Rect.origin.y + this.imageRoE.origin.y,
        ),
        I.maxS1Rect.size,
      ),
      B = QA(
        this.imageRoE.origin.x + I.maxS1Point.x,
        this.imageRoE.origin.y + I.maxS1Point.y,
      ),
      C = this.viewportTransformer.imageRectToViewportRect(g),
      Q = this.viewportTransformer.imagePointToViewportPoint(B);
    (A.fillStyle = 'rgba(255, 255, 0, 0.25)'),
      A.fillRect(C.origin.x, C.origin.y, C.size.width, C.size.height),
      (A.strokeStyle = 'rgba(255, 255, 0, 0.5)'),
      A.beginPath(),
      A.moveTo(C.origin.x, Q.y),
      A.lineTo(C.origin.x + C.size.width, Q.y),
      A.stroke(),
      A.beginPath(),
      A.moveTo(Q.x, C.origin.y),
      A.lineTo(Q.x, C.origin.y + C.size.height),
      A.stroke(),
      (A.fillStyle = 'white'),
      (A.font = '12px sans-serif'),
      (A.textAlign = 'right'),
      A.fillText(
        I.maxS1.toString(),
        C.origin.x + C.size.width - 4,
        C.origin.y + 14,
      );
  }
  drawDebugS2(A, I) {
    if (!I.maxS2Point || void 0 === I.maxS2Rect || oA(I.maxS2Rect)) return;
    const g = iA(
        {
          x: I.maxS2Rect.origin.x + this.imageRoE.origin.x,
          y: I.maxS2Rect.origin.y + this.imageRoE.origin.y,
        },
        I.maxS2Rect.size,
      ),
      B = {
        x: this.imageRoE.origin.x + I.maxS2Point.x,
        y: this.imageRoE.origin.y + I.maxS2Point.y,
      },
      C = this.viewportTransformer.imageRectToViewportRect(g),
      Q = this.viewportTransformer.imagePointToViewportPoint(B);
    (A.fillStyle = 'rgba(0, 0, 255, 0.25)'),
      A.fillRect(C.origin.x, C.origin.y, C.size.width, C.size.height),
      (A.strokeStyle = 'rgba(0, 0, 255, 0.5)'),
      A.beginPath(),
      A.moveTo(C.origin.x, Q.y),
      A.lineTo(C.origin.x + C.size.width, Q.y),
      A.stroke(),
      A.beginPath(),
      A.moveTo(Q.x, C.origin.y),
      A.lineTo(Q.x, C.origin.y + C.size.height),
      A.stroke(),
      (A.fillStyle = 'white'),
      (A.font = '12px sans-serif'),
      (A.textAlign = 'right'),
      A.fillText(
        I.maxS2.toString(),
        C.origin.x + C.size.width - 4,
        C.origin.y + 14,
      );
  }
  drawDebugTouch(A, I) {
    if (!I.touchRect) return;
    const g = iA(
        {
          x: I.touchRect.origin.x + this.imageRoE.origin.x,
          y: I.touchRect.origin.y + this.imageRoE.origin.y,
        },
        I.touchRect.size,
      ),
      B = this.viewportTransformer.imageRectToViewportRect(g);
    (A.fillStyle = 'rgba(0, 255, 0, 0.25)'),
      A.fillRect(B.origin.x, B.origin.y, B.size.width, B.size.height);
  }
  drawDebugAztec(A, I) {
    if (!I.azCenter) return;
    const g = {
        x: this.imageRoE.origin.x + I.azCenter.x,
        y: this.imageRoE.origin.y + I.azCenter.y,
      },
      B = this.viewportTransformer.imagePointToViewportPoint(g);
    if (
      ((A.fillStyle = 'yellow'),
      A.fillRect(B.x - 2, B.y - 2, 4, 4),
      I.azC0 && I.azC1 && I.azC2 && I.azC3)
    ) {
      let g, B;
      (A.strokeStyle = 'orange'),
        A.beginPath(),
        (g = {
          x: this.imageRoE.origin.x + I.azC0.x,
          y: this.imageRoE.origin.y + I.azC0.y,
        }),
        (B = this.viewportTransformer.imagePointToViewportPoint(g)),
        A.moveTo(B.x, B.y),
        (g = {
          x: this.imageRoE.origin.x + I.azC1.x,
          y: this.imageRoE.origin.y + I.azC1.y,
        }),
        (B = this.viewportTransformer.imagePointToViewportPoint(g)),
        A.lineTo(B.x, B.y),
        (g = {
          x: this.imageRoE.origin.x + I.azC2.x,
          y: this.imageRoE.origin.y + I.azC2.y,
        }),
        (B = this.viewportTransformer.imagePointToViewportPoint(g)),
        A.lineTo(B.x, B.y),
        (g = {
          x: this.imageRoE.origin.x + I.azC3.x,
          y: this.imageRoE.origin.y + I.azC3.y,
        }),
        (B = this.viewportTransformer.imagePointToViewportPoint(g)),
        A.lineTo(B.x, B.y),
        A.closePath(),
        A.stroke();
    }
  }
  clearDetectionsFromOverlay() {
    if (null == this.detectionCanvas) return;
    this.visibleDetections = [];
    const A = this.detectionCanvas.getContext('2d');
    A &&
      A.clearRect(
        0,
        0,
        this.detectionCanvas.width,
        this.detectionCanvas.height,
      );
  }
  createButtonBar(A) {
    const I = document.createElement('div');
    if (
      ((I.style.height = '48px'),
      (I.style.position = 'absolute'),
      (I.style.top = '0'),
      (I.style.left = '0'),
      (I.style.right = '0'),
      (I.style.backgroundColor = 'transparent'),
      (I.style.display = 'flex'),
      (I.style.flexDirection = 'row'),
      (I.style.alignItems = 'center'),
      (I.style.paddingLeft = '10px'),
      (I.style.paddingRight = '10px'),
      this.config.showCameraSelector)
    ) {
      const A = this.createCameraSelector();
      I.appendChild(A),
        (this.cameraSelectElem = A),
        (A.onchange = () => {
          this.onCameraSelected(A.value);
        });
    }
    if (this.config.showReportCode) {
      const A = document.createElement('img');
      (A.src = bA.reportIcon),
        (A.width = 32),
        (A.height = 32),
        I.appendChild(A),
        (this.reportButton = A),
        (this.reportButton.onclick = () => {
          this.snapshotHandler && this.snapshotHandler();
        });
    }
    const g = document.createElement('div');
    if (
      ((g.style.flexGrow = '1'),
      I.appendChild(g),
      this.config.showFlashlight && !tA())
    ) {
      const A = document.createElement('img');
      (A.src = bA.flashlightOffIcon),
        (A.width = 32),
        (A.height = 32),
        I.appendChild(A),
        (this.flashlightButton = A),
        (this.flashlightButton.onclick = () => {
          const A = this.frameSource.getTorchEnabled(),
            I = !1 === A || void 0 === A;
          return this.frameSource
            .setTorchEnabled(I)
            .then(() => {
              this.setTorchState(I);
            })
            .catch(A => {
              console.warn(
                `Failed to toggle torch: ${A} (HINT: may not be supported by this browser)`,
              );
            });
        });
    }
    A.appendChild(I), (this.buttonBar = I);
  }
  createCameraSelector() {
    const A = document.createElement('select');
    return (
      (A.style.backgroundColor = 'transparent'),
      (A.style.color = 'white'),
      (A.style.borderColor = 'white'),
      (A.style.borderWidth = '1px'),
      (A.style.fontSize = '16px'),
      (A.style.outlineStyle = 'none'),
      (A.style.maxWidth = '140px'),
      A
    );
  }
  onCameraSelected(A) {
    void 0 !== this.selectCameraHandler && this.selectCameraHandler(A);
  }
}
class OA {
  debug = !1;
  constructor(A, I, g, B, C, Q) {
    (this.startTime = A),
      (this.frameTimestamp = I),
      (this.timingEvents = []),
      (this.buffer = g),
      (this.size = B),
      (this.channels = C),
      (this.hasSaliency = Q),
      (this.debug = !1),
      (this.debugOutput = void 0),
      (this.statusMessage = void 0);
  }
  addTimingEvent(A) {
    this.timingEvents.push(A);
  }
  getElapsedTime() {
    return 0 === this.timingEvents.length
      ? 0
      : this.timingEvents[this.timingEvents.length - 1].time - this.startTime;
  }
  setTouchHint(A, I) {
    this.touchHint = {x: A, y: I};
  }
}
class PA {
  url = 'https://analytics.strich.io/api/v1/web/events/scans';
  devUrl = 'https://analytics-dev.strich.io/api/v1/web/events/scans';
  static maxScanEventsToBuffer = 32;
  constructor() {
    this.scanEvents = [];
  }
  addScanEvent(A) {
    navigator.sendBeacon &&
      ((nA.license.isOffline && nA.license.isAnalyticsOptOut) ||
        (this.scanEvents.push({timestamp: Date.now(), symbology: A}),
        this.scanEvents.length > PA.maxScanEventsToBuffer &&
          this.emitBeacon()));
  }
  emitBeacon() {
    if (!navigator.sendBeacon) return;
    if (0 === this.scanEvents.length) return;
    const A = nA.license.licenseId,
      I = nA.deviceId;
    if (!A || !I) return;
    const g = nA.license.isDevLicense ? this.devUrl : this.url,
      B = {
        sdkVersion: nA.version(),
        licenseId: A,
        deviceId: I,
        userAgent: navigator.userAgent,
        customId: null === nA.customId ? '' : nA.customId,
        locationHref: window.location.href,
        scans: this.scanEvents,
      };
    navigator.sendBeacon(g, JSON.stringify(B)) && (this.scanEvents = []);
  }
}
class vA {
  constructor(A, I, g, B) {
    (this.config = {}),
      (this.config.regionOfInterest = A?.regionOfInterest || I),
      (this.frameSource = g),
      (this.viewportSize = B);
  }
  initialize() {
    const A = this.frameSource.getImageSize();
    this.calculateRegionOfInterest(A),
      (this.canvas = this.createCanvas(this.roe.size));
    const I = this.canvas.getContext('2d', {willReadFrequently: !0});
    return I
      ? ((this.ctx = I), Promise.resolve(this))
      : Promise.reject(
          E.internalErrorWithDetail('Failed to create 2D context'),
        );
  }
  getRegionOfInterest() {
    return this.roe;
  }
  locate(A) {
    const I = this.frameSource.get();
    this.ctx.drawImage(
      I,
      this.roe.origin.x,
      this.roe.origin.y,
      this.roe.size.width,
      this.roe.size.height,
      0,
      0,
      this.roe.size.width,
      this.roe.size.height,
    );
    const g = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    if (g.data.length !== A.buffer.length)
      throw E.internalErrorWithDetail('Buffer size mismatch detected');
    A.addTimingEvent({
      time: Date.now(),
      event: 'frameAcquired',
      cssColor: 'red',
    });
    const B = A.buffer,
      C = B.byteLength;
    for (let A = 0; A < C; A += 4) {
      const I = 0.3 * g.data[A] + 0.59 * g.data[A + 1] + 0.11 * g.data[A + 2];
      (B[A] = I), (B[A + 1] = I), (B[A + 2] = I), (B[A + 3] = 255);
    }
    return (
      A.addTimingEvent({
        time: Date.now(),
        event: 'frameProcessed',
        cssColor: 'pink',
      }),
      Promise.resolve()
    );
  }
  destroy() {}
  getRegionOfInterestSpec() {
    return this.config.regionOfInterest;
  }
  createCanvas(A) {
    let I;
    return (
      !0 === nA.browserCapabilities.supportsOffscreenCanvas
        ? (I = new OffscreenCanvas(A.width, A.height))
        : ((I = document.createElement('canvas')),
          (I.style.visibility = 'hidden'),
          (I.width = A.width),
          (I.height = A.height)),
      I
    );
  }
  calculateRegionOfInterest(A) {
    if (!this.config.regionOfInterest)
      throw E.configurationErrorWithDetail('Region of interest is undefined');
    const I = eA(this.viewportSize, this.config.regionOfInterest),
      g = new kA(A, this.viewportSize);
    this.roe = g.viewportRectToImageRect(I);
  }
}
class WA {
  constructor(A) {
    const I = document.createElement('div');
    (I.style.background = 'rgba(0,0,0,0.5)'),
      (I.style.flexDirection = 'column'),
      (I.style.alignItems = 'center'),
      (I.style.position = 'absolute'),
      (I.style.top = '0'),
      (I.style.left = '0'),
      (I.style.right = '0'),
      (I.style.bottom = '0'),
      (I.style.display = 'none'),
      (I.style.justifyContent = 'center'),
      (I.style.padding = '20px'),
      (I.style.zIndex = '999');
    const g = document.createElement('p');
    (g.style.color = 'rgba(255,255,255,1)'),
      (g.style.textAlign = 'center'),
      (this.messageParagraph = g),
      I.appendChild(g);
    const B = document.createElement('p');
    (B.style.color = 'rgba(175,175,175,1)'),
      (B.style.textAlign = 'center'),
      (B.style.fontSize = '9px'),
      (B.style.display = 'none'),
      (B.style.marginTop = '8px'),
      (this.detailParagraph = B),
      I.appendChild(B);
    const C = document.createElement('button');
    (C.style.width = '100%'),
      (C.style.padding = '10px'),
      (C.style.border = 'none'),
      (C.style.marginTop = '20px'),
      (this.actionButton = C),
      I.appendChild(C),
      A.appendChild(I),
      (this.panel = I);
  }
  setError(A, I, g) {
    this.panel &&
      (A instanceof E
        ? ((this.messageParagraph.innerHTML = A.localizedMessage),
          this.setDetailMessage(A.detailMessage))
        : ((this.messageParagraph.innerHTML = A.message),
          this.setDetailMessage(void 0)),
      (this.panel.style.display = 'flex'),
      I
        ? ((this.actionButton.style.display = 'block'),
          (this.actionButton.innerText = I),
          g &&
            (this.actionButton.onclick = () => {
              this.clearError(), g();
            }))
        : ((this.actionButton.style.display = 'none'),
          (this.actionButton.innerText = ''),
          (this.actionButton.onclick = null)));
  }
  setDetailMessage(A) {
    A
      ? ((this.detailParagraph.innerHTML = A),
        (this.detailParagraph.style.display = 'block'))
      : ((this.detailParagraph.innerHTML = ''),
        (this.detailParagraph.style.display = 'none'));
  }
  clearError() {
    this.panel &&
      ((this.panel.style.display = 'none'),
      (this.messageParagraph.innerText = ''),
      (this.actionButton.style.display = 'none'),
      (this.actionButton.innerText = ''),
      (this.actionButton.onclick = null));
  }
  destroy() {
    this.panel && (this.panel.remove(), (this.panel = void 0));
  }
}
let jA;
var zA;
((zA = jA || (jA = {}))[(zA.NotInitialized = 0)] = 'NotInitialized'),
  (zA[(zA.Initialized = 1)] = 'Initialized'),
  (zA[(zA.Started = 2)] = 'Started'),
  (zA[(zA.Stopped = 3)] = 'Stopped'),
  (zA[(zA.Destroyed = 4)] = 'Destroyed');
class ZA {
  constructor(A) {
    if (
      ((this.configuration = A),
      (this.touchHint = void 0),
      (this.lastFrameProcessingTime = -1),
      (this.snapshotRequested = !1),
      (this.supportsRVF = !1),
      (this.rxfRequestId = 0),
      !nA.isInitialized())
    )
      throw new E('error.sdkNotInitialized');
    if (!A.selector)
      throw E.configurationErrorWithDetail(
        'No selector present in configuration',
      );
    if (
      !nA.browserCapabilities.supportsWASM ||
      !nA.browserCapabilities.supportsGetUserMedia ||
      !nA.browserCapabilities.supportsWebGL
    )
      throw new E('error.requirementsNotFulfilled');
    (this.supportsRVF = !0 === nA.browserCapabilities.supportsRVF),
      this.supportsRVF ||
        console.debug('Browser does not support RVF, falling back to RAF'),
      (this.hostElement = this.getAndCheckHostElement(A)),
      (this.state = jA.NotInitialized),
      (this.modeIsTouch = 'touch' === A.mode),
      (this.any1DSymbologyEnabled = this.isAny1DSymbologyEnabled(A)),
      (this.any2DSymbologyEnabled = this.isAny2DSymbologyEnabled(A)),
      (this.debug = !0 === A.debug),
      this.debug &&
        console.warn('Debug mode enabled. Do not use in production.'),
      (this.scanEventTracker = new PA());
  }
  initialize() {
    this.debug &&
      console.debug(
        `Initializing BarcodeReader (device capabilities: ${JSON.stringify(
          nA.browserCapabilities,
        )})...`,
      ),
      void 0 !== ZA.currentReader &&
        console.warn(
          'A current BarcodeReader already exists (HINT: missing destroy() call)',
        );
    const A = new WA(this.hostElement);
    this.errorOverlay = A;
    const I = this.hostElement.getBoundingClientRect(),
      g = EA(I.width, I.height);
    this.debug && console.debug('Viewport size (CSS pixels)', g);
    const B = this.configuration.frameSource || {resolution: 'hd'},
      C = YA.fromHostElement(B, this.hostElement);
    return (
      (C.debug = this.debug),
      C.initialize()
        .then(A => {
          const I = A.getImageSize();
          this.debug &&
            console.debug(
              `SDK initialization: FrameSource initialized with size ${I.width}x${I.height} px`,
            ),
            (A.endedHandler = () => {
              this.handleFrameSourceEnded();
            }),
            (this.videoFrameSource = A);
          return new pA(this.configuration.engine).init();
        })
        .then(A => {
          this.debug && console.debug('SDK initialization: Engine initialized'),
            (this.engine = A);
          const I = this.getDefaultRegionOfInterest();
          let B;
          if (
            ((this.hasSaliency = !this.configuration.engine?.simple1DMode),
            this.hasSaliency)
          ) {
            const A = this.configuration.locator?.impl;
            if ('auto' !== A && A)
              if ('webgl1' === A)
                console.warn(
                  'DEPRECATION WARNING: Forced WebGL1 locator implementation. WebGL1 locator may be removed in future releases.',
                ),
                  (B = new UA(this.configuration.locator, I, C, g));
              else {
                if ('webgl2' !== A)
                  throw E.configurationErrorWithDetail(
                    'Invalid locator impl: ' + A,
                  );
                B = new LA(this.configuration.locator, I, C, g);
              }
            else
              B = nA.browserCapabilities.supportsWebGL2
                ? new LA(this.configuration.locator, I, C, g)
                : new UA(this.configuration.locator, I, C, g);
          } else B = new vA(this.configuration.locator, I, C, g);
          return (B.debug = this.debug), B.initialize();
        })
        .then(A => {
          this.debug &&
            console.debug('SDK initialization: Locator initialized'),
            (this.locator = A);
          const I = A.getRegionOfInterest();
          this.engine.prepareBuffer(
            I.size,
            this.videoFrameSource.getNumberOfChannels(),
          );
          const B = this.configuration.overlay || {};
          return (
            (this.overlay = new bA(
              B,
              this.hostElement,
              this.videoFrameSource,
              g,
              A.getRegionOfInterestSpec(),
              this.any1DSymbologyEnabled,
            )),
            this.modeIsTouch &&
              (this.overlay.touchHandler = (A, I) => {
                this.onScanRequested(A, I);
              }),
            this.debug &&
              (this.overlay.snapshotHandler = () => {
                this.snapshotRequested = !0;
              }),
            (this.overlay.selectCameraHandler = A => {
              this.switchCamera(A);
            }),
            this.overlay.initialize()
          );
        })
        .then(() => {
          this.debug &&
            console.debug('SDK initialization: Overlay initialized');
          const A = this.configuration.feedback || {};
          return (this.feedback = new wA(A)), this.feedback;
        })
        .then(
          () => (
            this.debug &&
              console.debug('SDK initialization: Feedback initialized'),
            (this.visibilityChangeListener = () => {
              this.debug &&
                console.debug(
                  `BarcodeReader visibility change: ${document.visibilityState}`,
                ),
                'hidden' === document.visibilityState
                  ? this.onHidden()
                  : 'visible' === document.visibilityState && this.onVisible();
            }),
            document.addEventListener(
              'visibilitychange',
              this.visibilityChangeListener,
            ),
            (this.state = jA.Initialized),
            (ZA.currentReader = this),
            this.debug &&
              console.debug('BarcodeReader initialization complete'),
            this
          ),
        )
        .catch(I => {
          throw (
            (console.error(`BarcodeReader initialization failed: ${I}`),
            A.setError(I, Q.t('action.reload'), () => {
              document.location.reload();
            }),
            I instanceof E ? I : E.internalErrorWithCause(I))
          );
        })
    );
  }
  start() {
    return this.state === jA.NotInitialized || this.state == jA.Destroyed
      ? Promise.reject(
          E.internalErrorWithDetail(
            'BarcodeReader is not initialized or already destroyed',
          ),
        )
      : ((this.state = jA.Started), this.scheduleNextTick(), Promise.resolve());
  }
  tick(A) {
    if (this.state === jA.Stopped || this.state == jA.Destroyed)
      return void (
        this.debug &&
        console.debug(`Stopped processing frames (state: ${this.state})`)
      );
    const [I, g, B] = this.engine.getBuffer(),
      C = Math.round(A),
      i = new OA(Date.now(), C, I, g, B, this.hasSaliency);
    i.debug = this.debug;
    let o,
      e = !0;
    this.modeIsTouch &&
      (this.touchHint
        ? i.setTouchHint(this.touchHint.x, this.touchHint.y)
        : (e = !1)),
      this.videoFrameSource.isReady() || (e = !1),
      e
        ? this.locator
            .locate(i)
            .then(() => {
              if (this.state !== jA.Stopped && this.state != jA.Destroyed) {
                this.createSnapshotIfRequested(i);
                try {
                  o = this.engine.processFrame(i);
                } catch (A) {
                  return (
                    A instanceof E
                      ? (console.error(
                          `Error during frame processing: ${A.message}`,
                          A,
                        ),
                        this.errorOverlay.setError(
                          A,
                          Q.t('action.reload'),
                          () => {
                            window.location.reload();
                          },
                        ))
                      : (console.error(
                          'Unknown error occurred during frame processing: ',
                          A,
                        ),
                        this.errorOverlay.setError(
                          E.internalErrorWithDetail(JSON.stringify(A)),
                          Q.t('action.reload'),
                          () => {
                            window.location.reload();
                          },
                        )),
                    void (this.onError && this.onError(A))
                  );
                }
                i.addTimingEvent({
                  time: Date.now(),
                  event: 'engineDone',
                  cssColor: 'green',
                }),
                  this.processEngineResultAndScheduleNextTick(i, A, o);
              } else
                this.debug &&
                  console.debug(
                    `Stopped processing frames (state: ${this.state})`,
                  );
            })
            .catch(A => {
              this.errorOverlay.setError(A, Q.t('action.reload'), () => {
                window.location.reload();
              });
            })
        : this.processEngineResultAndScheduleNextTick(i, A, void 0);
  }
  processEngineResultAndScheduleNextTick(A, I, g) {
    if (g && g.codeDetections.length > 0) {
      this.feedback.feedback();
      for (const A of g.codeDetections)
        this.scanEventTracker.addScanEvent(A.typeName);
      this.detected && this.detected(g.codeDetections);
    }
    A.addTimingEvent({time: Date.now(), event: 'reportDone', cssColor: 'cyan'}),
      this.overlay.update(g),
      A.addTimingEvent({
        time: Date.now(),
        event: 'overlayDone',
        cssColor: 'yellow',
      }),
      this.debug && this.overlay.updateDebug(A),
      (this.lastFrameProcessingTime = Date.now() - I),
      this.scheduleNextTick();
  }
  stop() {
    if (this.state === jA.Stopped)
      return (
        console.warn(
          'Redundant call to stop() on BarcodeReader that is already stopped',
        ),
        Promise.resolve()
      );
    if (this.state === jA.NotInitialized || this.state == jA.Destroyed)
      return Promise.reject(
        E.internalErrorWithDetail(
          'BarcodeReader is not initialized or already destroyed',
        ),
      );
    if (0 !== this.rxfRequestId) {
      if (this.supportsRVF) {
        const A = this.videoFrameSource.get();
        A && A.cancelVideoFrameCallback(this.rxfRequestId);
      } else cancelAnimationFrame(this.rxfRequestId);
      this.rxfRequestId = 0;
    }
    return (this.state = jA.Stopped), Promise.resolve();
  }
  destroy() {
    this.state !== jA.Destroyed &&
      (this.scanEventTracker.emitBeacon(),
      void 0 !== this.visibilityChangeListener &&
        document.removeEventListener(
          'visibilitychange',
          this.visibilityChangeListener,
        ),
      (this.state = jA.Destroyed),
      this.errorOverlay.destroy(),
      this.overlay.destroy(),
      this.locator.destroy(),
      this.videoFrameSource.destroy(),
      this.engine.destroy(),
      ZA.currentReader === this && (ZA.currentReader = void 0),
      this.debug && console.debug('BarcodeReader destroyed'));
  }
  setVisible(A) {
    return this.state === jA.NotInitialized || this.state == jA.Destroyed
      ? Promise.reject(
          E.internalErrorWithDetail(
            'BarcodeReader is not initialized or already destroyed',
          ),
        )
      : ((this.hostElement.style.display = A ? 'block' : 'none'),
        Promise.resolve());
  }
  getVisible() {
    return (
      this.state !== jA.NotInitialized &&
      this.state != jA.Destroyed &&
      'none' !== this.hostElement.style.display
    );
  }
  scheduleNextTick() {
    this.supportsRVF && this.videoFrameSource.isReady()
      ? (this.rxfRequestId = this.videoFrameSource
          .get()
          .requestVideoFrameCallback(A => this.tick(A)))
      : (this.rxfRequestId = requestAnimationFrame(A => this.tick(A)));
  }
  onScanRequested(A, I) {
    (this.touchHint = {x: A, y: I}),
      this.clearTouchHintTimer &&
        (clearTimeout(this.clearTouchHintTimer),
        (this.clearTouchHintTimer = void 0)),
      (this.clearTouchHintTimer = setTimeout(() => {
        (this.touchHint = void 0), (this.clearTouchHintTimer = void 0);
      }, 500));
  }
  onVisible() {
    setTimeout(() => {
      this.restartCameraAfterBecomingVisible();
    }, 250);
  }
  restartCameraAfterBecomingVisible() {
    return this.state === jA.Started
      ? this.videoFrameSource
          .restartIfLost()
          .then(() => {
            this.debug &&
              console.debug(
                'Restarted video frame source after visibility change',
              ),
              this.errorOverlay.clearError();
          })
          .catch(A => {
            console.error(
              `Failed to restart video frame source after visibility change: ${A}`,
            ),
              this.errorOverlay.setError(A, Q.t('action.retry'), () =>
                this.restartCameraAfterBecomingVisible(),
              );
          })
      : Promise.resolve();
  }
  onHidden() {
    this.scanEventTracker.emitBeacon(),
      (this.state !== jA.Started && this.state !== jA.Initialized) ||
        (this.videoFrameSource.stop(),
        this.debug &&
          console.debug('Stopped video frame source after visibility change'));
  }
  switchCamera(A) {
    this.videoFrameSource.selectCameraDevice(A).catch(I => {
      this.errorOverlay.setError(I, Q.t('action.retry'), () => {
        this.switchCamera(A);
      });
    });
  }
  isAny1DSymbologyEnabled(A) {
    const I = A.engine?.symbologies;
    return (
      null == I ||
      0 === I.length ||
      -1 !== I.indexOf(mA.EAN13) ||
      -1 !== I.indexOf(mA.EAN8) ||
      -1 !== I.indexOf(mA.UPCA) ||
      -1 !== I.indexOf(mA.UPCE) ||
      -1 !== I.indexOf(mA.DATABAR) ||
      -1 !== I.indexOf(mA.DATABAR_EXP) ||
      -1 !== I.indexOf(mA.CODE39) ||
      -1 !== I.indexOf(mA.CODE93) ||
      -1 !== I.indexOf(mA.CODE128) ||
      -1 !== I.indexOf(mA.I25) ||
      -1 !== I.indexOf(mA.CODABAR)
    );
  }
  isAny2DSymbologyEnabled(A) {
    const I = A.engine?.symbologies;
    return (
      null == I ||
      0 === I.length ||
      -1 !== I.indexOf(mA.QR) ||
      -1 !== I.indexOf(mA.DATAMATRIX) ||
      -1 !== I.indexOf(mA.AZTEC)
    );
  }
  getAndCheckHostElement(A) {
    let I;
    if (
      ((I =
        'string' == typeof A.selector
          ? document.querySelector(A.selector)
          : A.selector),
      null === I)
    )
      throw E.configurationErrorWithDetail(
        'Host element invalid, pass a selector matching single element, or the element itself',
      );
    if ('relative' !== getComputedStyle(I).position)
      throw E.configurationErrorWithDetail(
        'Host element must use position: relative',
      );
    const g = I.getBoundingClientRect();
    if (g.width <= 0 || g.height <= 0)
      throw E.configurationErrorWithDetail(
        'Host element has zero width or height',
      );
    return I;
  }
  createSnapshotIfRequested(A) {
    if (this.snapshotRequested) {
      const I = DA(A.buffer, this.locator.getRegionOfInterest().size);
      I &&
        (localStorage.setItem(
          'strich_snapshotTickTime',
          A.startTime.toString(),
        ),
        localStorage.setItem('strich_snapshot', I)),
        (this.snapshotRequested = !1);
    }
  }
  handleFrameSourceEnded() {
    const A = new E('error.cameraLost');
    this.setErrorOnOverlayAfterCameraLoss(A);
  }
  setErrorOnOverlayAfterCameraLoss(A) {
    this.state === jA.Started &&
      this.errorOverlay.setError(A, Q.t('action.resumeScanning'), () => {
        this.errorOverlay.clearError(),
          this.restartCameraAfterBecomingVisible().catch(A => {
            this.setErrorOnOverlayAfterCameraLoss(A);
          });
      });
  }
  getDefaultRegionOfInterest() {
    return this.any1DSymbologyEnabled && !this.any2DSymbologyEnabled
      ? {left: 0.05, right: 0.05, top: 0.35, bottom: 0.35}
      : !this.any1DSymbologyEnabled && this.any2DSymbologyEnabled
      ? {left: 0.2, right: 0.2, top: 0.3, bottom: 0.3}
      : {left: 0.05, right: 0.05, top: 0.3, bottom: 0.3};
  }
}
export {
  nA as StrichSDK,
  ZA as BarcodeReader,
  E as SdkError,
  RA as defaultFrameSourceConfiguration,
};
//# sourceMappingURL=strich.js.map
