import React,{useMemo,useState} from 'react';
import {Plus,Trash2,CheckCircle2,Download,CloudUpload,Sheet,Users,Save,ExternalLink,Baby,UserRound,UserRoundCheck} from 'lucide-react';
import {useWedding} from '../context/WeddingContext';

function csv(rows){const h=['Tipo','Nombre','Edad','Acompañante','Teléfono','Correo','Confirmado'];const body=rows.map(g=>[g.type==='nino'?'Niño/a':g.type==='hombre'?'Hombre':'Mujer',g.name,g.age||'',g.accompaniedBy||'',g.phone||'',g.email||'',g.confirmed?'Sí':'No']);return [h,...body].map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n')}

const tabs=[
 {id:'mujer',label:'Invitadas',icon:UserRound},
 {id:'hombre',label:'Invitados',icon:UserRoundCheck},
 {id:'nino',label:'Niños',icon:Baby}
];

export default function Guests(){
 const {active,addItem,removeItem,patchItem}=useWedding();
 const [tab,setTab]=useState('mujer');
 const [form,setForm]=useState({name:'',phone:'',email:'',age:'',accompaniedBy:''});
 const [sheetUrl,setSheetUrl]=useState(()=>localStorage.getItem('miboda_sheet_url')||'');
 const [saved,setSaved]=useState(!!localStorage.getItem('miboda_sheet_url'));
 const [syncing,setSyncing]=useState(false);
 const [syncMessage,setSyncMessage]=useState('');
 const visible=useMemo(()=>active.guests.filter(g=>(g.type||'mujer')===tab),[active.guests,tab]);
 const counts=useMemo(()=>tabs.reduce((a,t)=>({...a,[t.id]:active.guests.filter(g=>(g.type||'mujer')===t.id).length}),{}),[active.guests]);
 function add(e){e.preventDefault();if(!form.name.trim())return;addItem('guests',{...form,name:form.name.trim(),type:tab,confirmed:false,age:tab==='nino'?form.age:'',accompaniedBy:tab==='nino'?form.accompaniedBy:''});setForm({name:'',phone:'',email:'',age:'',accompaniedBy:''})}
 function exportCsv(){const blob=new Blob(['\ufeff'+csv(active.guests)],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='invitados-mi-boda.csv';a.click();URL.revokeObjectURL(a.href)}
 function saveUrl(){const clean=sheetUrl.trim();setSheetUrl(clean);localStorage.setItem('miboda_sheet_url',clean);setSaved(!!clean);setSyncMessage(clean?'Liga guardada correctamente.':'Liga eliminada.')}
 async function sync(){const clean=sheetUrl.trim();if(!clean){setSyncMessage('Primero pega y guarda la URL de tu Web App de Google Apps Script.');return}setSyncing(true);setSyncMessage('Enviando invitados a Google Sheets…');localStorage.setItem('miboda_sheet_url',clean);setSaved(true);try{await fetch(clean,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'replaceGuests',guests:active.guests})});setSyncMessage('✓ Solicitud de respaldo enviada. Revisa la pestaña “Invitados” de tu hoja.');}catch{setSyncMessage('No se pudo enviar. Verifica que la Web App termine en /exec y esté disponible para cualquiera.')}finally{setSyncing(false)}}
 return <div className="page"><div className="page-intro"><div><p className="eyebrow">INVITADOS & RSVP</p><h2>Tu lista de invitados</h2><p>{active.guests.filter(g=>g.confirmed).length} confirmados de {active.guests.length} registrados.</p></div><div className="action-row"><button className="secondary" onClick={exportCsv}><Download size={16}/> CSV / Excel</button></div></div>
 <div className="panel sheet-panel"><div className="sheet-title"><div><b><Sheet size={17}/> Respaldo en Google Sheets</b><small>Guarda la liga de tu Web App y respalda toda la lista cuando quieras.</small></div><button className="primary" onClick={sync} disabled={syncing}><CloudUpload size={16}/> {syncing?'Respaldando…':'Respaldar ahora'}</button></div>
 <label className="sheet-url-label">Liga de Google Sheets / Web App<input value={sheetUrl} onChange={e=>{setSheetUrl(e.target.value);setSaved(false)}} placeholder="https://script.google.com/macros/s/XXXXX/exec"/></label>
 <div className="sheet-actions"><button className="secondary" onClick={saveUrl}><Save size={16}/> {saved?'Actualizar liga':'Guardar liga'}</button>{sheetUrl&&<a className="text-btn" href={sheetUrl} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Abrir liga</a>}</div>{syncMessage&&<div className="success-note sheet-message">{syncMessage}</div>}
 </div>
 <div className="tabs guest-tabs">{tabs.map(t=>{const Icon=t.icon;return <button className={tab===t.id?'active':''} onClick={()=>setTab(t.id)} key={t.id}><Icon size={15}/>{t.label}<span>{counts[t.id]}</span></button>})}</div>
 <div className="panel"><form className="inline-form guest-form" onSubmit={add}><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={tab==='nino'?'Nombre del niño/a':'Nombre completo'} required/>{tab==='nino'&&<input type="number" min="0" max="17" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Edad"/>}<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Teléfono"/><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Correo"/>{tab==='nino'&&<input value={form.accompaniedBy} onChange={e=>setForm({...form,accompaniedBy:e.target.value})} placeholder="Acompañante / mamá / papá"/>}<button className="primary"><Plus size={16}/> Agregar</button></form>
 <div className="table-list">{visible.map(g=><div className="row" key={g.id}><button className={`confirm-dot ${g.confirmed?'yes':''}`} onClick={()=>patchItem('guests',g.id,{confirmed:!g.confirmed})}>{g.confirmed&&<CheckCircle2 size={17}/>}</button><div><b>{g.name}</b><small>{g.type==='nino'?(g.age?`${g.age} años`:'Niño/a'):(g.phone||'Sin teléfono')} {g.type==='nino'&&g.accompaniedBy?` · Acompaña: ${g.accompaniedBy}`:''} {g.type!=='nino'&&g.email?` · ${g.email}`:''}</small></div><span className={g.confirmed?'status ok':'status'}>{g.confirmed?'Confirmado':'Pendiente'}</span><button className="icon-btn danger" onClick={()=>removeItem('guests',g.id)}><Trash2 size={16}/></button></div>)}{!visible.length&&<div className="empty"><Users/> No hay personas en esta categoría todavía.</div>}</div></div></div>
}
