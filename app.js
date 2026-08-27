const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const toast=(message)=>{const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)};

$('#hero-search').addEventListener('submit',e=>{e.preventDefault();const query=$('#site-search').value.trim().toLowerCase();let matches=0;$$('#guide-list article').forEach(card=>{const hit=!query||card.textContent.toLowerCase().includes(query)||card.dataset.tags.includes(query);card.hidden=!hit;if(hit)matches++});$('#empty-state').hidden=matches>0;$('#guides').scrollIntoView();toast(matches?`找到 ${matches} 篇相關攻略`:'暫時沒有相符結果')});
$$('.hot-search button').forEach(btn=>btn.addEventListener('click',()=>{$('#site-search').value=btn.dataset.search;$('#hero-search').requestSubmit()}));

$$('.filters button').forEach(btn=>btn.addEventListener('click',()=>{$$('.filters button').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');$$('#creature-grid article').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&card.dataset.type!==btn.dataset.filter)}));

let team=[];const renderTeam=()=>{$$('#team-slots button').forEach((slot,i)=>{const member=team[i];slot.textContent=member?.icon||'＋';slot.title=member?.name||`隊伍位置 ${i+1}`;slot.classList.toggle('filled',!!member)})};
$$('#builder-options button').forEach(btn=>btn.addEventListener('click',()=>{if(team.length>=3)return toast('隊伍已滿，先清空或移除成員');if(team.some(x=>x.name===btn.dataset.name))return toast('這隻伊莫已在隊伍中');team.push({name:btn.dataset.name,icon:btn.dataset.icon});renderTeam();toast(`${btn.dataset.name} 已加入隊伍`)}));
$$('#team-slots button').forEach((slot,i)=>slot.addEventListener('click',()=>{if(team[i]){const [removed]=team.splice(i,1);renderTeam();toast(`${removed.name} 已移出隊伍`)}}));
$('#clear-team').addEventListener('click',()=>{team=[];renderTeam();toast('隊伍已清空')});

$('#subscribe').addEventListener('submit',e=>{e.preventDefault();$('#subscribe-message').textContent='訂閱功能已完成介面展示，串接郵件服務後即可正式啟用。';e.target.reset()});
$('.menu-btn').addEventListener('click',()=>toast('手機導覽將在內容頁加入後啟用'));
