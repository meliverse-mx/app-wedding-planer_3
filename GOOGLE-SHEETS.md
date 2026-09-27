# Respaldo de invitados en Google Sheets

La app puede enviar la lista de invitados a una hoja de Google Sheets mediante un pequeño Apps Script.

## Configuración (una sola vez)

1. Crea una hoja nueva en Google Sheets.
2. Ve a **Extensiones > Apps Script**.
3. Abre el archivo `google-apps-script/Code.gs` de este proyecto y copia su contenido al editor de Apps Script.
4. Guarda el proyecto.
5. Pulsa **Implementar > Nueva implementación**.
6. Selecciona **Aplicación web**.
7. En "Ejecutar como", selecciona tu cuenta.
8. En "Quién tiene acceso", selecciona la opción que permita acceso a cualquiera que tenga el enlace (Google puede mostrar una confirmación de permisos).
9. Implementa y copia la URL que termina en `/exec`.
10. En la app, entra a **Invitados > Google Sheets**, pega esa URL y pulsa **Guardar enlace**.
11. Pulsa **Respaldar** cada vez que quieras actualizar la hoja.

La app reemplaza el contenido del respaldo para que refleje altas, confirmaciones y eliminaciones actuales.

## Alternativa rápida

En **Invitados > CSV** puedes descargar la lista como archivo compatible con Excel/Google Sheets sin configurar Apps Script.

> Nota: no compartas públicamente la URL de tu Apps Script. Si la app se va a vender a muchas parejas, conviene migrar esta función a un backend con autenticación y una conexión individual de cada novia a su propia cuenta de Google.
