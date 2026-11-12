// An editor can acknowledge an elapsed schedule by verifying the record after
// its deadline. Do not reopen the same review forever merely because history
// remains in the catalog. This never asserts an in-game closure.
export function expiredEventReviews(events,now=Date.now()){
 return events.filter(e=>Object.values(e.serverSchedules||{}).some(s=>{
  const parsed=Date.parse(s.scheduledEndAt),end=parsed+(s.scheduledEndAt?.includes(':59:00')?60000:0),verified=Date.parse(e.verifiedAt);
  return Number.isFinite(end)&&now>=end&&!(Number.isFinite(verified)&&verified>=end&&verified<=now);
 })).map(e=>e.eventId);
}
