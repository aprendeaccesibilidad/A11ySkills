/* A11ySkills · simulador local de acceso Google y almacenamiento de participaciones.
   NO realiza autenticación real, NO conecta Firebase, NO envía correos.
   Para el modo real, tras configurar Firebase, restaurar firebase-client-real.js. */
(()=>{
 'use strict';
 const USER_KEY='a11yskills-demo-user-v30';
 const GUEST_KEY='a11yskills-demo-guest-v30';
 const DATA_KEY='a11yskills-demo-data-v30';
 const ST='a11yconf2026',WAVE='T0';
 const accounts=[
  {uid:'mock-google-persona-a',displayName:'Persona de prueba A',email:'demo-a@example.test',isAnonymous:false},
  {uid:'mock-google-persona-b',displayName:'Persona de prueba B',email:'demo-b@example.test',isAnonymous:false}
 ];
 const load=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))??def;}catch{return def;}};
 const save=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
 const store=()=>{const db=load(DATA_KEY,{attempts:{},preferences:{}});db.corrections??={};return db;};
 const ident=(mode,uid,study=ST,wave=WAVE)=>`${study}_${wave}_${mode}_${uid}`;
 let user=load(USER_KEY,null);
 let guestId=load(GUEST_KEY,null);
 if(user&&!accounts.some(a=>a.uid===user.uid)&&!user.isAnonymous)user=null;
 const api={
  enabled:true,isMock:true,user,
  async ensureAnonymous(){
   if(api.user)return api.user;
   if(!guestId){guestId='mock-guest-'+(crypto.randomUUID?.()||('demo'+Date.now().toString(36)+Math.random().toString(36).slice(2)));save(GUEST_KEY,guestId);}
   api.user={uid:guestId,isAnonymous:true,displayName:null,email:null};changed();return api.user;
  },
  async loginGoogle(){
   return new Promise((resolve,reject)=>{
    const dialog=document.createElement('dialog');dialog.className='mock-login-dialog';
    dialog.setAttribute('aria-labelledby','mock-login-title');
    dialog.innerHTML=`<div class="mock-login-inner"><div class="mock-label">SIMULACIÓN · No es Google real</div><h2 id="mock-login-title">Acceder con Google</h2><p>Elige una cuenta ficticia para probar el acceso. No introducirás contraseñas ni enviaremos datos o correos.</p><div class="mock-accounts">${accounts.map((a,i)=>`<button type="button" class="mock-account" data-account="${i}"><span class="mock-avatar" aria-hidden="true">${i?'B':'A'}</span><span><strong>${a.displayName}</strong><small>${a.email}</small></span></button>`).join('')}</div><button type="button" class="button ghost mock-cancel">Cancelar</button></div>`;
    document.body.append(dialog);
    let settled=false;
    function close(){dialog.close();dialog.remove();}
    dialog.addEventListener('click',e=>{
     const choice=e.target.closest('[data-account]');
     if(choice){const a=accounts[Number(choice.dataset.account)];const db=store();
      if(api.user?.isAnonymous||guestId){
       const anonymousUid=api.user?.isAnonymous?api.user.uid:guestId;
       for(const [key,item] of Object.entries(db.attempts)){
        if(item.uid!==anonymousUid)continue;
        const targetKey=ident(item.mode,a.uid,item.studyId,item.wave);
        if(!db.attempts[targetKey]){db.attempts[targetKey]={...item,uid:a.uid,id:targetKey,linkedFromAnonymous:true};delete db.attempts[key];}
       }
       save(DATA_KEY,db);
      }
      api.user={...a};guestId=null;localStorage.removeItem(GUEST_KEY);save(USER_KEY,api.user);changed();settled=true;close();resolve(api.user);return;
     }
     if(e.target.closest('.mock-cancel')){settled=true;close();reject(new Error('Inicio de sesión cancelado.'));}
    });
    dialog.addEventListener('cancel',e=>{e.preventDefault();if(!settled){settled=true;close();reject(new Error('Inicio de sesión cancelado.'));}});
    dialog.showModal();
   });
  },
  async logout(){api.user=null;user=null;localStorage.removeItem(USER_KEY);localStorage.removeItem(GUEST_KEY);guestId=null;changed();},
  async getMyAttempt(mode){if(!api.user)return null;return store().attempts[ident(mode,api.user.uid)]||null;},
  async saveAttempt(data){
   if(!api.user)throw Error('No hay identidad de prueba activa.');
   const db=store(),id=ident(data.mode,api.user.uid,data.studyId,data.wave);
   if(data.mode==='completo' && (api.user.isAnonymous||!db.attempts[ident('expres',api.user.uid)]))throw Error('El completo requiere Google y un Reto Exprés vinculado a esta cuenta.');
   if(db.attempts[id])throw Error('Ya existe una participación inicial para este estudio. Consulta o registra una corrección desde «Mis participaciones»; el primer envío no se sustituye.');
   db.attempts[id]={...structuredClone(data),uid:api.user.uid,id,status:'submitted',submittedAt:new Date().toISOString()};
   save(DATA_KEY,db);return id;
  },
  async saveCorrection(data,originalId){
   if(!api.user||api.user.isAnonymous)throw Error('Para vincular una corrección a tu historial debes acceder con la cuenta Google de prueba.');
   const db=store(),baseId=ident(data.mode,api.user.uid,data.studyId,data.wave);
   if(!db.attempts[baseId]||originalId!==baseId)throw Error('No se encontró la participación original para registrar una corrección.');
   const revisions=db.corrections[baseId]||[];
   const revisionId=baseId+'_revision_'+String(revisions.length+1);
   revisions.push({...structuredClone(data),id:revisionId,uid:api.user.uid,originalId:baseId,revisionNumber:revisions.length+1,status:'amended',submittedAt:new Date().toISOString()});
   db.corrections[baseId]=revisions;save(DATA_KEY,db);return revisionId;
  },
  async getMyCorrections(mode){if(!api.user)return [];return store().corrections[ident(mode,api.user.uid)]||[];},
  async getMyLatest(mode){
   if(!api.user)return null;const db=store(),baseId=ident(mode,api.user.uid),list=db.corrections[baseId]||[];
   return list.at(-1)||db.attempts[baseId]||null;
  },
  async savePreferences({followUp,version}){
   if(!api.user||api.user.isAnonymous)throw Error('Debes acceder con la cuenta Google simulada para guardar las autorizaciones.');
   const db=store();db.preferences[api.user.uid]={followUp:!!followUp,version,updatedAt:new Date().toISOString()};save(DATA_KEY,db);
  },
  async getMyPreferences(){return api.user?store().preferences[api.user.uid]||null:null;},
  async getPublicStats(){try{return JSON.parse(localStorage.getItem('a11yskills-admin-stats-v30')||'null');}catch{return null;}},
  resetDemo(){localStorage.removeItem(DATA_KEY);localStorage.removeItem(USER_KEY);localStorage.removeItem(GUEST_KEY);api.user=null;guestId=null;changed();},
  getDemoRecords(){return Object.values(store().attempts).map(a=>({...a,p:a.profile||{}}));},
  exportDemo(){return JSON.stringify(store(),null,2);}
 };
 function changed(){window.dispatchEvent(new Event('a11y-auth-changed'));}
 window.A11Y_AUTH=api;
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>window.dispatchEvent(new Event('a11y-auth-ready')),{once:true}):queueMicrotask(()=>window.dispatchEvent(new Event('a11y-auth-ready')));
})();
