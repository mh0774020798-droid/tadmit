const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],on=(s,f)=>{const e=$(s);if(e)f(e)};
const api=b=>fetch('/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u=x=>/^https?:\/\//.test(x)?esc(x.replace('mitmachim.top','bina.top')):'#';
const I=(n,c='')=>`<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
const stars=n=>[1,2,3,4,5].map(i=>I('star',i<=n?'f':'')).join('');
let P='',ICON='',tab='a',D={apps:[],revs:[]},cat='הכל',q='',RT=5;
try{const t=localStorage.getItem('th');if(t)document.documentElement.dataset.theme=t;else if(matchMedia('(prefers-color-scheme:light)').matches)document.documentElement.dataset.theme='light'}catch(e){}
on('#th',e=>e.onclick=()=>{const d=document.documentElement,n=d.dataset.theme=='dark'?'light':'dark';d.dataset.theme=n;try{localStorage.setItem('th',n)}catch(x){}});
on('#mb',e=>e.onclick=()=>$('nav').classList.toggle('open'));
const cur=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
$$('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===cur));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
function rv(){$$('.rv:not(.in)').forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)})}
addEventListener('scroll',()=>{const h=document.documentElement;$('#pg').style.width=h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100+'%';$('#up').classList.toggle('show',h.scrollTop>600)},{passive:true});
on('#up',e=>e.onclick=()=>scrollTo({top:0,behavior:'smooth'}));
document.addEventListener('click',e=>{const a=e.target.closest('[data-d]');if(a&&+a.dataset.d)api({a:'dl',id:+a.dataset.d}).catch(()=>0)});
const demo={id:0,title:'ספוט-דוס',cat:'אפליקציה',desc:'אפליקציה שימושית בעיצוב ספוטיפיי, שעובדת אופליין לגמרי.'};
const card=a=>`<article class="card rv"><div class="ic">${a.icon?`<img src="${esc(a.icon)}" alt="">`:I('box')}</div>${a.cat?`<span class="tag">${esc(a.cat)}</span>`:''}<h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><small class="mu">${a.n||0} הורדות</small><div class="row">${a.dl?`<a class="btn" data-d="${a.id}" href="${u(a.dl)}" download rel="noopener">${I('download')} הורדה</a>`:''}${a.forum?`<a class="btn o" href="${u(a.forum)}" target="_blank" rel="noopener">${I('ext')} לפוסט במתמחים</a>`:''}</div></article>`;
function apps(){const l=D.apps.length?D.apps:[demo];
 on('#fl',e=>e.innerHTML=l.slice(0,3).map(card).join(''));
 on('#al',e=>{const f=l.filter(a=>(cat=='הכל'||a.cat==cat)&&(a.title+' '+a.desc).includes(q));e.innerHTML=f.map(card).join('')||'<p class="sub">לא נמצאו תוצאות.</p>'});
 on('#cats',e=>{e.innerHTML=['הכל',...new Set(l.map(a=>a.cat).filter(Boolean))].map(x=>`<button class="chip${x==cat?' on':''}" data-c="${esc(x)}">${esc(x)}</button>`).join('')});rv()}
on('#cats',e=>e.onclick=ev=>{const b=ev.target.closest('[data-c]');if(b){cat=b.dataset.c;apps()}});
on('#q',e=>e.oninput=()=>{q=e.value.trim();apps()});
function revs(){const r=D.revs,av=r.length?r.reduce((s,x)=>s+(x.rating||5),0)/r.length:0;
 on('#stats',e=>{e.innerHTML=[[D.apps.length,'אפליקציות ותוכנות'],[D.apps.reduce((s,a)=>s+(a.n||0),0),'הורדות'],[r.length,'חוות דעת'],[av?av.toFixed(1):'–','דירוג ממוצע']].map(([v,l])=>`<div class="stat card rv"><b class="g">${v}</b><span class="mu">${l}</span></div>`).join('')});
 on('#rs',e=>e.innerHTML=r.length?`<div class="stars">${stars(Math.round(av))}</div><b>${av.toFixed(1)} מתוך 5</b><span class="mu">· ${r.length} חוות דעת</span>`:'');
 on('#rl',e=>{if(!r.length){e.innerHTML='<p class="sub">עדיין אין חוות דעת. אפשר להיות הראשונים.</p>';return}
  let a=[...r];while(a.length<6)a=a.concat(r);
  const h=a.map(x=>`<div class="rc"><div class="stars">${stars(x.rating||5)}</div><p>“${esc(x.text)}”</p><b>${esc(x.name)}</b></div>`).join('');
  e.innerHTML=`<div class="mq"><div class="tr">${h}${h}</div></div>`})}
async function load(){try{D=await api({a:'pub'});D.apps=D.apps||[];D.revs=D.revs||[]}catch(e){}apps();revs();rv()}
function setR(n){RT=n;$$('.sb').forEach(b=>b.classList.toggle('f',+b.dataset.v<=n))}
on('#si',e=>{e.innerHTML=[1,2,3,4,5].map(i=>`<button type="button" class="sb" data-v="${i}" aria-label="${i} כוכבים">${I('star')}</button>`).join('');setR(5);e.onclick=ev=>{const b=ev.target.closest('[data-v]');if(b)setR(+b.dataset.v)}});
on('#rf',e=>e.onsubmit=async ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(e));f.a='review';f.rating=RT;
 const r=await api(f).catch(()=>({}));$('#rok').textContent=r.done?'תודה! חוות הדעת תפורסם אחרי אישור.':(r.cfg||'השליחה נכשלה.');if(r.done)e.reset()});
on('#cf',e=>e.onsubmit=async ev=>{ev.preventDefault();const f=Object.fromEntries(new FormData(e));f.a='contact';
 const r=await api(f).catch(()=>({}));
 if(r.cfg){$('#ok').textContent=r.cfg;return}
 if(r.admin){P=f.phone.trim();e.reset();$('#adm').classList.add('on');show('a');return}
 $('#ok').textContent=r.done?'ההודעה נשלחה, נחזור אליך בקרוב.':'השליחה נכשלה. נסה שוב.';if(r.done)e.reset()});
if($('#adm')){
 $('#x').onclick=()=>{$('#adm').classList.remove('on');P=''};
 $$('[data-t]').forEach(b=>b.onclick=()=>show(b.dataset.t));
 $('#fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d'),s=Math.min(im.width,im.height);x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,96,96);ICON=c.toDataURL('image/png')};im.src=URL.createObjectURL(f)};
 $('#af').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));f.icon=ICON;f.a='addapp';f.p=P;
  const r=await api(f).catch(()=>({}));if(r.done){e.target.reset();ICON='';show('a')}else alert('נכשל')};
 $('#ad').onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.k){if(!confirm('למחוק?'))return;await api({a:'del',k:b.dataset.k,id:+b.dataset.id,p:P})}
  else if(b.dataset.ap)await api({a:'approve',id:+b.dataset.ap,p:P});else return;show(tab)}}
async function show(t){tab=t;
 $$('[data-t]').forEach(b=>b.classList.toggle('o',b.dataset.t!=t));$('#av').style.display=t=='a'?'block':'none';
 const d=await api({a:'all',p:P}).catch(()=>({}));
 if(d.cfg){alert(d.cfg);$('#x').click();return}
 if(d.err||!d.apps){alert('אין הרשאה');$('#x').click();return}
 const row=(k,x,h,ex='')=>`<div class="it"><div>${h}</div><div class="row">${ex}<button class="btn o" data-k="${k}" data-id="${x.id}">מחיקה</button></div></div>`;
 $('#ad').innerHTML=t=='a'?d.apps.map(x=>row('apps',x,`<b>${esc(x.title)}</b><br><small>${esc(x.cat)} · ${x.n||0} הורדות</small>`)).join('')
 :t=='m'?d.msgs.map(x=>row('msgs',x,`<b>${esc(x.name)||'ללא שם'}</b> · ${esc(x.type)}<br>${esc(x.msg)}<br><small>${esc(x.email)} · ${esc(x.phone)} · ${new Date(x.t).toLocaleString('he-IL')}</small>`)).join('')||'אין הודעות.'
 :d.revs.map(x=>row('revs',x,`<b>${esc(x.name)}</b> · ${x.rating||5}/5 ${x.ok?'(מפורסם)':'(ממתין)'}<br>${esc(x.text)}`,x.ok?'':`<button class="btn" data-ap="${x.id}">אישור</button>`)).join('')||'אין חוות דעת.'}
load();rv();
