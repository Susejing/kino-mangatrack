// MangaTrack v0.4.4 — lector de mangas para Kino con pantalla propia.
// Fuentes: LeerCapitulo, LectorXd, MangaDex, InManga y MangaOni.
// Requiere Kino 0.9.74 o superior (apiVersion 14, capability "screen").
// Lector nuevo para Kino 0.9.81: páginas a ancho completo sin recortes
// (Image fit "width" + aspect de la proporción medida) y modo páginas
// (widget pages, de 2 a 250, con barra de progreso y zoom por página).
// Las dos son aditivas: un Kino más antiguo lo ignora y sigue con la
// tira vertical de siempre, sin queja ni rechazo.

const VERSION = "0.4.4";
const BASE = "https://www.leercapitulo.co";   // base de los helpers de LeerCapitulo
// Capítulos que se muestran a la vez en el detalle de una serie (una
// "ventana"): el estado de una pantalla de Kino admite 64 KB y una
// serie larga no cabe entera. Con la lista completa guardada en el
// almacén, los botones "más antiguos/recientes" van pasando de ventana
// en ventana (VENTANA_CAPS por vez), hasta 600 capítulos guardados:
// v0.4.4 — el almacén del plugin tiene tope (256 KB) y 1200 capítulos
// por serie lo llenaba sin aviso; 600 cabe holgado y el resto se
// pagina desde el sitio igual que siempre.
const VENTANA_CAPS = 300;
const TOPE_CAPS_SERIE = 600;
const MAX_CAPS = 490;              // capítulos por serie en LeerCapitulo
const MAX_CAPS_LX = 300;           // en LectorXd (URLs más largas, estado 64 KB)

// Dos fuentes, cada una con su propio scraping: la activa se guarda en
// el almacenamiento ("fuente") y las tarjetas de arriba de la portada
// la cambian.
const FUENTE_DEFECTO = "leercapitulo";
const FUENTES = [
  { id: "leercapitulo", nombre: "LeerCapitulo", base: "https://www.leercapitulo.co" },
  { id: "lectorxd", nombre: "LectorXd", base: "https://lectorxd.com" },
  { id: "mangadex", nombre: "MangaDex", base: "https://api.mangadex.org" },
  { id: "inmanga", nombre: "InManga", base: "https://inmanga.com" },
  { id: "mangaoni", nombre: "MangaOni", base: "https://manga-oni.com" },
];

function fuentePorId(id) {
  for (let i = 0; i < FUENTES.length; i++) if (FUENTES[i].id === id) return FUENTES[i];
  return FUENTES[0];
}

function fuenteActiva() {
  const id = getJson("fuente", "") || FUENTE_DEFECTO;
  return fuentePorId(String(id));
}

// La fuente de una serie por la forma de su URL: los favoritos y el
// historial guardan URLs de las dos fuentes y el detalle sabe a cuál
// pedirle la página. LeerCapitulo usa /manga/<id>/<slug>/ (dos pedazos
// tras /manga/) y LectorXd /<tipo>/<slug>/ (uno solo): no chocan.
function fuenteDeUrl(url) {
  const u = String(url || "");
  if (/^[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/]?$/.test(u)) return fuentePorId("leercapitulo");
  if (/^[/](?:manga|manhwa|manhua|one[-_]shot|novela)[/][a-z0-9-]+[/]?$/.test(u)) return fuentePorId("lectorxd");
  // MangaDex guarda sus series como /title/<uuid> (API oficial, sin slugs).
  if (/^[/]title[/][0-9a-f]{8}-[0-9a-f]{4}-/i.test(u)) return fuentePorId("mangadex");
  // InManga: /ver/manga/<slug>/<uuid de la serie>.
  if (/^[/]ver[/]manga[/][a-z0-9-]+[/][0-9a-f]{8}-[0-9a-f]{4}-/i.test(u)) return fuentePorId("inmanga");
  // MangaOni: sus URL llevan el prefijo /oni para no chocar con las de
  // LectorXd, que también usa /manga/<slug>/.
  if (/^[/]oni[/]/.test(u)) return fuentePorId("mangaoni");
  return null;
}

// ------------------------------------------------------------------ red

async function getHtmlDe(f, path) {
  // Cloudflare (LectorXd y MangaOni) rechaza peticiones sin User-Agent:
  // se envían cabeceras de navegador para que no las confunda con bots
  // (receta verificada en la app de escritorio KageView, que lee ambos).
  const hdrs = f.id === "lectorxd"
    ? {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-419,es;q=0.9",
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        Referer: f.base + "/",
      }
    : f.id === "mangaoni"
    ? {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-419,es;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: f.base + "/",
      }
    : { Accept: "text/html" };
  // MangaOni guarda sus series con el prefijo /oni: al pedir se quita.
  const ruta = f.id === "mangaoni" ? moPath(path) : path;
  let r;
  try {
    r = await kino.fetch(f.base + ruta, { headers: hdrs });
  } catch (e) {
    // La petición ni siquiera recibió respuesta (conexión rechazada,
    // TLS cortado por el filtro anti-bots): queda en el log con su
    // causa y la persona recibe un mensaje honesto.
    log(f.id + " conexión fallida en " + path + ": " + ((e && e.message) || e));
    throw kino.error("network", "conexión: " + ((e && e.message) || e), {
      userMessage: "No se pudo conectar con " + f.nombre + ". Si tu internet va bien, el sitio bloqueó la conexión.",
    });
  }
  if (!r.ok) {
    // El estado se anota en el log: con él se distingue un bloqueo +18
    // (403/451) de una caída real de la red.
    log(f.id + " HTTP " + r.status + " en " + path);
    throw kino.error("network", "HTTP " + r.status, {
      userMessage: f.id === "lectorxd" && (r.status === 403 || r.status === 451)
        ? "LectorXd bloqueó la página (HTTP " + r.status + "). Si es una serie +18, la cierra sin cuenta; si no, es su filtro anti-bots. Prueba otra serie."
        : f.id === "mangaoni" && r.status === 403
        ? "MangaOni bloqueó la página (HTTP 403): es su protección anti-bots. Vuelve a intentarlo o prueba otra serie."
        : "No se pudo conectar con " + f.nombre + " (HTTP " + r.status + "). Inténtalo de nuevo.",
    });
  }
  return await r.text();
}

async function getHtml(path) {
  return getHtmlDe(fuenteActiva(), path);
}

function log(msg) {
  try { kino.log("[MangaTrack] " + msg); } catch (e) {}
}

function clean(s) {
  return String(s)
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&hellip;/g, "…").replace(/&nbsp;/g, " ").replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ").trim();
}

function absoluta(u) {
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("/") === 0) return BASE + u;
  return u;
}

// -------------------------------------------------------------- scraping

// Tarjetas de series: cada enlace /manga/<id>/<slug>/ con una imagen cerca.
// El título sale del alt o title de la imagen o del texto del enlace.
function homeCards(html, max) {
  const out = [];
  const seen = {};
  // Títulos de respaldo: en el catálogo las portadas no traen alt y el
  // texto del enlace es la insignia del tipo ("Manga"); el título de
  // verdad vive en OTRO enlace de texto puro a la misma serie.
  const titulos = {};
  const reT = /<a[^>]+href="([^"]*[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/])"[^>]*>([^<]{2,90})<[/]a>/gi;
  let mt;
  while ((mt = reT.exec(html)) !== null) {
    const u = mt[1].replace(/^https?:[/][/](?:www[.])?leercapitulo[.]co/i, "");
    const t = clean(mt[2]);
    if (t && !/^(manga|manhwa|manhua)$/i.test(t) && !titulos[u]) titulos[u] = t;
  }
  const reA = /<a[^>]+href="([^"]*[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/])"[^>]*>([\s\S]{0,600}?)<[/]a>/gi;
  let m;
  while ((m = reA.exec(html)) !== null) {
    const url = m[1].replace(/^https?:[/][/](?:www[.])?leercapitulo[.]co/i, "");
    if (seen[url]) continue;
    const inner = m[2];
    let poster = "";
    let title = "";
    const im = inner.match(/<img\b[^>]*>/i);
    if (im) {
      const tag = im[0];
      const p = tag.match(/\b(?:data-src|data-lazy-src|src)="([^"]+)"/i);
      if (p) poster = absoluta(p[1]);
      const a = tag.match(/\balt="([^"]*)"/i) || tag.match(/\btitle="([^"]*)"/i);
      // El alt de las portadas dice "Portada de <título>": se quita el
      // prefijo para que la tarjeta muestre solo el título de la serie.
      if (a) title = clean(a[1]).replace(/^portada de\s+/i, "");
    }
    if (!title) {
      const texto = clean(inner.replace(/<[^>]*>/g, " "));
      if (texto && texto.length <= 90) title = texto;
    }
    if (!title) title = url.split("/").filter(Boolean).pop() || url;
    const slug = url.split("/").filter(Boolean).pop() || url;
    if ((title === slug || /^(manga|manhwa|manhua)$/i.test(title)) && titulos[url]) title = titulos[url];
    if (poster && !/logo|banner|icon|avatar|placeholder|ads?[-_/]/i.test(poster)) {
      seen[url] = 1;
      out.push({ url: url, title: title, poster: poster });
    }
    if (out.length >= max) break;
  }
  if (!out.length) {
    const reB = /<img\b[^>]*\b(?:data-src|data-lazy-src|src)="([^"]+)"[^>]*>[\s\S]{0,300}?href="([^"]*[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/])"/gi;
    let mb;
    while ((mb = reB.exec(html)) !== null) {
      const url = mb[2].replace(/^https?:[/][/](?:www[.])?leercapitulo[.]co/i, "");
      if (seen[url]) continue;
      seen[url] = 1;
      out.push({ url: url, title: url.split("/").filter(Boolean).pop() || url, poster: absoluta(mb[1]) });
      if (out.length >= max) break;
    }
  }
  log("portada: " + out.length + " series");
  return out;
}

// Tarjetas de LectorXd: enlaces a /<tipo>/<slug> con una imagen y el
// título en un h3/h4/h5 o en el alt de la imagen. Las novelas se excluyen.
// La tarjeta ya no tiene que vivir entera dentro del <a>: en el HTML real
// los títulos larguísimos y las etiquetas anidadas rompían el patrón
// corto, así que tras cada <a> se busca la primera imagen y el primer
// título hasta el siguiente enlace.
function cardsLX(html, max) {
  const out = [];
  const seen = {};
  let consumido = 0;
  const re = /<a\b[^>]*\bhref="([^"]*[/](?:manga|manhwa|manhua|one[-_]shot)[/][a-z0-9-]+[/]?)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let url = m[1];
    if (/[/]novela[/]/i.test(url)) continue;
    url = url.replace(/^https?:[/][/](?:www[.])?lectorxd[.]com/i, "");
    if (!/^[/]/.test(url)) continue;
    if (seen[url]) continue;
    const start = m.index + m[0].length;
    let inner = html.slice(start, start + 2000);
    const corte = inner.search(/<a\b/i);
    if (corte > 0) inner = inner.slice(0, corte);
    let im = inner.match(/<img\b[^>]*>/i);
    let poster = "";
    if (!im && m.index > consumido) {
      // Portada que vive ANTES del enlace: solo si no pertenece a la
      // tarjeta anterior.
      const antes = html.slice(consumido, m.index);
      const im2 = antes.match(/<img\b[^>]*>/i);
      if (im2) im = im2;
    }
    if (im) {
      const p = im[0].match(/\bdata-src="([^"]+)"/i) || im[0].match(/\bdata-lazy-src="([^"]+)"/i) || im[0].match(/\bsrc="([^"]+)"/i);
      if (p) poster = absLX(p[1]);
    }
    if (!poster || poster.indexOf("data:") === 0) continue;
    let title = "";
    const h = inner.match(/<h[345][^>]*>([\s\S]{2,200}?)<\/h[345]>/i);
    if (h) title = clean(h[1].replace(/<[^>]*>/g, " "));
    if (!title && im) {
      const a = im[0].match(/\balt="([^"]*)"/i);
      if (a && a[1]) title = clean(a[1]);
    }
    if (!title) title = url.split("/").filter(Boolean).pop() || url;
    seen[url] = 1;
    consumido = start + inner.length;
    out.push({ url: url, title: title, poster: poster });
    if (out.length >= max) break;
  }
  log("LX tarjetas: " + out.length);
  return out;
}
function absLX(u) {
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("/") === 0) return "https://lectorxd.com" + u;
  return u;
}

function cardsDe(f, html, max) {
  return f.id === "lectorxd" ? cardsLX(html, max) : homeCards(html, max);
}

