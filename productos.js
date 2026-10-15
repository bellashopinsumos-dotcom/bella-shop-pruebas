const productos = [
  {
    id: "gel-saturacion-queenigth",
    nombre: "Gel de Saturación Queenigth",
    precio: 15000,
    categoria: "Nail Art",
    subcategoria: "Gel de Saturación",
    marca: "Queenigth",
    imagen: "imagenes/Captura de pantalla 2026-09-10 144809.png",

    referencias: [
      "Rose Gold",
      "Champagne Gold",
      "Gold",
      "Silver"
    ]
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
