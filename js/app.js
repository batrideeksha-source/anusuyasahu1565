
const BASE = (()=>{ const p=location.pathname; return p.includes('/admin/')?'../':'';})();
async function data(name){const r=await fetch(`${BASE}data/${name}.json?ts=${Date.now()}`);if(!r.ok)throw Error(name);return r.json()}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function img(src,alt=''){return src?`<img src="${BASE+esc(src)}" alt="${esc(alt)}" loading="lazy">`:''}
async function init(){
 let s=await data('settings'); document.documentElement.style.setProperty('--primary',s.theme?.primary||'#7a263a');document.documentElement.style.setProperty('--accent',s.theme?.accent||'#c9892b');document.documentElement.style.setProperty('--bg',s.theme?.background||'#fffaf0');document.documentElement.style.setProperty('--text',s.theme?.text||'#35261f');
 document.querySelectorAll('[data-site-name]').forEach(x=>x.textContent=s.siteName);
 let m=document.querySelector('.menu'); if(m)m.onclick=()=>document.querySelector('nav').classList.toggle('open');
}
document.addEventListener('DOMContentLoaded',init);
