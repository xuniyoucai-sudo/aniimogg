// A visible number can repeat across regions. Preserve legacy bookmark keys
// only for the unsuffixed public routes; new regional records are namespaced.
export const entryKey=row=>row[7].endsWith('/basic-form')?row[0]:`${row[6]}:${row[0]}`;
export const entryUrl=row=>'https://wiki.aniimo.com'+row[7];
export const sortEntries=rows=>rows.sort((a,b)=>entryKey(a).localeCompare(entryKey(b)));
export function normalizeOfficial(records,publicHtml){
  const paths=new Set([...publicHtml.matchAll(/href="(\/item\/[^"?#]+)"/g)].map(m=>m[1]));
  const rows=records.filter(x=>x.visible).map(x=>{
    const s=x.searchKey,country=Number(s.countryId),base=`/item/${s.entryId}/basic-form`,regional=`${base}/${country}`;
    const route=paths.has(regional)?regional:paths.has(base)?base:null;
    if(!route)throw new Error(`Public route unavailable: ${s.name} / ${country}`);
    return [s.entryId,x.id,s.name,Number(s.currentStage),s.position.map(v=>v.replace('position-','')).sort(),s.attributes.map(v=>v.replace('attributes-','')).sort(),country,route];
  });
  if(new Set(rows.map(entryKey)).size!==rows.length)throw new Error('Official regional identities are not unique');
  if(new Set(rows.map(x=>x[7])).size!==rows.length)throw new Error('Official public routes are not unique');
  return sortEntries(rows);
}
