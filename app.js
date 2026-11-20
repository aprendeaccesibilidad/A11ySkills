/* A11ySkills v30 — recorrido de investigación sin claves de corrección públicas. */
(()=>{
'use strict';
const {GROUPS,SHORT,S,getCases,xss,getLocal,saveLocal}=window.A11YSKILLS;
const $=id=>document.getElementById(id);
const STUDY='a11yconf2026', VERSION='v30', CONSENT_VERSION='pendiente-revision-udl-v23';
const DECISIONS=[
 'Falla. Hay un incumplimiento de accesibilidad.',
 'Pasa. Se cumple el requisito de accesibilidad evaluado.',
 'Información insuficiente. Faltan datos para determinar si cumple o incumple.',
 'No lo sé. No sé cómo valorar esta situación.'
];
const PROFILES=['Discapacidad visual total','Baja visión','Discapacidad auditiva','Discapacidad motriz','Discapacidad cognitiva','Ninguno de los perfiles anteriores','No lo sé'];
const PROFILE_ICONS=['visual_total','baja_vision','auditivo','motriz','cognitivo','ninguno','no_lo_se'];
const STAGE_SHORT=['Perfil','Experiencia','Formación','Comprensión','Finalizar'];
const DECISION_ICONS=[
 '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg>',
 '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/></svg>',
 '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v1"/></svg>',
 '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5.1 1c0 1.8-2.6 2-2.6 4m0 3h.01"/></svg>'
];
const PLAY_ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 10 7-10 7z"/></svg>';
const PAUSE_ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5v14M15 5v14"/></svg>';
const STAGES=['Perfil y actividad','Experiencia en accesibilidad','Formación y aprendizaje','Conocimientos y comprensión','Finalizar participación'];
const EXPLAIN=['Tu actividad y contexto profesional o académico.','Tu experiencia práctica evaluando accesibilidad.','La formación y las actividades que has realizado.','Tus valoraciones y situaciones prácticas WCAG.','Revisa tu participación y decide si quieres vincularla con Google.'];
const state={mode:'expres',stage:0,quiz:false,index:0,profile:{},details:{},assess:{},consent:null,finished:false,recordId:'',saved:false,committed:false,selected:'solo',followUp:false,accountExpress:null,localExpress:null,correctionOf:null};
const allCases=()=>getCases(state.mode);
const googleUser=()=>window.A11Y_AUTH?.user && !window.A11Y_AUTH.user.isAnonymous ? window.A11Y_AUTH.user : null;
const configured=()=>Boolean(window.A11Y_AUTH?.enabled);
const isSigned=()=>Boolean(googleUser());
// Categorías generales, sin almacenar el user-agent completo ni una huella digital.
function getClientContext(){
 const ua=navigator.userAgent||'';
 const platform=navigator.userAgentData?.platform||navigator.platform||'';
 const touch=Number(navigator.maxTouchPoints||0);
 const tablet=/iPad|Tablet|PlayBook|Silk/i.test(ua)||(/Android/i.test(ua)&&!/Mobile/i.test(ua))||(/Mac/i.test(platform)&&touch>1);
 const mobile=!tablet&&(navigator.userAgentData?.mobile===true||/iPhone|iPod|Android.*Mobile|Windows Phone|Mobi/i.test(ua));
 const browser=/Edg\/|EdgiOS\/|EdgA\//i.test(ua)?'Edge':/OPR\/|Opera|OPT\//i.test(ua)?'Opera':/FxiOS\/|Firefox\//i.test(ua)?'Firefox':/CriOS\/|Chrome\//i.test(ua)?'Chrome':/Safari\//i.test(ua)?'Safari':'Otro';
 return {device:tablet?'tableta':mobile?'movil':'ordenador',browser};
}
const errNode=()=>$('wizard-error');
function showError(message){const el=errNode();el.hidden=false;el.textContent=message;el.focus();}
function clearError(){errNode().hidden=true;errNode().textContent='';}
function scrollToWizard(){let el=$('step-heading');el.focus({preventScroll:true});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)$('wizard').scrollIntoView({behavior:'smooth',block:'start'});}
function buildChoices(q){
 const multi=q.type==='multi',selected=state.profile[q.id]??(multi?[]:null);
 let options=q.options;
 if(q.id==='P13'){
   const prior=state.profile.P12;
   if(!Array.isArray(prior)||!prior.length||prior.includes('14'))return `<p class="notice">P13. Responde primero a P12 si has realizado algún aprendizaje sobre accesibilidad.</p>`;
   options=S('P12').options.filter(o=>prior.includes(o.key)&&o.key!=='14');
 }
 const number=state.mode==='expres'?SHORT.indexOf(q.id)+1:Number(q.id.slice(1));
 const items=options.map(o=>`<label class="option"><input type="${multi?'checkbox':'radio'}" name="${q.id}" data-profile="${q.id}" value="${o.key}" ${multi?selected.includes(o.key)?'checked':'':selected===o.key?'checked':''}><span>${xss(o.label)}</span></label>`).join('');
 let extra='';
 if(q.other?.length){const other= q.other.some(n=>multi?selected.includes(String(n)):selected===String(n));extra+=`<div id="extra-${q.id}" class="extra-field" ${other?'':'hidden'}><label for="detail-${q.id}">Especifica, si lo deseas</label><input id="detail-${q.id}" data-detail="${q.id}" value="${xss(state.details[q.id]||'')}" maxlength="180" class="text-input"></div>`;}
 if(q.id==='P01')extra+=`<div class="extra-field" id="university-field" ${(Array.isArray(selected)&&selected.includes('0'))?'':'hidden'}><label for="university">Universidad (opcional)</label><input id="university" data-detail="university" class="text-input" maxlength="120" value="${xss(state.details.university||'')}"></div>`;
 const hint=q.type==='multi'?'Puedes seleccionar varias respuestas.':q.type==='scale'?'Selecciona un valor de 1 a 5.':'Selecciona una respuesta.';
 return `<fieldset class="question-card fieldset" id="question-${xss(q.id)}"><legend><strong class="profile-title">${number}. ${xss(q.text)}</strong></legend>${state.mode==='completo'&&state.accountExpress?.profile?.[q.id]!==undefined&&selected!==null?'<p class="reused-answer">Respuesta recuperada del Reto Exprés (puedes modificarla).</p>':''}<p class="profile-hint">${hint}${['P23','P24'].includes(q.id)?' Respuesta opcional.':''}</p><div class="options">${items}</div>${extra}</fieldset>`;
}
function renderProfile(){const qs=GROUPS[state.stage].ids.map(S).filter(q=>state.mode==='completo'||SHORT.includes(q.id));$('wizard-content').innerHTML=qs.map(buildChoices).join('');}
function scale(key,label,labels,value){return `<fieldset class="compact-scale fieldset"><legend class="field-label">${label} <span class="optional-label">(opcional)</span></legend><p class="scale-help">Selecciona una opción:</p><div class="compact-scale-row">${labels.map((x,i)=>`<label class="compact-scale-option"><input type="radio" data-assess="${key}" name="${key}" value="${i+1}" ${Number(value)===i+1?'checked':''}><span><strong>${i+1}</strong><small>${x}</small></span></label>`).join('')}</div></fieldset>`;}
function renderCase(){
 const q=allCases()[state.index],v=state.assess[q.id]||{},applied=q.kind==='applied';
 const prior=state.mode==='completo'&&q.id==='G1'&&state.accountExpress?.assess?.G1;
 const media=window.A11YSKILLS_CASE_MEDIA?.[q.id];
 const view=window.matchMedia('(max-width:760px)').matches?'movil':'pc';
 const image=media?(media[view]||media.pc):q.previewImage;
 const playback=media&&(media.video_pc||media.video_movil)?`<div class="media-playback-controls"><button type="button" class="button outline media-play" aria-controls="case-media-video"><span class="play-icon" aria-hidden="true">${PLAY_ICON}</span><span class="play-label">Reproducir animación</span></button><span class="media-status visually-hidden" role="status" aria-live="polite"></span></div><p class="media-help">La animación no comienza automáticamente. Puedes pausarla y reanudarla sin perder el fotograma actual.</p>`:'';
 const visual=applied?`<figure class="case-preview research-preview"><img id="case-media-image" src="${xss(image)}" loading="lazy" alt="${xss(q.previewAlt)}. Vista de la interfaz ficticia; consulta la descripción y el código para evaluarla."><video id="case-media-video" class="case-video" controls preload="none" playsinline loop hidden aria-label="Animación del comportamiento de la interfaz: ${xss(q.title)}"></video><figcaption>Vista de referencia · Interfaz ficticia. La imagen, la descripción y el código constituyen evidencias del caso.</figcaption>${playback}</figure>`:'';
 const evidence=applied?`<section class="evaluation-example"><h4 class="example-heading">Situación que debes evaluar</h4><p class="case-stem">${xss(q.stem)}</p>${visual}<details class="code-disclosure"><summary>Consultar el código HTML / JavaScript del caso</summary><pre tabindex="0"><code>${xss(q.code)}</code></pre></details></section>`:`<p class="case-stem">${xss(q.stem)}</p>`;
 const options=applied?DECISIONS:q.options;
 const decision=`<fieldset class="question-card fieldset case-decision"><legend><strong>${applied?'P1. Según la información presentada, ¿qué valoración haces de esta situación en relación con la accesibilidad?':'Selecciona la respuesta que consideres correcta'}</strong></legend><p class="profile-hint"><strong>Respuesta obligatoria.</strong> Selecciona una opción.</p><div class="options">${options.map((label,i)=>`<label class="option decision-option"><input type="radio" name="decision" value="${i}" ${Number(v.decision)===i?'checked':''}><span class="option-icon" aria-hidden="true">${applied?DECISION_ICONS[i]:''}</span><span>${xss(label)}</span></label>`).join('')}</div></fieldset>`;
 const reason=applied?`<div class="case-optional"><div class="case-field"><label class="field-label" for="justification">P2. ¿Por qué has elegido esa respuesta? <span class="optional-label">(opcional)</span></label><p class="field-help">Explica brevemente qué información de la descripción, la imagen o el código te ha llevado a esa conclusión.</p><textarea id="justification" data-assess="justification" maxlength="600" rows="3" class="text-input wide-text">${xss(v.justification||'')}</textarea><div id="criterion-field" ${Number(v.decision)===0?'':'hidden'}><label class="criterion-inline-label" for="wcagCriterion">Si has detectado un incumplimiento, indica el criterio WCAG (opcional).</label><p class="field-help">Indica su número si lo conoces (por ejemplo, 1.4.10).</p><input id="wcagCriterion" class="text-input wide-text" data-assess="wcagCriterion" maxlength="100" autocomplete="off" value="${xss(v.wcagCriterion||'')}"></div></div>${scale('confidence','P3. ¿Qué grado de confianza tienes en tu respuesta?',['Ninguna confianza','Poca confianza','Confianza moderada','Bastante confianza','Mucha confianza'],v.confidence)}${scale('difficulty','P4. ¿Qué dificultad has tenido para evaluar este caso?',['Ninguna dificultad','Poca dificultad','Dificultad moderada','Bastante dificultad','Mucha dificultad'],v.difficulty)}<div class="case-field"><label class="field-label" for="additional">P5. ¿Qué comprobarías para confirmar tu valoración? <span class="optional-label">(opcional)</span></label><p class="field-help">Si necesitas más información, explica qué dato, comportamiento o elemento del código revisarías.</p><textarea id="additional" data-assess="additional" maxlength="800" rows="3" class="text-input wide-text">${xss(v.additional||'')}</textarea></div><fieldset class="case-field question-card fieldset impact-question"><legend><strong>P6. ¿A qué perfiles de discapacidad puede afectar la accesibilidad de esta situación?</strong> <span class="optional-label">(opcional)</span></legend><p class="field-help">Selecciona todas las opciones que consideres relevantes, teniendo en cuenta las barreras y los beneficios de un diseño accesible.</p><div class="options">${PROFILES.map((p,i)=>`<label class="option profile-impact-option"><input type="checkbox" data-profile-impact="${i}" value="${i}" name="impact" ${(v.impact||[]).includes(String(i))?'checked':''}><img class="impact-option-icon" src="assets/iconos-discapacidad/${PROFILE_ICONS[i]}.svg" alt="" aria-hidden="true"><span>${xss(p)}</span></label>`).join('')}</div></fieldset></div>`:'';
 $('wizard-content').innerHTML=`<span class="challenge-eyebrow">${applied?'COMPRENSIÓN WCAG':'CONOCIMIENTOS GENERALES'} · ${state.index+1} de ${allCases().length}</span>${prior?'<p class="notice">Esta pregunta se respondió en tu Reto Exprés. Puedes conservar o modificar la respuesta.</p>':''}<h3 class="case-title">${xss(q.title)}</h3>${evidence}<div class="case-questions">${decision}${reason}</div><p class="fineprint">Las soluciones se reservan para el análisis investigador. Responde sin consultar documentación o IA si deseas evaluar tu conocimiento inicial.</p>`;
}
// Adaptación automática al tamaño de pantalla: móvil (hasta 760 px), ordenador para tableta y PC.
// Los GIF originales se conservan en assets como material fuente, mientras que los vídeos admiten pausa real.
function setupCaseMedia(){
 const q=allCases()[state.index],m=window.A11YSKILLS_CASE_MEDIA?.[q.id];
 const picture=$('case-media-image'),video=$('case-media-video');if(!picture||!m)return;
 const mediaQuery=window.matchMedia('(max-width:760px)');
 const play=$('wizard-content').querySelector('.media-play');
 const feedback=$('wizard-content').querySelector('.media-status');
 let selected=mediaQuery.matches?'movil':'pc';
 const updatePlay=()=>{if(!play)return;const paused=video.paused||video.hidden;play.querySelector('.play-label').textContent=paused?'Reproducir animación':'Pausar animación';play.querySelector('.play-icon').innerHTML=paused?PLAY_ICON:PAUSE_ICON;};
 function switchView(view){
  selected=view;
  if(video){video.pause();video.removeAttribute('src');video.load();video.hidden=true;}
  picture.hidden=false;picture.src=m[view]||q.previewImage;
  if(play)play.hidden=!m['video_'+view];
  if(feedback)feedback.textContent='Visualización adaptada a '+(view==='pc'?'ordenador o tableta':'móvil')+'. Animación detenida.';
  updatePlay();
 }
 // Una sola suscripción activa a los cambios de ancho de pantalla.
 mediaQuery.onchange=e=>{if($('case-media-image')===picture)switchView(e.matches?'movil':'pc');};
 if(video&&play){
  play.addEventListener('click',async()=>{
   if(video.hidden){const path=m['video_'+selected];if(!path)return;video.src=path;video.poster=m[selected];video.hidden=false;picture.hidden=true;}
   if(video.paused){try{await video.play();}catch(error){if(feedback)feedback.textContent='No se pudo reproducir; utiliza los controles del vídeo.';}}else video.pause();
   updatePlay();
  });
  video.addEventListener('play',()=>{updatePlay();if(feedback)feedback.textContent='Animación reproduciéndose.';});
  video.addEventListener('pause',()=>{updatePlay();if(feedback)feedback.textContent='Animación pausada.';});
  video.addEventListener('error',()=>{if(feedback)feedback.textContent='No se ha podido cargar la animación. Consulta la descripción y el código del caso.';});
 }
 switchView(selected);
}
function renderFinish(){
 const u=googleUser();
 const complete=state.mode==='completo';
 const options=complete?`<div class="notice"><strong>Reto completo · Cuenta Google conectada:</strong> ${xss(u?.email||u?.displayName||'Cuenta no disponible')}<p>El Reto completo se conserva en la cuenta que utilizaste para acceder. No necesitas otra contraseña.</p></div>`:u?`<div class="notice success-note"><strong>Cuenta Google conectada:</strong> ${xss(u.email||u.displayName)}<p>Esta participación se guardará vinculada a tu cuenta.</p></div>`:`<fieldset class="fieldset"><legend><strong>¿Quieres conservar tu participación?</strong></legend><div class="options">
 <label class="option"><input type="radio" name="commit" value="solo" ${state.selected==='solo'?'checked':''}><span><strong>Terminar sin cuenta</strong><small class="commit-description">Tus respuestas quedan registradas sin identificarte; para entrar en el Reto completo necesitarás vincular tu Exprés con Google.</small></span></label>
 <label class="option"><input type="radio" name="commit" value="google" ${state.selected==='google'?'checked':''}><span><strong>Conservar mi participación con Google</strong><small class="commit-description">Permite recuperar tus respuestas desde otro dispositivo y acceder al Reto completo.</small></span></label>
 </div></fieldset>
 <div class="contact-panel" id="google-commit-panel" ${state.selected==='google'?'':'hidden'}><h4>Vincula tu participación</h4><p>Elige una cuenta Google ficticia de prueba. No se envían correos ni se crean contraseñas de A11ySkills.</p><button class="button" type="button" data-auth-login>Continuar con Google (demo)</button></div>`;
 $('wizard-content').innerHTML=`<h3>Has terminado las preguntas</h3>
 <p>${complete?'El Reto completo requiere una cuenta Google para conservar la evaluación.':'Puedes finalizar sin cuenta o vincular voluntariamente tu Reto Exprés con Google.'}</p>
 ${options}
 <fieldset class="fieldset consent-choices" id="extra-consents" style="margin-top:20px" ${(complete||u||state.selected==='google')?'':'hidden'}>
 <legend><strong>Seguimiento del aprendizaje (opcional)</strong></legend>
 <label class="contact-consent"><input id="followup-consent" type="checkbox" ${(complete||u||state.selected==='google')?'':'disabled'} ${state.followUp?'checked':''}><span><strong>Autorizar seguimiento T0, T1 y T2</strong><small>Autorizo vincular mis participaciones de diferentes momentos de evaluación. Es opcional e independiente de utilizar Google para recuperar respuestas.</small></span></label>
 </fieldset>
 <p class="field-help">A11ySkills no envía invitaciones ni correos de acceso. Consulta <a href="informacion-estudio.html" target="_blank" rel="noopener">Información del estudio y privacidad</a>.</p><div id="final-review" hidden></div>`;
}
function render(){
 clearError();$('step-kicker').textContent=`${state.mode==='expres'?'Reto Exprés':'Reto completo'} · Paso ${state.stage+1} de 5`;
 $('step-heading').textContent=STAGES[state.stage]; $('step-explainer').textContent=EXPLAIN[state.stage];
 $('progress-bar').style.width=`${(state.stage+1)*20}%`;
 $('step-progress').textContent=state.stage===3&&state.quiz?`Pregunta ${state.index+1} de ${allCases().length}`:`Paso ${state.stage+1} de 5`;
 $('back-btn').hidden=state.stage===0; $('next-btn').hidden=state.finished;
 $('next-btn').disabled=false;
 $('next-btn').textContent=state.stage===4?'Guardar y finalizar →':state.stage===3&&state.quiz?(state.index===allCases().length-1?'Finalizar el reto →':'Siguiente pregunta →'):state.stage===3?'Empezar casos WCAG →':'Continuar →';
 $('step-list').innerHTML=STAGES.map((label,i)=>`<li class="${i===state.stage?'current':i<state.stage?'done':''}"><button class="step-link" type="button" data-step="${i}" aria-label="Paso ${i+1}: ${label}" ${i===state.stage?'aria-current="step"':''} ${i===4&&!allCases().every(c=>state.assess[c.id]?.decision!==undefined)?'aria-describedby="step-locked-hint"':''}><span class="count" aria-hidden="true">${i+1}</span><span class="step-name step-name-long" aria-hidden="true">${label}</span><span class="step-name step-name-short" aria-hidden="true">${STAGE_SHORT[i]}</span></button></li>`).join('');
 if(state.stage<3||state.stage===3&&!state.quiz)renderProfile();else if(state.stage===3){renderCase();setupCaseMedia();}else renderFinish();
}
function readLocalExpress(){const list=getLocal().filter(x=>x.mode==='expres'&&x.version===VERSION);return list.at(-1)||null;}
function snapshotFromRecord(record){if(!record)return null;return {id:record.id,profile:record.profile||record.p||{},details:record.details||{},assess:record.assess||{}};}
function hint(){
 const u=googleUser(),saved=state.accountExpress||state.localExpress||snapshotFromRecord(readLocalExpress());
 const h=$('resume-hint');h.hidden=!(saved||u);
 if(!h.hidden)h.innerHTML=`<p>${saved?'<strong>Hay un Reto Exprés anterior.</strong> Puedes recuperar las preguntas de perfil y la respuesta de conocimientos generales para el Reto completo.':'Has accedido con Google. Tus participaciones pueden recuperarse desde distintos dispositivos.'}</p>${saved?'<label class="resume-check"><input id="reuse-answers" type="checkbox" checked> Reutilizar mis respuestas de perfil del Exprés</label>':''}`;
}
function start(newMode){
 state.mode=newMode;state.stage=0;state.index=0;state.quiz=false;state.finished=false;state.committed=false;state.saved=false;state.selected='solo';state.followUp=false;state.correctionOf=null;
 state.profile={};state.details={};state.assess={};state.recordId='part-'+(crypto.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-'));
 const prior=newMode==='completo'?(state.accountExpress||null):null;
 if(prior){state.profile=structuredClone(prior.profile||{});state.details=structuredClone(prior.details||{});if(prior.assess?.G1)state.assess.G1=structuredClone(prior.assess.G1);}
 $('intro').hidden=true;$('wizard').hidden=false;render();scrollToWizard();
}
function saveCase(){const q=allCases()[state.index],v=state.assess[q.id]||{};
 const choice=$('wizard-content').querySelector('input[name="decision"]:checked');if(choice)v.decision=Number(choice.value);
 for(const key of ['justification','wcagCriterion','confidence','difficulty','additional']){const el=$('wizard-content').querySelector(`[data-assess="${key}"]${['confidence','difficulty'].includes(key)?':checked':''}`);if(el)v[key]=el.value;}
 if(q.kind==='applied')v.impact=[...$('wizard-content').querySelectorAll('input[name="impact"]:checked')].map(x=>x.value);
 state.assess[q.id]=v;
}
async function finalize(){
 const u=googleUser(),a=window.A11Y_AUTH;
 const googleRequested=state.mode==='completo'||state.selected==='google'||Boolean(u);
 if(googleRequested&&!u){showError('Para conservar tu participación con Google, inicia sesión antes de finalizar.');return;}
 if(state.mode==='completo'&&!u){showError('El Reto completo requiere identificación con Google.');return;}
 if(state.followUp&&!u){showError('Para autorizar el seguimiento, conecta primero tu cuenta Google.');return;}
 $('next-btn').disabled=true;$('next-btn').textContent='Guardando…';
 const data={clientContext:getClientContext(),id:state.recordId,mode:state.mode,version:VERSION,studyId:STUDY,wave:'T0',profile:structuredClone(state.profile),details:structuredClone(state.details),assess:structuredClone(state.assess),consent:{accepted:true,infoVersion:state.consent.infoVersion,acceptedAt:state.consent.acceptedAt},origin:new URLSearchParams(location.search).get('origen')||'web'};
 let remote=false,problem='';
 if(configured()){
  try{
   if(state.correctionOf&&a.saveCorrection)await a.saveCorrection(data,state.correctionOf);
   else await a.saveAttempt(data);
   remote=true;
  }catch(e){problem=e.message||'No se pudo completar el registro.';}
  if(remote&&state.followUp&&u){
   try{await a.savePreferences({followUp:true,version:CONSENT_VERSION});}
   catch(e){problem+=' No se pudo guardar la autorización de seguimiento: '+e.message;}
  }
 }else problem='Firebase no está configurado; esta instalación no envía respuestas a servidores.';
 // La demostración también conserva un registro local de los intentos anónimos.
 if(!remote){try{saveLocal({...data,synced:false,submittedAt:new Date().toISOString()});}catch(e){problem+=' No se pudo guardar la copia local.';}}
 if(!remote){$('next-btn').disabled=false;$('next-btn').textContent='Guardar y finalizar →';showError(problem);return;}
 state.finished=true;state.committed=remote;$('next-btn').hidden=true;
 if(state.mode==='expres'){
  state.localExpress=snapshotFromRecord(data);
  if(u)state.accountExpress=snapshotFromRecord(data);
  try{sessionStorage.setItem('a11yskills-express-v30',JSON.stringify(data));}catch{}
 }
 const target=$('final-review');target.hidden=false;
 target.innerHTML=`<hr class="divider"><h2>Participación registrada</h2>
 <p class="notice success-note" role="status">${a?.isMock?'Respuestas guardadas únicamente en este navegador (demo). No hay conexión real a Google ni a Firebase.':'Respuestas guardadas en el estudio.'} ${xss(problem)}</p>
 <div class="grid-3"><div class="kpi"><strong>${allCases().filter(q=>q.kind==='applied'&&state.assess[q.id]?.decision!==undefined).length}</strong><span>Casos WCAG respondidos</span></div><div class="kpi"><strong>${Object.keys(state.profile).length}</strong><span>Preguntas de perfil contestadas</span></div><div class="kpi"><strong id="identity-kpi">${u?'Google (demo)':'Sin cuenta'}</strong><span>Identificación</span></div></div>
 ${state.correctionOf?'<p class="notice">Se ha añadido una corrección sin borrar la participación inicial.</p>':''}
 <p class="fineprint">Este resumen indica la participación registrada, no una puntuación de aciertos. Las claves de corrección están reservadas al equipo investigador.</p>
 ${state.mode==='expres'?'<div class="after-express" id="after-express-access" aria-live="polite"></div>':''}
 <div class="button-row"><a class="button outline" href="observatorio.html">Consultar Observatorio</a><button class="button ghost" id="restart" type="button">Volver a Participación</button></div>`;
 $('restart').addEventListener('click',restart);
 paintAfterExpress();hint();updateMyAttempts();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
function paintAfterExpress(){
 const pane=$('after-express-access');if(!pane)return;
 const u=googleUser();const kpi=$('identity-kpi');if(kpi)kpi.textContent=u?'Google (demo)':'Sin cuenta';
 pane.innerHTML=u?`<h3>Ya puedes continuar con el Reto completo</h3><p>Cuenta conectada: <strong>${xss(u.email||u.displayName)}</strong>. El completo recupera las respuestas comunes del Exprés y añade 12 casos WCAG distintos.</p><button class="button" type="button" id="go-complete">Acceder al Reto completo</button>`:`<h3>Conserva el Exprés para acceder al Reto completo</h3><p>El Reto completo requiere una cuenta Google vinculada al Exprés. Si estás en el móvil, realiza ahora la vinculación para regresar desde casa.</p><button class="button" type="button" data-auth-login>Vincular con Google (demo)</button>`;
 pane.querySelector('#go-complete')?.addEventListener('click',()=>beginFull());
}
async function beginFull(){
 const a=window.A11Y_AUTH;
 if(!googleUser()){setAccountMessage('El Reto completo requiere iniciar sesión con Google. Vincula primero el Reto Exprés.');return false;}
 try{
  const express=await a.getMyAttempt('expres');
  if(!express){setAccountMessage('Para acceder al Reto completo, primero termina el Exprés y vincúlalo con esta cuenta Google.');return false;}
  if(await a.getMyAttempt('completo')){setAccountMessage('Esta cuenta ya tiene un Reto completo enviado. Consulta «Mis participaciones» o inicia una corrección.');return false;}
  state.accountExpress=snapshotFromRecord(express);
  if(!state.consent)state.consent={accepted:true,infoVersion:CONSENT_VERSION,acceptedAt:new Date().toISOString()};
  start('completo');return true;
 }catch(error){setAccountMessage('No se pudo comprobar el acceso al Reto completo: '+error.message);return false;}
}
function back(){if(state.finished)return;
 if(state.stage===4){state.stage=3;state.quiz=true;state.index=allCases().length-1;}
 else if(state.stage===3&&state.quiz){saveCase();if(state.index>0)state.index--;else state.quiz=false;}
 else if(state.stage>0)state.stage--;render();scrollToWizard();}
async function next(){if(state.finished)return;
 if(state.stage===4){state.selected=$('wizard-content').querySelector('input[name="commit"]:checked')?.value||(googleUser()?'google':'solo');state.followUp=$('followup-consent')?.checked||false;await finalize();return;}
 if(state.stage===3){
  if(!state.quiz){state.quiz=true;const first=allCases().findIndex(q=>state.assess[q.id]?.decision===undefined);state.index=first<0?0:first;}
  else {saveCase();if(state.assess[allCases()[state.index].id]?.decision===undefined){showError('Debes seleccionar una respuesta para continuar.');return;}
   if(state.index<allCases().length-1)state.index++;else {state.stage=4;state.quiz=false;}
  }
 }else state.stage++;
 render();scrollToWizard();}
function restart(){state.stage=0;state.quiz=false;state.finished=false;state.profile={};state.details={};state.assess={};state.consent=null;state.correctionOf=null;$('study-accept').checked=false;$('wizard').hidden=true;$('intro').hidden=false;hint();updateMyAttempts();$('participa').scrollIntoView({block:'start'});}
function setAccountMessage(t){const node=$('login-feedback');if(node){node.hidden=false;node.textContent=t;node.focus();}}
async function loginGoogle(existing=false){
 const a=window.A11Y_AUTH;
 if(!a?.enabled){setAccountMessage('La demostración no está disponible.');return;}
 try{setAccountMessage(a.isMock?'Selecciona una cuenta simulada para explorar el sistema…':'Abriendo la identificación de Google…');
   await a.loginGoogle(existing);
   if(state.stage===4&&!state.finished)renderFinish();
   paintAfterExpress();
   setAccountMessage('Cuenta de demostración conectada. Ya puedes recuperar tus participaciones.');
 }catch(e){
   let message=e?.code==='auth/credential-already-in-use'?'Esta cuenta Google ya está registrada. Utiliza «Entrar con mi cuenta existente» para acceder. Antes de cambiar de identidad, conserva las respuestas actuales en este dispositivo.':(e?.message||'No se pudo completar la identificación.');
   setAccountMessage(message);
 }
}
function authView(){
 const a=window.A11Y_AUTH,u=googleUser(),account=$('account-toolbar');if(!account)return;
 if(u){account.innerHTML=`<span class="account-name">Cuenta: ${xss(u.email||u.displayName||'Mi cuenta')}</span><button type="button" class="button ghost small" data-auth-logout>Cerrar sesión</button>`;}
 else account.innerHTML=`<button type="button" class="button outline small" data-auth-login>Acceder con Google</button>`;
 const status=$('auth-status');if(status){status.textContent=u?`Cuenta de demostración conectada: ${u.email||u.displayName}. Puedes recuperar tus participaciones.`:a?.isMock?'DEMO: Exprés abierto. Reto completo reservado a cuentas Google con Exprés vinculado.':a?.enabled?'Exprés abierto. Para acceder al completo vincula tu Exprés a Google.':'Firebase aún sin configurar.';}
 hint();paintAfterExpress();
 if(state.stage===4&&!state.finished)renderFinish();
 if(!u&&state.mode==='completo'&&!$('wizard').hidden&&!state.finished){$('wizard').hidden=true;$('intro').hidden=false;setAccountMessage('Has cerrado sesión. El Reto completo requiere Google para continuar.');}
 if(u&&a?.enabled){a.getMyAttempt('expres').then(r=>{state.accountExpress=r?snapshotFromRecord(r):null;hint();updateMyAttempts();}).catch(e=>console.warn('No se pudo recuperar Exprés',e));}
 else {state.accountExpress=null;updateMyAttempts();}
}
function presentSavedAttempt(record){
 const prof=Object.entries(record.profile||{}).map(([key,v])=>`${xss(key)}: ${xss(Array.isArray(v)?v.map(k=>window.A11YSKILLS.S(key)?.options?.find(o=>o.key===k)?.label||k).join(', '):window.A11YSKILLS.S(key)?.options?.find(o=>o.key===v)?.label||v)}`).join('<br>');
 const responses=Object.entries(record.assess||{}).map(([key,v])=>`<li><strong>${xss(key)}</strong>: ${xss(String(v.decision??'Sin respuesta'))}${v.justification?' · '+xss(String(v.justification).slice(0,200)):''}</li>`).join('');
 return `<div class="account-review"><p><strong>Versión del instrumento:</strong> ${xss(record.version||VERSION)}</p><p><strong>Perfil:</strong><br>${prof||'Sin datos'}</p><p><strong>Casos y respuestas registradas:</strong></p><ul>${responses}</ul><p class="fineprint">La vista no revela las claves de corrección ni convierte este resumen en una puntuación.</p></div>`;
}
async function updateMyAttempts(){const panel=$('my-attempts');if(!panel)return;const a=window.A11Y_AUTH;
 if(!googleUser()||!a?.enabled){panel.hidden=true;return;}
 try{
  const [express,full]=await Promise.all([a.getMyAttempt('expres'),a.getMyAttempt('completo')]);
  panel.hidden=false;
  const item=(mode,r,label)=>`<div class="progress-card"><strong>${label}</strong><p>${r?'Participación inicial conservada':'Todavía no hay una participación vinculada a esta cuenta'}</p>${r?`<button type="button" class="button outline small" data-view-attempt="${mode}">Consultar</button> <button type="button" class="button ghost small" data-amend-attempt="${mode}">Corregir (nueva versión)</button>`:''}</div>`;
  panel.innerHTML=`<h3>Mis participaciones</h3><p>Cuenta conectada. Puedes consultar tus respuestas y guardar correcciones sin borrar la participación inicial.</p><div class="grid-2">${item('expres',express,'Reto Exprés')}${item('completo',full,'Reto completo')}</div><div id="account-saved-review" aria-live="polite"></div>`;
 }catch(e){panel.hidden=false;panel.innerHTML='<p>No se pudo recuperar el estado de tus participaciones. Comprueba la conexión.</p>';}
}
// Eventos de formulario y navegación
function refreshAccessNotice(){
 const mode=document.querySelector('#start-form input[name="mode"]:checked')?.value;
 const panel=$('complete-access-notice');if(panel)panel.hidden=mode!=='completo';
}
document.querySelectorAll('#start-form input[name="mode"]').forEach(r=>r.addEventListener('change',refreshAccessNotice));
refreshAccessNotice();
$('start-form').addEventListener('submit',async e=>{
 e.preventDefault();const newMode=$('start-form').querySelector('input[name="mode"]:checked')?.value||'expres';
 if(!$('study-accept').checked){$('study-accept').focus();return;}
 state.consent={accepted:true,infoVersion:CONSENT_VERSION,acceptedAt:new Date().toISOString()};
 if(newMode==='completo'){
  await beginFull();return;
 }
 if(configured()){
  const btn=$('start-form').querySelector('button[type="submit"]');
  try{btn.disabled=true;btn.textContent='Preparando participación…';await window.A11Y_AUTH.ensureAnonymous();}
  catch(error){setAccountMessage('No se pudo iniciar una participación: '+error.message);return;}
  finally{btn.disabled=false;btn.textContent='Comenzar cuestionario →';}
 }
 start('expres');
});
$('next-btn').addEventListener('click',next);$('back-btn').addEventListener('click',back);
$('step-list').addEventListener('click',e=>{const btn=e.target.closest('button[data-step]');if(!btn)return;const pos=Number(btn.dataset.step);if(state.finished||pos===state.stage)return;
 if(state.stage===3&&state.quiz)saveCase();
 if(pos===4&&!allCases().every(q=>state.assess[q.id]?.decision!==undefined)){showError('Antes de finalizar debes responder todos los casos de tu reto.');return;}
 state.stage=pos;state.quiz=false;render();scrollToWizard();
});
$('wizard-content').addEventListener('change',e=>{
 const el=e.target;
 if(el.dataset.profile){const q=S(el.dataset.profile);if(q.type==='multi'){
  let current=[...$('wizard-content').querySelectorAll(`input[name="${q.id}"]:checked`)].map(x=>x.value);
  const exclusions=(q.exclusive||[]).map(String);
  if(exclusions.includes(el.value)&&el.checked)current=[el.value];else if(el.checked)current=current.filter(i=>!exclusions.includes(i));
  state.profile[q.id]=current;
  $('wizard-content').querySelectorAll(`input[name="${q.id}"]`).forEach(input=>input.checked=current.includes(input.value));
 }else state.profile[q.id]=el.value;
 const selected=state.profile[q.id],shown=q.other?.some(idx=>Array.isArray(selected)?selected.includes(String(idx)):selected===String(idx));const extra=$('extra-'+q.id);if(extra)extra.hidden=!shown;
 if(q.id==='P01'&&$('university-field'))$('university-field').hidden=!selected.includes('0');
 if(q.id==='P12'){if(state.profile.P13&&!selected.includes(state.profile.P13))delete state.profile.P13;if(state.mode==='completo'){const dependent=$('question-P13');if(dependent)dependent.outerHTML=buildChoices(S('P13'));}}
 return;
 }
 if(el.name==='decision'){const q=allCases()[state.index];state.assess[q.id]??={};state.assess[q.id].decision=Number(el.value);const field=$('criterion-field');if(field)field.hidden=el.value!=='0';return;}
 if(el.dataset.assess){const q=allCases()[state.index];state.assess[q.id]??={};state.assess[q.id][el.dataset.assess]=el.value;return;}
 if(el.dataset.profileImpact){const q=allCases()[state.index];state.assess[q.id]??={};let v=[...$('wizard-content').querySelectorAll('input[name="impact"]:checked')].map(i=>i.value);const excl=['5','6'];if(excl.includes(el.value)&&el.checked)v=[el.value];else if(el.checked)v=v.filter(x=>!excl.includes(x));state.assess[q.id].impact=v;$('wizard-content').querySelectorAll('input[name="impact"]').forEach(x=>x.checked=v.includes(x.value));return;}
 if(el.name==='commit'){state.selected=el.value;const p=$('google-commit-panel');if(p)p.hidden=state.selected!=='google';const group=$('extra-consents');if(group)group.hidden=state.selected!=='google';const cb=$('followup-consent');if(cb){cb.disabled=state.selected!=='google';if(cb.disabled)cb.checked=false;}if(state.selected!=='google')state.followUp=false;return;}
 if(el.id==='followup-consent')state.followUp=el.checked;
});
$('wizard-content').addEventListener('input',e=>{const el=e.target;if(el.dataset.detail)state.details[el.dataset.detail]=el.value;if(el.dataset.assess){const q=allCases()[state.index];state.assess[q.id]??={};state.assess[q.id][el.dataset.assess]=el.value;}});
document.addEventListener('click',async e=>{
 const reviewButton=e.target.closest('[data-view-attempt]');
 if(reviewButton){
  const mode=reviewButton.dataset.viewAttempt;
  try{const a=window.A11Y_AUTH;const [base,corrections]=await Promise.all([a.getMyAttempt(mode),a.getMyCorrections?.(mode)||[]]);
   const result=$('account-saved-review');if(!result||!base)return;
   result.innerHTML=`<h4>${mode==='expres'?'Reto Exprés':'Reto completo'} · Registro inicial</h4>${presentSavedAttempt(base)}<p><strong>Correcciones conservadas:</strong> ${corrections.length}</p>${corrections.length?`<details><summary>Ver última corrección</summary>${presentSavedAttempt(corrections.at(-1))}</details>`:''}`;
  }catch(err){setAccountMessage(err.message)}return;
 }
 const amend=e.target.closest('[data-amend-attempt]');
 if(amend){
  try{const mode=amend.dataset.amendAttempt;const a=window.A11Y_AUTH;const base=await a.getMyAttempt(mode);const latest=await (a.getMyLatest?.(mode)||a.getMyAttempt(mode));
   if(!base||!latest)return;start(mode);state.correctionOf=base.id;state.consent=structuredClone(latest.consent||{accepted:true,infoVersion:CONSENT_VERSION,acceptedAt:new Date().toISOString()});state.profile=structuredClone(latest.profile||{});state.details=structuredClone(latest.details||{});state.assess=structuredClone(latest.assess||{});state.selected='google';render();scrollToWizard();
   setAccountMessage('Estás preparando una corrección. El primer envío quedará conservado y se añadirá una nueva versión.');
  }catch(err){setAccountMessage(err.message)}return;
 }
 if(e.target.closest('[data-auth-login]')){e.preventDefault();await loginGoogle(false)}
 if(e.target.closest('[data-auth-existing]')){e.preventDefault();await loginGoogle(true)}
 if(e.target.closest('[data-auth-logout]')){e.preventDefault();try{await window.A11Y_AUTH.logout()}catch(e){setAccountMessage(e.message)}}
});
window.addEventListener('a11y-auth-ready',authView);window.addEventListener('a11y-auth-changed',authView);
// Mostrar sesión temporal guardada en esta pestaña y no confundirla con una cuenta.
try{const raw=sessionStorage.getItem('a11yskills-express-v30');if(raw){state.localExpress=snapshotFromRecord(JSON.parse(raw));}}catch{}
hint();authView();
})();
