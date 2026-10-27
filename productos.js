/* =========================================================
   ÍNDICE OFICIAL DE PRODUCTOS PUBLICADOS · BELLA SHOP
   Solo se agregan aquí productos que ya tienen una página real
   dentro del catálogo. inventario.json sigue siendo la fuente de
   precio, stock y códigos.
   ========================================================= */
const productosPublicados = [
  {
    id: "muna-12ml-carta-colores",
    nombre: "Esmalte Semipermanente Muna 12 ml",
    categoria: "Esmaltes",
    subcategoria: "Semipermanente",
    marca: "Muna",
    presentacion: "12 ml",
    url: "carta-colores-muna12ml.html",
    referencias: [
      "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15",
      "17","18","19","20","22","24","25","26","27","28","29","30","31","34","35",
      "36","37","38","39","43","45","46","47","48","49","50","51","52","53","54","55",
      "56","57","58","59","60","61","62","63","64","65","66"
    ],
    palabrasClave: [
      "muna","esmalte muna","semipermanente muna","muna 12 ml","muna 12ml","carta de colores muna"
    ]
  }
];

/* ===== LISTADO ANTIGUO: se conserva para no romper funciones existentes ===== */
const productos = [
  {
    id: "gel-saturacion-queenigth",
    nombre: "Gel de Saturación Queenigth",
    precio: 15000,
    categoria: "Nail Art",
    subcategoria: "Gel de Saturación",
    marca: "Queenigth",
    imagen: "imagenes/Captura de pantalla 2026-09-10 144809.png",
    referencias: ["Rose Gold","Champagne Gold","Gold","Silver"]
  }
];

/* ===== LANZAMIENTO ILU · HOME ===== */
(function () {
  function activarLanzamientoILU() {
    const slide = document.querySelector('.hero-slide-ilu');
    if (slide) {
      const small = slide.querySelector('.hero-ilu-copy small');
      const titulo = slide.querySelector('.hero-ilu-copy h2');
      const texto = slide.querySelector('.hero-ilu-copy p');
      const boton = slide.querySelector('.hero-cta');
      if (small) small.textContent = 'NUEVO · ILU × BELLA SHOP';
      if (titulo) titulo.innerHTML = 'Explora lo nuevo<br><em>de ILU</em>';
      if (texto) texto.textContent = 'Descubre los nuevos lanzamientos de ILU en Bella Shop.';
      if (boton) {
        boton.href = 'esmaltes-ilu/';
        boton.textContent = 'EXPLORAR ILU →';
      }
    }

    const puntoILU = document.querySelector('.hero-puntos button[aria-label="Próximamente ILU"]');
    if (puntoILU) puntoILU.setAttribute('aria-label', 'Explora lo nuevo de ILU');

    const teaser = document.querySelector('.ilu-teaser.ilu-minimal');
    if (teaser) {
      const kicker = teaser.querySelector('.ilu-minimal-kicker');
      const texto = teaser.querySelector('p');
      if (kicker) kicker.textContent = 'NUEVO · ILU × BELLA SHOP';
      if (texto) texto.textContent = 'Explora lo nuevo de ILU en Bella Shop.';

      const inner = teaser.querySelector('.ilu-minimal-inner');
      if (inner) {
        inner.style.cursor = 'pointer';
        inner.setAttribute('role', 'link');
        inner.setAttribute('tabindex', '0');
        inner.setAttribute('aria-label', 'Explora lo nuevo de ILU');
        const abrir = function () { window.location.href = 'esmaltes-ilu/'; };
        inner.addEventListener('click', abrir);
        inner.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            abrir();
          }
        });

        if (!inner.querySelector('.ilu-home-cta')) {
          const cta = document.createElement('span');
          cta.className = 'ilu-proximamente ilu-home-cta';
          cta.textContent = 'EXPLORAR ILU →';
          cta.style.marginTop = '18px';
          inner.appendChild(cta);
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activarLanzamientoILU);
  } else {
    activarLanzamientoILU();
  }
})();