// Metadatos de la página de una serie (etiquetas og: de WordPress)
// Portada de la serie: en las páginas de LeerCapitulo la portada es una
// imagen /covers/… (con ruta RELATIVA y a veces con ?v= de caché tras la
// extensión) cuyo alt dice "Portada de <título de la serie>", y vive junto
// al título. Antes del título vienen las portadas de la barra lateral
// ("Populares"), cada una con el alt de SU serie. Orden de búsqueda:
// og:image; la imagen cuyo alt calza con el título; la última portada
// antes del <h1>; la primera después; la primera de la página.
function posterDe(html, titulo) {
  const norm = (s) => clean(s).toLowerCase()
    .replace(/[áàäâã]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o").replace(/[úùüû]/g, "u")
    .replace(/[^a-z0-9]+/g, " ").trim();
  const og = (html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || [])[1] ||
    (html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i) || [])[1];
  if (og) return absoluta(og);
  const urlDe = (tag) => {
    const attrs = tag.match(/[a-z-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi) || [];
    for (const a of attrs) {
      const v = a.slice(a.indexOf("=") + 1).replace(/^["']|["']$/g, "");
      const u = v.match(/(?:https?:)?(?:\/\/)?[^"'\s]*[/](?:covers|wp-content[/]uploads)[/][^\s"']*[.](?:jpe?g|png|webp)/i);
      if (u) return u[0];
    }
    return "";
  };
  const h1 = html.search(/<h1[^>]*>/i);
  const t = titulo ? norm(titulo).slice(0, 18) : "";
  let porAlt = "", ultimoAntes = "", primeroDespues = "", primeroTodo = "";
  let m;
  const reImg = /<img\b[^>]*>/gi;
  while ((m = reImg.exec(html)) !== null) {
    const url = urlDe(m[0]);
    if (!url) continue;
    if (!primeroTodo) primeroTodo = url;
    if (h1 >= 0 && m.index < h1 && h1 - m.index <= 3000) ultimoAntes = url;
    else if (h1 >= 0 && m.index >= h1 && m.index - h1 <= 8000 && !primeroDespues) primeroDespues = url;
    if (!porAlt && t) {
      const alt = (m[0].match(/\balt\s*=\s*(["'])(.*?)\1/i) || [])[2] || "";
      if (norm(alt.replace(/portada de/i, "")).slice(0, 18) === t) porAlt = url;
    }
  }
  return absoluta(porAlt || ultimoAntes || primeroDespues || primeroTodo || "");
}

function seriesMeta(html) {
  const pick = (re) => { const m = html.match(re); return m ? clean(m[1]) : ""; };
  const titulo = pick(/<h1[^>]*>([\s\S]{1,200}?)<[/]h1>/) ||
    pick(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    pick(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const poster = posterDe(html, titulo);
  // Descripción: la sinopsis de verdad vive en su propia sección; las
  // metas de la página son solo el respaldo. La sinopsis de algunas series
  // arrastra al final enlaces oficiales de traducción ("--- - [Official
  // … Translation](url)"): se corta ahí y se limpian enlaces y URLs.
  const sm = html.match(/<h[1-6][^>]*>\s*(?:Sinopsis|Synopsis|Descripci[oó]n|Resumen)[^<]{0,40}<[/]h[1-6]>([\s\S]{10,4000}?)<h[1-6]/i);
  const sinopsis = sm ? clean(sm[1]
    .replace(/<[^>]*>/g, " ")
    .split(/\s*[-—–]{3,}\s*/)[0]
    .replace(/\[([^\]]*)\]\([^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")).slice(0, 600) : "";
  const overview = sinopsis ||
    pick(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    pick(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ||
    pick(/name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return { title: titulo, poster: poster, overview: overview };
}

// ------------------------------------------------ favoritos (kino.storage)
// La lista vive en el aparato y, con la capacidad "shared" del manifiesto,
// viaja entre los aparatos vinculados: los favoritos marcados en el
// teléfono se ven también en la TV. Los valores que llegan de shared NO
// son de confianza (los escribió otro aparato): se valida cada campo.

function getJson(key, fallback) {
  try {
    const v = (typeof kino.storage === "object" && kino.storage) ? kino.storage.get(key) : null;
    return v ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}
function setJson(key, val) {
  try { kino.storage.set(key, JSON.stringify(val)); return true; } catch (e) { log("storage: " + e); return false; }
}

// ---------------------------------------------------------------- v0.4.4
// Guardián del almacén. El almacén del plugin tiene un tope (256 KB) y
// las cachés grandes (capítulos completos "caps:", catálogo "cat",
// resultados de AniList "al") lo llenaban SIN aviso: el catálogo dejaba
// de avanzar páginas y la sección de AniList quedaba "cargando" para
// siempre. Ahora las cachés desechables se escriben con setJsonCache:
// si el almacén se llena, se BORRAN las cachés más viejas (siempre se
// pueden volver a pedir al sitio) y se reintenta una vez. Los datos
// personales —favoritos, historial, vínculos de AniList— no se tocan.
const CACHE_TOPE = 160000;   // presupuesto estimado de cachés, en bytes

function setJsonTxt(clave, txt) {
  try { kino.storage.set(clave, txt); return true; } catch (e) { log("storage: " + e); return false; }
}

function cacheIdx() { return getJson("cacheIdx", {}); }

function regCache(clave, bytes) {
  const idx = cacheIdx();
  idx[clave] = { t: Date.now(), b: bytes };
  setJsonTxt("cacheIdx", JSON.stringify(idx));
}

function setJsonCache(clave, val) {
  let txt = "";
  try { txt = JSON.stringify(val); } catch (e) { return false; }
  if (setJsonTxt(clave, txt)) { regCache(clave, txt.length); return true; }
  // Lleno: liberar las cachés más viejas (nunca la clave que se
  // escribe) — al menos una, aunque el presupuesto no se pase, porque
  // el almacén puede estar lleno por otras cosas — y reintentar una
  // vez. Si aun así no cabe, se devuelve false para que el llamador
  // avise en lugar de fingir que guardó.
  const idx = cacheIdx();
  const entradas = Object.keys(idx)
    .filter(function (k) { return k !== clave; })
    .map(function (k) { return { k: k, t: (idx[k] && idx[k].t) || 0, b: (idx[k] && idx[k].b) || 0 }; })
    .sort(function (a, b) { return a.t - b.t; });
  let total = txt.length;
  for (let i = 0; i < entradas.length; i++) total += entradas[i].b;
  let liberadas = 0;
  for (let i = 0; i < entradas.length; i++) {
    if (liberadas >= 1 && total <= CACHE_TOPE) break;
    if (setJsonTxt(entradas[i].k, "")) { total -= entradas[i].b; delete idx[entradas[i].k]; liberadas++; }
  }
  setJsonTxt("cacheIdx", JSON.stringify(idx));
  if (setJsonTxt(clave, txt)) { regCache(clave, txt.length); return true; }
  return false;
}

// v0.4.4 — limpieza única (flag "limpia044"): las series viejas del
// historial (más de 20 puestos atrás y que no sean favoritas) sueltan
// su caché de capítulos. Es lo que despeja el almacén lleno heredado
// de las versiones anteriores. Corre sola una vez, al abrir el plugin.
function limpiaAlmacen() {
  if (getJson("limpia044", 0)) return;
  const h = hist();
  const urls = Object.keys(h).sort(function (a, b) { return (h[b].ts || 0) - (h[a].ts || 0); });
  const favUrls = favs().map(function (x) { return x.url; });
  let n = 0;
  for (let i = 20; i < urls.length; i++) {
    if (favUrls.indexOf(urls[i]) >= 0) continue;
    if (setJsonTxt("caps:" + urls[i], "")) n++;
  }
  setJson("limpia044", 1);
  if (n) log("limpieza 0.4.4: " + n + " cachés de series viejas liberadas");
}

// v0.4.4 — la página donde quedó cada capítulo ya no es una clave por
// capítulo (se acumulaban sin remedio): es UN mapa con tope de 120, de
// lo más viejo afuera. Las claves viejas se siguen leyendo por si
// acaso, pero ya no se escriben.
function pgLeer(chUrl) {
  const m = getJson("pgAtMap", {});
  if (m && typeof m === "object" && (chUrl in m)) {
    const v = parseInt(m[chUrl], 10);
    if (isFinite(v) && v >= 0) return v;
  }
  const v = parseInt(getJson("pgAt:" + chUrl, 0), 10);
  return isFinite(v) && v >= 0 ? v : 0;
}

function pgGuardar(chUrl, pg) {
  if (!chUrl || !(pg >= 0)) return;
  const m = getJson("pgAtMap", {});
  if (!m || typeof m !== "object") return;
  delete m[chUrl];
  m[chUrl] = pg;
  const ks = Object.keys(m);
  while (ks.length > 120) delete m[ks.shift()];
  setJson("pgAtMap", m);
}
function favs() { return getJson("favs", []); }
function isFav(url) { return favs().some((f) => f.url === url); }

function favValido(f) {
  return !!f && typeof f === "object" && typeof f.url === "string" &&
    fuenteDeUrl(f.url) !== null;
}

function syncPushFavs() {
  try { if (typeof kino.shared === "object" && kino.shared) kino.shared.set("favs", favs()); }
  catch (e) { log("sync: " + e); }
}
function syncPullFavs() {
  let sf = null;
  try { if (typeof kino.shared === "object" && kino.shared) sf = kino.shared.get("favs"); }
  catch (e) { log("sync: " + e); }
  if (!Array.isArray(sf)) return;
  const local = favs();
  const have = new Set(local.map((f) => f.url));
  let changed = false;
  for (const f of sf.slice(0, 200)) {
    if (!favValido(f) || have.has(f.url)) continue;
    local.push({ url: f.url, title: String(f.title || "").slice(0, 200),
      poster: typeof f.poster === "string" ? f.poster.slice(0, 500) : "" });
    have.add(f.url);
    changed = true;
  }
  if (local.length > 100) local.length = 100;
  if (changed) { setJson("favs", local); syncPushFavs(); }
}

// Historial de lectura: el último capítulo abierto de cada serie,
// guardado en el aparato y sincronizado entre los vinculados (como
// los favoritos). Con él la portada muestra "Seguir leyendo", el
// detalle marca con ✓ los capítulos leídos y el botón "Continuar"
// vuelve al capítulo donde quedó la persona.
function hist() { return getJson("hist", {}); }

function histValido(v) {
  if (!v || typeof v !== "object" || typeof v.url !== "string") return false;
  if (/^[/]leer[/][a-z0-9]{4,}[/][a-z0-9-]+[/][0-9]+(?:[.][0-9]+)?[/]$/i.test(v.url)) return true;
  if (/^[/](?:manga|manhwa|manhua|one[-_]shot)[/][a-z0-9-]+[/]leer[/][^"?]+(?:[?]g=[-a-z0-9]+)?$/i.test(v.url)) return true;
  // MangaDex: los capítulos son /chapter/<uuid>.
  if (/^[/]chapter[/][0-9a-f]{8}-[0-9a-f]{4}-/i.test(v.url)) return true;
  // InManga: /ver/manga/<slug>/<num>/<uuid del capítulo>.
  if (/^[/]ver[/]manga[/][a-z0-9-]+[/][^/?]+[/][0-9a-f]{8}-[0-9a-f]{4}-/i.test(v.url)) return true;
  // ManhwaWeb: /leer/<slug>-<num>_01.
  return /^[/]leer[/][a-z0-9-]+_[0-9]+-[0-9]+(?:[_][0-9]+)?$/i.test(v.url);
}

function syncPushHist() {
  try { if (typeof kino.shared === "object" && kino.shared) kino.shared.set("hist", hist()); }
  catch (e) { log("sync hist: " + e); }
}
function syncPullHist() {
  let sh = null;
  try { if (typeof kino.shared === "object" && kino.shared) sh = kino.shared.get("hist"); }
  catch (e) { log("sync hist: " + e); }
  if (!sh || typeof sh !== "object") return;
  const local = hist();
  let changed = false;
  const sk = Object.keys(sh).slice(0, 200);
  for (let i = 0; i < sk.length; i++) {
    const k = sk[i];
    if (!fuenteDeUrl(k)) continue;
    const v = sh[k];
    if (!histValido(v) || typeof v.idx !== "number" || !(v.idx >= 0)) continue;
    const l = local[k];
    if (l && (l.ts || 0) >= (v.ts || 0)) continue;
    local[k] = { url: v.url, num: String(v.num || "").slice(0, 12), idx: v.idx, ts: v.ts || 0,
      title: String(v.title || "").slice(0, 200),
      poster: typeof v.poster === "string" ? v.poster.slice(0, 500) : "" };
    changed = true;
  }
  const lk = Object.keys(local);
  if (lk.length > 100) { lk.sort((a, b) => (local[b].ts || 0) - (local[a].ts || 0));
    for (let i = 100; i < lk.length; i++) delete local[lk[i]]; }
  if (changed) { setJson("hist", local); syncPushHist(); }
}

// Capítulos de una serie: enlaces /leer/<id>/<slug>/<número>/
function chapterList(html) {
  const map = new Map();
  const re = /href="([^"]*[/]leer[/][a-z0-9]{4,}[/][a-z0-9-]+[/]([0-9]+(?:[.][0-9]+)?)[/])"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!map.has(m[2])) map.set(m[2], { url: m[1], num: m[2] });
  }
  const arr = [...map.values()];
  arr.sort((a, b) => parseFloat(b.num) - parseFloat(a.num));
  if (arr.length) log("capítulos: " + arr.length + " (ej. " + arr[0].url + ")");
  return arr;
}

// Imágenes de un capítulo: varios métodos con registro de cada intento.
function readerImages(html) {
  let imgs = [];
  const mj = html.match(/ts_reader[.]run[(]([\s\S]*?)[)];/);
  if (mj) {
    try {
      const j = JSON.parse(mj[1]);
      const src = j.sources && j.sources[0] && j.sources[0].images;
      if (Array.isArray(src)) {
        imgs = src.filter((x) => typeof x === "string" && x);
        log("lector: ts_reader dio " + imgs.length + " páginas");
      }
    } catch (e) { log("lector: ts_reader JSON roto"); }
  }
  if (!imgs.length) {
    const rc = html.match(/class="[^"]*(?:reading-content|read-container|entry-content|chap-content)[^"]*"/i);
    imgs = imgsDe(rc ? rc[0] : html);
    log("lector: etiquetas img (" + (rc ? "zona de lectura" : "página completa") + ") dieron " + imgs.length + " páginas");
  }
  return imgs;
}

function imgsDe(zona) {
  const out = [];
  const seen = {};
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(zona)) !== null) {
    const tag = m[0];
    const p = tag.match(/\bdata-src="([^"]+)"/i) || tag.match(/\bdata-lazy-src="([^"]+)"/i) || tag.match(/\bsrc="([^"]+)"/i);
    if (!p) continue;
    const src = absoluta(p[1]);
    if (!src || src.indexOf("data:") === 0) continue;
    if (!/[.](jpe?g|png|webp|gif)([?]|#|$)/i.test(src)) continue;
    if (/logo|banner|icon|avatar|placeholder|ads?[-_/]|loader|spinner/i.test(src)) continue;
    if (seen[src]) continue;
    seen[src] = 1;
    const w = parseInt((tag.match(/\bwidth="(\d+)"/) || [])[1] || "0", 10);
    const h = parseInt((tag.match(/\bheight="(\d+)"/) || [])[1] || "0", 10);
    out.push(w > 0 && h > 0 ? { url: src, w: w, h: h } : { url: src });
  }
  return out;
}

// ------------------------------------------------ LectorXd (2ª fuente)
// Metadatos de una serie de LectorXd: título h1, portada (img con
// /manga/covers/ en su src) y sinopsis (p.leading-relaxed).
function metaLX(html) {
  const titulo = (html.match(/<h1[^>]*>([\s\S]{2,200}?)<[/]h1>/i) || [])[1];
  let cov = "";
  const mC = html.match(/<img\b[^>]*\bsrc="([^"]*[/]manga[/]covers[/][^"]+)"/i) ||
    html.match(/<img\b[^>]*\bdata-src="([^"]*[/]manga[/]covers[/][^"]+)"/i);
  if (mC) cov = mC[1];
  if (!cov) cov = (html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || [])[1] || "";
  const sin = (html.match(/<p[^>]*class="[^"]*leading-relaxed[^"]*"[^>]*>([\s\S]{10,4000}?)<[/]p>/i) || [])[1];
  const ogd = (html.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) || [])[1] || "";
  return {
    title: titulo ? clean(titulo.replace(/<[^>]*>/g, " ")) : "",
    poster: cov ? absLX(cov) : "",
    overview: sin ? clean(sin.replace(/<[^>]*>/g, " ")).slice(0, 600) : clean(ogd).slice(0, 600),
  };
}

// Capítulos de LectorXd: la lista no son enlaces sino un JSON dentro del
// atributo props de un astro-island (el formato de Astro guarda cada
// valor como un par [tipo, valor]: se desenvuelve recursivamente y queda
// { mangaType, mangaSlug, chapters: [{ chapter, groupId }] }). La URL de
// cada capítulo es /<mangaType>/<mangaSlug>/leer/<chapter>?g=<groupId>.
function capsLX(html) {
  const tag = html.match(/<astro-island[^>]*component-url="[^"]*ChapterList[^"]*"[^>]*>/i);
  if (!tag) return [];
  const pm = tag[0].match(/\bprops="([^"]*)"/i);
  if (!pm) return [];
  let data = null;
  try {
    data = JSON.parse(pm[1].replace(/&quot;/g, String.fromCharCode(34)).replace(/&amp;/g, "&").replace(/&#39;/g, "'"));
  } catch (e) { log("LX: props JSON roto"); return []; }
  const unwrap = (v) => {
    if (Array.isArray(v)) {
      if (v.length === 2 && (typeof v[0] === "string" || typeof v[0] === "number" || typeof v[0] === "boolean")) return unwrap(v[1]);
      return v.map(unwrap);
    }
    if (v && typeof v === "object") { const o = {}; for (const k in v) o[k] = unwrap(v[k]); return o; }
    return v;
  };
  data = unwrap(data);
  const tipo = String(data.mangaType || "");
  const slug = String(data.mangaSlug || "");
  const caps = Array.isArray(data.chapters) ? data.chapters : [];
  const map = new Map();
  for (let i = 0; i < caps.length; i++) {
    const c = caps[i];
    if (!c || typeof c !== "object") continue;
    const num = String(c.chapter || "").trim();
    if (!num || !tipo || !slug) continue;
    let url = "/" + tipo + "/" + slug + "/leer/" + num;
    if (c.groupId !== null && c.groupId !== undefined && c.groupId !== "") url += "?g=" + c.groupId;
    if (!map.has(num)) map.set(num, { url: url, num: num });
  }
  const arr = [...map.values()];
  arr.sort((a, b) => parseFloat(b.num) - parseFloat(a.num));
  log("LX capítulos: " + arr.length + " (ej. " + (arr[0] ? arr[0].url : "-") + ")");
  return arr;
}

// Imágenes de un capítulo de LectorXd: img.page-image, la dirección en
// data-src / data-lazy-src / src (mismo orden que su extensión de Mihon).
function imgsLX(html) {
  const out = [];
  const seen = {};
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    if (!/class="[^"]*page-image/i.test(tag)) continue;
    const p = tag.match(/\bdata-src="([^"]+)"/i) || tag.match(/\bdata-lazy-src="([^"]+)"/i) || tag.match(/\bsrc="([^"]+)"/i);
    if (!p) continue;
    const u = absLX(p[1]);
    if (!u || u.indexOf("data:") === 0) continue;
    if (seen[u]) continue;
    seen[u] = 1;
    out.push(u);
  }
  log("LX lector: " + out.length + " páginas");
  return out;
}

function readerImagesDe(f, html) {
  if (f.id === "lectorxd") return imgsLX(html);
  if (f.id === "mangaoni") return moImages(html);
  return readerImages(html);
}

// ------------------------------------------------ MangaDex (3ª fuente)
// MangaDex no se scrapea: tiene una API oficial pública que devuelve
// JSON. Las series se guardan como /title/<uuid> y los capítulos como
// /chapter/<uuid>; las páginas de un capítulo salen del servidor
// at-home (baseUrl + /data/<hash>/<archivo>, baseUrl fijo:
// uploads.mangadex.org) y se piden al ABRIR el capítulo porque las
// URLs caducan al poco rato.

const MD_API = "https://api.mangadex.org";
const MD_CDN = "https://uploads.mangadex.org";
const MAX_CAPS_MD = 300;

async function mdJson(path) {
  const r = await kino.fetch(MD_API + path, { headers: { Accept: "application/json" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con MangaDex. Inténtalo de nuevo.",
  });
  try { return await r.json(); } catch (e) { return JSON.parse((await r.text()).replace(/[\u0000-\u001F]/g, " ")); }
}

function mdTitulo(m) {
  const a = (m && m.attributes) || {};
  const t = a.title || {};
  if (t.es) return String(t.es);
  const alt = a.altTitles || [];
  for (let i = 0; i < alt.length; i++) if (alt[i] && alt[i].es) return String(alt[i].es);
  if (t.en) return String(t.en);
  for (const k in t) return String(t[k]);
  return "Sin título";
}

function mdPortada(m) {
  const rel = (m && m.relationships) || [];
  for (let i = 0; i < rel.length; i++) {
    const r = rel[i];
    if (r && r.type === "cover_art" && r.attributes && r.attributes.fileName) {
      return MD_CDN + "/covers/" + m.id + "/" + r.attributes.fileName + ".256.jpg";
    }
  }
  return "";
}

function mdCards(j, max) {
  const out = [];
  const arr = (j && j.data) || [];
  for (let i = 0; i < arr.length && out.length < max; i++) {
    const m = arr[i];
    if (!m || !m.id) continue;
    out.push({ url: "/title/" + m.id, title: mdTitulo(m), poster: mdPortada(m) });
  }
  log("MD tarjetas: " + out.length);
  return out;
}

function mdQuery(extra, offset, limit) {
  let p = "?includes[]=cover_art&contentRating[]=safe&availableTranslatedLanguage[]=es&limit=" + limit;
  if (offset) p += "&offset=" + offset;
  if (extra) p += "&" + extra;
  return "/manga" + p;
}

async function mdSearch(q) {
  const j = await mdJson(mdQuery("title=" + encodeURIComponent(q) + "&order[relevance]=desc", 0, 30));
  return mdCards(j, 30);
}

async function mdMeta(id) {
  const j = await mdJson("/manga/" + id + "?includes[]=cover_art");
  const m = (j && j.data) || null;
  if (!m) throw kino.error("network", "manga vacío", {
    userMessage: "No se encontró la serie en MangaDex.",
  });
  const d = (m.attributes && m.attributes.description) || {};
  let ov = String(d.es || d.en || "");
  ov = clean(ov.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_]+/g, " ").slice(0, 600));
  // MangaDex publica los ids de AniList y MAL de cada serie en sus
  // "links": con ellos el registro en las listas es EXACTO, sin
  // búsqueda por título (lo usa la puerta de AniTrack).
  const L = ((m.attributes && m.attributes.links) || {});
  const idDe = (v) => {
    const s = String(v || "").trim();
    const mm = s.match(/(\d+)\D*$/);
    return mm && parseInt(mm[1], 10) > 0 ? parseInt(mm[1], 10) : 0;
  };
  return { title: mdTitulo(m), poster: mdPortada(m), overview: ov,
    anilistId: idDe(L.al), malId: idDe(L.mal) };
}

async function mdCaps(id) {
  const all = [];
  const vistos = {};
  let offset = 0;
  while (offset < 1500) {
    const j = await mdJson("/manga/" + id + "/feed?translatedLanguage[]=es&contentRating[]=safe&order[chapter]=desc&limit=500&offset=" + offset + "&includeExternalUrl=0&includeEmptyPages=0");
    const arr = (j && j.data) || [];
    for (let i = 0; i < arr.length; i++) {
      const c = arr[i];
      const at = (c && c.attributes) || {};
      if (at.externalUrl) continue;
      if (at.chapter === null || at.chapter === undefined || at.chapter === "") continue;
      const num = String(at.chapter);
      if (vistos[num]) continue;
      vistos[num] = 1;
      all.push({ url: "/chapter/" + c.id, num: num });
    }
    offset += 500;
    if (arr.length < 500) break;
  }
  all.sort(function (a, b) { return parseFloat(b.num) - parseFloat(a.num); });
  log("MD capítulos: " + all.length);
  return all;
}

async function mdImages(chUrl) {
  const id = String(chUrl).replace(/^[/]chapter[/]/, "").split("?")[0];
  const j = await mdJson("/at-home/server/" + id);
  const ch = (j && j.chapter) || {};
  const base = String(j.baseUrl || MD_CDN);
  const hash = ch.hash || "";
  const files = ch.data || [];
  const out = [];
  for (let i = 0; i < files.length; i++) out.push(base + "/data/" + hash + "/" + files[i]);
  log("MD lector: " + out.length + " páginas (host " + base.replace(/^https?:[/][/]/, "") + ")");
  return out;
}

async function mdCatalog(cat, page1) {
  // Filtros de MangaDex por parámetros de su API: género (tag uuid),
  // estado y idioma original; el orden ya existía.
  let q = "order[" + (cat.order || "followedCount") + "]=desc";
  if (cat.genre) q += "&includedTags[]=" + encodeURIComponent(cat.genre) + "&includedTagsMode=AND";
  if (cat.status) q += "&status[]=" + encodeURIComponent(cat.status);
  if (cat.type) q += "&originalLanguage[]=" + encodeURIComponent(cat.type);
  const j = await mdJson(mdQuery(q, (page1 - 1) * CAT_POR_PAG, CAT_POR_PAG));
  const total = (j && j.total) || 0;
  return {
    items: mdCards(j, CAT_POR_PAG),
    totalTxt: total ? String(total).replace(/(\d)(?=(\d{3})+$)/g, "$1.") + " series" : "",
    mas: page1 * CAT_POR_PAG < total,
  };
}

// ------------------------------------------------ InManga (4ª fuente)
// InManga es un sitio clásico de mangas en español: el listado se pide
// por POST (un formulario), la página de una serie viene completa en
// HTML y las páginas de un capítulo se construyen con los IDs que
// trae el lector (igual que su extensión de Mihon).

const IM_BASE = "https://inmanga.com";
const IM_CDN = "https://cdn1.intomanga.com";
const MAX_CAPS_IM = 300;

async function imPostForm(path, q, sortby, skip, take) {
  const r = await kino.fetch(IM_BASE + path, {
    method: "POST",
    headers: { Accept: "text/html" },
    body: { form: {
      "filter[generes][]": "-1",
      "filter[queryString]": q || "",
      "filter[skip]": String(skip || 0),
      "filter[take]": String(take || 10),
      "filter[sortby]": String(sortby || 1),
      "filter[broadcastStatus]": "0",
      "filter[onlyFavorites]": "false",
      "d": "",
    } },
  });
  if (!r.ok) {
    // El POST es lo que más puede fallar en InManga (su catálogo y su
    // búsqueda solo responden a POST): el estado queda en el log.
    log("IM POST " + path + " → HTTP " + r.status);
    throw kino.error("network", "HTTP " + r.status, {
      userMessage: "No se pudo conectar con InManga (HTTP " + r.status + "). Inténtalo de nuevo.",
    });
  }
  const t = await r.text();
  log("IM POST " + path + " ok: " + t.length + " chars");
  return t;
}

function imCards(html, max) {
  const out = [];
  const seen = {};
  // Enlaces a la página de una serie (/ver/manga/<slug>/<guid>). La
  // tarjeta no tiene que vivir entera dentro del <a>: se busca la
  // primera imagen y el primer título hasta el siguiente enlace.
  const re = /<a\b[^>]*\bhref="([^"]*[/]ver[/]manga[/][a-z0-9-]+[/][0-9a-f-]{36}[/]?)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null && out.length < max) {
    let url = m[1];
    if (/^https?:/i.test(url)) url = url.replace(/^https?:[/][/][^/]+/i, "");
    if (seen[url]) continue;
    const start = m.index + m[0].length;
    let inner = html.slice(start, start + 1600);
    const corte = inner.search(/<a\b/i);
    if (corte > 0) inner = inner.slice(0, corte);
    const im = inner.match(/<img\b[^>]*>/i);
    let poster = "";
    let title = "";
    if (im) {
      const p = im[0].match(/\bdata-src="([^"]+)"/i) || im[0].match(/\bsrc="([^"]+)"/i);
      if (p) {
        poster = p[1];
        if (poster.indexOf("//") === 0) poster = "https:" + poster;
        else if (poster.indexOf("/") === 0) poster = IM_BASE + poster;
      }
      const a = im[0].match(/\balt="([^"]*)"/i);
      if (a && a[1]) title = clean(a[1]);
    }
    const h = inner.match(/<h[23456][^>]*>([\s\S]{2,150}?)<\/h[23456]>/i);
    if (h) {
      const t = clean(h[1].replace(/<[^>]*>/g, " "));
      if (t) title = t;
    }
    if (!title) {
      const st = inner.match(/<(?:strong|b)\b[^>]*>([^<]{2,120})<\/(?:strong|b)>/i);
      if (st) title = clean(st[1]);
    }
    if (!title) {
      const seg = url.split("/").filter(Boolean);
      title = seg[2] ? seg[2].replace(/-/g, " ") : "Sin título";
    }
    seen[url] = 1;
    out.push({ url: url, title: title, poster: poster });
  }
  log("IM tarjetas: " + out.length);
  return out;
}

async function imBuscar(q) {
  return imCards(await imPostForm("/manga/getMangasConsultResult", q, 1, 0, 30), 30);
}

async function imSerie(url) {
  const r = await kino.fetch(IM_BASE + url, { headers: { Accept: "text/html" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con InManga. Inténtalo de nuevo.",
  });
  const html = await r.text();
  const h1 = html.match(/<h1[^>]*>([\s\S]{2,150}?)<[/]h1>/i);
  let poster = "";
  const pm = html.match(/<div[^>]*col-md-3[\s\S]{0,800}?<img\b[^>]*\bsrc="([^"]+)"/i);
  if (pm) poster = pm[1];
  const dm = html.match(/<div[^>]*col-md-9[\s\S]{0,3000}?<div[^>]*panel-body[^>]*>([\s\S]{10,3000}?)<[/]div>/i);
  const caps = [];
  const seen = {};
  // Capítulos: el camino fiable es el JSON de getall (verificado en vivo);
  // el HTML de la serie trae los GUID en MAYÚSCULAS y a veces sin lista,
  // así que queda como respaldo con el patrón corregido.
  const guid = (String(url).match(/[0-9a-fA-F-]{36}/) || [])[0] || "";
  const slug = String(url).split("/").filter(Boolean)[2] || "";
  if (guid) {
    try {
      const gr = await kino.fetch(IM_BASE + "/chapter/getall?mangaIdentification=" + guid,
        { headers: { Accept: "application/json" } });
      if (gr.ok) {
        const j = JSON.parse(await gr.text());
        const inner = typeof j.data === "string" ? JSON.parse(j.data) : j;
        const arr = (inner && inner.result) || [];
        for (let i = 0; i < arr.length; i++) {
          const c = arr[i] || {};
          const cid = String(c.Identification || "");
          const num = String(c.FriendlyChapterNumberUrl || c.FriendlyChapterNumber || c.Number || "");
          if (!cid || !num) continue;
          const u = "/ver/manga/" + slug + "/" + num + "/" + cid;
          if (seen[u]) continue;
          seen[u] = 1;
          caps.push({ url: u, num: num });
        }
        log("IM getall: " + caps.length + " capítulos");
      } else {
        log("IM getall HTTP " + gr.status);
      }
    } catch (e) {
      log("IM getall falló: " + e);
    }
  }
  if (!caps.length) {
    const re = /href="([^"]*[/]ver[/]manga[/][a-zA-Z0-9-]+[/][^/"<]+[/][0-9a-fA-F-]{36})"/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      let u = m[1];
      if (/^https?:/i.test(u)) u = u.replace(/^https?:[/][/][^/]+/i, "");
      if (seen[u]) continue;
      seen[u] = 1;
      const seg = u.split("/").filter(Boolean);
      caps.push({ url: u, num: seg[3] || "" });
    }
    log("IM caps por HTML: " + caps.length);
  }
  const vnum = {};
  const caps2 = caps.filter(function (x) {
    const k = x.num + "";
    if (vnum[k]) return false;
    vnum[k] = 1;
    return true;
  });
  caps2.sort(function (a, b) { return parseFloat(b.num) - parseFloat(a.num); });
  log("IM capítulos: " + caps2.length);
  return {
    meta: {
      title: h1 ? clean(h1[1]) : "Sin título",
      poster: poster,
      overview: dm ? clean(dm[1].replace(/<[^>]*>/g, " ")).slice(0, 600) : "",
    },
    chapters: caps2,
  };
}

async function imImages(chUrl) {
  const guid = String(chUrl).split("/").filter(Boolean).pop().split("?")[0];
  const r = await kino.fetch(IM_BASE + "/chapter/chapterIndexControls?identification=" + guid, { headers: { Accept: "text/html" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con InManga. Inténtalo de nuevo.",
  });
  const html = await r.text();
  const chId = (html.match(/<input\b[^>]*\bid="ChapterIdentification"[^>]*\bvalue="([^"]+)"/i) ||
    html.match(/<input\b[^>]*\bvalue="([^"]+)"[^>]*\bid="ChapterIdentification"/i) || [])[1] || "";
  const mId = (html.match(/<input\b[^>]*\bid="MangaIdentification"[^>]*\bvalue="([^"]+)"/i) ||
    html.match(/<input\b[^>]*\bvalue="([^"]+)"[^>]*\bid="MangaIdentification"/i) || [])[1] || "";
  const ids = [];
  const re1 = /<img\b[^>]*\bid="([^"]+)"[^>]*class="[^"]*ImageContainer/gi;
  const re2 = /<img\b[^>]*class="[^"]*ImageContainer[^"]*"[^>]*\bid="([^"]+)"/gi;
  let m;
  while ((m = re1.exec(html)) !== null) ids.push(m[1]);
  while ((m = re2.exec(html)) !== null) { if (ids.indexOf(m[1]) < 0) ids.push(m[1]); }
  const out = [];
  for (let i = 0; i < ids.length; i++) out.push(IM_CDN + "/i/m/" + mId + "/c/" + chId + "/o/" + ids[i] + ".jpg");
  log("IM lector: " + out.length + " páginas");
  return out;
}

// InManga entrega como máximo 20 series por petición (con 30 devolvía 20
// y el catálogo creía que la lista se había acabado). Las páginas del
// catálogo usan 20 para que el salto cuadre con lo que el sitio sirve.
const IM_POR_PAG = 20;

async function imCatalog(page1) {
  const html = await imPostForm("/manga/getMangasConsultResult", "", 1, (page1 - 1) * IM_POR_PAG, IM_POR_PAG);
  const items = imCards(html, IM_POR_PAG);
  // Mientras la página traiga series nuevas hay más que pedir: la
  // guardia de cargarCatalogo corta si una página no aporta series
  // nuevas (antes el botón desaparecía con 19 de 20 series).
  return { items: items, mas: items.length > 0 };
}

// ------------------------------------------------ ManhwaWeb (5ª fuente)
// ManhwaWeb expone una API JSON pública (biblioteca, series y
// capítulos). Su JSON a veces trae saltos de línea crudos dentro de
// los números, así que se limpia antes de parsear; los enlaces de los
// capítulos se sacan por regex del texto por si la API vuelve a
// cambiar de forma. Las series se guardan como /<slug>_<id>, los
// capítulos como /leer/<slug>-<num>_01 y el contenido +18 se descarta.

const MW_API = "https://api.manhwaweb.com";
const MAX_CAPS_MW = 300;

async function mwGet(path) {
  const r = await kino.fetch(MW_API + path, { headers: { Accept: "application/json" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con ManhwaWeb. Inténtalo de nuevo.",
  });
  try { return await r.json(); } catch (e) { return JSON.parse((await r.text()).replace(/[\u0000-\u001F]/g, "")); }
}

function mwCards(j, max) {
  let arr;
  if (j && Array.isArray(j.data)) arr = j.data;
  else if (Array.isArray(j)) arr = j;
  else if (j && Array.isArray(j.utimos_mangas_creados)) arr = j.utimos_mangas_creados;
  else if (j && j.data && (Array.isArray(j.data.weekly) || Array.isArray(j.data.total))) arr = (j.data.weekly || []).concat(j.data.total || []);
  else arr = [];
  const out = [];
  for (let i = 0; i < arr.length && out.length < max; i++) {
    const x = arr[i];
    if (!x || !x._id) continue;
    if (String(x._erotico || "no") === "si") continue;
    const poster = String(x._imagen || "");
    if (!/^https?:/i.test(poster)) continue;
    out.push({ url: "/" + x._id, title: clean(x.name_esp || x.the_real_name || x._name || x._id), poster: poster });
  }
  log("MW tarjetas: " + out.length + " de " + arr.length);
  return out;
}

async function mwBuscar(q) {
  const j = await mwGet("/manhwa/library?buscar=" + encodeURIComponent(q) + "&page=0");
  return mwCards(j, 30);
}

async function mwSerie(url) {
  const id = String(url).replace(/^[/]/, "").replace(/[/]$/, "");
  const r = await kino.fetch(MW_API + "/manhwa/see/" + id, { headers: { Accept: "application/json" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con ManhwaWeb. Inténtalo de nuevo.",
  });
  const text = await r.text();
  let meta = { title: id, poster: "", overview: "" };
  try {
    const j = JSON.parse(text.replace(/[\u0000-\u001F]/g, ""));
    const d = (j && j.data && j.data._id) ? j.data : j;
    meta.title = clean(d.name_esp || d._name || d.the_real_name || id);
    meta.poster = String(d._imagen || "");
    meta.overview = clean(String(d.sinopsis || d._sinopsis || "")).slice(0, 600);
  } catch (e) { log("MW detalle JSON roto: " + e); }
  const caps = [];
  const seen = {};
  const re = /"(?:link|url)"\s*:\s*"([^"]*[/]leer[/][^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    let u = m[1];
    if (/^https?:/i.test(u)) u = u.replace(/^https?:[/][/][^/]+/i, "");
    if (seen[u]) continue;
    seen[u] = 1;
    const seg = u.split("/").filter(Boolean);
    const slug = seg[1] || "";
    const nm = slug.match(/-([0-9]+(?:[.][0-9]+)?)(?:[_][0-9]+)?$/);
    caps.push({ url: u, num: nm ? nm[1] : slug });
  }
  const vnum = {};
  const caps2 = caps.filter(function (x) {
    const k = x.num + "";
    if (vnum[k]) return false;
    vnum[k] = 1;
    return true;
  });
  caps2.sort(function (a, b) { return parseFloat(b.num) - parseFloat(a.num); });
  log("MW capítulos: " + caps2.length);
  return { meta: meta, chapters: caps2 };
}

async function mwImages(chUrl) {
  const slug = String(chUrl).replace(/^[/]leer[/]/, "").replace(/[/]$/, "");
  const j = await mwGet("/chapters/see/" + slug);
  let imgs = [];
  if (j && j.chapter && Array.isArray(j.chapter.img)) imgs = j.chapter.img;
  else if (j && j.data && Array.isArray(j.data.images)) imgs = j.data.images;
  const out = [];
  for (let i = 0; i < imgs.length; i++) if (/^https?:/i.test(imgs[i] || "")) out.push(imgs[i]);
  log("MW lector: " + out.length + " páginas");
  return out;
}

async function mwCatalog(page1) {
  const j = await mwGet("/manhwa/library?buscar=&page=" + (page1 - 1));
  return { items: mwCards(j, CAT_POR_PAG), mas: !!(j && j.next) };
}

// ------------------------------------------------ MangaOni (5ª fuente)
// MangaOni es un WordPress con Cloudflare que solo abre a peticiones
// presentadas como navegador de escritorio (receta verificada en la app
// KageView, que la lee con estas mismas cabeceras). Las series viven en
// /<tipo>/<slug>/ y los capítulos en /lector/<slug>/<id>/; las páginas
// de un capítulo vienen escondidas en un bloque base64 «var unicap»
// con la forma <dir>||["pág1","pág2",…]||<siguiente>. Sus URL se
// guardan con el prefijo /oni para no chocar con las de LectorXd, que
// también usa /manga/<slug>/.

const MAX_CAPS_MO = 300;
const MO_BASE = "https://manga-oni.com";
// Decodificador base64 (Kino no trae atob en el sandbox del plugin).
function b64dec(s) {
  const T = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const src = String(s || "").replace(/[^A-Za-z0-9+/]/g, "");
  let out = "";
  let bits = 0;
  let n = 0;
  for (let i = 0; i < src.length; i++) {
    const v = T.indexOf(src.charAt(i));
    if (v < 0) continue;
    bits = (bits << 6) | v;
    n += 6;
    if (n >= 8) {
      n -= 8;
      out += String.fromCharCode((bits >> n) & 255);
    }
  }
  return out;
}

function moPath(url) {
  let u = String(url || "");
  if (u.indexOf("/oni") === 0) u = u.slice(4);
  return u;
}

// Portadas relativas del directorio resueltas contra el dominio propio.
function moAbs(u) {
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("/") === 0) return MO_BASE + u;
  if (/^https?:/i.test(u)) return u;
  return MO_BASE + "/" + u;
}

// Tarjetas del directorio de MangaOni: cada serie es un <a> con
// itemprop="url" (el orden de href e itemprop es libre en el HTML real),
// la portada en un <img> (data-src o src; el default.gif es la
// silueta) y las +18 marcadas con <b id="in" class="c1">. Si el
// itemprop cambiara o desapareciera, hay un respaldo con anclas
// genéricas; y si no sale NADA, el log muestra el inicio del HTML
// recibido para distinguir un bloqueo de un cambio de estructura.
function moCardDe(href, inner) {
  if (!/[/](?:manga|manhwa|manhua|one[-_]shot|novela)[/]/i.test(href)) return null;
  // +18: fuera (Kino es un salón familiar).
  if (/<b\b[^>]*(?:id="in"[^>]*class="[^"]*c1|class="[^"]*c1[^>]*id="in")/i.test(inner)) return null;
  let poster = "";
  let title = "";
  const im = inner.match(/<img\b[^>]*>/i);
  if (im) {
    const p = im[0].match(/\bdata-src="([^"]+)"/i) || im[0].match(/\bsrc="([^"]+)"/i);
    // La silueta default.gif marca entradas sin portada (a menudo
    // contenido oculto): fuera del directorio, como hace KageView.
    if (p && /default[.]gif/i.test(p[1])) return null;
    if (p) poster = moAbs(p[1]);
    const a = im[0].match(/\balt="([^"]*)"/i);
    if (a && a[1]) title = clean(a[1]);
  }
  const h = inner.match(/<h[23456][^>]*>([\s\S]{2,150}?)<\/h[23456]>/i);
  if (h) {
    const t = clean(h[1].replace(/<[^>]*>/g, " "));
    if (t) title = t;
  }
  let path = href.replace(/^https?:[/][/][^/]+/i, "");
  if (!/\/$/.test(path)) path += "/";
  if (!title) {
    const seg = path.split("/").filter(Boolean);
    title = seg[1] ? seg[1].replace(/-/g, " ") : "Sin título";
  }
  return { url: "/oni" + path, title: title, poster: poster };
}

