const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/api/demo-login'){
      if(request.method!=='POST')return json({error:'Method not allowed'},405);
      let body;
      try{body=await request.json();}catch{return json({error:'Invalid request'},400);}
      const email=String(body?.email||'').trim().toLowerCase();
      const password=String(body?.password||'');
      if(!env.DEMO_EMAIL||!env.DEMO_PASSWORD)return json({error:'Demo login is not configured'},503);
      if(email!==env.DEMO_EMAIL.toLowerCase()||password!==env.DEMO_PASSWORD)return json({error:'Invalid demo credentials'},401);
      return json({ok:true});
    }
    return env.ASSETS.fetch(request);
  }
};
