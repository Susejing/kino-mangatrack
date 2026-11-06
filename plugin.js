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

const VERSION = "0.4.55";
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
function msDiagPresentacion(f, etiqueta, url, clave) {
  const kDiag = clave || "msDiag";
  if (!url || Date.now() - (getJson(kDiag, 0) || 0) < 3600000) return Promise.resolve();
  setJson(kDiag, Date.now());
  const pref = kDiag === "mwDiag" ? "MW" : "MS";
  // v0.4.29 — dos sondas por hora: la desnuda (el pintor de Kino) y
  // la presentada (Referer + UA móvil, la receta de scancore). Si la
  // presentada pasa, el lector integrado tiene camino; el Registro lo
  // dirá desde el teléfono.
  const hdrs = { Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    "User-Agent": UA_MOVIL, Referer: (pref === "MW" ? MW_BASE : MS_BASE) + "/" };
  return kino.fetch(url, {})
    .then(function (r) {
      log(pref + " " + etiqueta + " al desnudo: HTTP " + (r && r.status) + " (" + (r && r.ok ? "sí la sirve" : "la niega") + ")");
    })
    .catch(function (e) {
      log(pref + " " + etiqueta + " al desnudo: no bajó (" + ((e && e.message) || e) + ")");
    })
    .then(function () {
      return kino.fetch(url, { headers: hdrs })
        .then(function (r) {
          log(pref + " " + etiqueta + " con presentación: HTTP " + (r && r.status) + " (" + (r && r.ok ? "sí la sirve" : "la niega") + ")");
        })
        .catch(function (e) {
          log(pref + " " + etiqueta + " con presentación: no bajó (" + ((e && e.message) || e) + ")");
        });
    });
}

// ------------------------------------------------------------- manhwaweb
// v0.4.28 — ManhwaWeb (séptima fuente) por su API pública, la misma
// que lee scancore (api.manhwaweb.com): biblioteca con paginación y
// filtros, series con sus capítulos y capítulos con sus páginas. Sus
// dos quistes: el JSON llega a veces con saltos crudos dentro de las
// cadenas (se limpian antes de parsear) y sus imágenes viven tras un
// filtro que niega al pintor de Kino (img1mw/img2mw — «Sorry, you
// have been blocked», comprobado en vivo); el lector va con la nota
// honesta y el «Leer en ventanita» como en Mangas.in, y el diagnóstico
// por hora dirá desde el teléfono si el muro también corre allí.
const MW_BASE = "https://manhwaweb.com";
const MW_API = "https://api.manhwaweb.com";
const MW_ESTADOS = [["", "Cualquier estado"], ["publicandose", "Publicándose"],
  ["finalizado", "Finalizado"], ["pausado", "Pausado"], ["cancelado", "Cancelado"]];
const MW_TIPOS = [["", "Cualquier tipo"], ["manga", "Manga"], ["manhwa", "Manhwa"], ["manhua", "Manhua"]];
// v0.4.42 — demografías de la API (kodomo no existe allá; shojo sí).
const MW_DEMO = [["", "Cualquier demografía"], ["shonen", "Shonen"], ["seinen", "Seinen"],
  ["shojo", "Shojo"], ["josei", "Josei"]];
// v0.4.42 — los 27 géneros de la API de ManhwaWeb con sus números de
// categoría (el &generes= de /manhwa/library los filtra por número).
const MW_GENEROS = [["", "Todos los géneros"],
  ["3", "Acción"], ["29", "Aventura"], ["18", "Comedia"], ["1", "Drama"],
  ["42", "Recuentos de la vida"], ["2", "Romance"], ["5", "Venganza"], ["6", "Harem"],
  ["23", "Fantasía"], ["31", "Sobrenatural"], ["25", "Tragedia"], ["43", "Psicológico"],
  ["32", "Horror"], ["44", "Thriller"], ["28", "Historias cortas"], ["30", "Ecchi"],
  ["34", "Gore"], ["27", "Girls love"], ["45", "Boys love"], ["41", "Reencarnación"],
  ["37", "Sistema de niveles"], ["33", "Ciencia ficción"], ["38", "Apocalíptico"],
  ["39", "Artes marciales"], ["40", "Superpoderes"], ["35", "Cultivación (cultivo)"],
  ["8", "Milf"]];
// v0.4.42 — orden del catálogo: por defecto las obras nuevas de la
// página (creacion), que es lo que enseña el sitio en «Nuevas Obras».
const ORDEN_MW = [["", "Nuevas obras (como la página)"], ["num_chapter", "Más capítulos"], ["alfabetico", "A-Z"]];

// v0.4.42 — la biblioteca también acepta género y orden; el catálogo
// pide «creacion» (las obras nuevas de la página) y los rieles de la
// portada siguen con su orden de siempre (alfabético).
function mwLib(estado, tipo, demo, pag, generes, orden) {
  return "/manhwa/library?buscar=&estado=" + encodeURIComponent(estado || "") +
    "&tipo=" + encodeURIComponent(tipo || "") +
    "&erotico=no&demografia=" + encodeURIComponent(demo || "") +
    "&order_item=" + encodeURIComponent(orden || "alfabetico") + "&order_dir=desc&page=" + (Math.max(0, parseInt(pag, 10) || 0)) +
    "&generes=" + encodeURIComponent(generes || "");
}

async function mwGet(ruta) {
  const r = await kino.fetch(MW_API + ruta, { headers: { Accept: "application/json" } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con ManhwaWeb (HTTP " + r.status + "). Inténtalo de nuevo.",
  });
  const t = await r.text();
  // v0.4.28 — a veces manda JSON con saltos crudos dentro de las
  // cadenas (lección del intento viejo de esta fuente): se limpian.
  // v0.4.46 — y a veces el salto cae en medio de un NÚMERO
  // («174101865\n91448»): se re-pega antes de blanquear el resto.
  try { return JSON.parse(t); } catch (e) {
    return JSON.parse(t.replace(/(\d)[\u0000-\u001F]+(\d)/g, "$1$2")
      .replace(/[\u0000-\u001F]/g, " "));
  }
}

// Tarjetas de la biblioteca: id real, título en español y su imagen.
// Las +18 quedan fuera (la receta de MangaOni), igual que en scancore.
function mwCards(j, max) {
  const arr = (j && j.data) || [];
  const out = [];
  const seen = {};
  for (let i = 0; i < arr.length && out.length < max; i++) {
    const m = arr[i] || {};
    if (String(m._erotico || "") === "si") continue;
    const id = String(m.real_id || m._id || "");
    const t = clean(String(m.name_esp || m.the_real_name || ""));
    if (!id || !t || seen[id]) continue;
    seen[id] = 1;
    // v0.4.42 — la API entrega el número de capítulos de cada serie:
    // se enseña bajo el título de la tarjeta del catálogo.
    const nc = parseInt(m._numero_cap, 10) || 0;
    // v0.4.44 — el nombre ORIGINAL viaja aparte (alt): el buscador de
    // la vinculación con AniList puede calzar con él cuando el título
    // en español no coincide con ninguno de sus nombres.
    const alt = clean(String(m.name_esp ? m.the_real_name : ""));
    out.push({ url: "/mw/manhwa/" + id + "/", title: t, poster: String(m._imagen || ""),
      label: nc ? nc + " caps" : "", alt: alt && alt !== t ? alt : "" });
  }
  log("MW tarjetas: " + out.length);
  return out;
}

// v0.4.45 — «Nuevas Obras» de la página de ManhwaWeb: su endpoint
// propio (/manhwa/nuevos) trae las recién creadas de la pestaña
// Principal (utimos_mangas_creados) Y las de la pestaña Adulto +18
// (utimos_mangas_creados_18) — las dos juntas, con «+18» en las adultas.
function mwNuevas(j, max) {
  const filas = [];
  const mete = (arr) => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) filas.push(arr[i] || {});
  };
  mete(j && (j.utimos_mangas_creados || j.ultimos_mangas_creados));
  mete(j && (j.utimos_mangas_creados_18 || j.ultimos_mangas_creados_18));
  const out = [];
  const seen = {};
  for (let i = 0; i < filas.length && out.length < max; i++) {
    const m = filas[i];
    const id = String(m.real_id || m._id || "");
    const t = clean(String(m.the_real_name || m.name_esp || ""));
    if (!id || !t || seen[id]) continue;
    seen[id] = 1;
    out.push({ url: "/mw/manhwa/" + id + "/", title: t, poster: String(m._imagen || ""),
      label: String(m._erotico || "") === "si" ? "+18" : "" });
  }
  log("MW nuevas obras: " + out.length);
  return out;
}

// v0.4.45 — «Lo más Leído» de la página (el top de /manhwa/nuevos):
// las series con sus visitas (numero) y su número de capítulos (caps);
// el link llega como /manhwa/<id> o /manga/<id>.
function mwTop(j, max) {
  const arr = (j && j.top && j.top.manhwas_esp) || [];
  const out = [];
  const seen = {};
  for (let i = 0; i < arr.length && out.length < max; i++) {
    const m = arr[i] || {};
    const slug = String(m.link || "").replace(/^[/](manga|manhwa)[/]/, "").replace(/[/]$/, "");
    const t = clean(String(m.name || ""));
    if (!slug || !t || seen[slug]) continue;
    seen[slug] = 1;
    const caps = parseInt(m.caps, 10) || 0;
    out.push({ url: "/mw/manhwa/" + slug + "/", title: t, poster: String(m.imagen || ""),
      label: caps ? caps + " caps" : "" });
  }
  log("MW lo más leído: " + out.length);
  return out;
}

// v0.4.45 — el ranking de GRUPOS SCAN de la página (top._manhwas):
// quiénes han subido más capítulos. No abre series: es la vitrina del
// ranking, como en la página.
function mwScans(j, max) {
  const arr = (j && j.top && j.top._manhwas) || [];
  const out = [];
  for (let i = 0; i < arr.length && out.length < max; i++) {
    const m = arr[i] || {};
    if (String(m.tipo || "") !== "scan") continue;
    const t = clean(String(m.name || ""));
    if (!t) continue;
    out.push({ name: t, caps: (m.numeros && (parseInt(m.numeros.ace, 10) || 0)) || 0 });
  }
  return out;
}

// v0.4.44 — «Nuevos Capítulos» de la página: la API trae TRES listas —
// manhwas_esp (la pestaña Principal) y manhwas_raw + _manhwas (las dos
// de Adulto +18, según la extensión oficial). Se juntan como en la
// página: sin repetir series y de la subida más reciente a la más
// vieja; las que vienen de las listas +18 van marcadas «+18».
function mwUltimos(j, max) {
  const mws = (j && j.manhwas) || {};
  const filas = [];
  const mete = (arr, adulto) => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) filas.push({ m: arr[i] || {}, ad: adulto ? 1 : 0 });
  };
  mete(mws.manhwas_esp, false);
  mete(mws.manhwas_raw, true);
  mete(mws._manhwas, true);
  filas.sort((a, b) => ((b.m && b.m.create) || 0) - ((a.m && a.m.create) || 0));
  const out = [];
  const seen = {};
  for (let i = 0; i < filas.length && out.length < max; i++) {
    const m = filas[i].m;
    const id = String(m.id_rel || m.id_manhwa || "");
    const t = clean(String(m.name_manhwa || ""));
    if (!id || !t || seen[id]) continue;
    seen[id] = 1;
    const cap = parseInt(m.chapter, 10) || 0;
    const gru = clean(String(m.gru_name || ""));
    const partes = [];
    if (cap) partes.push("Cap. " + cap);
    if (gru) partes.push(gru);
    if (filas[i].ad) partes.push("+18");
    out.push({ url: "/mw/manhwa/" + id + "/", title: t, poster: String(m.img || ""),
      label: partes.join(" · ") });
  }
  log("MW nuevos capítulos: " + out.length);
  return out;
}

async function mwBuscar(q) {
  const qq = String(q || "").trim();
  if (qq.length < 3) return [];
  const j = await mwGet("/manhwa/library?buscar=" + encodeURIComponent(qq) +
    "&estado=&tipo=&erotico=no&demografia=&order_item=alfabetico&order_dir=desc&page=0&generes=");
  return mwCards(j, 30);
}

// Catálogo con paginación de verdad (page= en la API) y filtros de
// estado, tipo y demografía.
async function mwCatalog(cat, page1) {
  const p = Math.max(0, (parseInt(page1, 10) || 1) - 1);
  const j = await mwGet(mwLib((cat && cat.status) || "", (cat && cat.type) || "",
    (cat && cat.demo) || "", p, (cat && cat.genre) || "", (cat && cat.order) || "creacion"));
  const items = mwCards(j, 30);
  return { items: items, mas: items.length > 0 };
}

// La serie con TODOS sus capítulos (asc: del 1 al más nuevo). La API
// de ManhwaWeb CAMBIÓ la forma de sus capítulos (v0.4.46): cada fila
// trae el número limpio y sus subidas DENTRO (versions: [{link,
// joint, create}]) y el id público del capítulo es el tramo tras
// «/leer/» del enlace; de varias subidas del mismo capítulo se queda
// la más reciente (la receta de la extensión oficial). El formato
// viejo (fila con su link y la subida tras el último guion) también
// se acepta, por si la casa vuelve atrás.
async function mwSerie(url) {
  const id = String(url || "").replace(/^[/]mw[/]manhwa[/]/, "").replace(/[/]$/, "");
  if (!id || id.indexOf("_") < 0) return { meta: { title: "Serie", poster: "", overview: "" },
    chapters: [], aviso: "Esa serie de ManhwaWeb no tiene una dirección válida." };
  // v0.4.47 — a veces la API falla con una serie puntual (respondió
  // «error» con una de id con espacio): mejor el detalle honesto con 0
  // capítulos que un toque que no abre nada.
  let j = {};
  try { j = await mwGet("/manhwa/see/" + encodeURIComponent(id)); }
  catch (e) { log("MW serie falló (" + id + "): " + ((e && e.message) || e)); }
  const meta = { title: clean(String(j.name_esp || j.the_real_name || id)),
    poster: String(j._imagen || ""), overview: clean(String(j._sinopsis || "")) };
  const idReal = String(j._id || id);
  const rows = Array.isArray(j.chapters) ? j.chapters : (Array.isArray(j._chapters) ? j._chapters : []);
  const porNum = {};
  const orden = [];
  for (let i = 0; i < rows.length; i++) {
    const c = rows[i] || {};
    let num = String(c.chapter || "").trim();
    const mn = num.match(/^(\d+(?:[.]\d+)?)_/);
    if (mn) num = mn[1];
    if (!num) continue;
    // v0.4.46 — las subidas del capítulo vienen dentro de «versions»;
    // sin ellas, la fila misma es la subida (formato viejo).
    const vers = Array.isArray(c.versions) && c.versions.length ? c.versions : [c];
    for (let k = 0; k < vers.length; k++) {
      const v = vers[k] || {};
      let slug = String(v.link || "").replace(/^.*[/]leer[/]/, "").replace(/[/]$/, "").trim();
      if (!slug) continue;
      // El enlace puede traer el id interno en vez del real (la
      // extensión lo cambia): aquí igual, para que /chapters/see lo
      // encuentre.
      if (idReal && idReal !== id && slug.indexOf(idReal) >= 0) {
        slug = slug.split(idReal).join(id);
      }
      if (slug.indexOf(id) < 0) continue;
      const cr = v.create || c.create || 0;
      const prev = porNum[num];
      if (!prev) { orden.push(num); porNum[num] = { create: cr, cid: slug }; }
      else if (cr > (prev.create || 0)) { porNum[num] = { create: cr, cid: slug }; }
    }
  }
  const caps = orden.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0))
    .map((num) => ({ num: num, title: "Capítulo " + num,
      url: "/mw/leer/" + porNum[num].cid + "/" }));
  log("MW serie: " + caps.length + " capítulos");
  return { meta: meta, chapters: caps.slice(0, TOPE_CAPS_SERIE) };
}

// Las páginas del capítulo: /chapters/see/<id>-<cap>_<ver> trae el
// array «img» con las direcciones https de las páginas.
async function mwImages(url) {
  const id = String(url || "").replace(/^[/]mw[/]leer[/]/, "").replace(/[/]$/, "");
  if (!id) return [];
  const j = await mwGet("/chapters/see/" + encodeURIComponent(id));
  const ch = (j && j.chapter) || {};
  const imgs = Array.isArray(ch.img) ? ch.img : [];
  const out = [];
  const seen = {};
  for (let i = 0; i < imgs.length; i++) {
    const u = String(imgs[i] || "");
    if (u.indexOf("https://") === 0 && !seen[u]) { seen[u] = 1; out.push(u); }
  }
  log("MW lector: " + out.length + " páginas");
  return out;
}

// «Leer en ventanita»: el lector del propio sitio (el navegador SÍ
// pasa el filtro de img1mw/img2mw y las imágenes se ven).
async function mwVentanaLeer(ch) {
  if (!kino.visualBrowser || !kino.visualBrowser.available) return { st: "sin-ventanita" };
  const id = String(ch.url || "").replace(/^[/]mw[/]leer[/]/, "").replace(/[/]$/, "");
  try {
    const r = await kino.visualBrowser.open({
      url: MW_BASE + "/leer/" + id,
      title: "ManhwaWeb · cap. " + ch.num,
      timeoutMs: 600000,
    });
    const st = (r && r.status) || "sin-respuesta";
    log("ventana leer manhwaweb: " + st);
    return { st: st };
  } catch (e) {
    log("ventana leer manhwaweb falló: " + ((e && e.message) || e));
    return { st: "error" };
  }
}

// v0.4.29 — LAS PORTADAS DE MANHAWEB, DE VERDAD. Su casa de imágenes
// (img1mw/img2mw) niega al pintor de Kino (pedidos sin presentación),
// pero kino.fetch SÍ sabe presentarse (Referer + User-Agent móvil, la
// lección de scancore) y el componente Image de las pantallas acepta
// ahora datos incrustados «data:image/…;base64,…» de hasta 200.000
// caracteres. Receta: bajar la portada con presentación, convertirla
// a base64 y guardarla en el almacén (con «storageLarge» son 16 MiB);
// el dibujado la lee de ahí SIN red. La que no baje, pese demasiado o
// venga dañada se queda con su URL normal (el salvapantallas de
// siempre) — una portada nunca rompe una pantalla.
// v0.4.31 — el tope al máximo REAL del pintor: 149.000 bytes de
// imagen son 198.668 caracteres de base64 + el prefijo «data:» —
// cabe justo bajo los 200.000 del Image (y bajo el control de
// 199.000 de muroBaja). Las que pesen más, no caben: no hay
// miniatura en la API de ManhwaWeb (probado: solo entrega _imagen
// grande) ni quien les cambie el tamaño.
const MW_IMG_MAX = 149000; // bytes de imagen; en base64 cabe bajo el tope del Image

