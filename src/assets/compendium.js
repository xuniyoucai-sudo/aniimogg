import {normalizeQuery,matchesForm,displayName} from './aniimo-model.js';
export {normalizeQuery,matchesForm};
export function createCollection(records,getStorage,warn,copy){
 const legacyToEntity=new Map(records.map(r=>[r.entryKey,r.entityId])),entityToLegacy=new Map(records.map(r=>[r.entityId,r.entryKey]));
 const saveKey='aniimo-guide-collection-v1',schemaKey='aniimo-guide-collection-v2';
 let saved=new Set(),unknown=[],writable=true,original=null,storage;
 const persist=()=>{if(!writable){warn(copy[0]);return;}try{storage.setItem(schemaKey,JSON.stringify({version:2,entityIds:[...saved].map(id=>legacyToEntity.get(id)),unrecognizedIds:unknown}));}catch{writable=false;warn(copy[0]);}};
 try{
  storage=getStorage();const v2=storage.getItem(schemaKey);original=v2??storage.getItem(saveKey);const values=JSON.parse(original||'[]');let ids;
  if(v2!==null){if(values?.version!==2||!Array.isArray(values.entityIds)||!Array.isArray(values.unrecognizedIds)||[...values.entityIds,...values.unrecognizedIds].some(x=>typeof x!=='string'))throw new TypeError('Invalid v2');ids=[...values.entityIds.map(id=>entityToLegacy.get(id)||id),...values.unrecognizedIds];}
  else{if(!Array.isArray(values)||values.some(x=>typeof x!=='string'))throw new TypeError('Invalid v1');ids=values;}
  saved=new Set(ids.filter(id=>legacyToEntity.has(id)));unknown=[...new Set(ids.filter(id=>!legacyToEntity.has(id)))];if(unknown.length)warn(copy[1]+' ('+unknown.length+')');
  storage.setItem('aniimo-guide-storage-probe','1');storage.removeItem('aniimo-guide-storage-probe');if(v2===null&&original!==null)persist();
 }catch{writable=false;warn(original!==null?copy[2]:copy[0]);}
 return {get saved(){return saved;},toggle(id){if(!legacyToEntity.has(id))return;if(saved.has(id))saved.delete(id);else saved.add(id);persist();}};
}
if(typeof document!=='undefined')document.querySelectorAll('.aniimo-index[data-compendium]').forEach(index=>{
 const config=JSON.parse(index.querySelector('.compendium-data').textContent),{q,x,date,localizationDate}=config;
 const records=config.rows.map(a=>{const [entityId,entryKey,sourceRecordId,entryNo,officialName,localizedNames,aliases,elements,roles,indexGroupId,formType,stageCode,sourceUrl]=a;return {entityId,entryKey,sourceRecordId,entryNo,officialName,localizedNames,aliases,elements,roles,indexGroupId,formType,stageCode,sourceUrl,localizedSourceUrl:config.localizedSourcePrefix+new URL(sourceUrl).pathname,stageLabel:stageCode===4?null:x.stageLabels[stageCode]||null,speciesId:null,familyId:null,parentFormId:null};});
 const byId=new Map(records.map(r=>[r.entityId,r])),byKey=new Map(records.map(r=>[r.entryKey,r]));
 records.forEach(r=>{r.name=displayName(r,document.documentElement.lang,q.unknown);r.search=normalizeQuery([r.officialName,...Object.values(r.localizedNames),...r.aliases,r.entryNo,r.sourceRecordId,r.entryKey,r.entityId,r.formType,x.formLabels[r.formType]].join(' '));});
 const find=s=>index.querySelector(s),search=find('.index-search'),element=find('.index-element'),role=find('.index-role'),group=find('.index-region'),stage=find('.index-stage'),form=find('.index-form'),collection=find('.index-collection');
 const warning=find('.collection-warning'),announce=find('.compendium-feedback');
 const collectionState=createCollection(records,()=>localStorage,message=>{warning.hidden=false;warning.textContent=message;},config.storageMessages);
 const notify=message=>{announce.textContent=message;index.querySelectorAll('.dialog-feedback').forEach(p=>{p.textContent=message;});};
 const selected=new Set(),cards=[...index.querySelectorAll('.aniimo-card')];
 const escape=value=>String(value??q.unknown).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tags=(values,labels)=>values.length?values.map(v=>`<span class="index-tag">${escape(labels[v]||v)}</span>`).join(' '):escape(q.unknown);
 const labelStage=r=>r.stageLabel||q.unknown;
 const name=r=>escape(r.name);
 const saveButton=r=>`<button type="button" data-aniimo-save="${escape(r.entryKey)}" data-save-text="${escape(x.save)}" data-remove-text="${escape(x.remove)}" aria-pressed="false"><span aria-hidden="true">☆</span> <span class="aniimo-save-label">${escape(x.save)}</span></button>`;
 const compareButton=r=>`<button type="button" data-compare="${r.entityId}" aria-pressed="${selected.has(r.entityId)}">${escape(selected.has(r.entityId)?q.removeCompare:q.compare)}</button>`;
 // Table DOM is constructed once, not re-parsed or recreated on each input.
 find('tbody').innerHTML=records.map(r=>`<tr data-aniimo-entry="${escape(r.entryKey)}"><td>${escape(r.entryNo)}</td><td><button type="button" data-detail="${r.entityId}">${name(r)}</button> · ${escape(x.formLabels[r.formType])}</td><td>${tags(r.elements,x.elementLabels)}</td><td>${tags(r.roles,x.roleLabels)}</td><td>${escape(labelStage(r))}</td></tr>`).join('');
 const rows=[...index.querySelectorAll('.index-table-wrap tbody tr')];
 const resetFilters=()=>{search.value='';group.value='';stage.value='';form.value='';collection.value='all';for(const s of [element,role])for(const option of s.options)option.selected=false;};
 const apply=()=>{
  const f={query:search.value,elements:[...element.selectedOptions].map(o=>o.value).filter(Boolean),roles:[...role.selectedOptions].map(o=>o.value).filter(Boolean),group:group.value,stage:stage.value,form:form.value,savedOnly:collection.value==='saved',saved:collectionState.saved};
  const visible=new Set(records.filter(r=>matchesForm(r,f)).map(r=>r.entryKey));
  cards.forEach(c=>{c.hidden=!visible.has(c.dataset.aniimoEntry);});rows.forEach(r=>{r.hidden=!visible.has(r.dataset.aniimoEntry);});
  find('.index-count').textContent=index.dataset.showing.replace('{count}',String(visible.size));find('.index-empty').hidden=visible.size!==0||(f.savedOnly&&f.saved.size===0);find('.index-empty-saved').hidden=!f.savedOnly||f.saved.size!==0;
 };
 const syncSaved=()=>{
  index.querySelectorAll('[data-aniimo-save]').forEach(b=>{const r=byKey.get(b.dataset.aniimoSave),active=collectionState.saved.has(r.entryKey);b.setAttribute('aria-pressed',String(active));b.classList.toggle('is-saved',active);b.querySelector('[aria-hidden]').textContent=active?'★':'☆';b.querySelector('.aniimo-save-label').textContent=active?x.remove:x.save;b.setAttribute('aria-label',(active?x.remove:x.save)+' '+r.name);});
  find('.index-collection-count').textContent=x.collectionCount.replace('{count}',String(collectionState.saved.size));
 };
 const detail=find('.form-detail'),comparison=find('.form-comparison');let detailOpener=null,compareOpener=null;
 const detailRows=r=>[[q.entity,r.entityId],[q.officialName,r.officialName],[q.localizedName,r.localizedNames[document.documentElement.lang]||q.unknown],[q.number,r.entryNo],[q.form,x.formLabels[r.formType]],[q.elements,r.elements.map(v=>x.elementLabels[v]||v).join(' / ')],[q.roles,r.roles.map(v=>x.roleLabels[v]||v).join(' / ')],[q.group,String(r.indexGroupId)],[q.stage,labelStage(r)],[q.aliases,r.aliases.join(' / ')||q.unknown],[q.sourceId,r.sourceRecordId],[q.verified,date],[q.localizationVerified,localizationDate||q.unknown],[q.status,q.official]];
 const showDetails=(id,opener)=>{const r=byId.get(id);if(!r)return;detailOpener=opener;detail.querySelector('.detail-content').innerHTML=`<h2 id="form-detail-title">${name(r)}</h2><dl>${detailRows(r).map(([k,v])=>`<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`).join('')}<div><dt>${escape(q.sourceUrl)}</dt><dd><a href="${escape(r.localizedSourceUrl||r.sourceUrl)}" target="_blank" rel="nofollow noopener">Wiki ↗</a></dd></div></dl><p>${escape(q.groupNote)}</p><p>${escape(q.boundary)}</p><div class="detail-actions">${saveButton(r)}${compareButton(r)}</div>`;syncSaved();detail.showModal();};
 const renderCompare=()=>{
  const restoreComparisonFocus=comparison.open&&comparison.contains(document.activeElement);
  const items=[...selected].map(id=>byId.get(id)),tray=find('.compare-tray');tray.hidden=items.length===0;
  find('.compare-selected').replaceChildren(...items.map(r=>{const b=document.createElement('button');b.type='button';b.dataset.compare=r.entityId;b.setAttribute('aria-label',q.removeCompare+' '+r.name);b.textContent=r.name+' ×';return b;}));
  find('.compare-open').textContent=q.compareOpen+' ('+items.length+')';
  index.querySelectorAll('[data-compare]').forEach(b=>{const active=selected.has(b.dataset.compare);b.setAttribute('aria-pressed',String(active));if(!b.closest('.compare-selected'))b.textContent=active?q.removeCompare:q.compare;});
  const shared=items.length?items[0].elements.filter(e=>items.every(r=>r.elements.includes(e))):[];
  const fields=[[q.form,r=>escape(x.formLabels[r.formType])],[q.number,r=>escape(r.entryNo)],[q.elements,r=>r.elements.map(v=>`<span class="index-tag ${shared.includes(v)?'is-shared':'is-different'}">${escape(x.elementLabels[v]||v)}</span>`).join(' ')],[q.roles,r=>tags(r.roles,x.roleLabels)],[q.stage,r=>escape(labelStage(r))],[q.group,r=>escape(r.indexGroupId)]];
  comparison.querySelector('.comparison-content').innerHTML=items.length?`<div class="compare-scroll" tabindex="0" role="region" aria-label="${escape(q.compareOpen)}"><table><thead><tr><th scope="col">${escape(q.details)}</th>${items.map(r=>`<th scope="col">${name(r)}<button type="button" data-compare="${r.entityId}" aria-label="${escape(q.removeCompare+' '+r.name)}">×</button></th>`).join('')}</tr></thead><tbody>${fields.map(([label,get])=>`<tr><th scope="row">${escape(label)}</th>${items.map(r=>`<td>${get(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  if(!items.length&&comparison.open)comparison.close();else if(restoreComparisonFocus)comparison.querySelector('.dialog-close').focus();
 };
 index.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b){const card=event.target.closest('.aniimo-card');if(card&&!event.target.closest('a'))showDetails(card.dataset.entityId,card.querySelector('[data-detail]'));return;}
  if(b.dataset.aniimoSave){collectionState.toggle(b.dataset.aniimoSave);syncSaved();apply();}
  else if(b.dataset.detail)showDetails(b.dataset.detail,b);
  else if(b.dataset.compare){const id=b.dataset.compare;if(selected.has(id)){selected.delete(id);notify(q.removed);}else if(selected.size===3){notify(q.limit);return;}else{selected.add(id);notify(q.added);}renderCompare();}
  else if(b.classList.contains('compare-clear')){selected.clear();renderCompare();search.focus();}
  else if(b.classList.contains('compare-open')){compareOpener=b;renderCompare();comparison.showModal();}
  else if(b.classList.contains('dialog-close'))b.closest('dialog').close();
  else if(b.classList.contains('saved-entry')){resetFilters();collection.value='saved';apply();search.focus();}
  else if(b.dataset.indexView){const table=b.dataset.indexView==='table';index.classList.toggle('is-table',table);index.classList.toggle('is-gallery',!table);index.querySelectorAll('[data-index-view]').forEach(c=>{c.setAttribute('aria-pressed',String(c===b));c.classList.toggle('is-active',c===b);});}
 });
 index.addEventListener('keydown',event=>{const dialog=event.target.closest('dialog[open]');if(event.key!=='Tab'||!dialog)return;const targets=[...dialog.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));const first=targets[0],last=targets.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
 detail.addEventListener('close',()=>{if(detailOpener?.isConnected&&!detailOpener.closest('[hidden]'))detailOpener.focus();else search.focus();});
 comparison.addEventListener('close',()=>{if(!find('.compare-tray').hidden)compareOpener?.focus();else search.focus();});
 index.addEventListener('error',event=>{if(event.target.matches('.aniimo-card img')){event.target.hidden=true;event.target.parentNode.querySelector('.image-placeholder').hidden=false;}},true);
 [search,element,role,group,stage,form,collection].forEach(c=>c.addEventListener(c===search?'input':'change',apply));
 index.querySelectorAll('.index-clear').forEach(b=>b.addEventListener('click',()=>{resetFilters();apply();search.focus();}));
 find('.empty-clear').addEventListener('click',()=>{search.value='';apply();search.focus();});
 syncSaved();apply();renderCompare();index.dataset.ready='true';const linked=/^#entity=(ag-[a-f0-9]{16})$/.exec(location.hash);if(linked&&byId.has(linked[1]))showDetails(linked[1],search);
});
