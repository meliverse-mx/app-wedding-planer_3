import React,{useMemo,useState} from 'react';
import {Check,Clock3,Search,CalendarDays,Plus,Edit3,Trash2,X,Save} from 'lucide-react';
import {useWedding} from '../context/WeddingContext';
import {CATEGORIES} from '../data/templates';

const EMPTY={title:'',notes:'',category:'Presupuesto',window:'Personalizada',dueDate:''};
const WINDOWS=['Personalizada','12–18 meses antes','9–12 meses antes','6–9 meses antes','3–6 meses antes','1–2 meses antes','1 mes antes','2 semanas antes','1 semana antes'];

export default function Tasks(){
 const {active,patchItem,addItem,removeItem}=useWedding();
 const [filter,setFilter]=useState('Todas');
 const [q,setQ]=useState('');
 const [editing,setEditing]=useState(null);
 const [form,setForm]=useState(EMPTY);
 const cats=['Todas',...new Set([...CATEGORIES,...active.tasks.map(t=>t.category).filter(Boolean)])];
 const tasks=useMemo(()=>active.tasks.filter(t=>(filter==='Todas'||t.category===filter)&&t.title.toLowerCase().includes(q.toLowerCase())),[active.tasks,filter,q]);
 const groups=tasks.reduce((a,t)=>{const k=t.window||'Sin periodo';(a[k]??=[]).push(t);return a},{});
 function openNew(){setForm(EMPTY);setEditing('new')}
 function openEdit(t){setForm({title:t.title||'',notes:t.notes||'',category:t.category||'Presupuesto',window:t.window||'Personalizada',dueDate:t.dueDate||''});setEditing(t.id)}
 function close(){setEditing(null);setForm(EMPTY)}
 function save(){
   if(!form.title.trim())return;
   const item={title:form.title.trim(),notes:form.notes.trim(),category:form.category.trim()||'General',window:form.window||'Personalizada',dueDate:form.dueDate||''};
   if(editing==='new')addItem('tasks',{...item,done:false});else patchItem('tasks',editing,item);
   close();
 }
 function del(t){if(window.confirm(`¿Eliminar la tarea “${t.title}”?`))removeItem('tasks',t.id)}
 return <div className="page">
   <div className="page-intro">
    <div><p className="eyebrow">CHECKLIST INTELIGENTE</p><h2>Todo lo que hay que hacer</h2><p>Marca pendientes, agrega actividades propias y ajusta fechas cuando quieras.</p></div>
    <div className="filters"><button className="primary" onClick={openNew}><Plus size={17}/> Nueva tarea</button><label className="search"><Search size={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar tarea..."/></label><select value={filter} onChange={e=>setFilter(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
   </div>
   {editing&&<section className="panel task-editor"><div className="panel-title"><div><p className="eyebrow">{editing==='new'?'NUEVA ACTIVIDAD':'EDITAR ACTIVIDAD'}</p><h3>{editing==='new'?'Agregar al checklist':'Modificar tarea'}</h3></div><button className="icon-btn" onClick={close} aria-label="Cerrar"><X size={17}/></button></div>
    <div className="task-editor-grid">
      <label>Título<input autoFocus value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ej. Confirmar pastel de boda"/></label>
      <label>Categoría<select value={CATEGORIES.includes(form.category)?form.category:'__custom'} onChange={e=>setForm({...form,category:e.target.value==='__custom'?'':e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}<option value="__custom">Personalizada…</option></select></label>
      {(!CATEGORIES.includes(form.category))&&<label>Categoría personalizada<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Ej. Música en vivo"/></label>}
      <label>Tiempo recomendado<select value={form.window} onChange={e=>setForm({...form,window:e.target.value})}>{WINDOWS.map(w=><option key={w}>{w}</option>)}</select></label>
      <label>Fecha concreta (opcional)<input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label>
      <label className="task-editor-notes">Notas<input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Detalles, proveedor, documentos, etc."/></label>
    </div>
    <div className="action-row"><button className="secondary" onClick={close}>Cancelar</button><button className="primary" onClick={save}><Save size={16}/> Guardar tarea</button></div>
   </section>}
   {Object.entries(groups).map(([period,items])=><section className="task-group" key={period}><div className="period-title"><Clock3 size={17}/><b>🕐 {period}</b><span>{items.filter(t=>t.done).length}/{items.length}</span></div>{items.map(t=><article className={`task-card ${t.done?'done':''}`} key={t.id}>
      <button className="task-check" onClick={()=>patchItem('tasks',t.id,{done:!t.done})} aria-label={t.done?'Marcar pendiente':'Marcar completada'}>{t.done&&<Check size={16}/>}</button>
      <div className="task-body"><div className="task-top"><h3>{t.title}</h3><div className="task-actions"><span className="tag">{t.category}</span><button className="icon-btn" onClick={()=>openEdit(t)} aria-label="Editar tarea"><Edit3 size={15}/></button><button className="icon-btn danger" onClick={()=>del(t)} aria-label="Eliminar tarea"><Trash2 size={15}/></button></div></div><p>{t.notes}</p><div className="task-meta"><span>🕐 <b>{t.window}</b></span>{t.dueDate&&<span><CalendarDays size={13}/> aprox. {t.dueDate}</span>}</div></div>
    </article>)}</section>)}
   {!tasks.length&&<div className="empty">No encontramos tareas con esos filtros. Puedes crear una con <b>+ Nueva tarea</b>.</div>}
 </div>
}
