// Cada plan debe tener su propio enlace de pago con el monto ya fijado.
// Mercado Pago: crea un Link de pago por cada precio y pega aquí la URL /link.mercadopago.com.mx correspondiente.
export const plans=[
{name:'Gratis',price:'$0',desc:'Para empezar a organizar tu boda.',features:['1 boda','Checklist básico','Invitados','Cortejo y padrinos','Presupuesto básico','Trámites'],checkoutUrl:''},
{name:'Pro',price:'$249',period:'pago único',desc:'Todo lo que necesitas para llevar tu boda en orden.',features:['Todo Gratis','Calendario inteligente','Proveedores y pagos','Mesas y RSVP','Exportar PDF','Respaldo Google Sheets','Cronograma del día','Recordatorios'],checkoutUrl:''},
{name:'Wedding Planner',price:'$399',period:'/ mes',desc:'Para profesionales que gestionan varias bodas.',features:['Bodas ilimitadas','Panel de clientas','Tareas por boda','Presupuestos y proveedores','Exportaciones','Marca personal','Gestión de equipo'],checkoutUrl:''}
];
