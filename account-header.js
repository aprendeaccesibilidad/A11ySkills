/* Acceso Google coherente en páginas secundarias. */
(()=>{
 const host=document.getElementById('account-toolbar');if(!host)return;
 function message(msg){let node=document.getElementById('account-notice');if(!node){node=document.createElement('p');node.id='account-notice';node.className='notice';node.setAttribute('role','alert');host.insertAdjacentElement('afterend',node);}node.textContent=msg;}
 function paint(){const auth=window.A11Y_AUTH,u=auth?.user;
 host.innerHTML=u&&!u.isAnonymous?`<span class="account-name">Cuenta demo: ${String(u.email||u.displayName||"identificada").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}</span><button class="button ghost small" data-logout>Cerrar sesión</button>`:'<button type="button" class="button outline small" data-login>Acceder con Google</button>';
 }
 host.addEventListener('click',async e=>{
  if(e.target.closest('[data-login]')){try{if(!window.A11Y_AUTH?.enabled)throw Error('Es necesario configurar Firebase para habilitar el acceso Google.');await window.A11Y_AUTH.loginGoogle(true);}catch(error){message(error.message)}}
  if(e.target.closest('[data-logout]')){try{await window.A11Y_AUTH.logout()}catch(error){message(error.message)}}
 });
 window.addEventListener('a11y-auth-ready',paint);window.addEventListener('a11y-auth-changed',paint);paint();
})();
