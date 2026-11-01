// MangaTrack v0.1.0 — lector de mangas para Kino con pantalla propia.
// Fuente de esta versión: LeerCapitulo (www.leercapitulo.co).
// Requiere Kino 0.9.74 o superior (apiVersion 14, capability "screen").
// Una sola pantalla con rutas (inicio, serie, lector, buscar) y un
// adaptador de scraping por fuente: las próximas fuentes se agregan
// como funciones nuevas sin tocar la interfaz.
//
// IMPORTANTE: algunas líneas formadas solo por espacios son escudos
// deliberados contra cortes de copiado. No las borres ni las edites.

const VERSION = "0.1.0";
const FUENTE = "LeerCapitulo";
const BASE = "https://www.leercapitulo.co";
const MAX_CAPS = 500;

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
  const reA = /<a[^>]+href="([^"]*\/manga\/[a-z0-9]{4,}\/[a-z0-9-]+\/)"[^>]*>([\s\S]{0,600}?)<\/a>/gi;
  let m;
                                                                            
