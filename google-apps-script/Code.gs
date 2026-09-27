function doGet(e) {
  return json_({ok:true,service:'Mi Boda Planner',message:'Web App activa. Usa POST para respaldar invitados.'});
}
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    if (payload.action === 'replaceGuests') return replaceGuests_(payload.guests || []);
    return json_({ok:false,error:'Acción no soportada'});
  } catch (err) { return json_({ok:false,error:String(err)}); }
}
function replaceGuests_(guests) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Invitados') || ss.insertSheet('Invitados');
  sh.clearContents();
  const rows = [['ID','Tipo','Nombre','Edad','Acompañante','Teléfono','Correo','Confirmado']].concat(guests.map(g=>[g.id||'',g.type||'mujer',g.name||'',g.age||'',g.accompaniedBy||'',g.phone||'',g.email||'',g.confirmed?'Sí':'No']));
  sh.getRange(1,1,rows.length,rows[0].length).setValues(rows);
  sh.setFrozenRows(1); sh.autoResizeColumns(1,rows[0].length);
  return json_({ok:true,count:guests.length});
}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
