// MangaTrack v0.4.13 — lector de mangas para Kino con pantalla propia.
// v0.4.13 — entra Mangas.in (m440.in): otra fuente en español con su
// propio quiste: la lista de capítulos NO viene en la página, llega
// CIFRADA (AES, la receta de CryptoJS) y la llave vive en un script
// del sitio que va cambiando. El plugin descifra la lista dentro de
// sí mismo (AES a mano, sin depender de nada del entorno), con la
// llave conocida, la guardada y, si el sitio la cambia, candidatas
// probadas una a una contra el mensaje cifrado: solo la correcta
// produce una lista válida, así nunca se inventa un capítulo. El
// resto es igual que las demás fuentes: catálogo, buscador (JSON
// propio del sitio), lector (con sus imágenes escondidas en base64
// destapadas) y la galleta de acceso de la ventanita anti-revisión,
// con llave propia para esta fuente.
// v0.4.14 — Mangas.in afinado a la luz de la prueba real: la lista
// cifrada de capítulos mide MILES de caracteres y el rastreo la
// buscaba dentro de una ventana corta (nunca daba con ella: el
// «bloque ausente» del Registro); ahora la página entera se rastrea
// por sus marcas. El buscador lee la lista plana que el sitio
// devuelve, el catálogo y la portada van con la dirección limpia (la
// de antes, con huecos vacíos, le olía a robot al sitio y contestaba
// con su revisión), y entre las dos preguntas de la portada media una
// pausa corta. El aviso cuando una lista no se abre ahora DISTINGUE:
// llave cambiada (se renueva) o revisión del sitio pidiendo paso. Y el
// destapador quedó comprobado contra los vectores oficiales del
// estándar de cifrado, número por número.
// v0.4.15 — el lector de Mangas.in abre de verdad: las imágenes de los
// capítulos vienen a veces con comillas simples (invisibles para el
// rastreo de antes: de ahí el «1 página» que no cargaba), la dirección
// falsa «https://<base64>» de los capítulos viejos se destapa ahora
// del todo (antes quedaba a medias y la página moría), el loading.gif
// del tema ya no se cuela por página y la dirección de datos (data-src)
// manda sobre la de relleno (src). El título de la serie sale de la
// cabecera del tema (.listmanga-header / .widget-title, el orden que
// dicta el tema oficial): el respaldo genérico de antes agarraba el
// logo del sitio («M440.in» como título de TODAS las series). La
// portada prefiere la imagen que el tema guarda en /cover/. Y cuando
// el sitio contesta con su revisión (403) al catálogo por visitas,
// las mismas tarjetas se sirven del catálogo público de siempre
// (/manga-list, la página enlazada en el propio sitio).
// v0.4.20 — la séptima prueba dejó el diagnóstico cerrado: las páginas
// de Mangas.in bajan todas cuando quien las pide se presenta (26/26,
// 38/38, 57/57 medidas) y el sitio las NIEGA al pedido sin
// presentación («HTTP 403 la niega»); el pintor de imágenes de Kino
// no puede presentarse → lector en blanco sin remedio desde el
// plugin (la solución de verdad es de Kino y ya está pedida en el
// repositorio oficial). Mientras eso llega, «leer en ventanita»: el
// lector de Mangas.in muestra el capítulo en la ventanita de
// navegador del propio sitio (el navegador SÍ se presenta y las
// imágenes se ven). El botón vive en la barra del lector y en la
// nota honesta de arriba; abre el capítulo ya cargado y espera
// hasta que la persona cierre (10 minutos por ventana).
// v0.4.19 — la sexta prueba real trajo la primera victoria grande: la
// ventana de rescate abrió el catálogo bloqueado, la revisión se pasó,
// la galleta llegó («galletas cf_clearance, html 108472 chars») y el
// catálogo se llenó con 30 series de verdad; las populares salieron de
// la portada del sitio sin ventanita ninguna. Pero el Registro enseñó
// dos cosas más: la galleta ganada NO abre las listas en las peticiones
// del plugin (el sitio la amarra a algo más que al disfraz del
// navegador — cada portada repetía los seis intentos fallidos), y el
// catálogo rescatado no se guardaba (cada entrada empezaba de cero).
// Ahora el catálogo rescatado vive 30 minutos en el almacén, la galleta
// «inútil» se recuerda una hora (sin reintentos vanos: directo a la
// caché, a la portada o a la ventanita), y una vez por hora el plugin
// pregunta al sitio si sus imágenes se sirven a un pedido SIN
// presentarse — la prueba que separa «el sitio niega la imagen al
// pintor de Kino» de cualquier otra causa del lector en blanco.
// v0.4.18 — la quinta prueba enseñó dónde vive el candado y dónde no:
// la ventanita de v0.4.17 cargó la portada del sitio COMPLETA (portadas
// y todo, sin pedir revisión) y no dejó galleta ninguna — en la portada
// no hay revisión que pasar; los 403 viven solo en las dos páginas de
// listas. Así que la ventanita abre ahora LA PÁGINA BLOQUEADA (el
// catálogo), con dos redes: si allí el sitio pide su revisión, la galleta
// llega; y venga o no, Kino entrega el HTML de la página cargada y las
// tarjetas se leen de él. Además la portada del sitio trae su propia
// sección de populares: se lee primero, sin ventanita, con caché de
// media hora para no repetir intentos en vano.
// v0.4.17 — la cuarta prueba real trajo dos verdades. La buena: las
// imágenes SÍ bajan cuando se piden con cara de navegador («Little
// Bully»: 26 de 26 páginas medidas). La amarga: Kino las mide bien
// pero al DIBUJARLAS no puede presentarse ante el sitio (su pintor de
// imágenes no manda Referer) y el sitio las niega: páginas en blanco.
// Y la ventanita de la revisión no apareció porque Kino solo la abre
// cuando la PERSONA toca algo, nunca en una carga de fondo como la
// portada. Esta versión pone la ventanita al alcance del dedo: si las
// populares vienen bloqueadas, la portada muestra un botón «Mangas.in
// pide su revisión» que abre la ventanita (toque de la persona:
// contexto legal), pasa la revisión una vez y recarga. El Registro
// cuenta ahora el porqué de CADA imagen que no baje (de cualquier
// casa, no solo las de Mangas.in) y en qué casa vive cada página del
// lector. Y si un capítulo de Mangas.in llega sin ninguna página
// entregada, el lector lo DICE en vez de mostrar un silencio blanco.
// v0.4.16 — la receta de LectorXd (v0.4.9) llega a Mangas.in: cuando el
// sitio le cierra la puerta a esta conexión en sus páginas de listas
// (el 403 del catálogo y de las populares en la prueba real), Kino abre
// su ventanita de navegador para pasar la revisión una vez y las
// peticiones viajan desde entonces con esa galleta de acceso. Y las
// imágenes de los capítulos, que el sitio no entregaba ni para medirlas,
// se piden ahora con cara de navegador (Referer de la casa, disfraz
// móvil y la galleta si ya se ganó) y, si alguna no baja, el Registro
// anota el PORQUÉ (permiso, 403, conexión…) y en qué casa vive: así se
// afina con datos y no con adivinanzas.
// v0.4.12 — vincular a mano: los títulos de traductor no se acaban
// nunca (cada serie nueva trae el suyo), así que el toque en una
// serie de AniList abre una pantalla de vinculación: se elige la
// fuente, se busca con el título en español TAL COMO LO MUESTRA esa
// fuente y al tocar la serie correcta queda vinculada para siempre
// con los ids exactos de AniList y MAL. Y el buscador de LectorXd
// deja de esconder las series +18: sin el filtro «adulto seguro» el
// catálogo las entrega y se pueden encontrar, leer y vincular.
// v0.4.11 — títulos de traductor: las fuentes en español bautizan sus
// series a su manera («La Academia está condenada») y ese nombre no
// existe en AniList ni en MAL, aunque la serie sí esté allí con su
// nombre original. Ahora el aviso a AniTrack consulta un mapa de
// equivalencias verificado a mano (solo ids comprobados, serie por
// serie) antes de buscar por título; y las series +18 también se
// buscan en MangaDex, que las guarda aparte pero con los mismos
// enlaces exactos a los catálogos.
// v0.4.10 — el catálogo y el buscador de LectorXd sirven sus tarjetas en
// una cuadrícula propia ("manga-grid", el marcado que leen las demás
// apps del sitio): ahora también se leen así, con el cierre de cada
// enlace respetado y el título aceptado en cualquier encabezado. Si la
// página no trajera ni eso, el registro anota qué encontró, para afinar
// con datos y no con adivinanzas. Y el aviso a AniTrack gana una segunda
// oportunidad: los títulos con adornos «(Sin Censura)» se reintentan sin
// el adorno en MangaDex, que los guarda limpios.
// v0.4.9 — cuando LectorXd le cierra la puerta a la conexión de la
// persona (el 403 que no se va; la portada carga porque la sirve la
// caché del propio filtro), Kino abre una ventanita de navegador real
// sobre el sitio: la revisión se pasa una vez y la galleta de acceso
// viaja desde entonces con cada petición, junto con el disfraz exacto
// del navegador que la ganó (Cloudflare las amarra juntas).
// v0.4.8 — el +18 de LectorXd es un aviso tapado: sin sesión el sitio ya
// entrega la lista de capítulos y las páginas debajo del aviso (verificado
// en una serie +18 real), y ahora el plugin las lee como hacen otras apps.
// v0.4.7 — el filtro anti-bots de LectorXd y MangaOni entra y sale: las
// peticiones ahora se reintentan (otro disfraz de navegador, la dirección
// www del sitio y una pequeña espera entre intentos) antes de rendirse.
// Fuentes: LeerCapitulo, LectorXd, MangaDex, InManga y MangaOni.
// Requiere Kino 0.9.74 o superior (apiVersion 14, capability "screen").
// Lector nuevo para Kino 0.9.81: páginas a ancho completo sin recortes
// (Image fit "width" + aspect de la proporción medida) y modo páginas
// (widget pages, de 2 a 250, con barra de progreso y zoom por página).
// Las dos son aditivas: un Kino más antiguo lo ignora y sigue con la
// tira vertical de siempre, sin queja ni rechazo.

const VERSION = "0.4.20";
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
  { id: "mangasin", nombre: "Mangas.in", base: "https://m440.in" },
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
  // Mangas.in: sus series se guardan con el prefijo /ms para no
  // chocar con las /manga/<slug>/ de LectorXd y LeerCapitulo.
  if (/^[/]ms[/]manga[/][a-z0-9-]+(?:[/][a-z0-9-]+)?[/]?$/.test(u)) return fuentePorId("mangasin");
  return null;
}

// ------------------------------------------------------------------ red

