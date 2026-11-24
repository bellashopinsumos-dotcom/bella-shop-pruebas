/* =========================================================
   ÍNDICE OFICIAL DE PRODUCTOS PUBLICADOS · BELLA SHOP
   inventario.json sigue siendo la fuente de precio y stock.
   El buscador global de abajo indexa ÚNICAMENTE páginas que
   realmente existen en el catálogo, evitando productos de Odoo
   que todavía no han sido montados en la web.
   ========================================================= */
const productosPublicados = [];

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

/* El buscador global se administra exclusivamente desde index.html. */

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
      if (boton) { boton.href = 'esmaltes-ilu/'; boton.textContent = 'EXPLORAR ILU →'; }
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
        inner.style.cursor = 'pointer'; inner.setAttribute('role','link'); inner.setAttribute('tabindex','0'); inner.setAttribute('aria-label','Explora lo nuevo de ILU');
        const abrir=function(){window.location.href='esmaltes-ilu/';};
        inner.addEventListener('click',abrir);
        inner.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();abrir();}});
        if(!inner.querySelector('.ilu-home-cta')){const cta=document.createElement('span');cta.className='ilu-proximamente ilu-home-cta';cta.textContent='EXPLORAR ILU →';cta.style.marginTop='18px';inner.appendChild(cta);}
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',activarLanzamientoILU); else activarLanzamientoILU();
})();

/* ===== REORGANIZACIÓN DE CATEGORÍAS · GELES ===== */
(function(){
  function actualizarCategoriasGeles(){
    const carrusel=document.getElementById('carrusel-categorias');
    if(carrusel){
      const tarjetas=[...carrusel.querySelectorAll('.cat-visual')];
      const gelNail=tarjetas.find(x=>x.textContent.trim().includes('Gel Nail Art'));
      const polygel=tarjetas.find(x=>x.textContent.trim().includes('Polygel'));
      const limas=tarjetas.find(x=>x.textContent.trim()==='Limas' || x.textContent.includes('Limas'));
      if(gelNail){
        gelNail.href='geles/geles.html';
        const titulo=gelNail.querySelector('strong');
        if(titulo) titulo.textContent='Geles';
        gelNail.classList.add('cat-geles');
      }
      if(polygel) polygel.remove();
      if(limas) limas.remove();
    }

    const panel=document.getElementById('panel-categorias');
    if(panel){
      [...panel.querySelectorAll('a,span')].forEach(el=>{
        const texto=el.textContent.trim();
        if(texto==='Gel Nail Art'){
          if(el.tagName==='A') el.href='geles/geles.html';
          el.textContent='Geles';
        } else if(texto==='Polygel' || texto==='Limas'){
          el.remove();
        }
      });
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',actualizarCategoriasGeles); else actualizarCategoriasGeles();
})();