function moCards(html, max) {
  const out = [];
  const seen = {};
  const add = (href, inner) => {
    const c = moCardDe(href, inner);
    if (!c || seen[c.url]) return;
    seen[c.url] = 1;
    out.push(c);
  };
  const innerDesde = (idx) => {
    let inner = html.slice(idx, idx + 2000);
    const corte = inner.search(/<a\b/i);
    if (corte > 0) inner = inner.slice(0, corte);
    return inner;
  };
  const re = /<a\b[^>]*itemprop="url"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null && out.length < max) {
    const h = m[0].match(/\bhref="([^"]+)"/i);
    if (!h) continue;
    add(h[1], innerDesde(m.index + m[0].length));
  }
  if (!out.length) {
    // Respaldo: anclas genéricas a serie con su contenido pegado.
    const re2 = /<a\b[^>]*\bhref="([^"]*[/](?:manga|manhwa|manhua|one[-_]shot|novela)[/][a-z0-9-]+[/]?)"[^>]*>/gi;
    let m2;
    while ((m2 = re2.exec(html)) !== null && out.length < max) {
      add(m2[1], innerDesde(m2.index + m2[0].length));
    }
  }
  log("MO tarjetas: " + out.length);
  if (!out.length && html) log("MO 0 tarjetas — html " + html.length + ": " + clean(html.slice(0, 140)));
  return out;
}