// Disfraces de navegador: LectorXd atiende mejor a un celular y MangaOni
// a un escritorio; cuando el filtro anti-bots se activa, el reintento los
// intercambia para darle al sitio otra cara distinta.
const UA_MOVIL = "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const UA_ESCRITORIO = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function getHtmlDe(f, path) {
  // Cloudflare (LectorXd y MangaOni) rechaza peticiones sin User-Agent:
  // se envían cabeceras de navegador para que no las confunda con bots
  // (receta verificada en la app de escritorio KageView, que lee ambos).
  const esNube = f.id === "lectorxd" || f.id === "mangaoni" || f.id === "mangasin";
  const hdrs = (f.id === "lectorxd" || f.id === "mangasin")
    ? {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-419,es;q=0.9",
        "User-Agent": UA_MOVIL,
        Referer: f.base + "/",
      }
    : f.id === "mangaoni"
    ? {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-419,es;q=0.9",
        "User-Agent": UA_ESCRITORIO,
        Referer: f.base + "/",
      }
    : { Accept: "text/html" };
  // MangaOni guarda sus series con el prefijo /oni: al pedir se quita.
  const ruta = f.id === "mangaoni" ? moPath(path) : f.id === "mangasin" ? msPath(path) : path;
  // v0.4.9 — si la persona ya pasó la revisión del filtro en la
  // ventanita de Kino, las peticiones de LectorXd viajan desde el
  // primer intento con esa galleta de acceso y con el disfraz exacto
  // del navegador que la ganó (Cloudflare amarra la galleta a él, así
  // que con galleta ya no se intercambian disfraces: la invalidaría).
  let hdrs0 = hdrs;
  // v0.4.13 — Mangas.in comparte con LectorXd la receta de la galleta
  // de acceso, cada fuente con su llave propia del almacén.
  if (f.id === "lectorxd" || f.id === "mangasin") {
    const g = getJson(f.id === "mangasin" ? "msCookies" : "lxCookies", null);
    if (g && typeof g === "object") {
      const par = [];
      for (const k in g) if (g[k]) par.push(k + "=" + g[k]);
      if (par.length) {
        hdrs0 = Object.assign({}, hdrs, { Cookie: par.join("; ") });
        const ua = getJson(f.id === "mangasin" ? "msUA" : "lxUA", "");
        if (ua) hdrs0["User-Agent"] = ua;
      }
    }
  }
  // v0.4.7 — el 403 del filtro anti-bots de Cloudflare entra y sale (en
  // el registro de la persona LectorXd a veces cargaba y a veces no):
  // ahora se reintenta hasta 3 veces — el 2º intento con el disfraz del
  // otro navegador y el 3º con la dirección alternativa del sitio (www),
  // esperando un poco entre intentos para no parecer un bombardeo. Las
  // demás fuentes siguen con un solo intento, igual que siempre, y un
  // sitio que no responde (timeout) tampoco se martilla.
  let ultimo = 0;   // el último estado que el sitio dio (0: conexión cortada)
  for (let intento = 1; intento <= 3; intento++) {
    const conGalleta = hdrs0 !== hdrs;
    const h = intento === 2 && esNube && !conGalleta
      ? Object.assign({}, hdrs, { "User-Agent": f.id === "lectorxd" ? UA_ESCRITORIO : UA_MOVIL })
      : hdrs0;
    const base = intento === 3 && esNube
      ? (f.id === "lectorxd" ? "https://www.lectorxd.com" : f.id === "mangasin" ? f.base : "https://www.manga-oni.com")
      : f.base;
    const ops = { headers: h };
    if (intento > 1) ops.timeoutMs = 7000;
    let r = null;
    try {
      r = await kino.fetch(base + ruta, ops);
    } catch (e) {
      // La petición ni siquiera recibió respuesta (conexión rechazada,
      // TLS cortado por el filtro anti-bots): queda en el log con su
      // causa y la persona recibe un mensaje honesto. Solo se reintenta
      // el corte rápido (code "network"): un timeout es un sitio caído
      // y no se desbloquea insistiendo.
      log(f.id + " conexión fallida en " + path + " (intento " + intento + "): " + ((e && e.message) || e));
      if (!esNube || !e || e.code !== "network") {
        throw kino.error("network", "conexión: " + ((e && e.message) || e), {
          userMessage: "No se pudo conectar con " + f.nombre + ". Si tu internet va bien, el sitio bloqueó la conexión.",
        });
      }
      ultimo = 0;
    }
    if (r && r.ok) {
      const txt = await r.text();
      // Cloudflare a veces responde 200 con su página de revisión («Just
      // a moment…»): cuenta como bloqueo, no como página buena.
      if (esNube && /just a moment|cf-chl|checking your browser|attention required/i.test(txt.slice(0, 4000))) {
        log(f.id + " página de revisión en " + path + " (intento " + intento + ")");
        ultimo = 403;
      } else {
        if (intento > 1) log(f.id + " cargó en el intento " + intento + ": " + path);
        return txt;
      }
    } else if (r) {
      // El estado se anota en el log: con él se distingue un bloqueo +18
      // (403/451) de una caída real de la red.
      log(f.id + " HTTP " + r.status + " en " + path + " (intento " + intento + ")");
      ultimo = r.status;
      // Solo se reintentan el 403 y el 429 (el filtro anti-bots que va y
      // viene y el «demasiadas peticiones»); el 451 es el bloqueo +18 o
      // legal, y ningún otro estado se desbloquea insistiendo.
      if (!esNube || (r.status !== 403 && r.status !== 429)) {
        throw kino.error("network", "HTTP " + r.status, {
          userMessage: f.id === "lectorxd" && (r.status === 403 || r.status === 451)
            ? "LectorXd bloqueó la página (HTTP " + r.status + "). Si es una serie +18, la cierra sin cuenta; si no, es su filtro anti-bots. Prueba otra serie."
            : f.id === "mangaoni" && r.status === 403
            ? "MangaOni bloqueó la página (HTTP 403): es su protección anti-bots. Vuelve a intentarlo o prueba otra serie."
            : "No se pudo conectar con " + f.nombre + " (HTTP " + r.status + "). Inténtalo de nuevo.",
        });
      }
    }
    if (intento < 3) await kino.sleep(intento === 1 ? 1200 : 1800);
  }
  // Se agotaron los intentos: queda el mensaje honesto con el último
  // estado que el sitio dio.
  const est = ultimo ? "HTTP " + ultimo : "sin respuesta";
  throw kino.error("network", ultimo ? "HTTP " + ultimo : "conexión cortada", {
    userMessage: f.id === "lectorxd"
      ? "LectorXd bloqueó la página (" + est + ") aunque se reintentó con otro disfraz de navegador. Si es una serie +18, la cierra sin cuenta; si no, su filtro anti-bots está activo ahora mismo: prueba otra serie o vuelve en un rato."
      : f.id === "mangaoni"
      ? "MangaOni bloqueó la página (" + est + ") aunque se reintentó: su protección anti-bots está activa ahora mismo. Vuelve en un rato o prueba otra serie."
      : "No se pudo conectar con " + f.nombre + ". Si tu internet va bien, el sitio bloqueó la conexión.",
  });
}

// v0.4.9 — Pasar la revisión de Cloudflare con las manos de la persona.
// Kino abre una ventanita de navegador real sobre la página de la serie:
// la persona la ve, la revisión se resuelve sola o con un toque (a veces
// es marcar un cuadrito), y al tocar "Listo" el plugin recibe la galleta
// de acceso y el disfraz exacto del navegador que la ganó. Una ventana
// por toque, solo tras un toque de la persona (requisito de Kino) y solo
// si este Kino tiene la ventanita disponible. Si la ventana se cierra sin
// resolver nada, devuelve false y sigue el mensaje honesto de siempre.
async function pasarRevision(f, path) {
  if (!kino.visualBrowser || !kino.visualBrowser.available) return false;
  try {
    const r = await kino.visualBrowser.open({
      url: f.base + path,
      title: f.nombre,
      collect: { cookies: ["cf_clearance", "__cf_bm"] },
      userAgent: "browser",
      timeoutMs: 120000,
    });
    const st = (r && r.status) || "sin-respuesta";
    // Las galletas pueden llegar de varias formas según el Kino: todas
    // se normalizan a un objeto {nombre: valor}.
    const g = {};
    const crudas = r && r.cookies;
    if (typeof crudas === "string" && crudas) {
      crudas.split(";").forEach(function (p) {
        const i = p.indexOf("=");
        if (i > 0) g[p.slice(0, i).trim()] = p.slice(i + 1).trim();
      });
    } else if (Array.isArray(crudas)) {
      crudas.forEach(function (c) {
        if (c && c.name && c.value !== undefined) g[String(c.name)] = String(c.value);
      });
    } else if (crudas && typeof crudas === "object") {
      for (const k in crudas) g[k] = String(crudas[k]);
    }
    const nombres = Object.keys(g);
    log("ventana " + f.id + ": " + st + ", galletas " + (nombres.length ? nombres.join(",") : "ninguna"));
    if (st !== "done" || !nombres.length) return false;
    const ck = f.id === "mangasin" ? "msCookies" : "lxCookies";
    if (!setJson(ck, g)) return false;
    if (r.userAgent) setJson(f.id === "mangasin" ? "msUA" : "lxUA", r.userAgent);
    return true;
  } catch (e) {
    log("ventana " + f.id + " falló: " + ((e && e.message) || e));
    return false;
  }
}

async function getHtml(path) {
  return getHtmlDe(fuenteActiva(), path);
}

// v0.4.18 — La ventana de rescate de Mangas.in. La quinta prueba real
// enseñó dos cosas: la portada del sitio NO pide revisión (la ventanita
// de v0.4.17 cargó la portada completa y no dejó galleta: «done, galletas
// ninguna» ×5 — no hay revisión que pasar en la portada), y los 403 viven
// SOLO en las dos páginas de listas. Así que la ventanita abre AHORA LA
// PÁGINA BLOQUEADA (las listas del catálogo) con dos redes: si el sitio
// pide su revisión allí, la persona la pasa y la galleta llega; y venga o
// no galleta, Kino entrega el HTML de la página cargada (collect.html del
// contrato oficial, hasta 2M de caracteres) y las tarjetas se leen aquí.
async function msVentanaRescate(f, manual, ruta) {
  if (!manual && Date.now() - (getJson("msVentanaFallo", 0) || 0) < 3600000) return null;
  setJson("msVentanaFallo", Date.now());
  if (!kino.visualBrowser || !kino.visualBrowser.available) return null;
  try {
    // Sin doneWhen: el botón «Listo» de la barra entrega las galletas y
    // el HTML solo con status «done»; si la galleta nunca llega, la
    // persona toca «Listo» con la página ya cargada y el HTML viaja igual.
    const r = await kino.visualBrowser.open({
      url: f.base + (ruta || "/manga-list?page=1"),
      title: f.nombre,
      collect: { cookies: ["cf_clearance", "__cf_bm"], html: true },
      userAgent: "browser",
      timeoutMs: 120000,
    });
    const st = (r && r.status) || "sin-respuesta";
    const g = {};
    const crudas = r && r.cookies;
    if (typeof crudas === "string" && crudas) {

      crudas.split(";").forEach(function (p) {
        const i = p.indexOf("=");
        if (i > 0) g[p.slice(0, i).trim()] = p.slice(i + 1).trim();
      });
    } else if (Array.isArray(crudas)) {
      crudas.forEach(function (c) {
        if (c && c.name && c.value !== undefined) g[String(c.name)] = String(c.value);
      });
    } else if (crudas && typeof crudas === "object") {
      for (const k in crudas) g[k] = String(crudas[k]);
    }
    const nombres = Object.keys(g);
    const nHtml = (r && typeof r.html === "string" && r.html.length) || 0;
    log("ventana mangasin: " + st + ", galletas " + (nombres.length ? nombres.join(",") : "ninguna") + ", html " + nHtml + " chars");
    if (st !== "done") return null;

    const out = { galleta: false, html: "" };
    if (nombres.length) {
      if (!setJson("msCookies", g)) return null;
      if (r.userAgent) setJson("msUA", r.userAgent);
      out.galleta = true;
    }
    if (nHtml > 500) out.html = r.html;
    if (!out.galleta && !out.html) return null;
    return out;
  } catch (e) {
    log("ventana mangasin falló: " + ((e && e.message) || e));
    return null;
  }
}

// v0.4.20 — «Leer en ventanita»: el diagnóstico de la séptima prueba
// cerró el caso — el sitio de Mangas.in niega sus imágenes a todo
// pedido sin presentación, y el pintor de imágenes de Kino no puede
// presentarse (la solución de verdad le toca a Kino; ya está pedida
// en su repositorio oficial). Mientras llega, el capítulo se puede
// leer en la ventanita de navegador: el navegador del propio sitio
// SÍ se presenta y las imágenes se ven. Abre la dirección real del
// capítulo (quitando el prefijo /ms interno) y espera a que la
// persona termine y cierre; 10 minutos por ventana.
async function msVentanaLeer(ch, f) {
  if (!kino.visualBrowser || !kino.visualBrowser.available) return { st: "sin-ventanita" };
  const urlMs = MS_BASE + msPath(ch.url);
  try {
    const r = await kino.visualBrowser.open({
      url: urlMs,
      title: f.nombre + " · cap. " + ch.num,
      timeoutMs: 600000,
    });
    const st = (r && r.status) || "sin-respuesta";
    log("ventana leer mangasin: " + st);
    return { st: st };
  } catch (e) {
    log("ventana leer mangasin falló: " + ((e && e.message) || e));
    return { st: "error" };
  }
}

// v0.4.19 — La galleta de Mangas.in ganada en la ventanita demostró (sexta
// prueba real: «galletas cf_clearance» en el Registro y las listas
// siguieron contestando 403 una y otra vez) NO abrir las puertas en las
// peticiones del plugin: el sitio la amarra a algo más que al disfraz del
// navegador. Se anota la hora y durante una hora las listas van directo
// a sus atajos (caché, portada del sitio o ventanita), sin repetir los
// seis intentos que ya se saben fallidos.
function msGalletaInutilFresca() {
  return Date.now() - (getJson("msGalletaInutil", 0) || 0) < 3600000;
}