// v0.4.30 — LA RECETA GENÉRICA de las imágenes con muro: bajar CON
// presentación, validar, convertir a datos y guardar en el almacén.
// «etiqueta» nombra la línea del Registro; «cajon» elige el cajón
// («dimg:» portadas, «pgd:» páginas de capítulo). Devuelve
// { data, w, h } (las dimensiones salen de los mismos bytes, sin
// peticiones extra) o null; nunca lanza.
async function muroBaja(u, headers, etiqueta, cajon) {
  const ck = (cajon || "dimg:") + u;
  const hit = getJson(ck, null);
  if (hit && typeof hit === "string") return { data: hit, w: 0, h: 0 };
  try {
    const r = await kino.fetch(u, { maxBytes: MW_IMG_MAX, timeoutMs: 10000,
      headers: headers });
    if (!r.ok) { log(etiqueta + " HTTP " + r.status + " (" + u.replace(/^https?:\/\//, "").split("/")[0] + ")"); return null; }
    // v0.4.31 — «grande» marca la que NO CABRÁ NUNCA (no es un fallo
    // del muro ni algo que reintentar): el lector la aparta y solo el
    // botón manual la vuelve a probar.
    if (r.truncated) { log(etiqueta + " muy grande: no se convierte");
      return { data: null, w: 0, h: 0, grande: true }; }
    const ct = String((r.headers && r.headers["content-type"]) || "").toLowerCase();
    const m = ct.match(/image[/](png|jpe?g|webp|gif)/);
    if (!m) { log(etiqueta + " con tipo raro: " + ct.slice(0, 40)); return null; }
    const b64 = r.base64();
    if (!b64 || b64.length < 100) return null;
    const data = "data:image/" + (m[1] === "jpg" ? "jpeg" : m[1]) + ";base64," + b64;
    if (data.length > 199000) { log(etiqueta + " demasiado grande para el Image");
      return { data: null, w: 0, h: 0, grande: true }; }
    if (!setJsonCache(ck, data)) log(etiqueta + " sin guardar: almacén lleno");
    let w = 0, h = 0;
    try {
      const d = dimsDeBytes(deB64(b64));
      if (d && d.w > 0 && d.h > 0) { w = d.w; h = d.h; }
    } catch (e) {}
    return { data: data, w: w, h: h };
  } catch (e) {
    log(etiqueta + " no bajó: " + ((e && e.message) || e));
    return null;
  }
}

// La presentación de cada casa: la de ManhwaWeb es fija; la de
// Mangas.in viaja con el disfraz que ganó su galleta (si ya se ganó) y
// la galleta misma, como hacen sus otras apps.
function muroHeadersMW() {
  return { Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    "User-Agent": UA_MOVIL, Referer: MW_BASE + "/" };
}

function muroHeadersMS() {
  const h = { Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    "User-Agent": getJson("msUA", "") || UA_MOVIL, Referer: MS_BASE + "/" };
  const g = getJson("msCookies", null);
  if (g && typeof g === "object") {
    const par = [];
    for (const k in g) if (g[k]) par.push(k + "=" + g[k]);
    if (par.length) h.Cookie = par.join("; ");
  }
  return h;
}

async function mwImgData(url) {
  const u = String(url || "");
  if (!u || u.indexOf("data:") === 0) return u || null;
  const r = await muroBaja(u, muroHeadersMW(), "MW portada", "dimg:");
  return r ? r.data : null;
}

// v0.4.30 — Mangas.in con la misma receta que ManhwaWeb: sus portadas
// también se bajan con presentación y se guardan convertidas.
async function msImgData(url) {
  const u = String(url || "");
  if (!u || u.indexOf("data:") === 0) return u || null;
  const r = await muroBaja(u, muroHeadersMS(), "MS portada", "dimg:");
  return r ? r.data : null;
}

// Baja (si hace falta) las primeras «n» portadas de una lista al
// almacén; no toca la lista, solo llena la caché para el dibujado.
async function mwPrecarga(items, n) {
  const arr = Array.isArray(items) ? items : [];
  await Promise.all(arr.slice(0, n || 8).map(function (it) {
    return mwImgData(it && it.poster).catch(function () { return null; });
  }));
}

async function msPrecarga(items, n) {
  const arr = Array.isArray(items) ? items : [];
  await Promise.all(arr.slice(0, n || 8).map(function (it) {
    return msImgData(it && it.poster).catch(function () { return null; });
  }));
}

// La copia local de una imagen si ya está en el almacén (lectura sin
// red para el dibujado); si no hay, null. Vale para cualquier casa:
// la clave es la propia dirección de la imagen.
function imgLocalDe(url) {
  const u = String(url || "");
  if (!u || u.indexOf("data:") === 0) return u || null;
  const hit = getJson("dimg:" + u, null);
  return hit && typeof hit === "string" ? hit : null;
}

// v0.4.35 — la presentación del pintor nuevo: `headers` en las Image
// (docs vivas de Kino: Referer y User-Agent, aditivo, llega con la
// PRÓXIMA versión de la app). Un Kino de hoy pide la imagen SIN ellos
// y todo queda como siempre (fallback o copia convertida); el que
// traiga los headers la dibuja DIRECTA del sitio, sin conversión. Es
// la misma presentación con la que el plugin baja sus imágenes a mano
// (la galleta no va: el pintor no la acepta, y las dos cabeceras
// bastan para el muro); solo viaja hacia hosts ya declarados en el
// manifiesto, como exigen las docs.
function imgHeadersDeUrl(u) {
  const s = String(u || "");
  if (s.indexOf("/ms/") === 0 || /(^|[.])m440[.]in([/:]|$)/i.test(s))
    return { Referer: MS_BASE + "/", "User-Agent": getJson("msUA", "") || UA_MOVIL };
  if (s.indexOf("/mw/") === 0 || /img[12]mw[.]xyz|(^|[.])manhwaweb[.]com([/:]|$)/i.test(s))
    return { Referer: MW_BASE + "/", "User-Agent": UA_MOVIL };
  return null;
}

// Cambia las portadas de las tarjetas de las casas con muro por sus
// copias locales ya en el almacén (las tarjetas de otras fuentes
// pasan igualitas).
// v0.4.48 — las portadas convertidas son data URLs de hasta ~199.000
// caracteres cada una y viajan DENTRO de la respuesta; Kino la rechaza
// ENTERA si pasa de 2 millones («plugin answer too large», el mensaje
// rojo que rompía la entrada al plugin). Con el almacén lleno de
// portadas ya convertidas (los +18 traen portadas grandes y las
// visitas iban llenando el caché), el Inicio cruzó el tope. El adorno
// ahora tiene PRESUPUESTO compartido: se adorna en orden — lo primero
// de cada riel, que es lo que se ve — hasta llenarlo; el resto viaja
// con su URL (su icono de siempre si el muro la niega al pintor) y la
// pantalla ABRE aunque el caché esté lleno.
let decoraRestante = 0;
function decoraMurosReset(tope) { decoraRestante = tope || 700000; }
// Para las respuestas de UNA lista (búsqueda, catálogo, riel): cada
// respuesta estrena su propio presupuesto.
function decoraNueva(items) { decoraMurosReset(); return decoraMuros(items); }
function decoraMuros(items) {
  const arr = Array.isArray(items) ? items : [];
  let adornadas = 0;
  const out = arr.map(function (it) {
    if (!it || !it.poster) return it;
    const u = String(it.url || "");
    if (u.indexOf("/mw/") !== 0 && u.indexOf("/ms/") !== 0) return it;
    const d = imgLocalDe(it.poster);
    // Sin copia local o sin presupuesto: la tarjeta conserva su URL.
    if (!d || d.length > decoraRestante) return it;
    decoraRestante -= d.length;
    adornadas++;
    return Object.assign({}, it, { poster: d });
  });
  if (!adornadas && arr.length) log("decora: 0 portadas (sin copias o presupuesto " + Math.round(decoraRestante / 1000) + "k)");
  return out;
}

// v0.4.30 — LAS PÁGINAS de los capítulos con muro, con la misma
// receta: bajadas con presentación, convertidas y guardadas en
// «pgd:». Un capítulo entero no cabe de un viaje (20 s por evento),
// así que se convierte POR TANDAS: al abrir salen las primeras y las
// demás llegan solas al acercarse la persona al final (o con el
// botón «Bajar más páginas»). La que el muro niega queda con su
// hueco honrado — y se reintenta sola si la persona vuelve a ella.
const MURO_PAG_BATCH = 6; // páginas por tanda (6 en vuelo, 60 peticiones por evento)
const PGD_TOPE = 70;      // páginas guardadas por capítulo (16 MiB entre todas)

// La copia local de una PÁGINA convertida, si ya está en el almacén.
function pgdDe(url) {
  const u = String(url || "");
  if (!u || u.indexOf("data:") === 0) return u || null;
  const hit = getJson("pgd:" + u, null);
  return hit && typeof hit === "string" ? hit : null;
}

// Al abrir un capítulo con muro, las páginas de OTROS capítulos se
// van del almacén (las portadas «dimg:» se quedan: pequeñas y útiles).
function muroLimpiaPaginas(images) {
  try {
    const set = {};
    const arr = Array.isArray(images) ? images : [];
    for (let i = 0; i < arr.length; i++) set["pgd:" + String(arr[i] && arr[i].url)] = 1;
    const idx = cacheIdx();
    let fuera = 0;
    for (const k in idx) {
      if (k.indexOf("pgd:") === 0 && !set[k]) { borrarClave(k); fuera++; }
    }
    if (fuera) log("muro: " + fuera + " páginas de otros capítulos fuera del almacén");
  } catch (e) { log("muro limpia: " + ((e && e.message) || e)); }
}

// v0.4.31 — el conjunto de las páginas ya sabidas «demasiado grandes»
// (índices → 1): pasarlo evita re-pedir lo que jamás va a caber.
function muroSetDe(lista) {
  const s = {};
  (Array.isArray(lista) ? lista : []).forEach(function (i) { s[i] = 1; });
  return s;
}

// Convierte la tanda de páginas [desde, desde+cuantas) de un capítulo
// con muro: baja las que no tienen copia local (6 en vuelo), guarda las
// convertidas en «pgd:» y mide sus dimensiones de los mismos bytes.
// MUTA images (w/h de las convertidas). Devuelve { conv, neg, med }.
// v0.4.31 — «grandes» (índices ya sabidos demasiado grandes) se saltan
// sin red; las que RESULTAN grandes en esta tanda van a out.grande
// (aparte de out.negIdx: las grandes no se reintentan solas).
async function muroConvierte(images, desde, cuantas, pref, grandes) {
  const arr = Array.isArray(images) ? images : [];
  const hdrs = pref === "MS" ? muroHeadersMS() : muroHeadersMW();
  const et = pref === "MS" ? "MS" : "MW";
  const fin = Math.min(arr.length, Math.max(0, desde | 0) + (cuantas || MURO_PAG_BATCH));
  const out = { conv: 0, nuevas: 0, neg: 0, med: 0, negIdx: [], grande: [] };
  const gset = grandes || {};
  const lote = [];
  // El tope manda sobre el capítulo ENTERO (las que ya hay en el
  // almacén cuentan): un capítulo kilométrico no cabe de golpe.
  let hay = 0;
  for (let i = 0; i < arr.length; i++) if (arr[i] && arr[i].url && pgdDe(arr[i].url)) hay++;
  for (let i = Math.max(0, desde | 0); i < fin; i++) {
    const im = arr[i];
    if (!im || !im.url) continue;
    if (pgdDe(im.url)) { hay++; out.conv++; if (im.w > 0 && im.h > 0) out.med++; continue; }
    if (gset[i]) continue; // demasiado grande ya lo sabemos: ni pedirla
    if (hay + lote.length >= PGD_TOPE) break;
    lote.push(i);
  }
  for (let g = 0; g < lote.length; g += 6) {
    const sub = lote.slice(g, g + 6);
    const rs = await Promise.all(sub.map(function (ix) {
      return muroBaja(String(arr[ix].url), hdrs, et + " página " + (ix + 1), "pgd:")
        .catch(function () { return null; });
    }));
    for (let j = 0; j < sub.length; j++) {
      const r = rs[j];
      const ix = sub[j];
      if (r && r.data) {
        out.conv++; out.nuevas++;
        if (r.w > 0 && r.h > 0) { arr[ix].w = r.w; arr[ix].h = r.h; out.med++; }
      } else if (r && r.grande) { out.grande.push(ix); }
      else { out.neg++; out.negIdx.push(ix); }
    }
  }
  log("muro: tanda " + out.conv + " convertidas, " + out.neg + " negadas"
    + (out.grande.length ? ", " + out.grande.length + " muy grandes" : ""));
  return out;
}

// El registro de las páginas que el muro negó (índices), unido y
// ordenado — vive en reader.mal y viaja en el estado (chico).
function muroJuntaMal(viejo, nuevos) {
  const s = {};
  (Array.isArray(viejo) ? viejo : []).forEach(function (i) { s[i] = 1; });
  (nuevos || []).forEach(function (i) { s[i] = 1; });
  return Object.keys(s).map(Number).sort(function (a, b) { return a - b; });
}

// La carga automática de los capítulos con muro (pgChanged y
// tiraScrolled): convierte la tanda [desde, +cuantas) SOLO si el
// capítulo es de una casa con muro y hay páginas pendientes en la
// tanda; devuelve el parche de estado para que Kino redibuje, o null
// si no hay nada nuevo que dibujar (nada de red si ya está al día).
async function muroAutoLote(state, desde, cuantas) {
  const r = state.reader;
  if (!r || !Array.isArray(r.images) || !r.images.length) return null;
  const d = state.detail;
  const fSer = d ? fuenteDeUrl(d.url) : null;
  const pref = fSer && fSer.id === "mangasin" ? "MS" : (fSer && fSer.id === "manhwaweb" ? "MW" : null);
  if (!pref) return null;
  const desdeOk = Math.max(0, desde | 0);
  if (desdeOk >= r.images.length) return null;
  const cuantasOk = cuantas || MURO_PAG_BATCH;
  const fin = Math.min(r.images.length, desdeOk + cuantasOk);
  // v0.4.31 — las demasiado grandes ya sabidas no cuentan ni se
  // piden: lo único que harían es fallar otra vez igual.
  const gset = muroSetDe(r.grande);
  let pendientes = 0;
  for (let i = desdeOk; i < fin; i++) if (!pgdDe(r.images[i].url) && !gset[i]) pendientes++;
  if (!pendientes) return null;
  const st = await muroConvierte(r.images, desdeOk, cuantasOk, pref, gset);
  if (!st.conv && !st.neg && !st.grande.length) return null;
  return { state: { reader: { images: r.images, idx: r.idx, tk: r.tk,
    pend: 0, fallos: r.fallos || 0, mal: muroJuntaMal(r.mal, st.negIdx),
    grande: muroJuntaMal(r.grande, st.grande) } } };
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

// v0.4.26 — «Ultimos capitulos agregados» de LeerCapitulo: series con
// su capítulo más nuevo y su edad («Cap. 47 · 36 mins»). Es la lista
// que en la web se actualiza minuto a minuto. Estructura verificada en
// vivo contra el sitio: cada serie trae su portada y un enlace a
// /manga/<id>/<slug>/, seguidos de hasta cuatro enlaces a
// /leer/<id>/<slug>/<número>/ con el texto de edad después de cada uno.
function capsRecientesLC(html, max) {
  const out = [];
  const pos = html.search(/ultimos\s+cap[ií]tulos\s+agregados/i);
  if (pos < 0) return out;
  const zona = html.slice(pos, pos + 150000);
  // Anclas a series: la entrada trae dos enlaces a la misma (portada y
  // título); se deduplican y cada serie se procesa una vez.
  const reS = /<a\b[^>]*href="([^"]*\/manga\/[a-z0-9]{4,}\/[a-z0-9-]+\/?)"[^>]*>([\s\S]{0,800}?)<\/a>/gi;
  const anclas = [];
  let m;
  while ((m = reS.exec(zona)) !== null) {
    anclas.push({ url: m[1].replace(/^https?:\/\/[^\/]+/i, ""),
      ini: m.index, fin: m.index + m[0].length, inner: m[2] });
    if (anclas.length > 200) break;
  }
  const vistos = {};
  for (let i = 0; i < anclas.length && out.length < max; i++) {
    const a = anclas[i];
    if (vistos[a.url]) continue;
    vistos[a.url] = 1;
    // El bloque de la serie llega hasta la ancla de la siguiente serie.
    let fin = zona.length;
    for (let j = i + 1; j < anclas.length; j++) {
      if (anclas[j].url !== a.url) { fin = anclas[j].ini; break; }
    }
    const bloque = zona.slice(a.fin, fin);
    // El primer enlace a /leer/ del bloque es el capítulo más nuevo.
    const mc = bloque.match(/<a\b[^>]*href="[^"]*\/leer\/[a-z0-9]{4,}\/[a-z0-9-]+\/([0-9]+(?:[.][0-9]+)?)\/?"/i);
    if (!mc) continue;   // sin capítulos: no es una entrada de esta lista
    const num = mc[1];
    let edad = "";
    const tras = bloque.slice(mc.index, mc.index + 250).replace(/<[^>]*>/g, " ");
    const ma = tras.match(/[0-9]{1,4}\s*(?:seg(?:undos?)?|min(?:utos?|s?)?|h(?:oras?)?|d[ií]as?|semanas?|mes(?:es)?|hours?|days?|weeks?|months?|mins?)/i);
    if (ma) edad = clean(ma[0]);
    // Título y portada de entre los enlaces de esta misma serie.
    let titulo = "", poster = "";
    for (let j = i; j < anclas.length && anclas[j].url === a.url; j++) {
      const texto = clean(anclas[j].inner.replace(/<[^>]*>/g, " "));
      if (!titulo && texto && texto.length <= 90) titulo = texto;
      const im = anclas[j].inner.match(/<img\b[^>]*>/i);
      if (im && !poster) {
        const p = im[0].match(/\b(?:data-src|data-lazy-src|src)=\"([^\"]+)\"/i);
        if (p) poster = absoluta(p[1]);
      }
    }
    if (!titulo) titulo = (a.url.split("/").filter(Boolean).pop() || a.url).replace(/-/g, " ");
    out.push({ url: a.url, title: titulo, poster: poster,
      label: "Cap. " + num + (edad ? " · " + edad : "") });
  }
  log("LC caps recientes: " + out.length + " series");
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

// v0.4.23 — la FRACCIÓN de la tira (0 = arriba, 1 = final) por la que
// iba la persona en cada capítulo: la guarda onScroll y la usa
// «Continuar» para reabrir el capítulo por donde se quedó (a la tira
// no se le puede ordenar que se desplace a un punto guardado, así que
// el capítulo se reabre directamente desde esa página).
function tiraLeer(chUrl) {
  const m = getJson("tiraAtMap", {});
  if (m && typeof m === "object" && (chUrl in m)) {
    const v = Number(m[chUrl]);
    if (isFinite(v) && v >= 0 && v <= 1) return v;
  }
  return 0;
}

function tiraGuardar(chUrl, f) {
  if (!chUrl || !isFinite(f) || f < 0) return;
  const m = getJson("tiraAtMap", {});
  if (!m || typeof m !== "object") return;
  m[chUrl] = f;
  const ks = Object.keys(m);
  while (ks.length > 120) delete m[ks.shift()];
  setJson("tiraAtMap", m);
}
function favs() { return getJson("favs", []); }

// ------------------------------------------------ colecciones (v0.4.21)

// Cada colección es una lista con nombre hecha por la persona; guarda
// series completas (título, portada, dirección) en el almacén local.
// El corazón flotante del Inicio abre la lista de colecciones; tocar
// una abre su sección. Los nombres van recortados a 40 caracteres
// (cabecera de la barra) y no se repiten.
function cols() { return getJson("cols", {}); }

function colCrear(nombre) {
  const nom = String(nombre || "").trim().slice(0, 40);
  if (!nom) return { err: "Ponle un nombre a la colección." };
  const cs = cols();
  if (cs[nom]) return { err: "Ya tienes una colección llamada «" + nom + "»." };
  cs[nom] = { ts: Date.now(), items: {} };
  return { ok: setJson("cols", cs), nom: nom };
}
function colEn(nom, url) {
  const cs = cols();
  return !!(cs[nom] && cs[nom].items && cs[nom].items[url]);
}
function colMeter(nom, it) {
  const cs = cols();
  if (!cs[nom]) return false;
  cs[nom].items[it.url] = { url: it.url, title: it.title || "", poster: it.poster || "", ts: Date.now() };
  cs[nom].ts = Date.now();
  return setJson("cols", cs);
}
function colSacar(nom, url) {
  const cs = cols();
  if (!cs[nom] || !cs[nom].items) return false;
  delete cs[nom].items[url];
  cs[nom].ts = Date.now();
  return setJson("cols", cs);
}
function colBorrar(nom) {
  const cs = cols();
  if (!cs[nom]) return false;
  delete cs[nom];
  return setJson("cols", cs);
}
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

// ------------------------------------------------- v0.4.49 — mis reseñas
// Comentarios propios por serie: lo que la persona opina de cada manga,
// en la página de la serie. Viven en el aparato, viajan a los
// vinculados (como favoritos e historial) y, con la sincronización de
// GitHub activada, quedan respaldados en la nube propia.
function resenas() { return getJson("resenas", {}); }
function resenaDe(url) { return resenas()[url] || null; }
function resenaGuardar(url, texto) {
  const r = resenas();
  const t = String(texto || "").trim();
  if (t) r[url] = { text: t.slice(0, 2000), ts: Date.now() };
  else delete r[url];
  if (!setJson("resenas", r)) return false;
  syncPushResenas();
  return true;
}
function syncPushResenas() {
  try { if (typeof kino.shared === "object" && kino.shared) kino.shared.set("resenas", resenas()); }
  catch (e) { log("sync reseñas: " + e); }
}
function syncPullResenas() {
  let sr = null;
  try { if (typeof kino.shared === "object" && kino.shared) sr = kino.shared.get("resenas"); }
  catch (e) { log("sync reseñas: " + e); }
  if (!sr || typeof sr !== "object") return;
  const local = resenas();
  let changed = false;
  const claves = Object.keys(sr).slice(0, 200);
  for (let i = 0; i < claves.length; i++) {
    const k = claves[i];
    const v = sr[k];
    if (!v || typeof v !== "object" || typeof v.text !== "string" || !fuenteDeUrl(k)) continue;
    const l = local[k];
    if (l && (l.ts || 0) >= (v.ts || 0)) continue;
    local[k] = { text: v.text.slice(0, 2000), ts: v.ts || 0 };
    changed = true;
  }
  if (changed) { setJson("resenas", local); syncPushResenas(); }
}

// ------------------------------------------------- v0.4.51 — la nube propia
// (v0.4.49 la creó sobre GitHub; v0.4.51 la muda a TELEGRAM, la idea
// original del usuario, con la receta del plugin de referencia
// Sync-Gram de Kino). Respaldo de favoritos y reseñas en el chat
// privado de la persona con SU PROPIO bot de Telegram (creado con
// @BotFather): sobrevive a las reinstalaciones del plugin (el espacio
// compartido de Kino viaja entre aparatos VINCULADOS, pero no
// devuelve lo perdido al reinstalar). La copia viaja como archivo
// mangatrack.json FIJADO en ese chat: para leerla no hace falta leer
// el historial (los bots no pueden) — getChat devuelve el mensaje
// fijado y getFile entrega el archivo. Al abrir el plugin se baja y
// se une lo que falte; al cambiar algo se sube la lista completa (la
// copia nueva se fija y la vieja se borra o desfija). HONESTO: el
// último aparato que sube manda — si dos aparatos cambian cosas a la
// vez sin abrirse entre medias, el cambio más nuevo puede taparse;
// «Sincronizar ahora» (baja y vuelve a subir) lo deja derecho. El
// token del bot jamás viaja en mensajes ni registros (tgLimpio lo
// tapa), y un mensaje que la persona fije por su cuenta nunca se lee
// ni se toca (se avisa honesto).
const TG_API = "https://api.telegram.org";
const TG_ARCHIVO = "mangatrack.json";
const TG_TOKEN_FORMA = /^(\d{5,15}):[A-Za-z0-9_-]{30,}$/;

function tgCfg() {
  const c = getJson("tgSync", null);
  return c && typeof c === "object" && c.token &&
    TG_TOKEN_FORMA.test(String(c.token)) ? c : null;
}
function tgActiva() {
  const c = tgCfg();
  return !!(c && c.on && c.chatId > 0);
}
// El token jamás en un texto (mensajes, toasts o el registro).
function tgLimpio(texto) {
  let s = String(texto == null ? "" : texto);
  const c = tgCfg();
  if (c) {
    s = s.split(c.token).join("…");
    const secreto = c.token.slice(c.token.indexOf(":") + 1);
    if (secreto.length >= 8) s = s.split(secreto).join("…");
  }
  return s.replace(/\d{5,15}:[A-Za-z0-9_-]{20,}/g, "…")
    .replace(/\/(file\/)?bot[^/\s)]*/g, "/$1bot…");
}
// Texto como bytes UTF-8 en «cadena binaria» (un carácter por byte),
// lo que btoa codifica (receta de Sync-Gram).
function utf8Binario(texto) {
  const bytes = new TextEncoder().encode(texto);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}
// Una llamada a la Bot API: responde su result o lanza Error con la
// frase honesta (nunca el token).
async function tgApi(token, metodo, params, opciones) {
  const op = opciones || {};
  let r = null;
  try {
    r = await kino.fetch(TG_API + "/bot" + token + "/" + metodo, {
      method: "POST", redirect: "manual", cookies: false,
      headers: op.body ? op.headers : { "Content-Type": "application/json" },
      body: op.body || { json: params || {} }, timeoutMs: op.timeoutMs || 15000 });
  } catch (e) {
    throw new Error("No pude llegar a Telegram: revisa la conexión. (" + ((e && e.code) || "red") + ")");
  }
  let j = null;
  try { j = JSON.parse(await r.text()); } catch (e) { j = null; }
  if (!r.ok || !j || j.ok !== true) {
    const desc = j && j.description ? String(j.description) : "";
    if (r.status === 401 || r.status === 404) throw new Error("Telegram no reconoce el token del bot: cópialo otra vez de @BotFather.");
    if (r.status === 429) throw new Error("Telegram pide esperar un momento: prueba otra vez en un rato.");
    if (r.status === 409) throw new Error("Otro programa lee este bot (otro plugin o un webhook): usa un bot solo para MangaTrack.");
    if (r.status === 403) throw new Error("Tu bot está bloqueado o no lo has iniciado: ábrelo en Telegram y toca Iniciar.");
    throw new Error("Telegram respondió HTTP " + r.status + (desc ? " (" + desc.slice(0, 120) + ")" : "") + ".");
  }
  return j.result;
}
// El mensaje fijado del chat como copia nuestra, o null. Solo cuenta
// un archivo mangatrack.json que envió ESTE bot: lo que la persona fije
// por su cuenta (ajeno) nunca se lee ni se toca — solo se avisa.
async function tgFijado(token, chatId) {
  const info = await tgApi(token, "getChat", { chat_id: chatId });
  const m = info && info.pinned_message;
  if (!m) return { ajeno: false, copia: null };
  const botId = Number(String(token).split(":")[0]);
  const nuestro = m.document && m.document.file_id && m.document.file_name === TG_ARCHIVO
    && m.from && Number(m.from.id) === botId;
  if (!nuestro) return { ajeno: true, copia: null };
  return { ajeno: false, copia: { id: m.message_id, fileId: m.document.file_id } };
}
// Baja el respaldo y UNE lo que falte: favoritos sin repetir, reseñas
// e historial con la más reciente por serie, colecciones por nombre y
// serie (v0.4.52 — la copia lleva TODO). No borra nada local.
async function tgBajar() {
  const c = tgCfg();
  if (!c || !(c.chatId > 0)) throw new Error("Configura primero tu bot de Telegram (Sincronizar).");
  const f = await tgFijado(c.token, c.chatId);
  if (f.ajeno) {
    log("sync nube: hay un mensaje tuyo fijado encima de la copia — desfíjalo en el chat con tu bot");
    return { ajeno: true, favs: 0, resenas: 0 };
  }
  if (!f.copia) return { favs: 0, resenas: 0 };
  const file = await tgApi(c.token, "getFile", { file_id: f.copia.fileId });
  if (!file || !file.file_path) throw new Error("Telegram no entregó la copia guardada.");
  const ruta = String(file.file_path).split("/").map(encodeURIComponent).join("/");
  const r = await kino.fetch(TG_API + "/file/bot" + c.token + "/" + ruta,
    { method: "GET", redirect: "manual", cookies: false, timeoutMs: 30000 });
  if (!r.ok) throw new Error("Bajar la copia falló (HTTP " + r.status + ").");
  let remoto = {};
  try { remoto = JSON.parse(await r.text()) || {}; }
  catch (e) { log("sync nube: respaldo ilegible: " + ((e && e.message) || e)); return { favs: 0, resenas: 0 }; }
  const local = favs();
  const have = {};
  for (let i = 0; i < local.length; i++) have[local[i].url] = 1;
  const rf = Array.isArray(remoto.favs) ? remoto.favs : [];
  let nuevosF = 0;
  for (let i = 0; i < rf.length && i < 200; i++) {
    const f2 = rf[i];
    if (!favValido(f2) || have[f2.url]) continue;
    local.push({ url: f2.url, title: String(f2.title || "").slice(0, 200),
      poster: typeof f2.poster === "string" ? f2.poster.slice(0, 500) : "" });
    have[f2.url] = 1;
    nuevosF++;
  }
  if (local.length > 100) local.length = 100;
  setJson("favs", local);
  syncPushFavs();
  const rr = remoto.resenas && typeof remoto.resenas === "object" ? remoto.resenas : {};
  const lr = resenas();
  let nuevasR = 0;
  const rk = Object.keys(rr).slice(0, 200);
  for (let i = 0; i < rk.length; i++) {
    const k = rk[i];
    const v = rr[k];
    if (!v || typeof v !== "object" || typeof v.text !== "string" || !fuenteDeUrl(k)) continue;
    const l = lr[k];
    if (l && (l.ts || 0) >= (v.ts || 0)) continue;
    lr[k] = { text: v.text.slice(0, 2000), ts: v.ts || 0 };
    nuevasR++;
  }
  if (nuevasR) { setJson("resenas", lr); syncPushResenas(); }
  // v0.4.52 — las COLECCIONES también viajan en la copia: se unen por
  // nombre y, dentro de cada una, por serie — la copia más nueva de
  // cada serie gana y nunca se borra nada local.
  const rc = remoto.cols && typeof remoto.cols === "object" ? remoto.cols : {};
  const lc = cols();
  let nuevasC = 0;
  const nomsC = Object.keys(rc).slice(0, 50);
  for (let i = 0; i < nomsC.length; i++) {
    const nom = String(nomsC[i]).slice(0, 40);
    const rCol = rc[nomsC[i]];
    if (!nom || !rCol || typeof rCol !== "object" ||
        typeof rCol.items !== "object" || rCol.items === null) continue;
    const ks = Object.keys(rCol.items).slice(0, 200);
    if (!lc[nom]) {
      const items = {};
      for (let j = 0; j < ks.length; j++) {
        const it = rCol.items[ks[j]];
        if (!it || typeof it.url !== "string" || !fuenteDeUrl(it.url)) continue;
        items[it.url] = { url: it.url, title: String(it.title || "").slice(0, 200),
          poster: typeof it.poster === "string" ? it.poster.slice(0, 500) : "", ts: it.ts || 0 };
        nuevasC++;
      }
      if (Object.keys(items).length) lc[nom] = { ts: rCol.ts || 0, items: items };
    } else {
      let changed = false;
      lc[nom].items = lc[nom].items || {};
      for (let j = 0; j < ks.length; j++) {
        const it = rCol.items[ks[j]];
        if (!it || typeof it.url !== "string" || !fuenteDeUrl(it.url)) continue;
        const l = lc[nom].items[it.url];
        if (l && (l.ts || 0) >= (it.ts || 0)) continue;
        lc[nom].items[it.url] = { url: it.url, title: String(it.title || "").slice(0, 200),
          poster: typeof it.poster === "string" ? it.poster.slice(0, 500) : "", ts: it.ts || 0 };
        changed = true;
        nuevasC++;
      }
      if (changed) lc[nom].ts = Math.max(lc[nom].ts || 0, rCol.ts || 0);
    }
  }
  if (nuevasC) setJson("cols", lc);
  // v0.4.52 — el HISTORIAL también: por serie gana el avance más nuevo
  // (como las reseñas); las que solo existen aquí no se tocan, y el
  // tope de 100 series es el de siempre.
  const rh = remoto.hist && typeof remoto.hist === "object" ? remoto.hist : {};
  const lh = hist();
  let nuevasH = 0;
  const ksH = Object.keys(rh).slice(0, 200);
  for (let i = 0; i < ksH.length; i++) {
    const v = rh[ksH[i]];
    if (!v || typeof v !== "object" || typeof v.url !== "string" || !fuenteDeUrl(v.url)) continue;
    const l = lh[v.url];
    if (l && (l.ts || 0) >= (v.ts || 0)) continue;
    lh[v.url] = { url: v.url, num: typeof v.num === "string" ? v.num.slice(0, 12) : v.num,
      idx: v.idx || 0, ts: v.ts || 0,
      title: String(v.title || "").slice(0, 200),
      poster: typeof v.poster === "string" ? v.poster.slice(0, 500) : "" };
    nuevasH++;
  }
  if (nuevasH) {
    const todos = Object.keys(lh);
    if (todos.length > 100) {
      todos.sort((a, b) => (lh[b].ts || 0) - (lh[a].ts || 0));
      for (let i = 100; i < todos.length; i++) delete lh[todos[i]];
    }
    setJson("hist", lh);
    syncPushHist();
  }
  return { favs: nuevosF, resenas: nuevasR, cols: nuevasC, hist: nuevasH };
}
// Sube la lista completa como archivo fijado en el chat: la copia nueva
// se fija (sin sonido) y la de antes se borra (o al menos se desfija).
async function tgSubir() {
  const c = tgCfg();
  if (!c || !(c.chatId > 0)) throw new Error("Configura primero tu bot de Telegram (Sincronizar).");
  const antes = await tgFijado(c.token, c.chatId);
  if (antes.ajeno) log("sync nube: mensaje ajeno fijado — la copia nueva se fija encima");
  const datos = { v: 2, ts: Date.now(), favs: favs(), resenas: resenas(),
    cols: cols(), hist: hist() };
  // Cuerpo multipart armado a mano (receta de Sync-Gram): los campos de
  // texto y el archivo mangatrack.json con las reseñas tal cual; el
  // cuerpo entero viaja como base64 de sus bytes UTF-8.
  const borde = "MangaTrack" + String(Date.now() % 100000000) + "x";
  let cuerpo = "";
  cuerpo += "--" + borde + "\r\nContent-Disposition: form-data; name=\"chat_id\"\r\n\r\n" + c.chatId + "\r\n";
  cuerpo += "--" + borde + "\r\nContent-Disposition: form-data; name=\"disable_notification\"\r\n\r\ntrue\r\n";
  cuerpo += "--" + borde + "\r\nContent-Disposition: form-data; name=\"caption\"\r\n\r\nCopia de respaldo de MangaTrack. No la borres ni la desfijes.\r\n";
  cuerpo += "--" + borde + "\r\nContent-Disposition: form-data; name=\"document\"; filename=\"" + TG_ARCHIVO + "\"\r\nContent-Type: application/json\r\n\r\n";
  cuerpo += JSON.stringify(datos) + "\r\n--" + borde + "--\r\n";
  const enviado = await tgApi(c.token, "sendDocument", null, {
    headers: { "Content-Type": "multipart/form-data; boundary=" + borde },
    body: { base64: btoa(utf8Binario(cuerpo)) }, timeoutMs: 30000 });
  const id = enviado && enviado.message_id;
  if (!(id >= 0)) throw new Error("Telegram no confirmó la copia.");
  try {
    await tgApi(c.token, "pinChatMessage", { chat_id: c.chatId, message_id: id, disable_notification: true });
  } catch (e) { log("sync nube: no pude fijar la copia (" + tgLimpio((e && e.message) || e) + ")"); }
  if (antes.copia && antes.copia.id !== id) {
    try { await tgApi(c.token, "deleteMessage", { chat_id: c.chatId, message_id: antes.copia.id }); }
    catch (e) {
      try { await tgApi(c.token, "unpinChatMessage", { chat_id: c.chatId, message_id: antes.copia.id }); }
      catch (e2) { log("sync nube: la copia vieja quedó más abajo en el chat"); }
    }
  }
  // v0.4.53 — la hora de la última subida la anota la subida misma:
  // el freno del historial y la pantalla de «Sincronizar» la leen.
  setJson("tgTs", Date.now());
  return datos;
}
// Busca el chat privado de la persona entre los mensajes que le
// llegaron al bot (getUpdates): el último humano que le escribió. La
// lectura reconoce los mensajes (offset) para no volver a leerlos.
async function tgBuscarChat(token) {
  const params = { timeout: 0, limit: 100, allowed_updates: ["message"] };
  const offset = Number(getJson("tgOffset", 0)) || 0;
  if (offset) params.offset = offset;
  const ups = await tgApi(token, "getUpdates", params);
  const lista = Array.isArray(ups) ? ups : [];
  let hallado = null;
  let ultimo = 0;
  for (let i = 0; i < lista.length; i++) {
    const u = lista[i];
    if (u && Number.isSafeInteger(u.update_id) && u.update_id > ultimo) ultimo = u.update_id;
    const m = u && u.message;
    if (!m || !m.chat || m.chat.type !== "private" || !m.from || m.from.is_bot ||
        Number(m.from.id) !== Number(m.chat.id)) continue;
    const nombre = m.from.username ? "@" + m.from.username
      : String(m.from.first_name || "").slice(0, 40);
    hallado = { id: Number(m.chat.id), nombre: nombre || "tu cuenta" };
  }
  if (ultimo) setJson("tgOffset", ultimo + 1);
  return hallado;
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
    // v0.4.45 — «más detalles»: MangaDex publica el número del último
    // capítulo de cada serie (lastChapter); viaja bajo el título.
    const lc = String((m.attributes && m.attributes.lastChapter) || "").trim();
    out.push({ url: "/title/" + m.id, title: mdTitulo(m), poster: mdPortada(m),
      label: /^\d+([.]\d+)?$/.test(lc) ? "Cap. " + lc : "" });
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
    // v0.4.28 — ManhwaWeb mide sus imágenes presentándose igual (su casa
    // img1mw/img2mw niega a los pedidos desnudos): el lector las DIBUJA
    // con el pintor, que no puede presentarse — de ahí la ventanita.
    if (/img[12]mw[.]xyz/i.test(u)) {
      ops.headers = {
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent": UA_MOVIL,
        Referer: MW_BASE + "/",
      };
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
  // v0.4.33 — skeleton: mientras llega la serie o el catálogo, un
  // marcador de lugar con la FORMA del contenido (portadas y líneas,
  // en el color atenuado de Kino con su pulso suave) se lee mejor
  // que un molinillo suelto. Con wrap las cuatro tarjetas se reparten
  // solas: dos por fila en el teléfono, las cuatro en la TV.
  return { type: "Column", padding: 16, gap: 12, children: [
    { type: "Row", gap: 8, wrap: true, children: [0, 1, 2, 3].map((i) => (
      { type: "Skeleton", shape: "card", width: 110, key: "sk" + i })) },
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
  // v0.4.35 — portadas de las casas con muro con su presentación para
  // el pintor de Kino (inofensivo hoy: un Kino sin `headers` las pide
  // desnudas como siempre y salta el mismo icono de siempre; la copia
  // local convertida sigue ganando cuando existe).
  const hdrs = imgHeadersDeUrl(it.url);
  if (hdrs) img.headers = hdrs;
  return {
    type: "Card", key: serieKey(prefix, it.url), flush: true,
    onTap: { event: "openSeries", arg: it.url },
    children: [img].concat(twoLines(it.title).map((ln) => (
      { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 })))
      // v0.4.26 — etiqueta opcional bajo el título (capítulo y edad de
      // los «Recién actualizados»); las demás tarjetas no la traen.
      .concat(it.label ? [{ type: "Text", text: it.label, textEn: it.label,
        style: "caption", color: "muted", padding: 8 }] : []),
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

// v0.4.27 — la tarjetita «Ver más» al final de un riel: abre la
// sección entera en cuadrícula (y con «Cargar más» donde la fuente
// tiene más páginas de esa sección).
function verMasCard(key) {
  return { type: "Card", key: "vermas-" + key, flush: true,
    onTap: { event: "verMas", arg: key },
    children: [{ type: "Column", padding: 16, gap: 4, crossAxisAlignment: "center",
      children: [
        { type: "Icon", name: "arrow_forward", color: "muted" },
        { type: "Text", text: "Ver más", textEn: "See more", style: "caption", color: "muted" },
      ] }] };
}

function railOf(titulo, tituloEn, items, key, prefix) {
  if (!items || !items.length) return [];
  return [
    { type: "Text", text: titulo, textEn: tituloEn, style: "h3", padding: 16 },
    { type: "SingleChildScrollView", key: key, direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8,
        children: items.slice(0, 20).map((it) => posterCard(it, prefix, true))
          // v0.4.29 — con 3 series o más ya sale la tarjetita que abre
          // la sección entera (antes pedía 10 y las secciones chicas
          // de LeerCapitulo/LectorXd se quedaban sin su «Ver más»).
          .concat(items.length >= 3 ? [verMasCard(key)] : []) }] },
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

// v0.4.34 — la lista de fuentes del selector de la barra (la receta de
// las apps de lectura como AchyManga): cada fuente con la activa
// RELENDA por selected (el color propio de Kino) y su ✓ del trailing;
// tocar otra la activa, recarga el Inicio con su contenido y vuelve.
// AniList al final para buscar y descubrir manga, como hacía el riel
// viejo de fuentes que esta pantalla reemplaza.
function fuentesTree() {
  const f = fuenteActiva();
  const items = [
    { type: "Text", text: "Elige tu fuente de lectura", textEn: "Pick your reading source",
      style: "caption", color: "muted", padding: { h: 16, v: 8 } },
  ].concat(FUENTES.map(function (x) {
    const activa = x.id === f.id;
    const t = {
      type: "ListTile", key: "fs-" + x.id, selected: activa,
      title: x.nombre,
      subtitle: activa ? "Fuente activa" : "Toca para cambiar",
      subtitleEn: activa ? "Active source" : "Tap to switch",
      onTap: activa ? { event: "fuenteActual" } : { event: "fuenteElegir", arg: x.id },
    };
    if (activa) t.trailing = { type: "Icon", name: "check", color: "primary" };
    return t;
  })).concat([
    { type: "ListTile", key: "fs-anilist", title: "AniList",
      subtitle: "Buscar y descubrir manga", subtitleEn: "Search and discover manga",
      onTap: { event: "alOpen", arg: "anilist" } },
  ]);
  return { type: "Scaffold",
    appBar: { type: "AppBar", key: "barFuentes", title: "Fuentes", titleEn: "Sources",
      leading: { type: "IconButton", key: "backFuentes", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "ListView", key: "listaFuentes", items: items } };
}

async function homeTree() {
  const f = fuenteActiva();
  let html = "";
  let populares = [];
  let recientes = [];
  let actualizados = [];
  let mixtas = [];
  let msPopBloqueada = false;
  // v0.4.45 — la vitrina del ranking de grupos scan (solo ManhwaWeb).
  let seccionScans = [];
  // v0.4.27 — «Ver más»: qué secciones tienen más páginas en el sitio
  // (para el botón «Cargar más» de su cuadrícula) y por qué puerta se
  // piden las de Mangas.in (sus listas cambian de entrada).
  let masPop = false;
  let masRec = false;
  let msVia = "";
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
    // v0.4.27 — ambas consultas de MangaDex pagan más páginas con
    // offset: «Cargar más» puede seguir pidiendo.
    masPop = true; masRec = true;
  } else if (f.id === "inmanga") {
    // El catálogo popular sale del POST; si el POST no responde, la

    // portada misma de InManga (un GET, que sí funciona) trae
    // «Últimas actualizaciones» con sus enlaces.
    titPop = "Populares de InManga"; titPopEn = "Popular on InManga";
    titRec = "Últimas actualizaciones"; titRecEn = "Latest updates";
    let pag = "";
    try { pag = await imPostForm("/manga/getMangasConsultResult", "", 1, 0, 20); } catch (e) { log("IM POST falló: " + e); }
    try { populares = pag ? imCards(pag, 20) : []; } catch (e) { log("IM cards POST: " + e); }
    // v0.4.27 — el POST pagina (skip/take): si llenó las populares,
    // «Cargar más» puede pedir la siguiente ventana. Si el POST falló
    // y las populares vinieron de la portada (GET), esa lista no
    // pagina: sin botón.
    if (populares.length && pag) masPop = true;
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
    // v0.4.27 — el directorio pagina con p=: Populares y Novedades
    // pueden seguir; el feed /recientes es una sola página.
    masPop = true; masRec = true;
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
      // v0.4.27 — por aquí paginó: «Cargar más» puede volver a pedir
      // filterList con la página siguiente.
      if (populares.length) msVia = "filterList";
    } catch (e) {
      // v0.4.15 — el sitio le contestó con su revisión al catálogo por
      // visitas (el 403 de la prueba real): las mismas tarjetas se
      // sirven del catálogo público de siempre (/manga-list).
      log("MS home pop filterList bloqueado (" + ((e && e.message) || e) + "): probando /manga-list");
      try {
        populares = msCards(await getHtmlDe(f, "/manga-list?page=1"), 20);
        // v0.4.27 — la puerta pública también pagina.
        if (populares.length) msVia = "manga-list";
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
    // v0.4.27 — «Cargar más» solo si las populares entraron por una
    // puerta que pagina (filterList o manga-list); de la portada o de
    // la caché no hay más páginas que pedir.
    masPop = !!msVia;
    try {
      // Pausa entre las dos preguntas de la portada: el sitio atiende
      // mejor a quien no se las mete seguidas (así lo hacen sus otras apps).
      await kino.sleep(900);
      recientes = msRecientesDe(JSON.parse(await getHtmlDe(f, "/lasted?p=1")), 20);
      // v0.4.27 — el feed «lasted» pagina con p=: si contestó, se
      // puede pedir la siguiente.
      masRec = recientes.length > 0;
    } catch (e) { log("MS home rec: " + e); }
    // v0.4.30 — las portadas de Mangas.in al almacén con la misma
    // receta de ManhwaWeb (bajar con presentación, convertir); el
    // dibujado las toma de ahí sin red.
    try { await msPrecarga(populares, 8); await msPrecarga(recientes, 8); }
    catch (e) { log("MS portadas home: " + ((e && e.message) || e)); }
  } else if (f.id === "manhwaweb") {
    // v0.4.45 — el Inicio de ManhwaWeb como su página COMPLETA: la
    // misma llamada (/manhwa/nuevos) trae «Nuevas Obras» (Principal y
    // Adulto +18 juntas) y el top («Lo más leído» y el ranking de
    // grupos scan); /latest/new-manhwa trae «Nuevos capítulos» (las
    // tres listas, Principal y +18). Todas finitas: sin «Cargar más».
    titPop = "Nuevas obras de ManhwaWeb"; titPopEn = "New works on ManhwaWeb";
    titRec = "Nuevos capítulos de ManhwaWeb"; titRecEn = "New chapters on ManhwaWeb";
    titUpd = "Lo más leído de ManhwaWeb"; titUpdEn = "Most read on ManhwaWeb";
    try {
      const jn = await mwGet("/manhwa/nuevos");
      populares = mwNuevas(jn, 20);
      actualizados = mwTop(jn, 20);
      const sc = mwScans(jn, 10);
      if (sc.length) {
        seccionScans = [{ type: "Text", text: "Top grupos scan de ManhwaWeb",
          textEn: "ManhwaWeb top scan groups", style: "h3", padding: 16 },
          { type: "Column", key: "mwScans", padding: 16, gap: 4,
            children: sc.map((s, i) => ({ type: "Text",
              text: (i + 1) + ". " + s.name + " — " + String(s.caps).replace(/(\d)(?=(\d{3})+$)/g, "$1.") + " capítulos",
              textEn: (i + 1) + ". " + s.name + " — " + String(s.caps) + " chapters",
              style: "caption", color: "muted" })) }];
      }
    } catch (e) { log("MW home nuevas: " + ((e && e.message) || e)); }
    try { recientes = mwUltimos(await mwGet("/latest/new-manhwa"), 20); } catch (e) { log("MW home caps: " + ((e && e.message) || e)); }
    masPop = false; masRec = false;
    // v0.4.29 — portadas de verdad: se bajan con presentación y se
    // guardan convertidas para el dibujado (caída suave si el muro las
    // niega: quedan con su URL normal y su salvapantallas).
    try { await mwPrecarga(populares, 8); await mwPrecarga(recientes, 8); }
    catch (e) { log("MW portadas home: " + ((e && e.message) || e)); }
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
      populares = cardsLX(html.slice(posP, posR), 24);
      recientes = cardsLX(html.slice(posR), 24);
    }
    if (!populares.length && !recientes.length) mixtas = cardsLX(html, 40);
    if (!populares.length && !recientes.length) {
      const heads = (html.match(/<h[123][^>]*>[^<]{2,50}/gi) || []).slice(0, 6);
      log("LX portada sin secciones; h: " + heads.join(" ~ ").replace(/\s+/g, " ").slice(0, 300));
    }
  } else {
    // La portada de LeerCapitulo trae tres secciones (Tendencias,
    // Populares, Ultimos mangas) y al final «Ultimos capitulos
    // agregados». v0.4.26: el riel «Recién actualizados» se llena con
    // ESA lista (series con su capítulo más nuevo y su edad — la que
    // en la web se mueve minuto a minuto); «Ultimos mangas» son series
    // AÑADIDAS y van debajo con nombre honesto («Series añadidas»).
    const posT = html.search(/tendencias/i);
    const posP = html.search(/populares/i);
    const posU = html.search(/ultimos\s+mangas/i);
    if (posT >= 0 && posP > posT && posU > posP) {
      populares = homeCards(html.slice(posP, posU), 10)
        .concat(homeCards(html.slice(posT, posP), 24));
      actualizados = homeCards(html.slice(posU), 24);
      titUpd = "Series añadidas"; titUpdEn = "Recently added";
    } else {
      mixtas = homeCards(html, 40);
    }
    try { recientes = capsRecientesLC(html, 24); } catch (e) { log("LC caps recientes: " + ((e && e.message) || e)); }
    if (recientes.length) {
      titRec = "Recién actualizados"; titRecEn = "Just updated";
    }
    }
  }
  const vp = {};
  populares = populares.filter((x) => (!vp[x.url] && (vp[x.url] = 1)));
  const vr = {};
  recientes = recientes.filter((x) => (!vr[x.url] && (vr[x.url] = 1)));
  if (!populares.length && !recientes.length && !mixtas.length) mixtas = cardsDe(f, html, 40);
  // v0.4.22 — el riel de «Mis favoritos» se retira del Inicio
  // (petición de la persona: con las colecciones del corazón ya no
  // hace falta aquí; su lista entera está en la pantalla del
  // corazón, como primera tarjeta).
  const hh = hist();
  const hTodos = Object.keys(hh).map((k) => ({ url: k, title: hh[k].title || "",
      poster: hh[k].poster || "", ts: hh[k].ts || 0,
      // v0.4.33 — la etiqueta de capítulo bajo el título (la misma
      // vía de it.label de los «Recién actualizados»): donde estabas
      // de cada serie, a la vista en el riel y en su «Ver más».
      label: (hh[k].num || "") !== "" ? "Cap. " + hh[k].num : "" }))
    .filter((x) => x.title).sort((a, b) => b.ts - a.ts);
  const hItems = hTodos.slice(0, 15);
  const railHist = hItems.length ? [
    // v0.4.33 — la insignia con el número de series en lectura da el
    // toque de las apps de manga al encabezado del riel protagonista.
    { type: "Row", gap: 8, padding: { h: 16 }, children: [
      { type: "Text", text: "Seguir leyendo", textEn: "Keep reading", style: "h3" },
      { type: "Badge", text: String(hTodos.length) },
    ] },
    { type: "SingleChildScrollView", key: "railHist", direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8,
        children: hItems.map((it) => posterCard(it, "h-", true))
          // v0.4.27 — el riel enseña 15; «Ver más» abre el historial
          // entero (hasta 100 series) en cuadrícula.
          // v0.4.29 — mismo umbral bajo que los demás rieles.
          .concat(hTodos.length >= 3 ? [verMasCard("railHist")] : []) }] },
  ] : [];
  // v0.4.34 — el riel de fuentes se retira del Inicio: su lista
  // vive ahora en el selector de la barra (fuenteBtn → pantalla
  // «fuentes»), con la activa marcada y AniList al final.
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
  // v0.4.55 — el riel «Para ti» se dibuja también cuando la fuente
  // no trajo nada: la puerta del descubrimiento siempre visible.
  const paraRail = paraTiRail();
  if (!populares.length && !recientes.length && !mixtas.length && !msAviso.length && !paraRail.length) return VACIO_SERIES;
  // v0.4.27 — cada riel deja su sección en el almacén para su «Ver
  // más»: la cuadrícula la lee de ahí (el patrón del catálogo), y el
  // botón «Cargar más del sitio» solo aparece donde mas dice que la
  // fuente tiene otra página de ESA sección.
  const guardarRiel = function (key, obj) {
    try {
      if (!setJsonCache("riel:" + key, obj)) log("riel " + key + " sin guardar: almacén lleno");
    } catch (e) { log("riel " + key + " sin guardar: " + ((e && e.message) || e)); }
  };
  if (populares.length) guardarRiel("railPop", { f: f.id, tit: titPop, titEn: titPopEn,
    via: msVia, items: populares, page: 1, mas: masPop, start: 0 });
  if (recientes.length) guardarRiel("railRec", { f: f.id, tit: titRec, titEn: titRecEn,
    via: "", items: recientes, page: 1, mas: masRec, start: 0 });
  if (actualizados.length) guardarRiel("railUpd", { f: f.id, tit: titUpd, titEn: titUpdEn,
    via: "", items: actualizados, page: 1, mas: false, start: 0 });
  if (hTodos.length) guardarRiel("railHist", { f: "hist", tit: "Seguir leyendo",
    titEn: "Keep reading", items: hTodos, page: 1, mas: false, start: 0 });
  // v0.4.29 — ya están los rieles guardados con sus URLs cortas; para
  // ESTE dibujado las portadas de las casas con muro (ManhwaWeb y,
  // desde la v0.4.30, Mangas.in) se cambian por sus copias locales
  // del almacén.
  if (f.id === "manhwaweb" || f.id === "mangasin") {
    decoraMurosReset();
    populares = decoraMuros(populares);
    recientes = decoraMuros(recientes);
    // v0.4.45 — «Lo más leído» de ManhwaWeb también es de la casa con
    // muro: su portada viaja como copia local cuando ya está.
    actualizados = decoraMuros(actualizados);
  }
  // v0.4.33 — el hero del Inicio: una sola serie destacada arriba de
  // todo, el banner oficial de Kino (el mismo de la portada de su
  // lado de video). Sale de las populares de la fuente activa y rota
  // de a una por día (la fecha decide, no el azar: el mismo día, la
  // misma serie — así el Inicio no cambia bajo los dedos). En las
  // casas con muro la portada ya es la copia local convertida; si el
  // pintor no la admite en un banner, el hero se dibuja igual con su
  // título, su línea y sus botones (la imagen se descarta, no la
  // pantalla). El segundo botón abre las populares en cuadrícula.
  let hero = [];
  if (populares.length) {
    const dia = Math.floor(Date.now() / 86400000);
    const it = populares[dia % populares.length];
    if (it && it.title && it.url) {
    const hNodo = {
      type: "heroCard",
      title: String(it.title).slice(0, 60),
      titleEn: String(it.title).slice(0, 60),
      text: "Destacado de hoy en " + f.nombre,
      textEn: "Today's pick on " + f.nombre,
      buttons: [
        { type: "ElevatedButton", labelText: "Ver serie", labelTextEn: "Open series",
          onPressed: { event: "openSeries", arg: it.url } },
        { type: "TextButton", labelText: "Populares", labelTextEn: "Popular",
          onPressed: { event: "verMas", arg: "railPop" } },
      ],
    };
    if (it.poster) hNodo.image = it.poster;
    hero = [hNodo];
    }
  }
  // v0.4.33 — orden de la portada: el hero, «Seguir leyendo» de
  // protagonista, el contenido de la fuente y al final el catálogo
  // (las fuentes viven en el selector de la barra desde la v0.4.34).
  return { type: "SingleChildScrollView", key: "home", children: []
    .concat(hero)
    .concat(railHist)
    .concat(paraRail)
    .concat(msAviso)
    .concat(railOf(titPop, titPopEn, populares, "railPop", "p-"))
    .concat(railOf(titRec, titRecEn, recientes, "railRec", "r-"))
    .concat(railOf(titUpd, titUpdEn, actualizados, "railUpd", "u-"))
    .concat(seccionScans)
    .concat(gridSeries)
    .concat(catalogo) };
}

function detalleSinCaps(url) {
  const f = fuenteDeUrl(url);
  if (f && f.id === "lectorxd")
    return "No hay capítulos legibles de esta serie en LectorXd: si es +18, la cierra sin cuenta. Prueba otra serie.";
  if (f && f.id === "manhwaweb")
    return "ManhwaWeb no entregó capítulos de esta serie: puede ser +18 (quedan fuera de su biblioteca pública, como en MangaOni) o estar retirada. Prueba otra serie.";
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
  // v0.4.49 — la reseña propia de la serie, si ya la escribió.
  const res = resenaDe(d.url);
  const resTxt = res ? res.text : "";
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
    ? { type: "Image", url: imgLocalDe(meta.poster) || meta.poster, width: { compact: 120, expanded: 160 },
        aspect: "2:3", alt: meta.title, fallback: { type: "Icon", name: "list" } }
    : { type: "Icon", name: "list" };
  // v0.4.35 — la portada del detalle de una serie con muro, con su
  // presentación para el pintor nuevo (la copia local convertida sigue
  // ganando si existe: esta es su red de respaldo).
  const hdrsC = imgHeadersDeUrl(d.url);
  if (hdrsC && meta.poster) cover.headers = hdrsC;
  const head = {
    type: "Row", gap: 16, padding: 16, crossAxisAlignment: "start", stackOnNarrow: true,
    children: [
      cover,
      { type: "Column", gap: 6, flex: 2, crossAxisAlignment: "start", children: [
        { type: "Text", text: meta.title || d.url, style: "h2" },
        { type: "Text", text: chapters.length + " capítulos",
          textEn: chapters.length + " chapters", color: "muted", style: "caption" },
        // v0.4.33 — la barra de progreso de lectura: cuánto llevas de
        // la serie, a la vista (el índice del historial es absoluto,
        // así que el conteo es correcto en cualquier ventana de la
        // lista). Sin historial de esta serie no se dibuja.
        hIdx >= 0 && capsTotal > 0 ? { type: "LinearProgressIndicator",
          value: Math.min(1, (hIdx + 1) / capsTotal),
          labelText: "Llevas " + (hIdx + 1) + " de " + capsTotal + " capítulos",
          labelTextEn: (hIdx + 1) + " of " + capsTotal + " chapters" } : null,
        meta.overview ? { type: "Text", text: meta.overview.slice(0, 1500), style: "p", color: "muted" } : null,
        // v0.4.49 — la reseña propia, a la vista bajo la sinopsis.
        resTxt ? { type: "Text", text: "Tu reseña: " + resTxt.slice(0, 600),
          textEn: "Your review: " + resTxt.slice(0, 600),
          style: "p", color: "muted" } : null,
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
            { type: "ElevatedButton", key: "colAddBtn", icon: "add",
              labelText: "Añadir a colección", labelTextEn: "Add to collection",
              onPressed: "colAdd" },
            // v0.4.49 — la reseña propia: escribir, editar o borrar lo
            // que la persona opina de la serie.
            { type: "ElevatedButton", key: "resBtn", icon: resTxt ? "edit" : "rate_review",
              labelText: resTxt ? "Editar reseña" : "Mi reseña",
              labelTextEn: resTxt ? "Edit review" : "My review",
              onPressed: "resenaAbrir" },
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

// v0.4.40 — la página de un capítulo con muro SIN copia local, dibujada
// EN DIRECTO del sitio: el mismo Image de siempre con la presentación
// nueva (headers, Kino 0.9.83) — la baja el propio Kino (caché, de 4
// en 4) y sin tope de tamaño. La presentación solo viaja si la
// dirección de la página y su Referer están en los hosts del
// manifiesto (las casas del muro ya están); un Kino sin `headers` la
// pide desnuda, el muro la niega y queda el hueco honrado del
// fallback — la ventanita sigue de respaldo. En el modo páginas no
// hay fallback (el tope de nodos del widget pages manda).
function muroPageDirecta(p, i, ratioGuia, sinFallback) {
  const nodo = pageNodes(p, i, ratioGuia, true)[0];
  const hdrs = imgHeadersDeUrl(p && p.url);
  if (hdrs) nodo.headers = hdrs;
  if (!sinFallback) {
    nodo.fallback = { type: "Text", key: "nf" + i,
      text: "Página " + (i + 1) + " no se dibujó — abre el capítulo de nuevo o toca «Leer en ventanita»",
      textEn: "Page " + (i + 1) + " did not draw — reopen the chapter or use «Read in the small window»",
      color: "muted", style: "caption", padding: 12 };
  }
  return nodo;
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
  // v0.4.28 — ManhwaWeb en la misma situación que Mangas.in: su casa
  // de imágenes niega el paso al pintor de Kino (comprobado desde el
  // servidor de pruebas; el diagnóstico por hora dirá si desde el
  // teléfono es distinto).
  const esMw = d && d.url && d.url.indexOf("/mw/") === 0;
  const esMuro = esMs || esMw;
  // v0.4.30 — el lector con muro dibuja las páginas CONVERTIDAS (las
  // copias locales «pgd:»: la receta de las portadas aplicada a las
  // páginas). v0.4.40 — la que aún no está guardada ya no es un hueco:
  // se dibuja EN DIRECTO del sitio con presentación (Image.headers),
  // y el hueco honrado solo queda de fallback si el muro la niega.
  // Las tandas siguen guardando copias al acercarse la persona al
  // final (o con «Bajar más páginas»).
  let convN = 0;
  if (esMuro) for (let ci = 0; ci < r.images.length; ci++) if (pgdDe(r.images[ci].url)) convN++;
  // v0.4.31 — las demasiado grandes (reader.grande): nunca tendrán
  // copia local posible (el tope de data URL), pero desde v0.4.40 se
  // dibujan en directo sin tope; no cuentan como «por bajar».
  const gset = muroSetDe(r.grande);
  let grandeN = 0;
  for (let gi = 0; gi < r.images.length; gi++) if (gset[gi]) grandeN++;
  const btnVentanaLeer = { type: "TextButton", key: "btnLeerVentana", labelText: "Leer en ventanita",
    labelTextEn: "Read in the small window", onPressed: "msLeerVentana" };
  // v0.4.41 — las notas del muro al abrir el capítulo se retiran:
  // pedidas por la persona tras probarlas en el teléfono («solo tapan
  // más las páginas»). Con las imágenes ya dibujándose en directo
  // (v0.4.40) no hay nada que explicar — el Registro y la ventanita
  // (al final del capítulo) siguen de respaldo, y el aviso de «el
  // sitio no entregó ninguna página» sigue: ese sí dice algo que
  // hacer.
  const avisoMs = ((esMs || esMw) && !medidas.length && !convN) ? [
    { type: "Column", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
      { type: "Text", text: "El sitio no entregó ninguna de las " + r.images.length + " páginas.",
        textEn: "The site served none of the " + r.images.length + " pages.", style: "h4" },
      { type: "Text",
        text: esMw
          ? "ManhwaWeb no entregó ni una página para medir: su casa de imágenes suele negarlas a quien no se presenta. Toca «Leer en ventanita» para leer el capítulo en el lector del propio sitio, y manda el Registro si quieres que vea el motivo exacto."
          : "Si las listas de Mangas.in siguen cerradas, ábrelas desde la portada (el botón «Mangas.in tiene sus listas cerradas») y vuelve a abrir el capítulo. Si ya lo hiciste, manda el Registro: dirá el motivo exacto.",
        textEn: "If the site keeps refusing, open it from home and retry. If already done, send the log: it will say the exact reason.",
        style: "caption", color: "muted" },
      Object.assign({}, btnVentanaLeer, { key: "btnLeerVentanaAviso" }),
    ] },
  ] : [];
  const modo = modoLectorEfectivo(r.images.length);
  // v0.4.41 — LA BARRA LIMPIA, SIEMPRE: probado en el teléfono, el
  // ojo ocultaba las letras y dejaba la fila fina con solo la
  // flechita de salida — exactamente lo que la persona quiere ver
  // SIEMPRE, sin botón naranja flotante que tape las páginas. El
  // título invisible (PNG transparente) y la flechita de salida se
  // quedan; el ojo (barra y flotante) y la pantalla completa se
  // retiran. El panel de controles sigue viajando al final del
  // capítulo.
  const pg = state.inputs && typeof state.inputs.pgs === "number" && state.inputs.pgs >= 0
    ? state.inputs.pgs : 0;
  let cuerpo;
  let desde = 0;
  if (modo === "paginas") {
    // Modo páginas (Kino 0.9.81): una página a la vez, se pasa con el
    // dedo, barra fina de progreso de Kino y zoom (pellizco) dentro de
    // cada página. La página en la que se quedó vive en
    // state.inputs.pgs y la guarda el evento pgChanged.
    // v0.4.30 — con muro: cada página convertida se dibuja desde el
    // almacén y la que no, EN DIRECTO del sitio con presentación
    // (v0.4.40); el botón «Bajar más páginas» guarda copias locales y
    // va de última página del pages. Muy atrás de la página vista las
    // páginas se dibujan como texto barato para no inflar el árbol: al
    // volver a ellas, el aviso de página las trae al presente.
    const maxPag = Math.min(r.images.length, 249);
    const ventIni = esMuro ? Math.max(0, pg - 25) : 0;
    const hijos = [];
    for (let i = 0; i < maxPag; i++) {
      const p = r.images[i];
      const dat = esMuro && i >= ventIni ? pgdDe(p.url) : null;
      hijos.push({ type: "SingleChildScrollView", key: "z" + i, zoom: true,
        children: [dat
          ? pageNodes({ url: dat, w: p.w, h: p.h }, i, ratioGuia, true)[0]
          : (esMuro
            ? (i >= ventIni
              // v0.4.40 — sin copia local pero a la vista: en directo
              // del sitio con presentación (sin fallback: el tope de
              // nodos del pages manda).
              ? muroPageDirecta(p, i, ratioGuia, true)
              : { type: "Text", key: "np" + i,
                  text: "Página " + (i + 1) + " — se dibuja al llegar a ella",
                  textEn: "Page " + (i + 1) + " — it draws as you reach it",
                  color: "muted", style: "caption", padding: 24 })
            : pageNodes(p, i, ratioGuia, true)[0])] });
    }
    if (esMuro) {
      let pendPg = 0;
      for (let i = 0; i < maxPag; i++) if (!pgdDe(r.images[i].url) && !gset[i]) pendPg++;
      const restantes = Math.max(pendPg, r.images.length - maxPag);
      if (restantes > 0) {
        hijos.push({ type: "Column", key: "btnMasPag", padding: 24, gap: 8, crossAxisAlignment: "center", children: [
          { type: "Text", text: restantes + " páginas por bajar", textEn: restantes + " pages to download",
            color: "muted", style: "caption" },
          { type: "ElevatedButton", key: "btnMuroCarga", icon: "download",
            labelText: "Bajar más páginas", labelTextEn: "Download more pages", onPressed: "muroCarga" },
        ] });
      } else if (grandeN) {
        // v0.4.40 — no queda nada por GUARDAR: las que faltan son las
        // demasiado grandes para la copia local — pero ya se dibujan
        // en directo del sitio con presentación, sin tope de tamaño.
        hijos.push({ type: "Text", key: "notaGrandes", padding: 24,
          text: "Las " + grandeN + " páginas que faltan son las más pesadas: no caben como copia local, pero se dibujan en directo del sitio.",
          textEn: "The " + grandeN + " missing pages are the heaviest ones: they do not fit as a local copy, but they are drawn straight from the site.",
          color: "muted", style: "caption" });
      }
    }
    cuerpo = { type: "pages", key: "pgs", flex: 1, progress: "bar", onPageChanged: "pgChanged",
      children: hijos };
  } else {
    // v0.4.23 — la tira avisa dónde se detiene la persona (onScroll,
    // 0..1) para que «Continuar» retome; y si el capítulo se reabrió
    // retomado (r.desde), se dibuja desde esa página con un botoncito
    // arriba para volver al principio.
    desde = (r.desde | 0) > 0 && r.desde < r.images.length ? (r.desde | 0) : 0;
    const visibles = desde > 0 ? r.images.slice(desde) : r.images;
    const inicio = desde > 0 ? [{ type: "TextButton", key: "btnTiraInicio", icon: "refresh",
      labelText: "◀ Volver a la página 1", labelTextEn: "◀ Back to page 1", onPressed: "tiraReinicia" }] : [];
    // Tira vertical de siempre: las páginas pegadas (gap 0) a ancho
    // completo — fit "width" toma el ancho de la caja y el alto propio
    // de la imagen — y zoom de pellizco en todo el capítulo. Con muro,
    // las convertidas se dibujan desde el almacén y las demás EN
    // DIRECTO del sitio con presentación (v0.4.40): ya no hay corte a
    // los 12 huecos — todas las páginas traen su dibujo, como en
    // cualquier capítulo sin muro, y el hueco honrado queda de
    // fallback si el muro niega alguna.
    let nodos = [];
    let pendTotal = 0;
    for (let i = 0; i < visibles.length; i++) {
      const p = visibles[i];
      const dat = esMuro ? pgdDe(p.url) : null;
      if (esMuro && !dat) pendTotal++;
      nodos.push(esMuro && !dat
        ? muroPageDirecta(p, desde + i, ratioGuia, false)
        : pageNodes(dat ? { url: dat, w: p.w, h: p.h } : p, desde + i, ratioGuia)[0]);
    }
    const btnMasTira = (esMuro && pendTotal > 0) ? [
      { type: "Column", key: "btnMasTira", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
        { type: "ElevatedButton", key: "btnMuroCarga", icon: "download",
          labelText: "Bajar más páginas (" + pendTotal + ")", labelTextEn: "Download more pages", onPressed: "muroCarga" },
        { type: "Text", text: "Las páginas ya se dibujan en directo del sitio; este botón guarda sus copias locales (más rápidas y sin red). El muro puede negar alguna.",
          textEn: "Pages already draw straight from the site; this button stores their local copies (faster and offline). The wall may deny some.",
          style: "caption", color: "muted" },
      ] },
    ] : [];
    cuerpo = { type: "SingleChildScrollView", key: scrollKey, flex: 1, zoom: true, onScroll: "tiraScrolled",
      children: [{ type: "Column", gap: 0, crossAxisAlignment: "center",
        children: inicio.concat(nodos).concat(btnMasTira) }] };
  }
  const barraTexto = esMuro
    ? "v" + VERSION + " · cap. " + (idx + 1) + " de " + chapters.length
      + (modo === "paginas" ? " · pág " + (pg + 1) + " de " + r.images.length : "")
      + " · " + convN + " de " + r.images.length + " páginas guardadas · pellizca para acercar"
      + (desde > 0 ? " · retomado en la pág " + (desde + 1) : "")
    : modo === "paginas"
    ? "v" + VERSION + " · cap. " + (idx + 1) + " de " + chapters.length + " · pág " + (pg + 1)
      + " de " + r.images.length + " · pellizca para acercar"
    : "v" + VERSION + " · cap. " + (idx + 1) + " de " + chapters.length + " · "
      + medidas.length + " pág medidas · mediana " + (Math.round(ratioGuia * 100) / 100)
      + (desde > 0 ? " · retomado en la pág " + (desde + 1) : "")
      + " · pellizca para acercar";
  // v0.4.36 — el panel de capítulos ya no vive fijo abajo de la
  // pantalla: la persona lee sin nada encima y el panel aparece al
  // TERMINAR el capítulo, dentro del contenido (como los lectores de
  // siempre, p. ej. ZonaTMO): «Fin del capítulo» + Anterior / Ir a
  // capítulo / Siguiente (+ ventanita y modo cuando tocan).
  const panelFin = { type: "Column", key: "finCap", padding: 16, gap: 10, crossAxisAlignment: "center", children: [
    { type: "Text", key: "finTitulo", text: "Fin del capítulo" + (ch ? " " + ch.num : ""),
      textEn: "End of chapter" + (ch ? " " + ch.num : ""), style: "h5", color: "muted" },
    { type: "Row", key: "barraLector", gap: 12, mainAxisAlignment: "center", wrap: true, children: [
      { type: "ElevatedButton", icon: "arrow_back", labelText: "Anterior", labelTextEn: "Previous",
        onPressed: "prevChap", enabled: hasPrev },
      { type: "DropdownButton", key: "jumpChap", labelText: "Ir a capítulo", labelTextEn: "Go to chapter",
        value: String(idx), onChanged: "jumpChap",
        options: chapters.length ? chapters.map((c, i) => ({ value: String(i), label: "Capítulo " + c.num })) : [{ value: "0", label: "—" }] },
      { type: "ElevatedButton", labelText: hasNext ? "Siguiente" : "Último capítulo",
        labelTextEn: hasNext ? "Next" : "Last chapter",
        icon: "arrow_forward", onPressed: "nextChap", enabled: hasNext },
    ].concat(esMuro ? [btnVentanaLeer] : []).concat(pagesDisponible() ? [
      { type: "TextButton", key: "btnModo", labelText: modo === "paginas" ? "Modo tira" : "Modo páginas",
        labelTextEn: modo === "paginas" ? "Strip mode" : "Page mode", onPressed: "modoLector" },
    ] : []) },
    { type: "Text", key: "finInfo", text: barraTexto, style: "caption", color: "muted" },
  ] };
  if (modo === "paginas") cuerpo.children.push(panelFin);
  else cuerpo.children[0].children.push(panelFin);
  const body = avisoMs.concat([cuerpo]);
  // v0.4.41 — la barra del lector es SIEMPRE la limpia: una sola fila
  // compacta (56 dp, dense) fundida con la de Kino (mergeWithKinoBar),
  // sin divisoria (divider: false), con la flechita de salida a la
  // izquierda y el título invisible (Image PNG transparente de 1x1:
  // una imagen no es texto vacío que descartar — probado en el
  // teléfono, el nombre «MangaTrack» ya no aparece) — así la fila
  // queda [flechita][nada][campana de Kino si hay avisos]. Sin ojo en
  // ningún lado: de la fila se sale con la flechita y los controles
  // siguen al final del capítulo.
  const raiz = {
    type: "Scaffold",
    every: (r.pend || 0) > 0 && (r.fallos || 0) < 3 ? { ms: 3000, event: "dimsTick" } : undefined,
    appBar: { type: "AppBar", mergeWithKinoBar: true, dense: true, key: "barReader",
      title: { type: "Image", key: "titInm", url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR4AQEABf/6AAAAAAAABQABdoo2PQAAAABJRU5ErkJggg==",
        fit: "contain", h: 32, aspect: "1:1", fallback: { type: "Text", text: "\u00A0" } },
      divider: false,
      leading: { type: "IconButton", key: "backFromReader", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } } },
    body: { type: "Column", children: body },
  };  return raiz;
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
          ? (results.length ? gridOf(decoraNueva(results), VACIO_BUSQUEDA) : VACIO_BUSQUEDA)
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
// v0.4.42 — más órdenes del catálogo de LectorXd (los 7 de su web).
const ORDEN_LX = [["", "Recientes"], ["rating", "Mejor valorados"], ["views", "Más vistos"],
  ["leyendo", "Más leyendo"], ["por_leer", "Más por leer"], ["completado", "Más completados"],
  ["chapters", "Más capítulos"]];
// v0.4.42 — la demografía del catálogo de LectorXd (&demographics=).
const DEMO_LX = [["", "Todas"], ["shounen", "Shounen"], ["seinen", "Seinen"],
  ["shoujo", "Shoujo"], ["josei", "Josei"]];
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
// v0.4.28 — las pantallas «Ver más» de los rieles enseñan una ventana
// de RIEL_TOPE series: «‹ / ›» recorre lo ya cargado sin pedirle nada
// al sitio y «Cargar más» (donde la fuente pagina) trae otra página.
const RIEL_TOPE = 24;

function catalogoUrlDe(f, cat, page) {
  if (f.id !== "lectorxd") return catalogoUrl(cat, page);
  let p = "/catalogo?filters=true&adult=safe&orderBy=" + (cat.order || "recent") + "&page=" + (page || 1);
  if (cat.type) p += "&types=" + encodeURIComponent(cat.type);
  if (cat.status) p += "&status=" + encodeURIComponent(cat.status);
  // v0.4.42 — género por número (tags=) y demografía (demographics=).
  if (cat.genre) p += "&tags=" + encodeURIComponent(cat.genre);
  if (cat.demo) p += "&demographics=" + encodeURIComponent(cat.demo);
  return p;
}

function catalogoUrl(cat, page) {
  let p = "/manga/?page=" + (page || 1);
  if (cat.genre) p += "&genre=" + encodeURIComponent(cat.genre);
  if (cat.type) p += "&type=" + encodeURIComponent(cat.type);
  if (cat.status) p += "&status=" + encodeURIComponent(cat.status);
  return p;
}

// v0.4.42 — géneros del catálogo de LectorXd: su página los trae como
// labels con data-category-name y un input[name=tags] con el número de
// cada uno; se leen en vivo y se guardan en el almacén ("lxTags") para
// el desplegable (la lista puede cambiar y así no queda vieja).
function lxTagsDe(html) {
  const out = [];
  const re = /<label[^>]*data-category-name=["']([^"']*)["'][^>]*>([\s\S]*?)<\/label>/gi;
  let m;
  while ((m = re.exec(html))) {
    const name = clean(m[1]);
    const im = m[2].match(/name=["']tags["'][^>]*value=["']([^"']*)["']/i) ||
      m[2].match(/value=["']([^"']*)["'][^>]*name=["']tags["']/i);
    const id = im ? im[1].trim() : "";
    if (name && id && /^\d+$/.test(id)) out.push({ id: id, name: name });
  }
  return out;
}

function lxGeneros() {
  const t = getJson("lxTags", null);
  const base = [["", "Todos los géneros"]];
  if (Array.isArray(t) && t.length) {
    for (let i = 0; i < t.length && i < 50; i++) base.push([t[i].id, t[i].name]);
  }
  return base;
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
  // v0.4.29 — las portadas MW de la ventana visible se cambian por
  // sus copias locales (si ya están en el almacén).
  const items = decoraNueva(todos.slice(start, start + CAT_TOPE));
  const total = parseInt(String(c.totalTxt || "").replace(/[^0-9]/g, ""), 10) || 0;
  const hayMas = c.mas === undefined || c.mas === null
    ? (todos.length < total)
    : !!c.mas;
  let drops = [];
  if (f.id === "lectorxd") {
    drops = [
      catDrop("Género", "catGenre", lxGeneros(), c.genre, "catGenre"),
      catDrop("Demografía", "catDemo", DEMO_LX, c.demo, "catDemo"),
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
  } else if (f.id === "manhwaweb") {
    // v0.4.42 — el catálogo de ManhwaWeb como la página: género (27 de
    // su API), demografía aparte y el orden «Nuevas obras» por defecto.
    drops = [
      catDrop("Estado", "catStatus", MW_ESTADOS, c.status, "catStatus"),
      catDrop("Tipo", "catType", MW_TIPOS, c.type, "catType"),
      catDrop("Género", "catGenre", MW_GENEROS, c.genre, "catGenre"),
      catDrop("Demografía", "catDemo", MW_DEMO, c.demo, "catDemo"),
      catDrop("Orden", "catOrder", ORDEN_MW, c.order, "catOrder"),
    ];
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
    // v0.4.30 — portadas de la página nueva al almacén.
    try { await msPrecarga(nuevos, 12); } catch (e) { log("MS portadas catálogo: " + ((e && e.message) || e)); }
  } else if (f.id === "manhwaweb") {
    const r2 = await mwCatalog(cat, page1);
    nuevos = r2.items; mas = r2.mas;
    // v0.4.29 — portadas de la página nueva al almacén.
    try { await mwPrecarga(nuevos, 12); } catch (e) { log("MW portadas catálogo: " + ((e && e.message) || e)); }
  } else {
    const html = await getHtmlDe(f, catalogoUrlDe(f, cat, page1));
    // v0.4.42 — LectorXd trae la lista de sus géneros en la misma
    // página del catálogo: se guarda para el desplegable (la primera
    // vez solo se ve «Todos los géneros»; al cargar de nuevo ya están).
    if (f.id === "lectorxd") {
      try {
        const tags = lxTagsDe(html);
        if (tags.length) setJson("lxTags", tags);
      } catch (e) { log("LX géneros: " + ((e && e.message) || e)); }
    }
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
    (prevCat.order || "") === (cat.order || "") &&
    (prevCat.demo || "") === (cat.demo || "") ? prevCat.items : [];
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
    type: cat.type || "", status: cat.status || "", order: cat.order || "", demo: cat.demo || "", totalTxt: totalTxt,
    mas: mas === undefined ? null : mas, lleno: capLleno ? 1 : 0,
    ultimos: page1 > 1 ? Math.max(0, items.length - prev.length) : 0 });
  if (!catOk) return { toast: "El almacén del plugin está lleno: no pude guardar el catálogo." };
  log("catálogo " + f.nombre + " pág. " + page1 + ": +" + nuevos.length + " → " + items.length +
    " series, filtros " + (cat.genre || cat.type || "-") + "/" + (cat.status || "-") + "/" + (cat.order || "-"));
  const resp = { state: { catTk: Date.now() } };
  if (conRuta) resp.route = { push: "catalog" };
  return resp;
}

// v0.4.27 — el feed «lasted» de Mangas.in a tarjetas (la portada y el
// «Cargar más» de su riel usan el mismo lector: una sola receta).
function msRecientesDe(j, max) {
  const datos = (j && j.data) || [];
  const out = [];
  for (let i = 0; i < datos.length && out.length < max; i++) {
    const x = datos[i] || {};
    if (!x.manga_slug) continue;
    out.push({ url: "/ms/manga/" + x.manga_slug + "/", title: clean(x.manga_name),
      poster: msCover(x.manga_slug) });
  }
  return out;
}

// v0.4.27 — la sección de un riel en cuadrícula («Ver más»): lo que
// la portada trajo (y lo que «Cargar más» fue añadiendo) vive en el
// almacén («riel:<key>»); la pantalla lo lee de ahí, igual que el
// catálogo, para no inflar el estado.
function rielTree(key) {
  const r = getJson("riel:" + key, null);
  if (!r || typeof r !== "object" || !Array.isArray(r.items)) {
    return errorTree("Esta sección ya no está en el almacén: vuelve al Inicio y toca «Ver más» otra vez.");
  }
  const f = fuentePorId(r.f || "leercapitulo");
  const todos = r.items;
  const start = Math.max(0, parseInt(r.start, 10) || 0);
  // v0.4.29 — la ventana visible se dibuja con las portadas MW ya
  // convertidas (copias locales del almacén, sin red).
  const items = decoraNueva(todos.slice(start, start + RIEL_TOPE));
  const cuantos = todos.length + (todos.length === 1 ? " serie" : " series") +
    (r.f === "hist" ? "" : " · " + f.nombre);
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barRiel", title: String(r.tit || "Sección").slice(0, 40),
      titleEn: String(r.titEn || r.tit || "Section").slice(0, 40),
      leading: { type: "IconButton", key: "backFromRiel", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "rielBody", children: [{ type: "Column", children: [
      { type: "Text", text: cuantos, textEn: cuantos, style: "caption", color: "muted", padding: 16 },
      items.length && (todos.length > RIEL_TOPE || start > 0) ?
        { type: "Text", text: "Mostrando " + (start + 1) + "–" + (start + items.length) + " de " + todos.length + ".",
          textEn: "Showing " + (start + 1) + "–" + (start + items.length) + " of " + todos.length + ".",
          style: "caption", color: "muted", padding: 16 } : null,
      items.length ? gridOf(items, VACIO_SERIES) : VACIO_SERIES,
      start > 0 ? { type: "ElevatedButton", key: "rielPrevW", icon: "arrow_back",
        labelText: "‹ Series anteriores", labelTextEn: "Previous series",
        onPressed: { event: "rielPrevW", arg: key } } : null,
      start + RIEL_TOPE < todos.length ? { type: "ElevatedButton", key: "rielNextW", icon: "expand_more",
        labelText: "Series siguientes ›", labelTextEn: "Next series",
        onPressed: { event: "rielNextW", arg: key } } : null,
      r.mas
        ? { type: "ElevatedButton", key: "rielMas", icon: "expand_more",
            labelText: "Cargar más del sitio", labelTextEn: "Load more from site",
            onPressed: { event: "rielMas", arg: key } }
        : { type: "Text", text: "Es todo lo que esta sección trae.",
            textEn: "This is all this section has.", style: "caption", color: "muted", padding: 16 },
    ].filter(Boolean) }] },
  };
}

// v0.4.27 — «Cargar más» de una sección: donde la fuente tiene más
// páginas de ESA sección (las consultas de MangaDex, el directorio de
// MangaOni, el catálogo POST de InManga, las listas de Mangas.in y su
// feed «lasted»), la siguiente página se pide y se añade a lo ya
// guardado. Las secciones que no pagina (portadas de LeerCapitulo y
// LectorXd, «Series añadidas», el historial) ni traen el botón.
async function cargarRiel(key) {
  const r = getJson("riel:" + key, null);
  if (!r || typeof r !== "object" || !Array.isArray(r.items)) {
    return { toast: "Esta sección ya no está: vuelve al Inicio y toca «Ver más» otra vez." };
  }
  if (!r.mas) return { toast: "Es todo lo que esta sección trae." };
  const f = fuentePorId(r.f || "leercapitulo");
  const page = (parseInt(r.page, 10) || 1) + 1;
  let nuevos = [];
  try {
    if (key === "railPop") {
      if (f.id === "mangadex") {
        nuevos = mdCards(await mdJson(mdQuery("order[followedCount]=desc", (page - 1) * 20, 20)), 20);
      } else if (f.id === "inmanga") {
        nuevos = imCards(await imPostForm("/manga/getMangasConsultResult", "", 1, (page - 1) * 20, 20), 20);
      } else if (f.id === "mangaoni") {
        nuevos = moCards(await getHtmlDe(f, "/directorio?filtro=visitas&orden=desc&adulto=false&p=" + page), 20);
      } else if (f.id === "mangasin") {
        const ruta = r.via === "filterList"
          ? "/filterList?page=" + page + "&sortBy=views&asc=false"
          : r.via === "manga-list" ? "/manga-list?page=" + page : "";
        if (!ruta) throw kino.error("network", "sin páginas", {
          userMessage: "Esta lista de Mangas.in no se deja pasar de página desde el plugin." });
        nuevos = msCards(await getHtmlDe(f, ruta), 20);
        // v0.4.30 — portadas de la página nueva al almacén.
        try { await msPrecarga(nuevos, 8); } catch (e) { log("MS portadas riel: " + ((e && e.message) || e)); }
      } else if (f.id === "manhwaweb") {
        // La API de ManhwaWeb cuenta sus páginas desde 0.
        nuevos = mwCards(await mwGet(mwLib("", "", "", page - 1)), 20);
        try { await mwPrecarga(nuevos, 8); } catch (e) { log("MW portadas riel: " + ((e && e.message) || e)); }
      }
    } else if (key === "railRec") {
      if (f.id === "mangadex") {
        nuevos = mdCards(await mdJson(mdQuery("order[latestUploadedChapter]=desc", (page - 1) * 20, 20)), 20);
      } else if (f.id === "mangaoni") {
        nuevos = moCards(await getHtmlDe(f, "/directorio?filtro=id&orden=desc&adulto=false&p=" + page), 20);
      } else if (f.id === "mangasin") {
        nuevos = msRecientesDe(JSON.parse(await getHtmlDe(f, "/lasted?p=" + page)), 20);
        // v0.4.30 — portadas de la página nueva al almacén.
        try { await msPrecarga(nuevos, 8); } catch (e) { log("MS portadas riel: " + ((e && e.message) || e)); }
      } else if (f.id === "manhwaweb") {
        nuevos = mwCards(await mwGet(mwLib("publicandose", "", "", page - 1)), 20);
        try { await mwPrecarga(nuevos, 8); } catch (e) { log("MW portadas riel: " + ((e && e.message) || e)); }
      }
    }
  } catch (e) {
    log("riel " + key + " pág " + page + ": " + ((e && e.message) || e));
    return { toast: (e && e.userMessage) || "El sitio no quiso dar más de esta sección ahora; prueba en un rato." };
  }
  const vistos = {};
  r.items.forEach(function (x) { vistos[x.url] = 1; });
  const frescos = nuevos.filter(function (x) { return !vistos[x.url]; });
  if (!frescos.length) {
    // La página siguiente no trajo nada nuevo: fin honesto de la
    // lista (no se ofrece otro «Cargar más» en bucle).
    setJsonCache("riel:" + key, Object.assign({}, r, { mas: false }));
    return { state: { rielTk: Date.now() }, toast: "No quedan más en esta sección." };
  }
  const items = r.items.concat(frescos).slice(0, 120);
  // La ventana salta a lo recién cargado (el patrón del catálogo):
  // así «Cargar más» siempre deja a la vista series nuevas.
  const ok = setJsonCache("riel:" + key, { f: r.f, tit: r.tit, titEn: r.titEn, via: r.via || "",
    items: items, page: page, mas: true, start: Math.max(0, items.length - RIEL_TOPE) });
  if (!ok) return { toast: "El almacén del plugin está lleno: no pude guardar más." };
  log("riel " + key + " pág " + page + ": +" + frescos.length + " → " + items.length + " series");
  return { state: { rielTk: Date.now() } };
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
    // v0.4.49 — la reseña de la serie abierta y la sincronización.
    if (route.name === "resena") return resenaTree(state);
    if (route.name === "sync") return syncTree(state);
    // v0.4.21 — las colecciones del corazón flotante.
    if (route.name === "colecciones") return coleccionesTree();
    if (route.name === "coleccion") return coleccionTree(String((route.params && route.params.nombre) || ""));
    // v0.4.27 — la sección de un riel en cuadrícula («Ver más»).
    if (route.name === "riel") return rielTree(String((route.params && route.params.key) || ""));
    if (route.name === "colElegir") return colElegirTree(state);
    // v0.4.34 — la lista de fuentes del selector de la barra.
    if (route.name === "fuentes") return fuentesTree();
    // v0.4.55 — la pantalla «Descubrir» de Para ti.
    if (route.name === "descubre") return descubreTree(getJson("paraTi", null));
  } catch (e) {
    log("error en pantalla: " + ((e && e.message) || e));
    return errorTree((e && e.userMessage) ||
      ("No se pudo cargar (" + ((e && e.code) || "error") + ")."));
  }
  const body = await homeTree();
  return {
    type: "Scaffold",
    // v0.4.34 — el selector de fuentes de las apps de lectura: el
    // título de la barra admite una fila de nodos, así que el nombre
    // de la fuente activa viaja ahí, al lado de la lupa — al tocarlo
    // se abre la lista de las 7 fuentes (y AniList) para cambiar.
    appBar: { type: "AppBar", key: "barHome",
      title: { type: "Row", gap: 6, children: [
        { type: "Text", text: "MangaTrack", textEn: "MangaTrack", style: "h3" },
        { type: "TextButton", key: "fuenteBtn", icon: "expand_more",
          labelText: fuenteActiva().nombre, labelTextEn: fuenteActiva().nombre,
          onPressed: { event: "fuentesOpen" } },
      ] },
      actions: [
        { type: "IconButton", icon: "search", key: "goSearch",
          labelText: "Buscar", labelTextEn: "Search", onPressed: { event: "goSearch" } },
      ] },
    body: body,
    // v0.4.21 — el corazón flotante de las colecciones: discreto (sin
    // etiqueta), en el lado derecho, siempre a un toque del Inicio.
    floatingActionButton: { type: "FloatingActionButton", key: "fabCols", icon: "heart",
      tooltip: "Mis colecciones", tooltipEn: "My collections",
      onPressed: { event: "colsOpen" } },
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
      syncPullResenas();
      // v0.4.49 — con la nube propia activada, al abrir se baja el
      // respaldo y se une lo que falte (sin bloquear la entrada: si
      // falla, queda en el Registro y la pantalla abre igual).
      try { if (tgActiva()) await tgBajar(); }
      catch (e) { log("sync bajar: " + ((e && e.message) || e)); }
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
        if (!c || typeof c !== "object") return await cargarCatalogo({ genre: "", type: "", status: "", order: "", demo: "" }, 1, false);
      }
      return null;
    }
    if (name === "goSearch") return { route: { push: "search" } };
    if (name === "favsOpen") return { route: { push: "favs" } };
    // v0.4.49 — la nube propia y las reseñas.
    if (name === "syncAbrir") return { route: { push: "sync" } };
    if (name === "resenaAbrir") return { route: { push: "resena" } };
    if (name === "tgGuardar") {
      const token = String((ev.value && ev.value.tgToken) || "").trim();
      if (!TG_TOKEN_FORMA.test(token)) return { toast: "Ese no parece un token de bot: son números, dos puntos y unas 35 letras. Cópialo de @BotFather." };
      try {
        // Se comprueba el token con Telegram antes de guardarlo: uno
        // que no funciona nunca se queda. Un token nuevo es OTRO bot:
        // el chat vinculado con el anterior ya no sirve.
        const me = await tgApi(token, "getMe", {});
        const bot = me && me.username ? "@" + me.username : "tu bot";
        const viejo = getJson("tgSync", null) || {};
        const cfg = { token: token,
          chatId: viejo.token === token && viejo.chatId > 0 ? viejo.chatId : 0,
          chatName: viejo.token === token ? (viejo.chatName || "") : "",
          on: true };
        setJson("tgSync", cfg);
        return { state: { syncTk: Date.now() },
          toast: cfg.chatId > 0 ? "✓ " + bot + " listo: la nube sigue activada."
            : "✓ " + bot + " listo. Ahora ábrelo en Telegram, toca Iniciar y escríbele algo; después, «Buscar mi chat»." };
      } catch (e) { return { state: { syncTk: Date.now() }, toast: tgLimpio((e && e.message) || e) }; }
    }
    if (name === "tgBuscar") {
      const c = tgCfg();
      if (!c) return { toast: "Primero guarda el token de tu bot." };
      try {
        const r = await tgBuscarChat(c.token);
        if (!r) return { state: { syncTk: Date.now() },
          toast: "Aún no hay mensajes de nadie: abre tu bot en Telegram, toca Iniciar y escríbele algo. Vuelve a tocar aquí." };
        c.pend = r.id;
        c.pendNombre = r.nombre;
        setJson("tgSync", c);
        return { state: { syncTk: Date.now() },
          toast: "Te escribió " + r.nombre + " desde esa cuenta de Telegram. Confirma que eres tú (abajo)." };
      } catch (e) { return { state: { syncTk: Date.now() }, toast: tgLimpio((e && e.message) || e) }; }
    }
    if (name === "tgConfirmar") {
      const c = tgCfg();
      if (c && c.pend) {
        c.chatId = c.pend;
        c.chatName = c.pendNombre || "";
        delete c.pend;
        delete c.pendNombre;
        setJson("tgSync", c);
        return { state: { syncTk: Date.now() },
          toast: "✓ Chat vinculado" + (c.chatName ? " (" + c.chatName + ")" : "") + ": tu nube queda lista." };
      }
      return { toast: "Primero toca «Buscar mi chat»." };
    }
    if (name === "tgRechazar") {
      const c = tgCfg();
      if (c && c.pend) { delete c.pend; delete c.pendNombre; setJson("tgSync", c); }
      return { state: { syncTk: Date.now() }, toast: "Descartado: vuelve a tocar «Buscar mi chat»." };
    }
    if (name === "tgOlvidar") {
      setJson("tgSync", null);
      return { state: { syncTk: Date.now() }, toast: "Bot olvidado: la nube quedó apagada." };
    }
    if (name === "syncOnOff") {
      const c = tgCfg();
      if (!c) return { toast: "Primero guarda el token de tu bot." };
      if (!(c.chatId > 0)) return { toast: "Primero vincula tu chat con «Buscar mi chat»." };
      c.on = !c.on;
      setJson("tgSync", c);
      return { state: { syncTk: Date.now() },
        toast: c.on ? "Sincronización activada." : "Sincronización desactivada." };
    }
    if (name === "syncAhora") {
      if (!tgActiva()) return { toast: "Activa primero la sincronización." };
      try {
        const r = await tgBajar();
        await tgSubir();
        setJson("tgTs", Date.now());
        // v0.4.52 — el resumen cuenta lo que la copia trajo de las
        // cuatro cosas (favoritos, colecciones, historial, reseñas).
        const tr = [];
        if (r && r.favs) tr.push(r.favs + " favorito" + (r.favs === 1 ? "" : "s"));
        if (r && r.cols) tr.push(r.cols + " a colecciones");
        if (r && r.hist) tr.push(r.hist + " con historial");
        if (r && r.resenas) tr.push(r.resenas + " reseña" + (r.resenas === 1 ? "" : "s"));
        return { state: { favTk: Date.now(), revTk: Date.now(), syncTk: Date.now() },
          toast: (r && r.ajeno ? "Hay un mensaje tuyo fijado encima de la copia: desfíjalo en el chat con tu bot. " : "") +
            "✓ Sincronizado con Telegram" +
            (tr.length ? " (traje " + tr.join(", ") + ")" : "") + "." };
      } catch (e) { return { toast: "No pude sincronizar: " + tgLimpio((e && e.message) || e) }; }
    }
    if (name === "resenaSave") {
      const d = state.detail;
      if (!d || !d.url) return { toast: "Abre una serie primero." };
      const ok = resenaGuardar(d.url, (ev.value && ev.value.resTxt) || "");
      if (ok) { try { if (tgActiva()) await tgSubir(); }
        catch (e) { log("sync subir: " + ((e && e.message) || e)); } }
      return { state: { revTk: Date.now() }, route: { pop: true },
        toast: ok ? "✓ Reseña guardada." : "El almacén del plugin está lleno: no pude guardarla." };
    }
    if (name === "resenaBorrar") {
      const d = state.detail;
      if (d && d.url) {
        resenaGuardar(d.url, "");
        try { if (tgActiva()) await tgSubir(); }
        catch (e) { log("sync subir: " + ((e && e.message) || e)); }
      }
      return { state: { revTk: Date.now() }, route: { pop: true }, toast: "Reseña borrada." };
    }
    // v0.4.21 — el corazón: abrir colecciones, crearlas, borrarlas,
    // meter y sacar series, y elegirla desde la página de una serie.
    if (name === "colsOpen") return { route: { push: "colecciones" } };
    if (name === "colAbrir") {
      const nom = String(ev.arg || "");
      if (!cols()[nom]) return { toast: "Esa colección ya no existe." };
      return { route: { push: "coleccion", params: { nombre: nom } } };
    }
    if (name === "colNueva") {
      const r = colCrear((ev.value && ev.value.colNom) || "");
      if (r.err) return { toast: r.err };
      // v0.4.53 — lo que se arma sube: la colección nueva viaja a la
      // nube en cuanto existe (si está activada).
      if (r.ok) { try { if (tgActiva()) await tgSubir(); }
        catch (e) { log("sync subir cols: " + ((e && e.message) || e)); } }
      return { state: { colTk: Date.now() },
        toast: r.ok ? "✓ Colección «" + r.nom + "» creada." : "El almacén del plugin está lleno: no pude guardarla." };
    }
    if (name === "colDel") {
      const nom = String(ev.arg || "");
      if (!colBorrar(nom)) return { toast: "No encontré esa colección." };
      // v0.4.53 — borrar también sube: la copia deja de traer lo
      // borrado a las reinstalaciones.
      try { if (tgActiva()) await tgSubir(); }
      catch (e) { log("sync subir cols: " + ((e && e.message) || e)); }
      return { state: { colTk: Date.now() }, toast: "Colección «" + nom + "» borrada." };
    }
    if (name === "colAdd") {
      const d = state.detail;
      if (!d || !d.url) return { toast: "Abre una serie primero." };
      return { state: { colPend: { url: d.url, title: (d.meta && d.meta.title) || "",
          poster: (d.meta && d.meta.poster) || "" } },
        route: { push: "colElegir" } };
    }
    if (name === "colAddA") {
      const nom = String(ev.arg || "");
      const pend = state.colPend;
      if (!pend || !cols()[nom]) return { toast: "No encontré esa colección." };
      if (colEn(nom, pend.url)) {
        if (!colSacar(nom, pend.url)) return { toast: "El almacén del plugin está lleno." };
        // v0.4.53 — sacar una serie también sube.
        try { if (tgActiva()) await tgSubir(); }
        catch (e) { log("sync subir cols: " + ((e && e.message) || e)); }
        return { route: { pop: true }, toast: "Quitada de «" + nom + "»." };
      }
      if (!colMeter(nom, pend)) return { toast: "El almacén del plugin está lleno: no pude guardarla." };
      // v0.4.53 — meter una serie también sube.
      try { if (tgActiva()) await tgSubir(); }
      catch (e) { log("sync subir cols: " + ((e && e.message) || e)); }
      return { route: { pop: true },
        toast: "✓ «" + String(pend.title || "Serie").slice(0, 40) + "» añadida a «" + nom + "»." };
    }
    if (name === "colNuevaDesde") {
      const r = colCrear((ev.value && ev.value.colNom2) || "");
      if (r.err) return { toast: r.err };
      const pend = state.colPend;
      if (!pend) {
        // v0.4.53 — la colección estrenada sola también sube.
        if (r.ok) { try { if (tgActiva()) await tgSubir(); }
          catch (e) { log("sync subir cols: " + ((e && e.message) || e)); } }
        return { route: { pop: true }, toast: "✓ Colección «" + r.nom + "» creada." };
      }
      if (!r.ok || !colMeter(r.nom, pend)) return { toast: "El almacén del plugin está lleno: no pude guardarla." };
      // v0.4.53 — estrenada con serie dentro también sube.
      try { if (tgActiva()) await tgSubir(); }
      catch (e) { log("sync subir cols: " + ((e && e.message) || e)); }
      return { route: { pop: true },
        toast: "✓ Colección «" + r.nom + "» creada con «" + String(pend.title || "Serie").slice(0, 40) + "» dentro." };
    }
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
      const cu = String(ch && ch.url || "");
      // v0.4.28 — el mismo botón sirve a Mangas.in y a ManhwaWeb:
      // cada una abre el capítulo en el lector de su propio sitio.
      if (!ch || !ch.url || (cu.indexOf("/ms/") !== 0 && cu.indexOf("/mw/") !== 0))
        return { toast: "No hay un capítulo de Mangas.in o ManhwaWeb abierto en el lector." };
      const r = cu.indexOf("/mw/") === 0
        ? await mwVentanaLeer(ch)
        : await msVentanaLeer(ch, fuentePorId("mangasin"));
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
      return await cargarCatalogo({ genre: "", type: "", status: "", order: "", demo: "" }, 1, true);
    }
    // v0.4.27 — «Ver más»: la tarjetita del riel abre su sección en
    // cuadrícula; el botón de la cuadrícula trae la siguiente página
    // del sitio donde la hay.
    if (name === "verMas") {
      const key = String(ev.arg || "");
      if (!getJson("riel:" + key, null)) {
        return { toast: "Esa sección ya no está: vuelve al Inicio y toca «Ver más» otra vez." };
      }
      return { route: { push: "riel", params: { key: key } } };
    }
    if (name === "rielMas") return await cargarRiel(String(ev.arg || ""));
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
      return await alVincularFlujo(m);
    }
    if (name === "paraAbrir") {
      // v0.4.55 — la sugerencia de «Para ti» abre el mismo flujo de
      // vinculación de siempre: la serie se busca en su fuente con
      // todos sus nombres y la persona toca la correcta.
      const pPara = getJson("paraTi", null);
      const pid = parseInt(String(ev.arg || ""), 10) || 0;
      const mPara = pPara && Array.isArray(pPara.items)
        ? pPara.items.filter((x) => x && x.id === pid)[0] : null;
      if (!mPara) return { toast: "Esa sugerencia ya no está: toca «Descubrir» para armar la lista de nuevo." };
      return await alVincularFlujo(mPara);
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
      try { results = await buscarEnFuente(f, q); }
      catch (e) {
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
      // v0.4.24 — arreglo de un fallo viejo: «parseInt("0") || -1»
      // convertía el índice 0 en -1 y la PRIMERA tarjeta de resultados
      // nunca vinculaba. Ahora el índice se lee sin truco.
      const vinIdx = parseInt(String(ev.arg || ""), 10);
      const it = isNaN(vinIdx) ? null : res[vinIdx];
      if (!it || !it.url) return { toast: "Esa serie ya no está en la lista: busca de nuevo." };
      setJson("alId:" + it.url, { al: v.al, mal: v.mal || 0 });
      v.linked = it.url;
      v.linkedTitle = it.title || "";
      setJsonCache("vin", v);
      return { state: { vinTk: Date.now() },
        toast: "✓ «" + String(it.title || "").slice(0, 40) + "» vinculada con «" + String(v.titulo || "").slice(0, 40)
          + "»: cada capítulo que leas se registrará en AniList" + (v.mal ? " y MAL" : "") + "." };
    }
    if (name === "vinAbrirMD") {
      // v0.4.24 — abre la serie de MangaDex verificada por id de
      // AniList: el vínculo queda hecho ahí mismo, porque el id no
      // miente — no es un parecido de títulos.
      const v = getJson("vin", null);
      if (!v || typeof v !== "object" || !v.al || !(v.mdSegura && v.mdSegura.url)) {
        return { toast: "La vinculación expiró: vuelve a tocar la serie en AniList." };
      }
      setJson("alId:" + v.mdSegura.url, { al: v.al, mal: v.mal || 0 });
      v.linked = v.mdSegura.url;
      v.linkedTitle = v.mdSegura.title || "";
      setJsonCache("vin", v);
      try {
        const r = await cargarSerie(v.mdSegura.url, true);
        return { state: (r && r.state) || null, route: (r && r.route) || null,
          toast: (r && r.toast) || ("✓ Vinculada por id exacto de MangaDex: «"
            + String(v.mdSegura.title || "").slice(0, 40) + "».") };
      } catch (e) {
        return { toast: "✓ Vinculada por id exacto de MangaDex, pero la serie no cargó: tócala de nuevo."
          + ((e && e.userMessage) ? " " + e.userMessage : "") };
      }
    }
    if (name === "fuentePronto") {
      return { toast: String(ev.arg || "Esa fuente") + " está bloqueada por su protección anti-bots: no se puede leer desde Kino." };
    }
    if (name === "fuenteActual") {
      return { toast: "Ya estás viendo " + fuenteActiva().nombre + "." };
    }
    // v0.4.34 — el selector de la barra: abre la lista de fuentes y
    // elegir una la activa, vuelve al Inicio y lo recarga con el
    // contenido de la nueva fuente (mismo efecto que el riel viejo,
    // con el regreso a casa encima).
    if (name === "fuentesOpen") {
      return { route: { push: "fuentes" } };
    }
    if (name === "fuenteElegir") {
      const f2 = fuentePorId(String(ev.arg || ""));
      if (f2.id === fuenteActiva().id) return { toast: "Ya estás viendo " + f2.nombre + "." };
      setJson("fuente", f2.id);
      return { state: { detail: null, reader: null, results: null, resultsQ: null },
        route: { pop: true },
        toast: "Cambiando a " + f2.nombre + "…" };
    }
    if (name === "cambiarFuente") {
      const f2 = fuentePorId(String(ev.arg || ""));
      if (f2.id === fuenteActiva().id) return { toast: "Ya estás viendo " + f2.nombre + "." };
      setJson("fuente", f2.id);
      return { state: { detail: null, reader: null, results: null, resultsQ: null },
        toast: "Cambiando a " + f2.nombre + "…" };
    }
    if (name === "catGenre" || name === "catType" || name === "catStatus" || name === "catOrder" || name === "catDemo") {
      const c = getJson("cat", {}) || {};
      const nuevo = { genre: c.genre || "", type: c.type || "", status: c.status || "", order: c.order || "", demo: c.demo || "" };
      const v = String(ev.value || "");
      if (name === "catGenre") nuevo.genre = v;
      else if (name === "catType") nuevo.type = v;
      else if (name === "catStatus") nuevo.status = v;
      else if (name === "catDemo") nuevo.demo = v;
      else nuevo.order = v;
      return await cargarCatalogo(nuevo, 1, false);
    }
    if (name === "catMore") {
      const c = getJson("cat", null);
      if (!c || !Array.isArray(c.items) || !c.items.length) {
        return await cargarCatalogo({ genre: "", type: "", status: "", order: "", demo: "" }, 1, true);
      }
      const antes = c.items.length;
      const r = await cargarCatalogo({ genre: c.genre || "", type: c.type || "", status: c.status || "", order: c.order || "", demo: c.demo || "" },
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
    if (name === "rielPrevW" || name === "rielNextW") {
      // v0.4.28 — ventanas de la pantalla «Ver más» de un riel: mueven
      // la vista por lo ya cargado, sin pedirle nada al sitio.
      const rkey = String(ev.arg || "");
      const r = getJson("riel:" + rkey, null);
      if (!r || !Array.isArray(r.items) || !r.items.length) return null;
      const start = Math.max(0, parseInt(r.start, 10) || 0);
      const tope = Math.max(0, r.items.length - RIEL_TOPE);
      const ns = name === "rielPrevW" ? Math.max(0, start - RIEL_TOPE)
        : Math.min(tope, start + RIEL_TOPE);
      setJsonCache("riel:" + rkey, Object.assign({}, r, { start: ns }));
      return { state: { rielTk: Date.now() } };
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
        const r = await abrirCapitulo(d2, abs - (d2.capStart || 0), true, true);
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
          pend: r.pend || 0, fallos: r.fallos || 0, mal: r.mal } },
        toast: nuevo === "paginas" ? "Leyendo por páginas" : "Leyendo en tira" };
      if (nuevo === "paginas") {
        const d = state.detail;
        const ch = d && Array.isArray(d.chapters) ? d.chapters[r.idx || 0] : null;
        let at = ch ? pgLeer(ch.url) : 0;
        at = parseInt(at, 10);
        if (!(at >= 0) || at >= r.images.length) at = 0;
        resp.ui = [{ set: { key: "pgs", value: at } }];
      } else {
        // v0.4.23 — al volver a la tira, se retoma por la página que
        // guardó el modo páginas (la misma vara del «Continuar»).
        const d = state.detail;
        const ch = d && Array.isArray(d.chapters) ? d.chapters[r.idx || 0] : null;
        let at = ch ? pgLeer(ch.url) : 0;
        at = parseInt(at, 10);
        if (!(at >= 0) || at >= r.images.length) at = 0;
        if (at > 0) resp.state.reader.desde = at;
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
      // v0.4.30 — capítulo con muro: la tanda alrededor de la página
      // que se está viendo se convierte SOLA (con reintento de las
      // negadas de antes, si la persona vuelve a ellas).
      return await muroAutoLote(state, Math.max(0, pg - 2), MURO_PAG_BATCH + 4);
    }
    if (name === "tiraScrolled") {
      // v0.4.23 — la tira avisa cada vez que la persona se detiene
      // (valor de 0 a 1): se guarda la fracción por capítulo para que
      // «Continuar» reabra por donde se quedó. La escritura es barata
      // (Kino ya espera 0,3 s tras dejar de desplazar).
      const r = state.reader;
      const d = state.detail;
      if (!r || !d || !Array.isArray(d.chapters)) return null;
      const ch = d.chapters[r.idx || 0];
      if (!ch) return null;
      const f = Number(ev.value);
      if (isFinite(f) && f >= 0) tiraGuardar(ch.url, f);
      // v0.4.30 — cerca del final de lo dibujado, la tanda siguiente
      // del capítulo con muro se convierte sola.
      if (isFinite(f) && f >= 0.7) {
        const hacia = Math.min(r.images.length - 1, Math.round(f * r.images.length));
        return await muroAutoLote(state, hacia, MURO_PAG_BATCH + 2);
      }
      return null;
    }
    if (name === "muroCarga") {
      // v0.4.30 — «Bajar más páginas»: la siguiente tanda pendiente
      // del capítulo con muro; si solo quedan las que el muro negó,
      // se reintentan una vez más (a veces cede) y se dice honesto.
      // v0.4.31 — las demasiado grandes van aparte (reader.grande):
      // el botón busca primero lo que SÍ puede llegar, y en el
      // reintento manual a mano las vuelve a probar también (tras
      // una actualización de Kino su tope podría crecer).
      const r = state.reader;
      if (!r || !Array.isArray(r.images) || !r.images.length) return null;
      const d = state.detail;
      const fSer = d ? fuenteDeUrl(d.url) : null;
      const pref = fSer && fSer.id === "mangasin" ? "MS" : (fSer && fSer.id === "manhwaweb" ? "MW" : null);
      if (!pref) return null;
      const mal = Array.isArray(r.mal) ? r.mal : [];
      const grandes = Array.isArray(r.grande) ? r.grande : [];
      let desde = -1;
      let reintento = false;
      for (let i = 0; i < r.images.length; i++) {
        if (!pgdDe(r.images[i].url) && mal.indexOf(i) < 0 && grandes.indexOf(i) < 0) { desde = i; break; }
      }
      if (desde < 0) {
        reintento = true;
        for (let i = 0; i < r.images.length; i++) {
          if (!pgdDe(r.images[i].url)) { desde = i; break; }
        }
        if (desde < 0) return { toast: "Ya están bajadas todas las páginas posibles." };
      }
      const st = await muroConvierte(r.images, desde, 12, pref, reintento ? null : muroSetDe(grandes));
      if (!st.conv && !st.neg && !st.grande.length) return { toast: "No se pudo bajar ninguna página ahora: prueba en un rato o usa «Leer en ventanita»." };
      const tt = (st.nuevas ? st.nuevas + " páginas más dibujadas" : "Ninguna página nueva");
      return { state: { reader: { images: r.images, idx: r.idx, tk: r.tk,
          pend: 0, fallos: r.fallos || 0, mal: muroJuntaMal(mal, st.negIdx),
          grande: muroJuntaMal(grandes, st.grande) } },
        toast: tt + (st.neg ? " · " + st.neg + " negadas por el muro" : "")
          + (st.grande.length ? " · " + st.grande.length + " demasiado grandes para el pintor (ventanita)" : "") };
    }
    if (name === "tiraReinicia") {
      // El botoncito «◀ Volver a la página 1» de la tira retomada: se
      // vuelve a dibujar el capítulo completo desde arriba.
      const r = state.reader;
      if (!r) return null;
      return { state: { reader: { images: r.images, idx: r.idx, tk: r.tk,
          pend: r.pend || 0, fallos: r.fallos || 0, mal: r.mal, desde: 0 } },
        toast: "Capítulo desde la página 1", toastEn: "Chapter from page 1" };
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
        // v0.4.30 — sus portadas al almacén, igual que las de MW.
        try { await msPrecarga(results, 8); } catch (e) { log("MS portadas búsqueda: " + ((e && e.message) || e)); }
      } else if (f.id === "manhwaweb") {
        results = await mwBuscar(q);
        // v0.4.29 — sus portadas al almacén; el dibujado las toma de
        // ahí (el estado viaja con URLs cortas: 64 KB de tope).
        try { await mwPrecarga(results, 8); } catch (e) { log("MW portadas búsqueda: " + ((e && e.message) || e)); }
      } else {
        // v0.4.25 — LeerCapitulo: "/?s=" ya no busca (devuelve la portada);
        // el buscador del sitio es ahora la página del catálogo con ?q=.
        const ruta = f.id === "lectorxd"
          ? "/catalogo?filters=true&orderBy=recent&search=" + encodeURIComponent(q)
          : "/manga/?q=" + encodeURIComponent(q);
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
      return { state: { reader: { images: imgs, idx: r.idx, tk: r.tk, pend: pend, fallos: fallos, desde: r.desde || 0 } } };
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
      // v0.4.49 — con la nube propia activada, todo cambio de
      // favoritos sube el respaldo (la lista completa).
      try { if (tgActiva()) await tgSubir(); }
      catch (e) { log("sync subir: " + ((e && e.message) || e)); }
      return { state: { favTk: Date.now() },
        toast: added ? "Añadido a favoritos" : "Quitado de favoritos" };
    }
    // v0.4.55 — «Para ti»: arma (o reusa) las sugerencias y abre la
    // pantalla Descubrir; «Buscar de nuevo» las recalcula hoy mismo.
    if (name === "descubreAbrir") {
      try {
        const r = await paraTiComputar(false);
        return { state: { paraTk: Date.now() }, route: { push: "descubre" },
          toast: r.motivo === "sin-vinculos"
            ? "Mientras vinculas series en AniList: esto es lo de moda. Las sugerencias tuyas llegan solas."
            : (r.items.length
              ? "Para ti: " + r.items.length + " sugerencias. Toca una para buscarla en tu fuente."
              : "No pude armar sugerencias ahora: prueba «Buscar de nuevo».") };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudieron armar las sugerencias. Inténtalo de nuevo." };
      }
    }
    if (name === "descubreRefrescar") {
      try {
        const r = await paraTiComputar(true);
        return { state: { paraTk: Date.now() },
          toast: r.motivo === "sin-vinculos"
            ? "Sin series vinculadas no hay gusto que leer: mientras, lo de moda."
            : "✓ " + r.items.length + " sugerencias." };
      } catch (e) {
        return { toast: (e && e.userMessage) || "No se pudieron actualizar. Inténtalo de nuevo." };
      }
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
// ------------------------------------------- colecciones (v0.4.21)
// La pantalla del corazón: las listas con nombre de la persona, cada
// una con su cuenta, y el formulario para estrenar una. Tocar una
// abre su sección; el botoncito de borrar solo borra la LISTA (las
// series quedan donde estén: favoritos, historial, la fuente).
function coleccionesTree() {
  const cs = cols();
  const mf = favs();
  // v0.4.22 — los favoritos retirados del Inicio viven aquí: primera
  // tarjeta fija, con su cuenta y un toque abre la lista de siempre.
  const favEntry = mf.length ? { type: "Card", key: "favEntry", flush: true,
    onTap: { event: "favsOpen" },
    children: [{ type: "Row", padding: 16, gap: 12, children: [
      { type: "Icon", name: "star", color: "muted" },
      { type: "Column", flex: 1, gap: 4, crossAxisAlignment: "start", children: [
        { type: "Text", text: "Mis favoritos (" + mf.length + ")",
          textEn: "My favourites (" + mf.length + ")", style: "h4" },
        { type: "Text", text: "Tus mangas marcados con la estrella",
          textEn: "Your manga marked with the star", style: "caption", color: "muted" },
      ] },
    ] }] } : null;
  const nombres = Object.keys(cs).sort(function (a, b) { return (cs[b].ts || 0) - (cs[a].ts || 0); });
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barCols", title: "Mis colecciones", titleEn: "My collections",
      leading: { type: "IconButton", key: "backFromCols", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "colsBody", children: [{ type: "Column", children: [
      { type: "Form", key: "colNueva", onSubmitted: "colNueva", gap: 8, padding: 16, children: [
        { type: "TextField", key: "colNom",
          labelText: "Nueva colección", labelTextEn: "New collection",
          hintText: "P. ej. Mangas de terror", hintEn: "e.g. Horror manga",
          required: true },
        { type: "ElevatedButton", icon: "add",
          labelText: "Crear colección", labelTextEn: "Create collection", submit: true },
      ] },
      favEntry,
      nombres.length
        ? { type: "Column", gap: 8, padding: 16, children: nombres.map(function (n) {
            const items = cs[n].items || {};
            const cuantos = Object.keys(items).length;
            return { type: "Card", key: "colCard-" + serieKey("", n), flush: true,
              onTap: { event: "colAbrir", arg: n },
              children: [{ type: "Row", padding: 16, gap: 12, children: [
                { type: "Icon", name: "list", color: "muted" },
                { type: "Column", flex: 1, gap: 4, crossAxisAlignment: "start", children: [
                  { type: "Text", text: n, textEn: n, style: "h4" },
                  { type: "Text", text: cuantos + (cuantos === 1 ? " manga" : " mangas"),
                    textEn: cuantos + (cuantos === 1 ? " manga" : " mangas"),
                    style: "caption", color: "muted" },
                ] },
                { type: "IconButton", key: "colDel-" + serieKey("", n), icon: "delete",
                  labelText: "Borrar colección", labelTextEn: "Delete collection",
                  onPressed: { event: "colDel", arg: n } },
              ] }] };
          }) }
        : { type: "Column", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
            { type: "emptyState", icon: "heart", title: "Sin colecciones todavía.", titleEn: "No collections yet." },
            { type: "Text",
              text: "Crea una con nombre («Mis mangas de terror», «Los que releo»…) y añádeles series desde su página con «Añadir a colección». El corazón del Inicio siempre te trae aquí.",
              textEn: "Create one with a name and add series from their page with «Add to collection». The home heart always brings you here.",
              style: "caption", color: "muted" },
          ] },
    ].filter(Boolean) }] },
  };
}

// Una colección abierta: su nombre arriba y sus series en cuadrícula
// (las mismas tarjetas de los favoritos: portada + título + fuente).
function coleccionTree(nombre) {
  const cs = cols();
  const c = cs[nombre];
  const items = c && c.items
    ? Object.keys(c.items).map(function (k) { return c.items[k]; })
      .sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); })
    : [];
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barCol", title: nombre, titleEn: nombre,
      leading: { type: "IconButton", key: "backFromCol", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "colBody", children: [{ type: "Column", children: [
      { type: "Text", text: items.length + (items.length === 1 ? " manga en «" : " mangas en «") + nombre + "»",
        textEn: items.length + (items.length === 1 ? " manga in «" : " mangas in «") + nombre + "»",
        style: "caption", color: "muted", padding: 16 },
      items.length
        ? { type: "ListView", key: "gridCol", columns: { compact: 3, medium: 4, expanded: 6 },
            items: items.map(function (it) { return favCard(it); }) }

        : { type: "Column", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
            { type: "emptyState", icon: "list", title: "Esta colección está vacía.", titleEn: "This collection is empty." },
            { type: "Text",
              text: "Abre una serie y toca «Añadir a colección» para meterla en «" + nombre + "».",
              textEn: "Open a series and tap «Add to collection» to put it in «" + nombre + "».",
              style: "caption", color: "muted" },
          ] },
    ] }] },
  };
}

// Elegir colección para una serie (desde su página): tocar una la mete
// o la saca si ya estaba; el formulario estrena una nueva con la serie

// dentro. La serie pendiente llega en el estado (colPend).
function colElegirTree(state) {
  const pend = (state && state.colPend) || null;
  const cs = cols();
  const nombres = Object.keys(cs).sort(function (a, b) { return (cs[b].ts || 0) - (cs[a].ts || 0); });
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barColE",
      title: "«" + String((pend && pend.title) || "Serie").slice(0, 30) + "»",
      titleEn: "«" + String((pend && pend.title) || "Series").slice(0, 30) + "»",
      leading: { type: "IconButton", key: "backFromColE", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "colEBody", children: [{ type: "Column", children: [
      pend
        ? { type: "Text", text: "¿A cuál colección?", textEn: "Which collection?",
            style: "h3", padding: 16 }
        : { type: "Column", padding: 16, gap: 8, crossAxisAlignment: "center", children: [
            { type: "Text", text: "La serie pendiente se perdió (pasó un rato): vuelve a la serie y toca «Añadir a colección».",
              textEn: "The pending series was lost (time passed): go back to the series and tap «Add to collection».",
              style: "caption", color: "muted" },
          ] },
      { type: "Form", key: "colNuevaD", onSubmitted: "colNuevaDesde", gap: 8, padding: 16, children: [
        { type: "TextField", key: "colNom2",
          labelText: "Colección nueva", labelTextEn: "New collection",
          hintText: "P. ej. Mangas de terror", hintEn: "e.g. Horror manga",
          required: true },
        { type: "ElevatedButton", icon: "add",
          labelText: "Crear y añadir aquí", labelTextEn: "Create and add here", submit: true },
      ] },
      nombres.length
        ? { type: "Column", gap: 8, padding: 16, children: nombres.map(function (n) {
            const dentro = pend ? colEn(n, pend.url) : false;
            return { type: "Card", key: "colE-" + serieKey("", n), flush: true,
              onTap: { event: "colAddA", arg: n },
              children: [{ type: "Row", padding: 16, gap: 12, children: [
                { type: "Icon", name: dentro ? "check" : "heart", color: "muted" },
                { type: "Column", flex: 1, gap: 4, crossAxisAlignment: "start", children: [
                  { type: "Text", text: n, textEn: n, style: "h4" },
                  { type: "Text",
                    text: dentro ? "Ya está dentro: tocar la quita" : "Tocar la añade",
                    textEn: dentro ? "Already inside: tapping removes it" : "Tap to add it",
                    style: "caption", color: "muted" },
                ] },
              ] }] };
          }) }
        : null,
    ].filter(Boolean) }] },
  };
}

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
      // v0.4.49 — la nube propia al alcance: respaldo de esta lista.
      { type: "Card", key: "favsSync", flush: true,
        onTap: { event: "syncAbrir" },
        children: [{ type: "Row", padding: 16, gap: 12, children: [
          { type: "Icon", name: "sync", color: "muted" },
          { type: "Column", flex: 1, gap: 4, crossAxisAlignment: "start", children: [
            { type: "Text", text: "Sincronizar", textEn: "Sync", style: "h4" },
            { type: "Text", text: "Respaldo en tu chat de Telegram: favoritos, reseñas, colecciones e historial sobreviven a las reinstalaciones",
              textEn: "Backed up to your Telegram chat: favourites, reviews, collections and history survive reinstalls",
              style: "caption", color: "muted" },
          ] }] }] },
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

// ------------------------------------------------- v0.4.49 — mis reseñas
// La página de la reseña de la serie abierta: escribir, guardar y
// borrar lo que la persona opina de cada manga.
function resenaTree(state) {
  const d = (state && state.detail) || {};
  const url = d.url || "";
  const r = url ? resenaDe(url) : null;
  const titulo = (d.meta && d.meta.title) || "Serie";
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barRes", title: "Mi reseña", titleEn: "My review",
      leading: { type: "IconButton", key: "backFromRes", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "resBody", children: [{ type: "Column", children: [
      { type: "Text", text: titulo, textEn: titulo, style: "h3", padding: 16 },
      { type: "Text",
        text: "Tu opinión de la serie. Se guarda en este aparato, viaja a tus aparatos vinculados y, con la sincronización activada, queda respaldada en tu chat de Telegram.",
        textEn: "Your take on the series. Saved on this device, shared with your linked devices and, with sync on, backed up to your Telegram chat.",
        style: "caption", color: "muted", padding: 16 },
      { type: "Form", key: "resForm", onSubmitted: "resenaSave", gap: 8, padding: 16, children: [
        { type: "TextField", key: "resTxt",
          labelText: "Tu reseña", labelTextEn: "Your review",
          hintText: "P. ej. Buena historia, dibujo excelente…", hintEn: "e.g. Good story, great art…",
          value: r ? r.text : "" },
        { type: "ElevatedButton", icon: "check",
          labelText: "Guardar", labelTextEn: "Save", submit: true },
      ] },
      r ? { type: "TextButton", key: "resBor", icon: "delete",
        labelText: "Borrar reseña", labelTextEn: "Delete review",
        onPressed: { event: "resenaBorrar" } } : null,
    ].filter(Boolean) }] },
  };
}

// ------------------------------------------------- v0.4.49 — sincronizar
// La nube propia: el respaldo de favoritos y reseñas. v0.4.49 lo puso
// en un repositorio de GitHub del usuario; v0.4.51 lo muda a Telegram
// (un bot propio de cada usuario): GitHub se retira del todo.
function syncTree(state) {
  const c = getJson("tgSync", null) || {};
  const ts = getJson("tgTs", 0);
  const hace = ts ? Math.max(1, Math.round((Date.now() - ts) / 60000)) : 0;
  const tokenOk = TG_TOKEN_FORMA.test(c.token || "");
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", key: "barSync", title: "Sincronizar", titleEn: "Sync",
      leading: { type: "IconButton", key: "backFromSync", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "syncBody", children: [{ type: "Column", children: [
      { type: "Text", text: "Tu nube de respaldo (Telegram)", textEn: "Your backup cloud (Telegram)",
        style: "h3", padding: 16 },
      { type: "Text",
        text: "Los favoritos, las reseñas y el historial ya viajan entre tus aparatos vinculados; aquí respaldas TODO (favoritos, reseñas, colecciones e historial) en tu propio chat de Telegram, con un bot que creas tú, para que sobreviva aunque reinstales el plugin.",
        textEn: "Favourites, reviews and history already travel between your linked devices; here you back up EVERYTHING (favourites, reviews, collections and history) to your own Telegram chat, with a bot you create, so it survives a plugin reinstall.",
        style: "caption", color: "muted", padding: 16 },
      !tokenOk ? { type: "Form", key: "syncForm", onSubmitted: "tgGuardar", gap: 8, padding: 16, children: [
        { type: "Text",
          text: "1. Abre @BotFather en Telegram, pídele un bot con /newbot y copia el token que te da.",
          textEn: "1. Open @BotFather in Telegram, ask for a bot with /newbot and copy the token it gives you.",
          style: "caption", color: "muted" },
        { type: "TextField", key: "tgToken", obscureText: true,
          labelText: "Token del bot", labelTextEn: "Bot token",
          hintText: "123456789:AAH…", hintEn: "123456789:AAH…" },
        { type: "ElevatedButton", icon: "cloud_done",
          labelText: "Guardar", labelTextEn: "Save", submit: true },
      ] } : null,
      tokenOk && !(c.chatId > 0) ? { type: "Column", padding: 16, gap: 8, children: [
        { type: "Text",
          text: "2. Abre tu bot en Telegram, toca «Iniciar» y escríbele algo (p. ej. «hola»).",
          textEn: "2. Open your bot in Telegram, tap «Start» and write something to it (e.g. «hello»).",
          style: "caption", color: "muted" },
        { type: "ElevatedButton", key: "syncBuscar", icon: "person_search",
          labelText: "Buscar mi chat", labelTextEn: "Find my chat", onPressed: "tgBuscar" },
        c.pend ? { type: "Text", text: "Te escribió " + (c.pendNombre || "una cuenta") + " desde esa cuenta de Telegram. ¿Eres tú?",
          textEn: (c.pendNombre || "An account") + " wrote to the bot from that Telegram account. Is it you?",
          style: "h4" } : null,
        c.pend ? { type: "Row", gap: 12, children: [
          { type: "ElevatedButton", key: "syncSi", icon: "check",
            labelText: "Sí, soy yo", labelTextEn: "Yes, it's me", onPressed: "tgConfirmar" },
          { type: "TextButton", key: "syncNo", icon: "close",
            labelText: "No soy yo", labelTextEn: "Not me", onPressed: "tgRechazar" },
        ] } : null,
      ].filter(Boolean) } : null,
      tokenOk && (c.chatId > 0) ? { type: "Card", key: "syncOnOff", flush: true,
        onTap: { event: "syncOnOff" },
        children: [{ type: "Row", padding: 16, gap: 12, children: [
          { type: "Icon", name: c.on ? "sync" : "sync_disabled", color: "muted" },
          { type: "Column", flex: 1, gap: 4, crossAxisAlignment: "start", children: [
            { type: "Text", text: "Sincronización: " + (c.on ? "ACTIVADA" : "DESACTIVADA"),
              textEn: "Sync: " + (c.on ? "ON" : "OFF"), style: "h4" },
            { type: "Text", text: "Tocar la " + (c.on ? "desactiva" : "activa"),
              textEn: "Tap to turn " + (c.on ? "it off" : "it on"),
              style: "caption", color: "muted" },
            { type: "Text", text: "Vinculado: " + (c.chatName || "tu chat"),
              textEn: "Linked: " + (c.chatName || "your chat"),
              style: "caption", color: "muted" },
          ] }] }] } : null,
      tokenOk && (c.chatId > 0) ? { type: "Column", padding: 16, gap: 8, children: [
        { type: "ElevatedButton", key: "syncAhora", icon: "sync",
          labelText: "Sincronizar ahora", labelTextEn: "Sync now",
          onPressed: "syncAhora", enabled: !!(c.on && c.chatId > 0) },
        { type: "Text",
          text: hace ? "Última sincronización: hace " + (hace < 60 ? hace + " min" : Math.round(hace / 60) + " h") + ". Al abrir el plugin se baja el respaldo y todo cambio sube solo."
            : "Aún no has sincronizado. Al abrir el plugin se bajará el respaldo y todo cambio subirá solo.",
          textEn: hace ? "Last sync: " + (hace < 60 ? hace + " min" : Math.round(hace / 60) + " h") + " ago. On open the backup is pulled and every change uploads on its own."
            : "You haven't synced yet. On open the backup will be pulled and every change will upload on its own.",
          style: "caption", color: "muted" },
        { type: "Text",
          text: "La copia queda FIJADA en el chat con tu bot: no la borres ni la desfijes. Puedes silenciar el chat para que las copias no avisen.",
          textEn: "The backup stays PINNED in your bot chat: don't delete or unpin it. You can mute the chat so copies don't notify.",
          style: "caption", color: "muted" },
        { type: "TextButton", key: "syncOlvidar", icon: "link_off",
          labelText: "Olvidar el bot", labelTextEn: "Forget the bot", onPressed: "tgOlvidar" },
      ] } : null,
    ].filter(Boolean) }] },
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
  "{ id idMal title { romaji english native } synonyms coverImage { extraLarge } format chapters averageScore } } }";

// v0.4.24 — la misma búsqueda SOLO entre adultos (los +18 existen: la
// receta de AniTrack v0.8.0). El buscador normal de AniList aparta el
// contenido adulto; si el título pedido no aparece, esta segunda
// pasada lo trae — y solo entra el que calza exacto.
const AL_QUERY_ADULT = AL_QUERY.replace("isAdult: false", "isAdult: true");

async function alJsonAdulto(q) {
  const r = await kino.fetch("https://graphql.anilist.co", { method: "POST",
    body: { json: { query: AL_QUERY_ADULT, variables: { p: 1, s: q, sort: ["SEARCH_MATCH"] } } } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con AniList. Inténtalo de nuevo.",
  });
  return await r.json();
}

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
      native: String(t.native || ""), sinonimos: (m.synonyms || []).map(String).slice(0, 8),
      cover: ((m.coverImage && m.coverImage.extraLarge) || ""),
      nota: typeof m.averageScore === "number" ? m.averageScore : null,
      formato: String(m.format || ""), caps: (typeof m.chapters === "number" && m.chapters) || 0,
    };
  });
}

