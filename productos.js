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

/* =========================================================
   BUSCADOR GLOBAL · SOLO CONTENIDO PUBLICADO
   ========================================================= */
(function () {
  const paginasPublicadas = [
    /* Esmaltes y cartas */
    "carta-colores-muna12ml.html","fluorescente-muna.html","jelly-muna.html","macarron-muna.html",
    "satin-nail-muna.html","shell-muna.html","ojo-de-gato-muna.html","bases-traslucidas-muna.html",
    "saturado-gel-muna.html","reflectivos-muna.html","craquelados-muna.html",
    "carta-colores-munabb7ml.html","bases-traslucidas-munabb7ml.html",
    "carta-colores-canm.html","ojo-de-gato-canm.html","bases-traslucidas-canm.html","blooming-canm.html",
    "carta-colores-cloe.html","ojo-de-gato-cloe.html","bases-traslucidas-cloe.html",
    "carta-colores-latin.html","ojo-de-gato-latin.html","bases-traslucidas-latin.html",
    "carta-colores-chics-fashion.html","ojo-de-gato-chics-fashion.html","bases-traslucidas-chics-fashion.html","chics-fashion-tradicional.html",
    "carta-colores-queenigth.html","ojo-de-gato-queenigth.html","bases-queenigth.html","vitral-queenigth.html",
    "masglo-bases.html","masglo-brillos.html","masglo-tapa-azul.html","masglo-tapa-negra.html",
    "brescia-bases.html","brescia-brillos.html","brescia-esmaltes.html",

    /* Base y Top */
    "base-coat.html","base-rubber.html","base-rubber-color.html","base-rubber-transparente.html","top-coat.html","top-matte.html",

    /* Geles */
    "geles/geles.html","gel-nail-art/gel-metalizado.html","gel-nail-art/gel-saturacion.html","gel-nail-art/painting-gel.html","gel-nail-art/spider-gel.html","polygel/polygel.html",

    /* Eléctricos */
    "electricos/electricos.html",

    /* Acrílicos */
    "polvos-acrilicos/polvos-acrilicos.html",

    /* Líquidos */
    "liquido-moldeador.html",
    "preparadores/nivelador-ph.html","preparadores/primer.html","preparadores/protein-bond.html",
    "removedores/removedor-gel.html","removedores/removedor-liquido.html","removedores/removedores.html",

    /* ILU: carta/páginas activas */
    "esmaltes-ilu/color-nail-gel.html","esmaltes-ilu/index.html","esmaltes-ilu/esmaltesilu.html",
    "esmaltes-ilu/base-rubber-force.html","esmaltes-ilu/ojo-de-gato.html"
  ];

  const destinos = [
    {nombre:"Esmaltes",url:"esmaltes.html",claves:"esmalte esmaltes"},
    {nombre:"Semipermanentes",url:"semipermanente.html",claves:"semi semis semipermanente semipermanentes"},
    {nombre:"Base y Top Coat",url:"base-top.html",claves:"base bases top top coat"},
    {nombre:"Geles",url:"geles/geles.html",claves:"gel geles gel nail art polygel builder gel construccion construcción painting spider metalizado saturacion"},
    {nombre:"Gel Nail Art",url:"gel-nail-art/gel-nail-art.html",claves:"gel nail art painting spider metalizado saturacion"},
    {nombre:"Polygel",url:"polygel/polygel.html",claves:"polygel moldes molde"},
    {nombre:"Eléctricos",url:"electricos/electricos.html",claves:"electricos electrico lampara drill extractor press"},
    {nombre:"Polvos Acrílicos",url:"polvos-acrilicos/polvos-acrilicos.html",claves:"polvo polvos acrilico acrilicos"},
    {nombre:"Líquidos",url:"liquidos.html",claves:"liquido liquidos"},
    {nombre:"Removedores",url:"removedores/removedores.html",claves:"removedor removedores acetona cuticula callos"},
    {nombre:"Preparadores",url:"preparadores/preparadores.html",claves:"preparador preparadores primer nivelador protein bond ultrabond"},
    {nombre:"Líquido moldeador",url:"liquido-moldeador.html",claves:"liquido moldeador poly smooth"},
    {nombre:"ILU",url:"esmaltes-ilu/color-nail-gel.html",claves:"ilu ojo gato rubber color nail gel"},
    {nombre:"Muna",url:"muna.html",claves:"muna"},
    {nombre:"Queenigth",url:"queenigth.html",claves:"queenigth queenight"},
    {nombre:"Chic’s Fashion",url:"chics-fashion.html",claves:"chics chic fashion"},
    {nombre:"CANM",url:"canm.html",claves:"canm"},
    {nombre:"Cloe",url:"cloe.html",claves:"cloe"},
    {nombre:"Latin",url:"latin.html",claves:"latin"}
  ];

  let indice = [];
  let promesaIndice = null;

  function norm(v){
    return String(v == null ? "" : v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  }
  function limpiarHtml(v){
    return String(v||"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
  }
  function tituloPagina(html,url){
    const h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return limpiarHtml((h1&&h1[1])||(title&&title[1])||url.replace(/\.html$/i,"").replace(/[\/-]+/g," "));
  }
  function extraerRegistros(html,url){
    const salida=[];
    const vistos=new Set();
    const agregar=(nombre,codigo,extra)=>{
      nombre=limpiarHtml(nombre);
      codigo=limpiarHtml(codigo);
      if(!nombre || nombre.length<2) return;
      const k=norm(nombre+" "+codigo+" "+url);
      if(vistos.has(k)) return;
      vistos.add(k);
      salida.push({nombre,codigo,url,busqueda:norm(nombre+" "+codigo+" "+extra+" "+url),tipo:"Producto"});
    };

    const objetos=html.match(/\{[\s\S]{0,1300}?\}/g)||[];
    objetos.forEach(obj=>{
      const n=obj.match(/(?:nombre|name)\s*:\s*["'`]([^"'`]{2,180})["'`]/i);
      const c=obj.match(/(?:codigo|código|ref|referencia|referencia_interna|codigo_barras)\s*:\s*["'`]([^"'`]{1,120})["'`]/i);
      const m=obj.match(/(?:marca)\s*:\s*["'`]([^"'`]{1,100})["'`]/i);
      if(n) agregar(n[1],c?c[1]:"",m?m[1]:"");
    });

    const tarjetas=html.match(/<(?:article|div)[^>]*(?:producto|product-card|tarjeta-producto|card-producto)[^>]*>[\s\S]{0,1800}?<\/(?:article|div)>/gi)||[];
    tarjetas.forEach(t=>{
      const n=t.match(/<(?:h2|h3|h4)[^>]*>([\s\S]*?)<\/(?:h2|h3|h4)>/i);
      const c=t.match(/(?:data-(?:codigo|ref|referencia)|(?:ref(?:erencia)?|código|codigo)\s*[:#-]?)\s*[="']?([A-Z0-9ÑÁÉÍÓÚ._-]{2,40})/i);
      if(n) agregar(n[1],c?c[1]:"",limpiarHtml(t).slice(0,400));
    });

    const titulo=tituloPagina(html,url);
    if(titulo && !/bella shop$/i.test(titulo)) agregar(titulo,"",limpiarHtml(html).slice(0,1800));
    return salida;
  }

  async function cargarPagina(url){
    try{
      const r=await fetch(url,{cache:"force-cache"});
      if(!r.ok) return [];
      const html=await r.text();
      return extraerRegistros(html,url);
    }catch(e){ return []; }
  }

  async function cargarIndice(){
    if(promesaIndice) return promesaIndice;
    promesaIndice=(async()=>{
      const lotes=[];
      const tam=8;
      for(let i=0;i<paginasPublicadas.length;i+=tam){
        const bloque=paginasPublicadas.slice(i,i+tam);
        const datos=await Promise.all(bloque.map(cargarPagina));
        datos.forEach(x=>lotes.push(...x));
      }
      const mapa=new Map();
      lotes.forEach(x=>{
        const k=norm(x.nombre+"|"+x.codigo+"|"+x.url);
        if(!mapa.has(k)) mapa.set(k,x);
      });
      indice=[...mapa.values()];
      return indice;
    })();
    return promesaIndice;
  }

  function score(item,q){
    const palabras=q.split(" ").filter(Boolean);
    if(!palabras.every(p=>item.busqueda.includes(p))) return -1;
    const n=norm(item.nombre), c=norm(item.codigo);
    let s=10;
    if(n===q) s+=100;
    if(c===q) s+=120;
    if(n.startsWith(q)) s+=50;
    if(c.startsWith(q)) s+=60;
    palabras.forEach(p=>{ if(n.includes(p))s+=8; if(c.includes(p))s+=12; });
    return s;
  }

  function esc(v){return String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}

  function instalarBuscador(){
    const input=document.getElementById("buscador");
    const panel=document.getElementById("resultados-busqueda");
    if(!input||!panel) return;

    cargarIndice();

    async function buscar(e){
      e.stopImmediatePropagation();
      const q=norm(input.value);
      if(!q){ panel.classList.remove("activo"); panel.innerHTML=""; return; }
      panel.classList.add("activo");
      panel.innerHTML='<div class="sin-sugerencias">Buscando en los productos publicados...</div>';
      await cargarIndice();
      if(norm(input.value)!==q) return;

      const prod=indice.map(x=>({x,s:score(x,q)})).filter(x=>x.s>=0).sort((a,b)=>b.s-a.s).slice(0,10).map(x=>x.x);
      const cats=destinos.filter(d=>d.claves.split(" ").some(k=>norm(k).includes(q)||q.includes(norm(k)))).slice(0,3);

      const partes=[];
      prod.forEach(p=>partes.push('<a class="resultado-busqueda" href="'+esc(p.url)+'"><span class="resultado-icono">♡</span><span class="resultado-texto"><span class="resultado-nombre">'+esc(p.nombre)+'</span><span class="resultado-tipo">Producto publicado'+(p.codigo?' · '+esc(p.codigo):'')+'</span></span></a>'));
      cats.forEach(c=>partes.push('<a class="resultado-busqueda" href="'+esc(c.url)+'"><span class="resultado-icono">⌕</span><span class="resultado-texto"><span class="resultado-nombre">'+esc(c.nombre)+'</span><span class="resultado-tipo">Categoría</span></span></a>'));
      panel.innerHTML=partes.length?partes.join(""):'<div class="sin-sugerencias">No encontramos ese producto entre los que ya están publicados en la web.</div>';
    }

    input.addEventListener("input",buscar,true);
    input.addEventListener("focus",function(e){ if(norm(input.value)) buscar(e); },true);
    input.addEventListener("keydown",function(e){
      if(e.key==="Escape"){ e.stopImmediatePropagation(); panel.classList.remove("activo"); input.blur(); }
    },true);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",instalarBuscador);
  else instalarBuscador();
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