/* ============================================================
   PARTIDOS · histórico de datos de partido por atleta (MC LAB)
   Lo leen atleta.html (pestaña "Partidos") e index.html (tarjeta).

   Para añadir un partido nuevo: copia el último bloque de "partidos"
   del atleta, pégalo DESPUÉS (el más reciente va al final) y cambia
   los valores. Cada métrica: {v: valor, p: % respecto al POC, st: ok|warn|bad}
   Claves: dt distancia total · hsr alta intensidad · v28 distancia >28 km/h
           acc aceleraciones · sprint · esf28 esfuerzos >28
           dec deceleraciones · vmax velocidad máx. (km/h) · hmld HMLD
   ============================================================ */
window.PARTIDOS={
  'diego-aguado':{
    // Minutos de partidos anteriores al histórico (solo se conocen los minutos)
    minutosPrevios:[65,102,99,82],
    partidos:[
      {id:'j07',jornada:'J07',partido:'UD Ibiza – RM Castilla',fecha:'viernes 9 oct 2026',min:96,carga:'Alta',
        m:{
          dt:{v:10891,p:101,st:'ok'},
          hsr:{v:598,p:81,st:'bad'},
          v28:{v:59,p:56,st:'bad'},
          acc:{v:35,p:117,st:'ok'},
          sprint:{v:234,p:63,st:'bad'},
          esf28:{v:5,p:71,st:'bad'},
          dec:{v:59,p:109,st:'ok'},
          vmax:{v:31.4,p:95,st:'warn'},
          hmld:{v:3288,p:96,st:'ok'}
        }}
    ]
  }
};
