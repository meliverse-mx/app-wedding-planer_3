# Mi Boda Planner V2

## Arranque rápido
1. `npm install`
2. `npm run dev`
3. Abre la URL de Vite.

La app funciona inmediatamente en modo demo/local con localStorage.

## Supabase (producción)
1. Crea un proyecto en Supabase.
2. Ejecuta `supabase-schema.sql` en SQL Editor.
3. Copia `.env.example` a `.env.local`.
4. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. `npm run dev`.

La UI ya tiene el flujo de autenticación. La capa siguiente para producción es conectar las operaciones CRUD del contexto a las tablas de Supabase y activar RLS (el SQL ya incluye las políticas).

## Google Sheets
1. Crea una Google Sheet.
2. Extensiones > Apps Script.
3. Pega `google-apps-script/Code.gs`.
4. Implementa como aplicación web y permite acceso a quien tenga el enlace.
5. Copia la URL de la Web App en Invitados > Respaldo Google Sheets.

También puedes usar `CSV / Excel` sin ninguna configuración.

## PDF
Desde Ajustes > Imprimir / PDF usa la opción de imprimir del navegador y selecciona Guardar como PDF.

## Modelo comercial
La pantalla Planes está preparada para conectar posteriormente Stripe/Mercado Pago. No incluye cobros reales todavía; eso requiere credenciales, webhook y política de suscripciones.


## Invitados y Google Sheets
La Web App de Google Apps Script debe desplegarse como **Web app**, ejecutar como tu cuenta y permitir acceso a quienes tengan el enlace. Usa la URL que termina en `/exec`. La app envía el respaldo como `text/plain` para evitar preflight CORS y no necesita leer la respuesta desde el navegador.

## Sesión
Supabase está configurado para persistir la sesión en el navegador y renovar el token automáticamente. La app no guarda contraseñas en localStorage; el navegador puede ofrecer guardarlas mediante su administrador de contraseñas.

## Invitados
Ahora se separan en Invitadas, Invitados y Niños. La tabla Supabase `guests` requiere las columnas `type`, `age` y `accompanied_by`; el SQL incluye una migración con `add column if not exists`.

## Pagos
Los botones de pago usan `checkoutUrl` en `src/data/pricing.js`. Después del pago, la clienta puede avisar por WhatsApp desde la pantalla de planes. La activación automática del plan requiere posteriormente Stripe/Mercado Pago + webhook + actualización del plan en Supabase.
