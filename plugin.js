// MangaTrack v0.1.1 — lector de mangas para Kino con pantalla propia.
// Fuente de esta versión: LeerCapitulo (www.leercapitulo.co).
// Requiere Kino 0.9.74 o superior (apiVersion 14, capability "screen").
// Una sola pantalla con rutas (inicio, serie, lector, buscar) y un
// adaptador de scraping por fuente: las próximas fuentes se agregan
// como funciones nuevas sin tocar la interfaz.

const VERSION = "0.1.0";
const FUENTE = "LeerCapitulo";
const BASE = "https://www.leercapitulo.co";
const MAX_CAPS = 490;

// ------------------------------------------------------------------ red

async function getHtml(path) {
  const r = await kino.fetch(BASE + path, { headers: { Accept: "text/html" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con " + FUENTE + ". Inténtalo de nuevo.",
  });
  return r.text();
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
      if (a) title = clean(a[1]);
    }
    if (!title) {
      const texto = clean(inner.replace(/<[^>]*>/g, " "));
      if (texto && texto.length <= 90) title = texto;
    }
    if (!title) title = url.split("/").filter(Boolean).pop() || url;
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

// Metadatos de la página de una serie (etiquetas og: de WordPress)
function seriesMeta(html) {
  const pick = (re) => { const m = html.match(re); return m ? clean(m[1]) : ""; };
  return {
    title: pick(/<h1[^>]*>([\s\S]{1,200}?)<[/]h1>/) || pick(/property="og:title"[^>]*content="([^"]+)"/),
    poster: absoluta(pick(/property="og:image"[^>]*content="([^"]+)"/)),
    overview: pick(/property="og:description"[^>]*content="([^"]+)"/),
  };
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

async function homeTree() {
  const html = await getHtml("/");
  const items = homeCards(html, 40);
  if (!items.length) return VACIO_SERIES;
  return { type: "SingleChildScrollView", key: "home", children: [
    { type: "Text", text: "Series de " + FUENTE, textEn: FUENTE + " series",
      style: "h3", padding: 16 },
    gridOf(items, VACIO_SERIES),
  ] };
}

