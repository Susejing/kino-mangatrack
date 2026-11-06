// MangaTrack — lector de mangas multi-fuente para Kino · github.com/Susejing/kino-mangatrack
// Copyright (C) 2026 Susejing
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// MangaTrack v0.4.13 — lector de mangas para Kino con pantalla propia.
// v0.4.65 — RASTREADOR MULTI-FUENTE Y PORTADAS NÍTIDAS. Mi AniList
// dejaba de vincular cuando la fuente activa no respondía (los
// sitios bloquean la conexión a veces): el vínculo se rendía con el
// aviso de conexión ANTES de llegar a la parte buena. Ahora, si la
// fuente activa no trae nada, la búsqueda sigue SOLA en las demás
// fuentes (MangaDex primero — su API es la más confiable) y las
// coincidencias llegan a la pantalla de vincular con la fuente dicha
// en cada tarjeta: toca la que lees y queda sincronizada — la
// manera de rastrear de AchyManga, hecha con las fuentes de siempre
// y sin ningún host nuevo. Y las portadas de Mi AniList y del riel
// «Para ti» pasan de la miniatura «medium» de AniList a la grande
// («extraLarge»): la misma foto, más nítida al estirarse.
// v0.4.64 — SIN NOMBRE REPETIDO EN LAS BARRAS. La captura del
// teléfono de la persona (y el ojo de KinoDev) enseñaron la verdad:
// su Kino aún no conoce la fusión de barras — dibuja la suya (con el
// nombre del plugin y su cerrar) ARRIBA de la del plugin, así que el
// texto "MangaTrack" de esta última hacía que el nombre saliera DOS
// veces. La barra del Inicio ya no escribe el nombre (la de arriba,
// la de Kino, ya lo dice y no se puede quitar: es regla del
// contrato); queda compactísima: el selector de fuente a la
// izquierda y la lupa a la derecha — el buscar «en la barra», como
// pidió KinoDev. mergeWithKinoBar se mantiene para el día en que su
// Kino aprenda a fusionar: entonces esta fila se une con la de
// arriba en una sola.
// v0.4.63 — VUELVEN LAS TARJETAS DEL TEMA (la elección de la persona
// tras probar la 0.4.62 en el teléfono). Las tarjetas del Home de
// Kino traen fondo negro FIJO que el plugin no puede pintar: con el
// tema claro de la persona el resto de la app cambia de color y las
// tarjetas se quedan negras. Nuestras tarjetas de siempre siguen el
// COLOR DEL TEMA de Kino y traen de vuelta la etiquetita «Cap. N»
// bajo el título. SE QUEDA de la 0.4.62: la barra única
// (mergeWithKinoBar) — el nombre sale una vez, con la fuente al
// lado y la lupa en la misma barra, como pidió KinoDev. El logo
// naranja (imagen data URL) se retira: el pintor de la barra solo
// acepta https y en el teléfono de la persona no se dibujaba (Kino
// ponía el nombre de texto en su lugar, que es el look que queda).
// v0.4.62 — EL INICIO ESTRENA LA CARA DE KINO (el consejo de KinoDev
// mirando la portada). (1) UNA sola barra: mergeWithKinoBar junta la
// barra del plugin con la de Kino, y el logo nuevo (la pastilla del
// color naranja del plugin) va donde estaba el nombre — sin
// "MangaTrack" dos veces; la fuente al lado del logo y la lupa en la
// misma barra. (2) Los rieles con las tarjetas del Home de Kino
// (titleCard): marco bonito, altura pareja y títulos sin cortes; el
// «Ver más» sube a la derecha del título, donde lo esperan los dedos.
// Las casas con muro (Mangas.in y ManhwaWeb) conservan su tarjeta de
// siempre: sus portadas viajan con cabeceras o copia local, y la
// tarjeta de Kino solo acepta https pelada.
// v0.4.61 — MÁS ANILIST. (1) El catálogo ya no se corta a las 3
// páginas: caben 240 series («Cargar más» sigue funcionando y se
// retira con honestidad si se llena). (2) GÉNEROS: el desplegable de
// siempre, con los 18 géneros oficiales de AniList — con el buscador
// vacío, un género convierte el catálogo en explorador. (3) Mi AniList
// muestra TODA la lista: cada sección tiene su «Cargar más» que trae
// el siguiente tramo de 60 (el tope pedido se guarda y sobrevive al
// refresco).
// v0.4.60 — MÁS «CARGAR MÁS DEL SITIO». Los rieles «Recientes» de
// LectorXd (el catálogo orderBy=recent, el mismo «Ver todo» de su
// portada) y «Nuevas obras» de ManhwaWeb (la biblioteca ordenada por
// creación, con las +18 de su lista aparte) ahora traen el botón. Las
// demás portadas siguen siendo listas fijas del sitio: sin botón.
// v0.4.58 — MI ANILIST. La petición: «todo lo que he leído y tengo en
// v0.4.59 — LA SINCRONIZACIÓN VUELVE A AVISAR. La puerta "manga" de
// AniTrack murió en silencio en su 0.13.0: el resumen de su manifiesto
// creció a 168 caracteres y el límite del motor es 120 — un bloque de
// enhancements que rompe una regla se descarta ENTERO (docs/protocol.md),
// así que markChapter y progress respondían not_declared y este plugin
// tragaba el error sin decir nada: ni toasts ni marcas en AniList/MAL.
// Tres arreglos: (1) AniTrack 0.13.1 acorta su resumen (la puerta
// revive — esta versión LO NECESITA para volver a sincronizar);
// (2) «whoami» entra por fin en consumes.anitrack.calls: sin
// declararla, el botón «Tomar mi nombre de AniTrack» de Mi AniList
// también daba not_declared; (3) si la puerta rechaza un aviso por
// cualquier otro motivo, el toast ahora lo dice en vez de callar —
// nunca más un fallo mudo.
// mi cuenta de AniList, bien organizado y sincronizado con mis
// colecciones — para mí y para quien apenas empieza». Las listas de
// cada cuenta son PÚBLICAS: con solo el nombre de usuario (escrito a
// mano o tomado de AniTrack vía la llamadita «whoami» de su v0.13.0)
// la sección Mi AniList trae TODO por estado (Leyendo, Completados,
// Por leer, En pausa, Abandonados) SIN iniciar sesión — por eso sirve
// al que recién instala. Lo vinculado abre directo; lo nuevo se toca
// y entra al flujo de vincular de siempre. «Colecciones vivas»
// mantiene 5 colecciones («AniList · …») reemplazándolas completas en
// cada actualización, SOLO con lo vinculado (las manuales quedan
// intactas; las sin vincular se quedan en Mi AniList hasta tocarlas).
// Y «Para ti» aprende de esa lista SOLO cuando el plugin está vacío
// (leyendo pesa 3, completado 2, tope 12): en cuanto la persona
// vincula series propias, manda su historial propio.
// v0.4.57 — EL INICIO VUELVE A DIBUJAR SUS PORTADAS. La 0.4.55/0.4.56
// dejó el Inicio con TODAS las portadas vacías (capturas: ni el riel
// «Para ti» ni las de la fuente dibujaban; las MISMAS tarjetas sí
// dibujaban en el Descubrir) y el log confesaba «para ti gustos:
// HTTP 400» dos veces por tanda. DOS bichos de raíz: (1) paraCard en
// el RIEL llevaba la imagen SIN width — todas las tarjetas de riel
// del plugin ponen width: 120 desde siempre; sin un ancho, la imagen
// queda sin tamaño en el eje infinito del desplazamiento lateral y el
// pintor de esa pantalla se rompía entera (en la cuadrícula la celda
// la acota y por eso el Descubrir sí dibujaba). Ahora el riel la pide
// con width: 120 como sus vecinas. (2) la consulta de gustos declaraba
// $g: [MediaGenre] y AniList espera los géneros como [String] (su
// ejemplo oficial): HTTP 400 seguro, y el respaldo repetía el mismo
// error; ahora van [String], sin géneros no se pregunta y el tag_in
// solo viaja cuando hay tags. Además la cuadrícula del Descubrir usa
// la portada «large» (la medium de la 0.4.56 salía borrosa al
// estirarse en la pantalla del teléfono), la del riel sigue siendo
// la medium chiquita, y la caché de «Para ti» se rearma sola al
// actualizar (pv: 3) para ganar la portada grande y las sugerencias
// de gustos que el 400 se comía. Sin hosts ni capacidades nuevas.
// v0.4.56 — PORTADAS LIGERAS EN «PARA TI». En el teléfono de la
// persona el Inicio se quedó con todas las portadas cargando para
// siempre tras usar «Para ti»: el riel y la pantalla Descubrir pedían
// la portada extraLarge de AniList (hasta ~1 MB por manga) y Kino
// baja las imágenes de 4 en 4, así que la fila de descargas se atascó
// y TODAS las imágenes de la pantalla quedaron esperando detrás —
// incluso las de la fuente, que siempre cargaron. Ahora las
// sugerencias piden la portada medium (~30 KB: el mismo dibujo con
// 20 veces menos peso), el riel muestra 8 en vez de 12 y la caché de
// «Para ti» se rearma sola al actualizar (marca pv: 2) para soltar
// las URLs pesadas que quedaron guardadas. Sin hosts ni
// capacidades nuevas.
// v0.4.55 — PARA TI: EL DESCUBRIMIENTO POR GUSTO. La persona pidió que
// descubrir mangas fuera más cómodo e intuitivo: sugerencias basadas
// en SUS favoritos y demás. La base son sus series (favoritos peso 3,
// colecciones peso 2, historial peso 1), cada una con su id de AniList
// (vínculo «alId:», mapa de títulos verificados o MangaDex por título,
// hasta 6 rescates por tanda con su caché). Con esos ids AniList da
// dos cosas: las recomendaciones de la COMUNIDAD sobre sus series (a
// quien le gustó tu serie, qué le gustó — la voz de miles de lectores
// reales) y los géneros/tags que más se repiten entre ellas (para
// buscar populares parecidos, CON +18: la persona lo eligió así). El
// resultado vive en el almacén 12 h y sale en un riel «Para ti» del
// Inicio + la pantalla «Descubrir» con la lista completa, su porqué y
// «Buscar de nuevo». Tocar una sugerencia abre el mismo flujo de la
// sección AniList: buscarla en la fuente y vincularla exacta. Sin
// series vinculadas, honesto: lo de moda de AniList y el aviso de
// vincular series para afinar. Sin hosts ni capacidades nuevas.
// v0.4.54 — LO VISTO LLEGA AL PLUGIN. La vuelta de la integración con
// AniTrack: hasta ahora el flujo era de una sola mano (leer aquí
// marcaba el capítulo en AniList/MAL); la persona pidió el círculo
// completo — si en AniList o MyAnimeList va por el capítulo 10 o 20,
// que aquí también salga como visto. Al abrir una serie, MangaTrack
// pregunta por la puerta "progress" (nueva en AniTrack 0.11.0)
// cuántos capítulos hay leídos HOY en esas listas y, si van más
// adelantados que el historial local, las marcas ✓ suben hasta ahí
// (el índice absoluto del último capítulo con num <= progreso) y
// «Llevas N de M» se pinta solo. NUNCA baja lo ya leído aquí. Con
// caché por serie (6 h si trajo progreso, 2 h si no) para no repetir
// el pedido en cada apertura; sin AniTrack o sin sesión no pasa nada
// (un mensaje de Registro, no un error). Solo series VINCULADAS
// (ids exactos de AniList/MAL): las de MangaDex los traen solos, las
// demás se vinculan desde la sección AniList.
// v0.4.53 — TODO LO QUE SE ARMA, SUBE. La persona lo recordó con
// razón: las colecciones las pedimos juntos en la 0.4.21 (el corazón)
// y los favoritos viven dentro desde la 0.4.22 — pero la subida a la
// nube solo se disparaba con el corazón de favoritos y las reseñas:
// crear/borrar una colección, meterle o quitarle una serie, y LEER un
// capítulo (el historial) quedaban en el aparato hasta que otra cosa
// subiera o alguien tocara «Sincronizar ahora». Ahora cada cambio de
// colección (crear, borrar, meter, sacar) sube solo, y el historial
// sube al abrir capítulos con FRENO (una subida cada 15 min como
// máximo, para no martillar al bot; «Sincronizar ahora» sube
// siempre). tgSubir anota la hora de la última subida (tgTs) para
// que el freno sepa. Así la copia del chat va al día con TODO lo que
// la persona arma, hoy y con lo que cree mañana, ella o cualquier
// usuario: el respaldo es la lista COMPLETA, no un parche.
// ANTES: v0.4.52 la nube lleva todo (colecciones e historial dentro).
// v0.4.52 — LA NUBE LLEVA TODO. Petición de la persona: el botón de
// «Sincronizar» vive en Mis favoritos, ¿pero lo de abajo también se
// respalda? Honestidad de la 0.4.51: solo favoritos y reseñas iban al
// chat de Telegram (las colecciones ni siquiera viajaban entre
// aparatos vinculados — solo favoritos, reseñas e historial). Ahora
// la copia mangatrack.json (v2) lleva favoritos, reseñas,
// COLECCIONES e HISTORIAL: al bajar se unen sin borrar nada local
// (colecciones por nombre y, dentro, por serie con la copia más
// nueva; historial por serie como las reseñas, gana el avance más
// nuevo, tope de 100 series igual que siempre), y al subir va la
// lista completa de las cuatro cosas. Así una reinstallación devuelve
// TODO lo que la persona había armado. Verificado el mismo día (ver
// la 0.4.51): las portadas grises del riel «Recién actualizados» de
// LeerCapitulo NO son del plugin — el sitio manda enlaces de portada
// muertos (404 de verdad) para las series publicadas hace pocas
// horas; sus páginas de serie sí traen la portada buena. No hay nada
// que arreglar aquí: el detalle de esas series abre con su portada.
// ANTES: v0.4.51 la nube es Telegram.
// v0.4.51 — LA NUBE ES TELEGRAM (y GitHub se retira). El usuario no
// quería que cada quien cree repos ni pegara tokens de GitHub: la
// petición volvió a su idea original — Telegram. Lo que antes parecía
// imposible (los bots no leen el historial) tiene solución oficial:
// el truco de Sync-Gram, el plugin de referencia de Kino. La copia
// viaja como archivo mangatrack.json enviado al chat privado de la
// persona con SU PROPIO bot (creado con @BotFather) y se FIJA
// (pinChatMessage); para leerla no hace falta leer el historial —
// getChat devuelve el mensaje fijado y getFile entrega el archivo.
// La vinculación: pegar el token (se comprueba con getMe) y «Buscar
// mi chat» (getUpdates reconoce el último humano que le escribió al
// bot; la lectura reconoce los mensajes con offset para no releer).
// Todo lo demás igual que la nube de GitHub que retira: baja y une al
// abrir, sube la lista completa al cambiar algo (la copia vieja se
// borra o desfija), «Sincronizar» prueba y deja activar/desactivar a
// mano. HONESTO: el último que sube manda; el token nunca va en
// mensajes ni registros (tgLimpio lo tapa); un mensaje que la persona
// fije por su cuenta nunca se lee ni se toca (aviso honesto).
// ANTES: v0.4.50 solo el token (GitHub); v0.4.49 reseñas y nube.
// v0.4.50 — SOLO EL TOKEN. Petición de la persona: que cada usuario
// pegue únicamente su token y nada más. GitHub le dice al plugin a
// cuáles repos alcanza ese token (uno fine-grained de un solo repo
// trae exactamente ese): si el campo repo va VACÍO, «Guardar y
// probar» los lista, toma el único alcanzable o el que diga
// «mangatrack», y si no hay ninguno intenta CREAR uno privado
// kino-mangatrack (posible solo si el token trae Administración);
// si tampoco puede, el mensaje honesto dice qué hacer a mano. El
// campo repo queda OPCIONAL para quien quiera otro nombre.
// ANTES: v0.4.49 reseñas y nube propia; v0.4.48 presupuesto de
// portadas.
// v0.4.49 — LAS RESEÑAS Y LA NUBE PROPIA. Dos peticiones de la
// persona: (1) comentar y reseñar cada manga — página «Mi reseña» en
// cada serie (botón en el detalle, texto visible bajo la sinopsis),
// guardada en el aparato y viajando a los vinculados; (2) que los
// favoritos (y ahora también las reseñas) sobrevivan a las
// reinstalaciones — respaldo en un repositorio del usuario en
// GitHub: token fine-grained (Contents: RW, solo ese repo), archivo
// data/mangatrack.json; al abrir se baja y une lo que falte, cada
// cambio sube la lista completa y «Sincronizar» (desde Mis favoritos)
// deja probar la conexión, activar/desactivar y sincronizar a mano.
// HONESTO: Telegram no puede leer sus mensajes viejos (sus bots no
// tienen getHistory), así que no sirve de nube — GitHub sí. Y la
// integración con Kino Social esperará a que expongan una puerta
// para plugins (como hace AniTrack): su feed y su servidor son suyos.
// ANTES: v0.4.48 presupuesto de portadas; v0.4.47 +18 de MW abren;
// v0.4.46 capítulos versions de MW.
// v0.4.48 — EL INICIO VOLVIÓ A ABRIR. Reporte del teléfono: tras abrir
// un +18 y volver, cada entrada al plugin caía en el mensaje rojo
// «plugin answer too large». La causa: las portadas convertidas de las
// casas con muro viajan como datos incrustados de hasta ~199 mil
// caracteres DENTRO de la respuesta, y el caché se había ido llenando
// con cada visita (los +18 traen portadas grandes) hasta cruzar el
// tope de 2 millones de Kino. El adorno de portadas ahora tiene
// PRESUPUESTO compartido por respuesta: se adornan las primeras de
// cada riel (lo que se ve) hasta ~700 mil caracteres y el resto viaja
// con su URL de siempre — la pantalla abre aunque el caché esté lleno.
// v0.4.47 — LOS +18 DE MANHWAWEB TAMBIÉN ABREN. Reporte del teléfono:
// los mangas normales ya abrían pero tocar uno +18 no hacía nada. La
// causa: los ids de las +18 rompen la forma limpia <slug>_<13 dígitos>
// — traen MAYÚSCULAS, guiones bajos en medio y hasta espacios (11 de
// 32 del feed, verificado en vivo), y la regla que valida la dirección
// del toque los rechazaba: ni siquiera encontraba la fuente. La regla
// ahora acepta cualquier id sin barra, y si la API falla con una serie
// concreta (una con espacio en el id respondió «error»), el detalle
// abre con el aviso honesto en vez de quedarse mudo.
// v0.4.46 — MANHWAWEB VOLVIÓ A ABRIR SUS SERIES. Reporte del teléfono:
// al abrir cualquier manga de ManhwaWeb salía «no entregó capítulos».
// La causa NO fue la 0.4.45: la API del sitio CAMBIÓ la forma de sus
// capítulos — antes cada fila traía el número y el enlace público con
// la subida tras el último guion («…-<cap>_<subida>»); ahora cada fila
// trae el número limpio y sus subidas DENTRO (versions: [{link, joint,
// create}]) y el id del capítulo es el tramo tras «/leer/» del enlace.
// El lector viejo exigía que ese tramo tuviera «_» y saltaba TODAS las
// filas → 0 capítulos. Ahora se leen las subidas de «versions» (con la
// fila misma como respaldo del formato viejo), se acepta el id
// interno en el enlace cambiándolo por el real (la receta de la
// extensión oficial) y de varias subidas del mismo capítulo se queda
// la más reciente — verificado en vivo: /chapters/see/<id>-<cap>
// sigue entregando sus páginas igual.
// v0.4.45 — LA PÁGINA DE MANHWAWEB ENTERA, Y DETALLES EN MANGADEX. La
// persona pidió traer lo que faltaba de la página y agregar en las
// demás fuentes lo que tuvieran. Hallado en vivo: /manhwa/nuevos trae
// MUCHO más que «Nuevas Obras» — también la pestaña Adulto +18 de las
// mismas (utimos_mangas_creados_18), el «Lo más Leído» (top.manhwas_esp,
// con visitas y capítulos por serie) y el RANKING DE GRUPOS SCAN
// (top._manhwas, tipo scan, con sus capítulos subidos). El Inicio de
// ManhwaWeb queda: «Nuevas obras» (Principal + Adulto +18 juntas, con
// «+18» marcado), «Nuevos capítulos» (como la 0.4.44), «Lo más leído»
// en su propio riel (con «N caps» bajo el título) y la vitrina «Top
// grupos scan» con el ranking completo — las cuatro secciones de su
// portada. En MangaDex, «más detalles»: cada tarjeta lleva el número
// de su último capítulo («Cap. N», el lastChapter de su API) en el
// Inicio, el catálogo y la búsqueda. Mangas.in no se pudo verificar
// desde el servidor de pruebas (su muro niega el paso sin
// presentación): sus posibles detalles quedan para el Registro del
// teléfono.
// v0.4.44 — PRINCIPAL Y ADULTO +18 JUNTAS, Y EL BUSCADOR MÁS FINO.
// La persona vio que el riel de «Nuevos capítulos» traía SOLO lo de la
// pestaña Adulto +18 de la página y faltaba la Principal. La causa: la
// extensión oficial aclara la forma de /latest/new-manhwa — el objeto
// manhwas trae TRES listas: manhwas_esp (Principal), manhwas_raw y
// _manhwas (las dos +18); el riel leía solo _manhwas. Ahora las tres
// van JUNTAS, sin repetir series y de la subida más reciente a la más
// vieja (como hace la página), con «+18» marcado en las que vienen de
// las listas adultas. Y el buscador de la vinculación con AniList/MAL
// gana precisión en ManhwaWeb y Mangas.in: (1) cada nombre de AniList
// se prueba también en su versión SIN puntuación («¿…?», «…:», «!» —
// esos buscadores se atragantan con ella); (2) ManhwaWeb guarda series
// con su título en español Y el original — el calce automático ahora
// acepta cualquiera de los dos contra cualquiera de los nombres de
// AniList, así que más series vinculan solas y bien.
// v0.4.43 — EL INICIO DE MANHWAWEB, COMO SU PÁGINA. La v0.4.42 puso el
// CATÁLOGO al día, pero las capturas de la persona comparaban el
// INICIO: los rieles seguían siendo «Biblioteca» (alfabético) y
// «Publicándose». La página enseña «Nuevas Obras» y «Nuevos
// Capítulos», que la API trae en dos endpoints propios: /manhwa/nuevos
// (las recién creadas) y /latest/new-manhwa (cada subida con su
// capítulo y el grupo que la subió). El Inicio de ManhwaWeb ahora
// muestra esas dos secciones con esos nombres, con «Cap. N · grupo»
// bajo cada tarjeta de nuevos capítulos; las listas son finitas (la
// API no les da páginas), así que sin «Cargar más» — igual que la
// página. El catálogo con sus filtros (género, demografía, orden)
// queda como en la 0.4.42.
// v0.4.42 — EL CATÁLOGO DE LAS OTRAS CASAS, AL DÍA. Dos pedidos de la
// persona: (1) LectorXd con la casilla de Género que tiene
// LeerCapitulo — su web trae la lista en la misma página del catálogo
// (labels con data-category-name y el número en input[name=tags]), se
// lee en vivo, se guarda en el almacén y alimenta el desplegable; con
// ella viajan la Demografía (shounen/seinen/shoujo/josei) y cuatro
// órdenes más (más leyendo / por leer / completados / capítulos).
// (2) ManhwaWeb concordando con la página: el catálogo pedía
// «alfabetico» mientras el sitio enseña «Nuevas Obras» — ahora el
// orden por defecto es «creacion» (verificado contra la API: devuelve
// exactamente las series del home) y el desplegable de Orden lo deja
// cambiar (más capítulos o A-Z); además, Género de verdad (los 27 de
// su API con sus números), la demografía aparte (kodomo no existía;
// shojo sí) y el número de capítulos de cada serie bajo el título de
// las tarjetas. Los rieles de la portada siguen con su orden de
// siempre para no mover lo que ya funciona.
// v0.4.41 — LA BARRA LIMPIA, SIEMPRE. Probado en el teléfono: el ojo
// hacía justo lo que la persona quiere ver — quitaba las letras y
// dejaba la fila fina con solo la flechita de salida — pero vivía
// como botón flotante naranja que tapa la esquina de las páginas. El
// lector queda ASÍ para siempre: barra siempre en mínimos (título
// invisible PNG + flechita de salida, sin divisoria), sin ojo en
// ningún lado y sin pantalla completa que activar — de la fila se
// sale con la flechita y los controles siguen al final del capítulo.
// También se retira la nota del muro al abrir el capítulo («Capítulo
// con muro: X de N páginas…»): con las imágenes ya dibujándose en
// directo (v0.4.40, probado ✓) no hay nada que explicar y solo
// tapaba las páginas; el aviso de «el sitio no entregó ninguna
// página» sigue (ese sí dice algo que hay que hacer) y el Registro y
// la ventanita siguen de respaldo.
// v0.4.40 — LAS PÁGINAS DEL MURO, EN DIRECTO. El pintor de imágenes de
// Kino 0.9.83 aprendió a presentarse (Image.headers: Referer y
// User-Agent, aditivo — un Kino anterior los ignora y sigue como
// siempre): la página SIN copia local ya no es un hueco — se dibuja
// en directo del sitio con la presentación que su casa de imágenes
// exige, y la baja el propio Kino (con su caché, de 4 en 4) SIN tope
// de tamaño (los 200.000 caracteres eran solo de las data URLs): las
// «demasiado grandes» (reader.grande), que jamás tuvieron copia
// local posible, por fin se ven. La copia convertida del almacén
// sigue ganando cuando existe (más rápida y sin red), las tandas
// siguen guardando, y el hueco honrado queda de fallback si el muro
// niega alguna — la ventanita sigue de respaldo.
// v0.4.39 — el nombre por fin invisible: Kino también descartó el
// título-nodo de espacio irrompible del 0.4.38 y «MangaTrack» siguió
// en la barra. La última carta (la que sugieren las docs para un logo
// en el lugar del nombre): el título es una IMAGEN PNG transparente
// de 1x1 (73 bytes, alfa 0) — una imagen no es texto vacío que
// descartar, se dibuja tal cual y no pinta nada: la fila en pantalla
// completa queda [atrás][nada][campana]. Si un Kino no pudiera leer
// la imagen, el respaldo es el mismo espacio (y si también lo
// descarta, el nombre vuelve — nada se rompe).
// v0.4.38 — el ojo se muda abajo: en pantalla completa la barra de
// arriba queda en mínimos absolutos — sin nombre (un espacio
// irrompible como título-nodo: Kino descartaba el espacio llano y
// ponía «MangaTrack» de vuelta), sin la línea divisoria del borde
// (divider: false) y con el botón de atrás como salida — y el ojo
// pasa a ser un botón flotante en la esquina de abajo, como los
// lectores de siempre: tocarlo trae la barra completa de vuelta.
// El color de esa fila no puede ser transparente: Kino solo acepta
// sus roles de color fijos (surface, primary...) para la barra, así
// que la fila conserva el color del tema — 56 dp sin nombre ni línea
// es lo más discreto que la app permite.
// v0.4.37 — el arreglo de la pantalla completa: el ojo usa
// mergeWithKinoBar y dense, funciones de apiVersion 19, y el manifiesto
// había quedado en 14 — Kino las ignoraba y dibujaba DOS barras
// apiladas (la suya con «MangaTrack» y la nuestra con el ojo debajo).
// Con el apiVersion 19 la barra del lector es UNA sola compacta:
// normal = «Capítulo N · versión» con atrás y ojo; con el ojo
// apretado la fila se queda en mínimos — el ojo y un espacio en
// blanco en el lugar del nombre, para que no se lea «MangaTrack».
// Esa fila fina es lo mínimo que Kino permite: es su salida y
// siempre la conserva (regla de la app, no del plugin).
// v0.4.36 — el panel del lector viaja al FINAL del capítulo: la
// persona lee sin nada encima y al terminar encuentra «Fin del
// capítulo» con Anterior / Ir a capítulo / Siguiente (como los
// lectores de siempre, p. ej. ZonaTMO). El ojo de la barra es ahora
// pantalla completa: esconde la barra de arriba y la deja en
// mínimos (solo el ojo, para traerla de vuelta con un toque).
// v0.4.35 — preparado para el pintor con presentación: las docs vivas
// de Kino traen Image.headers { Referer, User-Agent } (aditivo, llega
// con la próxima versión de la app). Las portadas de las casas con
// muro (Mangas.in y ManhwaWeb) viajan ahora con la misma presentación
// con la que el plugin ya las bajaba a mano: un Kino actual las pide
// desnudas como siempre (nada cambia) y el que traiga los headers las
// dibuja directas del sitio, sin conversión. El lector y sus tandas
// quedan como están hasta poder probar el Kino nuevo en un teléfono.
// v0.4.34 — el selector de fuentes de las apps de lectura: el nombre de
// la fuente activa vive ahora en la barra del Inicio, al lado de la
// lupa; al tocarlo se abre la lista de las 7 fuentes (la activa
// rellena con su ✓ y su color) con AniList al final, elegir una la
// activa y vuelve al Inicio cargado con su contenido. El riel de
// fuentes de abajo del Inicio se retira: su lista vive en el selector.
// v0.4.33 — la portada elegante: el Inicio estrena el «heroCard»
// oficial de Kino (una serie destacada que rota cada día, con su
// portada y botón directo a la serie), «Seguir leyendo» sube a
// protagonista con su cuenta en insignia y el capítulo de cada serie
// bajo el título, el detalle gana su barra de progreso («llevas X de
// Y capítulos») y las cargas muestran esqueletos con la forma del
// contenido en vez del molinillo. El orden de la portada cambia: el
// contenido primero y las fuentes al final. Todo aditivo: nada de
// lo que ya funcionaba se toca.
// v0.4.32 — presentación: icono propio del plugin (icon.png, PNG
// cuadrado en el repo), color de acento naranja e icono «bookmark» en
// la entrada del menú, y un README.md bien detallado en el repo (qué
// es, cómo se instala, cómo se usa, permisos y límites honestos). El
// código no cambia: solo sube el número para que el teléfono reciba
// el icono al actualizar.
// v0.4.31 — el reporte del teléfono tras la 0.4.30 lo dijo claro: el
// muro de Mangas.in YA SIRVE las páginas con presentación (la sonda
// del Registro: «al desnudo 403, con presentación 200») y el lector
// dibujó capítulos enteros por tandas. Lo que falla ahora es el
// TAMAÑO: el pintor de Kino solo acepta imágenes incrustadas de
// 200.000 caracteres (unos 150 KB de imagen) y las páginas de los
// manhuas kilométricos pesan más — el Registro las llamaba a todas
// «muy grande: no se convierte». Tres arreglos: (1) el tope de
// conversión sube al máximo real (149.000 bytes: las portadas y
// páginas que quedaban justo fuera ahora entran); (2) las «demasiado
// grandes» se distinguen de las «negadas por el muro»: se marcan en
// el lector (reader.grande), NO se reintentan solas (antes quemaba
// tandas re-pidiendo lo que jamás va a caber), y su hueco lo dice
// honrado — «demasiado grande para el pintor — se ve con Leer en
// ventanita»; solo el botón «Bajar más páginas» las reintenta a
// mano (tras una actualización de Kino podrían caber). (3) Los
// avisos del lector separan las tres suertes: dibujadas, negadas
// por el muro (reintentan solas) y muy grandes (ventanita).
// v0.4.30 — la gran news: el LECTOR INTEGRADO ya puede dibujar los
// capítulos de ManhwaWeb y Mangas.in. La mejora del pintor de Kino
// (0.9.82: las Image aceptan datos incrustados de hasta 200.000
// caracteres) que ya pintaba las portadas de ManhwaWeb se aplica ahora
// a las PÁGINAS: cada página se baja CON presentación (Referer+UA, la
// receta de scancore), se convierte a datos y se guarda en el almacén
// («pgd:», 16 MiB con storageLarge); el lector las dibuja desde ahí,
// en tira o por páginas, con su zoom de siempre. Como un capítulo
// entero no cabe de un viaje (20 s por evento), se baja por tandas: al
// abrir salen las primeras 6 y las demás llegan solas al acercarse al
// final (o con el botón «Bajar más páginas»). La página que el muro
// niega queda con su aviso honrado en su sitio y «Leer en ventanita»
// sigue ahí como siempre. Las PORTADAS DE MANGAS.IN reciben la misma
// receta que las de ManhwaWeb (bajar con presentación, convertir,
// decorar al dibujar): Inicio, buscador, catálogo, rieles y detalle.
// v0.4.29 — dos reportes de la persona. (1) «Ver más» faltaba en las
// secciones chicas de LeerCapitulo y LectorXd: la tarjetita salía
// solo con 10 series o más y muchas secciones traen menos; ahora sale
// con 3 o más, igual en todos los rieles, y el tope de «Populares» de
// LectorXd sube de 12 a 24. (2) ManhwaWeb cargaba todo menos las
// imágenes (su casa img1mw/img2mw niega al pintor de Kino): Kino
// acepta ahora imágenes incrustadas «data:image/…;base64,…» en las
// pantallas, así que las PORTADAS se bajan con presentación
// (Referer+UA, la receta de scancore), se convierten y se guardan en
// el almacén (capacidad «storageLarge», 16 MiB) — el dibujado las lee
// sin red. El lector de capítulos enteros sigue en la ventanita (una
// página pesa más de lo que viaja en el estado) y la sonda por hora
// ahora prueba también CON presentación, para saber si el muro
// cede desde el teléfono y el lector integrado tiene camino.
// v0.4.28 — dos peticiones de la persona. (1) Las secciones de «Ver más»
// ahora PAGINAN: la cuadrícula enseña 24 series por ventana con
// «‹ Series anteriores / Series siguientes ›» (el patrón del catálogo)
// y «Cargar más del sitio» salta directo a lo recién traído — las
// secciones pueden crecer hasta 120 series y una sola lista eterna ya
// cansaba el dedo. (2) ManhwaWeb entra como séptima fuente, por su API
// pública (api.manhwaweb.com, la misma que lee la app scancore, que
// inspiró la integración): biblioteca con paginación y filtros de
// estado/tipo/demografía, buscador, series con sus capítulos y
// capítulos con sus páginas. Dosquistes: su JSON llega a veces con
// saltos crudos dentro de las cadenas (se limpian antes de parsear) y
// su casa de imágenes (img1mw.xyz / img2mw.xyz) niega el paso a
// pedidos sin presentación («Sorry, you have been blocked», probado
// en vivo desde el servidor de pruebas) — el mismo muro que Mangas.in:
// el lector va con la nota honesta y el botón «Leer en ventanita», y
// el diagnóstico de una vez por hora dirá desde el TELÉFONO si el
// pintor de Kino pasa o no. Seis hosts nuevos en el manifiesto:
// ManhwaWeb pedirá su aprobación en rojo al actualizar.
// v0.4.27 — «Ver más» en cada sección del Inicio (petición de la
// persona): cada riel (Populares, Recién actualizados, Series
// añadidas, Seguir leyendo…) lleva al final de su tira una tarjetita
// «Ver más» que abre la sección entera en cuadrícula cómoda, y donde
// la fuente de verdad tiene más páginas de ESA sección (las consultas
// de MangaDex, el directorio de MangaOni, el catálogo POST de InManga,
// y las listas y el feed «lasted» de Mangas.in) un botón «Cargar más
// del sitio» va trayendo las siguientes páginas. Las secciones fijas
// de las portadas (LeerCapitulo, LectorXd, «Series añadidas», el
// historial) son todo lo que hay: la cuadrícula lo dice honesto («Es
// todo lo que esta sección trae») y no ofrece un botón que no pueda
// cumplir. La sección viaja por el almacén («riel:<key>», el patrón
// del catálogo) para no inflar el estado de la pantalla.
// v0.4.26 — la portada de LeerCapitulo muestra los «Ultimos capitulos
// agregados» del sitio: series con su capítulo más nuevo y su edad
// («Cap. 47 · 36 mins»), la lista que en la web se mueve minuto a
// minuto. Antes el riel «Actualizados recientes» se llenaba con
// «Ultimos mangas» — series AÑADIDAS, que pueden llevarse días ahí
// quietas: de ahí la impresión de portada estática que veía la
// persona comparando la web con el plugin. Ahora ese riel se llama
// «Recién actualizados» y trae los capítulos de verdad (con su edad
// bajo el título), y las series añadidas siguen debajo con nombre
// honesto («Series añadidas»).
// v0.4.25 — el buscador de LeerCapitulo, reparado: el sitio cambió cómo
// busca y la dirección vieja ("/?s=") ya no busca — contesta con la
// portada, así que el plugin raspe siempre las mismas ~24 tarjetas de
// «Tendencias» pusiera lo que pusiera (lo que la persona vio: «los
// mismos mangas al azar», y de ahí la impresión de fuente estática).
// El buscador nuevo del sitio vive en su catálogo: "/manga/?q=…" (la
// misma página del catálogo con el filtro de nombre; probado en vivo:
// «one piece» → 8 series con One Piece delante, «naruto» → 8, «solo
// leveling» → 4). El plugin pide esa página y la raspa con el mismo
// lector de tarjetas del catálogo, que ya entiende ese HTML. La
// portada y las páginas de series no cambiaron: siguen frescas (el
// capítulo 1198 de One Piece del día anterior sale en el sitio y en
// el plugin por igual).
// v0.4.24 — la sección de AniList con más alcance y precisión (petición
// de la persona: «no encuentra todos los títulos ni enlaza bien con la
// fuente»). Tres arreglos sobre el toque de una serie de AniList:
// (1) ALCANCE — antes se buscaba en la fuente con UN solo nombre (el
// inglés); ahora se prueban TODOS los nombres de la serie en AniList
// (inglés, romaji, original y sinónimos — a veces el español vive
// entre los sinónimos) hasta que la fuente dé resultados.
// (2) PRECISIÓN — el vínculo automático ya no exige que el título de
// la fuente calce con el inglés: calza con CUALQUIER nombre de la
// serie en AniList, incluidos sus sinónimos.
// (3) IDENTIDAD — si la fuente activa no la tiene clara, MangaDex
// puede tenerla, y publica el enlace de AniList de cada serie: si su
// id coincide con el de la serie tocada, es LA serie — el vínculo se
// da por bueno (o, si lees en otra fuente, la pantalla de vincular
// ofrece arriba «MangaDex la tiene, verificada por id: toca para
// abrirla»). Y en el buscador de la sección los +18 ya existen (la
// receta de AniTrack): si el título pedido no aparece, una segunda
// pasada SOLO entre adultos trae únicamente los que calzan exacto.
// (4) Un fallo viejo encontrado de paso: al tocar la PRIMERA tarjeta
// de resultados en la vinculación, «parseInt("0") || -1» volvía el
// índice -1 y nunca vinculaba — arreglado.
// v0.4.23 — el «Continuar» que retoma de verdad: en la tira vertical el
// lector recordaba QUÉ capítulo leías pero no por dónde ibas dentro de
// él, y volvía al principio. La documentación de las pantallas lo dice
// sin rodeos: a una tira vertical NO se le puede ordenar que se
// desplace a una posición guardada («guarda el punto, muéstralo y deja
// que la persona se desplace»). La salida honesta: la tira ahora avisa
// cada vez que te detienes (onScroll, de 0 a 1) y «Continuar» reabre el
// capítulo DIRECTO por la página en la que ibas, con un botoncito
// arriba («Volver a la página 1») para releer desde el principio. En
// modo páginas nada cambia: ya retomaba.
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
// v0.4.22 — el Inicio sin el viejo riel de «Mis favoritos»: petición
// de la persona, que ya tiene el corazón de las colecciones y 17
// favoritos que solo ocupaban espacio en la portada. Los favoritos
// NO desaparecen: la estrella de cada serie sigue igual y su lista
// entera vive ahora dentro del corazón (primera tarjeta), para no
// perderlos de vista nunca.
// v0.4.21 — el corazón de las colecciones: listas con nombre que la
// persona se crea («Mis mangas de terror», «Los que releo»…) y un
// corazoncito flotante en el Inicio (lado derecho) que las lista.
// Tocar una abre su sección con sus series en cuadrícula; desde la
// página de cualquier serie, «Añadir a colección» la mete (o la
// saca si ya estaba) y hasta estrena una colección nueva con la
// serie dentro. Viven en el almacén del propio teléfono (no viajan
// entre aparatos: el espacio compartido ya lo ocupan favoritos e
// historial).
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

const VERSION = "0.4.65";
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
  { id: "manhwaweb", nombre: "ManhwaWeb", base: "https://manhwaweb.com" },
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
  // ManhwaWeb: sus ids son <slug>_<13 dígitos>… pero las series +18
  // rompen esa forma (verificado en vivo: 11 de 32 del feed traen
  // MAYÚSCULAS, guiones bajos en medio e incluso espacios —
  // «I_am_the_only_male…», «Mom_eat_first…», «MONEY_GAME…»). La regla
  // estrecha de antes las rechazaba y el toque no abría NADA; ahora se
  // acepta cualquier id sin barra. Series en /mw/manhwa/ y capítulos en
  // /mw/leer/ (el prefijo /mw evita chocar con las demás fuentes).
  if (/^[/]mw[/](?:manhwa|leer)[/][^/]+_[0-9]{10,}/.test(u)) return fuentePorId("manhwaweb");
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
