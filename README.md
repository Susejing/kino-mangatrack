successfully downloaded text file (SHA: e279fe35fe09ebcace32d17a3190bafe43bfddee)resource# MangaTrack

**MangaTrack** es un plugin de [Kino](https://github.com/kinotvapp/kino-plugins) para leer mangas en español en tu teléfono o tu TV, con pantalla propia: Inicio con rieles, catálogo, buscador, favoritos, historial y un lector con tira vertical o página por página.

No es una web dentro de la app: MangaTrack dibuja sus propias pantallas y lee las páginas de cada sitio para armar sus listas, sus portadas y su lector.

---

## Qué puede hacer

- **Siete fuentes de manga en español e inglés**, para elegir cuál leer en cada serie:
  - **LeerCapitulo** — mangas en español, portada fresca con capítulos recién agregados.
  - **LectorXd** — mangas en español.
  - **MangaDex** — el catálogo grande multilingüe (con capítulos en español).
  - **InManga** — mangas en español.
  - **MangaOni** — mangas en español.
  - **Mangas.in** — manhuas y mangas en español.
  - **ManhwaWeb** — manhuas en español.
- **Descubrir manga con AniList**: una sección con lo popular y lo nuevo de cada temporada; al tocar una serie, MangaTrack busca si alguna de las fuentes la tiene (prueba todos sus nombres y sinónimos, y verifica la identidad con MangaDex) y te lleva directo a ella.
- **Inicio con rieles**: Populares, Recién actualizados, Series añadidas, Seguir leyendo… cada riel tiene su **«Ver más»** que abre la sección entera en cuadrícula cómoda, con ventana de 24 series y botones «‹ Series anteriores / Series siguientes ›». Donde el sitio tiene más páginas de esa sección, un botón **«Cargar más del sitio»** sigue trayendo.
- **Catálogo por fuente**, con filtros (género, estado, orden) donde el sitio los ofrece, y paginación.
- **Buscador** en cada fuente.
- **Favoritos y colecciones**: el corazón guarda series en colecciones propias.
- **Historial**: los últimos capítulos abiertos, con **«Continuar»** para volver justo donde ibas — el lector recuerda la página en la que te quedaste y retoma desde ahí.
- **Lector** en tira vertical o página por página, con zoom, ventanas de capítulos («‹ Capítulos más antiguos / Capítulos más recientes ›») y marcado de leído.
- **Sincronización entre aparatos**: favoritos e historial viajan con la capacidad `shared` (respaldados por la nube de Kino), así lo que lees en el teléfono sigue en la TV.
- **Integración con [AniTrack](https://github.com/Susejing/kino-anitrack)**: si lo tienes instalado, MangaTrack le avisa de cada capítulo leído para llevar tu progreso al día (recomendado, no obligatorio).

## Instalación

1. Actualiza **Kino a 0.9.82 o más nuevo** (recomendado: es la versión cuyo pintor de pantallas dibuja imágenes incrustadas, de la que dependen las portadas y el lector de ManhwaWeb y Mangas.in).
2. En Kino, ve a **Ajustes ▸ Plugins** y agrega el plugin con la dirección de este repo: `github.com/Susejing/kino-mangatrack`.
3. Kino te pedirá aprobar **la lista de hosts** (las direcciones que el plugin puede visitar). Son las de las siete fuentes más sus casas de imágenes y el API de AniList. Apruébalas una por una — sin ellas, esa fuente no puede traer sus listas.
4. Listo: MangaTrack aparece en el menú de Kino (con su icono de marcador) y también entre tus plugins en Ajustes.

## Cómo se usa

- **Inicio**: rieles con lo popular y lo nuevo de la fuente activa. Toca cualquier portada para ver la serie.
- **Detalle de la serie**: portada, sinopsis, lista de capítulos por ventanas y botón **«Empezar a leer»** (capítulo 1) o **«Continuar»** (por donde ibas).
- **Catálogo**: cambia de fuente con los chips, filtra y pasa páginas. «Ver más» desde cualquier riel del Inicio abre aquí la sección completa.
- **Buscador**: escribe y MangaTrack busca en la fuente activa.
- **AniList**: para descubrir manga nuevo. Al tocar una serie se busca en tus fuentes; si aparece, un toque más y ya estás leyendo.
- **Lector**: elige tira vertical o página por página (ajustes del lector); en tira, las páginas llegan por tandas — al acercarte al final llegan las siguientes, o pídelas con **«Bajar más páginas»**.
- **Reportes**: si algo no carga, abre el **Registro** (Ajustes ▸ Registro de MangaTrack): ahí dice qué pasó con cada petición, y es lo primero que hay que mandar al reportar un problema.

## Permisos (capacidades) explicadas

- **`screen`** — dibujar sus propias pantallas dentro de Kino.
- **`shared`** — respaldar favoritos e historial en la nube de Kino para que sigan en otro aparato.
- **`storageLarge`** — un almacén local más grande (16 MB) para guardar las portadas y páginas convertidas; sin red se vuelven a dibujar desde ahí.

No pide cuentas de ningún sitio: lee lo que los sitios sirven sin sesión, como lo hacen las apps de lectura habituales.

## Límites honestos

- **El muro de imágenes de ManhwaWeb y Mangas.in.** Sus casas de imágenes niegan el paso a pedidos que no se presentan. MangaTrack baja cada imagen *con presentación* (como el navegador del teléfono) y la convierte para que el pintor de Kino la dibuje — por eso ahora se ven las portadas. Pero el pintor de Kino solo dibuja imágenes incrustadas de hasta ~150 KB:
  - Las **portadas** casi siempre caben: se ven en Inicio, buscador, catálogo y detalle.
  - Las **páginas** más livianas también se dibujan en el lector; las más pesadas quedan con su hueco y un aviso honesto («demasiado grande para el pintor — se ve con Leer en ventanita»), y las que el muro niega quedan con su aviso y se reintentan con «Bajar más páginas».
  - Para esos casos sigue el botón **«Leer en ventanita»**: abre el capítulo en el navegador integrado de Kino, que no tiene ese tope.
  - Cuando Kino suba el tope de su pintor, esas páginas empezarán a dibujarse solas (el botón «Bajar más páginas» las reintenta a mano en cualquier momento).
- **Las portadas que el muro niega** quedan con su ícono de siempre — nada se rompe, solo no se ve esa imagen.
- Los sitios cambian: si una fuente deja de traer sus listas, el Registro dice qué pasó y con qué dirección; con eso se arregla en la siguiente versión.

## Historial de versiones (lo esencial)

- **0.4.13** — primera versión con pantalla propia.
- **0.4.23–0.4.27** — lector en tira y por páginas con retomar página, «Ver más» en cada sección del Inicio, buscador de LeerCapitulo reparado, capítulos recientes de verdad.
- **0.4.28** — entra **ManhwaWeb** (séptima fuente) y las secciones de «Ver más» paginan.
- **0.4.29** — «Ver más» desde 3 series; portadas de ManhwaWeb visibles (bajar con presentación + convertir a datos incrustados); almacén grande `storageLarge`.
- **0.4.30** — el lector integrado dibuja capítulos de ManhwaWeb y Mangas.in bajando las páginas con presentación y por tandas; portadas de Mangas.in con la misma receta.
- **0.4.31** — páginas «demasiado grandes» marcadas con aviso honesto y sin reintentos inútiles; «Bajar más páginas» reintenta a mano.
- **0.4.32** — icono propio, color de acento e icono de menú; este README.
- **0.4.69** — **pantalla completa real en el lector**: en «Modo páginas» la barra de arriba desaparece del todo — el lector se dibuja como raíz sin AppBar (la receta oficial del lector de Kino); se sale con el Atrás del teléfono.

## Créditos

- Hecho por **Susejing**.
- Los datos de descubrimiento vienen de la API pública de **AniList**.
- Agradecimientos a las siete fuentes; este plugin solo lee lo que ellas publican.

*Los sitios de lectura cambian con el tiempo. Si una fuente falla, revisa el Registro y repórtalo: casi siempre tiene arreglo.*


## Licencia

Código bajo la **GPL-3.0**: puedes usarlo y modificarlo, pero tu versión debe seguir abierta y con crédito. © 2026 **Susejing** (Bogotá, Colombia). El texto completo está en el archivo [LICENSE](LICENSE).
