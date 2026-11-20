/* Navegación inferior accesible: sección activa + entrada a la cuenta. */
(()=>{'use strict';
 function init(){
  const nav=document.querySelector('.mobile-bottom-nav'); if(!nav)return;
  function paint(){
   const page=location.pathname.split('/').pop()||'index.html';
   const current=page==='index.html'?'participacion':page==='observatorio.html'?'observatorio':page==='sobre-el-proyecto.html'?'proyecto':'';
   nav.querySelectorAll('[data-mobile-item]').forEach(a=>{
    if(a.dataset.mobileItem===current)a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
   });
   const btn=nav.querySelector('[data-mobile-account]');if(!btn)return;
   const u=window.A11Y_AUTH?.user;
   const logged=u&&!u.isAnonymous;
   const label=btn.querySelector('span:last-child');if(label)label.textContent=logged?'Mi cuenta':'Acceder';
   btn.setAttribute('aria-label',logged?`Cuenta conectada: ${u.email||u.displayName||'usuario'}. Ver cuenta`:'Acceder con Google (demostración)');
  }
  nav.addEventListener('click',async e=>{
   const btn=e.target.closest('[data-mobile-account]');if(!btn)return;
   const head=document.getElementById('account-toolbar');
   if(!head){location.href='index.html#participa';return;}
   const u=window.A11Y_AUTH?.user;
   if(u&&!u.isAnonymous){head.scrollIntoView({block:'start',behavior:'smooth'});head.querySelector('button')?.focus();return;}
   const login=head.querySelector('[data-auth-login], [data-login]');
   if(login){login.click();return;}
   if(window.A11Y_AUTH?.loginGoogle){await window.A11Y_AUTH.loginGoogle(true);return;}
   location.href='index.html#participa';
  });
  window.addEventListener('hashchange',paint);
  window.addEventListener('a11y-auth-changed',paint);
  window.addEventListener('a11y-auth-ready',paint);
  paint();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
