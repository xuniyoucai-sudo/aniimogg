document.querySelectorAll('.menu-btn').forEach(button=>button.addEventListener('click',()=>{
  const header=button.closest('.topbar');
  const open=header.classList.toggle('nav-open');
  button.setAttribute('aria-expanded',String(open));
}));
document.addEventListener('click',event=>{
  if(!event.target.closest('.language-switcher')) document.querySelectorAll('.language-switcher[open]').forEach(menu=>menu.removeAttribute('open'));
});
