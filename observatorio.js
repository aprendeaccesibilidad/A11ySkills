(function(){
'use strict';
const {P,S,CASES,getLocal,xss}=window.A11YSKILLS;
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('es-ES').format(n);
const percent=(count,total)=>total?Math.round(1000*count/total)/10:0;
const pct=(a,b)=>b?new Intl.NumberFormat('es-ES',{maximumFractionDigits:1,minimumFractionDigits:1}).format(100*a/b)+' %':'—';
const valid=a=>Array.isArray(a)?a.length>0:a!==undefined&&a!==null&&a!=='';
let source='ejemplo';
let records=window.A11YSKILLS_DATOS_EJEMPLO();
function distribution(id){const q=S(id),vals=records.map(r=>r.p?.[id]).filter(valid),total=vals.length;return {n:total,multi:q.type==='multi',entries:q.options.map(o=>({id:o.key,name:o.label,count:vals.reduce((n,r)=>n+(Array.isArray(r)?r.includes(o.key):r===o.key?1:0),0)})).sort((a,b)=>b.count-a.count)};}
function value(id,k){const q=distribution(id);return [q.entries.find(e=>e.id===String(k))?.count||0,q.n];}
function answeredC(c){return records.filter(r=>r.assess?.[c.id]&&Number.isInteger(Number(r.assess[c.id].decision))).map(r=>r.assess[c.id]);}
function accuracy(list){let right=0,total=0;for(const c of list)for(const v of answeredC(c)){total++;if(Number(v.decision)===c.correct)right++;}return {right,total,rate:percent(right,total)};}
function avgScale(id){const a=records.map(r=>Number(r.p?.[id])).filter(Number.isInteger);return a.length?{value:a.reduce((x,y)=>x+y+1,0)/a.length,n:a.length}:null;}
function summary(){const n=records.length,p=distribution('P05'),active=((p.entries.find(e=>e.id==='0')?.count||0)+(p.entries.find(e=>e.id==='1')?.count||0)),learning=distribution('P12'),trained=learning.n-(learning.entries.find(e=>e.id==='14')?.count||0),general=accuracy(CASES.filter(c=>c.kind==='general')),applied=accuracy(CASES.filter(c=>c.kind==='applied'));return {n,active,activeN:p.n,trained,trainedN:learning.n,general,applied};}
function keyfigure(label,main,desc){return `<article class="metric"><p class="metric-label">${label}</p><strong>${main}</strong><p>${desc}</p></article>`;}
function a11yDescription(rows,n){return rows.map(r=>`${r.name}: ${fmt(r.count)}; ${pct(r.count,n)}`).join('. ');}
function dataTable(rows,n,title,unit='personas'){
 return `<details class="table-toggle"><summary>Consultar tabla de datos de «${xss(title)}»</summary><div class="table-scroller"><table class="chart-table"><caption>${xss(title)}. Base: ${fmt(n)} ${unit}.</caption><thead><tr><th scope="col">Categoría</th><th scope="col">${unit==='personas'?'Personas':'Casos'}</th><th scope="col">Porcentaje</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${xss(r.name)}</th><td class="right">${fmt(r.count)}</td><td class="right">${pct(r.count,n)}</td></tr>`).join('')}</tbody></table></div></details>`;
}
function chartBar({title,subtitle,rows,n,multiple=false,limit=6,compact=false,unit='personas'}){
 if(!n)return `<article class="story-card"><h3>${title}</h3><p class="muted">Todavía no hay datos suficientes para mostrar este gráfico.</p></article>`;
 const shown=rows.slice(0,limit),max=multiple?100:100;
 return `<figure class="story-card ${compact?'compact-chart':''}"><div class="chart-heading"><div><h3>${title}</h3><p>${subtitle}</p></div><span class="sample-pill">n = ${fmt(n)}</span></div><p class="sr-only">${xss(a11yDescription(shown,n))}</p><div class="narrative-bars" aria-hidden="true">${shown.map(row=>`<div class="vbar"><div class="bar-top"><span>${xss(row.name)}</span><strong>${pct(row.count,n)} <small>(${fmt(row.count)})</small></strong></div><div class="bar-rail"><div class="bar-fill" style="width:${Math.min(100,percent(row.count,n))}%"></div></div></div>`).join('')}</div><figcaption>${multiple?'Varias categorías pueden corresponder a una misma persona; los porcentajes pueden superar el 100 % al sumarse.':'Una categoría por persona para esta variable.'} Los valores y recuentos también están disponibles en la tabla.</figcaption>${dataTable(shown,n,title,unit)}</figure>`;
}
function contextSummary(field,dict){
 const values=records.map(r=>r.clientContext?.[field]).filter(v=>typeof v==='string'&&dict.some(d=>d.id===v));
 return {n:values.length,rows:dict.map(d=>({name:d.name,count:values.filter(v=>v===d.id).length}))};
}
function localRecords(){
 const copies=getLocal().map(x=>({...x,p:x.p||x.profile||{}}));
 const mocks=window.A11Y_AUTH?.getDemoRecords?.()||[];
 const merged=new Map();
 for(const record of [...copies,...mocks])merged.set(record.id||record.uid+'_'+record.mode,record);
 return [...merged.values()];
}
function insight(eyebrow,headline,body){return `<article class="insight"><span class="small-eyebrow">${eyebrow}</span><h3>${headline}</h3><p>${body}</p></article>`;}
function draw(){
 const example=source==='ejemplo';
 document.body.dataset.source=example?'ejemplo':'local';
 const status=$('source-status');
 status.innerHTML=example
  ? '<strong>Vista de ejemplo: datos ficticios.</strong> Se muestran 236 participaciones simuladas exclusivamente para visualizar los gráficos. No son resultados de investigación ni datos de personas reales.'
  : `<strong>Participaciones guardadas en este navegador (demo).</strong> ${fmt(records.length)} participación(es) locales o simuladas. No se envían datos a ningún servidor ni son estadísticas públicas.`;
 $('data-view-label').textContent=example?'Vista de ejemplo · Datos ficticios, no resultados reales':'Demostración: participaciones guardadas en este navegador';
 const info=summary(),n=info.n;
 const noData=n===0; $('metrics').innerHTML= noData?'<div class="empty-message">Todavía no hay respuestas disponibles para este observatorio. Puedes completar el cuestionario y, si lo decides, guardar una respuesta en este navegador. Las estadísticas públicas se habilitarán cuando haya datos de investigación validados.</div>':[
 keyfigure('Participaciones',fmt(n),'Número de registros del conjunto seleccionado'),
 keyfigure('La accesibilidad es principal o importante',pct(info.active,info.activeN),`Sobre ${fmt(info.activeN)} respuestas a responsabilidades`),
 keyfigure('Declaran vías de aprendizaje',pct(info.trained,info.trainedN),`Sobre ${fmt(info.trainedN)} respuestas sobre formación`),
 keyfigure('Casos WCAG respondidos',fmt(info.applied.total),`Valoraciones de casos; las claves de corrección no están disponibles públicamente`)
 ].join('');
 $('findings').innerHTML=noData?'':insight('Lectura 01','La accesibilidad tiene distintos niveles de presencia','La dedicación puede ser una actividad principal, una responsabilidad compartida o una iniciativa personal; estos perfiles deben interpretarse con su contexto.')+insight('Lectura 02','Formación y práctica no son lo mismo','La autovaloración convive con actividades evaluables. Las respuestas permiten estudiar asociaciones exploratorias, no demostrar que un curso haya causado los resultados.');
 function empty(id){$(id).innerHTML='<p class="notice">No hay datos disponibles para representar este indicador.</p>';}
 if(noData){['chart-profiles','chart-experience','chart-training','chart-knowledge','chart-assess','chart-device'].forEach(empty);return;}
 const p02=distribution('P02'),p03=distribution('P03');
 $('chart-profiles').innerHTML=`<div class="story-layout">${insight('Dónde se sitúan los participantes',`<span class="insight-number">${pct(p02.entries[0].count,p02.n)}</span> tienen alguna actividad en ${xss(p02.entries[0].name.toLowerCase())}`,`Es la actividad declarada más frecuente entre las opciones elegidas. Una persona podía marcar varios ámbitos.`)}${chartBar({title:'Ámbitos de actividad más habituales',subtitle:'Principales ámbitos declarados (selección múltiple)',rows:p02.entries,n:p02.n,multiple:true,limit:6})}</div>${chartBar({title:'Sectores representados',subtitle:'Sector principal en el que se desarrolla la actividad',rows:p03.entries,n:p03.n,limit:6,compact:true})}`;
 const p07=distribution('P07'),p05=distribution('P05'),p11=distribution('P11');
 $('chart-experience').innerHTML=`<div class="two-charts">${chartBar({title:'Experiencia en accesibilidad digital',subtitle:'Años de actividad o estudio, ordenados por frecuencia',rows:p07.entries,n:p07.n,limit:6})}${chartBar({title:'Peso en las responsabilidades',subtitle:'Importancia de la accesibilidad en la actividad actual',rows:p05.entries,n:p05.n,limit:5})}</div>${chartBar({title:'Métodos de evaluación más utilizados',subtitle:'Selección múltiple de técnicas; no es una clasificación de calidad',rows:p11.entries,n:p11.n,multiple:true,limit:6,compact:true})}`;
 const p12=distribution('P12'),p14=distribution('P14');
 $('chart-training').innerHTML=`<div class="story-layout">${insight('Formarse en múltiples espacios',`<span class="insight-number">${pct(info.trained,info.trainedN)}</span> declaran alguna vía de aprendizaje`,`Una persona puede formarse mediante cursos, documentación, comunidad y experiencia laboral simultáneamente.`)}${chartBar({title:'Vías de aprendizaje más frecuentes',subtitle:'Selecciones múltiples; principales seis vías',rows:p12.entries.filter(r=>r.id!=='14'),n:p12.n,multiple:true,limit:6})}</div>${chartBar({title:'Contenidos en los que se ha recibido formación',subtitle:'Áreas temáticas más mencionadas (selección múltiple)',rows:p14.entries.filter(r=>r.id!=='14'),n:p14.n,multiple:true,limit:6,compact:true})}`;
 const p20=distribution('P20'),p22=distribution('P22'),self=avgScale('P20'),confidence=avgScale('P22');
 const scores=[{name:'Conocimiento general autopercibido',v:self?.value,n:self?.n},{name:'Confianza para evaluar criterios',v:confidence?.value,n:confidence?.n}];
 $('chart-knowledge').innerHTML=`<div class="two-charts"><article class="story-card"><h3>Autoevaluación y confianza</h3><p class="muted">Medias descriptivas en escala de 1 a 5</p>${scores.map(s=>`<div class="scale-metric"><span>${s.name}</span><strong>${s.v?.toFixed(1).replace('.',',')||'—'} / 5</strong><div class="scale-track" aria-hidden="true"><span style="width:${s.v?s.v*20:0}%"></span></div><small class="muted">n = ${fmt(s.n||0)} · Indicador declarado, no medido</small></div>`).join('')}<p class="fineprint">Los valores aparecen también como texto, no únicamente como barras.</p></article>${chartBar({title:'Distribución del conocimiento autopercibido',subtitle:'Escala de cinco categorías',rows:p20.entries,n:p20.n,limit:5})}</div>`;
 const completed=CASES.filter(c=>c.kind==='applied').flatMap(c=>answeredC(c));
 const confidenceValues=completed.map(x=>Number(x.confidence)).filter(x=>Number.isFinite(x)&&x>=1&&x<=5);
 const confMean=confidenceValues.length?confidenceValues.reduce((a,b)=>a+b,0)/confidenceValues.length:0;
 const answerLabels=['Falla','Pasa','Información insuficiente','No lo sé'];
 const decisions=completed.filter(x=>Number.isInteger(Number(x.decision))&&Number(x.decision)>=0&&Number(x.decision)<=3);
 const decisionRows=answerLabels.map((name,i)=>({name,count:decisions.filter(x=>Number(x.decision)===i).length}));
 $('chart-assess').innerHTML=`<div class="two-charts"><article class="story-card"><h3>Casos WCAG respondidos</h3><p class="muted">${fmt(decisions.length)} decisiones registradas en el conjunto seleccionado. No se publica una puntuación de aciertos sin corrección validada por el equipo investigador.</p><p><strong>Confianza declarada:</strong> ${confidenceValues.length?confMean.toFixed(1).replace('.',',')+' / 5':'sin datos'} (n = ${fmt(confidenceValues.length)}).</p></article>${chartBar({title:'Decisiones declaradas',subtitle:'Respuestas elegidas; no representan corrección ni conformidad real',rows:decisionRows,n:decisions.length,limit:4,unit:'casos'})}</div>`;
 // Los dispositivos/navegadores se agrupan por participación, no por persona.
 const dev=contextSummary('device',[{id:'movil',name:'Móvil'},{id:'ordenador',name:'Ordenador'},{id:'tableta',name:'Tableta'}]);
 const br=contextSummary('browser',[{id:'Chrome',name:'Google Chrome'},{id:'Safari',name:'Safari'},{id:'Firefox',name:'Firefox'},{id:'Edge',name:'Microsoft Edge'},{id:'Opera',name:'Opera'},{id:'Otro',name:'Otro navegador'}]);
 $('chart-device').innerHTML=chartBar({title:'Dispositivos de participación',subtitle:'Clasificación automática orientativa al enviar el cuestionario',rows:dev.rows,n:dev.n,limit:3,unit:'participaciones'})+chartBar({title:'Navegadores utilizados',subtitle:'Familia de navegador; no se almacena el user-agent completo',rows:br.rows,n:br.n,limit:6,unit:'participaciones'});

}
function topicChart(rows){return `<figure class="story-card topic-chart"><div class="chart-heading"><div><h3>Comprensión por tipo de situación</h3><p>Porcentaje de valoraciones correctas por temática</p></div><span class="sample-pill">${rows.length} temáticas</span></div><p class="sr-only">${xss(rows.map(r=>`${r.name}: ${fmt(r.count)} de ${fmt(r.n)}; ${r.rate} %`).join('. '))}</p><div class="narrative-bars" aria-hidden="true">${rows.map(r=>`<div class="vbar"><div class="bar-top"><span>${xss(r.name)}</span><strong>${new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(r.rate)} % <small>(n = ${fmt(r.n)})</small></strong></div><div class="bar-rail"><div class="bar-fill" style="width:${r.rate}%"></div></div></div>`).join('')}</div><figcaption>El porcentaje de cada tema se calcula sobre sus propias valoraciones. La tabla recoge los aciertos y el tamaño de muestra de cada temática.</figcaption><details class="table-toggle"><summary>Consultar tabla de tasas de acierto por temática</summary><div class="table-scroller"><table class="chart-table"><caption>Resultados de comprensión aplicada por temática</caption><thead><tr><th scope="col">Temática</th><th scope="col">Aciertos</th><th scope="col">Valoraciones</th><th scope="col">Acierto</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${xss(r.name)}</th><td>${fmt(r.count)}</td><td>${fmt(r.n)}</td><td>${new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(r.rate)} %</td></tr>`).join('')}</tbody></table></div></details></figure>`;}
document.querySelectorAll('input[name="dataset"]').forEach(control=>control.addEventListener('change',()=>{
 if(!control.checked)return;
 source=control.value;
 records=source==='ejemplo'?window.A11YSKILLS_DATOS_EJEMPLO():localRecords();
 draw();
}));
 draw();
})();
