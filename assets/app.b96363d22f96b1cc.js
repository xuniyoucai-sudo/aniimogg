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