async function moCatalog(cat, page1) {
  const f = fuentePorId("mangaoni");
  const filtro = (cat && cat.order) || "visitas";
  const html = await getHtmlDe(f, "/directorio?filtro=" + encodeURIComponent(filtro) + "&orden=desc&adulto=false&p=" + page1);
  const items = moCards(html, 18);
  // Mientras traiga series, se ofrece "Cargar más" (el directorio no
  // siempre llena 18: hay saltadas por +18 o sin portada); la guardia
  // de cargarCatalogo corta cuando una página no aporta nada nuevo.
  return { items: items, mas: items.length > 0 };
}

async function moBuscar(q) {
  const f = fuentePorId("mangaoni");
  const html = await getHtmlDe(f, "/buscar/?q=" + encodeURIComponent(q));
  return moCards(html, 30);
}

// La página de una serie: título (h1), sinopsis (meta description) y
// capítulos de #c_list. Cada entrada es un <a> a /lector/<slug>/<id>/ —
// el id del PROPIO enlace es el id del capítulo (receta exacta de
// KageView: se sigue tal cual, sin inventarlo de las imágenes) — con
// el número en un .timeago (data-num).
async function moSerie(url) {
  const f = fuentePorId("mangaoni");
  const html = await getHtmlDe(f, moPath(url));
  let title = "";
  const h1 = html.match(/<h1\b[^>]*entry-title[^>]*>([\s\S]{2,200}?)<\/h1>/i);
  if (h1) title = clean(h1[1].replace(/<[^>]*>/g, " "));
  if (!title) {
    const og = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i) ||
               html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/i);
    if (og) title = clean(og[1]);
  }
  // El sitio rellena títulos con su eslogan de buscador («La serie —
  // leer manga en línea gratis español | MangaOni»): fuera.
  title = title
    .replace(/\s*[—–-]+\s*leer manga en l[ií]nea[^|]*/i, "")
    .replace(/\s*[|]\s*MangaOni\s*$/i, "")
    .trim();
  let poster = "";
  const ogi = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
              html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
  if (ogi) poster = ogi[1];
  let overview = "";
  const md = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i) ||
             html.match(/<meta\b[^>]*content="([^"]*)"[^>]*name="description"/i);
  if (md) overview = clean(md[1]).slice(0, 600);
  const meta = { title: title || "Serie", poster: poster, overview: overview };

  const caps = [];
  const seen = {};
  const re = /<a\b[^>]*href="([^"]*[/]lector[/][^"]+)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null && caps.length < TOPE_CAPS_SERIE) {
    const href = m[1].replace(/^https?:[/][/][^/]+/i, "");
    const seg = href.split("/").filter(Boolean); // [lector, slug, id]
    if (seg.length < 3 || seg[0] !== "lector") continue;
    const slug = seg[1];
    const start = m.index + m[0].length;
    // Hasta el ENLACE del siguiente capítulo (no cualquier <a>: el
    // HTML real trae anclas anidadas dentro de cada entrada).
    const resto = html.slice(start, start + 3000);
    const nxt = resto.search(/href="[^"]*[/]lector[/]/);
    const inner = nxt > 0 ? resto.slice(0, nxt) : resto;
    let num = "";
    const tn = inner.match(/class="[^"]*timeago[^"]*"[^>]*data-num="([0-9]+(?:[.][0-9]+)?)"/i) ||
               inner.match(/data-num="([0-9]+(?:[.][0-9]+)?)"[^>]*class="[^"]*timeago[^"]*"/i);
    if (tn) num = tn[1];
    if (!num) {
      const ct = inner.match(/cap[ií]tulo\s*(?: nº?)?\s*([0-9]+(?:[.][0-9]+)?)/i);
      if (ct) num = ct[1];
    }
    // KageView sigue la propia ruta del enlace: /lector/<slug>/<id>/.
    const chUrl = "/oni/lector/" + slug + "/" + seg[2] + "/";
    if (seen[chUrl]) continue;
    seen[chUrl] = 1;
    if (!num) num = String(caps.length + 1);
    caps.push({ url: chUrl, num: num });
  }
  // Del más nuevo al más viejo; cargarSerie luego voltaea la lista al
  // orden ascendente común (del capítulo 1 al último).
  caps.sort((a, b) => (parseFloat(b.num) || 0) - (parseFloat(a.num) || 0) ||
    String(b.num).localeCompare(String(a.num)));
  if (!caps.length) log("MO 0 capítulos — html " + html.length + (html.indexOf("c_list") >= 0 ? ", c_list presente" : ", SIN c_list"));
  log("MO capítulos: " + caps.length);
  return { meta: meta, chapters: caps };
}

// Las páginas del capítulo vienen en el bloque base64 «var unicap»,
// con el formato REAL de KageView: <dir>||["1.webp","2.webp",…]||<sig>
// — una lista con corchetes y comillas (a veces escritas &quot;).
function moImages(html) {
  const m = html.match(/var\s+unicap\s*=\s*'([^']+)'/);
  if (!m) {
    log("MO lector sin unicap (" + html.length + " chars)");
    return [];
  }
  const dec = b64dec(m[1]);
  const parts = dec.split("||");
  const dir = (parts[0] || "").trim();
  let raw = (parts[1] || "").replace(/&quot;/g, '"').trim();
  // Lista ["a","b",…] → sin corchetes y partir por ","; si viniera
  // en el formato simple antiguo (a,b,c), se parte por comas normales.
  if (/^\[/.test(raw) && /\]$/.test(raw)) raw = raw.slice(1, -1);
  const pags = raw.indexOf('","') >= 0 ? raw.split('","') : raw.split(",");
  const limpias = pags.map((x) => x.replace(/^["']+|["']+$/g, "").trim()).filter(Boolean);
  const out = limpias.map((p) => dir + p);
  if (out.length && out[0]) {
    const host = out[0].replace(/^https?:[/][/]/, "").split("/")[0];
    log("MO lector: " + out.length + " páginas (imágenes en " + host + ")");
  } else {
    log("MO lector: 0 páginas");
  }
  return out;
}

// --------------------------------------- dimensiones de las páginas
// El contrato del Image (kino.d.ts de la galería oficial) solo admite
// width/height de una escala fija de tamaños, y el Image SIEMPRE
// rellena su caja recortando lo que sobre (cover): una página solo se
// ve entera si su caja tiene la proporción de la imagen. Las páginas
// del sitio no traen dimensiones en el HTML: se leen de los
// WebP, la cabecera del GIF) con kino.fetch + maxBytes, y se guardan en
// kino.storage para no volver a medirlas. Kino acepta 60 peticiones por
// llamada: se miden 50 por evento y las que falten las mide un
// temporizador (dimsTick) mientras se lee. Patrón del lector de
// Yuri Online, que funciona en este mismo teléfono.

const DIMS_BATCH = 50;
const DIMS_TOPE = 600;

function deB64(s) {
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const out = [];
  let acc = 0, bits = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ABC.indexOf(s.charAt(i));
    if (v < 0) continue;
    acc = (acc * 64) + v;
    bits += 6;
    if (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xFF); acc = acc % Math.pow(2, bits); }
  }
  return out;
}

function dimsDeBytes(b) {
  if (!Array.isArray(b) || b.length < 12) return null;
  if (b[0] === 0xFF && b[1] === 0xD8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xFF) { i++; continue; }
      const m = b[i + 1];
      if (m === 0x01 || (m >= 0xD0 && m <= 0xD9)) { i += 2; continue; }
      const len = (b[i + 2] << 8) | b[i + 3];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
        return { w: (b[i + 7] << 8) | b[i + 8], h: (b[i + 5] << 8) | b[i + 6] };
      }
      if (m === 0xDA) break;
      i += 2 + len;
    }
    return null;
  }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) {
    return { w: (b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19],
      h: (b[20] << 24) | (b[21] << 16) | (b[22] << 8) | b[23] };
  }
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { w: b[6] | (b[7] << 8), h: b[8] | (b[9] << 8) };
  }
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) {
    const tag = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (tag === "VP8X" && b.length > 29) {
      return { w: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        h: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    }
    if (tag === "VP8 " && b.length > 29 && b[23] === 0x9D && b[24] === 0x01 && b[25] === 0x2A) {
      return { w: b[26] | (b[27] << 8), h: b[28] | (b[29] << 8) };
    }
    if (tag === "VP8L" && b.length > 25 && b[20] === 0x2F) {
      const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { w: 1 + (v & 0x3FFF), h: 1 + ((v >>> 14) & 0x3FFF) };
    }
    return null;
  }
  return null;
}

function hashUrl(u) {
  let h = 5381;
  for (let i = 0; i < u.length; i++) h = ((h * 33) + u.charCodeAt(i)) >>> 0;
  return ("0000000" + h.toString(16)).slice(-8);
}

function dimsTodas() { return getJson("dims", {}); }

function dimPut(nuevos) {
  try {
    const all = dimsTodas();
    for (let i = 0; i < nuevos.length; i++) all[nuevos[i][0]] = nuevos[i][1];
    const ks = Object.keys(all);
    if (ks.length > DIMS_TOPE) {
      for (let i = 0; i < ks.length - DIMS_TOPE; i++) delete all[ks[i]];
    }
    setJson("dims", all);
  } catch (e) { log("dims: " + e); }
}

async function dimsDeImagen(url) {
  try {
    const r = await kino.fetch(url, { maxBytes: 16384, timeoutMs: 5000 });
    if (!r.ok) return null;
    const d = dimsDeBytes(deB64(r.base64()));
    return d && d.w > 0 && d.h > 0 ? d : null;
  } catch (e) { return null; }
}

// Mide hasta DIMS_BATCH páginas sin dimensiones (el caché primero) y
// guarda las nuevas. Devuelve cuántas quedan medidas en total.
async function medirImagenes(images, presupuesto) {
  const t0 = Date.now();
  const cache = dimsTodas();
  const pend = [];
  let listas = 0;
  for (let i = 0; i < images.length; i++) {
    const im = images[i];
    if (im.w > 0 && im.h > 0) { listas++; continue; }
    const c = cache[hashUrl(im.url)];
    if (Array.isArray(c) && c[0] > 0 && c[1] > 0) { im.w = c[0]; im.h = c[1]; listas++; continue; }
    pend.push(im);
  }
  const nuevas = [];
  let hechas = 0;
  for (let i = 0; i < pend.length && hechas < DIMS_BATCH; i += 12) {
    if (Date.now() - t0 > (presupuesto || 9000)) break;
    const fin = Math.min(pend.length, i + 12, i + DIMS_BATCH - hechas);
    const lote = pend.slice(i, fin);
    hechas += lote.length;
    const rs = await Promise.all(lote.map((im) => dimsDeImagen(im.url).catch(() => null)));
    for (let j = 0; j < lote.length; j++) {
      const d = rs[j];
      if (d) {
        lote[j].w = d.w;
        lote[j].h = d.h;
        listas++;
        nuevas.push([hashUrl(lote[j].url), [d.w, d.h]]);
      }
    }
  }
  if (nuevas.length) dimPut(nuevas);
  log("dims: " + listas + " de " + images.length + " medidas");
  return listas;
}

// ------------------------------------------------------------- interfaz

function loadingTree(msg) {
  return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
    { type: "CircularProgressIndicator" },
    { type: "Text", text: msg || "Cargando…", textEn: "Loading…", color: "muted" },
  ] };
}

function errorTree(msg) {
  return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
    { type: "Icon", name: "error", color: "muted" },
    { type: "Text", text: msg || "No se pudo cargar.", textEn: "Could not load.", color: "muted" },
    { type: "ElevatedButton", icon: "refresh", labelText: "Reintentar", labelTextEn: "Retry",
      onPressed: { event: "retry" } },
  ] };
}

function serieKey(prefix, url) {
  return prefix + String(url).replace(/[^a-z0-9]/gi, "").slice(-40);
}

function twoLines(t) {
  const s = String(t || "");
  return s.length > 42 ? [s.slice(0, 40) + "…", s.slice(40, 80)] : [s];
}

function posterCard(it, prefix, rail) {
  const img = {
    type: "Image", url: it.poster || "", aspect: "2:3",
    alt: it.title, altEn: it.title,
    fallback: { type: "Column", padding: 16, crossAxisAlignment: "center",
      children: [{ type: "Icon", name: "list", color: "muted" }] },
  };
  if (rail) img.width = 120;
  return {
    type: "Card", key: serieKey(prefix, it.url), flush: true,
    onTap: { event: "openSeries", arg: it.url },
    children: [img].concat(twoLines(it.title).map((ln) => (
      { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 }))),
  };
}

function gridOf(items, vacio) {
  if (!items || !items.length) return vacio;
  return {
    type: "ListView", key: "grid",
    columns: { compact: 3, medium: 4, expanded: 6 },
    items: items.map((it) => posterCard(it, "c-")),
  };
}

const VACIO_SERIES = { type: "emptyState", icon: "list",
  title: "No se encontraron series.", titleEn: "No series found." };
const VACIO_BUSQUEDA = { type: "emptyState", icon: "search",
  title: "Sin resultados.", titleEn: "No results." };

function railOf(titulo, tituloEn, items, key, prefix) {
  if (!items || !items.length) return [];
  return [
    { type: "Text", text: titulo, textEn: tituloEn, style: "h3", padding: 16 },
    { type: "SingleChildScrollView", key: key, direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8,
        children: items.slice(0, 20).map((it) => posterCard(it, prefix, true)) }] },
  ];
}

function fuenteCard(nombre, nota, evento, arg) {
  return { type: "Card", key: "fuente-" + nombre.replace(/[^a-z0-9]/gi, ""), flush: true,
    onTap: { event: evento, arg: arg },
    children: [
      { type: "Text", text: nombre, textEn: nombre, style: "h3", padding: 16 },
      { type: "Text", text: nota, textEn: nota, style: "caption", color: "muted", padding: 16 },
    ] };
}

