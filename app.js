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
const gd=a=>a.cat==='תוסף'||/\.apk($|\?)/i.test(a.dl||'')?`<a class="btn o" href="/guide#${a.cat==='תוסף'?'ext':'apk'}">${I('book')} מדריך התקנה</a>`:'';
const card=a=>`<article class="card rv"><div class="ic">${a.icon?`<img src="${esc(a.icon)}" alt="">`:I('box')}</div>${a.cat?`<span class="tag">${esc(a.cat)}</span>`:''}<h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><small class="mu">${a.n||0} הורדות</small><div class="row">${a.dl?`<a class="btn" data-d="${a.id}" href="${u(a.dl)}" download rel="noopener">${I('download')} הורדה</a>`:''}${a.forum?`<a class="btn o" href="${u(a.forum)}" target="_blank" rel="noopener">${I('ext')} לפוסט במתמחים</a>`:''}${gd(a)}</div></article>`;
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
let AL=[],E0=null,GH=null;
if($('#adm')){
 const md=$('#md'),pv=()=>{$('#ip').innerHTML=ICON?`<img src="${esc(ICON)}" alt="">`:I('image')};
 $('#x').onclick=()=>{$('#adm').classList.remove('on');P=''};
 $$('.seg [data-t]').forEach(b=>b.onclick=()=>show(b.dataset.t));
 const shut=()=>md.classList.remove('on');$('#mx').onclick=shut;$('#mc2').onclick=shut;
 const dz=(z,i,fn)=>{const zz=$(z),ii=$(i);zz.onclick=()=>ii.click();ii.onchange=()=>{if(ii.files[0])fn(ii.files[0]);ii.value=''};
  ['dragover','dragenter'].forEach(v=>zz.addEventListener(v,e=>{e.preventDefault();zz.classList.add('on')}));
  ['dragleave','drop'].forEach(v=>zz.addEventListener(v,e=>{e.preventDefault();zz.classList.remove('on')}));
  zz.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)fn(f)})};
 dz('#iz','#fi',f=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),s=Math.min(im.width,im.height);x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128);ICON=c.toDataURL('image/png');pv()};im.src=URL.createObjectURL(f)});
 dz('#fz','#ff',async file=>{const st=$('#fs'),pb=$('#pb');pb.parentNode.hidden=false;pb.style.width='10%';st.textContent='מכין העלאה...';
  if(!GH)GH=await api({a:'gh',p:P}).catch(()=>({}));
  if(!GH||!GH.token){st.textContent=(GH&&GH.cfg)||'לא ניתן להתחבר ל-GitHub.';GH=null;return}
  const name=Date.now()+'-'+file.name.replace(/[^\w.\-]+/g,'_');
  const b64=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(file)});
  pb.style.width='45%';st.textContent='מעלה את '+file.name+'...';
  const r=await fetch(`https://api.github.com/repos/${GH.repo}/contents/files/${name}`,{method:'PUT',headers:{Authorization:'Bearer '+GH.token,Accept:'application/vnd.github+json'},body:JSON.stringify({message:'העלאת '+file.name,content:b64,branch:GH.branch})}).catch(()=>({ok:false,status:'רשת'}));
  if(r.ok){pb.style.width='100%';$('#af').elements.dl.value=`https://raw.githubusercontent.com/${GH.repo}/${GH.branch}/files/${name}`;st.textContent='הועלה בהצלחה: '+file.name}
  else{pb.style.width='0';st.textContent='ההעלאה נכשלה ('+r.status+'). בדוק את ההרשאות של GH_TOKEN ואת גודל הקובץ.'}});
 window.openForm=a=>{const f=$('#af');f.reset();E0=a?a.id:null;ICON=a&&a.icon||'';pv();$('#mt').textContent=a?'עריכת פריט':'הוספת פריט';$('#fs').textContent='APK, ZIP או כל קובץ. הקישור יתמלא אוטומטית.';$('#pb').parentNode.hidden=true;
  if(a)['title','cat','desc','dl','forum'].forEach(k=>f.elements[k].value=a[k]||'');md.classList.add('on')};
 $('#af').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));f.icon=ICON;f.p=P;f.a=E0?'editapp':'addapp';if(E0)f.id=E0;
  const r=await api(f).catch(()=>({}));if(r.done){shut();load();show('a')}else alert('השמירה נכשלה')};
 $('#ad').onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.new)return openForm();
  if(b.dataset.e)return openForm(AL.find(x=>x.id==b.dataset.e));
  if(b.dataset.k){if(!confirm('למחוק לצמיתות?'))return;await api({a:'del',k:b.dataset.k,id:+b.dataset.id,p:P});load()}
  else if(b.dataset.ap)await api({a:'approve',id:+b.dataset.ap,p:P});else return;show(tab)}}
async function show(t){tab=t;
 $$('.seg [data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t==t));
 const d=await api({a:'all',p:P}).catch(()=>({}));
 if(d.cfg){alert(d.cfg);$('#x').click();return}
 if(d.err||!d.apps){alert('אין הרשאה');$('#x').click();return}
 AL=d.apps;
 const del=(k,id)=>`<button class="ib sm" title="מחיקה" data-k="${k}" data-id="${id}">${I('trash')}</button>`;
 const row=(th,h,ex)=>`<div class="it"><div class="th">${th}</div><div class="tx">${h}</div><div class="row">${ex}</div></div>`;
 $('#ad').innerHTML=t=='a'?`<div class="tb"><span class="mu">${d.apps.length} פריטים</span><button class="btn" data-new="1">${I('plus')} הוספה</button></div>`+(d.apps.map(x=>row(x.icon?`<img src="${esc(x.icon)}" alt="">`:I('box'),`<b>${esc(x.title)}</b><small>${esc(x.cat)} · ${x.n||0} הורדות</small>`,`<button class="ib sm" title="עריכה" data-e="${x.id}">${I('edit')}</button>`+del('apps',x.id))).join('')||'<p class="mu">עדיין לא נוספו פריטים.</p>')
 :t=='m'?d.msgs.map(x=>row(I('mail'),`<b>${esc(x.name)||'ללא שם'} · ${esc(x.type)}</b><small>${esc(x.msg)}</small><small>${esc(x.email)} · ${esc(x.phone)} · ${new Date(x.t).toLocaleString('he-IL')}</small>`,del('msgs',x.id))).join('')||'<p class="mu">אין הודעות.</p>'
 :d.revs.map(x=>row(I('star'),`<b>${esc(x.name)} · ${x.rating||5}/5 ${x.ok?'(מפורסם)':'(ממתין)'}</b><small>${esc(x.text)}</small>`,(x.ok?'':`<button class="ib sm" title="אישור" data-ap="${x.id}">${I('check')}</button>`)+del('revs',x.id))).join('')||'<p class="mu">אין חוות דעת.</p>'}
load();rv();
