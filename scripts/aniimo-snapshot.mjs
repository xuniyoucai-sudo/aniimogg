import {createHash} from 'node:crypto';
import {entryKey,entryForm,entryUrl} from './aniimo-records.mjs';
export function snapshotCounts(rows){return {totalRecords:rows.length,basicRecords:rows.filter(r=>entryForm(r)==='basic-form').length,prismanaRecords:rows.filter(r=>entryForm(r)==='prismana-form').length};}
export function normalizeSnapshot(rows,manifest,aliases={}){
 const counts=snapshotCounts(rows);
 for(const key of Object.keys(counts))if(counts[key]!==manifest[key])throw new Error(`Snapshot manifest mismatch: ${key}`);
 const entities=rows.map(r=>({entityId:'ag-'+createHash('sha256').update(String(r[1])).digest('hex').slice(0,16),sourceRecordId:r[1],entryNo:r[0],entryKey:entryKey(r),indexGroupId:r[6],formType:entryForm(r),speciesId:null,familyId:null,parentFormId:null,officialName:r[2],localizedNames:{en:r[2]},aliases:aliases[entryKey(r)]||[],elements:r[5],roles:r[4],stageCode:r[3],stageLabel:({1:'Lumin',2:'Gamma',3:'Nova'})[r[3]]||null,sourceUrl:entryUrl(r),sourceType:'official',informationStatus:'official',gameVersion:null,platform:null,serverScope:null,lastVerifiedAt:manifest.snapshotDate,observedAt:manifest.snapshotDate,publishedAt:null,modifiedAt:null,verificationMethod:manifest.verificationMethod}));
 if(new Set(entities.map(e=>e.entityId)).size!==rows.length)throw new Error('Duplicate source identity');
 return {counts,entities,legacyToEntity:Object.fromEntries(entities.map(e=>[e.entryKey,e.entityId]))};
}
