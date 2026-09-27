export const CATEGORIES=['Presupuesto','Lugar','Ceremonia','Banquete','Foto y video','Música','Vestuario','Flores y decoración','Invitaciones','Anillos','Belleza','Transporte','Luna de miel','Invitados','Documentos','Día de boda'];
export const GENERAL_TASKS=[
['Definir presupuesto','12–18 meses antes','Presupuesto','Define un tope general y una reserva para imprevistos.'],
['Definir número aproximado de invitados','12–18 meses antes','Invitados','Sirve como base para salón, banquete e invitaciones.'],
['Elegir y reservar lugar','12–18 meses antes','Lugar','Compara capacidad, horarios, servicios incluidos y políticas.'],
['Contratar fotografía y video','9–12 meses antes','Foto y video','Revisa portafolio, horas, entregables y contrato.'],
['Contratar música o DJ','9–12 meses antes','Música','Define estilo musical, equipo y horario.'],
['Elegir vestido','9–12 meses antes','Vestuario','Considera pruebas, ajustes y tiempo de entrega.'],
['Elegir traje','6–9 meses antes','Vestuario','Programa pruebas y ajustes.'],
['Definir flores y decoración','6–9 meses antes','Flores y decoración','Arma concepto, colores y presupuesto.'],
['Elegir menú y hacer prueba','3–6 meses antes','Banquete','Confirma menú, bebidas, pastel y restricciones.'],
['Enviar invitaciones','3–6 meses antes','Invitaciones','Incluye enlace de RSVP si lo tienes.'],
['Cerrar RSVP','1–2 meses antes','Invitados','Confirma asistentes y restricciones alimentarias.'],
['Definir mesas','1 mes antes','Invitados','Asigna invitados y necesidades especiales.'],
['Preparar cronograma del día','1 mes antes','Día de boda','Coordina ceremonia, fotos, recepción y proveedores.'],
['Confirmar proveedores','2 semanas antes','Día de boda','Confirma horarios, contactos, saldos y accesos.'],
['Preparar kit de emergencia','1 semana antes','Día de boda','Incluye costurero, curitas, maquillaje, medicamentos autorizados y básicos.'],
['Confirmar documentos y expediente','1–2 meses antes','Documentos','Verifica vigencias y requisitos con la autoridad correspondiente.'],
['Planificar luna de miel','3–6 meses antes','Luna de miel','Reserva vuelos, hospedaje, seguros y documentos.']
];
export const CEREMONY_TASKS={
  Civil:[['Verificar requisitos del Registro Civil','4–6 meses antes','Documentos','Los requisitos cambian por estado y municipio. Verifica la fuente oficial.'],['Solicitar actas y revisar vigencia','2–3 meses antes','Documentos','Guarda copias digitales.'],['Reunir identificaciones y documentación','2–3 meses antes','Documentos','Revisa nombres, CURP y datos.'],['Definir régimen matrimonial','1–2 meses antes','Documentos','Consulta las opciones disponibles con la autoridad.'],['Confirmar testigos','1–2 meses antes','Ceremonia','Confirma disponibilidad y documentos.'],['Agendar trámite/fecha','1–2 meses antes','Ceremonia','Guarda comprobantes.']],
  Iglesia:[['Contactar parroquia y disponibilidad','9–12 meses antes','Ceremonia','Pregunta por fechas y requisitos.'],['Solicitar requisitos de la parroquia','9–12 meses antes','Documentos','Pueden variar por parroquia y diócesis.'],['Reunir actas o constancias religiosas','6–9 meses antes','Documentos','Pregunta por vigencias.'],['Tomar curso o pláticas prematrimoniales','3–6 meses antes','Ceremonia','Aplica si la parroquia lo solicita.'],['Entregar expediente','2–4 meses antes','Documentos','Confirma que esté completo.'],['Confirmar padrinos, música y detalles','1–2 meses antes','Ceremonia','Define participantes y rituales.']],
  Religiosa:[['Definir institución y oficiante','9–12 meses antes','Ceremonia','Asegura disponibilidad.'],['Solicitar requisitos específicos','9–12 meses antes','Documentos','Los requisitos dependen de la tradición o institución.'],['Reunir documentación','6–9 meses antes','Documentos','Conserva copias.'],['Realizar preparación o cursos','3–6 meses antes','Ceremonia','Si aplica.'],['Entregar documentos y confirmar ceremonia','2–4 meses antes','Documentos','Confirma fecha, hora y participantes.'],['Definir rituales, lecturas y participantes','1–2 meses antes','Ceremonia','Deja el orden por escrito.']]
};
export const GODPARENT_ROLES=['Anillos','Arras','Lazo','Biblia / Rosario','Velación','Cojines','Ramo','Otro'];
export function makeTasks(ceremonies,date){const all=[...GENERAL_TASKS];(ceremonies||[]).forEach(c=>(CEREMONY_TASKS[c]||[]).forEach(t=>all.push(t)));return all.map(([title,window,category,notes],i)=>({id:`task_${Date.now()}_${i}_${Math.random().toString(36).slice(2,5)}`,title,window,category,notes,done:false,dueDate:approxDue(date,window)}));}
function approxDue(date,window){if(!date)return '';const m=window.match(/(\d+)–(\d+)/);if(m){const avg=(Number(m[1])+Number(m[2]))/2;const d=new Date(`${date}T00:00:00`);d.setMonth(d.getMonth()-avg);return d.toISOString().slice(0,10)}const one=window.match(/(\d+)/);if(one){const n=Number(one[1]);const d=new Date(`${date}T00:00:00`);d.setDate(d.getDate()-n*30);return d.toISOString().slice(0,10)}return ''}