function detailTree(state) {
  const d = state.detail;
  if (!d) return loadingTree("Cargando serie…");
  const meta = d.meta || {};
  const chapters = Array.isArray(d.chapters) ? d.chapters : [];
  if (!chapters.length) {
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "Icon", name: "error", color: "muted" },
      { type: "Text", text: "No se encontraron capítulos para esta serie.",
        textEn: "No chapters found for this series.", color: "muted" },
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
  const totalTxt = meta.totalCaps > chapters.length
    ? chapters.length + " capítulos (de " + meta.totalCaps + " — los más recientes)"
    : chapters.length + " capítulos";
  items.push({ type: "Text", text: totalTxt,
    textEn: chapters.length + " chapters", style: "h3", padding: 16 });
  for (let i = 0; i < chapters.length; i++) {
    items.push({
      type: "ListTile", key: "cap" + i, dense: true,
      title: "Capítulo " + chapters[i].num,
      onTap: { event: "read", arg: String(i) },
    });
  }
  return {
    type: "Scaffold",
    appBar: { title: String(meta.title || "Serie").slice(0, 30),
      leading: { type: "IconButton", key: "backFromDetail", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "ListView", key: "detailBody", items: items },
  };
}

// Escala de tamaños de Kino: un width/height fuera de esta escala se
// descarta, ¡y con él el nodo entero! La caja se ajusta a la proporción
// real de la página buscando el par de la escala más cercano.
const SIZE_SCALE = [16, 24, 32, 40, 48, 64, 80, 96, 120, 160, 200, 240, 320, 400, 480, 560, 640];
function pageBox(ratio, wCap, hCap) {
  if (!isFinite(ratio) || ratio <= 0) return null;
  for (const tol of [0.02, 0.05, 0.12, 0.25]) {
    let best = null;
    for (const w of SIZE_SCALE) {
      if (w > wCap || w < 80) continue;
      for (const h of SIZE_SCALE) {
        if (h > hCap || h < 96) continue;
        const err = Math.abs(h / w - ratio) / ratio;
        if (err <= tol) {
          const a = w * h;
          if (!best || a > best.a || (a === best.a && err < best.err)) best = { w: w, h: h, a: a, err: err };
        }
      }
    }
    if (best) return { width: best.w, height: best.h };
  }
  return null;
}

function pageNodes(p, i) {
  const url = typeof p === "string" ? p : p.url;
  const img = {
    type: "Image", key: "p" + i, url: url,
    alt: "Página " + (i + 1), altEn: "Page " + (i + 1),
    fallback: { type: "Column", padding: 16, children: [
      { type: "Text", text: "Página " + (i + 1), textEn: "Page " + (i + 1), color: "muted" } ] },
  };
  const w = (p && p.w) || 0;
  const h = (p && p.h) || 0;
  const ratio = w > 0 && h > 0 ? h / w : 0;
  if (ratio >= 1.05 && ratio <= 1.8) {
    const small = pageBox(ratio, 400, 640) || { width: 400, height: 560 };
    const compacto = Object.assign({}, img, { key: "pc" + i, sizes: ["compact"],
      width: small.width, height: small.height });
    const grande = Object.assign({}, img, { key: "pe" + i, sizes: ["medium", "expanded"],
      width: 640, aspect: "2:3" });
    return [compacto, grande];
  }
  if (ratio > 0) {
    const small = pageBox(ratio, 400, 640);
    const big = pageBox(ratio, 640, 640);
    if (small && big) {
      img.width = { compact: small.width, medium: big.width, expanded: big.width };
      img.height = { compact: small.height, medium: big.height, expanded: big.height };
      return [img];
    }
  }
  img.width = { compact: 400, medium: 400, expanded: 480 };
  img.height = { compact: 560, medium: 560, expanded: 640 };
  return [img];
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
  const pageCol = { type: "Column", gap: 4, crossAxisAlignment: "center",
    children: r.images.flatMap((p, i) => pageNodes(p, i)) };
  const body = [
    { type: "SingleChildScrollView", key: scrollKey, flex: 1, children: [pageCol] },
    { type: "Row", gap: 12, padding: 16, mainAxisAlignment: "center", wrap: true, children: [
      { type: "ElevatedButton", icon: "arrow_back", labelText: "Anterior", labelTextEn: "Previous",
        onPressed: "prevChap", enabled: hasPrev },
      { type: "ElevatedButton", labelText: hasNext ? "Siguiente" : "Último capítulo",
        labelTextEn: hasNext ? "Next" : "Last chapter",
        icon: "arrow_forward", onPressed: "nextChap", enabled: hasNext },
    ] },
  ];
  return {
    type: "Scaffold",
    appBar: { title: ch ? "Capítulo " + ch.num : "Leyendo",
      leading: { type: "IconButton", key: "backFromReader", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "Column", children: body },
  };
}

function searchTree(state) {
  const q = typeof state.resultsQ === "string" ? state.resultsQ : "";
  const results = Array.isArray(state.results) ? state.results : null;
  return {
    type: "Scaffold",
    appBar: { title: "Buscar manga", titleEn: "Search manga", actions: [] },
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
  } catch (e) {
    return errorTree("No se pudo cargar (" + ((e && e.code) || "error") + ").");
  }
  const body = await homeTree();
  return {
    type: "Scaffold",
    appBar: { title: "MangaTrack",
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
      const r = ev.route || {};
      if (r.name === "detail") {
        const url = routeUrl(r);
        if (url && /^[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/]$/i.test(url) &&
            (!state.detail || state.detail.url !== url)) {
          return await cargarSerie(url, false);
        }
      }
      return null;
    }
    if (name === "goSearch") return { route: { push: "search" } };
    if (name === "popBack") return { route: { pop: true } };
    if (name === "openSeries") {
      const url = String(ev.arg || "");
      if (!/^[/]manga[/][a-z0-9]{4,}[/][a-z0-9-]+[/]$/i.test(url)) return null;
      return await cargarSerie(url, true);
    }
    if (name === "read" || name === "nextChap" || name === "prevChap") {
      const d = state.detail;
      if (!d || !Array.isArray(d.chapters) || !d.chapters.length) return null;
      let idx;
      if (name === "read") {
        idx = parseInt(String(ev.arg || "0"), 10) || 0;
      } else {
        idx = ((state.reader && state.reader.idx) || 0) + (name === "nextChap" ? 1 : -1);
      }
      if (idx < 0 || idx >= d.chapters.length) return null;
      const ch = d.chapters[idx];
      const html = await getHtml(ch.url);
      const images = readerImages(html);
      if (!images.length) {
        return { toast: "No se pudieron leer las páginas de este capítulo." };
      }
      log("capítulo " + ch.num + " listo: " + images.length + " páginas");
      const resp = { state: { reader: { images: images, idx: idx, tk: Date.now() } } };
      if (name === "read") resp.route = { push: "read" };
      return resp;
    }
    if (name === "search") {
      const q = String((ev.value && ev.value.q) || "").trim();
      if (!q) return { toast: "Escribe un título." };
      const html = await getHtml("/?s=" + encodeURIComponent(q));
      const results = homeCards(html, 30);
      return { state: { results: results, resultsQ: q },
        toast: results.length ? results.length + " resultados" : "Sin resultados" };
    }
    if (name === "retry") return { state: { _r: Date.now() } };
    return null;
  } catch (e) {
    log("error en evento " + name + ": " + ((e && e.message) || e));
    return { toast: "Algo falló (" + ((e && e.code) || "error") + ")." };
  }
}

// Carga la página de una serie y prepara su detalle; si conRuta, empuja la
// pantalla de la serie al terminar.
async function cargarSerie(url, conRuta) {
  const html = await getHtml(url);
  const meta = seriesMeta(html);
  const allCaps = chapterList(html);
  meta.totalCaps = allCaps.length;
  const chapters = allCaps.slice(0, MAX_CAPS).slice().reverse();
  log("serie lista: " + meta.title + " / " + chapters.length + " capítulos");
  if (!chapters.length) return { toast: "No se encontraron capítulos." };
  const resp = { state: { detail: { url: url, meta: meta, chapters: chapters } } };
  if (conRuta) resp.route = { push: "detail", params: { url: url } };
  return resp;
}
