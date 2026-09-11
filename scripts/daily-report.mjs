import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/site.json'),'utf8'));
const news=JSON.parse(fs.readFileSync(path.join(root,'src/data/news.json'),'utf8'));
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>(https:\/\/aniimogg\.com[^<]+)<\/loc>/g)].map(x=>x[1]);
const guideUpdated=Object.values(data.guideMeta).map(x=>x.updated).sort().at(-1);
const newsUpdated=news.map(x=>x.updated).sort().at(-1);
const checks=[
  ['Generated HTML',`${fs.existsSync(path.join(root,'index.html'))?'PASS':'FAIL'} — homepage present`],
  ['Sitemap',`${urls.length?'PASS':'FAIL'} — ${urls.length} localized URLs`],
  ['Guide images',`${(sitemap.match(/<image:image>/g)||[]).length} entries`],
  ['Latest guide review',guideUpdated],
  ['Latest news review',newsUpdated],
  ['Official Aniimo snapshot',`${JSON.parse(fs.readFileSync(path.join(root,'src/data/aniimo-index.json'),'utf8')).length} entries`]
];
if(process.argv.includes('--live')){
  for(const route of ['/','/launch/','/guides/','/sitemap.xml','/robots.txt']){
    try{const response=await fetch(data.domain+route,{redirect:'manual'});checks.push([`Live ${route}`,`${response.status} · ${response.headers.get('content-type')||'unknown type'}`])}
    catch(error){checks.push([`Live ${route}`,`FAIL · ${error.message}`])}
  }
}
const report=`# Aniimo.GG Daily Execution Report — ${today}\n\n## Automated checks\n\n${checks.map(x=>`- **${x[0]}:** ${x[1]}`).join('\n')}\n\n## External-data status\n\n- Google Search Console: not connected; query and impression analysis requires account access.\n- Cloudflare Analytics: not connected; traffic, cache-hit and Web Vitals analysis requires account access.\n- User search logs: not collected; the current static search does not transmit visitor queries.\n\n## Next launch checks\n\n- Recheck preload and platform unlock notices.\n- Verify launch server names and maintenance notices.\n- Replace Beta-only guidance only after repeatable public-build testing.\n`;
const output=path.join(root,'reports','daily',`${today}.md`);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,report);console.log(report);console.log(`Saved ${path.relative(root,output)}`);