// v0.4.19 — Una pregunta al sitio, una vez por hora: ¿sus imágenes se
// sirven a un pedido SIN presentarse (sin Referer ni disfraz)? El pintor
// de pantalla de Kino no puede presentarse ante el sitio y las páginas
// del lector salen en blanco aunque el plugin las descargue y mida
// perfectamente. Esta prueba separa «el sitio niega la imagen al pintor»
// de cualquier otra causa — lo que decida el Registro irá al reporte.
function msDiagPresentacion(f, etiqueta, url) {
  if (!url || Date.now() - (getJson("msDiag", 0) || 0) < 3600000) return Promise.resolve();
  setJson("msDiag", Date.now());
  return kino.fetch(url, {})
    .then(function (r) {
      log("MS " + etiqueta + " al desnudo: HTTP " + (r && r.status) + " (" + (r && r.ok ? "sí la sirve" : "la niega") + ")");
    })
    .catch(function (e) {
      log("MS " + etiqueta + " al desnudo: no bajó (" + ((e && e.message) || e) + ")");
    });
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
    const h = inner.match(/<h[2-6][^>]*>([\s\S]{2,200}?)<\/h[2-6]>/i);
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

// v0.4.10 — el catálogo y el buscador de LectorXd sirven sus tarjetas
// en una cuadrícula "manga-grid" (el mismo marcado que leen las demás
// apps del sitio): cada tarjeta es UN enlace <a>…</a> completo con la
// portada y el título dentro. El lector de siempre (cardsLX) corta la
// tarjeta en el siguiente <a> y a veces se queda sin la portada: este
// segundo intento respeta el cierre </a>, acepta el título en cualquier
// encabezado h2-h6 y, si la página no trajo ni eso, anota en el registro
// qué encontró — para afinar con datos, no con adivinanzas.
function cardsLXCat(html, max) {
  const out = [];
  const seen = {};
  const iGrid = html.search(/manga-grid/i);
  if (iGrid < 0) {
    log("LX catálogo: sin cuadrícula en la página (html=" + html.length + ")");
    return out;
  }
  const zona = html.slice(iGrid);
  const re = /<a\b[^>]*\bhref="([^"]*\/(?:manga|manhwa|manhua|one[-_]shot)\/[a-z0-9-]+\/?)"[^>]*>([\s\S]{0,4000}?)<\/a>/gi;
  let m;
  while ((m = re.exec(zona)) !== null) {
    let url = m[1];
    if (/\/novela\//i.test(url)) continue;
    url = url.replace(/^https?:\/\/(?:www\.)?lectorxd\.com/i, "");
    if (!/^\//.test(url)) continue;
    if (seen[url]) continue;
    const inner = m[2];
    let poster = "";
    const imgs = inner.match(/<img\b[^>]*>/gi) || [];
    for (let i = 0; i < imgs.length; i++) {
      const p = imgs[i].match(/\bdata-src="([^"]+)"/i) || imgs[i].match(/\bdata-lazy-src="([^"]+)"/i) || imgs[i].match(/\bsrc="([^"]+)"/i);
      if (p && p[1] && p[1].indexOf("data:") !== 0) { poster = absLX(p[1]); break; }
    }
    let title = "";
    const h = inner.match(/<h[2-6][^>]*>([\s\S]{2,200}?)<\/h[2-6]>/i);
    if (h) title = clean(h[1].replace(/<[^>]*>/g, " "));
    if (!title && imgs.length) {
      const a = imgs[0].match(/\balt="([^"]*)"/i);
      if (a && a[1]) title = clean(a[1]);
    }
    if (!title) title = url.split("/").filter(Boolean).pop() || url;
    seen[url] = 1;
    out.push({ url: url, title: title, poster: poster });
    if (out.length >= max) break;
  }
  log("LX catálogo: " + out.length + " tarjetas de la cuadrícula");
  return out;
}

function cardsDe(f, html, max) {
  if (f.id === "mangasin") return msCards(html, max);
  if (f.id !== "lectorxd") return homeCards(html, max);
  const t = cardsLX(html, max);
  return t.length ? t : cardsLXCat(html, max);
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

// ---------------------------------------------------------------- v0.4.5
// Guardián del almacén. El almacén del plugin tiene un tope (256 KB) y
// las cachés grandes (capítulos completos "caps:", catálogo "cat",
// resultados de AniList "al", dimensiones "dims") lo llenaban SIN
// aviso. Las cachés desechables se escriben con setJsonCache: si no
// caben, se BORRA la caché registrada más vieja (siempre se pueden
// volver a pedir al sitio) y se reintenta, una por una, hasta que
// quepa. Los datos personales —favoritos, historial, vínculos de
// AniList— no se tocan.

function setJsonTxt(clave, txt) {
  try { kino.storage.set(clave, txt); return true; } catch (e) { log("storage: " + e); return false; }
}

function cacheIdx() { return getJson("cacheIdx", {}); }

function regCache(clave, bytes) {
  const idx = cacheIdx();
  idx[clave] = { t: Date.now(), b: bytes };
  setJsonTxt("cacheIdx", JSON.stringify(idx));
}

// v0.4.6 — borrar una clave DE VERDAD. La cuota de 256 KB de Kino
// mide "el JSON de todas las claves y valores": dejar el valor en ""
// liberaba el valor pero conservaba la CLAVE, y las de este plugin
// llevan URLs enteras en el nombre. kino.storage.remove() es el
// borrado de verdad; si no existiera, queda el valor vacío.
function borrarClave(clave) {
  try {
    if (typeof kino.storage.remove === "function") {
      kino.storage.remove(clave);
      return true;
    }
  } catch (e) { log("storage: " + e); }
  return setJsonTxt(clave, "");
}

function setJsonCache(clave, val) {
  let txt = "";
  try { txt = JSON.stringify(val); } catch (e) { return false; }
  if (setJsonTxt(clave, txt)) { regCache(clave, txt.length); return true; }
  // v0.4.6 — Lleno: liberar las cachés registradas de una en una (la
  // más vieja primero, nunca la clave que se escribe) BORRÁNDOLAS de
  // verdad y reintentando la escritura tras cada una. Solo si no
  // queda ninguna caché registrada se devuelve false, para que el
  // llamador avise en vez de fingir que guardó.
  const idx = cacheIdx();
  const ks = Object.keys(idx)
    .filter(function (k) { return k !== clave; })
    .sort(function (a, b) { return ((idx[a] && idx[a].t) || 0) - ((idx[b] && idx[b].t) || 0); });
  let ok = false;
  for (let i = 0; i < ks.length && !ok; i++) {
    borrarClave(ks[i]);
    delete idx[ks[i]];
    setJsonTxt("cacheIdx", JSON.stringify(idx));
    if (setJsonTxt(clave, txt)) ok = true;
  }
  if (ok) { regCache(clave, txt.length); return true; }
  setJsonTxt("cacheIdx", JSON.stringify(idx));
  return false;

}

// v0.4.6 — limpieza única (flag "limpia046"). Las limpiezas
// anteriores no vaciaron el almacén por dos razones: dejaban los
// valores en "" (la cuota de Kino mide "el JSON de todas las claves y
// valores", y estas claves llevan URLs enteras en el nombre) y no
// veían las cachés "huérfanas" de series que ya salieron del
// historial. Esta pasada enumera el almacén COMPLETO con
// kino.storage.keys(): (1) recoge la página guardada de las claves
// legadas "pgAt:" (en orden de lectura, las más recientes primero)
// para migrarla a pgAtMap; (2) registra TODA caché "caps:" con su
// tamaño real (huérfanas con t=0, para que el guardián las suelte
// primero) y tira las cáscaras vacías que dejaron las limpiezas
// anteriores; (3) registra cat/al/dims; (4) borra las caps: de
// series más allá del puesto 20 que no son favoritas y las de series
// que ya no están en el historial; (5) válvula de seguridad: si el
// almacén sigue por encima de 192 KB, suelta las cachés registradas
// más viejas hasta bajar; (6) migra pgAtMap y BORRA las claves
// legadas. Los datos personales (favoritos, historial, vínculos) no
// se tocan; las cachés siempre se pueden volver a pedir al sitio.
// Corre una vez, al abrir el plugin.
function limpiaAlmacen() {
  if (getJson("limpia046", 0)) return;
  const idx = cacheIdx();
  const ahora = Date.now();
  let ks = [];
  try { if (typeof kino.storage.keys === "function") ks = kino.storage.keys() || []; } catch (e) { ks = []; }
  const h = hist();
  const favUrls = favs().map(function (x) { return x.url; });
  // (1) páginas legadas: recoger el valor para migrarlo al final,
  // cuando ya haya espacio (solo si el mapa no lo tiene y caben las
  // más recientes en el tope de 120).
  const m = getJson("pgAtMap", {}) || {};
  let enMapa = Object.keys(m).length;
  const pgLegacy = [];
  let pgBytes = 0;
  for (let i = ks.length - 1; i >= 0; i--) {
    if (ks[i].indexOf("pgAt:") !== 0) continue;
    let v = null;
    try { v = kino.storage.get(ks[i]); } catch (e) {}
    pgLegacy.push(ks[i]);
    pgBytes += ks[i].length + (v ? v.length : 0) + 6;
    const cu = ks[i].slice(5);
    if (v && !(cu in m)) {
      const nPg = parseInt(v, 10);

      if (isFinite(nPg) && nPg >= 0 && enMapa < 120) { m[cu] = nPg; enMapa++; }
    }
  }
  // (2) registrar TODA caché caps: (huérfanas con t=0) y tirar las
  // cáscaras vacías de las limpiezas anteriores.
  let regN = 0, casN = 0;
  for (let i = 0; i < ks.length; i++) {
    const k = ks[i];
    if (k.indexOf("caps:") !== 0) continue;
    let raw = null;
    try { raw = kino.storage.get(k); } catch (e) {}
    if (raw === "") { if (borrarClave(k)) casN++; continue; }
    if (raw && raw.length > 2 && !idx[k]) {
      idx[k] = { t: (h[k.slice(5)] && h[k.slice(5)].ts) || 0, b: raw.length };
      regN++;
    }
  }
  ["cat", "al", "dims"].forEach(function (k) {
    if (idx[k]) return;
    try {
      const raw = kino.storage.get(k);
      if (raw && raw.length > 2) { idx[k] = { t: ahora, b: raw.length }; regN++; }
    } catch (e) {}
  });
  // (3) caps: de series viejas (más de 20 puestos atrás y no
  // favoritas) y de series que ya salieron del historial: fuera.
  const urls = Object.keys(h).sort(function (a, b) { return (h[b].ts || 0) - (h[a].ts || 0); });
  let n = 0;
  for (let i = 20; i < urls.length; i++) {
    if (favUrls.indexOf(urls[i]) >= 0) continue;
    const ck = "caps:" + urls[i];
    if (borrarClave(ck)) { n++; delete idx[ck]; }
  }
  Object.keys(idx).forEach(function (k) {
    if (k.indexOf("caps:") === 0 && !h[k.slice(5)]) {
      if (borrarClave(k)) { n++; delete idx[k]; }
    }
  });
  // (4) válvula de seguridad: "el JSON de todas las claves y
  // valores"; si tras lo de arriba (menos las páginas legadas, que ya
  // van a salir) sigue por encima de 192 KB, se suelta la caché
  // registrada más vieja hasta quedar por debajo.
  let usados = 0;
  for (let i = 0; i < ks.length; i++) {
    let v = null;
    try { v = kino.storage.get(ks[i]); } catch (e) {}
    if (v === null) continue;
    usados += ks[i].length + v.length + 6;
  }
  usados -= pgBytes;
  let lib = 0;
  const porT = Object.keys(idx).sort(function (a, b) { return ((idx[a] && idx[a].t) || 0) - ((idx[b] && idx[b].t) || 0); });
  for (let i = 0; i < porT.length && usados > 192000; i++) {
    const b = (idx[porT[i]] && idx[porT[i]].b) || 0;
    if (borrarClave(porT[i])) { usados -= b + porT[i].length + 6; delete idx[porT[i]]; lib++; }
  }
  setJsonTxt("cacheIdx", JSON.stringify(idx));
  // (5) migrar pgAtMap (ya hay espacio) y borrar las claves legadas.
  let pgN = 0;
  if (setJson("pgAtMap", m)) {
    for (let i = 0; i < pgLegacy.length; i++) { if (borrarClave(pgLegacy[i])) pgN++; }
  }
  setJson("limpia046", 1);
  log("limpieza 0.4.6: " + regN + " cachés registradas, " + n + " series viejas liberadas, " +
    pgN + " páginas legadas borradas" + (casN ? ", " + casN + " cáscaras vacías" : "") +
    (lib ? ", " + lib + " cachés extra por válvula" : ""));
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
  // v0.4.6 — al guardar la página en el mapa se borra la clave
  // legada de ese capítulo, para no dejar cáscaras en el almacén.
  if (setJson("pgAtMap", m)) borrarClave("pgAt:" + chUrl);
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
  if (f.id === "mangasin") return imgsMS(html);
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

// --------------------------------------------- Mangas.in (6ª fuente)
// Mangas.in (dominio real: m440.in) usa el tema WordPress «Lector de
// Manga Online», el mismo que leen las apps libres de Android y de
// escritorio. Tiene dos rarezas que esas apps ya resolvieron y aquí
// se replican igual:
// 1) La lista de capítulos NO viene en la página: llega CIFRADA
//    (AES-256-CBC, la receta de CryptoJS con sal OpenSSL: clave e
//    vector derivados por MD5 de una contraseña y la sal del propio
//    mensaje). La contraseña vive en un script del sitio que va
//    cambiando; se prueban la guardada, la conocida y las candidatas
//    del propio script, una a una contra el mensaje cifrado: solo la
//    correcta produce una lista de capítulos válida, así nunca se
//    inventa un capítulo falso.
// 2) Algunas imágenes del lector viajan con la dirección escondida
//    en base64 («https://<base64>»): se destapan igual que hacen
//    esas apps.
const MS_BASE = "https://m440.in";
const MAX_CAPS_MS = 300;
// Contraseña de las listas cifradas, destapada y publicada por los
// lectores libres que ya la sacaron (Komikku). Si el sitio la
// cambia, la búsqueda en su script la renueva y la nueva queda
// guardada para la próxima.
const MS_CLAVE_FIJA = "X^Ib1O*HLVh%3W2t";

function msPath(url) {
  let u = String(url || "");
  if (u.indexOf("/ms") === 0) u = u.slice(3);
  return u || "/";
}

// Portadas relativas del catálogo resueltas contra el dominio propio.
function msAbs(u) {
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("/") === 0) return MS_BASE + u;
  if (/^https?:/i.test(u)) return u;
  return MS_BASE + "/" + u;
}

// La portada de una serie de Mangas.in es adivinable: el tema del
// sitio la guarda siempre en /uploads/manga/<slug>/cover/.
function msCover(slug) {
  return MS_BASE + "/uploads/manga/" + String(slug || "") + "/cover/cover_250x350.jpg";
}

function msSlugDe(url) {
  const seg = String(url || "").split("/").filter(Boolean);
  return seg.length >= 3 && seg[0] === "ms" && seg[1] === "manga" ? seg[2] : "";
}

// ------------------------------------------------ cifrado a mano
// MD5, AES-256-CBC y la derivación OpenSSL EVP en JS puro: la lista
// de capítulos se descifra dentro del plugin, sin pedirle nada al
// entorno (verificado contra los vectores del propio estándar).

// MD5 de una tira de bytes → 16 bytes (receta RFC 1321).
function msMd5(msg) {
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  const K = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  const data = msg.slice();
  const bl = msg.length * 8;
  data.push(128);
  while (data.length % 64 !== 56) data.push(0);
  data.push(bl & 255, (bl >>> 8) & 255, (bl >>> 16) & 255, (bl >>> 24) & 255, 0, 0, 0, 0);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  for (let ch = 0; ch < data.length; ch += 64) {
    const M = [];
    for (let j = 0; j < 16; j++) {
      const o = ch + j * 4;
      M[j] = (data[o] | (data[o + 1] << 8) | (data[o + 2] << 16) | (data[o + 3] << 24)) >>> 0;
    }
    let A = a0 >>> 0, B = b0 >>> 0, C = c0 >>> 0, D = d0 >>> 0;
    for (let i = 0; i < 64; i++) {
      let F = 0, g = 0;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) & 15; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) & 15; }
      else { F = C ^ (B | ~D); g = (7 * i) & 15; }
      const tmp = D;
      D = C;
      C = B;
      const s3 = ((((((A >>> 0) + (F >>> 0)) >>> 0) + K[i]) >>> 0) + M[g]) >>> 0;
      B = (B + ((s3 << S[i]) | (s3 >>> (32 - S[i])))) >>> 0;
      A = tmp;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = [];
  const ns = [a0, b0, c0, d0];
  for (let i = 0; i < 4; i++) {
    out.push(ns[i] & 255, (ns[i] >>> 8) & 255, (ns[i] >>> 16) & 255, (ns[i] >>> 24) & 255);
  }
  return out;
}

