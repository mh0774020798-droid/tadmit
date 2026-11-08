const E=process.env,F=re=>{const k=Object.keys(E).find(k=>re.test(k)&&!/READ_ONLY/.test(k));return k?E[k]:undefined};
const U=F(/REST_API_URL$|REDIS_REST_URL$/),T=F(/REST_API_TOKEN$|REDIS_REST_TOKEN$/);
const HAS=!!(U&&T)||!!E.REDIS_URL;
let CL;const kv=async()=>{if(!CL){const c=require('redis').createClient({url:E.REDIS_URL});c.on('error',()=>{});try{await c.connect()}catch(e){throw e}CL=c}return CL};
const NOKV=()=>'Redis לא מחובר. משתנים שנמצאו: '+(Object.keys(E).filter(k=>/KV|REDIS|UPSTASH|STORAGE/i.test(k)).join(', ')||'אין');
const R=(...c)=>fetch(U,{method:'POST',headers:{Authorization:'Bearer '+T},body:JSON.stringify(c)}).then(r=>r.json()).then(j=>j.result);
const get=async k=>{try{return JSON.parse((await(U&&T?R('GET',k):(await kv()).get(k)))||'[]')}catch(e){return[]}},set=async(k,v)=>{const j=JSON.stringify(v);return U&&T?R('SET',k,j):(await kv()).set(k,j)};
const cut=(s,n)=>String(s||'').slice(0,n);
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const b=req.body||{},A=(process.env.ADMIN_PASS||'').trim(),ok=!!A&&String(b.p||'').trim()===A,a=b.a;
 try{
  if(a==='pub')return res.json({apps:await get('apps'),revs:(await get('revs')).filter(r=>r.ok)});
  if(a==='contact'){
   if(!A&&/^\d{9,10}$/.test(String(b.phone||'').trim()))return res.json({cfg:'ADMIN_PASS לא מוגדר ב-Vercel (או שלא בוצע Redeploy)'});
   if(A&&String(b.phone||'').trim()===A)return res.json({admin:true});
   if(!HAS)return res.status(503).json({cfg:NOKV()});
   const m=await get('msgs');
   m.unshift({id:Date.now(),name:cut(b.name,80),email:cut(b.email,120),phone:cut(b.phone,30),type:cut(b.type,40),msg:cut(b.msg,2000),t:new Date().toISOString()});
   await set('msgs',m.slice(0,300));return res.json({done:1});
  }
  if(a==='dl'){const l=await get('apps');l.forEach(x=>{if(x.id===b.id)x.n=(x.n||0)+1});await set('apps',l);return res.json({done:1})}
  if(a==='review'){
   const r=await get('revs');r.unshift({id:Date.now(),name:cut(b.name,60),text:cut(b.text,600),rating:Math.min(5,Math.max(1,parseInt(b.rating)||5)),ok:false});
   await set('revs',r.slice(0,200));return res.json({done:1});
  }
  if(!ok)return res.status(401).json({err:1});
  if(!HAS)return res.status(503).json({cfg:NOKV()});
  if(a==='all')return res.json({apps:await get('apps'),msgs:await get('msgs'),revs:await get('revs')});
  if(a==='gh'){const r=E.GH_REPO,t=E.GH_TOKEN;return res.json(r&&t?{token:t,repo:r,branch:E.GH_BRANCH||'main'}:{cfg:'חסרים GH_TOKEN ו-GH_REPO ב-Vercel'})}
  if(a==='editapp'){const l=await get('apps');l.forEach(x=>{if(x.id===b.id){Object.assign(x,{title:cut(b.title,80),desc:cut(b.desc,600),cat:cut(b.cat,30),dl:cut(b.dl,500),forum:cut(b.forum,500)});if(b.icon)x.icon=cut(b.icon,150000)}});await set('apps',l);return res.json({done:1})}
  if(a==='addapp'){
   const l=await get('apps');
   l.unshift({id:Date.now(),title:cut(b.title,80),desc:cut(b.desc,600),cat:cut(b.cat,30),icon:cut(b.icon,150000),dl:cut(b.dl,500),forum:cut(b.forum,500)});
   await set('apps',l);return res.json({done:1});
  }
  if(a==='del'&&['apps','msgs','revs'].includes(b.k)){
   await set(b.k,(await get(b.k)).filter(x=>x.id!==b.id));return res.json({done:1});
  }
  if(a==='approve'){
   const r=await get('revs');r.forEach(x=>{if(x.id===b.id)x.ok=true});
   await set('revs',r);return res.json({done:1});
  }
  res.status(400).json({err:1});
 }catch(e){res.status(500).json({err:1})}
};
