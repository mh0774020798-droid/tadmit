const U=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL,T=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
const R=(...c)=>fetch(U,{method:'POST',headers:{Authorization:'Bearer '+T},body:JSON.stringify(c)}).then(r=>r.json()).then(j=>j.result);
const get=async k=>{try{return JSON.parse((await R('GET',k))||'[]')}catch(e){return[]}},set=(k,v)=>R('SET',k,JSON.stringify(v));
const cut=(s,n)=>String(s||'').slice(0,n);
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const b=req.body||{},A=(process.env.ADMIN_PASS||'').trim(),ok=!!A&&String(b.p||'').trim()===A,a=b.a;
 try{
  if(a==='pub')return res.json({apps:await get('apps'),revs:(await get('revs')).filter(r=>r.ok)});
  if(a==='contact'){
   if(!A&&/^\d{9,10}$/.test(String(b.phone||'').trim()))return res.json({cfg:'ADMIN_PASS לא מוגדר ב-Vercel (או שלא בוצע Redeploy)'});
   if(A&&String(b.phone||'').trim()===A)return res.json({admin:true});
   if(!U)return res.status(503).json({cfg:'Redis לא מחובר ב-Vercel'});
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
  if(!U)return res.status(503).json({cfg:'Redis לא מחובר ב-Vercel'});
  if(a==='all')return res.json({apps:await get('apps'),msgs:await get('msgs'),revs:await get('revs')});
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
