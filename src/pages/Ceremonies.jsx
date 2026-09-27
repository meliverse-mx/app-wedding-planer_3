import React from 'react';
import {FileText,Info,CheckCircle2,Circle,Clock3} from 'lucide-react';
import {useWedding} from '../context/WeddingContext';
import {CEREMONY_TASKS} from '../data/templates';
export default function Ceremonies(){const {active,patchItem}=useWedding();
 const titleToCeremony={};Object.entries(CEREMONY_TASKS).forEach(([c,items])=>items.forEach(([title])=>{titleToCeremony[title]=c}));
 const groups=active.ceremonies.map(c=>({ceremony:c,tasks:active.tasks.filter(t=>titleToCeremony[t.title]===c||(!titleToCeremony[t.title]&&t.category==='Documentos'&&active.ceremonies.length===1))}));
 const general=active.tasks.filter(t=>!titleToCeremony[t.title]&&t.category==='Documentos');
 return <div className="page"><div className="page-intro"><div><p className="eyebrow">TRÁMITES</p><h2>Documentos y ceremonias</h2><p>Marca cada trámite cuando esté realizado y consulta el tiempo recomendado.</p></div></div><div className="notice"><Info size={18}/><span>Los requisitos pueden cambiar según estado, municipio, parroquia o institución. Confirma siempre la información oficial.</span></div>
 <div className="ceremony-grid">{groups.map(({ceremony,tasks})=><section className="panel ceremony-panel" key={ceremony}><div className="ceremony-head"><FileText/><div><p className="eyebrow">CEREMONIA</p><h3>{ceremony}</h3></div><span className="ceremony-progress">{tasks.filter(t=>t.done).length}/{tasks.length}</span></div>{tasks.map(t=><button className={`req checklist-req ${t.done?'completed':''}`} key={t.id} onClick={()=>patchItem('tasks',t.id,{done:!t.done})}>{t.done?<CheckCircle2 size={18}/>:<Circle size={18}/>}<div><b>{t.title}</b><small><Clock3 size={12}/> {t.window}</small>{t.notes&&<em>{t.notes}</em>}</div></button>)}{!tasks.length&&<div className="empty">No hay trámites cargados para esta ceremonia.</div>}</section>)}</div>
 {general.length>0&&<section className="panel"><div className="ceremony-head"><FileText/><div><p className="eyebrow">GENERALES</p><h3>Documentación general</h3></div></div>{general.map(t=><button className={`req checklist-req ${t.done?'completed':''}`} key={t.id} onClick={()=>patchItem('tasks',t.id,{done:!t.done})}>{t.done?<CheckCircle2 size={18}/>:<Circle size={18}/>}<div><b>{t.title}</b><small><Clock3 size={12}/> {t.window}</small></div></button>)}</section>}
 </div>}
