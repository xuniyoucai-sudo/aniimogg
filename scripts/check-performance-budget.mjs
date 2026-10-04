import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const size=file=>fs.statSync(path.join(root,file)).size;
const checks=[
  ['shared CSS',size('styles.css')+size('site-content.css')+size('accessibility.css'),50_000],
  ['shared JavaScript',size('app.js'),20_000],
  ['homepage HTML',size('index.html'),75_000],
  ['compendium HTML',size('guides/confirmed-aniimo/index.html'),250_000],
  ['long guide HTML',size('guides/beginner-mistakes/index.html'),75_000]
];
const failures=[];
for(const [name,bytes,budget] of checks){
  const result=bytes<=budget?'PASS':'FAIL';
  console.log(`${result} ${name}: ${(bytes/1024).toFixed(1)} KiB / ${(budget/1024).toFixed(1)} KiB`);
  if(bytes>budget)failures.push(`${name} exceeds budget by ${bytes-budget} bytes`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
