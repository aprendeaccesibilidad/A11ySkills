/* Casos de estudio A11ySkills v20. Sin soluciones ni criterios internos. */
window.A11YSKILLS_CASES_V20=[
  {
    "id": "A1",
    "kind": "applied",
    "title": "Panel de ventas",
    "stem": "En un panel de ventas de enero a junio de 2026, el gráfico representa seis valores y una caída puntual en abril. No se muestra más información.",
    "code": "<section aria-labelledby=\"ventas-titulo\">\n  <h2 id=\"ventas-titulo\">Ventas enero–junio de 2026</h2>\n  <img src=\"ventas-semestrales.png\" alt=\"Gráfico de ventas\">\n</section>",
    "previewImage": "assets/casos-v20/01-a1.png",
    "previewAlt": "Captura de interfaz ficticia: Panel de ventas"
  },
  {
    "id": "B2",
    "kind": "applied",
    "title": "Eliminar del carrito",
    "stem": "Una persona pulsa «Eliminar del carrito», desplaza el puntero fuera del botón y después suelta. La eliminación se ejecuta solo en click, de modo que el producto permanece en el carrito.",
    "code": "<article id=\"articulo-17\">\n  <h2>Cuaderno de notas A5</h2>\n  <p>Precio: 12,90 €</p>\n  <button id=\"eliminar-17\" type=\"button\">Eliminar del carrito</button>\n</article>\n<p id=\"estado\" role=\"status\"></p>\n<script>\nconst boton = document.querySelector('#eliminar-17');\nboton.addEventListener('click', () => {\n  document.querySelector('#articulo-17').remove();\n  document.querySelector('#estado').textContent = 'Producto eliminado del carrito.';\n});\n</script>",
    "previewImage": "assets/casos-v20/02-b2.png",
    "previewAlt": "Captura de interfaz ficticia: Eliminar del carrito"
  },
  {
    "id": "A2",
    "kind": "applied",
    "title": "Infografía sobre compostaje doméstico",
    "stem": "Una guía municipal explica mediante una infografía cuatro etapas del compostaje doméstico. Junto a la imagen se ofrecen los pasos en una lista ordenada con la misma información esencial, de modo que es posible comprender el proceso sin ver la ilustración.",
    "code": "<section aria-labelledby=\"compost-titulo\">\n  <h2 id=\"compost-titulo\">Compostaje doméstico</h2>\n  <img src=\"compostaje.png\"\n       alt=\"Proceso de compostaje; pasos descritos a continuación\">\n  <ol>\n    <li>Separar los restos vegetales de cocina.</li>\n    <li>Mezclar con hojas y cartón seco.</li>\n    <li>Airear la mezcla periódicamente.</li>\n    <li>Utilizar el compost cuando haya madurado.</li>\n  </ol>\n</section>",
    "previewImage": "assets/casos-v20/03-a2.png",
    "previewAlt": "Captura de interfaz ficticia: Infografía sobre compostaje doméstico"
  },
  {
    "id": "B1",
    "kind": "applied",
    "title": "Enviar una incidencia de alumbrado público",
    "stem": "En una web municipal, una persona informa de una farola averiada. Al presionar «Enviar incidencia» con el ratón o el dedo, la solicitud se registra inmediatamente mediante pointerdown, antes de soltar. Salir del botón durante la pulsación no evita el envío, que no puede deshacerse; la activación al presionar no es esencial.",
    "code": "<form id=\"incidencia\">\n  <label for=\"ubicacion\">Ubicación</label>\n  <input id=\"ubicacion\" value=\"Calle del Olmo, 18\">\n  <label for=\"detalle\">Descripción</label>\n  <textarea id=\"detalle\">Farola averiada</textarea>\n  <button id=\"enviar-incidencia\" type=\"button\">\n    Enviar incidencia\n  </button>\n</form>\n<script>\n  const boton = document.querySelector('#enviar-incidencia');\n  const enviar = () => registrarIncidenciaSinDeshacer();\n  boton.addEventListener('pointerdown', enviar);\n  boton.addEventListener('click', e => {\n    if (e.detail === 0) enviar(); // Activación por teclado\n  });\n</script>",
    "previewImage": "assets/casos-v20/04-b1.png",
    "previewAlt": "Captura de interfaz ficticia: Enviar una incidencia de alumbrado público"
  },
  {
    "id": "RTF-322-02",
    "kind": "applied",
    "title": "Seleccionar jornada en una solicitud de empleo",
    "stem": "En un portal de empleo, una persona ha introducido su nombre y correo en un formulario. Al cambiar el selector «Tipo de jornada» de completa a parcial, la web la redirige automáticamente a otra página y se pierden los datos escritos. Antes del selector no se informa de que modificarlo provocará ese cambio de contexto.",
    "code": "<form id=\"candidatura\">\n  <label for=\"nombre\">Nombre</label>\n  <input id=\"nombre\" value=\"Claudia Navarro\">\n  <label for=\"jornada\">Tipo de jornada</label>\n  <select id=\"jornada\">\n    <option value=\"completa\">Jornada completa</option>\n    <option value=\"parcial\">Media jornada</option>\n  </select>\n</form>\n<script>\n  document.querySelector('#jornada')\n    .addEventListener('change', e => {\n      location.href='/empleos/jornada/'+e.target.value;\n    });\n</script>\n<!-- No hay aviso previo del cambio de contexto -->",
    "previewImage": "assets/casos-v20/05-rtf-322-02.png",
    "previewAlt": "Captura de interfaz ficticia: Seleccionar jornada en una solicitud de empleo"
  },
  {
    "id": "RTF-133-02",
    "kind": "applied",
    "title": "Recoger un paquete en una taquilla automática",
    "stem": "Una persona recibe un aviso para recoger un paquete en una estación de taquillas automáticas. La página indica «Selecciona Abrir taquilla B12 para retirar tu pedido». El control muestra exactamente ese nombre.",
    "code": "<h1>Retira tu pedido</h1>\n<p>Selecciona «Abrir taquilla B12»\n   para retirar tu paquete.</p>\n<section aria-labelledby=\"taquilla\">\n  <h2 id=\"taquilla\">Taquilla B12</h2>\n  <p>Estación Centro · Planta 0</p>\n  <button type=\"button\">Abrir taquilla B12</button>\n</section>",
    "previewImage": "assets/casos-v20/06-rtf-133-02.png",
    "previewAlt": "Captura de interfaz ficticia: Recoger un paquete en una taquilla automática"
  },
  {
    "id": "C1",
    "kind": "applied",
    "title": "Nueva transferencia",
    "stem": "Una persona prepara una transferencia de 1.200 €. Pulsar «Enviar transferencia ahora» la ejecuta definitivamente, sin validación con corrección, revisión previa ni posibilidad de deshacer.",
    "code": "<h1>Nueva transferencia</h1>\n<form action=\"/transferencias/ejecutar\" method=\"post\">\n  <label for=\"cuenta\">Cuenta de destino (IBAN)</label>\n  <input id=\"cuenta\" name=\"cuenta\" value=\"ES•• •••• 4567\">\n  <label for=\"importe\">Importe (€)</label>\n  <input id=\"importe\" name=\"importe\" value=\"1200,00\">\n  <label for=\"concepto\">Concepto</label>\n  <input id=\"concepto\" name=\"concepto\" value=\"Reserva de alquiler\">\n  <button type=\"submit\">Enviar transferencia ahora</button>\n</form>\n<!-- El servidor ejecuta sin comprobación con corrección,\n     revisión ni reversión. -->",
    "previewImage": "assets/casos-v20/07-c1.png",
    "previewAlt": "Captura de interfaz ficticia: Nueva transferencia"
  },
  {
    "id": "RTF-131-01",
    "kind": "applied",
    "title": "Ver el Calendario de Talleres",
    "stem": "Una biblioteca pública muestra su programación de talleres agrupada por días. Visualmente cada fecha es un encabezado y debajo aparecen las actividades de esa jornada. En el HTML las fechas son encabezados reales y los talleres de cada fecha se organizan en listas. La información esencial sobre cada sesión también aparece como texto.",
    "code": "<section aria-labelledby=\"talleres-titulo\">\n  <h2 id=\"talleres-titulo\">Talleres de marzo</h2>\n  <h3>Miércoles 4 de marzo</h3>\n  <ul>\n  <li>Introducción al móvil · 10:00</li>\n  <li>Trámites digitales · 12:00</li>\n  </ul>\n  <h3>Jueves 5 de marzo</h3>\n  <ul><li>Seguridad en Internet · 11:00</li></ul>\n</section>",
    "previewImage": "assets/casos-v20/08-rtf-131-01.png",
    "previewAlt": "Captura de interfaz ficticia: Ver el Calendario de Talleres"
  },
  {
    "id": "RTF-211-01",
    "kind": "applied",
    "title": "Elegir una butaca en un cine",
    "stem": "En la reserva online de un cine, los asientos libres se representan con rectángulos SVG. Al pulsar con ratón sobre uno, se selecciona y se habilita «Continuar». Ningún asiento recibe foco con Tab ni responde a Enter o Espacio, y no existe lista ni otro mecanismo alternativo para elegir la butaca mediante teclado.",
    "code": "<svg role=\"img\" aria-label=\"Plano de butacas\">\n  <rect class=\"butaca\" data-asiento=\"A1\"\n    x=\"10\" y=\"10\" width=\"24\" height=\"24\" />\n  <rect class=\"butaca\" data-asiento=\"A2\"\n    x=\"40\" y=\"10\" width=\"24\" height=\"24\" />\n  <rect class=\"butaca\" data-asiento=\"A3\"\n    x=\"70\" y=\"10\" width=\"24\" height=\"24\" />\n</svg>\n<script>\n  document.querySelectorAll('.butaca').forEach(el => {\n  el.addEventListener('click', () =>\n    seleccionarButaca(el.dataset.asiento));\n  });\n</script>",
    "previewImage": "assets/casos-v20/09-rtf-211-01.png",
    "previewAlt": "Captura de interfaz ficticia: Elegir una butaca en un cine"
  },
  {
    "id": "RTF-412-01",
    "kind": "applied",
    "title": "Preguntas frecuentes que se despliegan",
    "stem": "En el portal de una aseguradora, la sección de preguntas frecuentes utiliza botones nativos para desplegar respuestas. Cuando se pulsa «¿Cómo cambio mi póliza?», el panel aparece visualmente, pero el atributo aria-expanded del botón permanece siempre en false. El contenido puede abrirse con teclado, pero la tecnología de apoyo recibe un estado que no corresponde con el mostrado.",
    "code": "<button id=\"faq1\" aria-controls=\"r1\"\n    aria-expanded=\"false\">¿Cómo cambio mi póliza?</button>\n<div id=\"r1\" hidden>Puedes solicitar el cambio…</div>\n<script>\n  const boton = document.querySelector('#faq1');\n  const panel = document.querySelector('#r1');\n  boton.addEventListener('click', () => {\n  panel.hidden = !panel.hidden;\n  // No se actualiza aria-expanded.\n  });\n</script>",
    "previewImage": "assets/casos-v20/10-rtf-412-01.png",
    "previewAlt": "Captura de interfaz ficticia: Preguntas frecuentes que se despliegan"
  },
  {
    "id": "RTF-322-01",
    "kind": "applied",
    "title": "Filtrar resultados sin abandonar la página",
    "stem": "En un buscador de cursos, al cambiar la modalidad «Presencial / En línea», se actualizan automáticamente las tarjetas de resultados y el contador de cursos. No se abre ninguna página o ventana, no cambia el foco ni se modifica el contexto de navegación. Un mensaje de estado anuncia el número de cursos encontrados.",
    "code": "<label for=\"modalidad\">Modalidad</label>\n<select id=\"modalidad\">\n  <option value=\"presencial\">Presencial</option>\n  <option value=\"online\">En línea</option>\n</select>\n<p id=\"cantidad\" role=\"status\">12 cursos encontrados</p>\n<div id=\"resultados\">…</div>\n<script>\n  modalidad.addEventListener('change', () => {\n  actualizarListadoYContadorSinMoverFoco();\n  });\n</script>",
    "previewImage": "assets/casos-v20/11-rtf-322-01.png",
    "previewAlt": "Captura de interfaz ficticia: Filtrar resultados sin abandonar la página"
  },
  {
    "id": "RTF-211-02",
    "kind": "applied",
    "title": "Elegir una hora para una cita médica",
    "stem": "Una persona reserva una visita médica en una web sanitaria. Los horarios disponibles se muestran como botones HTML nativos con su hora visible. La persona puede moverse entre ellos con Tab y activar una franja con Enter o Espacio; la selección actualiza el resumen de la cita, y puede completarse sin ratón.",
    "code": "<h2>Elige una hora disponible</h2>\n<div id=\"horas\">\n  <button type=\"button\" class=\"hora\">09:00</button>\n  <button type=\"button\" class=\"hora\">09:30</button>\n  <button type=\"button\" class=\"hora\">10:00</button>\n</div>\n<p id=\"resumen\">No hay hora seleccionada.</p>\n<script>\n  document.querySelectorAll('.hora').forEach(b => {\n    b.addEventListener('click', () => {\n      document.querySelector('#resumen').textContent =\n        'Hora elegida: '+b.textContent;\n    });\n  });\n</script>\n<!-- Los botones nativos permiten Tab, Enter y Espacio -->",
    "previewImage": "assets/casos-v20/12-rtf-211-02.png",
    "previewAlt": "Captura de interfaz ficticia: Elegir una hora para una cita médica"
  },
  {
    "id": "RTF-133-01",
    "kind": "applied",
    "title": "Elegir un trámite entre varias tarjetas",
    "stem": "En un portal municipal aparecen dos tarjetas, «Solicitar certificado» y «Modificar datos», cada una con un botón cuyo texto es únicamente «Continuar». Para modificar los datos, la única instrucción dice: «Pulsa el botón redondo que está a la derecha de la tarjeta verde». No existe ninguna otra instrucción textual que relacione la acción con su tarjeta.",
    "code": "<p>Para modificar tus datos, pulsa el botón redondo\n   que está a la derecha de la tarjeta verde.</p>\n<div class=\"tarjetas\">\n  <section><h2>Solicitar certificado</h2>\n  <button>Continuar</button></section>\n  <section class=\"verde\"><h2>Modificar datos</h2>\n  <button>Continuar</button></section>\n</div>",
    "previewImage": "assets/casos-v20/13-rtf-133-01.png",
    "previewAlt": "Captura de interfaz ficticia: Elegir un trámite entre varias tarjetas"
  },
  {
    "id": "C2",
    "kind": "applied",
    "title": "Revisar un contrato de alquiler de vehículo",
    "stem": "En una web de alquiler de vehículos, una persona elige un coche, fechas y precio. Antes de formalizar el contrato, se muestra un resumen de los datos y se ofrecen las opciones «Modificar datos» y «Confirmar alquiler». El servidor formaliza el compromiso contractual solo después de la confirmación expresa.",
    "code": "<!-- Primera pantalla: no se firma todavía -->\n<form action=\"/alquiler/revisar\" method=\"post\">\n  <button type=\"submit\">Revisar alquiler</button>\n</form>\n<!-- Segunda pantalla: revisión y corrección -->\n<h1>Revisa tu alquiler</h1>\n<dl>\n  <dt>Vehículo</dt><dd>Turismo urbano</dd>\n  <dt>Fechas</dt><dd>12–15 diciembre</dd>\n  <dt>Precio</dt><dd>189,00 €</dd>\n</dl>\n<form action=\"/alquiler/confirmar\" method=\"post\">\n  <button formaction=\"/alquiler/editar\">Modificar datos</button>\n  <button type=\"submit\">Confirmar alquiler</button>\n</form>\n<!-- El servidor formaliza solo tras confirmar -->",
    "previewImage": "assets/casos-v20/14-c2.png",
    "previewAlt": "Captura de interfaz ficticia: Revisar un contrato de alquiler de vehículo"
  },
  {
    "id": "RTF-131-02",
    "kind": "applied",
    "title": "Consultar los alérgenos de un restaurante",
    "stem": "La carta digital de un restaurante presenta una tabla con platos y alérgenos. La primera fila se distingue visualmente como cabecera mediante color y negrita, pero todas sus celdas se han marcado con td y no existen relaciones de encabezados establecidas mediante th, headers u otro mecanismo",
    "code": "<table class=\"alergenos\">\n  <tr>\n    <td class=\"cab\">Plato</td>\n    <td class=\"cab\">Gluten</td>\n    <td class=\"cab\">Leche</td>\n  </tr>\n  <tr><td>Ensalada</td><td>No</td><td>Sí</td></tr>\n  <tr><td>Pasta</td><td>Sí</td><td>Sí</td></tr>\n  <tr><td>Arroz</td><td>No</td><td>No</td></tr>\n</table>\n<style>\n  .cab {font-weight:bold;background:#e8f4f3}\n</style>\n<!-- Sin <th>, headers ni alternativa equivalente -->",
    "previewImage": "assets/casos-v20/15-rtf-131-02.png",
    "previewAlt": "Captura de interfaz ficticia: Consultar los alérgenos de un restaurante"
  },
  {
    "id": "RTF-412-02",
    "kind": "applied",
    "title": "Guardar un artículo para leer más tarde",
    "stem": "En una revista digital, el botón «Guardar artículo» permite añadir o retirar una noticia de la lista de lectura. Se implementa como botón nativo con aria-pressed; cada activación alterna su valor entre false y true para reflejar exactamente el estado seleccionado o no seleccionado.",
    "code": "<article>\n  <h2>Un futuro más verde para las ciudades</h2>\n  <button id=\"guardar\" type=\"button\"\n          aria-pressed=\"false\">Guardar artículo</button>\n</article>\n<script>\n  const boton = document.querySelector('#guardar');\n  boton.addEventListener('click', () => {\n    const marcado = boton.getAttribute('aria-pressed')==='true';\n    boton.setAttribute('aria-pressed', String(!marcado));\n    actualizarListaDeLectura(!marcado);\n  });\n</script>",
    "previewImage": "assets/casos-v20/16-rtf-412-02.png",
    "previewAlt": "Captura de interfaz ficticia: Guardar un artículo para leer más tarde"
  }
];
