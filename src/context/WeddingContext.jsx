import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {loadLocal,saveLocal,clearLocal,uid} from '../utils/storage';
import {makeTasks} from '../data/templates';
import {supabase,supabaseEnabled} from '../lib/supabase';

const Ctx=createContext(null);
const blank={user:null,weddings:[],activeWeddingId:null,profile:{},authMode:'demo'};

export function WeddingProvider({children}){
 const [data,setData]=useState(()=>loadLocal()||blank);
 const [loading,setLoading]=useState(false);
 const [authReady,setAuthReady]=useState(!supabaseEnabled);
 const [accountReady,setAccountReady]=useState(!supabaseEnabled);
 const hydrated=useRef(false);
 const skipSave=useRef(false);
 const activeUserId=useRef(null);

 // Local storage is always a safety net. It never replaces a successfully
 // restored Supabase account; it is only used as a fallback/recovery cache.
 useEffect(()=>{saveLocal(data)},[data]);

 useEffect(()=>{
  if(!supabaseEnabled){setAuthReady(true);setAccountReady(true);return}
  let alive=true;
  setAuthReady(false);setAccountReady(false);hydrated.current=false;

  supabase.auth.getSession().then(async({data:s,error})=>{
   if(!alive)return;
   if(error){setAuthReady(true);setAccountReady(true);return}
   if(s.session?.user){
    activeUserId.current=s.session.user.id;
    setData(d=>({...d,user:s.session.user,authMode:'supabase'}));
    await loadRemote(s.session.user.id,s.session.user.email);
   }else{
    activeUserId.current=null;
    setData(d=>({...d,user:null,authMode:'demo'}));
    hydrated.current=true;
    setAccountReady(true);
   }
   setAuthReady(true);
  }).catch(()=>{if(alive){setAuthReady(true);setAccountReady(true)}});

  const {data:sub}=supabase.auth.onAuthStateChange(async(event,s)=>{
   if(!alive)return;
   if(s?.user){
    activeUserId.current=s.user.id;
    setData(d=>({...d,user:s.user,authMode:'supabase'}));
    if(event!=='INITIAL_SESSION'){
      setAccountReady(false);hydrated.current=false;
      await loadRemote(s.user.id,s.user.email);
    }
   }else if(event!=='INITIAL_SESSION'){
    activeUserId.current=null;hydrated.current=false;
    setData(d=>({...blank,authMode:'demo'}));
    setAccountReady(true);
   }
   setAuthReady(true);
  });
  return()=>{alive=false;sub.subscription.unsubscribe()}
 },[]);

 async function loadRemote(uidUser,email=''){
  setLoading(true);setAccountReady(false);
  try{
   const {data:rows,error}=await supabase.from('weddings').select('*').eq('owner_id',uidUser).order('created_at',{ascending:true});
   if(error)throw error;
   const weddings=[];
   for(const r of rows||[]){
    const [g,t,e,en,v,ev]=await Promise.all([
     supabase.from('guests').select('*').eq('wedding_id',r.id),
     supabase.from('tasks').select('*').eq('wedding_id',r.id),
     supabase.from('expenses').select('*').eq('wedding_id',r.id),
     supabase.from('entourage').select('*').eq('wedding_id',r.id),
     supabase.from('vendors').select('*').eq('wedding_id',r.id),
     supabase.from('wedding_events').select('*').eq('wedding_id',r.id)
    ]);
    wedddingsPush(weddings,r,g?.data,t?.data,e?.data,en?.data,v?.data,ev?.data);
   }

   const local=loadLocal();
   const localBelongsToAccount=local?.user?.email&&email&&local.user.email.toLowerCase()===email.toLowerCase();
   const fallbackLocal=localBelongsToAccount?(local.weddings||[]):[];

   setData(d=>{
    const restored=weddings.length?weddings:fallbackLocal;
    const previousActive=d.activeWeddingId;
    const active=restored.some(w=>w.id===previousActive)?previousActive:(restored[0]?.id||null);
    return {...d,weddings:restored,activeWeddingId:active,authMode:'supabase'};
   });

   hydrated.current=true;
   setAccountReady(true);

   // If this account has no remote weddings but we have a local cache for the
   // same email, migrate that cache to Supabase instead of making the user start over.
   if(!rows?.length&&fallbackLocal.length){
    for(const w of fallbackLocal)await saveRemote(w,uidUser);
   }
  }catch(error){
   console.error('No se pudieron recuperar las bodas de Supabase:',error);
   // Keep the user's local cache only when it belongs to the same account.
   const local=loadLocal();
   const sameAccount=local?.user?.email&&email&&local.user.email.toLowerCase()===email.toLowerCase();
   setData(d=>{
    const restored=sameAccount?(local.weddings||[]):[];
    return {...d,weddings:restored,activeWeddingId:restored[0]?.id||null,authMode:'supabase'};
   });
   hydrated.current=true;
   setAccountReady(true);
  }finally{setLoading(false)}
 }

 function wedddingsPush(arr,r,g,t,e,en,v,ev){arr.push({
  id:r.id,coupleName:r.couple_name,weddingDate:r.wedding_date||'',city:r.city||'',state:r.state||'',
  guestEstimate:r.guests_estimate||0,budget:Number(r.budget||0),ceremonies:r.ceremonies||[],createdAt:r.created_at,
  tasks:(t||[]).map(x=>({id:x.id,title:x.title,notes:x.notes,category:x.category,window:x.time_window,dueDate:x.due_date||'',done:x.done})),
  guests:(g||[]).map(x=>({...x,type:x.type||'mujer',age:x.age||'',accompaniedBy:x.accompanied_by||x.accompaniedBy||''})),
  expenses:(e||[]).map(x=>({id:x.id,name:x.name,category:x.category,amount:Number(x.amount||0)})),
  entourage:en||[],vendors:(v||[]).map(x=>({id:x.id,name:x.name,category:x.category,phone:x.phone||'',amount:Number(x.amount||0),due:x.due_date||''})),
  events:(ev||[]).map(x=>({id:x.id,title:x.title,time:x.time||'',person:x.person||'',date:x.event_date||''})),documents:[],tables:[]
 })}

 useEffect(()=>{
  if(!supabaseEnabled||!data.user||data.user.id==='demo-user'||!hydrated.current||!accountReady||!data.activeWeddingId||skipSave.current){skipSave.current=false;return}
  const w=data.weddings.find(x=>x.id===data.activeWeddingId);if(!w)return;
  const timer=setTimeout(()=>saveRemote(w,data.user.id),700);return()=>clearTimeout(timer)
 },[data.weddings,data.activeWeddingId,data.user,accountReady]);

 async function saveRemote(w,owner_id=data.user?.id){
  if(!owner_id)return;
  const {error:upsertError}=await supabase.from('weddings').upsert({id:w.id,owner_id,couple_name:w.coupleName,wedding_date:w.weddingDate||null,city:w.city,state:w.state,guests_estimate:Number(w.guestEstimate)||0,budget:Number(w.budget)||0,ceremonies:w.ceremonies||[]});
  if(upsertError)throw upsertError;
  const tables=[
   ['guests',w.guests.map(x=>({id:x.id,wedding_id:w.id,name:x.name,phone:x.phone||'',email:x.email||'',confirmed:!!x.confirmed,type:x.type||'mujer',age:x.age||null,accompanied_by:x.accompaniedBy||''}))],
   ['tasks',w.tasks.map(x=>({id:x.id,wedding_id:w.id,title:x.title,notes:x.notes||'',category:x.category,time_window:x.window||'',due_date:x.dueDate||null,done:!!x.done}))],
   ['expenses',w.expenses.map(x=>({id:x.id,wedding_id:w.id,name:x.name,category:x.category,amount:Number(x.amount)||0}))],
   ['entourage',w.entourage.map(x=>({id:x.id,wedding_id:w.id,name:x.name,type:x.type,role:x.role||'',phone:x.phone||'',notes:x.notes||'',confirmed:!!x.confirmed}))],
   ['vendors',w.vendors.map(x=>({id:x.id,wedding_id:w.id,name:x.name,category:x.category,phone:x.phone||'',amount:Number(x.amount)||0,due_date:x.due||null}))],
   ['wedding_events',w.events.map(x=>({id:x.id,wedding_id:w.id,title:x.title,event_date:x.date||w.weddingDate||null,time:x.time||'',person:x.person||''}))]
  ];
  for(const [table,rows] of tables){const {error}=await supabase.from(table).delete().eq('wedding_id',w.id);if(error)throw error;if(rows.length){const r=await supabase.from(table).insert(rows);if(r.error)throw r.error}}
 }

 async function signIn(email,password){
  if(supabaseEnabled){setLoading(true);setAccountReady(false);const r=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(r.error){setAccountReady(true);throw r.error}return}
  return signInLocal(email,password)
 }
 function signInLocal(email,password){
  if(!email)throw new Error('Escribe tu correo.');if(!password)throw new Error('Escribe tu contraseña.');
  localStorage.setItem('miboda_login_email',email.trim());
  const local=loadLocal();
  const same=local?.user?.email?.toLowerCase()===email.trim().toLowerCase();
  setData(same?{...local,user:{id:'local-user',email:email.trim()},authMode:'local'}:{...blank,user:{id:'local-user',email:email.trim()},authMode:'local'});
  setAuthReady(true);setAccountReady(true);
 }
 async function signUp(email,password){
  if(supabaseEnabled){setLoading(true);const r=await supabase.auth.signUp({email,password});setLoading(false);if(r.error)throw r.error;if(r.data.user&&!r.data.session)throw new Error('Revisa tu correo para confirmar la cuenta y después inicia sesión.');return}
  return signInLocal(email,password)
 }
 function useLocalMode(email){
  const value=(email||localStorage.getItem('miboda_login_email')||'local@demo.com').trim();localStorage.setItem('miboda_login_email',value);
  const local=loadLocal();const same=local?.user?.email?.toLowerCase()===value.toLowerCase();
  setData(same?{...local,user:{id:'local-user',email:value},authMode:'local'}:{...blank,user:{id:'local-user',email:value},authMode:'local'});
  setAuthReady(true);setAccountReady(true)
 }
 async function signOut(){if(supabaseEnabled&&data.authMode==='supabase')await supabase.auth.signOut();activeUserId.current=null;hydrated.current=false;setData(d=>({...blank,authMode:'demo'}));setAccountReady(!supabaseEnabled)}
 function createWedding(setup){const id=data.authMode==='supabase'?crypto.randomUUID():uid('wedding');const w={id,...setup,guestEstimate:Number(setup.guests)||0,createdAt:new Date().toISOString(),tasks:makeTasks(setup.ceremonies,setup.weddingDate),guests:[],expenses:[],entourage:[],vendors:[],events:[],documents:[],tables:[]};skipSave.current=false;setData(d=>({...d,weddings:[...d.weddings,w],activeWeddingId:id}))}
 async function deleteWedding(id){if(!id)return;if(supabaseEnabled&&data.authMode==='supabase'&&data.user?.id&&data.user.id!=='demo-user'){setLoading(true);const {error}=await supabase.from('weddings').delete().eq('id',id);setLoading(false);if(error)throw error}setData(d=>{const weddings=d.weddings.filter(w=>w.id!==id);return {...d,weddings,activeWeddingId:d.activeWeddingId===id?(weddings[0]?.id||null):d.activeWeddingId}})}
 function selectWedding(id){setData(d=>({...d,activeWeddingId:id}))}
 function updateActive(fn){setData(d=>({...d,weddings:d.weddings.map(w=>w.id===d.activeWeddingId?fn(w):w)}))}
 function patchActive(patch){updateActive(w=>({...w,...patch}))}
 function addItem(key,item){const id=item.id||(data.authMode==='supabase'?crypto.randomUUID():uid(key));updateActive(w=>({...w,[key]:[...(w[key]||[]),{...item,id}]}))}
 function removeItem(key,id){updateActive(w=>({...w,[key]:(w[key]||[]).filter(x=>x.id!==id)}))}
 function patchItem(key,id,patch){updateActive(w=>({...w,[key]:(w[key]||[]).map(x=>x.id===id?{...x,...patch}:x)}))}
 const active=data.weddings.find(w=>w.id===data.activeWeddingId)||null;
 const api=useMemo(()=>({data,active,loading,authReady,accountReady,supabaseEnabled,signIn,signUp,signInLocal,useLocalMode,signOut,createWedding,selectWedding,patchActive,addItem,removeItem,patchItem,deleteWedding,reset:()=>{clearLocal();setData({...blank,authMode:'demo'});setAuthReady(!supabaseEnabled);setAccountReady(!supabaseEnabled)}}),[data,active,loading,authReady,accountReady]);
 return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export function useWedding(){const c=useContext(Ctx);if(!c)throw new Error('useWedding debe usarse dentro de WeddingProvider');return c}
