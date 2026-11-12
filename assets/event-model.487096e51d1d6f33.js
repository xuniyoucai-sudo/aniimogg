export const CHECKLIST_KEY='aniimogg-event-checklist-v1';
export const SERVERS=['europe','americas','apac'];
export function eventStatus(e,server,now=Date.now()){
 if(['POSTPONED','CANCELLED','NEEDS_RECHECK','UNKNOWN'].includes(e.status))return e.status;
 const s=e.serverSchedules?.[server];if(!s)return 'UNKNOWN';
 if(s.scheduledEndAt&&now>=Date.parse(s.scheduledEndAt)+(s.scheduledEndAt.includes(':59:00')?60000:0))return 'ENDED_BY_SCHEDULE';
 if(s.scheduledStartAt&&now<Date.parse(s.scheduledStartAt))return 'UPCOMING';
 if(!e.activationEvidence)return e.activationGate?'AWAITING_UPDATE_CONFIRMATION':'ANNOUNCED';
 if(s.actualStartAt&&now<Date.parse(s.actualStartAt))return 'UPCOMING';
 return s.scheduledEndAt&&Date.parse(s.scheduledEndAt)-now<=3*86400000?'ENDING_SOON':'ACTIVE_CONFIRMED';
}
export function rewardStatus(r,e,server,checked,now=Date.now()){
 if(checked)return 'CLAIMED_BY_USER';
 if(r.claimEndAt&&now>Date.parse(r.claimEndAt))return 'EXPIRED_BY_SCHEDULE';
 if(e&&eventStatus(e,server,now)==='ENDED_BY_SCHEDULE')return 'EXPIRED_BY_SCHEDULE';
 if(r.claimStartAt&&now<Date.parse(r.claimStartAt))return 'UPCOMING';
 if(!r.claimEvidence)return e&&eventStatus(e,server,now)==='UPCOMING'?'UPCOMING':'UNKNOWN';
 return r.claimableEvidence?'CLAIMABLE':'AVAILABLE';
}
export function codeStatus(r,now=Date.now(),days=7){
 if(r.expiryConfirmed&&r.expiryAt&&now>=Date.parse(r.expiryAt))return 'EXPIRED_CONFIRMED';
 if(r.recheckResult==='NEEDS_RECHECK'||!r.sourceCheckedAt||!Number.isFinite(Date.parse(r.sourceCheckedAt))||now-Date.parse(r.sourceCheckedAt)>days*86400000)return 'NEEDS_RECHECK';
 return r.officialEvidence?'OFFICIAL_CONFIRMED':r.reportedStatus==='reported_expired'?'REPORTED_EXPIRED':r.reportedStatus==='third_party_reported_active'?'THIRD_PARTY_REPORTED_ACTIVE':'UNKNOWN';
}
export function maintenanceStatus(u,now=Date.now()){
 if(u.completionEvidence)return 'UPDATE_RELEASED_CONFIRMED';
 if(u.status==='MAINTENANCE_DELAYED')return u.status;
 if(u.maintenance&&now>Date.parse(u.maintenance.europe.scheduledEndAt))return 'MAINTENANCE_WINDOW_ELAPSED_NEEDS_CONFIRMATION';
 return u.status;
}
export function wallTime(date,time,offset){
 if(time==='24:00')return new Date(Date.parse(date+'T00:00:00'+offset)+86400000).toISOString();
 return new Date(date+'T'+time+':00'+offset).toISOString();
}
const empty=()=>({server:'all',records:[]});
export function parseChecklist(raw){
 if(raw===null)return empty();const d=JSON.parse(raw);
 if(!d||!['all',...SERVERS].includes(d.server)||!Array.isArray(d.records)||d.records.length>10000||Object.keys(d).some(k=>!['server','records'].includes(k)))throw Error('Invalid checklist');
 const seen=new Set();for(const r of d.records){if(!r||typeof r.eventId!=='string'||typeof r.taskId!=='string'||r.eventId.length>160||r.taskId.length>160||typeof r.checked!=='boolean'||!(r.checkedAt===null||typeof r.checkedAt==='string'&&Number.isFinite(Date.parse(r.checkedAt))))throw Error('Invalid task');if(Object.keys(r).some(k=>!['eventId','taskId','checked','checkedAt'].includes(k)))throw Error('Unknown task field');const key=JSON.stringify([r.eventId,r.taskId]);if(seen.has(key))throw Error('Duplicate task');seen.add(key);}
 return d;
}
// Compare-and-write preserves the exact previous raw bytes on corruption,
// storage denial and concurrent changes. No other storage key is accessed.
export function checklistStore(storage){
 let raw=null,data=empty(),persistent=true;
 try{raw=storage.getItem(CHECKLIST_KEY);data=parseChecklist(raw);}catch{persistent=false;}
 return {get data(){return data;},get persistent(){return persistent;},write(next){parseChecklist(JSON.stringify(next));data=next;if(!persistent)return false;try{if(storage.getItem(CHECKLIST_KEY)!==raw)throw Error('Concurrent change');const value=JSON.stringify(next);storage.setItem(CHECKLIST_KEY,value);raw=value;return true;}catch{persistent=false;return false;}},conflict(){persistent=false;}};
}
