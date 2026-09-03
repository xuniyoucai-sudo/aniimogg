document.querySelectorAll('.menu-btn').forEach(button=>button.addEventListener('click',()=>{
  const header=button.closest('.topbar');
  const open=header.classList.toggle('nav-open');
  button.setAttribute('aria-expanded',String(open));
}));
document.addEventListener('click',event=>{
  if(!event.target.closest('.language-switcher')) document.querySelectorAll('.language-switcher[open]').forEach(menu=>menu.removeAttribute('open'));
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
    const copy=lang==='zh-CN'?['找到 {count} 篇相关攻略','没有找到相关攻略','清除搜索']:lang==='ja'?['{count}件の攻略が見つかりました','該当する攻略はありません','検索をクリア']:['Found {count} matching guides','No matching guides found','Clear search'];
    const status=document.createElement('div');
    status.className='guide-search-status';
    status.setAttribute('role','status');
    const message=document.createElement('strong');
    message.textContent=(matches?copy[0].replace('{count}',String(matches)):copy[1])+` — “${query}”`;
    const clear=document.createElement('a');
    clear.href=location.pathname;
    clear.textContent=copy[2];
    status.append(message,clear);
    shell?.querySelector('.lead')?.after(status);
    status.scrollIntoView({block:'center'});
  }
}
document.querySelectorAll('.aniimo-index').forEach(index=>{
  const search=index.querySelector('.index-search');
  const element=index.querySelector('.index-element');
  const role=index.querySelector('.index-role');
  const stage=index.querySelector('.index-stage');
  const rows=[...index.querySelectorAll('tbody tr')];
  const count=index.querySelector('.index-count');
  const empty=index.querySelector('.index-empty');
  const template=index.dataset.showing;
  const apply=()=>{
    const query=search.value.trim().toLowerCase();
    let visible=0;
    rows.forEach(row=>{
      const show=(!query||row.dataset.search.includes(query))&&(!element.value||row.dataset.elements.split(' ').includes(element.value))&&(!role.value||row.dataset.roles.split(' ').includes(role.value))&&(!stage.value||row.dataset.stage===stage.value);
      row.hidden=!show;
      if(show) visible++;
    });
    count.textContent=template.replace('{count}',String(visible));
    empty.hidden=visible!==0;
  };
  [search,element,role,stage].forEach(control=>control.addEventListener(control===search?'input':'change',apply));
  index.querySelector('.index-clear').addEventListener('click',()=>{search.value='';element.value='';role.value='';stage.value='';apply();search.focus()});
});
document.querySelectorAll('.launch-countdown').forEach(box=>{
  const target=new Date(box.dataset.launch);
  const output=box.querySelector('strong');
  box.querySelector('time').textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'short'}).format(target);
  const update=()=>{
    const seconds=Math.max(0,Math.floor((target-Date.now())/1000));
    const days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60);
    output.textContent=seconds?`${days}d ${hours}h ${minutes}m`:'Live now';
  };
  update();setInterval(update,60000);
});
document.querySelectorAll('.readiness-check').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  const result=form.querySelector('.check-result');
  const ready=Number(form.elements.ram.value)>=12&&Number(form.elements.space.value)>=45;
  result.textContent=ready?result.dataset.ready:result.dataset.fail;
  result.className=`check-result ${ready?'is-ready':'is-fail'}`;
}));