async function homeTree() {
  const f = fuenteActiva();
  let html = "";
  let populares = [];
  let recientes = [];
  let actualizados = [];
  let mixtas = [];
  let titPop = "Populares en español";
  let titPopEn = "Popular in Spanish";
  let titRec = "Actualizados recientes";
  let titRecEn = "Recently updated";
  let titUpd = "Actualizados recientes";
  let titUpdEn = "Recently updated";
  if (f.id === "mangadex") {
    // MangaDex es una API: la portada son dos consultas (populares y
    // series con capítulo reciente en español).
    titPop = "Populares de MangaDex"; titPopEn = "Popular on MangaDex";
    titRec = "Actualizados en MangaDex"; titRecEn = "Updated on MangaDex";
    try { populares = mdCards(await mdJson(mdQuery("order[followedCount]=desc", 0, 20)), 20); } catch (e) { log("MD home pop: " + e); }
    try { recientes = mdCards(await mdJson(mdQuery("order[latestUploadedChapter]=desc", 0, 20)), 20); } catch (e) { log("MD home rec: " + e); }
  } else if (f.id === "inmanga") {
    // El catálogo popular sale del POST; si el POST no responde, la
    // portada misma de InManga (un GET, que sí funciona) trae
    // «Últimas actualizaciones» con sus enlaces.
    titPop = "Populares de InManga"; titPopEn = "Popular on InManga";
    titRec = "Últimas actualizaciones"; titRecEn = "Latest updates";
    let pag = "";
    try { pag = await imPostForm("/manga/getMangasConsultResult", "", 1, 0, 20); } catch (e) { log("IM POST falló: " + e); }
    try { populares = pag ? imCards(pag, 20) : []; } catch (e) { log("IM cards POST: " + e); }
    if (populares.length) {
      try { recientes = imCards(await getHtmlDe(f, "/"), 24); } catch (e) { log("IM home GET: " + e); }
    } else {
      titPop = "Últimas actualizaciones"; titPopEn = "Latest updates";
      try { populares = imCards(await getHtmlDe(f, "/"), 24); } catch (e) { log("IM home GET: " + e); }
    }
  } else if (f.id === "mangaoni") {
    // El directorio ordenado por visitas (populares) o por id (novedades),
    // sin contenido +18, 18 series por página; /recientes trae el
    // feed de capítulos recién publicados.
    titPop = "Populares de MangaOni"; titPopEn = "Popular on MangaOni";
    titRec = "Novedades de MangaOni"; titRecEn = "New on MangaOni";
    titUpd = "Actualizados de MangaOni"; titUpdEn = "Updated on MangaOni";
    try { populares = moCards(await getHtmlDe(f, "/directorio?filtro=visitas&orden=desc&adulto=false&p=1"), 20); } catch (e) { log("MO home pop: " + e); }
    try { recientes = moCards(await getHtmlDe(f, "/directorio?filtro=id&orden=desc&adulto=false&p=1"), 20); } catch (e) { log("MO home rec: " + e); }
    try { actualizados = moCards(await getHtmlDe(f, "/recientes"), 20); } catch (e) { log("MO home upd: " + e); }
  } else {
    html = await getHtmlDe(f, "/");
    if (f.id === "lectorxd") {
    // La portada de LectorXd trae "Populares de hoy" y "Recientes". Los
    // encabezados se buscan tolerando etiquetas en medio (el HTML real
    // viene con <span> dentro de los títulos) y "Recientes" se busca
    // DESPUÉS de "Populares de hoy", porque la palabra puede aparecer
    // antes en un menú. Si algo no aparece, se vuelve a la cuadrícula
    // mixta y el log anota los encabezados que trajo la página.
    titPop = "Populares de hoy"; titPopEn = "Popular today";
    titRec = "Recientes"; titRecEn = "Recent";
    const mP = html.match(/populares(?:[^<>]|<[^>]*>){1,80}?hoy/i);
    const posP = mP ? mP.index : -1;
    const mR = posP >= 0 ? html.slice(posP + 5).match(/recientes/i) : null;
    const posR = mR ? posP + 5 + mR.index : -1;
    log("LX portada: posP=" + posP + " posR=" + posR + " html=" + html.length);
    if (posP >= 0 && posR > posP) {
      populares = cardsLX(html.slice(posP, posR), 12);
      recientes = cardsLX(html.slice(posR), 24);
    }
    if (!populares.length && !recientes.length) mixtas = cardsLX(html, 40);
    if (!populares.length && !recientes.length) {
      const heads = (html.match(/<h[123][^>]*>[^<]{2,50}/gi) || []).slice(0, 6);
      log("LX portada sin secciones; h: " + heads.join(" ~ ").replace(/\s+/g, " ").slice(0, 300));
    }
  } else {
    // La portada de LeerCapitulo trae tres secciones (Tendencias,
    // Populares, Ultimos mangas): se reparte el HTML por sus encabezados
    // y cada rail se llena con la suya. Si el sitio cambia y no aparecen,
    // se vuelve a la cuadrícula mixta de siempre.
    const posT = html.search(/tendencias/i);
    const posP = html.search(/populares/i);
    const posU = html.search(/ultimos\s+mangas/i);
    if (posT >= 0 && posP > posT && posU > posP) {
      populares = homeCards(html.slice(posP, posU), 10)
        .concat(homeCards(html.slice(posT, posP), 24));
      recientes = homeCards(html.slice(posU), 24);
    } else {
      mixtas = homeCards(html, 40);
    }
    }
  }
  const vp = {};
  populares = populares.filter((x) => (!vp[x.url] && (vp[x.url] = 1)));
  const vr = {};
  recientes = recientes.filter((x) => (!vr[x.url] && (vr[x.url] = 1)));
  if (!populares.length && !recientes.length && !mixtas.length) mixtas = cardsDe(f, html, 40);
  const mf = favs();
  // v0.4.4 — favoritos en cuadrícula como el catálogo (antes: tira
  // horizontal apretada), con el nombre de la fuente debajo y botón
  // para verlos todos cuando son más de 12.
  const railFavs = mf.length ? [
    { type: "Text", text: "Mis favoritos (" + mf.length + ")",
      textEn: "My favourites (" + mf.length + ")", style: "h3", padding: 16 },
    { type: "ListView", key: "gridFavs", columns: { compact: 3, medium: 4, expanded: 6 },
      items: mf.slice(0, 12).map(function (it) { return favCard(it); }) },
    mf.length > 12
      ? { type: "ElevatedButton", key: "favsTodos", icon: "expand_more",
          labelText: "Ver todos los favoritos (" + mf.length + ")",
          labelTextEn: "See all favourites (" + mf.length + ")", onPressed: "favsOpen" }
      : null,
  ].filter(Boolean) : [];
  const hh = hist();
  const hItems = Object.keys(hh).map((k) => ({ url: k, title: hh[k].title || "",
      poster: hh[k].poster || "", ts: hh[k].ts || 0 }))
    .filter((x) => x.title).sort((a, b) => b.ts - a.ts).slice(0, 15);
  const railHist = hItems.length ? [
    { type: "Text", text: "Seguir leyendo", textEn: "Keep reading", style: "h3", padding: 16 },
    { type: "SingleChildScrollView", key: "railHist", direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8,
        children: hItems.map((it) => posterCard(it, "h-", true)) }] },
  ] : [];
  const fuentes = [
    { type: "Text", text: "Fuentes", textEn: "Sources", style: "h3", padding: 16 },
    { type: "SingleChildScrollView", key: "railFuentes", direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8, children: FUENTES.map((x) =>
        x.id === f.id
          ? fuenteCard(x.nombre, "Activa", "fuenteActual", x.nombre)
          : fuenteCard(x.nombre, "Toca para cambiar", "cambiarFuente", x.id)
      ).concat([
        fuenteCard("AniList", "Buscar y descubrir manga", "alOpen", "anilist"),
        fuenteCard("Mangas.in", "Bloqueada (firewall)", "fuentePronto", "Mangas.in"),
      ]) }] },
  ];
  const gridSeries = mixtas.length ? [
    { type: "Text", text: "Series de " + f.nombre, textEn: f.nombre + " series",
      style: "h3", padding: 16 },
    gridOf(mixtas, VACIO_SERIES),
  ] : [];
  const catalogo = [
    { type: "Card", key: "catEntry", flush: true, onTap: { event: "openCatalog" },
      children: [
        { type: "Text", text: "Catálogo completo · " + f.nombre, textEn: "Full catalog · " + f.nombre,
          style: "h3", padding: 16 },
        { type: "Text", text: f.id === "lectorxd"
            ? "Explora por tipo, estado y orden"
            : "Explora por género, tipo y estado",
          textEn: "Browse with filters", style: "caption", color: "muted", padding: 16 },
      ] },
  ];
  if (!populares.length && !recientes.length && !mixtas.length) return VACIO_SERIES;
  return { type: "SingleChildScrollView", key: "home", children: []
    .concat(fuentes)
    .concat(railHist)
    .concat(railOf(titPop, titPopEn, populares, "railPop", "p-"))
    .concat(railOf(titRec, titRecEn, recientes, "railRec", "r-"))
    .concat(railOf(titUpd, titUpdEn, actualizados, "railUpd", "u-"))
    .concat(railFavs)
    .concat(gridSeries)
    .concat(catalogo) };
}

function detalleSinCaps(url) {
  const f = fuenteDeUrl(url);
  if (f && f.id === "lectorxd")
    return "No hay capítulos legibles de esta serie en LectorXd: si es +18, la cierra sin cuenta. Prueba otra serie.";
  if (f && f.id === "mangadex")
    return "MangaDex no tiene capítulos legibles en español de esta serie: sus capítulos en español suelen ser solo enlaces a otras webs (series licenciadas) o la serie está retirada. Prueba esta serie en otra fuente.";
  if (f && f.id === "inmanga")
    return "InManga no devolvió capítulos de esta serie. Si vuelve a pasar, mándame el log de depuración.";
  if (f && f.id === "mangaoni")
    return "MangaOni no devolvió capítulos de esta serie: si es +18, su puerta la bloquea; si no, mándame el log de depuración.";
  return "No se encontraron capítulos para esta serie.";
}

function detailTree(state) {
  const d = state.detail;
  if (!d) return loadingTree("Cargando serie…");
  const meta = d.meta || {};
  const chapters = Array.isArray(d.chapters) ? d.chapters : [];
  const hInfo = hist()[d.url];
  // El historial guarda el índice ABSOLUTO del capítulo (independiente
  // de la ventana que se esté viendo); "Continuar" lo abre aunque esté
  // en otra ventana de la lista.
  const hIdx = hInfo && hInfo.idx >= 0 ? hInfo.idx : -1;
  const capStart = d.capStart || 0;
  const capsTotal = d.capsTotal || chapters.length;
  if (!chapters.length) {
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "Icon", name: "error", color: "muted" },
      { type: "Text", text: detalleSinCaps(d.url), color: "muted" },
      { type: "ElevatedButton", icon: "arrow_back", labelText: "Volver", labelTextEn: "Back",
        onPressed: { event: "popBack" } },
    ] };
  }
  const cover = meta.poster
    ? { type: "Image", url: meta.poster, width: { compact: 120, expanded: 160 },
        aspect: "2:3", alt: meta.title, fallback: { type: "Icon", name: "list" } }
    : { type: "Icon", name: "list" };
  const head = {
    type: "Row", gap: 16, padding: 16, crossAxisAlignment: "start", stackOnNarrow: true,
    children: [
      cover,
      { type: "Column", gap: 6, flex: 2, crossAxisAlignment: "start", children: [
        { type: "Text", text: meta.title || d.url, style: "h2" },
        { type: "Text", text: chapters.length + " capítulos",
          textEn: chapters.length + " chapters", color: "muted", style: "caption" },
        meta.overview ? { type: "Text", text: meta.overview.slice(0, 1500), style: "p", color: "muted" } : null,
        {
          type: "Row", gap: 8, wrap: true, children: [
            { type: "ElevatedButton", key: "start", icon: "play",
              labelText: "Empezar a leer", labelTextEn: "Start reading",
              onPressed: { event: "read", arg: "0" } },
            { type: "ElevatedButton", key: "latest", icon: "expand_more",
              labelText: "Leer lo último", labelTextEn: "Read latest",
              onPressed: { event: "read", arg: String(chapters.length - 1) } },
            { type: "ElevatedButton", key: "continuar", icon: "play_arrow",
              labelText: hIdx >= 0 ? "Continuar: cap. " + (hInfo.num || "?") : "Continuar",
              labelTextEn: hIdx >= 0 ? "Continue: ch. " + (hInfo.num || "?") : "Continue",
              onPressed: { event: "seguirLeyendo", arg: String(hIdx) },
              enabled: hIdx >= 0, hidden: hIdx < 0 },
            { type: "ElevatedButton", key: "fav", icon: isFav(d.url) ? "heart" : "star",
              labelText: isFav(d.url) ? "Quitar de favoritos" : "Añadir a favoritos",
              labelTextEn: isFav(d.url) ? "Remove favourite" : "Add favourite",
              onPressed: "fav" },
          ],
        },
      ].filter(Boolean) },
    ],
  };
  // Lista única estilo Yuri Online: un ListView con head + contador + un
  // ListTile por capítulo (1 nodo por capítulo). La lista vieja usaba
  // Card+Text (2 nodos por capítulo): con series largas superaba los 600
  // nodos que Kino admite por pantalla y la descartaba entera (pantalla negra).
  const items = [head];
  const totalTxt = capsTotal > chapters.length
    ? "Capítulos " + (capStart + 1) + "–" + (capStart + chapters.length) + " de " + capsTotal
    : chapters.length + " capítulos";
  items.push({ type: "Text", text: totalTxt,
    textEn: chapters.length + " chapters", style: "h3", padding: 16 });
  // Fila de ventanas: en series largas la lista se pasea de VENTANA_CAPS
  // en VENTANA_CAPS con estos dos botones (arriba y abajo de la lista).
  const navFila = (pref) => ({ type: "Row", key: pref + "nav", gap: 8, wrap: true, padding: { h: 16 }, children: [
    capStart > 0
      ? { type: "ElevatedButton", key: pref + "navPrev", icon: "arrow_upward",
          labelText: "Capítulos más recientes", labelTextEn: "Newer chapters",
          onPressed: { event: "capsPrev" } } : null,
    capStart + chapters.length < capsTotal
      ? { type: "ElevatedButton", key: pref + "navNext", icon: "arrow_downward",
          labelText: "Capítulos más antiguos", labelTextEn: "Older chapters",
          onPressed: { event: "capsNext" } } : null,
  ].filter(Boolean) });
  if (capStart > 0 || capStart + chapters.length < capsTotal) {
    items.push(navFila("ar"));
  }
  const leidos = hIdx - capStart;   // hasta qué fila de ESTA ventana llegó
  for (let i = 0; i < chapters.length; i++) {
    items.push({
      type: "ListTile", key: "cap" + i, dense: true,
      title: "Capítulo " + chapters[i].num + (hIdx >= 0 && i <= leidos ? " ✓" : ""),
      onTap: { event: "read", arg: String(i) },
    });
  }
  if (capStart > 0 || capStart + chapters.length < capsTotal) {
    items.push(navFila("ab"));
  }
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barDetail", title: String(meta.title || "Serie").slice(0, 30),
      leading: { type: "IconButton", key: "backFromDetail", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "ListView", key: "detailBody", items: items },
  };
}

// Lector de Kino 0.9.81 (docs screen-components.md, "Image" y "Un
// lector" de screen-reference.md): con fit "width" la imagen toma el
// ANCHO de su caja y su alto propio, así una página o una tira larga
// nunca se corta — sin medir bytes, sin tabla de cajas. El aspect
// "w:h" (cualquier ancho sobre alto de 0,2 a 5) solo guarda el hueco
// hasta que la imagen carga; se arma con la proporción MEDIDA de cada
// página (dims) o con la mediana del capítulo como guía. Un Kino más
// antiguo lee fit como cover y aspect solo en las 4 formas fijas: por
// eso el aspect va en la forma "1:X" y el nodo no lleva width/height
// (una caja explícita angosta limitaría el ancho incluso con fit).

function pageNodes(p, i, ratioGuia, sinFallback) {
  const url = typeof p === "string" ? p : p.url;
  const w = (p && p.w) || 0, h = (p && p.h) || 0;
  let ratio = w > 0 && h > 0 ? h / w : (ratioGuia || 1.4);
  if (!(ratio >= 0.2)) ratio = 0.2;
  if (ratio > 5) ratio = 5;
  const aspect = "1:" + (Math.round(ratio * 100) / 100);
  // El fallback (un nodo Column + un Text) sobra en el modo páginas:
  // con 250 páginas llevaría el árbol por encima de los 600 nodos que
  // Kino admite por pantalla. Sin fallback, una imagen que falla
  // muestra la marca de Kino.
  const nodo = {
    type: "Image", key: "p" + i, url: url,
    alt: "Página " + (i + 1), altEn: "Page " + (i + 1),
    fit: "width",
    aspect: aspect,
  };
  if (!sinFallback) {
    nodo.fallback = { type: "Column", padding: 16, children: [
      { type: "Text", text: "Página " + (i + 1), textEn: "Page " + (i + 1), color: "muted" } ] };
  }
  return [nodo];
}

// El widget pages (apiVersion 17, Kino 0.9.81): páginas a pantalla
// completa que se pasan con el dedo, con la barra de progreso fina de
// Kino y zoom en cada página. Un Kino más antiguo descarta el nodo,
// así que SOLO se ofrece si el runtime lo declara.
function pagesDisponible() {
  try {
    return typeof kino === "object" && kino !== null &&
      typeof kino.screen === "object" && kino.screen !== null &&
      Array.isArray(kino.screen.widgets) &&
      kino.screen.widgets.indexOf("pages") >= 0;
  } catch (e) { return false; }
}

function modoLectorPref() {
  return getJson("modoLector", "tira") === "paginas" ? "paginas" : "tira";
}

// El modo páginas solo procede con el widget disponible y un capítulo
// de 2 a 250 páginas (los límites del widget con progress "bar").
function modoLectorEfectivo(n) {
  const puede = pagesDisponible() && n >= 2 && n <= 250;
  return puede && modoLectorPref() === "paginas" ? "paginas" : "tira";
}

function readerTree(state) {
  const r = state.reader;
  if (!r || !Array.isArray(r.images) || !r.images.length) {
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "Icon", name: "error", color: "muted" },
      { type: "Text", text: "Este capítulo no tiene páginas cargadas.",
        textEn: "This chapter has no pages loaded.", color: "muted" },
      { type: "ElevatedButton", icon: "arrow_back", labelText: "Volver", labelTextEn: "Back",
        onPressed: { event: "popBack" } },
    ] };
  }
  const d = state.detail;
  const chapters = (d && Array.isArray(d.chapters)) ? d.chapters : [];
  const idx = r.idx || 0;
  const ch = chapters[idx];
  const hasNext = idx + 1 < chapters.length;
  const hasPrev = idx > 0;
  const chKey = ch ? String(ch.num).replace(/[^a-z0-9]/gi, "") : String(idx);
  const scrollKey = "pages-" + idx + "-" + chKey + "-" + (r.tk || 0);
  const medidas = r.images.filter((p) => p && p.w > 0 && p.h > 0).map((p) => p.h / p.w);
  medidas.sort((a, b) => a - b);
  const ratioGuia = medidas.length ? medidas[parseInt((medidas.length - 1) / 2, 10)] : 0;
  const modo = modoLectorEfectivo(r.images.length);
  // Modo inmersivo (v0.4.2): el OJO de la barra esconde la barra de
  // arriba y la de controles de abajo — quedan solo las páginas y un
  // botoncito flotante discreto (el mismo ojo) para traerlas de
  // vuelta. La preferencia vive en el almacén ("lectorInm"), igual
  // que el modo tira/páginas.
  const inm = getJson("lectorInm", 0) ? true : false;
  const pg = state.inputs && typeof state.inputs.pgs === "number" && state.inputs.pgs >= 0
    ? state.inputs.pgs : 0;
  let cuerpo;
  if (modo === "paginas") {
    // Modo páginas (Kino 0.9.81): una página a la vez, se pasa con el
    // dedo, barra fina de progreso de Kino y zoom (pellizco) dentro de
    // cada página. La página en la que se quedó vive en
    // state.inputs.pgs y la guarda el evento pgChanged.
    cuerpo = { type: "pages", key: "pgs", flex: 1, progress: "bar", onPageChanged: "pgChanged",
      children: r.images.map((p, i) => ({ type: "SingleChildScrollView", key: "z" + i, zoom: true,
        children: pageNodes(p, i, ratioGuia, true) })) };
  } else {
    // Tira vertical de siempre: todas las páginas pegadas (gap 0) a
    // ancho completo — fit "width" toma el ancho de la caja y el alto
    // propio de la imagen — y zoom de pellizco en todo el capítulo.
    cuerpo = { type: "SingleChildScrollView", key: scrollKey, flex: 1, zoom: true,
      children: [{ type: "Column", gap: 0, crossAxisAlignment: "center",
        children: r.images.flatMap((p, i) => pageNodes(p, i, ratioGuia)) }] };
  }
  const barraTexto = modo === "paginas"
    ? "v" + VERSION + " · cap. " + (idx + 1) + " de " + chapters.length + " · pág " + (pg + 1)
      + " de " + r.images.length + " · pellizca para acercar"
    : "v" + VERSION + " · cap. " + (idx + 1) + " de " + chapters.length + " · "
      + medidas.length + " pág medidas · mediana " + (Math.round(ratioGuia * 100) / 100)
      + " · pellizca para acercar";
  const body = [
    cuerpo,
    { type: "Row", key: "barraLector", hidden: inm ? true : undefined, gap: 12, padding: 16, mainAxisAlignment: "center", wrap: true, children: [
      { type: "ElevatedButton", icon: "arrow_back", labelText: "Anterior", labelTextEn: "Previous",
        onPressed: "prevChap", enabled: hasPrev },
      { type: "DropdownButton", key: "jumpChap", labelText: "Ir a capítulo", labelTextEn: "Go to chapter",
        value: String(idx), onChanged: "jumpChap",
        options: chapters.length ? chapters.map((c, i) => ({ value: String(i), label: "Capítulo " + c.num })) : [{ value: "0", label: "—" }] },
      { type: "ElevatedButton", labelText: hasNext ? "Siguiente" : "Último capítulo",
        labelTextEn: hasNext ? "Next" : "Last chapter",
        icon: "arrow_forward", onPressed: "nextChap", enabled: hasNext },
    ].concat(pagesDisponible() ? [
      { type: "TextButton", key: "btnModo", labelText: modo === "paginas" ? "Modo tira" : "Modo páginas",
        labelTextEn: modo === "paginas" ? "Strip mode" : "Page mode", onPressed: "modoLector" },
    ] : []).concat([
      { type: "Text", text: barraTexto,
        style: "caption", color: "muted" },
    ]) },
  ];
  // Modo inmersivo: el botoncito flotante (sin etiqueta, discreto)
  // trae las barras de vuelta.
  if (inm) body.push({ type: "FloatingActionButton", key: "verBarras", icon: "visibility",
    tooltip: "Mostrar barras", tooltipEn: "Show bars",
    onPressed: { event: "lectorInm" } });
  const raiz = {
    type: "Scaffold",
    every: (r.pend || 0) > 0 && (r.fallos || 0) < 3 ? { ms: 3000, event: "dimsTick" } : undefined,
    appBar: inm ? undefined : { type: "AppBar", mergeWithKinoBar: true, dense: true, key: "barReader", title: (ch ? "Capítulo " + ch.num : "Leyendo") + " · v" + VERSION,
      leading: { type: "IconButton", key: "backFromReader", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [{ type: "IconButton", key: "verBarra", icon: "visibility",
        labelText: "Modo inmersivo (ocultar barras)", labelTextEn: "Immersive mode (hide bars)",
        onPressed: { event: "lectorInm" } }] },
    body: { type: "Column", children: body },
  };
  return raiz;
}

