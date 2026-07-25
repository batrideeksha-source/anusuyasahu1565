const BASE=(()=>location.pathname.includes('/admin/')?'../':'')();
async function data(name){const r=await fetch(`${BASE}data/${name}.json?ts=${Date.now()}`);if(!r.ok)throw Error(`Unable to load ${name}`);return r.json()}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function img(src,alt=''){return src?`<img src="${BASE+esc(src)}" alt="${esc(alt)}" loading="lazy">`:''}
function fmtDate(v){if(!v)return '';let d=new Date(`${v}T00:00:00`);return new Intl.DateTimeFormat('hi-IN',{day:'numeric',month:'long',year:'numeric'}).format(d)}
function youtubeId(url=''){let m=String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);return m?m[1]:''}
function siteChrome(){
 const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 document.querySelectorAll('nav a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===current)a.classList.add('active')});
 let btn=document.createElement('button');btn.className='to-top';btn.setAttribute('aria-label','ऊपर जाएँ');btn.innerHTML='↑';document.body.appendChild(btn);btn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
 const header=document.querySelector('header');addEventListener('scroll',()=>{btn.classList.toggle('show',scrollY>450);header?.classList.toggle('scrolled',scrollY>20)},{passive:true});
 const menu=document.querySelector('.menu');if(menu){menu.innerHTML='☰';menu.setAttribute('aria-expanded','false');menu.onclick=()=>{let n=document.querySelector('nav'),open=n.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.innerHTML=open?'✕':'☰'}}
}
async function init(){try{let s=await data('settings');document.documentElement.style.setProperty('--primary',s.theme?.primary||'#7a263a');document.documentElement.style.setProperty('--accent',s.theme?.accent||'#c9892b');document.documentElement.style.setProperty('--bg',s.theme?.background||'#fffaf0');document.documentElement.style.setProperty('--text',s.theme?.text||'#35261f');document.querySelectorAll('[data-site-name]').forEach(x=>x.textContent=s.siteName)}catch(e){console.warn(e)}siteChrome()}
document.addEventListener('DOMContentLoaded',init);
