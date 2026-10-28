const json=(data,status=200)=> Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const authorized=(request,env)=>Boolean(env.CALLBACK_ADMIN_KEY && request.headers.get('authorization')===`Bearer ${env.CALLBACK_ADMIN_KEY}`);
export async function onRequest({request,env,params}) {
  if(!authorized(request,env)) return json({error:'Unauthorized.'},401);
  if(!env.DB) return json({error:'D1 database binding DB is missing.'},500);
  if(request.method==='DELETE') {
    await env.DB.prepare('DELETE FROM callbacks WHERE id = ?').bind(params.id).run();
    return json({ok:true});
  }
  if(request.method==='PATCH') {
    let body;
    try {body=await request.json()} catch {return json({error:'Invalid JSON.'},400)}
    const status=String(body.status||'');
    const notes=String(body.notes||'').slice(0,3000);
    if(!['New','Contacted','Scheduled','Closed'].includes(status)) return json({error:'Invalid status.'},400);
    await env.DB.prepare('UPDATE callbacks SET status = ?, notes = ? WHERE id = ?').bind(status,notes,params.id).run();
    return json({ok:true});
  }
  return json({error:'Method not allowed.'},405);
}
