export function daysUntil(date){if(!date)return 0;const d=new Date(`${date}T00:00:00`);const now=new Date();now.setHours(0,0,0,0);return Math.max(0,Math.ceil((d-now)/86400000))}
export function monthsBeforeDate(date,months){const d=new Date(`${date}T00:00:00`);d.setMonth(d.getMonth()-months);return d}
export function formatDate(date){if(!date)return 'Sin fecha';return new Intl.DateTimeFormat('es-MX',{dateStyle:'long'}).format(new Date(`${date}T00:00:00`))}
export function formatShortDate(date){if(!date)return '';return new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short'}).format(new Date(`${date}T00:00:00`))}
