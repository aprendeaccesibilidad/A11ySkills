/* Datos totalmente sintéticos para enseñar el diseño del observatorio.
   Nunca se guardan en localStorage ni se mezclan con participaciones reales. */
(function(){
'use strict';
const {getCases}=window.A11YSKILLS;
function aleatorioConSemilla(semilla){
 return function(){let t=semilla+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
}
function crearDatosDeEjemplo(cantidad=236){
 const r=aleatorioConSemilla(20261119);
 const elegir=(pesos)=>{let x=r()*pesos.reduce((a,b)=>a+b,0);for(let i=0;i<pesos.length;i++){x-=pesos[i];if(x<0)return String(i);}return String(pesos.length-1);};
 const multiples=(pesos,min,max)=>[...new Set(Array.from({length:min+Math.floor(r()*(max-min+1))},()=>elegir(pesos)))];
 const limitar=(n,a,b)=>Math.max(a,Math.min(b,n));
 const datos=[];
 for(let i=0;i<cantidad;i++){
   const p={},tipo=r()<.62?'expres':'completo';
   const trayectoria=Number(elegir([12,22,30,17,10,5,4]));
   const nivel=limitar(Math.round(trayectoria/1.4+(r()-.48)*2.2),0,4);
   const estudiante=r()<.15,docente=r()<.15;
   p.P01=[...(estudiante?['0']:[]),...(!estudiante||r()<.2?['1']:[]),...(docente?['2']:[])];
   p.P02=multiples([17,24,23,7,8,9,11,1],1,2);
   p.P03=elegir([25,20,24,15,7,8,1]);
   p.P04=r()<.04?['8']:multiples([19,22,19,10,7,11,8,4,0],1,4);
   p.P05=elegir([21,34,23,17,5]);
   p.P06=r()<.82?'0':'1';
   p.P07=String(trayectoria);
   p.P08=elegir([13,18,25,21,17,6]);
   p.P09=elegir([20,20,25,17,12,6]);
   p.P10=elegir([10,19,26,26,13,6]);
   p.P11=r()<.04?['7']:multiples([27,20,24,22,14,11,17,0],1,4);
   p.P12=r()<.06?['14']:multiples([17,20,9,7,17,10,8,5,15,15,12,8,9,13,0,1],2,5);
   if(!p.P12.includes('14'))p.P13=p.P12[Math.floor(r()*p.P12.length)];
   p.P14=p.P12.includes('14')?['14']:multiples([15,19,16,15,13,15,12,11,8,7,10,7,8,10,0],2,6);
   p.P15=p.P12.includes('14')?['6']:multiples([16,19,23,13,9,9,0],1,3);
   p.P16=p.P12.includes('14')?['9']:multiples([12,19,23,17,15,14,10,8,13,0,2],1,5);
   p.P17=p.P12.includes('14')?'9':elegir([6,11,14,21,9,8,15,9,5,2]);
   p.P18=r()<.38?['8']:multiples([8,5,3,4,14,17,20,16,0,8],1,2);
   p.P19=multiples([25,15,20,14,19,5,2],1,3);
   p.P20=String(nivel);
   p.P21=String(limitar(nivel+(r()<.18?1:0),0,4));
   p.P22=String(limitar(nivel-(r()<.25?1:0),0,4));
   p.P23=elegir([4,10,21,28,24,8,5]);
   p.P24=elegir([5,12,25,28,20,7,3]);
   const evaluaciones={};
   for(const caso of getCases(tipo)){
     const opciones=caso.kind==='general'?4:4;
     evaluaciones[caso.id]={decision:Math.floor(r()*opciones),confidence:caso.kind==='applied'?1+Math.floor(r()*5):null,difficulty:caso.kind==='applied'?1+Math.floor(r()*5):null};
   }
   if(tipo==='expres'){
     const incluidas=new Set(['P01','P02','P05','P07','P08','P12','P20','P22','P23','P24']);
     for(const id of Object.keys(p))if(!incluidas.has(id))delete p[id];
   }
   const device=elegir([48,43,9]);const browser=elegir([55,23,12,7,2,1]);
   datos.push({clientContext:{device:['movil','ordenador','tableta'][Number(device)],browser:['Chrome','Safari','Firefox','Edge','Opera','Otro'][Number(browser)]},id:'sintetico-'+String(i+1).padStart(3,'0'),mode:tipo,origin:'datos-sinteticos',p,assess:evaluaciones,synthetic:true});
 }
 return datos;
}
window.A11YSKILLS_DATOS_EJEMPLO=crearDatosDeEjemplo;
})();
