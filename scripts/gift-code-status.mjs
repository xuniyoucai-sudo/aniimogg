export function giftCodeStatus(record,{asOf,freshnessDays}){
 if(record.expiryAt&&Date.parse(asOf)>=Date.parse(record.expiryAt))return 'expired_confirmed';
 if(record.reportedStatus==='reported_expired')return 'reported_expired';
 if(!record.sourceCheckedAt||!Number.isFinite(Date.parse(record.sourceCheckedAt+'T00:00:00Z'))||!Number.isFinite(Date.parse(asOf))||Date.parse(asOf)-Date.parse(record.sourceCheckedAt+'T00:00:00Z')>freshnessDays*86400000)return 'needs_recheck';
 return record.reportedStatus||'unknown';
}
