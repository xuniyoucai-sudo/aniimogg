document.querySelectorAll('.menu-btn').forEach(button=>button.addEventListener('click',()=>{
  const header=button.closest('.topbar');
  const open=header.classList.toggle('nav-open');
  button.setAttribute('aria-expanded',String(open));
}));
document.addEventListener('click',event=>{
  if(!event.target.closest('.language-switcher')) document.querySelectorAll('.language-switcher[open]').forEach(menu=>menu.removeAttribute('open'));
});
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
