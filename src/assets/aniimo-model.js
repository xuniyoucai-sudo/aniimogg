export const normalizeQuery=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/\s+/gu,' ').trim();
export function matchesForm(r,f){
 const q=normalizeQuery(f.query);
 const search=!q||(/^\d+$/.test(q)?(r.entryNo.includes(q)||r.sourceRecordId===q):q.includes(':')?normalizeQuery(r.entryKey)===q:r.search.includes(q)||r.search.replace(/\s/g,'').includes(q.replace(/\s/g,'')));
 return search&&(!f.elements.length||f.elements.some(v=>r.elements.includes(v)))&&(!f.roles.length||f.roles.some(v=>r.roles.includes(v)))&&(!f.group||String(r.indexGroupId)===f.group)&&(!f.stage||String(r.stageCode)===f.stage)&&(!f.form||r.formType===f.form)&&(!f.savedOnly||f.saved.has(r.entryKey));
}

export const displayName=(r,lang,unknown)=>r?.localizedNames?.[lang]||r?.officialName||unknown;