// Derivación OpenSSL (EVP_BytesToKey con MD5, 1 vuelta): la clave y
// el vector salen de la contraseña + la sal. Es la receta interna de
// CryptoJS.AES.decrypt(mensaje, contraseña) que usa el sitio.
function msEvp(pw, salt) {
  const d1 = msMd5(pw.concat(salt));

  const d2 = msMd5(d1.concat(pw).concat(salt));
  const d3 = msMd5(d2.concat(pw).concat(salt));
  return { key: d1.concat(d2), iv: d3 };
}

function msHexBytes(h) {
  const s = String(h || "");
  const out = [];
  for (let i = 0; i + 1 < s.length; i += 2) {
    const v = parseInt(s.slice(i, i + 2), 16);
    if (isFinite(v)) out.push(v & 255);
  }
  return out;
}

function msBytesDeStr(s) {
  const out = [];
  const t = String(s || "");
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i);
    if (c < 128) out.push(c);
    else if (c < 2048) out.push(192 | (c >> 6), 128 | (c & 63));
    else out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
  }
  return out;
}

function msStrDeBytes(b) {
  let out = "";
  let i = 0;
  while (i < b.length) {
    const c = b[i];
    if (c < 128) { out += String.fromCharCode(c); i += 1; }
    else if ((c & 224) === 192) { out += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63)); i += 2; }
    else { out += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63)); i += 3; }
  }
  return out;
}

// AES: tablas del estándar (FIPS-197) generadas al vuelo con la
// aritmética GF(2^8), no copiadas a mano; verificado con el vector
// del propio estándar (C.3) y contra una segunda implementación de
// control, byte a byte.

function msAesTablas() {
  if (msAesTablas._t) return msAesTablas._t;
  const alog = [];
  const log = [];
  for (let i = 0; i < 256; i++) log[i] = 0;
  let v = 1;
  for (let i = 0; i < 255; i++) {
    alog[i] = v;
    log[v] = i;
    const xt = ((v << 1) ^ ((v & 128) ? 0x11b : 0)) & 255;
    v = (v ^ xt) & 255;
  }
  const mul = function (a, b) {
    if (a === 0 || b === 0) return 0;
    return alog[(log[a] + log[b]) % 255];
  };
  const inv = function (a) {
    if (a === 0) return 0;
    return alog[(255 - log[a]) % 255];
  };
  const S = [];
  const iS = [];
  for (let a = 0; a < 256; a++) {
    const b = inv(a);
    let s = b ^ (((b << 1) | (b >>> 7)) & 255) ^ (((b << 2) | (b >>> 6)) & 255) ^
      (((b << 3) | (b >>> 5)) & 255) ^ (((b << 4) | (b >>> 4)) & 255);
    s = (s ^ 0x63) & 255;
    S[a] = s;
    iS[s] = a;
  }
  const rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  msAesTablas._t = { S: S, iS: iS, mul: mul, rcon: rcon };
  return msAesTablas._t;
}

// Expansión de clave AES-256 (14 rondas, 60 palabras).
function msAesExpand(key) {
  const T = msAesTablas();
  const S = T.S;
  const w = [];
  for (let i = 0; i < 8; i++) w.push([key[i * 4], key[i * 4 + 1], key[i * 4 + 2], key[i * 4 + 3]]);
  for (let i = 8; i < 60; i++) {
    let t = w[i - 1].slice();
    if (i % 8 === 0) {
      t = [t[1], t[2], t[3], t[0]];
      t = [S[t[0]], S[t[1]], S[t[2]], S[t[3]]];
      t[0] = (t[0] ^ T.rcon[i / 8]) & 255;
    } else if (i % 8 === 4) {

      t = [S[t[0]], S[t[1]], S[t[2]], S[t[3]]];
    }
    w.push([w[i - 8][0] ^ t[0], w[i - 8][1] ^ t[1], w[i - 8][2] ^ t[2], w[i - 8][3] ^ t[3]]);
  }
  return w;
}

// Descifrado de UN bloque de 16 bytes (ronda inversa del estándar).
function msAesDecBloque(w, bl) {
  const T = msAesTablas();
  const iS = T.iS;
  const mul = T.mul;
  const s = bl.slice();
  const ark = function (r) {
    for (let c = 0; c < 4; c++) for (let i = 0; i < 4; i++) s[c * 4 + i] ^= w[r * 4 + c][i];
  };
  const invShift = function () {
    const o = s.slice();
    for (let i = 1; i < 4; i++)
      for (let c = 0; c < 4; c++)
        s[c * 4 + i] = o[((c + 4 - i) % 4) * 4 + i];
  };
  const invMix = function () {
    for (let c = 0; c < 4; c++) {
      const p = c * 4;
      const a0 = s[p], a1 = s[p + 1], a2 = s[p + 2], a3 = s[p + 3];
      s[p] = mul(14, a0) ^ mul(11, a1) ^ mul(13, a2) ^ mul(9, a3);
      s[p + 1] = mul(9, a0) ^ mul(14, a1) ^ mul(11, a2) ^ mul(13, a3);
      s[p + 2] = mul(13, a0) ^ mul(9, a1) ^ mul(14, a2) ^ mul(11, a3);
      s[p + 3] = mul(11, a0) ^ mul(13, a1) ^ mul(9, a2) ^ mul(14, a3);
    }
  };
  ark(14);
  for (let r = 13; r >= 1; r--) {
    invShift();
    for (let i = 0; i < 16; i++) s[i] = iS[s[i]];
    ark(r);
    invMix();
  }
  invShift();
  for (let i = 0; i < 16; i++) s[i] = iS[s[i]];
  ark(0);
  return s;
}

// AES-256-CBC: cada bloque descifrado se mezcla con el anterior.
function msAesCbcDec(key, iv, datos) {
  const w = msAesExpand(key);
  const out = [];
  let prev = iv;
  for (let i = 0; i + 16 <= datos.length; i += 16) {
    const bl = datos.slice(i, i + 16);
    const dec = msAesDecBloque(w, bl);
    for (let j = 0; j < 16; j++) out.push(dec[j] ^ prev[j]);
    prev = bl;
  }
  return out;
}

// Quitar el relleno PKCS7; si no es válido, la clave era errada.
function msQuitaRelleno(b) {
  if (!b.length) return null;
  const n = b[b.length - 1];
  if (n < 1 || n > 16 || n > b.length) return null;
  for (let i = b.length - n; i < b.length; i++) if (b[i] !== n) return null;
  return b.slice(0, b.length - n);
}

