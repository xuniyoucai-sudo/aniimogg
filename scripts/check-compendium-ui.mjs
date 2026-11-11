import fs from 'node:fs';import assert from 'node:assert/strict';
import {normalizeSnapshot} from './aniimo-snapshot.mjs';
import {normalizeQuery,matchesForm,createCollection} from '../src/assets/compendium.js';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const site=read('src/data/site.json');const {entities}=normalizeSnapshot(read('src/data/aniimo-index.json'),read('src/data/aniimo-index-manifest.json'),site.aniimoAliases);
const records=entities.map(r=>({...r,sourceRecordId:String(r.sourceRecordId),search:normalizeQuery([r.officialName,...Object.values(r.localizedNames),...r.aliases,r.entryNo,r.entryKey,r.formType].join(' '))}));
const all={query:'',elements:[],roles:[],group:'',stage:'',form:'',savedOnly:false,saved:new Set()};const filter=f=>records.filter(r=>matchesForm(r,{...all,...f}));
for(const [query,n] of [['Emberpup',1],['Witchin',1],['001',4],['no-such-record',0],['  ＥＭＢＥＲＰＵＰ  ',1],['ember pup',1],['Prismana',12]])assert.equal(filter({query}).length,n,query);
for(const r of records)assert.equal(filter({query:r.sourceRecordId})[0]?.entityId,r.entityId);
assert.equal(filter({form:'basic-form'}).length,118);assert.equal(filter({stage:'4'}).length,2);assert.equal(filter({form:'prismana-form'}).length,12);
assert.deepEqual(new Set(filter({elements:['fire','water']}).map(r=>r.entityId)),new Set([...filter({elements:['fire']}),...filter({elements:['water']})].map(r=>r.entityId)));
assert.ok(filter({elements:['fire','water'],roles:['dps','sup']}).every(r=>r.elements.some(v=>['fire','water'].includes(v))&&r.roles.some(v=>['dps','sup'].includes(v))));
const messages=['blocked','unknown','damaged'];
for(const seed of ['["001","300301:001","unknown-old-id"]','{broken','{}']){
 const data=new Map([['aniimo-guide-collection-v1',seed]]),warnings=[];const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const c=createCollection(records,()=>storage,m=>warnings.push(m),messages);assert.equal(data.get('aniimo-guide-collection-v1'),seed);
 if(seed.startsWith('[')){assert.equal(c.saved.size,2);c.toggle('003');const state=JSON.parse(data.get('aniimo-guide-collection-v2'));assert.equal(state.entityIds.length,3);assert.deepEqual(state.unrecognizedIds,['unknown-old-id']);const before=data.get('aniimo-guide-collection-v2');createCollection(records,()=>storage,()=>{},messages);assert.equal(data.get('aniimo-guide-collection-v2'),before);}
 else{assert.ok(warnings.includes('damaged'));c.toggle('001');assert.ok(!data.has('aniimo-guide-collection-v2'));assert.equal(c.saved.size,1);}
}
const warnings=[];const blocked=createCollection(records,()=>{throw Error('blocked');},m=>warnings.push(m),messages);blocked.toggle('001');assert.equal(blocked.saved.size,1);assert.ok(warnings.includes('blocked'));
console.log('PASS 130 real records: Unicode/alias/ID search, OR/AND filters, 118+12, unknown stages; unchanged v2 migration/idempotence, unknown IDs, corrupt and blocked storage.');