function alTitulo(m) { return m.english || m.romaji || ""; }

// v0.4.24 — TODOS los nombres de la serie en AniList: inglés, romaji,
// sus sinónimos (a veces el español vive entre ellos) y el original.
// Sirven para buscar en las fuentes y para el vínculo exacto. El
// orden importa: primero los dos oficiales, luego los sinónimos —
// el original va al final porque casi nunca busca mejor en español.
function alNombres(m) {
  const out = [];
  const mete = (s) => {
    const t = String(s || "").trim();
    if (t && out.indexOf(t) < 0) out.push(t);
  };
  mete(m.english); mete(m.romaji);
  if (Array.isArray(m.sinonimos)) for (let i = 0; i < m.sinonimos.length && i < 4; i++) mete(m.sinonimos[i]);
  mete(m.native);
  // v0.4.44 — PRECISIÓN: los buscadores de ManhwaWeb y Mangas.in se
  // atragantan con la puntuación de varios títulos («¿…?», «…:», «!»);
  // por cada nombre se prueba también su versión limpia.
  const base = out.slice(0);
  for (let i = 0; i < base.length; i++) {
    const limpio = String(base[i] || "")
      .replace(/[\u00BF\u00A1?!:;,.()\u2014\u2013"'\u2026]+/g, " ")
      .replace(/\s+/g, " ").trim();
    if (limpio && limpio !== base[i]) mete(limpio);
  }
  return out.slice(0, 12);
}

// v0.4.24 — buscar en la fuente elegida con el buscador de siempre de
// cada casa (el mismo que usan la sección de AniList y la vinculación).
async function buscarEnFuente(f, q) {
  await null;
  if (f.id === "mangadex") return await mdSearch(q);
  if (f.id === "inmanga") return await imBuscar(q);
  if (f.id === "mangaoni") return await moBuscar(q);
  if (f.id === "mangasin") return await msBuscar(q);
  if (f.id === "manhwaweb") return await mwBuscar(q);
  // v0.4.25 — LeerCapitulo ya no responde a "/?s=" (devuelve su portada):
  // su buscador vive ahora en la página del catálogo, "/manga/?q=…".
  const ruta = f.id === "lectorxd"
    ? "/catalogo?filters=true&orderBy=recent&search=" + encodeURIComponent(q)
    : "/manga/?q=" + encodeURIComponent(q);
  const html = await getHtmlDe(f, ruta);
  return cardsDe(f, html, 30);
}

// v0.4.24 — verificación por id exacto: MangaDex publica el enlace de
// AniList de cada serie en sus «links»; si la búsqueda por título trae
// una cuyo id de AniList es el de la serie tocada, es LA serie —
// identidad, no parecido. Las cuatro categorías de contenido van
// incluidas (los +18 también).
async function mdVerificarAl(titulo, alId) {
  await null;
  const t = String(titulo || "").trim();
  if (!t || !alId) return null;
  try {
    const j = await mdJson("/manga?limit=10&title=" + encodeURIComponent(t)
      + "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic");
    const datos = (j && j.data) || [];
    for (let i = 0; i < datos.length; i++) {
      const m = datos[i];
      const s = String(((m.attributes && m.attributes.links) || {}).al || "").trim();
      const mm = s.match(/(\d+)\D*$/);
      if (mm && parseInt(mm[1], 10) === alId) {
        return { url: "/title/" + m.id, title: mdTitulo(m) };
      }
    }
  } catch (e) { log("md verificar al: " + ((e && e.message) || e)); }
  return null;
}

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
  let nuevos = alItemsDe(j);
  // v0.4.24 — los +18 existen: si el título pedido no apareció en la
  // búsqueda normal (que aparta los adultos), una segunda pasada SOLO
  // entre adultos trae únicamente los que calzan exacto con el título
  // pedido — nada de colar el primero de la lista.
  if (q && !nuevos.length && page1 === 1) {
    try {
      const j2 = await alJsonAdulto(q);
      const cand = alItemsDe(j2);
      const qn = normTituloMD(q);
      nuevos = cand.filter((x) => {
        const ns = alNombres(x).map(normTituloMD);
        for (let i = 0; i < ns.length; i++) if (ns[i] && ns[i] === qn) return true;
        return false;
      });
      if (nuevos.length) log("al: " + nuevos.length + " +18 hallados con el título exacto");
    } catch (e) { log("al +18: " + ((e && e.message) || e)); }
  }
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



// ------------------------------------------------ Para ti (v0.4.55)

// v0.4.55 — PARA TI: descubrimiento de mangas según el gusto de la
// persona. La base son SUS series: favoritos (peso 3), colecciones
// (peso 2) e historial de lectura (peso 1), cada una con su id de
// AniList (el vínculo «alId:», el mapa de títulos verificados y,
// hasta 6 rescates por tanda, MangaDex por título — su caché evita
// repetir búsquedas). Con esos ids AniList cuenta dos cosas: (1) las
// RECOMENDACIONES DE LA COMUNIDAD sobre cada serie suya (a quien le
// gustó tu serie, qué le gustó — la voz de miles de lectores reales,
// no un parecido de géneros) y (2) los géneros y tags que más se
// repiten entre sus series, para buscar series populares que los
// compartan (con y sin +18: la persona lo eligió así). Tocar una
// sugerencia abre el MISMO flujo de la sección AniList: se busca en
// su fuente con todos los nombres y se vincula exacta. Sin series
// vinculadas no hay gusto que leer: la pantalla lo dice honesto y
// muestra lo de moda mientras tanto.
const PARA_TI_TTL = 43200000; // 12 h
const PARA_CAMPOS = "id idMal title { romaji english native } synonyms " +
  "coverImage { extraLarge } format chapters averageScore";

async function paraTiJson(query, variables) {
  const r = await kino.fetch("https://graphql.anilist.co", { method: "POST",
    body: { json: { query: query, variables: variables } } });
  if (!r.ok) throw kino.error("network", "HTTP " + r.status, {
    userMessage: "No se pudo conectar con AniList. Inténtalo de nuevo.",
  });
  return await r.json();
}

// Las series de la persona con su id de AniList, sin repetir y
// ordenadas por peso (favoritos > colecciones > historial).
async function paraTiBase() {
  const vistos = {};
  const mete = (url, title, peso) => {
    const u = String(url || "");
    const t = String(title || "").trim();
    if (!u || !t) return;
    if (vistos[u]) { if (peso > vistos[u].peso) vistos[u].peso = peso; return; }
    vistos[u] = { url: u, title: t.slice(0, 120), peso: peso };
  };
  const fs = favs();
  for (let i = 0; i < fs.length; i++) mete(fs[i].url, fs[i].title, 3);
  const cs = cols();
  for (const nom in cs) {
    const items = (cs[nom] && cs[nom].items) || {};
    for (const u in items) mete(u, items[u].title, 2);
  }
  const h = hist();
  for (const u in h) mete(u, h[u].title, 1);
  let lista = Object.keys(vistos).map((u) => vistos[u]);
  lista.sort((a, b) => b.peso - a.peso);
  lista = lista.slice(0, 14);
  const res = [];
  let rescates = 0;
  for (let i = 0; i < lista.length; i++) {
    const it = lista[i];
    let al = 0;
    const vinc = getJson("alId:" + it.url, null);
    if (vinc && vinc.al) al = vinc.al;
    if (!al) {
      const esp = idsEspeciales(it.title, tituloLimpioMD(it.title));
      if (esp && esp.al) al = esp.al;
    }
    if (!al && rescates < 6) {
      rescates++;
      try {
        const ids = await idsPorTitulo(tituloLimpioMD(it.title) || it.title);
        if (ids && ids.al) al = ids.al;
      } catch (e) { log("para ti ids: " + ((e && e.message) || e)); }
    }
    if (al) res.push({ al: al, title: it.title, peso: it.peso });
  }
  return res.slice(0, 12);
}

// Arma (o reusa) la lista «Para ti». Sin series vinculadas quedan las
// tendencias de AniList y el aviso honesto de vincular para afinar.
async function paraTiComputar(forzar) {
  const base = await paraTiBase();
  const sig = base.map((x) => x.al).join(",");
  const cache = getJson("paraTi", null);
  const edad = cache ? Date.now() - (cache.ts || 0) : Infinity;
  if (!forzar && cache && cache.sig === sig && Array.isArray(cache.items) &&
      (cache.motivo === "sin-vinculos" ? edad < 3600000 : edad < PARA_TI_TTL)) {
    return { items: cache.items, motivo: cache.motivo || "" };
  }
  if (!base.length) {
    const tendencias = await paraTiTendencias();
    setJson("paraTi", { ts: Date.now(), sig: sig, base: 0,
      motivo: "sin-vinculos", items: tendencias });
    return { items: tendencias, motivo: "sin-vinculos" };
  }
  // (1) Perfil y recomendaciones de la comunidad: una sola consulta
  // con un alias por serie de la base.
  const alias = base.map((x, i) => "m" + i + ": Media(id: " + x.al + ") { genres " +
    "tags { name rank isGeneralSpoiler } " +
    "recommendations(sort: RATING_DESC, perPage: 6) { nodes { rating " +
    "mediaRecommendation { " + PARA_CAMPOS + " } } } }").join(" ");
  const j1 = await paraTiJson("query { " + alias + " }", null);
  const d1 = (j1 && j1.data) || {};
  const genC = {}, tagC = {}, recs = {};
  const baseIds = {};
  base.forEach((x) => { baseIds[x.al] = 1; });
  for (let i = 0; i < base.length; i++) {
    const m = d1["m" + i];
    if (!m) continue;
    const w = base[i].peso;
    const gens = Array.isArray(m.genres) ? m.genres : [];
    for (let g = 0; g < gens.length; g++) genC[gens[g]] = (genC[gens[g]] || 0) + w;
    const tgs = Array.isArray(m.tags) ? m.tags : [];
    for (let t = 0; t < tgs.length; t++) {
      const tg = tgs[t];
      if (tg && tg.name && !tg.isGeneralSpoiler)
        tagC[tg.name] = (tagC[tg.name] || 0) + w * (1 + ((tg.rank || 0) / 100));
    }
    const nodos = (m.recommendations && m.recommendations.nodes) || [];
    for (let k = 0; k < nodos.length; k++) {
      const n = nodos[k];
      const r = n && n.mediaRecommendation;
      if (!r || !r.id || !(n.rating > 0) || baseIds[r.id]) continue;
      if (!recs[r.id]) recs[r.id] = { item: paraTiItem(r,
        "por «" + String(base[i].title || "").slice(0, 24) + "»"), puntos: 0, votos: 0 };
      recs[r.id].puntos += w * (1 + (n.rating / 100));
      recs[r.id].votos += 1;
    }
  }
  // (2) Los géneros y tags que más se repiten entre sus series: su
  // gusto, para buscar series populares parecidas (con y sin +18).
  const topGen = Object.keys(genC).sort((a, b) => genC[b] - genC[a]).slice(0, 4);
  const topTag = Object.keys(tagC).sort((a, b) => tagC[b] - tagC[a]).slice(0, 6);
  const genSet = {}; for (let i = 0; i < topGen.length; i++) genSet[topGen[i]] = 1;
  const tagSet = {}; for (let i = 0; i < topTag.length; i++) tagSet[topTag[i]] = 1;
  const gustos = {};
  let cand = [];
  try {
    const qg = "query ($g: [MediaGenre], $t: [String], $a: Boolean) { " +
      "Page(perPage: 30) { media(type: MANGA, isAdult: $a, genre_in: $g, tag_in: $t, " +
      "sort: [POPULARITY_DESC]) { " + PARA_CAMPOS + " genres tags { name } } } }";
    const jn = await paraTiJson(qg, { g: topGen.slice(0, 3), t: topTag.slice(0, 4), a: false });
    cand = (jn && jn.data && jn.data.Page && jn.data.Page.media) || [];
    const ja = await paraTiJson(qg, { g: topGen.slice(0, 3), t: topTag.slice(0, 4), a: true });
    cand = cand.concat((ja && ja.data && ja.data.Page && ja.data.Page.media) || []);
  } catch (e) {
    log("para ti gustos: " + ((e && e.message) || e));
    try {
      const qg2 = "query ($g: [MediaGenre]) { Page(perPage: 40) { " +
        "media(type: MANGA, genre_in: $g, sort: [POPULARITY_DESC]) { " +
        PARA_CAMPOS + " genres tags { name } } } }";
      const jn2 = await paraTiJson(qg2, { g: topGen.slice(0, 2) });
      cand = (jn2 && jn2.data && jn2.data.Page && jn2.data.Page.media) || [];
    } catch (e2) { log("para ti gustos respaldo: " + ((e2 && e2.message) || e2)); }
  }
  for (let i = 0; i < cand.length; i++) {
    const m = cand[i];
    if (!m || !m.id || baseIds[m.id] || recs[m.id]) continue;
    let pts = 0;
    const matchG = [], matchT = [];
    const gens = Array.isArray(m.genres) ? m.genres : [];
    for (let g = 0; g < gens.length; g++) if (genSet[gens[g]]) { pts += 2; matchG.push(gens[g]); }
    const tgs = Array.isArray(m.tags) ? m.tags : [];
    for (let t = 0; t < tgs.length; t++)
      if (tgs[t] && tgs[t].name && tagSet[tgs[t].name]) { pts += 1; matchT.push(tgs[t].name); }
    if (pts < 4) continue;
    const por = (matchG.slice(0, 2).join(" · ")) || (matchT.slice(0, 2).join(" · "));
    gustos[m.id] = { item: paraTiItem(m, por), puntos: pts };
  }
  // (3) La mezcla: primero las recos de la comunidad (cuantas más
  // series tuyas la recomiendan, mejor), luego las de gustos
  // parecidos; si AniList quedó parco, tendencias honestas.
  const items = [];
  const seen = {};
  const listaRec = Object.keys(recs).map((k) => recs[k])
    .sort((a, b) => (b.votos - a.votos) || (b.puntos - a.puntos));
  for (let i = 0; i < listaRec.length && items.length < 12; i++) {
    if (!seen[listaRec[i].item.id]) { seen[listaRec[i].item.id] = 1; items.push(listaRec[i].item); }
  }
  const listaGus = Object.keys(gustos).map((k) => gustos[k])
    .sort((a, b) => b.puntos - a.puntos);
  for (let i = 0; i < listaGus.length && items.length < 24; i++) {
    if (!seen[listaGus[i].item.id]) { seen[listaGus[i].item.id] = 1; items.push(listaGus[i].item); }
  }
  if (items.length < 6) {
    const ten = await paraTiTendencias();
    for (let i = 0; i < ten.length && items.length < 6; i++) {
      if (!seen[ten[i].id]) { seen[ten[i].id] = 1; items.push(ten[i]); }
    }
  }
  const recorte = items.slice(0, 24);
  const okGuardar = setJson("paraTi", { ts: Date.now(), sig: sig, base: base.length,
    motivo: "", items: recorte });
  if (!okGuardar) log("para ti sin guardar: almacén lleno");
  return { items: recorte, motivo: "" };
}

// Lo de moda hoy en AniList (manga), para cuando no hay base o la
// mezcla quedó corta — siempre con su porqué honesto.
async function paraTiTendencias() {
  const j = await paraTiJson("query { Page(perPage: 12) { " +
    "media(type: MANGA, isAdult: false, sort: [TRENDING_DESC]) { " + PARA_CAMPOS + " } } }", null);
  const med = (j && j.data && j.data.Page && j.data.Page.media) || [];
  return med.map((m) => paraTiItem(m, "de moda en AniList"));
}

// Del objeto Media de AniList a la tarjeta de sugerencia — la misma
// forma que los resultados de la sección AniList, así el flujo de
// vinculación es el mismo de siempre.
function paraTiItem(r, porque) {
  const t = (r && r.title) || {};
  return {
    id: r.id, mal: r.idMal || 0,
    romaji: String(t.romaji || ""), english: String(t.english || ""),
    native: String(t.native || ""),
    sinonimos: (r.synonyms || []).map(String).slice(0, 8),
    cover: ((r.coverImage && r.coverImage.extraLarge) || ""),
    nota: typeof r.averageScore === "number" ? r.averageScore : null,
    formato: String(r.format || ""),
    caps: (typeof r.chapters === "number" && r.chapters) || 0,
    porque: String(porque || "").slice(0, 40),
  };
}

function paraCard(it) {
  const titulo = alTitulo(it);
  return { type: "Card", key: "pt-" + it.id, flush: true,
    onTap: { event: "paraAbrir", arg: String(it.id) },
    children: [
      { type: "Image", url: it.cover || "", aspect: "2:3", alt: titulo, altEn: titulo,
        fallback: { type: "Column", padding: 16, crossAxisAlignment: "center",
          children: [{ type: "Icon", name: "list", color: "muted" }] } },
    ].concat(twoLines(titulo).map((ln) => (
      { type: "Text", text: ln, textEn: ln, style: "caption", padding: 8 })))
      .concat(it.porque ? [{ type: "Text", text: it.porque, textEn: it.porque,
        style: "caption", color: "muted", padding: 8 }] : []),
  };
}

// El riel «Para ti» del Inicio: si ya hay sugerencias (caché de 12 h),
// sus tarjetas; si todavía no, la puerta de entrada que las arma.
function paraTiRail() {
  const p = getJson("paraTi", null);
  const items = (p && Array.isArray(p.items)) ? p.items.slice(0, 12) : [];
  if (items.length >= 3) return [
    { type: "Text", text: "Para ti", textEn: "For you", style: "h3", padding: 16 },
    { type: "SingleChildScrollView", key: "railPara", direction: "horizontal", padding: 16,
      children: [{ type: "Row", gap: 8,
        children: items.map((it) => paraCard(it)).concat([
          { type: "Card", key: "vermas-descubre", flush: true,
            onTap: { event: "descubreAbrir" },
            children: [{ type: "Column", padding: 16, gap: 4, crossAxisAlignment: "center",
              children: [
                { type: "Icon", name: "explore", color: "muted" },
                { type: "Text", text: "Descubrir", textEn: "Discover",
                  style: "caption", color: "muted" },
              ] }] },
        ]) }] },
  ];
  return [{ type: "Card", key: "paraEntry", flush: true, onTap: { event: "descubreAbrir" },
    children: [
      { type: "Text", text: "Para ti — descubre mangas según tu gusto",
        textEn: "For you — discover manga by your taste", style: "h3", padding: 16 },
      { type: "Text",
        text: "Sugerencias armadas con tus favoritos, colecciones e historial. Toca para armarlas.",
        textEn: "Suggestions from your favorites, collections and history. Tap to build them.",
        style: "caption", color: "muted", padding: 16 },
    ] }];
}

// La pantalla «Descubrir»: la lista completa con su porqué y el botón
// de volver a buscar hoy.
function descubreTree(p) {
  const items = (p && Array.isArray(p.items)) ? p.items : [];
  const base = (p && p.base) || 0;
  if (!p || typeof p !== "object" || !p.ts) {
    return { type: "Column", padding: 32, gap: 12, crossAxisAlignment: "center", children: [
      { type: "CircularProgressIndicator" },
      { type: "Text", text: "Armando tus sugerencias…",
        textEn: "Building your suggestions…", color: "muted" },
      { type: "ElevatedButton", key: "paraRetry", icon: "explore",
        labelText: "Descubrir", labelTextEn: "Discover", onPressed: { event: "descubreAbrir" } },
    ] };
  }
  return { type: "Scaffold",
    appBar: { type: "AppBar", key: "barDescubre", title: "Descubrir · Para ti",
      titleEn: "Discover · For you",
      leading: { type: "IconButton", key: "backDescubre", icon: "arrow_back",
        labelText: "Atrás", labelTextEn: "Back", onPressed: { event: "popBack" } },
      actions: [] },
    body: { type: "SingleChildScrollView", key: "descBody", children: [{
      type: "Column", children: [
        base
          ? { type: "Text",
              text: "Según tus " + base + " series (favoritos, colecciones e historial): las recomendaciones de los lectores de AniList y lo popular que comparte tus géneros. Toca una: se busca en tu fuente y se vincula para registrar lo que leas.",
              textEn: "From your " + base + " series (favorites, collections and history): AniList readers' recommendations and popular series sharing your genres. Tap one: it gets searched on your source and linked.",
              style: "caption", color: "muted", padding: 16 }
          : { type: "Text",
              text: "Aún no hay series vinculadas a AniList, así que no hay gusto que leer: vincula tus favoritos desde la sección AniList (se tocan y se elige la serie de tu fuente) y esto se afina solo. Mientras tanto, lo de moda.",
              textEn: "No series linked to AniList yet, so there is no taste to read: link your favorites from the AniList section (tap and pick your source's series) and this refines itself. Meanwhile, what is trending.",
              style: "caption", color: "muted", padding: 16 },
        { type: "Row", gap: 8, padding: 16, children: [
          { type: "ElevatedButton", key: "descRefrescar", icon: "refresh",
            labelText: "Buscar de nuevo", labelTextEn: "Search again",
            onPressed: { event: "descubreRefrescar" } },
        ] },
        items.length ? { type: "ListView", key: "paraGrid",
          columns: { compact: 2, medium: 3, expanded: 4 },
          items: items.map((it) => paraCard(it)) } :
          { type: "Text", text: "Sin sugerencias todavía.",
            textEn: "No suggestions yet.", color: "muted", padding: 16 },
      ].filter(Boolean) }] },
  };
}

// v0.4.55 — el flujo de vincular una serie de AniList con la fuente:
// antes era el cuerpo del evento «alAbrir»; «Para ti» lo reusa tal
// cual (buscarla con todos sus nombres, proponer el vínculo
// exacto y abrir la pantalla de vincular).
async function alVincularFlujo(m) {
      const tituloAL = alTitulo(m);
      if (!tituloAL) return { toast: "Esa serie no tiene título en AniList." };
      const f = fuenteActiva();
      // v0.4.24 — ALCANCE: la serie puede llamarse distinto en cada
      // lado; se buscan TODOS sus nombres de AniList (inglés, romaji,
      // sinónimos — a veces el español está entre ellos — y el
      // original, cada uno también en su versión sin puntuación para
      // los buscadores que se atragantan con ella) hasta que la fuente
      // dé resultados.
      const nombres = alNombres(m);
      let results = [];
      let qUsada = "";
      let primerError = null;
      for (let i = 0; i < nombres.length && i < 12 && !results.length; i++) {
        try {
          results = await buscarEnFuente(f, nombres[i]);
          qUsada = nombres[i];
        } catch (e) { if (!primerError) primerError = e; }
      }
      if (!results.length && primerError) {
        return { toast: (primerError && primerError.userMessage) || ("No se pudo buscar en " + f.nombre + ".") };
      }
      // v0.4.24 — PRECISIÓN: vínculo exacto si la fuente tiene la
      // serie con el mismo título (normalizado) que CUALQUIER nombre de
      // AniList — el título oficial o cualquiera de sus sinónimos.
      // Se guarda el vínculo ya, sin esperar a la mano: el registro
      // pasa a ser exacto, nunca por parecido.
      let vinUrl = "", vinTitulo = "";
      const qSet = {};
      for (let i = 0; i < nombres.length; i++) {
        const n = normTituloMD(nombres[i]);
        if (n) qSet[n] = 1;
      }
      if (Object.keys(qSet).length) {
        for (let i = 0; i < results.length; i++) {
          const it = results[i];
          // v0.4.44 — ManhwaWeb trae el nombre original de cada serie
          // (alt): calza si el título en español O el original coinciden
          // con cualquiera de los nombres de AniList.
          const nq = it && it.url ? normTituloMD(it.title) : "";
          const na = it && it.alt ? normTituloMD(it.alt) : "";
          if ((nq && qSet[nq]) || (na && qSet[na])) {
            setJson("alId:" + it.url, { al: m.id, mal: m.mal || 0 });
            vinUrl = it.url;
            vinTitulo = it.title || "";
            break;
          }
        }
      }
      // v0.4.24 — IDENTIDAD: si la fuente activa no la tuvo clara,
      // MangaDex puede tenerla — y publica el enlace de AniList de
      // cada serie: si su id coincide con el de la serie tocada, es
      // LA serie, sin duda de parecido. Con la fuente activa en
      // MangaDex el vínculo se da por bueno ahí mismo; leyendo en otra
      // fuente, la pantalla de vincular la ofrece arriba.
      let mdSegura = null;
      if (!vinUrl) {
        for (let i = 0; i < nombres.length && i < 3 && !mdSegura; i++) {
          mdSegura = await mdVerificarAl(nombres[i], m.id);
        }
        if (mdSegura && f.id === "mangadex") {
          setJson("alId:" + mdSegura.url, { al: m.id, mal: m.mal || 0 });
          vinUrl = mdSegura.url;
          vinTitulo = mdSegura.title;
          mdSegura = null;
        }
      }
      // v0.4.12 — pantalla de vinculación: el título de AniList casi
      // nunca es el que la fuente muestra en español; aquí la persona
      // busca con SU título y toca la serie correcta.
      const vin = { al: m.id, mal: m.mal || 0, titulo: tituloAL,
        q: qUsada || tituloAL, fuente: f.id, res: results.slice(0, 30),
        linked: vinUrl, linkedTitle: vinTitulo, mdSegura: mdSegura };
      if (!setJsonCache("vin", vin)) {
        return { toast: "El almacén del plugin está lleno: no pude abrir la vinculación." };
      }
      return { state: { vinTk: Date.now() }, route: { push: "vincular" },
        toast: vinUrl
          ? "✓ Vinculada automáticamente: si no es la serie que lees, búscala abajo con el título en español."
          : (vin.mdSegura
            ? "Sin vínculo claro en " + f.nombre + ", pero MangaDex la tiene verificada por id: tócala arriba para abrirla ya vinculada."
            : "Elige tu fuente, busca con el título en español y toca la serie correcta.") };
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
      ].concat((v.mdSegura && v.mdSegura.url && !v.linked)
        ? [{ type: "Card", key: "vinMdSegura", flush: true,
             onTap: { event: "vinAbrirMD" },
             children: [
               { type: "Text", text: "✓ MangaDex la tiene: «" + String(v.mdSegura.title || "").slice(0, 60) + "»",
                 textEn: "✓ MangaDex has it: “" + String(v.mdSegura.title || "").slice(0, 60) + "”",
                 padding: 12 },
               { type: "Text", text: "Verificada por id exacto de AniList: toca para abrirla ya vinculada.",
                 textEn: "Verified by exact AniList id: tap to open it already linked.",
                 style: "caption", color: "muted", padding: 12 },
             ] }]
        : []).concat([
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
      ]) }] },
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
async function abrirCapitulo(d, idx, conRuta, retomar) {
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
  // v0.4.30 — el gran cambio del lector: los capítulos con muro
  // (ManhwaWeb y Mangas.in) ya no se miden con peticiones sueltas —
  // sus PÁGINAS se bajan enteras con presentación y se guardan
  // convertidas («pgd:»); las dimensiones salen de los mismos bytes.
  // La primera tanda sale con el capítulo; las demás llegan solas al
  // acercarse la persona al final (o con «Bajar más páginas»). Solo
  // si el muro niega hasta la primera tanda se cae a la medición de
  // siempre, para que la nota honrada sepa decir cuál fue el motivo.
  const muro = fSer.id === "mangasin" ? "MS" : (fSer.id === "manhwaweb" ? "MW" : null);
  let pend = 0;
  let muroSt = null;
  if (muro) {
    muroLimpiaPaginas(images);
    const st = await muroConvierte(images, 0, MURO_PAG_BATCH, muro);
    muroSt = st;
    if (!st.conv) await medirImagenes(images, 6000);
    pend = 0; // sin temporizador de medición: ahora se convierte, no se mide
    log("capítulo " + ch.num + " listo: " + images.length + " páginas, " + st.conv + " dibujables, " + st.neg + " negadas"
      + (st.grande.length ? ", " + st.grande.length + " muy grandes" : ""));
  } else {
    await medirImagenes(images, 9000);
    pend = images.filter((im) => !(im.w > 0 && im.h > 0)).length;
    log("capítulo " + ch.num + " listo: " + images.length + " páginas, " + pend + " sin medir");
  }
  // v0.4.19 — una vez por hora, el diagnóstico que separa las causas del
  // lector en blanco: ¿el sitio de Mangas.in sirve sus imágenes a un
  // pedido SIN presentarse (como el pintor de pantalla de Kino)? Lo que
  // diga el Registro de ESTA prueba es la evidencia para el reporte.
  if (fSer.id === "mangasin") {
    msDiagPresentacion(fSer, "imagen del capítulo", images[0] && images[0].url);
    msDiagPresentacion(fSer, "portada", (d.meta && d.meta.poster) || msCover(msSlugDe(d.url)));
  }
  // v0.4.28 — ManhwaWeb con el mismo diagnóstico: ¿sus imágenes se
  // sirven a un pedido sin presentarse (el pintor de Kino)? Lo que diga
  // el Registro desde el TELÉFONO decide si el lector puede dibujar o
  // si la ventanita es el camino (desde el servidor de pruebas, el
  // filtro de img1mw/img2mw niega el paso).
  if (fSer.id === "manhwaweb") {
    msDiagPresentacion(fSer, "imagen del capítulo", images[0] && images[0].url, "mwDiag");
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
  // v0.4.53 — el historial también sube a la nube, con FRENO: como
  // máximo una subida cada 15 minutos al abrir capítulos (para no
  // martillar al bot con capítulo tras capítulo); «Sincronizar
  // ahora» y los corazones/reseñas siguen subiendo siempre.
  try {
    if (tgActiva() && Date.now() - Number(getJson("tgTs", 0)) > 900000) await tgSubir();
  } catch (e) { log("sync subir hist: " + ((e && e.message) || e)); }
  const reader = { images: images, idx: idx, tk: Date.now(), pend: pend, fallos: 0 };
  // v0.4.30 — el registro de las páginas que el muro negó (índices
  // chicos): el botón «Bajar más páginas» distingue «todas listas» de
  // «solo quedan las negadas».
  if (muroSt && muroSt.negIdx && muroSt.negIdx.length) reader.mal = muroSt.negIdx;
  // v0.4.31 — las demasiado grandes viajan APARTE (reader.grande):
  // su hueco lo dice honrado y las tandas automáticas las saltan.
  if (muroSt && muroSt.grande && muroSt.grande.length) reader.grande = muroSt.grande;
  // v0.4.23 — tira vertical: «Continuar» reabre el capítulo por la
  // página en la que ibas (la fracción la fue guardando onScroll). A la
  // tira no se le puede ordenar que se desplace a un punto guardado
  // (la receta del lector de las docs lo dice claro), así que el
  // capítulo se abre directamente desde esa página — con un botoncito
  // arriba para volver al principio. Solo con fracción de verdad
  // (12 %) y capítulos de 8 páginas o más; abrir un capítulo a mano
  // (el botón de siempre) empieza en la página 1 como siempre.
  let retomoMsg = "";
  if (retomar && modoLectorEfectivo(images.length) === "tira") {
    const f = tiraLeer(ch.url);
    if (f >= 0.12 && images.length >= 8) {
      let desde = Math.round(f * images.length);
      if (desde >= images.length) desde = images.length - 1;
      if (desde > 0) {
        reader.desde = desde;
        retomoMsg = "Retomado por la pág " + (desde + 1) + " de " + images.length
          + " · toca «Volver a la página 1» arriba para empezar de cero";
      }
    }
  }
  const resp = { state: { reader: reader } };
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
  if (retomoMsg) resp.toast = resp.toast ? retomoMsg + " · " + resp.toast : retomoMsg;
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
    // v0.4.30 — la portada de la serie al almacén (el detalle la
    // dibuja desde ahí; el estado viaja con la URL corta).
    try { await msImgData(meta.poster); } catch (e) { log("MS portada serie: " + ((e && e.message) || e)); }
    meta.totalCaps = s.chapters.length;
    // msSerie ya entrega los capítulos del 1 al más nuevo.
    full = s.chapters.slice(0, TOPE_CAPS_SERIE);
  } else if (f.id === "manhwaweb") {
    const s = await mwSerie(url);
    if (s.aviso) return { toast: s.aviso };
    meta = s.meta;
    // v0.4.29 — la portada de la serie al almacén (el detalle la
    // dibuja desde ahí; el estado viaja con la URL corta).
    try { await mwImgData(meta.poster); } catch (e) { log("MW portada serie: " + ((e && e.message) || e)); }
    meta.totalCaps = s.chapters.length;
    // mwSerie ya entrega los capítulos del 1 al más nuevo.
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
  // v0.4.54 — LO VISTO LLEGA AL PLUGIN: la otra mano de la integración
  // con AniTrack. Si esta serie tiene ids de AniList/MAL (los de
  // MangaDex vienen en meta; las demás series se vinculan en la
  // sección AniList y quedan en "alId:<url>"), se pregunta por la
  // puerta "progress" cuántos capítulos hay leídos HOY en las listas
  // de la persona, y si van MÁS adelantados que el historial local,
  // las marcas ✓ suben hasta ese capítulo (índice absoluto en `full`).
  // Nunca baja lo ya leído aquí; sin AniTrack o sin sesión, solo una
  // línea de Registro (adorno, no error). Caché por serie: 6 h si
  // trajo progreso, 2 h si no (cubre sin-lista y fallos de red).
  try {
    const alVinc = getJson("alId:" + url, null);
    const alId = (meta && meta.anilistId) || (alVinc && alVinc.al) || 0;
    const malId = (meta && meta.malId) || (alVinc && alVinc.mal) || 0;
    if ((alId || malId) && full && full.length) {
      const ahora = Date.now();
      const clave = "alProg:" + url;
      let visto = null;
      let cache = null;
      try { cache = getJson(clave, null); } catch (eC) { cache = null; }
      if (cache && typeof cache === "object" && typeof cache.n === "number"
        && ahora - (cache.ts || 0) < (cache.n > 0 ? 21600000 : 7200000)) {
        visto = cache;
      } else {
        let r = null;
        try {
          r = await kino.plugins.call("anitrack", "progress",
            { title: String((meta && meta.title) || "").slice(0, 200), anilistId: alId, malId: malId });
        } catch (eP) {
          log("anitrack progress: " + ((eP && (eP.message || eP.code)) || eP));
        }
        visto = { ts: ahora, n: (r && r.found && typeof r.progress === "number")
          ? Math.max(0, Math.floor(r.progress)) : 0,
          where: (r && r.where) || "" };
        try { setJson(clave, visto); } catch (eS) { /* almacén lleno */ }
      }
      if (visto && visto.n > 0) {
        // Índice del ÚLTIMO capítulo ascendente con num <= lo visto.
        let idx = -1;
        for (let i = 0; i < full.length; i++) {
          if (Number(full[i].num) <= visto.n) idx = i;
          else break;
        }
        if (idx >= 0) {
          const h = hist();
          const actual = h[url];
          if (!actual || (actual.idx || 0) < idx) {
            h[url] = { url: full[idx].url, num: full[idx].num, idx: idx, ts: Date.now(),
              title: (meta && meta.title) || (actual && actual.title) || "",
              poster: (meta && meta.poster) || (actual && actual.poster) || "" };
            setJson("hist", h);
            syncPushHist();
            log("visto importado de " + (visto.where || "AniList/MAL") + ": «"
              + ((meta && meta.title) || url) + "» hasta cap. " + full[idx].num);
          }
        }
      }
    }
  } catch (ePro) {
    log("anitrack progress (importar): " + ((ePro && ePro.message) || ePro));
  }
  log("serie lista (" + f.nombre + "): " + meta.title + " / " + chapters.length + " de " + capsTotal + " capítulos");
  // Con 0 capítulos también se abre el detalle: ahí explica por qué
  // (serie +18, licenciada o enlaces externos) en vez de un toast seco.
  const resp = { state: { detail: { url: url, meta: meta, chapters: chapters, capStart: 0, capsTotal: capsTotal } } };
  if (conRuta) resp.route = { push: "detail", params: { url: url } };
  return resp;
}