// El bloque cifrado viaja dentro de un script de la página con sus
// comillas ESCAPADAS ({\"ct\":…,\"iv\":…,\"s\":…}) y la lista real
// mide MILES de caracteres: el rastreo de ventana corta nunca daba
// con ella (el «bloque ausente» del Registro). Ahora la página se
// mira entera: primero la forma clásica (receivedData = "…";) y, si
// no está, se escanean las marcas de \"ct\" (escapadas y planas)
// buscando hacia atrás el abrazo { } que las contiene. Solo vale el
// candidato con los tres campos (ct, iv y s) de verdad.
function msBlobDe(html) {
  const h = String(html || "");
  const bs = String.fromCharCode(92);
  const pr = (cad) => cad.replace(new RegExp(bs + bs + "(.)", "g"), "$1");
  const validar = (cad) => {
    try {
      const o = JSON.parse(cad);
      if (o && typeof o.ct === "string" && typeof o.iv === "string" && typeof o.s === "string") return o;
    } catch (e) { }
    return null;
  };
  const mRD = /receivedData\s*=\s*(['"])([\s\S]*?)\1\s*;/.exec(h);
  if (mRD) {
    const o = validar(pr(mRD[2]));
    if (o) return o;
  }
  const marcaEsc = bs + '"ct' + bs + '"';
  const marcas = [];
  let p = h.indexOf(marcaEsc);
  while (p >= 0 && marcas.length < 8) { marcas.push(p); p = h.indexOf(marcaEsc, p + 1); }
  p = h.indexOf('"ct"');
  while (p >= 0 && marcas.length < 16) { marcas.push(p); p = h.indexOf('"ct"', p + 1); }
  for (const m of marcas) {
    const fin = h.indexOf("}", m);
    if (fin < 0) continue;
    let q = m;
    for (let n = 0; n < 6; n++) {
      const a = h.lastIndexOf("{", q);
      if (a < 0) break;
      const o = validar(pr(h.slice(a, fin + 1)));
      if (o) return o;
      q = a - 1;
    }
  }
  return null;
}

// La lista descifrada llega como una tira JSON, a veces metida entre
// comillas y con \uXXXX: se destapa y se parte en capítulos con su
// número real (1, 271.6…).
function msCapsDeJson(txt, slug) {
  let t = String(txt || "");
  try {
    t = t.replace(/\\u([0-9a-fA-F]{4})/g, function (mm, hh) {
      return String.fromCharCode(parseInt(hh, 16));
    });
  } catch (e) { }
  t = t.replace(/^"|"$/g, "");
  t = t.replace(/\\(.)/g, "$1");
  const ini = t.indexOf("[");
  const fin = t.lastIndexOf("]");
  if (ini < 0 || fin <= ini) return null;
  let arr = null;
  try { arr = JSON.parse(t.slice(ini, fin + 1)); } catch (e) { return null; }
  if (!Array.isArray(arr) || !arr.length) return null;
  const caps = [];
  const seen = {};
  const pre = "/ms/manga/" + String(slug || "") + "/";
  for (let i = 0; i < arr.length && caps.length < TOPE_CAPS_SERIE; i++) {
    const c = arr[i];
    if (!c || typeof c !== "object" || !c.slug) continue;
    const num = String((c.number === undefined || c.number === null) ? "" : c.number).trim();
    const url = pre + String(c.slug) + "/";
    if (seen[url]) continue;
    seen[url] = 1;
    caps.push({ url: url, num: num || String(caps.length + 1) });
  }
  return caps.length ? caps : null;
}

// Un intento completo: derivar clave/vector y descifrar. Solo la
// contraseña correcta produce una lista válida; cualquier otra da
// puro ruido (el relleno no cuadra o el JSON no sale).
function msDesifrar(blob, clave, slug) {
  try {
    const ct = deB64(String((blob && blob.ct) || ""));
    const salt = msHexBytes(blob && blob.s);
    if (ct.length < 32 || ct.length % 16 !== 0 || salt.length !== 8) return null;
    const pw = msBytesDeStr(clave);
    const evp = msEvp(pw, salt);
    const ivs = [evp.iv];
    const ivBlob = msHexBytes(blob && blob.iv);
    if (ivBlob.length === 16) ivs.push(ivBlob);
    for (let k = 0; k < ivs.length; k++) {
      const dec = msQuitaRelleno(msAesCbcDec(evp.key, ivs[k], ct));
      if (!dec) continue;
      const caps = msCapsDeJson(msStrDeBytes(dec), slug);
      if (caps) return caps;
    }
  } catch (e) {
    log("MS descifrado: " + ((e && e.message) || e));
  }
  return null;
}

// Capítulos de una serie: el bloque cifrado de la página + la
// contraseña (la guardada → la conocida → candidatas del script del
// sitio, probadas una a una). Si ninguna abre la lista, se devuelve
// null y la persona recibe el aviso honesto.
async function msCaps(html, slug) {
  const blob = msBlobDe(html);
  if (!blob) return null;
  const claves = [];
  const guardada = getJson("msKey", "");
  if (guardada) claves.push(guardada);
  if (MS_CLAVE_FIJA) claves.push(MS_CLAVE_FIJA);
  for (let i = 0; i < claves.length; i++) {
    const caps = msDesifrar(blob, claves[i], slug);
    if (caps) return caps;
  }
  // El sitio cambió la contraseña: se buscan candidatas (literales
  // entre comillas) en su propio script y se prueban contra el
  // bloque cifrado. Si ya se acaba de fallar, no se martilla el
  // script en cada apertura (un toque por hora).
  const hacePoco = Date.now() - (getJson("msKeyFallo", 0) || 0) < 3600000;
  if (!hacePoco) {
    const base = claves.length;
    try {
      const js = await getHtmlDe(fuentePorId("mangasin"), "/js/ads2.js");
      const vistos = {};
      const re = /(['"])([^'"\r\n]{4,80})\1/g;
      let m;
      while ((m = re.exec(js)) !== null) {
        if (!vistos[m[2]]) { vistos[m[2]] = 1; claves.push(m[2]); }
        if (claves.length > 300) break;
      }
      log("MS candidatas del script: " + (claves.length - base));
    } catch (e) {
      log("MS script del sitio inalcanzable: " + ((e && e.message) || e));
    }
    for (let i = base; i < claves.length; i++) {
      const caps = msDesifrar(blob, claves[i], slug);
      if (caps) {
        setJson("msKey", claves[i]);
        log("MS contraseña renovada y guardada");
        return caps;
      }
    }
    setJson("msKeyFallo", Date.now());
  }
  return null;
}

// Tarjetas del catálogo de Mangas.in (/filterList): cada serie es un
// enlace a /manga/<slug> con la portada en un <img> (a veces dentro
// del enlace, a veces justo antes). El título puede venir como texto
// del enlace o en el alt de la imagen; la portada que falte se
// adivina por el slug (la guarda el propio tema del sitio).

// v0.4.15 — El valor de un atributo, con comillas dobles O simples: el
// sitio mezcla los dos estilos y un atributo con comillas simples es
// invisible para quien solo busque comillas dobles (el fallo del
// «1 página» del lector venía de ahí). Los nombres se prueban en
// orden: vale el primero que exista y no venga vacío.
function msAttrDe(tag, nombres) {
  for (let i = 0; i < nombres.length; i++) {
    const m = String(tag).match(new RegExp("\\b" + nombres[i] + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)')", "i"));
    if (m) return m[1] !== undefined ? m[1] : m[2];
  }
  return "";
}

function msCards(html, max) {
  const out = [];
  const seen = {};
  const re = /<a\b[^>]*href=(?:"([^"]*[/]manga[/][a-z0-9-]+(?:[/])?)"|'([^']*[/]manga[/][a-z0-9-]+(?:[/])?)')[^>]*>([\s\S]{0,800}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null && out.length < max) {
    const href = m[1] !== undefined ? m[1] : m[2];
    const mm = href.match(/[/]manga[/]([a-z0-9-]+)/i);
    if (!mm) continue;
    const url = "/ms/manga/" + mm[1] + "/";
    const inner = m[3];
    let title = clean(inner.replace(/<[^>]*>/g, " "));
    if (title.length > 120) title = "";
    if (/^(manga|manhwa|manhua|leer)$/i.test(title)) title = "";
    let poster = "";
    const im = inner.match(/<img\b[^>]*>/i);
    const tag = im ? im[0] : "";
    let deAlt = false;
    if (tag) {
      const p = msAttrDe(tag, ["data-background-image", "data-cfsrc", "data-lazy-src", "data-src", "src"]);
      if (p) poster = msAbs(p);
      if (!title) {
        const a = msAttrDe(tag, ["alt"]);
        if (a) { title = clean(a).replace(/^portada de\s+/i, ""); deAlt = true; }
      }
    }
    if (!poster) {
      const antes = html.slice(Math.max(0, m.index - 400), m.index);
      const ims = antes.match(/<img\b[^>]*>/gi) || [];
      const ult = ims.length ? ims[ims.length - 1] : "";
      if (ult) {
        // La portada de OTRA tarjeta no se roba: si entre esa imagen
        // y este enlace se cuela otro enlace, la imagen era de la
        // tarjeta anterior (y la de esta, si el sitio no la trajo,
        // la adivina el slug, que el propio tema guarda siempre igual).
        const medio = antes.slice(antes.lastIndexOf(ult) + ult.length);
        const p2 = msAttrDe(ult, ["data-background-image", "data-cfsrc", "data-lazy-src", "data-src", "src"]);
        if (p2 && !/<a\b/i.test(medio) && !/no-image|placeholder|logo|banner|avatar|icon/i.test(p2)) poster = msAbs(p2);
      }
    }
    if (poster && /no-image|placeholder|logo|banner|avatar|icon/i.test(poster)) poster = "";
    const c = seen[url];
    if (!c) {
      seen[url] = { url: url, title: title || mm[1], poster: poster, slug: mm[1], alt: deAlt && !!title };
      out.push(seen[url]);
    } else {
      // El título del texto del enlace manda sobre el del alt de la
      // imagen (el alt viene en minúsculas a veces).
      if (title && (!c.title || c.title === c.slug || c.alt)) { c.title = title; c.alt = deAlt && !!title; }
      if (poster && !c.poster) c.poster = poster;
    }
  }
  for (let i = 0; i < out.length; i++) {
    if (!out[i].poster) out[i].poster = msCover(out[i].slug);
    delete out[i].slug;
    delete out[i].alt;
  }
  log("MS tarjetas: " + out.length);
  return out;
}

// v0.4.18 — Las populares de la PORTADA del sitio: esa página sí carga
// (quinta prueba: la ventanita la mostró completa) y trae su propia
// sección de populares. Se busca la zona «populares» y se leen las
// tarjetas de ahí; si la marca no apareciera, se lee la página entera.
function msPopularesHome(h, max) {
  h = String(h || "");
  const pos = h.search(/populares/i);
  const zona = pos >= 0 ? h.slice(pos, pos + 60000) : h;
  let out = msCards(zona, max || 20);
  if (!out.length) out = msCards(h, max || 20);
  log("MS populares de portada: " + out.length);
  return out;
}

// El buscador de Mangas.in es un servicio JSON (/search?q=…):
// devuelve sugerencias {value: título, data: slug}. El sitio exige
// al menos 3 caracteres: con menos no responde nada.
async function msBuscar(q) {
  const qq = String(q || "").trim();
  if (qq.length < 3) return [];
  const txt = await getHtmlDe(fuentePorId("mangasin"), "/search?q=" + encodeURIComponent(qq));
  let j = null;
  try { j = JSON.parse(txt); } catch (e) {
    log("MS búsqueda sin JSON (" + txt.length + "): " + txt.slice(0, 80));
    return [];
  }
  // El sitio devuelve la LISTA PLANA [{value,data}]; otras veces la
  // trae envuelta ({suggestions:[…]}): se aceptan las dos formas.
  const sug = Array.isArray(j) ? j : (j && (j.suggestions || j.data)) || [];
  const out = [];
  for (let i = 0; i < sug.length && out.length < 30; i++) {
    const s = sug[i];
    if (!s || !s.data || !s.value) continue;
    out.push({ url: "/ms/manga/" + s.data + "/", title: clean(s.value), poster: msCover(s.data) });
  }
  log("MS búsqueda «" + qq + "»: " + out.length);
  return out;
}

// El catálogo (/filterList) ordena por visitas o por nombre. Si el
// sitio le contesta con su revisión (el 403 de la prueba real en el
// teléfono), las mismas tarjetas se sirven del catálogo público de
// siempre (/manga-list, la página enlazada en el propio sitio) — sin
// orden por visitas, pero de verdad.
async function msCatalog(cat, page1) {
  const f = fuentePorId("mangasin");
  const orden = (cat && cat.order) === "name" ? "name" : "views";
  // v0.4.19 — el catálogo rescatado en la ventanita se guarda 30 min:
  // si las listas siguen cerradas, la próxima entrada al catálogo sale
  // del almacén, sin repetir intentos ni abrir otra ventanita. Y si la
  // galleta ya demostró no abrir estas puertas, no se martilla con
  // reintentos vanos: directo a la ventanita.

  const clave = "msCat:" + orden + ":" + page1;
  const inutil = msGalletaInutilFresca();
  const cache = getJson(clave, null);
  if (cache && Array.isArray(cache.items) && cache.items.length &&
      Date.now() - (cache.ts || 0) < 1800000 && (inutil || !getJson("msCookies", null))) {
    log("MS catálogo desde caché de rescate: " + cache.items.length);
    return { items: cache.items, mas: true };
  }
  let html = "";
  if (inutil) {
    // La galleta ganada no sirve (probado en vivo): la página sale de
    // la ventanita y punto — los seis intentos de siempre solo gastan
    // doce segundos de la persona.
    const res = await msVentanaRescate(f, true, "/manga-list?page=" + page1);
    if (res && res.html) {
      html = res.html;
      log("MS catálogo desde la ventana de rescate");
    } else if (res && res.galleta) {
      try {
        html = await getHtmlDe(f, "/filterList?page=" + page1 + "&sortBy=" + orden +
          "&asc=" + (orden === "name" ? "true" : "false"));
      } catch (e3) {
        log("MS catálogo tras revisión: " + ((e3 && e3.message) || e3));
        setJson("msGalletaInutil", Date.now());
        throw e3;
      }
    } else {
      throw kino.error("network", "HTTP 403", {
        userMessage: "La ventanita no entregó la página del catálogo. Vuelve a entrar al catálogo en un rato.",
      });
    }
  } else try {
    html = await getHtmlDe(f, "/filterList?page=" + page1 + "&sortBy=" + orden +
      "&asc=" + (orden === "name" ? "true" : "false"));
  } catch (e) {
    log("MS catálogo filterList bloqueado (" + ((e && e.message) || e) + "): probando /manga-list");
    try {
      html = await getHtmlDe(f, "/manga-list?page=" + page1);
    } catch (e2) {
      // v0.4.18 — también el catálogo público cerrado: la ventana de
      // rescate abre ESTA página bloqueada (las listas), con dos redes:
      // el HTML que Kino entrega de la página cargada, y si el sitio
      // pidió revisión allí, la galleta para reintentar.
      log("MS catálogo /manga-list también bloqueado (" + ((e2 && e2.message) || e2) + ")");
      // v0.4.19 — con galleta en la mano y las puertas aún cerradas,
      // queda anotado: esta galleta no abre las listas.
      if (getJson("msCookies", null)) setJson("msGalletaInutil", Date.now());
      const res = await msVentanaRescate(f, true, "/manga-list?page=" + page1);
      if (res && res.html) {
        html = res.html;
        log("MS catálogo desde la ventana de rescate");
      } else if (res && res.galleta) {
        try {
          html = await getHtmlDe(f, "/filterList?page=" + page1 + "&sortBy=" + orden +
            "&asc=" + (orden === "name" ? "true" : "false"));

        } catch (e3) {
          log("MS catálogo tras revisión: " + ((e3 && e3.message) || e3));
          setJson("msGalletaInutil", Date.now());
          throw e3;
        }
      } else throw e2;
    }
  }
  const items = msCards(html, CAT_POR_PAG);
  // v0.4.19 — lo rescatado se guarda: 30 minutos de catálogo sin
  // ventanita y sin intentos.
  if (items.length) setJsonCache(clave, { ts: Date.now(), items: items });
  return { items: items, mas: items.length > 0 };
}

// Metadatos de la página de una serie: título, sinopsis y portada.
// v0.4.15 — el título sale de la cabecera del tema oficial
// (.listmanga-header o .widget-title, en ese orden): el respaldo
// genérico de antes agarraba el primer <h1> de la página, que es el
// LOGO del sitio — por eso TODAS las series salían como «M440.in».
function msMeta(html, slug) {
  const h = String(html || "");
  const pick = (re) => { const m = h.match(re); return m ? clean(m[1]) : ""; };
  let title = "";
  // 1) La cabecera del tema: un bloque listmanga-header con el título
  //    dentro (en un <h1>/<h2> o como texto directo).
  const hTem = h.match(/class="[^"]*listmanga-header[^"]*"[^>]*>([\s\S]{2,1600}?)<\/div>/i);
  if (hTem) {
    const inH = hTem[1].match(/<h[1-3]\b[^>]*>([\s\S]{2,300}?)<\/h[1-3]>/i);
    if (inH) title = clean(inH[1].replace(/<[^>]*>/g, " "));
    else {
      const tx = hTem[1].replace(/<[^>]*>/g, "\n");
      const l1 = tx.split("\n").map(function (x) { return clean(x); }).filter(Boolean)[0];
      if (l1) title = l1;
    }
  }

  // 2) La otra forma del tema: un encabezado con clase widget-title.
  if (!title) {
    const hWid = h.match(/<h[1-3]\b[^>]*class="[^"]*widget-title[^"]*"[^>]*>([\s\S]{2,300}?)<\/h[1-3]>/i);
    if (hWid) title = clean(hWid[1].replace(/<[^>]*>/g, " "));
  }
  // 3) La etiqueta og:title del sitio.
  if (!title) title = pick(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i) ||
    pick(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/i);
  // 4) Último recurso: cualquier <h1>/<h2> que NO sea el logo del sitio.
  if (!title) {
    const h1s = h.match(/<h[12]\b[^>]*>([\s\S]{2,200}?)<\/h[12]>/gi) || [];
    for (let i = 0; i < h1s.length && !title; i++) {
      const t = clean(h1s[i].replace(/<[^>]*>/g, " "));
      if (t && !/m440\.in/i.test(t) && !/^mangas?\.?\s*in$/i.test(t)) title = t;
    }
  }
  title = title.replace(/\s*[|–—]+\s*(mangas[.]in|m440[.]in).*$/i, "").trim();
  if (/^(?:mangas?\.?\s*in|m440\.in)$/i.test(title)) title = "";
  let poster = "";
  // La portada: entre las img-responsive de la página, la que apunte
  // al /cover/ del tema (la receta del tema oficial); de no estar, la
  // primera que no sea adorno. La de relleno (no-image) no vale.
  const ims = h.match(/<img\b[^>]*img-responsive[^>]*>/gi) || [];
  for (let i = 0; i < ims.length && !poster; i++) {
    const u = msAttrDe(ims[i], ["data-background-image", "data-cfsrc", "data-lazy-src", "data-src", "src"]);
    if (u && /cover/i.test(u) && !/no-image|placeholder/i.test(u)) poster = msAbs(u);
  }
  for (let i = 0; i < ims.length && !poster; i++) {
    const u = msAttrDe(ims[i], ["data-background-image", "data-cfsrc", "data-lazy-src", "data-src", "src"]);
    if (u && !/no-image|placeholder|logo|banner|icon|avatar/i.test(u)) poster = msAbs(u);
  }
  if (!poster) poster = pick(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
    pick(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
  if (!poster || /no-image|placeholder/i.test(poster)) poster = msCover(slug);
  let overview = "";
  const well = h.match(/class="[^"]*well[^"]*"[^>]*>([\s\S]{0,4000}?)<\/div>/i);
  if (well) overview = clean(well[1].replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, " ").replace(/<[^>]*>/g, " "));
  if (!overview) overview = pick(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
    pick(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
  return { title: title || "Serie", poster: poster, overview: overview.slice(0, 600) };
}


// La serie completa: metadatos + capítulos (la lista cifrada). Si la
// lista no se puede abrir, se devuelve el aviso honesto en vez de
// fingir una serie vacía.
async function msSerie(url) {
  const f = fuentePorId("mangasin");
  const slug = msSlugDe(url);
  if (!slug) return { meta: { title: "Serie", poster: "", overview: "" }, chapters: [], aviso: "Esa serie de Mangas.in no tiene una dirección válida." };
  const html = await getHtmlDe(f, "/manga/" + slug);
  const meta = msMeta(html, slug);
  const caps = await msCaps(html, slug);
  if (!caps) {
    // El aviso DISTINGUE los dos casos (se ve en el Registro):
    // bloque presente pero indescifrable = el sitio cambió la llave;
    // bloque ausente = la revisión del sitio tapando la página.
    const blob = msBlobDe(html);
    log("MS sin capítulos para " + url + " (bloque " + (blob ? "cifrado presente" : "ausente") + ")");
    return { meta: meta, chapters: [], aviso: blob
      ? "Mangas.in trae su lista de capítulos cifrada y esta vez no pude abrirla: el sitio cambió su llave. Mándame una captura del Registro y la renuevo."
      : "Mangas.in no entregó la página de esta serie con su lista (parece su revisión anti-robot tapándola). Prueba de nuevo en un rato y, si sigue igual, mándame una captura del Registro." };
  }
  caps.sort(function (a, b) {
    const fa = parseFloat(a.num), fb = parseFloat(b.num);
    if (isFinite(fa) && isFinite(fb) && fa !== fb) return fa - fb;
    return String(a.num).localeCompare(String(b.num));
  });
  log("MS capítulos: " + caps.length);
  return { meta: meta, chapters: caps.slice(0, MAX_CAPS_MS) };
}

// Las páginas del capítulo: las <img> de la zona «#all» del lector del
// tema (con clase img-responsive), respetando el orden del sitio.
// v0.4.15 — tres arreglos de la prueba real: (1) los atributos pueden
// venir con comillas simples y el rastreo de antes solo veía dobles
// (de ahí el «1 página» que además no cargaba); (2) la dirección falsa
// «https://<base64>» de los capítulos viejos guarda la dirección real
// codificada porcentaje a porcentaje — se destapa y se descodifica las
// dos veces, como hacen las apps que leen el sitio; (3) el loading.gif
// del tema (el src de relleno mientras carga) ya no se cuela por
// página: la dirección de datos (data-src) manda sobre la de relleno.
function imgsMS(html) {
  const h = String(html || "");
  let zona = h;
  const iAll = h.search(/id=(?:"all"|'all')/i);
  if (iAll >= 0) zona = h.slice(iAll);
  const out = [];
  const seen = {};
  const re = /<img\b[^>]*>/gi;
  let m;
  let nImgs = 0;
  let nResp = 0;
  while ((m = re.exec(zona)) !== null && out.length < 250) {
    const tag = m[0];
    nImgs++;
    const resp = /img-responsive/i.test(tag);
    if (resp) nResp++;
    // La dirección de datos primero (la que el tema carga de verdad);
    // el src de puro relleno, al final.
    let u = msAttrDe(tag, ["data-src", "data-lazy-src", "data-background-image", "data-cfsrc", "src"]).trim();
    if (!u || /^data:/i.test(u)) continue;
    // Capítulo viejo: «https://» falso + base64 de la dirección real
    // (de Blogspot) codificada porcentaje a porcentaje.
    if (/^https?:\/\/[A-Za-z0-9+/_=-]{20,8192}$/.test(u)) {
      try {
        const dec = msStrDeBytes(deB64(u.replace(/^https?:\/\//, "")));
        if (dec) {
          let d2 = dec;
          try { d2 = decodeURIComponent(dec); } catch (e) { d2 = dec; }
          if (/^https?:\/\//i.test(d2) || /^https?%/i.test(dec)) u = d2;
        }
      } catch (e) { }
    }
    if (!/^https?:/i.test(u)) u = msAbs(u);
    // Página de verdad: la marca del tema (/chapters/, donde guarda
    // TODAS las páginas de sus capítulos) o el Blogspot de los
    // capítulos viejos. Anillos de anuncios y logos se quedan fuera.
    if (!/\/chapters\/|\.bp\.blogspot\.com/i.test(u)) continue;
    if (seen[u] || /loading\.gif|logo|banner|icon|avatar|placeholder|1x1/i.test(u)) continue;
    seen[u] = 1;
    out.push(u);
  }
  // v0.4.17 — todas las casas donde viven las páginas del capítulo
  // (la cuarta prueba real solo anotaba la primera; los capítulos
  // fallidos no decían dónde vivían sus imágenes).
  const hosts = {};
  for (let i = 0; i < out.length; i++) hosts[out[i].replace(/^https?:\/\//, "").split("/")[0]] = 1;
  log("MS lector: " + out.length + " páginas [" + Object.keys(hosts).join(", ") + "] (" +
    nResp + " resp de " + nImgs + " imgs en la zona)");
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
    setJsonCache("dims", all);
  } catch (e) { log("dims: " + e); }
}

// v0.4.16 — Las imágenes de Mangas.in (y las viejas de Blogspot) se
// piden con cara de navegador: el sitio les niega el paso a las
// peticiones desnudas (Referer de la casa, disfraz de navegador —el
// mismo que ganó la galleta, si ya se ganó— y la galleta misma). Y si
// una no baja, el Registro anota el PORQUÉ una sola vez por imagen:
// permiso, 403, conexión cortada… con eso se afina, no se adivina.
const msImgFalladas = {};
async function dimsDeImagen(url) {
  const u = String(url || "");
  try {
    const ops = { maxBytes: 16384, timeoutMs: 5000 };
    if (/m440\.in|bp\.blogspot\.com/i.test(u)) {
      ops.headers = {
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent": getJson("msUA", "") || UA_MOVIL,
        Referer: MS_BASE + "/",
      };
      const g = getJson("msCookies", null);
      if (g && typeof g === "object") {
        const par = [];
        for (const k in g) if (g[k]) par.push(k + "=" + g[k]);
        if (par.length) ops.headers.Cookie = par.join("; ");
      }
    }
    const r = await kino.fetch(url, ops);
    if (!r.ok) {
      // v0.4.17 — el porqué de CADA imagen que no baje, de cualquier
      // casa (la cuarta prueba real mostró capítulos que fallaban sin
      // dejar rastro porque el diagnóstico solo miraba a Mangas.in).
      if (!msImgFalladas[u]) {
        msImgFalladas[u] = 1;
        log("dims imagen HTTP " + r.status + " (" + u.replace(/^https?:\/\//, "").split("/")[0] + "): " + u.slice(0, 120));
      }
      return null;
    }
    const d = dimsDeBytes(deB64(r.base64()));
    return d && d.w > 0 && d.h > 0 ? d : null;
  } catch (e) {
    if (!msImgFalladas[u]) {
      msImgFalladas[u] = 1;
      log("dims imagen no bajó (" + u.replace(/^https?:\/\//, "").split("/")[0] + "): " + ((e && e.message) || e));
    }
    return null;
  }
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
  let msPopBloqueada = false;
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
  } else if (f.id === "mangasin") {
    // Portada de Mangas.in: populares (su catálogo por visitas) y
    // novedades (el servicio «lasted» que alimenta la propia web).
    titPop = "Populares de Mangas.in"; titPopEn = "Popular on Mangas.in";
    titRec = "Novedades de Mangas.in"; titRecEn = "New on Mangas.in";
    // v0.4.19 — atajos honestos: si hay populares guardadas de la
    // portada del sitio (menos de media hora) Y la galleta no sirve (o
    // no hay), se usan sin repetir los seis intentos que ya se saben
    // fallidos; si la galleta no sirve y no hay nada guardado, directo
    // a la portada del sitio, que la sexta prueba demostró que SÍ
    // carga. Aquí nunca se abre ventanita: es una carga de fondo.
    const cachePop = getJson("msPopHome", null);
    const inutil = msGalletaInutilFresca();
    const cacheFresca = !!(cachePop && Array.isArray(cachePop.items) && cachePop.items.length &&
      Date.now() - (cachePop.ts || 0) < 1800000);
    if (cacheFresca && (inutil || !getJson("msCookies", null))) {
      populares = cachePop.items.slice(0, 20);
      log("MS home pop desde caché: " + populares.length);
    } else if (inutil) {
      try {
        populares = msPopularesHome(await getHtmlDe(f, "/"), 20);
        if (populares.length) setJson("msPopHome", { ts: Date.now(), items: populares });
      } catch (e3) {
        log("MS home pop portada también falló: " + ((e3 && e3.message) || e3));
      }
      if (!populares.length && cachePop && Array.isArray(cachePop.items) && cachePop.items.length) {
        populares = cachePop.items.slice(0, 20);
        log("MS home pop desde caché vieja: " + populares.length);
      } else if (!populares.length) {
        msPopBloqueada = true;
        log("MS home pop portada sin tarjetas: botón de rescate en la portada");

      }
    } else try {
      populares = msCards(await getHtmlDe(f, "/filterList?page=1&sortBy=views&asc=false"), 20);
    } catch (e) {
      // v0.4.15 — el sitio le contestó con su revisión al catálogo por
      // visitas (el 403 de la prueba real): las mismas tarjetas se
      // sirven del catálogo público de siempre (/manga-list).
      log("MS home pop filterList bloqueado (" + ((e && e.message) || e) + "): probando /manga-list");
      try {
        populares = msCards(await getHtmlDe(f, "/manga-list?page=1"), 20);
      } catch (e2) {
        // v0.4.18 — también el catálogo público cerrado: queda la
        // PORTADA del sitio, que la quinta prueba demostró que SÍ
        // carga (la ventanita la mostró completa) y trae su propia
        // sección de populares. Aquí NO se intenta la ventanita: Kino
        // solo la abre cuando la PERSONA toca algo y esta es una
        // carga de fondo; si la portada tampoco da tarjetas, el botón
        // de rescate queda plantado en la portada de Kino.
        // v0.4.19 — con galleta en la mano y las puertas aún cerradas,
        // queda anotado: esta galleta no abre las listas.
        if (getJson("msCookies", null)) setJson("msGalletaInutil", Date.now());
        try {
          populares = msPopularesHome(await getHtmlDe(f, "/"), 20);
          if (populares.length) setJson("msPopHome", { ts: Date.now(), items: populares });
        } catch (e3) {
          log("MS home pop portada también falló: " + ((e3 && e3.message) || e3));
        }
        if (!populares.length) {
          const vieja = cachePop && cachePop.items ? cachePop.items : [];
          if (vieja.length) {
            populares = vieja.slice(0, 20);
            log("MS home pop desde caché vieja: " + populares.length);
          } else {
            msPopBloqueada = true;
            log("MS home pop /manga-list también bloqueado (" + ((e2 && e2.message) || e2) + "): botón de rescate en la portada");
          }
        }
      }
    }
    try {
      // Pausa entre las dos preguntas de la portada: el sitio atiende
      // mejor a quien no se las mete seguidas (así lo hacen sus otras apps).
      await kino.sleep(900);
      const j = JSON.parse(await getHtmlDe(f, "/lasted?p=1"));
      const datos = (j && j.data) || [];
      recientes = [];
      for (let i = 0; i < datos.length && i < 20; i++) {
        const x = datos[i] || {};
        if (!x.manga_slug) continue;
        recientes.push({ url: "/ms/manga/" + x.manga_slug + "/", title: clean(x.manga_name), poster: msCover(x.manga_slug) });
      }
    } catch (e) { log("MS home rec: " + e); }
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
  // v0.4.17 — Mangas.in con sus listas cerradas: el botón de la
  // revisión donde deberían estar las populares. La persona lo toca,
  // Kino abre su ventanita sobre el catálogo bloqueado (toque =
  // contexto legal) y la portada se recarga con sus series.
  const msAviso = msPopBloqueada ? [
    { type: "Text", text: titPop, textEn: titPopEn, style: "h3", padding: 16 },
    { type: "Card", key: "msRevision", flush: true, onTap: { event: "msRevision" },
      children: [
        { type: "Text", text: "Mangas.in tiene sus listas cerradas",
          textEn: "Mangas.in has its lists closed", style: "h3", padding: 16 },
        { type: "Text",
          text: "Toca aquí: se abre el catálogo del sitio en una ventanita. Espera a que cargue, toca «Listo» y las populares salen de esa página.",
          textEn: "Tap here: the site catalog opens in a small window. Wait for it to load, tap \"Done\" and the popular list comes from that page.",
          style: "caption", color: "muted", padding: 16 },
      ] },
  ] : [];
  if (!populares.length && !recientes.length && !mixtas.length && !msAviso.length) return VACIO_SERIES;
  return { type: "SingleChildScrollView", key: "home", children: []
    .concat(fuentes)
    .concat(railHist)
    .concat(msAviso)
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
  // v0.4.20 — el diagnóstico de la séptima prueba cerró el caso: Kino
  // no puede DIBUJAR las páginas de Mangas.in (el sitio las niega a su
  // pintor de imágenes porque no sabe presentarse). La nota honesta lo
  // dice arriba, con el botón «leer en ventanita» al lado (el lector
  // del propio sitio SÍ las enseña). Si el sitio no entregó ninguna
  // página ni siquiera para medir, el aviso de v0.4.17 sigue mandando
  // — ahora con el mismo botón.
  const esMs = d && d.url && d.url.indexOf("/ms/") === 0;
  const btnVentanaLeer = { type: "TextButton", key: "btnLeerVentana", labelText: "Leer en ventanita",
    labelTextEn: "Read in the small window", onPressed: "msLeerVentana" };
  const notaMs = (esMs && medidas.length) ? [
    { type: "Column", padding: 12, gap: 8, crossAxisAlignment: "center", children: [
      { type: "Text",
        text: "Kino no puede dibujar las páginas de Mangas.in: el sitio solo las sirve a quien sabe presentarse, y su pintor de imágenes no puede hacerlo. Toca «Leer en ventanita» y se abren en el lector del propio sitio.",
        textEn: "Kino cannot draw Mangas.in's pages: the site only serves them to identified requests, and its image painter cannot identify itself. Tap «Read in the small window» and they open on the site's own reader.",
        style: "caption", color: "muted" },
      Object.assign({}, btnVentanaLeer, { key: "btnLeerVentanaNota" }),
    ] },
  ] : [];
  const avisoMs = (esMs && !medidas.length) ? [
    { type: "Column", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
      { type: "Text", text: "El sitio no entregó ninguna de las " + r.images.length + " páginas.",
        textEn: "The site served none of the " + r.images.length + " pages.", style: "h4" },
      { type: "Text",
        text: "Si las listas de Mangas.in siguen cerradas, ábrelas desde la portada (el botón «Mangas.in tiene sus listas cerradas») y vuelve a abrir el capítulo. Si ya lo hiciste, manda el Registro: dirá el motivo exacto.",
        textEn: "If Mangas.in's lists are still closed, open them from home (the «Mangas.in has its lists closed» button) and reopen the chapter. If already done, send the log: it will say the exact reason.",
        style: "caption", color: "muted" },
      Object.assign({}, btnVentanaLeer, { key: "btnLeerVentanaAviso" }),
    ] },
  ] : [];
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
  const body = notaMs.concat(avisoMs).concat([
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
    ].concat(esMs ? [btnVentanaLeer] : []).concat(pagesDisponible() ? [
      { type: "TextButton", key: "btnModo", labelText: modo === "paginas" ? "Modo tira" : "Modo páginas",
        labelTextEn: modo === "paginas" ? "Strip mode" : "Page mode", onPressed: "modoLector" },
    ] : []).concat([
      { type: "Text", text: barraTexto,
        style: "caption", color: "muted" },
    ]) },
  ]);
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
const ORDEN_MS = [["views", "Populares"], ["name", "A-Z"]];
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
  } else if (f.id === "mangasin") {
    drops = [catDrop("Orden", "catOrder", ORDEN_MS, c.order, "catOrder")];
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
  } else if (f.id === "mangasin") {
    const r2 = await msCatalog(cat, page1);
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
    if (route.name === "vincular") return vincularTree();
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
    // v0.4.18 — el botón de rescate: la PERSONA toca (contexto legal
    // para la ventanita) y esta abre EL CATÁLOGO BLOQUEADO, no la
    // portada (que no pide revisión ninguna). Dos caminos de salida:
    // el HTML de la página cargada (tarjetas leídas aquí mismo) o la
    // galleta de la revisión, si el sitio la pidió allí.
    if (name === "msRevision") {
      const fMs = fuentePorId("mangasin");
      const r = await msVentanaRescate(fMs, true, "/manga-list?page=1");
      if (r) {
        let pop = r.html ? msCards(r.html, 20) : [];
        let inutilAhora = false;
        if (!pop.length && r.galleta) {
          try { pop = msCards(await getHtmlDe(fMs, "/filterList?page=1&sortBy=views&asc=false"), 20); }
          catch (e4) {
            try { pop = msCards(await getHtmlDe(fMs, "/manga-list?page=1"), 20); }
            catch (e5) { log("MS revisión: listas aún bloqueadas: " + ((e5 && e5.message) || e5)); }
          }
          // v0.4.19 — la revisión se pasó, la galleta llegó, pero las
          // listas siguen cerradas para el plugin: queda anotado para
          // no repetir el intento en cada portada.
          if (!pop.length) { setJson("msGalletaInutil", Date.now()); inutilAhora = true; }
        }
        if (pop.length) setJson("msPopHome", { ts: Date.now(), items: pop });
        return { state: { detail: null, reader: null, results: null, resultsQ: null },
          toast: pop.length
            ? "✓ Mangas.in desbloqueado: " + pop.length + " populares."
            : (inutilAhora
              ? "La revisión pasó, pero su galleta no abre las listas del sitio: las series saldrán de la portada y del catálogo en ventanita."
              : (r.galleta
                ? "✓ Revisión superada: Mangas.in desbloqueado."
                : "La página cargó pero sin series: manda el Registro.")) };
      }
      return { toast: "La ventanita no entregó la página: vuelve a tocar el botón en un rato." };
    }
    // v0.4.20 — «leer en ventanita»: la PERSONA toca (contexto legal
    // para la ventana) y el capítulo abierto en el lector se muestra
    // en la ventanita de navegador, donde el sitio SÍ sirve sus
    // imágenes. No se recoge nada: solo se lee. Al cerrar, el lector
    // sigue donde estaba (el capítulo ya quedó registrado en
    // AniTrack al abrirlo).
    if (name === "msLeerVentana") {
      const d = state.detail;
      const rS = state.reader || {};
      const idx = parseInt(rS.idx, 10) || 0;
      const ch = d && Array.isArray(d.chapters) ? d.chapters[idx] : null;
      if (!ch || !ch.url || String(ch.url).indexOf("/ms/") !== 0)
        return { toast: "No hay un capítulo de Mangas.in abierto en el lector." };
      const fMs = fuentePorId("mangasin");
      const r = await msVentanaLeer(ch, fMs);
      if (r.st === "sin-ventanita")
        return { toast: "Este Kino no trae la ventanita de navegador: actualiza la app." };
      if (r.st === "timeout")
        return { toast: "La ventanita se cerró sola a los 10 minutos: vuelve a tocar «Leer en ventanita» para seguir donde ibas." };
      if (r.st === "done" || r.st === "closed")
        return { toast: "Ventanita cerrada. Toca «Leer en ventanita» si quieres seguir con otro capítulo." };
      return { toast: "La ventanita no se pudo abrir: inténtalo de nuevo en un rato." };
    }
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
      try {
        if (f.id === "mangadex") results = await mdSearch(tituloAL);
        else if (f.id === "inmanga") results = await imBuscar(tituloAL);
        else if (f.id === "mangaoni") results = await moBuscar(tituloAL);
        else if (f.id === "mangasin") results = await msBuscar(tituloAL);
        else {
          const ruta = f.id === "lectorxd"
            ? "/catalogo?filters=true&orderBy=recent&search=" + encodeURIComponent(tituloAL)
            : "/?s=" + encodeURIComponent(tituloAL);
          const html = await getHtmlDe(f, ruta);
          results = cardsDe(f, html, 30);
        }
      } catch (e) {
        return { toast: (e && e.userMessage) || ("No se pudo buscar en " + f.nombre + ".") };
      }
      // Vínculo exacto: solo si la fuente tiene la serie con el MISMO
      // título (normalizado) se guarda el vínculo ya, sin esperar a la
      // mano — el registro pasa a ser exacto, nunca por parecido.
      let vinUrl = "", vinTitulo = "";
      const qAL = normTituloMD(tituloAL);
      if (qAL) {
        for (let i = 0; i < results.length; i++) {
          const it = results[i];
          if (it && it.url && normTituloMD(it.title) === qAL) {
            setJson("alId:" + it.url, { al: m.id, mal: m.mal || 0 });
            vinUrl = it.url;
            vinTitulo = it.title || "";
            break;
          }
        }
      }
      // v0.4.12 — pantalla de vinculación: el título de AniList casi
      // nunca es el que la fuente muestra en español; aquí la persona
      // busca con SU título y toca la serie correcta.
      const vin = { al: m.id, mal: m.mal || 0, titulo: tituloAL,
        q: tituloAL, fuente: f.id, res: results.slice(0, 30),
        linked: vinUrl, linkedTitle: vinTitulo };
      if (!setJsonCache("vin", vin)) {
        return { toast: "El almacén del plugin está lleno: no pude abrir la vinculación." };
      }
      return { state: { vinTk: Date.now() }, route: { push: "vincular" },
        toast: vinUrl
          ? "✓ Vinculada automáticamente: si no es la serie que lees, búscala abajo con el título en español."
          : "Elige tu fuente, busca con el título en español y toca la serie correcta." };
    
    }
    if (name === "vinFuente") {
      const v = getJson("vin", null) || {};
      v.fuente = fuentePorId(String(ev.value || "")).id;
      if (!setJsonCache("vin", v)) return { toast: "El almacén del plugin está lleno: no pude guardar la fuente." };
      return { state: { vinTk: Date.now() } };
    }
    if (name === "vinBuscar") {
      const v = getJson("vin", null);
      if (!v || typeof v !== "object" || !v.al) return { toast: "La vinculación expiró: vuelve a tocar la serie en AniList." };
      const q = String((ev.value && (ev.value.vinQ || ev.value.q)) || "").trim();
      if (!q) return { toast: "Escribe el título tal como aparece en la fuente." };
      const f = fuentePorId(String(v.fuente || fuenteActiva().id));
      let results = [];
      try {
        if (f.id === "mangadex") results = await mdSearch(q);
        else if (f.id === "inmanga") results = await imBuscar(q);
        else if (f.id === "mangaoni") results = await moBuscar(q);
        else if (f.id === "mangasin") results = await msBuscar(q);
        else {
          const ruta = f.id === "lectorxd"
            ? "/catalogo?filters=true&orderBy=recent&search=" + encodeURIComponent(q)
            : "/?s=" + encodeURIComponent(q);
          const html = await getHtmlDe(f, ruta);
          results = cardsDe(f, html, 30);
        }
      } catch (e) {
        return { toast: (e && e.userMessage) || ("No se pudo buscar en " + f.nombre + ".") };
      }
      v.q = q;
      v.res = results.slice(0, 30);
      v.fuente = f.id;
      if (!setJsonCache("vin", v)) return { toast: "El almacén del plugin está lleno: no pude guardar los resultados." };
      return { state: { vinTk: Date.now() },
        toast: results.length
          ? results.length + " resultados en " + f.nombre + ": toca la serie que lees para vincularla."
          : "Sin resultados en " + f.nombre + ": prueba con otro título u otra fuente." };

    }
    if (name === "vinPick") {
      const v = getJson("vin", null);
      if (!v || typeof v !== "object" || !v.al) return { toast: "La vinculación expiró: vuelve a tocar la serie en AniList." };
      const res = Array.isArray(v.res) ? v.res : [];
      const it = res[parseInt(String(ev.arg || ""), 10) || -1];
      if (!it || !it.url) return { toast: "Esa serie ya no está en la lista: busca de nuevo." };
      setJson("alId:" + it.url, { al: v.al, mal: v.mal || 0 });
      v.linked = it.url;
      v.linkedTitle = it.title || "";
      setJsonCache("vin", v);
      return { state: { vinTk: Date.now() },
        toast: "✓ «" + String(it.title || "").slice(0, 40) + "» vinculada con «" + String(v.titulo || "").slice(0, 40)
          + "»: cada capítulo que leas se registrará en AniList" + (v.mal ? " y MAL" : "") + "." };
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
      setJsonCache("cat", Object.assign({}, c, { start: ns }));
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
      } else if (f.id === "mangasin") {
        results = await msBuscar(q);
      } else {
        const ruta = f.id === "lectorxd"
          ? "/catalogo?filters=true&orderBy=recent&search=" + encodeURIComponent(q)
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
    // v0.4.9 — un 403 de LectorXd al tocar una serie es el filtro de
    // Cloudflare cerrándole la puerta a ESTA conexión (la portada carga
    // porque la sirve la caché del propio filtro). La llave la tiene la
    // persona: una ventanita para pasar la revisión una vez y reintentar
    // la serie ya con su galleta de acceso. Solo tras su toque (este
    // evento lo es), una ventana por toque, solo LectorXd.
    const msg403 = String((e && e.message) || "");
    if (name === "openSeries" && e && e.code === "network" &&
        (/^HTTP 403/.test(msg403) || msg403 === "conexión cortada")) {
      const url403 = String(ev.arg || "");
      const f403 = fuenteDeUrl(url403);
      if (f403 && (f403.id === "lectorxd" || f403.id === "mangasin")) {
        const paso = await pasarRevision(f403, url403);
        if (paso) {
          try {
            const r2 = await cargarSerie(url403, true);
            if (r2 && r2.state && !r2.toast) r2.toast = "✓ Revisión superada: " + f403.nombre + " desbloqueado.";
            return r2;
          } catch (e2) {
            log("serie tras revisión: " + ((e2 && e2.message) || e2));
            const um2 = (e2 && e2.userMessage) || "";
            return { toast: um2 || "La revisión pasó pero la serie no cargó: vuelve a tocarla." };
          }
        }
      }
    }
    // v0.4.18 — el 403 del catálogo de Mangas.in YA NO abre ventanita
    // aquí: msCatalog hace su propia ventana de rescate (manual, con
    // la página bloqueada de verdad y lectura de su HTML). Abrir dos
    // ventanas seguidas sería martillar a la persona.
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
// no aloja capítulos: al tocar una serie se abre la pantalla de
// VINCULACIÓN (v0.4.12) — se elige la fuente, se busca con el título
// en español y al tocar la serie correcta queda vinculada con los
// ids de AniList/MAL (clave "alId:<url>"): el registro pasa a ser
// exacto porque lo confirma la persona, nunca un parecido. Ante la
// duda no se vincula
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
        { type: "Text", text: "Descubre manga en AniList y tócalo para vincularlo: en la pantalla que se abre, busca con el título en español de tu fuente y toca la serie correcta.",
          textEn: "Discover manga on AniList and tap it to link: on the next screen, search with your source's Spanish title and tap the right series.",
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

// v0.4.12 — VINCULACIÓN A MANO: los títulos de AniList son los
// oficiales (inglés/romaji) y casi nunca coinciden con el título en
// español que pone cada fuente. Esta pantalla (ruta "vincular") abre
// al tocar una serie de AniList: abajo se elige la fuente, se busca
// con el título TAL COMO LO MUESTRA la fuente y al tocar una serie
// se guarda el vínculo "alId:<url>" con los ids de AniList/MAL.
// Desde entonces cada capítulo leído se registra exacto — la
// persona es la que confirma cuál es la serie, nunca un parecido.
function vinCard(it, i) {
  const img = {
    type: "Image", url: it.poster || "", aspect: "2:3",
    alt: it.title, altEn: it.title,
    fallback: { type: "Column", padding: 16, crossAxisAlignment: "center",
      children: [{ type: "Icon", name: "list", color: "muted" }] },
  };
  return {
    type: "Card", key: "vin-" + i, flush: true,
    onTap: { event: "vinPick", arg: String(i) },
    children: [img].concat(twoLines(it.title).map((ln) => (
      { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 }))),
  };

}

function vincularTree() {
  const v = getJson("vin", null);
  if (!v || typeof v !== "object" || !v.al) {
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "Text", text: "Vuelve a la sección de AniList y toca la serie para vincularla.",
        textEn: "Go back to the AniList section and tap the series to link it.",
        color: "muted" },
    ] };

  }
  const fSel = fuentePorId(String(v.fuente || fuenteActiva().id));
  const res = Array.isArray(v.res) ? v.res : [];
  const esc = (s) => String(s || "").slice(0, 60);
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barVin", title: "Vincular con AniList", titleEn: "Link to AniList",
      leading: { type: "IconButton", key: "backFromVin", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "vinBody", children: [{
      type: "Column", children: [
        { type: "Text", text: "En AniList: «" + esc(v.titulo) + "»", textEn: "On AniList: “" + esc(v.titulo) + "”", padding: 16 },
        v.linked
          ? { type: "Text", text: "✓ Vinculada: «" + esc(v.linkedTitle) + "». Toca otra serie si quieres cambiarla.",
              textEn: "✓ Linked: “" + esc(v.linkedTitle) + "”. Tap another series to change it.",
              color: "muted", padding: 16 }
          : { type: "Text", text: "Todavía sin vincular.", textEn: "Not linked yet.", color: "muted", padding: 16 },
        { type: "Text",
          text: "Cada capítulo que leas de la serie vinculada se registra exacto en AniList y MAL.",
          textEn: "Every chapter you read of the linked series is tracked exactly on AniList and MAL.",
          style: "caption", color: "muted", padding: 16 },
        { type: "Row", gap: 8, padding: 16, children: [
          catDrop("Buscar en", "vinFuente", FUENTES.map((x) => [x.id, x.nombre]), fSel.id, "vinFuente"),
        ] },
        { type: "Form", key: "vinForm", onSubmitted: "vinBuscar", gap: 8, padding: 16, children: [
          { type: "TextField", key: "vinQ", kind: "search", value: v.q || "",
            labelText: "Título en " + fSel.nombre, labelTextEn: "Title on " + fSel.nombre,
            hintText: "Tal como aparece en la fuente", hintEn: "As shown on the source" },
          { type: "ElevatedButton", icon: "search", labelText: "Buscar", labelTextEn: "Search", submit: true },
        ] },
        res.length
          ? { type: "ListView", key: "vinGrid",
              columns: { compact: 3, medium: 4, expanded: 6 },
              items: res.map((it, i) => vinCard(it, i)) }
          : { type: "Text",
              text: "Toca una serie para vincularla. Si no aparece, prueba otro título u otra fuente.",
              textEn: "Tap a series to link it. If it does not show up, try another title or source.",
              color: "muted", padding: 16 },
      ] }] },
  };
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
// Título sin los adornos que ponen las fuentes al final — «(Sin
// Censura)», «(Novela)»… — para buscar en MangaDex como la guarda la
// gente: solo se usa como reintento, el título tal cual va primero.
function tituloLimpioMD(t) {
  let s = String(t || "").trim();
  let antes = "";
  while (antes !== s) {
    antes = s;
    s = s.replace(/\s*\([^()]{1,40}\)\s*$/, "").trim();
  }
  return s;
}

async function idsPorTitulo(titulo) {
  const clave = "idsMd:" + titulo.slice(0, 80);
  const cache = getJson(clave, null);
  if (cache && (cache.al || cache.mal)) return cache;
  if (cache && cache.fallo && Date.now() - cache.fallo < 6 * 3600000) return null;
  try {
    const j = await mdJson("/manga?limit=5&title=" + encodeURIComponent(titulo)
      + "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic");
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

// v0.4.11 — mapa de títulos de traductor: cada fuente en español pone
// sus propios títulos («La Academia está condenada», «El regreso del
// genio despreciado»…) y esos nombres no existen en AniList, MAL ni
// MangaDex, aunque las series sí estén allí con su nombre original.
// Este mapa se armó verificando serie por serie la identidad real de
// cada una y sus ids exactos; solo entra lo comprobado: ante la duda,
// una serie no entra y AniTrack sigue con su búsqueda por título —
// nunca se marca una serie equivocada.
const IDS_ESPECIALES = {
  "La Academia está condenada": { al: 0, mal: 172907 },
  "Conquistando La Academia Con Solo Un Cuchillo De Sashimi": { al: 184502, mal: 174162 },
  "El regreso del genio despreciado": { al: 170554, mal: 165084 },
  "Las amigas de mi madrastra": { al: 119648, mal: 0 },
  "Obligado a ser Demonio Celestial": { al: 198252, mal: 0 },
};
// Series de título tan largo que el propio sitio lo corta: se casan por
// prefijo, y el prefijo es lo bastante largo para no confundirse con
// otra serie.
const PREFIJOS_ESPECIALES = [
  { p: "Hazure Skill Soine ga Kakuseishi", ids: { al: 175861, mal: 0 } },
];
function idsEspeciales(titulo, limpio) {
  const t = String(titulo || "").trim();
  const l = String(limpio || "").trim();
  let e = IDS_ESPECIALES[t] || IDS_ESPECIALES[l];
  if (!e) {
    const tl = t.toLowerCase();
    const ll = l.toLowerCase();
    for (const k in IDS_ESPECIALES) {
      if (k.toLowerCase() === tl || k.toLowerCase() === ll) { e = IDS_ESPECIALES[k]; break; }
    }
  }
  if (!e) {
    for (let i = 0; i < PREFIJOS_ESPECIALES.length; i++) {
      const pref = PREFIJOS_ESPECIALES[i].p;
      if (t.slice(0, pref.length) === pref || l.slice(0, pref.length) === pref) { e = PREFIJOS_ESPECIALES[i].ids; break; }
    }
  }
  if (e) log("ids del mapa para «" + t.slice(0, 40) + "»: al " + (e.al || 0) + ", mal " + (e.mal || 0));
  return e || null;
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
    // v0.4.10 — segunda oportunidad: los adornos «(Sin Censura)» y
    // parecidos no los conoce MangaDex, pero el título limpio sí.
    const limpio = tituloLimpioMD(titulo);
    // v0.4.11 — mapa de títulos de traductor: si esta serie vive en
    // AniList y MAL con otro nombre, se usan sus ids verificados sin
    // más búsquedas (el vínculo de la sección AniList sigue mandando).
    const esp = (arg.anilistId || arg.malId) ? null : idsEspeciales(titulo, limpio);
    const idsP = esp
      ? Promise.resolve(esp)
      : (arg.anilistId || arg.malId) ? Promise.resolve(null) : idsPorTitulo(titulo)
      .then(function (ids) {
        if (ids || !limpio || limpio === titulo) return ids;
        return idsPorTitulo(limpio);
      });
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
    // v0.4.8 — un capítulo +18 de LectorXd con aviso pero sin imágenes:
    // ese capítulo sí está cerrado de verdad; mensaje honesto en vez de
    // un fallo mudo.
    if (!images.length && fSer.id === "lectorxd" && /contenido para adultos/i.test(html)) {
      log("LX capítulo +18 sin imágenes servidas: " + ch.url);
      return { toast: "Este capítulo es +18 y LectorXd no entregó sus imágenes: ese sí necesita cuenta en el sitio." };
    }
  }
  if (!images.length) return null;
  images = images.map((x) => (typeof x === "string" ? { url: x } : x));
  await medirImagenes(images, 9000);
  const pend = images.filter((im) => !(im.w > 0 && im.h > 0)).length;
  log("capítulo " + ch.num + " listo: " + images.length + " páginas, " + pend + " sin medir");
  // v0.4.19 — una vez por hora, el diagnóstico que separa las causas del
  // lector en blanco: ¿el sitio de Mangas.in sirve sus imágenes a un
  // pedido SIN presentarse (como el pintor de pantalla de Kino)? Lo que
  // diga el Registro de ESTA prueba es la evidencia para el reporte.
  if (fSer.id === "mangasin") {
    msDiagPresentacion(fSer, "imagen del capítulo", images[0] && images[0].url);
    msDiagPresentacion(fSer, "portada", (d.meta && d.meta.poster) || msCover(msSlugDe(d.url)));
  }
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
  } else if (f.id === "mangasin") {
    const s = await msSerie(url);
    if (s.aviso) return { toast: s.aviso };
    meta = s.meta;
    meta.totalCaps = s.chapters.length;
    // msSerie ya entrega los capítulos del 1 al más nuevo.
    full = s.chapters.slice(0, TOPE_CAPS_SERIE);
  } else {
    const html = await getHtmlDe(f, url);
    if (f.id === "lectorxd") {
    // v0.4.8 — El +18 de LectorXd es un AVISO TAPADO: sin sesión el sitio
    // ya entrega la lista de capítulos debajo del aviso (verificado en una
    // serie +18 real: los capítulos y el lector con sus páginas vienen
    // servidos). Así lo leen las otras apps: sin cuentas, leyendo los datos
    // que ya vinieron. Si la lista no llegara, ahí sí el aviso honesto.
    const adultoLX = /contenido para adultos/i.test(html) && /cambiar tus preferencias/i.test(html);
    if (adultoLX) log("LX serie +18 (aviso tapado, leyendo debajo): " + url);
    meta = metaLX(html);
    const allCaps = capsLX(html);
    if (!allCaps.length && adultoLX) {
      // El aviso venía sin lista debajo: ese contenido sí está cerrado sin
      // cuenta y la persona merece saberlo con franqueza.
      log("LX serie +18 sin capítulos servidos: " + url);
      return { toast: "Esta serie es +18 y LectorXd no entregó su lista de capítulos: esa sí necesita cuenta en el sitio." };
    }
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








