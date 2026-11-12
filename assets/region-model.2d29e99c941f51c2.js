import {normalizeQuery,matchesForm} from '/assets/aniimo-model.f4a49d2696e16024.js';
export function regionMatches(r,a,f){return (!f.region||(f.region==='unknown'?a.geographicStatus==='UNKNOWN':a.regionIds.includes(f.region)))&&(!f.completeness||f.completeness===(a.regionIds.length?'known':'unknown'))&&matchesForm(r,{query:'',elements:f.elements,roles:f.roles,group:'',stage:'',form:f.form,savedOnly:false});}
export const findRegions=(rows,query)=>rows.filter(r=>normalizeQuery([r.officialName,...Object.values(r.localizedNames)].join(' ')).includes(normalizeQuery(query)));
