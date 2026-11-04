import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const redirects=fs.readFileSync('_redirects','utf8');
for(const prefix of ['', 'zh-cn/', 'zh-tw/', 'ja/']){
  assert.ok(redirects.split('\n').includes(`/${prefix}tools/ /${prefix}launch/ 301`),`${prefix}: legacy tools redirect missing`);
  for(const route of ['', 'launch/', 'tools/']){
    const html=fs.readFileSync(`${prefix}${route}index.html`,'utf8');
    assert.ok(html.includes('class="live-availability'),`${prefix}${route}: static availability missing`);
    assert.ok(!html.includes('data-launch='),`${prefix}${route}: obsolete launch timer`);
  }
  const prereg=fs.readFileSync(`${prefix}guides/pre-registration/index.html`,'utf8');
  const status=prereg.match(/<aside class="evidence-note event-status"[\s\S]*?<\/aside>/)?.[0];
  assert.ok(status?.includes('<a hidden class="event-live-link"'),`${prefix}: expired event link must be hidden without JavaScript`);
  const requirements=fs.readFileSync(`${prefix}guides/system-requirements/index.html`,'utf8');
  assert.ok(requirements.includes('Playable'),`${prefix}: current Deck status missing`);
  for(const slug of ['preorder-bundles','release-date-platforms','server-launch-times','system-requirements','catching-twine','prismana-rare-forms']){
    const html=fs.readFileSync(`${prefix}guides/${slug}/index.html`,'utf8');
    assert.ok(!/preview — not yet live|预告——尚未上线|入手予告——未実装|Steam Deck compatibility remains unconfirmed|Steam Deck 仍未确认|Steam Deckも未確認|Final account-linking and cross-progression rules remain unconfirmed|Follow Steam&#39;s local countdown|上线前应避免的常见误区|発売前に避けたいよくある誤解/i.test(html),`${prefix}${slug}: obsolete launch claim`);
  }
}

// Exercise the actual readiness handler, including the official minimum boundary.
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf("document.querySelectorAll('.readiness-check')");
const end=app.indexOf('\n}));',start)+5;
assert.ok(start>=0&&end>start,'readiness handler not found');
let handler;
const result={dataset:{ready:'PASS',fail:'FAIL'}};
const form={elements:{ram:{value:'8'},space:{value:'40'}},querySelector:()=>result,addEventListener:(event,callback)=>{assert.equal(event,'submit');handler=callback;}};
vm.runInNewContext(app.slice(start,end),{document:{querySelectorAll:()=>[form]}});
for(const [ram,space,expected] of [[8,40,'PASS'],[7,40,'FAIL'],[8,39,'FAIL'],[12,45,'PASS']]){
  form.elements.ram.value=String(ram);form.elements.space.value=String(space);
  handler({preventDefault(){}});
  assert.equal(result.textContent,expected,`readiness ${ram}GB / ${space}GB`);
}
console.log('PASS launch cleanup: static four-language status, expired links hidden without JS, current Deck status and 8GB/40GB readiness boundaries.');
