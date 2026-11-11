document.querySelectorAll('.menu-btn').forEach(button=>button.addEventListener('click',()=>{
  const header=button.closest('.topbar');
  const open=header.classList.toggle('nav-open');
  button.setAttribute('aria-expanded',String(open));
}));
document.addEventListener('click',event=>{
  if(!event.target.closest('.language-switcher')) document.querySelectorAll('.language-switcher[open]').forEach(menu=>menu.removeAttribute('open'));
});
document.querySelectorAll('[data-calendar-end]').forEach(label=>{
  if(Date.now()<Date.parse(label.dataset.calendarEnd)) return;
  label.textContent=label.dataset.calendarEnded;
  label.closest('tr')?.classList.add('announced-round-ended');
});
document.querySelectorAll('[data-event-end]').forEach(alert=>{
  if(Date.now()<Date.parse(alert.dataset.eventEnd)) return;
  const label=alert.querySelector('span');
  const title=alert.querySelector('h2');
  const text=alert.querySelector('p');
  if(label) label.textContent=alert.dataset.expiredLabel||label.textContent;
  if(title) title.textContent=alert.dataset.expiredTitle||title.textContent;
  if(text) text.textContent=alert.dataset.expiredText||text.textContent;
  alert.querySelector('.event-official, .event-live-link')?.setAttribute('hidden','');
  alert.classList.add('is-expired');
});
if(/\/guides\/$/.test(location.pathname)){
  const query=new URLSearchParams(location.search).get('q')?.trim().toLocaleLowerCase()||'';
  if(query){
    const shell=document.querySelector('.listing-shell');
    const groups=[...document.querySelectorAll('.guide-group')];
    let matches=0;
    groups.forEach(group=>{
      let groupMatches=0;
      group.querySelectorAll('.content-grid>a').forEach(card=>{
        const show=card.textContent.toLocaleLowerCase().includes(query);
        card.hidden=!show;
        if(show){matches++;groupMatches++}
      });
      group.hidden=groupMatches===0;
    });
    document.querySelector('.popular-guides')?.setAttribute('hidden','');
    document.querySelector('.index-entry')?.setAttribute('hidden','');
    const lang=document.documentElement.lang;
    const copy=lang==='zh-TW'?['找到 {count} 篇相關攻略','找不到相關攻略','清除搜尋']:lang==='zh-CN'?['找到 {count} 篇相关攻略','没有找到相关攻略','清除搜索']:lang==='ja'?['{count}件の攻略が見つかりました','該当する攻略はありません','検索をクリア']:['Found {count} matching guides','No matching guides found','Clear search'];
    const status=document.createElement('div');
    status.className='guide-search-status';
    status.setAttribute('role','status');
    const message=document.createElement('strong');
    message.textContent=(matches?copy[0].replace('{count}',String(matches)):copy[1])+` — “${query}”`;
    const clear=document.createElement('a');
    clear.href=location.pathname;
    clear.textContent=copy[2];
    const catalogue=document.createElement('a');
    catalogue.href=location.pathname.replace(/guides\/$/,'guides/confirmed-aniimo/');
    catalogue.textContent=lang==='zh-TW'?'在圖鑑尋找伊莫':lang==='zh-CN'?'在图鉴查找伊莫':lang==='ja'?'Aniimo名は図鑑で検索':'Find creature names in the compendium';
    status.append(message,clear,catalogue);
    shell?.querySelector('.lead')?.after(status);
    status.scrollIntoView({block:'center'});
  }
}
document.querySelectorAll('.aniimo-index').forEach(index=>{
  const search=index.querySelector('.index-search');
  const region=index.querySelector('.index-region');
  const element=index.querySelector('.index-element');
  const role=index.querySelector('.index-role');
  const stage=index.querySelector('.index-stage');
  const collection=index.querySelector('.index-collection');
  const rows=[...index.querySelectorAll('tbody tr')];
  const cards=[...index.querySelectorAll('.aniimo-card')];
  const count=index.querySelector('.index-count');
  const empty=index.querySelector('.index-empty');
  const emptySaved=index.querySelector('.index-empty-saved');
  const collectionCount=index.querySelector('.index-collection-count');
  const required=[search,region,element,role,stage,collection,count,empty,emptySaved,collectionCount];
  if(required.some(control=>!control)) { console.error('Aniimo catalogue: required controls missing',index.id); return; }
  const template=index.dataset.showing;
  const saveKey='aniimo-guide-collection-v1';
  const schemaKey='aniimo-guide-collection-v2';
  const legacyToEntity=new Map(cards.map(card=>[card.dataset.aniimoEntry,card.dataset.entityId||card.dataset.aniimoEntry]));
  const entityToLegacy=new Map([...legacyToEntity].map(([legacy,entity])=>[entity,legacy]));
  let saved=new Set();
  const known=new Set(cards.map(card=>card.dataset.aniimoEntry));
  let unknown=[],writable=true,original=null;
  const warning=index.querySelector('.collection-warning');
  const messages={en:['This browser cannot persist this list; changes may last only on this page.','Some older saved IDs are unrecognized and retained.','Saved data is damaged; it is preserved without overwriting.'], 'zh-CN':['当前浏览器无法持久保存，修改可能仅在本页有效。','部分旧收藏编号无法识别，已保留原始记录。','收藏数据损坏，已保留原数据，不会覆盖。'], 'zh-TW':['目前瀏覽器無法持久儲存，變更可能僅在本頁有效。','部分舊收藏編號無法辨識，已保留原始紀錄。','收藏資料損壞，已保留原資料，不會覆寫。'],ja:['このブラウザーでは保存できません。変更はこのページ限りの場合があります。','不明な旧保存IDを削除せず保持しています。','保存データが破損しています。元データを上書きしません。']};
  const copy=messages[document.documentElement.lang]||messages.en;
  const warn=message=>{if(warning){warning.hidden=false;warning.textContent=message;}};
  const persist=()=>{
    if(!writable){warn(copy[0]);return;}
    try{
      const state={version:2,entityIds:[...saved].map(id=>legacyToEntity.get(id)),unrecognizedIds:unknown};
      // Original v1 is retained as a recoverable source; only v2 receives edits.
      localStorage.setItem(schemaKey,JSON.stringify(state));
    }catch(error){writable=false;warn(copy[0]);}
  };
  try{
    const v2=localStorage.getItem(schemaKey);
    original=v2??localStorage.getItem(saveKey);
    const values=JSON.parse(original||'[]');
    let ids;
    if(v2!==null){
      if(values?.version!==2||!Array.isArray(values.entityIds)||!Array.isArray(values.unrecognizedIds)||[...values.entityIds,...values.unrecognizedIds].some(x=>typeof x!=='string'))throw new TypeError('Invalid saved schema');
      ids=[...values.entityIds.map(id=>entityToLegacy.get(id)||id),...values.unrecognizedIds];
    }else{
      if(!Array.isArray(values)||values.some(x=>typeof x!=='string'))throw new TypeError('Invalid legacy list');
      ids=values;
    }
    saved=new Set(ids.filter(id=>known.has(id)));unknown=[...new Set(ids.filter(id=>!known.has(id)))];
    if(unknown.length)warn(copy[1]+' ('+unknown.length+')');
    localStorage.setItem('aniimo-guide-storage-probe','1');localStorage.removeItem('aniimo-guide-storage-probe');
    // Idempotent migration: persist new schema only after validation and a successful write probe.
    if(v2===null&&original!==null)persist();
  }catch(error){writable=false;warn(original!==null?copy[2]:copy[0]);}
  const setSavedCopy=()=>{
    index.querySelectorAll('[data-aniimo-save]').forEach(button=>{
      const isSaved=saved.has(button.dataset.aniimoSave);
      button.setAttribute('aria-pressed',String(isSaved));
      button.classList.toggle('is-saved',isSaved);
      button.querySelector('[aria-hidden="true"]').textContent=isSaved?'★':'☆';
      button.querySelector('.aniimo-save-label').textContent=isSaved?button.dataset.removeText:button.dataset.saveText;
      button.setAttribute('aria-label',(isSaved?button.dataset.removeText:button.dataset.saveText)+' '+(button.dataset.name||button.closest?.('.aniimo-card')?.querySelector('h3')?.textContent.trim()||''));
    });
    collectionCount.textContent=collectionCount.dataset.template.replace('{count}',String(saved.size));
  };
  const apply=()=>{
    const query=search.value.trim().toLowerCase();
    let visible=0;
    const matches=item=>(!query||item.dataset.search.includes(query))&&(!region.value||item.dataset.region===region.value)&&(!element.value||item.dataset.elements.split(' ').includes(element.value))&&(!role.value||item.dataset.roles.split(' ').includes(role.value))&&(!stage.value||item.dataset.stage===stage.value)&&(!collection.value||collection.value==='all'||saved.has(item.dataset.aniimoEntry));
    const visibleKeys=new Set();
    cards.forEach(card=>{
      const show=matches(card);
      card.hidden=!show;
      if(show){visible++;visibleKeys.add(card.dataset.aniimoEntry);}
    });
    rows.forEach(row=>{row.hidden=!visibleKeys.has(row.dataset.aniimoEntry)});
    count.textContent=template.replace('{count}',String(visible));
    empty.hidden=visible!==0||(collection.value==='saved'&&saved.size===0);
    emptySaved.hidden=collection.value!=='saved'||saved.size!==0;
  };
  if(!collectionCount.dataset.template)collectionCount.dataset.template=collectionCount.textContent;
  index.querySelectorAll('[data-aniimo-save]').forEach(button=>{
    button.addEventListener('click',()=>{
      const id=button.dataset.aniimoSave;
      if(saved.has(id))saved.delete(id);else saved.add(id);
      persist();
      setSavedCopy();apply();
    });
  });
  index.querySelectorAll('[data-index-view]').forEach(button=>button.addEventListener('click',()=>{
    const view=button.dataset.indexView;
    index.classList.toggle('is-gallery',view==='gallery');
    index.classList.toggle('is-table',view==='table');
    index.querySelectorAll('[data-index-view]').forEach(control=>{const active=control===button;control.classList.toggle('is-active',active);control.setAttribute('aria-pressed',String(active))});
  }));
  [search,region,element,role,stage,collection].forEach(control=>control.addEventListener(control===search?'input':'change',apply));
  index.querySelector('.index-clear').addEventListener('click',()=>{search.value='';region.value='';element.value='';role.value='';stage.value='';collection.value='all';apply();search.focus()});
  setSavedCopy();apply();
});
document.querySelectorAll('.readiness-check').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  const result=form.querySelector('.check-result');
  if(!form.elements.ram.value||!form.elements.space.value){result.textContent=result.dataset.unknown;result.className='check-result';return;}
  const ready=Number(form.elements.ram.value)>=8&&Number(form.elements.space.value)>=40;
  result.textContent=ready?result.dataset.ready:result.dataset.fail;
  result.className=`check-result ${ready?'is-ready':'is-fail'}`;
}));

// Close navigation from keyboard without leaving stale ARIA state.
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  document.querySelectorAll('.topbar.nav-open').forEach(header=>{header.classList.remove('nav-open');const button=header.querySelector('.menu-btn');button.setAttribute('aria-expanded','false');button.focus();});
  document.querySelectorAll('.language-switcher[open]').forEach(menu=>{menu.removeAttribute('open');menu.querySelector('summary')?.focus();});
});
document.querySelectorAll('[data-code-report="third_party_reported_active"]').forEach(row=>{
  const age=Date.now()-Date.parse(row.dataset.sourceChecked+'T00:00:00Z');
  if(age>Number(row.dataset.freshnessDays)*86400000)row.querySelector('.code-status').textContent=row.dataset.needsRecheck;
});