function searchTree(state) {
  const q = typeof state.resultsQ === "string" ? state.resultsQ : "";
  const results = Array.isArray(state.results) ? state.results : null;
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barSearch", title: "Buscar manga", titleEn: "Search manga", actions: [] },
    body: { type: "SingleChildScrollView", key: "searchBody", children: [{
      type: "Column", children: [
        { type: "Form", key: "search", onSubmitted: "search", gap: 8, padding: 16, children: [
          { type: "TextField", key: "q", kind: "search", value: q,
            labelText: "Título", labelTextEn: "Title",
            hintText: "P. ej. one piece", hintEn: "e.g. one piece",
            required: true },
          { type: "ElevatedButton", icon: "search", labelText: "Buscar", labelTextEn: "Search",
            submit: true },
        ] },
        results
          ? (results.length ? gridOf(results, VACIO_BUSQUEDA) : VACIO_BUSQUEDA)
          : { type: "Text", text: "Escribe un título y pulsa Buscar.",
              textEn: "Type a title and press Search.", color: "muted", padding: 16 },
      ] },
    ] },
  };
}

// ------------------------------------------------------------- los exports

// ------------------------------------------------- catálogo completo
// La página /manga/ del sitio lista TODO el catálogo con filtros
// (?genre=, ?type=, ?status=) y paginación (?page=, 30 series por
// página). Slugs verificados contra el sitio el 1 nov 2026: genre:
// action, adventure, comedy, drama, fantasy, horror, isekai, josei,
// mecha, mystery, psychological, romance, sci-fi, seinen, shoujo,
// shounen, slice-of-life — type: manga, manhwa, manhua — status:
// ongoing, completed. El catálogo tiene 28.312 series: la cuadrícula
// se limita a CAT_TOPE tarjetas porque Kino admite 600 nodos por
// pantalla y cada tarjeta son 5 o 6 nodos.
const GENEROS = [
  ["", "Todos los géneros"],
  ["action", "Acción"], ["adventure", "Aventura"], ["comedy", "Comedia"],
  ["drama", "Drama"], ["fantasy", "Fantasía"], ["horror", "Terror"],
  ["isekai", "Isekai"], ["josei", "Josei"], ["mecha", "Mecha"],
  ["mystery", "Misterio"], ["psychological", "Psicológico"], ["romance", "Romance"],
  ["sci-fi", "Ciencia ficción"], ["seinen", "Seinen"], ["shoujo", "Shoujo"],
  ["shounen", "Shounen"], ["slice-of-life", "Slice of life"],
];
const TIPOS = [["", "Todos"], ["manga", "Manga"], ["manhwa", "Manhwa"], ["manhua", "Manhua"]];
const ESTADOS = [["", "Todos"], ["ongoing", "En emisión"], ["completed", "Finalizado"]];
// Filtros del catálogo de LectorXd (mismos slugs que su extensión de Mihon).
const TIPOS_LX = [["", "Todos"], ["manga", "Manga"], ["manhwa", "Manhwa"], ["manhua", "Manhua"], ["one_shot", "One Shot"]];
const ESTADOS_LX = [["", "Todos"], ["en_emision", "En emisión"], ["completado", "Completado"]];
const ORDEN_LX = [["", "Recientes"], ["rating", "Mejor valorados"], ["views", "Más vistos"]];
// Orden del catálogo de MangaDex (los nombres de orden de su API).
const ORDEN_MD = [["followedCount", "Populares"], ["latestUploadedChapter", "Actualizados"], ["createdAt", "Recién añadidos"]];
// Géneros oficiales de MangaDex (grupo "genre" de su API de tags: el
// uuid se pasa a la API tal cual, el nombre se ve en el desplegable).
const GENEROS_MD = [
  ["391b0423-d847-456f-aff0-8b0cfc03066b", "Acción"], ["87cc87cd-a395-47af-b27a-93258283bbc6", "Aventura"],
  ["4d32cc48-9f00-4cca-9b5a-a839f0764984", "Comedia"], ["5ca48985-9a9d-4bd8-be29-80dc0303db72", "Crimen"],
  ["b9af3a63-f058-46de-a9a0-e0c13906197a", "Drama"], ["39730448-9a5f-48a2-85b0-a70db87b123b", "Demonios"],
  ["ace04997-f6bd-436e-b261-779182193d3d", "Isekai"], ["cdc58593-87dd-415e-bbc0-2ec27bf404cc", "Fantasía"],
  ["cdad7e68-1419-41dd-bdce-27753074a640", "Horror"], ["33771934-028e-4cb3-8744-691e866a923e", "Histórico"],
  ["5920b825-4181-4a17-beeb-9918b0ff7a30", "Boys' Love"], ["a3c67850-4684-404e-9b7f-c69850ee5da6", "Girls' Love"],
  ["81c836c9-914e-4eca-981a-560dad663e73", "Magical Girls"], ["50880a9d-5440-4732-9afb-8f457127e836", "Mecha"],
  ["ee968100-4191-4968-93d3-f82d72be7e46", "Misterio"], ["c8cbe35b-1b2b-4a3f-9c37-db84c4514856", "Médico"],
  ["3b60b75c-a2d7-4860-ab56-05f391bb889c", "Psicológico"], ["b1e97889-25b4-4258-b28b-cd7f4d28ea9b", "Filosófico"],
  ["423e2eae-a7a2-4a8b-ac03-a8351462d71d", "Romance"], ["69964a64-2f90-4d33-beeb-f3ed2875eb4c", "Deportes"],
  ["256c8bd9-4904-4360-bf4f-508a76d67183", "Sci-Fi"], ["e5301a23-ebd9-49dd-a0cb-2add944c7fe9", "Slice of Life"],
  ["7064a261-a137-4d3a-8848-2d385de3a99c", "Superhéroes"], ["07251805-a27e-4d59-b488-f0bfbec15168", "Thriller"],
  ["f8f62932-27da-4fe4-8ee1-6779a8c5edba", "Tragedia"],
];
// Idioma original de MangaDex: manga (Japón), manhwa (Corea), manhua (China).
const TIPOS_MD = [["", "Todos"], ["ja", "Manga (Japón)"], ["ko", "Manhwa (Corea)"], ["zh", "Manhua (China)"]];
const ESTADOS_MD = [["", "Todos"], ["ongoing", "En curso"], ["completed", "Completado"], ["hiatus", "Pausado"], ["cancelled", "Cancelado"]];
// Orden del catálogo de MangaOni (los "filtro" de su directorio).
const ORDEN_MO = [["visitas", "Populares"], ["id", "Novedades"]];
const CAT_POR_PAG = 30;
const CAT_TOPE = 90;
// v0.4.3 — el catálogo guarda hasta CAT_ALMACEN series y enseña una
// ventana de CAT_TOPE: los botones "‹ / ›" mueven la ventana sin
// pedirle nada al sitio y "Cargar más" trae otra página del sitio.
const CAT_ALMACEN = 240;

function catalogoUrlDe(f, cat, page) {
  if (f.id !== "lectorxd") return catalogoUrl(cat, page);
  let p = "/catalogo?filters=true&adult=safe&orderBy=" + (cat.order || "recent") + "&page=" + (page || 1);
  if (cat.type) p += "&types=" + encodeURIComponent(cat.type);
  if (cat.status) p += "&status=" + encodeURIComponent(cat.status);
  return p;
}

function catalogoUrl(cat, page) {
  let p = "/manga/?page=" + (page || 1);
  if (cat.genre) p += "&genre=" + encodeURIComponent(cat.genre);
  if (cat.type) p += "&type=" + encodeURIComponent(cat.type);
  if (cat.status) p += "&status=" + encodeURIComponent(cat.status);
  return p;
}

function catDrop(label, key, opciones, valor, evento) {
  return { type: "DropdownButton", key: key, labelText: label, labelTextEn: label,
    value: valor || "", onChanged: evento,
    options: opciones.map((o) => ({ value: o[0], label: o[1] })) };
}

function catalogTree(c) {
  const f = fuentePorId(c.f || "leercapitulo");
  const todos = Array.isArray(c.items) ? c.items : [];
  const start = Math.max(0, parseInt(c.start, 10) || 0);
  const items = todos.slice(start, start + CAT_TOPE);
  const total = parseInt(String(c.totalTxt || "").replace(/[^0-9]/g, ""), 10) || 0;
  const hayMas = c.mas === undefined || c.mas === null
    ? (todos.length < total)
    : !!c.mas;
  let drops = [];
  if (f.id === "lectorxd") {
    drops = [
      catDrop("Tipo", "catType", TIPOS_LX, c.type, "catType"),
      catDrop("Estado", "catStatus", ESTADOS_LX, c.status, "catStatus"),
      catDrop("Orden", "catOrder", ORDEN_LX, c.order, "catOrder"),
    ];
  } else if (f.id === "mangadex") {
    drops = [
      catDrop("Género", "catGenre", GENEROS_MD, c.genre, "catGenre"),
      catDrop("Tipo", "catType", TIPOS_MD, c.type, "catType"),
      catDrop("Estado", "catStatus", ESTADOS_MD, c.status, "catStatus"),
      catDrop("Orden", "catOrder", ORDEN_MD, c.order, "catOrder"),
    ];
  } else if (f.id === "mangaoni") {
    drops = [catDrop("Orden", "catOrder", ORDEN_MO, c.order, "catOrder")];
  } else if (f.id === "leercapitulo") {
    drops = [
      catDrop("Género", "catGenre", GENEROS, c.genre, "catGenre"),
      catDrop("Tipo", "catType", TIPOS, c.type, "catType"),
      catDrop("Estado", "catStatus", ESTADOS, c.status, "catStatus"),
    ];
  }
  // InManga: catálogo simple, sin filtros (su web no los expone por
  // fuera; su buscador interno no se puede alcanzar desde el plugin).
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barCatalog", title: "Catálogo · " + f.nombre,
      leading: { type: "IconButton", key: "backFromCatalog", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "catBody", children: [{
      type: "Column", children: [
        drops.length ? { type: "Row", gap: 8, padding: 16, wrap: true, children: drops } : null,
        c.totalTxt ? { type: "Text", text: c.totalTxt + " en el catálogo",
          textEn: c.totalTxt + " in catalog", style: "caption", color: "muted", padding: 16 } : null,
        items.length ? gridOf(items, VACIO_SERIES) :
          { type: "Text", text: "Sin resultados con estos filtros.",
            textEn: "No results with these filters.", color: "muted", padding: 16 },
        items.length && (todos.length > CAT_TOPE || start > 0) ?
          { type: "Text", text: "Mostrando " + (start + 1) + "–" + (start + items.length) + " de " +
              (c.totalTxt || todos.length + " series") + ".",
            textEn: "Showing " + (start + 1) + "–" + (start + items.length) + ".",
            style: "caption", color: "muted", padding: 16 } : null,
        start > 0 ? { type: "ElevatedButton", key: "catPrevW", icon: "arrow_back",
          labelText: "‹ Series anteriores", labelTextEn: "Previous series", onPressed: "catPrevW" } : null,
        start + CAT_TOPE < todos.length ? { type: "ElevatedButton", key: "catNextW", icon: "expand_more",
          labelText: "Series siguientes ›", labelTextEn: "Next series", onPressed: "catNextW" } : null,
        hayMas ? { type: "ElevatedButton", key: "catMore", icon: "expand_more",
          labelText: "Cargar más del sitio", labelTextEn: "Load more from site", onPressed: "catMore" } : null,
      ].filter(Boolean) }] },
  };
}

// Carga una página del catálogo con los filtros pedidos y la deja en
// kino.storage ("cat"); la respuesta solo avisa del cambio (catTk)
// para que Kino vuelva a pedir la pantalla, que lee el catálogo del
// almacenamiento — así el estado de la pantalla no crece (Kino admite
// 64 KB de estado y un catálogo de 90 series pesaría 14 KB). Si es
// una página siguiente de los MISMOS filtros, se añade a lo ya
// cargado (botón "Cargar más"); con filtros nuevos empieza de cero.
async function cargarCatalogo(cat, page, conRuta) {
  const f = fuenteActiva();
  const page1 = Math.max(1, parseInt(page, 10) || 1);
  let nuevos = [];
  let totalTxt = "";
  let mas;
  if (f.id === "mangadex") {
    const r2 = await mdCatalog(cat, page1);
    nuevos = r2.items; totalTxt = r2.totalTxt; mas = r2.mas;
  } else if (f.id === "inmanga") {
    const r2 = await imCatalog(page1);
    nuevos = r2.items; mas = r2.mas;
  } else if (f.id === "mangaoni") {
    const r2 = await moCatalog(cat, page1);
    nuevos = r2.items; mas = r2.mas;
  } else {
    const html = await getHtmlDe(f, catalogoUrlDe(f, cat, page1));
    nuevos = cardsDe(f, html, CAT_POR_PAG);
    const tm = html.match(/([\d][\d,]*)\s*series/i);
    const num = tm ? tm[1].replace(/[^0-9]/g, "") : "";
    if (num) totalTxt = num.replace(/(\d)(?=(\d{3})+$)/g, "$1.") + " series";
  }
  const prevCat = page1 > 1 ? getJson("cat", null) : null;
  const prev = prevCat && Array.isArray(prevCat.items) &&
    (prevCat.f || "leercapitulo") === f.id &&
    (prevCat.genre || "") === (cat.genre || "") &&
    (prevCat.type || "") === (cat.type || "") &&
    (prevCat.status || "") === (cat.status || "") &&
    (prevCat.order || "") === (cat.order || "") ? prevCat.items : [];
  if (!totalTxt && prevCat && prevCat.totalTxt) totalTxt = prevCat.totalTxt;
  const vistos = {};
  const items = prev.concat(nuevos)
    .filter((x) => (!vistos[x.url] && (vistos[x.url] = 1)))
    .slice(0, CAT_ALMACEN);
  // Guardia: si una página siguiente no trajo ni una serie nueva (el
  // sitio ignoró el salto o la lista se acabó), no se ofrece otro
  // "Cargar más" en bucle.
  const sinNuevas = page1 > 1 && prev.length && items.length <= prev.length;
  if (sinNuevas) {
    mas = false;
    log("catálogo " + f.nombre + ": la pág. " + page1 + " no trajo series nuevas; fin de la lista");
  }
  if (mas === undefined || mas === null) mas = nuevos.length > 0 && !sinNuevas;
  const capLleno = sinNuevas && nuevos.length > 0 && items.length >= CAT_ALMACEN;
  // v0.4.3 — la ventana salta a lo recién cargado: tras "Cargar más" se
  // ven las últimas CAT_TOPE series y "‹ / ›" recorre las más viejas.
  const start = Math.max(0, items.length - CAT_TOPE);
  // v0.4.4 — con el guardián del almacén; si no se puede guardar, se
  // avisa y NO se abre la pantalla (antes quedaba "cargando" para
  // siempre o el botón "Cargar más" fingía que no pasaba nada).
  const catOk = setJsonCache("cat", { f: f.id, items: items, start: start, page: page1, genre: cat.genre || "",
    type: cat.type || "", status: cat.status || "", order: cat.order || "", totalTxt: totalTxt,
    mas: mas === undefined ? null : mas, lleno: capLleno ? 1 : 0,
    ultimos: page1 > 1 ? Math.max(0, items.length - prev.length) : 0 });
  if (!catOk) return { toast: "El almacén del plugin está lleno: no pude guardar el catálogo." };
  log("catálogo " + f.nombre + " pág. " + page1 + ": +" + nuevos.length + " → " + items.length +
    " series, filtros " + (cat.genre || cat.type || "-") + "/" + (cat.status || "-") + "/" + (cat.order || "-"));
  const resp = { state: { catTk: Date.now() } };
  if (conRuta) resp.route = { push: "catalog" };
  return resp;
}

function routeUrl(r) {
  if (!r) return "";
  return String((r.params && r.params.url) || (r.args && r.args.url) || r.url || "");
}

export async function screen(ev) {
  const state = (ev && ev.state) || {};
  const route = (ev && ev.route) || { name: "home" };
  try {
    if (route.name === "detail") {
      const url = routeUrl(route);
      if (!state.detail || (url && state.detail.url !== url)) return loadingTree("Cargando serie…");
      return detailTree(state);
    }
    if (route.name === "read") return readerTree(state);
    if (route.name === "search") return searchTree(state);
    if (route.name === "catalog") {
      const c = getJson("cat", null);
      if (!c || typeof c !== "object") return loadingTree("Cargando catálogo…");
      return catalogTree(c);
    }
    if (route.name === "anilist") {
      return anilistTree(getJson("al", null));
    }
    if (route.name === "favs") return favsTree();
  } catch (e) {
    log("error en pantalla: " + ((e && e.message) || e));
    return errorTree((e && e.userMessage) ||
      ("No se pudo cargar (" + ((e && e.code) || "error") + ")."));
  }
  const body = await homeTree();
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barHome", title: "MangaTrack",
      actions: [
        { type: "IconButton", icon: "search", key: "goSearch",
          labelText: "Buscar", labelTextEn: "Search", onPressed: { event: "goSearch" } },
      ] },
    body: body,
  };
}

