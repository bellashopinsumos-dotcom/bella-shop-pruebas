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

/* ===== BUSCADOR ÚNICO BELLA SHOP: UN ARCHIVO, SIN RASTREAR PÁGINAS =====
   Mantiene el diseño existente de la portada.
   inventario.json es la única fuente de existencias y precios.
   Los enlaces llevan a categorías que ya están publicadas, no a rutas inventadas.
*/
(function(){
  "use strict";

  const CATEGORIAS = [
    {nombre:"Esmaltes",url:"esmaltes.html",palabras:"esmalte esmaltes semipermanente semi tradicionales"},
    {nombre:"Muna",url:"muna.html",palabras:"muna"},
    {nombre:"CANM",url:"canm.html",palabras:"canm"},
    {nombre:"Cloe",url:"cloe.html",palabras:"cloe cloy"},
    {nombre:"Latin Nails",url:"latin.html",palabras:"latin"},
    {nombre:"Queenigth",url:"queenigth.html",palabras:"queenigth queenight"},
    {nombre:"Chic's Fashion",url:"chics-fashion.html",palabras:"chics chic fashion"},
    {nombre:"ILU",url:"esmaltes-ilu/index.html",palabras:"ilu"},
    {nombre:"Base y Top Coat",url:"base-top.html",palabras:"base rubber top coat"},
    {nombre:"Geles",url:"geles/geles.html",palabras:"gel geles nail art painting spider metalizado saturado"},
    {nombre:"Polygel",url:"polygel/polygel.html",palabras:"polygel poly gel"},
    {nombre:"Eléctricos",url:"electricos/electricos.html",palabras:"lampara lamparas drill extractor raspacallos electrico uv led"},
    {nombre:"Polvos Acrílicos",url:"polvos-acrilicos/polvos-acrilicos.html",palabras:"polvo acrilico acrilicos"},
    {nombre:"Herramientas",url:"herramientas/index.html",palabras:"herramienta herramientas guillotina imanes cortacuticula pusher repujador"},
    {nombre:"Pinceles",url:"pinceles/index.html",palabras:"pincel pinceles brush liner"},
    {nombre:"Tips y Press On",url:"tips%20y%20press%20on/index.html",palabras:"tips press on uñas postizas"},
    {nombre:"Removedores",url:"removedores/removedores.html",palabras:"removedor quitaesmalte ablandador cuticula callos acetona"},
    {nombre:"Preparadores",url:"preparadores/preparadores.html",palabras:"primer protein bond ultrabond nivelador ph preparador"},
    {nombre:"Líquidos",url:"liquidos.html",palabras:"liquido monomero moldeador"}
  ];
  const normal = valor=>String(valor ?? "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"").toLowerCase()
    .replace(/[^a-z0-9]+/g," ").trim();
  const normalCodigo = valor=>normal(valor).replace(/\s+/g,"");

  function destino(item){
    const t=normal([item.nombre,item.categoria,item.etiquetas].filter(Boolean).join(" "));
    // Primero herramientas: "cortacutícula" no es un removedor.
    if(/cortacuticula|cortauñas|guillotina|alicate|pusher|repujador|tijera|iman|gubia|guiador|corta piedras|pinza|empujador/.test(t))
      return CATEGORIAS[13];
    if(/pincel|brush|kolinsky|liner/.test(t)) return CATEGORIAS[14];
    if(/drill|lampara|extractor|raspacallos electrico|tina electrica|torno/.test(t))
      return CATEGORIAS[11];
    if(/press on|tip\b|tips\b|uñas postizas|molde de uña/.test(t)) return CATEGORIAS[15];
    if(/removedor|quitaesmalte|acetona|ablandador|callos|removedor de cuticula/.test(t))
      return CATEGORIAS[16];
    if(/primer|ultrabond|protein bond|nivelador ph|preparador/.test(t)) return CATEGORIAS[17];
    if(/polygel|poly gel/.test(t)) return CATEGORIAS[10];
    if(/polvo acrilico|acrilico en polvo|acrylic powder/.test(t)) return CATEGORIAS[12];
    if(/base coat|top coat|base rubber|top matte/.test(t)) return CATEGORIAS[8];
    if(/esmalte|semipermanente|ojo de gato|jelly|reflectivo|craquelado/.test(t)){
      if(t.includes("muna")) return CATEGORIAS[1];
      if(t.includes("canm")) return CATEGORIAS[2];
      if(t.includes("cloe")||t.includes("cloy")) return CATEGORIAS[3];
      if(t.includes("latin")) return CATEGORIAS[4];
      if(t.includes("queenigth")||t.includes("queenight")) return CATEGORIAS[5];
      if(t.includes("chic")) return CATEGORIAS[6];
      if(/\bilu\b/.test(t)) return CATEGORIAS[7];
      return CATEGORIAS[0];
    }
    if(/gel|painting|spider|saturado/.test(t)) return CATEGORIAS[9];
    if(/liquido|monomero/.test(t)) return CATEGORIAS[18];
    // No anunciar productos Odoo que aún no tienen una categoría publicada.
    return null;
  }

  function instalar(){
    const buscador=document.getElementById("buscador");
    const panel=document.getElementById("resultados-busqueda");
    if(!buscador||!panel) return; // otras páginas incluyen productos.js sin buscador

    let registros=[],promesa=null,error=false,temporizador=null;
    function cargar(){
      if(promesa) return promesa;
      promesa=fetch("inventario.json",{cache:"no-store"})
        .then(r=>{if(!r.ok) throw Error("Inventario no disponible");return r.json()})
        .then(data=>{
          const base=data.productos ?? data;
          registros=(Array.isArray(base)?base:Object.values(base || {}))
            .filter(p=>p&&Number(p.disponible ?? p.a_la_mano ?? 0)>0)
            .map(p=>({p,href:destino(p),
              texto:normal([p.nombre,p.codigo,p.referencia_interna,p.codigo_barras,p.marca,p.etiquetas].join(" ")),
              codigo:normalCodigo(p.referencia_interna || p.codigo || p.codigo_barras)}))
            .filter(x=>x.href);
          error=false;
          return registros;
        }).catch(e=>{console.warn("Bella Shop buscador:",e); error=true; registros=[];return registros;});
      return promesa;
    }
    const cerrar=()=>{panel.classList.remove("activo");panel.textContent=""};
    function mensaje(texto){
      panel.textContent="";
      const p=document.createElement("div");p.className="sin-sugerencias";p.textContent=texto;
      panel.appendChild(p);panel.classList.add("activo");
    }
    function resultado(nombre,detalle,url,icono){
      const a=document.createElement("a");
      a.className="resultado-busqueda";a.href=url;
      const simbolo=document.createElement("span");simbolo.className="resultado-icono";simbolo.textContent=icono;
      const bloque=document.createElement("span");bloque.className="resultado-texto";
      const titulo=document.createElement("span");titulo.className="resultado-nombre";titulo.textContent=nombre;
      const tipo=document.createElement("span");tipo.className="resultado-tipo";tipo.textContent=detalle;
      bloque.append(titulo,tipo);a.append(simbolo,bloque);
      panel.appendChild(a);
    }
    function buscar(){
      const q=normal(buscador.value);
      if(!q){cerrar();return}
      const palabras=q.split(" ").filter(Boolean);
      const categorias=CATEGORIAS.filter(d=>{
        const texto=normal(d.nombre+" "+d.palabras);
        return palabras.every(p=>texto.includes(p));
      }).slice(0,4);
      const candidatos=registros.filter(x=>palabras.every(p=>x.texto.includes(p))).map(x=>{
        const n=normal(x.p.nombre), ref=normalCodigo(x.p.referencia_interna || x.p.codigo || x.p.codigo_barras);
        let puntos=0;
        if(ref===normalCodigo(q)) puntos+=300;
        if(n===q) puntos+=250;
        if(ref.startsWith(normalCodigo(q))) puntos+=100;
        if(n.startsWith(q)) puntos+=90;
        if(n.includes(q)) puntos+=40;
        return {...x,puntos};
      }).sort((a,b)=>b.puntos-a.puntos || String(a.p.nombre).localeCompare(String(b.p.nombre),"es")).slice(0,8);
      panel.textContent="";
      categorias.forEach(d=>resultado(d.nombre,"Categoría",d.url,"⌕"));
      candidatos.forEach(x=>{
        const p=x.p;
        const ref=p.referencia_interna || p.codigo_barras || p.codigo || "";
        const urlBuscable=["electricos/electricos.html","herramientas/index.html","removedores/removedores.html"].includes(x.href.url);
        const enlace=urlBuscable?x.href.url+"?buscar="+encodeURIComponent(ref||p.nombre):x.href.url;
        resultado(p.nombre || "Producto Bella Shop",
          (ref?"REF. "+ref+" · ":"")+"Disponible · Ver "+x.href.nombre,
          enlace,"♡");
      });
      if(!categorias.length&&!candidatos.length){
        mensaje(error?"No se pudo consultar el inventario. Recarga la página e intenta de nuevo.":
          "No encontramos productos disponibles con esa búsqueda.");
      }else{
        panel.classList.add("activo");
      }
    }

    buscador.addEventListener("focus",()=>{
      if(buscador.value.trim()) buscar();
      cargar().then(()=>{if(document.activeElement===buscador&&buscador.value.trim())buscar()});
    });
    buscador.addEventListener("input",()=>{
      clearTimeout(temporizador);
      if(!buscador.value.trim()){cerrar();return}
      if(!promesa) mensaje("Buscando productos disponibles...");
      temporizador=setTimeout(()=>cargar().then(buscar),120);
    });
    buscador.addEventListener("keydown",e=>{
      if(e.key==="Escape"){cerrar();buscador.blur()}
      if(e.key==="Enter"){
        const primero=panel.querySelector("a.resultado-busqueda");
        if(primero){e.preventDefault();window.location.href=primero.href}
      }
    });
    document.addEventListener("click",e=>{
      if(!e.target.closest(".buscador-contenedor"))cerrar();
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",instalar);
  else instalar();
})();

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