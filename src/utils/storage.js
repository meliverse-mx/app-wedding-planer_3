const KEY='miBodaPlannerV2';
export function loadLocal(){try{const data=JSON.parse(localStorage.getItem(KEY));if(!data)return null;return {...data,weddings:(data.weddings||[]).map(w=>({...w,guestEstimate:Number(w.guestEstimate ?? (typeof w.guests==='number'?w.guests:0))||0,guests:Array.isArray(w.guests)?w.guests:[]}))}}catch{return null}}
export function saveLocal(data){localStorage.setItem(KEY,JSON.stringify(data))}
export function clearLocal(){localStorage.removeItem(KEY)}
export function uid(prefix='id'){return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,9)}`}
