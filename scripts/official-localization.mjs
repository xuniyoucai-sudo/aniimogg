import {entryKey,entryForm} from './aniimo-records.mjs';
export const sources={en:'https://wiki.aniimo.com/','zh-CN':'https://wiki.yimo.com/','zh-TW':'https://wiki.aniimo.com/tw',ja:'https://wiki.aniimo.com/ja'};
export function parseOfficialIndex(html){
 const match=html.match(/id="__NUXT_DATA__">(.*?)<\/script>/s);if(!match)throw Error('Official SSR payload unavailable');
 const pool=JSON.parse(match[1]);
 const decode=i=>{if(i<0)return null;const v=pool[i];if(Array.isArray(v))return typeof v[0]==='string'?decode(v[1]):v.map(decode);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,decode(x)]));return v;};
 const data=decode(0).data,list=Object.entries(data).find(([k])=>k.startsWith('aniimo-wiki-list-'))?.[1];
 if(!Array.isArray(list))throw Error('Official list unavailable');
 const paths=new Set([...html.matchAll(/href="([^"?#]*\/item\/[^"?#]+)"/g)].map(m=>m[1]));
 const records=list.filter(r=>r.visible).map(r=>{const s=r.searchKey,form={'Basic Form':'basic-form','Prismana Form':'prismana-form'}[s.currentMorphology];if(!form)throw Error('Unknown official morphology');const base=`/item/${s.entryId}/${form}`,suffixes=[base+'/'+s.countryId,base],path=suffixes.flatMap(suffix=>[suffix,'/tw'+suffix,'/ja'+suffix]).find(p=>paths.has(p));if(!path)throw Error('Missing official detail path: '+r.id);return {...r,path,form};});
 if(new Set(records.map(r=>r.path)).size!==records.length)throw Error('Ambiguous official routes');
 return records;
}
export function matchLocalizations(rows,indexes,verifiedAt){
 const records={},differences=[],coverage={};
 for(const row of rows)records[row[1]]={entryKey:entryKey(row),officialName:row[2],localizedNames:{},localizationEvidence:{}};
 const english=new Map(indexes.en.map(r=>[String(r.id),r]));
 const stable=s=>JSON.stringify([String(s.entryId),Number(s.countryId),s.currentMorphology,Number(s.sortOrder),String(s.currentStage),[...s.position].sort(),[...s.attributes].sort(),s.imageUrl.split('/').at(-1)]);
 for(const [lang,list] of Object.entries(indexes)){
  coverage[lang]={target:rows.length,matched:0,unmatched:0};
  for(const row of rows){const out=records[row[1]],en=english.get(row[1]);let status='NOT_FOUND',candidates=[];
   if(!en||en.path!==row[7]||en.form!==entryForm(row)||Number(en.searchKey.countryId)!==row[6]||en.searchKey.name!==row[2])status='SOURCE_CHANGED';
   else {candidates=list.filter(r=>r.path.replace(/^\/(?:tw|ja)(?=\/)/,'')===row[7]);if(candidates.length>1)status='AMBIGUOUS';else if(candidates.length===1)status=stable(candidates[0].searchKey)===stable(en.searchKey)?'official':'SOURCE_CHANGED';}
   const r=candidates[0];
   out.localizationEvidence[lang]={sourceUrl:r?new URL(r.path,sources[lang]).href:sources[lang],status,verifiedAt,...(r?{sourceRecordId:String(r.id)}:{})};
   if(status==='official'&&r.searchKey.name.trim()){out.localizedNames[lang]=r.searchKey.name.trim();coverage[lang].matched++;}else{coverage[lang].unmatched++;differences.push({sourceRecordId:row[1],entryKey:out.entryKey,lang,status});}
  }
 }
 return {version:1,verifiedAt,matching:'English sourceRecordId + exact locale-stripped public detail path + form/country/sortOrder/stage/roles/elements/artwork filename; never entryNo alone',sources,coverage,differences,records};
}