export async function screenEvent(ev) {
  const name = ev.name;
  const state = ev.state || {};
  try {
    if (name === "open") {
      limpiaAlmacen();
      syncPullFavs();
      syncPullHist();
      const r = ev.route || {};
      if (r.name === "detail") {
        const url = routeUrl(r);
        if (url && fuenteDeUrl(url) &&
            (!state.detail || state.detail.url !== url)) {
          return await cargarSerie(url, false);
        }
      }
      if (r.name === "catalog") {
        const c = getJson("cat", null);
        if (!c || typeof c !== "object") return await cargarCatalogo({ genre: "", type: "", status: "" }, 1, false);
      }
      return null;
    }
    if (name === "goSearch") return { route: { push: "search" } };
    if (name === "favsOpen") return { route: { push: "favs" } };
    if (name === "alRetry") {
      // v0.4.4 — reintentar la carga de AniList sin cambiar de pantalla.
      try {
        const r = await alBuscar("", 1, "TRENDING_DESC", false, false);
        if (!r.ok) return { toast: "El almacén del plugin está lleno: no pude cargar AniList." };
        return { state: r.resp.state };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudo conectar con AniList. Inténtalo de nuevo." };
      }
    }
    if (name === "openCatalog") {
      return await cargarCatalogo({ genre: "", type: "", status: "", order: "" }, 1, true);
    }
    if (name === "alOpen") {
      try {
        const r = await alBuscar("", 1, "TRENDING_DESC", true, false);
        // v0.4.4 — si no se pudo guardar, no abrir la pantalla: se
        // quedaría "cargando" para siempre.
        if (!r.ok) return { toast: "El almacén del plugin está lleno: no pude abrir AniList." };
        return r.resp;
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudo conectar con AniList. Inténtalo de nuevo." };
      }
    }
    if (name === "alSearch") {
      const q = String((ev.value && (ev.value.alQ || ev.value.q)) || "").trim();
      if (!q) return { toast: "Escribe un título." };
      const a = getJson("al", null) || {};
      try {
        const r = await alBuscar(q, 1, a.order || "TRENDING_DESC", false, false);
        if (!r.ok) return { toast: "El almacén del plugin está lleno: no pude guardar la búsqueda." };
        return { state: r.resp.state, toast: r.n > 0
          ? r.n + (r.n === 1 ? " resultado en AniList" : " resultados en AniList")
          : "Sin resultados en AniList." };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudo conectar con AniList. Inténtalo de nuevo." };
      }
    }
    if (name === "alOrder") {
      const v = String(ev.value || "");
      const a = getJson("al", null) || {};
      try {
        const r = await alBuscar(a.q || "", 1, v, false, false);
        if (!r.ok) return { toast: "El almacén del plugin está lleno: no pude guardar el orden." };
        return { state: r.resp.state, toast: "Orden cambiado." };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudo conectar con AniList. Inténtalo de nuevo." };
      }
    }
    if (name === "alMore") {
      const a = getJson("al", null);
      if (!a || !Array.isArray(a.items) || !a.items.length) return null;
      if (a.info && a.info.has === false) return { toast: "No hay más resultados en AniList." };
      try {
        const r = await alBuscar(a.q || "", (a.page || 1) + 1, a.order || "TRENDING_DESC", false, true);
        if (!r.ok) return { toast: "El almacén del plugin está lleno: no pude cargar más." };
        return { state: r.resp.state, toast: r.n > 0
          ? "+" + r.n + " series de AniList"
          : "No hay más resultados en AniList." };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudo conectar con AniList. Inténtalo de nuevo." };
      }
    }
    if (name === "alAbrir") {
      const a = getJson("al", null);
      const id = parseInt(String(ev.arg || ""), 10) || 0;
      const m = a && Array.isArray(a.items) ? a.items.filter((x) => x && x.id === id)[0] : null;
      if (!m) return null;
      const tituloAL = alTitulo(m);
      if (!tituloAL) return { toast: "Esa serie no tiene título en AniList." };
      const f = fuenteActiva();
      let results = [];
      if (f.id === "mangadex") results = await mdSearch(tituloAL);
      else if (f.id === "inmanga") results = await imBuscar(tituloAL);
      else if (f.id === "mangaoni") results = await moBuscar(tituloAL);
      else {
        const ruta = f.id === "lectorxd"
          ? "/catalogo?filters=true&adult=safe&orderBy=recent&search=" + encodeURIComponent(tituloAL)
          : "/?s=" + encodeURIComponent(tituloAL);
        const html = await getHtmlDe(f, ruta);
        results = cardsDe(f, html, 30);
      }
      // Vínculo exacto: solo si la fuente tiene la serie con el MISMO
      // título (normalizado) se guardan los ids de AniList/MAL con la
      // clave "alId:<url>": el registro pasa a ser exacto, nunca por
      // parecido.
      let vinculada = "";
      const qAL = normTituloMD(tituloAL);
      if (qAL) {
        for (let i = 0; i < results.length; i++) {
          const it = results[i];
          if (it && it.url && normTituloMD(it.title) === qAL) {
            setJson("alId:" + it.url, { al: m.id, mal: m.mal || 0 });
            vinculada = " · ✓ serie vinculada a AniList";
            break;
          }
        }
      }
      return { state: { results: results, resultsQ: tituloAL },
        route: { push: "search" },
        toast: results.length
          ? results.length + " resultados en " + f.nombre + vinculada
          : "Sin resultados en " + f.nombre + ": prueba con otra fuente." };
    }
    if (name === "fuentePronto") {
      return { toast: String(ev.arg || "Esa fuente") + " está bloqueada por su protección anti-bots: no se puede leer desde Kino." };
    }
    if (name === "fuenteActual") {
      return { toast: "Ya estás viendo " + fuenteActiva().nombre + "." };
    }
    if (name === "cambiarFuente") {
      const f2 = fuentePorId(String(ev.arg || ""));
      if (f2.id === fuenteActiva().id) return { toast: "Ya estás viendo " + f2.nombre + "." };
      setJson("fuente", f2.id);
      return { state: { detail: null, reader: null, results: null, resultsQ: null },
        toast: "Cambiando a " + f2.nombre + "…" };
    }
    if (name === "catGenre" || name === "catType" || name === "catStatus" || name === "catOrder") {
      const c = getJson("cat", {}) || {};
      const nuevo = { genre: c.genre || "", type: c.type || "", status: c.status || "", order: c.order || "" };
      const v = String(ev.value || "");
      if (name === "catGenre") nuevo.genre = v;
      else if (name === "catType") nuevo.type = v;
      else if (name === "catStatus") nuevo.status = v;
      else nuevo.order = v;
      return await cargarCatalogo(nuevo, 1, false);
    }
    if (name === "catMore") {
      const c = getJson("cat", null);
      if (!c || !Array.isArray(c.items) || !c.items.length) {
        return await cargarCatalogo({ genre: "", type: "", status: "", order: "" }, 1, true);
      }
      const antes = c.items.length;
      const r = await cargarCatalogo({ genre: c.genre || "", type: c.type || "", status: c.status || "", order: c.order || "" },
        (c.page || 1) + 1, false);
      const c2 = getJson("cat", null) || {};
      const ahora = Array.isArray(c2.items) ? c2.items.length : 0;
      const nuevosN = Math.max(0, ahora - antes);
      // v0.4.4 — guarda honesta: si la página guardada no avanzó, la
      // escritura falló (almacén lleno) y se avisa en vez de fingir
      // que cargó.
      const falloGuardado = (c2.page || 1) <= (c.page || 1);
      return { state: (r && r.state) || {}, toast: falloGuardado
        ? "El almacén del plugin está lleno: no pude guardar más series."
        : nuevosN > 0
        ? "+" + nuevosN + " series (" + ahora + " en el catálogo)"
        : (c2.lleno ? "Catálogo lleno (" + CAT_ALMACEN + " series): recórrelo con ‹ / ›."
          : "El sitio no trajo series nuevas: fin de la lista.") };
    }
    if (name === "catPrevW" || name === "catNextW") {
      // Ventanas del catálogo: mueven la vista por lo ya cargado, sin
      // pedirle nada al sitio (instantáneo).
      const c = getJson("cat", null);
      if (!c || !Array.isArray(c.items) || !c.items.length) return null;
      const start = Math.max(0, parseInt(c.start, 10) || 0);
      const tope = Math.max(0, c.items.length - CAT_TOPE);
      const ns = name === "catPrevW" ? Math.max(0, start - CAT_TOPE)
        : Math.min(tope, start + CAT_TOPE);
      setJson("cat", Object.assign({}, c, { start: ns }));
      return { state: { catTk: Date.now() } };
    }
    if (name === "popBack") return { route: { pop: true } };
    if (name === "openSeries") {
      const url = String(ev.arg || "");
      if (!fuenteDeUrl(url)) return null;
      return await cargarSerie(url, true);
    }
    if (name === "capsPrev" || name === "capsNext") {
      // Ventanas de capítulos en series largas: la lista completa vive en
      // el almacén; estos botones muestran la ventana anterior (más
      // recientes) o la siguiente (más antiguos).
      const d = state.detail;
      if (!d || !Array.isArray(d.chapters)) return null;
      const full = getJson("caps:" + d.url, null);
      if (!Array.isArray(full) || !full.length) return { toast: "No hay más capítulos de esta serie." };
      const cs = d.capStart || 0;
      let start = 0;
      if (name === "capsPrev") {
        if (cs <= 0) return null;
        start = Math.max(0, cs - VENTANA_CAPS);
      } else {
        start = cs + d.chapters.length;
        if (start >= full.length) return null;
      }
      const caps = full.slice(start, start + VENTANA_CAPS);
      log("capítulos " + (start + 1) + "–" + (start + caps.length) + " de " + full.length);
      return { state: { detail: { url: d.url, meta: d.meta, chapters: caps, capStart: start, capsTotal: full.length } } };
    }
    if (name === "read" || name === "nextChap" || name === "prevChap" || name === "jumpChap" || name === "seguirLeyendo") {
      const d = state.detail;
      if (!d || !Array.isArray(d.chapters) || !d.chapters.length) return null;
      if (name === "seguirLeyendo") {
        // Capítulo por índice ABSOLUTO (botón "Continuar"): si está en
        // otra ventana, se carga su ventana y se abre directo al lector.
        let abs = parseInt(String(ev.arg || ""), 10);
        if (!(abs >= 0)) return null;
        // v0.4.2 — guarda anti-desfase: MangaOni listaba sus capítulos
        // al revés y un índice guardado antes de esta versión puede
        // apuntar a otro capítulo; si no cuadra, manda el número que
        // guardó el historial.
        const hInfo2 = hist()[d.url];
        const hNum = hInfo2 && hInfo2.num;
        if (hNum !== undefined && hNum !== null && String(((d.chapters || [])[abs] || {}).num) !== String(hNum)) {
          const enVentana = (d.chapters || []).findIndex((c) => String(c.num) === String(hNum));
          if (enVentana >= 0) abs = (d.capStart || 0) + enVentana;
          else {
            const fullG = getJson("caps:" + d.url, null);
            const enFull = Array.isArray(fullG) ? fullG.findIndex((c) => String(c.num) === String(hNum)) : -1;
            if (enFull >= 0) abs = enFull;
          }
        }
        const cs = d.capStart || 0;
        let d2 = d;
        if (abs < cs || abs >= cs + d.chapters.length) {
          const full = getJson("caps:" + d.url, null);
          if (!Array.isArray(full) || !full.length || abs >= full.length) {
            return { toast: "No se encontró ese capítulo guardado." };
          }
          let start = Math.floor(abs / VENTANA_CAPS) * VENTANA_CAPS;
          if (start >= full.length) start = Math.max(0, full.length - VENTANA_CAPS);
          d2 = { url: d.url, meta: d.meta, chapters: full.slice(start, start + VENTANA_CAPS), capStart: start, capsTotal: full.length };
        }
        const r = await abrirCapitulo(d2, abs - (d2.capStart || 0), true);
        if (!r) return { toast: "No se pudieron leer las páginas de este capítulo." };
        if (d2 !== d) r.state.detail = d2;
        return r;
      }
      let idx;
      if (name === "read") {
        idx = parseInt(String(ev.arg || "0"), 10) || 0;
      } else if (name === "jumpChap") {
        idx = parseInt(String(ev.value || ""), 10);
        if (!(idx >= 0) || idx >= d.chapters.length) return null;
      } else {
        idx = ((state.reader && state.reader.idx) || 0) + (name === "nextChap" ? 1 : -1);
      }
      if (idx < 0 || idx >= d.chapters.length) return null;
      const r2 = await abrirCapitulo(d, idx, name === "read");
      if (!r2) return { toast: "No se pudieron leer las páginas de este capítulo." };
      return r2;
    }
    if (name === "modoLector") {
      // Cambia entre la tira vertical de siempre y el modo páginas del
      // Kino nuevo (una página a la vez, con la barra de progreso de
      // Kino y zoom en cada página).
      const nuevo = modoLectorPref() === "paginas" ? "tira" : "paginas";
      setJson("modoLector", nuevo);
      const r = state.reader;
      if (!r || !Array.isArray(r.images) || !r.images.length) {
        return { toast: nuevo === "paginas" ? "Modo páginas" : "Modo tira" };
      }
      if (nuevo === "paginas" && (r.images.length < 2 || r.images.length > 250)) {
        return { toast: "Este capítulo no entra en el modo páginas (2 a 250 páginas): se queda en tira." };
      }
      const resp = { state: { reader: { images: r.images, idx: r.idx, tk: Date.now(),
          pend: r.pend || 0, fallos: r.fallos || 0 } },
        toast: nuevo === "paginas" ? "Leyendo por páginas" : "Leyendo en tira" };
      if (nuevo === "paginas") {
        const d = state.detail;
        const ch = d && Array.isArray(d.chapters) ? d.chapters[r.idx || 0] : null;
        let at = ch ? pgLeer(ch.url) : 0;
        at = parseInt(at, 10);
        if (!(at >= 0) || at >= r.images.length) at = 0;
        resp.ui = [{ set: { key: "pgs", value: at } }];
      }
      return resp;
    }
    if (name === "pgChanged") {
      // El pages del Kino nuevo avisa en qué página se quedó: se
      // guarda por capítulo para retomar la próxima vez.
      const r = state.reader;
      const d = state.detail;
      if (!r || !d || !Array.isArray(d.chapters)) return null;
      const ch = d.chapters[r.idx || 0];
      if (!ch) return null;
      const pg = parseInt(String(ev.value), 10);
      if (pg >= 0) pgGuardar(ch.url, pg);
      return null;
    }
    if (name === "search") {
      const q = String((ev.value && ev.value.q) || "").trim();
      if (!q) return { toast: "Escribe un título." };
      const f = fuenteActiva();
      let results = [];
      if (f.id === "mangadex") {
        results = await mdSearch(q);
      } else if (f.id === "inmanga") {
        results = await imBuscar(q);
      } else if (f.id === "mangaoni") {
        results = await moBuscar(q);
      } else {
        const ruta = f.id === "lectorxd"
          ? "/catalogo?filters=true&adult=safe&orderBy=recent&search=" + encodeURIComponent(q)
          : "/?s=" + encodeURIComponent(q);
        const html = await getHtmlDe(f, ruta);
        results = cardsDe(f, html, 30);
      }
      return { state: { results: results, resultsQ: q },
        toast: results.length ? results.length + " resultados" : "Sin resultados" };
    }
    if (name === "dimsTick") {
      const r = state.reader;
      if (!r || !Array.isArray(r.images) || !r.images.length || !(r.pend > 0)) return null;
      const imgs = r.images.map((im) => ({ url: im.url, w: im.w || 0, h: im.h || 0 }));
      const antes = imgs.filter((im) => im.w > 0 && im.h > 0).length;
      await medirImagenes(imgs, 11000);
      const despues = imgs.filter((im) => im.w > 0 && im.h > 0).length;
      let pend = imgs.filter((im) => !(im.w > 0 && im.h > 0)).length;
      const fallos = despues > antes ? 0 : (r.fallos || 0) + 1;
      if (fallos >= 3) pend = 0;
      log("dimsTick: " + pend + " pendientes, fallos " + fallos);
      return { state: { reader: { images: imgs, idx: r.idx, tk: r.tk, pend: pend, fallos: fallos } } };
    }
    if (name === "fav") {
      const d = state.detail;
      if (!d) return null;
      const f = favs();
      const i = f.findIndex((x) => x.url === d.url);
      let added = false;
      if (i >= 0) f.splice(i, 1);
      else {
        f.unshift({ url: d.url, title: (d.meta && d.meta.title) || "",
          poster: (d.meta && d.meta.poster) || "" });
        added = true;
      }
      if (f.length > 100) f.length = 100;
      setJson("favs", f);
      syncPushFavs();
      return { state: { favTk: Date.now() },
        toast: added ? "Añadido a favoritos" : "Quitado de favoritos" };
    }
    if (name === "lectorInm") {
      const ya = getJson("lectorInm", 0);
      setJson("lectorInm", ya ? 0 : 1);
      return { state: { inmTk: Date.now() },
        toast: ya ? "Barras visibles de nuevo." : "Modo inmersivo: el botón flotante trae las barras de vuelta." };
    }
    if (name === "retry") return { state: { _r: Date.now() } };
    return null;
  } catch (e) {
    log("error en evento " + name + ": " + ((e && e.message) || e));
    // Si el fallo traía un mensaje para la persona (bloqueo +18, HTTP,
    // conexión rechazada), ese mensaje gana al genérico: antes se
    // perdía aquí y la persona solo veía "Algo falló".
    const um = (e && e.userMessage) || "";
    if (um) return { toast: um };
    return { toast: "Algo falló (" + ((e && e.code) || "error") + ")." };
  }
}

// ---------------------------------------------------------------- v0.4.4
// Mis favoritos: cuadrícula con el nombre de la fuente debajo (antes
// eran una tira horizontal apretada) y pantalla completa para verlos
// todos cuando son más de 12.
function favCard(it) {
  const titulo = String(it.title || "");
  const fSer = fuenteDeUrl(it.url);
  return {
    type: "Card", key: serieKey("f-", it.url), flush: true,
    onTap: { event: "openSeries", arg: it.url },
    children: [{ type: "Image", url: it.poster || "", aspect: "2:3", alt: titulo, altEn: titulo,
        fallback: { type: "Column", padding: 16, crossAxisAlignment: "center",
          children: [{ type: "Icon", name: "list", color: "muted" }] } }]
      .concat(twoLines(titulo).map(function (ln) {
        return { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 };
      }))
      .concat([{ type: "Text", text: (fSer && fSer.nombre) || "",
        textEn: (fSer && fSer.nombre) || "", style: "caption", color: "muted", padding: 8 }]),
  };
}

function favsTree() {
  const mf = favs();
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barFavs", title: "Mis favoritos (" + mf.length + ")",
      leading: { type: "IconButton", key: "backFromFavs", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "favsBody", children: [{ type: "Column", children: [
      mf.length
        ? { type: "ListView", key: "gridFavsT", columns: { compact: 3, medium: 4, expanded: 6 },
            items: mf.map(function (it) { return favCard(it); }) }
        : { type: "Column", children: [
            { type: "emptyState", icon: "list", title: "Sin favoritos todavía.", titleEn: "No favourites yet." },
            { type: "Text", text: "Abre una serie y toca el corazón para guardarla aquí.",
              textEn: "Open a series and tap the heart to save it here.",
              style: "caption", color: "muted", padding: 16 },
          ] },
    ] }] },
  };
}

// ---------------------------------------------------------------- AniList
// v0.4.3 — sección AniList: su catálogo sirve para DESCUBRIR manga
// (tendencia, populares, mejor valorados, A-Z o por búsqueda). AniList
// no aloja capítulos: al tocar una serie se busca su título en la
// fuente activa y, si el título coincide exacto, la serie queda
// vinculada con los ids de AniList/MAL (clave "alId:<url>") para que
// el registro de capítulos sea exacto. Ante la duda no se vincula
// nada: nunca se marca una serie equivocada.

const ANI_POR_PAG = 20;
const ANI_TOPE = 60;
const AL_ORDEN = [["TRENDING_DESC", "Tendencia"], ["POPULARITY_DESC", "Populares"],
  ["SCORE_DESC", "Mejor valorados"], ["TITLE_ROMAJI_ASC", "A → Z"]];

