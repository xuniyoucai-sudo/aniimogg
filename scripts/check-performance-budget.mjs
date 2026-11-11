import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const assets=JSON.parse(fs.readFileSync('assets/asset-manifest.json','utf8')).assets;
const size=file=>fs.statSync(path.join(root,file)).size;
const checks=[
  ['shared CSS',size(assets.styles.file.slice(1))+size(assets.siteContent.file.slice(1))+size(assets.accessibility.file.slice(1)),50_000],
  ['shared JavaScript',size(assets.app.file.slice(1)),20_000],
  ['compendium JavaScript',size(assets.compendium.file.slice(1)),20_000],
  ['compendium total JavaScript',size(assets.app.file.slice(1))+size(assets.compendium.file.slice(1)),20_000],
  ['compendium total CSS',size(assets.styles.file.slice(1))+size(assets.siteContent.file.slice(1))+size(assets.accessibility.file.slice(1))+size(assets.compendiumStyle.file.slice(1)),50_000],
  ['compendium CSS',size(assets.compendiumStyle.file.slice(1)),10_000],
  ['homepage HTML',size('index.html'),75_000],
  ...['','zh-cn/','zh-tw/','ja/'].map(prefix=>[prefix+'compendium HTML',size(prefix+'guides/confirmed-aniimo/index.html'),250_000]),
  ['long guide HTML',size('guides/beginner-mistakes/index.html'),75_000]
];
const failures=[];
for(const [name,bytes,budget] of checks){
  const result=bytes<=budget?'PASS':'FAIL';
  console.log(`${result} ${name}: ${(bytes/1024).toFixed(1)} KiB / ${(budget/1024).toFixed(1)} KiB`);
  if(bytes>budget)failures.push(`${name} exceeds budget by ${bytes-budget} bytes`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
