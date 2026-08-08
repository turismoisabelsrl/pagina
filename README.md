# Turismo Isabel — sitio web (v5)

Sitio de una sola página en HTML/CSS/JS puro (sin frameworks, sin build step),
listo para publicar en GitHub Pages.

## Estructura

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── logo-icon.png
    ├── hero-bg.jpg
    ├── sprinter.png
    └── minibus.png
```

## Datos ya cargados

- **WhatsApp**: `+54 9 11 5182-1276` → en los links se usa el formato
  `5491151821276` (el `9` después del `54` es necesario para que los links
  `wa.me` abran el chat correctamente en números argentinos). Si al probar
  el link no te abre el chat esperado, es el primer lugar para revisar.
- **Email de reservas/contacto**: `turismoisabelreservas@gmail.com` (hero y
  sección Contacto).
- **Email de RR.HH.**: `turismoisabelrrhh@gmail.com` (botón "Enviar mi CV"
  en Postulaciones).
- **Instagram**: `instagram.com/turismoisabel_`
- **LinkedIn**: apunta al aviso de la búsqueda de conductor
  (`ar.linkedin.com/jobs/view/conductor-profesional-at-turismo-isabel-srl-4259895015`).
  Si más adelante tenés una página de empresa en LinkedIn, se puede cambiar
  ese link en la sección Contacto.
- **Facebook** (`facebook.com/turismoisabel`) sigue siendo un placeholder —
  reemplazarlo por el real cuando lo tengas (aparece en el hero y en
  Contacto).

## Formulario de cotización — Google Forms

El `<form id="quoteForm">` en `index.html` postea directo al endpoint
`/formResponse` del Google Form (mismo formulario que ya usaban en la
página anterior). Como Google Forms no permite `fetch()` desde otro
dominio, el envío se hace con la técnica de **iframe oculto**:
el `<form>` tiene `target="hidden_iframe"`, hay un `<iframe id="hidden_iframe">`
oculto justo después del formulario, y `main.js` escucha el evento `load`
de ese iframe para mostrar el mensaje de confirmación sin recargar la
página.

Cada campo tiene un `name="entry.XXXXXXXXX"` que corresponde a una
pregunta puntual del Google Form. Si en algún momento agregás, sacás o
reordenás preguntas en el Google Form, los `entry.XXXXXXXXX` pueden
cambiar — para encontrar el nuevo ID de una pregunta, abrí el formulario
en modo edición → ⋮ → **"Obtener enlace con datos precompletados"**,
completá cualquier valor de prueba en esa pregunta y generá el enlace: el
ID aparece en la URL generada como `entry.XXXXXXXXX=...`.

Como Google no responde con permisos CORS, el sitio no puede confirmar de
forma 100% certera que el envío llegó (asumimos éxito apenas el iframe
termina de cargar, que es el mismo comportamiento que tenía la página
anterior). Si en el futuro querés una confirmación más confiable, la
alternativa es migrar a un servicio como Formspree, que sí devuelve una
respuesta que se puede leer desde el JS.

## Otras notas

- **Fotos de la flota** — son las fotos reales de las unidades
  (`assets/sprinter.png` y `assets/minibus.png`), sin tratamiento duotono.
  Si sumás unidades a la flota, agregá una `<article class="fleet-card">`
  más dentro de `.fleet-grid` en `index.html`, siguiendo la misma
  estructura (foto + marca/modelo + lista de specs).

## Qué cambió en esta versión (v5)

- **Formulario de cotización**: se reemplazó Formspree por el Google Form
  que ya venían usando (mismo endpoint y mismas preguntas que la página
  anterior), enviado vía iframe oculto en lugar de `fetch`. Todos los
  campos ahora son obligatorios excepto Notas, igual que en el formulario
  original.
- **Ícono "Mesa operativa"**: se cambió por uno de mesa con una carpeta o
  planilla encima, para que se lea más claro como mesa de trabajo del
  guía (antes parecía una escalera).
- **WhatsApp, Instagram, LinkedIn y emails**: reemplazados por los datos
  reales (ver arriba).

<details>
<summary>Historial — v4</summary>

- **Hero**: los dos botones y los 4 íconos de redes ahora comparten una sola
  fila (botones a la izquierda, barra divisoria en el medio, íconos a la
  derecha) en vez de quedar apilados en dos filas. En mobile se apilan
  igual que antes.
- **Fondo del hero con parallax**: la foto de fondo ahora se desplaza
  levemente hacia abajo a medida que scrolleás, así se va "escondiendo"
  detrás de la ola en vez de cortarse seco. Respeta
  `prefers-reduced-motion`.
- **Menos aire arriba de "Nuestra Flota"**: se acortó el padding inferior
  del hero y el padding superior de la sección Flota.
- **PNGs de las unidades más grandes**: el marco de la foto pasó de 16:9 a
  4:3 y se redujo el padding interno, así las combis se ven más grandes
  dentro de la tarjeta.
- **Íconos de specs más claros**: "AA y calefacción" ahora usa un copo de
  nieve (antes era una cruz poco clara) y "Mesa operativa" usa una mesa
  simple (antes parecía una carpeta/documento).
- **Ola entre Habilitaciones y Cotización**: Habilitaciones pasó a un tono
  papel apenas más frío (`--paper-alt`) para que la ola divisoria hacia
  Cotización se note.
- **Tipografía menos rígida**: "Mercedes-Benz"/"Iveco" (tarjetas de flota) y
  los títulos "Ubicación"/"Horarios de atención" (footer) dejaron la
  mono/uppercase y pasaron a la itálica `Fraunces` del resto de la marca.
- **Ola del menú mobile corregida**: el `clip-path` del panel lateral ahora
  se calculó a partir de la misma curva Bézier de las olas del sitio (antes
  era una aproximación a mano poco prolija), para que se vea suave y
  consistente con el resto del sitio.

<details>
<summary>Historial — v3</summary>

- **Fotos reales**: se reemplazaron el fondo del hero y las fotos de la
  flota por las fotos reales provistas (`hero-bg.jpg`, `sprinter.png`,
  `minibus.png`), y el logo por el archivo definitivo (`logo-icon.png`).
- **Hero simplificado**: se sacaron el eyebrow y el párrafo largo; ahora
  solo queda logo, título, los dos botones (Solicitar cotización / Atención
  Comercial) y los 4 íconos de redes (WhatsApp, Instagram, Facebook, mail).
- **Flota**: se sacó el tratamiento duotono (era para disimular la baja
  resolución de las capturas viejas) — las fotos nuevas se muestran limpias,
  sobre un fondo degradado de marca con sombra de piso.
- **"Trayectoria" eliminada**: se sacó del menú y se borró la sección
  completa (carrusel de logos incluido).
- **Postulaciones**: se corrigió un bug de superposición — la ola
  decorativa del fondo de la sección era más alta que el padding inferior,
  así que tapaba el botón "Enviar mi CV". Ahora tiene una ola más fina y
  más aire debajo del contenido.
- **Pie de página**: el texto (ubicación, horarios, copyright) pasó de
  `Inter` a `Fraunces` itálica, en línea con la tipografía elegante del
  resto del sitio.

<details>
<summary>Historial — v2</summary>

- **Tipografía de marca**: "Turismo Isabel" ahora usa `Monotype Corsiva`
  (si el dispositivo la tiene instalada, típico en Windows) con `Playball`
  de Google Fonts como respaldo web. El ícono del logo ahora usa
  `object-fit: contain`, sin recortes.
- **Eyebrows** (mini-títulos) pasaron de mono/uppercase a `Fraunces` itálica
  liviana, en línea con el resto de la tipografía serif del sitio.
- **Botón del hero**: "Hablar por WhatsApp" → "Atención Comercial".
- **Escala**: convertí el grosor de la maquetación a `rem` (con un
  contenedor `max-width` central), así se ve consistente a 100% de zoom
  tanto en pantallas chicas como en monitores grandes.
- **Menú mobile**: en vez de un panel rectangular, el borde superior sigue
  la misma curva del isologo (`clip-path` calcado del wave divider) — el
  panel "baja" con esa ola en vez de un corte recto.
- **"Aliados" → "Trayectoria"**: renombrado, con un carrusel de logos
  animado (removido en v3, ver arriba).
- **Formulario de cotización**: campos nuevos — Nombre, Email, Celular,
  Fecha, Origen (exacto), Destino (exacto), Horario de ida, Horario de
  vuelta, Pasajeros, Notas — enviado por Formspree en vez del deep-link de
  WhatsApp de la versión anterior.
- **Sección Contacto** (nueva, antes del footer): íconos de redes
  minimalistas (IG/FB/LI en trazo fino), botón de WhatsApp destacado y mail
  de contacto.
- **Sección Postulaciones** (nueva, banner compacto): "Sumate a nuestro
  equipo" con botón `mailto:` y asunto prearmado
  "Postulación Chofer - Turismo Isabel".
- **Flota**: tarjetas con bordes mucho más redondeados, sombra suave e
  íconos de estilo thin-line (antes eran rellenos).
- **Habilitaciones**: contenido centrado y con menos espacio vacío arriba.

</details>

</details>

</details>

## Deploy a GitHub Pages

1. Subí esta carpeta completa a un repo, rama `main`:
   ```bash
   git init
   git add .
   git commit -m "Sitio Turismo Isabel v5"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. **Settings → Pages → Source** → rama `main`, carpeta `/ (root)`.
3. URL del tipo `https://<tu-usuario>.github.io/<tu-repo>/` en unos minutos.
4. Para el dominio propio `turismoisabel.com.ar`: **Settings → Pages →
   Custom domain**, y en tu DNS un registro `A` a las IPs de GitHub Pages
   (o `CNAME` si es subdominio) — GitHub te muestra los valores exactos ahí.
