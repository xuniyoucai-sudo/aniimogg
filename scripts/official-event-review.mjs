// An editor can acknowledge an elapsed schedule by verifying the record after
// its deadline. Do not reopen the same review forever merely because history
// remains in the catalog. This never asserts an in-game closure.
export function expiredEventReviews(events,now=Date.now()){
 return events.filter(e=>Object.values(e.serverSchedules||{}).some(s=>{
  const parsed=Date.parse(s.scheduledEndAt),end=parsed+(s.scheduledEndAt?.includes(':59:00')?60000:0),verified=Date.parse(e.verifiedAt);
  return Number.isFinite(end)&&now>=end&&!(Number.isFinite(verified)&&verified>=end&&verified<=now);
 })).map(e=>e.eventId);
}

// Review queues are editorial reminders, never inferred game state changes.
export function operationReviews({events=[],rewards=[],codes=[]},now=Date.now()){
 const due=(value,verified,lead=0)=>{const t=Date.parse(value),v=Date.parse(verified);return Number.isFinite(t)&&now>=t-lead&&!(Number.isFinite(v)&&v>=t-lead&&v<=now);};
 return {
  beforeStart:events.filter(e=>Object.values(e.serverSchedules||{}).some(s=>due(s.scheduledStartAt,e.verifiedAt,86400000))).map(e=>e.eventId),
  afterEnd:expiredEventReviews(events,now),
  claimStarts:rewards.filter(r=>due(r.claimStartAt,r.verifiedAt,86400000)).map(r=>r.rewardId),
  claimDeadlines:rewards.filter(r=>due(r.claimEndAt,r.verifiedAt,86400000)).map(r=>r.rewardId),
  codesSevenDays:codes.filter(c=>!Number.isFinite(Date.parse(c.sourceCheckedAt))||now-Date.parse(c.sourceCheckedAt)>=7*86400000).map(c=>c.code),
  unknownEvents:events.filter(e=>!e.activationEvidence||Object.values(e.serverSchedules||{}).some(s=>!s.actualStartAt)).map(e=>e.eventId),
  unknownClaims:rewards.filter(r=>!r.claimStartAt||!r.claimEndAt).map(r=>r.rewardId)
 };
}
