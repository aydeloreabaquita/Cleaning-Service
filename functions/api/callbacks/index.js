const json = (data, status=200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});
const authorized = (request, env) => Boolean(env.CALLBACK_ADMIN_KEY && request.headers.get('authorization') === `Bearer ${env.CALLBACK_ADMIN_KEY}`);
export async function onRequestGet({ request, env }) {
  if(!authorized(request, env)) return json({error:'Unauthorized. Check your callback admin key.'},401);
  if(!env.DB) return json({error:'D1 database binding DB is missing.'},500);
  const {results} = await env.DB.prepare('SELECT * FROM callbacks ORDER BY created_at DESC LIMIT 500').all();
  return json({requests:results});
}
export async function onRequestPost({request, env}) {
  if(!env.DB) return json({error:'Callback service not configured.'},503);
  if(Number(request.headers.get('content-length') || '0') > 12000) return json({error:'Request is too large.'},413);
  let input;
  try { input=await request.json(); } catch { return json({error:'Invalid form submission.'},400); }
  if(input.website) return json({ok:true}); // honeypot bots
  const name=String(input.name || '').trim().slice(0,120);
  const phone=String(input.phone || '').trim().slice(0,45);
  const email=String(input.email || '').trim().slice(0,200);
  const preferred_time=String(input.preferred_time || '').trim().slice(0,120);
  const message=String(input.message || '').trim().slice(0,2000);
  if(name.length<2 || phone.length<7 || phone.length>45 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return json({error:'Please enter a valid name, phone number, and optional email.'},400);
  const id=crypto.randomUUID();
  await env.DB.prepare('INSERT INTO callbacks (id,name,phone,email,preferred_time,message,status,notes,created_at) VALUES (?,?,?,?,?,?,?,?,?)')
    .bind(id,name,phone,email,preferred_time,message,'New','',new Date().toISOString()).run();
  return json({ok:true},201);
}