const AL_QUERY = "query ($p: Int, $s: String, $sort: [MediaSort]) { Page(page: $p, perPage: " + ANI_POR_PAG + ") " +
  "{ pageInfo { hasNextPage } media(type: MANGA, isAdult: false, search: $s, sort: $sort) " +
  "{ id idMal title { romaji english } coverImage { extraLarge } format chapters averageScore } } }";

async function alJson(q, page, sort) {
  const r = await kino.fetch("https://graphql.anilist.co", { method: "POST",
    body: { json: { query: AL_QUERY, variables: { p: page, s: q || null, sort: [sort] } } } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con AniList. Inténtalo de nuevo.",
  });
  return await r.json();
}

function alItemsDe(j) {
  const media = (j && j.data && j.data.Page && j.data.Page.media) || [];
  return media.map((m) => {
    const t = (m && m.title) || {};
    return {
      id: m.id, mal: m.idMal || 0,
      romaji: String(t.romaji || ""), english: String(t.english || ""),
      cover: ((m.coverImage && m.coverImage.extraLarge) || ""),
      nota: typeof m.averageScore === "number" ? m.averageScore : null,
      formato: String(m.format || ""), caps: (typeof m.chapters === "number" && m.chapters) || 0,
    };
  });
}

function alTitulo(m) { return m.english || m.romaji || ""; }

function alCard(m) {
  const titulo = alTitulo(m);
  const fmt = { MANGA: "Manga", NOVEL: "Novela", ONE_SHOT: "One-shot" }[m.formato] || m.formato;
  const notaTxt = m.nota === null ? "-" : (m.nota / 10).toFixed(1);
  return { type: "Card", key: "al-" + m.id, flush: true,
    onTap: { event: "alAbrir", arg: String(m.id) },
    children: [
      { type: "Image", url: m.cover, aspect: "2:3", alt: titulo, altEn: titulo,
        fallback: { type: "Column", padding: 16, crossAxisAlignment: "center",
          children: [{ type: "Icon", name: "list", color: "muted" }] } },
    ].concat(twoLines(titulo).map((ln) => (
      { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 })))
      .concat([{ type: "Text",
        text: "★ " + notaTxt + " · " + fmt + (m.caps ? " · " + m.caps + " caps" : ""),
        textEn: "★ " + notaTxt + " · " + fmt + (m.caps ? " · " + m.caps + " ch." : ""),
        style: "caption", color: "muted", padding: 8 }]),
  };
}

function anilistTree(a) {
  if (!a || typeof a !== "object" || !Array.isArray(a.items)) {
    // v0.4.4 — si la carga falla, no girar para siempre: botón para
    // reintentar.
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "CircularProgressIndicator" },
      { type: "Text", text: "Cargando AniList…", textEn: "Loading AniList…", color: "muted" },
      { type: "ElevatedButton", key: "alRetry", icon: "refresh",
        labelText: "Reintentar", labelTextEn: "Retry", onPressed: "alRetry" },
    ] };
  }
  const hasNext = !!(a.info && a.info.has);
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barAnilist",
      title: "AniList · " + (a.q ? "«" + a.q + "»" : (a.ordTxt || "Tendencia")),
      leading: { type: "IconButton", key: "backFromAnilist", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "alBody", children: [{
      type: "Column", children: [
        { type: "Text", text: "Descubre manga en AniList y tócalo para buscarlo en " + fuenteActiva().nombre + ".",
          textEn: "Discover manga on AniList and tap to search your source.",
          style: "caption", color: "muted", padding: 16 },
        { type: "Form", key: "alForm", onSubmitted: "alSearch", gap: 8, padding: 16, children: [
          { type: "TextField", key: "alQ", kind: "search", value: a.q || "",
            labelText: "Título en AniList", labelTextEn: "AniList title",
            hintText: "P. ej. one piece", hintEn: "e.g. one piece" },
          { type: "ElevatedButton", icon: "search", labelText: "Buscar", labelTextEn: "Search", submit: true },
        ] },
        { type: "Row", gap: 8, padding: 16, children: [
          catDrop("Ordenar", "alOrder", AL_ORDEN, a.order, "alOrder"),
        ] },
        a.items.length ? { type: "ListView", key: "alGrid",
          columns: { compact: 3, medium: 4, expanded: 6 },
          items: a.items.map((m) => alCard(m)) } :
          { type: "Text", text: "Sin resultados en AniList.", textEn: "No AniList results.",
            color: "muted", padding: 16 },
        hasNext ? { type: "ElevatedButton", key: "alMore", icon: "expand_more",
          labelText: "Cargar más", labelTextEn: "Load more", onPressed: "alMore" } : null,
      ].filter(Boolean) }] },
  };
}

async function alBuscar(q, page, order, conRuta, anadir) {
  const ord = order || "TRENDING_DESC";
  const prev = anadir ? (getJson("al", null) || {}) : {};
  const prevItems = Array.isArray(prev.items) ? prev.items : [];
  const page1 = Math.max(1, parseInt(page, 10) || 1);
  const j = await alJson(q, page1, ord);
  const nuevos = alItemsDe(j);
  const vistos = {};
  const items = prevItems.concat(nuevos)
    .filter((x) => (x && !vistos[x.id] && (vistos[x.id] = 1)))
    .slice(0, ANI_TOPE);
  let ordTxt = "";
  for (let i = 0; i < AL_ORDEN.length; i++) if (AL_ORDEN[i][0] === ord) ordTxt = AL_ORDEN[i][1];
  // v0.4.4 — con el guardián: si no se puede guardar, se avisa al
  // llamador para que NO abra la pantalla (nada de "cargando" eterno).
  const alOk = setJsonCache("al", { items: items, q: q || "", page: page1, order: ord, ordTxt: ordTxt,
    info: { has: !!(j && j.data && j.data.Page && j.data.Page.pageInfo && j.data.Page.pageInfo.hasNextPage) } });
  const resp = { state: { alTk: Date.now() } };
  if (conRuta) resp.route = { push: "anilist" };
  return { resp: resp, n: nuevos.length, ok: alOk };
}

// v0.4.2 — Título normalizado para comparar (minúsculas, sin
// acentos, solo letras y números): el mismo criterio que usa
// AniTrack para emparejar series.
function normTituloMD(s) {
  const conA = "áàäâãéèëêíìïîóòöôõúùüûñç";
  const sinA = "aaaaaeeeeiiiiooooouuuunc";
  const t = String(s || "").toLowerCase();
  let out = "";
  for (let i = 0; i < t.length; i++) {
    const j = conA.indexOf(t[i]);
    out += j >= 0 ? sinA[j] : t[i];
  }
  return out.replace(/[^a-z0-9]+/g, " ").trim();
}

// Busca en MangaDex (por título, en cualquier idioma — guarda
// títulos en español) los ids de AniList y MAL de una serie, y los
// guarda en el almacén para no repetir la búsqueda. Solo devuelve ids
// si el parecido es claro: ante la duda, nada — AniTrack seguirá con
// su búsqueda por título, como siempre, y nunca se marca una serie
// equivocada.
async function idsPorTitulo(titulo) {
  const clave = "idsMd:" + titulo.slice(0, 80);
  const cache = getJson(clave, null);
  if (cache && (cache.al || cache.mal)) return cache;
  if (cache && cache.fallo && Date.now() - cache.fallo < 6 * 3600000) return null;
  try {
    const j = await mdJson("/manga?limit=5&title=" + encodeURIComponent(titulo)
      + "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica");
    const datos = (j && j.data) || [];
    const q = normTituloMD(titulo);
    if (!q) return null;
    let mejor = null, mejorP = 0, empate = false;
    for (let i = 0; i < datos.length; i++) {
      const m = datos[i];
      if (!m || !m.attributes) continue;
      const a = m.attributes;
      const nombres = Object.keys(a.title || {}).map((k) => a.title[k])
        .concat((a.altTitles || []).map((o) => o && Object.keys(o).length ? o[Object.keys(o)[0]] : ""));
      let p = 0;
      for (let t = 0; t < nombres.length; t++) {
        const nt = normTituloMD(nombres[t]);
        if (!nt) continue;
        if (nt === q) { p = 3; break; }
        if (nt.length >= 10 && q.length >= 10 && (nt.indexOf(q) >= 0 || q.indexOf(nt) >= 0)) p = Math.max(p, 2);
      }
      if (p > mejorP) { mejorP = p; mejor = m; empate = false; }
      else if (p > 0 && p === mejorP) empate = true;
    }
    if (mejor && mejorP >= 2 && !empate) {
      const Lk = (mejor.attributes && mejor.attributes.links) || {};
      const idDe = (v) => { const mm = String(v || "").match(/(\d+)\D*$/); return mm ? parseInt(mm[1], 10) : 0; };
      const ids = { al: idDe(Lk.al), mal: idDe(Lk.mal) };
      if (ids.al || ids.mal) {
        setJson(clave, ids);
        log("ids de MangaDex para «" + titulo.slice(0, 40) + "»: al " + ids.al + ", mal " + ids.mal);
        return ids;
      }
    }
    setJson(clave, { fallo: Date.now() });
  } catch (e) {
    log("ids MangaDex: " + ((e && e.message) || e));
  }
  return null;
}

// Aviso de progreso a AniTrack por la puerta "manga" del protocolo
// entre plugins (Kino 0.9.81+; MangaTrack declara la puerta en
// enhancements["20"], invisible para los Kino viejos). Cada capítulo
// que abre la persona se le cuenta a AniTrack, que lo busca en
// AniList/MAL y lo marca en las listas. Si AniTrack no está o el Kino
// es anterior, no pasa nada: queda en el registro y el capítulo abre
// igual.
function avisarAnitrack(d, ch, fSer) {
  try {
    if (typeof kino.plugins !== "object" || !kino.plugins) return Promise.resolve(null);
    const titulo = ((d && d.meta && d.meta.title) || "").trim();
    const num = parseFloat(ch && ch.num);
    if (!titulo || !isFinite(num)) return Promise.resolve(null);
    const arg = { title: titulo.slice(0, 200), chapter: num, source: (fSer && fSer.id) || "" };
    if (d.meta.anilistId) arg.anilistId = d.meta.anilistId;
    if (d.meta.malId) arg.malId = d.meta.malId;
    // v0.4.3 — vínculo AniList: si esta serie se vinculó desde la
    // sección de AniList, sus ids son exactos y no hace falta buscar
    // por título (prioridad: ids de la serie > vínculo > búsqueda).
    if (!arg.anilistId && !arg.malId) {
      const alV = getJson("alId:" + ((d && d.url) || ""), null);
      if (alV && (alV.al || alV.mal)) {
        if (alV.al) arg.anilistId = alV.al;
        if (alV.mal) arg.malId = alV.mal;
      }
    }
    // v0.4.2 — rescate de títulos en español: si la serie no viene de
    // MangaDex (sin ids), se buscan sus ids en MangaDex POR TÍTULO —
    // MangaDex guarda títulos en español (altTitles) y publica los
    // enlaces exactos a AniList y MAL de cada serie. Con esos ids el
    // registro es exacto, no un parecido de título.
    const idsP = (arg.anilistId || arg.malId) ? Promise.resolve(null) : idsPorTitulo(titulo);
    return idsP
      .then(function (ids) {
        if (ids && ids.al) arg.anilistId = ids.al;
        if (ids && ids.mal) arg.malId = ids.mal;
        return kino.plugins.call("anitrack", "markChapter", arg);
      })
      .then(function (r) {
        if (!r || r.marked !== true) {
          const motivo = (r && r.reason) || "";
          if (motivo === "sin-sesion") return "AniTrack no tiene sesión: entra a sus Ajustes e inicia sesión para registrar lo que lees.";
          if (motivo === "no-encontrada") return "AniTrack no encontró «" + titulo.slice(0, 60) + "» en AniList ni en MAL: este capítulo no se marcó.";
          if (motivo) return "AniTrack no registró el capítulo (" + motivo + ").";
          return null;
        }
        if (r.dup) return null;   // ya estaba (releído o más adelante): silencio
        return "✓ Cap. " + num + " de «" + String(r.title || titulo).slice(0, 40) + "» registrado en " + (r.where || "AniList") + ".";
      })
      .catch(function (e) {
        const code = (e && e.code) || "";
        log("anitrack " + code + ": " + ((e && e.message) || e));
        if (code === "provider_missing" && !getJson("avisoAnitrackFalta", 0)) {
          setJson("avisoAnitrackFalta", 1);
          return "AniTrack no está instalado o está apagado: el capítulo no quedó registrado en tus listas.";
        }
        return null;
      });
  } catch (e) {
    log("anitrack aviso: " + ((e && e.message) || e));
    return Promise.resolve(null);
  }
}

// Abre en el lector el capítulo idx de la ventana actual del detalle:
// descarga las páginas, las mide y guarda el historial con su índice
// ABSOLUTO (capStart + idx) para que "Continuar" y las marcas ✓
// funcionen sin importar desde qué ventana se leyó.
async function abrirCapitulo(d, idx, conRuta) {
  const ch = d.chapters[idx];
  const fSer = fuenteDeUrl(d.url) || fuenteActiva();
  // El registro en AniList/MAL corre en PARALELO con la descarga de las
  // páginas: se dispara ya y se recoge al final, así el capítulo no
  // espera por él.
  const avisoAnitrack = avisarAnitrack(d, ch, fSer);
  let images = [];
  if (fSer.id === "mangadex") {
    images = await mdImages(ch.url);
  } else if (fSer.id === "inmanga") {
    images = await imImages(ch.url);
  } else if (fSer.id === "manhwaweb") {
    images = await mwImages(ch.url);
  } else {
    const html = await getHtmlDe(fSer, ch.url);
    images = readerImagesDe(fSer, html);
  }
  if (!images.length) return null;
  images = images.map((x) => (typeof x === "string" ? { url: x } : x));
  await medirImagenes(images, 9000);
  const pend = images.filter((im) => !(im.w > 0 && im.h > 0)).length;
  log("capítulo " + ch.num + " listo: " + images.length + " páginas, " + pend + " sin medir");
  // Historial: el último capítulo abierto de la serie (para
  // "Seguir leyendo", el botón "Continuar" y las marcas de leído).
  const h = hist();
  h[d.url] = { url: ch.url, num: ch.num, idx: (d.capStart || 0) + idx, ts: Date.now(),
    title: (d.meta && d.meta.title) || "", poster: (d.meta && d.meta.poster) || "" };
  const hk = Object.keys(h);
  if (hk.length > 100) { hk.sort((a, b) => (h[b].ts || 0) - (h[a].ts || 0));
    for (let i = 100; i < hk.length; i++) delete h[hk[i]]; }
  setJson("hist", h);
  syncPushHist();
  const resp = { state: { reader: { images: images, idx: idx, tk: Date.now(), pend: pend, fallos: 0 } } };
  if (conRuta) resp.route = { push: "read" };
  // Modo páginas (Kino 0.9.81): retomar donde se quedó (la receta del
  // lector de la docs: un `set` de ui sobre la key del pages en la
  // respuesta que abre el capítulo).
  if (modoLectorEfectivo(images.length) === "paginas") {
    let at = pgLeer(ch.url);
    at = parseInt(at, 10);
    if (!(at >= 0) || at >= images.length) at = 0;
    resp.ui = [{ set: { key: "pgs", value: at } }];
    log("modo páginas: retomando en la pág " + (at + 1));
  }
  // Recoge el aviso de AniTrack (venía corriendo en paralelo): si hay
  // algo que decir, viaja como toast del capítulo recién abierto.
  try {
    const aviso = await avisoAnitrack;
    if (aviso) resp.toast = aviso;
  } catch (e) { log("anitrack aviso: " + ((e && e.message) || e)); }
  return resp;
}

// Carga la página de una serie y prepara su detalle; si conRuta, empuja la
// pantalla de la serie al terminar.
async function cargarSerie(url, conRuta) {
  const f = fuenteDeUrl(url);
  if (!f) return { toast: "Esa serie no es de ninguna fuente conocida." };
  let meta;
  let full = null;   // lista COMPLETA (asc: del capítulo 1 al más nuevo), hasta 1200
  if (f.id === "mangadex") {
    const id = url.replace(/^[/]title[/]/, "").replace(/[/]$/, "");
    meta = await mdMeta(id);
    const allCaps = await mdCaps(id);
    meta.totalCaps = allCaps.length;
    full = allCaps.slice(0, TOPE_CAPS_SERIE).slice().reverse();
  } else if (f.id === "inmanga") {
    const s = await imSerie(url);
    meta = s.meta;
    meta.totalCaps = s.chapters.length;
    full = s.chapters.slice(0, TOPE_CAPS_SERIE).slice().reverse();
  } else if (f.id === "mangaoni") {
    const s = await moSerie(url);
    meta = s.meta;
    meta.totalCaps = s.chapters.length;
    // v0.4.2 — MangaOni venía al revés (del capítulo más nuevo al 1):
    // con el volteo queda en el orden ascendente común y "Empezar a
    // leer" abre el capítulo 1, no el último.
    full = s.chapters.slice(0, TOPE_CAPS_SERIE).slice().reverse();
  } else {
    const html = await getHtmlDe(f, url);
    if (f.id === "lectorxd") {
    // El +18 de LectorXd sin cuenta: la página viene con un aviso de
    // "Contenido para Adultos" y no trae la lista de capítulos.
    if (/contenido para adultos/i.test(html) && /cambiar tus preferencias/i.test(html)) {
      log("LX serie +18 cerrada: " + url);
      return { toast: "Esta serie es +18: LectorXd la bloquea sin cuenta. Prueba otra." };
    }
    meta = metaLX(html);
    const allCaps = capsLX(html);
    meta.totalCaps = allCaps.length;
    full = allCaps.slice(0, TOPE_CAPS_SERIE).slice().reverse();
  } else {
    meta = seriesMeta(html);
    const allCaps = chapterList(html);
    meta.totalCaps = allCaps.length;
    full = allCaps.slice(0, TOPE_CAPS_SERIE).slice().reverse();
  }
  }
  // El detalle solo enseña la primera ventana (VENTANA_CAPS); la lista
  // completa se guarda en el almacén para que los botones "más
  // antiguos/recientes" puedan pasar de ventana sin inflar el estado.
  const chapters = full.slice(0, VENTANA_CAPS);
  let capsTotal = full.length;
  if (full.length > chapters.length) {
    try { if (!setJsonCache("caps:" + url, full)) log("caps sin guardar: almacén lleno"); } catch (e) { log("caps sin guardar: " + e); }
  }
  log("serie lista (" + f.nombre + "): " + meta.title + " / " + chapters.length + " de " + capsTotal + " capítulos");
  // Con 0 capítulos también se abre el detalle: ahí explica por qué
  // (serie +18, licenciada o enlaces externos) en vez de un toast seco.
  const resp = { state: { detail: { url: url, meta: meta, chapters: chapters, capStart: 0, capsTotal: capsTotal } } };
  if (conRuta) resp.route = { push: "detail", params: { url: url } };
  return resp;
}

